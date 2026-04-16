import type { CalculatorInputs, CalculationResults, CategoryResult, LineItem, ScenarioValues } from "./types";

function sv(conservative: number, likely: number): ScenarioValues {
  return { conservative, likely };
}

function li(label: string, conservative: number, likely: number): LineItem {
  return { label, values: sv(conservative, likely) };
}

function sumItems(items: LineItem[]): ScenarioValues {
  return {
    conservative: items.reduce((sum, item) => sum + item.values.conservative, 0),
    likely: items.reduce((sum, item) => sum + item.values.likely, 0),
  };
}

function calcP2P(i: CalculatorInputs): CategoryResult {
  const spend = i.annualAddressableSpend;
  const currentPct = i.spendUnderManagement / 100;
  const savingsPct = i.preferredSupplierSavings / 100;
  const overspendPct = i.budgetOverspend / 100;
  const earlyPct = i.earlyPaymentDiscountSpend / 100;
  const discountRate = i.earlyPaymentDiscountRate / 100;

  const items: LineItem[] = [
    // Spend Effectiveness
    li(
      "Improved spend under management",
      spend * (0.75 - currentPct) * savingsPct,
      spend * (0.85 - currentPct) * savingsPct,
    ),
    li(
      "Reduced budget overspend",
      spend * overspendPct * 0.5,
      spend * overspendPct * 0.75,
    ),
    li(
      "Early payment discount capture",
      spend * earlyPct * discountRate * 0.8,
      spend * earlyPct * discountRate * 0.95,
    ),
    li(
      "Reduced overpayment to suppliers",
      spend * 0.001,
      spend * 0.002,
    ),
    // Process Efficiency
    li(
      "Lower PO processing cost",
      i.annualPOs * i.reqToPoCostPerPO * 0.4,
      i.annualPOs * i.reqToPoCostPerPO * 0.5,
    ),
    li(
      "Lower invoice processing cost",
      i.annualInvoices * (i.invoiceProcessingCost - 3.09),
      i.annualInvoices * (i.invoiceProcessingCost - 5),
    ),
    li(
      "Improved vendor onboarding",
      i.yearlyNewVendors * i.hoursToOnboardVendor * i.fullyLoadedHourlyCost * 0.3,
      i.yearlyNewVendors * i.hoursToOnboardVendor * i.fullyLoadedHourlyCost * 0.5,
    ),
  ];

  return { name: "Procure-to-Pay", items, total: sumItems(items) };
}

function calcSourcing(i: CalculatorInputs): CategoryResult {
  const spend = i.annualAddressableSpend;
  const currentPreferred = i.spendThroughPreferred / 100;
  const savingsPct = i.preferredSupplierSavings / 100;

  const items: LineItem[] = [
    li(
      "Higher savings from preferred suppliers",
      spend * (0.5 - currentPreferred) * savingsPct,
      spend * (0.55 - currentPreferred) * savingsPct,
    ),
    li(
      "Sourcing team efficiency",
      i.sourcingFTEs * i.avgLoadedCostPerFTE * 0.1,
      i.sourcingFTEs * i.avgLoadedCostPerFTE * 0.15,
    ),
  ];

  return { name: "Sourcing", items, total: sumItems(items) };
}

function calcExpenses(i: CalculatorInputs): CategoryResult {
  const fraudRate = i.expenseFraudErrorRate / 100;

  const items: LineItem[] = [
    li(
      "Lower expense report processing",
      i.annualExpenseReports * (i.costPerExpenseReport - 8),
      i.annualExpenseReports * (i.costPerExpenseReport - 5),
    ),
    li(
      "Fraud & error reduction",
      i.annualTESpend * fraudRate * 0.5,
      i.annualTESpend * fraudRate * 0.75,
    ),
    li(
      "Eliminate late payment charges",
      i.annualLatePaymentCharges,
      i.annualLatePaymentCharges,
    ),
    li(
      "Eliminate legacy system costs",
      i.annualLegacySystemCosts,
      i.annualLegacySystemCosts,
    ),
  ];

  return { name: "Expense Management", items, total: sumItems(items) };
}

export function calculate(inputs: CalculatorInputs): CalculationResults {
  const p2p = calcP2P(inputs);
  const sourcing = calcSourcing(inputs);
  const expenses = calcExpenses(inputs);

  const totalAnnual = sv(
    p2p.total.conservative + sourcing.total.conservative + expenses.total.conservative,
    p2p.total.likely + sourcing.total.likely + expenses.total.likely,
  );

  const growthRate = inputs.annualSpendGrowthRate / 100;

  const threeYear = {
    conservative: {
      year1: totalAnnual.conservative,
      year2: totalAnnual.conservative * (1 + growthRate),
      year3: totalAnnual.conservative * (1 + growthRate) ** 2,
      cumulative: 0,
    },
    likely: {
      year1: totalAnnual.likely,
      year2: totalAnnual.likely * (1 + growthRate),
      year3: totalAnnual.likely * (1 + growthRate) ** 2,
      cumulative: 0,
    },
  };

  threeYear.conservative.cumulative =
    threeYear.conservative.year1 + threeYear.conservative.year2 + threeYear.conservative.year3;
  threeYear.likely.cumulative =
    threeYear.likely.year1 + threeYear.likely.year2 + threeYear.likely.year3;

  return { p2p, sourcing, expenses, totalAnnual, threeYear };
}

export function formatCurrency(value: number): string {
  if (Math.abs(value) >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(1)}M`;
  }
  if (Math.abs(value) >= 1_000) {
    return `$${(value / 1_000).toFixed(0)}K`;
  }
  return `$${value.toFixed(0)}`;
}

export function formatCurrencyFull(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}
