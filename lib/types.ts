export interface CalculatorInputs {
  // Spend Data
  annualAddressableSpend: number;
  spendUnderManagement: number;
  annualSpendGrowthRate: number;
  preferredSupplierSavings: number;
  activeSuppliers: number;
  budgetOverspend: number;
  earlyPaymentDiscountSpend: number;
  earlyPaymentDiscountRate: number;
  poBasedSpend: number;
  daysPayablesOutstanding: number;

  // Process Data
  annualPOs: number;
  reqToPoCostPerPO: number;
  reqToPoCycleTime: number;
  annualInvoices: number;
  apFTEs: number;
  invoiceProcessingCost: number;
  invoiceProcessingCycleTime: number;
  activeContracts: number;
  activeCatalogs: number;

  // Sourcing Data
  sourcingFTEs: number;
  avgLoadedCostPerFTE: number;
  spendThroughPreferred: number;
  yearlyNewVendors: number;
  hoursToOnboardVendor: number;
  fullyLoadedHourlyCost: number;

  // Expense Management
  annualExpenseReports: number;
  costPerExpenseReport: number;
  expenseFraudErrorRate: number;
  annualTESpend: number;
  annualLatePaymentCharges: number;
  annualLegacySystemCosts: number;
}

export type Scenario = "conservative" | "likely";

export interface ScenarioValues {
  conservative: number;
  likely: number;
}

export interface LineItem {
  label: string;
  values: ScenarioValues;
}

export interface CategoryResult {
  name: string;
  items: LineItem[];
  total: ScenarioValues;
}

export interface CalculationResults {
  p2p: CategoryResult;
  sourcing: CategoryResult;
  expenses: CategoryResult;
  totalAnnual: ScenarioValues;
  threeYear: {
    conservative: { year1: number; year2: number; year3: number; cumulative: number };
    likely: { year1: number; year2: number; year3: number; cumulative: number };
  };
}

export interface InputFieldConfig {
  key: keyof CalculatorInputs;
  label: string;
  type: "currency" | "percent" | "number";
  required?: boolean;
  tooltip?: string;
  benchmark?: string;
  /** Slider min (only used when type === "percent"). Defaults to 0. */
  min?: number;
  /** Slider max (only used when type === "percent"). Defaults to 100. */
  max?: number;
  /** Slider step (only used when type === "percent"). Defaults to 1. */
  step?: number;
}

export interface InputSection {
  id: string;
  title: string;
  icon: string;
  fields: InputFieldConfig[];
}
