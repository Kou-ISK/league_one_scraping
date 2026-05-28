import { TEAM_MASTER_DATA } from '../variables';
import { getPhotoUrl } from '../utils/rankingUtils';

interface ScoreRankingProps {
  rankingTop10: any[];
}

export const ScoreRanking = (props: ScoreRankingProps) => {
  return (
    <ol className='score-ranking-list'>
      {props.rankingTop10.map((scoreInfo: any, index: number) => {
        const teamlogo = getPhotoUrl(scoreInfo.scorer).teamLogo;
        const playerPhoto = getPhotoUrl(scoreInfo.scorer).playerPhoto;
        return (
          <li className='score-ranking-item' key={`${scoreInfo.scorer}-${index}`}>
            <span className={`score-ranking-rank rank-${index + 1}`}>{index + 1}</span>
            <div className='score-ranking-media'>
            {teamlogo ? (
              <img src={teamlogo} alt='' className='score-ranking-image' />
            ) : null}
            {!teamlogo && playerPhoto ? (
              <img src={playerPhoto} alt='' className='score-ranking-image' />
            ) : null}
            {!teamlogo && !playerPhoto ? (
              <span className='score-ranking-placeholder'>{String(scoreInfo.scorer).slice(0, 1)}</span>
            ) : null}
            </div>
            <div className='score-ranking-body'>
              <span className='score-ranking-name'>{scoreInfo.scorer}</span>
              <span className='score-ranking-sub'>
                {TEAM_MASTER_DATA.find((team) => team.team_name === scoreInfo.scorer)
                  ? 'Team'
                  : 'Player'}
              </span>
            </div>
            <div className='score-ranking-score'>
              <strong className='score-ranking-point'>{scoreInfo.point}</strong>
              <span>pt</span>
            </div>
          </li>
        );
      })}
    </ol>
  );
};
