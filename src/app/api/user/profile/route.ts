import { User } from "@/models/user.model";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import { connectDB } from "@/lib/mongoose";

export const PATCH = async (request: Request) => {
  try {
    await connectDB();
    const { name, password, newPassword } = await request.json();
    const session: any = await getServerSession(authOptions);
    const email = session?.user?.email;
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (user.name !== name && name) {
      user.name = name;
      await user.save();
      return NextResponse.json(
        { message: "Profile updated successfully", name: user.name },
        { status: 200 }
      );
    }

    if (password && newPassword) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return NextResponse.json(
          { message: "Current password is incorrect" },
          { status: 400 }
        );
      }

      const isSamePassword = await bcrypt.compare(newPassword, user.password);
      if (isSamePassword) {
        return NextResponse.json(
          {
            message: "New password cannot be the same as the current password",
          },
          { status: 400 }
        );
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      await user.save();
      return NextResponse.json({ message: "Password changed successfully" });
    }

    return NextResponse.json(
      { message: "No changes detected in profile" },
      { status: 400 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "An error occurred while updating the profile" },
      { status: 500 }
    );
  }
};

export const DELETE = async () => {
  try {
    await connectDB();
    const session: any = await getServerSession(authOptions);
    const id = session?.user?.id;

    if (!id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await User.findByIdAndDelete(id);

    return NextResponse.json(
      { message: "User account deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "An error occurred while deleting the account" },
      { status: 500 }
    );
  }
};
