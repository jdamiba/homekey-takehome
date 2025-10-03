"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useState, useEffect } from "react";

interface SearchHistory {
  id: string;
  search_criteria: any;
  created_at: string;
  results_count: number;
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
  topCities: any[];
}

export default function Dashboard() {
  const { user, isLoaded } = useUser();
  const [searchHistory, setSearchHistory] = useState<SearchHistory[]>([]);
  const [favoritesSummary, setFavoritesSummary] = useState<FavoriteSummary[]>([]);
  const [totalFavorites, setTotalFavorites] = useState(0);
  const [marketInsights, setMarketInsights] = useState<MarketInsights | null>(null);
  const [loading, setLoading] = useState(true);

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
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back,{" "}
            {user.firstName || user.emailAddresses[0]?.emailAddress}!
          </h1>
          <p className="text-gray-600">
            Here's your property intelligence dashboard with personalized
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
            title="Compare Properties"
            description="Side-by-side property analysis"
            icon="⚖️"
            href="/comparisons"
            color="bg-green-500"
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
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">San Francisco, CA</p>
                  <p className="text-sm text-gray-600">3+ bed, $800k - $1.2M</p>
                </div>
                <span className="text-sm text-gray-500">2 hours ago</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Austin, TX</p>
                  <p className="text-sm text-gray-600">2+ bed, $400k - $600k</p>
                </div>
                <span className="text-sm text-gray-500">1 day ago</span>
              </div>
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
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">
                    123 Main St, San Francisco
                  </p>
                  <p className="text-sm text-gray-600">
                    $1,250,000 • 3 bed, 2 bath
                  </p>
                </div>
                <span className="text-sm text-gray-500">Saved 3 days ago</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">
                    456 Oak Ave, San Francisco
                  </p>
                  <p className="text-sm text-gray-600">
                    $950,000 • 2 bed, 1.5 bath
                  </p>
                </div>
                <span className="text-sm text-gray-500">Saved 1 week ago</span>
              </div>
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
                +5.2%
              </div>
              <p className="text-gray-600">Average price increase</p>
              <p className="text-sm text-gray-500">Last 12 months</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                28 days
              </div>
              <p className="text-gray-600">Average time on market</p>
              <p className="text-sm text-gray-500">Down from 35 days</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">94%</div>
              <p className="text-gray-600">Properties sold at asking</p>
              <p className="text-sm text-gray-500">Strong seller's market</p>
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
