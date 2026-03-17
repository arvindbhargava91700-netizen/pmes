"use client";

import AllProjectsCard from "@/components/Admin/projects/map/AllProjectsCard";
import ControlButton from "@/components/Admin/projects/map/ControlButton";
import DetailsCard from "@/components/Admin/projects/map/DetailsCard";
import Legend from "@/components/Admin/projects/map/Legend";
import Pin from "@/components/Admin/projects/map/Pin";
import Zone from "@/components/Admin/projects/map/Zone";
import SelectInput from "@/components/selectInput";
import { IconStackMiddle } from "@tabler/icons-react";
import { Locate } from "lucide-react";
import { useState } from "react";
import { FaSearchMinus, FaSearchPlus } from "react-icons/fa";

const projects = [
  {
    id: 1,
    name: "Road Reconstruction",
    ward: "Ward 15",
    zone: "Zone A",
    progress: 65,
    status: "On Track",
    color: "bg-green-500",
    x: "28%",
    y: "32%",
  },
  {
    id: 2,
    name: "Sewerage Extension",
    ward: "Ward 22",
    zone: "Zone B",
    progress: 42,
    status: "Delayed",
    color: "bg-orange-500",
    x: "45%",
    y: "50%",
  },
  {
    id: 3,
    name: "Community Hall",
    ward: "Ward 8",
    zone: "Zone B",
    progress: 28,
    status: "Critical",
    color: "bg-red-500",
    x: "62%",
    y: "30%",
  },
  {
    id: 4,
    name: "Street Lighting",
    ward: "Ward 10",
    zone: "Zone A",
    progress: 100,
    status: "Completed",
    color: "bg-blue-500",
    x: "35%",
    y: "60%",
  },
];

export default function ProjectMapPage() {
  const [selectedEvent, setSelectedEvent] = useState("All Projects");
  const [selectedProject, setSelectedProject] = useState(projects[3]);

  const eventOptions = [
    "All Projects",
    "On Track",
    "Delayed",
    "Critical",
    "Completed",
  ];
  return (
    <div className="p-6 bg-gray-50 min-h-screen mt-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold">Project Map</h1>
          <p className="text-sm text-gray-500">
            GIS-based view of all infrastructure projects
          </p>
        </div>

        <div className="flex gap-3">
          <SelectInput
            options={eventOptions}
            selected={selectedEvent}
            setSelected={setSelectedEvent}
          />
          <button className="border border-zinc-200 text-zinc-600 rounded-xl px-4 py-1 text-sm bg-white flex items-center gap-1">
            <IconStackMiddle size={20} /> Layers
          </button>
        </div>
      </div>

      {/* Layout */}
      <div className="grid grid-cols-12 gap-4">
        {/* MAP */}
        <div className="col-span-9 bg-zinc-100 rounded-xl relative overflow-hidden h-[520px] p-4">
          {/* Grid */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(#e5e7eb 1px, transparent 1px), linear-gradient(90deg, #e5e7eb 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />

          {/* Zones */}
          <Zone label="Zone A" className="top-10 left-10 border-blue-200" />
          <Zone label="Zone B" className="top-10 right-16 border-green-200" />
          <Zone
            label="Zone C"
            className="bottom-24 left-16 border-orange-200"
          />
          <Zone
            label="Zone D"
            className="bottom-20 right-20 border-purple-300"
          />

          {/* Pins */}
          {projects.map((p) => (
            <Pin
              key={p.id}
              x={p.x}
              y={p.y}
              color={p.color}
              active={selectedProject.id === p.id}
              onClick={() => setSelectedProject(p)}
            />
          ))}

          {/* Controls */}
          <div className="absolute right-4 top-4 space-y-2">
            <ControlButton icon={<FaSearchPlus size={13} />} />
            <ControlButton icon={<FaSearchMinus size={13} />} />
            <ControlButton icon={<Locate size={15} />} />
          </div>

          {/* Legend */}
          <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow text-xs space-y-2">
            <p className="font-semibold">Project Status</p>
            <Legend color="bg-green-500" text="On Track" />
            <Legend color="bg-orange-500" text="Delayed" />
            <Legend color="bg-red-500" text="Critical" />
            <Legend color="bg-blue-500" text="Completed" />
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="col-span-3 space-y-4">
          <DetailsCard project={selectedProject} />
          <AllProjectsCard
            projects={projects}
            selectedProject={selectedProject}
            setSelectedProject={setSelectedProject}
          />
        </div>
      </div>
    </div>
  );
}
