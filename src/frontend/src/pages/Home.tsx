import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ChevronRight,
  Crown,
  ExternalLink,
  Play,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
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
  adUrl: string;
  imageUrl?: string;
  videoUrl?: string;
  steps: string[];
  reward: number;
  date: string;
};

function TasksPreview() {
  const adminTasks: AdminTask[] = loadLS<AdminTask[]>("sce_admin_tasks", []);
  const preview = adminTasks.slice(0, 3);

  if (preview.length === 0) {
    return (
      <div
        data-ocid="home.tasks.empty_state"
        className="glass-card rounded-2xl p-8 text-center text-muted-foreground"
      >
        <Play className="w-10 h-10 mx-auto mb-3 text-gold/20" />
        <p className="text-sm font-medium">
          Admin will add tasks soon. Check back daily!
        </p>
        <p className="text-xs mt-1 text-muted-foreground/60">
          Tasks will appear here once added.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {preview.map((task, i) => (
        <motion.div
          key={task.id}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.07 }}
          data-ocid={`home.tasks.item.${i + 1}`}
          className="glass-card rounded-xl overflow-hidden border border-border/30 hover:border-gold/30 transition-colors"
        >
          {task.imageUrl && (
            <img
              src={task.imageUrl}
              alt={task.title}
              className="w-full h-32 object-cover"
            />
          )}
          {task.videoUrl && !task.imageUrl && (
            <div className="w-full h-32 bg-background/50 flex items-center justify-center">
              <Play className="w-10 h-10 text-gold/40" />
            </div>
          )}
          <div className="p-4">
            <div className="flex items-start justify-between gap-2 mb-2">
              <span className="font-semibold text-foreground text-sm leading-tight">
                {task.title}
              </span>
              <span className="text-xs text-green-400 font-bold shrink-0">
                ${task.reward}
              </span>
            </div>
            {task.description && (
              <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                {task.description}
              </p>
            )}
            <div className="flex flex-wrap gap-1 mb-3">
              {task.steps.map((s) => (
                <span
                  key={s}
                  className="text-xs border border-border/40 rounded px-1.5 py-0.5 text-muted-foreground"
                >
                  {s}
                </span>
              ))}
            </div>
            <Link to="/earn">
              <Button
                size="sm"
                data-ocid="home.primary_button"
                className="bg-gold/10 text-gold border border-gold/20 hover:bg-gold/20 text-xs w-full"
              >
                Do Task <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </Link>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export function Home() {
  const { user, isLoggedIn } = useAuth();

  const ads = loadLS<any[]>("sce_admin_ads", []);
  const announcements = loadLS<any[]>("sce_admin_announcements", []);
  const vlogs = loadLS<any[]>("sce_admin_vlogs", []);

  const announcementText =
    announcements.length > 0
      ? announcements.map((a: any) => a.title).join("  •  ")
      : "Earn up to 500 USDT daily  •  Daily Spin Rewards  •  500+ Earning Methods  •  New Gold Plan available!  •  Referral bonus: $1 per invite";

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

      {/* Ads / Promotions - TOP */}
      {ads.length > 0 && (
        <section className="pt-28 pb-6 px-4">
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
      <section
        className={`${ads.length > 0 ? "pt-6" : "pt-32"} pb-20 px-4 relative overflow-hidden`}
      >
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

      {/* Latest Vlogs */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-display text-3xl font-bold text-foreground">
              Latest <span className="gold-gradient">Vlogs</span>
            </h2>
            <Link to="/vlog">
              <Button
                data-ocid="home.link"
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

      {/* Tasks Preview */}
      <section className="py-16 px-4 bg-background/20">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-display text-3xl font-bold text-foreground">
                Active <span className="gold-gradient">Tasks</span>
              </h2>
              <p className="text-muted-foreground text-sm mt-1">
                Complete tasks to earn USDT rewards
              </p>
            </div>
            <Link to="/earn">
              <Button
                variant="outline"
                size="sm"
                data-ocid="home.secondary_button"
                className="border-gold/30 text-gold hover:bg-gold/10"
              >
                View All <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
          <TasksPreview />
        </div>
      </section>

      {/* Earn Methods */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl font-bold text-foreground mb-2">
              How to <span className="gold-gradient">Earn</span>
            </h2>
            <p className="text-muted-foreground">
              Multiple ways to grow your income daily
            </p>
          </div>
          <div className="grid grid-cols-1 max-w-sm mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0 }}
              className="glass-card rounded-2xl p-6 text-center group hover:ring-1 hover:ring-gold/30 transition-all"
              data-ocid="home.earn.card"
            >
              <div className="w-14 h-14 rounded-2xl bg-gold/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-gold/20 transition-colors">
                <Zap className="w-7 h-7 text-gold" />
              </div>
              <h3 className="font-display font-bold text-xl text-foreground mb-2">
                Ways to Earn
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Complete tasks, watch ads, daily spin, social tasks and 500+
                earning methods
              </p>
              <div className="text-xs text-green-400 font-semibold mb-4">
                Up to $500 USDT/day
              </div>
              <Link to="/earn">
                <Button
                  size="sm"
                  data-ocid="home.primary_button"
                  className="bg-gradient-to-r from-gold to-orange-brand text-navy font-bold w-full"
                >
                  Start Earning <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </motion.div>
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
              and choose your plan.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/signup">
                <Button
                  data-ocid="home.primary_button"
                  size="lg"
                  className="bg-gradient-to-r from-gold to-orange-brand text-navy font-bold text-base px-8"
                >
                  Register Free <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/plans">
                <Button
                  data-ocid="home.secondary_button"
                  size="lg"
                  variant="outline"
                  className="border-gold/40 text-gold hover:bg-gold/10 text-base px-8"
                >
                  View Plans
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

      {/* Floating wallet widget */}
      <div className="fixed bottom-6 right-4 z-50">
        <div className="glass-card rounded-2xl p-3 shadow-lg border border-gold/20 min-w-[160px]">
          <div className="text-xs text-muted-foreground mb-1 font-medium">
            Your Balance
          </div>
          <div className="text-base font-bold text-gold mb-2">
            ${(user?.balance || 0).toFixed(2)} USDT
          </div>
          <div className="flex gap-1.5">
            <Link to="/wallet">
              <Button
                size="sm"
                data-ocid="home.primary_button"
                className="bg-gradient-to-r from-gold to-orange-brand text-navy font-bold h-7 text-xs px-2"
              >
                Deposit
              </Button>
            </Link>
            <Link to="/wallet">
              <Button
                size="sm"
                variant="outline"
                data-ocid="home.secondary_button"
                className="border-gold/30 text-gold hover:bg-gold/10 h-7 text-xs px-2"
              >
                Withdraw
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
