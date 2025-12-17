"use client";
import { api } from "@/api/api";
import DatePicker from "@/components/date-picker";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useAppStore } from "@/store/use-app-store";
import { pageRoutes } from "@/utils/constants/routes";
import { apiAsyncHandler } from "@/utils/helpers";
import { transactionValidation } from "@/utils/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

interface AddTransactionFormType {
  amount: number;
  type: "income" | "expense";
  category: string;
  date: Date;
  description?: string;
}

const AddTransactionForm = () => {
  const initialFormData: AddTransactionFormType = {
    amount: null as unknown as number,
    type: "" as "income" | "expense",
    category: "",
    date: null as unknown as Date,
    description: "",
  };
  const router = useRouter();
  const { userInfo } = useAppStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    defaultValues: initialFormData,
    resolver: zodResolver(transactionValidation),
  });

  const mutation = useMutation({
    mutationFn: (data: any) => {
      const res = api.transactions.addTransaction({ data });
      return res;
    },
    onSuccess: () => {
      toast.success("Transaction added successfully");
      router.push(pageRoutes.user.transactions);
    },
    onError: () => {
      toast.error("Failed to add transaction");
    },
  });

  const onSubmit = (data: AddTransactionFormType) => {
    apiAsyncHandler(async () => {
      await mutation.mutateAsync({ ...data, userId: userInfo?.id });
    });
  };

  return (
    <>
      <section>
        <div className="container mx-auto">
          <div className="flex min-h-svh w-full justify-center p-6 md:p-10">
            <div className="w-full max-w-sm">
              <div className="flex flex-col gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Add Transaction</CardTitle>
                    <CardDescription>
                      Record your income or expense
                    </CardDescription>
                  </CardHeader>

                  <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)}>
                      <FieldGroup>
                        {/* Amount */}
                        <Field>
                          <FieldLabel htmlFor="amount">Amount</FieldLabel>
                          <Input
                            {...register("amount", { valueAsNumber: true })}
                            id="amount"
                            type="number"
                            placeholder="Enter amount"
                          />
                          {errors.amount && (
                            <FieldDescription className="text-red-500">
                              {errors.amount.message}
                            </FieldDescription>
                          )}
                        </Field>

                        {/* Type */}
                        <Field>
                          <FieldLabel htmlFor="type">Type</FieldLabel>
                          <select
                            {...register("type")}
                            id="type"
                            className="w-full rounded-md border px-3 py-2 text-sm"
                          >
                            <option value="">Select type</option>
                            <option value="income">Income</option>
                            <option value="expense">Expense</option>
                          </select>
                          {errors.type && (
                            <FieldDescription className="text-red-500">
                              {errors.type.message}
                            </FieldDescription>
                          )}
                        </Field>

                        {/* Category */}
                        <Field>
                          <FieldLabel htmlFor="category">Category</FieldLabel>
                          <Input
                            {...register("category")}
                            id="category"
                            type="text"
                            placeholder="e.g. Food, Salary, Rent"
                          />
                          {errors.category && (
                            <FieldDescription className="text-red-500">
                              {errors.category.message}
                            </FieldDescription>
                          )}
                        </Field>

                        {/* Date */}
                        <Field>
                          <FieldLabel htmlFor="date">Date</FieldLabel>
                          <Controller
                            name="date"
                            control={control}
                            defaultValue={new Date()}
                            render={({ field }) => (
                              <DatePicker
                                value={field.value}
                                onChange={field.onChange}
                              />
                            )}
                          />
                          {errors.date && (
                            <FieldDescription className="text-red-500">
                              {errors.date.message}
                            </FieldDescription>
                          )}
                        </Field>

                        {/* Description */}
                        <Field>
                          <FieldLabel htmlFor="description">
                            Description (optional)
                          </FieldLabel>
                          <Input
                            {...register("description")}
                            id="description"
                            type="text"
                            placeholder="Notes about this transaction"
                          />
                          {errors.description && (
                            <FieldDescription className="text-red-500">
                              {errors.description.message}
                            </FieldDescription>
                          )}
                        </Field>

                        {/* Actions */}
                        <Field>
                          <Button type="submit" className="w-full">
                            Add Transaction
                          </Button>
                        </Field>
                      </FieldGroup>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AddTransactionForm;
