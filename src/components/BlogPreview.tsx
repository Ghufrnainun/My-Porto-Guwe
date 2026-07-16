import { Link } from 'react-router-dom';
import { Calendar, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollReveal } from '@/components/ScrollReveal';
import { usePublishedPosts } from '@/hooks/useBlogPosts';
import { Skeleton } from '@/components/ui/skeleton';

export function BlogPreview() {
  const { data: posts, isLoading } = usePublishedPosts();
  const recentPosts = posts?.slice(0, 3) || [];

  return (
    <section id="blog" className="relative bg-transparent py-16 md:py-24">
      <div className="container relative z-10 mx-auto px-6 md:px-12 lg:px-24">
        <ScrollReveal>
          <div className="mb-10 grid gap-5 md:grid-cols-[0.75fr_1fr] md:items-end">
            <div>
              <p className="mb-4 font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-primary">
                Writing log
              </p>
              <h2 className="font-serif text-4xl font-bold leading-tight text-foreground md:text-5xl">
              Blog
            </h2>
            </div>
            <p className="max-w-xl text-base leading-8 text-muted-foreground md:text-lg">
              Tulisan tentang coding, belajar, dan hal-hal yang lagi gue explore
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {isLoading ? (
            [1, 2, 3].map((i) => (
              <div
                key={i}
                className="p-6 bg-card rounded-xl border border-border"
              >
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
                  <div className="flex items-center gap-2 text-sm font-mono text-muted-foreground mb-3">
                    <Calendar className="h-4 w-4" />
                    {new Date(
                      post.published_at || post.created_at
                    ).toLocaleDateString('id-ID', {
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
                    className="inline-flex items-center text-sm font-medium text-primary hover:underline"
                  >
                    Baca selengkapnya <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </article>
              </ScrollReveal>
            ))
          ) : (
            <div className="col-span-1 md:col-span-3">
              <div className="group flex flex-col justify-between gap-8 rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 text-left shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)] md:flex-row md:items-center md:p-8">
                <div className="flex items-start gap-5">
                  <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-secondary/70 text-primary transition-transform duration-700 ease-premium group-hover:-translate-y-1">
                    <Calendar className="size-5" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Coming Soon</h3>
                    <p className="mt-2 max-w-xl text-sm leading-7 text-muted-foreground md:text-base">
                      Sedang meracik konten seputar web development dan system
                      architecture. Nanti bagian ini masuk flow tulisan pendek,
                      bukan block kosong yang motong halaman.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <ScrollReveal delay={300}>
          <div className="mt-8 flex justify-center">
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
