import React, { useState, useEffect } from "react";
import { HiOutlinePencil, HiOutlineTrash } from "react-icons/hi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EditUserModal from "./EditUserModal"; 
import AddUserModal from "./AddUserModal"; // New modal for adding a user
import { API_BASE_URL } from "../../config"; // Assuming this is already configured

const UsersTable = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(50);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal states for editing and adding users
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/users`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      const data = await response.json();
      console.log("Fetched data:", data);

      if (Array.isArray(data)) {
        setUsers(data); // Only set users if the response is an array
      } else {
        setError("Invalid response format. Expected an array.");
      }
    } catch (error) {
      setError("An error occurred while fetching users.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter users based on multiple fields
  const filteredUsers = users.filter((user) =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.mobileNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/api/users/delete-user/${userId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setUsers(users.filter((user) => user._id !== userId));
        toast.success("User deleted successfully!");
      } else {
        toast.error("Failed to delete user.");
      }
    } catch (error) {
      toast.error("An error occurred while deleting the user.");
    }
  };


 
  const handleAddUser = () => {
    setIsAddUserModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedUser(null);
  };

  const closeAddUserModal = () => {
    setIsAddUserModalOpen(false);
  };

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
      <div className="p-4">
        {/* Action section: Add User & Search */}
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={handleAddUser}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
          >
            Add User
          </button>

          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search Users..."
            className="p-2 border border-gray-300 rounded-md"
          />
        </div>

        {/* Loading/Error State */}
        {loading ? (
          <div className="text-center py-4">
            <p>Loading users...</p>
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
                    Name
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Username
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Account Status
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {/* Loop through the user data */}
                {currentItems.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50 border-b border-gray-200">
                    <td className="px-4 py-2 text-sm">{user.name}</td>
                    <td className="px-4 py-2 text-sm">{user.email}</td>
                    <td className="px-4 py-2 text-sm">{user.mobileNo}</td>
                    <td className="px-4 py-2 text-sm">{user.username}</td>
                    <td className="px-4 py-2 text-sm">{user.role}</td>
                    <td className="px-4 py-2 text-sm">{user.accountStatus}</td>
                    <td className="px-4 py-2 text-sm flex space-x-2">
                      {/* Edit Button */}
                      <button
                        onClick={() => handleEdit(user)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <HiOutlinePencil size={20} />
                      </button>
                      {/* Delete Button */}
                      <button
                        onClick={() => handleDelete(user._id)}
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
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, users.length)} of {users.length} users
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

      {/* Conditionally render the EditUserModal */}
      {isEditModalOpen && selectedUser && (
        <EditUserModal
          user={selectedUser}
          onClose={closeEditModal}
          onSubmit={fetchUsers} // Re-fetch users after update
        />
      )}

      {/* Conditionally render the AddUserModal */}
      {isAddUserModalOpen && (
        <AddUserModal onClose={closeAddUserModal} onSubmit={fetchUsers} />
      )}
    </div>
  );
};

export default UsersTable;
