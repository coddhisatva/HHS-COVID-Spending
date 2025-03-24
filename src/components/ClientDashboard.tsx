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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header - Full width with blue accent */}
      <header className="w-full bg-gradient-to-r from-blue-700 to-indigo-800 text-white shadow-xl py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold">
            HHS COVID Spending Dashboard
          </h1>
          <p className="mt-2 text-blue-100 md:text-lg max-w-3xl">
            Visualizing Department of Health and Human Services (HHS) funding data for COVID-19 response
          </p>
        </div>
      </header>
      
      <div className="container mx-auto px-4 py-8">
        {/* Filters bar - Horizontal at the top */}
        <div className="mb-8 bg-white rounded-xl shadow-lg p-6 border border-blue-100">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Dashboard Filters
          </h2>
          <FilterPanel />
        </div>
        
        {/* Summary Metrics - Always visible at the top, full width */}
        <div className="mb-8">
          <SummaryMetrics />
        </div>
        
        {/* Main dashboard grid - 2x2 layout for primary visualizations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Map visualization */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-100 transform transition-all hover:shadow-xl">
            <USMapChart />
          </div>
          
          {/* Emergency funding pie chart */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-100 transform transition-all hover:shadow-xl">
            <EmergencyFundingPieChart />
          </div>
          
          {/* Top Recipients */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-100 transform transition-all hover:shadow-xl">
            <TopEntityBarChart entityType="recipient" />
          </div>
          
          {/* Top Programs */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-100 transform transition-all hover:shadow-xl">
            <TopEntityBarChart entityType="program" />
          </div>
        </div>
        
        {/* Data Explorer - Full width at bottom */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6 border border-blue-100">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Data Explorer
          </h2>
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-lg text-center">
            <p className="text-gray-600">Advanced data table will be implemented in the next phase</p>
            <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50" disabled>
              Coming Soon
            </button>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="mt-12 bg-gradient-to-r from-gray-800 to-gray-900 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-lg font-semibold text-white">HHS COVID-19 Funding Data Dashboard</h3>
              <p className="text-gray-400 text-sm mt-1">Visualizing COVID-19 response funding</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">
                &copy; {new Date().getFullYear()} | Built with Next.js & Recharts
              </p>
            </div>
          </div>
        </div>
      </footer>
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