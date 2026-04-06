# 🎯 GNL Sportsbook Tracker

Arbitrage betting tools for bankroll management built with React + Vite.

## 🚀 Features

- **🧮 Arbitrage Calculator** - Calculate optimal bet stakes for guaranteed profit
- **💰 Bankroll Tracker** - Track deposits, withdrawals, and balances across sportsbooks
- **📊 Bet History** - Log and track all your arbitrage bets
- **📊 Excel Export/Import** - Backup and restore your data
- **🏖️ Sandbox Mode** - Test features without affecting real data

## 🛠️ Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool (fast builds)
- **React Router** - Client-side routing
- **XLSX** - Excel export/import
- **Lucide React** - Icons

## 📦 Installation

```bash
npm install
```

## 🏃 Development

```bash
npm run dev
```

## 🏗️ Build for Production

```bash
npm run build
```

Output will be in `dist/` folder.

## 🌐 Deployment

### GitHub Pages

1. Build: `npm run build`
2. Push `dist/` folder to GitHub
3. Enable GitHub Pages on `main` branch

### Vercel

```bash
vercel deploy
```

### Netlify

```bash
netlify deploy
```

### FTP

Upload contents of `dist/` folder to your web server.

## 📊 Excel Format

### Bet History Export

| Column | Description |
|--------|-------------|
| Bet ID | Unique identifier |
| Date | Bet date |
| Event | Game/event name |
| Sportsbook A/B | Which books used |
| Stake A/B | Bet amounts |
| Odds A/B | Odds on each side |
| Profit | Guaranteed profit |
| Status | Pending/Settled |

### Bankroll Export

**Sheet 1 - Balances:**
- Sportsbook, Balance, In Use, Available

**Sheet 2 - Transactions:**
- Date, Type, Sportsbook, Amount, Notes

## 📝 LocalStorage Keys

- Production: `gnl_sportsbooks`, `gnl_transactions`, `gnl_bets`
- Sandbox: `gnl_sandbox_sportsbooks`, `gnl_sandbox_transactions`, `gnl_sandbox_bets`

## 🎯 Supported Sportsbooks

- DraftKings
- BetMGM
- theScore BET
- BetRivers
- FanDuel

## 📄 License

MIT
