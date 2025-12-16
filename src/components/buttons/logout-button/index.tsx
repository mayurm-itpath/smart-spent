"use client";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/use-app-store";
import { pageRoutes } from "@/utils/constants/routes";
import { signOut } from "next-auth/react";

const LogoutButton = () => {
  const { clearUserInfo } = useAppStore();

  const handleLogout = async () => {
    clearUserInfo();
    await signOut({ callbackUrl: pageRoutes.auth.login });
  };

  return (
    <>
      <Button onClick={handleLogout}>Logout</Button>
    </>
  );
};

export default LogoutButton;
