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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppStore } from "@/store/use-app-store";
import { pageRoutes } from "@/utils/constants/routes";
import { apiAsyncHandler } from "@/utils/helpers";
import { transactionValidation } from "@/utils/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from "@/utils/constants";
import { motion } from "framer-motion";
import FormInput from "@/components/inputs/form-input";
import { Textarea } from "@/components/ui/textarea";

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

  const MotionButton = motion.create(Button);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
    setValue,
  } = useForm({
    defaultValues: initialFormData,
    resolver: zodResolver(transactionValidation),
  });

  const transactionCategory =
    watch("type") === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

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
                        <FormInput
                          {...register("amount", { valueAsNumber: true })}
                          id="amount"
                          label="Amount"
                          type="number"
                          placeholder="Enter Amount"
                          error={errors.amount}
                        />

                        {/* Type */}
                        <Field>
                          <FieldLabel htmlFor="type">Type</FieldLabel>
                          <motion.div
                            animate={errors.type && { x: [-4, 4, -4, 4, 0] }}
                            transition={{ duration: 0.4 }}
                          >
                            <Select
                              onValueChange={(value) =>
                                setValue("type", value as "income" | "expense")
                              }
                              defaultValue={watch("type")}
                            >
                              <SelectTrigger id="type" className="w-full">
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>

                              <SelectContent>
                                <SelectItem value="income">Income</SelectItem>
                                <SelectItem value="expense">Expense</SelectItem>
                              </SelectContent>
                            </Select>
                          </motion.div>

                          {errors.type && (
                            <FieldDescription className="text-red-500">
                              {errors.type.message}
                            </FieldDescription>
                          )}
                        </Field>

                        {/* Category */}
                        <Field>
                          <FieldLabel htmlFor="category">Category</FieldLabel>
                          <motion.div
                            animate={
                              errors.category && { x: [-4, 4, -4, 4, 0] }
                            }
                            transition={{ duration: 0.4 }}
                          >
                            <Select
                              disabled={!watch("type")}
                              onValueChange={(value) =>
                                setValue("category", value)
                              }
                              defaultValue={watch("category")}
                            >
                              <SelectTrigger id="category" className="w-full">
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>

                              <SelectContent>
                                {transactionCategory.map((category) => (
                                  <SelectItem key={category} value={category}>
                                    {category}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </motion.div>

                          {errors.category && (
                            <FieldDescription className="text-red-500">
                              {errors.category.message}
                            </FieldDescription>
                          )}
                        </Field>

                        {/* Date */}
                        <Field>
                          <FieldLabel htmlFor="date">Date</FieldLabel>
                          <motion.div
                            animate={errors.date && { x: [-4, 4, -4, 4, 0] }}
                            transition={{ duration: 0.4 }}
                          >
                            <Controller
                              name="date"
                              control={control}
                              defaultValue={new Date()}
                              render={({ field }) => (
                                <DatePicker
                                  id="date"
                                  value={field.value}
                                  onChange={field.onChange}
                                />
                              )}
                            />
                          </motion.div>
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
                          <motion.div
                            animate={
                              errors.description && { x: [-4, 4, -4, 4, 0] }
                            }
                            transition={{ duration: 0.4 }}
                          >
                            <Textarea
                              {...register("description")}
                              id="description"
                              placeholder="Notes about this transaction"
                            />
                          </motion.div>
                          {errors.description && (
                            <FieldDescription className="text-red-500">
                              {errors.description.message}
                            </FieldDescription>
                          )}
                        </Field>

                        {/* Actions */}
                        <Field>
                          <MotionButton
                            type="submit"
                            className="w-full shadow-md"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Add Transaction
                          </MotionButton>
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
