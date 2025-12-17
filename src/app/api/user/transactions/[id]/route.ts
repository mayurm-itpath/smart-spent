import { connectDB } from "@/lib/mongoose";
import { Transaction } from "@/models/transaction.model";
import { NextRequest, NextResponse } from "next/server";

// Get transaction by ID
export const GET = async (
  request: NextRequest,
  context: { params: { id: string } }
) => {
  try {
    await connectDB();
    const idFromParams = context?.params?.id;
    const idFromQuery = request.nextUrl?.searchParams?.get("id");
    const pathname = request.nextUrl?.pathname || new URL(request.url).pathname;
    const idFromPath = pathname.split("/").filter(Boolean).pop();

    const id = idFromParams || idFromQuery || idFromPath;

    const transaction = await Transaction.findById(id);

    if (!transaction) {
      return NextResponse.json(
        { message: "Transaction not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ transaction }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
};

// Delete transaction by ID
export const DELETE = async (
  request: NextRequest,
  context: { params: { id: string } }
) => {
  try {
    await connectDB();
    const idFromParams = context?.params?.id;
    const idFromQuery = request.nextUrl?.searchParams?.get("id");
    const pathname = request.nextUrl?.pathname || new URL(request.url).pathname;
    const idFromPath = pathname.split("/").filter(Boolean).pop();

    const id = idFromParams || idFromQuery || idFromPath;

    const transaction = await Transaction.findByIdAndDelete(id);

    if (!transaction) {
      return NextResponse.json(
        { message: "Transaction not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Transaction deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
};
