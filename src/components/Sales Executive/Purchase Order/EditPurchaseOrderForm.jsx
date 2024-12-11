import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
const EditPurchaseOrderForm = ({ match }) => {
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
      orderContainer: "",
    },
  ]);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);

  const token = localStorage.getItem("token");
  const { id } = useParams(); // Get the ID from the URL params

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

    const fetchSuppliers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/supplier/suppliers", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSuppliers(response.data.suppliers);
      } catch (error) {
        console.error("Error fetching suppliers", error);
      }
    };

    const fetchPurchaseOrder = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/purchase-order/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const { referenceNo, toPerson, items } = response.data.data;
        setReferenceNo(referenceNo);
        setToPerson(toPerson);
        setItems(items);
      } catch (error) {
        console.error("Error fetching purchase order data", error);
      }
    };

    fetchCategories();
    fetchSuppliers();
    fetchPurchaseOrder();
  }, [token, id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const purchaseOrderData = {
      referenceNo,
      toPerson,
      items,
    };

    try {
      const response = await axios.put(
        `http://localhost:5000/api/purchase-order/${id}`,
        purchaseOrderData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Purchase Order Updated: " + response.data.message);
    } catch (error) {
      console.error(error);
      alert("Error updating purchase order");
    }
  };

  const handleCategoryChange = (e, index) => {
    const category = e.target.value;
    const updatedItems = [...items];
    updatedItems[index].Category = category;
    updatedItems[index].itemCode = "";
    updatedItems[index].itemDescription = "";
    updatedItems[index].orderContainer = "";
    setItems(updatedItems);
  };

  const handleItemChange = (e, index) => {
    const itemCode = e.target.value;
    const selectedCategoryData = categories.find(
      (category) => category.categoryName === items[index].Category
    );
    const selectedItem = selectedCategoryData.items.find(
      (item) => item.itemCode === itemCode
    );

    const updatedItems = [...items];
    updatedItems[index].itemCode = selectedItem.itemCode;
    updatedItems[index].itemDescription = selectedItem.itemName;
    updatedItems[index].unit = selectedItem.unit;
    updatedItems[index].itemImage = selectedItem.itemImage;
    updatedItems[index].Qtyctn = selectedItem.pcsPerCtn || "";
    updatedItems[index].Wtctn = selectedItem.wtPerCtn || "";
    updatedItems[index].Cbmctn = selectedItem.cbmPerCtn || "";

    setItems(updatedItems);
  };

  const handleOrderContainerChange = (e, index) => {
    const updatedItems = [...items];
    updatedItems[index].orderContainer = e.target.value;
    setItems(updatedItems);
  };

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
        orderContainer: "",
      },
    ]);
  };

  const handleDeleteRow = (index) => {
    const updatedItems = items.filter((_, idx) => idx !== index);
    setItems(updatedItems);
  };

  return (
    <div className="flex justify-center items-start p-6">
      <div className="w-full max-w-15xl p-6 bg-white rounded-xl shadow-md border border-gray-200">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">Edit Purchase Order</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
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
              <select
                value={toPerson}
                onChange={(e) => setToPerson(e.target.value)}
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                required
              >
                <option value="">Select Supplier</option>
                {suppliers.map((supplier) => (
                  <option key={supplier._id} value={supplier.supplierName}>
                    {supplier.supplierName}
                  </option>
                ))}
              </select>
            </div>
          </div>

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
                  <th className="px-4 py-2">Order-QTY/CTN</th>
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
                        className="px-3 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
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
                        value={item.itemCode}
                        onChange={(e) => handleItemChange(e, index)}
                        className="px-3 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="">Select Item</option>
                        {item.Category &&
                          categories
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
                        className="w-full px-2 py-1 border rounded-lg"
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

          <div className="mt-4">
            <button
              type="button"
              onClick={addItem}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
            >
              Add Item
            </button>
          </div>

          <div className="mt-4 text-center">
            <button
              type="submit"
              className="px-6 py-2 bg-green-600 text-white rounded-lg"
            >
              Update Purchase Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPurchaseOrderForm;
