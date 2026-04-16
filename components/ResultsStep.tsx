"use client";

import { useState, useMemo } from "react";
import type { CalculationResults, Scenario } from "@/lib/types";
import { formatCurrencyFull } from "@/lib/calculations";
import AnimatedNumber from "./AnimatedNumber";
import CategoryCard from "./CategoryCard";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from "recharts";

interface Props {
  results: CalculationResults;
  onBack: () => void;
  onViewSummary: () => void;
}

const CATEGORY_COLORS = ["#EFFE53", "#D4E244", "#A8B832"];

export default function ResultsStep({ results, onBack, onViewSummary }: Props) {
  const [scenario, setScenario] = useState<Scenario>("likely");

  const pieData = useMemo(() => {
    const total = results.totalAnnual[scenario];
    return [
      { name: "P2P", value: results.p2p.total[scenario], pct: (results.p2p.total[scenario] / total) * 100 },
      { name: "Sourcing", value: results.sourcing.total[scenario], pct: (results.sourcing.total[scenario] / total) * 100 },
      { name: "Expenses", value: results.expenses.total[scenario], pct: (results.expenses.total[scenario] / total) * 100 },
    ];
  }, [results, scenario]);

  const barData = useMemo(() => {
    const ty = results.threeYear[scenario];
    return [
      { year: "Year 1", value: ty.year1 },
      { year: "Year 2", value: ty.year2 },
      { year: "Year 3", value: ty.year3 },
    ];
  }, [results, scenario]);

  const threeYearTotal = results.threeYear[scenario].cumulative;

  return (
    <div className="space-y-6">
      {/* Hero metric */}
      <div className="text-center py-6 bg-pivot-dark rounded-2xl">
        <p className="text-sm font-medium text-pivot-dark-text/60 uppercase tracking-wide">
          Projected annual savings
        </p>
        <AnimatedNumber
          value={results.totalAnnual[scenario]}
          className="block text-4xl sm:text-5xl font-bold text-pivot-primary mt-2"
        />
        <p className="text-sm text-pivot-dark-text/40 mt-2">
          {scenario === "conservative" ? "Conservative" : "Likely"} scenario
        </p>
      </div>

      {/* Scenario toggle */}
      <div className="flex justify-center">
        <div className="inline-flex rounded-lg border border-pivot-text/15 p-0.5 bg-gray-50">
          {(["conservative", "likely"] as Scenario[]).map((s) => (
            <button
              key={s}
              onClick={() => setScenario(s)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                scenario === s
                  ? "bg-pivot-primary text-pivot-text shadow-sm"
                  : "text-pivot-text/60 hover:text-pivot-text"
              }`}
            >
              {s === "conservative" ? "Conservative" : "Likely"}
            </button>
          ))}
        </div>
      </div>

      {/* Category breakdown */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-pivot-text">
          Savings by category
        </h3>
        {[results.p2p, results.sourcing, results.expenses].map(
          (cat, idx) => (
            <CategoryCard
              key={cat.name}
              result={cat}
              scenario={scenario}
              color={CATEGORY_COLORS[idx]}
              percentage={
                (cat.total[scenario] / results.totalAnnual[scenario]) * 100
              }
            />
          ),
        )}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pie chart */}
        <div className="border border-pivot-text/10 rounded-xl p-5 bg-white">
          <h4 className="text-sm font-semibold text-pivot-text mb-3">
            Category split
          </h4>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  dataKey="value"
                  strokeWidth={2}
                  stroke="#FFFFFF"
                >
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={CATEGORY_COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => formatCurrencyFull(Number(value))}
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid #e5e5e5",
                    fontSize: "13px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-2">
            {pieData.map((d, i) => (
              <div key={d.name} className="flex items-center gap-1.5 text-xs text-pivot-text/60">
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: CATEGORY_COLORS[i] }}
                />
                {d.name} ({d.pct.toFixed(0)}%)
              </div>
            ))}
          </div>
        </div>

        {/* Bar chart */}
        <div className="border border-pivot-text/10 rounded-xl p-5 bg-white">
          <h4 className="text-sm font-semibold text-pivot-text mb-1">
            3-year projection
          </h4>
          <p className="text-xs text-pivot-text/50 mb-3">
            Cumulative: {formatCurrencyFull(threeYearTotal)}
          </p>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} barCategoryGap="30%">
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                <XAxis
                  dataKey="year"
                  tick={{ fontSize: 12, fill: "#1B1B18" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tickFormatter={(v: number) =>
                    v >= 1_000_000 ? `$${(v / 1_000_000).toFixed(1)}M` : `$${(v / 1_000).toFixed(0)}K`
                  }
                  tick={{ fontSize: 11, fill: "#999" }}
                  axisLine={false}
                  tickLine={false}
                  width={60}
                />
                <Tooltip
                  formatter={(value) => formatCurrencyFull(Number(value))}
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid #e5e5e5",
                    fontSize: "13px",
                  }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {barData.map((_, i) => (
                    <Cell key={i} fill={i === 2 ? "#EFFE53" : "#D4E244"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 py-3 rounded-lg border border-pivot-text/15 text-pivot-text/70 font-medium text-sm hover:bg-gray-50 transition-colors"
        >
          ← Edit inputs
        </button>
        <button
          type="button"
          onClick={onViewSummary}
          className="flex-1 py-3 rounded-lg bg-pivot-primary text-pivot-text font-semibold text-sm transition-all hover:brightness-95"
          style={{
            boxShadow:
              "rgba(62, 62, 58, 0.4) 0px 1px 2px 0px, rgba(210, 228, 1, 0.76) 0px 0px 0px 1px",
          }}
        >
          View full summary →
        </button>
      </div>
    </div>
  );
}
