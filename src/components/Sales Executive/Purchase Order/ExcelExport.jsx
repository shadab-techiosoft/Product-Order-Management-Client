// import React from 'react';
// import * as XLSX from 'xlsx';
// import * as XlsxPopulate from 'xlsx-populate/browser/xlsx-populate'; // For advanced styling
// import { HiOutlinePencil, HiOutlineTrash ,HiDownload} from "react-icons/hi";
// const ExcelExport = ({ purchaseOrderData }) => {
//   // Function to create and download Excel file
//   const exportToExcel = () => {
//     const { referenceNo, toPerson, items,createdBy } = purchaseOrderData;

//     // Prepare the data to be written to Excel
//     const worksheetData = [
//       ['Purchase Order Reference No', referenceNo],
//       ['To Person', toPerson],
//       ['Created By', createdBy.name],
//       [],
//       ['Item Category', 'Item Description', 'Item Code', 'Unit', 'Item Image', 'QTY/CTN', 'WT/CTN', 'CBM/CTN', 'Order Container'],
//       ...items.map((item) => [
//         item.Category,
//         item.itemDescription,
//         item.itemCode,
//         item.unit,
//         item.itemImage,
//         item.Qtyctn,
//         item.Wtctn,
//         item.Cbmctn,
//         item.orderContainer,
//       ]),
//     ];

//     const finalData = worksheetData;

//     // Create the workbook
//     const wb = XLSX.utils.book_new();
//     const sheet = XLSX.utils.aoa_to_sheet(finalData);
//     XLSX.utils.book_append_sheet(wb, sheet, 'PurchaseOrder');

//     // Convert workbook to blob
//     const workbookBlob = workbook2blob(wb);

//     // Add styling and export
//     addStyle(workbookBlob).then((url) => {
//       const downloadAnchorNode = document.createElement("a");
//       downloadAnchorNode.setAttribute("href", url);
//       downloadAnchorNode.setAttribute("download", "Purchase_Order.xlsx");
//       downloadAnchorNode.click();
//       downloadAnchorNode.remove();
//     });
//   };

//   // Convert workbook to Blob
//   const workbook2blob = (workbook) => {
//     const wopts = { bookType: "xlsx", bookSST: false, type: "binary" };
//     const wbout = XLSX.write(workbook, wopts);
//     const blob = new Blob([s2ab(wbout)], { type: "application/octet-stream" });
//     return blob;
//   };

//   // Convert string to ArrayBuffer
//   const s2ab = (s) => {
//     const buf = new ArrayBuffer(s.length);
//     const view = new Uint8Array(buf);
//     for (let i = 0; i !== s.length; ++i) {
//       view[i] = s.charCodeAt(i);
//     }
//     return buf;
//   };

//   // Add styles using XlsxPopulate
//   const addStyle = (workbookBlob) => {
//     return XlsxPopulate.fromDataAsync(workbookBlob).then((workbook) => {
//       const sheet = workbook.sheet(0);
//       sheet.usedRange().style({
//         fontFamily: "Arial",
//         verticalAlignment: "center",
//       });

//       // Set column widths
//       sheet.column("A").width(35);
//       sheet.column("B").width(30);
//       sheet.column("C").width(15);
//       sheet.column("D").width(10);
//       sheet.column("E").width(20);
//       sheet.column("F").width(15);
//       sheet.column("G").width(15);
//       sheet.column("H").width(15);
//       sheet.column("I").width(15);

//       // Apply header styles
//       sheet.range("A5:I5").style({
//         bold: true,
//         horizontalAlignment: "center",
//         verticalAlignment: "center",
//         fill: "4F81BD", // Blue background
//         fontColor: "FFFFFF", // White text color
//       });

//       // Return the workbook as a URL for download
//       return workbook.outputAsync().then((workbookBlob) => URL.createObjectURL(workbookBlob));
//     });
//   };

//   return (
//     <HiDownload
//     size={24}
//     className="cursor-pointer text-blue-500 hover:text-blue-700"
//     onClick={exportToExcel} // Trigger the export function on icon click
//   />
//   );
// };

// export default ExcelExport;


import React from 'react';
import ExcelJS from 'exceljs'; // Use ExcelJS for images and advanced formatting
import { HiOutlinePencil, HiOutlineTrash ,HiDownload} from "react-icons/hi";

// Convert image URL to base64
const toDataURL = (url) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      const reader = new FileReader();
      reader.readAsDataURL(xhr.response);
      reader.onloadend = function () {
        resolve(reader.result);
      };
    };
    xhr.open("GET", url);
    xhr.responseType = "blob";
    xhr.send();
  });
};

const ExcelExport = ({ purchaseOrderData }) => {
  const exportToExcel = async () => {
    const { referenceNo, toPerson, items, createdBy } = purchaseOrderData;

    // Create a new Excel workbook
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('PurchaseOrder');

    // Add title and headers
    sheet.getCell('A1').value = 'Purchase Order Reference No';
    sheet.getCell('B1').value = referenceNo;
    sheet.getCell('A2').value = 'To Person';
    sheet.getCell('B2').value = toPerson;
    sheet.getCell('A3').value = 'From';
    sheet.getCell('B3').value = createdBy.name;

    sheet.addRow([]);
    sheet.addRow(['Item Category', 'Item Description', 'Item Code', 'Unit', 'Item Image', 'QTY/CTN', 'WT/CTN', 'CBM/CTN', 'Order Container']);

    // Set default row height and column widths
    sheet.properties.defaultRowHeight = 30;
    sheet.columns = [
      { width: 20 },
      { width: 30 },
      { width: 15 },
      { width: 10 },
      { width: 20 },
      { width: 15 },
      { width: 15 },
      { width: 15 },
      { width: 15 },
    ];

    // Add data rows
    const imagePromises = items.map(async (item, index) => {
      const rowNumber = index + 5; // Row index starts from 4 (since the headers are in the first 3 rows)
      sheet.addRow([
        item.Category,
        item.itemDescription,
        item.itemCode,
        item.unit,
        '', // We'll leave this blank for the image cell
        item.Qtyctn,
        item.Wtctn,
        item.Cbmctn,
        item.orderContainer,
      ]);

      if (item.itemImage) {
        const base64Image = await toDataURL(item.itemImage);
        const extension = item.itemImage.split(".").pop(); // Get image extension (jpg, png, etc.)

        // Add the image to the workbook
        const imageId = workbook.addImage({
          base64: base64Image,
          extension: extension,
        });

        // Insert the image into the Excel sheet, positioning it in the 'Item Image' column
        sheet.addImage(imageId, {
          tl: { col: 4, row: rowNumber }, // Top-left corner (column E, row corresponding to the item)
          ext: { width: 100, height: 50 }, // Image size
        });

        // Adjust the row height to match the image height
        const imageHeight = 50; // Adjust this as necessary for your image's height
        sheet.getRow(rowNumber).height = imageHeight + 10; // Add some padding to the row height
      }
    });

    await Promise.all(imagePromises);

    // Apply styles
    sheet.getRow(1).font = { bold: true, size: 12 };
    sheet.getRow(2).font = { bold: true, size: 12 };
    sheet.getRow(3).font = { bold: true, size: 12 };
    sheet.getRow(5).font = { bold: true, size: 12 };
    
    sheet.getRow(5).alignment = { horizontal: 'center', vertical: 'center' }; // Center alignment
    sheet.getRow(5).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '4F81BD' }, // Blue background
    };
    sheet.getRow(5).font.color = { argb: 'FFFFFF' }; // White text color

    // Generate the Excel file as a buffer and trigger download
    workbook.xlsx.writeBuffer().then(function (data) {
      const blob = new Blob([data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "Purchase_Order.xlsx";
      anchor.click();
      window.URL.revokeObjectURL(url);
    });
  };

  return (
    <HiDownload
      size={24}
      className="cursor-pointer text-blue-500 hover:text-blue-700"
      onClick={exportToExcel} // Trigger the export function on icon click
    />
  );
};

export default ExcelExport;