import DiscordAvatar from "../../modules/auth/app/DiscordAvatar";
import { ROUTES } from "../../routes";
import LinkButton from "./LinkButton";

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
    <a href={ROUTES.home}>
      <h1 className="text-3xl font-bold">{title}</h1>
    </a>
    <nav style={{ display: 'flex', flexFlow: 'row nowrap', gap: '1rem' }}>
      {links.map(link => <LinkButton href={link.path}>{link.label}</LinkButton>)}
      {user?.email === 'david.llopislaguna@gmail.com' && <LinkButton href={ROUTES.admin}>Configuración</LinkButton>}
      {user ? <DiscordAvatar user={user} /> : <LinkButton href={ROUTES.login}>Iniciar sesión</LinkButton>}
    </nav>
  </header>
}