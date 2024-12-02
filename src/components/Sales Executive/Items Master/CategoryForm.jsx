import React, { useState } from "react";
import axios from "axios";
import { FaPlus, FaTimes, FaSpinner } from "react-icons/fa";
import Modal from "./Modal"; // Import the modal component
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API_BASE_URL } from "../../../config";
import ExcelUpload from "./ExcelUpload"; // Assuming you have Excel upload logic

const CategoryForm = () => {
  const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility
  const [categories, setCategories] = useState([
    {
      itemCode: "",
      categoryName: "",
      itemName: "",
      unit: "",
      pcsPerCtn: "",
      wtPerCtn: "",
      cbmPerCtn: "",
      itemImage: null, // Temporarily store image as file
      itemImageLink: "", // Will store the image URL after uploading
    },
  ]);
  const [loading, setLoading] = useState(false);

  // Handle category form changes
  const handleCategoryChange = (e, index) => {
    const { name, value } = e.target;
    const newCategories = [...categories];
    newCategories[index][name] = value;
    setCategories(newCategories);
  };

  // Handle image changes
  const handleImageChange = (e, index) => {
    const file = e.target.files[0];
    const newCategories = [...categories];

    // Temporarily store the file object
    newCategories[index].itemImage = file;
    setCategories(newCategories);
  };

  // Add a new category
  const addCategory = () => {
    setCategories([
      ...categories,
      {
        itemCode: "",
        categoryName: "",
        itemName: "",
        unit: "",
        pcsPerCtn: "",
        wtPerCtn: "",
        cbmPerCtn: "",
        itemImage: null,
        itemImageLink: "", // URL will be updated after image upload
      },
    ]);
  };

  // Remove a category
  const removeCategory = (index) => {
    const newCategories = categories.filter((_, i) => i !== index);
    setCategories(newCategories);
  };

  // Close the modal
  const closeModal = () => {
    setIsModalOpen(false);
    setCategories([{
      itemCode: "",
      categoryName: "",
      itemName: "",
      unit: "",
      pcsPerCtn: "",
      wtPerCtn: "",
      cbmPerCtn: "",
      itemImage: null,
      itemImageLink: "",
    }]);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Check if any required field is missing
    for (const category of categories) {
      if (
        !category.itemCode ||
        !category.categoryName ||
        !category.itemName ||
        !category.unit ||
        !category.pcsPerCtn ||
        !category.wtPerCtn ||
        !category.cbmPerCtn
      ) {
        setLoading(false);
        toast.error("Please fill in all required fields.", {
          autoClose: 2000,
        });
        return;
      }
    }

    // Prepare form data for submission
    const formData = new FormData();

    // Upload images first and get image links
    const imageLinks = [];
    const uploadPromises = categories.map(async (category) => {
      if (category.itemImage) {
        const imageData = new FormData();
        imageData.append("file", category.itemImage);
        
        try {
          const uploadResponse = await axios.post(`${API_BASE_URL}/api/upload-image`, imageData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          imageLinks.push(uploadResponse.data.imageUrl); // Assuming the response has the image URL
        } catch (error) {
          toast.error("Error uploading image. Please try again.", { autoClose: 2000 });
          setLoading(false);
          return;
        }
      } else {
        imageLinks.push(""); // No image, use an empty string
      }
    });

    // Wait for all image uploads to complete
    await Promise.all(uploadPromises);

    // Add categories to formData (as a JSON string)
    const categoryData = categories.map((category, index) => ({
      itemCode: category.itemCode,
      categoryName: category.categoryName,
      itemName: category.itemName,
      unit: category.unit,
      pcsPerCtn: category.pcsPerCtn,
      wtPerCtn: category.wtPerCtn,
      cbmPerCtn: category.cbmPerCtn,
      itemImageLink: imageLinks[index], // Set the corresponding image link
    }));

    formData.append("items", JSON.stringify(categoryData));

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_BASE_URL}/api/categories/create`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setLoading(false);
      setIsModalOpen(false);
      toast.success("Categories added successfully!", {
        autoClose: 2000,
      });
      window.location.reload();
    } catch (error) {
      setLoading(false);
      toast.error("Error uploading categories. Please try again.", {
        autoClose: 2000,
      });
      console.error("Error uploading categories:", error);
    }
  };

  // Handle data parsed from the Excel file
  const handleExcelDataParse = (data) => {
    const newCategories = data.map((row) => ({
      itemCode: row["Item Code"] || "",
      categoryName: row["Category Name"] || "",
      itemName: row["Item Name"] || "",
      unit: row["Unit"] || "",
      pcsPerCtn: row["PcsPerCtn"] || "",
      wtPerCtn: row["WtPerCtn"] || "",
      cbmPerCtn: row["CbmPerCtn"] || "",
      itemImage: null, // Images cannot be populated from Excel
      itemImageLink: "", // Will be updated after image upload
    }));

    setCategories(newCategories);
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-700"
      >
        Add Item
      </button>

      <Modal isOpen={isModalOpen} closeModal={closeModal}>
        <form onSubmit={handleSubmit}>
          <h2 className="text-xl font-semibold mb-4 text-center">Create Item</h2>
          <ExcelUpload onExcelDataParse={handleExcelDataParse} />

          <div className="max-h-[50vh] sm:max-h-96 overflow-y-auto">
            {categories.map((category, index) => (
              <div key={index} className="space-y-6 mb-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6">
                  {/* Item Code */}
                  <div>
                    <label className="block font-medium">Item Code</label>
                    <input
                      disabled={loading}
                      type="text"
                      name="itemCode"
                      value={category.itemCode}
                      onChange={(e) => handleCategoryChange(e, index)}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                      required
                    />
                  </div>

                  {/* Category Name */}
                  <div>
                    <label className="block font-medium">Category Name</label>
                    <input
                      disabled={loading}
                      type="text"
                      name="categoryName"
                      value={category.categoryName}
                      onChange={(e) => handleCategoryChange(e, index)}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                      required
                    />
                  </div>

                  {/* Item Name */}
                  <div>
                    <label className="block font-medium">Item Name</label>
                    <input
                      disabled={loading}
                      type="text"
                      name="itemName"
                      value={category.itemName}
                      onChange={(e) => handleCategoryChange(e, index)}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                      required
                    />
                  </div>

                  {/* Unit */}
                  <div>
                    <label className="block font-medium">Unit</label>
                    <input
                      disabled={loading}
                      type="text"
                      name="unit"
                      value={category.unit}
                      onChange={(e) => handleCategoryChange(e, index)}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                  </div>

                  {/* PcsPerCtn */}
                  <div>
                    <label className="block font-medium">PcsPerCtn</label>
                    <input
                      disabled={loading}
                      type="text"
                      name="pcsPerCtn"
                      value={category.pcsPerCtn}
                      onChange={(e) => handleCategoryChange(e, index)}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                  </div>

                  {/* WtPerCtn */}
                  <div>
                    <label className="block font-medium">WtPerCtn</label>
                    <input
                      disabled={loading}
                      type="text"
                      name="wtPerCtn"
                      value={category.wtPerCtn}
                      onChange={(e) => handleCategoryChange(e, index)}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                  </div>

                  {/* CbmPerCtn */}
                  <div>
                    <label className="block font-medium">CbmPerCtn</label>
                    <input
                      disabled={loading}
                      type="text"
                      name="cbmPerCtn"
                      value={category.cbmPerCtn}
                      onChange={(e) => handleCategoryChange(e, index)}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>

                {/* Item Image Upload */}
                <div>
                  <label className="block font-medium">Item Image</label>
                  <input
                    type="file"
                    onChange={(e) => handleImageChange(e, index)}
                    disabled={loading}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                  {category.itemImage && (
                    <div className="mt-2">
                      <img
                        src={URL.createObjectURL(category.itemImage)}
                        alt="Item Preview"
                        className="w-32 h-32 object-cover rounded-lg"
                      />
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center">
                  <button
                    type="button"
                    onClick={() => removeCategory(index)}
                    className="text-red-500 hover:text-red-700"
                    disabled={loading}
                  >
                    <FaTimes className="text-lg" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={addCategory}
              className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-700"
              disabled={loading}
            >
              <FaPlus className="mr-2" />
              Add Another Item
            </button>

            <button
              type="submit"
              className={`bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-700 ${
                loading ? "cursor-not-allowed opacity-50" : ""
              }`}
              disabled={loading}
            >
              {loading ? <FaSpinner className="animate-spin" /> : "Submit"}
            </button>
          </div>
        </form>
      </Modal>

      <ToastContainer />
    </>
  );
};

export default CategoryForm;
