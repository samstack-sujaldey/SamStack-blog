"use client";

import { useEffect, useState } from "react";
import { useUser, useAuth } from "@clerk/nextjs";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { FileInput, Select, TextInput } from "flowbite-react";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

const ADMIN_USER_ID = "user_2yKnCmHUq7o0kKl2GCJKR3ebf7S";

export default function CreatePostPage() {
  const { isSignedIn, user } = useUser();
  const { getToken } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [supabase, setSupabase] = useState<any>(null);

  useEffect(() => {
    const initSupabase = async () => {
      const token = await getToken({ template: "supabase" });
      const client = createClientComponentClient();

      if (token) {
        await client.auth.setSession({
          access_token: token,
          refresh_token: "", // empty is okay
        });
      }

      setSupabase(client);
    };

    initSupabase();
  }, [getToken]);

  const uploadImage = async () => {
    if (!file || !supabase) {
      console.error("No file selected or Supabase not ready");
      return;
    }

    const filePath = `public/screenshots/${Date.now()}-${file.name}`;

    const { error } = await supabase.storage
      .from("blog-uploads")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (error) {
      console.error("Upload error:", error.message);
    } else {
      console.log("✅ Upload successful!");
    }
  };

  if (!isSignedIn || user?.id !== ADMIN_USER_ID) {
    return (
      <div className="mt-[70%] text-center text-xl font-bold md:mt-[20%] md:text-3xl md:font-extrabold">
        Unauthorized Access Not Allowed
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-screen max-w-3xl p-3">
      <h1 className="my-7 text-center text-3xl font-semibold">
        SamStack-Ed Post
      </h1>
      <form
        className="flex flex-col gap-4"
        onSubmit={(e) => e.preventDefault()}
      >
        {/* Your input fields */}
        <div className="flex items-center justify-between gap-4 border-4 border-dotted border-teal-500 p-3">
          <FileInput
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
          <button
            type="button"
            onClick={uploadImage}
            className="group relative me-2 mb-2 inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-teal-300 to-lime-300 p-0.5 text-sm font-medium text-gray-900"
          >
            <span className="relative rounded-md bg-white px-5 py-2.5 transition-all group-hover:bg-transparent">
              Upload Image
            </span>
          </button>
        </div>
      </form>
    </div>
  );
}
