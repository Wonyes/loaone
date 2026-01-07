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
      // 기존 onKeyDown도 실행
      props.onKeyDown?.(e);
    };
    return (
      <div className="relative w-full">
        <input
          ref={ref}
          className={`w-full rounded-xl border border-emerald-500/20 bg-slate-900/60 px-6 py-4 text-white transition-colors focus:border-emerald-500/50 focus:outline-none ${className}`}
          {...props}
          onKeyDown={handleKeyDown}
        />
        {showSearchButton && onSearch && (
          <button
            onClick={onSearch}
            type="button"
            className="absolute top-1/2 right-2 -translate-y-1/2 rounded-lg bg-emerald-500 px-6 py-2 transition-colors hover:bg-emerald-600"
          >
            <Search className="h-5 w-5" />
          </button>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
