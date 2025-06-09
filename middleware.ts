import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: [
    // Exclude Clerk routes and static files
    "/((?!_next/static|_next/image|favicon.ico|sign-in|sign-up|[^/]*\\.(?:jpg|jpeg|png|svg|ico|webp|ttf|woff|woff2|css|js)).*)",
    "/(api|trpc)(.*)",
  ],
};
