import React from "react";
import {
  FileText,
  Clock,
  AlertTriangle,
  Search,
  Filter,
  Eye,
  MoreHorizontal,
  Download,
  Plus,
  MapPin,
  CheckCircle,
  TriangleAlert,
  ChevronDown,
} from "lucide-react";

const TenderDashboard = () => {
  const stats = [
    {
      label: "Total Tenders",
      count: 6,
      icon: <FileText className="text-blue-600" />,
      bg: "bg-blue-100",
    },
    {
      label: "Published",
      count: 1,
      icon: <Clock className="text-sky-500" />,
      bg: "bg-sky-100",
    },
    {
      label: "Under Evaluation",
      count: 1,
      icon: <AlertTriangle className="text-amber-500" />,
      bg: "bg-amber-100",
    },
    {
      label: "Awarded",
      count: 2,
      icon: <CheckCircle className="text-green-500" />,
      bg: "bg-green-100",
    },
  ];

  const tenders = [
    {
      id: "TND-2024-0075",
      title: "Smart Street Lighting - Phase 3",
      dept: "Electrical",
      value: "₹ 7.2 Cr",
      status: "AWARDED",
      date: "12/30/2023",
      bids: 6,
      statusColor: "bg-emerald-100 text-emerald-700",
      icon: <Clock size={13} className="text-green-600" />,
    },
    {
      id: "TND-2024-0074",
      title: "Park Development - Gandhi Maidan",
      dept: "Parks & Recreation",
      value: "₹ 2.1 Cr",
      status: "DRAFT",
      date: "-",
      bids: 0,
      statusColor: "bg-slate-100 text-slate-600",
      icon: <FileText size={13} className="text-slate-600" />,
    },
    {
      id: "TND-2024-0073",
      title: "Water Supply Pipeline - Zone C",
      dept: "Water & Sewerage",
      value: "₹ 5.8 Cr",
      status: "CANCELLED",
      date: "12/25/2023",
      bids: 2,
      statusColor: "bg-red-100 text-red-600",
      icon: <TriangleAlert size={13} className="text-red-600" />,
    },
  ];

  return (
    <div className="bg-[#f8f9fa] min-h-screen p-8 pt-20 font-sans">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Tender Management
          </h1>
          <p className="text-slate-500 mt-1">
            Create and manage tenders for infrastructure projects
          </p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all">
            <Download size={18} /> Export
          </button>
          <button className="flex items-center gap-2 bg-[#2563eb] px-4 py-2 rounded-lg text-sm font-semibold text-white hover:bg-blue-700 transition-all shadow-sm">
            <Plus size={18} /> Create Tender
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4"
          >
            <div className={`${stat.bg} p-4 rounded-xl`}>{stat.icon}</div>
            <div>
              <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
              <div className="flex items-baseline gap-8">
                <span className="text-3xl font-bold text-slate-900">
                  {stat.count}
                </span>
                {stat.secondaryCount && (
                  <span className="text-3xl font-bold text-slate-900">
                    {stat.secondaryCount}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap bg-white p-5 rounded-xl border border-zinc-200 gap-3 mb-6">
        <div className="relative flex-1 min-w-[300px]">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600"
            size={18}
          />
          <input
            type="text"
            placeholder="Search tenders by ID, title..."
            className="w-full pl-10 pr-4 py-2.5 bg-zinc-100 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="relative w-48">
          <select className="w-full appearance-none bg-zinc-100 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="evaluation">Under Evaluation</option>
            <option value="awarded">Awarded</option>
          </select>

          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-600">
            <ChevronDown size={18} className="font-bold" />
          </div>
        </div>

        <div className="relative w-48">
          <select className="w-full appearance-none bg-zinc-100 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
            <option value="all">All Departments</option>
            <option value="Roads">Roads & Highways</option>
            <option value="Water">Water & Sewerage</option>
            <option value="Electrical">Electrical</option>
            <option value="Buildings">Buildings</option>
          </select>

          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-600">
            <ChevronDown size={18} className="font-bold" />
          </div>
        </div>
        <button className="flex items-center gap-2 bg-zinc-100 border border-slate-200 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:text-blue-500 cursor-pointer">
          <Filter size={18} /> More Filters
        </button>
      </div>

      {/* Tender Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-100 border-b border-slate-100">
              <th className="p-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Tender ID
              </th>
              <th className="p-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Title
              </th>
              <th className="p-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Department
              </th>
              <th className="p-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Estimated Cost
              </th>
              <th className="p-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Status
              </th>
              <th className="p-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Closing Date
              </th>
              <th className="p-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Bids
              </th>
              <th className="p-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {tenders.map((t, i) => (
              <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                <td className="p-4 text-sm font-semibold text-slate-700">
                  {t.id}
                </td>
                <td className="p-4">
                  <div className="text-sm font-semibold text-slate-800">
                    {t.title}
                  </div>
                  <div className="text-xs text-slate-400">
                    Project Description
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <MapPin size={14} className="text-slate-400" /> {t.dept}
                  </div>
                </td>
                <td className="p-4 text-sm font-semibold text-slate-700">
                  {t.value}
                </td>
                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full flex justify-center items-center gap-1 text-[10px] font-bold tracking-wide uppercase ${t.statusColor}`}
                  >
                    {t.icon}
                    {t.status}
                  </span>
                </td>
                <td className="p-4 text-sm text-slate-500">{t.date}</td>
                <td className="p-4">
                  <span className="bg-zinc-200 text-zinc-600 text-nowrap px-2 py-1 rounded-full text-xs font-bold">
                    {t.bids} bids
                  </span>
                </td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-2 text-slate-400">
                    <button className="hover:text-blue-600 h-8 w-8 hover:bg-zinc-200 flex justify-center items-center rounded-lg cursor-pointer">
                      <a href="/admin/tenders/alltenders/community">
                        <Eye size={18} />
                      </a>
                    </button>
                    <button className="hover:text-blue-600 h-8 w-8 hover:bg-zinc-200 flex justify-center items-center rounded-lg cursor-pointer">
                      <MoreHorizontal size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TenderDashboard;
