"use client";

import { useState } from "react";
import type { CalculatorInputs } from "@/lib/types";
import { inputSections } from "@/lib/defaults";
import InputField from "./InputField";

interface Props {
  inputs: CalculatorInputs;
  onInputChange: (key: string, value: number) => void;
  onCalculate: () => void;
}

export default function InputStep({ inputs, onInputChange, onCalculate }: Props) {
  const [openSections, setOpenSections] = useState<Set<string>>(
    new Set(["spend"]),
  );

  const toggleSection = (id: string) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="space-y-4">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-pivot-text">
          Enter your procurement metrics
        </h2>
        <p className="text-sm text-pivot-text/60 mt-2">
          Fields are pre-filled with industry averages. Adjust to match your
          organization.
        </p>
      </div>

      {inputSections.map((section) => {
        const isOpen = openSections.has(section.id);
        return (
          <div
            key={section.id}
            className="border border-pivot-text/10 rounded-xl overflow-hidden"
          >
            <button
              type="button"
              onClick={() => toggleSection(section.id)}
              className="w-full flex items-center justify-between px-5 py-4 bg-white hover:bg-pivot-accent/20 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{section.icon}</span>
                <span className="font-semibold text-pivot-text">
                  {section.title}
                </span>
                <span className="text-xs text-pivot-text/40">
                  {section.fields.length} fields
                </span>
              </div>
              <svg
                className={`w-5 h-5 text-pivot-text/40 transition-transform ${isOpen ? "rotate-180" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {isOpen && (
              <div className="px-5 pb-5 pt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {section.fields.map((field) => (
                  <InputField
                    key={field.key}
                    config={field}
                    value={inputs[field.key]}
                    onChange={onInputChange}
                  />
                ))}
              </div>
            )}
          </div>
        );
      })}

      <div className="pt-4">
        <button
          type="button"
          onClick={onCalculate}
          className="w-full py-3.5 rounded-lg bg-pivot-primary text-pivot-text font-semibold text-base transition-all hover:brightness-95 active:scale-[0.99]"
          style={{
            boxShadow:
              "rgba(62, 62, 58, 0.4) 0px 1px 2px 0px, rgba(210, 228, 1, 0.76) 0px 0px 0px 1px",
          }}
        >
          Calculate my ROI →
        </button>
      </div>
    </div>
  );
}
