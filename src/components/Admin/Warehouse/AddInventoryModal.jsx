import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ExcelUpload from "./ExcelUpload"; 
const AddInventoryModal = ({ onClose, onAddInventory }) => {
  const [formData, setFormData] = useState([
    {
      itemCode: "",
      itemName: "",
      itemCategory: "",
      quantity: "",
      warehouseName: "",
      itemImage: "",
    },
  ]);
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

  const handleChange = (index, e) => {
    const { name, value } = e.target;
    const newFormData = [...formData];
    newFormData[index][name] = value;
    setFormData(newFormData);
  };

  // Fetch item details by itemCode
  const handleItemCodeChange = async (index, e) => {
    const { value } = e.target;
    const newFormData = [...formData];
    newFormData[index].itemCode = value; // Update itemCode in formData
    setFormData(newFormData);
  
    // If the itemCode is empty, reset the itemName, itemCategory, and itemImage
    if (!value) {
      newFormData[index].itemName = "";
      newFormData[index].itemCategory = "";
      newFormData[index].itemImage = "";
      setFormData(newFormData);
      return; // Exit early since no need to fetch item details
    }
  
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/categories/itemcode/${value}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      const result = await response.json();
  
      if (response.ok) {
        // If item is found, fill in item details including properly formatted itemCode
        const updatedFormData = [...formData];
        updatedFormData[index] = {
          ...updatedFormData[index],
          itemCode: result.itemCode, // Set the correct itemCode from the API response
          itemName: result.itemName,
          itemCategory: result.categoryName,
          itemImage: result.itemImage,
        };
        setFormData(updatedFormData);
      } else {
        // If the item is not found, clear the details and show error
        const updatedFormData = [...formData];
        updatedFormData[index] = {
          ...updatedFormData[index],
          itemName: "",
          itemCategory: "",
          itemImage: "",
        };
        setFormData(updatedFormData);
  
        // Clear any previous timeout to avoid multiple toasts
        if (window.itemCodeErrorTimeout) {
          clearTimeout(window.itemCodeErrorTimeout);
        }
  
        // Wait for 2 seconds before showing the error
        window.itemCodeErrorTimeout = setTimeout(() => {
          toast.error(result.message || "Item not found");
        }, 2000);
      }
    } catch (error) {
      // If there's an error (like network failure), clear the details
      const updatedFormData = [...formData];
      updatedFormData[index] = {
        ...updatedFormData[index],
        itemName: "",
        itemCategory: "",
        itemImage: "",
      };
      setFormData(updatedFormData);
  
      // Clear any previous timeout to avoid multiple toasts
      if (window.itemCodeErrorTimeout) {
        clearTimeout(window.itemCodeErrorTimeout);
      }
  
      // Wait for 2 seconds before showing the error
      window.itemCodeErrorTimeout = setTimeout(() => {
        toast.error("An error occurred while fetching item details");
      }, 2000);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/warehouse/inventory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ items: formData }), // Ensure formData is an array of items
      });

      const result = await response.json();
      if (response.ok) {
        toast.success("Inventory added successfully!");
        if (result.data && Array.isArray(result.data)) {
          onAddInventory(result.data);
        }
        onClose();
      } else {
        toast.error(result.message || "Failed to add inventory items");
      }
    } catch (error) {
      toast.error("An error occurred while adding inventory items");
    }
  };

  const addNewInventory = () => {
    setFormData([
      ...formData,
      {
        itemCode: "",
        itemName: "",
        itemCategory: "",
        quantity: "",
        warehouseName: "",
        itemImage: "",
      },
    ]);
  };

  // Function to fill the form with data from Excel file
  const fillFormFromExcel = (data) => {
    const newFormData = data.map((item) => ({
      itemCode: item.itemCode,
      itemName: item.itemName,
      itemCategory: item.itemCategory,
      quantity: item.quantity || "", // Default to empty if no quantity is provided
      warehouseName: item.warehouseName.toLowerCase(),
      itemImage: item.itemImage,
    }));
    setFormData(newFormData);
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-6 w-[90%] md:w-[80%] lg:w-[70%] overflow-y-auto" style={{ maxHeight: "90vh" }}>
        <h2 className="text-xl font-semibold mb-4">Add Inventory</h2>
        <ExcelUpload onFillForm={fillFormFromExcel} />
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Loop through each inventory item in the formData array */}
          {formData.map((inventory, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-4">
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">Warehouse Name</label>
                <select
                  name="warehouseName"
                  value={inventory.warehouseName}
                  onChange={(e) => handleChange(index, e)}
                  required
                  className="p-2 border border-gray-300 rounded-md"
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
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">Item Code</label>
                <input
                  type="text"
                  name="itemCode"
                  value={inventory.itemCode}
                  onChange={(e) => handleItemCodeChange(index, e)} // Use handleItemCodeChange
                  required
                  className="p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">Category</label>
                <input
                readOnly
                  type="text"
                  name="itemCategory"
                  value={inventory.itemCategory}
                  onChange={(e) => handleChange(index, e)}
                  required
                  className="p-2 border border-gray-300 rounded-md bg-gray-200"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">Item Name</label>
                <input
                readOnly
                  type="text"
                  name="itemName"
                  value={inventory.itemName}
                  onChange={(e) => handleChange(index, e)}
                  required
                  className="p-2 border border-gray-300 rounded-md bg-gray-200"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">Item Image URL</label>
                <input
                readOnly
                  type="url"
                  name="itemImage"
                  value={inventory.itemImage}
                  onChange={(e) => handleChange(index, e)}
                  required
                  className="p-2 border border-gray-300 rounded-md bg-gray-200"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">Quantity</label>
                <input
                  type="number"
                  name="quantity"
                  value={inventory.quantity}
                  onChange={(e) => handleChange(index, e)}
                  required
                  className="p-2 border border-gray-300 rounded-md"
                />
              </div>

              
            </div>
          ))}

          {/* Button Row */}
          <div className="flex justify-between items-center mt-4">
            <button
              type="button"
              onClick={addNewInventory} // Adds new inventory fields
              className="px-4 py-2 bg-gray-300 rounded-md text-sm"
            >
              +
            </button>

            <div className="flex items-center space-x-2">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm"
              >
                Add Inventory
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 rounded-md text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AddInventoryModal;
