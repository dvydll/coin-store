import { Hono } from 'hono';

import api from './api';
import web from './app';

const app = new Hono<Env>()
  .route('/', web)
  .route('/api', api)
  .notFound((c) => c.text('Not found', 404));

export default app
