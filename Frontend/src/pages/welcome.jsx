import React from "react";
import "/src/css/welcome.css";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const WelcomePage = () => {
  const navigate = useNavigate();

  const fadeUp = {
    hidden: { opacity: 0, y: 60, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  

  return (
    <div className="welcome-page">
        {/* Top Left Logo + Title */}
        <header className="welcome-header">
          <div className="logo-container">
            <img src="/resources/imgs/KLDlogo.png" alt="IMS Logo" className="logo" />
            <span className="logo-text">IMS | CLARITY</span>
          </div>
        </header>
        {/* Hero Section */}
        <motion.section
          className="hero full-screen"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.8 }}
        >
          <div className="hero-container">
            {/* Left: Text */}
            <motion.div className="hero-text" variants={fadeUp}>
              <motion.h1 variants={fadeUp} className="hero-title">
                Welcome to <span>CLARITY</span>
              </motion.h1>
              <motion.h3 variants={fadeUp} className="hero-subtitle">
                College Logistics Asset Registry & Inventory Tracking
              </motion.h3>
              <motion.p variants={fadeUp} className="hero-desc">
                Developed by the Institute of Computing and Digital Innovation (ICDI){" "}
                Kolehiyo ng Lungsod ng Dasmariñas
              </motion.p>

              {/* Buttons row */}
              <motion.div className="hero-buttons" variants={fadeUp}>
                <motion.button
                  className="hero-button"
                  onClick={() => navigate("/login")}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Launch Dashboard
                </motion.button>
              </motion.div>
            </motion.div>

          {/* Right: Images Bouquet */}
          <motion.div className="hero-image" variants={fadeUp}>
            <div className="image-bouquet">
              <img src="/resources/imgs/laptop.png" alt="Laptop" className="bouquet-item item1" />
              <img src="/resources/imgs/erlenmeyer-flask.png" alt="Erlenmeyer Flask" className="bouquet-item item2" />
              <img src="/resources/imgs/keyboard.png" alt="Keyboard" className="bouquet-item item3" />
              <img src="/resources/imgs/monitor.png" alt="Monitor" className="bouquet-item item4" />
              <img src="/resources/imgs/mouse.png" alt="Mouse" className="bouquet-item item5" />
              <img src="/resources/imgs/sphygmomanometer.png" alt="Sphygmomanometer" className="bouquet-item item6" />
              <img src="/resources/imgs/speaker.png" alt="Speaker" className="bouquet-item item7" />
              <img src="/resources/imgs/stethoscope.png" alt="Stethoscope" className="bouquet-item item8" />
              <img src="/resources/imgs/tsquare.png" alt="T-square" className="bouquet-item item9" />
            </div>
          </motion.div>
          </div>
        </motion.section>
        
   <motion.section
      className="feature-section"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: 0.3 }
        }
      }}
    >
      <h2 className="text-center" style={{ fontSize: "2.5rem", marginBottom: "60px" }}>
        Key Features
      </h2>

      {/* Feature 1 */}
      <motion.div
        className="feature-item"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }} // triggers when 20% of item is visible
      >
        <div className="feature-image">
          <img src="/resources/imgs/speaker.png" alt="Asset Tracking" />
        </div>
        <div className="feature-text">
          <h3>Asset Tracking</h3>
          <p>
            Maintain detailed records of each asset’s type, brand, Property Tag,
            condition, and location—complete with barcode and QR code integration.
          </p>
        </div>
      </motion.div>

      {/* Feature 2 */}
      <motion.div
        className="feature-item reverse"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }} // triggers when 20% of item is visible
      >
        <div className="feature-image">
          <img src="/resources/imgs/monitor.png" alt="Room & Unit Mapping" />
        </div>
        <div className="feature-text">
          <h3>Room & Unit Mapping</h3>
          <p>
            Assign and locate assets per room using unique QR codes. Organize users
            by departments or units for clear accountability.
          </p>
        </div>
      </motion.div>

      {/* Feature 3 */}
      <motion.div
        className="feature-item"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }} // triggers when 20% of item is visible
      >
        <div className="feature-image">
          <img src="/resources/imgs/stethoscope.png" alt="Role-based Access" />
        </div>
        <div className="feature-text">
          <h3>Role-based Access</h3>
          <p>
            Secure the system with user roles, account management, and soft-deletion
            support to maintain data integrity without losing history.
          </p>
        </div>
      </motion.div>

      {/* Feature 4 */}
      <motion.div
        className="feature-item reverse"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }} // triggers when 20% of item is visible
      >
        <div className="feature-image">
          <img src="/resources/imgs/tsquare.png" alt="Borrow & Request Flow" />
        </div>
        <div className="feature-text">
          <h3>Borrow & Request Flow</h3>
          <p>
            Users can request, borrow, and return assets with expected due dates.
            Admins track borrowing behavior and approve or reject requests in real time.
          </p>
        </div>
      </motion.div>
    </motion.section>

    {/* CTA Section */}
    <motion.section
      className="cta-section"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={fadeUp}
    >
      <h2 className="cta-title">Start Managing</h2>
      <p className="cta-subtitle">
        Whether you're an admin overseeing hundreds of assets or a custodian
        borrowing a device, our IMS keeps everything organized and traceable.
      </p>

      <motion.button
        className="cta-button"
        onClick={() => navigate("/login")}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
      >
        Get Started
      </motion.button>
    </motion.section>


    </div>
  );
};

export default WelcomePage;
