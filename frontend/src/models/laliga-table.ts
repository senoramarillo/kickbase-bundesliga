export interface LaLigaTableEntry {
  goadDifference: number;
  matches: number;
  points: number;
  place: number;
  teamId: string;
  teamName: string;
  teamLogo: string;
  trend: number;
}

export interface LaLigaTable {
  matchDay: number;
  currentMatchDay: number;
  teams: LaLigaTableEntry[];
}

export function laLigaTableEntryFromApiResponse(tableEntry: any): LaLigaTableEntry {
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
