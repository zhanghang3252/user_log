export interface BaseFrontmatter {
  title: string;
  description: string;
  date: string;
  tags: string[];
  published: boolean;
}

export interface BlogFrontmatter extends BaseFrontmatter {
  coverImage?: string;
  featured?: boolean;
}

export interface KnowledgeFrontmatter extends BaseFrontmatter {
  category: string;
  order?: number;
}

export interface TocEntry {
  level: number;
  text: string;
  id: string;
}

export interface ContentMeta {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  type: 'blog' | 'knowledge';
  category?: string;
  coverImage?: string;
  featured?: boolean;
  order?: number;
  readingTime: number;
}

export interface KnowledgeNode {
  name: string;
  slug: string;
  children: KnowledgeNode[];
  articles: ContentMeta[];
}

export interface SearchDocument {
  id: string;
  type: 'blog' | 'knowledge';
  title: string;
  description: string;
  tags: string[];
  content: string;
  slug: string;
  category?: string;
  date?: string;
}
