import Link from 'next/link';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import type { KnowledgeNode } from '@/types/content';

interface KnowledgePreviewProps {
  nodes: KnowledgeNode[];
}

export default function KnowledgePreview({ nodes }: KnowledgePreviewProps) {
  if (nodes.length === 0) return null;

  return (
    <section className="py-16 sm:py-24 bg-surface-secondary dark:bg-surface-dark-secondary">
      <Container>
        <div className="mb-10">
          <h2 className="text-2xl sm:text-3xl font-sans font-bold text-zinc-900 dark:text-zinc-100">
            知识库
          </h2>
          <p className="mt-2 text-zinc-500 dark:text-zinc-400">
            分类整理的个人知识体系
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {nodes.map((node) => (
            <Card key={node.slug} href={`/knowledge/${node.slug}`} className="p-6">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-lg bg-brand-500/10 dark:bg-brand-500/20
                                  flex items-center justify-center text-brand-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.5}
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0l4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0l-5.571 3-5.571-3"
                      />
                    </svg>
                  </span>
                  <h3 className="text-lg font-sans font-semibold text-zinc-900 dark:text-zinc-100">
                    {node.name}
                  </h3>
                </div>

                {node.articles.length > 0 && (
                  <ul className="space-y-1">
                    {node.articles.slice(0, 3).map((article) => (
                      <li key={article.slug}>
                        <Link
                          href={`/knowledge/${article.slug}`}
                          className="text-sm text-zinc-500 dark:text-zinc-400
                                     hover:text-brand-500 dark:hover:text-brand-400
                                     transition-colors"
                        >
                          {article.title}
                        </Link>
                      </li>
                    ))}
                    {node.articles.length > 3 && (
                      <li className="text-xs text-zinc-400 dark:text-zinc-500">
                        还有 {node.articles.length - 3} 篇文章...
                      </li>
                    )}
                  </ul>
                )}

                <div className="mt-1">
                  <span className="text-xs text-zinc-400 dark:text-zinc-500 font-sans">
                    {node.articles.length} 篇文章
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/knowledge"
            className="inline-flex items-center gap-1 text-sm font-medium
                       text-brand-500 hover:text-brand-600 dark:text-brand-400
                       transition-colors font-sans"
          >
            浏览完整知识库
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
