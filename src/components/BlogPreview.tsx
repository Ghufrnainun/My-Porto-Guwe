import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { usePublishedPosts } from '@/hooks/useBlogPosts';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';

const springEase = [0.32, 0.72, 0, 1];

export function BlogPreview() {
  const { data: posts, isLoading } = usePublishedPosts();
  const recentPosts = posts?.slice(0, 3) || [];

  return (
    <section id="blog" className="relative bg-transparent py-24 md:py-32 border-t border-border/40 overflow-hidden">
      <div className="container mx-auto px-6 md:px-12 lg:px-24">

        {/* Header */}
        <motion.div 
          className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.7, ease: springEase }}
        >
          <div className="max-w-2xl">
            <p className="mb-4 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">
              Writing Log
            </p>
            <h2 className="font-serif text-5xl md:text-6xl font-bold tracking-tight text-foreground leading-[1.05]">
              Notes & Thoughts.
            </h2>
          </div>
          
          {recentPosts.length > 0 && (
            <Link 
              to="/blog" 
              className="group hidden md:inline-flex items-center gap-3 text-sm font-semibold text-foreground hover:text-primary transition-colors uppercase tracking-widest pb-2 border-b border-border/60 hover:border-primary"
            >
              All Articles
              <ArrowRight className="w-4 h-4 transition-transform duration-500 ease-out-spring group-hover:translate-x-1" />
            </Link>
          )}
        </motion.div>

        {/* Content */}
        {isLoading ? (
          <div className="flex flex-col border-t border-border/40">
            {[1, 2, 3].map((i) => (
              <div key={i} className="py-8 border-b border-border/40 flex flex-col md:flex-row md:items-center gap-6">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-8 w-full max-w-xl" />
              </div>
            ))}
          </div>
        ) : recentPosts.length > 0 ? (
          <div className="flex flex-col border-t border-border/40">
            {recentPosts.map((post, index) => {
              const date = new Date(post.published_at || post.created_at);
              const formattedDate = new Intl.DateTimeFormat('en-US', {
                month: 'short',
                day: '2-digit',
                year: 'numeric'
              }).format(date);

              return (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.7, delay: index * 0.1, ease: springEase }}
                  className="group relative border-b border-border/40 py-8 md:py-12 flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-12 transition-colors hover:bg-secondary/20"
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-16 flex-1 px-4 md:px-0">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground w-32 shrink-0">
                      {formattedDate}
                    </span>
                    
                    <div className="max-w-3xl">
                      <h3 className="font-serif text-2xl md:text-4xl font-bold text-foreground group-hover:text-primary transition-colors duration-300 mb-3 leading-[1.1]">
                        <Link to={`/blog/${post.slug}`} className="before:absolute before:inset-0">
                          {post.title}
                        </Link>
                      </h3>
                      <p className="text-muted-foreground text-sm md:text-base line-clamp-2 md:line-clamp-1">
                        {post.excerpt || 'Read the full article to learn more.'}
                      </p>
                    </div>
                  </div>

                  <div className="hidden md:flex shrink-0 pr-4 md:pr-0">
                    <div className="w-10 h-10 rounded-full border border-border/60 flex items-center justify-center group-hover:bg-primary group-hover:border-primary group-hover:text-primary-foreground transition-all duration-500 ease-out-spring">
                      <ArrowRight className="w-4 h-4 transition-transform duration-500 group-hover:-rotate-45" />
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        ) : (
          /* Empty state */
          <motion.div 
            className="border-t border-b border-border/40 py-16 md:py-24 text-center md:text-left flex flex-col md:flex-row md:items-center justify-between gap-8 px-4 md:px-8 bg-secondary/10"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.7, ease: springEase }}
          >
            <div className="max-w-2xl">
              <h3 className="font-serif text-2xl md:text-4xl font-bold text-foreground mb-4">
                No articles yet.
              </h3>
              <p className="text-lg leading-relaxed text-muted-foreground">
                I'm preparing short notes on web development, system design, and lessons from shipping real projects. Check back soon.
              </p>
            </div>
            
            <Link 
              to="/projects" 
              className="group inline-flex items-center justify-center gap-3 glass-pill text-foreground px-6 py-3.5 rounded-full font-bold text-[11px] uppercase tracking-widest transition-all duration-300 hover:scale-105 active:scale-95 shrink-0"
            >
              View Case Studies
              <ArrowRight className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-1" />
            </Link>
          </motion.div>
        )}

        {/* Mobile View All Link */}
        {recentPosts.length > 0 && (
          <div className="mt-10 flex justify-center md:hidden">
            <Link 
              to="/blog" 
              className="group inline-flex items-center gap-3 text-[11px] font-bold text-foreground uppercase tracking-widest px-6 py-3 border border-border/60 rounded-full hover:bg-secondary transition-colors"
            >
              All Articles
              <ArrowRight className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-1" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
