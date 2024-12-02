import React, { useState, useEffect } from "react";
import { API_BASE_URL } from "../../../config";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; 

const EditClientModal = ({ client, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    firmName: client.firmName || "",
    contactPerson: client.contactPerson || "",
    mobileNo: client.mobileNo || "",
    email: client.email || "",
    waGroupId: client.waGroupId || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${API_BASE_URL}/api/clients/${client._id}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      toast.success("Client Updated");

      if (response.ok) {
        onSubmit(); // Re-fetch clients after the update
        onClose();  // Close the modal
      } else {
        toast.error("Failed to update client.");
      }
    } catch (error) {
      console.error("Error updating client:", error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-xl font-bold mb-4">Edit Client</h2>
        <form onSubmit={handleSubmit}>
          {/* Firm Name */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Firm Name</label>
            <input
              type="text"
              name="firmName"
              value={formData.firmName}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>

          {/* Contact Person */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Contact Person</label>
            <input
              type="text"
              name="contactPerson"
              value={formData.contactPerson}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>

          {/* Mobile Number */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Mobile Number</label>
            <input
              type="text"
              name="mobileNo"
              value={formData.mobileNo}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>

          {/* Whatsapp Group ID */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Whatsapp Group ID</label>
            <input
              type="text"
              name="waGroupId"
              value={formData.waGroupId}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>

          {/* Modal Actions */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 px-4 py-2 bg-gray-300 text-gray-700 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default EditClientModal;
