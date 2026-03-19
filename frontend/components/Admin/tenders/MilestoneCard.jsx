import React, { useState } from "react";
import { GripVertical, Trash2, ChevronDown, ChevronUp } from "lucide-react";

const MilestoneCard = ({
  id,
  data,
  dependenciesList,
  onChange,
  onDependencyChange,
  onDelete,
  initialExpanded = false,
}) => {
  const [isOpen, setIsOpen] = useState(initialExpanded);

  return (
    <div className="w-full bg-red-50 border border-red-200 rounded-2xl p-4 mt-3 shadow-sm hover:shadow-md transition">
      {/* TOP ROW */}
      <div className="flex justify-between items-start gap-3">
        <div className="flex gap-3 w-full">
          <GripVertical className="text-gray-400 mt-2 cursor-grab" size={18} />

          {/* ID */}
          <div className="w-9 h-9 flex items-center justify-center rounded-xl bg-blue-50 text-blue-600 font-semibold text-sm">
            {id}
          </div>

          {/* INPUTS */}
          <div className="grid grid-cols-12 gap-3 w-full">
            <div className="col-span-8">
              <input
                type="text"
                value={data?.milestone_title || ""}
                onChange={(e) => onChange("milestone_title", e.target.value)}
                placeholder="Enter milestone title..."
                className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div className="col-span-4">
              <input
                type="number"
                value={data?.duration_weeks || ""}
                onChange={(e) => onChange("duration_weeks", e.target.value)}
                placeholder="Weeks"
                className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          {/* TAGS */}
          <div className="flex items-center gap-2">
            {(data.dependencies || []).length > 0 && (
              <span className="text-xs bg-blue-50 text-blue-600 text-nowrap px-3 py-1 rounded-full font-medium">
                {data.dependencies.length} Dependencies
              </span>
            )}

            <span className="text-xs bg-red-600 text-white px-3 py-1 rounded-full font-medium">
              Critical
            </span>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="h-9 w-9 flex items-center justify-center rounded-lg hover:bg-zinc-100 hover:text-blue-500 cursor-pointer text-gray-500"
          >
            {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>

          <button
            onClick={onDelete}
            className="h-9 w-9 flex items-center justify-center rounded-lg hover:bg-red-50 text-gray-500 hover:text-red-500 cursor-pointer"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {/* EXPANDED */}
      {isOpen && (
        <div className="mt-5 border-t border-zinc-300 pt-4 space-y-4">
          {/* Description */}
          <div>
            <label className="text-sm font-medium text-gray-600 mb-1 block">
              Description
            </label>
            <textarea
              rows={4}
              value={data.description}
              onChange={(e) => onChange("description", e.target.value)}
              placeholder="Write milestone description..."
              className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Dependencies */}
          <div>
            <label className="text-sm font-medium text-gray-600 mb-2 block">
              Dependencies (select milestones that must complete before this
              one)
            </label>

            <div className="flex flex-wrap gap-2">
              {dependenciesList.map((dep) => {
                const active = data.dependencies.includes(dep.id);

                return (
                  <button
                    key={dep.id}
                    onClick={() => onDependencyChange(dep.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                      active
                        ? "bg-zinc-200 text-zinc-700 border-zinc-300"
                        : "bg-zinc-50 text-gray-600 border-zinc-200 hover:bg-zinc-100"
                    }`}
                  >
                    {dep.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MilestoneCard;
