"use client";

import { useState, useCallback, useMemo } from "react";
import type { CalculatorInputs, CalculationResults } from "@/lib/types";
import { defaultInputs } from "@/lib/defaults";
import { calculate } from "@/lib/calculations";
import InputStep from "./InputStep";
import ResultsStep from "./ResultsStep";
import SummaryStep from "./SummaryStep";

type Step = "inputs" | "results" | "summary";

const STEP_LABELS: Record<Step, string> = {
  inputs: "Your metrics",
  results: "ROI results",
  summary: "Full summary",
};

export default function Calculator() {
  const [step, setStep] = useState<Step>("inputs");
  const [inputs, setInputs] = useState<CalculatorInputs>(defaultInputs);
  const [results, setResults] = useState<CalculationResults | null>(null);

  const handleInputChange = useCallback((key: string, value: number) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleCalculate = useCallback(() => {
    const r = calculate(inputs);
    setResults(r);
    setStep("results");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [inputs]);

  const steps: Step[] = ["inputs", "results", "summary"];
  const currentIdx = steps.indexOf(step);

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Progress stepper */}
      <div className="flex items-center justify-center gap-2 mb-8 no-print">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                i <= currentIdx
                  ? "bg-pivot-primary text-pivot-text"
                  : "bg-gray-100 text-pivot-text/40"
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  i < currentIdx
                    ? "bg-pivot-text text-pivot-primary"
                    : i === currentIdx
                      ? "bg-pivot-text/80 text-pivot-primary"
                      : "bg-gray-200 text-gray-400"
                }`}
              >
                {i < currentIdx ? "✓" : i + 1}
              </span>
              <span className="hidden sm:inline">{STEP_LABELS[s]}</span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={`w-8 h-0.5 ${i < currentIdx ? "bg-pivot-primary" : "bg-gray-200"}`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step content */}
      {step === "inputs" && (
        <InputStep
          inputs={inputs}
          onInputChange={handleInputChange}
          onCalculate={handleCalculate}
        />
      )}
      {step === "results" && results && (
        <ResultsStep
          results={results}
          onBack={() => setStep("inputs")}
          onViewSummary={() => {
            setStep("summary");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      )}
      {step === "summary" && results && (
        <SummaryStep
          results={results}
          onBack={() => setStep("results")}
        />
      )}
    </div>
  );
}
