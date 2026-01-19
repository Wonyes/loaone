"use client";

import { InputHTMLAttributes, KeyboardEvent, forwardRef } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  onSearch?: () => void;
  showSearchButton?: boolean;
  onEnter?: () => void;
  containerClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      onEnter,
      onSearch,
      showSearchButton = false,
      className,
      containerClassName,
      ...props
    },
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
      <div
        className={cn(
          "relative flex w-full items-center gap-4 rounded-xl border border-emerald-500/20 bg-slate-900/60 px-4 py-2",
          containerClassName
        )}
      >
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
          className={cn(
            "w-full origin-left scale-90 text-base text-white transition-colors focus:border-emerald-500/50 focus:outline-none",
            className
          )}
          style={{ width: "133.33%" }}
          {...props}
          onKeyDown={handleKeyDown}
        />
      </div>
    );
  }
);

Input.displayName = "Input";
