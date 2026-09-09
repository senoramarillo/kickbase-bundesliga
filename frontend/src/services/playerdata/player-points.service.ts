import { PlayerSeason, playerSeasonFromApiResponse } from '../../models/player-season';
import { getCompetitionPlayerPerformance } from '../kickbase-v4.service';
import { getTeamLogos } from '../team-logos.service';

export interface PlayerPoints {
  seasons: PlayerSeason[];
}

export class PlayerPointsService {
  public async getData(playerId: string, competitionId?: string): Promise<PlayerPoints> {
    try {
      const [points, logos] = await Promise.all([
        getCompetitionPlayerPerformance(playerId, competitionId),
        getTeamLogos(competitionId)
      ]);
      const seasons: PlayerSeason[] = (points.it ?? []).map(playerSeasonFromApiResponse);
      for (const season of seasons) {
        for (const match of season.matches) {
          match.homeTeamLogo = logos.get(String(match.homeTeamId));
          match.awayTeamLogo = logos.get(String(match.awayTeamId));
        }
      }
      return { seasons };
    } catch (error) {
      console.log('request was not successful:', error);
      return { seasons: [] };
    }
  }
}

export const playerPointsService = new PlayerPointsService();
