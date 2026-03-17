"use client";
import api from "@/components/Api/privetApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { FiPlus, FiEdit2, FiTrash2, FiMenu, FiSave, FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const StatusMasterPage = () => {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [color, setColor] = useState("#2563EB");
  const [sort_order, setSort_order] = useState("");
  const [errors, setErrors] = useState({});
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);

  // for get table data
  const fetchStatus = async () => {
    const res = await api.get("/public/api/master/tender_status");
    return res.data.data;
  };

  const {
    data = [],
    isPending,
    isError,
  } = useQuery({
    queryKey: ["statusGet"],
    queryFn: fetchStatus,
  });

  // for post data in modal
  const postStatus = async (data) => {
    const res = await api.post("/public/api/master/tender_status", data);
    return res.data.data;
  };

  const {
    mutate,
    isError: postStatusError,
    isPending: postStatusPending,
  } = useMutation({
    mutationFn: postStatus,
    onSuccess: () => {
      toast.success("Add Status Successful!");
      queryClient.invalidateQueries({ queryKey: ["statusGet"] });
      setName("");
      setColor("");
      setSort_order("");
      setShowModal(false);
    },
    onError: (errror) => {
      console.log("API Error", errror.response?.data);
      setErrors(errror?.response?.data);
    },
  });

  const handleSubmit = () => {
    mutate({
      name,
      color,
      sort_order,
    });
  };

  // for delete data in ui
  const deleteStatus = async (id) => {
    const res = await api.delete(`/public/api/master/tender_status/${id}`);
    return res.data;
  };

  const { mutate: deleteStatusMutate } = useMutation({
    mutationFn: deleteStatus,
    onSuccess: () => {
      toast.success("Status deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["statusGet"] });
    },
    onError: (error) => {
      toast.error("Delete failed");
      console.log("Delete error:", error.response?.data);
    },
  });

  // for update data in modal
  const updateStatus = async ({ id, data }) => {
    const res = await api.put(`/public/api/master/tender_status/${id}`, data);
    return res.data;
  };

  const { mutate: updateStatusMutate, isPending: updatePending } = useMutation({
    mutationFn: updateStatus,
    onSuccess: () => {
      toast.success("Status updated successfully");
      queryClient.invalidateQueries({ queryKey: ["statusGet"] });
      setShowEditModal(false);
    },
    onError: (error) => {
      toast.error("Update failed");
      setErrors(error?.response?.data);
    },
  });

  if (isPending) return <p className="p-8 mt-10">Loading...</p>;
  if (isError)
    return <p className="p-8 text-red-500 mt-10">Error loading data</p>;

  return (
    <div className="p-8 mt-10 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]">
            Status Configuration
          </h1>
          <p className="text-sm text-[#64748B]">
            Define tender stages, colors, and their display order
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 cursor-pointer bg-[#2563EB] text-white px-5 py-2.5 rounded-xl font-medium"
        >
          <FiPlus /> Add New Status
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-300 overflow-hidden">
        <table className="w-full">
          <thead className="bg-zinc-200">
            <tr>
              <th className="px-6 py-4 text-xs font-bold">S.No</th>
              <th className="px-6 py-4 text-xs font-bold">Status</th>
              <th className="px-6 py-4 text-xs font-bold">Color</th>
              <th className="px-6 py-4 text-xs font-bold">Sort Order</th>
              <th className="px-6 py-4 text-xs font-bold text-right">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {data.map((item, index) => (
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
                  {item.name}
                </td>

                <td className="px-6 py-4 flex justify-center items-center">
                  <div className="flex items-center gap-2">
                    <code
                      className={`text-xs p-1 px-3 rounded-lg`}
                      style={{ backgroundColor: item.color }}
                    >
                      {item.color}
                    </code>
                  </div>
                </td>

                <td className="px-6 py-4 font-medium text-center">
                  {item.sort_order}
                </td>

                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => {
                        setSelectedStatus(item);
                        setName(item.name);
                        setColor(item.color);
                        setSort_order(item.sort_order);
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
                            "Are you sure you want to delete this status?"
                          )
                        ) {
                          deleteStatusMutate(item.id);
                        }
                      }}
                      className="p-2 hover:bg-zinc-200 text-slate-400 cursor-pointer hover:text-red-600 rounded-lg transition-all"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal add new status */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="bg-white `w-[450px]` rounded-2xl shadow-2xl p-6 border border-slate-200"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-slate-900">
                  Configure Status
                </h2>
                <FiX
                  className="cursor-pointer text-slate-400 hover:bg-zinc-300 h-7 w-7 rounded-md hover:text-blue-500 p-1"
                  onClick={() => setShowModal(false)}
                />
              </div>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Status Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                    }}
                    placeholder="e.g. Technical Evaluation"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                  />
                  {postStatusError && errors?.errors?.name && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.errors.name}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Theme Color
                    </label>
                    <div className="flex items-center gap-2 border border-slate-200 rounded-xl px-3 py-1.5">
                      <input
                        type="color"
                        id="color"
                        name="color"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        className="w-8 h-8 rounded cursor-pointer bg-transparent"
                      />
                      <span className="text-sm font-mono text-slate-500 uppercase">
                        HEX Code
                      </span>
                    </div>
                    {postStatusError && errors?.errors?.color && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.errors.color}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Sort Order
                    </label>
                    <input
                      type="number"
                      id="sort_order"
                      name="sort_order"
                      value={sort_order}
                      onChange={(e) => {
                        setSort_order(e.target.value);
                      }}
                      placeholder="1"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                    />
                    {postStatusError && errors?.errors?.sort_order && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.errors.sort_order}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-8">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 font-medium text-slate-600 hover:bg-slate-50 transition-all"
                >
                  Discard
                </button>
                <button
                  disabled={postStatusPending}
                  onClick={handleSubmit}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#2563EB] text-white font-medium hover:bg-blue-700 shadow-md shadow-blue-200 transition-all"
                >
                  {postStatusPending ? (
                    "Saving..."
                  ) : (
                    <>
                      <FiSave />
                      <span>Save Status</span>
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
            transition={{ duration: 1 }}
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="bg-white `w-[450px]` p-6 rounded-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-slate-900">
                  Edit Status
                </h2>
                <FiX
                  className="cursor-pointer text-slate-400 hover:bg-zinc-300 h-7 w-7 rounded-md hover:text-blue-500 p-1"
                  onClick={() => setShowEditModal(false)}
                />
              </div>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Status Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                    }}
                    placeholder="e.g. Technical Evaluation"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                  />
                  {postStatusError && errors?.errors?.name && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.errors.name}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Theme Color
                    </label>
                    <div className="flex items-center gap-2 border border-slate-200 rounded-xl px-3 py-1.5">
                      <input
                        type="color"
                        id="color"
                        name="color"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        className="w-8 h-8 rounded cursor-pointer bg-transparent"
                      />
                      <span className="text-sm font-mono text-slate-500 uppercase">
                        HEX Code
                      </span>
                    </div>
                    {postStatusError && errors?.errors?.color && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.errors.color}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Sort Order
                    </label>
                    <input
                      type="number"
                      id="sort_order"
                      name="sort_order"
                      value={sort_order}
                      onChange={(e) => {
                        setSort_order(e.target.value);
                      }}
                      placeholder="1"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                    />
                    {postStatusError && errors?.errors?.sort_order && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.errors.sort_order}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 border border-zinc-200 p-2 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  disabled={updatePending}
                  onClick={() =>
                    updateStatusMutate({
                      id: selectedStatus.id,
                      data: { name, color, sort_order },
                    })
                  }
                  className="flex-1 bg-blue-600 text-white p-2 rounded-xl cursor-pointer"
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

export default StatusMasterPage;
