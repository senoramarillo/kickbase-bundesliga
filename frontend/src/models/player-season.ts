import { PlayerMatch, playerMatchFromApiResponse } from './player-match';

export interface PlayerSeason {
  points: number;
  appearances: number;
  startingEleven: number;
  year: string;
  matches: PlayerMatch[];
}

function mapMatches(rawMatches: any[]): PlayerMatch[] {
  return [...rawMatches]
    .sort(
      (left, right) =>
        Number(left?.match ?? left?.day ?? left?.d ?? 0) - Number(right?.match ?? right?.day ?? right?.d ?? 0)
    )
    .map((match: any) =>
    playerMatchFromApiResponse({
      ...match,
      p: match.p ?? 0,
      playtimeSeconds: Number.parseInt(String(match.mp ?? '0'), 10) * 60,
      startingEleven: Number.parseInt(String(match.mp ?? '0'), 10) > 0
    })
  );
}

export function playerSeasonFromApiResponse(season: any): PlayerSeason {
  const year = season.t ?? season.ti ?? '';
  const matches = mapMatches(season.ph ?? season.m ?? []);

  const appearances = matches.filter(match => match.playtimeSeconds > 0).length;

  return {
    points: season.p ?? matches.reduce((sum: number, match: PlayerMatch) => sum + match.points, 0),
    appearances: season.mp ?? appearances,
    startingEleven: season.ms ?? appearances,
    matches,
    year
  };
}
