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
    const { searchParams } = new URL(request.url);

    const date = searchParams.get("date");
    const type = searchParams.get("type");
    const category = searchParams.get("category");
    const today = new Date();

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Date filtering logic
    let startDate: Date | null = null;
    if (date === "last-week") {
      startDate = new Date();
      startDate.setDate(today.getDate() - 7);
    } else if (date === "last-month") {
      startDate = new Date();
      startDate.setMonth(today.getMonth() - 1);
    } else if (date === "last-year") {
      startDate = new Date();
      startDate.setFullYear(today.getFullYear() - 1);
    }

    const query = startDate
      ? {
          userId,
          date: { $gte: startDate, $lte: today },
          type: type || { $in: ["income", "expense"] },
          category: category || { $exists: true },
        }
      : {
          userId,
          type: type || { $in: ["income", "expense"] },
          category: category || { $exists: true },
        };

    const transactions = await Transaction.find(query).sort({ date: -1 });

    return NextResponse.json({ transactions }, { status: 200 });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
};
