import { Dispatch, useState } from 'react';
import { dataSet } from '../App';
import { Game } from '../types/game';
import { YearSelectionTabs } from './yearSelectionTabs';
import { ScoreRanking } from './scoreRanking';

interface RankingPageProps {
  selectedGameList: Game[];
  setSelectedGameList: Dispatch<React.SetStateAction<Game[]>>;
}

export const RankingPage = (props: RankingPageProps) => {
  const [year, setYear] = useState(2023);

  // TODO 毎回yearの初期値のタブが選択される問題に対処する
  const handleChange = (event: React.ChangeEvent<{}>, value: number) => {
    setYear(value);
    props.setSelectedGameList(dataSet[year]);
  };

  return (
    <>
      <YearSelectionTabs handleChange={handleChange} year={year} />
      <h1>{year}シーズン 個人得点ランキング</h1>
      <p>注意: タブ選択切り替え時に表示バグがあります</p>
      <ScoreRanking selectedGameList={props.selectedGameList} />
    </>
  );
};
