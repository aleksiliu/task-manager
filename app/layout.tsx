import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Task Manager',
  description: 'A modern task management application',
  keywords: ['task manager', 'todo list', 'productivity', 'task organization', 'project management'],
  authors: [{ name: 'Task Manager Team' }],
  creator: 'Task Manager'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={`${inter.className} bg-background text-foreground antialiased`}>{children}</body>
    </html>
  );
}
