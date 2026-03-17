"use client";
import React, { useEffect, useRef, useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import { Globe } from "lucide-react";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState("English");

  const languages = ["English", "हिंदी"];

  //   const toggleDropdown = () => setIsOpen(!isOpen);

  const selectLanguage = (lang) => {
    setLanguage(lang);
    setIsOpen(false);
    console.log("Selected Language:", lang);
  };

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  return (
    <div className="bg-gradient-to-r font-semibold from-slate-900 to-slate-800 text-white text-sm md:px-10 px-7 py-2 flex justify-between items-center">
      <div className="flex items-center">
        भारत सरकार | Government of India{" "}
        <span className="md:block hidden">
          {" "}
          &nbsp;<span className="font-extrabold">•</span> नगर निगम मेरठ |
          Municipal Corporation Meerut
        </span>
      </div>
      <div className="flex items-center gap-3">
        <span>
          <Globe className="w-5 h-5 text-white" />
        </span>
        <div className="relative inline-block text-left" ref={dropdownRef}>
          {/* Dropdown Button */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 cursor-pointer p-1 px-4 border border-zinc-100 rounded-lg transition-colors"
          >
            <span>{language}</span>
            <FiChevronDown
              className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
            />
          </button>

          {/* Dropdown Menu */}
          {isOpen && (
            <div className="absolute left-0 mt-2 w-32 origin-top-left bg-white border border-zinc-200 rounded-lg shadow-lg z-50">
              <div className="p-1">
                {languages.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => {
                      selectLanguage(lang);
                      setIsOpen(false);
                    }}
                    className={`block w-full text-left px-4 py-2 rounded-lg cursor-pointer text-sm hover:bg-blue-50 hover:text-blue-500 font-semibold text-zinc-600`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
