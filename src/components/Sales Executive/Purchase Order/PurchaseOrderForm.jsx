import React, { useState } from "react";
import axios from "axios";

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
      
    },
  ]);

  // This should come from an authenticated user
  const token = localStorage.getItem("token"); // Assume the token is stored in localStorage

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare data for the API
    const purchaseOrderData = {
      referenceNo,
      toPerson,
      items,
    };

    try {
      const response = await axios.post("http://localhost:5000/api/purchase-order", purchaseOrderData, {
        headers: {
          Authorization: `Bearer ${token}`, // Send token in the Authorization header
        },
      });
      alert("Purchase Order Created: " + response.data.message);
    } catch (error) {
      console.error(error);
      alert("Error creating purchase order");
    }
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
        
      },
    ]);
  };

  // Handle input change for item fields
  const handleItemChange = (e, index) => {
    const { name, value } = e.target;
    const updatedItems = [...items];
    updatedItems[index][name] = value;
    setItems(updatedItems);
  };

  // Handle delete row
  const handleDeleteRow = (index) => {
    const updatedItems = items.filter((_, idx) => idx !== index);
    setItems(updatedItems);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-[90rem] p-8 bg-white rounded-xl shadow-lg border border-gray-300">
        <h2 className="text-4xl font-semibold text-gray-800 mb-8 text-center">Create Purchase Order</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Purchase Order General Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="col-span-1">
              <label className="block text-lg font-medium text-gray-700">Reference No</label>
              <input
                type="text"
                value={referenceNo}
                onChange={(e) => setReferenceNo(e.target.value)}
                className="mt-2 w-full px-5 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>

            <div className="col-span-1">
              <label className="block text-lg font-medium text-gray-700">To Person</label>
              <input
                type="text"
                value={toPerson}
                onChange={(e) => setToPerson(e.target.value)}
                className="mt-2 w-full px-5 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
          </div>

          {/* Item Table */}
          <div className="overflow-x-auto bg-gray-50 p-4 rounded-lg shadow-sm">
            <table className="min-w-full table-auto">
              <thead className="bg-indigo-600 text-white">
                <tr>
                <th className="px-6 py-3 text-sm font-semibold">Item Category</th>
                <th className="px-6 py-3 text-sm font-semibold">Item Description</th>
                  <th className="px-6 py-3 text-sm font-semibold">Item Code</th>                
                  <th className="px-6 py-3 text-sm font-semibold">Unit</th>
                  <th className="px-6 py-3 text-sm font-semibold">Item Image</th>
                  <th className="px-6 py-3 text-sm font-semibold">QTY/CTN</th>
                  <th className="px-6 py-3 text-sm font-semibold">WT/CTN</th>
                  <th className="px-6 py-3 text-sm font-semibold">CBM/CTN</th>
                 
                  <th className="px-6 py-3 text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={index} className="border-b border-gray-200">
                    <td className="px-6 py-3">
                      <input
                        type="text"
                        name="Category"
                        value={item.Category}
                        onChange={(e) => handleItemChange(e, index)}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </td>
                    <td className="px-6 py-3">
                      <input
                        type="text"
                        name="itemDescription"
                        value={item.itemDescription}
                        onChange={(e) => handleItemChange(e, index)}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </td>
                    <td className="px-6 py-3">
                      <input
                        type="text"
                        name="itemCode"
                        value={item.itemCode}
                        onChange={(e) => handleItemChange(e, index)}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </td>                  
                    <td className="px-6 py-3">
                      <input
                        type="text"
                        name="unit"
                        value={item.unit}
                        onChange={(e) => handleItemChange(e, index)}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </td>
                    <td className="px-6 py-3">
                      <input
                        type="text"
                        name="itemImage"
                        value={item.itemImage}
                        onChange={(e) => handleItemChange(e, index)}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </td>
                    <td className="px-6 py-3">
                      <input
                        type="number"
                        name="Qtyctn"
                        value={item.Qtyctn}
                        onChange={(e) => handleItemChange(e, index)}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </td>
                    <td className="px-6 py-3">
                      <input
                        type="number"
                        name="Wtctn"
                        value={item.Wtctn}
                        onChange={(e) => handleItemChange(e, index)}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </td>
                    <td className="px-6 py-3">
                      <input
                        type="number"
                        name="Cbmctn"
                        value={item.Cbmctn}
                        onChange={(e) => handleItemChange(e, index)}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </td>
                    
                    <td className="px-6 py-3">
                      <button
                        type="button"
                        onClick={() => handleDeleteRow(index)}
                        className="text-red-600 hover:text-red-800 text-lg"
                      >
                        &times;
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Add New Item Button */}
          <div className="mt-4 text-right">
            <button
              type="button"
              onClick={addItem}
              className="bg-indigo-500 text-white hover:bg-indigo-600 px-5 py-3 rounded-lg focus:ring-2 focus:ring-indigo-400"
            >
              <span className="text-lg">+ Add Item</span>
            </button>
          </div>

          {/* Submit Button */}
          <div className="mt-6 text-right">
            <button
              type="submit"
              className="bg-indigo-600 text-white px-8 py-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              Create Purchase Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PurchaseOrderForm;
