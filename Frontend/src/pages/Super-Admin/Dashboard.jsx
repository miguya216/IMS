import React, { useEffect, useState } from "react";
import {
  PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer
} from "recharts";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [data, setData] = useState(null);
  const navigate = useNavigate();
  const [role, setRole] = useState(null);


  useEffect(() => {
    fetch("/api/Dashboard/get_dashboard_stats.php")
      .then((res) => res.json())
      .then((result) => setData(result))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    fetch("/api/Dashboard/get_session_role.php")
      .then(res => res.json())
      .then(data => {
        if (data.status === "success") {
          setRole(data.role);
        } else {
          console.error("Failed to get session role:", data.message);
        }
      })
      .catch(err => console.error("Error fetching session role:", err));
  }, []);


  if (!data)
    return (
      <div className="loading-page">
        <p>Loading Dashboard</p>
        <img src="/resources/imgs/loading.gif" alt="Loading..." style={{ width: "80px", height: "80px" }} />
      </div>
    );

  const {
    summary, requisition, borrowing,
    assetByStatus, borrowedAssets, lowStockConsumables
  } = data;

  const COLORS = ["#007bff", "#28a745", "#ffc107", "#dc3545"];

  const handleTotalAssetsClick = () => {
    if (!role) return;
    if (role === 1) navigate("/Super-Admin/assets");
    else if (role === 2) navigate("/admin/assets");
  };

  const handleTotalConsumablesClick = () => {
    if (!role) return;
    if (role === 1) navigate("/Super-Admin/consumables");
    else if (role === 2) navigate("/admin/consumables");
  };

  const handleTotalUsersClick = () => {
    if (!role) return;
    if (role === 1) navigate("/Super-Admin/users");
  };

  const handleRequisitionClick = () => {
    if (!role) return;
    if (role === 1) navigate("/Super-Admin/requisitionissuance");
    else if (role === 2) navigate("/admin/requisitionissuance");
  };

  const handleBorrowingClick = () => {
    if (!role) return;
    if (role === 1) navigate("/Super-Admin/reservationborrowing");
    else if (role === 2) navigate("/admin/reservationborrowing");
  };

  const handleBorrowedAssetsClick = () => {
    if (!role) return;
    if (role === 1) navigate("/Super-Admin/assetsborrowable");
    else if (role === 2) navigate("/admin/assetsborrowable");
  };


  return (
    <div className="container-fluid">
      <h2 className="mb-4 fw-bold">Welcome to IMS Dashboard</h2>

      <div className="row mb-3">
        {/* Summary */}
        <div className="col-md-4 mb-3">
          <div className="card shadow-sm border-0" style={{ backgroundColor: "white", borderRadius: "12px" }}>
            <div className="card-body">
              <h5 className="fw-bold mb-3 text-dark">Summary</h5>

              <div
                className="p-3 mb-2 rounded d-flex justify-content-between align-items-center hover-pointer"
                style={{ backgroundColor: "#CBD3C1", cursor: "pointer" }}
                onClick={handleTotalAssetsClick}
              >
                <div className="text-secondary fw-semibold">Total Assets</div>
                <div className="fw-bold fs-4 text-dark">{summary.totalAssets}</div>
              </div>

              <div
                className="p-3 mb-2 rounded d-flex justify-content-between align-items-center hover-pointer"
                style={{ backgroundColor: "#CBD3C1", cursor: "pointer" }}
                onClick={handleTotalConsumablesClick}
              >
                <div className="text-secondary fw-semibold">Total Consumables</div>
                <div className="fw-bold fs-4 text-dark">{summary.totalConsumables}</div>
              </div>

              <div
                className="p-3 rounded d-flex justify-content-between align-items-center hover-pointer"
                style={{ backgroundColor: "#CBD3C1", cursor: "pointer" }}
                onClick={handleTotalUsersClick}
              >
                <div className="text-secondary fw-semibold">Total Users</div>
                <div className="fw-bold fs-4 text-dark">{summary.totalUsers}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Requisition */}
        <div className="col-md-4 mb-3">
          <div
            className="card shadow-sm border-0"
            style={{ backgroundColor: "white", borderRadius: "12px", cursor: "pointer" }}
            onClick={handleRequisitionClick}
          >
            <div className="card-body">
              <h5 className="fw-bold mb-3 text-dark">Requisition & Issue</h5>

              <div className="p-3 mb-2 rounded d-flex justify-content-between align-items-center" style={{ backgroundColor: "#CBD3C1" }}>
                <div className="text-secondary fw-semibold">Pending</div>
                <div className="fw-bold fs-4 text-dark">{requisition.pending}</div>
              </div>

              <div className="p-3 mb-2 rounded d-flex justify-content-between align-items-center" style={{ backgroundColor: "#CBD3C1" }}>
                <div className="text-secondary fw-semibold">Cancelled</div>
                <div className="fw-bold fs-4 text-dark">{requisition.cancelled}</div>
              </div>

              <div className="p-3 rounded d-flex justify-content-between align-items-center" style={{ backgroundColor: "#CBD3C1" }}>
                <div className="text-secondary fw-semibold">Issuing</div>
                <div className="fw-bold fs-4 text-dark">{requisition.issuing}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Reservation & Borrowing */}
        <div className="col-md-4 mb-3">
          <div
            className="card shadow-sm border-0"
            style={{ backgroundColor: "white", borderRadius: "12px", cursor: "pointer" }}
            onClick={handleBorrowingClick}
          >
            <div className="card-body">
              <h5 className="fw-bold mb-3 text-dark">Reservation & Borrowing</h5>

              <div className="p-3 mb-2 rounded d-flex justify-content-between align-items-center" style={{ backgroundColor: "#CBD3C1" }}>
                <div className="text-secondary fw-semibold">Pending</div>
                <div className="fw-bold fs-4 text-dark">{borrowing.pending}</div>
              </div>

              <div className="p-3 mb-2 rounded d-flex justify-content-between align-items-center" style={{ backgroundColor: "#CBD3C1" }}>
                <div className="text-secondary fw-semibold">Cancelled</div>
                <div className="fw-bold fs-4 text-dark">{borrowing.cancelled}</div>
              </div>

              <div className="p-3 rounded d-flex justify-content-between align-items-center" style={{ backgroundColor: "#CBD3C1" }}>
                <div className="text-secondary fw-semibold">Issuing</div>
                <div className="fw-bold fs-4 text-dark">{borrowing.issuing}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Asset by Status */}
        <div className="col-md-6 mb-3">
          <div className="card">
            <div className="card-body">
              <h5>Assets by Status</h5>
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie
                    data={assetByStatus}
                    dataKey="count"
                    nameKey="asset_status"
                    outerRadius={100}
                    label
                  >
                    {assetByStatus.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Low Stock Consumables */}
        <div className="col-md-6 mb-3">
          <div className="card shadow-sm border-0" style={{ borderRadius: "12px" }}>
            <div className="card-body">
              <h5 className="fw-bold mb-3 text-dark">Low Stock Consumables</h5>
              {lowStockConsumables.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-sm align-middle">
                    <thead>
                      <tr className="table-secondary">
                        <th>Consumable Name</th>
                        <th>Qty</th>
                        <th>Unit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lowStockConsumables.map((item, i) => (
                        <tr key={i}>
                          <td>{item.consumable_name}</td>
                          <td className={item.total_quantity < 10 ? "text-danger fw-bold" : ""}>
                            {item.total_quantity}
                          </td>
                          <td>{item.unit_of_measure}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-muted mb-0">No low-stock items found.</p>
              )}
            </div>
          </div>
        </div>

       {/* Borrowed Assets (Returning Soon) */}
        <div className="col-md-12 mb-3">
          <div
            className="card shadow-sm border-0"
            style={{ borderRadius: "12px", cursor: "pointer" }}
            onClick={handleBorrowedAssetsClick}
          >
            <div className="card-body">
              <h5 className="fw-bold mb-3 text-dark">Borrowed Assets (Returning Soon)</h5>
              {borrowedAssets.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-sm align-middle">
                    <thead>
                      <tr className="table-secondary">
                        <th>BRS No</th>
                        <th>Property Tag</th>
                        <th>Borrower</th>
                        <th>Return Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {borrowedAssets.map((item, i) => (
                        <tr key={i}>
                          <td>{item.brs_no}</td>
                          <td>{item.kld_property_tag}</td>
                          <td>{item.f_name} {item.l_name}</td>
                          <td>{new Date(item.date_of_return).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-muted mb-0">No upcoming returns.</p>
              )}
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default Dashboard;
