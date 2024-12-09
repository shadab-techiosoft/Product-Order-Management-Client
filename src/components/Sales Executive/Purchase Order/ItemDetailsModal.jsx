import React, { useState } from "react";

const ItemDetailsModal = ({ items, closeModal, handleSaveItems }) => {
  const [editableItems, setEditableItems] = useState(items);

  const handleChange = (index, field, value) => {
    const updatedItems = [...editableItems];
    updatedItems[index][field] = value;
    setEditableItems(updatedItems);
  };

  const handleSave = () => {
    handleSaveItems(editableItems);
    closeModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg w-11/12 max-w-3xl">
        <h2 className="text-xl font-semibold mb-4">Item Details</h2>

        {/* Editable Table */}
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Code</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {editableItems.map((item, index) => (
              <tr key={index} className="border-b border-gray-200">
                <td className="px-4 py-2 text-sm">
                  <input
                    type="text"
                    value={item.itemCode}
                    onChange={(e) => handleChange(index, "itemCode", e.target.value)}
                    className="p-1 border border-gray-300 rounded-md w-full"
                  />
                </td>
                <td className="px-4 py-2 text-sm">
                  <input
                    type="text"
                    value={item.itemDescription || ""}
                    onChange={(e) => handleChange(index, "itemDescription", e.target.value)}
                    className="p-1 border border-gray-300 rounded-md w-full"
                  />
                </td>
                <td className="px-4 py-2 text-sm">
                  <input
                    type="number"
                    value={item.qty || ""}
                    onChange={(e) => handleChange(index, "qty", e.target.value)}
                    className="p-1 border border-gray-300 rounded-md w-full"
                  />
                </td>
                <td className="px-4 py-2 text-sm">
                  <input
                    type="text"
                    value={item.unit || ""}
                    onChange={(e) => handleChange(index, "unit", e.target.value)}
                    className="p-1 border border-gray-300 rounded-md w-full"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Action buttons */}
        <div className="mt-4 flex justify-end space-x-2">
          <button
            onClick={closeModal}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemDetailsModal;
