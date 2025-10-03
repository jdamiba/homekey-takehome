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
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export default function Properties() {
  const { user, isLoaded } = useUser();
  const {
    isFavorited,
    toggleFavorite,
    loading: favoritesLoading,
  } = useFavorites();
  const [properties, setProperties] = useState<Property[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [filters, setFilters] = useState({
    city: "",
    minPrice: "",
    maxPrice: "",
    propertyType: "",
    bedrooms: "",
    bathrooms: "",
  });
  const [sorting, setSorting] = useState({
    sortBy: "created_at",
    sortOrder: "desc",
  });

  // Fetch properties from API
  const fetchProperties = async (page: number = 1, reset: boolean = false) => {
    try {
      if (page === 1) setLoading(true);
      else setLoadingMore(true);

      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        ...filters,
        ...sorting,
      });

      const response = await fetch(`/api/properties?${params}`);
      if (!response.ok) throw new Error("Failed to fetch properties");

      const data = await response.json();

      if (reset || page === 1) {
        setProperties(data.properties);
      } else {
        setProperties((prev) => [...prev, ...data.properties]);
      }

      setPagination(data.pagination);
    } catch (error) {
      console.error("Error fetching properties:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Load initial properties
  useEffect(() => {
    fetchProperties(1, true);
  }, [sorting]);

  // Handle search
  const handleSearch = () => {
    fetchProperties(1, true);
  };

  // Handle load more
  const handleLoadMore = () => {
    if (pagination?.hasNextPage) {
      fetchProperties(pagination.currentPage + 1, false);
    }
  };

  // Handle filter changes
  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Handle sorting changes
  const handleSortChange = (sortBy: string, sortOrder: string) => {
    setSorting({ sortBy, sortOrder });
  };

  // Get current price range selection
  const getCurrentPriceRange = () => {
    const { minPrice, maxPrice } = filters;
    if (!minPrice && !maxPrice) return "";
    if (minPrice === "0" && maxPrice === "499999") return "under-500k";
    if (minPrice === "500000" && maxPrice === "749999") return "500k-750k";
    if (minPrice === "750000" && maxPrice === "999999") return "750k-1m";
    if (minPrice === "1000000" && maxPrice === "1499999") return "1m-1.5m";
    if (minPrice === "1500000" && !maxPrice) return "over-1.5m";
    return "";
  };

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
                  className="text-indigo-600 font-medium"
                >
                  Properties
                </Link>
                <Link
                  href="/favorites"
                  className="text-gray-700 hover:text-indigo-600 font-medium"
                >
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
              {isLoaded && user && <UserButton afterSignOutUrl="/" />}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Property Search
          </h1>
          <p className="text-gray-600">
            Discover your next home with comprehensive property intelligence and
            market insights.
          </p>
        </div>

        {/* Search Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                placeholder="City, State, or ZIP"
                value={filters.city}
                onChange={(e) => handleFilterChange("city", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price Range
              </label>
              <select
                value={getCurrentPriceRange()}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "") {
                    handleFilterChange("minPrice", "");
                    handleFilterChange("maxPrice", "");
                  } else if (value === "under-500k") {
                    handleFilterChange("minPrice", "0");
                    handleFilterChange("maxPrice", "499999");
                  } else if (value === "500k-750k") {
                    handleFilterChange("minPrice", "500000");
                    handleFilterChange("maxPrice", "749999");
                  } else if (value === "750k-1m") {
                    handleFilterChange("minPrice", "750000");
                    handleFilterChange("maxPrice", "999999");
                  } else if (value === "1m-1.5m") {
                    handleFilterChange("minPrice", "1000000");
                    handleFilterChange("maxPrice", "1499999");
                  } else if (value === "over-1.5m") {
                    handleFilterChange("minPrice", "1500000");
                    handleFilterChange("maxPrice", "");
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
              >
                <option value="">Any Price</option>
                <option value="under-500k">Under $500k</option>
                <option value="500k-750k">$500k - $750k</option>
                <option value="750k-1m">$750k - $1M</option>
                <option value="1m-1.5m">$1M - $1.5M</option>
                <option value="over-1.5m">Over $1.5M</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bedrooms
              </label>
              <select
                value={filters.bedrooms}
                onChange={(e) => handleFilterChange("bedrooms", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
              >
                <option value="">Any</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
                <option value="5">5+</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Property Type
              </label>
              <select
                value={filters.propertyType}
                onChange={(e) =>
                  handleFilterChange("propertyType", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
              >
                <option value="">Any Type</option>
                <option value="single_family">Single Family</option>
                <option value="condo">Condo</option>
                <option value="townhouse">Townhouse</option>
                <option value="multi_family">Multi-Family</option>
              </select>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleSearch}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
            >
              Search Properties
            </button>
          </div>
        </div>

        {/* Sorting Controls */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-700">
                Sort by:
              </label>
              <select
                value={sorting.sortBy}
                onChange={(e) =>
                  handleSortChange(e.target.value, sorting.sortOrder)
                }
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
              >
                <option value="created_at">Date Added</option>
                <option value="price">Price</option>
                <option value="walkScore">Walkability</option>
                <option value="bikeScore">Bikability</option>
                <option value="transitScore">Transit</option>
                <option value="bedrooms">Bedrooms</option>
                <option value="bathrooms">Bathrooms</option>
                <option value="squareFeet">Square Feet</option>
                <option value="yearBuilt">Year Built</option>
              </select>
              <select
                value={sorting.sortOrder}
                onChange={(e) =>
                  handleSortChange(sorting.sortBy, e.target.value)
                }
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
              >
                <option value="desc">High to Low</option>
                <option value="asc">Low to High</option>
              </select>
            </div>
            <div className="text-sm text-gray-500">
              {pagination?.totalCount && (
                <span>{pagination.totalCount} properties found</span>
              )}
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <p className="mt-2 text-gray-600">Loading properties...</p>
          </div>
        )}

        {/* Property Grid */}
        {!loading && (
          <>
            {properties.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {properties.map((property) => (
                    <PropertyCard
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
                      isFavorited={isFavorited(property.id)}
                      onToggleFavorite={() => toggleFavorite(property.id)}
                      favoritesLoading={favoritesLoading}
                    />
                  ))}
                </div>

                {/* Load More */}
                {pagination?.hasNextPage && (
                  <div className="text-center mt-8">
                    <button
                      onClick={handleLoadMore}
                      disabled={loadingMore}
                      className="bg-white border border-gray-300 text-gray-900 px-6 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loadingMore ? (
                        <span className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                          Loading...
                        </span>
                      ) : (
                        `Load More Properties (${
                          pagination.totalCount - properties.length
                        } remaining)`
                      )}
                    </button>
                  </div>
                )}

                {/* Results Summary */}
                <div className="text-center mt-6 text-gray-600">
                  Showing {properties.length} of {pagination?.totalCount}{" "}
                  properties
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600">
                  No properties found matching your criteria.
                </p>
                <button
                  onClick={() => {
                    setFilters({
                      city: "",
                      minPrice: "",
                      maxPrice: "",
                      propertyType: "",
                      bedrooms: "",
                      bathrooms: "",
                    });
                    fetchProperties(1, true);
                  }}
                  className="mt-4 text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  Clear filters and show all properties
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

function PropertyCard({
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
        <div className="flex items-center space-x-4 mb-3 text-sm text-gray-900">
          <span>Walkability: {walkScore}</span>
          <span>Bikability: {bikeScore}</span>
          <span>Transit: {transitScore}</span>
        </div>

        {/* Property Type Badge */}
        <div className="mb-4">
          <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full font-medium">
            {propertyType
              ? propertyType
                  .replace("_", " ")
                  .replace(/\b\w/g, (l) => l.toUpperCase())
              : "N/A"}
          </span>
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
            <button className="text-gray-900 hover:text-gray-700 text-sm font-medium">
              Compare
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
