import type { Child } from 'hono/jsx';
import { Footer } from '../components/Footer';
import { Header } from '../components/Header';

interface Props {
  title: Parameters<typeof Header>[0]['title'];
  user?: DiscordUser;
  children?: Child;
}

export const Layout = ({ title, user, children }: Props) =>
  <html lang='es-ES'>
    <head>
      <link href="/style.css" rel="stylesheet" />
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
    </head>
    <body>
      <Header title={title} user={user} />
      <main>{children}</main>
      <Footer title={title} />
    </body>
  </html>
