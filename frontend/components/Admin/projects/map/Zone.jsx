import React from "react";

const Zone = ({ label, className }) => {
  return (
    <div
      className={`absolute w-72 h-40 border-2 border-dashed rounded-lg ${className}`}
    >
      <span className="absolute -top-3 left-4 bg-white px-2 text-xs">
        {label}
      </span>
    </div>
  );
};

export default Zone;
