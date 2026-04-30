import type { Metadata } from 'next';
import Container from '@/components/ui/Container';
import Tag from '@/components/ui/Tag';
import BlogList from '@/components/blog/BlogList';
import { getAllBlogPosts } from '@/lib/content';
import { SITE_NAME } from '@/lib/constants';

export const metadata: Metadata = {
  title: '博客',
  description: `阅读${SITE_NAME}的所有博客文章`,
};

interface BlogPageProps {
  searchParams: Promise<{ tag?: string }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const { tag } = await searchParams;
  let posts = getAllBlogPosts();

  // Collect all tags
  const allTags = Array.from(new Set(posts.flatMap((p) => p.tags))).sort();

  // Filter by tag
  if (tag) {
    posts = posts.filter((p) => p.tags.includes(tag));
  }

  return (
    <div className="py-16 sm:py-24">
      <Container>
        <div className="mb-12">
          <h1 className="text-3xl sm:text-4xl font-sans font-bold text-zinc-900 dark:text-zinc-100">
            博客
          </h1>
          <p className="mt-3 text-zinc-500 dark:text-zinc-400">
            记录思考，分享见解
          </p>
        </div>

        {/* Tag filter */}
        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-10">
            <Tag href="/blog" active={!tag}>
              全部
            </Tag>
            {allTags.map((t) => (
              <Tag
                key={t}
                href={`/blog?tag=${encodeURIComponent(t)}`}
                active={t === tag}
              >
                {t}
              </Tag>
            ))}
          </div>
        )}

        <BlogList posts={posts} />
      </Container>
    </div>
  );
}
