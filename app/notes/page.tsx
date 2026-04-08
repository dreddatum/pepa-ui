'use client'

import { useState, useRef, useEffect } from 'react'
import { Mic, MicOff, Save, Trash2, FileText, Clock } from 'lucide-react'

interface SpeechRecognitionResultLike {
  0: { transcript: string }
}

interface SpeechRecognitionEventLike {
  results: ArrayLike<SpeechRecognitionResultLike>
}

interface SpeechRecognitionLike {
  lang: string
  continuous: boolean
  interimResults: boolean
  onresult: ((event: SpeechRecognitionEventLike) => void) | null
  onerror: ((event: { error: string }) => void) | null
  onend: (() => void) | null
  start: () => void
  stop: () => void
}

type SpeechRecognitionConstructorLike = new () => SpeechRecognitionLike

declare global {
  interface Window {
    SpeechRecognition: SpeechRecognitionConstructorLike
    webkitSpeechRecognition: SpeechRecognitionConstructorLike
  }
}

interface Note {
  id: string
  client: string
  property: string
  date: string
  duration: string
  transcript: string
  summary: string
  tags: string[]
}

const INITIAL_NOTES: Note[] = [
  {
    id: '1',
    client: 'Ing. Pavel Kratochvíl',
    property: 'PRG-005',
    date: '08.04.2026',
    duration: '12 min',
    transcript: 'Klient má zájem o Loftový prostor v Holešovicích. Požaduje minimální výnos 5% p.a. Financování hotovostí přes InvestCorp. Chce dokončit do konce dubna.',
    summary: 'VIP klient, cash buyer, deadline konec dubna, min. výnos 5%',
    tags: ['vip', 'hotovost', 'deadline'],
  },
  {
    id: '2',
    client: 'Vladimír Novotný',
    property: 'PRG-002',
    date: '07.04.2026',
    duration: '8 min',
    transcript: 'Vyjednávání o ceně PRG-002. Novotný nabízí 16,2M, prodávající trvá na 16,8M. Novotný by akceptoval 16,5M jako kompromis. Potřebuje odpověď do pátku.',
    summary: 'Cenová mezera 300K, kompromis 16,5M, odpověď do pátku',
    tags: ['vyjednávání', 'cena'],
  },
]

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('pepa-notes')
      if (saved) {
        try {
          return JSON.parse(saved) as Note[]
        } catch {
          return INITIAL_NOTES
        }
      }
    }
    return INITIAL_NOTES
  })
  const [recording, setRecording] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [newNote, setNewNote] = useState({ client: '', property: '', transcript: '' })
  const [liveTranscript, setLiveTranscript] = useState('')
  const [generating, setGenerating] = useState(false)
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null)
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    localStorage.setItem('pepa-notes', JSON.stringify(notes))
  }, [notes])

  const startRecording = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      alert('Použijte Chrome.')
      return
    }

    const recognition = new SpeechRecognition()
    recognition.lang = 'cs-CZ'
    recognition.continuous = true
    recognition.interimResults = true

    let finalTranscript = ''

    recognition.onresult = (event) => {
      finalTranscript = ''
      for (let i = 0; i < event.results.length; i++) {
        finalTranscript += event.results[i][0].transcript + ' '
      }
      // Zobraz živý přepis pod tlačítkem
      setLiveTranscript(finalTranscript)
    }

    recognition.onerror = (event) => {
      console.error('Speech error:', event.error)
      setRecording(false)
      if (timerRef.current) clearInterval(timerRef.current)
    }

    recognition.onend = () => {
      setRecording(false)
      if (timerRef.current) clearInterval(timerRef.current)
      // Automaticky rozpoznej jméno klienta z přepisu
      const lines = finalTranscript.trim().split(/[.,]/)
      const clientGuess = lines[0]?.trim() || ''
      setNewNote({
        client: clientGuess.length < 40 ? clientGuess : '',
        property: '',
        transcript: finalTranscript.trim(),
      })
      setLiveTranscript('')
      setShowForm(true) // Otevři formulář AŽ po dokončení
    }

    recognitionRef.current = recognition
    recognition.start()
    setRecording(true)
    setSeconds(0)
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => setSeconds(s => s + 1), 1000)
  }

  const stopRecording = () => {
    recognitionRef.current?.stop()
    setRecording(false)
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }

  const formatTime = (s: number) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`

  const generateSummary = async (transcript: string) => {
    setGenerating(true)
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Shrň tuto poznámku ze schůzky do 1 věty s klíčovými body: "${transcript}"`,
        }),
      })
      const data = await res.json() as { response?: string }
      return data.response?.replace(/<[^>]*>/g, '') || transcript.substring(0, 100)
    } catch {
      return transcript.substring(0, 100)
    } finally {
      setGenerating(false)
    }
  }

  const saveNote = async () => {
    if (!newNote.transcript) return
    const summary = await generateSummary(newNote.transcript)
    const note: Note = {
      id: Date.now().toString(),
      client: newNote.client || 'Neznámý klient',
      property: newNote.property || '—',
      date: new Date().toLocaleDateString('cs-CZ'),
      duration: formatTime(seconds),
      transcript: newNote.transcript,
      summary,
      tags: [],
    }
    setNotes(prev => [note, ...prev])
    setNewNote({ client: '', property: '', transcript: '' })
    setShowForm(false)
    setSeconds(0)
  }

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Poznámky ze schůzek</h2>
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-3 py-2 rounded-lg text-sm transition-colors"
          >
            <FileText size={14} />
            Nová poznámka
          </button>
        </div>

        {/* Recording button */}
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 mb-6 text-center">
          <button
            type="button"
            onClick={recording ? stopRecording : startRecording}
            className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 transition-all ${
              recording
                ? 'bg-red-600 hover:bg-red-500 animate-pulse'
                : 'bg-indigo-600 hover:bg-indigo-500'
            }`}
          >
            {recording ? <MicOff size={32} /> : <Mic size={32} />}
          </button>
          {recording ? (
            <div>
              <p className="text-red-400 font-medium">Nahrávám...</p>
              <p className="text-2xl font-mono mt-1">{formatTime(seconds)}</p>
              <p className="text-xs text-gray-500 mt-2">Klikni pro zastavení</p>
            </div>
          ) : (
            <div>
              <p className="text-sm text-gray-400">Nahrát poznámku ze schůzky</p>
              <p className="text-xs text-gray-600 mt-1">Klikni pro start nahrávání</p>
            </div>
          )}
          {recording && liveTranscript && (
            <p className="text-sm text-gray-400 mt-3 italic max-w-md mx-auto">
              {liveTranscript}
            </p>
          )}
        </div>

        {/* Notes list */}
        <div className="space-y-3">
          {notes.map(note => (
            <div
              key={note.id}
              role="button"
              tabIndex={0}
              onClick={() => setSelectedNote(note)}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedNote(note) } }}
              className="bg-gray-900 rounded-xl border border-gray-800 hover:border-gray-600 p-4 cursor-pointer transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-medium text-sm">{note.client}</p>
                  <p className="text-xs text-gray-500">{note.property !== '—' ? `${note.property} · ` : ''}{note.date}</p>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Clock size={11} />
                  {note.duration}
                </div>
              </div>
              <p className="text-sm text-gray-400 line-clamp-2">{note.summary}</p>
              {note.tags.length > 0 && (
                <div className="flex gap-1 mt-2">
                  {note.tags.map(tag => (
                    <span key={tag} className="text-xs bg-gray-800 text-gray-500 px-2 py-0.5 rounded-full">#{tag}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-xl border border-gray-700 p-6 w-full max-w-lg">
            <h2 className="font-semibold mb-5">Nová poznámka ze schůzky</h2>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <input
                  value={newNote.client}
                  onChange={e => setNewNote(p => ({ ...p, client: e.target.value }))}
                  placeholder="Jméno klienta"
                  className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500"
                />
                <input
                  value={newNote.property}
                  onChange={e => setNewNote(p => ({ ...p, property: e.target.value }))}
                  placeholder="Kód nemovitosti"
                  className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500"
                />
              </div>
              <textarea
                value={newNote.transcript}
                onChange={e => setNewNote(p => ({ ...p, transcript: e.target.value }))}
                placeholder="Poznámky ze schůzky — co klient hledá, požadavky, cenové podmínky, termíny..."
                rows={6}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500 resize-none"
              />
            </div>
            <div className="flex gap-3 mt-5">
              <button
                type="button"
                onClick={() => { setShowForm(false); setSeconds(0) }}
                className="flex-1 bg-gray-800 hover:bg-gray-700 py-2 rounded-lg text-sm transition-colors"
              >
                Zrušit
              </button>
              <button
                type="button"
                onClick={() => void saveNote()}
                disabled={generating || !newNote.transcript}
                className="flex-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 py-2 rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
              >
                {generating ? 'AI shrnutí...' : <><Save size={14} /> Uložit</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail modal */}
      {selectedNote && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-xl border border-gray-700 p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold">{selectedNote.client}</h2>
              <button type="button" onClick={() => setSelectedNote(null)} className="text-gray-400 hover:text-white">✕</button>
            </div>
            <div className="text-xs text-gray-500 mb-4">{selectedNote.property} · {selectedNote.date} · {selectedNote.duration}</div>
            <div className="bg-indigo-950 border border-indigo-800 rounded-lg p-3 mb-4">
              <p className="text-xs text-indigo-400 mb-1">AI shrnutí</p>
              <p className="text-sm text-indigo-200">{selectedNote.summary}</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-3 mb-4">
              <p className="text-xs text-gray-500 mb-1">Poznámky</p>
              <p className="text-sm text-gray-300">{selectedNote.transcript}</p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setNotes(prev => prev.filter(n => n.id !== selectedNote.id))
                  setSelectedNote(null)
                }}
                className="flex-1 bg-red-900 hover:bg-red-800 py-2 rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
              >
                <Trash2 size={14} />
                Smazat
              </button>
              <button
                type="button"
                onClick={() => setSelectedNote(null)}
                className="flex-1 bg-gray-800 hover:bg-gray-700 py-2 rounded-lg text-sm transition-colors"
              >
                Zavřít
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
