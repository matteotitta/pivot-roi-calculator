"use client";

import { Fragment, useEffect, useState } from "react";
import type { CalculationResults } from "@/lib/types";
import { formatCurrencyFull } from "@/lib/calculations";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Lock, CheckCircle } from "lucide-react";

interface Props {
  results: CalculationResults;
  onBack: () => void;
}

export default function SummaryStep({ results, onBack }: Props) {
  const [email, setEmail] = useState("");
  const [gated, setGated] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Auto-open the unlock dialog on mount when content is gated.
  useEffect(() => {
    if (gated) {
      const t = setTimeout(() => setDialogOpen(true), 350);
      return () => clearTimeout(t);
    }
  }, [gated]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.includes("@")) {
      setGated(false);
      setSubmitted(true);
      setDialogOpen(false);
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

      {/* Summary table — wrapped in ScrollArea for mobile */}
      <Card className="p-0 overflow-hidden">
        <ScrollArea className="w-full">
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
                  <TableRow className="bg-pivot-accent hover:bg-pivot-accent">
                    <TableCell
                      colSpan={3}
                      className="px-5 py-2.5 font-semibold text-pivot-text text-xs uppercase tracking-wide"
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
                        gated &&
                          cat.name !== "Procure-to-Pay" &&
                          "blur-sm select-none"
                      )}
                    >
                      {formatCurrencyFull(cat.total.conservative)}
                    </TableCell>
                    <TableCell
                      className={cn(
                        "px-5 text-right tabular-nums",
                        gated &&
                          cat.name !== "Procure-to-Pay" &&
                          "blur-sm select-none"
                      )}
                    >
                      {formatCurrencyFull(cat.total.likely)}
                    </TableCell>
                  </TableRow>
                </Fragment>
              ))}
              {/* Grand total */}
              <TableRow className="bg-pivot-accent hover:bg-pivot-accent font-bold border-t-2 border-pivot-secondary">
                <TableCell className="px-5 py-3.5 text-pivot-text">
                  Total annual savings
                </TableCell>
                <TableCell className="px-5 py-3.5 text-right tabular-nums text-pivot-text">
                  {formatCurrencyFull(results.totalAnnual.conservative)}
                </TableCell>
                <TableCell className="px-5 py-3.5 text-right tabular-nums text-pivot-text font-extrabold">
                  {formatCurrencyFull(results.totalAnnual.likely)}
                </TableCell>
              </TableRow>
              <TableRow className="bg-pivot-accent/70 hover:bg-pivot-accent/70 font-bold">
                <TableCell className="px-5 py-3.5 text-pivot-text">
                  3-year cumulative value
                </TableCell>
                <TableCell className="px-5 py-3.5 text-right tabular-nums text-pivot-text">
                  {formatCurrencyFull(results.threeYear.conservative.cumulative)}
                </TableCell>
                <TableCell className="px-5 py-3.5 text-right tabular-nums text-pivot-text font-extrabold">
                  {formatCurrencyFull(results.threeYear.likely.cumulative)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </ScrollArea>
      </Card>

      {/* Inline reopen prompt while gated */}
      {gated && (
        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={() => setDialogOpen(true)}
          >
            Unlock your full results
          </Button>
        </div>
      )}

      {submitted && !gated && (
        <Alert className="border-pivot-secondary/40 bg-pivot-accent/30">
          <CheckCircle className="text-pivot-text" />
          <AlertTitle className="text-pivot-text">
            Full results unlocked
          </AlertTitle>
          <AlertDescription className="text-pivot-text/70">
            Your personalized report is ready to share or print.
          </AlertDescription>
        </Alert>
      )}

      {/* Email gate dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="size-10 rounded-full bg-pivot-accent flex items-center justify-center mb-1">
              <Lock className="size-4 text-pivot-text" />
            </div>
            <DialogTitle>Unlock your full results</DialogTitle>
            <DialogDescription>
              Enter your work email to reveal Sourcing and Expense Management
              savings — plus a printable summary.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              required
              autoFocus
            />
            <Button type="submit" size="lg" className="w-full">
              Unlock full report
            </Button>
            <p className="text-[11px] text-muted-foreground text-center">
              No spam. Used only to send your report and (optionally) follow up
              with a Pivot specialist.
            </p>
          </form>
        </DialogContent>
      </Dialog>

      {/* CTA */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <Button variant="outline" className="flex-1" onClick={onBack}>
          Back to results
        </Button>
        <Button
          className="flex-1 no-print"
          nativeButton={false}
          render={
            <a
              href="https://www.pivotapp.ai/book-a-demo"
              target="_blank"
              rel="noopener noreferrer"
            />
          }
        >
          Book a demo
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
