// src/pages/admin/forms/functions/ConsumableDetailsPDF.jsx
import jsPDF from "jspdf";

export const generateConsumableDetailsPDF = async () => {
  try {
    const response = await fetch("/api/Consumable-Handlers/export_consumables.php");
    const consumables = await response.json();

    if (!consumables || consumables.length === 0) {
      console.error("No consumables found for PDF generation");
      return null;
    }

    const doc = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: "a4",
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const columnWidth = pageWidth / 2;
    const startX = [10, columnWidth + 10]; 
    let currentY = [10, 10];
    let currentColumn = 0;
    let stickersInColumn = [0, 0]; 

    for (let i = 0; i < consumables.length; i++) {
      const item = consumables[i];
      const x = startX[currentColumn];
      let y = currentY[currentColumn];
      const stickerStartY = y;

      // --- Barcode ---
      if (item.barcode_path) {
        try {
          const barcodeImg = await loadImage(resolvePath(item.barcode_path));
          doc.addImage(barcodeImg, "PNG", x + 5, y + 5, 180, 35);
        } catch (e) {
          console.warn("Barcode missing for:", item.kld_property_tag, e);
        }
      }

      // --- QR ---
      if (item.qr_code_path) {
        try {
          const qrImg = await loadImage(resolvePath(item.qr_code_path));
          doc.addImage(qrImg, "PNG", x + 195, y + 5, 65, 65);
        } catch (e) {
          console.warn("QR missing for:", item.kld_property_tag, e);
        }
      }

      y += 70;

      // --- Text details ---
      doc.setFontSize(9);

      y = addLabeledText(doc, "KLD Tag:", item.kld_property_tag || "", x + 5, y, columnWidth - 25);
      y = addLabeledText(doc, "Name:", item.consumable_name || "", x + 5, y, columnWidth - 25);
      y = addLabeledText(doc, "Description:", item.description || "", x + 5, y, columnWidth - 25);
      y = addLabeledText(doc, "Unit of Measure:", item.unit_of_measure || "", x + 5, y, columnWidth - 25);
      y = addLabeledText(doc, "Quantity:", item.total_quantity?.toString() || "", x + 5, y, columnWidth - 25);
      y = addLabeledText(
        doc,
        "Price Amount:",
        item.price_amount ? `PHP${String(item.price_amount)}` : "",
        x + 5,
        y,
        columnWidth - 25
      );
      y = addLabeledText(
        doc,
        "Date Acquired:",
        item.date_acquired ? new Date(item.date_acquired).toLocaleDateString() : "",
        x + 5,
        y,
        columnWidth - 25
      );

      y += 15;

      // --- Bounding box ---
      const stickerHeight = y - stickerStartY;
      doc.setLineWidth(0.5);
      doc.rect(x, stickerStartY, columnWidth - 20, stickerHeight);

      currentY[currentColumn] = y + 15;
      stickersInColumn[currentColumn]++;

      // Switch column
      currentColumn = currentColumn === 0 ? 1 : 0;

      // New page if both columns full
      if (stickersInColumn[0] >= 4 && stickersInColumn[1] >= 4) {
        doc.addPage();
        currentY = [10, 10];
        stickersInColumn = [0, 0];
        currentColumn = 0;
      }
    }

    const pdfBlob = doc.output("blob");
    const pdfUrl = URL.createObjectURL(pdfBlob);

    return {
      url: pdfUrl,
      filename: `Consumable_Stickers_${Date.now()}.pdf`,
    };
  } catch (err) {
    console.error("Error generating Consumable Stickers PDF:", err);
    return null;
  }
};

// --- Helpers ---
const resolvePath = (path) => {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return "/" + path.replace(/^\/+/, "");
};

const loadImage = (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = reject;
    img.src = url;
  });
};

// Draw label + value with wrapping
const addLabeledText = (doc, label, value, x, y, maxWidth) => {
  if (!label && !value) return y;

  doc.setFont("helvetica", "bold");
  doc.text(label, x, y);

  const labelWidth = doc.getTextWidth(label);

  doc.setFont("helvetica", "normal");
  const valueLines = doc.splitTextToSize(value, maxWidth - labelWidth - 2);

  doc.text(valueLines, x + labelWidth + 2, y);

  return y + valueLines.length * 12;
};
