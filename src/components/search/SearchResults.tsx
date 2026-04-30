'use client';

import { useEffect, useState } from 'react';
import Card from '@/components/ui/Card';
import Tag from '@/components/ui/Tag';
import type { SearchDocument } from '@/types/content';

interface SearchResultsProps {
  query: string;
  type?: 'all' | 'blog' | 'knowledge';
}

export default function SearchResults({ query, type = 'all' }: SearchResultsProps) {
  const [documents, setDocuments] = useState<SearchDocument[]>([]);
  const [results, setResults] = useState<SearchDocument[]>([]);
  const [loading, setLoading] = useState(true);

  // Load search index
  useEffect(() => {
    fetch('/search-index.json')
      .then((res) => res.json())
      .then((data: SearchDocument[]) => {
        setDocuments(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  // Client-side search when query changes
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const q = query.toLowerCase();
    const filtered = documents.filter((doc) => {
      if (type !== 'all' && doc.type !== type) return false;

      return (
        doc.title.toLowerCase().includes(q) ||
        doc.description.toLowerCase().includes(q) ||
        doc.tags.some((t) => t.toLowerCase().includes(q)) ||
        doc.content.toLowerCase().includes(q)
      );
    });

    // Sort by relevance (title match > description match > content match)
    filtered.sort((a, b) => {
      const aTitle = a.title.toLowerCase().includes(q) ? 3 : 0;
      const aDesc = a.description.toLowerCase().includes(q) ? 2 : 0;
      const aContent = a.content.toLowerCase().includes(q) ? 1 : 0;
      const bTitle = b.title.toLowerCase().includes(q) ? 3 : 0;
      const bDesc = b.description.toLowerCase().includes(q) ? 2 : 0;
      const bContent = b.content.toLowerCase().includes(q) ? 1 : 0;

      return bTitle + bDesc + bContent - (aTitle + aDesc + aContent);
    });

    setResults(filtered.slice(0, 30));
  }, [query, type, documents]);

  if (loading) {
    return (
      <div className="text-center py-16">
        <p className="text-zinc-400 dark:text-zinc-500">加载搜索索引...</p>
      </div>
    );
  }

  if (!query.trim()) {
    return (
      <div className="text-center py-16">
        <p className="text-zinc-400 dark:text-zinc-500">输入关键词开始搜索</p>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-zinc-400 dark:text-zinc-500">
          没有找到与 &ldquo;{query}&rdquo; 相关的结果
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-zinc-400 dark:text-zinc-500">
        找到 {results.length} 个结果
      </p>

      {results.map((doc) => (
        <Card
          key={doc.id}
          href={`/${doc.type === 'blog' ? 'blog' : 'knowledge'}/${doc.slug}`}
          className="p-5"
        >
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center gap-2">
              <span
                className={`text-xs font-medium font-sans px-2 py-0.5 rounded-full
                  ${
                    doc.type === 'blog'
                      ? 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400'
                      : 'bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400'
                  }`}
              >
                {doc.type === 'blog' ? '博客' : '知识库'}
              </span>
              {doc.category && (
                <span className="text-xs text-zinc-400 dark:text-zinc-500">
                  {doc.category}
                </span>
              )}
            </div>

            <h3 className="font-sans font-medium text-zinc-900 dark:text-zinc-100
                           group-hover:text-brand-500 dark:group-hover:text-brand-400
                           transition-colors duration-200">
              {doc.title}
            </h3>

            <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
              {doc.description}
            </p>

            {doc.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-1">
                {doc.tags.slice(0, 5).map((tag) => (
                  <Tag key={tag}>{tag}</Tag>
                ))}
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}
