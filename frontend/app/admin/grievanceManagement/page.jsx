"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  Eye,
  MoreVertical,
  Search,
  AlertCircle,
  Loader,
  ShieldAlert,
  CheckCircle,
} from "lucide-react";
import { CiCircleChevDown } from "react-icons/ci";
import { IoMdText } from "react-icons/io";
import { CiCircleCheck } from "react-icons/ci";
import { CiWarning } from "react-icons/ci";

export default function Page() {
  const [openMenu, setOpenMenu] = useState(null);
  const dropdownRef = useRef(null);

  // ✅ outside click close
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const grievances = [
    {
      id: "GRV-2024-0892",
      status: "OPEN",
      statusColor: "bg-orange-100 text-orange-600",
      priority: "High",
      priorityColor: "bg-orange-100 text-orange-600",
      title: "Road construction causing water logging",
      location: "Ward 15, Shastri Nagar",
      date: "1/15/2024",
      user: "Ramesh Kumar",
      sla: "8h remaining",
    },
    {
      id: "GRV-2024-0891",
      status: "IN PROGRESS",
      statusColor: "bg-blue-100 text-blue-600",
      priority: "Medium",
      priorityColor: "bg-blue-100 text-blue-600",
      title: "Street light not working after installation",
      location: "Ward 10, Railway Colony",
      date: "1/14/2024",
      user: "Priya Verma",
      assigned: "JE Rajesh Kumar",
    },
    {
      id: "GRV-2024-0890",
      status: "ESCALATED",
      statusColor: "bg-red-100 text-red-600",
      priority: "Critical",
      priorityColor: "bg-red-100 text-red-600",
      title: "Sewerage overflow near construction site",
      location: "Ward 22, Sector 12",
      date: "1/13/2024",
      user: "Anonymous",
      breached: true,
      assigned: "AE Priya Sharma",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6 mt-12">
      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Grievance Management</h1>
          <p className="text-gray-500">Track and resolve public grievances</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">
          + New Grievance
        </button>
      </div>

      {/* ================= IMAGE 1 : STATS WITH ICONS ================= */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <Stat
          title="Open"
          value="14"
          icon={<CiCircleChevDown className="text-orange-400" />}
        />
        <Stat
          title="In Progress"
          value="8"
          icon={<IoMdText className="text-blue-500" />}
        />
        <Stat
          title="SLA Breached"
          value="3"
          icon={<CiWarning className="text-orange-800" />}
        />
        <Stat
          title="Resolved (MTD)"
          value="42"
          icon={<CiCircleCheck className="text-green-500" />}
        />
      </div>

      {/* ================= IMAGE 2 : FILTER ================= */}
      <div className="bg-white rounded-xl p-4 flex items-center gap-4 mb-6">
        <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2 w-full">
          <Search size={18} className="text-gray-400" />
          <input
            placeholder="Search grievances..."
            className="outline-none w-full"
          />
        </div>
        <select className="border border-gray-300 rounded-lg px-3 py-2">
          <option>All Status</option>
        </select>
        <select className="border border-gray-300 rounded-lg px-3 py-2">
          <option>All Priority</option>
        </select>
        <select className="border border-gray-300 rounded-lg px-3 py-2">
          <option>All SLA</option>
        </select>
      </div>

      {/* ================= LIST ================= */}
      <div className="space-y-4">
        {grievances.map((g) => (
          <div
            key={g.id}
            className="bg-white rounded-xl shadow-sm p-5 flex justify-between"
          >
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-sm font-medium">{g.id}</span>
                <span
                  className={`px-2 py-0.5 text-xs rounded-full ${g.statusColor}`}
                >
                  {g.status}
                </span>
                <span
                  className={`px-2 py-0.5 text-xs rounded-full ${g.priorityColor}`}
                >
                  {g.priority}
                </span>
              </div>
              <h2 className="font-semibold mb-1">{g.title}</h2>
              <p className="text-sm text-gray-500">
                {g.location} · {g.date} · {g.user}
              </p>
              {g.assigned && (
                <p className="text-sm mt-1">
                  Assigned to: <b>{g.assigned}</b>
                </p>
              )}
            </div>

            <div className="flex items-center gap-3 relative">
              {g.sla && (
                <span className="text-orange-500 text-sm">{g.sla}</span>
              )}
              {g.breached && (
                <span className="text-red-600 text-sm">SLA Breached</span>
              )}

              <button className="flex items-center gap-1 border border-gray-300 px-3 py-1 rounded-lg text-sm">
                <Eye size={16} /> View
              </button>

              <button onClick={() => setOpenMenu(g.id)}>
                <MoreVertical />
              </button>

              {/* ================= IMAGE 3 : DROPDOWN ================= */}
              {openMenu === g.id && (
                <div
                  ref={dropdownRef}
                  className="absolute right-0 top-8 w-44 bg-white border border-gray-300 rounded-lg shadow-md z-10"
                >
                  {[
                    "View Details",
                    "Assign Officer",
                    "Add Response",
                    "Escalate",
                    "Mark Resolved",
                  ].map((item) => (
                    <p
                      key={item}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      {item}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ================= STAT CARD ================= */
const Stat = ({ title, value, icon }) => (
  <div className="bg-white rounded-xl p-4 shadow-sm flex items-center gap-4">
    <div className="p-2 rounded-lg bg-gray-100 text-gray-600">{icon}</div>
    <div>
      <p className="text-gray-500 text-sm">{title}</p>
      <p className="text-2xl font-semibold">{value}</p>
    </div>
  </div>
);
