import React from "react";
import { FileText, Download } from "lucide-react";

const documents = [
  { name: "Tender Notice", type: "PDF", size: "245 KB" },
  { name: "Bill of Quantities", type: "XLSX", size: "1.2 MB" },
  { name: "Technical Specifications", type: "PDF", size: "3.8 MB" },
  { name: "Site Plans & Drawings", type: "PDF", size: "12.5 MB" },
  { name: "Terms & Conditions", type: "PDF", size: "890 KB" },
];

const DocumentList = () => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 max-w-5xl mt-8">
      <div className="space-y-3">
        {documents.map((doc, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 bg-gray-50/50 rounded-xl group hover:bg-gray-100 transition-all duration-200"
          >
            <div className="flex items-center gap-4">
              {/* Blue Icon Container */}
              <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
                <FileText size={20} />
              </div>
              <div>
                <h4 className="font-semibold text-slate-800 text-sm">
                  {doc.name}
                </h4>
                <p className="text-gray-400 text-xs uppercase font-medium">
                  {doc.type} • {doc.size}
                </p>
              </div>
            </div>
            <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
              <Download size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DocumentList;
