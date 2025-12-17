import { z } from "zod";

export const signupValidation = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters long"),
    email: z.email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    confirmPassword: z
      .string()
      .min(6, "Confirm Password must be at least 6 characters long"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const loginValidation = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const transactionValidation = z.object({
  amount: z.number().positive("Amount must be a positive number"),
  type: z.enum(["income", "expense"], "Type must be either income or expense"),
  category: z.string().min(2, "Category must be at least 2 characters long"),
  date: z.date("Date is required").refine(
    (date) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const selected = new Date(date);
      selected.setHours(0, 0, 0, 0);

      return selected <= today;
    },
    {
      message: "Date cannot be in the future",
    }
  ),
  description: z.string().optional(),
});
