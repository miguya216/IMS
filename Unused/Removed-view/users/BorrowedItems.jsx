import React, { useState, useEffect } from "react";
import TableControls from "/src/components/TableControls";
import Pagination from "/src/components/Pagination";

const BorrowedItems = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [borrowedItems, setBorrowedItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const fetchBorrowedItems = () => {
    setLoading(true);
    fetch("/api/fetch_data.php?action=borroweditems")
      .then((res) => res.json())
      .then((data) => {
        setBorrowedItems(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch borrowed items", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchBorrowedItems();

    // Allow reload trigger from outside
    window.reloadBorrowedTable = () => {
      setLoading(true);
      fetchBorrowedItems();
    };

    return () => {
      delete window.reloadBorrowedTable;
    };
  }, []);

  // 🔎 Search filter
  const filteredItems = borrowedItems.filter((item) =>
    Object.values(item)
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  // 📄 Pagination
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  return (
    <div className="borrower-home">
      <div className="container-fluid">
        <TableControls
          title="Borrowed Items"
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onFilter={() => console.log("Filter clicked")}
          searchPlaceholder="Search borrowed items..."
        />

        {loading ? (
          <p className="text-center text-white">⏳ Loading borrowed items...</p>
        ) : currentItems.length === 0 ? (
          <div className="empty-state text-center">
            <img
              src="/resources/imgs/no-results.gif"
              alt="no-results"
              className="mx-auto mb-3 w-40 opacity-90"
            />
            <p className="text-white text-lg font-semibold">
              No matching borrowed items found.
            </p>
            <p className="text-white text-lg font-semibold">
              Try adjusting your search or refresh the list.
            </p>
          </div>
        ) : (
          <>
            {/* Grid of cards */}
            <div className="row g-3">
              {currentItems.map((item, index) => (
                <div className="col-md-6" key={index}>
                  <div className="card shadow-sm custom-card border-left-green">
                    <div className="card-body">
                      <h4 className="fw-bold text-dark mb-3">
                        {item.asset_type} (x{item.quantity})
                      </h4>
                      <p className="small text-muted mb-1">
                        📅 Expected Return: {item.expected_return}
                      </p>
                      <p className="small text-muted mb-1">
                        ✅ Returned Date: {item.returned_date || "—"}
                      </p>

                      <div className="d-flex justify-content-between align-items-center">
                        <span className={`status-badge ${item.borrow_status}`}>
                          {item.borrow_status.charAt(0).toUpperCase() +
                            item.borrow_status.slice(1)}
                        </span>
                        <span className="small text-primary fw-medium">
                          Borrower: {item.borrower_name}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-4">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BorrowedItems;
