"use client";
import { useAppStore } from "@/store/use-app-store";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

const AuthSync = () => {
  const { data: session, status } = useSession();
  const { setUserInfo, userInfo, clearUserInfo } = useAppStore();

  useEffect(() => {
    if (status === "loading") return;

    if (status === "authenticated" && session?.user && !userInfo) {
      setUserInfo(session.user);
    }

    if (status === "unauthenticated" && userInfo) {
      clearUserInfo();
    }
  }, [status, session, setUserInfo, userInfo, clearUserInfo]);

  return null;
};

export default AuthSync;
