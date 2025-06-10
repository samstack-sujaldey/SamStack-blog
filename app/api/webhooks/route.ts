import { createOrUpdateUser, deleteUser } from "@/lib/actions/user";
import { clerkClient } from "@clerk/nextjs/server";
import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { NextRequest } from "next/server";

const CLERK_WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SIGNING_SECRET;

if (!CLERK_WEBHOOK_SECRET) {
  throw new Error("❌ Missing CLERK_WEBHOOK_SIGNING_SECRET in .env");
}

type ClerkUser = {
  id: string;
  first_name: string;
  last_name: string;
  image_url: string;
  email_addresses: { email_address: string }[];
  username: string;
};

export async function POST(req: NextRequest) {
  const clerk = await clerkClient();
  try {
    const evt = await verifyWebhook(req);
    const eventType = evt.type;

    // Log basic event info
    console.log(
      `🔔 Webhook received: type = ${eventType}, id = ${evt.data.id}`,
    );
    console.log("📦 Full event data:", JSON.stringify(evt.data, null, 2));

    if (eventType === "user.created" || eventType === "user.updated") {
      const user = evt.data as ClerkUser;

      const createdUser = await createOrUpdateUser(
        user.id,
        user.first_name || "",
        user.last_name || "",
        user.image_url,
        user.email_addresses,
        user.username || "",
      );

      if (createdUser && eventType === "user.created") {
        try {
          await clerk.users.updateUserMetadata(user.id, {
            publicMetadata: {
              userMongoId: createdUser._id,
              isAdmin: createdUser.isAdmin,
            },
          });
          console.log("✅ Clerk metadata updated");
        } catch (error) {
          console.error("❌ Error updating Clerk metadata:", error);
        }
      }
    }

    if (eventType === "user.deleted") {
      const { id } = evt.data as { id: string };
      try {
        await deleteUser(id);
        console.log(`🗑️ User with Clerk ID ${id} deleted from DB`);
      } catch (error) {
        console.error("❌ Error deleting user:", error);
        return new Response("Error occurred", { status: 400 });
      }
    }

    return new Response("✅ Webhook processed", { status: 200 });
  } catch (err) {
    console.error("❌ Error verifying webhook:", err);
    return new Response("Error verifying webhook", { status: 400 });
  }
}
