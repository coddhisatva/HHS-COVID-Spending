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

// Custom colors for the pie chart segments - more vibrant and distinguishable
const COLORS = [
  '#4f46e5', // indigo
  '#7c3aed', // violet
  '#06b6d4', // cyan
  '#0ea5e9', // sky
  '#10b981', // emerald
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
          Percentage: <span className="text-blue-600">{formatPercent(data.percentage / 100)}</span>
        </p>
      </div>
    );
  }
  return null;
};

// Improved legend renderer for better readability
const renderCustomizedLegend = (props: any) => {
  const { payload } = props;
  
  return (
    <div className="mt-4 flex flex-wrap justify-center gap-x-6 gap-y-2" style={{ textAlign: 'center', width: '100%' }}>
      {payload.map((entry: any, index: number) => (
        <div key={`item-${index}`} className="flex items-center">
          <div 
            className="w-4 h-4 rounded-sm mr-2 flex-shrink-0" 
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-sm text-gray-700 truncate">{entry.value}</span>
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
      <h2 className="text-xl font-medium mb-3 text-gray-800 border-b pb-2">
        Emergency Funding Breakdown
      </h2>
      
      {enhancedData && enhancedData.length > 0 ? (
        <div className="flex flex-col items-center" style={{ width: '100%', textAlign: 'center' }}>
          <div className="w-full max-w-md mx-auto" style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={enhancedData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  innerRadius={60} // Create a donut chart for modern appearance
                  fill="#8884d8"
                  dataKey="value"
                  onClick={handlePieClick}
                  isAnimationActive={true}
                  animationDuration={800}
                  label={({ name, percent }) => 
                    `${percent > 0.05 ? `${(percent * 100).toFixed(0)}%` : ''}`
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
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-6 w-full text-center">
            <h3 className="text-sm font-semibold text-gray-700 mb-2 text-center">Legend</h3>
            {renderCustomizedLegend({ payload: enhancedData.map((item, index) => ({
              value: item.name,
              color: COLORS[index % COLORS.length]
            }))})}
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-500">No emergency funding data available</p>
        </div>
      )}
      
      {/* Summary statistics below the chart */}
      {enhancedData && enhancedData.length > 0 && (
        <div className="mt-6 grid grid-cols-2 gap-4 max-w-2xl mx-auto" style={{ width: '100%', maxWidth: '32rem' }}>
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
            <p className="text-lg font-bold text-gray-900 truncate">
              {enhancedData.length > 0 ? 
                enhancedData.reduce((max, item) => item.value > max.value ? item : max, enhancedData[0]).name 
                : 'N/A'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
} 