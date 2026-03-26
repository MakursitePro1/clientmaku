import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FileText, Plus, Edit, Trash2, Eye, Search, ArrowLeft,
  Save, Image, Tag, Clock, User, Calendar, Globe, FileEdit
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  featured_image: string;
  tags: string[];
  read_time: string;
  status: string;
  meta_title: string;
  meta_description: string;
  created_at: string;
  updated_at: string;
  published_at: string | null;
}

const CATEGORIES = [
  "General", "Development", "Design", "Security", "Marketing",
  "Productivity", "Tutorial", "News", "Tips & Tricks"
];

const emptyPost: Omit<BlogPost, "id" | "created_at" | "updated_at"> = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  category: "General",
  author: "Cyber Venom Team",
  featured_image: "",
  tags: [],
  read_time: "5 min read",
  status: "draft",
  meta_title: "",
  meta_description: "",
  published_at: null,
};

export default function AdminBlog() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [view, setView] = useState<"list" | "editor">("list");
  const [editingPost, setEditingPost] = useState<Partial<BlogPost>>(emptyPost);
  const [saving, setSaving] = useState(false);
  const [tagsInput, setTagsInput] = useState("");

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) setPosts(data as unknown as BlogPost[]);
    setLoading(false);
  };

  const generateSlug = (title: string) =>
    title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const openEditor = (post?: BlogPost) => {
    if (post) {
      setEditingPost(post);
      setTagsInput((post.tags || []).join(", "));
    } else {
      setEditingPost({ ...emptyPost });
      setTagsInput("");
    }
    setView("editor");
  };

  const handleSave = async () => {
    if (!editingPost.title?.trim()) {
      toast({ title: "Error", description: "Title is required.", variant: "destructive" });
      return;
    }

    setSaving(true);
    const slug = editingPost.slug?.trim() || generateSlug(editingPost.title);
    const tags = tagsInput.split(",").map((t) => t.trim()).filter(Boolean);
    const now = new Date().toISOString();

    const postData = {
      title: editingPost.title,
      slug,
      excerpt: editingPost.excerpt || "",
      content: editingPost.content || "",
      category: editingPost.category || "General",
      author: editingPost.author || "Cyber Venom Team",
      featured_image: editingPost.featured_image || "",
      tags,
      read_time: editingPost.read_time || "5 min read",
      status: editingPost.status || "draft",
      meta_title: editingPost.meta_title || "",
      meta_description: editingPost.meta_description || "",
      published_at: editingPost.status === "published"
        ? editingPost.published_at || now
        : null,
    };

    let error;
    if (editingPost.id) {
      ({ error } = await supabase
        .from("blog_posts")
        .update(postData as any)
        .eq("id", editingPost.id));
    } else {
      ({ error } = await supabase
        .from("blog_posts")
        .insert({ ...postData, created_by: user?.id } as any));
    }

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Saved!", description: `Post "${editingPost.title}" saved successfully.` });
      setView("list");
      fetchPosts();
    }
    setSaving(false);
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    const { error } = await supabase.from("blog_posts").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Deleted", description: `"${title}" has been deleted.` });
      fetchPosts();
    }
  };

  const updateField = (field: string, value: any) =>
    setEditingPost((prev) => ({ ...prev, [field]: value }));

  const filtered = posts.filter((p) => {
    const matchSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || p.status === filterStatus;
    return matchSearch && matchStatus;
  });

  // ─── Editor View ────────────────────────────────────
  if (view === "editor") {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => setView("list")}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-foreground">
                {editingPost.id ? "Edit Post" : "Create New Post"}
              </h1>
              <p className="text-xs text-muted-foreground">Fill in all post details below</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Select
              value={editingPost.status || "draft"}
              onValueChange={(v) => updateField("status", v)}
            >
              <SelectTrigger className="w-[130px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleSave} disabled={saving} className="gap-2">
              <Save className="w-4 h-4" />
              {saving ? "Saving..." : "Save Post"}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <FileEdit className="w-4 h-4 text-primary" /> Post Content
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Title *</label>
                  <Input
                    value={editingPost.title || ""}
                    onChange={(e) => {
                      updateField("title", e.target.value);
                      if (!editingPost.id) updateField("slug", generateSlug(e.target.value));
                    }}
                    placeholder="Enter post title..."
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Globe className="w-3.5 h-3.5 text-muted-foreground" /> Slug (URL)
                  </label>
                  <Input
                    value={editingPost.slug || ""}
                    onChange={(e) => updateField("slug", e.target.value)}
                    placeholder="post-url-slug"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Excerpt / Summary</label>
                  <Textarea
                    value={editingPost.excerpt || ""}
                    onChange={(e) => updateField("excerpt", e.target.value)}
                    placeholder="Short description of the post..."
                    rows={3}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Content (HTML supported)</label>
                  <Textarea
                    value={editingPost.content || ""}
                    onChange={(e) => updateField("content", e.target.value)}
                    placeholder="Write your post content here... HTML tags are supported."
                    rows={16}
                    className="font-mono text-sm"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Category & Author */}
            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Tag className="w-4 h-4 text-primary" /> Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Category</label>
                  <Select
                    value={editingPost.category || "General"}
                    onValueChange={(v) => updateField("category", v)}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-muted-foreground" /> Author
                  </label>
                  <Input
                    value={editingPost.author || ""}
                    onChange={(e) => updateField("author", e.target.value)}
                    placeholder="Author name"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-muted-foreground" /> Read Time
                  </label>
                  <Input
                    value={editingPost.read_time || ""}
                    onChange={(e) => updateField("read_time", e.target.value)}
                    placeholder="e.g. 5 min read"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Tag className="w-3.5 h-3.5 text-muted-foreground" /> Tags
                  </label>
                  <Input
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="tag1, tag2, tag3"
                  />
                  <p className="text-[10px] text-muted-foreground">Separate with commas</p>
                </div>
              </CardContent>
            </Card>

            {/* Featured Image */}
            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Image className="w-4 h-4 text-primary" /> Featured Image
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Input
                  value={editingPost.featured_image || ""}
                  onChange={(e) => updateField("featured_image", e.target.value)}
                  placeholder="Image URL..."
                />
                {editingPost.featured_image && (
                  <img
                    src={editingPost.featured_image}
                    alt="Preview"
                    className="w-full h-32 object-cover rounded-lg border"
                  />
                )}
              </CardContent>
            </Card>

            {/* SEO */}
            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Search className="w-4 h-4 text-primary" /> SEO Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Meta Title</label>
                  <Input
                    value={editingPost.meta_title || ""}
                    onChange={(e) => updateField("meta_title", e.target.value)}
                    placeholder="SEO title (max 60 chars)"
                    maxLength={60}
                  />
                  <p className="text-[10px] text-muted-foreground">
                    {(editingPost.meta_title || "").length}/60
                  </p>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Meta Description</label>
                  <Textarea
                    value={editingPost.meta_description || ""}
                    onChange={(e) => updateField("meta_description", e.target.value)}
                    placeholder="SEO description (max 160 chars)"
                    maxLength={160}
                    rows={3}
                  />
                  <p className="text-[10px] text-muted-foreground">
                    {(editingPost.meta_description || "").length}/160
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // ─── List View ──────────────────────────────────────
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Blog Management</h1>
          <p className="text-sm text-muted-foreground">
            Create, edit, and manage blog posts ({posts.length} total)
          </p>
        </div>
        <Button onClick={() => openEditor()} className="gap-2">
          <Plus className="w-4 h-4" /> New Post
        </Button>
      </div>

      {/* Filters */}
      <Card className="border-border/50">
        <CardContent className="pt-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search posts..."
                className="pl-10"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Posts List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <Card className="border-border/50">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <FileText className="w-12 h-12 text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-semibold text-foreground">No posts found</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {posts.length === 0 ? "Create your first blog post to get started." : "Try adjusting your search or filter."}
            </p>
            {posts.length === 0 && (
              <Button onClick={() => openEditor()} className="mt-4 gap-2">
                <Plus className="w-4 h-4" /> Create First Post
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {filtered.map((post, i) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                <Card className="border-border/50 hover:border-primary/30 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                      {/* Thumbnail */}
                      {post.featured_image && (
                        <img
                          src={post.featured_image}
                          alt={post.title}
                          className="w-full sm:w-24 h-20 object-cover rounded-lg border shrink-0"
                        />
                      )}
                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="font-semibold text-foreground text-sm line-clamp-1">{post.title}</h3>
                            <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{post.excerpt}</p>
                          </div>
                          <Badge
                            variant={post.status === "published" ? "default" : "secondary"}
                            className="text-[10px] shrink-0"
                          >
                            {post.status}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <User className="w-3 h-3" /> {post.author}
                          </span>
                          <span className="flex items-center gap-1">
                            <Tag className="w-3 h-3" /> {post.category}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {post.read_time}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(post.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      {/* Actions */}
                      <div className="flex items-center gap-1 shrink-0">
                        {post.status === "published" && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => window.open(`/blog/${post.slug}`, "_blank")}
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => openEditor(post)}
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => handleDelete(post.id, post.title)}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
