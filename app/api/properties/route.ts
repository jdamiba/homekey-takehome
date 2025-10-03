import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const city = searchParams.get("city");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const propertyType = searchParams.get("propertyType");
    const bedrooms = searchParams.get("bedrooms");
    const bathrooms = searchParams.get("bathrooms");

    // Calculate offset for pagination
    const offset = (page - 1) * limit;

    // Build WHERE clause for filtering
    let whereConditions = [];
    let queryParams: any[] = [];

    if (city) {
      whereConditions.push(
        `LOWER(p.city) LIKE LOWER($${queryParams.length + 1})`
      );
      queryParams.push(`%${city}%`);
    }

    if (minPrice) {
      whereConditions.push(`p.price >= $${queryParams.length + 1}`);
      queryParams.push(parseInt(minPrice));
    }

    if (maxPrice) {
      whereConditions.push(`p.price <= $${queryParams.length + 1}`);
      queryParams.push(parseInt(maxPrice));
    }

    if (propertyType) {
      whereConditions.push(
        `p.property_type = $${queryParams.length + 1}::property_type_enum`
      );
      queryParams.push(propertyType);
    }

    if (bedrooms) {
      whereConditions.push(`p.bedrooms >= $${queryParams.length + 1}`);
      queryParams.push(parseInt(bedrooms));
    }

    if (bathrooms) {
      whereConditions.push(`p.bathrooms >= $${queryParams.length + 1}`);
      queryParams.push(parseFloat(bathrooms));
    }

    const whereClause =
      whereConditions.length > 0
        ? `WHERE ${whereConditions.join(" AND ")}`
        : "";

    // Get properties with pagination and filtering using raw SQL
    const limitParam = queryParams.length + 1;
    const offsetParam = queryParams.length + 2;

    const propertiesQuery = `
      SELECT 
        p.id, p.address, p.city, p.state, p.zip_code as "zipCode", p.price, 
        p.square_feet as "squareFeet", p.bedrooms, p.bathrooms,
        p.year_built as "yearBuilt", p.property_type as "propertyType", 
        p.days_on_market as "daysOnMarket", p.price_per_sqft as "pricePerSqft", 
        p.listing_status as "listingStatus", p.features, p.description, 
        p.created_at as "createdAt", p.updated_at as "updatedAt",
        COALESCE(AVG(n.walk_score), 0) as "walkScore",
        COALESCE(AVG(n.bike_score), 0) as "bikeScore", 
        COALESCE(AVG(n.transit_score), 0) as "transitScore"
      FROM properties p
      LEFT JOIN neighborhoods n ON p.city = n.city AND p.state = n.state
      ${whereClause}
      GROUP BY p.id, p.address, p.city, p.state, p.zip_code, p.price, 
               p.square_feet, p.bedrooms, p.bathrooms, p.year_built, p.property_type, 
               p.days_on_market, p.price_per_sqft, p.listing_status, p.features, p.description, 
               p.created_at, p.updated_at
      ORDER BY p.created_at DESC
      LIMIT $${limitParam} OFFSET $${offsetParam}
    `;

    const countQuery = `
      SELECT COUNT(DISTINCT p.id) as count 
      FROM properties p
      LEFT JOIN neighborhoods n ON p.city = n.city AND p.state = n.state
      ${whereClause}
    `;

    const allParams = [...queryParams, limit, offset];

    const [properties, countResult] = await Promise.all([
      prisma.$queryRawUnsafe(propertiesQuery, ...allParams),
      prisma.$queryRawUnsafe(countQuery, ...queryParams),
    ]);

    const totalCount = parseInt((countResult as any)[0].count);
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return NextResponse.json({
      properties,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        limit,
        hasNextPage,
        hasPrevPage,
      },
    });
  } catch (error) {
    console.error("Error fetching properties:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch properties",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
