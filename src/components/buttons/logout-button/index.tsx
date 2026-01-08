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
import { motion } from "framer-motion";
import { signOut } from "next-auth/react";

const LogoutButton = () => {
  const { clearUserInfo } = useAppStore();
  const MotionButton = motion.create(Button);

  const handleLogout = async () => {
    clearUserInfo();
    await signOut({ callbackUrl: pageRoutes.auth.login });
  };

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <MotionButton
            className="shadow-md"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Logout
          </MotionButton>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>Do you really want to logout?</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <MotionButton
                variant={"outline"}
                className="shadow-md"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                No
              </MotionButton>
            </DialogClose>
            <DialogClose asChild>
              <MotionButton
                className="shadow-md"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
              >
                Yes
              </MotionButton>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LogoutButton;
