import React from 'react';
import { FaHome, FaBox, FaCog, FaClipboard, FaUsers, FaFileAlt, FaHeadset, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
// import { label } from 'framer-motion/client';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');  
    localStorage.removeItem('role'); 
    navigate('/login');  
  };

  // Define sidebar items
  const sidebarItems = [
    { icon: <FaHome />, label: 'Dashboard', path: '/dashboard' },
    { icon: <FaBox />, label: 'Inventory', path: '/inventory' },
    { icon: <FaClipboard />, label: 'Production', path: '/production' },
    { icon: <FaUsers />, label: 'Orders', path: '/orders' },
    { icon: <FaFileAlt />, label: 'Reports', path: '/reports' },
    { icon: <FaUsers />, label: 'User Access', path: '/user-access' },
    { icon: <FaHeadset />, label: 'Support', path: '/support' },
    { icon: <FaCog />, label: 'Settings', path: '/settings' },
    {icon:<FaSignOutAlt/>, label:'Logout' , path:'/login'}
  ];

  return (
    <aside
      className={`bg-indigo-500 text-white fixed top-4 rounded-e-md left-0 z-50 transition-transform duration-300 ease-in-out
        ${isOpen ? 'transform-none' : 'transform -translate-x-full'}
        ${isOpen ? 'w-64' : 'w-16'} h-full md:h-screen overflow-y-auto md:overflow-visible`}
    >
      <div className="flex items-center justify-between my-8 p-3">
        <div className={`${isOpen ? 'block' : 'hidden'} text-2xl font-bold`}>SMART ITBOX</div>
        <button className="md:hidden text-white" onClick={toggleSidebar}>
          Close
        </button>
      </div>

      <ul className="space-y-4">
        {sidebarItems.map(({ icon, label, path }, index) => (
          <motion.li
            key={index}
            className="flex items-center gap-1 sideList p-2 cursor-pointer hover:bg-white hover:text-indigo-500  overflow-hidden	"
            whileHover={{ scale: 1.05 }} 
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <Link to={path} className="flex items-center space-x-2 ml-2 w-full">
              {icon}
              <span className={`${isOpen ? 'block' : 'hidden'} text-white sideLink hover:text-indigo-500`}>
                {label}
              </span>
            </Link>
          </motion.li>
        ))}

        {/* <motion.li
          className="flex items-center space-x-4 sideList cursor-pointer hover:bg-white hover:text-indigo-500 p-2"
          whileHover={{ scale: 1.05 }} 
          transition={{ type: 'spring', stiffness: 300 }}
          onClick={handleLogout}
        >
          <FaSignOutAlt className="text-xl" />
          <span className={`${isOpen ? 'block' : 'hidden'} text-white sideLink hover:text-indigo-500`}>
            Logout
          </span>
        </motion.li> */}
      </ul>
    </aside>
  );
};

export default Sidebar;
