import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import GithubSlugger from 'github-slugger';
import { CONTENT_DIR, BLOG_DIR, KNOWLEDGE_DIR } from './constants';
import type { ContentMeta, KnowledgeNode, TocEntry, BlogFrontmatter, KnowledgeFrontmatter } from '@/types/content';

function getContentDir(): string {
  return path.join(process.cwd(), CONTENT_DIR);
}

export function getAllFiles(dir: string, extensions = ['.mdx', '.md']): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...getAllFiles(fullPath, extensions));
    } else if (extensions.includes(path.extname(entry.name))) {
      files.push(fullPath);
    }
  }

  return files;
}

export function parseFrontmatter(filePath: string): {
  data: Record<string, unknown>;
  content: string;
} {
  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);
  return { data: data as Record<string, unknown>, content };
}

export function calculateReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

export function calculateReadingTimeFromContent(content: string): number {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 300));
}

export function extractHeadings(source: string): TocEntry[] {
  const slugger = new GithubSlugger();
  const headingRegex = /^(#{1,3})\s+(.+)$/gm;
  const headings: TocEntry[] = [];
  let match: RegExpExecArray | null;

  while ((match = headingRegex.exec(source)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const id = slugger.slug(text);
    headings.push({ level, text, id });
  }

  return headings;
}

function extractPlainText(mdx: string): string {
  return mdx
    .replace(/```[\s\S]*?```/g, '')
    .replace(/#{1,6}\s+/g, '')
    .replace(/!\[.*?\]\(.*?\)/g, '')
    .replace(/\[([^\]]*)\]\(.*?\)/g, '$1')
    .replace(/[*_~`>|]/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export function getAllBlogPosts(): ContentMeta[] {
  const blogDir = path.join(getContentDir(), BLOG_DIR);
  if (!fs.existsSync(blogDir)) return [];

  const files = getAllFiles(blogDir);
  const posts: ContentMeta[] = [];

  for (const file of files) {
    const { data, content } = parseFrontmatter(file);
    const relativePath = path.relative(blogDir, file);
    const slug = relativePath.replace(/\.mdx?$/, '');
    const frontmatter = data as unknown as BlogFrontmatter;

    if (frontmatter.published === false) continue;

    posts.push({
      slug,
      title: frontmatter.title,
      description: frontmatter.description,
      date: frontmatter.date,
      tags: frontmatter.tags || [],
      type: 'blog',
      coverImage: frontmatter.coverImage,
      featured: frontmatter.featured,
      readingTime: calculateReadingTime(extractPlainText(content)),
    });
  }

  posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return posts;
}

export function getBlogPost(slug: string): {
  frontmatter: BlogFrontmatter;
  content: string;
} | null {
  const blogDir = path.join(getContentDir(), BLOG_DIR);
  const mdPath = path.join(blogDir, `${slug}.mdx`);
  const mdAltPath = path.join(blogDir, `${slug}.md`);

  const filePath = fs.existsSync(mdPath) ? mdPath : fs.existsSync(mdAltPath) ? mdAltPath : null;
  if (!filePath) return null;

  const { data, content } = parseFrontmatter(filePath);
  const frontmatter = data as unknown as BlogFrontmatter;
  return {
    frontmatter: {
      ...frontmatter,
      tags: frontmatter.tags || [],
    },
    content,
  };
}

function extractArticles(dir: string, category?: string): ContentMeta[] {
  if (!fs.existsSync(dir)) return [];

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const articles: ContentMeta[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      articles.push(...extractArticles(fullPath, entry.name));
    } else if (entry.name.endsWith('.mdx') || entry.name.endsWith('.md')) {
      // Skip category descriptor files
      if (entry.name.startsWith('_')) continue;

      const { data, content } = parseFrontmatter(fullPath);
      const frontmatter = data as unknown as KnowledgeFrontmatter;
      if (frontmatter.published === false) continue;

      articles.push({
        slug: entry.name.replace(/\.mdx?$/, ''),
        title: frontmatter.title,
        description: frontmatter.description,
        date: frontmatter.date,
        tags: frontmatter.tags || [],
        type: 'knowledge',
        category: category || frontmatter.category,
        order: frontmatter.order,
        readingTime: calculateReadingTime(extractPlainText(content)),
      });
    }
  }

  return articles;
}

export function getKnowledgeTree(): KnowledgeNode[] {
  const knowledgeDir = path.join(getContentDir(), KNOWLEDGE_DIR);
  if (!fs.existsSync(knowledgeDir)) return [];

  return buildTree(knowledgeDir, '');
}

function buildTree(dir: string, parentPath: string): KnowledgeNode[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const nodes: KnowledgeNode[] = [];
  let articles: ContentMeta[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      const children = buildTree(fullPath, path.join(parentPath, entry.name));
      const dirArticles = extractArticles(fullPath, entry.name);
      nodes.push({
        name: getCategoryName(fullPath) || entry.name,
        slug: entry.name,
        children,
        articles: dirArticles,
      });
    } else if (
      (entry.name.endsWith('.mdx') || entry.name.endsWith('.md')) &&
      !entry.name.startsWith('_')
    ) {
      const { data, content } = parseFrontmatter(fullPath);
      const frontmatter = data as unknown as KnowledgeFrontmatter;
      if (frontmatter.published === false) continue;

      const articleSlug = path.join(parentPath, entry.name.replace(/\.mdx?$/, ''));
      articles.push({
        slug: articleSlug,
        title: frontmatter.title,
        description: frontmatter.description,
        date: frontmatter.date,
        tags: frontmatter.tags || [],
        type: 'knowledge',
        category: frontmatter.category || path.basename(parentPath),
        order: frontmatter.order,
        readingTime: calculateReadingTime(extractPlainText(content)),
      });
    }
  }

  if (articles.length > 0) {
    for (const article of articles) {
      nodes.push({
        name: article.title,
        slug: article.slug,
        children: [],
        articles: [article],
      });
    }
  }

  nodes.sort((a, b) => {
    const aOrder =
      a.articles[0]?.order ??
      a.children.length > 0
        ? 0
        : 999;
    const bOrder =
      b.articles[0]?.order ??
      b.children.length > 0
        ? 0
        : 999;
    return aOrder - bOrder;
  });

  return nodes;
}

function getCategoryName(dir: string): string | null {
  const categoryFile = path.join(dir, '_category.mdx');
  if (fs.existsSync(categoryFile)) {
    const { data } = parseFrontmatter(categoryFile);
    return (data as Record<string, unknown>).title as string;
  }
  return null;
}

export function getKnowledgeArticle(slugParts: string[]): {
  frontmatter: KnowledgeFrontmatter;
  content: string;
} | null {
  const knowledgeDir = path.join(getContentDir(), KNOWLEDGE_DIR);
  const fullPath = path.join(knowledgeDir, ...slugParts);
  const mdPath = `${fullPath}.mdx`;
  const mdAltPath = `${fullPath}.md`;

  const filePath = fs.existsSync(mdPath) ? mdPath : fs.existsSync(mdAltPath) ? mdAltPath : null;
  if (!filePath) return null;

  const { data, content } = parseFrontmatter(filePath);
  const frontmatter = data as unknown as KnowledgeFrontmatter;
  return {
    frontmatter: {
      ...frontmatter,
      tags: frontmatter.tags || [],
    },
    content,
  };
}

export function getBreadcrumbs(slugParts: string[]): { label: string; href: string }[] {
  const breadcrumbs: { label: string; href: string }[] = [
    { label: '知识库', href: '/knowledge' },
  ];

  let currentPath = '/knowledge';
  for (let i = 0; i < slugParts.length; i++) {
    currentPath += `/${slugParts[i]}`;
    const label =
      i === slugParts.length - 1
        ? getKnowledgeArticle(slugParts)?.frontmatter.title || slugParts[i]
        : formatCategoryName(slugParts[i]);
    breadcrumbs.push({ label, href: currentPath });
  }

  return breadcrumbs;
}

function formatCategoryName(name: string): string {
  return name.charAt(0).toUpperCase() + name.slice(1);
}

export function getRelatedArticles(
  slug: string,
  type: 'blog' | 'knowledge',
  limit = 3
): ContentMeta[] {
  const allArticles =
    type === 'blog' ? getAllBlogPosts() : getAllKnowledgeArticles();
  const current = allArticles.find((a) => a.slug === slug);
  if (!current) return [];

  const others = allArticles.filter((a) => a.slug !== slug);

  const scored = others.map((article) => {
    let score = 0;
    const sharedTags = article.tags.filter((t) => current.tags.includes(t));
    score += sharedTags.length * 10;
    score +=
      article.category === current.category ||
      (article.category && current.category && article.category === current.category)
        ? 5
        : 0;
    return { article, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((s) => s.article);
}

export function getAllKnowledgeArticles(): ContentMeta[] {
  const knowledgeDir = path.join(getContentDir(), KNOWLEDGE_DIR);
  if (!fs.existsSync(knowledgeDir)) return [];
  return extractArticles(knowledgeDir);
}

export function getAllArticles(): ContentMeta[] {
  return [...getAllBlogPosts(), ...getAllKnowledgeArticles()];
}

export function getPlainTextContent(mdx: string): string {
  return extractPlainText(mdx);
}
