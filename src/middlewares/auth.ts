import type { Context, MiddlewareHandler } from "hono";
import { getCookie } from "hono/cookie";
import { verify } from "hono/jwt";
import { ROUTES } from "../routes";

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
	const token = getCookie(c, "auth");

	if (!token) return c.set("user", null);

	try {
		const payload = await verify(token, c.env.JWT_SECRET);
		if (payload.discord_user)
			c.set("user", payload.discord_user as DiscordUser);
		else c.set("user", null);
	} catch {
		c.set("user", null);
	}
}
