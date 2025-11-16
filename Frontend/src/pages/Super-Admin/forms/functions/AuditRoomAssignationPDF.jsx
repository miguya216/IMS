import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const getBase64FromUrl = async (url) => {
  const response = await fetch(url);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

export const AuditRoomAssignationPDF = async (room_assignation_ID) => {
  try {
    const res = await fetch(
      `/api/Room-Handlers/fetch_room_assignation_record_by_id.php?room_assignation_id=${room_assignation_ID}`
    );
    const data = await res.json();
    if (!data.assignation) return null;

    const header = data.assignation || {};
    const assets = data.assets || [];

    const doc = new jsPDF({ orientation: "portrait" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Load header/footer image
    const brandingRes = await fetch("/api/User-Handlers/settings/getBrandingImage.php");
    const brandingData = await brandingRes.json();
    const headerFooterPath = brandingData.header_footer_img_path;

    let headerFooterImg = null;
    if (headerFooterPath) {
      headerFooterImg = await getBase64FromUrl(`/${headerFooterPath}`);
    }

    const drawBackground = () => {
      if (headerFooterImg) {
        doc.addImage(headerFooterImg, "PNG", 0, 0, pageWidth, pageHeight);
      }
    };

    // ===== Table of Assets =====
    const tableData = assets.map((a) => [
      a.price_amount || "",
      a.kld_property_tag || "",
      a.description || "",
      a.condition_name || "",
    ]);

    autoTable(doc, {
      head: [["Price Amount", "KLD-Property Tag", "Description", "Condition"]],
      margin: { top: 48, bottom: 20},
      body: tableData,
      startY: 82, // bring down table below header
      styles: {
        fillColor: false,
        fontSize: 10,
        cellPadding: 3,
        lineWidth: 0.5,
        lineColor: [0, 0, 0],
        halign: "center",
        valign: "middle",
        textColor: [0, 0, 0],
      },
      headStyles: {
        fillColor: false,
        textColor: [0, 0, 0],
        fontStyle: "bold",
        lineWidth: 0.5,
        lineColor: [0, 0, 0],
        halign: "center",
        valign: "middle"
      },
      theme: "grid",

      // Draw background BEFORE content
      willDrawPage: () => drawBackground(),

      // Draw title + header info on top of background (first page)
      didDrawPage: (dataArg) => {
        if (dataArg.pageNumber === 1) {
          const topOffset = 50; // shift everything down
          let yPos = topOffset;

          doc.setFont("helvetica", "bold");
          doc.setFontSize(16);
          doc.text("ROOM ASSIGNATION REPORT", pageWidth / 2, yPos, { align: "center" });

          yPos += 12; // spacing after title
          const leftX = 14;
          const rightX = 120;

          doc.setFontSize(12);
          doc.setFont("helvetica", "bold");
          doc.text("From Room:", leftX, yPos);
          doc.setFont("helvetica", "normal");
          doc.text(header.from_room || "Not Assigned Yet", leftX + doc.getTextWidth("From Room:") + 3, yPos);

          doc.setFont("helvetica", "bold");
          doc.text("Assignation No:", rightX, yPos);
          doc.setFont("helvetica", "normal");
          doc.text(header.room_assignation_no?.toString() || "", rightX + doc.getTextWidth("Assignation No.:") + 4, yPos);

          yPos += 8;
          doc.setFont("helvetica", "bold");
          doc.text("To Room:", leftX, yPos);
          doc.setFont("helvetica", "normal");
          doc.text(header.to_room || "", leftX + doc.getTextWidth("To Room:") + 3, yPos);

          doc.setFont("helvetica", "bold");
          doc.text("Date Moved:", rightX, yPos);
          doc.setFont("helvetica", "normal");
          doc.text(
            header.moved_at ? new Date(header.moved_at).toLocaleDateString() : new Date().toLocaleDateString(),
            rightX + doc.getTextWidth("Date Moved:") + 3,
            yPos
          );

          yPos += 8;
          doc.setFont("helvetica", "bold");
          doc.text("Moved By:", leftX, yPos);
          doc.setFont("helvetica", "normal");
          doc.text(header.moved_by || "", leftX + doc.getTextWidth("Moved By:") + 3, yPos);
        }
      },
      rowPageBreak: 'avoid',
    });

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
