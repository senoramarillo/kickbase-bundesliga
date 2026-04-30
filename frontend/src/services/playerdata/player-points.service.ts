import { PlayerMatch } from '../../models/player-match';
import { PlayerSeason, playerSeasonFromApiResponse } from '../../models/player-season';
import { getCompetitionPlayerPerformance } from '../kickbase-v4.service';

export interface PlayerPoints {
  seasons: PlayerSeason[];
}

export class PlayerPointsService {
  public async getData(playerId: string, competitionId?: string): Promise<PlayerPoints> {
    try {
      const points: any = await getCompetitionPlayerPerformance(playerId, competitionId);
      return { seasons: this.mergeDuplicateSeasons((points.it ?? []).map(playerSeasonFromApiResponse)) };
    } catch (error) {
      console.log('request was not successful:', error);
      return { seasons: [] };
    }
  }

  private mergeDuplicateSeasons(seasons: PlayerSeason[]): PlayerSeason[] {
    const seasonsByYear = new Map<string, PlayerSeason[]>();

    for (const season of seasons) {
      const year = this.getSeasonKey(season);
      seasonsByYear.set(year, [...(seasonsByYear.get(year) ?? []), season]);
    }

    return [...seasonsByYear.values()].map(groupedSeasons => {
      if (groupedSeasons.length === 1) {
        return groupedSeasons[0];
      }

      const matches = this.mergeDuplicateMatches(groupedSeasons.flatMap(season => season.matches));
      const appearances = matches.filter(match => match.playtimeSeconds > 0).length;

      return {
        year: groupedSeasons[0].year,
        matches,
        points: matches.reduce((sum, match) => sum + match.points, 0),
        appearances,
        startingEleven: matches.filter(match => match.startingEleven).length
      };
    });
  }

  private mergeDuplicateMatches(matches: PlayerMatch[]): PlayerMatch[] {
    const matchesByKey = new Map<string, PlayerMatch>();

    for (const match of matches) {
      const key = [match.match, match.homeTeamId, match.awayTeamId].join(':');
      matchesByKey.set(key, match);
    }

    return [...matchesByKey.values()].sort((left, right) => left.match - right.match);
  }

  private getSeasonKey(season: PlayerSeason): string {
    const startYear = Number.parseInt(String(season.year).match(/\d{4}/)?.[0] ?? '', 10);

    if (Number.isFinite(startYear)) {
      return String(startYear);
    }

    const firstMatch = season.matches[0];
    return firstMatch ? `matches:${firstMatch.match}:${firstMatch.homeTeamId}:${firstMatch.awayTeamId}` : `year:${season.year}`;
  }
}

export const playerPointsService = new PlayerPointsService();
