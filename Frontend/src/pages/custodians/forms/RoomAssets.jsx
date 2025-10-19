import React, { useEffect, useState } from "react";
import TableControls from "/src/components/TableControls";
import Pagination from "/src/components/Pagination"; //  import pagination

const RoomAsset = ({ roomId }) => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState(""); //  search state

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // adjust as needed

  useEffect(() => {
    if (!roomId) return; 
    const fetchAssets = async () => {
      try {
        const response = await fetch(
          `/api/Room-Handlers/fetch_asset_by_room.php?room_ID=${roomId}`
        );
        const data = await response.json();
        setAssets(data);
      } catch (error) {
        console.error("Error fetching assets:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAssets();
  }, [roomId]);

  // filter assets based on searchQuery
  const filteredAssets = assets.filter((asset) => {
    const query = searchQuery.toLowerCase();
    return (
      asset.kld_property_tag?.toLowerCase().includes(query) ||
      asset.brand_name?.toLowerCase().includes(query) ||
      asset.asset_type?.toLowerCase().includes(query) ||
      asset.condition?.toLowerCase().includes(query)
    );
  });

  //  Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Pagination logic on filtered assets
  const totalPages = Math.ceil(filteredAssets.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentAssets = filteredAssets.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="container-fluid p-4">
      <TableControls
        title="Asset List"
        searchQuery={searchQuery}       //  controlled input
        setSearchQuery={setSearchQuery} //  handler
        searchPlaceholder="Search assets..."
      />

      <div className="custom-table-wrapper">
        <table className="custom-table">
          <thead>
            <tr>
              <th>#</th>
              <th>KLD-Property Tag</th>
              <th>Brand</th>
              <th>Asset Type</th>
              <th>Price Amount</th>
              <th>Condition</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>
                  Loading...
                </td>
              </tr>
            ) : currentAssets.length > 0 ? (
              currentAssets.map((asset, index) => (
                <tr key={asset.asset_ID}>
                  <td data-label="#">{startIndex + index + 1}</td>
                  <td data-label="KLD-Property Tag">{asset.kld_property_tag}</td>
                  <td data-label="Brand">{asset.brand_name}</td>
                  <td data-label="Asset Type">{asset.asset_type}</td>
                  <td data-label="Price Amount">{asset.price_amount}</td>
                  <td data-label="Asset Condition">{asset.condition}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>
                  No assets found for this room.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/*  Pagination */}
      {!loading && filteredAssets.length > itemsPerPage && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      )}
    </div>
  );
};

export default RoomAsset;
