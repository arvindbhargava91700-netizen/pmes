import React from "react";
import {
  IconEye,
  IconDots,
  IconCalendar,
  IconAlertTriangle,
  IconClock,
  IconMessageReport,
  IconMapPin,
} from "@tabler/icons-react";
import { FileWarning } from "lucide-react";

const projects = [
  {
    id: "PRJ-2024-0045",
    name: "Ward 15 Road Reconstruction",
    company: "ABC Constructions Pvt Ltd",
    zone: "Zone A",
    status: "On Track",
    physical: 65,
    dueDate: "3/15/2025",
    statusColor: "bg-emerald-100 text-emerald-600",
  },
  {
    id: "PRJ-2024-0038",
    name: "Sewerage Line Extension - Sector 12",
    company: "XYZ Infrastructure",
    zone: "Zone B",
    status: "Delayed",
    delay: "12d",
    physical: 42,
    dueDate: "2/28/2025",
    statusColor: "bg-orange-100 text-orange-600",
  },
  {
    id: "PRJ-2024-0032",
    name: "Community Hall Construction",
    company: "BuildRight Corp",
    zone: "Zone C",
    status: "Critical",
    delay: "45d",
    physical: 28,
    dueDate: "1/30/2025",
    statusColor: "bg-red-100 text-red-600",
  },
  {
    id: "PRJ-2024-0033",
    name: "Community Hall Construction",
    company: "BuildRight Corp",
    zone: "Zone D",
    status: "Completed",
    delay: "45d",
    physical: 28,
    dueDate: "1/30/2025",
    statusColor: "bg-green-100 text-green-600",
  },
];

const alerts = [
  {
    title: "Critical Delay Alert",
    description:
      "PRJ-2024-0032 has exceeded 45 days delay. Immediate action required.",
    time: "2 hours ago",
    action: "View Project",
    icon: <IconAlertTriangle size={20} />,
    bg: "bg-red-50/50",
    border: "border-red-100",
    titleColor: "text-red-700",
    iconColor: "text-red-500",
  },
  {
    title: "EOT Request Pending",
    description: "3 time extension requests awaiting commissioner approval.",
    time: "5 hours ago",
    action: "Review",
    icon: <IconClock size={20} />,
    bg: "bg-amber-50/30",
    border: "border-amber-100",
    titleColor: "text-amber-700",
    iconColor: "text-amber-500",
  },
  {
    title: "Grievance SLA Breach",
    description: "2 public grievances have exceeded 48-hour response time.",
    time: "1 day ago",
    action: "Resolve",
    icon: <IconClock size={20} />,
    bg: "bg-amber-50/30",
    border: "border-amber-100",
    titleColor: "text-amber-700",
    iconColor: "text-amber-500",
  },
  {
    title: "Payment Pending",
    description: "₹2.4 Cr payment pending release for 5 projects.",
    time: "1 day ago",
    action: "Process",
    icon: <FileWarning size={20} />,
    bg: "bg-blue-50/30",
    border: "border-blue-100",
    titleColor: "text-blue-700",
    iconColor: "text-blue-500",
  },
];

export default function RecentProject() {
  return (
    <div className="gap-6 pt-6 bg-[#f8fafc] max-h-screen grid md:grid-cols-12 grid-cols-1">
      {/* Recent Projects */}
      <div className="md:col-span-8 bg-white rounded-xl border border-zinc-200">
        <div className="p-3 px-6 border-b border-zinc-300 flex justify-between items-center">
          <div className="flex gap-3">
            <div>
              <h2 className="text-xl font-bold">Recent Projects</h2>
              <p className="text-sm text-zinc-500">
                Overview of project status and progress
              </p>
            </div>
          </div>
          <button className="px-4 py-2 text-sm bg-zinc-100 rounded-lg">
            View All
          </button>
        </div>

        <div className="overflow-auto h-150">
          <table className="w-full">
            <thead className="bg-zinc-100 text-xs text-zinc-400 uppercase border-b border-zinc-300">
              <tr className="text-nowrap">
                <th className="px-6 py-4">Project ID</th>
                <th className="px-6 py-4">Project Name</th>
                <th className="px-6 py-4">Zone</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Physical %</th>
                <th className="px-6 py-4">Due Date</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {projects.map((p, i) => (
                <tr
                  key={i}
                  className="hover:bg-zinc-50 border-b border-zinc-200"
                >
                  <td className="px-6 py-6 text-xs font-bold">{p.id}</td>

                  <td className="px-6 py-5">
                    <h4 className="text-sm font-bold">{p.name}</h4>
                    <p className="text-[11px] text-zinc-400 uppercase">
                      {p.company}
                    </p>
                  </td>

                  <td className="px-6 py-5">
                    <div className="flex items-center text-nowrap gap-1 text-xs">
                      <IconMapPin size={14} />
                      {p.zone}
                    </div>
                  </td>

                  <td className="px-6 py-5">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-bold text-nowrap ${p.statusColor}`}
                    >
                      {p.status}
                    </span>
                    {p.delay && (
                      <div className="flex items-center gap-1 text-red-500 text-[10px] mt-1">
                        <IconAlertTriangle size={12} /> {p.delay} Delay
                      </div>
                    )}
                  </td>

                  <td className="px-6 py-5">
                    <div className="w-28">
                      <span className="text-xs font-bold">{p.physical}%</span>
                      <div className="h-1.5 bg-zinc-100 rounded-full mt-1">
                        <div
                          className="h-full bg-blue-600 rounded-full"
                          style={{ width: `${p.physical}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-5 text-xs">
                    <p className="flex items-center gap-2">
                      <IconCalendar size={14} />
                      {p.dueDate}
                    </p>
                  </td>

                  <td className="px-6 py-5 text-center">
                    <div className="flex justify-center gap-2">
                      <span className="hover:bg-zinc-200 h-10 w-10 flex justify-center items-center rounded-xl cursor-pointer hover:text-blue-500">
                        <IconEye size={18} />
                      </span>
                      <span className="hover:bg-zinc-200 h-10 w-10 flex justify-center items-center rounded-xl cursor-pointer hover:text-blue-500">
                        <IconDots size={18} />
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Alerts */}
      <div className="md:col-span-4 space-y-4 bg-white rounded-xl border border-zinc-200">
        <div className="flex justify-between items-center p-4 pb-5 border-b border-zinc-300">
          <div className="flex gap-2 font-bold">
            <IconMessageReport />
            Alerts & Notifications
          </div>
          <div>
            <a href="#" className="hover:text-blue-500">
              View All
            </a>
          </div>
        </div>

        <div className="px-4">
          {alerts.map((a, i) => (
            <div
              key={i}
              className={`p-3 my-3 rounded-xl border ${a.bg} ${a.border}`}
            >
              <div className="grid grid-cols-12 gap-1">
                <div className="flex gap-2 col-span-8">
                  <div className={a.iconColor}>{a.icon}</div>
                  <div>
                    <h4 className={`font-bold ${a.titleColor}`}>{a.title}</h4>
                    <p className="text-xs text-zinc-500 mt-1">
                      {a.description}
                    </p>
                    <span className="text-[10px] text-zinc-400 uppercase">
                      {a.time}
                    </span>
                  </div>
                </div>
                <button
                  className={`col-span-4 text-xs flex justify-center items-center border-zinc-300 bg-zinc-100 h-6 font-semibold text-nowrap border px-3 py-1 rounded-lg ${a.iconColor}`}
                >
                  {a.action}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
