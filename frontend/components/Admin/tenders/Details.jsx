import React from "react";

const Details = () => {
  return (
    <div className="py-7 font-sans text-slate-700">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="md:col-span-2 space-y-6">

          <div className="bg-white p-5 rounded-2xl border border-gray-100">
            <h2 className="text-lg font-semibold mb-3">Description</h2>
            <p className="text-gray-500 leading-relaxed">
              Construction of a multi-purpose community center with auditorium,
              meeting rooms, and recreational facilities in Ward 15.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-100">
            <h2 className="text-lg font-semibold mb-3">Timeline</h2>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-gray-400 text-sm mb-1">Start Date</p>
                <p className="font-semibold text-lg">3/1/2024</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">End Date</p>
                <p className="font-semibold text-lg">2/28/2025</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Duration</p>
                <p className="font-semibold text-lg">12 months</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-gray-100">
          <h2 className="text-lg font-semibold mb-6">Tender Information</h2>
          <div className="space-y-5">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Department</span>
              <span className="font-semibold text-right">Buildings</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Work Type</span>
              <span className="font-semibold text-right">Construction</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">EMD Amount</span>
              <span className="font-semibold text-right">₹4.5 L</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Publish Date</span>
              <span className="font-semibold text-right">1/10/2024</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Details;
