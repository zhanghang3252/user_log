import Link from 'next/link';
import Container from '@/components/ui/Container';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-32">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(108,99,255,0.08),transparent)]" />

      <Container>
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-sans font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            思考与
            <span className="bg-gradient-to-r from-brand-500 to-purple-400 bg-clip-text text-transparent">
              知识
            </span>
            的交汇处
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-zinc-500 dark:text-zinc-400 leading-relaxed font-sans">
            记录思考，沉淀知识，分享见解。
            <br className="hidden sm:block" />
            一个人探索技术与美学的旅程。
          </p>

          <div className="mt-10 flex items-center justify-center gap-4">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg
                         bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900
                         text-sm font-medium font-sans
                         hover:bg-zinc-800 dark:hover:bg-zinc-200
                         transition-colors duration-200"
            >
              阅读博客
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                />
              </svg>
            </Link>
            <Link
              href="/knowledge"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg
                         border border-zinc-200 dark:border-zinc-700
                         text-sm font-medium font-sans
                         text-zinc-600 dark:text-zinc-400
                         hover:border-zinc-300 dark:hover:border-zinc-600
                         hover:text-zinc-800 dark:hover:text-zinc-200
                         transition-colors duration-200"
            >
              探索知识库
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
