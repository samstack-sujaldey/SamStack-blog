"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Button, FileInput, TextInput, Select } from "flowbite-react";
import dynamic from "next/dynamic";
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
import "react-quill-new/dist/quill.snow.css";

export default function CreatePostPage() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const { isSignedIn, user } = useUser();
  const handleUpload = async () => {
    if (!file) return;
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
          Create a post
        </h1>

        <form className="flex min-h-[80vh] flex-col gap-4">
          <TextInput type="text" placeholder="Title" required />

          <Select>
            <option value="uncategorized">Select a category</option>
            <option value="javascript">JavaScript</option>
            <option value="reactjs">React.js</option>
            <option value="nextjs">Next.js</option>
            <option value="prisma"></option>
            <option value="html"></option>
            <option value="css"></option>
          </Select>

          <div className="rounded-md border-2 border-dotted border-blue-400 p-4">
            <div className="flex items-center gap-4">
              <FileInput
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
              <Button
                onClick={handleUpload}
                disabled={uploading}
                color="purple"
              >
                {uploading ? "Uploading..." : "Upload Image"}
              </Button>
            </div>

            {previewUrl && (
              <img
                src={previewUrl}
                alt="Uploaded Preview"
                className="mx-auto mt-4 h-72 rounded-md object-contain shadow"
              />
            )}
          </div>

          <div className="flex flex-grow flex-col">
            <ReactQuill
              theme="snow"
              placeholder="Write something..."
              className="min-h-[40vh] rounded-md"
            />
          </div>

          <button
            type="button"
            className="me-2 mb-2 rounded-lg bg-gradient-to-r from-teal-200 to-lime-200 px-5 py-2.5 text-center text-sm font-medium text-gray-900 hover:bg-gradient-to-l hover:from-teal-200 hover:to-lime-200 focus:ring-4 focus:ring-lime-200 focus:outline-none dark:focus:ring-teal-700"
          >
            Publish
          </button>
        </form>
      </div>
    );
  } else {
    return (
      <div className="mt-[70%] text-center text-xl font-bold md:mt-[20%] md:text-3xl md:font-extrabold">
        <div>Unauthorized Access Not Allowed</div>
      </div>
    );
  }
}
