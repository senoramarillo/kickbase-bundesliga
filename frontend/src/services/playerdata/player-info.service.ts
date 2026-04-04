import { PlayerPosition } from '../../models/player-position';
import { PlayerStatus } from '../../models/player-status';
import { getCompetitionPlayer, getKickbaseImageUrl, getKickbasePlayerPortraitUrl } from '../kickbase-v4.service';

export interface PlayerInfo {
  teamId: string;
  teamName: string;
  profileBig: string;
  profileFallback: string;
  status: PlayerStatus;
  position: PlayerPosition;
  number: number;
  marketValue: number;
  marketValueTrend: number;
}

export class PlayerInfoService {
  public async getData(playerId: string): Promise<PlayerInfo> {
    const player = await getCompetitionPlayer(playerId);
    const profileImage = getKickbasePlayerPortraitUrl(player.i ?? playerId, player.pim);
    const profileFallback = getKickbaseImageUrl(player.pim ?? player.plpim);

    return {
      teamId: player.tid,
      teamName: player.tn,
      profileBig: profileImage,
      profileFallback,
      status: player.st ?? PlayerStatus.NONE,
      position: player.pos ?? PlayerPosition.UNKNOWN,
      number: player.shn ?? 0,
      marketValue: player.mv ?? 0,
      marketValueTrend: player.mvt ?? 0
    };
  }
}

export const playerInfoService = new PlayerInfoService();
