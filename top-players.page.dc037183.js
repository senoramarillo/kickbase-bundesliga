import{s as p,r as v,t as f,e as h,n as g}from"./chunks/state.2381dcd1.js";import{$ as d}from"./chunks/lit-html.154a0938.js";import{B as x}from"./chunks/base-path.2772dca2.js";import{n as s}from"./chunks/no_profile_pic.7d4a63da.js";import{p as u}from"./chunks/price-formatter.ffa65cae.js";import{p as m}from"./chunks/point-formatter.f5baa58d.js";var b=Object.defineProperty,y=Object.getOwnPropertyDescriptor,n=(e,a,t,i)=>{for(var r=i>1?void 0:i?y(a,t):a,c=e.length-1,o;c>=0;c--)(o=e[c])&&(r=(i?o(a,t,r):o(r))||r);return i&&r&&b(a,t,r),r};let l=class extends p{static styles=v`
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

    @media (max-width: 640px) {
      .player-card {
        grid-template-columns: 36px 48px minmax(0, 1fr);
        gap: 0.75rem;
      }

      .player-image {
        width: 48px;
        height: 48px;
      }

      .metric {
        text-align: left;
      }

      .metric,
      .market-value {
        grid-column: 2 / -1;
      }
    }
  `;async willUpdate(e){this.data||(this.data=JSON.parse(this.serverJsonData))}render(){return d`
      <section class="section">
        <h2 class="section-title">Top 10 des Spieltags</h2>
        <div class="player-list">
          ${this.data.currentMatchdayTopPlayers.map((e,a)=>this.playerCardTemplate(e,a+1,!0))}
        </div>
      </section>

      <section class="section">
        <h2 class="section-title">Top 10 insgesamt</h2>
        <div class="player-list">
          ${this.data.overallTopPlayers.map((e,a)=>this.playerCardTemplate(e,a+1,!1))}
        </div>
      </section>
    `}handleImageError(e){const a=e.currentTarget;if(!a)return;const t=a.dataset.fallbackSrc;if(t&&a.src!==t){a.src=t;return}a.src.endsWith(s)||(a.src=s)}playerCardTemplate(e,a,t){const i=`${x}/player/${encodeURIComponent(e.playerName)}/${encodeURIComponent(e.playerId)}`;return d`
      <a class="player-card" href=${i}>
        <div class="rank">${a}</div>
        <img
          class="player-image"
          src=${e.profileBig??s}
          alt="Profilbild von ${e.knownName||e.playerName}"
          data-fallback-src=${e.profileFallback??""}
          onerror="if(this.dataset.fallbackSrc&&this.src!==this.dataset.fallbackSrc){this.onerror=function(){this.onerror=null;this.src='${s}'};this.src=this.dataset.fallbackSrc;}else{this.onerror=null;this.src='${s}'}"
          @error=${this.handleImageError}
        />
        <div class="player-main">
          <div class="player-name">${e.knownName||e.playerName}</div>
          <div class="player-team">${e.teamName}</div>
        </div>
        <div class="metric">
          <div class="metric-value">
            ${t?m.format(e.currentMatchdayPoints):m.format(e.totalPoints)}
          </div>
          <div class="metric-label">${t?"ST-Pkt.":"Gesamt"}</div>
        </div>
        <div class="metric">
          <div class="metric-value">${e.averagePoints}</div>
          <div class="metric-label">Ø Pkt.</div>
        </div>
        <div class="metric">
          <div class="metric-value">${m.format(e.totalPoints)}</div>
          <div class="metric-label">Ges. Pkt.</div>
        </div>
        <div class="metric market-value">
          <div class="metric-value">${u.format(e.marketValue)}</div>
          <div class="metric-label">Marktwert</div>
        </div>
      </a>
    `}};n([h({type:String,attribute:"server-json-data"})],l.prototype,"serverJsonData",2);n([f()],l.prototype,"data",2);l=n([g("bkb-top-players")],l);export{l as TopPlayersPage};
