'use client'

import { useState } from 'react'
import { Users, Plus, Trash2, Shield } from 'lucide-react'

interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'agent' | 'viewer'
  status: 'active' | 'pending'
}

const INITIAL_USERS: User[] = [
  { id: '1', name: 'Daniel Ikonomidis', email: 'guvermer@gmail.com', role: 'admin', status: 'active' },
  { id: '2', name: 'Tomáš Kovář', email: 'tomas.kovar@realestate.cz', role: 'agent', status: 'active' },
  { id: '3', name: 'Jana Nováčková', email: 'jana.novackova@realestate.cz', role: 'agent', status: 'active' },
  { id: '4', name: 'Martin Blažek', email: 'martin.blazek@realestate.cz', role: 'agent', status: 'pending' },
]

const ROLE_LABELS = {
  admin: { label: 'Admin', color: 'bg-red-900 text-red-300' },
  agent: { label: 'Agent', color: 'bg-indigo-900 text-indigo-300' },
  viewer: { label: 'Viewer', color: 'bg-gray-700 text-gray-300' },
}

export default function SettingsPage() {
  const [users, setUsers] = useState<User[]>(INITIAL_USERS)
  const [showForm, setShowForm] = useState(false)
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'agent' as User['role'] })

  const addUser = () => {
    if (!newUser.name || !newUser.email) return
    setUsers(prev => [...prev, {
      id: Date.now().toString(),
      ...newUser,
      status: 'pending',
    }])
    setNewUser({ name: '', email: '', role: 'agent' })
    setShowForm(false)
  }

  const removeUser = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id))
  }

  const inputClass = 'bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500'

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-lg font-semibold mb-6">Nastavení & Uživatelé</h2>

        <div className="bg-gray-900 rounded-xl border border-gray-800 p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Users size={16} className="text-indigo-400" />
              <h3 className="font-medium text-sm">Uživatelé systému</h3>
            </div>
            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 px-3 py-1.5 rounded-lg text-sm transition-colors"
            >
              <Plus size={14} />
              Přidat uživatele
            </button>
          </div>

          {showForm && (
            <div className="bg-gray-800 rounded-lg p-4 mb-4">
              <div className="grid grid-cols-3 gap-3 mb-3">
                <input
                  value={newUser.name}
                  onChange={e => setNewUser(p => ({ ...p, name: e.target.value }))}
                  placeholder="Jméno"
                  className={`${inputClass} w-full`}
                />
                <input
                  value={newUser.email}
                  onChange={e => setNewUser(p => ({ ...p, email: e.target.value }))}
                  placeholder="Email"
                  className={`${inputClass} w-full`}
                />
                <select
                  value={newUser.role}
                  onChange={e => setNewUser(p => ({ ...p, role: e.target.value as User['role'] }))}
                  className={`${inputClass} w-full`}
                >
                  <option value="admin">Admin</option>
                  <option value="agent">Agent</option>
                  <option value="viewer">Viewer</option>
                </select>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 bg-gray-700 hover:bg-gray-600 py-2 rounded-lg text-sm">Zrušit</button>
                <button type="button" onClick={addUser} className="flex-1 bg-indigo-600 hover:bg-indigo-500 py-2 rounded-lg text-sm">Přidat</button>
              </div>
            </div>
          )}

          <div className="space-y-2">
            {users.map(user => (
              <div key={user.id} className="flex items-center justify-between bg-gray-800 rounded-lg px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold">
                    {user.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${ROLE_LABELS[user.role].color}`}>
                    {ROLE_LABELS[user.role].label}
                  </span>
                  {user.status === 'pending' && (
                    <span className="text-xs bg-amber-900 text-amber-300 px-2 py-0.5 rounded-full">Čeká</span>
                  )}
                  {user.id !== '1' && (
                    <button
                      type="button"
                      onClick={() => removeUser(user.id)}
                      className="text-gray-600 hover:text-red-400 transition-colors ml-2"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-900 rounded-xl border border-gray-800 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Shield size={16} className="text-green-400" />
            <h3 className="font-medium text-sm">Systém</h3>
          </div>
          <div className="space-y-2">
            {[
              { label: 'AI Model', value: 'GPT-4o-mini' },
              { label: 'Databáze', value: 'Supabase PostgreSQL' },
              { label: 'Orchestrace', value: 'n8n Cloud' },
              { label: 'Deployment', value: 'Vercel' },
              { label: 'Verze', value: 'Next.js 15' },
            ].map(item => (
              <div key={item.label} className="flex justify-between text-sm bg-gray-800 rounded-lg px-4 py-2">
                <span className="text-gray-400">{item.label}</span>
                <span className="text-white">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
