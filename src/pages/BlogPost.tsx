import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Tag } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { usePostBySlug } from '@/hooks/useBlogPosts';

export default function BlogPost() {
  const { id: slug } = useParams<{ id: string }>();
  const { data: post, isLoading, error } = usePostBySlug(slug || '');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-20">
          <article className="container mx-auto px-4 max-w-3xl">
            <Skeleton className="h-4 w-24 mb-8" />
            <Skeleton className="h-10 w-3/4 mb-4" />
            <Skeleton className="h-4 w-48 mb-8" />
            <Skeleton className="h-64 w-full mb-8" />
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </article>
        </main>
        <Footer showCTA={false} />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-20 container mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold mb-4">Post not found</h1>
          <Link to="/blog" className="text-primary hover:underline">
            ← Back to blog
          </Link>
        </main>
        <Footer showCTA={false} />
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
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-20">
        <article className="container mx-auto px-4 max-w-3xl">
          <Link
            to="/blog"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to blog
          </Link>

          <header className="mb-8">
            <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {new Date(
                  post.published_at || post.created_at
                ).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
              {post.category && (
                <>
                  <span>•</span>
                  <Badge variant="secondary">{post.category.name}</Badge>
                </>
              )}
            </div>
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {post.tags.map((tag) => (
                  <Badge key={tag.id} variant="outline" className="text-xs">
                    <Tag className="h-3 w-3 mr-1" />
                    {tag.name}
                  </Badge>
                ))}
              </div>
            )}
          </header>

          {post.featured_image && (
            <img
              src={post.featured_image}
              alt={post.title}
              className="w-full h-64 md:h-96 object-cover rounded-xl mb-8"
            />
          )}

          <div className="prose prose-lg dark:prose-invert max-w-none">
            {renderContent(post.content)}
          </div>
        </article>
      </main>
      <Footer showCTA={false} />
    </div>
  );
}
