import { NextRequest, NextResponse } from "next/server";
import { ImageService } from "@/lib/services/images";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const type =
      (searchParams.get("type") as "exterior" | "interior") || "exterior";
    const count = parseInt(searchParams.get("count") || "1");

    if (count === 1) {
      const imageUrl = await ImageService.getPropertyImage(id, type);
      return NextResponse.json({ imageUrl });
    } else {
      const imageUrls = await ImageService.getMultiplePropertyImages(id, count);
      return NextResponse.json({ imageUrls });
    }
  } catch (error) {
    console.error("Error fetching property images:", error);
    return NextResponse.json(
      { error: "Failed to fetch property images" },
      { status: 500 }
    );
  }
}
