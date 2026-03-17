"use client";
import api from "@/components/Api/privetApi";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";

const Page = () => {
  // ================= API =================
  const fetchRoleApi = async () => {
    const res = await api.get("/public/api/master/role-create-data");
    return res.data.data;
  };

  const { data, isPending, isError } = useQuery({
    queryKey: ["role"],
    queryFn: fetchRoleApi,
  });

  // ================= STATE =================
  const [activeTab, setActiveTab] = useState("user");
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  if (isPending) return <p className="p-6">Loading...</p>;
  if (isError) return <p className="p-6">Error...</p>;

  // ======================= DYNAMIC TABS =======================
  const tabs = Object.keys(fetchStatusData || {}); 

  // ================= HANDLER =================
  const handleTabClick = (tabKey) => {
    setActiveTab(tabKey);
    setSelectedPermissions(data[tabKey]);
  };

  return (
    <div className="mt-18 p-6 bg-white min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold">Add Role</h1>
        <button className="text-blue-600 border border-gray-300 px-4 py-1 rounded">
          ← Back
        </button>
      </div>

      {/* Role Name */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-1">
          Role Name <span className="text-red-500">*</span>
        </label>
        <input className="w-full border border-gray-300 rounded px-3 py-2" />
      </div>

      <h2 className="font-semibold mb-3">Assign Permissions</h2>

      <div className="flex border border-gray-300 rounded-lg overflow-hidden">
        {/* ================= LEFT TABS ================= */}
        <div className="w-1/4 border-r border-gray-300 bg-gray-50 p-3 space-y-2">
          {/* 🔒 Fixed Tab */}
          {/* <div className="px-3 py-2 rounded bg-blue-600 text-white">
            User Management
          </div> */}

          {/* 🔄 Dynamic Tabs from API */}
          {apiTabs.map((tab) => (
            <div
              key={tab}
              onClick={() => handleTabClick(tab)}
              className={`px-3 py-2 rounded cursor-pointer border border-gray-300
                ${
                  activeTab === tab
                    ? "bg-blue-600 text-white"
                    : "text-blue-600 hover:bg-blue-50"
                }`}
            >
              {tab.toUpperCase()}
            </div>
          ))}
        </div>

        {/* ================= RIGHT CONTENT ================= */}
        <div className="w-3/4 p-6">
          <h3 className="font-semibold mb-4 capitalize">
            {activeTab} Permissions
          </h3>

          {selectedPermissions?.length > 0 ? (
            <div className="space-y-2">
              {selectedPermissions.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 border border-gray-300 p-2 rounded"
                >
                  <input type="checkbox" value={item.id} />
                  <span>{item.name}</span>
                  <span className="text-xs text-gray-400">
                    {/* ( {item.id}) */}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">Select a tab</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
