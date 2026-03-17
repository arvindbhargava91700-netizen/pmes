"use client";
import React from "react";
import {
  IndianRupee,
  TrendingUp,
  Ticket,
  AlertTriangle,
  Search,
  Filter,
  Download,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import MetricCard from "@/components/Admin/progressTracking/MetricCard";
import ProjectRow from "@/components/Admin/progressTracking/ProjectRow";

const page = () => {
  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans mt-10">
      {/* Header Section */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Financial Progress
          </h1>
          <p className="text-slate-500 mt-1 text-lg">
            Budget allocation, releases, and utilization tracking
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg font-semibold text-slate-700 hover:bg-zinc-100 hover:text-blue-500 cursor-pointer transition-colors">
          <Download size={18} /> Export Report
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          icon={IndianRupee}
          title="Total Budget"
          value="₹9.6 Cr"
          color="bg-blue-100 text-blue-500"
          colorbg="bg-blue-50"
        />
        <MetricCard
          icon={TrendingUp}
          title="Total Released"
          value="₹4.0 Cr"
          subtext="41% utilized"
          color="bg-emerald-100 text-emerald-600"
          colorbg="bg-emerald-50"
        />
        <MetricCard
          icon={Ticket}
          title="Pending Bills"
          value="₹66.0 L"
          color="bg-orange-100 text-orange-600"
          colorbg="bg-orange-50"
        />
        <MetricCard
          icon={AlertTriangle}
          title="Mismatch Alerts"
          value="1"
          color="bg-red-100 text-red-600"
          colorbg="bg-red-50"
        />
      </div>

      {/* Filters */}
      <div className="p-5 flex flex-wrap gap-4 items-center bg-white rounded-2xl border border-slate-200">
        <div className="relative flex-1 min-w-[300px]">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            size={20}
          />
          <input
            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search projects..."
          />
        </div>
        <select className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl min-w-[180px] font-medium text-slate-700 outline-none">
          <option>All Departments</option>
        </select>
        <button className="flex items-center gap-2 px-4 py-3 border border-slate-200 rounded-xl font-semibold text-slate-700 bg-zinc-50 hover:bg-zinc-100 hover:text-blue-500 cursor-pointer">
          <Filter size={20} /> More Filters
        </button>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mt-5">
        {/* Project Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-zinc-100 border-y border-slate-100">
              <tr className="text-slate-500 text-xs uppercase">
                <th className="px-6 py-4">Project</th>
                <th className="px-6 py-4">Total Budget</th>
                <th className="px-6 py-4">Released</th>
                <th className="px-6 py-4">Utilized</th>
                <th className="px-6 py-4">Pending</th>
                <th className="px-6 py-4">Physical vs Financial</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <ProjectRow
                name="Community Hall Construction"
                company="BuildRight Corp"
                budget="₹4.2 Cr"
                released="₹1.5 Cr"
                releasePerc="35%"
                utilized="₹1.6 Cr"
                pending="₹21.0 L"
                physical={28}
                financial={38}
                status="MISMATCH"
              />
              {/* Add other rows similarly */}
            </tbody>
          </table>
        </div>
      </div>

      {/* Alert Banner */}
      <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-5 flex items-start gap-4">
        <div className="bg-amber-100 p-2 rounded-lg">
          <AlertTriangle className="text-amber-700" size={20} />
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-amber-900">
            Physical vs Financial Mismatch Detected
          </h4>
          <p className="text-amber-800 text-sm mt-1">
            1 project(s) show significant variance between physical and
            financial progress. This may indicate billing issues.
          </p>
        </div>
        <button className="px-6 py-2 bg-white border border-amber-200 text-amber-900 font-bold rounded-xl shadow-sm hover:bg-amber-50">
          Review
        </button>
      </div>
    </div>
  );
};

export default page;
