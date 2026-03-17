"use client";
import React, { useState } from "react";
import {
  FiSearch,
  FiPhone,
  FiVideo,
  FiMoreVertical,
  FiPaperclip,
  FiImage,
  FiSend,
} from "react-icons/fi";

const page = () => {
  const [role, setRole] = useState("chats");

  return (
    <div className="h-screen mt-12 bg-gray-100 p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Communication
          </h1>
          <p className="text-sm text-gray-500">
            In-app calling, messaging, and collaboration
          </p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 border border-gray-300  rounded-lg bg-white text-gray-700">
            New Group
          </button>
          <button className="px-4 py-2 rounded-lg bg-blue-600 text-white">
            + New Chat
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-4">
        <button
          onClick={() => setRole("chats")}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            role === "chats"
              ? "bg-blue-50 text-blue-600"
              : "text-gray-500 hover:bg-gray-100"
          }`}
        >
          Chats
        </button>

        <button
          onClick={() => setRole("call")}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            role === "call"
              ? "bg-blue-50 text-blue-600"
              : "text-gray-500 hover:bg-gray-100"
          }`}
        >
          Call Logs
        </button>
      </div>

      {/* ================= CHATS UI ================= */}
      {role === "chats" && (
        <div className="bg-white rounded-xl shadow flex h-[85vh] overflow-hidden">
          {/* Left */}
          <div className="w-[35%] border-r border-gray-300 p-4">
            <div className="relative mb-4">
              <FiSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm"
                placeholder="Search contacts..."
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-semibold text-blue-600">
                    RK
                  </div>
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">Rajesh Kumar</p>
                  <p className="text-xs text-gray-500">
                    Drainage work progressing well
                  </p>
                </div>
                <div className="text-xs text-gray-500">2:30 PM</div>
              </div>

              {[
                [
                  "PS",
                  "Priya Sharma",
                  "Quality inspection scheduled for tomorrow",
                  "1:45 PM",
                ],
                ["AV", "Dr. Amit Verma", "Site visit completed", "Yesterday"],
                [
                  "AC",
                  "ABC Constructions",
                  "Material delivery confirmed",
                  "Yesterday",
                ],
                [
                  "XY",
                  "XYZ Infrastructure",
                  "Bill submitted for review",
                  "2 days ago",
                ],
                ["SP", "Suresh Patel", "Photos uploaded", "3 days ago"],
              ].map((c, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg"
                >
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-semibold text-gray-600">
                    {c[0]}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{c[1]}</p>
                    <p className="text-xs text-gray-500">{c[2]}</p>
                  </div>
                  <div className="text-xs text-gray-400">{c[3]}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right */}
          <div className="flex-1 flex flex-col">
            <div className="flex justify-between items-center p-4 border-b border-gray-300">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-semibold text-blue-600">
                  RK
                </div>
                <div>
                  <p className="font-medium">Rajesh Kumar</p>
                  <p className="text-xs text-green-500">Online</p>
                </div>
              </div>
              <div className="flex gap-4 text-gray-500">
                <FiPhone />
                <FiVideo />
                <FiMoreVertical />
              </div>
            </div>

            <div className="flex-1 p-6 space-y-4 bg-gray-50 overflow-y-auto">
              <div className="bg-white p-4 rounded-xl max-w-lg text-sm">
                Good morning sir, drainage work is progressing well.
                <div className="text-xs text-gray-400 mt-1">9:00 AM</div>
              </div>

              <div className="ml-auto bg-blue-600 text-white p-4 rounded-xl max-w-lg text-sm">
                Great! What's the current progress percentage?
                <div className="text-xs text-blue-200 text-right mt-1">
                  9:05 AM
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-gray-300 flex gap-3">
              <FiPaperclip />
              <FiImage />
              <input
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm"
                placeholder="Type a message..."
              />
              <button className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center">
                <FiSend />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= CALL LOGS UI ================= */}
      {/* ================= CALL LOGS UI ================= */}
      {role === "call" && (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          {/* Header */}
          <div className="flex justify-between items-center px-6 py-4 border-b border-gray-300">
            <h2 className="text-lg font-semibold">Recent Calls</h2>
            <span className="text-sm border border-gray-300 px-3 py-1 rounded-full">
              5 calls
            </span>
          </div>

          {/* Call Item */}
          {[
            {
              name: "Rajesh Kumar",
              role: "JE",
              type: "Outgoing",
              color: "text-blue-600",
              time: "12:34",
              date: "Today, 11:30 AM",
              prj: "PRJ-2024-0045",
              icon: "📞",
            },
            {
              name: "ABC Constructions",
              role: "Contractor",
              type: "Incoming",
              color: "text-green-600",
              time: "8:45",
              date: "Today, 9:15 AM",
              prj: "PRJ-2024-0045",
              icon: "📲",
            },
            {
              name: "Priya Sharma",
              role: "AE",
              type: "Missed",
              color: "text-red-500",
              time: "",
              date: "Yesterday, 4:30 PM",
              prj: "PRJ-2024-0045",
              icon: "❌",
            },
            {
              name: "Dr. Amit Verma",
              role: "EE",
              type: "Outgoing",
              color: "text-blue-600",
              time: "25:12",
              date: "Yesterday, 2:00 PM",
              prj: "",
              icon: "📞",
            },
            {
              name: "XYZ Infrastructure",
              role: "Contractor",
              type: "Incoming",
              color: "text-green-600",
              time: "5:20",
              date: "2 days ago",
              prj: "PRJ-2024-0038",
              icon: "📲",
            },
          ].map((c, i) => (
            <div
              key={i}
              className="flex justify-between items-center px-6 py-5 border-b border-gray-200 last:border-none"
            >
              {/* Left */}
              <div className="flex gap-4">
                {/* Avatar */}
                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
                  <FiPhone className="text-blue-600" />
                </div>

                {/* Info */}
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-gray-900">{c.name}</p>
                    {c.role && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                        {c.role}
                      </span>
                    )}
                  </div>

                  <div className={`flex items-center gap-2 text-sm ${c.color}`}>
                    <span>{c.icon}</span>
                    <span>{c.type}</span>
                    {c.time && <span>• {c.time}</span>}
                    <span className="text-gray-500">• {c.date}</span>
                  </div>

                  {c.prj && (
                    <span className="inline-block mt-2 text-xs font-medium px-3 py-1 rounded-full border border-gray-300">
                      {c.prj}
                    </span>
                  )}
                </div>
              </div>

              {/* Right Icons */}
              <div className="flex gap-6 text-gray-600">
                <FiPhone />
                <FiVideo />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default page;
