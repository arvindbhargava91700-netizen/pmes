"use client";
import React, { useState, useEffect } from "react";
import { ChevronLeft, FolderPlus, MapPin, Users } from "lucide-react";
import toast from "react-hot-toast";
import api from "@/components/Api/privetApi";

const CreateProject = () => {
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    project_name: "",
    tender_id: "",
    department_id: "",
    work_classification_id: "",
    contractor_id: "",
    project_description: "",
    project_status_id: 1,
    total_budget: "",
    zone_id: "",
    ward_id: "",
    latitude: "28.9845",
    longitude: "77.7064",
    site_address: "",
    je_id: "",
    ae_id: "",
    ee_id: "",
  });

  // Dropdown states
  const [tenders, setTenders] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [contractors, setContractors] = useState([]);
  const [workclass, setWorkclass] = useState([]);
  const [zones, setZones] = useState([]);
  const [wards, setWards] = useState([]);
  const [ae, setAe] = useState([]);
  const [je, setJe] = useState([]);
  const [ee, setEe] = useState([]);

  const dropdowns = [
    { url: "public/api/tender", setter: setTenders },
    { url: "public/api/master/departments", setter: setDepartments },
    { url: "public/api/master/contractors", setter: setContractors },
    { url: "public/api/master/work-classifications", setter: setWorkclass },
    { url: "public/api/master/zones", setter: setZones },
    { url: "public/api/master/wards", setter: setWards },
    { url: "public/api/users/role/AE", setter: setAe },
    { url: "public/api/users/role/JE", setter: setJe },
    { url: "public/api/users/role/EE", setter: setEe },
  ];

  const fetchDropdown = async ({ url, setter }) => {
    try {
      const res = await api.get(url);
      setter(res.data.data || res.data || []);
    } catch (err) {
      console.error(`Failed to fetch ${url}:`, err);
      setter([]);
    }
  };

  // Load dropdowns one by one using setInterval
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < dropdowns.length) {
        fetchDropdown(dropdowns[i]);
        i++;
      } else {
        setLoading(false); // all dropdowns finished
        clearInterval(interval);
      }
    }, 300); // 300ms delay between each API call

    return () => clearInterval(interval); // cleanup
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setErrors({});
    try {
      const res = await api.post("public/api/master/projects", formData);
      if (res.data.status) {
          toast.success("Project Created Successfully ✅");
        setFormData({
          project_name: "",
          tender_id: "",
          department_id: "",
          work_classification_id: "",
          contractor_id: "",
          project_description: "",
          project_status_id: 1,
          total_budget: "",
          zone_id: "",
          ward_id: "",
          latitude: "28.9845",
          longitude: "77.7064",
          site_address: "",
          je_id: "",
          ae_id: "",
          ee_id: "",
        });
      } else {
        toast.error("Failed to create project ❌");
      }
    } catch (error) {
      if (error.response?.data?.errors) setErrors(error.response.data.errors);
      else console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      project_name: "",
      tender_id: "",
      department_id: "",
      work_classification_id: "",
      contractor_id: "",
      project_description: "",
      project_status_id: 1,
      total_budget: "",
      zone_id: "",
      ward_id: "",
      latitude: "28.9845",
      longitude: "77.7064",
      site_address: "",
      je_id: "",
      ae_id: "",
      ee_id: "",
    });
    setErrors({});
  };
  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans text-slate-900 mt-10">
      {/* Header */}
      <div className="max-w-6xl mx-auto flex items-center gap-4 mb-8">
        <button className="p-2 hover:bg-slate-200 rounded-full transition-colors">
          <ChevronLeft size={20} />
        </button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create New Project</h1>
          <p className="text-slate-500">Set up a new infrastructure project</p>
        </div>
      </div>

      {loading && (
        <div className="max-w-6xl mx-auto mb-4 text-center text-blue-600 font-semibold">
          Loading...
        </div>
      )}

      {/* Project Form */}
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Project Details */}
        <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2 text-blue-800 font-semibold">
            <FolderPlus size={20} />
            <h2 className="text-black">Project Details</h2>
          </div>
          <div className="p-8 grid grid-cols-2 gap-6">
  

            {/* Project Name */}
            <div className="col-span-2 md:col-span-1">
              <label className="block text-sm font-semibold mb-2">
                Project Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="project_name"
                value={formData.project_name}
                onChange={handleChange}
                placeholder="Enter project name"
                className={`w-full p-3 bg-slate-50 border rounded-xl outline-none focus:ring-2 transition-all ${
                  errors.project_name
                    ? "border-red-500 focus:ring-red-200"
                    : "border-slate-200 focus:ring-blue-500/20"
                }`}
              />
              {errors.project_name && (
                <p className="text-red-500 text-sm mt-1">{errors.project_name[0]}</p>
              )}
            </div>
            {/* Total Buget */}
            <div className="col-span-2 md:col-span-1">
              <label className="block text-sm font-semibold mb-2">
                Total Buget <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="total_budget"
                value={formData.total_budget}
                onChange={handleChange}
                placeholder="Enter Total Buget"
                className={`w-full p-3 bg-slate-50 border rounded-xl outline-none focus:ring-2 transition-all ${
                  errors.total_budget
                    ? "border-red-500 focus:ring-red-200"
                    : "border-slate-200 focus:ring-blue-500/20"
                }`}
              />
              {errors.total_budget && (
                <p className="text-red-500 text-sm mt-1">{errors.total_budget[0]}</p>
              )}
            </div>

            {/* Dropdowns */}
            <FormSelect  value={formData.tender_id} 
              label="Linked Tender"
              name="tender_id"
              options={tenders}
              labelKey="title"
              valueKey="id"
              onChange={handleChange}
              error={errors.tender_id}
            />
            <FormSelect  value={formData.department_id} 
              label="Department"
              name="department_id"
              options={departments}
              onChange={handleChange}
              error={errors.department_id}
            />
            <FormSelect  value={formData.work_classification_id} 
              label="Work Classification"
              name="work_classification_id"
              options={workclass}
              onChange={handleChange}
              error={errors.work_classification_id}
            />
            <FormSelect  value={formData.contractor_id} 
              label="Contractor"
              name="contractor_id"
              options={contractors}
              labelKey="contractor_name"
              onChange={handleChange}
              error={errors.contractor_id}
            />

            {/* Project Description */}
            <div className="col-span-2">
              <label className="block text-sm font-semibold mb-2">Project Description</label>
              <textarea
                rows="4"
                name="project_description"
                value={formData.project_description}
                onChange={handleChange}
                placeholder="Enter project description..."
                className={`w-full p-3 bg-slate-50 border rounded-xl outline-none focus:ring-2 transition-all resize-none ${
                  errors.project_description
                    ? "border-red-500 focus:ring-red-200"
                    : "border-slate-200 focus:ring-blue-500/20"
                }`}
              />
              {errors.project_description && (
                <p className="text-red-500 text-sm mt-1">{errors.project_description[0]}</p>
              )}
            </div>
          </div>
        </section>

        {/* Location Details */}
        <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2 text-blue-800 font-semibold">
            <MapPin size={20} />
            <h2 className="text-black">Location Details</h2>
          </div>
          <div className="p-8 grid grid-cols-3 gap-6">
            <FormSelect  value={formData.zone_id} 
              label="Zone"
              name="zone_id"
              options={zones}
              onChange={handleChange}
              error={errors.zone_id}
            />
            <FormSelect  value={formData.ward_id} 
              label="Ward"
              name="ward_id"
              options={wards}
              onChange={handleChange}
              error={errors.ward_id}
            />
            <div>
              <label className="block text-sm font-semibold mb-2">GPS Coordinates</label>
              <input
                disabled
                value={`${formData.latitude}° N, ${formData.longitude}° E`}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed"
              />
            </div>
            <div className="col-span-3">
              <label className="block text-sm font-semibold mb-2">Site Address</label>
              <input
                type="text"
                name="site_address"
                value={formData.site_address}
                onChange={handleChange}
                placeholder="Enter complete site address"
                className={`w-full p-3 bg-slate-50 border rounded-xl outline-none ${
                  errors.site_address
                    ? "border-red-500 focus:ring-red-200"
                    : "border-slate-200 focus:ring-blue-500/20"
                }`}
              />
              {errors.site_address && (
                <p className="text-red-500 text-sm mt-1">{errors.site_address[0]}</p>
              )}
            </div>
          </div>
        </section>

        {/* Assigned Officers */}
        <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2 text-blue-800 font-semibold">
            <Users size={20} />
            <h2 className="text-black">Assigned Officers</h2>
          </div>
          <div className="p-8 grid grid-cols-3 gap-6">
            <FormSelect  value={formData.je_id}  label="Junior Engineer (JE)" name="je_id" options={je} onChange={handleChange} error={errors.je_id} />
            <FormSelect  value={formData.ae_id}  label="Assistant Engineer (AE)" name="ae_id" options={ae} onChange={handleChange} error={errors.ae_id} />
            <FormSelect  value={formData.ee_id}  label="Executive Engineer (EE)" name="ee_id" options={ee} onChange={handleChange} error={errors.ee_id} />
          </div>
        </section>

        {/* Buttons */}
        <div className="max-w-6xl mx-auto mt-6">
          <div className="bg-white rounded-2xl p-6 flex justify-end gap-4 shadow-lg border border-gray-200">
            <button
              onClick={handleReset}
              className="px-6 py-3 rounded-xl bg-white text-gray-700 border border-gray-300 hover:bg-gray-100 font-semibold transition-all shadow-md hover:shadow-lg"
            >
              Reset
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold shadow-md transition-all hover:shadow-lg hover:bg-blue-700 transform ${
                loading ? "opacity-50 cursor-not-allowed" : "hover:-translate-y-1"
              }`}
            >
              {loading ? "Creating..." : "Create Project"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const FormSelect = ({
  label,
  options = [],
  name,
  value, // 👈 add this
  onChange,
  labelKey = "name",
  valueKey = "id",
  error,
}) => (
  <div className="relative">
    <label className="block text-sm font-semibold mb-2">
      {label} <span className="text-red-500">*</span>
    </label>

    <select
      name={name}
      value={value || ""} // ✅ important
      onChange={onChange}
      className={`w-full p-3 bg-slate-50 border rounded-xl ${
        error ? "border-red-500" : "border-slate-200"
      }`}
    >
      <option value="">Select {label}</option>

      {options.map((item) => (
        <option key={item[valueKey]} value={item[valueKey]}>
          {item[labelKey]}
        </option>
      ))}
    </select>

    {error && <p className="text-red-500 text-sm mt-1">{error[0]}</p>}
  </div>
);

export default CreateProject;