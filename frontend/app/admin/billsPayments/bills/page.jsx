"use client";
import React, { useState, useRef, useEffect } from "react";
import ExportMenu from "@/components/ExportMenu";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
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
import api from "@/components/Api/privetApi";
import toast from "react-hot-toast";
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
const getTodayDate = () => {
  return new Date().toISOString().split("T")[0];
};

const page = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [selectedStatusId, setSelectedStatusId] = useState(null);
  const [openMenu, setOpenMenu] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  //   const [openModal, setOpenModal] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const [openSubmitModal, setOpenSubmitModal] = useState(false);
  const [form, setForm] = useState({
    project_id: "",
    milestone_id: "",
    amount: "",
    mb_number: "",
    bill_date: getTodayDate(), // ✅ auto today
    billing_status_id: "",
    remarks: "",
    billing_documents: null,
  });

  const [errors, setErrors] = useState({});

  const [bills, setBills] = useState([]);
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [statuses, setStatuses] = useState([]);
  const [projects, setProjects] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [load, setLoad] = useState(false);
  const [label, setLabel] = useState("Download");

  const [confirmModal, setConfirmModal] = useState({
    open: false,
    action: null, // "approve" or "reject"
    id: null,
  });

  const menuRef = useRef(null);
  //==============================================load data========================================
  useEffect(() => {
    fetchBills(1, selectedStatusId); // reset to page 1
    fetchStatuses();
    fetchProjects();
    fetchMilestones();
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


  const fetchBills = async (page = 1, statusId = null) => {
    try {
      setLoading(true);

      let url = `public/api/master/billings?page=${page}`;

      // ✅ add status filter
      if (statusId) {
        url += `&billing_status_id=${statusId}`;
      }

      const res = await api.get(url);

      const paginated = res.data?.data;

      const formatted = (paginated?.data || []).map((item) => ({
        main_id: item.id,
        id: item.bill_number,
        project: item.project?.project_name || "-",
        contractor: item.project?.project_description || "-",
        milestone: item.milestone?.name || "-",
        amount: Number(item.amount),
        mb: item.mb_number || "-",
        date: item.bill_date || "-",
        remarks: item.remarks || "-",
        status: item.status?.name || "UNDER REVIEW",
        statusColor: item.status?.color,
        billing_documents: item.billing_documents || "-",
      }));

      setBills(formatted);
      setPagination(paginated);
      setCurrentPage(paginated.current_page);

    } catch (error) {
      console.error("Error fetching bills:", error);
    } finally {
      setLoading(false);
    }
  };
  const fetchProjects = async () => {
    try {
      const res = await api.get("public/api/master/projects");
      setProjects(res.data.data?.data || []);
    } catch (error) {
      console.error("Error fetching Projects:", error);
    }
  };
  const fetchMilestones = async () => {
    try {
      const res = await api.get("public/api/master/milestones");
      setMilestones(res.data?.data || []);
    } catch (error) {
      console.error("Error fetching Milestones:", error);
    }
  };





  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);
  //==============================================Active Tab========================================
  const filteredBills =
    activeTab === "All"
      ? bills
      : bills.filter((b) => b.status === activeTab);

  //================================ form Insertion=================================================
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    const newValue = files ? files[0] : value;
    setForm((prev) => ({
      ...prev,
      [name]: newValue,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };


  const handleSubmit = () => {
    const data = new FormData();

    Object.keys(form).forEach((key) => {
      if (key === "billing_documents") {
        if (form.billing_documents) {
          data.append(key, form.billing_documents);
        }
      } else {
        data.append(key, form[key] || "");
      }
    });

    setLoad(true);

    api.post("/public/api/master/billings", data, {
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then((res) => {
        toast.success(res.data?.message || "Billing created ✅");
        setErrors({});

        // ✅ reset form
        setForm({
          project_id: "",
          milestone_id: "",
          amount: "",
          mb_number: "",
          bill_date: new Date().toISOString().split("T")[0],
          billing_status_id: "",
          remarks: "",
          billing_documents: null,
        });
        setOpenSubmitModal(false);
        fetchBills(1, selectedStatusId); // reset to page 1
      })
      .catch((err) => {
        if (err.response?.status === 422) {
          const backendErrors = err.response.data.message;
          setErrors(backendErrors);
        } else {
          toast.error("Server error ❌");
        }
      })
      .finally(() => {
        setLoad(false);
      });
  };
  //===============================handle excel =============================
  // npm install xlsx file-saver  =>excel,copy
  //npm install jspdf jspdf-autotable =>pdf,csv

  const handleExcel = () => {
    const data = bills.map((b) => ({
      "Bill ID": b.id,
      Project: b.project,
      Contractor: b.contractor,
      Milestone: b.milestone,
      Amount: b.amount,
      MB: b.mb,
      Date: b.date,
      Status: b.status,
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Bills");

    const buffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });

    saveAs(
      new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }),
      "Bills.xlsx"
    );
  };
  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(bills));
    alert("Copied!");
  };
  const handlePDF = () => {
    if (!bills.length) {
      alert("No data to export");
      return;
    }

    const doc = new jsPDF();

    // Title
    doc.text("Billing Report", 14, 15);

    const tableColumn = [
      "Bill ID",
      "Project",
      "Milestone",
      "Amount",
      "MB",
      "Date",
      "Status",
    ];

    const tableRows = bills.map((b) => [
      b.id,
      b.project,
      b.milestone,
      `Rs. ${b.amount.toLocaleString("en-IN")}`,
      b.mb,
      b.date,
      b.status,
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save("Billing_Report.pdf");
  };
  const handleCSV = () => {
    if (!bills.length) {
      alert("No data to export");
      return;
    }

    const headers = [
      "Bill ID",
      "Project",
      "Contractor",
      "Milestone",
      "Amount",
      "MB",
      "Date",
      "Status",
    ];

    const rows = bills.map((b) => [
      b.id,
      b.project,
      b.contractor,
      b.milestone,
      b.amount,
      b.mb,
      b.date,
      b.status,
    ]);

    let csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((e) => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);

    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Billing_Data.csv");
    document.body.appendChild(link);

    link.click();
  };
  const handleDownload = async (fullUrl) => {
    try {
      setLabel("Downloading...");
      const fileName = fullUrl.split("/").pop(); // e.g., '1773834329_images.png'
      const downloadUrl = `public/api/master/billing/download/${fileName}`;
      const res = await api.get(downloadUrl, { responseType: 'blob' });
      const blobUrl = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(blobUrl);
      setLabel("Download");
    } catch (error) {
      console.error("Download failed:", error);
      setLabel("Download");
      alert("Download failed. Please check authentication or file access.");
    }
  };
  //=============================== preview image ========================================
  const [filePreview, setFilePreview] = useState(null);

  const handleChangeImage = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    setForm({ ...form, billing_documents: selectedFile });
    const url = URL.createObjectURL(selectedFile);
    setFilePreview({ url, type: selectedFile.type, name: selectedFile.name });
  };
  const removeFile = () => {
    setForm({ ...form, billing_documents: null }); // remove from form
    setFilePreview(null);
    document.getElementById("fileInput").value = null;
  };

  //========================== update promsises =============================================
  const [statusLoading, setStatusLoading] = useState(false);
  const handleConfirmAction = async () => {
    try {
      setStatusLoading(true);
      await updateBillStatus(confirmModal.id, confirmModal.action);
      setConfirmModal({ open: false, action: null, id: null });
      // optional: refresh list or update UI
      fetchBills(1, selectedStatusId); // reset to page 1

    } catch (err) {
      toast.error("Something went wrong!");
    } finally {
      setStatusLoading(false);
    }
  };
  const updateBillStatus = async (id, action) => {
    try {
      const payload = {
        status: action === "approve" ? "APPROVED" : "REJECTED",
      };
      const res = await api.post(`/public/api/master/bills/${id}/status`, payload);
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
    <div className="min-h-screen bg-gray-50 p-6 mt-12">
      {/* HEADER */}
      <div className="flex justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Bill Management</h1>
          <p className="text-gray-500">
            Submit and track milestone-linked bills
          </p>
        </div>

        <div className="flex items-center gap-3 mb-4">

          {/* Export */}
          <ExportMenu
            onExcel={handleExcel}
            onPDF={handlePDF}
            onCopy={handleCopy}
            onCSV={handleCSV}
            className="h-11"
          />

          {/* Submit Button */}
          <button
            onClick={() => setOpenSubmitModal(true)}
            className="h-11 px-5 bg-blue-600 text-white rounded-lg 
               flex items-center gap-2 
               hover:bg-blue-700 transition"
          >
            <Plus size={18} />
            Submit New Bill
          </button>

        </div>
      </div>

      {/* TABS */}
      <button
        onClick={() => {
          setActiveTab("All");
          setSelectedStatusId(null); // no filter
        }}
        className={`px-4 py-2 mb-2 rounded-lg ${activeTab === "All"
            ? "bg-white shadow border border-gray-300"
            : "text-gray-500"
          }`}
      >
        All
      </button>

      {statuses.map((s) => (
        <button
          key={s.id}
          onClick={() => {
            setActiveTab(s.name);
            setSelectedStatusId(s.id); // ✅ store id
          }}
          className={`px-4 py-2 mb-2 rounded-lg ${activeTab === s.name
              ? "bg-white shadow border border-gray-300"
              : "text-gray-500"
            }`}
        >
          {s.name}
        </button>
      ))}

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
            {/* ✅ loading + empty fix */}
            {loading ? (
              <tr>
                <td colSpan="8" className="text-center p-6">
                  Loading...
                </td>
              </tr>
            ) : filteredBills.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center p-6">
                  No bills found
                </td>
              </tr>
            ) : (
              filteredBills.map((b, i) => (
                <tr key={i} className="border-t border-gray-300">
                  <td className="p-4 font-medium">{b.id}</td>

                  <td className="p-4">
                    {/* ✅ FIXED */}
                    <p className="font-medium text-blue-600">{b.project}</p>
                    <p className="text-xs text-gray-500">
                      {b.contractor}
                    </p>
                  </td>

                  <td className="p-4">{b.milestone}</td>
                  <td className="p-4 font-medium">{formatBudget(b.amount)}</td>
                  <td className="p-4 text-blue-600">{b.mb}</td>

                  <td className="p-4 flex items-center gap-2">
                    <Calendar size={14} /> {b.date}
                  </td>

                  <td className="p-4">
                    <span
                      className="px-3 py-1 rounded-full text-xs font-medium"
                      style={{
                        backgroundColor: b.statusColor || "#e5e7eb",
                        color: getTextColor(b.statusColor),
                      }}
                    >
                      {b.status}
                    </span>
                  </td>

                  <td className="p-4 flex items-center gap-4 relative">
                    <Eye
                      className="cursor-pointer"
                      size={18}
                      onClick={() => {
                        setSelectedBill(b);
                        setOpenModal(true);
                      }}
                    />

                    <button className="cursor-pointer" onClick={() => setOpenMenu(i)}>
                      <MoreVertical size={18} />
                    </button>
                    {openMenu === i && (
                      <div
                        ref={menuRef}
                        className="absolute right-0 top-8 bg-white border border-gray-300 rounded-lg shadow-lg w-48 z-50"
                      >
                        <MenuItem onClick={() => {
                          setSelectedBill(b);
                          setOpenModal(true);
                        }} icon={<Eye size={16} />} label="View Details" />
                        <MenuItem
                          icon={<Download size={16} />}
                          label={label}
                          onClick={() => handleDownload(b.billing_documents)}
                        />

                        <MenuItem
                          icon={<FileText size={16} />}
                          label="View MB"
                          onClick={() => {
                            if (b.billing_documents) {
                              window.open(b.billing_documents, "_blank"); // open in new tab
                            } else {
                              alert("No file available");
                            }
                          }}
                        />
                        <MenuItem
                          icon={<CheckCircle size={16} />}
                          label="Approve"
                          green
                          onClick={() => {
                            setSelectedBill(b); // store full bill or b.id
                            setConfirmModal({ open: true, action: "approve", id: b.main_id });
                          }}
                        />

                        <MenuItem
                          icon={<XCircle size={16} />}
                          label="Reject"
                          red
                          onClick={() => {
                            setSelectedBill(b);
                            setConfirmModal({ open: true, action: "reject", id: b.main_id });
                          }}
                        />
                      </div>
                    )}
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
              <div className="grid grid-cols-2 gap-4">

                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Project
                  </label>
                  <select name="project_id" onChange={handleChange}
                    className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option>Select project</option>
                    {
                      projects.map((p, i) => (
                        <option key={i} value={p.id}>{p.project_name}</option>
                      ))}

                  </select>
                  {errors.project_id && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.project_id[0] ? 'The project field is required.' : ''}
                    </p>
                  )}
                </div>

                {/* Milestone */}
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Milestone
                  </label>
                  <select name="milestone_id" onChange={handleChange}
                    className="w-full mt-1 border border-gray-200 rounded-lg px-3 py-2
                      focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option>Select milestone</option>
                    {
                      milestones.map((item) => (
                        <option key={item.id} value={item.id}>{item.name}</option>
                      ))
                    }
                  </select>
                  {errors.milestone_id && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.milestone_id[0] ? 'The milestone field is required.' : ''}
                    </p>
                  )}
                </div>
              </div>

              {/* Amount + MB */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Bill Amount (₹)
                  </label>
                  <input name="amount" onChange={handleChange}
                    type="text"
                    placeholder="Enter amount"
                    className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.amount && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.amount[0]}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Bill Date
                  </label>

                  <input
                    type="date"
                    name="bill_date"
                    value={form.bill_date}
                    onChange={handleChange}
                    className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2
                focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  {errors.bill_date && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.bill_date[0]}
                    </p>
                  )}
                </div>
                <div >
                  <label className="text-sm font-medium text-gray-700">
                    MB Reference
                  </label>

                  <input
                    type="text"
                    name="mb_number"
                    onChange={handleChange}
                    placeholder="MB-2024-XXXX"
                    className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2
                    focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  {errors.mb_number && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.mb_number[0]}
                    </p>
                  )}
                </div>
                <div >
                  <label className="text-sm font-medium text-gray-700">
                    Billing Status
                  </label>

                  <select name="billing_status_id" onChange={handleChange}
                    className="w-full mt-1 border border-gray-200 rounded-lg px-3 py-2
                      focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option>Select Status</option>
                    {
                      //add here filter Only Show PENDING AND PAID add fileter
                      statuses.filter(item => item.name === "PENDING" || item.name === "PAID").map((item) => (
                        <option key={item.id} value={item.id}>{item.name}</option>
                      ))
                    }
                  </select>
                  {errors.billing_status_id && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.billing_status_id[0] ? 'The Billing Status field is required.' : ''}
                    </p>
                  )}
                </div>


              </div>


              {/* Remarks */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Remarks
                </label>
                <textarea
                  rows={3}
                  name="remarks" onChange={handleChange}
                  placeholder="Additional notes..."
                  className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.remarks && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.remarks[0]}
                  </p>
                )}
              </div>

              {/* Upload box */}
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center 
        cursor-pointer relative flex flex-col items-center justify-center"
                onClick={() => document.getElementById("fileInput").click()}
                style={{ minHeight: "150px" }}
              >
                {filePreview ? (
                  <>
                    {filePreview.type.startsWith("image/") ? (
                      <img
                        src={filePreview.url}
                        alt="Preview"
                        className="max-h-40 object-contain"
                      />
                    ) : filePreview.type === "application/pdf" ? (
                      <p className="text-gray-700">{filePreview.name}</p>
                    ) : (
                      <p className="text-gray-700">{filePreview.name}</p>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent opening file dialog
                        removeFile();
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
                    >
                      Remove
                    </button>
                  </>
                ) : (
                  <p>Click here to upload bill documents</p>
                )}
              </div>

              <input
                id="fileInput"
                type="file"
                name="billing_documents"
                onChange={handleChangeImage}
                className="hidden"
              />


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
                onClick={handleSubmit}
                disabled={load}
                className={`bg-blue-600 text-white px-4 py-2 rounded-lg
                    hover:bg-blue-700 transition
                    ${load ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {load ? "Submitting..." : "Submit Bill"}
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
                className="px-3 py-1 rounded-full text-sm"
                style={{
                  backgroundColor: selectedBill.bg_color,
                  color: selectedBill.text_color,
                }}
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
              <h2 className="text-xl font-semibold">{selectedBill.id}</h2>
              <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm" style={{
                backgroundColor: selectedBill.statusColor,
                color: getTextColor(selectedBill.statusColor),
              }}>

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

            <div className="mt-6 bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-500 text-sm">Remarks</p>
              <p>{selectedBill.remarks}</p>
            </div>

 
          </div>
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
  );
};

export default page;

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

const InfoBlock = ({ title, value }) => (
  <div>
    <p className="text-gray-500">{title}</p>
    <p className="font-medium">{value}</p>
  </div>
);
