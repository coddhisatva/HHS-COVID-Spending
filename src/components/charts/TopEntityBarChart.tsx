'use client';

import { useState } from 'react';
import { 
  BarChart,
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  LabelList,
  ResponsiveContainer, 
  Cell,
} from 'recharts';
import { useData } from '@/context/DataContext';
import { formatCurrency, truncateString } from '@/utils/formatters';

interface TopEntityBarChartProps {
  entityType: 'recipient' | 'program';
}

// Custom colors for better visual
const COLORS = {
  allocations: '#3b82f6', // blue
  allocationsHover: '#2563eb', // darker blue
  deallocations: '#ef4444', // red
  deallocationsHover: '#dc2626', // darker red
  bar: '#3b82f6', // blue
  barHover: '#1d4ed8', // darker blue
};

// Custom tooltip component for the bar chart
const CustomTooltip = ({ active, payload, entityType }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const netAmount = data.allocations - data.deallocations;
    const netPercentage = data.allocations > 0 ? 
      (netAmount / data.allocations) * 100 : 0;
      
    return (
      <div className="bg-white p-4 shadow-xl rounded-lg border border-gray-200">
        <p className="font-semibold text-lg text-gray-900 mb-2 border-b pb-2">{data.name}</p>
        <div className="space-y-1">
          <p className="text-gray-700 font-medium flex justify-between">
            <span>Allocations:</span> 
            <span className="text-blue-600">{formatCurrency(data.allocations)}</span>
          </p>
          {data.deallocations > 0 && (
            <p className="text-gray-700 font-medium flex justify-between">
              <span>Deallocations:</span> 
              <span className="text-red-600">{formatCurrency(data.deallocations)}</span>
            </p>
          )}
          <p className="text-gray-700 font-medium flex justify-between border-t pt-1 mt-1">
            <span>Net Funding:</span>
            <span className={netAmount >= 0 ? "text-blue-600" : "text-red-600"}>
              {formatCurrency(netAmount)}
            </span>
          </p>
          <p className="text-xs text-gray-500 mt-2">
            {data.deallocations > 0 
              ? `${netPercentage.toFixed(1)}% of funds retained` 
              : 'No funds deallocated'}
          </p>
        </div>
      </div>
    );
  }
  
  return null;
};

// Custom legend component
const renderLegend = (props: any) => {
  const { payload } = props;
  
  return (
    <div className="flex justify-center items-center gap-6 mt-4 p-2 bg-blue-50 rounded-md">
      {payload.map((entry: any, index: number) => (
        <div key={`legend-${index}`} className="flex items-center">
          <div 
            className="w-4 h-4 mr-2"
            style={{ 
              backgroundColor: entry.color,
              borderRadius: '3px'
            }}
          />
          <span className="text-sm text-gray-700 font-medium">{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

export default function TopEntityBarChart({ entityType }: TopEntityBarChartProps) {
  const { state, dispatch } = useData();
  const { chartData } = state;
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  
  const rawData = entityType === 'recipient' 
    ? (chartData?.topRecipients || [])
    : (chartData?.topPrograms || []);
    
  // Sort data by allocation amount for better visualization
  const data = [...rawData].sort((a, b) => b.allocations - a.allocations).slice(0, 8);
  
  const title = entityType === 'recipient' 
    ? 'Top Recipients' 
    : 'Top Programs';
  
  // Handle clicking on a bar to filter the dashboard
  const handleBarClick = (data: any, index: number) => {
    setActiveIndex(index === activeIndex ? null : index);
    
    if (data && data.name) {
      const filterProperty = entityType === 'recipient' 
        ? 'selectedRecipient' 
        : 'selectedProgram';
      
      // Set the filter or clear it if already active
      dispatch({
        type: 'SET_FILTER',
        payload: { 
          [filterProperty]: index === activeIndex ? null : data.name 
        }
      });
    }
  };
  
  // Calculate total amounts
  const totalAllocations = data.reduce((sum, item) => sum + item.allocations, 0);
  const totalDeallocations = data.reduce((sum, item) => sum + item.deallocations, 0);
  
  return (
    <div className="h-full">
      <h2 className="text-xl font-medium mb-3 text-gray-800 border-b pb-2">
        {title}
        {entityType === 'recipient' && 
          <span className="text-sm font-normal text-gray-500 ml-2">by allocation amount</span>
        }
      </h2>
      
      <div style={{ height: '300px' }}>
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              barGap={0}
              barCategoryGap={10}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" />
              <XAxis
                type="number"
                tickFormatter={(value) => formatCurrency(value, true)}
                tickCount={5}
                domain={[0, 'dataMax']}
                axisLine={{ stroke: '#e5e7eb' }}
                tick={{ fill: '#6b7280', fontSize: 12 }}
              />
              <YAxis
                dataKey="name"
                type="category"
                width={110}
                tickFormatter={(value) => truncateString(value, 14)}
                tick={{ fontSize: 12, fill: '#6b7280' }}
                axisLine={{ stroke: '#e5e7eb' }}
              />
              <Tooltip content={<CustomTooltip entityType={entityType} />} />
              <Legend content={renderLegend} />
              <Bar
                dataKey="allocations"
                name="Allocations"
                fill={COLORS.allocations}
                onClick={handleBarClick}
                className="cursor-pointer"
                radius={[0, 4, 4, 0]}
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`allocations-${index}`}
                    fill={index === activeIndex ? COLORS.allocationsHover : COLORS.allocations}
                    style={{
                      filter: index === activeIndex ? 'drop-shadow(0px 0px 4px rgba(37,99,235,0.4))' : 'none',
                      transition: 'all 0.3s'
                    }}
                  />
                ))}
                <LabelList 
                  dataKey="allocations" 
                  position="right" 
                  formatter={(value: number) => formatCurrency(value, true)} 
                  style={{ fontSize: '11px', fill: '#374151', fontWeight: 500 }}
                />
              </Bar>
              <Bar
                dataKey="deallocations"
                name="Deallocations"
                fill={COLORS.deallocations}
                onClick={handleBarClick}
                className="cursor-pointer"
                radius={[0, 4, 4, 0]}
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`deallocations-${index}`}
                    fill={index === activeIndex ? COLORS.deallocationsHover : COLORS.deallocations}
                    style={{
                      filter: index === activeIndex ? 'drop-shadow(0px 0px 4px rgba(220,38,38,0.4))' : 'none',
                      transition: 'all 0.3s'
                    }}
                  />
                ))}
                <LabelList 
                  dataKey="deallocations" 
                  position="right" 
                  formatter={(value: number) => formatCurrency(value, true)} 
                  style={{ fontSize: '11px', fill: '#374151', fontWeight: 500 }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-gray-500">No data available</p>
          </div>
        )}
      </div>
      
      {/* Summary statistics */}
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="bg-blue-500 rounded-lg p-3 border-b-4 border-blue-600 shadow-sm text-white">
          <p className="text-xs font-semibold uppercase text-white/90">
            Total Allocations
          </p>
          <p className="text-xl font-bold text-white">{formatCurrency(totalAllocations)}</p>
        </div>
        <div className="bg-red-500 rounded-lg p-3 border-b-4 border-red-600 shadow-sm text-white">
          <p className="text-xs font-semibold uppercase text-white/90">
            Total Deallocations
          </p>
          <p className="text-xl font-bold text-white">{formatCurrency(totalDeallocations)}</p>
        </div>
      </div>
    </div>
  );
} 