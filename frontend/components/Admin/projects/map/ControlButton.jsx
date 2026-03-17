import React from "react";

const ControlButton = ({ icon }) => {
  return (
    <div>
      <button className="w-9 h-9 bg-white text-zinc-600 rounded-lg shadow-sm cursor-pointer flex items-center justify-center hover:bg-gray-100 active:scale-95 transition">
        {icon}
      </button>
    </div>
  );
};

export default ControlButton;
