import React from "react";
import ProgressLine from "./ProgressLine";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

const ProjectRow = ({
  name,
  company,
  budget,
  released,
  releasePerc,
  utilized,
  pending,
  physical,
  financial,
  status,
}) => {
  const isMismatch = status === "MISMATCH";
  const diff = physical - financial;

  return (
    <tr className="hover:bg-zinc-50 transition-colors">
      <td className="px-6 py-5">
        <div className="font-semibold text-slate-800 leading-tight">{name}</div>
        <div className="text-slate-400 text-sm">{company}</div>
      </td>
      <td className="px-6 font-semibold text-slate-800">{budget}</td>
      <td className="px-6">
        <div className="text-emerald-600 font-bold">{released}</div>
        <div className="text-slate-400 text-xs">{releasePerc} of budget</div>
      </td>
      <td className="px-6">
        <div className="font-semibold text-slate-800">{utilized}</div>
        <div className="w-24 h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
          <div className="bg-indigo-600 h-full w-[80%]" />
        </div>
      </td>
      <td className="px-6 font-semibold text-amber-500">{pending || "-"}</td>
      <td className="px-6 py-5 min-w-[200px]">
        <div className="flex items-center gap-4">
          <div className="flex-1 space-y-3">
            <ProgressLine
              label="Physical"
              value={physical}
              color="bg-blue-500"
            />
            <ProgressLine
              label="Financial"
              value={financial}
              color="bg-orange-500"
            />
          </div>
          <div
            className={`flex items-center font-black ${
              diff >= 0 ? "text-green-500" : "text-red-500"
            }`}
          >
            {diff >= 0 ? (
              <ArrowUpRight size={18} />
            ) : (
              <ArrowDownRight size={18} />
            )}
            {Math.abs(diff)}%
          </div>
        </div>
      </td>
      <td className="px-6">
        <span
          className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border ${
            isMismatch
              ? "bg-rose-50 text-rose-500 border-rose-100"
              : "bg-emerald-50 text-emerald-500 border-emerald-100"
          }`}
        >
          {status}
        </span>
      </td>
    </tr>
  );
};

export default ProjectRow;
