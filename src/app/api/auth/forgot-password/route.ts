import { User } from "@/models/user.model";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { sendEmail } from "@/utils/helpers/send-email";
import { connectDB } from "@/lib/mongoose";

export const POST = async (req: Request) => {
  try {
    await connectDB();
    const { email } = await req.json();
    const user = await User.findOne({ email });

    if (!user || !user.password) {
      return NextResponse.json(
        { message: "User not found or can't reset password" },
        { status: 404 }
      );
    }

    const resetToken = jwt.sign(
      { id: user._id.toString() },
      process.env.NEXTAUTH_SECRET!,
      { expiresIn: "5m" }
    );

    const resetUrl = `${process.env.FRONTEND_URL}/auth/reset-password/${resetToken}`;

    await sendEmail({
      to: user.email,
      subject: "Password Reset Request",
      htm: `
        <p>You requested a password reset.</p>
        <p>Click <a href="${resetUrl}">here</a> to reset your password.</p>
        <p>This link is valid for 5 minutes.</p>
      `,
    });

    return NextResponse.json(
      { message: "Password reset email sent" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
};
