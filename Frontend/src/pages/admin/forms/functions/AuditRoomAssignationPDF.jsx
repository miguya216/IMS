// src/pages/admin/forms/functions/AuditRoomAssignationPDF.jsx
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const AuditRoomAssignationPDF = async (room_assignation_ID) => {
  try {
    const res = await fetch(
      `/api/Room-Handlers/fetch_room_assignation_record_by_id.php?room_assignation_id=${room_assignation_ID}`
    );
    const data = await res.json();

    if (!data.assignation) {
      console.error(
        "Failed to fetch Room Assignation data:",
        data.error || "Unknown error"
      );
      return null;
    }

    const header = data.assignation || {};
    const assets = data.assets || [];

    const doc = new jsPDF({ orientation: "portrait" });
    doc.setFontSize(16).setFont("times", "bold");

    // ===== Title =====
    doc.text(
      "ROOM ASSIGNATION REPORT",
      doc.internal.pageSize.getWidth() / 2,
      20,
      { align: "center" }
    );

    const leftX = 14;
    const rightX = 120;
    let yLeft = 32;

    doc.setFontSize(12).setTextColor(0, 0, 0);

    // ===== From Room =====
    doc.setFont("times", "bold").text("From Room:", leftX, yLeft);
    doc.setFont("times", "normal").text(
    header.from_room || "Not Assigned Yet",
    leftX + doc.getTextWidth("From Room:") + 2, // << dynamic placement
    yLeft
    );

    // Room Assignation No. (right side)
    if (header.room_assignation_no) {
    doc.setFont("times", "bold").text("Assignation No.:", rightX, yLeft);
    doc.setFont("times", "normal").text(
        header.room_assignation_no.toString(),
        rightX + doc.getTextWidth("Assignation No.:") + 2, // << dynamic placement
        yLeft
    );
    }

    // ===== To Room =====
    yLeft += 8;
    doc.setFont("times", "bold").text("To Room:", leftX, yLeft);
    doc.setFont("times", "normal").text(
    header.to_room || "",
    leftX + doc.getTextWidth("To Room:") + 2,
    yLeft
    );

    // Date Moved (right side)
    doc.setFont("times", "bold").text("Date Moved:", rightX, yLeft);
    doc.setFont("times", "normal").text(
    header.moved_at
        ? new Date(header.moved_at).toLocaleDateString()
        : new Date().toLocaleDateString(),
    rightX + doc.getTextWidth("Date Moved:") + 2,
    yLeft
    );

    // ===== Moved By =====
    yLeft += 8;
    doc.setFont("times", "bold").text("Moved By:", leftX, yLeft);
    doc.setFont("times", "normal").text(
    header.moved_by || "",
    leftX + doc.getTextWidth("Moved By:") + 2,
    yLeft
    );


    // ===== Table of Assets =====
    const tableData = assets.map((a) => [
    a.price_amount || "",       // <-- updated from date_acquired
    a.kld_property_tag || "",
    a.description || "",
    a.condition_name || "",
    ]);

    autoTable(doc, {
    head: [["Price Amount", "KLD-Property Tag", "Description", "Condition"]], // <-- updated column title
    body: tableData,
    startY: 55,
    styles: {
        fontSize: 8,
        cellPadding: 3,
        lineWidth: 0.5,
        lineColor: [0, 0, 0],
        halign: "center",
        textColor: [0, 0, 0],
    },
    headStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        fontStyle: "bold",
        lineWidth: 0.5,
        lineColor: [0, 0, 0],
        halign: "center",
    },
    theme: "grid",
    });


    // ===== Output =====
    const pdfBlob = doc.output("blob");
    return {
      url: URL.createObjectURL(pdfBlob),
      filename: `${header.room_assignation_no || "RoomAssignation"}.pdf`,
    };
  } catch (err) {
    console.error("Error generating Room Assignation PDF:", err);
    return null;
  }
};
