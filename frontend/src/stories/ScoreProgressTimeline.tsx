import { Card } from '@mui/material';
import { ScoreInfo } from '../types/scoreInfo';
import { getPhotoUrl, parseScoreTypeName } from '../utils/rankingUtils';

interface ScoreProgressTimelineProps {
  homeTeamName: string;
  awayTeamName: string;
  scoreProgress: ScoreInfo[];
}

export const ScoreProgressTimeline = (props: ScoreProgressTimelineProps) => {
  return (
    <div
      style={{
        maxHeight: '50vh',
        width: '30%',
        justifyContent: 'center',
        overflowY: 'scroll',
      }}
    >
      {props.scoreProgress.map((item) => (
        <Card
          sx={{
            display: 'flex',
            justifyContent: 'center',
            margin: '10px',
          }}
        >
          <img
            height='40px'
            src={getPhotoUrl(item.player_name as string).teamLogo}
            alt=''
          />

          <div style={{ textAlign: 'center' }}>
            <p>
              {item.half_type}
              {item.time}分 {item.player_name}
            </p>
            <p>{parseScoreTypeName(item.score_type)}</p>
            <h2>
              {item.home_team_score} - {item.away_team_score}
            </h2>
          </div>
        </Card>
      ))}
    </div>
  );
};
