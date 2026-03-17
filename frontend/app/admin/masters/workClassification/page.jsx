"use client";
import api from "@/components/Api/privetApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { Edit2, Trash2 } from "lucide-react"; // Icons

const Page = () => {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [status, setStatus] = useState(1);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [deleteMessage, setDeleteMessage] = useState("");

  // **************************************************************************************
  const getDataDepartment = async () => {
    const res = await api.get("/public/api/master/work-classifications");
    console.log("ApiData", res.data);
    return res.data;
  };

  const { data: DepartmentData, isLoading } = useQuery({
    queryKey: ["work-classifications"],
    queryFn: getDataDepartment,
  });

  const getDepartmentById = async (editId) => {
    if (!editId) return null;
    const res = await api.get(
      `/public/api/master/work-classifications/${editId}`,
    );
    return res.data;
  };

  const { data: editDepartment, isFetching } = useQuery({
    queryKey: ["work-classifications", editId],
    queryFn: () => getDepartmentById(editId),
    enabled: !!editId,
  });

  useEffect(() => {
    if (editDepartment) {
      setName(editDepartment["name"]);
      setStatus(editDepartment.status);
      setOpenEditModal(true);
    }
  }, [editDepartment]);

  const updateDepartmentAPI = async ({ id, name, status }) => {
    const res = await api.put(`/public/api/master/work-classifications/${id}`, {
      name,
      status,
    });
    return res.data;
  };

  const updateMutation = useMutation({
    mutationFn: updateDepartmentAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["work-classifications"],
      });

      setOpenEditModal(false);
      setEditId(null);
      setName("");
      setStatus(1);
    },
  });

  const addDepartmentAPI = async ({ name, status }) => {
    const res = await api.post("/public/api/master/work-classifications", {
      name,
      status,
    });
    return res.data;
  };

  const addMutation = useMutation({
    mutationFn: addDepartmentAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["work-classifications"],
      });

      setOpenAddModal(false);
      setName("");
      setStatus(1);
    },
  });

  const deleteDepartmentAPI = async (id) => {
    const res = await api.delete(
      `/public/api/master/work-classifications/${id}`,
    );
    return res.data;
  };

  const deleteMutation = useMutation({
    mutationFn: deleteDepartmentAPI,
    onSuccess: (data) => {
      setDeleteMessage(data.message); // 👈 ADD

      queryClient.invalidateQueries({
        queryKey: ["work-classifications"], // 👈 ensure ye hi ho
      });

      setTimeout(() => {
        setDeleteMessage("");
      }, 3000);
    },
  });

  const handleCancelEdit = () => {
    setOpenEditModal(false);
    setEditId(null);
    setName("");
    setStatus(1);
  };

  const handleUpdate = () => {
    if (!name.trim()) {
      alert("Department name required");
      return;
    }

    updateMutation.mutate({
      id: editId,
      name,
      status,
    });
  };

  // ****************************************************************************************

  // ADD Department
  const handleAdd = () => {
    if (!name.trim()) {
      alert("Department name required");
      return;
    }

    addMutation.mutate({
      name,
      status,
    });

    setName("");
    setStatus(1);
    setOpenAddModal(false);
  };

  // EDIT Department
  // const handleUpdate = () => {
  //   if (!name.trim()) return alert("Department name required");
  //   setDepartments(
  //     departments.map((item) =>
  //       item.id === editId ? { ...item, name, status } : item
  //     )
  //   );
  //   setName("");
  //   setStatus(1);
  //   setEditId(null);
  //   setOpenEditModal(false);
  // };

  const handleEdit = (dept) => {
    setEditId(dept.id);
    // setOpenEditModal(true);
  };

  // DELETE
  const handleDelete = (id) => {
    if (!confirm("Are you sure you want to delete this department?")) return;

    deleteMutation.mutate(id);
  };

  // TOGGLE status
  const handleToggle = (id) => {
    setDepartments(
      departments.map((item) =>
        item.id === id ? { ...item, status: item.status === 1 ? 0 : 1 } : item,
      ),
    );
  };

  return (
    <div className="p-6 mt-18">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Work Classification</h1>

        <button
          onClick={() => {
            setName("");
            setStatus(1);
            setOpenAddModal(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          + Add Work Classification
        </button>
      </div>

      {/* ADD Modal */}
      {openAddModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6 relative">
            <button
              onClick={() => setOpenAddModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-black"
            >
              ✕
            </button>
            <h2 className="text-lg font-medium mb-4">
              Add Work Classification
            </h2>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Work Classification Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 w-full"
              />
              <select
                value={status}
                onChange={(e) => setStatus(Number(e.target.value))}
                className="border border-gray-300 rounded-md px-3 py-2 w-full"
              >
                <option value={1}>Active</option>
                <option value={0}>Inactive</option>
              </select>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setOpenAddModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAdd}
                  disabled={addMutation.isPending}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-60"
                >
                  {addMutation.isPending ? "Adding..." : "Add"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EDIT Modal */}
      {openEditModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md p-6 rounded relative">
            {/* Close Icon */}
            <button
              onClick={handleCancelEdit}
              className="absolute top-3 right-3 text-gray-500 hover:text-black"
            >
              ✕
            </button>

            <h2 className="text-lg mb-4 font-medium">Edit Department</h2>

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border w-full px-3 py-2 rounded mb-4"
              placeholder="Department Name"
            />

            {/* Buttons */}
            <div className="flex justify-end gap-3">
              <button
                onClick={handleCancelEdit}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                onClick={handleUpdate}
                disabled={updateMutation.isPending}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-60"
              >
                {updateMutation.isPending ? "Updating..." : "Update"}
              </button>
            </div>
          </div>
        </div>
      )}
      {deleteMessage && (
        <div className="mb-4 p-3 rounded bg-green-100 text-green-700">
          {deleteMessage}
        </div>
      )}

      {/* TABLE */}
      <div className="bg-white rounded-lg shadow">
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border border-gray-300">S.No</th>
              <th className="px-4 py-2 border border-gray-300">
                Work Classification Name
              </th>
              <th className="px-4 py-2 border border-gray-300">Status</th>
              <th className="px-4 py-2 border border-gray-300">Action</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="4" className="text-center py-4 text-gray-500">
                  Loading departments...
                </td>
              </tr>
            ) : DepartmentData?.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-4 text-gray-500">
                  No departments added
                </td>
              </tr>
            ) : (
              DepartmentData.map((dept, index) => (
                <tr key={dept.id}>
                  <td className="px-4 py-2 border border-gray-300">
                    {index + 1}
                  </td>
                  <td className="px-4 py-2 border border-gray-300">
                    {dept.name}
                  </td>
                  <td className="px-4 py-2 border border-gray-300">
                    <span
                      className={`px-2 py-1 rounded text-sm ${
                        dept.status === 1
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {dept.status === 1 ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-2 border border-gray-300">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(dept)}
                        className="p-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(dept.id)}
                        disabled={deleteMutation.isPending}
                        className="p-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-60"
                      >
                        <Trash2 size={16} />
                      </button>

                      <button
                        onClick={() => handleToggle(dept.id)}
                        className={`w-10 h-5 flex items-center rounded-full p-1 transition-all duration-300 ${
                          dept.status === 1
                            ? "bg-blue-500 justify-end"
                            : "bg-gray-300 justify-start"
                        }`}
                      >
                        <div className="w-4 h-4 bg-white rounded-full shadow-md"></div>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Page;
