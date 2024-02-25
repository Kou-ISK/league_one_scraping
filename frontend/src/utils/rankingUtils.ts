import { Game } from '../types/game';
import { ScoreInfo } from '../types/scoreInfo';
import { TeamMaster } from '../types/teamMaster';
import { ScoreTypes, TEAM_MASTER_DATA } from '../variables';

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

export const GetTotalTeamScore = (games: Game[]) => {
  var scoreForObjectList: any[] = [];
  var scoreAgainstObjectList: any[] = [];
  // チームのリストを作成
  const teamList: string[] = Array.from(
    new Set(games.map((game) => game.home_team as string))
  );

  // 該当チームがhome_teamだった時の得点、失点を算出
  teamList.forEach((team) => {
    const scoreForHomeTeam = games
      .filter((game) => game.home_team === team)
      .reduce((accumulator, currentValue) => {
        return accumulator + currentValue.home_team_score;
      }, 0);
    const scoreAgainstHomeTeam = games
      .filter((game) => game.home_team === team)
      .reduce((accumulator, currentValue) => {
        return accumulator + currentValue.away_team_score;
      }, 0);

    const scoreForAwayTeam = games
      .filter((game) => game.away_team === team)
      .reduce((accumulator, currentValue) => {
        return accumulator + currentValue.away_team_score;
      }, 0);
    const scoreAgainstAwayTeam = games
      .filter((game) => game.away_team === team)
      .reduce((accumulator, currentValue) => {
        return accumulator + currentValue.home_team_score;
      }, 0);

    const scoreForObject = {
      scorer: team,
      point: scoreForHomeTeam + scoreForAwayTeam,
    };
    const scoreAgainstObject = {
      scorer: team,
      point: scoreAgainstHomeTeam + scoreAgainstAwayTeam,
    };
    scoreForObjectList = [...scoreForObjectList, ...[scoreForObject]];
    scoreAgainstObjectList = [
      ...scoreAgainstObjectList,
      ...[scoreAgainstObject],
    ];
  });

  return {
    scoreFor: scoreForObjectList.sort((a, b) => b.point - a.point),
    scoreAgainst: scoreAgainstObjectList.sort((a, b) => a.point - b.point),
  };
};

export const getPhotoUrl = (scorer: string) => {
  let teamLogo: string | undefined;
  let playerPhoto: string | undefined;

  // TEAM_MASTER_DATA 配列をループして選手の写真を探す
  TEAM_MASTER_DATA.forEach((team: TeamMaster) => {
    const player = team.player_list.find(
      (player) => player.name === scorer || player.team_name === scorer
    );
    console.log(player);
    if (player) {
      // 選手が見つかった場合は写真を設定
      playerPhoto = player.photo;
      // チームのロゴも設定
      teamLogo = team.logo_url;
    }
  });

  return { teamLogo, playerPhoto };
};

export const parseScoreTypeName = (scoreType: string): string => {
  return ScoreTypes[scoreType as keyof typeof ScoreTypes] || scoreType;
};
