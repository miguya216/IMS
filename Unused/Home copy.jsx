import React from 'react'; // make sure this path is correct
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <>
      <div className="app-top">
        <div className="stats-card">
          <div className="stats-details">
            <div>
              <p className="mb-1">Borrower Behavior</p>
              <h4>--</h4>
            </div>
            <div>
              <p className="mb-1">Borrow Points</p>
              <h4>--</h4>
            </div>
          </div>
          <p className="mt-3 fw-bold">Currently Borrow</p>
          <div className="mt-2 small">--</div>
        </div>
      </div>

      <div className="app-bottom">
        <Link to="/users/roomqrscanning" className="app-btn">
          <div className="btn-img-wrapper">
            <img src="/resources/imgs/qr-code.png" alt="qr-scan" />
          </div>
          <div className="btn-label">Asset Hunt</div>
        </Link>
        <Link to="/users/requestform" className="app-btn">
          <div className="btn-img-wrapper">
            <img src="/resources/imgs/request_icon.png" alt="qr-scan" />
          </div>
          <div className="btn-label">Request Item</div>
        </Link>
        <Link to="/users/requesthistory" className="app-btn">
          <div className="btn-img-wrapper">
            <img src="/resources/imgs/history.png" alt="qr-scan" />
          </div>
          <div className="btn-label">Request History</div>
        </Link>
        <Link to="/users/BorrowedItems" className="app-btn">
          <div className="btn-img-wrapper">
            <img src="/resources/imgs/borrow.png" alt="qr-scan" />
          </div>
          <div className="btn-label">Borrowed Items</div>
        </Link>
        <Link to="/users/settings" className="app-btn">
          <div className="btn-img-wrapper">
            <img src="/resources/imgs/settings.png" alt="qr-scan" />
          </div>
          <div className="btn-label">Settings</div>
        </Link>
        <button className="app-btn">
          <div className="btn-img-wrapper">
            <img src="/resources/imgs/about.png" alt="qr-scan" />
          </div>
          <div className="btn-label">About</div>
        </button>
      </div>

    </>
  );
};

export default Home;
