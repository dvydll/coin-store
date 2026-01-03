import { Hono } from "hono";
import { hc } from "hono/client";

import auth from "../modules/auth/api";
import payments from "../modules/payments/api";

const api = new Hono<Env>().route("/auth", auth).route("/payments", payments);
export const client = hc<typeof api>("/api");
export default api;
