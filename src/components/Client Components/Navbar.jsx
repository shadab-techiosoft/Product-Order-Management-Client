import React from 'react';
import { FaBars, FaSearch, FaUserCircle } from 'react-icons/fa';

const Navbar = ({ toggleSidebar }) => {
  return (
    <nav className="flex items-center justify-between p-4 bg-white shadow-md">
      {/* Left Section: Orders Title */}
      {/* <div className="text-2xl font-semibold text-gray-800">Orders</div> */}

      {/* Right Section: Search Bar and Profile */}
      <div className="flex items-center space-x-4">
      <button
          className="p-2 rounded-md text-gray-600 hover:bg-gray-200"
          onClick={toggleSidebar}
        >
          <FaBars className="text-2xl" />
        </button>
        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            className="border rounded px-4 py-2 text-gray-700 w-48 sm:w-64"
          />
          <FaSearch className="absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-500" />
        </div>

        {/* Profile Section */}
        <div className="flex items-center space-x-2 text-gray-700">
          <FaUserCircle className="text-2xl" />
          <span className="hidden sm:block">Profile</span>
        </div>

        {/* Hamburger Icon (Always Visible) */}
        
      </div>
    </nav>
  );
};

export default Navbar;
