'use client';

import { useState, useEffect } from 'react';
import { 
  FinancialActivityType,
  TransactionType,
  DataSourceType,
  EmergencyFundingAct
} from '@/types/data';
import { useData } from '@/context/DataContext';

const activityTypeOptions = [
  { value: FinancialActivityType.ALL, label: 'All Activity' },
  { value: FinancialActivityType.ALLOCATION, label: 'Allocations (Money Out)' },
  { value: FinancialActivityType.DEALLOCATION, label: 'Deallocations (Money Back)' },
];

const transactionTypeOptions = [
  { value: TransactionType.ALL, label: 'All Financial Activity' },
  { value: TransactionType.COMMITMENT, label: 'Commitments Only' },
  { value: TransactionType.PAYMENT, label: 'Payments Only' },
];

const dataSourceOptions = [
  { value: DataSourceType.ALL, label: 'All Data Sources' },
  { value: DataSourceType.CONTRACTS, label: 'Contracts' },
  { value: DataSourceType.FINANCIAL_ASSISTANCE, label: 'Financial Assistance' },
];

const emergencyFundingOptions: { value: EmergencyFundingAct, label: string }[] = [
  { value: 'CARES Act', label: 'CARES Act' },
  { value: 'American Rescue Plan', label: 'American Rescue Plan' },
  { value: 'COVID-19 Supplemental', label: 'COVID-19 Supplemental' },
  { value: 'Paycheck Protection Program', label: 'Paycheck Protection Program' },
  { value: 'Families First Coronavirus Response Act', label: 'Families First Coronavirus Response Act' },
  { value: 'Other', label: 'Other Emergency Funding' },
  { value: 'None', label: 'No Emergency Funding' },
];

export default function FilterPanel() {
  const { state, dispatch } = useData();
  const { filterState } = state;

  // Local state for multi-select filters
  const [selectedEmergencyFunding, setSelectedEmergencyFunding] = useState<EmergencyFundingAct[]>([]);
  
  // Sync local state with context state
  useEffect(() => {
    setSelectedEmergencyFunding(filterState.emergencyFunding);
  }, [filterState.emergencyFunding]);
  
  // Handler for activity type change
  const handleActivityTypeChange = (value: FinancialActivityType) => {
    dispatch({
      type: 'SET_FILTER',
      payload: { activityType: value }
    });
  };
  
  // Handler for transaction type change
  const handleTransactionTypeChange = (value: TransactionType) => {
    dispatch({
      type: 'SET_FILTER',
      payload: { transactionType: value }
    });
  };
  
  // Handler for data source change
  const handleDataSourceChange = (value: DataSourceType) => {
    dispatch({
      type: 'SET_FILTER',
      payload: { dataSource: value }
    });
  };
  
  // Handler for emergency funding change
  const handleEmergencyFundingChange = (selected: EmergencyFundingAct) => {
    let newSelection: EmergencyFundingAct[];
    
    if (selectedEmergencyFunding.includes(selected)) {
      // Remove if already selected
      newSelection = selectedEmergencyFunding.filter(item => item !== selected);
    } else {
      // Add if not already selected
      newSelection = [...selectedEmergencyFunding, selected];
    }
    
    setSelectedEmergencyFunding(newSelection);
    
    dispatch({
      type: 'SET_FILTER',
      payload: { emergencyFunding: newSelection }
    });
  };
  
  // Handler for reset filters
  const handleResetFilters = () => {
    setSelectedEmergencyFunding([]);
    dispatch({ type: 'RESET_FILTERS' });
  };

  // Handler for clear filters
  const handleClearFilters = () => {
    setSelectedEmergencyFunding([]);
    dispatch({ type: 'RESET_FILTERS' });
  };
  
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
      <div className="flex flex-wrap items-start gap-8">
        {/* Financial Type */}
        <div className="filter-group">
          <h3 className="text-base font-medium text-gray-900 mb-2">Financial Type</h3>
          <div className="space-y-2">
            {activityTypeOptions.map(option => (
              <div key={option.value} className="flex items-center">
                <input
                  type="radio"
                  id={`activity-${option.value}`}
                  name="activityType"
                  checked={filterState.activityType === option.value}
                  onChange={() => handleActivityTypeChange(option.value)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <label htmlFor={`activity-${option.value}`} className="ml-2 block text-sm text-gray-700">
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        </div>
        
        {/* Transaction Type */}
        <div className="filter-group">
          <h3 className="text-base font-medium text-gray-900 mb-2">Transaction Type</h3>
          <div className="space-y-2">
            {transactionTypeOptions.map(option => (
              <div key={option.value} className="flex items-center">
                <input
                  type="radio"
                  id={`transaction-${option.value}`}
                  name="transactionType"
                  checked={filterState.transactionType === option.value}
                  onChange={() => handleTransactionTypeChange(option.value)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <label htmlFor={`transaction-${option.value}`} className="ml-2 block text-sm text-gray-700">
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        </div>
        
        {/* Data Source */}
        <div className="filter-group">
          <h3 className="text-base font-medium text-gray-900 mb-2">Data Source</h3>
          <div className="space-y-2">
            {dataSourceOptions.map(option => (
              <div key={option.value} className="flex items-center">
                <input
                  type="radio"
                  id={`source-${option.value}`}
                  name="dataSource"
                  checked={filterState.dataSource === option.value}
                  onChange={() => handleDataSourceChange(option.value)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <label htmlFor={`source-${option.value}`} className="ml-2 block text-sm text-gray-700">
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        </div>
        
        {/* Emergency Funding */}
        <div className="filter-group">
          <h3 className="text-base font-medium text-gray-900 mb-2">Emergency Funding</h3>
          <div className="space-y-2">
            {emergencyFundingOptions.map(option => (
              <div key={option.value} className="flex items-center">
                <input
                  type="checkbox"
                  id={`funding-${option.value}`}
                  checked={selectedEmergencyFunding.includes(option.value)}
                  onChange={() => handleEmergencyFundingChange(option.value)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor={`funding-${option.value}`} className="ml-2 block text-sm text-gray-700 truncate">
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Filter Buttons */}
      <div className="flex justify-end mt-6 space-x-3">
        <button
          onClick={handleClearFilters}
          className="py-2 px-4 border border-gray-300 rounded text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
        >
          Clear All Filters
        </button>
        <button
          onClick={handleResetFilters}
          className="py-2 px-4 border border-gray-300 rounded text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
        >
          Reset All Filters
        </button>
      </div>
    </div>
  );
} 