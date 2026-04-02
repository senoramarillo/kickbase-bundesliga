import { BundesligaTable, BundesligaTableEntry, bundesligaTableEntryFromApiResponse } from '../models/bundesliga-table';
import { getCompetitionTable } from './kickbase-v4.service';

export class BundesligaTableService {
  public async getData(): Promise<BundesligaTable> {
    try {
      const rawTableData: any = await getCompetitionTable();
      return this.transformApiResponse(rawTableData);
    } catch (error) {
      console.error('Error fetching Bundesliga table data:', error);
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`Error fetching Bundesliga table data: ${message}`);
    }
  }

  private transformApiResponse(rawTableData: any): BundesligaTable {
    const teams: BundesligaTableEntry[] = (rawTableData.it ?? []).map(bundesligaTableEntryFromApiResponse);
    return {
      matchDay: 0,
      currentMatchDay: 0,
      teams
    };
  }
}

export const bundesligaTableService = new BundesligaTableService();
