import React, { useState } from 'react';

export default function MaterialInwardRegister() {
  const [items, setItems] = useState([]);

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
            <div className="bg-yellow-300 px-2 py-1">#VALUE!</div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>TimeStamp</div>
            <input defaultValue="09/12/2024 11:41:16" className="border rounded px-2 py-1 w-full" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>Supplier Name</div>
            <select defaultValue="POLARIS" className="border rounded px-2 py-1 w-full">
              <option value="POLARIS">POLARIS</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>Container & Seal</div>
            <input defaultValue="#24242" className="border rounded px-2 py-1 w-full" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>Invoice No.</div>
            <input defaultValue="INC3334" className="border rounded px-2 py-1 w-full" />
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
            <input defaultValue="800000" className="border rounded px-2 py-1 w-full bg-green-100" />
          </div>
          <div className="flex gap-2">
            <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded">RE-CALL</button>
            <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded">TRIGGER</button>
            <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">OK</button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full caption-bottom text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2">Item Code</th>
              <th className="px-4 py-2">ItemName</th>
              <th className="px-4 py-2">Ctns</th>
              <th className="px-4 py-2">Qty/Ctn</th>
              <th className="px-4 py-2">Total Qty</th>
              <th className="px-4 py-2">Price/Unit</th>
              <th className="px-4 py-2">Total Amount</th>
              <th className="px-4 py-2">Wt/ctn</th>
              <th className="px-4 py-2">Total Weight</th>
              <th className="px-4 py-2">CBM/Ctn</th>
              <th className="px-4 py-2">Total CBM</th>
              <th className="px-4 py-2">Shipping Mark</th>
              <th className="px-4 py-2">RMB</th>
              <th className="px-4 py-2">INR</th>
              <th className="px-4 py-2">Image</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index} className="border-t">
                <td className="px-4 py-2">
                  <input
                    value={item.itemCode}
                    onChange={(e) => handleItemChange(index, 'itemCode', e.target.value)}
                    className="w-full border rounded px-2 py-1"
                  />
                </td>
                <td className="px-4 py-2">
                  <input
                    value={item.itemName}
                    onChange={(e) => handleItemChange(index, 'itemName', e.target.value)}
                    className="w-full border rounded px-2 py-1"
                  />
                </td>
                <td className="px-4 py-2">
                  <input
                    type="number"
                    value={item.ctns}
                    onChange={(e) => handleItemChange(index, 'ctns', e.target.value)}
                    className="w-full border rounded px-2 py-1"
                  />
                </td>
                <td className="px-4 py-2">
                  <input
                    type="number"
                    value={item.qtyPerCtn}
                    onChange={(e) => handleItemChange(index, 'qtyPerCtn', Number(e.target.value))}
                    className="w-full border rounded px-2 py-1"
                  />
                </td>
                <td className="px-4 py-2">
                  <input
                    type="number"
                    value={item.totalQty}
                    readOnly
                    className="w-full border rounded px-2 py-1 bg-gray-100"
                  />
                </td>
                <td className="px-4 py-2">
                  <input
                    type="number"
                    value={item.pricePerUnit}
                    onChange={(e) => handleItemChange(index, 'pricePerUnit', Number(e.target.value))}
                    className="w-full border rounded px-2 py-1"
                  />
                </td>
                <td className="px-4 py-2">
                  <input
                    type="number"
                    value={item.totalAmount.toFixed(2)}
                    readOnly
                    className="w-full border rounded px-2 py-1 bg-gray-100"
                  />
                </td>
                <td className="px-4 py-2">
                  <input
                    type="number"
                    value={item.weightPerCtn}
                    onChange={(e) => handleItemChange(index, 'weightPerCtn', Number(e.target.value))}
                    className="w-full border rounded px-2 py-1"
                  />
                </td>
                <td className="px-4 py-2">
                  <input
                    type="number"
                    value={item.totalWeight.toFixed(3)}
                    readOnly
                    className="w-full border rounded px-2 py-1 bg-gray-100"
                  />
                </td>
                <td className="px-4 py-2">
                  <input
                    type="number"
                    value={item.cbmPerCtn}
                    onChange={(e) => handleItemChange(index, 'cbmPerCtn', Number(e.target.value))}
                    className="w-full border rounded px-2 py-1"
                  />
                </td>
                <td className="px-4 py-2">
                  <input
                    type="number"
                    value={item.totalCBM.toFixed(3)}
                    readOnly
                    className="w-full border rounded px-2 py-1 bg-gray-100"
                  />
                </td>
                <td className="px-4 py-2">
                  <input
                    value={item.shippingMark}
                    onChange={(e) => handleItemChange(index, 'shippingMark', e.target.value)}
                    className="w-full border rounded px-2 py-1"
                  />
                </td>
                <td className="px-4 py-2">
                  <input
                    type="number"
                    value={item.rmb}
                    onChange={(e) => handleItemChange(index, 'rmb', Number(e.target.value))}
                    className="w-full border rounded px-2 py-1"
                  />
                </td>
                <td className="px-4 py-2">
                  <input
                    type="number"
                    value={item.inr}
                    onChange={(e) => handleItemChange(index, 'inr', Number(e.target.value))}
                    className="w-full border rounded px-2 py-1"
                  />
                </td>
                <td className="px-4 py-2">
                  <img
                    src={item.image}
                    alt={item.itemName}
                    width={40}
                    height={40}
                    className="object-contain"
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
