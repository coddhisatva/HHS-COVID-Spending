import { Suspense } from 'react';
import FilterPanel from '@/components/filters/FilterPanel';
import SummaryMetrics from '@/components/dashboard/SummaryMetrics';
import EmergencyFundingPieChart from '@/components/charts/EmergencyFundingPieChart';
import TopEntityBarChart from '@/components/charts/TopEntityBarChart';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            HHS COVID Spending Dashboard
          </h1>
          <p className="text-lg text-gray-600">
            Visualizing Department of Health and Human Services (HHS) funding data
          </p>
        </header>
        
        <Suspense fallback={<div className="text-center py-10">Loading dashboard...</div>}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-3 bg-white p-4 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Filters</h2>
              <FilterPanel />
            </div>
            
            {/* Main content area */}
            <div className="lg:col-span-9 space-y-6">
              {/* Key metrics */}
              <div className="bg-white p-4 rounded-lg shadow">
                <SummaryMetrics />
              </div>
              
              {/* Visualization area */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Emergency Funding Pie Chart */}
                <div className="bg-white p-4 rounded-lg shadow">
                  <EmergencyFundingPieChart />
                </div>
                
                {/* Top Recipients Bar Chart */}
                <div className="bg-white p-4 rounded-lg shadow">
                  <TopEntityBarChart entityType="recipient" />
                </div>
                
                {/* Top Programs Bar Chart */}
                <div className="bg-white p-4 rounded-lg shadow md:col-span-2">
                  <TopEntityBarChart entityType="program" />
                </div>
              </div>
              
              {/* Data table */}
              <div className="bg-white p-4 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">Data Explorer</h2>
                <p className="text-gray-500">Data table will be implemented in the next phase</p>
              </div>
            </div>
          </div>
        </Suspense>
      </div>
    </main>
  );
} 