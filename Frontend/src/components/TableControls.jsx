import React, { useMemo } from "react";
import { FaPlus, FaDownload, FaFileImport } from "react-icons/fa";
import { useLocation } from "react-router-dom";

const TableControls = ({
  title = "",
  searchQuery,
  setSearchQuery,
  onAdd,
  onExport,
  onImport,
  showImportButton = false,
  searchPlaceholder = "Search...",

  // Tooltip props (customizable per page)
  addButtonTitle = "Add",
  exportButtonTitle = "Export data",
  importButtonTitle = "Import data",
  searchInputTitle = "Type to search",
}) => {
  const { pathname } = useLocation();

  const flags = useMemo(() => {
    const path = pathname.toLowerCase();
    return {
      isAssetPage: path.includes("assets"),
      isAssetArchive: path.includes("assetsarchive"),
      isUserArchive: path.includes("usersarchive"),
      isRefArchive: path.includes("referencearchive"),
      isReferencePage: path.includes("referencedata"),
      isRequestHistory: path.includes("requesthistory"),
      isBorrowedItems: path.includes("borroweditems"),
      isStandardRequest: path.includes("standardrequest"),
      isCheckOutItems: path.includes("checkoutitems"),
      isRoomList: path.includes("roomlist"),
      isCustodianAsset: path.includes("custodians/assets"),
      isCustodianRoomList: path.includes("custodians/roomlist"),
      isConsumables: path.includes("consumables"),
      isConsumablesArchive: path.includes("consumablesarchive"),
      isAuditPTR: path.includes("auditptr"),
      isAuditIIR: path.includes("auditiir"),
      isRISAdmin: path.includes("admin/requisitionissuance"),
      isActivityLogs: path.includes("activitylogs"),
      isAuditRoomAssignation: path.includes("auditroomassignation"),
      isActivityLogsCard: path.includes("activitylogscard"),
      // isCustodianSettings: path.includes("custodiansettings"),
    };
  }, [pathname]);

  const hideSearchInput = flags.isRefArchive || flags.isReferencePage;
  const hideAddButton =
    flags.isCheckOutItems ||
    flags.isStandardRequest ||
    flags.isAssetArchive ||
    flags.isUserArchive ||
    flags.isRefArchive ||
    flags.isRequestHistory ||
    flags.isBorrowedItems ||
    flags.isConsumablesArchive ||
    flags.isCustodianAsset ||
    flags.isCustodianRoomList ||
    flags.isAuditPTR ||
    flags.isAuditIIR ||
    flags.isRISAdmin ||
    flags.isActivityLogs ||
    flags.isAuditRoomAssignation ||
    flags.isActivityLogsCard;
    // flags.isCustodianSettings;

  const hideDownloadButton = flags.isCustodianAsset;
  const hideImportButton = flags.isCustodianAsset;

  return (
    <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-3">
      <h3 className="mb-0 fw-bold">{title}</h3>
      <div className="d-flex flex-column flex-sm-row align-items-stretch gap-2">
        {!hideSearchInput && (
          <div className="position-relative">
            <input
              type="text"
              className="form-control w-auto border border-dark pe-5"
              placeholder={searchPlaceholder}
              title={searchInputTitle}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                className="btn btn-sm btn-light position-absolute top-50 end-0 translate-middle-y me-1"
                style={{ border: "none" }}
                onClick={() => setSearchQuery("")}
                title="Clear search"
              >
                ×
              </button>
            )}
          </div>
        )}
        <div className="d-flex gap-2">
          {onExport && !hideDownloadButton && (
            <button
              className="btn btn-export"
              onClick={onExport}
              title={exportButtonTitle} 
            >
              <FaDownload />
            </button>
          )}
          {(flags.isAssetPage || flags.isRoomList || flags.isConsumables) &&
            showImportButton &&
            !hideImportButton && (
              <button
                className="btn btn-import"
                onClick={onImport}
                title={importButtonTitle} 
              >
                <FaFileImport />
              </button>
            )}
          {onAdd && !hideAddButton && (
            <button
              className="btn btn-form-green"
              onClick={onAdd}
              title={addButtonTitle} 
            >
              <FaPlus />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TableControls;
