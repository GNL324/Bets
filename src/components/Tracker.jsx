import React, { useState, useEffect } from 'react'
import { Download, Upload, Plus, Minus, RefreshCw } from 'lucide-react'
import * as XLSX from 'xlsx'

function Tracker({ isSandbox }) {
  const storagePrefix = isSandbox ? 'gnl_sandbox_' : 'gnl_'
  
  const [sportsbooks, setSportsbooks] = useState({
    'DraftKings': { balance: 0, inUse: 0 },
    'BetMGM': { balance: 0, inUse: 0 },
    'theScore BET': { balance: 0, inUse: 0 },
    'BetRivers': { balance: 0, inUse: 0 }
  })
  const [transactions, setTransactions] = useState([])
  const [showModal, setShowModal] = useState(null)
  const [modalData, setModalData] = useState({})

  useEffect(() => {
    const saved = localStorage.getItem(storagePrefix + 'sportsbooks')
    const savedTrans = localStorage.getItem(storagePrefix + 'transactions')
    if (saved) setSportsbooks(JSON.parse(saved))
    if (savedTrans) setTransactions(JSON.parse(savedTrans))
  }, [storagePrefix])

  const saveSportsbooks = (data) => {
    setSportsbooks(data)
    localStorage.setItem(storagePrefix + 'sportsbooks', JSON.stringify(data))
  }

  const saveTransactions = (data) => {
    setTransactions(data)
    localStorage.setItem(storagePrefix + 'transactions', JSON.stringify(data))
  }

  const totalBalance = Object.values(sportsbooks).reduce((sum, sb) => sum + (sb.balance || 0), 0)
  const totalInUse = Object.values(sportsbooks).reduce((sum, sb) => sum + (sb.inUse || 0), 0)
  const totalAvailable = totalBalance - totalInUse

  const openModal = (type, book = null) => {
    setShowModal(type)
    setModalData({ type, sportsbook: book, amount: '', notes: '' })
  }

  const submitTransaction = () => {
    const { type, sportsbook, amount, notes } = modalData
    const amt = parseFloat(amount)
    
    if (!sportsbook || !amt || amt <= 0) {
      alert('Please fill in all required fields')
      return
    }

    const newSportsbooks = { ...sportsbooks }
    
    if (type === 'deposit') {
      newSportsbooks[sportsbook].balance = (newSportsbooks[sportsbook].balance || 0) + amt
    } else if (type === 'withdraw') {
      newSportsbooks[sportsbook].balance = (newSportsbooks[sportsbook].balance || 0) - amt
    }

    const newTrans = [{
      type,
      sportsbook,
      amount: amt,
      date: new Date().toISOString(),
      notes: notes || ''
    }, ...transactions]

    saveSportsbooks(newSportsbooks)
    saveTransactions(newTrans)
    setShowModal(null)
  }

  const exportToExcel = () => {
    const balanceData = Object.keys(sportsbooks).map(sb => ({
      'Sportsbook': sb,
      'Balance': sportsbooks[sb].balance || 0,
      'In Use': sportsbooks[sb].inUse || 0,
      'Available': (sportsbooks[sb].balance || 0) - (sportsbooks[sb].inUse || 0)
    }))

    const transactionData = transactions.map(t => ({
      'Date': new Date(t.date).toLocaleDateString(),
      'Type': t.type,
      'Sportsbook': t.sportsbook,
      'Amount': t.amount,
      'Notes': t.notes || ''
    }))

    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(balanceData), 'Balances')
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(transactionData), 'Transactions')
    XLSX.writeFile(wb, `GNL_Bankroll_${new Date().toISOString().split('T')[0]}.xlsx`)
  }

  const importFromExcel = (file) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result)
        const workbook = XLSX.read(data, { type: 'array' })
        
        if (workbook.Sheets['Balances']) {
          const balanceData = XLSX.utils.sheet_to_json(workbook.Sheets['Balances'])
          const newSportsbooks = {}
          balanceData.forEach(row => {
            const sb = row['Sportsbook']
            if (sb) {
              newSportsbooks[sb] = {
                balance: parseFloat(row['Balance']) || 0,
                inUse: parseFloat(row['In Use']) || 0,
                name: sb
              }
            }
          })
          saveSportsbooks(newSportsbooks)
        }

        if (workbook.Sheets['Transactions']) {
          const transactionData = XLSX.utils.sheet_to_json(workbook.Sheets['Transactions'])
          const newTransactions = transactionData.map(row => ({
            type: row['Type'] || 'deposit',
            sportsbook: row['Sportsbook'] || '',
            amount: parseFloat(row['Amount']) || 0,
            date: row['Date'] ? new Date(row['Date']).toISOString() : new Date().toISOString(),
            notes: row['Notes'] || ''
          }))
          saveTransactions(newTransactions)
        }

        alert('✅ Bankroll data imported successfully!')
      } catch (error) {
        alert('❌ Error importing Excel file: ' + error.message)
      }
    }
    reader.readAsArrayBuffer(file)
  }

  return (
    <div className="container">
      <h1 style={{ color: '#00d9ff', marginBottom: '10px' }}>💰 Bankroll Tracker</h1>
      <p style={{ color: '#888', marginBottom: '30px' }}>
        Track deposits, withdrawals, and balances across all your sportsbooks
      </p>

      <div className="grid grid-3" style={{ marginBottom: '30px' }}>
        <div className="card">
          <div style={{ color: '#888', fontSize: '13px', marginBottom: '5px' }}>Total Balance</div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#00d9ff' }}>
            ${totalBalance.toFixed(2)}
          </div>
        </div>
        <div className="card">
          <div style={{ color: '#888', fontSize: '13px', marginBottom: '5px' }}>In Use</div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#ffa502' }}>
            ${totalInUse.toFixed(2)}
          </div>
        </div>
        <div className="card">
          <div style={{ color: '#888', fontSize: '13px', marginBottom: '5px' }}>Available</div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#00ff88' }}>
            ${totalAvailable.toFixed(2)}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button className="btn btn-primary" onClick={() => openModal('deposit')}>
          <Plus size={18} style={{ marginRight: '5px' }} /> Deposit
        </button>
        <button className="btn btn-secondary" onClick={() => openModal('withdraw')}>
          <Minus size={18} style={{ marginRight: '5px' }} /> Withdraw
        </button>
        <button className="btn btn-success" onClick={exportToExcel}>
          <Download size={18} style={{ marginRight: '5px' }} /> Export Excel
        </button>
        <button className="btn btn-success" onClick={() => document.getElementById('excelImport').click()}>
          <Upload size={18} style={{ marginRight: '5px' }} /> Import Excel
        </button>
        <input
          type="file"
          id="excelImport"
          accept=".xlsx,.xls"
          style={{ display: 'none' }}
          onChange={(e) => importFromExcel(e.target.files[0])}
        />
      </div>

      <div className="grid grid-2">
        {Object.keys(sportsbooks).map(book => (
          <div key={book} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h3 style={{ color: '#fff' }}>{book}</h3>
              <div style={{ display: 'flex', gap: '5px' }}>
                <button className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={() => openModal('deposit', book)}>
                  <Plus size={14} />
                </button>
                <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={() => openModal('withdraw', book)}>
                  <Minus size={14} />
                </button>
              </div>
            </div>
            <div style={{ marginBottom: '10px' }}>
              <div style={{ color: '#888', fontSize: '12px' }}>Balance</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#00d9ff' }}>
                ${sportsbooks[book].balance?.toFixed(2) || '0.00'}
              </div>
            </div>
            <div>
              <div style={{ color: '#888', fontSize: '12px' }}>In Use</div>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#ffa502' }}>
                ${sportsbooks[book].inUse?.toFixed(2) || '0.00'}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card" style={{ marginTop: '30px' }}>
        <h3 style={{ color: '#00d9ff', marginBottom: '15px' }}>Recent Transactions</h3>
        {transactions.length === 0 ? (
          <p style={{ color: '#888' }}>No transactions yet</p>
        ) : (
          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {transactions.slice(0, 10).map((t, i) => (
              <div key={i} style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                padding: '10px 0',
                borderBottom: '1px solid rgba(255,255,255,0.1)'
              }}>
                <div>
                  <div style={{ fontWeight: 'bold' }}>
                    {t.type === 'deposit' ? '✅' : '❌'} {t.sportsbook}
                  </div>
                  <div style={{ color: '#888', fontSize: '12px' }}>
                    {new Date(t.date).toLocaleDateString()} - {t.notes || 'No notes'}
                  </div>
                </div>
                <div style={{ 
                  fontWeight: 'bold',
                  color: t.type === 'deposit' ? '#00ff88' : '#ff4757'
                }}>
                  {t.type === 'deposit' ? '+' : '-'}${t.amount.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div className="card" style={{ maxWidth: '400px', width: '100%' }}>
            <h3 style={{ color: '#00d9ff', marginBottom: '20px' }}>
              {modalData.type === 'deposit' ? '✅' : '❌'} {modalData.type === 'deposit' ? 'Deposit' : 'Withdraw'}
            </h3>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#888' }}>Sportsbook</label>
              <select
                className="input"
                value={modalData.sportsbook || ''}
                onChange={(e) => setModalData({ ...modalData, sportsbook: e.target.value })}
              >
                <option value="">Select...</option>
                {Object.keys(sportsbooks).map(sb => (
                  <option key={sb} value={sb}>{sb}</option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#888' }}>Amount ($)</label>
              <input
                type="number"
                className="input"
                placeholder="100"
                value={modalData.amount}
                onChange={(e) => setModalData({ ...modalData, amount: e.target.value })}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#888' }}>Notes (optional)</label>
              <input
                type="text"
                className="input"
                placeholder="Deposit via credit card"
                value={modalData.notes}
                onChange={(e) => setModalData({ ...modalData, notes: e.target.value })}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="btn btn-primary" onClick={submitTransaction} style={{ flex: 1 }}>
                Submit
              </button>
              <button className="btn btn-secondary" onClick={() => setShowModal(null)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Tracker
