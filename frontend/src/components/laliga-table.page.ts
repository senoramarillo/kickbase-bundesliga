import { LitElement, html, PropertyValueMap, TemplateResult } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';
import { state } from 'lit/decorators/state.js';
import { LaLigaTable, LaLigaTableEntry } from '../models/laliga-table';
import './laliga-table-list-item.ts';

@customElement('bkb-laliga-table')
export class LaLigaTablePage extends LitElement {
  @property({ type: String, attribute: 'server-json-data' })
  declare public serverJsonData: string;

  @state()
  declare private laLigaTable?: LaLigaTable;

  protected async willUpdate(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): Promise<void> {
    const isFirstUpdate: boolean = !this.laLigaTable;

    if (isFirstUpdate) {
      const result: LaLigaTable = JSON.parse(this.serverJsonData);
      result.teams.sort((a: LaLigaTableEntry, b: LaLigaTableEntry) => a.place - b.place);
      this.laLigaTable = result;
    }
  }

  protected render(): TemplateResult {
    return html`
      <div class="root">
        ${this.laLigaTable?.teams.map(
          (team: LaLigaTableEntry) => html`
            <bkb-laliga-table-list-item .data=${team}></bkb-laliga-table-list-item>
          `
        )}
      </div>
    `;
  }
}
