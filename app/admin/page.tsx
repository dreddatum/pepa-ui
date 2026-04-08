'use client'

import { useState } from 'react'
import { Plus, Building2, Users, TrendingUp, Check } from 'lucide-react'

type Tab = 'lead' | 'property' | 'transaction'

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>('lead')
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(false)

  const [lead, setLead] = useState({ name: '', phone: '', email: '', budget: '', property_type: '', source: 'web', status: 'novy', note: '' })
  const [property, setProperty] = useState({ code: '', name: '', type: 'byt', district: '', price: '', area: '', floor: '', energy: '', condition: 'dobry', status: 'aktivni' })
  const [transaction, setTransaction] = useState({ property_code: '', client_name: '', type: 'prodej', agreed_price: '', commission: '', status: 'aktivni', note: '' })

  const handleSave = async () => {
    setLoading(true)
    const message = tab === 'lead'
      ? `Přidej nového klienta: jméno ${lead.name}, telefon ${lead.phone}, email ${lead.email}, rozpočet ${lead.budget}, typ nemovitosti ${lead.property_type}, zdroj ${lead.source}, poznámka: ${lead.note}`
      : tab === 'property'
        ? `Přidej novou nemovitost: kód ${property.code}, název ${property.name}, typ ${property.type}, lokalita ${property.district}, cena ${property.price} Kč, plocha ${property.area} m²`
        : `Zapiš transakci: nemovitost ${transaction.property_code}, klient ${transaction.client_name}, typ ${transaction.type}, cena ${transaction.agreed_price} Kč, poznámka: ${transaction.note}`

    try {
      await fetch('/api/agent', {
        method: 'POST',
        cache: 'no-store',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } finally {
      setLoading(false)
    }
  }

  const inputClass = 'w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500'
  const selectClass = 'w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500'

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-gray-950 text-white">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-lg font-semibold mb-6">Admin — Přidat data</h2>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {[
            { id: 'lead' as Tab, icon: Users, label: 'Nový klient' },
            { id: 'property' as Tab, icon: Building2, label: 'Nová nemovitost' },
            { id: 'transaction' as Tab, icon: TrendingUp, label: 'Nová transakce' },
          ].map(t => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors ${tab === t.id ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}`}
            >
              <t.icon size={14} />
              {t.label}
            </button>
          ))}
        </div>

        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
          {/* Lead form */}
          {tab === 'lead' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Jméno *</label>
                  <input value={lead.name} onChange={e => setLead(p => ({ ...p, name: e.target.value }))} className={inputClass} placeholder="Ing. Jan Novák" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Telefon</label>
                  <input value={lead.phone} onChange={e => setLead(p => ({ ...p, phone: e.target.value }))} className={inputClass} placeholder="+420 777 123 456" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Email</label>
                  <input value={lead.email} onChange={e => setLead(p => ({ ...p, email: e.target.value }))} className={inputClass} placeholder="jan@novak.cz" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Rozpočet</label>
                  <input value={lead.budget} onChange={e => setLead(p => ({ ...p, budget: e.target.value }))} className={inputClass} placeholder="8 000 000 Kč" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Typ nemovitosti</label>
                  <input value={lead.property_type} onChange={e => setLead(p => ({ ...p, property_type: e.target.value }))} className={inputClass} placeholder="Byt 3+kk Praha 6" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Zdroj</label>
                  <select value={lead.source} onChange={e => setLead(p => ({ ...p, source: e.target.value }))} className={selectClass}>
                    <option value="web">Web</option>
                    <option value="doporuceni">Doporučení</option>
                    <option value="sreality">Sreality</option>
                    <option value="linkedin">LinkedIn</option>
                    <option value="veletrh">Veletrh</option>
                    <option value="agent_partner">Agent partner</option>
                    <option value="telefon">Telefon</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Poznámka</label>
                <textarea value={lead.note} onChange={e => setLead(p => ({ ...p, note: e.target.value }))} className={`${inputClass} resize-none`} rows={3} placeholder="Zájem o novostavbu, hotovost..." />
              </div>
            </div>
          )}

          {/* Property form */}
          {tab === 'property' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Kód *</label>
                  <input value={property.code} onChange={e => setProperty(p => ({ ...p, code: e.target.value }))} className={inputClass} placeholder="PRG-021" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Název *</label>
                  <input value={property.name} onChange={e => setProperty(p => ({ ...p, name: e.target.value }))} className={inputClass} placeholder="Byt 2+kk Vinohrady" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Typ</label>
                  <select value={property.type} onChange={e => setProperty(p => ({ ...p, type: e.target.value }))} className={selectClass}>
                    <option value="byt">Byt</option>
                    <option value="dum">Dům</option>
                    <option value="komerci">Komerční</option>
                    <option value="pozemek">Pozemek</option>
                    <option value="garaz">Garáž</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Lokalita</label>
                  <input value={property.district} onChange={e => setProperty(p => ({ ...p, district: e.target.value }))} className={inputClass} placeholder="Praha 2 - Vinohrady" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Cena (Kč)</label>
                  <input value={property.price} onChange={e => setProperty(p => ({ ...p, price: e.target.value }))} className={inputClass} placeholder="8500000" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Plocha (m²)</label>
                  <input value={property.area} onChange={e => setProperty(p => ({ ...p, area: e.target.value }))} className={inputClass} placeholder="65" />
                </div>
              </div>
            </div>
          )}

          {/* Transaction form */}
          {tab === 'transaction' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Kód nemovitosti</label>
                  <input value={transaction.property_code} onChange={e => setTransaction(p => ({ ...p, property_code: e.target.value }))} className={inputClass} placeholder="PRG-001" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Jméno klienta</label>
                  <input value={transaction.client_name} onChange={e => setTransaction(p => ({ ...p, client_name: e.target.value }))} className={inputClass} placeholder="Ing. Jan Novák" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Typ</label>
                  <select value={transaction.type} onChange={e => setTransaction(p => ({ ...p, type: e.target.value }))} className={selectClass}>
                    <option value="prodej">Prodej</option>
                    <option value="pronajem">Pronájem</option>
                    <option value="zprostredkovani">Zprostředkování</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Dohodnutá cena (Kč)</label>
                  <input value={transaction.agreed_price} onChange={e => setTransaction(p => ({ ...p, agreed_price: e.target.value }))} className={inputClass} placeholder="8500000" />
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Poznámka</label>
                <textarea value={transaction.note} onChange={e => setTransaction(p => ({ ...p, note: e.target.value }))} className={`${inputClass} resize-none`} rows={3} />
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={handleSave}
            disabled={loading}
            className="w-full mt-6 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 py-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
          >
            {saved ? <><Check size={16} /> Uloženo!</> : loading ? 'Ukládám přes Pepu...' : <><Plus size={16} /> Uložit do systému</>}
          </button>

          {saved && (
            <p className="text-center text-xs text-green-400 mt-2">Data byla úspěšně zapsána do Supabase přes Pepu ✓</p>
          )}
        </div>
      </div>
    </div>
  )
}
