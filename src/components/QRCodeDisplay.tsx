import { useState } from "react";
import QRCode from "qrcode.react";
import { Download, Copy } from "lucide-react";
import toast from "react-hot-toast";

interface QRCodeDisplayProps {
  shortUrl: string;
  slug: string;
  qrColor?: string;
  qrBackgroundColor?: string;
}

export default function QRCodeDisplay({
  shortUrl,
  slug,
  qrColor = "#000000",
  qrBackgroundColor = "#FFFFFF",
}: QRCodeDisplayProps) {
  const [copied, setCopied] = useState(false);
  const qrRef = React.useRef<HTMLDivElement>(null);

  const handleDownloadSVG = () => {
    const svg = qrRef.current?.querySelector("svg");
    if (!svg) return;

    const svgString = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([svgString], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `qr-${slug}.svg`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("QR code downloaded!");
  };

  const handleDownloadPNG = () => {
    const canvas = qrRef.current?.querySelector("canvas");
    if (!canvas) return;

    const url = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = url;
    link.download = `qr-${slug}.png`;
    link.click();
    toast.success("QR code downloaded!");
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <h3 className="text-xl font-bold text-slate-900 mb-6">QR Code</h3>

      <div className="flex flex-col items-center gap-6">
        {/* QR Code */}
        <div
          ref={qrRef}
          className="p-4 bg-white border-2 border-slate-200 rounded-lg"
        >
          <QRCode
            value={shortUrl}
            size={256}
            level="H"
            includeMargin={true}
            fgColor={qrColor}
            bgColor={qrBackgroundColor}
          />
        </div>

        {/* Short URL */}
        <div className="w-full">
          <p className="text-sm text-slate-600 mb-2">Short URL:</p>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={shortUrl}
              readOnly
              className="flex-1 px-4 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono text-sm"
            />
            <button
              onClick={handleCopyUrl}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              title="Copy to clipboard"
            >
              <Copy className="w-5 h-5 text-slate-600" />
            </button>
          </div>
        </div>

        {/* Download Buttons */}
        <div className="flex gap-3 w-full">
          <button
            onClick={handleDownloadSVG}
            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            SVG
          </button>
          <button
            onClick={handleDownloadPNG}
            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            PNG
          </button>
        </div>
      </div>
    </div>
  );
}

import React from "react";
