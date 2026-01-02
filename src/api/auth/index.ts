import { Hono } from "hono";
import { deleteCookie, setCookie } from "hono/cookie";
import { sign } from "hono/jwt";

import {
	getDiscordAvatarUrl,
	getDiscordToken,
	getDiscordUser,
} from "../../lib/discord";

const SESSION_COOKIE_OPTIONS = {
	httpOnly: true,
	secure: true,
	sameSite: "Lax",
	path: "/",
} as const;

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
	.get("/logout", (c) => {
		deleteCookie(c, "auth", SESSION_COOKIE_OPTIONS);
		return c.redirect("/");
	})
	.get("/discord/callback", async (c) => {
		const code = c.req.query("code");
		if (!code) return c.redirect("/login");

		const tokenData = await getDiscordToken<DiscordToken>(c, code);
		const discordUser = await getDiscordUser<DiscordUser>(
			tokenData.access_token,
		);

		// Guardar/actualizar usuario en D1
		// await c.env.DB.prepare(`
		//   INSERT INTO users (id, discord_id, username)
		//   VALUES (?, ?, ?)
		//   ON CONFLICT(discord_id) DO UPDATE SET username = excluded.username
		// `)
		// 	.bind(crypto.randomUUID(), discordUser.id, discordUser.username)
		// 	.run();

		// Crear JWT
		const jwt = await sign(
			{
				sub: discordUser.id,
				discord_user: {
					...discordUser,
					avatar_url: getDiscordAvatarUrl(discordUser.id, discordUser.avatar),
				},
				exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
			},
			c.env.JWT_SECRET,
		);

		setCookie(c, "auth", jwt, {
			...SESSION_COOKIE_OPTIONS,
			maxAge: 60 * 60 * 24 * 7,
		});

		return c.redirect("/");
	});

export default authCtrl;
