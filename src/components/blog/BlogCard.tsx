import Card from '@/components/ui/Card';
import Tag from '@/components/ui/Tag';
import type { ContentMeta } from '@/types/content';

interface BlogCardProps {
  post: ContentMeta;
  compact?: boolean;
}

export default function BlogCard({ post, compact = false }: BlogCardProps) {
  return (
    <Card
      href={`/blog/${post.slug}`}
      className={compact ? 'p-5' : 'p-6'}
    >
      <div className="flex flex-col gap-3">
        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {post.tags.slice(0, 3).map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </div>
        )}

        {/* Title */}
        <h3
          className={`font-sans font-semibold text-zinc-900 dark:text-zinc-100
                     group-hover:text-brand-500 dark:group-hover:text-brand-400
                     transition-colors duration-200
                     ${compact ? 'text-base' : 'text-lg'}`}
        >
          {post.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
          {post.description}
        </p>

        {/* Meta */}
        <div className="flex items-center gap-3 mt-2 text-xs text-zinc-400 dark:text-zinc-500 font-sans">
          <time dateTime={post.date}>
            {formatDate(post.date)}
          </time>
          <span className="text-zinc-300 dark:text-zinc-600">·</span>
          <span>{post.readingTime} 分钟阅读</span>
        </div>
      </div>
    </Card>
  );
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
