import { BundesligaTable, BundesligaTableEntry, bundesligaTableEntryFromApiResponse } from '../models/bundesliga-table';
import { Matchday, matchdayFromApiResponse } from '../models/matchday';
import { getCompetitionMatchdays, getCompetitionTable } from './kickbase-v4.service';

export class BundesligaTableService {
  public async getData(): Promise<BundesligaTable> {
    try {
      const [rawTableData, rawMatchdaysData]: [any, any] = await Promise.all([getCompetitionTable(), getCompetitionMatchdays()]);
      return this.transformApiResponse(rawTableData, rawMatchdaysData);
    } catch (error) {
      console.error('Error fetching Bundesliga table data:', error);
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`Error fetching Bundesliga table data: ${message}`);
    }
  }

  private transformApiResponse(rawTableData: any, rawMatchdaysData: any): BundesligaTable {
    const teams: BundesligaTableEntry[] = (rawTableData.it ?? []).map(bundesligaTableEntryFromApiResponse);
    const matchdays: Matchday[] = (rawMatchdaysData.it ?? []).map(matchdayFromApiResponse);
    const teamStatsById = this.getTeamStatsById(matchdays);

    return {
      matchDay: 0,
      currentMatchDay: 0,
      teams: teams.map(team => ({
        ...team,
        wins: teamStatsById.get(team.teamId)?.wins ?? 0,
        draws: teamStatsById.get(team.teamId)?.draws ?? 0,
        losses: teamStatsById.get(team.teamId)?.losses ?? 0,
        goalsFor: teamStatsById.get(team.teamId)?.goalsFor ?? 0,
        goalsAgainst: teamStatsById.get(team.teamId)?.goalsAgainst ?? 0,
        form: teamStatsById.get(team.teamId)?.form ?? []
      }))
    };
  }

  private getTeamStatsById(
    matchdays: Matchday[]
  ): Map<string, { wins: number; draws: number; losses: number; goalsFor: number; goalsAgainst: number; form: string[] }> {
    const statsById = new Map<
      string,
      { wins: number; draws: number; losses: number; goalsFor: number; goalsAgainst: number; form: string[] }
    >();

    const ensureStats = (teamId: string) => {
      if (!statsById.has(teamId)) {
        statsById.set(teamId, { wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, form: [] });
      }

      return statsById.get(teamId)!;
    };

    for (const matchday of matchdays) {
      for (const match of matchday.matches) {
        if (match.homeTeamGoals < 0 || match.awayTeamGoals < 0) {
          continue;
        }

        const homeStats = ensureStats(match.homeTeamId);
        const awayStats = ensureStats(match.awayTeamId);

        homeStats.goalsFor += match.homeTeamGoals;
        homeStats.goalsAgainst += match.awayTeamGoals;
        awayStats.goalsFor += match.awayTeamGoals;
        awayStats.goalsAgainst += match.homeTeamGoals;

        if (match.homeTeamGoals > match.awayTeamGoals) {
          homeStats.wins += 1;
          awayStats.losses += 1;
          homeStats.form.push('W');
          awayStats.form.push('L');
          continue;
        }

        if (match.homeTeamGoals < match.awayTeamGoals) {
          homeStats.losses += 1;
          awayStats.wins += 1;
          homeStats.form.push('L');
          awayStats.form.push('W');
          continue;
        }

        homeStats.draws += 1;
        awayStats.draws += 1;
        homeStats.form.push('D');
        awayStats.form.push('D');
      }
    }

    for (const stats of statsById.values()) {
      stats.form = stats.form.slice(-5);
    }

    return statsById;
  }
}

export const bundesligaTableService = new BundesligaTableService();
