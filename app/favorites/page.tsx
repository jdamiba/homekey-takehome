"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { PropertyImage } from "@/components/PropertyImage";
import { useState, useEffect } from "react";
import { useFavorites } from "@/hooks/useFavorites";

interface Property {
  id: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  price: number;
  squareFeet: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  yearBuilt: number | null;
  propertyType: string | null;
  daysOnMarket: number | null;
  pricePerSqft: number | null;
  listingStatus: string | null;
  features: any;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  walkScore: number;
  bikeScore: number;
  transitScore: number;
  favoritedAt: string;
}

export default function Favorites() {
  const { user, isLoaded } = useUser();
  const {
    isFavorited,
    toggleFavorite,
    loading: favoritesLoading,
  } = useFavorites();
  const [favoriteProperties, setFavoriteProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user's favorite properties
  const fetchFavorites = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/favorites");
      if (!response.ok) {
        throw new Error("Failed to fetch favorites");
      }

      const data = await response.json();
      setFavoriteProperties(data.favorites);
    } catch (err) {
      console.error("Error fetching favorites:", err);
      setError(err instanceof Error ? err.message : "Failed to load favorites");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && isLoaded) {
      fetchFavorites();
    }
  }, [user, isLoaded]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Sign In Required
          </h1>
          <p className="text-gray-600 mb-6">
            Please sign in to view your favorite properties.
          </p>
          <Link
            href="/"
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link href="/" className="text-2xl font-bold text-indigo-600">
                HomeKey
              </Link>
              <div className="hidden md:flex space-x-6">
                <Link
                  href="/dashboard"
                  className="text-gray-700 hover:text-indigo-600 font-medium"
                >
                  Dashboard
                </Link>
                <Link
                  href="/properties"
                  className="text-gray-700 hover:text-indigo-600 font-medium"
                >
                  Properties
                </Link>
                <Link href="/favorites" className="text-indigo-600 font-medium">
                  Favorites
                </Link>
                <Link
                  href="/comparisons"
                  className="text-gray-700 hover:text-indigo-600 font-medium"
                >
                  Comparisons
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Your Favorite Properties
          </h1>
          <p className="text-gray-600">
            Properties you've saved for future reference and comparison.
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <p className="mt-2 text-gray-600">Loading your favorites...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">😞</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Error Loading Favorites
            </h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={fetchFavorites}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Favorites Grid */}
        {!loading && !error && favoriteProperties.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteProperties.map((property) => (
              <FavoritePropertyCard
                key={property.id}
                id={property.id}
                address={property.address}
                city={property.city}
                state={property.state}
                price={property.price}
                bedrooms={property.bedrooms}
                bathrooms={property.bathrooms}
                squareFeet={property.squareFeet}
                yearBuilt={property.yearBuilt}
                propertyType={property.propertyType}
                daysOnMarket={property.daysOnMarket}
                pricePerSqft={property.pricePerSqft}
                walkScore={property.walkScore}
                bikeScore={property.bikeScore}
                transitScore={property.transitScore}
                favoritedAt={property.favoritedAt}
                isFavorited={isFavorited(property.id)}
                onToggleFavorite={() => toggleFavorite(property.id)}
                favoritesLoading={favoritesLoading}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && favoriteProperties.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">❤️</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No favorites yet
            </h3>
            <p className="text-gray-600 mb-6">
              Start exploring properties and save the ones you like to see them
              here.
            </p>
            <Link
              href="/properties"
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
            >
              Browse Properties
            </Link>
          </div>
        )}

        {/* Comparison Actions - Only show if there are favorites */}
        {!loading && !error && favoriteProperties.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Compare Properties
            </h2>
            <p className="text-gray-600 mb-4">
              Select properties to compare side-by-side and make informed
              decisions.
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              {favoriteProperties.map((property) => (
                <label
                  key={property.id}
                  className="flex items-center space-x-2"
                >
                  <input type="checkbox" className="rounded border-gray-300" />
                  <span className="text-sm text-gray-700">
                    {property.address}
                  </span>
                </label>
              ))}
            </div>
            <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors">
              Compare Selected Properties
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

function FavoritePropertyCard({
  id,
  address,
  city,
  state,
  price,
  bedrooms,
  bathrooms,
  squareFeet,
  yearBuilt,
  propertyType,
  daysOnMarket,
  pricePerSqft,
  walkScore,
  bikeScore,
  transitScore,
  favoritedAt,
  isFavorited,
  onToggleFavorite,
  favoritesLoading,
}: {
  id: string;
  address: string;
  city: string;
  state: string;
  price: number;
  bedrooms: number | null;
  bathrooms: number | null;
  squareFeet: number | null;
  yearBuilt: number | null;
  propertyType: string | null;
  daysOnMarket: number | null;
  pricePerSqft: number | null;
  walkScore: number;
  bikeScore: number;
  transitScore: number;
  favoritedAt: string;
  isFavorited: boolean;
  onToggleFavorite: () => void;
  favoritesLoading: boolean;
}) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatPropertyType = (type: string | null) => {
    if (!type) return "N/A";
    return type.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      {/* Property Image */}
      <div className="relative h-48 overflow-hidden">
        <PropertyImage
          propertyId={id}
          type="exterior"
          alt={`${address} property image`}
          className="w-full h-full"
          width={400}
          height={192}
        />
        <div className="absolute top-3 right-3">
          <button
            onClick={onToggleFavorite}
            disabled={favoritesLoading}
            className="bg-white/80 hover:bg-white p-2 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span
              className={`text-lg ${
                isFavorited
                  ? "text-red-500"
                  : "text-gray-400 hover:text-red-500"
              }`}
            >
              {isFavorited ? "❤️" : "🤍"}
            </span>
          </button>
        </div>
        <div className="absolute bottom-3 left-3">
          <span className="bg-indigo-600 text-white px-2 py-1 rounded text-sm font-medium">
            {formatPropertyType(propertyType)}
          </span>
        </div>
        <div className="absolute bottom-3 right-3">
          <span className="bg-white/80 text-gray-700 px-2 py-1 rounded text-xs">
            Saved {new Date(favoritedAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Property Details */}
      <div className="p-4">
        <div className="mb-2">
          <h3 className="text-lg font-semibold text-gray-900">{address}</h3>
          <p className="text-gray-900">
            {city}, {state}
          </p>
        </div>

        <div className="mb-3">
          <p className="text-2xl font-bold text-indigo-600">
            {formatPrice(price)}
          </p>
          <p className="text-sm text-gray-500">
            {pricePerSqft ? formatPrice(pricePerSqft) : "N/A"}/sq ft
          </p>
        </div>

        <div className="flex items-center space-x-4 mb-3 text-sm text-gray-900">
          <span>{bedrooms || "N/A"} bed</span>
          <span>{bathrooms || "N/A"} bath</span>
          <span>{squareFeet ? squareFeet.toLocaleString() : "N/A"} sq ft</span>
          <span>{yearBuilt || "N/A"}</span>
        </div>

        {/* Location Scores */}
        <div className="flex items-center space-x-4 mb-4 text-sm">
          <div className="flex items-center space-x-1">
            <span className="text-green-600">🚶</span>
            <span className="font-medium text-gray-900">{walkScore}</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="text-blue-600">🚌</span>
            <span className="font-medium text-gray-900">{transitScore}</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="text-orange-600">🚴</span>
            <span className="font-medium text-gray-900">{bikeScore}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">
            {daysOnMarket || 0} days on market
          </span>
          <div className="flex space-x-2">
            <Link
              href={`/properties/${id}`}
              className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
            >
              View Details
            </Link>
            <button
              onClick={onToggleFavorite}
              disabled={favoritesLoading}
              className="text-red-600 hover:text-red-700 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
