import Home from "@/components/home";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home Page",
  description: "Welcome to the Home Page",
};

const HomePage = () => {
  return (
    <>
      <Home />
    </>
  );
};

export default HomePage;
