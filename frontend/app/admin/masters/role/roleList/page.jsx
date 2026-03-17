"use client";

import React from "react";
import { Pencil, Trash } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import api from "@/components/Api/privetApi"; 
import { useRouter } from "next/navigation";

const Page = () => {
    const router = useRouter()
  const getRoleData = async () => {
    const res = await api.get("/public/api/master/role"); 
    console.log("API Data:", res.data.data); 
    return res.data.data;
  };

  const { data: rolesData, isLoading } = useQuery({
    queryKey: ["roles"],
    queryFn: getRoleData,
  });

  if (isLoading) {
    return <div className="p-8">Loading roles...</div>;
  }

  return (
    <div className="p-8 mt-18">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-bold">Role Configuration</h1>
          <p className="text-gray-500 text-sm">
            Set permissions to manage who can access roles within the system.
          </p>
        </div>
         <button
          onClick={() => router.push("/admin/masters/role/addrole")}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          + Add New Role
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 font-medium text-gray-700">S.No</th>
              <th className="py-3 px-4 font-medium text-gray-700">Role Name</th>
              <th className="py-3 px-4 font-medium text-gray-700">Description</th>
              <th className="py-3 px-4 font-medium text-gray-700">Permissions Count</th>
              <th className="py-3 px-4 font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rolesData.map((role, index) => (
              <tr
                key={role.id}
                className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <td className="py-3 px-4">{index + 1}</td>
                <td className="py-3 px-4 font-medium">{role.name}</td>
                <td className="py-3 px-4">{role.description}</td>
                <td className="py-3 px-4">{role.permissions_count}</td>
                <td className="py-3 px-4 flex gap-3">
                  <button onClick={() => router.push("/admin/masters/role/editRole")}className="text-gray-500 hover:text-blue-500">
                    <Pencil size={18} />
                  </button>
                  <button className="text-gray-500 hover:text-red-500">
                    <Trash size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Page;
