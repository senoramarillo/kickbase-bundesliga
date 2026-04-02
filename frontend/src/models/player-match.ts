export interface PlayerMatch {
  match: number;
  points: number;
  goals: number;
  assists: number;
  home: number;
  playtimeSeconds: number;
  startingEleven: boolean;
  homeTeamId: number;
  awayTeamId: number;
  homeTeamGoals: number;
  awayTeamGoals: number;
}

export function playerMatchFromApiResponse(match: any): PlayerMatch {
  return {
    match: match.match ?? match.day ?? match.d ?? 0,
    points: match.p,
    goals: match.g ?? 0,
    assists: match.a ?? 0,
    home: match.h ?? Number(String(match.pt ?? '') === String(match.t1 ?? '')),
    playtimeSeconds: match.sp ?? match.playtimeSeconds ?? 0,
    startingEleven: match.ms ?? match.startingEleven ?? false,
    homeTeamId: Number(match.t1i ?? match.t1 ?? 0),
    awayTeamId: Number(match.t2i ?? match.t2 ?? 0),
    homeTeamGoals: match.t1s ?? match.t1g ?? -1,
    awayTeamGoals: match.t2s ?? match.t2g ?? -1
  };
}
