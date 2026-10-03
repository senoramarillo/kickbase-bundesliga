import{s as M,r as V,t as j,e as x,n as T}from"./chunks/state.2381dcd1.js";import{$ as i,y as z}from"./chunks/lit-html.154a0938.js";import{p as n}from"./chunks/price-formatter.ffa65cae.js";var O=Object.defineProperty,_=Object.getOwnPropertyDescriptor,c=(t,e,r,o)=>{for(var a=o>1?void 0:o?_(e,r):e,l=t.length-1,m;l>=0;l--)(m=t[l])&&(a=(o?m(e,r,a):m(a))||a);return o&&a&&O(e,r,a),a};let d=class extends M{static styles=V`
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
  `;constructor(){super(),this.activeTimeframe="92"}render(){const t=this.currentHistory,e=t?.points??[],r=e[e.length-1]?.marketValue??0;return i`
      <section class="root">
        <div class="header">
          <div>
            <h2 class="title">Marktwertverlauf</h2>
            <p class="subtitle">Letzte 92 Tage</p>
          </div>
        </div>
        <div class="chart-shell">
          <div class="y-axis">
            <span>${n.format(t?.highestMarketValue??0)}</span>
            <span>${n.format(t?.lowestMarketValue??0)}</span>
          </div>
          <div class="chart ${e.length===0?"chart-empty":""}">
            ${e.length>0?this.chartTemplate(e):i`Keine Daten fur diesen Zeitraum verfugbar.`}
          </div>
        </div>
        ${e.length>0?i`
              <div class="x-axis">
                <span>${this.formatPointDate(e[0]?.timestamp??0)}</span>
                <span>${this.formatPointDate(e[e.length-1]?.timestamp??0)}</span>
              </div>
            `:i``}
        ${e.length>0?i`
              <div class="stats">
                <div class="stat">
                  <div class="stat-label">Aktuell</div>
                  <div class="stat-value">${n.format(r)}</div>
                </div>
                <div class="stat">
                  <div class="stat-label">Tief</div>
                  <div class="stat-value">${n.format(t?.lowestMarketValue??0)}</div>
                </div>
                <div class="stat">
                  <div class="stat-label">Hoch</div>
                  <div class="stat-value">${n.format(t?.highestMarketValue??0)}</div>
                </div>
              </div>
            `:i``}
      </section>
    `}get currentHistory(){return(this.history??(this.serverJsonData?JSON.parse(this.serverJsonData):void 0))?.byTimeframe?.[this.activeTimeframe]}chartTemplate(t){const h=t.map(s=>s.marketValue),f=t.map(s=>s.timestamp),p=Math.min(...h),y=Math.max(...h),u=Math.max(1,y-p),g=Math.min(...f),P=Math.max(...f),v=Math.max(1,P-g),b=t.map((s,w)=>{const k=6+(s.timestamp-g)/v*778,D=160-16-(s.marketValue-p)/u*(160-16-16);return`${w===0?"M":"L"} ${k} ${D}`}).join(" "),$=`${b} L ${800-16} ${160-16} L ${6} ${160-16} Z`;return i`
      ${z`
        <svg viewBox="0 0 ${800} ${160}" width="100%" height="100%" preserveAspectRatio="none" role="img" aria-label="Marktwertverlauf">
          <defs>
            <linearGradient id="marketValueArea" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stop-color="rgba(29, 95, 122, 0.28)"></stop>
              <stop offset="100%" stop-color="rgba(29, 95, 122, 0.02)"></stop>
            </linearGradient>
          </defs>
          <path d="${$}" fill="url(#marketValueArea)"></path>
          <path d="${b}" fill="none" stroke="#1d5f7a" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"></path>
          <circle
            cx="${6+(t[t.length-1].timestamp-g)/v*(800-6-16)}"
            cy="${160-16-(t[t.length-1].marketValue-p)/u*(160-16-16)}"
            r="5"
            fill="#1d5f7a"
          ></circle>
        </svg>
      `}
    `}formatPointDate(t){return t?new Date(t*24*60*60*1e3).toLocaleDateString("de-DE",{day:"2-digit",month:"2-digit",year:"2-digit"}):""}};c([x({type:Object})],d.prototype,"history",2);c([x({type:String,attribute:"server-json-data"})],d.prototype,"serverJsonData",2);c([j()],d.prototype,"activeTimeframe",2);d=c([T("bkb-player-market-value")],d);export{d as PlayerMarketValueComponent};
