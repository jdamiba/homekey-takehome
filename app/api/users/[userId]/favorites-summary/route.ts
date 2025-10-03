import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";

// GET - Get user's favorites summary
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId: authUserId } = await auth();
    const { userId } = await params;
    
    if (!authUserId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Ensure user can only access their own data
    if (authUserId !== userId) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    // Get user's recent favorites
    const recentFavorites = await prisma.$queryRaw`
      SELECT 
        p.id,
        p.address,
        p.city,
        p.state,
        p.price,
        p.bedrooms,
        p.bathrooms,
        uf.created_at as favorited_at
      FROM user_favorites uf
      JOIN properties p ON uf.property_id = p.id
      WHERE uf.user_id = $1
      ORDER BY uf.created_at DESC
      LIMIT 3
    ` as any[];

    // Get total favorites count
    const totalFavorites = await prisma.$queryRaw`
      SELECT COUNT(*) as count
      FROM user_favorites 
      WHERE user_id = $1
    ` as any[];

    return NextResponse.json({
      recentFavorites,
      totalCount: parseInt(totalFavorites[0]?.count || "0"),
      message: "Favorites summary retrieved successfully"
    });

  } catch (error) {
    console.error("Error fetching favorites summary:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch favorites summary",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
