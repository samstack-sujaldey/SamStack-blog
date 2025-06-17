// app/api/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Readable } from "stream";
import busboy from "busboy";
import { ReadableStream } from "stream/web";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function POST(req: NextRequest) {
  try {
    // Check if body exists
    if (!req.body) {
      return NextResponse.json(
        { success: false, message: "No request body" },
        { status: 400 },
      );
    }

    const bb = busboy({ headers: Object.fromEntries(req.headers) });
    const buffers: Buffer[] = [];
    let fileName = "";

    return await new Promise<NextResponse>((resolve, reject) => {
      bb.on("file", (_, file, info) => {
        fileName = info.filename;
        file.on("data", (data: Buffer) => buffers.push(data));
        file.on("limit", () => console.log("File too large"));
      });

      bb.on("error", (err) => {
        console.error("Busboy error:", err);
        reject(
          NextResponse.json(
            { success: false, message: "Busboy error" },
            { status: 500 },
          ),
        );
      });

      bb.on("finish", async () => {
        try {
          const buffer = Buffer.concat(buffers);

          // Generate a unique filename
          const uniqueFileName = `${Date.now()}-${fileName}`;

          const { error } = await supabase.storage
            .from("blog-uploads")
            .upload(`images/${uniqueFileName}`, buffer, {
              contentType: "image/png",
              upsert: true,
            });

          if (error) {
            console.error("Upload error:", error);
            resolve(
              NextResponse.json(
                { success: false, message: error.message },
                { status: 500 },
              ),
            );
          } else {
            resolve(
              NextResponse.json(
                {
                  success: true,
                  fileName: uniqueFileName,
                },
                { status: 200 },
              ),
            );
          }
        } catch (uploadError) {
          console.error("Upload processing error:", uploadError);
          resolve(
            NextResponse.json(
              { success: false, message: "Upload processing failed" },
              { status: 500 },
            ),
          );
        }
      });

      // Fixed type assertion
      const stream = Readable.fromWeb(req.body as ReadableStream);
      stream.pipe(bb);
    });
  } catch (err) {
    console.error("Unexpected upload error:", err);
    return NextResponse.json(
      { success: false, message: "Unexpected error" },
      { status: 500 },
    );
  }
}
