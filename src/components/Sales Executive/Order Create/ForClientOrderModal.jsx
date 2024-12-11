import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify"; // Import toast
import "react-toastify/dist/ReactToastify.css";

const ForClientOrderModal = ({ isOpen, closeModal }) => {
  const [items, setItems] = useState([
    { categoryName: "", itemName: "", qty: 1, price: 0, wareHouseName: "" },
  ]);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryItems, setSelectedCategoryItems] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      gst: 0, // Set default value for gst here
    },
  });
  const token = localStorage.getItem("token"); // Assuming the token is stored in localStorage

  // Watch GST value from the form
  const gst = watch("gst", 0); // Default to 0 if not provided

  // Fetch client and category data when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch clients
        const clientResponse = await axios.get("http://localhost:5000/api/clients", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setClients(clientResponse.data); // Set the clients data in state

        // Fetch categories and items
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

  // Handle form submission
  const onSubmit = async (data) => {
    setLoading(true); // Set loading to true when submission starts
    try {
      const orderData = {
        clientId: data.clientId,
        items,
        gst: data.gst,
      };

      // Send the data to the API
      const response = await axios.post(
        "http://localhost:5000/api/orderItem/create-on-behalf",
        orderData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Show success toast notification
      toast.success("Order created successfully!");
      closeModal();
      window.location.reload();
    } catch (error) {
      console.error("Error creating order:", error.message);
      // Show error toast notification
      toast.error("Error creating order. Please try again.");
    } finally {
      setLoading(false); // Set loading to false after the request completes
    }
  };

  // Add a new item field
  const addItem = () => {
    setItems([...items, { categoryName: "", itemName: "", qty: 1, price: 0, wareHouseName: "" }]);
  };

  // Remove an item field
  const removeItem = (index) => {
    const updatedItems = [...items];
    updatedItems.splice(index, 1);
    setItems(updatedItems);
  };

  // Handle item input changes
  const handleItemChange = (index, event) => {
    const updatedItems = [...items];
    updatedItems[index][event.target.name] = event.target.value;
    setItems(updatedItems);
  };

  // Update items based on selected category
  const handleCategoryChange = (index, event) => {
    const selectedCategory = event.target.value;
    const category = categories.find((cat) => cat.categoryName === selectedCategory);
    const itemsForCategory = category ? category.items : [];

    // Update only the current item's category and itemName
    const updatedItems = [...items];
    updatedItems[index].categoryName = selectedCategory;
    updatedItems[index].itemName = ""; // Reset itemName when category changes
    updatedItems[index].itemCode = "";
    setItems(updatedItems);

    // Update the available items for this specific item row
    const updatedCategoryItems = [...selectedCategoryItems];
    updatedCategoryItems[index] = itemsForCategory; // Set the items for the current item row
    setSelectedCategoryItems(updatedCategoryItems);
  };

  const handleItemNameChange = (index, event) => {
    const selectedItemName = event.target.value;
    const selectedItem = (selectedCategoryItems[index] || []).find(
      (item) => item.itemName === selectedItemName
    );

    const updatedItems = [...items];
    updatedItems[index].itemName = selectedItemName;
    updatedItems[index].itemCode = selectedItem ? selectedItem.itemCode : ""; // Set the itemCode
    setItems(updatedItems);
  };

  // Helper functions to calculate totals
  function calculateTotalBeforeGST() {
    return items
      .reduce((total, item) => total + item.qty * item.price, 0)
      .toFixed(2);
  }

  function calculateGSTAmount() {
    const totalBeforeGST = calculateTotalBeforeGST();
    const gstPercentage = parseFloat(gst); // Now using the watched `gst` value
    return ((totalBeforeGST * gstPercentage) / 100).toFixed(2);
  }

  function calculateTotalWithGST() {
    const totalBeforeGST = parseFloat(calculateTotalBeforeGST());
    const gstAmount = parseFloat(calculateGSTAmount());
    return (totalBeforeGST + gstAmount).toFixed(2);
  }

  const handleCloseModal = () => {
    reset({ gst: 0, clientId: "" }); // Reset form values
    setItems([{ categoryName: "", itemName: "", qty: 1, price: 0, wareHouseName: "" }]); // Reset items state
    closeModal(); // Close the modal
  };

  return (
    isOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div
          className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl overflow-y-auto"
          style={{ maxHeight: "90vh" }}
        >
          <h2 className="text-2xl font-bold mb-4">Create Order</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Client</label>
              <select
                {...register("clientId", { required: "Client is required" })}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="">Select Client</option>
                {clients.map((client) => (
                  <option key={client._id} value={client.user}>
                    {client.firmName} - {client.contactPerson}
                  </option>
                ))}
              </select>
            </div>

            {/* Item Fields */}
            {items.map((item, index) => (
              <div key={index} className="mb-4">
                <div className="flex space-x-4">
                  <div className="flex-1">
                    <label className="block text-gray-700">Category</label>
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
                  </div>

                  <div className="flex-1">
                    <label className="block text-gray-700">Item Name</label>
                    <select
                      name="itemName"
                      value={item.itemName}
                      onChange={(e) => handleItemNameChange(index, e)}
                      className="w-full p-2 border border-gray-300 rounded"
                    >
                      <option value="">Select Item</option>
                      {(selectedCategoryItems[index] || []).map((itemOption) => (
                        <option key={itemOption.itemCode} value={itemOption.itemName}>
                          {itemOption.itemName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex-1">
                    <label className="block text-gray-700">Item Code</label>
                    <input
                      type="text"
                      name="itemCode"
                      value={item.itemCode}
                      readOnly
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </div>

                  <div className="flex-1">
                    <label className="block text-gray-700">Quantity</label>
                    <input
                      type="number"
                      name="qty"
                      value={item.qty}
                      onChange={(e) => handleItemChange(index, e)}
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </div>

                  <div className="flex-1">
                    <label className="block text-gray-700">Price</label>
                    <input
                      type="number"
                      name="price"
                      value={item.price}
                      onChange={(e) => handleItemChange(index, e)}
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </div>

                  <div className="flex-1">
                    <label className="block text-gray-700">Warehouse Name</label>
                    <input
                      type="text"
                      name="wareHouseName"
                      value={item.wareHouseName}
                      onChange={(e) => handleItemChange(index, e)}
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </div>
                </div>

                {/* Remove item button */}
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="text-red-500 mt-2"
                >
                  Remove Item
                </button>
              </div>
            ))}

            {/* Add Item Button */}
            <div className="mb-4">
              <button
                type="button"
                onClick={addItem}
                className="text-blue-500 hover:text-blue-700"
              >
                + Add Item
              </button>
            </div>

            {/* GST Field */}
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">GST Percentage</label>
              <input
                type="number"
                className="w-full p-2 border border-gray-300 rounded"
                {...register("gst", { valueAsNumber: true, defaultValue: 0 })} // Set default value to 0
              />
            </div>

            {/* Total before GST, GST Amount, and Total including GST */}
            <div className="mb-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-700">Total Before GST</span>
                <span className="font-bold text-gray-800">
                  ₹{calculateTotalBeforeGST()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">GST Amount</span>
                <span className="font-bold text-gray-800">
                  ₹{calculateGSTAmount()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Total Including GST</span>
                <span className="font-bold text-gray-800">
                  ₹{calculateTotalWithGST()}
                </span>
              </div>
            </div>

            {/* Submit and Cancel Buttons */}
            <div className="flex justify-between mt-4">
              <button
                type="button"
                onClick={handleCloseModal}
                className="bg-gray-300 text-black rounded-lg py-2 px-6"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-500 text-white rounded-lg py-2 px-6 flex items-center justify-center"
                disabled={loading} // Disable button if loading
              >
                {loading ? (
                  <div className="w-5 h-5 border-4 border-t-4 border-white border-solid rounded-full animate-spin"></div>
                ) : (
                  "Create Order"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );
};

export default ForClientOrderModal;
