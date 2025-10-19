// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
// import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import "/src/css/Layout-BG.css";
import "/src/css/Sidebar.css";
import "/src/css/Tables.css";
import "/src/css/Popups.css";

import { WebSocketProvider } from "/src/layouts/context/WebSocketProvider.jsx"; 


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <WebSocketProvider>
      <div className="main-bg">
        <App />
      </div>
    </WebSocketProvider>
  </React.StrictMode>
)
