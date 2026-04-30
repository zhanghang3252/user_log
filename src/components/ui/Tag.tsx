import Link from 'next/link';

interface TagProps {
  children: React.ReactNode;
  href?: string;
  active?: boolean;
  className?: string;
}

export default function Tag({
  children,
  href,
  active = false,
  className = '',
}: TagProps) {
  const baseClasses =
    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ' +
    'transition-colors duration-200 ' +
    (active
      ? 'bg-brand-500/10 text-brand-600 dark:bg-brand-500/20 dark:text-brand-400'
      : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 ' +
        'hover:bg-zinc-200 dark:hover:bg-zinc-700') +
    ` ${className}`;

  if (href) {
    return (
      <Link href={href} className={baseClasses}>
        {children}
      </Link>
    );
  }

  return <span className={baseClasses}>{children}</span>;
}
