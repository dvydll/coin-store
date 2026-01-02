interface Props {
  user: DiscordUser | null
}

export const Admin = ({ user }: Props) => {
  return <>
    <h2 className="text-2xl font-bold underline">{user?.global_name}</h2>
    <p>Configuración</p>
  </>
}