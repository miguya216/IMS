// src/pages/admin/ReferenceData.jsx
import React, { useState } from "react";
import TableControls from "/src/components/TableControls.jsx";
import Modal from '/src/components/Modal.jsx';
import ReferenceForm from "/src/pages/Super-admin/forms/ReferenceForm.jsx";
import RoleArchive from "/src/pages/Super-admin/reference data content/RoleArchive.jsx";
import UnitArchive from "/src/pages/Super-admin/reference data content/UnitArchive.jsx";
import BrandArchive from "/src/pages/Super-admin/reference data content/BrandArchive.jsx";
import AssetTypeArchive from "/src/pages/Super-admin/reference data content/AssetTypeArchive.jsx";
import RoomArchive from "/src/pages/Super-admin/reference data content/RoomArchive.jsx";
import Logs from "/src/pages/Super-admin/reference data content/Logs.jsx";

const AccordionItem = ({ id, title, content, isOpen, onToggle }) => {
  const colors = {
    role: "bg-primary bg-opacity-10",
    unit: "bg-success bg-opacity-10",
    brand: "bg-warning bg-opacity-10",
    assettype: "bg-info bg-opacity-10",
    room: "bg-secondary bg-opacity-10",
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


  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleToggle = (id) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="container-fluid py-4">
         <TableControls
        title="Archive Reference Data"
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <div className="row">
        <div className="col-md-6">
          <div className="accordion" id="referenceAccordion">
            <AccordionItem
              id="role"
              title="Role"
              content={<RoleArchive />}
              isOpen={openId === "role"}
              onToggle={handleToggle}
            />
            <AccordionItem
              id="unit"
              title="Unit"
              content={<UnitArchive />}
              isOpen={openId === "unit"}
              onToggle={handleToggle}
            />
            <AccordionItem
              id="brand"
              title="Brand"
              content={<BrandArchive />}
              isOpen={openId === "brand"}
              onToggle={handleToggle}
            />
            <AccordionItem
              id="assettype"
              title="Asset Type"
              content={<AssetTypeArchive />}
              isOpen={openId === "assettype"}
              onToggle={handleToggle}
            />
            <AccordionItem
              id="room"
              title="Room"
              content={<RoomArchive />}
              isOpen={openId === "room"}
              onToggle={handleToggle}
            />
          </div>
        </div>
        <div className="col-md-6">
          {/* Logs table shown here instead of in accordion */}
          <div className="border rounded p-3 shadow-sm bg-light">
            <Logs />
          </div>
        </div>
      </div>
      <Modal isOpen={showModal} onClose={handleCloseModal} title="Add Reference">
        <ReferenceForm />
      </Modal>
    </div>
  );
};

export default ReferenceData;
