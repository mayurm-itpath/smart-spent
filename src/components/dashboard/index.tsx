"use client";

import { api } from "@/api/api";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { formatDateToDDMMYYYY } from "@/utils/helpers";
import Link from "next/link";
import { pageRoutes } from "@/utils/constants/routes";
import TransactionsTableSkeleton from "../skeletons/transactions-table-skeleton";

const Dashboard = () => {
  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ["transactions"],
    queryFn: async () => {
      const res: any = await api.transactions.getAllTransactions({});
      return res.data.transactions;
    },
  });

  const isWithinRange = (date: string, days: number) => {
    const now = new Date();
    const d = new Date(date);
    const diff = (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24);
    return diff <= days;
  };

  const pastWeek = transactions.filter((t: any) => isWithinRange(t.date, 7));
  const pastMonth = transactions.filter((t: any) => isWithinRange(t.date, 30));
  const pastYear = transactions.filter((t: any) => isWithinRange(t.date, 365));

  return (
    <>
      <section>
        <div className="container mx-auto py-[50px]">
          <div className="flex flex-col gap-5">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Past Week</CardTitle>
                </CardHeader>
                <CardContent>
                  <div>{pastWeek.length} transactions</div>
                  <div>
                    Total amount:{" "}
                    {pastWeek.reduce(
                      (sum: any, t: { amount: any }) => sum + t.amount,
                      0
                    )}{" "}
                    INR
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Past Month</CardTitle>
                </CardHeader>
                <CardContent>
                  <div>{pastMonth.length} transactions</div>
                  <div>
                    Total amount:{" "}
                    {pastMonth.reduce(
                      (sum: any, t: { amount: any }) => sum + t.amount,
                      0
                    )}{" "}
                    INR
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Past Year</CardTitle>
                </CardHeader>
                <CardContent>
                  <div>{pastYear.length} transactions</div>
                  <div>
                    Total amount:{" "}
                    {pastYear.reduce(
                      (sum: any, t: { amount: any }) => sum + t.amount,
                      0
                    )}{" "}
                    INR
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Latest Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Amount</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {isLoading ? (
                        <TransactionsTableSkeleton />
                      ) : (
                        <>
                          {transactions?.length > 0 ? (
                            transactions.slice(0, 5).map((transaction: any) => (
                              <TableRow key={transaction._id}>
                                <TableCell
                                  className={
                                    transaction.type === "expense"
                                      ? "text-red-600"
                                      : "text-green-600"
                                  }
                                >
                                  {transaction.type === "expense" ? "" : "+"}
                                  {transaction.amount} INR
                                </TableCell>
                                <TableCell>{transaction.category}</TableCell>
                                <TableCell>
                                  {formatDateToDDMMYYYY(
                                    new Date(transaction.date)
                                  )}
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <>
                              <TableRow>
                                <TableCell
                                  colSpan={3}
                                  className="text-center py-4"
                                >
                                  No transactions found.
                                </TableCell>
                              </TableRow>
                            </>
                          )}
                          {transactions?.length > 0 && (
                            <TableRow>
                              <TableCell colSpan={3}>
                                <Link
                                  href={pageRoutes.user.transactions}
                                  className="underline underline-offset-4"
                                >
                                  View all transactions
                                </Link>
                              </TableCell>
                            </TableRow>
                          )}
                        </>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Dashboard;
