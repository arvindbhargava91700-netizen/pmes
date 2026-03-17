import React from "react";
import { Eye } from "lucide-react";

const bids = [
  {
    id: "BID-001",
    contractor: "ABC Constructions Pvt Ltd",
    amount: "₹4.2 Cr",
    score: 85,
    status: "QUALIFIED",
  },
  {
    id: "BID-002",
    contractor: "BuildRight Corp",
    amount: "₹4.35 Cr",
    score: 82,
    status: "QUALIFIED",
  },
  {
    id: "BID-003",
    contractor: "MeeraCon Infrastructure",
    amount: "₹4.1 Cr",
    score: 78,
    status: "QUALIFIED",
  },
  {
    id: "BID-004",
    contractor: "Sharma Builders",
    amount: "₹4.5 Cr",
    score: 75,
    status: "UNDER REVIEW",
  },
  {
    id: "BID-005",
    contractor: "XYZ Infrastructure",
    amount: "₹3.9 Cr",
    score: null,
    status: "DISQUALIFIED",
  },
];

const BidsTable = () => {
  const getStatusStyles = (status) => {
    switch (status) {
      case "QUALIFIED":
        return "bg-emerald-100 text-emerald-600 border-emerald-100";
      case "UNDER REVIEW":
        return "bg-amber-100 text-amber-600 border-amber-100";
      case "DISQUALIFIED":
        return "bg-rose-100 text-rose-600 border-rose-100";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="bg-white mt-8 rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-200">
            <th className="p-5 text-xs font-bold text-gray-700 uppercase tracking-wider">
              Bid ID
            </th>
            <th className="p-5 text-xs font-bold text-gray-700 uppercase tracking-wider">
              Contractor
            </th>
            <th className="p-5 text-xs font-bold text-gray-700 uppercase tracking-wider">
              Bid Amount
            </th>
            <th className="p-5 text-xs font-bold text-gray-700 uppercase tracking-wider">
              Technical Score
            </th>
            <th className="p-5 text-xs font-bold text-gray-700 uppercase tracking-wider">
              Status
            </th>
            <th className="p-5 text-xs font-bold text-gray-700 uppercase tracking-wider text-right">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {bids.map((bid) => (
            <tr key={bid.id} className="hover:bg-gray-100 transition-colors">
              <td className="p-5 text-sm font-medium text-slate-600">
                {bid.id}
              </td>
              <td className="p-5 text-sm font-semibold text-slate-800">
                {bid.contractor}
              </td>
              <td className="p-5 text-sm font-medium text-slate-700">
                {bid.amount}
              </td>
              <td className="p-5 text-sm">
                {bid.score ? (
                  <div className="flex items-center gap-3">
                    <div className="w-24 bg-gray-100 rounded-full h-1.5">
                      <div
                        className="bg-blue-600 h-1.5 rounded-full"
                        style={{ width: `${bid.score}%` }}
                      ></div>
                    </div>
                    <span className="font-medium text-slate-600">
                      {bid.score}
                    </span>
                  </div>
                ) : (
                  <span className="text-gray-300">-</span>
                )}
              </td>
              <td className="p-5">
                <span
                  className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wide border ${getStatusStyles(
                    bid.status
                  )}`}
                >
                  {bid.status}
                </span>
              </td>
              <td className="p-5 flex justify-center items-center">
                <button className="text-gray-600 h-8 w-8 flex justify-center items-center hover:bg-zinc-200 rounded-lg cursor-pointer hover:text-blue-600 transition-colors">
                  <Eye size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BidsTable;
