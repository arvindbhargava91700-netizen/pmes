"use client";
import { MoreHorizontal, Plus } from "lucide-react";

export default function BillsPayments() {
  const stats = [
    { label: "Total Billed", value: "₹1.24 Cr", color: "text-gray-900" },
    { label: "Amount Paid", value: "₹48.3 L", color: "text-green-600" },
    { label: "Under Review", value: "₹28.0 L", color: "text-amber-500" },
    { label: "Pending", value: "₹48.2 L", color: "text-gray-600" },
  ];

  const bills = [
    {
      id: "BILL-001",
      milestone: "Site Clearance",
      amount: "₹12.5 L",
      submitted: "8/20/2024",
      status: "Paid",
    },
    {
      id: "BILL-002",
      milestone: "Excavation & Leveling",
      amount: "₹35.8 L",
      submitted: "10/5/2024",
      status: "Paid",
    },
    {
      id: "BILL-003",
      milestone: "Base Layer",
      amount: "₹48.2 L",
      submitted: "11/20/2024",
      status: "Approved",
    },
    {
      id: "BILL-004",
      milestone: "Drainage Work (Partial)",
      amount: "₹28.0 L",
      submitted: "1/10/2025",
      status: "Under Review",
    },
  ];

  const statusStyle = (status) => {
    switch (status) {
      case "Paid":
        return "bg-green-500 text-white";
      case "Approved":
        return "bg-blue-600 text-white";
      case "Under Review":
        return "bg-blue-500 text-white";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900">Bills & Payments</h2>

        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
          <Plus size={16} />
          Submit New Bill
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((item) => (
          <div
            key={item.label}
            className={`bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300`}
          >
            <p className="text-sm text-gray-500">{item.label}</p>
            <p className={`text-xl font-bold mt-1 ${item.color}`}>
              {item.value}
            </p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500">
            <tr>
              <th className="text-left px-6 py-4 font-semibold">BILL ID</th>
              <th className="text-left px-6 py-4 font-semibold">MILESTONE</th>
              <th className="text-left px-6 py-4 font-semibold">AMOUNT</th>
              <th className="text-left px-6 py-4 font-semibold">SUBMITTED</th>
              <th className="text-left px-6 py-4 font-semibold">STATUS</th>
              <th className="text-left px-6 py-4 font-semibold">ACTIONS</th>
            </tr>
          </thead>

          <tbody>
            {bills.map((bill, i) => (
              <tr
                key={bill.id}
                className="border-t border-gray-100 hover:bg-gray-50"
              >
                <td className="px-6 py-4 font-mono text-black">{bill.id}</td>
                <td className="px-6 py-4 font-medium">{bill.milestone}</td>
                <td className="px-6 py-4 font-semibold">{bill.amount}</td>
                <td className="px-6 py-4 text-gray-600">{bill.submitted}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyle(
                      bill.status
                    )}`}
                  >
                    {bill.status}
                  </span>
                </td>
                <td className="px-6 py-4 flex justify-center items-center">
                  <div className="hover:bg-zinc-200 w-8 h-8 text-gray-500 cursor-pointer flex justify-center items-center rounded-md hover:text-blue-500">
                    <MoreHorizontal size={18} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
