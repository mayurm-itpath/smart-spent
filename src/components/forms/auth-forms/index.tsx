"use client";

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
import { loginValidation, signupValidation } from "@/utils/validations";
import Link from "next/link";
import { FaGoogle } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/api/api";
import { signIn } from "next-auth/react";
import { apiAsyncHandler } from "@/utils/helpers";
import { toast } from "sonner";
import { motion } from "framer-motion";
import FormInput from "@/components/inputs/form-input";

interface AuthFormProps {
  isLogin?: boolean;
}

interface AuthFormData {
  name?: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

const AuthForm = ({ isLogin = false }: AuthFormProps) => {
  const validationSchema = isLogin ? loginValidation : signupValidation;
  const router = useRouter();

  const MotionButton = motion.create(Button);

  const initialFormData: AuthFormData = isLogin
    ? {
        email: "",
        password: "",
      }
    : {
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthFormData>({
    resolver: zodResolver(validationSchema),
    defaultValues: initialFormData,
  });

  const credentialsMutation = useMutation({
    mutationFn: async (data: AuthFormData) => {
      const res: any = isLogin
        ? signIn("credentials", { ...data, redirect: false })
        : api.auth.signup({ data });
      return res;
    },
    onSuccess: (res: any) => {
      if (isLogin) {
        if (res?.ok) {
          toast.success("Logged in successfully");
          router.push(pageRoutes.user.dashboard);
          router.refresh();
        } else {
          toast.error("Login failed. Please check your credentials.");
        }
      } else {
        if (res?.status === 201) {
          toast.success("Account created successfully. Please login.");
          router.push(pageRoutes.auth.login);
        } else {
          toast.error("Signup failed. Please try again.");
        }
      }
    },
  });

  const onSubmit = async (formData: AuthFormData) => {
    apiAsyncHandler(async () => {
      await credentialsMutation.mutateAsync(formData);
    });
  };

  const handleGoogleAuth = async () => {
    try {
      await signIn("google", {
        callbackUrl: pageRoutes.user.dashboard,
      });
      toast.success("Logged in with Google successfully");
    } catch (error) {
      toast.error("Google authentication failed. Please try again.");
    }
  };

  return (
    <>
      <section>
        <div className="container mx-auto">
          <div className="flex min-h-svh w-full justify-center p-6 md:p-10">
            <div className="w-full max-w-sm">
              <div className="flex flex-col gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {isLogin ? "Login to your account" : "Create an account"}
                    </CardTitle>
                    <CardDescription>
                      {isLogin
                        ? "Enter your email below to login to your account"
                        : "Enter your information below to create your account"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)}>
                      <FieldGroup>
                        {!isLogin && (
                          <FormInput
                            {...register("name")}
                            id="name"
                            label="Name"
                            placeholder="Name"
                            error={errors.name}
                          />
                        )}
                        <FormInput
                          {...register("email")}
                          id="email"
                          label="Email"
                          type="email"
                          placeholder="Email"
                          error={errors.email}
                        />
                        <Field>
                          <div className="flex items-center">
                            <FieldLabel htmlFor="password">Password</FieldLabel>
                            {isLogin && (
                              <Link
                                href={pageRoutes.auth.forgotPassword}
                                className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                              >
                                Forgot your password?
                              </Link>
                            )}
                          </div>
                          <motion.div
                            animate={
                              errors.password && { x: [-4, 4, -4, 4, 0] }
                            }
                            transition={{ duration: 0.4 }}
                          >
                            <Input
                              {...register("password")}
                              id="password"
                              type="password"
                              placeholder="Password"
                            />
                          </motion.div>
                          {errors.password && (
                            <FieldDescription className="text-red-600">
                              {errors.password.message}
                            </FieldDescription>
                          )}
                        </Field>
                        {!isLogin && (
                          <FormInput
                            {...register("confirmPassword")}
                            id="confirm-password"
                            label="Confirm Password"
                            type="password"
                            placeholder="Confirm Password"
                            error={errors.confirmPassword}
                          />
                        )}
                        <Field>
                          <MotionButton
                            type="submit"
                            className="shadow-md"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {isLogin ? "Login" : "Sign up"}
                          </MotionButton>

                          <MotionButton
                            variant="outline"
                            type="button"
                            className="shadow-md"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleGoogleAuth}
                          >
                            <FaGoogle />{" "}
                            {isLogin
                              ? "Login with Google"
                              : "Sign up with Google"}
                          </MotionButton>

                          <FieldDescription className="text-center">
                            {isLogin ? (
                              <span>
                                {"Don't have an account? "}
                                <Link
                                  href={pageRoutes.auth.signup}
                                  className="underline underline-offset-4"
                                >
                                  Sign up
                                </Link>
                              </span>
                            ) : (
                              <span>
                                {"Already have an account? "}
                                <Link
                                  href={pageRoutes.auth.login}
                                  className="underline underline-offset-4"
                                >
                                  Login
                                </Link>
                              </span>
                            )}
                          </FieldDescription>
                        </Field>
                      </FieldGroup>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AuthForm;
