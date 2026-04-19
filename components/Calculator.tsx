"use client";

import { useState, useCallback } from "react";
import type { CalculatorInputs, CalculationResults } from "@/lib/types";
import { defaultInputs } from "@/lib/defaults";
import { calculate } from "@/lib/calculations";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { Progress } from "@/components/ui/progress";
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
  const progressPct = ((currentIdx + 1) / steps.length) * 100;

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Progress bar */}
      <div className="max-w-xs mx-auto mb-4 no-print">
        <Progress value={progressPct} />
      </div>

      {/* Progress stepper */}
      <div className="flex items-center justify-center gap-2 mb-8 no-print">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all",
                i <= currentIdx
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              )}
            >
              <span
                className={cn(
                  "size-5 rounded-full flex items-center justify-center text-[10px] font-bold",
                  i < currentIdx
                    ? "bg-foreground text-primary"
                    : i === currentIdx
                      ? "bg-foreground/80 text-primary"
                      : "bg-muted-foreground/20 text-muted-foreground"
                )}
              >
                {i < currentIdx ? <Check className="size-3" /> : i + 1}
              </span>
              <span className="hidden sm:inline">{STEP_LABELS[s]}</span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={cn(
                  "w-8 h-0.5 rounded-full",
                  i < currentIdx ? "bg-primary" : "bg-border"
                )}
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
