'use client'

import { AlertCircle, TrendingUp } from 'lucide-react'

const DASHBOARD_STATS = [
  { label: 'Aktivní nemovitosti', value: '11', sub: 'z 20 celkem', color: 'text-indigo-400' },
  { label: 'Hodnota portfolia', value: '114,5M', sub: 'aktuální ocenění', color: 'text-green-400' },
  { label: 'Aktivní leady', value: '17', sub: '3 v jednání', color: 'text-amber-400' },
  { label: 'Průměrný výnos', value: '3,95%', sub: 'p.a.', color: 'text-blue-400' },
]

export default function DashboardPage() {
  return (
    <div className="flex-1 overflow-y-auto p-6">
      <h2 className="text-lg font-semibold mb-6">Dashboard portfolia</h2>
      <div className="grid grid-cols-2 gap-4 mb-8">
        {DASHBOARD_STATS.map(stat => (
          <div key={stat.label} className="bg-gray-900 rounded-xl p-5 border border-gray-800">
            <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
            <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-gray-600 mt-1">{stat.sub}</p>
          </div>
        ))}
      </div>
      <div className="bg-gray-900 rounded-xl p-5 border border-gray-800 mb-4">
        <div className="flex items-center gap-2 mb-4">
          <AlertCircle size={16} className="text-amber-400" />
          <h3 className="font-medium text-sm">Auditní upozornění</h3>
        </div>
        <div className="space-y-2">
          {['PRG-006 — Chybí energetická třída, stav', 'PRG-014 — Chybí ocenění, adresa', 'PRG-012 — Chybí pořizovací cena'].map(item => (
            <div key={item} className="flex items-center gap-2 text-sm text-gray-400">
              <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
              {item}
            </div>
          ))}
        </div>
      </div>
      <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={16} className="text-green-400" />
          <h3 className="font-medium text-sm">Tržní monitoring — Holešovice</h3>
        </div>
        <p className="text-sm text-gray-400">Průměr: <strong className="text-white">223 000 Kč/m²</strong> · 105 nabídek · +25% YoY</p>
      </div>
    </div>
  )
}
