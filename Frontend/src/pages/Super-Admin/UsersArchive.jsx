import React, { useEffect, useState } from "react";
import TableControls from "/src/components/TableControls";
import Pagination from "/src/components/Pagination";
import Modal from '/src/components/Modal.jsx'
import UserForm from '/src/pages/Super-admin/forms/UserForm.jsx'
import UserDetails from '/src/pages/Super-admin/forms/UserDetails.jsx'
import Popups from '/src/components/Popups.jsx';
import Modalbigger from "/src/components/Modal-bigger"; 
import { generateAccountabilityPDF } from "/src/pages/Super-admin/forms/functions/GenerateAccountabilityPDF.jsx";
import { generatePARPDF } from "/src/pages/Super-admin/forms/functions/GeneratePARPDF.jsx";
import { generateICSPDF } from "/src/pages/Super-admin/forms/functions/GenerateICSPDF.jsx";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [UserToDelete, setUserToDelete] = useState(null);
  const [showConfirmYesNo, setShowConfirmYesNo] = useState(false);
  const [showResponse, setShowResponse] = useState(false);
  const [responseTitle, setResponseTitle] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [showPdfPreview, setShowPdfPreview] = useState(false);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedPDFName, setSelectedPDFName] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  const handlerAddUser = () => {
    setModalMode("add");
    setSelectedUser(null);
    setShowModal(true);
  };

  const handleMoreClick = (user_ID) => {
    setModalMode("view");
    setSelectedUser(user_ID); 
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedUser(null);
    setModalMode("");
  };

  const handleDeleteClick = (user_ID) => {
    setUserToDelete(user_ID);
    setShowConfirmYesNo(true);
  };

  const confirmDelete = () => {
    setShowConfirmYesNo(false);

    fetch(`/api/User-Handlers/restore_user.php?id=${UserToDelete}`, {
      method: "POST",
    })
      .then((res) => res.json())
      .then((data) => {
        setResponseTitle("✅ User Restoration");
        setResponseMessage(data.message || "User deleted successfully.");
        setShowResponse(true);
        setUsers((prev) => prev.filter((user) => user.user_ID !== UserToDelete));
      })
      .catch((err) => {
        console.error("Delete failed:", err);
        setResponseTitle("❌ User Restoration");
        setResponseMessage("Failed to delete user.");
        setShowResponse(true);
      });
  };

  const cancelDelete = () => {
    setUserToDelete(null);
    setShowConfirmYesNo(false);
  };

  const fetchUsers = () => {
     fetch("/api/fetch_data.php?action=usersarchive")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
        setLoading(false);
      });
  }

  useEffect(() => {
    fetchUsers();
    window.reloadUserTable = () => {
      setLoading(true);
      fetchUsers();
    };
    return () => {
      delete window.reloadUserTable;
    };
  }, []);

  useEffect(() => {
    const filtered = users.filter((user) =>
      Object.values(user)
        .join(" ")
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );
    setFilteredUsers(filtered);
    setCurrentPage(1);
  }, [searchQuery, users]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  // Unified PDF Preview Handler
  const handlePDFPreview = async (type, user_ID) => {
    try {
      if (pdfPreviewUrl) URL.revokeObjectURL(pdfPreviewUrl);

      let result = null;
      if (type === "EAF") result = await generateAccountabilityPDF(user_ID);
      if (type === "PAR") result = await generatePARPDF(user_ID);
      if (type === "ICS") result = await generateICSPDF(user_ID);

      if (result) {
        setPdfPreviewUrl(result.url);
        setSelectedPDFName(result.filename);
        setShowPdfPreview(true);
      } else {
        console.error(`Failed to generate ${type} PDF`);
      }
    } catch (err) {
      console.error("PDF preview error:", err);
    }
  };

  return (
    <div className="container-fluid">
      <TableControls
        title="Users Archive"
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onAdd={handlerAddUser}
        onFilter={() => console.log("Filter users")}
        searchPlaceholder="Search users..."
        searchInputTitle="Search by KLD ID, name or unit"
      />

      {loading ? (
        <>
          <div className="loading-data">
              <p>loading</p>
              <img 
                src="/resources/imgs/loading.gif"
                alt="Loading..."
                style={{ width: "40px", height: "40px" }}  
              />
          </div>
        </>
      ) : currentItems.length === 0 ? (
        <p className="text-center text-muted">No matching users found.</p>
      ) : (
        <>
          <div className="custom-table-wrapper">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>KLD ID</th>
                  <th>Name</th>
                  <th>Unit</th>
                  <th>Role</th>
                  <th>EAF</th>
                  <th>PAR</th>
                  <th>ICS</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((user) => (
                  <tr 
                    key={user.user_ID}
                    className={selectedRow === user.user_ID ? "selected-row" : ""}
                  >
                    <td data-label="KLD ID">{user.kld_id}</td>
                    <td data-label="Name">{user.full_name}</td>
                    <td data-label="Unit">{user.unit}</td>
                    <td className="highlight-data" data-label="Role">{user.role}</td>

                    <td data-label="EAF">
                      <div className="action-btn-group">
                         <button
                            title="Employee Accountability Form"
                            className="action-btn"
                            onClick={() => {
                              handlePDFPreview("EAF", user.user_ID);
                              setSelectedRow(user.user_ID);
                            }}
                          >
                            <img
                              src="/resources/imgs/pdf-icon.png"
                              alt="EAF PDF"
                              className="action-icon"
                            />
                          </button>
                      </div>
                    </td>

                    <td data-label="PAR">
                      <div className="action-btn-group">
                        <button
                          title="Property Acknowledgement Receipt"
                          className="action-btn"
                          onClick={() => {
                            handlePDFPreview("PAR", user.user_ID);
                            setSelectedRow(user.user_ID);
                          }}
                        >
                          <img
                            src="/resources/imgs/pdf-icon-green.png"
                            alt="PAR PDF"
                            className="action-icon"
                          />
                        </button>
                      </div>
                    </td>

                    <td data-label="ICS">
                      <div className="action-btn-group">
                          <button
                            title="Inventory Custodian Slip"
                            className="action-btn"
                            onClick={() => {
                              handlePDFPreview("ICS", user.user_ID);
                              setSelectedRow(user.user_ID);
                            }}
                          >
                            <img
                              src="/resources/imgs/pdf-icon-yellow.png"
                              alt="ICS PDF"
                              className="action-icon"
                            />
                          </button>
                      </div>
                    </td>

                    <td data-label="Action">
                      <div className="action-btn-group">
                        <button
                          title="More"
                          className="action-btn"
                          onClick={() => {
                            handleMoreClick(user.user_ID);
                            setSelectedRow(user.user_ID);
                          }}
                        >
                          <img
                            src="/resources/imgs/detail.png"
                            alt="More"
                            className="action-icon"
                          />
                        </button>

                        <button 
                          title="Restore User"
                          className="action-btn"
                          onClick={() => {
                            handleDeleteClick(user.user_ID);
                            setSelectedRow(user.user_ID);
                          }}
                        >
                          <img
                            src="/resources/imgs/restore.png"
                            alt="restore"
                            className="action-icon"
                          />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}

      {/* Add/Edit User Modal */}
      {showModal && (
        <Modal
          isOpen={true}
          onClose={handleCloseModal}
          title={modalMode === "view" ? "User Details" : "Add User"}
        >
          {modalMode === "view" ? (
            <UserDetails user_ID={selectedUser} fetchUsers={fetchUsers} />
          ) : (
            <UserForm onClose={handleCloseModal} fetchUsers={fetchUsers} />
          )}
        </Modal>
      )}

      {/* PDF Preview Modal */}
      <Modalbigger
        isOpen={showPdfPreview}
        onClose={() => setShowPdfPreview(false)}
        title="PDF Preview"
        footer={
          <button
            className="btn btn-form-green"
            onClick={() => {
              const link = document.createElement("a");
              link.href = pdfPreviewUrl;
              link.download = selectedPDFName;
              link.click();
            }}
          >
            Download PDF
          </button>
        }
      >
        <div style={{ height: "80vh" }}>
          {pdfPreviewUrl && (
            <iframe
              src={pdfPreviewUrl}
              title="PDF Preview"
              width="100%"
              height="100%"
              style={{ border: "none" }}
            />
          )}
        </div>
      </Modalbigger>

      {/* Popups */}
      <Popups
        showConfirmYesNo={showConfirmYesNo}
        confirmYesNoTitle="⚠️ Confirm Restore User"
        confirmYesNoBody="Are you sure you want to restore this user?"
        confirmYesLabel="Yes, Restore"
        confirmNoLabel="Cancel"
        onConfirmYes={confirmDelete}
        onConfirmNo={cancelDelete}
        showResponse={showResponse}
        responseTitle={responseTitle}
        responseMessage={responseMessage}
        onCloseResponse={() => setShowResponse(false)}
      />
    </div>
  );
};

export default Users;
