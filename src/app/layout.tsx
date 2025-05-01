import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { initializeDatabase } from '@/lib/db';

initializeDatabase().catch(console.error);

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Task Manager',
  description: 'A simple task management application',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="min-h-screen bg-gray-50">
          <header className="bg-blue-600 text-white shadow">
            <div className="container mx-auto p-4">
              <h1 className="text-2xl font-bold">Task Manager</h1>
            </div>
          </header>
          <div className="container mx-auto p-4">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}