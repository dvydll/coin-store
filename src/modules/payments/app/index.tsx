import { Hono } from "hono";
import LinkButton from "../../../app/components/LinkButton";

export const paymentsApp = new Hono<Env>()
  .get(
    "/success",
    async (c) => c.render(
      <>
        <h2 class="text-2xl font-bold underline">Pago procesado</h2>
        <p>Si el pago fue correcto, tus créditos se añadirán automáticamente.</p>
        <LinkButton href="/store">Volver a la tienda</LinkButton>
      </>
    ),
  )
  .get(
    "/cancel",
    async (c) => c.render(
      <>
        <h2 class="text-2xl font-bold underline">Pago cancelado</h2>
        <p>No se ha realizado ningún cargo.</p>
        <LinkButton href="/store">Volver a la tienda</LinkButton>
      </>
    ),
  );
export default paymentsApp;
