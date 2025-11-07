import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "/src/css/Login.css";
import Popups from "/src/components/Popups";

const RecoverAccount = () => {
  const navigate = useNavigate();
  const { token } = useParams(); // get token from URL

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [showLoading, setShowLoading] = useState(true); // initially true for token verification
  const [showResponse, setShowResponse] = useState(false);
  const [responseTitle, setResponseTitle] = useState("");
  const [responseMessage, setResponseMessage] = useState("");

  // Verify token immediately when page loads
  useEffect(() => {
    const verifyToken = async () => {
      try {
        const res = await fetch(
          `/api/Forgot-Password-Handlers/verify_recovery_token.php?token=${token}`
        );
        const data = await res.json();

        if (!data.valid) {
          // Invalid or expired token
          setResponseTitle("🚫 Invalid or Expired Token");
          setResponseMessage(
            "Your password recovery link is invalid or has expired. Please request a new one."
          );
          setShowResponse(true);

          setTimeout(() => {
            navigate("/welcome");
          }, 3000);
        } else {
          // Token is valid
          setShowLoading(false);
        }
      } catch (err) {
        console.error("Token verification failed:", err);
        setResponseTitle("🚨 Connection Error");
        setResponseMessage("Unable to verify recovery token. Please try again later.");
        setShowResponse(true);
        setTimeout(() => navigate("/welcome"), 3000);
      }
    };

    verifyToken();
  }, [token, navigate]);

  // Handle Password Reset Submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setResponseTitle("⚠️ Password Mismatch");
      setResponseMessage("Passwords do not match. Please try again.");
      setShowResponse(true);
      return;
    }

    setShowLoading(true);

    try {
      const res = await fetch("/api/Forgot-Password-Handlers/reset_password.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await res.json();
      setShowLoading(false);

      if (data.success) {
        setResponseTitle("✅ Password Reset Successful");
        setResponseMessage("Your password has been updated successfully.");
        setShowResponse(true);

        setTimeout(() => {
          navigate("/welcome");
        }, 2500);
      } else {
        setResponseTitle("❌ Reset Failed");
        setResponseMessage(data.error || "Invalid or expired token.");
        setShowResponse(true);
      }
    } catch (err) {
      console.error(err);
      setShowLoading(false);
      setResponseTitle("⚠️ Server Error");
      setResponseMessage("Something went wrong. Please try again later.");
      setShowResponse(true);
    }
  };

  return (
    <>
      <div className="login-body">
        <header className="welcome-header">
          <div className="logo-container">
            <img src="/resources/imgs/KLDlogo.png" alt="IMS Logo" className="logo" />
            <span className="logo-text">IMS | CLARITY</span>
          </div>
        </header>

        {/* Floating items */}
        <div className="floating-items">
          {[
            "laptop",
            "erlenmeyer-flask",
            "keyboard",
            "monitor",
            "mouse",
            "sphygmomanometer",
            "speaker",
            "stethoscope",
            "tsquare",
          ].map((img, idx) => (
            <div key={idx} className={`float-item item${idx + 1}`}>
              <img src={`/resources/imgs/${img}.png`} alt={img} />
            </div>
          ))}
        </div>

        {/* Main Form — only visible once token verified */}
        {!showLoading && (
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
              Reset Your Password
            </h3>

            <form className="mt-4" onSubmit={handleSubmit}>
              <div className="row mb-3">
                <div className="col-md-12 mb-3">
                  <div className="input-group mb-3">
                    <input
                      type={showPassword ? "text" : "password"}
                      className="form-control"
                      placeholder="NEW PASSWORD"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="col-md-12 mb-3">
                  <div className="input-group mb-3">
                    <input
                      type={showPassword ? "text" : "password"}
                      className="form-control"
                      placeholder="CONFIRM NEW PASSWORD"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="col-md-12 mb-3 d-flex align-items-center">
                  <button
                      type="button"
                      className="btn btn-outline-secondary me-2"
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex={-1}
                    >
                      <i
                        className={`bi ${
                          showPassword ? "bi-eye-slash" : "bi-eye"
                        }`}
                      ></i>
                    </button>
                    <span className="text-muted fw-semibold">Show Password</span>
                </div>
              </div>

              <div className="d-grid mb-3">
                <button
                  type="submit"
                  className="btn btn-form-green"
                  disabled={showLoading}
                >
                  {showLoading ? "Resetting..." : "Reset Password"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Popup Handler */}
      <Popups
        showLoading={showLoading}
        loadingText="Verifying recovery link..."
        showResponse={showResponse}
        responseTitle={responseTitle}
        responseMessage={responseMessage}
        onCloseResponse={() => setShowResponse(false)}
      />
    </>
  );
};

export default RecoverAccount;
