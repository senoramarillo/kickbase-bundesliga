import { LitElement, html, CSSResultGroup, css, svg, TemplateResult } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';
import { state } from 'lit/decorators/state.js';
import { priceFormatter } from '../helpers/price-formatter';
import type { PlayerMarketValueHistories, PlayerMarketValueHistory, PlayerMarketValuePoint } from '../models/player-market-value';

@customElement('bkb-player-market-value')
export class PlayerMarketValueComponent extends LitElement {
  static styles: CSSResultGroup = css`
    .root {
      padding: 1rem;
      border-top: 1px solid #d3d7d8;
      background: #fff;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 0.9rem;
    }

    .title {
      margin: 0;
      font-size: 1.15rem;
    }

    .subtitle {
      margin: 0.2rem 0 0;
      color: #63727a;
      font-size: 0.9rem;
    }

    .toolbar {
      display: inline-flex;
      flex-direction: column;
      gap: 0.35rem;
      margin-top: 0.6rem;
      position: relative;
      z-index: 1;
    }

    .timeframe-select {
      border: 1px solid #cfd9de;
      background: #fff;
      color: #63727a;
      border-radius: 0.75rem;
      padding: 0.55rem 0.7rem;
      font: inherit;
    }

    .chart {
      width: 100%;
      height: 140px;
      border-radius: 0.9rem;
      background: linear-gradient(180deg, #f6f9fb 0%, #eef3f6 100%);
      border: 1px solid #dde5ea;
      overflow: hidden;
    }

    .chart-shell {
      display: grid;
      grid-template-columns: 76px minmax(0, 1fr);
      gap: 0.5rem;
      align-items: stretch;
    }

    .y-axis {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      color: #63727a;
      font-size: 0.8rem;
      text-align: right;
      padding: 0.2rem 0.3rem 0.2rem 0;
    }

    .x-axis {
      display: flex;
      justify-content: space-between;
      color: #63727a;
      font-size: 0.8rem;
      margin-top: 0.4rem;
      padding-left: calc(76px + 0.5rem);
    }

    .chart-empty {
      display: flex;
      align-items: center;
      justify-content: center;
      color: #63727a;
      font-size: 0.95rem;
    }

    .stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      gap: 0.75rem;
      margin-top: 0.9rem;
    }

    .stat {
      background: #f6f9fb;
      border: 1px solid #dde5ea;
      border-radius: 0.8rem;
      padding: 0.75rem 0.85rem;
    }

    .stat-label {
      color: #63727a;
      font-size: 0.82rem;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .stat-value {
      margin-top: 0.25rem;
      font-size: 1rem;
      font-weight: 700;
    }
  `;

  @property({ type: Object })
  declare public history?: PlayerMarketValueHistories;

  @property({ type: String, attribute: 'server-json-data' })
  declare public serverJsonData?: string;

  @state()
  declare private activeTimeframe: '92';

  public constructor() {
    super();
    this.activeTimeframe = '92';
  }

  protected render(): TemplateResult {
    const activeHistory = this.currentHistory;
    const points = activeHistory?.points ?? [];
    const currentValue = points[points.length - 1]?.marketValue ?? 0;

    return html`
      <section class="root">
        <div class="header">
          <div>
            <h2 class="title">Marktwertverlauf</h2>
            <p class="subtitle">Letzte 92 Tage</p>
          </div>
        </div>
        <div class="chart-shell">
          <div class="y-axis">
            <span>${priceFormatter.format(activeHistory?.highestMarketValue ?? 0)}</span>
            <span>${priceFormatter.format(activeHistory?.lowestMarketValue ?? 0)}</span>
          </div>
          <div class="chart ${points.length === 0 ? 'chart-empty' : ''}">
            ${points.length > 0 ? this.chartTemplate(points) : html`Keine Daten fur diesen Zeitraum verfugbar.`}
          </div>
        </div>
        ${points.length > 0
          ? html`
              <div class="x-axis">
                <span>${this.formatPointDate(points[0]?.timestamp ?? 0)}</span>
                <span>${this.formatPointDate(points[points.length - 1]?.timestamp ?? 0)}</span>
              </div>
            `
          : html``}
        ${points.length > 0
          ? html`
              <div class="stats">
                <div class="stat">
                  <div class="stat-label">Aktuell</div>
                  <div class="stat-value">${priceFormatter.format(currentValue)}</div>
                </div>
                <div class="stat">
                  <div class="stat-label">Tief</div>
                  <div class="stat-value">${priceFormatter.format(activeHistory?.lowestMarketValue ?? 0)}</div>
                </div>
                <div class="stat">
                  <div class="stat-label">Hoch</div>
                  <div class="stat-value">${priceFormatter.format(activeHistory?.highestMarketValue ?? 0)}</div>
                </div>
              </div>
            `
          : html``}
      </section>
    `;
  }

  private get currentHistory(): PlayerMarketValueHistory | undefined {
    const histories =
      this.history ??
      (this.serverJsonData ? (JSON.parse(this.serverJsonData) as PlayerMarketValueHistories) : undefined);

    return histories?.byTimeframe?.[this.activeTimeframe];
  }

  private chartTemplate(points: PlayerMarketValuePoint[]): TemplateResult {
    const width = 800;
    const height = 160;
    const leftPadding = 6;
    const rightPadding = 16;
    const topPadding = 16;
    const bottomPadding = 16;
    const values = points.map(point => point.marketValue);
    const timestamps = points.map(point => point.timestamp);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const valueRange = Math.max(1, maxValue - minValue);
    const minTimestamp = Math.min(...timestamps);
    const maxTimestamp = Math.max(...timestamps);
    const timeRange = Math.max(1, maxTimestamp - minTimestamp);

    const pathData = points
      .map((point: PlayerMarketValuePoint, index: number) => {
        const x = leftPadding + ((point.timestamp - minTimestamp) / timeRange) * (width - leftPadding - rightPadding);
        const y =
          height -
          bottomPadding -
          ((point.marketValue - minValue) / valueRange) * (height - topPadding - bottomPadding);
        return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
      })
      .join(' ');

    const areaData =
      `${pathData} ` +
      `L ${width - rightPadding} ${height - bottomPadding} ` +
      `L ${leftPadding} ${height - bottomPadding} Z`;

    return html`
      ${svg`
        <svg viewBox="0 0 ${width} ${height}" width="100%" height="100%" preserveAspectRatio="none" role="img" aria-label="Marktwertverlauf">
          <defs>
            <linearGradient id="marketValueArea" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stop-color="rgba(29, 95, 122, 0.28)"></stop>
              <stop offset="100%" stop-color="rgba(29, 95, 122, 0.02)"></stop>
            </linearGradient>
          </defs>
          <path d="${areaData}" fill="url(#marketValueArea)"></path>
          <path d="${pathData}" fill="none" stroke="#1d5f7a" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"></path>
          <circle
            cx="${leftPadding + ((points[points.length - 1].timestamp - minTimestamp) / timeRange) * (width - leftPadding - rightPadding)}"
            cy="${height - bottomPadding - ((points[points.length - 1].marketValue - minValue) / valueRange) * (height - topPadding - bottomPadding)}"
            r="5"
            fill="#1d5f7a"
          ></circle>
        </svg>
      `}
    `;
  }

  private formatPointDate(timestamp: number): string {
    if (!timestamp) {
      return '';
    }

    const date = new Date(timestamp * 24 * 60 * 60 * 1000);
    return date.toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    });
  }
}
