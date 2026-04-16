"use client";

import { Fragment, useState } from "react";
import type { CalculationResults } from "@/lib/types";
import { formatCurrencyFull } from "@/lib/calculations";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { ArrowLeft, ExternalLink, Lock, CheckCircle } from "lucide-react";

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

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-foreground">
          Your ROI summary
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Detailed breakdown of projected savings with Pivot
        </p>
      </div>

      {/* Summary table */}
      <Card className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-pivot-dark hover:bg-pivot-dark">
              <TableHead className="text-pivot-dark-text font-semibold px-5">
                Savings driver
              </TableHead>
              <TableHead className="text-pivot-dark-text font-semibold text-right px-5">
                Conservative
              </TableHead>
              <TableHead className="text-pivot-dark-text font-semibold text-right px-5">
                Likely
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((cat) => (
              <Fragment key={cat.name}>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableCell
                    colSpan={3}
                    className="px-5 py-2 font-semibold text-foreground text-xs uppercase tracking-wide"
                  >
                    {cat.name}
                  </TableCell>
                </TableRow>
                {cat.items.map((item) => {
                  const blurred = gated && cat.name !== "Procure-to-Pay";
                  return (
                    <TableRow key={item.label}>
                      <TableCell className="px-5 text-muted-foreground">
                        {item.label}
                      </TableCell>
                      <TableCell
                        className={cn(
                          "px-5 text-right tabular-nums text-foreground/60",
                          blurred && "blur-sm select-none"
                        )}
                      >
                        {formatCurrencyFull(item.values.conservative)}
                      </TableCell>
                      <TableCell
                        className={cn(
                          "px-5 text-right tabular-nums font-medium text-foreground",
                          blurred && "blur-sm select-none"
                        )}
                      >
                        {formatCurrencyFull(item.values.likely)}
                      </TableCell>
                    </TableRow>
                  );
                })}
                <TableRow className="border-t-2 font-semibold">
                  <TableCell className="px-5">{cat.name} total</TableCell>
                  <TableCell
                    className={cn(
                      "px-5 text-right tabular-nums",
                      gated && cat.name !== "Procure-to-Pay" && "blur-sm select-none"
                    )}
                  >
                    {formatCurrencyFull(cat.total.conservative)}
                  </TableCell>
                  <TableCell
                    className={cn(
                      "px-5 text-right tabular-nums",
                      gated && cat.name !== "Procure-to-Pay" && "blur-sm select-none"
                    )}
                  >
                    {formatCurrencyFull(cat.total.likely)}
                  </TableCell>
                </TableRow>
              </Fragment>
            ))}
            {/* Grand total */}
            <TableRow className="bg-pivot-dark hover:bg-pivot-dark font-bold">
              <TableCell className="px-5 py-3 text-pivot-dark-text">Total annual savings</TableCell>
              <TableCell className="px-5 py-3 text-right tabular-nums text-pivot-dark-text">
                {formatCurrencyFull(results.totalAnnual.conservative)}
              </TableCell>
              <TableCell className="px-5 py-3 text-right tabular-nums text-pivot-primary">
                {formatCurrencyFull(results.totalAnnual.likely)}
              </TableCell>
            </TableRow>
            <TableRow className="bg-pivot-dark/80 hover:bg-pivot-dark/80 font-bold">
              <TableCell className="px-5 py-3 text-pivot-dark-text">3-year cumulative value</TableCell>
              <TableCell className="px-5 py-3 text-right tabular-nums text-pivot-dark-text">
                {formatCurrencyFull(results.threeYear.conservative.cumulative)}
              </TableCell>
              <TableCell className="px-5 py-3 text-right tabular-nums text-pivot-primary">
                {formatCurrencyFull(results.threeYear.likely.cumulative)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Card>

      {/* Email gate */}
      {gated && (
        <Card className="border-ring/30 bg-accent/20">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-2">
              <Lock className="size-5 text-muted-foreground" />
            </div>
            <CardTitle>Unlock your full results</CardTitle>
            <CardDescription>
              Enter your email to see the complete breakdown across all categories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex gap-2 max-w-md mx-auto">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="flex-1"
                required
              />
              <Button type="submit">
                Unlock
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {submitted && !gated && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="flex items-center justify-center gap-2 py-3">
            <CheckCircle className="size-4 text-green-600" />
            <p className="text-sm text-green-700 font-medium">
              Full results unlocked. Your personalized report is ready.
            </p>
          </CardContent>
        </Card>
      )}

      {/* CTA */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <Button variant="outline" className="flex-1" onClick={onBack}>
          <ArrowLeft data-icon="inline-start" />
          Back to results
        </Button>
        <Button className="flex-1 no-print" nativeButton={false} render={<a href="https://www.pivotapp.ai/book-a-demo" target="_blank" rel="noopener noreferrer" />}>
          Book a demo
          <ExternalLink data-icon="inline-end" />
        </Button>
      </div>

      {/* Source note */}
      <p className="text-xs text-muted-foreground/60 text-center pt-4">
        Benchmarks sourced from Aberdeen Group, Hackett Group, Ardent Partners,
        ACFE, and Deloitte. Results are projections based on your inputs and may
        vary.
      </p>
    </div>
  );
}
