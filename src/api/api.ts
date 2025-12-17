import { get } from "http";
import client, { METHODS } from "./client";

export const api = {
  auth: {
    signup: ({ data, ...configs }: { data: any; [key: string]: any }) =>
      client({
        url: "/api/auth/signup",
        method: METHODS.POST,
        data,
        ...configs,
      }),
    forgotPassword: ({ data, ...configs }: { data: any; [key: string]: any }) =>
      client({
        url: "/api/auth/forgot-password",
        method: METHODS.POST,
        data,
        ...configs,
      }),
    resetPassword: ({ data, ...configs }: { data: any; [key: string]: any }) =>
      client({
        url: "/api/auth/reset-password",
        method: METHODS.POST,
        data,
        ...configs,
      }),
  },
  transactions: {
    getAllTransactions: ({ ...configs }: { [key: string]: any }) =>
      client({
        url: "/api/user/transactions",
        method: METHODS.GET,
        ...configs,
      }),
    getTransactionById: ({
      id,
      ...configs
    }: {
      id: string;
      [key: string]: any;
    }) =>
      client({
        url: `/api/user/transactions/${id}`,
        method: METHODS.GET,
        ...configs,
      }),
    addTransaction: ({ data, ...configs }: { data: any; [key: string]: any }) =>
      client({
        url: "/api/user/add-transaction",
        method: METHODS.POST,
        data,
        ...configs,
      }),
    deleteTransactionById: ({
      id,
      ...configs
    }: {
      id: string;
      [key: string]: any;
    }) =>
      client({
        url: `/api/user/transactions/${id}`,
        method: METHODS.DELETE,
        ...configs,
      }),
  },
};
