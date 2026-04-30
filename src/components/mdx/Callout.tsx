import React from 'react';

interface CalloutProps {
  type?: 'info' | 'tip' | 'warning' | 'danger';
  children: React.ReactNode;
}

const config = {
  info: {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
      </svg>
    ),
    border: 'border-brand-500/30',
    bg: 'bg-brand-50 dark:bg-brand-500/5',
    text: 'text-brand-700 dark:text-brand-300',
    iconColor: 'text-brand-500',
  },
  tip: {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
      </svg>
    ),
    border: 'border-emerald-500/30',
    bg: 'bg-emerald-50 dark:bg-emerald-500/5',
    text: 'text-emerald-700 dark:text-emerald-300',
    iconColor: 'text-emerald-500',
  },
  warning: {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
      </svg>
    ),
    border: 'border-amber-500/30',
    bg: 'bg-amber-50 dark:bg-amber-500/5',
    text: 'text-amber-700 dark:text-amber-300',
    iconColor: 'text-amber-500',
  },
  danger: {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
      </svg>
    ),
    border: 'border-red-500/30',
    bg: 'bg-red-50 dark:bg-red-500/5',
    text: 'text-red-700 dark:text-red-300',
    iconColor: 'text-red-500',
  },
};

export default function Callout({ type = 'info', children }: CalloutProps) {
  const c = config[type];

  return (
    <div
      className={`my-6 flex gap-3 rounded-xl border ${c.border} ${c.bg} p-4 ${c.text}`}
    >
      <span className={`flex-shrink-0 mt-0.5 ${c.iconColor}`}>{c.icon}</span>
      <div className="text-sm leading-relaxed [&>p]:my-0 [&>p+&>p]:mt-2">
        {children}
      </div>
    </div>
  );
}
