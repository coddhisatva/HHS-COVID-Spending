'use client';

import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useData } from '@/context/DataContext';
import { EmergencyFundingAct } from '@/types/data';
import { formatCurrency, formatPercent } from '@/utils/formatters';

// Custom colors for the pie chart segments
const COLORS = [
  '#0088FE', // CARES Act
  '#00C49F', // American Rescue Plan
  '#FFBB28', // COVID-19 Supplemental
  '#FF8042', // Paycheck Protection Program
  '#8884D8', // Families First Coronavirus Response Act
  '#82CA9D', // Other
  '#AAAAAA', // None
];

// Mapping of emergency funding acts to colors
const FUNDING_COLORS: Record<EmergencyFundingAct, string> = {
  'CARES Act': COLORS[0],
  'American Rescue Plan': COLORS[1],
  'COVID-19 Supplemental': COLORS[2],
  'Paycheck Protection Program': COLORS[3],
  'Families First Coronavirus Response Act': COLORS[4],
  'Other': COLORS[5],
  'None': COLORS[6],
};

// Custom tooltip component for the pie chart
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 shadow-md rounded border border-gray-200">
        <p className="font-semibold text-gray-900">{data.name}</p>
        <p className="text-gray-700">{formatCurrency(data.value)}</p>
        <p className="text-gray-700">{formatPercent(data.percentage)}</p>
      </div>
    );
  }
  
  return null;
};

export default function EmergencyFundingPieChart() {
  const { state, dispatch } = useData();
  const { filteredRecords } = state;
  
  // Process data for the pie chart
  const chartData = useMemo(() => {
    // Group by emergency funding act
    const grouped = filteredRecords.reduce((acc, record) => {
      const act = record.emergencyFunding;
      const amount = record.obligationAmount > 0 ? record.obligationAmount : 0; // Only include positive allocations
      
      if (!acc[act]) {
        acc[act] = 0;
      }
      
      acc[act] += amount;
      return acc;
    }, {} as Record<EmergencyFundingAct, number>);
    
    // Convert to array format for Recharts
    const total = Object.values(grouped).reduce((sum, value) => sum + value, 0);
    
    return Object.entries(grouped)
      .filter(([_, value]) => value > 0)
      .map(([name, value]) => ({
        name: name as EmergencyFundingAct,
        value,
        percentage: value / total,
        color: FUNDING_COLORS[name as EmergencyFundingAct] || '#AAAAAA'
      }))
      .sort((a, b) => b.value - a.value); // Sort by value in descending order
  }, [filteredRecords]);
  
  // Handle pie segment click
  const handlePieClick = (data: any) => {
    if (data && data.name) {
      // Add or remove the clicked funding act from the filter
      const act = data.name as EmergencyFundingAct;
      const currentFunding = state.filterState.emergencyFunding;
      
      let newFunding: EmergencyFundingAct[];
      
      if (currentFunding.includes(act)) {
        // Remove if already selected
        newFunding = currentFunding.filter(item => item !== act);
      } else {
        // Add if not already selected
        newFunding = [...currentFunding, act];
      }
      
      dispatch({
        type: 'SET_FILTER',
        payload: { emergencyFunding: newFunding }
      });
    }
  };
  
  return (
    <div className="h-full">
      <h2 className="text-lg font-medium mb-4">Distribution by Emergency Funding Act</h2>
      <div className="h-80">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                onClick={handlePieClick}
                cursor="pointer"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                layout="vertical"
                align="right"
                verticalAlign="middle"
                formatter={(value) => <span className="text-sm text-gray-700">{value}</span>}
              />
            </PieChart>
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