"use client";
import React from "react";

const tasks = [
  {
    id: 1,
    name: "Site Clearance & Setup",
    duration: "2 weeks",
    status: "Critical",
    color: "bg-red-500",
    start: 0,
    width: 2,
  },
  {
    id: 2,
    name: "Foundation Work",
    duration: "6 weeks",
    status: "Critical",
    color: "bg-red-500",
    start: 2,
    width: 5,
  },
  {
    id: 3,
    name: "Structural Framework",
    duration: "12 weeks",
    status: "Critical",
    color: "bg-red-500",
    start: 7,
    width: 10,
  },
  {
    id: 4,
    name: "Electrical & Plumbing",
    duration: "8 weeks",
    status: "Critical",
    color: "bg-red-500",
    start: 12,
    width: 10,
  },
];

const ExactGantt = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-bold text-slate-800">Gantt Chart</h2>
          <div className="flex gap-4 text-[10px] font-medium uppercase tracking-wider text-slate-400">
            <span className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-blue-600" /> Planned
            </span>
            <span className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500" /> Critical Path
            </span>
          </div>
        </div>
      </div>

      <div className="flex overflow-x-auto">
        {/* Left Pane: Milestones List */}
        <div className="min-w-[200px] border-r border-gray-100 z-20 bg-white">
          <div className="bg-gray-50/50 p-3 text-[11px] font-bold text-gray-700 uppercase border-b border-gray-100">
            Milestone <div className="font-normal">Duration</div>
          </div>

          {tasks.map((task) => (
            <div
              key={task.id}
              className="h-20 flex items-center p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <span className="w-8 h-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center text-sm font-bold border border-red-100">
                  {task.id}
                </span>
                <div>
                  <h4 className="text-sm font-bold text-slate-800 leading-none">
                    {task.name}
                  </h4>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-xs text-slate-400 font-medium">
                      {task.duration}
                    </span>
                    <span className="bg-red-500 text-[9px] text-white px-1.5 py-0.5 rounded-full font-black uppercase">
                      Critical
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Pane: Timeline Grid */}
        <div className="flex-1 min-w-[800px]">
          {/* Months Header */}
          <div className="flex border-b border-gray-100 bg-white">
            {["Jan", "Feb", "Mar", "Apr", "May"].map((m) => (
              <div
                key={m}
                className="flex-1 text-center py-2 text-xs font-semibold text-gray-400 border-r border-gray-100"
              >
                {m}
              </div>
            ))}
          </div>
          {/* Weeks Row */}
          <div className="flex border-b border-gray-100 bg-gray-50/30">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="flex-1 min-w-[40px] text-center py-1.5 text-[9px] text-gray-400 border-r border-gray-50"
              >
                W{i + 1}
              </div>
            ))}
          </div>

          {/* Grid Content */}
          <div className="relative">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="h-20 relative border-b border-gray-50 group"
              >
                {/* Horizontal Grid Lines */}
                <div className="absolute inset-0 flex">
                  {Array.from({ length: 20 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex-1 border-r border-gray-50/50"
                    />
                  ))}
                </div>
                {/* The Gantt Bar Container */}
                <div
                  className="absolute top-7 z-20 group cursor-pointer"
                  style={{
                    left: `${task.start * 5}%`,
                    width: `${task.width * 5}%`,
                    marginLeft: "2px",
                  }}
                >
                  {/* The Visual Bar */}
                  <div
                    className={`h-6 rounded-full ${task.color} shadow-sm transition-transform group-hover:scale-[1.02]`}
                  />

                  {/* Tooltip Card */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-3 bg-white border border-zinc-200 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-30">
                    <div className="space-y-1.5 mt-2">
                      <div className="flex justify-between text-[11px]">
                        <span className="">Timeline:</span>
                        <span className="font-medium text-zinc-500">
                          Week {task.start + 1} - Week {task.start + task.width}
                        </span>
                      </div>

                      <div className="flex justify-between text-[11px]">
                        <span className="">Duration:</span>
                        <span className="font-medium">{task.duration}</span>
                      </div>

                      <div className="flex justify-between text-[11px]">
                        <span className="">Status:</span>
                        <span
                          className={`font-bold px-1.5 rounded-sm ${
                            task.status === "Critical"
                              ? "text-red-500"
                              : "text-emerald-500"
                          }`}
                        >
                          {task.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Legend */}
      <div className="p-4 bg-gray-50/50 flex gap-6 border-t border-gray-100">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <div className="w-4 h-4 rounded bg-slate-200" /> Pending
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <div className="w-4 h-4 rounded bg-blue-600" /> In Progress
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <div className="w-4 h-4 rounded bg-emerald-500" /> Completed
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <div className="w-4 h-4 rounded bg-red-500" /> Delayed
        </div>
      </div>
    </div>
  );
};

export default ExactGantt;
