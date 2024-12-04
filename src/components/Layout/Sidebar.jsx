import React from 'react';
import { FaHome, FaBox, FaCog, FaClipboard, FaUsers, FaFileAlt, FaHeadset, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'; 
const Sidebar = ({ isOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  const handleLogout = () => {
    
    localStorage.removeItem('token');  
    localStorage.removeItem('role'); 
    
    navigate('/login');  
  };
  return (
    <aside
      className={`bg-gray-800 text-white fixed top-0 left-0 z-50 transition-transform duration-300 ease-in-out
        ${isOpen ? 'transform-none' : 'transform -translate-x-full'}
        ${isOpen ? 'w-64' : 'w-16'} h-full md:h-screen overflow-y-auto md:overflow-visible`}
    >
      <div className="flex items-center justify-between mb-8">
        <div className={`${isOpen ? 'block' : 'hidden'} text-2xl font-bold text-white`}>SMART ITBOX</div>
        <button
          className="md:hidden text-white"
          onClick={toggleSidebar}
        >
          Close
        </button>
      </div>

      <ul className="space-y-4">
        <li className="flex items-center space-x-4 hover:bg-gray-700 p-2 rounded-md">
          <FaHome className="text-xl" />
          <span className={`${isOpen ? 'block' : 'hidden'}`}>Dashboard</span>
        </li>
        <li className="flex items-center space-x-4 hover:bg-gray-700 p-2 rounded-md">
          <FaBox className="text-xl" />
          <span className={`${isOpen ? 'block' : 'hidden'}`}>Inventory</span>
        </li>
        <li className="flex items-center space-x-4 hover:bg-gray-700 p-2 rounded-md">
          <FaClipboard className="text-xl" />
          <span className={`${isOpen ? 'block' : 'hidden'}`}>Production</span>
        </li>
        <li className="flex items-center space-x-4 hover:bg-gray-700 p-2 rounded-md">
          <FaUsers className="text-xl" />
          <span className={`${isOpen ? 'block' : 'hidden'}`}>Orders</span>
        </li>
        <li className="flex items-center space-x-4 hover:bg-gray-700 p-2 rounded-md">
          <FaFileAlt className="text-xl" />
          <span className={`${isOpen ? 'block' : 'hidden'}`}>Reports</span>
        </li>
        <li className="flex items-center space-x-4 hover:bg-gray-700 p-2 rounded-md">
          <FaUsers className="text-xl" />
          <span className={`${isOpen ? 'block' : 'hidden'}`}>User Access</span>
        </li>
        <li className="flex items-center space-x-4 hover:bg-gray-700 p-2 rounded-md">
          <FaHeadset className="text-xl" />
          <span className={`${isOpen ? 'block' : 'hidden'}`}>Support</span>
        </li>
        <li className="flex items-center space-x-4 hover:bg-gray-700 p-2 rounded-md">
          <FaCog className="text-xl" />
          <span className={`${isOpen ? 'block' : 'hidden'}`}>Settings</span>
        </li>
        <li className="flex items-center space-x-4 hover:bg-gray-700 p-2 rounded-md">
          <FaSignOutAlt className="text-xl" />
          <span className={`${isOpen ? 'block' : 'hidden'}`} onClick={handleLogout}>Logout</span>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
