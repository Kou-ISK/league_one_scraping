import React, { Dispatch, useState } from 'react';

import { GameInfoTable } from './gameInfoTable';
import { Game } from '../types/game';
import { YearSelectionTabs } from './yearSelectionTabs';
import { RankingPage } from './rankingPage';
import { SpectatorMatch, SpectatorPage } from './spectatorPage';
import { DATA_SET } from '../variables';
import latestMatchesData from '../datas/generated/leagueOneMatches.json';
import { PageHero } from '../components/molecules/PageHero';
import { SectionPanel } from '../components/molecules/SectionPanel';
import { SegmentedControl } from '../components/molecules/SegmentedControl';
import { StatGrid } from '../components/molecules/StatGrid';
import { PageShell } from '../components/templates/PageShell';

interface PageProps {
  selectedGameList: Game[];
  setSelectedGameList: Dispatch<React.SetStateAction<Game[]>>;
}

type GeneratedMatch = {
  matchId: string;
  division: 'div1' | 'div2' | 'div3';
  displayDate: string;
  homeTeam: string;
  awayTeam: string;
  venue: string;
  matchUrl: string;
};

const latestMatches = latestMatchesData as GeneratedMatch[];

export const Page = (props: PageProps) => {
  const [year, setYear] = useState(2023);

  const [displayMode, setDisplayMode] = useState<
    'Table' | 'Ranking' | 'Spectator'
  >('Table');

  const handleChange = (event: React.ChangeEvent<{}>, value: number) => {
    setYear(value);
    if (value === 2026) {
      setDisplayMode('Spectator');
      return;
    }
    props.setSelectedGameList(DATA_SET[value]);
  };

  const spectatorMatches = getSpectatorMatches(year, props.selectedGameList);
  const totalSpectators = spectatorMatches.reduce(
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
            value: totalSpectators > 0 ? totalSpectators.toLocaleString() : 'N/A',
          },
          { label: '表示シーズン', value: formatSeasonLabel(year) },
        ]}
      />

      {displayMode === 'Table' ? (
        year === 2026 ? (
          <SectionPanel title='2025-26シーズン 試合一覧' meta='観客動員のみ対応'>
            <p className='empty-state'>最新シーズンは現在、観客動員テーブルのみ表示しています。</p>
          </SectionPanel>
        ) : (
          <SectionPanel title={`${year}シーズン 試合一覧`} meta={`${props.selectedGameList.length} matches`}>
            <GameInfoTable gameList={props.selectedGameList} />
          </SectionPanel>
        )
      ) : null}
      {displayMode === 'Ranking' ? (
        year === 2026 ? (
          <SectionPanel title='ランキング' meta='未対応'>
            <p className='empty-state'>最新シーズンのランキングは、詳細な得点経過データ取得後に表示します。</p>
          </SectionPanel>
        ) : (
          <RankingPage year={year} selectedGameList={props.selectedGameList} />
        )
      ) : null}
      {displayMode === 'Spectator' ? (
        <SpectatorPage year={year} matches={spectatorMatches} />
      ) : null}
    </PageShell>
  );
};

function getSpectatorMatches(year: number, games: Game[]): SpectatorMatch[] {
  if (year === 2026) {
    return latestMatches.map((match) => ({
      id: match.matchId,
      division: Number(match.division.replace('div', '')),
      date: match.displayDate,
      homeTeam: match.homeTeam,
      awayTeam: match.awayTeam,
      spectator: null,
      venue: match.venue,
      matchUrl: match.matchUrl,
    }));
  }

  return games.map((game) => ({
    id: String(game.id),
    division: game.division || 0,
    date: game.date,
    homeTeam: game.home_team,
    awayTeam: game.away_team,
    spectator: game.spectator === undefined || game.spectator === null ? null : String(game.spectator),
    venue: game.stadium,
  }));
}

function formatSeasonLabel(year: number) {
  if (year === 2026) return '2025-26';
  if (year === 2023) return '2023-24';
  if (year === 2022) return '2022-23';
  if (year === 2021) return '2022';
  return String(year);
}
