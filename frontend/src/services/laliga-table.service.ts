import { LaLigaTable, LaLigaTableEntry, laLigaTableEntryFromApiResponse } from '../models/laliga-table';
import { getCompetitionTable } from './kickbase-v4.service';

export class LaLigaTableService {
  public async getData(): Promise<LaLigaTable> {
    try {
      const rawTableData: any = await getCompetitionTable();
      return this.transformApiResponse(rawTableData);
    } catch (error) {
      console.error('Error fetching La Liga table data:', error);
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`Error fetching La Liga table data: ${message}`);
    }
  }

  private transformApiResponse(rawTableData: any): LaLigaTable {
    const teams: LaLigaTableEntry[] = (rawTableData.it ?? []).map(laLigaTableEntryFromApiResponse);
    return {
      matchDay: 0,
      currentMatchDay: 0,
      teams
    };
  }
}

export const laLigaTableService = new LaLigaTableService();
