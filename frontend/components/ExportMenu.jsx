"use client";

import { useState, useRef, useEffect } from "react";
import { Download, FileText, FileSpreadsheet, Copy } from "lucide-react";

export default function ExportMenu({ onExcel, onPDF, onCopy, onCSV }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      {/* Button */}
      <button
        onClick={() => setOpen(!open)}
        className="border border-gray-300 px-4 py-2 rounded-lg bg-white flex items-center gap-2 hover:bg-gray-100"
      >
        <Download size={16} />
        Export
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-50">
          <Item icon={<FileSpreadsheet size={16} />} label="Excel" onClick={onExcel} />
          <Item icon={<FileText size={16} />} label="PDF" onClick={onPDF} />
          <Item icon={<Copy size={16} />} label="Copy" onClick={onCopy} />
          <Item icon={<Download size={16} />} label="CSV" onClick={onCSV} />
        </div>
      )}
    </div>
  );
}

const Item = ({ icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-100"
  >
    {icon}
    {label}
  </button>
);