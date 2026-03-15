import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "@tanstack/react-router";
import {
  BarChart2,
  CheckCircle,
  Coins,
  Edit,
  Loader2,
  LogOut,
  Megaphone,
  Plus,
  Settings,
  Trash2,
  TrendingUp,
  Video,
  Wallet,
  X,
  XCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { VlogCategory } from "../backend.d";
import {
  useActiveAds,
  useAdminStats,
  useAnnouncements,
  useApproveDeposit,
  useApproveEarnRecord,
  useApproveWithdrawal,
  useCreateAd,
  useCreateAnnouncement,
  useCreateVlogPost,
  useDeleteAd,
  useDeleteAnnouncement,
  useDeleteVlogPost,
  usePendingDeposits,
  usePendingEarnRecords,
  usePendingWithdrawals,
  useRejectDeposit,
  useRejectEarnRecord,
  useRejectWithdrawal,
  useUpdateAd,
  useUpdateAnnouncement,
  useUpdateVlogPost,
  useVlogPosts,
} from "../hooks/useQueries";

const CATEGORY_LABELS: Record<string, string> = {
  [VlogCategory.vlog]: "Vlog",
  [VlogCategory.trading]: "Trading",
  [VlogCategory.promo]: "Promo",
};

interface VlogForm {
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  category: VlogCategory;
}
interface AnnouncementForm {
  title: string;
  content: string;
}
interface AdForm {
  title: string;
  description: string;
  imageUrl: string;
  linkUrl: string;
  isActive: boolean;
}

const emptyVlog: VlogForm = {
  title: "",
  description: "",
  videoUrl: "",
  thumbnailUrl: "",
  category: VlogCategory.vlog,
};
const emptyAnnouncement: AnnouncementForm = { title: "", content: "" };
const emptyAd: AdForm = {
  title: "",
  description: "",
  imageUrl: "",
  linkUrl: "",
  isActive: true,
};

function ApproveRejectRow({
  onApprove,
  onReject,
  isPending,
}: { onApprove: () => void; onReject: () => void; isPending?: boolean }) {
  return (
    <div className="flex gap-2">
      <Button
        size="sm"
        onClick={onApprove}
        disabled={isPending}
        className="bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30 text-xs h-7"
      >
        {isPending ? (
          <Loader2 className="w-3 h-3 animate-spin" />
        ) : (
          <CheckCircle className="w-3 h-3" />
        )}
      </Button>
      <Button
        size="sm"
        onClick={onReject}
        disabled={isPending}
        className="bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 text-xs h-7"
      >
        <XCircle className="w-3 h-3" />
      </Button>
    </div>
  );
}

export function AdminDashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("skl_admin_session")) {
      navigate({ to: "/admin" });
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("skl_admin_session");
    navigate({ to: "/admin" });
  };

  const { data: posts = [] } = useVlogPosts();
  const { data: announcements = [] } = useAnnouncements();
  const { data: ads = [] } = useActiveAds();
  const { data: stats } = useAdminStats();
  const { data: pendingDeposits = [] } = usePendingDeposits();
  const { data: pendingWithdrawals = [] } = usePendingWithdrawals();
  const { data: pendingEarns = [] } = usePendingEarnRecords();

  const createVlog = useCreateVlogPost();
  const updateVlog = useUpdateVlogPost();
  const deleteVlog = useDeleteVlogPost();
  const createAnn = useCreateAnnouncement();
  const updateAnn = useUpdateAnnouncement();
  const deleteAnn = useDeleteAnnouncement();
  const createAd = useCreateAd();
  const updateAd = useUpdateAd();
  const deleteAd = useDeleteAd();
  const approveDeposit = useApproveDeposit();
  const rejectDeposit = useRejectDeposit();
  const approveWithdrawal = useApproveWithdrawal();
  const rejectWithdrawal = useRejectWithdrawal();
  const approveEarn = useApproveEarnRecord();
  const rejectEarn = useRejectEarnRecord();

  // Vlog modal
  const [vlogOpen, setVlogOpen] = useState(false);
  const [vlogForm, setVlogForm] = useState<VlogForm>(emptyVlog);
  const [editVlogId, setEditVlogId] = useState<bigint | null>(null);

  // Announcement modal
  const [annOpen, setAnnOpen] = useState(false);
  const [annForm, setAnnForm] = useState<AnnouncementForm>(emptyAnnouncement);
  const [editAnnId, setEditAnnId] = useState<bigint | null>(null);

  // Ad modal
  const [adOpen, setAdOpen] = useState(false);
  const [adForm, setAdForm] = useState<AdForm>(emptyAd);
  const [editAdId, setEditAdId] = useState<bigint | null>(null);

  // Vlog handlers
  const openAddVlog = () => {
    setVlogForm(emptyVlog);
    setEditVlogId(null);
    setVlogOpen(true);
  };
  const openEditVlog = (post: any) => {
    setVlogForm({
      title: post.title,
      description: post.description,
      videoUrl: post.videoUrl,
      thumbnailUrl: post.thumbnailUrl,
      category: post.category,
    });
    setEditVlogId(post.id);
    setVlogOpen(true);
  };
  const handleVlogSubmit = async () => {
    try {
      if (editVlogId !== null) {
        await updateVlog.mutateAsync({ id: editVlogId, ...vlogForm });
        toast.success("Post updated!");
      } else {
        await createVlog.mutateAsync(vlogForm);
        toast.success("Post created!");
      }
      setVlogOpen(false);
    } catch {
      toast.error("Failed to save post");
    }
  };
  const handleDeleteVlog = async (id: bigint) => {
    try {
      await deleteVlog.mutateAsync(id);
      toast.success("Post deleted");
    } catch {
      toast.error("Failed to delete");
    }
  };

  // Announcement handlers
  const openAddAnn = () => {
    setAnnForm(emptyAnnouncement);
    setEditAnnId(null);
    setAnnOpen(true);
  };
  const openEditAnn = (ann: any) => {
    setAnnForm({ title: ann.title, content: ann.content });
    setEditAnnId(ann.id);
    setAnnOpen(true);
  };
  const handleAnnSubmit = async () => {
    try {
      if (editAnnId !== null) {
        await updateAnn.mutateAsync({ id: editAnnId, ...annForm });
        toast.success("Updated!");
      } else {
        await createAnn.mutateAsync(annForm);
        toast.success("Created!");
      }
      setAnnOpen(false);
    } catch {
      toast.error("Failed to save");
    }
  };
  const handleDeleteAnn = async (id: bigint) => {
    try {
      await deleteAnn.mutateAsync(id);
      toast.success("Deleted");
    } catch {
      toast.error("Failed to delete");
    }
  };

  // Ad handlers
  const openAddAd = () => {
    setAdForm(emptyAd);
    setEditAdId(null);
    setAdOpen(true);
  };
  const openEditAd = (ad: any) => {
    setAdForm({
      title: ad.title,
      description: ad.description,
      imageUrl: ad.imageUrl,
      linkUrl: ad.linkUrl,
      isActive: ad.isActive,
    });
    setEditAdId(ad.id);
    setAdOpen(true);
  };
  const handleAdSubmit = async () => {
    try {
      if (editAdId !== null) {
        await updateAd.mutateAsync({ id: editAdId, ...adForm });
        toast.success("Ad updated!");
      } else {
        await createAd.mutateAsync(adForm);
        toast.success("Ad created!");
      }
      setAdOpen(false);
    } catch {
      toast.error("Failed to save ad");
    }
  };
  const handleDeleteAd = async (id: bigint) => {
    try {
      await deleteAd.mutateAsync(id);
      toast.success("Ad deleted");
    } catch {
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="min-h-screen bg-mesh pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold to-orange-brand flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-navy" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold gold-gradient">
                Admin Dashboard
              </h1>
              <p className="text-xs text-foreground/40">
                SandeepKarnaLive Management
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="border-red-500/30 text-red-400 hover:bg-red-500/10"
          >
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </Button>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
          {[
            {
              label: "Users",
              value: stats ? String(stats.totalUsers) : String(posts.length),
              icon: BarChart2,
            },
            {
              label: "Pending Deposits",
              value: stats
                ? String(stats.totalPendingDeposits)
                : String(pendingDeposits.length),
              icon: Wallet,
            },
            {
              label: "Pending Withdrawals",
              value: stats
                ? String(stats.totalPendingWithdrawals)
                : String(pendingWithdrawals.length),
              icon: Wallet,
            },
            {
              label: "Pending Earns",
              value: stats
                ? String(stats.totalPendingEarnRecords)
                : String(pendingEarns.length),
              icon: Coins,
            },
            { label: "Vlog Posts", value: String(posts.length), icon: Video },
          ].map((s) => (
            <div
              key={s.label}
              className="glass-card rounded-xl p-3 flex items-center gap-2"
            >
              <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center shrink-0">
                <s.icon className="w-4 h-4 text-gold" />
              </div>
              <div>
                <div className="font-bold text-base text-foreground">
                  {s.value}
                </div>
                <div className="text-xs text-foreground/40 leading-tight">
                  {s.label}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="posts">
          <TabsList className="bg-navy-card border border-gold/15 mb-6 flex-wrap h-auto gap-1 p-1">
            {[
              { value: "posts", label: "Vlogs", icon: Video },
              {
                value: "announcements",
                label: "Announcements",
                icon: Megaphone,
              },
              { value: "ads", label: "Ads & Promo", icon: BarChart2 },
              { value: "deposits", label: "Deposits", icon: Wallet },
              { value: "withdrawals", label: "Withdrawals", icon: Wallet },
              { value: "earns", label: "Earn Approvals", icon: Coins },
              { value: "settings", label: "Settings", icon: Settings },
            ].map((t) => (
              <TabsTrigger
                key={t.value}
                value={t.value}
                data-ocid={`admin.${t.value}.tab`}
                className="data-[state=active]:bg-gold/10 data-[state=active]:text-gold text-xs sm:text-sm"
              >
                <t.icon className="w-3.5 h-3.5 mr-1.5" /> {t.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* === VLOG POSTS === */}
          <TabsContent value="posts">
            <div className="glass-card rounded-xl overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-gold/10">
                <h2 className="font-semibold text-foreground/80">
                  Vlog Posts ({posts.length})
                </h2>
                <Button
                  data-ocid="admin.vlog.add_button"
                  onClick={openAddVlog}
                  className="bg-gold/10 text-gold border border-gold/20 hover:bg-gold/20 text-sm"
                >
                  <Plus className="w-4 h-4 mr-1.5" /> Add Post
                </Button>
              </div>
              {posts.length === 0 ? (
                <div
                  data-ocid="admin.vlog.empty_state"
                  className="text-center py-12 text-foreground/40"
                >
                  <Video className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p>No posts yet. Add your first vlog post!</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="border-gold/10 hover:bg-transparent">
                      <TableHead className="text-foreground/50">
                        Title
                      </TableHead>
                      <TableHead className="text-foreground/50">
                        Category
                      </TableHead>
                      <TableHead className="text-foreground/50">Date</TableHead>
                      <TableHead className="text-foreground/50 text-right">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {posts.map((post, i) => (
                      <TableRow
                        key={String(post.id)}
                        data-ocid={`admin.vlog.row.${i + 1}`}
                        className="border-gold/5 hover:bg-gold/3"
                      >
                        <TableCell className="text-foreground/80 font-medium max-w-xs truncate">
                          {post.title}
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-gold/10 text-gold border-gold/20 text-xs">
                            {CATEGORY_LABELS[String(post.category)] ||
                              String(post.category)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-foreground/40 text-sm">
                          {new Date(
                            Number(post.createdAt) / 1000000,
                          ).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              data-ocid={`admin.vlog.edit_button.${i + 1}`}
                              variant="ghost"
                              size="sm"
                              onClick={() => openEditVlog(post)}
                              className="text-gold/60 hover:text-gold h-7 w-7 p-0"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              data-ocid={`admin.vlog.delete_button.${i + 1}`}
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteVlog(post.id)}
                              className="text-red-400/60 hover:text-red-400 h-7 w-7 p-0"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </TabsContent>

          {/* === ANNOUNCEMENTS === */}
          <TabsContent value="announcements">
            <div className="glass-card rounded-xl overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-gold/10">
                <h2 className="font-semibold text-foreground/80">
                  Announcements ({announcements.length})
                </h2>
                <Button
                  data-ocid="admin.announcement.add_button"
                  onClick={openAddAnn}
                  className="bg-gold/10 text-gold border border-gold/20 hover:bg-gold/20 text-sm"
                >
                  <Plus className="w-4 h-4 mr-1.5" /> Add
                </Button>
              </div>
              {announcements.length === 0 ? (
                <div
                  data-ocid="admin.announcement.empty_state"
                  className="text-center py-12 text-foreground/40"
                >
                  <Megaphone className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p>No announcements yet.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="border-gold/10 hover:bg-transparent">
                      <TableHead className="text-foreground/50">
                        Title
                      </TableHead>
                      <TableHead className="text-foreground/50">
                        Content
                      </TableHead>
                      <TableHead className="text-foreground/50">Date</TableHead>
                      <TableHead className="text-foreground/50 text-right">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {announcements.map((ann, i) => (
                      <TableRow
                        key={String(ann.id)}
                        data-ocid={`admin.announcement.row.${i + 1}`}
                        className="border-gold/5"
                      >
                        <TableCell className="font-medium text-foreground/80">
                          {ann.title}
                        </TableCell>
                        <TableCell className="text-foreground/40 text-sm max-w-xs truncate">
                          {ann.content}
                        </TableCell>
                        <TableCell className="text-foreground/40 text-sm">
                          {new Date(
                            Number(ann.createdAt) / 1000000,
                          ).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              data-ocid={`admin.announcement.edit_button.${i + 1}`}
                              variant="ghost"
                              size="sm"
                              onClick={() => openEditAnn(ann)}
                              className="text-gold/60 hover:text-gold h-7 w-7 p-0"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              data-ocid={`admin.announcement.delete_button.${i + 1}`}
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteAnn(ann.id)}
                              className="text-red-400/60 hover:text-red-400 h-7 w-7 p-0"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </TabsContent>

          {/* === ADS & PROMOTIONS === */}
          <TabsContent value="ads">
            <div className="glass-card rounded-xl overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-gold/10">
                <h2 className="font-semibold text-foreground/80">
                  Ads & Promotions ({ads.length})
                </h2>
                <Button
                  data-ocid="admin.ads.add_button"
                  onClick={openAddAd}
                  className="bg-gold/10 text-gold border border-gold/20 hover:bg-gold/20 text-sm"
                >
                  <Plus className="w-4 h-4 mr-1.5" /> Add Ad
                </Button>
              </div>
              {ads.length === 0 ? (
                <div
                  data-ocid="admin.ads.empty_state"
                  className="text-center py-12 text-foreground/40"
                >
                  <BarChart2 className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p>No ads yet. Add your first promotion!</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="border-gold/10 hover:bg-transparent">
                      <TableHead className="text-foreground/50">
                        Title
                      </TableHead>
                      <TableHead className="text-foreground/50">
                        Status
                      </TableHead>
                      <TableHead className="text-foreground/50">Date</TableHead>
                      <TableHead className="text-foreground/50 text-right">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ads.map((ad, i) => (
                      <TableRow
                        key={String(ad.id)}
                        data-ocid={`admin.ads.row.${i + 1}`}
                        className="border-gold/5"
                      >
                        <TableCell className="font-medium text-foreground/80">
                          {ad.title}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              ad.isActive
                                ? "bg-green-500/20 text-green-400 border-green-500/30 text-xs"
                                : "bg-foreground/10 text-foreground/40 text-xs"
                            }
                          >
                            {ad.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-foreground/40 text-sm">
                          {new Date(
                            Number(ad.createdAt) / 1000000,
                          ).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              data-ocid={`admin.ads.edit_button.${i + 1}`}
                              variant="ghost"
                              size="sm"
                              onClick={() => openEditAd(ad)}
                              className="text-gold/60 hover:text-gold h-7 w-7 p-0"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              data-ocid={`admin.ads.delete_button.${i + 1}`}
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteAd(ad.id)}
                              className="text-red-400/60 hover:text-red-400 h-7 w-7 p-0"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </TabsContent>

          {/* === DEPOSITS === */}
          <TabsContent value="deposits">
            <div className="glass-card rounded-xl overflow-hidden">
              <div className="p-4 border-b border-gold/10">
                <h2 className="font-semibold text-foreground/80">
                  Pending Deposits ({pendingDeposits.length})
                </h2>
              </div>
              {pendingDeposits.length === 0 ? (
                <div
                  data-ocid="admin.deposits.empty_state"
                  className="text-center py-12 text-foreground/40"
                >
                  <Wallet className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p>No pending deposits</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="border-gold/10 hover:bg-transparent">
                      <TableHead className="text-foreground/50">User</TableHead>
                      <TableHead className="text-foreground/50">
                        Currency
                      </TableHead>
                      <TableHead className="text-foreground/50">
                        Amount
                      </TableHead>
                      <TableHead className="text-foreground/50">
                        TX Hash
                      </TableHead>
                      <TableHead className="text-foreground/50">Date</TableHead>
                      <TableHead className="text-foreground/50 text-right">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingDeposits.map((d, i) => (
                      <TableRow
                        key={String(d.id)}
                        data-ocid={`admin.deposits.row.${i + 1}`}
                        className="border-gold/5"
                      >
                        <TableCell className="font-medium text-foreground/80">
                          {d.username}
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">
                            {d.currency}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-foreground/70">
                          {d.amount}
                        </TableCell>
                        <TableCell className="text-foreground/40 text-xs font-mono max-w-[120px] truncate">
                          {d.txHash}
                        </TableCell>
                        <TableCell className="text-foreground/40 text-sm">
                          {new Date(
                            Number(d.createdAt) / 1000000,
                          ).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <ApproveRejectRow
                            onApprove={async () => {
                              try {
                                await approveDeposit.mutateAsync(d.id);
                                toast.success("Deposit approved");
                              } catch {
                                toast.error("Failed");
                              }
                            }}
                            onReject={async () => {
                              try {
                                await rejectDeposit.mutateAsync(d.id);
                                toast.success("Deposit rejected");
                              } catch {
                                toast.error("Failed");
                              }
                            }}
                            isPending={
                              approveDeposit.isPending ||
                              rejectDeposit.isPending
                            }
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </TabsContent>

          {/* === WITHDRAWALS === */}
          <TabsContent value="withdrawals">
            <div className="glass-card rounded-xl overflow-hidden">
              <div className="p-4 border-b border-gold/10">
                <h2 className="font-semibold text-foreground/80">
                  Pending Withdrawals ({pendingWithdrawals.length})
                </h2>
              </div>
              {pendingWithdrawals.length === 0 ? (
                <div
                  data-ocid="admin.withdrawals.empty_state"
                  className="text-center py-12 text-foreground/40"
                >
                  <Wallet className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p>No pending withdrawals</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="border-gold/10 hover:bg-transparent">
                      <TableHead className="text-foreground/50">User</TableHead>
                      <TableHead className="text-foreground/50">
                        Amount
                      </TableHead>
                      <TableHead className="text-foreground/50">
                        Currency
                      </TableHead>
                      <TableHead className="text-foreground/50">
                        Wallet
                      </TableHead>
                      <TableHead className="text-foreground/50">Date</TableHead>
                      <TableHead className="text-foreground/50 text-right">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingWithdrawals.map((w, i) => (
                      <TableRow
                        key={String(w.id)}
                        data-ocid={`admin.withdrawals.row.${i + 1}`}
                        className="border-gold/5"
                      >
                        <TableCell className="font-medium text-foreground/80">
                          {w.username}
                        </TableCell>
                        <TableCell className="text-gold font-mono">
                          ${(Number(w.amount) / 1000).toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">
                            {w.currency}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-foreground/40 text-xs font-mono max-w-[120px] truncate">
                          {w.walletAddress}
                        </TableCell>
                        <TableCell className="text-foreground/40 text-sm">
                          {new Date(
                            Number(w.createdAt) / 1000000,
                          ).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <ApproveRejectRow
                            onApprove={async () => {
                              try {
                                await approveWithdrawal.mutateAsync(w.id);
                                toast.success("Withdrawal approved");
                              } catch {
                                toast.error("Failed");
                              }
                            }}
                            onReject={async () => {
                              try {
                                await rejectWithdrawal.mutateAsync(w.id);
                                toast.success("Withdrawal rejected");
                              } catch {
                                toast.error("Failed");
                              }
                            }}
                            isPending={
                              approveWithdrawal.isPending ||
                              rejectWithdrawal.isPending
                            }
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </TabsContent>

          {/* === EARN APPROVALS === */}
          <TabsContent value="earns">
            <div className="glass-card rounded-xl overflow-hidden">
              <div className="p-4 border-b border-gold/10">
                <h2 className="font-semibold text-foreground/80">
                  Pending Earn Approvals ({pendingEarns.length})
                </h2>
              </div>
              {pendingEarns.length === 0 ? (
                <div
                  data-ocid="admin.earns.empty_state"
                  className="text-center py-12 text-foreground/40"
                >
                  <Coins className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p>No pending earn records</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="border-gold/10 hover:bg-transparent">
                      <TableHead className="text-foreground/50">User</TableHead>
                      <TableHead className="text-foreground/50">Type</TableHead>
                      <TableHead className="text-foreground/50">
                        Content
                      </TableHead>
                      <TableHead className="text-foreground/50">
                        Amount
                      </TableHead>
                      <TableHead className="text-foreground/50">Date</TableHead>
                      <TableHead className="text-foreground/50 text-right">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingEarns.map((e, i) => (
                      <TableRow
                        key={String(e.id)}
                        data-ocid={`admin.earns.row.${i + 1}`}
                        className="border-gold/5"
                      >
                        <TableCell className="font-medium text-foreground/80">
                          {e.username}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              e.taskType.toString().includes("watchVideo")
                                ? "bg-purple-500/20 text-purple-400 border-purple-500/30 text-xs"
                                : "bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs"
                            }
                          >
                            {e.taskType.toString().includes("watchVideo")
                              ? "Watch"
                              : "Write"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-foreground/40 text-xs max-w-[150px] truncate">
                          {e.contentId}
                        </TableCell>
                        <TableCell className="text-gold font-mono text-sm">
                          {(Number(e.amount) / 1000).toFixed(2)} USDT
                        </TableCell>
                        <TableCell className="text-foreground/40 text-sm">
                          {new Date(
                            Number(e.createdAt) / 1000000,
                          ).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <ApproveRejectRow
                            onApprove={async () => {
                              try {
                                await approveEarn.mutateAsync(e.id);
                                toast.success("Earn approved");
                              } catch {
                                toast.error("Failed");
                              }
                            }}
                            onReject={async () => {
                              try {
                                await rejectEarn.mutateAsync(e.id);
                                toast.success("Earn rejected");
                              } catch {
                                toast.error("Failed");
                              }
                            }}
                            isPending={
                              approveEarn.isPending || rejectEarn.isPending
                            }
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </TabsContent>

          {/* === SETTINGS === */}
          <TabsContent value="settings">
            <div className="glass-card rounded-xl p-6 max-w-lg">
              <h2 className="font-semibold text-foreground/80 mb-4">
                Admin Settings
              </h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 rounded-lg bg-gold/5 border border-gold/10">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold to-orange-brand flex items-center justify-center text-navy font-bold text-sm">
                    SK
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">
                      sandeepkarna321
                    </div>
                    <div className="text-xs text-foreground/40">
                      Administrator
                    </div>
                  </div>
                </div>
                <div className="text-sm text-foreground/50 space-y-1">
                  <div>
                    Website:{" "}
                    <span className="text-gold/70">Sandeepkarnalive.com</span>
                  </div>
                  <div>
                    Role: <span className="text-gold/70">Admin</span>
                  </div>
                  <div>
                    Features: <span className="text-gold/70">Full Control</span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="border-red-500/30 text-red-400 hover:bg-red-500/10 w-full"
                >
                  <LogOut className="w-4 h-4 mr-2" /> Sign Out
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Vlog Modal */}
      <Dialog open={vlogOpen} onOpenChange={setVlogOpen}>
        <DialogContent
          data-ocid="admin.vlog.dialog"
          className="bg-navy-card border-gold/20 text-foreground max-w-lg"
        >
          <DialogHeader>
            <DialogTitle className="font-display gold-gradient">
              {editVlogId ? "Edit Post" : "Add New Post"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-foreground/60 text-xs">Title</Label>
              <Input
                data-ocid="admin.vlog.input"
                value={vlogForm.title}
                onChange={(e) =>
                  setVlogForm({ ...vlogForm, title: e.target.value })
                }
                className="bg-navy border-gold/20 text-foreground"
                placeholder="Video title"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-foreground/60 text-xs">Description</Label>
              <Textarea
                data-ocid="admin.vlog.textarea"
                value={vlogForm.description}
                onChange={(e) =>
                  setVlogForm({ ...vlogForm, description: e.target.value })
                }
                className="bg-navy border-gold/20 text-foreground resize-none"
                rows={3}
                placeholder="Short description..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-foreground/60 text-xs">Video URL</Label>
                <Input
                  data-ocid="admin.vlog.input"
                  value={vlogForm.videoUrl}
                  onChange={(e) =>
                    setVlogForm({ ...vlogForm, videoUrl: e.target.value })
                  }
                  className="bg-navy border-gold/20 text-foreground"
                  placeholder="YouTube URL"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-foreground/60 text-xs">
                  Thumbnail URL
                </Label>
                <Input
                  data-ocid="admin.vlog.input"
                  value={vlogForm.thumbnailUrl}
                  onChange={(e) =>
                    setVlogForm({ ...vlogForm, thumbnailUrl: e.target.value })
                  }
                  className="bg-navy border-gold/20 text-foreground"
                  placeholder="Image URL"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-foreground/60 text-xs">Category</Label>
              <Select
                value={String(vlogForm.category)}
                onValueChange={(v) =>
                  setVlogForm({ ...vlogForm, category: v as VlogCategory })
                }
              >
                <SelectTrigger
                  data-ocid="admin.vlog.select"
                  className="bg-navy border-gold/20 text-foreground"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-navy-card border-gold/20">
                  <SelectItem value={VlogCategory.vlog}>Vlog</SelectItem>
                  <SelectItem value={VlogCategory.trading}>Trading</SelectItem>
                  <SelectItem value={VlogCategory.promo}>Promo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="ghost"
              data-ocid="admin.vlog.cancel_button"
              onClick={() => setVlogOpen(false)}
              className="text-foreground/50"
            >
              <X className="w-4 h-4 mr-1" /> Cancel
            </Button>
            <Button
              data-ocid="admin.vlog.save_button"
              onClick={handleVlogSubmit}
              disabled={createVlog.isPending || updateVlog.isPending}
              className="bg-gradient-to-r from-gold to-orange-brand text-navy font-bold"
            >
              {(createVlog.isPending || updateVlog.isPending) && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              {editVlogId ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Announcement Modal */}
      <Dialog open={annOpen} onOpenChange={setAnnOpen}>
        <DialogContent
          data-ocid="admin.announcement.dialog"
          className="bg-navy-card border-gold/20 text-foreground max-w-lg"
        >
          <DialogHeader>
            <DialogTitle className="font-display gold-gradient">
              {editAnnId ? "Edit Announcement" : "Add Announcement"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-foreground/60 text-xs">Title</Label>
              <Input
                data-ocid="admin.announcement.input"
                value={annForm.title}
                onChange={(e) =>
                  setAnnForm({ ...annForm, title: e.target.value })
                }
                className="bg-navy border-gold/20 text-foreground"
                placeholder="Announcement title"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-foreground/60 text-xs">Content</Label>
              <Textarea
                data-ocid="admin.announcement.textarea"
                value={annForm.content}
                onChange={(e) =>
                  setAnnForm({ ...annForm, content: e.target.value })
                }
                className="bg-navy border-gold/20 text-foreground resize-none"
                rows={4}
                placeholder="Content..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="ghost"
              data-ocid="admin.announcement.cancel_button"
              onClick={() => setAnnOpen(false)}
              className="text-foreground/50"
            >
              <X className="w-4 h-4 mr-1" /> Cancel
            </Button>
            <Button
              data-ocid="admin.announcement.save_button"
              onClick={handleAnnSubmit}
              disabled={createAnn.isPending || updateAnn.isPending}
              className="bg-gradient-to-r from-gold to-orange-brand text-navy font-bold"
            >
              {(createAnn.isPending || updateAnn.isPending) && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              {editAnnId ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Ad Modal */}
      <Dialog open={adOpen} onOpenChange={setAdOpen}>
        <DialogContent
          data-ocid="admin.ads.dialog"
          className="bg-navy-card border-gold/20 text-foreground max-w-lg"
        >
          <DialogHeader>
            <DialogTitle className="font-display gold-gradient">
              {editAdId ? "Edit Ad" : "Add Ad/Promotion"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-foreground/60 text-xs">Title</Label>
              <Input
                data-ocid="admin.ads.input"
                value={adForm.title}
                onChange={(e) =>
                  setAdForm({ ...adForm, title: e.target.value })
                }
                className="bg-navy border-gold/20 text-foreground"
                placeholder="Ad title"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-foreground/60 text-xs">Description</Label>
              <Textarea
                data-ocid="admin.ads.textarea"
                value={adForm.description}
                onChange={(e) =>
                  setAdForm({ ...adForm, description: e.target.value })
                }
                className="bg-navy border-gold/20 text-foreground resize-none"
                rows={2}
                placeholder="Short description"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-foreground/60 text-xs">Image URL</Label>
                <Input
                  data-ocid="admin.ads.input"
                  value={adForm.imageUrl}
                  onChange={(e) =>
                    setAdForm({ ...adForm, imageUrl: e.target.value })
                  }
                  className="bg-navy border-gold/20 text-foreground"
                  placeholder="https://..."
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-foreground/60 text-xs">Link URL</Label>
                <Input
                  data-ocid="admin.ads.input"
                  value={adForm.linkUrl}
                  onChange={(e) =>
                    setAdForm({ ...adForm, linkUrl: e.target.value })
                  }
                  className="bg-navy border-gold/20 text-foreground"
                  placeholder="https://..."
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Switch
                data-ocid="admin.ads.switch"
                checked={adForm.isActive}
                onCheckedChange={(v) => setAdForm({ ...adForm, isActive: v })}
              />
              <Label className="text-foreground/60 text-sm">
                Active (show on site)
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="ghost"
              data-ocid="admin.ads.cancel_button"
              onClick={() => setAdOpen(false)}
              className="text-foreground/50"
            >
              <X className="w-4 h-4 mr-1" /> Cancel
            </Button>
            <Button
              data-ocid="admin.ads.save_button"
              onClick={handleAdSubmit}
              disabled={createAd.isPending || updateAd.isPending}
              className="bg-gradient-to-r from-gold to-orange-brand text-navy font-bold"
            >
              {(createAd.isPending || updateAd.isPending) && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              {editAdId ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
