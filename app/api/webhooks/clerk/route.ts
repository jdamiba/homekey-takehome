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
  const body = JSON.parse(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET || "");

  let evt: any;

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
  const eventType = evt.type;

  try {
    switch (eventType) {
      case "user.created":
        await handleUserCreated(evt.data);
        break;
      case "user.updated":
        await handleUserUpdated(evt.data);
        break;
      case "user.deleted":
        await handleUserDeleted(evt.data);
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

async function handleUserCreated(userData: any) {
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

async function handleUserUpdated(userData: any) {
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

async function handleUserDeleted(userData: any) {
  try {
    // Prisma will handle cascade deletes for related records
    await UserService.deleteUser(userData.id);

    console.log("User deleted from database:", userData.id);
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
}
