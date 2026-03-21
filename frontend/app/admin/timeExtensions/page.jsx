"use client";
import React, { useState } from "react";
import {
  Plus,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  Search,
  Filter,
  Clock1,
  CheckCircle,
  Cross,
} from "lucide-react";
import AllRequest from "@/components/Admin/timeExtensions/AllRequest";
import { useQuery } from "@tanstack/react-query";
import api from "@/components/Api/privetApi";

const tabs = [
  { id: "requests", label: "All Requests" },
  { id: "pending", label: "Pending" },
  { id: "approved", label: "Approved" },
  { id: "rejected", label: "Rejected" },
];

const TimeExtensions = () => {
  const [activeFilter, setActiveFilter] = useState("requests");
  const [page, setPage] = useState(1);

  const fetchEOT = async (page = 1) => {
    const res = await api.get(`/public/api/master/eot_requests?page=${page}`);
    return res.data.data;
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["eot-requests", page],
    queryFn: () => fetchEOT(page),
    refetchOnWindowFocus: false,
  });

  const stats = [
    {
      label: "Total Requests",
      value: data?.stats?.total_request || 0,
      icon: FileText,
      color: "bg-blue-50 text-blue-600",
      iconBg: "bg-blue-100",
    },
    {
      label: "Pending Review",
      value: data?.stats?.pending || 0,
      icon: Clock,
      color: "bg-orange-50 text-orange-600",
      iconBg: "bg-orange-100",
    },
    {
      label: "Approved",
      value: data?.stats?.approved || 0,
      icon: CheckCircle2,
      color: "bg-green-50 text-green-600",
      iconBg: "bg-green-100",
    },
    {
      label: "Rejected",
      value: data?.stats?.reject || 0,
      icon: XCircle,
      color: "bg-red-50 text-red-600",
      iconBg: "bg-red-100",
    },
  ];

  if (isLoading) {
    return <p className="p-6">Loading...</p>;
  }

  if (error) {
    return <p className="p-6 text-red-500">Something went wrong</p>;
  }
  return (
    <>
      <div className="p-6 mt-10">
        {/* 1. Header Section */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Time Extensions (EOT)
            </h1>
            <p className="text-gray-500 mt-1">
              Manage Extension of Time requests and approvals
            </p>
          </div>
          <button className="flex items-center gap-2 cursor-pointer bg-[#2563eb] hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-semibold transition-all shadow-sm">
            <Plus size={20} />
            <p className="text-md">New EOT Request</p>
          </button>
        </div>

        {/* 2. Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="flex items-center gap-4 p-4 bg-white border border-gray-100 rounded-2xl  shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.iconBg} ${stat.color}`}
              >
                <stat.icon size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* 3. Filters & Search Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Left Side: Category Tabs */}
          <div className="flex gap-2 p-1 rounded-xl">
            {tabs.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setActiveFilter(id)}
                className={`px-4 py-1 text-sm font-medium text-nowrap cursor-pointer transition-all ${
                  activeFilter === id
                    ? "py-0.5 bg-zinc-100 rounded-full shadow-sm duration-200"
                    : "text-zinc-600"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Right Side: Search & Filter Button */}
          <div className="flex items-center gap-3 w-100 md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search requests..."
                className="w-full pl-10 pr-4 py-2 border border-zinc-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
              />
            </div>
            <button className="flex items-center cursor-pointer hover:text-blue-600 gap-2 px-4 py-2 border border-zinc-300 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all">
              <Filter size={18} />
              Filters
            </button>
          </div>
        </div>

        {activeFilter === "requests" && (
          <AllRequest />
        )}

        {activeFilter === "pending" && (
          <>
            <Clock1 />
            <p className="text-zinc-500">Pending requests will appear here</p>
          </>
        )}

        {activeFilter === "approved" && (
          <>
            <CheckCircle />
            <p className="text-zinc-500">Approved requests will appear here</p>
          </>
        )}

        {activeFilter === "rejected" && (
          <>
            <Cross />
            <p className="text-zinc-500">Rejected requests will appear here</p>
          </>
        )}
      </div>
    </>
  );
};

export default TimeExtensions;
