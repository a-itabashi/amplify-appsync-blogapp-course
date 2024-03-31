"use client";
import Link from "next/link";
import { useRecoilValue } from "recoil";
import { authState } from "@/store/authState";
import { usePathname } from "next/navigation";
// import { getAuthenticated } from "@/utils/amplifyServerUtils";
// import { cookies } from "next/headers";

const NAVBAR_LIST = [
  ["Home", "/"],
  ["Profile", "/profile"],
];

const Navbar = () => {
  const isAuthenticated = useRecoilValue(authState);
  // const isAuthenticated = await getAuthenticated({ cookies });
  const pathname = usePathname();
  const checkActivePath = (path: string) => {
    if (path === "/" && pathname !== path) {
      return false;
    }
    return pathname.startsWith(path);
  };
  return (
    <nav className="flex justify-center py-3 space-x-4 border-b bg-cyan-500 border-gray-300">
      {NAVBAR_LIST.map(([title, path]) => (
        <Link
          href={path}
          key={path}
          className={`rounded-lg px-3 py-2 text-slate-700 font-medium hover:bg-slate-100 hover:text-slate-900 ${
            checkActivePath(path) ? "font-extrabold bg-gray-50" : ""
          }`}
        >
          {title}
        </Link>
      ))}
      {isAuthenticated && (
        <>
          <Link
            href="/create-post"
            className={`rounded-lg px-3 py-2 text-slate-700 font-medium hover:bg-slate-100 hover:text-slate-900 ${
              checkActivePath("/create-posts")
                ? "font-extrabold bg-gray-50"
                : ""
            }`}
          >
            Creat Post
          </Link>
          <Link
            href="/posts"
            className={`rounded-lg px-3 py-2 text-slate-700 font-medium hover:bg-slate-100 hover:text-slate-900 ${
              checkActivePath("/posts") ? "font-extrabold bg-gray-50" : ""
            }`}
          >
            Post
          </Link>
        </>
      )}
    </nav>
  );
};

export { Navbar };
