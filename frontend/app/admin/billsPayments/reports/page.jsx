"use client";
import React, { useState } from "react";
import {
  FiChevronDown,
  FiDownload,
  FiBarChart2,
  FiTrendingUp,
  FiClock,
  FiFileText,
  FiCalendar,
} from "react-icons/fi";

const page = () => {
  const [department, setDepartment] = useState("All Departments");
  const [month, setMonth] = useState("This Month");
  

  const handleGenerate = (title) => {
    alert(`${title} report generated`);
    console.log(`${title} generated for`, department, month);
  };

  const handleDownload = (type, title) => {
    alert(`${title} downloaded as ${type}`);
  };

  return (
    <div className="p-8 bg-[#f7f9fc] min-h-screen mt-12">
      {/* Header */}
      <h1 className="text-2xl font-semibold text-gray-900">
        Reports & Analytics
      </h1>
      <p className="text-gray-500 mt-1">Generate and export reports</p>

      {/* Filters */}
      <div className="bg-white mt-6 p-6 rounded-xl shadow-sm flex flex-wrap gap-4">
        {/* Department */}
        <div className="relative">
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="appearance-none border-2 border-gray-300 rounded-xl px-4 py-3 pr-10 font-medium outline-none"
          >
            <option>All Departments</option>
            <option>Roads</option>
            <option>Water</option>
           
          </select>
          <FiChevronDown className="absolute right-4 top-4 text-gray-500" />
        </div>

        {/* Month */}
        <div className="relative">
          <select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="appearance-none border border-gray-300 rounded-xl px-4 py-3 pr-10 bg-gray-50 outline-none"
          >
            <option>This Week</option>
            <option>This Month</option>
            <option>This Quarter</option>
            <option>This Year</option>

          </select>
          <FiChevronDown className="absolute right-4 top-4 text-gray-500" />
        </div>

        {/* Custom Range */}
        <button className="flex items-center gap-2 px-5 py-3 border border-gray-300 rounded-xl bg-gray-50 font-medium">
          <FiCalendar />
          Custom Range
        </button>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {/* Card 1 */}
        <ReportCard
          icon={<FiBarChart2 />}
          title="Project Status Report"
          desc="Overview of all project statuses"
          onGenerate={() => handleGenerate("Project Status")}
          onDownload={handleDownload}
        />

        {/* Card 2 */}
        <ReportCard
          icon={<FiTrendingUp />}
          title="Financial Summary"
          desc="Budget utilization and payments"
          onGenerate={() => handleGenerate("Financial Summary")}
          onDownload={handleDownload}
        />

        {/* Card 3 */}
        <ReportCard
          icon={<FiClock />}
          title="Delay Analysis"
          desc="Projects behind schedule"
          onGenerate={() => handleGenerate("Delay Analysis")}
          onDownload={handleDownload}
        />

        {/* Card 4 */}
        <ReportCard
          icon={<FiFileText />}
          title="Contractor Performance"
          desc="Contractor-wise metrics"
          onGenerate={() => handleGenerate("Contractor Performance")}
          onDownload={handleDownload}
        />
      </div>
    </div>
  );
};

/* Reusable Card */
const ReportCard = ({ icon, title, desc, onGenerate, onDownload }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col gap-4">
      <div className="flex items-start gap-4">
        <div className="bg-blue-100 text-blue-600 p-4 rounded-2xl text-xl">
          {icon}
        </div>
        <div>
          <h2 className="font-semibold text-lg">{title}</h2>
          <p className="text-gray-500 text-sm mt-1">{desc}</p>
        </div>
      </div>

      <div className="flex items-center gap-3 mt-2">
        <button
          onClick={() => onDownload("PDF", title)}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300  rounded-xl text-sm bg-gray-50"
        >
          <FiDownload /> PDF
        </button>

        <button
          onClick={() => onDownload("Excel", title)}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300  rounded-xl text-sm bg-gray-50"
        >
          <FiDownload /> Excel
        </button>

        <button
          onClick={onGenerate}
          className="ml-auto bg-blue-600 text-white px-5 py-2 rounded-xl font-medium"
        >
          Generate
        </button>
      </div>
    </div>
  );
};

export default page;
