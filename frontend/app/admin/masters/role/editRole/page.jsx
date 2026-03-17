"use client";

import React, { useState, useEffect } from "react";
import api from "@/components/Api/privetApi";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

const EditRolePage = ({ params }) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const roleId = params?.id;

  const [roleName, setRoleName] = useState("");
  const [roleDescription, setRoleDescription] = useState("");
  const [permissions, setPermissions] = useState([]);

  // 1️⃣ Fetch role details by ID
  const { data: roleData, isLoading: roleLoading } = useQuery({
    queryKey: ["role", roleId],
    queryFn: async () => {
      const res = await api.get(`/public/api/master/role/${roleId}`);
      return res.data.data;
    },
    enabled: !!roleId,
  });

  // 2️⃣ Fetch permission templates
  const { data: roleTemplateData, isLoading: templateLoading } = useQuery({
    queryKey: ["roleTemplateData"],
    queryFn: async () => {
      const res = await api.get("/public/api/master/role-create-data");
      return res.data.data;
    },
  });

  // 3️⃣ Map roleData + templateData into state for autofill
  useEffect(() => {
    if (roleData && roleTemplateData) {
      setRoleName(roleData.name || "");
      setRoleDescription(roleData.description || "");

      // roleData.permissions array may contain objects or ids
      const assignedIds =
        roleData.permissions?.map((p) => (typeof p === "object" ? p.id : p)) || [];

      const mappedPermissions = [];
      Object.keys(roleTemplateData).forEach((tab) => {
        roleTemplateData[tab].forEach((perm) => {
          mappedPermissions.push({
            id: perm.id,
            name: perm.name,
            assigned: assignedIds.includes(perm.id),
          });
        });
      });

      setPermissions(mappedPermissions);
    }
  }, [roleData, roleTemplateData]);

  // 4️⃣ Mutation for update
  const updateRoleMutation = useMutation({
    mutationFn: async (payload) => {
      const res = await api.put(`/public/api/master/role/${roleId}`, payload);
      return res.data;
    },
    onSuccess: () => {
      alert("Role updated successfully!");
      queryClient.invalidateQueries(["roles"]);
      router.push("/admin/masters/role");
    },
    onError: (err) => {
      console.error(err);
      alert("Failed to update role.");
    },
  });

  const handleSave = () => {
    const updatedPermissions = permissions
      .filter((p) => p.assigned)
      .map((p) => p.id);

    const payload = {
      name: roleName,
      description: roleDescription,
      permissions: updatedPermissions,
    };

    updateRoleMutation.mutate(payload);
  };

  if (roleLoading || templateLoading) return <p className="p-6">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto mt-12 p-6 bg-white shadow rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Edit Role</h1>
        <button
          onClick={() => router.back()}
          className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
        >
          ← Back
        </button>
      </div>

      {/* Role Info */}
      <div className="space-y-4 mb-6">
        <div>
          <label className="block mb-1 font-medium text-gray-700">Role Name</label>
          <input
            type="text"
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700">Description</label>
          <textarea
            value={roleDescription}
            onChange={(e) => setRoleDescription(e.target.value)}
            rows={3}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
      </div>

      {/* Permissions */}
      <div>
        <label className="block mb-2 font-medium text-gray-700">Assigned Permissions</label>
        <div className="flex flex-wrap gap-2">
          {permissions.length > 0 ? (
            permissions.map((perm) => (
              <label
                key={perm.id}
                className="flex items-center gap-1 border border-gray-300 rounded px-2 py-1 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={perm.assigned}
                  onChange={() =>
                    setPermissions((prev) =>
                      prev.map((p) =>
                        p.id === perm.id ? { ...p, assigned: !p.assigned } : p
                      )
                    )
                  }
                />
                <span className="text-sm">{perm.name}</span>
              </label>
            ))
          ) : (
            <p className="text-gray-400">No permissions assigned</p>
          )}
        </div>
      </div>

      {/* Save Button */}
      <div className="mt-6 flex justify-end gap-3">
        <button
          onClick={handleSave}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Save Changes
        </button>
        <button
          onClick={() => router.back()}
          className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default EditRolePage;
