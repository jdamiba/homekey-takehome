import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";

export function useFavorites() {
  const { user, isLoaded } = useUser();
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  // Check if a property is favorited
  const isFavorited = (propertyId: string) => {
    return favorites.has(propertyId);
  };

  // Toggle favorite status
  const toggleFavorite = async (propertyId: string) => {
    if (!user || loading) return;

    setLoading(true);
    try {
      const isCurrentlyFavorited = favorites.has(propertyId);

      if (isCurrentlyFavorited) {
        // Remove from favorites
        const response = await fetch("/api/favorites", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ propertyId }),
        });

        if (response.ok) {
          setFavorites((prev) => {
            const newFavorites = new Set(prev);
            newFavorites.delete(propertyId);
            return newFavorites;
          });
        } else {
          console.error("Failed to remove from favorites");
        }
      } else {
        // Add to favorites
        const response = await fetch("/api/favorites", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ propertyId }),
        });

        if (response.ok) {
          setFavorites((prev) => new Set(prev).add(propertyId));
        } else {
          console.error("Failed to add to favorites");
        }
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    } finally {
      setLoading(false);
    }
  };

  // Load user's favorites on mount
  useEffect(() => {
    const loadFavorites = async () => {
      if (!user || !isLoaded) return;

      try {
        const response = await fetch("/api/favorites");
        if (response.ok) {
          const data = await response.json();
          const favoriteIds = data.favorites.map((fav: any) => fav.id);
          setFavorites(new Set(favoriteIds));
        }
      } catch (error) {
        console.error("Error loading favorites:", error);
      }
    };

    loadFavorites();
  }, [user, isLoaded]);

  return {
    favorites,
    isFavorited,
    toggleFavorite,
    loading,
    isLoaded,
  };
}
