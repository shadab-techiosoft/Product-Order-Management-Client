
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import OrdersPage from './components/Client Components/OrdersPage'; // Orders Page Component
import SalesOrdersPage from './components/Sales Executive/Order Create/SalesOrdersPage';
import Login from './components/Authentication/Login';
import ClientPage from './components/Sales Executive/Create Client/ClientPage';
import CategoriesPage from './components/Sales Executive/Items Master/CategoriesPage';
import Hero from './components/Hero';
import PrivateRoute from './PrivateRoute'; // Import the PrivateRoute component

import UserPage from './components/Authentication/UserPage';

function App() {
  return (
    <div className="App">
      <Router>
        {/* Define routes for different pages */}
        <Routes>
          {/* Home Route */}
          <Route path="/" element={<Hero />} />
          
          {/* Login Route */}
          <Route path="/login" element={<Login />} />
          
          {/* Orders Page Route (client role only) */}
          <Route path="/orders" element={<PrivateRoute allowedRoles={['client']} element={<OrdersPage />} />} />
          <Route path="/admin/users" element={<PrivateRoute allowedRoles={['admin']} element={<UserPage />} />} />
          
          {/* Sales Orders Page Route (sales executive role only) */}
          <Route path="/sales-executive/order" element={<PrivateRoute allowedRoles={['sales executive']} element={<SalesOrdersPage />} />} />
          
          {/* Client Management Route (sales executive role only) */}
          <Route path="/sales-executive/clients" element={<PrivateRoute allowedRoles={['sales executive']} element={<ClientPage />} />} />
          
          {/* Categories Management Route (sales executive role only) */}
          <Route path="/sales-executive/items-master" element={<PrivateRoute allowedRoles={['sales executive']} element={<CategoriesPage />} />} />
          
          {/* You can add more protected routes here */}
        </Routes>
      </Router>
    </div>
  );
}

export default App;



// import './App.css';
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import OrdersPage from './components/Client Components/OrdersPage'; // Orders Page Component
// import SalesOrdersPage from './components/Sales Executive/Order Create/SalesOrdersPage';
// import Login from './components/Authentication/Login';
// import ClientPage from './components/Sales Executive/Create Client/ClientPage';
// import CategoriesPage from './components/Sales Executive/Items Master/CategoriesPage';
// import Hero from './components/Hero';


// function App() {
//   return (
//     <div className="App">
//       <Router>
//         {/* Define routes for different pages */}
//         <Routes>
//           {/* Home Route */}
//           <Route path="/"  element={<Hero />}/>
//           <Route path="/login" element={<Login />} />
//           {/* Orders Page Route */}
//           <Route path="/orders" element={<OrdersPage />} />
//           <Route path="/sales-executive/order" element={<SalesOrdersPage />} />
//           <Route path="/sales-executive/clients" element={<ClientPage />} />
//           <Route path="/sales-executive/items-master" element={<CategoriesPage />} />
          
          
          
//         </Routes>
//       </Router>
//     </div>
//   );
// }

// export default App;



