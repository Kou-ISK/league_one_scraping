import { ScoreInfo } from '../types/scoreInfo';
import { getPhotoUrl, parseScoreTypeName } from '../utils/rankingUtils';

interface ScoreProgressTimelineProps {
  homeTeamName: string;
  awayTeamName: string;
  scoreProgress: ScoreInfo[];
}

export const ScoreProgressTimeline = (props: ScoreProgressTimelineProps) => {
  return (
    <div className='score-timeline'>
      {props.scoreProgress.map((item) => (
        <div className='score-timeline-item' key={`${item.half_type}-${item.time}-${item.player_name}-${item.score_type}`}>
          <img
            src={getPhotoUrl(item.player_name as string).teamLogo}
            alt=''
            className='score-timeline-logo'
          />

          <div>
            <p>
              {item.half_type}
              {item.time}分 {item.player_name}
            </p>
            <p>{parseScoreTypeName(item.score_type)}</p>
            <h2>
              {item.home_team_score} - {item.away_team_score}
            </h2>
          </div>
        </div>
      ))}
    </div>
  );
};
