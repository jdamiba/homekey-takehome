"use client";

import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { PropertyImage } from "@/components/PropertyImage";
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
}

export default function PropertyDetails() {
  const { user, isLoaded } = useUser();
  const {
    isFavorited,
    toggleFavorite,
    loading: favoritesLoading,
  } = useFavorites();
  const params = useParams();
  const propertyId = params.id as string;

  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/properties/${propertyId}`);
        if (!response.ok) {
          throw new Error("Property not found");
        }

        const data = await response.json();
        setProperty(data.property);
      } catch (err) {
        console.error("Error fetching property:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load property"
        );
      } finally {
        setLoading(false);
      }
    };

    if (propertyId) {
      fetchProperty();
    }
  }, [propertyId]);

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

  if (loading) {
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
                  <Link
                    href="/favorites"
                    className="text-gray-700 hover:text-indigo-600 font-medium"
                  >
                    Favorites
                  </Link>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                {isLoaded && user && (
                  <div className="flex items-center space-x-4">
                    <Link
                      href="/dashboard"
                      className="text-gray-700 hover:text-indigo-600 font-medium"
                    >
                      Dashboard
                    </Link>
                    <div className="h-8 w-8 bg-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {user.firstName?.[0] ||
                        user.emailAddresses[0]?.emailAddress[0].toUpperCase()}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </nav>

        {/* Loading State */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <p className="mt-2 text-gray-600">Loading property details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !property) {
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
                    href="/properties"
                    className="text-gray-700 hover:text-indigo-600 font-medium"
                  >
                    Properties
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Error State */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🏠</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Property Not Found
            </h1>
            <p className="text-gray-600 mb-6">
              {error || "The property you're looking for doesn't exist."}
            </p>
            <Link
              href="/properties"
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
            >
              Back to Properties
            </Link>
          </div>
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
                <Link
                  href="/favorites"
                  className="text-gray-700 hover:text-indigo-600 font-medium"
                >
                  Favorites
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {isLoaded && user && (
                <div className="flex items-center space-x-4">
                  <Link
                    href="/dashboard"
                    className="text-gray-700 hover:text-indigo-600 font-medium"
                  >
                    Dashboard
                  </Link>
                  <div className="h-8 w-8 bg-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {user.firstName?.[0] ||
                      user.emailAddresses[0]?.emailAddress[0].toUpperCase()}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            <li>
              <Link
                href="/properties"
                className="text-gray-500 hover:text-gray-700"
              >
                Properties
              </Link>
            </li>
            <li>
              <span className="text-gray-400">/</span>
            </li>
            <li>
              <span className="text-gray-900 font-medium">
                {property.address}
              </span>
            </li>
          </ol>
        </nav>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images and Basic Info */}
          <div className="lg:col-span-2">
            {/* Property Image */}
            <div className="mb-6">
              <PropertyImage
                propertyId={property.id}
                type="exterior"
                alt={`${property.address} property image`}
                className="w-full h-96 rounded-lg"
                width={800}
                height={384}
              />
            </div>

            {/* Property Details */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {property.address}
              </h1>
              <p className="text-xl text-gray-600 mb-6">
                {property.city}, {property.state} {property.zipCode}
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-indigo-600">
                    {formatPrice(property.price)}
                  </div>
                  <div className="text-sm text-gray-500">Price</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {property.bedrooms || "N/A"}
                  </div>
                  <div className="text-sm text-gray-500">Bedrooms</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {property.bathrooms || "N/A"}
                  </div>
                  <div className="text-sm text-gray-500">Bathrooms</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {property.squareFeet
                      ? property.squareFeet.toLocaleString()
                      : "N/A"}
                  </div>
                  <div className="text-sm text-gray-500">Sq Ft</div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                  Description
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  {property.description || "No description available."}
                </p>
              </div>

              {/* Features */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                  Features
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {property.features &&
                    Object.entries(property.features).map(
                      ([feature, value]) => (
                        <div
                          key={feature}
                          className="flex items-center space-x-2"
                        >
                          <span
                            className={`w-2 h-2 rounded-full ${
                              value ? "bg-green-500" : "bg-gray-300"
                            }`}
                          ></span>
                          <span className="text-sm text-gray-600 capitalize">
                            {feature.replace("_", " ")}
                          </span>
                        </div>
                      )
                    )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Location Scores and Actions */}
          <div className="space-y-6">
            {/* Location Scores */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Location Scores
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Walkability</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${property.walkScore}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-8">
                      {property.walkScore}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Bikability</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${property.bikeScore}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-8">
                      {property.bikeScore}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Transit</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-purple-500 h-2 rounded-full"
                        style={{ width: `${property.transitScore}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-8">
                      {property.transitScore}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Property Info */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Property Information
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Type</span>
                  <span className="text-gray-900 font-medium">
                    {formatPropertyType(property.propertyType)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Year Built</span>
                  <span className="text-gray-900 font-medium">
                    {property.yearBuilt || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Price per Sq Ft</span>
                  <span className="text-gray-900 font-medium">
                    {property.pricePerSqft
                      ? formatPrice(property.pricePerSqft)
                      : "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Days on Market</span>
                  <span className="text-gray-900 font-medium">
                    {property.daysOnMarket || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status</span>
                  <span className="text-gray-900 font-medium capitalize">
                    {property.listingStatus || "N/A"}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Actions
              </h2>
              <div className="space-y-3">
                <button
                  onClick={() => toggleFavorite(property.id)}
                  disabled={favoritesLoading}
                  className={`w-full py-2 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                    isFavorited(property.id)
                      ? "bg-red-600 text-white hover:bg-red-700"
                      : "bg-indigo-600 text-white hover:bg-indigo-700"
                  }`}
                >
                  {isFavorited(property.id)
                    ? "❤️ Remove from Favorites"
                    : "🤍 Save to Favorites"}
                </button>
                <button className="w-full bg-white border border-gray-300 text-gray-900 py-2 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                  Compare Properties
                </button>
                <button className="w-full bg-white border border-gray-300 text-gray-900 py-2 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                  Share Property
                </button>
                <button className="w-full bg-white border border-gray-300 text-gray-900 py-2 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                  Contact Agent
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
