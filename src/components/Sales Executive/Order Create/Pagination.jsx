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

  const renderPageNumbers = () => {
    const pageNumbers = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pageNumbers.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pageNumbers.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pageNumbers;
  };

  return (
    <div className="flex justify-end items-center gap-2 mt-4">
      {/* Previous Button */}
      <button
        className={`px-4 py-2 border rounded-lg ${
          currentPage === 1
            ? 'text-gray-400 cursor-not-allowed'
            : 'text-indigo-500 hover:bg-indigo-400 hover:text-white'
        }`}
        onClick={handlePrevious}
        disabled={currentPage === 1}
      >
        Previous
      </button>

      {/* Page Numbers */}
      <div className="flex gap-2">
        {renderPageNumbers().map((page, index) => (
          <button
            key={index}
            className={`px-4 py-2 border rounded-lg ${
              page === currentPage
                ? 'bg-indigo-500 text-white'
                : 'text-indigo-500 hover:bg-indigo-400 hover:text-white'
            } ${page === '...' && 'cursor-default'}`}
            onClick={() => page !== '...' && setCurrentPage(page)}
            disabled={page === '...'}
          >
            {page}
          </button>
        ))}
      </div>

      {/* Next Button */}
      <button
        className={`px-4 py-2 border rounded-lg ${
          currentPage === totalPages
            ? 'text-gray-400 cursor-not-allowed'
            : 'text-indigo-500 hover:bg-indigo-400 hover:text-white'
        }`}
        onClick={handleNext}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
