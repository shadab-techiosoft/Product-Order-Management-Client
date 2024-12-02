import React, { useState, useEffect } from "react";
import { HiOutlinePencil, HiOutlineTrash } from "react-icons/hi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EditClientModal from "./EditClientModal"; // Assuming EditModal is in the same folder
import AddClientModal from "./AddClientModal"; // New modal to add a client
import { API_BASE_URL } from "../../../config";

const ClientsTable = () => {
  const [clients, setClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(50);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for controlling modal visibility
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddClientModalOpen, setIsAddClientModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${API_BASE_URL}/api/clients`, {
        headers: {
          "Authorization": `Bearer ${token}`,  // Replace with your auth token
        },
      });
      const data = await response.json();
      console.log("Fetched data:", data);

      if (Array.isArray(data)) {
        setClients(data); // Only set clients if the response is an array
      } else {
        setError("Invalid response format. Expected an array.");
      }
    } catch (error) {
      setError("An error occurred while fetching clients");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Modified filteredClients to check multiple fields
  const filteredClients = clients.filter((client) =>
    (client.firmName?.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (client.contactPerson?.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (client.email?.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (client.mobileNo?.toLowerCase().includes(searchTerm.toLowerCase())) // Ensure address is not undefined
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredClients.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleEdit = (client) => {
    setSelectedClient(client);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (clientId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/api/clients/${clientId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setClients(clients.filter((client) => client._id !== clientId));
        toast.success("Client deleted successfully!");
      } else {
        toast.error("Failed to delete client.");
      }
    } catch (error) {
      toast.error("An error occurred while deleting the client.");
    }
  };

  const handleAddClient = () => {
    setIsAddClientModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedClient(null);
  };

  const closeAddClientModal = () => {
    setIsAddClientModalOpen(false);
  };

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
      <div className="p-4">
        {/* Action section: Add Client & Search */}
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={handleAddClient}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
          >
            Add Client
          </button>
  
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search Clients..."
            className="p-2 border border-gray-300 rounded-md"
          />
        </div>
  
        {/* Loading/Error State */}
        {loading ? (
          <div className="text-center py-4">
            <p>Loading clients...</p>
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
                    Firm Name
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact Person
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    UserName
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Password
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {/* Loop through the client data and exclude clients marked as deleted */}
                {currentItems
                  .filter((client) => !client.isDeleted)  // Filter out clients with isDeleted: true
                  .map((client) => (
                    <tr key={client._id} className="hover:bg-gray-50 border-b border-gray-200">
                      <td className="px-4 py-2 text-sm">{client.firmName}</td>
                      <td className="px-4 py-2 text-sm">{client.contactPerson}</td>
                      <td className="px-4 py-2 text-sm">{client.email}</td>
                      <td className="px-4 py-2 text-sm">{client.mobileNo}</td>
                      <td className="px-4 py-2 text-sm">{client.username}</td>
                      <td className="px-4 py-2 text-sm">{client.password}</td>
                      <td className="px-4 py-2 text-sm flex space-x-2">
                        {/* Edit Button */}
                        <button
                          onClick={() => handleEdit(client)}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <HiOutlinePencil size={20} />
                        </button>
                        {/* Delete Button */}
                        <button
                          onClick={() => handleDelete(client._id)}
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
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, clients.length)} of {clients.length} clients
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
  
      {/* Conditionally render the EditModal */}
      {isEditModalOpen && selectedClient && (
        <EditClientModal
          client={selectedClient}
          onClose={closeEditModal}
          onSubmit={fetchClients} // Re-fetch clients after update
        />
      )}
  
      {/* Conditionally render the AddClientModal */}
      {isAddClientModalOpen && (
        <AddClientModal
          onClose={closeAddClientModal}
          onSubmit={fetchClients} // Re-fetch clients after adding a new client
        />
      )}
    </div>
  );
  
  
};

export default ClientsTable;
