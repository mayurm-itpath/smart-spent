import AuthForm from "@/components/forms/auth-forms";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login Page",
  description: "Welcome to the Login Page",
};

const LoginPage = () => {
  return (
    <>
      <AuthForm isLogin={true} />
    </>
  );
};

export default LoginPage;
