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
import { motion } from "framer-motion";

const DeleteTransactionDialog = ({
  transactionId,
}: {
  transactionId: string;
}) => {
  const queryClient = useQueryClient();
  const MotionButton = motion.create(Button);

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
            <MotionButton
              variant="outline"
              className="shadow-md"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              No
            </MotionButton>
          </DialogClose>
          <DialogClose asChild>
            <MotionButton
              className="shadow-md"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => mutation.mutate(transactionId)}
            >
              Yes
            </MotionButton>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </>
  );
};

export default DeleteTransactionDialog;
