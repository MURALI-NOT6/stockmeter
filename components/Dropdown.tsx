"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface DropdownProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  prefix?: string;
}

export default function Dropdown({ options, value, onChange, prefix }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-surface-container border border-outline-variant/30 text-[10px] font-label uppercase text-on-surface px-4 h-[34px] flex items-center gap-4 cursor-pointer hover:bg-surface-container-high transition-colors min-w-[120px] justify-between"
      >
        <span className="flex items-center">
          {prefix && <span className="text-on-surface-variant mr-1">{prefix}:</span>}
          {value}
        </span>
        <ChevronDown
          size={14}
          strokeWidth={3}
          className={`text-on-surface-variant transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 w-full mt-1 bg-surface-container border border-outline-variant/30 z-[100] shadow-2xl">
          {options.map((option) => (
            <div
              key={option}
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
              className={`px-4 py-2 text-[10px] font-label uppercase cursor-pointer transition-colors ${
                value === option
                  ? "bg-primary-container/20 text-primary-container"
                  : "text-on-surface hover:bg-surface-container-high"
              }`}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
