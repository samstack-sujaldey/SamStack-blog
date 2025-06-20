import { Analytics } from "@vercel/analytics/next";
import { Suspense } from "react";
import { ThemeModeScript } from "flowbite-react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "next-themes";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SamStack-Ed Blog",
  description:
    "Explore SamStack-Ed Blog for tutorials on JavaScript, React, Next.js, and full-stack web development. Learn to code smarter and build real-world apps.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <head>
          <ThemeModeScript />
        </head>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <ThemeProvider attribute="class" defaultTheme="dark">
            <Suspense fallback={null}>
              <Header></Header>
            </Suspense>
            {children}
            <Analytics></Analytics>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
