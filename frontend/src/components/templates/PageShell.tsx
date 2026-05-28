import React from 'react';

type PageShellProps = {
  children: React.ReactNode;
  wide?: boolean;
  className?: string;
};

export function PageShell({ children, wide = false, className = '' }: PageShellProps) {
  return (
    <main className={`page-shell ${wide ? 'page-shell-wide' : ''} ${className}`}>
      {children}
    </main>
  );
}
