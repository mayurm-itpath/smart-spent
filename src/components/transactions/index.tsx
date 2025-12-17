"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EllipsisVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/api";
import { useState } from "react";
import { Dialog } from "../ui/dialog";
import { formatDateToDDMMYYYY } from "@/utils/helpers";
import ViewTransactionDialog from "../dialogs/view-transaction-dialog";
import DeleteTransactionDialog from "../dialogs/delete-transaction-dialog";
import { RadioGroup } from "@radix-ui/react-radio-group";
import { RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";

const Transactions = () => {
  const [transactionActions, setTransactionActions] = useState({
    viewDialog: false,
    deleteDialog: false,
    details: {},
    deleteId: "",
  });

  const { data: transactions } = useQuery({
    queryKey: ["transactions"],
    queryFn: async () => {
      const res: any = await api.transactions.getAllTransactions({});
      return res.data.transactions;
    },
  });

  const handleViewDetails = (transaction: any) => {
    setTransactionActions({
      ...transactionActions,
      details: transaction,
      viewDialog: true,
    });
  };

  const handleDelete = (transactionId: string) => {
    setTransactionActions({
      ...transactionActions,
      deleteId: transactionId,
      deleteDialog: true,
    });
  };

  return (
    <>
      <section>
        <div className="container mx-auto py-[50px]">
          <Card>
            <CardHeader>
              <CardTitle>All Transactions</CardTitle>
            </CardHeader>

            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Amount</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {transactions &&
                    transactions.map((transaction: any) => (
                      <TableRow key={transaction._id}>
                        <TableCell
                          className={
                            transaction.type === "expense"
                              ? "text-red-600"
                              : "text-green-600"
                          }
                        >
                          {transaction.type === "expense" ? "-" : "+"}{" "}
                          {transaction.amount}
                        </TableCell>
                        <TableCell>{transaction.category}</TableCell>
                        <TableCell>
                          {formatDateToDDMMYYYY(new Date(transaction.date))}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant={"ghost"}
                                className="rounded-full"
                              >
                                <EllipsisVertical size={20} />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem
                                onClick={() => handleViewDetails(transaction)}
                              >
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDelete(transaction._id)}
                              >
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Transaction details dialog */}
          <Dialog
            open={transactionActions.viewDialog}
            onOpenChange={(open) =>
              setTransactionActions({ ...transactionActions, viewDialog: open })
            }
          >
            <ViewTransactionDialog transaction={transactionActions.details} />
          </Dialog>

          {/* Delete transaction dialog */}
          <Dialog
            open={transactionActions.deleteDialog}
            onOpenChange={(open) =>
              setTransactionActions({
                ...transactionActions,
                deleteDialog: open,
              })
            }
          >
            <DeleteTransactionDialog
              transactionId={transactionActions.deleteId}
            />
          </Dialog>
        </div>
      </section>
    </>
  );
};

export default Transactions;
