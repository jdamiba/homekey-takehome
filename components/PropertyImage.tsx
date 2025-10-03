"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ImageService } from "@/lib/services/images";

interface PropertyImageProps {
  propertyId: string;
  type?: "exterior" | "interior";
  alt?: string;
  className?: string;
  width?: number;
  height?: number;
  fallbackText?: string;
}

export function PropertyImage({
  propertyId,
  type = "exterior",
  alt = "Property image",
  className = "",
  width = 400,
  height = 300,
  fallbackText,
}: PropertyImageProps) {
  const [imageUrl, setImageUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        setIsLoading(true);
        setHasError(false);

        const response = await fetch(
          `/api/properties/${propertyId}/images?type=${type}`
        );
        const data = await response.json();

        if (response.ok && data.imageUrl) {
          setImageUrl(data.imageUrl);
        } else {
          throw new Error("Failed to fetch image");
        }
      } catch (error) {
        console.error("Error loading property image:", error);
        setHasError(true);
        // Use fallback image
        setImageUrl(ImageService.getRandomHouseImage());
      } finally {
        setIsLoading(false);
      }
    };

    fetchImage();
  }, [propertyId, type]);

  if (isLoading) {
    return (
      <div
        className={`bg-gray-200 animate-pulse flex items-center justify-center ${className}`}
        style={{ width, height }}
      >
        <div className="text-gray-400">
          <div className="text-2xl mb-2">🏠</div>
          <div className="text-sm">Loading...</div>
        </div>
      </div>
    );
  }

  if (hasError || !imageUrl) {
    return (
      <div
        className={`bg-gray-200 flex items-center justify-center ${className}`}
        style={{ width, height }}
      >
        <div className="text-center text-gray-400">
          <div className="text-4xl mb-2">🏠</div>
          <div className="text-sm">{fallbackText || "Property Image"}</div>
        </div>
      </div>
    );
  }

  return (
    <Image
      src={imageUrl}
      alt={alt}
      width={width}
      height={height}
      className={`object-cover ${className}`}
      onError={() => {
        setHasError(true);
        setImageUrl(ImageService.getRandomHouseImage());
      }}
    />
  );
}
