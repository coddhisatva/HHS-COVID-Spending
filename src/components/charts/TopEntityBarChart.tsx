'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  LabelList 
} from 'recharts';
import { useData } from '@/context/DataContext';
import { formatCurrency, truncateString } from '@/utils/formatters';

// Dynamically import the chart components
const BarChart = dynamic(() => import('recharts').then(mod => mod.BarChart), { ssr: false });
const Bar = dynamic(() => import('recharts').then(mod => mod.Bar), { ssr: false });

interface TopEntityBarChartProps {
  entityType: 'recipient' | 'program';
}

// Custom tooltip component for the bar chart
const CustomTooltip = ({ active, payload, entityType }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 shadow-md rounded border border-gray-200">
        <p className="font-semibold text-gray-900">{data.name}</p>
        <p className="text-gray-700">
          Allocations: {formatCurrency(data.allocations)}
        </p>
        {data.deallocations > 0 && (
          <p className="text-gray-700">
            Deallocations: {formatCurrency(data.deallocations)}
          </p>
        )}
        <p className="text-gray-700">
          Net: {formatCurrency(data.allocations - data.deallocations)}
        </p>
      </div>
    );
  }
  
  return null;
};

function TopEntityBarChart({ entityType }: TopEntityBarChartProps) {
  const { state, dispatch } = useData();
  const { chartData } = state;
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  
  const data = entityType === 'recipient' 
    ? chartData.topRecipients 
    : chartData.topPrograms;
  
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
  
  return (
    <div className="h-full">
      <h2 className="text-lg font-medium mb-4">{title}</h2>
      <div className="h-80">
        {data.length > 0 ? (
          <div style={{ width: '100%', height: '100%' }}>
            <BarChart
              width={500}
              height={300}
              data={data}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis
                type="number"
                tickFormatter={(value) => formatCurrency(value)}
              />
              <YAxis
                dataKey="name"
                type="category"
                width={120}
                tickFormatter={(value) => truncateString(value, 15)}
              />
              <Tooltip content={<CustomTooltip entityType={entityType} />} />
              <Legend />
              <Bar
                dataKey="allocations"
                name="Allocations"
                fill="#4ade80"
                onClick={handleBarClick}
                className="cursor-pointer"
              >
                <LabelList 
                  dataKey="allocations" 
                  position="right" 
                  formatter={(value: number) => formatCurrency(value)} 
                  style={{ fontSize: '12px' }}
                />
              </Bar>
              <Bar
                dataKey="deallocations"
                name="Deallocations"
                fill="#f87171"
                onClick={handleBarClick}
                className="cursor-pointer"
              >
                <LabelList 
                  dataKey="deallocations" 
                  position="right" 
                  formatter={(value: number) => formatCurrency(value)} 
                  style={{ fontSize: '12px' }}
                />
              </Bar>
            </BarChart>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-gray-500">No data available</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Export a dynamically loaded component with SSR disabled
export default dynamic(() => Promise.resolve(TopEntityBarChart), { ssr: false }); 