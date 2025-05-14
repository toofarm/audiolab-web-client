import { NextRequest, NextResponse } from "next/server";
import { verifyAuth } from "./lib/dal";

const nonAuthRoutes = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
];

const middleware = async (req: NextRequest) => {
  // Check if the request is for a non-auth route
  const path = req.nextUrl.pathname;
  const isPublicRoute = nonAuthRoutes.includes(path);

  // Check for a session cookie
  const { isAuthenticated } = await verifyAuth();

  // If the user is authenticated and trying to access a non-auth route, redirect to the home page
  if (isAuthenticated && isPublicRoute) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // If the user is not authenticated and trying to access a protected route, redirect to the login page
  if (!isAuthenticated && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
};

// Routes Middleware should not run on
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};

export default middleware;
