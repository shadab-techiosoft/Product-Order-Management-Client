import React, { useState, useEffect } from "react";
import { HiOutlineX } from "react-icons/hi";
import { toast } from "react-toastify";

const EditUserModal = ({ user, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobileNo: "",
    username: "",
    role: "sales executive", // default role
    accountStatus: "active", // default account status
  });

  useEffect(() => {
    if (user) {
      // Pre-populate form fields with current user data
      setFormData({
        name: user.name || "",
        email: user.email || "",
        mobileNo: user.mobileNo || "",
        username: user.username || "",
        role: user.role || "sales executive",
        accountStatus: user.accountStatus || "active",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const updatedUser = { ...formData };

    try {
      const response = await fetch(`http://localhost:5000/api/users/edit-user/${user._id}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedUser),
      });

      if (response.ok) {
        toast.success("User updated successfully!");
        onSubmit(); // Re-fetch users after the update
        onClose(); // Close the modal
      } else {
        toast.error("Failed to update user.");
      }
    } catch (error) {
      toast.error("An error occurred while updating the user.");
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Edit User</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-900">
            <HiOutlineX size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          {/* Mobile No */}
          <div className="mb-4">
            <label htmlFor="mobileNo" className="block text-sm font-medium text-gray-700">
              Mobile No
            </label>
            <input
              id="mobileNo"
              name="mobileNo"
              type="text"
              value={formData.mobileNo}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          {/* Username */}
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          {/* Role */}
          <div className="mb-4">
            <label htmlFor="role" className="block text-sm font-medium text-gray-700">
              Role
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="admin">Admin</option>
              <option value="sales executive">Sales Executive</option>
              <option value="finance">Finance</option>
              <option value="client">Client</option>
            </select>
          </div>

          {/* Account Status */}
          <div className="mb-4">
            <label htmlFor="accountStatus" className="block text-sm font-medium text-gray-700">
              Account Status
            </label>
            <select
              id="accountStatus"
              name="accountStatus"
              value={formData.accountStatus}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="active">Active</option>
              <option value="blacklisted">Blacklisted</option>
            </select>
          </div>

          <div className="flex justify-end mt-6">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;
