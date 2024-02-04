import { Dispatch, useState } from 'react';
import { dataSet } from '../App';
import { Game } from '../types/game';
import { YearSelectionTabs } from './yearSelectionTabs';
import { ScoreRanking } from './scoreRanking';
import {
  ConcatOverAllScoreProgress,
  GetTop10ScorerByPlayerName,
} from '../utils/rankingUtils';

interface RankingPageProps {
  selectedGameList: Game[];
  setSelectedGameList: Dispatch<React.SetStateAction<Game[]>>;
}

export const RankingPage = (props: RankingPageProps) => {
  const [year, setYear] = useState(2023);

  const [scoreRankingTop10, setScoreRankingTop10] = useState(
    GetTop10ScorerByPlayerName(
      ConcatOverAllScoreProgress(props.selectedGameList)
    )
  );

  const handleChange = (event: React.ChangeEvent<{}>, value: number) => {
    setYear(value);
    setScoreRankingTop10(
      GetTop10ScorerByPlayerName(ConcatOverAllScoreProgress(dataSet[value]))
    );
  };

  return (
    <>
      <YearSelectionTabs handleChange={handleChange} year={year} />
      <h1>{year}シーズン 個人得点ランキング</h1>
      <ScoreRanking scoreRankingTop10={scoreRankingTop10} />
    </>
  );
};
