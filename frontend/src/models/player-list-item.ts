import { PlayerPosition } from './player-position';
import { PlayerStatus } from './player-status';
import { getKickbasePlayerPortraitUrl } from '../services/kickbase-v4.service';

export interface PlayerListItem {
  playerId: number;
  playerName: string;
  firstName: string;
  lastName: string;
  knownName: string;
  teamName: string;
  teamId: string;
  status: PlayerStatus;
  position: PlayerPosition;
  profileBig: string;
  profileFallback: string;
  number: number;
  averagePoints: number;
  totalPoints: number;
  marketValue: number;
  marketValueTrend: number;
}

export function playerListItemFromApiResponse(player: any): PlayerListItem {
  const playerId = Number(player.playerId ?? player.pi ?? player.i ?? 0);
  const profileFallback = player.profileFallback ?? player.profileBigFallback ?? player.pim ?? player.plpim ?? '';
  const profileImage =
    player.profileBig ??
    player.profile ??
    getKickbasePlayerPortraitUrl(playerId || undefined, player.pim) ??
    player.pim ??
    '';

  return {
    playerId,
    playerName: player.playerName ?? player.knownName ?? player.n ?? [player.firstName ?? player.fn, player.lastName ?? player.ln].filter(Boolean).join(' '),
    firstName: player.firstName ?? player.fn ?? '',
    lastName: player.lastName ?? player.ln ?? '',
    knownName: player.knownName ?? player.n ?? [player.firstName ?? player.fn, player.lastName ?? player.ln].filter(Boolean).join(' '),
    teamName: player.teamName ?? player.tn ?? '',
    teamId: String(player.teamId ?? player.tid ?? ''),
    profileBig: profileImage,
    profileFallback,
    status: player.status ?? player.st ?? 0,
    position: player.position ?? player.pos ?? 0,
    number: player.number ?? player.shn ?? 0,
    averagePoints: player.averagePoints ?? player.ap ?? 0,
    totalPoints: player.totalPoints ?? player.tp ?? player.p ?? 0,
    marketValue: player.marketValue ?? player.mv ?? 0,
    marketValueTrend: player.marketValueTrend ?? player.mvt ?? 0
  };
}
