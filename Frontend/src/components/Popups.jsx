// src/components/Popups.jsx

import { useEffect } from "react";
import { Modal, Button, Spinner } from "react-bootstrap";

function Popups({
  // 1. Confirmation (Yes/No)
  showConfirmYesNo,
  confirmYesNoTitle = "Are you sure?",
  confirmYesNoBody = "This action cannot be undone.",
  confirmYesLabel = "Yes",
  confirmNoLabel = "No",
  onConfirmYes,
  onConfirmNo,

  // 2. Confirmation (Done)
  showConfirmDone,
  confirmDoneTitle = "Action Completed",
  confirmDoneBody = "Everything was successful.",
  confirmDoneLabel = "Done",
  onConfirmDone,
  confirmDoneHtml = false,

  // 3. Loading
  showLoading,
  loadingText = "Processing, please wait...",
  loadingContent,

  // 4. Response
  showResponse,
  responseTitle = "System Message",
  responseMessage = "",
  onCloseResponse,
}) {
  // Auto-close response after 3s
  useEffect(() => {
    if (showResponse) {
      const timer = setTimeout(() => {
        onCloseResponse();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showResponse, onCloseResponse]);

  return (
    <>
      {/* 1. Confirmation Popup (Yes/No) */}
      <Modal
        show={showConfirmYesNo}
        onHide={onConfirmNo}
        centered
        backdrop={true}      //  allow outer click
        keyboard={true}      //  allow Escape
        dialogClassName="custom-confirm-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>{confirmYesNoTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{confirmYesNoBody}</Modal.Body>
        <Modal.Footer>
          <Button className="btn-custom-yellow" onClick={onConfirmNo}>
            {confirmNoLabel}
          </Button>
          <Button className="btn-custom-yellow" onClick={onConfirmYes}>
            {confirmYesLabel}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* 2. Confirmation Popup (Done only) */}
      <Modal
        show={showConfirmDone}
        onHide={onConfirmDone}
        centered
        backdrop={true}      // allow outer click
        keyboard={true}      // allow Escape
        dialogClassName="custom-confirm-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>{confirmDoneTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {confirmDoneHtml ? (
            <div dangerouslySetInnerHTML={{ __html: confirmDoneBody }} />
          ) : (
            confirmDoneBody
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button className="btn-custom-yellow" onClick={onConfirmDone}>
            {confirmDoneLabel}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* 3. Loading Popup (intentionally no close on Escape or backdrop) */}
      <Modal
        show={showLoading}
        backdrop="static"    // keep it static, so user can’t dismiss
        keyboard={false}
        centered
        dialogClassName="custom-confirm-modal"
      >
        <Modal.Body className="text-center py-5">
          <img 
            src="/resources/imgs/loading.gif"  // <-- put your gif path here
            alt="Loading..."
            style={{ width: "80px", height: "80px" }} 
          />
          <div className="mt-3">
            {loadingContent ? loadingContent : loadingText}
          </div>
        </Modal.Body>
      </Modal>

      {/* 4. Response Popup (auto-closing) */}
      <Modal
        show={showResponse}
        onHide={onCloseResponse}
        centered
        backdrop={true}      // allow outer click
        keyboard={true}      // allow Escape
        dialogClassName="custom-confirm-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>{responseTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center py-4">{responseMessage}</Modal.Body>
      </Modal>
    </>
  );
}

export default Popups;
