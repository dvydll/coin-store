export const ROUTES = {
	login: "/api/auth/login",
	logout: "/api/auth/logout",
	discordCallback: "/api/auth/discord/callback",
	createPayment: "/api/payments/create",
	successPayment: "/payments/success",
	cancelPayment: "/payments/cancel",
	payments: "/payments",
	home: "/",
	store: "/store",
	aboutUs: "/about",
	admin: "/admin",
	notFound: "/404",
} as const;
