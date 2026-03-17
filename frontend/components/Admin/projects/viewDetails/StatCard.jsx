import React from "react";

const StatCard = ({ icon, title, value, progress, sub, green, yellow }) => {

  const bg = green
    ? "bg-green-50 text-green-600"
    : yellow
    ? "bg-yellow-100 text-yellow-600"
    : "bg-blue-50 text-blue-600";

  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center ${bg}`}
        >
          {typeof icon === "string" ? (
            <span className="font-bold">{icon}</span>
          ) : (
            icon
          )}
        </div>

        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </div>

      {progress !== undefined && (
        <div className="mt-3">
          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {sub && <p className="text-xs text-gray-400 mt-2">{sub}</p>}
    </div>
  );
};

export default StatCard;
