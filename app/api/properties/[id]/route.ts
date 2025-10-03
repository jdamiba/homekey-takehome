import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Get property with location scores from neighborhoods
    const propertyQuery = `
      SELECT 
        p.id, p.address, p.city, p.state, p.zip_code as "zipCode", p.price, 
        p.square_feet as "squareFeet", p.bedrooms, p.bathrooms,
        p.year_built as "yearBuilt", p.property_type as "propertyType", 
        p.days_on_market as "daysOnMarket", p.price_per_sqft as "pricePerSqft", 
        p.listing_status as "listingStatus", p.features, p.description, 
        p.created_at as "createdAt", p.updated_at as "updatedAt",
        COALESCE(n.walk_score, 0) as "walkScore",
        COALESCE(n.bike_score, 0) as "bikeScore", 
        COALESCE(n.transit_score, 0) as "transitScore"
      FROM properties p
      LEFT JOIN neighborhoods n ON p.neighborhood_id = n.id
      WHERE p.id = $1::uuid
    `;

    const properties = await prisma.$queryRawUnsafe(propertyQuery, id);

    if (!properties || (properties as any[]).length === 0) {
      return NextResponse.json(
        { error: "Property not found" },
        { status: 404 }
      );
    }

    const property = (properties as any[])[0];

    return NextResponse.json({
      property,
      message: "Property retrieved successfully",
    });
  } catch (error) {
    console.error("Error fetching property:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch property",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
