import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
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
  const [inlandCharges, setInlandCharges] = useState(0);
  const [agentComm, setAgentComm] = useState(0);
  const [freight, setFreight] = useState(0);
  const [customDuty, setCustomDuty] = useState(0);
  const [clearingAgentFee, setClearingAgentFee] = useState(0);
  const [transport, setTransport] = useState(0);
  const [unloadingCharges, setUnloadingCharges] = useState(0);
  const [Cfs, setCfs] = useState(0);
  const [DO, setDO] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [triggerClicked, setTriggerClicked] = useState(false);
  const [loading, setLoading] = useState(false); // State to show loading spinner or message
  const [error, setError] = useState("");
  const [status, setStatus] = useState(""); // Default status
  const [warehouseNames, setWarehouseNames] = useState([]);

  // Fetch warehouse names on component mount
  useEffect(() => {
    const fetchWarehouseNames = async () => {
      try {
        const token = localStorage.getItem("token");

        // Make the GET request to fetch warehouse names
        const response = await axios.get("http://localhost:5000/api/warehouse/get-warehouse/name", {
          headers: {
            Authorization: `Bearer ${token}`, // Authorization header with token
          },
        });

        if (response.status === 200) {
          // Assuming response.data.data is the array of warehouses
          const warehouseList = response.data.data;
          
          // Extract warehouse names from the response
          const names = warehouseList.map(warehouse => warehouse.warehouseName);
          setWarehouseNames(names); // Set the warehouse names to state
        }
      } catch (err) {
        console.error("Error fetching warehouse names:", err);
        setError("Failed to fetch warehouse names."); // Set error message if request fails
      }
    };

    fetchWarehouseNames(); // Call the function to fetch warehouse names
  }, []); 
   // Function to update the purchase order status
   const updateStatus = async (newStatus) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:5000/api/purchase-order/purchase-order/status/${grnId}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        setStatus(newStatus); // Update the status locally after successful API call
      }
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle file upload
  const handleFileUpload = async (e) => {
    const file = e.target.files[0]; // Get the file from input
    if (!file) return; // If no file selected, do nothing

    const formData = new FormData();
    formData.append("file", file); // Append the file to FormData

    try {
      setLoading(true); // Show loading state
      setError(""); // Clear previous errors

      // Send the file to the backend API (change the URL to your actual API)
      const response = await fetch("http://localhost:5000/api/upload/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("File upload failed. Please try again.");
      }

      const data = await response.json();

      // Check if fileUrls array is returned and set invoiceCopy to the first URL
      if (data.fileUrls && data.fileUrls.length > 0) {
        setInvoiceCopy(data.fileUrls[0]); // Set the first URL in the fileUrls array
      } else {
        throw new Error("No URL received from the server.");
      }
    } catch (err) {
      setError(err.message); // Show error message if the upload fails
    } finally {
      setLoading(false); // Hide loading state
    }
  };

  const fetchDetails = async (referenceNo) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:5000/api/purchase-order/purchase-order/${referenceNo}`,
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
          ctns: item.ctns || item.orderContainer || 0,
          qtyPerCtn: item.Qtyctn || 0,
          totalQty: item.TotalQuantity || 0,
          PricePerUnit: item.PricePerUnit,
          totalItemAmount: item.totalItemAmount || 0,
          weightPerCtn: item.Wtctn || 0,
          totalWeight: item.TotalWeight || 0,
          cbmPerCtn: item.Cbmctn || 0,
          totalCBM: item.TotalCbm || 0,
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
      setStatus(data.status)
    } catch (error) {
      console.error("Error fetching details:", error);
      alert("Error fetching data. Please check the reference number.");
    }
  };

  const handleTriggerClick = () => {
    setTriggerClicked(true); // Set the state to track the trigger click
    fetchDetails(grnId); // Fetch details for the current GRN ID
  };

  const calculateTotalAmount = () => {
    const total =
      (inlandCharges || 0) +
      (agentComm || 0) +
      (freight || 0) +
      (customDuty || 0) +
      (clearingAgentFee || 0) +
      (transport || 0) +
      (unloadingCharges || 0) +
      (Cfs || 0) +
      (DO || 0);

    setTotalAmount(total);
  };

  const handleInputChange = (e, setterFunction) => {
    const value = Number(e.target.value);
    // Ensure numeric values for all inputs
    setterFunction(value);
    calculateTotalAmount();
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
      updatedItems[index].totalItemAmount =
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

    //     perCbmPrice = totalAmount / totalCBM
    //     perCbmPrice = 10000 / 50
    //     perCbmPrice = 200 INR per CBM

    //     perUnitPrice = perCbmPrice / totalQty
    // perUnitPrice = 200 / 200
    // perUnitPrice = 1 INR per unit

    // Calculate PricePerUnit automatically based on totalAmount and totalCBM
    if (updatedItems[index].totalCBM > 0) {
      // Calculate Per CBM price: totalAmount / totalCBM
      const perCbmPrice = totalAmount / updatedItems[index].totalCBM;

      // Calculate Per Unit price: perCbmPrice / totalQty (items in 1 CBM)
      const perUnitPrice = perCbmPrice / updatedItems[index].totalQty;

      updatedItems[index].PricePerUnit = perUnitPrice;
    }

    setItems(updatedItems);
    calculateTotalAmount();
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
            item.totalItemAmount = item.PricePerUnit * item.totalQty;
          }
          if (item.weightPerCtn > 0 && item.ctns > 0) {
            item.totalWeight = item.weightPerCtn * item.ctns;
          }
          if (item.cbmPerCtn > 0 && item.ctns > 0) {
            item.totalCBM = item.cbmPerCtn * item.ctns;
          }

          if (item.totalCBM > 0) {
            // Calculate Per CBM price: totalAmount / totalCBM
            const perCbmPrice = totalAmount / item.totalCBM;

            // Calculate Per Unit price: perCbmPrice / totalQty (items in 1 CBM)
            const perUnitPrice = perCbmPrice / item.totalQty;

            item.PricePerUnit = perUnitPrice;
          }
        }
        return item;
      });
      setItems(updatedItems);
      calculateTotalAmount();
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
      invoiceCopy: invoiceCopy,
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
        totalItemAmount: item.totalItemAmount, // Recalculated value from the form
      })),
    };

    try {
      const response = await axios.put(
        `http://localhost:5000/api/purchase-order/update/${grnId}`,
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
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-yellow-300 font-bold text-sm">GRN ID</div>
            <div className="grid grid-cols-2 gap-2">
              <input
              readOnly
                value={grnId}
                onChange={(e) => setGrnId(e.target.value)}
                onBlur={() => fetchDetails(grnId)}
                className="border rounded px-2 py-1 w-full text-sm bg-gray-200"
                placeholder="Enter Reference No."
              />
              <button
                onClick={handleTriggerClick}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm py-1 px-3 rounded"
              >
                RE-CALL
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="bg-yellow-200 text-sm">TimeStamp</div>
            <input
              value={timestamp}
              className="border rounded px-2 py-1 w-full text-sm"
              readOnly
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="bg-yellow-200 text-sm">Supplier Name</div>
            <input
              value={supplierName}
              className="border rounded px-2 py-1 w-full text-sm"
              readOnly
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="bg-yellow-200 text-sm">Container & Seal</div>
            <input
              value={containerSeal}
              onChange={(e) => setContainerSeal(e.target.value)}
              className="border rounded px-2 py-1 w-full text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="bg-yellow-200 text-sm">Invoice No.</div>
            <input
              value={invoiceNo}
              onChange={(e) => setInvoiceNo(e.target.value)}
              className="border rounded px-2 py-1 w-full text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="bg-yellow-200 text-sm">Invoice Copy</div>
            <div>
              <input
                type="file"
                onChange={handleFileUpload}
                className="border rounded px-2 py-1 w-full text-sm"
              />
            </div>
          </div>
          {/* Display loading state */}
          {loading && <div className="text-sm text-blue-600">Uploading...</div>}

          {/* Display error message */}
          {error && <div className="text-sm text-red-600">{error}</div>}

          <div className="grid grid-cols-2 gap-2">
  <div className="bg-yellow-200 text-sm">Warehouse Name</div>
  <select
    value={warehouseName}
    onChange={(e) => setWarehouseName(e.target.value)}  // Update the warehouseName state when a selection is made
    className="border rounded px-2 py-1 w-full text-sm bg-blue-200"
  >
    <option value="" disabled>Select Warehouse</option>  {/* Default placeholder */}
    {warehouseNames.map((name, index) => (
      <option key={index} value={name}>
        {name}
      </option>
    ))}
  </select>
</div>
        </div>

        {/* Second Column */}
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-yellow-200 text-sm">Inland Charges (INR)</div>
            <input
              type="number"
              value={inlandCharges}
              onChange={(e) => handleInputChange(e, setInlandCharges)}
              className="border rounded px-2 py-1 w-full text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="bg-yellow-200 text-sm">Agent Comm. (2% ON CIF)</div>
            <input
              type="number"
              value={agentComm}
              onChange={(e) => handleInputChange(e, setAgentComm)}
              className="border rounded px-2 py-1 w-full text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="bg-yellow-200 text-sm">Freight (INR)</div>
            <input
              type="number"
              value={freight}
              onChange={(e) => handleInputChange(e, setFreight)}
              className="border rounded px-2 py-1 w-full text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="bg-yellow-200 text-sm">Custom Duty (INR)</div>
            <input
              type="number"
              value={customDuty}
              onChange={(e) => handleInputChange(e, setCustomDuty)}
              className="border rounded px-2 py-1 w-full text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="bg-yellow-200 text-sm">
              Clearing Agent Fee (INR)
            </div>
            <input
              type="number"
              value={clearingAgentFee}
              onChange={(e) => handleInputChange(e, setClearingAgentFee)}
              className="border rounded px-2 py-1 w-full text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="bg-yellow-200 text-sm">CFS (INR)</div>
            <input
              type="number"
              value={Cfs}
              onChange={(e) => handleInputChange(e, setCfs)}
              className="border rounded px-2 py-1 w-full text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="bg-yellow-200 text-sm">DO (INR)</div>
            <input
              type="number"
              value={DO}
              onChange={(e) => handleInputChange(e, setDO)}
              className="border rounded px-2 py-1 w-full text-sm"
            />
          </div>
        </div>

        {/* Third Column */}
        <div className="space-y-2">
      {/* Transport Input */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-yellow-200 text-sm">Transport (INR)</div>
        <input
          type="number"
          value={transport}
          onChange={(e) => handleInputChange(e, setTransport)}
          className="border rounded px-2 py-1 w-full text-sm"
        />
      </div>

      {/* Unloading Charges Input */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-yellow-200 text-sm">Unloading Chrgs. (INR)</div>
        <input
          type="number"
          value={unloadingCharges}
          onChange={(e) => handleInputChange(e, setUnloadingCharges)}
          className="border rounded px-2 py-1 w-full text-sm"
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="bg-yellow-200 text-sm font-bold">Status</div>
        <div className="flex items-center gap-2">
          <select
            value={status}
            onChange={(e) => updateStatus(e.target.value)}
            className="border rounded px-2 py-1 w-full text-sm bg-gray-50"
            disabled={loading}
          >
            <option value="open">Open</option>
            <option value="closed">Closed</option>
            {/* Add more status options here if needed */}
          </select>
        </div>
      </div>

      {/* Total Amount Input */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-blue-200 font-bold text-sm">Total Amount</div>
        <input
          type="number"
          value={totalAmount}
          onChange={(e) => handleInputChange(e, setTotalAmount)}
          className="border rounded px-2 py-1 w-full bg-green-100 text-sm"
        />
      </div>

      {/* Status Row with Toggle */}
      

      {/* Submit Button */}
      <div className="flex gap-2 justify-start">
        <button
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-3 rounded text-sm"
          onClick={updatePurchaseOrder}
          disabled={loading}
        >
          {loading ? "Updating..." : "OK"}
        </button>
      </div>
    </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full caption-bottom text-xs">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-2 py-1 text-xs">Item Category</th>
              <th className="px-2 py-1 text-xs">Item Code</th>
              <th className="px-2 py-1 text-xs">Item Name</th>
              <th className="px-2 py-1 text-xs">Ordered Qty/Ctn</th>
              <th className="px-2 py-1 text-xs">Recieved Ctns</th>
              <th className="px-2 py-1 text-xs">Qty/Ctn</th>
              <th className="px-2 py-1 text-xs">Total Qty</th>
              <th className="px-2 py-1 text-xs">Price/Unit</th>
              <th className="px-2 py-1 text-xs">Wt/Ctn</th>
              <th className="px-2 py-1 text-xs">Total Weight</th>
              <th className="px-2 py-1 text-xs">CBM/Ctn</th>
              <th className="px-2 py-1 text-xs">Total CBM</th>
              <th className="px-2 py-1 text-xs">Shipping Mark</th>
              <th className="px-2 py-1 text-xs">Total Amount</th>
              <th className="px-2 py-1 text-xs">Image</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index} className="border-t">
                <td className="px-2 py-1 text-xs">
                  <input
                    value={item.itemCategory}
                    onChange={(e) =>
                      handleItemChange(index, "itemCategory", e.target.value)
                    }
                    className="w-full border rounded px-2 py-1 text-xs bg-gray-100"
                    readOnly
                  />
                </td>
                <td className="px-2 py-1 text-xs">
                  <input
                    value={item.itemCode}
                    onChange={(e) =>
                      handleItemChange(index, "itemCode", e.target.value)
                    }
                    className="w-full border rounded px-2 py-1 text-xs bg-gray-100"
                    readOnly
                  />
                </td>
                <td className="px-2 py-1 text-xs">
                  <input
                    value={item.itemName}
                    onChange={(e) =>
                      handleItemChange(index, "itemName", e.target.value)
                    }
                    className=" border rounded px-2 py-1 text-xs bg-gray-100"
                    readOnly
                  />
                </td>
                <td className="px-2 py-1 text-xs">
                  <input
                    type="number"
                    value={item.orderContainer}
                    onChange={(e) =>
                      handleItemChange(index, "orderContainer", e.target.value)
                    }
                    className="w-full border rounded px-2 py-1 text-xs bg-gray-100"
                    readOnly
                  />
                </td>
                <td className="px-2 py-1 text-xs">
                  <input
                    type="number"
                    value={item.ctns}
                    onChange={(e) =>
                      handleItemChange(index, "ctns", e.target.value)
                    }
                    className="w-full border rounded px-2 py-1 text-xs"
                  />
                </td>
                <td className="px-2 py-1 text-xs">
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
                    className="w-full border rounded px-2 py-1 text-xs bg-gray-100"
                    readOnly
                  />
                </td>
                <td className="px-2 py-1 text-xs">
                  <input
                    type="number"
                    value={item.totalQty}
                    readOnly
                    className="w-[70px] border rounded px-2 py-1 text-xs bg-gray-100"
                  />
                </td>
                <td className="px-2 py-1 text-xs">
                  <input
                    readOnly
                    type="text"
                    value={item.PricePerUnit.toFixed(5)}
                    onChange={(e) =>
                      handleItemChange(
                        index,
                        "PricePerUnit",
                        Number(e.target.value)
                      )
                    }
                    className="w-[70px] border rounded px-2 py-1 text-xs bg-gray-100"
                  />
                </td>
                <td className="px-2 py-1 text-xs">
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
                    className="w-[70px] border rounded px-2 py-1 text-xs bg-gray-100"
                    readOnly
                  />
                </td>
                <td className="px-2 py-1 text-xs">
                  <input
                    type="number"
                    value={item.totalWeight}
                    readOnly
                    className="w-[70px] border rounded px-2 py-1 text-xs bg-gray-100"
                  />
                </td>
                <td className="px-2 py-1 text-xs">
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
                    className="w-[70px] border rounded px-2 py-1 text-xs bg-gray-100"
                    readOnly
                  />
                </td>
                <td className="px-2 py-1 text-xs">
                  <input
                    type="number"
                    value={item.totalCBM}
                    readOnly
                    className="w-[70px] border rounded px-2 py-1 text-xs bg-gray-100"
                  />
                </td>
                <td className="px-2 py-1 text-xs">
                  <input
                    value={item.shippingMark}
                    onChange={(e) =>
                      handleItemChange(index, "shippingMark", e.target.value)
                    }
                    className="w-full border rounded px-2 py-1 text-xs"
                  />
                </td>
                <td className="px-2 py-1 text-xs">
                  <input
                    type="text"
                    value={item.totalItemAmount.toFixed(2)}
                    readOnly
                    className="w-[80px] border rounded px-2 py-1 text-xs bg-gray-100"
                  />
                </td>
                <td className="px-2 py-1 text-xs">
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
