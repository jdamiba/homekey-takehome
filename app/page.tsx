import { SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { AuthButtons } from "@/components/AuthButtons";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-indigo-600">
                HomeKey
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <AuthButtons />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Make Confident
            <span className="text-indigo-600"> Property Decisions</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Transform scattered property information into clear, reliable
            insights. Get comprehensive market analysis, location intelligence,
            and financial projections to make informed real estate decisions.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/properties"
              className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
            >
              Explore Properties
            </Link>
            <Link
              href="/about"
              className="border border-indigo-600 text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            title="Market Intelligence"
            description="Get real-time market data, price trends, and comparable sales analysis for any property."
            icon="📊"
          />
          <FeatureCard
            title="Location Insights"
            description="Access school ratings, crime statistics, walkability scores, and neighborhood amenities."
            icon="📍"
          />
          <FeatureCard
            title="Financial Analysis"
            description="Calculate total cost of ownership, ROI projections, and mortgage estimates."
            icon="💰"
          />
        </div>
      </main>
    </div>
  );
}

function FeatureCard({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: string;
}) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="text-3xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
