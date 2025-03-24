'use client';

import { useState } from 'react';
import { Cell, Tooltip, Legend, ResponsiveContainer, PieChart, Pie } from 'recharts';
import { useData } from '@/context/DataContext';
import { formatCurrency, formatPercent } from '@/utils/formatters';

// Define the data structure for emergency funding
interface EmergencyFundingData {
  name: string;
  value: number;
  percentage: number;
}

// Custom colors for the pie chart segments - using a vibrant but cohesive palette
const COLORS = [
  '#3b82f6', // blue
  '#8b5cf6', // purple
  '#06b6d4', // cyan
  '#10b981', // green
  '#f59e0b', // amber
  '#ef4444', // red
];

// Custom tooltip for the pie chart
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-4 shadow-lg rounded-md border border-gray-200">
        <p className="font-semibold text-lg text-gray-900 mb-1">{data.name}</p>
        <p className="text-gray-700 font-medium">
          Amount: <span className="text-blue-600">{formatCurrency(data.value)}</span>
        </p>
        <p className="text-gray-700 font-medium">
          Percentage: <span className="text-blue-600">{formatPercent(data.percentage)}</span>
        </p>
      </div>
    );
  }
  return null;
};

// Custom legend renderer
const renderCustomizedLegend = (props: any) => {
  const { payload } = props;
  
  return (
    <ul className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-4">
      {payload.map((entry: any, index: number) => (
        <li key={`item-${index}`} className="flex items-center">
          <div 
            className="w-3 h-3 rounded-full mr-2" 
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-sm text-gray-700">{entry.value}</span>
        </li>
      ))}
    </ul>
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
  
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  
  const handlePieClick = (data: any, index: number) => {
    setActiveIndex(index === activeIndex ? null : index);
  };
  
  // Calculate total for percentages (if not already provided)
  const total = fundingData.reduce((sum, item) => sum + item.value, 0);
  // Ensure all entries have percentages
  const enhancedData = fundingData.map(item => ({
    ...item,
    percentage: item.percentage || (total > 0 ? (item.value / total) * 100 : 0)
  }));
  
  return (
    <div className="h-full">
      <h2 className="text-xl font-medium mb-4 text-gray-800">
        Emergency Funding Breakdown
      </h2>
      <div className="h-[350px]">
        {enhancedData && enhancedData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={enhancedData}
                cx="50%"
                cy="45%"
                labelLine={false}
                outerRadius={120}
                innerRadius={60} // Create a donut chart for modern appearance
                fill="#8884d8"
                dataKey="value"
                onClick={handlePieClick}
                isAnimationActive={true}
                animationDuration={800}
                label={({ name, percent }) => 
                  `${percent > 5 ? `${(percent * 100).toFixed(0)}%` : ''}`
                }
                paddingAngle={2} // Add padding between segments
              >
                {enhancedData.map((entry: any, index: number) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]} 
                    stroke="#fff"
                    strokeWidth={index === activeIndex ? 2 : 1}
                    style={{
                      filter: index === activeIndex ? 'drop-shadow(0px 0px 4px rgba(0,0,0,0.3))' : 'none',
                      opacity: activeIndex === null || index === activeIndex ? 1 : 0.7,
                      transition: 'opacity 0.3s, filter 0.3s'
                    }}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                layout="horizontal" 
                verticalAlign="bottom"
                align="center"
                content={renderCustomizedLegend}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-gray-500">No data available</p>
          </div>
        )}
      </div>
      
      {/* Summary statistics below the chart */}
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-3 border-l-4 border-blue-500 shadow-sm">
          <p className="text-sm text-gray-600">
            Total Emergency Funding
          </p>
          <p className="text-lg font-bold text-gray-900">{formatCurrency(total)}</p>
        </div>
        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-3 border-l-4 border-green-500 shadow-sm">
          <p className="text-sm text-gray-600">
            Largest Program
          </p>
          <p className="text-lg font-bold text-gray-900">
            {enhancedData.length > 0 ? 
              enhancedData.reduce((max, item) => item.value > max.value ? item : max, enhancedData[0]).name 
              : 'N/A'}
          </p>
        </div>
      </div>
    </div>
  );
} 