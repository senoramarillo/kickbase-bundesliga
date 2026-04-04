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
  public async getData(playerId: string): Promise<PlayerData> {
    return {
      playerInfo: await playerInfoService.getData(playerId),
      playerMarketValue: await playerMarketValueService.getData(playerId),
      playerPoints: await playerPointsService.getData(playerId),
      playerStats: await playerStatsService.getData(playerId)
    };
  }
}

export const playerDataService = new PlayerDataService();
