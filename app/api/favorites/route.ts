import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";

// GET - Get user's favorite properties
export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user's favorite properties with location scores
    const favoritesQuery = `
      SELECT 
        p.id, p.address, p.city, p.state, p.zip_code as "zipCode", p.price, 
        p.square_feet as "squareFeet", p.bedrooms, p.bathrooms,
        p.year_built as "yearBuilt", p.property_type as "propertyType", 
        p.days_on_market as "daysOnMarket", p.price_per_sqft as "pricePerSqft", 
        p.listing_status as "listingStatus", p.features, p.description, 
        p.created_at as "createdAt", p.updated_at as "updatedAt",
        COALESCE(n.walk_score, 0) as "walkScore",
        COALESCE(n.bike_score, 0) as "bikeScore", 
        COALESCE(n.transit_score, 0) as "transitScore",
        uf.created_at as "favoritedAt"
      FROM user_favorites uf
      JOIN properties p ON uf.property_id = p.id
      LEFT JOIN neighborhoods n ON p.neighborhood_id = n.id
      WHERE uf.user_id = $1
      ORDER BY uf.created_at DESC
    `;

    const favorites = await prisma.$queryRawUnsafe(favoritesQuery, userId);

    return NextResponse.json({
      favorites,
      message: "Favorites retrieved successfully",
    });
  } catch (error) {
    console.error("Error fetching favorites:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch favorites",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

// POST - Add property to favorites
export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { propertyId } = await req.json();

    if (!propertyId) {
      return NextResponse.json(
        { error: "Property ID is required" },
        { status: 400 }
      );
    }

    // Check if property exists
    const property = await prisma.$queryRawUnsafe(
      `SELECT id FROM properties WHERE id = $1::uuid`,
      propertyId
    );

    if (!property || (property as any[]).length === 0) {
      return NextResponse.json(
        { error: "Property not found" },
        { status: 404 }
      );
    }

    // Check if already favorited
    const existingFavorite = await prisma.$queryRawUnsafe(
      `SELECT id FROM user_favorites WHERE user_id = $1 AND property_id = $2::uuid`,
      userId,
      propertyId
    );

    if (existingFavorite && (existingFavorite as any[]).length > 0) {
      return NextResponse.json(
        { error: "Property already in favorites" },
        { status: 409 }
      );
    }

    // Add to favorites
    await prisma.$executeRawUnsafe(
      `INSERT INTO user_favorites (user_id, property_id, created_at) VALUES ($1, $2::uuid, NOW())`,
      userId,
      propertyId
    );

    return NextResponse.json({
      message: "Property added to favorites successfully",
    });
  } catch (error) {
    console.error("Error adding to favorites:", error);
    return NextResponse.json(
      {
        error: "Failed to add to favorites",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

// DELETE - Remove property from favorites
export async function DELETE(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { propertyId } = await req.json();

    if (!propertyId) {
      return NextResponse.json(
        { error: "Property ID is required" },
        { status: 400 }
      );
    }

    // Remove from favorites
    const result = await prisma.$executeRawUnsafe(
      `DELETE FROM user_favorites WHERE user_id = $1 AND property_id = $2::uuid`,
      userId,
      propertyId
    );

    if (result === 0) {
      return NextResponse.json(
        { error: "Property not found in favorites" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Property removed from favorites successfully",
    });
  } catch (error) {
    console.error("Error removing from favorites:", error);
    return NextResponse.json(
      {
        error: "Failed to remove from favorites",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
