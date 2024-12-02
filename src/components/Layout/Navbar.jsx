import React, { useState } from "react";
import { FaBars, FaUserCircle } from "react-icons/fa";

const Navbar = ({ toggleSidebar }) => {
  // State to manage visibility of the profile modal
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Dummy user data for the profile modal
  const userData = {
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+123 456 7890",
  };

  // Toggle function for opening/closing the profile modal
  const toggleProfileModal = () => {
    console.log("Profile Modal State Toggled:", isProfileOpen); // Check the state
    setIsProfileOpen(!isProfileOpen);
  };

  return (
    <div>
      <nav className="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-lg rounded-lg">
        {/* Left Section: Hamburger Menu for Sidebar */}
        <button
          className="p-2 rounded-md text-white hover:bg-indigo-700 transition-colors duration-300"
          onClick={toggleSidebar}
        >
          <FaBars className="text-2xl" />
        </button>

        {/* Center Section: App Title or Logo */}
        <div className="text-2xl font-bold tracking-wide text-white">
          <span className="text-indigo-100">My</span>
          <span className="text-pink-100">App</span>
        </div>

        {/* Right Section: Profile Section with Hover Effects */}
        <div onClick={toggleProfileModal} className="relative flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <FaUserCircle
              className="text-3xl hover:text-indigo-200 cursor-pointer transition-all duration-300"
               // Toggle profile modal on click
            />
            <span className="hidden sm:block text-lg hover:text-indigo-200 cursor-pointer transition-all duration-300">
              Profile
            </span>
          </div>

          {/* Profile Modal */}
          {isProfileOpen && (
            <div className="absolute top-full right-0 mt-2 w-64 bg-white shadow-lg rounded-lg p-4 z-50">
              {console.log("Rendering Profile Modal")} {/* Debugging */}
              <h2 className="text-xl font-semibold mb-4">User Profile</h2>
              <div className="mb-4">
                <strong className="text-black">Name:</strong>
                <p className="text-black">{userData.name}</p>
              </div>
              <div className="mb-4">
                <strong className="text-black">Email:</strong>
                <p className="text-black">{userData.email}</p>
              </div>
              <div className="mb-4">
                <strong className="text-black">Phone:</strong>
                <p className="text-black">{userData.phone}</p>
              </div>
              <div className="flex justify-end mt-4">
                <button
                  className="px-4 py-2 bg-red-500 text-white rounded"
                  onClick={toggleProfileModal} // Close modal
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
