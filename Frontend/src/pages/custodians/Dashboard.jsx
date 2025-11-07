import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const Dashboard = () => {
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/api/Dashboard/get_user_dashboard_stats.php")
      .then((res) => res.json())
      .then((result) => {
        if (result.success) setData(result);
      })
      .catch((err) => console.error("Error fetching dashboard:", err));
  }, []);

  if (!data)
    return (
      <div className="loading-page">
        <p>Loading Dashboard</p>
        <img
          src="/resources/imgs/loading.gif"
          alt="Loading..."
          style={{ width: "80px", height: "80px" }}
        />
      </div>
    );

  const { summary, requisition, borrowing, ownership, room_usage } = data;

  const ownershipChartData = [
    { name: "Owned", value: ownership.percentage },
    { name: "Unowned", value: 100 - ownership.percentage },
  ];

  const roomChartData = room_usage.map((r) => ({
    room: r.room_number,
    assets: r.asset_count,
  }));

  return (
    <div className="container-fluid">
      <h2 className="mb-4 fw-bold">Welcome to IMS Dashboard</h2>

      <div className="row">
        {/* Summary */}
        <div className="col-md-4 mb-3">
          <div
            className="card shadow-sm border-0"
            style={{ backgroundColor: "white", borderRadius: "12px" }}
          >
            <div className="card-body">
              <h5 className="fw-bold mb-3 text-dark">Summary</h5>

              <div
                className="p-3 mb-2 rounded d-flex justify-content-between align-items-center"
                style={{ backgroundColor: "#CBD3C1" }}
              >
                <div className="text-secondary fw-semibold">Total Assets</div>
                <div className="fw-bold fs-4 text-dark">
                  {summary.total_assets}
                </div>
              </div>

              <div
                className="p-3 mb-2 rounded d-flex justify-content-between align-items-center"
                style={{ backgroundColor: "#CBD3C1" }}
              >
                <div className="text-secondary fw-semibold">
                  Total Consumables
                </div>
                <div className="fw-bold fs-4 text-dark">
                  {summary.total_consumables}
                </div>
              </div>

              <div
                className="p-3 rounded d-flex justify-content-between align-items-center"
                style={{ backgroundColor: "#CBD3C1" }}
              >
                <div className="text-secondary fw-semibold">Total Rooms Used</div>
                <div className="fw-bold fs-4 text-dark">
                  {summary.total_rooms}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Requisition & Issue */}
        <div className="col-md-4 mb-3">
          <div
            className="card shadow-sm border-0 clickable"
            style={{
              backgroundColor: "white",
              borderRadius: "12px",
              cursor: "pointer",
            }}
            onClick={() => navigate("/custodians/requisitionissuance")}
          >
            <div className="card-body">
              <h5 className="fw-bold mb-3 text-dark">Requisition & Issue</h5>

              <div
                className="p-3 mb-2 rounded d-flex justify-content-between align-items-center"
                style={{ backgroundColor: "#CBD3C1" }}
              >
                <div className="text-secondary fw-semibold">Pending</div>
                <div className="fw-bold fs-4 text-dark">
                  {requisition.pending}
                </div>
              </div>

              <div
                className="p-3 mb-2 rounded d-flex justify-content-between align-items-center"
                style={{ backgroundColor: "#CBD3C1" }}
              >
                <div className="text-secondary fw-semibold">Cancelled</div>
                <div className="fw-bold fs-4 text-dark">
                  {requisition.cancelled}
                </div>
              </div>

              <div
                className="p-3 rounded d-flex justify-content-between align-items-center"
                style={{ backgroundColor: "#CBD3C1" }}
              >
                <div className="text-secondary fw-semibold">Issuing</div>
                <div className="fw-bold fs-4 text-dark">
                  {requisition.issuing}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reservation & Borrowing */}
        <div className="col-md-4 mb-3">
          <div
            className="card shadow-sm border-0 clickable"
            style={{
              backgroundColor: "white",
              borderRadius: "12px",
              cursor: "pointer",
            }}
            onClick={() => navigate("/custodians/reservationborrowing")}
          >
            <div className="card-body">
              <h5 className="fw-bold mb-3 text-dark">
                Reservation & Borrowing
              </h5>

              <div
                className="p-3 mb-2 rounded d-flex justify-content-between align-items-center"
                style={{ backgroundColor: "#CBD3C1" }}
              >
                <div className="text-secondary fw-semibold">Pending</div>
                <div className="fw-bold fs-4 text-dark">
                  {borrowing.pending}
                </div>
              </div>

              <div
                className="p-3 mb-2 rounded d-flex justify-content-between align-items-center"
                style={{ backgroundColor: "#CBD3C1" }}
              >
                <div className="text-secondary fw-semibold">Cancelled</div>
                <div className="fw-bold fs-4 text-dark">
                  {borrowing.cancelled}
                </div>
              </div>

              <div
                className="p-3 rounded d-flex justify-content-between align-items-center"
                style={{ backgroundColor: "#CBD3C1" }}
              >
                <div className="text-secondary fw-semibold">Issuing</div>
                <div className="fw-bold fs-4 text-dark">
                  {borrowing.issuing}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Custodian Ownership */}
        <div className="col-md-6 mb-3">
          <div
            className="card p-3 shadow-sm border-0 text-center clickable"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/custodians/assets")}
          >
            <h5 className="fw-bold mb-3 text-dark">
              Custodian Ownership Percentage
            </h5>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={ownershipChartData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={70}
                  outerRadius={110}
                  label
                >
                  {ownershipChartData.map((_, i) => (
                    <Cell key={i} fill={i === 0 ? "#00931dff" : "#316a3a"} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
            <p className="mt-2 text-secondary">{ownership.description}</p>
            <h4 className="fw-bold text-dark">{ownership.percentage}%</h4>
          </div>
        </div>

        {/* Assets per Room */}
        <div className="col-md-6 mb-3">
          <div
            className="card p-3 shadow-sm border-0 clickable"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/custodians/roomlist")}
          >
            <h5 className="fw-bold mb-3 text-dark">Assets per Room</h5>
            <ResponsiveContainer width="100%" height={390}>
              <BarChart
                data={roomChartData}
                layout="vertical"
                margin={{ top: 10, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="room" width={100} />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="assets"
                  fill="#17a2b8"
                  barSize={20}
                  radius={[0, 5, 5, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
