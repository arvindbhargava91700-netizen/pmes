import React from "react";
import {
  Clock,
  Calendar,
  User,
  AlertCircle,
  CheckCircle2,
  XCircle,
} from "lucide-react";

const AllRequest = () => {
  const eotRequests = [
    {
      id: "EOT-2024-0044",
      title: "Sewerage Line Extension",
      company: "XYZ Infrastructure",
      status: "PENDING",
      tags: ["Force Majeure"],
      daysRequested: "45 days requested",
      submittedDate: "1/15/2024",
      awaiting: "JE - Rajesh Kumar",
      type: "pending",
      progress: ["J", "A", "E", "C"],
      activeStep: 0,
    },
    {
      id: "EOT-2024-0043",
      title: "Community Hall Construction",
      company: "BuildRight Corp",
      status: "REJECTED",
      tags: ["Contractor Delay", "With LD"],
      daysRequested: "20 days requested",
      submittedDate: "1/5/2024",
      penalty: "₹2.1 L",
      type: "rejected",
    },
    {
      id: "EOT-2024-0042",
      title: "Street Light Installation",
      company: "ElectroCon Ltd",
      status: "APPROVED",
      tags: ["Department Delay"],
      daysRequested: "15 days requested",
      submittedDate: "1/2/2024",
      type: "approved",
    },
  ];

  const getStatusStyle = (type) => {
    switch (type) {
      case "pending":
        return "bg-orange-100 text-orange-600";
      case "rejected":
        return "bg-red-100 text-red-600";
      case "approved":
        return "bg-green-100 text-green-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="space-y-4 mt-6">
      {eotRequests.map((request, index) => (
        <div
          key={index}
          className="bg-white hover:shadow-lg border border-gray-100 rounded-2xl p-6 shadow-sm flex justify-between items-start"
        >
          <div className="flex gap-4">
            {/* Left Status Icon */}
            <div
              className={`p-2 h-10 w-10 flex justify-center items-center rounded-xl ${getStatusStyle(
                request.type
              )} bg-opacity-50`}
            >
              {request.type === "pending" && <Clock size={22} />}
              {request.type === "rejected" && <XCircle size={22} />}
              {request.type === "approved" && <CheckCircle2 size={22} />}
            </div>

            {/* Main Content */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-xs font-medium text-gray-400">
                  {request.id}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase ${getStatusStyle(
                    request.type
                  )}`}
                >
                  {request.status}
                </span>
                {request.tags.map((tag) => (
                  <span
                    key={tag}
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase ${
                      tag === "With LD"
                        ? "bg-red-500 text-white"
                        : "bg-purple-100 text-purple-600"
                    }`}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  {request.title}
                </h3>
                <p className="text-sm text-gray-400">{request.company}</p>
              </div>

              {/* Meta Info Row */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 font-medium pt-1">
                <div className="flex items-center gap-1.5">
                  <Clock size={16} className="text-gray-400" />{" "}
                  {request.daysRequested}
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar size={16} className="text-gray-400" /> Submitted{" "}
                  {request.submittedDate}
                </div>
                {request.awaiting && (
                  <div className="flex items-center gap-1.5">
                    <User size={16} className="text-gray-400" /> Awaiting:{" "}
                    {request.awaiting}
                  </div>
                )}
                {request.penalty && (
                  <div className="flex items-center gap-1.5 text-red-500">
                    <AlertCircle size={16} /> Penalty: {request.penalty}
                  </div>
                )}
              </div>

              {/* Approval Progress (Step UI) */}
              {request.progress && (
                <div className="pt-4 space-y-2">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Approval Progress
                  </p>
                  <div className="flex items-center gap-3">
                    {request.progress.map((step, i) => (
                      <React.Fragment key={i}>
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 ${
                            i === request.activeStep
                              ? "bg-orange-400 border-orange-400 text-white"
                              : "bg-gray-50 border-gray-100 text-gray-400"
                          }`}
                        >
                          {step}
                        </div>
                        {i < request.progress.length - 1 && (
                          <span className="text-gray-300">→</span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Button */}
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer hover:text-blue-500">
              View Details
            </button>
            {request.type === "approved" && (
              <button className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-semibold text-white bg-blue-500 hover:bg-blue-600 transition-colors cursor-pointer">
                Approved
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AllRequest;
