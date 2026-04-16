import type { CalculatorInputs, InputSection } from "./types";

export const defaultInputs: CalculatorInputs = {
  // Spend Data
  annualAddressableSpend: 11_700_000,
  spendUnderManagement: 35,
  annualSpendGrowthRate: 3,
  preferredSupplierSavings: 10,
  activeSuppliers: 10_000,
  budgetOverspend: 1,
  earlyPaymentDiscountSpend: 5,
  earlyPaymentDiscountRate: 2,
  poBasedSpend: 20,
  daysPayablesOutstanding: 45,

  // Process Data
  annualPOs: 100_000,
  reqToPoCostPerPO: 30,
  reqToPoCycleTime: 3,
  annualInvoices: 3_000,
  apFTEs: 20,
  invoiceProcessingCost: 10,
  invoiceProcessingCycleTime: 5,
  activeContracts: 500,
  activeCatalogs: 20,

  // Sourcing Data
  sourcingFTEs: 150,
  avgLoadedCostPerFTE: 60_000,
  spendThroughPreferred: 40,
  yearlyNewVendors: 150,
  hoursToOnboardVendor: 10,
  fullyLoadedHourlyCost: 30,

  // Expense Management
  annualExpenseReports: 5_000,
  costPerExpenseReport: 28,
  expenseFraudErrorRate: 0.5,
  annualTESpend: 500_000,
  annualLatePaymentCharges: 10_000,
  annualLegacySystemCosts: 50_000,
};

export const inputSections: InputSection[] = [
  {
    id: "spend",
    title: "Spend data",
    icon: "💰",
    fields: [
      { key: "annualAddressableSpend", label: "Annual addressable spend", type: "currency", required: true, tooltip: "Total spend managed through Procurement (excl. rent, wages, direct materials)", benchmark: "40-70% of total company spend" },
      { key: "spendUnderManagement", label: "Spend under management", type: "percent", required: true, tooltip: "% of spend with Procurement oversight", benchmark: "Best: 85%+ / Avg: ~55% / Laggard: <35%" },
      { key: "annualSpendGrowthRate", label: "Annual spend growth rate", type: "percent", tooltip: "Expected YoY addressable spend growth" },
      { key: "preferredSupplierSavings", label: "Preferred supplier savings", type: "percent", tooltip: "Avg savings from preferred supplier volume discounts", benchmark: "Aberdeen: 5-20%; Hackett: 10%" },
      { key: "activeSuppliers", label: "Number of active suppliers", type: "number", tooltip: "Total active suppliers in your supplier master" },
      { key: "budgetOverspend", label: "Budget overspend (% of spend)", type: "percent", tooltip: "% of spend exceeding budget", benchmark: "Industry norm: 0-10%" },
      { key: "earlyPaymentDiscountSpend", label: "Spend with early payment discount", type: "percent", tooltip: "% of spend with standing early payment discount terms", benchmark: "Typical: 5-10%" },
      { key: "earlyPaymentDiscountRate", label: "Avg early payment discount rate", type: "percent", tooltip: "Typical: 2/10 Net 30 (2% discount if paid within 10 days)" },
      { key: "poBasedSpend", label: "Addressable spend that is PO-based", type: "percent", tooltip: "Share of addressable spend processed through POs", benchmark: "Best: 80%+ / Avg: 50-60%" },
      { key: "daysPayablesOutstanding", label: "Days Payables Outstanding (DPO)", type: "number", tooltip: "Avg days to pay invoices from receipt", benchmark: "Best: 45-60 / Avg: 30-45" },
    ],
  },
  {
    id: "process",
    title: "Process data",
    icon: "⚙️",
    fields: [
      { key: "annualPOs", label: "Annual purchase orders", type: "number", required: true, tooltip: "Total POs processed per year" },
      { key: "reqToPoCostPerPO", label: "Req-to-PO processing cost per PO", type: "currency", required: true, tooltip: "Labor cost per PO (30 min x $60/hr = $30)" },
      { key: "reqToPoCycleTime", label: "Req-to-PO cycle time (days)", type: "number", tooltip: "Calendar days from approved req to issued PO", benchmark: "Best: <1 day / Avg: 3-5 / Laggard: 7+" },
      { key: "annualInvoices", label: "Annual invoices", type: "number", required: true, tooltip: "Total invoices processed/year (typically 2-4x PO count)" },
      { key: "apFTEs", label: "AP FTEs (invoice processing)", type: "number", tooltip: "FTEs on data entry, exceptions, vendor master, payments, reporting" },
      { key: "invoiceProcessingCost", label: "Invoice processing cost per invoice", type: "currency", required: true, tooltip: "Labor cost per invoice", benchmark: "Best: $3.09 / Avg: $15.61 / Laggard: $38.77" },
      { key: "invoiceProcessingCycleTime", label: "Invoice processing cycle time (days)", type: "number", tooltip: "Days to approve an invoice upon receipt" },
      { key: "activeContracts", label: "Number of active contracts", type: "number", tooltip: "Contracts active in last 12 months" },
      { key: "activeCatalogs", label: "Number of active catalogs", type: "number", tooltip: "Catalogs active in last 12 months" },
    ],
  },
  {
    id: "sourcing",
    title: "Sourcing data",
    icon: "🔍",
    fields: [
      { key: "sourcingFTEs", label: "Number of sourcing FTEs", type: "number", tooltip: "Total FTEs in Sourcing / Category Management" },
      { key: "avgLoadedCostPerFTE", label: "Avg annual loaded cost per FTE", type: "currency", tooltip: "Fully-loaded cost (salary + benefits + overhead)" },
      { key: "spendThroughPreferred", label: "Spend sourced through preferred suppliers", type: "percent", tooltip: "Current % of addressable spend with preferred suppliers", benchmark: "Top performers: 70-85%" },
      { key: "yearlyNewVendors", label: "Yearly new vendors onboarded", type: "number", tooltip: "New supplier onboarding events per year" },
      { key: "hoursToOnboardVendor", label: "Hours to onboard a vendor", type: "number", tooltip: "Total cross-functional hours (IT + Compliance + Procurement + Legal)" },
      { key: "fullyLoadedHourlyCost", label: "Fully-loaded hourly cost of staff", type: "currency", tooltip: "Avg hourly loaded cost for staff involved in onboarding" },
    ],
  },
  {
    id: "expenses",
    title: "Expense management",
    icon: "📋",
    fields: [
      { key: "annualExpenseReports", label: "Annual expense reports", type: "number", tooltip: "Total expense reports submitted per year" },
      { key: "costPerExpenseReport", label: "Cost to process one expense report", type: "currency", tooltip: "Fully-loaded cost per report", benchmark: "Aberdeen avg: $28.91" },
      { key: "expenseFraudErrorRate", label: "Expense report fraud / errors (% of spend)", type: "percent", tooltip: "% of T&E spend lost to errors or fraud", benchmark: "ACFE: ~5%" },
      { key: "annualTESpend", label: "Annual T&E spend", type: "currency", tooltip: "Total travel & entertainment spend" },
      { key: "annualLatePaymentCharges", label: "Annual late payment charges", type: "currency", tooltip: "Penalty fees incurred due to late invoice payments" },
      { key: "annualLegacySystemCosts", label: "Annual cost of legacy/current systems", type: "currency", tooltip: "Licenses + maintenance for systems being replaced" },
    ],
  },
];
