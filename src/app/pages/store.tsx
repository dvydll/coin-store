export const Store = () => {
  return <>
    <h2 className="text-2xl font-bold underline">Tienda</h2>
    <table>
      <thead>
        <tr>
          <th scope='col'>ID</th>
          <th scope='col'>Nombre</th>
          <th scope='col'>Cantidad</th>
          <th scope='col'>Precio</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th scope='row'>#1</th>
          <td>pack 1</td>
          <td>100</td>
          <td>4.99€</td>
        </tr>
        <tr>
          <th scope='row'>#2</th>
          <td>pack 2</td>
          <td>1000</td>
          <td>14.99€</td>
        </tr>
        <tr>
          <th scope='row'>#3</th>
          <td>pack 3</td>
          <td>5000</td>
          <td>54.99€</td>
        </tr>
      </tbody>
    </table>
  </>
}