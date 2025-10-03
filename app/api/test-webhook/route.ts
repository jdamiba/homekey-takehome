import { NextRequest, NextResponse } from "next/server";
import { UserService } from "@/lib/services/user";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Simulate a Clerk user.created event
    const mockUserData = {
      id: body.id || "test_user_" + Date.now(),
      email: body.email || "test@example.com",
      first_name: body.first_name || "Test",
      last_name: body.last_name || "User",
      phone_numbers: body.phone ? [{ phone_number: body.phone }] : [],
      email_addresses: [{ email_address: body.email || "test@example.com" }],
      image_url: body.image_url || null,
    };

    // Create user in database
    const user = await UserService.createUser({
      id: mockUserData.id,
      email: mockUserData.email_addresses[0]?.email_address || "",
      firstName: mockUserData.first_name || undefined,
      lastName: mockUserData.last_name || undefined,
      phone: mockUserData.phone_numbers[0]?.phone_number || undefined,
      profileImageUrl: mockUserData.image_url || undefined,
    });

    return NextResponse.json({
      message: "Test user created successfully",
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  } catch (error) {
    console.error("Error creating test user:", error);
    return NextResponse.json(
      { error: "Failed to create test user" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Get all users to verify they exist
    const { prisma } = await import("@/lib/db");
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      message: "Users retrieved successfully",
      users,
      count: users.length,
    });
  } catch (error) {
    console.error("Error retrieving users:", error);
    return NextResponse.json(
      { error: "Failed to retrieve users" },
      { status: 500 }
    );
  }
}
