import React, { useState } from 'react';

const EditOrderModal = ({ order, closeModal, onOrderUpdated }) => {
  const [items, setItems] = useState(order.items || []);
  const [gst, setGst] = useState(order.gst || 0);  // Add state for gst

  // Function to handle price change for a specific item
  const handlePriceChange = (index, value) => {
    const newItems = [...items];
    newItems[index].price = value;
    setItems(newItems);
  };

  // Function to handle GST change
  const handleGstChange = (e) => {
    setGst(e.target.value);
  };

  // Calculate total item amount before GST
  const totalItemAmountBeforeGST = items.reduce(
    (total, item) => total + item.price * item.qty, 0
  );

  // Calculate GST amount
  const gstAmount = (totalItemAmountBeforeGST * gst) / 100;

  // Calculate total amount with GST
  const totalAmountWithGST = totalItemAmountBeforeGST + gstAmount;

  // Function to handle form submission
  const handleSubmit = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/orderItem/price/${order._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3NGE5NmUxYWM2OWVlOGM1NzVmMDQzMCIsInJvbGUiOiJzYWxlcyBleGVjdXRpdmUiLCJpYXQiOjE3MzMwMzc1MjAsImV4cCI6MTczMzEyMzkyMH0.EKMWiQkJEnwIbnzjneb-VBUqV1oxtYSMz1l8i9xsqxQ`,  // Update token if necessary
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          items: items.map(item => ({ price: item.price })), // Map items to only include price
          gst: gst // Include GST in the request
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update order');
      }

      const updatedOrder = await response.json();
      onOrderUpdated(updatedOrder); // Update the parent component with the new order data
      closeModal(); // Close the modal after successful update
    } catch (error) {
      console.error('Error updating order:', error);
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
              {/* Display Item Name */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-600">Item Name</label>
                <input
                  type="text"
                  value={item.itemName} // Show item name
                  readOnly // Make it read-only to only display
                  className="bg-gray-200 mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              {/* Display Category Name */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-600">Category Name</label>
                <input
                  type="text"
                  value={item.categoryName} // Show category name
                  readOnly // Make it read-only to only display
                  className=" bg-gray-200 mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-600">Quantity</label>
                <input
                  type="text"
                  value={item.qty} // Show quantity
                  readOnly // Make it read-only to only display
                  className=" bg-gray-200 mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              {/* Price Input */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-600">Price</label>
                <input
                  type="number"
                  value={item.price}
                  onChange={(e) => handlePriceChange(index, e.target.value)}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
          ))}
        </div>

        {/* GST Input */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-600">GST (%)</label>
          <input
            type="number"
            value={gst}
            onChange={handleGstChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Total Amount Section */}
        <div className="mt-6">
          <div className="text-sm text-gray-700">
            <p><strong>Total Item Amount (Before GST): </strong><span className="font-semibold">{totalItemAmountBeforeGST.toFixed(2)}</span></p>
            <p><strong>GST Amount: </strong><span className="font-semibold">{gstAmount.toFixed(2)}</span></p>
            <p><strong>Total Amount (With GST): </strong><span className="font-semibold text-indigo-600">{totalAmountWithGST.toFixed(2)}</span></p>
          </div>
        </div>

        <div className="flex justify-between items-center mt-4">
          <div className="space-x-4">
            <button
              onClick={handleSubmit}
              className="px-6 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none">
              Save Changes
            </button>
            {/* Cancel Button */}
            <button 
              onClick={closeModal}
              className="px-6 py-2 text-white bg-gray-500 rounded-lg hover:bg-gray-600 focus:outline-none">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditOrderModal;
