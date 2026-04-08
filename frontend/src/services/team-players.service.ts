import inactivePlayers from '../data/all_inactive_players.json';
import { PlayerListItem, playerListItemFromApiResponse } from '../models/player-list-item';
import { getCompetitionPlayer, getKickbaseImageUrl, getKickbasePlayerPortraitUrl, getTeamProfile } from './kickbase-v4.service';
import { laLigaTableService } from './laliga-table.service';

export class TeamPlayerService {
  public async getBasicData(teamId: string): Promise<PlayerListItem[]> {
    if (teamId === 'INACTIVE_PLAYERS') {
      return this.getInactivePlayers();
    }

    const [teamProfile, laLigaTable] = await Promise.all([getTeamProfile(teamId), laLigaTableService.getData()]);
    const teamName = teamProfile.tn ?? laLigaTable.teams.find(team => team.teamId === teamId)?.teamName ?? '';

    return (teamProfile.it ?? []).map((player: any) =>
      playerListItemFromApiResponse({
        ...player,
        teamName,
        profileFallback: getKickbaseImageUrl(player.pim ?? player.plpim),
        pim: getKickbasePlayerPortraitUrl(player.pi ?? player.i, player.pim)
      })
    );
  }

  public async getData(teamId: string): Promise<PlayerListItem[]> {
    if (teamId === 'INACTIVE_PLAYERS') {
      return this.getInactivePlayers();
    }
    if (!teamId) {
      return [];
    }

    const players = await this.getBasicData(teamId);
    const detailedPlayers = await Promise.all(
      players.map(async player => {
        const detailedPlayer = await getCompetitionPlayer(String(player.playerId));
        return playerListItemFromApiResponse({
          ...detailedPlayer,
          playerId: player.playerId,
          playerName: player.playerName,
          knownName: player.knownName,
          firstName: player.firstName,
          lastName: player.lastName,
          teamName: player.teamName,
          teamId: player.teamId,
          profileFallback: getKickbaseImageUrl(detailedPlayer.pim ?? detailedPlayer.plpim),
          pim: getKickbasePlayerPortraitUrl(detailedPlayer.i ?? player.playerId, detailedPlayer.pim)
        });
      })
    );

    return detailedPlayers;
  }

  public getInactivePlayers() {
    return inactivePlayers as PlayerListItem[];
  }
}

export const teamPlayerService = new TeamPlayerService();
