import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import {
  Activity,
  ArrowRight,
  Award,
  BarChart2,
  ChevronRight,
  Coins,
  Crown,
  ExternalLink,
  Flame,
  Gift,
  Heart,
  Play,
  RefreshCw,
  Rocket,
  Star,
  TrendingDown,
  TrendingUp,
  Users,
  Video,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";

function loadLS<T>(key: string, def: T): T {
  try {
    return JSON.parse(localStorage.getItem(key) || "null") ?? def;
  } catch {
    return def;
  }
}

type AdminTask = {
  id: string;
  title: string;
  description: string;
  category: string;
  adUrl: string;
  imageUrl?: string;
  videoUrl?: string;
  audioUrl?: string;
  steps: string[];
  reward: number;
  date: string;
};

const EARN_CATEGORIES = [
  {
    key: "Daily",
    label: "Daily Tasks",
    icon: <Flame className="w-6 h-6 text-gold" />,
    desc: "Login bonus, check-in streak, daily rewards",
    color: "from-gold/20 to-orange-brand/10",
  },
  {
    key: "Social",
    label: "Social Tasks",
    icon: <Users className="w-6 h-6 text-blue-400" />,
    desc: "Follow, like, comment on social channels",
    color: "from-blue-500/10 to-blue-400/5",
  },
  {
    key: "Video",
    label: "Video Tasks",
    icon: <Video className="w-6 h-6 text-purple-400" />,
    desc: "Watch vlogs, ads, and video content",
    color: "from-purple-500/10 to-purple-400/5",
  },
  {
    key: "Trading",
    label: "Trading Tasks",
    icon: <TrendingUp className="w-6 h-6 text-green-400" />,
    desc: "Trade signals, buy/sell crypto tasks",
    color: "from-green-500/10 to-green-400/5",
  },
  {
    key: "Invest",
    label: "Investment Tasks",
    icon: <BarChart2 className="w-6 h-6 text-cyan-400" />,
    desc: "Investment plans and growth rewards",
    color: "from-cyan-500/10 to-cyan-400/5",
  },
  {
    key: "Referral",
    label: "Referral Tasks",
    icon: <Heart className="w-6 h-6 text-pink-400" />,
    desc: "Invite friends and earn $1 per referral",
    color: "from-pink-500/10 to-pink-400/5",
  },
  {
    key: "Bonus",
    label: "Bonus Tasks",
    icon: <Gift className="w-6 h-6 text-yellow-400" />,
    desc: "Special bonus and promo rewards",
    color: "from-yellow-500/10 to-yellow-400/5",
  },
  {
    key: "General",
    label: "General Tasks",
    icon: <Zap className="w-6 h-6 text-gold" />,
    desc: "Other tasks added by admin",
    color: "from-gold/10 to-orange-brand/5",
  },
];

type CryptoPrice = {
  usd: number;
  usd_24h_change: number;
};

const COIN_IDS = [
  { binanceSymbol: "BTCUSDT", symbol: "BTC", color: "text-orange-400" },
  { binanceSymbol: "ETHUSDT", symbol: "ETH", color: "text-blue-400" },
  { binanceSymbol: "SOLUSDT", symbol: "SOL", color: "text-purple-400" },
  { binanceSymbol: "BNBUSDT", symbol: "BNB", color: "text-yellow-400" },
];

function CryptoTicker() {
  const [prices, setPrices] = useState<Record<string, CryptoPrice>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPrices() {
      try {
        const symbols = JSON.stringify(COIN_IDS.map((c) => c.binanceSymbol));
        const res = await fetch(
          `https://api.binance.com/api/v3/ticker/24hr?symbols=${encodeURIComponent(symbols)}`,
        );
        const data = await res.json();
        const mapped: Record<string, CryptoPrice> = {};
        if (Array.isArray(data)) {
          for (const ticker of data) {
            mapped[ticker.symbol] = {
              usd: Number.parseFloat(ticker.lastPrice),
              usd_24h_change: Number.parseFloat(ticker.priceChangePercent),
            };
          }
        }
        setPrices(mapped);
        setLoading(false);
      } catch {
        setLoading(false);
      }
    }
    fetchPrices();
    const interval = setInterval(fetchPrices, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="flex items-center gap-4 overflow-x-auto scrollbar-hide py-1"
      data-ocid="home.crypto.section"
    >
      {loading
        ? Array.from({ length: 4 }).map((_, i) => (
            <div
              key={String(i)}
              className="flex items-center gap-2 bg-background/30 rounded-xl px-3 py-2 border border-border/30 shrink-0 animate-pulse"
            >
              <div className="w-8 h-4 bg-border/40 rounded" />
              <div className="w-16 h-4 bg-border/40 rounded" />
            </div>
          ))
        : COIN_IDS.map((coin) => {
            const price = prices[coin.binanceSymbol];
            const change = price?.usd_24h_change ?? 0;
            const isUp = change >= 0;
            return (
              <div
                key={coin.binanceSymbol}
                className="flex items-center gap-2 bg-background/30 rounded-xl px-3 py-2 border border-border/30 shrink-0"
              >
                <span className={`font-bold text-xs ${coin.color}`}>
                  {coin.symbol}
                </span>
                {price ? (
                  <>
                    <span className="text-xs font-mono text-foreground">
                      $
                      {price.usd.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                    <span
                      className={`text-xs font-medium flex items-center gap-0.5 ${isUp ? "text-green-400" : "text-red-400"}`}
                    >
                      {isUp ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : (
                        <TrendingDown className="w-3 h-3" />
                      )}
                      {Math.abs(change).toFixed(2)}%
                    </span>
                  </>
                ) : (
                  <span className="text-xs text-muted-foreground">—</span>
                )}
              </div>
            );
          })}
      <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0 ml-auto">
        <Activity className="w-3 h-3" /> Live
      </div>
    </div>
  );
}

function TradingHub() {
  return (
    <section className="pt-28 pb-4 px-4" data-ocid="home.trading.section">
      <div className="max-w-5xl mx-auto space-y-4">
        {/* Live Crypto Prices */}
        <div className="glass-card rounded-2xl p-4 border border-border/40">
          <div className="flex items-center gap-2 mb-3">
            <Activity className="w-4 h-4 text-green-400" />
            <span className="text-sm font-bold text-foreground">
              Live Crypto Prices
            </span>
            <span className="text-xs text-green-400 font-medium ml-auto animate-pulse">
              ● LIVE
            </span>
          </div>
          <CryptoTicker />
        </div>
      </div>
    </section>
  );
}

function CategorySection({
  cat,
  tasks,
}: { cat: (typeof EARN_CATEGORIES)[0]; tasks: AdminTask[] }) {
  const catTasks = tasks.filter((t) => (t.category || "General") === cat.key);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="glass-card rounded-2xl overflow-hidden"
      data-ocid={`home.earn.${cat.key.toLowerCase()}.section`}
    >
      <div
        className={`bg-gradient-to-r ${cat.color} p-5 border-b border-border/20`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-background/30 flex items-center justify-center">
              {cat.icon}
            </div>
            <div>
              <h3 className="font-display font-bold text-foreground text-lg">
                {cat.label}
              </h3>
              <p className="text-xs text-muted-foreground">{cat.desc}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {catTasks.length > 0 && (
              <Badge className="bg-gold/10 text-gold border-gold/30 text-xs">
                {catTasks.length} task{catTasks.length !== 1 ? "s" : ""}
              </Badge>
            )}
            <Link to="/earn">
              <Button
                size="sm"
                variant="outline"
                data-ocid="home.earn.link"
                className="border-gold/30 text-gold hover:bg-gold/10 text-xs h-7"
              >
                View All <ChevronRight className="w-3 h-3 ml-0.5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="p-4">
        {catTasks.length === 0 ? (
          <div
            data-ocid={`home.earn.${cat.key.toLowerCase()}.empty_state`}
            className="text-center py-6 text-muted-foreground"
          >
            <div className="w-10 h-10 rounded-full bg-background/30 flex items-center justify-center mx-auto mb-2">
              {cat.icon}
            </div>
            <p className="text-xs font-medium">No tasks yet in this category</p>
            <p className="text-xs text-muted-foreground/60 mt-0.5">
              Admin will add tasks soon
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {catTasks.slice(0, 4).map((task, i) => (
              <div
                key={task.id}
                data-ocid={`home.earn.${cat.key.toLowerCase()}.item.${i + 1}`}
                className="border border-border/30 rounded-xl p-3 bg-background/20 hover:border-gold/30 transition-colors"
              >
                {task.imageUrl && (
                  <img
                    src={task.imageUrl}
                    alt={task.title}
                    className="w-full h-24 object-cover rounded-lg mb-2"
                  />
                )}
                {task.videoUrl && !task.imageUrl && (
                  <div className="w-full h-24 bg-background/50 flex items-center justify-center rounded-lg mb-2">
                    <Play className="w-8 h-8 text-gold/40" />
                  </div>
                )}
                <div className="flex items-start justify-between gap-2 mb-1">
                  <span className="font-semibold text-foreground text-xs leading-tight">
                    {task.title}
                  </span>
                  <span className="text-xs text-green-400 font-bold shrink-0">
                    ${task.reward.toFixed(2)}
                  </span>
                </div>
                {task.description && (
                  <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                    {task.description}
                  </p>
                )}
                {task.steps.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {task.steps.map((s) => (
                      <span
                        key={s}
                        className="text-xs border border-border/40 rounded px-1.5 py-0.5 text-muted-foreground"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                )}
                {task.adUrl && (
                  <a
                    href={task.adUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-gold hover:underline flex items-center gap-1 mb-2"
                  >
                    <ExternalLink className="w-3 h-3" /> Open Link
                  </a>
                )}
                <Link to="/earn">
                  <Button
                    size="sm"
                    data-ocid="home.earn.task.primary_button"
                    className="bg-gold/10 text-gold border border-gold/20 hover:bg-gold/20 text-xs w-full h-7"
                  >
                    Do Task <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export function Home() {
  const { user, isLoggedIn } = useAuth();

  const [adminTasks, setAdminTasks] = useState<AdminTask[]>([]);
  const [ads, setAds] = useState<any[]>([]);
  const [vlogs, setVlogs] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);

  useEffect(() => {
    setAdminTasks(loadLS<AdminTask[]>("sce_admin_tasks", []));
    setAds(loadLS<any[]>("sce_admin_ads", []));
    setVlogs(loadLS<any[]>("sce_admin_vlogs", []));
    setAnnouncements(loadLS<any[]>("sce_admin_announcements", []));
  }, []);

  const announcementText =
    announcements.length > 0
      ? announcements.map((a: any) => a.title).join("  •  ")
      : "Earn up to 500 USDT daily  •  Daily Spin Rewards  •  500+ Earning Methods  •  Referral bonus: $1 per invite";

  return (
    <div className="min-h-screen bg-mesh">
      {/* Announcement ticker */}
      <div className="fixed top-16 left-0 right-0 z-40 bg-gold/10 border-b border-gold/20 py-2 overflow-hidden">
        <div className="animate-marquee text-xs text-gold font-medium">
          {[announcementText, announcementText].map((t, i) => (
            <span key={t + String(i)} className="px-8 whitespace-nowrap">
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Trading Hub - TOP */}
      <TradingHub />

      {/* Ads / Promotions */}
      {ads.length > 0 && (
        <section className="pt-4 pb-6 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="font-display text-xl font-bold text-foreground">
                Promotions &amp; <span className="gold-gradient">Offers</span>
              </h2>
              <Badge className="bg-gold/20 text-gold border-gold/40 text-xs">
                SPONSORED
              </Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {ads.map((ad: any, i: number) => (
                <motion.a
                  key={ad.id}
                  href={ad.linkUrl || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="glass-card glass-card-hover rounded-2xl overflow-hidden block ring-1 ring-gold/30"
                >
                  {ad.imageUrl && (
                    <img
                      src={ad.imageUrl}
                      alt={ad.title}
                      className="w-full h-36 object-cover"
                    />
                  )}
                  {ad.videoUrl && !ad.imageUrl && (
                    <div className="w-full h-36 bg-background/50 flex items-center justify-center">
                      <Play className="w-10 h-10 text-gold/40" />
                    </div>
                  )}
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className="bg-gold/10 text-gold border-gold/20 text-xs">
                        AD
                      </Badge>
                      <h3 className="font-bold text-foreground text-sm">
                        {ad.title}
                      </h3>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {ad.description}
                    </p>
                    {ad.linkUrl && (
                      <div className="flex items-center gap-1 mt-2 text-xs text-gold">
                        <ExternalLink className="w-3 h-3" /> Visit
                      </div>
                    )}
                  </div>
                </motion.a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Hero */}
      <section className="pt-6 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-orange-brand/5 rounded-full blur-3xl" />
        </div>
        <div className="max-w-5xl mx-auto text-center relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.05 }}
            className="flex flex-col items-center mb-6"
          >
            <div className="relative">
              <img
                src="/assets/uploads/IMG_20260303_214406-1.jpg"
                alt="Sandeep Karna"
                className="w-24 h-24 rounded-full object-cover border-4 border-gold shadow-[0_0_24px_rgba(255,182,0,0.4)]"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
              <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-gradient-to-br from-gold to-orange-brand flex items-center justify-center">
                <Crown className="w-3.5 h-3.5 text-navy" />
              </div>
            </div>
            <div className="mt-2 text-sm font-semibold text-gold">
              Sandeep Karna
            </div>
            <div className="text-xs text-muted-foreground">
              Crypto Empire Founder
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Badge className="bg-gold/10 text-gold border-gold/30 mb-6 text-sm px-4 py-1.5">
              🏆 #1 Crypto Trading Platform
            </Badge>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-5xl md:text-7xl font-bold leading-tight mb-6"
          >
            Earn Up to <span className="gold-gradient">500 USDT</span>
            <br />
            Daily
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Join Sandeep Karna&apos;s expert-guided crypto trading empire.
            Invest smart, trade daily, earn consistently.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-4 justify-center"
          >
            {isLoggedIn ? (
              <Link to="/earn">
                <Button
                  data-ocid="home.primary_button"
                  size="lg"
                  className="bg-gradient-to-r from-gold to-orange-brand text-navy font-bold text-base px-8"
                >
                  Start Earning <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            ) : (
              <Link to="/signup">
                <Button
                  data-ocid="home.primary_button"
                  size="lg"
                  className="bg-gradient-to-r from-gold to-orange-brand text-navy font-bold text-base px-8"
                >
                  Join Free <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            )}
            <Link to="/signals">
              <Button
                data-ocid="home.secondary_button"
                size="lg"
                variant="outline"
                className="border-gold/40 text-gold hover:bg-gold/10 text-base px-8"
              >
                View Signals
              </Button>
            </Link>
          </motion.div>

          {isLoggedIn && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-6 inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-4 py-2"
            >
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-green-400 text-sm font-medium">
                Balance: ${(user?.balance || 0).toFixed(2)} USDT
              </span>
            </motion.div>
          )}
        </div>
      </section>

      {/* Ads & Promotions Section (if no ads at top) */}
      {ads.length === 0 && (
        <section className="py-8 px-4">
          <div className="max-w-5xl mx-auto">
            <div
              className="glass-card rounded-2xl p-6 text-center border border-gold/10"
              data-ocid="home.ads.empty_state"
            >
              <Badge className="bg-gold/10 text-gold border-gold/20 mb-2">
                Advertisement
              </Badge>
              <p className="text-sm text-muted-foreground">
                Admin will add ads & promotions here. Watch them to earn USDT!
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Latest Vlogs */}
      <section className="py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-2xl font-bold text-foreground">
              Latest <span className="gold-gradient">Vlogs</span>
            </h2>
            <Link to="/vlog">
              <Button
                data-ocid="home.vlog.link"
                variant="ghost"
                className="text-gold hover:bg-gold/10"
              >
                All Vlogs <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
          {vlogs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {vlogs.slice(0, 3).map((v: any, i: number) => (
                <motion.div
                  key={v.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-card glass-card-hover rounded-2xl overflow-hidden cursor-pointer"
                  data-ocid={`home.vlogs.item.${i + 1}`}
                  onClick={() =>
                    v.videoUrl && window.open(v.videoUrl, "_blank")
                  }
                >
                  <div className="aspect-video bg-background/50 relative flex items-center justify-center">
                    {v.thumbnailUrl ? (
                      <img
                        src={v.thumbnailUrl}
                        alt={v.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Play className="w-12 h-12 text-gold/50" />
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-foreground line-clamp-2">
                      {v.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {v.description}
                    </p>
                    {v.watchReward > 0 && (
                      <div className="mt-2">
                        <span className="inline-flex items-center gap-1 text-xs bg-gold/10 text-gold border border-gold/30 rounded-full px-2 py-0.5">
                          +{v.watchReward} USDT
                        </span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div
              className="text-center py-12 text-muted-foreground"
              data-ocid="vlog.empty_state"
            >
              <Play className="w-12 h-12 mx-auto mb-3 text-gold/20" />
              <p className="text-sm">
                Vlogs coming soon. Admin will add videos.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Daily Spin Section */}
      <section className="py-10 px-4 bg-background/20">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6"
            data-ocid="home.spin.section"
          >
            <div className="w-20 h-20 rounded-full border-4 border-gold/40 bg-gradient-to-br from-gold/20 to-orange-brand/20 flex items-center justify-center shadow-[0_0_24px_rgba(255,182,0,0.2)] shrink-0">
              <RefreshCw className="w-10 h-10 text-gold" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center gap-2 justify-center md:justify-start mb-1">
                <h3 className="font-display font-bold text-xl text-foreground">
                  Daily Spin
                </h3>
                <Badge className="bg-gold/10 text-gold border-gold/20 text-xs">
                  Once per day
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Spin the wheel every day to win $0.10 – $1.00 USDT instantly!
              </p>
              <div className="flex items-center gap-3 justify-center md:justify-start">
                <Coins className="w-4 h-4 text-green-400" />
                <span className="text-sm text-green-400 font-bold">
                  $0.10 – $1.00 USDT per spin
                </span>
              </div>
            </div>
            <Link to="/earn">
              <Button
                data-ocid="home.spin.primary_button"
                className="bg-gradient-to-r from-gold to-orange-brand text-navy font-bold px-6 shrink-0"
              >
                🎰 Spin Now <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* All Earning Category Sections */}
      <section className="py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="font-display text-3xl font-bold text-foreground mb-2">
              Ways to <span className="gold-gradient">Earn</span>
            </h2>
            <p className="text-muted-foreground">
              Choose from 500+ earning methods across all categories
            </p>
          </div>

          <div className="space-y-6">
            {EARN_CATEGORIES.map((cat) => (
              <CategorySection key={cat.key} cat={cat} tasks={adminTasks} />
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link to="/earn">
              <Button
                data-ocid="home.earn.primary_button"
                size="lg"
                className="bg-gradient-to-r from-gold to-orange-brand text-navy font-bold px-8"
              >
                Go to Earn Page <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Referral Quick Section */}
      <section className="py-10 px-4 bg-background/20">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6"
            data-ocid="home.referral.section"
          >
            <div className="w-20 h-20 rounded-full bg-pink-500/10 border-2 border-pink-400/30 flex items-center justify-center shrink-0">
              <Users className="w-10 h-10 text-pink-400" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="font-display font-bold text-xl text-foreground mb-1">
                Referral Program
              </h3>
              <p className="text-sm text-muted-foreground mb-2">
                Invite your friends and earn $1 USDT for every referral who
                joins!
              </p>
              {isLoggedIn && user?.referralCode && (
                <div className="inline-flex items-center gap-2 bg-background/40 border border-pink-400/20 rounded-lg px-3 py-1.5">
                  <span className="text-xs text-muted-foreground">
                    Your code:
                  </span>
                  <span className="font-mono font-bold text-pink-400">
                    {user.referralCode}
                  </span>
                </div>
              )}
            </div>
            <Link to="/referral">
              <Button
                data-ocid="home.referral.primary_button"
                variant="outline"
                className="border-pink-400/30 text-pink-400 hover:bg-pink-400/10 shrink-0"
              >
                Invite Friends <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Rates Quick Info */}
      <section className="py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                icon: <RefreshCw className="w-5 h-5 text-gold" />,
                label: "Daily Spin",
                val: "$0.10–$1.00",
              },
              {
                icon: <Zap className="w-5 h-5 text-green-400" />,
                label: "Task Rewards",
                val: "Set by admin",
              },
              {
                icon: <Users className="w-5 h-5 text-pink-400" />,
                label: "Per Referral",
                val: "$1.00 USDT",
              },
              {
                icon: <Award className="w-5 h-5 text-cyan-400" />,
                label: "Daily Limit",
                val: "$500 USDT",
              },
            ].map((r) => (
              <motion.div
                key={r.label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="glass-card rounded-2xl p-4 text-center"
              >
                <div className="flex justify-center mb-2">{r.icon}</div>
                <div className="text-xs text-muted-foreground mb-1">
                  {r.label}
                </div>
                <div className="font-bold text-foreground text-sm">{r.val}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-card rounded-3xl p-10 glow-gold"
          >
            <h2 className="font-display text-4xl font-bold gold-gradient mb-4">
              Ready to Start Earning?
            </h2>
            <p className="text-muted-foreground mb-8 text-lg">
              Join 2,400+ traders already making daily profits. Register free
              and start trading crypto today.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/signup">
                <Button
                  data-ocid="home.cta.primary_button"
                  size="lg"
                  className="bg-gradient-to-r from-gold to-orange-brand text-navy font-bold text-base px-8"
                >
                  Register Free <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/earn">
                <Button
                  data-ocid="home.cta.secondary_button"
                  size="lg"
                  variant="outline"
                  className="border-gold/40 text-gold hover:bg-gold/10 text-base px-8"
                >
                  Start Trading
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border/30 text-center">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()}.{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gold transition-colors"
          >
            Built with ❤️ using caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}
