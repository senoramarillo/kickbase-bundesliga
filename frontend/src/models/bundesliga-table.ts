export interface BundesligaTableEntry {
  goadDifference: number;
  matches: number;
  points: number;
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
    place: tableEntry.cpl,
    teamId: tableEntry.tid,
    teamName: tableEntry.tn,
    teamLogo: tableEntry.tim ?? '',
    trend: tableEntry.cpl - tableEntry.pcpl
  };
}
