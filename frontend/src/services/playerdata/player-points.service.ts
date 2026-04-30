import { PlayerSeason, playerSeasonFromApiResponse } from '../../models/player-season';
import { getCompetitionPlayerPerformance } from '../kickbase-v4.service';

export interface PlayerPoints {
  seasons: PlayerSeason[];
}

export class PlayerPointsService {
  public async getData(playerId: string, competitionId?: string): Promise<PlayerPoints> {
    try {
      const points: any = await getCompetitionPlayerPerformance(playerId, competitionId);
      return { seasons: (points.it ?? []).map(playerSeasonFromApiResponse) };
    } catch (error) {
      console.log('request was not successful:', error);
      return { seasons: [] };
    }
  }
}

export const playerPointsService = new PlayerPointsService();
