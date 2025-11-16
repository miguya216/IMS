import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const maxMiddlePages = 3; // maximum pages to show in the middle
  const paginationItems = [];

  // Previous button
  if (currentPage > 1) {
    paginationItems.push(
      <li key="prev" className="page-item">
        <button
          className="page-link"
          onClick={() => onPageChange(currentPage - 1)}
          title="Go to previous page"
        >
          Previous
        </button>
      </li>
    );
  }

  // Always show first page
  paginationItems.push(
    <li key={1} className={`page-item ${currentPage === 1 ? "active" : ""}`}>
      <button className="page-link" onClick={() => onPageChange(1)} title="Go to page 1">
        1
      </button>
    </li>
  );

  // Determine middle pages
  let startPage = Math.max(2, totalPages - maxMiddlePages - 1); // default near end
  let endPage = Math.min(totalPages - 1, totalPages - 1); // last before last page

  if (currentPage < totalPages - maxMiddlePages) {
    startPage = Math.max(2, currentPage - 1);
    endPage = Math.min(totalPages - 1, startPage + maxMiddlePages - 1);
  }

  // Left ellipsis
  if (startPage > 2) {
    paginationItems.push(
      <li key="left-ellipsis" className="page-item disabled">
        <span className="page-link" title="More pages before">...</span>
      </li>
    );
  }

  // Middle pages
  for (let i = startPage; i <= endPage; i++) {
    paginationItems.push(
      <li key={i} className={`page-item ${currentPage === i ? "active" : ""}`}>
        <button className="page-link" onClick={() => onPageChange(i)} title={`Go to page ${i}`}>
          {i}
        </button>
      </li>
    );
  }

  // Right ellipsis
  if (endPage < totalPages - 1) {
    paginationItems.push(
      <li key="right-ellipsis" className="page-item disabled">
        <span className="page-link" title="More pages after">...</span>
      </li>
    );
  }

  // Always show last page
  if (totalPages > 1) {
    paginationItems.push(
      <li key={totalPages} className={`page-item ${currentPage === totalPages ? "active" : ""}`}>
        <button className="page-link" onClick={() => onPageChange(totalPages)} title={`Go to page ${totalPages}`}>
          {totalPages}
        </button>
      </li>
    );
  }

  // Next button
  if (currentPage < totalPages) {
    paginationItems.push(
      <li key="next" className="page-item">
        <button className="page-link" onClick={() => onPageChange(currentPage + 1)} title="Go to next page">
          Next
        </button>
      </li>
    );
  }

  return (
    <nav className="mt-3">
      <ul className="pagination justify-content-center">{paginationItems}</ul>
    </nav>
  );
};

export default Pagination;
