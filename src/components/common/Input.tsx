"use client";

import { InputHTMLAttributes, KeyboardEvent, forwardRef } from "react";
import { Search } from "lucide-react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  onSearch?: () => void;
  showSearchButton?: boolean;
  onEnter?: () => void;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { onEnter, onSearch, showSearchButton = false, className = "", ...props },
    ref
  ) => {
    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && onEnter) {
        e.preventDefault();
        onEnter();
      }
      props.onKeyDown?.(e);
    };
    return (
      <div className="relative flex w-full items-center gap-4 rounded-xl border border-emerald-500/20 bg-slate-900/60 px-4 py-2">
        {showSearchButton && onSearch && (
          <button
            onClick={onSearch}
            type="button"
            className="cursor-pointer rounded-lg"
          >
            <Search className="h-5 w-5 text-white/50" />
          </button>
        )}
        <input
          ref={ref}
          className={`w-full text-[12px] text-white transition-colors focus:border-emerald-500/50 focus:outline-none ${className}`}
          {...props}
          onKeyDown={handleKeyDown}
        />
      </div>
    );
  }
);

Input.displayName = "Input";
