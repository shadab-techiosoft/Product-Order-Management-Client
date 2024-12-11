import React, { useState } from "react";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../../config";

const AddSupplierModal = ({ onClose, onSubmit }) => {
  const [supplierName, setSupplierName] = useState("");
  const [contactPersonName, setContactPersonName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${API_BASE_URL}/api/supplier/suppliers`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          suppliers: [
            {
              supplierName,
              contactPersonName,
              email,
              address,
            },
          ],
        }),
      });
  
      if (response.ok) {
        toast.success("Supplier added successfully!");
        onSubmit(); // Trigger refetch to update the list
        onClose(); // Close the modal
      } else {
        toast.error("Failed to add supplier.");
      }
    } catch (error) {
      toast.error("An error occurred while adding the supplier.");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
        <h2 className="text-xl font-semibold mb-4">Add New Supplier</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="supplierName" className="block text-sm font-medium text-gray-700">
              Supplier Name
            </label>
            <input
              type="text"
              id="supplierName"
              value={supplierName}
              onChange={(e) => setSupplierName(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="contactPersonName" className="block text-sm font-medium text-gray-700">
              Contact Person Name
            </label>
            <input
              type="text"
              id="contactPersonName"
              value={contactPersonName}
              onChange={(e) => setContactPersonName(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
              Address
            </label>
            <input
              type="text"
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
            >
              {loading ? "Adding..." : "Add Supplier"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSupplierModal;
