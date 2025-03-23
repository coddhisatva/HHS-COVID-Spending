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
  const { summaryMetrics, filteredRecords } = state;
  
  // Calculate totals based on filtered records
  const totalAllocations = filteredRecords.reduce(
    (sum, record) => sum + (record.obligationAmount > 0 ? record.obligationAmount : 0),
    0
  );
  
  const totalDeallocations = filteredRecords.reduce(
    (sum, record) => sum + (record.obligationAmount < 0 ? record.obligationAmount : 0),
    0
  );
  
  const totalOutlays = filteredRecords.reduce(
    (sum, record) => sum + record.outlay,
    0
  );
  
  // Calculate unique recipients and programs
  const uniqueRecipients = new Set(filteredRecords.map(record => record.recipient));
  const uniquePrograms = new Set(filteredRecords.map(record => record.program));
  const uniqueStates = new Set(filteredRecords.map(record => record.recipientState));
  
  return (
    <div>
      <h2 className="text-lg font-medium mb-4">Summary Metrics</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <MetricCard
          title="Total Allocations"
          value={formatCurrency(totalAllocations)}
          className="border-l-4 border-allocation"
        />
        <MetricCard
          title="Total Deallocations"
          value={formatCurrency(Math.abs(totalDeallocations))}
          className="border-l-4 border-deallocation"
        />
        <MetricCard
          title="Total Outlays"
          value={formatCurrency(totalOutlays)}
          className="border-l-4 border-primary-600"
        />
        <MetricCard
          title="Recipients"
          value={formatNumber(uniqueRecipients.size)}
        />
        <MetricCard
          title="Programs"
          value={formatNumber(uniquePrograms.size)}
        />
        <MetricCard
          title="States"
          value={formatNumber(uniqueStates.size)}
        />
      </div>
    </div>
  );
} 