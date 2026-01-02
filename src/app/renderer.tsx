import { jsxRenderer } from 'hono/jsx-renderer';
import { Layout } from "../app/layout/Layout";

export const renderer = jsxRenderer(({ children }, c) =>
  <Layout title='Coin Store' user={c.get('user')}>
    {children}
  </Layout>
)
