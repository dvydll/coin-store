import { ROUTES } from "../../routes";

interface Props<Item extends ProductDb> {
  item: Item;
}

export default function Card<Item extends ProductDb>({ item }: Props<Item>) {
  return <article class="flex flex-col bg-white rounded-3xl hover:scale-105 transition-transform">
    <div class="px-6 py-8 sm:p-10 sm:pb-6">
      <div class="grid items-center justify-center w-full grid-cols-1 text-left">
        <div>
          <h2
            class="text-lg font-medium tracking-tighter text-gray-600 lg:text-3xl"
          >
            {item.product_name}
          </h2>
          <p class="mt-2 text-sm text-gray-500">{item.product_description}</p>
        </div>
        <div class="mt-6">
          <p>
            <span class="text-5xl font-light tracking-tight text-black">
              {item.currency === 'eur' ? `${item.price_cents}€` : `$${item.price_cents}`}
            </span>
            <span class="text-base font-medium text-gray-500"> /mo </span>
          </p>
        </div>
      </div>
    </div>
    <div class="flex px-6 pb-8 sm:px-8">
      <form action={ROUTES.createPayment} method="post">
        <input type="hidden" name="id" value={item.id} />
        <button
          type="submit"
          aria-describedby="tier-company"
          class="flex items-center justify-center w-full px-6 py-2.5 text-center text-gray-50 duration-200 bg-gray-900 border-2 border-gray-950 rounded-full nline-flex hover:bg-transparent hover:border-b-gray-900 hover:text-gray-950 focus:outline-none focus-visible:outline-gray-900 text-sm focus-visible:ring-gray-950 cursor-pointer"
        >
          Comprar
        </button>
      </form>
    </div>
  </article>
}