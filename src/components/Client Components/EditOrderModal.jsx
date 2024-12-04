import React, { useState } from 'react';
import { API_BASE_URL } from '../../config';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const EditOrderModal = ({ order, closeModal, onOrderUpdated }) => {
  const [items, setItems] = useState(order.items || []);

  // Function to handle input changes in the form fields
  const handleInputChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  // Function to add a new item (categoryName, itemName, qty)
  const handleAddItem = () => {
    setItems([
      ...items,
      {
        categoryName: '', // Empty category by default
        itemName: '',     // Empty item name by default
        qty: '',          // Empty quantity by default
      },
    ]);
  };

  // Function to handle form submission
  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/orderItem/${order._id}/client`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items }), // Send updated items only
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update order');
      }

      const updatedOrder = await response.json();
      onOrderUpdated(updatedOrder); // Update the parent component with the new order data
      closeModal(); // Close the modal after successful update
      toast.success('Order updated successfully!'); // Success toast
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error(`Error: ${error.message}`); // Error toast
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-lg w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">Edit Order</h2>
          <button 
            onClick={closeModal} 
            className="text-gray-600 hover:text-gray-800 focus:outline-none">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-700">Order Items</h3>
          {items.map((item, index) => (
            <div key={index} className="flex gap-4 mb-4 items-center">
              {/* Category Name Input */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-600">Category Name</label>
                <input
                  type="text"
                  value={item.categoryName}
                  onChange={(e) => handleInputChange(index, 'categoryName', e.target.value)}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              {/* Item Name Input */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-600">Item Name</label>
                <input
                  type="text"
                  value={item.itemName}
                  onChange={(e) => handleInputChange(index, 'itemName', e.target.value)}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              {/* Quantity Input */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-600">Quantity</label>
                <input
                  type="number"
                  value={item.qty}
                  onChange={(e) => handleInputChange(index, 'qty', e.target.value)}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center mt-4">
          {/* Add Item Button */}
          <button 
            onClick={handleAddItem}
            className="flex items-center text-indigo-600 hover:text-indigo-700 focus:outline-none">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 mr-2">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v14m7-7H5" />
            </svg>
            <span>Add Item</span>
          </button>

          <div className="space-x-4">
            {/* Cancel Button */}
            <button 
              onClick={closeModal}
              className="px-6 py-2 text-white bg-gray-500 rounded-lg hover:bg-gray-600 focus:outline-none">
              Cancel
            </button>
            {/* Save Changes Button */}
            <button
              onClick={handleSubmit}
              className="px-6 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none">
              Save Changes
            </button>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default EditOrderModal;
