export interface BundesligaTableEntry {
  goadDifference: number;
  matches: number;
  points: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  form: string[];
  place: number;
  teamId: string;
  teamName: string;
  teamLogo: string;
  trend: number;
}

export interface BundesligaTable {
  matchDay: number;
  currentMatchDay: number;
  teams: BundesligaTableEntry[];
}

export function bundesligaTableEntryFromApiResponse(tableEntry: any): BundesligaTableEntry {
  return {
    goadDifference: tableEntry.gd,
    matches: tableEntry.mc,
    points: tableEntry.cp,
    wins: 0,
    draws: 0,
    losses: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    form: [],
    place: tableEntry.cpl,
    teamId: tableEntry.tid,
    teamName: tableEntry.tn,
    teamLogo: tableEntry.tim ?? '',
    trend: tableEntry.cpl - tableEntry.pcpl
  };
}
