import React from 'react';

const departmentData = [
  { name: "Roads & Highways", percentage: 75, projects: 24, onTrack: 18, delayed: 6, color: "bg-orange-400", textColor: "text-orange-400" },
  { name: "Water & Sewerage", percentage: 67, projects: 18, onTrack: 12, delayed: 6, color: "bg-orange-400", textColor: "text-orange-400" },
  { name: "Parks & Recreation", percentage: 83, projects: 12, onTrack: 10, delayed: 2, color: "bg-emerald-500", textColor: "text-emerald-500" },
  { name: "Electrical", percentage: 87, projects: 15, onTrack: 13, delayed: 2, color: "bg-emerald-500", textColor: "text-emerald-500" },
  { name: "Buildings", percentage: 63, projects: 8, onTrack: 5, delayed: 3, color: "bg-orange-400", textColor: "text-orange-400" },
];

const PerformanceScorecard = () => {
  return (
    <div className="w-full p-6 bg-white rounded-xl border border-gray-100 shadow-sm mt-20">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-slate-800">Department Performance</h2>
        <p className="text-gray-500 text-sm">Project execution scorecard by department</p>
      </div>

      {/* List */}
      <div className="space-y-5">
        {departmentData.map((item, index) => (
          <div key={index} className="relative border-t border-zinc-300 pt-5">
            {/* Title & Percentage */}
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold text-slate-700">{item.name}</span>
              <span className={`font-bold text-lg ${item.textColor}`}>{item.percentage}%</span>
            </div>

            {/* Progress Bar Background */}
            <div className="w-full bg-gray-100 rounded-full h-2">
              {/* Actual Progress */}
              <div 
                className={`${item.color} h-2 rounded-full`} 
                style={{ width: `${item.percentage}%` }}
              ></div>
            </div>

            {/* Stats Footer */}
            <div className="flex gap-4 mt-2 text-xs font-medium">
              <span className="text-gray-400">{item.projects} Projects</span>
              <span className="text-emerald-500">{item.onTrack} On Track</span>
              <span className="text-red-400">{item.delayed} Delayed</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PerformanceScorecard;    