import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "@tanstack/react-router";
import {
  CheckCircle,
  Clock,
  Coins,
  Edit3,
  Loader2,
  Play,
  XCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { Variant_pending_approved_rejected } from "../backend.d";
import { useAuth } from "../contexts/AuthContext";
import {
  useClaimEarnForArticle,
  useClaimEarnForVideo,
  useUserEarnRecords,
  useVlogPosts,
} from "../hooks/useQueries";

function StatusBadge({
  status,
}: { status: Variant_pending_approved_rejected }) {
  if (status === Variant_pending_approved_rejected.approved)
    return (
      <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
        <CheckCircle className="w-3 h-3 mr-1" />
        Approved
      </Badge>
    );
  if (status === Variant_pending_approved_rejected.rejected)
    return (
      <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
        <XCircle className="w-3 h-3 mr-1" />
        Rejected
      </Badge>
    );
  return (
    <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
      <Clock className="w-3 h-3 mr-1" />
      Pending
    </Badge>
  );
}

export function Earn() {
  const { user, isLoggedIn } = useAuth();
  const { data: posts = [] } = useVlogPosts();
  const { data: earnRecords = [] } = useUserEarnRecords();
  const claimVideo = useClaimEarnForVideo();
  const claimArticle = useClaimEarnForArticle();
  const [articleTitle, setArticleTitle] = useState("");

  const claimedVideoIds = new Set(
    earnRecords
      .filter((r) => r.taskType.toString().includes("watchVideo"))
      .map((r) => r.contentId),
  );

  async function handleClaimVideo(videoId: bigint) {
    if (!user) return;
    try {
      await claimVideo.mutateAsync({ username: user.username, videoId });
      toast.success("Claim submitted! Awaiting admin approval.");
    } catch {
      toast.error("Failed to claim. You may have already claimed this video.");
    }
  }

  async function handleClaimArticle(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !articleTitle.trim()) return;
    try {
      await claimArticle.mutateAsync({
        username: user.username,
        articleTitle: articleTitle.trim(),
      });
      toast.success("Article submitted! Awaiting admin approval.");
      setArticleTitle("");
    } catch {
      toast.error("Failed to submit article.");
    }
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-gold/10 text-gold border border-gold/30 rounded-full px-4 py-1.5 text-sm font-medium mb-4">
            <Coins className="w-4 h-4" /> Earn USDT
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
            <span className="gold-gradient">Earn</span> While You Enjoy
          </h1>
          <p className="text-foreground/60 max-w-xl mx-auto">
            Watch videos and write articles to earn USDT. All rewards require
            admin approval. Minimum withdrawal is{" "}
            <span className="text-gold font-semibold">$10 USDT</span>.
          </p>
        </motion.div>

        {!isLoggedIn && (
          <div
            className="glass-card rounded-2xl p-8 text-center mb-8"
            data-ocid="earn.empty_state"
          >
            <Coins className="w-12 h-12 text-gold mx-auto mb-4" />
            <h3 className="font-display text-xl font-bold mb-2">
              Login to Start Earning
            </h3>
            <p className="text-foreground/60 mb-4">
              Create an account or sign in to claim rewards
            </p>
            <div className="flex gap-3 justify-center">
              <Link to="/login">
                <Button
                  data-ocid="earn.primary_button"
                  className="bg-gradient-to-r from-gold to-orange-brand text-navy font-bold"
                >
                  Sign In
                </Button>
              </Link>
              <Link to="/signup">
                <Button data-ocid="earn.secondary_button" variant="outline">
                  Create Account
                </Button>
              </Link>
            </div>
          </div>
        )}

        <Tabs defaultValue="watch" className="space-y-6">
          <TabsList className="glass-card border border-gold/20 p-1">
            <TabsTrigger
              data-ocid="earn.tab"
              value="watch"
              className="data-[state=active]:bg-gold/20 data-[state=active]:text-gold"
            >
              <Play className="w-4 h-4 mr-2" /> Watch to Earn
            </TabsTrigger>
            <TabsTrigger
              data-ocid="earn.tab"
              value="write"
              className="data-[state=active]:bg-gold/20 data-[state=active]:text-gold"
            >
              <Edit3 className="w-4 h-4 mr-2" /> Write to Earn
            </TabsTrigger>
          </TabsList>

          <TabsContent value="watch" className="space-y-6">
            <div className="glass-card rounded-xl p-4 border border-gold/20 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center">
                <Coins className="w-5 h-5 text-gold" />
              </div>
              <div>
                <p className="font-semibold">
                  Earn <span className="text-gold">0.1 USDT</span> per video
                  watched
                </p>
                <p className="text-sm text-foreground/60">
                  Claims are reviewed by admin. Minimum withdrawal: $10 USDT
                </p>
              </div>
            </div>

            {posts.length === 0 ? (
              <div
                className="text-center py-12 text-foreground/40"
                data-ocid="earn.empty_state"
              >
                <Play className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>No videos available yet</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {posts.map((post, i) => {
                  const claimed = claimedVideoIds.has(String(post.id));
                  return (
                    <motion.div
                      key={String(post.id)}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      data-ocid={`earn.item.${i + 1}`}
                      className="glass-card glass-card-hover rounded-xl overflow-hidden"
                    >
                      {post.thumbnailUrl && (
                        <div className="aspect-video bg-navy-card overflow-hidden">
                          <img
                            src={post.thumbnailUrl}
                            alt={post.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="p-4">
                        <h3 className="font-semibold mb-1 line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-sm text-foreground/60 mb-3 line-clamp-2">
                          {post.description}
                        </p>
                        {claimed ? (
                          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                            <CheckCircle className="w-3 h-3 mr-1" /> Claimed
                          </Badge>
                        ) : (
                          <Button
                            size="sm"
                            data-ocid={`earn.primary_button.${i + 1}`}
                            disabled={!isLoggedIn || claimVideo.isPending}
                            onClick={() => handleClaimVideo(post.id)}
                            className="bg-gradient-to-r from-gold to-orange-brand text-navy font-bold text-xs"
                          >
                            {claimVideo.isPending ? (
                              <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                            ) : (
                              <Coins className="w-3 h-3 mr-1" />
                            )}
                            Claim 0.1 USDT
                          </Button>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {earnRecords.length > 0 && (
              <div className="glass-card rounded-xl p-4">
                <h3 className="font-semibold mb-3 text-gold">
                  Your Earn History
                </h3>
                <div className="space-y-2">
                  {earnRecords.slice(0, 5).map((r, i) => (
                    <div
                      key={String(r.id)}
                      data-ocid={`earn.row.${i + 1}`}
                      className="flex items-center justify-between text-sm py-2 border-b border-border/30 last:border-0"
                    >
                      <span className="text-foreground/70">
                        {r.taskType.toString().includes("watchVideo")
                          ? "Watch"
                          : "Write"}
                        : {r.contentId.slice(0, 30)}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-gold font-mono">
                          {(Number(r.amount) / 1000).toFixed(2)} USDT
                        </span>
                        <StatusBadge status={r.status} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="write" className="space-y-6">
            <div className="glass-card rounded-xl p-4 border border-gold/20 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center">
                <Edit3 className="w-5 h-5 text-gold" />
              </div>
              <div>
                <p className="font-semibold">Earn USDT for writing articles</p>
                <p className="text-sm text-foreground/60">
                  Submit your article title. Admin sets the reward amount per
                  article.
                </p>
              </div>
            </div>

            {isLoggedIn && (
              <form
                onSubmit={handleClaimArticle}
                className="glass-card rounded-xl p-6 space-y-4"
              >
                <h3 className="font-semibold">Submit an Article</h3>
                <div className="space-y-2">
                  <Label>Article Title</Label>
                  <Input
                    data-ocid="earn.input"
                    placeholder="e.g. Bitcoin's Role in Modern Portfolio Management"
                    value={articleTitle}
                    onChange={(e) => setArticleTitle(e.target.value)}
                  />
                </div>
                <Button
                  type="submit"
                  data-ocid="earn.submit_button"
                  disabled={!articleTitle.trim() || claimArticle.isPending}
                  className="bg-gradient-to-r from-gold to-orange-brand text-navy font-bold"
                >
                  {claimArticle.isPending ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Edit3 className="w-4 h-4 mr-2" />
                  )}
                  Submit for Review
                </Button>
              </form>
            )}

            {earnRecords.filter((r) =>
              r.taskType.toString().includes("writeArticle"),
            ).length > 0 && (
              <div className="glass-card rounded-xl p-4">
                <h3 className="font-semibold mb-3 text-gold">
                  Article Submissions
                </h3>
                <div className="space-y-2">
                  {earnRecords
                    .filter((r) =>
                      r.taskType.toString().includes("writeArticle"),
                    )
                    .map((r, i) => (
                      <div
                        key={String(r.id)}
                        data-ocid={`earn.row.${i + 1}`}
                        className="flex items-center justify-between text-sm py-2 border-b border-border/30 last:border-0"
                      >
                        <span className="text-foreground/70">
                          {r.contentId.slice(0, 40)}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-gold font-mono">
                            {(Number(r.amount) / 1000).toFixed(2)} USDT
                          </span>
                          <StatusBadge status={r.status} />
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
