import { DataProvider } from '@/context/DataContext';
import dynamic from 'next/dynamic';

// Import the client component wrapper
import ClientDashboard from '@/components/ClientDashboard';

export default function Home() {
  return <ClientDashboard />;
} 