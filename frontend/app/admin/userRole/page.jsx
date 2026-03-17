"use client";
import React, { useState } from "react";
import {
  FiUsers,
  FiShield,
  FiUser,
  FiPlus,
  FiSearch,
  FiMoreHorizontal,
  FiX,
} from "react-icons/fi";

const Page = () => {
  const [addUser, setAddUser] = useState(false);

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
            value="156"
            bg="bg-[#E0E7FF]"
            iconColor="text-[#2563EB]"
          />
          <StatCard
            icon={<FiShield />}
            label="Admins"
            value="5"
            bg="bg-[#DCFCE7]"
            iconColor="text-[#22C55E]"
          />
          <StatCard
            icon={<FiUser />}
            label="Engineers"
            value="48"
            bg="bg-[#E0F2FE]"
            iconColor="text-[#0EA5E9]"
          />
          <StatCard
            icon={<FiUsers />}
            label="Contractors"
            value="62"
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
              placeholder="Search users..."
              className="bg-transparent outline-none text-sm w-full text-[#0F172A]"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-[#F8FAFC] text-[#64748B]">
              <tr>
                <th className="text-left px-6 py-4 font-medium">USER</th>
                <th className="text-left px-6 py-4 font-medium">ROLE</th>
                <th className="text-left px-6 py-4 font-medium">CONTACT</th>
                <th className="text-left px-6 py-4 font-medium">STATUS</th>
                <th className="text-right px-6 py-4 font-medium">ACTIONS</th>
              </tr>
            </thead>

            <tbody>
              <UserRow
                name="Dr. Amit Verma"
                email="amit.verma@meerut.gov.in"
                role="Commissioner"
                status="active"
              />
              <UserRow
                name="Priya Sharma"
                email="priya.sharma@meerut.gov.in"
                role="AE"
                status="active"
              />
            </tbody>
          </table>
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
                type="email"
                placeholder="Email Address"
                className="w-full border border-[#E2E8F0] rounded-xl px-4 py-2 text-sm outline-none"
              />

              <select className="w-full border border-[#E2E8F0] rounded-xl px-4 py-2 text-sm outline-none">
                <option>Select Role</option>
                <option>Admin</option>
                <option>Engineer</option>
                <option>Contractor</option>
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

const StatCard = ({ icon, label, value, bg, iconColor }) => {
  return (
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
};

const UserRow = ({ name, email, role, status }) => {
  return (
    <tr className="border-t border-[#E2E8F0]">
      <td className="px-6 py-4 flex items-center gap-3">
        <div className="w-10 h-10 bg-[#E0E7FF] rounded-full flex items-center justify-center text-[#2563EB]">
          <FiUser />
        </div>
        <div>
          <p className="font-medium text-[#0F172A]">{name}</p>
          <p className="text-xs text-[#64748B]">{email}</p>
        </div>
      </td>

      <td className="px-6 py-4">
        <span className="px-3 py-1 border border-[#E2E8F0] rounded-full text-xs font-medium">
          {role}
        </span>
      </td>

      <td className="px-6 py-4 text-[#475569]">{email}</td>

      <td className="px-6 py-4">
        <span className="px-3 py-1 text-xs rounded-full bg-[#DCFCE7] text-[#16A34A] font-medium">
          {status}
        </span>
      </td>

      <td className="px-6 py-4 text-right">
        <FiMoreHorizontal className="inline text-[#64748B]" />
      </td>
    </tr>
  );
};
