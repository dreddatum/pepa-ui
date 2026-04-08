'use client'

import { useRouter } from 'next/navigation'
import { Building2, Users, TrendingUp, AlertCircle, Calendar, Phone, ArrowRight, CheckCircle, Clock } from 'lucide-react'

const STATS = [
  { label: 'Aktivní nemovitosti', value: '11', sub: 'z 20 celkem', color: 'text-indigo-400', bg: 'bg-indigo-950 border-indigo-800', href: '/listings' },
  { label: 'Hodnota portfolia', value: '114,5M', sub: 'Kč · aktuální ocenění', color: 'text-green-400', bg: 'bg-green-950 border-green-800', href: '/listings' },
  { label: 'Aktivní leady', value: '17', sub: '3 aktivně v jednání', color: 'text-amber-400', bg: 'bg-amber-950 border-amber-800', href: '/leads' },
  { label: 'Průměrný výnos', value: '3,95%', sub: 'p.a. · portfolio', color: 'text-blue-400', bg: 'bg-blue-950 border-blue-800', href: '/analytics' },
  { label: 'Schůzky tento týden', value: '4', sub: '2 potvrzené', color: 'text-purple-400', bg: 'bg-purple-950 border-purple-800', href: '/calendar' },
  { label: 'Prošlé follow-upy', value: '15', sub: 'vyžadují akci', color: 'text-red-400', bg: 'bg-red-950 border-red-800', href: '/leads' },
]

const AUDIT_ITEMS = [
  { code: 'PRG-006', name: 'Byt Žižkov 2+kk', issue: 'Chybí energetická třída, stav', priority: 'KRITICKÉ', color: 'text-red-400' },
  { code: 'PRG-014', name: 'Pozemek Zbraslav', issue: 'Chybí ocenění, adresa', priority: 'KRITICKÉ', color: 'text-red-400' },
  { code: 'PRG-012', name: 'Rodinný dům Řepy', issue: 'Chybí pořizovací cena', priority: 'VYSOKÉ', color: 'text-amber-400' },
]

const UPCOMING = [
  { client: 'Barbora Hovorková', property: 'PRG-020', date: '10.4.', time: '10:00', status: 'confirmed' },
  { client: 'Ing. Pavel Kratochvíl', property: 'PRG-005', date: '12.4.', time: '14:00', status: 'confirmed' },
  { client: 'Dr. Věra Procházková', property: 'PRG-003', date: '14.4.', time: '11:00', status: 'pending' },
  { client: 'Vladimír Novotný', property: 'PRG-002', date: '15.4.', time: '09:00', status: 'confirmed' },
]

const RECENT_CALLS = [
  { client: 'Ing. Pavel Kratochvíl', note: 'Zájem o PRG-005, čeká na hypotéku', time: 'dnes 10:12' },
  { client: 'Vladimír Novotný', note: 'Vyjednávání ceny PRG-002', time: 'včera 15:30' },
  { client: 'MUDr. Ondřej Fiala', note: 'Zájem o komerční prostory', time: 'včera 11:00' },
]

const TOP_LEADS = [
  { name: 'Ing. Radek Horálek', company: 'Penta Investments', budget: '50–100M Kč', score: 10 },
  { name: 'Ing. Pavel Kratochvíl', company: 'InvestCorp', budget: '15–25M Kč', score: 9 },
  { name: 'Vladimír Novotný', company: 'Novotný Real', budget: '18–28M Kč', score: 9 },
]

export default function DashboardPage() {
  const router = useRouter()

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Dashboard</h2>
        <p className="text-xs text-gray-500">{new Date().toLocaleDateString('cs-CZ', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {STATS.map(stat => (
          <button
            key={stat.label}
            type="button"
            onClick={() => router.push(stat.href)}
            className={`${stat.bg} border rounded-xl p-4 text-left hover:opacity-80 transition-opacity group`}
          >
            <p className="text-xs text-gray-400 mb-1">{stat.label}</p>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            <div className="flex items-center justify-between mt-1">
              <p className="text-xs text-gray-500">{stat.sub}</p>
              <ArrowRight size={12} className="text-gray-600 group-hover:text-gray-400 transition-colors" />
            </div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Audit */}
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <AlertCircle size={14} className="text-amber-400" />
              <span className="text-sm font-medium">Audit dat</span>
            </div>
            <button type="button" onClick={() => router.push('/')} className="text-xs text-indigo-400 hover:text-indigo-300">Řešit →</button>
          </div>
          <div className="space-y-2">
            {AUDIT_ITEMS.map(item => (
              <div key={item.code} className="bg-gray-800 rounded-lg p-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-indigo-400">{item.code}</span>
                  <span className={`text-xs ${item.color}`}>{item.priority}</span>
                </div>
                <p className="text-xs text-gray-400 mt-0.5">{item.issue}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Nadcházející schůzky */}
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-indigo-400" />
              <span className="text-sm font-medium">Schůzky</span>
            </div>
            <button type="button" onClick={() => router.push('/calendar')} className="text-xs text-indigo-400 hover:text-indigo-300">Vše →</button>
          </div>
          <div className="space-y-2">
            {UPCOMING.map((m, i) => (
              <div key={i} className="bg-gray-800 rounded-lg p-2 flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium">{m.client}</p>
                  <p className="text-xs text-gray-500">{m.property} · {m.date} {m.time}</p>
                </div>
                {m.status === 'confirmed'
                  ? <CheckCircle size={14} className="text-green-400 flex-shrink-0" />
                  : <Clock size={14} className="text-amber-400 flex-shrink-0" />
                }
              </div>
            ))}
          </div>
        </div>

        {/* Top leady */}
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Users size={14} className="text-green-400" />
              <span className="text-sm font-medium">Top leady</span>
            </div>
            <button type="button" onClick={() => router.push('/leads')} className="text-xs text-indigo-400 hover:text-indigo-300">Vše →</button>
          </div>
          <div className="space-y-2">
            {TOP_LEADS.map((lead, i) => (
              <div key={i} className="bg-gray-800 rounded-lg p-2 flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium">{lead.name}</p>
                  <p className="text-xs text-gray-500">{lead.company} · {lead.budget}</p>
                </div>
                <span className="text-xs bg-green-900 text-green-300 px-1.5 py-0.5 rounded-full font-bold">{lead.score}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tržní data */}
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <TrendingUp size={14} className="text-green-400" />
              <span className="text-sm font-medium">Trh Holešovice</span>
            </div>
            <button type="button" onClick={() => router.push('/analytics')} className="text-xs text-indigo-400 hover:text-indigo-300">Analytika →</button>
          </div>
          <div className="space-y-2">
            {[
              { label: 'Průměr Kč/m²', value: '223 000 Kč', trend: '+25% YoY', up: true },
              { label: 'Aktivní nabídky', value: '105', trend: '+12 tento týden', up: true },
              { label: 'Průměrná doba', value: '34 dní', trend: '↓ ze 41 dní', up: true },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between bg-gray-800 rounded-lg px-3 py-2">
                <span className="text-xs text-gray-400">{item.label}</span>
                <div className="text-right">
                  <span className="text-xs font-medium text-white">{item.value}</span>
                  <span className="text-xs text-green-400 ml-2">{item.trend}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Poslední hovory */}
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Phone size={14} className="text-blue-400" />
              <span className="text-sm font-medium">Poslední hovory</span>
            </div>
            <button type="button" onClick={() => router.push('/calls')} className="text-xs text-indigo-400 hover:text-indigo-300">Vše →</button>
          </div>
          <div className="space-y-2">
            {RECENT_CALLS.map((call, i) => (
              <div key={i} className="bg-gray-800 rounded-lg p-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium">{call.client}</p>
                  <span className="text-xs text-gray-600">{call.time}</span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">{call.note}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick actions */}
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
          <p className="text-sm font-medium mb-3">Rychlé akce</p>
          <div className="space-y-2">
            {[
              { label: '💬 Zeptat se Pepy', href: '/' },
              { label: '📋 Nová schůzka', href: '/calendar' },
              { label: '🎤 Nahrát poznámku', href: '/notes' },
              { label: '📄 Vygenerovat report', href: '/report' },
              { label: '🔍 Vyhledat klienta', href: '/search' },
            ].map(action => (
              <button
                key={action.label}
                type="button"
                onClick={() => router.push(action.href)}
                className="w-full text-left bg-gray-800 hover:bg-gray-700 rounded-lg px-3 py-2 text-sm text-gray-300 transition-colors flex items-center justify-between group"
              >
                {action.label}
                <ArrowRight size={12} className="text-gray-600 group-hover:text-gray-400" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
