"use client";
import React from "react";
import { Clock, AlertTriangle, TrendingUp, Zap } from "lucide-react";

const tasks = [
  {
    id: 1,
    name: "Site Clearance & Setup",
    range: "Week 0 - 2",
    duration: "2w",
  },
  { id: 2, name: "Foundation Work", range: "Week 2 - 8", duration: "6w" },
  {
    id: 3,
    name: "Structural Framework",
    range: "Week 8 - 20",
    duration: "12w",
  },
  {
    id: 4,
    name: "Electrical & Plumbing",
    range: "Week 20 - 28",
    duration: "8w",
  },
  { id: 5, name: "Interior Finishing", range: "Week 28 - 38", duration: "10w" },
  { id: 6, name: "Final Inspection", range: "Week 38 - 40", duration: "2w" },
];

const StatCard = ({ icon: Icon, value, label, colorClass, bgColor }) => (
  <div
    className={`flex flex-col items-center justify-center p-6 rounded-2xl border border-gray-50 shadow-xs ${bgColor} w-full`}
  >
    <Icon className={`w-6 h-6 mb-3 ${colorClass}`} />
    <div className="text-3xl font-semibold text-slate-800">{value}</div>
    <div className="text-xs font-medium text-gray-400 mt-1 uppercase tracking-wider">
      {label}
    </div>
  </div>
);

const CriticalPathAnalysis = () => {
  return (
    <div className="max-w-5xl mx-auto min-h-screen font-sans">
      {/* Top Header */}
      <div className="flex justify-between items-center border-b border-zinc-200 pb-3 mb-5">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white rounded-xl shadow-sm border border-blue-100">
            <div className="w-6 h-6 rounded-full border-2 border-blue-500 border-dotted flex items-center justify-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full" />
            </div>
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-800">
              Critical Path Analysis
            </h1>
            <p className="text-sm text-gray-400">Project scheduling insights</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-1.5 rounded-full border border-red-100">
          <AlertTriangle className="w-4 h-4" />
          <span className="text-xs font-bold">High Risk</span>
        </div>
      </div>

      {/* Summary Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
        <StatCard
          icon={Clock}
          value="40"
          label="Total Weeks"
          colorClass="text-blue-500"
          bgColor="bg-blue-50/50"
        />
        <StatCard
          icon={AlertTriangle}
          value="6"
          label="Critical Tasks"
          colorClass="text-red-500"
          bgColor="bg-red-50"
        />
        <StatCard
          icon={TrendingUp}
          value="0"
          label="Total Float (weeks)"
          colorClass="text-green-500"
          bgColor="bg-green-50/50"
        />
        <StatCard
          icon={Zap}
          value="0.0"
          label="Avg Float (weeks)"
          colorClass="text-yellow-500"
          bgColor="bg-yellow-50/50"
        />
      </div>

      {/* Tasks Section */}
      <div className="bg-white p-8 border-t border-zinc-200 mb-6">
        <div className="flex items-center gap-2 mb-6 text-slate-800">
          <AlertTriangle className="w-4 h-4 text-red-500" />
          <h2 className="text-md font-semibold">Critical Path Tasks</h2>
        </div>

        <div className="space-y-6">
          {tasks.map((task) => (
            <div key={task.id} className="relative">
              <div className="flex justify-between items-end mb-2">
                <div className="flex items-center gap-4">
                  <span className="flex items-center justify-center w-6 h-6 bg-red-500 text-white text-[10px] font-bold rounded-full">
                    {task.id}
                  </span>
                  <span className="text-sm font-bold text-slate-700">
                    {task.name}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-[11px] text-gray-400 font-medium">
                    {task.range}
                  </span>
                  <span className="bg-red-500 text-white px-3 py-1 rounded-full text-[10px] font-bold min-w-[32px] text-center">
                    {task.duration}
                  </span>
                </div>
              </div>
              {/* Progress Bar Background */}
              <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-red-500 rounded-full"
                  style={{ width: "100%" }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Warning Footer Section */}
      <div className="bg-red-50/30 p-8 rounded-lg border border-red-100">
        <div className="flex items-center gap-2 mb-1 text-red-600">
          <AlertTriangle className="w-5 h-5" />
          <h2 className="text-md font-semibold">High Schedule Risk Detected</h2>
        </div>
        <p className="text-red-500/80 text-sm mb-2 leading-relaxed font-medium">
          More than 50% of tasks are on the critical path. Any delay in these
          tasks will directly impact the project completion date. Consider:
        </p>
        <ul className="space-y-2">
          {[
            "Adding buffer time to critical tasks",
            "Identifying tasks that can be parallelized",
            "Allocating additional resources to critical activities",
          ].map((item, i) => (
            <li
              key={i}
              className="flex items-center gap-3 text-red-500/70 text-sm"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CriticalPathAnalysis;
