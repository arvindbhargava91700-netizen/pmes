"use client";

import React, { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import {
  Eye,
  MoreVertical,
  Download,
    XCircle,
  X,
  ArrowUpRight,
  CheckCircle,
  Clock,
} from "lucide-react";
import api from "@/components/Api/privetApi";
const formatBudget = (amount) => {
  if (!amount) return "₹0";
  const num = parseFloat(amount);
  if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`;
  if (num >= 100000) return `₹${(num / 100000).toFixed(2)} L`;
  return `₹${num.toLocaleString("en-IN")}`;
};
const getTextColor = (bgColor) => {
  if (!bgColor) return "#000";
  const color = bgColor.replace("#", "");
  const r = parseInt(color.substring(0, 2), 16);
  const g = parseInt(color.substring(2, 4), 16);
  const b = parseInt(color.substring(4, 6), 16);

  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 125 ? "#000" : "#fff";
};


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
      <h1 className="text-4xl font-bold">{formatBudget(payment.amount)}</h1>
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
      <div>
        <p className="text-gray-500">Approved Date</p>
        <p className="font-medium">{payment.approvedDate}</p>
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
      <h1 className="text-4xl font-bold">{formatBudget(payment.amount)}</h1>
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
          <div>
        <p className="text-gray-500">Approved Date</p>
        <p className="font-medium">{payment.approvedDate}</p>
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
      <h1 className="text-4xl font-bold">{formatBudget(payment.amount)}</h1>
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
      <h1 className="text-4xl font-bold">{formatBudget(payment.amount)}</h1>
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


// ================= MAIN COMPONENT =================
export default function Payments() {
  const [activeTab, setActiveTab] = useState("all");
  const [selectedStatusId, setSelectedStatusId] = useState(null);
  const [statuses, setStatuses] = useState([]);
  const [selected, setSelected] = useState(null);
  const [menuOpen, setMenuOpen] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
   const [selectedPayment, setSelectedPayment] = useState(null);
  const [label, setLabel] = useState("Download Receipt");
    const [confirmModal, setConfirmModal] = useState({
      open: false,
      action: null, // "approve" or "reject"
      id: null,
    });
  const badge = {
    completed: "bg-green-100 text-green-700",
    processing: "bg-yellow-100 text-yellow-700",
    pending: "bg-blue-100 text-blue-700",
    failed: "bg-red-100 text-red-700",
  };

  const menuRef = useRef(null);
 
  //==============================================load data========================================
  useEffect(() => {
    fetchPayment(1, selectedStatusId); // reset to page 1
    fetchStatuses();
    const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setMenuOpen(null); // ✅ close menu
    }
  };

  document.addEventListener("mousedown", handleClickOutside);

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
  }, []);
  //==============================================Fetch data========================================
  const fetchStatuses = async () => {
    try {
      const res = await api.get("public/api/master/payment_status"); // your API
      setStatuses(res.data?.data || []);
    } catch (error) {
      console.error("Error fetching statuses:", error);
    }
  };

  const fetchPayment = async (page = 1, statusId = null) => {
    try {
      setLoading(true);
      let url = `public/api/master/payments?page=${page}`;
      if (statusId) {
        url += `&payment_status_id=${statusId}`;
      }
      const res = await api.get(url);
      const paginated = res.data?.data;
      const formatted = (paginated?.data || []).map((item) => ({
        main_id: item.id,
        id: item.payment_code,
        project: item.billing.project?.project_name || "-",
        contractor: item.billing.project.contractor?.contractor_name || "-",
        amount: Number(item.amount),
        bill: item.billing?.bill_number || '-',
        date: item.payment_date || "-",
        remarks: item.remarks || "-",
        status: item.status?.name || "UNDER REVIEW",
        statusColor: item.status?.color,
        payment_slip: item.payment_slip || "-",
        txn: item.transaction_id || "-",
        bank:item.payment_bank_name || "-",
        approvedBy: item.approved_by?.name || "-",
        approvedDate: item.approved_date || "-",
      }));

      setPayments(formatted);
      setPagination(paginated);
      setCurrentPage(paginated.current_page);

    } catch (error) {
      console.error("Error fetching Payments:", error);
    } finally {
      setLoading(false);
    }
  };
  ///================ handle Download ============================
    const handleDownload = async (fullUrl) => {
    try {
      setLabel("Downloading...");
      const fileName = fullUrl.split("/").pop(); // e.g., '1773834329_images.png'
      console.log(fullUrl);
      const downloadUrl = `public/api/master/payment/download/${fileName}`;
      const res = await api.get(downloadUrl, { responseType: 'blob' });
      const blobUrl = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(blobUrl);
      setLabel("Download Receipt");
    } catch (error) {
      console.error("Download failed:", error);
       setLabel("Download Receipt");
      alert("Download failed. Please check authentication or file access.");
    }
  };
  //========================== update promsises =============================================
  const [statusLoading, setStatusLoading] = useState(false);
  const handleConfirmAction = async () => {
    try {
      setStatusLoading(true);
      await updatePaymentStatus(confirmModal.id, confirmModal.action);
      setConfirmModal({ open: false, action: null, id: null });
      // optional: refresh list or update UI
      fetchPayment(1, selectedStatusId); // reset to page 1
      
    } catch (err) {
      // toast.error("Something went wrong!");
      setConfirmModal({ ...confirmModal, open: false })
    } finally {
      setStatusLoading(false);
    }
  };
  const updatePaymentStatus = async (id, action) => {
    try {
      const payload = {
        status: action === "approve" ? "APPROVED" : "REJECTED",
      };
      const res = await api.post(`/public/api/master/payment/${id}/status`, payload);
      toast.success(res.data.message || "Status updated successfully");
      return res;
    } catch (error) {
      const message =
        error?.response?.data?.message || "Status update failed";
      toast.error(message);
      throw error;
    }
  };


  return (
    <div className="p-6 bg-gray-50 min-h-screen mt-12">
    {/* TABS */}
<div className="flex flex-wrap gap-2 mb-4">

  {/* ALL TAB */}
  <button
    onClick={() => {
      setActiveTab("all");
      setSelectedStatusId(null);
      fetchPayment(1, null); // ✅ reset page + fetch
    }}
    className={`px-4 py-2 rounded-xl text-sm font-medium transition
      ${activeTab === "all"
        ? "bg-blue-600 text-white shadow"
        : "bg-white text-gray-600 border hover:bg-gray-100"}
    `}
  >
    All
  </button>

  {/* STATUS TABS */}
  {statuses.map((s) => (
    <button
      key={s.id}
      onClick={() => {
        setActiveTab(s.id); // ✅ use id (better than name)
        setSelectedStatusId(s.id);
        fetchPayment(1, s.id); // ✅ reset page + fetch
      }}
      className={`px-4 py-2 rounded-xl text-sm font-medium transition
        ${activeTab === s.id
          ? "bg-blue-600 text-white shadow"
          : "bg-white text-gray-600 border hover:bg-gray-100"}
      `}
    >
      {s.name}
    </button>
  ))}
</div>

      {/* TABLE FOR ACTIVE TAB */}
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

          <tbody>{/* ✅ loading + empty fix */}
            {loading ? (
              <tr>
                <td colSpan="7" className="text-center p-6">
                  Loading...
                </td>
              </tr>
            ): payments.length === 0 ? (
                 <tr>
                   <td colSpan="7" className="text-center p-6">
                     No Payments found
                   </td>
                 </tr>
               ) : (
              payments.map((p, i) => (
                <tr key={i} className="border-t border-gray-300 ">
                  <td className="p-3">
                    <p className="font-semibold">{p.id}</p>
                    <span className="text-blue-600 text-xs">{p.bill}</span>
                  </td>
                  <td>{p.project}</td>
                  <td>{p.contractor}</td>
                  <td className="font-semibold">{formatBudget(p.amount)}</td>
                  <td>{p.date}</td>
                  <td>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold`}
                       style={{
                        backgroundColor: p.statusColor || "#e5e7eb",
                        color: getTextColor(p.statusColor),
                      }}
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
                             ref={menuRef} 
                            className="flex gap-2 w-full p-2 hover:bg-gray-100 rounded-lg"
                          >
                            <Eye size={16} /> View Details
                          </button>
                          <button className="flex gap-2 w-full p-2 hover:bg-gray-100 rounded-lg" onClick={() => handleDownload(p.payment_slip)}>
                            <Download size={16}  /> {label}
                          </button>

                          <MenuItem
                          icon={<CheckCircle size={16} />}
                          label="Approve"
                          green
                          onClick={() => {
                            setSelectedPayment(p); // store full bill or b.id
                            setConfirmModal({ open: true, action: "approve", id:p.main_id });
                          }}
                        />

                        <MenuItem
                          icon={<XCircle size={16} />}
                          label="Reject"
                          red
                          onClick={() => {
                            setSelectedPayment(p);
                            setConfirmModal({ open: true, action: "reject", id: p.main_id });
                          }}
                        />
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
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
                    const page = Number(new URL(link.url).searchParams.get("page"));
                    fetchPayment(page, selectedStatusId); // ✅ FIXED
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
            {selected.status === "COMPLETED" && (
              <CompletedModal
                payment={selected}
                onClose={() => setSelected(null)}
              />
            )}

            {selected.status === "PROCESSING" && (
              <ProcessingModal
                payment={selected}
                onClose={() => setSelected(null)}
              />
            )}

            {selected.status === "PENDING" && (
              <PendingModal
                payment={selected}
                onClose={() => setSelected(null)}
              />
            )}

            {selected.status === "FAILED" && (
              <FailedModal payment={selected} onClose={() => setSelected(null)} />
            )}
          </div>
        )}

              {/* Confirmed Model */}
      {confirmModal.open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-80 text-center">
            <h2 className="text-lg font-semibold mb-4">
              Are you sure you want to {confirmModal.action} this bill?
            </h2>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setConfirmModal({ ...confirmModal, open: false })}
                className="px-4 py-2 border rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAction}
                disabled={statusLoading}
                className={`px-4 py-2 rounded-lg text-white ${confirmModal.action === "approve"
                    ? "bg-green-600"
                    : "bg-red-600"
                  } ${statusLoading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {statusLoading ? "Processing..." : "Yes"}
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
/* COMPONENTS */
const MenuItem = ({ icon, label, red, green, onClick }) => (
  <button
    type="button"
    onClick={(e) => {
      e.stopPropagation(); // ✅ prevents parent close issue
      onClick && onClick();
    }}
    className={`w-full flex items-center gap-3 px-4 py-2 text-left 
      hover:bg-gray-100 transition
      ${red ? "text-red-600" : green ? "text-green-600" : "text-gray-700"}
    `}
  >
    {icon}
    {label}
  </button>
);

