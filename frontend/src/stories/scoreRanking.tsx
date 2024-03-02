import { Card } from '@mui/material';
import { TEAM_MASTER_DATA } from '../variables';
import { getPhotoUrl } from '../utils/rankingUtils';

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
          <Card
            sx={{
              margin: '10px',
              padding: '10px',
              display: 'flex',
            }}
          >
            <h1>{index + 1}. </h1>
            {teamlogo && (
              <img src={teamlogo} alt='' width='auto' height='60px' />
            )}
            {!TEAM_MASTER_DATA.find(
              (team) => team.team_name === scoreInfo.scorer
            ) &&
              playerPhoto && (
                <img src={playerPhoto} alt='' width='auto' height='60px' />
              )}
            {scoreInfo.scorer}: {scoreInfo.point}
          </Card>
        );
      })}
    </>
  );
};
