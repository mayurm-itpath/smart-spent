export const pageRoutes = {
  public: {
    home: "/",
  },
  auth: {
    login: "/auth/login",
    signup: "/auth/signup",
    forgotPassword: "/auth/forgot-password",
    resetPassword: (token: string) => `/auth/reset-password/${token}`,
  },
  user: {
    dashboard: "/user/dashboard",
    addTransaction: '/user/add-transaction',
    transactions: "/user/transactions",
    profile: "/user/profile",
  },
};
