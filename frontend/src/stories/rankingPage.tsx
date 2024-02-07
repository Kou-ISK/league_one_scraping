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
  const divisions = [1, 2, 3];
  var top10Scorers: { [key: number]: any } = {};
  var top10TryScorers: { [key: number]: any } = {};
  divisions.forEach((div) => {
    const selectedDivisionGameList = props.selectedGameList.filter(
      (item) => item.division === div
    );
    const top10Scorer = GetTop10ScorerByPlayerName(
      ConcatOverAllScoreProgress(selectedDivisionGameList)
    );
    const top10TryScorer = GetTop10TryScorerByPlayerName(
      ConcatOverAllScoreProgress(selectedDivisionGameList)
    );
    top10Scorers[div] = top10Scorer;
    top10TryScorers[div] = top10TryScorer;
  });

  return (
    <>
      <h1>{props.year}シーズン 個人ランキング</h1>
      <div>
        <h2>得点</h2>
        <div style={{ display: 'flex' }}>
          {divisions.map((division: number) => (
            <div>
              <h3>Div.{division}</h3>
              <ScoreRanking rankingTop10={top10Scorers[division]} />
            </div>
          ))}
        </div>
        <h2>トライ数</h2>
        <div style={{ display: 'flex' }}>
          {divisions.map((division: number) => (
            <div>
              <h3>Div.{division}</h3>
              <ScoreRanking rankingTop10={top10Scorers[division]} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
