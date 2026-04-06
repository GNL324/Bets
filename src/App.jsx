import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { Calculator, TrendingUp, History, Home } from 'lucide-react'
import CalculatorPage from './components/Calculator'
import TrackerPage from './components/Tracker'
import BetHistoryPage from './components/BetHistory'

function HomePage() {
  return (
    <div className="container">
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '36px', color: '#00d9ff', marginBottom: '10px' }}>
          🎯 GNL Sportsbook Tracker
        </h1>
        <p style={{ color: '#888' }}>Arbitrage betting tools for bankroll management</p>
      </div>

      <div className="grid" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <Link to="/calculator" style={{ textDecoration: 'none' }}>
          <div className="card" style={{ textAlign: 'center', cursor: 'pointer' }}>
            <div style={{ fontSize: '48px', marginBottom: '15px' }}>🧮</div>
            <h2 style={{ color: '#00d9ff', marginBottom: '10px' }}>Arbitrage Calculator</h2>
            <p style={{ color: '#888', marginBottom: '20px' }}>
              Calculate optimal bet stakes across sportsbooks with real-time profit analysis
            </p>
            <button className="btn btn-primary">Open Calculator</button>
          </div>
        </Link>

        <Link to="/tracker" style={{ textDecoration: 'none' }}>
          <div className="card" style={{ textAlign: 'center', cursor: 'pointer' }}>
            <div style={{ fontSize: '48px', marginBottom: '15px' }}>💰</div>
            <h2 style={{ color: '#00d9ff', marginBottom: '10px' }}>Bankroll Tracker</h2>
            <p style={{ color: '#888', marginBottom: '20px' }}>
              Track deposits, withdrawals, and balances across all your sportsbooks
            </p>
            <button className="btn btn-primary">Open Tracker</button>
          </div>
        </Link>

        <Link to="/bets" style={{ textDecoration: 'none' }}>
          <div className="card" style={{ textAlign: 'center', cursor: 'pointer' }}>
            <div style={{ fontSize: '48px', marginBottom: '15px' }}>📊</div>
            <h2 style={{ color: '#00d9ff', marginBottom: '10px' }}>Bet History</h2>
            <p style={{ color: '#888', marginBottom: '20px' }}>
              Log and track all your arbitrage bets with Excel export/import
            </p>
            <button className="btn btn-primary">Open Bet History</button>
          </div>
        </Link>
      </div>

      <div className="card" style={{ maxWidth: '800px', margin: '40px auto 0', textAlign: 'center' }}>
        <h3 style={{ color: '#ffa502', marginBottom: '10px' }}>🏖️ Sandbox Environment Available</h3>
        <p style={{ color: '#888', marginBottom: '15px' }}>Test new features safely without affecting your real data</p>
        <div>
          <a href="/sportsbook-tracker/?sandbox=true" style={{ color: '#00d9ff', margin: '0 10px' }}>Sandbox Mode</a>
        </div>
      </div>
    </div>
  )
}

function App() {
  const [isSandbox, setIsSandbox] = useState(false)

  return (
    <Router basename="/sportsbook-tracker">
      <div style={{ minHeight: '100vh' }}>
        <nav style={{ 
          background: 'rgba(0,0,0,0.5)', 
          padding: '15px 20px',
          marginBottom: '20px',
          borderBottom: '1px solid rgba(0, 217, 255, 0.3)'
        }}>
          <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Link to="/" style={{ color: '#00d9ff', textDecoration: 'none', fontWeight: 'bold', fontSize: '18px' }}>
              🎯 GNL Tracker
            </Link>
            <div style={{ display: 'flex', gap: '20px' }}>
              <Link to="/" style={{ color: '#fff', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Home size={18} /> Home
              </Link>
              <Link to="/calculator" style={{ color: '#fff', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Calculator size={18} /> Calculator
              </Link>
              <Link to="/tracker" style={{ color: '#fff', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <TrendingUp size={18} /> Tracker
              </Link>
              <Link to="/bets" style={{ color: '#fff', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <History size={18} /> Bets
              </Link>
            </div>
            <button 
              onClick={() => setIsSandbox(!isSandbox)}
              className={isSandbox ? 'btn btn-success' : 'btn btn-secondary'}
              style={{ padding: '8px 16px', fontSize: '13px' }}
            >
              {isSandbox ? '🏖️ Sandbox' : '🚀 Production'}
            </button>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/calculator" element={<CalculatorPage isSandbox={isSandbox} />} />
          <Route path="/tracker" element={<TrackerPage isSandbox={isSandbox} />} />
          <Route path="/bets" element={<BetHistoryPage isSandbox={isSandbox} />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
