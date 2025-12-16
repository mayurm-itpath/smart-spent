import ResetPasswordForm from "@/components/forms/reset-password-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Password Page",
  description: "Welcome to the Reset Password Page",
};

const ResetPasswordPage = () => {
  return (
    <>
      <ResetPasswordForm />
    </>
  );
};

export default ResetPasswordPage;
