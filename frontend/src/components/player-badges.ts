import { LitElement, html, CSSResultGroup, css, TemplateResult, svg } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';
import { getPlayerPositionLabel, PlayerPosition } from '../models/player-position';

@customElement('bkb-player-badges')
export class PlayerBadgesComponent extends LitElement {
  static styles: CSSResultGroup = css`
    .badges-container {
      display: flex;
    }

    svg {
      transform: skew(-10deg);
      height: 16px;
    }

    svg:not(:last-child) {
      margin-right: 4px;
    }

    svg text {
      font-weight: 700;
      font-size: 10px;
    }
  `;

  @property({ type: Number })
  public number?: number;

  @property({ type: String })
  public position?: string;

  @property({ type: String })
  public status?: string;

  @property({ type: Boolean })
  public inverted: boolean = false;

  render() {
    return html`
      <div class="badges-container">
        ${this.singleBadge(String(this.number))}
        ${this.singleBadge(getPlayerPositionLabel(this.position as unknown as PlayerPosition))}
        ${this.singleBadge(this.status)}
      </div>
    `;
  }

  private singleBadge(text: string | undefined): TemplateResult | string {
    if (text === undefined) return '';
    const badgeWidth = this.getBadgeWidth(text);
    const badgeCenter = badgeWidth / 2;

    if (!this.inverted) {
      return html`
        <svg width="${badgeWidth}" viewBox="0 0 ${badgeWidth} 16">
          ${svg`
        <rect x="0" y="0" width="${badgeWidth}" height="16" fill="white" />
        <text text-anchor="middle" x="${badgeCenter}" y="12" dy="1">${text}</text>
    `}
        </svg>
      `;
    }

    return html`
      <svg width="${badgeWidth}" viewBox="0 0 ${badgeWidth} 16">
        ${svg`
        <defs>
          <mask id="mask-${text}" x="0" y="0" >
            <rect x="0" y="0" width="${badgeWidth}" height="16" fill="#fff" />
            <text text-anchor="middle" x="${badgeCenter}" y="12" dy="1">${text}</text>
          </mask>
        </defs>
        <rect x="0" y="0" width="${badgeWidth}" height="16" mask="url(#mask-${text})" fill-opacity="1" />
        `}
      </svg>
    `;
  }

  private getBadgeWidth(text: string): number {
    return Math.max(32, text.length * 7 + 16);
  }
}
