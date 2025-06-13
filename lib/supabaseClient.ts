"use client";

import { createBrowserClient } from "@supabase/ssr";

export const createSupabaseClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        fetch: (input, init?) => {
          return fetch(input, {
            ...init,
            credentials: "include", // Required for Clerk Auth
          });
        },
      },
    },
  );
