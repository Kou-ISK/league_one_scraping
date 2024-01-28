import React from 'react';

import './header.css';
import HomeIcon from '@mui/icons-material/Home';

export const Header = () => (
  <header id='header-body'>
    <a className='top' href='/league_one_scraping' id='header-link'>
      <HomeIcon />
      TOPへ戻る
    </a>
  </header>
);
