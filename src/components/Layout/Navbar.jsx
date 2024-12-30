import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaBars, FaUserCircle } from "react-icons/fa";
import {  MdInbox, MdPhoneAndroid, MdLogout } from 'react-icons/md';
import { API_BASE_URL } from "../../config";
// Helper function to fetch user details
const fetchUserDetails = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/users/details`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`, // Attach the token
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user details');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching user details:", error.message);
    throw error;
  }
};

const Navbar = ({ toggleSidebar }) => {
  // State to manage visibility of the profile modal
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // State to store user details
  const [userData, setUserData] = useState(null);

  // Fetch token from localStorage
  const token = localStorage.getItem('token');  // Assuming token is stored in localStorage

  // Fetch user details when the component mounts
  useEffect(() => {
    if (token) {
      fetchUserDetails(token)
        .then((data) => {
          // console.log("User Data Fetched:", data);  
          setUserData(data);  // Update user data state
        })
        .catch((error) => {
          console.error("Error in fetching user details:", error);
        });
    }
  }, [token]); // Only run on mount when token is available

  // Toggle function for opening/closing the profile modal
  const toggleProfileModal = () => {
    console.log("Profile Modal State Toggled:", !isProfileOpen);  // Log the new state value
    setIsProfileOpen(!isProfileOpen);
  };
  const truncateEmail = (email, maxLength) => {
    return email.length > maxLength ? `${email.slice(0, maxLength)}...` : email;
  };
  return (
    <div>
      <nav className="flex items-center justify-between p-4 bg-white  text-indigo-500 shadow-lg rounded-lg">
        {/* Left Section: Hamburger Menu for Sidebar */}
        <button
          className="p-2 rounded-md text-white bg-indigo-500 hover:bg-indigo-200 hover:text-indigo-500  transition-colors duration-300"
          onClick={toggleSidebar}
        >
          <FaBars className="text-2xl  " />
        </button>

        {/* Center Section: App Title or Logo */}
        
        {/* Search Bar Section */}
        <div className="flex-grow mx-4">
          <input
            type="text"
            placeholder="Search..."
            className="max-w-4xl p-2 rounded-full text-indigo-500 placeholder:text-indigo-500 border-indigo-500 border-2 focus:outline-none  focus:ring-indigo-500"
          />
        </div>

        {/* Right Section: Profile Section with Hover Effects */}
        <div onClick={toggleProfileModal} className="relative flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <FaUserCircle
              className="text-3xl hover:text-indigo-400 cursor-pointer transition-all duration-300"
            />
            <div className="hidden sm:block">
              <span className="text-lg hover:text-indigo-400 cursor-pointer transition-all duration-300">
                {userData?.name || 'Profile'}
              </span>
              {userData?.role && (
                <p className="text-sm">{userData.role}</p>
              )}
            </div>
          </div>

          <AnimatePresence>
        {isProfileOpen && userData && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="absolute top-full right-0 mt-2 w-64 bg-white border-indigo-500 border-2 shadow-lg rounded-lg z-50"
          >
            {/* User Header */}

            {/* Dropdown Items */}
            <div className="p-4 text-black">
              <ul className="space-y-4">
                {/* Mobile Number */}
                <li className="flex items-center space-x-2 cursor-pointer hover:text-blue-600 transition-all duration-300">
                  <MdPhoneAndroid className="text-xl" />
                  <span>{userData.mobileNo}</span>
                </li>
                {/* email  */}
                <li
                  className="flex items-center space-x-2 cursor-pointer hover:text-blue-600 transition-all duration-300"
                  title={userData.email}
                >
                  <MdInbox className="text-xl" />
                  <span>{truncateEmail(userData.email, 14)}</span>
                </li>

                {/* Sign Out */}
                <hr className="border-t border-indigo-500 my-2" />
                <li className="flex items-center justify-center space-x-2 cursor-pointer hover:text-red-600 transition-all duration-300">
                  <MdLogout className="text-xl" />
                  <span>Sign Out</span>
                </li>
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
        </div>
   

    
      </nav>
    </div>
  );
};

export default Navbar;
