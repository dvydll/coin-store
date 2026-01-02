import { ROUTES } from "../../routes";

interface Props {
  title?: string;
  user?: DiscordUser;
}

const links = [
  { path: ROUTES.home, label: 'Inicio' },
  { path: ROUTES.store, label: 'Tienda' },
  { path: ROUTES.aboutUs, label: 'Sobre nosotros' },
  // { path: ROUTES.admin, label: 'Configuración' },
] as const

export const Header = ({ title = 'MySite', user }: Props) => {
  return <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
    <h1 className="text-3xl font-bold">{title}</h1>
    <nav style={{ display: 'flex', flexFlow: 'row nowrap', gap: '1rem' }}>
      {links.map(link => <a href={link.path}>{link.label}</a>)}
      {user?.email === 'david.llopislaguna@gmail.com' && <a href={ROUTES.admin}>Configuración</a>}
    </nav>
    {user && <img
      src={user.avatar_url}
      alt={user.username}
      class="mx-auto block h-24 rounded-full sm:mx-0 sm:shrink-0"
    />}
    {user ? <a href={ROUTES.logout}>Cerrar sesión</a> : <a href={ROUTES.login}>Iniciar sesión</a>}
  </header>
}