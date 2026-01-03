import { Hono } from 'hono';

import { authMiddleware, requireAuth } from '../middlewares/auth';
import paymentsApp from '../modules/payments/app';
import { ROUTES } from '../routes';
import { NotFound } from "./pages/404";
import { About } from "./pages/about";
import { Admin } from "./pages/admin";
import { Home } from "./pages/home";
import { Store } from "./pages/store";
import { renderer } from './renderer';

const app = new Hono<Env>()
  .use(renderer)

  // resuelve usuario en TODAS las requests
  .use(authMiddleware())

  // rutas públicas (pages)
  .get(ROUTES.home, (c) => c.render(<Home />))
  .get(ROUTES.store, async (c) => {
    const d1Result = await c.env.DB.prepare(
      "SELECT * from active_products",
    )
      .run<ProductDb>();
    return c.render(<Store products={d1Result.results} />)
  })
  .get(ROUTES.aboutUs, (c) => c.render(<About />))
  .route(ROUTES.payments, paymentsApp)

  // ruta protegida
  .get(ROUTES.admin, requireAuth(), (c) =>
    c.render(<Admin user={c.get('user')} />)
  )

  .get(ROUTES.notFound, (c) => c.render(<NotFound />))
  .notFound((c) => c.redirect(ROUTES.notFound))

export default app