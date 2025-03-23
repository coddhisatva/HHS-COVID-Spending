'use client';

import { useData } from '@/context/DataContext';
import { formatCurrency, formatNumber } from '@/utils/formatters';

interface MetricCardProps {
  title: string;
  value: string;
  className?: string;
  icon?: React.ReactNode;
}

function MetricCard({ title, value, className = '', icon }: MetricCardProps) {
  return (
    <div className={`rounded-lg bg-white p-4 shadow ${className}`}>
      <div className="flex items-center">
        {icon && <div className="mr-3">{icon}</div>}
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="mt-1 text-xl font-semibold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
}

export default function SummaryMetrics() {
  const { state } = useData();
  const { summaryData } = state;
  
  return (
    <div>
      <h2 className="text-lg font-medium mb-4">Summary Metrics</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <MetricCard
          title="Total Allocations"
          value={formatCurrency(summaryData.totalAllocations)}
          className="border-l-4 border-green-500"
        />
        <MetricCard
          title="Total Deallocations"
          value={formatCurrency(summaryData.totalDeallocations)}
          className="border-l-4 border-red-500"
        />
        <MetricCard
          title="Total Outlays"
          value={formatCurrency(summaryData.totalOutlays)}
          className="border-l-4 border-blue-500"
        />
        <MetricCard
          title="Recipients"
          value={formatNumber(summaryData.recipientCount)}
        />
        <MetricCard
          title="Programs"
          value={formatNumber(summaryData.programCount)}
        />
        <MetricCard
          title="States"
          value={formatNumber(summaryData.stateCount)}
        />
      </div>
    </div>
  );
} 