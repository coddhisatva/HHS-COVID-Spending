'use client';

import React, { useEffect, useState } from 'react';
import { DataProvider } from '@/context/DataContext';
import FilterPanel from '@/components/filters/FilterPanel';
import SummaryMetrics from '@/components/dashboard/SummaryMetrics';
import EmergencyFundingPieChart from '@/components/charts/EmergencyFundingPieChart';
import TopEntityBarChart from '@/components/charts/TopEntityBarChart';
import USMapChart from '@/components/charts/USMapChart';

// Loading skeleton for the dashboard
function DashboardSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-r from-blue-50 to-indigo-100">
      <div className="text-center max-w-xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          HHS COVID Spending Dashboard
        </h2>
        <p className="text-gray-600 mb-8 text-lg">
          Loading visualization components...
        </p>
        <div className="space-y-6">
          <div className="h-8 w-full bg-white/60 rounded-md animate-pulse"></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-40 bg-white/60 rounded-md animate-pulse"></div>
            <div className="h-40 bg-white/60 rounded-md animate-pulse"></div>
          </div>
          <div className="h-64 bg-white/60 rounded-md animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}

// Dashboard layout that directly includes components without dynamic imports
function DashboardContent() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header - Simple text header */}
      <header className="w-full bg-white pt-4 pb-2">
        <div className="w-full max-w-[1200px] mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            HHS COVID Spending Dashboard
          </h1>
          <p className="mt-1 text-gray-600 text-sm md:text-base">
            Visualizing Department of Health and Human Services (HHS) funding data for COVID-19 response
          </p>
        </div>
      </header>
      
      <main className="w-full max-w-[1200px] mx-auto px-4 py-4">
        {/* Filter Panel */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Dashboard Filters</h2>
          <FilterPanel />
        </section>
        
        {/* Summary Metrics */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Summary Metrics</h2>
          <SummaryMetrics />
        </section>
        
        {/* Geographic Distribution Map */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Geographic Distribution</h2>
          <div className="bg-white h-[350px] rounded-lg border border-gray-200 p-4">
            <USMapChart />
          </div>
        </section>
        
        {/* Visualizations in a 2-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Emergency Funding Pie Chart */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Emergency Funding</h2>
            <div className="bg-white h-[350px] rounded-lg border border-gray-200 p-4">
              <EmergencyFundingPieChart />
            </div>
          </section>
          
          {/* Top Recipients */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Top Recipients</h2>
            <div className="bg-white h-[350px] rounded-lg border border-gray-200 p-4">
              <TopEntityBarChart entityType="recipient" />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default function ClientDashboard() {
  const [mounted, setMounted] = useState(false);

  // Ensure component is mounted on client-side to avoid hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <DashboardSkeleton />;
  }

  return (
    <DataProvider>
      <DashboardContent />
    </DataProvider>
  );
} 