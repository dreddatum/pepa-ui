'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Building2, LayoutDashboard, MessageSquare, Phone, Users, FileText, BarChart2, Calendar, MonitorPlay, Search, Mic, Plus, Settings } from 'lucide-react'

const NAV_ITEMS = [
  { href: '/', icon: MessageSquare, label: 'Chat s Pepou', exact: true },
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/search', icon: Search, label: 'Vyhledávání' },
  { href: '/listings', icon: Building2, label: 'Aktivní inzeráty' },
  { href: '/analytics', icon: BarChart2, label: 'Analytika' },
  { href: '/report', icon: MonitorPlay, label: 'Týdenní report' },
  { href: '/calendar', icon: Calendar, label: 'Kalendář' },
  { href: '/notes', icon: Mic, label: 'Poznámky' },
  { href: '/calls', icon: Phone, label: 'Evidence hovorů' },
  { href: '/leads', icon: Users, label: 'Pipeline leadů' },
  { href: '/admin', icon: Plus, label: 'Přidat data' },
  { href: '/contracts', icon: FileText, label: 'Návrhy smluv' },
  { href: '/settings', icon: Settings, label: 'Nastavení' },
]

export function MobileBottomNav() {
  const pathname = usePathname()

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 flex justify-around py-2 z-50">
      <Link href="/" className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg ${pathname === '/' ? 'text-indigo-400' : 'text-gray-500'}`}>
        <MessageSquare size={20} />
        <span className="text-xs">Chat</span>
      </Link>
      <Link href="/dashboard" className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg ${pathname === '/dashboard' ? 'text-indigo-400' : 'text-gray-500'}`}>
        <LayoutDashboard size={20} />
        <span className="text-xs">Dashboard</span>
      </Link>
      <Link href="/listings" className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg ${pathname === '/listings' ? 'text-indigo-400' : 'text-gray-500'}`}>
        <Building2 size={20} />
        <span className="text-xs">Inzeráty</span>
      </Link>
      <Link href="/leads" className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg ${pathname === '/leads' ? 'text-indigo-400' : 'text-gray-500'}`}>
        <Users size={20} />
        <span className="text-xs">Leady</span>
      </Link>
      <Link href="/analytics" className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg ${pathname === '/analytics' ? 'text-indigo-400' : 'text-gray-500'}`}>
        <BarChart2 size={20} />
        <span className="text-xs">Analytika</span>
      </Link>
    </div>
  )
}

export default function SidebarNav() {
  const pathname = usePathname()

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href
    return pathname.startsWith(href)
  }

  return (
    <div className="w-56 bg-gradient-to-b from-gray-900 to-gray-950 border-r border-gray-800/50 flex flex-col flex-shrink-0">
      <div className="px-4 py-5 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
            <Building2 size={16} />
          </div>
          <div>
            <p className="font-semibold text-sm">Pepa Agent</p>
            <p className="text-xs text-gray-500">Back Office</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {NAV_ITEMS.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
              isActive(item.href, item.exact)
                ? 'bg-indigo-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            <item.icon size={16} />
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="p-3 border-t border-gray-800">
        <div className="flex items-center gap-2 px-3 py-2">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs text-gray-500">Agent online</span>
        </div>
      </div>
    </div>
  )
}
