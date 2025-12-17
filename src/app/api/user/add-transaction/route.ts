import { connectDB } from "@/lib/mongoose";
import { Transaction } from "@/models/transaction.model";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    await connectDB();
    const { amount, type, category, date, description, userId } =
      await req.json();

    if (!amount || !type || !category || !date || !userId) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const newTransaction = await Transaction.create({
      amount,
      type,
      category,
      date,
      description,
      userId,
    });

    return NextResponse.json(
      {
        message: "Transaction added successfully",
        transaction: newTransaction,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
};
