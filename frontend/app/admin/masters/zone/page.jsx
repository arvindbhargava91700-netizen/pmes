"use client";
import React, { useState } from "react";
import { FiPlus, FiX, FiEdit, FiTrash2 } from "react-icons/fi";
import { HexColorPicker } from "react-colorful";
import api from "@/components/Api/privetApi";
import { useQuery } from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const Page = () => {
  const [addName, setAddName] = useState(""); // Status name
  const [addOrder, setAddOrder] = useState("");
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const addColorRef = React.useRef(null);
  const editColorRef = React.useRef(null);
  const [addColor, setAddColor] = useState("#2563EB"); // default blue
  const [showAddPicker, setShowAddPicker] = useState(false);
  const queryClient = useQueryClient();
  const [editData, setEditData] = useState({
    name: "",
    color: "#000000",
    order: "",
  });

  // dummy table data
  const statuses = [
    {
      id: 1,
      name: "Awarded",
      color: "#000000",
      order: 2,
    },
  ];

  // for get table data
  const fetchStatus = async () => {
    const res = await api.get("/public/api/master/zones");
    console.log("ApiData", res.data);
    return res.data;
  };

  const {
    data: fetchStatusData,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["zones"],
    queryFn: fetchStatus,
  });

  //   **********************************************adddata*****************************

  const addStatusMutation = useMutation({
    mutationFn: async (newStatus) => {
      return await api.post("/public/api/master/zones", newStatus);
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["zones"] }); // v5
      setOpenAddModal(false);
      setAddName("");
      setAddOrder("");
      setAddColor("#2563EB");
      setShowAddPicker(false);

      toast.success(res.data.message || "Zone added successfully");
    },
    onError: (err) => {
      console.log("Error:", err);
      toast.error("Failed to add status");
    },
  });

  // ********************************* UPDATE STATUS ********************************
  const updateStatusAPI = async ({ id, name, color, order }) => {
    const res = await api.put(`/public/api/master/zones/${id}`, {
      name,
      color,
      order,
    });
    return res.data;
  };

  const updateStatusMutation = useMutation({
    mutationFn: updateStatusAPI,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["zones"] }); // refresh table
      setOpenEditModal(false);
      toast.success(res.message || "Status updated successfully");
      // Reset editData
      setEditData({ id: "", name: "", color: "#000000", order: "" });
    },
    onError: (err) => {
      console.log("Update Error:", err);
      toast.error("Failed to update status");
    },
  });

  // *************************************************************************************

  const deleteStatusAPI = async (id) => {
    const res = await api.delete(`/public/api/master/zones/${id}`);
    return res.data;
  };

  const deleteStatusMutation = useMutation({
    mutationFn: deleteStatusAPI,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["zones"] });
      toast.success(res.message || "Status deleted successfully");
    },
    onError: (err) => {
      console.log("Delete Error:", err);
      toast.error("Failed to delete status");
    },
  });

  const handleDelete = (id) => {
    if (!confirm("Are you sure you want to delete this status?")) return;

    deleteStatusMutation.mutate(id);
  };

  const handleEdit = (status) => {
    setEditData({
      id: status.id, // add this line!
      name: status.name,
      color: status.color,
      order: status.order,
    });
    setOpenEditModal(true);
  };

  return (
    <div className=" px-6 bg-[#eef3f9] min-h-screen">
      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-center mb-6 mt-18">
        <div className="">
          <h1 className="text-2xl font-semibold">Status Configuration</h1>
          <p className="text-sm text-gray-500">
            Define tender stages, colors, and their display order
          </p>
        </div>

        <button
          onClick={() => setOpenAddModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          <FiPlus /> Add New Status
        </button>
      </div>

      {/* ================= TABLE ================= */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 text-sm">
            <tr>
              <th className="px-4 py-3 text-left">S.No</th>
              <th className="px-4 py-3 text-left">Status</th>
              {/* <th className="px-4 py-3 text-left">Color</th>
              <th className="px-4 py-3 text-left">Sort Order</th> */}
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {isPending ? (
              <tr>
                <td colSpan={3} className="text-center py-8">
                  Loading...
                </td>
              </tr>
            ) : (
              fetchStatusData?.map((item, index) => (
                <tr key={item.id} className="border-t border-gray-300 ">
                  <td className="px-4 py-4">{index + 1}</td>
                  <td className="px-4 py-4 font-medium">{item.name}</td>
                  {/* <td className="px-4 py-4"> */}
                  {/* <div className="flex items-center gap-2"> */}
                  {/* <span
            className="w-5 h-5 rounded"
            style={{ background: item.color }}
          ></span>
          {item.color}
        </div> */}
                  {/* </td> */}
                  {/* <td className="px-4 py-4">{item.order}</td> */}
                  <td className="px-4 py-4">
                    <div className="flex justify-center gap-4">
                      <FiEdit
                        className="text-blue-600 cursor-pointer"
                        onClick={() => handleEdit(item)}
                      />
                      <FiTrash2
                        className={`cursor-pointer ${
                          deleteStatusMutation.isLoading
                            ? "text-gray-400"
                            : "text-red-500"
                        }`}
                        onClick={() => handleDelete(item.id)}
                      />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ================= ADD MODAL ================= */}

      {openAddModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white `w-[440px]` rounded-2xl p-6 relative">
            <button
              onClick={() => setOpenAddModal(false)}
              className="absolute top-4 right-4"
            >
              <FiX />
            </button>

            <h2 className="text-xl font-semibold mb-6">Configure Status</h2>

            <input
              placeholder="Status Name"
              value={addName} // <-- bind state
              onChange={(e) => setAddName(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-4"
            />

            <div className="grid grid-cols-2 gap-4 mb-6">
              {/* Theme Color */}
              <div className="relative">
                <label className="text-sm mb-1 block">Theme Color</label>

                <div className="flex items-center gap-3 mb-2">
                  {/* Color box */}
                  <div
                    className="w-8 h-8 rounded border cursor-pointer"
                    style={{ backgroundColor: addColor }}
                    onClick={() => setShowAddPicker(!showAddPicker)}
                  ></div>
                  <span className="text-sm text-gray-500 uppercase">
                    {addColor}
                  </span>
                </div>
                {/* Inline color picker */}
                {showAddPicker && (
                  <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 z-50">
                    <HexColorPicker color={addColor} onChange={setAddColor} />
                  </div>
                )}
              </div>

              {/* Sort Order */}
              <div>
                <label className="text-sm">Sort Order</label>
                <input
                  type="number"
                  value={addOrder} // <-- bind state
                  onChange={(e) => setAddOrder(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setOpenAddModal(false)}
                className="w-1/2 border border-gray-300 rounded-xl py-3"
              >
                Discard
              </button>
              <button
                disabled={addStatusMutation.isLoading}
                className={`w-1/2 rounded-xl py-3 ${
                  addStatusMutation.isLoading
                    ? "bg-gray-400"
                    : "bg-blue-600 text-white"
                }`}
                onClick={() =>
                  addStatusMutation.mutate({
                    name: addName,
                    color: addColor,
                    order: Number(addOrder),
                  })
                }
              >
                {addStatusMutation.isLoading ? "Saving..." : "Save Status"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= EDIT MODAL ================= */}
      {openEditModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white `w-[440px]` rounded-2xl p-6 relative">
            {/* Close button */}
            <button
              onClick={() => setOpenEditModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <FiX size={20} />
            </button>

            {/* Modal Title */}
            <h2 className="text-xl font-semibold mb-6">Edit Status</h2>

            {/* Status Name */}
            <div className="mb-4">
              <label className="text-sm font-medium mb-1 block">
                Status Name
              </label>
              <input
                type="text"
                value={editData.name}
                onChange={(e) =>
                  setEditData({ ...editData, name: e.target.value })
                }
                className="w-full border border-gray-300 rounded-xl px-4 py-3"
              />
            </div>

            {/* Theme Color + Sort Order */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {/* Theme Color */}
              <div className="relative">
                <label className="text-sm font-medium mb-1 block">
                  Theme Color
                </label>
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded border cursor-pointer"
                    style={{ backgroundColor: editData.color }}
                    onClick={() => editColorRef.current.click()}
                  ></div>
                  <span className="text-sm text-gray-500 uppercase">
                    {editData.color}
                  </span>
                </div>
                <input
                  type="color"
                  ref={editColorRef}
                  value={editData.color}
                  onChange={(e) =>
                    setEditData({ ...editData, color: e.target.value })
                  }
                  className="hidden"
                />
              </div>

              {/* Sort Order */}
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Sort Order
                </label>
                <input
                  type="number"
                  value={editData.order}
                  onChange={(e) =>
                    setEditData({ ...editData, order: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-xl px-4 py-3"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4">
              <button
                onClick={() => setOpenEditModal(false)}
                className="w-1/2 border border-gray-300 rounded-xl py-3 text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (!editData.name.trim())
                    return toast.error("Name required");

                  updateStatusMutation.mutate({
                    id: editData.id,
                    name: editData.name,
                    color: editData.color,
                    order: Number(editData.order),
                  });
                }}
                className="w-1/2 bg-blue-600 text-white rounded-xl py-3 hover:bg-blue-700"
              >
                {updateStatusMutation.isLoading ? "Updating..." : "Update"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
