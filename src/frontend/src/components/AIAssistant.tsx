import {
  AlertTriangle,
  Bot,
  Minus,
  TrendingDown,
  TrendingUp,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

const SUGGESTIONS = [
  {
    action: "BUY" as const,
    coin: "BTC",
    reason: "Strong support at $92K. RSI oversold. Bullish divergence forming.",
    confidence: 78,
    color: "#00FF88",
  },
  {
    action: "HOLD" as const,
    coin: "ETH",
    reason: "Consolidating near resistance. Wait for breakout confirmation.",
    confidence: 62,
    color: "#FFD700",
  },
  {
    action: "SELL" as const,
    coin: "SOL",
    reason: "Overbought on 4H chart. Take profits near $180 resistance.",
    confidence: 71,
    color: "#FF3366",
  },
];

export function AIAssistant() {
  const [open, setOpen] = useState(false);
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.25 }}
            data-ocid="ai.panel"
            className="absolute bottom-16 right-0 w-80 rounded-2xl overflow-hidden"
            style={{
              background: "rgba(12,12,12,0.97)",
              backdropFilter: "blur(24px)",
              border: "1px solid rgba(255,215,0,0.25)",
              boxShadow:
                "0 0 40px rgba(255,215,0,0.2), 0 20px 60px rgba(0,0,0,0.7)",
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-4 py-3"
              style={{
                background:
                  "linear-gradient(135deg, rgba(255,215,0,0.12), rgba(0,240,255,0.06))",
              }}
            >
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5" style={{ color: "#FFD700" }} />
                <span className="font-display font-bold text-sm text-white">
                  AI Trading Assistant
                </span>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                data-ocid="ai.close_button"
                className="text-white/40 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Suggestions */}
            <div className="p-3 space-y-2">
              <p className="text-xs text-white/40 px-1 mb-3">
                AI Signal Analysis — Updated 5 min ago
              </p>
              {SUGGESTIONS.map((s, i) => {
                const Icon =
                  s.action === "BUY"
                    ? TrendingUp
                    : s.action === "SELL"
                      ? TrendingDown
                      : Minus;
                return (
                  <div
                    key={s.coin}
                    data-ocid={`ai.item.${i + 1}`}
                    className="rounded-xl p-3"
                    style={{
                      background: `${s.color}0D`,
                      border: `1px solid ${s.color}30`,
                    }}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <div
                          className="px-2 py-0.5 rounded-md text-xs font-bold"
                          style={{ background: s.color, color: "#0a0a0a" }}
                        >
                          {s.action}
                        </div>
                        <span className="font-bold text-white text-sm">
                          {s.coin}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Icon
                          className="w-3.5 h-3.5"
                          style={{ color: s.color }}
                        />
                        <span
                          className="text-xs font-bold"
                          style={{ color: s.color }}
                        >
                          {s.confidence}%
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-white/50 leading-relaxed">
                      {s.reason}
                    </p>
                    {/* Confidence bar */}
                    <div className="mt-2 h-1 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${s.confidence}%`,
                          background: s.color,
                        }}
                      />
                    </div>
                  </div>
                );
              })}

              {/* Emotion alert */}
              <div
                className="rounded-xl p-3 flex items-start gap-2"
                style={{
                  background: "rgba(255,215,0,0.06)",
                  border: "1px solid rgba(255,215,0,0.2)",
                }}
              >
                <AlertTriangle
                  className="w-4 h-4 shrink-0 mt-0.5"
                  style={{ color: "#FFD700" }}
                />
                <div>
                  <p className="text-xs font-semibold text-white">
                    Trading Discipline Alert
                  </p>
                  <p className="text-xs text-white/50 mt-0.5">
                    Trade mindfully. Discipline → Profit. Take breaks between
                    trades.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating bubble */}
      <motion.button
        type="button"
        onClick={() => setOpen(!open)}
        data-ocid="ai.open_modal_button"
        animate={{ scale: open ? 0.9 : 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="w-14 h-14 rounded-full flex items-center justify-center relative"
        style={{
          background: "linear-gradient(135deg, #FFD700, #FFA500)",
          boxShadow:
            "0 0 25px rgba(255,215,0,0.5), 0 0 50px rgba(255,215,0,0.2)",
        }}
      >
        <Bot className="w-7 h-7 text-black" />
        {!open && (
          <span
            className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center text-white"
            style={{
              background: "#00F0FF",
              boxShadow: "0 0 8px rgba(0,240,255,0.6)",
            }}
          >
            AI
          </span>
        )}
      </motion.button>
    </div>
  );
}
