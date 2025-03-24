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
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {/* Total Allocations */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="text-lg font-medium text-gray-900">Total Allocations</h3>
        <p className="text-2xl font-bold text-gray-900 mt-2">{formatCurrency(summaryMetrics.totalAllocations)}</p>
        <p className="text-sm text-gray-600 mt-1">Total COVID-19 funding allocated</p>
      </div>
      
      {/* Total Deallocations */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="text-lg font-medium text-gray-900">Total Deallocations</h3>
        <p className="text-2xl font-bold text-gray-900 mt-2">{formatCurrency(summaryMetrics.totalDeallocations)}</p>
        <p className="text-sm text-gray-600 mt-1">Total COVID-19 funding deallocated</p>
      </div>
      
      {/* Net Funding */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="text-lg font-medium text-gray-900">Net Funding</h3>
        <p className="text-2xl font-bold text-gray-900 mt-2">{formatCurrency(summaryMetrics.netFunding)}</p>
        <p className="text-sm text-gray-600 mt-1">{formatPercent(netFundingPercentage / 100)} of allocations</p>
      </div>
      
      {/* Emergency Funding */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="text-lg font-medium text-gray-900">Emergency Funding</h3>
        <p className="text-2xl font-bold text-gray-900 mt-2">{formatCurrency(summaryMetrics.totalEmergencyFunding)}</p>
        <p className="text-sm text-gray-600 mt-1">COVID-19 emergency response funding</p>
      </div>
    </div>
  );
} 