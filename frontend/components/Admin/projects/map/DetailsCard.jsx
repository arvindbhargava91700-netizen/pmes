import { IconEye } from "@tabler/icons-react";
import React from "react";

const DetailsCard = ({ project }) => {
  if (!project) return null;

  return (
    <div className="bg-white rounded-xl p-4 shadow">
      <span className="inline-block bg-blue-500 text-white text-xs px-3 py-0.5 rounded-full mb-2">
        {project.status}
      </span>

      <h2 className="text-lg font-semibold">{project.name}</h2>

      <div className="mt-3 space-y-2 text-sm">
        <div className="flex justify-between text-gray-500">
          <span>Location</span>
          <span className="font-semibold text-zinc-700">
            {project.zone}, {project.ward}
          </span>
        </div>

        <div className="flex justify-between text-gray-500">
          <span>Progress</span>
          <span className="font-semibold text-zinc-700">
            {project.progress}%
          </span>
        </div>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
        <div
          className="bg-blue-500 h-2 rounded-full"
          style={{ width: `${project.progress}%` }}
        />
      </div>

      <a href="/admin/projects/viewDetails"><button className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg flex justify-center items-center gap-1.5">
        <IconEye /> View Details
      </button>
      </a>
    </div>
  );
};

export default DetailsCard;
