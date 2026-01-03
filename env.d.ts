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

declare interface UserDb<TMetadata = string> {
	id: string;
	discord_id: string | number;
	email: string | null;
	discord_meta: TMetadata | null;
	server_coins: number;
	created_at: number;
	updated_at: number;
	deleted_at: number | null;
}

declare interface ProductDb {
	id: string;
	price_cents: number;
	currency: "eur" | "usd";
	product_name: string;
	product_description: string;
}

declare interface Session<TMetadata = string> {
	id: string;
	user_id: string;
	expires_at: number;
	revoked_at: number | null;
	metadata: TMetadata;
	created_at: number | null;
}

interface Variables {
	user: DiscordUser | UserDb["id"] | null;
}

declare interface Env {
	Variables: Variables;
	Bindings: CloudflareBindings;
}
