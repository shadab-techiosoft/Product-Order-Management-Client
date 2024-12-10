import React, { useState, useEffect } from "react";
import axios from "axios";
import ExcelExport from './ExcelExport';
const PurchaseOrderForm = () => {
  const [referenceNo, setReferenceNo] = useState("");
  const [toPerson, setToPerson] = useState("");
  const [items, setItems] = useState([
    {
      Category: "",
      itemCode: "",
      itemDescription: "",
      unit: "",
      itemImage: "",
      Qtyctn: "",
      Wtctn: "",
      Cbmctn: "",
      orderContainer: "", // This field is independent and editable
    },
  ]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);

  const token = localStorage.getItem("token"); // Assume the token is stored in localStorage

  // Fetch categories and items from the API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/categories/all-categories", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCategories(response.data.categories);
      } catch (error) {
        console.error("Error fetching categories", error);
      }
    };

    fetchCategories();
  }, [token]);

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const purchaseOrderData = {
      referenceNo,
      toPerson,
      items,
    };

    try {
      const response = await axios.post("http://localhost:5000/api/purchase-order/purchase-order", purchaseOrderData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Purchase Order Created: " + response.data.message);
    } catch (error) {
      console.error(error);
      alert("Error creating purchase order");
    }
  };

  // Handle category selection
  const handleCategoryChange = (e, index) => {
    const category = e.target.value;
    const updatedItems = [...items];
    updatedItems[index].Category = category;
    updatedItems[index].itemCode = ""; // Clear the selected item code
    updatedItems[index].itemDescription = ""; // Clear the selected item description
    updatedItems[index].orderContainer = ""; // Clear the orderContainer
    setItems(updatedItems);
  };
  

  // Handle item selection
  const handleItemChange = (e, index) => {
    const itemCode = e.target.value; // The selected item code
    const selectedCategoryData = categories.find((category) => category.categoryName === items[index].Category);
    const selectedItem = selectedCategoryData.items.find((item) => item.itemCode === itemCode);
  
    const updatedItems = [...items];
    updatedItems[index].itemCode = selectedItem.itemCode; // Update the item code
    updatedItems[index].itemDescription = selectedItem.itemName; // Update the item description
    updatedItems[index].unit = selectedItem.unit; // Update unit
    updatedItems[index].itemImage = selectedItem.itemImage; // Update itemImage
    updatedItems[index].Qtyctn = selectedItem.pcsPerCtn || ""; // Update Qtyctn
    updatedItems[index].Wtctn = selectedItem.wtPerCtn || ""; // Update Wtctn
    updatedItems[index].Cbmctn = selectedItem.cbmPerCtn || ""; // Update Cbmctn
  
    setItems(updatedItems);
  };
  
  

  const handleOrderContainerChange = (e, index) => {
    const updatedItems = [...items];
    updatedItems[index].orderContainer = e.target.value;
    setItems(updatedItems);
  };
  
  // Add a new item row
  const addItem = () => {
    setItems([
      ...items,
      {
        Category: "",
        itemCode: "",
        itemDescription: "",
        unit: "",
        itemImage: "",
        Qtyctn: "",
        Wtctn: "",
        Cbmctn: "",
        orderContainer: "", // Add empty orderContainer for the new row
      },
    ]);
  };

  // Handle delete row
  const handleDeleteRow = (index) => {
    const updatedItems = items.filter((_, idx) => idx !== index);
    setItems(updatedItems);
  };

  return (
    <div className="flex justify-center items-start p-6">
      <div className="w-full max-w-15xl p-6 bg-white rounded-xl shadow-md border border-gray-200">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">Create Purchase Order</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Purchase Order General Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-base font-medium text-gray-700">Reference No</label>
              <input
                type="text"
                value={referenceNo}
                onChange={(e) => setReferenceNo(e.target.value)}
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-base font-medium text-gray-700">To Person</label>
              <input
                type="text"
                value={toPerson}
                onChange={(e) => setToPerson(e.target.value)}
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
          </div>

          {/* Item Table */}
          <div className="overflow-x-auto bg-gray-50 rounded-lg shadow-sm">
            <table className="min-w-full table-auto">
              <thead className="bg-indigo-600 text-white text-sm">
                <tr>
                  <th className="px-4 py-2">Item Category</th>
                  <th className="px-4 py-2">Item Description</th>
                  <th className="px-4 py-2">Item Code</th>
                  <th className="px-4 py-2">Unit</th>
                  <th className="px-4 py-2">Item Image</th>
                  <th className="px-4 py-2">QTY/CTN</th>
                  <th className="px-4 py-2">WT/CTN</th>
                  <th className="px-4 py-2">CBM/CTN</th>
                  <th className="px-4 py-2">Order Container</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
  {items.map((item, index) => (
    <tr key={index} className="border-b border-gray-200">
      <td className="px-2 py-1">
        <select
          name="Category"
          value={item.Category}
          onChange={(e) => handleCategoryChange(e, index)}
          className=" px-3 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="">Select Category</option>
          {categories.map((category, idx) => (
            <option key={idx} value={category.categoryName}>
              {category.categoryName}
            </option>
          ))}
        </select>
      </td>
      <td className="px-2 py-1">
        <select
          name="itemDescription"
          value={item.itemCode}  // Bind to itemCode of the current row
          onChange={(e) => handleItemChange(e, index)} // Handle item change independently
          className=" px-3 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="">Select Item</option>
          {item.Category && categories
            .find((category) => category.categoryName === item.Category)
            .items.map((itemOption) => (
              <option key={itemOption.itemCode} value={itemOption.itemCode}>
                {itemOption.itemName}
              </option>
            ))}
        </select>
      </td>
      <td className="px-2 py-1">
        <input
          type="text"
          name="itemCode"
          value={item.itemCode}
          readOnly
          className="w-full px-2 py-1 border rounded-lg bg-gray-200"
        />
      </td>
      <td className="px-2 py-1">
        <input
          type="text"
          name="unit"
          value={item.unit}
          readOnly
          className="w-full px-2 py-1 border rounded-lg bg-gray-200"
        />
      </td>
      <td className="px-2 py-1">
  {item.itemImage ? (
    <img
      src={item.itemImage}
      alt="Item Preview"
      className="w-16 h-16 object-contain border rounded-lg"
    />
  ) : (
    <span>No image</span>
  )}
</td>

      <td className="px-2 py-1">
        <input
          type="number"
          name="Qtyctn"
          value={item.Qtyctn}
          onChange={(e) => handleItemChange(e, index)}
          className="w-full px-2 py-1 border rounded-lg bg-gray-200"
        />
      </td>
      <td className="px-2 py-1">
        <input
          type="number"
          name="Wtctn"
          value={item.Wtctn}
          onChange={(e) => handleItemChange(e, index)}
          className="w-full px-2 py-1 border rounded-lg bg-gray-200"
        />
      </td>
      <td className="px-2 py-1">
        <input
          type="number"
          name="Cbmctn"
          value={item.Cbmctn}
          onChange={(e) => handleItemChange(e, index)}
          className="w-full px-2 py-1 border rounded-lg bg-gray-200"
        />
      </td>
      <td className="px-2 py-1">
        <input
          type="number"
          name="orderContainer"
          value={item.orderContainer}
          onChange={(e) => handleOrderContainerChange(e, index)}
          className="w-full px-2 py-1 border rounded-lg "
        />
      </td>
      <td className="px-2 py-1">
        <button
          type="button"
          onClick={() => handleDeleteRow(index)}
          className="px-2 py-1 text-red-600 bg-red-100 rounded-lg"
        >
          Delete
        </button>
      </td>
    </tr>
  ))}
</tbody>

            </table>
          </div>

          {/* Add Item Button */}
          <div className="mt-4">
            <button
              type="button"
              onClick={addItem}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
            >
              Add Item
            </button>
          </div>

          {/* Submit Button */}
          <div className="mt-4 text-center">
            <button
              type="submit"
              className="px-6 py-2 bg-green-600 text-white rounded-lg"
            >
              Submit Purchase Order
            </button>
          </div>
        </form>
        {/* <div className="mt-6 text-center">
          <ExcelExport purchaseOrderData={{ referenceNo, toPerson, items }} />
        </div> */}
      </div>
    </div>
  );
};

export default PurchaseOrderForm;
