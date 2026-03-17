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
  const [name, setName] = useState("");
  const [errors, setErrors] = useState({});

  // for get work type
  const fetchPermission = async () => {
    const res = await api.get("/public/api/master/permission");
    return res.data.data;
  };

  const {
    data = [],
    isError,
    isPending,
  } = useQuery({
    queryKey: ["permission"],
    queryFn: fetchPermission,
  });

  //   for post permission
  const createPermission = async (data) => {
    const res = await api.post("/public/api/master/permission", data);
    return res.data.data;
  };

  const {
    mutate,
    isError: isMutationError,
    isPending: permissionPending,
  } = useMutation({
    mutationFn: createPermission,
    onSuccess: () => {
      toast.success("Permission Add Successful!");
      setName("");
      setShowModal(false);
      queryClient.invalidateQueries(["permission"]);
    },
    onError: (error) => {
      setErrors(error.response?.data || {});
    },
  });

  const handleSubmit = () => {
    mutate({
      name,
    });
  };

  //   for delete work type
  const destroyworktype = async (id) => {
    const res = await api.delete(`/public/api/master/permission/${id}`);
    return res.data;
  };

  const { mutate: deleteWorkMutate } = useMutation({
    mutationFn: destroyworktype,
    onSuccess: () => {
      toast.success("Permission deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["permission"] });
    },
    onError: (error) => {
      toast.error("Delete failed");
      console.log("Delete error:", error.response?.data);
    },
  });

  //   for update show data in modal ui
  const { data: editData, isFetching: isFetchingSingle } = useQuery({
    queryKey: ["permission-single", selectedId],
    queryFn: async () => {
      const res = await api.get(`/public/api/master/permission/${selectedId}`);
      return res.data.data;
    },
    enabled: !!selectedId && showEditModal,
    keepPreviousData: false,
  });

  useEffect(() => {
    if (editData && showEditModal) {
      setName(editData.name || "");
    }
  }, [editData, showEditModal]);

  //   for update modal ui
  const {
    mutate: updateWorkMutate,
    isError: updateError,
    isPending: updatePending,
  } = useMutation({
    mutationFn: async ({ id, payload }) => {
      const res = await api.put(`/public/api/master/permission/${id}`, payload);
      return res.data.data;
    },
    onSuccess: () => {
      toast.success("Permission updated successfully!");
      closeAndReset();
      queryClient.invalidateQueries(["permission"]);
    },
    onError: (err) => {
      setErrors(err.response?.data || {});
    },
  });

  const handleUpdate = () => {
    updateWorkMutate({
      id: selectedId,
      payload: { name: name.trim() },
    });
  };

  const closeAndReset = () => {
    setShowEditModal(false);
    setSelectedId(null);
    setName("");
    setErrors({});
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);

    return date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      //   hour: "2-digit",
      //   minute: "2-digit",
      //   hour12: true,
    });
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
            Permission Configuration
          </h1>
          <p className="text-sm text-[#64748B]">
            Set permissions to manage who can view, edit, or delete work types
            within the system.
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
              <th className="px-6 py-4 text-xs font-bold">Permission Name</th>
              <th className="px-6 py-4 text-xs font-bold">Date</th>
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
                    {item.name}
                  </td>

                  <td className="px-6 py-4 font-medium text-center">
                    {formatDateTime(item.created_at)}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex justify-center items-center gap-3">
                      {/* <button
                        onClick={() => handleToggle(item.id)}
                        className={`w-10 h-5 flex items-center rounded-full p-0.5 cursor-pointer transition-all duration-300 ${
                          item.status === 1
                            ? "bg-blue-500 justify-end"
                            : "bg-gray-300 justify-start"
                        }`}
                      >
                        <div className="w-5 h-4 bg-white rounded-full shadow-md"></div>
                      </button> */}
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

      {/* Modal add new permission */}
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
                  Add New Permission
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
                    htmlFor="name"
                    className="block text-sm font-semibold text-slate-700 mb-2"
                  >
                    Permission Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Civil Construction, Electrical"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                  />
                  {isMutationError && errors?.errors?.name && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.errors.name}
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
                  disabled={permissionPending}
                  onClick={handleSubmit}
                  className="flex-1 flex items-center justify-center gap-2 cursor-pointer px-4 py-2.5 rounded-xl bg-[#2563EB] text-white font-medium hover:bg-blue-700 shadow-md shadow-blue-200 transition-all disabled:opacity-50"
                >
                  {permissionPending ? (
                    "Saving..."
                  ) : (
                    <>
                      <FiSave />
                      <span>Save Permission</span>
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
                    Permission Name
                  </label>
                  <input
                    type="text"
                    value={isFetchingSingle ? "Loading..." : name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={isFetchingSingle}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-blue-500"
                  />
                  {updateError && errors?.errors?.name && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.errors.name}
                    </p>
                  )}
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
