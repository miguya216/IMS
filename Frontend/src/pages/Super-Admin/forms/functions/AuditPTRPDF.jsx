// src/pages/admin/forms/functions/AuditPTRPDF.jsx
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

export const AuditPTRPDF = async (ptr_ID) => {
  try {
    // Fetch data
    const res = await fetch(`/api/Transfer-Form/fetch_ptr_by_id.php?ptr_id=${ptr_ID}`);
    const data = await res.json();
    if (!data.transfer) {
      console.error("Failed to fetch PTR data:", data.error || "Unknown error");
      return null;
    }

    const header = data.transfer || {};
    const items = data.assets || [];

    // Fetch branding image
    const brandingRes = await fetch("/api/User-Handlers/settings/getBrandingImage.php");
    const brandingData = await brandingRes.json();
    const headerFooterPath = brandingData.header_footer_img_path;
    let headerFooterImg = null;
    if (headerFooterPath) {
      headerFooterImg = await getBase64FromUrl(`/${headerFooterPath}`);
    }

    // Setup doc
    const doc = new jsPDF({ orientation: "portrait" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Draw background
    const drawBackground = () => {
      if (headerFooterImg) {
        doc.addImage(headerFooterImg, "PNG", 0, 0, pageWidth, pageHeight);
      }
    };

    // ===== Table of Assets =====
    const tableData = items.map((a) => [
      a.date_acquired || "",
      a.kld_property_tag || "",
      a.description || "",
      a.transfer_type_name || "",
      a.condition_name || "",
    ]);

    autoTable(doc, {
      startY: 70, // shifted down a bit to make space for header
      head: [["Date Acquired", "Property No.", "Description", "Transfer Type", "Condition"]],
      body: tableData,
      styles: {
        fontSize: 9,
        cellPadding: 3,
        lineWidth: 0.5,
        lineColor: [0, 0, 0],
        halign: "center",
        valign: "middle",
        textColor: [0, 0, 0],
      },
      headStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        fontStyle: "bold",
        lineWidth: 0.5,
        lineColor: [0, 0, 0],
        halign: "center",
        valign: "middle"
      },
      theme: "grid",

      // Draw image BEFORE content (background)
      willDrawPage: () => {
        drawBackground();
      },

      // Draw header/title AFTER background (foreground)
      didDrawPage: (dataArg) => {
        if (dataArg.pageNumber === 1) {
          const topOffset = 45; // push everything below header image
          let y = topOffset;
          const leftX = 14;
          const rightX = 120;
          const ptrGap = 18;
          const valueGap = 35;

          // ===== Title =====
          doc.setFont("helvetica", "bold");
          doc.setFontSize(16);
          doc.text("PROPERTY TRANSFER REPORT", pageWidth / 2, y, { align: "center" });

          doc.setFontSize(12);
          y += 10;

          // ===== From Accountable =====
          doc.setFont("helvetica", "bold").text("From Accountable:", leftX, y);
          doc.setFont("helvetica", "normal").text(header.from_user_name || "", leftX + 42, y);

          // PTR No on the same line (right side)
          if (header.ptr_no) {
            doc.setFont("helvetica", "bold").text("PTR No:", rightX, y);
            doc.setFont("helvetica", "normal").text(header.ptr_no.toString(), rightX + ptrGap, y);
          }

          // ===== To Accountable =====
          y += 8;
          doc.setFont("helvetica", "bold").text("To Accountable:", leftX, y);
          doc.setFont("helvetica", "normal").text(header.to_user_name || "", leftX + 37, y);

          // Date Transferred
          doc.setFont("helvetica", "bold").text("Date Transferred:", rightX, y);
          doc
            .setFont("helvetica", "normal")
            .text(
              header.created_at
                ? new Date(header.created_at).toLocaleDateString()
                : new Date().toLocaleDateString(),
              rightX + valueGap,
              y
            );
        }
      },
    });

    // ===== Output =====
    const pdfBlob = doc.output("blob");
    return {
      url: URL.createObjectURL(pdfBlob),
      filename: `${header.ptr_no || "PTR"}.pdf`,
    };
  } catch (err) {
    console.error("Error generating PTR PDF:", err);
    return null;
  }
};
