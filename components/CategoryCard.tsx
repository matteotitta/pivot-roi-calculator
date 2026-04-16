"use client";

import { useState } from "react";
import type { CategoryResult, Scenario } from "@/lib/types";
import { formatCurrencyFull } from "@/lib/calculations";

interface Props {
  result: CategoryResult;
  scenario: Scenario;
  color: string;
  percentage: number;
}

export default function CategoryCard({ result, scenario, color, percentage }: Props) {
  const [expanded, setExpanded] = useState(false);
  const total = result.total[scenario];

  return (
    <div className="border border-pivot-text/10 rounded-xl overflow-hidden bg-white">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: color }}
          />
          <div className="text-left">
            <p className="font-semibold text-pivot-text">{result.name}</p>
            <p className="text-xs text-pivot-text/50">
              {result.items.length} savings drivers &middot; {percentage.toFixed(0)}% of
              total
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-lg font-bold text-pivot-text">
            {formatCurrencyFull(total)}
          </span>
          <svg
            className={`w-4 h-4 text-pivot-text/40 transition-transform ${expanded ? "rotate-180" : ""}`}
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
        </div>
      </button>
      {expanded && (
        <div className="px-5 pb-4 border-t border-pivot-text/5">
          <table className="w-full text-sm mt-3">
            <thead>
              <tr className="text-pivot-text/50 text-xs">
                <th className="text-left font-medium pb-2">Driver</th>
                <th className="text-right font-medium pb-2">Conservative</th>
                <th className="text-right font-medium pb-2">Likely</th>
              </tr>
            </thead>
            <tbody>
              {result.items.map((item) => (
                <tr
                  key={item.label}
                  className="border-t border-pivot-text/5"
                >
                  <td className="py-2 text-pivot-text/70">{item.label}</td>
                  <td className="py-2 text-right text-pivot-text/60 tabular-nums">
                    {formatCurrencyFull(item.values.conservative)}
                  </td>
                  <td className="py-2 text-right font-medium text-pivot-text tabular-nums">
                    {formatCurrencyFull(item.values.likely)}
                  </td>
                </tr>
              ))}
              <tr className="border-t-2 border-pivot-text/20 font-semibold">
                <td className="py-2">Total</td>
                <td className="py-2 text-right tabular-nums">
                  {formatCurrencyFull(result.total.conservative)}
                </td>
                <td className="py-2 text-right tabular-nums">
                  {formatCurrencyFull(result.total.likely)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
