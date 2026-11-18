import { ArrowRight, BookOpen, CalendarDays, FileText, FolderOpen, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';

import { usePublishedPosts } from '@/hooks/useBlogPosts';
import { usePageMeta } from '@/hooks/usePageMeta';

export default function Blog() {
  const { data: posts, isLoading, error, refetch, isFetching } = usePublishedPosts();
  const archiveConfigured = Boolean(
    import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
  );

  usePageMeta({
    title: 'Writing Log | Ghufron Ainun Najib',
    description:
      'Notes and write-ups on full-stack development, TypeScript, and shipping web products — by Ghufron Ainun Najib.',
    canonicalPath: '/blog',
    jsonLd: {
      '@type': 'Blog',
      name: 'Ghufron Ainun Najib — Writing Log',
      url: 'https://ghufronainun.tech/blog',
      description: 'Notes and write-ups on full-stack development, TypeScript, and shipping web products — by Ghufron Ainun Najib.',
    },
  });

  return (
    <main className="min-h-full bg-[#171716] px-4 py-5 text-[#f2eee8] sm:px-6 sm:py-7" aria-labelledby="journal-title">
      <div className="mx-auto max-w-4xl">
        <header className="mb-6 border-b border-white/10 pb-5 sm:mb-8 sm:pb-6">
          <div className="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-[#56A8ED]">
            <BookOpen className="size-4" aria-hidden="true" />
            <span>Notes &amp; field logs</span>
          </div>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 id="journal-title" className="text-2xl font-semibold tracking-tight sm:text-3xl">Writing log</h1>
              <p className="mt-2 max-w-[62ch] text-sm leading-6 text-[#aaa39a]">
                Practical notes on building for the web, solving problems, and lessons from shipped work.
              </p>
            </div>
            <span className="rounded-full border border-white/10 px-3 py-1.5 font-mono text-[11px] text-[#aaa39a]">
              {isLoading ? 'SYNCING…' : `${posts?.length ?? 0} ${posts?.length === 1 ? 'ENTRY' : 'ENTRIES'}`}
            </span>
          </div>
        </header>

        {isLoading ? (
          <section aria-live="polite" aria-label="Loading writing entries" className="space-y-3">
            {[0, 1, 2].map((item) => (
              <div key={item} className="animate-pulse rounded-[10px] border border-white/10 bg-[#1d1c1a] p-5 sm:p-6">
                <div className="h-3 w-28 rounded bg-white/10" />
                <div className="mt-5 h-5 w-2/3 rounded bg-white/10" />
                <div className="mt-3 h-3 w-full max-w-xl rounded bg-white/10" />
              </div>
            ))}
          </section>
        ) : error ? (
          <section className="rounded-[10px] border border-[#176FC0]/30 bg-[#202329] p-6 sm:p-8" role="alert">
            <p className="font-medium">The writing log couldn’t load.</p>
            <p className="mt-2 text-sm leading-6 text-[#aaa39a]">Please try again in a moment.</p>
            <button
              type="button"
              onClick={() => void refetch()}
              disabled={isFetching}
              className="mt-5 inline-flex min-h-10 items-center gap-2 rounded-lg border border-white/15 px-4 text-sm font-medium text-[#f2eee8] transition hover:border-[#176FC0]/70 hover:text-[#56A8ED] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#176FC0] disabled:opacity-60"
            >
              <RefreshCw className={`size-4 ${isFetching ? 'animate-spin' : ''}`} aria-hidden="true" />
              {isFetching ? 'Retrying…' : 'Try again'}
            </button>
          </section>
        ) : posts?.length ? (
          <section aria-label="Published writing entries" className="divide-y divide-white/10 border-y border-white/10">
            {posts.map((post) => (
              <Link
                key={post.id}
                to={`/blog/${post.slug}`}
                className="group grid gap-3 px-3 py-4 transition-colors hover:bg-white/[.035] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#176FC0] sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:px-4"
              >
                <div className="min-w-0">
                  <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] text-[#aaa39a]">
                    <span className="inline-flex items-center gap-1.5">
                      <CalendarDays className="size-3.5 text-[#56A8ED]" aria-hidden="true" />
                      {new Date(post.published_at || post.created_at).toLocaleDateString('en-US', {
                        year: 'numeric', month: 'short', day: 'numeric',
                      })}
                    </span>
                    {post.category && <span className="text-[#56A8ED]">/ {post.category.name}</span>}
                  </div>
                  <h2 className="break-words text-base font-semibold leading-snug tracking-tight text-[#f2eee8] transition-colors group-hover:text-[#56A8ED] sm:text-lg">
                    {post.title}
                  </h2>
                  {post.excerpt && <p className="mt-1 line-clamp-2 max-w-[68ch] text-sm leading-6 text-[#aaa39a]">{post.excerpt}</p>}
                  {post.tags && post.tags.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2" aria-label="Tags">
                      {post.tags.map((tag) => (
                        <span key={tag.id} className="rounded-md border border-white/10 px-2 py-1 font-mono text-[10px] text-[#aaa39a]">{tag.name}</span>
                      ))}
                    </div>
                  )}
                </div>
                <ArrowRight className="hidden size-5 text-[#56A8ED] transition-transform group-hover:translate-x-1 sm:block" aria-hidden="true" />
              </Link>
            ))}
          </section>
        ) : (
          <section className="rounded-[10px] border border-white/10 bg-gradient-to-br from-[#202329] via-[#1d1c1a] to-[#123A5C]/35 p-6 sm:p-10" aria-labelledby="empty-title">
            <div className="flex size-12 items-center justify-center rounded-xl border border-[#176FC0]/25 bg-[#123A5C] text-[#56A8ED]">
              {archiveConfigured ? <FolderOpen className="size-5" aria-hidden="true" /> : <FileText className="size-5" aria-hidden="true" />}
            </div>
            <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.18em] text-[#56A8ED]">
              {archiveConfigured ? 'Writing archive' : 'Local preview'}
            </p>
            <h2 id="empty-title" className="mt-2 text-xl font-semibold sm:text-2xl">
              {archiveConfigured ? 'No entries are currently published' : 'The writing archive isn’t connected here'}
            </h2>
            <p className="mt-3 max-w-[62ch] text-base leading-7 text-[#aaa39a]">
              {archiveConfigured
                ? 'There are no public entries in the archive right now. Published notes will appear here.'
                : 'This preview has no Supabase connection, so it can’t check the live archive. Published notes will appear here when the archive is connected.'}
            </p>
            <Link to="/projects" className="mt-5 inline-flex min-h-10 items-center gap-2 rounded-lg border border-white/15 px-4 text-sm font-medium transition hover:border-[#176FC0]/70 hover:text-[#56A8ED] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#176FC0]">
              Browse projects <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </section>
        )}
      </div>
    </main>
  );
}
