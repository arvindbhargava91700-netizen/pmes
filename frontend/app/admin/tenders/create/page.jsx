"use client";
import {
  ArrowLeft,
  FileText,
  Save,
  BarChart3,
  GitBranch,
  Target,
  Menu,
  GripVertical,
  Plus,
  CalendarIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import GanttChart from "@/components/Admin/tenders/GanttChart";
import PertChart from "@/components/Admin/tenders/PertChart";
import CriticalPathAnalysis from "@/components/Admin/tenders/CriticalPath";
import { FaRegCalendarAlt, FaRegFileAlt } from "react-icons/fa";
import MilestoneCard from "@/components/Admin/tenders/MilestoneCard";

const deps = [
  { id: 2, label: "Foundation Work" },
  { id: 3, label: "Structural Framework" },
  { id: 4, label: "Electrical & Plumbing" },
  { id: 5, label: "Interior Finishing" },
  { id: 6, label: "Final Inspection" },
];

export default function TenderDetails() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("details");
  const fileInputRef = useRef(null);

  // dynimic states
  const [title, setTitle] = useState("");
  const [estimated_cost, setEstimated_cost] = useState("");
  const [emd_amount, setEmd_amount] = useState("");
  const [description, setDescription] = useState("");
  const [start_date, setStart_date] = useState("");
  const [end_date, setEnd_date] = useState("");
  const [schedule_type, setSchedule_type] = useState("");
  const [project_duration_weeks, setProject_duration_weeks] = useState("");
  const [is_locked, setIs_locked] = useState(0);
  const [sequence_no, setSequence_no] = useState("");
  const [milestone_title, setMilestone_title] = useState("");
  const [duration_weeks, setDuration_weeks] =useState();
  const [dependencies, setDependencies] = useState([])
  const [is_critical, setIs_critical] = useState("");
  const [file_name, setFile_name] = useState("");
  const [file_path, setFile_path] = useState("");
  const [file_size, setFile_size] = useState("");
  const [mime_type, setMime_type] = useState("");

  // const handleBoxClick = () => {
  //   fileInputRef.current.click();
  // };

  // const handleFileChange = (event) => {
  //   const files = event.target.files;
  //   console.log("Selected files:", files);
  // };

  // const tenderCreate = () => {
  //   const res = async() => 
  // }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="pt-4 md:pt-15">
        <div className="flex flex-col md:flex-row md:items-center justify-between px-4 md:px-6 py-4 gap-4">
          <div className="flex items-center gap-3 md:gap-4">
            <button
              onClick={() => router.back()}
              className="mt-1 text-gray-600 hover:text-blue-500 flex-shrink-0 cursor-pointer"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="overflow-hidden">
              <h1 className="text-xl md:text-3xl font-bold text-gray-900 truncate">
                Create New Tender
              </h1>
              <p className="text-lg text-gray-500 truncate">
                Fill in the details and define milestones
              </p>
            </div>
          </div>

          {/* Right Section: Action Buttons */}
          <div className="flex items-center gap-2 md:gap-3">
            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-3 md:px-4 py-2 rounded-xl cursor-pointer hover:text-blue-500 border border-zinc-300 text-sm md:text-base text-gray-700 hover:bg-gray-50 whitespace-nowrap">
              <FileText size={16} />
              <span className="hidden sm:inline">Save as Draft</span>
              <span className="sm:hidden">Draft</span>
            </button>

            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 md:px-5 py-2 rounded-xl cursor-pointer bg-blue-600 text-sm md:text-base text-white hover:bg-blue-700 whitespace-nowrap">
              <Save size={16} />
              <span>Create Tender</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Navigation: Scrollable on Mobile */}
      <div className="px-4 md:px-6 pt-4 md:pt-6">
        <div className="flex gap-2 md:gap-4 text-sm font-medium text-gray-600 overflow-x-auto p-2 no-scrollbar">
          {[
            { id: "details", label: "Tender Details", icon: FileText },
            { id: "gantt", label: "Gantt Chart", icon: BarChart3 },
            { id: "pert", label: "PERT Chart", icon: GitBranch },
            { id: "critical", label: "Critical Path", icon: Target },
          ].map((tab) => (
            <div
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full cursor-pointer 
                ${
                  activeTab === tab.id
                    ? "bg-zinc-100 text-zinc-600 shadow-md scale-105"
                    : ""
                }`}
            >
              <tab.icon size={16} />
              <span className="whitespace-nowrap">{tab.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="px-4 md:px-6 py-6">
        {activeTab === "details" && (
          <>
            <div className="bg-white rounded-xl p-4 md:p-6">
              <h2 className="text-lg font-semibold flex items-center gap-2 mb-2">
                <FileText className="text-blue-600" size={18} />
                Basic Information
              </h2>
              <hr className="border-zinc-200 mb-6" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className="md:col-span-2">
                  <label className="text-sm font-medium">
                    Tender Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    placeholder="Enter tender title"
                    className="mt-1 w-full border border-zinc-300 rounded-lg px-4 py-2 bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                {/* Responsive Selects */}
                <div className="grid grid-cols-1 gap-4">
                  <label className="text-sm font-medium">Department *</label>
                  <select className="w-full border border-zinc-300 rounded-lg px-4 py-2 bg-gray-50">
                    <option>Select department</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <label className="text-sm font-medium">Type of Work *</label>
                  <select className="w-full border border-zinc-300 rounded-lg px-4 py-2 bg-gray-50">
                    <option>Select work type</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium">
                    Estimated Cost (₹) *
                  </label>
                  <input
                    placeholder="Enter cost"
                    className="mt-1 w-full border border-zinc-300 rounded-lg px-4 py-2 bg-gray-50"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">EMD Amount (₹)</label>
                  <input
                    placeholder="Enter amount"
                    className="mt-1 w-full border border-zinc-300 rounded-lg px-4 py-2 bg-gray-50"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm font-medium">Description</label>
                  <textarea
                    rows="4"
                    className="mt-1 w-full border border-zinc-300 rounded-lg px-4 py-2 bg-gray-50"
                    placeholder="..."
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-zinc-100 p-6 mt-5">
              {/* Header */}
              <div className="flex items-center gap-2 mb-6">
                <CalendarIcon className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-semibold">Timeline</h2>
              </div>

              <hr className="mb-6 text-zinc-200" />

              {/* Form Row */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Start Date */}
                <div>
                  <label className="text-sm font-medium">
                    Start Date <span className="text-red-500">*</span>
                  </label>
                  <div className="relative mt-2">
                    <CalendarIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Select date"
                      className="w-full pl-10 pr-3 py-2 border border-zinc-100 rounded-xl text-sm bg-gray-50 focus:outline-none"
                    />
                  </div>
                </div>

                {/* End Date */}
                <div>
                  <label className="text-sm font-medium">
                    End Date <span className="text-red-500">*</span>
                  </label>
                  <div className="relative mt-2">
                    <CalendarIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Select date"
                      className="w-full pl-10 pr-3 py-2 border border-zinc-100 rounded-xl text-sm bg-gray-50 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Schedule Type */}
                <div>
                  <label className="text-sm font-medium">
                    Schedule Type <span className="text-red-500">*</span>
                  </label>
                  <select className="w-full mt-2 px-3 py-2 border border-zinc-100 rounded-xl text-sm bg-gray-50 focus:outline-none">
                    <option>Monthly</option>
                    <option>Weekly</option>
                    <option>Daily</option>
                  </select>
                </div>

                {/* Project Duration */}
                <div>
                  <label className="text-sm font-medium">
                    Project Duration
                  </label>
                  <div className="mt-2 flex items-center gap-2 px-3 py-2 border border-zinc-100 rounded-xl bg-gray-50">
                    <span className="text-lg font-semibold">40</span>
                    <span className="text-sm text-gray-500">weeks</span>
                  </div>
                </div>
              </div>

              {/* Lock Baseline */}
              <div className="mt-6 bg-gray-50 rounded-xl p-4 flex items-center gap-3">
                {/* Toggle */}
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 transition"></div>
                  <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition peer-checked:translate-x-5"></div>
                </label>

                <div>
                  <p className="font-medium text-sm">Lock Baseline Timeline</p>
                  <p className="text-sm text-gray-500">
                    Prevent changes to timeline after approval
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-5 mt-5">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 pb-3 border-b mb-2 border-zinc-300">
                  <GripVertical
                    className="text-gray-500 cursor-grab"
                    size={20}
                  />
                  <p className="font-semibold text-xl">
                    Milestones & Dependencies
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-xs p-0.5 flex items-center px-4 text-zinc-600 font-semibold border border-zinc-300 rounded-full">
                    6 milestones
                  </p>
                  <p className="text-xs p-0.5 flex items-center px-4 text-red-600 font-semibold border border-red-300 rounded-full">
                    6 critical
                  </p>
                  <p className="text-xs p-1.5 px-4 text-zinc-600 font-semibold border bg-zinc-50 border-zinc-300 rounded-lg flex gap-2 items-center">
                    {" "}
                    <Plus size={13} /> Add Milestone
                  </p>
                </div>
              </div>
              <MilestoneCard
                id={1}
                title="Site Clearance & Setup"
                duration={2}
                isExpanded={true}
                dependencies={deps}
              />
              <MilestoneCard
                id={2}
                title="Foundation Work"
                duration={6}
                isExpanded={true}
                dependencies={deps}
              />
              <MilestoneCard
                id={3}
                title="Structural Framework"
                duration={12}
                isExpanded={true}
                dependencies={deps}
              />
              <MilestoneCard
                id={4}
                title="Electrical & Plumbing"
                duration={8}
                isExpanded={true}
                dependencies={deps}
              />
              <MilestoneCard
                id={5}
                title="Interior Finishing"
                duration={10}
                isExpanded={true}
                dependencies={deps}
              />
              <MilestoneCard
                id={6}
                title="Final Inspection"
                duration={2}
                isExpanded={true}
                dependencies={deps}
              />
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-6 mt-5">
              <div className="flex items-center gap-2 mb-4">
                <FaRegFileAlt className="text-blue-500" />
                <h2 className="font-bold text-slate-800">Tender Documents</h2>
              </div>

              <div
                // onClick={handleBoxClick}
                className="border-2 hover:border-blue-500 border-dashed border-gray-200 cursor-pointer rounded-xl p-8 flex flex-col items-center justify-center bg-gray-50/50 mb-4"
              >
                <input
                  type="file"
                  // ref={fileInputRef}
                  // onChange={handleFileChange}
                  className="hidden"
                  multiple
                  accept=".pdf,.doc,.docx,.xls,.xlsx"
                />
                <div className="bg-blue-50 p-3 rounded-xl mb-3">
                  <svg
                    className="w-6 h-6 text-blue-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                    ></path>
                  </svg>
                </div>
                <p className="text-sm text-gray-600 font-medium">
                  Drag and drop files here or{" "}
                  <span className="text-blue-600 cursor-pointer">
                    click to browse
                  </span>
                </p>
                <p className="text-[11px] text-gray-400 mt-1 uppercase">
                  PDF, DOC, XLS up to 25MB each
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-xl shadow-sm hover:border-blue-200 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-50 p-2 rounded-lg text-blue-600 font-bold text-xs italic">
                      PDF
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">
                        Tender Notice.pdf
                      </p>
                      <p className="text-[10px] text-gray-400 font-medium uppercase">
                        PDF • 245 KB
                      </p>
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-red-500">
                    ×
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === "gantt" && (
          <div className="w-full overflow-x-auto">
            <div className="min-w-full">
              <GanttChart />
            </div>
          </div>
        )}

        {activeTab === "pert" && (
          <div className="">
            <PertChart onRedirect={() => setActiveTab("details")} />
          </div>
        )}

        {activeTab === "critical" && (
          <div className="w-[100%] overflow-x-auto bg-white rounded-xl border border-zinc-100 p-2 md:p-4">
            <div className="min-w-full">
              <CriticalPathAnalysis />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
