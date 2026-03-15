# Sandeep Karna Crypto Empire

## Current State
Previous builds failed. Starting fresh with a complete rebuild based on all accumulated requirements.

## Requested Changes (Diff)

### Add
- User signup/login system (fixed and working)
- Admin panel at /admin (username: sandeepkarna321, password: Sandeep@321)
- Dark theme (default), light/dark toggle
- Home page: hero banner, vlog previews, news previews, trading journey preview, ads/promotions carousel — NO crypto charts on home
- Separate Crypto page with live prices (CoinGecko API, auto-refresh 60s)
- Separate News page with world news (auto-refresh 5 mins)
- Trading Journey page: timeline posts, admin can add/edit/delete
- Vlog page: YouTube embed video cards, filterable tabs
- Earn page: Watch to Earn (0.1 USDT/video, admin approval), Write to Earn (article submission, admin approval)
- Wallet page (separate): Deposit section showing ETH/BTC/SOL/TRON addresses + Withdrawal requests (min $10, admin approval)
  - ETH: 0x8778663Dc7A7814eb6d443384fdb23AE180a7F8F
  - BTC: bc1qaan3fp940gg6hy2nhnuta4d7208x84gfrcxuc6
  - SOL: G4vAf5wE1o7CnxYEWKPk96Ym9Y3Qd1ZWsU2QNsruG6PX
  - TRON: TFiaFMNBnDFkLNE9n46jDvtysvU5vLPFL9
- Ads & Promotions section: admin can add video/photo/URL promotions, displayed on home page
- Admin panel tabs: Users, Vlogs, News, Trading Posts, Ads/Promotions, Deposits, Withdrawals, Earn Approvals, Settings
- All user actions (earn claims, withdrawals, deposits) require admin approval before processing
- Withdrawal requests stored with full details visible in admin panel
- Settings page: admin can edit deposit addresses, site settings
- 50+ features for user engagement and earning

### Modify
- Home page: remove crypto chart/price section
- Wallet: separate dedicated page

### Remove
- Crypto ticker/charts from home page

## Implementation Plan
1. Backend: User auth, posts, vlogs, news, ads, earn tasks, wallet (deposit/withdrawal), admin CRUD for everything
2. Frontend pages: Home, Crypto, News, Trading, Vlog, Earn, Wallet, Admin, Login, Signup
3. Admin panel with all management tabs
4. Dark theme default with toggle
5. Live crypto prices via CoinGecko public API (http-outcalls from frontend)
6. Responsive, attractive dark UI design
