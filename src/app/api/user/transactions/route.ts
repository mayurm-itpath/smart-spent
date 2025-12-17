import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { NextRequest, NextResponse } from "next/server";
import { Transaction } from "@/models/transaction.model";
import { connectDB } from "@/lib/mongoose";

export const GET = async (request: NextRequest) => {
  try {
    await connectDB();
    const session: any = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const transactions = await Transaction.find({ userId }).sort({ date: -1 });

    return NextResponse.json(
      { transactions },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
};
