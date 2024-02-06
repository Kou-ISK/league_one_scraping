import { Dispatch } from 'react';
import { Game } from '../types/game';
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
  const division1GameList = props.selectedGameList.filter(
    (item) => item.division === 1
  );
  const division2GameList = props.selectedGameList.filter(
    (item) => item.division === 2
  );
  const division3GameList = props.selectedGameList.filter(
    (item) => item.division === 3
  );

  const division1ScoreRankingTop10 = GetTop10ScorerByPlayerName(
    ConcatOverAllScoreProgress(division1GameList)
  );
  const division2ScoreRankingTop10 = GetTop10ScorerByPlayerName(
    ConcatOverAllScoreProgress(division2GameList)
  );
  const division3ScoreRankingTop10 = GetTop10ScorerByPlayerName(
    ConcatOverAllScoreProgress(division3GameList)
  );

  const division1TryRankingTop10 = GetTop10TryScorerByPlayerName(
    ConcatOverAllScoreProgress(division1GameList)
  );
  const division2TryRankingTop10 = GetTop10TryScorerByPlayerName(
    ConcatOverAllScoreProgress(division2GameList)
  );
  const division3TryRankingTop10 = GetTop10TryScorerByPlayerName(
    ConcatOverAllScoreProgress(division3GameList)
  );

  return (
    <>
      <h1>{props.year}シーズン 個人ランキング</h1>
      <div>
        <h2>得点</h2>
        <div style={{ display: 'flex' }}>
          {/* 中央寄せする */}
          <div>
            <h3>Div.1</h3>
            <ScoreRanking rankingTop10={division1ScoreRankingTop10} />
          </div>
          <div>
            <h3>Div.2</h3>
            <ScoreRanking rankingTop10={division2ScoreRankingTop10} />
          </div>
          <div>
            <h3>Div.3</h3>
            <ScoreRanking rankingTop10={division3ScoreRankingTop10} />
          </div>
        </div>
        <h2>トライ数</h2>
        <div style={{ display: 'flex' }}>
          <div>
            <h3>Div.1</h3>
            <ScoreRanking rankingTop10={division1TryRankingTop10} />
          </div>
          <div>
            <h3>Div.2</h3>
            <ScoreRanking rankingTop10={division2TryRankingTop10} />
          </div>
          <div>
            <h3>Div.3</h3>
            <ScoreRanking rankingTop10={division3TryRankingTop10} />
          </div>
        </div>
      </div>
    </>
  );
};
