interface Props {
  title?: string;
}

export const Footer = ({ title = 'MySite' }: Props) => {
  return <footer style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
    <h5>{title}</h5>
    <address style={{ display: 'flex', flexFlow: 'row nowrap', gap: '1rem' }}>
      <a href="./">Inicio</a>
      <a href="./store">Tienda</a>
      <a href="./about">Sobre nosotros</a>
      <a href="./admin">Configuración</a>
    </address>
  </footer>
}