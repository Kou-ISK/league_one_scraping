import React from 'react';

type PageHeroProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
};

export function PageHero({ eyebrow, title, description, actions }: PageHeroProps) {
  return (
    <section className='page-hero'>
      <div>
        {eyebrow ? <p className='eyebrow'>{eyebrow}</p> : null}
        <h1>{title}</h1>
        {description ? <p className='page-hero-description'>{description}</p> : null}
      </div>
      {actions ? <div className='page-hero-actions'>{actions}</div> : null}
    </section>
  );
}
