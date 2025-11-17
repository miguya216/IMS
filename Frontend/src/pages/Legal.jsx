// src/pages/Legal.jsx
import { useNavigate } from "react-router-dom";
import "/src/css/Login.css";
import "/src/css/legal.css";

function Legal() {
  const navigate = useNavigate();
  return (
    <div className="login-body legal-page">
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

      <div className="legal-content-container">
        <h1 className="legal-title">TERMS AND CONDITIONS</h1>
        <p><strong>CLARITY – College Logistics Asset Registry & Inventory Tracking</strong><br/>
        Developed for the Property and Procurement Services Unit (PPSU)<br/>
        Kolehiyo ng Lungsod ng Dasmariñas<br/>
        <em>Last Updated: November 15, 2025</em></p>

        <hr/>

        <h2>1. Introduction</h2>
        <p>Welcome to CLARITY (College Logistics Asset Registry & Inventory Tracking). By accessing and using this system, you agree to the following Terms and Conditions. These terms apply to all authorized personnel of the institution.<br/>
        CLARITY is developed to support the Property and Procurement Services Unit (PPSU) in managing institutional assets, monitoring transactions, tracking inventory, and maintaining audit-ready records.<br/>
        The use of this system is governed by the Data Privacy Act of 2012 (RA 10173), relevant IRRs, and institutional policies.</p>

        <h2>2. User Eligibility</h2>
        <p>The CLARITY system is intended exclusively for authorized PPSU personnel, designated college departments, faculty, and administrative offices of Kolehiyo ng Lungsod ng Dasmariñas.<br/>
        Users must have an official institutional account. Unauthorized access and credential sharing are strictly forbidden.</p>

        <h2>3. Purpose of the System</h2>
        <ul>
          <li><strong>Asset Management</strong> – Creation, updating, and monitoring of institutional assets.</li>
          <li><strong>Assigned Assets</strong> – Viewing assets assigned to specific personnel or departments.</li>
          <li><strong>Room Management & Room List</strong> – Tracking room inventories, including installed and movable assets.</li>
          <li><strong>Asset Hunt</strong> – Locating or reconciling missing, misplaced, or unaccounted assets.</li>
          <li><strong>Forms</strong>
            <ul>
              <li>Requisition and Issuance – Processing requests for the release or issuance of assets.</li>
              <li>Reservation and Borrowing – Recording temporary borrowings and returns.</li>
            </ul>
          </li>
          <li><strong>Audit & Activity Logs</strong> – Tracking user actions for transparency and accountability.</li>
          <li><strong>Transfer Records</strong> – Documenting movement of assets between locations or responsible personnel.</li>
          <li><strong>Inspection Records</strong> – Logging inspection results, asset conditions, and maintenance reports.</li>
          <li><strong>Room Assignation Records</strong> – Tracking room allocations, assigned officers, and asset distribution.</li>
          <li><strong>Settings</strong> – Managing roles, permissions, system configurations, and account details.</li>
        </ul>

        <h2>4. Data Privacy and Protection</h2>
        <p>In compliance with the Data Privacy Act of 2012, CLARITY ensures the confidentiality, integrity, and availability of all stored personal and organizational data.</p>

        <h3>4.1 Personal Data Collected</h3>
        <ul>
          <li>User information (name, role, department, email)</li>
          <li>Submitted forms, requests, and transaction history</li>
          <li>Logs of actions and system interactions</li>
          <li>Asset-related entries linked to the user</li>
        </ul>

        <h3>4.2 Purpose of Data Collection</h3>
        <ul>
          <li>Support PPSU asset management operations</li>
          <li>Validate user transactions</li>
          <li>Maintain transparency and auditability</li>
          <li>Improve accountability in asset and inventory workflows</li>
        </ul>

        <h3>4.3 Data Access and Sharing</h3>
        <p>Access is role-based and limited to authorized PPSU and institutional personnel.<br/>
        Data will not be shared externally unless:<br/>
        • Required by law<br/>
        • Necessary for investigations or auditing<br/>
        • Permitted by KLD policy</p>

        <h3>4.4 Data Retention</h3>
        <p>Records will be retained according to PPSU and institutional retention policies, subject to periodic archiving or purging as mandated.</p>

        <h3>4.5 User Responsibilities</h3>
        <ul>
          <li>Keep login credentials secure</li>
          <li>Ensure accuracy of all submitted data</li>
          <li>Report suspicious activity or system issues promptly</li>
          <li>Avoid unauthorized access or data manipulation</li>
        </ul>

        <h2>5. Acceptable Use Policy</h2>
        <p>Users agree NOT to:</p>
        <ul>
          <li>Enter false or misleading data</li>
          <li>Tamper with records without proper authorization</li>
          <li>Exploit system features for personal gain</li>
          <li>Attempt unauthorized access or system manipulation</li>
          <li>Interfere with PPSU workflows or inventory processes</li>
        </ul>

        <h2>6. System Availability and Updates</h2>
        <p>PPSU or system administrators may conduct updates, patches, or maintenance. Temporary downtime may occur.<br/>
        PPSU is not liable for:<br/>
        • System interruptions<br/>
        • Network or power issues<br/>
        • Loss of data due to user negligence</p>

        <h2>7. Accuracy of Information</h2>
        <p>Users are responsible for ensuring that all:<br/>
        • Requisition forms<br/>
        • Borrowing records<br/>
        • Inspection logs<br/>
        • Room or asset entries<br/>
        • Transfer records<br/>
        are accurate and truthful.<br/>
        Any inconsistencies caused by user error fall under user responsibility.</p>

        <h2>8. Activity Logging and Monitoring</h2>
        <p>For audit and security purposes, CLARITY automatically logs:<br/>
        • Logins and authentication attempts<br/>
        • Submitted forms and asset changes<br/>
        • Edits, deletions, and viewing of records<br/>
        • Navigation activity within modules<br/>
        Logs are subject to monitoring by PPSU and system administrators.</p>

        <h2>9. Intellectual Property</h2>
        <p>All system components—including software, UI/UX design, data structure, documentation, and digital assets—are the intellectual property of the Property and Procurement Services Unit (PPSU) and the Kolehiyo ng Lungsod ng Dasmariñas.<br/>
        Unauthorized copying, modification, reverse-engineering, or distribution is strictly prohibited.</p>

        <h2>10. Termination of Access</h2>
        <p>PPSU reserves the right to suspend or revoke user access if:<br/>
        • A user violates these Terms<br/>
        • Unauthorized activity is detected<br/>
        • Employment or institutional affiliation ends<br/>
        • Required by administrative or legal directive</p>

        <h2>11. Limitation of Liability</h2>
        <p>PPSU is not liable for:<br/>
        • User errors<br/>
        • Deliberate misuse of the system<br/>
        • Unauthorized access due to compromised passwords<br/>
        • Damages caused by external cyber threats beyond standard security measures</p>

        <h2>12. Changes to Terms and Conditions</h2>
        <p>PPSU may revise or update these Terms as needed. Continued use of the system constitutes agreement to the updated Terms.</p>

        <h2>13. Contact Information</h2>
        <p>For concerns, assistance, or data privacy inquiries, contact:<br/>
        Property and Procurement Services Unit (PPSU)<br/>
        Kolehiyo ng Lungsod ng Dasmariñas<br/>
        gpevangelista@kld.edu.ph</p>

        
        <button className="back-btn" onClick={() => navigate("/login")}>
          ← Back
        </button>
      </div>
    </div>
  );
}

export default Legal;