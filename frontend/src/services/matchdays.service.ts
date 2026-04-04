import { Matchday, MatchdayEventItem, MatchdayLineupPlayer, MatchdayMatch, matchdayFromApiResponse } from '../models/matchday';
import { PlayerPosition, getPlayerPositionLabel } from '../models/player-position';
import { getCompetitionMatchdays, getCompetitionPlayers, getKickbaseImageUrl, getMatchDetails } from './kickbase-v4.service';

export interface MatchdayOverview {
  currentMatchday: number;
  matchdays: Matchday[];
}

interface MatchPlayerMeta {
  number?: number;
  position?: number;
}

export class MatchdaysService {
  public async getData(): Promise<MatchdayOverview> {
    const [response, competitionPlayers] = await Promise.all([getCompetitionMatchdays(), getCompetitionPlayers()]);
    const rawMatchdays = (response.it ?? [])
      .map(matchdayFromApiResponse)
      .sort((left: Matchday, right: Matchday) => left.day - right.day);
    const currentMatchday = this.getCurrentMatchday(rawMatchdays);
    const playerMetaById = new Map<string, MatchPlayerMeta>(
      competitionPlayers
        .filter((player: any) => player?.i ?? player?.pi)
        .map((player: any) => [
          String(player.i ?? player.pi),
          {
            number: this.toOptionalNumber(player.shn ?? player.number),
            position: this.toOptionalNumber(player.pos ?? player.position)
          }
        ])
    );
    const matchdays = await this.enrichRelevantMatchdays(rawMatchdays, currentMatchday, playerMetaById);

    return {
      currentMatchday,
      matchdays
    };
  }

  private async enrichRelevantMatchdays(
    matchdays: Matchday[],
    _currentMatchday: number,
    playerMetaById: Map<string, MatchPlayerMeta>
  ): Promise<Matchday[]> {
    const allVisibleMatches = matchdays.flatMap((matchday: Matchday) => matchday.matches);
    const detailEntries = await Promise.allSettled(
      allVisibleMatches
        .filter((match: MatchdayMatch) => match.matchId !== '')
        .map(async (match: MatchdayMatch) => [match.matchId, await getMatchDetails(match.matchId)] as const)
    );
    const detailsByMatchId = new Map<string, any>(
      detailEntries
        .filter((entry): entry is PromiseFulfilledResult<readonly [string, any]> => entry.status === 'fulfilled')
        .map(entry => entry.value)
    );

    return matchdays.map((matchday: Matchday) => ({
      ...matchday,
      matches: matchday.matches.map((match: MatchdayMatch) => {
        const details = detailsByMatchId.get(match.matchId);
        return details ? this.mergeMatchDetails(match, details, playerMetaById) : match;
      })
    }));
  }

  private mergeMatchDetails(match: MatchdayMatch, details: any, playerMetaById: Map<string, MatchPlayerMeta>): MatchdayMatch {
    const events = this.getEvents(details);
    const homeScorers: MatchdayEventItem[] = [];
    const awayScorers: MatchdayEventItem[] = [];
    const homeCards: MatchdayEventItem[] = [];
    const awayCards: MatchdayEventItem[] = [];
    const homeSubstitutions: MatchdayEventItem[] = [];
    const awaySubstitutions: MatchdayEventItem[] = [];
    const homeTeamName = details?.t1n ?? details?.it?.t1n ?? details?.data?.t1n ?? match.homeTeamName;
    const awayTeamName = details?.t2n ?? details?.it?.t2n ?? details?.data?.t2n ?? match.awayTeamName;
    const homeTeamShortName = details?.t1sy ?? details?.it?.t1sy ?? details?.data?.t1sy ?? match.homeTeamShortName;
    const awayTeamShortName = details?.t2sy ?? details?.it?.t2sy ?? details?.data?.t2sy ?? match.awayTeamShortName;
    const lineupMetaById = this.getLineupMetaById(details);
    const homeStartingLineup = this.getLineupPlayers(details?.t1lp ?? details?.it?.t1lp ?? details?.data?.t1lp ?? []);
    const awayStartingLineup = this.getLineupPlayers(details?.t2lp ?? details?.it?.t2lp ?? details?.data?.t2lp ?? []);
    const homeBench = this.getLineupPlayers(details?.t1nlp ?? details?.it?.t1nlp ?? details?.data?.t1nlp ?? []);
    const awayBench = this.getLineupPlayers(details?.t2nlp ?? details?.it?.t2nlp ?? details?.data?.t2nlp ?? []);
    const firstHalfStartedAt = details?.ts1 ?? details?.it?.ts1 ?? details?.data?.ts1;
    const secondHalfStartedAt = details?.ts2 ?? details?.it?.ts2 ?? details?.data?.ts2;

    for (const event of events) {
      const minute = event?.mt ? `${event.mt}'` : '';
      const playerName = event?.pn ?? '';
      const playerId = String(event?.pi ?? '');
      const playerMeta = playerMetaById.get(playerId) ?? lineupMetaById.get(playerId);
      const scorerMeta = this.getScorerMetaLabel(playerMeta);
      const eventLabel = this.getEventLabel(playerName, minute, scorerMeta);
      const goalLabel = this.getGoalLabel(event, eventLabel);
      const eventItem = this.getEventItem(goalLabel, event?.pim, playerId, playerName);
      const isHomeTeam = String(event?.tid ?? '') === match.homeTeamId;
      const isAwayTeam = String(event?.tid ?? '') === match.awayTeamId;
      const eventType = Number(event?.ke ?? -1);

      if (this.isGoalEvent(eventType) && eventItem) {
        if (isHomeTeam) homeScorers.push(eventItem);
        if (isAwayTeam) awayScorers.push(eventItem);
      }

      if (this.isCardEvent(eventType) && eventLabel) {
        const cardItem = this.getEventItem(`${eventLabel} • ${this.getCardTypeLabel(eventType)}`, event?.pim, playerId, playerName);
        if (isHomeTeam && cardItem) homeCards.push(cardItem);
        if (isAwayTeam && cardItem) awayCards.push(cardItem);
      }

      if (this.isSubstitutionInEvent(eventType) && playerName) {
        const substitutionItem = this.getEventItem(this.getSubstitutionLabel(event), event?.pim, playerId, playerName);
        if (isHomeTeam && substitutionItem) homeSubstitutions.push(substitutionItem);
        if (isAwayTeam && substitutionItem) awaySubstitutions.push(substitutionItem);
      }
    }

    return {
      ...match,
      homeTeamName,
      awayTeamName,
      homeTeamShortName,
      awayTeamShortName,
      firstHalfStartedAt,
      secondHalfStartedAt,
      homeScorers,
      awayScorers,
      homeCards,
      awayCards,
      homeSubstitutions,
      awaySubstitutions,
      homeStartingLineup,
      awayStartingLineup,
      homeBench,
      awayBench
    };
  }

  private getEvents(details: any): any[] {
    if (Array.isArray(details?.events)) {
      return details.events;
    }

    if (Array.isArray(details?.it?.events)) {
      return details.it.events;
    }

    if (Array.isArray(details?.data?.events)) {
      return details.data.events;
    }

    return [];
  }

  private getLineupMetaById(details: any): Map<string, MatchPlayerMeta> {
    const players = [
      ...(details?.t1lp ?? details?.it?.t1lp ?? details?.data?.t1lp ?? []),
      ...(details?.t1nlp ?? details?.it?.t1nlp ?? details?.data?.t1nlp ?? []),
      ...(details?.t2lp ?? details?.it?.t2lp ?? details?.data?.t2lp ?? []),
      ...(details?.t2nlp ?? details?.it?.t2nlp ?? details?.data?.t2nlp ?? [])
    ];

    return new Map<string, MatchPlayerMeta>(
      players
        .filter((player: any) => player?.i)
        .map((player: any) => [
          String(player.i),
          {
            number: this.toOptionalNumber(player.shn ?? player.number),
            position: this.toOptionalNumber(player.pos ?? player.position)
          }
        ])
    );
  }

  private getLineupPlayers(players: any[]): MatchdayLineupPlayer[] {
    return players
      .filter((player: any) => player)
      .map((player: any) => ({
        playerId: String(player.i ?? ''),
        name: player.n ?? '',
        position: Number(player.pos ?? PlayerPosition.UNKNOWN)
      }))
      .sort((left: MatchdayLineupPlayer, right: MatchdayLineupPlayer) => {
        if (left.position !== right.position) {
          return left.position - right.position;
        }

        return left.name.localeCompare(right.name, 'de');
      });
  }

  private getScorerMetaLabel(playerMeta?: MatchPlayerMeta): string {
    if (!playerMeta) {
      return '';
    }

    const parts: string[] = [];
    if (playerMeta.number && playerMeta.number > 0) {
      parts.push(`#${playerMeta.number}`);
    }

    const positionLabel = getPlayerPositionLabel((playerMeta.position ?? PlayerPosition.UNKNOWN) as PlayerPosition);
    if (positionLabel) {
      parts.push(positionLabel);
    }

    return parts.join(' · ');
  }

  private getEventLabel(playerName: string, minute: string, playerMetaLabel: string): string {
    const parts = [playerName, playerMetaLabel].filter(Boolean).join(' · ');
    if (parts && minute) {
      return `${parts} (${minute})`;
    }

    return parts || minute;
  }

  private getGoalLabel(event: any, fallbackLabel: string): string {
    if (!fallbackLabel) {
      return '';
    }

    const assistName = event?.rev?.pn ?? '';
    if (assistName) {
      return `${fallbackLabel} • Vorlage: ${assistName}`;
    }

    return fallbackLabel;
  }

  private getEventItem(text: string, imagePath?: string, playerId?: string, playerName?: string): MatchdayEventItem | undefined {
    if (!text) {
      return undefined;
    }

    return {
      text,
      imageUrl: getKickbaseImageUrl(imagePath),
      playerId: playerId && playerId !== '' ? playerId : undefined,
      playerName: playerName && playerName !== '' ? playerName : undefined
    };
  }

  private toOptionalNumber(value: unknown): number | undefined {
    const normalizedValue = Number(value);
    return Number.isFinite(normalizedValue) && normalizedValue > 0 ? normalizedValue : undefined;
  }

  private isGoalEvent(eventType: number): boolean {
    return eventType === 1 || eventType === 2;
  }

  private isCardEvent(eventType: number): boolean {
    return eventType === 4 || eventType === 5 || eventType === 6;
  }

  private isSubstitutionInEvent(eventType: number): boolean {
    return eventType === 8;
  }

  private getSubstitutionLabel(event: any): string {
    const minute = event?.mt ? `${event.mt}'` : '';
    const incomingPlayer = event?.pn ?? '';
    const outgoingPlayer = event?.rev?.pn ?? '';

    if (incomingPlayer && outgoingPlayer && minute) {
      return `${incomingPlayer} <-> ${outgoingPlayer} (${minute})`;
    }

    if (incomingPlayer && outgoingPlayer) {
      return `${incomingPlayer} <-> ${outgoingPlayer}`;
    }

    if (incomingPlayer && minute) {
      return `${incomingPlayer} (${minute})`;
    }

    return incomingPlayer || minute;
  }

  private getCardTypeLabel(eventType: number): string {
    switch (eventType) {
      case 4:
        return 'Gelb';
      case 5:
      case 6:
        return 'Rot';
      default:
        return 'Karte';
    }
  }

  private getCurrentMatchday(matchdays: Matchday[]): number {
    const liveMatchday = matchdays.find((matchday: Matchday) => matchday.matches.some(match => match.isLive));
    if (liveMatchday) {
      return liveMatchday.day;
    }

    const startedMatchdays = matchdays.filter((matchday: Matchday) => matchday.matches.some(match => match.status !== 0));
    if (startedMatchdays.length > 0) {
      return startedMatchdays[startedMatchdays.length - 1].day;
    }

    return matchdays[0]?.day ?? 1;
  }
}

export const matchdaysService = new MatchdaysService();
