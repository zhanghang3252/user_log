import type { Metadata } from 'next';
import Container from '@/components/ui/Container';
import SearchResults from '@/components/search/SearchResults';

export const metadata: Metadata = {
  title: '搜索',
  description: '搜索博客文章和知识库内容',
};

interface SearchPageProps {
  searchParams: Promise<{ q?: string; type?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q = '', type = 'all' } = await searchParams;

  return (
    <div className="py-16 sm:py-24">
      <Container>
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-sans font-bold text-zinc-900 dark:text-zinc-100 mb-2">
            搜索
          </h1>

          <div className="mb-10 mt-6">
            <form method="GET" action="/search">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                    />
                  </svg>
                  <input
                    type="text"
                    name="q"
                    defaultValue={q}
                    placeholder="搜索文章和知识..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl
                               border border-zinc-200 dark:border-zinc-700
                               bg-white dark:bg-surface-dark-secondary
                               text-zinc-900 dark:text-zinc-100
                               placeholder:text-zinc-400 dark:placeholder:text-zinc-500
                               focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500
                               transition-all duration-200 font-sans"
                    autoFocus
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-zinc-900 dark:bg-zinc-100
                             text-white dark:text-zinc-900
                             text-sm font-medium font-sans
                             hover:bg-zinc-800 dark:hover:bg-zinc-200
                             transition-colors duration-200"
                >
                  搜索
                </button>
              </div>

              {/* Type filter */}
              <div className="flex gap-2 mt-3">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="type"
                    value="all"
                    defaultChecked={type === 'all'}
                    className="accent-brand-500"
                  />
                  <span className="text-sm text-zinc-500 dark:text-zinc-400">全部</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="type"
                    value="blog"
                    defaultChecked={type === 'blog'}
                    className="accent-brand-500"
                  />
                  <span className="text-sm text-zinc-500 dark:text-zinc-400">博客</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="type"
                    value="knowledge"
                    defaultChecked={type === 'knowledge'}
                    className="accent-brand-500"
                  />
                  <span className="text-sm text-zinc-500 dark:text-zinc-400">知识库</span>
                </label>
              </div>
            </form>
          </div>

          <SearchResults
            query={q}
            type={type === 'all' ? 'all' : type === 'blog' ? 'blog' : 'knowledge'}
          />
        </div>
      </Container>
    </div>
  );
}
