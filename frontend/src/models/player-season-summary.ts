export interface PlayerSeasonSummary {
  assists: number;
  defensiveAverage: number;
  defensivePoints: number;
  generalAverage: number;
  generalPoints: number;
  goalFree: number;
  goalKeeperAverage: number;
  goalKeeperPoints: number;
  goals: number;
  matches: number;
  offensiveAverage: number;
  offensivePoints: number;
  points: number;
  redCards: number;
  season: string;
  seasonId: string;
  secondsPerGoal: number;
  secondsPlayed: number;
  startMatches: number;
  teamAverage: number;
  teamPoints: number;
  yellowCards: number;
}

export function playerSeasonSummaryFromApiResponse(playerSeasonSummary: any): PlayerSeasonSummary {
  const matches = playerSeasonSummary.ph ?? [];
  const points = matches.reduce((sum: number, match: any) => sum + (match.p ?? 0), 0);
  const appearances = matches.filter((match: any) => Number.parseInt(String(match.mp ?? '0'), 10) > 0).length;

  return {
    assists: 0,
    defensiveAverage: 0,
    defensivePoints: 0,
    generalAverage: appearances > 0 ? Math.round(points / appearances) : 0,
    generalPoints: points,
    goalFree: 0,
    goalKeeperAverage: 0,
    goalKeeperPoints: 0,
    goals: 0,
    matches: matches.length,
    offensiveAverage: 0,
    offensivePoints: 0,
    points,
    redCards: 0,
    season: playerSeasonSummary.ti ?? '',
    seasonId: playerSeasonSummary.ti ?? '',
    secondsPerGoal: 0,
    secondsPlayed: matches.reduce(
      (sum: number, match: any) => sum + Number.parseInt(String(match.mp ?? '0'), 10) * 60,
      0
    ),
    startMatches: appearances,
    teamAverage: 0,
    teamPoints: 0,
    yellowCards: 0
  };
}
