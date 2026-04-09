'use client'

import { useRouter } from 'next/navigation'
import { TrendingUp, AlertCircle, Calendar, Phone, Users, ArrowUp, FileText } from 'lucide-react'
import { LineChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

const SALES_TREND = [
  { mesic: 'Led', value: 2 },
  { mesic: 'Úno', value: 3 },
  { mesic: 'Bře', value: 2 },
  { mesic: 'Dub', value: 4 },
  { mesic: 'Kvě', value: 3 },
  { mesic: 'Čvn', value: 5 },
]

const RECENT_ACTIVITY = [
  { icon: Users, label: 'Nová poptávka', desc: 'Byt 3+kk, Praha 7 — Holešovice', time: 'před 10 min', color: 'text-green-400', bg: 'bg-green-400/10' },
  { icon: Calendar, label: 'Prohlídka naplánována', desc: 'PRG-005 Loftový prostor, Holešovice', time: 'před 2 h', color: 'text-blue-400', bg: 'bg-blue-400/10' },
  { icon: FileText, label: 'Smlouva odeslána', desc: 'Rezervační smlouva — Ing. Kratochvíl', time: 'před 5 h', color: 'text-indigo-400', bg: 'bg-indigo-400/10' },
  { icon: Phone, label: 'Hovor zaznamenán', desc: 'Vladimír Novotný — PRG-002 vyjednávání', time: 'před 6 h', color: 'text-amber-400', bg: 'bg-amber-400/10' },
  { icon: AlertCircle, label: 'Audit upozornění', desc: 'PRG-006 chybí energetická třída', time: 'dnes 8:00', color: 'text-red-400', bg: 'bg-red-400/10' },
]

const TOP_PROPERTIES = [
  { code: 'PRG-005', name: 'Loftový prostor Holešovice', price: '22,5M Kč', yield: '4,86%', interest: '+18% zájem', img: '🏭' },
  { code: 'PRG-009', name: 'Byt Pařížská, Staré Město', price: '45,0M Kč', yield: '4,1%', interest: '+24% zájem', img: '🏛' },
  { code: 'PRG-013', name: 'Kancelář Karlín LEED', price: '21,0M Kč', yield: '4,11%', interest: '+12% zájem', img: '🏢' },
]

export default function DashboardPage() {
  const router = useRouter()

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-gray-950">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Přehled</h2>
        <p className="text-xs text-gray-500">{new Date().toLocaleDateString('cs-CZ', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Nových poptávek', value: '12', sub: '+20% tento týden', icon: Users, color: 'text-green-400', border: 'border-green-400/30', href: '/leads' },
          { label: 'Aktivních obchodů', value: '8', sub: '+14% tento týden', icon: TrendingUp, color: 'text-indigo-400', border: 'border-indigo-400/30', href: '/analytics' },
          { label: 'Úkolů k vyřízení', value: '24', sub: '+12% tento týden', icon: AlertCircle, color: 'text-amber-400', border: 'border-amber-400/30', href: '/leads' },
        ].map(stat => (
          <button
            key={stat.label}
            type="button"
            onClick={() => router.push(stat.href)}
            className={`bg-gray-900 rounded-xl p-5 border ${stat.border} text-left hover:opacity-80 transition-opacity group shadow-md`}
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-gray-400">{stat.label}</p>
              <stat.icon size={16} className={stat.color} />
            </div>
            <p className={`text-4xl font-bold ${stat.color}`}>{stat.value}</p>
            <div className="flex items-center gap-1 mt-2">
              <ArrowUp size={12} className="text-green-400" />
              <p className="text-xs text-green-400">{stat.sub}</p>
            </div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-5 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-sm">Přehled aktivit</h3>
            <button type="button" onClick={() => router.push('/calls')} className="text-xs text-indigo-400 hover:text-indigo-300">Vše →</button>
          </div>
          <div className="space-y-3">
            {RECENT_ACTIVITY.map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-lg ${item.bg} flex items-center justify-center flex-shrink-0`}>
                  <item.icon size={14} className={item.color} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{item.label}</p>
                  <p className="text-xs text-gray-500 truncate">{item.desc}</p>
                </div>
                <span className="text-xs text-gray-600 flex-shrink-0">{item.time}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-900 rounded-xl border border-gray-800 p-5 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-sm">Výkon prodeje</h3>
            <button type="button" onClick={() => router.push('/analytics')} className="text-xs text-indigo-400 hover:text-indigo-300">Analytika →</button>
          </div>
          <div className="mb-1">
            <p className="text-3xl font-bold text-green-400">+35%</p>
            <p className="text-xs text-gray-500">tento měsíc</p>
          </div>
          <ResponsiveContainer width="100%" height={140}>
            <LineChart data={SALES_TREND}>
              <XAxis dataKey="mesic" tick={{ fontSize: 10, fill: '#6b7280' }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip
                contentStyle={{ background: '#1f2937', border: '1px solid #374151', borderRadius: '8px', fontSize: '11px' }}
              />
              <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-gray-900 rounded-xl border border-gray-800 p-5 shadow-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-sm">Top nemovitosti</h3>
          <button type="button" onClick={() => router.push('/listings')} className="text-xs text-indigo-400 hover:text-indigo-300">Všechny inzeráty →</button>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {TOP_PROPERTIES.map(prop => (
            <button
              key={prop.code}
              type="button"
              onClick={() => router.push('/listings')}
              className="bg-gray-800 rounded-xl p-4 text-left hover:bg-gray-700 transition-colors group"
            >
              <div className="text-3xl mb-3">{prop.img}</div>
              <p className="text-xs font-mono text-indigo-400 mb-1">{prop.code}</p>
              <p className="text-sm font-medium mb-2 leading-tight">{prop.name}</p>
              <p className="text-lg font-bold text-white">{prop.price}</p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-amber-400">{prop.yield} výnos</span>
                <span className="text-xs text-green-400">{prop.interest}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
