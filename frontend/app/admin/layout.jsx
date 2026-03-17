"use client";
import AdminHeader from "@/components/Admin/AdminHeader";
import AdminSidebar from "@/components/Admin/AdminSidebar";
import Header from "@/components/Header";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function MainLayout({ children }) {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.replace("/login");
    } else {
      setChecked(true);
    }
  }, []);

  if (!checked) return null;

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="w-full bg-slate-200 min-h-screen md:ml-64 ml-0">
        <Header />
        <AdminHeader />
        {children}
      </div>
    </div>
  );
}
