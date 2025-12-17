import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatDateToDDMMYYYY } from "@/utils/helpers";

interface ViewTransactionDialogProps {
  transaction: any;
}

const ViewTransactionDialog = ({ transaction }: ViewTransactionDialogProps) => {
  return (
    <>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Transaction</DialogTitle>
        </DialogHeader>

        <div>
          <div>Amount: {transaction.type === "expense" ? "-" : "+"} {transaction.amount}</div>
          <div>Category: {transaction.category}</div>
          <div>Description: {transaction.description}</div>
          <div>Date: {formatDateToDDMMYYYY(new Date(transaction.date))}</div>
        </div>
      </DialogContent>
    </>
  );
};

export default ViewTransactionDialog;
