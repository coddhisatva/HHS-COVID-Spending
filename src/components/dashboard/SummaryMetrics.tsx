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
      className: 'bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-500',
      icon: (
        <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      )
    },
    {
      title: 'Total Deallocations',
      value: formatCurrency(summaryMetrics.totalDeallocations),
      description: 'Total COVID-19 funding deallocated',
      className: 'bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-500',
      icon: (
        <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
        </svg>
      )
    },
    {
      title: 'Net Funding',
      value: formatCurrency(summaryMetrics.netFunding),
      description: `${formatPercent(netFundingPercentage / 100)} of allocations`,
      className: 'bg-gradient-to-r from-teal-50 to-teal-100 border-l-4 border-teal-500',
      icon: (
        <svg className="w-8 h-8 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 8h6m-5 0a3 3 0 110 6H9l3 3m-3-6h6m6 1a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: 'Emergency Funding',
      value: formatCurrency(summaryMetrics.totalEmergencyFunding),
      description: 'COVID-19 emergency response funding',
      className: 'bg-gradient-to-r from-purple-50 to-purple-100 border-l-4 border-purple-500',
      icon: (
        <svg className="w-8 h-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    }
  ];
  
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-100">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800 flex items-center">
        <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        Summary Metrics
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, i) => (
          <div 
            key={i} 
            className={`p-5 rounded-lg ${metric.className} shadow-md transition-all hover:shadow-lg hover:translate-y-[-2px] duration-300`}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-sm font-semibold text-gray-600">{metric.title}</h3>
                <p className="text-2xl font-bold my-2 text-gray-900">{metric.value}</p>
                <p className="text-xs text-gray-600">{metric.description}</p>
              </div>
              <div className="flex-shrink-0 bg-white/50 p-2 rounded-full shadow-inner">{metric.icon}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 