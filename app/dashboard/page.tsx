"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useState, useEffect } from "react";
import { MobileNav } from "@/components/MobileNav";

interface SearchHistory {
  id: string;
  search_criteria: {
    city?: string;
    minPrice?: string;
    maxPrice?: string;
    bedrooms?: string;
    bathrooms?: string;
    propertyType?: string;
  };
  created_at: string;
}

interface FavoriteSummary {
  id: string;
  address: string;
  city: string;
  state: string;
  price: number;
  bedrooms: number | null;
  bathrooms: number | null;
  favorited_at: string;
}

interface MarketInsights {
  priceIncrease: number;
  avgDaysOnMarket: number;
  soldAtAskingPercentage: number;
  totalActiveProperties: number;
  avgPrice: number;
  topCities: Array<{
    city: string;
    state: string;
    property_count: number;
    avg_price: number;
  }>;
}

export default function Dashboard() {
  const { user, isLoaded } = useUser();
  const [searchHistory, setSearchHistory] = useState<SearchHistory[]>([]);
  const [favoritesSummary, setFavoritesSummary] = useState<FavoriteSummary[]>(
    []
  );
  const [marketInsights, setMarketInsights] = useState<MarketInsights | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user || !isLoaded) return;

      try {
        setLoading(true);

        // Fetch data in parallel
        const [searchesResponse, favoritesResponse, marketResponse] =
          await Promise.all([
            fetch(`/api/users/${user.id}/searches`),
            fetch(`/api/users/${user.id}/favorites-summary`),
            fetch("/api/market-insights"),
          ]);

        if (searchesResponse.ok) {
          const searchesData = await searchesResponse.json();
          setSearchHistory(searchesData.searches || []);
        } else {
          console.error(
            "Searches API error:",
            searchesResponse.status,
            await searchesResponse.text()
          );
        }

        if (favoritesResponse.ok) {
          const favoritesData = await favoritesResponse.json();
          console.log("Favorites data received:", favoritesData);
          setFavoritesSummary(favoritesData.recentFavorites || []);
        } else {
          console.error(
            "Favorites API error:",
            favoritesResponse.status,
            await favoritesResponse.text()
          );
        }

        if (marketResponse.ok) {
          const marketData = await marketResponse.json();
          setMarketInsights(marketData.insights);
        } else {
          console.error(
            "Market API error:",
            marketResponse.status,
            await marketResponse.text()
          );
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
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
            Access Denied
          </h1>
          <p className="text-gray-600 mb-6">
            Please sign in to access your dashboard.
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Navigation */}
        <nav className="bg-white shadow-sm border-b relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-8">
                <Link href="/" className="text-2xl font-bold text-indigo-600">
                  HomeKey
                </Link>
                <div className="hidden md:flex space-x-6">
                  <Link
                    href="/dashboard"
                    className="text-indigo-600 font-medium"
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
                <UserButton afterSignOutUrl="/" />
                <MobileNav currentPath="/dashboard" />
              </div>
            </div>
          </div>
        </nav>

        {/* Loading State */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <p className="mt-2 text-gray-600">Loading your dashboard...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link href="/" className="text-2xl font-bold text-indigo-600">
                HomeKey
              </Link>
              <div className="hidden md:flex space-x-6">
                <Link href="/dashboard" className="text-indigo-600 font-medium">
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
              <UserButton afterSignOutUrl="/" />
              <MobileNav currentPath="/dashboard" />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back,{" "}
            {user.firstName || user.emailAddresses[0]?.emailAddress}!
          </h1>
          <p className="text-gray-600">
            Here&apos;s your property intelligence dashboard with personalized
            insights and recommendations.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <QuickActionCard
            title="Search Properties"
            description="Find your next home with advanced filters"
            icon="🔍"
            href="/properties"
            color="bg-blue-500"
          />
          <QuickActionCard
            title="View Favorites"
            description="See your saved properties"
            icon="❤️"
            href="/favorites"
            color="bg-red-500"
          />
          <QuickActionCard
            title="Market Trends"
            description="Latest market insights"
            icon="📈"
            href="/market"
            color="bg-purple-500"
          />
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Recent Searches
            </h2>
            <div className="space-y-3">
              {searchHistory.length > 0 ? (
                searchHistory.map((search) => {
                  // Create URL parameters from search criteria
                  const searchParams = new URLSearchParams();
                  if (search.search_criteria?.city)
                    searchParams.set("city", search.search_criteria.city);
                  if (search.search_criteria?.minPrice)
                    searchParams.set(
                      "minPrice",
                      search.search_criteria.minPrice
                    );
                  if (search.search_criteria?.maxPrice)
                    searchParams.set(
                      "maxPrice",
                      search.search_criteria.maxPrice
                    );
                  if (search.search_criteria?.bedrooms)
                    searchParams.set(
                      "bedrooms",
                      search.search_criteria.bedrooms
                    );
                  if (search.search_criteria?.bathrooms)
                    searchParams.set(
                      "bathrooms",
                      search.search_criteria.bathrooms
                    );
                  if (search.search_criteria?.propertyType)
                    searchParams.set(
                      "propertyType",
                      search.search_criteria.propertyType
                    );

                  const searchUrl = `/properties?${searchParams.toString()}`;

                  return (
                    <Link
                      key={search.id}
                      href={searchUrl}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                      <div>
                        <p className="font-medium text-gray-900">
                          {search.search_criteria?.city || "Any Location"}
                        </p>
                        <p className="text-sm text-gray-600">
                          {search.search_criteria?.bedrooms
                            ? `${search.search_criteria.bedrooms}+ bed`
                            : "Any beds"}
                          ,
                          {search.search_criteria?.minPrice &&
                          search.search_criteria?.maxPrice
                            ? ` $${(
                                Number(search.search_criteria.minPrice) / 1000
                              ).toFixed(0)}k - $${(
                                Number(search.search_criteria.maxPrice) / 1000
                              ).toFixed(0)}k`
                            : "Any price"}
                        </p>
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(search.created_at).toLocaleDateString()}
                      </span>
                    </Link>
                  );
                })
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-500 mb-2">No recent searches</p>
                  <Link
                    href="/properties"
                    className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                  >
                    Start searching →
                  </Link>
                </div>
              )}
            </div>
            <Link
              href="/properties"
              className="block mt-4 text-indigo-600 hover:text-indigo-700 font-medium"
            >
              View all searches →
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Saved Properties
            </h2>
            <div className="space-y-3">
              {favoritesSummary.length > 0 ? (
                favoritesSummary.map((favorite) => (
                  <div
                    key={favorite.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-900">
                        {favorite.address}, {favorite.city}
                      </p>
                      <p className="text-sm text-gray-600">
                        ${favorite.price.toLocaleString()} •{" "}
                        {favorite.bedrooms || "N/A"} bed,{" "}
                        {favorite.bathrooms || "N/A"} bath
                      </p>
                    </div>
                    <span className="text-sm text-gray-500">
                      Saved{" "}
                      {new Date(favorite.favorited_at).toLocaleDateString()}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-500 mb-2">No saved properties yet</p>
                  <Link
                    href="/properties"
                    className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                  >
                    Browse properties →
                  </Link>
                </div>
              )}
            </div>
            <Link
              href="/favorites"
              className="block mt-4 text-indigo-600 hover:text-indigo-700 font-medium"
            >
              View all favorites →
            </Link>
          </div>
        </div>

        {/* Market Insights */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Market Insights
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {marketInsights ? `+${marketInsights.priceIncrease}%` : "--"}
              </div>
              <p className="text-gray-600">Average price increase</p>
              <p className="text-sm text-gray-500">Current market</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {marketInsights
                  ? `${marketInsights.avgDaysOnMarket} days`
                  : "--"}
              </div>
              <p className="text-gray-600">Average time on market</p>
              <p className="text-sm text-gray-500">
                {marketInsights
                  ? `${marketInsights.totalActiveProperties} active properties`
                  : "Loading..."}
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {marketInsights
                  ? `${marketInsights.soldAtAskingPercentage}%`
                  : "--"}
              </div>
              <p className="text-gray-600">Properties sold at asking</p>
              <p className="text-sm text-gray-500">
                {marketInsights
                  ? `Avg price: $${marketInsights.avgPrice.toLocaleString()}`
                  : "Loading..."}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function QuickActionCard({
  title,
  description,
  icon,
  href,
  color,
}: {
  title: string;
  description: string;
  icon: string;
  href: string;
  color: string;
}) {
  return (
    <Link href={href} className="block">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <div
          className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center text-white text-xl mb-4`}
        >
          {icon}
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </Link>
  );
}
