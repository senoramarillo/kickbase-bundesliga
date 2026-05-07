import{r as u,s as b,t as n,e as y,n as f}from"./chunks/state.2381dcd1.js";import{b as g,$ as s}from"./chunks/lit-html.154a0938.js";import{i as d}from"./chunks/player-points.9f088c6f.js";import{e as v,i as k,t as I}from"./chunks/directive.7cba340f.js";import{n as p}from"./chunks/no_profile_pic.7d4a63da.js";import{p as P}from"./chunks/price-formatter.ffa65cae.js";import{P as $}from"./chunks/player-status.2e29a2c7.js";import"./chunks/player-position.e63fd2f7.js";import"./chunks/point-formatter.f5baa58d.js";/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const h=v(class extends k{constructor(e){var a;if(super(e),e.type!==I.ATTRIBUTE||e.name!=="class"||((a=e.strings)===null||a===void 0?void 0:a.length)>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(e){return" "+Object.keys(e).filter(a=>e[a]).join(" ")+" "}update(e,[a]){var t,i;if(this.nt===void 0){this.nt=new Set,e.strings!==void 0&&(this.st=new Set(e.strings.join(" ").split(/\s/).filter(r=>r!=="")));for(const r in a)a[r]&&!(!((t=this.st)===null||t===void 0)&&t.has(r))&&this.nt.add(r);return this.render(a)}const o=e.element.classList;this.nt.forEach(r=>{r in a||(o.remove(r),this.nt.delete(r))});for(const r in a){const c=!!a[r];c===this.nt.has(r)||((i=this.st)===null||i===void 0?void 0:i.has(r))||(c?(o.add(r),this.nt.add(r)):(o.remove(r),this.nt.delete(r)))}return g}}),S=u`
  :root,
  * {
    --team-primary-color-15: #28a144;
    --team-primary-color-11: #51a600;
    --team-primary-color-7: #fe0000;
    --team-primary-color-40: #d3011c;
    --team-primary-color-43: #001f46;
    --team-primary-color-3: #fde101;
    --team-primary-color-20: #001f46;
    --team-primary-color-24: #0a5ca5;
    --team-primary-color-13: #ce1719;
    --team-primary-color-14: #1c62b7;
    --team-primary-color-5: #d11b1a;
    --team-primary-color-2: #dc052e;
    --team-primary-color-22: #0090d7;
    --team-primary-color-19: #019a32;
    --team-primary-color-28: #e20612;
    --team-primary-color-9: #e32219;
    --team-primary-color-18: #e30713;
    --team-primary-color-4: #e10010;
    --team-primary-color-50: #e10016;
    --team-primary-color-42: #014d9e;
  }
  .team-primary-color-4 {
    background-color: var(--team-primary-color-4);
  }
  .team-primary-color-15 {
    background-color: var(--team-primary-color-15);
  }
  .team-primary-color-11 {
    background-color: var(--team-primary-color-11);
  }
  .team-primary-color-7 {
    background-color: var(--team-primary-color-7);
  }
  .team-primary-color-40 {
    background-color: var(--team-primary-color-40);
  }
  .team-primary-color-43 {
    background-color: var(--team-primary-color-43);
  }
  .team-primary-color-3 {
    background-color: var(--team-primary-color-3);
  }
  .team-primary-color-20 {
    background-color: var(--team-primary-color-20);
  }
  .team-primary-color-24 {
    background-color: var(--team-primary-color-24);
  }
  .team-primary-color-13 {
    background-color: var(--team-primary-color-13);
  }
  .team-primary-color-14 {
    background-color: var(--team-primary-color-14);
  }
  .team-primary-color-5 {
    background-color: var(--team-primary-color-5);
  }
  .team-primary-color-2 {
    background-color: var(--team-primary-color-2);
  }
  .team-primary-color-22 {
    background-color: var(--team-primary-color-22);
  }
  .team-primary-color-19 {
    background-color: var(--team-primary-color-19);
  }
  .team-primary-color-28 {
    background-color: var(--team-primary-color-28);
  }
  .team-primary-color-9 {
    background-color: var(--team-primary-color-9);
  }
  .team-primary-color-18 {
    background-color: var(--team-primary-color-18);
  }
  .team-primary-color-50 {
    background-color: var(--team-primary-color-50);
  }
  .team-primary-color-42 {
    background-color: var(--team-primary-color-42);
  }
`;var w=Object.defineProperty,F=Object.getOwnPropertyDescriptor,m=(e,a,t,i)=>{for(var o=i>1?void 0:i?F(a,t):a,r=e.length-1,c;r>=0;r--)(c=e[r])&&(o=(i?c(a,t,o):c(o))||o);return i&&o&&w(a,t,o),o};let l=class extends b{hasTriedKickbaseFallback=!1;static styles=[S,u`
      .upper-half {
        width: 100%;
        display: grid;
        grid-template-columns: auto;
        grid-template-rows: auto;
        grid-template-areas: 'main';
      }

      img.player-image {
        grid-area: main;
        width: 100%;
        z-index: 0;
      }

      .player-color-fade {
        grid-area: main;
        width: 100%;
        height: 60%;
        align-self: end;
        z-index: 1;
      }

      .player-summary {
        grid-area: main;
        z-index: 2;
        display: flex;
        flex-direction: column-reverse;
        align-items: center;
      }

      h1.player-name {
        margin: 0;
        color: white;
      }
      h1.player-name.inverted {
        color: black;
      }
      .bottom-container {
        align-self: stretch;
        padding: 0.5rem 1rem 0.5rem 1rem;
        color: white;
      }
      .bottom-container.inverted {
        color: black;
      }
      .price-container {
        display: flex;
      }
      .price-value {
        margin: 0;
      }
    `];async willUpdate(e){if(!this.playerPoints){const{playerInfo:t,playerPoints:i,playerStats:o}=JSON.parse(this.serverJsonData);this.playerInfo=t,this.playerPoints=i,this.playerStats=o,this.currentProfileImage=t.profileBig??p,this.hasTriedKickbaseFallback=!1}}get upperHalfStyles(){return{"background-color":`var(--team-primary-color-${this.teamId}, gray)`}}get colorFadeStyles(){return{background:`linear-gradient(to bottom, transparent, var(--team-primary-color-${this.teamId}, gray));`}}handleImageError(){if(!this.hasTriedKickbaseFallback&&this.playerInfo?.profileFallback){this.hasTriedKickbaseFallback=!0,this.currentProfileImage=this.playerInfo.profileFallback;return}this.currentProfileImage=p}render(){return s`
      <div class="upper-half" style=${d(this.upperHalfStyles)}>
        <img
          class="player-image"
          src=${this.currentProfileImage}
          alt="Profilbild von ${this.playerName}"
          data-fallback-src=${this.playerInfo?.profileFallback??""}
          onerror="if(this.dataset.fallbackSrc&&this.src!==this.dataset.fallbackSrc){this.onerror=function(){this.onerror=null;this.src='${p}'};this.src=this.dataset.fallbackSrc;}else{this.onerror=null;this.src='${p}'}"
          @error=${this.handleImageError}
        />
        <div class="player-color-fade" style=${d(this.colorFadeStyles)}></div>
        <div class="player-summary">
          <div
            class=${h({"bottom-container":!0,inverted:this.playerInfo.teamName==="Dortmund"})}
          >
            <div class="price-container">
              <h3 class="price-value">
                ${P.format(this.playerInfo.marketValue??0)}&nbsp${this.priceTrendTemplate(this.playerInfo.marketValueTrend)}
              </h3>
            </div>
          </div>
          <h1
            class=${h({"player-name":!0,inverted:this.playerInfo.teamName==="Dortmund"})}
          >
            ${this.playerName}
          </h1>

          <bkb-player-badges
            .number=${this.playerInfo.number}
            .position=${this.playerInfo.position}
            .status=${$[this.playerInfo.status]}
            ?inverted=${this.playerInfo.teamName==="Dortmund"}
          ></bkb-player-badges>
        </div>
      </div>
      <bkb-player-points
        .points=${this.playerPoints}
        .upcomingMatches=${this.playerStats.upcomingMatches}
      ></bkb-player-points>
    `}priceTrendTemplate(e){switch(e){case 1:return s`&#8657;`;case 2:return s`&#8659;`;default:case 0:return s`&#8660;`}}};m([y({type:String,attribute:"player-name"})],l.prototype,"playerName",2);m([y({type:String,attribute:"player-id"})],l.prototype,"playerId",2);m([y({type:String,attribute:"server-json-data"})],l.prototype,"serverJsonData",2);m([y({type:String,attribute:"team-id"})],l.prototype,"teamId",2);m([n()],l.prototype,"playerInfo",2);m([n()],l.prototype,"playerPoints",2);m([n()],l.prototype,"playerStats",2);m([n()],l.prototype,"currentProfileImage",2);l=m([f("bkb-player")],l);export{l as PlayerPage};
