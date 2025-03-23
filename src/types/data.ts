/**
 * Enumeration for the different financial activity types
 */
export enum FinancialActivityType {
  ALL = 'all',
  ALLOCATION = 'allocations',
  DEALLOCATION = 'deallocations',
}

/**
 * Enumeration for the different financial transaction types 
 */
export enum TransactionType {
  ALL = 'all',
  COMMITMENT = 'commitments',
  PAYMENT = 'payments',
}

/**
 * Enumeration for data source types
 */
export enum DataSourceType {
  ALL = 'all',
  CONTRACTS = 'contracts',
  FINANCIAL_ASSISTANCE = 'financial_assistance',
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
  name: string;
  value: number;
  id: EmergencyFundingAct;
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
  startDate: Date | null;
  endDate: Date | null;
  selectedState: string | null;
  selectedRecipient: string | null;
  selectedProgram: string | null;
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

/**
 * Transaction interface
 */
export interface Transaction {
  id: string;
  recipient_name: string;
  recipient_state: string;
  program_name: string;
  emergency_funding_act: EmergencyFundingAct | null;
  transaction_date: string;
  transaction_obligated_amount: number;
  gross_outlay_amount: number;
  data_source: 'contracts' | 'financial_assistance';
}

/**
 * Summary data interface
 */
export interface SummaryData {
  totalAllocations: number;
  totalDeallocations: number;
  totalOutlays: number;
  recipientCount: number;
  programCount: number;
  stateCount: number;
}

/**
 * Top entity data interface
 */
export interface TopEntityData {
  name: string;
  allocations: number;
  deallocations: number;
}

/**
 * State map data interface
 */
export interface StateMapData {
  state: string;
  amount: number;
}

/**
 * Chart data interface
 */
export interface ChartData {
  emergencyFundingBreakdown: EmergencyFundingChartData[];
  topRecipients: TopEntityData[];
  topPrograms: TopEntityData[];
  stateData: StateMapData[];
}

/**
 * Application state
 */
export interface AppState {
  isLoading: boolean;
  error: string | null;
  filterState: FilterState;
  transactions: Transaction[];
  filteredTransactions: Transaction[];
  summaryData: SummaryData;
  chartData: ChartData;
}

/**
 * App action types
 */
export type AppAction =
  | { type: 'SET_FILTER'; payload: Partial<FilterState> }
  | { type: 'RESET_FILTERS' }
  | { type: 'SET_TRANSACTIONS'; payload: Transaction[] }
  | { type: 'SET_FILTERED_TRANSACTIONS'; payload: Transaction[] }
  | { type: 'SET_SUMMARY_DATA'; payload: SummaryData }
  | { type: 'SET_CHART_DATA'; payload: ChartData }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }; 