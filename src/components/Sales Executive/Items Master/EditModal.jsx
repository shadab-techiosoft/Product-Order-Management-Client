import React, { useState, useEffect } from "react";
import { FaPlus, FaTimes,FaSpinner } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API_BASE_URL } from "../../../config";
const EditModal = ({ categoryName, subtypeId, initialData, onClose, onSubmit }) => {
  const [editForm, setEditForm] = useState(initialData);
  const [imageFile, setImageFile] = useState(null); // State to hold the uploaded image
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setEditForm(initialData); // Update the form data when initialData changes
  }, [initialData]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle image file change
  const handleImageChange = (e) => {
    const file = e.target.files[0]; // Get the selected image file
    setImageFile(file); // Set the image file in state
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { itemName, specification, price } = editForm;
    const formData = new FormData();
  
    formData.append("itemName", itemName);
    formData.append("specification", specification);
    formData.append("price", price);
  
    // Only append the itemImage if a new file is selected
    if (imageFile) {
      formData.append("itemImage", imageFile);
    }
  
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_BASE_URL}/api/categories/${categoryName}/subtypes/${subtypeId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData, // Send the form data including the image if available
        }
      );
      const data = await response.json();
  
      
        setLoading(false);
       
        onSubmit(); 
        onClose();
        toast.success("Categories Updated successfully!", {
        
          autoClose: 2000,
        });
        window.location.reload(); 
      
    } catch (error) {
      setLoading(false);
      toast.error("An error occurred while updating the subtype.");
    }
  };
  
  

  return (
    <>
    <div
      className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50 transition-opacity duration-300 ease-in-out"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-11/12 sm:w-96 p-8 space-y-6 transform transition-all duration-300 ease-in-out"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-semibold text-center text-gray-800">Edit Items</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Item Name</label>
            <input
              type="text"
              name="itemName"
              value={editForm.itemName}
              onChange={handleInputChange}
              placeholder="Item Name"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
  
          <div>
            <label className="block text-sm font-medium text-gray-700">Specification</label>
            <textarea
              name="specification"
              value={editForm.specification}
              onChange={handleInputChange}
              placeholder="Specification"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
  
          <div>
            <label className="block text-sm font-medium text-gray-700">Price</label>
            <input
              type="number"
              name="price"
              value={editForm.price}
              onChange={handleInputChange}
              placeholder="Price"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
  
          <div>
            <label className="block text-sm font-medium text-gray-700">Item Image</label>
            <input
              type="file"
              name="itemImage"
              onChange={handleImageChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {editForm.itemImage && !imageFile && (
                <p className="mt-2 text-sm text-gray-600">
                Current Image: 
                <a
                  href={editForm.itemImage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline overflow-x-auto block max-w-full break-words"
                >
                  {editForm.itemImage}
                </a>
              </p>
            )}
          </div>
  
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-200 border border-gray-300 rounded-md hover:bg-gray-300 focus:outline-none transition duration-200 ease-in-out"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 ${loading ? 'cursor-wait' : ''}`}
            >
              {loading ? <FaSpinner className="animate-spin" /> : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
      
    </div>
    <ToastContainer />
    </>
  );
  
};

export default EditModal;
