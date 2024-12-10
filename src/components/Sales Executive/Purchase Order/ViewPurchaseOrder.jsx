import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

export default function ViewPurchaseOrder() {
  const { referenceNo } = useParams(); // Reference number from the URL params
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

  const fetchDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`http://localhost:5000/api/purchase-order/purchase-order/${referenceNo}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = response.data.data;
      setGrnId(data.referenceNo);
      setTimestamp(new Date(data.createdAt).toLocaleString());
      setSupplierName(data.toPerson);
      setContainerSeal(data.containerSeal || '');
      setInvoiceNo(data.invoiceNo || '');

      setItems(
        data.items.map(item => ({
          itemCategory: item.Category,
          itemCode: item.itemCode,
          itemName: item.itemDescription,
          ctns: item.ctns || 0,
          qtyPerCtn: item.Qtyctn || 0,
          totalQty: item.Qtyctn * item.ctns || 0,
          pricePerUnit: item.PricePerUnit || 0,
          totalAmount: item.totalAmount || 0,
          weightPerCtn: item.Wtctn || 0,
          totalWeight: item.Wtctn * item.Qtyctn || 0,
          cbmPerCtn: item.Cbmctn || 0,
          totalCBM: item.Cbmctn * item.Qtyctn || 0,
          shippingMark: item.shippingMark || '',
          image: item.itemImage || '',
        }))
      );

      // Set the financial fields if available
      setInlandCharges(data.inlandCharges || '');
      setAgentComm(data.agentComm || '');
      setFreight(data.freight || '');
      setCustomDuty(data.customDuty || '');
      setClearingAgentFee(data.clearingAgentFee || '');
      setTransport(data.transport || '');
      setUnloadingCharges(data.unloadingCharges || '');
      setTotalAmount(data.totalAmount || '');
    } catch (error) {
      console.error("Error fetching details:", error);
      alert("Error fetching data. Please check the reference number.");
    }
  };

  useEffect(() => {
    if (referenceNo) {
      fetchDetails();  // Fetch data when the component mounts
    }
  }, [referenceNo]);

  return (
    <div className="p-4 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="bg-blue-500 text-white text-center py-3 mb-4 text-xl font-bold">
        MATERIAL INWARD REGISTER (View Only)
      </div>

      {/* Top Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* First Column */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-yellow-300 px-2 py-1">GRN ID</div>
            <div className="bg-yellow-300 px-2 py-1">{grnId}</div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>TimeStamp</div>
            <div>{timestamp}</div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>Supplier Name</div>
            <div>{supplierName}</div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>Container & Seal</div>
            <div>{containerSeal}</div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>Invoice No.</div>
            <div>{invoiceNo}</div>
          </div>
        </div>

        {/* Second Column */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-yellow-200">Inland Charges (RMB)</div>
            <div>{inlandCharges}</div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-yellow-200">Agent Comm. (2% ON CIF)</div>
            <div>{agentComm}</div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-yellow-200">Freight (RMB)</div>
            <div>{freight}</div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-yellow-200">Custom Duty (INR)</div>
            <div>{customDuty}</div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-yellow-200">Clearing Agent Fee (INR)</div>
            <div>{clearingAgentFee}</div>
          </div>
        </div>

        {/* Third Column */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-yellow-200">Transport (INR)</div>
            <div>{transport}</div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-yellow-200">Unloading Chrgs.(INR)</div>
            <div>{unloadingCharges}</div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-blue-200 font-bold">Total Amount</div>
            <div>{totalAmount}</div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full caption-bottom text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2">Item Category</th>
              <th className="px-4 py-2">Item Code</th>
              <th className="px-4 py-2">Item Name</th>
              <th className="px-4 py-2">Ctns</th>
              <th className="px-4 py-2">Qty/Ctn</th>
              <th className="px-4 py-2">Total Qty</th>
              <th className="px-4 py-2">Price/Unit</th>
              <th className="px-4 py-2">Wt/Ctn</th>
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
                <td className="px-4 py-2">{item.itemCategory}</td>
                <td className="px-4 py-2">{item.itemCode}</td>
                <td className="px-4 py-2">{item.itemName}</td>
                <td className="px-4 py-2">{item.ctns}</td>
                <td className="px-4 py-2">{item.qtyPerCtn}</td>
                <td className="px-4 py-2">{item.totalQty}</td>
                <td className="px-4 py-2">{item.PricePerUnit}</td>
                <td className="px-4 py-2">{item.weightPerCtn}</td>
                <td className="px-4 py-2">{item.totalWeight.toFixed(3)}</td>
                <td className="px-4 py-2">{item.cbmPerCtn}</td>
                <td className="px-4 py-2">{item.totalCBM.toFixed(3)}</td>
                <td className="px-4 py-2">{item.shippingMark}</td>
                <td className="px-4 py-2">{item.totalAmount.toFixed(2)}</td>
                <td className="px-4 py-2">
                  <img src={item.image} alt={item.itemName} width={40} height={40} className="object-contain" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
