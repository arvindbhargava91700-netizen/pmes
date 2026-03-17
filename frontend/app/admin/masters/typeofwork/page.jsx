"use client";
import api from "@/components/Api/privetApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiEdit2, FiMenu, FiPlus, FiSave, FiTrash2, FiX } from "react-icons/fi";

const page = () => {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [workType, setWorkType] = useState("");
  const [status, setStatus] = useState(1);
  const [errors, setErrors] = useState({});

  // for get work type
  const fetchworktype = async () => {
    const res = await api.get("/public/api/master/work-types");
    return res.data;
  };

  const {
    data = [],
    isError,
    isPending,
  } = useQuery({
    queryKey: ["worktype"],
    queryFn: fetchworktype,
  });

  //   for post work type
  const createworktype = async (data) => {
    const res = await api.post("/public/api/master/work-types", data);
    return res.data;
  };

  const {
    mutate,
    isError: isMutationError,
    isPending: createworkPending,
  } = useMutation({
    mutationFn: createworktype,
    onSuccess: () => {
      toast.success("Work type Add Successful!");
      setWorkType("");
      setStatus(1);
      setShowModal(false);
      queryClient.invalidateQueries(["worktype"]);
    },
    onError: (error) => {
      setErrors(error.response?.data || {});
    },
  });

  const handleSubmit = () => {
    if (!workType.trim()) {
      toast.error("Work type is required");
      return;
    }

    const payload = {
      workType: workType.trim(),
      status: Number(status),
    };

    console.log("POST payload:", payload);

    mutate(payload);
  };

  //   for delete work type
  const destroyworktype = async (id) => {
    const res = await api.delete(`/public/api/master/work-types/${id}`);
    return res.data;
  };

  const { mutate: deleteWorkMutate } = useMutation({
    mutationFn: destroyworktype,
    onSuccess: () => {
      toast.success("Work type deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["worktype"] });
    },
    onError: (error) => {
      toast.error("Delete failed");
      console.log("Delete error:", error.response?.data);
    },
  });

  //   for update show data in modal ui
  const { data: editData, isFetching: isFetchingSingle } = useQuery({
    queryKey: ["worktype-single", selectedId],
    queryFn: async () => {
      const res = await api.get(`/public/api/master/work-types/${selectedId}`);
      return res.data;
    },
    enabled: !!selectedId && showEditModal,
    keepPreviousData: false,
  });

  useEffect(() => {
    if (editData) {
      setWorkType(editData.workType || "");
      setStatus(editData.status ?? 1);
    }
  }, [editData]);

  //   for update modal ui
  const { mutate: updateWorkMutate, isPending: updatePending } = useMutation({
    mutationFn: async ({ id, payload }) => {
      const res = await api.put(`/public/api/master/work-types/${id}`, payload);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Work type updated successfully!");
      closeAndReset();
      queryClient.invalidateQueries(["worktype"]);
    },
    onError: (err) => {
      toast.error("Update failed");
      setErrors(err.response?.data || {});
    },
  });

  const handleUpdate = () => {
    if (!workType.trim()) return toast.error("Name is required");

    updateWorkMutate({
      id: selectedId,
      payload: {
        workType: workType.trim(),
        status: Number(status),
      },
    });
  };

  const closeAndReset = () => {
    setShowModal(false);
    setShowEditModal(false);
    setSelectedId(null);
    setWorkType("");
    setStatus(1);
    setErrors({});
  };

  if (isPending) return <p className="p-8 mt-10">Loading...</p>;
  if (isError)
    return <p className="p-8 text-red-500 mt-10">Error loading data</p>;

  return (
    <div className="p-8 mt-10 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]">
            Types of Work Configuration
          </h1>
          <p className="text-sm text-[#64748B]">
            Manage different categories of work, their visibility, and
            organizational types
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 cursor-pointer bg-[#2563EB] text-white px-5 py-2.5 rounded-xl font-medium"
        >
          <FiPlus /> Add New work tupe
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-300 overflow-hidden">
        <table className="w-full">
          <thead className="bg-zinc-200">
            <tr>
              <th className="px-6 py-4 text-xs font-bold">S.No</th>
              <th className="px-6 py-4 text-xs font-bold">Work Type</th>
              <th className="px-6 py-4 text-xs font-bold">Status</th>
              <th className="px-6 py-4 text-xs font-bold">Actions</th>
            </tr>
          </thead>

          <tbody>
            {data?.length > 0 ? (
              data.map((item, index) => (
                <tr
                  key={item.id}
                  className="hover:bg-zinc-100 border-t border-zinc-200"
                >
                  <td className="px-6 py-4 flex justify-center items-center">
                    <div className="flex items-center gap-2">
                      <FiMenu className="text-slate-300" />
                      {index + 1}
                    </div>
                  </td>

                  <td className="px-6 py-4 font-medium text-center">
                    {item.workType}
                  </td>

                  <td className="px-6 py-4 font-medium text-center">
                    <span
                      className={`px-3 py-0.5 rounded-full text-xs font-semibold ${
                        item.status === 1
                          ? "bg-green-100 text-green-700 border border-green-200"
                          : "bg-red-100 text-red-700 border border-red-200"
                      }`}
                    >
                      {item.status === 1 ? "Active" : "Inactive"}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex justify-center items-center gap-3">
                      <button
                        // onClick={() => handleToggle(item.id)}
                        className={`w-10 h-5 flex items-center rounded-full p-0.5 cursor-pointer transition-all duration-300 ${
                          item.status === 1
                            ? "bg-blue-500 justify-end"
                            : "bg-gray-300 justify-start"
                        }`}
                      >
                        <div className="w-5 h-4 bg-white rounded-full shadow-md"></div>
                      </button>
                      <button
                        onClick={() => {
                          setSelectedId(item.id);
                          setShowEditModal(true);
                        }}
                        className="p-2 hover:bg-zinc-200 text-slate-400 cursor-pointer hover:text-blue-600 rounded-lg transition-all"
                      >
                        <FiEdit2 size={16} />
                      </button>
                      <button
                        onClick={() => {
                          if (
                            confirm(
                              "Are you sure you want to delete this work type?"
                            )
                          ) {
                            deleteWorkMutate(item.id);
                          }
                        }}
                        className="p-2 hover:bg-zinc-200 text-slate-400 cursor-pointer hover:text-red-600 rounded-lg transition-all"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={8}
                  className="p-6 text-center text-zinc-500 font-medium"
                >
                  No types of work found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal add new work type */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="bg-white w-[450px] rounded-2xl shadow-2xl p-6 border border-slate-200"
            >
              {/* Modal Header */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-slate-900">
                  Add New Work Type
                </h2>
                <FiX
                  className="cursor-pointer text-slate-400 hover:bg-zinc-100 h-8 w-8 rounded-lg hover:text-red-500 p-1.5 transition-all"
                  onClick={() => setShowModal(false)}
                />
              </div>

              {/* Form Body */}
              <div className="space-y-5">
                {/* Work Type Name */}
                <div>
                  <label
                    htmlFor="workType"
                    className="block text-sm font-semibold text-slate-700 mb-2"
                  >
                    Work Type Name
                  </label>
                  <input
                    type="text"
                    id="workType"
                    name="workType"
                    value={workType}
                    onChange={(e) => setWorkType(e.target.value)}
                    placeholder="e.g. Civil Construction, Electrical"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                  />
                  {isMutationError && errors?.errors?.workType && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.errors.workType}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Display Order
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={status}
                    onChange={(e) => setStatus(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                  >
                    <option value={1}>Active</option>
                    <option value={0}>Inactive</option>
                  </select>
                  {isMutationError && errors?.errors?.status && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.errors.status}
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-8">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl cursor-pointer border border-slate-200 font-medium text-slate-600 hover:bg-slate-50 transition-all"
                >
                  Discard
                </button>
                <button
                  disabled={createworkPending}
                  onClick={handleSubmit}
                  className="flex-1 flex items-center justify-center gap-2 cursor-pointer px-4 py-2.5 rounded-xl bg-[#2563EB] text-white font-medium hover:bg-blue-700 shadow-md shadow-blue-200 transition-all disabled:opacity-50"
                >
                  {createworkPending ? (
                    "Saving..."
                  ) : (
                    <>
                      <FiSave />
                      <span>Save Work Type</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* update Modal */}
      <AnimatePresence>
        {showEditModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="bg-white w-[450px] p-6 rounded-2xl shadow-xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Edit Work Type</h2>
                <FiX
                  className="cursor-pointer text-slate-400 hover:text-red-500"
                  onClick={closeAndReset}
                />
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Work Type Name
                  </label>
                  <input
                    type="text"
                    value={isFetchingSingle ? "Loading..." : workType}
                    onChange={(e) => setWorkType(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-blue-500"
                  />
                  {errors?.errors?.workType && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.errors.workType[0]}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none"
                  >
                    <option value={1}>Active</option>
                    <option value={0}>Inactive</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button
                  onClick={closeAndReset}
                  className="flex-1 border border-zinc-200 py-2.5 rounded-xl hover:bg-zinc-50"
                >
                  Cancel
                </button>
                <button
                  disabled={updatePending}
                  onClick={handleUpdate}
                  className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl hover:bg-blue-700 disabled:opacity-50"
                >
                  {updatePending ? "Updating..." : "Update"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default page;
