import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";

const Dashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/api/Dashboard/get_dashboard_stats.php")
      .then((res) => res.json())
      .then((result) => setData(result))
      .catch((err) => console.error(err));
  }, []);

  if (!data) return <div className="text-center mt-5">Loading dashboard...</div>;

  const { summary, requisition, borrowing, assetByStatus, assetByType, assetByBrand, consumablesByStatus } = data;

  const COLORS = ["#007bff", "#28a745", "#ffc107", "#dc3545"];

  return (
    <div className="container-fluid">
      <h2 className="mb-4 fw-bold">Welcome to IMS Dashboard</h2>

      <div className="row mb-3">
       {/* Summary */}
      <div className="col-md-4 mb-3">
        <div className="card shadow-sm border-0" style={{ backgroundColor: "white", borderRadius: "12px" }}>
          <div className="card-body">
            <h5 className="fw-bold mb-3 text-dark">Summary</h5>

            <div className="p-3 mb-2 rounded d-flex justify-content-between align-items-center" style={{ backgroundColor: "#CBD3C1" }}>
              <div className="text-secondary fw-semibold">Total Assets</div>
              <div className="fw-bold fs-4 text-dark">{summary.totalAssets}</div>
            </div>

            <div className="p-3 mb-2 rounded d-flex justify-content-between align-items-center" style={{ backgroundColor: "#CBD3C1" }}>
              <div className="text-secondary fw-semibold">Total Consumables</div>
              <div className="fw-bold fs-4 text-dark">{summary.totalConsumables}</div>
            </div>

            <div className="p-3 rounded d-flex justify-content-between align-items-center" style={{ backgroundColor: "#CBD3C1" }}>
              <div className="text-secondary fw-semibold">Total Users</div>
              <div className="fw-bold fs-4 text-dark">{summary.totalUsers}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Requisition */}
      <div className="col-md-4 mb-3">
        <div className="card shadow-sm border-0" style={{ backgroundColor: "white", borderRadius: "12px" }}>
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

      {/* Borrowing */}
      <div className="col-md-4 mb-3">
        <div className="card shadow-sm border-0" style={{ backgroundColor: "white", borderRadius: "12px" }}>
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
              <ResponsiveContainer width="100%" height={250}>
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

        {/* Assets by Type */}
        <div className="col-md-6 mb-3">
          <div className="card">
            <div className="card-body">
              <h5>Assets by Type</h5>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={assetByType}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="asset_type" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#007bff" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Asset by Brands */}
        <div className="col-md-6 mb-3">
          <div className="card">
            <div className="card-body">
              <h5>Assets by Brands</h5>
              <ResponsiveContainer
                width="100%"
                height={Math.max(250, assetByBrand.length * 40)} 
              >
                <BarChart
                  data={assetByBrand}
                  layout="vertical"
                  margin={{ top: 5, right: 20, left: 5, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis
                    type="category"
                    dataKey="brand_name"
                    width={150}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip />
                  <Bar
                    dataKey="count"
                    fill="#28a745"
                    barSize={20}
                    radius={[0, 10, 10, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
 

        {/* Consumables by Status */}
        <div className="col-md-6 mb-3">
          <div className="card">
            <div className="card-body">
              <h5>Consumables by Status</h5>
              <ResponsiveContainer width="100%" height={315}>
                <PieChart>
                  <Pie
                    data={consumablesByStatus}
                    dataKey="count"
                    nameKey="consumable_status"
                    innerRadius={70}
                    outerRadius={110}
                    label
                  >
                    {consumablesByStatus.map((_, i) => (
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
      </div>
    </div>
  );
};

export default Dashboard;
