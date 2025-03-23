import { createContext, useContext, useState, ReactNode } from 'react';

// Define types for our filters
export type FinancialType = 'all' | 'allocations' | 'deallocations';
export type TransactionType = 'all' | 'commitments' | 'payments';
export type DataSource = 'all' | 'contracts' | 'financial_assistance';
export type EmergencyFundingAct = 
  | 'cares_act' 
  | 'american_rescue_plan' 
  | 'covid19_supplemental'
  | 'paycheck_protection'
  | 'families_first'
  | 'other_emergency'
  | 'no_emergency';

// Interface for the filter state
export interface FilterState {
  financialType: FinancialType;
  transactionType: TransactionType;
  dataSource: DataSource;
  emergencyFunding: EmergencyFundingAct[];
  startDate: Date | null;
  endDate: Date | null;
  selectedState: string | null;
  selectedRecipient: string | null;
  selectedProgram: string | null;
}

// Interface for the context
interface FilterContextType {
  filters: FilterState;
  setFinancialType: (type: FinancialType) => void;
  setTransactionType: (type: TransactionType) => void;
  setDataSource: (source: DataSource) => void;
  toggleEmergencyFunding: (act: EmergencyFundingAct) => void;
  setDateRange: (start: Date | null, end: Date | null) => void;
  setSelectedState: (state: string | null) => void;
  setSelectedRecipient: (recipient: string | null) => void;
  setSelectedProgram: (program: string | null) => void;
  resetFilters: () => void;
}

// Default filter state
const defaultFilters: FilterState = {
  financialType: 'all',
  transactionType: 'all',
  dataSource: 'all',
  emergencyFunding: [],
  startDate: null,
  endDate: null,
  selectedState: null,
  selectedRecipient: null,
  selectedProgram: null,
};

// Create context with default values
const FilterContext = createContext<FilterContextType>({
  filters: defaultFilters,
  setFinancialType: () => {},
  setTransactionType: () => {},
  setDataSource: () => {},
  toggleEmergencyFunding: () => {},
  setDateRange: () => {},
  setSelectedState: () => {},
  setSelectedRecipient: () => {},
  setSelectedProgram: () => {},
  resetFilters: () => {},
});

// Provider component
export function FilterProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<FilterState>(defaultFilters);

  const setFinancialType = (type: FinancialType) => {
    setFilters(prev => ({ ...prev, financialType: type }));
  };

  const setTransactionType = (type: TransactionType) => {
    setFilters(prev => ({ ...prev, transactionType: type }));
  };

  const setDataSource = (source: DataSource) => {
    setFilters(prev => ({ ...prev, dataSource: source }));
  };

  const toggleEmergencyFunding = (act: EmergencyFundingAct) => {
    setFilters(prev => {
      if (prev.emergencyFunding.includes(act)) {
        return {
          ...prev,
          emergencyFunding: prev.emergencyFunding.filter(item => item !== act),
        };
      } else {
        return {
          ...prev,
          emergencyFunding: [...prev.emergencyFunding, act],
        };
      }
    });
  };

  const setDateRange = (start: Date | null, end: Date | null) => {
    setFilters(prev => ({ ...prev, startDate: start, endDate: end }));
  };

  const setSelectedState = (state: string | null) => {
    setFilters(prev => ({ ...prev, selectedState: state }));
  };

  const setSelectedRecipient = (recipient: string | null) => {
    setFilters(prev => ({ ...prev, selectedRecipient: recipient }));
  };

  const setSelectedProgram = (program: string | null) => {
    setFilters(prev => ({ ...prev, selectedProgram: program }));
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
  };

  return (
    <FilterContext.Provider
      value={{
        filters,
        setFinancialType,
        setTransactionType,
        setDataSource,
        toggleEmergencyFunding,
        setDateRange,
        setSelectedState,
        setSelectedRecipient,
        setSelectedProgram,
        resetFilters,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
}

// Custom hook for using the filter context
export function useFilters() {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error('useFilters must be used within a FilterProvider');
  }
  return context;
} 