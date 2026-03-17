import React from "react";

const Legend = ({ color, text }) => {
  return (
    <div className="flex items-center gap-2">
      <span className={`w-2 h-2 rounded-full ${color}`} />
      <span>{text}</span>
    </div>
  );
};

export default Legend;
