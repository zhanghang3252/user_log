'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { KnowledgeNode } from '@/types/content';

interface KnowledgeTreeProps {
  nodes: KnowledgeNode[];
  currentSlug?: string;
}

export default function KnowledgeTree({ nodes, currentSlug }: KnowledgeTreeProps) {
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(() => {
    // Auto-expand paths that contain current slug
    const paths = new Set<string>();
    if (currentSlug) {
      const parts = currentSlug.split('/');
      for (let i = 1; i <= parts.length; i++) {
        paths.add(parts.slice(0, i).join('/'));
      }
    }
    return paths;
  });

  const toggle = (path: string) => {
    setExpandedPaths((prev) => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  };

  return (
    <nav className="space-y-0.5">
      {nodes.map((node, i) => (
        <TreeNode
          key={node.slug || i}
          node={node}
          currentSlug={currentSlug}
          isExpanded={expandedPaths.has(node.slug)}
          onToggle={() => toggle(node.slug)}
          parentPath={node.slug}
        />
      ))}
    </nav>
  );
}

interface TreeNodeProps {
  node: KnowledgeNode;
  currentSlug?: string;
  isExpanded: boolean;
  onToggle: () => void;
  parentPath: string;
}

function TreeNode({
  node,
  currentSlug,
  isExpanded,
  onToggle,
}: TreeNodeProps) {
  const hasChildren = node.children.length > 0;
  const hasArticles = node.articles.length > 0;

  // Is the current article inside this node?
  const isNodeActive =
    currentSlug &&
    (node.articles.some((a) => a.slug === currentSlug) ||
      node.children.some((c) =>
        c.articles.some((a) => a.slug === currentSlug)
      ));

  if (!hasChildren && !hasArticles && node.articles.length === 0) return null;

  // Single article (leaf)
  if (!hasChildren && hasArticles && node.articles.length === 1) {
    const article = node.articles[0];
    const isActive = currentSlug === article.slug;
    return (
      <Link
        href={`/knowledge/${article.slug}`}
        className={`block py-1.5 px-3 rounded-lg text-sm transition-colors
          ${
            isActive
              ? 'bg-brand-500/10 text-brand-600 dark:text-brand-400 font-medium'
              : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
          }`}
      >
        {article.title}
      </Link>
    );
  }

  // Category with children
  return (
    <div>
      <button
        onClick={onToggle}
        className={`w-full flex items-center gap-2 py-1.5 px-3 rounded-lg text-sm font-sans font-medium transition-colors
          ${isNodeActive ? 'text-zinc-800 dark:text-zinc-200' : 'text-zinc-600 dark:text-zinc-400'}
          hover:bg-zinc-50 dark:hover:bg-zinc-800/50`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          className={`w-3.5 h-3.5 text-zinc-400 transition-transform duration-200
            ${isExpanded ? 'rotate-90' : ''}`}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
        {node.name}
        <span className="ml-auto text-xs text-zinc-400 font-normal">
          {node.articles.length}
        </span>
      </button>

      {isExpanded && (hasChildren || hasArticles) && (
        <div className="ml-4 border-l border-zinc-200/60 dark:border-zinc-800/60 pl-3 mt-0.5 space-y-0.5">
          {/* Render child nodes recursively */}
          {node.children.map((child, i) => (
            <TreeNode
              key={child.slug || `child-${i}`}
              node={child}
              currentSlug={currentSlug}
              isExpanded={true}
              onToggle={() => {}}
              parentPath={`${node.slug}/${child.slug}`}
            />
          ))}
          {/* Render direct articles */}
          {node.articles.map((article) => {
            const isActive = currentSlug === article.slug;
            return (
              <Link
                key={article.slug}
                href={`/knowledge/${article.slug}`}
                className={`block py-1.5 px-3 rounded-lg text-sm transition-colors
                  ${
                    isActive
                      ? 'bg-brand-500/10 text-brand-600 dark:text-brand-400 font-medium'
                      : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
                  }`}
              >
                {article.title}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
