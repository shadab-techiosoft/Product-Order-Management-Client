import React, { useEffect, useState } from "react";
import MobileOrderCard from "./MobileOrderCard";
import CreateOrderModal from "./CreateOrderModal"; // Import the CreateOrderModal component
import { ToastContainer, toast } from "react-toastify"; // Import toast notifications
import "react-toastify/dist/ReactToastify.css"; // Import toast CSS
import { FaEdit, FaTrash } from "react-icons/fa";
import EditOrderModal from "./EditOrderModal";
import { API_BASE_URL } from "../../config";
import SearchBar from "./SearchBar";
import Pagination from './Pagination';
const OrdersTable = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedItems, setExpandedItems] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [orderToEdit, setOrderToEdit] = useState(null); // Order data to be edited
  const [selectedTab, setSelectedTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 50;
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false); // Modal visibility for rejection
const [rejectReason, setRejectReason] = useState(""); // Reason for rejecting
const [orderToReject, setOrderToReject] = useState(null); // Order to be rejected

  const token = localStorage.getItem("token");

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/orderItem/get`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

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

  useEffect(() => {
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

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  const openEditModal = (order) => {
    setOrderToEdit(order);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setOrderToEdit(null);
  };

  const handleOrderCreated = async (newOrder) => {
    await fetchOrders();
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

  const filteredByTab = orders.filter((order) => {
    if (selectedTab === "all") return true;
    return order.status.toLowerCase() === selectedTab.toLowerCase();
  });

  // Filter orders by search query
  const filteredOrders = filteredByTab.filter((order) => {
    const queryLower = searchQuery.toLowerCase();
    return (
      order._id.toLowerCase().includes(queryLower) ||
      order.status.toLowerCase().includes(queryLower) ||
      order.items.some(
        (item) =>
          item.categoryName.toLowerCase().includes(queryLower) ||
          item.itemName.toLowerCase().includes(queryLower)
      )
    );
  });

  // Sorting orders by status: Pending, Reject, Accept, and by latest created
  const sortedOrders = filteredOrders.sort((a, b) => {
    const statusOrder = ["Pending", "Reject", "Accept"];
    const statusComparison =
      statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status);
    if (statusComparison === 0) {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
    return statusComparison;
  });

  const handleUpdateStatus = async (orderId, newStatus) => {
    if (newStatus === "Reject") {
      // Open the modal for rejecting the order and ask for a reason
      setOrderToReject(orderId); // Store the order ID to be rejected
      setIsRejectModalOpen(true); // Open the rejection modal
    } else {
      // Handle other statuses (Accept or Pending)
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
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to update status");
        }
  
        // Update the order in the state if the status update is successful
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId ? { ...order, status: newStatus } : order
          )
        );
  
        toast.success("Order status updated successfully!");
      } catch (error) {
        toast.error("Error: " + error.message);
      }
    }
  };

  const handleRejectOrder = async () => {
    if (!rejectReason.trim()) {
      // If the rejection reason is empty, show an error message
      toast.error("Please provide a reason for rejection.");
      return; // Prevent submission if the reason is empty
    }
  
    try {
      const response = await fetch(
        `http://localhost:5000/api/orderItem/accept-reject/${orderToReject}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "Reject", reason: rejectReason }), // Send the reason
        }
      );
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to reject order");
      }
  
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderToReject ? { ...order, status: "Reject" } : order
        )
      );
  
      toast.success("Order rejected successfully!");
      setIsRejectModalOpen(false); // Close the modal after rejection
      setRejectReason(""); // Clear the reason input
    } catch (error) {
      toast.error("Error: " + error.message);
    }
  };
  
  
  const closeRejectModal = () => {
    setIsRejectModalOpen(false);
    setRejectReason(""); // Clear the reason input when modal is closed
  };
    

  const orderCounts = {
    all: orders.length,
    pending: orders.filter(
      (order) => order.status && order.status.toLowerCase() === "pending"
    ).length,
    accept: orders.filter(
      (order) => order.status && order.status.toLowerCase() === "accept"
    ).length,
    reject: orders.filter(
      (order) => order.status && order.status.toLowerCase() === "reject"
    ).length,
  };

  // Pagination Logic
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = sortedOrders.slice(indexOfFirstOrder, indexOfLastOrder); // Use sorted orders for pagination

  // Calculate total pages
  const totalPages = Math.ceil(sortedOrders.length / ordersPerPage);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <ToastContainer />
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-semibold">Orders</h2>
        <button
          onClick={openModal}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Create Order
        </button>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between mb-4">
        {" "}
        {/* Flex column on small screens, row on larger screens */}
        <div className="flex space-x-4 mb-4 sm:mb-0">
          {" "}
          {/* Margin at bottom for mobile, removed on larger screens */}
          <button
            className={`py-2 px-4 rounded ${
              selectedTab === "all"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
            onClick={() => setSelectedTab("all")}
          >
            All
            <span className="ml-2 text-xs bg-blue-200 text-blue-800 rounded-full px-2">
              {orderCounts.all}
            </span>
          </button>
          <button
            className={`py-2 px-4 rounded ${
              selectedTab === "pending"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
            onClick={() => setSelectedTab("pending")}
          >
            Pending
            <span className="ml-2 text-xs bg-yellow-200 text-yellow-800 rounded-full px-2">
              {orderCounts.pending}
            </span>
          </button>
          <button
            className={`py-2 px-4 rounded ${
              selectedTab === "accept"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
            onClick={() => setSelectedTab("accept")}
          >
            Completed
            <span className="ml-2 text-xs bg-green-200 text-green-800 rounded-full px-2">
              {orderCounts.accept}
            </span>
          </button>
          <button
            className={`py-2 px-4 rounded ${
              selectedTab === "reject"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
            onClick={() => setSelectedTab("reject")}
          >
            Reject
            <span className="ml-2 text-xs bg-red-200 text-red-800 rounded-full px-2">
              {orderCounts.reject}
            </span>
          </button>
        </div>
        {/* Search bar placed on the right side on larger screens */}
        <SearchBar onSearch={(query) => setSearchQuery(query)} />
      </div>

      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse hidden sm:table">
          <thead>
            <tr className="text-left bg-gray-100 text-sm text-gray-700">
              <th className="p-4">#</th>
              <th className="p-4">Category</th>
              <th className="p-4">Product Items</th>

              <th className="p-4">Quantity</th>
              <th className="p-4">Price</th>
              <th className="p-4">Total Amount</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentOrders.map((order, orderIndex) => (
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
                            Your Product is Under Processing
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
                        <br />
                        Rejection Reason:<span className="text-red-700 font-bold"> {order.rejectionReason || ""}</span>
                      </div>
                      <div>
                        <div
                          className={`px-3 py-1 rounded-full text-sm ${getActionClass(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </div>

                        {order.totalItemAmount > 0 && (
                          <div className="mt-2 flex justify-end">
                            <select
                              className="bg-gray-200 border border-gray-300 rounded px-2 py-1 hover:bg-gray-300"
                              onChange={(e) =>
                                handleUpdateStatus(order._id, e.target.value)
                              }
                              defaultValue={order.status} // Set the default value to the current order status
                            >
                              <option value="" disabled>
                                Select Status
                              </option>
                              <option value="Pending">Pending</option>{" "}
                              {/* Added Pending status */}
                              <option value="Accept">Accept</option>
                              <option value="Reject">Reject</option>
                            </select>
                          </div>
                        )}

                        <div className="mt-2 flex justify-end">
                          <button
                            onClick={() => openEditModal(order)}
                            className="text-blue-500 hover:text-blue-700 mr-2"
                          >
                            <FaEdit />
                          </button>
                          {/* <button
                            onClick={() => handleDeleteOrder(order._id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <FaTrash />
                          </button> */}
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
                  order.items.map((item, orderIndex) => (
                    <tr
                      key={item._id}
                      className={`border-b ${
                        orderIndex % 2 === 0 ? "bg-white" : "bg-yellow-100"
                      }`}
                    >
                      <td className="p-4"></td>
                      <td className="p-4">
                        {item.categoryName || "Unknown"}
                      </td>{" "}
                      {/* Display "Unknown" if categoryName is empty */}
                      <td className="p-4">{item.itemName || "Unknown"}</td>{" "}
                      {/* Display "Unknown" if itemName is empty */}
                      <td className="p-4">{item.qty || "Unknown"}</td>{" "}
                      {/* Display "Unknown" if qty is empty */}
                      <td className="p-4">
                        {item.price ? `${item.price}` : "Unknown"}
                      </td>{" "}
                      {/* Display "Unknown" if price is empty */}
                      <td className="p-4">
                        {item.totalAmount ? `${item.totalAmount}` : "Unknown"}
                      </td>{" "}
                      {/* Display "Unknown" if totalAmount is empty */}
                      <td className="p-4"></td>
                    </tr>
                  ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>

        <div className="block sm:hidden">
          {currentOrders.map((order) => (
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

      {isRejectModalOpen && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white p-6 rounded-lg w-1/3">
      <h3 className="text-xl font-semibold mb-4">Provide a Reason for Rejection</h3>
      <textarea
        value={rejectReason}
        onChange={(e) => setRejectReason(e.target.value)}
        placeholder="Enter rejection reason..."
        className="w-full p-2 border border-gray-300 rounded mb-4"
      />
      <div className="flex justify-end space-x-4">
        <button
          onClick={closeRejectModal}
          className="px-4 py-2 bg-gray-300 rounded"
        >
          Cancel
        </button>
        <button
          onClick={handleRejectOrder}
          className="px-4 py-2 bg-red-500 text-white rounded"
        >
          Reject Order
        </button>
      </div>
    </div>
  </div>
)}


      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />

      {isModalOpen && (
        <CreateOrderModal
          closeModal={closeModal}
          onOrderCreated={handleOrderCreated}
        />
      )}
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

export default OrdersTable;
