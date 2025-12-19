"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
      <Dialog>
        <DialogTrigger asChild>
          <Button>Logout</Button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>Do you really want to logout?</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant={"outline"}>No</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button onClick={handleLogout}>Yes</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LogoutButton;
