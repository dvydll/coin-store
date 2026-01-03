import { ROUTES } from "../../routes";

interface Props<Item extends Product> {
  item: Item;
}

export default function Card<Item extends Product>({ item }: Props<Item>) {
  return <article class="flex flex-col bg-white rounded-3xl">
    <div class="px-6 py-8 sm:p-10 sm:pb-6">
      <div class="grid items-center justify-center w-full grid-cols-1 text-left">
        <div>
          <h2
            class="text-lg font-medium tracking-tighter text-gray-600 lg:text-3xl"
          >
            {item.name}
          </h2>
          <p class="mt-2 text-sm text-gray-500">{item.description}</p>
        </div>
        <div class="mt-6">
          <p>
            <span class="text-5xl font-light tracking-tight text-black">
              {item.currency === 'eur' ? `${item.amount}€` : `$${item.amount}`}
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
          class="flex items-center justify-center w-full px-6 py-2.5 text-center text-white duration-200 bg-black border-2 border-black rounded-full nline-flex hover:bg-transparent hover:border-black hover:text-black focus:outline-none focus-visible:outline-black text-sm focus-visible:ring-black"
        >
          Comprar
        </button>
      </form>
    </div>
  </article>
}