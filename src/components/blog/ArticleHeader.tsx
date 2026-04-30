import Tag from '@/components/ui/Tag';
import type { BlogFrontmatter } from '@/types/content';

interface ArticleHeaderProps {
  title: string;
  date: string;
  tags: string[];
  readingTime: number;
  coverImage?: string;
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function ArticleHeader({
  title,
  date,
  tags,
  readingTime,
  coverImage,
}: ArticleHeaderProps) {
  return (
    <header className="mb-12">
      {coverImage && (
        <div className="mb-8 -mx-4 sm:mx-0 overflow-hidden rounded-2xl">
          <img
            src={coverImage}
            alt={title}
            className="w-full h-64 sm:h-96 object-cover"
          />
        </div>
      )}

      {(tags || []).length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag) => (
            <Tag key={tag} href={`/blog?tag=${encodeURIComponent(tag)}`}>
              {tag}
            </Tag>
          ))}
        </div>
      )}

      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-sans font-bold tracking-tight text-zinc-900 dark:text-zinc-100 leading-tight">
        {title}
      </h1>

      <div className="mt-6 flex items-center gap-3 text-sm text-zinc-400 dark:text-zinc-500 font-sans">
        <time dateTime={date}>{formatDate(date)}</time>
        <span className="text-zinc-300 dark:text-zinc-600">·</span>
        <span>{readingTime} 分钟阅读</span>
      </div>

      <hr className="mt-8 border-zinc-200/60 dark:border-zinc-800/60" />
    </header>
  );
}
