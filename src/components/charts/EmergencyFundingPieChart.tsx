'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Cell, Tooltip as RechartsTooltip, Legend, PieProps } from 'recharts';
import { useData } from '@/context/DataContext';
import { EmergencyFundingAct } from '@/types/data';
import { formatCurrency, formatPercent } from '@/utils/formatters';

// Dynamically import the PieChart and Pie components with SSR disabled
const PieChart = dynamic(() => import('recharts').then(mod => mod.PieChart), { ssr: false });
const Pie = dynamic(() => import('recharts').then(mod => mod.Pie), { ssr: false });

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

function EmergencyFundingPieChart() {
  const { state, dispatch } = useData();
  const { chartData } = state;
  // Using number instead of number | null to avoid type issues
  const [activeIndex, setActiveIndex] = useState<number>(NaN);
  
  const handlePieClick = (data: any, index: number) => {
    // Using NaN as a sentinel value (not equal to any number, including itself)
    setActiveIndex(Number.isNaN(activeIndex) || activeIndex !== index ? index : NaN);
    
    if (data && data.id) {
      // Filter the dashboard based on clicked segment
      dispatch({
        type: 'SET_FILTER',
        payload: { 
          emergencyFunding: Number.isNaN(activeIndex) || activeIndex !== index ? [data.id] : []
        }
      });
    }
  };
  
  const handlePieMouseEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };
  
  const handlePieMouseLeave = () => {
    setActiveIndex(NaN);
  };

  // Calculate percentages for each slice
  const dataWithPercentage = chartData.emergencyFundingBreakdown.map(item => {
    const total = chartData.emergencyFundingBreakdown.reduce((sum, i) => sum + i.value, 0);
    const percentage = item.value / total;
    return {
      ...item,
      percentage
    };
  });
  
  return (
    <div className="h-full">
      <h2 className="text-lg font-medium mb-4">Distribution by Emergency Funding Act</h2>
      <div className="h-80">
        {chartData.emergencyFundingBreakdown.length > 0 ? (
          <div style={{ width: '100%', height: '100%' }}>
            <PieChart width={500} height={300}>
              <Pie
                data={dataWithPercentage}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                innerRadius={!Number.isNaN(activeIndex) ? 30 : 0}
                fill="#8884d8"
                dataKey="value"
                onClick={handlePieClick}
                onMouseEnter={handlePieMouseEnter}
                onMouseLeave={handlePieMouseLeave}
                activeIndex={Number.isNaN(activeIndex) ? undefined : activeIndex}
                activeShape={(props: any) => {
                  const RADIAN = Math.PI / 180;
                  const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, value, name, percent } = props;
                  const sin = Math.sin(-RADIAN * midAngle);
                  const cos = Math.cos(-RADIAN * midAngle);
                  const sx = cx + (outerRadius + 10) * cos;
                  const sy = cy + (outerRadius + 10) * sin;
                  const mx = cx + (outerRadius + 30) * cos;
                  const my = cy + (outerRadius + 30) * sin;
                  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
                  const ey = my;
                  const textAnchor = cos >= 0 ? 'start' : 'end';
                  
                  return (
                    <g>
                      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill} className="text-sm">
                        {name}
                      </text>
                      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
                      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
                      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333" className="text-xs">
                        {formatCurrency(value)}
                      </text>
                      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999" className="text-xs">
                        {`(${(percent * 100).toFixed(1)}%)`}
                      </text>
                    </g>
                  );
                }}
              >
                {dataWithPercentage.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <RechartsTooltip content={<CustomTooltip />} />
              <Legend
                layout="vertical"
                align="right"
                verticalAlign="middle"
                formatter={(value) => <span className="text-sm text-gray-700">{value}</span>}
              />
            </PieChart>
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
export default dynamic(() => Promise.resolve(EmergencyFundingPieChart), { ssr: false }); 