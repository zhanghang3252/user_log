import Link from 'next/link';
import Container from '@/components/ui/Container';

export default function NotFound() {
  return (
    <div className="flex-1 flex items-center justify-center py-32">
      <Container>
        <div className="max-w-md mx-auto text-center">
          <p className="text-8xl font-sans font-bold text-zinc-200 dark:text-zinc-800 select-none">
            404
          </p>
          <h1 className="mt-6 text-2xl font-sans font-bold text-zinc-900 dark:text-zinc-100">
            页面未找到
          </h1>
          <p className="mt-3 text-zinc-500 dark:text-zinc-400">
            你访问的页面不存在或已被移动。
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg
                         bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900
                         text-sm font-medium font-sans
                         hover:bg-zinc-800 dark:hover:bg-zinc-200
                         transition-colors duration-200"
            >
              返回首页
            </Link>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg
                         border border-zinc-200 dark:border-zinc-700
                         text-sm font-medium font-sans
                         text-zinc-600 dark:text-zinc-400
                         hover:border-zinc-300 dark:hover:border-zinc-600
                         transition-colors duration-200"
            >
              浏览博客
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
