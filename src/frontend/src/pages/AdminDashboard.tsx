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
  Edit,
  Loader2,
  LogOut,
  Megaphone,
  Plus,
  Settings,
  Trash2,
  TrendingUp,
  Video,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { VlogCategory } from "../backend.d";
import {
  useAnnouncements,
  useCreateAnnouncement,
  useCreateVlogPost,
  useDeleteAnnouncement,
  useDeleteVlogPost,
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

const emptyVlog: VlogForm = {
  title: "",
  description: "",
  videoUrl: "",
  thumbnailUrl: "",
  category: VlogCategory.vlog,
};
const emptyAnnouncement: AnnouncementForm = { title: "", content: "" };

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

  const createVlog = useCreateVlogPost();
  const updateVlog = useUpdateVlogPost();
  const deleteVlog = useDeleteVlogPost();
  const createAnn = useCreateAnnouncement();
  const updateAnn = useUpdateAnnouncement();
  const deleteAnn = useDeleteAnnouncement();

  // Vlog modal
  const [vlogOpen, setVlogOpen] = useState(false);
  const [vlogForm, setVlogForm] = useState<VlogForm>(emptyVlog);
  const [editVlogId, setEditVlogId] = useState<bigint | null>(null);

  // Announcement modal
  const [annOpen, setAnnOpen] = useState(false);
  const [annForm, setAnnForm] = useState<AnnouncementForm>(emptyAnnouncement);
  const [editAnnId, setEditAnnId] = useState<bigint | null>(null);

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
        toast.success("Announcement updated!");
      } else {
        await createAnn.mutateAsync(annForm);
        toast.success("Announcement created!");
      }
      setAnnOpen(false);
    } catch {
      toast.error("Failed to save announcement");
    }
  };
  const handleDeleteAnn = async (id: bigint) => {
    try {
      await deleteAnn.mutateAsync(id);
      toast.success("Announcement deleted");
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Posts", value: posts.length, icon: Video },
            {
              label: "Announcements",
              value: announcements.length,
              icon: Megaphone,
            },
            { label: "Categories", value: 3, icon: Settings },
            { label: "Status", value: "Active", icon: TrendingUp },
          ].map((s) => (
            <div
              key={s.label}
              className="glass-card rounded-xl p-4 flex items-center gap-3"
            >
              <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center">
                <s.icon className="w-4 h-4 text-gold" />
              </div>
              <div>
                <div className="font-bold text-lg text-foreground">
                  {s.value}
                </div>
                <div className="text-xs text-foreground/40">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="posts">
          <TabsList className="bg-navy-card border border-gold/15 mb-6">
            <TabsTrigger
              value="posts"
              data-ocid="admin.posts.tab"
              className="data-[state=active]:bg-gold/10 data-[state=active]:text-gold"
            >
              <Video className="w-4 h-4 mr-2" /> Vlog Posts
            </TabsTrigger>
            <TabsTrigger
              value="announcements"
              data-ocid="admin.announcements.tab"
              className="data-[state=active]:bg-gold/10 data-[state=active]:text-gold"
            >
              <Megaphone className="w-4 h-4 mr-2" /> Announcements
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              data-ocid="admin.settings.tab"
              className="data-[state=active]:bg-gold/10 data-[state=active]:text-gold"
            >
              <Settings className="w-4 h-4 mr-2" /> Settings
            </TabsTrigger>
          </TabsList>

          {/* Vlog Posts Tab */}
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
                              className="text-gold/60 hover:text-gold hover:bg-gold/5 h-7 w-7 p-0"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              data-ocid={`admin.vlog.delete_button.${i + 1}`}
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteVlog(post.id)}
                              className="text-red-400/60 hover:text-red-400 hover:bg-red-500/5 h-7 w-7 p-0"
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

          {/* Announcements Tab */}
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
                  <Plus className="w-4 h-4 mr-1.5" /> Add Announcement
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
                        className="border-gold/5 hover:bg-gold/3"
                      >
                        <TableCell className="text-foreground/80 font-medium">
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
                              className="text-gold/60 hover:text-gold hover:bg-gold/5 h-7 w-7 p-0"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              data-ocid={`admin.announcement.delete_button.${i + 1}`}
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteAnn(ann.id)}
                              className="text-red-400/60 hover:text-red-400 hover:bg-red-500/5 h-7 w-7 p-0"
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

          {/* Settings Tab */}
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
                data-ocid="admin.vlog.title_input"
                value={vlogForm.title}
                onChange={(e) =>
                  setVlogForm({ ...vlogForm, title: e.target.value })
                }
                className="bg-navy border-gold/20 focus:border-gold/40 text-foreground"
                placeholder="Video title"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-foreground/60 text-xs">Description</Label>
              <Textarea
                data-ocid="admin.vlog.description_textarea"
                value={vlogForm.description}
                onChange={(e) =>
                  setVlogForm({ ...vlogForm, description: e.target.value })
                }
                className="bg-navy border-gold/20 focus:border-gold/40 text-foreground resize-none"
                rows={3}
                placeholder="Short description..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-foreground/60 text-xs">Video URL</Label>
                <Input
                  data-ocid="admin.vlog.video_url_input"
                  value={vlogForm.videoUrl}
                  onChange={(e) =>
                    setVlogForm({ ...vlogForm, videoUrl: e.target.value })
                  }
                  className="bg-navy border-gold/20 focus:border-gold/40 text-foreground"
                  placeholder="YouTube URL"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-foreground/60 text-xs">
                  Thumbnail URL
                </Label>
                <Input
                  data-ocid="admin.vlog.thumbnail_input"
                  value={vlogForm.thumbnailUrl}
                  onChange={(e) =>
                    setVlogForm({ ...vlogForm, thumbnailUrl: e.target.value })
                  }
                  className="bg-navy border-gold/20 focus:border-gold/40 text-foreground"
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
                  data-ocid="admin.vlog.category_select"
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
              {createVlog.isPending || updateVlog.isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : null}
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
                data-ocid="admin.announcement.title_input"
                value={annForm.title}
                onChange={(e) =>
                  setAnnForm({ ...annForm, title: e.target.value })
                }
                className="bg-navy border-gold/20 focus:border-gold/40 text-foreground"
                placeholder="Announcement title"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-foreground/60 text-xs">Content</Label>
              <Textarea
                data-ocid="admin.announcement.content_textarea"
                value={annForm.content}
                onChange={(e) =>
                  setAnnForm({ ...annForm, content: e.target.value })
                }
                className="bg-navy border-gold/20 focus:border-gold/40 text-foreground resize-none"
                rows={4}
                placeholder="Announcement content..."
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
              {createAnn.isPending || updateAnn.isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : null}
              {editAnnId ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
