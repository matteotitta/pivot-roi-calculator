"use client";

import type { CalculatorInputs } from "@/lib/types";
import { inputSections } from "@/lib/defaults";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import InputField from "./InputField";

interface Props {
  inputs: CalculatorInputs;
  onInputChange: (key: string, value: number) => void;
  onCalculate: () => void;
}

export default function InputStep({ inputs, onInputChange, onCalculate }: Props) {
  return (
    <div className="flex flex-col gap-4">
      <div className="text-center mb-4">
        <h2 className="text-2xl font-semibold text-foreground">
          Enter your procurement metrics
        </h2>
        <p className="text-sm text-muted-foreground mt-2">
          Fields are pre-filled with industry averages. Adjust to match your
          organization.
        </p>
      </div>

      <Card className="p-0 shadow-md border-foreground/10 bg-muted/20">
        <Accordion defaultValue={["spend"]}>
          {inputSections.map((section) => (
            <AccordionItem key={section.id} value={section.id}>
              <AccordionTrigger className="px-5 py-4 hover:no-underline hover:bg-accent/30">
                <div className="flex items-center gap-3">
                  <span className="text-lg">{section.icon}</span>
                  <span className="font-semibold text-foreground">
                    {section.title}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {section.fields.length} fields
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-5 pb-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {section.fields.map((field) => (
                    <InputField
                      key={field.key}
                      config={field}
                      value={inputs[field.key]}
                      onChange={onInputChange}
                    />
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Card>

      <div className="pt-4">
        <Button
          size="lg"
          className="w-full py-6 text-base font-semibold"
          onClick={onCalculate}
        >
          Calculate my ROI
        </Button>
      </div>
    </div>
  );
}
