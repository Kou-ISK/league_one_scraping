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
            <span className='score-ranking-rank'>{index + 1}</span>
            {teamlogo && (
              <img src={teamlogo} alt='' className='score-ranking-image' />
            )}
            {!TEAM_MASTER_DATA.find(
              (team) => team.team_name === scoreInfo.scorer
            ) &&
              playerPhoto && (
                <img src={playerPhoto} alt='' className='score-ranking-image' />
              )}
            <span className='score-ranking-name'>{scoreInfo.scorer}</span>
            <strong className='score-ranking-point'>{scoreInfo.point}</strong>
          </li>
        );
      })}
    </ol>
  );
};
