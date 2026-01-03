import type { Context, MiddlewareHandler } from "hono";
import { getCookie } from "hono/cookie";
import { verify } from "hono/jwt";
import { ROUTES } from "../routes";

interface SessionWithUser<TMetadata = string> {
	id: string;
	user_id: string;
	expires_at: number;
	revoked_at: number | null;
	uid: string | number;
	discord_id: string | number;
	email: string | null;
	discord_meta: TMetadata | null;
	server_coins: number;
}

export const authMiddleware = (): MiddlewareHandler<Env> => async (c, next) => {
	await getUserFromCookie(c);
	await next();
};

export const requireAuth = (): MiddlewareHandler<Env> => async (c, next) => {
	const user = c.get("user");
	if (!user) return c.redirect(ROUTES.login);
	await next();
};

async function getUserFromCookie(c: Context<Env>) {
	const token = getCookie(c, "session");

	if (!token) return c.set("user", null);

	try {
		const { session_id } = await verify(token, c.env.JWT_SECRET);

		// Buscar la sesión en la DB (revocada o expirada)
		const session = await c.env.DB.prepare(`
      SELECT s.id, s.user_id, s.expires_at, s.revoked_at, u.id AS uid,
             u.discord_id, u.email, u.discord_meta, u.server_coins
      FROM sessions s
      JOIN active_users u ON u.id = s.user_id
      WHERE s.id = ?
    `)
			.bind(session_id)
			.first<SessionWithUser>();

		if (!session) throw new Error("Session not found");
		else if (session.revoked_at) throw new Error("Session revoked");
		else if (session.expires_at < Math.floor(Date.now() / 1000))
			throw new Error("Session expired");

		// Inyectar user en context
		console.log({ session });
		if (session.discord_meta)
			c.set("user", {
				id: session.discord_id,
				email: session.email,
				...JSON.parse(session.discord_meta),
			} as DiscordUser);
		else c.set("user", session.user_id);
	} catch {
		c.set("user", null);
	}
}
