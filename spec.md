# SandeepKarnaLive - Major Feature Update

## Current State
- Home page with crypto ticker, news preview, vlog preview
- Crypto prices page (live from CoinGecko)
- News page (live from GNews)
- Trading journey page
- Vlog page with admin-managed posts
- Admin login/dashboard for managing vlogs and announcements
- Light theme only
- No user registration/login
- No earn features
- No deposit/withdrawal system
- No ads/promotion section

## Requested Changes (Diff)

### Add
- **Dark theme** with toggle (default dark, light mode available)
- **User Signup/Login** - register with username + password, login, profile page
- **Ads & Promotions section** - admin creates ads/promotions shown in crypto ticker area and dedicated section on home page
- **Write to Earn** - users write articles/posts and earn USDT rewards (admin sets reward per post, approves earnings)
- **Watch Video to Earn** - users watch vlogs to earn 0.1 USDT per video (max daily limit), admin must approve payout
- **Deposit system** - users deposit USDT/BTC/ETH/Binance Pay, submit txHash for admin approval
- **Withdrawal system** - users request withdrawal (min $10 USD), admin approves/rejects
- **User Balance/Wallet** - each user has a balance that shows earned + deposited amounts
- **Admin approval flow** - all withdrawals, deposits, earn payouts require admin approval before processing
- **Admin full control** - manage ads, promotions, earn tasks, user balances, approve/reject all transactions

### Modify
- **Crypto ticker** - also show ads/promotions scrolling alongside crypto prices
- **Navbar** - add Login/Signup button, theme toggle, user wallet balance if logged in
- **Home page** - add earn section (Write to Earn + Watch Video to Earn cards), ads section
- **Admin dashboard** - add tabs for: Vlogs, Announcements, Ads/Promotions, Deposits, Withdrawals, Earn Approvals, User Management
- **Trading page** - add trading simulator/journal with P&L tracking

### Remove
- Nothing removed

## Implementation Plan
1. Backend: Add Ad type + CRUD (admin only)
2. Backend: Add UserAccount type (username, passwordHash, principal, balance, totalEarned, totalDeposited)
3. Backend: Add DepositRequest type (id, userId, currency, amount, txHash, walletAddress, status, createdAt)
4. Backend: Add WithdrawalRequest type (id, userId, amount, currency, walletAddress, status, createdAt)
5. Backend: Add EarnRecord type (id, userId, taskType: watch/write, amount, status: pending/approved/rejected, createdAt)
6. Backend: Add VideoWatchRecord to track which videos a user has watched (for 0.1 USDT per video)
7. Backend: Admin methods for approving/rejecting deposits, withdrawals, earn records
8. Backend: User methods for submitting deposits, withdrawal requests, earn claims
9. Frontend: Add ThemeProvider with dark/light toggle
10. Frontend: Add Login/Signup pages and AuthContext
11. Frontend: Add Earn page (Write to Earn + Watch Video to Earn)
12. Frontend: Add Wallet page (balance, deposits, withdrawals history)
13. Frontend: Add Ads/Promotions section to Home and crypto ticker
14. Frontend: Expand AdminDashboard with all new management tabs
