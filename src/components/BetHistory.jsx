import React, { useState, useEffect } from 'react'
import { Download, Upload, Plus, Trash2, Edit } from 'lucide-react'
import * as XLSX from 'xlsx'

function BetHistory({ isSandbox }) {
  const storagePrefix = isSandbox ? 'gnl_sandbox_' : 'gnl_'
  const [bets, setBets] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editBet, setEditBet] = useState(null)
  const [formData, setFormData] = useState({
    event: '',
    sport: '',
    sideA: '',
    sideB: '',
    book1: '',
    book2: '',
    odds1: '',
    odds2: '',
    stake1: '',
    stake2: '',
    profit: '',
    status: 'pending',
    notes: ''
  })

  const sportsbooks = ['DraftKings', 'BetMGM', 'theScore BET', 'BetRivers', 'FanDuel']

  useEffect(() => {
    const saved = localStorage.getItem(storagePrefix + 'bets')
    if (saved) setBets(JSON.parse(saved))
  }, [storagePrefix])

  const saveBets = (data) => {
    setBets(data)
    localStorage.setItem(storagePrefix + 'bets', JSON.stringify(data))
  }

  const resetForm = () => {
    setFormData({
      event: '',
      sport: '',
      sideA: '',
      sideB: '',
      book1: '',
      book2: '',
      odds1: '',
      odds2: '',
      stake1: '',
      stake2: '',
      profit: '',
      status: 'pending',
      notes: ''
    })
    setEditBet(null)
  }

  const handleSubmit = () => {
    const newBet = {
      ...formData,
      id: editBet ? editBet.id : Date.now(),
      date: editBet ? editBet.date : new Date().toISOString(),
      stake1: parseFloat(formData.stake1) || 0,
      stake2: parseFloat(formData.stake2) || 0,
      odds1: parseFloat(formData.odds1) || 0,
      odds2: parseFloat(formData.odds2) || 0,
      profit: parseFloat(formData.profit) || 0
    }

    if (editBet) {
      const updated = bets.map(b => b.id === editBet.id ? newBet : b)
      saveBets(updated)
      alert('✅ Bet updated!')
    } else {
      saveBets([newBet, ...bets])
      alert('✅ Bet added!')
    }

    setShowModal(false)
    resetForm()
  }

  const deleteBet = (id) => {
    if (confirm('Delete this bet?')) {
      saveBets(bets.filter(b => b.id !== id))
    }
  }

  const editBetClick = (bet) => {
    setEditBet(bet)
    setFormData({
      event: bet.event || '',
      sport: bet.sport || '',
      sideA: bet.sideA || '',
      sideB: bet.sideB || '',
      book1: bet.book1 || '',
      book2: bet.book2 || '',
      odds1: bet.odds1?.toString() || '',
      odds2: bet.odds2?.toString() || '',
      stake1: bet.stake1?.toString() || '',
      stake2: bet.stake2?.toString() || '',
      profit: bet.profit?.toString() || '',
      status: bet.status || 'pending',
      notes: bet.notes || ''
    })
    setShowModal(true)
  }

  const exportToExcel = () => {
    const excelData = bets.map(bet => ({
      'Bet ID': bet.id,
      'Date': new Date(bet.date).toLocaleDateString(),
      'Event': bet.event,
      'Sport': bet.sport || 'N/A',
      'Side A': bet.sideA || '',
      'Side B': bet.sideB || '',
      'Sportsbook A': bet.book1,
      'Sportsbook B': bet.book2,
      'Stake A': bet.stake1,
      'Stake B': bet.stake2,
      'Odds A': bet.odds1,
      'Odds B': bet.odds2,
      'Profit': bet.profit,
      'Status': bet.status,
      'Notes': bet.notes || ''
    }))

    const ws = XLSX.utils.json_to_sheet(excelData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Bet History')
    XLSX.writeFile(wb, `GNL_Bet_History_${new Date().toISOString().split('T')[0]}.xlsx`)
  }

  const importFromExcel = (file) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result)
        const workbook = XLSX.read(data, { type: 'array' })
        const sheet = workbook.Sheets[workbook.SheetNames[0]]
        const jsonData = XLSX.utils.sheet_to_json(sheet)
        
        const importedBets = jsonData.map(row => ({
          id: row['Bet ID'] || Date.now(),
          date: row['Date'] ? new Date(row['Date']).toISOString() : new Date().toISOString(),
          event: row['Event'] || '',
          sport: row['Sport'] || '',
          sideA: row['Side A'] || '',
          sideB: row['Side B'] || '',
          book1: row['Sportsbook A'] || '',
          book2: row['Sportsbook B'] || '',
          stake1: parseFloat(row['Stake A']) || 0,
          stake2: parseFloat(row['Stake B']) || 0,
          odds1: parseFloat(row['Odds A']) || 0,
          odds2: parseFloat(row['Odds B']) || 0,
          profit: parseFloat(row['Profit']) || 0,
          status: row['Status'] || 'pending',
          notes: row['Notes'] || ''
        }))

        saveBets([...importedBets, ...bets])
        alert(`✅ Imported ${importedBets.length} bets!`)
      } catch (error) {
        alert('❌ Error importing: ' + error.message)
      }
    }
    reader.readAsArrayBuffer(file)
  }

  const totalProfit = bets.filter(b => b.status !== 'pending').reduce((sum, b) => sum + (b.profit || 0), 0)
  const pendingBets = bets.filter(b => b.status === 'pending').length

  return (
    <div className="container">
      <h1 style={{ color: '#00d9ff', marginBottom: '10px' }}>📊 Bet History</h1>
      <p style={{ color: '#888', marginBottom: '30px' }}>
        Log and track all your arbitrage bets with Excel export/import
      </p>

      <div className="grid grid-3" style={{ marginBottom: '30px' }}>
        <div className="card">
          <div style={{ color: '#888', fontSize: '13px', marginBottom: '5px' }}>Total Bets</div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#00d9ff' }}>{bets.length}</div>
        </div>
        <div className="card">
          <div style={{ color: '#888', fontSize: '13px', marginBottom: '5px' }}>Pending</div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#ffa502' }}>{pendingBets}</div>
        </div>
        <div className="card">
          <div style={{ color: '#888', fontSize: '13px', marginBottom: '5px' }}>Total Profit</div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: totalProfit >= 0 ? '#00ff88' : '#ff4757' }}>
            ${totalProfit.toFixed(2)}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button className="btn btn-primary" onClick={() => { resetForm(); setShowModal(true) }}>
          <Plus size={18} style={{ marginRight: '5px' }} /> Add Bet
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

      <div className="card">
        {bets.length === 0 ? (
          <p style={{ color: '#888', textAlign: 'center', padding: '40px' }}>
            No bets yet. Click "Add Bet" to log your first arbitrage!
          </p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid rgba(0, 217, 255, 0.3)' }}>
                  <th style={{ padding: '12px', textAlign: 'left', color: '#00d9ff' }}>Date</th>
                  <th style={{ padding: '12px', textAlign: 'left', color: '#00d9ff' }}>Event</th>
                  <th style={{ padding: '12px', textAlign: 'left', color: '#00d9ff' }}>Books</th>
                  <th style={{ padding: '12px', textAlign: 'right', color: '#00d9ff' }}>Stakes</th>
                  <th style={{ padding: '12px', textAlign: 'right', color: '#00d9ff' }}>Profit</th>
                  <th style={{ padding: '12px', textAlign: 'center', color: '#00d9ff' }}>Status</th>
                  <th style={{ padding: '12px', textAlign: 'center', color: '#00d9ff' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bets.map((bet) => (
                  <tr key={bet.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <td style={{ padding: '12px', color: '#888' }}>
                      {new Date(bet.date).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '12px' }}>
                      <div style={{ fontWeight: 'bold' }}>{bet.event || 'Unnamed'}</div>
                      <div style={{ fontSize: '12px', color: '#888' }}>
                        {bet.sideA} vs {bet.sideB}
                      </div>
                    </td>
                    <td style={{ padding: '12px', fontSize: '12px' }}>
                      <div>{bet.book1}</div>
                      <div>{bet.book2}</div>
                    </td>
                    <td style={{ padding: '12px', textAlign: 'right' }}>
                      <div>${bet.stake1?.toFixed(2)}</div>
                      <div>${bet.stake2?.toFixed(2)}</div>
                    </td>
                    <td style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold', color: '#00ff88' }}>
                      ${bet.profit?.toFixed(2)}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        background: bet.status === 'pending' ? 'rgba(255, 165, 2, 0.2)' : 'rgba(0, 255, 136, 0.2)',
                        color: bet.status === 'pending' ? '#ffa502' : '#00ff88'
                      }}>
                        {bet.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '5px', justifyContent: 'center' }}>
                        <button className="btn btn-secondary" style={{ padding: '6px 12px' }} onClick={() => editBetClick(bet)}>
                          <Edit size={14} />
                        </button>
                        <button className="btn btn-secondary" style={{ padding: '6px 12px', background: 'rgba(255, 71, 87, 0.2)', color: '#ff4757' }} onClick={() => deleteBet(bet.id)}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
          zIndex: 1000,
          overflowY: 'auto',
          padding: '20px'
        }}>
          <div className="card" style={{ maxWidth: '600px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 style={{ color: '#00d9ff', marginBottom: '20px' }}>
              {editBet ? '✏️ Edit Bet' : '➕ Add Bet'}
            </h3>

            <div className="grid grid-2" style={{ marginBottom: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#888' }}>Event</label>
                <input className="input" placeholder="Lakers vs Mavs" value={formData.event} onChange={(e) => setFormData({...formData, event: e.target.value})} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#888' }}>Sport</label>
                <input className="input" placeholder="NBA" value={formData.sport} onChange={(e) => setFormData({...formData, sport: e.target.value})} />
              </div>
            </div>

            <div className="grid grid-2" style={{ marginBottom: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#888' }}>Side A</label>
                <input className="input" placeholder="Lakers" value={formData.sideA} onChange={(e) => setFormData({...formData, sideA: e.target.value})} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#888' }}>Side B</label>
                <input className="input" placeholder="Mavs" value={formData.sideB} onChange={(e) => setFormData({...formData, sideB: e.target.value})} />
              </div>
            </div>

            <div className="grid grid-2" style={{ marginBottom: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#888' }}>Sportsbook A</label>
                <select className="input" value={formData.book1} onChange={(e) => setFormData({...formData, book1: e.target.value})}>
                  <option value="">Select...</option>
                  {sportsbooks.map(sb => <option key={sb} value={sb}>{sb}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#888' }}>Sportsbook B</label>
                <select className="input" value={formData.book2} onChange={(e) => setFormData({...formData, book2: e.target.value})}>
                  <option value="">Select...</option>
                  {sportsbooks.filter(s => s !== formData.book1).map(sb => <option key={sb} value={sb}>{sb}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-2" style={{ marginBottom: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#888' }}>Odds A (American)</label>
                <input className="input" type="number" placeholder="+150" value={formData.odds1} onChange={(e) => setFormData({...formData, odds1: e.target.value})} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#888' }}>Odds B (American)</label>
                <input className="input" type="number" placeholder="-110" value={formData.odds2} onChange={(e) => setFormData({...formData, odds2: e.target.value})} />
              </div>
            </div>

            <div className="grid grid-2" style={{ marginBottom: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#888' }}>Stake A ($)</label>
                <input className="input" type="number" placeholder="100" value={formData.stake1} onChange={(e) => setFormData({...formData, stake1: e.target.value})} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#888' }}>Stake B ($)</label>
                <input className="input" type="number" placeholder="100" value={formData.stake2} onChange={(e) => setFormData({...formData, stake2: e.target.value})} />
              </div>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#888' }}>Profit ($)</label>
              <input className="input" type="number" placeholder="2.03" value={formData.profit} onChange={(e) => setFormData({...formData, profit: e.target.value})} />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#888' }}>Status</label>
              <select className="input" value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}>
                <option value="pending">Pending</option>
                <option value="settled">Settled</option>
              </select>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#888' }}>Notes</label>
              <input className="input" placeholder="Optional notes..." value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} />
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="btn btn-primary" onClick={handleSubmit} style={{ flex: 1 }}>
                {editBet ? 'Update Bet' : 'Add Bet'}
              </button>
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default BetHistory
