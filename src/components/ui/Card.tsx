import Link from 'next/link';

interface CardProps {
  href?: string;
  children: React.ReactNode;
  className?: string;
  as?: 'div' | 'article';
}

export default function Card({
  href,
  children,
  className = '',
  as = 'article',
}: CardProps) {
  const baseClasses =
    'block rounded-xl border border-zinc-200/60 dark:border-zinc-800/60 ' +
    'bg-white dark:bg-surface-dark-secondary ' +
    'transition-all duration-300 ' +
    'hover:shadow-lg hover:shadow-zinc-200/50 dark:hover:shadow-zinc-900/50 ' +
    'hover:-translate-y-0.5 ' +
    className;

  if (href) {
    return (
      <Link href={href} className={`${baseClasses} group`}>
        {children}
      </Link>
    );
  }

  const Tag = as;
  return <Tag className={baseClasses}>{children}</Tag>;
}
