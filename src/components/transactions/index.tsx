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
import { useQuery, useQueryClient } from "@tanstack/react-query";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "@/utils/constants";

const Transactions = () => {
  const [transactionActions, setTransactionActions] = useState({
    viewDialog: false,
    deleteDialog: false,
    details: {},
    deleteId: "",
  });
  const [transactionFilter, setTransactionFilter] = useState<{
    [key: string]: any;
  }>({});
  const queryClient = useQueryClient();

  const { data: transactions } = useQuery({
    queryKey: ["transactions", transactionFilter],
    queryFn: async () => {
      const res: any = await api.transactions.getAllTransactions({
        data: transactionFilter,
      });
      return res.data.transactions;
    },
  });

  // Handle view details action
  const handleViewDetails = (transaction: any) => {
    setTransactionActions({
      ...transactionActions,
      details: transaction,
      viewDialog: true,
    });
  };

  // Handle delete action
  const handleDelete = (transactionId: string) => {
    setTransactionActions({
      ...transactionActions,
      deleteId: transactionId,
      deleteDialog: true,
    });
  };

  // Handle transaction list filter
  const handleTransactionListFilter = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setTransactionFilter({
      ...transactionFilter,
      params: { ...transactionFilter.params, [e.target.name]: e.target.value },
    });
    queryClient.invalidateQueries({
      queryKey: ["transactions", transactionFilter],
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
              <div className="flex flex-col gap-3">
                <div className="font-semibold">Filter By:</div>

                {/* Transaction Date Filter */}
                <div className="flex items-center gap-2">
                  <div>Date:</div>
                  <RadioGroup
                    defaultValue="all"
                    onValueChange={(value) =>
                      handleTransactionListFilter({
                        target: { value, name: "date" },
                      } as React.ChangeEvent<HTMLInputElement>)
                    }
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="all" id="all" />
                        <Label htmlFor="all">All</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="last-week" id="last-week" />
                        <Label htmlFor="last-week">Last Week</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="last-month" id="last-month" />
                        <Label htmlFor="last-month">Last Month</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="last-year" id="last-year" />
                        <Label htmlFor="last-year">Last Year</Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                {/* Transaction Type Filter */}
                <div className="flex items-center gap-2">
                  <div>Type:</div>
                  <RadioGroup
                    defaultValue=""
                    onValueChange={(value) =>
                      handleTransactionListFilter({
                        target: { value, name: "type" },
                      } as React.ChangeEvent<HTMLInputElement>)
                    }
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="" id="all" />
                        <Label htmlFor="all">All</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="income" id="income" />
                        <Label htmlFor="income">Income</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="expense" id="expense" />
                        <Label htmlFor="expense">Expense</Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                {/* Transaction category Filter */}
                <div className="flex items-center gap-2">
                  <div>Category:</div>
                  <Select
                    defaultValue=""
                    onValueChange={(value) =>
                      handleTransactionListFilter({
                        target: {
                          value: value === "all" ? "" : value,
                          name: "category",
                        },
                      } as React.ChangeEvent<HTMLInputElement>)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      {transactionFilter.params?.type === "income" &&
                        INCOME_CATEGORIES.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}

                      {transactionFilter.params?.type === "expense" &&
                        EXPENSE_CATEGORIES.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator className="my-4" />

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
                  {transactions?.length > 0 ? (
                    transactions.map((transaction: any) => (
                      <TableRow key={transaction._id}>
                        <TableCell
                          className={
                            transaction.type === "expense"
                              ? "text-red-600"
                              : "text-green-600"
                          }
                        >
                          {transaction.type === "expense" ? "-" : "+"}
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
                    ))
                  ) : (
                    <>
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-4">
                          No transactions found.
                        </TableCell>
                      </TableRow>
                    </>
                  )}
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
