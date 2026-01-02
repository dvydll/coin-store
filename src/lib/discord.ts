import type { Context } from "hono";

export async function getDiscordToken<T>(c: Context<Env>, code: string) {
	const body = new URLSearchParams({
		client_id: c.env.DISCORD_CLIENT_ID,
		client_secret: c.env.DISCORD_CLIENT_SECRET,
		grant_type: "authorization_code",
		code,
		redirect_uri: c.env.DISCORD_REDIRECT_URI,
	});

	const res = await fetch("https://discord.com/api/oauth2/token", {
		method: "POST",
		headers: { "Content-Type": "application/x-www-form-urlencoded" },
		body,
	});
	return res.json<T>();
}

export async function getDiscordUser<T>(accessToken: string) {
	const res = await fetch("https://discord.com/api/users/@me", {
		headers: { Authorization: `Bearer ${accessToken}` },
	});
	return res.json<T>();
}

export function getDiscordAvatarUrl(discordId: string, avatar?: string) {
	if (avatar) {
		const ext = avatar.startsWith("a_") ? "gif" : "png";
		return `https://cdn.discordapp.com/avatars/${discordId}/${avatar}.${ext}`;
	}

	const index = Number(BigInt(discordId) % 5n);
	return `https://cdn.discordapp.com/embed/avatars/${index}.png`;
}
