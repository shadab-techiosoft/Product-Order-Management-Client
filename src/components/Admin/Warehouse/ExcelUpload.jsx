import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { toast } from "react-toastify";
import axios from "axios";

const ExcelUpload = ({ onFillForm }) => {
  const [file, setFile] = useState(null);
  const [itemData, setItemData] = useState([]);
  const [warehouseData, setWarehouseData] = useState([]);
  
  // Fetch data from APIs when the component mounts
  useEffect(() => {
    const token = localStorage.getItem("token")
    // Fetch item data (categories and items)
    axios
      .get("http://localhost:5000/api/categories", {
        headers: {
          Authorization: `Bearer ${token}`, // Set your auth token here
        },
      })
      .then((response) => {
        setItemData(response.data);
      })
      .catch((error) => {
        toast.error("Failed to fetch item data.");
        console.error(error);
      });

    // Fetch warehouse names
    axios
      .get("http://localhost:5000/api/warehouse/get-warehouse/name", {
        headers: {
          Authorization: `Bearer ${token}`, // Set your auth token here
        },
      })
      .then((response) => {
        setWarehouseData(response.data.data);
      })
      .catch((error) => {
        toast.error("Failed to fetch warehouse data.");
        console.error(error);
      });
  }, []);

  // Handle Excel file upload and parsing
  const handleFileUpload = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
      setFile(selectedFile);
      readExcelFile(selectedFile);
    } else {
      toast.error("Please upload a valid Excel file");
    }
  };

  // Read and parse the uploaded Excel file
  const readExcelFile = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const binaryString = e.target.result;
      const workbook = XLSX.read(binaryString, { type: "binary" });

      // Assuming the first sheet has the required data
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(sheet);

      if (data.length > 0) {
        // Call the parent function to fill the form
        onFillForm(data);
      } else {
        toast.error("The Excel file is empty or not in the correct format.");
      }
    };
    reader.readAsBinaryString(file);
  };

  // Function to generate random quantity
  const generateRandomQuantity = () => Math.floor(Math.random() * 100) + 1;  // Random number between 1 and 100

  // Generate a sample Excel file with predefined data
 // Generate a sample Excel file with predefined data
const generateSampleExcel = () => {
  if (!itemData.length || !warehouseData.length) {
    toast.error("Unable to generate sample Excel: Missing data.");
    return;
  }

  // Create the sample data using the fetched item and warehouse data
  const sampleData = itemData.map((item) => {
    // Randomly select a warehouse from the warehouse list
    const randomWarehouse = warehouseData[Math.floor(Math.random() * warehouseData.length)];

    return {
      warehouseName: randomWarehouse.warehouseName,  // Random warehouse
      itemCode: item.itemCode,                       // Item Code from API
      itemName: item.itemName,                       // Item Name from API
      itemCategory: item.categoryName,               // Category Name from API
      itemImage: item.itemImage,                     // Item Image from API
      quantity: generateRandomQuantity(),            // Random Quantity
    };
  });

  // Create a worksheet from the sample data
  const ws = XLSX.utils.json_to_sheet(sampleData);

  // Set custom column widths (if desired)
  const columnWidths = [
    { wch: 20 }, // Warehouse Name
    { wch: 15 }, // Item Code
    { wch: 30 }, // Item Name
    { wch: 20 }, // Item Category
    { wch: 40 }, // Item Image (if URLs are long)
    { wch: 10 }, // Quantity
  ];

  // Apply the column widths to the worksheet
  ws['!cols'] = columnWidths;

  // Create a workbook and append the worksheet
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sample Data");

  // Save the generated Excel file
  const excelFile = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  saveAs(new Blob([excelFile], { type: "application/octet-stream" }), "sample_inventory.xlsx");
};


  return (
    <div className="excel-upload-container">
      <input type="file" accept=".xlsx" onChange={handleFileUpload} />
      <button
        type="button"
        onClick={generateSampleExcel}
        className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md"
      >
        Download Sample Excel
      </button>
    </div>
  );
};

export default ExcelUpload;
