import React, { useState } from 'react'
import { Download, Upload } from 'lucide-react'
import * as XLSX from 'xlsx'

function Calculator({ isSandbox }) {
  const [odds1, setOdds1] = useState('')
  const [odds2, setOdds2] = useState('')
  const [totalStake, setTotalStake] = useState('')
  const [results, setResults] = useState(null)

  const calculateArb = () => {
    const o1 = parseFloat(odds1)
    const o2 = parseFloat(odds2)
    const stake = parseFloat(totalStake)

    if (!o1 || !o2 || !stake) return

    // Convert American odds to decimal
    const d1 = o1 > 0 ? (o1 / 100) + 1 : 1 + (100 / Math.abs(o1))
    const d2 = o2 > 0 ? (o2 / 100) + 1 : 1 + (100 / Math.abs(o2))

    // Calculate arbitrage percentage
    const arbPercent = (1 / d1) + (1 / d2)
    const isArb = arbPercent < 1

    // Calculate stakes
    const stake1 = (stake * (1 / d1)) / arbPercent
    const stake2 = (stake * (1 / d2)) / arbPercent

    // Calculate profit
    const profit = (stake1 * d1) - stake
    const roi = (profit / stake) * 100

    setResults({
      stake1: stake1.toFixed(2),
      stake2: stake2.toFixed(2),
      profit: profit.toFixed(2),
      roi: roi.toFixed(2),
      isArb,
      arbPercent: (arbPercent * 100).toFixed(2)
    })
  }

  const reset = () => {
    setOdds1('')
    setOdds2('')
    setTotalStake('')
    setResults(null)
  }

  return (
    <div className="container">
      <h1 style={{ color: '#00d9ff', marginBottom: '10px' }}>🧮 Arbitrage Calculator</h1>
      <p style={{ color: '#888', marginBottom: '30px' }}>
        Calculate optimal bet stakes for guaranteed profit
      </p>

      <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div className="grid grid-2" style={{ marginBottom: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: '#888' }}>Odds 1 (American)</label>
            <input
              type="number"
              className="input"
              placeholder="+150 or -110"
              value={odds1}
              onChange={(e) => setOdds1(e.target.value)}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: '#888' }}>Odds 2 (American)</label>
            <input
              type="number"
              className="input"
              placeholder="+150 or -110"
              value={odds2}
              onChange={(e) => setOdds2(e.target.value)}
            />
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', color: '#888' }}>Total Stake ($)</label>
          <input
            type="number"
            className="input"
            placeholder="100"
            value={totalStake}
            onChange={(e) => setTotalStake(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <button className="btn btn-primary" onClick={calculateArb} style={{ flex: 1 }}>
            Calculate
          </button>
          <button className="btn btn-secondary" onClick={reset}>
            Reset
          </button>
        </div>

        {results && (
          <div style={{ 
            background: results.isArb ? 'rgba(0, 255, 136, 0.1)' : 'rgba(255, 71, 87, 0.1)',
            border: `1px solid ${results.isArb ? 'rgba(0, 255, 136, 0.5)' : 'rgba(255, 71, 87, 0.5)'}`,
            borderRadius: '12px',
            padding: '20px'
          }}>
            <h3 style={{ color: results.isArb ? '#00ff88' : '#ff4757', marginBottom: '15px' }}>
              {results.isArb ? '✅ Arbitrage Opportunity!' : '❌ No Arbitrage'}
            </h3>
            
            <div className="grid grid-2" style={{ marginBottom: '15px' }}>
              <div>
                <div style={{ color: '#888', fontSize: '13px' }}>Stake 1</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold' }}>${results.stake1}</div>
              </div>
              <div>
                <div style={{ color: '#888', fontSize: '13px' }}>Stake 2</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold' }}>${results.stake2}</div>
              </div>
            </div>

            <div className="grid grid-2">
              <div>
                <div style={{ color: '#888', fontSize: '13px' }}>Guaranteed Profit</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#00ff88' }}>
                  ${results.profit}
                </div>
              </div>
              <div>
                <div style={{ color: '#888', fontSize: '13px' }}>ROI</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#00ff88' }}>
                  {results.roi}%
                </div>
              </div>
            </div>

            {!results.isArb && (
              <p style={{ marginTop: '15px', color: '#ff4757', fontSize: '13px' }}>
                Arb %: {results.arbPercent}% (needs to be under 100% for profit)
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Calculator
