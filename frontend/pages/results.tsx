import dynamic from 'next/dynamic';

const LegacyResultsPage = dynamic(
  () => import('../src/App').then((module) => module.LegacyResultsPage),
  { ssr: false }
);

export default LegacyResultsPage;
