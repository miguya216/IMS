import { createPortal } from "react-dom";
import { useState, useEffect } from "react";
import "/src/css/Modal.css";

const Modal = ({ isOpen, onClose, title, children }) => {
  const [show, setShow] = useState(false);
  const [animatingOut, setAnimatingOut] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShow(true);
      setAnimatingOut(false);
    } else if (show) {
      setAnimatingOut(true);
      setTimeout(() => {
        setShow(false);
        setAnimatingOut(false);
      }, 200); // Match animation duration
    }
  }, [isOpen]);

  // Close modal when Escape key is pressed
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!show) return null;

  return createPortal(
    <div className="form-modal-overlay">
      <div
        className={`form-modal-wrapper ${animatingOut ? "animate-out" : "animate-in"}`}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            onClose();
          }
        }}
      >
        <div className="form-modal-container bg-white shadow">
          {/* Header */}
          <div className="form-modal-header">
            <h5 className="form-modal-title">{title}</h5>
            <button
              type="button"
              className="custom-close-btn"
              onClick={onClose}
            >
              <img src="/resources/imgs/close-btn.png" alt="Close" />
            </button>
          </div>
          {/* Body */}
          <div className="form-modal-body">{children}</div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
