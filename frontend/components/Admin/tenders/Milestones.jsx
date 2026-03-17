import React from 'react';

const milestones = [
  { id: 1, title: "Site Clearance & Setup", duration: "2 weeks", status: "pending" },
  { id: 2, title: "Foundation Work", duration: "6 weeks", status: "pending" },
  { id: 3, title: "Structural Framework", duration: "12 weeks", status: "pending" },
  { id: 4, title: "Electrical & Plumbing", duration: "8 weeks", status: "pending" },
  { id: 5, title: "Interior Finishing", duration: "10 weeks", status: "pending" },
  { id: 6, title: "Final Inspection & Handover", duration: "2 weeks", status: "pending" },
];

const Milestones = () => {
  return (
    <div className="bg-white p-8 mt-8 rounded-2xl shadow-sm max-w-5xl mx-auto border border-gray-100">
      <h2 className="text-lg font-bold text-slate-800 mb-6">Project Milestones</h2>
      
      <div className="space-y-4">
        {milestones.map((item) => (
          <div 
            key={item.id} 
            className="flex items-center justify-between p-4 bg-gray-50/50 rounded-xl border border-transparent transition-colors"
          >
            <div className="flex items-center gap-4">

              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-100 text-blue-600 font-bold text-lg">
                {item.id}
              </div>
              
              <div>
                <h3 className="font-semibold text-slate-800">{item.title}</h3>
                <p className="text-gray-600 text-sm">Duration: {item.duration}</p>
              </div>
            </div>

            <div className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full">
              {item.status}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Milestones;