import { NextRequest, NextResponse } from "next/server";
import { UserService } from "@/lib/services/user";

// GET /api/users/[userId]/preferences - Get user preferences
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const user = await UserService.getUserById(userId);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      preferences: user.preferences,
    });
  } catch (error) {
    console.error("Error retrieving user preferences:", error);
    return NextResponse.json(
      { error: "Failed to retrieve user preferences" },
      { status: 500 }
    );
  }
}

// PUT /api/users/[userId]/preferences - Update user preferences
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const body = await req.json();

    const user = await UserService.updateUserPreferences(
      userId,
      body.preferences
    );

    return NextResponse.json({
      message: "Preferences updated successfully",
      preferences: user.preferences,
    });
  } catch (error) {
    console.error("Error updating user preferences:", error);
    return NextResponse.json(
      { error: "Failed to update user preferences" },
      { status: 500 }
    );
  }
}
