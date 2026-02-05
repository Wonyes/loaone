"use client";

import { InputHTMLAttributes, KeyboardEvent, forwardRef } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  onSearch?: () => void;
  showSearchButton?: boolean;
  onEnter?: () => void;
  containerClassName?: string;
  name?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      name,
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
          "group relative flex w-full items-center overflow-hidden rounded-2xl bg-white/[0.03] shadow-[0_4px_12px_rgba(0,0,0,0.2),0_2px_4px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.08)] transition-all duration-300",
          "focus-within:bg-white/[0.05] focus-within:shadow-[0_6px_16px_rgba(0,0,0,0.25),0_3px_6px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.1)]",
          containerClassName
        )}
      >
        <div className="flex w-full items-center gap-3 px-4 py-2.5">
          {showSearchButton && onSearch ? (
            <button
              onClick={onSearch}
              type="button"
              className="shrink-0 text-slate-500 transition-colors hover:text-emerald-500"
            >
              <Search className="h-4 w-4" />
            </button>
          ) : (
            <Search className="h-4 w-4 shrink-0 text-slate-600 transition-colors group-focus-within:text-emerald-500/70" />
          )}

          <div className="relative flex-1">
            <input
              name={name}
              ref={ref}
              className={cn(
                "block w-[133%] origin-left text-[15px] font-medium text-white transition-all outline-none placeholder:text-slate-500 focus:placeholder:text-slate-500",
                "scale-90 opacity-90 group-focus-within:opacity-100",
                className
              )}
              {...props}
              onKeyDown={handleKeyDown}
            />
          </div>
        </div>
      </div>
    );
  }
);

Input.displayName = "Input";
