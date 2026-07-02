"use client"

import { useState } from "react";
import { cn } from "../lib/utils";

export interface InputProps {
  className?: string
  placeholder?: string
}

export function AppInput({
  className,
  placeholder = 'Enter name ...'
}: InputProps) {
  const [inputValue, setInputValue] = useState("");

  return (
    <div className={cn('relative w-38 xl:w-52', [className])}>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-[1vw] pr-3 py-2 rounded-3xl bg-gray-800 border border-gray-600 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 text-sm text-white placeholder-gray-400 transition-all duration-200"
      />
    </div>
  );
}