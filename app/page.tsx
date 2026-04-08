'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'

// Nav items — chat, dashboard, calls, leads zůstanou jako setView
// Contracts jde jako Link

import { Send, Bot, User, Loader2, Building2, LayoutDashboard, Users, Phone, MessageSquare, TrendingUp, AlertCircle, FileText, BarChart2 } from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const SUGGESTED_QUERIES = [
  'Jaké nové klienty máme za 1. kvartál?',
  'Najdi nemovitosti s chybějícími daty',
  'Kolik aktivních nemovitostí máme?',
  'Shrň výsledky tohoto týdne',
  'Jaký je stav trhu v Holešovicích?',
]

const DASHBOARD_STATS = [
  { label: 'Aktivní nemovitosti', value: '11', sub: 'z 20 celkem', color: 'text-indigo-400' },
  { label: 'Hodnota portfolia', value: '114,5M', sub: 'aktuální ocenění', color: 'text-green-400' },
  { label: 'Aktivní leady', value: '17', sub: '3 v jednání', color: 'text-amber-400' },
  { label: 'Průměrný výnos', value: '3,95%', sub: 'p.a.', color: 'text-blue-400' },
]

const CALL_LOG = [
  { name: 'Ing. Pavel Kratochvíl', company: 'InvestCorp', date: '08.04.2026', duration: '12 min', note: 'Zájem o PRG-005, čeká na hypotéku' },
  { name: 'Vladimír Novotný', company: 'Novotný Real', date: '07.04.2026', duration: '8 min', note: 'Vyjednávání ceny PRG-002' },
  { name: 'MUDr. Ondřej Fiala', company: 'Private Clinic', date: '05.04.2026', duration: '15 min', note: 'Zájem o komerční prostory' },
]

type View = 'chat' | 'dashboard' | 'calls' | 'leads'

export default function Home() {
  const [view, setView] = useState<View>('chat')
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [newCall, setNewCall] = useState({ name: '', note: '' })
  const [calls, setCalls] = useState(CALL_LOG)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMessages([{
      id: '0',
      role: 'assistant',
      content: 'Dobrý den. Jsem <strong>Pepa</strong>, váš operační agent pro správu nemovitostního portfolia. Jak vám mohu pomoci?',
      timestamp: new Date(),
    }])
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return
    const userMessage: Message = { id: Date.now().toString(), role: 'user', content: text, timestamp: new Date() }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      })
      const data = await response.json()
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response || 'Žádná odpověď.',
        timestamp: new Date(),
      }])
    } catch {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Chyba připojení. Zkuste to prosím znovu.',
        timestamp: new Date(),
      }])
    } finally {
      setLoading(false)
    }
  }

  const addCall = () => {
    if (!newCall.name) return
    setCalls(prev => [{
      name: newCall.name,
      company: '—',
      date: new Date().toLocaleDateString('cs-CZ'),
      duration: '—',
      note: newCall.note,
    }, ...prev])
    setNewCall({ name: '', note: '' })
  }

  const navItems = [
    { id: 'chat' as View, icon: MessageSquare, label: 'Chat s Pepou' },
    { id: 'dashboard' as View, icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'calls' as View, icon: Phone, label: 'Evidence hovorů' },
    { id: 'leads' as View, icon: Users, label: 'Pipeline leadů' },
  ]

  return (
    <div className="flex h-screen bg-gray-950 text-white">
      {/* Sidebar */}
      <div className="w-56 bg-gray-900 border-r border-gray-800 flex flex-col">
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
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                view === item.id
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <item.icon size={16} />
              {item.label}
            </button>
          ))}
          <Link
            href="/contracts"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          >
            <FileText size={16} />
            Návrhy smluv
          </Link>
          <Link
            href="/listings"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          >
            <Building2 size={16} />
            Aktivní inzeráty
          </Link>
          <Link
            href="/analytics"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          >
            <BarChart2 size={16} />
            Analytika+
          </Link>
        </nav>
        <div className="p-3 border-t border-gray-800">
          <div className="flex items-center gap-2 px-3 py-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs text-gray-500">Agent online</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Dashboard */}
        {view === 'dashboard' && (
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
        )}

        {/* Evidence hovorů */}
        {view === 'calls' && (
          <div className="flex-1 overflow-y-auto p-6">
            <h2 className="text-lg font-semibold mb-6">Evidence hovorů</h2>
            <div className="bg-gray-900 rounded-xl p-4 border border-gray-800 mb-6">
              <p className="text-sm text-gray-500 mb-3">Přidat nový hovor</p>
              <div className="flex gap-3">
                <input
                  value={newCall.name}
                  onChange={e => setNewCall(p => ({ ...p, name: e.target.value }))}
                  placeholder="Jméno klienta"
                  className="flex-1 bg-gray-800 rounded-lg px-3 py-2 text-sm outline-none border border-gray-700 focus:border-indigo-500"
                />
                <input
                  value={newCall.note}
                  onChange={e => setNewCall(p => ({ ...p, note: e.target.value }))}
                  placeholder="Poznámka"
                  className="flex-1 bg-gray-800 rounded-lg px-3 py-2 text-sm outline-none border border-gray-700 focus:border-indigo-500"
                />
                <button
                  onClick={addCall}
                  className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg text-sm transition-colors"
                >
                  Přidat
                </button>
              </div>
            </div>
            <div className="space-y-3">
              {calls.map((call, i) => (
                <div key={i} className="bg-gray-900 rounded-xl p-4 border border-gray-800">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-sm">{call.name}</p>
                      <p className="text-xs text-gray-500">{call.company} · {call.duration}</p>
                    </div>
                    <span className="text-xs text-gray-600">{call.date}</span>
                  </div>
                  {call.note && <p className="text-sm text-gray-400 mt-2">{call.note}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pipeline leadů */}
        {view === 'leads' && (
          <div className="flex-1 overflow-y-auto p-6">
            <h2 className="text-lg font-semibold mb-6">Pipeline leadů</h2>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Nový / Kontaktován', color: 'border-blue-500', leads: ['Petra Červenková', 'Dr. Věra Procházková', 'Barbora Hovorková', 'Eva Chaloupková'] },
                { label: 'Kvalifikovaný / Nabídka', color: 'border-amber-500', leads: ['Mgr. Lenka Horáčková', 'Robert Šimánek', 'Ing. arch. Michal Dlouhý', 'MUDr. Ondřej Fiala', 'Ing. Radek Horálek'] },
                { label: 'Jednáme', color: 'border-green-500', leads: ['Ing. Pavel Kratochvíl', 'Tomáš Bureš', 'Vladimír Novotný'] },
              ].map(col => (
                <div key={col.label} className={`bg-gray-900 rounded-xl p-4 border-t-2 ${col.color} border-x border-b border-gray-800`}>
                  <p className="text-xs font-medium text-gray-400 mb-3">{col.label}</p>
                  <div className="space-y-2">
                    {col.leads.map(lead => (
                      <div key={lead} className="bg-gray-800 rounded-lg px-3 py-2 text-sm text-gray-300">
                        {lead}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Chat */}
        {view === 'chat' && (
          <>
            <div className="px-6 py-4 border-b border-gray-800 bg-gray-900">
              <h2 className="font-medium text-sm">Chat s Pepou</h2>
              <p className="text-xs text-gray-500">AI agent připojený na živá data</p>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${message.role === 'assistant' ? 'bg-indigo-600' : 'bg-gray-700'}`}>
                    {message.role === 'assistant' ? <Bot size={16} /> : <User size={16} />}
                  </div>
                  <div className={`max-w-[75%] flex flex-col gap-1 ${message.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${message.role === 'assistant' ? 'bg-gray-800 text-gray-100 rounded-tl-sm' : 'bg-indigo-600 text-white rounded-tr-sm'}`}>
                      <div dangerouslySetInnerHTML={{ __html: message.content }} />
                    </div>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                    <Bot size={16} />
                  </div>
                  <div className="bg-gray-800 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-2">
                    <Loader2 size={16} className="animate-spin text-indigo-400" />
                    <span className="text-sm text-gray-400">Pepa analyzuje data...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            {messages.length <= 1 && (
              <div className="px-4 pb-2">
                <div className="flex flex-wrap gap-2">
                  {SUGGESTED_QUERIES.map((query) => (
                    <button key={query} onClick={() => sendMessage(query)} className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1.5 rounded-full border border-gray-700 transition-colors">
                      {query}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div className="px-4 pb-4 pt-2">
              <div className="flex gap-3 bg-gray-800 rounded-2xl border border-gray-700 px-4 py-3">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
                  placeholder="Napište dotaz pro Pepu..."
                  className="flex-1 bg-transparent text-white placeholder-gray-500 text-sm outline-none"
                  disabled={loading}
                />
                <button onClick={() => sendMessage(input)} disabled={loading || !input.trim()} className="w-8 h-8 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 flex items-center justify-center transition-colors">
                  <Send size={14} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}