'use client';
import { api } from "@/api/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { pageRoutes } from "@/utils/constants/routes";
import { apiAsyncHandler } from "@/utils/helpers";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { ChevronLeftIcon } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const ResetPasswordForm = () => {
  const resetPasswordValidation = z
    .object({
      newPassword: z
        .string()
        .min(6, "Password must be at least 6 characters long"),
      confirmNewPassword: z
        .string()
        .min(6, "Password must be at least 6 characters long"),
    })
    .refine((data) => data.newPassword === data.confirmNewPassword, {
      message: "Passwords do not match",
      path: ["confirmNewPassword"],
    });

  const params = useParams<{ token: string }>();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof resetPasswordValidation>>({
    resolver: zodResolver(resetPasswordValidation),
    defaultValues: {
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: { newPassword: string; token: string }) => {
      const res = await api.auth.resetPassword({ data });
      return res;
    },
    onSuccess: (res: any) => {
      toast.success(res?.data?.message || "Password reset successful");
      router.push(pageRoutes.auth.login);
    },
    onError: () => {
      toast.error("Failed to reset password");
    },
  });

  const onSubmit = (data: z.infer<typeof resetPasswordValidation>) => {
    apiAsyncHandler(async () => {
      await mutation.mutateAsync({
        newPassword: data.newPassword,
        token: params.token,
      });
    });
  };

  return (
    <>
      <section>
        <div className="container mx-auto">
          <div className="flex min-h-svh w-full justify-center p-6 md:p-10">
            <div className="w-full max-w-sm flex flex-col gap-6">
              <Card className="z-1 w-full sm:max-w-md">
                <CardHeader>
                  <CardTitle>Reset Password</CardTitle>
                  <CardDescription>
                    Enter your new password below to reset your password
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <FieldGroup>
                      <Field>
                        <FieldLabel className="leading-5" htmlFor="newPassword">
                          New Password
                        </FieldLabel>
                        <Input
                          {...register("newPassword")}
                          type="password"
                          id="newPassword"
                          placeholder="Enter your new password"
                        />
                        {errors.newPassword && (
                          <FieldDescription className="text-red-600">
                            {errors.newPassword.message}
                          </FieldDescription>
                        )}
                      </Field>

                      <Field>
                        <FieldLabel
                          className="leading-5"
                          htmlFor="confirmNewPassword"
                        >
                          Confirm New Password
                        </FieldLabel>
                        <Input
                          {...register("confirmNewPassword")}
                          type="password"
                          id="confirmNewPassword"
                          placeholder="Confirm your new password"
                        />
                      </Field>

                      <Field>
                        <Button className="w-full" type="submit">
                          Reset Password
                        </Button>

                        <Button variant={"outline"} className="w-full" asChild>
                          <Link href={pageRoutes.auth.login}>
                            <ChevronLeftIcon className="size-5 transition-transform duration-200 group-hover:-translate-x-0.5" />
                            <span>Back to login</span>
                          </Link>
                        </Button>
                      </Field>
                    </FieldGroup>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ResetPasswordForm;
