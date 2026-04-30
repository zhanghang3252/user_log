import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');
const contentDir = path.join(rootDir, 'content');
const outputDir = path.join(rootDir, 'public');

function extractPlainText(mdx) {
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

function getAllFiles(dir, extensions = ['.mdx', '.md']) {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];

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

function buildIndex() {
  const documents = [];

  // Blog files
  const blogDir = path.join(contentDir, 'blog');
  const blogFiles = getAllFiles(blogDir);

  for (const file of blogFiles) {
    const raw = fs.readFileSync(file, 'utf-8');
    const { data, content } = matter(raw);
    if (data.published === false) continue;

    const relativePath = path.relative(blogDir, file);
    const slug = relativePath.replace(/\.mdx?$/, '');

    documents.push({
      id: `blog-${slug}`,
      type: 'blog',
      title: data.title || '',
      description: data.description || '',
      tags: data.tags || [],
      content: extractPlainText(content),
      slug,
      date: data.date || '',
    });
  }

  // Knowledge files
  const knowledgeDir = path.join(contentDir, 'knowledge');
  const knowledgeFiles = getAllFiles(knowledgeDir);

  for (const file of knowledgeFiles) {
    // Skip category descriptor files
    if (path.basename(file).startsWith('_')) continue;

    const raw = fs.readFileSync(file, 'utf-8');
    const { data, content } = matter(raw);
    if (data.published === false) continue;

    const relativePath = path.relative(knowledgeDir, file);
    const slug = relativePath.replace(/\.mdx?$/, '');

    documents.push({
      id: `knowledge-${slug}`,
      type: 'knowledge',
      title: data.title || '',
      description: data.description || '',
      tags: data.tags || [],
      content: extractPlainText(content),
      slug,
      category: data.category || slug.split('/')[0] || '',
      date: data.date || '',
    });
  }

  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(
    path.join(outputDir, 'search-index.json'),
    JSON.stringify(documents),
  );

  console.log(`Search index built with ${documents.length} documents`);
}

buildIndex();
