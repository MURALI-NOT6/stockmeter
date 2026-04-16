"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { ChevronDown, Search } from "lucide-react";

interface DropdownProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  prefix?: string;
  width?: string;
  disabled?: boolean;
}

export default function Dropdown({ 
  options, 
  value, 
  onChange, 
  prefix, 
  width = "120px",
  disabled = false 
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Clear search and focus input when dropdown opens
  useEffect(() => {
    if (isOpen) {
      setSearchQuery("");
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [isOpen]);

  const filteredOptions = useMemo(() => {
    if (!searchQuery) return options;
    return options.filter((opt) =>
      opt.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [options, searchQuery]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => !disabled && setIsOpen(!isOpen)}
        style={{ width }}
        disabled={disabled}
        className={`bg-surface-container border border-outline-variant/30 text-[10px] font-label uppercase text-on-surface px-4 h-[34px] flex items-center gap-2 transition-colors justify-between overflow-hidden relative z-10 ${
          disabled 
            ? "opacity-40 cursor-not-allowed" 
            : "cursor-pointer hover:bg-surface-container-high"
        }`}
      >
        <span className="flex items-center truncate">
          {prefix && <span className="text-on-surface-variant mr-1 shrink-0">{prefix}:</span>}
          <span className="truncate">{value}</span>
        </span>
        {!disabled && (
          <ChevronDown
            size={14}
            strokeWidth={3}
            className={`text-on-surface-variant transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        )}
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 w-full mt-1 bg-surface-container border border-outline-variant/30 z-[100] shadow-2xl flex flex-col min-w-[160px]">
          {/* Search Input Area */}
          <div className="sticky top-0 bg-surface-container p-2 border-b border-outline-variant/20 z-10">
            <div className="relative flex items-center">
              <Search size={10} className="absolute left-2 text-on-surface-variant opacity-50" />
              <input
                ref={inputRef}
                type="text"
                placeholder="SEARCH..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-background/40 border border-outline-variant/10 text-[9px] font-label uppercase text-on-surface pl-6 pr-2 py-1.5 focus:outline-none focus:border-primary-container/40 transition-colors placeholder:text-on-surface-variant/30"
              />
            </div>
          </div>

          {/* Options List */}
          <div className="max-h-[240px] overflow-y-auto scrollbar-thin scrollbar-thumb-outline-variant/30">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
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
              ))
            ) : (
              <div className="px-4 py-3 text-[9px] font-label uppercase text-on-surface-variant/50 italic text-center">
                No matching leads
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
