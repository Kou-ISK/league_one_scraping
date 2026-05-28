import { Game } from '../types/game';
import { PlayerObjectList } from './playerObjectList';
import { useRouter } from 'next/router';
import { Button } from './Button';
import { useState } from 'react';
import { GraphModal } from './GraphModal';
import { ALL_GAME, TEAM_MASTER_DATA } from '../variables';
import { Badge } from '../components/atoms/Badge';
import { PageHero } from '../components/molecules/PageHero';
import { SectionPanel } from '../components/molecules/SectionPanel';
import { StatGrid } from '../components/molecules/StatGrid';
import { PageShell } from '../components/templates/PageShell';

export const GameDetailPage = () => {
  const router = useRouter();
  const id = Array.isArray(router.query.id) ? router.query.id[0] : router.query.id;
  const game = ALL_GAME.find((game) => game.id === Number(id)) as Game | undefined;
  const [showGraphModal, setShowGraphModal] = useState(false);

  if (!game) {
    return (
      <PageShell>
        <PageHero title='試合が見つかりません' />
      </PageShell>
    );
  }

  const homeTeamLogo = TEAM_MASTER_DATA.find(
    (master) => master.team_name === game.home_team
  )?.logo_url;
  const awayTeamLogo = TEAM_MASTER_DATA.find(
    (master) => master.team_name === game.away_team
  )?.logo_url;

  return (
    <PageShell wide className='game-detail-page'>
      <PageHero
        eyebrow={`DIVISION ${game.division}`}
        title={game.basic_info}
        description={`${game.date} / ${game.stadium}`}
        actions={
          <Button
            label='各種グラフを表示'
            primary={true}
            onClick={() => setShowGraphModal(true)}
          />
        }
      />

      <section className='scoreboard-panel'>
        <div className='score-team'>
          <img src={homeTeamLogo} alt='' className='score-team-logo' />
          <h2>{game.home_team}</h2>
          <Badge tone='accent'>HOME</Badge>
        </div>
        <div className='score-center'>
          <span>{game.home_team_score}</span>
          <strong>-</strong>
          <span>{game.away_team_score}</span>
        </div>
        <div className='score-team away'>
          <img src={awayTeamLogo} alt='' className='score-team-logo' />
          <h2>{game.away_team}</h2>
          <Badge tone='gold'>AWAY</Badge>
        </div>
      </section>

      <StatGrid
        compact
        items={[
          { label: 'レフェリー', value: game.referee_name || '-' },
          { label: '天気', value: game.weather || '-' },
          { label: '観客動員数', value: game.spectator || '-' },
        ]}
      />

      <div className='lineup-grid'>
        <SectionPanel title={game.home_team} meta='Home'>
          <PlayerObjectList
            playerList={game.home_team_player_list}
            replacementList={[
              ...game.home_team_replacement_list,
              ...game.home_team_temporary_replacement_list,
            ]}
          />
        </SectionPanel>
        <SectionPanel title={game.away_team} meta='Away'>
          <PlayerObjectList
            playerList={game.away_team_player_list}
            replacementList={[
              ...game.away_team_replacement_list,
              ...game.away_team_temporary_replacement_list,
            ]}
          />
        </SectionPanel>
      </div>
      {showGraphModal && (
        <GraphModal
          showGraphModal={showGraphModal}
          setShowGraphModal={setShowGraphModal}
          game={game}
        />
      )}
    </PageShell>
  );
};
