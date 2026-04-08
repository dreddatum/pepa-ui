'use client'

import { useState } from 'react'
import { ArrowLeft, Building2, MapPin, Ruler, TrendingUp, Filter } from 'lucide-react'
import Link from 'next/link'

const LISTINGS = [
  { code: 'PRG-001', name: 'Bytový dům Holešovice', type: 'byt', status: 'aktivni', district: 'Praha 7 - Holešovice', area: 78.5, price: 10500000, rent: 28000, yield: 3.43, floor: '3/6', energy: 'B', condition: 'dobry', tags: ['metro', 'park', 'investice'] },
  { code: 'PRG-002', name: 'Komerční prostory Žižkov', type: 'komerci', status: 'aktivni', district: 'Praha 3 - Žižkov', area: 245, price: 17800000, rent: 65000, yield: 4.81, floor: '1/5', energy: 'C', condition: 'dobry', tags: ['komercni', 'pronajem'] },
  { code: 'PRG-003', name: 'Rodinný dům Vinohrady', type: 'dum', status: 'due_diligence', district: 'Praha 2 - Vinohrady', area: 195, price: 26000000, rent: null, yield: null, floor: null, energy: 'A', condition: 'vyborny', tags: ['vila', 'exkluzivni'] },
  { code: 'PRG-005', name: 'Loftový prostor Holešovice', type: 'komerci', status: 'aktivni', district: 'Praha 7 - Holešovice', area: 320, price: 22500000, rent: 85000, yield: 4.86, floor: '2/4', energy: 'C', condition: 'dobry', tags: ['loft', 'komerci'] },
  { code: 'PRG-007', name: 'Garsoniera Dejvice', type: 'byt', status: 'aktivni', district: 'Praha 6 - Dejvice', area: 32.5, price: 3600000, rent: 11000, yield: 3.83, floor: '5/6', energy: 'D', condition: 'dobry', tags: ['garsonka'] },
  { code: 'PRG-009', name: 'Byt 3+1 Nusle', type: 'byt', status: 'aktivni', district: 'Praha 4 - Nusle', area: 84, price: 8100000, rent: 24000, yield: 3.79, floor: '3/5', energy: 'C', condition: 'dobry', tags: ['pronajem'] },
  { code: 'PRG-010', name: 'Penthouse Pankrác', type: 'byt', status: 'due_diligence', district: 'Praha 4 - Pankrác', area: 155, price: 24000000, rent: null, yield: null, floor: '14/14', energy: 'A', condition: 'vyborny', tags: ['penthouse', 'vip'] },
  { code: 'PRG-011', name: 'Byt 1+kk Holešovice', type: 'byt', status: 'aktivni', district: 'Praha 7 - Holešovice', area: 41, price: 4850000, rent: 16000, yield: 4.17, floor: '1/8', energy: 'B', condition: 'vyborny', tags: ['novostavba'] },
  { code: 'PRG-013', name: 'Kancelář Karlín', type: 'komerci', status: 'aktivni', district: 'Praha 8 - Karlín', area: 175, price: 16000000, rent: 52000, yield: 4.11, floor: '2/6', energy: 'A', condition: 'vyborny', tags: ['kancelare', 'leed'] },
  { code: 'PRG-014', name: 'Pozemek Zbraslav', type: 'pozemek', status: 'due_diligence', district: 'Praha 16 - Zbraslav', area: 1240, price: 8200000, rent: null, yield: null, floor: null, energy: null, condition: null, tags: ['pozemek', 'stavba'] },
  { code: 'PRG-015', name: 'Apartmán Vinohrady', type: 'byt', status: 'aktivni', district: 'Praha 2 - Vinohrady', area: 67, price: 10200000, rent: 30000, yield: 3.67, floor: '3/5', energy: 'C', condition: 'dobry', tags: ['historicky'] },
  { code: 'PRG-016', name: 'Garáže Holešovice x5', type: 'garaz', status: 'aktivni', district: 'Praha 7 - Holešovice', area: 75, price: 3500000, rent: 9500, yield: 3.56, floor: null, energy: null, condition: 'dobry', tags: ['garaz', 'balicek'] },
  { code: 'PRG-018', name: 'Byt 4+kk Smíchov', type: 'byt', status: 'aktivni', district: 'Praha 5 - Smíchov', area: 112, price: 12900000, rent: 38000, yield: 3.74, floor: '5/7', energy: null, condition: 'dobry', tags: ['terasa', 'vltava'] },
  { code: 'PRG-020', name: 'Nájemní byt Holešovice Premium', type: 'byt', status: 'aktivni', district: 'Praha 7 - Holešovice', area: 91, price: 12000000, rent: 36000, yield: 3.76, floor: '2/6', energy: 'B', condition: 'vyborny', tags: ['smart', 'premium'] },
]

const TYPE_LABELS: Record<string, string> = {
  byt: 'Byt', dum: 'Dům', komerci: 'Komerční', pozemek: 'Pozemek', garaz: 'Garáž'
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  aktivni: { label: 'Aktivní', color: 'bg-green-900 text-green-300' },
  due_diligence: { label: 'Due Diligence', color: 'bg-amber-900 text-amber-300' },
  prospekt: { label: 'Prospekt', color: 'bg-blue-900 text-blue-300' },
}

const CONDITION_LABELS: Record<string, string> = {
  vyborny: 'Výborný', dobry: 'Dobrý', uspokojujici: 'Uspokojivý', spatny: 'Špatný'
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat('cs-CZ', { style: 'currency', currency: 'CZK', maximumFractionDigits: 0 }).format(price)

export default function ListingsPage() {
  const [typeFilter, setTypeFilter] = useState('vse')
  const [districtFilter, setDistrictFilter] = useState('vse')
  const [maxPrice, setMaxPrice] = useState(30000000)
  const [sortBy, setSortBy] = useState('code')

  const districts = ['vse', ...Array.from(new Set(LISTINGS.map(l => l.district)))]

  const filtered = LISTINGS
    .filter(l => typeFilter === 'vse' || l.type === typeFilter)
    .filter(l => districtFilter === 'vse' || l.district === districtFilter)
    .filter(l => l.price <= maxPrice)
    .sort((a, b) => {
      if (sortBy === 'price_asc') return a.price - b.price
      if (sortBy === 'price_desc') return b.price - a.price
      if (sortBy === 'yield') return (b.yield || 0) - (a.yield || 0)
      if (sortBy === 'area') return b.area - a.area
      return a.code.localeCompare(b.code)
    })

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/" className="text-gray-500 hover:text-white transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-xl font-semibold">Aktivní inzeráty</h1>
          <span className="text-sm text-gray-500 ml-2">{filtered.length} nemovitostí</span>
        </div>

        {/* Filtry */}
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-4 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter size={14} className="text-gray-400" />
            <span className="text-sm text-gray-400 font-medium">Filtry</span>
          </div>
          <div className="grid grid-cols-4 gap-4">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Typ nemovitosti</label>
              <select
                value={typeFilter}
                onChange={e => setTypeFilter(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500"
              >
                <option value="vse">Vše</option>
                <option value="byt">Byt</option>
                <option value="dum">Dům</option>
                <option value="komerci">Komerční</option>
                <option value="pozemek">Pozemek</option>
                <option value="garaz">Garáž</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Lokalita</label>
              <select
                value={districtFilter}
                onChange={e => setDistrictFilter(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500"
              >
                {districts.map(d => (
                  <option key={d} value={d}>{d === 'vse' ? 'Všechny lokality' : d}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">
                Max. cena: {formatPrice(maxPrice)}
              </label>
              <input
                type="range"
                min={1000000}
                max={30000000}
                step={500000}
                value={maxPrice}
                onChange={e => setMaxPrice(Number(e.target.value))}
                className="w-full accent-indigo-500"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Řadit podle</label>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500"
              >
                <option value="code">Kód</option>
                <option value="price_asc">Cena ↑</option>
                <option value="price_desc">Cena ↓</option>
                <option value="yield">Výnos ↓</option>
                <option value="area">Plocha ↓</option>
              </select>
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-3 gap-4">
          {filtered.map(listing => (
            <div key={listing.code} className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden hover:border-gray-600 transition-colors">
              <div className="bg-gray-800 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building2 size={14} className="text-indigo-400" />
                  <span className="text-xs font-mono text-indigo-400">{listing.code}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_LABELS[listing.status]?.color || 'bg-gray-700 text-gray-300'}`}>
                    {STATUS_LABELS[listing.status]?.label || listing.status}
                  </span>
                  <span className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded-full">
                    {TYPE_LABELS[listing.type]}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-medium text-sm mb-2">{listing.name}</h3>
                <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
                  <MapPin size={11} />
                  {listing.district}
                </div>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="bg-gray-800 rounded-lg p-2">
                    <p className="text-xs text-gray-500">Cena</p>
                    <p className="text-sm font-semibold text-white">{formatPrice(listing.price)}</p>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-2">
                    <p className="text-xs text-gray-500">Plocha</p>
                    <p className="text-sm font-semibold text-white flex items-center gap-1">
                      <Ruler size={11} className="text-gray-400" />
                      {listing.area} m²
                    </p>
                  </div>
                </div>
                {listing.rent && (
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="bg-gray-800 rounded-lg p-2">
                      <p className="text-xs text-gray-500">Nájem/měs.</p>
                      <p className="text-sm font-semibold text-green-400">{formatPrice(listing.rent)}</p>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-2">
                      <p className="text-xs text-gray-500">Výnos p.a.</p>
                      <p className="text-sm font-semibold text-amber-400 flex items-center gap-1">
                        <TrendingUp size={11} />
                        {listing.yield}%
                      </p>
                    </div>
                  </div>
                )}
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{listing.floor ? `Patro ${listing.floor}` : '—'}</span>
                  <span>{listing.energy ? `Energie ${listing.energy}` : '—'}</span>
                  <span>{listing.condition ? CONDITION_LABELS[listing.condition] : '—'}</span>
                </div>
                {listing.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {listing.tags.map(tag => (
                      <span key={tag} className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded-full">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            <Building2 size={40} className="mx-auto mb-3 opacity-30" />
            <p>Žádné nemovitosti neodpovídají filtrům</p>
          </div>
        )}
      </div>
    </div>
  )
}
