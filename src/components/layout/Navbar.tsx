"use client";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
// import { Auth, Hub } from "aws-amplify/";
import { Hub } from "aws-amplify/utils";
import { getCurrentUser } from "aws-amplify/auth";

const NAVBAR_LIST = [
  ["Home", "/"],
  ["Create Post", "/create-post"],
  ["Profile", "/profile"],
];

const Navbar = () => {
  const [signedUser, setSignedUser] = useState(false);

  const authListener = useCallback(async () => {
    Hub.listen("auth", (data: { payload: { event: string } }) => {
      switch (data.payload.event) {
        case "signIn":
          setSignedUser(true);
          break;
        case "sighOut":
          setSignedUser(false);
          break;
      }
    });
    try {
      await getCurrentUser();
      setSignedUser(true);
    } catch (error) {
      setSignedUser(false);
      console.log(error);
    }
  }, []);

  useEffect(() => {
    authListener();
  }, [authListener]);

  return (
    <nav className="flex justify-center py-3 space-x-4 border-b bg-cyan-500 border-gray-300">
      {NAVBAR_LIST.map(([title, url]) => (
        <Link
          href={url}
          key={url}
          className="rounded-lg px-3 py-2 text-slate-700 font-medium hover:bg-slate-100 hover:text-slate-900"
        >
          {title}
        </Link>
      ))}
      {signedUser && (
        <Link
          href="/my-post"
          className="rounded-lg px-3 py-2 text-slate-700 font-medium hover:bg-slate-100 hover:text-slate-900"
        >
          My post
        </Link>
      )}
    </nav>
  );
};

export { Navbar };
