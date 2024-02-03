import { Game } from '../types/game';
import {
  ConcatOverAllScoreProgress,
  GroupScoreObjectByPlayerName,
} from '../utils/concatOverAllScoreProgress';

interface ScoreRankingProps {
  selectedGameList: Game[];
}
export const ScoreRanking = (props: ScoreRankingProps) => {
  const scoreRankingTop10 = GroupScoreObjectByPlayerName(
    ConcatOverAllScoreProgress(props.selectedGameList)
  )
    .sort((a, b) => b.point - a.point)
    .filter((item, index) => index < 10);
  return (
    <ul>
      {scoreRankingTop10.map((scoreInfo: any, index: number) => {
        return (
          <li>
            {index + 1}.{scoreInfo.scorer}: {scoreInfo.point}
          </li>
        );
      })}
    </ul>
  );
};
