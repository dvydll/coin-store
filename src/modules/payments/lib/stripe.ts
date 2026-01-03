import Stripe from "stripe";

export const getStripe = (env: CloudflareBindings) =>
	new Stripe(env.STRIPE_SECRET_KEY, {
		apiVersion: "2025-12-15.clover",
		httpClient: Stripe.createFetchHttpClient(),
	});
