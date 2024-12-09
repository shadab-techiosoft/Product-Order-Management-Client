import React, { useState } from 'react';
import axios from 'axios';

export default function MaterialInwardRegister() {
  const [items, setItems] = useState([]);
  const [grnId, setGrnId] = useState('');
  const [supplierName, setSupplierName] = useState('');
  const [timestamp, setTimestamp] = useState('');
  const [containerSeal, setContainerSeal] = useState('');
  const [invoiceNo, setInvoiceNo] = useState('');
  const [inlandCharges, setInlandCharges] = useState('');
  const [agentComm, setAgentComm] = useState('');
  const [freight, setFreight] = useState('');
  const [customDuty, setCustomDuty] = useState('');
  const [clearingAgentFee, setClearingAgentFee] = useState('');
  const [transport, setTransport] = useState('');
  const [unloadingCharges, setUnloadingCharges] = useState('');
  const [totalAmount, setTotalAmount] = useState('');

  const fetchDetails = async (referenceNo) => {
    try {
        const token = localStorage.getItem("token")
      const response = await axios.get(`http://localhost:5000/api/purchase-order/${referenceNo}`, {
        headers: {
          Authorization: `Bearer ${token}`,  // Replace 'YOUR_TOKEN_HERE' with the actual token
        },
      });
      
      const data = response.data.data;
      setGrnId(data.referenceNo);
      setTimestamp(new Date(data.createdAt).toLocaleString());
      setSupplierName(data.toPerson);
      setContainerSeal('');
      setInvoiceNo('');
      
      // Map the fetched items data to the state
      setItems(
        data.items.map((item) => ({

          itemCategory: item.Category,
          itemCode: item.itemCode,
          itemName: item.itemDescription,
          ctns: item.ctns || 0,
          qtyPerCtn: item.Qtyctn || 0,
          totalQty: item.Qtyctn * item.qty || 0,
          pricePerUnit: 0,
          totalAmount: 0,
          weightPerCtn: item.Wtctn || 0,
          totalWeight: item.Wtctn * item.Qtyctn || 0,
          cbmPerCtn: item.Cbmctn || 0,
          totalCBM: item.Cbmctn * item.Qtyctn || 0,
          shippingMark: '',
          rmb: 0,
          inr: 0,
          image: item.itemImage,
        }))
      );
      
      // Clear remaining fields that aren't available in the API response
      setInlandCharges('');
      setAgentComm('');
      setFreight('');
      setCustomDuty('');
      setClearingAgentFee('');
      setTransport('');
      setUnloadingCharges('');
      setTotalAmount('');
    } catch (error) {
      console.error("Error fetching details:", error);
      alert("Error fetching data. Please check the reference number.");
    }
  };

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
            <div className="bg-yellow-300 px-2 py-1">
              <input
                value={grnId}
                onChange={(e) => setGrnId(e.target.value)}
                onBlur={() => fetchDetails(grnId)}
                className="border rounded px-2 py-1 w-full"
                placeholder="Enter Reference No."
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>TimeStamp</div>
            <input value={timestamp} className="border rounded px-2 py-1 w-full" readOnly />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>Supplier Name</div>
            <input value={supplierName} className="border rounded px-2 py-1 w-full" readOnly />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>Container & Seal</div>
            <input value={containerSeal} onChange={(e) => setContainerSeal(e.target.value)} className="border rounded px-2 py-1 w-full" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>Invoice No.</div>
            <input value={invoiceNo} onChange={(e) => setInvoiceNo(e.target.value)} className="border rounded px-2 py-1 w-full" />
          </div>
        </div>

        {/* Second Column */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-yellow-200">Inland Charges (RMB)</div>
            <input value={inlandCharges} onChange={(e) => setInlandCharges(e.target.value)} className="border rounded px-2 py-1 w-full" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-yellow-200">Agent Comm. (2% ON CIF)</div>
            <input value={agentComm} onChange={(e) => setAgentComm(e.target.value)} className="border rounded px-2 py-1 w-full" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-yellow-200">Freight (RMB)</div>
            <input value={freight} onChange={(e) => setFreight(e.target.value)} className="border rounded px-2 py-1 w-full" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-yellow-200">Custom Duty (INR)</div>
            <input value={customDuty} onChange={(e) => setCustomDuty(e.target.value)} className="border rounded px-2 py-1 w-full" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-yellow-200">Clearing Agent Fee (INR)</div>
            <input value={clearingAgentFee} onChange={(e) => setClearingAgentFee(e.target.value)} className="border rounded px-2 py-1 w-full" />
          </div>
        </div>

        {/* Third Column */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-yellow-200">Transport (INR)</div>
            <input value={transport} onChange={(e) => setTransport(e.target.value)} className="border rounded px-2 py-1 w-full" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-yellow-200">Unloading Chrgs.(INR)</div>
            <input value={unloadingCharges} onChange={(e) => setUnloadingCharges(e.target.value)} className="border rounded px-2 py-1 w-full" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-blue-200 font-bold">Total Amount</div>
            <input value={totalAmount} onChange={(e) => setTotalAmount(e.target.value)} className="border rounded px-2 py-1 w-full bg-green-100" />
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
            <th className="px-4 py-2">Item Cateory</th>
              <th className="px-4 py-2">Item Code</th>
              <th className="px-4 py-2">ItemName</th>
              <th className="px-4 py-2">Ctns</th>
              <th className="px-4 py-2">Qty/Ctn</th>
              <th className="px-4 py-2">Total Qty</th>
              <th className="px-4 py-2">Price/Unit</th>
              
              <th className="px-4 py-2">Wt/ctn</th>
              <th className="px-4 py-2">Total Weight</th>
              <th className="px-4 py-2">CBM/Ctn</th>
              <th className="px-4 py-2">Total CBM</th>
              <th className="px-4 py-2">Shipping Mark</th>
              <th className="px-4 py-2">Total Amount</th>
              <th className="px-4 py-2">Image</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index} className="border-t">
                <td className="px-4 py-2">
                  <input
                    value={item.itemCategory}
                    onChange={(e) => handleItemChange(index, 'itemCategory', e.target.value)}
                    className="w-full border rounded px-2 py-1"
                  />
                </td>
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
                    value={item.totalAmount.toFixed(2)}
                    readOnly
                    className="w-full border rounded px-2 py-1 bg-gray-100"
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
