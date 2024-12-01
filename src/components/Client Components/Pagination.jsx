import React from 'react';

const Pagination = () => {
  return (
    <div className="flex justify-between items-center mt-4">
      <button className="px-4 py-2 bg-gray-200 rounded">Previous</button>
      <span>Page 1 of 5</span>
      <button className="px-4 py-2 bg-gray-200 rounded">Next</button>
    </div>
  );
};

export default Pagination;
