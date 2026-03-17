"use client";
import api from "@/components/Api/privetApi";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

const Page = () => {
  const [activeTab, setActiveTab] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState({});
  const [roleName, setRoleName] = useState("");
  const [roleDescription, setRoleDescription] = useState("");
  const [roleId, setRoleId] = useState(null); // for edit, keep null for Add
const router = useRouter();
  // ================= API =================
  const fetchRoleApi = async () => {
    const res = await api.get("/public/api/master/role-create-data");
    return res.data.data;
  };

  const { data: roleTemplateData, isLoading: templateLoading, isError: templateError } = useQuery({
    queryKey: ["roleCreateData"],
    queryFn: fetchRoleApi,
  });

  // ================= EFFECT =================
  useEffect(() => {
    if (roleTemplateData && Object.keys(roleTemplateData).length > 0) {
      const defaultTab = Object.keys(roleTemplateData)[0];
      setActiveTab(defaultTab);
      setSelectedPermissions(roleTemplateData);
    }
  }, [roleTemplateData]);

  // ================= HANDLERS =================
  const handleTabClick = (tabKey) => setActiveTab(tabKey);

  const handleCheckboxChange = (tab, permissionId) => {
    const updatedTab = selectedPermissions[tab].map((perm) =>
      perm.id === permissionId ? { ...perm, selected: !perm.selected } : perm
    );
    setSelectedPermissions({
      ...selectedPermissions,
      [tab]: updatedTab,
    });
  };

  const getSelectedPermissionIds = () => {
    const ids = [];
    Object.keys(selectedPermissions).forEach((tab) => {
      selectedPermissions[tab].forEach((perm) => {
        if (perm.selected) ids.push(perm.id);
      });
    });
    return ids;
  };

  const handleAddRole = async () => {
    if (!roleName.trim()) {
      alert("Please enter role name");
      return;
    }

    const payload = {
      name: roleName,
      description: roleDescription, // no limit
      permissions: getSelectedPermissionIds(),
    };

    try {
      const res = await api.post("/public/api/master/role", payload);
      if (res.data.status) {
        alert(res.data.message);
        setRoleName("");
        setRoleDescription("");
         router.push("/admin/masters/role/roleList");
        // Reset checkboxes
        const resetPermissions = {};
        Object.keys(selectedPermissions).forEach((tab) => {
          resetPermissions[tab] = selectedPermissions[tab].map((perm) => ({
            ...perm,
            selected: false,
          }));
        });
        setSelectedPermissions(resetPermissions);

      }
    } catch (error) {
      if (error.response) {
        console.error(error.response.data);
        alert(error.response.data.message || "Error creating role");
      } else if (error.request) {
        console.error(error.request);
        alert("No response from server. Please check your connection.");
      } else {
        console.error(error.message);
        alert("Error creating role: " + error.message);
      }
    }
  };

  if (templateLoading) return <p className="p-6">Loading...</p>;
  if (templateError) return <p className="p-6">Error loading data</p>;

  const apiTabs = Object.keys(selectedPermissions);

  return (
    <div className="mt-18 p-6 bg-white min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold">{roleId ? "Edit Role" : "Add Role"}</h1>
        <button className="text-blue-600 border border-gray-300 px-4 py-1 rounded">← Back</button>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-1">
          Role Name <span className="text-red-500">*</span>
        </label>
        <input
          className="w-full border border-gray-300 rounded px-3 py-2"
          value={roleName}
          onChange={(e) => setRoleName(e.target.value)}
        />

        <label className="block text-sm font-medium mt-2 mb-1">Description</label>
        <textarea
          className="w-full border border-gray-300 rounded px-3 py-2"
          value={roleDescription}
          onChange={(e) => setRoleDescription(e.target.value)}
          rows={4} // optional, textarea
        />
      </div>

      <h2 className="font-semibold mb-3">Assign Permissions</h2>
      <div className="flex border border-gray-300 rounded-lg overflow-hidden">
        <div className="w-1/4 border-r border-gray-300 bg-gray-50 p-3 space-y-2">
          {apiTabs.map((tab) => (
            <div
              key={tab}
              onClick={() => handleTabClick(tab)}
              className={`px-3 py-2 rounded cursor-pointer border border-gray-300 ${
                activeTab === tab
                  ? "bg-blue-600 text-white"
                  : "text-blue-600 hover:bg-blue-50"
              }`}
            >
              {tab.toUpperCase()}
            </div>
          ))}
        </div>

        <div className="w-3/4 p-6">
          <h3 className="font-semibold mb-4 capitalize">{activeTab} Permissions</h3>
          {selectedPermissions[activeTab]?.length > 0 ? (
            <div className="flex flex-wrap gap-3">
              {selectedPermissions[activeTab].map((item) => (
                <label
                  key={item.id}
                  className="flex items-center gap-2 border border-gray-300 p-2 rounded cursor-pointer"
                >
                  <input
                    type="checkbox"
                    value={item.id}
                    checked={item.selected}
                    onChange={() => handleCheckboxChange(activeTab, item.id)}
                  />
                  <span>{item.name}</span>
                </label>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No permissions available</p>
          )}
        </div>
      </div>

      <div className="flex justify-center w-[100%]">
        <button
          onClick={handleAddRole}
          className="text-blue-600 border border-gray-300 px-4 py-1 rounded mt-5 flex justify-center"
        >
          {roleId ? "Update Role" : "Add Role"}
        </button>
      </div>
    </div>
  );
};

export default Page;
