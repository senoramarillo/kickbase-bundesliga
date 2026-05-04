import { LitElement, html, CSSResultGroup, css, TemplateResult, PropertyValueMap } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';
import { pointFormatter } from '../helpers/point-formatter';
import { PlayerMatch } from '../models/player-match';
import { PlayerSeason } from '../models/player-season';
import { PlayerUpcomingMatch } from '../models/player-upcoming-match';
import { PlayerPoints } from '../services/playerdata/player-points.service';
import './player-points-match';

@customElement('bkb-player-points')
export class PlayerPointsComponent extends LitElement {
  static styles: CSSResultGroup = css`
    .root {
      width: 100%;
      display: flex;
      overflow-x: scroll;
    }

    .root {
      scrollbar-width: thin;
    }

    .root::-webkit-scrollbar {
      width: 5px;
      height: 8px;
      background-color: #f1f1f1;
    }

    .root::-webkit-scrollbar-thumb {
      background: #c1c1c1;
    }

    .season {
      display: flex;
      flex: 0 0 auto;
      align-items: stretch;
    }

    .season-content {
      display: flex;
    }

    .upcoming-season {
      display: flex;
      flex: 0 0 auto;
      align-items: stretch;
      border-left: 2px dashed #d3d7d8;
      margin-left: 0.75rem;
      padding-left: 0.75rem;
    }

    .upcoming-summary {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      border-left: 1px solid #d3d7d8;
      border-right: 1px solid #d3d7d8;
      margin-right: 10px;
      padding-left: 0.55rem;
      padding-right: 0.55rem;
      background: #f7faf9;
      min-width: 52px;
    }

    .upcoming-content {
      display: flex;
    }

    .season-summary::-webkit-details-marker {
      display: none;
    }

    .match-item {
      display: flex;
      flex: 0 0 auto;
    }

    .season-summary {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      border-left: 1px solid #d3d7d8;
      border-right: 1px solid #d3d7d8;
      margin-right: 10px;
      padding-left: 1rem;
      padding-right: 1rem;
      cursor: pointer;
      list-style: none;
    }

    .season-summary-year {
      margin-bottom: 0px;
      margin-top: 0px;
      padding-left: 2rem;
      padding-right: 2rem;
    }

    .season-summary > .season-summary-details-key {
      padding-bottom: 0.4rem;
    }

    .season-summary * {
      text-align: center;
    }

    .season-summary-details {
      display: flex;
      flex-direction: column;
    }

    .season-summary-details-value {
      padding-top: 1rem;
      font-weight: 600;
      opacity: 87%;
      font-size: medium;
    }

    .season-summary-details-key {
      font-size: smaller;
      opacity: 60%;
    }

    .season-toggle {
      width: 1.6rem;
      height: 1.6rem;
      margin-top: 0.75rem;
      border-radius: 999px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: #eef3f5;
      color: #33464f;
      transition: transform 0.15s ease;
    }

    .season-toggle::before {
      content: '';
      width: 0.4rem;
      height: 0.4rem;
      border-right: 2px solid currentColor;
      border-bottom: 2px solid currentColor;
      transform: rotate(45deg) translate(-1px, -1px);
    }

    .season[open] .season-toggle {
      transform: rotate(180deg);
    }

    .upcoming-label {
      font-size: smaller;
      opacity: 60%;
      text-align: center;
    }

    .upcoming-value {
      display: flex;
      flex-direction: column;
      align-items: center;
      font-weight: 600;
      opacity: 87%;
      font-size: 0.8rem;
      text-align: center;
      line-height: 1.2;
    }

  `;

  @property({ type: Object })
  declare public points?: PlayerPoints;

  @property({ type: Array })
  declare public upcomingMatches: PlayerUpcomingMatch[];

  /**
   * The highest points the player has ever scored.
   * Is used to determine how to render the bars.
   */
  private maxPoints: number = 0;

  protected willUpdate(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
    if (_changedProperties.has('points') && !!this.points?.seasons) {
      const allMatches = this.points.seasons.flatMap((season: PlayerSeason) => season.matches);
      this.maxPoints = allMatches.length > 0 ? Math.max(...allMatches.map((match: PlayerMatch) => match.points)) : 0;
    }
  }

  protected render(): TemplateResult {
    const seasons = [...(this.points?.seasons ?? [])].sort((left: PlayerSeason, right: PlayerSeason) =>
      this.getSeasonStartYear(right.year) - this.getSeasonStartYear(left.year)
    );
    const [currentSeason, ...olderSeasons] = seasons;

    return html`
      <div class="root">
        ${currentSeason ? this.seasonTemplate(currentSeason, true) : null}
        ${this.upcomingMatches.length > 0 ? this.upcomingMatchesTemplate(this.upcomingMatches) : null}
        ${olderSeasons.map((season: PlayerSeason) => this.seasonTemplate(season, false))}
      </div>
    `;
  }

  private seasonTemplate(season: PlayerSeason, isCurrentSeason: boolean): TemplateResult {
    const avgPoints: number = season.appearances > 0 ? Math.round(season.points / season.appearances) : 0;
    return html`
      <details class="season" ?open=${isCurrentSeason}>
        <summary class="season-summary">
          <div class="season-summary-details">
            <div class="season-summary-details-value">${season.year}</div>
            <div class="season-summary-details-key">${isCurrentSeason ? 'Aktuelle Saison' : 'Saison Auswertung'}</div>
            <div class="season-summary-details-value">${pointFormatter.format(season.points)}</div>
            <div class="season-summary-details-key">Punkte</div>
            <div class="season-summary-details-value">${avgPoints}</div>
            <div class="season-summary-details-key">∅ Punkte</div>
            <div class="season-summary-details-value">${season.appearances}</div>
            <div class="season-summary-details-key">Einsätze</div>
            <div class="season-summary-details-value">${season.startingEleven}</div>
            <div class="season-summary-details-key">Startelf</div>
            <span class="season-toggle" aria-hidden="true"></span>
          </div>
        </summary>
        <div class="season-content">
          ${season.matches.map(
            (match: PlayerMatch) =>
              html`<div class="match-item">
                <bkb-player-points-match .match=${match} .maxPoints=${this.maxPoints}></bkb-player-points-match>
              </div>`
          )}
        </div>
      </details>
    `;
  }

  private upcomingMatchesTemplate(upcomingMatches: PlayerUpcomingMatch[]): TemplateResult {
    return html`
      <section class="upcoming-season" aria-label="Kommende Spiele">
        <div class="upcoming-summary">
          <div class="upcoming-value">
            <span>Kommende</span>
            <span>Spiele</span>
          </div>
          <div class="upcoming-label">${upcomingMatches.length} geplant</div>
        </div>
        <div class="upcoming-content">
          ${upcomingMatches.map(
            (upcomingMatch: PlayerUpcomingMatch) =>
              html`<div class="match-item">
                <bkb-player-points-match .match=${upcomingMatch} .maxPoints=${this.maxPoints}></bkb-player-points-match>
              </div>`
          )}
        </div>
      </section>
    `;
  }

  private getSeasonStartYear(year: string): number {
    return Number.parseInt(String(year).split('/')[0] ?? '0', 10) || 0;
  }
}
