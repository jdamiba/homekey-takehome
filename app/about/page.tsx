"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";

export default function About() {
  const { user, isLoaded } = useUser();

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
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            About HomeKey
          </h1>

          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-gray-600 mb-8">
              HomeKey is a comprehensive property intelligence platform designed
              to transform scattered real estate information into clear,
              actionable insights for confident property decisions.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Our Mission
            </h2>
            <p className="text-gray-600 mb-6">
              We believe that buying a home should be an informed decision based
              on comprehensive data, not guesswork. Our platform aggregates
              property information from multiple sources to provide you with a
              complete picture of any property&apos;s value, location, and
              potential.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              What We Provide
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Market Intelligence
                </h3>
                <p className="text-gray-600">
                  Real-time market data, price trends, comparable sales, and
                  market conditions to help you understand property values and
                  market dynamics.
                </p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Location Insights
                </h3>
                <p className="text-gray-600">
                  School ratings, crime statistics, walkability scores, commute
                  times, and neighborhood amenities to evaluate the quality of
                  life in any area.
                </p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Financial Analysis
                </h3>
                <p className="text-gray-600">
                  Property taxes, HOA fees, insurance estimates, and ROI
                  projections to calculate the true cost of ownership and
                  investment potential.
                </p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Risk Assessment
                </h3>
                <p className="text-gray-600">
                  Flood zones, environmental hazards, structural issues, and
                  neighborhood stability indicators to identify potential risks
                  and concerns.
                </p>
              </div>
            </div>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              How It Works
            </h2>
            <div className="space-y-4 mb-8">
              <div className="flex items-start space-x-4">
                <div className="bg-indigo-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-semibold text-sm">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Search Properties
                  </h3>
                  <p className="text-gray-600">
                    Use our advanced filters to find properties that match your
                    criteria and budget.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-indigo-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-semibold text-sm">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Analyze Intelligence
                  </h3>
                  <p className="text-gray-600">
                    Review comprehensive property reports with market data,
                    location insights, and financial analysis.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-indigo-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-semibold text-sm">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Compare & Decide
                  </h3>
                  <p className="text-gray-600">
                    Compare multiple properties side-by-side and make informed
                    decisions with confidence.
                  </p>
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Get Started
            </h2>
            <p className="text-gray-600 mb-6">
              Ready to make confident property decisions? Sign up for free and
              start exploring properties with comprehensive intelligence and
              insights.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/properties"
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors text-center"
              >
                Explore Properties
              </Link>
              <Link
                href="/"
                className="border border-indigo-600 text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition-colors text-center"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
