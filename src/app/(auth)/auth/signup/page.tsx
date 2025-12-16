import AuthForm from "@/components/forms/auth-forms";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Signup Page",
  description: "Welcome to the Signup Page",
};

const SignupPage = () => {
  return (
    <>
      <AuthForm />
    </>
  );
};

export default SignupPage;
