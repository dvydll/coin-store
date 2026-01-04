import type { Context } from "hono";

const createDbUtils = (db: D1Database) => ({
	sql: <T = Record<string, unknown>>(
		strings: TemplateStringsArray,
		...values: unknown[]
	) =>
		db
			.prepare(strings.join("?"))
			.bind(...values)
			.run<T>(),

	query: <T = Record<string, unknown>>(
		strings: TemplateStringsArray,
		...values: unknown[]
	) =>
		db
			.prepare(strings.join("?"))
			.bind(...values)
			.all<T>(),

	first: <T = Record<string, unknown>>(
		strings: TemplateStringsArray,
		...values: unknown[]
	) =>
		db
			.prepare(strings.join("?"))
			.bind(...values)
			.first<T>(),
});

export const getDb = (c: Context<Env>) => createDbUtils(c.env.DB);
