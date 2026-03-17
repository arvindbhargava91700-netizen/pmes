"use client";
import React from "react";
import {
  FiWifi,
  FiAlertTriangle,
  FiMapPin,
  FiActivity,
  FiMonitor,
} from "react-icons/fi";

const ICCCIntegration = () => {
  return (
    <div className="p-6 bg-gray-50 min-h-screen mt-12">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">ICCC Integration</h1>
          <p className="text-gray-500">Integrated Command and Control Center</p>
        </div>

        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow">
          <FiMonitor />
          Live Dashboard
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {/* Live Feeds */}
        <div className="bg-white rounded-xl p-5 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
            <FiWifi className="text-green-600 text-xl" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Live Feeds</p>
            <p className="text-2xl font-bold">127</p>
          </div>
        </div>

        {/* Active Alerts */}
        <div className="bg-white rounded-xl p-5 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center">
            <FiAlertTriangle className="text-yellow-500 text-xl" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Active Alerts</p>
            <p className="text-2xl font-bold">5</p>
          </div>
        </div>

        {/* Monitored Sites */}
        <div className="bg-white rounded-xl p-5 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
            <FiMapPin className="text-blue-600 text-xl" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Monitored Sites</p>
            <p className="text-2xl font-bold">48</p>
          </div>
        </div>

        {/* System Health */}
        <div className="bg-white rounded-xl p-5 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-cyan-100 flex items-center justify-center">
            <FiActivity className="text-cyan-600 text-xl" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">System Health</p>
            <p className="text-2xl font-bold text-green-600">98%</p>
          </div>
        </div>
      </div>

      {/* ICCC Live View Box */}
      <div className="bg-white rounded-xl shadow-sm h-[420px] flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center mb-4">
          <FiMonitor className="text-gray-500 text-3xl" />
        </div>

        <h2 className="text-lg font-semibold mb-1">ICCC Live View</h2>
        <p className="text-gray-500 mb-6">
          Connect to ICCC for real-time project monitoring
        </p>

        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow">
          Connect to ICCC
        </button>
      </div>
    </div>
  );
};

export default ICCCIntegration;
