import React, { useEffect, useState } from "react";

const ConnectionNotifier = () => {
  const [status, setStatus] = useState(navigator.onLine ? "online" : "offline");
  const [slowNetwork, setSlowNetwork] = useState(false);
  const [showBackOnline, setShowBackOnline] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      if (status === "offline") {
        // Only show back online if previously offline
        setShowBackOnline(true);
        setTimeout(() => setShowBackOnline(false), 3000); // fade out after 3s
      }
      setStatus("online");
    };

    const handleOffline = () => setStatus("offline");

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    if ("connection" in navigator) {
      const checkConnection = () => {
        const { effectiveType } = navigator.connection;
        setSlowNetwork(effectiveType.includes("2g") || effectiveType.includes("slow-2g"));
      };
      navigator.connection.addEventListener("change", checkConnection);
      checkConnection();
      return () => navigator.connection.removeEventListener("change", checkConnection);
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [status]);

  const show = status === "offline" || (slowNetwork && status === "online") || showBackOnline;

  let message = "";
  let bgColor = "";

  if (status === "offline") {
    message = "⚠️ No internet connection";
    bgColor = "#670000"; // red
  } else if (slowNetwork && status === "online") {
    message = "⚠️ Your network connection is slow";
    bgColor = "#ffea00"; // orange
  } else if (showBackOnline) {
    message = "✅ Back online!";
    bgColor = "#006705"; // green
  } else {
    return null;
  }

  return (
    <div
      style={{
        position: "fixed",
        top: show ? "20px" : "-60px", 
        left: "50%",                  
        transform: "translateX(-50%)", 
        padding: "10px 15px",
        backgroundColor: bgColor,
        color: "white",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
        fontWeight: "bold",
        fontSize: "14px",
        fontFamily: "Arial, sans-serif",
        transition: "bottom 0.3s ease-in-out, opacity 0.3s",
        opacity: show ? 1 : 0,
        zIndex: 9999,
        minWidth: "200px",
        textAlign: "center",
      }}
    >
      {message}
    </div>
  );
};

export default ConnectionNotifier;
