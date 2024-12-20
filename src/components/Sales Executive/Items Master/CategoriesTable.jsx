import React, { useState, useEffect } from "react";
import { HiOutlinePencil, HiOutlineTrash } from "react-icons/hi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EditModal from "./EditModal"; // Assuming EditModal is in the same folder
import { API_BASE_URL } from "../../../config";
import AddItemModal from "./AddItemModal";
const CategoriesTable = () => {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(50);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);

    try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_BASE_URL}/api/categories`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const data = await response.json();

        console.log("API Response:", data);

        if (Array.isArray(data)) { // Directly check if the response is an array
            setCategories(data); // Set categories directly
        } else {
            setError("Failed to fetch categories");
        }
    } catch (error) {
        setError("An error occurred while fetching categories");
    } finally {
        setLoading(false);
    }
};


  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to page 1 on new search
  };

  // Filtering the categories based on search term
  const filteredCategories = categories.filter((category) => {
    const normalizedSearchTerm = searchTerm.toLowerCase().trim();
  
    const categoryName = category.categoryName ? category.categoryName.toLowerCase() : "";
    const itemName = category.itemName ? category.itemName.toLowerCase() : "";
    const itemCode = category.itemCode ? category.itemCode.toLowerCase() : "";
    const unit = category.unit ? category.unit.toLowerCase() : "";
    const pcsPerCtn = category.pcsPerCtn ? category.pcsPerCtn.toString().toLowerCase() : "";
    const wtPerCtn = category.wtPerCtn ? category.wtPerCtn.toString().toLowerCase() : "";
    const cbmPerCtn = category.cbmPerCtn ? category.cbmPerCtn.toString().toLowerCase() : "";
  
    return (
      categoryName.includes(normalizedSearchTerm) ||
      itemName.includes(normalizedSearchTerm) ||
      itemCode.includes(normalizedSearchTerm) ||
      unit.includes(normalizedSearchTerm) ||
      pcsPerCtn.includes(normalizedSearchTerm) ||
      wtPerCtn.includes(normalizedSearchTerm) ||
      cbmPerCtn.includes(normalizedSearchTerm)
    );
  });
    // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCategories.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleEdit = (category) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };
  const handleAddItems = (items) => {
    
    setCategories((prevCategories) => [...prevCategories, ...items]);
  };

  const handleUpdateCategory = (updatedCategory) => {
    setCategories((prevCategories) =>
      prevCategories.map((category) =>
        category._id === updatedCategory._id ? updatedCategory : category
      )
    );
    setIsModalOpen(false); // Close the modal
  };

  const handleDelete = async (categoryId) => {
    if (!categoryId) {
      toast.error("Category ID is missing.");
      return;
    }
  
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/api/categories/${categoryId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.ok) {
        const data = await response.json();
        // Show success toast
        toast.success("Category deleted successfully!");
        
        // Remove the deleted category from the local state
        setCategories((prevCategories) =>
          prevCategories.filter((category) => category._id !== categoryId)
        );
      } else {
        const data = await response.json();
        toast.error(data.message || "Failed to delete category.");
      }
    } catch (error) {
      toast.error("An error occurred while deleting the category.");
    }
  };
  



  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCategory(null);
  };

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
      <div className="p-4">
        {/* Search Input */}
        <div className="mb-4">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search Categories..."
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="my-4">
        <button
          onClick={() => setIsAddItemModalOpen(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          + Add Item
        </button>
      </div>

        {loading ? (
          <div className="text-center py-4">
            <p>Loading categories...</p>
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
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Code</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Name</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qty/Ctn</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Wt/Ctn</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CBM/Ctn</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {currentItems.length > 0 ? (
                  currentItems.map((category) => (
                    <tr key={category._id} className="hover:bg-gray-50 border-b border-gray-200">
                      <td className="px-4 py-2 text-sm">{category.itemCode}</td>
                      <td className="px-4 py-2 text-sm">{category.categoryName}</td>
                      <td className="px-4 py-2 text-sm">{category.itemName}</td>
                      <td className="px-4 py-2 text-sm">{category.unit}</td>
                      <td className="px-4 py-2 text-sm">
  {category.itemImage ? (
    category.itemImage.includes("drive.google.com") ? (
      // If it's a Google Drive link, use the thumbnail link to display the image
      <img
        src={`https://drive.google.com/thumbnail?id=${category.itemImage.split('id=')[1]}`}
        alt="Item"
        className="w-10 h-10 object-cover rounded-full"
      />
    ) : (
      // If it's not a Google Drive link, use the URL as is
      <img
        src={category.itemImage}
        alt="Item"
        className="w-10 h-10 object-cover rounded-full"
      />
    )
  ) : (
    <span>No image available</span>
  )}
</td>



                      <td className="px-4 py-2 text-sm">{category.pcsPerCtn || "N/A"}</td>
                      <td className="px-4 py-2 text-sm">{category.wtPerCtn || "N/A"}</td>
                      <td className="px-4 py-2 text-sm">{category.cbmPerCtn || "N/A"}</td>
                      <td className="px-4 py-2 text-sm flex space-x-2">
                        <button
                          onClick={() => handleEdit(category)}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <HiOutlinePencil size={20} />
                        </button>
                        <button
                          onClick={() => handleDelete(category._id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <HiOutlineTrash size={20} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="px-6 py-4 text-center text-gray-500">No categories found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <div className="mt-4 flex flex-col sm:flex-row justify-between items-center">
          <div className="mb-4 sm:mb-0">
            <span className="text-sm text-gray-500">
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredCategories.length)} of {filteredCategories.length} categories
            </span>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-2 text-xs font-medium text-gray-500 bg-gray-200 rounded-md disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-2 text-xs font-medium text-gray-500 bg-gray-200 rounded-md disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
      <ToastContainer />
      {isAddItemModalOpen && (
        <AddItemModal
          onClose={() => setIsAddItemModalOpen(false)}
          onAddItems={handleAddItems}
        />
      )}
      {/* Modal */}
      {isModalOpen && (
        <EditModal
          category={selectedCategory}
          onClose={closeModal}
          onUpdate={handleUpdateCategory}
        />
      )}
    </div>
  );
};

export default CategoriesTable;
