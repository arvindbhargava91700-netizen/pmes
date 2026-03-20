"use client";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  Search,
  Filter,
  List,
  Grid,
  Eye,
  MoreHorizontal,
  Plus,
  Download,
  MapPin,
  Calendar,
  AlertTriangle,
} from "lucide-react";
import SelectInput from "@/components/selectInput";
import { useQuery } from "@tanstack/react-query";
import api from "@/components/Api/privetApi";
import Link from "next/link";

const formatBudget = (amount) => {
  if (!amount) return "₹0";
  const num = parseFloat(amount);
  if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`;
  if (num >= 100000) return `₹${(num / 100000).toFixed(2)} L`;
  return `₹${num.toLocaleString("en-IN")}`;
};

const StatusBadge = ({ status, delay }) => {
  const styles = {
    "ON TRACK": "bg-green-50 text-green-600 border-green-100",
    DELAYED: "bg-orange-50 text-orange-600 border-orange-100",
    CRITICAL: "bg-red-50 text-red-600 border-red-100",
    COMPLETED: "bg-blue-50 text-blue-600 border-blue-100",
    PLANNED: "bg-gray-50 text-gray-500 border-gray-100",
  };

  return (
    <div className="flex items-center gap-2">
      <span
        className={`px-3 py-0.5 rounded-full text-[11px] font-bold border ${styles[status]}`}
      >
        {status}
      </span>
      {delay && (
        <span className="flex items-center text-red-500 text-[11px] font-medium gap-0.5">
          <AlertTriangle size={12} /> {delay}
        </span>
      )}
    </div>
  );
};

const ProgressCol = ({ label, percent }) => (
  <div className="w-24">
    <div className="text-[11px] font-medium text-gray-500 mb-1">{percent}%</div>
    <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
      <div
        className="bg-blue-600 h-full rounded-full"
        style={{ width: `${percent}%` }}
      />
    </div>
  </div>
);

// const eventOptions = [
//   "All Status",
//   "On Track",
//   "Delayed",
//   "Critical",
//   "Completed",
// ];
// //this come data from project_status_masters

// const zoneOptions = ["All Zones", "Zone A", "Zone B", "Zone C", "Zone D"];
// //this come data zones

// const departmentsOptions = [
//   "All Departments",
//   "Roads & Highways",
//   "Water & Sewerage",
//   "Electrical",
//   "Buildings",
//   "Parks & Recreation",
// ];
// ////this come data depeartment



export default function ProjectDashboard() {
  const [openId, setOpenId] = useState(null);

  const toggleMenu = (id) => {
    setOpenId(openId === id ? null : id);
  };
  const [showDelete, setShowDelete] = useState(false);
  const [selectedId, setSelectedId] = useState(null);



  const [eventOptions, setEventOptions] = useState([]);
  const [zoneOptions, setZoneOptions] = useState([]);
  const [departmentsOptions, setDepartmentsOptions] = useState([]);
  const [view, setView] = useState("list");

  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedEvent, setSelectedEvent] = useState("All Status");
  const [selectedZone, setSelectedZone] = useState("All Zones");
  const [selectedDepartments, setSelectedDepartments] =
    useState("All Departments");

  const [projects, setProjects] = useState([]);

  //==============================filter data================================

  const filteredProjects = projects.filter((p) => {
    const matchSearch =
      p.project_name?.toLowerCase().includes(search.toLowerCase()) ||
      p.project_description?.toLowerCase().includes(search.toLowerCase()) ||
      p.project_code?.toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      selectedEvent === "All Status" ||
      p.status?.name === selectedEvent;
    const matchZone =
      selectedZone === "All Zones" ||
      p.location?.zone?.name === selectedZone;
    const matchDepartment =
      selectedDepartments === "All Departments" ||
      p.department?.name === selectedDepartments;
    return matchSearch && matchStatus && matchZone && matchDepartment;
  });
  
  //==============================fetch data================================
  const fetchProjects = async () => {
    try {
      const res = await api.get("public/api/master/allprojects");
      setProjects(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  //==============================load data================================
  useEffect(() => {
    fetchProjects();
    fetchFilters();
  }, []);


  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [search, selectedEvent, selectedZone, selectedDepartments]);


  //==============================fetch filter================================
  const fetchFilters = async () => {
    try {
      const [statusRes, zoneRes, deptRes] = await Promise.all([
        api.get("public/api/master/project_status"),
        api.get("public/api/master/zones"),
        api.get("public/api/master/departments")
      ]);
      setEventOptions([
        "All Status",
        ...(statusRes.data?.data ?? statusRes.data).map((s) => s.name)
      ]);
      setZoneOptions([
        "All Zones",
        ...(zoneRes.data?.data ?? zoneRes.data).map((z) => z.name)
      ]);
      setDepartmentsOptions([
        "All Departments",
        ...(deptRes.data?.data ?? deptRes.data).map((d) => d.name)
      ]);
    } catch (error) {
      console.error("Filter fetch error:", error);
    }
  };


//==============================Delete Project================================
    const handleDeleteClick = (id) => {
      setSelectedId(id);
      setShowDelete(true);
      setOpenId(null);
    };

   const confirmDelete = async () => {
    try {
      await api.delete(`public/api/master/projects/${selectedId}`);
      toast.success("Project deleted successfully ✅");
      setShowDelete(false);
      // refresh project list
      fetchProjects();

    } catch (error) {

      toast.error("Failed to delete project ❌");

    }
  };

  return (
    <div className="p-8 bg-[#f8f9fa] min-h-screen font-sans mt-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Projects</h1>
          <p className="text-gray-500 text-sm">
            Manage and monitor all infrastructure projects
          </p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-zinc-300 cursor-pointer rounded-lg bg-white text-sm font-medium text-gray-600">
            <Download size={16} /> Export
          </button>
          <button className="flex items-center gap-2 px-4 cursor-pointer py-2 bg-[#2563eb] text-white rounded-lg text-sm font-medium shadow-sm">
            <Plus size={16} /> New Project
          </button>
        </div>
      </div>

      {/* Filters Area */}
      <div className="flex justify-between items-center gap-4 bg-white p-2.5 rounded-xl border border-gray-200 shadow-sm mb-6">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search projects, contractors..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <SelectInput
              options={eventOptions}
              selected={selectedEvent}
              setSelected={setSelectedEvent}
            />

            <SelectInput
              options={zoneOptions}
              selected={selectedZone}
              setSelected={setSelectedZone}
            />

            <SelectInput
              options={departmentsOptions}
              selected={selectedDepartments}
              setSelected={setSelectedDepartments}
            />
          </div>
          <button className="p-2 border border-zinc-200 rounded-lg bg-gray-50 text-gray-500 cursor-pointer">
            <Filter size={18} />
          </button>
          <div className="h-8 w-[1px] bg-gray-200 mx-0.5" />
          <div className="flex gap-2 overflow-hidden">

            <button
              onClick={() => setView("list")}
              className={`p-2 rounded-lg cursor-pointer ${view === "list" ? "bg-zinc-100 text-blue-600" : "text-zinc-600"
                }`}
            >
              <List size={16} />
            </button>

            <button
              onClick={() => setView("grid")}
              className={`p-2 rounded-lg cursor-pointer ${view === "grid" ? "bg-zinc-100 text-blue-600" : "text-zinc-600"
                }`}
            >
              <Grid size={16} />
            </button>

          </div>
        </div>
      </div>
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6">
        {/* Table */}
        <div className="overflow-x-auto">

          {view === "list" ? (
            <table className="w-full text-left overflow-x-auto">
              <thead>
                <tr className="text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                  <th className="pb-4 font-semibold">Project ID</th>
                  <th className="pb-4 font-semibold">Project Name</th>
                  <th className="pb-4 font-semibold">Department</th>
                  <th className="pb-4 font-semibold">Zone / Ward</th>
                  <th className="pb-4 font-semibold">Status</th>
                  <th className="pb-4 font-semibold">Physical %</th>
                  <th className="pb-4 font-semibold">Financial %</th>
                  <th className="pb-4 font-semibold text-right pr-4">Budget</th>
                  <th className="pb-4 font-semibold">Due Date</th>
                  <th className="pb-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">

                {loading && (
                  <tr>
                    <td colSpan="10" className="py-10 text-center text-gray-400 text-sm">
                      Searching projects...
                    </td>
                  </tr>
                )}

                {!loading && filteredProjects.length === 0 && (
                  <tr>
                    <td colSpan="10" className="py-10 text-center text-gray-400 text-sm">
                      No projects found
                    </td>
                  </tr>
                )}

                {!loading && filteredProjects.map((p, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors text-left space-x-3">

                    <td className="py-5 text-[11px] font-bold text-gray-700">
                      {p.project_code}
                    </td>

                    <td className="py-5">
                      <div className="text-[13px] font-bold text-gray-800">
                        {p.project_name}
                      </div>
                      <div className="text-[11px] text-gray-400">
                        {p.project_description}
                      </div>
                    </td>

                    <td className="py-5 text-[12px] text-gray-600">
                      Dept {p.department?.name}
                    </td>

                    <td className="py-5">
                      <div className="flex items-start gap-1 text-[12px] text-gray-600">
                        <MapPin size={14} className="text-gray-300 mt-0.5" />
                        {p.location?.zone?.name} / {p.location?.ward?.name}
                      </div>
                    </td>

                    <td className="py-5">
                      <StatusBadge status={p.status?.name} />
                    </td>

                    <td className="py-5">
                      <ProgressCol percent={p.actual_progress} />
                    </td>

                    <td className="py-5">
                      <ProgressCol percent={p.planned_progress} />
                    </td>

                    <td className="py-5 px-4 text-[13px] text-nowrap font-bold text-gray-800 text-right pr-4">
                      {formatBudget(p.total_budget)}
                    </td>

                    <td className="py-5 text-[12px] text-gray-600">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={14} className="text-gray-300" />
                        {p.start_date ?? "-"}
                      </div>
                    </td>

                    <td className="py-5">
                      <div className="flex gap-2 text-gray-400">
                        <Link href={`/admin/projects/viewDetails?id=${p.id}`}>
                          <Eye size={18} className="cursor-pointer hover:text-blue-500" />
                        </Link>
                        <MoreHorizontal
                          size={18}
                          className="cursor-pointer hover:text-gray-600"
                          onClick={() => toggleMenu(p.id)}
                        />

                        {openId === p.id && (
                          <div className="absolute right-0 mt-2 w-32 bg-white border rounded-lg shadow-lg z-50">
                            <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                              Edit
                            </button>
                            <button
                              className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500"
                              onClick={() => handleDeleteClick(p.id)}
                            >
                              Delete
                            </button>

                          </div>
                        )}



                      </div>
                    </td>

                  </tr>
                ))}

              </tbody>
            </table>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">

              {loading && (
                <div className="col-span-full text-center py-10 text-gray-400">
                  Searching projects...
                </div>
              )}

              {!loading && filteredProjects.map((p, i) => (
                <div
                  key={i}
                  className="border border-gray-200 rounded-xl p-4 bg-white hover:shadow-sm transition"
                >

                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="text-xs text-gray-400">{p.project_code}</div>
                      <h3 className="font-semibold text-gray-800">
                        {p.project_name}
                      </h3>
                    </div>

                    <StatusBadge status={p.status?.name} />
                  </div>

                  <p className="text-xs text-gray-500 mb-3 line-clamp-2">
                    {p.project_description}
                  </p>

                  <div className="text-sm text-gray-600 mb-2">
                    Dept: {p.department?.name}
                  </div>

                  <div className="text-sm text-gray-600 mb-3">
                    {p.location?.zone?.name} / {p.location?.ward?.name}
                  </div>

                  <div className="mb-2">
                    <ProgressCol percent={p.actual_progress} />
                  </div>

                  <div className="mb-3">
                    <ProgressCol percent={p.planned_progress} />
                  </div>

                  <div className="flex justify-between items-center text-sm">
                    <span className="font-bold text-gray-800">
                      {formatBudget(p.total_budget)}
                    </span>

                    <div className="flex gap-2 text-gray-400">
                      <Eye size={18} className="cursor-pointer hover:text-blue-500" />
                      <MoreHorizontal size={18} className="cursor-pointer hover:text-gray-600" />
                    </div>
                  </div>

                </div>
              ))}

            </div>
          )}

          {/* Delete Confirmation Modal */}
          {showDelete && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/40">
              <div className="bg-white p-6 rounded-lg shadow-lg w-80">
                <h2 className="text-lg font-semibold mb-4">
                  Delete Confirmation
                </h2>

                <p className="text-sm text-gray-600 mb-4">
                  Are you sure you want to delete this item?
                </p>

                <div className="flex justify-end gap-2">
                  <button
                   style={{ cursor: "pointer" }}
                    className="px-4 py-2 bg-gray-200 rounded"
                    onClick={() => setShowDelete(false)}
                  >
                    Cancel
                  </button>

                  <button 
                   style={{ cursor: "pointer" }}
                    className="px-4 py-2 bg-red-500 text-white rounded"
                    onClick={confirmDelete}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
