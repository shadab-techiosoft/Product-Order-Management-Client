import React from "react";
import HeroImage from "../../assets/images/whatsapp.jpg"; // Replace with your actual image path

const HeroSection = () => {
  return (
    <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center py-16 ">
      {/* Left Column */}
      <div className="space-y-8">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
          Put <span className="underline decoration-indigo-400">people</span> first
        </h1>
        <p className="text-gray-600 text-lg">
          Fast, user-friendly, and engaging - turn HR into people and culture and streamline your daily operations with your own branded app.
        </p>
        <div className="flex gap-4">
          <input
            type="email"
            placeholder="Enter work email"
            className="border border-gray-300 rounded-full px-6 py-3 flex-grow md:w-2/3 focus:outline-none focus:ring focus:ring-indigo-300"
          />
          <button className="bg-indigo-500 text-white rounded-full px-8 py-3 hover:bg-indigo-600">
            Book a demo
          </button>
        </div>
        <div className="flex gap-8 pt-8">
          <div>
            <h3 className="text-2xl font-bold">75.2%</h3>
            <p className="text-gray-600 text-sm">Average daily activity</p>
          </div>
          <div>
            <h3 className="text-2xl font-bold">~20k</h3>
            <p className="text-gray-600 text-sm">Average daily users</p>
          </div>
          <div>
            <div className="flex items-center">
              <div className="text-yellow-400 text-lg">★★★★★</div>
              <span className="text-gray-600 text-sm ml-2">4.5</span>
            </div>
            <p className="text-gray-600 text-sm">Average user rating</p>
          </div>
        </div>
      </div>

      {/* Right Column - Image */}
      <div className="flex justify-center">
        <img
          src={HeroImage}
          alt="Hero Section"
          className="w-full max-w-md md:max-w-lg lg:max-w-xl object-contain"
        />
      </div>
    </div>
  );
};

export default HeroSection;
