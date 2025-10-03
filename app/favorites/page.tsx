"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { PropertyImage } from "@/components/PropertyImage";

export default function Favorites() {
  const { user, isLoaded } = useUser();

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

        {/* Favorites Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FavoritePropertyCard
            id="1"
            address="123 Main St"
            city="San Francisco"
            state="CA"
            price={1250000}
            bedrooms={3}
            bathrooms={2}
            squareFeet={1800}
            yearBuilt={1955}
            propertyType="Single Family"
            daysOnMarket={45}
            favoritedAt="2024-01-15"
            walkScore={85}
            transitScore={78}
            bikeScore={92}
            priceChange={50000}
            priceChangeType="increase"
          />
          <FavoritePropertyCard
            id="2"
            address="456 Oak Ave"
            city="San Francisco"
            state="CA"
            price={950000}
            bedrooms={2}
            bathrooms={1.5}
            squareFeet={1500}
            yearBuilt={1980}
            propertyType="Condo"
            daysOnMarket={23}
            favoritedAt="2024-01-10"
            walkScore={88}
            transitScore={82}
            bikeScore={90}
            priceChange={-25000}
            priceChangeType="decrease"
          />
          <FavoritePropertyCard
            id="3"
            address="789 Pine St"
            city="San Francisco"
            state="CA"
            price={1800000}
            bedrooms={4}
            bathrooms={3}
            squareFeet={2000}
            yearBuilt={2010}
            propertyType="Single Family"
            daysOnMarket={12}
            favoritedAt="2024-01-08"
            walkScore={92}
            transitScore={95}
            bikeScore={75}
            priceChange={0}
            priceChangeType="stable"
          />
        </div>

        {/* Empty State (when no favorites) */}
        {false && (
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

        {/* Comparison Actions */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Compare Properties
          </h2>
          <p className="text-gray-600 mb-4">
            Select properties to compare side-by-side and make informed
            decisions.
          </p>
          <div className="flex flex-wrap gap-2 mb-4">
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="rounded border-gray-300" />
              <span className="text-sm text-gray-700">123 Main St</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="rounded border-gray-300" />
              <span className="text-sm text-gray-700">456 Oak Ave</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="rounded border-gray-300" />
              <span className="text-sm text-gray-700">789 Pine St</span>
            </label>
          </div>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors">
            Compare Selected Properties
          </button>
        </div>
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
  favoritedAt,
  walkScore,
  transitScore,
  bikeScore,
  priceChange,
  priceChangeType,
}: {
  id: string;
  address: string;
  city: string;
  state: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  yearBuilt: number;
  propertyType: string;
  daysOnMarket: number;
  favoritedAt: string;
  walkScore: number;
  transitScore: number;
  bikeScore: number;
  priceChange: number;
  priceChangeType: "increase" | "decrease" | "stable";
}) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatPriceChange = (change: number) => {
    if (change === 0) return "No change";
    const sign = change > 0 ? "+" : "";
    return `${sign}${formatPrice(change)}`;
  };

  const getPriceChangeColor = (type: string) => {
    switch (type) {
      case "increase":
        return "text-red-600";
      case "decrease":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
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
          <button className="bg-white/80 hover:bg-white p-2 rounded-full transition-colors">
            <span className="text-red-500">❤️</span>
          </button>
        </div>
        <div className="absolute bottom-3 left-3">
          <span className="bg-indigo-600 text-white px-2 py-1 rounded text-sm font-medium">
            {propertyType}
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
            {formatPrice(price / squareFeet)}/sq ft
          </p>
          {priceChange !== 0 && (
            <p className={`text-sm ${getPriceChangeColor(priceChangeType)}`}>
              {formatPriceChange(priceChange)} from last month
            </p>
          )}
        </div>

        <div className="flex items-center space-x-4 mb-3 text-sm text-gray-900">
          <span>{bedrooms} bed</span>
          <span>{bathrooms} bath</span>
          <span>{squareFeet.toLocaleString()} sq ft</span>
          <span>{yearBuilt}</span>
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
            {daysOnMarket} days on market
          </span>
          <div className="flex space-x-2">
            <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
              View Details
            </button>
            <button className="text-red-600 hover:text-red-700 text-sm font-medium">
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
