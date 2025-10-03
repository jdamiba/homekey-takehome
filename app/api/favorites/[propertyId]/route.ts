import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";

// GET - Check if property is favorited by current user
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ propertyId: string }> }
) {
  try {
    const { userId } = await auth();
    const { propertyId } = await params;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if property is favorited
    const favorite = await prisma.$queryRawUnsafe(
      `SELECT id, created_at FROM user_favorites WHERE user_id = $1 AND property_id = $2::uuid`,
      userId,
      propertyId
    );

    const isFavorited = favorite && (favorite as any[]).length > 0;

    return NextResponse.json({
      isFavorited,
      favoritedAt: isFavorited ? (favorite as any[])[0].created_at : null,
    });
  } catch (error) {
    console.error("Error checking favorite status:", error);
    return NextResponse.json(
      {
        error: "Failed to check favorite status",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
