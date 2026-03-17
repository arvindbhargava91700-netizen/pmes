import React from "react";

const ProgressLine = ({ label, value, color }) => {
  return (
    <div className="flex items-center gap-3 text-[10px] font-bold uppercase text-slate-400 min-w-[160px]">
      {/* Label - Fixed width to keep bars aligned */}
      <span className="w-14 shrink-0">{label}</span>
      
      {/* Progress Track */}
      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
        {/* The Bar - Ensure 'color' is a full Tailwind class like 'bg-blue-500' */}
        <div 
          className={`${color} h-full transition-all duration-500`} 
          style={{ width: `${value}%` }} 
        />
      </div>
      
      {/* Percentage Label */}
      <span className="w-8 text-slate-700 text-right font-black shrink-0">
        {value}%
      </span>
    </div>
  );
};

export default ProgressLine;