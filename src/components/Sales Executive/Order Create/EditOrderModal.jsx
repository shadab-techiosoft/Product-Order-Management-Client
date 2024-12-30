import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EditOrderModal = ({ order, closeModal, onOrderUpdated }) => {
  const [items, setItems] = useState(order.items || []);
  const [gst, setGst] = useState(order.gst || 0); // Add state for GST
  const [warehouses, setWarehouses] = useState([]); // State to store warehouses based on item name and code
  const [selectedWarehouse, setSelectedWarehouse] = useState(null); // Track selected warehouse for each item
  const [selectedInwardReference, setSelectedInwardReference] = useState(null); // Track selected inward reference for each item

  // Fetch warehouse data based on item details
  useEffect(() => {
    const fetchWarehouseData = async () => {
      try {
        // Fetch warehouse data for the selected items
        const token = localStorage.getItem('token');
        const warehouseResponse = await axios.get('http://localhost:5000/api/warehouse/inventory/warehouse-details', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWarehouses(warehouseResponse.data.data); // Set warehouse data in state
      } catch (error) {
        console.error("Error fetching warehouse data:", error.message);
      }
    };

    fetchWarehouseData();
  }, [order.items]);

  // Function to handle price change for a specific item
  const handlePriceChange = (index, value) => {
    const newItems = [...items];
    newItems[index].price = value;
    setItems(newItems);
  };

// Function to handle warehouse and inward reference change for a specific item
const handleWarehouseChange = (index, warehouseId, inwardReference, inwardShipmentMark) => {
  const newItems = [...items];
  newItems[index].wareHouseName = warehouseId; // Update the warehouse name
  newItems[index].inwardReference = inwardReference; // Store inward reference
  newItems[index].inwardShipmentMark = inwardShipmentMark; // Store inwardShipmentMark
  setItems(newItems);

  setSelectedWarehouse(warehouseId); // Track the selected warehouse
  setSelectedInwardReference(inwardReference); // Track the inward reference
};


  // Function to handle GST change
  const handleGstChange = (e) => {
    setGst(e.target.value);
  };

  // Function to handle changes in category, item name, item code, and qty
  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
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
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/orderItem/price/${order._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: items.map(item => ({
            categoryName: item.categoryName,
            itemName: item.itemName,
            itemCode: item.itemCode,
            qty: item.qty,
            price: item.price,
            wareHouseName: item.wareHouseName, // Include warehouse name in the request
            inwardReference: item.inwardReference || '', // Ensure inwardReference is included
            inwardShipmentMark: item.inwardShipmentMark || '',
          })),
          gst: gst, // Include GST in the request
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

  // Function to get available warehouses for an item
  const getAvailableWarehouses = (item) => {
    // Filter warehouses where the item exists
    return warehouses.reduce((availableWarehouses, warehouse) => {
      // Find all items in this warehouse with the same itemCode as the current item
      const warehouseItems = warehouse.items.filter(
        (warehouseItem) => warehouseItem.itemCode === item.itemCode
      );
      
      // Add each warehouse item (with inward reference and inward shipment mark) to the list
      warehouseItems.forEach((warehouseItem) => {
        availableWarehouses.push({
          warehouseId: warehouse._id,
          inwardReference: warehouseItem.inwardReference,
          inwardShipmentMark: warehouseItem.inwardShipmentMark,
          quantity: warehouseItem.quantity,
        });
      });
  
      return availableWarehouses;
    }, []);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-7xl w-full">
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
              {/* Category Name Input */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-600">Category Name</label>
                <input
                  readOnly
                  type="text"
                  value={item.categoryName}
                  onChange={(e) => handleItemChange(index, 'categoryName', e.target.value)}
                  className="bg-gray-200 mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              {/* Item Name Input */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-600">Item Name</label>
                <input
                  readOnly
                  type="text"
                  value={item.itemName}
                  onChange={(e) => handleItemChange(index, 'itemName', e.target.value)}
                  className="bg-gray-200 mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              {/* Item Code Input */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-600">Item Code</label>
                <input
                  readOnly
                  type="text"
                  value={item.itemCode}
                  onChange={(e) => handleItemChange(index, 'itemCode', e.target.value)}
                  className="bg-gray-200 mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              {/* Quantity Input */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-600">Quantity</label>
                <input
                  type="number"
                  value={item.qty}
                  onChange={(e) => handleItemChange(index, 'qty', e.target.value)}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
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

              {/* Warehouse Dropdown */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-600">Warehouse Name</label>
                <select
  value={item.wareHouseName}
  onChange={(e) => handleWarehouseChange(index, e.target.value, e.target.selectedOptions[0].dataset.inwardReference, e.target.selectedOptions[0].dataset.inwardShipmentMark)}
  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
>
  <option value="">Select Warehouse</option>
  {getAvailableWarehouses(item).map((warehouse, idx) => {
    const isOutOfStock = warehouse.quantity < item.qty; // Check if warehouse is out of stock

    return (
      <option
        key={idx}
        value={warehouse.warehouseId}
        data-inward-reference={warehouse.inwardReference} // Add inward reference as data attribute
        data-inward-shipment-mark={warehouse.inwardShipmentMark}
        disabled={isOutOfStock} // Disable out of stock options
        className={isOutOfStock ? 'text-red-600 bg-red-100' : ''} // Add class to highlight out of stock
      >
        {warehouse.warehouseId} - {isOutOfStock ? 'Out of Stock' : 'In Stock'} ({warehouse.quantity}) - Ref: {warehouse.inwardReference}
      </option>
    );
  })}
</select>

              </div>

              {/* Show Quantity and Inward Reference when a warehouse is selected */}
              {selectedWarehouse && (
                <div className="flex-1 mt-2">
                  {/* <div className="text-sm font-medium text-gray-600">Quantity Available: {item.qty}</div> */}
                  <div className="text-sm font-medium text-gray-600">Inward Reference: {selectedInwardReference}</div>
                  <div className="text-sm font-medium text-gray-600">Inward Shipment: {item.inwardShipmentMark}</div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* GST Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">GST (%)</label>
          <input
            type="number"
            value={gst}
            onChange={handleGstChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Total Amount Calculation */}
        <div className="flex justify-between mb-4">
          <div className="text-lg font-semibold">Total Amount Before GST: ₹{totalItemAmountBeforeGST}</div>
          <div className="text-lg font-semibold">GST: ₹{gstAmount}</div>
        </div>

        <div className="flex justify-between mb-4">
          <div className="text-lg font-semibold">Total Amount With GST: ₹{totalAmountWithGST}</div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end mt-4">
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            Update Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditOrderModal;















// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const EditOrderModal = ({ order, closeModal, onOrderUpdated }) => {
//   const [items, setItems] = useState(order.items || []);
//   const [gst, setGst] = useState(order.gst || 0); // Add state for GST
//   const [warehouses, setWarehouses] = useState([]); // State to store warehouses based on item name and code

//   // Fetch warehouse data based on item details
//   useEffect(() => {
//     const fetchWarehouseData = async () => {
//       try {
//         // Fetch warehouse data for the selected items
//         const token = localStorage.getItem('token');
//         const warehouseResponse = await axios.get('http://localhost:5000/api/warehouse/inventory/warehouse-details', {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setWarehouses(warehouseResponse.data.data); // Set warehouse data in state
//       } catch (error) {
//         console.error("Error fetching warehouse data:", error.message);
//       }
//     };

//     fetchWarehouseData();
//   }, [order.items]);

//   // Function to handle price change for a specific item
//   const handlePriceChange = (index, value) => {
//     const newItems = [...items];
//     newItems[index].price = value;
//     setItems(newItems);
//   };

//   // Function to handle warehouse name change for a specific item
//   const handleWarehouseChange = (index, value) => {
//     const newItems = [...items];
//     newItems[index].wareHouseName = value; // Update the warehouse name
//     setItems(newItems);
//   };

//   // Function to handle GST change
//   const handleGstChange = (e) => {
//     setGst(e.target.value);
//   };

//   // Function to handle changes in category, item name, item code, and qty
//   const handleItemChange = (index, field, value) => {
//     const newItems = [...items];
//     newItems[index][field] = value;
//     setItems(newItems);
//   };

//   // Calculate total item amount before GST
//   const totalItemAmountBeforeGST = items.reduce(
//     (total, item) => total + item.price * item.qty, 0
//   );

//   // Calculate GST amount
//   const gstAmount = (totalItemAmountBeforeGST * gst) / 100;

//   // Calculate total amount with GST
//   const totalAmountWithGST = totalItemAmountBeforeGST + gstAmount;

//   // Function to handle form submission
//   const handleSubmit = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       const response = await fetch(`http://localhost:5000/api/orderItem/price/${order._id}`, {
//         method: 'PUT',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           items: items.map(item => ({
//             categoryName: item.categoryName,
//             itemName: item.itemName,
//             itemCode: item.itemCode,
//             qty: item.qty,
//             price: item.price,
//             wareHouseName: item.wareHouseName // Include warehouse name in the request
//           })),
//           gst: gst // Include GST in the request
//         }),
//       });

//       if (!response.ok) {
//         throw new Error('Failed to update order');
//       }

//       const updatedOrder = await response.json();
//       onOrderUpdated(updatedOrder); // Update the parent component with the new order data
//       closeModal(); // Close the modal after successful update
//     } catch (error) {
//       console.error('Error updating order:', error);
//     }
//   };

//   return (
//     <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
//       <div className="bg-white rounded-lg shadow-xl p-6 max-w-6xl w-full">
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-2xl font-semibold text-gray-800">Edit Order</h2>
//           <button 
//             onClick={closeModal} 
//             className="text-gray-600 hover:text-gray-800 focus:outline-none">
//             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
//             </svg>
//           </button>
//         </div>

//         <div className="space-y-4">
//           <h3 className="text-xl font-semibold text-gray-700">Order Items</h3>
//           {items.map((item, index) => (
//             <div key={index} className="flex gap-4 mb-4 items-center">
//               {/* Category Name Input */}
//               <div className="flex-1">
//                 <label className="block text-sm font-medium text-gray-600">Category Name</label>
//                 <input
//                   readOnly
//                   type="text"
//                   value={item.categoryName}
//                   onChange={(e) => handleItemChange(index, 'categoryName', e.target.value)}
//                   className="bg-gray-200 mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
//                 />
//               </div>

//               {/* Item Name Input */}
//               <div className="flex-1">
//                 <label className="block text-sm font-medium text-gray-600">Item Name</label>
//                 <input
//                   readOnly
//                   type="text"
//                   value={item.itemName}
//                   onChange={(e) => handleItemChange(index, 'itemName', e.target.value)}
//                   className="bg-gray-200 mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
//                 />
//               </div>

//               {/* Item Code Input */}
//               <div className="flex-1">
//                 <label className="block text-sm font-medium text-gray-600">Item Code</label>
//                 <input
//                   readOnly
//                   type="text"
//                   value={item.itemCode}
//                   onChange={(e) => handleItemChange(index, 'itemCode', e.target.value)}
//                   className="bg-gray-200 mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
//                 />
//               </div>

//               {/* Quantity Input */}
//               <div className="flex-1">
//                 <label className="block text-sm font-medium text-gray-600">Quantity</label>
//                 <input
//                   type="number"
//                   value={item.qty}
//                   onChange={(e) => handleItemChange(index, 'qty', e.target.value)}
//                   className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
//                 />
//               </div>

//               {/* Price Input */}
//               <div className="flex-1">
//                 <label className="block text-sm font-medium text-gray-600">Price</label>
//                 <input
//                   type="number"
//                   value={item.price}
//                   onChange={(e) => handlePriceChange(index, e.target.value)}
//                   className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
//                 />
//               </div>

//               {/* Warehouse Name Input (Replaced dropdown with input) */}
//               <div className="flex-1">
//                 <label className="block text-sm font-medium text-gray-600">Warehouse Name</label>
//                 <input
//                   type="text"
//                   value={item.wareHouseName}
//                   onChange={(e) => handleWarehouseChange(index, e.target.value)}
//                   className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
//                 />
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* GST Input */}
//         <div className="mt-4">
//           <label className="block text-sm font-medium text-gray-600">GST (%)</label>
//           <input
//             type="number"
//             value={gst}
//             onChange={handleGstChange}
//             className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
//           />
//         </div>

//         {/* Total Amount */}
//         <div className="mt-4 text-right">
//           <p>Total Amount Before GST: ₹{totalItemAmountBeforeGST}</p>
//           <p>GST Amount: ₹{gstAmount}</p>
//           <p className="font-semibold">Total Amount With GST: ₹{totalAmountWithGST}</p>
//         </div>

//         <div className="mt-6 flex justify-end gap-4">
//           <button onClick={closeModal} className="px-4 py-2 bg-gray-500 text-white rounded-lg">Cancel</button>
//           <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded-lg">Update Order</button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EditOrderModal;