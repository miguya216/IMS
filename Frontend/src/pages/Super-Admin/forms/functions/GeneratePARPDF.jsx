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

export async function generatePARPDF(user_ID) {
  try {
    // Fetch data from backend API
    const res = await fetch(`/api/User-Handlers/fetch_user_assets_par.php?user_ID=${user_ID}`);
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
    const brandingRes = await fetch("/api/User-Handlers/settings/getBrandingImage.php");
    const brandingData = await brandingRes.json();
    let headerFooterImg = null;
    if (brandingData.header_footer_img_path) {
      headerFooterImg = await getBase64FromUrl(`/${brandingData.header_footer_img_path}`);
    }

    // Table body
    const tableBody = assets.map((a) => [
      a.description,
      a.kld_property_tag,
      a.date_transferred 
        ? new Date(a.date_transferred).toLocaleDateString() 
        : "",
      a.amount ? a.amount.toString() : "" 
    ]);

    autoTable(doc, {
      startY: 80, // move down to leave space for title/header
      head: [["Description", "KLD Property Tag", "Date Transferred", "Amount"]],
      body: tableBody,
      theme: "grid",
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
      columnStyles: {
        0: { minCellWidth: 60, halign: "center" },
        1: { minCellWidth: 40, halign: "center" },
        2: { minCellWidth: 35, halign: "center" },
        3: { minCellWidth: 30, halign: "center" }
      },

      // Draw background first (behind everything)
      willDrawPage: () => {
        if (headerFooterImg) {
          doc.addImage(headerFooterImg, "PNG", 0, 0, pageWidth, pageHeight);
        }
      },

      // Draw title + header info on top
      didDrawPage: (dataArg) => {
        if (dataArg.pageNumber === 1) {
          const topOffset = 50; // move down to avoid overlapping header image
          let yPos = topOffset;

          doc.setFont("helvetica", "bold");
          doc.setFontSize(12);
          doc.text("PROPERTY ACKNOWLEDGEMENT RECEIPT (PAR)", pageWidth / 2, yPos, { align: "center" });

          yPos += 10;
          doc.setFont("helvetica", "bold");
          doc.text("Name:", 14, yPos);
          doc.text("Department:", 150, yPos);
          doc.setFont("helvetica", "normal");
          doc.text(`${header.full_name}`, 28, yPos);
          doc.text(`${header.department}`, 176, yPos);

          yPos += 8;
          doc.setFont("helvetica", "bold");
          doc.text("Control No:", 14, yPos);
          doc.setFont("helvetica", "normal");
          doc.text(`${header.control_no}`, 38, yPos);

          yPos += 8;
          doc.setFont("helvetica", "bold");
          doc.text("Total Assets:", 14, yPos);
          doc.setFont("helvetica", "normal");
          doc.text(`${assets.length}`, 41, yPos);
        }
      }
    });

    // Export
    const pdfBlob = doc.output("blob");
    return {
      url: URL.createObjectURL(pdfBlob),
      filename: `${header.control_no}.pdf`,
    };

  } catch (err) {
    console.error("Error generating PAR PDF:", err);
    return null;
  }
}
