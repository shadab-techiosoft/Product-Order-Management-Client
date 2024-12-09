import React, { useState, useEffect } from 'react';

export default function MaterialInwardRegister() {
  const [items, setItems] = useState([]);
  const [grnId, setGrnId] = useState('');
  const [timestamp, setTimestamp] = useState('');
  const [supplierName, setSupplierName] = useState('');
  const [containerSeal, setContainerSeal] = useState('');
  const [invoiceNo, setInvoiceNo] = useState('');

  useEffect(() => {
    // Fetch data from the API
    const fetchData = async () => {
        const token = localStorage.getItem('token')
      try {
        const response = await fetch('http://localhost:5000/api/purchase-orders', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`, // Add your token here
            'Content-Type': 'application/json',
          },
        });

        const result = await response.json();

        if (result.data && result.data.length > 0) {
          const orderData = result.data[0];
          setGrnId(orderData.referenceNo); 
          setTimestamp(new Date(orderData.createdAt).toLocaleString()); 
          setSupplierName(orderData.toPerson); 
          
          // Set item details from the API
          const fetchedItems = orderData.items.map(item => ({
            itemCode: item.itemCode,
            itemName: item.itemDescription,
            ctns: item.Qtyctn || '',
            qtyPerCtn: item.qty || '',
            totalQty: (item.Qtyctn || 0) * (item.qty || 0),
            pricePerUnit: 0, // This is left to be filled by user
            totalAmount: 0, // This is left to be calculated based on qty and price
            weightPerCtn: item.Wtctn || 0,
            totalWeight: (item.Wtctn || 0) * (item.Qtyctn || 0),
            cbmPerCtn: item.Cbmctn || 0,
            totalCBM: (item.Cbmctn || 0) * (item.Qtyctn || 0),
            shippingMark: '', // Empty to be filled by user
            rmb: 0,
            inr: 0,
            image: item.itemImage || '/placeholder.svg',
          }));

          setItems(fetchedItems);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []); // Empty dependency array, this effect runs only once after initial render

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };

    // Recalculate dependent fields
    if (field === 'qtyPerCtn' || field === 'ctns') {
      updatedItems[index].totalQty = Number(updatedItems[index].qtyPerCtn) * Number(updatedItems[index].ctns);
    }
    if (field === 'pricePerUnit' || field === 'totalQty') {
      updatedItems[index].totalAmount = Number(updatedItems[index].pricePerUnit) * updatedItems[index].totalQty;
    }
    if (field === 'weightPerCtn' || field === 'ctns') {
      updatedItems[index].totalWeight = Number(updatedItems[index].weightPerCtn) * Number(updatedItems[index].ctns);
    }
    if (field === 'cbmPerCtn' || field === 'ctns') {
      updatedItems[index].totalCBM = Number(updatedItems[index].cbmPerCtn) * Number(updatedItems[index].ctns);
    }

    setItems(updatedItems);
  };

  return (
    <div className="p-4 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="bg-blue-500 text-white text-center py-3 mb-4 text-xl font-bold">
        MATERIAL INWARD REGISTER
      </div>

      {/* Top Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* First Column */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-yellow-300 px-2 py-1">GRN ID</div>
            <div className="bg-yellow-300 px-2 py-1">{grnId || '#VALUE!'}</div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>TimeStamp</div>
            <input
              value={timestamp}
              onChange={(e) => setTimestamp(e.target.value)}
              className="border rounded px-2 py-1 w-full"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>Supplier Name</div>
            <input
              value={supplierName}
              onChange={(e) => setSupplierName(e.target.value)}
              className="border rounded px-2 py-1 w-full"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>Container & Seal</div>
            <input
              value={containerSeal}
              onChange={(e) => setContainerSeal(e.target.value)}
              className="border rounded px-2 py-1 w-full"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>Invoice No.</div>
            <input
              value={invoiceNo}
              onChange={(e) => setInvoiceNo(e.target.value)}
              className="border rounded px-2 py-1 w-full"
            />
          </div>
        </div>

        {/* Second Column */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-yellow-200">Inland Charges (RMB)</div>
            <input className="border rounded px-2 py-1 w-full" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-yellow-200">Agent Comm. (2% ON CIF)</div>
            <input className="border rounded px-2 py-1 w-full" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-yellow-200">Freight (RMB)</div>
            <input className="border rounded px-2 py-1 w-full" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-yellow-200">Custom Duty (INR)</div>
            <input className="border rounded px-2 py-1 w-full" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-yellow-200">Clearing Agent Fee (INR)</div>
            <input className="border rounded px-2 py-1 w-full" />
          </div>
        </div>

        {/* Third Column */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-yellow-200">Transport (INR)</div>
            <input className="border rounded px-2 py-1 w-full" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-yellow-200">Unloading Chrgs.(INR)</div>
            <input className="border rounded px-2 py-1 w-full" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-blue-200 font-bold">Total Amount</div>
            <input value="800000" className="border rounded px-2 py-1 w-full bg-green-100" />
          </div>
          <div className="flex gap-2">
            <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded">RE-CALL</button>
            <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded">TRIGGER</button>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">Item Code</th>
              <th className="p-2 border">Description</th>
              <th className="p-2 border">CTNs</th>
              <th className="p-2 border">Qty/Ctn</th>
              <th className="p-2 border">Total Qty</th>
              <th className="p-2 border">Price/Unit</th>
              <th className="p-2 border">Total Amount</th>
              <th className="p-2 border">Weight/Ctn</th>
              <th className="p-2 border">Total Weight</th>
              <th className="p-2 border">CBM/Ctn</th>
              <th className="p-2 border">Total CBM</th>
              <th className="p-2 border">Shipping Marks</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index}>
                <td className="p-2 border">{item.itemCode}</td>
                <td className="p-2 border">{item.itemName}</td>
                <td className="p-2 border">
                  <input
                    type="number"
                    value={item.ctns}
                    onChange={(e) => handleItemChange(index, 'ctns', e.target.value)}
                    className="w-full border rounded px-2 py-1"
                  />
                </td>
                <td className="p-2 border">
                  <input
                    type="number"
                    value={item.qtyPerCtn}
                    onChange={(e) => handleItemChange(index, 'qtyPerCtn', e.target.value)}
                    className="w-full border rounded px-2 py-1"
                  />
                </td>
                <td className="p-2 border">{item.totalQty}</td>
                <td className="p-2 border">
                  <input
                    type="number"
                    value={item.pricePerUnit}
                    onChange={(e) => handleItemChange(index, 'pricePerUnit', e.target.value)}
                    className="w-full border rounded px-2 py-1"
                  />
                </td>
                <td className="p-2 border">{item.totalAmount}</td>
                <td className="p-2 border">
                  <input
                    type="number"
                    value={item.weightPerCtn}
                    onChange={(e) => handleItemChange(index, 'weightPerCtn', e.target.value)}
                    className="w-full border rounded px-2 py-1"
                  />
                </td>
                <td className="p-2 border">{item.totalWeight}</td>
                <td className="p-2 border">
                  <input
                    type="number"
                    value={item.cbmPerCtn}
                    onChange={(e) => handleItemChange(index, 'cbmPerCtn', e.target.value)}
                    className="w-full border rounded px-2 py-1"
                  />
                </td>
                <td className="p-2 border">{item.totalCBM}</td>
                <td className="p-2 border">
                  <input
                    type="text"
                    value={item.shippingMark}
                    onChange={(e) => handleItemChange(index, 'shippingMark', e.target.value)}
                    className="w-full border rounded px-2 py-1"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
