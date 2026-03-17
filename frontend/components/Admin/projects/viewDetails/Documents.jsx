import { Upload, FileText, Download } from "lucide-react";

const documents = [
  {
    title: "Work Order",
    type: "PDF",
    size: "2.4 MB",
    date: "7/15/2024",
    tag: "Contract",
  },
  {
    title: "DPR - Detailed Project Report",
    type: "PDF",
    size: "15.8 MB",
    date: "7/10/2024",
    tag: "Planning",
  },
  {
    title: "BOQ - Bill of Quantities",
    type: "XLSX",
    size: "1.2 MB",
    date: "7/10/2024",
    tag: "Financial",
  },
  {
    title: "Site Survey Report",
    type: "PDF",
    size: "8.5 MB",
    date: "6/20/2024",
    tag: "Survey",
  },
  {
    title: "Environmental Clearance",
    type: "PDF",
    size: "3.2 MB",
    date: "6/15/2024",
    tag: "Compliance",
  },
  {
    title: "Quality Test Reports - Phase 1",
    type: "PDF",
    size: "4.8 MB",
    date: "11/1/2024",
    tag: "Quality",
  },
];

export default function ProjectDocuments() {
  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">
          Project Documents
        </h2>

        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
          <Upload size={16} />
          Upload Document
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {documents.map((doc, i) => (
          /* 1. Parent card mein 'group' class honi chahiye */
          <div
            key={i}
            className="group relative bg-white hover:shadow-md border border-gray-200 rounded-xl p-4 transition-all duration-200"
          >
            <div className="flex gap-4">
              {/* Icon */}
              <div className="w-10 h-10 shrink-0 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                <FileText size={20} />
              </div>

              {/* Content */}
              <div className="flex-1 pr-8">
                {" "}
                {/* pr-8 taaki text download button ke niche na dabe */}
                <p className="font-medium text-sm text-gray-900 truncate">
                  {doc.title}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {doc.type} • {doc.size}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">{doc.date}</p>
              </div>

              <button
                className="absolute top-4 right-4 h-8 w-8 flex justify-center items-center p-1.5 hover:bg-zinc-200 text-zinc-700 rounded-md cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                title="Download"
              >
                <Download size={16} />
              </button>
            </div>

            <span className="inline-block mt-3 text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
              {doc.tag}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
