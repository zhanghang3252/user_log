import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { compileMDX } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypePrettyCode from 'rehype-pretty-code';
import Container from '@/components/ui/Container';
import Breadcrumb from '@/components/knowledge/Breadcrumb';
import KnowledgeTree from '@/components/knowledge/KnowledgeTree';
import TableOfContents from '@/components/ui/TableOfContents';
import { mdxComponents } from '@/components/mdx/MDXContent';
import {
  getKnowledgeArticle,
  getKnowledgeTree,
  getBreadcrumbs,
  extractHeadings,
  calculateReadingTime,
  getAllKnowledgeArticles,
} from '@/lib/content';
import { SITE_NAME } from '@/lib/constants';

interface KnowledgePageProps {
  params: Promise<{ slug: string[] }>;
}

export async function generateStaticParams() {
  const articles = getAllKnowledgeArticles();
  return articles.map((article) => ({
    slug: article.slug.split('/'),
  }));
}

export async function generateMetadata({ params }: KnowledgePageProps): Promise<Metadata> {
  const { slug } = await params;
  const decodedSlug = slug.map((s) => decodeURIComponent(s));
  const article = getKnowledgeArticle(decodedSlug);
  if (!article) return { title: 'Not Found' };

  return {
    title: article.frontmatter.title,
    description: article.frontmatter.description,
  };
}

export default async function KnowledgeArticlePage({ params }: KnowledgePageProps) {
  const { slug: slugParts } = await params;
  const decodedSlug = slugParts.map((s) => decodeURIComponent(s));
  const article = getKnowledgeArticle(decodedSlug);

  if (!article) notFound();

  const headings = extractHeadings(article.content);
  const readingTime = calculateReadingTime(article.content);
  const breadcrumbs = getBreadcrumbs(decodedSlug);
  const tree = getKnowledgeTree();
  const currentSlug = decodedSlug.join('/');

  const { content } = await compileMDX({
    source: article.content,
    options: {
      parseFrontmatter: false,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
          rehypeSlug,
          [rehypeAutolinkHeadings, { behavior: 'wrap' }],
          [
            rehypePrettyCode,
            {
              theme: {
                light: 'github-light',
                dark: 'github-dark-dimmed',
              },
              keepBackground: false,
            },
          ],
        ],
      },
    },
    components: mdxComponents,
  });

  return (
    <div className="py-16 sm:py-24">
      <Container>
        <div className="flex gap-12">
          {/* Sidebar: Knowledge Tree */}
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <div className="sticky top-24">
              <h4 className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-4 font-sans">
                导航
              </h4>
              <KnowledgeTree nodes={tree} currentSlug={currentSlug} />
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <div className="max-w-3xl">
              <Breadcrumb items={breadcrumbs} />

              <h1 className="text-3xl sm:text-4xl font-sans font-bold tracking-tight text-zinc-900 dark:text-zinc-100 leading-tight">
                {article.frontmatter.title}
              </h1>

              <div className="mt-4 flex items-center gap-3 text-sm text-zinc-400 dark:text-zinc-500 font-sans">
                <time dateTime={article.frontmatter.date}>
                  {formatDate(article.frontmatter.date)}
                </time>
                <span className="text-zinc-300 dark:text-zinc-600">·</span>
                <span>{readingTime} 分钟阅读</span>
              </div>

              <hr className="mt-8 mb-10 border-zinc-200/60 dark:border-zinc-800/60" />

              <div
                className="prose prose-zinc dark:prose-invert
                            prose-headings:font-sans prose-headings:font-semibold
                            prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6
                            prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4
                            prose-p:leading-relaxed prose-p:text-[1.05rem]
                            prose-a:text-brand-500 prose-a:no-underline hover:prose-a:underline
                            prose-code:before:content-none prose-code:after:content-none
                            prose-code:bg-zinc-100 prose-code:dark:bg-zinc-800
                            prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
                            prose-code:text-sm prose-code:font-mono
                            prose-strong:text-zinc-900 prose-strong:dark:text-zinc-100
                            prose-img:rounded-xl prose-img:shadow-sm
                            prose-blockquote:border-brand-500 prose-blockquote:bg-zinc-50 prose-blockquote:dark:bg-zinc-800/50
                            prose-blockquote:py-1 prose-blockquote:px-6 prose-blockquote:rounded-r-xl
                            prose-blockquote:not-italic
                            prose-li:leading-relaxed
                            prose-th:font-sans prose-th:font-medium
                            max-w-none"
              >
                {content}
              </div>
            </div>
          </div>

          {/* Table of Contents */}
          {headings.length > 0 && (
            <div className="hidden xl:block w-48 flex-shrink-0">
              <TableOfContents headings={headings} />
            </div>
          )}
        </div>
      </Container>
    </div>
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
