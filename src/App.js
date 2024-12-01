import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import OrdersPage from './components/Client Components/OrdersPage'; // Orders Page Component
import SalesOrdersPage from './components/Sales Executive/Order Create/SalesOrdersPage';


function App() {
  return (
    <div className="App">
      <Router>
        {/* Define routes for different pages */}
        <Routes>
          {/* Home Route */}
          <Route path="/"  />
          
          {/* Orders Page Route */}
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/sales-executive/order" element={<SalesOrdersPage />} />
          
          
          
        </Routes>
      </Router>
    </div>
  );
}

export default App;
