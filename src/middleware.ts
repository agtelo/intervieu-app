import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher(["/prep(.*)", "/dashboard(.*)"]);
const isProtectedApi = createRouteMatcher([
  "/api/parse-cv",
  "/api/scrape",
  "/api/search-person",
  "/api/chat",
  "/api/generate",
  "/api/score",
]);

export default clerkMiddleware(async (auth, req) => {
  // Protect UI routes
  if (isProtectedRoute(req)) {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }
  }

  // Protect API routes
  if (isProtectedApi(req)) {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
  }

  // Continue to next middleware/handler
  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
