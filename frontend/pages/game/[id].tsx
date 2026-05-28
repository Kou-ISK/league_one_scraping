import dynamic from 'next/dynamic';
import { ALL_GAME } from '../../src/variables';

const GameDetailPage = dynamic(
  () => import('../../src/stories/gameDetailPage').then((module) => module.GameDetailPage),
  { ssr: false }
);

export function getStaticPaths() {
  return {
    paths: ALL_GAME.map((game) => ({
      params: {
        id: String(game.id),
      },
    })),
    fallback: false,
  };
}

export function getStaticProps() {
  return {
    props: {},
  };
}

export default GameDetailPage;
