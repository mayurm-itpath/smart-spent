import Dashboard from "@/components/dashboard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard Page",
  description: "Welcome to the Dashboard Page",
};

const DashboardPage = () => {
  return (
    <>
      <Dashboard />
    </>
  );
};

export default DashboardPage;
