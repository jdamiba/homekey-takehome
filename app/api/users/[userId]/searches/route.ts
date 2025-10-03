import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";

// GET - Get user's recent searches
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

    // Get user's recent searches from the database
    const searches = await prisma.$queryRaw`
      SELECT 
        id,
        search_criteria,
        created_at,
        results_count
      FROM user_searches 
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT 5
    ` as any[];

    return NextResponse.json({
      searches,
      message: "Recent searches retrieved successfully"
    });

  } catch (error) {
    console.error("Error fetching user searches:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch user searches",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
