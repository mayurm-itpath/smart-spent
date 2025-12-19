"use client";
import { api } from "@/api/api";
import { Button } from "@/components/ui/button";
import { DialogContent, DialogHeader } from "@/components/ui/dialog";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useAppStore } from "@/store/use-app-store";
import { apiAsyncHandler } from "@/utils/helpers";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogTitle } from "@radix-ui/react-dialog";
import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

interface EditProfileDialogProps {
  detailsToChange: any;
  closeDialog: () => void;
}

const editProfileValidation = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
});

const changePasswordValidation = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters long"),
    newPassword: z
      .string()
      .min(6, "New Password must be at least 6 characters long"),
    confirmNewPassword: z
      .string()
      .min(6, "Confirm New Password must be at least 6 characters long"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "New Password and Confirm New Password must match",
    path: ["confirmNewPassword"],
  });

const EditProfileDialog = ({
  detailsToChange,
  closeDialog,
}: EditProfileDialogProps) => {
  const { userInfo, setUserInfo } = useAppStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: detailsToChange.editProfile
      ? { name: "" }
      : { password: "", newPassword: "", confirmNewPassword: "" },
    resolver: zodResolver(
      detailsToChange.editProfile
        ? editProfileValidation
        : changePasswordValidation
    ),
  });
  const router = useRouter();
  const { update } = useSession();

  const editProfileMutation = useMutation({
    mutationFn: async (data: any) => {
      const res: any = await api.user.updateUserProfile({ data });
      return res;
    },
    onSuccess: async (res: any) => {
      await update({ name: res.data.name });
      setUserInfo({ ...userInfo, name: res.data.name });
      toast.success(
        res.data.message ||
          (detailsToChange.editProfile
            ? "Profile updated successfully."
            : "Password changed successfully.")
      );
      closeDialog();
      router.refresh();
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to update profile.");
    },
  });

  const onSubmit = (data: any) => {
    apiAsyncHandler(async () => {
      await editProfileMutation.mutateAsync(data);
    });
  };

  useEffect(() => {
    reset(
      detailsToChange.editProfile
        ? { name: userInfo?.name || "" }
        : { password: "", newPassword: "", confirmNewPassword: "" }
    );
  }, [
    detailsToChange.editProfile,
    detailsToChange.changePassword,
    userInfo,
    reset,
  ]);

  return (
    <>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {detailsToChange.editProfile ? "Edit Profile" : "Change Password"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Edit Profile Form */}
          {detailsToChange.editProfile && (
            <>
              <FieldGroup>
                <Field>
                  <FieldLabel>Name</FieldLabel>
                  <Input {...register("name")} placeholder="Name" />
                  {errors.name && (
                    <FieldDescription className="text-red-500">
                      {errors.name.message}
                    </FieldDescription>
                  )}
                </Field>
                <Field>
                  <Button type="submit">Save Changes</Button>
                </Field>
              </FieldGroup>
            </>
          )}

          {/* Change Password Form */}
          {detailsToChange.changePassword && (
            <>
              <FieldGroup>
                <Field>
                  <FieldLabel>Current Password</FieldLabel>
                  <Input
                    {...register("password")}
                    type="password"
                    placeholder="Current Password"
                  />
                  {errors.password && (
                    <FieldDescription className="text-red-500">
                      {errors.password.message}
                    </FieldDescription>
                  )}
                </Field>
                <Field>
                  <FieldLabel>New Password</FieldLabel>
                  <Input
                    {...register("newPassword")}
                    type="password"
                    placeholder="New Password"
                  />
                  {errors.newPassword && (
                    <FieldDescription className="text-red-500">
                      {errors.newPassword.message}
                    </FieldDescription>
                  )}
                </Field>
                <Field>
                  <FieldLabel>Confirm New Password</FieldLabel>
                  <Input
                    {...register("confirmNewPassword")}
                    type="password"
                    placeholder="Confirm New Password"
                  />
                  {errors.confirmNewPassword && (
                    <FieldDescription className="text-red-500">
                      {errors.confirmNewPassword.message}
                    </FieldDescription>
                  )}
                </Field>
                <Field>
                  <Button type="submit">Change Password</Button>
                </Field>
              </FieldGroup>
            </>
          )}
        </form>
      </DialogContent>
    </>
  );
};

export default EditProfileDialog;
