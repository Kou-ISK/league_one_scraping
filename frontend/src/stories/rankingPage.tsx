import { Game } from '../types/game';
import { ScoreRanking } from '../stories/scoreRanking';
import {
  ConcatOverAllScoreProgress,
  GetTop10ScorerByPlayerName,
  GetTop10SuccessRateGoalKickers,
  GetTop10TryScorerByPlayerName,
  GetTotalTeamScore,
} from '../utils/rankingUtils';
import { DIVISION_LIST } from '../variables';
import { SectionPanel } from '../components/molecules/SectionPanel';

interface RankingPageProps {
  year: number;
  selectedGameList: Game[];
}

export const RankingPage = (props: RankingPageProps) => {
  var top10Scorers: { [key: number]: any } = {};
  var top10TryScorers: { [key: number]: any } = {};
  var top10SuccessRateGoalKickers: { [key: number]: any } = {};
  var scoreForTheTeamList: { [key: number]: any } = {};
  var scoreAgainstTheTeamList: { [key: number]: any } = {};

  DIVISION_LIST.forEach((div) => {
    const selectedDivisionGameList = props.selectedGameList.filter(
      (item) => item.division === div
    );
    const top10Scorer = GetTop10ScorerByPlayerName(
      ConcatOverAllScoreProgress(selectedDivisionGameList)
    );
    const top10TryScorer = GetTop10TryScorerByPlayerName(
      ConcatOverAllScoreProgress(selectedDivisionGameList)
    );

    const top10SuccessRateGoalKicker = GetTop10SuccessRateGoalKickers(
      ConcatOverAllScoreProgress(selectedDivisionGameList)
    );

    const totalTeamScore = GetTotalTeamScore(selectedDivisionGameList);
    scoreForTheTeamList[div] = totalTeamScore.scoreFor;
    scoreAgainstTheTeamList[div] = totalTeamScore.scoreAgainst;
    top10Scorers[div] = top10Scorer;
    top10TryScorers[div] = top10TryScorer;
    top10SuccessRateGoalKickers[div] = top10SuccessRateGoalKicker;
  });

  const renderRankingGroup = (title: string, rankings: { [key: number]: any }) => (
    <SectionPanel title={title}>
      <div className='ranking-grid'>
        {DIVISION_LIST.map((division: number) => (
          <div className='ranking-for-division' key={`${title}-${division}`}>
            <h3>Div.{division}</h3>
            <ScoreRanking rankingTop10={rankings[division]} />
          </div>
        ))}
      </div>
    </SectionPanel>
  );

  return (
    <div className='ranking-page'>
      <h2>{props.year}シーズン 個人ランキング</h2>
      {renderRankingGroup('得点', top10Scorers)}
      {renderRankingGroup('トライ数', top10TryScorers)}
      {renderRankingGroup('ゴール成功率 10本以上試行', top10SuccessRateGoalKickers)}

      <h2>{props.year}シーズン チームランキング</h2>
      {renderRankingGroup('総得点', scoreForTheTeamList)}
      {renderRankingGroup('総失点', scoreAgainstTheTeamList)}
    </div>
  );
};
