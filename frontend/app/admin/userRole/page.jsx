"use client";
import React, { useState, useEffect } from "react";
import {
  FiUsers,
  FiShield,
  FiUser,
  FiPlus,
  FiSearch,
  FiMoreHorizontal,
  FiX,
  FiPhone,
} from "react-icons/fi";
import api from "@/components/Api/privetApi"; // ✅ apna sahi path check karo

const IMAGE_BASE = "https://demo4.techsseract.com/pmes/public/";

const Page = () => {
  const [addUser, setAddUser] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/public/api/users");
          console.log("Full Response:", res);         // poora response
      console.log("Response Data:", res.data);    // data object
      console.log("Users Array:", res.data.data); // users list

        if (res.data.status) {
          setUsers(res.data.data);
        }
      } catch (err) {
        console.error("API Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) => {
    const query = searchQuery.toLowerCase();
    return (
      user.name?.toLowerCase().includes(query) ||
      user.username?.toLowerCase().includes(query) ||
      user.mobile?.includes(query)
    );
  });

  const admins = users.filter((u) =>
    u.roles?.some(
      (r) =>
        r.toLowerCase().includes("admin") ||
        r.toLowerCase().includes("commissioner")
    )
  ).length;

  const engineers = users.filter((u) =>
    u.roles?.some((r) => ["ee", "ae", "je"].includes(r.toLowerCase()))
  ).length;

  const deptUsers = users.filter((u) =>
    u.roles?.some((r) => r.toLowerCase().includes("municipal"))
  ).length;

  return (
    <>
      {/* MAIN PAGE */}
      <div className="p-8 mt-8 bg-[#F7F9FB] min-h-screen">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-[#0F172A]">
              Users & Roles
            </h1>
            <p className="text-sm text-[#64748B]">
              Manage system users and permissions
            </p>
          </div>
          <button
            onClick={() => setAddUser(true)}
            className="flex items-center gap-2 bg-[#2563EB] text-white px-4 py-2 rounded-xl text-sm font-medium"
          >
            <FiPlus />
            Add User
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <StatCard
            icon={<FiUsers />}
            label="Total Users"
            value={users.length}
            bg="bg-[#E0E7FF]"
            iconColor="text-[#2563EB]"
          />
          <StatCard
            icon={<FiShield />}
            label="Admins"
            value={admins}
            bg="bg-[#DCFCE7]"
            iconColor="text-[#22C55E]"
          />
          <StatCard
            icon={<FiUser />}
            label="Engineers"
            value={engineers}
            bg="bg-[#E0F2FE]"
            iconColor="text-[#0EA5E9]"
          />
          <StatCard
            icon={<FiUsers />}
            label="Dept Users"
            value={deptUsers}
            bg="bg-[#FEF3C7]"
            iconColor="text-[#F59E0B]"
          />
        </div>

        {/* Search */}
        <div className="bg-white rounded-2xl p-4 mb-6">
          <div className="flex items-center gap-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-3 w-[420px]">
            <FiSearch className="text-[#64748B]" />
            <input
              type="text"
              placeholder="Search by name, username, mobile..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent outline-none text-sm w-full text-[#0F172A]"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl overflow-hidden">
          {loading ? (
            <p className="text-center py-10 text-[#64748B]">
              Loading users...
            </p>
          ) : filteredUsers.length === 0 ? (
            <p className="text-center py-10 text-[#64748B]">No users found.</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-[#F8FAFC] text-[#64748B]">
                <tr>
                  <th className="text-left px-6 py-4 font-medium">USER</th>
                  <th className="text-left px-6 py-4 font-medium">ROLE</th>
                  <th className="text-left px-6 py-4 font-medium">MOBILE</th>
                  <th className="text-left px-6 py-4 font-medium">STATUS</th>
                  <th className="text-right px-6 py-4 font-medium">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <UserRow key={user.id} user={user} />
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* ADD USER POPUP */}
      {addUser && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-[420px] rounded-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-[#0F172A]">
                Add New User
              </h2>
              <FiX
                className="cursor-pointer text-[#64748B]"
                onClick={() => setAddUser(false)}
              />
            </div>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Full Name"
                className="w-full border border-[#E2E8F0] rounded-xl px-4 py-2 text-sm outline-none"
              />
              <input
                type="text"
                placeholder="Username"
                className="w-full border border-[#E2E8F0] rounded-xl px-4 py-2 text-sm outline-none"
              />
              <input
                type="text"
                placeholder="Mobile Number"
                className="w-full border border-[#E2E8F0] rounded-xl px-4 py-2 text-sm outline-none"
              />
              <select className="w-full border border-[#E2E8F0] rounded-xl px-4 py-2 text-sm outline-none">
                <option>Select Role</option>
                <option>Commissioner / Admin</option>
                <option>EE</option>
                <option>AE</option>
                <option>JE</option>
                <option>Municipal Dept User</option>
              </select>
              <select className="w-full border border-[#E2E8F0] rounded-xl px-4 py-2 text-sm outline-none">
                <option>Status</option>
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setAddUser(false)}
                className="px-4 py-2 rounded-xl border border-[#E2E8F0] text-sm"
              >
                Cancel
              </button>
              <button className="px-4 py-2 rounded-xl bg-[#2563EB] text-white text-sm">
                Save User
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Page;

/* ---------------- Components ---------------- */

const StatCard = ({ icon, label, value, bg, iconColor }) => (
  <div className="bg-white rounded-2xl p-5 flex items-center gap-4">
    <div
      className={`w-12 h-12 flex items-center justify-center rounded-xl ${bg} ${iconColor}`}
    >
      {icon}
    </div>
    <div>
      <p className="text-sm text-[#64748B]">{label}</p>
      <p className="text-2xl font-semibold text-[#0F172A]">{value}</p>
    </div>
  </div>
);

const UserRow = ({ user }) => {
  const { name, username, mobile, image, status, roles } = user;

  return (
    <tr className="border-t border-[#E2E8F0]">
      {/* User */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          {image ? (
            <img
              src={`${IMAGE_BASE}${image}`}
              alt={name}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 bg-[#E0E7FF] rounded-full flex items-center justify-center text-[#2563EB]">
              <FiUser />
            </div>
          )}
          <div>
            <p className="font-medium text-[#0F172A]">{name}</p>
            <p className="text-xs text-[#64748B]">@{username}</p>
          </div>
        </div>
      </td>

      {/* Role */}
      <td className="px-6 py-4">
        {roles?.map((role, i) => (
          <span
            key={i}
            className="px-3 py-1 border border-[#E2E8F0] rounded-full text-xs font-medium mr-1"
          >
            {role}
          </span>
        ))}
      </td>

      {/* Mobile */}
      <td className="px-6 py-4 text-[#475569]">
        <div className="flex items-center gap-1">
          <FiPhone size={12} />
          {mobile}
        </div>
      </td>

      {/* Status */}
      <td className="px-6 py-4">
        <span
          className={`px-3 py-1 text-xs rounded-full font-medium ${
            status === 1
              ? "bg-[#DCFCE7] text-[#16A34A]"
              : "bg-[#FEE2E2] text-[#DC2626]"
          }`}
        >
          {status === 1 ? "Active" : "Inactive"}
        </span>
      </td>

      {/* Actions */}
      <td className="px-6 py-4 text-right">
        <FiMoreHorizontal className="inline text-[#64748B] cursor-pointer" />
      </td>
    </tr>
  );
};