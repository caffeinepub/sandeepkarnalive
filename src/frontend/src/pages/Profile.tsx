import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Link } from "@tanstack/react-router";
import {
  Award,
  CheckCircle,
  Clock,
  Coins,
  Copy,
  Edit3,
  Play,
  TrendingUp,
  User,
  Wallet,
  XCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { Variant_pending_approved_rejected } from "../backend.d";
import { useAuth } from "../contexts/AuthContext";
import { useUserDeposits, useUserEarnRecords } from "../hooks/useQueries";

function StatusBadge({
  status,
}: { status: Variant_pending_approved_rejected }) {
  if (status === Variant_pending_approved_rejected.approved)
    return (
      <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
        <CheckCircle className="w-3 h-3 mr-1" />
        Approved
      </Badge>
    );
  if (status === Variant_pending_approved_rejected.rejected)
    return (
      <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-xs">
        <XCircle className="w-3 h-3 mr-1" />
        Rejected
      </Badge>
    );
  return (
    <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-xs">
      <Clock className="w-3 h-3 mr-1" />
      Pending
    </Badge>
  );
}

export function Profile() {
  const { user, isLoggedIn } = useAuth();
  const { data: earnRecords = [] } = useUserEarnRecords();
  const { data: deposits = [] } = useUserDeposits();

  if (!isLoggedIn || !user) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center px-4">
        <div className="glass-card rounded-2xl p-8 text-center max-w-md">
          <User className="w-12 h-12 text-gold mx-auto mb-4" />
          <h3 className="font-display text-xl font-bold mb-2">
            Login Required
          </h3>
          <p className="text-foreground/60 mb-4">
            Sign in to view your profile
          </p>
          <Link to="/login">
            <Button
              data-ocid="profile.primary_button"
              className="bg-gradient-to-r from-gold to-orange-brand text-navy font-bold"
            >
              Sign In
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const balanceUSDT = (Number(user.balance) / 1000).toFixed(2);
  const totalEarnedUSDT = (Number(user.totalEarned) / 1000).toFixed(2);
  const totalDepositedUSDT = (Number(user.totalDeposited) / 1000).toFixed(2);

  // Referral code from username
  const referralCode = `SKCE-${user.username.toUpperCase().slice(0, 6)}`;

  // Earn progress toward $10 withdrawal
  const earnProgress = Math.min(
    (Number(user.totalEarned) / 1000 / 10) * 100,
    100,
  );

  // Achievements
  const achievements = [
    {
      icon: "🚀",
      title: "Early Adopter",
      unlocked: true,
      desc: "Joined Sandeep Karna Crypto Empire",
    },
    {
      icon: "💰",
      title: "First Earn",
      unlocked: Number(user.totalEarned) > 0,
      desc: "Earned your first USDT",
    },
    {
      icon: "📦",
      title: "Depositor",
      unlocked: Number(user.totalDeposited) > 0,
      desc: "Made your first deposit",
    },
    {
      icon: "🏆",
      title: "Power User",
      unlocked: earnRecords.length >= 5,
      desc: "Completed 5+ earn tasks",
    },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-display text-4xl font-bold gold-gradient mb-2">
            My Profile
          </h1>
          <p className="text-foreground/60">
            Your account overview and activity
          </p>
        </motion.div>

        {/* Profile header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-2xl p-6 mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-6"
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gold to-orange-brand flex items-center justify-center shrink-0">
            <User className="w-8 h-8 text-navy" />
          </div>
          <div className="flex-1">
            <h2 className="font-display text-2xl font-bold text-foreground mb-1">
              {user.username}
            </h2>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className="bg-gold/20 text-gold border-gold/30 text-xs">
                <TrendingUp className="w-3 h-3 mr-1" /> Member
              </Badge>
              <button
                type="button"
                className="flex items-center gap-1.5 bg-secondary rounded-full px-3 py-1 text-xs cursor-pointer hover:bg-secondary/80 transition-colors"
                onClick={() => {
                  navigator.clipboard.writeText(referralCode);
                  toast.success("Referral code copied!");
                }}
              >
                <Copy className="w-3 h-3 text-foreground/50" />
                <span className="text-foreground/70">Ref:</span>
                <span className="font-mono font-bold text-gold">
                  {referralCode}
                </span>
              </button>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-foreground/50">Balance</p>
            <p className="font-display text-2xl font-bold text-gold">
              ${balanceUSDT}
            </p>
            <p className="text-xs text-foreground/40">USDT</p>
          </div>
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            {
              label: "Total Earned",
              value: `$${totalEarnedUSDT}`,
              icon: Coins,
              color: "text-green-400",
            },
            {
              label: "Total Deposited",
              value: `$${totalDepositedUSDT}`,
              icon: Wallet,
              color: "text-blue-400",
            },
            {
              label: "Earn Tasks",
              value: String(earnRecords.length),
              icon: Award,
              color: "text-purple-400",
            },
            {
              label: "Deposits",
              value: String(deposits.length),
              icon: TrendingUp,
              color: "text-gold",
            },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              data-ocid="profile.card"
              className="glass-card rounded-xl p-4"
            >
              <stat.icon className={`w-5 h-5 ${stat.color} mb-2`} />
              <p className={`font-display text-xl font-bold ${stat.color}`}>
                {stat.value}
              </p>
              <p className="text-xs text-foreground/50 mt-0.5">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Earn progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card rounded-xl p-5 mb-6"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Earn Progress to Withdrawal</h3>
            <span className="text-sm text-foreground/60">
              ${totalEarnedUSDT} / $10.00
            </span>
          </div>
          <Progress value={earnProgress} className="h-2 bg-secondary" />
          <p className="text-xs text-foreground/50 mt-2">
            {earnProgress >= 100
              ? "✅ You can now withdraw! Visit Wallet page."
              : `Earn $${(10 - Number(totalEarnedUSDT)).toFixed(2)} more to reach the minimum withdrawal.`}
          </p>
        </motion.div>

        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="glass-card rounded-xl p-5 mb-6"
        >
          <h3 className="font-semibold mb-4">Achievements</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {achievements.map((a) => (
              <div
                key={a.title}
                className={`rounded-xl p-3 text-center border transition-all ${
                  a.unlocked
                    ? "border-gold/30 bg-gold/5"
                    : "border-border/30 bg-secondary/20 opacity-50 grayscale"
                }`}
              >
                <div className="text-2xl mb-1">{a.icon}</div>
                <p className="text-xs font-bold text-foreground/80">
                  {a.title}
                </p>
                <p className="text-xs text-foreground/40 mt-0.5">{a.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick actions */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <Link to="/earn">
            <div
              data-ocid="profile.primary_button"
              className="glass-card glass-card-hover rounded-xl p-4 flex items-center gap-4 cursor-pointer transition-all"
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gold to-orange-brand flex items-center justify-center shrink-0">
                <Play className="w-5 h-5 text-navy" />
              </div>
              <div>
                <p className="font-semibold text-sm">Watch to Earn</p>
                <p className="text-xs text-foreground/50">
                  Earn 0.1 USDT per video
                </p>
              </div>
            </div>
          </Link>
          <Link to="/wallet">
            <div
              data-ocid="profile.secondary_button"
              className="glass-card glass-card-hover rounded-xl p-4 flex items-center gap-4 cursor-pointer transition-all"
            >
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center shrink-0">
                <Wallet className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="font-semibold text-sm">Manage Wallet</p>
                <p className="text-xs text-foreground/50">
                  Deposit & Withdraw USDT
                </p>
              </div>
            </div>
          </Link>
        </div>

        {/* Recent earn activity */}
        {earnRecords.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card rounded-xl p-5 mb-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Recent Earn Activity</h3>
              <Link to="/earn">
                <Button variant="ghost" size="sm" className="text-gold text-xs">
                  View All
                </Button>
              </Link>
            </div>
            <div className="space-y-2">
              {earnRecords.slice(0, 5).map((record, i) => (
                <div
                  key={String(record.id)}
                  data-ocid={`profile.item.${i + 1}`}
                  className="flex items-center justify-between py-2 border-b border-border/30 last:border-0"
                >
                  <div className="flex items-center gap-2">
                    {record.taskType === "watchVideo" ? (
                      <Play className="w-4 h-4 text-gold" />
                    ) : (
                      <Edit3 className="w-4 h-4 text-blue-400" />
                    )}
                    <span className="text-sm text-foreground/80">
                      {record.taskType === "watchVideo"
                        ? "Watch Video"
                        : "Write Article"}
                    </span>
                    <span className="text-xs text-foreground/40 truncate max-w-24">
                      {record.contentId}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono text-green-400">
                      +${(Number(record.amount) / 1000).toFixed(2)}
                    </span>
                    <StatusBadge status={record.status} />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Invite section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="glass-card rounded-xl p-5 border border-gold/20"
        >
          <h3 className="font-semibold mb-2">Invite Friends</h3>
          <p className="text-sm text-foreground/60 mb-3">
            Share your referral code and earn together!
          </p>
          <div className="flex items-center gap-2">
            <div className="flex-1 font-mono text-sm bg-secondary rounded-lg px-3 py-2 text-gold">
              {referralCode}
            </div>
            <Button
              data-ocid="profile.secondary_button"
              size="sm"
              onClick={() => {
                navigator.clipboard.writeText(referralCode);
                toast.success("Referral code copied!");
              }}
              className="bg-gradient-to-r from-gold to-orange-brand text-navy font-bold"
            >
              <Copy className="w-3.5 h-3.5 mr-1" /> Copy
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
