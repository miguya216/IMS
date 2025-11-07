import React, { useEffect, useRef, useImperativeHandle, forwardRef } from "react";
import { Html5Qrcode } from "html5-qrcode";

const QrScanner = forwardRef(
  (
    {
      onScanSuccess,
      onScanError,
      onCameraReady, // 🔹 NEW: notify parent
      fps = 10,
      qrbox = 250,
      aspectRatio = 1.0,
      verbose = false,
      cameraId = null,
      width = 300,
      height = 300,
      stopOnScan = false,
    },
    ref
  ) => {
    const qrCodeRegionId = "qr-scanner-region";
    const scannerRef = useRef(null);

    const stopScanner = async () => {
      if (scannerRef.current?.isScanning) {
        try {
          await scannerRef.current.stop();
          await scannerRef.current.clear();
        } catch (err) {
          console.warn("Error stopping scanner:", err);
        }
      }
    };

    useImperativeHandle(ref, () => ({
      stop: stopScanner,
    }));

    useEffect(() => {
      let isMounted = true;
      const config = { fps, qrbox, aspectRatio };

      const initScanner = async () => {
        try {
          const targetElem = document.getElementById(qrCodeRegionId);
          if (!targetElem) {
            console.error("QR target element not found.");
            return;
          }

          scannerRef.current = new Html5Qrcode(qrCodeRegionId, { verbose });

          const cameras = await Html5Qrcode.getCameras();
          if (!cameras || cameras.length === 0) {
            console.error("No camera found for QR scanning.");
            return;
          }

          let selectedCamera = cameras.find((cam) =>
            cam.label.toLowerCase().includes("back")
          );
          if (!selectedCamera) {
            selectedCamera = cameras.find((cam) =>
              cam.label.toLowerCase().includes("front")
            );
          }
          if (!selectedCamera) {
            selectedCamera = cameras[0];
          }

          const selectedCameraId = cameraId || selectedCamera.id;

          if (isMounted) {
            await scannerRef.current.start(
              { deviceId: { exact: selectedCameraId } },
              config,
              (decodedText, decodedResult) => {
                if (onScanSuccess) onScanSuccess(decodedText, decodedResult);
                if (stopOnScan && scannerRef.current?.isScanning) {
                    scannerRef.current
                      .stop()
                      .then(() => scannerRef.current.clear())
                      .catch(() => {});
                  }
              },
              onScanError || (() => {})
            );

            if (typeof onCameraReady === "function") {
              onCameraReady();
            }
          }
        } catch (err) {
          console.error("QR Scanner failed to start:", err);
        }
      };

      initScanner();

      return () => {
        isMounted = false;
        stopScanner();
      };
    }, [cameraId, fps, qrbox, aspectRatio, verbose, onScanSuccess, onScanError, stopOnScan]);

    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "100%",
        }}
      >
        <div
          id={qrCodeRegionId}
          style={{
            width: typeof width === "number" ? `${width}px` : width,
            height: typeof height === "number" ? `${height}px` : height,
          }}
        />
      </div>
    );
  }
);

export default QrScanner;
