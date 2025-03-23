'use client';

import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useData } from '@/context/DataContext';

export default function DateRangePicker() {
  const { state, dispatch } = useData();
  const { filterState } = state;
  
  const [startDate, setStartDate] = useState<Date | null>(filterState.startDate);
  const [endDate, setEndDate] = useState<Date | null>(filterState.endDate);
  
  const handleStartDateChange = (date: Date | null) => {
    setStartDate(date);
    dispatch({
      type: 'SET_FILTER',
      payload: { startDate: date }
    });
  };
  
  const handleEndDateChange = (date: Date | null) => {
    setEndDate(date);
    dispatch({
      type: 'SET_FILTER',
      payload: { endDate: date }
    });
  };
  
  const clearDateRange = () => {
    setStartDate(null);
    setEndDate(null);
    dispatch({
      type: 'SET_FILTER',
      payload: { startDate: null, endDate: null }
    });
  };
  
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-medium mb-3">Date Range</h3>
      
      <div className="space-y-3">
        <div>
          <label htmlFor="start-date" className="block text-sm text-gray-700 mb-1">
            Start Date
          </label>
          <DatePicker
            id="start-date"
            selected={startDate}
            onChange={handleStartDateChange}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm"
            placeholderText="Select start date"
            dateFormat="MM/dd/yyyy"
          />
        </div>
        
        <div>
          <label htmlFor="end-date" className="block text-sm text-gray-700 mb-1">
            End Date
          </label>
          <DatePicker
            id="end-date"
            selected={endDate}
            onChange={handleEndDateChange}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
            className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm"
            placeholderText="Select end date"
            dateFormat="MM/dd/yyyy"
          />
        </div>
      </div>
      
      {(startDate || endDate) && (
        <button
          onClick={clearDateRange}
          className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
        >
          Clear date range
        </button>
      )}
    </div>
  );
} 