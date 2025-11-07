// src/pages/admin/ReferenceData.jsx
import React, { useState } from "react";
import TableControls from "/src/components/TableControls.jsx";
import Modal from '/src/components/Modal.jsx';
import ReferenceForm from "/src/pages/Super-admin/forms/ReferenceForm.jsx";
import TransferType from "/src/pages/Super-admin/reference data content/TransferType.jsx";
import Unit from "/src/pages/Super-admin/reference data content/Unit.jsx";
import Brand from "/src/pages/Super-admin/reference data content/Brand.jsx";
import AssetType from "/src/pages/Super-admin/reference data content/AssetType.jsx";
import AssetClassification from "/src/pages/Super-admin/reference data content/AssetClassification";
import Room from "/src/pages/Super-admin/reference data content/Room.jsx";
import AssetCondition from "/src/pages/Super-admin/reference data content/AssetCondition.jsx";
import AcquisitionSource from "/src/pages/Super-admin/reference data content/AcquisitionSource.jsx"
// import Logs from "/src/pages/Super-admin/reference data content/Logs.jsx";

const AccordionItem = ({ id, title, content, isOpen, onToggle }) => {
  const colors = {
    role: "bg-primary bg-opacity-10",
    unit: "bg-success bg-opacity-10",
    brand: "bg-warning bg-opacity-10",
    assettype: "bg-info bg-opacity-10",
    room: "bg-secondary bg-opacity-10",
    assetcondition: "bg-primary bg-opacity-10",
    acquisitionsource: "bg-success bg-opacity-10",
    transfertype: "bg-primary bg-opacity-10",
    assetclassification: "bg-primary bg-opacity-10"
  };

  return (
    <div className="accordion-item mb-2 rounded shadow-sm border-0">
      <h2 className="accordion-header" id={`heading-${id}`}>
        <button
          className={`accordion-button ${!isOpen ? "collapsed" : ""} ${colors[id]}`}
          type="button"
          onClick={() => onToggle(id)}
        >
          {title}
        </button>
      </h2>
      <div
        id={`collapse-${id}`}
        className={`accordion-collapse collapse ${isOpen ? "show" : ""}`}
      >
        <div className="accordion-body bg-white rounded-bottom">
          {content}
        </div>
      </div>
    </div>
  );
};

const ReferenceData = () => {
  const [openId, setOpenId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);

  const handleAddClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleToggle = (id) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="container-fluid py-4">
      <TableControls
        title="Reference Data"
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onAdd={handleAddClick}
        addButtonTitle="Add New reference Data"
      />

      <div className="row">
        <div className="col-md-6">
          <div className="accordion" id="referenceAccordion">
            <AccordionItem
              id="acquisitionsource"
              title="Acquisition Source"
              content={<AcquisitionSource />}
              isOpen={openId === "acquisitionsource"}
              onToggle={handleToggle}
            />
            <AccordionItem
              id="assetclassification"
              title="Asset Classification"
              content={<AssetClassification />}
              isOpen={openId === "assetclassification"}
              onToggle={handleToggle}
            />
             <AccordionItem
              id="brand"
              title="Brand"
              content={<Brand />}
              isOpen={openId === "brand"}
              onToggle={handleToggle}
            />
            <AccordionItem
              id="transfertype"
              title="Transfer Type"
              content={<TransferType />}
              isOpen={openId === "transfertype"}
              onToggle={handleToggle}
            />
          </div>
        </div>
        <div className="col-md-6">
          <div className="accordion" id="referenceAccordion">
             <AccordionItem
              id="assetcondition"
              title="Asset Condition"
              content={<AssetCondition />}
              isOpen={openId === "assetcondition"}
              onToggle={handleToggle}
            />
            <AccordionItem
              id="assettype"
              title="Asset Type"
              content={<AssetType />}
              isOpen={openId === "assettype"}
              onToggle={handleToggle}
            />
             <AccordionItem
              id="room"
              title="Room"
              content={<Room />}
              isOpen={openId === "room"}
              onToggle={handleToggle}
            />
            <AccordionItem
              id="unit"
              title="Unit"
              content={<Unit />}
              isOpen={openId === "unit"}
              onToggle={handleToggle}
            />
            
            </div>
        </div>

        <div className="col-md-6">
          {/* Logs table shown here instead of in accordion */}
          {/* <div className="border rounded p-3 shadow-sm bg-light"> */}
            {/* <Logs /> */}
          {/* </div> */}
        </div>
      </div>
      <Modal isOpen={showModal} onClose={handleCloseModal} title="Add Reference">
        <ReferenceForm />
      </Modal>
    </div>
  );
};

export default ReferenceData;
