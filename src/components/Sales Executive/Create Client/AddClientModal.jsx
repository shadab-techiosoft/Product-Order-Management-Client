import React, { useState } from "react";
import { API_BASE_URL } from "../../../config";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as XLSX from "xlsx"; // Import the xlsx library

const AddClientModal = ({ onClose, onSubmit }) => {
  const [clientDetails, setClientDetails] = useState({
    firmName: "",
    contactPerson: "",
    mobileNo: "",
    waGroupId: "",
    email: "",
  });

  const [excelFile, setExcelFile] = useState(null); // State for uploaded file
  const [loading, setLoading] = useState(false); // Loading state for the file upload process
  const [uploadStatus, setUploadStatus] = useState({
    total: 0,
    success: 0,
    failure: 0,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setClientDetails({
      ...clientDetails,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setExcelFile(file);
    }
  };

  const handleExcelUpload = () => {
    if (!excelFile) {
      toast.error("Please select an Excel file to upload.");
      return;
    }

    setLoading(true); // Start loading

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });

      // Assume the data is in the first sheet
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      if (jsonData.length > 0) {
        // Initialize upload status
        setUploadStatus({
          total: jsonData.length,
          success: 0,
          failure: 0,
        });

        const uploadPromises = jsonData.map((client) => {
          return fetch(`${API_BASE_URL}/api/clients`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(client),
          }).then((response) => {
            if (response.ok) {
              setUploadStatus((prevStatus) => ({
                ...prevStatus,
                success: prevStatus.success + 1,
              }));
            } else {
              setUploadStatus((prevStatus) => ({
                ...prevStatus,
                failure: prevStatus.failure + 1,
              }));
            }
          });
        });

        // Wait for all promises to resolve
        Promise.all(uploadPromises)
          .then(() => {
            // Show appropriate toast and close modal after all clients are processed
            if (uploadStatus.success === jsonData.length) {
              toast.success("All Clients Added Successfully!");
              onSubmit(); // Trigger the parent onSubmit callback
            } else {
              toast.error(`${uploadStatus.failure} clients failed to upload.`);
            }
          })
          .catch(() => {
            toast.error("An error occurred while uploading clients.");
          })
          .finally(() => {
            setLoading(false); // Stop loading once the process is complete
            onClose(); // Close the modal after all clients are processed
          });
      } else {
        setLoading(false);
        toast.error("No valid data found in the uploaded Excel file.");
      }
    };
    reader.readAsArrayBuffer(excelFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${API_BASE_URL}/api/clients`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(clientDetails),
      });

      if (response.ok) {
        onSubmit();
        onClose();
        toast.success("Client Added successfully!");
      } else {
        toast.error("Failed to Add Client.");
      }
    } catch (error) {
      console.error("Error adding client:", error);
    }
  };

  const handleDownloadSample = () => {
    const sampleData = [
      {
        firmName: "Sample Travel",
        contactPerson: "John Doe",
        mobileNo: "9876543210",
        waGroupId: "1234567890",
        email: "john.doe@example.com",
      },
      {
        firmName: "Sample Tours",
        contactPerson: "Jane Smith",
        mobileNo: "1234567890",
        waGroupId: "0987654321",
        email: "jane.smith@example.com",
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(sampleData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sample Clients");

    // Generate file and trigger download
    XLSX.writeFile(workbook, "Sample_Clients.xlsx");
  };

  return (
    <div className="fixed inset-0 z-50 bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-xl font-bold mb-4">Add New Client</h2>
        <form onSubmit={handleSubmit}>
          {/* Client Details Form */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Firm Name
            </label>
            <input
              type="text"
              name="firmName"
              value={clientDetails.firmName}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Contact Person
            </label>
            <input
              type="text"
              name="contactPerson"
              value={clientDetails.contactPerson}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Mobile Number
            </label>
            <input
              type="text"
              name="mobileNo"
              value={clientDetails.mobileNo}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              WhatsApp Group ID
            </label>
            <input
              type="text"
              name="waGroupId"
              value={clientDetails.waGroupId}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="text"
              name="email"
              value={clientDetails.email}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>

          {/* Action Buttons - Cancel and Submit */}
          <div className="flex justify-end space-x-4 mt-4">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Add Client
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-red-500 text-gray-700 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>

          {/* Excel File Upload and Sample Download in Same Row */}
          <div className="mb-6">
            {/* Heading for Excel Upload Section */}
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Upload Clients from Excel
            </h3>

            {/* Excel File Upload, Upload Button, and Sample Download Button in One Row */}
            <div className="flex mb-4 space-x-4 items-center">
              {/* Excel File Upload */}
              <div className="w-1/3">
                <input
                  type="file"
                  accept=".xlsx, .xls"
                  onChange={handleFileChange}
                  className="w-full px-4 py-2 border rounded-md"
                />
              </div>

              {/* Upload Clients from Excel Button */}
              <div className="w-1/3">
                <button
                  type="button"
                  onClick={handleExcelUpload}
                  className="w-full px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                  disabled={loading}
                >
                  {loading ? "Uploading..." : "Upload Clients"}
                </button>
              </div>

              {/* Download Sample Button */}
              <div className="w-1/3">
                <button
                  type="button"
                  onClick={handleDownloadSample}
                  className="w-full px-4 py-2 bg-yellow-500 text-white rounded-md"
                >
                  Sample Data
                </button>
              </div>
            </div>
          </div>

          {/* Modal Actions */}
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AddClientModal;
