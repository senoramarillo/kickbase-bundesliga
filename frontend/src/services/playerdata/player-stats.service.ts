import { PlayerPosition } from '../../models/player-position';
import { PlayerSeasonSummary, playerSeasonSummaryFromApiResponse } from '../../models/player-season-summary';
import { PlayerStatus } from '../../models/player-status';
import { PlayerUpcomingMatch, playerUpcomingMatchFromApiResponse } from '../../models/player-upcoming-match';
import { PlayerValueHistoryItem } from '../../models/player-value-history';
import { getCompetitionPlayer, getCompetitionPlayerPerformance, getKickbaseImageUrl, getKickbasePlayerPortraitUrl } from '../kickbase-v4.service';

export enum MarketValueTrend {
  UP = 1,
  DOWN = 2
}

export interface PlayerStats {
  averagePoints: number;
  f: boolean; // API field meaning still unclear; currently always set to false.
  firstName: string;
  id: string;
  lastName: string;
  marketValue: number;
  marketValues?: PlayerValueHistoryItem[];
  mvHigh: number;
  mvHighDate: Date;
  mvLow: number;
  mvLowDate: Date;
  mvTrend: MarketValueTrend;
  upcomingMatches: PlayerUpcomingMatch[];
  number: number;
  points: number;
  position: PlayerPosition;
  profileUrl: string;
  seasons: PlayerSeasonSummary[];
  status: PlayerStatus;
  teamCoverUrl: string;
  teamId: string;
  teamUrl: string;
  userFlags: 0; // API field meaning still unclear; currently always set to 0.
}

export class PlayerStatsService {
  public async getData(playerId: string): Promise<PlayerStats> {
    const [player, performance] = await Promise.all([
      getCompetitionPlayer(playerId),
      getCompetitionPlayerPerformance(playerId)
    ]);

    const performanceSeasons = (performance.it ?? []).map(playerSeasonSummaryFromApiResponse);
    const upcomingMatches = (player.mdsum ?? [])
      .filter((match: any) => Number(match.mdst ?? 0) !== 2)
      .map((match: any) =>
        playerUpcomingMatchFromApiResponse({
          ...match,
          match: match.day
        })
      );

    return {
      averagePoints: player.ap ?? 0,
      f: false,
      firstName: player.fn ?? '',
      id: player.i,
      lastName: player.ln ?? '',
      marketValue: player.mv ?? 0,
      marketValues: [] as PlayerValueHistoryItem[],
      mvHigh: player.mv ?? 0,
      mvHighDate: new Date(player.ts ?? player.dt ?? Date.now()),
      mvLow: player.cv ?? player.mv ?? 0,
      mvLowDate: new Date(player.ts ?? player.dt ?? Date.now()),
      mvTrend: player.mvt ?? MarketValueTrend.UP,
      upcomingMatches,
      number: player.shn ?? 0,
      points: player.tp ?? 0,
      position: player.pos ?? PlayerPosition.UNKNOWN,
      profileUrl: getKickbasePlayerPortraitUrl(player.i ?? playerId, player.pim),
      seasons: performanceSeasons,
      status: player.st ?? PlayerStatus.NONE,
      teamCoverUrl: getKickbaseImageUrl(player.tim),
      teamId: player.tid,
      teamUrl: getKickbaseImageUrl(player.tim),
      userFlags: 0
    };
  }
}

export const playerStatsService = new PlayerStatsService();
