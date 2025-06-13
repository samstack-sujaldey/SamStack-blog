"use client";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Button, FileInput, TextInput, Select } from "flowbite-react";
import Image from "next/image";
import dynamic from "next/dynamic";
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
import "react-quill-new/dist/quill.snow.css";

export default function CreatePostPage() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const { isSignedIn, user } = useUser();

  const handleUpload = async () => {
    if (!file) {
      alert("Please choose an image");
      return;
    }
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const contentType = res.headers.get("content-type");
      const isJson = contentType?.includes("application/json");
      const data = isJson ? await res.json() : null;
      if (!res.ok || !data?.success) {
        throw new Error(data?.message || "Upload failed");
      }
      const uploadedUrl = data.url || URL.createObjectURL(file);
      setPreviewUrl(uploadedUrl);
    } catch (err) {
      console.error("Upload error:", err);
      alert("❌ Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  if (isSignedIn && user.publicMetadata.isAdmin) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="mb-6 text-center text-3xl font-semibold">
          SamStack-Ed Blog&apos;s Post
        </h1>
        <form className="flex flex-col gap-6">
          <TextInput type="text" placeholder="Title" required />
          <Select required>
            <option value="">Select a category</option>
            <option value="javascript">JavaScript</option>
            <option value="reactjs">React.js</option>
            <option value="nextjs">Next.js</option>
            <option value="prisma">Prisma</option>
            <option value="html">HTML</option>
            <option value="css">CSS</option>
          </Select>
          <div className="rounded-md border-2 border-dotted border-blue-400 p-4">
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <FileInput
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
              <Button
                onClick={handleUpload}
                disabled={uploading}
                className="bg-pink-500 hover:bg-pink-600 focus:ring-pink-500 dark:bg-pink-500 dark:hover:bg-pink-600 dark:focus:ring-pink-500"
              >
                {uploading ? "Uploading..." : "Upload Image"}
              </Button>
            </div>
            {previewUrl && (
              <div className="relative mt-4 h-80 w-full">
                <Image
                  src={previewUrl}
                  alt="Uploaded Preview"
                  fill
                  className="rounded-md object-cover shadow"
                />
              </div>
            )}
          </div>
          {/* 📌 FIXED EDITOR - reduced margin */}
          <div className="mb-3">
            <ReactQuill
              theme="snow"
              placeholder="Write something..."
              className="rounded-md"
            />
          </div>
          {/* 📌 FIXED BUTTON - removed mt-auto pt-4 */}
          <div>
            <button
              type="submit"
              className="w-full rounded-lg bg-gradient-to-r from-teal-200 to-lime-200 px-5 py-3 text-center text-sm font-medium text-gray-900 hover:bg-gradient-to-l focus:ring-4 focus:ring-lime-200 focus:outline-none dark:focus:ring-teal-700"
            >
              Publish
            </button>
          </div>
        </form>
      </div>
    );
  }

  // Unauthorized fallback
  return (
    <div className="mt-[70%] text-center text-xl font-bold md:mt-[20%] md:text-3xl md:font-extrabold">
      <div>Unauthorized Access Not Allowed</div>
    </div>
  );
}
