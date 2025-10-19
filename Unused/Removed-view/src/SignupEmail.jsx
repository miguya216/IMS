import React, { useState } from "react";
import Popups from "/src/components/Popups.jsx";

const SignupEmail = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [showConfirmDone, setShowConfirmDone] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [confirmDoneTitle, setConfirmDoneTitle] = useState("");
  const [confirmDoneBody, setConfirmDoneBody] = useState(""); 

  // Only allow a-z, A-Z, 0-9
  const validateEmail = (input) => {
    const regex = /^[a-zA-Z0-9]+@kld\.edu\.ph$/;
    return regex.test(input);
  };

  const handleInputChange = (e) => {
    // Only keep valid characters: letters and numbers
    const sanitized = e.target.value.replace(/[^a-zA-Z0-9]/g, "");
    setEmail(sanitized);
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  const fullEmail = `${email}@kld.edu.ph`;

  if (!validateEmail(fullEmail)) {
    setConfirmDoneTitle("Invalid Input");
    setConfirmDoneBody("Only letters and numbers are allowed (e.g., fsmlastname)");
    setShowConfirmDone(true);
    return;
  }

  setShowLoading(true);

  try {
    const response = await fetch("/api/Signup-Auth/signup_esender.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: fullEmail }),
    });

    const result = await response.json();

    if (response.ok && result.success) {
      setConfirmDoneTitle("Email Sent");
      setConfirmDoneBody("Sign Up request sent! Please check your email.");
    } else {
      // Backend 409 Conflict or other failure
      setConfirmDoneTitle("Request Failed");
      setConfirmDoneBody(result.error || "Something went wrong.");
    }
  } catch (err) {
    setConfirmDoneTitle("Connection Error");
    setConfirmDoneBody("Failed to connect to the server.");
  }

  setShowLoading(false);
  setShowConfirmDone(true);
};

const handleDone = () => {
  setShowConfirmDone(false);
  if (confirmDoneTitle === "Email Sent") {
    onClose(); // close modal only after successful send
  }
};

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor="email" className="form-label">
          School Email
        </label>
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            id="email"
            placeholder="fsmlastname"
            value={email}
            onChange={handleInputChange}
            required
          />
          <span className="input-group-text bg-light">@kld.edu.ph</span>
        </div>
        {error && <small className="text-danger">{error}</small>}
      </div>
      <button
        type="submit"
        className="btn btn-form-green"
      >
        Submit
      </button>
    <Popups
        showConfirmDone={showConfirmDone}
        onConfirmDone={handleDone}
        confirmDoneTitle={confirmDoneTitle}
        confirmDoneBody={confirmDoneBody}
        showLoading={showLoading}
      />


    </form>
    
  );
};

export default SignupEmail;
