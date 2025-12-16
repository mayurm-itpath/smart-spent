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
};
