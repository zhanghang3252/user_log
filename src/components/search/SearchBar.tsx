'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  // Focus input on Cmd+K / Ctrl+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <div className="relative">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="搜索文章..."
          className="w-full pl-10 pr-12 py-2.5 rounded-xl
                     border border-zinc-200 dark:border-zinc-700
                     bg-white dark:bg-surface-dark-secondary
                     text-sm font-sans
                     text-zinc-900 dark:text-zinc-100
                     placeholder:text-zinc-400 dark:placeholder:text-zinc-500
                     focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500
                     transition-all duration-200"
        />
        <kbd className="absolute right-3 top-1/2 -translate-y-1/2
                        hidden sm:inline-flex items-center
                        px-1.5 py-0.5 rounded text-[10px] font-mono
                        text-zinc-400 bg-zinc-100 dark:text-zinc-500 dark:bg-zinc-800
                        border border-zinc-200 dark:border-zinc-700">
          ⌘K
        </kbd>
      </div>
    </form>
  );
}
