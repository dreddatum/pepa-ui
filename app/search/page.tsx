'use client'

import { useState } from 'react'
import { Search, Building2, Users, X } from 'lucide-react'
import Link from 'next/link'

const PROPERTIES = [
  { code: 'PRG-001', name: 'Bytový dům Holešovice', type: 'byt', district: 'Praha 7 - Holešovice', price: 10500000, status: 'aktivni' },
  { code: 'PRG-002', name: 'Komerční prostory Žižkov', type: 'komerci', district: 'Praha 3 - Žižkov', price: 17800000, status: 'aktivni' },
  { code: 'PRG-003', name: 'Rodinný dům Vinohrady', type: 'dum', district: 'Praha 2 - Vinohrady', price: 26000000, status: 'due_diligence' },
  { code: 'PRG-005', name: 'Loftový prostor Holešovice', type: 'komerci', district: 'Praha 7 - Holešovice', price: 22500000, status: 'aktivni' },
  { code: 'PRG-009', name: 'Byt 3+1 Nusle', type: 'byt', district: 'Praha 4 - Nusle', price: 8100000, status: 'aktivni' },
  { code: 'PRG-010', name: 'Penthouse Pankrác', type: 'byt', district: 'Praha 4 - Pankrác', price: 24000000, status: 'due_diligence' },
  { code: 'PRG-013', name: 'Kancelář Karlín', type: 'komerci', district: 'Praha 8 - Karlín', price: 16000000, status: 'aktivni' },
  { code: 'PRG-020', name: 'Nájemní byt Holešovice Premium', type: 'byt', district: 'Praha 7 - Holešovice', price: 12000000, status: 'aktivni' },
]

const LEADS = [
  { name: 'Ing. Pavel Kratochvíl', company: 'InvestCorp a.s.', email: 'p.kratochvil@investcorp.cz', phone: '+420 602 345 678', budget: '15–25M Kč', status: 'jedname', agent: 'Tomáš Kovář' },
  { name: 'Mgr. Lenka Horáčková', company: '—', email: 'lenka.horackova@gmail.com', phone: '+420 777 123 456', budget: '6–8,5M Kč', status: 'kvalifikovany', agent: 'Jana Nováčková' },
  { name: 'Robert Šimánek', company: 'Dev Group s.r.o.', email: 'r.simanek@devgroup.eu', phone: '+420 603 987 654', budget: '8–15M Kč', status: 'nabidka_odeslana', agent: 'Martin Blažek' },
  { name: 'Dr. Věra Procházková', company: '—', email: 'vera.prochazkova@seznam.cz', phone: '—', budget: '20–35M Kč', status: 'kontaktovan', agent: 'Tomáš Kovář' },
  { name: 'Vladimír Novotný', company: 'Novotný Real s.r.o.', email: 'v.novotny@novotny-real.cz', phone: '+420 739 567 012', budget: '18–28M Kč', status: 'jedname', agent: 'Martin Blažek' },
  { name: 'Ing. Radek Horálek', company: 'Penta Investments', email: 'r.horalek@penta.cz', phone: '+420 776 789 345', budget: '50–100M Kč', status: 'nabidka_odeslana', agent: 'Tomáš Kovář' },
  { name: 'MUDr. Ondřej Fiala', company: 'Fiala Private Clinic', email: 'o.fiala@privateclinic.cz', phone: '+420 728 901 234', budget: '8–12M Kč', status: 'nabidka_odeslana', agent: 'Tomáš Kovář' },
  { name: 'Barbora Hovorková', company: 'Komerční Banka a.s.', email: 'b.hovorkova@kb.cz', phone: '+420 602 456 890', budget: '6–9M Kč', status: 'kontaktovan', agent: 'Jana Nováčková' },
  { name: 'Tomáš Bureš', company: 'SB Invest s.r.o.', email: 'tomas.bures@sb-invest.cz', phone: '+420 725 678 901', budget: '10–20M Kč', status: 'jedname', agent: 'Tomáš Kovář' },
  { name: 'Jan Sedláček', company: 'Sedláček & Partners', email: 'j.sedlacek@sedlacek-law.cz', phone: '+420 732 901 567', budget: '9–14M Kč', status: 'kontaktovan', agent: 'Martin Blažek' },
]

const STATUS_COLORS: Record<string, string> = {
  aktivni: 'bg-green-900 text-green-300',
  due_diligence: 'bg-amber-900 text-amber-300',
  jedname: 'bg-green-900 text-green-300',
  nabidka_odeslana: 'bg-blue-900 text-blue-300',
  kvalifikovany: 'bg-indigo-900 text-indigo-300',
  kontaktovan: 'bg-gray-700 text-gray-300',
}

const STATUS_LABELS: Record<string, string> = {
  aktivni: 'Aktivní', due_diligence: 'Due Diligence',
  jedname: 'Jednáme', nabidka_odeslana: 'Nabídka odeslána',
  kvalifikovany: 'Kvalifikovaný', kontaktovan: 'Kontaktován',
}

const formatPrice = (p: number) => new Intl.NumberFormat('cs-CZ', { style: 'currency', currency: 'CZK', maximumFractionDigits: 0 }).format(p)

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<'all' | 'properties' | 'leads'>('all')

  const q = query.toLowerCase()

  const filteredProperties = PROPERTIES.filter(p =>
    q === '' ? false :
    p.name.toLowerCase().includes(q) ||
    p.code.toLowerCase().includes(q) ||
    p.district.toLowerCase().includes(q) ||
    p.type.toLowerCase().includes(q) ||
    p.status.toLowerCase().includes(q)
  )

  const filteredLeads = LEADS.filter(l =>
    q === '' ? false :
    l.name.toLowerCase().includes(q) ||
    l.company.toLowerCase().includes(q) ||
    l.email.toLowerCase().includes(q) ||
    l.agent.toLowerCase().includes(q) ||
    l.status.toLowerCase().includes(q)
  )

  const showProperties = filter !== 'leads'
  const showLeads = filter !== 'properties'
  const totalResults = (showProperties ? filteredProperties.length : 0) + (showLeads ? filteredLeads.length : 0)

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-lg font-semibold mb-6">Vyhledávání</h2>

        {/* Search input */}
        <div className="relative mb-4">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Hledat nemovitosti, klienty, lokality..."
            className="w-full bg-gray-900 border border-gray-700 rounded-xl pl-11 pr-10 py-3 text-sm outline-none focus:border-indigo-500 transition-colors"
          />
          {query && (
            <button type="button" onClick={() => setQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
              <X size={16} />
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 mb-6">
          {([['all', 'Vše'], ['properties', 'Nemovitosti'], ['leads', 'Klienti']] as const).map(([val, label]) => (
            <button
              key={val}
              type="button"
              onClick={() => setFilter(val)}
              className={`px-3 py-1.5 rounded-lg text-xs transition-colors ${filter === val ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}`}
            >
              {label}
            </button>
          ))}
          {query && <span className="text-xs text-gray-500 ml-2">{totalResults} výsledků</span>}
        </div>

        {/* Empty state */}
        {!query && (
          <div className="text-center py-20 text-gray-600">
            <Search size={40} className="mx-auto mb-3 opacity-30" />
            <p>Zadejte hledaný výraz</p>
            <p className="text-xs mt-1">Hledat lze dle názvu, kódu, lokality, jména klienta...</p>
          </div>
        )}

        {/* No results */}
        {query && totalResults === 0 && (
          <div className="text-center py-20 text-gray-600">
            <p>Žádné výsledky pro „{query}“</p>
          </div>
        )}

        {/* Properties results */}
        {showProperties && filteredProperties.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Building2 size={14} className="text-indigo-400" />
              <span className="text-xs font-medium text-gray-400">Nemovitosti ({filteredProperties.length})</span>
            </div>
            <div className="space-y-2">
              {filteredProperties.map(p => (
                <Link key={p.code} href="/listings" className="block bg-gray-900 rounded-xl border border-gray-800 hover:border-gray-600 p-4 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-indigo-400 bg-indigo-950 px-2 py-0.5 rounded">{p.code}</span>
                      <div>
                        <p className="text-sm font-medium">{p.name}</p>
                        <p className="text-xs text-gray-500">{p.district}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-green-400">{formatPrice(p.price)}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLORS[p.status] || 'bg-gray-700 text-gray-300'}`}>
                        {STATUS_LABELS[p.status] || p.status}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Leads results */}
        {showLeads && filteredLeads.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Users size={14} className="text-green-400" />
              <span className="text-xs font-medium text-gray-400">Klienti ({filteredLeads.length})</span>
            </div>
            <div className="space-y-2">
              {filteredLeads.map(l => (
                <Link key={l.email} href="/leads" className="block bg-gray-900 rounded-xl border border-gray-800 hover:border-gray-600 p-4 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{l.name}</p>
                      <p className="text-xs text-gray-500">{l.company} · {l.phone}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">{l.budget}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLORS[l.status] || 'bg-gray-700 text-gray-300'}`}>
                        {STATUS_LABELS[l.status] || l.status}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">Agent: {l.agent}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
