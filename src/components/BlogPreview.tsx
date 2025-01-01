import { Link } from "react-router-dom";
import { Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/ScrollReveal";
import { ParallaxBackground } from "@/components/ParallaxBackground";
import { usePublishedPosts } from "@/hooks/useBlogPosts";
import { Skeleton } from "@/components/ui/skeleton";

export function BlogPreview() {
  const { data: posts, isLoading } = usePublishedPosts();
  const recentPosts = posts?.slice(0, 3) || [];

  return (
    <section id="blog" className="py-20 md:py-32 relative overflow-hidden">
      <ParallaxBackground variant="gradient" />
      <div className="container mx-auto px-4 relative z-10">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Blog</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Tulisan tentang coding, belajar, dan hal-hal yang lagi gue explore
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {isLoading ? (
            [1, 2, 3].map((i) => (
              <div key={i} className="p-6 bg-card rounded-xl border border-border">
                <Skeleton className="h-4 w-24 mb-3" />
                <Skeleton className="h-6 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-4" />
                <Skeleton className="h-4 w-20" />
              </div>
            ))
          ) : recentPosts.length > 0 ? (
            recentPosts.map((post, index) => (
              <ScrollReveal key={post.id} delay={index * 100}>
                <article className="group h-full p-6 bg-card rounded-xl border border-border hover:border-primary/50 shadow-card hover:shadow-soft transition-all">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                    <Calendar className="h-4 w-4" />
                    {new Date(post.published_at || post.created_at).toLocaleDateString("id-ID", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </div>

                  <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                  </h3>

                  <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                    {post.excerpt || ""}
                  </p>

                  <Link
                    to={`/blog/${post.slug}`}
                    className="inline-flex items-center text-sm font-medium text-primary hover:underline"
                  >
                    Baca selengkapnya <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </article>
              </ScrollReveal>
            ))
          ) : (
            <div className="col-span-3 text-center py-8 text-muted-foreground">
              Belum ada blog post
            </div>
          )}
        </div>

        <ScrollReveal delay={300}>
          <div className="text-center mt-12">
            <Button variant="outline" asChild>
              <Link to="/blog" className="flex items-center gap-2">
                Lihat Semua Tulisan
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
