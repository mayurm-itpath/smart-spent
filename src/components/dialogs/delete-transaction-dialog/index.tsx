"use client";
import { api } from "@/api/api";
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const DeleteTransactionDialog = ({
  transactionId,
}: {
  transactionId: string;
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.transactions.deleteTransactionById({ id });
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      toast.success("Transaction deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete transaction");
    },
  });

  return (
    <>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>
            Do you want to delete this transaction?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">No</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button onClick={() => mutation.mutate(transactionId)}>Yes</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </>
  );
};

export default DeleteTransactionDialog;
