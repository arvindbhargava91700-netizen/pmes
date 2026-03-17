"use client";
import api from "../Api/privetApi";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaFileAlt, FaChevronDown, FaBars } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { ChartColumn } from "lucide-react";
import {
  IconClockHour5,
  IconFileDescription,
  IconFolderOpen,
  IconLayoutDashboard,
  IconMapPin,
  IconMessageReport,
  IconPhone,
  IconReceiptDollar,
  IconUsers,
} from "@tabler/icons-react";

const menuItems = [
  { label: "Dashboard", icon: IconLayoutDashboard, path: "/admin/dashboard" },
  {
    label: "Master",
    icon: IconFileDescription,
    children: [
      // { label: "Contractor", path: "/admin/tenders/alltenders" },
      { label: "Department", path: "/admin/masters/department" },
      { label: "Permission", path: "/admin/masters/permission" },
      { label: "Role", path: "/admin/masters/role/roleList"},
      { label: "Status Master", path: "/admin/masters/statusMaster" },
      { label: "Types Of Work", path: "/admin/masters/typeofwork" },
      // { label: "User", path: "/admin/tenders/schedule" },
      {
        label: "Work Classification",
        path: "/admin/masters/workClassification",
      },
      { label: "Ward", path: "/admin/masters/ward" },
      { label: "Zone", path: "/admin/masters/zone" },
    ],
  },
  {
    label: "Tenders",
    icon: IconFileDescription,
    children: [
      { label: "All Tenders", path: "/admin/tenders/alltenders" },
      { label: "Create Tender", path: "/admin/tenders/create" },
      { label: "Tender Schedule", path: "/admin/tenders/schedule" },
    ],
  },
  {
    label: "Projects",
    icon: IconFolderOpen,
    children: [
      { label: "All Projects", path: "/admin/projects/allprojects" },
      { label: "Create Project", path: "/admin/projects/create" },
      { label: "Project Map", path: "/admin/projects/map" },
    ],
  },
  {
    label: "Time Extensions",
    icon: IconClockHour5,
    path: "/admin/timeExtensions",
  },
  {
    label: "Progress Tracking",
    icon: ChartColumn,
    children: [
      {
        label: "Physical Progress",
        path: "/admin/progressTracking/physicalProgress",
      },
      {
        label: "Financial Progress",
        path: "/admin/progressTracking/financialProgress",
      },
    ],
  },
  {
    label: "Billing & Payments",
    icon: IconReceiptDollar,
    children: [
      { label: "Bills", path: "/admin/billsPayments/bills" },
      { label: "Payments", path: "/admin/billsPayments/payments" },
      { label: "Payments Reports", path: "/admin/billsPayments/reports" },
    ],
  },
  {
    label: "Grievances",
    icon: IconMessageReport,
    path: "/admin/grievanceManagement",
  },
  {
    label: "ICCC Integration",
    icon: IconMapPin,
    path: "/admin/iCCCIntegration",
  },
  { label: "Communication", icon: IconPhone, path: "/admin/communication" },
  { label: "Users & Roles", icon: IconUsers, path: "/admin/userRole" },
];

const AdminSidebar = () => {
  const [openMenu, setOpenMenu] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (e) {}
    localStorage.clear();
    router.replace("/login");
  };

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-blue-600 text-white p-2 rounded-lg"
      >
        <FaBars />
      </button>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 z-40
        bg-[#0f1729]
        text-white px-2 py-5 shadow
        transform transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 mb-4 py-4 px-2 border-b border-zinc-700">
          <div className="h-10 w-10 rounded-lg bg-blue-600 flex items-center justify-center">
            <FaFileAlt />
          </div>
          <div>
            <p className="text-sm font-semibold">PMES Meerut</p>
            <p className="text-xs text-zinc-400">Municipal Corp.</p>
          </div>
        </div>

        {/* Menu */}
        <div className="h-[calc(100vh-150px)] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:display-none">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            if (item.children) {
              return (
                <div key={index}>
                  <div
                    onClick={() =>
                      setOpenMenu(openMenu === item.label ? null : item.label)
                    }
                    className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-white/10 cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <Icon />
                      <span className="font-medium">{item.label}</span>
                    </div>
                    <FaChevronDown
                      className={`transition ${
                        openMenu === item.label ? "rotate-180" : ""
                      }`}
                    />
                  </div>

                  {openMenu === item.label && (
                    <div className="ml-10 mt-1 space-y-1 text-sm text-zinc-300">
                      {item.children.map((child, i) => (
                        <div
                          key={i}
                          onClick={() => {
                            router.push(child.path);
                            setSidebarOpen(false);
                          }}
                          className="px-3 py-2 rounded-lg hover:bg-white/10 cursor-pointer"
                        >
                          {child.label}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <div
                key={index}
                onClick={() => {
                  router.push(item.path);
                  setSidebarOpen(false);
                }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 cursor-pointer mb-1"
              >
                <Icon />
                <span className="font-medium">{item.label}</span>
              </div>
            );
          })}
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-4 py-2 text-red-600 rounded-lg font-semibold hover:bg-red-950"
        >
          <FiLogOut size={16} />
          Logout
        </button>
      </aside>
    </>
  );
};

export default AdminSidebar;
