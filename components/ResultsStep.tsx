"use client";

import { useState, useMemo } from "react";
import type { CalculationResults, Scenario } from "@/lib/types";
import { formatCurrencyFull } from "@/lib/calculations";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, ArrowRight } from "lucide-react";
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

const CATEGORY_COLORS = ["#EFFE53", "#2A2A28", "#D4E244"];

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
    <div className="flex flex-col gap-6">
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
        <Tabs
          defaultValue="likely"
          onValueChange={(v) => setScenario(v as Scenario)}
          className="w-auto"
        >
          <TabsList>
            <TabsTrigger value="conservative">Conservative</TabsTrigger>
            <TabsTrigger value="likely">Likely</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Category breakdown */}
      <div className="flex flex-col gap-3">
        <h3 className="text-lg font-semibold text-foreground">
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
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Category split</CardTitle>
          </CardHeader>
          <CardContent>
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
                      border: "1px solid var(--border)",
                      fontSize: "13px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-2">
              {pieData.map((d, i) => (
                <div key={d.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <div
                    className="size-2.5 rounded-full"
                    style={{ backgroundColor: CATEGORY_COLORS[i] }}
                  />
                  {d.name} ({d.pct.toFixed(0)}%)
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Bar chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">3-year projection</CardTitle>
            <p className="text-xs text-muted-foreground">
              Cumulative: {formatCurrencyFull(threeYearTotal)}
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} barCategoryGap="30%">
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis
                    dataKey="year"
                    tick={{ fontSize: 12, fill: "var(--foreground)" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tickFormatter={(v: number) =>
                      v >= 1_000_000 ? `$${(v / 1_000_000).toFixed(1)}M` : `$${(v / 1_000).toFixed(0)}K`
                    }
                    tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                    axisLine={false}
                    tickLine={false}
                    width={60}
                  />
                  <Tooltip
                    formatter={(value) => formatCurrencyFull(Number(value))}
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid var(--border)",
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
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <Button variant="outline" className="flex-1" onClick={onBack}>
          <ArrowLeft data-icon="inline-start" />
          Edit inputs
        </Button>
        <Button className="flex-1" onClick={onViewSummary}>
          View full summary
          <ArrowRight data-icon="inline-end" />
        </Button>
      </div>
    </div>
  );
}
