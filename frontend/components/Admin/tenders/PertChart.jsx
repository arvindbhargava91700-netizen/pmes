"use client";
import { IconFlag } from "@tabler/icons-react";
import React, { useState } from "react";

const pertData = [
  { id: 1, name: "Site Clearance & Setup", es: 0, ef: 2, ls: 0, lf: 2 },
  { id: 2, name: "Foundation Work", es: 2, ef: 8, ls: 2, lf: 8 },
  { id: 3, name: "Structural Framework", es: 8, ef: 20, ls: 8, lf: 20 },
  { id: 4, name: "Electrical & Plumbing", es: 20, ef: 28, ls: 20, lf: 28 },
  { id: 5, name: "Interior Finishing", es: 20, ef: 28, ls: 20, lf: 28 },
  { id: 6, name: "Final Inspection", es: 20, ef: 28, ls: 20, lf: 28 },
];

const PertNode = ({ task }) => (
  <div className="flex-shrink-0 w-[140px]">
    <div className="relative bg-white border-2 border-red-500 rounded-xl shadow-sm mt-5">
      {/* Critical Badge center mein */}
      <div className="absolute -top-3 left-12 -translate-x-1/2 bg-red-500 text-white text-[10px] font-bold px-3 py-0.5 rounded-full uppercase">
        Critical
      </div>

      <div className="pt-4 pb-2 px-2 text-center bg-red-500 rounded-t-[10px]">
        <h4 className="text-xs font-bold text-white truncate">{task.name}</h4>
      </div>

      <div className="grid grid-cols-2 border-t border-red-100 bg-white rounded-b-xl">
        <div className="p-2 border-r border-b border-red-500/10 text-center">
          <p className="text-[9px] text-gray-400 font-bold">ES</p>
          <p className="text-sm font-bold text-slate-700">{task.es}</p>
        </div>
        <div className="p-2 border-b border-red-500/10 text-center">
          <p className="text-[9px] text-gray-400 font-bold">EF</p>
          <p className="text-sm font-bold text-slate-700">{task.ef}</p>
        </div>
        <div className="p-2 border-r border-red-500/10 text-center">
          <p className="text-[9px] text-gray-400 font-bold">LS</p>
          <p className="text-sm font-bold text-slate-700">{task.ls}</p>
        </div>
        <div className="p-2 text-center">
          <p className="text-[9px] text-gray-400 font-bold">LF</p>
          <p className="text-sm font-bold text-slate-700">{task.lf}</p>
        </div>
      </div>
    </div>
  </div>
);

const PertChart = ({ onRedirect }) => {
  return (
    <div className="w-full">
      <div className="flex justify-between items-center bg-[#fbfbfc] border border-zinc-100 rounded-t-xl p-4">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold text-slate-800">PERT Chart</h2>
          <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium border border-gray-200">
            🕒 Project Duration: 40 weeks
          </span>
        </div>
        <div className="flex gap-6 text-sm font-semibold text-gray-500">
          <span className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-red-500" /> Critical Path
          </span>
          <span className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-gray-500" /> Non-Critical
          </span>
        </div>
      </div>

      <div className="bg-white p-4 md:p-6 rounded-b-xl shadow-sm border border-gray-100">
        {/* Scrollable Node Container */}
        <div className="overflow-x-auto pb-6 no-scrollbar">
          <div className="w-max flex items-center">
            {pertData.map((task, index) => (
              <React.Fragment key={task.id}>
                <PertNode task={task} />
                {index < pertData.length - 1 && (
                  <div className="w-8 h-[2px] bg-red-500 mb-[30px] relative flex-shrink-0">
                    <div className="absolute right-0 -top-[4px] border-l-8 border-l-red-500 border-y-[5px] border-y-transparent" />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Bottom Critical Path Sequence */}
        <div className="mt-8 border-t pt-6">
          <div className="flex items-center gap-2 text-zinc-700 font-semibold text-sm mb-4">
            <IconFlag size={18} className="text-red-500" /> Critical Path
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {pertData.map((task, index) => (
              <React.Fragment key={task.id}>
                <span
                  onClick={onRedirect}
                  className="bg-red-500 text-white px-3 cursor-pointer py-1 rounded-full text-xs font-semibold shadow-sm"
                >
                  {task.name}
                </span>
                {index < pertData.length - 1 && (
                  <span className="text-gray-400">→</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PertChart;
