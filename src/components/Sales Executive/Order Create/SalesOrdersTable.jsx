import React, { useEffect, useState } from "react";
import MobileOrderCard from "./MobileOrderCard";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify"; // Import toast notifications
import "react-toastify/dist/ReactToastify.css"; // Import toast CSS
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import EditOrderModal from "./EditOrderModal";
import ForClientOrderModal from "./ForClientOrderModal";
import Pagination from "./Pagination";
import SearchBar from "./SearchBar";
const SalesOrdersTable = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedItems, setExpandedItems] = useState({});
  const [selectedTab, setSelectedTab] = useState("all"); // Track selected tab
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [orderToEdit, setOrderToEdit] = useState(null); // Order data to be edited
  const token = localStorage.getItem("token");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 50;
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

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
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-200 text-yellow-800";
      case "accept":
        return "bg-green-200 text-green-800";
      case "reject":
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

  const filteredByTab = orders.filter((order) => {
    if (selectedTab === "all") return true;
    return order.status.toLowerCase() === selectedTab.toLowerCase();
  });

  // Filter orders by search query
  const filteredOrders = filteredByTab.filter((order) => {
    const queryLower = searchQuery.toLowerCase();

    return (
      (order._id?.toLowerCase().includes(queryLower)) ||
      (order.status?.toLowerCase().includes(queryLower)) ||
      (order.items?.some(
        (item) =>
          (item.categoryName?.toLowerCase().includes(queryLower)) ||
          (item.itemName?.toLowerCase().includes(queryLower))
      ))
    );
  });


  // Sorting orders by status: Pending, Reject, Accept
  const sortedOrders = filteredOrders.sort((a, b) => {
    const statusOrder = ["Pending", "Reject", "Accept"];
    const statusComparison =
      statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status);
    if (statusComparison === 0) {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
    return statusComparison;
  });

  const orderCounts = {
    all: orders.length,
    pending: orders.filter((order) => order.status?.toLowerCase() === "pending").length,
    accept: orders.filter((order) => order.status?.toLowerCase() === "accept").length,
    reject: orders.filter((order) => order.status?.toLowerCase() === "reject").length,
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
      <div className="flex justify-between mb-8 py-2">
        <h2 className="text-2xl font-semibold">Orders</h2>
        <SearchBar onSearch={(query) => setSearchQuery(query)} />
        <button
          onClick={openModal}
          className="bg-indigo-500 flex items-center gap-2 text-white px-4 py-2 rounded-xl hover:bg-indigo-400"
        >
          <FaPlus />  Create Order
        </button>
        <ForClientOrderModal isOpen={isModalOpen} closeModal={closeModal} />
      </div>

      {/* Tab navigation */}

      {" "}


      <div className="flex justify-start gap-10 border-b border-indigo-200 mb-4">
        {/* All Tab */}
        <button
          className="relative py-2 px-4 text-gray-600 font-bold text-sm sm:text-base focus:outline-none"
          onClick={() => setSelectedTab("all")}
        >
          {selectedTab === "all" && (
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-500"
              layoutId="underline"
            />
          )}
          All
          <span className="absolute top-0 right-0 -mt-1 -mr-2 text-xs bg-indigo-100 text-indigo-600 rounded-full px-2">
            {orderCounts.all}
          </span>
        </button>

        {/* Pending Tab */}
        <button
          className="relative py-2 px-4 text-gray-600 font-bold text-sm sm:text-base focus:outline-none"
          onClick={() => setSelectedTab("pending")}
        >
          {selectedTab === "pending" && (
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-500"
              layoutId="underline"
            />
          )}
          Pending
          <span className="absolute top-0 right-0 -mt-1 -mr-2 text-xs bg-yellow-100 text-yellow-600 rounded-full px-2">
            {orderCounts.pending}
          </span>
        </button>

        {/* Completed Tab */}
        <button
          className="relative py-2 px-4 text-gray-600 font-bold text-sm sm:text-base focus:outline-none"
          onClick={() => setSelectedTab("accept")}
        >
          {selectedTab === "accept" && (
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-500"
              layoutId="underline"
            />
          )}
          Completed
          <span className="absolute top-0 right-0 -mt-1 -mr-2 text-xs bg-green-100 text-green-600 rounded-full px-2">
            {orderCounts.accept}
          </span>
        </button>

        {/* Reject Tab */}
        <button
          className="relative py-2 px-4 text-gray-600 font-bold text-sm sm:text-base focus:outline-none"
          onClick={() => setSelectedTab("reject")}
        >
          {selectedTab === "reject" && (
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-500"
              layoutId="underline"
            />
          )}
          Reject
          <span className="absolute top-0 right-0 -mt-1 -mr-2 text-xs bg-red-100 text-red-600 rounded-full px-2">
            {orderCounts.reject}
          </span>
        </button>
      </div>
    {/* table  */}
      <div className="overflow-x-auto bg-indigo-50 p-2.5 rounded-xl">
        <table className="table-auto w-full border-collapse hidden sm:table">
          <thead className="">
            <tr className="text-left  bg-white  text-sm text-gray-700">
              <th className="p-4">#</th>
              <th className="p-4">Category</th>
              <th className="p-4">Product Items</th>

              <th className="p-4">Quantity</th>
              <th className="p-4">Warehouse Names</th>
              <th className="p-4">Price</th>
              <th className="p-4">Total Amount</th>
              {/* <th className="p-4">Action</th> */}
            </tr>
          </thead>
          <tbody>
            {currentOrders.map((order, orderIndex) => (
              <React.Fragment key={order._id}>
                <tr
                  className={`border-b ${orderIndex % 2 === 0 ? "bg-white" : "bg-yellow-100"
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
                  className={`border-b ${orderIndex % 2 === 0 ? "bg-white" : "bg-yellow-100"
                    }`}
                >
                  <td className="p-4">{orderIndex + 1}</td>
                  <td colSpan="6">
                    <button
                      onClick={() => toggleItemRow(order._id)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      {expandedItems[order._id]
                        ? "Collapse Items"
                        : "Expand Items"}
                    </button>
                  </td>
                </tr>

                {/* Expanded item rows */}
                {expandedItems[order._id] &&
                  order.items.map((item) => (
                    <tr
                      key={item._id}
                      className={`border-b ${orderIndex % 2 === 0 ? "bg-white" : "bg-yellow-100"
                        }`}
                    >
                      <td className="p-4"></td>
                      <td className="p-4">{item.categoryName}</td>
                      <td className="p-4">{item.itemName}</td>

                      <td className="p-4">{item.qty}</td>
                      <td className="p-4">{item.wareHouseName}</td>
                      <td className="p-4">{`${item.price}`}</td>
                      <td className="p-4">{`${item.totalAmount}`}</td>
                      {/* <td className="p-4"></td> */}
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
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />

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
