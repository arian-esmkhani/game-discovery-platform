"use client"

import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "../lib/utils";

export interface SearchProps {
  className?: string
  placeholder?: string
  delay?: number;
  value?: string;
  onChange?: (value: string) => void;
}

export default function SearchLabel({
  className,
  placeholder = 'search ...',
  value = "",
  onChange,
  delay = 300
}: SearchProps) {
  const [query, setQuery] = useState(value);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  useEffect(() => {
    if (onChange) {
      const timeoutId = setTimeout(() => {
        onChange(query);
      }, delay);
      
      return () => clearTimeout(timeoutId);
    }
  }, [query, onChange, delay]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleClear = () => {
    setQuery("");
    if (onChange) onChange("");
  };

  return (
    <div className=" text-white">
      <div className={cn('relative w-38 xl:w-52 mb-9', [className])}>
        <Search className="absolute left-2 top-2.5 text-cyan-300 w-4.5 h-4.5" />
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-2 rounded-3xl bg-gray-800/70 border border-gray-700 focus:border-cyan-400 focus:ring-1 text-sm text-gray-200 placeholder-gray-500 transition-all duration-300"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-2 top-2.5 text-gray-400 hover:text-gray-300 transition-colors"
            type="button"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}
