'use client';

import { useState } from 'react';
import { 
  BarChart,
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
} from 'recharts';
import { useData } from '@/context/DataContext';
import { formatCurrency } from '@/utils/formatters';

interface TopEntityBarChartProps {
  entityType: 'recipient' | 'program';
}

// Custom colors for the bars
const COLORS = {
  bar: '#10b981', // emerald green for allocations
  barHover: '#059669', // darker green
};

export default function TopEntityBarChart({ entityType }: TopEntityBarChartProps) {
  const { state } = useData();
  const { chartData } = state;
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  
  const rawData = entityType === 'recipient' 
    ? (chartData?.topRecipients || [])
    : (chartData?.topPrograms || []);
    
  // Sort data by allocation amount and take top 5
  const data = [...rawData]
    .sort((a, b) => b.allocations - a.allocations)
    .slice(0, 5)
    .map(item => ({
      name: item.name,
      value: item.allocations // Simplify to just show allocations
    }));
  
  // Handle clicking on a bar to highlight it
  const handleBarClick = (data: any, index: number) => {
    setActiveIndex(index === activeIndex ? null : index);
  };
  
  return (
    <div className="h-full">
      {data && data.length > 0 ? (
        <div className="h-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
              <XAxis 
                type="number" 
                tickFormatter={(value) => formatCurrency(value, true)} 
                axisLine={{ stroke: '#e5e7eb' }}
                tick={{ fill: '#6b7280', fontSize: 12 }}
              />
              <YAxis 
                type="category" 
                dataKey="name" 
                width={120}
                axisLine={{ stroke: '#e5e7eb' }}
                tick={{ fill: '#6b7280', fontSize: 12 }}
                tickFormatter={(value) => value.length > 15 ? `${value.substring(0, 13)}...` : value}
              />
              <Tooltip 
                formatter={(value: number) => formatCurrency(value)} 
                labelFormatter={(label) => label}
              />
              <Bar
                dataKey="value"
                name="Allocations"
                fill={COLORS.bar}
                radius={[0, 4, 4, 0]}
                onClick={handleBarClick}
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={index === activeIndex ? COLORS.barHover : COLORS.bar}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500">No data available</p>
        </div>
      )}
    </div>
  );
} 