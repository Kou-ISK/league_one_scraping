import Link from 'next/link';
import teamsData from './datas/generated/leagueOneTeams.json';
import teamRoundStatsData from './datas/generated/teamRoundStats.json';
import { PageHero } from './components/molecules/PageHero';
import { StatGrid } from './components/molecules/StatGrid';
import { PageShell } from './components/templates/PageShell';

type LeagueOneTeam = {
  id: string;
  stockEnabled: boolean;
};

type TeamRoundStats = {
  summary: {
    totalMatches: number;
  };
};

const teams = teamsData as LeagueOneTeam[];
const teamRoundStats = teamRoundStatsData as TeamRoundStats[];

export function PortalPage() {
  const totalMatches = teamRoundStats.reduce(
    (sum, teamStats) => sum + teamStats.summary.totalMatches,
    0
  );

  return (
    <PageShell className='portal-page'>
      <PageHero
        eyebrow='JAPAN RUGBY LEAGUE ONE'
        title='League One Portal'
        description='戦績、順位、観客動員、試合詳細、親会社株価を確認するための入口です。'
      />

      <section className='portal-grid' aria-label='サイト内ページ'>
        <Link className='portal-card primary' href='/stocks'>
          <span>2025-26</span>
          <h2>チーム別推移</h2>
          <p>順位・勝敗と親会社株価を年度別、試合別に確認します。</p>
        </Link>
        <Link className='portal-card' href='/results'>
          <span>2021-2023</span>
          <h2>過去試合データ</h2>
          <p>試合一覧、ランキング、観客動員数、試合詳細を表示します。</p>
        </Link>
      </section>

      <StatGrid
        items={[
          { label: '2025-26 チーム', value: teams.length },
          { label: '2025-26 チーム別試合', value: totalMatches },
          { label: '過去シーズン', value: 3 },
        ]}
      />
    </PageShell>
  );
}

export default PortalPage;
