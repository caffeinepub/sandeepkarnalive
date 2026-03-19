# Sandeep Karna Crypto Empire

## Current State
- AI Assistant has drag on chat window header only; bubble (closed state) is fixed position and not draggable
- Spot Trading (Trading.tsx) uses `generateOrderBook` with Math.random — fake order book data
- FutureTrading.tsx nav has TradFi tab but it goes nowhere (no route, no page)
- Convert page uses real Binance API prices — OK
- FutureTrading nav tabs (Convert, Spot, TradFi) are decorative buttons with no navigation

## Requested Changes (Diff)

### Add
- TradeFi page (/tradefi): Binance-style crypto earn/savings page — Flexible Savings, Locked Products, Crypto Loans, with live APY rates fetched from Binance savings API or realistic displayed rates per coin; user can subscribe with wallet balance
- Route `/tradefi` in App.tsx

### Modify
- AIAssistant.tsx: Make the floating bubble (closed state) also draggable — add bubblePos state, onBubbleMouseDown/TouchStart handlers so user can move it anywhere on screen
- Trading.tsx (Spot): Replace `generateOrderBook` fake Math.random with real Binance `/api/v3/depth` API calls refreshing every 3s, same as FutureTrading DataTab does
- FutureTrading.tsx: Nav tabs Convert→navigate to /convert, Spot→navigate to /trading, TradFi→navigate to /tradefi (use Link or router navigate)

### Remove
- Nothing removed

## Implementation Plan
1. Create src/frontend/src/pages/TradeFi.tsx — dark themed page with 3 sections: Flexible Savings (live APY per coin), Locked Staking products, Crypto Loans; fetches coin prices from Binance; user can click Subscribe/Stake with wallet balance deduction
2. Update AIAssistant.tsx — add bubblePos state + drag handlers for the closed bubble button
3. Update Trading.tsx — replace generateOrderBook with useEffect that fetches real Binance depth API
4. Update FutureTrading.tsx — nav tabs become <Link> or use router.navigate to proper routes
5. Update App.tsx — import TradeFi and add /tradefi route
