import React, { useState } from "react";
import { FaSearch } from 'react-icons/fa'; // Importing Font Awesome search icon

const SearchBar = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleInputChange = (event) => {
    setSearchQuery(event.target.value);
    onSearch(event.target.value);
  };

  return (
    <div className="flex items-center relative w-full sm:w-1/3"> {/* Full width on mobile, 1/3 on larger screens */}
      <input
        type="text"
        value={searchQuery}
        onChange={handleInputChange}
        placeholder="Search by order ID, category, product, etc."
        className="p-2 pl-10 border border-gray-300 rounded w-full" // Padding for the icon space
      />
      <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" /> {/* Positioned search icon */}
    </div>
  );
};

export default SearchBar;
