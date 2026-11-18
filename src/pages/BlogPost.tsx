import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, CalendarDays, Tag } from 'lucide-react';

import { Toolbar } from '@/components/os/OsWindowChrome';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { usePostBySlug } from '@/hooks/useBlogPosts';
import { usePageMeta } from '@/hooks/usePageMeta';

export default function BlogPost() {
  const { id: slug } = useParams<{ id: string }>();
  const { data: post, isLoading, error } = usePostBySlug(slug || '');
  const publishedPost = post?.published ? post : null;

  usePageMeta({
    title: publishedPost
      ? `${publishedPost.title} | Ghufron Ainun Najib`
      : 'Blog Post | Ghufron Ainun Najib',
    description:
      publishedPost?.excerpt ??
      publishedPost?.content.slice(0, 155) ??
      'Read the latest writing from Ghufron Ainun Najib.',
    canonicalPath: slug ? `/blog/${slug}` : '/blog',
    ogType: 'article',
    ogImage: publishedPost?.featured_image ?? undefined,
    jsonLd: publishedPost
      ? [
          {
            '@type': 'BlogPosting',
            headline: publishedPost.title,
            description: publishedPost.excerpt ?? undefined,
            url: `https://ghufronainun.tech/blog/${publishedPost.slug}`,
            image: publishedPost.featured_image ?? undefined,
            datePublished:
              publishedPost.published_at ?? publishedPost.created_at,
            dateModified: publishedPost.updated_at,
            author: {
              '@type': 'Person',
              name: 'Ghufron Ainun Najib',
              url: 'https://ghufronainun.tech',
            },
          },
          {
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: 'https://ghufronainun.tech/',
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: 'Blog',
                item: 'https://ghufronainun.tech/blog',
              },
              {
                '@type': 'ListItem',
                position: 3,
                name: publishedPost.title,
                item: `https://ghufronainun.tech/blog/${publishedPost.slug}`,
              },
            ],
          },
        ]
      : undefined,
  });

  const backLink = (
    <Link
      to="/blog"
      className="group inline-flex h-8 items-center gap-1.5 rounded-full px-2.5 text-[13px] font-medium text-black/65 transition-colors hover:bg-black/[0.06] hover:text-[#0a84ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a84ff] dark:text-white/75 dark:hover:bg-white/[0.08]"
    >
      <ArrowLeft
        className="size-3.5 transition-transform duration-200 group-hover:-translate-x-0.5"
        aria-hidden="true"
      />
      <span>Writing log</span>
    </Link>
  );

  if (isLoading) {
    return (
      <div className="flex h-full flex-col bg-white text-black/85 dark:bg-[#282025] dark:text-white/90">
        <Toolbar hasControls leading={backLink} />
        <div className="flex-1 overflow-y-auto px-5 py-6 sm:px-8">
          <main
            className="mx-auto max-w-3xl"
            aria-label="Loading journal entry"
            aria-live="polite"
          >
            <Skeleton className="mb-8 h-4 w-24 bg-black/10 dark:bg-white/10" />
            <Skeleton className="mb-4 h-10 w-3/4 bg-black/10 dark:bg-white/10" />
            <Skeleton className="mb-8 h-4 w-48 bg-black/10 dark:bg-white/10" />
            <Skeleton className="mb-8 h-56 w-full bg-black/10 dark:bg-white/10" />
            <div className="space-y-4">
              <Skeleton className="h-4 w-full bg-black/10 dark:bg-white/10" />
              <Skeleton className="h-4 w-full bg-black/10 dark:bg-white/10" />
              <Skeleton className="h-4 w-3/4 bg-black/10 dark:bg-white/10" />
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (error || !publishedPost) {
    return (
      <div className="flex h-full flex-col bg-white text-black/85 dark:bg-[#282025] dark:text-white/90">
        <Toolbar hasControls leading={backLink} />
        <div className="flex flex-1 items-center justify-center px-5 py-12 text-center sm:px-8">
          <main className="mx-auto max-w-xl rounded-xl border border-black/10 bg-[#f7f7f8] p-8 dark:border-white/10 dark:bg-white/[0.04]">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#0a84ff]">
              Journal entry
            </p>
            <h1 className="mb-3 mt-3 text-2xl font-semibold">Post not found</h1>
            <p className="mb-6 text-sm leading-6 text-black/60 dark:text-white/60">
              This entry may have moved or isn’t published yet.
            </p>
            <Link
              to="/blog"
              className="inline-flex min-h-9 items-center gap-2 rounded-lg bg-[#0a84ff] px-4 text-sm font-medium text-white shadow-sm transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a84ff]"
            >
              <ArrowLeft className="size-4" aria-hidden="true" /> Back to
              writing log
            </Link>
          </main>
        </div>
      </div>
    );
  }

  // Simple markdown-like rendering
  const renderContent = (content: string) => {
    return content.split('\n\n').map((paragraph, i) => {
      if (paragraph.startsWith('## ')) {
        return (
          <h2
            key={i}
            className="mb-4 mt-8 text-2xl font-bold text-black/90 dark:text-white"
          >
            {paragraph.replace('## ', '')}
          </h2>
        );
      }
      if (paragraph.startsWith('### ')) {
        return (
          <h3
            key={i}
            className="mb-3 mt-6 text-xl font-semibold text-black/90 dark:text-white"
          >
            {paragraph.replace('### ', '')}
          </h3>
        );
      }
      if (paragraph.startsWith('```')) {
        const code = paragraph.replace(/```\w*\n?/g, '');
        return (
          <pre
            key={i}
            className="my-4 overflow-x-auto rounded-xl border border-black/10 bg-[#f7f7f8] p-4 dark:border-white/10 dark:bg-black/25"
          >
            <code className="font-mono text-sm text-black/85 dark:text-white/90">
              {code}
            </code>
          </pre>
        );
      }
      return (
        <p
          key={i}
          className="mb-4 leading-relaxed text-black/70 dark:text-white/75"
        >
          {paragraph}
        </p>
      );
    });
  };

  return (
    <div className="flex h-full flex-col bg-white text-black/85 dark:bg-[#282025] dark:text-white/90">
      <Toolbar hasControls leading={backLink} />

      <main className="flex-1 overflow-y-auto px-5 pb-10 pt-2 sm:px-8">
        <article className="mx-auto max-w-3xl">
          <header className="mb-8 border-b border-black/10 pb-7 dark:border-white/10">
            <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.18em] text-[#0a84ff]">
              Field note
            </p>
            <h1 className="mb-5 break-words text-2xl font-semibold tracking-tight text-black/90 sm:text-3xl dark:text-white">
              {publishedPost.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-sm text-black/55 dark:text-white/55">
              <span className="inline-flex items-center gap-2">
                <CalendarDays
                  className="size-4 text-[#0a84ff]"
                  aria-hidden="true"
                />
                {new Date(
                  publishedPost.published_at || publishedPost.created_at
                ).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
              {publishedPost.category && (
                <>
                  <span aria-hidden="true">/</span>
                  <Badge
                    variant="secondary"
                    className="border border-[#0a84ff]/25 bg-[#0a84ff]/10 text-[#0a84ff]"
                  >
                    {publishedPost.category.name}
                  </Badge>
                </>
              )}
            </div>
            {publishedPost.tags && publishedPost.tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {publishedPost.tags.map((tag) => (
                  <Badge
                    key={tag.id}
                    variant="outline"
                    className="border-black/10 text-xs text-black/60 dark:border-white/10 dark:text-white/60"
                  >
                    <Tag className="mr-1 size-3" aria-hidden="true" />
                    {tag.name}
                  </Badge>
                ))}
              </div>
            )}
          </header>

          {publishedPost.featured_image && (
            <img
              src={publishedPost.featured_image}
              alt={publishedPost.title}
              className="mb-8 max-h-[28rem] w-full rounded-xl border border-black/10 object-cover dark:border-white/10"
            />
          )}

          <div className="max-w-[68ch] text-base leading-7 [&_a]:text-[#0a84ff] [&_a]:underline-offset-4 [&_a:hover]:underline [&_code]:font-mono [&_h2]:mb-4 [&_h2]:mt-10 [&_h2]:text-2xl [&_h2]:font-semibold [&_h3]:mb-3 [&_h3]:mt-8 [&_h3]:text-xl [&_h3]:font-semibold [&_p]:mb-5 [&_p]:text-base [&_p]:leading-7">
            {renderContent(publishedPost.content)}
          </div>
        </article>
      </main>
    </div>
  );
}
