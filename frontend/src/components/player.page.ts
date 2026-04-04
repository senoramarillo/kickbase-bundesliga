import { LitElement, html, PropertyValueMap, CSSResultGroup, css, TemplateResult } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';
import { classMap } from 'lit/directives/class-map.js';
import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';
import { state } from 'lit/decorators/state.js';
import type { PlayerInfo } from '../services/playerdata/player-info.service';
import type { PlayerPoints } from '../services/playerdata/player-points.service';
import type { PlayerStats } from '../services/playerdata/player-stats.service';
import type { PlayerData } from '../services/playerdata/playerdata.service';
import { teamColors } from '../models/team-colors';
import noProfilePicFallback from '../../images/no_profile_pic.png';
import './player-badges.ts';
import './player-points.ts';
import { priceFormatter } from '../helpers/price-formatter';
import { PlayerStatus } from '../models/player-status';

@customElement('bkb-player')
export class PlayerPage extends LitElement {
  @property({ type: String, attribute: 'player-name' })
  declare public playerName: string;

  @property({ type: String, attribute: 'player-id' })
  declare public playerId: string;

  @property({ type: String, attribute: 'server-json-data' })
  declare public serverJsonData: string;

  @property({ type: String, attribute: 'team-id' })
  declare public teamId: string;

  @state()
  declare public playerInfo: PlayerInfo;

  @state()
  declare public playerPoints: PlayerPoints;

  @state()
  declare public playerStats: PlayerStats;

  @state()
  declare private currentProfileImage: string;

  private hasTriedKickbaseFallback = false;

  static styles: CSSResultGroup = [
    teamColors,
    css`
      .upper-half {
        width: 100%;
        display: grid;
        grid-template-columns: auto;
        grid-template-rows: auto;
        grid-template-areas: 'main';
      }

      img.player-image {
        grid-area: main;
        width: 100%;
        z-index: 0;
      }

      .player-color-fade {
        grid-area: main;
        width: 100%;
        height: 60%;
        align-self: end;
        z-index: 1;
      }

      .player-summary {
        grid-area: main;
        z-index: 2;
        display: flex;
        flex-direction: column-reverse;
        align-items: center;
      }

      h1.player-name {
        margin: 0;
        color: white;
      }
      h1.player-name.inverted {
        color: black;
      }
      .bottom-container {
        align-self: stretch;
        padding: 0.5rem 1rem 0.5rem 1rem;
        color: white;
      }
      .bottom-container.inverted {
        color: black;
      }
      .price-container {
        display: flex;
      }
      .price-value {
        margin: 0;
      }
    `
  ];

  protected async willUpdate(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): Promise<void> {
    const isFirstUpdate: boolean = !this.playerPoints;

    if (isFirstUpdate) {
      const { playerInfo, playerPoints, playerStats }: PlayerData = JSON.parse(this.serverJsonData);
      this.playerInfo = playerInfo;
      this.playerPoints = playerPoints;
      this.playerStats = playerStats;
      this.currentProfileImage = playerInfo.profileBig ?? noProfilePicFallback;
      this.hasTriedKickbaseFallback = false;
    }
  }

  private get upperHalfStyles(): Record<string, string> {
    return { 'background-color': `var(--team-primary-color-${this.teamId}, gray)` };
  }

  private get colorFadeStyles(): Record<string, string> {
    return {
      background: `linear-gradient(to bottom, transparent, var(--team-primary-color-${this.teamId}, gray));`
    };
  }

  private handleImageError(): void {
    if (!this.hasTriedKickbaseFallback && this.playerInfo?.profileFallback) {
      this.hasTriedKickbaseFallback = true;
      this.currentProfileImage = this.playerInfo.profileFallback;
      return;
    }

    this.currentProfileImage = noProfilePicFallback;
  }

  protected render(): TemplateResult {
    return html`
      <div class="upper-half" style=${styleMap(this.upperHalfStyles)}>
        <img
          class="player-image"
          src=${this.currentProfileImage}
          alt="Profilbild von ${this.playerName}"
          data-fallback-src=${this.playerInfo?.profileFallback ?? ''}
          onerror="if(this.dataset.fallbackSrc&&this.src!==this.dataset.fallbackSrc){this.onerror=function(){this.onerror=null;this.src='${noProfilePicFallback}'};this.src=this.dataset.fallbackSrc;}else{this.onerror=null;this.src='${noProfilePicFallback}'}"
          @error=${this.handleImageError}
        />
        <div class="player-color-fade" style=${styleMap(this.colorFadeStyles)}></div>
        <div class="player-summary">
          <div
            class=${classMap({
              'bottom-container': true,
              'inverted': this.playerInfo.teamName === 'Dortmund'
            })}
          >
            <div class="price-container">
              <h3 class="price-value">
                ${priceFormatter.format(this.playerInfo.marketValue ?? 0)}&nbsp${this.priceTrendTemplate(
                  this.playerInfo.marketValueTrend
                )}
              </h3>
            </div>
          </div>
          <h1
            class=${classMap({
              'player-name': true,
              'inverted': this.playerInfo.teamName === 'Dortmund'
            })}
          >
            ${this.playerName}
          </h1>

          <bkb-player-badges
            .number=${this.playerInfo.number}
            .position=${this.playerInfo.position}
            .status=${PlayerStatus[this.playerInfo.status]}
            ?inverted=${this.playerInfo.teamName === 'Dortmund'}
          ></bkb-player-badges>
        </div>
      </div>
      <bkb-player-points
        .points=${this.playerPoints}
        .upcomingMatches=${this.playerStats.upcomingMatches}
      ></bkb-player-points>
    `;
  }

  private priceTrendTemplate(trend: number): TemplateResult {
    switch (trend) {
      case 1:
        return html`&#8657;`;
      case 2:
        return html`&#8659;`;
      default:
      case 0:
        return html`&#8660;`;
    }
  }
}
