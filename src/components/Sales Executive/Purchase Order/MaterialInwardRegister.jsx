import React, { useState,useEffect } from "react";
import axios from "axios";
import { useParams } from 'react-router-dom';
export default function MaterialInwardRegister() {
    const { grnId: grnIdFromParams } = useParams();
  const [items, setItems] = useState([]);
  const [grnId, setGrnId] = useState(grnIdFromParams);
  const [supplierName, setSupplierName] = useState("");
  const [timestamp, setTimestamp] = useState("");
  const [containerSeal, setContainerSeal] = useState("");
  const [invoiceNo, setInvoiceNo] = useState("");
  const [invoiceCopy, setInvoiceCopy] = useState("");
  const [warehouseName, setWarehouseName] = useState("");
  const [inlandCharges, setInlandCharges] = useState("");
  const [agentComm, setAgentComm] = useState("");
  const [freight, setFreight] = useState("");
  const [customDuty, setCustomDuty] = useState("");
  const [clearingAgentFee, setClearingAgentFee] = useState("");
  const [transport, setTransport] = useState("");
  const [unloadingCharges, setUnloadingCharges] = useState("");
  const [Cfs, setCfs] = useState("");
  const [DO, setDO] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [triggerClicked, setTriggerClicked] = useState(false);
  const fetchDetails = async (referenceNo) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:5000/api/purchase-order/${referenceNo}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data.data;
      setGrnId(data.referenceNo);
      setTimestamp(new Date(data.createdAt).toLocaleString());
      setSupplierName(data.toPerson);
      setContainerSeal(data.containerSeal);
      setInvoiceNo(data.invoiceNo);

      setItems(
        data.items.map((item) => ({
          itemCategory: item.Category,
          itemCode: item.itemCode,
          itemName: item.itemDescription,
          orderContainer: item.orderContainer || 0,
          ctns: item.ctns || item.orderContainer|| 0,
          qtyPerCtn: item.Qtyctn || 0,
          totalQty: item.TotalQuantity || 0,
          PricePerUnit: item.PricePerUnit,
          totalAmount: item.totalItemAmount || 0,
          weightPerCtn: item.Wtctn || 0,
          totalWeight: item.TotalWeight  || 0,
          cbmPerCtn: item.Cbmctn || 0,
          totalCBM: item.TotalCbm  || 0,
          shippingMark: item.ShippingMark || "",
          rmb: 0,
          inr: 0,
          image: item.itemImage,
        }))
      );

      // Clear remaining fields
      setInlandCharges(data.inlandCharges);
      setAgentComm(data.agentComm);
      setFreight(data.freight);
      setCustomDuty(data.customDuty);
      setClearingAgentFee(data.clearingAgentFee);
      setTransport(data.transport);
      setUnloadingCharges(data.unloadingCharges);
      setTotalAmount(data.totalAmount);
      setWarehouseName(data.warehouseName);
      setInvoiceCopy(data.invoiceCopy);
      setCfs(data.Cfs);
      setDO(data.DO);
    } catch (error) {
      console.error("Error fetching details:", error);
      alert("Error fetching data. Please check the reference number.");
    }
  };


  const handleTriggerClick = () => {
    setTriggerClicked(true); // Set the state to track the trigger click
    fetchDetails(grnId); // Fetch details for the current GRN ID
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };

    // Recalculate dependent fields
    if (field === "qtyPerCtn" || field === "ctns") {
      updatedItems[index].totalQty =
        Number(updatedItems[index].qtyPerCtn) *
        Number(updatedItems[index].ctns);
    }
    if (field === "PricePerUnit" || field === "totalQty") {
      updatedItems[index].totalAmount =
        Number(updatedItems[index].PricePerUnit) * updatedItems[index].totalQty;
    }
    if (field === "weightPerCtn" || field === "ctns") {
      updatedItems[index].totalWeight =
        Number(updatedItems[index].weightPerCtn) *
        Number(updatedItems[index].ctns);
    }
    if (field === "cbmPerCtn" || field === "ctns") {
      updatedItems[index].totalCBM =
        Number(updatedItems[index].cbmPerCtn) *
        Number(updatedItems[index].ctns);
    }

    setItems(updatedItems);
  };

  // Automatically recalculate fields if there is a value in ctns after fetch
  useEffect(() => {
    const autoCalculateItems = () => {
      const updatedItems = items.map((item) => {
        if (item.ctns > 0) {
          if (item.qtyPerCtn > 0) {
            item.totalQty = item.qtyPerCtn * item.ctns;
          }
          if (item.PricePerUnit > 0 && item.totalQty > 0) {
            item.totalAmount = item.PricePerUnit * item.totalQty;
          }
          if (item.weightPerCtn > 0 && item.ctns > 0) {
            item.totalWeight = item.weightPerCtn * item.ctns;
          }
          if (item.cbmPerCtn > 0 && item.ctns > 0) {
            item.totalCBM = item.cbmPerCtn * item.ctns;
          }
        }
        return item;
      });
      setItems(updatedItems);
    };

    if (items.length > 0) {
      autoCalculateItems();
    }
  }, [items]);

  // Update Purchase Order function
  const updatePurchaseOrder = async () => {
    const token = localStorage.getItem("token");

    const updatedData = {
      referenceNo: grnId, // Using the GRN ID for reference
      containerSeal: containerSeal,
      invoiceNo: invoiceNo,
      inlandCharges: inlandCharges,
      agentComm: agentComm,
      freight: freight,
      customDuty: customDuty,
      clearingAgentFee: clearingAgentFee,
      transport: transport,
      unloadingCharges: unloadingCharges,
      warehouseName: warehouseName,
      Cfs: Cfs,
      DO: DO,
      items: items.map((item) => ({
        itemCode: item.itemCode,
        itemDescription: item.itemName,
        Category: item.itemCategory,
        unit: "Box", // Assume box as unit, change if needed
        itemImage: item.image,
        orderContainer: item.orderContainer,
        ctns: item.ctns,
        Qtyctn: item.qtyPerCtn,
        Wtctn: item.weightPerCtn,
        Cbmctn: item.cbmPerCtn,
        ShippingMark: item.shippingMark,
        PricePerUnit: item.PricePerUnit,
        totalItemAmount: item.totalAmount, // Recalculated value from the form
      })),
    };

    try {
      const response = await axios.put(
        `http://localhost:5000/api/update/${grnId}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        alert("Data updated successfully!");
      }
    } catch (error) {
      console.error("Error updating data:", error);
      alert("Error updating data.");
    }
  };

  return (
    <div className="p-4 max-w-[1500px] mx-auto">
      {/* Header */}
      <div className="bg-blue-500 text-white text-center py-3 mb-4 text-xl font-bold">
        MATERIAL INWARD REGISTER
      </div>

      {/* Top Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mb-4">
  {/* First Column */}
  <div className="space-y-1">
    <div className="grid grid-cols-2 gap-1">
      <div className="bg-yellow-300 px-1 py-1">GRN ID</div>
      <div className="bg-yellow-300 px-1 py-1">
        <input
          value={grnId}
          onChange={(e) => setGrnId(e.target.value)}
          onBlur={() => fetchDetails(grnId)}
          className="border rounded px-1 py-1 w-full"
          placeholder="Enter Reference No."
        />
      </div>
    </div>
    <div className="grid grid-cols-2 gap-1">
      <div>TimeStamp</div>
      <input
        value={timestamp}
        className="border rounded px-1 py-1 w-full"
        readOnly
      />
    </div>
    <div className="grid grid-cols-2 gap-1">
      <div>Supplier Name</div>
      <input
        value={supplierName}
        className="border rounded px-1 py-1 w-full"
        readOnly
      />
    </div>
    <div className="grid grid-cols-2 gap-1">
      <div>Container & Seal</div>
      <input
        value={containerSeal}
        onChange={(e) => setContainerSeal(e.target.value)}
        className="border rounded px-1 py-1 w-full"
      />
    </div>
    <div className="grid grid-cols-2 gap-1">
      <div>Invoice No.</div>
      <input
        value={invoiceNo}
        onChange={(e) => setInvoiceNo(e.target.value)}
        className="border rounded px-1 py-1 w-full"
      />
    </div>
    <div className="grid grid-cols-2 gap-1">
      <div>Invoice Copy</div>
      <input
        value={invoiceCopy}
        onChange={(e) => setInvoiceCopy(e.target.value)}
        className="border rounded px-1 py-1 w-full"
      />
    </div>
    <div className="grid grid-cols-2 gap-1">
      <div>Warehouse Name</div>
      <input
        value={warehouseName}
        onChange={(e) => setWarehouseName(e.target.value)}
        className="border rounded px-1 py-1 w-full"
      />
    </div>
  </div>

  {/* Second Column */}
  <div className="space-y-1">
    <div className="grid grid-cols-2 gap-1">
      <div className="bg-yellow-200">Inland Charges (RMB)</div>
      <input
        value={inlandCharges}
        onChange={(e) => setInlandCharges(e.target.value)}
        className="border rounded px-1 py-1 w-full"
      />
    </div>
    <div className="grid grid-cols-2 gap-1">
      <div className="bg-yellow-200">Agent Comm. (2% ON CIF)</div>
      <input
        value={agentComm}
        onChange={(e) => setAgentComm(e.target.value)}
        className="border rounded px-1 py-1 w-full"
      />
    </div>
    <div className="grid grid-cols-2 gap-1">
      <div className="bg-yellow-200">Freight (RMB)</div>
      <input
        value={freight}
        onChange={(e) => setFreight(e.target.value)}
        className="border rounded px-1 py-1 w-full"
      />
    </div>
    <div className="grid grid-cols-2 gap-1">
      <div className="bg-yellow-200">Custom Duty (INR)</div>
      <input
        value={customDuty}
        onChange={(e) => setCustomDuty(e.target.value)}
        className="border rounded px-1 py-1 w-full"
      />
    </div>
    <div className="grid grid-cols-2 gap-1">
      <div className="bg-yellow-200">Clearing Agent Fee (INR)</div>
      <input
        value={clearingAgentFee}
        onChange={(e) => setClearingAgentFee(e.target.value)}
        className="border rounded px-1 py-1 w-full"
      />
    </div>
    <div className="grid grid-cols-2 gap-1">
      <div className="bg-yellow-200">CFS (INR)</div>
      <input
        value={Cfs}
        onChange={(e) => setCfs(e.target.value)}
        className="border rounded px-1 py-1 w-full"
      />
    </div>
    <div className="grid grid-cols-2 gap-1">
      <div className="bg-yellow-200">DO (INR)</div>
      <input
        value={DO}
        onChange={(e) => setDO(e.target.value)}
        className="border rounded px-1 py-1 w-full"
      />
    </div>
  </div>

  {/* Third Column */}
  <div className="space-y-1">
    <div className="grid grid-cols-2 gap-1">
      <div className="bg-yellow-200">Transport (INR)</div>
      <input
        value={transport}
        onChange={(e) => setTransport(e.target.value)}
        className="border rounded px-1 py-1 w-full"
      />
    </div>
    <div className="grid grid-cols-2 gap-1">
      <div className="bg-yellow-200">Unloading Chrgs.(INR)</div>
      <input
        value={unloadingCharges}
        onChange={(e) => setUnloadingCharges(e.target.value)}
        className="border rounded px-1 py-1 w-full"
      />
    </div>
    <div className="grid grid-cols-2 gap-1">
      <div className="bg-blue-200 font-bold">Total Amount</div>
      <input
        value={totalAmount}
        onChange={(e) => setTotalAmount(e.target.value)}
        className="border rounded px-1 py-1 w-full bg-green-100"
      />
    </div>
    <div className="flex gap-2">
      <button onClick={handleTriggerClick} className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-1 px-3 rounded">
        RE-CALL
      </button>
      <button
        className="bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-3 rounded"
        onClick={updatePurchaseOrder}
      >
        OK
      </button>
    </div>
  </div>
</div>


      {/* Table */}
      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full caption-bottom text-xs">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2">Item Category</th>
              <th className="px-4 py-2">Item Code</th>
              <th className="px-4 py-2">Item Name</th>
              <th className="px-4 py-2">Ordered Container</th>
              <th className="px-4 py-2">Recieved Ctns</th>
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
                <td className="px-4 py-2">
                  <input
                    value={item.itemCategory}
                    onChange={(e) =>
                      handleItemChange(index, "itemCategory", e.target.value)
                    }
                    className=" border rounded px-2 py-1 bg-gray-100"
                    readOnly
                  />
                </td>
                <td className="px-4 py-2">
                  <input
                    value={item.itemCode}
                    onChange={(e) =>
                      handleItemChange(index, "itemCode", e.target.value)
                    }
                    className=" border rounded px-2 py-1 bg-gray-100"
                    readOnly
                  />
                </td>
                <td className="px-4 py-2">
                  <input
                    value={item.itemName}
                    onChange={(e) =>
                      handleItemChange(index, "itemName", e.target.value)
                    }
                    className=" border rounded px-2 py-1 bg-gray-100"
                    readOnly
                  />
                </td>
                <td className="px-4 py-2">
                  <input
                    type="number"
                    value={item.orderContainer}
                    onChange={(e) =>
                      handleItemChange(index, "orderContainer", e.target.value)
                    }
                    className="w-full border rounded px-2 py-1 bg-gray-100"
                    readOnly
                  />
                </td>
                <td className="px-4 py-2">
                  <input
                    type="number"
                    value={item.ctns}
                    onChange={(e) =>
                      handleItemChange(index, "ctns", e.target.value)
                    }
                    className="w-full border rounded px-2 py-1"
                    
                  />
                </td>
                <td className="px-4 py-2">
                  <input
                    type="number"
                    value={item.qtyPerCtn}
                    onChange={(e) =>
                      handleItemChange(
                        index,
                        "qtyPerCtn",
                        Number(e.target.value)
                      )
                    }
                    className="w-full border rounded px-2 py-1 bg-gray-100"
                    readOnly
                  />
                </td>
                <td className="px-4 py-2">
                  <input
                    type="number"
                    value={item.totalQty}
                    readOnly
                    className="w-[70px] border rounded px-2 py-1 bg-gray-100"
                  />
                </td>
                <td className="px-4 py-2">
                  <input
                    type="number"
                    value={item.PricePerUnit}
                    onChange={(e) =>
                      handleItemChange(
                        index,
                        "PricePerUnit",
                        Number(e.target.value)
                      )
                    }
                    className="w-[70px] border rounded px-2 py-1"
                  />
                </td>
                <td className="px-4 py-2">
                  <input
                    type="number"
                    value={item.weightPerCtn}
                    onChange={(e) =>
                      handleItemChange(
                        index,
                        "weightPerCtn",
                        Number(e.target.value)
                      )
                    }
                    className="w-[70px] border rounded px-2 py-1 bg-gray-100"
                    readOnly
                  />
                </td>
                <td className="px-4 py-2">
                  <input
                    type="number"
                    value={item.totalWeight}
                    readOnly
                    className="w-[70px] border rounded px-2 py-1 bg-gray-100"
                    
                  />
                </td>
                <td className="px-4 py-2">
                  <input
                    type="number"
                    value={item.cbmPerCtn}
                    onChange={(e) =>
                      handleItemChange(
                        index,
                        "cbmPerCtn",
                        Number(e.target.value)
                      )
                    }
                    className="w-[70px] border rounded px-2 py-1 bg-gray-100"
                    readOnly
                  />
                </td>
                <td className="px-4 py-2">
                  <input
                    type="number"
                    value={item.totalCBM}
                    readOnly
                    className="w-[70px] border rounded px-2 py-1 bg-gray-100"
                  />
                </td>
                <td className="px-4 py-2">
                  <input
                    value={item.shippingMark}
                    onChange={(e) =>
                      handleItemChange(index, "shippingMark", e.target.value)
                    }
                    className="w-full border rounded px-2 py-1"
                  />
                </td>
                <td className="px-4 py-2">
                  <input
                    type="string"
                    value={item.totalAmount.toFixed(2)}
                    readOnly
                    className="w-[70px] border rounded px-2 py-1 bg-gray-100"
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
