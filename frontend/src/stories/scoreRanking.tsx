interface ScoreRankingProps {
  rankingTop10: any[];
}

export const ScoreRanking = (props: ScoreRankingProps) => {
  return (
    <ul>
      {props.rankingTop10.map((scoreInfo: any, index: number) => {
        return (
          <li>
            {index + 1} {scoreInfo.scorer}: {scoreInfo.point}
          </li>
        );
      })}
    </ul>
  );
};
