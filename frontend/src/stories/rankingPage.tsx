import { dataSet } from '../App';
import {
  ConcatOverAllScoreProgress,
  GroupScoreObjectByPlayerName,
} from '../utils/concatOverAllScoreProgress';

export const RankingPage = () => {
  // TODO 年度を選択できるようにする
  const gameList = dataSet['2023'];
  const scoreProgress = GroupScoreObjectByPlayerName(
    ConcatOverAllScoreProgress(gameList)
  ).sort((a, b) => b.point - a.point);
  return (
    <ul>
      {scoreProgress.map((scoreInfo: any, index: number) => {
        return (
          <li>
            {index + 1}.{scoreInfo.scorer}: {scoreInfo.point}
          </li>
        );
      })}
    </ul>
  );
};
