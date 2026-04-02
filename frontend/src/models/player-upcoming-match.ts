export interface PlayerUpcomingMatch {
  day: Date;
  homeTeamId: string;
  homeTeamName: string;
  homeTeamNameShort: string;
  awayTeamId: string;
  awayTeamName: string;
  awayTeamNameShort: string;
  match: number;
  points: number;
  playtimeSeconds: number;
  homeTeamGoals: number;
  awayTeamGoals: number;
}

export function playerUpcomingMatchFromApiResponse(upcomingMatch: any): PlayerUpcomingMatch {
  return {
    day: new Date(upcomingMatch.d ?? upcomingMatch.md),
    homeTeamId: String(upcomingMatch.t1i ?? upcomingMatch.t1 ?? ''),
    homeTeamName: upcomingMatch.t1n ?? '',
    homeTeamNameShort: upcomingMatch.t1y ?? '',
    awayTeamId: String(upcomingMatch.t2i ?? upcomingMatch.t2 ?? ''),
    awayTeamName: upcomingMatch.t2n ?? '',
    awayTeamNameShort: upcomingMatch.t2y ?? '',
    match: upcomingMatch.match ?? upcomingMatch.day ?? 0,
    points: 0,
    playtimeSeconds: 0,
    homeTeamGoals: upcomingMatch.t1g ?? -1,
    awayTeamGoals: upcomingMatch.t2g ?? -1
  };
}
