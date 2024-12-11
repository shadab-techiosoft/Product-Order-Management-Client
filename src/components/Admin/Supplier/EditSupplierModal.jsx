import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../../config"; // Assuming this is already configured

const EditSupplierModal = ({ supplier, onClose, onSubmit }) => {
  const [supplierName, setSupplierName] = useState(supplier.supplierName || "");
  const [contactPersonName, setContactPersonName] = useState(supplier.contactPersonName || "");
  const [email, setEmail] = useState(supplier.email || "");
  const [address, setAddress] = useState(supplier.address || "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Pre-fill the form fields when the supplier data is loaded
    setSupplierName(supplier.supplierName);
    setContactPersonName(supplier.contactPersonName);
    setEmail(supplier.email);
    setAddress(supplier.address);
  }, [supplier]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${API_BASE_URL}/api/supplier/suppliers/${supplier._id}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          supplierName,
          contactPersonName,
          email,
          address,
        }),
      });

      if (response.ok) {
        toast.success("Supplier updated successfully!");
        onSubmit(); // Trigger refetch to update the supplier list
        onClose(); // Close the modal
      } else {
        toast.error("Failed to update supplier.");
      }
    } catch (error) {
      toast.error("An error occurred while updating the supplier.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
        <h2 className="text-xl font-semibold mb-4">Edit Supplier</h2>
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
              {loading ? "Updating..." : "Update Supplier"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditSupplierModal;
