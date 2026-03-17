"use client";
import React, { useState } from "react";
import {
  ArrowLeft,
  Download,
  Edit3,
  IndianRupee,
  Users,
  Calendar,
  LayoutGrid,
  Milestone,
  UsersIcon,
  FileText,
} from "lucide-react";
import Details from "@/components/Admin/tenders/Details";
import Milestones from "@/components/Admin/tenders/Milestones";
import BidsTable from "@/components/Admin/tenders/Bids";
import DocumentList from "@/components/Admin/tenders/Documents";

const tabs = [
  { id: "details", label: "Details", icon: LayoutGrid },
  { id: "milestones", label: "Milestones", icon: Milestone },
  { id: "bids", label: "Bids", icon: UsersIcon },
  { id: "documents", label: "Documents", icon: FileText },
];

const TenderDetails = () => {
  const [activeTab, setActiveTab] = useState("details");

  return (
    <div className="min-h-screen bg-slate-50/50 p-8 font-sans">
      {/* Header Actions */}
      <div className="flex justify-between items-center mb-6 pt-15">
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-900">
                Construction of Community Center - Ward 15
              </h1>
              <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                Published
              </span>
            </div>
            <p className="text-slate-400 text-sm font-medium">TND-2024-0078</p>
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
          value="₹ 4.5 Cr"
          color="bg-blue-50 text-blue-600"
        />
        <StatCard
          icon={<Users size={20} />}
          label="Bids Received"
          value="8"
          color="bg-emerald-50 text-emerald-600"
        />
        <StatCard
          icon={<Calendar size={20} />}
          label="Closing Date"
          value="10 Feb"
          color="bg-orange-50 text-orange-600"
        />
        <StatCard
          icon={<Calendar size={20} />}
          label="Duration"
          value="12 months"
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
              <Icon size={16} strokeWidth={activeTab === id ? 2.5 : 2} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "details" && (
        <>
            <Details />
        </>
      )}

      {activeTab === "milestones" && (
        <>
            <Milestones />
        </>
      )}

      {activeTab === "bids" && (
        <>
            <BidsTable />
        </>
      )}

      {activeTab === "documents" && (
        <>
            <DocumentList />
        </>
      )}
    </div>
  );
};

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

export default TenderDetails;
