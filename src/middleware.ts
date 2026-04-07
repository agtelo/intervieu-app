import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([
  "/prep(.*)",
  "/dashboard(.*)",
]);

const isPublicRoute = createRouteMatcher([
  "/",
  "/api/health",
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  // Redirect authenticated users from landing to dashboard
  if (isPublicRoute(req) && req.nextUrl.pathname === "/" && userId) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Protect private routes
  if (isProtectedRoute(req) && !userId) {
    return NextResponse.redirect(new URL("/", req.url));
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
