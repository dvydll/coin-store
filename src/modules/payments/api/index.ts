import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import type Stripe from "stripe";
import { z } from "zod";
import { ROUTES } from "../../../routes";
import { getDb } from "../../../services/db-repository";
import { getStripe } from "../lib/stripe";

const schema = z.object({
	id: z.uuidv4(),
});

export const paymentsApi = new Hono<Env>()
	.post("/create", zValidator("form", schema), async (c) => {
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
				userId: typeof user === "string" ? user : user.id,
				packId: product.id,
			},
		});

		return session.url
			? c.redirect(session.url, 303)
			: c.redirect(`${c.env.APP_URL}${ROUTES.cancelPayment}`);
	})
	.post("/stripe/callback", async (c) => {
		const stripe = getStripe(c.env);

		// Raw body necesario para verificar la firma
		let event: Stripe.Event;
		try {
			const sig = c.req.header("stripe-signature");
			const rawBody = await c.req.arrayBuffer();
			event = stripe.webhooks.constructEvent(
				rawBody,
				sig,
				c.env.STRIPE_WEBHOOK_SECRET,
			);
		} catch (err) {
			console.error("⚠️ Webhook signature failed", err);
			return c.text("Webhook Error", 400);
		}

		if (event.type === "checkout.session.completed") {
			const session = event.data.object as Stripe.Checkout.Session;

			const userId = session.metadata?.userId;
			const packId = session.metadata?.packId;
			const amountCents = session.amount_total;
			const currency = session.currency;
			const status = session.status;

			if (!userId || !packId) {
				console.info(`Unhandled event type: ${event.type}`);
				return c.text("Received", 200);
			}

			// Registrar compra en D1
			try {
				const { sql, first } = getDb(c);
				await sql`
        INSERT INTO purchases (id, user_id, product_id, payment_session_id, amount_cents, currency, payment_status)
        VALUES (${crypto.randomUUID()}, ${userId}, ${packId}, ${session.id}, ${amountCents}, ${currency}, ${status})
        `;

				// TODO: migrate db for add column with coins integer
				const p = await first<{
					product_name: string;
				}>`SELECT product_name FROM products WHERE id = ${packId}`;

				if (p) {
					const packValue = Number(p.product_name.replace(" créditos", ""));

					// Actualizar server_coins del usuario
					await sql`UPDATE users SET server_coins = server_coins + ${packValue} WHERE id = ${userId}`;
				}
			} catch (err) {
				console.error(err);
			}
		}

		return c.text("Received", 200);
	});
export default paymentsApi;
