'use client';

import { useEffect, useState, useCallback } from 'react';
import type { TocEntry } from '@/types/content';

interface TableOfContentsProps {
  headings: TocEntry[];
}

export default function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');

  const handleScroll = useCallback(() => {
    const headingElements = headings
      .map((h) => document.getElementById(h.id))
      .filter(Boolean) as HTMLElement[];

    for (let i = headingElements.length - 1; i >= 0; i--) {
      const el = headingElements[i];
      if (el.getBoundingClientRect().top <= 120) {
        setActiveId(headings[i].id);
        return;
      }
    }

    if (headingElements.length > 0) {
      setActiveId(headings[0].id);
    }
  }, [headings]);

  useEffect(() => {
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  if (headings.length === 0) return null;

  return (
    <nav className="hidden lg:block w-56 flex-shrink-0">
      <div className="sticky top-24">
        <h4 className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-4 font-sans">
          目录
        </h4>
        <ul className="space-y-1 border-l border-zinc-200/60 dark:border-zinc-800/60">
          {headings.map((heading) => (
            <li key={heading.id}>
              <a
                href={`#${heading.id}`}
                className={`block py-1 text-sm transition-colors duration-200
                  ${
                    heading.level === 2 ? 'pl-4' : ''
                  }
                  ${
                    heading.level === 3 ? 'pl-7' : ''
                  }
                  ${
                    activeId === heading.id
                      ? 'text-brand-500 dark:text-brand-400 border-l-2 border-brand-500 -ml-px font-medium'
                      : 'text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 border-l-2 border-transparent -ml-px'
                  }`}
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
