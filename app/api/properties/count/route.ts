import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const count =
      await prisma.$queryRaw`SELECT COUNT(*) as count FROM properties`;
    const totalCount = (count as any)[0].count;

    return NextResponse.json({
      count: parseInt(totalCount),
      message: `Total properties in database: ${totalCount}`,
    });
  } catch (error) {
    console.error("Error getting property count:", error);
    return NextResponse.json(
      { error: "Failed to get property count" },
      { status: 500 }
    );
  }
}
