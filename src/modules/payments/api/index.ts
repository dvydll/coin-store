import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import { ROUTES } from "../../../routes";
import { getStripe } from "../lib/stripe";

const schema = z.object({
	id: z.uuidv4(),
});

export const paymentsApi = new Hono<Env>().post(
	"/create",
	zValidator("form", schema),
	async (c) => {
		const { id } = c.req.valid("form");

		const user = c.get("user");
		if (!user) return c.redirect(ROUTES.login);

		const d1Result = await c.env.DB.prepare(
			"SELECT * from products WHERE id = ?",
		)
			.bind(id)
			.run<ProductDb>();

		if (!d1Result.success)
			return c.redirect(`${c.env.APP_URL}${ROUTES.cancelPayment}`);

		const [product] = d1Result.results;
		const stripe = getStripe(c.env);

		const session = await stripe.checkout.sessions.create({
			mode: "payment",
			line_items: [
				{
					price_data: {
						currency: product.currency,
						product_data: {
							name: product.product_name,
							description: product.product_description,
						},
						unit_amount: product.price_cents,
					},
					quantity: 1,
				},
			],
			success_url: `${c.env.APP_URL}${ROUTES.successPayment}?session_id={CHECKOUT_SESSION_ID}`,
			cancel_url: `${c.env.APP_URL}${ROUTES.cancelPayment}`,
			metadata: {
				userId: user.id,
				packId: product.id,
			},
		});

		return session.url
			? c.redirect(session.url, 303)
			: c.redirect(`${c.env.APP_URL}${ROUTES.cancelPayment}`);
	},
);
export default paymentsApi;
