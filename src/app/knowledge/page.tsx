import type { Metadata } from 'next';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Link from 'next/link';
import { getKnowledgeTree } from '@/lib/content';
import { SITE_NAME } from '@/lib/constants';

export const metadata: Metadata = {
  title: '知识库',
  description: `浏览${SITE_NAME}的个人知识体系`,
};

export default function KnowledgePage() {
  const tree = getKnowledgeTree();

  return (
    <div className="py-16 sm:py-24">
      <Container>
        <div className="mb-12">
          <h1 className="text-3xl sm:text-4xl font-sans font-bold text-zinc-900 dark:text-zinc-100">
            知识库
          </h1>
          <p className="mt-3 text-zinc-500 dark:text-zinc-400">
            分类整理的个人知识体系
          </p>
        </div>

        {tree.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-zinc-400 dark:text-zinc-500">
              知识库中还没有内容
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2">
            {tree.map((node) => {
              const totalArticles = countArticles(node);

              return (
                <Card
                  key={node.slug}
                  href={`/knowledge/${node.slug}`}
                  className="p-6"
                >
                  <div className="flex items-start gap-4">
                    <span className="w-12 h-12 rounded-xl bg-brand-500/10 dark:bg-brand-500/20
                                    flex items-center justify-center text-brand-500 flex-shrink-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={1.5}
                        className="w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0l4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0l-5.571 3-5.571-3"
                        />
                      </svg>
                    </span>
                    <div>
                      <h3 className="text-lg font-sans font-semibold text-zinc-900 dark:text-zinc-100">
                        {node.name}
                      </h3>
                      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                        {totalArticles} 篇文章
                      </p>

                      {node.articles.length > 0 && (
                        <ul className="mt-3 space-y-1">
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
                        </ul>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </Container>
    </div>
  );
}

function countArticles(node: typeof getKnowledgeTree extends () => infer R
  ? R extends (infer T)[] ? T : never
  : never): number {
  let count = node.articles?.length || 0;
  if (node.children) {
    for (const child of node.children) {
      count += countArticles(child);
    }
  }
  return count;
}
