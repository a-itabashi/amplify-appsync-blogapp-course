"use client";
import { useAuthHook } from "@/hooks/useAuthHook";

const AuthListener = () => {
  useAuthHook();

  return null;
};

export { AuthListener };
