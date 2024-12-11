import React, { useState, useEffect } from "react";
import { HiOutlinePencil, HiOutlineTrash } from "react-icons/hi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EditSupplierModal from "./EditSupplierModal";  // Create this modal
import AddSupplierModal from "./AddSupplierModal";    // Create this modal
import { API_BASE_URL } from "../../../config"; // Assuming this is already configured

const SuppliersTable = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(50);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal states for editing and adding suppliers
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddSupplierModalOpen, setIsAddSupplierModalOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${API_BASE_URL}/api/supplier/suppliers`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      const data = await response.json();
      console.log("Fetched data:", data);

      if (data.suppliers && Array.isArray(data.suppliers)) {
        setSuppliers(data.suppliers); // Only set suppliers if the response is valid
      } else {
        setError("Invalid response format. Expected an array of suppliers.");
      }
    } catch (error) {
      setError("An error occurred while fetching suppliers.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter suppliers based on multiple fields
  const filteredSuppliers = suppliers.filter((supplier) =>
    supplier.supplierName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.contactPersonName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.address?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredSuppliers.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredSuppliers.length / itemsPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleEdit = (supplier) => {
    setSelectedSupplier(supplier);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (supplierId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/api/supplier/suppliers/${supplierId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setSuppliers(suppliers.filter((supplier) => supplier._id !== supplierId));
        toast.success("Supplier deleted successfully!");
      } else {
        toast.error("Failed to delete supplier.");
      }
    } catch (error) {
      toast.error("An error occurred while deleting the supplier.");
    }
  };

  const handleAddSupplier = () => {
    setIsAddSupplierModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedSupplier(null);
  };

  const closeAddSupplierModal = () => {
    setIsAddSupplierModalOpen(false);
  };

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
      <div className="p-4">
        {/* Action section: Add Supplier & Search */}
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={handleAddSupplier}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
          >
            Add Supplier
          </button>

          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search Suppliers..."
            className="p-2 border border-gray-300 rounded-md"
          />
        </div>

        {/* Loading/Error State */}
        {loading ? (
          <div className="text-center py-4">
            <p>Loading suppliers...</p>
          </div>
        ) : error ? (
          <div className="text-center py-4 text-red-500">
            <p>{error}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            {/* Table */}
            <table className="min-w-full table-auto">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Supplier Name
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact Person
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Address
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {/* Loop through the supplier data */}
                {currentItems.map((supplier) => (
                  <tr key={supplier._id} className="hover:bg-gray-50 border-b border-gray-200">
                    <td className="px-4 py-2 text-sm">{supplier.supplierName}</td>
                    <td className="px-4 py-2 text-sm">{supplier.contactPersonName}</td>
                    <td className="px-4 py-2 text-sm">{supplier.email}</td>
                    <td className="px-4 py-2 text-sm">{supplier.address}</td>
                    <td className="px-4 py-2 text-sm flex space-x-2">
                      {/* Edit Button */}
                      <button
                        onClick={() => handleEdit(supplier)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <HiOutlinePencil size={20} />
                      </button>
                      {/* Delete Button */}
                      <button
                        onClick={() => handleDelete(supplier._id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <HiOutlineTrash size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <div className="mt-4 flex justify-between items-center">
          <div>
            <span className="text-sm text-gray-500">
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, suppliers.length)} of {suppliers.length} suppliers
            </span>
          </div>

          <div className="flex space-x-2">
            {/* Previous Page Button */}
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-gray-200 text-gray-600 rounded-lg disabled:bg-gray-400"
            >
              Prev
            </button>
            {/* Next Page Button */}
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-gray-200 text-gray-600 rounded-lg disabled:bg-gray-400"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Toast Container for displaying toast messages */}
      <ToastContainer />

      {/* Conditionally render the EditSupplierModal */}
      {isEditModalOpen && selectedSupplier && (
        <EditSupplierModal
          supplier={selectedSupplier}
          onClose={closeEditModal}
          onSubmit={fetchSuppliers} // Re-fetch suppliers after update
        />
      )}

      {/* Conditionally render the AddSupplierModal */}
      {isAddSupplierModalOpen && (
        <AddSupplierModal onClose={closeAddSupplierModal} onSubmit={fetchSuppliers} />
      )}
    </div>
  );
};

export default SuppliersTable;
