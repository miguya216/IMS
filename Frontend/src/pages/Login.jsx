// src/pages/Login.jsx
import React, { useState , useEffect} from "react";
import { useNavigate } from "react-router-dom";
import Popups from "/src/components/Popups.jsx"; 
import "/src/css/Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmDone, setShowConfirmDone] = useState(false);
  const [confirmDoneTitle, setConfirmDoneTitle] = useState("");
  const [confirmDoneBody, setConfirmDoneBody] = useState("");
  

      useEffect(() => {
    fetch("/api/check_session.php", {
      credentials: "include", 
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.loggedIn) {
          const role = data.role;
          if (role === 1) navigate("/Super-Admin/dashboard");
          else if (role === 2) navigate("/admin/dashboard");
          else if (role === 3) navigate("/custodians/dashboard");
        } 
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
        fetch("/api/login.php", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            credentials: "include", // <-- IMPORTANT
            body: JSON.stringify({ email, password, rememberMe })
          })
            .then(res => res.json())
            .then((data) => {
            if (data.success) {
              if (data.role === "1") navigate("/Super-Admin/dashboard");
              else if (data.role === "2") navigate("/admin/dashboard");
              else if (data.role === "3") navigate("/custodians/dashboard");
              else navigate("/");
            } else {
              setConfirmDoneTitle("❌ Login Failed");
              setConfirmDoneBody(data.message || "Invalid credentials. Please try again.");
              setShowConfirmDone(true);
            }
          })
          .catch((error) => {
            console.error("Login error:", error);
            setConfirmDoneTitle("⚠️ Network Error");
            setConfirmDoneBody("Something went wrong while logging in. Please try again.");
            setShowConfirmDone(true);
          });

  };

  const handleDone = () => {
    setShowConfirmDone(false);
  };

return (
  <div
    className="login-body"
  >
     <header className="welcome-header">
      <div className="logo-container">
        <img src="/resources/imgs/KLDlogo.png" alt="IMS Logo" className="logo" />
        <span className="logo-text">IMS | CLARITY</span>
      </div>
    </header>
    <div className="floating-items">
        <div className="float-item item1"><img src="/resources/imgs/laptop.png" alt="Laptop" /></div>
        <div className="float-item item2"><img src="/resources/imgs/erlenmeyer-flask.png" alt="Flask" /></div>
        <div className="float-item item3"><img src="/resources/imgs/keyboard.png" alt="Keyboard" /></div>
        <div className="float-item item4"><img src="/resources/imgs/monitor.png" alt="Monitor" /></div>
        <div className="float-item item5"><img src="/resources/imgs/mouse.png" alt="Mouse" /></div>
        <div className="float-item item6"><img src="/resources/imgs/sphygmomanometer.png" alt="Sphygmomanometer" /></div>
        <div className="float-item item7"><img src="/resources/imgs/speaker.png" alt="Speaker" /></div>
        <div className="float-item item8"><img src="/resources/imgs/stethoscope.png" alt="Stethoscope" /></div>
        <div className="float-item item9"><img src="/resources/imgs/tsquare.png" alt="T-Square" /></div>
    </div>
    <div className="login-form-container">
      {/* Logo + Title */}
      <div className="d-flex justify-content-center align-items-center mb-2">
        <img
          src="/resources/imgs/clarity.png"
          alt="CLARITY Logo"
          style={{ height: "48px", marginRight: "0.5rem" }}
        />
        <h1
          className="fw-bold mb-0"
          style={{
            background: "linear-gradient(to bottom right, #005a34, #006705, #009708)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          CLARITY
        </h1>
      </div>

      <h3
        className="fw-semibold mb-3"
        style={{
          background: "linear-gradient(to bottom right, #005a34, #006705, #009708)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        College Logistics Asset Registry & Inventory Tracking
      </h3>

      <p>
        Institute of Computing and Digital Innovation (ICDI)
         Kolehiyo ng Lungsod ng Dasmariñas
      </p>

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="KLD email ex. fsmlastname@kld.edu.ph"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {/* <span className="input-group-text bg-light">@kld.edu.ph</span> */}
        </div>

        <div className="input-group mb-3">
          <input
            type={showPassword ? "text" : "password"}
            className="form-control"
            placeholder="PASSWORD"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
          >
            <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
          </button>
        </div>



        <div className="form-check mb-3 d-flex align-items-center gap-2">
          <input
            type="checkbox"
            id="rememberMe"
            className="form-check-input"
            style={{
              width: "1.2rem",
              height: "1.2rem",
              borderRadius: "4px",
              border: "2px solid #005a34",
              appearance: "none",
              WebkitAppearance: "none",
              backgroundColor: "white",
              position: "relative",
              display: "grid",
              placeContent: "center",
              cursor: "pointer",
              transition: "0.2s ease-in-out",
            }}
            onChange={(e) => {
              const isChecked = e.target.checked;
              e.target.style.backgroundImage = isChecked
                ? "linear-gradient(to bottom right, #005a34, #006705, #009708)"
                : "none";
              e.target.style.borderColor = isChecked ? "#009708" : "#005a34";
              e.target.innerHTML = isChecked ? "✓" : "";
            }}
          />
          <label
            className="form-check-label"
            htmlFor="rememberMe"
          >
            Remember Me
          </label>
        </div>


        <div className="d-grid mb-3">
          <button type="submit" className="btn btn-form-green">
            Log In
          </button>
        </div>
      </form>

      <div className="d-grid mb-3">
         {/* <button onClick={handleSignUp} className="btn btn-form-yellow">
            Sign up
          </button> */}
        <a href="/forgotpassword" className="d-block text-primary text-decoration-none">
          Forgot Password
        </a>
      </div>
    </div>
      <Popups
        showConfirmDone={showConfirmDone}
        onConfirmDone={handleDone}
        confirmDoneTitle={confirmDoneTitle}
        confirmDoneBody={confirmDoneBody}
      />
  </div>
);

}

export default Login;
