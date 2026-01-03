import type { PropsWithChildren } from "hono/jsx";

interface LinkButtonProps {
  href: string;
}

export default function LinkButton({ href, children }: PropsWithChildren<LinkButtonProps>) {
  return <a
    href={href}
    className="bg-gray-800 text-white text-center rounded-md shadow-lg ring-1 ring-black ring-opacity-5 px-4 py-2 hover:bg-gray-700 transition"
  >
    {children}
  </a>
}