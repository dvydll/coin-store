interface Props {
  user: Env["Variables"]["user"]
}

export const Admin = ({ user }: Props) => {
  return <>
    <h2 className="text-2xl font-bold underline">{typeof user === 'string' ? user : user?.global_name}</h2>
    <p>Configuración</p>
  </>
}