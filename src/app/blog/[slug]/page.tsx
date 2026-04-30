import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { compileMDX } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypePrettyCode from 'rehype-pretty-code';
import Container from '@/components/ui/Container';
import ArticleHeader from '@/components/blog/ArticleHeader';
import TableOfContents from '@/components/ui/TableOfContents';
import { mdxComponents } from '@/components/mdx/MDXContent';
import {
  getAllBlogPosts,
  getBlogPost,
  extractHeadings,
  calculateReadingTime,
  getRelatedArticles,
} from '@/lib/content';
import { SITE_NAME } from '@/lib/constants';
import BlogCard from '@/components/blog/BlogCard';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = getAllBlogPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const post = getBlogPost(decodedSlug);
  if (!post) return { title: 'Not Found' };

  return {
    title: post.frontmatter.title,
    description: post.frontmatter.description,
    openGraph: {
      title: `${post.frontmatter.title} | ${SITE_NAME}`,
      description: post.frontmatter.description,
      type: 'article',
      publishedTime: post.frontmatter.date,
      tags: post.frontmatter.tags,
      images: post.frontmatter.coverImage
        ? [{ url: post.frontmatter.coverImage }]
        : [],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const post = getBlogPost(decodedSlug);

  if (!post) notFound();

  const headings = extractHeadings(post.content);
  const readingTime = calculateReadingTime(post.content);
  const relatedArticles = getRelatedArticles(decodedSlug, 'blog', 3);

  const { content } = await compileMDX({
    source: post.content,
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
    <article className="py-16 sm:py-24">
      <Container>
        <div className="max-w-3xl mx-auto">
          <ArticleHeader
            title={post.frontmatter.title}
            date={post.frontmatter.date}
            tags={post.frontmatter.tags}
            readingTime={readingTime}
            coverImage={post.frontmatter.coverImage}
          />
        </div>

        <div className="flex gap-12 max-w-6xl mx-auto">
          {/* Content */}
          <div className="flex-1 min-w-0 max-w-3xl mx-auto">
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

            {/* Related articles */}
            {relatedArticles.length > 0 && (
              <div className="mt-20 pt-12 border-t border-zinc-200/60 dark:border-zinc-800/60">
                <h3 className="text-lg font-semibold font-sans text-zinc-900 dark:text-zinc-100 mb-6">
                  相关文章
                </h3>
                <div className="grid gap-6 sm:grid-cols-3">
                  {relatedArticles.map((article) => (
                    <BlogCard key={article.slug} post={article} compact />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Table of Contents sidebar */}
          {headings.length > 0 && (
            <div className="hidden lg:block flex-shrink-0">
              <TableOfContents headings={headings} />
            </div>
          )}
        </div>
      </Container>
    </article>
  );
}
