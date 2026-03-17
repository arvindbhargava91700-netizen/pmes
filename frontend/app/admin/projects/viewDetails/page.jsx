"use client";

import BillsPayments from "@/components/Admin/projects/viewDetails/Billing";
import Communication from "@/components/Admin/projects/viewDetails/Communication";
import ProjectDocuments from "@/components/Admin/projects/viewDetails/Documents";
import Overview from "@/components/Admin/projects/viewDetails/Overview";
import ProgressPhotos from "@/components/Admin/projects/viewDetails/ProgressPhotos";
import StatCard from "@/components/Admin/projects/viewDetails/StatCard";
import Timeline from "@/components/Admin/projects/viewDetails/Timeline";
import PertChart from "@/components/Admin/tenders/PertChart";
import {
  IconArrowLeft,
  IconDownload,
  IconClock,
  IconPencil,
  IconTrendingUp,
  IconCalendar,
  IconCurrencyRupee,
  IconFileDollar,
  IconMessage,
  IconPhoto,
} from "@tabler/icons-react";
import { ChartColumn, FileText, GitBranch } from "lucide-react";
import { useState } from "react";

const tabs = [
  { id: "overview", label: "Overview" },
  { id: "timeline", label: "Timeline", icon: ChartColumn },
  { id: "PERT", label: "PERT", icon: GitBranch },
  { id: "progressPhotos", label: "Progress Photos", icon: IconPhoto },
  { id: "billing", label: "Billing", icon: IconFileDollar },
  { id: "documents", label: "Documents", icon: FileText },
  { id: "communication", label: "Communication", icon: IconMessage },
];

export default function ProjectHeader() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="bg-zinc-100 p-6 min-h-screen rounded-2xl mt-10">
      {/* TOP BAR */}
      <div className="flex justify-between items-start mb-6">
        {/* LEFT */}
        <div className="flex items-start gap-3">
          <button className="mt-1 text-gray-500 hover:text-gray-700">
            <IconArrowLeft size={20} />
          </button>

          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-semibold">
                Ward 15 Road Reconstruction
              </h1>

              <span className="bg-green-200 text-green-600 text-xs font-semibold px-3 py-1 rounded-full">
                ON TRACK
              </span>
            </div>

            <p className="text-sm text-gray-400 mt-1">PRJ-2024-0045</p>
          </div>
        </div>

        {/* RIGHT ACTIONS */}
        <div className="flex gap-2">
          <ActionButton icon={<IconDownload size={16} />} text="Export" />
          <ActionButton icon={<IconClock size={16} />} text="Request EOT" />
          <ActionButton
            icon={<IconPencil size={16} />}
            text="Update Progress"
            primary
          />
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<IconTrendingUp />}
          title="Physical Progress"
          value="65%"
          progress={65}
        />

        <StatCard
          icon="₹"
          title="Financial Progress"
          value="58%"
          progress={58}
          green
        />

        <StatCard
          icon={<IconCalendar />}
          title="Due Date"
          value="15 Mar 2025"
        />

        <StatCard
          icon={<IconCurrencyRupee />}
          title="Total Budget"
          value="₹2.4 Cr"
          sub="Released: ₹1.4 Cr"
          yellow
        />
      </div>

      {/* tabs */}
      <div className="border-b border-slate-300 my-4">
        <div className="flex gap-5 max-w-md">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`
              flex flex-1 items-center justify-center gap-2 pb-2.5 text-nowrap cursor-pointer text-sm font-semibold transition-all duration-200
              ${
                activeTab === id
                  ? " text-blue-600 scale-[1.02] border-b-2 border-blue-500"
                  : "text-slate-500 hover:text-slate-700 "
              }
            `}
            >
              {Icon && <Icon size={18} />}
              {label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "overview" && (
        <>
          <Overview />
        </>
      )}

      {activeTab === "timeline" && (
        <>
          <Timeline />
        </>
      )}

      {activeTab === "PERT" && (
        <>
          <PertChart />
        </>
      )}

      {activeTab === "progressPhotos" && (
        <>
          <ProgressPhotos />
        </>
      )}

      {activeTab === "billing" && (
        <>
          <BillsPayments />
        </>
      )}

      {activeTab === "documents" && (
        <>
          <ProjectDocuments />
        </>
      )}

      {activeTab === "communication" && (
        <>
          <Communication />
        </>
      )}
    </div>
  );
}

/* ================== SUB COMPONENTS ================== */
const ActionButton = ({ icon, text, primary }) => (
  <button
    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition cursor-pointer
      ${
        primary
          ? "bg-blue-600 text-white hover:bg-blue-700"
          : "bg-white border border-zinc-200 text-gray-700 hover:bg-gray-100"
      }`}
  >
    {icon}
    {text}
  </button>
);
