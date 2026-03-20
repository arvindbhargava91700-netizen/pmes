// UpdateTenderModal.jsx
"use client";
import React, { useEffect, useState } from "react";
import { FileText, X } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/components/Api/privetApi";
import toast from "react-hot-toast";

const UpdateTenderModal = ({ isOpen, onClose, tenderDetails }) => {
  const queryClient = useQueryClient();

  const [form, setForm] = useState(null);

  useEffect(() => {
    if (tenderDetails) {
      setForm({
        ...tenderDetails,

        department_id: tenderDetails.department_id
          ? String(tenderDetails.department_id)
          : "",

        work_type_id: tenderDetails.work_type_id
          ? String(tenderDetails.work_type_id)
          : "",

        start_date:
          tenderDetails.start_date || tenderDetails.timeline?.start_date || "",

        end_date:
          tenderDetails.end_date || tenderDetails.timeline?.end_date || "",

        project_duration_weeks:
          tenderDetails.project_duration_weeks ||
          tenderDetails.timeline?.project_duration_weeks ||
          "",

        milestones: (tenderDetails.milestones || []).map((m) => ({
          ...m,
          dependencies: Array.isArray(m.dependencies) ? m.dependencies : [],
        })),

        documents: tenderDetails.documents || [],
      });
    }
  }, [tenderDetails]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleMilestoneChange = (i, field, value) => {
    const updated = [...form.milestones];
    updated[i][field] = value;
    setForm({ ...form, milestones: updated });
  };

  const handleDependencyChange = (i, value) => {
    const updated = [...form.milestones];

    updated[i].dependencies = value
      .split(",")
      .map((v, index) => ({
        title: v.trim(),
        id: updated[i].dependencies[index]?.id || null,
      }))
      .filter((d) => d.title);

    setForm({ ...form, milestones: updated });
  };

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
    queryKey: ["tenderWorkTypes"],
    queryFn: fetchType,
  });

  //   update tander
  const updateTender = async () => {
    const res = await api.put(`/public/api/tender/${form.id}`, form);
    return res.data;
  };

  const { mutate, isPending } = useMutation({
    mutationFn: updateTender,
    onSuccess: (data) => {
      toast.success(data?.message || "Updated successfully");
      queryClient.invalidateQueries(["tenderList"]);
      onClose();
    },
    onError: () => toast.error("Update failed"),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate();
  };

  if (!isOpen || !form) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-5xl max-h-[90vh] overflow-auto rounded-2xl p-6 relative">
        <button onClick={onClose} className="absolute right-4 top-4">
          <X />
        </button>

        <h2 className="text-xl font-bold mb-6">Edit Tender</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="tender_code" className="text-zinc-700">
                Tender Code
              </label>
              <Input
                name="tender_code"
                value={form.tender_code}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="title" className="text-zinc-700">
                Title
              </label>
              <Input name="title" value={form.title} onChange={handleChange} />
            </div>
            <div>
              {/* <label htmlFor="department" className="text-zinc-700">
                Department
              </label>
              <Input
                name="department"
                value={form.department}
                onChange={handleChange}
              /> */}
              <div className="grid grid-cols-1 gap-1">
                <label className="text-sm font-medium">Department *</label>
                <select
                   value={
    tenderDepartments.find(
      (dept) => String(dept.id) === String(form.department_id)
    )?.id || ""
  }
                  onChange={(e) =>
                    setForm({
                      ...form,
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
              </div>
            </div>
            <div>
              {/* <label htmlFor="workType" className="text-zinc-700">
                Type of work
              </label>
              <Input
                name="workType"
                value={form.workType}
                onChange={handleChange}
              /> */}
              <div className="grid grid-cols-1 gap-1">
                <label className="text-sm font-medium">Type of Work *</label>
                <select
                  value={form.work_type_id || ""}
                  onChange={(e) =>
                    setForm({
                      ...form,
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
              </div>
            </div>
            <div>
              <label htmlFor="estimated_cost" className="text-zinc-700">
                Estimated Cost (₹)
              </label>
              <Input
                name="estimated_cost"
                value={form.estimated_cost}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="emd_amount" className="text-zinc-700">
                EMD Amount (₹)
              </label>
              <Input
                name="emd_amount"
                value={form.emd_amount}
                onChange={handleChange}
              />
            </div>
            {/* <Input
              name="tender_status_id"
              value={form.tender_status_id}
              onChange={handleChange}
            /> */}
            <div>
              <label htmlFor="schedule_type" className="text-zinc-700">
                Schedule Type
              </label>
              <Input
                name="schedule_type"
                value={form.timeline.schedule_type}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="project_duration_weeks" className="text-zinc-700">
                Project Duration
              </label>
              <Input
                name="project_duration_weeks"
                value={form.project_duration_weeks}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label htmlFor="description" className="text-zinc-700">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full border border-zinc-200 text-zinc-700 p-2 rounded"
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div className="">
              <label htmlFor="start_date" className="text-zinc-700 block">
                Start Date
              </label>
              <input
                type="date"
                name="start_date"
                value={form.start_date}
                onChange={handleChange}
                className="border border-zinc-200 text-zinc-700 p-2 rounded w-full"
              />
            </div>
            <div>
              <label htmlFor="description" className="text-zinc-700 block">
                End Date
              </label>
              <input
                type="date"
                name="end_date"
                value={form.end_date}
                onChange={handleChange}
                className="border border-zinc-200 text-zinc-700 p-2 rounded w-full"
              />
            </div>
          </div>

          {/* Milestones */}
          <div>
            <h3 className="font-semibold mb-3">Milestones</h3>
            {form.milestones.map((m, i) => (
              <div
                key={i}
                className="border border-zinc-200 p-4 rounded-lg mb-3 grid grid-cols-2 gap-4"
              >
                <div>
                  <label htmlFor="description" className="text-zinc-700 block">
                    S.No
                  </label>
                  <Input
                    value={m.sequence_no}
                    onChange={(e) =>
                      handleMilestoneChange(i, "sequence_no", e.target.value)
                    }
                    placeholder="Sequence"
                  />
                </div>
                <div>
                  <label htmlFor="description" className="text-zinc-700 block">
                    Milestones Title
                  </label>
                  <Input
                    value={m.title}
                    onChange={(e) =>
                      handleMilestoneChange(
                        i,
                        "milestone_title",
                        e.target.value
                      )
                    }
                    placeholder="Title"
                  />
                </div>
                <div>
                  <label htmlFor="description" className="text-zinc-700 block">
                    Duraction (weeks)
                  </label>
                  <Input
                    value={m.duration_weeks}
                    onChange={(e) =>
                      handleMilestoneChange(i, "duration_weeks", e.target.value)
                    }
                    placeholder="Duration"
                  />
                </div>
                <div>
                  <label htmlFor="description" className="text-zinc-700 block">
                    Dependencies
                  </label>
                  <Input
                    value={
                      Array.isArray(m.dependencies)
                        ? m.dependencies.map((d) => d.title).join(",  ")
                        : ""
                    }
                    onChange={(e) => handleDependencyChange(i, e.target.value)}
                    placeholder="Dependencies (comma separated)"
                  />
                </div>
              </div>
            ))}
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-blue-600 text-white py-2 rounded"
          >
            {isPending ? "Updating..." : "Update Tender"}
          </button>
        </form>
      </div>
    </div>
  );
};

const Input = ({ name, value, onChange, placeholder }) => (
  <input
    name={name}
    value={value || ""}
    onChange={onChange}
    placeholder={placeholder || name}
    className="border border-zinc-200 text-zinc-700 p-2 rounded w-full"
  />
);

export default UpdateTenderModal;
