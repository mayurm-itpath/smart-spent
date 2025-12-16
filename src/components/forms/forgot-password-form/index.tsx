"use client";
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
                      <Field>
                        <FieldLabel className="leading-5" htmlFor="userEmail">
                          Email address
                        </FieldLabel>
                        <Input
                          {...register("email")}
                          type="email"
                          id="userEmail"
                          placeholder="Enter your email address"
                        />
                        {errors.email && (
                          <FieldDescription className="mt-1 text-sm text-red-600">
                            {errors.email.message}
                          </FieldDescription>
                        )}
                      </Field>

                      <Field>
                        <Button className="w-full" type="submit">
                          Send Reset Link
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

export default ForgotPassword;
