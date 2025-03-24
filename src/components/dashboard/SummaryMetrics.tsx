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
      className: 'bg-allocation-light'
    },
    {
      title: 'Total Deallocations',
      value: formatCurrency(summaryMetrics.totalDeallocations),
      description: 'Total COVID-19 funding deallocated',
      className: 'bg-deallocation-light'
    },
    {
      title: 'Net Funding',
      value: formatCurrency(summaryMetrics.netFunding),
      description: `${formatPercent(netFundingPercentage)} of allocations`,
      className: 'bg-primary-50'
    },
    {
      title: 'Emergency Funding',
      value: formatCurrency(summaryMetrics.totalEmergencyFunding),
      description: 'COVID-19 emergency response funding',
      className: 'bg-blue-50'
    }
  ];
  
  return (
    <div>
      <h2 className="text-lg font-medium mb-4">Summary Metrics</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, i) => (
          <div 
            key={i} 
            className={`p-4 rounded-lg ${metric.className} border border-gray-200`}
          >
            <h3 className="text-sm font-medium text-gray-500">{metric.title}</h3>
            <p className="text-2xl font-bold my-1">{metric.value}</p>
            <p className="text-xs text-gray-600">{metric.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
} 