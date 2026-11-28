import{s as c,r as h,e as m,n as v,t as u}from"./chunks/state.2381dcd1.js";import{$ as s,y as f}from"./chunks/lit-html.154a0938.js";import{n as d}from"./chunks/no_profile_pic.7d4a63da.js";import{B as y}from"./chunks/base-path.2772dca2.js";import{p as x}from"./chunks/price-formatter.ffa65cae.js";import{p as k}from"./chunks/point-formatter.f5baa58d.js";import{P as $}from"./chunks/player-status.2e29a2c7.js";import{g as P}from"./chunks/player-position.e63fd2f7.js";var w=Object.defineProperty,_=Object.getOwnPropertyDescriptor,b=(t,e,r,i)=>{for(var a=i>1?void 0:i?_(e,r):e,l=t.length-1,o;l>=0;l--)(o=t[l])&&(a=(i?o(e,r,a):o(a))||a);return i&&a&&w(e,r,a),a};let g=class extends c{static styles=h`
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

    @media (max-width: 640px) {
      .root {
        height: auto;
        align-items: stretch;
      }

      .root > *:not(:first-child) {
        padding-left: 0;
      }

      .left {
        display: flex;
        align-items: stretch;
      }

      .player-img {
        width: 92px;
        height: 100%;
        clip-path: none;
        margin-left: 0;
        border-radius: 0.5rem 0 0 0.5rem;
      }

      .right {
        grid-template-columns: 1fr 1fr;
        gap: 0.2rem 0.75rem;
        padding: 0.85rem;
        grid-template-areas:
          'badges badges'
          'name name'
          'points-value avg-points-value'
          'points-label avg-points-label'
          'market-value-value market-value-value'
          'market-value-label market-value-label';
      }

      .name {
        font-size: 1.15rem;
      }

      .market-value.value,
      .market-value.label {
        justify-self: start;
      }
    }
  `;data;handleImageError(t){const e=t.currentTarget;if(!e)return;const r=e.dataset.fallbackSrc;if(r&&e.src!==r){e.src=r;return}e.src.endsWith(d)||(e.src=d)}render(){const t=`${y}/player/${this.data.playerName}/${this.data.playerId}`;return s`
      <a class="root" href=${t}>
        <div class="left">
          <img
            class="player-img"
            src="${this.data.profileBig??d}"
            alt="Profilbild von ${this.data.playerName}"
            data-fallback-src="${this.data.profileFallback??""}"
            onerror="if(this.dataset.fallbackSrc&&this.src!==this.dataset.fallbackSrc){this.onerror=function(){this.onerror=null;this.src='${d}'};this.src=this.dataset.fallbackSrc;}else{this.onerror=null;this.src='${d}'}"
            @error=${this.handleImageError}
          />
        </div>

        <div class="right">
          <div class="badges">
            ${this.data.number?this.badgeTemplate(String(this.data.number)):s``}
            ${this.data.position?this.badgeTemplate(P(this.data.position)):s``}
            ${this.data.status?this.badgeTemplate($[this.data.status]):s``}
          </div>
          <div class="name value">${this.data.knownName??this.data.lastName}</div>
          <div class="points value">${k.format(this.data.totalPoints)}</div>
          <div class="points label">Pkt.</div>
          <div class="avg-points value">${this.data.averagePoints}</div>
          <div class="avg-points label">∅ Pkt.</div>
          <div class="market-value value">${x.format(this.data.marketValue)}</div>
          <div class="market-value label">Marktwert</div>
        </div>
      </a>
    `}badgeTemplate(t=""){if(t==="")return s``;const e=this.getBadgeWidth(t),r=e/2;return s`
      <svg class="badge" width="${e}" viewBox="0 0 ${e} 16">
        ${f`
      <rect x="0" y="0" width="${e}" height="16"  />
          <text fill="black" font-size="8pt" text-anchor="middle" x="${r}" y="12" dy="1">${t}</text>
  `}
      </svg>
    `}getBadgeWidth(t){return Math.max(32,t.length*7+16)}};b([m({type:Object})],g.prototype,"data",2);g=b([v("bkb-player-list-item")],g);var S=Object.defineProperty,O=Object.getOwnPropertyDescriptor,p=(t,e,r,i)=>{for(var a=i>1?void 0:i?O(e,r):e,l=t.length-1,o;l>=0;l--)(o=t[l])&&(a=(i?o(e,r,a):o(a))||a);return i&&a&&S(e,r,a),a};let n=class extends c{static styles=h`
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
  `;async willUpdate(t){if(!this.players){const r=JSON.parse(this.serverJsonData);r.sort((i,a)=>i.position-a.position),this.players=r}}render(){return this.players.length===0?s`
        <section class="empty-state">
          <h1>${this.teamName}</h1>
          <p>Kaderdaten noch nicht verfügbar.</p>
          <p>Das Team ist bereits in der Bundesliga gelistet, aber Kickbase liefert aktuell noch keine Spieler für diesen Kader.</p>
        </section>
      `:s`
      <div class="root">
        ${this.players.map(t=>s` <bkb-player-list-item .data=${t}></bkb-player-list-item> `)}
      </div>
    `}};p([m({type:String,attribute:"server-json-data"})],n.prototype,"serverJsonData",2);p([m({type:String,attribute:"team-id"})],n.prototype,"teamId",2);p([m({type:String,attribute:"team-name"})],n.prototype,"teamName",2);p([u()],n.prototype,"players",2);n=p([v("bkb-team")],n);export{n as BundesligaTeamPage};
