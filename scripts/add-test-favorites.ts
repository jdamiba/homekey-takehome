import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function addTestFavorites() {
  try {
    // Get a user and some properties
    const user = await prisma.user.findFirst();
    const properties = await prisma.property.findMany({ take: 3 });

    if (!user) {
      console.log("No users found in database");
      return;
    }

    if (properties.length === 0) {
      console.log("No properties found in database");
      return;
    }

    console.log(`Adding favorites for user: ${user.id}`);
    console.log(`Found ${properties.length} properties`);

    // Add favorites for the user
    for (const property of properties) {
      try {
        await prisma.userFavorite.create({
          data: {
            userId: user.id,
            propertyId: property.id,
          },
        });
        console.log(`Added favorite: ${property.address}, ${property.city}`);
      } catch (error) {
        // Ignore duplicate key errors
        if (
          error instanceof Error &&
          error.message.includes("Unique constraint")
        ) {
          console.log(
            `Favorite already exists for: ${property.address}, ${property.city}`
          );
        } else {
          console.error(
            `Error adding favorite for ${property.address}:`,
            error
          );
        }
      }
    }

    // Verify favorites were added
    const favorites = await prisma.userFavorite.findMany({
      where: { userId: user.id },
      include: { property: true },
    });

    console.log(`\nTotal favorites for user: ${favorites.length}`);
    favorites.forEach((fav) => {
      console.log(
        `- ${fav.property.address}, ${fav.property.city} (${fav.property.price})`
      );
    });
  } catch (error) {
    console.error("Error adding test favorites:", error);
  } finally {
    await prisma.$disconnect();
  }
}

addTestFavorites();
