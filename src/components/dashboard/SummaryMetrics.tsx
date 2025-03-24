'use client';

import { useData } from '@/context/DataContext';
import { formatCurrency, formatPercent } from '@/utils/formatters';

export default function SummaryMetrics() {
  const { state } = useData();
  const summaryMetrics = state.chartData?.summaryMetrics || {
    totalAllocations: 0,
    totalDeallocations: 0,
    netFunding: 0,
    totalEmergencyFunding: 0
  };
  
  const netFundingPercentage = summaryMetrics.totalAllocations > 0 
    ? (summaryMetrics.netFunding / summaryMetrics.totalAllocations) * 100 
    : 0;
  
  const metrics = [
    {
      title: 'Total Allocations',
      value: formatCurrency(summaryMetrics.totalAllocations),
      description: 'Total COVID-19 funding allocated',
      className: 'bg-gradient-to-r from-blue-400 to-blue-500 text-white border-blue-600'
    },
    {
      title: 'Total Deallocations',
      value: formatCurrency(summaryMetrics.totalDeallocations),
      description: 'Total COVID-19 funding deallocated',
      className: 'bg-gradient-to-r from-red-400 to-red-500 text-white border-red-600'
    },
    {
      title: 'Net Funding',
      value: formatCurrency(summaryMetrics.netFunding),
      description: `${formatPercent(netFundingPercentage / 100)} of allocations`,
      className: 'bg-gradient-to-r from-teal-400 to-teal-500 text-white border-teal-600'
    },
    {
      title: 'Emergency Funding',
      value: formatCurrency(summaryMetrics.totalEmergencyFunding),
      description: 'COVID-19 emergency response funding',
      className: 'bg-gradient-to-r from-purple-400 to-purple-500 text-white border-purple-600'
    }
  ];
  
  return (
    <div className="bg-white rounded-lg shadow p-4 border border-blue-100">
      <h2 className="text-xl font-medium mb-3 text-gray-800 border-b pb-2">
        Summary Metrics
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {metrics.map((metric, i) => (
          <div 
            key={i} 
            className={`p-4 rounded-lg ${metric.className} shadow-md transition-all hover:shadow-lg hover:translate-y-[-2px] duration-300 border-b-4`}
          >
            <div>
              <h3 className="text-xs font-semibold uppercase text-white/90">{metric.title}</h3>
              <p className="text-2xl font-extrabold my-2 text-white">{metric.value}</p>
              <p className="text-xs text-white/80">{metric.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 