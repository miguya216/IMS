import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import navigate
import "/src/css/Login.css";
import Popups from "/src/components/Popups";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [showLoading, setShowLoading] = useState(false);
  const [showResponse, setShowResponse] = useState(false);
  const [responseTitle, setResponseTitle] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const navigate = useNavigate(); // Initialize navigation

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowLoading(true);

    try {
      const res = await fetch("/api/Forgot-Password-Handlers/forgot_password.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      setShowLoading(false);

      if (data.success) {
        setResponseTitle("✅ Email Sent");
        setResponseMessage("A password reset link has been sent to your KLD email.");

        // Optional: redirect after short delay
        setTimeout(() => {
          navigate("/welcome");
        }, 3000); // redirect after 3 seconds
      } else {
        setResponseTitle("❌ Request Failed");
        setResponseMessage(data.error || "Unable to send reset link. Please try again.");
      }
    } catch (err) {
      console.error("Error:", err);
      setShowLoading(false);
      setResponseTitle("⚠️ Server Error");
      setResponseMessage("Something went wrong. Please try again later.");
    } finally {
      setShowResponse(true);
    }
  };

  return (
    <>
      <div className="login-body">
        <header className="welcome-header">
          <div className="logo-container">
            <img
              src="/resources/imgs/KLDlogo.png"
              alt="IMS Logo"
              className="logo"
            />
            <span className="logo-text">IMS | CLARITY</span>
          </div>
        </header>

        {/* Floating items */}
        <div className="floating-items">
          <div className="float-item item1">
            <img src="/resources/imgs/laptop.png" alt="Laptop" />
          </div>
          <div className="float-item item2">
            <img src="/resources/imgs/erlenmeyer-flask.png" alt="Flask" />
          </div>
          <div className="float-item item3">
            <img src="/resources/imgs/keyboard.png" alt="Keyboard" />
          </div>
          <div className="float-item item4">
            <img src="/resources/imgs/monitor.png" alt="Monitor" />
          </div>
          <div className="float-item item5">
            <img src="/resources/imgs/mouse.png" alt="Mouse" />
          </div>
          <div className="float-item item6">
            <img
              src="/resources/imgs/sphygmomanometer.png"
              alt="Sphygmomanometer"
            />
          </div>
          <div className="float-item item7">
            <img src="/resources/imgs/speaker.png" alt="Speaker" />
          </div>
          <div className="float-item item8">
            <img src="/resources/imgs/stethoscope.png" alt="Stethoscope" />
          </div>
          <div className="float-item item9">
            <img src="/resources/imgs/tsquare.png" alt="T-Square" />
          </div>
        </div>

        {/* Main Form */}
        <div className="login-form-container">
          <div className="d-flex justify-content-center align-items-center mb-2">
            <img
              src="/resources/imgs/clarity.png"
              alt="CLARITY Logo"
              style={{ height: "48px", marginRight: "0.5rem" }}
            />
            <h1
              className="fw-bold mb-0"
              style={{
                background:
                  "linear-gradient(to bottom right, #005a34, #006705, #009708)",
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
              background:
                "linear-gradient(to bottom right, #005a34, #006705, #009708)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            College Logistics Asset Registry & Inventory Tracking
          </h3>

          <p>
            Institute of Computing and Digital Innovation (ICDI)
            <br />
            Kolehiyo ng Lungsod ng Dasmariñas
          </p>

          <form className="mt-4" onSubmit={handleSubmit}>
            <p>Verify your KLD email</p>
            <div className="row mb-3">
              <div className="col-md-8 mb-3">
                <input
                  type="email"
                  className="form-control"
                  placeholder="KLD email ex. fsmlastname@kld.edu.ph"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="col-md-4 mb-3">
                <button
                  type="submit"
                  className="btn btn-form-green w-100"
                  disabled={showLoading}
                >
                  {showLoading ? "Sending..." : "Send Email"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Popup Handler */}
      <Popups
        showLoading={showLoading}
        loadingText="Sending password reset email..."
        showResponse={showResponse}
        responseTitle={responseTitle}
        responseMessage={responseMessage}
        onCloseResponse={() => setShowResponse(false)}
      />
    </>
  );
};

export default ForgotPassword;
