import React from 'react';

type BadgeTone = 'neutral' | 'accent' | 'danger' | 'gold';

type BadgeProps = {
  children: React.ReactNode;
  tone?: BadgeTone;
};

export function Badge({ children, tone = 'neutral' }: BadgeProps) {
  return <span className={`ui-badge ui-badge-${tone}`}>{children}</span>;
}
