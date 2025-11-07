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

export const generateDisposalPDF = async (disposalID) => {
  try {
    // Fetch branding image
    const brandingRes = await fetch("/api/User-Handlers/settings/getBrandingImage.php");
    const brandingData = await brandingRes.json();
    const headerFooterPath = brandingData.header_footer_img_path;

    // Fetch disposal data
    const res = await fetch(`/api/Disposal-Hanlders/fetch_disposal_by_id.php?disposal_id=${disposalID}`);
    const data = await res.json();

    if (data.status !== "success") {
      console.error("Failed to fetch disposal data:", data.message);
      return null;
    }

    const header = data.header || {};
    const items = data.items || [];

    const doc = new jsPDF({ orientation: "portrait" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Load header/footer image
    let headerFooterImg = null;
    if (headerFooterPath) {
      headerFooterImg = await getBase64FromUrl(`/${headerFooterPath}`);
    }

    // 🪄 Draw background image behind content
    const drawBackground = () => {
      if (headerFooterImg) {
        doc.addImage(headerFooterImg, "PNG", 0, 0, pageWidth, pageHeight);
      }
    };

    // Start drawing PDF layout
    autoTable(doc, {
      startY: 0, // dummy to access didDrawPage even without table
      willDrawPage: () => {
        drawBackground(); // background behind everything
      },
      didDrawPage: () => {
        // Bring content down to avoid overlap with header image
        let y = 50;

        // ===== Title =====
        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        doc.text("DISPOSAL FORM", pageWidth / 2, y, { align: "center" });

        y += 15;

        // ===== 2-Column Header =====
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);

        // Left side (legal warning)
        doc.text("IT IS ILLEGAL TO REMOVE EQUIPMENT/", 14, y);
        doc.text("FURNITURE WITHOUT PROPER FORMS ON FILE.", 14, y + 5);

        // Right side (Disposal # only)
        doc.text("Disposal #:", pageWidth - 60, y);
        doc.setFont("helvetica", "normal");
        doc.text(`${header.disposal_no || ""}`, pageWidth - 41, y);

        y += 18;

        // ===== Notice =====
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.text('THIS FORM IS FOR ITEMS IN "UNSERVICEABLE" CONDITION.', 14, y);

        y += 10;

        // ===== Date =====
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.text("Date:", 14, y);
        doc.setFont("helvetica", "normal");
        doc.text(`${header.date || ""}`, 25, y);
        y += 8;

        // ===== Requestor =====
        doc.setFont("helvetica", "bold");
        doc.text("Requestor:", 14, y);
        doc.setFont("helvetica", "normal");
        doc.text(`${header.full_name || ""}`, 33, y);

        doc.setFont("helvetica", "bold");
        doc.text("Email:", 70, y);
        doc.setFont("helvetica", "normal");
        doc.text(`${header.kld_email || ""}`, 82, y);

        doc.setFont("helvetica", "bold");
        doc.text("Phone:", 130, y);
        doc.setFont("helvetica", "normal");
        doc.text("____________________", 142, y);
        y += 8;

        // ===== Department =====
        doc.setFont("helvetica", "bold");
        doc.text("Department:", 14, y);
        doc.setFont("helvetica", "normal");
        doc.text(`${header.unit_name || ""}`, 37, y);

        doc.setFont("helvetica", "bold");
        doc.text("Inventory Account #:", 70, y);
        doc.setFont("helvetica", "normal");
        doc.text("___________________________", 107, y);
        y += 8;

        // ===== Location =====
        doc.setFont("helvetica", "bold");
        doc.text("Location for pick up:", 14, y);
        doc.setFont("helvetica", "normal");
        doc.text("__________________________________", 50, y);
        y += 12;

        // ===== TABLE =====
        if (items.length > 0) {
          const tableHead = [
            [
              {
                content: "Disposal Items",
                colSpan: 5,
                styles: { halign: "center", fontStyle: "bold" },
              },
            ],
            ["Qty", "KLD Property Tag", "Property Tag", "Asset Type", "Brand"],
          ];

          autoTable(doc, {
            head: tableHead,
            body: items.map((item) => [
              "",
              item.kld_property_tag || "",
              item.property_tag || "",
              item.asset_type || "",
              item.brand || "",
            ]),
            startY: y,
            styles: {
              halign: "center",
              valign: "middle",
              font: "helvetica",
              fontSize: 9,
              cellPadding: 3,
              lineWidth: 0.6,
              textColor: 0,
              lineColor: 0,
            },
            headStyles: {
              textColor: 0,
              lineColor: 0,
              lineWidth: 0.6,
              fillColor: false,
            },
            theme: "grid",
            columnStyles: {
              0: { cellWidth: 15 },
              1: { cellWidth: 40 },
              2: { cellWidth: 40 },
              3: { cellWidth: 45 },
              4: { cellWidth: 40 },
            },
          });

          y = doc.lastAutoTable.finalY + 10;
        }

        // ===== Certification Text =====
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9.5);
        doc.text(
          'The signatures below ascertain that the condition of the above listed items are in "unserviceable" condition and authorize their disposal. ' +
            "Also, the signatures below certify that the equipment listed is free from any and all radioactive or hazardous materials.",
          14,
          y,
          { maxWidth: 180 }
        );

        y += 15;

        // ===== Signature Lines =====
        doc.text("Signature of Dept. Inventory Coordinator: ____________________", 14, y);
        y += 8;
        doc.text("Print/Type Inventory Coordinator Name: ____________________", 14, y);
        y += 8;
        doc.text("Email Address: ____________________", 14, y);
        y += 15;

        doc.text("Signature of Department Head: ____________________", 14, y);
        y += 8;
        doc.text("Print/Type Department Head Name: ____________________", 14, y);
      },
    });

    // Output PDF
    const pdfBlob = doc.output("blob");
    return {
      url: URL.createObjectURL(pdfBlob),
      filename: `${header.disposal_no || "disposal"}.pdf`,
    };
  } catch (err) {
    console.error("Error generating Disposal PDF:", err);
    return null;
  }
};
