import React, { useMemo, useState } from 'react';
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import { Page } from './stories/Page';
import { DATA_OF_2023 } from './variables';
import { Game } from './types/game';
import { PortalPage } from './PortalPage';
import { PageHero } from './components/molecules/PageHero';
import { SegmentedControl } from './components/molecules/SegmentedControl';
import { PageShell } from './components/templates/PageShell';
import teamsData from './datas/generated/leagueOneTeams.json';
import teamRoundStatsData from './datas/generated/teamRoundStats.json';
import stockPricesData from './datas/generated/stockPrices.json';
import seasonTeamTrendsData from './datas/generated/seasonTeamTrends.json';

type Division = 'all' | 'div1' | 'div2' | 'div3';

type LeagueOneTeam = {
  id: string;
  division: Division;
  name: string;
  shortName: string;
  logoUrl: string;
  companyName: string;
  yahooTicker: string;
  stockEnabled: boolean;
  stockNote: string;
};

type TeamMatch = {
  sequence: number;
  matchId: string;
  kickoff: string;
  displayDate: string;
  status: string;
  roundNumber: number | null;
  conference: string;
  officialMatchCode: string;
  venue: string;
  side: 'home' | 'away';
  opponentName: string;
  homeScore: number | null;
  awayScore: number | null;
  homeTries: number | null;
  awayTries: number | null;
  scoreLabel: string;
  result: 'win' | 'loss' | 'draw' | 'scheduled';
  resultLabel: string;
  rank: number | null;
  leaguePoints: number | null;
  matchLeaguePoints: number | null;
  wins: number | null;
  losses: number | null;
  draws: number | null;
  recordLabel: string;
  matchUrl: string;
  broadcasters: string[];
  countedInRecord: boolean;
  stockClose: number | null;
  stockChangePct: number | null;
};

type TeamRoundStats = {
  teamId: string;
  teamName: string;
  division: Division;
  matches: TeamMatch[];
  summary: {
    totalMatches: number;
    datedMatches: number;
    unscheduledDateMatches: number;
    recordEligibleMatches: number;
    wins: number;
    losses: number;
    draws: number;
    latestRank: number | null;
  };
};

type StockInfo = {
  teamId: string;
  ticker: string;
  status: string;
  source: string;
  note: string;
  prices: Array<{
    date: string;
    close: number;
    changePct: number;
  }>;
};

type SeasonTrend = {
  seasonId: string;
  label: string;
  complete: boolean;
  division: string;
  rank: number | null;
  wins: number;
  losses: number;
  draws: number;
  matches: number;
  leaguePoints: number | null;
  stockOpenClose: number | null;
  stockEndClose: number | null;
  stockAverageClose: number | null;
  stockReturnPct: number | null;
  note: string;
};

type TeamSeasonTrend = {
  teamId: string;
  seasons: SeasonTrend[];
};

const teams = teamsData as LeagueOneTeam[];
const teamRoundStats = teamRoundStatsData as TeamRoundStats[];
const stockPrices = stockPricesData as Record<string, StockInfo>;
const seasonTeamTrends = seasonTeamTrendsData as TeamSeasonTrend[];

const divisionLabels: Record<Division, string> = {
  all: 'All',
  div1: 'Division 1',
  div2: 'Division 2',
  div3: 'Division 3',
};

const divisionOptions: Division[] = ['all', 'div1', 'div2', 'div3'];
const stockMetricLabels = {
  average: 'シーズン平均株価',
  open: '開幕時株価',
  end: '終了時株価',
} as const;

type StockMetric = keyof typeof stockMetricLabels;

type ChartRow = {
  date: string;
  changePct: number | null;
  close: number | null;
  opponent: string;
  result: TeamMatch['result'];
  resultLabel: string;
  rank: number | null;
  rankLabel: string;
  recordLabel: string;
  scoreLabel: string;
  leaguePoints: number | null;
  matchLeaguePoints: number | null;
  stockLabel: string;
};

function App() {
  return <PortalPage />;
}

export function LegacyResultsPage() {
  const [selectedGameList, setSelectedGameList] = useState<Game[]>(DATA_OF_2023);

  return (
    <Page
      selectedGameList={selectedGameList}
      setSelectedGameList={setSelectedGameList}
    />
  );
}

export function LeagueOneDashboard() {
  const [selectedDivision, setSelectedDivision] = useState<Division>('all');
  const [selectedTeamId, setSelectedTeamId] = useState(teams[0]?.id || '');
  const [selectedStockMetric, setSelectedStockMetric] = useState<StockMetric>('average');

  const filteredTeams = useMemo(() => {
    return teams.filter(
      (team) => selectedDivision === 'all' || team.division === selectedDivision
    );
  }, [selectedDivision]);

  const selectedTeam = useMemo(() => {
    const visibleSelectedTeam = filteredTeams.find((team) => team.id === selectedTeamId);
    return visibleSelectedTeam || filteredTeams[0] || teams[0];
  }, [filteredTeams, selectedTeamId]);

  const selectedStats = teamRoundStats.find(
    (teamStats) => teamStats.teamId === selectedTeam.id
  );
  const selectedStock = stockPrices[selectedTeam.id];
  const selectedSeasonTrend = seasonTeamTrends.find(
    (trend) => trend.teamId === selectedTeam.id
  );
  const maxRank = selectedTeam.division === 'div1' ? 12 : selectedTeam.division === 'div2' ? 8 : 6;
  const stockEnabledCount = teams.filter((team) => team.stockEnabled).length;
  const seasonTrendRows =
    selectedSeasonTrend?.seasons
      .filter((season) => season.rank !== null || season.stockReturnPct !== null)
      .map((season) => ({
        label: season.label,
        rank: season.rank,
        stockPrice: getSeasonStockPrice(season, selectedStockMetric),
        stockOpenClose: season.stockOpenClose,
        stockEndClose: season.stockEndClose,
        stockAverageClose: season.stockAverageClose,
        recordLabel:
          season.matches > 0
            ? `${season.wins}勝${season.losses}敗${season.draws}分`
            : '戦績なし',
        leaguePoints: season.leaguePoints,
        note: season.note,
      })) || [];
  const latestSeasonRow = [...seasonTrendRows]
    .reverse()
    .find((row) => row.rank !== null || row.stockPrice !== null);
  const chartRows =
    selectedStats?.matches
      .filter((match) => match.stockChangePct !== null)
      .map((match) => ({
        date: match.displayDate.replace(/\(.+\)/, ''),
        changePct: match.stockChangePct,
        close: match.stockClose,
        opponent: match.opponentName,
        result: match.result,
        resultLabel: match.resultLabel,
        rank: match.rank,
        rankLabel: match.rank === null ? '順位未定' : `${match.rank}位`,
        recordLabel: match.recordLabel || '戦績未確定',
        scoreLabel: match.scoreLabel || 'スコア未取得',
        leaguePoints: match.leaguePoints,
        matchLeaguePoints: match.matchLeaguePoints,
        stockLabel:
          match.stockChangePct === null
            ? '株価 N/A'
            : `株価 ${match.stockChangePct.toFixed(2)}%`,
      })) || [];

  const onDivisionChange = (division: Division) => {
    setSelectedDivision(division);
    const nextTeam = teams.find((team) => division === 'all' || team.division === division);
    if (nextTeam) setSelectedTeamId(nextTeam.id);
  };

  return (
    <PageShell wide className='dashboard'>
      <PageHero
        eyebrow='JAPAN RUGBY LEAGUE ONE 2025-26'
        title='チーム別推移'
        description='順位、勝敗、親会社株価を同じ時間軸で比較します。'
        actions={
        <div className='hero-metrics' aria-label='データ件数'>
          <span>
            <strong>{teams.length}</strong>
            チーム
          </span>
          <span>
            <strong>{stockEnabledCount}</strong>
            株価対象
          </span>
        </div>
        }
      />

      <section className='control-band' aria-label='チーム選択'>
        <div className='selector-card'>
          <span className='selector-label'>Division</span>
          <SegmentedControl
            ariaLabel='Divisionフィルタ'
            value={selectedDivision}
            onChange={onDivisionChange}
            options={divisionOptions.map((division) => ({
              label: divisionLabels[division],
              value: division,
            }))}
          />
        </div>
        <div className='selector-card team-selector-card'>
          <label className='team-select-label' htmlFor='team-select'>
            チーム
          </label>
          <select
            id='team-select'
            value={selectedTeam.id}
            onChange={(event) => setSelectedTeamId(event.target.value)}
          >
            {filteredTeams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
        </div>
      </section>

      <div className='sticky-team-bar' aria-label='選択中チーム'>
        <div className='sticky-team-main'>
          {selectedTeam.logoUrl ? (
            <img src={selectedTeam.logoUrl} alt='' className='sticky-team-logo' />
          ) : null}
          <div>
            <p className='division-pill'>{divisionLabels[selectedTeam.division]}</p>
            <h2>{selectedTeam.name}</h2>
            <span>
              {selectedTeam.companyName || '親会社未設定'} / {selectedTeam.yahooTicker || 'N/A'}
            </span>
          </div>
        </div>
        <div className='sticky-team-stats'>
          <span>{formatRecord(selectedStats)}</span>
          <span>{formatLatestRank(selectedStats)}</span>
        </div>
      </div>

      <section className='team-facts-panel' aria-label='チーム概要'>
        <dl className='company-grid'>
          <div>
            <dt>親会社</dt>
            <dd>{selectedTeam.companyName || '未設定'}</dd>
          </div>
          <div>
            <dt>Ticker</dt>
            <dd>{selectedTeam.yahooTicker || 'N/A'}</dd>
          </div>
          <div>
            <dt>株価</dt>
            <dd>{formatStockStatus(selectedStock)}</dd>
          </div>
          <div>
            <dt>補足</dt>
            <dd>{selectedStock?.note || selectedTeam.stockNote || '-'}</dd>
          </div>
        </dl>
      </section>

      <section className='analysis-layout'>
        <div className='season-trend-panel'>
          <div className='section-heading'>
            <h3>年度別順位 x 親会社株価</h3>
            <span>{seasonTrendRows.length} seasons</span>
          </div>
          <div className='season-chart-toolbar'>
            <div className='chart-legend' aria-hidden='true'>
              <span className='legend-stock'>{stockMetricLabels[selectedStockMetric]}</span>
              <span className='legend-rank'>年度順位</span>
            </div>
            <div className='metric-tabs' aria-label='株価指標'>
              {Object.entries(stockMetricLabels).map(([metric, label]) => (
                <button
                  key={metric}
                  type='button'
                  className={selectedStockMetric === metric ? 'active' : ''}
                  onClick={() => setSelectedStockMetric(metric as StockMetric)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <p className='chart-note'>
            ラグビー成績と親会社株価の相関を見るための参考表示です。因果関係を示すものではありません。
          </p>
          {seasonTrendRows.length > 0 ? (
            <>
              <ResponsiveContainer width='100%' height={310}>
                <LineChart data={seasonTrendRows} margin={{ top: 24, right: 20, bottom: 16, left: 0 }}>
                  <CartesianGrid stroke='#d9e2e1' strokeDasharray='3 3' />
                  <XAxis dataKey='label' tick={{ fontSize: 11 }} />
                  <YAxis
                    yAxisId='stock'
                    tick={{ fontSize: 11 }}
                    tickFormatter={(value) => String(Math.round(Number(value))).toLocaleString()}
                    width={70}
                  />
                  <YAxis
                    yAxisId='rank'
                    orientation='right'
                    reversed
                    domain={[1, maxRank]}
                    allowDecimals={false}
                    tick={{ fontSize: 11 }}
                    tickFormatter={(value) => `${value}位`}
                    width={46}
                  />
                  <Tooltip
                    formatter={(value, name) => {
                      if (name === 'stockPrice') {
                        return [Number(value).toLocaleString(), stockMetricLabels[selectedStockMetric]];
                      }
                      if (name === 'rank') return [`${value}位`, '年度順位'];
                      return [value, name];
                    }}
                    labelFormatter={(label, payload) => {
                      const row = payload && payload[0]?.payload;
                      if (!row) return label;
                      return [
                        label,
                        row.recordLabel,
                        row.leaguePoints === null ? '勝点未確定' : `勝点 ${row.leaguePoints}`,
                        row.note,
                      ]
                        .filter(Boolean)
                        .join(' / ');
                    }}
                  />
                  <Line
                    yAxisId='stock'
                    type='monotone'
                    dataKey='stockPrice'
                    stroke='#006a67'
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: '#006a67' }}
                    activeDot={{ r: 5 }}
                    connectNulls
                  />
                  <Line
                    yAxisId='rank'
                    type='monotone'
                    dataKey='rank'
                    stroke='#b98216'
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: '#b98216' }}
                    activeDot={{ r: 5 }}
                    connectNulls
                  />
                </LineChart>
              </ResponsiveContainer>
              <div className='season-trend-table-wrap'>
                <table className='season-trend-table'>
                  <thead>
                    <tr>
                      <th>年度</th>
                      <th>順位</th>
                      <th>戦績</th>
                      <th>勝点</th>
                      <th>{stockMetricLabels[selectedStockMetric]}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {seasonTrendRows.map((row) => (
                      <tr key={row.label}>
                        <td>{row.label}</td>
                        <td>{row.rank === null ? '順位未定' : `${row.rank}位`}</td>
                        <td>{row.recordLabel}</td>
                        <td>{row.leaguePoints === null ? '-' : row.leaguePoints}</td>
                        <td>{formatStockPrice(row.stockPrice)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div className='empty-chart'>N/A</div>
          )}
        </div>

        <aside className='insight-panel' aria-label='現在サマリー'>
          <div className='section-heading'>
            <h3>現在値</h3>
            <span>{selectedTeam.shortName}</span>
          </div>
          <dl className='insight-list'>
            <div>
              <dt>現在順位</dt>
              <dd>{formatLatestRank(selectedStats)}</dd>
            </div>
            <div>
              <dt>現在戦績</dt>
              <dd>{formatRecord(selectedStats)}</dd>
            </div>
            <div>
              <dt>順位計算対象</dt>
              <dd>{selectedStats?.summary.recordEligibleMatches || 0}試合</dd>
            </div>
            <div>
              <dt>{stockMetricLabels[selectedStockMetric]}</dt>
              <dd>{formatStockPrice(latestSeasonRow?.stockPrice ?? null)}</dd>
            </div>
            <div>
              <dt>株価取得</dt>
              <dd>{formatStockStatus(selectedStock)}</dd>
            </div>
          </dl>
          <p className='insight-note'>
            年度推移は順位と株価水準、試合推移は大会中の順位変化と終値変化率を表示します。
          </p>
        </aside>
      </section>

      <section className='chart-panel in-season-panel'>
        <div className='section-heading'>
          <h3>シーズン内順位 x 終値変化率</h3>
          <span>{selectedTeam.yahooTicker || 'N/A'}</span>
        </div>
        <div className='chart-legend' aria-hidden='true'>
          <span className='legend-stock'>株価変化率</span>
          <span className='legend-rank'>節終了時順位</span>
        </div>
        {chartRows.length > 0 ? (
          <ResponsiveContainer width='100%' height={320}>
            <LineChart data={chartRows} margin={{ top: 28, right: 20, bottom: 20, left: 0 }}>
              <CartesianGrid stroke='#d9e2e1' strokeDasharray='3 3' />
              <XAxis dataKey='date' tick={{ fontSize: 11 }} minTickGap={20} />
              <YAxis
                yAxisId='stock'
                tick={{ fontSize: 11 }}
                tickFormatter={(value) => `${value}%`}
                width={56}
              />
              <YAxis
                yAxisId='rank'
                orientation='right'
                reversed
                domain={[1, maxRank]}
                allowDecimals={false}
                tick={{ fontSize: 11 }}
                tickFormatter={(value) => `${value}位`}
                width={46}
              />
              <Tooltip
                formatter={(value, name, item) => {
                  if (name === 'changePct') {
                    return [`${Number(value).toFixed(2)}%`, '変化率'];
                  }
                  if (name === 'rank') {
                    return [`${value}位`, '節終了時順位'];
                  }
                  return [value, item.name];
                }}
                labelFormatter={(_, payload) =>
                  payload && payload[0]
                    ? formatTooltipLabel(payload[0].payload)
                    : ''
                }
              />
              <Line
                yAxisId='stock'
                type='monotone'
                dataKey='changePct'
                stroke='#006a67'
                strokeWidth={2.5}
                dot={<MatchDot />}
                activeDot={{ r: 5 }}
              />
              <Line
                yAxisId='rank'
                type='stepAfter'
                dataKey='rank'
                stroke='#b98216'
                strokeWidth={2}
                dot={{ r: 3, fill: '#b98216' }}
                activeDot={{ r: 5 }}
                connectNulls
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className='empty-chart'>N/A</div>
        )}
      </section>

      <section className='match-section'>
        <div className='section-heading'>
          <h3>節/試合一覧</h3>
          <span>{selectedStats?.matches.length || 0} matches</span>
        </div>
        <div className='match-table-wrap'>
          <table className='match-table'>
            <thead>
              <tr>
                <th>日付</th>
                <th>対戦相手</th>
                <th>会場</th>
                <th>放送</th>
                <th>状態</th>
                <th>戦績</th>
                <th>勝点</th>
                <th>順位</th>
                <th>株価</th>
                <th>URL</th>
              </tr>
            </thead>
            <tbody>
              {(selectedStats?.matches || []).map((match) => (
                <tr key={match.matchId}>
                  <td>{match.displayDate}</td>
                  <td>
                    <span className='side-badge'>{match.side === 'home' ? 'H' : 'A'}</span>
                    {match.opponentName}
                  </td>
                  <td>{match.venue || '-'}</td>
                  <td>{match.broadcasters.length ? match.broadcasters.join(' / ') : '-'}</td>
                  <td>{match.status}</td>
                  <td>
                    <span className={`result-badge ${match.result}`}>
                      {match.resultLabel}
                    </span>
                    {match.scoreLabel ? ` ${match.scoreLabel}` : ''}
                  </td>
                  <td>{match.matchLeaguePoints === null ? '-' : `+${match.matchLeaguePoints}`}</td>
                  <td>{match.rank === null ? '順位未定' : `${match.rank}位`}</td>
                  <td>
                    {match.stockChangePct === null
                      ? 'N/A'
                      : `${match.stockChangePct.toFixed(2)}%`}
                  </td>
                  <td>
                    {match.matchUrl ? (
                      <a href={match.matchUrl} target='_blank' rel='noreferrer'>
                        Match
                      </a>
                    ) : (
                      '-'
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </PageShell>
  );
}

function formatStockStatus(stockInfo?: StockInfo) {
  if (!stockInfo) return 'N/A';
  if (stockInfo.status === 'ok') return '取得済み';
  if (stockInfo.status === 'cached') return 'キャッシュ';
  if (stockInfo.status === 'disabled') return 'N/A';
  return '取得失敗';
}

function formatRecord(stats?: TeamRoundStats) {
  if (!stats || stats.summary.recordEligibleMatches === 0) return '未確定';
  return `${stats.summary.wins}-${stats.summary.losses}-${stats.summary.draws}`;
}

function formatLatestRank(stats?: TeamRoundStats) {
  if (!stats || stats.summary.latestRank === null) return '未定';
  return `${stats.summary.latestRank}位`;
}

function formatStockPrice(value: number | null | undefined) {
  if (value === null || value === undefined) return 'N/A';
  return Number(value).toLocaleString(undefined, {
    maximumFractionDigits: 1,
  });
}

function formatTooltipLabel(payload: ChartRow) {
  return [
    `${payload.date} / ${payload.opponent}`,
    `${payload.resultLabel} / ${payload.rankLabel} / ${payload.recordLabel} / 勝点${
      payload.leaguePoints === null ? '未確定' : payload.leaguePoints
    }`,
    payload.matchLeaguePoints === null ? '獲得勝点未確定' : `この試合 +${payload.matchLeaguePoints}`,
    payload.stockLabel,
    payload.scoreLabel,
  ].join(' ');
}

function getSeasonStockPrice(season: SeasonTrend, metric: StockMetric) {
  if (metric === 'open') return season.stockOpenClose;
  if (metric === 'end') return season.stockEndClose;
  return season.stockAverageClose;
}

function MatchDot(props: {
  cx?: number;
  cy?: number;
  payload?: ChartRow;
}) {
  const { cx, cy, payload } = props;
  if (typeof cx !== 'number' || typeof cy !== 'number' || !payload) return null;

  const fillByResult = {
    win: '#006a67',
    loss: '#b42318',
    draw: '#b98216',
    scheduled: '#657174',
  };
  const label = payload.rank === null
    ? payload.resultLabel
    : `${payload.resultLabel} ${payload.rank}位`;

  return (
    <g>
      <circle
        cx={cx}
        cy={cy}
        r={5}
        fill={fillByResult[payload.result]}
        stroke='#ffffff'
        strokeWidth={2}
      />
      <text
        x={cx}
        y={cy - 11}
        className='chart-point-label'
        textAnchor='middle'
      >
        {label}
      </text>
    </g>
  );
}

export default App;
