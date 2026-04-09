import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import SidebarNav from '@/components/SidebarNav'

const geist = Geist({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Pepa Agent',
  description: 'Back Office Operations Agent',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="cs">
      <body className={`${geist.className} bg-gray-950 text-white`} suppressHydrationWarning>
        <div className="flex h-screen">
          <SidebarNav />
          <main className="flex min-h-0 flex-1 flex-col overflow-hidden">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
