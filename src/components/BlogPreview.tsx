import { Link } from 'react-router-dom';
import { Calendar, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePublishedPosts } from '@/hooks/useBlogPosts';
import { Skeleton } from '@/components/ui/skeleton';

export function BlogPreview() {
  const { data: posts, isLoading } = usePublishedPosts();
  const recentPosts = posts?.slice(0, 3) || [];

  return (
    <section id="blog" className="relative bg-transparent py-20 md:py-32 border-t border-border/40">
      <div className="container mx-auto px-6 md:px-12 lg:px-24">

        {/* Header — same style as /blog page */}
        <div className="mb-10 max-w-2xl">
          <p className="mb-4 font-mono text-xs font-semibold uppercase tracking-[0.22em] text-primary">
            Writing Log
          </p>
          <h2 className="font-serif text-5xl font-bold tracking-tight text-foreground sm:text-6xl">
            Coming Soon
          </h2>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="rounded-[2rem] border border-border/60 bg-card p-6 sm:p-10 shadow-sm">
            <Skeleton className="h-8 w-8 mb-6" />
            <Skeleton className="h-6 w-3/4 mb-4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ) : recentPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentPosts.map((post) => (
              <article
                key={post.id}
                className="group h-full p-6 bg-card rounded-[2rem] border border-border/60 hover:border-primary/50 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-center gap-2 text-sm font-mono text-muted-foreground mb-3">
                  <Calendar className="h-4 w-4" strokeWidth={1.5} />
                  {new Date(post.published_at || post.created_at).toLocaleDateString('id-ID', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </div>
                <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                  <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                </h3>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                  {post.excerpt || ''}
                </p>
                <Link
                  to={`/blog/${post.slug}`}
                  className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                >
                  Baca selengkapnya <ArrowRight className="h-4 w-4" />
                </Link>
              </article>
            ))}
          </div>
        ) : (
          /* Empty state — matches /blog page style */
          <div className="rounded-[2rem] border border-border/60 bg-card p-6 sm:p-10 shadow-sm">
            <Calendar className="size-8 text-primary" strokeWidth={1.5} />
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
              I'm preparing short notes on web development, system design, and lessons from shipping real projects.
            </p>
            <Button asChild className="mt-8 rounded-full px-6 transition-transform hover:-translate-y-0.5 active:scale-95">
              <Link to="/projects" className="flex items-center gap-2">
                View Case Studies
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        )}

        {/* Link to full blog — only show if there are posts */}
        {recentPosts.length > 0 && (
          <div className="mt-10">
            <Button variant="outline" asChild className="rounded-full transition-transform hover:-translate-y-0.5 active:scale-95">
              <Link to="/blog" className="flex items-center gap-2">
                Lihat Semua Tulisan
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
