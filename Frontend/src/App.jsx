// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "/src/pages/Index";
import Login from "/src/pages/Login";
// import AssetHunt from "/src/pages/AssetHunt";
import SuperAdminLayout from "/src/layouts/SuperAdminLayout";
import AdminLayout from "/src/layouts/AdminLayout";
import CustodianLayout from "/src/layouts/CustodianLayout";
import WelcomePage from "/src/pages/Welcome";
import ForgotPassword from "/src/pages/ForgotPassword";
import RecoverAccount from "/src/pages/RecoverAccount";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/welcome" element={<WelcomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/recoveraccount/:token" element={<RecoverAccount />} />
        {/* <Route path="/assethunt" element={<AssetHunt />} /> */}
        <Route path="/Super-Admin/*" element={<SuperAdminLayout />} />
        <Route path="/admin/*" element={<AdminLayout />} />
        <Route path="/custodians/*" element={<CustodianLayout />} />
      </Routes>
    </Router>
  );
}

export default App;
