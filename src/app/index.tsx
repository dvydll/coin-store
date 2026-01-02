import { Hono } from 'hono';

import { authMiddleware, requireAuth } from '../middlewares/auth';
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
  .get(ROUTES.store, (c) => c.render(<Store />))
  .get(ROUTES.aboutUs, (c) => c.render(<About />))

  // ruta protegida
  .get(ROUTES.admin, requireAuth(), (c) =>
    c.render(<Admin user={c.get('user')} />)
  )

  .get(ROUTES.notFound, (c) => c.render(<NotFound />))
  .notFound((c) => c.redirect(ROUTES.notFound))

export default app