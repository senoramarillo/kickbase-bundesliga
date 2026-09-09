import { LitElement, html, PropertyValueMap, TemplateResult } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';
import { state } from 'lit/decorators/state.js';
import { BundesligaTable, BundesligaTableEntry } from '../models/bundesliga-table';
import './player-badges';
import './player-points';
import './bundesliga-table-list-item';

@customElement('bkb-bundesliga-table')
export class BundesligaTablePage extends LitElement {
  @property({ type: String, attribute: 'server-json-data' })
  declare public serverJsonData: string;

  @state()
  declare private bundesligaTable?: BundesligaTable;

  protected async willUpdate(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): Promise<void> {
    const isFirstUpdate: boolean = !this.bundesligaTable;

    if (isFirstUpdate) {
      const result: BundesligaTable = JSON.parse(this.serverJsonData);
      result.teams.sort((a: BundesligaTableEntry, b: BundesligaTableEntry) => a.place - b.place);
      this.bundesligaTable = result;
    }
  }

  protected render(): TemplateResult {
    return html`
      <div class="root">
        ${this.bundesligaTable?.teams.map(
          (team: BundesligaTableEntry) => html`
            <bkb-bundesliga-table-list-item .data=${team}></bkb-bundesliga-table-list-item>
          `
        )}
      </div>
    `;
  }
}
