import { getKickbaseImageUrl } from '../services/kickbase-v4.service';

export interface MatchdayLineupPlayer {
  playerId: string;
  name: string;
  position: number;
}

export interface MatchdayEventItem {
  text: string;
  imageUrl: string;
  playerId?: string;
  playerName?: string;
}

export interface MatchdayMatch {
  matchId: string;
  matchday: number;
  date: Date;
  homeTeamId: string;
  awayTeamId: string;
  homeTeamName: string;
  awayTeamName: string;
  homeTeamShortName: string;
  awayTeamShortName: string;
  homeTeamGoals: number;
  awayTeamGoals: number;
  matchTimeDisplay: string;
  status: number;
  isLive: boolean;
  firstHalfStartedAt?: string;
  secondHalfStartedAt?: string;
  homeTeamLogo: string;
  awayTeamLogo: string;
  homeScorers: MatchdayEventItem[];
  awayScorers: MatchdayEventItem[];
  homeCards: MatchdayEventItem[];
  awayCards: MatchdayEventItem[];
  homeSubstitutions: MatchdayEventItem[];
  awaySubstitutions: MatchdayEventItem[];
  homeStartingLineup: MatchdayLineupPlayer[];
  awayStartingLineup: MatchdayLineupPlayer[];
  homeBench: MatchdayLineupPlayer[];
  awayBench: MatchdayLineupPlayer[];
}

export interface Matchday {
  day: number;
  matches: MatchdayMatch[];
}

export function matchdayMatchFromApiResponse(match: any): MatchdayMatch {
  return {
    matchId: String(match.mi ?? ''),
    matchday: Number(match.day ?? 0),
    date: new Date(match.dt),
    homeTeamId: String(match.t1 ?? ''),
    awayTeamId: String(match.t2 ?? ''),
    homeTeamName: match.t1n ?? match.t1sy ?? '',
    awayTeamName: match.t2n ?? match.t2sy ?? '',
    homeTeamShortName: match.t1sy ?? '',
    awayTeamShortName: match.t2sy ?? '',
    homeTeamGoals: Number(match.t1g ?? -1),
    awayTeamGoals: Number(match.t2g ?? -1),
    matchTimeDisplay: match.mtd ?? '',
    status: Number(match.st ?? 0),
    isLive: Boolean(match.il),
    firstHalfStartedAt: undefined,
    secondHalfStartedAt: undefined,
    homeTeamLogo: getKickbaseImageUrl(match.t1im),
    awayTeamLogo: getKickbaseImageUrl(match.t2im),
    homeScorers: [],
    awayScorers: [],
    homeCards: [],
    awayCards: [],
    homeSubstitutions: [],
    awaySubstitutions: [],
    homeStartingLineup: [],
    awayStartingLineup: [],
    homeBench: [],
    awayBench: []
  };
}

export function matchdayFromApiResponse(matchday: any): Matchday {
  return {
    day: Number(matchday.day ?? 0),
    matches: (matchday.it ?? []).map(matchdayMatchFromApiResponse)
  };
}
