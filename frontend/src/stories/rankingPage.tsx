import { Game } from '../types/game';
import { ScoreRanking } from '../stories/scoreRanking';
import {
  ConcatOverAllScoreProgress,
  GetTop10ScorerByPlayerName,
  GetTop10SuccessRateGoalKickers,
  GetTop10TryScorerByPlayerName,
  GetTotalTeamScore,
} from '../utils/rankingUtils';
import './rankingPage.css';
import { DIVISION_LIST } from '../variables';

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

  return (
    <>
      <h1>{props.year}シーズン 個人ランキング</h1>
      <div>
        <h2>得点</h2>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          {DIVISION_LIST.map((division: number) => (
            <div className='ranking-for-division'>
              <h3>Div.{division}</h3>
              <ScoreRanking rankingTop10={top10Scorers[division]} />
            </div>
          ))}
        </div>
        <h2>トライ数</h2>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          {DIVISION_LIST.map((division: number) => (
            <div className='ranking-for-division'>
              <h3>Div.{division}</h3>
              <ScoreRanking rankingTop10={top10TryScorers[division]} />
            </div>
          ))}
        </div>
      </div>
      <h2>ゴール成功率(10本以上試行)</h2>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        {DIVISION_LIST.map((division: number) => (
          <div className='ranking-for-division'>
            <h3>Div.{division}</h3>
            <ScoreRanking
              rankingTop10={top10SuccessRateGoalKickers[division]}
            />
          </div>
        ))}
      </div>

      <h1>{props.year}シーズン チームランキング</h1>
      <h2>総得点</h2>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        {DIVISION_LIST.map((division: number) => (
          <div className='ranking-for-division'>
            <h3>Div.{division}</h3>
            <ScoreRanking rankingTop10={scoreForTheTeamList[division]} />
          </div>
        ))}
      </div>
      <h2>総失点</h2>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        {DIVISION_LIST.map((division: number) => (
          <div className='ranking-for-division'>
            <h3>Div.{division}</h3>
            <ScoreRanking rankingTop10={scoreAgainstTheTeamList[division]} />
          </div>
        ))}
      </div>
    </>
  );
};
