"use client";

import {
  Button,
  Navbar,
  NavbarLink,
  TextInput,
  NavbarToggle,
  NavbarCollapse,
} from "flowbite-react";
import Link from "next/link";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon, FaSun } from "react-icons/fa";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function Header() {
  const path = usePathname();
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);

  // Mark component as mounted after hydration to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Update URL on search form submit
  const handleSubmit = (e: any) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(searchParams);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    router.push(`/search?${searchQuery}`);
  };

  // Populate input with search term from URL on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(searchParams);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [searchParams]);

  return (
    <Navbar className="border-b-2 border-gray-200 p-2 shadow-sm md:gap-0 md:p-5 dark:border-gray-700 dark:shadow-md">
      {/* Logo */}
      <Link
        href="/"
        className="self-center text-sm font-semibold whitespace-nowrap sm:text-xl dark:text-white"
      >
        <span className="me-1 mb-2 rounded-lg bg-gradient-to-r from-lime-200 via-lime-400 to-lime-500 px-1.5 py-1.5 text-center text-sm font-bold text-gray-900 shadow-lg shadow-lime-500/50 hover:bg-gradient-to-br focus:ring-4 focus:ring-lime-300 focus:outline-none md:px-2.5 md:py-2.5 md:text-lg dark:shadow-lg dark:shadow-lime-800/80 dark:focus:ring-lime-800">
          SamStack-Ed
        </span>
        <span className="text-gray-900 dark:text-white">Blog</span>
      </Link>

      {/* Desktop Search Input */}
      <form onSubmit={handleSubmit}>
        <TextInput
          type="text"
          placeholder="Search..."
          rightIcon={AiOutlineSearch}
          className="hidden lg:inline"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </form>

      {/* Mobile Search Button */}
      <Button className="md:h-10 md:w-12 lg:hidden" color="gray" pill>
        <AiOutlineSearch />
      </Button>

      {/* Theme Toggle and Auth Buttons */}
      <div className="flex items-center gap-1 md:order-2 md:gap-2.5">
        {mounted && (
          <Button
            className="hidden h-10 w-12 pl-[17px] sm:inline"
            color="gray"
            pill
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            {theme === "light" ? <FaSun /> : <FaMoon />}
          </Button>
        )}

        {mounted && (
          <SignedIn>
            <UserButton
              appearance={{ baseTheme: theme === "dark" ? dark : undefined }}
            />
          </SignedIn>
        )}

        {mounted && (
          <SignedOut>
            <Link href="/sign-in">
              <button
                type="button"
                className="group relative inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-teal-300 to-lime-300 p-0.5 text-sm font-medium text-gray-900 group-hover:from-teal-300 group-hover:to-lime-300 focus:ring-4 focus:ring-lime-200 focus:outline-none dark:text-white dark:hover:text-gray-900 dark:focus:ring-lime-800"
              >
                <span className="relative rounded-md bg-white px-2 py-1.5 transition-all duration-75 ease-in group-hover:bg-transparent md:px-5 md:py-2.5 dark:bg-gray-900 group-hover:dark:bg-transparent">
                  Sign In
                </span>
              </button>
            </Link>
          </SignedOut>
        )}

        {/* Mobile Menu Toggle */}
        <NavbarToggle />
      </div>

      {/* Mobile Navbar Collapse */}
      <NavbarCollapse>
        {mounted && (
          <Button
            className="mt-3 w-fit text-left font-medium text-gray-900 hover:underline sm:hidden dark:text-white"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            {theme === "light" ? (
              <span className="flex items-center gap-1">
                <FaMoon /> Dark Mode
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <FaSun /> Light Mode
              </span>
            )}
          </Button>
        )}

        {/* Navigation Links */}
        <Link href="/">
          <NavbarLink active={path === "/"} as="div">
            Home
          </NavbarLink>
        </Link>
        <Link href="/about">
          <NavbarLink active={path === "/about"} as="div">
            About
          </NavbarLink>
        </Link>
        <Link href="/projects">
          <NavbarLink active={path === "/projects"} as="div">
            Projects
          </NavbarLink>
        </Link>
      </NavbarCollapse>
    </Navbar>
  );
}
