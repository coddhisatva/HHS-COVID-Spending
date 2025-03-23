'use client';

import { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { 
  AppDataState, 
  FilterState, 
  FinancialActivityType, 
  TransactionType, 
  DataSourceType,
  FinancialRecord
} from '@/types/data';
import { generateSampleData } from '@/utils/sampleData';

// Initial state for filters
const initialFilterState: FilterState = {
  activityType: FinancialActivityType.ALL,
  transactionType: TransactionType.ALL,
  dataSource: DataSourceType.ALL,
  emergencyFunding: [],
  states: [],
  recipients: [],
  programs: [],
  dateRange: [null, null],
};

// Initial state for the application data
const initialState: AppDataState = {
  isLoading: true,
  error: null,
  records: [],
  filteredRecords: [],
  summaryMetrics: {
    totalAllocations: 0,
    totalDeallocations: 0,
    totalOutlays: 0,
    totalRecipients: 0,
    totalPrograms: 0,
    totalStates: 0,
  },
  geoData: [],
  emergencyFundingData: [],
  topRecipients: [],
  topPrograms: [],
  filterState: initialFilterState,
};

// Action types
type DataAction =
  | { type: 'LOADING' }
  | { type: 'LOAD_SUCCESS'; payload: FinancialRecord[] }
  | { type: 'LOAD_ERROR'; payload: string }
  | { type: 'SET_FILTER'; payload: Partial<FilterState> }
  | { type: 'RESET_FILTERS' }
  | { type: 'UPDATE_VISUALIZATIONS' };

// Data context reducer
function dataReducer(state: AppDataState, action: DataAction): AppDataState {
  switch (action.type) {
    case 'LOADING':
      return { ...state, isLoading: true, error: null };
    
    case 'LOAD_SUCCESS':
      return { 
        ...state, 
        isLoading: false, 
        error: null,
        records: action.payload,
        filteredRecords: action.payload,
      };
    
    case 'LOAD_ERROR':
      return { ...state, isLoading: false, error: action.payload };
    
    case 'SET_FILTER':
      const newFilterState = { ...state.filterState, ...action.payload };
      
      // Apply filters to records
      const filteredRecords = applyFilters(state.records, newFilterState);
      
      return {
        ...state,
        filterState: newFilterState,
        filteredRecords,
      };
    
    case 'RESET_FILTERS':
      return {
        ...state,
        filterState: initialFilterState,
        filteredRecords: state.records,
      };
    
    case 'UPDATE_VISUALIZATIONS':
      // For now, this is a placeholder for when we implement real data visualization updates
      return state;
    
    default:
      return state;
  }
}

// Helper function to apply filters to records
function applyFilters(records: FinancialRecord[], filters: FilterState): FinancialRecord[] {
  return records.filter(record => {
    // Filter by activity type
    if (filters.activityType !== FinancialActivityType.ALL) {
      if (filters.activityType === FinancialActivityType.ALLOCATION && record.obligationAmount <= 0) {
        return false;
      }
      if (filters.activityType === FinancialActivityType.DEALLOCATION && record.obligationAmount >= 0) {
        return false;
      }
    }
    
    // Filter by transaction type
    if (filters.transactionType !== TransactionType.ALL) {
      if (filters.transactionType === TransactionType.COMMITMENT && record.obligationAmount === 0) {
        return false;
      }
      if (filters.transactionType === TransactionType.PAYMENT && record.outlay === 0) {
        return false;
      }
    }
    
    // Filter by data source
    if (filters.dataSource !== DataSourceType.ALL) {
      if (filters.dataSource === DataSourceType.CONTRACTS && record.source !== 'contracts') {
        return false;
      }
      if (filters.dataSource === DataSourceType.FINANCIAL_ASSISTANCE && record.source !== 'assistance') {
        return false;
      }
    }
    
    // Filter by emergency funding
    if (filters.emergencyFunding.length > 0 && !filters.emergencyFunding.includes(record.emergencyFunding)) {
      return false;
    }
    
    // Filter by states
    if (filters.states.length > 0 && !filters.states.includes(record.recipientState)) {
      return false;
    }
    
    // Filter by recipients
    if (filters.recipients.length > 0 && !filters.recipients.includes(record.recipient)) {
      return false;
    }
    
    // Filter by programs
    if (filters.programs.length > 0 && !filters.programs.includes(record.program)) {
      return false;
    }
    
    // Filter by date range
    if (filters.dateRange[0] && new Date(record.date) < filters.dateRange[0]) {
      return false;
    }
    if (filters.dateRange[1] && new Date(record.date) > filters.dateRange[1]) {
      return false;
    }
    
    return true;
  });
}

// Create the data context
const DataContext = createContext<{
  state: AppDataState;
  dispatch: React.Dispatch<DataAction>;
} | undefined>(undefined);

// Data provider component
export function DataProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(dataReducer, initialState);
  
  // Load sample data on mount
  useEffect(() => {
    const loadData = async () => {
      dispatch({ type: 'LOADING' });
      try {
        // In a real app, this would be an API call
        const data = await generateSampleData();
        dispatch({ type: 'LOAD_SUCCESS', payload: data });
      } catch (error) {
        dispatch({ type: 'LOAD_ERROR', payload: 'Failed to load data' });
      }
    };
    
    loadData();
  }, []);
  
  return (
    <DataContext.Provider value={{ state, dispatch }}>
      {children}
    </DataContext.Provider>
  );
}

// Custom hook to use the data context
export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
} 