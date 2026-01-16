import type { Metadata } from 'next'
import './globals.css'
import { Sidebar } from '@/components/layout/Sidebar'

export const metadata: Metadata = {
  title: 'Learn AI Concepts | Interactive Guide',
  description: 'Master artificial intelligence and large language model concepts through beautiful, interactive demonstrations.',
  keywords: ['AI', 'Machine Learning', 'LLM', 'Temperature', 'Attention', 'Transformer', 'Interactive Learning'],
  authors: [{ name: 'Learn AI' }],
  icons: {
    icon: '/favicon.svg',
  },
  openGraph: {
    title: 'Learn AI Concepts',
    description: 'Interactive explorations of AI and LLM concepts',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background text-text min-h-screen antialiased">
        {/* Ambient background gradient */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[100px]" />
        </div>
        
        <Sidebar />
        <main className="main-content p-6 md:p-10 overflow-auto min-h-screen relative">
          {children}
        </main>
      </body>
    </html>
  )
}
