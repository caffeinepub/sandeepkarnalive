# SKCE - Sandeep Karn Crypto Empire

## Current State
- FutureTrading page has sub-tabs: Chart, Overview, Data, Feed — but Overview/Data/Feed show nothing
- P2P page has country selector but no country-specific bank/wallet details or USD→local currency conversion
- AI Assistant is a floating bubble but not draggable, only shows generic signals, no customer support capability

## Requested Changes (Diff)

### Add
- FutureTrading: Overview tab — contract specs, funding rate, open interest, liquidation data
- FutureTrading: Data tab — order book depth, recent trades list with real prices
- FutureTrading: Feed tab — market news/announcements feed
- P2P: Country selector shows country flag + bank payment methods (bank transfer, UPI for IN, eSewa for NP, etc.) + wallet options per country
- P2P: 1 USD = X local currency live conversion (using exchange rate API or hardcoded realistic rates)
- P2P: Sell option also shows 1 USD = local currency
- AI Assistant: Draggable anywhere on screen (drag by header)
- AI Assistant: Full customer support AI — answers questions about SKCE features, deposit/withdrawal, KYC, trading, P2P, wallet, referral, etc.
- AI Assistant: Analyzes buy/sell messages from users and gives intelligent replies
- AI Assistant: Ultra-fast responses with pre-built knowledge base about website

### Modify
- AIAssistant.tsx: Add drag functionality, replace signal widget with full chat UI, add customer support knowledge base
- FutureTrading.tsx: Add content for Overview/Data/Feed tabs
- P2P.tsx: Add country-specific payment methods and currency conversion

### Remove
- Nothing removed

## Implementation Plan
1. Update FutureTrading.tsx — add Overview/Data/Feed tab content with real Binance data
2. Update P2P.tsx — add country payment methods map + live USD conversion display
3. Rebuild AIAssistant.tsx — draggable, full chat, SKCE knowledge base, buy/sell analysis
