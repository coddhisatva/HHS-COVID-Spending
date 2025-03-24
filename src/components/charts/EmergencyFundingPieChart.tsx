'use client';

import { useState } from 'react';
import { Cell, Tooltip, ResponsiveContainer, PieChart, Pie } from 'recharts';
import { useData } from '@/context/DataContext';
import { formatCurrency, formatPercent } from '@/utils/formatters';

// Define the data structure for emergency funding
interface EmergencyFundingData {
  name: string;
  value: number;
  percentage: number;
}

// Custom colors for the pie chart segments based on reference design
const COLORS = [
  '#4f46e5', // indigo (CARES Act)
  '#10b981', // emerald (American Rescue Plan)
  '#f59e0b', // amber (PPP)
  '#8b5cf6', // violet (CAA 2021)
  '#ec4899', // pink (Coronavirus Prep Act)
  '#3b82f6', // blue
  '#6366f1', // lighter indigo
];

// Custom legend renderer
const renderCustomizedLegend = (props: any) => {
  const { payload } = props;
  
  return (
    <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-3">
      {payload.map((entry: any, index: number) => (
        <div key={`legend-${index}`} className="flex items-center">
          <div 
            className="h-3 w-3 mr-2"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-xs text-gray-700">
            {entry.value} {entry.percentage ? `(${entry.percentage}%)` : ''}
          </span>
        </div>
      ))}
    </div>
  );
};

export default function EmergencyFundingPieChart() {
  const { state } = useData();
  // Use emergencyFundingBreakdown as a fallback for emergencyFunding
  const fundingData: EmergencyFundingData[] = state.chartData?.emergencyFunding || 
    (state.chartData?.emergencyFundingBreakdown || []).map(item => ({
      name: item.name,
      value: item.value,
      percentage: 0 // Calculate percentage if needed
    }));
  
  // Calculate total for percentages (if not already provided)
  const total = fundingData.reduce((sum, item) => sum + item.value, 0);
  // Ensure all entries have percentages
  const enhancedData = fundingData.map(item => ({
    ...item,
    percentage: item.percentage || (total > 0 ? (item.value / total) * 100 : 0)
  }));
  
  return (
    <div className="h-full">
      {enhancedData && enhancedData.length > 0 ? (
        <div className="h-full flex flex-col">
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={enhancedData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => percent > 0.05 ? `${(percent * 100).toFixed(0)}%` : ''}
                >
                  {enhancedData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]} 
                    />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => formatCurrency(value)} 
                  labelFormatter={(label) => `${label}`} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-2">
            {renderCustomizedLegend({ 
              payload: enhancedData.map((item, index) => ({
                value: item.name,
                color: COLORS[index % COLORS.length],
                percentage: Math.round(item.percentage)
              }))
            })}
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500">No emergency funding data available</p>
        </div>
      )}
    </div>
  );
} 