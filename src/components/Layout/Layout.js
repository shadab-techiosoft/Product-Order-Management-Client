import React, { useState } from 'react';
import Sidebar from './Sidebar';  // Adjust path as needed
import Navbar from './Navbar';    // Adjust path as needed
import { Outlet } from 'react-router-dom';  // Used to render the current page content

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Function to toggle sidebar visibility
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex ">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      
      {/* Main content area */}
      <div className={`flex-1 p-4 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
        {/* Navbar */}
        <Navbar toggleSidebar={toggleSidebar} />
        <br />
        
        {/* Render the page-specific content here */}
        <div className="content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
