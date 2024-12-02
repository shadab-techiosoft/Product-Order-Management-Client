import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import OrdersPage from './components/Client Components/OrdersPage'; // Orders Page Component
import SalesOrdersPage from './components/Sales Executive/Order Create/SalesOrdersPage';
import Login from './components/Authentication/Login';
import ClientPage from './components/Sales Executive/Create Client/ClientPage';
import CategoriesPage from './components/Sales Executive/Items Master/CategoriesPage';


function App() {
  return (
    <div className="App">
      <Router>
        {/* Define routes for different pages */}
        <Routes>
          {/* Home Route */}
          <Route path="/"  />
          <Route path="/login" element={<Login />} />
          {/* Orders Page Route */}
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/sales-executive/order" element={<SalesOrdersPage />} />
          <Route path="/sales-executive/clients" element={<ClientPage />} />
          <Route path="/sales-executive/items-master" element={<CategoriesPage />} />
          
          
          
        </Routes>
      </Router>
    </div>
  );
}

export default App;
