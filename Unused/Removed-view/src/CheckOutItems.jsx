import React, { useState, useEffect } from "react";
import TableControls from "/src/components/TableControls";

const CheckOutItems = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [borrowedItems, setBorrowedItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCheckoutItems = () => {
    setLoading(true);
    fetch("/api/fetch_data.php?action=custodiancheckoutitems")
      .then((res) => res.json())
      .then((data) => {
        setBorrowedItems(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch checkout items", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCheckoutItems();
  }, []);

  const filteredItems = borrowedItems.filter((item) =>
    item.kld_email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.borrower_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.asset_type?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container-fluid">
      <TableControls
        title="Checked Out Items"
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onFilter={() => console.log("Filter clicked")}
        searchPlaceholder="Search borrowed items..."
      />

      {loading ? (
        <p className="text-center text-muted">⏳ Loading checkout items...</p>
      ) : filteredItems.length === 0 ? (
        <p className="text-center text-muted">No borrowed items found.</p>
      ) : (
        <div className="custom-table-wrapper">
          <table className="custom-table">
            <thead>
              <tr>
                <th>KLD Email</th>
                <th>Borrower Name</th>
                <th>Borrowed Items</th>
                <th>Expected Return</th>
                <th>Returned Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item, index) => (
                <tr key={index}>
                  <td data-label="KLD Email">{item.borrower_email}</td>
                  <td data-label="Borrower Name">{item.borrower_name}</td>
                  <td data-label="Asset Type">{`${item.asset_type} (x${item.quantity})`}</td>
                  <td data-label="Expected Return">{item.expected_return}</td>
                  <td data-label="Returned Date">{item.returned_date || "—"}</td>
                  <td data-label="Status">
                    <span className={`status-badge ${item.borrow_status}`}>
                      {item.borrow_status.charAt(0).toUpperCase() + item.borrow_status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CheckOutItems;
