import { PlayerUpcomingMatch, playerUpcomingMatchFromApiResponse } from '../../models/player-upcoming-match';
import { getCompetitionPlayer } from '../kickbase-v4.service';

export interface PlayerStats {
  upcomingMatches: PlayerUpcomingMatch[];
}

export class PlayerStatsService {
  public async getData(playerId: string): Promise<PlayerStats> {
    const player = await getCompetitionPlayer(playerId);
    const upcomingMatches = (player.mdsum ?? [])
      .filter((match: any) => Number(match.mdst ?? 0) !== 2)
      .map((match: any) =>
        playerUpcomingMatchFromApiResponse({
          ...match,
          match: match.day
        })
      );

    return {
      upcomingMatches
    };
  }
}

export const playerStatsService = new PlayerStatsService();
