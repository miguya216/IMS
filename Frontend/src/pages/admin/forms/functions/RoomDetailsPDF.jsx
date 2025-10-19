import jsPDF from "jspdf";

export const generateRoomDetailsPDF = async () => {
  try {
    const response = await fetch("/api/Room-Handlers/export_rooms.php");
    const rooms = await response.json();

    if (!rooms || rooms.length === 0) {
      console.error("No rooms found for PDF generation");
      return null;
    }

    const doc = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: "a4", // 595.28 x 841.89 pt
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    const cols = 4; 
    const rows = 4; 
    const stickerWidth = pageWidth / cols;
    const stickerHeight = pageHeight / rows;

    let roomIndex = 0;

    while (roomIndex < rooms.length) {
      for (let row = 0; row < rows && roomIndex < rooms.length; row++) {
        for (let col = 0; col < cols && roomIndex < rooms.length; col++) {
          const room = rooms[roomIndex];

          const x = col * stickerWidth + 10;
          const y = row * stickerHeight + 10;

          const boxW = stickerWidth - 15;
          const boxH = stickerHeight - 15;

          // Center point of the box
          const centerX = x + boxW / 2;
          const centerY = y + boxH / 2;

          // --- QR Image ---
          const qrSize = 70;
          if (room.qr_code_path) {
            try {
              const qrImg = await loadImage(resolvePath(room.qr_code_path));
              doc.addImage(
                qrImg,
                "PNG",
                centerX - qrSize / 2,
                centerY - qrSize / 2 - 20, // shift upward to leave space for text
                qrSize,
                qrSize
              );
            } catch (e) {
              console.warn("QR missing for:", room.room_number, e);
            }
          }

          // --- Room Number ---
          doc.setFontSize(12);
          doc.setFont("helvetica", "bold");
          doc.text(
            `Room: ${room.room_number || ""}`,
            centerX,
            centerY + qrSize / 2,
            { align: "center" }
          );

          // --- Bounding box ---
          doc.setLineWidth(0.3);
          doc.rect(x, y, boxW, boxH);

          roomIndex++;
        }
      }

      if (roomIndex < rooms.length) {
        doc.addPage();
      }
    }

    const pdfBlob = doc.output("blob");
    const pdfUrl = URL.createObjectURL(pdfBlob);

    return {
      url: pdfUrl,
      filename: `Room_Stickers_${Date.now()}.pdf`,
    };
  } catch (err) {
    console.error("Error generating Room Stickers PDF:", err);
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



// import jsPDF from "jspdf";

// export const generateRoomDetailsPDF = async () => {
//   try {
//     const response = await fetch("/api/Room-Handlers/export_rooms.php");
//     const rooms = await response.json();

//     if (!rooms || rooms.length === 0) {
//       console.error("No rooms found for PDF generation");
//       return null;
//     }

//     const doc = new jsPDF({
//       orientation: "portrait",
//       unit: "pt",
//       format: "a4", // 595.28 x 841.89 pt
//     });

//     const pageWidth = doc.internal.pageSize.getWidth();
//     const pageHeight = doc.internal.pageSize.getHeight();

//     // 2x2 layout = 4 stickers per page
//     const cols = 2;
//     const rows = 2;
//     const stickerWidth = pageWidth / cols;
//     const stickerHeight = pageHeight / rows;

//     let roomIndex = 0;

//     while (roomIndex < rooms.length) {
//       for (let row = 0; row < rows && roomIndex < rooms.length; row++) {
//         for (let col = 0; col < cols && roomIndex < rooms.length; col++) {
//           const room = rooms[roomIndex];

//           const x = col * stickerWidth + 20;
//           const y = row * stickerHeight + 20;

//           const boxW = stickerWidth - 40;
//           const boxH = stickerHeight - 40;

//           // Center point of the box
//           const centerX = x + boxW / 2;
//           const centerY = y + boxH / 2;

//           // --- QR Image ---
//           const qrSize = Math.min(boxW, boxH) * 0.6; // 60% of sticker box
//           if (room.qr_code_path) {
//             try {
//               const qrImg = await loadImage(resolvePath(room.qr_code_path));
//               doc.addImage(
//                 qrImg,
//                 "PNG",
//                 centerX - qrSize / 2,
//                 centerY - qrSize / 2 - 40, // shift upward
//                 qrSize,
//                 qrSize
//               );
//             } catch (e) {
//               console.warn("QR missing for:", room.room_number, e);
//             }
//           }

//           // --- Room Number ---
//           doc.setFontSize(20);
//           doc.setFont("helvetica", "bold");
//           doc.text(
//             `Room: ${room.room_number || ""}`,
//             centerX,
//             centerY + qrSize / 2,
//             { align: "center" }
//           );

//           // --- Bounding box ---
//           doc.setLineWidth(1);
//           doc.rect(x, y, boxW, boxH);

//           roomIndex++;
//         }
//       }

//       if (roomIndex < rooms.length) {
//         doc.addPage();
//       }
//     }

//     const pdfBlob = doc.output("blob");
//     const pdfUrl = URL.createObjectURL(pdfBlob);

//     return {
//       url: pdfUrl,
//       filename: `Room_Stickers_${Date.now()}.pdf`,
//     };
//   } catch (err) {
//     console.error("Error generating Room Stickers PDF:", err);
//     return null;
//   }
// };

// // --- Helpers ---
// const resolvePath = (path) => {
//   if (!path) return null;
//   if (path.startsWith("http")) return path;
//   return "/" + path.replace(/^\/+/, "");
// };

// const loadImage = (url) => {
//   return new Promise((resolve, reject) => {
//     const img = new Image();
//     img.crossOrigin = "Anonymous";
//     img.onload = () => {
//       const canvas = document.createElement("canvas");
//       canvas.width = img.width;
//       canvas.height = img.height;
//       const ctx = canvas.getContext("2d");
//       ctx.drawImage(img, 0, 0);
//       resolve(canvas.toDataURL("image/png"));
//     };
//     img.onerror = reject;
//     img.src = url;
//   });
// };
