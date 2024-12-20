// src/components/warehouse/EditInventoryModal.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../../config";

const EditInventoryModal = ({ item, onClose, onUpdate }) => {
  const [warehouseName, setWarehouseName] = useState(item.warehouseName || "");
  const [quantity, setQuantity] = useState(item.quantity || 0);
  const [loading, setLoading] = useState(false);
  const [warehouses, setWarehouses] = useState([]);

  useEffect(() => {
      // Fetch warehouse names from the API
      const fetchWarehouses = async () => {
        try {
          const token = localStorage.getItem("token");
          const response = await fetch("http://localhost:5000/api/warehouse/get-warehouse/name", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
  
          const result = await response.json();
          if (response.ok) {
            setWarehouses(result.data); // Set the warehouses data
          } else {
            toast.error(result.message || "Failed to fetch warehouses");
          }
        } catch (error) {
          toast.error("An error occurred while fetching warehouse names");
        }
      };
  
      fetchWarehouses();
    }, []);

  useEffect(() => {
    setWarehouseName(item.warehouseName);
    setQuantity(item.quantity);
  }, [item]);

  const handleSubmit = async () => {
    if (!warehouseName || quantity <= 0) {
      toast.error("Please provide a valid warehouse name and quantity.");
      return;
    }

    setLoading(true);

    const token = localStorage.getItem("token"); // Get the token from localStorage
    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    };

    try {
      const response = await axios.put(
        `${API_BASE_URL}/api/warehouse/inventory/${item._id}`,
        { warehouseName, quantity },
        { headers }
      );

      if (response.status === 200) {
        toast.success("Inventory item updated successfully.");
        onUpdate({ ...item, warehouseName, quantity }); // Update the item in parent state
        onClose(); // Close the modal
      } else {
        toast.error("Failed to update item.");
      }
    } catch (error) {
      toast.error("An error occurred while updating the item.");
      console.error("Error updating item:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-500 bg-opacity-50">
      <div className="bg-white p-6 rounded-md shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">Edit Inventory Item</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Warehouse Name</label>
          <select
            type="text"
            value={warehouseName}
            onChange={(e) => setWarehouseName(e.target.value)}
            className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md"
            placeholder="Enter warehouse name"
          >
           <option value="" disabled>
                    Select a warehouse
                  </option>
                  {warehouses.map((warehouse) => (
                    <option key={warehouse._id} value={warehouse.warehouseName}>
                      {warehouse.warehouseName}
                    </option>
                  ))}
        </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Quantity</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md"
            placeholder="Enter quantity"
          />
        </div>
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className={`px-4 py-2 bg-blue-500 text-white rounded-md ${loading && "opacity-50 cursor-not-allowed"}`}
            disabled={loading}
          >
            {loading ? "Updating..." : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditInventoryModal;
