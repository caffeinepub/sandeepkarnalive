import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Coins,
  Edit3,
  ExternalLink,
  Newspaper,
  Play,
  TrendingUp,
} from "lucide-react";
import { motion } from "motion/react";
import {
  useActiveAds,
  useAnnouncements,
  useVlogPosts,
  useWorldNews,
} from "../hooks/useQueries";

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const h = Math.floor(diff / 3600000);
  if (h < 1) return `${Math.floor(diff / 60000)}m ago`;
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export function Home() {
  const { data: news = [] } = useWorldNews();
  const { data: posts = [] } = useVlogPosts();
  const { data: ads = [] } = useActiveAds();
  const { data: announcements = [] } = useAnnouncements();

  const tickerItems = [
    ...announcements.map((a) => ({ type: "announcement" as const, data: a })),
    ...ads.map((a) => ({ type: "ad" as const, data: a })),
  ];
  const tickerDouble =
    tickerItems.length > 0 ? [...tickerItems, ...tickerItems] : null;

  const PLACEHOLDER_VLOGS = [
    {
      title: "My Crypto Trading Journey - Month 1",
      date: "Mar 10, 2026",
      thumb: null,
    },
    {
      title: "Top 5 Altcoins for 2025 Bull Run",
      date: "Mar 8, 2026",
      thumb: null,
    },
    { title: "Day Trading BTC Live Session", date: "Mar 5, 2026", thumb: null },
  ];

  return (
    <div className="min-h-screen bg-mesh">
      {/* HERO */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 70%)",
            }}
          />
          <div
            className="absolute top-1/3 right-1/4 w-64 h-64 rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(249,115,22,0.06) 0%, transparent 70%)",
            }}
          />
        </div>
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-gold/10 border border-gold/30 rounded-full px-4 py-2 text-xs font-semibold text-gold mb-6"
          >
            <TrendingUp className="w-3.5 h-3.5" />
            SANDEEP KARNA CRYPTO EMPIRE
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-5xl md:text-7xl font-bold mb-6 leading-tight"
          >
            <span className="gold-gradient">Trading</span> ·{" "}
            <span className="text-foreground">Crypto</span> ·{" "}
            <span className="text-orange-brand">Daily Vlogs</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-foreground/60 mb-10 max-w-2xl mx-auto"
          >
            Your daily source for crypto analysis, trading strategies, market
            news, vlog content, and real USDT earning opportunities.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap gap-4 justify-center"
          >
            <Link to="/vlog">
              <Button
                data-ocid="home.primary_button"
                className="bg-gradient-to-r from-gold to-orange-brand text-navy font-bold hover:opacity-90 px-6 py-2.5"
              >
                <Play className="w-4 h-4 mr-2" /> Watch Vlogs
              </Button>
            </Link>
            <Link to="/news">
              <Button
                data-ocid="home.secondary_button"
                variant="outline"
                className="border-gold/30 text-gold hover:bg-gold/5 px-6 py-2.5"
              >
                <Newspaper className="w-4 h-4 mr-2" /> World News
              </Button>
            </Link>
            <Link to="/earn">
              <Button
                data-ocid="home.secondary_button"
                variant="outline"
                className="border-orange-brand/30 text-orange-brand hover:bg-orange-brand/5 px-6 py-2.5"
              >
                <Coins className="w-4 h-4 mr-2" /> Earn USDT
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* TICKER: announcements + ads */}
      {tickerDouble && tickerDouble.length > 0 ? (
        <div
          className="border-y border-gold/15 py-3 overflow-hidden"
          style={{ background: "rgba(245,158,11,0.03)" }}
        >
          <div className="animate-marquee">
            {tickerDouble.map((item, i) =>
              item.type === "announcement" ? (
                // biome-ignore lint/suspicious/noArrayIndexKey: marquee duplication requires index keys
                <span
                  key={`ann-${String(item.data.id)}-${i}`}
                  className="inline-flex items-center gap-2 mx-6 text-sm"
                >
                  <Badge className="bg-gold/20 text-gold border-gold/30 text-xs px-1.5 py-0">
                    NEWS
                  </Badge>
                  <span className="text-foreground/80 font-medium">
                    {item.data.title}
                  </span>
                  <span className="text-foreground/20">|</span>
                </span>
              ) : (
                // biome-ignore lint/suspicious/noArrayIndexKey: marquee duplication requires index keys
                <span
                  key={`ad-${String(item.data.id)}-${i}`}
                  className="inline-flex items-center gap-2 mx-6 text-sm"
                >
                  <Badge className="bg-orange-brand/20 text-orange-brand border-orange-brand/30 text-xs px-1.5 py-0">
                    PROMO
                  </Badge>
                  <span className="text-foreground/80 font-medium">
                    {item.data.title}
                  </span>
                  <span className="text-foreground/20">|</span>
                </span>
              ),
            )}
          </div>
        </div>
      ) : (
        <div
          className="border-y border-gold/15 py-3 overflow-hidden"
          style={{ background: "rgba(245,158,11,0.03)" }}
        >
          <div className="animate-marquee">
            {[
              "🚀 Welcome to Sandeep Karna Crypto Empire!",
              "📈 Daily trading insights and crypto analysis",
              "💰 Watch videos and earn 0.1 USDT per video",
              "📰 Live world news updates every 5 minutes",
              "🎬 New vlog episodes every day - subscribe now!",
            ]
              .concat([
                "🚀 Welcome to Sandeep Karna Crypto Empire!",
                "📈 Daily trading insights and crypto analysis",
                "💰 Watch videos and earn 0.1 USDT per video",
                "📰 Live world news updates every 5 minutes",
                "🎬 New vlog episodes every day - subscribe now!",
              ])
              .map((text, i) => (
                <span
                  // biome-ignore lint/suspicious/noArrayIndexKey: marquee duplication requires index keys
                  key={i}
                  className="inline-flex items-center gap-2 mx-8 text-sm text-foreground/70"
                >
                  {text}
                  <span className="text-foreground/20 ml-4">•</span>
                </span>
              ))}
          </div>
        </div>
      )}

      {/* ADS & PROMOTIONS SECTION */}
      {ads.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-6">
            <h2 className="font-display text-3xl font-bold">
              Ads & <span className="gold-gradient">Promotions</span>
            </h2>
            <p className="text-foreground/50 text-sm mt-1">
              Sponsored content and partnerships
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {ads.map((ad, i) => (
              <motion.a
                key={String(ad.id)}
                href={ad.linkUrl || "#"}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                data-ocid={`home.item.${i + 1}`}
                className="glass-card glass-card-hover rounded-xl overflow-hidden block transition-all"
              >
                {ad.imageUrl && (
                  <div className="aspect-video bg-navy-card overflow-hidden">
                    <img
                      src={ad.imageUrl}
                      alt={ad.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-4">
                  <Badge className="bg-orange-brand/20 text-orange-brand border-orange-brand/30 text-xs mb-2">
                    SPONSORED
                  </Badge>
                  <h3 className="font-semibold text-foreground/90 mb-1">
                    {ad.title}
                  </h3>
                  <p className="text-sm text-foreground/60 line-clamp-2">
                    {ad.description}
                  </p>
                  {ad.linkUrl && (
                    <div className="flex items-center gap-1 text-xs text-gold mt-2">
                      <ExternalLink className="w-3 h-3" /> Learn more
                    </div>
                  )}
                </div>
              </motion.a>
            ))}
          </div>
        </section>
      )}

      {/* EARN SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 text-center">
          <h2 className="font-display text-3xl font-bold mb-2">
            Earn <span className="gold-gradient">USDT</span> While You Browse
          </h2>
          <p className="text-foreground/50">
            Watch videos and write articles to earn real rewards
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            data-ocid="home.card"
            className="glass-card glass-card-hover rounded-2xl p-6 flex flex-col"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold to-orange-brand flex items-center justify-center mb-4">
              <Play className="w-6 h-6 text-navy" />
            </div>
            <h3 className="font-display text-xl font-bold mb-2">
              Watch to Earn
            </h3>
            <p className="text-foreground/60 text-sm mb-4 flex-1">
              Watch Sandeep&apos;s daily vlogs and earn{" "}
              <strong className="text-gold">0.1 USDT</strong> per video. Minimum
              withdrawal $10 USD.
            </p>
            <Link to="/earn">
              <Button
                data-ocid="home.primary_button"
                className="w-full bg-gradient-to-r from-gold to-orange-brand text-navy font-bold"
              >
                <Coins className="w-4 h-4 mr-2" /> Watch & Earn
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            data-ocid="home.card"
            className="glass-card glass-card-hover rounded-2xl p-6 flex flex-col"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center mb-4">
              <Edit3 className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="font-display text-xl font-bold mb-2">
              Write to Earn
            </h3>
            <p className="text-foreground/60 text-sm mb-4 flex-1">
              Write articles about crypto and trading. Submit for review and
              earn USDT rewards approved by admin.
            </p>
            <Link to="/earn">
              <Button
                data-ocid="home.secondary_button"
                variant="outline"
                className="w-full border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
              >
                <Edit3 className="w-4 h-4 mr-2" /> Start Writing
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* VLOGS + NEWS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-2xl font-bold">
                Latest <span className="text-orange-brand">Vlogs</span>
              </h2>
              <Link to="/vlog">
                <Button
                  variant="ghost"
                  className="text-orange-brand hover:bg-orange-brand/5 text-sm"
                >
                  All Vlogs <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              </Link>
            </div>
            <div className="space-y-4">
              {posts.length > 0
                ? posts.slice(0, 3).map((post) => (
                    <div
                      key={String(post.id)}
                      className="glass-card glass-card-hover rounded-xl p-4 flex gap-4 transition-all"
                    >
                      {post.thumbnailUrl && (
                        <img
                          src={post.thumbnailUrl}
                          alt={post.title}
                          className="w-20 h-16 rounded-lg object-cover flex-shrink-0"
                        />
                      )}
                      <div className="min-w-0">
                        <div className="font-semibold text-sm text-foreground/90 line-clamp-2">
                          {post.title}
                        </div>
                        <div className="text-xs text-foreground/40 mt-1">
                          {new Date(
                            Number(post.createdAt) / 1000000,
                          ).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))
                : PLACEHOLDER_VLOGS.map((item) => (
                    <div
                      key={item.title}
                      className="glass-card glass-card-hover rounded-xl p-4 flex gap-4 transition-all"
                    >
                      <div className="w-20 h-16 rounded-lg flex-shrink-0 bg-gradient-to-br from-gold/30 to-orange-brand/20" />
                      <div>
                        <div className="font-semibold text-sm text-foreground/90">
                          {item.title}
                        </div>
                        <div className="text-xs text-foreground/40 mt-1">
                          {item.date}
                        </div>
                      </div>
                    </div>
                  ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-2xl font-bold">
                World <span className="gold-gradient">News</span>
              </h2>
              <Link to="/news">
                <Button
                  variant="ghost"
                  className="text-gold hover:bg-gold/5 text-sm"
                >
                  All News <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              </Link>
            </div>
            <div className="space-y-4">
              {news.slice(0, 3).map((article, i) => (
                <a
                  // biome-ignore lint/suspicious/noArrayIndexKey: news items may share URLs
                  key={article.url ? `${article.url}-${i}` : `news-${i}`}
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-card glass-card-hover rounded-xl p-4 flex gap-4 transition-all block"
                >
                  {article.image && (
                    <img
                      src={article.image}
                      alt=""
                      className="w-20 h-16 rounded-lg object-cover flex-shrink-0"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  )}
                  <div className="min-w-0">
                    <div className="font-semibold text-sm text-foreground/90 line-clamp-2">
                      {article.title}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-foreground/40 mt-1">
                      <span>{article.source?.name}</span>
                      <span>·</span>
                      <span>{timeAgo(article.publishedAt)}</span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TRADING JOURNEY PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-20">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl font-bold">
            Trading <span className="gold-gradient">Journey</span>
          </h2>
          <Link to="/trading">
            <Button
              variant="ghost"
              className="text-gold hover:bg-gold/5 text-sm"
            >
              View All <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            {
              title: "Started with $500 — BTC Long Trade",
              result: "+42%",
              positive: true,
              date: "Jan 2026",
            },
            {
              title: "ETH Swing Trade Analysis",
              result: "-8%",
              positive: false,
              date: "Feb 2026",
            },
            {
              title: "SOL Breakout — Perfect Entry",
              result: "+67%",
              positive: true,
              date: "Mar 2026",
            },
          ].map((trade, i) => (
            <motion.div
              key={trade.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card rounded-xl p-4"
            >
              <div className="flex items-start justify-between mb-2">
                <span className="text-xs text-foreground/50">{trade.date}</span>
                <span
                  className={`font-bold text-sm ${trade.positive ? "positive" : "negative"}`}
                >
                  {trade.result}
                </span>
              </div>
              <p className="text-sm font-medium text-foreground/80">
                {trade.title}
              </p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
