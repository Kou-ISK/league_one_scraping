import React from 'react';
import Link from 'next/link';

import HomeIcon from '@mui/icons-material/Home';

export const Header = () => (
  <header id='header-body'>
    <Link className='top' href='/' id='header-link'>
      <HomeIcon />
    </Link>
    <nav className='header-nav' aria-label='サイト内ナビゲーション'>
      <Link href='/stocks'>チーム別推移</Link>
      <Link href='/results'>過去試合データ</Link>
    </nav>
  </header>
);
