import React from "react";
import {
  Clock,
  FilePlus,
  FolderPlus,
  Receipt,
  MapPin,
  BarChart3,
  Phone,
  Users,
} from "lucide-react";

const QuickActions = () => {
  const actions = [
    {
      id: 1,
      label: "New Tender",
      icon: FilePlus,
      color: "text-blue-600",
      bg: "bg-blue-100",
      link: "/admin/tenders/create",
    },
    {
      id: 2,
      label: "New Project",
      icon: FolderPlus,
      color: "text-emerald-600",
      bg: "bg-emerald-100",
    },
    {
      id: 3,
      label: "EOT Requests",
      icon: Clock,
      color: "text-orange-500",
      bg: "bg-orange-100",
    },
    {
      id: 4,
      label: "Bills",
      icon: Receipt,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      id: 5,
      label: "ICCC Map",
      icon: MapPin,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      id: 6,
      label: "Reports",
      icon: BarChart3,
      color: "text-emerald-600",
      bg: "bg-emerald-100",
    },
    {
      id: 7,
      label: "Communicate",
      icon: Phone,
      color: "text-orange-500",
      bg: "bg-orange-100",
    },
    {
      id: 8,
      label: "Users",
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
  ];

  return (
    <div>
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm mt-8">
        <h2 className="text-lg font-bold text-slate-800 mb-6">Quick Actions</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <a
                href={action.link}
                key={action.id}
                className={`
                  relative overflow-hidden flex flex-col items-center justify-center p-4 rounded-2xl border transition-all duration-300 group
                  ${
                    action.isActive
                      ? "bg-slate-50 border-slate-200 shadow-md scale-[1.02]"
                      : "bg-white border-gray-100 hover:bg-zinc-100 hover:border-slate-200 hover:shadow-lg hover:-translate-y-1"
                  }
                `}
              >
                <div className="absolute top-0 right-0 opacity-10 pointer-events-none transition-transform group-hover:scale-125 group-hover:rotate-12">
                  <img
                    src="/assets/images/about_shape2_1.png"
                    alt=""
                    className="w-20"
                  />
                </div>

                <div
                  className={`relative z-10 p-3 rounded-2xl mb-2 transition-all duration-300 group-hover:shadow-inner ${action.bg} ${action.color}`}
                >
                  <Icon
                    size={28}
                    strokeWidth={action.isActive ? 1 : 1.5}
                    className="transition-transform "
                  />
                </div>

                <span className="relative z-10 text-sm font-bold text-slate-800 tracking-tight text-center">
                  {action.label}
                </span>

                {action.isActive && (
                  <div className="absolute bottom-2 w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                )}
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default QuickActions;
