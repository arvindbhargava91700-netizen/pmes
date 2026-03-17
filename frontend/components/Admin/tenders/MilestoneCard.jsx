import React, { useState } from "react"; // 1. useState import karein
import { GripVertical, Trash2, ChevronDown, ChevronUp } from "lucide-react";

const MilestoneCard = ({
  id,
  title,
  duration,
  dependencies,
  initialExpanded = false,
}) => {
  const [isOpen, setIsOpen] = useState(initialExpanded);

  return (
    <div className="w-full border-1 border-red-300 rounded-2xl bg-red-50/50 p-4 mt-2">
      <div className="flex justify-between items-center gap-2">
        <div className="flex items-center gap-2">
          <GripVertical className="text-gray-500 cursor-grab" size={20} />
          <span className="flex items-center justify-center w-8 h-8 rounded-2xl bg-red-100 text-red-500 font-semibold text-sm">
            {id}
          </span>

          <div className="grid grid-cols-12 gap-3">
            <div className="col-span-8">
              <input
                type="text"
                defaultValue={title}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div className="col-span-4">
              <input
                type="number"
                defaultValue={duration}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          {dependencies.length > 0 && !isOpen && (
            <span className="px-3 py-1 text-nowrap bg-blue-50 text-zinc-600 text-xs font-medium rounded-full">
              {dependencies.length} dep
            </span>
          )}

          <span className="px-2 py-0.5 bg-red-500 hover:bg-red-400 text-white text-xs font-bold rounded-full tracking-wider">
            Critical
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-slate-400 hover:text-blue-600 px-2 transition-transform h-10 w-10 hover:bg-zinc-100 hover:border border-zinc-200 flex justify-center items-center cursor-pointer rounded-xl"
          >
            {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>

          <button className="text-slate-500 hover:text-red-500 h-10 w-10 hover:bg-zinc-100 hover:border border-zinc-200 flex justify-center items-center cursor-pointer rounded-xl">
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="mt-6 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200 border-t border-zinc-200">
          <div>
            <label className="block text-sm font-medium text-slate-600 my-2">
              Description
            </label>
            <textarea
              className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl text-slate-600 min-h-[80px]"
              placeholder="Milestone description..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">
             Dependencies (select milestones that must complete before this one)
            </label>
            <div className="flex flex-wrap gap-2">
              {dependencies.map((dep, idx) => (
                <button
                  key={idx}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm text-slate-700 hover:text-blue-500 cursor-pointer"
                >
                  <span className="text-slate-400">{dep.id}</span> {dep.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MilestoneCard;
