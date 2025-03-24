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
      className: 'bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-500'
    },
    {
      title: 'Total Deallocations',
      value: formatCurrency(summaryMetrics.totalDeallocations),
      description: 'Total COVID-19 funding deallocated',
      className: 'bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-500'
    },
    {
      title: 'Net Funding',
      value: formatCurrency(summaryMetrics.netFunding),
      description: `${formatPercent(netFundingPercentage / 100)} of allocations`,
      className: 'bg-gradient-to-r from-teal-50 to-teal-100 border-l-4 border-teal-500'
    },
    {
      title: 'Emergency Funding',
      value: formatCurrency(summaryMetrics.totalEmergencyFunding),
      description: 'COVID-19 emergency response funding',
      className: 'bg-gradient-to-r from-purple-50 to-purple-100 border-l-4 border-purple-500'
    }
  ];
  
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-100">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        Summary Metrics
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, i) => (
          <div 
            key={i} 
            className={`p-5 rounded-lg ${metric.className} shadow-md transition-all hover:shadow-lg hover:translate-y-[-2px] duration-300`}
          >
            <div>
              <h3 className="text-sm font-semibold text-gray-600">{metric.title}</h3>
              <p className="text-2xl font-bold my-2 text-gray-900">{metric.value}</p>
              <p className="text-xs text-gray-600">{metric.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 