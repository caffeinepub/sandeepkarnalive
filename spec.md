# SandeepKarnaLive

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- Public homepage with hero banner for Sandeepkarnalive.com branding
- Daily vlog/promo section: featured video embed + promotional content cards
- Trading journey section: trading tips, performance highlights, motivational posts
- Crypto dashboard: live prices and charts for top coins (BTC, ETH, BNB, SOL, XRP, ADA, DOGE, and more) fetched via HTTP outcalls to CoinGecko API, auto-refreshing every 60 seconds
- 24-hour world news feed: auto-refreshing news headlines from a public news API via HTTP outcalls
- Admin panel (protected by login: sandeepkarna321 / Sandeep@321) to manage vlog posts, trading posts, and announcements
- Navigation: Home, Crypto, News, Trading Journey, Vlog, Admin

### Modify
- N/A (new project)

### Remove
- N/A

## Implementation Plan
1. Select `authorization` and `http-outcalls` components
2. Generate Motoko backend with:
   - Post/announcement CRUD for admin
   - HTTP outcall helpers for crypto prices (CoinGecko) and news (NewsAPI / GNews)
   - Role-based admin access with hardcoded credentials
3. Build React frontend:
   - Public pages: Home, Crypto Dashboard, News Feed, Trading Journey, Vlog
   - Admin dashboard behind login gate
   - Auto-refresh intervals for crypto and news
   - Responsive layout
