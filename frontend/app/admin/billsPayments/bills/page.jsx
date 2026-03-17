"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  Download,
  Plus,
  Search,
  Eye,
  MoreVertical,
  CheckCircle,
  XCircle,
  FileText,
  IndianRupee,
  Clock,
  Calendar,
  X,
  Info,
} from "lucide-react";

const page = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [openMenu, setOpenMenu] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  //   const [openModal, setOpenModal] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const [openSubmitModal, setOpenSubmitModal] = useState(false);


  const menuRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const bills = [
    {
      id: "BILL-2024-0125",
      project: "Ward 15 Road Reconstruction",
      contractor: "ABC Constructions",
      milestone: "Base Layer Completion",
      amount: "₹45.2 L",
      mb: "MB-2024-0456",
      date: "1/15/2024",
      status: "UNDER REVIEW",
    },
    {
      id: "BILL-2024-0124",
      project: "Sewerage Line Extension",
      contractor: "XYZ Infrastructure",
      milestone: "Pipeline Phase 1",
      amount: "₹32.8 L",
      mb: "MB-2024-0455",
      date: "1/12/2024",
      status: "APPROVED",
    },
    {
      id: "BILL-2024-0123",
      project: "Community Hall Construction",
      contractor: "BuildRight Corp",
      milestone: "Foundation Work",
      amount: "₹68.5 L",
      mb: "MB-2024-0454",
      date: "1/10/2024",
      status: "PAID",
    },
    {
      id: "BILL-2024-0122",
      project: "Street Light Installation",
      contractor: "ElectroCon Ltd",
      milestone: "Installation Phase 2",
      amount: "₹18.9 L",
      mb: "MB-2024-0453",
      date: "1/8/2024",
      status: "REJECTED",
    },
  ];

  const filteredBills =
    activeTab === "All"
      ? bills
      : bills.filter((b) => b.status === activeTab.toUpperCase());

  const statusStyle = {
    "UNDER REVIEW": "bg-yellow-100 text-yellow-700",
    APPROVED: "bg-green-100 text-green-700",
    PAID: "bg-green-600 text-white",
    REJECTED: "bg-red-100 text-red-600",
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 mt-12">
      {/* HEADER */}
      <div className="flex justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Bill Management</h1>
          <p className="text-gray-500">
            Submit and track milestone-linked bills
          </p>
        </div>

        <div className="flex gap-3">
          <button className="border border-gray-300 px-4 py-2 rounded-lg bg-white flex items-center gap-2">
            <Download size={16} /> Export
          </button>

        <button
  onClick={() => setOpenSubmitModal(true)}
  className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
>
  <Plus size={16} /> Submit New Bill
</button>

        </div>
      </div>

      {/* TABS */}
      <div className="flex gap-6 mb-4 text-sm font-medium">
        {["All", "Pending", "Approved", "Paid", "Rejected"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg ${
              activeTab === tab
                ? "bg-white shadow border border-gray-300"
                : "text-gray-500"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* TABLE */}
      <div className="bg-white border border-gray-300 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="p-4 text-left">BILL ID</th>
              <th className="p-4 text-left">PROJECT</th>
              <th className="p-4 text-left">MILESTONE</th>
              <th className="p-4 text-left">AMOUNT</th>
              <th className="p-4 text-left">MB</th>
              <th className="p-4 text-left">DATE</th>
              <th className="p-4 text-left">STATUS</th>
              <th className="p-4 text-left">ACTIONS</th>
            </tr>
          </thead>

          <tbody>
            {filteredBills.map((b, i) => (
              <tr key={i} className="border-t border-gray-300   ">
                <td className="p-4 font-medium">{b.id}</td>

                <td className="p-4">
                  <p className="font-medium text-blue-600">{b.project}</p>
                  <p className="text-xs text-gray-500">{b.contractor}</p>
                </td>

                <td className="p-4">{b.milestone}</td>
                <td className="p-4 font-medium">{b.amount}</td>
                <td className="p-4 text-blue-600">{b.mb}</td>

                <td className="p-4 flex items-center gap-2">
                  <Calendar size={14} /> {b.date}
                </td>

                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyle[b.status]}`}
                  >
                    {b.status}
                  </span>
                </td>

                {/* ACTIONS */}
                <td className="p-4 flex items-center gap-4 relative">
                  {/* 👁 Eye */}
                  <Eye
                    className="cursor-pointer"
                    size={18}
                    onClick={() => {
                      setSelectedBill(b);
                      setOpenModal(true);
                    }}
                  />

                  {/* ... MENU */}
                  <button onClick={() => setOpenMenu(i)}>
                    <MoreVertical size={18} />
                  </button>

                  {openMenu === i && (
                    <div
                      ref={menuRef}
                      className="absolute right-0 top-8 bg-white border border-gray-300 rounded-lg shadow-lg w-48 z-50"
                    >
                      <MenuItem icon={<Eye size={16} />} label="View Details" />
                      <MenuItem
                        icon={<Download size={16} />}
                        label="Download"
                      />
                      <MenuItem icon={<FileText size={16} />} label="View MB" />
                      <MenuItem
                        icon={
                          <CheckCircle size={16} className="text-green-600" />
                        }
                        label="Approve"
                        green
                      />
                      <MenuItem
                        icon={<XCircle size={16} className="text-red-600" />}
                        label="Reject"
                        red
                      />
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>



      {openSubmitModal && (
  <div
    onClick={() => setOpenSubmitModal(false)}
    className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
  >
    <div
      onClick={(e) => e.stopPropagation()}
      className="bg-white rounded-2xl `w-[520px]` border border-gray-200 p-6 relative shadow-xl"
    >
      {/* Close button */}
      <button
        onClick={() => setOpenSubmitModal(false)}
        className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
      >
        <X size={18} />
      </button>

      <h2 className="text-xl font-semibold mb-6">Submit New Bill</h2>

      <div className="space-y-4">
        {/* Project */}
        <div>
          <label className="text-sm font-medium text-gray-700">
            Project
          </label>
          <select
            className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option>Select project</option>
            <option>Ward 15 Road Reconstruction</option>
            <option>Sewerage Line Extension</option>
          </select>
        </div>

        {/* Milestone */}
        <div>
          <label className="text-sm font-medium text-gray-700">
            Milestone
          </label>
          <select
            className="w-full mt-1 border border-gray-200 rounded-lg px-3 py-2
                       bg-gray-50 text-gray-600"
          >
            <option>Select milestone</option>
            <option>Base Layer Completion</option>
            <option>Foundation Work</option>
          </select>
        </div>

        {/* Amount + MB */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700">
              Bill Amount (₹)
            </label>
            <input
              type="text"
              placeholder="Enter amount"
              className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              MB Reference
            </label>
            <input
              type="text"
              placeholder="MB-2024-XXXX"
              className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Remarks */}
        <div>
          <label className="text-sm font-medium text-gray-700">
            Remarks
          </label>
          <textarea
            rows={3}
            placeholder="Additional notes..."
            className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Upload box */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6
                        text-center text-gray-500 hover:border-blue-400 cursor-pointer">
          <div className="flex flex-col items-center gap-2">
            <svg
              className="w-6 h-6 text-gray-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M12 16V4m0 0L8 8m4-4l4 4" />
              <path d="M20 16v4H4v-4" />
            </svg>
            <span className="text-sm">
              Upload bill documents, MB sheets, etc.
            </span>
          </div>
        </div>
      </div>

      {/* Footer buttons */}
      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={() => setOpenSubmitModal(false)}
          className="border border-gray-300 px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Submit Bill
        </button>
      </div>
    </div>
  </div>
)}



      {openModal && selectedBill && (
        <div
          onClick={() => {
            setOpenModal(false);
            setSelectedBill(null);
          }}
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl `w-[700px]` border border-gray-300 p-6 relative"
          >
            <button
              onClick={() => {
                setOpenModal(false);
                setSelectedBill(null);
              }}
              className="absolute right-4 top-4"
            >
              <X />
            </button>

            <div className="flex justify-between mb-4">
              <h2 className="text-xl font-semibold">{selectedBill.id}</h2>
              <span
                className={`px-3 py-1 rounded-full text-sm ${statusStyle[selectedBill.status]}`}
              >
                {selectedBill.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-6 text-sm">
              <InfoBlock title="Project" value={selectedBill.project} />
              <InfoBlock title="Contractor" value={selectedBill.contractor} />
              <InfoBlock title="Milestone" value={selectedBill.milestone} />
              <InfoBlock title="MB Reference" value={selectedBill.mb} />
              <InfoBlock title="Submitted Date" value={selectedBill.date} />
              <InfoBlock title="Amount" value={selectedBill.amount} />
            </div>
          </div>
        </div>
      )}

      {/* MODAL (SECOND IMAGE) */}
      {openModal && (
        <div
          onClick={() => setOpenModal(false)}
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl `w-[700px]` border border-gray-300 p-6 relative"
          >
            <button
              onClick={() => setOpenModal(false)}
              className="absolute right-4 top-4"
            >
              <X />
            </button>

            <div className="flex justify-between mb-4">
              <h2 className="text-xl font-semibold">BILL-2024-0125</h2>
              <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm">
                UNDER REVIEW
              </span>
            </div>

            <div className="grid grid-cols-2 gap-6 text-sm">
              <InfoBlock title="Project" value="Ward 15 Road Reconstruction" />
              <InfoBlock title="Contractor" value="ABC Constructions" />
              <InfoBlock title="Milestone" value="Base Layer Completion" />
              <InfoBlock title="MB Reference" value="MB-2024-0456" />
              <InfoBlock title="Submitted Date" value="1/15/2024" />
              <InfoBlock title="Amount" value="₹45.2 L" />
            </div>

            <div className="mt-6 bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-500 text-sm">Remarks</p>
              <p>Awaiting quality verification report</p>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button className="border border-gray-300 px-4 py-2 rounded-lg flex items-center gap-2">
                <Download size={16} /> Download
              </button>
              <button className="border border-red-300 text-red-600 px-4 py-2 rounded-lg flex items-center gap-2">
                <XCircle size={16} /> Reject
              </button>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                <CheckCircle size={16} /> Approve
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default page;

/* COMPONENTS */
const MenuItem = ({ icon, label, red, green }) => (
  <div
    className={`flex items-center gap-3 px-4 py-2 cursor-pointer hover:bg-gray-100 ${
      red ? "text-red-600" : green ? "text-green-600" : ""
    }`}
  >
    {icon}
    {label}
  </div>
);

const InfoBlock = ({ title, value }) => (
  <div>
    <p className="text-gray-500">{title}</p>
    <p className="font-medium">{value}</p>
  </div>
);
