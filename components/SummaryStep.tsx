"use client";

import { Fragment, useState } from "react";
import type { CalculationResults } from "@/lib/types";
import { formatCurrencyFull } from "@/lib/calculations";

interface Props {
  results: CalculationResults;
  onBack: () => void;
}

export default function SummaryStep({ results, onBack }: Props) {
  const [email, setEmail] = useState("");
  const [gated, setGated] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.includes("@")) {
      setGated(false);
      setSubmitted(true);
    }
  };

  const categories = [
    { ...results.p2p },
    { ...results.sourcing },
    { ...results.expenses },
  ];

  const allItems = categories.flatMap((c) =>
    c.items.map((item) => ({ category: c.name, ...item })),
  );

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-pivot-text">
          Your ROI summary
        </h2>
        <p className="text-sm text-pivot-text/60 mt-1">
          Detailed breakdown of projected savings with Pivot
        </p>
      </div>

      {/* Summary table */}
      <div className="border border-pivot-text/10 rounded-xl overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-pivot-dark text-pivot-dark-text">
                <th className="text-left px-5 py-3 font-semibold">
                  Savings driver
                </th>
                <th className="text-right px-5 py-3 font-semibold">
                  Conservative
                </th>
                <th className="text-right px-5 py-3 font-semibold">Likely</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <Fragment key={cat.name}>
                  <tr className="bg-pivot-accent/30">
                    <td
                      colSpan={3}
                      className="px-5 py-2 font-semibold text-pivot-text text-xs uppercase tracking-wide"
                    >
                      {cat.name}
                    </td>
                  </tr>
                  {cat.items.map((item) => {
                    const blurred = gated && cat.name !== "Procure-to-Pay";
                    return (
                      <tr
                        key={item.label}
                        className="border-t border-pivot-text/5"
                      >
                        <td className="px-5 py-2.5 text-pivot-text/70">
                          {item.label}
                        </td>
                        <td
                          className={`px-5 py-2.5 text-right tabular-nums text-pivot-text/60 ${blurred ? "blur-sm select-none" : ""}`}
                        >
                          {formatCurrencyFull(item.values.conservative)}
                        </td>
                        <td
                          className={`px-5 py-2.5 text-right tabular-nums font-medium text-pivot-text ${blurred ? "blur-sm select-none" : ""}`}
                        >
                          {formatCurrencyFull(item.values.likely)}
                        </td>
                      </tr>
                    );
                  })}
                  <tr
                    className="border-t-2 border-pivot-text/15 font-semibold"
                  >
                    <td className="px-5 py-2.5">{cat.name} total</td>
                    <td
                      className={`px-5 py-2.5 text-right tabular-nums ${gated && cat.name !== "Procure-to-Pay" ? "blur-sm select-none" : ""}`}
                    >
                      {formatCurrencyFull(cat.total.conservative)}
                    </td>
                    <td
                      className={`px-5 py-2.5 text-right tabular-nums ${gated && cat.name !== "Procure-to-Pay" ? "blur-sm select-none" : ""}`}
                    >
                      {formatCurrencyFull(cat.total.likely)}
                    </td>
                  </tr>
                </Fragment>
              ))}
              {/* Grand total */}
              <tr className="bg-pivot-dark text-pivot-dark-text font-bold">
                <td className="px-5 py-3">Total annual savings</td>
                <td className="px-5 py-3 text-right tabular-nums">
                  {formatCurrencyFull(results.totalAnnual.conservative)}
                </td>
                <td className="px-5 py-3 text-right tabular-nums text-pivot-primary">
                  {formatCurrencyFull(results.totalAnnual.likely)}
                </td>
              </tr>
              <tr className="bg-pivot-dark/80 text-pivot-dark-text font-bold">
                <td className="px-5 py-3">3-year cumulative value</td>
                <td className="px-5 py-3 text-right tabular-nums">
                  {formatCurrencyFull(results.threeYear.conservative.cumulative)}
                </td>
                <td className="px-5 py-3 text-right tabular-nums text-pivot-primary">
                  {formatCurrencyFull(results.threeYear.likely.cumulative)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Email gate */}
      {gated && (
        <div className="border border-pivot-primary/50 rounded-xl p-6 bg-pivot-accent/20 text-center">
          <h3 className="text-lg font-semibold text-pivot-text">
            Unlock your full results
          </h3>
          <p className="text-sm text-pivot-text/60 mt-1 mb-4">
            Enter your email to see the complete breakdown across all categories
          </p>
          <form onSubmit={handleSubmit} className="flex gap-2 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="flex-1 px-4 py-2.5 rounded-lg border border-pivot-text/15 text-sm outline-none focus:border-pivot-primary focus:ring-2 focus:ring-pivot-primary/30"
              required
            />
            <button
              type="submit"
              className="px-6 py-2.5 rounded-lg bg-pivot-primary text-pivot-text font-semibold text-sm hover:brightness-95 transition-all"
              style={{
                boxShadow:
                  "rgba(62, 62, 58, 0.4) 0px 1px 2px 0px, rgba(210, 228, 1, 0.76) 0px 0px 0px 1px",
              }}
            >
              Unlock
            </button>
          </form>
        </div>
      )}

      {submitted && !gated && (
        <div className="text-center p-4 bg-green-50 border border-green-200 rounded-xl">
          <p className="text-sm text-green-700 font-medium">
            Full results unlocked. Your personalized report is ready.
          </p>
        </div>
      )}

      {/* CTA */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 py-3 rounded-lg border border-pivot-text/15 text-pivot-text/70 font-medium text-sm hover:bg-gray-50 transition-colors"
        >
          ← Back to results
        </button>
        <a
          href="https://www.pivotapp.ai/request-a-demo"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 py-3 rounded-lg bg-pivot-primary text-pivot-text font-semibold text-sm text-center hover:brightness-95 transition-all no-print"
          style={{
            boxShadow:
              "rgba(62, 62, 58, 0.4) 0px 1px 2px 0px, rgba(210, 228, 1, 0.76) 0px 0px 0px 1px",
          }}
        >
          Book a demo →
        </a>
      </div>

      {/* Source note */}
      <p className="text-xs text-pivot-text/30 text-center pt-4">
        Benchmarks sourced from Aberdeen Group, Hackett Group, Ardent Partners,
        ACFE, and Deloitte. Results are projections based on your inputs and may
        vary.
      </p>
    </div>
  );
}
