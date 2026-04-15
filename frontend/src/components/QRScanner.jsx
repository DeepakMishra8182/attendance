import { useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";
import jsQR from "jsqr";
import './qrscanner.css'

const QRScanner = ({ onScan }) => {
  const fileInputRef = useRef();

  useEffect(() => {
    const scanner = new Html5Qrcode("reader");

    scanner
      .start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: 250,
        },
        (decodedText) => {
          try {
            const data = JSON.parse(decodedText);
            onScan(data);
            scanner.stop();
          } catch (err) {
            console.log("Invalid QR format");
          }
        }
      )
      .catch((err) => console.log(err));

    return () => {
      scanner.stop().catch(() => {});
    };
  }, []);

  // 📷 IMAGE UPLOAD SCAN
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = function () {
      const img = new Image();
      img.src = reader.result;

      img.onload = function () {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        canvas.width = img.width;
        canvas.height = img.height;

        ctx.drawImage(img, 0, 0, img.width, img.height);

        const imageData = ctx.getImageData(
          0,
          0,
          canvas.width,
          canvas.height
        );

        const code = jsQR(
          imageData.data,
          imageData.width,
          imageData.height
        );

        if (code) {
          try {
            const data = JSON.parse(code.data);
            onScan(data);
          } catch (err) {
            alert("Invalid QR format");
          }
        } else {
          alert("No QR code found");
        }
      };
    };

    reader.readAsDataURL(file);
  };

 return (
    <div className="qr-scanner-wrapper">
      <div className="qr-scanner-container">
        <h2 className="scanner-title">Scan QR Code</h2>
        
        <div className="reader-wrapper">
          <div id="reader" className="qr-reader"></div>
          {/* Ye scanning line animation ke liye hai */}
          <div className="scanner-line"></div>
          <div className="corner-tl"></div>
          <div className="corner-tr"></div>
          <div className="corner-bl"></div>
          <div className="corner-br"></div>
        </div>

        <div className="qr-upload-section">
          <div className="divider">
            <span>OR</span>
          </div>
          
          <button 
            className="custom-upload-btn" 
            onClick={() => fileInputRef.current.click()}
          >
            <span className="icon">📁</span> Upload from Gallery
          </button>
          
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="qr-file-input"
            onChange={handleImageUpload}
            style={{ display: 'none' }} // Hide original input
          />
        </div>
      </div>
    </div>
  );
};

export default QRScanner;