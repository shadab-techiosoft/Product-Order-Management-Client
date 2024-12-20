import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css"; 

const AddWarehouseModal = ({ onClose, onAddWarehouse, warehouseToEdit, isEditing, onUpdateWarehouse }) => {
  const [formData, setFormData] = useState({
    warehouseName: "",
    address: "",
  });

  // Update formData if in editing mode
  useEffect(() => {
    if (isEditing && warehouseToEdit) {
      setFormData({
        warehouseName: warehouseToEdit.warehouseName,
        address: warehouseToEdit.address,
      });
    }
  }, [isEditing, warehouseToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You must be logged in to add or edit a warehouse.");
      return;
    }

    try {
      let response;

      // If we are editing, make an API call to update the warehouse
      if (isEditing) {
        response = await fetch(`http://localhost:5000/api/warehouse/new-warehouse/${warehouseToEdit._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        });
      } else {
        // If we are adding, make an API call to create a new warehouse
        response = await fetch("http://localhost:5000/api/warehouse/create/warehousename", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        });
      }

      const result = await response.json();
      if (response.ok) {
        if (isEditing) {
          onUpdateWarehouse(result.data);  // Update the warehouse in the list
        } else {
          onAddWarehouse(result.data);  // Add the new warehouse
        }
        onClose();  // Close the modal
        toast.success(isEditing ? "Warehouse updated successfully!" : "Warehouse added successfully!");
      } else {
        toast.error(result.message || "Failed to save warehouse");
      }
    } catch (error) {
      toast.error("An error occurred while saving the warehouse");
    }
  };

  return (
    <>
      <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
        <div className="bg-white rounded-lg p-6 w-96">
          <h2 className="text-xl font-semibold mb-4">{isEditing ? "Edit Warehouse" : "Add Warehouse"}</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Warehouse Name</label>
              <input
                type="text"
                name="warehouseName"
                value={formData.warehouseName}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Warehouse Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="flex justify-between">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 rounded-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-md"
              >
                {isEditing ? "Update Warehouse" : "Add Warehouse"}
              </button>
            </div>
          </form>
        </div>
      </div>

      <ToastContainer />
    </>
  );
};

export default AddWarehouseModal;
