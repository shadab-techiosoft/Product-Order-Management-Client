import React from "react";

export default function Hero() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation */}
        <nav className="flex justify-between items-center py-6">
          <a href="/" className="text-gray-900 text-xl font-bold">
            YOUR WEBSITE
          </a>
          <div className="hidden md:flex items-center space-x-8">
            <a href="/" className="text-gray-600 hover:text-gray-900">
              Home
            </a>
            <a href="/about" className="text-gray-600 hover:text-gray-900">
              About us
            </a>
            <a href="/work" className="text-gray-600 hover:text-gray-900">
              Work
            </a>
            <a href="/info" className="text-gray-600 hover:text-gray-900">
              Info
            </a>
            <button className="bg-indigo-600 text-white hover:bg-indigo-700 rounded-full px-6 py-2">
              Get Started
            </button>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="grid md:grid-cols-2 gap-12 items-center py-12 md:py-24">
          {/* Left Column */}
          <div className="space-y-8">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
              Inventory
              <br />
              Management
            </h1>
            <p className="text-gray-600 max-w-md">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eget libero feugiat, faucibus libero id,
              scelerisque quam.
            </p>
            <button className="bg-indigo-600 text-white hover:bg-indigo-700 rounded-full px-8 py-3">
              Button name
            </button>
          </div>

          {/* Right Column - Isometric Illustration */}
          <div className="relative h-[400px] md:h-[500px]">
            <svg className="w-full h-full" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Platform Base */}
              <rect x="50" y="200" width="300" height="150" fill="#E5E7EB" transform="skew(-30)" />

              {/* Product Displays */}
              <g transform="translate(100 150) rotate(-30)">
                <rect width="60" height="80" fill="url(#grad1)" />
                <rect x="15" y="20" width="30" height="30" fill="#4B5563" />
              </g>
              <g transform="translate(200 100) rotate(-30)">
                <rect width="60" height="80" fill="url(#grad1)" />
                <rect x="15" y="20" width="30" height="30" fill="#4B5563" />
              </g>
              <g transform="translate(300 150) rotate(-30)">
                <rect width="60" height="80" fill="url(#grad1)" />
                <rect x="15" y="20" width="30" height="30" fill="#4B5563" />
              </g>

              {/* Connecting Lines */}
              <path d="M100 200 L300 200 M200 100 L200 300" stroke="#6366F1" strokeWidth="2" strokeDasharray="4 4" />

              {/* Figures */}
              <g transform="translate(150 250) rotate(-30)">
                <rect width="20" height="40" rx="10" fill="#6366F1" />
              </g>
              <g transform="translate(250 150) rotate(-30)">
                <rect width="20" height="40" rx="10" fill="#6366F1" />
              </g>

              {/* Gradients */}
              <defs>
                <linearGradient id="grad1" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#F472B6" />
                  <stop offset="100%" stopColor="#6366F1" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
