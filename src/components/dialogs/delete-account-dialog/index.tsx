"use client";
import { api } from "@/api/api";
import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAppStore } from "@/store/use-app-store";
import { pageRoutes } from "@/utils/constants/routes";
import { apiAsyncHandler } from "@/utils/helpers";
import { useMutation } from "@tanstack/react-query";
import { signOut } from "next-auth/react";
import { toast } from "sonner";

const DeleteAccountDialog = () => {
  const { clearUserInfo } = useAppStore();
  const deleteAccountMutation = useMutation({
    mutationFn: async () => {
      const res: any = await api.user.deleteAccount({});
      return res;
    },
    onSuccess: async (res: any) => {
      clearUserInfo();
      await signOut({ callbackUrl: pageRoutes.auth.login });
      toast.success(res.data.message || "Account deleted successfully.");
    },
    onError: () => {
      toast.error("Failed to delete account.");
    },
  });

  const handleDeleteAccount = () => {
    apiAsyncHandler(async () => {
      await deleteAccountMutation.mutateAsync();
    });
  };

  return (
    <>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>
            Do you want to delete your account?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">No</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button onClick={handleDeleteAccount}>Yes</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </>
  );
};

export default DeleteAccountDialog;
