'use client'

import { useState, useRef, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { Send, Bot, User, Loader2, Mic, MicOff, Sparkles, TrendingUp, Building2, Calendar } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const SUGGESTED_QUERIES = [
  { text: 'Nové klienty za Q1', icon: <User size={14} className="text-blue-400" /> },
  { text: 'Chybějící data', icon: <Building2 size={14} className="text-purple-400" /> },
  { text: 'Aktivní nemovitosti', icon: <TrendingUp size={14} className="text-emerald-400" /> },
  { text: 'Shrnutí týdne', icon: <Calendar size={14} className="text-orange-400" /> },
]

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const handledQueryMessageRef = useRef(false)
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    // Initialize Speech Recognition if supported
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition()
        recognitionRef.current.continuous = false
        recognitionRef.current.interimResults = true
        recognitionRef.current.lang = 'cs-CZ'

        recognitionRef.current.onresult = (event: any) => {
          const transcript = Array.from(event.results)
            .map((result: any) => result[0].transcript)
            .join('')
          setInput(transcript)
        }

        recognitionRef.current.onerror = (event: any) => {
          console.error('Speech recognition error', event.error)
          setIsRecording(false)
        }

        recognitionRef.current.onend = () => {
          setIsRecording(false)
        }
      }
    }

    const defaultWelcome: Message[] = [{
      id: '0',
      role: 'assistant',
      content: 'Dobrý den. Jsem **Pepa**, váš operační agent. Jak vám mohu pomoci?',
      timestamp: new Date(),
    }]
    const saved = localStorage.getItem('pepa-chat-history')
    if (saved) {
      try {
        const parsed = JSON.parse(saved).map((m: Message) => ({
          ...m,
          timestamp: new Date(m.timestamp),
        }))
        setMessages(parsed)
      } catch {
        setMessages(defaultWelcome)
      }
    } else {
      setMessages(defaultWelcome)
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

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop()
      setIsRecording(false)
    } else {
      recognitionRef.current?.start()
      setIsRecording(true)
    }
  }

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return
    
    if (isRecording) {
      recognitionRef.current?.stop()
      setIsRecording(false)
    }

    const userMessage: Message = { id: Date.now().toString(), role: 'user', content: text, timestamp: new Date() }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)
    try {
      const response = await fetch('/api/agent', {
        method: 'POST',
        cache: 'no-store',
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
    const start = content.indexOf('[CHART_URL:')
    if (start === -1) return null
    const end = content.indexOf(']', start + 11)
    if (end === -1) return null
    return content.substring(start + 11, end)
  }

  const stripChartUrl = (content: string) => {
    const start = content.indexOf('[CHART_URL:')
    if (start === -1) return content.replace(/\}\]\s*$/g, '').trim()
    const end = content.indexOf(']', start + 11)
    if (end === -1) return content
    return (content.substring(0, start) + content.substring(end + 1))
      .replace(/\}\]\s*$/g, '')
      .trim()
  }

  const parseChart = (content: string) => {
    const s = content.indexOf('[CHART:')
    if (s === -1) return null
    let bd = 0
    let e = -1
    for (let i = s + 7; i < content.length; i++) {
      if (content[i] === '{') bd++
      else if (content[i] === '}') {
        bd--
        if (bd === 0) {
          e = i + 1
          break
        }
      }
    }
    if (e === -1) return null
    try {
      return JSON.parse(content.substring(s + 7, e)) as {
        title?: string
        type?: string
        data: { name: string; value: number }[]
      }
    } catch {
      return null
    }
  }

  const formatText = (text: string) => {
    let html = stripChartUrl(text).replace(/\[CHART:[\s\S]*?\]/g, '')
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    html = html.replace(/\n/g, '<br/>')
    return html
  }

  return (
    <div className="relative flex h-full min-h-0 flex-col bg-[#030712] text-white overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/20 blur-[120px] pointer-events-none" />

      {/* Header */}
      <div className="px-6 py-4 z-10 flex items-start justify-between gap-4 shrink-0 border-b border-white/5 bg-white/5 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Sparkles size={20} className="text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-sm tracking-wide">Pepa AI</h2>
            <p className="text-xs text-gray-400">Operační agent na živých datech</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            localStorage.removeItem('pepa-chat-history')
            setMessages([{
              id: '0',
              role: 'assistant',
              content: 'Dobrý den. Jsem **Pepa**, váš operační agent. Jak vám mohu pomoci?',
              timestamp: new Date(),
            }])
          }}
          className="text-xs text-gray-400 hover:text-white transition-colors shrink-0 px-3 py-1.5 rounded-full hover:bg-white/10"
        >
          Smazat historii
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 min-h-0 overflow-y-auto px-4 py-8 space-y-6 hide-scrollbar z-10 pb-40">
        <div className="max-w-4xl mx-auto space-y-6">
          <AnimatePresence initial={false}>
            {messages.map((message) => (
              <motion.div 
                key={message.id} 
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className={`flex gap-4 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-md ${
                  message.role === 'assistant' 
                    ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white' 
                    : 'bg-white/10 border border-white/10 text-gray-300'
                }`}>
                  {message.role === 'assistant' ? <Bot size={16} /> : <User size={16} />}
                </div>
                
                <div className={`max-w-[80%] flex flex-col gap-1 ${message.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`px-5 py-3.5 text-sm leading-relaxed shadow-sm ${
                    message.role === 'assistant' 
                      ? 'bg-white/5 border border-white/10 text-gray-100 rounded-2xl rounded-tl-sm backdrop-blur-sm' 
                      : 'bg-indigo-600 text-white rounded-2xl rounded-tr-sm'
                  }`}>
                    <div dangerouslySetInnerHTML={{ __html: formatText(message.content) }} />
                    
                    {/* Charts Rendering */}
                    {message.role === 'assistant' && (() => {
                      const chart = parseChart(message.content)
                      if (!chart?.data?.length) return null
                      return (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="mt-4 bg-[#0a0f1c]/80 border border-white/5 rounded-xl p-4 overflow-hidden backdrop-blur-md"
                        >
                          {chart.title ? (
                            <p className="text-xs font-medium text-gray-400 mb-4">{chart.title}</p>
                          ) : null}
                          <ResponsiveContainer width="100%" height={220}>
                            <BarChart data={chart.data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                              <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                              <Tooltip 
                                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                contentStyle={{ background: '#111827', border: '1px solid #374151', borderRadius: '12px', fontSize: 12, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }} 
                              />
                              <Bar dataKey="value" fill="url(#colorUv)" radius={[4, 4, 0, 0]} />
                              <defs>
                                <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#818cf8" stopOpacity={1}/>
                                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={1}/>
                                </linearGradient>
                              </defs>
                            </BarChart>
                          </ResponsiveContainer>
                        </motion.div>
                      )
                    })()}
                    
                    {/* Image Chart Rendering */}
                    {message.role === 'assistant' && (() => {
                      const chartUrl = parseChartUrl(message.content)
                      if (!chartUrl) return null
                      return (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="mt-4"
                        >
                          <img
                            src={chartUrl}
                            alt="Graf"
                            className="rounded-xl w-full max-w-md border border-white/10 shadow-lg"
                            onError={(e) => { e.currentTarget.style.display = 'none' }}
                          />
                        </motion.div>
                      )
                    })()}
                  </div>
                  <span className="text-[10px] text-gray-500 mt-1 px-1">
                    {message.timestamp.toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Loading State */}
          {loading && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-4"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                <Bot size={16} className="text-white" />
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-sm px-5 py-4 flex items-center gap-3 backdrop-blur-sm">
                <div className="flex gap-1">
                  <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0 }} className="w-1.5 h-1.5 bg-indigo-400 rounded-full" />
                  <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-indigo-400 rounded-full" />
                  <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-indigo-400 rounded-full" />
                </div>
                <span className="text-sm text-gray-400 font-medium tracking-wide">Pepa analyzuje data...</span>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Floating Input Area */}
      <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-[#030712] via-[#030712]/80 to-transparent pt-10 pb-6 px-4">
        <div className="max-w-3xl mx-auto flex flex-col gap-4">
          
          {/* Suggested Queries */}
          {messages.length <= 3 && !loading && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-wrap gap-2 justify-center"
            >
              {SUGGESTED_QUERIES.map((query, i) => (
                <button 
                  key={i} 
                  type="button" 
                  onClick={() => sendMessage(query.text)} 
                  className="flex items-center gap-2 text-xs bg-white/5 hover:bg-white/10 text-gray-300 px-4 py-2 rounded-xl border border-white/10 hover:border-white/20 transition-all backdrop-blur-md shadow-sm"
                >
                  {query.icon}
                  {query.text}
                </button>
              ))}
            </motion.div>
          )}

          {/* Input Box */}
          <div className="relative flex items-end gap-2 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-2 shadow-2xl shadow-indigo-900/20">
            <button 
              type="button" 
              onClick={toggleRecording}
              className={`p-3 rounded-xl transition-all ${isRecording ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' : 'bg-transparent text-gray-400 hover:bg-white/5 hover:text-gray-200'}`}
              title="Hlasové zadávání"
            >
              {isRecording ? <Mic className="animate-pulse" size={20} /> : <Mic size={20} />}
            </button>
            
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  sendMessage(input)
                }
              }}
              placeholder={isRecording ? 'Poslouchám...' : 'Zeptejte se na cokoliv ohledně prodejů, klientů nebo trhu...'}
              className="flex-1 bg-transparent text-white placeholder-gray-400 text-sm outline-none resize-none max-h-32 min-h-[44px] py-3 px-2 hide-scrollbar"
              rows={1}
              disabled={loading}
              style={{ height: 'auto' }}
            />
            
            <button 
              type="button" 
              onClick={() => sendMessage(input)} 
              disabled={loading || (!input.trim() && !isRecording)} 
              className="p-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all shadow-md shadow-indigo-500/20 text-white"
            >
              <Send size={18} />
            </button>
          </div>
          <div className="text-center">
             <p className="text-[10px] text-gray-500">Pepa může dělat chyby. Vždy si ověřte důležitá data.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
