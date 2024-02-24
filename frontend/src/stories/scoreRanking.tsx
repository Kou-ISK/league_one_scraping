import { Card } from '@mui/material';
import { TEAM_MASTER_DATA } from '../variables';
import { TeamMaster } from '../types/teamMaster';

interface ScoreRankingProps {
  rankingTop10: any[];
}

export const ScoreRanking = (props: ScoreRankingProps) => {
  return (
    <>
      {props.rankingTop10.map((scoreInfo: any, index: number) => {
        const teamlogo = getPhotoUrl(scoreInfo.scorer).teamLogo;
        const playerPhoto = getPhotoUrl(scoreInfo.scorer).playerPhoto;
        return (
          <Card sx={{ margin: '10px', padding: '10px', display: 'flex' }}>
            {teamlogo && (
              <img src={teamlogo} alt='' width='60px' height='60px' />
            )}
            {playerPhoto && <img src={playerPhoto} alt='' width='60px' />}
            {index + 1}. {scoreInfo.scorer}: {scoreInfo.point}
          </Card>
        );
      })}
    </>
  );
};

const getPhotoUrl = (scorer: string) => {
  let teamLogo: string | undefined;
  let playerPhoto: string | undefined;
  console.log(scorer);

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
