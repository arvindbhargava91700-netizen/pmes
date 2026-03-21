"use client";
import {
  ArrowLeft,
  FileText,
  Save,
  BarChart3,
  GitBranch,
  Target,
  GripVertical,
  Plus,
  CalendarIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import GanttChart from "@/components/Admin/tenders/GanttChart";
import PertChart from "@/components/Admin/tenders/PertChart";
import CriticalPathAnalysis from "@/components/Admin/tenders/CriticalPath";
import { FaRegFileAlt } from "react-icons/fa";
import MilestoneCard from "@/components/Admin/tenders/MilestoneCard";
import { useMutation, useQuery } from "@tanstack/react-query";
import api from "@/components/Api/privetApi";
import toast from "react-hot-toast";

export default function TenderDetails() {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const [documents, setDocuments] = useState([]);
  const [errors, setErrors] = useState(null);
  const [milestones, setMilestones] = useState([
    {
      sequence_no: 1,
      milestone_title: "",
      duration_weeks: "",
      description: "",
      dependencies: [],
      is_critical: 1,
    },
  ]);
  const [formData, setFormData] = useState({
    tender_code: "",
    title: "",
    department_id: "",
    work_type_id: "",
    estimated_cost: "",
    emd_amount: "",
    description: "",
    tender_status_id: 1,
    start_date: "",
    end_date: "",
    schedule_type: "",
    project_duration_weeks: "",
    is_locked: 0,
  });

  // tender Department
  const fetchDepartments = async () => {
    const res = await api.get("/public/api/master/departments");
    console.log(res.data);
    return res.data || [];
  };

  const { data: tenderDepartments = [] } = useQuery({
    queryKey: ["tenderDepartments"],
    queryFn: fetchDepartments,
  });

  // tender Type
  const fetchType = async () => {
    const res = await api.get("/public/api/master/work-types");
    console.log(res.data);
    return res.data || [];
  };

  const { data: tenderType = [] } = useQuery({
    queryKey: ["tenderStatus"],
    queryFn: fetchType,
  });

  // create tender
  const createTender = async (data) => {
    const res = await api.post("/public/api/tender", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return res.data;
  };

  const { mutate, isPending, isError } = useMutation({
    mutationFn: createTender,
    onSuccess: (data) => {
      if (data?.status === true || data?.status === 200) {
        toast.success(data.message || "Tender created successful!");

        setFormData({
          tender_code: "",
          title: "",
          department_id: "",
          work_type_id: "",
          estimated_cost: "",
          emd_amount: "",
          description: "",
          tender_status_id: 1,
          start_date: "",
          end_date: "",
          schedule_type: "daily",
          project_duration_weeks: "",
          is_locked: 0,
        });

        setMilestones([
          {
            sequence_no: 1,
            milestone_title: "",
            duration_weeks: "",
            description: "",
            dependencies: [],
            is_critical: 1,
          },
        ]);
        setDocuments([]);
        setErrors(null);
      }
    },
    onError: (error) => {
      console.log("API Error ", error.response?.data);
      setErrors(error?.response?.data);
      toast.error(error.response?.data?.message || "Server error, try again");
    },
  });

  const updateMilestone = (index, field, value) => {
    setMilestones((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [field]: value,
      };
      const finalList = updated.map((m, i) => {
        if (i === 0) return { ...m, dependencies: [] };
        const prevFilled = updated
          .slice(0, i)
          .filter((item) => item.milestone_title.trim() !== "")
          .map((_, idx) => idx + 1);
        return {
          ...m,
          dependencies: prevFilled,
        };
      });
      return finalList;
    });
  };

  const handleDependencyChange = (currentIndex, depId) => {
    setMilestones((prev) => {
      const newMilestones = JSON.parse(JSON.stringify(prev));
      const currentDeps = newMilestones[currentIndex].dependencies || [];
      const idToToggle = Number(depId);
      const indexInDeps = currentDeps.indexOf(idToToggle);
      if (indexInDeps > -1) {
        currentDeps.splice(indexInDeps, 1);
      } else {
        currentDeps.push(idToToggle);
      }
      newMilestones[currentIndex].dependencies = currentDeps;
      console.log("Updated Milestones State:", newMilestones);
      return newMilestones;
    });
  };

  const formattedMilestones = milestones.map((m, i) => ({
    sequence_no: i + 1,
    milestone_title: m.milestone_title,
    duration_weeks: Number(m.duration_weeks),
    description: m.description,
    dependencies: m.dependencies.map((d) => Number(d)),
    is_critical: Number(m.is_critical),
  }));

  const handleSubmit = () => {
    const formDataToSend = new FormData();

    // basic fields
    Object.keys(formData).forEach((key) => {
      formDataToSend.append(key, formData[key]);
    });

    // milestones (important) again push
    formattedMilestones.forEach((m, index) => {
      formDataToSend.append(`milestones[${index}][sequence_no]`, m.sequence_no);
      formDataToSend.append(
        `milestones[${index}][milestone_title]`,
        m.milestone_title
      );
      formDataToSend.append(
        `milestones[${index}][duration_weeks]`,
        m.duration_weeks
      );
      formDataToSend.append(`milestones[${index}][description]`, m.description);
      formDataToSend.append(`milestones[${index}][is_critical]`, m.is_critical);

      // dependencies array
      m.dependencies.forEach((dep, dIndex) => {
        formDataToSend.append(
          `milestones[${index}][dependencies][${dIndex}]`,
          dep
        );
      });
    });

    // ✅ append files
    documents.forEach((file) => {
      formDataToSend.append("documents[]", file);
    });

    mutate(formDataToSend);
  };

  // project_duration_weeks
  const calculateDuration = (start, end) => {
    if (!start || !end) return "";
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = endDate - startDate;
    if (diffTime < 0) return "";
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    const weeks = Math.ceil(diffDays / 7);
    return weeks;
  };

  useEffect(() => {
    const weeks = calculateDuration(formData.start_date, formData.end_date);
    setFormData((prev) => ({
      ...prev,
      project_duration_weeks: weeks,
    }));
  }, [formData.start_date, formData.end_date]);

  // file upload
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
  };

  const processFiles = (files) => {
    setDocuments((prev) => [...prev, ...files]); // store actual File objects
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    processFiles(files);
  };

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
          {/* <div className="flex items-center gap-2 md:gap-3">
            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-3 md:px-4 py-2 rounded-xl cursor-pointer hover:text-blue-500 border border-zinc-300 text-sm md:text-base text-gray-700 hover:bg-gray-50 whitespace-nowrap">
              <FileText size={16} />
              <span className="hidden sm:inline">Save as Draft</span>
              <span className="sm:hidden">Draft</span>
            </button>

            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 md:px-5 py-2 rounded-xl cursor-pointer bg-blue-600 text-sm md:text-base text-white hover:bg-blue-700 whitespace-nowrap">
              <Save size={16} />
              <span>Create Tender</span>
            </button>
          </div> */}
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
                <div className="md:col-span-1">
                  <label className="text-sm font-medium">
                    Tender Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.tender_code}
                    onChange={(e) =>
                      setFormData({ ...formData, tender_code: e.target.value })
                    }
                    placeholder="Enter tender code"
                    className="mt-1 w-full border border-zinc-300 rounded-lg px-4 py-2 bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  {isError && errors?.errors?.tender_code && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.errors.tender_code}
                    </p>
                  )}
                </div>

                <div className="md:col-span-1">
                  <label className="text-sm font-medium">
                    Tender Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="Enter tender title"
                    className="mt-1 w-full border border-zinc-300 rounded-lg px-4 py-2 bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  {isError && errors?.errors?.title && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.errors.title}
                    </p>
                  )}
                </div>

                {/* Responsive Selects */}
                <div className="grid grid-cols-1 gap-1">
                  <label className="text-sm font-medium">Department *</label>
                  <select
                    value={formData.department_id}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        department_id: e.target.value,
                      })
                    }
                    className="w-full border border-zinc-300 rounded-lg px-4 py-2 bg-gray-50"
                  >
                    <option>Select department</option>
                    {tenderDepartments.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                  {isError && errors?.errors?.department_id && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.errors.department_id}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-1">
                  <label className="text-sm font-medium">Type of Work *</label>
                  <select
                    value={formData.work_type_id}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        work_type_id: e.target.value,
                      })
                    }
                    className="w-full border border-zinc-300 rounded-lg px-4 py-2 bg-gray-50"
                  >
                    <option>Select work type</option>
                    {tenderType.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.workType}
                      </option>
                    ))}
                  </select>
                  {isError && errors?.errors?.work_type_id && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.errors.work_type_id}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium">
                    Estimated Cost (₹) *
                  </label>
                  <input
                    type="text"
                    value={formData.estimated_cost}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        estimated_cost: e.target.value,
                      })
                    }
                    placeholder="Enter cost"
                    className="mt-1 w-full border border-zinc-300 rounded-lg px-4 py-2 bg-gray-50"
                  />
                  {isError && errors?.errors?.estimated_cost && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.errors.estimated_cost}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium">EMD Amount (₹)</label>
                  <input
                    type="text"
                    value={formData.emd_amount}
                    onChange={(e) =>
                      setFormData({ ...formData, emd_amount: e.target.value })
                    }
                    placeholder="Enter amount"
                    className="mt-1 w-full border border-zinc-300 rounded-lg px-4 py-2 bg-gray-50"
                  />
                  {isError && errors?.errors?.emd_amount && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.errors.emd_amount}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm font-medium">Description</label>
                  <textarea
                    rows="4"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="mt-1 w-full border border-zinc-300 rounded-lg px-4 py-2 bg-gray-50"
                    placeholder="Enter Description ..."
                  />
                  {isError && errors?.errors?.description && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.errors.description}
                    </p>
                  )}
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
                      type="date"
                      value={formData.start_date}
                      onChange={(e) =>
                        setFormData({ ...formData, start_date: e.target.value })
                      }
                      placeholder="Select starting date"
                      className="w-full pl-10 pr-3 py-2 border border-zinc-100 rounded-xl text-sm bg-gray-50 focus:outline-none"
                    />
                    {isError && errors?.errors?.start_date && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.errors.start_date}
                      </p>
                    )}
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
                      type="date"
                      value={formData.end_date}
                      onChange={(e) =>
                        setFormData({ ...formData, end_date: e.target.value })
                      }
                      placeholder="Select ending date"
                      className="w-full pl-10 pr-3 py-2 border border-zinc-100 rounded-xl text-sm bg-gray-50 focus:outline-none"
                    />
                    {isError && errors?.errors?.end_date && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.errors.end_date}
                      </p>
                    )}
                  </div>
                </div>

                {/* Schedule Type */}
                <div>
                  <label className="text-sm font-medium">
                    Schedule Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.schedule_type}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        schedule_type: e.target.value,
                      })
                    }
                    className="w-full mt-2 px-3 py-2 border border-zinc-100 rounded-xl text-sm bg-gray-50 focus:outline-none"
                  >
                    <option>Select work type</option>
                    <option value="monthly">Monthly</option>
                    <option value="weekly">Weekly</option>
                    <option value="daily">Daily</option>
                  </select>
                  {isError && errors?.errors?.schedule_type && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.errors.schedule_type}
                    </p>
                  )}
                </div>

                {/* Project Duration */}
                <div>
                  <label className="text-sm font-medium">
                    Project Duration
                  </label>
                  <div className="mt-2 flex items-center gap-2 px-3 py-2 border border-zinc-100 rounded-xl bg-gray-50">
                    <span className="text-lg font-semibold">
                      {formData.project_duration_weeks || 0}
                    </span>
                    <span className="text-sm text-gray-500">weeks</span>
                  </div>
                </div>
              </div>

              {/* Lock Baseline */}
              <div className="mt-6 bg-gray-50 rounded-xl p-4 flex items-center gap-3">
                {/* Toggle */}
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_locked === 1}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        is_locked: e.target.checked ? 1 : 0,
                      }))
                    }
                    className="sr-only peer"
                  />
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
                    {milestones.length} milestones
                  </p>
                  <p className="text-xs p-0.5 flex items-center px-4 text-red-600 font-semibold border border-red-300 rounded-full">
                    {
                      milestones.filter((m) => Number(m.is_critical) === 1)
                        .length
                    }{" "}
                    critical
                  </p>
                  <p
                    onClick={() =>
                      setMilestones((prev) => [
                        ...prev,
                        {
                          sequence_no: prev.length + 1,
                          milestone_title: "",
                          duration_weeks: "",
                          description: "",
                          dependencies: [],
                          is_critical: 1,
                        },
                      ])
                    }
                    className="text-xs cursor-pointer p-1.5 px-4 text-zinc-600 font-semibold border bg-zinc-50 hover:bg-zinc-100 border-zinc-300 rounded-lg flex gap-2 items-center"
                  >
                    {" "}
                    <Plus size={13} /> Add Milestone
                  </p>
                </div>
              </div>

              {milestones.map((m, index) => (
                <MilestoneCard
                  key={index}
                  id={index + 1}
                  data={m}
                  dependenciesList={milestones
                    .slice(0, index)
                    .map((item, i) => ({
                      id: i + 1,
                      label:
                        item.milestone_title.trim() !== ""
                          ? item.milestone_title
                          : `M${i + 1}`,
                    }))}
                  onChange={(field, value) =>
                    updateMilestone(index, field, value)
                  }
                  onDependencyChange={(depId) =>
                    handleDependencyChange(index, depId)
                  }
                  onDelete={() => {
                    const updated = milestones.filter((_, i) => i !== index);
                    setMilestones(updated);
                  }}
                />
              ))}
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-6 mt-5">
              <div className="flex items-center gap-2 mb-4">
                <FaRegFileAlt className="text-blue-500" />
                <h2 className="font-bold text-slate-800">Tender Documents</h2>
              </div>

              <div
                onClick={() => fileInputRef.current.click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center mb-4 cursor-pointer transition-all
                ${
                  isDragging
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 bg-gray-50/50 hover:border-blue-400"
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
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
                    />
                  </svg>
                </div>

                <p className="text-sm text-gray-600 font-medium">
                  Drag & drop files here or{" "}
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current.click();
                    }}
                    className="text-blue-600 cursor-pointer"
                  >
                    browse
                  </span>
                </p>

                <p className="text-[11px] text-gray-400 mt-1 uppercase">
                  PDF, DOC, XLS up to 25MB each
                </p>
              </div>

              {isError && errors?.errors?.documents && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.errors.documents}
                </p>
              )}

              <div className="w-full mt-3">
                <button
                  onClick={handleSubmit}
                  disabled={isPending}
                  className="flex items-center justify-center gap-2 w-full py-2 rounded-xl cursor-pointer bg-blue-600 text-white hover:bg-blue-700"
                >
                  <Save size={16} />
                  <span>{isPending ? "Creating Tender" : "Create Tender"}</span>
                </button>
              </div>

              <div className="space-y-3 mt-3">
                {documents.map((doc, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-xl shadow-sm hover:border-blue-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-50 p-2 rounded-lg text-blue-600 text-xs font-bold">
                        {doc.type?.split("/")[1]?.toUpperCase()}
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-gray-800">
                          {doc.file_name}
                        </p>
                        <p className="text-sm font-semibold text-gray-800">
                          {doc.name}
                        </p>
                        <p className="text-[10px] text-gray-400 uppercase">
                          {(doc.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        setDocuments((prev) =>
                          prev.filter((_, i) => i !== index)
                        )
                      }
                      className="text-gray-400 hover:text-red-500"
                    >
                      ✕
                    </button>
                  </div>
                ))}
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
