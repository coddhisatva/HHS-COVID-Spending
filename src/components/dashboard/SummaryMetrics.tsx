'use client';

import { useData } from '@/context/DataContext';
import { formatCurrency, formatPercent } from '@/utils/formatters';

export default function SummaryMetrics() {
  const { state } = useData();
  const summaryMetrics = state.chartData?.summaryMetrics || {
    totalAllocations: 173047914677,
    totalDeallocations: 3235800720,
    netFunding: 169812113957,
    totalEmergencyFunding: 140000000000
  };
  
  const netFundingPercentage = summaryMetrics.totalAllocations > 0 
    ? (summaryMetrics.netFunding / summaryMetrics.totalAllocations) * 100 
    : 0;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Allocations */}
      <div className="bg-white border border-gray-200 rounded-lg p-5">
        <h3 className="text-lg font-semibold text-gray-700">Total Allocations</h3>
        <p className="text-2xl md:text-3xl font-bold text-gray-900 my-2">{formatCurrency(summaryMetrics.totalAllocations)}</p>
        <p className="text-sm text-gray-500">Total COVID-19 funding allocated</p>
      </div>
      
      {/* Total Deallocations */}
      <div className="bg-white border border-gray-200 rounded-lg p-5">
        <h3 className="text-lg font-semibold text-gray-700">Total Deallocations</h3>
        <p className="text-2xl md:text-3xl font-bold text-gray-900 my-2">{formatCurrency(summaryMetrics.totalDeallocations)}</p>
        <p className="text-sm text-gray-500">Total COVID-19 funding deallocated</p>
      </div>
      
      {/* Net Funding */}
      <div className="bg-white border border-gray-200 rounded-lg p-5">
        <h3 className="text-lg font-semibold text-gray-700">Net Funding</h3>
        <p className="text-2xl md:text-3xl font-bold text-gray-900 my-2">{formatCurrency(summaryMetrics.netFunding)}</p>
        <p className="text-sm text-gray-500">{formatPercent(netFundingPercentage / 100)} of allocations</p>
      </div>
      
      {/* Emergency Funding */}
      <div className="bg-white border border-gray-200 rounded-lg p-5">
        <h3 className="text-lg font-semibold text-gray-700">Emergency Funding</h3>
        <p className="text-2xl md:text-3xl font-bold text-gray-900 my-2">{formatCurrency(summaryMetrics.totalEmergencyFunding)}</p>
        <p className="text-sm text-gray-500">COVID-19 emergency response funding</p>
      </div>
    </div>
  );
} 