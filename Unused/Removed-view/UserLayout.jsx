import { useEffect, useState } from "react";
import { useNavigate, Routes, Route } from "react-router-dom";
import UserSidebar from "/src/pages/users/UserSidebar";
import UserHeader from "../components/UserHeader";
import Home from "/src/pages/users/Home";
import RoomQrScanning from "/src/pages/users/RoomQrScanning";
import RequestForm from "/src/pages/users/RequestForm";
import RequestHistory from "/src/pages/users/RequestHistory";
import BorrowedItems from "/src/pages/users/BorrowedItems";
import Settings from "/src/pages/users/Settings";


function UserLayout() {
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 992);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    fetch("/api/check_session.php", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.loggedIn || data.role !== 3) {
          navigate("/");
        } else {
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("Error checking session:", err);
        navigate("/");
      });
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="position-relative">
      <UserSidebar 
        isOpen={isMobile ? isSidebarOpen : true}
        closeSidebar={isMobile ? closeSidebar : () => {}}
        isMobile={isMobile}
      />


      {isSidebarOpen && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100"
          style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 999 }}
          onClick={closeSidebar}
        />
      )}

      <div className="main-content" style={{ zIndex: 1 }}>
        <div
          className="main-content"
          style={{
            zIndex: 1,
            marginLeft: isMobile ? 0 : "250px",   // push content on desktop only
            transition: "margin-left 0.3s ease",
          }}
        >
          <UserHeader toggleSidebar={toggleSidebar} isMobile={isMobile} />  
          <Routes>
            <Route path="Home" element={<Home />} />
            <Route path="RoomQrScanning" element={<RoomQrScanning />} />
            <Route path="RequestForm" element={<RequestForm />} />
            <Route path="RequestHistory" element={<RequestHistory />} />
            <Route path="BorrowedItems" element={<BorrowedItems />} />
            <Route path="Settings" element={<Settings />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default UserLayout;
