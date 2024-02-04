import { Game } from '../types/game';
import { ScoreInfo } from '../types/scoreInfo';

export const ConcatOverAllScoreProgress = (gameList: Game[]) => {
  var overAllscoreProgressList: ScoreInfo[] = [];

  gameList.forEach((game) => {
    overAllscoreProgressList = [
      ...overAllscoreProgressList,
      ...game.score_progress,
    ];
  });

  return overAllscoreProgressList;
};

const scoreTypeAndPoint = {
  T: 5,
  PG: 3,
  PGx: 0,
  DG: 3,
  DGx: 0,
  G: 2,
  Gx: 0,
} as const;

export const GetTop10ScorerByPlayerName = (scoreProgressList: ScoreInfo[]) => {
  var scoreObjectList: any[] = [];
  // 選手名のリストを作成
  const playerList: string[] = Array.from(
    new Set(
      scoreProgressList.map(
        (scoreInfo: ScoreInfo) => scoreInfo.player_name as string
      )
    )
  );
  playerList.forEach((player) => {
    var point: number = scoreProgressList
      .filter((item) => item.player_name === player)
      .map(
        (item) =>
          scoreTypeAndPoint[
            item.score_type as 'T' | 'PG' | 'PGx' | 'DG' | 'DGx' | 'G' | 'Gx'
          ] as number
      )
      .reduce((accumulator, currentValue) => {
        return accumulator + currentValue;
      }, 0);

    const scoreObject = {
      scorer: player,
      point: point,
      scoreObject: scoreProgressList.filter(
        (item) => item.player_name === player
      ),
    };
    scoreObjectList = [...scoreObjectList, ...[scoreObject]];
  });
  return scoreObjectList
    .sort((a, b) => b.point - a.point)
    .filter((_item, index) => index < 10);
};
