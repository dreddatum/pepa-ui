'use client'

import { useState } from 'react'

const INITIAL_CALLS = [
  { name: 'Ing. Pavel Kratochvíl', company: 'InvestCorp', date: '08.04.2026', duration: '12 min', note: 'Zájem o PRG-005, čeká na hypotéku' },
  { name: 'Vladimír Novotný', company: 'Novotný Real', date: '07.04.2026', duration: '8 min', note: 'Vyjednávání ceny PRG-002' },
  { name: 'MUDr. Ondřej Fiala', company: 'Private Clinic', date: '05.04.2026', duration: '15 min', note: 'Zájem o komerční prostory' },
]

export default function CallsPage() {
  const [calls, setCalls] = useState(INITIAL_CALLS)
  const [newCall, setNewCall] = useState({ name: '', note: '' })

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

  return (
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
          <button type="button" onClick={addCall} className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg text-sm transition-colors">
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
  )
}
