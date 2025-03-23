'use client';

import { DataProvider } from '@/context/DataContext';
import dynamic from 'next/dynamic';

// Dynamically import client components
const DashboardLayout = dynamic(() => import('@/components/layout/DashboardLayout'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          HHS COVID Spending Dashboard
        </h2>
        <p className="text-gray-600 mb-4">Loading visualization components...</p>
        <div className="animate-pulse flex space-x-4 justify-center">
          <div className="rounded-full bg-slate-300 h-3 w-24"></div>
          <div className="rounded-full bg-slate-300 h-3 w-24"></div>
          <div className="rounded-full bg-slate-300 h-3 w-24"></div>
        </div>
      </div>
    </div>
  ),
});

export default function ClientDashboard() {
  return (
    <DataProvider>
      <DashboardLayout />
    </DataProvider>
  );
} 