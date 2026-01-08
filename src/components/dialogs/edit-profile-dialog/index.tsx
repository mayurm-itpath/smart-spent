"use client";
import { api } from "@/api/api";
import { Button } from "@/components/ui/button";
import { DialogContent, DialogHeader } from "@/components/ui/dialog";
import {
  Field,
  FieldGroup,
} from "@/components/ui/field";
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
import { motion } from "framer-motion";
import FormInput from "@/components/inputs/form-input";

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
  const MotionButton = motion.create(Button);

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
                <FormInput
                  {...register("name")}
                  id="name"
                  label="Name"
                  placeholder="Name"
                  error={errors.name}
                />
                <Field>
                  <MotionButton
                    type="submit"
                    className="shadow-md"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Save Changes
                  </MotionButton>
                </Field>
              </FieldGroup>
            </>
          )}

          {/* Change Password Form */}
          {detailsToChange.changePassword && (
            <>
              <FieldGroup>
                <FormInput
                  {...register("password")}
                  id="password"
                  type="password"
                  label="Current Password"
                  placeholder="Current Password"
                  error={errors.password}
                />
                <FormInput
                  {...register("newPassword")}
                  id="newPassword"
                  type="password"
                  label="New Password"
                  placeholder="New Password"
                  error={errors.newPassword}
                />
                <FormInput
                  {...register("confirmNewPassword")}
                  id="confirmPassword"
                  type="password"
                  label="Confirm Password"
                  placeholder="Confirm Password"
                  error={errors.confirmNewPassword}
                />
                <Field>
                  <MotionButton
                    type="submit"
                    className="shadow-md"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Change Password
                  </MotionButton>
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
