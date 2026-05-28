import React from 'react';

type SectionPanelProps = {
  title?: string;
  meta?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
};

export function SectionPanel({ title, meta, children, className = '' }: SectionPanelProps) {
  return (
    <section className={`section-panel ${className}`}>
      {title || meta ? (
        <div className='section-heading'>
          {title ? <h3>{title}</h3> : <span />}
          {meta ? <span>{meta}</span> : null}
        </div>
      ) : null}
      {children}
    </section>
  );
}
