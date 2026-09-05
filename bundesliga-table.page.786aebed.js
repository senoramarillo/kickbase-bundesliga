import{s as m,r as v,e as g,n as p,t as f}from"./chunks/state.2381dcd1.js";import{$ as d}from"./chunks/lit-html.154a0938.js";import"./chunks/player-points.9f088c6f.js";import{B as u,K as h}from"./chunks/base-path.2772dca2.js";import"./chunks/player-position.e63fd2f7.js";import"./chunks/point-formatter.f5baa58d.js";import"./chunks/directive.7cba340f.js";const k="/kickbase-bundesliga/assets/2.a58a4fe1.png",x="/kickbase-bundesliga/assets/3.1aaf4c2d.png",_="/kickbase-bundesliga/assets/4.390aa2e6.png",w="/kickbase-bundesliga/assets/5.3c60513d.png",y="/kickbase-bundesliga/assets/6.962a11eb.png",$="/kickbase-bundesliga/assets/7.3228187f.png",P="/kickbase-bundesliga/assets/8.62dbde79.png",O="/kickbase-bundesliga/assets/9.dec4e08a.png",j="/kickbase-bundesliga/assets/10.8350e8cf.png",L="/kickbase-bundesliga/assets/11.966c1542.png",D="/kickbase-bundesliga/assets/13.d1f5ae18.png",T="/kickbase-bundesliga/assets/14.5d4a8ad3.png",C="/kickbase-bundesliga/assets/15.1de1fa14.png",N="/kickbase-bundesliga/assets/18.bb2586fc.png",S="/kickbase-bundesliga/assets/19.6cf8fd57.png",I="/kickbase-bundesliga/assets/20.9ea4b95b.png",A="/kickbase-bundesliga/assets/22.94f6b1e5.png",z="/kickbase-bundesliga/assets/24.3e3d819b.png",B="/kickbase-bundesliga/assets/28.43738ef7.png",F="/kickbase-bundesliga/assets/39.37ab8826.png",U="/kickbase-bundesliga/assets/40.3353a31d.png",H="/kickbase-bundesliga/assets/42.16a241d0.png",J="/kickbase-bundesliga/assets/43.9f19ca2e.png",K="/kickbase-bundesliga/assets/50.30de6bef.png",W="/kickbase-bundesliga/assets/51.61fcb4ab.png",E={team_2:k,team_3:x,team_4:_,team_5:w,team_6:y,team_7:$,team_8:P,team_9:O,team_10:j,team_11:L,team_13:D,team_14:T,team_15:C,team_18:N,team_19:S,team_20:I,team_22:A,team_24:z,team_28:B,team_39:F,team_40:U,team_42:H,team_43:J,team_50:K,team_51:W};var R=Object.defineProperty,G=Object.getOwnPropertyDescriptor,b=(i,a,t,s)=>{for(var e=s>1?void 0:s?G(a,t):a,n=i.length-1,l;n>=0;n--)(l=i[n])&&(e=(s?l(a,t,e):l(e))||e);return s&&e&&R(a,t,e),e};let c=class extends m{static styles=v`
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
      font-size: 0.9rem;
      white-space: normal;
      line-height: 1.15;
      text-align: left;
      overflow-wrap: normal;
      word-break: normal;
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

    @media (max-width: 980px) {
      .root {
        flex-direction: column;
        align-items: stretch;
        padding: 0.9rem;
        gap: 0.85rem;
      }

      .team-name {
        font-size: 0.86rem;
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
  `;data;render(){const i=`${u}/bundesliga/team/${this.data.teamName}`,a=E[`team_${this.data.teamId}`],t=this.data.teamLogo?this.data.teamLogo.startsWith("http")?this.data.teamLogo:`${h.CDN_URL}${this.data.teamLogo}`:"",s=a??t;return d`
      <a class="root" href=${i}>
        <div class="team-section">
          <div class="place">
            ${String(this.data.place).length===1?d`<span class="invisible">1</span>`:""}${this.data.place}
          </div>
          <div class="team-logo">
            <img src="${s}" alt="${this.data.teamName} logo" />
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
              ${this.data.form.map(e=>d`<span class="form-dot ${e==="W"?"win":e==="D"?"draw":"loss"}">${e}</span>`)}
            </div>
            <div class="label">Form</div>
          </div>
          <div class="points stat-column">
            <div class="points value">${this.data.points}</div>
            <div class="points label">Punkte</div>
          </div>
        </div>
      </a>
    `}};b([g({type:Object})],c.prototype,"data",2);c=b([p("bkb-bundesliga-table-list-item")],c);var M=Object.defineProperty,q=Object.getOwnPropertyDescriptor,r=(i,a,t,s)=>{for(var e=s>1?void 0:s?q(a,t):a,n=i.length-1,l;n>=0;n--)(l=i[n])&&(e=(s?l(a,t,e):l(e))||e);return s&&e&&M(a,t,e),e};let o=class extends m{async willUpdate(i){if(!this.bundesligaTable){const t=JSON.parse(this.serverJsonData);t.teams.sort((s,e)=>s.place-e.place),this.bundesligaTable=t}}render(){return d`
      <div class="root">
        ${this.bundesligaTable?.teams.map(i=>d`
            <bkb-bundesliga-table-list-item .data=${i}></bkb-bundesliga-table-list-item>
          `)}
      </div>
    `}};r([g({type:String,attribute:"server-json-data"})],o.prototype,"serverJsonData",2);r([f()],o.prototype,"bundesligaTable",2);o=r([p("bkb-bundesliga-table")],o);export{o as BundesligaTablePage};
