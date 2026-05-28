import React from 'react';

type StatItem = {
  label: string;
  value: React.ReactNode;
};

type StatGridProps = {
  items: StatItem[];
  compact?: boolean;
};

export function StatGrid({ items, compact = false }: StatGridProps) {
  return (
    <dl className={`stat-grid ${compact ? 'stat-grid-compact' : ''}`}>
      {items.map((item) => (
        <div key={item.label}>
          <dt>{item.label}</dt>
          <dd>{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
