import Card from '@/components/ui/Card';
import Tag from '@/components/ui/Tag';
import type { ContentMeta } from '@/types/content';

interface KnowledgeCardProps {
  article: ContentMeta;
}

export default function KnowledgeCard({ article }: KnowledgeCardProps) {
  return (
    <Card
      href={`/knowledge/${article.slug}`}
      className="p-5"
    >
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center gap-2">
          {article.category && (
            <span className="text-xs font-medium text-brand-500 dark:text-brand-400 font-sans">
              {article.category}
            </span>
          )}
        </div>

        <h3 className="font-sans font-medium text-zinc-900 dark:text-zinc-100
                       group-hover:text-brand-500 dark:group-hover:text-brand-400
                       transition-colors duration-200">
          {article.title}
        </h3>

        <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
          {article.description}
        </p>

        <div className="flex items-center gap-3 mt-1 text-xs text-zinc-400 dark:text-zinc-500 font-sans">
          <span>{article.readingTime} 分钟阅读</span>
        </div>
      </div>
    </Card>
  );
}
