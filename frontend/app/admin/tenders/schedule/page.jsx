"use client";
import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Download,
} from "lucide-react";
import SelectInput from "@/components/selectInput";

const events = [
  {
    id: 1,
    title: "Smart City Surveillance",
    type: "Publication",
    date: "Jan 22",
    status: "UPCOMING",
    color: "blue",
  },
  {
    id: 2,
    title: "Community Center - Ward 15",
    type: "Bid Closing",
    date: "Feb 10",
    status: "UPCOMING",
    color: "orange",
  },
];

const Dashboard = () => {
  const [selectedEvent, setSelectedEvent] = useState("All Events");

  const eventOptions = [
    "All Events",
    "Publication",
    "Bid Closing",
    "Evaluation",
    "Award",
  ];
  
  return (
    <div className="bg-gray-50 p-8 font-sans">
      <div className="pt-4 md:pt-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between px-4 md:px-6 py-4 gap-4">
          <div className="flex items-start gap-3 md:gap-4">
            <div className="overflow-hidden">
              <h1 className="text-xl md:text-3xl font-bold text-gray-900 truncate">
                Tender Schedule
              </h1>
              <p className="text-md text-gray-500 truncate">
                View and manage tender timelines and milestones
              </p>
            </div>
          </div>

          {/* Right Section: Action Buttons */}
          <div className="flex items-center gap-2 md:gap-3">
            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-3 md:px-4 py-2 rounded-xl border border-zinc-300 text-sm md:text-base text-gray-700 hover:bg-gray-50 whitespace-nowrap">
              <Download size={16} />
              <span className="hidden sm:inline font-semibold text-sm">
                Export Calendar
              </span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-12 grid-cols-1 pt-5">
        {/* LEFT SIDE: CALENDAR */}
        <div className="md:col-span-8 flex-1 bg-white rounded-2xl border border-zinc-100 p-6 mr-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-semibold text-gray-800">
              January 2026
            </h2>
            <div className="flex gap-2">
              <button className="p-2 bg-zinc-50 cursor-pointer hover:text-blue-500 hover:bg-gray-100 rounded-xl border border-zinc-300 text-zinc-600">
                <ChevronLeft size={20} />
              </button>
              <button className="p-2 bg-zinc-50 cursor-pointer hover:text-blue-500 hover:bg-gray-100 rounded-xl border border-zinc-300 text-zinc-600">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 text-center gap-y-4 border-b border-zinc-300">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="text-gray-400 font-medium   ">
                {day}
              </div>
            ))}
            {[...Array(31)].map((_, i) => (
              <div
                key={i}
                className={`h-25 ml-0.5 flex flex-col items-center justify-start pt-2 hover:bg-zinc-100 rounded-xl cursor-pointer relative ${
                  i === 17 ? "border-2 border-blue-500 bg-blue-50" : ""
                }`}
              >
                <span
                  className={
                    i === 17 ? "text-blue-600 font-bold" : "text-gray-700"
                  }
                >
                  {i + 1}
                </span>

                {i === 17 && (
                  <div className="absolute bottom-2 w-3/4 flex flex-col gap-0.5">
                    <div className="h-1 bg-blue-500 rounded-full w-full"></div>

                    <div className="h-1 bg-orange-400 rounded-full w-full"></div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex gap-4 pt-5">
            <div className="flex items-center gap-2">
              <div className={`h-3 w-3 rounded-full bg-blue-500`}></div>
              <p className="text-zinc-500">Publication</p>
            </div>
            <div className="flex items-center gap-2">
              <div className={`h-3 w-3 rounded-full bg-orange-400`}></div>
              <p className="text-zinc-500">Bid Closing</p>
            </div>
            <div className="flex items-center gap-2">
              <div className={`h-3 w-3 rounded-full bg-purple-500`}></div>
              <p className="text-zinc-500">Evaluation</p>
            </div>
            <div className="flex items-center gap-2">
              <div className={`h-3 w-3 rounded-full bg-green-500`}></div>
              <p className="text-zinc-500">Award</p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: UPCOMING EVENTS */}
        <div className="md:col-span-4 bg-white p-4 rounded-xl border border-zinc-100 overflow-y-auto">
          <div className="flex justify-between items-center mb-6 gap-2">
            <h2 className="text-xl font-semibold">Upcoming Events</h2>
            <SelectInput
              options={eventOptions}
              selected={selectedEvent}
              setSelected={setSelectedEvent}
            />
          </div>

          {/* Event Card Component */}
          <div className="space-y-4">
            <EventCard
              title="Smart City Surveillance System"
              dept="IT & Smart City"
              date="Jan 22"
              tag="UPCOMING"
              type="Publication"
              dotColor="bg-blue-500"
              tagcolor="bg-blue-100 text-blue-600"
            />
            <EventCard
              title="Community Center - Ward 15"
              dept="Buildings"
              date="Feb 10"
              tag="UPCOMING"
              type="Bid Closing"
              dotColor="bg-orange-500"
              tagcolor="bg-blue-100 text-blue-600"
            />
            <EventCard
              title="Road Widening - Shastri Nagar"
              dept="Roads & Highways"
              date="Jan 28"
              tag="Today"
              type="Evaluation"
              dotColor="bg-purple-500"
              tagcolor="bg-orange-100 text-orange-600"
            />
            <EventCard
              title="Sewerage Network Extension"
              dept="Water & Sewerage"
              date="Jan 20"
              tag="Completed"
              type="Award"
              dotColor="bg-green-500"
              tagcolor="bg-green-100 text-green-600"
            />
            <EventCard
              title="Solid Waste Management"
              dept="Sanitation"
              date="Jan 18"
              tag="Overdue"
              type="Bid Closing"
              dotColor="bg-orange-500"
              tagcolor="bg-red-100 text-red-600"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const EventCard = ({ title, dept, date, tag, type, dotColor, tagcolor }) => (
  <div className="bg-zinc-50 p-5 rounded-2xl hover:shadow-md border border-gray-100 relative">
    <div
      className={`absolute top-4 right-4 h-2 w-2 rounded-full ${dotColor}`}
    ></div>
    <span
      className={`text-[12px] font-bold ${tagcolor} px-2 py-1 rounded-full uppercase`}
    >
      {tag}
    </span>
    <h3 className="mt-3 font-semibold text-gray-800 leading-tight">{title}</h3>
    <p className="text-xs text-gray-400 mt-1">{dept}</p>
    <div className="flex justify-between items-center mt-4">
      <div className="flex items-center text-gray-400 text-xs gap-1">
        <CalendarIcon size={14} /> {date}
      </div>
      <span className="text-xs font-bold bg-gray-100 px-3 py-1 rounded-full text-gray-700">
        {type}
      </span>
    </div>
  </div>
);

export default Dashboard;
