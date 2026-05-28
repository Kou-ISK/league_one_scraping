import React, { Dispatch, useState } from 'react';

import { GameInfoTable } from './gameInfoTable';
import { Game } from '../types/game';
import { YearSelectionTabs } from './yearSelectionTabs';
import { RankingPage } from './rankingPage';
import { SpectatorPage } from './spectatorPage';
import { DATA_SET } from '../variables';
import { PageHero } from '../components/molecules/PageHero';
import { SectionPanel } from '../components/molecules/SectionPanel';
import { SegmentedControl } from '../components/molecules/SegmentedControl';
import { StatGrid } from '../components/molecules/StatGrid';
import { PageShell } from '../components/templates/PageShell';

interface PageProps {
  selectedGameList: Game[];
  setSelectedGameList: Dispatch<React.SetStateAction<Game[]>>;
}

export const Page = (props: PageProps) => {
  const [year, setYear] = useState(2023);

  const [displayMode, setDisplayMode] = useState<
    'Table' | 'Ranking' | 'Spectator'
  >('Table');

  const handleChange = (event: React.ChangeEvent<{}>, value: number) => {
    setYear(value);
    props.setSelectedGameList(DATA_SET[value]);
  };

  const totalSpectators = props.selectedGameList.reduce(
    (sum, game) => sum + Number(String(game.spectator).replace(/,/g, '') || 0),
    0
  );

  return (
    <PageShell wide className='legacy-page'>
      <PageHero
        eyebrow='ARCHIVE'
        title='過去試合データ'
        description='過去シーズンの試合一覧、スコアランキング、観客動員数を確認できます。'
      />

      <section className='legacy-controls'>
        <YearSelectionTabs handleChange={handleChange} year={year} />
        <SegmentedControl
          ariaLabel='表示切替'
          value={displayMode}
          onChange={setDisplayMode}
          options={[
            { label: '試合一覧', value: 'Table' },
            { label: 'ランキング', value: 'Ranking' },
            { label: '観客動員', value: 'Spectator' },
          ]}
        />
      </section>

      <StatGrid
        compact
        items={[
          { label: '試合数', value: props.selectedGameList.length },
          {
            label: '総観客動員',
            value: totalSpectators.toLocaleString(),
          },
          { label: '表示シーズン', value: `${year}` },
        ]}
      />

      {displayMode === 'Table' ? (
        <SectionPanel title={`${year}シーズン 試合一覧`} meta={`${props.selectedGameList.length} matches`}>
          <GameInfoTable gameList={props.selectedGameList} />
        </SectionPanel>
      ) : null}
      {displayMode === 'Ranking' ? (
        <RankingPage year={year} selectedGameList={props.selectedGameList} />
      ) : null}
      {displayMode === 'Spectator' ? (
        <SpectatorPage year={year} selectedGameList={props.selectedGameList} />
      ) : null}
    </PageShell>
  );
};
