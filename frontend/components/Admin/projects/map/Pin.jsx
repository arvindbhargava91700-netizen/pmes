import React from "react";
import { FaMapMarkerAlt } from "react-icons/fa";

const Pin = ({ x, y, color, active, onClick }) => {
  return (
    <div
      className="absolute cursor-pointer"
      style={{ left: x, top: y }}
      onClick={onClick}
    >
      <div
        className={`w-8 h-8 ${color} text-white rounded-full flex items-center justify-center ${
          active ? "ring-4 ring-blue-300" : ""
        }`}
      >
        <FaMapMarkerAlt />
      </div>
    </div>
  );
};

export default Pin;
