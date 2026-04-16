"use client";

import { useState, useCallback } from "react";
import type { InputFieldConfig } from "@/lib/types";

interface Props {
  config: InputFieldConfig;
  value: number;
  onChange: (key: string, value: number) => void;
}

export default function InputField({ config, value, onChange }: Props) {
  const [focused, setFocused] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const formatDisplay = useCallback(
    (v: number) => {
      if (config.type === "currency") {
        return new Intl.NumberFormat("en-US").format(v);
      }
      return String(v);
    },
    [config.type],
  );

  const [displayValue, setDisplayValue] = useState(formatDisplay(value));

  const handleFocus = () => {
    setFocused(true);
    setDisplayValue(String(value));
  };

  const handleBlur = () => {
    setFocused(false);
    const parsed = parseFloat(displayValue.replace(/[^0-9.-]/g, ""));
    const num = isNaN(parsed) ? 0 : parsed;
    onChange(config.key, num);
    setDisplayValue(formatDisplay(num));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDisplayValue(e.target.value);
  };

  const prefix = config.type === "currency" ? "$" : "";
  const suffix = config.type === "percent" ? "%" : "";

  return (
    <div className="group">
      <div className="flex items-center gap-1.5 mb-1.5">
        <label className="text-sm font-medium text-pivot-text/80">
          {config.label}
          {config.required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
        {config.tooltip && (
          <div className="relative">
            <button
              type="button"
              className="w-4 h-4 rounded-full bg-pivot-text/10 text-pivot-text/50 text-[10px] flex items-center justify-center hover:bg-pivot-text/20 transition-colors"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              onClick={() => setShowTooltip(!showTooltip)}
            >
              ?
            </button>
            {showTooltip && (
              <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-pivot-dark text-pivot-dark-text text-xs rounded-lg shadow-lg">
                <p>{config.tooltip}</p>
                {config.benchmark && (
                  <p className="mt-1.5 text-pivot-primary/80 font-medium">
                    Benchmark: {config.benchmark}
                  </p>
                )}
                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 w-2 h-2 bg-pivot-dark rotate-45" />
              </div>
            )}
          </div>
        )}
      </div>
      <div
        className={`flex items-center rounded-lg border transition-all ${
          focused
            ? "border-pivot-primary ring-2 ring-pivot-primary/30"
            : "border-pivot-text/15 hover:border-pivot-text/30"
        } bg-white`}
      >
        {prefix && (
          <span className="pl-3 text-sm text-pivot-text/40 select-none">
            {prefix}
          </span>
        )}
        <input
          type="text"
          inputMode="decimal"
          value={displayValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={`w-full py-2.5 ${prefix ? "pl-1" : "pl-3"} ${suffix ? "pr-1" : "pr-3"} text-sm bg-transparent outline-none text-pivot-text`}
        />
        {suffix && (
          <span className="pr-3 text-sm text-pivot-text/40 select-none">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}
