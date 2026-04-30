import BlogCard from './BlogCard';
import type { ContentMeta } from '@/types/content';

interface BlogListProps {
  posts: ContentMeta[];
}

export default function BlogList({ posts }: BlogListProps) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-zinc-400 dark:text-zinc-500">没有找到相关文章</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <BlogCard key={post.slug} post={post} />
      ))}
    </div>
  );
}
