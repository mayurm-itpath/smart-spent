"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAppStore } from "@/store/use-app-store";
import { CircleUserRound } from "lucide-react";
import LogoutButton from "../buttons/logout-button";
import { useState } from "react";
import { Dialog } from "../ui/dialog";
import DeleteAccountDialog from "../dialogs/delete-account-dialog";
import EditProfileDialog from "../dialogs/edit-profile-dialog";
import { motion } from "framer-motion";

const Profile = () => {
  const { userInfo } = useAppStore();
  const user = {
    name: userInfo?.name || "User",
    email: userInfo?.email || "",
  };

  const MotionButton = motion.create(Button);

  const [profileActionsOpen, setProfileActionsOpen] = useState({
    changePassword: false,
    editProfile: false,
    deleteAccount: false,
  });

  const handleEditProfile = () => {
    setProfileActionsOpen({ ...profileActionsOpen, editProfile: true });
  };

  const handleChangePassword = () => {
    setProfileActionsOpen({ ...profileActionsOpen, changePassword: true });
  };

  const handleDeleteAccount = () => {
    setProfileActionsOpen({ ...profileActionsOpen, deleteAccount: true });
  };

  return (
    <>
      <section>
        <div className="max-w-3xl mx-auto p-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>
                Personal details associated with your account.
              </CardDescription>
            </CardHeader>

            <Separator />

            <CardContent className="space-y-6 pt-6">
              <div className="flex items-center justify-between max-sm:flex-col max-sm:items-start max-sm:gap-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-15 w-15">
                    <AvatarFallback>
                      {user?.name?.charAt(0).toUpperCase() || (
                        <CircleUserRound />
                      )}
                    </AvatarFallback>
                  </Avatar>

                  <div>
                    <p className="text-lg font-medium">{user.name}</p>
                    <p className="text-muted-foreground text-sm">
                      {user.email}
                    </p>
                  </div>
                </div>

                <MotionButton
                  variant="outline"
                  className="shadow-md"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleEditProfile}
                >
                  Edit Profile
                </MotionButton>
              </div>

              <Separator />

              <div className="flex flex-col items-baseline gap-3">
                <MotionButton
                  variant={"outline"}
                  className="shadow-md"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleChangePassword}
                >
                  Change Password
                </MotionButton>
                <LogoutButton />
                <MotionButton
                  variant="destructive"
                  className="shadow-md"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDeleteAccount}
                >
                  Delete Account
                </MotionButton>
              </div>
            </CardContent>
          </Card>

          {/* Edit Profile Confirmation Modal */}
          <Dialog
            open={
              profileActionsOpen.editProfile ||
              profileActionsOpen.changePassword
            }
            onOpenChange={(open) =>
              setProfileActionsOpen({
                ...profileActionsOpen,
                editProfile: open,
                changePassword: open,
              })
            }
          >
            <EditProfileDialog
              detailsToChange={profileActionsOpen}
              closeDialog={() =>
                setProfileActionsOpen({
                  ...profileActionsOpen,
                  editProfile: false,
                  changePassword: false,
                })
              }
            />
          </Dialog>

          {/* Delete Account Confirmation Modal */}
          <Dialog
            open={profileActionsOpen.deleteAccount}
            onOpenChange={(open) =>
              setProfileActionsOpen({
                ...profileActionsOpen,
                deleteAccount: open,
              })
            }
          >
            <DeleteAccountDialog />
          </Dialog>
        </div>
      </section>
    </>
  );
};

export default Profile;
