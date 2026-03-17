import React from "react";

const ProjectRow = ({ name, ward, progress, color, active, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`flex items-center justify-between p-2 rounded-lg cursor-pointer ${
        active ? "bg-blue-50" : "hover:bg-gray-50"
      }`}
    >
      <div className="flex items-start gap-3">
        <span className={`w-2 h-2 rounded-full mt-2 ${color}`} />
        <div>
          <p className="text-sm font-medium truncate w-36">{name}</p>
          <p className="text-xs text-gray-400">{ward}</p>
        </div>
      </div>
      <span className="text-sm font-medium text-gray-700">{progress}%</span>
    </div>
  );
};

export default ProjectRow;
