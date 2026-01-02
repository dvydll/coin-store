declare interface DiscordToken {
	token_type: string;
	access_token: string;
	expires_in: number;
	refresh_token: string;
	scope: string;
	id_token: string;
}

interface AvatarDecorationData {
	asset: string;
	sku_id: string;
	expires_at: number;
}

declare interface DiscordUser {
	id: string;
	username: string;
	avatar: string;
	avatar_url: string;
	discriminator: string;
	public_flags: number;
	flags: number;
	banner: unknown;
	accent_color: number;
	global_name: string;
	avatar_decoration_data: AvatarDecorationData;
	collectibles: unknown;
	display_name_styles: unknown;
	banner_color: string;
	clan: unknown;
	primary_guild: unknown;
	mfa_enabled: boolean;
	locale: string;
	premium_type: number;
	email: string;
	verified: boolean;
}

interface Variables {
	user: DiscordUser | null;
}

interface Bindings {
	DB: D1Database;
	DISCORD_CLIENT_ID: string;
	DISCORD_CLIENT_SECRET: string;
	DISCORD_REDIRECT_URI: string;
	JWT_SECRET: string;
	STRIPE_SECRET_KEY: string;
	STRIPE_WEBHOOK_SECRET: string;
	ASSETS: Fetcher;
}

declare interface Env {
	Variables: Variables;
	Bindings: Bindings;
}
