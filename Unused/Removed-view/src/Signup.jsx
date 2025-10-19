import React, { useState, useEffect } from "react";
import Popups from "/src/components/Popups.jsx";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [units, setUnits] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [kldIdPart1, setKldIdPart1] = useState("");
  const [kldIdPart2, setKldIdPart2] = useState(""); 
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showConfirmDone, setShowConfirmDone] = useState(false);
  const [confirmDoneTitle, setConfirmDoneTitle] = useState("");
  const [confirmDoneBody, setConfirmDoneBody] = useState("");

  useEffect(() => {
  fetch("/api/Signup-Auth/get_verified_email.php")
    .then((res) => res.json())
    .then((data) => {
      if (data.status === "success") {
        setEmail(data.email);
        setIsAuthorized(true);
      } else {
        setConfirmDoneTitle("Access Denied");
        setConfirmDoneBody(data.message || "Access denied. Redirecting to login.");
        setShowConfirmDone(true);
      }
    })
    .catch(() => {
      setConfirmDoneTitle("Session Error");
      setConfirmDoneBody("Please start the signup process again.");
      setShowConfirmDone(true);
    })
    .finally(() => setLoading(false));
}, []);

const handleDone = () => {
  setShowConfirmDone(false);
  window.location.href = "/login";
};

const handleSubmit = async (e) => {
  e.preventDefault();

  // Password match check
  if (password !== confirmPassword) {
    setConfirmDoneTitle("Signup Failed");
    setConfirmDoneBody("Passwords do not match.");
    setShowConfirmDone(true);
    return;
  }

  try {
    const kld_ID = `KLD-${kldIdPart1.padStart(2, "0")}-${kldIdPart2.padStart(6, "0")}`;
    const kld_email = email;

    const response = await fetch("/api/Signup-Auth/signup.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        first_name: firstName,
        last_name: lastName,
        kld_ID,
        kld_email,
        password,
        unit_ID: selectedUnit,
      }),
    });

    const data = await response.json();
    console.log("Raw response:", data);

    if (response.ok && data.success) {
      setConfirmDoneTitle("Signup Successful");
      setConfirmDoneBody("You may now log in using your credentials.");
      setShowConfirmDone(true);
    } else {
      setConfirmDoneTitle("Signup Failed");
      setConfirmDoneBody(data.message || "Something went wrong. Please try again.");
      setShowConfirmDone(true);
    }
  } catch (error) {
    console.error("Signup error:", error);
    setConfirmDoneTitle("Network Error");
    setConfirmDoneBody("An error occurred during signup. Please check your connection and try again.");
    setShowConfirmDone(true);
  }
};


 useEffect(() => {
    fetch("/api/dropdown_fetch.php")
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data.units)) {
          setUnits(data.units);
        } else {
          console.error("Units not found in response:", data);
        }
      })
      .catch((err) => console.error("Error fetching dropdowns:", err));
  }, []);


  return (
  <div
    className="min-vh-100 d-flex justify-content-center align-items-center px-3"
    style={{
      background: `
        linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
        url("/resources/imgs/building_kld.png")
      `,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    }}
  >
    <div
        className="container bg-white shadow rounded-4 py-4 px-3 px-sm-4 px-md-5"
        style={{ maxWidth: "850px" }}
    >

      {/* Logo and Title */}
      <div className="text-center mb-4">
        <img src="/resources/imgs/clarity.png" alt="CLARITY Logo" height="48" />
        <h2
          className="fw-bold mt-2 mb-1"
          style={{
            background: "linear-gradient(to bottom right, #005a34, #006705, #009708)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          CLARITY
        </h2>
        <h6
          className="fw-semibold mb-1"
          style={{
            background: "linear-gradient(to bottom right, #005a34, #006705, #009708)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          College Logistics Asset Registry & Inventory Tracking
        </h6>
        <p className="text-muted small">
          Developed by IMACS Kolehiyo ng Lungsod ng Dasmariñas
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="row">
          {/* First Name */}
          <div className="col-md-6 mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>

             {/* Last Name */}
          <div className="col-md-6 mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div className="col-md-6 mb-3">
            <div className="input-group">
                <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                />
                <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowPassword(!showPassword)}
                style={{ zIndex: 5 }}
                >
                <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                </button>
            </div>
            </div>


           {/* Confirm Password */}
          <div className="col-md-6 mb-3">
            <div className="input-group">
                <input
                type={showConfirmPassword ? "text" : "password"}
                className="form-control"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                />
                <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                tabIndex={-1}
                >
                <i className={`bi ${showConfirmPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                </button>
            </div>
            </div>


           {/* Email Username */}
          <div className="col-md-6 mb-3">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                value={email}
                readOnly
              />
              </div>
          </div>

          {/* KLD ID */}
          <div className="col-md-6 mb-3">
            <div className="input-group">
                <span className="input-group-text bg-light">KLD-</span>
                <input
                type="text"
                className="form-control"
                maxLength={2}
                placeholder="00"
                value={kldIdPart1}
                onChange={(e) => setKldIdPart1(e.target.value.replace(/\D/g, ""))}
                required
                />
                <span className="input-group-text bg-light">-</span>
                <input
                type="text"
                className="form-control"
                maxLength={6}
                placeholder="000000"
                value={kldIdPart2}
                onChange={(e) => setKldIdPart2(e.target.value.replace(/\D/g, ""))}
                required
                />
            </div>
            </div>

          {/* Unit Dropdown */}
          <div className="col-md-6 mb-4">
            <select
              className="form-select"
              required
              value={selectedUnit}
              onChange={(e) => setSelectedUnit(e.target.value)}
            >
              <option value="">Select Unit</option>
              {units.map((unit) => (
                <option key={unit.unit_ID} value={unit.unit_ID}>
                  {unit.unit_name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Sign Up Button */}
        <div className="text-center mb-3">
          <button type="submit" className="btn btn-form-green px-5">
            Sign Up
          </button>
        </div>
      </form>
    </div>
    <Popups
      showLoading={loading}
      loadingText="Loading..."
      showConfirmDone={showConfirmDone}
      confirmDoneTitle={confirmDoneTitle}
      confirmDoneBody={confirmDoneBody}
      onConfirmDone={handleDone}
    />

  </div>
);
};

export default Signup;
