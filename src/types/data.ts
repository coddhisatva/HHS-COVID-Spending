/**
 * Enumeration for the different financial activity types
 */
export enum FinancialActivityType {
  ALLOCATION = 'allocation',
  DEALLOCATION = 'deallocation',
  ALL = 'all'
}

/**
 * Enumeration for the different financial transaction types 
 */
export enum TransactionType {
  ALL = 'all',
  COMMITMENT = 'commitment',
  PAYMENT = 'payment'
}

/**
 * Enumeration for data source types
 */
export enum DataSourceType {
  ALL = 'all',
  CONTRACTS = 'contracts',
  FINANCIAL_ASSISTANCE = 'financial_assistance'
}

/**
 * Emergency funding act types
 */
export type EmergencyFundingAct = 
  | 'CARES Act'
  | 'American Rescue Plan'
  | 'COVID-19 Supplemental'
  | 'Paycheck Protection Program'
  | 'Families First Coronavirus Response Act'
  | 'Other'
  | 'None';

/**
 * Financial record data structure
 */
export interface FinancialRecord {
  id: string;
  source: 'contracts' | 'assistance';
  recipient: string;
  recipientState: string; // Two-letter state code
  program: string;
  objectClass?: string;
  emergencyFunding: EmergencyFundingAct;
  obligationAmount: number; // Can be positive (allocation) or negative (deallocation)
  outlay: number; // Actual payment made
  date: string; // ISO date string
  fiscalYear: number;
  fiscalPeriod: number;
}

/**
 * Geographic data structure for state-level aggregations
 */
export interface GeoData {
  state: string; // Two-letter state code
  stateName: string;
  allocations: number;
  deallocations: number;
  outlays: number;
  programCount: number;
  recipientCount: number;
}

/**
 * Summary metrics data structure
 */
export interface SummaryMetrics {
  totalAllocations: number;
  totalDeallocations: number;
  totalOutlays: number;
  totalRecipients: number;
  totalPrograms: number;
  totalStates: number;
}

/**
 * Data for the emergency funding pie chart
 */
export interface EmergencyFundingChartData {
  name: EmergencyFundingAct;
  value: number;
  color: string;
}

/**
 * Data for the top recipients/programs bar chart
 */
export interface BarChartData {
  name: string;
  value: number;
}

/**
 * State of filter selections
 */
export interface FilterState {
  activityType: FinancialActivityType;
  transactionType: TransactionType;
  dataSource: DataSourceType;
  emergencyFunding: EmergencyFundingAct[];
  states: string[];
  recipients: string[];
  programs: string[];
  dateRange: [Date | null, Date | null];
}

/**
 * Application data state
 */
export interface AppDataState {
  isLoading: boolean;
  error: string | null;
  records: FinancialRecord[];
  filteredRecords: FinancialRecord[];
  summaryMetrics: SummaryMetrics;
  geoData: GeoData[];
  emergencyFundingData: EmergencyFundingChartData[];
  topRecipients: BarChartData[];
  topPrograms: BarChartData[];
  filterState: FilterState;
} 