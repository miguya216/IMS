import { FaBars, FaBell, FaCog } from 'react-icons/fa';

const Header = ({ toggleSidebar, isMobile}) => {
  return (
    <nav
      className="user-navbar-sticky px-4 py-3"
    >
      <div className="d-flex align-items-center">
        {isMobile && (
          <FaBars
            className="me-3"
            size={24}
            style={{ cursor: "pointer", color: "black" }}
            onClick={toggleSidebar}
          />
        )}

        <img
          src={'/resources/imgs/KLDlogo.png'}
          alt="Logo"
          style={{ width: '38px', height: '38px' }}
          className="me-3"
        />
        <span className="fw-bold" style={{ fontSize: '1.25rem', color: 'black' }}>
          IMS | CLARITY
        </span>
      </div>

      <div>
        <FaBell className="me-4" size={20} style={{ cursor: 'pointer', color: 'black' }} />
      </div>
    </nav>
  );
};

export default Header;
