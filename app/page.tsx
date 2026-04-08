'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Loader2 } from 'lucide-react'

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

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const handledQueryMessageRef = useRef(false)

  useEffect(() => {
    const saved = localStorage.getItem('pepa-chat-history')
    if (saved) {
      const parsed = JSON.parse(saved).map((m: Message) => ({
        ...m,
        timestamp: new Date(m.timestamp),
      }))
      setMessages(parsed)
    } else {
      setMessages([{
        id: '0',
        role: 'assistant',
        content: 'Dobrý den. Jsem <strong>Pepa</strong>, váš operační agent pro správu nemovitostního portfolia. Jak vám mohu pomoci?',
        timestamp: new Date(),
      }])
    }
  }, [])

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('pepa-chat-history', JSON.stringify(messages))
    }
  }, [messages])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const queryMessage = params.get('message')
    if (!queryMessage || handledQueryMessageRef.current) return
    setInput(queryMessage)
    handledQueryMessageRef.current = true
  }, [])

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

  const parseChartUrl = (content: string) => {
    const match = content.match(/\[CHART_URL:(.*?)\]/)
    return match ? match[1] : null
  }

  const stripChartUrl = (content: string) => {
    return content.replace(/\[CHART_URL:.*?\]/g, '').trim()
  }

  return (
    <div className="flex h-full min-h-0 flex-col bg-gray-950 text-white">
      <div className="px-6 py-4 border-b border-gray-800 bg-gray-900 flex items-start justify-between gap-4 shrink-0">
        <div>
          <h2 className="font-medium text-sm">Chat s Pepou</h2>
          <p className="text-xs text-gray-500">AI agent připojený na živá data</p>
        </div>
        <button
          type="button"
          onClick={() => {
            localStorage.removeItem('pepa-chat-history')
            setMessages([{
              id: '0',
              role: 'assistant',
              content: 'Dobrý den. Jsem <strong>Pepa</strong>, váš operační agent. Jak vám mohu pomoci?',
              timestamp: new Date(),
            }])
          }}
          className="text-xs text-gray-500 hover:text-gray-300 transition-colors shrink-0"
        >
          Smazat historii
        </button>
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
            <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${message.role === 'assistant' ? 'bg-indigo-600' : 'bg-gray-700'}`}>
              {message.role === 'assistant' ? <Bot size={16} /> : <User size={16} />}
            </div>
            <div className={`max-w-[75%] flex flex-col gap-1 ${message.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${message.role === 'assistant' ? 'bg-gray-800 text-gray-100 rounded-tl-sm' : 'bg-indigo-600 text-white rounded-tr-sm'}`}>
                <div dangerouslySetInnerHTML={{ __html: stripChartUrl(message.content) }} />
                {message.role === 'assistant' && (() => {
                  const chartUrl = parseChartUrl(message.content)
                  if (!chartUrl) return null
                  return (
                    <div className="mt-3">
                      <img
                        src={chartUrl}
                        alt="Graf"
                        className="rounded-xl w-full max-w-md"
                        onError={(e) => { e.currentTarget.style.display = 'none' }}
                      />
                    </div>
                  )
                })()}
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
        <div className="px-4 pb-2 shrink-0">
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_QUERIES.map((query) => (
              <button key={query} type="button" onClick={() => sendMessage(query)} className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1.5 rounded-full border border-gray-700 transition-colors">
                {query}
              </button>
            ))}
          </div>
        </div>
      )}
      <div className="px-4 pb-4 pt-2 shrink-0">
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
          <button type="button" onClick={() => sendMessage(input)} disabled={loading || !input.trim()} className="w-8 h-8 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 flex items-center justify-center transition-colors">
            <Send size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}
