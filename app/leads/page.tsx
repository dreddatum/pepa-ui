'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

interface Lead {
  name: string
  company: string
  email: string
  phone: string
  budget: string
  agent: string
  note: string
}

const COLUMNS = [
  {
    label: 'Nový / Kontaktován', color: 'border-blue-500',
    leads: [
      { name: 'Petra Červenková', company: '—', email: '—', phone: '+420 604 234 567', budget: '4,5–6M Kč', agent: '—', note: 'Volala spontánně, zájem o 2+kk Praha' },
      { name: 'Dr. Věra Procházková', company: '—', email: 'vera.prochazkova@seznam.cz', phone: '—', budget: '20–35M Kč', agent: 'Tomáš Kovář', note: 'VIP, hledá vilu s zahradou' },
      { name: 'Barbora Hovorková', company: 'Komerční Banka', email: 'b.hovorkova@kb.cz', phone: '+420 602 456 890', budget: '6–9M Kč', agent: 'Jana Nováčková', note: 'Zájem o PRG-020, čeká na hypotéku' },
      { name: 'Eva Chaloupková', company: '—', email: 'eva.ch@hotmail.com', phone: '+420 605 012 678', budget: '5–7M Kč', agent: '—', note: 'Nový lead ze Sreality, Holešovice' },
    ]
  },
  {
    label: 'Kvalifikovaný / Nabídka', color: 'border-amber-500',
    leads: [
      { name: 'Mgr. Lenka Horáčková', company: '—', email: 'lenka.horackova@gmail.com', phone: '+420 777 123 456', budget: '6–8,5M Kč', agent: 'Jana Nováčková', note: 'Mladá rodina, 2+kk nebo 3+kk' },
      { name: 'Robert Šimánek', company: 'Dev Group', email: 'r.simanek@devgroup.eu', phone: '+420 603 987 654', budget: '8–15M Kč', agent: 'Martin Blažek', note: 'Developer, komerční prostor Karlín' },
      { name: 'Ing. arch. Michal Dlouhý', company: 'Arch Studio', email: 'm.dlouhy@archstudio.cz', phone: '+420 777 890 123', budget: '30–60M Kč', agent: 'Martin Blažek', note: 'Pozemek pro 30+ bytů' },
      { name: 'MUDr. Ondřej Fiala', company: 'Private Clinic', email: 'o.fiala@privateclinic.cz', phone: '+420 728 901 234', budget: '8–12M Kč', agent: 'Tomáš Kovář', note: 'Investiční záměr, diverzifikace' },
      { name: 'Ing. Radek Horálek', company: 'Penta Investments', email: 'r.horalek@penta.cz', phone: '+420 776 789 345', budget: '50–100M Kč', agent: 'Tomáš Kovář', note: 'Development plot Holešovice' },
    ]
  },
  {
    label: 'Jednáme', color: 'border-green-500',
    leads: [
      { name: 'Ing. Pavel Kratochvíl', company: 'InvestCorp', email: 'p.kratochvil@investcorp.cz', phone: '+420 602 345 678', budget: '15–25M Kč', agent: 'Tomáš Kovář', note: 'Cash-flow investice, min. 5% výnos' },
      { name: 'Tomáš Bureš', company: 'SB Invest', email: 'tomas.bures@sb-invest.cz', phone: '+420 725 678 901', budget: '10–20M Kč', agent: 'Tomáš Kovář', note: 'VIP investor, Holešovice' },
      { name: 'Vladimír Novotný', company: 'Novotný Real', email: 'v.novotny@novotny-real.cz', phone: '+420 739 567 012', budget: '18–28M Kč', agent: 'Martin Blažek', note: 'Vyjednává tvrdě, PRG-002' },
    ]
  },
]

export default function LeadsPage() {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <h2 className="text-lg font-semibold mb-6">Pipeline leadů</h2>
      <div className="grid grid-cols-3 gap-4">
        {COLUMNS.map(col => (
          <div key={col.label} className={`bg-gray-900 rounded-xl p-4 border-t-2 ${col.color} border-x border-b border-gray-800`}>
            <p className="text-xs font-medium text-gray-400 mb-3">{col.label} <span className="text-gray-600">({col.leads.length})</span></p>
            <div className="space-y-2">
              {col.leads.map(lead => (
                <div
                  key={lead.name}
                  onClick={() => setSelectedLead(lead)}
                  className="bg-gray-800 rounded-lg px-3 py-2 cursor-pointer hover:bg-gray-700 transition-colors"
                >
                  <p className="font-medium text-xs text-white">{lead.name}</p>
                  <p className="text-xs text-gray-500">{lead.company} · {lead.budget}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {selectedLead && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-xl border border-gray-700 p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold">{selectedLead.name}</h2>
              <button type="button" onClick={() => setSelectedLead(null)} className="text-gray-400 hover:text-white">
                <X size={20} />
              </button>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 space-y-2 mb-4">
              {([
                { label: 'Firma', value: selectedLead.company },
                { label: 'Email', value: selectedLead.email, color: 'text-indigo-400' },
                { label: 'Telefon', value: selectedLead.phone, color: 'text-green-400' },
                { label: 'Rozpočet', value: selectedLead.budget },
                { label: 'Agent', value: selectedLead.agent },
              ] as { label: string; value: string; color?: string }[]).map(row => (
                <div key={row.label} className="flex justify-between text-sm">
                  <span className="text-gray-400">{row.label}</span>
                  <span className={row.color || 'text-white'}>{row.value}</span>
                </div>
              ))}
            </div>
            {selectedLead.note && (
              <div className="bg-gray-800 rounded-lg p-3 mb-4">
                <p className="text-xs text-gray-500 mb-1">Poznámka</p>
                <p className="text-sm text-gray-300">{selectedLead.note}</p>
              </div>
            )}
            <button type="button" onClick={() => setSelectedLead(null)} className="w-full bg-gray-800 hover:bg-gray-700 py-2 rounded-lg text-sm transition-colors">
              Zavřít
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
