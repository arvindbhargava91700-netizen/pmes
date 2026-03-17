"use client";
import React from "react";
import { Search, Bell, User } from "lucide-react";
import { useEffect, useState } from "react";

const AdminHeader = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 3);
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`
        fixed z-50 w-full md:w-[calc(100%-256px)] flex items-center justify-between px-6 py-3
        bg-white border-b border-zinc-200
        transition-all duration-200 ease-in-out
        ${scrolled ? "top-0 shadow-md" : "top-11"}
      `}
    >
      {/* Search */}
      <div className="relative w-[320px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
        <input
          type="text"
          placeholder="Search projects, tenders..."
          className="w-full rounded-full bg-zinc-100 pl-10 pr-4 py-2 text-sm
          text-zinc-700 placeholder-zinc-400
          focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Right Icons */}
      <div className="flex items-center gap-5">
        {/* Notification */}
        <div className="relative cursor-pointer">
          <Bell className="h-5 w-5 text-zinc-600" />
          <span
            className="absolute -top-3 -right-2 flex h-5 w-5 items-center justify-center
            rounded-full bg-blue-600 text-white text-xs font-semibold"
          >
            5
          </span>
        </div>

        {/* User */}
        <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center cursor-pointer">
          <User className="h-4 w-4 text-white" />
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;
