import { NextRequest, NextResponse } from "next/server";
import { Webhook } from "svix";
import { UserService } from "@/lib/services/user";

export async function POST(req: NextRequest) {
  // Get the headers
  const svix_id = req.headers.get("svix-id");
  const svix_timestamp = req.headers.get("svix-timestamp");
  const svix_signature = req.headers.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.text();

  // Create a new Svix instance with your secret.
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET || "");

  let evt: unknown;

  // Verify the payload with the headers
  try {
    evt = wh.verify(payload, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occured", {
      status: 400,
    });
  }

  // Handle the webhook
  const event = evt as {
    type: string;
    data: {
      id: string;
      email_addresses: Array<{ email_address: string }>;
      first_name?: string;
      last_name?: string;
      phone_numbers: Array<{ phone_number: string }>;
      image_url?: string;
    };
  };

  const eventType = event.type;

  try {
    switch (eventType) {
      case "user.created":
        await handleUserCreated(event.data);
        break;
      case "user.updated":
        await handleUserUpdated(event.data);
        break;
      case "user.deleted":
        await handleUserDeleted(event.data);
        break;
      default:
        console.log(`Unhandled event type: ${eventType}`);
    }

    return NextResponse.json({ message: "Webhook processed successfully" });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return new Response("Error processing webhook", {
      status: 500,
    });
  }
}

async function handleUserCreated(userData: {
  id: string;
  email_addresses: Array<{ email_address: string }>;
  first_name?: string;
  last_name?: string;
  phone_numbers: Array<{ phone_number: string }>;
  image_url?: string;
}) {
  try {
    const user = await UserService.createUser({
      id: userData.id,
      email: userData.email_addresses[0]?.email_address || "",
      firstName: userData.first_name || undefined,
      lastName: userData.last_name || undefined,
      phone: userData.phone_numbers[0]?.phone_number || undefined,
      profileImageUrl: userData.image_url || undefined,
    });

    console.log("User created in database:", user.id);
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}

async function handleUserUpdated(userData: {
  id: string;
  email_addresses: Array<{ email_address: string }>;
  first_name?: string;
  last_name?: string;
  phone_numbers: Array<{ phone_number: string }>;
  image_url?: string;
}) {
  try {
    const user = await UserService.updateUser(userData.id, {
      email: userData.email_addresses[0]?.email_address || undefined,
      firstName: userData.first_name || undefined,
      lastName: userData.last_name || undefined,
      phone: userData.phone_numbers[0]?.phone_number || undefined,
      profileImageUrl: userData.image_url || undefined,
    });

    console.log("User updated in database:", user.id);
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
}

async function handleUserDeleted(userData: { id: string }) {
  try {
    // Prisma will handle cascade deletes for related records
    await UserService.deleteUser(userData.id);

    console.log("User deleted from database:", userData.id);
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
}
