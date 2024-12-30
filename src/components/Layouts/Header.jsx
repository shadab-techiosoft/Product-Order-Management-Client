import React, { useState, useEffect } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
   // Scroll event listener to toggle navbar style
   useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return (
  
      <div className=" mx-auto ">
        {/* Navigation */}
        <nav
        className={`${
          scrolled
            ? "bg-gray-50 shadow-lg sticky top-0 w-full"
            : "bg-gray-50  sticky top-0    mx-auto"
        } z-50 transition-all duration-300`}
      >
        <div className="px-2 max-w-7xl mx-auto">
          <div className="flex justify-between items-center py-6">
            {/* Logo */}
            <a href="/" className="text-gray-900 text-xl font-bold">
              YOUR WEBSITE
            </a>

            {/* /* Desktop Menu */} 
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
                    <button 
                    className="bg-indigo-600 text-white hover:bg-indigo-700 rounded-full px-6 py-2"
                    onClick={() => window.location.href = '/login'}
                    >
                    Get Started
                    </button>
                  </div>

                  {/* Mobile Menu Icon */}
            <div className="md:hidden">
              <button
                onClick={toggleMenu}
                className="text-gray-600 hover:text-gray-900 focus:outline-none"
              >
                {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          <div
            className={`${
              menuOpen ? "block" : "hidden"
            } md:hidden bg-gray-50 py-6 px-4 space-y-4 duration-75   transition-all`}
          >
            <a href="/" className="block text-gray-600 hover:text-gray-900">
              Home
            </a>
            <a href="/about" className="block text-gray-600 hover:text-gray-900">
              About us
            </a>
            <a href="/work" className="block text-gray-600 hover:text-gray-900">
              Work
            </a>
            <a href="/info" className="block text-gray-600 hover:text-gray-900">
              Info
            </a>
            <button className="bg-indigo-600 text-white hover:bg-indigo-700 rounded-full px-6 py-2 w-full">
              Get Started
            </button>
          </div>
        </div>
      </nav>

      
      </div>
    
  );
}
