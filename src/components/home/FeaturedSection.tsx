import Link from 'next/link';
import Container from '@/components/ui/Container';
import BlogCard from '@/components/blog/BlogCard';
import type { ContentMeta } from '@/types/content';

interface FeaturedSectionProps {
  posts: ContentMeta[];
}

export default function FeaturedSection({ posts }: FeaturedSectionProps) {
  if (posts.length === 0) return null;

  return (
    <section className="py-16 sm:py-24">
      <Container>
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-sans font-bold text-zinc-900 dark:text-zinc-100">
              最新文章
            </h2>
            <p className="mt-2 text-zinc-500 dark:text-zinc-400">
              近期发布的博客文章
            </p>
          </div>
          <Link
            href="/blog"
            className="hidden sm:inline-flex items-center gap-1 text-sm font-medium
                       text-brand-500 hover:text-brand-600 dark:text-brand-400 dark:hover:text-brand-300
                       transition-colors font-sans"
          >
            查看全部
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
              />
            </svg>
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1 text-sm font-medium
                       text-brand-500 hover:text-brand-600 dark:text-brand-400
                       transition-colors font-sans"
          >
            查看全部文章
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
              />
            </svg>
          </Link>
        </div>
      </Container>
    </section>
  );
}
