const fs = require('fs');
const https = require('https');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const RUGBY_DATA = path.resolve(ROOT, '../../rugby_scraper/data');
const GENERATED_DIR = path.resolve(ROOT, 'src/datas/generated');
const TEAM_COMPANY_MAP_PATH = path.resolve(ROOT, 'src/datas/teamCompanyMap.json');
const DIVISIONS = [
  { id: 'div1', competitionId: 'jrlo-div1', expectedTeams: 12 },
  { id: 'div2', competitionId: 'jrlo-div2', expectedTeams: 8 },
  { id: 'div3', competitionId: 'jrlo-div3', expectedTeams: 6 },
];
const OFFICIAL_FINAL_STANDINGS_FALLBACK = {
  'jrlo-div1_2': { rank: 1, leaguePoints: 75, wins: 16, draws: 0, losses: 2 },
  'jrlo-div1_7': { rank: 2, leaguePoints: 74, wins: 16, draws: 0, losses: 2 },
  'jrlo-div1_1': { rank: 3, leaguePoints: 70, wins: 14, draws: 0, losses: 4 },
  'jrlo-div1_8': { rank: 4, leaguePoints: 48, wins: 9, draws: 0, losses: 9 },
  'jrlo-div1_4': { rank: 5, leaguePoints: 41, wins: 9, draws: 0, losses: 9 },
  'jrlo-div1_9': { rank: 6, leaguePoints: 39, wins: 8, draws: 0, losses: 10 },
  'jrlo-div1_12': { rank: 7, leaguePoints: 36, wins: 7, draws: 0, losses: 11 },
  'jrlo-div1_6': { rank: 8, leaguePoints: 34, wins: 7, draws: 0, losses: 11 },
  'jrlo-div1_3': { rank: 9, leaguePoints: 33, wins: 7, draws: 0, losses: 11 },
  'jrlo-div1_10': { rank: 10, leaguePoints: 30, wins: 6, draws: 0, losses: 12 },
  'jrlo-div1_11': { rank: 11, leaguePoints: 20, wins: 5, draws: 0, losses: 13 },
  'jrlo-div1_5': { rank: 12, leaguePoints: 20, wins: 4, draws: 0, losses: 14 },
  'jrlo-div2_8': { rank: 1, leaguePoints: 53, wins: 11, draws: 0, losses: 3 },
  'jrlo-div2_6': { rank: 2, leaguePoints: 45, wins: 10, draws: 0, losses: 4 },
  'jrlo-div2_7': { rank: 3, leaguePoints: 45, wins: 10, draws: 0, losses: 4 },
  'jrlo-div2_1': { rank: 4, leaguePoints: 39, wins: 8, draws: 0, losses: 6 },
  'jrlo-div2_3': { rank: 5, leaguePoints: 31, wins: 7, draws: 0, losses: 7 },
  'jrlo-div2_2': { rank: 6, leaguePoints: 29, wins: 6, draws: 0, losses: 8 },
  'jrlo-div2_4': { rank: 7, leaguePoints: 16, wins: 3, draws: 0, losses: 11 },
  'jrlo-div2_5': { rank: 8, leaguePoints: 7, wins: 1, draws: 0, losses: 13 },
  'jrlo-div3_2': { rank: 1, leaguePoints: 67, wins: 14, draws: 0, losses: 1 },
  'jrlo-div3_6': { rank: 2, leaguePoints: 63, wins: 12, draws: 1, losses: 2 },
  'jrlo-div3_1': { rank: 3, leaguePoints: 31, wins: 6, draws: 0, losses: 9 },
  'jrlo-div3_4': { rank: 4, leaguePoints: 25, wins: 5, draws: 2, losses: 8 },
  'jrlo-div3_5': { rank: 5, leaguePoints: 16, wins: 3, draws: 1, losses: 11 },
  'jrlo-div3_3': { rank: 6, leaguePoints: 16, wins: 3, draws: 0, losses: 12 },
};
const HISTORICAL_SEASONS = [
  {
    id: '2022',
    label: '2022',
    sourceFile: '2021_league_one_game_data.json',
    startDate: '2022-01-01',
    endDate: '2022-05-31',
    complete: true,
  },
  {
    id: '2022-23',
    label: '2022-23',
    sourceFile: '2022_league_one_game_data.json',
    startDate: '2022-12-01',
    endDate: '2023-05-31',
    complete: true,
  },
  {
    id: '2023-24',
    label: '2023-24',
    sourceFile: '2023_league_one_game_data.json',
    startDate: '2023-12-01',
    endDate: '2024-05-31',
    complete: false,
  },
  {
    id: '2025-26',
    label: '2025-26',
    sourceFile: '',
    startDate: '2025-12-01',
    endDate: '2026-06-30',
    complete: true,
  },
];
const TEAM_NAME_ALIASES = {
  'リコーブラックラムズ東京': 'jrlo-div1_4',
  'ブラックラムズ東京': 'jrlo-div1_4',
  'NECグリーンロケッツ東葛': 'jrlo-div2_1',
  'グリーンロケッツ東葛': 'jrlo-div2_1',
  'NTTドコモレッドハリケーンズ大阪': 'jrlo-div2_2',
  'レッドハリケーンズ大阪': 'jrlo-div2_2',
  '釜石シーウェイブスRFC': 'jrlo-div2_4',
  '日本製鉄釜石シーウェイブス': 'jrlo-div2_4',
  'スカイアクティブズ広島': 'jrlo-div3_2',
  'マツダスカイアクティブズ広島': 'jrlo-div3_2',
  '埼玉ワイルドナイツ': 'jrlo-div1_7',
  '埼玉パナソニックワイルドナイツ': 'jrlo-div1_7',
  '東京サンゴリアス': 'jrlo-div1_8',
  '東京サントリーサンゴリアス': 'jrlo-div1_8',
};

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJson(fileName, value) {
  fs.mkdirSync(GENERATED_DIR, { recursive: true });
  fs.writeFileSync(
    path.resolve(GENERATED_DIR, fileName),
    `${JSON.stringify(value, null, 2)}\n`
  );
}

function getJson(url) {
  return new Promise((resolve, reject) => {
    const request = https.get(
      url,
      {
        headers: {
          'User-Agent':
            'Mozilla/5.0 league-one-scraping data generation script',
        },
      },
      (response) => {
        if (response.statusCode < 200 || response.statusCode >= 300) {
          response.resume();
          reject(new Error(`HTTP ${response.statusCode}`));
          return;
        }

        let body = '';
        response.setEncoding('utf8');
        response.on('data', (chunk) => {
          body += chunk;
        });
        response.on('end', () => {
          try {
            resolve(JSON.parse(body));
          } catch (error) {
            reject(error);
          }
        });
      }
    );

    request.setTimeout(12000, () => {
      request.destroy(new Error('request timeout'));
    });
    request.on('error', reject);
  });
}

function getText(url) {
  return new Promise((resolve, reject) => {
    const request = https.get(
      url,
      {
        headers: {
          'User-Agent':
            'Mozilla/5.0 league-one-scraping data generation script',
        },
      },
      (response) => {
        if (response.statusCode < 200 || response.statusCode >= 300) {
          response.resume();
          reject(new Error(`HTTP ${response.statusCode}`));
          return;
        }

        let body = '';
        response.setEncoding('utf8');
        response.on('data', (chunk) => {
          body += chunk;
        });
        response.on('end', () => resolve(body));
      }
    );

    request.setTimeout(12000, () => {
      request.destroy(new Error('request timeout'));
    });
    request.on('error', reject);
  });
}

function toUnixSeconds(dateString) {
  return Math.floor(new Date(dateString).getTime() / 1000);
}

function toDateKey(dateString) {
  if (!dateString) return '';
  return new Date(dateString).toISOString().slice(0, 10);
}

function addDays(dateKey, days) {
  const date = new Date(`${dateKey}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

function normalizeDivision(competitionId) {
  return competitionId.replace('jrlo-', '');
}

function compareKickoff(a, b) {
  if (!a.kickoff && !b.kickoff) return a.matchId.localeCompare(b.matchId);
  if (!a.kickoff) return 1;
  if (!b.kickoff) return -1;
  return a.kickoff.localeCompare(b.kickoff);
}

function normalizeMatches() {
  return DIVISIONS.flatMap((division) => {
    const filePath = path.resolve(
      RUGBY_DATA,
      `matches/${division.competitionId}/2026.json`
    );
    return readJson(filePath).map((match) => {
      const score = getMatchScore(match);
      return {
        matchId: match.match_id,
        competitionId: match.competition_id,
        season: match.season,
        division: match.division || normalizeDivision(match.competition_id),
        round: match.round || '',
        status: match.status || 'unknown',
        roundNumber: firstNumber([match.round_number, match.roundNumber]),
        conference: match.conference || '',
        officialMatchCode: match.official_match_code || match.officialMatchCode || '',
        kickoff: match.kickoff || '',
        kickoffUtc: match.kickoff_utc || '',
        timezone: match.timezone || 'Asia/Tokyo',
        venue: match.venue || '',
        homeTeam: match.home_team || '',
        awayTeam: match.away_team || '',
        homeTeamId: match.home_team_id || '',
        awayTeamId: match.away_team_id || '',
        homeScore: score.homeScore,
        awayScore: score.awayScore,
        homeTries: firstNumber([match.home_tries, match.homeTries]),
        awayTries: firstNumber([match.away_tries, match.awayTries]),
        matchUrl: match.match_url || '',
        broadcasters: Array.isArray(match.broadcasters)
          ? match.broadcasters
          : [],
        hasKickoff: Boolean(match.kickoff),
        hasScore: score.homeScore !== null && score.awayScore !== null,
        displayDate: match.kickoff ? formatJaDate(match.kickoff) : '日時未定',
      };
    });
  });
}

function getMatchScore(match) {
  return {
    homeScore: firstNumber([
      match.home_score,
      match.homeScore,
      match.home_team_score,
      match.homeTeamScore,
      match.home_points,
      match.score && match.score.home,
      match.scores && match.scores.home,
    ]),
    awayScore: firstNumber([
      match.away_score,
      match.awayScore,
      match.away_team_score,
      match.awayTeamScore,
      match.away_points,
      match.score && match.score.away,
      match.scores && match.scores.away,
    ]),
  };
}

function firstNumber(values) {
  for (const value of values) {
    if (typeof value === 'number' && Number.isFinite(value)) return value;
    if (typeof value === 'string' && value.trim() !== '' && !Number.isNaN(Number(value))) {
      return Number(value);
    }
  }
  return null;
}

function formatJaDate(dateString) {
  return new Intl.DateTimeFormat('ja-JP', {
    timeZone: 'Asia/Tokyo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateString));
}

function buildTeams(allTeams, matches, companyMap) {
  const usedTeamIds = new Set();
  for (const match of matches) {
    if (match.homeTeamId) usedTeamIds.add(match.homeTeamId);
    if (match.awayTeamId) usedTeamIds.add(match.awayTeamId);
  }

  const teams = [...usedTeamIds]
    .sort((a, b) => {
      const [aDiv, aNo] = a.split('_');
      const [bDiv, bNo] = b.split('_');
      if (aDiv !== bDiv) return aDiv.localeCompare(bDiv);
      return Number(aNo) - Number(bNo);
    })
    .map((teamId) => {
      const source = allTeams[teamId];
      const company = companyMap.find((entry) => entry.teamId === teamId) || {};
      if (!source) {
        throw new Error(`Team ${teamId} was referenced by matches but missing from teams.json`);
      }

      return {
        id: teamId,
        competitionId: source.competition_id,
        division: normalizeDivision(source.competition_id),
        name: source.name,
        nameJa: source.name_ja || '',
        shortName: source.short_name || source.name,
        country: source.country || '',
        logoUrl: source.logo_url || source.badge_url || '',
        badgeUrl: source.badge_url || source.logo_url || '',
        companyName: company.companyName || '',
        yahooTicker: company.yahooTicker || '',
        stockEnabled: Boolean(company.stockEnabled && company.yahooTicker),
        stockNote: company.note || '親会社/ticker未設定',
      };
    });

  for (const division of DIVISIONS) {
    const count = teams.filter((team) => team.division === division.id).length;
    if (count !== division.expectedTeams) {
      throw new Error(
        `${division.id} team count mismatch: expected ${division.expectedTeams}, got ${count}`
      );
    }
  }

  return teams;
}

function buildTeamRoundStats(teams, matches, stockPrices) {
  const standingsTimeline = buildStandingsTimeline(teams, matches);

  return teams.map((team) => {
    const teamMatches = matches
      .filter(
        (match) => match.homeTeamId === team.id || match.awayTeamId === team.id
      )
      .sort(compareKickoff)
      .map((match, index) => {
        const isHome = match.homeTeamId === team.id;
        const opponentId = isHome ? match.awayTeamId : match.homeTeamId;
        const opponentName = isHome ? match.awayTeam : match.homeTeam;
        const dateKey = toDateKey(match.kickoff);
        const stockPoint = findCloseForDate(stockPrices[team.id], dateKey);
        const standing = standingsTimeline.get(`${match.matchId}:${team.id}`);
        const result = getResultForTeam(match, team.id);

        return {
          sequence: index + 1,
          matchId: match.matchId,
          division: match.division,
          kickoff: match.kickoff,
          kickoffUtc: match.kickoffUtc,
          displayDate: match.displayDate,
          status: match.status,
          roundNumber: match.roundNumber,
          conference: match.conference,
          officialMatchCode: match.officialMatchCode,
          venue: match.venue,
          side: isHome ? 'home' : 'away',
          opponentId,
          opponentName,
          homeScore: match.homeScore,
          awayScore: match.awayScore,
          homeTries: match.homeTries,
          awayTries: match.awayTries,
          scoreLabel: match.hasScore ? `${match.homeScore}-${match.awayScore}` : '',
          result,
          resultLabel: formatResultLabel(result),
          rank: standing ? standing.rank : null,
          leaguePoints: standing ? standing.leaguePoints : null,
          matchLeaguePoints: standing ? standing.lastMatchLeaguePoints : null,
          wins: standing ? standing.wins : null,
          losses: standing ? standing.losses : null,
          draws: standing ? standing.draws : null,
          pointsFor: standing ? standing.pointsFor : null,
          pointsAgainst: standing ? standing.pointsAgainst : null,
          pointsDiff: standing ? standing.pointsDiff : null,
          recordLabel: standing
            ? `${standing.wins}勝${standing.losses}敗${standing.draws}分`
            : '',
          matchUrl: match.matchUrl,
          broadcasters: match.broadcasters,
          countedInRecord: isStandingsEligibleMatch(match),
          stockClose: stockPoint ? stockPoint.close : null,
          stockChangePct: stockPoint ? stockPoint.changePct : null,
        };
      });

    return {
      teamId: team.id,
      teamName: team.name,
      division: team.division,
      matches: teamMatches,
      summary: {
        totalMatches: teamMatches.length,
        datedMatches: teamMatches.filter((match) => match.kickoff).length,
        unscheduledDateMatches: teamMatches.filter((match) => !match.kickoff)
          .length,
        recordEligibleMatches: teamMatches.filter((match) => match.countedInRecord)
          .length,
        wins: lastNumber(teamMatches, 'wins') || 0,
        losses: lastNumber(teamMatches, 'losses') || 0,
        draws: lastNumber(teamMatches, 'draws') || 0,
        latestRank: lastNumber(teamMatches, 'rank'),
      },
    };
  });
}

function buildStandingsTimeline(teams, matches) {
  const timeline = new Map();

  for (const division of DIVISIONS) {
    const divisionTeams = teams.filter((team) => team.division === division.id);
    const standings = new Map(
      divisionTeams.map((team) => [
        team.id,
        {
          teamId: team.id,
          wins: 0,
          losses: 0,
          draws: 0,
          leaguePoints: 0,
          lastMatchLeaguePoints: 0,
          pointsFor: 0,
          pointsAgainst: 0,
          pointsDiff: 0,
          rank: null,
        },
      ])
    );

    const completedMatches = matches
      .filter((match) => match.division === division.id && isStandingsEligibleMatch(match))
      .sort(compareKickoff);
    const roundGroups = groupMatchesByRound(completedMatches);

    for (const roundMatches of roundGroups) {
      for (const match of roundMatches) {
        const home = standings.get(match.homeTeamId);
        const away = standings.get(match.awayTeamId);
        if (!home || !away) continue;

        const points = getLeaguePoints(match);
        applyMatchToStanding(home, match.homeScore, match.awayScore, points.home);
        applyMatchToStanding(away, match.awayScore, match.homeScore, points.away);
      }

      applyRanks(standings);

      for (const match of roundMatches) {
        const home = standings.get(match.homeTeamId);
        const away = standings.get(match.awayTeamId);
        if (home) timeline.set(`${match.matchId}:${match.homeTeamId}`, { ...home });
        if (away) timeline.set(`${match.matchId}:${match.awayTeamId}`, { ...away });
      }
    }
  }

  return timeline;
}

function isStandingsEligibleMatch(match) {
  return Boolean(
    match.kickoff &&
      match.homeTeamId &&
      match.awayTeamId &&
      match.hasScore &&
      isFinishedStatus(match.status) &&
      !isPlaceholderTeam(match.homeTeam) &&
      !isPlaceholderTeam(match.awayTeam) &&
      !isKnockoutOrReplacementMatch(match)
  );
}

function isFinishedStatus(status) {
  const normalized = String(status || '').toLowerCase();
  return (
    normalized === 'finished' ||
    normalized === 'final' ||
    normalized === 'completed' ||
    normalized.includes('finish') ||
    normalized.includes('終了')
  );
}

function isPlaceholderTeam(teamName) {
  return /リーグ戦|準々決勝|準決勝|決勝|勝者|敗者/.test(teamName || '');
}

function isKnockoutOrReplacementMatch(match) {
  const text = [
    match.round,
    match.officialMatchCode,
    match.homeTeam,
    match.awayTeam,
  ].join(' ');
  return /PO|プレーオフ|準々決勝|準決勝|決勝|入替戦/.test(text);
}

function groupMatchesByRound(matches) {
  const groups = new Map();
  for (const match of matches) {
    const roundKey =
      match.roundNumber !== null && match.roundNumber !== undefined
        ? `round:${match.roundNumber}`
        : `date:${toDateKey(match.kickoff)}`;
    if (!groups.has(roundKey)) groups.set(roundKey, []);
    groups.get(roundKey).push(match);
  }

  return [...groups.entries()]
    .sort(([leftKey, leftMatches], [rightKey, rightMatches]) => {
      const leftRound = leftKey.match(/^round:(\d+)/);
      const rightRound = rightKey.match(/^round:(\d+)/);
      if (leftRound && rightRound) return Number(leftRound[1]) - Number(rightRound[1]);
      if (leftRound) return -1;
      if (rightRound) return 1;
      return compareKickoff(leftMatches[0], rightMatches[0]);
    })
    .map(([, roundMatches]) => roundMatches.sort(compareKickoff));
}

function getLeaguePoints(match) {
  let home = 0;
  let away = 0;

  if (match.homeScore > match.awayScore) {
    home += 4;
    if (match.homeTries !== null && match.awayTries !== null && match.homeTries - match.awayTries >= 3) {
      home += 1;
    }
    if (match.homeScore - match.awayScore <= 7) away += 1;
  } else if (match.awayScore > match.homeScore) {
    away += 4;
    if (match.homeTries !== null && match.awayTries !== null && match.awayTries - match.homeTries >= 3) {
      away += 1;
    }
    if (match.awayScore - match.homeScore <= 7) home += 1;
  } else {
    home += 2;
    away += 2;
  }

  return { home, away };
}

function applyMatchToStanding(standing, pointsFor, pointsAgainst, leaguePoints) {
  standing.pointsFor += pointsFor;
  standing.pointsAgainst += pointsAgainst;
  standing.pointsDiff = standing.pointsFor - standing.pointsAgainst;
  standing.leaguePoints += leaguePoints;
  standing.lastMatchLeaguePoints = leaguePoints;

  if (pointsFor > pointsAgainst) {
    standing.wins += 1;
  } else if (pointsFor < pointsAgainst) {
    standing.losses += 1;
  } else {
    standing.draws += 1;
  }
}

function applyRanks(standings) {
  const ordered = [...standings.values()].sort((a, b) => {
    if (b.leaguePoints !== a.leaguePoints) return b.leaguePoints - a.leaguePoints;
    if (b.wins !== a.wins) return b.wins - a.wins;
    if (b.pointsDiff !== a.pointsDiff) return b.pointsDiff - a.pointsDiff;
    if (b.pointsFor !== a.pointsFor) return b.pointsFor - a.pointsFor;
    return a.teamId.localeCompare(b.teamId);
  });

  ordered.forEach((standing, index) => {
    standing.rank = index + 1;
  });
}

function getResultForTeam(match, teamId) {
  if (!match.hasScore || !isFinishedStatus(match.status)) return 'scheduled';
  const isHome = match.homeTeamId === teamId;
  const pointsFor = isHome ? match.homeScore : match.awayScore;
  const pointsAgainst = isHome ? match.awayScore : match.homeScore;
  if (pointsFor > pointsAgainst) return 'win';
  if (pointsFor < pointsAgainst) return 'loss';
  return 'draw';
}

function formatResultLabel(result) {
  if (result === 'win') return 'W';
  if (result === 'loss') return 'L';
  if (result === 'draw') return 'D';
  return '予定';
}

function lastNumber(matches, key) {
  for (let index = matches.length - 1; index >= 0; index -= 1) {
    const value = matches[index][key];
    if (typeof value === 'number') return value;
  }
  return null;
}

function findCloseForDate(stockInfo, dateKey) {
  if (!stockInfo || !dateKey || !Array.isArray(stockInfo.prices)) return null;
  return stockInfo.prices.find((price) => price.date === dateKey) || null;
}

function getDateRange(matches) {
  const dateKeys = matches
    .map((match) => toDateKey(match.kickoff))
    .filter(Boolean)
    .sort();
  const seasonDateKeys = HISTORICAL_SEASONS.flatMap((season) => [
    season.startDate,
    season.endDate,
  ]);

  if (!dateKeys.length) {
    return {
      startDate: seasonDateKeys[0],
      endDate: addDays(seasonDateKeys[seasonDateKeys.length - 1], 1),
    };
  }

  const allDateKeys = [...dateKeys, ...seasonDateKeys].sort();
  return {
    startDate: addDays(allDateKeys[0], -8),
    endDate: addDays(allDateKeys[allDateKeys.length - 1], 8),
  };
}

async function fetchStockPrices(teams, matches, previousStockPrices) {
  const { startDate, endDate } = getDateRange(matches);
  const pricesByTicker = new Map();
  const output = {};

  for (const team of teams) {
    if (!team.stockEnabled) {
      output[team.id] = {
        teamId: team.id,
        ticker: team.yahooTicker,
        status: 'disabled',
        source: 'teamCompanyMap',
        note: team.stockNote,
        prices: [],
      };
      continue;
    }

    if (!pricesByTicker.has(team.yahooTicker)) {
      pricesByTicker.set(
        team.yahooTicker,
        await fetchTickerPrices(team.yahooTicker, startDate, endDate)
      );
    }

    const tickerResult = pricesByTicker.get(team.yahooTicker);
    if (tickerResult.status === 'ok') {
      output[team.id] = {
        teamId: team.id,
        ticker: team.yahooTicker,
        status: 'ok',
        source: 'yahoo-chart-api',
        note: '',
        seasonReturns: buildSeasonReturns(tickerResult.prices),
        prices: alignPricesToMatchDates(
          tickerResult.prices,
          matches.filter(
            (match) => match.homeTeamId === team.id || match.awayTeamId === team.id
          )
        ),
      };
      continue;
    }

    const cached = previousStockPrices[team.id];
    if (cached && Array.isArray(cached.prices) && cached.prices.length > 0) {
      output[team.id] = {
        ...cached,
        status: 'cached',
        note: `Yahoo Finance取得失敗: ${tickerResult.note}`,
      };
      continue;
    }

    output[team.id] = {
      teamId: team.id,
      ticker: team.yahooTicker,
        status: 'error',
        source: 'yahoo-chart-api',
        note: tickerResult.note,
        seasonReturns: [],
        prices: [],
      };
  }

  return output;
}

function buildSeasonReturns(prices) {
  return HISTORICAL_SEASONS.map((season) => {
    const start = findLatestPrice(prices, season.startDate);
    const end = findLatestPrice(prices, season.endDate);
    const averageClose = getAverageClose(prices, season.startDate, season.endDate);
    return {
      seasonId: season.id,
      startDate: season.startDate,
      endDate: season.endDate,
      startClose: start ? start.close : null,
      endClose: end ? end.close : null,
      averageClose,
      returnPct:
        start && end
          ? Number((((end.close - start.close) / start.close) * 100).toFixed(2))
          : null,
    };
  });
}

function getAverageClose(prices, startDate, endDate) {
  const rows = prices.filter((price) => price.date >= startDate && price.date <= endDate);
  if (!rows.length) return null;
  const total = rows.reduce((sum, price) => sum + price.close, 0);
  return Number((total / rows.length).toFixed(2));
}

async function fetchTickerPrices(ticker, startDate, endDate) {
  const period1 = toUnixSeconds(`${startDate}T00:00:00Z`);
  const period2 = toUnixSeconds(`${endDate}T00:00:00Z`);
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(
    ticker
  )}?period1=${period1}&period2=${period2}&interval=1d&events=history`;

  try {
    const payload = await getJson(url);
    const result = payload.chart && payload.chart.result && payload.chart.result[0];
    const timestamps = result && result.timestamp;
    const quote = result && result.indicators && result.indicators.quote[0];
    if (!Array.isArray(timestamps) || !quote || !Array.isArray(quote.close)) {
      throw new Error('unexpected response schema');
    }

    const prices = timestamps
      .map((timestamp, index) => ({
        date: new Date(timestamp * 1000).toISOString().slice(0, 10),
        close: quote.close[index],
      }))
      .filter((price) => typeof price.close === 'number')
      .map((price) => ({ ...price, close: Number(price.close.toFixed(2)) }));

    if (prices.length === 0) {
      throw new Error('no price rows');
    }

    const baseClose = prices[0].close;
    return {
      status: 'ok',
      prices: prices.map((price) => ({
        ...price,
        changePct: Number((((price.close - baseClose) / baseClose) * 100).toFixed(2)),
      })),
    };
  } catch (error) {
    return {
      status: 'error',
      prices: [],
      note: error.message || String(error),
    };
  }
}

function alignPricesToMatchDates(prices, teamMatches) {
  const datedMatches = teamMatches
    .map((match) => toDateKey(match.kickoff))
    .filter(Boolean)
    .sort();
  const aligned = [];

  for (const dateKey of datedMatches) {
    const price = findLatestPrice(prices, dateKey);
    if (price && !aligned.some((entry) => entry.date === dateKey)) {
      aligned.push({
        date: dateKey,
        close: price.close,
        changePct: price.changePct,
      });
    }
  }

  return aligned;
}

function findLatestPrice(prices, dateKey) {
  let latest = null;
  for (const price of prices) {
    if (price.date <= dateKey) latest = price;
    if (price.date > dateKey) break;
  }
  return latest;
}

async function applyOfficialFinalStandings(teams, teamRoundStats) {
  const hasCalculatedStandings = teamRoundStats.some(
    (teamStats) => teamStats.summary.recordEligibleMatches > 0
  );
  if (!hasCalculatedStandings) return;

  try {
    const officialStandings = await fetchOfficialStandings(teams);
    if (officialStandings.size < teams.length) {
      throw new Error(`official standings incomplete: ${officialStandings.size}/${teams.length}`);
    }
    applyOfficialStandingMap(teamRoundStats, officialStandings);
  } catch (error) {
    console.warn(
      `[standings warning] Official standings fetch failed; using bundled fallback: ${error.message || String(error)}`
    );
    applyOfficialStandingMap(
      teamRoundStats,
      new Map(Object.entries(OFFICIAL_FINAL_STANDINGS_FALLBACK))
    );
  }
}

function buildSeasonTeamTrends(teams, teamRoundStats, stockPrices) {
  const trendsByTeamId = new Map(teams.map((team) => [team.id, []]));

  for (const season of HISTORICAL_SEASONS) {
    if (season.id === '2025-26') {
      for (const teamStats of teamRoundStats) {
      const stockReturn = getSeasonStockReturn(stockPrices[teamStats.teamId], season.id);
      const stockMetrics = getSeasonStockMetrics(stockPrices[teamStats.teamId], season.id);
      trendsByTeamId.get(teamStats.teamId)?.push({
          seasonId: season.id,
          label: season.label,
          complete: season.complete,
          division: teamStats.division,
          rank: teamStats.summary.latestRank,
          wins: teamStats.summary.wins,
          losses: teamStats.summary.losses,
          draws: teamStats.summary.draws,
          matches: teamStats.summary.recordEligibleMatches,
          leaguePoints: getLatestLeaguePoints(teamStats),
          stockOpenClose: stockMetrics.openClose,
          stockEndClose: stockMetrics.endClose,
          stockAverageClose: stockMetrics.averageClose,
          stockReturnPct: stockReturn,
          note: stockMetrics.averageClose === null ? '株価データなし' : '',
        });
      }
      continue;
    }

    const rows = readJson(path.resolve(ROOT, 'src/datas', season.sourceFile));
    const standingsByTeamId = calculateHistoricalSeasonStandings(rows, teams);
    for (const standing of standingsByTeamId.values()) {
      if (!trendsByTeamId.has(standing.teamId)) continue;
      const stockReturn = getSeasonStockReturn(stockPrices[standing.teamId], season.id);
      const stockMetrics = getSeasonStockMetrics(stockPrices[standing.teamId], season.id);
      trendsByTeamId.get(standing.teamId).push({
        seasonId: season.id,
        label: season.label,
        complete: season.complete,
        division: `div${standing.division}`,
        rank: standing.rank,
        wins: standing.wins,
        losses: standing.losses,
        draws: standing.draws,
        matches: standing.matches,
        leaguePoints: standing.leaguePoints,
        stockOpenClose: stockMetrics.openClose,
        stockEndClose: stockMetrics.endClose,
        stockAverageClose: stockMetrics.averageClose,
        stockReturnPct: stockReturn,
        note: [
          season.complete ? '' : '途中データ',
          stockMetrics.averageClose === null ? '株価データなし' : '',
        ]
          .filter(Boolean)
          .join(' / '),
      });
    }
  }

  return [...trendsByTeamId.entries()].map(([teamId, seasons]) => ({
    teamId,
    seasons,
  }));
}

function calculateHistoricalSeasonStandings(rows, teams) {
  const standingsByDivision = new Map();
  const teamNameToId = buildTeamNameToId(teams);

  for (const row of rows) {
    if (!isHistoricalRegularSeasonMatch(row)) continue;
    const homeTeamId = resolveHistoricalTeamId(row.home_team, teamNameToId);
    const awayTeamId = resolveHistoricalTeamId(row.away_team, teamNameToId);
    if (!homeTeamId || !awayTeamId) continue;
    const division = Number(row.division);
    if (!standingsByDivision.has(division)) standingsByDivision.set(division, new Map());
    const standings = standingsByDivision.get(division);
    const home = getOrCreateHistoricalStanding(standings, homeTeamId, division);
    const away = getOrCreateHistoricalStanding(standings, awayTeamId, division);
    const homeScore = firstNumber([row.home_team_score]);
    const awayScore = firstNumber([row.away_team_score]);
    if (homeScore === null || awayScore === null) continue;

    home.matches += 1;
    away.matches += 1;
    home.pointsFor += homeScore;
    home.pointsAgainst += awayScore;
    away.pointsFor += awayScore;
    away.pointsAgainst += homeScore;
    home.pointsDiff = home.pointsFor - home.pointsAgainst;
    away.pointsDiff = away.pointsFor - away.pointsAgainst;

    if (homeScore > awayScore) {
      home.wins += 1;
      away.losses += 1;
      home.leaguePoints += 4;
    } else if (awayScore > homeScore) {
      away.wins += 1;
      home.losses += 1;
      away.leaguePoints += 4;
    } else {
      home.draws += 1;
      away.draws += 1;
      home.leaguePoints += 2;
      away.leaguePoints += 2;
    }

    if (Math.abs(homeScore - awayScore) <= 7) {
      if (homeScore > awayScore) away.leaguePoints += 1;
      if (awayScore > homeScore) home.leaguePoints += 1;
    }
  }

  const output = new Map();
  for (const standings of standingsByDivision.values()) {
    const ordered = [...standings.values()].sort((a, b) => {
      if (b.leaguePoints !== a.leaguePoints) return b.leaguePoints - a.leaguePoints;
      if (b.wins !== a.wins) return b.wins - a.wins;
      if (b.pointsDiff !== a.pointsDiff) return b.pointsDiff - a.pointsDiff;
      if (b.pointsFor !== a.pointsFor) return b.pointsFor - a.pointsFor;
      return a.teamId.localeCompare(b.teamId);
    });
    ordered.forEach((standing, index) => {
      output.set(standing.teamId, { ...standing, rank: index + 1 });
    });
  }
  return output;
}

function isHistoricalRegularSeasonMatch(row) {
  return Boolean(
    row.division &&
      row.date &&
      row.home_team &&
      row.away_team &&
      typeof row.basic_info === 'string' &&
      !/プレーオフ|入替戦/.test(row.basic_info)
  );
}

function buildTeamNameToId(teams) {
  const map = new Map();
  for (const team of teams) {
    map.set(normalizeTeamNameKey(team.name), team.id);
    map.set(normalizeTeamNameKey(team.shortName), team.id);
  }
  return map;
}

function resolveHistoricalTeamId(teamName, teamNameToId) {
  if (!teamName) return '';
  if (TEAM_NAME_ALIASES[teamName]) return TEAM_NAME_ALIASES[teamName];
  const normalized = normalizeTeamNameKey(teamName);
  if (teamNameToId.has(normalized)) return teamNameToId.get(normalized);
  for (const [alias, teamId] of Object.entries(TEAM_NAME_ALIASES)) {
    if (normalizeTeamNameKey(alias) === normalized) return teamId;
  }
  return '';
}

function normalizeTeamNameKey(teamName) {
  return String(teamName || '').replace(/\s+/g, '').replace(/[・･]/g, '').toLowerCase();
}

function getOrCreateHistoricalStanding(standings, teamId, division) {
  if (!standings.has(teamId)) {
    standings.set(teamId, {
      teamId,
      division,
      rank: null,
      matches: 0,
      wins: 0,
      losses: 0,
      draws: 0,
      leaguePoints: 0,
      pointsFor: 0,
      pointsAgainst: 0,
      pointsDiff: 0,
    });
  }
  return standings.get(teamId);
}

function getSeasonStockReturn(stockInfo, seasonId) {
  if (!stockInfo || !Array.isArray(stockInfo.seasonReturns)) return null;
  const row = stockInfo.seasonReturns.find((entry) => entry.seasonId === seasonId);
  return row ? row.returnPct : null;
}

function getSeasonStockMetrics(stockInfo, seasonId) {
  if (!stockInfo || !Array.isArray(stockInfo.seasonReturns)) {
    return {
      openClose: null,
      endClose: null,
      averageClose: null,
    };
  }
  const row = stockInfo.seasonReturns.find((entry) => entry.seasonId === seasonId);
  return {
    openClose: row ? row.startClose : null,
    endClose: row ? row.endClose : null,
    averageClose: row ? row.averageClose : null,
  };
}

function getLatestLeaguePoints(teamStats) {
  const latest = [...teamStats.matches].reverse().find((match) => match.leaguePoints !== null);
  return latest ? latest.leaguePoints : null;
}

function applyOfficialStandingMap(teamRoundStats, officialStandings) {
  for (const teamStats of teamRoundStats) {
    const official = officialStandings.get(teamStats.teamId);
    if (!official) continue;
    const latestMatch = [...teamStats.matches]
      .reverse()
      .find((match) => match.countedInRecord);
    teamStats.summary.latestRank = official.rank;
    teamStats.summary.wins = official.wins;
    teamStats.summary.losses = official.losses;
    teamStats.summary.draws = official.draws;
    if (latestMatch) {
      latestMatch.rank = official.rank;
      latestMatch.leaguePoints = official.leaguePoints;
      latestMatch.wins = official.wins;
      latestMatch.losses = official.losses;
      latestMatch.draws = official.draws;
      latestMatch.recordLabel = `${official.wins}勝${official.losses}敗${official.draws}分`;
    }
  }
  console.log(`Applied official final standings for ${officialStandings.size} teams.`);
}

async function fetchOfficialStandings(teams) {
  const html = await getText('https://league-one.jp/standings/');
  const tables = html.match(/<table[\s\S]*?<\/table>/gi) || [];
  const result = new Map();

  for (const division of DIVISIONS) {
    const table = tables[Number(division.id.replace('div', '')) - 1];
    if (!table) continue;
    const text = decodeHtml(table)
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<[^>]+>/g, '\n')
      .replace(/\s+/g, ' ')
      .trim();

    const divisionTeams = teams.filter((team) => team.division === division.id);
    for (const team of divisionTeams) {
      const index = text.indexOf(team.name);
      if (index < 0) continue;
      const preceding = text.slice(Math.max(0, index - 120), index);
      const rankCandidates = preceding.match(/\b\d{1,2}\b/g) || [];
      const rank = Number(rankCandidates[rankCandidates.length - 1]);
      const afterTeamName = text.slice(index + team.name.length, index + team.name.length + 180);
      const columns = afterTeamName.match(/-?\d+/g) || [];
      const leaguePoints = Number(columns[1]);
      const wins = Number(columns[2]);
      const draws = Number(columns[3]);
      const losses = Number(columns[4]);
      if (
        Number.isFinite(rank) &&
        Number.isFinite(leaguePoints) &&
        Number.isFinite(wins) &&
        Number.isFinite(draws) &&
        Number.isFinite(losses)
      ) {
        result.set(team.id, { rank, leaguePoints, wins, draws, losses });
      }
    }
  }

  return result;
}

function decodeHtml(value) {
  return value
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)));
}

async function main() {
  const allTeams = readJson(path.resolve(RUGBY_DATA, 'teams.json'));
  const companyMap = readJson(TEAM_COMPANY_MAP_PATH);
  const matches = normalizeMatches().sort(compareKickoff);
  const teams = buildTeams(allTeams, matches, companyMap);
  const previousStockPath = path.resolve(GENERATED_DIR, 'stockPrices.json');
  const previousStockPrices = fs.existsSync(previousStockPath)
    ? readJson(previousStockPath)
    : {};

  const stockPrices = await fetchStockPrices(teams, matches, previousStockPrices);
  const teamRoundStats = buildTeamRoundStats(teams, matches, stockPrices);
  await applyOfficialFinalStandings(teams, teamRoundStats);
  const seasonTeamTrends = buildSeasonTeamTrends(teams, teamRoundStats, stockPrices);

  writeJson('leagueOneMatches.json', matches);
  writeJson('leagueOneTeams.json', teams);
  writeJson('stockPrices.json', stockPrices);
  writeJson('teamRoundStats.json', teamRoundStats);
  writeJson('seasonTeamTrends.json', seasonTeamTrends);

  console.log(
    `Generated ${matches.length} matches, ${teams.length} teams, ${Object.keys(stockPrices).length} stock records.`
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
