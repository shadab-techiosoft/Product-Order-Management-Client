import React from 'react';

const Pagination = ({ currentPage, totalPages, setCurrentPage }) => {
  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="flex justify-between items-center mt-4">
      <button
        className="px-4 py-2 bg-gray-200 rounded disabled:bg-gray-300"
        onClick={handlePrevious}
        disabled={currentPage === 1}
      >
        Previous
      </button>
      <span>
        Page {currentPage} of {totalPages}
      </span>
      <button
        className="px-4 py-2 bg-gray-200 rounded disabled:bg-gray-300"
        onClick={handleNext}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
