'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Building2, LayoutDashboard, MessageSquare, Phone, Users, FileText, BarChart2, Calendar, MonitorPlay, Search, Mic } from 'lucide-react'

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
  { href: '/contracts', icon: FileText, label: 'Návrhy smluv' },
]

export default function SidebarNav() {
  const pathname = usePathname()

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href
    return pathname.startsWith(href)
  }

  return (
    <div className="w-56 bg-gray-900 border-r border-gray-800 flex flex-col flex-shrink-0">
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
