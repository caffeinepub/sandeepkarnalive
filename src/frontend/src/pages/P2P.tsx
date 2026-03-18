import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CheckCircle,
  Clock,
  Filter,
  Lock,
  MessageCircle,
  Send,
  Shield,
  Star,
  Upload,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";

const P2P_ADS = [
  {
    id: 1,
    seller: "CryptoKing_SK",
    avatar: "CK",
    rating: 4.9,
    level: "Expert Trader",
    levelColor: "#FFD700",
    trades: 1247,
    completion: 98,
    coin: "USDT",
    price: 1.0,
    available: 5000,
    min: 50,
    max: 5000,
    methods: ["Bank Transfer", "UPI"],
    currency: "USD",
  },
  {
    id: 2,
    seller: "BlockMaster99",
    avatar: "BM",
    rating: 4.7,
    level: "Pro Seller",
    levelColor: "#00F0FF",
    trades: 892,
    completion: 96,
    coin: "USDT",
    price: 1.0,
    available: 3200,
    min: 20,
    max: 3200,
    methods: ["UPI", "International"],
    currency: "USD",
  },
  {
    id: 3,
    seller: "TradePro_India",
    avatar: "TP",
    rating: 4.8,
    level: "Verified Trader",
    levelColor: "#00FF88",
    trades: 2103,
    completion: 99,
    coin: "USDT",
    price: 1.0,
    available: 10000,
    min: 100,
    max: 10000,
    methods: ["Bank Transfer"],
    currency: "USD",
  },
  {
    id: 4,
    seller: "FastCrypto_TX",
    avatar: "FC",
    rating: 4.5,
    level: "Active Seller",
    levelColor: "#8888AA",
    trades: 341,
    completion: 93,
    coin: "USDT",
    price: 0.99,
    available: 800,
    min: 10,
    max: 800,
    methods: ["UPI", "Bank Transfer"],
    currency: "USD",
  },
];

type ChatMessage = {
  id: number;
  from: "buyer" | "seller";
  text: string;
  time: string;
};

const INITIAL_CHAT: ChatMessage[] = [
  {
    id: 1,
    from: "seller",
    text: "Hello! I'm ready to trade. Please complete payment within 15 minutes.",
    time: "14:22",
  },
  {
    id: 2,
    from: "seller",
    text: "Send payment to bank account ending in 4523.",
    time: "14:22",
  },
];

export function P2P() {
  const { isLoggedIn } = useAuth();
  const [tab, setTab] = useState<"BUY" | "SELL">("BUY");
  const [currency, setCurrency] = useState("USD");
  const [payMethod, setPayMethod] = useState("all");
  const [selectedAd, setSelectedAd] = useState<(typeof P2P_ADS)[0] | null>(
    null,
  );
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(INITIAL_CHAT);
  const [chatInput, setChatInput] = useState("");
  const [timeLeft, setTimeLeft] = useState(900); // 15 min
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!selectedAd) return;
    const interval = setInterval(() => {
      setTimeLeft((t) => Math.max(0, t - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [selectedAd]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []); // scroll triggered by mutation not dep tracking

  function sendMessage() {
    if (!chatInput.trim()) return;
    const msg: ChatMessage = {
      id: Date.now(),
      from: "buyer",
      text: chatInput,
      time: new Date().toLocaleTimeString("en", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setChatMessages((prev) => [...prev, msg]);
    setChatInput("");
    // Auto reply
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          from: "seller",
          text: "Please send payment proof after completing the transaction.",
          time: new Date().toLocaleTimeString("en", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    }, 1500);
  }

  const timerPct = (timeLeft / 900) * 100;
  const timerColor =
    timeLeft < 180 ? "#FF3366" : timeLeft < 300 ? "#FFD700" : "#00FF88";

  const mmSS = `${Math.floor(timeLeft / 60)
    .toString()
    .padStart(2, "0")}:${(timeLeft % 60).toString().padStart(2, "0")}`;

  return (
    <div className="min-h-screen bg-mesh pt-20 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <h1 className="font-display text-3xl font-bold text-white">
              P2P <span className="gold-gradient">Exchange</span>
            </h1>
            <Badge
              className="text-xs"
              style={{
                background: "rgba(0,240,255,0.1)",
                border: "1px solid rgba(0,240,255,0.3)",
                color: "#00F0FF",
              }}
            >
              <Shield className="w-3 h-3 mr-1" />
              Escrow Protected
            </Badge>
          </div>
          <p className="text-white/40 text-sm">
            Trade crypto securely with our escrow system. Funds locked until
            payment confirmed.
          </p>
        </motion.div>

        {/* Escrow info bar */}
        <div
          className="rounded-xl px-4 py-3 flex items-center gap-3 mb-6"
          style={{
            background: "rgba(255,215,0,0.06)",
            border: "1px solid rgba(255,215,0,0.2)",
          }}
        >
          <Lock className="w-4 h-4 shrink-0" style={{ color: "#FFD700" }} />
          <p className="text-xs text-white/60">
            <span className="font-semibold" style={{ color: "#FFD700" }}>
              Escrow System:
            </span>{" "}
            Seller&apos;s crypto is locked by SKCE until buyer confirms payment.
            100% secure, no scam possible.
          </p>
        </div>

        {/* BUY/SELL tabs */}
        <div className="flex gap-3 mb-5">
          {(["BUY", "SELL"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              data-ocid={`p2p.${t.toLowerCase()}.tab`}
              className="px-8 py-2.5 rounded-full font-bold text-sm transition-all"
              style={{
                background:
                  tab === t
                    ? t === "BUY"
                      ? "linear-gradient(135deg, #FFD700, #FFA500)"
                      : "linear-gradient(135deg, #FF3366, #cc0033)"
                    : "rgba(255,255,255,0.05)",
                color: tab === t ? "#0a0a0a" : "rgba(255,255,255,0.5)",
                boxShadow:
                  tab === t
                    ? t === "BUY"
                      ? "0 0 20px rgba(255,215,0,0.3)"
                      : "0 0 20px rgba(255,51,102,0.3)"
                    : "none",
                border: tab === t ? "none" : "1px solid rgba(255,255,255,0.1)",
              }}
            >
              {t} USDT
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="flex items-center gap-2 text-white/40">
            <Filter className="w-3.5 h-3.5" />
            <span className="text-xs font-medium uppercase tracking-wider">
              Filter:
            </span>
          </div>
          <Select value={currency} onValueChange={setCurrency}>
            <SelectTrigger
              data-ocid="p2p.currency.select"
              className="h-8 w-28 text-xs bg-white/5 border-white/10 text-white"
            >
              <SelectValue placeholder="Currency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USD">USD</SelectItem>
              <SelectItem value="INR">INR</SelectItem>
              <SelectItem value="NPR">NPR</SelectItem>
              <SelectItem value="EUR">EUR</SelectItem>
            </SelectContent>
          </Select>
          <Select value={payMethod} onValueChange={setPayMethod}>
            <SelectTrigger
              data-ocid="p2p.payment.select"
              className="h-8 w-36 text-xs bg-white/5 border-white/10 text-white"
            >
              <SelectValue placeholder="Payment Method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Methods</SelectItem>
              <SelectItem value="bank">Bank Transfer</SelectItem>
              <SelectItem value="upi">UPI</SelectItem>
              <SelectItem value="intl">International</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Ads list */}
        <div className="space-y-3">
          {P2P_ADS.map((ad, i) => (
            <motion.div
              key={ad.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              data-ocid={`p2p.item.${i + 1}`}
              className="rounded-2xl p-4 sm:p-5"
              style={{
                background: "rgba(255,255,255,0.03)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255,215,0,0.1)",
              }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                {/* Seller info */}
                <div className="flex items-start gap-3 flex-1">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0"
                    style={{
                      background: "linear-gradient(135deg, #FFD700, #FFA500)",
                      color: "#0a0a0a",
                    }}
                  >
                    {ad.avatar}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-white text-sm">
                        {ad.seller}
                      </span>
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                        style={{
                          background: `${ad.levelColor}20`,
                          color: ad.levelColor,
                          border: `1px solid ${ad.levelColor}40`,
                        }}
                      >
                        {ad.level}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, si) => (
                          <Star
                            key={String(si)}
                            className="w-2.5 h-2.5"
                            style={{
                              color:
                                si < Math.round(ad.rating)
                                  ? "#FFD700"
                                  : "rgba(255,255,255,0.15)",
                            }}
                            fill={
                              si < Math.round(ad.rating) ? "#FFD700" : "none"
                            }
                          />
                        ))}
                        <span className="text-[10px] text-white/40 ml-1">
                          {ad.rating}
                        </span>
                      </div>
                      <span className="text-[10px] text-white/30">
                        {ad.trades} trades
                      </span>
                    </div>
                    {/* Completion bar */}
                    <div className="flex items-center gap-2 mt-1">
                      <div className="h-1 w-16 rounded-full bg-white/10 overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${ad.completion}%`,
                            background: "#00FF88",
                          }}
                        />
                      </div>
                      <span
                        className="text-[10px]"
                        style={{ color: "#00FF88" }}
                      >
                        {ad.completion}% completion
                      </span>
                    </div>
                  </div>
                </div>

                {/* Price + amount */}
                <div className="flex items-center gap-6 sm:gap-8">
                  <div className="text-center">
                    <div className="text-[10px] text-white/30 uppercase mb-0.5">
                      Price
                    </div>
                    <div
                      className="font-mono font-bold"
                      style={{ color: "#FFD700" }}
                    >
                      ${ad.price.toFixed(2)}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-[10px] text-white/30 uppercase mb-0.5">
                      Available
                    </div>
                    <div className="font-mono font-bold text-white text-sm">
                      {ad.available.toLocaleString()} USDT
                    </div>
                    <div className="text-[10px] text-white/30">
                      ${ad.min}–${ad.max}
                    </div>
                  </div>
                  <div>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {ad.methods.map((m) => (
                        <span
                          key={m}
                          className="text-[10px] px-2 py-0.5 rounded-full"
                          style={{
                            background: "rgba(0,240,255,0.08)",
                            border: "1px solid rgba(0,240,255,0.2)",
                            color: "#00F0FF",
                          }}
                        >
                          {m}
                        </span>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (!isLoggedIn) {
                          toast.error("Please login first.");
                          return;
                        }
                        setSelectedAd(ad);
                        setTimeLeft(900);
                        setChatMessages(INITIAL_CHAT);
                      }}
                      data-ocid={`p2p.item.${i + 1}`}
                      className="w-full font-bold text-xs py-2 px-4 rounded-lg transition-all"
                      style={{
                        background:
                          tab === "BUY"
                            ? "linear-gradient(135deg, #FFD700, #FFA500)"
                            : "linear-gradient(135deg, #FF3366, #cc0033)",
                        color: "#0a0a0a",
                        boxShadow:
                          tab === "BUY"
                            ? "0 0 12px rgba(255,215,0,0.3)"
                            : "0 0 12px rgba(255,51,102,0.3)",
                      }}
                    >
                      {tab} Now
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* P2P Chat Dialog */}
      <Dialog open={!!selectedAd} onOpenChange={() => setSelectedAd(null)}>
        <DialogContent
          className="max-w-md w-full p-0 overflow-hidden"
          style={{
            background: "#0f0f0f",
            border: "1px solid rgba(255,215,0,0.2)",
          }}
        >
          {selectedAd && (
            <>
              {/* Timer bar */}
              <div className="relative h-1">
                <div
                  className="h-full transition-all duration-1000"
                  style={{ width: `${timerPct}%`, background: timerColor }}
                />
              </div>

              <DialogHeader className="px-4 pt-3 pb-2 border-b border-white/5">
                <div className="flex items-center justify-between">
                  <DialogTitle className="text-white text-sm font-display">
                    Trade with {selectedAd.seller}
                  </DialogTitle>
                  <div
                    className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-mono font-bold"
                    style={{
                      background: `${timerColor}15`,
                      color: timerColor,
                      border: `1px solid ${timerColor}30`,
                    }}
                  >
                    <Clock className="w-3 h-3" />
                    {mmSS}
                  </div>
                </div>
              </DialogHeader>

              {/* Chat */}
              <div className="h-64 overflow-y-auto px-4 py-3 space-y-3">
                {chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.from === "buyer" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className="max-w-[80%] rounded-2xl px-3 py-2 text-xs"
                      style={{
                        background:
                          msg.from === "buyer"
                            ? "rgba(255,215,0,0.15)"
                            : "rgba(255,255,255,0.08)",
                        border:
                          msg.from === "buyer"
                            ? "1px solid rgba(255,215,0,0.2)"
                            : "1px solid rgba(255,255,255,0.1)",
                        color: "rgba(255,255,255,0.9)",
                      }}
                    >
                      <p>{msg.text}</p>
                      <p className="text-white/25 text-[10px] mt-1 text-right">
                        {msg.time}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              {/* Actions */}
              <div className="border-t border-white/5 p-3 space-y-2">
                <div className="flex gap-2">
                  <Input
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    placeholder="Type a message..."
                    className="flex-1 h-9 text-xs bg-white/5 border-white/10 text-white placeholder:text-white/25"
                  />
                  <button
                    type="button"
                    onClick={sendMessage}
                    data-ocid="p2p.chat.button"
                    className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                    style={{
                      background: "linear-gradient(135deg, #FFD700, #FFA500)",
                    }}
                  >
                    <Send className="w-4 h-4 text-black" />
                  </button>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    data-ocid="p2p.upload_button"
                    className="flex-1 flex items-center justify-center gap-1.5 h-9 rounded-lg text-xs font-medium transition-all"
                    style={{
                      background: "rgba(0,240,255,0.1)",
                      border: "1px solid rgba(0,240,255,0.2)",
                      color: "#00F0FF",
                    }}
                  >
                    <Upload className="w-3.5 h-3.5" /> Upload Payment Proof
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      toast.success(
                        "Payment confirmed! Crypto released from escrow.",
                      );
                      setSelectedAd(null);
                    }}
                    data-ocid="p2p.confirm_button"
                    className="flex-1 flex items-center justify-center gap-1.5 h-9 rounded-lg text-xs font-bold transition-all"
                    style={{
                      background: "linear-gradient(135deg, #00FF88, #00cc66)",
                      color: "#0a0a0a",
                      boxShadow: "0 0 15px rgba(0,255,136,0.3)",
                    }}
                  >
                    <CheckCircle className="w-3.5 h-3.5" /> I Paid
                  </button>
                </div>

                <div className="flex items-center gap-1.5 text-[10px] text-white/30">
                  <MessageCircle className="w-3 h-3" />
                  <span>
                    Escrow protection active — crypto locked until payment
                    confirmed
                  </span>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
