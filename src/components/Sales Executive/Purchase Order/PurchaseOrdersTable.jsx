import React, { useState, useEffect } from "react";
import { HiOutlinePencil, HiOutlineTrash } from "react-icons/hi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from 'react-router-dom';

import { API_BASE_URL } from "../../../config"; 

const PurchaseOrdersTable = () => {
  const navigate = useNavigate();
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(50);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const handleViewClick = (referenceNo) => {
    // Navigate to the material inward page with the reference number as the grnId
    navigate(`/sales-executive/material-inward/${referenceNo}`);
  };

  useEffect(() => {
    fetchPurchaseOrders();
  }, []);

  const fetchPurchaseOrders = async () => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${API_BASE_URL}/api/purchase-order/purchase-orders`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (Array.isArray(data.data)) {
        setPurchaseOrders(data.data); // Only set purchase orders if the response is an array
      } else {
        setError("Invalid response format. Expected an array.");
      }
    } catch (error) {
      setError("An error occurred while fetching purchase orders.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter purchase orders based on multiple fields
  const filteredOrders = purchaseOrders.filter((order) =>
    order.referenceNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.fromPerson?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.toPerson?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.createdBy?.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

 

  const handleDelete = async (orderId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/api/purchase-order/purchase-orders/${orderId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setPurchaseOrders(purchaseOrders.filter((order) => order._id !== orderId));
        toast.success("Purchase order deleted successfully!");
      } else {
        toast.error("Failed to delete purchase order.");
      }
    } catch (error) {
      toast.error("An error occurred while deleting the purchase order.");
    }
  };

  const handleAddOrder = () => {
    navigate(`/sales-executive/purchaseOrder`);
  };


  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
      <div className="p-4">
        {/* Action section: Add Purchase Order & Search */}
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={handleAddOrder}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
          >
            Add Purchase Order
          </button>

          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search Purchase Orders..."
            className="p-2 border border-gray-300 rounded-md"
          />
        </div>

        {/* Loading/Error State */}
        {loading ? (
          <div className="text-center py-4">
            <p>Loading purchase orders...</p>
          </div>
        ) : error ? (
          <div className="text-center py-4 text-red-500">
            <p>{error}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            {/* Table */}
            <table className="min-w-full table-auto">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reference No
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    From Person
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    To Person
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created By
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    View Items
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                  
                </tr>
              </thead>
              <tbody className="bg-white">
                {/* Loop through the purchase order data */}
                {currentItems.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50 border-b border-gray-200">
                    <td className="px-4 py-2 text-sm">{order.referenceNo}</td>
                    <td className="px-4 py-2 text-sm">{order.fromPerson}</td>
                    <td className="px-4 py-2 text-sm">{order.toPerson}</td>
                    <td className="px-4 py-2 text-sm">{order.createdBy?.username}</td>
                    <td className="px-4 py-2 text-sm">
                      <button
                        onClick={() => handleViewClick(order.referenceNo)} // Call navigate on click
                        className="text-blue-500 hover:text-blue-700"
                      >
                        View
                      </button>
                    </td>
                    <td className="px-4 py-2 text-sm flex space-x-2">
                      
                      {/* Delete Button */}
                      <button
                        onClick={() => handleDelete(order._id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <HiOutlineTrash size={20} />
                      </button>
                    </td>
                    
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <div className="mt-4 flex justify-between items-center">
          <div>
            <span className="text-sm text-gray-500">
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, purchaseOrders.length)} of {purchaseOrders.length} orders
            </span>
          </div>

          <div className="flex space-x-2">
            {/* Previous Page Button */}
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-gray-200 text-gray-600 rounded-lg disabled:bg-gray-400"
            >
              Prev
            </button>
            {/* Next Page Button */}
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-gray-200 text-gray-600 rounded-lg disabled:bg-gray-400"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      

      <ToastContainer />
    </div>
  );
};

export default PurchaseOrdersTable;
