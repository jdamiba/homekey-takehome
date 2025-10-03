import { NextRequest, NextResponse } from "next/server";
import { UserService } from "@/lib/services/user";

// GET /api/users - Get all users (admin only)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const email = searchParams.get("email");

    if (userId) {
      const user = await UserService.getUserById(userId);
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
      return NextResponse.json({ user });
    }

    if (email) {
      const user = await UserService.getUserByEmail(email);
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
      return NextResponse.json({ user });
    }

    // For now, return all users (in production, you'd want pagination and admin auth)
    const { prisma } = await import("@/lib/db");
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        profileImageUrl: true,
        preferences: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ users, count: users.length });
  } catch (error) {
    console.error("Error retrieving users:", error);
    return NextResponse.json(
      { error: "Failed to retrieve users" },
      { status: 500 }
    );
  }
}

// POST /api/users - Create a new user (for testing)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const user = await UserService.createUser({
      id: body.id,
      email: body.email,
      firstName: body.firstName,
      lastName: body.lastName,
      phone: body.phone,
      profileImageUrl: body.profileImageUrl,
    });

    return NextResponse.json(
      {
        message: "User created successfully",
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          createdAt: user.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
