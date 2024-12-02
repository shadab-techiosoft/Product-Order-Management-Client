import React from "react";
import * as XLSX from "xlsx";

const ExcelUpload = ({ onDataLoaded }) => {
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const binaryStr = event.target.result;
      const workbook = XLSX.read(binaryStr, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(sheet, { header: 1 }); // Get data as a 2D array
      const formattedData = data.slice(1).map((row) => ({
        itemCode: row[0],
        categoryName: row[1],
        itemName: row[2],
        unit: row[3],
        pcsPerCtn: row[4],
        wtPerCtn: row[5],
        cbmPerCtn: row[6],
        itemImageLink: row[7],
      }));
      onDataLoaded(formattedData); 
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div className="flex flex-col mb-4">
      <label className="text-sm font-medium text-gray-700 mb-2">Upload Excel File</label>
      <input
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFileUpload}
        className="px-4 py-2 border border-gray-300 rounded"
      />
    </div>
  );
};

export default ExcelUpload;
