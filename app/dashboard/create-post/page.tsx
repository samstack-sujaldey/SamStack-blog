"use client";

import { useUser } from "@clerk/nextjs";
import { FileInput, Select, TextInput } from "flowbite-react";

import dynamic from "next/dynamic";
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
import "react-quill-new/dist/quill.snow.css";

export default function CreatePostPage() {
  const { isSignedIn, user, isLoaded } = useUser();

  if (!isLoaded) {
    return null;
  }

  if (isSignedIn && user.publicMetadata.isAdmin) {
    return (
      <div className="mx-auto min-h-screen max-w-3xl p-3">
        <h1 className="my-7 text-center text-3xl font-semibold">
          SamStack-Ed Post
        </h1>
        <form className="flex flex-col gap-4">
          <div className="flex flex-col justify-between gap-4 sm:flex-row">
            <TextInput
              type="text"
              placeholder="Title"
              required
              id="title"
              className="flex-1"
            />
            <Select>
              <option value="uncategorized">Select a category</option>
              <option value="javascript">JavaScript</option>
              <option value="reactjs">React.js</option>
              <option value="nextjs">Next.js</option>
              <option value="prisma"></option>
              <option value="html"></option>
              <option value="css"></option>
            </Select>
          </div>
          <div className="flex items-center justify-between gap-4 border-4 border-dotted border-teal-500 p-3">
            <FileInput type="file" accept="image/*" />
            <button className="group relative me-2 mb-2 inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-teal-300 to-lime-300 p-0.5 text-sm font-medium text-gray-900 group-hover:from-teal-300 group-hover:to-lime-300 focus:ring-4 focus:ring-lime-200 focus:outline-none dark:text-white dark:hover:text-gray-900 dark:focus:ring-lime-800">
              <span className="relative rounded-md bg-white px-5 py-2.5 transition-all duration-75 ease-in group-hover:bg-transparent dark:bg-gray-900 group-hover:dark:bg-transparent">
                Upload Image
              </span>
            </button>
          </div>

          <ReactQuill
            theme="snow"
            placeholder="Write something..."
            className="mb-12 h-72"
            required
          />
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
