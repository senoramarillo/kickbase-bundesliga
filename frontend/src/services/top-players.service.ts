import { PlayerListItem } from '../models/player-list-item';
import { LaLigaTableEntry } from '../models/laliga-table';
import { laLigaTableService } from './laliga-table.service';
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
  public async getData(limit: number = 10): Promise<TopPlayersData> {
    const laLigaTable = await laLigaTableService.getData();
    const teamIds = laLigaTable.teams.map((team: LaLigaTableEntry) => team.teamId);

    const [competitionPlayers, detailedPlayersByTeam] = await Promise.all([
      getCompetitionPlayers(),
      Promise.all(teamIds.map((teamId: string) => teamPlayerService.getData(teamId)))
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
