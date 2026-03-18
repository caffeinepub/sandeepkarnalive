# SKCE - Sandeep Karn Crypto Empire

## Current State
Existing full-stack platform with Login/Signup, Wallet, Earning Tasks, Trading, Admin Panel, Vlogs, Blog, SEO. UI uses basic dark theme with Tailwind. All functional logic is in place.

## Requested Changes (Diff)

### Add
- Global design tokens: Black #0A0A0A bg, Neon Yellow #FFD700 primary, Electric Blue #00F0FF accent
- Glassmorphism effects (backdrop-blur, semi-transparent cards with colored borders)
- Neon glow box-shadows on cards and buttons
- Gradient borders using CSS tricks
- Animated hero section on Home with floating crypto particles/grid background
- Glassmorphism login/signup card with neon glow buttons and animated tab switch
- OTP input boxes with auto-focus (6 boxes side by side, gold glow on active)
- 2FA setup screen with animated QR code reveal
- "Last login device" card on Profile with mobile/desktop icon
- Security score XP bar (0-100) on Profile
- Wallet: big animated balance counter (number count-up on load), glow border card
- Wallet: 3D style Deposit/Withdraw buttons with hover lift effect
- Wallet: coin list with live price blinking animation (green/red flash on price change)
- Wallet: swipeable wallet tabs (Spot / Funding / P2P) with slide animation
- Wallet: pie chart for asset distribution
- Earn page: daily reward spin wheel animation
- Earn page: XP progress bar showing level
- Earn page: leaderboard table (top earners)
- Earn page: referral earnings card with glow
- P2P page: BUY/SELL big toggle tabs
- P2P page: filter panel (currency, payment method)
- P2P page: escrow lock animation (padlock icon animates on lock)
- P2P page: seller rating stars + level badge + completion rate bar
- Trading page: TradingView chart (full width), order book (right), buy/sell panel (bottom)
- Trading: price change green/red flash animation on ticker
- Notifications: bell icon with red pulse badge, slide-down panel
- Toast notifications (top-right, smooth slide-in)
- KYC page: drag/drop document upload, camera selfie step, AI scan loading animation
- KYC: verification progress bar (3 steps), status badges (Pending/Verified/Rejected)
- Floating AI trading assistant bubble (bottom-right, opens suggestion cards BUY/SELL/HOLD)
- Missions/Gamified page: XP level badges, animated rewards
- Navbar: glassmorphism sticky with glow logo
- Admin panel: analytics cards with live number animations, revenue/user growth charts
- Security page: animated shield icon, "Safe / Risk detected" indicator

### Modify
- index.css: Complete redesign with OKLCH tokens for black/yellow/blue palette, dark mode only
- tailwind.config.js: Add custom colors, fonts (Bricolage Grotesque + Satoshi), glow shadows, gradient border utilities
- Login.tsx: Glassmorphism card, animated login/signup switch, neon buttons
- Signup.tsx: Match login design
- Wallet.tsx: New premium design with animated balance, coin list, swipeable tabs, pie chart
- Home.tsx: Hero with animated background (CSS grid/particles), CTA glow button, live price ticker
- Earn.tsx: Gamified UI redesign with spin wheel, XP bar, leaderboard
- Navbar.tsx: Glass effect, neon accent
- AdminDashboard.tsx / Admin.tsx: Dark analytics cards, charts
- Profile.tsx: Security score XP bar, last login device card
- Trading.tsx: Full professional trading UI with TradingView embed, order book

### Remove
- Any hardcoded light mode colors
- Generic/plain button styles replaced with neon glow versions

## Implementation Plan
1. Update index.css with OKLCH dark theme tokens (black, yellow, blue)
2. Update tailwind.config.js with custom fonts, glow shadows, animations
3. Redesign Navbar with glassmorphism
4. Redesign Home hero with animated crypto background
5. Redesign Login/Signup with glassmorphism card + neon buttons
6. Redesign Wallet with animated balance, coin list, pie chart, swipeable tabs
7. Redesign Earn with spin wheel, XP bar, leaderboard
8. Redesign Trading page with TradingView chart + order book + buy/sell panel
9. Add P2P page with buy/sell tabs, escrow animation, seller ratings, chat UI
10. Add KYC page with drag/drop upload, progress steps, status badges
11. Update Profile with security score, last login device card
12. Update Admin panel with analytics charts and live number animations
13. Add floating AI assistant bubble
14. Add notification bell with slide-down panel and toast system
15. Validate and fix all TypeScript/build errors
