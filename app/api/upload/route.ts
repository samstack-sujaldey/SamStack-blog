// app/api/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Readable } from "stream";
import busboy from "busboy";

export const config = {
  api: {
    bodyParser: false,
  },
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function POST(req: NextRequest) {
  try {
    const bb = busboy({ headers: Object.fromEntries(req.headers) });

    const buffers: Buffer[] = [];
    let fileName = "";

    return await new Promise((resolve, reject) => {
      bb.on("file", (_, file, info) => {
        fileName = info.filename;

        file.on("data", (data) => buffers.push(data));
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
        const buffer = Buffer.concat(buffers);

        const { error } = await supabase.storage
          .from("blog-uploads")
          .upload(`screenshots/${Date.now()}-${fileName}`, buffer, {
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
          resolve(NextResponse.json({ success: true }, { status: 200 }));
        }
      });

      const stream = Readable.fromWeb(req.body as any);
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
