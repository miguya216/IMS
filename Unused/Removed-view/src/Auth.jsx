import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Popups from "/src/components/Popups.jsx"; // Adjust path as needed

const Auth = () => {
  const [showLoading, setShowLoading] = useState(true);
  const [loadingText, setLoadingText] = useState("Verifying...");
  const [showConfirmDone, setShowConfirmDone] = useState(false);
  const [confirmDoneTitle, setConfirmDoneTitle] = useState("");
  const [confirmDoneBody, setConfirmDoneBody] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    const verifyToken = async () => {
      if (!token) {
        setShowLoading(false);
        setConfirmDoneTitle("Verification Failed");
        setConfirmDoneBody("No token provided.");
        setShowConfirmDone(true);
        return;
      }

      try {
        const response = await fetch(`/api/Signup-Auth/verify_reg_token.php?token=${token}`);
        const result = await response.json();

        if (result.status === "success") {
          setLoadingText("Redirecting to Signup...");
          setTimeout(() => {
            navigate("/signup");
          }, 2000);
        } else {
          setShowLoading(false);
          setConfirmDoneTitle("Verification Failed");
          setConfirmDoneBody(result.message || "Verification failed.");
          setShowConfirmDone(true);
        }
      } catch (err) {
        setShowLoading(false);
        setConfirmDoneTitle("Server Error");
        setConfirmDoneBody("Please try again later.");
        setShowConfirmDone(true);
      }
    };

    verifyToken();
  }, [navigate]);

  // This gets triggered when user clicks "Done" on the confirmation popup
  const handleDone = () => {
    setShowConfirmDone(false);
    navigate("/");
  };

  return (
    <Popups
      showLoading={showLoading}
      loadingText={loadingText}
      showConfirmDone={showConfirmDone}
      confirmDoneTitle={confirmDoneTitle}
      confirmDoneBody={confirmDoneBody}
      onConfirmDone={handleDone}
    />
  );
};

export default Auth;
