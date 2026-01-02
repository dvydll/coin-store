import { Hono } from "hono";
import { hc } from "hono/client";

import authCtrl from "./auth";

const api = new Hono<Env>().route("/auth", authCtrl);
export const client = hc<typeof api>("/api");
export default api;
