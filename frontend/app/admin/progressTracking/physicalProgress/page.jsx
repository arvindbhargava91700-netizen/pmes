"use client";
import React, { useState } from "react";
import {
  Search,
  Download,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Camera,
  ChevronDown,
  Eye,
} from "lucide-react";
import { IconCalendarWeek, IconCamera, IconMapPin } from "@tabler/icons-react";

const PhysicalProgress = () => {
  const projects = [
    {
      id: "PRJ-2024-0045",
      title: "Ward 15 Road Reconstruction",
      client: "ABC Constructions",
      status: "AHEAD",
      progress: 65,
      planned: 60,
      zone: "Zone A",
      photos: 24,
      date: "1/18/2024",
      type: "ahead",
      stages: [
        { stage: "Site Clearance", progress: 100 },
        { stage: "Excavation", progress: 100 },
        { stage: "Base Layer", progress: 80 },
        { stage: "Bitumen Layer", progress: 30 },
      ],
    },
    {
      id: "PRJ-2024-0038",
      title: "Sewerage Line Extension",
      client: "XYZ Infrastructure",
      status: "BEHIND",
      progress: 42,
      planned: 55,
      zone: "Zone B",
      photos: 18,
      date: "1/17/2024",
      type: "behind",
      stages: [
        { stage: "Trenching", progress: 90 },
        { stage: "Pipe Laying", progress: 40 },
        { stage: "Manhole Construction", progress: 10 },
        { stage: "Backfilling", progress: 0 },
      ],
    },
    {
      id: "PRJ-2024-0032",
      title: "Community Hall Construction",
      client: "BuildRight Corp",
      status: "Critical",
      progress: 28,
      planned: 50,
      zone: "Zone C",
      photos: 12,
      date: "1/15/2024",
      type: "red",
      stages: [
        { stage: "Foundation", progress: 100 },
        { stage: "Pillar Work", progress: 40 },
        { stage: "Roofing", progress: 0 },
        { stage: "Finishing", progress: 0 },
      ],
    },
  ];
  const [activeProjectId, setActiveProjectId] = useState(projects[0].id);

  const currentProject =
    projects.find((p) => p.id === activeProjectId) || projects[0];

  const summaryStats = [
    {
      label: "Avg. Progress",
      value: "43%",
      icon: BarChart3,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Ahead of Schedule",
      value: "1",
      icon: TrendingUp,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Behind Schedule",
      value: "1",
      icon: TrendingDown,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
    {
      label: "Total Photos",
      value: "62",
      icon: Camera,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
  ];

  return (
    <div className="p-6 bg-[#f8f9fa] min-h-screen font-sans mt-10">
      {/* Header & Stats - Same as yours */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Physical Progress
          </h1>
          <p className="text-slate-500 text-sm">
            Track stage-wise completion and photo evidence
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg bg-white text-sm font-semibold cursor-pointer hover:bg-slate-50">
          <Download size={16} /> Export Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {summaryStats.map((stat, i) => (
          <div
            key={i}
            className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center gap-4"
          >
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}
            >
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400">{stat.label}</p>
              <p className="text-xl font-bold text-slate-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Left: Project List */}
        <div className="col-span-8 space-y-4">
          <div className="flex gap-3 mb-4 bg-white p-4 rounded-2xl border border-zinc-100">
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search projects..."
                className="w-full pl-10 pr-4 py-2 bg-zinc-100 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>
            <select className="px-4 py-2 bg-zinc-100 border border-slate-200 rounded-xl text-sm font-medium">
              <option>All Status</option>
            </select>
          </div>

          {projects.map((prj, i) => (
            <div
              key={i}
              onClick={() => setActiveProjectId(prj.id)}
              className={`bg-white p-6 rounded-2xl cursor-pointer transition-all duration-200 ${
                activeProjectId === prj.id
                  ? "border-2 border-blue-500 shadow-md ring-blue-50"
                  : "border border-slate-100 hover:border-blue-200"
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400 font-bold">
                      {prj.id}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        prj.type === "ahead"
                          ? "bg-emerald-100 text-emerald-600"
                          : prj.type === "red"
                          ? "bg-orange-100 text-orange-600"
                          : "bg-blue-100 text-blue-600"
                      }`}
                    >
                      {prj.type === "ahead"
                        ? "↗ AHEAD"
                        : prj.type === "red"
                        ? "↘ CRITICAL"
                        : "↘ BEHIND"}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {prj.title}
                  </h3>
                  <p className="text-sm text-slate-400">{prj.client}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-slate-900">
                    {prj.progress}%
                  </p>
                  <p
                    className={`text-xs font-bold ${
                      prj.type === "ahead"
                        ? "text-emerald-500"
                        : "text-orange-500"
                    }`}
                  >
                    {prj.progress > prj.planned
                      ? `+${prj.progress - prj.planned}`
                      : `-${prj.planned - prj.progress}`}
                    % vs planned
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2 mb-4">
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      prj.type === "ahead" ? "bg-emerald-500" : "bg-orange-400"
                    }`}
                    style={{ width: `${prj.progress}%` }}
                  ></div>
                </div>
                <div className="flex justify-end text-[10px] text-slate-400 font-bold">
                  Planned: {prj.planned}%
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-50 text-[10px] font-bold text-slate-400 uppercase">
                <span className="flex items-center gap-1.5">
                  <IconMapPin size={14} /> {prj.zone}
                </span>
                <span className="flex items-center gap-1.5">
                  <IconCamera size={14} /> {prj.photos} Photos
                </span>
                <span className="flex items-center gap-1.5">
                  <IconCalendarWeek size={14} /> {prj.date}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Right: Stage-wise Progress (DYNAMIC) */}
        <div className="col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h4 className="font-bold text-slate-900 mb-6 flex items-center justify-between">
              Stage-wise Progress
              
            </h4>
            <div className="space-y-6">
              {currentProject.stages.map(
                (
                  s,
                  i 
                ) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between text-sm font-medium">
                      <span className="text-slate-700">{s.stage}</span>
                      <span className="text-slate-400">{s.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-blue-600 h-full rounded-full transition-all duration-700"
                        style={{ width: `${s.progress}%` }}
                      ></div>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Photos Section - Same as yours */}
          <div className="space-y-6 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="mb-4 flex justify-between items-center">
              <h1 className="font-bold text-slate-900 text-md">
                Recent Photos
              </h1>
              <button className="text-black cursor-pointer text-md font-semibold">
                View All
              </button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="p-5 bg-slate-50 border border-slate-100 rounded-xl flex justify-center items-center group hover:bg-slate-100 cursor-pointer"
                >
                  <Camera
                    size={20}
                    className="text-slate-300 group-hover:text-slate-400"
                  />
                </div>
              ))}
            </div>
            <button className="w-full flex items-center justify-center bg-blue-600 hover:bg-blue-700 p-2.5 rounded-xl text-white font-bold text-sm gap-2 transition-all shadow-md shadow-blue-100">
              <Eye size={18} /> View Full Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhysicalProgress;
