import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { User } from "@/models/user.model";
import { connectDB } from "@/lib/mongoose";
import bcrypt from "bcryptjs";

export const POST = async (req: Request) => {
  try {
    await connectDB();
    const { newPassword, token } = await req.json();

    const decodedToken = jwt.verify(token, process.env.NEXTAUTH_SECRET!) as {
      id: string;
    };

    if (!decodedToken) {
      return NextResponse.json(
        { message: "Invalid or expired token" },
        { status: 400 }
      );
    }

    const user = await User.findById(decodedToken.id);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return NextResponse.json(
      { message: "Password reset successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
};
