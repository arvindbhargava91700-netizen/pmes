import React from "react";
import ProjectRow from "./ProjectRow";

const AllProjectsCard = ({ selectedProject, setSelectedProject, projects}) => {
  return (
    <div className="bg-white rounded-2xl p-3 shadow-sm">
      <h3 className="font-semibold text-sm mb-3">
        All Projects <span className="text-gray-400">(6)</span>
      </h3>

      <div className="max-h-64 overflow-y-auto pr-2 space-y-3">
        {projects.map((p) => (
          <ProjectRow
            key={p.id}
            {...p}
            active={selectedProject.id === p.id}
            onClick={() => setSelectedProject(p)}
          />
        ))}
      </div>
    </div>
  );
};

export default AllProjectsCard;
