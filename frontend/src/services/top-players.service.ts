import { PlayerListItem } from '../models/player-list-item';
import { BundesligaTableEntry } from '../models/bundesliga-table';
import { bundesligaTableService } from './bundesliga-table.service';
import { getCompetitionPlayers } from './kickbase-v4.service';
import { teamPlayerService } from './team-players.service';

export interface TopPlayerEntry extends PlayerListItem {
  currentMatchdayPoints: number;
}

export interface TopPlayersData {
  currentMatchdayTopPlayers: TopPlayerEntry[];
  overallTopPlayers: TopPlayerEntry[];
}

export class TopPlayersService {
  public async getData(limit: number = 10, competitionId?: string): Promise<TopPlayersData> {
    const bundesligaTable = await bundesligaTableService.getData(competitionId);
    const teamIds = bundesligaTable.teams.map((team: BundesligaTableEntry) => team.teamId);

    const [competitionPlayers, detailedPlayersByTeam] = await Promise.all([
      getCompetitionPlayers(competitionId),
      Promise.all(teamIds.map((teamId: string) => teamPlayerService.getData(teamId, competitionId)))
    ]);

    const detailedPlayers = detailedPlayersByTeam.flat();

    const currentMatchdayPointsByPlayerId = new Map<number, number>(
      (competitionPlayers ?? []).map((player: any) => [Number(player.pi ?? player.i ?? 0), Number(player.p ?? 0)])
    );

    const topPlayerEntries: TopPlayerEntry[] = detailedPlayers.map((player: PlayerListItem) => ({
      ...player,
      currentMatchdayPoints: currentMatchdayPointsByPlayerId.get(player.playerId) ?? 0
    }));

    return {
      currentMatchdayTopPlayers: [...topPlayerEntries]
        .sort((left: TopPlayerEntry, right: TopPlayerEntry) => {
          if (right.currentMatchdayPoints !== left.currentMatchdayPoints) {
            return right.currentMatchdayPoints - left.currentMatchdayPoints;
          }

          return right.totalPoints - left.totalPoints;
        })
        .slice(0, limit),
      overallTopPlayers: [...topPlayerEntries]
        .sort((left: TopPlayerEntry, right: TopPlayerEntry) => {
          if (right.totalPoints !== left.totalPoints) {
            return right.totalPoints - left.totalPoints;
          }

          return right.averagePoints - left.averagePoints;
        })
        .slice(0, limit)
    };
  }
}

export const topPlayersService = new TopPlayersService();
