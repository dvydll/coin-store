import { ROUTES } from "../../../routes";
import { getDiscordAvatarUrl } from "../lib/discord";

const STATUS_COLORS = {
  online: "bg-green-500",
  idle: "bg-yellow-400",
  dnd: "bg-red-500",
  offline: "bg-gray-500",
  none: ""
} as const;

interface Props {
  user: DiscordUser;
  size?: number,
  status?: keyof typeof STATUS_COLORS // online | idle | dnd | offline | none
  onClick?: (event: MouseEvent) => void,
}

export default function DiscordAvatar({ user, size = 48 }: Props) {
  const { id, avatar, avatar_decoration_data, global_name } = user;
  const avatarUrl = getDiscordAvatarUrl(id, avatar);
  const decorationUrl = avatar_decoration_data?.asset
    ? `https://cdn.discordapp.com/avatar-decoration-presets/${avatar_decoration_data.asset}.png`
    : null;

  return (
    <>
      <div
        className="relative"
        style={{ width: size, height: size }}
        title={global_name}
      >
        {/* Avatar base */}
        <button
          id="avatar-btn"
          type="button"
          className="absolute inset-0 p-1 z-10 cursor-pointer"

        >
          <img
            src={avatarUrl}
            alt={`Avatar de ${global_name}`}
            className="w-full h-full rounded-full"
            draggable={false}
          />
        </button>

        {/* Marco */}
        {decorationUrl && (
          <img
            src={decorationUrl}
            alt="discord avatar decoration"
            className="absolute z-20 w-full h-full pointer-events-none"
            draggable={false}
          />
        )}

      </div>
      {/* Dropdown */}
      <a
        id="avatar-dropdown"
        href={ROUTES.logout}
        className="absolute right-0 mt-10 bg-gray-800 text-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50 px-4 py-2 hover:bg-gray-700 transition hidden"
      >
        Cerrar sesión
      </a>
    </>
  );
}