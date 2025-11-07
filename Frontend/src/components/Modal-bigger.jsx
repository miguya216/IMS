import { createPortal } from "react-dom";
import { useState, useEffect } from "react";
import "/src/css/Modal-bigger.css";

const Modalbigger = ({ isOpen, onClose, title, children, footer }) => {
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

  //  Close on Escape key
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
    <div className="bigger-form-modal-overlay">
      <div
        className="bigger-form-modal-wrapper"
        onClick={(e) => {
          //  close only if click is directly on the wrapper (not inside modal)
          if (e.target === e.currentTarget) {
            onClose();
          }
        }}
      >
        <div
          className={`bigger-form-modal-container ${
            animatingOut ? "animate-out" : "animate-in"
          }`}
        >
          {/* Header */}
          <div className="bigger-form-modal-header">
            <h5 className="bigger-form-modal-title">{title}</h5>
            <button
              type="button"
              className="bigger-custom-close-btn"
              onClick={onClose}
            >
              ✕
            </button>
          </div>

          {/* Body (PDF Preview Area) */}
          <div className="bigger-form-modal-body">{children}</div>

          {/* Footer (Download Buttons, etc.) */}
          {footer && <div className="bigger-form-modal-footer">{footer}</div>}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Modalbigger;
