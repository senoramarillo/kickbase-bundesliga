import { LitElement, html, CSSResultGroup, css, TemplateResult } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';
import { BundesligaTableEntry } from '../models/bundesliga-table';
import { BASE_PATH_WITHOUT_DOMAIN } from '../../base-path.mjs';
import { KICKBASE_API_CONFIG } from '../../base-path.mjs';
import { teamLogosLarge } from '../../images/teams/large';

@customElement('bkb-bundesliga-table-list-item')
export class BundesligaPlayerListItemComponent extends LitElement {
  static styles: CSSResultGroup = css`
    .root {
      display: flex;
      background-color: white;
      margin-top: 0.5rem;
      border-radius: 0.5rem;
      min-height: 76px;
      align-items: center;
      padding: 0 1rem;
      gap: 1rem;
      cursor: pointer;
      color: black;
      box-sizing: border-box;
    }

    .root:link,
    .root:visited,
    .root:hover,
    .root:active {
      text-decoration: none;
    }

    .team-section {
      display: flex;
      align-items: center;
      gap: 0.85rem;
      flex: 1 1 auto;
      min-width: 0;
    }

    .team-name {
      flex: 1 1 auto;
      min-width: 0;
      white-space: normal;
      line-height: 1.15;
      text-align: left;
      word-break: break-word;
    }

    .stats-section {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      flex: 0 0 auto;
    }

    .place {
      width: 32px;
      flex: 0 0 32px;
      text-align: right;
      font-size: 1rem;
      font-weight: 600;
      line-height: 1;
      white-space: nowrap;
    }

    .stat-column {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      min-width: 56px;
    }

    .stat-column.wide {
      min-width: 76px;
    }

    .record {
      display: flex;
      gap: 0.5rem;
      min-width: 120px;
      justify-content: center;
    }

    .record-item {
      text-align: center;
      min-width: 32px;
    }

    .form {
      display: flex;
      flex-direction: column;
      align-items: center;
      min-width: 96px;
    }

    .form-dots {
      display: flex;
      gap: 0.3rem;
    }

    .form-dot {
      width: 18px;
      height: 18px;
      border-radius: 999px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 0.7rem;
      font-weight: 700;
      color: white;
    }

    .form-dot.win {
      background: #2d9d62;
    }

    .form-dot.draw {
      background: #7f8c93;
    }

    .form-dot.loss {
      background: #d84f4f;
    }

    .team-logo {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 56px;
      flex: 0 0 56px;
    }

    .team-logo > img {
      max-width: 40px;
      max-height: 40px;
      object-fit: contain;
    }

    .invisible {
      visibility: hidden;
    }
    .label {
      color: #9ca4a8;
    }

    @media (max-width: 760px) {
      .root {
        flex-direction: column;
        align-items: stretch;
        padding: 0.9rem;
        gap: 0.85rem;
      }

      .stats-section {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 0.75rem;
        width: 100%;
      }

      .stat-column,
      .stat-column.wide,
      .record,
      .form {
        min-width: 0;
      }

      .record {
        justify-content: space-between;
      }
    }
  `;

  @property({ type: Object })
  public data: BundesligaTableEntry;

  @property({ type: String, attribute: 'team-base-path' })
  public teamBasePath: string = `${BASE_PATH_WITHOUT_DOMAIN}/bundesliga/team`;

  protected render(): TemplateResult {
    const teamHref = `${this.teamBasePath}/${encodeURIComponent(this.data.teamName)}`;
    const localLogo = teamLogosLarge[`team_${this.data.teamId}`];
    const fallbackLogo = this.data.teamLogo
      ? this.data.teamLogo.startsWith('http')
        ? this.data.teamLogo
        : `${KICKBASE_API_CONFIG.CDN_URL}${this.data.teamLogo}`
      : '';
    const logoSrc = localLogo ?? fallbackLogo;

    return html`
      <a class="root" href=${teamHref}>
        <div class="team-section">
          <div class="place">
            ${String(this.data.place).length === 1 ? html`<span class="invisible">1</span>` : ''}${this.data.place}
          </div>
          <div class="team-logo">
            <img src="${logoSrc}" alt="${this.data.teamName} logo" />
          </div>
          <div class="team-name">${this.data.teamName}</div>
        </div>
        <div class="stats-section">
          <div class="matches-played stat-column">
            <div class="matches-played value">${this.data.matches}</div>
            <div class="matches-played label">Spiele</div>
          </div>
          <div class="goals stat-column wide">
            <div class="goals value">${this.data.goalsFor} / ${this.data.goalsAgainst}</div>
            <div class="goals label">Tore</div>
          </div>
          <div class="record">
            <div class="record-item">
              <div class="value">${this.data.wins}</div>
              <div class="label">Siege</div>
            </div>
            <div class="record-item">
              <div class="value">${this.data.draws}</div>
              <div class="label">Remis</div>
            </div>
            <div class="record-item">
              <div class="value">${this.data.losses}</div>
              <div class="label">Niederlagen</div>
            </div>
          </div>
          <div class="form stat-column wide">
            <div class="form-dots">
              ${this.data.form.map(result => {
                const cssClass = result === 'W' ? 'win' : result === 'D' ? 'draw' : 'loss';
                return html`<span class="form-dot ${cssClass}">${result}</span>`;
              })}
            </div>
            <div class="label">Form</div>
          </div>
          <div class="points stat-column">
            <div class="points value">${this.data.points}</div>
            <div class="points label">Punkte</div>
          </div>
        </div>
      </a>
    `;
  }
}
