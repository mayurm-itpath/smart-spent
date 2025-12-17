import Transactions from "@/components/transactions";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Transactions Page",
  description: "Welcome to the Transactions Page",
};

const TransactionsPage = () => {
  return (
    <>
      <Transactions />
    </>
  );
};

export default TransactionsPage;
