"use client";

import React, { useState, useRef, useEffect } from "react";

import {
  Eye,
  MoreVertical,
  Download,
  X,
  ArrowUpRight,
  CheckCircle,
  Clock,
} from "lucide-react";
import api from "@/components/Api/privetApi";

// const paymentsData = [
//   {
//     id: "PAY-2024-0089",
//     bill: "BILL-2024-0123",
//     project: "Community Hall Construction",
//     contractor: "BuildRight Corp",
//     amount: "₹68.5 L",
//     date: "1/18/2024",
//     status: "completed",
//     txn: "TXN20240118001",
//     bank: "SBI",
//     approvedBy: "Commissioner",
//   },
//   {
//     id: "PAY-2024-0088",
//     bill: "BILL-2024-0122",
//     project: "Ward 15 Road Reconstruction",
//     contractor: "ABC Constructions",
//     amount: "₹45.2 L",
//     date: "1/15/2024",
//     status: "processing",
//     txn: "TXN20240115002",
//     bank: "HDFC",
//     approvedBy: "Accounts Officer",
//   },
//   {
//     id: "PAY-2024-0087",
//     bill: "BILL-2024-0121",
//     project: "Sewerage Line Extension",
//     contractor: "XYZ Infrastructure",
//     amount: "₹32.8 L",
//     date: "1/10/2024",
//     status: "completed",
//     txn: "TXN20240110003",
//     bank: "PNB",
//     approvedBy: "Commissioner",
//   },

//   {
//     id: "PAY-2024-0086",
//     bill: "BILL-2024-0120",
//     project: "Park Development",
//     contractor: "GreenScape Builders",
//     amount: "₹25.0 L",
//     date: "1/8/2024",
//     status: "pending",
//   },
//   {
//     id: "PAY-2024-0085",
//     bill: "BILL-2024-0119",
//     project: "Street Light Installation",
//     contractor: "ElectroCon Ltd",
//     amount: "₹18.9 L",
//     date: "1/5/2024",
//     status: "failed",
//     txn: "TXN20240105003",
//   },
// ];

// ================= MODAL COMPONENTS =================
const CompletedModal = ({ payment, onClose }) => (
  <div className="bg-white `w-[520px] `rounded-2xl shadow-xl p-6 relative">
    <button onClick={onClose} className="absolute right-4 top-4">
      <X size={18} />
    </button>
    <div className="flex items-center gap-3 mb-6">
      <h2 className="font-bold text-lg">{payment.id}</h2>
      <span className="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
        <CheckCircle size={14} /> COMPLETED
      </span>
    </div>
    <div className="text-center mb-8">
      <p className="text-gray-500 text-sm">Amount</p>
      <h1 className="text-4xl font-bold">{payment.amount}</h1>
    </div>
    <div className="grid grid-cols-2 gap-6 text-sm">
      <div>
        <p className="text-gray-500">Project</p>
        <p className="font-medium text-blue-600">{payment.project}</p>
      </div>
      <div>
        <p className="text-gray-500">Contractor</p>
        <p className="font-medium flex gap-1 items-center">
          {payment.contractor} <ArrowUpRight size={14} />
        </p>
      </div>
      <div>
        <p className="text-gray-500">Bill Reference</p>
        <p className="font-medium text-blue-600">{payment.bill}</p>
      </div>
      <div>
        <p className="text-gray-500">Date</p>
        <p className="font-medium">{payment.date}</p>
      </div>
      <div>
        <p className="text-gray-500">Transaction Reference</p>
        <p className="font-medium">{payment.txn}</p>
      </div>
      <div>
        <p className="text-gray-500">Bank</p>
        <p className="font-medium">{payment.bank}</p>
      </div>
      <div>
        <p className="text-gray-500">Approved By</p>
        <p className="font-medium">{payment.approvedBy}</p>
      </div>
    </div>
    <button className="mt-8 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl flex justify-center gap-2">
      <Download size={16} /> Download Receipt
    </button>
  </div>
);

const ProcessingModal = ({ payment, onClose }) => (
  <div className="bg-white `w-[520px]` rounded-2xl shadow-xl p-6 relative">
    <button onClick={onClose} className="absolute right-4 top-4">
      <X size={18} />
    </button>
    <div className="flex items-center gap-3 mb-6">
      <h2 className="font-bold text-lg">{payment.id}</h2>
      <span className="flex gap-1 items-center bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-semibold">
        <Clock size={14} /> PROCESSING
      </span>
    </div>
    <div className="text-center mb-8">
      <p className="text-gray-500 text-sm">Amount</p>
      <h1 className="text-4xl font-bold">{payment.amount}</h1>
    </div>
    <div className="grid grid-cols-2 gap-6 text-sm">
      <div>
        <p className="text-gray-500">Project</p>
        <p className="font-medium text-blue-600">{payment.project}</p>
      </div>
      <div>
        <p className="text-gray-500">Contractor</p>
        <p className="font-medium flex gap-1 items-center">
          {payment.contractor} <ArrowUpRight size={14} />
        </p>
      </div>
      <div>
        <p className="text-gray-500">Bill Reference</p>
        <p className="font-medium text-blue-600">{payment.bill}</p>
      </div>
      <div>
        <p className="text-gray-500">Date</p>
        <p className="font-medium">{payment.date}</p>
      </div>
      <div>
        <p className="text-gray-500">Transaction Reference</p>
        <p className="font-medium">{payment.txn}</p>
      </div>
      <div>
        <p className="text-gray-500">Bank</p>
        <p className="font-medium">{payment.bank}</p>
      </div>
      <div>
        <p className="text-gray-500">Approved By</p>
        <p className="font-medium">{payment.approvedBy}</p>
      </div>
    </div>
  </div>
);

const PendingModal = ({ payment, onClose }) => (
  <div className="bg-white `w-[520px]` rounded-2xl shadow-xl p-6 relative">
    <button onClick={onClose} className="absolute right-4 top-4">
      <X size={18} />
    </button>

    <div className="flex items-center gap-3 mb-6">
      <h2 className="font-bold text-lg">{payment.id}</h2>
      <span className="flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
        <Clock size={14} /> PENDING
      </span>
    </div>

    <div className="text-center mb-8">
      <p className="text-gray-500 text-sm">Amount</p>
      <h1 className="text-4xl font-bold">{payment.amount}</h1>
    </div>

    <div className="grid grid-cols-2 gap-6 text-sm">
      <div>
        <p className="text-gray-500">Project</p>
        <p className="font-medium text-blue-600 flex items-center gap-1">
          {payment.project} <ArrowUpRight size={14} />
        </p>
      </div>

      <div>
        <p className="text-gray-500">Contractor</p>
        <p className="font-medium">{payment.contractor}</p>
      </div>

      <div>
        <p className="text-gray-500">Bill Reference</p>
        <p className="font-medium text-blue-600">{payment.bill}</p>
      </div>

      <div>
        <p className="text-gray-500">Date</p>
        <p className="font-medium">{payment.date}</p>
      </div>
    </div>
  </div>
);

const FailedModal = ({ payment, onClose }) => (
  <div className="bg-white `w-[520px]` rounded-2xl shadow-xl p-6 relative">
    <button onClick={onClose} className="absolute right-4 top-4">
      <X size={18} />
    </button>

    {/* HEADER */}
    <div className="flex items-center gap-3 mb-6">
      <h2 className="font-bold text-lg">{payment.id}</h2>
      <span className="flex items-center gap-1 bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-semibold">
        FAILED
      </span>
    </div>

    {/* AMOUNT */}
    <div className="text-center mb-8 bg-gray-50 py-8 rounded-xl">
      <p className="text-gray-500 text-sm">Amount</p>
      <h1 className="text-4xl font-bold">{payment.amount}</h1>
    </div>

    {/* DETAILS */}
    <div className="grid grid-cols-2 gap-6 text-sm">
      <div>
        <p className="text-gray-500">Project</p>
        <p className="font-medium text-blue-600 flex items-center gap-1">
          {payment.project} <ArrowUpRight size={14} />
        </p>
      </div>

      <div>
        <p className="text-gray-500">Contractor</p>
        <p className="font-medium">{payment.contractor}</p>
      </div>

      <div>
        <p className="text-gray-500">Bill Reference</p>
        <p className="font-medium text-blue-600">{payment.bill}</p>
      </div>

      <div>
        <p className="text-gray-500">Date</p>
        <p className="font-medium">{payment.date}</p>
      </div>

      <div>
        <p className="text-gray-500">Transaction Reference</p>
        <p className="font-medium">{payment.txn}</p>
      </div>
    </div>

    {/* ACTION */}
    <button className="mt-8 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl flex justify-center gap-2">
      Retry Payment
    </button>
  </div>
);

// ================= TAB TABLE COMPONENT =================
const PaymentsTable = ({ payments, type }) => {
  const [selected, setSelected] = useState(null);
  const [menuOpen, setMenuOpen] = useState(null);
  const [pagination, setPagination] = useState({});





        const [currentPage, setCurrentPage] = useState(1);

       const menuRef = useRef(null);
       //==============================================load data========================================
       useEffect(() => {
         fetchStatuses();
       }, []);
       //==============================================Fetch data========================================
       const fetchStatuses = async () => {
         try {
           const res = await api.get("public/api/master/billing_status"); // your API
           setStatuses(res.data?.data || []);
         } catch (error) {
           console.error("Error fetching statuses:", error);
         }
       };







  const badge = {
    completed: "bg-green-100 text-green-700",
    processing: "bg-yellow-100 text-yellow-700",
    pending: "bg-blue-100 text-blue-700",
    failed: "bg-red-100 text-red-700",
  };

  return (
    <div className="bg-white rounded-2xl shadow overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-3 text-left">PAYMENT ID</th>
            <th>PROJECT</th>
            <th>CONTRACTOR</th>
            <th>AMOUNT</th>
            <th>DATE</th>
            <th>STATUS</th>
            <th>ACTIONS</th>
          </tr>
        </thead>

        <tbody>
          {payments.map((p, i) => (
            <tr key={i} className="border-t border-gray-300 ">
              <td className="p-3">
                <p className="font-semibold">{p.id}</p>
                <span className="text-blue-600 text-xs">{p.bill}</span>
              </td>
              <td>{p.project}</td>
              <td>{p.contractor}</td>
              <td className="font-semibold">{p.amount}</td>
              <td>{p.date}</td>
              <td>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${badge[p.status]}`}
                >
                  {p.status.toUpperCase()}
                </span>
              </td>
              <td className="flex gap-2 p-3">
                <button
                  onClick={() => setSelected(p)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <Eye size={18} />
                </button>
                <div className="relative">
                  <button
                    onClick={() => setMenuOpen(menuOpen === i ? null : i)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <MoreVertical size={18} />
                  </button>
                  {menuOpen === i && (
                    <div className="absolute right-0 top-10 bg-white shadow-xl rounded-xl p-2 w-44 z-20">
                      <button
                        onClick={() => {
                          setSelected(p);
                          setMenuOpen(null);
                        }}
                        className="flex gap-2 w-full p-2 hover:bg-gray-100 rounded-lg"
                      >
                        <Eye size={16} /> View Details
                      </button>
                      <button className="flex gap-2 w-full p-2 hover:bg-gray-100 rounded-lg">
                        <Download size={16} /> Download Receipt
                      </button>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
              <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-6 px-4 md:px-6 py-3 bg-white border border-gray-200 rounded-xl shadow-sm">

          {/* Left Info */}
          <p className="text-sm text-gray-500">
            Showing page {pagination?.current_page} of {pagination?.last_page}
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap gap-2 justify-center">
            {pagination?.links?.map((link, i) => (
              <button
                key={i}
                disabled={!link.url}
                onClick={() => {
                  if (link.url) {
                    const page = new URL(link.url).searchParams.get("page");
                    fetchBills(1, selectedStatusId); // reset to page 1
                  }
                }}
                className={`px-4 py-1.5 text-sm rounded-lg border transition duration-150
          ${link.active
                    ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                    : "bg-white hover:bg-gray-100 text-gray-700"}
          ${!link.url ? "opacity-40 cursor-not-allowed" : ""}
        `}
                dangerouslySetInnerHTML={{ __html: link.label }}
              />
            ))}
          </div>
        </div>

      {/* MODAL */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          {selected.status === "completed" && (
            <CompletedModal
              payment={selected}
              onClose={() => setSelected(null)}
            />
          )}
          {selected.status === "processing" && (
            <ProcessingModal
              payment={selected}
              onClose={() => setSelected(null)}
            />
          )}
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          {selected.status === "completed" && (
            <CompletedModal
              payment={selected}
              onClose={() => setSelected(null)}
            />
          )}

          {selected.status === "processing" && (
            <ProcessingModal
              payment={selected}
              onClose={() => setSelected(null)}
            />
          )}

          {selected.status === "pending" && (
            <PendingModal
              payment={selected}
              onClose={() => setSelected(null)}
            />
          )}
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          {selected.status === "completed" && (
            <CompletedModal
              payment={selected}
              onClose={() => setSelected(null)}
            />
          )}

          {selected.status === "processing" && (
            <ProcessingModal
              payment={selected}
              onClose={() => setSelected(null)}
            />
          )}

          {selected.status === "pending" && (
            <PendingModal
              payment={selected}
              onClose={() => setSelected(null)}
            />
          )}

          {selected.status === "failed" && (
            <FailedModal payment={selected} onClose={() => setSelected(null)} />
          )}
        </div>
      )}
    </div>
  );
};

// ================= MAIN COMPONENT =================
export default function Payments() {
  const [activeTab, setActiveTab] = useState("all");
       const [statuses, setStatuses] = useState([]);
       const [paymentsData, setPayment] = useState([]);
       const [loading, setLoading] = useState(false);
       const menuRef = useRef(null);
           const [selectedStatusId, setSelectedStatusId] = useState(null);
       //==============================================load data========================================
       useEffect(() => {
         fetchPayments(1, selectedStatusId); // reset to page 1
         fetchStatuses();
       }, []);
       
           const fetchPayments = async (page = 1, statusId = null) => {
           try {
             setLoading(true);
       
             let url = `public/api/master/payments?page=${page}`;
       
             // ✅ add status filter
             if (statusId) {
               url += `&payment_status_id=${statusId}`;
             }
             const res = await api.get(url);
             const paginated = res.data?.data;
             const formatted = (paginated?.data || []).map((item) => ({
               main_id: item.id,
               id: item.payment_code,
               project: item.project?.project_name || "-",
               contractor: item.project?.project_description || "-",
               amount: Number(item.amount),
               date: item.payment_date || "-",
               status: item.status?.name || "UNDER REVIEW",
               statusColor: item.status?.color,
             }));
       
             setPayment(formatted);
             setPagination(paginated);
             setCurrentPage(paginated.current_page);
       
           } catch (error) {
             console.error("Error fetching payment:", error);
           } finally {
             setLoading(false);
           }
         };

         const tabData = {
    all: paymentsData,
    completed: paymentsData.filter((p) => p.status === "completed"),
    processing: paymentsData.filter((p) => p.status === "processing"),
    pending: paymentsData.filter((p) => p.status === "pending"),
    failed: paymentsData.filter((p) => p.status === "failed"),
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen mt-12">
     <div className="flex gap-2 mb-4 flex-wrap">
        {/* ALL TAB */}
        <button
          onClick={() => {
            setActiveTab("all");
            setSelectedStatusId(null);
          }}
          className={`px-4 py-2 rounded-xl text-sm font-medium ${
            activeTab === "all"
              ? "bg-blue-600 text-white"
              : "bg-white shadow"
          }`}
        >
          All Payments
        </button>

        {/* DYNAMIC STATUS TABS */}
        {statuses.map((s) => (
          <button
            key={s.id}
            onClick={() => {
              setActiveTab(s.name.toLowerCase()); // normalize
              setSelectedStatusId(s.id);
            }}
            className={`px-4 py-2 rounded-xl text-sm font-medium ${
              activeTab === s.name.toLowerCase()
                ? "bg-blue-600 text-white"
                : "bg-white shadow"
            }`}
          >
            {s.name}
          </button>
        ))}
      </div>

      {/* TABLE FOR ACTIVE TAB */}
      <PaymentsTable payments={tabData[activeTab]} type={activeTab} />
    </div>
  );
}
