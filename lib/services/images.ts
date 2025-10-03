// Image service for fetching property photos
// Using Unsplash API for demo purposes

interface UnsplashPhoto {
  id: string;
  urls: {
    small: string;
    regular: string;
    full: string;
  };
  alt_description: string;
  user: {
    name: string;
  };
}

// Cache for images to avoid repeated API calls
const imageCache = new Map<string, string>();

export class ImageService {
  private static readonly UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;
  private static readonly FALLBACK_IMAGES = [
    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&h=300&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=300&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=400&h=300&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400&h=300&fit=crop&auto=format",
  ];

  static async getPropertyImage(
    propertyId: string,
    type: "exterior" | "interior" = "exterior"
  ): Promise<string> {
    // Check cache first
    const cacheKey = `${propertyId}-${type}`;
    if (imageCache.has(cacheKey)) {
      return imageCache.get(cacheKey)!;
    }

    try {
      // If no API key, use fallback images
      if (!this.UNSPLASH_ACCESS_KEY) {
        const fallbackImage = this.getFallbackImage(propertyId);
        imageCache.set(cacheKey, fallbackImage);
        return fallbackImage;
      }

      // Fetch from Unsplash API
      const searchTerm =
        type === "exterior" ? "house exterior" : "house interior";
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
          searchTerm
        )}&per_page=30&client_id=${this.UNSPLASH_ACCESS_KEY}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch from Unsplash");
      }

      const data = await response.json();
      const photos: UnsplashPhoto[] = data.results;

      if (photos.length === 0) {
        return this.getFallbackImage(propertyId);
      }

      // Use property ID to consistently select the same image
      const index = this.hashStringToNumber(propertyId) % photos.length;
      const selectedPhoto = photos[index];

      const imageUrl = selectedPhoto.urls.regular;
      imageCache.set(cacheKey, imageUrl);

      return imageUrl;
    } catch (error) {
      console.error("Error fetching property image:", error);
      return this.getFallbackImage(propertyId);
    }
  }

  static async getMultiplePropertyImages(
    propertyId: string,
    count: number = 3
  ): Promise<string[]> {
    const images: string[] = [];

    // Get exterior image
    const exteriorImage = await this.getPropertyImage(propertyId, "exterior");
    images.push(exteriorImage);

    // Get additional interior images if needed
    for (let i = 1; i < count; i++) {
      const interiorImage = await this.getPropertyImage(
        `${propertyId}-${i}`,
        "interior"
      );
      images.push(interiorImage);
    }

    return images;
  }

  private static getFallbackImage(propertyId: string): string {
    // Use property ID to consistently select the same fallback image
    const index =
      this.hashStringToNumber(propertyId) % this.FALLBACK_IMAGES.length;
    return this.FALLBACK_IMAGES[index];
  }

  private static hashStringToNumber(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  // Generate placeholder image URL for development
  static getPlaceholderImage(
    width: number = 400,
    height: number = 300,
    text?: string
  ): string {
    const encodedText = text ? encodeURIComponent(text) : "Property";
    return `https://via.placeholder.com/${width}x${height}/f3f4f6/6b7280?text=${encodedText}`;
  }

  // Get random house image from a curated list
  static getRandomHouseImage(): string {
    const houseImages = [
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&h=300&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=300&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=400&h=300&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=400&h=300&fit=crop&auto=format",
    ];

    return houseImages[Math.floor(Math.random() * houseImages.length)];
  }
}
