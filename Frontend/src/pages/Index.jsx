// src/pages/Index.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Index() {
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/api/check_session.php", {
      credentials: "include", 
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.loggedIn) {
          const role = data.role;
          if (role === 1) navigate("/Super-Admin/dashboard");
          if (role === 2) navigate("/admin/dashboard");
          else if (role === 3) navigate("/custodians/dashboard");
        } else {
          navigate("/welcome");
        }
      });
  }, []);

  return <div>Redirecting...</div>;
}

export default Index;
