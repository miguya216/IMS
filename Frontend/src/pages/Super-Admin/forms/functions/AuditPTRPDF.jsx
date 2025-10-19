// src/pages/admin/forms/functions/AuditPTRPDF.jsx
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const AuditPTRPDF = async (ptr_ID) => {
  try {
    const res = await fetch(
      `/api/Transfer-Form/fetch_ptr_by_id.php?ptr_id=${ptr_ID}`
    );
    const data = await res.json();

    if (!data.transfer) {
      console.error("Failed to fetch PTR data:", data.error || "Unknown error");
      return null;
    }

    const header = data.transfer || {};
    const items = data.assets || [];

    const doc = new jsPDF({ orientation: "portrait" });
    doc.setFontSize(16).setFont("times", "bold");

    // ===== Title =====
    doc.text(
      "PROPERTY TRANSFER REPORT",
      doc.internal.pageSize.getWidth() / 2,
      20,
      { align: "center" }
    );

    // Column positions
    const leftX = 14;
    const rightX = 120;
    const ptrGap = 18;
    const valueGap = 35;
    let yLeft = 32;

    doc.setFontSize(12).setTextColor(0, 0, 0);

    // ===== From Accountable =====
    doc.setFont("times", "bold").text("From Accountable:", leftX, yLeft);
    doc.setFont("times", "normal").text(
      header.from_user_name || "",
      leftX + 38,
      yLeft
    );

    // PTR No on the same line (right side)
    if (header.ptr_no) {
      doc.setFont("times", "bold").text("PTR No:", rightX, yLeft);
      doc
        .setFont("times", "normal")
        .text(header.ptr_no.toString(), rightX + ptrGap, yLeft);
    }

    // ===== To Accountable =====
    yLeft += 8;
    doc.setFont("times", "bold").text("To Accountable:", leftX, yLeft);
    doc
      .setFont("times", "normal")
      .text(header.to_user_name || "", leftX + 33, yLeft);

    // Date Transferred on the same line (right side)
    doc.setFont("times", "bold").text("Date Transferred:", rightX, yLeft);
    doc
      .setFont("times", "normal")
      .text(
        header.created_at
          ? new Date(header.created_at).toLocaleDateString()
          : new Date().toLocaleDateString(),
        rightX + valueGap,
        yLeft
      );

    // ===== Table of Assets =====
    const tableData = items.map((a) => [
      a.date_acquired || "",
      a.kld_property_tag || "",
      a.description || "",
      a.transfer_type_name || "",
      a.condition_name || "",
    ]);

    autoTable(doc, {
      head: [
        [
          "Date Acquired",
          "Property No.",
          "Description",
          "Transfer Type",
          "Condition",
        ],
      ],
      body: tableData,
      startY: 50,
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
      filename: `${header.ptr_no || "PTR"}.pdf`,
    };
  } catch (err) {
    console.error("Error generating PTR PDF:", err);
    return null;
  }
};
