"use client";

import { useState } from "react";
import type { CategoryResult, Scenario } from "@/lib/types";
import { formatCurrencyFull } from "@/lib/calculations";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { ChevronDown } from "lucide-react";

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
    <Card className="p-0 gap-0">
      <Collapsible open={expanded} onOpenChange={setExpanded}>
        <CollapsibleTrigger className="w-full px-5 py-4 flex items-center justify-between hover:bg-muted/50 transition-colors cursor-pointer">
          <div className="flex items-center gap-3">
            <div
              className="size-3 rounded-full"
              style={{ backgroundColor: color }}
            />
            <div className="text-left">
              <p className="font-semibold text-foreground">{result.name}</p>
              <p className="text-xs text-muted-foreground">
                {result.items.length} savings drivers &middot; {percentage.toFixed(0)}% of
                total
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-lg font-bold text-foreground">
              {formatCurrencyFull(total)}
            </span>
            <ChevronDown
              className={cn(
                "size-4 text-muted-foreground transition-transform",
                expanded && "rotate-180"
              )}
            />
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="px-5 pb-4 border-t">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-xs font-medium h-8">Driver</TableHead>
                  <TableHead className="text-xs font-medium text-right h-8">Conservative</TableHead>
                  <TableHead className="text-xs font-medium text-right h-8">Likely</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {result.items.map((item) => (
                  <TableRow key={item.label} className="hover:bg-transparent">
                    <TableCell className="text-muted-foreground">{item.label}</TableCell>
                    <TableCell className="text-right text-foreground/60 tabular-nums">
                      {formatCurrencyFull(item.values.conservative)}
                    </TableCell>
                    <TableCell className="text-right font-medium text-foreground tabular-nums">
                      {formatCurrencyFull(item.values.likely)}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="border-t-2 font-semibold hover:bg-transparent">
                  <TableCell>Total</TableCell>
                  <TableCell className="text-right tabular-nums">
                    {formatCurrencyFull(result.total.conservative)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {formatCurrencyFull(result.total.likely)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
