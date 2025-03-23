import { Suspense } from 'react';

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
              <p className="text-gray-500">Filter controls will go here</p>
            </div>
            
            {/* Main content area */}
            <div className="lg:col-span-9 space-y-6">
              {/* Key metrics */}
              <div className="bg-white p-4 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">Key Metrics</h2>
                <p className="text-gray-500">Summary metrics will go here</p>
              </div>
              
              {/* Visualization area */}
              <div className="bg-white p-4 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">Visualizations</h2>
                <div className="h-64 flex items-center justify-center bg-gray-100 rounded">
                  <p className="text-gray-500">Charts and maps will go here</p>
                </div>
              </div>
              
              {/* Data table */}
              <div className="bg-white p-4 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">Data Explorer</h2>
                <p className="text-gray-500">Data table will go here</p>
              </div>
            </div>
          </div>
        </Suspense>
      </div>
    </main>
  );
} 