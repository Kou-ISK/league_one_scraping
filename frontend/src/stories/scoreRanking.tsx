import { Card } from '@mui/material';

interface ScoreRankingProps {
  rankingTop10: any[];
}

export const ScoreRanking = (props: ScoreRankingProps) => {
  return (
    <>
      {props.rankingTop10.map((scoreInfo: any, index: number) => {
        return (
          <Card sx={{ margin: '10px', padding: '10px' }}>
            {index + 1}. {scoreInfo.scorer}: {scoreInfo.point}
          </Card>
        );
      })}
    </>
  );
};
