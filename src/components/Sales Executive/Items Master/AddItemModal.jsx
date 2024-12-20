// AddItemModal.js
import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ExcelUpload from "./ExcelUpload";
import * as XLSX from "xlsx";
const AddItemModal = ({ onClose, onAddItems }) => {
  const [items, setItems] = useState([
    {
      itemCode: "",
      categoryName: "",
      itemName: "",
      unit: "",
      pcsPerCtn: "",
      wtPerCtn: "",
      cbmPerCtn: "",
      itemImageLink: "",
      itemImage: null,
    },
  ]);

  const handleChange = (index, e) => {
    const { name, value } = e.target;
    const updatedItems = [...items];
    updatedItems[index][name] = value;
    setItems(updatedItems);
  };

  const handleImageChange = (index, e) => {
    const updatedItems = [...items];
    updatedItems[index].itemImage = e.target.files[0];
    setItems(updatedItems);
  };

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        itemCode: "",
        categoryName: "",
        itemName: "",
        unit: "",
        pcsPerCtn: "",
        wtPerCtn: "",
        cbmPerCtn: "",
        itemImageLink: "",
        itemImage: null,
      },
    ]);
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("No authentication token found!");
      return;
    }

    const formData = new FormData();
    items.forEach((item, index) => {
      // Append each item field
      formData.append(`items[${index}][itemCode]`, item.itemCode);
      formData.append(`items[${index}][categoryName]`, item.categoryName);
      formData.append(`items[${index}][itemName]`, item.itemName);
      formData.append(`items[${index}][unit]`, item.unit);
      formData.append(`items[${index}][pcsPerCtn]`, item.pcsPerCtn);
      formData.append(`items[${index}][wtPerCtn]`, item.wtPerCtn);
      formData.append(`items[${index}][cbmPerCtn]`, item.cbmPerCtn);
      formData.append(`items[${index}][itemImageLink]`, item.itemImageLink);

      // Append file only if it exists
      if (item.itemImage) {
        formData.append(`items[${index}][itemImage]`, item.itemImage);
      }
    });

    try {
      const response = await fetch(
        "http://localhost:5000/api/categories/create",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData, // Send FormData, not JSON
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data.categories)) {
          onAddItems(data.categories);
          onClose();
          toast.success("Items added successfully!");
        } else {
          toast.error("Received invalid data from API!");
        }
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to add items");
      }
    } catch (error) {
      toast.error("An error occurred while adding items");
    }
  };

  const downloadSampleData = () => {
    const sampleData = [
      [
        "itemCode",
        "categoryName",
        "itemName",
        "unit",
        "pcsPerCtn",
        "wtPerCtn",
        "cbmPerCtn",
        "itemImageLink",
      ],
      [
        "001",
        "Electronics",
        "Smartphone",
        "Box",
        10,
        5,
        0.1,
        "http://example.com/image1.jpg",
      ],
      [
        "002",
        "Furniture",
        "Chair",
        "Pieces",
        2,
        7,
        0.3,
        "http://example.com/image2.jpg",
      ],
      // Add more rows here if necessary
    ];
    const ws = XLSX.utils.aoa_to_sheet(sampleData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sample Data");
    XLSX.writeFile(wb, "sample_data.xlsx");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-screen-xl">
        <h2 className="text-xl font-bold mb-4">Add Items</h2>
        <div className="flex items-center gap-4 mb-4">
          <ExcelUpload onDataLoaded={(data) => setItems(data)} />
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault(); // Prevent default link behavior
              downloadSampleData();
            }}
            className="px-4 py-2 text-blue-500 border border-blue-500 rounded"
          >
            Download Sample Data
          </a>
        </div>
<div className="max-h-96 overflow-y-auto mb-4">
        {items.map((item, index) => (
          <div key={index} className="mb-4 space-y-4">
            {/* Single-row input group */}
            <div className="flex flex-wrap gap-4 mb-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">
                  Item Code
                </label>
                <input
                  type="text"
                  name="itemCode"
                  value={item.itemCode}
                  onChange={(e) => handleChange(index, e)}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <input
                  type="text"
                  name="categoryName"
                  value={item.categoryName}
                  onChange={(e) => handleChange(index, e)}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">
                  Item Name
                </label>
                <input
                  type="text"
                  name="itemName"
                  value={item.itemName}
                  onChange={(e) => handleChange(index, e)}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="flex-1">
  <label className="block text-sm font-medium text-gray-700">
    Unit
  </label>
  <div className="relative">
    <input
      type="text"
      name="unit"
      value={item.unit}
      onChange={(e) => handleChange(index, e)}
      className="w-full p-2 pl-3 pr-10 border border-gray-300 rounded"
      placeholder="Enter Unit (e.g., Box, Pieces)"
    />
    {/* Dropdown icon */}
    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-5 h-5 text-gray-500"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
          clipRule="evenodd"
        />
      </svg>
    </div>
    {/* Dropdown select */}
    <select
      name="unit"
      value={item.unit}
      onChange={(e) => handleChange(index, e)}
      className="absolute left-0 top-0 w-full h-full opacity-0 cursor-pointer"
    >
      <option value="">Select Unit</option>
      <option value="Box">Box</option>
      <option value="Pieces">Pieces</option>
    </select>
  </div>
</div>


              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">
                  PCS per Carton
                </label>
                <input
                  type="number"
                  name="pcsPerCtn"
                  value={item.pcsPerCtn}
                  onChange={(e) => handleChange(index, e)}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">
                  Weight per Carton
                </label>
                <input
                  type="number"
                  name="wtPerCtn"
                  value={item.wtPerCtn}
                  onChange={(e) => handleChange(index, e)}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">
                  CBM per Carton
                </label>
                <input
                  type="number"
                  name="cbmPerCtn"
                  value={item.cbmPerCtn}
                  onChange={(e) => handleChange(index, e)}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">
                  Image URL
                </label>
                <input
                  type="url"
                  name="itemImageLink"
                  value={item.itemImageLink}
                  onChange={(e) => handleChange(index, e)}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">
                  Upload Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(index, e)}
                  className="w-full p-1.5 border border-gray-300 rounded"
                />
              </div>
            </div>

            {items.length > 1 && (
              <button
                onClick={() => {
                  const updatedItems = [...items];
                  updatedItems.splice(index, 1);
                  setItems(updatedItems);
                }}
                className="text-red-500 mt-2"
              >
                Remove Item
              </button>
            )}
          </div>
        ))}
        </div>
        <div className="flex justify-between mt-4">
          <button
            onClick={handleAddItem}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            + Add Another Item
          </button>
          <div>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-green-500 text-white rounded mr-2"
            >
              Save Items
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddItemModal;
