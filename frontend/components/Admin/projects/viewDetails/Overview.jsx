"use client";

import {
  IconPhone,
  IconMail,
  IconMapPin,
  IconExternalLink,
  IconUser,
  IconPhoneCall,
  IconMessage,
  IconFileDollar,
} from "@tabler/icons-react";
import { Building2, CheckCircle, User } from "lucide-react";

export default function Overview() {
  return (
    <div className="min-h-screen w-full">
      <div className="grid grid-cols-12 gap-4">
        {/* ================= LEFT COLUMN ================= */}
        <div className="col-span-8 space-y-6">
          {/* Project Description */}
          <Card>
            <h3 className="font-semibold text-lg mb-2">Project Description</h3>
            <p className="text-gray-500 mb-4">
              Complete reconstruction of main road from Shastri Nagar junction
              to Railway Station including drainage, footpath, and street
              lighting.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-zinc-200 pt-4 text-sm">
              <Info label="Department" value="Roads & Highways" />
              <Info label="Work Type" value="Road Construction" />
              <Info label="Zone / Ward" value="Zone A / Ward 15" />
              <Info label="Start Date" value="8/1/2024" />
            </div>
          </Card>

          {/* Location */}
          <Card>
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold flex items-center gap-2">
                <IconMapPin size={18} /> Location
              </h3>

              <button className="border border-zinc-200 cursor-pointer px-3 py-1.5 rounded-lg text-sm flex items-center gap-1 hover:bg-gray-100 hover:text-blue-500">
                <IconExternalLink size={16} /> View on Map
              </button>
            </div>

            <p className="text-sm text-gray-600">
              Shastri Nagar to Railway Station
            </p>
            <p className="text-xs text-gray-400 mb-4">
              GPS: 28.9845° N, 77.7064° E
            </p>

            <div className="bg-blue-100 h-40 py-3 rounded-xl flex items-center justify-center text-zinc-500 text-sm font-medium">
              <div>
                <div className="flex justify-center items-center text-blue-600">
                  <IconMapPin size={30} />
                </div>
                Interactive Map View
              </div>
            </div>
          </Card>

          <div>
            <Card>
              <h2 className="text-lg font-semibold mb-6">
                Milestones & Timeline
              </h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white">
                      <CheckCircle size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        Site Clearance
                      </h3>
                      <p className="text-sm text-gray-500">
                        Due: 8/15/2024 &nbsp; Progress: 100%
                      </p>
                    </div>
                  </div>
                  <span className="px-3 py-0.5 bg-emerald-500 text-white text-xs font-bold rounded-full ">
                    Completed
                  </span>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-orange-400 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        4
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          Drainage Work
                        </h3>
                        <p className="text-sm text-gray-500">
                          Due: 1/15/2025 &nbsp; Progress: 75%
                        </p>
                      </div>
                    </div>
                    <span className="px-3 py-0.5 bg-orange-400 text-white text-xs font-bold rounded-full">
                      In Progress
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full"
                      style={{ width: `${75}%` }}
                    />
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* ================= RIGHT COLUMN ================= */}
        <div className="col-span-4 space-y-6">
          {/* Contractor Details */}
          <Card>
            <h3 className="font-semibold flex items-center gap-2 mb-3">
              <Building2 size={18} /> Contractor Details
            </h3>

            <Detail label="Company Name" value="ABC Constructions Pvt Ltd" />

            <Detail
              label="Contact"
              value="+91 98765 43210"
              icon={<IconPhone size={16} />}
            />

            <Detail
              label="Email"
              value="contact@abcconstructions.com"
              //   icon={<IconMail size={16} />}
              link
            />

            <div className="flex gap-3 mt-4">
              <ActionBtn
                icon={<IconPhoneCall size={20} />}
                text="Call"
                primary
              />
              <ActionBtn icon={<IconMessage size={20} />} text="Message" />
            </div>
          </Card>

          {/* Assigned Officers */}
          <Card>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <User size={18} />
              Assigned Officers
            </h3>

            <Officer name="Rajesh Kumar" role="Junior Engineer • JE-2045" />

            <Officer name="Priya Sharma" role="Assistant Engineer • AE-1021" />
          </Card>

          <div className="w-80 h-fit">
            <Card>
              <div className="flex items-center gap-2 mb-6">
                <span className="text-xl">₹</span>
                <h2 className="text-lg font-semibold">Financial Summary</h2>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Total Budget</span>
                  <span className="font-bold text-gray-800">₹2.4 Cr</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Amount Released</span>
                  <span className="font-bold text-emerald-500">₹1.4 Cr</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Pending Payment</span>
                  <span className="font-bold text-orange-400">₹45 L</span>
                </div>
              </div>

              <button className="w-full mt-6 py-2 border border-gray-200 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50 transition">
                <span>
                  <IconFileDollar size={22} />
                </span>{" "}
                View All Bills
              </button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= REUSABLE COMPONENTS ================= */

const Card = ({ children }) => (
  <div className="bg-white rounded-2xl p-5 border border-zinc-200">
    {children}
  </div>
);

const Info = ({ label, value }) => (
  <div>
    <p className="text-xs text-gray-400">{label}</p>
    <p className="font-medium">{value}</p>
  </div>
);

const Detail = ({ label, value, icon, link }) => (
  <div className="mb-3">
    <p className="text-xs text-gray-400 mb-1">{label}</p>
    <p className="flex items-center gap-2 text-sm text-blue-600 font-medium">
      {icon}
      {link ? <a href="#">{value}</a> : value}
    </p>
  </div>
);

const ActionBtn = ({ text, primary, icon }) => (
  <button
    className={`flex px-6 gap-1.5 justify-center cursor-pointer items-center py-2 rounded-xl text-sm font-medium transition ${
      primary
        ? "bg-blue-600 text-white hover:bg-blue-700"
        : "border border-zinc-300 hover:bg-gray-100"
    }`}
  >
    {icon}
    {text}
  </button>
);

const Officer = ({ name, role }) => (
  <div className="flex items-center gap-3 p-3 rounded-xl mt-1 bg-gray-50 cursor-pointer">
    <div className="w-9 h-9 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
      <IconUser size={18} />
    </div>

    <div>
      <p className="text-sm font-medium">{name}</p>
      <p className="text-xs text-gray-400">{role}</p>
    </div>
  </div>
);
