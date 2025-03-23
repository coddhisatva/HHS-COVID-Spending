import type { Metadata } from 'next';
import './globals.css';
import { DataProvider } from '@/context/DataContext';

export const metadata: Metadata = {
  title: 'HHS COVID Spending Dashboard',
  description: 'Visualizing HHS COVID funding data across contracts and financial assistance',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <DataProvider>
          {children}
        </DataProvider>
      </body>
    </html>
  );
} 