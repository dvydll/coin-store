import { Hono } from "hono";
import { hc } from "hono/client";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import { sign, verify } from "hono/jwt";
import { getDb } from "../../../services/db-repository";
import { getDiscordToken, getDiscordUser } from "../lib/discord";

const SESSION_COOKIE_OPTIONS = {
	httpOnly: true,
	secure: true,
	sameSite: "Lax",
	path: "/",
} as const;
const ONE_WEEK_IN_SECONDS = 60 * 60 * 24 * 7;

const authCtrl = new Hono<Env>()
	.get("/login", (c) => {
		const params = new URLSearchParams({
			client_id: c.env.DISCORD_CLIENT_ID,
			redirect_uri: c.env.DISCORD_REDIRECT_URI,
			response_type: "code",
			scope: "identify email openid",
		});
		return c.redirect(
			`https://discord.com/api/oauth2/authorize?${params.toString()}`,
		);
	})
	.get("/logout", async (c) => {
		const token = getCookie(c, "session");
		if (!token) return c.redirect("/");
		try {
			const { session_id } = await verify(token, c.env.JWT_SECRET);
			// Revocar sesión en D1
			await c.env.DB.prepare(`
          UPDATE sessions SET revoked_at = ?
          WHERE id = ?
        `)
				.bind(Date.now(), session_id)
				.run();
			deleteCookie(c, "session", SESSION_COOKIE_OPTIONS);
		} catch (error) {
			console.error(error);
		}
		return c.redirect("/");
	})
	.get("/discord/callback", async (c) => {
		const code = c.req.query("code");
		if (!code) return c.redirect("/login");

		const tokenData = await getDiscordToken<DiscordToken>(c, code);
		const {
			id: discordId,
			email,
			...discordUserData
		} = await getDiscordUser<DiscordUser>(tokenData.access_token);

		// Guardar/actualizar usuario en D1
		const { sql, first } = getDb(c);
		const existingUser =
			await first<UserDb>`SELECT id FROM active_users WHERE discord_id = ${discordId}`;

		const userId = existingUser?.id ?? crypto.randomUUID();
		const discordMeta = JSON.stringify(discordUserData);
		await sql`
		  INSERT INTO users (id, discord_id, email, discord_meta)
		  VALUES (${userId}, ${discordId}, ${email}, ${discordMeta})
		  ON CONFLICT(discord_id) DO UPDATE SET discord_meta = ${discordMeta}
		`;

		// Guardar sesión en D1
		const sessionId = crypto.randomUUID();
		const expirationDateUnUnix =
			Math.floor(Date.now() / 1000) + ONE_WEEK_IN_SECONDS;
		const { cf } = c.req.raw;
		// Recovery client request data (IP, browser...)
		const metadata = JSON.stringify({
			ip: c.req.header("cf-connecting-ip"),
			ua: c.req.header("user-agent"),
			country: cf?.country,
			city: cf?.city,
			colo: cf?.colo,
			asn: cf?.asn,
		});
		await sql`
      INSERT INTO sessions (id, user_id, expires_at, metadata)
      VALUES (${sessionId}, ${userId}, ${expirationDateUnUnix}, ${metadata})
    `;

		const jwt = await sign(
			{
				sub: userId,
				session_id: sessionId,
				exp: expirationDateUnUnix,
			},
			c.env.JWT_SECRET,
		);

		setCookie(c, "session", jwt, {
			...SESSION_COOKIE_OPTIONS,
			maxAge: ONE_WEEK_IN_SECONDS,
		});

		return c.redirect("/");
	});

export default authCtrl;
export const authClient = hc<typeof authCtrl>("/api/auth");
