import AddTransactionForm from "@/components/forms/add-transaction-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Add Transaction Page",
  description: "Welcome to the Add Transaction Page",
};

const AddTransactionPage = () => {
  return (
    <>
      <AddTransactionForm />
    </>
  );
};

export default AddTransactionPage;
