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

export async function generateICSPDF(user_ID) {
  try {
    // Get branding image
    const brandingRes = await fetch("/api/User-Handlers/settings/getBrandingImage.php");
    const brandingData = await brandingRes.json();
    const headerFooterPath = brandingData.header_footer_img_path;

    // Fetch ICS data
    const res = await fetch(`/api/User-Handlers/fetch_user_assets_ics.php?user_ID=${user_ID}`);
    const data = await res.json();
    if (data.status !== "success") {
      console.error("Error:", data.message);
      return null;
    }

    const { header, assets } = data;
    const doc = new jsPDF({ orientation: "portrait" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Load header/footer image
    let headerFooterImg = null;
    if (headerFooterPath) {
      headerFooterImg = await getBase64FromUrl(`/${headerFooterPath}`);
    }

    // Table data
    const tableBody = assets.map((a) => [
      a.description,
      a.kld_property_tag,
      a.date_transferred ? new Date(a.date_transferred).toLocaleDateString() : "",
      a.amount ? a.amount.toString() : ""
    ]);

    autoTable(doc, {
      startY: 80, // leave space for header
      head: [["Description", "KLD Property Tag", "Date Transferred", "Amount"]],
      body: tableBody,
      styles: { 
        fontSize: 8,
        cellPadding: 3,
        textColor: [0,0,0],
        lineColor: [0,0,0],
        lineWidth: 0.3
      },
      headStyles: { 
        fontStyle: "bold",
        fillColor: [255,255,255],
        textColor: [0,0,0],
        lineColor: [0,0,0],
        lineWidth: 0.3,
        halign: "center",
        valign: "middle"
      },
      theme: "grid",
      columnStyles: {
        0: { minCellWidth: 60, halign: "center" },
        1: { minCellWidth: 40, halign: "center" },
        2: { minCellWidth: 35, halign: "center" },
        3: { minCellWidth: 30, halign: "center" }
      },

      // Background behind table and content
      willDrawPage: () => {
        if (headerFooterImg) {
          doc.addImage(headerFooterImg, "PNG", 0, 0, pageWidth, pageHeight);
        }
      },

      // Header text on top
      didDrawPage: (dataArg) => {
        if (dataArg.pageNumber === 1) {
          const topOffset = 50; // push down below header image
          let yPos = topOffset;

          doc.setFont("helvetica", "bold");
          doc.setFontSize(12);
          doc.text("INVENTORY CUSTODIAN SLIP (ICS)", pageWidth / 2, yPos, { align: "center" });

          yPos += 10;
          doc.setFont("helvetica", "bold");
          doc.setFontSize(10);
          doc.text("Name:", 14, yPos);
          doc.text("Department:", 150, yPos);
          doc.text("Control No:", 14, yPos + 8);

          doc.setFont("helvetica", "normal");
          doc.text(`${header.full_name}`, 25, yPos);
          doc.text(`${header.department}`, 171, yPos);
          doc.text(`${header.control_no}`, 35, yPos + 8);

          // Total assets
          const totalAssets = assets.length;
          doc.setFont("helvetica", "bold");
          doc.text("Total Assets:", 14, yPos + 16);
          doc.setFont("helvetica", "normal");
          doc.text(`${totalAssets}`, 38, yPos + 16);
        }
      }
    });

    // Export
    const pdfBlob = doc.output("blob");
    return {
      url: URL.createObjectURL(pdfBlob),
      filename: `${header.control_no}.pdf`
    };

  } catch (err) {
    console.error("Error generating ICS PDF:", err);
    return null;
  }
}
