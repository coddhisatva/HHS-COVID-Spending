'use client';

import { useMemo, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from 'recharts';
import { useData } from '@/context/DataContext';
import { formatCurrency } from '@/utils/formatters';
import { getBarClass } from '@/utils/formatters';

type EntityType = 'recipient' | 'program';

interface TopEntityBarChartProps {
  entityType: EntityType;
  limit?: number;
}

export default function TopEntityBarChart({ entityType, limit = 10 }: TopEntityBarChartProps) {
  const { state, dispatch } = useData();
  const { filteredRecords } = state;
  const [showAllocation, setShowAllocation] = useState(true);
  
  const title = entityType === 'recipient' ? 'Top Recipients' : 'Top Programs';
  const filterProperty = entityType === 'recipient' ? 'recipients' : 'programs';
  
  // Process data for the bar chart
  const chartData = useMemo(() => {
    // Group by entity type
    const grouped = filteredRecords.reduce((acc, record) => {
      const entity = entityType === 'recipient' ? record.recipient : record.program;
      const amount = showAllocation
        ? (record.obligationAmount > 0 ? record.obligationAmount : 0) // Only include positive allocations
        : (record.obligationAmount < 0 ? record.obligationAmount : 0); // Only include negative deallocations
      
      if (!acc[entity]) {
        acc[entity] = 0;
      }
      
      acc[entity] += amount;
      return acc;
    }, {} as Record<string, number>);
    
    // Convert to array format for Recharts and take top N
    return Object.entries(grouped)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => showAllocation 
        ? b.value - a.value // Sort allocations in descending order
        : a.value - b.value) // Sort deallocations in ascending order (more negative first)
      .slice(0, limit);
  }, [filteredRecords, entityType, showAllocation, limit]);
  
  // Handle bar click
  const handleBarClick = (data: any) => {
    if (data && data.name) {
      // Add or remove the clicked entity from the filter
      const entity = data.name;
      const currentFilters = state.filterState[filterProperty];
      
      let newFilters: string[];
      
      if (currentFilters.includes(entity)) {
        // Remove if already selected
        newFilters = currentFilters.filter(item => item !== entity);
      } else {
        // Add if not already selected
        newFilters = [...currentFilters, entity];
      }
      
      dispatch({
        type: 'SET_FILTER',
        payload: { [filterProperty]: newFilters }
      });
    }
  };
  
  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 shadow-md rounded border border-gray-200">
          <p className="font-semibold text-gray-900">{payload[0].payload.name}</p>
          <p className={`${getBarClass(payload[0].value)}`}>
            {formatCurrency(Math.abs(payload[0].value))}
          </p>
        </div>
      );
    }
    
    return null;
  };
  
  return (
    <div className="h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">{title}</h2>
        <div className="flex space-x-2">
          <button
            className={`px-3 py-1 rounded text-sm ${
              showAllocation ? 'bg-allocation text-white' : 'bg-gray-100 text-gray-600'
            }`}
            onClick={() => setShowAllocation(true)}
          >
            Allocations
          </button>
          <button
            className={`px-3 py-1 rounded text-sm ${
              !showAllocation ? 'bg-deallocation text-white' : 'bg-gray-100 text-gray-600'
            }`}
            onClick={() => setShowAllocation(false)}
          >
            Deallocations
          </button>
        </div>
      </div>
      
      <div className="h-80">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis
                type="number"
                tickFormatter={(value) => formatCurrency(Math.abs(value), false)}
              />
              <YAxis
                dataKey="name"
                type="category"
                width={150}
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => value.length > 20 ? `${value.substring(0, 20)}...` : value}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="value"
                className={showAllocation ? 'allocation-bar' : 'deallocation-bar'}
                onClick={handleBarClick}
                cursor="pointer"
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-gray-500">No data available</p>
          </div>
        )}
      </div>
    </div>
  );
} 