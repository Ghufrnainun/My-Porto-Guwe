import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CalendarDays, Tag } from 'lucide-react';

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
            datePublished: publishedPost.published_at ?? publishedPost.created_at,
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

  if (isLoading) {
    return (
      <div className="min-h-full bg-[#171716] px-5 py-7 text-[#f2eee8] sm:px-8 sm:py-9">
        <main className="mx-auto max-w-3xl" aria-label="Loading journal entry" aria-live="polite">
          <Skeleton className="mb-8 h-4 w-24 bg-white/10" />
          <Skeleton className="mb-4 h-10 w-3/4 bg-white/10" />
          <Skeleton className="mb-8 h-4 w-48 bg-white/10" />
          <Skeleton className="mb-8 h-56 w-full bg-white/10" />
          <div className="space-y-4"><Skeleton className="h-4 w-full bg-white/10" /><Skeleton className="h-4 w-full bg-white/10" /><Skeleton className="h-4 w-3/4 bg-white/10" /></div>
        </main>
      </div>
    );
  }

  if (error || !publishedPost) {
    return (
      <div className="min-h-full bg-[#171716] px-5 py-12 text-center text-[#f2eee8] sm:px-8">
        <main className="mx-auto max-w-xl rounded-[10px] border border-white/10 bg-[#1d1c1a] p-8">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#56A8ED]">Journal entry</p>
          <h1 className="mb-3 mt-3 text-2xl font-semibold">Post not found</h1>
          <p className="mb-6 text-sm leading-6 text-[#aaa39a]">This entry may have moved or isn’t published yet.</p>
          <Link to="/blog" className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-white/15 px-4 text-sm font-medium transition hover:border-[#176FC0]/70 hover:text-[#56A8ED] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#176FC0]">
            <ArrowLeft className="size-4" aria-hidden="true" /> Back to writing log
          </Link>
        </main>
      </div>
    );
  }

  // Simple markdown-like rendering
  const renderContent = (content: string) => {
    return content.split('\n\n').map((paragraph, i) => {
      // Check for headers
      if (paragraph.startsWith('## ')) {
        return (
          <h2 key={i} className="text-2xl font-bold mt-8 mb-4">
            {paragraph.replace('## ', '')}
          </h2>
        );
      }
      if (paragraph.startsWith('### ')) {
        return (
          <h3 key={i} className="text-xl font-semibold mt-6 mb-3">
            {paragraph.replace('### ', '')}
          </h3>
        );
      }
      // Check for code blocks
      if (paragraph.startsWith('```')) {
        const code = paragraph.replace(/```\w*\n?/g, '');
        return (
          <pre key={i} className="bg-muted p-4 rounded-lg overflow-x-auto my-4">
            <code className="text-sm font-mono">{code}</code>
          </pre>
        );
      }
      // Regular paragraph
      return (
        <p key={i} className="mb-4 text-muted-foreground leading-relaxed">
          {paragraph}
        </p>
      );
    });
  };

  return (
    <div className="min-h-full bg-[#171716] px-5 py-7 text-[#f2eee8] sm:px-8 sm:py-9">
      <main className="mx-auto max-w-3xl">
        <article>
          <Link
            to="/blog"
            className="group mb-7 inline-flex min-h-10 items-center rounded-lg pr-3 text-sm font-medium text-[#aaa39a] transition-colors hover:text-[#56A8ED] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#176FC0]"
          >
            <ArrowLeft className="mr-2 size-4 transition-transform duration-200 group-hover:-translate-x-1" aria-hidden="true" />
            Back to writing log
          </Link>

          <header className="mb-8 border-b border-white/10 pb-7">
            <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.18em] text-[#56A8ED]">Field note</p>
            <h1 className="mb-5 break-words text-2xl font-semibold tracking-tight sm:text-3xl">{publishedPost.title}</h1>
            <div className="flex flex-wrap items-center gap-3 text-sm text-[#aaa39a]">
              <span className="inline-flex items-center gap-2">
                <CalendarDays className="size-4 text-[#56A8ED]" aria-hidden="true" />
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
                  <Badge variant="secondary" className="border border-[#176FC0]/20 bg-[#123A5C] text-[#56A8ED]">{publishedPost.category.name}</Badge>
                </>
              )}
            </div>
            {publishedPost.tags && publishedPost.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {publishedPost.tags.map((tag) => (
                  <Badge key={tag.id} variant="outline" className="border-white/10 text-xs text-[#aaa39a]">
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
              className="mb-8 max-h-[28rem] w-full rounded-[10px] border border-white/10 object-cover"
            />
          )}

          <div className="max-w-[68ch] text-base leading-7 [&_p]:mb-5 [&_p]:text-base [&_p]:leading-7 [&_p]:text-[#c5beb4] [&_h2]:mb-4 [&_h2]:mt-10 [&_h2]:text-2xl [&_h2]:font-semibold [&_h3]:mb-3 [&_h3]:mt-8 [&_h3]:text-xl [&_h3]:font-semibold [&_pre]:my-5 [&_pre]:overflow-x-auto [&_pre]:rounded-[10px] [&_pre]:border [&_pre]:border-white/10 [&_pre]:bg-[#111110] [&_pre]:p-4 [&_code]:font-mono [&_a]:text-[#56A8ED] [&_a]:underline-offset-4 [&_a:hover]:underline [&_a:focus-visible]:rounded-sm [&_a:focus-visible]:outline [&_a:focus-visible]:outline-2 [&_a:focus-visible]:outline-[#2385D9]">
            {renderContent(publishedPost.content)}
          </div>
        </article>
      </main>
    </div>
  );
}
