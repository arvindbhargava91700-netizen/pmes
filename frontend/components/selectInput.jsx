"use client";
import { Check, ChevronDown } from "lucide-react";
import React, { useState } from "react";

const SelectInput = ({ options, selected, setSelected }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <div className="relative w-full font-sans">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex cursor-pointer items-center gap-2 text-nowrap
        justify-between bg-[#F1F3F6] border border-transparent rounded-xl
        px-3 py-2.5 text-sm font-medium text-slate-700
        hover:bg-zinc-200 transition-all
        focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <span>{selected}</span>
          <ChevronDown
            size={18}
            className={`text-slate-500 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />

            <div
              className="absolute left-0 top-10 mt-2 bg-white border border-slate-100
          rounded-2xl shadow-xl z-20 p-1.5
          w-max min-w-full
          animate-in fade-in zoom-in duration-150"
            >
              {options.map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    setSelected(option);
                    setIsOpen(false);
                  }}
                  className={`flex items-center gap-3 w-full cursor-pointer mt-0.5 px-3 py-2.5 text-sm rounded-xl
                text-nowrap transition-colors ${
                  selected === option
                    ? "bg-blue-50 text-blue-600 font-semibold"
                    : "text-slate-600 hover:bg-gray-50 font-medium"
                }`}
                >
                  {selected === option && (
                    <Check size={16} className="text-blue-600" />
                  )}
                  <span>{option}</span>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SelectInput;
