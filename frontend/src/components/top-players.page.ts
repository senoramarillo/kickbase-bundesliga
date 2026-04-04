import { LitElement, html, CSSResultGroup, css, PropertyValueMap, TemplateResult } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';
import { state } from 'lit/decorators/state.js';
import { BASE_PATH_WITHOUT_DOMAIN } from '../../base-path.mjs';
import noProfilePicFallback from '../../images/no_profile_pic.png';
import { priceFormatter } from '../helpers/price-formatter';
import { pointFormatter } from '../helpers/point-formatter';
import { TopPlayerEntry, TopPlayersData } from '../services/top-players.service';

@customElement('bkb-top-players')
export class TopPlayersPage extends LitElement {
  static styles: CSSResultGroup = css`
    .section + .section {
      margin-top: 2rem;
    }

    .section-title {
      margin-bottom: 0.75rem;
    }

    .player-list {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .player-card {
      display: grid;
      grid-template-columns: 48px 72px minmax(0, 1fr) 80px 80px 80px 132px;
      align-items: center;
      gap: 1rem;
      background: white;
      border-radius: 0.5rem;
      padding: 0.75rem 1rem;
      color: black;
      text-decoration: none;
    }

    .rank {
      font-size: 1.25rem;
      font-weight: 700;
      text-align: center;
    }

    .player-image {
      width: 72px;
      height: 72px;
      border-radius: 0.5rem;
      object-fit: cover;
      background: #eef2f4;
    }

    .player-main {
      min-width: 0;
    }

    .player-name {
      font-size: 1.1rem;
      font-weight: 700;
    }

    .player-team {
      color: #6f7b80;
      font-size: 0.95rem;
    }

    .metric {
      text-align: center;
    }

    .metric-value {
      font-weight: 700;
    }

    .metric-label {
      color: #6f7b80;
      font-size: 0.85rem;
    }

    @media (max-width: 900px) {
      .player-card {
        grid-template-columns: 40px 56px minmax(0, 1fr) 72px 72px;
      }

      .player-image {
        width: 56px;
        height: 56px;
      }

      .market-value {
        grid-column: 2 / -1;
        text-align: left;
      }
    }
  `;

  @property({ type: String, attribute: 'server-json-data' })
  declare public serverJsonData: string;

  @state()
  declare private data: TopPlayersData;

  protected async willUpdate(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): Promise<void> {
    if (!this.data) {
      this.data = JSON.parse(this.serverJsonData) as TopPlayersData;
    }
  }

  protected render(): TemplateResult {
    return html`
      <section class="section">
        <h2 class="section-title">Top 10 des Spieltags</h2>
        <div class="player-list">
          ${this.data.currentMatchdayTopPlayers.map((player: TopPlayerEntry, index: number) =>
            this.playerCardTemplate(player, index + 1, true)
          )}
        </div>
      </section>

      <section class="section">
        <h2 class="section-title">Top 10 insgesamt</h2>
        <div class="player-list">
          ${this.data.overallTopPlayers.map((player: TopPlayerEntry, index: number) =>
            this.playerCardTemplate(player, index + 1, false)
          )}
        </div>
      </section>
    `;
  }

  private handleImageError(event: Event): void {
    const image = event.currentTarget as HTMLImageElement | null;
    if (!image) {
      return;
    }

    const fallbackSrc = image.dataset.fallbackSrc;
    if (fallbackSrc && image.src !== fallbackSrc) {
      image.src = fallbackSrc;
      return;
    }

    if (!image.src.endsWith(noProfilePicFallback)) {
      image.src = noProfilePicFallback;
    }
  }

  private playerCardTemplate(player: TopPlayerEntry, rank: number, showMatchdayPoints: boolean): TemplateResult {
    const playerHref = `${BASE_PATH_WITHOUT_DOMAIN}/player/${encodeURIComponent(player.playerName)}/${encodeURIComponent(
      player.playerId
    )}`;

    return html`
      <a class="player-card" href=${playerHref}>
        <div class="rank">${rank}</div>
        <img
          class="player-image"
          src=${player.profileBig ?? noProfilePicFallback}
          alt="Profilbild von ${player.knownName || player.playerName}"
          data-fallback-src=${player.profileFallback ?? ''}
          onerror="if(this.dataset.fallbackSrc&&this.src!==this.dataset.fallbackSrc){this.onerror=function(){this.onerror=null;this.src='${noProfilePicFallback}'};this.src=this.dataset.fallbackSrc;}else{this.onerror=null;this.src='${noProfilePicFallback}'}"
          @error=${this.handleImageError}
        />
        <div class="player-main">
          <div class="player-name">${player.knownName || player.playerName}</div>
          <div class="player-team">${player.teamName}</div>
        </div>
        <div class="metric">
          <div class="metric-value">
            ${showMatchdayPoints ? pointFormatter.format(player.currentMatchdayPoints) : pointFormatter.format(player.totalPoints)}
          </div>
          <div class="metric-label">${showMatchdayPoints ? 'ST-Pkt.' : 'Gesamt'}</div>
        </div>
        <div class="metric">
          <div class="metric-value">${player.averagePoints}</div>
          <div class="metric-label">Ø Pkt.</div>
        </div>
        <div class="metric">
          <div class="metric-value">${pointFormatter.format(player.totalPoints)}</div>
          <div class="metric-label">Ges. Pkt.</div>
        </div>
        <div class="metric market-value">
          <div class="metric-value">${priceFormatter.format(player.marketValue)}</div>
          <div class="metric-label">Marktwert</div>
        </div>
      </a>
    `;
  }
}
