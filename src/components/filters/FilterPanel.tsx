'use client';

import { useState } from 'react';
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
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-3">Financial Type</h3>
        <div className="space-y-2">
          {activityTypeOptions.map(option => (
            <div key={option.value} className="flex items-center">
              <input
                type="radio"
                id={`activity-${option.value}`}
                name="activityType"
                checked={filterState.activityType === option.value}
                onChange={() => handleActivityTypeChange(option.value)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
              />
              <label htmlFor={`activity-${option.value}`} className="ml-2 block text-sm text-gray-700">
                {option.label}
              </label>
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-3">Transaction Type</h3>
        <div className="space-y-2">
          {transactionTypeOptions.map(option => (
            <div key={option.value} className="flex items-center">
              <input
                type="radio"
                id={`transaction-${option.value}`}
                name="transactionType"
                checked={filterState.transactionType === option.value}
                onChange={() => handleTransactionTypeChange(option.value)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
              />
              <label htmlFor={`transaction-${option.value}`} className="ml-2 block text-sm text-gray-700">
                {option.label}
              </label>
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-3">Data Source</h3>
        <div className="space-y-2">
          {dataSourceOptions.map(option => (
            <div key={option.value} className="flex items-center">
              <input
                type="radio"
                id={`source-${option.value}`}
                name="dataSource"
                checked={filterState.dataSource === option.value}
                onChange={() => handleDataSourceChange(option.value)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
              />
              <label htmlFor={`source-${option.value}`} className="ml-2 block text-sm text-gray-700">
                {option.label}
              </label>
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-3">Emergency Funding</h3>
        <div className="space-y-2">
          {emergencyFundingOptions.map(option => (
            <div key={option.value} className="flex items-center">
              <input
                type="checkbox"
                id={`funding-${option.value}`}
                checked={selectedEmergencyFunding.includes(option.value)}
                onChange={() => handleEmergencyFundingChange(option.value)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor={`funding-${option.value}`} className="ml-2 block text-sm text-gray-700">
                {option.label}
              </label>
            </div>
          ))}
        </div>
      </div>
      
      <div className="pt-4">
        <button
          onClick={handleResetFilters}
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Reset All Filters
        </button>
      </div>
    </div>
  );
} 