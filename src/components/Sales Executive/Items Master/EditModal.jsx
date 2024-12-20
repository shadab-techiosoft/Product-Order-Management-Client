import React, { useState, useEffect } from "react";
import { API_BASE_URL } from "../../../config";
import { toast } from "react-toastify";

const EditModal = ({ category, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    itemCode: "",
    categoryName: "",
    itemName: "",
    unit: "",
    pcsPerCtn: "",
    wtPerCtn: "",
    cbmPerCtn: "",
  });

  useEffect(() => {
    if (category) {
      setFormData({
        itemCode: category.itemCode || "",
        categoryName: category.categoryName || "",
        itemName: category.itemName || "",
        unit: category.unit || "",
        pcsPerCtn: category.pcsPerCtn || "",
        wtPerCtn: category.wtPerCtn || "",
        cbmPerCtn: category.cbmPerCtn || "",
      });
    }
  }, [category]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/api/categories/${category._id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const updatedCategory = await response.json();
        onUpdate(updatedCategory); // Update the category in the parent component
        toast.success("Category updated successfully!");
        onClose(); // Close the modal
      } else {
        const data = await response.json();
        toast.error(data.message || "Failed to update category.");
      }
    } catch (error) {
      toast.error("An error occurred while updating the category.");
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-100">
        <h3 className="text-xl font-semibold mb-4">Edit Category</h3>
        <form onSubmit={handleSubmit}>
          {/* Flex container for fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Item Code</label>
              <input
                type="text"
                name="itemCode"
                value={formData.itemCode}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
  
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Category Name</label>
              <input
                type="text"
                name="categoryName"
                value={formData.categoryName}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
  
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Item Name</label>
              <input
                type="text"
                name="itemName"
                value={formData.itemName}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
  
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Unit</label>
              <input
                type="text"
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
  
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Qty/Ctn</label>
              <input
                type="number"
                name="pcsPerCtn"
                value={formData.pcsPerCtn}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
  
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Wt/Ctn</label>
              <input
                type="number"
                name="wtPerCtn"
                value={formData.wtPerCtn}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
  
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">CBM/Ctn</label>
              <input
                type="number"
                name="cbmPerCtn"
                value={formData.cbmPerCtn}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
  
          </div>
  
          {/* Buttons */}
          <div className="flex justify-between mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
  
};

export default EditModal;
