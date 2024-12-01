import React, { useEffect, useState } from "react";
import MobileOrderCard from "./MobileOrderCard";

import { ToastContainer, toast } from "react-toastify"; // Import toast notifications
import "react-toastify/dist/ReactToastify.css"; // Import toast CSS
import { FaEdit, FaTrash } from "react-icons/fa";
import EditOrderModal from "./EditOrderModal";

const SalesOrdersTable = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedItems, setExpandedItems] = useState({});
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [orderToEdit, setOrderToEdit] = useState(null); // Order data to be edited
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3NGE5NmUxYWM2OWVlOGM1NzVmMDQzMCIsInJvbGUiOiJzYWxlcyBleGVjdXRpdmUiLCJpYXQiOjE3MzMwMzc1MjAsImV4cCI6MTczMzEyMzkyMH0.EKMWiQkJEnwIbnzjneb-VBUqV1oxtYSMz1l8i9xsqxQ"; // Replace with your actual token

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/orderItem/get",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }

        const data = await response.json();
        setOrders(data.orders);

        const initialExpandedState = data.orders.reduce((acc, order) => {
          acc[order._id] = false;
          return acc;
        }, {});

        setExpandedItems(initialExpandedState);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  const getActionClass = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-200 text-yellow-800";
      case "Accept":
        return "bg-green-200 text-green-800";
      case "Reject":
        return "bg-red-200 text-red-800";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  const toggleItemRow = (orderId) => {
    setExpandedItems((prevState) => ({
      ...prevState,
      [orderId]: !prevState[orderId],
    }));
  };

  
  const openEditModal = (order) => {
    setOrderToEdit(order);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setOrderToEdit(null);
  };
  const handleOrderCreated = (newOrder) => {
    setOrders((prevOrders) => [newOrder, ...prevOrders]);
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/orderItem/accept-reject/${orderId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      // Update the order in the state
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );

      // Show a success toast
      toast.success("Order status updated successfully!");
    } catch (error) {
      // Show an error toast
      toast.error("Error: " + error.message);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/orderItem/${orderId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete order");
      }

      setOrders((prevOrders) =>
        prevOrders.filter((order) => order._id !== orderId)
      );
      toast.success("Order deleted successfully!");
    } catch (error) {
      toast.error("Error: " + error.message);
    }
  };


  // Sorting orders by creation date (latest first) and status
  const sortedOrders = orders.sort((a, b) => {
    // Sort by creation date (latest first)
    const dateComparison = new Date(b.createdAt) - new Date(a.createdAt);
    if (dateComparison !== 0) return dateComparison;

    // Sort by status in this order: Pending, Reject, Accept
    const statusOrder = ["Pending", "Reject", "Accept"];
    return statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status);
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <ToastContainer />


      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse hidden sm:table">
          <thead>
            <tr className="text-left bg-gray-100 text-sm text-gray-700">
              <th className="p-4">#</th>
              <th className="p-4">Product Items</th>
              <th className="p-4">Category</th>
              <th className="p-4">Quantity</th>
              <th className="p-4">Price</th>
              <th className="p-4">Total Amount</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {sortedOrders.map((order, orderIndex) => (
              <React.Fragment key={order._id}>
                {/* Order summary row with alternating colors */}
                <tr
                  className={`border-b ${
                    orderIndex % 2 === 0 ? "bg-white" : "bg-yellow-100"
                  }`}
                >
                  <td colSpan="7" className="p-4">
                    <div className="flex justify-between">
                      <div>
                        <strong>Order ID: {order._id}</strong>
                        {order.totalItemAmount === 0 && (
  <span className="bg-red-200 text-black-800 font-semibold ml-2 px-3 py-1 rounded-full ">
    New product has assigned
  </span>
)}

                        <br />
                        Created By:{" "}
                        {order.createdBy
                          ? order.createdBy.name
                          : "Unknown"}{" "}
                        <br />
                        Assigned To:{" "}
                        {order.assignedTo
                          ? order.assignedTo.name
                          : "Not Assigned"}{" "}
                        <br />
                        Total Product Amount: {order.totalItemAmount}
                      </div>
                      <div>
                        <div
                          className={`px-3 py-1 rounded-full text-sm ${getActionClass(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </div>

                        
                          <div className="mt-2 flex justify-end">
                            <select
                              className="bg-gray-200 border border-gray-300 rounded px-2 py-1 hover:bg-gray-300"
                              onChange={(e) =>
                                handleUpdateStatus(order._id, e.target.value)
                              }
                              defaultValue=""
                            >
                              <option value="" disabled>
                                Select Status
                              </option>
                              <option value="Accept">Accept</option>
                              <option value="Reject">Reject</option>
                            </select>
                          </div>
                      

                        <div className="mt-2 flex justify-end">
                          <button
                            onClick={() => openEditModal(order)}
                            className="text-blue-500 hover:text-blue-700 mr-2"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDeleteOrder(order._id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>

                {/* Serial number row */}
                <tr
                  className={`border-b ${
                    orderIndex % 2 === 0 ? "bg-white" : "bg-yellow-100"
                  }`}
                >
                  <td className="p-4">{orderIndex + 1}</td>
                  <td colSpan="6">
                    <button
                      onClick={() => toggleItemRow(order._id)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      {expandedItems[order._id] ? "Collapse" : "Expand"}
                    </button>
                  </td>
                </tr>

                {/* Expanded item rows */}
                {expandedItems[order._id] &&
                  order.items.map((item) => (
                    <tr
                      key={item._id}
                      className={`border-b ${
                        orderIndex % 2 === 0 ? "bg-white" : "bg-yellow-100"
                      }`}
                    >
                      <td className="p-4"></td>
                      <td className="p-4">{item.itemName}</td>
                      <td className="p-4">{item.categoryName}</td>
                      <td className="p-4">{item.qty}</td>
                      <td className="p-4">{`${item.price}`}</td>
                      <td className="p-4">{`${item.totalAmount}`}</td>
                      <td className="p-4"></td>
                    </tr>
                  ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>

        <div className="block sm:hidden">
          {orders.map((order) => (
            <MobileOrderCard
              key={order._id}
              order={order}
              getActionClass={getActionClass}
              openEditModal={openEditModal}  
              handleDeleteOrder={handleDeleteOrder} 
              handleUpdateStatus={handleUpdateStatus}
            />
          ))}
        </div>
      </div>

      
      {isEditModalOpen && (
        <EditOrderModal
          order={orderToEdit}
          closeModal={closeEditModal}
          onOrderUpdated={handleOrderCreated}
          
        />
      )}
    </div>
  );
};

export default SalesOrdersTable;
