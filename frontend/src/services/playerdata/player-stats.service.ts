import { PlayerUpcomingMatch, playerUpcomingMatchFromApiResponse } from '../../models/player-upcoming-match';
import { getCompetitionPlayer } from '../kickbase-v4.service';

export interface PlayerStats {
  upcomingMatches: PlayerUpcomingMatch[];
}

export class PlayerStatsService {
  public async getData(playerId: string, competitionId?: string): Promise<PlayerStats> {
    const player = await getCompetitionPlayer(playerId, competitionId);
    const upcomingMatches = (player.mdsum ?? [])
      .filter((match: any) => Number(match.mdst ?? 0) !== 2)
      .map((match: any) =>
        playerUpcomingMatchFromApiResponse({
          ...match,
          match: match.day
        })
      )
      .filter(this.isUniqueUpcomingMatch())
      .sort((left: PlayerUpcomingMatch, right: PlayerUpcomingMatch) => left.match - right.match);

    return {
      upcomingMatches
    };
  }

  private isUniqueUpcomingMatch(): (match: PlayerUpcomingMatch) => boolean {
    const seenMatches = new Set<string>();

    return (match: PlayerUpcomingMatch): boolean => {
      const key = [
        match.match,
        match.homeTeamId || match.homeTeamName,
        match.awayTeamId || match.awayTeamName
      ].join(':');

      if (seenMatches.has(key)) {
        return false;
      }

      seenMatches.add(key);
      return true;
    };
  }
}

export const playerStatsService = new PlayerStatsService();
