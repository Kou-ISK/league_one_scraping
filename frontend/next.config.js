const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/league_one_scraping',
  assetPrefix: '/league_one_scraping/',
  outputFileTracingRoot: path.join(__dirname),
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
