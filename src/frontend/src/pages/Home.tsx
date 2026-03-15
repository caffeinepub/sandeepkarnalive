import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BarChart2,
  Coins,
  Edit3,
  ExternalLink,
  Newspaper,
  Play,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { motion } from "motion/react";
import {
  useActiveAds,
  useCryptoPrices,
  useVlogPosts,
  useWorldNews,
} from "../hooks/useQueries";

function formatPrice(n: number) {
  if (n >= 1000)
    return `$${n.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
  if (n >= 1)
    return `$${n.toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
  return `$${n.toFixed(4)}`;
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const h = Math.floor(diff / 3600000);
  if (h < 1) return `${Math.floor(diff / 60000)}m ago`;
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export function Home() {
  const { data: coins = [] } = useCryptoPrices();
  const { data: news = [] } = useWorldNews();
  const { data: posts = [] } = useVlogPosts();
  const { data: ads = [] } = useActiveAds();

  const marqueeItems = [
    ...coins.map((c) => ({ type: "coin" as const, data: c })),
    ...ads.map((a) => ({ type: "ad" as const, data: a })),
  ];
  const marqueeDouble = [...marqueeItems, ...marqueeItems];

  const PLACEHOLDER_VLOGS = [
    "My Crypto Trading Journey - Month 1",
    "Top 5 Altcoins for 2025",
    "Day Trading BTC Live Session",
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
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <img
              src="/assets/generated/logo-transparent.dim_300x80.png"
              alt="SandeepKarnaLive"
              className="mx-auto mb-8 h-16 object-contain"
            />
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
            news, and behind-the-scenes vlog content.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap gap-4 justify-center"
          >
            <Link to="/crypto">
              <Button className="bg-gradient-to-r from-gold to-orange-brand text-navy font-bold hover:opacity-90 px-6 py-2.5">
                <BarChart2 className="w-4 h-4 mr-2" /> Live Crypto
              </Button>
            </Link>
            <Link to="/news">
              <Button
                variant="outline"
                className="border-gold/30 text-gold hover:bg-gold/5 px-6 py-2.5"
              >
                <Newspaper className="w-4 h-4 mr-2" /> World News
              </Button>
            </Link>
            <Link to="/earn">
              <Button
                variant="outline"
                className="border-orange-brand/30 text-orange-brand hover:bg-orange-brand/5 px-6 py-2.5"
              >
                <Coins className="w-4 h-4 mr-2" /> Earn USDT
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* TICKER: coins + ads */}
      <div
        className="border-y border-gold/15 py-3 overflow-hidden"
        style={{ background: "rgba(245,158,11,0.03)" }}
      >
        <div className="animate-marquee">
          {marqueeDouble.map((item, i) =>
            item.type === "coin" ? (
              // biome-ignore lint/suspicious/noArrayIndexKey: marquee duplication requires index keys
              <span
                key={`coin-${item.data.id}-${i}`}
                className="inline-flex items-center gap-2 mx-6 text-sm"
              >
                <img
                  src={item.data.image}
                  alt={item.data.symbol}
                  className="w-4 h-4 rounded-full"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
                <span className="font-mono font-semibold text-foreground/80">
                  {item.data.symbol.toUpperCase()}
                </span>
                <span className="font-mono font-bold text-gold">
                  {formatPrice(item.data.current_price)}
                </span>
                <span
                  className={
                    item.data.price_change_percentage_24h >= 0
                      ? "positive text-xs"
                      : "negative text-xs"
                  }
                >
                  {item.data.price_change_percentage_24h >= 0 ? "▲" : "▼"}{" "}
                  {Math.abs(item.data.price_change_percentage_24h).toFixed(2)}%
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
              Watch Sandeep's daily vlogs and earn{" "}
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
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-4">
              <Edit3 className="w-6 h-6 text-white" />
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

      {/* CRYPTO PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-display text-3xl font-bold">
              Live <span className="gold-gradient">Crypto Prices</span>
            </h2>
            <p className="text-foreground/50 text-sm mt-1">
              Top cryptocurrencies by market cap
            </p>
          </div>
          <Link to="/crypto">
            <Button
              variant="ghost"
              className="text-gold hover:text-gold/80 hover:bg-gold/5"
            >
              View All <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {coins.slice(0, 5).map((coin, i) => (
            <motion.div
              key={coin.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="glass-card glass-card-hover rounded-xl p-4 transition-all duration-300"
            >
              <div className="flex items-center gap-2 mb-3">
                <img
                  src={coin.image}
                  alt={coin.name}
                  className="w-7 h-7 rounded-full"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
                <div>
                  <div className="font-semibold text-xs text-foreground/80">
                    {coin.name}
                  </div>
                  <div className="text-xs text-foreground/40 uppercase">
                    {coin.symbol}
                  </div>
                </div>
              </div>
              <div className="font-mono font-bold text-sm text-gold">
                {formatPrice(coin.current_price)}
              </div>
              <div
                className={`flex items-center gap-1 text-xs mt-1 ${coin.price_change_percentage_24h >= 0 ? "positive" : "negative"}`}
              >
                {coin.price_change_percentage_24h >= 0 ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
              </div>
            </motion.div>
          ))}
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
                : PLACEHOLDER_VLOGS.map((title, i) => (
                    <div
                      key={title}
                      className="glass-card glass-card-hover rounded-xl p-4 flex gap-4 transition-all"
                    >
                      <div
                        className="w-20 h-16 rounded-lg flex-shrink-0"
                        style={{
                          background: `linear-gradient(135deg, rgba(245,158,11,0.${2 + i}) 0%, rgba(249,115,22,0.${1 + i}) 100%)`,
                        }}
                      />
                      <div>
                        <div className="font-semibold text-sm text-foreground/90">
                          {title}
                        </div>
                        <div className="text-xs text-foreground/40 mt-1">
                          Mar {10 + i}, 2026
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
    </div>
  );
}
