import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  FileText,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useAllPosts, useDeletePost } from '@/hooks/useBlogPosts';
import { Skeleton } from '@/components/ui/skeleton';
import DashboardLayout from '@/components/layouts/DashboardLayout';

export default function AdminDashboard() {
  const { user, isAdmin, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { data: posts, isLoading: postsLoading } = useAllPosts();
  const deletePost = useDeletePost();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Auth checks handled by ProtectedRoute

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    await deletePost.mutateAsync(id);
    setDeletingId(null);
  };

  if (authLoading || postsLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32 rounded-xl" />
            ))}
          </div>
          <Skeleton className="h-[400px] w-full rounded-xl" />
        </div>
      </DashboardLayout>
    );
  }

  // If logged in but not admin, show access denied

  const totalPosts = posts?.length || 0;
  const publishedPosts = posts?.filter((p) => p.published).length || 0;
  const draftPosts = totalPosts - publishedPosts;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Manage your blog content and view performance.
            </p>
          </div>
          <Button
            onClick={() => navigate('/admin/posts/new')}
            size="lg"
            className="shadow-lg hover:shadow-xl transition-all"
          >
            <Plus className="h-5 w-5 mr-2" />
            Create New Post
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="hover:border-primary/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalPosts}</div>
              <p className="text-xs text-muted-foreground">
                All time blog posts
              </p>
            </CardContent>
          </Card>
          <Card className="hover:border-green-500/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Published</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{publishedPosts}</div>
              <p className="text-xs text-muted-foreground">Live on the blog</p>
            </CardContent>
          </Card>
          <Card className="hover:border-orange-500/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Drafts</CardTitle>
              <Clock className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{draftPosts}</div>
              <p className="text-xs text-muted-foreground">Work in progress</p>
            </CardContent>
          </Card>
        </div>

        {/* Posts Table */}
        <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
          <div className="p-6 border-b bg-muted/30">
            <h3 className="font-semibold text-lg">Recent Posts</h3>
          </div>
          {posts && posts.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[400px]">Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {posts.map((post) => (
                  <TableRow key={post.id} className="group">
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <span
                          className="font-medium group-hover:text-primary transition-colors cursor-pointer"
                          onClick={() => navigate(`/admin/posts/${post.id}`)}
                        >
                          {post.title}
                        </span>
                        <span className="text-xs text-muted-foreground font-mono">
                          /{post.slug}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {post.category?.name ? (
                        <Badge variant="secondary" className="font-normal">
                          {post.category.name}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground text-sm">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {post.published ? (
                        <Badge className="bg-green-500/15 text-green-600 hover:bg-green-500/25 border-green-500/20 font-normal">
                          <Eye className="h-3 w-3 mr-1" />
                          Published
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="font-normal">
                          <EyeOff className="h-3 w-3 mr-1" />
                          Draft
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-muted-foreground">
                        {new Date(post.created_at).toLocaleDateString(
                          undefined,
                          {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          }
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => navigate(`/admin/posts/${post.id}`)}
                          className="h-8 w-8 hover:text-primary hover:bg-primary/10"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete post?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will
                                permanently delete the blog post "{post.title}".
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(post.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                disabled={deletingId === post.id}
                              >
                                {deletingId === post.id
                                  ? 'Deleting...'
                                  : 'Delete'}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="bg-muted/50 p-4 rounded-full mb-4">
                <FileText className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold">No posts yet</h3>
              <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                Get started by creating your first blog post. It will show up
                here.
              </p>
              <Button onClick={() => navigate('/admin/posts/new')}>
                <Plus className="h-4 w-4 mr-2" />
                Create your first post
              </Button>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
