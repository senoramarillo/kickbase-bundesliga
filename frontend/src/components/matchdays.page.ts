import { LitElement, html, CSSResultGroup, css, PropertyValueMap, TemplateResult } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';
import { state } from 'lit/decorators/state.js';
import { BASE_PATH_WITHOUT_DOMAIN } from '../../base-path.mjs';
import type { MatchdayOverview } from '../services/matchdays.service';
import { getPlayerPositionLabel, PlayerPosition } from '../models/player-position';
import type { Matchday, MatchdayEventItem, MatchdayLineupPlayer, MatchdayMatch } from '../models/matchday';

@customElement('bkb-matchdays')
export class MatchdaysPage extends LitElement {
  static styles: CSSResultGroup = css`
    .header {
      margin-bottom: 1.25rem;
    }

    .eyebrow {
      margin: 0;
      color: #5d7079;
      font-size: 0.9rem;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    h1 {
      margin: 0.25rem 0 0;
    }

    .matchday-section + .matchday-section {
      margin-top: 1.5rem;
    }

    .matchday-disclosure {
      border-radius: 1rem;
      overflow: hidden;
      background: transparent;
    }

    .matchday-disclosure[open] {
      background: rgba(255, 255, 255, 0.55);
    }

    .matchday-summary {
      list-style: none;
      cursor: pointer;
      padding: 0.9rem 1rem;
      border-radius: 1rem;
      background: rgba(255, 255, 255, 0.72);
      border: 1px solid #d8e0e5;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
    }

    .matchday-summary::-webkit-details-marker {
      display: none;
    }

    .matchday-summary.current {
      background: linear-gradient(135deg, #ffffff 0%, #eef7fb 100%);
      border-color: #b6d2df;
      box-shadow: 0 16px 36px rgba(29, 95, 122, 0.12);
    }

    .matchday-title {
      margin: 0;
      font-size: 1.2rem;
    }

    .matchday-meta {
      color: #5d7079;
      font-size: 0.92rem;
      white-space: nowrap;
    }

    .matchday-content {
      padding-top: 0.75rem;
    }

    .match-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .match-card {
      display: grid;
      grid-template-columns: minmax(0, 1fr) 140px minmax(0, 1fr) 120px;
      gap: 1rem;
      align-items: center;
      background: white;
      border-radius: 0.85rem;
      padding: 1rem 1.1rem;
      box-shadow: 0 12px 28px rgba(19, 33, 40, 0.06);
    }

    .match-events {
      grid-column: 1 / -1;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
      padding-top: 0.25rem;
      border-top: 1px solid #e8edf1;
    }

    .event-column.away {
      text-align: right;
    }

    .event-column.full-width {
      grid-column: 1 / -1;
      text-align: left;
    }

    .event-group + .event-group {
      margin-top: 0.5rem;
    }

    .lineup-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
      margin-top: 0.75rem;
    }

    .lineup-group + .lineup-group {
      margin-top: 1.1rem;
      padding-top: 0.85rem;
      border-top: 1px dashed #dbe4e9;
    }

    .lineup-group .event-title {
      margin-bottom: 0.5rem;
    }

    .lineup-list {
      display: flex;
      flex-wrap: wrap;
      gap: 0.4rem;
      row-gap: 0.55rem;
    }

    .lineup-chip {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      background: #f3f6f8;
      border: 1px solid #dbe4e9;
      border-radius: 999px;
      padding: 0.28rem 0.55rem;
      font-size: 0.88rem;
      line-height: 1.2;
    }

    .lineup-chip:link,
    .lineup-chip:visited,
    .lineup-chip:hover,
    .lineup-chip:active {
      color: inherit;
      text-decoration: none;
    }

    .lineup-chip-position {
      color: #5d7079;
      font-size: 0.8rem;
      font-weight: 700;
      text-transform: uppercase;
    }

    .event-title {
      color: #5d7079;
      font-size: 0.8rem;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      margin-bottom: 0.2rem;
    }

    .event-line {
      display: flex;
      align-items: center;
      gap: 0.45rem;
      font-size: 0.92rem;
      line-height: 1.35;
    }

    .event-line:link,
    .event-line:visited,
    .event-line:hover,
    .event-line:active {
      color: inherit;
      text-decoration: none;
    }

    .event-line-link {
      cursor: pointer;
    }

    .event-line-link:hover span {
      text-decoration: underline;
    }

    .event-player-image {
      width: 22px;
      height: 22px;
      border-radius: 999px;
      object-fit: cover;
      background: #edf2f5;
      flex: 0 0 auto;
    }

    .team {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      min-width: 0;
    }

    .team.away {
      justify-content: flex-end;
      text-align: right;
    }

    .team-logo {
      width: 36px;
      height: 36px;
      object-fit: contain;
      flex: 0 0 auto;
    }

    .team-name {
      font-weight: 700;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .center {
      text-align: center;
    }

    .score {
      font-size: 1.35rem;
      font-weight: 700;
    }

    .status {
      color: #5d7079;
      font-size: 0.9rem;
    }

    .time {
      text-align: right;
    }

    .date {
      font-weight: 700;
    }

    .time-label {
      color: #5d7079;
      font-size: 0.9rem;
    }

    @media (max-width: 800px) {
      .header {
        text-align: center;
      }

      .match-card {
        grid-template-columns: 1fr;
        text-align: center;
      }

      .team.away,
      .time,
      .center {
        justify-content: center;
        text-align: center;
      }

      .team {
        justify-content: center;
      }

      .match-events {
        grid-template-columns: 1fr;
      }

      .event-column,
      .event-column.away {
        text-align: center;
      }

      .event-line {
        justify-content: center;
      }

      .lineup-grid {
        grid-template-columns: 1fr;
      }

      .lineup-list {
        justify-content: center;
      }

      .matchday-summary {
        align-items: center;
        flex-direction: column;
        text-align: center;
      }

      .matchday-meta {
        white-space: normal;
      }
    }
  `;

  @property({ type: String, attribute: 'server-json-data' })
  declare public serverJsonData: string;

  @state()
  declare private data: MatchdayOverview;

  protected async willUpdate(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): Promise<void> {
    if (!this.data) {
      const parsedData = JSON.parse(this.serverJsonData) as MatchdayOverview;
      this.data = {
        ...parsedData,
        matchdays: parsedData.matchdays.map((matchday: Matchday) => ({
          ...matchday,
          matches: matchday.matches.map((match: MatchdayMatch) => ({
            ...match,
            date: new Date(match.date)
          }))
        }))
      };
    }
  }

  protected render(): TemplateResult {
    const relevantMatchdays = [...this.data.matchdays].sort((left: Matchday, right: Matchday) => left.day - right.day);

    return html`
      <header class="header">
        <p class="eyebrow">Bundesliga</p>
        <h1>Spieltage</h1>
        <p class="eyebrow">Aktuell: Spieltag ${this.data.currentMatchday}</p>
      </header>

      ${relevantMatchdays.map(
        (matchday: Matchday) => html`
          <section class="matchday-section">
            <details class="matchday-disclosure" ?open=${matchday.day === this.data.currentMatchday}>
              <summary class="matchday-summary ${matchday.day === this.data.currentMatchday ? 'current' : ''}">
                <h2 class="matchday-title">
                  Spieltag ${matchday.day}${matchday.day === this.data.currentMatchday ? ' · Aktuell' : ''}
                </h2>
                <div class="matchday-meta">${matchday.matches.length} Partien</div>
              </summary>
              <div class="matchday-content">
                <div class="match-list">
                  ${matchday.matches.map((match: MatchdayMatch) => this.matchTemplate(match))}
                </div>
              </div>
            </details>
          </section>
        `
      )}
    `;
  }

  private matchTemplate(match: MatchdayMatch): TemplateResult {
    return html`
      <article class="match-card">
        <div class="team">
          <img class="team-logo" src=${match.homeTeamLogo} alt=${`Logo von ${match.homeTeamName}`} />
          <div class="team-name">${match.homeTeamName}</div>
        </div>

        <div class="center">
          <div class="score">${this.scoreLabel(match)}</div>
          <div class="status">${this.statusLabel(match)}</div>
        </div>

        <div class="team away">
          <div class="team-name">${match.awayTeamName}</div>
          <img class="team-logo" src=${match.awayTeamLogo} alt=${`Logo von ${match.awayTeamName}`} />
        </div>

        <div class="time">
          <div class="date">${match.date.toLocaleDateString('de-DE')}</div>
          <div class="time-label">${match.date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}</div>
        </div>

        ${this.hasEventSummary(match)
          ? html`
              <div class="match-events">
                <div class="event-column">
                  ${this.eventGroupTemplate('Tore', match.homeScorers)}
                  ${this.eventGroupTemplate('Karten', match.homeCards)}
                  ${this.eventGroupTemplate('Wechsel', match.homeSubstitutions)}
                </div>
                <div class="event-column away">
                  ${this.eventGroupTemplate('Tore', match.awayScorers)}
                  ${this.eventGroupTemplate('Karten', match.awayCards)}
                  ${this.eventGroupTemplate('Wechsel', match.awaySubstitutions)}
                </div>
              </div>
            `
          : html``}

        ${this.hasLineupSummary(match)
          ? html`
              <div class="match-events">
                <div class="event-column full-width">
                  <div class="event-group">
                    <div class="event-title">Aufstellungen</div>
                    <div class="lineup-grid">
                      <div>
                        ${this.lineupGroupTemplate('Startelf', match.homeStartingLineup)}
                        ${this.lineupGroupTemplate('Bank', match.homeBench)}
                      </div>
                      <div>
                        ${this.lineupGroupTemplate('Startelf', match.awayStartingLineup)}
                        ${this.lineupGroupTemplate('Bank', match.awayBench)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            `
          : html``}
      </article>
    `;
  }

  private hasEventSummary(match: MatchdayMatch): boolean {
    return (
      match.homeScorers.length > 0 ||
      match.awayScorers.length > 0 ||
      match.homeCards.length > 0 ||
      match.awayCards.length > 0 ||
      match.homeSubstitutions.length > 0 ||
      match.awaySubstitutions.length > 0
    );
  }

  private eventGroupTemplate(title: string, items: MatchdayEventItem[]): TemplateResult | string {
    if (items.length === 0) {
      return '';
    }

    return html`
      <div class="event-group">
        <div class="event-title">${title}</div>
        ${items.map((item: MatchdayEventItem) => this.eventLineTemplate(item))}
      </div>
    `;
  }

  private eventLineTemplate(item: MatchdayEventItem): TemplateResult {
    const playerHref =
      item.playerId && item.playerName
        ? `${BASE_PATH_WITHOUT_DOMAIN}/player/${encodeURIComponent(item.playerName)}/${encodeURIComponent(item.playerId)}`
        : undefined;

    if (playerHref) {
      return html`
        <a class="event-line event-line-link" href=${playerHref}>
          ${item.imageUrl ? html`<img class="event-player-image" src=${item.imageUrl} alt="" />` : html``}
          <span>${item.text}</span>
        </a>
      `;
    }

    return html`
      <div class="event-line">
        ${item.imageUrl ? html`<img class="event-player-image" src=${item.imageUrl} alt="" />` : html``}
        <span>${item.text}</span>
      </div>
    `;
  }

  private hasLineupSummary(match: MatchdayMatch): boolean {
    return (
      match.homeStartingLineup.length > 0 ||
      match.awayStartingLineup.length > 0 ||
      match.homeBench.length > 0 ||
      match.awayBench.length > 0
    );
  }

  private lineupGroupTemplate(title: string, players: MatchdayLineupPlayer[]): TemplateResult | string {
    if (players.length === 0) {
      return '';
    }

    return html`
      <div class="lineup-group">
        <div class="event-title">${title}</div>
        <div class="lineup-list">
          ${players.map((player: MatchdayLineupPlayer) => this.lineupPlayerTemplate(player))}
        </div>
      </div>
    `;
  }

  private lineupPlayerTemplate(player: MatchdayLineupPlayer): TemplateResult {
    const positionLabel = getPlayerPositionLabel((player.position ?? PlayerPosition.UNKNOWN) as PlayerPosition);
    const playerHref = `${BASE_PATH_WITHOUT_DOMAIN}/player/${encodeURIComponent(player.name)}/${encodeURIComponent(player.playerId)}`;

    return html`
      <a class="lineup-chip" href=${playerHref}>
        <span>${player.name}</span>
        ${positionLabel ? html`<span class="lineup-chip-position">${positionLabel}</span>` : html``}
      </a>
    `;
  }

  private scoreLabel(match: MatchdayMatch): string {
    if (match.homeTeamGoals >= 0 && match.awayTeamGoals >= 0) {
      return `${match.homeTeamGoals} : ${match.awayTeamGoals}`;
    }

    return 'vs.';
  }

  private statusLabel(match: MatchdayMatch): string {
    if (match.isLive) {
      if (match.matchTimeDisplay) {
        return `Live · ${match.matchTimeDisplay}`;
      }

      if (match.secondHalfStartedAt) {
        return 'Live · 2. Halbzeit';
      }

      if (match.firstHalfStartedAt) {
        return 'Live · 1. Halbzeit';
      }

      return 'Live';
    }

    if (match.status === 2) {
      return 'Beendet';
    }

    if (match.status === 1) {
      return 'Läuft';
    }

    return 'Anstehend';
  }
}
