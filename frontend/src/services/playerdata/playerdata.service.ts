import { PlayerInfo, playerInfoService } from './player-info.service';
import { PlayerMarketValueHistories } from '../../models/player-market-value';
import { playerMarketValueService } from './player-market-value.service';
import { PlayerPoints, playerPointsService } from './player-points.service';
import { PlayerStats, playerStatsService } from './player-stats.service';

export interface PlayerData {
  playerInfo: PlayerInfo;
  playerMarketValue: PlayerMarketValueHistories;
  playerPoints: PlayerPoints;
  playerStats: PlayerStats;
}

class PlayerDataService {
  public async getData(playerId: string, competitionId?: string): Promise<PlayerData> {
    return {
      playerInfo: await playerInfoService.getData(playerId, competitionId),
      playerMarketValue: await playerMarketValueService.getData(playerId, competitionId),
      playerPoints: await playerPointsService.getData(playerId, competitionId),
      playerStats: await playerStatsService.getData(playerId, competitionId)
    };
  }
}

export const playerDataService = new PlayerDataService();
