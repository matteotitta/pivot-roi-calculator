"use client";

import { useState, useCallback, useEffect } from "react";
import type { InputFieldConfig } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Slider } from "@/components/ui/slider";

interface Props {
  config: InputFieldConfig;
  value: number;
  onChange: (key: string, value: number) => void;
}

export default function InputField({ config, value, onChange }: Props) {
  const [focused, setFocused] = useState(false);

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

  useEffect(() => {
    if (!focused) setDisplayValue(formatDisplay(value));
  }, [value, focused, formatDisplay]);

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

  const isPercent = config.type === "percent";
  const sliderMin = config.min ?? 0;
  const sliderMax = config.max ?? 100;
  const sliderStep = config.step ?? 1;
  const clampedValue = Math.max(sliderMin, Math.min(sliderMax, value));

  return (
    <div className="group">
      <div className="flex items-center gap-1.5 mb-1.5">
        <label className="text-sm font-medium text-foreground/80">
          {config.label}
          {config.required && <span className="text-destructive ml-0.5">*</span>}
        </label>
        {config.tooltip && (
          <Tooltip>
            <TooltipTrigger
              className="size-4 rounded-full bg-muted text-muted-foreground text-[10px] inline-flex items-center justify-center hover:bg-muted-foreground/20 transition-colors"
            >
              <Info className="size-2.5" />
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-xs">
              <p>{config.tooltip}</p>
              {config.benchmark && (
                <p className="mt-1.5 text-primary font-medium">
                  Benchmark: {config.benchmark}
                </p>
              )}
            </TooltipContent>
          </Tooltip>
        )}
      </div>
      <div
        className={cn(
          "flex items-center rounded-lg border transition-all bg-background",
          focused
            ? "border-ring ring-3 ring-ring/50"
            : "border-input hover:border-foreground/30"
        )}
      >
        {prefix && (
          <span className="pl-3 text-sm text-muted-foreground select-none">
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
          className={cn(
            "w-full py-2.5 text-sm bg-transparent outline-none text-foreground",
            prefix ? "pl-1" : "pl-3",
            suffix ? "pr-1" : "pr-3"
          )}
        />
        {suffix && (
          <span className="pr-3 text-sm text-muted-foreground select-none">
            {suffix}
          </span>
        )}
      </div>
      {isPercent && (
        <div className="px-1 pt-3">
          <Slider
            value={[clampedValue]}
            onValueChange={(v) =>
              onChange(config.key, Array.isArray(v) ? v[0] : v)
            }
            min={sliderMin}
            max={sliderMax}
            step={sliderStep}
            aria-label={config.label}
          />
          <div className="flex justify-between text-[10px] text-muted-foreground/60 mt-1.5 tabular-nums">
            <span>{sliderMin}%</span>
            <span>{sliderMax}%</span>
          </div>
        </div>
      )}
    </div>
  );
}
