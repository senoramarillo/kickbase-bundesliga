import { PlayerPosition } from '../../models/player-position';
import { PlayerStatus } from '../../models/player-status';
import { getCompetitionPlayer, getKickbaseImageUrl, getKickbasePlayerPortraitUrl } from '../kickbase-v4.service';

export interface PlayerInfo {
  id: string;
  teamId: string;
  teamName: string;
  firstName: string;
  knownName: string;
  lastName: string;
  profile: string;
  profileBig: string;
  profileFallback: string;
  team: string;
  teamCover: string;
  status: PlayerStatus;
  position: PlayerPosition;
  number: number;
  averagePoints: number;
  totalPoints: number;
  marketValue: number;
  marketValueTrend: number;
}

export class PlayerInfoService {
  public async getData(playerId: string): Promise<PlayerInfo> {
    const player = await getCompetitionPlayer(playerId);
    const displayName = [player.fn, player.ln].filter(Boolean).join(' ');
    const profileImage = getKickbasePlayerPortraitUrl(player.i ?? playerId, player.pim);
    const profileFallback = getKickbaseImageUrl(player.pim ?? player.plpim);

    return {
      id: player.i,
      teamId: player.tid,
      teamName: player.tn,
      firstName: player.fn ?? '',
      knownName: displayName,
      lastName: player.ln ?? '',
      profile: profileImage,
      profileBig: profileImage,
      profileFallback,
      team: getKickbaseImageUrl(player.tim),
      teamCover: getKickbaseImageUrl(player.tim),
      status: player.st ?? PlayerStatus.NONE,
      position: player.pos ?? PlayerPosition.UNKNOWN,
      number: player.shn ?? 0,
      averagePoints: player.ap ?? 0,
      totalPoints: player.tp ?? 0,
      marketValue: player.mv ?? 0,
      marketValueTrend: player.mvt ?? 0
    };
  }
}

export const playerInfoService = new PlayerInfoService();
