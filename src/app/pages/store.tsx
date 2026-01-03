import Card from "../components/Card";

interface Props {
  products: ProductDb[];
}

export const Store = ({ products }: Props) => {
  return <>
    <h2 class="text-2xl font-bold underline pb-4">Tienda</h2>
    <section class="flex flex-row flex-wrap justify-between px-14 h-full items-center">
      {products.map((item) => <Card key={`item-${item.id}`} item={item} />)}
    </section>
  </>
}