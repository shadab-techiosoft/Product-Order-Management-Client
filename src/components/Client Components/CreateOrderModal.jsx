import React, { useState } from 'react';

const CreateOrderModal = ({ closeModal, onOrderCreated }) => {
  const [items, setItems] = useState([{ categoryName: '', itemName: '', qty: 1 }]);

  const handleAddItem = () => {
    const lastItem = items[items.length - 1];
    if (lastItem.categoryName.trim() !== '' && lastItem.itemName.trim() !== '') {
      setItems([...items, { categoryName: '', itemName: '', qty: 1 }]);
    } else {
      alert('Category Name and Item Name must be filled to add a new item.');
    }
  };

  const handleInputChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const handleSubmit = async () => {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3NGFiYjk3OGU0M2Y1ZjhkNzRkYWQzYSIsInJvbGUiOiJjbGllbnQiLCJpYXQiOjE3MzI5ODUxNDgsImV4cCI6MTczMzA3MTU0OH0.SrYiybkcBV61dHR4abahfeVGOTzQt3s7RbqA_3FyIQQ'; // Replace with your actual token

    try {
      const response = await fetch('http://localhost:5000/api/orderItem/create', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items }),
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      const newOrder = await response.json(); // Assume API returns the created order
      onOrderCreated(newOrder);

      alert('Order created successfully!');
      closeModal();
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full sm:w-[90%] md:w-[80%] lg:w-[70%]">
        <h2 className="text-2xl font-semibold mb-4 text-center">Create Order</h2>

        {items.map((item, index) => (
          <div key={index} className="flex gap-4 mb-4">
            <input
              type="text"
              placeholder="Category Name"
              value={item.categoryName}
              onChange={(e) => handleInputChange(index, 'categoryName', e.target.value)}
              className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
            />
            <input
              type="text"
              placeholder="Item Name"
              value={item.itemName}
              onChange={(e) => handleInputChange(index, 'itemName', e.target.value)}
              className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
            />
            <input
              type="number"
              placeholder="Quantity"
              value={item.qty}
              onChange={(e) => handleInputChange(index, 'qty', e.target.value)}
              className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
            />
            {index === items.length - 1 && (
              <button
                onClick={handleAddItem}
                className="flex-none bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                + Add More Item
              </button>
            )}
          </div>
        ))}

        <div className="flex justify-between mt-4">
          <button
            onClick={closeModal}
            className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 transition duration-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 transition duration-300"
          >
            Create Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateOrderModal;
