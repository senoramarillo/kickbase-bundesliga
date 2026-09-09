import { LitElement, html, PropertyValueMap, TemplateResult, CSSResultGroup, css } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';
import { state } from 'lit/decorators/state.js';
import { TEAM_IDS, TEAM_NAMES } from '../models/teams';
import { PlayerListItem } from '../models/player-list-item';
import './player-list-item.ts';

@customElement('bkb-team')
export class BundesligaTeamPage extends LitElement {
  static styles: CSSResultGroup = css`
    .root {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .empty-state {
      max-width: 720px;
      margin: 2rem auto;
      padding: 2rem;
      border: 1px solid #d8e0e5;
      border-radius: 1rem;
      background: rgba(255, 255, 255, 0.72);
      box-shadow: 0 16px 36px rgba(19, 33, 40, 0.08);
      text-align: center;
    }

    .empty-state h1 {
      margin: 0;
      font-size: 1.65rem;
    }

    .empty-state p {
      margin: 0.75rem 0 0;
      color: #5d7079;
      line-height: 1.5;
    }
  `;

  @property({ type: String, attribute: 'server-json-data' })
  declare public serverJsonData: string;

  @property({ type: String, attribute: 'team-id' })
  declare public teamId: TEAM_IDS;

  @property({ type: String, attribute: 'team-name' })
  declare public teamName: TEAM_NAMES;

  @state()
  declare private players: PlayerListItem[];

  protected async willUpdate(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): Promise<void> {
    const isFirstUpdate: boolean = !this.players;

    if (isFirstUpdate) {
      const result: PlayerListItem[] = JSON.parse(this.serverJsonData);
      result.sort((a: PlayerListItem, b: PlayerListItem) => a.position - b.position);
      this.players = result;
    }
  }

  protected render(): TemplateResult {
    if (this.players.length === 0) {
      return html`
        <section class="empty-state">
          <h1>${this.teamName}</h1>
          <p>Kaderdaten noch nicht verfügbar.</p>
          <p>Das Team ist bereits in der Bundesliga gelistet, aber Kickbase liefert aktuell noch keine Spieler für diesen Kader.</p>
        </section>
      `;
    }

    return html`
      <div class="root">
        ${this.players.map(
          (player: PlayerListItem) => html` <bkb-player-list-item .data=${player}></bkb-player-list-item> `
        )}
      </div>
    `;
  }
}
