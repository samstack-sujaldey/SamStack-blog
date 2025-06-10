import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, redirectToSignIn } = await auth();
  if (!userId && isProtectedRoute(req)) {
    return redirectToSignIn({ returnBackUrl: req.url });
  }
});

export const config = {
  matcher: [
    // Exclude Clerk routes and static files
    "/((?!_next/static|_next/image|favicon.ico|sign-in|sign-up|[^/]*\\.(?:jpg|jpeg|png|svg|ico|webp|ttf|woff|woff2|css|js)).*)",
    "/(api|trpc)(.*)",
  ],
};
