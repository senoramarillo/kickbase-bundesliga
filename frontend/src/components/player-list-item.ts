import { svg, LitElement, html, CSSResultGroup, css, TemplateResult } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';
import { PlayerListItem } from '../models/player-list-item';
import noProfilePicFallback from '../../images/no_profile_pic.png';
import { BASE_PATH_WITHOUT_DOMAIN, COMPETITION_CONFIG } from '../../base-path.mjs';
import { priceFormatter } from '../helpers/price-formatter';
import { pointFormatter } from '../helpers/point-formatter';
import { PlayerStatus } from '../models/player-status';
import { getPlayerPositionLabel, PlayerPosition } from '../models/player-position';

@customElement('bkb-player-list-item')
export class PlayerListItemComponent extends LitElement {
  static styles: CSSResultGroup = css`
    .root {
      display: flex;
      background-color: white;
      margin-top: 0.5rem;
      border-radius: 0.5rem;
      height: 128px;
      align-items: center;
      /* justify-content: space-between; */
      cursor: pointer;
      color: black;
    }

    .root:link,
    .root:visited,
    .root:hover,
    .root:active {
      text-decoration: none;
    }

    .root > *:not(:first-child) {
      padding-left: 1rem;
    }

    .invisible {
      visibility: hidden;
    }
    .label {
      color: #9ca4a8;
    }
    .left,
    .player-img {
      height: 100%;
    }
    .player-img {
      clip-path: inset(0% 0% 0% 50px round 0.5rem);
      margin-left: -50px;
    }
    .right {
      display: grid;
      width: 100%;
      justify-content: stretch;
      align-content: stretch;
      grid-template-columns: 72px 72px minmax(0, 1fr) 132px;
      padding: 1rem 1rem 1rem 1rem;
      grid-template-areas:
        'badges badges . .'
        'name name name name'
        'points-value avg-points-value . market-value-value'
        'points-label avg-points-label . market-value-label';
    }

    .badges {
      grid-area: badges;
    }
    .name {
      grid-area: name;
      font-weight: 700;
      font-size: x-large;
      letter-spacing: 0.01rem;
      padding-top: 0.2rem !important;
      min-width: 0;
    }
    .value {
      padding-top: 0.5rem;
    }
    .points.value {
      grid-area: points-value;
    }
    .avg-points.value {
      grid-area: avg-points-value;
    }
    .market-value.value {
      grid-area: market-value-value;
      justify-self: end;
    }
    .points.label {
      grid-area: points-label;
    }
    .avg-points.label {
      grid-area: avg-points-label;
    }
    .market-value.label {
      grid-area: market-value-label;
      justify-self: end;
    }
    .badges {
      display: flex;
    }
    .badge {
      transform: skew(-10deg);
      height: 16px;
      margin-right: 4px;
    }

    .badge rect {
      fill: #9cacb9;
    }

    .badge text {
      font-size: 8px;
      fill: white;
    }
  `;

  @property({ type: Object })
  public data: PlayerListItem;

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

  protected render(): TemplateResult {
    const playerHref = `${BASE_PATH_WITHOUT_DOMAIN}/${COMPETITION_CONFIG.competitionRoute}/player/${encodeURIComponent(this.data.playerName)}/${encodeURIComponent(this.data.playerId)}`;

    return html`
      <a class="root" href=${playerHref}>
        <div class="left">
          <img
            class="player-img"
            src="${this.data.profileBig ?? noProfilePicFallback}"
            alt="Profilbild von ${this.data.playerName}"
            data-fallback-src="${this.data.profileFallback ?? ''}"
            onerror="if(this.dataset.fallbackSrc&&this.src!==this.dataset.fallbackSrc){this.onerror=function(){this.onerror=null;this.src='${noProfilePicFallback}'};this.src=this.dataset.fallbackSrc;}else{this.onerror=null;this.src='${noProfilePicFallback}'}"
            @error=${this.handleImageError}
          />
        </div>

        <div class="right">
          <div class="badges">
            ${this.data.number ? this.badgeTemplate(String(this.data.number)) : html``}
            ${this.data.position
              ? this.badgeTemplate(getPlayerPositionLabel(this.data.position as unknown as PlayerPosition))
              : html``}
            ${this.data.status ? this.badgeTemplate(PlayerStatus[this.data.status]) : html``}
          </div>
          <div class="name value">${this.data.knownName ?? this.data.lastName}</div>
          <div class="points value">${pointFormatter.format(this.data.totalPoints)}</div>
          <div class="points label">Pkt.</div>
          <div class="avg-points value">${this.data.averagePoints}</div>
          <div class="avg-points label">∅ Pkt.</div>
          <div class="market-value value">${priceFormatter.format(this.data.marketValue)}</div>
          <div class="market-value label">Marktwert</div>
        </div>
      </a>
    `;
  }

  private badgeTemplate(text: string = ''): TemplateResult {
    if (text === '') return html``;
    const badgeWidth = this.getBadgeWidth(text);
    const badgeCenter = badgeWidth / 2;

    return html`
      <svg class="badge" width="${badgeWidth}" viewBox="0 0 ${badgeWidth} 16">
        ${svg`
      <rect x="0" y="0" width="${badgeWidth}" height="16"  />
          <text fill="black" font-size="8pt" text-anchor="middle" x="${badgeCenter}" y="12" dy="1">${text}</text>
  `}
      </svg>
    `;
  }

  private getBadgeWidth(text: string): number {
    return Math.max(32, text.length * 7 + 16);
  }
}
