# 🎯 Sportsbook Tracker

Arbitrage betting tracker with calculator, bankroll management, and bet history.

## 🚀 Production (Real Data)

- 🧮 **Calculator**: https://gnl324.github.io/sportsbook-tracker/calculator.html
- 💰 **Bankroll Tracker**: https://gnl324.github.io/sportsbook-tracker/tracker.html
- 📊 **Bet History**: https://gnl324.github.io/sportsbook-tracker/bets.html

## 🏖️ Sandbox (Test Data)

- 🧮 **Calculator**: https://gnl324.github.io/sportsbook-tracker/sandbox/calculator.html
- 💰 **Bankroll Tracker**: https://gnl324.github.io/sportsbook-tracker/sandbox/tracker.html
- 📊 **Bet History**: https://gnl324.github.io/sportsbook-tracker/sandbox/bets.html

## 📋 Features

- ✅ Arbitrage calculator with bankroll integration
- ✅ Multi-sportsbook bankroll tracking
- ✅ Bet history with proof images
- ✅ Auto-settlement with bankroll sync
- ✅ Pending bet tracking ("In Use" funds)
- ✅ Export/Import for cross-browser sync
- ✅ Sandbox environment for safe testing

## 🎯 Usage

### Production
Use for real betting with actual money.

### Sandbox
Use for testing new features, UI experiments, and learning.

## 📁 File Structure

```
sportsbook-tracker/
├── calculator.html          # Production Calculator
├── tracker.html             # Production Bankroll Tracker
├── bets.html                # Production Bet History
├── bankroll-data.json       # Default bankroll data
├── bet-history-data.json    # Default bet history
└── sandbox/
    ├── calculator.html      # Sandbox Calculator
    ├── tracker.html         # Sandbox Tracker
    └── bets.html            # Sandbox Bet History
```

## 🛠️ Development

1. Make changes to source files in `/trading-betting/`
2. Test in sandbox first
3. Deploy to production when ready
4. Commit and push to GitHub

## 📊 Data Storage

- **Production**: `localStorage` keys prefixed with `gnl_`
- **Sandbox**: `localStorage` keys prefixed with `gnl_sandbox_`
- Data is browser-specific (Chrome ≠ Safari)
- Use Export/Import to sync across browsers

## 🎲 Sportsbooks Supported

- DraftKings
- FanDuel
- BetMGM
- theScore BET
- BetRivers
- Fanatics
- Kalshi

---

**Built for arbitrage betting tracking and bankroll management.**
