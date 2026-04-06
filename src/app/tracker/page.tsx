'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Transaction {
  id: number
  type: 'deposit' | 'withdrawal'
  amount: number
  sportsbook: string
  date: string
  notes: string
}

const sportsbooks = ['DraftKings', 'BetMGM', 'theScore BET', 'BetRivers']

export default function TrackerPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [type, setType] = useState<'deposit' | 'withdrawal'>('deposit')
  const [amount, setAmount] = useState('')
  const [sportsbook, setSportsbook] = useState('DraftKings')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [notes, setNotes] = useState('')

  useEffect(() => {
    const saved = localStorage.getItem('gnl_tracker_transactions')
    if (saved) setTransactions(JSON.parse(saved))
  }, [])

  const addTransaction = () => {
    if (!amount) return
    const newTx: Transaction = {
      id: Date.now(),
      type,
      amount: parseFloat(amount),
      sportsbook,
      date,
      notes
    }
    const updated = [newTx, ...transactions]
    setTransactions(updated)
    localStorage.setItem('gnl_tracker_transactions', JSON.stringify(updated))
    setAmount('')
    setNotes('')
  }

  const deleteTransaction = (id: number) => {
    const updated = transactions.filter(t => t.id !== id)
    setTransactions(updated)
    localStorage.setItem('gnl_tracker_transactions', JSON.stringify(updated))
  }

  const getBalance = (sb: string) => {
    return transactions
      .filter(t => t.sportsbook === sb)
      .reduce((acc, t) => t.type === 'deposit' ? acc + t.amount : acc - t.amount, 0)
  }

  const totalBalance = sportsbooks.reduce((acc, sb) => acc + getBalance(sb), 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] to-[#16213e] p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Link href="/" className="text-[#00d9ff] hover:underline">← Back to Home</Link>
        </div>

        <h1 className="text-3xl font-bold text-[#00d9ff] mb-2">💰 Bankroll Tracker</h1>
        <p className="text-gray-400 mb-8">Track deposits, withdrawals, and balances</p>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-black/30 backdrop-blur border border-[#00d9ff]/30 rounded-2xl p-6 mb-6">
              <h2 className="text-xl font-bold text-[#00d9ff] mb-4">Add Transaction</h2>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-400 mb-2">Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as 'deposit' | 'withdrawal')}
                    className="w-full p-3 bg-black/30 border border-[#00d9ff]/30 rounded-lg text-white"
                  >
                    <option value="deposit">Deposit</option>
                    <option value="withdrawal">Withdrawal</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-400 mb-2">Amount ($)</label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full p-3 bg-black/30 border border-[#00d9ff]/30 rounded-lg text-white"
                    placeholder="100"
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-400 mb-2">Sportsbook</label>
                  <select
                    value={sportsbook}
                    onChange={(e) => setSportsbook(e.target.value)}
                    className="w-full p-3 bg-black/30 border border-[#00d9ff]/30 rounded-lg text-white"
                  >
                    {sportsbooks.map(sb => (
                      <option key={sb} value={sb}>{sb}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-400 mb-2">Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full p-3 bg-black/30 border border-[#00d9ff]/30 rounded-lg text-white"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-gray-400 mb-2">Notes</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-3 bg-black/30 border border-[#00d9ff]/30 rounded-lg text-white"
                  placeholder="Optional notes"
                />
              </div>
              <button
                onClick={addTransaction}
                className="w-full py-3 bg-gradient-to-r from-[#00d9ff] to-[#00ff88] text-black font-bold rounded-lg"
              >
                Add Transaction
              </button>
            </div>

            <div className="bg-black/30 backdrop-blur border border-[#00d9ff]/30 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-[#00d9ff] mb-4">Transaction History</h2>
              {transactions.length === 0 ? (
                <p className="text-gray-400 text-center py-8">No transactions yet</p>
              ) : (
                <div className="space-y-3">
                  {transactions.map(t => (
                    <div key={t.id} className="flex justify-between items-center p-4 bg-white/5 rounded-lg">
                      <div>
                        <div className="font-bold">
                          <span className={t.type === 'deposit' ? 'text-[#00ff88]' : 'text-[#ff4757]'}>
                            {t.type === 'deposit' ? '+' : '-'}${t.amount}
                          </span>
                          {' '}at {t.sportsbook}
                        </div>
                        <div className="text-sm text-gray-400">{t.date} {t.notes && `• ${t.notes}`}</div>
                      </div>
                      <button
                        onClick={() => deleteTransaction(t.id)}
                        className="p-2 hover:bg-red-500/20 rounded text-red-400"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="bg-black/30 backdrop-blur border border-[#00d9ff]/30 rounded-2xl p-6 sticky top-8">
              <h2 className="text-xl font-bold text-[#00d9ff] mb-4">Current Balances</h2>
              <div className="text-3xl font-bold text-[#00ff88] mb-6">${totalBalance.toFixed(2)}</div>
              <div className="space-y-3">
                {sportsbooks.map(sb => {
                  const balance = getBalance(sb)
                  return (
                    <div key={sb} className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                      <span className="text-gray-400">{sb}</span>
                      <span className={`font-bold ${balance >= 0 ? 'text-[#00ff88]' : 'text-[#ff4757]'}`}>
                        ${balance.toFixed(2)}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
