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

export const GetTop10TryScorerByPlayerName = (
  scoreProgressList: ScoreInfo[]
) => {
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
    const point = scoreProgressList
      .filter((item) => item.player_name === player && item.score_type === 'T')
      .reduce((accumulator) => {
        return accumulator + 1;
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

export const GetTop10SuccessRateGoalKickers = (
  scoreProgressList: ScoreInfo[]
) => {
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
    const success = scoreProgressList.filter(
      (item) =>
        item.player_name === player &&
        (item.score_type === 'PG' || item.score_type === 'G')
    ).length;
    const failure = scoreProgressList.filter(
      (item) =>
        item.player_name === player &&
        (item.score_type === 'PGx' || item.score_type === 'Gx')
    ).length;
    const totalKicks = success + failure;
    const successRate =
      totalKicks < 10 ? 0 : ((success / totalKicks) * 100).toFixed(1);

    const scoreObject = {
      scorer: player,
      point: successRate + '%',
      rate: successRate,
    };
    scoreObjectList = [...scoreObjectList, ...[scoreObject]];
  });
  return scoreObjectList
    .sort((a, b) => b.rate - a.rate)
    .filter((_item, index) => index < 10 && _item.rate !== 0);
};
