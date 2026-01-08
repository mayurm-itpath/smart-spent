"use client";
import { api } from "@/api/api";
import FormInput from "@/components/inputs/form-input";
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
  FieldGroup,
} from "@/components/ui/field";
import { pageRoutes } from "@/utils/constants/routes";
import { apiAsyncHandler } from "@/utils/helpers";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ChevronLeftIcon } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const ForgotPassword = () => {
  const forgotPasswordValidation = z.object({
    email: z.email("Invalid email address"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof forgotPasswordValidation>>({
    resolver: zodResolver(forgotPasswordValidation),
    defaultValues: {
      email: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof forgotPasswordValidation>) => {
      const res = await api.auth.forgotPassword({ data });
      return res;
    },
    onSuccess: (res: any) => {
      toast.success(res?.data?.message || "Reset link sent to your email");
    },
    onError: () => {
      toast.error("Failed to send reset link");
    },
  });

  const MotionButton = motion.create(Button);

  const onSubmit = (data: z.infer<typeof forgotPasswordValidation>) => {
    apiAsyncHandler(async () => {
      await mutation.mutateAsync(data);
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
                  <CardTitle>Forgot Password?</CardTitle>
                  <CardDescription>
                    Enter your email and we'll send you instructions to reset
                    your password
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  {/* ForgotPassword Form */}
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <FieldGroup>
                      <FormInput
                        {...register("email")}
                        id="userEmail"
                        label="Email Address"
                        type="email"
                        placeholder="Enter Email Address"
                        error={errors.email}
                      />

                      <Field>
                        <MotionButton className="w-full" type="submit">
                          Send Reset Link
                        </MotionButton>

                        <MotionButton
                          variant={"outline"}
                          className="w-full"
                          asChild
                        >
                          <Link href={pageRoutes.auth.login}>
                            <ChevronLeftIcon className="size-5 transition-transform duration-200 group-hover:-translate-x-0.5" />
                            <span>Back to login</span>
                          </Link>
                        </MotionButton>
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

export default ForgotPassword;
