import { Dispatch, useState } from 'react';
import { dataSet } from '../App';
import { Game } from '../types/game';
import { YearSelectionTabs } from '../stories/yearSelectionTabs';
import { ScoreRanking } from '../stories/scoreRanking';
import {
  ConcatOverAllScoreProgress,
  GetTop10ScorerByPlayerName,
  GetTop10TryScorerByPlayerName,
} from '../utils/rankingUtils';

interface RankingPageProps {
  year: number;
  selectedGameList: Game[];
  setSelectedGameList: Dispatch<React.SetStateAction<Game[]>>;
}

export const RankingPage = (props: RankingPageProps) => {
  const scoreRankingTop10 = GetTop10ScorerByPlayerName(
    ConcatOverAllScoreProgress(props.selectedGameList)
  );

  const tryRankingTop10 = GetTop10TryScorerByPlayerName(
    ConcatOverAllScoreProgress(props.selectedGameList)
  );

  return (
    <>
      <h1>{props.year}シーズン 個人ランキング</h1>
      <div style={{ display: 'flex' }}>
        <div>
          <h2>得点</h2>
          <ScoreRanking rankingTop10={scoreRankingTop10} />
        </div>
        <div>
          <h2>トライ数</h2>
          <ScoreRanking rankingTop10={tryRankingTop10} />
        </div>
      </div>
    </>
  );
};
