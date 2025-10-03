"use client";

import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";

export function AuthButtons() {
  const { isSignedIn, user } = useUser();

  if (isSignedIn) {
    return (
      <div className="flex items-center space-x-4">
        <Link
          href="/dashboard"
          className="text-gray-700 hover:text-indigo-600 font-medium"
        >
          Dashboard
        </Link>
        <UserButton afterSignOutUrl="/" />
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-4">
      <SignInButton mode="modal">
        <button className="text-gray-700 hover:text-indigo-600 font-medium">
          Sign In
        </button>
      </SignInButton>
      <SignUpButton mode="modal">
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors">
          Get Started
        </button>
      </SignUpButton>
    </div>
  );
}
