import React from "react";

const MetricCard = ({ icon: Icon, title, value, subtext, color, colorbg }) => {
  return (
    <div className={`${colorbg} p-4 rounded-2xl border border-zinc-200 flex  gap-3 hover:shadow-xl hover:-translate-y-1 transition-all duration-300`}>
      <div className={`h-12 w-12 flex justify-center items-center rounded-xl ${color}`}>
        <Icon size={20} />
      </div>
      <div>
        <p className="text-slate-500 font-semibold">{title}</p>
        <h2 className="text-2xl font-bold font-black text-slate-800">{value}</h2>
        {subtext && (
          <p className="text-emerald-500 text-sm">{subtext}</p>
        )}
      </div>
    </div>
  );
};

export default MetricCard;
