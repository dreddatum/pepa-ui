'use client'

import { useState, useEffect, useRef } from 'react'
import { ArrowLeft, Building2, Calendar, Clock, MapPin, User, Plus, X, Check } from 'lucide-react'
import Link from 'next/link'

interface Meeting {
  id: string
  title: string
  client: string
  property: string
  date: string
  time: string
  duration: string
  location: string
  status: 'confirmed' | 'pending' | 'cancelled'
  note?: string
}

const INITIAL_MEETINGS: Meeting[] = [
  { id: '1', title: 'Prohlídka — Holešovice Premium', client: 'Barbora Hovorková', property: 'PRG-020', date: '2026-04-10', time: '10:00', duration: '60 min', location: 'Jablonského 4, Praha 7', status: 'confirmed', note: 'Zájem o koupi, čeká na hypotéku KB' },
  { id: '2', title: 'Follow-up — Loft Holešovice', client: 'Ing. Pavel Kratochvíl', property: 'PRG-005', date: '2026-04-12', time: '14:00', duration: '90 min', location: 'Dělnická 43, Praha 7', status: 'confirmed', note: 'Druhá prohlídka, InvestCorp' },
  { id: '3', title: 'Prohlídka — Vila Vinohrady', client: 'Dr. Věra Procházková', property: 'PRG-003', date: '2026-04-14', time: '11:00', duration: '120 min', location: 'Mánesova 47, Praha 2', status: 'pending', note: 'VIP klientka, připravit dokumentaci' },
  { id: '4', title: 'Jednání — Komerční Žižkov', client: 'Vladimír Novotný', property: 'PRG-002', date: '2026-04-15', time: '09:00', duration: '60 min', location: 'Seifertova 12, Praha 3', status: 'confirmed', note: 'Cenové vyjednávání' },
  { id: '5', title: 'Prohlídka — Penthouse Pankrác', client: 'Ing. Radek Horálek', property: 'PRG-010', date: '2026-04-17', time: '15:00', duration: '90 min', location: 'Na Pankráci 30, Praha 4', status: 'pending' },
  { id: '6', title: 'Prohlídka — Kancelář Karlín', client: 'Robert Šimánek', property: 'PRG-013', date: '2026-04-22', time: '13:00', duration: '60 min', location: 'Křižíkova 488, Praha 8', status: 'confirmed' },
]

const STATUS_CONFIG = {
  confirmed: { label: 'Potvrzeno', color: 'bg-green-900 text-green-300', dot: 'bg-green-400' },
  pending: { label: 'Čeká na potvrzení', color: 'bg-amber-900 text-amber-300', dot: 'bg-amber-400' },
  cancelled: { label: 'Zrušeno', color: 'bg-red-900 text-red-300', dot: 'bg-red-400' },
}

const DAYS_CS = ['Ne', 'Po', 'Út', 'St', 'Čt', 'Pá', 'So']
const MONTHS_CS = ['Leden', 'Únor', 'Březen', 'Duben', 'Květen', 'Červen', 'Červenec', 'Srpen', 'Září', 'Říjen', 'Listopad', 'Prosinec']

export default function CalendarPage() {
  const [meetings, setMeetings] = useState<Meeting[]>(INITIAL_MEETINGS)
  const [showForm, setShowForm] = useState(false)
  const [currentDate, setCurrentDate] = useState(new Date(2026, 3, 1))
  const [newMeeting, setNewMeeting] = useState({ title: '', client: '', property: '', date: '', time: '10:00', duration: '60 min', location: '', note: '' })
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem('pepa-meetings')
    if (saved) {
      try {
        setMeetings(JSON.parse(saved))
      } catch {
        // ignore
      }
    }
  }, [])

  const skipFirstPersist = useRef(true)
  useEffect(() => {
    if (skipFirstPersist.current) {
      skipFirstPersist.current = false
      return
    }
    localStorage.setItem('pepa-meetings', JSON.stringify(meetings))
  }, [meetings])

  const confirmMeeting = async (meeting: Meeting) => {
    setMeetings(prev => prev.map(m =>
      m.id === meeting.id ? { ...m, status: 'confirmed' as const } : m
    ))
    setSelectedMeeting(null)

    await fetch('/api/calendar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: meeting.title,
        client: meeting.client,
        date: meeting.date,
        time: meeting.time,
        location: meeting.location,
        note: meeting.note,
      }),
    })
  }

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const getMeetingsForDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return meetings.filter(m => m.date === dateStr)
  }

  const addMeeting = () => {
    if (!newMeeting.title || !newMeeting.date) return
    setMeetings(prev => [...prev, {
      ...newMeeting,
      id: Date.now().toString(),
      status: 'pending' as const,
    }])
    setNewMeeting({ title: '', client: '', property: '', date: '', time: '10:00', duration: '60 min', location: '', note: '' })
    setShowForm(false)
  }

  const upcomingMeetings = meetings
    .filter(m => m.date >= new Date().toISOString().split('T')[0])
    .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time))

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-gray-500 hover:text-white transition-colors">
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-xl font-semibold">Kalendář schůzek</h1>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg text-sm transition-colors"
          >
            <Plus size={16} />
            Nová schůzka
          </button>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Kalendář */}
          <div className="col-span-2 bg-gray-900 rounded-xl border border-gray-800 p-5">
            <div className="flex items-center justify-between mb-4">
              <button type="button" onClick={() => setCurrentDate(new Date(year, month - 1, 1))} className="text-gray-400 hover:text-white px-2 py-1 rounded">←</button>
              <h2 className="font-medium">{MONTHS_CS[month]} {year}</h2>
              <button type="button" onClick={() => setCurrentDate(new Date(year, month + 1, 1))} className="text-gray-400 hover:text-white px-2 py-1 rounded">→</button>
            </div>
            <div className="grid grid-cols-7 gap-1 mb-2">
              {DAYS_CS.map(d => (
                <div key={d} className="text-center text-xs text-gray-500 py-1">{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: firstDay === 0 ? 6 : firstDay - 1 }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1
                const dayMeetings = getMeetingsForDay(day)
                const isToday = new Date().getDate() === day && new Date().getMonth() === month && new Date().getFullYear() === year
                return (
                  <div
                    key={day}
                    className={`min-h-[60px] rounded-lg p-1 border ${isToday ? 'border-indigo-500 bg-indigo-950' : 'border-gray-800 bg-gray-800'}`}
                  >
                    <p className={`text-xs mb-1 ${isToday ? 'text-indigo-400 font-bold' : 'text-gray-400'}`}>{day}</p>
                    {dayMeetings.slice(0, 2).map(m => (
                      <div
                        key={m.id}
                        onClick={() => setSelectedMeeting(m)}
                        className={`text-xs px-1 py-0.5 rounded mb-0.5 truncate cursor-pointer hover:opacity-80 ${
                          m.status === 'confirmed' ? 'bg-green-900 text-green-300' :
                          m.status === 'pending' ? 'bg-amber-900 text-amber-300' :
                          'bg-red-900 text-red-300'
                        }`}
                        title={m.title}
                      >
                        {m.time} {m.client.split(' ').pop()}
                      </div>
                    ))}
                    {dayMeetings.length > 2 && (
                      <div className="text-xs text-gray-500">+{dayMeetings.length - 2}</div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Nadcházející schůzky */}
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-5">
            <h2 className="text-sm font-medium text-gray-300 mb-4">Nadcházející schůzky</h2>
            <div className="space-y-3 overflow-y-auto max-h-[520px]">
              {upcomingMeetings.map(meeting => (
                <div
                  key={meeting.id}
                  onClick={() => setSelectedMeeting(meeting)}
                  className="bg-gray-800 rounded-lg p-3 border border-gray-700 cursor-pointer hover:border-gray-500 transition-colors"
                >
                  <div className="flex items-start justify-between mb-1">
                    <p className="text-sm font-medium leading-tight">{meeting.title}</p>
                    <span className={`text-xs px-1.5 py-0.5 rounded-full ml-2 flex-shrink-0 ${STATUS_CONFIG[meeting.status].color}`}>
                      {STATUS_CONFIG[meeting.status].label}
                    </span>
                  </div>
                  <div className="space-y-1 mt-2">
                    <div className="flex items-center gap-1.5 text-xs text-gray-400">
                      <User size={11} />
                      {meeting.client}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-400">
                      <Calendar size={11} />
                      {new Date(meeting.date).toLocaleDateString('cs-CZ')} v {meeting.time}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-400">
                      <Clock size={11} />
                      {meeting.duration}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-400">
                      <MapPin size={11} />
                      {meeting.location}
                    </div>
                  </div>
                  {meeting.note && (
                    <p className="text-xs text-gray-500 mt-2 italic">{meeting.note}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Formulář nové schůzky */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-gray-900 rounded-xl border border-gray-700 p-6 w-full max-w-lg">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-semibold">Nová schůzka</h2>
                <button type="button" onClick={() => setShowForm(false)} className="text-gray-400 hover:text-white">
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-3">
                <input value={newMeeting.title} onChange={e => setNewMeeting(p => ({ ...p, title: e.target.value }))} placeholder="Název schůzky *" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500" />
                <div className="grid grid-cols-2 gap-3">
                  <input value={newMeeting.client} onChange={e => setNewMeeting(p => ({ ...p, client: e.target.value }))} placeholder="Jméno klienta" className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500" />
                  <input value={newMeeting.property} onChange={e => setNewMeeting(p => ({ ...p, property: e.target.value }))} placeholder="Kód nemovitosti (PRG-XXX)" className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500" />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <input type="date" value={newMeeting.date} onChange={e => setNewMeeting(p => ({ ...p, date: e.target.value }))} className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500" />
                  <input type="time" value={newMeeting.time} onChange={e => setNewMeeting(p => ({ ...p, time: e.target.value }))} className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500" />
                  <select value={newMeeting.duration} onChange={e => setNewMeeting(p => ({ ...p, duration: e.target.value }))} className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500">
                    <option>30 min</option>
                    <option>60 min</option>
                    <option>90 min</option>
                    <option>120 min</option>
                  </select>
                </div>
                <input value={newMeeting.location} onChange={e => setNewMeeting(p => ({ ...p, location: e.target.value }))} placeholder="Adresa / místo" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500" />
                <textarea value={newMeeting.note} onChange={e => setNewMeeting(p => ({ ...p, note: e.target.value }))} placeholder="Poznámka" rows={2} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500 resize-none" />
              </div>
              <div className="flex gap-3 mt-5">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 bg-gray-800 hover:bg-gray-700 py-2 rounded-lg text-sm transition-colors">Zrušit</button>
                <button type="button" onClick={addMeeting} className="flex-1 bg-indigo-600 hover:bg-indigo-500 py-2 rounded-lg text-sm transition-colors flex items-center justify-center gap-2">
                  <Check size={16} />
                  Přidat schůzku
                </button>
              </div>
            </div>
          </div>
        )}

        {selectedMeeting && (() => {
          const currentMeeting = meetings.find(m => m.id === selectedMeeting.id) || selectedMeeting
          return (
            <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
              <div className="bg-gray-900 rounded-xl border border-gray-700 p-6 w-full max-w-md">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-semibold">{currentMeeting.title}</h2>
                  <button type="button" onClick={() => setSelectedMeeting(null)} className="text-gray-400 hover:text-white">
                    <X size={20} />
                  </button>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-400">Status</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${STATUS_CONFIG[currentMeeting.status].color}`}>
                    {STATUS_CONFIG[currentMeeting.status].label}
                  </span>
                </div>
                <div className="bg-gray-800 rounded-lg p-4 space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <User size={14} className="text-gray-400" />
                    <span className="text-gray-400">Klient:</span>
                    <span className="font-medium">{currentMeeting.client}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Building2 size={14} className="text-gray-400" />
                    <span className="text-gray-400">Nemovitost:</span>
                    <span className="font-medium">{currentMeeting.property}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar size={14} className="text-gray-400" />
                    <span className="text-gray-400">Datum:</span>
                    <span className="font-medium">{new Date(currentMeeting.date).toLocaleDateString('cs-CZ')} v {currentMeeting.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock size={14} className="text-gray-400" />
                    <span className="text-gray-400">Délka:</span>
                    <span className="font-medium">{currentMeeting.duration}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin size={14} className="text-gray-400" />
                    <span className="text-gray-400">Adresa:</span>
                    <span className="font-medium">{currentMeeting.location}</span>
                  </div>
                </div>
                {currentMeeting.note && (
                  <div className="bg-gray-800 rounded-lg p-3 mb-4">
                    <p className="text-xs text-gray-500 mb-1">Poznámka</p>
                    <p className="text-sm text-gray-300">{currentMeeting.note}</p>
                  </div>
                )}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setMeetings(prev => prev.filter(m => m.id !== currentMeeting.id))
                      setSelectedMeeting(null)
                    }}
                    className="flex-1 bg-red-900 hover:bg-red-800 py-2 rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
                  >
                    <X size={14} />
                    Smazat
                  </button>
                  {currentMeeting.status !== 'confirmed' ? (
                    <button
                      type="button"
                      onClick={() => confirmMeeting(currentMeeting)}
                      className="flex-1 bg-green-700 hover:bg-green-600 py-2 rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
                    >
                      <Check size={14} />
                      Potvrdit
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setMeetings(prev => prev.map(m =>
                          m.id === currentMeeting.id ? { ...m, status: 'cancelled' as const } : m
                        ))
                        setSelectedMeeting(null)
                      }}
                      className="flex-1 bg-amber-700 hover:bg-amber-600 py-2 rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
                    >
                      <X size={14} />
                      Zrušit schůzku
                    </button>
                  )}
                </div>
              </div>
            </div>
          )
        })()}
      </div>
    </div>
  )
}
