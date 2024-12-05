import React, { useState, useEffect } from "react";
import { API_BASE_URL } from '../../config';
import axios from "axios";
import { ToastContainer, toast } from "react-toastify"; // Import toast
import "react-toastify/dist/ReactToastify.css";

const CreateOrderModal = ({ closeModal, onOrderCreated }) => {
  const [items, setItems] = useState([{ categoryName: '', itemName: '', qty: 1 }]);
  const [categories, setCategories] = useState([]);
  const [categoryItems, setCategoryItems] = useState([]); // Store item options based on category
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  // Fetch client and category data when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoryResponse = await axios.get("http://localhost:5000/api/categories/all-categories", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCategories(categoryResponse.data.categories); // Set categories data in state
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };

    fetchData();
  }, [token]);

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
  const handleRemoveItem = (index) => {
    const newItems = items.filter((item, i) => i !== index); // Remove the item at the given index
    setItems(newItems);
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/orderItem/create`, {
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

      toast.success("Order created successfully!");
      closeModal();
    } catch (error) {
      toast.error("Error creating order. Please try again.");
    } finally {
      setLoading(false); // Set loading to false after the request completes
    }
  };

  // Update items based on selected category
  const handleCategoryChange = (index, event) => {
    const selectedCategory = event.target.value;
    const category = categories.find(cat => cat.categoryName === selectedCategory);
    const itemsForCategory = category ? category.items : [];

    // Update only the current item's category and reset its itemName
    const updatedItems = [...items];
    updatedItems[index].categoryName = selectedCategory;
    updatedItems[index].itemName = ""; // Reset itemName only for the current item
    setItems(updatedItems);

    // Update the category items for the selected category for the current item
    const updatedCategoryItems = [...categoryItems];
    updatedCategoryItems[index] = itemsForCategory;
    setCategoryItems(updatedCategoryItems);
  };

  return (
    <div className="fixed z-50 inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full sm:w-[90%] md:w-[80%] lg:w-[50%]">
        <h2 className="text-2xl font-semibold mb-4 text-center">Create Order</h2>

        {items.map((item, index) => (
          <div key={index} className="flex gap-4 mb-4">
            <select
              name="categoryName"
              value={item.categoryName}
              onChange={(e) => handleCategoryChange(index, e)}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category.categoryName} value={category.categoryName}>
                  {category.categoryName}
                </option>
              ))}
            </select>
            <select
              name="itemName"
              value={item.itemName}
              onChange={(e) => handleInputChange(index, 'itemName', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="">Select Item</option>
              {(categoryItems[index] || []).map((itemOption) => (
                <option key={itemOption.itemCode} value={itemOption.itemName}>
                  {itemOption.itemName}
                </option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Quantity"
              value={item.qty}
              onChange={(e) => handleInputChange(index, 'qty', e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={() => handleRemoveItem(index)}
              className="text-red-500 hover:text-red-700 ml-2"
            >
              Remove
            </button>
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

        <div className="flex justify-end gap-4 mt-4">
          <button
            onClick={closeModal}
            className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 transition duration-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 transition duration-300"
            disabled={loading}
          >
            {loading ? (
              <div className="w-5 h-5 border-4 border-t-4 border-white border-solid rounded-full animate-spin"></div>
            ) : (
              "Create Order"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateOrderModal;
