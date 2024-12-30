import React, { useState } from 'react';
import Sidebar from '../../Layout/Sidebar';
import Navbar from '../../Layout/Navbar';
import SalesOrdersTable from './SalesOrdersTable';
import Pagination from './Pagination';

const SalesOrdersPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Function to toggle sidebar visibility
  const toggleSidebar = () => {
    setIsSidebarOpen((prevState) => !prevState);
  };

  return (
    <div className="flex">
      {/* Sidebar Component */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      
      {/* Main Content Area */}
      <div
        className={`flex-1 p-4 transition-all duration-300 ease-in-out ${
          isSidebarOpen ? 'ml-64' : 'ml-0'
        }`}
      >
        {/* Navbar Component */}
        <Navbar toggleSidebar={toggleSidebar} />
        
        <div className="mt-6">
          {/* Sales Orders Table */}
          <SalesOrdersTable />
          
          {/* Uncomment when Pagination is ready */}
          {/* <Pagination /> */}
        </div>
      </div>
    </div>
  );
};

export default SalesOrdersPage;
