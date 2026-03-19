"use client";
import React, { useEffect, useState } from "react";
import {
  FileText,
  Clock,
  AlertTriangle,
  Search,
  Filter,
  Eye,
  MoreHorizontal,
  Download,
  Plus,
  MapPin,
  CheckCircle,
  Trash2,
  ArrowLeft,
  Edit3,
  IndianRupee,
  Users,
  Calendar,
  LayoutGrid,
  Milestone,
  UsersIcon,
} from "lucide-react";
import api from "@/components/Api/privetApi";
import { useQuery } from "@tanstack/react-query";
import SelectInput from "@/components/selectInput";
import { useRouter } from "next/navigation";

const tabs = [
  { id: "details", label: "Details", icon: LayoutGrid },
  { id: "milestones", label: "Milestones", icon: Milestone },
  { id: "bids", label: "Bids", icon: UsersIcon },
  { id: "documents", label: "Documents", icon: FileText },
];

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

const TenderDashboard = () => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [activeTab, setActiveTab] = useState("details");
  const [selectedDepartments, setSelectedDepartments] =
    useState("All Departments");
  const [appliedFilters, setAppliedFilters] = useState({
    status: "All Status",
    department: "All Departments",
  });

  // tender list
  const fetchTender = async () => {
    const res = await api.get("/public/api/tender");
    return res.data.data;
  };

  const {
    data: tenderData = [],
    isPending,
    isError,
  } = useQuery({
    queryKey: ["tenderList"],
    queryFn: fetchTender,
  });

  // tender cards
  const fetchCards = async () => {
    const res = await api.get("/public/api/tenders/counts");
    return res.data.data;
  };

  const { data: tenderCards = {} } = useQuery({
    queryKey: ["tenderCards"],
    queryFn: fetchCards,
  });

  // tender Status
  const fetchStatus = async () => {
    const res = await api.get("/public/api/master/tender_status");
    console.log(res.data);
    return res.data.data || [];
  };

  const { data: tenderStatus = [] } = useQuery({
    queryKey: ["tenderStatus"],
    queryFn: fetchStatus,
  });

  const statusOptions = [
    "All Status",
    ...(Array.isArray(tenderStatus)
      ? tenderStatus.map((item) => item.name)
      : []),
  ];

  // tender Department
  const fetchDepartments = async () => {
    const res = await api.get("/public/api/master/departments");
    console.log(res.data);
    return res.data || [];
  };

  const { data: tenderDepartments = [] } = useQuery({
    queryKey: ["tenderDepartments"],
    queryFn: fetchDepartments,
  });

  const DepartmentsOptions = [
    "All Departments",
    ...(Array.isArray(tenderDepartments)
      ? tenderDepartments.map((item) => item.name)
      : []),
  ];

  const filteredTenders = (tenderData || []).filter((t) => {
    const searchText = search.toLowerCase();

    const matchSearch =
      t.tender_id?.toLowerCase().includes(searchText) ||
      t.title?.toLowerCase().includes(searchText) ||
      t.description?.toLowerCase().includes(searchText);

    const matchStatus =
      appliedFilters.status === "All Status" ||
      t.status?.toLowerCase().trim() ===
        appliedFilters.status.toLowerCase().trim();

    const matchDepartment =
      appliedFilters.department === "All Departments" ||
      t.department?.toLowerCase().trim() ===
        appliedFilters.department.toLowerCase().trim();

    return matchSearch && matchStatus && matchDepartment;
  });

  const handleApplyFilters = () => {
    setAppliedFilters({
      status: selectedStatus,
      department: selectedDepartments,
    });

    setSelectedStatus("All Status");
    setSelectedDepartments("All Departments");
  };

  // fetchTenderById
  const fetchTenderById = async () => {
    const res = await api.get(`/public/api/tender/${selectedId}`);
    return res.data?.data || {};
  };

  const { data: tenderDetails, isLoading } = useQuery({
    queryKey: ["tender-details", selectedId],
    queryFn: fetchTenderById,
    enabled: !!selectedId && isModalOpen,
  });

  const timeline = tenderDetails?.timeline;
  const startDate = timeline?.start_date;
  const endDate = timeline?.end_date;

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

  // file download
  const handleDownload = async (doc) => {
    try {
      const baseURL = api.defaults.baseURL;

      const fileUrl = `${baseURL}/${doc.file_path}/${doc.file_name}`;

      const response = await fetch(fileUrl);
      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = doc.file_name;
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed", error);
    }
  };

  if (isPending) return <p className="p-8 mt-10">Loading...</p>;
  if (isError)
    return <p className="p-8 text-red-500 mt-10">Error loading data</p>;

  return (
    <div className="bg-[#f8f9fa] min-h-screen p-8 pt-20 font-sans">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Tender Management
          </h1>
          <p className="text-slate-500 mt-1">
            Create and manage tenders for infrastructure projects
          </p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all">
            <Download size={18} /> Export
          </button>
          <button
            onClick={() => router.push("/admin/tenders/create")}
            className="flex items-center gap-2 bg-[#2563eb] px-4 py-2 rounded-lg text-sm font-semibold text-white hover:bg-blue-700 transition-all shadow-sm cursor-pointer"
          >
            <Plus size={18} /> Create Tender
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-8">
        {/* Total Tenders */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="bg-blue-100 p-4 rounded-xl">
            <FileText className="text-blue-600" />
          </div>
          <div>
            <p className="text-slate-500 text-sm font-medium">Total Tenders</p>
            <span className="text-3xl font-bold text-slate-900">
              {tenderCards.total_tenders || 0}
            </span>
          </div>
        </div>

        {/* Published */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="bg-sky-100 p-4 rounded-xl">
            <Clock className="text-sky-500" />
          </div>
          <div>
            <p className="text-slate-500 text-sm font-medium">Published</p>
            <span className="text-3xl font-bold text-slate-900">
              {tenderCards.published || 0}
            </span>
          </div>
        </div>

        {/* Under Evaluation */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="bg-amber-100 p-4 rounded-xl">
            <AlertTriangle className="text-amber-500" />
          </div>
          <div>
            <p className="text-slate-500 text-sm font-medium">
              Under Evaluation
            </p>
            <span className="text-3xl font-bold text-slate-900">
              {tenderCards.under_evaluation || 0}
            </span>
          </div>
        </div>

        {/* Awarded */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="bg-green-100 p-4 rounded-xl">
            <CheckCircle className="text-green-500" />
          </div>
          <div>
            <p className="text-slate-500 text-sm font-medium">Awarded</p>
            <span className="text-3xl font-bold text-slate-900">
              {tenderCards.awarded || 0}
            </span>
          </div>
        </div>

        {/* Awarded */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="bg-red-100 p-4 rounded-xl">
            <Trash2 className="text-red-500" />
          </div>
          <div>
            <p className="text-slate-500 text-sm font-medium">Drafted</p>
            <span className="text-3xl font-bold text-slate-900">
              {tenderCards.drafted || 0}
            </span>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap bg-white p-5 rounded-xl border border-zinc-200 gap-3 mb-6">
        <div className="relative flex-1 min-w-[300px]">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600"
            size={18}
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tenders by ID & title"
            className="w-full pl-10 pr-4 py-2 bg-zinc-100 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="relative w-48">
          <SelectInput
            options={statusOptions}
            selected={selectedStatus}
            setSelected={setSelectedStatus}
          />
        </div>

        <div className="relative w-48">
          <SelectInput
            options={DepartmentsOptions}
            selected={selectedDepartments}
            setSelected={setSelectedDepartments}
          />
        </div>

        <button
          onClick={handleApplyFilters}
          className="flex items-center gap-2 bg-zinc-100 border border-slate-200 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:text-blue-500 cursor-pointer"
        >
          <Filter size={18} /> More Filters
        </button>
      </div>

      {/* Tender Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-100 border-b border-slate-100">
              <th className="p-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Tender ID
              </th>
              <th className="p-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Title
              </th>
              <th className="p-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Department
              </th>
              <th className="p-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Estimated Cost
              </th>
              <th className="p-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Status
              </th>
              <th className="p-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Closing Date
              </th>
              <th className="p-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Bids
              </th>
              <th className="p-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredTenders.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center p-6 text-slate-400">
                  No tenders found
                </td>
              </tr>
            ) : (
              filteredTenders.map((t, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 text-sm font-semibold text-slate-700">
                    {t.tender_id || "--"}
                  </td>
                  <td className="p-4">
                    <div className="text-sm font-semibold text-slate-800">
                      {t.title || "--"}
                    </div>
                    <div className="text-xs text-slate-400">
                      {t.description || "--"}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <MapPin size={14} className="text-slate-400" />{" "}
                      {t.department || "--"}
                    </div>
                  </td>
                  <td className="p-4 text-sm font-semibold text-slate-700">
                    {t.estimated_cost || "--"}
                  </td>
                  <td className="p-4">
                    <span
                      className={`rounded-full py-1 px-3 text-nowrap flex justify-center items-center gap-1 text-[10px] font-bold tracking-wide uppercase`}
                      style={{ backgroundColor: t.status_color }}
                    >
                      {/* {t.icon} */}
                      {t.status || "--"}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-slate-500 text-nowrap">
                    {t.closing_date || "--"}
                  </td>
                  <td className="p-4">
                    <span className="bg-zinc-200 text-zinc-600 text-nowrap px-2 py-1 rounded-full text-xs font-bold">
                      {t.bid || "0"} bids
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2 text-slate-400">
                      <button
                        onClick={() => {
                          setSelectedId(t.id);
                          setIsModalOpen(true);
                        }}
                        className="hover:text-blue-600 h-8 w-8 hover:bg-zinc-200 flex justify-center items-center rounded-lg cursor-pointer"
                      >
                        <Eye size={18} />
                      </button>
                      <button className="hover:text-blue-600 h-8 w-8 hover:bg-zinc-200 flex justify-center items-center rounded-lg cursor-pointer">
                        <MoreHorizontal size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white w-[90%] max-w-4xl h-[90%] overflow-auto rounded-2xl p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-4 text-gray-400 hover:text-red-500"
            >
              ✕
            </button>

            {isLoading ? (
              <p className="text-center py-10">Loading...</p>
            ) : !tenderDetails || Object.keys(tenderDetails).length === 0 ? (
              <p className="text-center py-10 text-gray-400">
                No details found
              </p>
            ) : (
              <>
                <div className="flex justify-between items-center mb-6 pt-15">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => router.back()}
                      className="p-2 hover:bg-slate-200 rounded-full transition-colors"
                    >
                      <ArrowLeft size={20} />
                    </button>
                    <div>
                      <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold text-slate-900">
                          {tenderDetails?.title}
                        </h1>
                        <span
                          className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider"
                          style={{
                            backgroundColor: `${tenderDetails?.status_color}20`,
                            color: tenderDetails?.status_color,
                          }}
                        >
                          {tenderDetails?.status}
                        </span>
                      </div>
                      <p className="text-slate-400 text-sm font-medium">
                        {tenderDetails?.tender_code}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50">
                      <Download size={18} /> Download BOQ
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 rounded-xl text-sm font-semibold text-white hover:bg-blue-700 shadow-md">
                      <Edit3 size={18} /> Edit Tender
                    </button>
                  </div>
                </div>

                {/* Top Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                  <StatCard
                    icon={<IndianRupee size={20} />}
                    label="Estimated Cost"
                    value={`₹ ${Number(
                      tenderDetails?.estimated_cost
                    ).toLocaleString()}`}
                    color="bg-blue-50 text-blue-600"
                  />
                  <StatCard
                    icon={<Users size={20} />}
                    label="Bids Received"
                    value={tenderDetails?.bids_count || "0"}
                    color="bg-emerald-50 text-emerald-600"
                  />
                  <StatCard
                    icon={<Calendar size={20} />}
                    label="Closing Date"
                    value={
                      tenderDetails?.timeline?.end_date
                        ? new Date(
                            tenderDetails.timeline.end_date
                          ).toLocaleDateString("en-IN")
                        : "-"
                    }
                    color="bg-orange-50 text-orange-600"
                  />
                  <StatCard
                    icon={<Calendar size={20} />}
                    label="Duration"
                    value={
                      tenderDetails?.timeline?.project_duration_weeks
                        ? `${tenderDetails.timeline.project_duration_weeks} weeks`
                        : "-"
                    }
                    color="bg-blue-50 text-blue-600"
                  />
                </div>

                {/* Tabs */}
                <div className="border-b border-slate-300">
                  <div className="flex gap-5 max-w-md">
                    {tabs.map(({ id, label, icon: Icon }) => (
                      <button
                        key={id}
                        onClick={() => setActiveTab(id)}
                        className={`
                          flex flex-1 items-center justify-center gap-2 pb-2.5 cursor-pointer text-sm font-semibold transition-all duration-200
                          ${
                            activeTab === id
                              ? " text-blue-600 scale-[1.02] border-b-2 border-blue-500"
                              : "text-slate-500 hover:text-slate-700 "
                          }
                        `}
                      >
                        <Icon
                          size={16}
                          strokeWidth={activeTab === id ? 2.5 : 2}
                        />
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {activeTab === "details" && (
                  <>
                    <div className="py-7 font-sans text-slate-700">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2 space-y-6">
                          <div className="bg-white p-5 rounded-2xl border border-gray-100">
                            <h2 className="text-lg font-semibold mb-3">
                              Description
                            </h2>
                            <p className="text-gray-500 leading-relaxed">
                              {tenderDetails?.description ||
                                "No description available"}
                            </p>
                          </div>

                          <div className="bg-white p-5 rounded-2xl border border-gray-100">
                            <h2 className="text-lg font-semibold mb-3">
                              Timeline
                            </h2>
                            <div className="grid grid-cols-3 gap-4">
                              <div>
                                <p className="text-gray-400 text-sm mb-1">
                                  Start Date
                                </p>
                                <p className="font-semibold text-lg">
                                  {startDate
                                    ? new Date(startDate).toLocaleDateString(
                                        "en-IN"
                                      )
                                    : "-"}
                                </p>
                              </div>
                              <div>
                                <p className="text-gray-400 text-sm mb-1">
                                  End Date
                                </p>
                                <p className="font-semibold text-lg">
                                  {endDate
                                    ? new Date(endDate).toLocaleDateString(
                                        "en-IN"
                                      )
                                    : "-"}
                                </p>
                              </div>
                              <div>
                                <p className="text-gray-400 text-sm mb-1">
                                  Duration
                                </p>
                                <p className="font-semibold text-lg">
                                  {timeline?.project_duration_weeks
                                    ? `${timeline.project_duration_weeks} weeks`
                                    : "-"}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white p-8 rounded-2xl border border-gray-100">
                          <h2 className="text-lg font-semibold mb-6">
                            Tender Information
                          </h2>
                          <div className="space-y-5">
                            <div className="flex justify-between items-center">
                              <span className="text-gray-400">Department</span>
                              <span className="font-semibold text-right">
                                {tenderDetails?.department || "N/A"}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-gray-400">Work Type</span>
                              <span className="font-semibold text-right">
                                {tenderDetails?.tender_id ||
                                  tenderDetails?.tender_code ||
                                  "-"}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-gray-400">EMD Amount</span>
                              <span className="font-semibold text-right">
                                {tenderDetails?.emd_amount
                                  ? `₹ ${Number(
                                      tenderDetails.emd_amount
                                    ).toLocaleString()}`
                                  : "-"}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-gray-400">
                                Publish Date
                              </span>
                              <span className="font-semibold text-right">
                                {tenderDetails?.status || "-"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {activeTab === "milestones" && (
                  <>
                    <div className="bg-white p-8 mt-8 rounded-2xl shadow-sm max-w-5xl mx-auto border border-gray-100">
                      <h2 className="text-lg font-bold text-slate-800 mb-6">
                        Project Milestones
                      </h2>

                      <div className="space-y-4">
                        {tenderDetails?.milestones?.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between p-4 bg-gray-50/50 rounded-xl border border-transparent transition-colors"
                          >
                            <div className="flex items-center gap-4">
                              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-100 text-blue-600 font-bold text-lg">
                                {item.sequence_no}
                              </div>

                              <div>
                                <h3 className="font-semibold text-slate-800">
                                  {item.title}
                                </h3>
                                <p className="text-gray-600 text-sm">
                                  Duration: {item.duration_weeks}
                                </p>
                              </div>
                            </div>

                            <div className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full">
                              {item.is_critical}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {activeTab === "bids" && (
                  <>
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
                            <tr
                              key={bid.id}
                              className="hover:bg-gray-100 transition-colors"
                            >
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
                  </>
                )}

                {activeTab === "documents" && (
                  <>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 max-w-5xl mt-8">
                      <div className="space-y-3">
                        {tenderDetails?.documents?.length > 0 ? (
                          tenderDetails.documents.map((doc, index) => (
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
                                    {doc.file_name}
                                  </h4>
                                  <p className="text-gray-400 text-xs uppercase font-medium">
                                    {doc.mime_type} • {doc.file_size} kb
                                  </p>
                                </div>
                              </div>
                              <button
                                onClick={() => handleDownload(doc)}
                                className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                              >
                                <Download size={18} />
                              </button>
                            </div>
                          ))
                        ) : (
                          <p className="text-center text-gray-400 py-6">
                            No documents available
                          </p>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TenderDashboard;

// Sub-components for cleaner code
const StatCard = ({ icon, label, value, color }) => (
  <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm hover:shadow-xl flex items-center gap-3">
    <div className={`${color} p-3 rounded-lg`}>{icon}</div>
    <div>
      <p className="text-slate-400 text-xs font-medium">{label}</p>
      <p className="text-xl font-bold text-slate-900">{value}</p>
    </div>
  </div>
);
