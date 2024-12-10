import React from 'react';
import * as XLSX from 'xlsx';

const ExcelExport = ({ purchaseOrderData }) => {
  // Function to create and download Excel file
  const exportToExcel = () => {
    const { referenceNo, toPerson, items } = purchaseOrderData;

    // Prepare the data to be written to Excel
    const worksheetData = [
      ['Purchase Order Reference No', referenceNo],
      ['To Person', toPerson],
      [],
      ['Item Category', 'Item Description', 'Item Code', 'Unit', 'Item Image', 'QTY/CTN', 'WT/CTN', 'CBM/CTN', 'Order Container'],
      ...items.map((item) => [
        item.Category,
        item.itemDescription,
        item.itemCode,
        item.unit,
        item.itemImage,
        item.Qtyctn,
        item.Wtctn,
        item.Cbmctn,
        item.orderContainer,
      ]),
    ];

    // Create a worksheet
    const ws = XLSX.utils.aoa_to_sheet(worksheetData);

    // Apply styling to headers
    const headerStyle = {
      font: { bold: true, color: { rgb: 'FFFFFF' } },
      fill: { fgColor: { rgb: '4F81BD' } },
      alignment: { horizontal: 'center', vertical: 'center' },
      border: {
        top: { style: 'thin', color: { rgb: '000000' } },
        left: { style: 'thin', color: { rgb: '000000' } },
        bottom: { style: 'thin', color: { rgb: '000000' } },
        right: { style: 'thin', color: { rgb: '000000' } }
      }
    };

    // Apply styling to all header cells
    const range = XLSX.utils.decode_range(ws['!ref']); // Get the range of the data
    for (let col = range.s.c; col <= range.e.c; col++) {
      const headerCell = ws[XLSX.utils.encode_cell({ r: 3, c: col })]; // Row 3 is where the header starts
      if (headerCell) {
        headerCell.s = headerStyle;
      }
    }

    // Set column widths for better readability
    const colWidths = [
      { wch: 25 }, // Item Category
      { wch: 30 }, // Item Description
      { wch: 15 }, // Item Code
      { wch: 10 }, // Unit
      { wch: 20 }, // Item Image
      { wch: 15 }, // QTY/CTN
      { wch: 15 }, // WT/CTN
      { wch: 15 }, // CBM/CTN
      { wch: 15 }, // Order Container
    ];

    // Set the column widths
    ws['!cols'] = colWidths;

    // Create a workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'PurchaseOrder');

    // Write to file and trigger download
    XLSX.writeFile(wb, 'Purchase_Order.xlsx');
  };

  return (
    <button
      type="button"
      onClick={exportToExcel}
      className="px-6 py-2 bg-green-600 text-white rounded-lg"
    >
      Download Purchase Order as Excel
    </button>
  );
};

export default ExcelExport;
