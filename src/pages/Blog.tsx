import { Link } from "react-router-dom";
import { Calendar, ArrowRight, Tag } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { usePublishedPosts } from "@/hooks/useBlogPosts";

export default function Blog() {
  const { data: posts, isLoading, error } = usePublishedPosts();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold mb-4">
              <span className="text-gradient">Blog</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-12">
              Thoughts on coding, learning, and building things.
            </p>

            {isLoading ? (
              <div className="space-y-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-6 bg-card rounded-xl border border-border">
                    <Skeleton className="h-4 w-32 mb-3" />
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full mb-4" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Failed to load posts</p>
              </div>
            ) : posts && posts.length > 0 ? (
              <div className="space-y-8">
                {posts.map((post) => (
                  <article
                    key={post.id}
                    className="group p-6 bg-card rounded-xl border border-border hover:border-primary/50 shadow-card hover:shadow-soft transition-all"
                  >
                    {post.featured_image && (
                      <Link to={`/blog/${post.slug}`}>
                        <img
                          src={post.featured_image}
                          alt={post.title}
                          className="w-full h-48 object-cover rounded-lg mb-4"
                        />
                      </Link>
                    )}
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(post.published_at || post.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                      {post.category && (
                        <>
                          <span>•</span>
                          <Badge variant="secondary">{post.category.name}</Badge>
                        </>
                      )}
                    </div>

                    <h2 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                      <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                    </h2>

                    {post.excerpt && (
                      <p className="text-muted-foreground mb-4">{post.excerpt}</p>
                    )}

                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.map((tag) => (
                          <Badge key={tag.id} variant="outline" className="text-xs">
                            <Tag className="h-3 w-3 mr-1" />
                            {tag.name}
                          </Badge>
                        ))}
                      </div>
                    )}

                    <Link
                      to={`/blog/${post.slug}`}
                      className="inline-flex items-center text-sm font-medium text-primary hover:underline"
                    >
                      Read more <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </article>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border rounded-xl bg-muted/30">
                <p className="text-muted-foreground">No blog posts yet</p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
