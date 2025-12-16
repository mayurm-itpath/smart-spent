import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { pageRoutes } from "./utils/constants/routes";

export const middleware = async (request: NextRequest) => {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const isAuthRoute = request.nextUrl.pathname.startsWith("/auth");
  const isUserRoute = request.nextUrl.pathname.startsWith("/user");

  if (isAuthRoute && token) {
    return NextResponse.redirect(
      new URL(pageRoutes.user.dashboard, request.url)
    );
  }

  if (isUserRoute && !token) {
    return NextResponse.redirect(new URL(pageRoutes.auth.login, request.url));
  }

  return NextResponse.next();
};

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};
