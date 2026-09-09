import { PlayerUpcomingMatch, playerUpcomingMatchFromApiResponse } from '../../models/player-upcoming-match';
import { getCompetitionPlayer } from '../kickbase-v4.service';
import { getTeamLogos } from '../team-logos.service';

export interface PlayerStats {
  upcomingMatches: PlayerUpcomingMatch[];
}

export class PlayerStatsService {
  public async getData(playerId: string, competitionId?: string): Promise<PlayerStats> {
    const [player, logos] = await Promise.all([
      getCompetitionPlayer(playerId, competitionId),
      getTeamLogos(competitionId)
    ]);
    const upcomingMatches = (player.mdsum ?? [])
      .filter((match: any) => Number(match.mdst ?? 0) !== 2)
      .map((match: any) =>
        playerUpcomingMatchFromApiResponse({
          ...match,
          match: match.day
        })
      );

    for (const match of upcomingMatches) {
      match.homeTeamLogo = logos.get(String(match.homeTeamId));
      match.awayTeamLogo = logos.get(String(match.awayTeamId));
    }

    return {
      upcomingMatches
    };
  }
}

export const playerStatsService = new PlayerStatsService();
