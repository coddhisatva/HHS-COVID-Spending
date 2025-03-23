'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Cell, Tooltip, Legend, ResponsiveContainer, PieChart, Pie } from 'recharts';
import { useData } from '@/context/DataContext';
import { formatCurrency, formatPercent } from '@/utils/formatters';

// Define the data structure for emergency funding
interface EmergencyFundingData {
  name: string;
  value: number;
  percentage: number;
}

// Custom colors for the pie chart segments
const COLORS = [
  '#4f46e5', // indigo
  '#3b82f6', // blue
  '#0ea5e9', // sky blue
  '#06b6d4', // cyan
];

// Custom tooltip for the pie chart
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 shadow-md rounded border border-gray-200">
        <p className="font-semibold text-gray-900">{data.name}</p>
        <p className="text-gray-700">Amount: {formatCurrency(data.value)}</p>
        <p className="text-gray-700">Percentage: {formatPercent(data.percentage)}</p>
      </div>
    );
  }
  return null;
};

function EmergencyFundingPieChart() {
  const { state } = useData();
  // Use emergencyFundingBreakdown as a fallback for emergencyFunding
  const fundingData: EmergencyFundingData[] = state.chartData.emergencyFunding || 
    (state.chartData.emergencyFundingBreakdown || []).map(item => ({
      name: item.name,
      value: item.value,
      percentage: 0 // Calculate percentage if needed
    }));
  
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  
  const handlePieClick = (data: any, index: number) => {
    setActiveIndex(index === activeIndex ? null : index);
  };
  
  const renderLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    
    return (
      <text 
        x={x} 
        y={y} 
        fill="#fff" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${formatPercent(percent * 100)}`}
      </text>
    );
  };
  
  return (
    <div className="h-full">
      <h2 className="text-lg font-medium mb-4">Emergency Funding Breakdown</h2>
      <div className="h-80">
        {fundingData && fundingData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={fundingData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderLabel}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                onClick={handlePieClick}
                isAnimationActive={true}
                animationDuration={800}
              >
                {fundingData.map((entry: any, index: number) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]} 
                    stroke={index === activeIndex ? '#000' : '#fff'} 
                    strokeWidth={index === activeIndex ? 2 : 1}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
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

// Use dynamic import only for the whole component
export default dynamic(() => Promise.resolve(EmergencyFundingPieChart), { ssr: false }); 