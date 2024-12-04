import { FaEdit, FaTrash } from "react-icons/fa"; // Import icons
import React, { useState } from "react";

const MobileOrderCard = ({
  order,
  getActionClass,
  openEditModal,
  handleDeleteOrder,
  handleUpdateStatus,
}) => {
  // Track if the order's items are expanded or collapsed
  const [isExpanded, setIsExpanded] = useState(false);
  
  const items = Array.isArray(order.items) ? order.items : [];

  // Toggle the expanded state of the items section
  const toggleExpandCollapse = () => {
    setIsExpanded((prevState) => !prevState);
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4 mb-4 shadow-md">
      {/* Order details */}
      <div className="flex justify-between text-sm text-gray-700">
        <div className="font-semibold">Order ID</div>
        <div>{order._id}</div>
      </div>
      <div className="flex justify-between text-sm text-gray-700">
        <div className="font-semibold">Created By</div>
        <div>{order.createdBy ? order.createdBy.name : "Unknown"}</div>
      </div>
      <div className="flex justify-between text-sm text-gray-700">
        <div className="font-semibold">Assigned To</div>
        <div>{order.assignedTo ? order.assignedTo.name : "Not Assigned"}</div>
      </div>
      <div className="flex justify-between text-sm text-gray-700">
        <div className="font-semibold">Status</div>
        <div>
          <span
            className={`px-3 py-1 rounded-full text-sm ${getActionClass(order.status)}`}
          >
            {order.status}
          </span>
        </div>
        <div className="mt-2 flex justify-between">
          {/* Status Dropdown */}
          {order.totalItemAmount > 0 && (
            <select
              className="bg-gray-200 border border-gray-300 rounded px-2 py-1 hover:bg-gray-300"
              onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
              value={order.status}  // Make sure the current status is selected
            >
              <option value="" disabled>
                Select Status
              </option>
              <option value="Pending">Pending</option>
              <option value="Accept">Accept</option>
              <option value="Reject">Reject</option>
            </select>
          )}
        </div>
      </div>

      {/* Expand/Collapse button */}
      <div className="mt-4">
        <button
          onClick={toggleExpandCollapse}
          className="text-blue-500 hover:text-blue-700"
        >
          {isExpanded ? "Collapse Items" : "Expand Items"}
        </button>
      </div>

      {/* Expanded items section */}
      {isExpanded && (
        <div className="mt-4">
          {items.length > 0 ? (
            items.map((item) => (
              <div
                key={item._id}
                className="mb-3 p-4 bg-white rounded-lg shadow-sm"
              >
                <div className="flex justify-between text-sm text-gray-700">
                  <div className="font-semibold">Item</div>
                  <div>{item.itemName || "Unknown"}</div>
                </div>
                <div className="flex justify-between text-sm text-gray-700">
                  <div className="font-semibold">Category</div>
                  <div>{item.categoryName || "Unknown"}</div>
                </div>
                <div className="flex justify-between text-sm text-gray-700">
                  <div className="font-semibold">Quantity</div>
                  <div>{item.qty || "Unknown"}</div>
                </div>
                <div className="flex justify-between text-sm text-gray-700">
                  <div className="font-semibold">Price</div>
                  <div>{`${item.price || "Unknown"}`}</div>
                </div>
                <div className="flex justify-between text-sm text-gray-700">
                  <div className="font-semibold">Total Amount</div>
                  <div>{`${item.totalAmount || "Unknown"}`}</div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No items available.</p>
          )}
        </div>
      )}

      {/* Edit and Delete icons */}
      <div className="flex justify-between mt-4">
        <button
          onClick={() => openEditModal(order)}
          className="text-blue-500 hover:text-blue-700"
        >
          <FaEdit /> {/* Edit Icon */}
        </button>
        <button
          onClick={() => handleDeleteOrder(order._id)}
          className="text-red-500 hover:text-red-700"
        >
          <FaTrash /> {/* Delete Icon */}
        </button>
      </div>
    </div>
  );
};

export default MobileOrderCard;
