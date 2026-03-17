import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  BarChart2,
  RefreshCw,
  Shield,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";

const MARKETS = [
  {
    symbol: "BTC/USDT",
    basePrice: 97000,
    shortName: "BTC",
    binanceSymbol: "BTCUSDT",
  },
  {
    symbol: "ETH/USDT",
    basePrice: 2200,
    shortName: "ETH",
    binanceSymbol: "ETHUSDT",
  },
  {
    symbol: "SOL/USDT",
    basePrice: 140,
    shortName: "SOL",
    binanceSymbol: "SOLUSDT",
  },
  {
    symbol: "BNB/USDT",
    basePrice: 600,
    shortName: "BNB",
    binanceSymbol: "BNBUSDT",
  },
];

const LEVERAGES = [2, 5, 10, 20];

type FuturesPosition = {
  id: number;
  symbol: string;
  direction: "LONG" | "SHORT";
  leverage: number;
  margin: number;
  entryPrice: number;
  liquidationPrice: number;
  positionSize: number;
  timestamp: string;
  closed?: boolean;
  closePrice?: number;
  pnl?: number;
};

function loadPositions(): FuturesPosition[] {
  try {
    return JSON.parse(localStorage.getItem("skl_futures_positions") || "[]");
  } catch {
    return [];
  }
}

function savePositions(positions: FuturesPosition[]) {
  localStorage.setItem("skl_futures_positions", JSON.stringify(positions));
}

export function FutureTrading() {
  const { isLoggedIn, user, updateUser } = useAuth();
  const [market, setMarket] = useState(MARKETS[0]);
  const [direction, setDirection] = useState<"LONG" | "SHORT">("LONG");
  const [leverage, setLeverage] = useState(5);
  const [margin, setMargin] = useState("");
  const [positions, setPositions] = useState<FuturesPosition[]>(loadPositions);

  const [prices, setPrices] = useState<Record<string, number>>(
    Object.fromEntries(MARKETS.map((m) => [m.symbol, m.basePrice])),
  );
  const priceRef = useRef(prices);
  priceRef.current = prices;
  const anchorPrices = useRef<Record<string, number>>(
    Object.fromEntries(MARKETS.map((m) => [m.symbol, m.basePrice])),
  );

  useEffect(() => {
    async function fetchRealPrices() {
      try {
        const symbols = JSON.stringify(MARKETS.map((m) => m.binanceSymbol));
        const res = await fetch(
          `https://api.binance.com/api/v3/ticker/price?symbols=${encodeURIComponent(symbols)}`,
        );
        const data = await res.json();
        if (Array.isArray(data)) {
          const realPrices: Record<string, number> = {};
          for (const ticker of data) {
            const m = MARKETS.find((mk) => mk.binanceSymbol === ticker.symbol);
            if (m) realPrices[m.symbol] = Number.parseFloat(ticker.price);
          }
          if (Object.keys(realPrices).length > 0) {
            setPrices((prev) => ({ ...prev, ...realPrices }));
            anchorPrices.current = { ...anchorPrices.current, ...realPrices };
          }
        }
      } catch {
        /* keep existing */
      }
    }
    fetchRealPrices();
    const iv = setInterval(fetchRealPrices, 15000);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    const iv = setInterval(() => {
      setPrices((prev) =>
        Object.fromEntries(
          MARKETS.map((m) => {
            const current = prev[m.symbol] || m.basePrice;
            const drift = (Math.random() - 0.5) * 0.0005;
            return [m.symbol, current * (1 + drift)];
          }),
        ),
      );
    }, 3000);
    return () => clearInterval(iv);
  }, []);

  const marginNum = Number.parseFloat(margin) || 0;
  const currentPrice = prices[market.symbol] || market.basePrice;
  const positionSize = marginNum * leverage;
  const liquidationPrice =
    direction === "LONG"
      ? currentPrice * (1 - 1 / leverage + 0.005)
      : currentPrice * (1 + 1 / leverage - 0.005);

  function openPosition() {
    if (!isLoggedIn) {
      toast.error("Please login first");
      return;
    }
    if (!marginNum || marginNum < 1) {
      toast.error("Minimum margin is $1");
      return;
    }
    if (!user || user.balance < marginNum) {
      toast.error("Insufficient balance");
      return;
    }
    // Deduct margin from wallet
    updateUser({ balance: (user.balance || 0) - marginNum });

    const pos: FuturesPosition = {
      id: Date.now(),
      symbol: market.symbol,
      direction,
      leverage,
      margin: marginNum,
      entryPrice: currentPrice,
      liquidationPrice,
      positionSize,
      timestamp: new Date().toLocaleString(),
    };
    const updated = [pos, ...positions];
    setPositions(updated);
    savePositions(updated);
    toast.success(
      `${direction} ${market.symbol} opened: $${marginNum} × ${leverage}x`,
    );
    setMargin("");
  }

  function closePosition(id: number) {
    const updated = positions.map((p) => {
      if (p.id !== id || p.closed) return p;
      const current = prices[p.symbol] || p.entryPrice;
      const priceDiff =
        p.direction === "LONG"
          ? current - p.entryPrice
          : p.entryPrice - current;
      const pnl = (priceDiff / p.entryPrice) * p.positionSize;
      // Return margin + pnl (pnl can be negative)
      const returnAmt = p.margin + pnl;
      if (user) {
        const newBalance = Math.max(0, (user.balance || 0) + returnAmt);
        updateUser({ balance: newBalance });
        if (pnl >= 0) {
          toast.success(
            `Position closed! Profit: +$${pnl.toFixed(2)} credited to wallet`,
          );
        } else {
          toast.error(
            `Position closed. Loss: $${Math.abs(pnl).toFixed(2)} deducted from wallet`,
          );
        }
      }
      return { ...p, closed: true, closePrice: current, pnl };
    });
    setPositions(updated);
    savePositions(updated);
  }

  const openPositions = positions.filter((p) => !p.closed);
  const closedPositions = positions.filter((p) => p.closed);

  return (
    <div className="min-h-screen bg-mesh pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold to-orange-brand flex items-center justify-center">
              <BarChart2 className="w-5 h-5 text-navy" />
            </div>
            <div>
              <h1 className="font-display text-3xl font-bold gold-gradient">
                Futures Trading
              </h1>
              <p className="text-muted-foreground text-sm">
                Trade perpetual contracts with leverage — Real profits & losses
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
              <Shield className="w-3 h-3 mr-1" /> Real Trading
            </Badge>
            <Badge className="bg-gold/20 text-gold border-gold/30">
              Up to 20x Leverage
            </Badge>
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
              Live Prices (Binance)
            </Badge>
          </div>
        </motion.div>

        {/* Balance display */}
        {isLoggedIn && user && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-xl p-4 mb-6 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <Wallet className="w-5 h-5 text-gold" />
              <div>
                <div className="text-xs text-muted-foreground">
                  Trading Balance
                </div>
                <div className="font-display font-bold text-gold text-lg">
                  ${(user.balance || 0).toFixed(2)} USDT
                </div>
              </div>
            </div>
            <Link to="/wallet">
              <Button
                variant="outline"
                size="sm"
                className="text-xs border-gold/30 text-gold hover:bg-gold/10"
              >
                Deposit
              </Button>
            </Link>
          </motion.div>
        )}

        {/* Discipline message */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-xl p-4 mb-6 border-yellow-500/30 bg-yellow-500/5 flex items-start gap-3"
        >
          <AlertTriangle className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
          <div>
            <div className="font-semibold text-yellow-400 text-sm">
              Trading Discipline = Consistent Profits
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">
              Never risk more than 2% of your capital per trade. Use stop-loss
              always. Higher leverage = higher risk. Profits and losses are real
              and affect your wallet balance.
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left: Market overview + Positions */}
          <div className="xl:col-span-2 space-y-6">
            {/* Market selector */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card rounded-2xl p-5"
            >
              <h2 className="font-display font-bold text-foreground mb-4">
                Market Prices
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {MARKETS.map((m, i) => {
                  const price = prices[m.symbol];
                  const isSelected = market.symbol === m.symbol;
                  const anchor = anchorPrices.current[m.symbol] || m.basePrice;
                  const diff = ((price - anchor) / anchor) * 100;
                  return (
                    <motion.button
                      key={m.symbol}
                      type="button"
                      data-ocid={`futures.item.${i + 1}`}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.05 * i }}
                      onClick={() => setMarket(m)}
                      className={`glass-card rounded-xl p-4 text-left transition-all ${
                        isSelected
                          ? "border-gold/60 bg-gold/5"
                          : "border-border/30 hover:border-gold/30"
                      }`}
                    >
                      <div className="font-bold text-foreground text-sm">
                        {m.shortName}
                      </div>
                      <div className="font-mono text-gold font-bold mt-1">
                        ${price.toFixed(price < 10 ? 2 : 0)}
                      </div>
                      <div
                        className={`text-xs mt-1 flex items-center gap-0.5 ${
                          diff >= 0 ? "text-green-400" : "text-red-400"
                        }`}
                      >
                        {diff >= 0 ? (
                          <TrendingUp className="w-3 h-3" />
                        ) : (
                          <TrendingDown className="w-3 h-3" />
                        )}
                        {diff >= 0 ? "+" : ""}
                        {diff.toFixed(3)}%
                      </div>
                      {isSelected && (
                        <RefreshCw className="w-3 h-3 text-gold/60 animate-spin mt-2" />
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>

            {/* Positions table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="glass-card rounded-2xl p-5"
            >
              <Tabs defaultValue="open" data-ocid="futures.tab">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-display font-bold text-foreground">
                    Positions
                  </h2>
                  <TabsList className="bg-background/50 border border-border/50">
                    <TabsTrigger
                      value="open"
                      data-ocid="futures.tab"
                      className="text-xs data-[state=active]:bg-gold data-[state=active]:text-navy"
                    >
                      Open ({openPositions.length})
                    </TabsTrigger>
                    <TabsTrigger
                      value="history"
                      data-ocid="futures.tab"
                      className="text-xs data-[state=active]:bg-gold data-[state=active]:text-navy"
                    >
                      History ({closedPositions.length})
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="open">
                  {openPositions.length === 0 ? (
                    <div
                      data-ocid="futures.empty_state"
                      className="text-muted-foreground text-sm text-center py-8"
                    >
                      No open positions. Use the panel to open your first trade.
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-xs text-muted-foreground border-b border-border/30">
                            <th className="text-left pb-2">Symbol</th>
                            <th className="text-left pb-2">Dir.</th>
                            <th className="text-right pb-2">Lev.</th>
                            <th className="text-right pb-2">Margin</th>
                            <th className="text-right pb-2">Entry</th>
                            <th className="text-right pb-2">Current</th>
                            <th className="text-right pb-2">PnL</th>
                            <th className="text-right pb-2">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {openPositions.map((p, i) => {
                            const current = prices[p.symbol] || p.entryPrice;
                            const priceDiff =
                              p.direction === "LONG"
                                ? current - p.entryPrice
                                : p.entryPrice - current;
                            const pnl =
                              (priceDiff / p.entryPrice) * p.positionSize;
                            return (
                              <tr
                                key={p.id}
                                data-ocid={`futures.row.${i + 1}`}
                                className="border-b border-border/10 text-xs"
                              >
                                <td className="py-2 font-medium">{p.symbol}</td>
                                <td className="py-2">
                                  <span
                                    className={`font-bold ${p.direction === "LONG" ? "text-green-400" : "text-red-400"}`}
                                  >
                                    {p.direction}
                                  </span>
                                </td>
                                <td className="py-2 text-right text-gold">
                                  {p.leverage}x
                                </td>
                                <td className="py-2 text-right">
                                  ${p.margin.toFixed(2)}
                                </td>
                                <td className="py-2 text-right font-mono">
                                  ${p.entryPrice.toFixed(1)}
                                </td>
                                <td className="py-2 text-right font-mono">
                                  ${current.toFixed(1)}
                                </td>
                                <td
                                  className={`py-2 text-right font-bold ${pnl >= 0 ? "text-green-400" : "text-red-400"}`}
                                >
                                  {pnl >= 0 ? "+" : ""}
                                  {pnl.toFixed(2)}
                                </td>
                                <td className="py-2 text-right">
                                  <Button
                                    size="sm"
                                    data-ocid="futures.delete_button"
                                    onClick={() => closePosition(p.id)}
                                    className="h-6 text-xs bg-red-500/20 text-red-400 hover:bg-red-500/30 px-2"
                                  >
                                    Close
                                  </Button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="history">
                  {closedPositions.length === 0 ? (
                    <div
                      data-ocid="futures.empty_state"
                      className="text-muted-foreground text-sm text-center py-8"
                    >
                      No closed positions yet.
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-xs text-muted-foreground border-b border-border/30">
                            <th className="text-left pb-2">Symbol</th>
                            <th className="text-left pb-2">Dir.</th>
                            <th className="text-right pb-2">Margin</th>
                            <th className="text-right pb-2">Entry</th>
                            <th className="text-right pb-2">Exit</th>
                            <th className="text-right pb-2">PnL</th>
                          </tr>
                        </thead>
                        <tbody>
                          {closedPositions.slice(0, 10).map((p, i) => (
                            <tr
                              key={p.id}
                              data-ocid={`futures.row.${i + 1}`}
                              className="border-b border-border/10 text-xs"
                            >
                              <td className="py-2 font-medium">{p.symbol}</td>
                              <td className="py-2">
                                <span
                                  className={`font-bold ${p.direction === "LONG" ? "text-green-400" : "text-red-400"}`}
                                >
                                  {p.direction}
                                </span>
                              </td>
                              <td className="py-2 text-right">
                                ${p.margin.toFixed(2)}
                              </td>
                              <td className="py-2 text-right font-mono">
                                ${p.entryPrice.toFixed(1)}
                              </td>
                              <td className="py-2 text-right font-mono">
                                ${(p.closePrice || 0).toFixed(1)}
                              </td>
                              <td
                                className={`py-2 text-right font-bold ${(p.pnl || 0) >= 0 ? "text-green-400" : "text-red-400"}`}
                              >
                                {(p.pnl || 0) >= 0 ? "+" : ""}
                                {(p.pnl || 0).toFixed(2)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </motion.div>
          </div>

          {/* Right: Trading Panel */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-card rounded-2xl p-5"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-bold text-foreground">
                  Open Position
                </h3>
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                  Live
                </Badge>
              </div>

              {/* Current price */}
              <div className="bg-background/50 rounded-xl p-3 mb-4">
                <div className="text-xs text-muted-foreground mb-1">
                  {market.symbol}
                </div>
                <div className="font-display font-bold text-2xl text-gold">
                  ${currentPrice.toFixed(currentPrice < 10 ? 3 : 1)}
                </div>
                <div className="flex items-center gap-1 text-xs text-green-400 mt-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  Live (Binance)
                </div>
              </div>

              {isLoggedIn && user && (
                <div className="bg-background/30 rounded-lg px-3 py-2 mb-4 text-xs flex justify-between">
                  <span className="text-muted-foreground">Balance</span>
                  <span className="font-bold text-gold">
                    ${(user.balance || 0).toFixed(2)}
                  </span>
                </div>
              )}

              {/* Direction */}
              <div className="space-y-2 mb-4">
                <Label className="text-xs text-foreground/70">Direction</Label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    data-ocid="futures.toggle"
                    onClick={() => setDirection("LONG")}
                    className={`rounded-lg p-3 text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                      direction === "LONG"
                        ? "bg-green-600 text-white"
                        : "bg-background/50 text-muted-foreground border border-border/40 hover:border-green-500/30"
                    }`}
                  >
                    <ArrowUpRight className="w-4 h-4" /> Long
                  </button>
                  <button
                    type="button"
                    data-ocid="futures.toggle"
                    onClick={() => setDirection("SHORT")}
                    className={`rounded-lg p-3 text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                      direction === "SHORT"
                        ? "bg-red-600 text-white"
                        : "bg-background/50 text-muted-foreground border border-border/40 hover:border-red-500/30"
                    }`}
                  >
                    <ArrowDownRight className="w-4 h-4" /> Short
                  </button>
                </div>
              </div>

              {/* Leverage */}
              <div className="space-y-2 mb-4">
                <Label className="text-xs text-foreground/70">Leverage</Label>
                <div className="grid grid-cols-4 gap-1.5">
                  {LEVERAGES.map((lev) => (
                    <button
                      key={lev}
                      type="button"
                      data-ocid="futures.toggle"
                      onClick={() => setLeverage(lev)}
                      className={`rounded-lg p-2 text-xs font-bold transition-all ${
                        leverage === lev
                          ? "bg-gold text-navy"
                          : "bg-background/50 text-muted-foreground border border-border/40 hover:border-gold/30"
                      }`}
                    >
                      {lev}x
                    </button>
                  ))}
                </div>
              </div>

              {/* Margin */}
              <div className="space-y-2 mb-4">
                <Label className="text-xs text-foreground/70">
                  Margin (USDT)
                </Label>
                <Input
                  type="number"
                  min="1"
                  placeholder="Enter margin amount"
                  data-ocid="futures.input"
                  value={margin}
                  onChange={(e) => setMargin(e.target.value)}
                  className="bg-background/50 border-border/60 focus:border-gold/50"
                />
              </div>

              {marginNum > 0 && (
                <div className="bg-background/30 rounded-lg p-3 mb-4 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Entry Price</span>
                    <span className="font-mono text-foreground">
                      ${currentPrice.toFixed(1)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Position Size</span>
                    <span className="font-mono text-foreground">
                      ${positionSize.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Liquidation Price
                    </span>
                    <span className="font-mono text-red-400">
                      ${liquidationPrice.toFixed(1)}
                    </span>
                  </div>
                </div>
              )}

              <Button
                data-ocid="futures.primary_button"
                onClick={openPosition}
                className={`w-full font-bold ${
                  direction === "LONG"
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : "bg-red-600 hover:bg-red-700 text-white"
                }`}
              >
                Open {direction} {leverage}x
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-3"
            >
              <div className="glass-card rounded-xl p-4">
                <div className="text-xs font-semibold text-gold mb-2">
                  📈 Trading Tips
                </div>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Never risk more than 2% per trade</li>
                  <li>• Always use stop-loss orders</li>
                  <li>• Higher leverage = higher risk & reward</li>
                  <li>• Trend is your friend</li>
                </ul>
              </div>
              <div className="glass-card rounded-xl p-4 bg-green-500/5 border-green-500/20">
                <div className="flex items-center gap-2 mb-1">
                  <Shield className="w-4 h-4 text-green-400" />
                  <span className="text-xs font-semibold text-green-400">
                    Trusted Platform
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Real profits credited and real losses deducted from your
                  wallet balance.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
