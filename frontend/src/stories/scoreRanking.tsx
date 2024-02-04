interface ScoreRankingProps {
  scoreRankingTop10: any[];
}

export const ScoreRanking = (props: ScoreRankingProps) => {
  return (
    <ul>
      {props.scoreRankingTop10.map((scoreInfo: any, index: number) => {
        return (
          <li>
            {index + 1} {scoreInfo.scorer}: {scoreInfo.point} pts
          </li>
        );
      })}
    </ul>
  );
};
