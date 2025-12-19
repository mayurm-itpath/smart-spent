import Profile from "@/components/profile";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile Page",
  description: "Welcome to the Profile Page",
};

const ProfilePage = () => {
  return (
    <>
      <Profile />
    </>
  );
};

export default ProfilePage;
