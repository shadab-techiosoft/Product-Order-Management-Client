import React, { useState } from 'react';
import Sidebar from '../../Layout/Sidebar';
import Navbar from '../../Layout/Navbar';

import CategoriesTable from './CategoriesTable';
import CategoryForm from './CategoryForm';


const CategoriesPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Function to toggle sidebar visibility
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex">
      {/* Pass the isSidebarOpen state and toggleSidebar function as props */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      
      {/* Main content - Adjust the margin when sidebar is open */}
      <div className={`flex-1 p-4 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
        {/* Pass the toggleSidebar function to the Navbar */}
        <Navbar toggleSidebar={toggleSidebar} />
        <br />
        <div>
          {/* <CategoryForm /> */}
          <CategoriesTable />
          
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;
