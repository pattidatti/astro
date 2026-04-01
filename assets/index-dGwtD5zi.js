(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function e(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(s){if(s.ep)return;s.ep=!0;const r=e(s);fetch(s.href,r)}})();const xs=[{id:"xerion",name:"XERION",col:"#1a6fff",glow:"#4499ff",type:"terr",cost:0,desc:"Home world. Rich in ore.",mb:0,nebulaPalette:{colors:["#020810","#0a1a33","#102844","#1a5577","#2288aa"],density:.55,seed:42}},{id:"drakon",name:"DRAKON",col:"#cc3300",glow:"#ff6633",type:"lava",cost:500,desc:"Volcanic. High-temp deposits.",mb:.4,nebulaPalette:{colors:["#0a0200","#331000","#662200","#994422","#cc7744"],density:.6,seed:137}},{id:"crystara",name:"CRYSTARA",col:"#aa44ff",glow:"#cc88ff",type:"cryst",cost:2500,desc:"Crystal-rich atmosphere.",mb:.8,nebulaPalette:{colors:["#06000e","#1a0033","#3d1166","#6633aa","#9955dd"],density:.6,seed:271}},{id:"voltara",name:"VOLTARA",col:"#ffcc00",glow:"#ffee66",type:"gas",cost:12e3,desc:"Gas giant. Limitless energy.",mb:1.5,nebulaPalette:{colors:["#050300","#1a0e00","#33220a","#664411","#aa7733"],density:.55,seed:389}},{id:"glacius",name:"GLACIUS",col:"#88ddff",glow:"#aaeeff",type:"ice",cost:6e4,desc:"Frozen. Dense crystal matrix.",mb:2.5,nebulaPalette:{colors:["#000508","#051520","#0a2a40","#1a5570","#338899"],density:.5,seed:503}},{id:"nebulox",name:"NEBULOX",col:"#ff44aa",glow:"#ff88cc",type:"neb",cost:3e5,desc:"Nebula core. Exotic matter.",mb:5,nebulaPalette:{colors:["#0a0006","#2a0022","#551144","#882266","#cc4499"],density:.7,seed:617}},{id:"solaris",name:"SOLARIS",col:"#ff8800",glow:"#ffaa33",type:"star",cost:15e5,desc:"Star fragment. Pure energy.",mb:12,nebulaPalette:{colors:["#080200","#221000","#552200","#884400","#cc6600"],density:.65,seed:739}},{id:"voidex",name:"VOIDEX",col:"#880088",glow:"#bb44bb",type:"void",cost:8e6,desc:"Void matter. Dimensional ore.",mb:30,nebulaPalette:{colors:["#020008","#0a0022","#1a0044","#2a0066","#440088"],density:.6,seed:853}}],Xc={terr:["#88ddff","#3388ee","#1a55cc","#0a2266"],lava:["#ffcc66","#ff5522","#cc2200","#551100"],cryst:["#ffbbff","#dd66ff","#9933cc","#440066"],gas:["#ffff99","#ffcc33","#ee8800","#553300"],ice:["#ffffff","#cceeff","#66bbee","#113366"],neb:["#ffaadd","#ff5599","#cc2266","#330022"],star:["#ffffee","#ffee66","#ffaa22","#663300"],void:["#dd66ee","#9933bb","#553388","#110022"]},Ka=[{id:"d1",icon:"🤖",name:"DRONE MK.I",desc:"+1 drone",oreCost:10,crystalCost:0,effect:"rob",amt:1,max:null},{id:"d2",icon:"⚙️",name:"DRILL MK.II",desc:"+5 drones",oreCost:80,crystalCost:0,effect:"rob",amt:5,max:null},{id:"d3",icon:"🦾",name:"MECH DRILL",desc:"+25 drones",oreCost:500,crystalCost:0,effect:"rob",amt:25,max:null},{id:"c1",icon:"👊",name:"POWER FIST",desc:"Click +1",oreCost:50,crystalCost:0,effect:"clk",amt:1,max:null},{id:"c2",icon:"⚡",name:"HYPER FIST",desc:"Click +5",oreCost:400,crystalCost:0,effect:"clk",amt:5,max:null},{id:"a1",icon:"🔄",name:"AUTO-MINE",desc:"+2 ore/s passive",oreCost:200,crystalCost:0,effect:"aut",amt:2,max:null},{id:"e1",icon:"📡",name:"EFFICIENCY+",desc:"All rates ×1.5",oreCost:1e3,crystalCost:5,effect:"eff",amt:.5,max:null},{id:"q1",icon:"🌀",name:"QUANTUM CORE",desc:"All rates ×2",oreCost:5e3,crystalCost:20,effect:"eff",amt:1,max:null},{id:"sw",icon:"🚀",name:"DRONE SWARM",desc:"+50 drones",oreCost:3e3,crystalCost:10,effect:"rob",amt:50,max:null},{id:"dk",icon:"💎",name:"DARK ORE",desc:"Unlock crystals",oreCost:2e3,crystalCost:0,effect:"cry",amt:1,max:1},{id:"fu",icon:"🔥",name:"FUSION CORE",desc:"Unlock energy",oreCost:8e3,crystalCost:50,effect:"enr",amt:1,max:1},{id:"mg",icon:"🏭",name:"MEGA ARRAY",desc:"+200 drones",oreCost:2e4,crystalCost:100,effect:"rob",amt:200,max:null}],qc=1.15;class Pd{constructor(){this._listeners={}}on(t,e){var n;((n=this._listeners)[t]||(n[t]=[])).push(e)}off(t,e){const n=this._listeners[t];n&&(this._listeners[t]=n.filter(s=>s!==e))}emit(t,e){(this._listeners[t]||[]).forEach(n=>n(e))}}class Id extends Pd{constructor(){super(),this.ore=0,this.crystal=0,this.energy=0,this.robots=0,this.clickPow=1,this.autoRate=0,this.effMult=1,this.crystalUnlocked=!1,this.energyUnlocked=!1,this.ownedPlanets=["xerion"],this.activePlanet="xerion",this.upgradeLevels={},this.buyMult=1,this.lastSaved=Date.now()}get activePlanetDef(){return xs.find(t=>t.id===this.activePlanet)||xs[0]}get planetMultiplier(){return 1+(this.activePlanetDef.mb||0)}get oreRate(){return this.robots*.5*this.effMult*this.planetMultiplier+this.autoRate}get crystalRate(){return this.crystalUnlocked?this.robots*.05*this.effMult*this.planetMultiplier:0}get energyRate(){return this.energyUnlocked?this.robots*.02*this.effMult*this.planetMultiplier:0}tick(t){this.ore+=this.oreRate*t,this.crystal+=this.crystalRate*t,this.energy+=this.energyRate*t}addOre(t){this.ore+=t}upgradeCost(t){const e=Ka.find(a=>a.id===t);if(!e)return null;const n=this.upgradeLevels[t]||0,r=e.effect==="cry"||e.effect==="enr"?1:this.buyMult;return{ore:Math.floor(e.oreCost*Math.pow(qc,n)*r),crystal:Math.floor(e.crystalCost*Math.pow(qc,n)*r),mult:r}}canAfford(t){const e=this.upgradeCost(t);return e?this.ore>=e.ore&&this.crystal>=e.crystal:!1}buyUpgrade(t){const e=Ka.find(l=>l.id===t);if(!e)return!1;const n=this.upgradeCost(t);if(!n||this.ore<n.ore||this.crystal<n.crystal)return!1;const s=this.upgradeLevels[t]||0;if(e.max&&s>=e.max)return!1;this.ore-=n.ore,this.crystal-=n.crystal,this.upgradeLevels[t]=s+1;const a=e.effect==="cry"||e.effect==="enr"?1:this.buyMult;switch(e.effect){case"rob":this.robots+=e.amt*a,this.emit("robotsChanged",this.robots);break;case"clk":this.clickPow+=e.amt*a;break;case"aut":this.autoRate+=e.amt*a;break;case"eff":this.effMult+=e.amt*a;break;case"cry":this.crystalUnlocked=!0,this.emit("crystalUnlocked");break;case"enr":this.energyUnlocked=!0,this.emit("energyUnlocked");break}return this.emit("upgradeBought",t),!0}colonizePlanet(t){const e=xs.find(n=>n.id===t);return!e||this.ownedPlanets.includes(t)||this.ore<e.cost?!1:(this.ore-=e.cost,this.ownedPlanets.push(t),this.activePlanet=t,this.emit("planetColonized",t),!0)}switchPlanet(t){return this.ownedPlanets.includes(t)?(this.activePlanet=t,this.emit("planetChanged",t),!0):!1}serialize(){return{ore:this.ore,crystal:this.crystal,energy:this.energy,robots:this.robots,clickPow:this.clickPow,autoRate:this.autoRate,effMult:this.effMult,cryUnlocked:this.crystalUnlocked,enrUnlocked:this.energyUnlocked,ownedPlanets:this.ownedPlanets,activePlanet:this.activePlanet,upgradeLevels:this.upgradeLevels,lastSaved:Date.now()}}deserialize(t){t&&(this.ore=t.ore??0,this.crystal=t.crystal??0,this.energy=t.energy??0,this.robots=t.robots??0,this.clickPow=t.clickPow??1,this.autoRate=t.autoRate??0,this.effMult=t.effMult??1,this.crystalUnlocked=t.cryUnlocked??!1,this.energyUnlocked=t.enrUnlocked??!1,this.ownedPlanets=t.ownedPlanets??["xerion"],this.activePlanet=t.activePlanet??"xerion",this.upgradeLevels=t.upgradeLevels??{},this.lastSaved=t.lastSaved??Date.now(),this.emit("stateLoaded"),this.emit("robotsChanged",this.robots),this.crystalUnlocked&&this.emit("crystalUnlocked"),this.energyUnlocked&&this.emit("energyUnlocked"))}applyOfflineEarnings(){const t=Math.min((Date.now()-this.lastSaved)/1e3,28800);if(t>10){const e=this.oreRate*t*.5,n=this.crystalRate*t*.5,s=this.energyRate*t*.5;return this.ore+=e,this.crystal+=n,this.energy+=s,{elapsed:t,earned:e,crystalEarned:n,energyEarned:s}}return null}}const Mt=new Id,Qu="astro_save";function Fr(){try{const i=Mt.serialize();localStorage.setItem(Qu,JSON.stringify(i))}catch(i){console.warn("LocalStorage save failed:",i)}}function Dd(){try{const i=localStorage.getItem(Qu);if(i)return JSON.parse(i)}catch(i){console.warn("LocalStorage load failed:",i)}return null}let ra=null;function Ld(i=1e4){ra&&clearInterval(ra),ra=setInterval(Fr,i),Mt.on("upgradeBought",Fr),Mt.on("planetColonized",Fr),document.addEventListener("visibilitychange",()=>{document.visibilityState==="hidden"&&Fr()})}const Ud=()=>{};var jc={};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const tf=function(i){const t=[];let e=0;for(let n=0;n<i.length;n++){let s=i.charCodeAt(n);s<128?t[e++]=s:s<2048?(t[e++]=s>>6|192,t[e++]=s&63|128):(s&64512)===55296&&n+1<i.length&&(i.charCodeAt(n+1)&64512)===56320?(s=65536+((s&1023)<<10)+(i.charCodeAt(++n)&1023),t[e++]=s>>18|240,t[e++]=s>>12&63|128,t[e++]=s>>6&63|128,t[e++]=s&63|128):(t[e++]=s>>12|224,t[e++]=s>>6&63|128,t[e++]=s&63|128)}return t},Nd=function(i){const t=[];let e=0,n=0;for(;e<i.length;){const s=i[e++];if(s<128)t[n++]=String.fromCharCode(s);else if(s>191&&s<224){const r=i[e++];t[n++]=String.fromCharCode((s&31)<<6|r&63)}else if(s>239&&s<365){const r=i[e++],a=i[e++],l=i[e++],c=((s&7)<<18|(r&63)<<12|(a&63)<<6|l&63)-65536;t[n++]=String.fromCharCode(55296+(c>>10)),t[n++]=String.fromCharCode(56320+(c&1023))}else{const r=i[e++],a=i[e++];t[n++]=String.fromCharCode((s&15)<<12|(r&63)<<6|a&63)}}return t.join("")},ef={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(i,t){if(!Array.isArray(i))throw Error("encodeByteArray takes an array as a parameter");this.init_();const e=t?this.byteToCharMapWebSafe_:this.byteToCharMap_,n=[];for(let s=0;s<i.length;s+=3){const r=i[s],a=s+1<i.length,l=a?i[s+1]:0,c=s+2<i.length,h=c?i[s+2]:0,d=r>>2,p=(r&3)<<4|l>>4;let m=(l&15)<<2|h>>6,x=h&63;c||(x=64,a||(m=64)),n.push(e[d],e[p],e[m],e[x])}return n.join("")},encodeString(i,t){return this.HAS_NATIVE_SUPPORT&&!t?btoa(i):this.encodeByteArray(tf(i),t)},decodeString(i,t){return this.HAS_NATIVE_SUPPORT&&!t?atob(i):Nd(this.decodeStringToByteArray(i,t))},decodeStringToByteArray(i,t){this.init_();const e=t?this.charToByteMapWebSafe_:this.charToByteMap_,n=[];for(let s=0;s<i.length;){const r=e[i.charAt(s++)],l=s<i.length?e[i.charAt(s)]:0;++s;const h=s<i.length?e[i.charAt(s)]:64;++s;const p=s<i.length?e[i.charAt(s)]:64;if(++s,r==null||l==null||h==null||p==null)throw new Od;const m=r<<2|l>>4;if(n.push(m),h!==64){const x=l<<4&240|h>>2;if(n.push(x),p!==64){const S=h<<6&192|p;n.push(S)}}}return n},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let i=0;i<this.ENCODED_VALS.length;i++)this.byteToCharMap_[i]=this.ENCODED_VALS.charAt(i),this.charToByteMap_[this.byteToCharMap_[i]]=i,this.byteToCharMapWebSafe_[i]=this.ENCODED_VALS_WEBSAFE.charAt(i),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[i]]=i,i>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(i)]=i,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(i)]=i)}}};class Od extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const Fd=function(i){const t=tf(i);return ef.encodeByteArray(t,!0)},nf=function(i){return Fd(i).replace(/\./g,"")},sf=function(i){try{return ef.decodeString(i,!0)}catch(t){console.error("base64Decode failed: ",t)}return null};/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Bd(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const kd=()=>Bd().__FIREBASE_DEFAULTS__,zd=()=>{if(typeof process>"u"||typeof jc>"u")return;const i=jc.__FIREBASE_DEFAULTS__;if(i)return JSON.parse(i)},Vd=()=>{if(typeof document>"u")return;let i;try{i=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const t=i&&sf(i[1]);return t&&JSON.parse(t)},Hd=()=>{try{return Ud()||kd()||zd()||Vd()}catch(i){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${i}`);return}},Gd=i=>{var t;return(t=Hd())===null||t===void 0?void 0:t[`_${i}`]};/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function rf(i){try{return(i.startsWith("http://")||i.startsWith("https://")?new URL(i).hostname:i).endsWith(".cloudworkstations.dev")}catch{return!1}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Bn(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function Wd(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(Bn())}function Xd(){return typeof navigator<"u"&&navigator.userAgent==="Cloudflare-Workers"}function qd(){const i=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof i=="object"&&i.id!==void 0}function jd(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function $d(){try{return typeof indexedDB=="object"}catch{return!1}}function Yd(){return new Promise((i,t)=>{try{let e=!0;const n="validate-browser-context-for-indexeddb-analytics-module",s=self.indexedDB.open(n);s.onsuccess=()=>{s.result.close(),e||self.indexedDB.deleteDatabase(n),i(!0)},s.onupgradeneeded=()=>{e=!1},s.onerror=()=>{var r;t(((r=s.error)===null||r===void 0?void 0:r.message)||"")}}catch(e){t(e)}})}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Kd="FirebaseError";class Ti extends Error{constructor(t,e,n){super(e),this.code=t,this.customData=n,this.name=Kd,Object.setPrototypeOf(this,Ti.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,_r.prototype.create)}}class _r{constructor(t,e,n){this.service=t,this.serviceName=e,this.errors=n}create(t,...e){const n=e[0]||{},s=`${this.service}/${t}`,r=this.errors[t],a=r?Jd(r,n):"Error",l=`${this.serviceName}: ${a} (${s}).`;return new Ti(s,l,n)}}function Jd(i,t){return i.replace(Zd,(e,n)=>{const s=t[n];return s!=null?String(s):`<${n}?>`})}const Zd=/\{\$([^}]+)}/g;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function of(i){const t=[];for(const[e,n]of Object.entries(i))Array.isArray(n)?n.forEach(s=>{t.push(encodeURIComponent(e)+"="+encodeURIComponent(s))}):t.push(encodeURIComponent(e)+"="+encodeURIComponent(n));return t.length?"&"+t.join("&"):""}function Qd(i,t){const e=new tp(i,t);return e.subscribe.bind(e)}class tp{constructor(t,e){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=e,this.task.then(()=>{t(this)}).catch(n=>{this.error(n)})}next(t){this.forEachObserver(e=>{e.next(t)})}error(t){this.forEachObserver(e=>{e.error(t)}),this.close(t)}complete(){this.forEachObserver(t=>{t.complete()}),this.close()}subscribe(t,e,n){let s;if(t===void 0&&e===void 0&&n===void 0)throw new Error("Missing Observer.");ep(t,["next","error","complete"])?s=t:s={next:t,error:e,complete:n},s.next===void 0&&(s.next=oa),s.error===void 0&&(s.error=oa),s.complete===void 0&&(s.complete=oa);const r=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?s.error(this.finalError):s.complete()}catch{}}),this.observers.push(s),r}unsubscribeOne(t){this.observers===void 0||this.observers[t]===void 0||(delete this.observers[t],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(t){if(!this.finalized)for(let e=0;e<this.observers.length;e++)this.sendOne(e,t)}sendOne(t,e){this.task.then(()=>{if(this.observers!==void 0&&this.observers[t]!==void 0)try{e(this.observers[t])}catch(n){typeof console<"u"&&console.error&&console.error(n)}})}close(t){this.finalized||(this.finalized=!0,t!==void 0&&(this.finalError=t),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function ep(i,t){if(typeof i!="object"||i===null)return!1;for(const e of t)if(e in i&&typeof i[e]=="function")return!0;return!1}function oa(){}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Vo(i){return i&&i._delegate?i._delegate:i}class As{constructor(t,e,n){this.name=t,this.instanceFactory=e,this.type=n,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(t){return this.instantiationMode=t,this}setMultipleInstances(t){return this.multipleInstances=t,this}setServiceProps(t){return this.serviceProps=t,this}setInstanceCreatedCallback(t){return this.onInstanceCreated=t,this}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var he;(function(i){i[i.DEBUG=0]="DEBUG",i[i.VERBOSE=1]="VERBOSE",i[i.INFO=2]="INFO",i[i.WARN=3]="WARN",i[i.ERROR=4]="ERROR",i[i.SILENT=5]="SILENT"})(he||(he={}));const np={debug:he.DEBUG,verbose:he.VERBOSE,info:he.INFO,warn:he.WARN,error:he.ERROR,silent:he.SILENT},ip=he.INFO,sp={[he.DEBUG]:"log",[he.VERBOSE]:"log",[he.INFO]:"info",[he.WARN]:"warn",[he.ERROR]:"error"},rp=(i,t,...e)=>{if(t<i.logLevel)return;const n=new Date().toISOString(),s=sp[t];if(s)console[s](`[${n}]  ${i.name}:`,...e);else throw new Error(`Attempted to log a message with an invalid logType (value: ${t})`)};class ql{constructor(t){this.name=t,this._logLevel=ip,this._logHandler=rp,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(t){if(!(t in he))throw new TypeError(`Invalid value "${t}" assigned to \`logLevel\``);this._logLevel=t}setLogLevel(t){this._logLevel=typeof t=="string"?np[t]:t}get logHandler(){return this._logHandler}set logHandler(t){if(typeof t!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=t}get userLogHandler(){return this._userLogHandler}set userLogHandler(t){this._userLogHandler=t}debug(...t){this._userLogHandler&&this._userLogHandler(this,he.DEBUG,...t),this._logHandler(this,he.DEBUG,...t)}log(...t){this._userLogHandler&&this._userLogHandler(this,he.VERBOSE,...t),this._logHandler(this,he.VERBOSE,...t)}info(...t){this._userLogHandler&&this._userLogHandler(this,he.INFO,...t),this._logHandler(this,he.INFO,...t)}warn(...t){this._userLogHandler&&this._userLogHandler(this,he.WARN,...t),this._logHandler(this,he.WARN,...t)}error(...t){this._userLogHandler&&this._userLogHandler(this,he.ERROR,...t),this._logHandler(this,he.ERROR,...t)}}const op=(i,t)=>t.some(e=>i instanceof e);let $c,Yc;function ap(){return $c||($c=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function lp(){return Yc||(Yc=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const af=new WeakMap,Ja=new WeakMap,lf=new WeakMap,aa=new WeakMap,jl=new WeakMap;function cp(i){const t=new Promise((e,n)=>{const s=()=>{i.removeEventListener("success",r),i.removeEventListener("error",a)},r=()=>{e(yi(i.result)),s()},a=()=>{n(i.error),s()};i.addEventListener("success",r),i.addEventListener("error",a)});return t.then(e=>{e instanceof IDBCursor&&af.set(e,i)}).catch(()=>{}),jl.set(t,i),t}function hp(i){if(Ja.has(i))return;const t=new Promise((e,n)=>{const s=()=>{i.removeEventListener("complete",r),i.removeEventListener("error",a),i.removeEventListener("abort",a)},r=()=>{e(),s()},a=()=>{n(i.error||new DOMException("AbortError","AbortError")),s()};i.addEventListener("complete",r),i.addEventListener("error",a),i.addEventListener("abort",a)});Ja.set(i,t)}let Za={get(i,t,e){if(i instanceof IDBTransaction){if(t==="done")return Ja.get(i);if(t==="objectStoreNames")return i.objectStoreNames||lf.get(i);if(t==="store")return e.objectStoreNames[1]?void 0:e.objectStore(e.objectStoreNames[0])}return yi(i[t])},set(i,t,e){return i[t]=e,!0},has(i,t){return i instanceof IDBTransaction&&(t==="done"||t==="store")?!0:t in i}};function up(i){Za=i(Za)}function fp(i){return i===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(t,...e){const n=i.call(la(this),t,...e);return lf.set(n,t.sort?t.sort():[t]),yi(n)}:lp().includes(i)?function(...t){return i.apply(la(this),t),yi(af.get(this))}:function(...t){return yi(i.apply(la(this),t))}}function dp(i){return typeof i=="function"?fp(i):(i instanceof IDBTransaction&&hp(i),op(i,ap())?new Proxy(i,Za):i)}function yi(i){if(i instanceof IDBRequest)return cp(i);if(aa.has(i))return aa.get(i);const t=dp(i);return t!==i&&(aa.set(i,t),jl.set(t,i)),t}const la=i=>jl.get(i);function pp(i,t,{blocked:e,upgrade:n,blocking:s,terminated:r}={}){const a=indexedDB.open(i,t),l=yi(a);return n&&a.addEventListener("upgradeneeded",c=>{n(yi(a.result),c.oldVersion,c.newVersion,yi(a.transaction),c)}),e&&a.addEventListener("blocked",c=>e(c.oldVersion,c.newVersion,c)),l.then(c=>{r&&c.addEventListener("close",()=>r()),s&&c.addEventListener("versionchange",h=>s(h.oldVersion,h.newVersion,h))}).catch(()=>{}),l}const mp=["get","getKey","getAll","getAllKeys","count"],gp=["put","add","delete","clear"],ca=new Map;function Kc(i,t){if(!(i instanceof IDBDatabase&&!(t in i)&&typeof t=="string"))return;if(ca.get(t))return ca.get(t);const e=t.replace(/FromIndex$/,""),n=t!==e,s=gp.includes(e);if(!(e in(n?IDBIndex:IDBObjectStore).prototype)||!(s||mp.includes(e)))return;const r=async function(a,...l){const c=this.transaction(a,s?"readwrite":"readonly");let h=c.store;return n&&(h=h.index(l.shift())),(await Promise.all([h[e](...l),s&&c.done]))[0]};return ca.set(t,r),r}up(i=>({...i,get:(t,e,n)=>Kc(t,e)||i.get(t,e,n),has:(t,e)=>!!Kc(t,e)||i.has(t,e)}));/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _p{constructor(t){this.container=t}getPlatformInfoString(){return this.container.getProviders().map(e=>{if(vp(e)){const n=e.getImmediate();return`${n.library}/${n.version}`}else return null}).filter(e=>e).join(" ")}}function vp(i){const t=i.getComponent();return(t==null?void 0:t.type)==="VERSION"}const Qa="@firebase/app",Jc="0.13.2";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ei=new ql("@firebase/app"),yp="@firebase/app-compat",xp="@firebase/analytics-compat",Mp="@firebase/analytics",Sp="@firebase/app-check-compat",Ep="@firebase/app-check",Tp="@firebase/auth",wp="@firebase/auth-compat",bp="@firebase/database",Ap="@firebase/data-connect",Cp="@firebase/database-compat",Rp="@firebase/functions",Pp="@firebase/functions-compat",Ip="@firebase/installations",Dp="@firebase/installations-compat",Lp="@firebase/messaging",Up="@firebase/messaging-compat",Np="@firebase/performance",Op="@firebase/performance-compat",Fp="@firebase/remote-config",Bp="@firebase/remote-config-compat",kp="@firebase/storage",zp="@firebase/storage-compat",Vp="@firebase/firestore",Hp="@firebase/ai",Gp="@firebase/firestore-compat",Wp="firebase",Xp="11.10.0",qp={[Qa]:"fire-core",[yp]:"fire-core-compat",[Mp]:"fire-analytics",[xp]:"fire-analytics-compat",[Ep]:"fire-app-check",[Sp]:"fire-app-check-compat",[Tp]:"fire-auth",[wp]:"fire-auth-compat",[bp]:"fire-rtdb",[Ap]:"fire-data-connect",[Cp]:"fire-rtdb-compat",[Rp]:"fire-fn",[Pp]:"fire-fn-compat",[Ip]:"fire-iid",[Dp]:"fire-iid-compat",[Lp]:"fire-fcm",[Up]:"fire-fcm-compat",[Np]:"fire-perf",[Op]:"fire-perf-compat",[Fp]:"fire-rc",[Bp]:"fire-rc-compat",[kp]:"fire-gcs",[zp]:"fire-gcs-compat",[Vp]:"fire-fst",[Gp]:"fire-fst-compat",[Hp]:"fire-vertex","fire-js":"fire-js",[Wp]:"fire-js-all"};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const jp=new Map,$p=new Map,Zc=new Map;function Qc(i,t){try{i.container.addComponent(t)}catch(e){ei.debug(`Component ${t.name} failed to register with FirebaseApp ${i.name}`,e)}}function Cs(i){const t=i.name;if(Zc.has(t))return ei.debug(`There were multiple attempts to register component ${t}.`),!1;Zc.set(t,i);for(const e of jp.values())Qc(e,i);for(const e of $p.values())Qc(e,i);return!0}function Oi(i){return i==null?!1:i.settings!==void 0}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Yp={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},$l=new _r("app","Firebase",Yp);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ho=Xp;function xi(i,t,e){var n;let s=(n=qp[i])!==null&&n!==void 0?n:i;e&&(s+=`-${e}`);const r=s.match(/\s|\//),a=t.match(/\s|\//);if(r||a){const l=[`Unable to register library "${s}" with version "${t}":`];r&&l.push(`library name "${s}" contains illegal characters (whitespace or "/")`),r&&a&&l.push("and"),a&&l.push(`version name "${t}" contains illegal characters (whitespace or "/")`),ei.warn(l.join(" "));return}Cs(new As(`${s}-version`,()=>({library:s,version:t}),"VERSION"))}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Kp="firebase-heartbeat-database",Jp=1,pr="firebase-heartbeat-store";let ha=null;function cf(){return ha||(ha=pp(Kp,Jp,{upgrade:(i,t)=>{switch(t){case 0:try{i.createObjectStore(pr)}catch(e){console.warn(e)}}}}).catch(i=>{throw $l.create("idb-open",{originalErrorMessage:i.message})})),ha}async function Zp(i){try{const e=(await cf()).transaction(pr),n=await e.objectStore(pr).get(hf(i));return await e.done,n}catch(t){if(t instanceof Ti)ei.warn(t.message);else{const e=$l.create("idb-get",{originalErrorMessage:t==null?void 0:t.message});ei.warn(e.message)}}}async function th(i,t){try{const n=(await cf()).transaction(pr,"readwrite");await n.objectStore(pr).put(t,hf(i)),await n.done}catch(e){if(e instanceof Ti)ei.warn(e.message);else{const n=$l.create("idb-set",{originalErrorMessage:e==null?void 0:e.message});ei.warn(n.message)}}}function hf(i){return`${i.name}!${i.options.appId}`}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Qp=1024,tm=30;class em{constructor(t){this.container=t,this._heartbeatsCache=null;const e=this.container.getProvider("app").getImmediate();this._storage=new im(e),this._heartbeatsCachePromise=this._storage.read().then(n=>(this._heartbeatsCache=n,n))}async triggerHeartbeat(){var t,e;try{const s=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),r=eh();if(((t=this._heartbeatsCache)===null||t===void 0?void 0:t.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===r||this._heartbeatsCache.heartbeats.some(a=>a.date===r))return;if(this._heartbeatsCache.heartbeats.push({date:r,agent:s}),this._heartbeatsCache.heartbeats.length>tm){const a=sm(this._heartbeatsCache.heartbeats);this._heartbeatsCache.heartbeats.splice(a,1)}return this._storage.overwrite(this._heartbeatsCache)}catch(n){ei.warn(n)}}async getHeartbeatsHeader(){var t;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((t=this._heartbeatsCache)===null||t===void 0?void 0:t.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const e=eh(),{heartbeatsToSend:n,unsentEntries:s}=nm(this._heartbeatsCache.heartbeats),r=nf(JSON.stringify({version:2,heartbeats:n}));return this._heartbeatsCache.lastSentHeartbeatDate=e,s.length>0?(this._heartbeatsCache.heartbeats=s,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),r}catch(e){return ei.warn(e),""}}}function eh(){return new Date().toISOString().substring(0,10)}function nm(i,t=Qp){const e=[];let n=i.slice();for(const s of i){const r=e.find(a=>a.agent===s.agent);if(r){if(r.dates.push(s.date),nh(e)>t){r.dates.pop();break}}else if(e.push({agent:s.agent,dates:[s.date]}),nh(e)>t){e.pop();break}n=n.slice(1)}return{heartbeatsToSend:e,unsentEntries:n}}class im{constructor(t){this.app=t,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return $d()?Yd().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const e=await Zp(this.app);return e!=null&&e.heartbeats?e:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(t){var e;if(await this._canUseIndexedDBPromise){const s=await this.read();return th(this.app,{lastSentHeartbeatDate:(e=t.lastSentHeartbeatDate)!==null&&e!==void 0?e:s.lastSentHeartbeatDate,heartbeats:t.heartbeats})}else return}async add(t){var e;if(await this._canUseIndexedDBPromise){const s=await this.read();return th(this.app,{lastSentHeartbeatDate:(e=t.lastSentHeartbeatDate)!==null&&e!==void 0?e:s.lastSentHeartbeatDate,heartbeats:[...s.heartbeats,...t.heartbeats]})}else return}}function nh(i){return nf(JSON.stringify({version:2,heartbeats:i})).length}function sm(i){if(i.length===0)return-1;let t=0,e=i[0].date;for(let n=1;n<i.length;n++)i[n].date<e&&(e=i[n].date,t=n);return t}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function rm(i){Cs(new As("platform-logger",t=>new _p(t),"PRIVATE")),Cs(new As("heartbeat",t=>new em(t),"PRIVATE")),xi(Qa,Jc,i),xi(Qa,Jc,"esm2017"),xi("fire-js","")}rm("");var om="firebase",am="11.10.0";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */xi(om,am,"app");function uf(i,t){var e={};for(var n in i)Object.prototype.hasOwnProperty.call(i,n)&&t.indexOf(n)<0&&(e[n]=i[n]);if(i!=null&&typeof Object.getOwnPropertySymbols=="function")for(var s=0,n=Object.getOwnPropertySymbols(i);s<n.length;s++)t.indexOf(n[s])<0&&Object.prototype.propertyIsEnumerable.call(i,n[s])&&(e[n[s]]=i[n[s]]);return e}function ff(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}const lm=ff,df=new _r("auth","Firebase",ff());/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ro=new ql("@firebase/auth");function cm(i,...t){Ro.logLevel<=he.WARN&&Ro.warn(`Auth (${Ho}): ${i}`,...t)}function xo(i,...t){Ro.logLevel<=he.ERROR&&Ro.error(`Auth (${Ho}): ${i}`,...t)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ih(i,...t){throw Yl(i,...t)}function pf(i,...t){return Yl(i,...t)}function mf(i,t,e){const n=Object.assign(Object.assign({},lm()),{[t]:e});return new _r("auth","Firebase",n).create(t,{appName:i.name})}function Mo(i){return mf(i,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function Yl(i,...t){if(typeof i!="string"){const e=t[0],n=[...t.slice(1)];return n[0]&&(n[0].appName=i.name),i._errorFactory.create(e,...n)}return df.create(i,...t)}function se(i,t,...e){if(!i)throw Yl(t,...e)}function cr(i){const t="INTERNAL ASSERTION FAILED: "+i;throw xo(t),new Error(t)}function Po(i,t){i||cr(t)}function hm(){return sh()==="http:"||sh()==="https:"}function sh(){var i;return typeof self<"u"&&((i=self.location)===null||i===void 0?void 0:i.protocol)||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function um(){return typeof navigator<"u"&&navigator&&"onLine"in navigator&&typeof navigator.onLine=="boolean"&&(hm()||qd()||"connection"in navigator)?navigator.onLine:!0}function fm(){if(typeof navigator>"u")return null;const i=navigator;return i.languages&&i.languages[0]||i.language||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vr{constructor(t,e){this.shortDelay=t,this.longDelay=e,Po(e>t,"Short delay should be less than long delay!"),this.isMobile=Wd()||jd()}get(){return um()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function dm(i,t){Po(i.emulator,"Emulator should always be set here");const{url:e}=i.emulator;return t?`${e}${t.startsWith("/")?t.slice(1):t}`:e}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gf{static initialize(t,e,n){this.fetchImpl=t,e&&(this.headersImpl=e),n&&(this.responseImpl=n)}static fetch(){if(this.fetchImpl)return this.fetchImpl;if(typeof self<"u"&&"fetch"in self)return self.fetch;if(typeof globalThis<"u"&&globalThis.fetch)return globalThis.fetch;if(typeof fetch<"u")return fetch;cr("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){if(this.headersImpl)return this.headersImpl;if(typeof self<"u"&&"Headers"in self)return self.Headers;if(typeof globalThis<"u"&&globalThis.Headers)return globalThis.Headers;if(typeof Headers<"u")return Headers;cr("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){if(this.responseImpl)return this.responseImpl;if(typeof self<"u"&&"Response"in self)return self.Response;if(typeof globalThis<"u"&&globalThis.Response)return globalThis.Response;if(typeof Response<"u")return Response;cr("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const pm={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const mm=["/v1/accounts:signInWithCustomToken","/v1/accounts:signInWithEmailLink","/v1/accounts:signInWithIdp","/v1/accounts:signInWithPassword","/v1/accounts:signInWithPhoneNumber","/v1/token"],gm=new vr(3e4,6e4);function _f(i,t){return i.tenantId&&!t.tenantId?Object.assign(Object.assign({},t),{tenantId:i.tenantId}):t}async function Go(i,t,e,n,s={}){return vf(i,s,async()=>{let r={},a={};n&&(t==="GET"?a=n:r={body:JSON.stringify(n)});const l=of(Object.assign({key:i.config.apiKey},a)).slice(1),c=await i._getAdditionalHeaders();c["Content-Type"]="application/json",i.languageCode&&(c["X-Firebase-Locale"]=i.languageCode);const h=Object.assign({method:t,headers:c},r);return Xd()||(h.referrerPolicy="no-referrer"),i.emulatorConfig&&rf(i.emulatorConfig.host)&&(h.credentials="include"),gf.fetch()(await yf(i,i.config.apiHost,e,l),h)})}async function vf(i,t,e){i._canInitEmulator=!1;const n=Object.assign(Object.assign({},pm),t);try{const s=new _m(i),r=await Promise.race([e(),s.promise]);s.clearNetworkTimeout();const a=await r.json();if("needConfirmation"in a)throw Br(i,"account-exists-with-different-credential",a);if(r.ok&&!("errorMessage"in a))return a;{const l=r.ok?a.errorMessage:a.error.message,[c,h]=l.split(" : ");if(c==="FEDERATED_USER_ID_ALREADY_LINKED")throw Br(i,"credential-already-in-use",a);if(c==="EMAIL_EXISTS")throw Br(i,"email-already-in-use",a);if(c==="USER_DISABLED")throw Br(i,"user-disabled",a);const d=n[c]||c.toLowerCase().replace(/[_\s]+/g,"-");if(h)throw mf(i,d,h);ih(i,d)}}catch(s){if(s instanceof Ti)throw s;ih(i,"network-request-failed",{message:String(s)})}}async function yf(i,t,e,n){const s=`${t}${e}?${n}`,r=i,a=r.config.emulator?dm(i.config,s):`${i.config.apiScheme}://${s}`;return mm.includes(e)&&(await r._persistenceManagerAvailable,r._getPersistenceType()==="COOKIE")?r._getPersistence()._getFinalTarget(a).toString():a}class _m{clearNetworkTimeout(){clearTimeout(this.timer)}constructor(t){this.auth=t,this.timer=null,this.promise=new Promise((e,n)=>{this.timer=setTimeout(()=>n(pf(this.auth,"network-request-failed")),gm.get())})}}function Br(i,t,e){const n={appName:i.name};e.email&&(n.email=e.email),e.phoneNumber&&(n.phoneNumber=e.phoneNumber);const s=pf(i,t,n);return s.customData._tokenResponse=e,s}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function vm(i,t){return Go(i,"POST","/v1/accounts:delete",t)}async function Io(i,t){return Go(i,"POST","/v1/accounts:lookup",t)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function hr(i){if(i)try{const t=new Date(Number(i));if(!isNaN(t.getTime()))return t.toUTCString()}catch{}}async function ym(i,t=!1){const e=Vo(i),n=await e.getIdToken(t),s=xf(n);se(s&&s.exp&&s.auth_time&&s.iat,e.auth,"internal-error");const r=typeof s.firebase=="object"?s.firebase:void 0,a=r==null?void 0:r.sign_in_provider;return{claims:s,token:n,authTime:hr(ua(s.auth_time)),issuedAtTime:hr(ua(s.iat)),expirationTime:hr(ua(s.exp)),signInProvider:a||null,signInSecondFactor:(r==null?void 0:r.sign_in_second_factor)||null}}function ua(i){return Number(i)*1e3}function xf(i){const[t,e,n]=i.split(".");if(t===void 0||e===void 0||n===void 0)return xo("JWT malformed, contained fewer than 3 sections"),null;try{const s=sf(e);return s?JSON.parse(s):(xo("Failed to decode base64 JWT payload"),null)}catch(s){return xo("Caught error parsing JWT payload as JSON",s==null?void 0:s.toString()),null}}function rh(i){const t=xf(i);return se(t,"internal-error"),se(typeof t.exp<"u","internal-error"),se(typeof t.iat<"u","internal-error"),Number(t.exp)-Number(t.iat)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function tl(i,t,e=!1){if(e)return t;try{return await t}catch(n){throw n instanceof Ti&&xm(n)&&i.auth.currentUser===i&&await i.auth.signOut(),n}}function xm({code:i}){return i==="auth/user-disabled"||i==="auth/user-token-expired"}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Mm{constructor(t){this.user=t,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,this.timerId!==null&&clearTimeout(this.timerId))}getInterval(t){var e;if(t){const n=this.errorBackoff;return this.errorBackoff=Math.min(this.errorBackoff*2,96e4),n}else{this.errorBackoff=3e4;const s=((e=this.user.stsTokenManager.expirationTime)!==null&&e!==void 0?e:0)-Date.now()-3e5;return Math.max(0,s)}}schedule(t=!1){if(!this.isRunning)return;const e=this.getInterval(t);this.timerId=setTimeout(async()=>{await this.iteration()},e)}async iteration(){try{await this.user.getIdToken(!0)}catch(t){(t==null?void 0:t.code)==="auth/network-request-failed"&&this.schedule(!0);return}this.schedule()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class el{constructor(t,e){this.createdAt=t,this.lastLoginAt=e,this._initializeTime()}_initializeTime(){this.lastSignInTime=hr(this.lastLoginAt),this.creationTime=hr(this.createdAt)}_copy(t){this.createdAt=t.createdAt,this.lastLoginAt=t.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Do(i){var t;const e=i.auth,n=await i.getIdToken(),s=await tl(i,Io(e,{idToken:n}));se(s==null?void 0:s.users.length,e,"internal-error");const r=s.users[0];i._notifyReloadListener(r);const a=!((t=r.providerUserInfo)===null||t===void 0)&&t.length?Mf(r.providerUserInfo):[],l=Em(i.providerData,a),c=i.isAnonymous,h=!(i.email&&r.passwordHash)&&!(l!=null&&l.length),d=c?h:!1,p={uid:r.localId,displayName:r.displayName||null,photoURL:r.photoUrl||null,email:r.email||null,emailVerified:r.emailVerified||!1,phoneNumber:r.phoneNumber||null,tenantId:r.tenantId||null,providerData:l,metadata:new el(r.createdAt,r.lastLoginAt),isAnonymous:d};Object.assign(i,p)}async function Sm(i){const t=Vo(i);await Do(t),await t.auth._persistUserIfCurrent(t),t.auth._notifyListenersIfCurrent(t)}function Em(i,t){return[...i.filter(n=>!t.some(s=>s.providerId===n.providerId)),...t]}function Mf(i){return i.map(t=>{var{providerId:e}=t,n=uf(t,["providerId"]);return{providerId:e,uid:n.rawId||"",displayName:n.displayName||null,email:n.email||null,phoneNumber:n.phoneNumber||null,photoURL:n.photoUrl||null}})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Tm(i,t){const e=await vf(i,{},async()=>{const n=of({grant_type:"refresh_token",refresh_token:t}).slice(1),{tokenApiHost:s,apiKey:r}=i.config,a=await yf(i,s,"/v1/token",`key=${r}`),l=await i._getAdditionalHeaders();l["Content-Type"]="application/x-www-form-urlencoded";const c={method:"POST",headers:l,body:n};return i.emulatorConfig&&rf(i.emulatorConfig.host)&&(c.credentials="include"),gf.fetch()(a,c)});return{accessToken:e.access_token,expiresIn:e.expires_in,refreshToken:e.refresh_token}}async function wm(i,t){return Go(i,"POST","/v2/accounts:revokeToken",_f(i,t))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ms{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(t){se(t.idToken,"internal-error"),se(typeof t.idToken<"u","internal-error"),se(typeof t.refreshToken<"u","internal-error");const e="expiresIn"in t&&typeof t.expiresIn<"u"?Number(t.expiresIn):rh(t.idToken);this.updateTokensAndExpiration(t.idToken,t.refreshToken,e)}updateFromIdToken(t){se(t.length!==0,"internal-error");const e=rh(t);this.updateTokensAndExpiration(t,null,e)}async getToken(t,e=!1){return!e&&this.accessToken&&!this.isExpired?this.accessToken:(se(this.refreshToken,t,"user-token-expired"),this.refreshToken?(await this.refresh(t,this.refreshToken),this.accessToken):null)}clearRefreshToken(){this.refreshToken=null}async refresh(t,e){const{accessToken:n,refreshToken:s,expiresIn:r}=await Tm(t,e);this.updateTokensAndExpiration(n,s,Number(r))}updateTokensAndExpiration(t,e,n){this.refreshToken=e||null,this.accessToken=t||null,this.expirationTime=Date.now()+n*1e3}static fromJSON(t,e){const{refreshToken:n,accessToken:s,expirationTime:r}=e,a=new Ms;return n&&(se(typeof n=="string","internal-error",{appName:t}),a.refreshToken=n),s&&(se(typeof s=="string","internal-error",{appName:t}),a.accessToken=s),r&&(se(typeof r=="number","internal-error",{appName:t}),a.expirationTime=r),a}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(t){this.accessToken=t.accessToken,this.refreshToken=t.refreshToken,this.expirationTime=t.expirationTime}_clone(){return Object.assign(new Ms,this.toJSON())}_performRefresh(){return cr("not implemented")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function hi(i,t){se(typeof i=="string"||typeof i>"u","internal-error",{appName:t})}class On{constructor(t){var{uid:e,auth:n,stsTokenManager:s}=t,r=uf(t,["uid","auth","stsTokenManager"]);this.providerId="firebase",this.proactiveRefresh=new Mm(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=e,this.auth=n,this.stsTokenManager=s,this.accessToken=s.accessToken,this.displayName=r.displayName||null,this.email=r.email||null,this.emailVerified=r.emailVerified||!1,this.phoneNumber=r.phoneNumber||null,this.photoURL=r.photoURL||null,this.isAnonymous=r.isAnonymous||!1,this.tenantId=r.tenantId||null,this.providerData=r.providerData?[...r.providerData]:[],this.metadata=new el(r.createdAt||void 0,r.lastLoginAt||void 0)}async getIdToken(t){const e=await tl(this,this.stsTokenManager.getToken(this.auth,t));return se(e,this.auth,"internal-error"),this.accessToken!==e&&(this.accessToken=e,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),e}getIdTokenResult(t){return ym(this,t)}reload(){return Sm(this)}_assign(t){this!==t&&(se(this.uid===t.uid,this.auth,"internal-error"),this.displayName=t.displayName,this.photoURL=t.photoURL,this.email=t.email,this.emailVerified=t.emailVerified,this.phoneNumber=t.phoneNumber,this.isAnonymous=t.isAnonymous,this.tenantId=t.tenantId,this.providerData=t.providerData.map(e=>Object.assign({},e)),this.metadata._copy(t.metadata),this.stsTokenManager._assign(t.stsTokenManager))}_clone(t){const e=new On(Object.assign(Object.assign({},this),{auth:t,stsTokenManager:this.stsTokenManager._clone()}));return e.metadata._copy(this.metadata),e}_onReload(t){se(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=t,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(t){this.reloadListener?this.reloadListener(t):this.reloadUserInfo=t}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(t,e=!1){let n=!1;t.idToken&&t.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(t),n=!0),e&&await Do(this),await this.auth._persistUserIfCurrent(this),n&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(Oi(this.auth.app))return Promise.reject(Mo(this.auth));const t=await this.getIdToken();return await tl(this,vm(this.auth,{idToken:t})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return Object.assign(Object.assign({uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(t=>Object.assign({},t)),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId},this.metadata.toJSON()),{apiKey:this.auth.config.apiKey,appName:this.auth.name})}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(t,e){var n,s,r,a,l,c,h,d;const p=(n=e.displayName)!==null&&n!==void 0?n:void 0,m=(s=e.email)!==null&&s!==void 0?s:void 0,x=(r=e.phoneNumber)!==null&&r!==void 0?r:void 0,S=(a=e.photoURL)!==null&&a!==void 0?a:void 0,w=(l=e.tenantId)!==null&&l!==void 0?l:void 0,v=(c=e._redirectEventId)!==null&&c!==void 0?c:void 0,f=(h=e.createdAt)!==null&&h!==void 0?h:void 0,U=(d=e.lastLoginAt)!==null&&d!==void 0?d:void 0,{uid:L,emailVerified:P,isAnonymous:H,providerData:O,stsTokenManager:E}=e;se(L&&E,t,"internal-error");const M=Ms.fromJSON(this.name,E);se(typeof L=="string",t,"internal-error"),hi(p,t.name),hi(m,t.name),se(typeof P=="boolean",t,"internal-error"),se(typeof H=="boolean",t,"internal-error"),hi(x,t.name),hi(S,t.name),hi(w,t.name),hi(v,t.name),hi(f,t.name),hi(U,t.name);const g=new On({uid:L,auth:t,email:m,emailVerified:P,displayName:p,isAnonymous:H,photoURL:S,phoneNumber:x,tenantId:w,stsTokenManager:M,createdAt:f,lastLoginAt:U});return O&&Array.isArray(O)&&(g.providerData=O.map(_=>Object.assign({},_))),v&&(g._redirectEventId=v),g}static async _fromIdTokenResponse(t,e,n=!1){const s=new Ms;s.updateFromServerResponse(e);const r=new On({uid:e.localId,auth:t,stsTokenManager:s,isAnonymous:n});return await Do(r),r}static async _fromGetAccountInfoResponse(t,e,n){const s=e.users[0];se(s.localId!==void 0,"internal-error");const r=s.providerUserInfo!==void 0?Mf(s.providerUserInfo):[],a=!(s.email&&s.passwordHash)&&!(r!=null&&r.length),l=new Ms;l.updateFromIdToken(n);const c=new On({uid:s.localId,auth:t,stsTokenManager:l,isAnonymous:a}),h={uid:s.localId,displayName:s.displayName||null,photoURL:s.photoUrl||null,email:s.email||null,emailVerified:s.emailVerified||!1,phoneNumber:s.phoneNumber||null,tenantId:s.tenantId||null,providerData:r,metadata:new el(s.createdAt,s.lastLoginAt),isAnonymous:!(s.email&&s.passwordHash)&&!(r!=null&&r.length)};return Object.assign(c,h),c}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const oh=new Map;function zi(i){Po(i instanceof Function,"Expected a class definition");let t=oh.get(i);return t?(Po(t instanceof i,"Instance stored in cache mismatched with class"),t):(t=new i,oh.set(i,t),t)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Sf{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(t,e){this.storage[t]=e}async _get(t){const e=this.storage[t];return e===void 0?null:e}async _remove(t){delete this.storage[t]}_addListener(t,e){}_removeListener(t,e){}}Sf.type="NONE";const ah=Sf;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function fa(i,t,e){return`firebase:${i}:${t}:${e}`}class Ss{constructor(t,e,n){this.persistence=t,this.auth=e,this.userKey=n;const{config:s,name:r}=this.auth;this.fullUserKey=fa(this.userKey,s.apiKey,r),this.fullPersistenceKey=fa("persistence",s.apiKey,r),this.boundEventHandler=e._onStorageEvent.bind(e),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(t){return this.persistence._set(this.fullUserKey,t.toJSON())}async getCurrentUser(){const t=await this.persistence._get(this.fullUserKey);if(!t)return null;if(typeof t=="string"){const e=await Io(this.auth,{idToken:t}).catch(()=>{});return e?On._fromGetAccountInfoResponse(this.auth,e,t):null}return On._fromJSON(this.auth,t)}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(t){if(this.persistence===t)return;const e=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=t,e)return this.setCurrentUser(e)}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(t,e,n="authUser"){if(!e.length)return new Ss(zi(ah),t,n);const s=(await Promise.all(e.map(async h=>{if(await h._isAvailable())return h}))).filter(h=>h);let r=s[0]||zi(ah);const a=fa(n,t.config.apiKey,t.name);let l=null;for(const h of e)try{const d=await h._get(a);if(d){let p;if(typeof d=="string"){const m=await Io(t,{idToken:d}).catch(()=>{});if(!m)break;p=await On._fromGetAccountInfoResponse(t,m,d)}else p=On._fromJSON(t,d);h!==r&&(l=p),r=h;break}}catch{}const c=s.filter(h=>h._shouldAllowMigration);return!r._shouldAllowMigration||!c.length?new Ss(r,t,n):(r=c[0],l&&await r._set(a,l.toJSON()),await Promise.all(e.map(async h=>{if(h!==r)try{await h._remove(a)}catch{}})),new Ss(r,t,n))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function lh(i){const t=i.toLowerCase();if(t.includes("opera/")||t.includes("opr/")||t.includes("opios/"))return"Opera";if(Rm(t))return"IEMobile";if(t.includes("msie")||t.includes("trident/"))return"IE";if(t.includes("edge/"))return"Edge";if(bm(t))return"Firefox";if(t.includes("silk/"))return"Silk";if(Im(t))return"Blackberry";if(Dm(t))return"Webos";if(Am(t))return"Safari";if((t.includes("chrome/")||Cm(t))&&!t.includes("edge/"))return"Chrome";if(Pm(t))return"Android";{const e=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,n=i.match(e);if((n==null?void 0:n.length)===2)return n[1]}return"Other"}function bm(i=Bn()){return/firefox\//i.test(i)}function Am(i=Bn()){const t=i.toLowerCase();return t.includes("safari/")&&!t.includes("chrome/")&&!t.includes("crios/")&&!t.includes("android")}function Cm(i=Bn()){return/crios\//i.test(i)}function Rm(i=Bn()){return/iemobile/i.test(i)}function Pm(i=Bn()){return/android/i.test(i)}function Im(i=Bn()){return/blackberry/i.test(i)}function Dm(i=Bn()){return/webos/i.test(i)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ef(i,t=[]){let e;switch(i){case"Browser":e=lh(Bn());break;case"Worker":e=`${lh(Bn())}-${i}`;break;default:e=i}const n=t.length?t.join(","):"FirebaseCore-web";return`${e}/JsCore/${Ho}/${n}`}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Lm{constructor(t){this.auth=t,this.queue=[]}pushCallback(t,e){const n=r=>new Promise((a,l)=>{try{const c=t(r);a(c)}catch(c){l(c)}});n.onAbort=e,this.queue.push(n);const s=this.queue.length-1;return()=>{this.queue[s]=()=>Promise.resolve()}}async runMiddleware(t){if(this.auth.currentUser===t)return;const e=[];try{for(const n of this.queue)await n(t),n.onAbort&&e.push(n.onAbort)}catch(n){e.reverse();for(const s of e)try{s()}catch{}throw this.auth._errorFactory.create("login-blocked",{originalMessage:n==null?void 0:n.message})}}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Um(i,t={}){return Go(i,"GET","/v2/passwordPolicy",_f(i,t))}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Nm=6;class Om{constructor(t){var e,n,s,r;const a=t.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=(e=a.minPasswordLength)!==null&&e!==void 0?e:Nm,a.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=a.maxPasswordLength),a.containsLowercaseCharacter!==void 0&&(this.customStrengthOptions.containsLowercaseLetter=a.containsLowercaseCharacter),a.containsUppercaseCharacter!==void 0&&(this.customStrengthOptions.containsUppercaseLetter=a.containsUppercaseCharacter),a.containsNumericCharacter!==void 0&&(this.customStrengthOptions.containsNumericCharacter=a.containsNumericCharacter),a.containsNonAlphanumericCharacter!==void 0&&(this.customStrengthOptions.containsNonAlphanumericCharacter=a.containsNonAlphanumericCharacter),this.enforcementState=t.enforcementState,this.enforcementState==="ENFORCEMENT_STATE_UNSPECIFIED"&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=(s=(n=t.allowedNonAlphanumericCharacters)===null||n===void 0?void 0:n.join(""))!==null&&s!==void 0?s:"",this.forceUpgradeOnSignin=(r=t.forceUpgradeOnSignin)!==null&&r!==void 0?r:!1,this.schemaVersion=t.schemaVersion}validatePassword(t){var e,n,s,r,a,l;const c={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(t,c),this.validatePasswordCharacterOptions(t,c),c.isValid&&(c.isValid=(e=c.meetsMinPasswordLength)!==null&&e!==void 0?e:!0),c.isValid&&(c.isValid=(n=c.meetsMaxPasswordLength)!==null&&n!==void 0?n:!0),c.isValid&&(c.isValid=(s=c.containsLowercaseLetter)!==null&&s!==void 0?s:!0),c.isValid&&(c.isValid=(r=c.containsUppercaseLetter)!==null&&r!==void 0?r:!0),c.isValid&&(c.isValid=(a=c.containsNumericCharacter)!==null&&a!==void 0?a:!0),c.isValid&&(c.isValid=(l=c.containsNonAlphanumericCharacter)!==null&&l!==void 0?l:!0),c}validatePasswordLengthOptions(t,e){const n=this.customStrengthOptions.minPasswordLength,s=this.customStrengthOptions.maxPasswordLength;n&&(e.meetsMinPasswordLength=t.length>=n),s&&(e.meetsMaxPasswordLength=t.length<=s)}validatePasswordCharacterOptions(t,e){this.updatePasswordCharacterOptionsStatuses(e,!1,!1,!1,!1);let n;for(let s=0;s<t.length;s++)n=t.charAt(s),this.updatePasswordCharacterOptionsStatuses(e,n>="a"&&n<="z",n>="A"&&n<="Z",n>="0"&&n<="9",this.allowedNonAlphanumericCharacters.includes(n))}updatePasswordCharacterOptionsStatuses(t,e,n,s,r){this.customStrengthOptions.containsLowercaseLetter&&(t.containsLowercaseLetter||(t.containsLowercaseLetter=e)),this.customStrengthOptions.containsUppercaseLetter&&(t.containsUppercaseLetter||(t.containsUppercaseLetter=n)),this.customStrengthOptions.containsNumericCharacter&&(t.containsNumericCharacter||(t.containsNumericCharacter=s)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(t.containsNonAlphanumericCharacter||(t.containsNonAlphanumericCharacter=r))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fm{constructor(t,e,n,s){this.app=t,this.heartbeatServiceProvider=e,this.appCheckServiceProvider=n,this.config=s,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new ch(this),this.idTokenSubscription=new ch(this),this.beforeStateQueue=new Lm(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=df,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this._resolvePersistenceManagerAvailable=void 0,this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=t.name,this.clientVersion=s.sdkClientVersion,this._persistenceManagerAvailable=new Promise(r=>this._resolvePersistenceManagerAvailable=r)}_initializeWithPersistence(t,e){return e&&(this._popupRedirectResolver=zi(e)),this._initializationPromise=this.queue(async()=>{var n,s,r;if(!this._deleted&&(this.persistenceManager=await Ss.create(this,t),(n=this._resolvePersistenceManagerAvailable)===null||n===void 0||n.call(this),!this._deleted)){if(!((s=this._popupRedirectResolver)===null||s===void 0)&&s._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch{}await this.initializeCurrentUser(e),this.lastNotifiedUid=((r=this.currentUser)===null||r===void 0?void 0:r.uid)||null,!this._deleted&&(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;const t=await this.assertedPersistence.getCurrentUser();if(!(!this.currentUser&&!t)){if(this.currentUser&&t&&this.currentUser.uid===t.uid){this._currentUser._assign(t),await this.currentUser.getIdToken();return}await this._updateCurrentUser(t,!0)}}async initializeCurrentUserFromIdToken(t){try{const e=await Io(this,{idToken:t}),n=await On._fromGetAccountInfoResponse(this,e,t);await this.directlySetCurrentUser(n)}catch(e){console.warn("FirebaseServerApp could not login user with provided authIdToken: ",e),await this.directlySetCurrentUser(null)}}async initializeCurrentUser(t){var e;if(Oi(this.app)){const a=this.app.settings.authIdToken;return a?new Promise(l=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(a).then(l,l))}):this.directlySetCurrentUser(null)}const n=await this.assertedPersistence.getCurrentUser();let s=n,r=!1;if(t&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();const a=(e=this.redirectUser)===null||e===void 0?void 0:e._redirectEventId,l=s==null?void 0:s._redirectEventId,c=await this.tryRedirectSignIn(t);(!a||a===l)&&(c!=null&&c.user)&&(s=c.user,r=!0)}if(!s)return this.directlySetCurrentUser(null);if(!s._redirectEventId){if(r)try{await this.beforeStateQueue.runMiddleware(s)}catch(a){s=n,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(a))}return s?this.reloadAndSetCurrentUserOrClear(s):this.directlySetCurrentUser(null)}return se(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===s._redirectEventId?this.directlySetCurrentUser(s):this.reloadAndSetCurrentUserOrClear(s)}async tryRedirectSignIn(t){let e=null;try{e=await this._popupRedirectResolver._completeRedirectFn(this,t,!0)}catch{await this._setRedirectUser(null)}return e}async reloadAndSetCurrentUserOrClear(t){try{await Do(t)}catch(e){if((e==null?void 0:e.code)!=="auth/network-request-failed")return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(t)}useDeviceLanguage(){this.languageCode=fm()}async _delete(){this._deleted=!0}async updateCurrentUser(t){if(Oi(this.app))return Promise.reject(Mo(this));const e=t?Vo(t):null;return e&&se(e.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(e&&e._clone(this))}async _updateCurrentUser(t,e=!1){if(!this._deleted)return t&&se(this.tenantId===t.tenantId,this,"tenant-id-mismatch"),e||await this.beforeStateQueue.runMiddleware(t),this.queue(async()=>{await this.directlySetCurrentUser(t),this.notifyAuthListeners()})}async signOut(){return Oi(this.app)?Promise.reject(Mo(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(t){return Oi(this.app)?Promise.reject(Mo(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(zi(t))})}_getRecaptchaConfig(){return this.tenantId==null?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(t){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();const e=this._getPasswordPolicyInternal();return e.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):e.validatePassword(t)}_getPasswordPolicyInternal(){return this.tenantId===null?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){const t=await Um(this),e=new Om(t);this.tenantId===null?this._projectPasswordPolicy=e:this._tenantPasswordPolicies[this.tenantId]=e}_getPersistenceType(){return this.assertedPersistence.persistence.type}_getPersistence(){return this.assertedPersistence.persistence}_updateErrorMap(t){this._errorFactory=new _r("auth","Firebase",t())}onAuthStateChanged(t,e,n){return this.registerStateListener(this.authStateSubscription,t,e,n)}beforeAuthStateChanged(t,e){return this.beforeStateQueue.pushCallback(t,e)}onIdTokenChanged(t,e,n){return this.registerStateListener(this.idTokenSubscription,t,e,n)}authStateReady(){return new Promise((t,e)=>{if(this.currentUser)t();else{const n=this.onAuthStateChanged(()=>{n(),t()},e)}})}async revokeAccessToken(t){if(this.currentUser){const e=await this.currentUser.getIdToken(),n={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:t,idToken:e};this.tenantId!=null&&(n.tenantId=this.tenantId),await wm(this,n)}}toJSON(){var t;return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:(t=this._currentUser)===null||t===void 0?void 0:t.toJSON()}}async _setRedirectUser(t,e){const n=await this.getOrInitRedirectPersistenceManager(e);return t===null?n.removeCurrentUser():n.setCurrentUser(t)}async getOrInitRedirectPersistenceManager(t){if(!this.redirectPersistenceManager){const e=t&&zi(t)||this._popupRedirectResolver;se(e,this,"argument-error"),this.redirectPersistenceManager=await Ss.create(this,[zi(e._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(t){var e,n;return this._isInitialized&&await this.queue(async()=>{}),((e=this._currentUser)===null||e===void 0?void 0:e._redirectEventId)===t?this._currentUser:((n=this.redirectUser)===null||n===void 0?void 0:n._redirectEventId)===t?this.redirectUser:null}async _persistUserIfCurrent(t){if(t===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(t))}_notifyListenersIfCurrent(t){t===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){var t,e;if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);const n=(e=(t=this.currentUser)===null||t===void 0?void 0:t.uid)!==null&&e!==void 0?e:null;this.lastNotifiedUid!==n&&(this.lastNotifiedUid=n,this.authStateSubscription.next(this.currentUser))}registerStateListener(t,e,n,s){if(this._deleted)return()=>{};const r=typeof e=="function"?e:e.next.bind(e);let a=!1;const l=this._isInitialized?Promise.resolve():this._initializationPromise;if(se(l,this,"internal-error"),l.then(()=>{a||r(this.currentUser)}),typeof e=="function"){const c=t.addObserver(e,n,s);return()=>{a=!0,c()}}else{const c=t.addObserver(e);return()=>{a=!0,c()}}}async directlySetCurrentUser(t){this.currentUser&&this.currentUser!==t&&this._currentUser._stopProactiveRefresh(),t&&this.isProactiveRefreshEnabled&&t._startProactiveRefresh(),this.currentUser=t,t?await this.assertedPersistence.setCurrentUser(t):await this.assertedPersistence.removeCurrentUser()}queue(t){return this.operations=this.operations.then(t,t),this.operations}get assertedPersistence(){return se(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(t){!t||this.frameworks.includes(t)||(this.frameworks.push(t),this.frameworks.sort(),this.clientVersion=Ef(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){var t;const e={"X-Client-Version":this.clientVersion};this.app.options.appId&&(e["X-Firebase-gmpid"]=this.app.options.appId);const n=await((t=this.heartbeatServiceProvider.getImmediate({optional:!0}))===null||t===void 0?void 0:t.getHeartbeatsHeader());n&&(e["X-Firebase-Client"]=n);const s=await this._getAppCheckToken();return s&&(e["X-Firebase-AppCheck"]=s),e}async _getAppCheckToken(){var t;if(Oi(this.app)&&this.app.settings.appCheckToken)return this.app.settings.appCheckToken;const e=await((t=this.appCheckServiceProvider.getImmediate({optional:!0}))===null||t===void 0?void 0:t.getToken());return e!=null&&e.error&&cm(`Error while retrieving App Check token: ${e.error}`),e==null?void 0:e.token}}function Bm(i){return Vo(i)}class ch{constructor(t){this.auth=t,this.observer=null,this.addObserver=Qd(e=>this.observer=e)}get next(){return se(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}function km(i,t){const e=(t==null?void 0:t.persistence)||[],n=(Array.isArray(e)?e:[e]).map(zi);t!=null&&t.errorMap&&i._updateErrorMap(t.errorMap),i._initializeWithPersistence(n,t==null?void 0:t.popupRedirectResolver)}new vr(3e4,6e4);/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */new vr(2e3,1e4);/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */new vr(3e4,6e4);/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */new vr(5e3,15e3);var hh="@firebase/auth",uh="1.10.8";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zm{constructor(t){this.auth=t,this.internalListeners=new Map}getUid(){var t;return this.assertAuthConfigured(),((t=this.auth.currentUser)===null||t===void 0?void 0:t.uid)||null}async getToken(t){return this.assertAuthConfigured(),await this.auth._initializationPromise,this.auth.currentUser?{accessToken:await this.auth.currentUser.getIdToken(t)}:null}addAuthTokenListener(t){if(this.assertAuthConfigured(),this.internalListeners.has(t))return;const e=this.auth.onIdTokenChanged(n=>{t((n==null?void 0:n.stsTokenManager.accessToken)||null)});this.internalListeners.set(t,e),this.updateProactiveRefresh()}removeAuthTokenListener(t){this.assertAuthConfigured();const e=this.internalListeners.get(t);e&&(this.internalListeners.delete(t),e(),this.updateProactiveRefresh())}assertAuthConfigured(){se(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Vm(i){switch(i){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}function Hm(i){Cs(new As("auth",(t,{options:e})=>{const n=t.getProvider("app").getImmediate(),s=t.getProvider("heartbeat"),r=t.getProvider("app-check-internal"),{apiKey:a,authDomain:l}=n.options;se(a&&!a.includes(":"),"invalid-api-key",{appName:n.name});const c={apiKey:a,authDomain:l,clientPlatform:i,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:Ef(i)},h=new Fm(n,s,r,c);return km(h,e),h},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((t,e,n)=>{t.getProvider("auth-internal").initialize()})),Cs(new As("auth-internal",t=>{const e=Bm(t.getProvider("auth").getImmediate());return(n=>new zm(n))(e)},"PRIVATE").setInstantiationMode("EXPLICIT")),xi(hh,uh,Vm(i)),xi(hh,uh,"esm2017")}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Gm=300;Gd("authIdTokenMaxAge");Hm("Browser");var fh=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var Kl;(function(){var i;/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/function t(E,M){function g(){}g.prototype=M.prototype,E.D=M.prototype,E.prototype=new g,E.prototype.constructor=E,E.C=function(_,T,I){for(var b=Array(arguments.length-2),K=2;K<arguments.length;K++)b[K-2]=arguments[K];return M.prototype[T].apply(_,b)}}function e(){this.blockSize=-1}function n(){this.blockSize=-1,this.blockSize=64,this.g=Array(4),this.B=Array(this.blockSize),this.o=this.h=0,this.s()}t(n,e),n.prototype.s=function(){this.g[0]=1732584193,this.g[1]=4023233417,this.g[2]=2562383102,this.g[3]=271733878,this.o=this.h=0};function s(E,M,g){g||(g=0);var _=Array(16);if(typeof M=="string")for(var T=0;16>T;++T)_[T]=M.charCodeAt(g++)|M.charCodeAt(g++)<<8|M.charCodeAt(g++)<<16|M.charCodeAt(g++)<<24;else for(T=0;16>T;++T)_[T]=M[g++]|M[g++]<<8|M[g++]<<16|M[g++]<<24;M=E.g[0],g=E.g[1],T=E.g[2];var I=E.g[3],b=M+(I^g&(T^I))+_[0]+3614090360&4294967295;M=g+(b<<7&4294967295|b>>>25),b=I+(T^M&(g^T))+_[1]+3905402710&4294967295,I=M+(b<<12&4294967295|b>>>20),b=T+(g^I&(M^g))+_[2]+606105819&4294967295,T=I+(b<<17&4294967295|b>>>15),b=g+(M^T&(I^M))+_[3]+3250441966&4294967295,g=T+(b<<22&4294967295|b>>>10),b=M+(I^g&(T^I))+_[4]+4118548399&4294967295,M=g+(b<<7&4294967295|b>>>25),b=I+(T^M&(g^T))+_[5]+1200080426&4294967295,I=M+(b<<12&4294967295|b>>>20),b=T+(g^I&(M^g))+_[6]+2821735955&4294967295,T=I+(b<<17&4294967295|b>>>15),b=g+(M^T&(I^M))+_[7]+4249261313&4294967295,g=T+(b<<22&4294967295|b>>>10),b=M+(I^g&(T^I))+_[8]+1770035416&4294967295,M=g+(b<<7&4294967295|b>>>25),b=I+(T^M&(g^T))+_[9]+2336552879&4294967295,I=M+(b<<12&4294967295|b>>>20),b=T+(g^I&(M^g))+_[10]+4294925233&4294967295,T=I+(b<<17&4294967295|b>>>15),b=g+(M^T&(I^M))+_[11]+2304563134&4294967295,g=T+(b<<22&4294967295|b>>>10),b=M+(I^g&(T^I))+_[12]+1804603682&4294967295,M=g+(b<<7&4294967295|b>>>25),b=I+(T^M&(g^T))+_[13]+4254626195&4294967295,I=M+(b<<12&4294967295|b>>>20),b=T+(g^I&(M^g))+_[14]+2792965006&4294967295,T=I+(b<<17&4294967295|b>>>15),b=g+(M^T&(I^M))+_[15]+1236535329&4294967295,g=T+(b<<22&4294967295|b>>>10),b=M+(T^I&(g^T))+_[1]+4129170786&4294967295,M=g+(b<<5&4294967295|b>>>27),b=I+(g^T&(M^g))+_[6]+3225465664&4294967295,I=M+(b<<9&4294967295|b>>>23),b=T+(M^g&(I^M))+_[11]+643717713&4294967295,T=I+(b<<14&4294967295|b>>>18),b=g+(I^M&(T^I))+_[0]+3921069994&4294967295,g=T+(b<<20&4294967295|b>>>12),b=M+(T^I&(g^T))+_[5]+3593408605&4294967295,M=g+(b<<5&4294967295|b>>>27),b=I+(g^T&(M^g))+_[10]+38016083&4294967295,I=M+(b<<9&4294967295|b>>>23),b=T+(M^g&(I^M))+_[15]+3634488961&4294967295,T=I+(b<<14&4294967295|b>>>18),b=g+(I^M&(T^I))+_[4]+3889429448&4294967295,g=T+(b<<20&4294967295|b>>>12),b=M+(T^I&(g^T))+_[9]+568446438&4294967295,M=g+(b<<5&4294967295|b>>>27),b=I+(g^T&(M^g))+_[14]+3275163606&4294967295,I=M+(b<<9&4294967295|b>>>23),b=T+(M^g&(I^M))+_[3]+4107603335&4294967295,T=I+(b<<14&4294967295|b>>>18),b=g+(I^M&(T^I))+_[8]+1163531501&4294967295,g=T+(b<<20&4294967295|b>>>12),b=M+(T^I&(g^T))+_[13]+2850285829&4294967295,M=g+(b<<5&4294967295|b>>>27),b=I+(g^T&(M^g))+_[2]+4243563512&4294967295,I=M+(b<<9&4294967295|b>>>23),b=T+(M^g&(I^M))+_[7]+1735328473&4294967295,T=I+(b<<14&4294967295|b>>>18),b=g+(I^M&(T^I))+_[12]+2368359562&4294967295,g=T+(b<<20&4294967295|b>>>12),b=M+(g^T^I)+_[5]+4294588738&4294967295,M=g+(b<<4&4294967295|b>>>28),b=I+(M^g^T)+_[8]+2272392833&4294967295,I=M+(b<<11&4294967295|b>>>21),b=T+(I^M^g)+_[11]+1839030562&4294967295,T=I+(b<<16&4294967295|b>>>16),b=g+(T^I^M)+_[14]+4259657740&4294967295,g=T+(b<<23&4294967295|b>>>9),b=M+(g^T^I)+_[1]+2763975236&4294967295,M=g+(b<<4&4294967295|b>>>28),b=I+(M^g^T)+_[4]+1272893353&4294967295,I=M+(b<<11&4294967295|b>>>21),b=T+(I^M^g)+_[7]+4139469664&4294967295,T=I+(b<<16&4294967295|b>>>16),b=g+(T^I^M)+_[10]+3200236656&4294967295,g=T+(b<<23&4294967295|b>>>9),b=M+(g^T^I)+_[13]+681279174&4294967295,M=g+(b<<4&4294967295|b>>>28),b=I+(M^g^T)+_[0]+3936430074&4294967295,I=M+(b<<11&4294967295|b>>>21),b=T+(I^M^g)+_[3]+3572445317&4294967295,T=I+(b<<16&4294967295|b>>>16),b=g+(T^I^M)+_[6]+76029189&4294967295,g=T+(b<<23&4294967295|b>>>9),b=M+(g^T^I)+_[9]+3654602809&4294967295,M=g+(b<<4&4294967295|b>>>28),b=I+(M^g^T)+_[12]+3873151461&4294967295,I=M+(b<<11&4294967295|b>>>21),b=T+(I^M^g)+_[15]+530742520&4294967295,T=I+(b<<16&4294967295|b>>>16),b=g+(T^I^M)+_[2]+3299628645&4294967295,g=T+(b<<23&4294967295|b>>>9),b=M+(T^(g|~I))+_[0]+4096336452&4294967295,M=g+(b<<6&4294967295|b>>>26),b=I+(g^(M|~T))+_[7]+1126891415&4294967295,I=M+(b<<10&4294967295|b>>>22),b=T+(M^(I|~g))+_[14]+2878612391&4294967295,T=I+(b<<15&4294967295|b>>>17),b=g+(I^(T|~M))+_[5]+4237533241&4294967295,g=T+(b<<21&4294967295|b>>>11),b=M+(T^(g|~I))+_[12]+1700485571&4294967295,M=g+(b<<6&4294967295|b>>>26),b=I+(g^(M|~T))+_[3]+2399980690&4294967295,I=M+(b<<10&4294967295|b>>>22),b=T+(M^(I|~g))+_[10]+4293915773&4294967295,T=I+(b<<15&4294967295|b>>>17),b=g+(I^(T|~M))+_[1]+2240044497&4294967295,g=T+(b<<21&4294967295|b>>>11),b=M+(T^(g|~I))+_[8]+1873313359&4294967295,M=g+(b<<6&4294967295|b>>>26),b=I+(g^(M|~T))+_[15]+4264355552&4294967295,I=M+(b<<10&4294967295|b>>>22),b=T+(M^(I|~g))+_[6]+2734768916&4294967295,T=I+(b<<15&4294967295|b>>>17),b=g+(I^(T|~M))+_[13]+1309151649&4294967295,g=T+(b<<21&4294967295|b>>>11),b=M+(T^(g|~I))+_[4]+4149444226&4294967295,M=g+(b<<6&4294967295|b>>>26),b=I+(g^(M|~T))+_[11]+3174756917&4294967295,I=M+(b<<10&4294967295|b>>>22),b=T+(M^(I|~g))+_[2]+718787259&4294967295,T=I+(b<<15&4294967295|b>>>17),b=g+(I^(T|~M))+_[9]+3951481745&4294967295,E.g[0]=E.g[0]+M&4294967295,E.g[1]=E.g[1]+(T+(b<<21&4294967295|b>>>11))&4294967295,E.g[2]=E.g[2]+T&4294967295,E.g[3]=E.g[3]+I&4294967295}n.prototype.u=function(E,M){M===void 0&&(M=E.length);for(var g=M-this.blockSize,_=this.B,T=this.h,I=0;I<M;){if(T==0)for(;I<=g;)s(this,E,I),I+=this.blockSize;if(typeof E=="string"){for(;I<M;)if(_[T++]=E.charCodeAt(I++),T==this.blockSize){s(this,_),T=0;break}}else for(;I<M;)if(_[T++]=E[I++],T==this.blockSize){s(this,_),T=0;break}}this.h=T,this.o+=M},n.prototype.v=function(){var E=Array((56>this.h?this.blockSize:2*this.blockSize)-this.h);E[0]=128;for(var M=1;M<E.length-8;++M)E[M]=0;var g=8*this.o;for(M=E.length-8;M<E.length;++M)E[M]=g&255,g/=256;for(this.u(E),E=Array(16),M=g=0;4>M;++M)for(var _=0;32>_;_+=8)E[g++]=this.g[M]>>>_&255;return E};function r(E,M){var g=l;return Object.prototype.hasOwnProperty.call(g,E)?g[E]:g[E]=M(E)}function a(E,M){this.h=M;for(var g=[],_=!0,T=E.length-1;0<=T;T--){var I=E[T]|0;_&&I==M||(g[T]=I,_=!1)}this.g=g}var l={};function c(E){return-128<=E&&128>E?r(E,function(M){return new a([M|0],0>M?-1:0)}):new a([E|0],0>E?-1:0)}function h(E){if(isNaN(E)||!isFinite(E))return p;if(0>E)return v(h(-E));for(var M=[],g=1,_=0;E>=g;_++)M[_]=E/g|0,g*=4294967296;return new a(M,0)}function d(E,M){if(E.length==0)throw Error("number format error: empty string");if(M=M||10,2>M||36<M)throw Error("radix out of range: "+M);if(E.charAt(0)=="-")return v(d(E.substring(1),M));if(0<=E.indexOf("-"))throw Error('number format error: interior "-" character');for(var g=h(Math.pow(M,8)),_=p,T=0;T<E.length;T+=8){var I=Math.min(8,E.length-T),b=parseInt(E.substring(T,T+I),M);8>I?(I=h(Math.pow(M,I)),_=_.j(I).add(h(b))):(_=_.j(g),_=_.add(h(b)))}return _}var p=c(0),m=c(1),x=c(16777216);i=a.prototype,i.m=function(){if(w(this))return-v(this).m();for(var E=0,M=1,g=0;g<this.g.length;g++){var _=this.i(g);E+=(0<=_?_:4294967296+_)*M,M*=4294967296}return E},i.toString=function(E){if(E=E||10,2>E||36<E)throw Error("radix out of range: "+E);if(S(this))return"0";if(w(this))return"-"+v(this).toString(E);for(var M=h(Math.pow(E,6)),g=this,_="";;){var T=P(g,M).g;g=f(g,T.j(M));var I=((0<g.g.length?g.g[0]:g.h)>>>0).toString(E);if(g=T,S(g))return I+_;for(;6>I.length;)I="0"+I;_=I+_}},i.i=function(E){return 0>E?0:E<this.g.length?this.g[E]:this.h};function S(E){if(E.h!=0)return!1;for(var M=0;M<E.g.length;M++)if(E.g[M]!=0)return!1;return!0}function w(E){return E.h==-1}i.l=function(E){return E=f(this,E),w(E)?-1:S(E)?0:1};function v(E){for(var M=E.g.length,g=[],_=0;_<M;_++)g[_]=~E.g[_];return new a(g,~E.h).add(m)}i.abs=function(){return w(this)?v(this):this},i.add=function(E){for(var M=Math.max(this.g.length,E.g.length),g=[],_=0,T=0;T<=M;T++){var I=_+(this.i(T)&65535)+(E.i(T)&65535),b=(I>>>16)+(this.i(T)>>>16)+(E.i(T)>>>16);_=b>>>16,I&=65535,b&=65535,g[T]=b<<16|I}return new a(g,g[g.length-1]&-2147483648?-1:0)};function f(E,M){return E.add(v(M))}i.j=function(E){if(S(this)||S(E))return p;if(w(this))return w(E)?v(this).j(v(E)):v(v(this).j(E));if(w(E))return v(this.j(v(E)));if(0>this.l(x)&&0>E.l(x))return h(this.m()*E.m());for(var M=this.g.length+E.g.length,g=[],_=0;_<2*M;_++)g[_]=0;for(_=0;_<this.g.length;_++)for(var T=0;T<E.g.length;T++){var I=this.i(_)>>>16,b=this.i(_)&65535,K=E.i(T)>>>16,Q=E.i(T)&65535;g[2*_+2*T]+=b*Q,U(g,2*_+2*T),g[2*_+2*T+1]+=I*Q,U(g,2*_+2*T+1),g[2*_+2*T+1]+=b*K,U(g,2*_+2*T+1),g[2*_+2*T+2]+=I*K,U(g,2*_+2*T+2)}for(_=0;_<M;_++)g[_]=g[2*_+1]<<16|g[2*_];for(_=M;_<2*M;_++)g[_]=0;return new a(g,0)};function U(E,M){for(;(E[M]&65535)!=E[M];)E[M+1]+=E[M]>>>16,E[M]&=65535,M++}function L(E,M){this.g=E,this.h=M}function P(E,M){if(S(M))throw Error("division by zero");if(S(E))return new L(p,p);if(w(E))return M=P(v(E),M),new L(v(M.g),v(M.h));if(w(M))return M=P(E,v(M)),new L(v(M.g),M.h);if(30<E.g.length){if(w(E)||w(M))throw Error("slowDivide_ only works with positive integers.");for(var g=m,_=M;0>=_.l(E);)g=H(g),_=H(_);var T=O(g,1),I=O(_,1);for(_=O(_,2),g=O(g,2);!S(_);){var b=I.add(_);0>=b.l(E)&&(T=T.add(g),I=b),_=O(_,1),g=O(g,1)}return M=f(E,T.j(M)),new L(T,M)}for(T=p;0<=E.l(M);){for(g=Math.max(1,Math.floor(E.m()/M.m())),_=Math.ceil(Math.log(g)/Math.LN2),_=48>=_?1:Math.pow(2,_-48),I=h(g),b=I.j(M);w(b)||0<b.l(E);)g-=_,I=h(g),b=I.j(M);S(I)&&(I=m),T=T.add(I),E=f(E,b)}return new L(T,E)}i.A=function(E){return P(this,E).h},i.and=function(E){for(var M=Math.max(this.g.length,E.g.length),g=[],_=0;_<M;_++)g[_]=this.i(_)&E.i(_);return new a(g,this.h&E.h)},i.or=function(E){for(var M=Math.max(this.g.length,E.g.length),g=[],_=0;_<M;_++)g[_]=this.i(_)|E.i(_);return new a(g,this.h|E.h)},i.xor=function(E){for(var M=Math.max(this.g.length,E.g.length),g=[],_=0;_<M;_++)g[_]=this.i(_)^E.i(_);return new a(g,this.h^E.h)};function H(E){for(var M=E.g.length+1,g=[],_=0;_<M;_++)g[_]=E.i(_)<<1|E.i(_-1)>>>31;return new a(g,E.h)}function O(E,M){var g=M>>5;M%=32;for(var _=E.g.length-g,T=[],I=0;I<_;I++)T[I]=0<M?E.i(I+g)>>>M|E.i(I+g+1)<<32-M:E.i(I+g);return new a(T,E.h)}n.prototype.digest=n.prototype.v,n.prototype.reset=n.prototype.s,n.prototype.update=n.prototype.u,a.prototype.add=a.prototype.add,a.prototype.multiply=a.prototype.j,a.prototype.modulo=a.prototype.A,a.prototype.compare=a.prototype.l,a.prototype.toNumber=a.prototype.m,a.prototype.toString=a.prototype.toString,a.prototype.getBits=a.prototype.i,a.fromNumber=h,a.fromString=d,Kl=a}).apply(typeof fh<"u"?fh:typeof self<"u"?self:typeof window<"u"?window:{});var kr=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};(function(){var i,t=typeof Object.defineProperties=="function"?Object.defineProperty:function(o,u,y){return o==Array.prototype||o==Object.prototype||(o[u]=y.value),o};function e(o){o=[typeof globalThis=="object"&&globalThis,o,typeof window=="object"&&window,typeof self=="object"&&self,typeof kr=="object"&&kr];for(var u=0;u<o.length;++u){var y=o[u];if(y&&y.Math==Math)return y}throw Error("Cannot find global object")}var n=e(this);function s(o,u){if(u)t:{var y=n;o=o.split(".");for(var R=0;R<o.length-1;R++){var V=o[R];if(!(V in y))break t;y=y[V]}o=o[o.length-1],R=y[o],u=u(R),u!=R&&u!=null&&t(y,o,{configurable:!0,writable:!0,value:u})}}function r(o,u){o instanceof String&&(o+="");var y=0,R=!1,V={next:function(){if(!R&&y<o.length){var q=y++;return{value:u(q,o[q]),done:!1}}return R=!0,{done:!0,value:void 0}}};return V[Symbol.iterator]=function(){return V},V}s("Array.prototype.values",function(o){return o||function(){return r(this,function(u,y){return y})}});/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/var a=a||{},l=this||self;function c(o){var u=typeof o;return u=u!="object"?u:o?Array.isArray(o)?"array":u:"null",u=="array"||u=="object"&&typeof o.length=="number"}function h(o){var u=typeof o;return u=="object"&&o!=null||u=="function"}function d(o,u,y){return o.call.apply(o.bind,arguments)}function p(o,u,y){if(!o)throw Error();if(2<arguments.length){var R=Array.prototype.slice.call(arguments,2);return function(){var V=Array.prototype.slice.call(arguments);return Array.prototype.unshift.apply(V,R),o.apply(u,V)}}return function(){return o.apply(u,arguments)}}function m(o,u,y){return m=Function.prototype.bind&&Function.prototype.bind.toString().indexOf("native code")!=-1?d:p,m.apply(null,arguments)}function x(o,u){var y=Array.prototype.slice.call(arguments,1);return function(){var R=y.slice();return R.push.apply(R,arguments),o.apply(this,R)}}function S(o,u){function y(){}y.prototype=u.prototype,o.aa=u.prototype,o.prototype=new y,o.prototype.constructor=o,o.Qb=function(R,V,q){for(var at=Array(arguments.length-2),ye=2;ye<arguments.length;ye++)at[ye-2]=arguments[ye];return u.prototype[V].apply(R,at)}}function w(o){const u=o.length;if(0<u){const y=Array(u);for(let R=0;R<u;R++)y[R]=o[R];return y}return[]}function v(o,u){for(let y=1;y<arguments.length;y++){const R=arguments[y];if(c(R)){const V=o.length||0,q=R.length||0;o.length=V+q;for(let at=0;at<q;at++)o[V+at]=R[at]}else o.push(R)}}class f{constructor(u,y){this.i=u,this.j=y,this.h=0,this.g=null}get(){let u;return 0<this.h?(this.h--,u=this.g,this.g=u.next,u.next=null):u=this.i(),u}}function U(o){return/^[\s\xa0]*$/.test(o)}function L(){var o=l.navigator;return o&&(o=o.userAgent)?o:""}function P(o){return P[" "](o),o}P[" "]=function(){};var H=L().indexOf("Gecko")!=-1&&!(L().toLowerCase().indexOf("webkit")!=-1&&L().indexOf("Edge")==-1)&&!(L().indexOf("Trident")!=-1||L().indexOf("MSIE")!=-1)&&L().indexOf("Edge")==-1;function O(o,u,y){for(const R in o)u.call(y,o[R],R,o)}function E(o,u){for(const y in o)u.call(void 0,o[y],y,o)}function M(o){const u={};for(const y in o)u[y]=o[y];return u}const g="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function _(o,u){let y,R;for(let V=1;V<arguments.length;V++){R=arguments[V];for(y in R)o[y]=R[y];for(let q=0;q<g.length;q++)y=g[q],Object.prototype.hasOwnProperty.call(R,y)&&(o[y]=R[y])}}function T(o){var u=1;o=o.split(":");const y=[];for(;0<u&&o.length;)y.push(o.shift()),u--;return o.length&&y.push(o.join(":")),y}function I(o){l.setTimeout(()=>{throw o},0)}function b(){var o=ut;let u=null;return o.g&&(u=o.g,o.g=o.g.next,o.g||(o.h=null),u.next=null),u}class K{constructor(){this.h=this.g=null}add(u,y){const R=Q.get();R.set(u,y),this.h?this.h.next=R:this.g=R,this.h=R}}var Q=new f(()=>new J,o=>o.reset());class J{constructor(){this.next=this.g=this.h=null}set(u,y){this.h=u,this.g=y,this.next=null}reset(){this.next=this.g=this.h=null}}let nt,$=!1,ut=new K,vt=()=>{const o=l.Promise.resolve(void 0);nt=()=>{o.then(Ct)}};var Ct=()=>{for(var o;o=b();){try{o.h.call(o.g)}catch(y){I(y)}var u=Q;u.j(o),100>u.h&&(u.h++,o.next=u.g,u.g=o)}$=!1};function Ft(){this.s=this.s,this.C=this.C}Ft.prototype.s=!1,Ft.prototype.ma=function(){this.s||(this.s=!0,this.N())},Ft.prototype.N=function(){if(this.C)for(;this.C.length;)this.C.shift()()};function kt(o,u){this.type=o,this.g=this.target=u,this.defaultPrevented=!1}kt.prototype.h=function(){this.defaultPrevented=!0};var Z=(function(){if(!l.addEventListener||!Object.defineProperty)return!1;var o=!1,u=Object.defineProperty({},"passive",{get:function(){o=!0}});try{const y=()=>{};l.addEventListener("test",y,u),l.removeEventListener("test",y,u)}catch{}return o})();function st(o,u){if(kt.call(this,o?o.type:""),this.relatedTarget=this.g=this.target=null,this.button=this.screenY=this.screenX=this.clientY=this.clientX=0,this.key="",this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1,this.state=null,this.pointerId=0,this.pointerType="",this.i=null,o){var y=this.type=o.type,R=o.changedTouches&&o.changedTouches.length?o.changedTouches[0]:null;if(this.target=o.target||o.srcElement,this.g=u,u=o.relatedTarget){if(H){t:{try{P(u.nodeName);var V=!0;break t}catch{}V=!1}V||(u=null)}}else y=="mouseover"?u=o.fromElement:y=="mouseout"&&(u=o.toElement);this.relatedTarget=u,R?(this.clientX=R.clientX!==void 0?R.clientX:R.pageX,this.clientY=R.clientY!==void 0?R.clientY:R.pageY,this.screenX=R.screenX||0,this.screenY=R.screenY||0):(this.clientX=o.clientX!==void 0?o.clientX:o.pageX,this.clientY=o.clientY!==void 0?o.clientY:o.pageY,this.screenX=o.screenX||0,this.screenY=o.screenY||0),this.button=o.button,this.key=o.key||"",this.ctrlKey=o.ctrlKey,this.altKey=o.altKey,this.shiftKey=o.shiftKey,this.metaKey=o.metaKey,this.pointerId=o.pointerId||0,this.pointerType=typeof o.pointerType=="string"?o.pointerType:bt[o.pointerType]||"",this.state=o.state,this.i=o,o.defaultPrevented&&st.aa.h.call(this)}}S(st,kt);var bt={2:"touch",3:"pen",4:"mouse"};st.prototype.h=function(){st.aa.h.call(this);var o=this.i;o.preventDefault?o.preventDefault():o.returnValue=!1};var ct="closure_listenable_"+(1e6*Math.random()|0),Ut=0;function zt(o,u,y,R,V){this.listener=o,this.proxy=null,this.src=u,this.type=y,this.capture=!!R,this.ha=V,this.key=++Ut,this.da=this.fa=!1}function Ht(o){o.da=!0,o.listener=null,o.proxy=null,o.src=null,o.ha=null}function ue(o){this.src=o,this.g={},this.h=0}ue.prototype.add=function(o,u,y,R,V){var q=o.toString();o=this.g[q],o||(o=this.g[q]=[],this.h++);var at=Se(o,u,R,V);return-1<at?(u=o[at],y||(u.fa=!1)):(u=new zt(u,this.src,q,!!R,V),u.fa=y,o.push(u)),u};function qt(o,u){var y=u.type;if(y in o.g){var R=o.g[y],V=Array.prototype.indexOf.call(R,u,void 0),q;(q=0<=V)&&Array.prototype.splice.call(R,V,1),q&&(Ht(u),o.g[y].length==0&&(delete o.g[y],o.h--))}}function Se(o,u,y,R){for(var V=0;V<o.length;++V){var q=o[V];if(!q.da&&q.listener==u&&q.capture==!!y&&q.ha==R)return V}return-1}var z="closure_lm_"+(1e6*Math.random()|0),Ve={};function jt(o,u,y,R,V){if(Array.isArray(u)){for(var q=0;q<u.length;q++)jt(o,u[q],y,R,V);return null}return y=it(y),o&&o[ct]?o.K(u,y,h(R)?!!R.capture:!1,V):$t(o,u,y,!1,R,V)}function $t(o,u,y,R,V,q){if(!u)throw Error("Invalid event type");var at=h(V)?!!V.capture:!!V,ye=G(o);if(ye||(o[z]=ye=new ue(o)),y=ye.add(u,y,R,at,q),y.proxy)return y;if(R=It(),y.proxy=R,R.src=o,R.listener=y,o.addEventListener)Z||(V=at),V===void 0&&(V=!1),o.addEventListener(u.toString(),R,V);else if(o.attachEvent)o.attachEvent(D(u.toString()),R);else if(o.addListener&&o.removeListener)o.addListener(R);else throw Error("addEventListener and attachEvent are unavailable.");return y}function It(){function o(y){return u.call(o.src,o.listener,y)}const u=A;return o}function fe(o,u,y,R,V){if(Array.isArray(u))for(var q=0;q<u.length;q++)fe(o,u[q],y,R,V);else R=h(R)?!!R.capture:!!R,y=it(y),o&&o[ct]?(o=o.i,u=String(u).toString(),u in o.g&&(q=o.g[u],y=Se(q,y,R,V),-1<y&&(Ht(q[y]),Array.prototype.splice.call(q,y,1),q.length==0&&(delete o.g[u],o.h--)))):o&&(o=G(o))&&(u=o.g[u.toString()],o=-1,u&&(o=Se(u,y,R,V)),(y=-1<o?u[o]:null)&&Rt(y))}function Rt(o){if(typeof o!="number"&&o&&!o.da){var u=o.src;if(u&&u[ct])qt(u.i,o);else{var y=o.type,R=o.proxy;u.removeEventListener?u.removeEventListener(y,R,o.capture):u.detachEvent?u.detachEvent(D(y),R):u.addListener&&u.removeListener&&u.removeListener(R),(y=G(u))?(qt(y,o),y.h==0&&(y.src=null,u[z]=null)):Ht(o)}}}function D(o){return o in Ve?Ve[o]:Ve[o]="on"+o}function A(o,u){if(o.da)o=!0;else{u=new st(u,this);var y=o.listener,R=o.ha||o.src;o.fa&&Rt(o),o=y.call(R,u)}return o}function G(o){return o=o[z],o instanceof ue?o:null}var tt="__closure_events_fn_"+(1e9*Math.random()>>>0);function it(o){return typeof o=="function"?o:(o[tt]||(o[tt]=function(u){return o.handleEvent(u)}),o[tt])}function Y(){Ft.call(this),this.i=new ue(this),this.M=this,this.F=null}S(Y,Ft),Y.prototype[ct]=!0,Y.prototype.removeEventListener=function(o,u,y,R){fe(this,o,u,y,R)};function gt(o,u){var y,R=o.F;if(R)for(y=[];R;R=R.F)y.push(R);if(o=o.M,R=u.type||u,typeof u=="string")u=new kt(u,o);else if(u instanceof kt)u.target=u.target||o;else{var V=u;u=new kt(R,o),_(u,V)}if(V=!0,y)for(var q=y.length-1;0<=q;q--){var at=u.g=y[q];V=ht(at,R,!0,u)&&V}if(at=u.g=o,V=ht(at,R,!0,u)&&V,V=ht(at,R,!1,u)&&V,y)for(q=0;q<y.length;q++)at=u.g=y[q],V=ht(at,R,!1,u)&&V}Y.prototype.N=function(){if(Y.aa.N.call(this),this.i){var o=this.i,u;for(u in o.g){for(var y=o.g[u],R=0;R<y.length;R++)Ht(y[R]);delete o.g[u],o.h--}}this.F=null},Y.prototype.K=function(o,u,y,R){return this.i.add(String(o),u,!1,y,R)},Y.prototype.L=function(o,u,y,R){return this.i.add(String(o),u,!0,y,R)};function ht(o,u,y,R){if(u=o.i.g[String(u)],!u)return!0;u=u.concat();for(var V=!0,q=0;q<u.length;++q){var at=u[q];if(at&&!at.da&&at.capture==y){var ye=at.listener,ze=at.ha||at.src;at.fa&&qt(o.i,at),V=ye.call(ze,R)!==!1&&V}}return V&&!R.defaultPrevented}function yt(o,u,y){if(typeof o=="function")y&&(o=m(o,y));else if(o&&typeof o.handleEvent=="function")o=m(o.handleEvent,o);else throw Error("Invalid listener argument");return 2147483647<Number(u)?-1:l.setTimeout(o,u||0)}function Yt(o){o.g=yt(()=>{o.g=null,o.i&&(o.i=!1,Yt(o))},o.l);const u=o.h;o.h=null,o.m.apply(null,u)}class rt extends Ft{constructor(u,y){super(),this.m=u,this.l=y,this.h=null,this.i=!1,this.g=null}j(u){this.h=arguments,this.g?this.i=!0:Yt(this)}N(){super.N(),this.g&&(l.clearTimeout(this.g),this.g=null,this.i=!1,this.h=null)}}function _t(o){Ft.call(this),this.h=o,this.g={}}S(_t,Ft);var Dt=[];function Ot(o){O(o.g,function(u,y){this.g.hasOwnProperty(y)&&Rt(u)},o),o.g={}}_t.prototype.N=function(){_t.aa.N.call(this),Ot(this)},_t.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented")};var xt=l.JSON.stringify,Kt=l.JSON.parse,Gt=class{stringify(o){return l.JSON.stringify(o,void 0)}parse(o){return l.JSON.parse(o,void 0)}};function ae(){}ae.prototype.h=null;function F(o){return o.h||(o.h=o.i())}function pt(){}var j={OPEN:"a",kb:"b",Ja:"c",wb:"d"};function et(){kt.call(this,"d")}S(et,kt);function mt(){kt.call(this,"c")}S(mt,kt);var lt={},Vt=null;function Me(){return Vt=Vt||new Y}lt.La="serverreachability";function Ie(o){kt.call(this,lt.La,o)}S(Ie,kt);function Jt(o){const u=Me();gt(u,new Ie(u))}lt.STAT_EVENT="statevent";function tn(o,u){kt.call(this,lt.STAT_EVENT,o),this.stat=u}S(tn,kt);function Ee(o){const u=Me();gt(u,new tn(u,o))}lt.Ma="timingevent";function Hs(o,u){kt.call(this,lt.Ma,o),this.size=u}S(Hs,kt);function si(o,u){if(typeof o!="function")throw Error("Fn must not be null and must be a function");return l.setTimeout(function(){o()},u)}function en(){this.g=!0}en.prototype.xa=function(){this.g=!1};function Gs(o,u,y,R,V,q){o.info(function(){if(o.g)if(q)for(var at="",ye=q.split("&"),ze=0;ze<ye.length;ze++){var ie=ye[ze].split("=");if(1<ie.length){var Ge=ie[0];ie=ie[1];var We=Ge.split("_");at=2<=We.length&&We[1]=="type"?at+(Ge+"="+ie+"&"):at+(Ge+"=redacted&")}}else at=null;else at=q;return"XMLHTTP REQ ("+R+") [attempt "+V+"]: "+u+`
`+y+`
`+at})}function wr(o,u,y,R,V,q,at){o.info(function(){return"XMLHTTP RESP ("+R+") [ attempt "+V+"]: "+u+`
`+y+`
`+q+" "+at})}function Vn(o,u,y,R){o.info(function(){return"XMLHTTP TEXT ("+u+"): "+br(o,y)+(R?" "+R:"")})}function $i(o,u){o.info(function(){return"TIMEOUT: "+u})}en.prototype.info=function(){};function br(o,u){if(!o.g)return u;if(!u)return null;try{var y=JSON.parse(u);if(y){for(o=0;o<y.length;o++)if(Array.isArray(y[o])){var R=y[o];if(!(2>R.length)){var V=R[1];if(Array.isArray(V)&&!(1>V.length)){var q=V[0];if(q!="noop"&&q!="stop"&&q!="close")for(var at=1;at<V.length;at++)V[at]=""}}}}return xt(y)}catch{return u}}var ri={NO_ERROR:0,TIMEOUT:8},Ar={},Yi;function Ki(){}S(Ki,ae),Ki.prototype.g=function(){return new XMLHttpRequest},Ki.prototype.i=function(){return{}},Yi=new Ki;function In(o,u,y,R){this.j=o,this.i=u,this.l=y,this.R=R||1,this.U=new _t(this),this.I=45e3,this.H=null,this.o=!1,this.m=this.A=this.v=this.L=this.F=this.S=this.B=null,this.D=[],this.g=null,this.C=0,this.s=this.u=null,this.X=-1,this.J=!1,this.O=0,this.M=null,this.W=this.K=this.T=this.P=!1,this.h=new Cr}function Cr(){this.i=null,this.g="",this.h=!1}var C={},B={};function W(o,u,y){o.L=1,o.v=Rr(je(u)),o.m=y,o.P=!0,X(o,null)}function X(o,u){o.F=Date.now(),ft(o),o.A=je(o.v);var y=o.A,R=o.R;Array.isArray(R)||(R=[String(R)]),Ec(y.i,"t",R),o.C=0,y=o.j.J,o.h=new Cr,o.g=Vc(o.j,y?u:null,!o.m),0<o.O&&(o.M=new rt(m(o.Y,o,o.g),o.O)),u=o.U,y=o.g,R=o.ca;var V="readystatechange";Array.isArray(V)||(V&&(Dt[0]=V.toString()),V=Dt);for(var q=0;q<V.length;q++){var at=jt(y,V[q],R||u.handleEvent,!1,u.h||u);if(!at)break;u.g[at.key]=at}u=o.H?M(o.H):{},o.m?(o.u||(o.u="POST"),u["Content-Type"]="application/x-www-form-urlencoded",o.g.ea(o.A,o.u,o.m,u)):(o.u="GET",o.g.ea(o.A,o.u,null,u)),Jt(),Gs(o.i,o.u,o.A,o.l,o.R,o.m)}In.prototype.ca=function(o){o=o.target;const u=this.M;u&&Hn(o)==3?u.j():this.Y(o)},In.prototype.Y=function(o){try{if(o==this.g)t:{const We=Hn(this.g);var u=this.g.Ba();const Qi=this.g.Z();if(!(3>We)&&(We!=3||this.g&&(this.h.h||this.g.oa()||Pc(this.g)))){this.J||We!=4||u==7||(u==8||0>=Qi?Jt(3):Jt(2)),St(this);var y=this.g.Z();this.X=y;e:if(k(this)){var R=Pc(this.g);o="";var V=R.length,q=Hn(this.g)==4;if(!this.h.i){if(typeof TextDecoder>"u"){Nt(this),Lt(this);var at="";break e}this.h.i=new l.TextDecoder}for(u=0;u<V;u++)this.h.h=!0,o+=this.h.i.decode(R[u],{stream:!(q&&u==V-1)});R.length=0,this.h.g+=o,this.C=0,at=this.h.g}else at=this.g.oa();if(this.o=y==200,wr(this.i,this.u,this.A,this.l,this.R,We,y),this.o){if(this.T&&!this.K){e:{if(this.g){var ye,ze=this.g;if((ye=ze.g?ze.g.getResponseHeader("X-HTTP-Initial-Response"):null)&&!U(ye)){var ie=ye;break e}}ie=null}if(y=ie)Vn(this.i,this.l,y,"Initial handshake response via X-HTTP-Initial-Response"),this.K=!0,Et(this,y);else{this.o=!1,this.s=3,Ee(12),Nt(this),Lt(this);break t}}if(this.P){y=!0;let yn;for(;!this.J&&this.C<at.length;)if(yn=ot(this,at),yn==B){We==4&&(this.s=4,Ee(14),y=!1),Vn(this.i,this.l,null,"[Incomplete Response]");break}else if(yn==C){this.s=4,Ee(15),Vn(this.i,this.l,at,"[Invalid Chunk]"),y=!1;break}else Vn(this.i,this.l,yn,null),Et(this,yn);if(k(this)&&this.C!=0&&(this.h.g=this.h.g.slice(this.C),this.C=0),We!=4||at.length!=0||this.h.h||(this.s=1,Ee(16),y=!1),this.o=this.o&&y,!y)Vn(this.i,this.l,at,"[Invalid Chunked Response]"),Nt(this),Lt(this);else if(0<at.length&&!this.W){this.W=!0;var Ge=this.j;Ge.g==this&&Ge.ba&&!Ge.M&&(Ge.j.info("Great, no buffering proxy detected. Bytes received: "+at.length),ia(Ge),Ge.M=!0,Ee(11))}}else Vn(this.i,this.l,at,null),Et(this,at);We==4&&Nt(this),this.o&&!this.J&&(We==4?Fc(this.j,this):(this.o=!1,ft(this)))}else Cd(this.g),y==400&&0<at.indexOf("Unknown SID")?(this.s=3,Ee(12)):(this.s=0,Ee(13)),Nt(this),Lt(this)}}}catch{}finally{}};function k(o){return o.g?o.u=="GET"&&o.L!=2&&o.j.Ca:!1}function ot(o,u){var y=o.C,R=u.indexOf(`
`,y);return R==-1?B:(y=Number(u.substring(y,R)),isNaN(y)?C:(R+=1,R+y>u.length?B:(u=u.slice(R,R+y),o.C=R+y,u)))}In.prototype.cancel=function(){this.J=!0,Nt(this)};function ft(o){o.S=Date.now()+o.I,Tt(o,o.I)}function Tt(o,u){if(o.B!=null)throw Error("WatchDog timer not null");o.B=si(m(o.ba,o),u)}function St(o){o.B&&(l.clearTimeout(o.B),o.B=null)}In.prototype.ba=function(){this.B=null;const o=Date.now();0<=o-this.S?($i(this.i,this.A),this.L!=2&&(Jt(),Ee(17)),Nt(this),this.s=2,Lt(this)):Tt(this,this.S-o)};function Lt(o){o.j.G==0||o.J||Fc(o.j,o)}function Nt(o){St(o);var u=o.M;u&&typeof u.ma=="function"&&u.ma(),o.M=null,Ot(o.U),o.g&&(u=o.g,o.g=null,u.abort(),u.ma())}function Et(o,u){try{var y=o.j;if(y.G!=0&&(y.g==o||Qt(y.h,o))){if(!o.K&&Qt(y.h,o)&&y.G==3){try{var R=y.Da.g.parse(u)}catch{R=null}if(Array.isArray(R)&&R.length==3){var V=R;if(V[0]==0){t:if(!y.u){if(y.g)if(y.g.F+3e3<o.F)Nr(y),Lr(y);else break t;na(y),Ee(18)}}else y.za=V[1],0<y.za-y.T&&37500>V[2]&&y.F&&y.v==0&&!y.C&&(y.C=si(m(y.Za,y),6e3));if(1>=Be(y.h)&&y.ca){try{y.ca()}catch{}y.ca=void 0}}else Ai(y,11)}else if((o.K||y.g==o)&&Nr(y),!U(u))for(V=y.Da.g.parse(u),u=0;u<V.length;u++){let ie=V[u];if(y.T=ie[0],ie=ie[1],y.G==2)if(ie[0]=="c"){y.K=ie[1],y.ia=ie[2];const Ge=ie[3];Ge!=null&&(y.la=Ge,y.j.info("VER="+y.la));const We=ie[4];We!=null&&(y.Aa=We,y.j.info("SVER="+y.Aa));const Qi=ie[5];Qi!=null&&typeof Qi=="number"&&0<Qi&&(R=1.5*Qi,y.L=R,y.j.info("backChannelRequestTimeoutMs_="+R)),R=y;const yn=o.g;if(yn){const Or=yn.g?yn.g.getResponseHeader("X-Client-Wire-Protocol"):null;if(Or){var q=R.h;q.g||Or.indexOf("spdy")==-1&&Or.indexOf("quic")==-1&&Or.indexOf("h2")==-1||(q.j=q.l,q.g=new Set,q.h&&(wt(q,q.h),q.h=null))}if(R.D){const sa=yn.g?yn.g.getResponseHeader("X-HTTP-Session-Id"):null;sa&&(R.ya=sa,pe(R.I,R.D,sa))}}y.G=3,y.l&&y.l.ua(),y.ba&&(y.R=Date.now()-o.F,y.j.info("Handshake RTT: "+y.R+"ms")),R=y;var at=o;if(R.qa=zc(R,R.J?R.ia:null,R.W),at.K){hn(R.h,at);var ye=at,ze=R.L;ze&&(ye.I=ze),ye.B&&(St(ye),ft(ye)),R.g=at}else Nc(R);0<y.i.length&&Ur(y)}else ie[0]!="stop"&&ie[0]!="close"||Ai(y,7);else y.G==3&&(ie[0]=="stop"||ie[0]=="close"?ie[0]=="stop"?Ai(y,7):ea(y):ie[0]!="noop"&&y.l&&y.l.ta(ie),y.v=0)}}Jt(4)}catch{}}var Zt=class{constructor(o,u){this.g=o,this.map=u}};function le(o){this.l=o||10,l.PerformanceNavigationTiming?(o=l.performance.getEntriesByType("navigation"),o=0<o.length&&(o[0].nextHopProtocol=="hq"||o[0].nextHopProtocol=="h2")):o=!!(l.chrome&&l.chrome.loadTimes&&l.chrome.loadTimes()&&l.chrome.loadTimes().wasFetchedViaSpdy),this.j=o?this.l:1,this.g=null,1<this.j&&(this.g=new Set),this.h=null,this.i=[]}function de(o){return o.h?!0:o.g?o.g.size>=o.j:!1}function Be(o){return o.h?1:o.g?o.g.size:0}function Qt(o,u){return o.h?o.h==u:o.g?o.g.has(u):!1}function wt(o,u){o.g?o.g.add(u):o.h=u}function hn(o,u){o.h&&o.h==u?o.h=null:o.g&&o.g.has(u)&&o.g.delete(u)}le.prototype.cancel=function(){if(this.i=ne(this),this.h)this.h.cancel(),this.h=null;else if(this.g&&this.g.size!==0){for(const o of this.g.values())o.cancel();this.g.clear()}};function ne(o){if(o.h!=null)return o.i.concat(o.h.D);if(o.g!=null&&o.g.size!==0){let u=o.i;for(const y of o.g.values())u=u.concat(y.D);return u}return w(o.i)}function nn(o){if(o.V&&typeof o.V=="function")return o.V();if(typeof Map<"u"&&o instanceof Map||typeof Set<"u"&&o instanceof Set)return Array.from(o.values());if(typeof o=="string")return o.split("");if(c(o)){for(var u=[],y=o.length,R=0;R<y;R++)u.push(o[R]);return u}u=[],y=0;for(R in o)u[y++]=o[R];return u}function oi(o){if(o.na&&typeof o.na=="function")return o.na();if(!o.V||typeof o.V!="function"){if(typeof Map<"u"&&o instanceof Map)return Array.from(o.keys());if(!(typeof Set<"u"&&o instanceof Set)){if(c(o)||typeof o=="string"){var u=[];o=o.length;for(var y=0;y<o;y++)u.push(y);return u}u=[],y=0;for(const R in o)u[y++]=R;return u}}}function He(o,u){if(o.forEach&&typeof o.forEach=="function")o.forEach(u,void 0);else if(c(o)||typeof o=="string")Array.prototype.forEach.call(o,u,void 0);else for(var y=oi(o),R=nn(o),V=R.length,q=0;q<V;q++)u.call(void 0,R[q],y&&y[q],o)}var ai=RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");function ve(o,u){if(o){o=o.split("&");for(var y=0;y<o.length;y++){var R=o[y].indexOf("="),V=null;if(0<=R){var q=o[y].substring(0,R);V=o[y].substring(R+1)}else q=o[y];u(q,V?decodeURIComponent(V.replace(/\+/g," ")):"")}}}function Ue(o){if(this.g=this.o=this.j="",this.s=null,this.m=this.l="",this.h=!1,o instanceof Ue){this.h=o.h,ke(this,o.j),this.o=o.o,this.g=o.g,sn(this,o.s),this.l=o.l;var u=o.i,y=new qs;y.i=u.i,u.g&&(y.g=new Map(u.g),y.h=u.h),vn(this,y),this.m=o.m}else o&&(u=String(o).match(ai))?(this.h=!1,ke(this,u[1]||"",!0),this.o=Ws(u[2]||""),this.g=Ws(u[3]||"",!0),sn(this,u[4]),this.l=Ws(u[5]||"",!0),vn(this,u[6]||"",!0),this.m=Ws(u[7]||"")):(this.h=!1,this.i=new qs(null,this.h))}Ue.prototype.toString=function(){var o=[],u=this.j;u&&o.push(Xs(u,xc,!0),":");var y=this.g;return(y||u=="file")&&(o.push("//"),(u=this.o)&&o.push(Xs(u,xc,!0),"@"),o.push(encodeURIComponent(String(y)).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),y=this.s,y!=null&&o.push(":",String(y))),(y=this.l)&&(this.g&&y.charAt(0)!="/"&&o.push("/"),o.push(Xs(y,y.charAt(0)=="/"?vd:_d,!0))),(y=this.i.toString())&&o.push("?",y),(y=this.m)&&o.push("#",Xs(y,xd)),o.join("")};function je(o){return new Ue(o)}function ke(o,u,y){o.j=y?Ws(u,!0):u,o.j&&(o.j=o.j.replace(/:$/,""))}function sn(o,u){if(u){if(u=Number(u),isNaN(u)||0>u)throw Error("Bad port number "+u);o.s=u}else o.s=null}function vn(o,u,y){u instanceof qs?(o.i=u,Md(o.i,o.h)):(y||(u=Xs(u,yd)),o.i=new qs(u,o.h))}function pe(o,u,y){o.i.set(u,y)}function Rr(o){return pe(o,"zx",Math.floor(2147483648*Math.random()).toString(36)+Math.abs(Math.floor(2147483648*Math.random())^Date.now()).toString(36)),o}function Ws(o,u){return o?u?decodeURI(o.replace(/%25/g,"%2525")):decodeURIComponent(o):""}function Xs(o,u,y){return typeof o=="string"?(o=encodeURI(o).replace(u,gd),y&&(o=o.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),o):null}function gd(o){return o=o.charCodeAt(0),"%"+(o>>4&15).toString(16)+(o&15).toString(16)}var xc=/[#\/\?@]/g,_d=/[#\?:]/g,vd=/[#\?]/g,yd=/[#\?@]/g,xd=/#/g;function qs(o,u){this.h=this.g=null,this.i=o||null,this.j=!!u}function li(o){o.g||(o.g=new Map,o.h=0,o.i&&ve(o.i,function(u,y){o.add(decodeURIComponent(u.replace(/\+/g," ")),y)}))}i=qs.prototype,i.add=function(o,u){li(this),this.i=null,o=Ji(this,o);var y=this.g.get(o);return y||this.g.set(o,y=[]),y.push(u),this.h+=1,this};function Mc(o,u){li(o),u=Ji(o,u),o.g.has(u)&&(o.i=null,o.h-=o.g.get(u).length,o.g.delete(u))}function Sc(o,u){return li(o),u=Ji(o,u),o.g.has(u)}i.forEach=function(o,u){li(this),this.g.forEach(function(y,R){y.forEach(function(V){o.call(u,V,R,this)},this)},this)},i.na=function(){li(this);const o=Array.from(this.g.values()),u=Array.from(this.g.keys()),y=[];for(let R=0;R<u.length;R++){const V=o[R];for(let q=0;q<V.length;q++)y.push(u[R])}return y},i.V=function(o){li(this);let u=[];if(typeof o=="string")Sc(this,o)&&(u=u.concat(this.g.get(Ji(this,o))));else{o=Array.from(this.g.values());for(let y=0;y<o.length;y++)u=u.concat(o[y])}return u},i.set=function(o,u){return li(this),this.i=null,o=Ji(this,o),Sc(this,o)&&(this.h-=this.g.get(o).length),this.g.set(o,[u]),this.h+=1,this},i.get=function(o,u){return o?(o=this.V(o),0<o.length?String(o[0]):u):u};function Ec(o,u,y){Mc(o,u),0<y.length&&(o.i=null,o.g.set(Ji(o,u),w(y)),o.h+=y.length)}i.toString=function(){if(this.i)return this.i;if(!this.g)return"";const o=[],u=Array.from(this.g.keys());for(var y=0;y<u.length;y++){var R=u[y];const q=encodeURIComponent(String(R)),at=this.V(R);for(R=0;R<at.length;R++){var V=q;at[R]!==""&&(V+="="+encodeURIComponent(String(at[R]))),o.push(V)}}return this.i=o.join("&")};function Ji(o,u){return u=String(u),o.j&&(u=u.toLowerCase()),u}function Md(o,u){u&&!o.j&&(li(o),o.i=null,o.g.forEach(function(y,R){var V=R.toLowerCase();R!=V&&(Mc(this,R),Ec(this,V,y))},o)),o.j=u}function Sd(o,u){const y=new en;if(l.Image){const R=new Image;R.onload=x(ci,y,"TestLoadImage: loaded",!0,u,R),R.onerror=x(ci,y,"TestLoadImage: error",!1,u,R),R.onabort=x(ci,y,"TestLoadImage: abort",!1,u,R),R.ontimeout=x(ci,y,"TestLoadImage: timeout",!1,u,R),l.setTimeout(function(){R.ontimeout&&R.ontimeout()},1e4),R.src=o}else u(!1)}function Ed(o,u){const y=new en,R=new AbortController,V=setTimeout(()=>{R.abort(),ci(y,"TestPingServer: timeout",!1,u)},1e4);fetch(o,{signal:R.signal}).then(q=>{clearTimeout(V),q.ok?ci(y,"TestPingServer: ok",!0,u):ci(y,"TestPingServer: server error",!1,u)}).catch(()=>{clearTimeout(V),ci(y,"TestPingServer: error",!1,u)})}function ci(o,u,y,R,V){try{V&&(V.onload=null,V.onerror=null,V.onabort=null,V.ontimeout=null),R(y)}catch{}}function Td(){this.g=new Gt}function wd(o,u,y){const R=y||"";try{He(o,function(V,q){let at=V;h(V)&&(at=xt(V)),u.push(R+q+"="+encodeURIComponent(at))})}catch(V){throw u.push(R+"type="+encodeURIComponent("_badmap")),V}}function Pr(o){this.l=o.Ub||null,this.j=o.eb||!1}S(Pr,ae),Pr.prototype.g=function(){return new Ir(this.l,this.j)},Pr.prototype.i=(function(o){return function(){return o}})({});function Ir(o,u){Y.call(this),this.D=o,this.o=u,this.m=void 0,this.status=this.readyState=0,this.responseType=this.responseText=this.response=this.statusText="",this.onreadystatechange=null,this.u=new Headers,this.h=null,this.B="GET",this.A="",this.g=!1,this.v=this.j=this.l=null}S(Ir,Y),i=Ir.prototype,i.open=function(o,u){if(this.readyState!=0)throw this.abort(),Error("Error reopening a connection");this.B=o,this.A=u,this.readyState=1,$s(this)},i.send=function(o){if(this.readyState!=1)throw this.abort(),Error("need to call open() first. ");this.g=!0;const u={headers:this.u,method:this.B,credentials:this.m,cache:void 0};o&&(u.body=o),(this.D||l).fetch(new Request(this.A,u)).then(this.Sa.bind(this),this.ga.bind(this))},i.abort=function(){this.response=this.responseText="",this.u=new Headers,this.status=0,this.j&&this.j.cancel("Request was aborted.").catch(()=>{}),1<=this.readyState&&this.g&&this.readyState!=4&&(this.g=!1,js(this)),this.readyState=0},i.Sa=function(o){if(this.g&&(this.l=o,this.h||(this.status=this.l.status,this.statusText=this.l.statusText,this.h=o.headers,this.readyState=2,$s(this)),this.g&&(this.readyState=3,$s(this),this.g)))if(this.responseType==="arraybuffer")o.arrayBuffer().then(this.Qa.bind(this),this.ga.bind(this));else if(typeof l.ReadableStream<"u"&&"body"in o){if(this.j=o.body.getReader(),this.o){if(this.responseType)throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');this.response=[]}else this.response=this.responseText="",this.v=new TextDecoder;Tc(this)}else o.text().then(this.Ra.bind(this),this.ga.bind(this))};function Tc(o){o.j.read().then(o.Pa.bind(o)).catch(o.ga.bind(o))}i.Pa=function(o){if(this.g){if(this.o&&o.value)this.response.push(o.value);else if(!this.o){var u=o.value?o.value:new Uint8Array(0);(u=this.v.decode(u,{stream:!o.done}))&&(this.response=this.responseText+=u)}o.done?js(this):$s(this),this.readyState==3&&Tc(this)}},i.Ra=function(o){this.g&&(this.response=this.responseText=o,js(this))},i.Qa=function(o){this.g&&(this.response=o,js(this))},i.ga=function(){this.g&&js(this)};function js(o){o.readyState=4,o.l=null,o.j=null,o.v=null,$s(o)}i.setRequestHeader=function(o,u){this.u.append(o,u)},i.getResponseHeader=function(o){return this.h&&this.h.get(o.toLowerCase())||""},i.getAllResponseHeaders=function(){if(!this.h)return"";const o=[],u=this.h.entries();for(var y=u.next();!y.done;)y=y.value,o.push(y[0]+": "+y[1]),y=u.next();return o.join(`\r
`)};function $s(o){o.onreadystatechange&&o.onreadystatechange.call(o)}Object.defineProperty(Ir.prototype,"withCredentials",{get:function(){return this.m==="include"},set:function(o){this.m=o?"include":"same-origin"}});function wc(o){let u="";return O(o,function(y,R){u+=R,u+=":",u+=y,u+=`\r
`}),u}function ta(o,u,y){t:{for(R in y){var R=!1;break t}R=!0}R||(y=wc(y),typeof o=="string"?y!=null&&encodeURIComponent(String(y)):pe(o,u,y))}function we(o){Y.call(this),this.headers=new Map,this.o=o||null,this.h=!1,this.v=this.g=null,this.D="",this.m=0,this.l="",this.j=this.B=this.u=this.A=!1,this.I=null,this.H="",this.J=!1}S(we,Y);var bd=/^https?$/i,Ad=["POST","PUT"];i=we.prototype,i.Ha=function(o){this.J=o},i.ea=function(o,u,y,R){if(this.g)throw Error("[goog.net.XhrIo] Object is active with another request="+this.D+"; newUri="+o);u=u?u.toUpperCase():"GET",this.D=o,this.l="",this.m=0,this.A=!1,this.h=!0,this.g=this.o?this.o.g():Yi.g(),this.v=this.o?F(this.o):F(Yi),this.g.onreadystatechange=m(this.Ea,this);try{this.B=!0,this.g.open(u,String(o),!0),this.B=!1}catch(q){bc(this,q);return}if(o=y||"",y=new Map(this.headers),R)if(Object.getPrototypeOf(R)===Object.prototype)for(var V in R)y.set(V,R[V]);else if(typeof R.keys=="function"&&typeof R.get=="function")for(const q of R.keys())y.set(q,R.get(q));else throw Error("Unknown input type for opt_headers: "+String(R));R=Array.from(y.keys()).find(q=>q.toLowerCase()=="content-type"),V=l.FormData&&o instanceof l.FormData,!(0<=Array.prototype.indexOf.call(Ad,u,void 0))||R||V||y.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");for(const[q,at]of y)this.g.setRequestHeader(q,at);this.H&&(this.g.responseType=this.H),"withCredentials"in this.g&&this.g.withCredentials!==this.J&&(this.g.withCredentials=this.J);try{Rc(this),this.u=!0,this.g.send(o),this.u=!1}catch(q){bc(this,q)}};function bc(o,u){o.h=!1,o.g&&(o.j=!0,o.g.abort(),o.j=!1),o.l=u,o.m=5,Ac(o),Dr(o)}function Ac(o){o.A||(o.A=!0,gt(o,"complete"),gt(o,"error"))}i.abort=function(o){this.g&&this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1,this.m=o||7,gt(this,"complete"),gt(this,"abort"),Dr(this))},i.N=function(){this.g&&(this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1),Dr(this,!0)),we.aa.N.call(this)},i.Ea=function(){this.s||(this.B||this.u||this.j?Cc(this):this.bb())},i.bb=function(){Cc(this)};function Cc(o){if(o.h&&typeof a<"u"&&(!o.v[1]||Hn(o)!=4||o.Z()!=2)){if(o.u&&Hn(o)==4)yt(o.Ea,0,o);else if(gt(o,"readystatechange"),Hn(o)==4){o.h=!1;try{const at=o.Z();t:switch(at){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:var u=!0;break t;default:u=!1}var y;if(!(y=u)){var R;if(R=at===0){var V=String(o.D).match(ai)[1]||null;!V&&l.self&&l.self.location&&(V=l.self.location.protocol.slice(0,-1)),R=!bd.test(V?V.toLowerCase():"")}y=R}if(y)gt(o,"complete"),gt(o,"success");else{o.m=6;try{var q=2<Hn(o)?o.g.statusText:""}catch{q=""}o.l=q+" ["+o.Z()+"]",Ac(o)}}finally{Dr(o)}}}}function Dr(o,u){if(o.g){Rc(o);const y=o.g,R=o.v[0]?()=>{}:null;o.g=null,o.v=null,u||gt(o,"ready");try{y.onreadystatechange=R}catch{}}}function Rc(o){o.I&&(l.clearTimeout(o.I),o.I=null)}i.isActive=function(){return!!this.g};function Hn(o){return o.g?o.g.readyState:0}i.Z=function(){try{return 2<Hn(this)?this.g.status:-1}catch{return-1}},i.oa=function(){try{return this.g?this.g.responseText:""}catch{return""}},i.Oa=function(o){if(this.g){var u=this.g.responseText;return o&&u.indexOf(o)==0&&(u=u.substring(o.length)),Kt(u)}};function Pc(o){try{if(!o.g)return null;if("response"in o.g)return o.g.response;switch(o.H){case"":case"text":return o.g.responseText;case"arraybuffer":if("mozResponseArrayBuffer"in o.g)return o.g.mozResponseArrayBuffer}return null}catch{return null}}function Cd(o){const u={};o=(o.g&&2<=Hn(o)&&o.g.getAllResponseHeaders()||"").split(`\r
`);for(let R=0;R<o.length;R++){if(U(o[R]))continue;var y=T(o[R]);const V=y[0];if(y=y[1],typeof y!="string")continue;y=y.trim();const q=u[V]||[];u[V]=q,q.push(y)}E(u,function(R){return R.join(", ")})}i.Ba=function(){return this.m},i.Ka=function(){return typeof this.l=="string"?this.l:String(this.l)};function Ys(o,u,y){return y&&y.internalChannelParams&&y.internalChannelParams[o]||u}function Ic(o){this.Aa=0,this.i=[],this.j=new en,this.ia=this.qa=this.I=this.W=this.g=this.ya=this.D=this.H=this.m=this.S=this.o=null,this.Ya=this.U=0,this.Va=Ys("failFast",!1,o),this.F=this.C=this.u=this.s=this.l=null,this.X=!0,this.za=this.T=-1,this.Y=this.v=this.B=0,this.Ta=Ys("baseRetryDelayMs",5e3,o),this.cb=Ys("retryDelaySeedMs",1e4,o),this.Wa=Ys("forwardChannelMaxRetries",2,o),this.wa=Ys("forwardChannelRequestTimeoutMs",2e4,o),this.pa=o&&o.xmlHttpFactory||void 0,this.Xa=o&&o.Tb||void 0,this.Ca=o&&o.useFetchStreams||!1,this.L=void 0,this.J=o&&o.supportsCrossDomainXhr||!1,this.K="",this.h=new le(o&&o.concurrentRequestLimit),this.Da=new Td,this.P=o&&o.fastHandshake||!1,this.O=o&&o.encodeInitMessageHeaders||!1,this.P&&this.O&&(this.O=!1),this.Ua=o&&o.Rb||!1,o&&o.xa&&this.j.xa(),o&&o.forceLongPolling&&(this.X=!1),this.ba=!this.P&&this.X&&o&&o.detectBufferingProxy||!1,this.ja=void 0,o&&o.longPollingTimeout&&0<o.longPollingTimeout&&(this.ja=o.longPollingTimeout),this.ca=void 0,this.R=0,this.M=!1,this.ka=this.A=null}i=Ic.prototype,i.la=8,i.G=1,i.connect=function(o,u,y,R){Ee(0),this.W=o,this.H=u||{},y&&R!==void 0&&(this.H.OSID=y,this.H.OAID=R),this.F=this.X,this.I=zc(this,null,this.W),Ur(this)};function ea(o){if(Dc(o),o.G==3){var u=o.U++,y=je(o.I);if(pe(y,"SID",o.K),pe(y,"RID",u),pe(y,"TYPE","terminate"),Ks(o,y),u=new In(o,o.j,u),u.L=2,u.v=Rr(je(y)),y=!1,l.navigator&&l.navigator.sendBeacon)try{y=l.navigator.sendBeacon(u.v.toString(),"")}catch{}!y&&l.Image&&(new Image().src=u.v,y=!0),y||(u.g=Vc(u.j,null),u.g.ea(u.v)),u.F=Date.now(),ft(u)}kc(o)}function Lr(o){o.g&&(ia(o),o.g.cancel(),o.g=null)}function Dc(o){Lr(o),o.u&&(l.clearTimeout(o.u),o.u=null),Nr(o),o.h.cancel(),o.s&&(typeof o.s=="number"&&l.clearTimeout(o.s),o.s=null)}function Ur(o){if(!de(o.h)&&!o.s){o.s=!0;var u=o.Ga;nt||vt(),$||(nt(),$=!0),ut.add(u,o),o.B=0}}function Rd(o,u){return Be(o.h)>=o.h.j-(o.s?1:0)?!1:o.s?(o.i=u.D.concat(o.i),!0):o.G==1||o.G==2||o.B>=(o.Va?0:o.Wa)?!1:(o.s=si(m(o.Ga,o,u),Bc(o,o.B)),o.B++,!0)}i.Ga=function(o){if(this.s)if(this.s=null,this.G==1){if(!o){this.U=Math.floor(1e5*Math.random()),o=this.U++;const V=new In(this,this.j,o);let q=this.o;if(this.S&&(q?(q=M(q),_(q,this.S)):q=this.S),this.m!==null||this.O||(V.H=q,q=null),this.P)t:{for(var u=0,y=0;y<this.i.length;y++){e:{var R=this.i[y];if("__data__"in R.map&&(R=R.map.__data__,typeof R=="string")){R=R.length;break e}R=void 0}if(R===void 0)break;if(u+=R,4096<u){u=y;break t}if(u===4096||y===this.i.length-1){u=y+1;break t}}u=1e3}else u=1e3;u=Uc(this,V,u),y=je(this.I),pe(y,"RID",o),pe(y,"CVER",22),this.D&&pe(y,"X-HTTP-Session-Id",this.D),Ks(this,y),q&&(this.O?u="headers="+encodeURIComponent(String(wc(q)))+"&"+u:this.m&&ta(y,this.m,q)),wt(this.h,V),this.Ua&&pe(y,"TYPE","init"),this.P?(pe(y,"$req",u),pe(y,"SID","null"),V.T=!0,W(V,y,null)):W(V,y,u),this.G=2}}else this.G==3&&(o?Lc(this,o):this.i.length==0||de(this.h)||Lc(this))};function Lc(o,u){var y;u?y=u.l:y=o.U++;const R=je(o.I);pe(R,"SID",o.K),pe(R,"RID",y),pe(R,"AID",o.T),Ks(o,R),o.m&&o.o&&ta(R,o.m,o.o),y=new In(o,o.j,y,o.B+1),o.m===null&&(y.H=o.o),u&&(o.i=u.D.concat(o.i)),u=Uc(o,y,1e3),y.I=Math.round(.5*o.wa)+Math.round(.5*o.wa*Math.random()),wt(o.h,y),W(y,R,u)}function Ks(o,u){o.H&&O(o.H,function(y,R){pe(u,R,y)}),o.l&&He({},function(y,R){pe(u,R,y)})}function Uc(o,u,y){y=Math.min(o.i.length,y);var R=o.l?m(o.l.Na,o.l,o):null;t:{var V=o.i;let q=-1;for(;;){const at=["count="+y];q==-1?0<y?(q=V[0].g,at.push("ofs="+q)):q=0:at.push("ofs="+q);let ye=!0;for(let ze=0;ze<y;ze++){let ie=V[ze].g;const Ge=V[ze].map;if(ie-=q,0>ie)q=Math.max(0,V[ze].g-100),ye=!1;else try{wd(Ge,at,"req"+ie+"_")}catch{R&&R(Ge)}}if(ye){R=at.join("&");break t}}}return o=o.i.splice(0,y),u.D=o,R}function Nc(o){if(!o.g&&!o.u){o.Y=1;var u=o.Fa;nt||vt(),$||(nt(),$=!0),ut.add(u,o),o.v=0}}function na(o){return o.g||o.u||3<=o.v?!1:(o.Y++,o.u=si(m(o.Fa,o),Bc(o,o.v)),o.v++,!0)}i.Fa=function(){if(this.u=null,Oc(this),this.ba&&!(this.M||this.g==null||0>=this.R)){var o=2*this.R;this.j.info("BP detection timer enabled: "+o),this.A=si(m(this.ab,this),o)}},i.ab=function(){this.A&&(this.A=null,this.j.info("BP detection timeout reached."),this.j.info("Buffering proxy detected and switch to long-polling!"),this.F=!1,this.M=!0,Ee(10),Lr(this),Oc(this))};function ia(o){o.A!=null&&(l.clearTimeout(o.A),o.A=null)}function Oc(o){o.g=new In(o,o.j,"rpc",o.Y),o.m===null&&(o.g.H=o.o),o.g.O=0;var u=je(o.qa);pe(u,"RID","rpc"),pe(u,"SID",o.K),pe(u,"AID",o.T),pe(u,"CI",o.F?"0":"1"),!o.F&&o.ja&&pe(u,"TO",o.ja),pe(u,"TYPE","xmlhttp"),Ks(o,u),o.m&&o.o&&ta(u,o.m,o.o),o.L&&(o.g.I=o.L);var y=o.g;o=o.ia,y.L=1,y.v=Rr(je(u)),y.m=null,y.P=!0,X(y,o)}i.Za=function(){this.C!=null&&(this.C=null,Lr(this),na(this),Ee(19))};function Nr(o){o.C!=null&&(l.clearTimeout(o.C),o.C=null)}function Fc(o,u){var y=null;if(o.g==u){Nr(o),ia(o),o.g=null;var R=2}else if(Qt(o.h,u))y=u.D,hn(o.h,u),R=1;else return;if(o.G!=0){if(u.o)if(R==1){y=u.m?u.m.length:0,u=Date.now()-u.F;var V=o.B;R=Me(),gt(R,new Hs(R,y)),Ur(o)}else Nc(o);else if(V=u.s,V==3||V==0&&0<u.X||!(R==1&&Rd(o,u)||R==2&&na(o)))switch(y&&0<y.length&&(u=o.h,u.i=u.i.concat(y)),V){case 1:Ai(o,5);break;case 4:Ai(o,10);break;case 3:Ai(o,6);break;default:Ai(o,2)}}}function Bc(o,u){let y=o.Ta+Math.floor(Math.random()*o.cb);return o.isActive()||(y*=2),y*u}function Ai(o,u){if(o.j.info("Error code "+u),u==2){var y=m(o.fb,o),R=o.Xa;const V=!R;R=new Ue(R||"//www.google.com/images/cleardot.gif"),l.location&&l.location.protocol=="http"||ke(R,"https"),Rr(R),V?Sd(R.toString(),y):Ed(R.toString(),y)}else Ee(2);o.G=0,o.l&&o.l.sa(u),kc(o),Dc(o)}i.fb=function(o){o?(this.j.info("Successfully pinged google.com"),Ee(2)):(this.j.info("Failed to ping google.com"),Ee(1))};function kc(o){if(o.G=0,o.ka=[],o.l){const u=ne(o.h);(u.length!=0||o.i.length!=0)&&(v(o.ka,u),v(o.ka,o.i),o.h.i.length=0,w(o.i),o.i.length=0),o.l.ra()}}function zc(o,u,y){var R=y instanceof Ue?je(y):new Ue(y);if(R.g!="")u&&(R.g=u+"."+R.g),sn(R,R.s);else{var V=l.location;R=V.protocol,u=u?u+"."+V.hostname:V.hostname,V=+V.port;var q=new Ue(null);R&&ke(q,R),u&&(q.g=u),V&&sn(q,V),y&&(q.l=y),R=q}return y=o.D,u=o.ya,y&&u&&pe(R,y,u),pe(R,"VER",o.la),Ks(o,R),R}function Vc(o,u,y){if(u&&!o.J)throw Error("Can't create secondary domain capable XhrIo object.");return u=o.Ca&&!o.pa?new we(new Pr({eb:y})):new we(o.pa),u.Ha(o.J),u}i.isActive=function(){return!!this.l&&this.l.isActive(this)};function Hc(){}i=Hc.prototype,i.ua=function(){},i.ta=function(){},i.sa=function(){},i.ra=function(){},i.isActive=function(){return!0},i.Na=function(){};function un(o,u){Y.call(this),this.g=new Ic(u),this.l=o,this.h=u&&u.messageUrlParams||null,o=u&&u.messageHeaders||null,u&&u.clientProtocolHeaderRequired&&(o?o["X-Client-Protocol"]="webchannel":o={"X-Client-Protocol":"webchannel"}),this.g.o=o,o=u&&u.initMessageHeaders||null,u&&u.messageContentType&&(o?o["X-WebChannel-Content-Type"]=u.messageContentType:o={"X-WebChannel-Content-Type":u.messageContentType}),u&&u.va&&(o?o["X-WebChannel-Client-Profile"]=u.va:o={"X-WebChannel-Client-Profile":u.va}),this.g.S=o,(o=u&&u.Sb)&&!U(o)&&(this.g.m=o),this.v=u&&u.supportsCrossDomainXhr||!1,this.u=u&&u.sendRawJson||!1,(u=u&&u.httpSessionIdParam)&&!U(u)&&(this.g.D=u,o=this.h,o!==null&&u in o&&(o=this.h,u in o&&delete o[u])),this.j=new Zi(this)}S(un,Y),un.prototype.m=function(){this.g.l=this.j,this.v&&(this.g.J=!0),this.g.connect(this.l,this.h||void 0)},un.prototype.close=function(){ea(this.g)},un.prototype.o=function(o){var u=this.g;if(typeof o=="string"){var y={};y.__data__=o,o=y}else this.u&&(y={},y.__data__=xt(o),o=y);u.i.push(new Zt(u.Ya++,o)),u.G==3&&Ur(u)},un.prototype.N=function(){this.g.l=null,delete this.j,ea(this.g),delete this.g,un.aa.N.call(this)};function Gc(o){et.call(this),o.__headers__&&(this.headers=o.__headers__,this.statusCode=o.__status__,delete o.__headers__,delete o.__status__);var u=o.__sm__;if(u){t:{for(const y in u){o=y;break t}o=void 0}(this.i=o)&&(o=this.i,u=u!==null&&o in u?u[o]:void 0),this.data=u}else this.data=o}S(Gc,et);function Wc(){mt.call(this),this.status=1}S(Wc,mt);function Zi(o){this.g=o}S(Zi,Hc),Zi.prototype.ua=function(){gt(this.g,"a")},Zi.prototype.ta=function(o){gt(this.g,new Gc(o))},Zi.prototype.sa=function(o){gt(this.g,new Wc)},Zi.prototype.ra=function(){gt(this.g,"b")},un.prototype.send=un.prototype.o,un.prototype.open=un.prototype.m,un.prototype.close=un.prototype.close,ri.NO_ERROR=0,ri.TIMEOUT=8,ri.HTTP_ERROR=6,Ar.COMPLETE="complete",pt.EventType=j,j.OPEN="a",j.CLOSE="b",j.ERROR="c",j.MESSAGE="d",Y.prototype.listen=Y.prototype.K,we.prototype.listenOnce=we.prototype.L,we.prototype.getLastError=we.prototype.Ka,we.prototype.getLastErrorCode=we.prototype.Ba,we.prototype.getStatus=we.prototype.Z,we.prototype.getResponseJson=we.prototype.Oa,we.prototype.getResponseText=we.prototype.oa,we.prototype.send=we.prototype.ea,we.prototype.setWithCredentials=we.prototype.Ha}).apply(typeof kr<"u"?kr:typeof self<"u"?self:typeof window<"u"?window:{});const dh="@firebase/firestore",ph="4.8.0";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ln{constructor(t){this.uid=t}isAuthenticated(){return this.uid!=null}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(t){return t.uid===this.uid}}ln.UNAUTHENTICATED=new ln(null),ln.GOOGLE_CREDENTIALS=new ln("google-credentials-uid"),ln.FIRST_PARTY=new ln("first-party-uid"),ln.MOCK_USER=new ln("mock-user");/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Wo="11.10.0";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Lo=new ql("@firebase/firestore");function Tn(i,...t){if(Lo.logLevel<=he.DEBUG){const e=t.map(wf);Lo.debug(`Firestore (${Wo}): ${i}`,...e)}}function Tf(i,...t){if(Lo.logLevel<=he.ERROR){const e=t.map(wf);Lo.error(`Firestore (${Wo}): ${i}`,...e)}}function wf(i){if(typeof i=="string")return i;try{/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/return(function(e){return JSON.stringify(e)})(i)}catch{return i}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Uo(i,t,e){let n="Unexpected state";typeof t=="string"?n=t:e=t,bf(i,n,e)}function bf(i,t,e){let n=`FIRESTORE (${Wo}) INTERNAL ASSERTION FAILED: ${t} (ID: ${i.toString(16)})`;if(e!==void 0)try{n+=" CONTEXT: "+JSON.stringify(e)}catch{n+=" CONTEXT: "+e}throw Tf(n),new Error(n)}function ur(i,t,e,n){let s="Unexpected state";typeof e=="string"?s=e:n=e,i||bf(t,s,n)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const re={CANCELLED:"cancelled",INVALID_ARGUMENT:"invalid-argument",FAILED_PRECONDITION:"failed-precondition"};class oe extends Ti{constructor(t,e){super(t,e),this.code=t,this.message=e,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fr{constructor(){this.promise=new Promise(((t,e)=>{this.resolve=t,this.reject=e}))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Wm{constructor(t,e){this.user=e,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${t}`)}}class Xm{getToken(){return Promise.resolve(null)}invalidateToken(){}start(t,e){t.enqueueRetryable((()=>e(ln.UNAUTHENTICATED)))}shutdown(){}}class qm{constructor(t){this.t=t,this.currentUser=ln.UNAUTHENTICATED,this.i=0,this.forceRefresh=!1,this.auth=null}start(t,e){ur(this.o===void 0,42304);let n=this.i;const s=c=>this.i!==n?(n=this.i,e(c)):Promise.resolve();let r=new fr;this.o=()=>{this.i++,this.currentUser=this.u(),r.resolve(),r=new fr,t.enqueueRetryable((()=>s(this.currentUser)))};const a=()=>{const c=r;t.enqueueRetryable((async()=>{await c.promise,await s(this.currentUser)}))},l=c=>{Tn("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=c,this.o&&(this.auth.addAuthTokenListener(this.o),a())};this.t.onInit((c=>l(c))),setTimeout((()=>{if(!this.auth){const c=this.t.getImmediate({optional:!0});c?l(c):(Tn("FirebaseAuthCredentialsProvider","Auth not yet detected"),r.resolve(),r=new fr)}}),0),a()}getToken(){const t=this.i,e=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(e).then((n=>this.i!==t?(Tn("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):n?(ur(typeof n.accessToken=="string",31837,{l:n}),new Wm(n.accessToken,this.currentUser)):null)):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.o&&this.auth.removeAuthTokenListener(this.o),this.o=void 0}u(){const t=this.auth&&this.auth.getUid();return ur(t===null||typeof t=="string",2055,{h:t}),new ln(t)}}class jm{constructor(t,e,n){this.P=t,this.T=e,this.I=n,this.type="FirstParty",this.user=ln.FIRST_PARTY,this.A=new Map}R(){return this.I?this.I():null}get headers(){this.A.set("X-Goog-AuthUser",this.P);const t=this.R();return t&&this.A.set("Authorization",t),this.T&&this.A.set("X-Goog-Iam-Authorization-Token",this.T),this.A}}class $m{constructor(t,e,n){this.P=t,this.T=e,this.I=n}getToken(){return Promise.resolve(new jm(this.P,this.T,this.I))}start(t,e){t.enqueueRetryable((()=>e(ln.FIRST_PARTY)))}shutdown(){}invalidateToken(){}}class mh{constructor(t){this.value=t,this.type="AppCheck",this.headers=new Map,t&&t.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class Ym{constructor(t,e){this.V=e,this.forceRefresh=!1,this.appCheck=null,this.m=null,this.p=null,Oi(t)&&t.settings.appCheckToken&&(this.p=t.settings.appCheckToken)}start(t,e){ur(this.o===void 0,3512);const n=r=>{r.error!=null&&Tn("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${r.error.message}`);const a=r.token!==this.m;return this.m=r.token,Tn("FirebaseAppCheckTokenProvider",`Received ${a?"new":"existing"} token.`),a?e(r.token):Promise.resolve()};this.o=r=>{t.enqueueRetryable((()=>n(r)))};const s=r=>{Tn("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=r,this.o&&this.appCheck.addTokenListener(this.o)};this.V.onInit((r=>s(r))),setTimeout((()=>{if(!this.appCheck){const r=this.V.getImmediate({optional:!0});r?s(r):Tn("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}}),0)}getToken(){if(this.p)return Promise.resolve(new mh(this.p));const t=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(t).then((e=>e?(ur(typeof e.token=="string",44558,{tokenResult:e}),this.m=e.token,new mh(e.token)):null)):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.o&&this.appCheck.removeTokenListener(this.o),this.o=void 0}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Km(i){const t=typeof self<"u"&&(self.crypto||self.msCrypto),e=new Uint8Array(i);if(t&&typeof t.getRandomValues=="function")t.getRandomValues(e);else for(let n=0;n<i;n++)e[n]=Math.floor(256*Math.random());return e}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Jm(){return new TextEncoder}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Zm{static newId(){const t="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",e=62*Math.floor(4.129032258064516);let n="";for(;n.length<20;){const s=Km(40);for(let r=0;r<s.length;++r)n.length<20&&s[r]<e&&(n+=t.charAt(s[r]%62))}return n}}function bn(i,t){return i<t?-1:i>t?1:0}function Qm(i,t){let e=0;for(;e<i.length&&e<t.length;){const n=i.codePointAt(e),s=t.codePointAt(e);if(n!==s){if(n<128&&s<128)return bn(n,s);{const r=Jm(),a=tg(r.encode(gh(i,e)),r.encode(gh(t,e)));return a!==0?a:bn(n,s)}}e+=n>65535?2:1}return bn(i.length,t.length)}function gh(i,t){return i.codePointAt(t)>65535?i.substring(t,t+2):i.substring(t,t+1)}function tg(i,t){for(let e=0;e<i.length&&e<t.length;++e)if(i[e]!==t[e])return bn(i[e],t[e]);return bn(i.length,t.length)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const _h="__name__";class Dn{constructor(t,e,n){e===void 0?e=0:e>t.length&&Uo(637,{offset:e,range:t.length}),n===void 0?n=t.length-e:n>t.length-e&&Uo(1746,{length:n,range:t.length-e}),this.segments=t,this.offset=e,this.len=n}get length(){return this.len}isEqual(t){return Dn.comparator(this,t)===0}child(t){const e=this.segments.slice(this.offset,this.limit());return t instanceof Dn?t.forEach((n=>{e.push(n)})):e.push(t),this.construct(e)}limit(){return this.offset+this.length}popFirst(t){return t=t===void 0?1:t,this.construct(this.segments,this.offset+t,this.length-t)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(t){return this.segments[this.offset+t]}isEmpty(){return this.length===0}isPrefixOf(t){if(t.length<this.length)return!1;for(let e=0;e<this.length;e++)if(this.get(e)!==t.get(e))return!1;return!0}isImmediateParentOf(t){if(this.length+1!==t.length)return!1;for(let e=0;e<this.length;e++)if(this.get(e)!==t.get(e))return!1;return!0}forEach(t){for(let e=this.offset,n=this.limit();e<n;e++)t(this.segments[e])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(t,e){const n=Math.min(t.length,e.length);for(let s=0;s<n;s++){const r=Dn.compareSegments(t.get(s),e.get(s));if(r!==0)return r}return bn(t.length,e.length)}static compareSegments(t,e){const n=Dn.isNumericId(t),s=Dn.isNumericId(e);return n&&!s?-1:!n&&s?1:n&&s?Dn.extractNumericId(t).compare(Dn.extractNumericId(e)):Qm(t,e)}static isNumericId(t){return t.startsWith("__id")&&t.endsWith("__")}static extractNumericId(t){return Kl.fromString(t.substring(4,t.length-2))}}class En extends Dn{construct(t,e,n){return new En(t,e,n)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...t){const e=[];for(const n of t){if(n.indexOf("//")>=0)throw new oe(re.INVALID_ARGUMENT,`Invalid segment (${n}). Paths must not contain // in them.`);e.push(...n.split("/").filter((s=>s.length>0)))}return new En(e)}static emptyPath(){return new En([])}}const eg=/^[_a-zA-Z][_a-zA-Z0-9]*$/;class Fi extends Dn{construct(t,e,n){return new Fi(t,e,n)}static isValidIdentifier(t){return eg.test(t)}canonicalString(){return this.toArray().map((t=>(t=t.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),Fi.isValidIdentifier(t)||(t="`"+t+"`"),t))).join(".")}toString(){return this.canonicalString()}isKeyField(){return this.length===1&&this.get(0)===_h}static keyField(){return new Fi([_h])}static fromServerFormat(t){const e=[];let n="",s=0;const r=()=>{if(n.length===0)throw new oe(re.INVALID_ARGUMENT,`Invalid field path (${t}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);e.push(n),n=""};let a=!1;for(;s<t.length;){const l=t[s];if(l==="\\"){if(s+1===t.length)throw new oe(re.INVALID_ARGUMENT,"Path has trailing escape character: "+t);const c=t[s+1];if(c!=="\\"&&c!=="."&&c!=="`")throw new oe(re.INVALID_ARGUMENT,"Path has invalid escape sequence: "+t);n+=c,s+=2}else l==="`"?(a=!a,s++):l!=="."||a?(n+=l,s++):(r(),s++)}if(r(),a)throw new oe(re.INVALID_ARGUMENT,"Unterminated ` in path: "+t);return new Fi(e)}static emptyPath(){return new Fi([])}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Vi{constructor(t){this.path=t}static fromPath(t){return new Vi(En.fromString(t))}static fromName(t){return new Vi(En.fromString(t).popFirst(5))}static empty(){return new Vi(En.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(t){return this.path.length>=2&&this.path.get(this.path.length-2)===t}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(t){return t!==null&&En.comparator(this.path,t.path)===0}toString(){return this.path.toString()}static comparator(t,e){return En.comparator(t.path,e.path)}static isDocumentKey(t){return t.length%2==0}static fromSegments(t){return new Vi(new En(t.slice()))}}function ng(i,t,e,n){if(t===!0&&n===!0)throw new oe(re.INVALID_ARGUMENT,`${i} and ${e} cannot be used together.`)}function ig(i){return typeof i=="object"&&i!==null&&(Object.getPrototypeOf(i)===Object.prototype||Object.getPrototypeOf(i)===null)}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ce(i,t){const e={typeString:i};return t&&(e.value=t),e}function yr(i,t){if(!ig(i))throw new oe(re.INVALID_ARGUMENT,"JSON must be an object");let e;for(const n in t)if(t[n]){const s=t[n].typeString,r="value"in t[n]?{value:t[n].value}:void 0;if(!(n in i)){e=`JSON missing required field: '${n}'`;break}const a=i[n];if(s&&typeof a!==s){e=`JSON field '${n}' must be a ${s}.`;break}if(r!==void 0&&a!==r.value){e=`Expected '${n}' field to equal '${r.value}'`;break}}if(e)throw new oe(re.INVALID_ARGUMENT,e);return!0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const vh=-62135596800,yh=1e6;class Ln{static now(){return Ln.fromMillis(Date.now())}static fromDate(t){return Ln.fromMillis(t.getTime())}static fromMillis(t){const e=Math.floor(t/1e3),n=Math.floor((t-1e3*e)*yh);return new Ln(e,n)}constructor(t,e){if(this.seconds=t,this.nanoseconds=e,e<0)throw new oe(re.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+e);if(e>=1e9)throw new oe(re.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+e);if(t<vh)throw new oe(re.INVALID_ARGUMENT,"Timestamp seconds out of range: "+t);if(t>=253402300800)throw new oe(re.INVALID_ARGUMENT,"Timestamp seconds out of range: "+t)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/yh}_compareTo(t){return this.seconds===t.seconds?bn(this.nanoseconds,t.nanoseconds):bn(this.seconds,t.seconds)}isEqual(t){return t.seconds===this.seconds&&t.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{type:Ln._jsonSchemaVersion,seconds:this.seconds,nanoseconds:this.nanoseconds}}static fromJSON(t){if(yr(t,Ln._jsonSchema))return new Ln(t.seconds,t.nanoseconds)}valueOf(){const t=this.seconds-vh;return String(t).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}Ln._jsonSchemaVersion="firestore/timestamp/1.0",Ln._jsonSchema={type:Ce("string",Ln._jsonSchemaVersion),seconds:Ce("number"),nanoseconds:Ce("number")};function sg(i){return i.name==="IndexedDbTransactionError"}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rg extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qi{constructor(t){this.binaryString=t}static fromBase64String(t){const e=(function(s){try{return atob(s)}catch(r){throw typeof DOMException<"u"&&r instanceof DOMException?new rg("Invalid base64 string: "+r):r}})(t);return new qi(e)}static fromUint8Array(t){const e=(function(s){let r="";for(let a=0;a<s.length;++a)r+=String.fromCharCode(s[a]);return r})(t);return new qi(e)}[Symbol.iterator](){let t=0;return{next:()=>t<this.binaryString.length?{value:this.binaryString.charCodeAt(t++),done:!1}:{value:void 0,done:!0}}}toBase64(){return(function(e){return btoa(e)})(this.binaryString)}toUint8Array(){return(function(e){const n=new Uint8Array(e.length);for(let s=0;s<e.length;s++)n[s]=e.charCodeAt(s);return n})(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(t){return bn(this.binaryString,t.binaryString)}isEqual(t){return this.binaryString===t.binaryString}}qi.EMPTY_BYTE_STRING=new qi("");const xh="(default)";class No{constructor(t,e){this.projectId=t,this.database=e||xh}static empty(){return new No("","")}get isDefaultDatabase(){return this.database===xh}isEqual(t){return t instanceof No&&t.projectId===this.projectId&&t.database===this.database}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class og{constructor(t,e=null,n=[],s=[],r=null,a="F",l=null,c=null){this.path=t,this.collectionGroup=e,this.explicitOrderBy=n,this.filters=s,this.limit=r,this.limitType=a,this.startAt=l,this.endAt=c,this.Te=null,this.Ie=null,this.de=null,this.startAt,this.endAt}}function ag(i){return new og(i)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Mh,te;(te=Mh||(Mh={}))[te.OK=0]="OK",te[te.CANCELLED=1]="CANCELLED",te[te.UNKNOWN=2]="UNKNOWN",te[te.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",te[te.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",te[te.NOT_FOUND=5]="NOT_FOUND",te[te.ALREADY_EXISTS=6]="ALREADY_EXISTS",te[te.PERMISSION_DENIED=7]="PERMISSION_DENIED",te[te.UNAUTHENTICATED=16]="UNAUTHENTICATED",te[te.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",te[te.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",te[te.ABORTED=10]="ABORTED",te[te.OUT_OF_RANGE=11]="OUT_OF_RANGE",te[te.UNIMPLEMENTED=12]="UNIMPLEMENTED",te[te.INTERNAL=13]="INTERNAL",te[te.UNAVAILABLE=14]="UNAVAILABLE",te[te.DATA_LOSS=15]="DATA_LOSS";/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */new Kl([4294967295,4294967295],0);/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const lg=41943040;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const cg=1048576;function da(){return typeof document<"u"?document:null}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class hg{constructor(t,e,n=1e3,s=1.5,r=6e4){this.Fi=t,this.timerId=e,this.d_=n,this.E_=s,this.A_=r,this.R_=0,this.V_=null,this.m_=Date.now(),this.reset()}reset(){this.R_=0}f_(){this.R_=this.A_}g_(t){this.cancel();const e=Math.floor(this.R_+this.p_()),n=Math.max(0,Date.now()-this.m_),s=Math.max(0,e-n);s>0&&Tn("ExponentialBackoff",`Backing off for ${s} ms (base delay: ${this.R_} ms, delay with jitter: ${e} ms, last attempt: ${n} ms ago)`),this.V_=this.Fi.enqueueAfterDelay(this.timerId,s,(()=>(this.m_=Date.now(),t()))),this.R_*=this.E_,this.R_<this.d_&&(this.R_=this.d_),this.R_>this.A_&&(this.R_=this.A_)}y_(){this.V_!==null&&(this.V_.skipDelay(),this.V_=null)}cancel(){this.V_!==null&&(this.V_.cancel(),this.V_=null)}p_(){return(Math.random()-.5)*this.R_}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Jl{constructor(t,e,n,s,r){this.asyncQueue=t,this.timerId=e,this.targetTimeMs=n,this.op=s,this.removalCallback=r,this.deferred=new fr,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch((a=>{}))}get promise(){return this.deferred.promise}static createAndSchedule(t,e,n,s,r){const a=Date.now()+n,l=new Jl(t,e,a,s,r);return l.start(n),l}start(t){this.timerHandle=setTimeout((()=>this.handleDelayElapsed()),t)}skipDelay(){return this.handleDelayElapsed()}cancel(t){this.timerHandle!==null&&(this.clearTimeout(),this.deferred.reject(new oe(re.CANCELLED,"Operation cancelled"+(t?": "+t:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget((()=>this.timerHandle!==null?(this.clearTimeout(),this.op().then((t=>this.deferred.resolve(t)))):Promise.resolve()))}clearTimeout(){this.timerHandle!==null&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}}var Sh,Eh;(Eh=Sh||(Sh={})).Fa="default",Eh.Cache="cache";/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ug(i){const t={};return i.timeoutSeconds!==void 0&&(t.timeoutSeconds=i.timeoutSeconds),t}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Th=new Map;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const fg="firestore.googleapis.com",wh=!0;class bh{constructor(t){var e,n;if(t.host===void 0){if(t.ssl!==void 0)throw new oe(re.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host=fg,this.ssl=wh}else this.host=t.host,this.ssl=(e=t.ssl)!==null&&e!==void 0?e:wh;if(this.isUsingEmulator=t.emulatorOptions!==void 0,this.credentials=t.credentials,this.ignoreUndefinedProperties=!!t.ignoreUndefinedProperties,this.localCache=t.localCache,t.cacheSizeBytes===void 0)this.cacheSizeBytes=lg;else{if(t.cacheSizeBytes!==-1&&t.cacheSizeBytes<cg)throw new oe(re.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=t.cacheSizeBytes}ng("experimentalForceLongPolling",t.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",t.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!t.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:t.experimentalAutoDetectLongPolling===void 0?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!t.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=ug((n=t.experimentalLongPollingOptions)!==null&&n!==void 0?n:{}),(function(r){if(r.timeoutSeconds!==void 0){if(isNaN(r.timeoutSeconds))throw new oe(re.INVALID_ARGUMENT,`invalid long polling timeout: ${r.timeoutSeconds} (must not be NaN)`);if(r.timeoutSeconds<5)throw new oe(re.INVALID_ARGUMENT,`invalid long polling timeout: ${r.timeoutSeconds} (minimum allowed value is 5)`);if(r.timeoutSeconds>30)throw new oe(re.INVALID_ARGUMENT,`invalid long polling timeout: ${r.timeoutSeconds} (maximum allowed value is 30)`)}})(this.experimentalLongPollingOptions),this.useFetchStreams=!!t.useFetchStreams}isEqual(t){return this.host===t.host&&this.ssl===t.ssl&&this.credentials===t.credentials&&this.cacheSizeBytes===t.cacheSizeBytes&&this.experimentalForceLongPolling===t.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===t.experimentalAutoDetectLongPolling&&(function(n,s){return n.timeoutSeconds===s.timeoutSeconds})(this.experimentalLongPollingOptions,t.experimentalLongPollingOptions)&&this.ignoreUndefinedProperties===t.ignoreUndefinedProperties&&this.useFetchStreams===t.useFetchStreams}}class dg{constructor(t,e,n,s){this._authCredentials=t,this._appCheckCredentials=e,this._databaseId=n,this._app=s,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new bh({}),this._settingsFrozen=!1,this._emulatorOptions={},this._terminateTask="notTerminated"}get app(){if(!this._app)throw new oe(re.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return this._terminateTask!=="notTerminated"}_setSettings(t){if(this._settingsFrozen)throw new oe(re.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new bh(t),this._emulatorOptions=t.emulatorOptions||{},t.credentials!==void 0&&(this._authCredentials=(function(n){if(!n)return new Xm;switch(n.type){case"firstParty":return new $m(n.sessionIndex||"0",n.iamToken||null,n.authTokenFactory||null);case"provider":return n.client;default:throw new oe(re.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}})(t.credentials))}_getSettings(){return this._settings}_getEmulatorOptions(){return this._emulatorOptions}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask==="notTerminated"&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){this._terminateTask==="notTerminated"?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return(function(e){const n=Th.get(e);n&&(Tn("ComponentProvider","Removing Datastore"),Th.delete(e),n.terminate())})(this),Promise.resolve()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Zl{constructor(t,e,n){this.converter=e,this._query=n,this.type="query",this.firestore=t}withConverter(t){return new Zl(this.firestore,t,this._query)}}class Fn{constructor(t,e,n){this.converter=e,this._key=n,this.type="document",this.firestore=t}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new Ql(this.firestore,this.converter,this._key.path.popLast())}withConverter(t){return new Fn(this.firestore,t,this._key)}toJSON(){return{type:Fn._jsonSchemaVersion,referencePath:this._key.toString()}}static fromJSON(t,e,n){if(yr(e,Fn._jsonSchema))return new Fn(t,n||null,new Vi(En.fromString(e.referencePath)))}}Fn._jsonSchemaVersion="firestore/documentReference/1.0",Fn._jsonSchema={type:Ce("string",Fn._jsonSchemaVersion),referencePath:Ce("string")};class Ql extends Zl{constructor(t,e,n){super(t,e,ag(n)),this._path=n,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){const t=this._path.popLast();return t.isEmpty()?null:new Fn(this.firestore,null,new Vi(t))}withConverter(t){return new Ql(this.firestore,t,this._path)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ah="AsyncQueue";class Ch{constructor(t=Promise.resolve()){this.Zu=[],this.Xu=!1,this.ec=[],this.tc=null,this.nc=!1,this.rc=!1,this.sc=[],this.F_=new hg(this,"async_queue_retry"),this.oc=()=>{const n=da();n&&Tn(Ah,"Visibility state changed to "+n.visibilityState),this.F_.y_()},this._c=t;const e=da();e&&typeof e.addEventListener=="function"&&e.addEventListener("visibilitychange",this.oc)}get isShuttingDown(){return this.Xu}enqueueAndForget(t){this.enqueue(t)}enqueueAndForgetEvenWhileRestricted(t){this.ac(),this.uc(t)}enterRestrictedMode(t){if(!this.Xu){this.Xu=!0,this.rc=t||!1;const e=da();e&&typeof e.removeEventListener=="function"&&e.removeEventListener("visibilitychange",this.oc)}}enqueue(t){if(this.ac(),this.Xu)return new Promise((()=>{}));const e=new fr;return this.uc((()=>this.Xu&&this.rc?Promise.resolve():(t().then(e.resolve,e.reject),e.promise))).then((()=>e.promise))}enqueueRetryable(t){this.enqueueAndForget((()=>(this.Zu.push(t),this.cc())))}async cc(){if(this.Zu.length!==0){try{await this.Zu[0](),this.Zu.shift(),this.F_.reset()}catch(t){if(!sg(t))throw t;Tn(Ah,"Operation failed with retryable error: "+t)}this.Zu.length>0&&this.F_.g_((()=>this.cc()))}}uc(t){const e=this._c.then((()=>(this.nc=!0,t().catch((n=>{throw this.tc=n,this.nc=!1,Tf("INTERNAL UNHANDLED ERROR: ",Rh(n)),n})).then((n=>(this.nc=!1,n))))));return this._c=e,e}enqueueAfterDelay(t,e,n){this.ac(),this.sc.indexOf(t)>-1&&(e=0);const s=Jl.createAndSchedule(this,t,e,n,(r=>this.lc(r)));return this.ec.push(s),s}ac(){this.tc&&Uo(47125,{hc:Rh(this.tc)})}verifyOperationInProgress(){}async Pc(){let t;do t=this._c,await t;while(t!==this._c)}Tc(t){for(const e of this.ec)if(e.timerId===t)return!0;return!1}Ic(t){return this.Pc().then((()=>{this.ec.sort(((e,n)=>e.targetTimeMs-n.targetTimeMs));for(const e of this.ec)if(e.skipDelay(),t!=="all"&&e.timerId===t)break;return this.Pc()}))}dc(t){this.sc.push(t)}lc(t){const e=this.ec.indexOf(t);this.ec.splice(e,1)}}function Rh(i){let t=i.message||"";return i.stack&&(t=i.stack.includes(i.message)?i.stack:i.message+`
`+i.stack),t}class pg extends dg{constructor(t,e,n,s){super(t,e,n,s),this.type="firestore",this._queue=new Ch,this._persistenceKey=(s==null?void 0:s.name)||"[DEFAULT]"}async _terminate(){if(this._firestoreClient){const t=this._firestoreClient.terminate();this._queue=new Ch(t),this._firestoreClient=void 0,await t}}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Yn{constructor(t){this._byteString=t}static fromBase64String(t){try{return new Yn(qi.fromBase64String(t))}catch(e){throw new oe(re.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+e)}}static fromUint8Array(t){return new Yn(qi.fromUint8Array(t))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(t){return this._byteString.isEqual(t._byteString)}toJSON(){return{type:Yn._jsonSchemaVersion,bytes:this.toBase64()}}static fromJSON(t){if(yr(t,Yn._jsonSchema))return Yn.fromBase64String(t.bytes)}}Yn._jsonSchemaVersion="firestore/bytes/1.0",Yn._jsonSchema={type:Ce("string",Yn._jsonSchemaVersion),bytes:Ce("string")};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Af{constructor(...t){for(let e=0;e<t.length;++e)if(t[e].length===0)throw new oe(re.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new Fi(t)}isEqual(t){return this._internalPath.isEqual(t._internalPath)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Wi{constructor(t,e){if(!isFinite(t)||t<-90||t>90)throw new oe(re.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+t);if(!isFinite(e)||e<-180||e>180)throw new oe(re.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+e);this._lat=t,this._long=e}get latitude(){return this._lat}get longitude(){return this._long}isEqual(t){return this._lat===t._lat&&this._long===t._long}_compareTo(t){return bn(this._lat,t._lat)||bn(this._long,t._long)}toJSON(){return{latitude:this._lat,longitude:this._long,type:Wi._jsonSchemaVersion}}static fromJSON(t){if(yr(t,Wi._jsonSchema))return new Wi(t.latitude,t.longitude)}}Wi._jsonSchemaVersion="firestore/geoPoint/1.0",Wi._jsonSchema={type:Ce("string",Wi._jsonSchemaVersion),latitude:Ce("number"),longitude:Ce("number")};/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Xi{constructor(t){this._values=(t||[]).map((e=>e))}toArray(){return this._values.map((t=>t))}isEqual(t){return(function(n,s){if(n.length!==s.length)return!1;for(let r=0;r<n.length;++r)if(n[r]!==s[r])return!1;return!0})(this._values,t._values)}toJSON(){return{type:Xi._jsonSchemaVersion,vectorValues:this._values}}static fromJSON(t){if(yr(t,Xi._jsonSchema)){if(Array.isArray(t.vectorValues)&&t.vectorValues.every((e=>typeof e=="number")))return new Xi(t.vectorValues);throw new oe(re.INVALID_ARGUMENT,"Expected 'vectorValues' field to be a number array")}}}Xi._jsonSchemaVersion="firestore/vectorValue/1.0",Xi._jsonSchema={type:Ce("string",Xi._jsonSchemaVersion),vectorValues:Ce("object")};const mg=new RegExp("[~\\*/\\[\\]]");function gg(i,t,e){if(t.search(mg)>=0)throw Ph(`Invalid field path (${t}). Paths must not contain '~', '*', '/', '[', or ']'`,i);try{return new Af(...t.split("."))._internalPath}catch{throw Ph(`Invalid field path (${t}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,i)}}function Ph(i,t,e,n,s){let r=`Function ${t}() called with invalid data`;r+=". ";let a="";return new oe(re.INVALID_ARGUMENT,r+i+a)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Cf{constructor(t,e,n,s,r){this._firestore=t,this._userDataWriter=e,this._key=n,this._document=s,this._converter=r}get id(){return this._key.path.lastSegment()}get ref(){return new Fn(this._firestore,this._converter,this._key)}exists(){return this._document!==null}data(){if(this._document){if(this._converter){const t=new _g(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(t)}return this._userDataWriter.convertValue(this._document.data.value)}}get(t){if(this._document){const e=this._document.data.field(Rf("DocumentSnapshot.get",t));if(e!==null)return this._userDataWriter.convertValue(e)}}}class _g extends Cf{data(){return super.data()}}function Rf(i,t){return typeof t=="string"?gg(i,t):t instanceof Af?t._internalPath:t._delegate._internalPath}class zr{constructor(t,e){this.hasPendingWrites=t,this.fromCache=e}isEqual(t){return this.hasPendingWrites===t.hasPendingWrites&&this.fromCache===t.fromCache}}class Es extends Cf{constructor(t,e,n,s,r,a){super(t,e,n,s,a),this._firestore=t,this._firestoreImpl=t,this.metadata=r}exists(){return super.exists()}data(t={}){if(this._document){if(this._converter){const e=new So(this._firestore,this._userDataWriter,this._key,this._document,this.metadata,null);return this._converter.fromFirestore(e,t)}return this._userDataWriter.convertValue(this._document.data.value,t.serverTimestamps)}}get(t,e={}){if(this._document){const n=this._document.data.field(Rf("DocumentSnapshot.get",t));if(n!==null)return this._userDataWriter.convertValue(n,e.serverTimestamps)}}toJSON(){if(this.metadata.hasPendingWrites)throw new oe(re.FAILED_PRECONDITION,"DocumentSnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const t=this._document,e={};return e.type=Es._jsonSchemaVersion,e.bundle="",e.bundleSource="DocumentSnapshot",e.bundleName=this._key.toString(),!t||!t.isValidDocument()||!t.isFoundDocument()?e:(this._userDataWriter.convertObjectMap(t.data.value.mapValue.fields,"previous"),e.bundle=(this._firestore,this.ref.path,"NOT SUPPORTED"),e)}}Es._jsonSchemaVersion="firestore/documentSnapshot/1.0",Es._jsonSchema={type:Ce("string",Es._jsonSchemaVersion),bundleSource:Ce("string","DocumentSnapshot"),bundleName:Ce("string"),bundle:Ce("string")};class So extends Es{data(t={}){return super.data(t)}}class dr{constructor(t,e,n,s){this._firestore=t,this._userDataWriter=e,this._snapshot=s,this.metadata=new zr(s.hasPendingWrites,s.fromCache),this.query=n}get docs(){const t=[];return this.forEach((e=>t.push(e))),t}get size(){return this._snapshot.docs.size}get empty(){return this.size===0}forEach(t,e){this._snapshot.docs.forEach((n=>{t.call(e,new So(this._firestore,this._userDataWriter,n.key,n,new zr(this._snapshot.mutatedKeys.has(n.key),this._snapshot.fromCache),this.query.converter))}))}docChanges(t={}){const e=!!t.includeMetadataChanges;if(e&&this._snapshot.excludesMetadataChanges)throw new oe(re.INVALID_ARGUMENT,"To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");return this._cachedChanges&&this._cachedChangesIncludeMetadataChanges===e||(this._cachedChanges=(function(s,r){if(s._snapshot.oldDocs.isEmpty()){let a=0;return s._snapshot.docChanges.map((l=>{const c=new So(s._firestore,s._userDataWriter,l.doc.key,l.doc,new zr(s._snapshot.mutatedKeys.has(l.doc.key),s._snapshot.fromCache),s.query.converter);return l.doc,{type:"added",doc:c,oldIndex:-1,newIndex:a++}}))}{let a=s._snapshot.oldDocs;return s._snapshot.docChanges.filter((l=>r||l.type!==3)).map((l=>{const c=new So(s._firestore,s._userDataWriter,l.doc.key,l.doc,new zr(s._snapshot.mutatedKeys.has(l.doc.key),s._snapshot.fromCache),s.query.converter);let h=-1,d=-1;return l.type!==0&&(h=a.indexOf(l.doc.key),a=a.delete(l.doc.key)),l.type!==1&&(a=a.add(l.doc),d=a.indexOf(l.doc.key)),{type:vg(l.type),doc:c,oldIndex:h,newIndex:d}}))}})(this,e),this._cachedChangesIncludeMetadataChanges=e),this._cachedChanges}toJSON(){if(this.metadata.hasPendingWrites)throw new oe(re.FAILED_PRECONDITION,"QuerySnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const t={};t.type=dr._jsonSchemaVersion,t.bundleSource="QuerySnapshot",t.bundleName=Zm.newId(),this._firestore._databaseId.database,this._firestore._databaseId.projectId;const e=[],n=[],s=[];return this.docs.forEach((r=>{r._document!==null&&(e.push(r._document),n.push(this._userDataWriter.convertObjectMap(r._document.data.value.mapValue.fields,"previous")),s.push(r.ref.path))})),t.bundle=(this._firestore,this.query._query,t.bundleName,"NOT SUPPORTED"),t}}function vg(i){switch(i){case 0:return"added";case 2:case 3:return"modified";case 1:return"removed";default:return Uo(61501,{type:i})}}dr._jsonSchemaVersion="firestore/querySnapshot/1.0",dr._jsonSchema={type:Ce("string",dr._jsonSchemaVersion),bundleSource:Ce("string","QuerySnapshot"),bundleName:Ce("string"),bundle:Ce("string")};(function(t,e=!0){(function(s){Wo=s})(Ho),Cs(new As("firestore",((n,{instanceIdentifier:s,options:r})=>{const a=n.getProvider("app").getImmediate(),l=new pg(new qm(n.getProvider("auth-internal")),new Ym(a,n.getProvider("app-check-internal")),(function(h,d){if(!Object.prototype.hasOwnProperty.apply(h.options,["projectId"]))throw new oe(re.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new No(h.options.projectId,d)})(a,s),a);return r=Object.assign({useFetchStreams:e},r),l._setSettings(r),l}),"PUBLIC").setMultipleInstances(!0)),xi(dh,ph,t),xi(dh,ph,"esm2017")})();function yg(){return console.warn("Firebase not configured — running in offline-only mode"),{app:null,auth:null,db:null}}/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const tc="170",xg=0,Ih=1,Mg=2,Pf=1,If=2,$n=3,Ei=0,Ze=1,Je=2,Zn=0,Ts=1,_n=2,Dh=3,Lh=4,Sg=5,Bi=100,Eg=101,Tg=102,wg=103,bg=104,Ag=200,Cg=201,Rg=202,Pg=203,nl=204,il=205,Ig=206,Dg=207,Lg=208,Ug=209,Ng=210,Og=211,Fg=212,Bg=213,kg=214,sl=0,rl=1,ol=2,Rs=3,al=4,ll=5,cl=6,hl=7,Df=0,zg=1,Vg=2,Mi=0,Lf=1,Uf=2,Nf=3,ec=4,Hg=5,Of=6,Ff=7,Bf=300,Ps=301,Is=302,ul=303,fl=304,Xo=306,dl=1e3,Hi=1001,pl=1002,An=1003,Gg=1004,Vr=1005,mn=1006,pa=1007,Gi=1008,ni=1009,kf=1010,zf=1011,mr=1012,nc=1013,ji=1014,Kn=1015,Qn=1016,ic=1017,sc=1018,Ds=1020,Vf=35902,Hf=1021,Gf=1022,wn=1023,Wf=1024,Xf=1025,ws=1026,Ls=1027,qf=1028,rc=1029,jf=1030,oc=1031,ac=1033,Eo=33776,To=33777,wo=33778,bo=33779,ml=35840,gl=35841,_l=35842,vl=35843,yl=36196,xl=37492,Ml=37496,Sl=37808,El=37809,Tl=37810,wl=37811,bl=37812,Al=37813,Cl=37814,Rl=37815,Pl=37816,Il=37817,Dl=37818,Ll=37819,Ul=37820,Nl=37821,Ao=36492,Ol=36494,Fl=36495,$f=36283,Bl=36284,kl=36285,zl=36286,Wg=3200,Xg=3201,Yf=0,qg=1,vi="",dn="srgb",Fs="srgb-linear",qo="linear",ce="srgb",ts=7680,Uh=519,jg=512,$g=513,Yg=514,Kf=515,Kg=516,Jg=517,Zg=518,Qg=519,Vl=35044,Nh="300 es",Jn=2e3,Oo=2001;class Bs{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;const n=this._listeners;return n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;const s=this._listeners[t];if(s!==void 0){const r=s.indexOf(e);r!==-1&&s.splice(r,1)}}dispatchEvent(t){if(this._listeners===void 0)return;const n=this._listeners[t.type];if(n!==void 0){t.target=this;const s=n.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,t);t.target=null}}}const Xe=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],ma=Math.PI/180,Hl=180/Math.PI;function Si(){const i=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Xe[i&255]+Xe[i>>8&255]+Xe[i>>16&255]+Xe[i>>24&255]+"-"+Xe[t&255]+Xe[t>>8&255]+"-"+Xe[t>>16&15|64]+Xe[t>>24&255]+"-"+Xe[e&63|128]+Xe[e>>8&255]+"-"+Xe[e>>16&255]+Xe[e>>24&255]+Xe[n&255]+Xe[n>>8&255]+Xe[n>>16&255]+Xe[n>>24&255]).toLowerCase()}function Ke(i,t,e){return Math.max(t,Math.min(e,i))}function t_(i,t){return(i%t+t)%t}function ga(i,t,e){return(1-e)*i+e*t}function Nn(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function me(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}class At{constructor(t=0,e=0){At.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,n=this.y,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6],this.y=s[1]*e+s[4]*n+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Ke(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const n=Math.cos(e),s=Math.sin(e),r=this.x-t.x,a=this.y-t.y;return this.x=r*n-a*s+t.x,this.y=r*s+a*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Wt{constructor(t,e,n,s,r,a,l,c,h){Wt.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,a,l,c,h)}set(t,e,n,s,r,a,l,c,h){const d=this.elements;return d[0]=t,d[1]=s,d[2]=l,d[3]=e,d[4]=r,d[5]=c,d[6]=n,d[7]=a,d[8]=h,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,r=this.elements,a=n[0],l=n[3],c=n[6],h=n[1],d=n[4],p=n[7],m=n[2],x=n[5],S=n[8],w=s[0],v=s[3],f=s[6],U=s[1],L=s[4],P=s[7],H=s[2],O=s[5],E=s[8];return r[0]=a*w+l*U+c*H,r[3]=a*v+l*L+c*O,r[6]=a*f+l*P+c*E,r[1]=h*w+d*U+p*H,r[4]=h*v+d*L+p*O,r[7]=h*f+d*P+p*E,r[2]=m*w+x*U+S*H,r[5]=m*v+x*L+S*O,r[8]=m*f+x*P+S*E,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],a=t[4],l=t[5],c=t[6],h=t[7],d=t[8];return e*a*d-e*l*h-n*r*d+n*l*c+s*r*h-s*a*c}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],a=t[4],l=t[5],c=t[6],h=t[7],d=t[8],p=d*a-l*h,m=l*c-d*r,x=h*r-a*c,S=e*p+n*m+s*x;if(S===0)return this.set(0,0,0,0,0,0,0,0,0);const w=1/S;return t[0]=p*w,t[1]=(s*h-d*n)*w,t[2]=(l*n-s*a)*w,t[3]=m*w,t[4]=(d*e-s*c)*w,t[5]=(s*r-l*e)*w,t[6]=x*w,t[7]=(n*c-h*e)*w,t[8]=(a*e-n*r)*w,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,s,r,a,l){const c=Math.cos(r),h=Math.sin(r);return this.set(n*c,n*h,-n*(c*a+h*l)+a+t,-s*h,s*c,-s*(-h*a+c*l)+l+e,0,0,1),this}scale(t,e){return this.premultiply(_a.makeScale(t,e)),this}rotate(t){return this.premultiply(_a.makeRotation(-t)),this}translate(t,e){return this.premultiply(_a.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<9;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const _a=new Wt;function Jf(i){for(let t=i.length-1;t>=0;--t)if(i[t]>=65535)return!0;return!1}function Fo(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function e_(){const i=Fo("canvas");return i.style.display="block",i}const Oh={};function ar(i){i in Oh||(Oh[i]=!0,console.warn(i))}function n_(i,t,e){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(t,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,e);break;default:n()}}setTimeout(r,e)})}function i_(i){const t=i.elements;t[2]=.5*t[2]+.5*t[3],t[6]=.5*t[6]+.5*t[7],t[10]=.5*t[10]+.5*t[11],t[14]=.5*t[14]+.5*t[15]}function s_(i){const t=i.elements;t[11]===-1?(t[10]=-t[10]-1,t[14]=-t[14]):(t[10]=-t[10],t[14]=-t[14]+1)}const ee={enabled:!0,workingColorSpace:Fs,spaces:{},convert:function(i,t,e){return this.enabled===!1||t===e||!t||!e||(this.spaces[t].transfer===ce&&(i.r=ti(i.r),i.g=ti(i.g),i.b=ti(i.b)),this.spaces[t].primaries!==this.spaces[e].primaries&&(i.applyMatrix3(this.spaces[t].toXYZ),i.applyMatrix3(this.spaces[e].fromXYZ)),this.spaces[e].transfer===ce&&(i.r=bs(i.r),i.g=bs(i.g),i.b=bs(i.b))),i},fromWorkingColorSpace:function(i,t){return this.convert(i,this.workingColorSpace,t)},toWorkingColorSpace:function(i,t){return this.convert(i,t,this.workingColorSpace)},getPrimaries:function(i){return this.spaces[i].primaries},getTransfer:function(i){return i===vi?qo:this.spaces[i].transfer},getLuminanceCoefficients:function(i,t=this.workingColorSpace){return i.fromArray(this.spaces[t].luminanceCoefficients)},define:function(i){Object.assign(this.spaces,i)},_getMatrix:function(i,t,e){return i.copy(this.spaces[t].toXYZ).multiply(this.spaces[e].fromXYZ)},_getDrawingBufferColorSpace:function(i){return this.spaces[i].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(i=this.workingColorSpace){return this.spaces[i].workingColorSpaceConfig.unpackColorSpace}};function ti(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function bs(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}const Fh=[.64,.33,.3,.6,.15,.06],Bh=[.2126,.7152,.0722],kh=[.3127,.329],zh=new Wt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Vh=new Wt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);ee.define({[Fs]:{primaries:Fh,whitePoint:kh,transfer:qo,toXYZ:zh,fromXYZ:Vh,luminanceCoefficients:Bh,workingColorSpaceConfig:{unpackColorSpace:dn},outputColorSpaceConfig:{drawingBufferColorSpace:dn}},[dn]:{primaries:Fh,whitePoint:kh,transfer:ce,toXYZ:zh,fromXYZ:Vh,luminanceCoefficients:Bh,outputColorSpaceConfig:{drawingBufferColorSpace:dn}}});let es;class r_{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{es===void 0&&(es=Fo("canvas")),es.width=t.width,es.height=t.height;const n=es.getContext("2d");t instanceof ImageData?n.putImageData(t,0,0):n.drawImage(t,0,0,t.width,t.height),e=es}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=Fo("canvas");e.width=t.width,e.height=t.height;const n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);const s=n.getImageData(0,0,t.width,t.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=ti(r[a]/255)*255;return n.putImageData(s,0,0),e}else if(t.data){const e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(ti(e[n]/255)*255):e[n]=ti(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let o_=0;class Zf{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:o_++}),this.uuid=Si(),this.data=t,this.dataReady=!0,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,l=s.length;a<l;a++)s[a].isDataTexture?r.push(va(s[a].image)):r.push(va(s[a]))}else r=va(s);n.url=r}return e||(t.images[this.uuid]=n),n}}function va(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?r_.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let a_=0;class Qe extends Bs{constructor(t=Qe.DEFAULT_IMAGE,e=Qe.DEFAULT_MAPPING,n=Hi,s=Hi,r=mn,a=Gi,l=wn,c=ni,h=Qe.DEFAULT_ANISOTROPY,d=vi){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:a_++}),this.uuid=Si(),this.name="",this.source=new Zf(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=h,this.format=l,this.internalFormat=null,this.type=c,this.offset=new At(0,0),this.repeat=new At(1,1),this.center=new At(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Wt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=d,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==Bf)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case dl:t.x=t.x-Math.floor(t.x);break;case Hi:t.x=t.x<0?0:1;break;case pl:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case dl:t.y=t.y-Math.floor(t.y);break;case Hi:t.y=t.y<0?0:1;break;case pl:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}Qe.DEFAULT_IMAGE=null;Qe.DEFAULT_MAPPING=Bf;Qe.DEFAULT_ANISOTROPY=1;class _e{constructor(t=0,e=0,n=0,s=1){_e.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,s){return this.x=t,this.y=e,this.z=n,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,r=this.w,a=t.elements;return this.x=a[0]*e+a[4]*n+a[8]*s+a[12]*r,this.y=a[1]*e+a[5]*n+a[9]*s+a[13]*r,this.z=a[2]*e+a[6]*n+a[10]*s+a[14]*r,this.w=a[3]*e+a[7]*n+a[11]*s+a[15]*r,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,s,r;const c=t.elements,h=c[0],d=c[4],p=c[8],m=c[1],x=c[5],S=c[9],w=c[2],v=c[6],f=c[10];if(Math.abs(d-m)<.01&&Math.abs(p-w)<.01&&Math.abs(S-v)<.01){if(Math.abs(d+m)<.1&&Math.abs(p+w)<.1&&Math.abs(S+v)<.1&&Math.abs(h+x+f-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const L=(h+1)/2,P=(x+1)/2,H=(f+1)/2,O=(d+m)/4,E=(p+w)/4,M=(S+v)/4;return L>P&&L>H?L<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(L),s=O/n,r=E/n):P>H?P<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(P),n=O/s,r=M/s):H<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(H),n=E/r,s=M/r),this.set(n,s,r,e),this}let U=Math.sqrt((v-S)*(v-S)+(p-w)*(p-w)+(m-d)*(m-d));return Math.abs(U)<.001&&(U=1),this.x=(v-S)/U,this.y=(p-w)/U,this.z=(m-d)/U,this.w=Math.acos((h+x+f-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class l_ extends Bs{constructor(t=1,e=1,n={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new _e(0,0,t,e),this.scissorTest=!1,this.viewport=new _e(0,0,t,e);const s={width:t,height:e,depth:1};n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:mn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},n);const r=new Qe(s,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace);r.flipY=!1,r.generateMipmaps=n.generateMipmaps,r.internalFormat=n.internalFormat,this.textures=[];const a=n.count;for(let l=0;l<a;l++)this.textures[l]=r.clone(),this.textures[l].isRenderTargetTexture=!0;this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=t,this.textures[s].image.height=e,this.textures[s].image.depth=n;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let n=0,s=t.textures.length;n<s;n++)this.textures[n]=t.textures[n].clone(),this.textures[n].isRenderTargetTexture=!0;const e=Object.assign({},t.texture.image);return this.texture.source=new Zf(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Cn extends l_{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}}class Qf extends Qe{constructor(t=null,e=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=An,this.minFilter=An,this.wrapR=Hi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class c_ extends Qe{constructor(t=null,e=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=An,this.minFilter=An,this.wrapR=Hi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class xr{constructor(t=0,e=0,n=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=s}static slerpFlat(t,e,n,s,r,a,l){let c=n[s+0],h=n[s+1],d=n[s+2],p=n[s+3];const m=r[a+0],x=r[a+1],S=r[a+2],w=r[a+3];if(l===0){t[e+0]=c,t[e+1]=h,t[e+2]=d,t[e+3]=p;return}if(l===1){t[e+0]=m,t[e+1]=x,t[e+2]=S,t[e+3]=w;return}if(p!==w||c!==m||h!==x||d!==S){let v=1-l;const f=c*m+h*x+d*S+p*w,U=f>=0?1:-1,L=1-f*f;if(L>Number.EPSILON){const H=Math.sqrt(L),O=Math.atan2(H,f*U);v=Math.sin(v*O)/H,l=Math.sin(l*O)/H}const P=l*U;if(c=c*v+m*P,h=h*v+x*P,d=d*v+S*P,p=p*v+w*P,v===1-l){const H=1/Math.sqrt(c*c+h*h+d*d+p*p);c*=H,h*=H,d*=H,p*=H}}t[e]=c,t[e+1]=h,t[e+2]=d,t[e+3]=p}static multiplyQuaternionsFlat(t,e,n,s,r,a){const l=n[s],c=n[s+1],h=n[s+2],d=n[s+3],p=r[a],m=r[a+1],x=r[a+2],S=r[a+3];return t[e]=l*S+d*p+c*x-h*m,t[e+1]=c*S+d*m+h*p-l*x,t[e+2]=h*S+d*x+l*m-c*p,t[e+3]=d*S-l*p-c*m-h*x,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,s){return this._x=t,this._y=e,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const n=t._x,s=t._y,r=t._z,a=t._order,l=Math.cos,c=Math.sin,h=l(n/2),d=l(s/2),p=l(r/2),m=c(n/2),x=c(s/2),S=c(r/2);switch(a){case"XYZ":this._x=m*d*p+h*x*S,this._y=h*x*p-m*d*S,this._z=h*d*S+m*x*p,this._w=h*d*p-m*x*S;break;case"YXZ":this._x=m*d*p+h*x*S,this._y=h*x*p-m*d*S,this._z=h*d*S-m*x*p,this._w=h*d*p+m*x*S;break;case"ZXY":this._x=m*d*p-h*x*S,this._y=h*x*p+m*d*S,this._z=h*d*S+m*x*p,this._w=h*d*p-m*x*S;break;case"ZYX":this._x=m*d*p-h*x*S,this._y=h*x*p+m*d*S,this._z=h*d*S-m*x*p,this._w=h*d*p+m*x*S;break;case"YZX":this._x=m*d*p+h*x*S,this._y=h*x*p+m*d*S,this._z=h*d*S-m*x*p,this._w=h*d*p-m*x*S;break;case"XZY":this._x=m*d*p-h*x*S,this._y=h*x*p-m*d*S,this._z=h*d*S+m*x*p,this._w=h*d*p+m*x*S;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const n=e/2,s=Math.sin(n);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,n=e[0],s=e[4],r=e[8],a=e[1],l=e[5],c=e[9],h=e[2],d=e[6],p=e[10],m=n+l+p;if(m>0){const x=.5/Math.sqrt(m+1);this._w=.25/x,this._x=(d-c)*x,this._y=(r-h)*x,this._z=(a-s)*x}else if(n>l&&n>p){const x=2*Math.sqrt(1+n-l-p);this._w=(d-c)/x,this._x=.25*x,this._y=(s+a)/x,this._z=(r+h)/x}else if(l>p){const x=2*Math.sqrt(1+l-n-p);this._w=(r-h)/x,this._x=(s+a)/x,this._y=.25*x,this._z=(c+d)/x}else{const x=2*Math.sqrt(1+p-n-l);this._w=(a-s)/x,this._x=(r+h)/x,this._y=(c+d)/x,this._z=.25*x}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<Number.EPSILON?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(Ke(this.dot(t),-1,1)))}rotateTowards(t,e){const n=this.angleTo(t);if(n===0)return this;const s=Math.min(1,e/n);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const n=t._x,s=t._y,r=t._z,a=t._w,l=e._x,c=e._y,h=e._z,d=e._w;return this._x=n*d+a*l+s*h-r*c,this._y=s*d+a*c+r*l-n*h,this._z=r*d+a*h+n*c-s*l,this._w=a*d-n*l-s*c-r*h,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const n=this._x,s=this._y,r=this._z,a=this._w;let l=a*t._w+n*t._x+s*t._y+r*t._z;if(l<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,l=-l):this.copy(t),l>=1)return this._w=a,this._x=n,this._y=s,this._z=r,this;const c=1-l*l;if(c<=Number.EPSILON){const x=1-e;return this._w=x*a+e*this._w,this._x=x*n+e*this._x,this._y=x*s+e*this._y,this._z=x*r+e*this._z,this.normalize(),this}const h=Math.sqrt(c),d=Math.atan2(h,l),p=Math.sin((1-e)*d)/h,m=Math.sin(e*d)/h;return this._w=a*p+this._w*m,this._x=n*p+this._x*m,this._y=s*p+this._y*m,this._z=r*p+this._z*m,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(t),s*Math.cos(t),r*Math.sin(e),r*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class N{constructor(t=0,e=0,n=0){N.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(Hh.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(Hh.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6]*s,this.y=r[1]*e+r[4]*n+r[7]*s,this.z=r[2]*e+r[5]*n+r[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,r=t.elements,a=1/(r[3]*e+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*e+r[4]*n+r[8]*s+r[12])*a,this.y=(r[1]*e+r[5]*n+r[9]*s+r[13])*a,this.z=(r[2]*e+r[6]*n+r[10]*s+r[14])*a,this}applyQuaternion(t){const e=this.x,n=this.y,s=this.z,r=t.x,a=t.y,l=t.z,c=t.w,h=2*(a*s-l*n),d=2*(l*e-r*s),p=2*(r*n-a*e);return this.x=e+c*h+a*p-l*d,this.y=n+c*d+l*h-r*p,this.z=s+c*p+r*d-a*h,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*s,this.y=r[1]*e+r[5]*n+r[9]*s,this.z=r[2]*e+r[6]*n+r[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const n=t.x,s=t.y,r=t.z,a=e.x,l=e.y,c=e.z;return this.x=s*c-r*l,this.y=r*a-n*c,this.z=n*l-s*a,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return ya.copy(this).projectOnVector(t),this.sub(ya)}reflect(t){return this.sub(ya.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Ke(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y,s=this.z-t.z;return e*e+n*n+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){const s=Math.sin(e)*t;return this.x=s*Math.sin(n),this.y=Math.cos(e)*t,this.z=s*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const ya=new N,Hh=new xr;class Mr{constructor(t=new N(1/0,1/0,1/0),e=new N(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(xn.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(xn.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const n=xn.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const n=t.geometry;if(n!==void 0){const r=n.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let a=0,l=r.count;a<l;a++)t.isMesh===!0?t.getVertexPosition(a,xn):xn.fromBufferAttribute(r,a),xn.applyMatrix4(t.matrixWorld),this.expandByPoint(xn);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),Hr.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Hr.copy(n.boundingBox)),Hr.applyMatrix4(t.matrixWorld),this.union(Hr)}const s=t.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,xn),xn.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(Js),Gr.subVectors(this.max,Js),ns.subVectors(t.a,Js),is.subVectors(t.b,Js),ss.subVectors(t.c,Js),ui.subVectors(is,ns),fi.subVectors(ss,is),Ci.subVectors(ns,ss);let e=[0,-ui.z,ui.y,0,-fi.z,fi.y,0,-Ci.z,Ci.y,ui.z,0,-ui.x,fi.z,0,-fi.x,Ci.z,0,-Ci.x,-ui.y,ui.x,0,-fi.y,fi.x,0,-Ci.y,Ci.x,0];return!xa(e,ns,is,ss,Gr)||(e=[1,0,0,0,1,0,0,0,1],!xa(e,ns,is,ss,Gr))?!1:(Wr.crossVectors(ui,fi),e=[Wr.x,Wr.y,Wr.z],xa(e,ns,is,ss,Gr))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,xn).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(xn).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(Gn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),Gn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),Gn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),Gn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),Gn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),Gn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),Gn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),Gn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(Gn),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}}const Gn=[new N,new N,new N,new N,new N,new N,new N,new N],xn=new N,Hr=new Mr,ns=new N,is=new N,ss=new N,ui=new N,fi=new N,Ci=new N,Js=new N,Gr=new N,Wr=new N,Ri=new N;function xa(i,t,e,n,s){for(let r=0,a=i.length-3;r<=a;r+=3){Ri.fromArray(i,r);const l=s.x*Math.abs(Ri.x)+s.y*Math.abs(Ri.y)+s.z*Math.abs(Ri.z),c=t.dot(Ri),h=e.dot(Ri),d=n.dot(Ri);if(Math.max(-Math.max(c,h,d),Math.min(c,h,d))>l)return!1}return!0}const h_=new Mr,Zs=new N,Ma=new N;class Sr{constructor(t=new N,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const n=this.center;e!==void 0?n.copy(e):h_.setFromPoints(t).getCenter(n);let s=0;for(let r=0,a=t.length;r<a;r++)s=Math.max(s,n.distanceToSquared(t[r]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;Zs.subVectors(t,this.center);const e=Zs.lengthSq();if(e>this.radius*this.radius){const n=Math.sqrt(e),s=(n-this.radius)*.5;this.center.addScaledVector(Zs,s/n),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(Ma.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(Zs.copy(t.center).add(Ma)),this.expandByPoint(Zs.copy(t.center).sub(Ma))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}}const Wn=new N,Sa=new N,Xr=new N,di=new N,Ea=new N,qr=new N,Ta=new N;class jo{constructor(t=new N,e=new N(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,Wn)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=Wn.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(Wn.copy(this.origin).addScaledVector(this.direction,e),Wn.distanceToSquared(t))}distanceSqToSegment(t,e,n,s){Sa.copy(t).add(e).multiplyScalar(.5),Xr.copy(e).sub(t).normalize(),di.copy(this.origin).sub(Sa);const r=t.distanceTo(e)*.5,a=-this.direction.dot(Xr),l=di.dot(this.direction),c=-di.dot(Xr),h=di.lengthSq(),d=Math.abs(1-a*a);let p,m,x,S;if(d>0)if(p=a*c-l,m=a*l-c,S=r*d,p>=0)if(m>=-S)if(m<=S){const w=1/d;p*=w,m*=w,x=p*(p+a*m+2*l)+m*(a*p+m+2*c)+h}else m=r,p=Math.max(0,-(a*m+l)),x=-p*p+m*(m+2*c)+h;else m=-r,p=Math.max(0,-(a*m+l)),x=-p*p+m*(m+2*c)+h;else m<=-S?(p=Math.max(0,-(-a*r+l)),m=p>0?-r:Math.min(Math.max(-r,-c),r),x=-p*p+m*(m+2*c)+h):m<=S?(p=0,m=Math.min(Math.max(-r,-c),r),x=m*(m+2*c)+h):(p=Math.max(0,-(a*r+l)),m=p>0?r:Math.min(Math.max(-r,-c),r),x=-p*p+m*(m+2*c)+h);else m=a>0?-r:r,p=Math.max(0,-(a*m+l)),x=-p*p+m*(m+2*c)+h;return n&&n.copy(this.origin).addScaledVector(this.direction,p),s&&s.copy(Sa).addScaledVector(Xr,m),x}intersectSphere(t,e){Wn.subVectors(t.center,this.origin);const n=Wn.dot(this.direction),s=Wn.dot(Wn)-n*n,r=t.radius*t.radius;if(s>r)return null;const a=Math.sqrt(r-s),l=n-a,c=n+a;return c<0?null:l<0?this.at(c,e):this.at(l,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){const n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,s,r,a,l,c;const h=1/this.direction.x,d=1/this.direction.y,p=1/this.direction.z,m=this.origin;return h>=0?(n=(t.min.x-m.x)*h,s=(t.max.x-m.x)*h):(n=(t.max.x-m.x)*h,s=(t.min.x-m.x)*h),d>=0?(r=(t.min.y-m.y)*d,a=(t.max.y-m.y)*d):(r=(t.max.y-m.y)*d,a=(t.min.y-m.y)*d),n>a||r>s||((r>n||isNaN(n))&&(n=r),(a<s||isNaN(s))&&(s=a),p>=0?(l=(t.min.z-m.z)*p,c=(t.max.z-m.z)*p):(l=(t.max.z-m.z)*p,c=(t.min.z-m.z)*p),n>c||l>s)||((l>n||n!==n)&&(n=l),(c<s||s!==s)&&(s=c),s<0)?null:this.at(n>=0?n:s,e)}intersectsBox(t){return this.intersectBox(t,Wn)!==null}intersectTriangle(t,e,n,s,r){Ea.subVectors(e,t),qr.subVectors(n,t),Ta.crossVectors(Ea,qr);let a=this.direction.dot(Ta),l;if(a>0){if(s)return null;l=1}else if(a<0)l=-1,a=-a;else return null;di.subVectors(this.origin,t);const c=l*this.direction.dot(qr.crossVectors(di,qr));if(c<0)return null;const h=l*this.direction.dot(Ea.cross(di));if(h<0||c+h>a)return null;const d=-l*di.dot(Ta);return d<0?null:this.at(d/a,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class xe{constructor(t,e,n,s,r,a,l,c,h,d,p,m,x,S,w,v){xe.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,a,l,c,h,d,p,m,x,S,w,v)}set(t,e,n,s,r,a,l,c,h,d,p,m,x,S,w,v){const f=this.elements;return f[0]=t,f[4]=e,f[8]=n,f[12]=s,f[1]=r,f[5]=a,f[9]=l,f[13]=c,f[2]=h,f[6]=d,f[10]=p,f[14]=m,f[3]=x,f[7]=S,f[11]=w,f[15]=v,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new xe().fromArray(this.elements)}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){const e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,n=t.elements,s=1/rs.setFromMatrixColumn(t,0).length(),r=1/rs.setFromMatrixColumn(t,1).length(),a=1/rs.setFromMatrixColumn(t,2).length();return e[0]=n[0]*s,e[1]=n[1]*s,e[2]=n[2]*s,e[3]=0,e[4]=n[4]*r,e[5]=n[5]*r,e[6]=n[6]*r,e[7]=0,e[8]=n[8]*a,e[9]=n[9]*a,e[10]=n[10]*a,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,n=t.x,s=t.y,r=t.z,a=Math.cos(n),l=Math.sin(n),c=Math.cos(s),h=Math.sin(s),d=Math.cos(r),p=Math.sin(r);if(t.order==="XYZ"){const m=a*d,x=a*p,S=l*d,w=l*p;e[0]=c*d,e[4]=-c*p,e[8]=h,e[1]=x+S*h,e[5]=m-w*h,e[9]=-l*c,e[2]=w-m*h,e[6]=S+x*h,e[10]=a*c}else if(t.order==="YXZ"){const m=c*d,x=c*p,S=h*d,w=h*p;e[0]=m+w*l,e[4]=S*l-x,e[8]=a*h,e[1]=a*p,e[5]=a*d,e[9]=-l,e[2]=x*l-S,e[6]=w+m*l,e[10]=a*c}else if(t.order==="ZXY"){const m=c*d,x=c*p,S=h*d,w=h*p;e[0]=m-w*l,e[4]=-a*p,e[8]=S+x*l,e[1]=x+S*l,e[5]=a*d,e[9]=w-m*l,e[2]=-a*h,e[6]=l,e[10]=a*c}else if(t.order==="ZYX"){const m=a*d,x=a*p,S=l*d,w=l*p;e[0]=c*d,e[4]=S*h-x,e[8]=m*h+w,e[1]=c*p,e[5]=w*h+m,e[9]=x*h-S,e[2]=-h,e[6]=l*c,e[10]=a*c}else if(t.order==="YZX"){const m=a*c,x=a*h,S=l*c,w=l*h;e[0]=c*d,e[4]=w-m*p,e[8]=S*p+x,e[1]=p,e[5]=a*d,e[9]=-l*d,e[2]=-h*d,e[6]=x*p+S,e[10]=m-w*p}else if(t.order==="XZY"){const m=a*c,x=a*h,S=l*c,w=l*h;e[0]=c*d,e[4]=-p,e[8]=h*d,e[1]=m*p+w,e[5]=a*d,e[9]=x*p-S,e[2]=S*p-x,e[6]=l*d,e[10]=w*p+m}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(u_,t,f_)}lookAt(t,e,n){const s=this.elements;return rn.subVectors(t,e),rn.lengthSq()===0&&(rn.z=1),rn.normalize(),pi.crossVectors(n,rn),pi.lengthSq()===0&&(Math.abs(n.z)===1?rn.x+=1e-4:rn.z+=1e-4,rn.normalize(),pi.crossVectors(n,rn)),pi.normalize(),jr.crossVectors(rn,pi),s[0]=pi.x,s[4]=jr.x,s[8]=rn.x,s[1]=pi.y,s[5]=jr.y,s[9]=rn.y,s[2]=pi.z,s[6]=jr.z,s[10]=rn.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,r=this.elements,a=n[0],l=n[4],c=n[8],h=n[12],d=n[1],p=n[5],m=n[9],x=n[13],S=n[2],w=n[6],v=n[10],f=n[14],U=n[3],L=n[7],P=n[11],H=n[15],O=s[0],E=s[4],M=s[8],g=s[12],_=s[1],T=s[5],I=s[9],b=s[13],K=s[2],Q=s[6],J=s[10],nt=s[14],$=s[3],ut=s[7],vt=s[11],Ct=s[15];return r[0]=a*O+l*_+c*K+h*$,r[4]=a*E+l*T+c*Q+h*ut,r[8]=a*M+l*I+c*J+h*vt,r[12]=a*g+l*b+c*nt+h*Ct,r[1]=d*O+p*_+m*K+x*$,r[5]=d*E+p*T+m*Q+x*ut,r[9]=d*M+p*I+m*J+x*vt,r[13]=d*g+p*b+m*nt+x*Ct,r[2]=S*O+w*_+v*K+f*$,r[6]=S*E+w*T+v*Q+f*ut,r[10]=S*M+w*I+v*J+f*vt,r[14]=S*g+w*b+v*nt+f*Ct,r[3]=U*O+L*_+P*K+H*$,r[7]=U*E+L*T+P*Q+H*ut,r[11]=U*M+L*I+P*J+H*vt,r[15]=U*g+L*b+P*nt+H*Ct,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[4],s=t[8],r=t[12],a=t[1],l=t[5],c=t[9],h=t[13],d=t[2],p=t[6],m=t[10],x=t[14],S=t[3],w=t[7],v=t[11],f=t[15];return S*(+r*c*p-s*h*p-r*l*m+n*h*m+s*l*x-n*c*x)+w*(+e*c*x-e*h*m+r*a*m-s*a*x+s*h*d-r*c*d)+v*(+e*h*p-e*l*x-r*a*p+n*a*x+r*l*d-n*h*d)+f*(-s*l*d-e*c*p+e*l*m+s*a*p-n*a*m+n*c*d)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){const s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=n),this}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],a=t[4],l=t[5],c=t[6],h=t[7],d=t[8],p=t[9],m=t[10],x=t[11],S=t[12],w=t[13],v=t[14],f=t[15],U=p*v*h-w*m*h+w*c*x-l*v*x-p*c*f+l*m*f,L=S*m*h-d*v*h-S*c*x+a*v*x+d*c*f-a*m*f,P=d*w*h-S*p*h+S*l*x-a*w*x-d*l*f+a*p*f,H=S*p*c-d*w*c-S*l*m+a*w*m+d*l*v-a*p*v,O=e*U+n*L+s*P+r*H;if(O===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const E=1/O;return t[0]=U*E,t[1]=(w*m*r-p*v*r-w*s*x+n*v*x+p*s*f-n*m*f)*E,t[2]=(l*v*r-w*c*r+w*s*h-n*v*h-l*s*f+n*c*f)*E,t[3]=(p*c*r-l*m*r-p*s*h+n*m*h+l*s*x-n*c*x)*E,t[4]=L*E,t[5]=(d*v*r-S*m*r+S*s*x-e*v*x-d*s*f+e*m*f)*E,t[6]=(S*c*r-a*v*r-S*s*h+e*v*h+a*s*f-e*c*f)*E,t[7]=(a*m*r-d*c*r+d*s*h-e*m*h-a*s*x+e*c*x)*E,t[8]=P*E,t[9]=(S*p*r-d*w*r-S*n*x+e*w*x+d*n*f-e*p*f)*E,t[10]=(a*w*r-S*l*r+S*n*h-e*w*h-a*n*f+e*l*f)*E,t[11]=(d*l*r-a*p*r-d*n*h+e*p*h+a*n*x-e*l*x)*E,t[12]=H*E,t[13]=(d*w*s-S*p*s+S*n*m-e*w*m-d*n*v+e*p*v)*E,t[14]=(S*l*s-a*w*s-S*n*c+e*w*c+a*n*v-e*l*v)*E,t[15]=(a*p*s-d*l*s+d*n*c-e*p*c-a*n*m+e*l*m)*E,this}scale(t){const e=this.elements,n=t.x,s=t.y,r=t.z;return e[0]*=n,e[4]*=s,e[8]*=r,e[1]*=n,e[5]*=s,e[9]*=r,e[2]*=n,e[6]*=s,e[10]*=r,e[3]*=n,e[7]*=s,e[11]*=r,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,s))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const n=Math.cos(e),s=Math.sin(e),r=1-n,a=t.x,l=t.y,c=t.z,h=r*a,d=r*l;return this.set(h*a+n,h*l-s*c,h*c+s*l,0,h*l+s*c,d*l+n,d*c-s*a,0,h*c-s*l,d*c+s*a,r*c*c+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,s,r,a){return this.set(1,n,r,0,t,1,a,0,e,s,1,0,0,0,0,1),this}compose(t,e,n){const s=this.elements,r=e._x,a=e._y,l=e._z,c=e._w,h=r+r,d=a+a,p=l+l,m=r*h,x=r*d,S=r*p,w=a*d,v=a*p,f=l*p,U=c*h,L=c*d,P=c*p,H=n.x,O=n.y,E=n.z;return s[0]=(1-(w+f))*H,s[1]=(x+P)*H,s[2]=(S-L)*H,s[3]=0,s[4]=(x-P)*O,s[5]=(1-(m+f))*O,s[6]=(v+U)*O,s[7]=0,s[8]=(S+L)*E,s[9]=(v-U)*E,s[10]=(1-(m+w))*E,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,n){const s=this.elements;let r=rs.set(s[0],s[1],s[2]).length();const a=rs.set(s[4],s[5],s[6]).length(),l=rs.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),t.x=s[12],t.y=s[13],t.z=s[14],Mn.copy(this);const h=1/r,d=1/a,p=1/l;return Mn.elements[0]*=h,Mn.elements[1]*=h,Mn.elements[2]*=h,Mn.elements[4]*=d,Mn.elements[5]*=d,Mn.elements[6]*=d,Mn.elements[8]*=p,Mn.elements[9]*=p,Mn.elements[10]*=p,e.setFromRotationMatrix(Mn),n.x=r,n.y=a,n.z=l,this}makePerspective(t,e,n,s,r,a,l=Jn){const c=this.elements,h=2*r/(e-t),d=2*r/(n-s),p=(e+t)/(e-t),m=(n+s)/(n-s);let x,S;if(l===Jn)x=-(a+r)/(a-r),S=-2*a*r/(a-r);else if(l===Oo)x=-a/(a-r),S=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+l);return c[0]=h,c[4]=0,c[8]=p,c[12]=0,c[1]=0,c[5]=d,c[9]=m,c[13]=0,c[2]=0,c[6]=0,c[10]=x,c[14]=S,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,n,s,r,a,l=Jn){const c=this.elements,h=1/(e-t),d=1/(n-s),p=1/(a-r),m=(e+t)*h,x=(n+s)*d;let S,w;if(l===Jn)S=(a+r)*p,w=-2*p;else if(l===Oo)S=r*p,w=-1*p;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+l);return c[0]=2*h,c[4]=0,c[8]=0,c[12]=-m,c[1]=0,c[5]=2*d,c[9]=0,c[13]=-x,c[2]=0,c[6]=0,c[10]=w,c[14]=-S,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<16;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}}const rs=new N,Mn=new xe,u_=new N(0,0,0),f_=new N(1,1,1),pi=new N,jr=new N,rn=new N,Gh=new xe,Wh=new xr;class Rn{constructor(t=0,e=0,n=0,s=Rn.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,s=this._order){return this._x=t,this._y=e,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){const s=t.elements,r=s[0],a=s[4],l=s[8],c=s[1],h=s[5],d=s[9],p=s[2],m=s[6],x=s[10];switch(e){case"XYZ":this._y=Math.asin(Ke(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-d,x),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(m,h),this._z=0);break;case"YXZ":this._x=Math.asin(-Ke(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(l,x),this._z=Math.atan2(c,h)):(this._y=Math.atan2(-p,r),this._z=0);break;case"ZXY":this._x=Math.asin(Ke(m,-1,1)),Math.abs(m)<.9999999?(this._y=Math.atan2(-p,x),this._z=Math.atan2(-a,h)):(this._y=0,this._z=Math.atan2(c,r));break;case"ZYX":this._y=Math.asin(-Ke(p,-1,1)),Math.abs(p)<.9999999?(this._x=Math.atan2(m,x),this._z=Math.atan2(c,r)):(this._x=0,this._z=Math.atan2(-a,h));break;case"YZX":this._z=Math.asin(Ke(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-d,h),this._y=Math.atan2(-p,r)):(this._x=0,this._y=Math.atan2(l,x));break;case"XZY":this._z=Math.asin(-Ke(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(m,h),this._y=Math.atan2(l,r)):(this._x=Math.atan2(-d,x),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return Gh.makeRotationFromQuaternion(t),this.setFromRotationMatrix(Gh,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return Wh.setFromEuler(this),this.setFromQuaternion(Wh,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Rn.DEFAULT_ORDER="XYZ";class lc{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let d_=0;const Xh=new N,os=new xr,Xn=new xe,$r=new N,Qs=new N,p_=new N,m_=new xr,qh=new N(1,0,0),jh=new N(0,1,0),$h=new N(0,0,1),Yh={type:"added"},g_={type:"removed"},as={type:"childadded",child:null},wa={type:"childremoved",child:null};class Pe extends Bs{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:d_++}),this.uuid=Si(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Pe.DEFAULT_UP.clone();const t=new N,e=new Rn,n=new xr,s=new N(1,1,1);function r(){n.setFromEuler(e,!1)}function a(){e.setFromQuaternion(n,void 0,!1)}e._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new xe},normalMatrix:{value:new Wt}}),this.matrix=new xe,this.matrixWorld=new xe,this.matrixAutoUpdate=Pe.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Pe.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new lc,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return os.setFromAxisAngle(t,e),this.quaternion.multiply(os),this}rotateOnWorldAxis(t,e){return os.setFromAxisAngle(t,e),this.quaternion.premultiply(os),this}rotateX(t){return this.rotateOnAxis(qh,t)}rotateY(t){return this.rotateOnAxis(jh,t)}rotateZ(t){return this.rotateOnAxis($h,t)}translateOnAxis(t,e){return Xh.copy(t).applyQuaternion(this.quaternion),this.position.add(Xh.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(qh,t)}translateY(t){return this.translateOnAxis(jh,t)}translateZ(t){return this.translateOnAxis($h,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Xn.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?$r.copy(t):$r.set(t,e,n);const s=this.parent;this.updateWorldMatrix(!0,!1),Qs.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Xn.lookAt(Qs,$r,this.up):Xn.lookAt($r,Qs,this.up),this.quaternion.setFromRotationMatrix(Xn),s&&(Xn.extractRotation(s.matrixWorld),os.setFromRotationMatrix(Xn),this.quaternion.premultiply(os.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(Yh),as.child=t,this.dispatchEvent(as),as.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(g_),wa.child=t,this.dispatchEvent(wa),wa.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Xn.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Xn.multiply(t.parent.matrixWorld)),t.applyMatrix4(Xn),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(Yh),as.child=t,this.dispatchEvent(as),as.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,s=this.children.length;n<s;n++){const a=this.children[n].getObjectByProperty(t,e);if(a!==void 0)return a}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Qs,t,p_),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Qs,m_,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e){const n=this.parent;if(t===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(t){const e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.visibility=this._visibility,s.active=this._active,s.bounds=this._bounds.map(l=>({boxInitialized:l.boxInitialized,boxMin:l.box.min.toArray(),boxMax:l.box.max.toArray(),sphereInitialized:l.sphereInitialized,sphereRadius:l.sphere.radius,sphereCenter:l.sphere.center.toArray()})),s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.geometryCount=this._geometryCount,s.matricesTexture=this._matricesTexture.toJSON(t),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(s.boundingSphere={center:s.boundingSphere.center.toArray(),radius:s.boundingSphere.radius}),this.boundingBox!==null&&(s.boundingBox={min:s.boundingBox.min.toArray(),max:s.boundingBox.max.toArray()}));function r(l,c){return l[c.uuid]===void 0&&(l[c.uuid]=c.toJSON(t)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(t.geometries,this.geometry);const l=this.geometry.parameters;if(l!==void 0&&l.shapes!==void 0){const c=l.shapes;if(Array.isArray(c))for(let h=0,d=c.length;h<d;h++){const p=c[h];r(t.shapes,p)}else r(t.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const l=[];for(let c=0,h=this.material.length;c<h;c++)l.push(r(t.materials,this.material[c]));s.material=l}else s.material=r(t.materials,this.material);if(this.children.length>0){s.children=[];for(let l=0;l<this.children.length;l++)s.children.push(this.children[l].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let l=0;l<this.animations.length;l++){const c=this.animations[l];s.animations.push(r(t.animations,c))}}if(e){const l=a(t.geometries),c=a(t.materials),h=a(t.textures),d=a(t.images),p=a(t.shapes),m=a(t.skeletons),x=a(t.animations),S=a(t.nodes);l.length>0&&(n.geometries=l),c.length>0&&(n.materials=c),h.length>0&&(n.textures=h),d.length>0&&(n.images=d),p.length>0&&(n.shapes=p),m.length>0&&(n.skeletons=m),x.length>0&&(n.animations=x),S.length>0&&(n.nodes=S)}return n.object=s,n;function a(l){const c=[];for(const h in l){const d=l[h];delete d.metadata,c.push(d)}return c}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){const s=t.children[n];this.add(s.clone())}return this}}Pe.DEFAULT_UP=new N(0,1,0);Pe.DEFAULT_MATRIX_AUTO_UPDATE=!0;Pe.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const Sn=new N,qn=new N,ba=new N,jn=new N,ls=new N,cs=new N,Kh=new N,Aa=new N,Ca=new N,Ra=new N,Pa=new _e,Ia=new _e,Da=new _e;class pn{constructor(t=new N,e=new N,n=new N){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,s){s.subVectors(n,e),Sn.subVectors(t,e),s.cross(Sn);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(t,e,n,s,r){Sn.subVectors(s,e),qn.subVectors(n,e),ba.subVectors(t,e);const a=Sn.dot(Sn),l=Sn.dot(qn),c=Sn.dot(ba),h=qn.dot(qn),d=qn.dot(ba),p=a*h-l*l;if(p===0)return r.set(0,0,0),null;const m=1/p,x=(h*c-l*d)*m,S=(a*d-l*c)*m;return r.set(1-x-S,S,x)}static containsPoint(t,e,n,s){return this.getBarycoord(t,e,n,s,jn)===null?!1:jn.x>=0&&jn.y>=0&&jn.x+jn.y<=1}static getInterpolation(t,e,n,s,r,a,l,c){return this.getBarycoord(t,e,n,s,jn)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(r,jn.x),c.addScaledVector(a,jn.y),c.addScaledVector(l,jn.z),c)}static getInterpolatedAttribute(t,e,n,s,r,a){return Pa.setScalar(0),Ia.setScalar(0),Da.setScalar(0),Pa.fromBufferAttribute(t,e),Ia.fromBufferAttribute(t,n),Da.fromBufferAttribute(t,s),a.setScalar(0),a.addScaledVector(Pa,r.x),a.addScaledVector(Ia,r.y),a.addScaledVector(Da,r.z),a}static isFrontFacing(t,e,n,s){return Sn.subVectors(n,e),qn.subVectors(t,e),Sn.cross(qn).dot(s)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,s){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,n,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return Sn.subVectors(this.c,this.b),qn.subVectors(this.a,this.b),Sn.cross(qn).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return pn.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return pn.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,s,r){return pn.getInterpolation(t,this.a,this.b,this.c,e,n,s,r)}containsPoint(t){return pn.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return pn.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const n=this.a,s=this.b,r=this.c;let a,l;ls.subVectors(s,n),cs.subVectors(r,n),Aa.subVectors(t,n);const c=ls.dot(Aa),h=cs.dot(Aa);if(c<=0&&h<=0)return e.copy(n);Ca.subVectors(t,s);const d=ls.dot(Ca),p=cs.dot(Ca);if(d>=0&&p<=d)return e.copy(s);const m=c*p-d*h;if(m<=0&&c>=0&&d<=0)return a=c/(c-d),e.copy(n).addScaledVector(ls,a);Ra.subVectors(t,r);const x=ls.dot(Ra),S=cs.dot(Ra);if(S>=0&&x<=S)return e.copy(r);const w=x*h-c*S;if(w<=0&&h>=0&&S<=0)return l=h/(h-S),e.copy(n).addScaledVector(cs,l);const v=d*S-x*p;if(v<=0&&p-d>=0&&x-S>=0)return Kh.subVectors(r,s),l=(p-d)/(p-d+(x-S)),e.copy(s).addScaledVector(Kh,l);const f=1/(v+w+m);return a=w*f,l=m*f,e.copy(n).addScaledVector(ls,a).addScaledVector(cs,l)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const td={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},mi={h:0,s:0,l:0},Yr={h:0,s:0,l:0};function La(i,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?i+(t-i)*6*e:e<1/2?t:e<2/3?i+(t-i)*6*(2/3-e):i}class Pt{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){const s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=dn){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,ee.toWorkingColorSpace(this,e),this}setRGB(t,e,n,s=ee.workingColorSpace){return this.r=t,this.g=e,this.b=n,ee.toWorkingColorSpace(this,s),this}setHSL(t,e,n,s=ee.workingColorSpace){if(t=t_(t,1),e=Ke(e,0,1),n=Ke(n,0,1),e===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+e):n+e-n*e,a=2*n-r;this.r=La(a,r,t+1/3),this.g=La(a,r,t),this.b=La(a,r,t-1/3)}return ee.toWorkingColorSpace(this,s),this}setStyle(t,e=dn){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let r;const a=s[1],l=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(l))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(l))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(l))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){const r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(a===6)return this.setHex(parseInt(r,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=dn){const n=td[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=ti(t.r),this.g=ti(t.g),this.b=ti(t.b),this}copyLinearToSRGB(t){return this.r=bs(t.r),this.g=bs(t.g),this.b=bs(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=dn){return ee.fromWorkingColorSpace(qe.copy(this),t),Math.round(Ke(qe.r*255,0,255))*65536+Math.round(Ke(qe.g*255,0,255))*256+Math.round(Ke(qe.b*255,0,255))}getHexString(t=dn){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=ee.workingColorSpace){ee.fromWorkingColorSpace(qe.copy(this),e);const n=qe.r,s=qe.g,r=qe.b,a=Math.max(n,s,r),l=Math.min(n,s,r);let c,h;const d=(l+a)/2;if(l===a)c=0,h=0;else{const p=a-l;switch(h=d<=.5?p/(a+l):p/(2-a-l),a){case n:c=(s-r)/p+(s<r?6:0);break;case s:c=(r-n)/p+2;break;case r:c=(n-s)/p+4;break}c/=6}return t.h=c,t.s=h,t.l=d,t}getRGB(t,e=ee.workingColorSpace){return ee.fromWorkingColorSpace(qe.copy(this),e),t.r=qe.r,t.g=qe.g,t.b=qe.b,t}getStyle(t=dn){ee.fromWorkingColorSpace(qe.copy(this),t);const e=qe.r,n=qe.g,s=qe.b;return t!==dn?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(t,e,n){return this.getHSL(mi),this.setHSL(mi.h+t,mi.s+e,mi.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(mi),t.getHSL(Yr);const n=ga(mi.h,Yr.h,e),s=ga(mi.s,Yr.s,e),r=ga(mi.l,Yr.l,e);return this.setHSL(n,s,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,n=this.g,s=this.b,r=t.elements;return this.r=r[0]*e+r[3]*n+r[6]*s,this.g=r[1]*e+r[4]*n+r[7]*s,this.b=r[2]*e+r[5]*n+r[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const qe=new Pt;Pt.NAMES=td;let __=0;class wi extends Bs{static get type(){return"Material"}get type(){return this.constructor.type}set type(t){}constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:__++}),this.uuid=Si(),this.name="",this.blending=Ts,this.side=Ei,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=nl,this.blendDst=il,this.blendEquation=Bi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Pt(0,0,0),this.blendAlpha=0,this.depthFunc=Rs,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Uh,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=ts,this.stencilZFail=ts,this.stencilZPass=ts,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Ts&&(n.blending=this.blending),this.side!==Ei&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==nl&&(n.blendSrc=this.blendSrc),this.blendDst!==il&&(n.blendDst=this.blendDst),this.blendEquation!==Bi&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==Rs&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Uh&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==ts&&(n.stencilFail=this.stencilFail),this.stencilZFail!==ts&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==ts&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){const a=[];for(const l in r){const c=r[l];delete c.metadata,a.push(c)}return a}if(e){const r=s(t.textures),a=s(t.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let n=null;if(e!==null){const s=e.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=e[r].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class $o extends wi{static get type(){return"MeshBasicMaterial"}constructor(t){super(),this.isMeshBasicMaterial=!0,this.color=new Pt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Rn,this.combine=Df,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const Ae=new N,Kr=new At;class Fe{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=Vl,this.updateRanges=[],this.gpuType=Kn,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[t+s]=e.array[n+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)Kr.fromBufferAttribute(this,e),Kr.applyMatrix3(t),this.setXY(e,Kr.x,Kr.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)Ae.fromBufferAttribute(this,e),Ae.applyMatrix3(t),this.setXYZ(e,Ae.x,Ae.y,Ae.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)Ae.fromBufferAttribute(this,e),Ae.applyMatrix4(t),this.setXYZ(e,Ae.x,Ae.y,Ae.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)Ae.fromBufferAttribute(this,e),Ae.applyNormalMatrix(t),this.setXYZ(e,Ae.x,Ae.y,Ae.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)Ae.fromBufferAttribute(this,e),Ae.transformDirection(t),this.setXYZ(e,Ae.x,Ae.y,Ae.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=Nn(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=me(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=Nn(e,this.array)),e}setX(t,e){return this.normalized&&(e=me(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=Nn(e,this.array)),e}setY(t,e){return this.normalized&&(e=me(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=Nn(e,this.array)),e}setZ(t,e){return this.normalized&&(e=me(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=Nn(e,this.array)),e}setW(t,e){return this.normalized&&(e=me(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=me(e,this.array),n=me(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,s){return t*=this.itemSize,this.normalized&&(e=me(e,this.array),n=me(n,this.array),s=me(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t*=this.itemSize,this.normalized&&(e=me(e,this.array),n=me(n,this.array),s=me(s,this.array),r=me(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==Vl&&(t.usage=this.usage),t}}class ed extends Fe{constructor(t,e,n){super(new Uint16Array(t),e,n)}}class nd extends Fe{constructor(t,e,n){super(new Uint32Array(t),e,n)}}class Te extends Fe{constructor(t,e,n){super(new Float32Array(t),e,n)}}let v_=0;const fn=new xe,Ua=new Pe,hs=new N,on=new Mr,tr=new Mr,Ne=new N;class be extends Bs{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:v_++}),this.uuid=Si(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(Jf(t)?nd:ed)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new Wt().getNormalMatrix(t);n.applyNormalMatrix(r),n.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return fn.makeRotationFromQuaternion(t),this.applyMatrix4(fn),this}rotateX(t){return fn.makeRotationX(t),this.applyMatrix4(fn),this}rotateY(t){return fn.makeRotationY(t),this.applyMatrix4(fn),this}rotateZ(t){return fn.makeRotationZ(t),this.applyMatrix4(fn),this}translate(t,e,n){return fn.makeTranslation(t,e,n),this.applyMatrix4(fn),this}scale(t,e,n){return fn.makeScale(t,e,n),this.applyMatrix4(fn),this}lookAt(t){return Ua.lookAt(t),Ua.updateMatrix(),this.applyMatrix4(Ua.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(hs).negate(),this.translate(hs.x,hs.y,hs.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const n=[];for(let s=0,r=t.length;s<r;s++){const a=t[s];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new Te(n,3))}else{for(let n=0,s=e.count;n<s;n++){const r=t[n];e.setXYZ(n,r.x,r.y,r.z||0)}t.length>e.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Mr);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new N(-1/0,-1/0,-1/0),new N(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,s=e.length;n<s;n++){const r=e[n];on.setFromBufferAttribute(r),this.morphTargetsRelative?(Ne.addVectors(this.boundingBox.min,on.min),this.boundingBox.expandByPoint(Ne),Ne.addVectors(this.boundingBox.max,on.max),this.boundingBox.expandByPoint(Ne)):(this.boundingBox.expandByPoint(on.min),this.boundingBox.expandByPoint(on.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Sr);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new N,1/0);return}if(t){const n=this.boundingSphere.center;if(on.setFromBufferAttribute(t),e)for(let r=0,a=e.length;r<a;r++){const l=e[r];tr.setFromBufferAttribute(l),this.morphTargetsRelative?(Ne.addVectors(on.min,tr.min),on.expandByPoint(Ne),Ne.addVectors(on.max,tr.max),on.expandByPoint(Ne)):(on.expandByPoint(tr.min),on.expandByPoint(tr.max))}on.getCenter(n);let s=0;for(let r=0,a=t.count;r<a;r++)Ne.fromBufferAttribute(t,r),s=Math.max(s,n.distanceToSquared(Ne));if(e)for(let r=0,a=e.length;r<a;r++){const l=e[r],c=this.morphTargetsRelative;for(let h=0,d=l.count;h<d;h++)Ne.fromBufferAttribute(l,h),c&&(hs.fromBufferAttribute(t,h),Ne.add(hs)),s=Math.max(s,n.distanceToSquared(Ne))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=e.position,s=e.normal,r=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Fe(new Float32Array(4*n.count),4));const a=this.getAttribute("tangent"),l=[],c=[];for(let M=0;M<n.count;M++)l[M]=new N,c[M]=new N;const h=new N,d=new N,p=new N,m=new At,x=new At,S=new At,w=new N,v=new N;function f(M,g,_){h.fromBufferAttribute(n,M),d.fromBufferAttribute(n,g),p.fromBufferAttribute(n,_),m.fromBufferAttribute(r,M),x.fromBufferAttribute(r,g),S.fromBufferAttribute(r,_),d.sub(h),p.sub(h),x.sub(m),S.sub(m);const T=1/(x.x*S.y-S.x*x.y);isFinite(T)&&(w.copy(d).multiplyScalar(S.y).addScaledVector(p,-x.y).multiplyScalar(T),v.copy(p).multiplyScalar(x.x).addScaledVector(d,-S.x).multiplyScalar(T),l[M].add(w),l[g].add(w),l[_].add(w),c[M].add(v),c[g].add(v),c[_].add(v))}let U=this.groups;U.length===0&&(U=[{start:0,count:t.count}]);for(let M=0,g=U.length;M<g;++M){const _=U[M],T=_.start,I=_.count;for(let b=T,K=T+I;b<K;b+=3)f(t.getX(b+0),t.getX(b+1),t.getX(b+2))}const L=new N,P=new N,H=new N,O=new N;function E(M){H.fromBufferAttribute(s,M),O.copy(H);const g=l[M];L.copy(g),L.sub(H.multiplyScalar(H.dot(g))).normalize(),P.crossVectors(O,g);const T=P.dot(c[M])<0?-1:1;a.setXYZW(M,L.x,L.y,L.z,T)}for(let M=0,g=U.length;M<g;++M){const _=U[M],T=_.start,I=_.count;for(let b=T,K=T+I;b<K;b+=3)E(t.getX(b+0)),E(t.getX(b+1)),E(t.getX(b+2))}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Fe(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let m=0,x=n.count;m<x;m++)n.setXYZ(m,0,0,0);const s=new N,r=new N,a=new N,l=new N,c=new N,h=new N,d=new N,p=new N;if(t)for(let m=0,x=t.count;m<x;m+=3){const S=t.getX(m+0),w=t.getX(m+1),v=t.getX(m+2);s.fromBufferAttribute(e,S),r.fromBufferAttribute(e,w),a.fromBufferAttribute(e,v),d.subVectors(a,r),p.subVectors(s,r),d.cross(p),l.fromBufferAttribute(n,S),c.fromBufferAttribute(n,w),h.fromBufferAttribute(n,v),l.add(d),c.add(d),h.add(d),n.setXYZ(S,l.x,l.y,l.z),n.setXYZ(w,c.x,c.y,c.z),n.setXYZ(v,h.x,h.y,h.z)}else for(let m=0,x=e.count;m<x;m+=3)s.fromBufferAttribute(e,m+0),r.fromBufferAttribute(e,m+1),a.fromBufferAttribute(e,m+2),d.subVectors(a,r),p.subVectors(s,r),d.cross(p),n.setXYZ(m+0,d.x,d.y,d.z),n.setXYZ(m+1,d.x,d.y,d.z),n.setXYZ(m+2,d.x,d.y,d.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)Ne.fromBufferAttribute(t,e),Ne.normalize(),t.setXYZ(e,Ne.x,Ne.y,Ne.z)}toNonIndexed(){function t(l,c){const h=l.array,d=l.itemSize,p=l.normalized,m=new h.constructor(c.length*d);let x=0,S=0;for(let w=0,v=c.length;w<v;w++){l.isInterleavedBufferAttribute?x=c[w]*l.data.stride+l.offset:x=c[w]*d;for(let f=0;f<d;f++)m[S++]=h[x++]}return new Fe(m,d,p)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new be,n=this.index.array,s=this.attributes;for(const l in s){const c=s[l],h=t(c,n);e.setAttribute(l,h)}const r=this.morphAttributes;for(const l in r){const c=[],h=r[l];for(let d=0,p=h.length;d<p;d++){const m=h[d],x=t(m,n);c.push(x)}e.morphAttributes[l]=c}e.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let l=0,c=a.length;l<c;l++){const h=a[l];e.addGroup(h.start,h.count,h.materialIndex)}return e}toJSON(){const t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const h in c)c[h]!==void 0&&(t[h]=c[h]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const n=this.attributes;for(const c in n){const h=n[c];t.data.attributes[c]=h.toJSON(t.data)}const s={};let r=!1;for(const c in this.morphAttributes){const h=this.morphAttributes[c],d=[];for(let p=0,m=h.length;p<m;p++){const x=h[p];d.push(x.toJSON(t.data))}d.length>0&&(s[c]=d,r=!0)}r&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(t.data.groups=JSON.parse(JSON.stringify(a)));const l=this.boundingSphere;return l!==null&&(t.data.boundingSphere={center:l.center.toArray(),radius:l.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const n=t.index;n!==null&&this.setIndex(n.clone(e));const s=t.attributes;for(const h in s){const d=s[h];this.setAttribute(h,d.clone(e))}const r=t.morphAttributes;for(const h in r){const d=[],p=r[h];for(let m=0,x=p.length;m<x;m++)d.push(p[m].clone(e));this.morphAttributes[h]=d}this.morphTargetsRelative=t.morphTargetsRelative;const a=t.groups;for(let h=0,d=a.length;h<d;h++){const p=a[h];this.addGroup(p.start,p.count,p.materialIndex)}const l=t.boundingBox;l!==null&&(this.boundingBox=l.clone());const c=t.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Jh=new xe,Pi=new jo,Jr=new Sr,Zh=new N,Zr=new N,Qr=new N,to=new N,Na=new N,eo=new N,Qh=new N,no=new N;class Bt extends Pe{constructor(t=new be,e=new $o){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const l=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[l]=r}}}}getVertexPosition(t,e){const n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,a=n.morphTargetsRelative;e.fromBufferAttribute(s,t);const l=this.morphTargetInfluences;if(r&&l){eo.set(0,0,0);for(let c=0,h=r.length;c<h;c++){const d=l[c],p=r[c];d!==0&&(Na.fromBufferAttribute(p,t),a?eo.addScaledVector(Na,d):eo.addScaledVector(Na.sub(e),d))}e.add(eo)}return e}raycast(t,e){const n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Jr.copy(n.boundingSphere),Jr.applyMatrix4(r),Pi.copy(t.ray).recast(t.near),!(Jr.containsPoint(Pi.origin)===!1&&(Pi.intersectSphere(Jr,Zh)===null||Pi.origin.distanceToSquared(Zh)>(t.far-t.near)**2))&&(Jh.copy(r).invert(),Pi.copy(t.ray).applyMatrix4(Jh),!(n.boundingBox!==null&&Pi.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,Pi)))}_computeIntersections(t,e,n){let s;const r=this.geometry,a=this.material,l=r.index,c=r.attributes.position,h=r.attributes.uv,d=r.attributes.uv1,p=r.attributes.normal,m=r.groups,x=r.drawRange;if(l!==null)if(Array.isArray(a))for(let S=0,w=m.length;S<w;S++){const v=m[S],f=a[v.materialIndex],U=Math.max(v.start,x.start),L=Math.min(l.count,Math.min(v.start+v.count,x.start+x.count));for(let P=U,H=L;P<H;P+=3){const O=l.getX(P),E=l.getX(P+1),M=l.getX(P+2);s=io(this,f,t,n,h,d,p,O,E,M),s&&(s.faceIndex=Math.floor(P/3),s.face.materialIndex=v.materialIndex,e.push(s))}}else{const S=Math.max(0,x.start),w=Math.min(l.count,x.start+x.count);for(let v=S,f=w;v<f;v+=3){const U=l.getX(v),L=l.getX(v+1),P=l.getX(v+2);s=io(this,a,t,n,h,d,p,U,L,P),s&&(s.faceIndex=Math.floor(v/3),e.push(s))}}else if(c!==void 0)if(Array.isArray(a))for(let S=0,w=m.length;S<w;S++){const v=m[S],f=a[v.materialIndex],U=Math.max(v.start,x.start),L=Math.min(c.count,Math.min(v.start+v.count,x.start+x.count));for(let P=U,H=L;P<H;P+=3){const O=P,E=P+1,M=P+2;s=io(this,f,t,n,h,d,p,O,E,M),s&&(s.faceIndex=Math.floor(P/3),s.face.materialIndex=v.materialIndex,e.push(s))}}else{const S=Math.max(0,x.start),w=Math.min(c.count,x.start+x.count);for(let v=S,f=w;v<f;v+=3){const U=v,L=v+1,P=v+2;s=io(this,a,t,n,h,d,p,U,L,P),s&&(s.faceIndex=Math.floor(v/3),e.push(s))}}}}function y_(i,t,e,n,s,r,a,l){let c;if(t.side===Ze?c=n.intersectTriangle(a,r,s,!0,l):c=n.intersectTriangle(s,r,a,t.side===Ei,l),c===null)return null;no.copy(l),no.applyMatrix4(i.matrixWorld);const h=e.ray.origin.distanceTo(no);return h<e.near||h>e.far?null:{distance:h,point:no.clone(),object:i}}function io(i,t,e,n,s,r,a,l,c,h){i.getVertexPosition(l,Zr),i.getVertexPosition(c,Qr),i.getVertexPosition(h,to);const d=y_(i,t,e,n,Zr,Qr,to,Qh);if(d){const p=new N;pn.getBarycoord(Qh,Zr,Qr,to,p),s&&(d.uv=pn.getInterpolatedAttribute(s,l,c,h,p,new At)),r&&(d.uv1=pn.getInterpolatedAttribute(r,l,c,h,p,new At)),a&&(d.normal=pn.getInterpolatedAttribute(a,l,c,h,p,new N),d.normal.dot(n.direction)>0&&d.normal.multiplyScalar(-1));const m={a:l,b:c,c:h,normal:new N,materialIndex:0};pn.getNormal(Zr,Qr,to,m.normal),d.face=m,d.barycoord=p}return d}class gn extends be{constructor(t=1,e=1,n=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:s,heightSegments:r,depthSegments:a};const l=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);const c=[],h=[],d=[],p=[];let m=0,x=0;S("z","y","x",-1,-1,n,e,t,a,r,0),S("z","y","x",1,-1,n,e,-t,a,r,1),S("x","z","y",1,1,t,n,e,s,a,2),S("x","z","y",1,-1,t,n,-e,s,a,3),S("x","y","z",1,-1,t,e,n,s,r,4),S("x","y","z",-1,-1,t,e,-n,s,r,5),this.setIndex(c),this.setAttribute("position",new Te(h,3)),this.setAttribute("normal",new Te(d,3)),this.setAttribute("uv",new Te(p,2));function S(w,v,f,U,L,P,H,O,E,M,g){const _=P/E,T=H/M,I=P/2,b=H/2,K=O/2,Q=E+1,J=M+1;let nt=0,$=0;const ut=new N;for(let vt=0;vt<J;vt++){const Ct=vt*T-b;for(let Ft=0;Ft<Q;Ft++){const kt=Ft*_-I;ut[w]=kt*U,ut[v]=Ct*L,ut[f]=K,h.push(ut.x,ut.y,ut.z),ut[w]=0,ut[v]=0,ut[f]=O>0?1:-1,d.push(ut.x,ut.y,ut.z),p.push(Ft/E),p.push(1-vt/M),nt+=1}}for(let vt=0;vt<M;vt++)for(let Ct=0;Ct<E;Ct++){const Ft=m+Ct+Q*vt,kt=m+Ct+Q*(vt+1),Z=m+(Ct+1)+Q*(vt+1),st=m+(Ct+1)+Q*vt;c.push(Ft,kt,st),c.push(kt,Z,st),$+=6}l.addGroup(x,$,g),x+=$,m+=nt}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new gn(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function Us(i){const t={};for(const e in i){t[e]={};for(const n in i[e]){const s=i[e][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=s.clone():Array.isArray(s)?t[e][n]=s.slice():t[e][n]=s}}return t}function Ye(i){const t={};for(let e=0;e<i.length;e++){const n=Us(i[e]);for(const s in n)t[s]=n[s]}return t}function x_(i){const t=[];for(let e=0;e<i.length;e++)t.push(i[e].clone());return t}function id(i){const t=i.getRenderTarget();return t===null?i.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:ee.workingColorSpace}const gr={clone:Us,merge:Ye};var M_=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,S_=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Re extends wi{static get type(){return"ShaderMaterial"}constructor(t){super(),this.isShaderMaterial=!0,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=M_,this.fragmentShader=S_,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Us(t.uniforms),this.uniformsGroups=x_(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const s in this.uniforms){const a=this.uniforms[s].value;a&&a.isTexture?e.uniforms[s]={type:"t",value:a.toJSON(t).uuid}:a&&a.isColor?e.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?e.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?e.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?e.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?e.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?e.uniforms[s]={type:"m4",value:a.toArray()}:e.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const n={};for(const s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}}class sd extends Pe{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new xe,this.projectionMatrix=new xe,this.projectionMatrixInverse=new xe,this.coordinateSystem=Jn}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const gi=new N,tu=new At,eu=new At;class cn extends sd{constructor(t=50,e=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=Hl*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(ma*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return Hl*2*Math.atan(Math.tan(ma*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){gi.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(gi.x,gi.y).multiplyScalar(-t/gi.z),gi.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(gi.x,gi.y).multiplyScalar(-t/gi.z)}getViewSize(t,e){return this.getViewBounds(t,tu,eu),e.subVectors(eu,tu)}setViewOffset(t,e,n,s,r,a){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(ma*.5*this.fov)/this.zoom,n=2*e,s=this.aspect*n,r=-.5*s;const a=this.view;if(this.view!==null&&this.view.enabled){const c=a.fullWidth,h=a.fullHeight;r+=a.offsetX*s/c,e-=a.offsetY*n/h,s*=a.width/c,n*=a.height/h}const l=this.filmOffset;l!==0&&(r+=t*l/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,e,e-n,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const us=-90,fs=1;class E_ extends Pe{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new cn(us,fs,t,e);s.layers=this.layers,this.add(s);const r=new cn(us,fs,t,e);r.layers=this.layers,this.add(r);const a=new cn(us,fs,t,e);a.layers=this.layers,this.add(a);const l=new cn(us,fs,t,e);l.layers=this.layers,this.add(l);const c=new cn(us,fs,t,e);c.layers=this.layers,this.add(c);const h=new cn(us,fs,t,e);h.layers=this.layers,this.add(h)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[n,s,r,a,l,c]=e;for(const h of e)this.remove(h);if(t===Jn)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),l.up.set(0,1,0),l.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(t===Oo)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),l.up.set(0,-1,0),l.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const h of e)this.add(h),h.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[r,a,l,c,h,d]=this.children,p=t.getRenderTarget(),m=t.getActiveCubeFace(),x=t.getActiveMipmapLevel(),S=t.xr.enabled;t.xr.enabled=!1;const w=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,s),t.render(e,r),t.setRenderTarget(n,1,s),t.render(e,a),t.setRenderTarget(n,2,s),t.render(e,l),t.setRenderTarget(n,3,s),t.render(e,c),t.setRenderTarget(n,4,s),t.render(e,h),n.texture.generateMipmaps=w,t.setRenderTarget(n,5,s),t.render(e,d),t.setRenderTarget(p,m,x),t.xr.enabled=S,n.texture.needsPMREMUpdate=!0}}class cc extends Qe{constructor(t,e,n,s,r,a,l,c,h,d){t=t!==void 0?t:[],e=e!==void 0?e:Ps,super(t,e,n,s,r,a,l,c,h,d),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class T_ extends Cn{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const n={width:t,height:t,depth:1},s=[n,n,n,n,n,n];this.texture=new cc(s,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:mn}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new gn(5,5,5),r=new Re({name:"CubemapFromEquirect",uniforms:Us(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Ze,blending:Zn});r.uniforms.tEquirect.value=e;const a=new Bt(s,r),l=e.minFilter;return e.minFilter===Gi&&(e.minFilter=mn),new E_(1,10,this).update(t,a),e.minFilter=l,a.geometry.dispose(),a.material.dispose(),this}clear(t,e,n,s){const r=t.getRenderTarget();for(let a=0;a<6;a++)t.setRenderTarget(this,a),t.clear(e,n,s);t.setRenderTarget(r)}}const Oa=new N,w_=new N,b_=new Wt;class Ui{constructor(t=new N(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,s){return this.normal.set(t,e,n),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){const s=Oa.subVectors(n,e).cross(w_.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const n=t.delta(Oa),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const r=-(t.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:e.copy(t.start).addScaledVector(n,r)}intersectsLine(t){const e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const n=e||b_.getNormalMatrix(t),s=this.coplanarPoint(Oa).applyMatrix4(t),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Ii=new Sr,so=new N;class hc{constructor(t=new Ui,e=new Ui,n=new Ui,s=new Ui,r=new Ui,a=new Ui){this.planes=[t,e,n,s,r,a]}set(t,e,n,s,r,a){const l=this.planes;return l[0].copy(t),l[1].copy(e),l[2].copy(n),l[3].copy(s),l[4].copy(r),l[5].copy(a),this}copy(t){const e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=Jn){const n=this.planes,s=t.elements,r=s[0],a=s[1],l=s[2],c=s[3],h=s[4],d=s[5],p=s[6],m=s[7],x=s[8],S=s[9],w=s[10],v=s[11],f=s[12],U=s[13],L=s[14],P=s[15];if(n[0].setComponents(c-r,m-h,v-x,P-f).normalize(),n[1].setComponents(c+r,m+h,v+x,P+f).normalize(),n[2].setComponents(c+a,m+d,v+S,P+U).normalize(),n[3].setComponents(c-a,m-d,v-S,P-U).normalize(),n[4].setComponents(c-l,m-p,v-w,P-L).normalize(),e===Jn)n[5].setComponents(c+l,m+p,v+w,P+L).normalize();else if(e===Oo)n[5].setComponents(l,p,w,L).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),Ii.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),Ii.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(Ii)}intersectsSprite(t){return Ii.center.set(0,0,0),Ii.radius=.7071067811865476,Ii.applyMatrix4(t.matrixWorld),this.intersectsSphere(Ii)}intersectsSphere(t){const e=this.planes,n=t.center,s=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(t){const e=this.planes;for(let n=0;n<6;n++){const s=e[n];if(so.x=s.normal.x>0?t.max.x:t.min.x,so.y=s.normal.y>0?t.max.y:t.min.y,so.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(so)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function rd(){let i=null,t=!1,e=null,n=null;function s(r,a){e(r,a),n=i.requestAnimationFrame(s)}return{start:function(){t!==!0&&e!==null&&(n=i.requestAnimationFrame(s),t=!0)},stop:function(){i.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){i=r}}}function A_(i){const t=new WeakMap;function e(l,c){const h=l.array,d=l.usage,p=h.byteLength,m=i.createBuffer();i.bindBuffer(c,m),i.bufferData(c,h,d),l.onUploadCallback();let x;if(h instanceof Float32Array)x=i.FLOAT;else if(h instanceof Uint16Array)l.isFloat16BufferAttribute?x=i.HALF_FLOAT:x=i.UNSIGNED_SHORT;else if(h instanceof Int16Array)x=i.SHORT;else if(h instanceof Uint32Array)x=i.UNSIGNED_INT;else if(h instanceof Int32Array)x=i.INT;else if(h instanceof Int8Array)x=i.BYTE;else if(h instanceof Uint8Array)x=i.UNSIGNED_BYTE;else if(h instanceof Uint8ClampedArray)x=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+h);return{buffer:m,type:x,bytesPerElement:h.BYTES_PER_ELEMENT,version:l.version,size:p}}function n(l,c,h){const d=c.array,p=c.updateRanges;if(i.bindBuffer(h,l),p.length===0)i.bufferSubData(h,0,d);else{p.sort((x,S)=>x.start-S.start);let m=0;for(let x=1;x<p.length;x++){const S=p[m],w=p[x];w.start<=S.start+S.count+1?S.count=Math.max(S.count,w.start+w.count-S.start):(++m,p[m]=w)}p.length=m+1;for(let x=0,S=p.length;x<S;x++){const w=p[x];i.bufferSubData(h,w.start*d.BYTES_PER_ELEMENT,d,w.start,w.count)}c.clearUpdateRanges()}c.onUploadCallback()}function s(l){return l.isInterleavedBufferAttribute&&(l=l.data),t.get(l)}function r(l){l.isInterleavedBufferAttribute&&(l=l.data);const c=t.get(l);c&&(i.deleteBuffer(c.buffer),t.delete(l))}function a(l,c){if(l.isInterleavedBufferAttribute&&(l=l.data),l.isGLBufferAttribute){const d=t.get(l);(!d||d.version<l.version)&&t.set(l,{buffer:l.buffer,type:l.type,bytesPerElement:l.elementSize,version:l.version});return}const h=t.get(l);if(h===void 0)t.set(l,e(l,c));else if(h.version<l.version){if(h.size!==l.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(h.buffer,l,c),h.version=l.version}}return{get:s,remove:r,update:a}}class ks extends be{constructor(t=1,e=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:s};const r=t/2,a=e/2,l=Math.floor(n),c=Math.floor(s),h=l+1,d=c+1,p=t/l,m=e/c,x=[],S=[],w=[],v=[];for(let f=0;f<d;f++){const U=f*m-a;for(let L=0;L<h;L++){const P=L*p-r;S.push(P,-U,0),w.push(0,0,1),v.push(L/l),v.push(1-f/c)}}for(let f=0;f<c;f++)for(let U=0;U<l;U++){const L=U+h*f,P=U+h*(f+1),H=U+1+h*(f+1),O=U+1+h*f;x.push(L,P,O),x.push(P,H,O)}this.setIndex(x),this.setAttribute("position",new Te(S,3)),this.setAttribute("normal",new Te(w,3)),this.setAttribute("uv",new Te(v,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ks(t.width,t.height,t.widthSegments,t.heightSegments)}}var C_=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,R_=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,P_=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,I_=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,D_=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,L_=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,U_=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,N_=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,O_=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,F_=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,B_=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,k_=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,z_=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,V_=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,H_=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,G_=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,W_=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,X_=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,q_=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,j_=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,$_=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Y_=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,K_=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,J_=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,Z_=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,Q_=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,t0=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,e0=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,n0=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,i0=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,s0="gl_FragColor = linearToOutputTexel( gl_FragColor );",r0=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,o0=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,a0=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,l0=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,c0=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,h0=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,u0=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,f0=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,d0=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,p0=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,m0=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,g0=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,_0=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,v0=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,y0=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,x0=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,M0=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,S0=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,E0=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,T0=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,w0=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,b0=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,A0=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,C0=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,R0=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,P0=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,I0=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,D0=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,L0=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,U0=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,N0=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,O0=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,F0=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,B0=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,k0=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,z0=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,V0=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,H0=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,G0=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,W0=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,X0=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,q0=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,j0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,$0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Y0=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,K0=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,J0=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Z0=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Q0=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,tv=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,ev=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,nv=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,iv=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,sv=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,rv=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,ov=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,av=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,lv=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,cv=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,hv=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,uv=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,fv=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,dv=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,pv=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,mv=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,gv=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,_v=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,vv=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,yv=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,xv=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,Mv=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,Sv=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
		
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
		
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		
		#else
		
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,Ev=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Tv=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,wv=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,bv=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Av=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Cv=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Rv=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Pv=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Iv=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Dv=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Lv=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,Uv=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,Nv=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,Ov=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,Fv=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Bv=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,kv=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,zv=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Vv=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,Hv=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Gv=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Wv=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Xv=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,qv=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,jv=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,$v=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,Yv=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Kv=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Jv=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,Zv=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Qv=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,ty=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,ey=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,ny=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,iy=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,sy=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,ry=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,oy=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Xt={alphahash_fragment:C_,alphahash_pars_fragment:R_,alphamap_fragment:P_,alphamap_pars_fragment:I_,alphatest_fragment:D_,alphatest_pars_fragment:L_,aomap_fragment:U_,aomap_pars_fragment:N_,batching_pars_vertex:O_,batching_vertex:F_,begin_vertex:B_,beginnormal_vertex:k_,bsdfs:z_,iridescence_fragment:V_,bumpmap_pars_fragment:H_,clipping_planes_fragment:G_,clipping_planes_pars_fragment:W_,clipping_planes_pars_vertex:X_,clipping_planes_vertex:q_,color_fragment:j_,color_pars_fragment:$_,color_pars_vertex:Y_,color_vertex:K_,common:J_,cube_uv_reflection_fragment:Z_,defaultnormal_vertex:Q_,displacementmap_pars_vertex:t0,displacementmap_vertex:e0,emissivemap_fragment:n0,emissivemap_pars_fragment:i0,colorspace_fragment:s0,colorspace_pars_fragment:r0,envmap_fragment:o0,envmap_common_pars_fragment:a0,envmap_pars_fragment:l0,envmap_pars_vertex:c0,envmap_physical_pars_fragment:x0,envmap_vertex:h0,fog_vertex:u0,fog_pars_vertex:f0,fog_fragment:d0,fog_pars_fragment:p0,gradientmap_pars_fragment:m0,lightmap_pars_fragment:g0,lights_lambert_fragment:_0,lights_lambert_pars_fragment:v0,lights_pars_begin:y0,lights_toon_fragment:M0,lights_toon_pars_fragment:S0,lights_phong_fragment:E0,lights_phong_pars_fragment:T0,lights_physical_fragment:w0,lights_physical_pars_fragment:b0,lights_fragment_begin:A0,lights_fragment_maps:C0,lights_fragment_end:R0,logdepthbuf_fragment:P0,logdepthbuf_pars_fragment:I0,logdepthbuf_pars_vertex:D0,logdepthbuf_vertex:L0,map_fragment:U0,map_pars_fragment:N0,map_particle_fragment:O0,map_particle_pars_fragment:F0,metalnessmap_fragment:B0,metalnessmap_pars_fragment:k0,morphinstance_vertex:z0,morphcolor_vertex:V0,morphnormal_vertex:H0,morphtarget_pars_vertex:G0,morphtarget_vertex:W0,normal_fragment_begin:X0,normal_fragment_maps:q0,normal_pars_fragment:j0,normal_pars_vertex:$0,normal_vertex:Y0,normalmap_pars_fragment:K0,clearcoat_normal_fragment_begin:J0,clearcoat_normal_fragment_maps:Z0,clearcoat_pars_fragment:Q0,iridescence_pars_fragment:tv,opaque_fragment:ev,packing:nv,premultiplied_alpha_fragment:iv,project_vertex:sv,dithering_fragment:rv,dithering_pars_fragment:ov,roughnessmap_fragment:av,roughnessmap_pars_fragment:lv,shadowmap_pars_fragment:cv,shadowmap_pars_vertex:hv,shadowmap_vertex:uv,shadowmask_pars_fragment:fv,skinbase_vertex:dv,skinning_pars_vertex:pv,skinning_vertex:mv,skinnormal_vertex:gv,specularmap_fragment:_v,specularmap_pars_fragment:vv,tonemapping_fragment:yv,tonemapping_pars_fragment:xv,transmission_fragment:Mv,transmission_pars_fragment:Sv,uv_pars_fragment:Ev,uv_pars_vertex:Tv,uv_vertex:wv,worldpos_vertex:bv,background_vert:Av,background_frag:Cv,backgroundCube_vert:Rv,backgroundCube_frag:Pv,cube_vert:Iv,cube_frag:Dv,depth_vert:Lv,depth_frag:Uv,distanceRGBA_vert:Nv,distanceRGBA_frag:Ov,equirect_vert:Fv,equirect_frag:Bv,linedashed_vert:kv,linedashed_frag:zv,meshbasic_vert:Vv,meshbasic_frag:Hv,meshlambert_vert:Gv,meshlambert_frag:Wv,meshmatcap_vert:Xv,meshmatcap_frag:qv,meshnormal_vert:jv,meshnormal_frag:$v,meshphong_vert:Yv,meshphong_frag:Kv,meshphysical_vert:Jv,meshphysical_frag:Zv,meshtoon_vert:Qv,meshtoon_frag:ty,points_vert:ey,points_frag:ny,shadow_vert:iy,shadow_frag:sy,sprite_vert:ry,sprite_frag:oy},dt={common:{diffuse:{value:new Pt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Wt},alphaMap:{value:null},alphaMapTransform:{value:new Wt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Wt}},envmap:{envMap:{value:null},envMapRotation:{value:new Wt},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Wt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Wt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Wt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Wt},normalScale:{value:new At(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Wt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Wt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Wt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Wt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Pt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Pt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Wt},alphaTest:{value:0},uvTransform:{value:new Wt}},sprite:{diffuse:{value:new Pt(16777215)},opacity:{value:1},center:{value:new At(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Wt},alphaMap:{value:null},alphaMapTransform:{value:new Wt},alphaTest:{value:0}}},Un={basic:{uniforms:Ye([dt.common,dt.specularmap,dt.envmap,dt.aomap,dt.lightmap,dt.fog]),vertexShader:Xt.meshbasic_vert,fragmentShader:Xt.meshbasic_frag},lambert:{uniforms:Ye([dt.common,dt.specularmap,dt.envmap,dt.aomap,dt.lightmap,dt.emissivemap,dt.bumpmap,dt.normalmap,dt.displacementmap,dt.fog,dt.lights,{emissive:{value:new Pt(0)}}]),vertexShader:Xt.meshlambert_vert,fragmentShader:Xt.meshlambert_frag},phong:{uniforms:Ye([dt.common,dt.specularmap,dt.envmap,dt.aomap,dt.lightmap,dt.emissivemap,dt.bumpmap,dt.normalmap,dt.displacementmap,dt.fog,dt.lights,{emissive:{value:new Pt(0)},specular:{value:new Pt(1118481)},shininess:{value:30}}]),vertexShader:Xt.meshphong_vert,fragmentShader:Xt.meshphong_frag},standard:{uniforms:Ye([dt.common,dt.envmap,dt.aomap,dt.lightmap,dt.emissivemap,dt.bumpmap,dt.normalmap,dt.displacementmap,dt.roughnessmap,dt.metalnessmap,dt.fog,dt.lights,{emissive:{value:new Pt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Xt.meshphysical_vert,fragmentShader:Xt.meshphysical_frag},toon:{uniforms:Ye([dt.common,dt.aomap,dt.lightmap,dt.emissivemap,dt.bumpmap,dt.normalmap,dt.displacementmap,dt.gradientmap,dt.fog,dt.lights,{emissive:{value:new Pt(0)}}]),vertexShader:Xt.meshtoon_vert,fragmentShader:Xt.meshtoon_frag},matcap:{uniforms:Ye([dt.common,dt.bumpmap,dt.normalmap,dt.displacementmap,dt.fog,{matcap:{value:null}}]),vertexShader:Xt.meshmatcap_vert,fragmentShader:Xt.meshmatcap_frag},points:{uniforms:Ye([dt.points,dt.fog]),vertexShader:Xt.points_vert,fragmentShader:Xt.points_frag},dashed:{uniforms:Ye([dt.common,dt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Xt.linedashed_vert,fragmentShader:Xt.linedashed_frag},depth:{uniforms:Ye([dt.common,dt.displacementmap]),vertexShader:Xt.depth_vert,fragmentShader:Xt.depth_frag},normal:{uniforms:Ye([dt.common,dt.bumpmap,dt.normalmap,dt.displacementmap,{opacity:{value:1}}]),vertexShader:Xt.meshnormal_vert,fragmentShader:Xt.meshnormal_frag},sprite:{uniforms:Ye([dt.sprite,dt.fog]),vertexShader:Xt.sprite_vert,fragmentShader:Xt.sprite_frag},background:{uniforms:{uvTransform:{value:new Wt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Xt.background_vert,fragmentShader:Xt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Wt}},vertexShader:Xt.backgroundCube_vert,fragmentShader:Xt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Xt.cube_vert,fragmentShader:Xt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Xt.equirect_vert,fragmentShader:Xt.equirect_frag},distanceRGBA:{uniforms:Ye([dt.common,dt.displacementmap,{referencePosition:{value:new N},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Xt.distanceRGBA_vert,fragmentShader:Xt.distanceRGBA_frag},shadow:{uniforms:Ye([dt.lights,dt.fog,{color:{value:new Pt(0)},opacity:{value:1}}]),vertexShader:Xt.shadow_vert,fragmentShader:Xt.shadow_frag}};Un.physical={uniforms:Ye([Un.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Wt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Wt},clearcoatNormalScale:{value:new At(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Wt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Wt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Wt},sheen:{value:0},sheenColor:{value:new Pt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Wt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Wt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Wt},transmissionSamplerSize:{value:new At},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Wt},attenuationDistance:{value:0},attenuationColor:{value:new Pt(0)},specularColor:{value:new Pt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Wt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Wt},anisotropyVector:{value:new At},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Wt}}]),vertexShader:Xt.meshphysical_vert,fragmentShader:Xt.meshphysical_frag};const ro={r:0,b:0,g:0},Di=new Rn,ay=new xe;function ly(i,t,e,n,s,r,a){const l=new Pt(0);let c=r===!0?0:1,h,d,p=null,m=0,x=null;function S(U){let L=U.isScene===!0?U.background:null;return L&&L.isTexture&&(L=(U.backgroundBlurriness>0?e:t).get(L)),L}function w(U){let L=!1;const P=S(U);P===null?f(l,c):P&&P.isColor&&(f(P,1),L=!0);const H=i.xr.getEnvironmentBlendMode();H==="additive"?n.buffers.color.setClear(0,0,0,1,a):H==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,a),(i.autoClear||L)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function v(U,L){const P=S(L);P&&(P.isCubeTexture||P.mapping===Xo)?(d===void 0&&(d=new Bt(new gn(1,1,1),new Re({name:"BackgroundCubeMaterial",uniforms:Us(Un.backgroundCube.uniforms),vertexShader:Un.backgroundCube.vertexShader,fragmentShader:Un.backgroundCube.fragmentShader,side:Ze,depthTest:!1,depthWrite:!1,fog:!1})),d.geometry.deleteAttribute("normal"),d.geometry.deleteAttribute("uv"),d.onBeforeRender=function(H,O,E){this.matrixWorld.copyPosition(E.matrixWorld)},Object.defineProperty(d.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(d)),Di.copy(L.backgroundRotation),Di.x*=-1,Di.y*=-1,Di.z*=-1,P.isCubeTexture&&P.isRenderTargetTexture===!1&&(Di.y*=-1,Di.z*=-1),d.material.uniforms.envMap.value=P,d.material.uniforms.flipEnvMap.value=P.isCubeTexture&&P.isRenderTargetTexture===!1?-1:1,d.material.uniforms.backgroundBlurriness.value=L.backgroundBlurriness,d.material.uniforms.backgroundIntensity.value=L.backgroundIntensity,d.material.uniforms.backgroundRotation.value.setFromMatrix4(ay.makeRotationFromEuler(Di)),d.material.toneMapped=ee.getTransfer(P.colorSpace)!==ce,(p!==P||m!==P.version||x!==i.toneMapping)&&(d.material.needsUpdate=!0,p=P,m=P.version,x=i.toneMapping),d.layers.enableAll(),U.unshift(d,d.geometry,d.material,0,0,null)):P&&P.isTexture&&(h===void 0&&(h=new Bt(new ks(2,2),new Re({name:"BackgroundMaterial",uniforms:Us(Un.background.uniforms),vertexShader:Un.background.vertexShader,fragmentShader:Un.background.fragmentShader,side:Ei,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),Object.defineProperty(h.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(h)),h.material.uniforms.t2D.value=P,h.material.uniforms.backgroundIntensity.value=L.backgroundIntensity,h.material.toneMapped=ee.getTransfer(P.colorSpace)!==ce,P.matrixAutoUpdate===!0&&P.updateMatrix(),h.material.uniforms.uvTransform.value.copy(P.matrix),(p!==P||m!==P.version||x!==i.toneMapping)&&(h.material.needsUpdate=!0,p=P,m=P.version,x=i.toneMapping),h.layers.enableAll(),U.unshift(h,h.geometry,h.material,0,0,null))}function f(U,L){U.getRGB(ro,id(i)),n.buffers.color.setClear(ro.r,ro.g,ro.b,L,a)}return{getClearColor:function(){return l},setClearColor:function(U,L=1){l.set(U),c=L,f(l,c)},getClearAlpha:function(){return c},setClearAlpha:function(U){c=U,f(l,c)},render:w,addToRenderList:v}}function cy(i,t){const e=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=m(null);let r=s,a=!1;function l(_,T,I,b,K){let Q=!1;const J=p(b,I,T);r!==J&&(r=J,h(r.object)),Q=x(_,b,I,K),Q&&S(_,b,I,K),K!==null&&t.update(K,i.ELEMENT_ARRAY_BUFFER),(Q||a)&&(a=!1,P(_,T,I,b),K!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,t.get(K).buffer))}function c(){return i.createVertexArray()}function h(_){return i.bindVertexArray(_)}function d(_){return i.deleteVertexArray(_)}function p(_,T,I){const b=I.wireframe===!0;let K=n[_.id];K===void 0&&(K={},n[_.id]=K);let Q=K[T.id];Q===void 0&&(Q={},K[T.id]=Q);let J=Q[b];return J===void 0&&(J=m(c()),Q[b]=J),J}function m(_){const T=[],I=[],b=[];for(let K=0;K<e;K++)T[K]=0,I[K]=0,b[K]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:T,enabledAttributes:I,attributeDivisors:b,object:_,attributes:{},index:null}}function x(_,T,I,b){const K=r.attributes,Q=T.attributes;let J=0;const nt=I.getAttributes();for(const $ in nt)if(nt[$].location>=0){const vt=K[$];let Ct=Q[$];if(Ct===void 0&&($==="instanceMatrix"&&_.instanceMatrix&&(Ct=_.instanceMatrix),$==="instanceColor"&&_.instanceColor&&(Ct=_.instanceColor)),vt===void 0||vt.attribute!==Ct||Ct&&vt.data!==Ct.data)return!0;J++}return r.attributesNum!==J||r.index!==b}function S(_,T,I,b){const K={},Q=T.attributes;let J=0;const nt=I.getAttributes();for(const $ in nt)if(nt[$].location>=0){let vt=Q[$];vt===void 0&&($==="instanceMatrix"&&_.instanceMatrix&&(vt=_.instanceMatrix),$==="instanceColor"&&_.instanceColor&&(vt=_.instanceColor));const Ct={};Ct.attribute=vt,vt&&vt.data&&(Ct.data=vt.data),K[$]=Ct,J++}r.attributes=K,r.attributesNum=J,r.index=b}function w(){const _=r.newAttributes;for(let T=0,I=_.length;T<I;T++)_[T]=0}function v(_){f(_,0)}function f(_,T){const I=r.newAttributes,b=r.enabledAttributes,K=r.attributeDivisors;I[_]=1,b[_]===0&&(i.enableVertexAttribArray(_),b[_]=1),K[_]!==T&&(i.vertexAttribDivisor(_,T),K[_]=T)}function U(){const _=r.newAttributes,T=r.enabledAttributes;for(let I=0,b=T.length;I<b;I++)T[I]!==_[I]&&(i.disableVertexAttribArray(I),T[I]=0)}function L(_,T,I,b,K,Q,J){J===!0?i.vertexAttribIPointer(_,T,I,K,Q):i.vertexAttribPointer(_,T,I,b,K,Q)}function P(_,T,I,b){w();const K=b.attributes,Q=I.getAttributes(),J=T.defaultAttributeValues;for(const nt in Q){const $=Q[nt];if($.location>=0){let ut=K[nt];if(ut===void 0&&(nt==="instanceMatrix"&&_.instanceMatrix&&(ut=_.instanceMatrix),nt==="instanceColor"&&_.instanceColor&&(ut=_.instanceColor)),ut!==void 0){const vt=ut.normalized,Ct=ut.itemSize,Ft=t.get(ut);if(Ft===void 0)continue;const kt=Ft.buffer,Z=Ft.type,st=Ft.bytesPerElement,bt=Z===i.INT||Z===i.UNSIGNED_INT||ut.gpuType===nc;if(ut.isInterleavedBufferAttribute){const ct=ut.data,Ut=ct.stride,zt=ut.offset;if(ct.isInstancedInterleavedBuffer){for(let Ht=0;Ht<$.locationSize;Ht++)f($.location+Ht,ct.meshPerAttribute);_.isInstancedMesh!==!0&&b._maxInstanceCount===void 0&&(b._maxInstanceCount=ct.meshPerAttribute*ct.count)}else for(let Ht=0;Ht<$.locationSize;Ht++)v($.location+Ht);i.bindBuffer(i.ARRAY_BUFFER,kt);for(let Ht=0;Ht<$.locationSize;Ht++)L($.location+Ht,Ct/$.locationSize,Z,vt,Ut*st,(zt+Ct/$.locationSize*Ht)*st,bt)}else{if(ut.isInstancedBufferAttribute){for(let ct=0;ct<$.locationSize;ct++)f($.location+ct,ut.meshPerAttribute);_.isInstancedMesh!==!0&&b._maxInstanceCount===void 0&&(b._maxInstanceCount=ut.meshPerAttribute*ut.count)}else for(let ct=0;ct<$.locationSize;ct++)v($.location+ct);i.bindBuffer(i.ARRAY_BUFFER,kt);for(let ct=0;ct<$.locationSize;ct++)L($.location+ct,Ct/$.locationSize,Z,vt,Ct*st,Ct/$.locationSize*ct*st,bt)}}else if(J!==void 0){const vt=J[nt];if(vt!==void 0)switch(vt.length){case 2:i.vertexAttrib2fv($.location,vt);break;case 3:i.vertexAttrib3fv($.location,vt);break;case 4:i.vertexAttrib4fv($.location,vt);break;default:i.vertexAttrib1fv($.location,vt)}}}}U()}function H(){M();for(const _ in n){const T=n[_];for(const I in T){const b=T[I];for(const K in b)d(b[K].object),delete b[K];delete T[I]}delete n[_]}}function O(_){if(n[_.id]===void 0)return;const T=n[_.id];for(const I in T){const b=T[I];for(const K in b)d(b[K].object),delete b[K];delete T[I]}delete n[_.id]}function E(_){for(const T in n){const I=n[T];if(I[_.id]===void 0)continue;const b=I[_.id];for(const K in b)d(b[K].object),delete b[K];delete I[_.id]}}function M(){g(),a=!0,r!==s&&(r=s,h(r.object))}function g(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:l,reset:M,resetDefaultState:g,dispose:H,releaseStatesOfGeometry:O,releaseStatesOfProgram:E,initAttributes:w,enableAttribute:v,disableUnusedAttributes:U}}function hy(i,t,e){let n;function s(h){n=h}function r(h,d){i.drawArrays(n,h,d),e.update(d,n,1)}function a(h,d,p){p!==0&&(i.drawArraysInstanced(n,h,d,p),e.update(d,n,p))}function l(h,d,p){if(p===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,h,0,d,0,p);let x=0;for(let S=0;S<p;S++)x+=d[S];e.update(x,n,1)}function c(h,d,p,m){if(p===0)return;const x=t.get("WEBGL_multi_draw");if(x===null)for(let S=0;S<h.length;S++)a(h[S],d[S],m[S]);else{x.multiDrawArraysInstancedWEBGL(n,h,0,d,0,m,0,p);let S=0;for(let w=0;w<p;w++)S+=d[w]*m[w];e.update(S,n,1)}}this.setMode=s,this.render=r,this.renderInstances=a,this.renderMultiDraw=l,this.renderMultiDrawInstances=c}function uy(i,t,e,n){let s;function r(){if(s!==void 0)return s;if(t.has("EXT_texture_filter_anisotropic")===!0){const E=t.get("EXT_texture_filter_anisotropic");s=i.getParameter(E.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(E){return!(E!==wn&&n.convert(E)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function l(E){const M=E===Qn&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(E!==ni&&n.convert(E)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&E!==Kn&&!M)}function c(E){if(E==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";E="mediump"}return E==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let h=e.precision!==void 0?e.precision:"highp";const d=c(h);d!==h&&(console.warn("THREE.WebGLRenderer:",h,"not supported, using",d,"instead."),h=d);const p=e.logarithmicDepthBuffer===!0,m=e.reverseDepthBuffer===!0&&t.has("EXT_clip_control"),x=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),S=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),w=i.getParameter(i.MAX_TEXTURE_SIZE),v=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),f=i.getParameter(i.MAX_VERTEX_ATTRIBS),U=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),L=i.getParameter(i.MAX_VARYING_VECTORS),P=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),H=S>0,O=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:c,textureFormatReadable:a,textureTypeReadable:l,precision:h,logarithmicDepthBuffer:p,reverseDepthBuffer:m,maxTextures:x,maxVertexTextures:S,maxTextureSize:w,maxCubemapSize:v,maxAttributes:f,maxVertexUniforms:U,maxVaryings:L,maxFragmentUniforms:P,vertexTextures:H,maxSamples:O}}function fy(i){const t=this;let e=null,n=0,s=!1,r=!1;const a=new Ui,l=new Wt,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(p,m){const x=p.length!==0||m||n!==0||s;return s=m,n=p.length,x},this.beginShadows=function(){r=!0,d(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(p,m){e=d(p,m,0)},this.setState=function(p,m,x){const S=p.clippingPlanes,w=p.clipIntersection,v=p.clipShadows,f=i.get(p);if(!s||S===null||S.length===0||r&&!v)r?d(null):h();else{const U=r?0:n,L=U*4;let P=f.clippingState||null;c.value=P,P=d(S,m,L,x);for(let H=0;H!==L;++H)P[H]=e[H];f.clippingState=P,this.numIntersection=w?this.numPlanes:0,this.numPlanes+=U}};function h(){c.value!==e&&(c.value=e,c.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function d(p,m,x,S){const w=p!==null?p.length:0;let v=null;if(w!==0){if(v=c.value,S!==!0||v===null){const f=x+w*4,U=m.matrixWorldInverse;l.getNormalMatrix(U),(v===null||v.length<f)&&(v=new Float32Array(f));for(let L=0,P=x;L!==w;++L,P+=4)a.copy(p[L]).applyMatrix4(U,l),a.normal.toArray(v,P),v[P+3]=a.constant}c.value=v,c.needsUpdate=!0}return t.numPlanes=w,t.numIntersection=0,v}}function dy(i){let t=new WeakMap;function e(a,l){return l===ul?a.mapping=Ps:l===fl&&(a.mapping=Is),a}function n(a){if(a&&a.isTexture){const l=a.mapping;if(l===ul||l===fl)if(t.has(a)){const c=t.get(a).texture;return e(c,a.mapping)}else{const c=a.image;if(c&&c.height>0){const h=new T_(c.height);return h.fromEquirectangularTexture(i,a),t.set(a,h),a.addEventListener("dispose",s),e(h.texture,a.mapping)}else return null}}return a}function s(a){const l=a.target;l.removeEventListener("dispose",s);const c=t.get(l);c!==void 0&&(t.delete(l),c.dispose())}function r(){t=new WeakMap}return{get:n,dispose:r}}class uc extends sd{constructor(t=-1,e=1,n=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=n-t,a=n+t,l=s+e,c=s-e;if(this.view!==null&&this.view.enabled){const h=(this.right-this.left)/this.view.fullWidth/this.zoom,d=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=h*this.view.offsetX,a=r+h*this.view.width,l-=d*this.view.offsetY,c=l-d*this.view.height}this.projectionMatrix.makeOrthographic(r,a,l,c,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}const ys=4,nu=[.125,.215,.35,.446,.526,.582],ki=20,Fa=new uc,iu=new Pt;let Ba=null,ka=0,za=0,Va=!1;const Ni=(1+Math.sqrt(5))/2,ds=1/Ni,su=[new N(-Ni,ds,0),new N(Ni,ds,0),new N(-ds,0,Ni),new N(ds,0,Ni),new N(0,Ni,-ds),new N(0,Ni,ds),new N(-1,1,-1),new N(1,1,-1),new N(-1,1,1),new N(1,1,1)];class ru{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,s=100){Ba=this._renderer.getRenderTarget(),ka=this._renderer.getActiveCubeFace(),za=this._renderer.getActiveMipmapLevel(),Va=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const r=this._allocateTargets();return r.depthBuffer=!0,this._sceneToCubeUV(t,n,s,r),e>0&&this._blur(r,0,0,e),this._applyPMREM(r),this._cleanup(r),r}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=lu(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=au(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(Ba,ka,za),this._renderer.xr.enabled=Va,t.scissorTest=!1,oo(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===Ps||t.mapping===Is?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),Ba=this._renderer.getRenderTarget(),ka=this._renderer.getActiveCubeFace(),za=this._renderer.getActiveMipmapLevel(),Va=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:mn,minFilter:mn,generateMipmaps:!1,type:Qn,format:wn,colorSpace:Fs,depthBuffer:!1},s=ou(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=ou(t,e,n);const{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=py(r)),this._blurMaterial=my(r,t,e)}return s}_compileMaterial(t){const e=new Bt(this._lodPlanes[0],t);this._renderer.compile(e,Fa)}_sceneToCubeUV(t,e,n,s){const l=new cn(90,1,e,n),c=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],d=this._renderer,p=d.autoClear,m=d.toneMapping;d.getClearColor(iu),d.toneMapping=Mi,d.autoClear=!1;const x=new $o({name:"PMREM.Background",side:Ze,depthWrite:!1,depthTest:!1}),S=new Bt(new gn,x);let w=!1;const v=t.background;v?v.isColor&&(x.color.copy(v),t.background=null,w=!0):(x.color.copy(iu),w=!0);for(let f=0;f<6;f++){const U=f%3;U===0?(l.up.set(0,c[f],0),l.lookAt(h[f],0,0)):U===1?(l.up.set(0,0,c[f]),l.lookAt(0,h[f],0)):(l.up.set(0,c[f],0),l.lookAt(0,0,h[f]));const L=this._cubeSize;oo(s,U*L,f>2?L:0,L,L),d.setRenderTarget(s),w&&d.render(S,l),d.render(t,l)}S.geometry.dispose(),S.material.dispose(),d.toneMapping=m,d.autoClear=p,t.background=v}_textureToCubeUV(t,e){const n=this._renderer,s=t.mapping===Ps||t.mapping===Is;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=lu()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=au());const r=s?this._cubemapMaterial:this._equirectMaterial,a=new Bt(this._lodPlanes[0],r),l=r.uniforms;l.envMap.value=t;const c=this._cubeSize;oo(e,0,0,3*c,2*c),n.setRenderTarget(e),n.render(a,Fa)}_applyPMREM(t){const e=this._renderer,n=e.autoClear;e.autoClear=!1;const s=this._lodPlanes.length;for(let r=1;r<s;r++){const a=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),l=su[(s-r-1)%su.length];this._blur(t,r-1,r,a,l)}e.autoClear=n}_blur(t,e,n,s,r){const a=this._pingPongRenderTarget;this._halfBlur(t,a,e,n,s,"latitudinal",r),this._halfBlur(a,t,n,n,s,"longitudinal",r)}_halfBlur(t,e,n,s,r,a,l){const c=this._renderer,h=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const d=3,p=new Bt(this._lodPlanes[s],h),m=h.uniforms,x=this._sizeLods[n]-1,S=isFinite(r)?Math.PI/(2*x):2*Math.PI/(2*ki-1),w=r/S,v=isFinite(r)?1+Math.floor(d*w):ki;v>ki&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${v} samples when the maximum is set to ${ki}`);const f=[];let U=0;for(let E=0;E<ki;++E){const M=E/w,g=Math.exp(-M*M/2);f.push(g),E===0?U+=g:E<v&&(U+=2*g)}for(let E=0;E<f.length;E++)f[E]=f[E]/U;m.envMap.value=t.texture,m.samples.value=v,m.weights.value=f,m.latitudinal.value=a==="latitudinal",l&&(m.poleAxis.value=l);const{_lodMax:L}=this;m.dTheta.value=S,m.mipInt.value=L-n;const P=this._sizeLods[s],H=3*P*(s>L-ys?s-L+ys:0),O=4*(this._cubeSize-P);oo(e,H,O,3*P,2*P),c.setRenderTarget(e),c.render(p,Fa)}}function py(i){const t=[],e=[],n=[];let s=i;const r=i-ys+1+nu.length;for(let a=0;a<r;a++){const l=Math.pow(2,s);e.push(l);let c=1/l;a>i-ys?c=nu[a-i+ys-1]:a===0&&(c=0),n.push(c);const h=1/(l-2),d=-h,p=1+h,m=[d,d,p,d,p,p,d,d,p,p,d,p],x=6,S=6,w=3,v=2,f=1,U=new Float32Array(w*S*x),L=new Float32Array(v*S*x),P=new Float32Array(f*S*x);for(let O=0;O<x;O++){const E=O%3*2/3-1,M=O>2?0:-1,g=[E,M,0,E+2/3,M,0,E+2/3,M+1,0,E,M,0,E+2/3,M+1,0,E,M+1,0];U.set(g,w*S*O),L.set(m,v*S*O);const _=[O,O,O,O,O,O];P.set(_,f*S*O)}const H=new be;H.setAttribute("position",new Fe(U,w)),H.setAttribute("uv",new Fe(L,v)),H.setAttribute("faceIndex",new Fe(P,f)),t.push(H),s>ys&&s--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function ou(i,t,e){const n=new Cn(i,t,e);return n.texture.mapping=Xo,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function oo(i,t,e,n,s){i.viewport.set(t,e,n,s),i.scissor.set(t,e,n,s)}function my(i,t,e){const n=new Float32Array(ki),s=new N(0,1,0);return new Re({name:"SphericalGaussianBlur",defines:{n:ki,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:fc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:Zn,depthTest:!1,depthWrite:!1})}function au(){return new Re({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:fc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Zn,depthTest:!1,depthWrite:!1})}function lu(){return new Re({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:fc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Zn,depthTest:!1,depthWrite:!1})}function fc(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function gy(i){let t=new WeakMap,e=null;function n(l){if(l&&l.isTexture){const c=l.mapping,h=c===ul||c===fl,d=c===Ps||c===Is;if(h||d){let p=t.get(l);const m=p!==void 0?p.texture.pmremVersion:0;if(l.isRenderTargetTexture&&l.pmremVersion!==m)return e===null&&(e=new ru(i)),p=h?e.fromEquirectangular(l,p):e.fromCubemap(l,p),p.texture.pmremVersion=l.pmremVersion,t.set(l,p),p.texture;if(p!==void 0)return p.texture;{const x=l.image;return h&&x&&x.height>0||d&&x&&s(x)?(e===null&&(e=new ru(i)),p=h?e.fromEquirectangular(l):e.fromCubemap(l),p.texture.pmremVersion=l.pmremVersion,t.set(l,p),l.addEventListener("dispose",r),p.texture):null}}}return l}function s(l){let c=0;const h=6;for(let d=0;d<h;d++)l[d]!==void 0&&c++;return c===h}function r(l){const c=l.target;c.removeEventListener("dispose",r);const h=t.get(c);h!==void 0&&(t.delete(c),h.dispose())}function a(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:a}}function _y(i){const t={};function e(n){if(t[n]!==void 0)return t[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return t[n]=s,s}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){const s=e(n);return s===null&&ar("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function vy(i,t,e,n){const s={},r=new WeakMap;function a(p){const m=p.target;m.index!==null&&t.remove(m.index);for(const S in m.attributes)t.remove(m.attributes[S]);for(const S in m.morphAttributes){const w=m.morphAttributes[S];for(let v=0,f=w.length;v<f;v++)t.remove(w[v])}m.removeEventListener("dispose",a),delete s[m.id];const x=r.get(m);x&&(t.remove(x),r.delete(m)),n.releaseStatesOfGeometry(m),m.isInstancedBufferGeometry===!0&&delete m._maxInstanceCount,e.memory.geometries--}function l(p,m){return s[m.id]===!0||(m.addEventListener("dispose",a),s[m.id]=!0,e.memory.geometries++),m}function c(p){const m=p.attributes;for(const S in m)t.update(m[S],i.ARRAY_BUFFER);const x=p.morphAttributes;for(const S in x){const w=x[S];for(let v=0,f=w.length;v<f;v++)t.update(w[v],i.ARRAY_BUFFER)}}function h(p){const m=[],x=p.index,S=p.attributes.position;let w=0;if(x!==null){const U=x.array;w=x.version;for(let L=0,P=U.length;L<P;L+=3){const H=U[L+0],O=U[L+1],E=U[L+2];m.push(H,O,O,E,E,H)}}else if(S!==void 0){const U=S.array;w=S.version;for(let L=0,P=U.length/3-1;L<P;L+=3){const H=L+0,O=L+1,E=L+2;m.push(H,O,O,E,E,H)}}else return;const v=new(Jf(m)?nd:ed)(m,1);v.version=w;const f=r.get(p);f&&t.remove(f),r.set(p,v)}function d(p){const m=r.get(p);if(m){const x=p.index;x!==null&&m.version<x.version&&h(p)}else h(p);return r.get(p)}return{get:l,update:c,getWireframeAttribute:d}}function yy(i,t,e){let n;function s(m){n=m}let r,a;function l(m){r=m.type,a=m.bytesPerElement}function c(m,x){i.drawElements(n,x,r,m*a),e.update(x,n,1)}function h(m,x,S){S!==0&&(i.drawElementsInstanced(n,x,r,m*a,S),e.update(x,n,S))}function d(m,x,S){if(S===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,x,0,r,m,0,S);let v=0;for(let f=0;f<S;f++)v+=x[f];e.update(v,n,1)}function p(m,x,S,w){if(S===0)return;const v=t.get("WEBGL_multi_draw");if(v===null)for(let f=0;f<m.length;f++)h(m[f]/a,x[f],w[f]);else{v.multiDrawElementsInstancedWEBGL(n,x,0,r,m,0,w,0,S);let f=0;for(let U=0;U<S;U++)f+=x[U]*w[U];e.update(f,n,1)}}this.setMode=s,this.setIndex=l,this.render=c,this.renderInstances=h,this.renderMultiDraw=d,this.renderMultiDrawInstances=p}function xy(i){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,l){switch(e.calls++,a){case i.TRIANGLES:e.triangles+=l*(r/3);break;case i.LINES:e.lines+=l*(r/2);break;case i.LINE_STRIP:e.lines+=l*(r-1);break;case i.LINE_LOOP:e.lines+=l*r;break;case i.POINTS:e.points+=l*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:n}}function My(i,t,e){const n=new WeakMap,s=new _e;function r(a,l,c){const h=a.morphTargetInfluences,d=l.morphAttributes.position||l.morphAttributes.normal||l.morphAttributes.color,p=d!==void 0?d.length:0;let m=n.get(l);if(m===void 0||m.count!==p){let _=function(){M.dispose(),n.delete(l),l.removeEventListener("dispose",_)};var x=_;m!==void 0&&m.texture.dispose();const S=l.morphAttributes.position!==void 0,w=l.morphAttributes.normal!==void 0,v=l.morphAttributes.color!==void 0,f=l.morphAttributes.position||[],U=l.morphAttributes.normal||[],L=l.morphAttributes.color||[];let P=0;S===!0&&(P=1),w===!0&&(P=2),v===!0&&(P=3);let H=l.attributes.position.count*P,O=1;H>t.maxTextureSize&&(O=Math.ceil(H/t.maxTextureSize),H=t.maxTextureSize);const E=new Float32Array(H*O*4*p),M=new Qf(E,H,O,p);M.type=Kn,M.needsUpdate=!0;const g=P*4;for(let T=0;T<p;T++){const I=f[T],b=U[T],K=L[T],Q=H*O*4*T;for(let J=0;J<I.count;J++){const nt=J*g;S===!0&&(s.fromBufferAttribute(I,J),E[Q+nt+0]=s.x,E[Q+nt+1]=s.y,E[Q+nt+2]=s.z,E[Q+nt+3]=0),w===!0&&(s.fromBufferAttribute(b,J),E[Q+nt+4]=s.x,E[Q+nt+5]=s.y,E[Q+nt+6]=s.z,E[Q+nt+7]=0),v===!0&&(s.fromBufferAttribute(K,J),E[Q+nt+8]=s.x,E[Q+nt+9]=s.y,E[Q+nt+10]=s.z,E[Q+nt+11]=K.itemSize===4?s.w:1)}}m={count:p,texture:M,size:new At(H,O)},n.set(l,m),l.addEventListener("dispose",_)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)c.getUniforms().setValue(i,"morphTexture",a.morphTexture,e);else{let S=0;for(let v=0;v<h.length;v++)S+=h[v];const w=l.morphTargetsRelative?1:1-S;c.getUniforms().setValue(i,"morphTargetBaseInfluence",w),c.getUniforms().setValue(i,"morphTargetInfluences",h)}c.getUniforms().setValue(i,"morphTargetsTexture",m.texture,e),c.getUniforms().setValue(i,"morphTargetsTextureSize",m.size)}return{update:r}}function Sy(i,t,e,n){let s=new WeakMap;function r(c){const h=n.render.frame,d=c.geometry,p=t.get(c,d);if(s.get(p)!==h&&(t.update(p),s.set(p,h)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),s.get(c)!==h&&(e.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,i.ARRAY_BUFFER),s.set(c,h))),c.isSkinnedMesh){const m=c.skeleton;s.get(m)!==h&&(m.update(),s.set(m,h))}return p}function a(){s=new WeakMap}function l(c){const h=c.target;h.removeEventListener("dispose",l),e.remove(h.instanceMatrix),h.instanceColor!==null&&e.remove(h.instanceColor)}return{update:r,dispose:a}}class od extends Qe{constructor(t,e,n,s,r,a,l,c,h,d=ws){if(d!==ws&&d!==Ls)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&d===ws&&(n=ji),n===void 0&&d===Ls&&(n=Ds),super(null,s,r,a,l,c,d,n,h),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=l!==void 0?l:An,this.minFilter=c!==void 0?c:An,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}const ad=new Qe,cu=new od(1,1),ld=new Qf,cd=new c_,hd=new cc,hu=[],uu=[],fu=new Float32Array(16),du=new Float32Array(9),pu=new Float32Array(4);function zs(i,t,e){const n=i[0];if(n<=0||n>0)return i;const s=t*e;let r=hu[s];if(r===void 0&&(r=new Float32Array(s),hu[s]=r),t!==0){n.toArray(r,0);for(let a=1,l=0;a!==t;++a)l+=e,i[a].toArray(r,l)}return r}function De(i,t){if(i.length!==t.length)return!1;for(let e=0,n=i.length;e<n;e++)if(i[e]!==t[e])return!1;return!0}function Le(i,t){for(let e=0,n=t.length;e<n;e++)i[e]=t[e]}function Yo(i,t){let e=uu[t];e===void 0&&(e=new Int32Array(t),uu[t]=e);for(let n=0;n!==t;++n)e[n]=i.allocateTextureUnit();return e}function Ey(i,t){const e=this.cache;e[0]!==t&&(i.uniform1f(this.addr,t),e[0]=t)}function Ty(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(De(e,t))return;i.uniform2fv(this.addr,t),Le(e,t)}}function wy(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(i.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(De(e,t))return;i.uniform3fv(this.addr,t),Le(e,t)}}function by(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(De(e,t))return;i.uniform4fv(this.addr,t),Le(e,t)}}function Ay(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(De(e,t))return;i.uniformMatrix2fv(this.addr,!1,t),Le(e,t)}else{if(De(e,n))return;pu.set(n),i.uniformMatrix2fv(this.addr,!1,pu),Le(e,n)}}function Cy(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(De(e,t))return;i.uniformMatrix3fv(this.addr,!1,t),Le(e,t)}else{if(De(e,n))return;du.set(n),i.uniformMatrix3fv(this.addr,!1,du),Le(e,n)}}function Ry(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(De(e,t))return;i.uniformMatrix4fv(this.addr,!1,t),Le(e,t)}else{if(De(e,n))return;fu.set(n),i.uniformMatrix4fv(this.addr,!1,fu),Le(e,n)}}function Py(i,t){const e=this.cache;e[0]!==t&&(i.uniform1i(this.addr,t),e[0]=t)}function Iy(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(De(e,t))return;i.uniform2iv(this.addr,t),Le(e,t)}}function Dy(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(De(e,t))return;i.uniform3iv(this.addr,t),Le(e,t)}}function Ly(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(De(e,t))return;i.uniform4iv(this.addr,t),Le(e,t)}}function Uy(i,t){const e=this.cache;e[0]!==t&&(i.uniform1ui(this.addr,t),e[0]=t)}function Ny(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(De(e,t))return;i.uniform2uiv(this.addr,t),Le(e,t)}}function Oy(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(De(e,t))return;i.uniform3uiv(this.addr,t),Le(e,t)}}function Fy(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(De(e,t))return;i.uniform4uiv(this.addr,t),Le(e,t)}}function By(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(cu.compareFunction=Kf,r=cu):r=ad,e.setTexture2D(t||r,s)}function ky(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture3D(t||cd,s)}function zy(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTextureCube(t||hd,s)}function Vy(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture2DArray(t||ld,s)}function Hy(i){switch(i){case 5126:return Ey;case 35664:return Ty;case 35665:return wy;case 35666:return by;case 35674:return Ay;case 35675:return Cy;case 35676:return Ry;case 5124:case 35670:return Py;case 35667:case 35671:return Iy;case 35668:case 35672:return Dy;case 35669:case 35673:return Ly;case 5125:return Uy;case 36294:return Ny;case 36295:return Oy;case 36296:return Fy;case 35678:case 36198:case 36298:case 36306:case 35682:return By;case 35679:case 36299:case 36307:return ky;case 35680:case 36300:case 36308:case 36293:return zy;case 36289:case 36303:case 36311:case 36292:return Vy}}function Gy(i,t){i.uniform1fv(this.addr,t)}function Wy(i,t){const e=zs(t,this.size,2);i.uniform2fv(this.addr,e)}function Xy(i,t){const e=zs(t,this.size,3);i.uniform3fv(this.addr,e)}function qy(i,t){const e=zs(t,this.size,4);i.uniform4fv(this.addr,e)}function jy(i,t){const e=zs(t,this.size,4);i.uniformMatrix2fv(this.addr,!1,e)}function $y(i,t){const e=zs(t,this.size,9);i.uniformMatrix3fv(this.addr,!1,e)}function Yy(i,t){const e=zs(t,this.size,16);i.uniformMatrix4fv(this.addr,!1,e)}function Ky(i,t){i.uniform1iv(this.addr,t)}function Jy(i,t){i.uniform2iv(this.addr,t)}function Zy(i,t){i.uniform3iv(this.addr,t)}function Qy(i,t){i.uniform4iv(this.addr,t)}function tx(i,t){i.uniform1uiv(this.addr,t)}function ex(i,t){i.uniform2uiv(this.addr,t)}function nx(i,t){i.uniform3uiv(this.addr,t)}function ix(i,t){i.uniform4uiv(this.addr,t)}function sx(i,t,e){const n=this.cache,s=t.length,r=Yo(e,s);De(n,r)||(i.uniform1iv(this.addr,r),Le(n,r));for(let a=0;a!==s;++a)e.setTexture2D(t[a]||ad,r[a])}function rx(i,t,e){const n=this.cache,s=t.length,r=Yo(e,s);De(n,r)||(i.uniform1iv(this.addr,r),Le(n,r));for(let a=0;a!==s;++a)e.setTexture3D(t[a]||cd,r[a])}function ox(i,t,e){const n=this.cache,s=t.length,r=Yo(e,s);De(n,r)||(i.uniform1iv(this.addr,r),Le(n,r));for(let a=0;a!==s;++a)e.setTextureCube(t[a]||hd,r[a])}function ax(i,t,e){const n=this.cache,s=t.length,r=Yo(e,s);De(n,r)||(i.uniform1iv(this.addr,r),Le(n,r));for(let a=0;a!==s;++a)e.setTexture2DArray(t[a]||ld,r[a])}function lx(i){switch(i){case 5126:return Gy;case 35664:return Wy;case 35665:return Xy;case 35666:return qy;case 35674:return jy;case 35675:return $y;case 35676:return Yy;case 5124:case 35670:return Ky;case 35667:case 35671:return Jy;case 35668:case 35672:return Zy;case 35669:case 35673:return Qy;case 5125:return tx;case 36294:return ex;case 36295:return nx;case 36296:return ix;case 35678:case 36198:case 36298:case 36306:case 35682:return sx;case 35679:case 36299:case 36307:return rx;case 35680:case 36300:case 36308:case 36293:return ox;case 36289:case 36303:case 36311:case 36292:return ax}}class cx{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=Hy(e.type)}}class hx{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=lx(e.type)}}class ux{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){const s=this.seq;for(let r=0,a=s.length;r!==a;++r){const l=s[r];l.setValue(t,e[l.id],n)}}}const Ha=/(\w+)(\])?(\[|\.)?/g;function mu(i,t){i.seq.push(t),i.map[t.id]=t}function fx(i,t,e){const n=i.name,s=n.length;for(Ha.lastIndex=0;;){const r=Ha.exec(n),a=Ha.lastIndex;let l=r[1];const c=r[2]==="]",h=r[3];if(c&&(l=l|0),h===void 0||h==="["&&a+2===s){mu(e,h===void 0?new cx(l,i,t):new hx(l,i,t));break}else{let p=e.map[l];p===void 0&&(p=new ux(l),mu(e,p)),e=p}}}class Co{constructor(t,e){this.seq=[],this.map={};const n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){const r=t.getActiveUniform(e,s),a=t.getUniformLocation(e,r.name);fx(r,a,this)}}setValue(t,e,n,s){const r=this.map[e];r!==void 0&&r.setValue(t,n,s)}setOptional(t,e,n){const s=e[n];s!==void 0&&this.setValue(t,n,s)}static upload(t,e,n,s){for(let r=0,a=e.length;r!==a;++r){const l=e[r],c=n[l.id];c.needsUpdate!==!1&&l.setValue(t,c.value,s)}}static seqWithValue(t,e){const n=[];for(let s=0,r=t.length;s!==r;++s){const a=t[s];a.id in e&&n.push(a)}return n}}function gu(i,t,e){const n=i.createShader(t);return i.shaderSource(n,e),i.compileShader(n),n}const dx=37297;let px=0;function mx(i,t){const e=i.split(`
`),n=[],s=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let a=s;a<r;a++){const l=a+1;n.push(`${l===t?">":" "} ${l}: ${e[a]}`)}return n.join(`
`)}const _u=new Wt;function gx(i){ee._getMatrix(_u,ee.workingColorSpace,i);const t=`mat3( ${_u.elements.map(e=>e.toFixed(4))} )`;switch(ee.getTransfer(i)){case qo:return[t,"LinearTransferOETF"];case ce:return[t,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",i),[t,"LinearTransferOETF"]}}function vu(i,t,e){const n=i.getShaderParameter(t,i.COMPILE_STATUS),s=i.getShaderInfoLog(t).trim();if(n&&s==="")return"";const r=/ERROR: 0:(\d+)/.exec(s);if(r){const a=parseInt(r[1]);return e.toUpperCase()+`

`+s+`

`+mx(i.getShaderSource(t),a)}else return s}function _x(i,t){const e=gx(t);return[`vec4 ${i}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}function vx(i,t){let e;switch(t){case Lf:e="Linear";break;case Uf:e="Reinhard";break;case Nf:e="Cineon";break;case ec:e="ACESFilmic";break;case Of:e="AgX";break;case Ff:e="Neutral";break;case Hg:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+i+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const ao=new N;function yx(){ee.getLuminanceCoefficients(ao);const i=ao.x.toFixed(4),t=ao.y.toFixed(4),e=ao.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function xx(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(lr).join(`
`)}function Mx(i){const t=[];for(const e in i){const n=i[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function Sx(i,t){const e={},n=i.getProgramParameter(t,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){const r=i.getActiveAttrib(t,s),a=r.name;let l=1;r.type===i.FLOAT_MAT2&&(l=2),r.type===i.FLOAT_MAT3&&(l=3),r.type===i.FLOAT_MAT4&&(l=4),e[a]={type:r.type,location:i.getAttribLocation(t,a),locationSize:l}}return e}function lr(i){return i!==""}function yu(i,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function xu(i,t){return i.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const Ex=/^[ \t]*#include +<([\w\d./]+)>/gm;function Gl(i){return i.replace(Ex,wx)}const Tx=new Map;function wx(i,t){let e=Xt[t];if(e===void 0){const n=Tx.get(t);if(n!==void 0)e=Xt[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return Gl(e)}const bx=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Mu(i){return i.replace(bx,Ax)}function Ax(i,t,e,n){let s="";for(let r=parseInt(t);r<parseInt(e);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Su(i){let t=`precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;return i.precision==="highp"?t+=`
#define HIGH_PRECISION`:i.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}function Cx(i){let t="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===Pf?t="SHADOWMAP_TYPE_PCF":i.shadowMapType===If?t="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===$n&&(t="SHADOWMAP_TYPE_VSM"),t}function Rx(i){let t="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case Ps:case Is:t="ENVMAP_TYPE_CUBE";break;case Xo:t="ENVMAP_TYPE_CUBE_UV";break}return t}function Px(i){let t="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case Is:t="ENVMAP_MODE_REFRACTION";break}return t}function Ix(i){let t="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case Df:t="ENVMAP_BLENDING_MULTIPLY";break;case zg:t="ENVMAP_BLENDING_MIX";break;case Vg:t="ENVMAP_BLENDING_ADD";break}return t}function Dx(i){const t=i.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),112)),texelHeight:n,maxMip:e}}function Lx(i,t,e,n){const s=i.getContext(),r=e.defines;let a=e.vertexShader,l=e.fragmentShader;const c=Cx(e),h=Rx(e),d=Px(e),p=Ix(e),m=Dx(e),x=xx(e),S=Mx(r),w=s.createProgram();let v,f,U=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(v=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,S].filter(lr).join(`
`),v.length>0&&(v+=`
`),f=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,S].filter(lr).join(`
`),f.length>0&&(f+=`
`)):(v=[Su(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,S,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+d:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(lr).join(`
`),f=[Su(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,S,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.envMap?"#define "+d:"",e.envMap?"#define "+p:"",m?"#define CUBEUV_TEXEL_WIDTH "+m.texelWidth:"",m?"#define CUBEUV_TEXEL_HEIGHT "+m.texelHeight:"",m?"#define CUBEUV_MAX_MIP "+m.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==Mi?"#define TONE_MAPPING":"",e.toneMapping!==Mi?Xt.tonemapping_pars_fragment:"",e.toneMapping!==Mi?vx("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",Xt.colorspace_pars_fragment,_x("linearToOutputTexel",e.outputColorSpace),yx(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(lr).join(`
`)),a=Gl(a),a=yu(a,e),a=xu(a,e),l=Gl(l),l=yu(l,e),l=xu(l,e),a=Mu(a),l=Mu(l),e.isRawShaderMaterial!==!0&&(U=`#version 300 es
`,v=[x,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+v,f=["#define varying in",e.glslVersion===Nh?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===Nh?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+f);const L=U+v+a,P=U+f+l,H=gu(s,s.VERTEX_SHADER,L),O=gu(s,s.FRAGMENT_SHADER,P);s.attachShader(w,H),s.attachShader(w,O),e.index0AttributeName!==void 0?s.bindAttribLocation(w,0,e.index0AttributeName):e.morphTargets===!0&&s.bindAttribLocation(w,0,"position"),s.linkProgram(w);function E(T){if(i.debug.checkShaderErrors){const I=s.getProgramInfoLog(w).trim(),b=s.getShaderInfoLog(H).trim(),K=s.getShaderInfoLog(O).trim();let Q=!0,J=!0;if(s.getProgramParameter(w,s.LINK_STATUS)===!1)if(Q=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,w,H,O);else{const nt=vu(s,H,"vertex"),$=vu(s,O,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(w,s.VALIDATE_STATUS)+`

Material Name: `+T.name+`
Material Type: `+T.type+`

Program Info Log: `+I+`
`+nt+`
`+$)}else I!==""?console.warn("THREE.WebGLProgram: Program Info Log:",I):(b===""||K==="")&&(J=!1);J&&(T.diagnostics={runnable:Q,programLog:I,vertexShader:{log:b,prefix:v},fragmentShader:{log:K,prefix:f}})}s.deleteShader(H),s.deleteShader(O),M=new Co(s,w),g=Sx(s,w)}let M;this.getUniforms=function(){return M===void 0&&E(this),M};let g;this.getAttributes=function(){return g===void 0&&E(this),g};let _=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return _===!1&&(_=s.getProgramParameter(w,dx)),_},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(w),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=px++,this.cacheKey=t,this.usedTimes=1,this.program=w,this.vertexShader=H,this.fragmentShader=O,this}let Ux=0;class Nx{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,n=t.fragmentShader,s=this._getShaderStage(e),r=this._getShaderStage(n),a=this._getShaderCacheForMaterial(t);return a.has(s)===!1&&(a.add(s),s.usedTimes++),a.has(r)===!1&&(a.add(r),r.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){const e=this.shaderCache;let n=e.get(t);return n===void 0&&(n=new Ox(t),e.set(t,n)),n}}class Ox{constructor(t){this.id=Ux++,this.code=t,this.usedTimes=0}}function Fx(i,t,e,n,s,r,a){const l=new lc,c=new Nx,h=new Set,d=[],p=s.logarithmicDepthBuffer,m=s.vertexTextures;let x=s.precision;const S={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function w(g){return h.add(g),g===0?"uv":`uv${g}`}function v(g,_,T,I,b){const K=I.fog,Q=b.geometry,J=g.isMeshStandardMaterial?I.environment:null,nt=(g.isMeshStandardMaterial?e:t).get(g.envMap||J),$=nt&&nt.mapping===Xo?nt.image.height:null,ut=S[g.type];g.precision!==null&&(x=s.getMaxPrecision(g.precision),x!==g.precision&&console.warn("THREE.WebGLProgram.getParameters:",g.precision,"not supported, using",x,"instead."));const vt=Q.morphAttributes.position||Q.morphAttributes.normal||Q.morphAttributes.color,Ct=vt!==void 0?vt.length:0;let Ft=0;Q.morphAttributes.position!==void 0&&(Ft=1),Q.morphAttributes.normal!==void 0&&(Ft=2),Q.morphAttributes.color!==void 0&&(Ft=3);let kt,Z,st,bt;if(ut){const Jt=Un[ut];kt=Jt.vertexShader,Z=Jt.fragmentShader}else kt=g.vertexShader,Z=g.fragmentShader,c.update(g),st=c.getVertexShaderID(g),bt=c.getFragmentShaderID(g);const ct=i.getRenderTarget(),Ut=i.state.buffers.depth.getReversed(),zt=b.isInstancedMesh===!0,Ht=b.isBatchedMesh===!0,ue=!!g.map,qt=!!g.matcap,Se=!!nt,z=!!g.aoMap,Ve=!!g.lightMap,jt=!!g.bumpMap,$t=!!g.normalMap,It=!!g.displacementMap,fe=!!g.emissiveMap,Rt=!!g.metalnessMap,D=!!g.roughnessMap,A=g.anisotropy>0,G=g.clearcoat>0,tt=g.dispersion>0,it=g.iridescence>0,Y=g.sheen>0,gt=g.transmission>0,ht=A&&!!g.anisotropyMap,yt=G&&!!g.clearcoatMap,Yt=G&&!!g.clearcoatNormalMap,rt=G&&!!g.clearcoatRoughnessMap,_t=it&&!!g.iridescenceMap,Dt=it&&!!g.iridescenceThicknessMap,Ot=Y&&!!g.sheenColorMap,xt=Y&&!!g.sheenRoughnessMap,Kt=!!g.specularMap,Gt=!!g.specularColorMap,ae=!!g.specularIntensityMap,F=gt&&!!g.transmissionMap,pt=gt&&!!g.thicknessMap,j=!!g.gradientMap,et=!!g.alphaMap,mt=g.alphaTest>0,lt=!!g.alphaHash,Vt=!!g.extensions;let Me=Mi;g.toneMapped&&(ct===null||ct.isXRRenderTarget===!0)&&(Me=i.toneMapping);const Ie={shaderID:ut,shaderType:g.type,shaderName:g.name,vertexShader:kt,fragmentShader:Z,defines:g.defines,customVertexShaderID:st,customFragmentShaderID:bt,isRawShaderMaterial:g.isRawShaderMaterial===!0,glslVersion:g.glslVersion,precision:x,batching:Ht,batchingColor:Ht&&b._colorsTexture!==null,instancing:zt,instancingColor:zt&&b.instanceColor!==null,instancingMorph:zt&&b.morphTexture!==null,supportsVertexTextures:m,outputColorSpace:ct===null?i.outputColorSpace:ct.isXRRenderTarget===!0?ct.texture.colorSpace:Fs,alphaToCoverage:!!g.alphaToCoverage,map:ue,matcap:qt,envMap:Se,envMapMode:Se&&nt.mapping,envMapCubeUVHeight:$,aoMap:z,lightMap:Ve,bumpMap:jt,normalMap:$t,displacementMap:m&&It,emissiveMap:fe,normalMapObjectSpace:$t&&g.normalMapType===qg,normalMapTangentSpace:$t&&g.normalMapType===Yf,metalnessMap:Rt,roughnessMap:D,anisotropy:A,anisotropyMap:ht,clearcoat:G,clearcoatMap:yt,clearcoatNormalMap:Yt,clearcoatRoughnessMap:rt,dispersion:tt,iridescence:it,iridescenceMap:_t,iridescenceThicknessMap:Dt,sheen:Y,sheenColorMap:Ot,sheenRoughnessMap:xt,specularMap:Kt,specularColorMap:Gt,specularIntensityMap:ae,transmission:gt,transmissionMap:F,thicknessMap:pt,gradientMap:j,opaque:g.transparent===!1&&g.blending===Ts&&g.alphaToCoverage===!1,alphaMap:et,alphaTest:mt,alphaHash:lt,combine:g.combine,mapUv:ue&&w(g.map.channel),aoMapUv:z&&w(g.aoMap.channel),lightMapUv:Ve&&w(g.lightMap.channel),bumpMapUv:jt&&w(g.bumpMap.channel),normalMapUv:$t&&w(g.normalMap.channel),displacementMapUv:It&&w(g.displacementMap.channel),emissiveMapUv:fe&&w(g.emissiveMap.channel),metalnessMapUv:Rt&&w(g.metalnessMap.channel),roughnessMapUv:D&&w(g.roughnessMap.channel),anisotropyMapUv:ht&&w(g.anisotropyMap.channel),clearcoatMapUv:yt&&w(g.clearcoatMap.channel),clearcoatNormalMapUv:Yt&&w(g.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:rt&&w(g.clearcoatRoughnessMap.channel),iridescenceMapUv:_t&&w(g.iridescenceMap.channel),iridescenceThicknessMapUv:Dt&&w(g.iridescenceThicknessMap.channel),sheenColorMapUv:Ot&&w(g.sheenColorMap.channel),sheenRoughnessMapUv:xt&&w(g.sheenRoughnessMap.channel),specularMapUv:Kt&&w(g.specularMap.channel),specularColorMapUv:Gt&&w(g.specularColorMap.channel),specularIntensityMapUv:ae&&w(g.specularIntensityMap.channel),transmissionMapUv:F&&w(g.transmissionMap.channel),thicknessMapUv:pt&&w(g.thicknessMap.channel),alphaMapUv:et&&w(g.alphaMap.channel),vertexTangents:!!Q.attributes.tangent&&($t||A),vertexColors:g.vertexColors,vertexAlphas:g.vertexColors===!0&&!!Q.attributes.color&&Q.attributes.color.itemSize===4,pointsUvs:b.isPoints===!0&&!!Q.attributes.uv&&(ue||et),fog:!!K,useFog:g.fog===!0,fogExp2:!!K&&K.isFogExp2,flatShading:g.flatShading===!0,sizeAttenuation:g.sizeAttenuation===!0,logarithmicDepthBuffer:p,reverseDepthBuffer:Ut,skinning:b.isSkinnedMesh===!0,morphTargets:Q.morphAttributes.position!==void 0,morphNormals:Q.morphAttributes.normal!==void 0,morphColors:Q.morphAttributes.color!==void 0,morphTargetsCount:Ct,morphTextureStride:Ft,numDirLights:_.directional.length,numPointLights:_.point.length,numSpotLights:_.spot.length,numSpotLightMaps:_.spotLightMap.length,numRectAreaLights:_.rectArea.length,numHemiLights:_.hemi.length,numDirLightShadows:_.directionalShadowMap.length,numPointLightShadows:_.pointShadowMap.length,numSpotLightShadows:_.spotShadowMap.length,numSpotLightShadowsWithMaps:_.numSpotLightShadowsWithMaps,numLightProbes:_.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:g.dithering,shadowMapEnabled:i.shadowMap.enabled&&T.length>0,shadowMapType:i.shadowMap.type,toneMapping:Me,decodeVideoTexture:ue&&g.map.isVideoTexture===!0&&ee.getTransfer(g.map.colorSpace)===ce,decodeVideoTextureEmissive:fe&&g.emissiveMap.isVideoTexture===!0&&ee.getTransfer(g.emissiveMap.colorSpace)===ce,premultipliedAlpha:g.premultipliedAlpha,doubleSided:g.side===Je,flipSided:g.side===Ze,useDepthPacking:g.depthPacking>=0,depthPacking:g.depthPacking||0,index0AttributeName:g.index0AttributeName,extensionClipCullDistance:Vt&&g.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Vt&&g.extensions.multiDraw===!0||Ht)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:g.customProgramCacheKey()};return Ie.vertexUv1s=h.has(1),Ie.vertexUv2s=h.has(2),Ie.vertexUv3s=h.has(3),h.clear(),Ie}function f(g){const _=[];if(g.shaderID?_.push(g.shaderID):(_.push(g.customVertexShaderID),_.push(g.customFragmentShaderID)),g.defines!==void 0)for(const T in g.defines)_.push(T),_.push(g.defines[T]);return g.isRawShaderMaterial===!1&&(U(_,g),L(_,g),_.push(i.outputColorSpace)),_.push(g.customProgramCacheKey),_.join()}function U(g,_){g.push(_.precision),g.push(_.outputColorSpace),g.push(_.envMapMode),g.push(_.envMapCubeUVHeight),g.push(_.mapUv),g.push(_.alphaMapUv),g.push(_.lightMapUv),g.push(_.aoMapUv),g.push(_.bumpMapUv),g.push(_.normalMapUv),g.push(_.displacementMapUv),g.push(_.emissiveMapUv),g.push(_.metalnessMapUv),g.push(_.roughnessMapUv),g.push(_.anisotropyMapUv),g.push(_.clearcoatMapUv),g.push(_.clearcoatNormalMapUv),g.push(_.clearcoatRoughnessMapUv),g.push(_.iridescenceMapUv),g.push(_.iridescenceThicknessMapUv),g.push(_.sheenColorMapUv),g.push(_.sheenRoughnessMapUv),g.push(_.specularMapUv),g.push(_.specularColorMapUv),g.push(_.specularIntensityMapUv),g.push(_.transmissionMapUv),g.push(_.thicknessMapUv),g.push(_.combine),g.push(_.fogExp2),g.push(_.sizeAttenuation),g.push(_.morphTargetsCount),g.push(_.morphAttributeCount),g.push(_.numDirLights),g.push(_.numPointLights),g.push(_.numSpotLights),g.push(_.numSpotLightMaps),g.push(_.numHemiLights),g.push(_.numRectAreaLights),g.push(_.numDirLightShadows),g.push(_.numPointLightShadows),g.push(_.numSpotLightShadows),g.push(_.numSpotLightShadowsWithMaps),g.push(_.numLightProbes),g.push(_.shadowMapType),g.push(_.toneMapping),g.push(_.numClippingPlanes),g.push(_.numClipIntersection),g.push(_.depthPacking)}function L(g,_){l.disableAll(),_.supportsVertexTextures&&l.enable(0),_.instancing&&l.enable(1),_.instancingColor&&l.enable(2),_.instancingMorph&&l.enable(3),_.matcap&&l.enable(4),_.envMap&&l.enable(5),_.normalMapObjectSpace&&l.enable(6),_.normalMapTangentSpace&&l.enable(7),_.clearcoat&&l.enable(8),_.iridescence&&l.enable(9),_.alphaTest&&l.enable(10),_.vertexColors&&l.enable(11),_.vertexAlphas&&l.enable(12),_.vertexUv1s&&l.enable(13),_.vertexUv2s&&l.enable(14),_.vertexUv3s&&l.enable(15),_.vertexTangents&&l.enable(16),_.anisotropy&&l.enable(17),_.alphaHash&&l.enable(18),_.batching&&l.enable(19),_.dispersion&&l.enable(20),_.batchingColor&&l.enable(21),g.push(l.mask),l.disableAll(),_.fog&&l.enable(0),_.useFog&&l.enable(1),_.flatShading&&l.enable(2),_.logarithmicDepthBuffer&&l.enable(3),_.reverseDepthBuffer&&l.enable(4),_.skinning&&l.enable(5),_.morphTargets&&l.enable(6),_.morphNormals&&l.enable(7),_.morphColors&&l.enable(8),_.premultipliedAlpha&&l.enable(9),_.shadowMapEnabled&&l.enable(10),_.doubleSided&&l.enable(11),_.flipSided&&l.enable(12),_.useDepthPacking&&l.enable(13),_.dithering&&l.enable(14),_.transmission&&l.enable(15),_.sheen&&l.enable(16),_.opaque&&l.enable(17),_.pointsUvs&&l.enable(18),_.decodeVideoTexture&&l.enable(19),_.decodeVideoTextureEmissive&&l.enable(20),_.alphaToCoverage&&l.enable(21),g.push(l.mask)}function P(g){const _=S[g.type];let T;if(_){const I=Un[_];T=gr.clone(I.uniforms)}else T=g.uniforms;return T}function H(g,_){let T;for(let I=0,b=d.length;I<b;I++){const K=d[I];if(K.cacheKey===_){T=K,++T.usedTimes;break}}return T===void 0&&(T=new Lx(i,_,g,r),d.push(T)),T}function O(g){if(--g.usedTimes===0){const _=d.indexOf(g);d[_]=d[d.length-1],d.pop(),g.destroy()}}function E(g){c.remove(g)}function M(){c.dispose()}return{getParameters:v,getProgramCacheKey:f,getUniforms:P,acquireProgram:H,releaseProgram:O,releaseShaderCache:E,programs:d,dispose:M}}function Bx(){let i=new WeakMap;function t(a){return i.has(a)}function e(a){let l=i.get(a);return l===void 0&&(l={},i.set(a,l)),l}function n(a){i.delete(a)}function s(a,l,c){i.get(a)[l]=c}function r(){i=new WeakMap}return{has:t,get:e,remove:n,update:s,dispose:r}}function kx(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.material.id!==t.material.id?i.material.id-t.material.id:i.z!==t.z?i.z-t.z:i.id-t.id}function Eu(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.z!==t.z?t.z-i.z:i.id-t.id}function Tu(){const i=[];let t=0;const e=[],n=[],s=[];function r(){t=0,e.length=0,n.length=0,s.length=0}function a(p,m,x,S,w,v){let f=i[t];return f===void 0?(f={id:p.id,object:p,geometry:m,material:x,groupOrder:S,renderOrder:p.renderOrder,z:w,group:v},i[t]=f):(f.id=p.id,f.object=p,f.geometry=m,f.material=x,f.groupOrder=S,f.renderOrder=p.renderOrder,f.z=w,f.group=v),t++,f}function l(p,m,x,S,w,v){const f=a(p,m,x,S,w,v);x.transmission>0?n.push(f):x.transparent===!0?s.push(f):e.push(f)}function c(p,m,x,S,w,v){const f=a(p,m,x,S,w,v);x.transmission>0?n.unshift(f):x.transparent===!0?s.unshift(f):e.unshift(f)}function h(p,m){e.length>1&&e.sort(p||kx),n.length>1&&n.sort(m||Eu),s.length>1&&s.sort(m||Eu)}function d(){for(let p=t,m=i.length;p<m;p++){const x=i[p];if(x.id===null)break;x.id=null,x.object=null,x.geometry=null,x.material=null,x.group=null}}return{opaque:e,transmissive:n,transparent:s,init:r,push:l,unshift:c,finish:d,sort:h}}function zx(){let i=new WeakMap;function t(n,s){const r=i.get(n);let a;return r===void 0?(a=new Tu,i.set(n,[a])):s>=r.length?(a=new Tu,r.push(a)):a=r[s],a}function e(){i=new WeakMap}return{get:t,dispose:e}}function Vx(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new N,color:new Pt};break;case"SpotLight":e={position:new N,direction:new N,color:new Pt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new N,color:new Pt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new N,skyColor:new Pt,groundColor:new Pt};break;case"RectAreaLight":e={color:new Pt,position:new N,halfWidth:new N,halfHeight:new N};break}return i[t.id]=e,e}}}function Hx(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new At};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new At};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new At,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[t.id]=e,e}}}let Gx=0;function Wx(i,t){return(t.castShadow?2:0)-(i.castShadow?2:0)+(t.map?1:0)-(i.map?1:0)}function Xx(i){const t=new Vx,e=Hx(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let h=0;h<9;h++)n.probe.push(new N);const s=new N,r=new xe,a=new xe;function l(h){let d=0,p=0,m=0;for(let g=0;g<9;g++)n.probe[g].set(0,0,0);let x=0,S=0,w=0,v=0,f=0,U=0,L=0,P=0,H=0,O=0,E=0;h.sort(Wx);for(let g=0,_=h.length;g<_;g++){const T=h[g],I=T.color,b=T.intensity,K=T.distance,Q=T.shadow&&T.shadow.map?T.shadow.map.texture:null;if(T.isAmbientLight)d+=I.r*b,p+=I.g*b,m+=I.b*b;else if(T.isLightProbe){for(let J=0;J<9;J++)n.probe[J].addScaledVector(T.sh.coefficients[J],b);E++}else if(T.isDirectionalLight){const J=t.get(T);if(J.color.copy(T.color).multiplyScalar(T.intensity),T.castShadow){const nt=T.shadow,$=e.get(T);$.shadowIntensity=nt.intensity,$.shadowBias=nt.bias,$.shadowNormalBias=nt.normalBias,$.shadowRadius=nt.radius,$.shadowMapSize=nt.mapSize,n.directionalShadow[x]=$,n.directionalShadowMap[x]=Q,n.directionalShadowMatrix[x]=T.shadow.matrix,U++}n.directional[x]=J,x++}else if(T.isSpotLight){const J=t.get(T);J.position.setFromMatrixPosition(T.matrixWorld),J.color.copy(I).multiplyScalar(b),J.distance=K,J.coneCos=Math.cos(T.angle),J.penumbraCos=Math.cos(T.angle*(1-T.penumbra)),J.decay=T.decay,n.spot[w]=J;const nt=T.shadow;if(T.map&&(n.spotLightMap[H]=T.map,H++,nt.updateMatrices(T),T.castShadow&&O++),n.spotLightMatrix[w]=nt.matrix,T.castShadow){const $=e.get(T);$.shadowIntensity=nt.intensity,$.shadowBias=nt.bias,$.shadowNormalBias=nt.normalBias,$.shadowRadius=nt.radius,$.shadowMapSize=nt.mapSize,n.spotShadow[w]=$,n.spotShadowMap[w]=Q,P++}w++}else if(T.isRectAreaLight){const J=t.get(T);J.color.copy(I).multiplyScalar(b),J.halfWidth.set(T.width*.5,0,0),J.halfHeight.set(0,T.height*.5,0),n.rectArea[v]=J,v++}else if(T.isPointLight){const J=t.get(T);if(J.color.copy(T.color).multiplyScalar(T.intensity),J.distance=T.distance,J.decay=T.decay,T.castShadow){const nt=T.shadow,$=e.get(T);$.shadowIntensity=nt.intensity,$.shadowBias=nt.bias,$.shadowNormalBias=nt.normalBias,$.shadowRadius=nt.radius,$.shadowMapSize=nt.mapSize,$.shadowCameraNear=nt.camera.near,$.shadowCameraFar=nt.camera.far,n.pointShadow[S]=$,n.pointShadowMap[S]=Q,n.pointShadowMatrix[S]=T.shadow.matrix,L++}n.point[S]=J,S++}else if(T.isHemisphereLight){const J=t.get(T);J.skyColor.copy(T.color).multiplyScalar(b),J.groundColor.copy(T.groundColor).multiplyScalar(b),n.hemi[f]=J,f++}}v>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=dt.LTC_FLOAT_1,n.rectAreaLTC2=dt.LTC_FLOAT_2):(n.rectAreaLTC1=dt.LTC_HALF_1,n.rectAreaLTC2=dt.LTC_HALF_2)),n.ambient[0]=d,n.ambient[1]=p,n.ambient[2]=m;const M=n.hash;(M.directionalLength!==x||M.pointLength!==S||M.spotLength!==w||M.rectAreaLength!==v||M.hemiLength!==f||M.numDirectionalShadows!==U||M.numPointShadows!==L||M.numSpotShadows!==P||M.numSpotMaps!==H||M.numLightProbes!==E)&&(n.directional.length=x,n.spot.length=w,n.rectArea.length=v,n.point.length=S,n.hemi.length=f,n.directionalShadow.length=U,n.directionalShadowMap.length=U,n.pointShadow.length=L,n.pointShadowMap.length=L,n.spotShadow.length=P,n.spotShadowMap.length=P,n.directionalShadowMatrix.length=U,n.pointShadowMatrix.length=L,n.spotLightMatrix.length=P+H-O,n.spotLightMap.length=H,n.numSpotLightShadowsWithMaps=O,n.numLightProbes=E,M.directionalLength=x,M.pointLength=S,M.spotLength=w,M.rectAreaLength=v,M.hemiLength=f,M.numDirectionalShadows=U,M.numPointShadows=L,M.numSpotShadows=P,M.numSpotMaps=H,M.numLightProbes=E,n.version=Gx++)}function c(h,d){let p=0,m=0,x=0,S=0,w=0;const v=d.matrixWorldInverse;for(let f=0,U=h.length;f<U;f++){const L=h[f];if(L.isDirectionalLight){const P=n.directional[p];P.direction.setFromMatrixPosition(L.matrixWorld),s.setFromMatrixPosition(L.target.matrixWorld),P.direction.sub(s),P.direction.transformDirection(v),p++}else if(L.isSpotLight){const P=n.spot[x];P.position.setFromMatrixPosition(L.matrixWorld),P.position.applyMatrix4(v),P.direction.setFromMatrixPosition(L.matrixWorld),s.setFromMatrixPosition(L.target.matrixWorld),P.direction.sub(s),P.direction.transformDirection(v),x++}else if(L.isRectAreaLight){const P=n.rectArea[S];P.position.setFromMatrixPosition(L.matrixWorld),P.position.applyMatrix4(v),a.identity(),r.copy(L.matrixWorld),r.premultiply(v),a.extractRotation(r),P.halfWidth.set(L.width*.5,0,0),P.halfHeight.set(0,L.height*.5,0),P.halfWidth.applyMatrix4(a),P.halfHeight.applyMatrix4(a),S++}else if(L.isPointLight){const P=n.point[m];P.position.setFromMatrixPosition(L.matrixWorld),P.position.applyMatrix4(v),m++}else if(L.isHemisphereLight){const P=n.hemi[w];P.direction.setFromMatrixPosition(L.matrixWorld),P.direction.transformDirection(v),w++}}}return{setup:l,setupView:c,state:n}}function wu(i){const t=new Xx(i),e=[],n=[];function s(d){h.camera=d,e.length=0,n.length=0}function r(d){e.push(d)}function a(d){n.push(d)}function l(){t.setup(e)}function c(d){t.setupView(e,d)}const h={lightsArray:e,shadowsArray:n,camera:null,lights:t,transmissionRenderTarget:{}};return{init:s,state:h,setupLights:l,setupLightsView:c,pushLight:r,pushShadow:a}}function qx(i){let t=new WeakMap;function e(s,r=0){const a=t.get(s);let l;return a===void 0?(l=new wu(i),t.set(s,[l])):r>=a.length?(l=new wu(i),a.push(l)):l=a[r],l}function n(){t=new WeakMap}return{get:e,dispose:n}}class jx extends wi{static get type(){return"MeshDepthMaterial"}constructor(t){super(),this.isMeshDepthMaterial=!0,this.depthPacking=Wg,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class $x extends wi{static get type(){return"MeshDistanceMaterial"}constructor(t){super(),this.isMeshDistanceMaterial=!0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}const Yx=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Kx=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function Jx(i,t,e){let n=new hc;const s=new At,r=new At,a=new _e,l=new jx({depthPacking:Xg}),c=new $x,h={},d=e.maxTextureSize,p={[Ei]:Ze,[Ze]:Ei,[Je]:Je},m=new Re({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new At},radius:{value:4}},vertexShader:Yx,fragmentShader:Kx}),x=m.clone();x.defines.HORIZONTAL_PASS=1;const S=new be;S.setAttribute("position",new Fe(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const w=new Bt(S,m),v=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Pf;let f=this.type;this.render=function(O,E,M){if(v.enabled===!1||v.autoUpdate===!1&&v.needsUpdate===!1||O.length===0)return;const g=i.getRenderTarget(),_=i.getActiveCubeFace(),T=i.getActiveMipmapLevel(),I=i.state;I.setBlending(Zn),I.buffers.color.setClear(1,1,1,1),I.buffers.depth.setTest(!0),I.setScissorTest(!1);const b=f!==$n&&this.type===$n,K=f===$n&&this.type!==$n;for(let Q=0,J=O.length;Q<J;Q++){const nt=O[Q],$=nt.shadow;if($===void 0){console.warn("THREE.WebGLShadowMap:",nt,"has no shadow.");continue}if($.autoUpdate===!1&&$.needsUpdate===!1)continue;s.copy($.mapSize);const ut=$.getFrameExtents();if(s.multiply(ut),r.copy($.mapSize),(s.x>d||s.y>d)&&(s.x>d&&(r.x=Math.floor(d/ut.x),s.x=r.x*ut.x,$.mapSize.x=r.x),s.y>d&&(r.y=Math.floor(d/ut.y),s.y=r.y*ut.y,$.mapSize.y=r.y)),$.map===null||b===!0||K===!0){const Ct=this.type!==$n?{minFilter:An,magFilter:An}:{};$.map!==null&&$.map.dispose(),$.map=new Cn(s.x,s.y,Ct),$.map.texture.name=nt.name+".shadowMap",$.camera.updateProjectionMatrix()}i.setRenderTarget($.map),i.clear();const vt=$.getViewportCount();for(let Ct=0;Ct<vt;Ct++){const Ft=$.getViewport(Ct);a.set(r.x*Ft.x,r.y*Ft.y,r.x*Ft.z,r.y*Ft.w),I.viewport(a),$.updateMatrices(nt,Ct),n=$.getFrustum(),P(E,M,$.camera,nt,this.type)}$.isPointLightShadow!==!0&&this.type===$n&&U($,M),$.needsUpdate=!1}f=this.type,v.needsUpdate=!1,i.setRenderTarget(g,_,T)};function U(O,E){const M=t.update(w);m.defines.VSM_SAMPLES!==O.blurSamples&&(m.defines.VSM_SAMPLES=O.blurSamples,x.defines.VSM_SAMPLES=O.blurSamples,m.needsUpdate=!0,x.needsUpdate=!0),O.mapPass===null&&(O.mapPass=new Cn(s.x,s.y)),m.uniforms.shadow_pass.value=O.map.texture,m.uniforms.resolution.value=O.mapSize,m.uniforms.radius.value=O.radius,i.setRenderTarget(O.mapPass),i.clear(),i.renderBufferDirect(E,null,M,m,w,null),x.uniforms.shadow_pass.value=O.mapPass.texture,x.uniforms.resolution.value=O.mapSize,x.uniforms.radius.value=O.radius,i.setRenderTarget(O.map),i.clear(),i.renderBufferDirect(E,null,M,x,w,null)}function L(O,E,M,g){let _=null;const T=M.isPointLight===!0?O.customDistanceMaterial:O.customDepthMaterial;if(T!==void 0)_=T;else if(_=M.isPointLight===!0?c:l,i.localClippingEnabled&&E.clipShadows===!0&&Array.isArray(E.clippingPlanes)&&E.clippingPlanes.length!==0||E.displacementMap&&E.displacementScale!==0||E.alphaMap&&E.alphaTest>0||E.map&&E.alphaTest>0){const I=_.uuid,b=E.uuid;let K=h[I];K===void 0&&(K={},h[I]=K);let Q=K[b];Q===void 0&&(Q=_.clone(),K[b]=Q,E.addEventListener("dispose",H)),_=Q}if(_.visible=E.visible,_.wireframe=E.wireframe,g===$n?_.side=E.shadowSide!==null?E.shadowSide:E.side:_.side=E.shadowSide!==null?E.shadowSide:p[E.side],_.alphaMap=E.alphaMap,_.alphaTest=E.alphaTest,_.map=E.map,_.clipShadows=E.clipShadows,_.clippingPlanes=E.clippingPlanes,_.clipIntersection=E.clipIntersection,_.displacementMap=E.displacementMap,_.displacementScale=E.displacementScale,_.displacementBias=E.displacementBias,_.wireframeLinewidth=E.wireframeLinewidth,_.linewidth=E.linewidth,M.isPointLight===!0&&_.isMeshDistanceMaterial===!0){const I=i.properties.get(_);I.light=M}return _}function P(O,E,M,g,_){if(O.visible===!1)return;if(O.layers.test(E.layers)&&(O.isMesh||O.isLine||O.isPoints)&&(O.castShadow||O.receiveShadow&&_===$n)&&(!O.frustumCulled||n.intersectsObject(O))){O.modelViewMatrix.multiplyMatrices(M.matrixWorldInverse,O.matrixWorld);const b=t.update(O),K=O.material;if(Array.isArray(K)){const Q=b.groups;for(let J=0,nt=Q.length;J<nt;J++){const $=Q[J],ut=K[$.materialIndex];if(ut&&ut.visible){const vt=L(O,ut,g,_);O.onBeforeShadow(i,O,E,M,b,vt,$),i.renderBufferDirect(M,null,b,vt,O,$),O.onAfterShadow(i,O,E,M,b,vt,$)}}}else if(K.visible){const Q=L(O,K,g,_);O.onBeforeShadow(i,O,E,M,b,Q,null),i.renderBufferDirect(M,null,b,Q,O,null),O.onAfterShadow(i,O,E,M,b,Q,null)}}const I=O.children;for(let b=0,K=I.length;b<K;b++)P(I[b],E,M,g,_)}function H(O){O.target.removeEventListener("dispose",H);for(const M in h){const g=h[M],_=O.target.uuid;_ in g&&(g[_].dispose(),delete g[_])}}}const Zx={[sl]:rl,[ol]:cl,[al]:hl,[Rs]:ll,[rl]:sl,[cl]:ol,[hl]:al,[ll]:Rs};function Qx(i,t){function e(){let F=!1;const pt=new _e;let j=null;const et=new _e(0,0,0,0);return{setMask:function(mt){j!==mt&&!F&&(i.colorMask(mt,mt,mt,mt),j=mt)},setLocked:function(mt){F=mt},setClear:function(mt,lt,Vt,Me,Ie){Ie===!0&&(mt*=Me,lt*=Me,Vt*=Me),pt.set(mt,lt,Vt,Me),et.equals(pt)===!1&&(i.clearColor(mt,lt,Vt,Me),et.copy(pt))},reset:function(){F=!1,j=null,et.set(-1,0,0,0)}}}function n(){let F=!1,pt=!1,j=null,et=null,mt=null;return{setReversed:function(lt){if(pt!==lt){const Vt=t.get("EXT_clip_control");pt?Vt.clipControlEXT(Vt.LOWER_LEFT_EXT,Vt.ZERO_TO_ONE_EXT):Vt.clipControlEXT(Vt.LOWER_LEFT_EXT,Vt.NEGATIVE_ONE_TO_ONE_EXT);const Me=mt;mt=null,this.setClear(Me)}pt=lt},getReversed:function(){return pt},setTest:function(lt){lt?ct(i.DEPTH_TEST):Ut(i.DEPTH_TEST)},setMask:function(lt){j!==lt&&!F&&(i.depthMask(lt),j=lt)},setFunc:function(lt){if(pt&&(lt=Zx[lt]),et!==lt){switch(lt){case sl:i.depthFunc(i.NEVER);break;case rl:i.depthFunc(i.ALWAYS);break;case ol:i.depthFunc(i.LESS);break;case Rs:i.depthFunc(i.LEQUAL);break;case al:i.depthFunc(i.EQUAL);break;case ll:i.depthFunc(i.GEQUAL);break;case cl:i.depthFunc(i.GREATER);break;case hl:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}et=lt}},setLocked:function(lt){F=lt},setClear:function(lt){mt!==lt&&(pt&&(lt=1-lt),i.clearDepth(lt),mt=lt)},reset:function(){F=!1,j=null,et=null,mt=null,pt=!1}}}function s(){let F=!1,pt=null,j=null,et=null,mt=null,lt=null,Vt=null,Me=null,Ie=null;return{setTest:function(Jt){F||(Jt?ct(i.STENCIL_TEST):Ut(i.STENCIL_TEST))},setMask:function(Jt){pt!==Jt&&!F&&(i.stencilMask(Jt),pt=Jt)},setFunc:function(Jt,tn,Ee){(j!==Jt||et!==tn||mt!==Ee)&&(i.stencilFunc(Jt,tn,Ee),j=Jt,et=tn,mt=Ee)},setOp:function(Jt,tn,Ee){(lt!==Jt||Vt!==tn||Me!==Ee)&&(i.stencilOp(Jt,tn,Ee),lt=Jt,Vt=tn,Me=Ee)},setLocked:function(Jt){F=Jt},setClear:function(Jt){Ie!==Jt&&(i.clearStencil(Jt),Ie=Jt)},reset:function(){F=!1,pt=null,j=null,et=null,mt=null,lt=null,Vt=null,Me=null,Ie=null}}}const r=new e,a=new n,l=new s,c=new WeakMap,h=new WeakMap;let d={},p={},m=new WeakMap,x=[],S=null,w=!1,v=null,f=null,U=null,L=null,P=null,H=null,O=null,E=new Pt(0,0,0),M=0,g=!1,_=null,T=null,I=null,b=null,K=null;const Q=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let J=!1,nt=0;const $=i.getParameter(i.VERSION);$.indexOf("WebGL")!==-1?(nt=parseFloat(/^WebGL (\d)/.exec($)[1]),J=nt>=1):$.indexOf("OpenGL ES")!==-1&&(nt=parseFloat(/^OpenGL ES (\d)/.exec($)[1]),J=nt>=2);let ut=null,vt={};const Ct=i.getParameter(i.SCISSOR_BOX),Ft=i.getParameter(i.VIEWPORT),kt=new _e().fromArray(Ct),Z=new _e().fromArray(Ft);function st(F,pt,j,et){const mt=new Uint8Array(4),lt=i.createTexture();i.bindTexture(F,lt),i.texParameteri(F,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(F,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let Vt=0;Vt<j;Vt++)F===i.TEXTURE_3D||F===i.TEXTURE_2D_ARRAY?i.texImage3D(pt,0,i.RGBA,1,1,et,0,i.RGBA,i.UNSIGNED_BYTE,mt):i.texImage2D(pt+Vt,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,mt);return lt}const bt={};bt[i.TEXTURE_2D]=st(i.TEXTURE_2D,i.TEXTURE_2D,1),bt[i.TEXTURE_CUBE_MAP]=st(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),bt[i.TEXTURE_2D_ARRAY]=st(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),bt[i.TEXTURE_3D]=st(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),l.setClear(0),ct(i.DEPTH_TEST),a.setFunc(Rs),jt(!1),$t(Ih),ct(i.CULL_FACE),z(Zn);function ct(F){d[F]!==!0&&(i.enable(F),d[F]=!0)}function Ut(F){d[F]!==!1&&(i.disable(F),d[F]=!1)}function zt(F,pt){return p[F]!==pt?(i.bindFramebuffer(F,pt),p[F]=pt,F===i.DRAW_FRAMEBUFFER&&(p[i.FRAMEBUFFER]=pt),F===i.FRAMEBUFFER&&(p[i.DRAW_FRAMEBUFFER]=pt),!0):!1}function Ht(F,pt){let j=x,et=!1;if(F){j=m.get(pt),j===void 0&&(j=[],m.set(pt,j));const mt=F.textures;if(j.length!==mt.length||j[0]!==i.COLOR_ATTACHMENT0){for(let lt=0,Vt=mt.length;lt<Vt;lt++)j[lt]=i.COLOR_ATTACHMENT0+lt;j.length=mt.length,et=!0}}else j[0]!==i.BACK&&(j[0]=i.BACK,et=!0);et&&i.drawBuffers(j)}function ue(F){return S!==F?(i.useProgram(F),S=F,!0):!1}const qt={[Bi]:i.FUNC_ADD,[Eg]:i.FUNC_SUBTRACT,[Tg]:i.FUNC_REVERSE_SUBTRACT};qt[wg]=i.MIN,qt[bg]=i.MAX;const Se={[Ag]:i.ZERO,[Cg]:i.ONE,[Rg]:i.SRC_COLOR,[nl]:i.SRC_ALPHA,[Ng]:i.SRC_ALPHA_SATURATE,[Lg]:i.DST_COLOR,[Ig]:i.DST_ALPHA,[Pg]:i.ONE_MINUS_SRC_COLOR,[il]:i.ONE_MINUS_SRC_ALPHA,[Ug]:i.ONE_MINUS_DST_COLOR,[Dg]:i.ONE_MINUS_DST_ALPHA,[Og]:i.CONSTANT_COLOR,[Fg]:i.ONE_MINUS_CONSTANT_COLOR,[Bg]:i.CONSTANT_ALPHA,[kg]:i.ONE_MINUS_CONSTANT_ALPHA};function z(F,pt,j,et,mt,lt,Vt,Me,Ie,Jt){if(F===Zn){w===!0&&(Ut(i.BLEND),w=!1);return}if(w===!1&&(ct(i.BLEND),w=!0),F!==Sg){if(F!==v||Jt!==g){if((f!==Bi||P!==Bi)&&(i.blendEquation(i.FUNC_ADD),f=Bi,P=Bi),Jt)switch(F){case Ts:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case _n:i.blendFunc(i.ONE,i.ONE);break;case Dh:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Lh:i.blendFuncSeparate(i.ZERO,i.SRC_COLOR,i.ZERO,i.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",F);break}else switch(F){case Ts:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case _n:i.blendFunc(i.SRC_ALPHA,i.ONE);break;case Dh:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Lh:i.blendFunc(i.ZERO,i.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",F);break}U=null,L=null,H=null,O=null,E.set(0,0,0),M=0,v=F,g=Jt}return}mt=mt||pt,lt=lt||j,Vt=Vt||et,(pt!==f||mt!==P)&&(i.blendEquationSeparate(qt[pt],qt[mt]),f=pt,P=mt),(j!==U||et!==L||lt!==H||Vt!==O)&&(i.blendFuncSeparate(Se[j],Se[et],Se[lt],Se[Vt]),U=j,L=et,H=lt,O=Vt),(Me.equals(E)===!1||Ie!==M)&&(i.blendColor(Me.r,Me.g,Me.b,Ie),E.copy(Me),M=Ie),v=F,g=!1}function Ve(F,pt){F.side===Je?Ut(i.CULL_FACE):ct(i.CULL_FACE);let j=F.side===Ze;pt&&(j=!j),jt(j),F.blending===Ts&&F.transparent===!1?z(Zn):z(F.blending,F.blendEquation,F.blendSrc,F.blendDst,F.blendEquationAlpha,F.blendSrcAlpha,F.blendDstAlpha,F.blendColor,F.blendAlpha,F.premultipliedAlpha),a.setFunc(F.depthFunc),a.setTest(F.depthTest),a.setMask(F.depthWrite),r.setMask(F.colorWrite);const et=F.stencilWrite;l.setTest(et),et&&(l.setMask(F.stencilWriteMask),l.setFunc(F.stencilFunc,F.stencilRef,F.stencilFuncMask),l.setOp(F.stencilFail,F.stencilZFail,F.stencilZPass)),fe(F.polygonOffset,F.polygonOffsetFactor,F.polygonOffsetUnits),F.alphaToCoverage===!0?ct(i.SAMPLE_ALPHA_TO_COVERAGE):Ut(i.SAMPLE_ALPHA_TO_COVERAGE)}function jt(F){_!==F&&(F?i.frontFace(i.CW):i.frontFace(i.CCW),_=F)}function $t(F){F!==xg?(ct(i.CULL_FACE),F!==T&&(F===Ih?i.cullFace(i.BACK):F===Mg?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):Ut(i.CULL_FACE),T=F}function It(F){F!==I&&(J&&i.lineWidth(F),I=F)}function fe(F,pt,j){F?(ct(i.POLYGON_OFFSET_FILL),(b!==pt||K!==j)&&(i.polygonOffset(pt,j),b=pt,K=j)):Ut(i.POLYGON_OFFSET_FILL)}function Rt(F){F?ct(i.SCISSOR_TEST):Ut(i.SCISSOR_TEST)}function D(F){F===void 0&&(F=i.TEXTURE0+Q-1),ut!==F&&(i.activeTexture(F),ut=F)}function A(F,pt,j){j===void 0&&(ut===null?j=i.TEXTURE0+Q-1:j=ut);let et=vt[j];et===void 0&&(et={type:void 0,texture:void 0},vt[j]=et),(et.type!==F||et.texture!==pt)&&(ut!==j&&(i.activeTexture(j),ut=j),i.bindTexture(F,pt||bt[F]),et.type=F,et.texture=pt)}function G(){const F=vt[ut];F!==void 0&&F.type!==void 0&&(i.bindTexture(F.type,null),F.type=void 0,F.texture=void 0)}function tt(){try{i.compressedTexImage2D.apply(i,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function it(){try{i.compressedTexImage3D.apply(i,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function Y(){try{i.texSubImage2D.apply(i,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function gt(){try{i.texSubImage3D.apply(i,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function ht(){try{i.compressedTexSubImage2D.apply(i,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function yt(){try{i.compressedTexSubImage3D.apply(i,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function Yt(){try{i.texStorage2D.apply(i,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function rt(){try{i.texStorage3D.apply(i,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function _t(){try{i.texImage2D.apply(i,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function Dt(){try{i.texImage3D.apply(i,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function Ot(F){kt.equals(F)===!1&&(i.scissor(F.x,F.y,F.z,F.w),kt.copy(F))}function xt(F){Z.equals(F)===!1&&(i.viewport(F.x,F.y,F.z,F.w),Z.copy(F))}function Kt(F,pt){let j=h.get(pt);j===void 0&&(j=new WeakMap,h.set(pt,j));let et=j.get(F);et===void 0&&(et=i.getUniformBlockIndex(pt,F.name),j.set(F,et))}function Gt(F,pt){const et=h.get(pt).get(F);c.get(pt)!==et&&(i.uniformBlockBinding(pt,et,F.__bindingPointIndex),c.set(pt,et))}function ae(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),a.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),d={},ut=null,vt={},p={},m=new WeakMap,x=[],S=null,w=!1,v=null,f=null,U=null,L=null,P=null,H=null,O=null,E=new Pt(0,0,0),M=0,g=!1,_=null,T=null,I=null,b=null,K=null,kt.set(0,0,i.canvas.width,i.canvas.height),Z.set(0,0,i.canvas.width,i.canvas.height),r.reset(),a.reset(),l.reset()}return{buffers:{color:r,depth:a,stencil:l},enable:ct,disable:Ut,bindFramebuffer:zt,drawBuffers:Ht,useProgram:ue,setBlending:z,setMaterial:Ve,setFlipSided:jt,setCullFace:$t,setLineWidth:It,setPolygonOffset:fe,setScissorTest:Rt,activeTexture:D,bindTexture:A,unbindTexture:G,compressedTexImage2D:tt,compressedTexImage3D:it,texImage2D:_t,texImage3D:Dt,updateUBOMapping:Kt,uniformBlockBinding:Gt,texStorage2D:Yt,texStorage3D:rt,texSubImage2D:Y,texSubImage3D:gt,compressedTexSubImage2D:ht,compressedTexSubImage3D:yt,scissor:Ot,viewport:xt,reset:ae}}function bu(i,t,e,n){const s=tM(n);switch(e){case Hf:return i*t;case Wf:return i*t;case Xf:return i*t*2;case qf:return i*t/s.components*s.byteLength;case rc:return i*t/s.components*s.byteLength;case jf:return i*t*2/s.components*s.byteLength;case oc:return i*t*2/s.components*s.byteLength;case Gf:return i*t*3/s.components*s.byteLength;case wn:return i*t*4/s.components*s.byteLength;case ac:return i*t*4/s.components*s.byteLength;case Eo:case To:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case wo:case bo:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case gl:case vl:return Math.max(i,16)*Math.max(t,8)/4;case ml:case _l:return Math.max(i,8)*Math.max(t,8)/2;case yl:case xl:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case Ml:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case Sl:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case El:return Math.floor((i+4)/5)*Math.floor((t+3)/4)*16;case Tl:return Math.floor((i+4)/5)*Math.floor((t+4)/5)*16;case wl:return Math.floor((i+5)/6)*Math.floor((t+4)/5)*16;case bl:return Math.floor((i+5)/6)*Math.floor((t+5)/6)*16;case Al:return Math.floor((i+7)/8)*Math.floor((t+4)/5)*16;case Cl:return Math.floor((i+7)/8)*Math.floor((t+5)/6)*16;case Rl:return Math.floor((i+7)/8)*Math.floor((t+7)/8)*16;case Pl:return Math.floor((i+9)/10)*Math.floor((t+4)/5)*16;case Il:return Math.floor((i+9)/10)*Math.floor((t+5)/6)*16;case Dl:return Math.floor((i+9)/10)*Math.floor((t+7)/8)*16;case Ll:return Math.floor((i+9)/10)*Math.floor((t+9)/10)*16;case Ul:return Math.floor((i+11)/12)*Math.floor((t+9)/10)*16;case Nl:return Math.floor((i+11)/12)*Math.floor((t+11)/12)*16;case Ao:case Ol:case Fl:return Math.ceil(i/4)*Math.ceil(t/4)*16;case $f:case Bl:return Math.ceil(i/4)*Math.ceil(t/4)*8;case kl:case zl:return Math.ceil(i/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function tM(i){switch(i){case ni:case kf:return{byteLength:1,components:1};case mr:case zf:case Qn:return{byteLength:2,components:1};case ic:case sc:return{byteLength:2,components:4};case ji:case nc:case Kn:return{byteLength:4,components:1};case Vf:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}function eM(i,t,e,n,s,r,a){const l=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),h=new At,d=new WeakMap;let p;const m=new WeakMap;let x=!1;try{x=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function S(D,A){return x?new OffscreenCanvas(D,A):Fo("canvas")}function w(D,A,G){let tt=1;const it=Rt(D);if((it.width>G||it.height>G)&&(tt=G/Math.max(it.width,it.height)),tt<1)if(typeof HTMLImageElement<"u"&&D instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&D instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&D instanceof ImageBitmap||typeof VideoFrame<"u"&&D instanceof VideoFrame){const Y=Math.floor(tt*it.width),gt=Math.floor(tt*it.height);p===void 0&&(p=S(Y,gt));const ht=A?S(Y,gt):p;return ht.width=Y,ht.height=gt,ht.getContext("2d").drawImage(D,0,0,Y,gt),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+it.width+"x"+it.height+") to ("+Y+"x"+gt+")."),ht}else return"data"in D&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+it.width+"x"+it.height+")."),D;return D}function v(D){return D.generateMipmaps}function f(D){i.generateMipmap(D)}function U(D){return D.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:D.isWebGL3DRenderTarget?i.TEXTURE_3D:D.isWebGLArrayRenderTarget||D.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function L(D,A,G,tt,it=!1){if(D!==null){if(i[D]!==void 0)return i[D];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+D+"'")}let Y=A;if(A===i.RED&&(G===i.FLOAT&&(Y=i.R32F),G===i.HALF_FLOAT&&(Y=i.R16F),G===i.UNSIGNED_BYTE&&(Y=i.R8)),A===i.RED_INTEGER&&(G===i.UNSIGNED_BYTE&&(Y=i.R8UI),G===i.UNSIGNED_SHORT&&(Y=i.R16UI),G===i.UNSIGNED_INT&&(Y=i.R32UI),G===i.BYTE&&(Y=i.R8I),G===i.SHORT&&(Y=i.R16I),G===i.INT&&(Y=i.R32I)),A===i.RG&&(G===i.FLOAT&&(Y=i.RG32F),G===i.HALF_FLOAT&&(Y=i.RG16F),G===i.UNSIGNED_BYTE&&(Y=i.RG8)),A===i.RG_INTEGER&&(G===i.UNSIGNED_BYTE&&(Y=i.RG8UI),G===i.UNSIGNED_SHORT&&(Y=i.RG16UI),G===i.UNSIGNED_INT&&(Y=i.RG32UI),G===i.BYTE&&(Y=i.RG8I),G===i.SHORT&&(Y=i.RG16I),G===i.INT&&(Y=i.RG32I)),A===i.RGB_INTEGER&&(G===i.UNSIGNED_BYTE&&(Y=i.RGB8UI),G===i.UNSIGNED_SHORT&&(Y=i.RGB16UI),G===i.UNSIGNED_INT&&(Y=i.RGB32UI),G===i.BYTE&&(Y=i.RGB8I),G===i.SHORT&&(Y=i.RGB16I),G===i.INT&&(Y=i.RGB32I)),A===i.RGBA_INTEGER&&(G===i.UNSIGNED_BYTE&&(Y=i.RGBA8UI),G===i.UNSIGNED_SHORT&&(Y=i.RGBA16UI),G===i.UNSIGNED_INT&&(Y=i.RGBA32UI),G===i.BYTE&&(Y=i.RGBA8I),G===i.SHORT&&(Y=i.RGBA16I),G===i.INT&&(Y=i.RGBA32I)),A===i.RGB&&G===i.UNSIGNED_INT_5_9_9_9_REV&&(Y=i.RGB9_E5),A===i.RGBA){const gt=it?qo:ee.getTransfer(tt);G===i.FLOAT&&(Y=i.RGBA32F),G===i.HALF_FLOAT&&(Y=i.RGBA16F),G===i.UNSIGNED_BYTE&&(Y=gt===ce?i.SRGB8_ALPHA8:i.RGBA8),G===i.UNSIGNED_SHORT_4_4_4_4&&(Y=i.RGBA4),G===i.UNSIGNED_SHORT_5_5_5_1&&(Y=i.RGB5_A1)}return(Y===i.R16F||Y===i.R32F||Y===i.RG16F||Y===i.RG32F||Y===i.RGBA16F||Y===i.RGBA32F)&&t.get("EXT_color_buffer_float"),Y}function P(D,A){let G;return D?A===null||A===ji||A===Ds?G=i.DEPTH24_STENCIL8:A===Kn?G=i.DEPTH32F_STENCIL8:A===mr&&(G=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):A===null||A===ji||A===Ds?G=i.DEPTH_COMPONENT24:A===Kn?G=i.DEPTH_COMPONENT32F:A===mr&&(G=i.DEPTH_COMPONENT16),G}function H(D,A){return v(D)===!0||D.isFramebufferTexture&&D.minFilter!==An&&D.minFilter!==mn?Math.log2(Math.max(A.width,A.height))+1:D.mipmaps!==void 0&&D.mipmaps.length>0?D.mipmaps.length:D.isCompressedTexture&&Array.isArray(D.image)?A.mipmaps.length:1}function O(D){const A=D.target;A.removeEventListener("dispose",O),M(A),A.isVideoTexture&&d.delete(A)}function E(D){const A=D.target;A.removeEventListener("dispose",E),_(A)}function M(D){const A=n.get(D);if(A.__webglInit===void 0)return;const G=D.source,tt=m.get(G);if(tt){const it=tt[A.__cacheKey];it.usedTimes--,it.usedTimes===0&&g(D),Object.keys(tt).length===0&&m.delete(G)}n.remove(D)}function g(D){const A=n.get(D);i.deleteTexture(A.__webglTexture);const G=D.source,tt=m.get(G);delete tt[A.__cacheKey],a.memory.textures--}function _(D){const A=n.get(D);if(D.depthTexture&&(D.depthTexture.dispose(),n.remove(D.depthTexture)),D.isWebGLCubeRenderTarget)for(let tt=0;tt<6;tt++){if(Array.isArray(A.__webglFramebuffer[tt]))for(let it=0;it<A.__webglFramebuffer[tt].length;it++)i.deleteFramebuffer(A.__webglFramebuffer[tt][it]);else i.deleteFramebuffer(A.__webglFramebuffer[tt]);A.__webglDepthbuffer&&i.deleteRenderbuffer(A.__webglDepthbuffer[tt])}else{if(Array.isArray(A.__webglFramebuffer))for(let tt=0;tt<A.__webglFramebuffer.length;tt++)i.deleteFramebuffer(A.__webglFramebuffer[tt]);else i.deleteFramebuffer(A.__webglFramebuffer);if(A.__webglDepthbuffer&&i.deleteRenderbuffer(A.__webglDepthbuffer),A.__webglMultisampledFramebuffer&&i.deleteFramebuffer(A.__webglMultisampledFramebuffer),A.__webglColorRenderbuffer)for(let tt=0;tt<A.__webglColorRenderbuffer.length;tt++)A.__webglColorRenderbuffer[tt]&&i.deleteRenderbuffer(A.__webglColorRenderbuffer[tt]);A.__webglDepthRenderbuffer&&i.deleteRenderbuffer(A.__webglDepthRenderbuffer)}const G=D.textures;for(let tt=0,it=G.length;tt<it;tt++){const Y=n.get(G[tt]);Y.__webglTexture&&(i.deleteTexture(Y.__webglTexture),a.memory.textures--),n.remove(G[tt])}n.remove(D)}let T=0;function I(){T=0}function b(){const D=T;return D>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+D+" texture units while this GPU supports only "+s.maxTextures),T+=1,D}function K(D){const A=[];return A.push(D.wrapS),A.push(D.wrapT),A.push(D.wrapR||0),A.push(D.magFilter),A.push(D.minFilter),A.push(D.anisotropy),A.push(D.internalFormat),A.push(D.format),A.push(D.type),A.push(D.generateMipmaps),A.push(D.premultiplyAlpha),A.push(D.flipY),A.push(D.unpackAlignment),A.push(D.colorSpace),A.join()}function Q(D,A){const G=n.get(D);if(D.isVideoTexture&&It(D),D.isRenderTargetTexture===!1&&D.version>0&&G.__version!==D.version){const tt=D.image;if(tt===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(tt.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{Z(G,D,A);return}}e.bindTexture(i.TEXTURE_2D,G.__webglTexture,i.TEXTURE0+A)}function J(D,A){const G=n.get(D);if(D.version>0&&G.__version!==D.version){Z(G,D,A);return}e.bindTexture(i.TEXTURE_2D_ARRAY,G.__webglTexture,i.TEXTURE0+A)}function nt(D,A){const G=n.get(D);if(D.version>0&&G.__version!==D.version){Z(G,D,A);return}e.bindTexture(i.TEXTURE_3D,G.__webglTexture,i.TEXTURE0+A)}function $(D,A){const G=n.get(D);if(D.version>0&&G.__version!==D.version){st(G,D,A);return}e.bindTexture(i.TEXTURE_CUBE_MAP,G.__webglTexture,i.TEXTURE0+A)}const ut={[dl]:i.REPEAT,[Hi]:i.CLAMP_TO_EDGE,[pl]:i.MIRRORED_REPEAT},vt={[An]:i.NEAREST,[Gg]:i.NEAREST_MIPMAP_NEAREST,[Vr]:i.NEAREST_MIPMAP_LINEAR,[mn]:i.LINEAR,[pa]:i.LINEAR_MIPMAP_NEAREST,[Gi]:i.LINEAR_MIPMAP_LINEAR},Ct={[jg]:i.NEVER,[Qg]:i.ALWAYS,[$g]:i.LESS,[Kf]:i.LEQUAL,[Yg]:i.EQUAL,[Zg]:i.GEQUAL,[Kg]:i.GREATER,[Jg]:i.NOTEQUAL};function Ft(D,A){if(A.type===Kn&&t.has("OES_texture_float_linear")===!1&&(A.magFilter===mn||A.magFilter===pa||A.magFilter===Vr||A.magFilter===Gi||A.minFilter===mn||A.minFilter===pa||A.minFilter===Vr||A.minFilter===Gi)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(D,i.TEXTURE_WRAP_S,ut[A.wrapS]),i.texParameteri(D,i.TEXTURE_WRAP_T,ut[A.wrapT]),(D===i.TEXTURE_3D||D===i.TEXTURE_2D_ARRAY)&&i.texParameteri(D,i.TEXTURE_WRAP_R,ut[A.wrapR]),i.texParameteri(D,i.TEXTURE_MAG_FILTER,vt[A.magFilter]),i.texParameteri(D,i.TEXTURE_MIN_FILTER,vt[A.minFilter]),A.compareFunction&&(i.texParameteri(D,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(D,i.TEXTURE_COMPARE_FUNC,Ct[A.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(A.magFilter===An||A.minFilter!==Vr&&A.minFilter!==Gi||A.type===Kn&&t.has("OES_texture_float_linear")===!1)return;if(A.anisotropy>1||n.get(A).__currentAnisotropy){const G=t.get("EXT_texture_filter_anisotropic");i.texParameterf(D,G.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(A.anisotropy,s.getMaxAnisotropy())),n.get(A).__currentAnisotropy=A.anisotropy}}}function kt(D,A){let G=!1;D.__webglInit===void 0&&(D.__webglInit=!0,A.addEventListener("dispose",O));const tt=A.source;let it=m.get(tt);it===void 0&&(it={},m.set(tt,it));const Y=K(A);if(Y!==D.__cacheKey){it[Y]===void 0&&(it[Y]={texture:i.createTexture(),usedTimes:0},a.memory.textures++,G=!0),it[Y].usedTimes++;const gt=it[D.__cacheKey];gt!==void 0&&(it[D.__cacheKey].usedTimes--,gt.usedTimes===0&&g(A)),D.__cacheKey=Y,D.__webglTexture=it[Y].texture}return G}function Z(D,A,G){let tt=i.TEXTURE_2D;(A.isDataArrayTexture||A.isCompressedArrayTexture)&&(tt=i.TEXTURE_2D_ARRAY),A.isData3DTexture&&(tt=i.TEXTURE_3D);const it=kt(D,A),Y=A.source;e.bindTexture(tt,D.__webglTexture,i.TEXTURE0+G);const gt=n.get(Y);if(Y.version!==gt.__version||it===!0){e.activeTexture(i.TEXTURE0+G);const ht=ee.getPrimaries(ee.workingColorSpace),yt=A.colorSpace===vi?null:ee.getPrimaries(A.colorSpace),Yt=A.colorSpace===vi||ht===yt?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,A.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,A.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,A.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Yt);let rt=w(A.image,!1,s.maxTextureSize);rt=fe(A,rt);const _t=r.convert(A.format,A.colorSpace),Dt=r.convert(A.type);let Ot=L(A.internalFormat,_t,Dt,A.colorSpace,A.isVideoTexture);Ft(tt,A);let xt;const Kt=A.mipmaps,Gt=A.isVideoTexture!==!0,ae=gt.__version===void 0||it===!0,F=Y.dataReady,pt=H(A,rt);if(A.isDepthTexture)Ot=P(A.format===Ls,A.type),ae&&(Gt?e.texStorage2D(i.TEXTURE_2D,1,Ot,rt.width,rt.height):e.texImage2D(i.TEXTURE_2D,0,Ot,rt.width,rt.height,0,_t,Dt,null));else if(A.isDataTexture)if(Kt.length>0){Gt&&ae&&e.texStorage2D(i.TEXTURE_2D,pt,Ot,Kt[0].width,Kt[0].height);for(let j=0,et=Kt.length;j<et;j++)xt=Kt[j],Gt?F&&e.texSubImage2D(i.TEXTURE_2D,j,0,0,xt.width,xt.height,_t,Dt,xt.data):e.texImage2D(i.TEXTURE_2D,j,Ot,xt.width,xt.height,0,_t,Dt,xt.data);A.generateMipmaps=!1}else Gt?(ae&&e.texStorage2D(i.TEXTURE_2D,pt,Ot,rt.width,rt.height),F&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,rt.width,rt.height,_t,Dt,rt.data)):e.texImage2D(i.TEXTURE_2D,0,Ot,rt.width,rt.height,0,_t,Dt,rt.data);else if(A.isCompressedTexture)if(A.isCompressedArrayTexture){Gt&&ae&&e.texStorage3D(i.TEXTURE_2D_ARRAY,pt,Ot,Kt[0].width,Kt[0].height,rt.depth);for(let j=0,et=Kt.length;j<et;j++)if(xt=Kt[j],A.format!==wn)if(_t!==null)if(Gt){if(F)if(A.layerUpdates.size>0){const mt=bu(xt.width,xt.height,A.format,A.type);for(const lt of A.layerUpdates){const Vt=xt.data.subarray(lt*mt/xt.data.BYTES_PER_ELEMENT,(lt+1)*mt/xt.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,j,0,0,lt,xt.width,xt.height,1,_t,Vt)}A.clearLayerUpdates()}else e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,j,0,0,0,xt.width,xt.height,rt.depth,_t,xt.data)}else e.compressedTexImage3D(i.TEXTURE_2D_ARRAY,j,Ot,xt.width,xt.height,rt.depth,0,xt.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Gt?F&&e.texSubImage3D(i.TEXTURE_2D_ARRAY,j,0,0,0,xt.width,xt.height,rt.depth,_t,Dt,xt.data):e.texImage3D(i.TEXTURE_2D_ARRAY,j,Ot,xt.width,xt.height,rt.depth,0,_t,Dt,xt.data)}else{Gt&&ae&&e.texStorage2D(i.TEXTURE_2D,pt,Ot,Kt[0].width,Kt[0].height);for(let j=0,et=Kt.length;j<et;j++)xt=Kt[j],A.format!==wn?_t!==null?Gt?F&&e.compressedTexSubImage2D(i.TEXTURE_2D,j,0,0,xt.width,xt.height,_t,xt.data):e.compressedTexImage2D(i.TEXTURE_2D,j,Ot,xt.width,xt.height,0,xt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Gt?F&&e.texSubImage2D(i.TEXTURE_2D,j,0,0,xt.width,xt.height,_t,Dt,xt.data):e.texImage2D(i.TEXTURE_2D,j,Ot,xt.width,xt.height,0,_t,Dt,xt.data)}else if(A.isDataArrayTexture)if(Gt){if(ae&&e.texStorage3D(i.TEXTURE_2D_ARRAY,pt,Ot,rt.width,rt.height,rt.depth),F)if(A.layerUpdates.size>0){const j=bu(rt.width,rt.height,A.format,A.type);for(const et of A.layerUpdates){const mt=rt.data.subarray(et*j/rt.data.BYTES_PER_ELEMENT,(et+1)*j/rt.data.BYTES_PER_ELEMENT);e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,et,rt.width,rt.height,1,_t,Dt,mt)}A.clearLayerUpdates()}else e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,rt.width,rt.height,rt.depth,_t,Dt,rt.data)}else e.texImage3D(i.TEXTURE_2D_ARRAY,0,Ot,rt.width,rt.height,rt.depth,0,_t,Dt,rt.data);else if(A.isData3DTexture)Gt?(ae&&e.texStorage3D(i.TEXTURE_3D,pt,Ot,rt.width,rt.height,rt.depth),F&&e.texSubImage3D(i.TEXTURE_3D,0,0,0,0,rt.width,rt.height,rt.depth,_t,Dt,rt.data)):e.texImage3D(i.TEXTURE_3D,0,Ot,rt.width,rt.height,rt.depth,0,_t,Dt,rt.data);else if(A.isFramebufferTexture){if(ae)if(Gt)e.texStorage2D(i.TEXTURE_2D,pt,Ot,rt.width,rt.height);else{let j=rt.width,et=rt.height;for(let mt=0;mt<pt;mt++)e.texImage2D(i.TEXTURE_2D,mt,Ot,j,et,0,_t,Dt,null),j>>=1,et>>=1}}else if(Kt.length>0){if(Gt&&ae){const j=Rt(Kt[0]);e.texStorage2D(i.TEXTURE_2D,pt,Ot,j.width,j.height)}for(let j=0,et=Kt.length;j<et;j++)xt=Kt[j],Gt?F&&e.texSubImage2D(i.TEXTURE_2D,j,0,0,_t,Dt,xt):e.texImage2D(i.TEXTURE_2D,j,Ot,_t,Dt,xt);A.generateMipmaps=!1}else if(Gt){if(ae){const j=Rt(rt);e.texStorage2D(i.TEXTURE_2D,pt,Ot,j.width,j.height)}F&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,_t,Dt,rt)}else e.texImage2D(i.TEXTURE_2D,0,Ot,_t,Dt,rt);v(A)&&f(tt),gt.__version=Y.version,A.onUpdate&&A.onUpdate(A)}D.__version=A.version}function st(D,A,G){if(A.image.length!==6)return;const tt=kt(D,A),it=A.source;e.bindTexture(i.TEXTURE_CUBE_MAP,D.__webglTexture,i.TEXTURE0+G);const Y=n.get(it);if(it.version!==Y.__version||tt===!0){e.activeTexture(i.TEXTURE0+G);const gt=ee.getPrimaries(ee.workingColorSpace),ht=A.colorSpace===vi?null:ee.getPrimaries(A.colorSpace),yt=A.colorSpace===vi||gt===ht?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,A.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,A.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,A.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,yt);const Yt=A.isCompressedTexture||A.image[0].isCompressedTexture,rt=A.image[0]&&A.image[0].isDataTexture,_t=[];for(let et=0;et<6;et++)!Yt&&!rt?_t[et]=w(A.image[et],!0,s.maxCubemapSize):_t[et]=rt?A.image[et].image:A.image[et],_t[et]=fe(A,_t[et]);const Dt=_t[0],Ot=r.convert(A.format,A.colorSpace),xt=r.convert(A.type),Kt=L(A.internalFormat,Ot,xt,A.colorSpace),Gt=A.isVideoTexture!==!0,ae=Y.__version===void 0||tt===!0,F=it.dataReady;let pt=H(A,Dt);Ft(i.TEXTURE_CUBE_MAP,A);let j;if(Yt){Gt&&ae&&e.texStorage2D(i.TEXTURE_CUBE_MAP,pt,Kt,Dt.width,Dt.height);for(let et=0;et<6;et++){j=_t[et].mipmaps;for(let mt=0;mt<j.length;mt++){const lt=j[mt];A.format!==wn?Ot!==null?Gt?F&&e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+et,mt,0,0,lt.width,lt.height,Ot,lt.data):e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+et,mt,Kt,lt.width,lt.height,0,lt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Gt?F&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+et,mt,0,0,lt.width,lt.height,Ot,xt,lt.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+et,mt,Kt,lt.width,lt.height,0,Ot,xt,lt.data)}}}else{if(j=A.mipmaps,Gt&&ae){j.length>0&&pt++;const et=Rt(_t[0]);e.texStorage2D(i.TEXTURE_CUBE_MAP,pt,Kt,et.width,et.height)}for(let et=0;et<6;et++)if(rt){Gt?F&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+et,0,0,0,_t[et].width,_t[et].height,Ot,xt,_t[et].data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+et,0,Kt,_t[et].width,_t[et].height,0,Ot,xt,_t[et].data);for(let mt=0;mt<j.length;mt++){const Vt=j[mt].image[et].image;Gt?F&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+et,mt+1,0,0,Vt.width,Vt.height,Ot,xt,Vt.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+et,mt+1,Kt,Vt.width,Vt.height,0,Ot,xt,Vt.data)}}else{Gt?F&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+et,0,0,0,Ot,xt,_t[et]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+et,0,Kt,Ot,xt,_t[et]);for(let mt=0;mt<j.length;mt++){const lt=j[mt];Gt?F&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+et,mt+1,0,0,Ot,xt,lt.image[et]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+et,mt+1,Kt,Ot,xt,lt.image[et])}}}v(A)&&f(i.TEXTURE_CUBE_MAP),Y.__version=it.version,A.onUpdate&&A.onUpdate(A)}D.__version=A.version}function bt(D,A,G,tt,it,Y){const gt=r.convert(G.format,G.colorSpace),ht=r.convert(G.type),yt=L(G.internalFormat,gt,ht,G.colorSpace),Yt=n.get(A),rt=n.get(G);if(rt.__renderTarget=A,!Yt.__hasExternalTextures){const _t=Math.max(1,A.width>>Y),Dt=Math.max(1,A.height>>Y);it===i.TEXTURE_3D||it===i.TEXTURE_2D_ARRAY?e.texImage3D(it,Y,yt,_t,Dt,A.depth,0,gt,ht,null):e.texImage2D(it,Y,yt,_t,Dt,0,gt,ht,null)}e.bindFramebuffer(i.FRAMEBUFFER,D),$t(A)?l.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,tt,it,rt.__webglTexture,0,jt(A)):(it===i.TEXTURE_2D||it>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&it<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,tt,it,rt.__webglTexture,Y),e.bindFramebuffer(i.FRAMEBUFFER,null)}function ct(D,A,G){if(i.bindRenderbuffer(i.RENDERBUFFER,D),A.depthBuffer){const tt=A.depthTexture,it=tt&&tt.isDepthTexture?tt.type:null,Y=P(A.stencilBuffer,it),gt=A.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ht=jt(A);$t(A)?l.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,ht,Y,A.width,A.height):G?i.renderbufferStorageMultisample(i.RENDERBUFFER,ht,Y,A.width,A.height):i.renderbufferStorage(i.RENDERBUFFER,Y,A.width,A.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,gt,i.RENDERBUFFER,D)}else{const tt=A.textures;for(let it=0;it<tt.length;it++){const Y=tt[it],gt=r.convert(Y.format,Y.colorSpace),ht=r.convert(Y.type),yt=L(Y.internalFormat,gt,ht,Y.colorSpace),Yt=jt(A);G&&$t(A)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,Yt,yt,A.width,A.height):$t(A)?l.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Yt,yt,A.width,A.height):i.renderbufferStorage(i.RENDERBUFFER,yt,A.width,A.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function Ut(D,A){if(A&&A.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(i.FRAMEBUFFER,D),!(A.depthTexture&&A.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const tt=n.get(A.depthTexture);tt.__renderTarget=A,(!tt.__webglTexture||A.depthTexture.image.width!==A.width||A.depthTexture.image.height!==A.height)&&(A.depthTexture.image.width=A.width,A.depthTexture.image.height=A.height,A.depthTexture.needsUpdate=!0),Q(A.depthTexture,0);const it=tt.__webglTexture,Y=jt(A);if(A.depthTexture.format===ws)$t(A)?l.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,it,0,Y):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,it,0);else if(A.depthTexture.format===Ls)$t(A)?l.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,it,0,Y):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,it,0);else throw new Error("Unknown depthTexture format")}function zt(D){const A=n.get(D),G=D.isWebGLCubeRenderTarget===!0;if(A.__boundDepthTexture!==D.depthTexture){const tt=D.depthTexture;if(A.__depthDisposeCallback&&A.__depthDisposeCallback(),tt){const it=()=>{delete A.__boundDepthTexture,delete A.__depthDisposeCallback,tt.removeEventListener("dispose",it)};tt.addEventListener("dispose",it),A.__depthDisposeCallback=it}A.__boundDepthTexture=tt}if(D.depthTexture&&!A.__autoAllocateDepthBuffer){if(G)throw new Error("target.depthTexture not supported in Cube render targets");Ut(A.__webglFramebuffer,D)}else if(G){A.__webglDepthbuffer=[];for(let tt=0;tt<6;tt++)if(e.bindFramebuffer(i.FRAMEBUFFER,A.__webglFramebuffer[tt]),A.__webglDepthbuffer[tt]===void 0)A.__webglDepthbuffer[tt]=i.createRenderbuffer(),ct(A.__webglDepthbuffer[tt],D,!1);else{const it=D.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Y=A.__webglDepthbuffer[tt];i.bindRenderbuffer(i.RENDERBUFFER,Y),i.framebufferRenderbuffer(i.FRAMEBUFFER,it,i.RENDERBUFFER,Y)}}else if(e.bindFramebuffer(i.FRAMEBUFFER,A.__webglFramebuffer),A.__webglDepthbuffer===void 0)A.__webglDepthbuffer=i.createRenderbuffer(),ct(A.__webglDepthbuffer,D,!1);else{const tt=D.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,it=A.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,it),i.framebufferRenderbuffer(i.FRAMEBUFFER,tt,i.RENDERBUFFER,it)}e.bindFramebuffer(i.FRAMEBUFFER,null)}function Ht(D,A,G){const tt=n.get(D);A!==void 0&&bt(tt.__webglFramebuffer,D,D.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),G!==void 0&&zt(D)}function ue(D){const A=D.texture,G=n.get(D),tt=n.get(A);D.addEventListener("dispose",E);const it=D.textures,Y=D.isWebGLCubeRenderTarget===!0,gt=it.length>1;if(gt||(tt.__webglTexture===void 0&&(tt.__webglTexture=i.createTexture()),tt.__version=A.version,a.memory.textures++),Y){G.__webglFramebuffer=[];for(let ht=0;ht<6;ht++)if(A.mipmaps&&A.mipmaps.length>0){G.__webglFramebuffer[ht]=[];for(let yt=0;yt<A.mipmaps.length;yt++)G.__webglFramebuffer[ht][yt]=i.createFramebuffer()}else G.__webglFramebuffer[ht]=i.createFramebuffer()}else{if(A.mipmaps&&A.mipmaps.length>0){G.__webglFramebuffer=[];for(let ht=0;ht<A.mipmaps.length;ht++)G.__webglFramebuffer[ht]=i.createFramebuffer()}else G.__webglFramebuffer=i.createFramebuffer();if(gt)for(let ht=0,yt=it.length;ht<yt;ht++){const Yt=n.get(it[ht]);Yt.__webglTexture===void 0&&(Yt.__webglTexture=i.createTexture(),a.memory.textures++)}if(D.samples>0&&$t(D)===!1){G.__webglMultisampledFramebuffer=i.createFramebuffer(),G.__webglColorRenderbuffer=[],e.bindFramebuffer(i.FRAMEBUFFER,G.__webglMultisampledFramebuffer);for(let ht=0;ht<it.length;ht++){const yt=it[ht];G.__webglColorRenderbuffer[ht]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,G.__webglColorRenderbuffer[ht]);const Yt=r.convert(yt.format,yt.colorSpace),rt=r.convert(yt.type),_t=L(yt.internalFormat,Yt,rt,yt.colorSpace,D.isXRRenderTarget===!0),Dt=jt(D);i.renderbufferStorageMultisample(i.RENDERBUFFER,Dt,_t,D.width,D.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ht,i.RENDERBUFFER,G.__webglColorRenderbuffer[ht])}i.bindRenderbuffer(i.RENDERBUFFER,null),D.depthBuffer&&(G.__webglDepthRenderbuffer=i.createRenderbuffer(),ct(G.__webglDepthRenderbuffer,D,!0)),e.bindFramebuffer(i.FRAMEBUFFER,null)}}if(Y){e.bindTexture(i.TEXTURE_CUBE_MAP,tt.__webglTexture),Ft(i.TEXTURE_CUBE_MAP,A);for(let ht=0;ht<6;ht++)if(A.mipmaps&&A.mipmaps.length>0)for(let yt=0;yt<A.mipmaps.length;yt++)bt(G.__webglFramebuffer[ht][yt],D,A,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+ht,yt);else bt(G.__webglFramebuffer[ht],D,A,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+ht,0);v(A)&&f(i.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(gt){for(let ht=0,yt=it.length;ht<yt;ht++){const Yt=it[ht],rt=n.get(Yt);e.bindTexture(i.TEXTURE_2D,rt.__webglTexture),Ft(i.TEXTURE_2D,Yt),bt(G.__webglFramebuffer,D,Yt,i.COLOR_ATTACHMENT0+ht,i.TEXTURE_2D,0),v(Yt)&&f(i.TEXTURE_2D)}e.unbindTexture()}else{let ht=i.TEXTURE_2D;if((D.isWebGL3DRenderTarget||D.isWebGLArrayRenderTarget)&&(ht=D.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(ht,tt.__webglTexture),Ft(ht,A),A.mipmaps&&A.mipmaps.length>0)for(let yt=0;yt<A.mipmaps.length;yt++)bt(G.__webglFramebuffer[yt],D,A,i.COLOR_ATTACHMENT0,ht,yt);else bt(G.__webglFramebuffer,D,A,i.COLOR_ATTACHMENT0,ht,0);v(A)&&f(ht),e.unbindTexture()}D.depthBuffer&&zt(D)}function qt(D){const A=D.textures;for(let G=0,tt=A.length;G<tt;G++){const it=A[G];if(v(it)){const Y=U(D),gt=n.get(it).__webglTexture;e.bindTexture(Y,gt),f(Y),e.unbindTexture()}}}const Se=[],z=[];function Ve(D){if(D.samples>0){if($t(D)===!1){const A=D.textures,G=D.width,tt=D.height;let it=i.COLOR_BUFFER_BIT;const Y=D.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,gt=n.get(D),ht=A.length>1;if(ht)for(let yt=0;yt<A.length;yt++)e.bindFramebuffer(i.FRAMEBUFFER,gt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+yt,i.RENDERBUFFER,null),e.bindFramebuffer(i.FRAMEBUFFER,gt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+yt,i.TEXTURE_2D,null,0);e.bindFramebuffer(i.READ_FRAMEBUFFER,gt.__webglMultisampledFramebuffer),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,gt.__webglFramebuffer);for(let yt=0;yt<A.length;yt++){if(D.resolveDepthBuffer&&(D.depthBuffer&&(it|=i.DEPTH_BUFFER_BIT),D.stencilBuffer&&D.resolveStencilBuffer&&(it|=i.STENCIL_BUFFER_BIT)),ht){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,gt.__webglColorRenderbuffer[yt]);const Yt=n.get(A[yt]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,Yt,0)}i.blitFramebuffer(0,0,G,tt,0,0,G,tt,it,i.NEAREST),c===!0&&(Se.length=0,z.length=0,Se.push(i.COLOR_ATTACHMENT0+yt),D.depthBuffer&&D.resolveDepthBuffer===!1&&(Se.push(Y),z.push(Y),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,z)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,Se))}if(e.bindFramebuffer(i.READ_FRAMEBUFFER,null),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),ht)for(let yt=0;yt<A.length;yt++){e.bindFramebuffer(i.FRAMEBUFFER,gt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+yt,i.RENDERBUFFER,gt.__webglColorRenderbuffer[yt]);const Yt=n.get(A[yt]).__webglTexture;e.bindFramebuffer(i.FRAMEBUFFER,gt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+yt,i.TEXTURE_2D,Yt,0)}e.bindFramebuffer(i.DRAW_FRAMEBUFFER,gt.__webglMultisampledFramebuffer)}else if(D.depthBuffer&&D.resolveDepthBuffer===!1&&c){const A=D.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[A])}}}function jt(D){return Math.min(s.maxSamples,D.samples)}function $t(D){const A=n.get(D);return D.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&A.__useRenderToTexture!==!1}function It(D){const A=a.render.frame;d.get(D)!==A&&(d.set(D,A),D.update())}function fe(D,A){const G=D.colorSpace,tt=D.format,it=D.type;return D.isCompressedTexture===!0||D.isVideoTexture===!0||G!==Fs&&G!==vi&&(ee.getTransfer(G)===ce?(tt!==wn||it!==ni)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",G)),A}function Rt(D){return typeof HTMLImageElement<"u"&&D instanceof HTMLImageElement?(h.width=D.naturalWidth||D.width,h.height=D.naturalHeight||D.height):typeof VideoFrame<"u"&&D instanceof VideoFrame?(h.width=D.displayWidth,h.height=D.displayHeight):(h.width=D.width,h.height=D.height),h}this.allocateTextureUnit=b,this.resetTextureUnits=I,this.setTexture2D=Q,this.setTexture2DArray=J,this.setTexture3D=nt,this.setTextureCube=$,this.rebindTextures=Ht,this.setupRenderTarget=ue,this.updateRenderTargetMipmap=qt,this.updateMultisampleRenderTarget=Ve,this.setupDepthRenderbuffer=zt,this.setupFrameBufferTexture=bt,this.useMultisampledRTT=$t}function nM(i,t){function e(n,s=vi){let r;const a=ee.getTransfer(s);if(n===ni)return i.UNSIGNED_BYTE;if(n===ic)return i.UNSIGNED_SHORT_4_4_4_4;if(n===sc)return i.UNSIGNED_SHORT_5_5_5_1;if(n===Vf)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===kf)return i.BYTE;if(n===zf)return i.SHORT;if(n===mr)return i.UNSIGNED_SHORT;if(n===nc)return i.INT;if(n===ji)return i.UNSIGNED_INT;if(n===Kn)return i.FLOAT;if(n===Qn)return i.HALF_FLOAT;if(n===Hf)return i.ALPHA;if(n===Gf)return i.RGB;if(n===wn)return i.RGBA;if(n===Wf)return i.LUMINANCE;if(n===Xf)return i.LUMINANCE_ALPHA;if(n===ws)return i.DEPTH_COMPONENT;if(n===Ls)return i.DEPTH_STENCIL;if(n===qf)return i.RED;if(n===rc)return i.RED_INTEGER;if(n===jf)return i.RG;if(n===oc)return i.RG_INTEGER;if(n===ac)return i.RGBA_INTEGER;if(n===Eo||n===To||n===wo||n===bo)if(a===ce)if(r=t.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===Eo)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===To)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===wo)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===bo)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=t.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===Eo)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===To)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===wo)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===bo)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===ml||n===gl||n===_l||n===vl)if(r=t.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===ml)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===gl)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===_l)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===vl)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===yl||n===xl||n===Ml)if(r=t.get("WEBGL_compressed_texture_etc"),r!==null){if(n===yl||n===xl)return a===ce?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===Ml)return a===ce?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===Sl||n===El||n===Tl||n===wl||n===bl||n===Al||n===Cl||n===Rl||n===Pl||n===Il||n===Dl||n===Ll||n===Ul||n===Nl)if(r=t.get("WEBGL_compressed_texture_astc"),r!==null){if(n===Sl)return a===ce?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===El)return a===ce?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Tl)return a===ce?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===wl)return a===ce?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===bl)return a===ce?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===Al)return a===ce?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Cl)return a===ce?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===Rl)return a===ce?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Pl)return a===ce?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Il)return a===ce?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Dl)return a===ce?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Ll)return a===ce?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===Ul)return a===ce?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Nl)return a===ce?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===Ao||n===Ol||n===Fl)if(r=t.get("EXT_texture_compression_bptc"),r!==null){if(n===Ao)return a===ce?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===Ol)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===Fl)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===$f||n===Bl||n===kl||n===zl)if(r=t.get("EXT_texture_compression_rgtc"),r!==null){if(n===Ao)return r.COMPRESSED_RED_RGTC1_EXT;if(n===Bl)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===kl)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===zl)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===Ds?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:e}}class iM extends cn{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}}class Oe extends Pe{constructor(){super(),this.isGroup=!0,this.type="Group"}}const sM={type:"move"};class Ga{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Oe,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Oe,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new N,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new N),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Oe,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new N,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new N),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let s=null,r=null,a=null;const l=this._targetRay,c=this._grip,h=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(h&&t.hand){a=!0;for(const w of t.hand.values()){const v=e.getJointPose(w,n),f=this._getHandJoint(h,w);v!==null&&(f.matrix.fromArray(v.transform.matrix),f.matrix.decompose(f.position,f.rotation,f.scale),f.matrixWorldNeedsUpdate=!0,f.jointRadius=v.radius),f.visible=v!==null}const d=h.joints["index-finger-tip"],p=h.joints["thumb-tip"],m=d.position.distanceTo(p.position),x=.02,S=.005;h.inputState.pinching&&m>x+S?(h.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!h.inputState.pinching&&m<=x-S&&(h.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else c!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,n),r!==null&&(c.matrix.fromArray(r.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,r.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(r.linearVelocity)):c.hasLinearVelocity=!1,r.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(r.angularVelocity)):c.hasAngularVelocity=!1));l!==null&&(s=e.getPose(t.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(l.matrix.fromArray(s.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,s.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(s.linearVelocity)):l.hasLinearVelocity=!1,s.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(s.angularVelocity)):l.hasAngularVelocity=!1,this.dispatchEvent(sM)))}return l!==null&&(l.visible=s!==null),c!==null&&(c.visible=r!==null),h!==null&&(h.visible=a!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const n=new Oe;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}}const rM=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,oM=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class aM{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e,n){if(this.texture===null){const s=new Qe,r=t.properties.get(s);r.__webglTexture=e.texture,(e.depthNear!=n.depthNear||e.depthFar!=n.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=s}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,n=new Re({vertexShader:rM,fragmentShader:oM,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new Bt(new ks(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class lM extends Bs{constructor(t,e){super();const n=this;let s=null,r=1,a=null,l="local-floor",c=1,h=null,d=null,p=null,m=null,x=null,S=null;const w=new aM,v=e.getContextAttributes();let f=null,U=null;const L=[],P=[],H=new At;let O=null;const E=new cn;E.viewport=new _e;const M=new cn;M.viewport=new _e;const g=[E,M],_=new iM;let T=null,I=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Z){let st=L[Z];return st===void 0&&(st=new Ga,L[Z]=st),st.getTargetRaySpace()},this.getControllerGrip=function(Z){let st=L[Z];return st===void 0&&(st=new Ga,L[Z]=st),st.getGripSpace()},this.getHand=function(Z){let st=L[Z];return st===void 0&&(st=new Ga,L[Z]=st),st.getHandSpace()};function b(Z){const st=P.indexOf(Z.inputSource);if(st===-1)return;const bt=L[st];bt!==void 0&&(bt.update(Z.inputSource,Z.frame,h||a),bt.dispatchEvent({type:Z.type,data:Z.inputSource}))}function K(){s.removeEventListener("select",b),s.removeEventListener("selectstart",b),s.removeEventListener("selectend",b),s.removeEventListener("squeeze",b),s.removeEventListener("squeezestart",b),s.removeEventListener("squeezeend",b),s.removeEventListener("end",K),s.removeEventListener("inputsourceschange",Q);for(let Z=0;Z<L.length;Z++){const st=P[Z];st!==null&&(P[Z]=null,L[Z].disconnect(st))}T=null,I=null,w.reset(),t.setRenderTarget(f),x=null,m=null,p=null,s=null,U=null,kt.stop(),n.isPresenting=!1,t.setPixelRatio(O),t.setSize(H.width,H.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Z){r=Z,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Z){l=Z,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return h||a},this.setReferenceSpace=function(Z){h=Z},this.getBaseLayer=function(){return m!==null?m:x},this.getBinding=function(){return p},this.getFrame=function(){return S},this.getSession=function(){return s},this.setSession=async function(Z){if(s=Z,s!==null){if(f=t.getRenderTarget(),s.addEventListener("select",b),s.addEventListener("selectstart",b),s.addEventListener("selectend",b),s.addEventListener("squeeze",b),s.addEventListener("squeezestart",b),s.addEventListener("squeezeend",b),s.addEventListener("end",K),s.addEventListener("inputsourceschange",Q),v.xrCompatible!==!0&&await e.makeXRCompatible(),O=t.getPixelRatio(),t.getSize(H),s.renderState.layers===void 0){const st={antialias:v.antialias,alpha:!0,depth:v.depth,stencil:v.stencil,framebufferScaleFactor:r};x=new XRWebGLLayer(s,e,st),s.updateRenderState({baseLayer:x}),t.setPixelRatio(1),t.setSize(x.framebufferWidth,x.framebufferHeight,!1),U=new Cn(x.framebufferWidth,x.framebufferHeight,{format:wn,type:ni,colorSpace:t.outputColorSpace,stencilBuffer:v.stencil})}else{let st=null,bt=null,ct=null;v.depth&&(ct=v.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,st=v.stencil?Ls:ws,bt=v.stencil?Ds:ji);const Ut={colorFormat:e.RGBA8,depthFormat:ct,scaleFactor:r};p=new XRWebGLBinding(s,e),m=p.createProjectionLayer(Ut),s.updateRenderState({layers:[m]}),t.setPixelRatio(1),t.setSize(m.textureWidth,m.textureHeight,!1),U=new Cn(m.textureWidth,m.textureHeight,{format:wn,type:ni,depthTexture:new od(m.textureWidth,m.textureHeight,bt,void 0,void 0,void 0,void 0,void 0,void 0,st),stencilBuffer:v.stencil,colorSpace:t.outputColorSpace,samples:v.antialias?4:0,resolveDepthBuffer:m.ignoreDepthValues===!1})}U.isXRRenderTarget=!0,this.setFoveation(c),h=null,a=await s.requestReferenceSpace(l),kt.setContext(s),kt.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return w.getDepthTexture()};function Q(Z){for(let st=0;st<Z.removed.length;st++){const bt=Z.removed[st],ct=P.indexOf(bt);ct>=0&&(P[ct]=null,L[ct].disconnect(bt))}for(let st=0;st<Z.added.length;st++){const bt=Z.added[st];let ct=P.indexOf(bt);if(ct===-1){for(let zt=0;zt<L.length;zt++)if(zt>=P.length){P.push(bt),ct=zt;break}else if(P[zt]===null){P[zt]=bt,ct=zt;break}if(ct===-1)break}const Ut=L[ct];Ut&&Ut.connect(bt)}}const J=new N,nt=new N;function $(Z,st,bt){J.setFromMatrixPosition(st.matrixWorld),nt.setFromMatrixPosition(bt.matrixWorld);const ct=J.distanceTo(nt),Ut=st.projectionMatrix.elements,zt=bt.projectionMatrix.elements,Ht=Ut[14]/(Ut[10]-1),ue=Ut[14]/(Ut[10]+1),qt=(Ut[9]+1)/Ut[5],Se=(Ut[9]-1)/Ut[5],z=(Ut[8]-1)/Ut[0],Ve=(zt[8]+1)/zt[0],jt=Ht*z,$t=Ht*Ve,It=ct/(-z+Ve),fe=It*-z;if(st.matrixWorld.decompose(Z.position,Z.quaternion,Z.scale),Z.translateX(fe),Z.translateZ(It),Z.matrixWorld.compose(Z.position,Z.quaternion,Z.scale),Z.matrixWorldInverse.copy(Z.matrixWorld).invert(),Ut[10]===-1)Z.projectionMatrix.copy(st.projectionMatrix),Z.projectionMatrixInverse.copy(st.projectionMatrixInverse);else{const Rt=Ht+It,D=ue+It,A=jt-fe,G=$t+(ct-fe),tt=qt*ue/D*Rt,it=Se*ue/D*Rt;Z.projectionMatrix.makePerspective(A,G,tt,it,Rt,D),Z.projectionMatrixInverse.copy(Z.projectionMatrix).invert()}}function ut(Z,st){st===null?Z.matrixWorld.copy(Z.matrix):Z.matrixWorld.multiplyMatrices(st.matrixWorld,Z.matrix),Z.matrixWorldInverse.copy(Z.matrixWorld).invert()}this.updateCamera=function(Z){if(s===null)return;let st=Z.near,bt=Z.far;w.texture!==null&&(w.depthNear>0&&(st=w.depthNear),w.depthFar>0&&(bt=w.depthFar)),_.near=M.near=E.near=st,_.far=M.far=E.far=bt,(T!==_.near||I!==_.far)&&(s.updateRenderState({depthNear:_.near,depthFar:_.far}),T=_.near,I=_.far),E.layers.mask=Z.layers.mask|2,M.layers.mask=Z.layers.mask|4,_.layers.mask=E.layers.mask|M.layers.mask;const ct=Z.parent,Ut=_.cameras;ut(_,ct);for(let zt=0;zt<Ut.length;zt++)ut(Ut[zt],ct);Ut.length===2?$(_,E,M):_.projectionMatrix.copy(E.projectionMatrix),vt(Z,_,ct)};function vt(Z,st,bt){bt===null?Z.matrix.copy(st.matrixWorld):(Z.matrix.copy(bt.matrixWorld),Z.matrix.invert(),Z.matrix.multiply(st.matrixWorld)),Z.matrix.decompose(Z.position,Z.quaternion,Z.scale),Z.updateMatrixWorld(!0),Z.projectionMatrix.copy(st.projectionMatrix),Z.projectionMatrixInverse.copy(st.projectionMatrixInverse),Z.isPerspectiveCamera&&(Z.fov=Hl*2*Math.atan(1/Z.projectionMatrix.elements[5]),Z.zoom=1)}this.getCamera=function(){return _},this.getFoveation=function(){if(!(m===null&&x===null))return c},this.setFoveation=function(Z){c=Z,m!==null&&(m.fixedFoveation=Z),x!==null&&x.fixedFoveation!==void 0&&(x.fixedFoveation=Z)},this.hasDepthSensing=function(){return w.texture!==null},this.getDepthSensingMesh=function(){return w.getMesh(_)};let Ct=null;function Ft(Z,st){if(d=st.getViewerPose(h||a),S=st,d!==null){const bt=d.views;x!==null&&(t.setRenderTargetFramebuffer(U,x.framebuffer),t.setRenderTarget(U));let ct=!1;bt.length!==_.cameras.length&&(_.cameras.length=0,ct=!0);for(let zt=0;zt<bt.length;zt++){const Ht=bt[zt];let ue=null;if(x!==null)ue=x.getViewport(Ht);else{const Se=p.getViewSubImage(m,Ht);ue=Se.viewport,zt===0&&(t.setRenderTargetTextures(U,Se.colorTexture,m.ignoreDepthValues?void 0:Se.depthStencilTexture),t.setRenderTarget(U))}let qt=g[zt];qt===void 0&&(qt=new cn,qt.layers.enable(zt),qt.viewport=new _e,g[zt]=qt),qt.matrix.fromArray(Ht.transform.matrix),qt.matrix.decompose(qt.position,qt.quaternion,qt.scale),qt.projectionMatrix.fromArray(Ht.projectionMatrix),qt.projectionMatrixInverse.copy(qt.projectionMatrix).invert(),qt.viewport.set(ue.x,ue.y,ue.width,ue.height),zt===0&&(_.matrix.copy(qt.matrix),_.matrix.decompose(_.position,_.quaternion,_.scale)),ct===!0&&_.cameras.push(qt)}const Ut=s.enabledFeatures;if(Ut&&Ut.includes("depth-sensing")){const zt=p.getDepthInformation(bt[0]);zt&&zt.isValid&&zt.texture&&w.init(t,zt,s.renderState)}}for(let bt=0;bt<L.length;bt++){const ct=P[bt],Ut=L[bt];ct!==null&&Ut!==void 0&&Ut.update(ct,st,h||a)}Ct&&Ct(Z,st),st.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:st}),S=null}const kt=new rd;kt.setAnimationLoop(Ft),this.setAnimationLoop=function(Z){Ct=Z},this.dispose=function(){}}}const Li=new Rn,cM=new xe;function hM(i,t){function e(v,f){v.matrixAutoUpdate===!0&&v.updateMatrix(),f.value.copy(v.matrix)}function n(v,f){f.color.getRGB(v.fogColor.value,id(i)),f.isFog?(v.fogNear.value=f.near,v.fogFar.value=f.far):f.isFogExp2&&(v.fogDensity.value=f.density)}function s(v,f,U,L,P){f.isMeshBasicMaterial||f.isMeshLambertMaterial?r(v,f):f.isMeshToonMaterial?(r(v,f),p(v,f)):f.isMeshPhongMaterial?(r(v,f),d(v,f)):f.isMeshStandardMaterial?(r(v,f),m(v,f),f.isMeshPhysicalMaterial&&x(v,f,P)):f.isMeshMatcapMaterial?(r(v,f),S(v,f)):f.isMeshDepthMaterial?r(v,f):f.isMeshDistanceMaterial?(r(v,f),w(v,f)):f.isMeshNormalMaterial?r(v,f):f.isLineBasicMaterial?(a(v,f),f.isLineDashedMaterial&&l(v,f)):f.isPointsMaterial?c(v,f,U,L):f.isSpriteMaterial?h(v,f):f.isShadowMaterial?(v.color.value.copy(f.color),v.opacity.value=f.opacity):f.isShaderMaterial&&(f.uniformsNeedUpdate=!1)}function r(v,f){v.opacity.value=f.opacity,f.color&&v.diffuse.value.copy(f.color),f.emissive&&v.emissive.value.copy(f.emissive).multiplyScalar(f.emissiveIntensity),f.map&&(v.map.value=f.map,e(f.map,v.mapTransform)),f.alphaMap&&(v.alphaMap.value=f.alphaMap,e(f.alphaMap,v.alphaMapTransform)),f.bumpMap&&(v.bumpMap.value=f.bumpMap,e(f.bumpMap,v.bumpMapTransform),v.bumpScale.value=f.bumpScale,f.side===Ze&&(v.bumpScale.value*=-1)),f.normalMap&&(v.normalMap.value=f.normalMap,e(f.normalMap,v.normalMapTransform),v.normalScale.value.copy(f.normalScale),f.side===Ze&&v.normalScale.value.negate()),f.displacementMap&&(v.displacementMap.value=f.displacementMap,e(f.displacementMap,v.displacementMapTransform),v.displacementScale.value=f.displacementScale,v.displacementBias.value=f.displacementBias),f.emissiveMap&&(v.emissiveMap.value=f.emissiveMap,e(f.emissiveMap,v.emissiveMapTransform)),f.specularMap&&(v.specularMap.value=f.specularMap,e(f.specularMap,v.specularMapTransform)),f.alphaTest>0&&(v.alphaTest.value=f.alphaTest);const U=t.get(f),L=U.envMap,P=U.envMapRotation;L&&(v.envMap.value=L,Li.copy(P),Li.x*=-1,Li.y*=-1,Li.z*=-1,L.isCubeTexture&&L.isRenderTargetTexture===!1&&(Li.y*=-1,Li.z*=-1),v.envMapRotation.value.setFromMatrix4(cM.makeRotationFromEuler(Li)),v.flipEnvMap.value=L.isCubeTexture&&L.isRenderTargetTexture===!1?-1:1,v.reflectivity.value=f.reflectivity,v.ior.value=f.ior,v.refractionRatio.value=f.refractionRatio),f.lightMap&&(v.lightMap.value=f.lightMap,v.lightMapIntensity.value=f.lightMapIntensity,e(f.lightMap,v.lightMapTransform)),f.aoMap&&(v.aoMap.value=f.aoMap,v.aoMapIntensity.value=f.aoMapIntensity,e(f.aoMap,v.aoMapTransform))}function a(v,f){v.diffuse.value.copy(f.color),v.opacity.value=f.opacity,f.map&&(v.map.value=f.map,e(f.map,v.mapTransform))}function l(v,f){v.dashSize.value=f.dashSize,v.totalSize.value=f.dashSize+f.gapSize,v.scale.value=f.scale}function c(v,f,U,L){v.diffuse.value.copy(f.color),v.opacity.value=f.opacity,v.size.value=f.size*U,v.scale.value=L*.5,f.map&&(v.map.value=f.map,e(f.map,v.uvTransform)),f.alphaMap&&(v.alphaMap.value=f.alphaMap,e(f.alphaMap,v.alphaMapTransform)),f.alphaTest>0&&(v.alphaTest.value=f.alphaTest)}function h(v,f){v.diffuse.value.copy(f.color),v.opacity.value=f.opacity,v.rotation.value=f.rotation,f.map&&(v.map.value=f.map,e(f.map,v.mapTransform)),f.alphaMap&&(v.alphaMap.value=f.alphaMap,e(f.alphaMap,v.alphaMapTransform)),f.alphaTest>0&&(v.alphaTest.value=f.alphaTest)}function d(v,f){v.specular.value.copy(f.specular),v.shininess.value=Math.max(f.shininess,1e-4)}function p(v,f){f.gradientMap&&(v.gradientMap.value=f.gradientMap)}function m(v,f){v.metalness.value=f.metalness,f.metalnessMap&&(v.metalnessMap.value=f.metalnessMap,e(f.metalnessMap,v.metalnessMapTransform)),v.roughness.value=f.roughness,f.roughnessMap&&(v.roughnessMap.value=f.roughnessMap,e(f.roughnessMap,v.roughnessMapTransform)),f.envMap&&(v.envMapIntensity.value=f.envMapIntensity)}function x(v,f,U){v.ior.value=f.ior,f.sheen>0&&(v.sheenColor.value.copy(f.sheenColor).multiplyScalar(f.sheen),v.sheenRoughness.value=f.sheenRoughness,f.sheenColorMap&&(v.sheenColorMap.value=f.sheenColorMap,e(f.sheenColorMap,v.sheenColorMapTransform)),f.sheenRoughnessMap&&(v.sheenRoughnessMap.value=f.sheenRoughnessMap,e(f.sheenRoughnessMap,v.sheenRoughnessMapTransform))),f.clearcoat>0&&(v.clearcoat.value=f.clearcoat,v.clearcoatRoughness.value=f.clearcoatRoughness,f.clearcoatMap&&(v.clearcoatMap.value=f.clearcoatMap,e(f.clearcoatMap,v.clearcoatMapTransform)),f.clearcoatRoughnessMap&&(v.clearcoatRoughnessMap.value=f.clearcoatRoughnessMap,e(f.clearcoatRoughnessMap,v.clearcoatRoughnessMapTransform)),f.clearcoatNormalMap&&(v.clearcoatNormalMap.value=f.clearcoatNormalMap,e(f.clearcoatNormalMap,v.clearcoatNormalMapTransform),v.clearcoatNormalScale.value.copy(f.clearcoatNormalScale),f.side===Ze&&v.clearcoatNormalScale.value.negate())),f.dispersion>0&&(v.dispersion.value=f.dispersion),f.iridescence>0&&(v.iridescence.value=f.iridescence,v.iridescenceIOR.value=f.iridescenceIOR,v.iridescenceThicknessMinimum.value=f.iridescenceThicknessRange[0],v.iridescenceThicknessMaximum.value=f.iridescenceThicknessRange[1],f.iridescenceMap&&(v.iridescenceMap.value=f.iridescenceMap,e(f.iridescenceMap,v.iridescenceMapTransform)),f.iridescenceThicknessMap&&(v.iridescenceThicknessMap.value=f.iridescenceThicknessMap,e(f.iridescenceThicknessMap,v.iridescenceThicknessMapTransform))),f.transmission>0&&(v.transmission.value=f.transmission,v.transmissionSamplerMap.value=U.texture,v.transmissionSamplerSize.value.set(U.width,U.height),f.transmissionMap&&(v.transmissionMap.value=f.transmissionMap,e(f.transmissionMap,v.transmissionMapTransform)),v.thickness.value=f.thickness,f.thicknessMap&&(v.thicknessMap.value=f.thicknessMap,e(f.thicknessMap,v.thicknessMapTransform)),v.attenuationDistance.value=f.attenuationDistance,v.attenuationColor.value.copy(f.attenuationColor)),f.anisotropy>0&&(v.anisotropyVector.value.set(f.anisotropy*Math.cos(f.anisotropyRotation),f.anisotropy*Math.sin(f.anisotropyRotation)),f.anisotropyMap&&(v.anisotropyMap.value=f.anisotropyMap,e(f.anisotropyMap,v.anisotropyMapTransform))),v.specularIntensity.value=f.specularIntensity,v.specularColor.value.copy(f.specularColor),f.specularColorMap&&(v.specularColorMap.value=f.specularColorMap,e(f.specularColorMap,v.specularColorMapTransform)),f.specularIntensityMap&&(v.specularIntensityMap.value=f.specularIntensityMap,e(f.specularIntensityMap,v.specularIntensityMapTransform))}function S(v,f){f.matcap&&(v.matcap.value=f.matcap)}function w(v,f){const U=t.get(f).light;v.referencePosition.value.setFromMatrixPosition(U.matrixWorld),v.nearDistance.value=U.shadow.camera.near,v.farDistance.value=U.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function uM(i,t,e,n){let s={},r={},a=[];const l=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function c(U,L){const P=L.program;n.uniformBlockBinding(U,P)}function h(U,L){let P=s[U.id];P===void 0&&(S(U),P=d(U),s[U.id]=P,U.addEventListener("dispose",v));const H=L.program;n.updateUBOMapping(U,H);const O=t.render.frame;r[U.id]!==O&&(m(U),r[U.id]=O)}function d(U){const L=p();U.__bindingPointIndex=L;const P=i.createBuffer(),H=U.__size,O=U.usage;return i.bindBuffer(i.UNIFORM_BUFFER,P),i.bufferData(i.UNIFORM_BUFFER,H,O),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,L,P),P}function p(){for(let U=0;U<l;U++)if(a.indexOf(U)===-1)return a.push(U),U;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function m(U){const L=s[U.id],P=U.uniforms,H=U.__cache;i.bindBuffer(i.UNIFORM_BUFFER,L);for(let O=0,E=P.length;O<E;O++){const M=Array.isArray(P[O])?P[O]:[P[O]];for(let g=0,_=M.length;g<_;g++){const T=M[g];if(x(T,O,g,H)===!0){const I=T.__offset,b=Array.isArray(T.value)?T.value:[T.value];let K=0;for(let Q=0;Q<b.length;Q++){const J=b[Q],nt=w(J);typeof J=="number"||typeof J=="boolean"?(T.__data[0]=J,i.bufferSubData(i.UNIFORM_BUFFER,I+K,T.__data)):J.isMatrix3?(T.__data[0]=J.elements[0],T.__data[1]=J.elements[1],T.__data[2]=J.elements[2],T.__data[3]=0,T.__data[4]=J.elements[3],T.__data[5]=J.elements[4],T.__data[6]=J.elements[5],T.__data[7]=0,T.__data[8]=J.elements[6],T.__data[9]=J.elements[7],T.__data[10]=J.elements[8],T.__data[11]=0):(J.toArray(T.__data,K),K+=nt.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,I,T.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function x(U,L,P,H){const O=U.value,E=L+"_"+P;if(H[E]===void 0)return typeof O=="number"||typeof O=="boolean"?H[E]=O:H[E]=O.clone(),!0;{const M=H[E];if(typeof O=="number"||typeof O=="boolean"){if(M!==O)return H[E]=O,!0}else if(M.equals(O)===!1)return M.copy(O),!0}return!1}function S(U){const L=U.uniforms;let P=0;const H=16;for(let E=0,M=L.length;E<M;E++){const g=Array.isArray(L[E])?L[E]:[L[E]];for(let _=0,T=g.length;_<T;_++){const I=g[_],b=Array.isArray(I.value)?I.value:[I.value];for(let K=0,Q=b.length;K<Q;K++){const J=b[K],nt=w(J),$=P%H,ut=$%nt.boundary,vt=$+ut;P+=ut,vt!==0&&H-vt<nt.storage&&(P+=H-vt),I.__data=new Float32Array(nt.storage/Float32Array.BYTES_PER_ELEMENT),I.__offset=P,P+=nt.storage}}}const O=P%H;return O>0&&(P+=H-O),U.__size=P,U.__cache={},this}function w(U){const L={boundary:0,storage:0};return typeof U=="number"||typeof U=="boolean"?(L.boundary=4,L.storage=4):U.isVector2?(L.boundary=8,L.storage=8):U.isVector3||U.isColor?(L.boundary=16,L.storage=12):U.isVector4?(L.boundary=16,L.storage=16):U.isMatrix3?(L.boundary=48,L.storage=48):U.isMatrix4?(L.boundary=64,L.storage=64):U.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",U),L}function v(U){const L=U.target;L.removeEventListener("dispose",v);const P=a.indexOf(L.__bindingPointIndex);a.splice(P,1),i.deleteBuffer(s[L.id]),delete s[L.id],delete r[L.id]}function f(){for(const U in s)i.deleteBuffer(s[U]);a=[],s={},r={}}return{bind:c,update:h,dispose:f}}class fM{constructor(t={}){const{canvas:e=e_(),context:n=null,depth:s=!0,stencil:r=!1,alpha:a=!1,antialias:l=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:h=!1,powerPreference:d="default",failIfMajorPerformanceCaveat:p=!1,reverseDepthBuffer:m=!1}=t;this.isWebGLRenderer=!0;let x;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");x=n.getContextAttributes().alpha}else x=a;const S=new Uint32Array(4),w=new Int32Array(4);let v=null,f=null;const U=[],L=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=dn,this.toneMapping=Mi,this.toneMappingExposure=1;const P=this;let H=!1,O=0,E=0,M=null,g=-1,_=null;const T=new _e,I=new _e;let b=null;const K=new Pt(0);let Q=0,J=e.width,nt=e.height,$=1,ut=null,vt=null;const Ct=new _e(0,0,J,nt),Ft=new _e(0,0,J,nt);let kt=!1;const Z=new hc;let st=!1,bt=!1;const ct=new xe,Ut=new xe,zt=new N,Ht=new _e,ue={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let qt=!1;function Se(){return M===null?$:1}let z=n;function Ve(C,B){return e.getContext(C,B)}try{const C={alpha:!0,depth:s,stencil:r,antialias:l,premultipliedAlpha:c,preserveDrawingBuffer:h,powerPreference:d,failIfMajorPerformanceCaveat:p};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${tc}`),e.addEventListener("webglcontextlost",et,!1),e.addEventListener("webglcontextrestored",mt,!1),e.addEventListener("webglcontextcreationerror",lt,!1),z===null){const B="webgl2";if(z=Ve(B,C),z===null)throw Ve(B)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(C){throw console.error("THREE.WebGLRenderer: "+C.message),C}let jt,$t,It,fe,Rt,D,A,G,tt,it,Y,gt,ht,yt,Yt,rt,_t,Dt,Ot,xt,Kt,Gt,ae,F;function pt(){jt=new _y(z),jt.init(),Gt=new nM(z,jt),$t=new uy(z,jt,t,Gt),It=new Qx(z,jt),$t.reverseDepthBuffer&&m&&It.buffers.depth.setReversed(!0),fe=new xy(z),Rt=new Bx,D=new eM(z,jt,It,Rt,$t,Gt,fe),A=new dy(P),G=new gy(P),tt=new A_(z),ae=new cy(z,tt),it=new vy(z,tt,fe,ae),Y=new Sy(z,it,tt,fe),Ot=new My(z,$t,D),rt=new fy(Rt),gt=new Fx(P,A,G,jt,$t,ae,rt),ht=new hM(P,Rt),yt=new zx,Yt=new qx(jt),Dt=new ly(P,A,G,It,Y,x,c),_t=new Jx(P,Y,$t),F=new uM(z,fe,$t,It),xt=new hy(z,jt,fe),Kt=new yy(z,jt,fe),fe.programs=gt.programs,P.capabilities=$t,P.extensions=jt,P.properties=Rt,P.renderLists=yt,P.shadowMap=_t,P.state=It,P.info=fe}pt();const j=new lM(P,z);this.xr=j,this.getContext=function(){return z},this.getContextAttributes=function(){return z.getContextAttributes()},this.forceContextLoss=function(){const C=jt.get("WEBGL_lose_context");C&&C.loseContext()},this.forceContextRestore=function(){const C=jt.get("WEBGL_lose_context");C&&C.restoreContext()},this.getPixelRatio=function(){return $},this.setPixelRatio=function(C){C!==void 0&&($=C,this.setSize(J,nt,!1))},this.getSize=function(C){return C.set(J,nt)},this.setSize=function(C,B,W=!0){if(j.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}J=C,nt=B,e.width=Math.floor(C*$),e.height=Math.floor(B*$),W===!0&&(e.style.width=C+"px",e.style.height=B+"px"),this.setViewport(0,0,C,B)},this.getDrawingBufferSize=function(C){return C.set(J*$,nt*$).floor()},this.setDrawingBufferSize=function(C,B,W){J=C,nt=B,$=W,e.width=Math.floor(C*W),e.height=Math.floor(B*W),this.setViewport(0,0,C,B)},this.getCurrentViewport=function(C){return C.copy(T)},this.getViewport=function(C){return C.copy(Ct)},this.setViewport=function(C,B,W,X){C.isVector4?Ct.set(C.x,C.y,C.z,C.w):Ct.set(C,B,W,X),It.viewport(T.copy(Ct).multiplyScalar($).round())},this.getScissor=function(C){return C.copy(Ft)},this.setScissor=function(C,B,W,X){C.isVector4?Ft.set(C.x,C.y,C.z,C.w):Ft.set(C,B,W,X),It.scissor(I.copy(Ft).multiplyScalar($).round())},this.getScissorTest=function(){return kt},this.setScissorTest=function(C){It.setScissorTest(kt=C)},this.setOpaqueSort=function(C){ut=C},this.setTransparentSort=function(C){vt=C},this.getClearColor=function(C){return C.copy(Dt.getClearColor())},this.setClearColor=function(){Dt.setClearColor.apply(Dt,arguments)},this.getClearAlpha=function(){return Dt.getClearAlpha()},this.setClearAlpha=function(){Dt.setClearAlpha.apply(Dt,arguments)},this.clear=function(C=!0,B=!0,W=!0){let X=0;if(C){let k=!1;if(M!==null){const ot=M.texture.format;k=ot===ac||ot===oc||ot===rc}if(k){const ot=M.texture.type,ft=ot===ni||ot===ji||ot===mr||ot===Ds||ot===ic||ot===sc,Tt=Dt.getClearColor(),St=Dt.getClearAlpha(),Lt=Tt.r,Nt=Tt.g,Et=Tt.b;ft?(S[0]=Lt,S[1]=Nt,S[2]=Et,S[3]=St,z.clearBufferuiv(z.COLOR,0,S)):(w[0]=Lt,w[1]=Nt,w[2]=Et,w[3]=St,z.clearBufferiv(z.COLOR,0,w))}else X|=z.COLOR_BUFFER_BIT}B&&(X|=z.DEPTH_BUFFER_BIT),W&&(X|=z.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),z.clear(X)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",et,!1),e.removeEventListener("webglcontextrestored",mt,!1),e.removeEventListener("webglcontextcreationerror",lt,!1),yt.dispose(),Yt.dispose(),Rt.dispose(),A.dispose(),G.dispose(),Y.dispose(),ae.dispose(),F.dispose(),gt.dispose(),j.dispose(),j.removeEventListener("sessionstart",Hs),j.removeEventListener("sessionend",si),en.stop()};function et(C){C.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),H=!0}function mt(){console.log("THREE.WebGLRenderer: Context Restored."),H=!1;const C=fe.autoReset,B=_t.enabled,W=_t.autoUpdate,X=_t.needsUpdate,k=_t.type;pt(),fe.autoReset=C,_t.enabled=B,_t.autoUpdate=W,_t.needsUpdate=X,_t.type=k}function lt(C){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",C.statusMessage)}function Vt(C){const B=C.target;B.removeEventListener("dispose",Vt),Me(B)}function Me(C){Ie(C),Rt.remove(C)}function Ie(C){const B=Rt.get(C).programs;B!==void 0&&(B.forEach(function(W){gt.releaseProgram(W)}),C.isShaderMaterial&&gt.releaseShaderCache(C))}this.renderBufferDirect=function(C,B,W,X,k,ot){B===null&&(B=ue);const ft=k.isMesh&&k.matrixWorld.determinant()<0,Tt=Ki(C,B,W,X,k);It.setMaterial(X,ft);let St=W.index,Lt=1;if(X.wireframe===!0){if(St=it.getWireframeAttribute(W),St===void 0)return;Lt=2}const Nt=W.drawRange,Et=W.attributes.position;let Zt=Nt.start*Lt,le=(Nt.start+Nt.count)*Lt;ot!==null&&(Zt=Math.max(Zt,ot.start*Lt),le=Math.min(le,(ot.start+ot.count)*Lt)),St!==null?(Zt=Math.max(Zt,0),le=Math.min(le,St.count)):Et!=null&&(Zt=Math.max(Zt,0),le=Math.min(le,Et.count));const de=le-Zt;if(de<0||de===1/0)return;ae.setup(k,X,Tt,W,St);let Be,Qt=xt;if(St!==null&&(Be=tt.get(St),Qt=Kt,Qt.setIndex(Be)),k.isMesh)X.wireframe===!0?(It.setLineWidth(X.wireframeLinewidth*Se()),Qt.setMode(z.LINES)):Qt.setMode(z.TRIANGLES);else if(k.isLine){let wt=X.linewidth;wt===void 0&&(wt=1),It.setLineWidth(wt*Se()),k.isLineSegments?Qt.setMode(z.LINES):k.isLineLoop?Qt.setMode(z.LINE_LOOP):Qt.setMode(z.LINE_STRIP)}else k.isPoints?Qt.setMode(z.POINTS):k.isSprite&&Qt.setMode(z.TRIANGLES);if(k.isBatchedMesh)if(k._multiDrawInstances!==null)Qt.renderMultiDrawInstances(k._multiDrawStarts,k._multiDrawCounts,k._multiDrawCount,k._multiDrawInstances);else if(jt.get("WEBGL_multi_draw"))Qt.renderMultiDraw(k._multiDrawStarts,k._multiDrawCounts,k._multiDrawCount);else{const wt=k._multiDrawStarts,hn=k._multiDrawCounts,ne=k._multiDrawCount,nn=St?tt.get(St).bytesPerElement:1,oi=Rt.get(X).currentProgram.getUniforms();for(let He=0;He<ne;He++)oi.setValue(z,"_gl_DrawID",He),Qt.render(wt[He]/nn,hn[He])}else if(k.isInstancedMesh)Qt.renderInstances(Zt,de,k.count);else if(W.isInstancedBufferGeometry){const wt=W._maxInstanceCount!==void 0?W._maxInstanceCount:1/0,hn=Math.min(W.instanceCount,wt);Qt.renderInstances(Zt,de,hn)}else Qt.render(Zt,de)};function Jt(C,B,W){C.transparent===!0&&C.side===Je&&C.forceSinglePass===!1?(C.side=Ze,C.needsUpdate=!0,ri(C,B,W),C.side=Ei,C.needsUpdate=!0,ri(C,B,W),C.side=Je):ri(C,B,W)}this.compile=function(C,B,W=null){W===null&&(W=C),f=Yt.get(W),f.init(B),L.push(f),W.traverseVisible(function(k){k.isLight&&k.layers.test(B.layers)&&(f.pushLight(k),k.castShadow&&f.pushShadow(k))}),C!==W&&C.traverseVisible(function(k){k.isLight&&k.layers.test(B.layers)&&(f.pushLight(k),k.castShadow&&f.pushShadow(k))}),f.setupLights();const X=new Set;return C.traverse(function(k){if(!(k.isMesh||k.isPoints||k.isLine||k.isSprite))return;const ot=k.material;if(ot)if(Array.isArray(ot))for(let ft=0;ft<ot.length;ft++){const Tt=ot[ft];Jt(Tt,W,k),X.add(Tt)}else Jt(ot,W,k),X.add(ot)}),L.pop(),f=null,X},this.compileAsync=function(C,B,W=null){const X=this.compile(C,B,W);return new Promise(k=>{function ot(){if(X.forEach(function(ft){Rt.get(ft).currentProgram.isReady()&&X.delete(ft)}),X.size===0){k(C);return}setTimeout(ot,10)}jt.get("KHR_parallel_shader_compile")!==null?ot():setTimeout(ot,10)})};let tn=null;function Ee(C){tn&&tn(C)}function Hs(){en.stop()}function si(){en.start()}const en=new rd;en.setAnimationLoop(Ee),typeof self<"u"&&en.setContext(self),this.setAnimationLoop=function(C){tn=C,j.setAnimationLoop(C),C===null?en.stop():en.start()},j.addEventListener("sessionstart",Hs),j.addEventListener("sessionend",si),this.render=function(C,B){if(B!==void 0&&B.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(H===!0)return;if(C.matrixWorldAutoUpdate===!0&&C.updateMatrixWorld(),B.parent===null&&B.matrixWorldAutoUpdate===!0&&B.updateMatrixWorld(),j.enabled===!0&&j.isPresenting===!0&&(j.cameraAutoUpdate===!0&&j.updateCamera(B),B=j.getCamera()),C.isScene===!0&&C.onBeforeRender(P,C,B,M),f=Yt.get(C,L.length),f.init(B),L.push(f),Ut.multiplyMatrices(B.projectionMatrix,B.matrixWorldInverse),Z.setFromProjectionMatrix(Ut),bt=this.localClippingEnabled,st=rt.init(this.clippingPlanes,bt),v=yt.get(C,U.length),v.init(),U.push(v),j.enabled===!0&&j.isPresenting===!0){const ot=P.xr.getDepthSensingMesh();ot!==null&&Gs(ot,B,-1/0,P.sortObjects)}Gs(C,B,0,P.sortObjects),v.finish(),P.sortObjects===!0&&v.sort(ut,vt),qt=j.enabled===!1||j.isPresenting===!1||j.hasDepthSensing()===!1,qt&&Dt.addToRenderList(v,C),this.info.render.frame++,st===!0&&rt.beginShadows();const W=f.state.shadowsArray;_t.render(W,C,B),st===!0&&rt.endShadows(),this.info.autoReset===!0&&this.info.reset();const X=v.opaque,k=v.transmissive;if(f.setupLights(),B.isArrayCamera){const ot=B.cameras;if(k.length>0)for(let ft=0,Tt=ot.length;ft<Tt;ft++){const St=ot[ft];Vn(X,k,C,St)}qt&&Dt.render(C);for(let ft=0,Tt=ot.length;ft<Tt;ft++){const St=ot[ft];wr(v,C,St,St.viewport)}}else k.length>0&&Vn(X,k,C,B),qt&&Dt.render(C),wr(v,C,B);M!==null&&(D.updateMultisampleRenderTarget(M),D.updateRenderTargetMipmap(M)),C.isScene===!0&&C.onAfterRender(P,C,B),ae.resetDefaultState(),g=-1,_=null,L.pop(),L.length>0?(f=L[L.length-1],st===!0&&rt.setGlobalState(P.clippingPlanes,f.state.camera)):f=null,U.pop(),U.length>0?v=U[U.length-1]:v=null};function Gs(C,B,W,X){if(C.visible===!1)return;if(C.layers.test(B.layers)){if(C.isGroup)W=C.renderOrder;else if(C.isLOD)C.autoUpdate===!0&&C.update(B);else if(C.isLight)f.pushLight(C),C.castShadow&&f.pushShadow(C);else if(C.isSprite){if(!C.frustumCulled||Z.intersectsSprite(C)){X&&Ht.setFromMatrixPosition(C.matrixWorld).applyMatrix4(Ut);const ft=Y.update(C),Tt=C.material;Tt.visible&&v.push(C,ft,Tt,W,Ht.z,null)}}else if((C.isMesh||C.isLine||C.isPoints)&&(!C.frustumCulled||Z.intersectsObject(C))){const ft=Y.update(C),Tt=C.material;if(X&&(C.boundingSphere!==void 0?(C.boundingSphere===null&&C.computeBoundingSphere(),Ht.copy(C.boundingSphere.center)):(ft.boundingSphere===null&&ft.computeBoundingSphere(),Ht.copy(ft.boundingSphere.center)),Ht.applyMatrix4(C.matrixWorld).applyMatrix4(Ut)),Array.isArray(Tt)){const St=ft.groups;for(let Lt=0,Nt=St.length;Lt<Nt;Lt++){const Et=St[Lt],Zt=Tt[Et.materialIndex];Zt&&Zt.visible&&v.push(C,ft,Zt,W,Ht.z,Et)}}else Tt.visible&&v.push(C,ft,Tt,W,Ht.z,null)}}const ot=C.children;for(let ft=0,Tt=ot.length;ft<Tt;ft++)Gs(ot[ft],B,W,X)}function wr(C,B,W,X){const k=C.opaque,ot=C.transmissive,ft=C.transparent;f.setupLightsView(W),st===!0&&rt.setGlobalState(P.clippingPlanes,W),X&&It.viewport(T.copy(X)),k.length>0&&$i(k,B,W),ot.length>0&&$i(ot,B,W),ft.length>0&&$i(ft,B,W),It.buffers.depth.setTest(!0),It.buffers.depth.setMask(!0),It.buffers.color.setMask(!0),It.setPolygonOffset(!1)}function Vn(C,B,W,X){if((W.isScene===!0?W.overrideMaterial:null)!==null)return;f.state.transmissionRenderTarget[X.id]===void 0&&(f.state.transmissionRenderTarget[X.id]=new Cn(1,1,{generateMipmaps:!0,type:jt.has("EXT_color_buffer_half_float")||jt.has("EXT_color_buffer_float")?Qn:ni,minFilter:Gi,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:ee.workingColorSpace}));const ot=f.state.transmissionRenderTarget[X.id],ft=X.viewport||T;ot.setSize(ft.z,ft.w);const Tt=P.getRenderTarget();P.setRenderTarget(ot),P.getClearColor(K),Q=P.getClearAlpha(),Q<1&&P.setClearColor(16777215,.5),P.clear(),qt&&Dt.render(W);const St=P.toneMapping;P.toneMapping=Mi;const Lt=X.viewport;if(X.viewport!==void 0&&(X.viewport=void 0),f.setupLightsView(X),st===!0&&rt.setGlobalState(P.clippingPlanes,X),$i(C,W,X),D.updateMultisampleRenderTarget(ot),D.updateRenderTargetMipmap(ot),jt.has("WEBGL_multisampled_render_to_texture")===!1){let Nt=!1;for(let Et=0,Zt=B.length;Et<Zt;Et++){const le=B[Et],de=le.object,Be=le.geometry,Qt=le.material,wt=le.group;if(Qt.side===Je&&de.layers.test(X.layers)){const hn=Qt.side;Qt.side=Ze,Qt.needsUpdate=!0,br(de,W,X,Be,Qt,wt),Qt.side=hn,Qt.needsUpdate=!0,Nt=!0}}Nt===!0&&(D.updateMultisampleRenderTarget(ot),D.updateRenderTargetMipmap(ot))}P.setRenderTarget(Tt),P.setClearColor(K,Q),Lt!==void 0&&(X.viewport=Lt),P.toneMapping=St}function $i(C,B,W){const X=B.isScene===!0?B.overrideMaterial:null;for(let k=0,ot=C.length;k<ot;k++){const ft=C[k],Tt=ft.object,St=ft.geometry,Lt=X===null?ft.material:X,Nt=ft.group;Tt.layers.test(W.layers)&&br(Tt,B,W,St,Lt,Nt)}}function br(C,B,W,X,k,ot){C.onBeforeRender(P,B,W,X,k,ot),C.modelViewMatrix.multiplyMatrices(W.matrixWorldInverse,C.matrixWorld),C.normalMatrix.getNormalMatrix(C.modelViewMatrix),k.onBeforeRender(P,B,W,X,C,ot),k.transparent===!0&&k.side===Je&&k.forceSinglePass===!1?(k.side=Ze,k.needsUpdate=!0,P.renderBufferDirect(W,B,X,k,C,ot),k.side=Ei,k.needsUpdate=!0,P.renderBufferDirect(W,B,X,k,C,ot),k.side=Je):P.renderBufferDirect(W,B,X,k,C,ot),C.onAfterRender(P,B,W,X,k,ot)}function ri(C,B,W){B.isScene!==!0&&(B=ue);const X=Rt.get(C),k=f.state.lights,ot=f.state.shadowsArray,ft=k.state.version,Tt=gt.getParameters(C,k.state,ot,B,W),St=gt.getProgramCacheKey(Tt);let Lt=X.programs;X.environment=C.isMeshStandardMaterial?B.environment:null,X.fog=B.fog,X.envMap=(C.isMeshStandardMaterial?G:A).get(C.envMap||X.environment),X.envMapRotation=X.environment!==null&&C.envMap===null?B.environmentRotation:C.envMapRotation,Lt===void 0&&(C.addEventListener("dispose",Vt),Lt=new Map,X.programs=Lt);let Nt=Lt.get(St);if(Nt!==void 0){if(X.currentProgram===Nt&&X.lightsStateVersion===ft)return Yi(C,Tt),Nt}else Tt.uniforms=gt.getUniforms(C),C.onBeforeCompile(Tt,P),Nt=gt.acquireProgram(Tt,St),Lt.set(St,Nt),X.uniforms=Tt.uniforms;const Et=X.uniforms;return(!C.isShaderMaterial&&!C.isRawShaderMaterial||C.clipping===!0)&&(Et.clippingPlanes=rt.uniform),Yi(C,Tt),X.needsLights=Cr(C),X.lightsStateVersion=ft,X.needsLights&&(Et.ambientLightColor.value=k.state.ambient,Et.lightProbe.value=k.state.probe,Et.directionalLights.value=k.state.directional,Et.directionalLightShadows.value=k.state.directionalShadow,Et.spotLights.value=k.state.spot,Et.spotLightShadows.value=k.state.spotShadow,Et.rectAreaLights.value=k.state.rectArea,Et.ltc_1.value=k.state.rectAreaLTC1,Et.ltc_2.value=k.state.rectAreaLTC2,Et.pointLights.value=k.state.point,Et.pointLightShadows.value=k.state.pointShadow,Et.hemisphereLights.value=k.state.hemi,Et.directionalShadowMap.value=k.state.directionalShadowMap,Et.directionalShadowMatrix.value=k.state.directionalShadowMatrix,Et.spotShadowMap.value=k.state.spotShadowMap,Et.spotLightMatrix.value=k.state.spotLightMatrix,Et.spotLightMap.value=k.state.spotLightMap,Et.pointShadowMap.value=k.state.pointShadowMap,Et.pointShadowMatrix.value=k.state.pointShadowMatrix),X.currentProgram=Nt,X.uniformsList=null,Nt}function Ar(C){if(C.uniformsList===null){const B=C.currentProgram.getUniforms();C.uniformsList=Co.seqWithValue(B.seq,C.uniforms)}return C.uniformsList}function Yi(C,B){const W=Rt.get(C);W.outputColorSpace=B.outputColorSpace,W.batching=B.batching,W.batchingColor=B.batchingColor,W.instancing=B.instancing,W.instancingColor=B.instancingColor,W.instancingMorph=B.instancingMorph,W.skinning=B.skinning,W.morphTargets=B.morphTargets,W.morphNormals=B.morphNormals,W.morphColors=B.morphColors,W.morphTargetsCount=B.morphTargetsCount,W.numClippingPlanes=B.numClippingPlanes,W.numIntersection=B.numClipIntersection,W.vertexAlphas=B.vertexAlphas,W.vertexTangents=B.vertexTangents,W.toneMapping=B.toneMapping}function Ki(C,B,W,X,k){B.isScene!==!0&&(B=ue),D.resetTextureUnits();const ot=B.fog,ft=X.isMeshStandardMaterial?B.environment:null,Tt=M===null?P.outputColorSpace:M.isXRRenderTarget===!0?M.texture.colorSpace:Fs,St=(X.isMeshStandardMaterial?G:A).get(X.envMap||ft),Lt=X.vertexColors===!0&&!!W.attributes.color&&W.attributes.color.itemSize===4,Nt=!!W.attributes.tangent&&(!!X.normalMap||X.anisotropy>0),Et=!!W.morphAttributes.position,Zt=!!W.morphAttributes.normal,le=!!W.morphAttributes.color;let de=Mi;X.toneMapped&&(M===null||M.isXRRenderTarget===!0)&&(de=P.toneMapping);const Be=W.morphAttributes.position||W.morphAttributes.normal||W.morphAttributes.color,Qt=Be!==void 0?Be.length:0,wt=Rt.get(X),hn=f.state.lights;if(st===!0&&(bt===!0||C!==_)){const ke=C===_&&X.id===g;rt.setState(X,C,ke)}let ne=!1;X.version===wt.__version?(wt.needsLights&&wt.lightsStateVersion!==hn.state.version||wt.outputColorSpace!==Tt||k.isBatchedMesh&&wt.batching===!1||!k.isBatchedMesh&&wt.batching===!0||k.isBatchedMesh&&wt.batchingColor===!0&&k.colorTexture===null||k.isBatchedMesh&&wt.batchingColor===!1&&k.colorTexture!==null||k.isInstancedMesh&&wt.instancing===!1||!k.isInstancedMesh&&wt.instancing===!0||k.isSkinnedMesh&&wt.skinning===!1||!k.isSkinnedMesh&&wt.skinning===!0||k.isInstancedMesh&&wt.instancingColor===!0&&k.instanceColor===null||k.isInstancedMesh&&wt.instancingColor===!1&&k.instanceColor!==null||k.isInstancedMesh&&wt.instancingMorph===!0&&k.morphTexture===null||k.isInstancedMesh&&wt.instancingMorph===!1&&k.morphTexture!==null||wt.envMap!==St||X.fog===!0&&wt.fog!==ot||wt.numClippingPlanes!==void 0&&(wt.numClippingPlanes!==rt.numPlanes||wt.numIntersection!==rt.numIntersection)||wt.vertexAlphas!==Lt||wt.vertexTangents!==Nt||wt.morphTargets!==Et||wt.morphNormals!==Zt||wt.morphColors!==le||wt.toneMapping!==de||wt.morphTargetsCount!==Qt)&&(ne=!0):(ne=!0,wt.__version=X.version);let nn=wt.currentProgram;ne===!0&&(nn=ri(X,B,k));let oi=!1,He=!1,ai=!1;const ve=nn.getUniforms(),Ue=wt.uniforms;if(It.useProgram(nn.program)&&(oi=!0,He=!0,ai=!0),X.id!==g&&(g=X.id,He=!0),oi||_!==C){It.buffers.depth.getReversed()?(ct.copy(C.projectionMatrix),i_(ct),s_(ct),ve.setValue(z,"projectionMatrix",ct)):ve.setValue(z,"projectionMatrix",C.projectionMatrix),ve.setValue(z,"viewMatrix",C.matrixWorldInverse);const sn=ve.map.cameraPosition;sn!==void 0&&sn.setValue(z,zt.setFromMatrixPosition(C.matrixWorld)),$t.logarithmicDepthBuffer&&ve.setValue(z,"logDepthBufFC",2/(Math.log(C.far+1)/Math.LN2)),(X.isMeshPhongMaterial||X.isMeshToonMaterial||X.isMeshLambertMaterial||X.isMeshBasicMaterial||X.isMeshStandardMaterial||X.isShaderMaterial)&&ve.setValue(z,"isOrthographic",C.isOrthographicCamera===!0),_!==C&&(_=C,He=!0,ai=!0)}if(k.isSkinnedMesh){ve.setOptional(z,k,"bindMatrix"),ve.setOptional(z,k,"bindMatrixInverse");const ke=k.skeleton;ke&&(ke.boneTexture===null&&ke.computeBoneTexture(),ve.setValue(z,"boneTexture",ke.boneTexture,D))}k.isBatchedMesh&&(ve.setOptional(z,k,"batchingTexture"),ve.setValue(z,"batchingTexture",k._matricesTexture,D),ve.setOptional(z,k,"batchingIdTexture"),ve.setValue(z,"batchingIdTexture",k._indirectTexture,D),ve.setOptional(z,k,"batchingColorTexture"),k._colorsTexture!==null&&ve.setValue(z,"batchingColorTexture",k._colorsTexture,D));const je=W.morphAttributes;if((je.position!==void 0||je.normal!==void 0||je.color!==void 0)&&Ot.update(k,W,nn),(He||wt.receiveShadow!==k.receiveShadow)&&(wt.receiveShadow=k.receiveShadow,ve.setValue(z,"receiveShadow",k.receiveShadow)),X.isMeshGouraudMaterial&&X.envMap!==null&&(Ue.envMap.value=St,Ue.flipEnvMap.value=St.isCubeTexture&&St.isRenderTargetTexture===!1?-1:1),X.isMeshStandardMaterial&&X.envMap===null&&B.environment!==null&&(Ue.envMapIntensity.value=B.environmentIntensity),He&&(ve.setValue(z,"toneMappingExposure",P.toneMappingExposure),wt.needsLights&&In(Ue,ai),ot&&X.fog===!0&&ht.refreshFogUniforms(Ue,ot),ht.refreshMaterialUniforms(Ue,X,$,nt,f.state.transmissionRenderTarget[C.id]),Co.upload(z,Ar(wt),Ue,D)),X.isShaderMaterial&&X.uniformsNeedUpdate===!0&&(Co.upload(z,Ar(wt),Ue,D),X.uniformsNeedUpdate=!1),X.isSpriteMaterial&&ve.setValue(z,"center",k.center),ve.setValue(z,"modelViewMatrix",k.modelViewMatrix),ve.setValue(z,"normalMatrix",k.normalMatrix),ve.setValue(z,"modelMatrix",k.matrixWorld),X.isShaderMaterial||X.isRawShaderMaterial){const ke=X.uniformsGroups;for(let sn=0,vn=ke.length;sn<vn;sn++){const pe=ke[sn];F.update(pe,nn),F.bind(pe,nn)}}return nn}function In(C,B){C.ambientLightColor.needsUpdate=B,C.lightProbe.needsUpdate=B,C.directionalLights.needsUpdate=B,C.directionalLightShadows.needsUpdate=B,C.pointLights.needsUpdate=B,C.pointLightShadows.needsUpdate=B,C.spotLights.needsUpdate=B,C.spotLightShadows.needsUpdate=B,C.rectAreaLights.needsUpdate=B,C.hemisphereLights.needsUpdate=B}function Cr(C){return C.isMeshLambertMaterial||C.isMeshToonMaterial||C.isMeshPhongMaterial||C.isMeshStandardMaterial||C.isShadowMaterial||C.isShaderMaterial&&C.lights===!0}this.getActiveCubeFace=function(){return O},this.getActiveMipmapLevel=function(){return E},this.getRenderTarget=function(){return M},this.setRenderTargetTextures=function(C,B,W){Rt.get(C.texture).__webglTexture=B,Rt.get(C.depthTexture).__webglTexture=W;const X=Rt.get(C);X.__hasExternalTextures=!0,X.__autoAllocateDepthBuffer=W===void 0,X.__autoAllocateDepthBuffer||jt.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),X.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(C,B){const W=Rt.get(C);W.__webglFramebuffer=B,W.__useDefaultFramebuffer=B===void 0},this.setRenderTarget=function(C,B=0,W=0){M=C,O=B,E=W;let X=!0,k=null,ot=!1,ft=!1;if(C){const St=Rt.get(C);if(St.__useDefaultFramebuffer!==void 0)It.bindFramebuffer(z.FRAMEBUFFER,null),X=!1;else if(St.__webglFramebuffer===void 0)D.setupRenderTarget(C);else if(St.__hasExternalTextures)D.rebindTextures(C,Rt.get(C.texture).__webglTexture,Rt.get(C.depthTexture).__webglTexture);else if(C.depthBuffer){const Et=C.depthTexture;if(St.__boundDepthTexture!==Et){if(Et!==null&&Rt.has(Et)&&(C.width!==Et.image.width||C.height!==Et.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");D.setupDepthRenderbuffer(C)}}const Lt=C.texture;(Lt.isData3DTexture||Lt.isDataArrayTexture||Lt.isCompressedArrayTexture)&&(ft=!0);const Nt=Rt.get(C).__webglFramebuffer;C.isWebGLCubeRenderTarget?(Array.isArray(Nt[B])?k=Nt[B][W]:k=Nt[B],ot=!0):C.samples>0&&D.useMultisampledRTT(C)===!1?k=Rt.get(C).__webglMultisampledFramebuffer:Array.isArray(Nt)?k=Nt[W]:k=Nt,T.copy(C.viewport),I.copy(C.scissor),b=C.scissorTest}else T.copy(Ct).multiplyScalar($).floor(),I.copy(Ft).multiplyScalar($).floor(),b=kt;if(It.bindFramebuffer(z.FRAMEBUFFER,k)&&X&&It.drawBuffers(C,k),It.viewport(T),It.scissor(I),It.setScissorTest(b),ot){const St=Rt.get(C.texture);z.framebufferTexture2D(z.FRAMEBUFFER,z.COLOR_ATTACHMENT0,z.TEXTURE_CUBE_MAP_POSITIVE_X+B,St.__webglTexture,W)}else if(ft){const St=Rt.get(C.texture),Lt=B||0;z.framebufferTextureLayer(z.FRAMEBUFFER,z.COLOR_ATTACHMENT0,St.__webglTexture,W||0,Lt)}g=-1},this.readRenderTargetPixels=function(C,B,W,X,k,ot,ft){if(!(C&&C.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Tt=Rt.get(C).__webglFramebuffer;if(C.isWebGLCubeRenderTarget&&ft!==void 0&&(Tt=Tt[ft]),Tt){It.bindFramebuffer(z.FRAMEBUFFER,Tt);try{const St=C.texture,Lt=St.format,Nt=St.type;if(!$t.textureFormatReadable(Lt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!$t.textureTypeReadable(Nt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}B>=0&&B<=C.width-X&&W>=0&&W<=C.height-k&&z.readPixels(B,W,X,k,Gt.convert(Lt),Gt.convert(Nt),ot)}finally{const St=M!==null?Rt.get(M).__webglFramebuffer:null;It.bindFramebuffer(z.FRAMEBUFFER,St)}}},this.readRenderTargetPixelsAsync=async function(C,B,W,X,k,ot,ft){if(!(C&&C.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Tt=Rt.get(C).__webglFramebuffer;if(C.isWebGLCubeRenderTarget&&ft!==void 0&&(Tt=Tt[ft]),Tt){const St=C.texture,Lt=St.format,Nt=St.type;if(!$t.textureFormatReadable(Lt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!$t.textureTypeReadable(Nt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(B>=0&&B<=C.width-X&&W>=0&&W<=C.height-k){It.bindFramebuffer(z.FRAMEBUFFER,Tt);const Et=z.createBuffer();z.bindBuffer(z.PIXEL_PACK_BUFFER,Et),z.bufferData(z.PIXEL_PACK_BUFFER,ot.byteLength,z.STREAM_READ),z.readPixels(B,W,X,k,Gt.convert(Lt),Gt.convert(Nt),0);const Zt=M!==null?Rt.get(M).__webglFramebuffer:null;It.bindFramebuffer(z.FRAMEBUFFER,Zt);const le=z.fenceSync(z.SYNC_GPU_COMMANDS_COMPLETE,0);return z.flush(),await n_(z,le,4),z.bindBuffer(z.PIXEL_PACK_BUFFER,Et),z.getBufferSubData(z.PIXEL_PACK_BUFFER,0,ot),z.deleteBuffer(Et),z.deleteSync(le),ot}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(C,B=null,W=0){C.isTexture!==!0&&(ar("WebGLRenderer: copyFramebufferToTexture function signature has changed."),B=arguments[0]||null,C=arguments[1]);const X=Math.pow(2,-W),k=Math.floor(C.image.width*X),ot=Math.floor(C.image.height*X),ft=B!==null?B.x:0,Tt=B!==null?B.y:0;D.setTexture2D(C,0),z.copyTexSubImage2D(z.TEXTURE_2D,W,0,0,ft,Tt,k,ot),It.unbindTexture()},this.copyTextureToTexture=function(C,B,W=null,X=null,k=0){C.isTexture!==!0&&(ar("WebGLRenderer: copyTextureToTexture function signature has changed."),X=arguments[0]||null,C=arguments[1],B=arguments[2],k=arguments[3]||0,W=null);let ot,ft,Tt,St,Lt,Nt,Et,Zt,le;const de=C.isCompressedTexture?C.mipmaps[k]:C.image;W!==null?(ot=W.max.x-W.min.x,ft=W.max.y-W.min.y,Tt=W.isBox3?W.max.z-W.min.z:1,St=W.min.x,Lt=W.min.y,Nt=W.isBox3?W.min.z:0):(ot=de.width,ft=de.height,Tt=de.depth||1,St=0,Lt=0,Nt=0),X!==null?(Et=X.x,Zt=X.y,le=X.z):(Et=0,Zt=0,le=0);const Be=Gt.convert(B.format),Qt=Gt.convert(B.type);let wt;B.isData3DTexture?(D.setTexture3D(B,0),wt=z.TEXTURE_3D):B.isDataArrayTexture||B.isCompressedArrayTexture?(D.setTexture2DArray(B,0),wt=z.TEXTURE_2D_ARRAY):(D.setTexture2D(B,0),wt=z.TEXTURE_2D),z.pixelStorei(z.UNPACK_FLIP_Y_WEBGL,B.flipY),z.pixelStorei(z.UNPACK_PREMULTIPLY_ALPHA_WEBGL,B.premultiplyAlpha),z.pixelStorei(z.UNPACK_ALIGNMENT,B.unpackAlignment);const hn=z.getParameter(z.UNPACK_ROW_LENGTH),ne=z.getParameter(z.UNPACK_IMAGE_HEIGHT),nn=z.getParameter(z.UNPACK_SKIP_PIXELS),oi=z.getParameter(z.UNPACK_SKIP_ROWS),He=z.getParameter(z.UNPACK_SKIP_IMAGES);z.pixelStorei(z.UNPACK_ROW_LENGTH,de.width),z.pixelStorei(z.UNPACK_IMAGE_HEIGHT,de.height),z.pixelStorei(z.UNPACK_SKIP_PIXELS,St),z.pixelStorei(z.UNPACK_SKIP_ROWS,Lt),z.pixelStorei(z.UNPACK_SKIP_IMAGES,Nt);const ai=C.isDataArrayTexture||C.isData3DTexture,ve=B.isDataArrayTexture||B.isData3DTexture;if(C.isRenderTargetTexture||C.isDepthTexture){const Ue=Rt.get(C),je=Rt.get(B),ke=Rt.get(Ue.__renderTarget),sn=Rt.get(je.__renderTarget);It.bindFramebuffer(z.READ_FRAMEBUFFER,ke.__webglFramebuffer),It.bindFramebuffer(z.DRAW_FRAMEBUFFER,sn.__webglFramebuffer);for(let vn=0;vn<Tt;vn++)ai&&z.framebufferTextureLayer(z.READ_FRAMEBUFFER,z.COLOR_ATTACHMENT0,Rt.get(C).__webglTexture,k,Nt+vn),C.isDepthTexture?(ve&&z.framebufferTextureLayer(z.DRAW_FRAMEBUFFER,z.COLOR_ATTACHMENT0,Rt.get(B).__webglTexture,k,le+vn),z.blitFramebuffer(St,Lt,ot,ft,Et,Zt,ot,ft,z.DEPTH_BUFFER_BIT,z.NEAREST)):ve?z.copyTexSubImage3D(wt,k,Et,Zt,le+vn,St,Lt,ot,ft):z.copyTexSubImage2D(wt,k,Et,Zt,le+vn,St,Lt,ot,ft);It.bindFramebuffer(z.READ_FRAMEBUFFER,null),It.bindFramebuffer(z.DRAW_FRAMEBUFFER,null)}else ve?C.isDataTexture||C.isData3DTexture?z.texSubImage3D(wt,k,Et,Zt,le,ot,ft,Tt,Be,Qt,de.data):B.isCompressedArrayTexture?z.compressedTexSubImage3D(wt,k,Et,Zt,le,ot,ft,Tt,Be,de.data):z.texSubImage3D(wt,k,Et,Zt,le,ot,ft,Tt,Be,Qt,de):C.isDataTexture?z.texSubImage2D(z.TEXTURE_2D,k,Et,Zt,ot,ft,Be,Qt,de.data):C.isCompressedTexture?z.compressedTexSubImage2D(z.TEXTURE_2D,k,Et,Zt,de.width,de.height,Be,de.data):z.texSubImage2D(z.TEXTURE_2D,k,Et,Zt,ot,ft,Be,Qt,de);z.pixelStorei(z.UNPACK_ROW_LENGTH,hn),z.pixelStorei(z.UNPACK_IMAGE_HEIGHT,ne),z.pixelStorei(z.UNPACK_SKIP_PIXELS,nn),z.pixelStorei(z.UNPACK_SKIP_ROWS,oi),z.pixelStorei(z.UNPACK_SKIP_IMAGES,He),k===0&&B.generateMipmaps&&z.generateMipmap(wt),It.unbindTexture()},this.copyTextureToTexture3D=function(C,B,W=null,X=null,k=0){return C.isTexture!==!0&&(ar("WebGLRenderer: copyTextureToTexture3D function signature has changed."),W=arguments[0]||null,X=arguments[1]||null,C=arguments[2],B=arguments[3],k=arguments[4]||0),ar('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(C,B,W,X,k)},this.initRenderTarget=function(C){Rt.get(C).__webglFramebuffer===void 0&&D.setupRenderTarget(C)},this.initTexture=function(C){C.isCubeTexture?D.setTextureCube(C,0):C.isData3DTexture?D.setTexture3D(C,0):C.isDataArrayTexture||C.isCompressedArrayTexture?D.setTexture2DArray(C,0):D.setTexture2D(C,0),It.unbindTexture()},this.resetState=function(){O=0,E=0,M=null,It.reset(),ae.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Jn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorspace=ee._getDrawingBufferColorSpace(t),e.unpackColorSpace=ee._getUnpackColorSpace()}}class dc{constructor(t,e=25e-5){this.isFogExp2=!0,this.name="",this.color=new Pt(t),this.density=e}clone(){return new dc(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}}class dM extends Pe{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Rn,this.environmentIntensity=1,this.environmentRotation=new Rn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}class pM{constructor(t,e){this.isInterleavedBuffer=!0,this.array=t,this.stride=e,this.count=t!==void 0?t.length/e:0,this.usage=Vl,this.updateRanges=[],this.version=0,this.uuid=Si()}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.array=new t.array.constructor(t.array),this.count=t.count,this.stride=t.stride,this.usage=t.usage,this}copyAt(t,e,n){t*=this.stride,n*=e.stride;for(let s=0,r=this.stride;s<r;s++)this.array[t+s]=e.array[n+s];return this}set(t,e=0){return this.array.set(t,e),this}clone(t){t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Si()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const e=new this.array.constructor(t.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(e,this.stride);return n.setUsage(this.usage),n}onUpload(t){return this.onUploadCallback=t,this}toJSON(t){return t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Si()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const $e=new N;class Bo{constructor(t,e,n,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=t,this.itemSize=e,this.offset=n,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(t){this.data.needsUpdate=t}applyMatrix4(t){for(let e=0,n=this.data.count;e<n;e++)$e.fromBufferAttribute(this,e),$e.applyMatrix4(t),this.setXYZ(e,$e.x,$e.y,$e.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)$e.fromBufferAttribute(this,e),$e.applyNormalMatrix(t),this.setXYZ(e,$e.x,$e.y,$e.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)$e.fromBufferAttribute(this,e),$e.transformDirection(t),this.setXYZ(e,$e.x,$e.y,$e.z);return this}getComponent(t,e){let n=this.array[t*this.data.stride+this.offset+e];return this.normalized&&(n=Nn(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=me(n,this.array)),this.data.array[t*this.data.stride+this.offset+e]=n,this}setX(t,e){return this.normalized&&(e=me(e,this.array)),this.data.array[t*this.data.stride+this.offset]=e,this}setY(t,e){return this.normalized&&(e=me(e,this.array)),this.data.array[t*this.data.stride+this.offset+1]=e,this}setZ(t,e){return this.normalized&&(e=me(e,this.array)),this.data.array[t*this.data.stride+this.offset+2]=e,this}setW(t,e){return this.normalized&&(e=me(e,this.array)),this.data.array[t*this.data.stride+this.offset+3]=e,this}getX(t){let e=this.data.array[t*this.data.stride+this.offset];return this.normalized&&(e=Nn(e,this.array)),e}getY(t){let e=this.data.array[t*this.data.stride+this.offset+1];return this.normalized&&(e=Nn(e,this.array)),e}getZ(t){let e=this.data.array[t*this.data.stride+this.offset+2];return this.normalized&&(e=Nn(e,this.array)),e}getW(t){let e=this.data.array[t*this.data.stride+this.offset+3];return this.normalized&&(e=Nn(e,this.array)),e}setXY(t,e,n){return t=t*this.data.stride+this.offset,this.normalized&&(e=me(e,this.array),n=me(n,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this}setXYZ(t,e,n,s){return t=t*this.data.stride+this.offset,this.normalized&&(e=me(e,this.array),n=me(n,this.array),s=me(s,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t=t*this.data.stride+this.offset,this.normalized&&(e=me(e,this.array),n=me(n,this.array),s=me(s,this.array),r=me(r,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=s,this.data.array[t+3]=r,this}clone(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let n=0;n<this.count;n++){const s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[s+r])}return new Fe(new this.array.constructor(e),this.itemSize,this.normalized)}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new Bo(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let n=0;n<this.count;n++){const s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[s+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:e,normalized:this.normalized}}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.toJSON(t)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class Ko extends wi{static get type(){return"SpriteMaterial"}constructor(t){super(),this.isSpriteMaterial=!0,this.color=new Pt(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.rotation=t.rotation,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}let ps;const er=new N,ms=new N,gs=new N,_s=new At,nr=new At,ud=new xe,lo=new N,ir=new N,co=new N,Au=new At,Wa=new At,Cu=new At;class pc extends Pe{constructor(t=new Ko){if(super(),this.isSprite=!0,this.type="Sprite",ps===void 0){ps=new be;const e=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new pM(e,5);ps.setIndex([0,1,2,0,2,3]),ps.setAttribute("position",new Bo(n,3,0,!1)),ps.setAttribute("uv",new Bo(n,2,3,!1))}this.geometry=ps,this.material=t,this.center=new At(.5,.5)}raycast(t,e){t.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),ms.setFromMatrixScale(this.matrixWorld),ud.copy(t.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(t.camera.matrixWorldInverse,this.matrixWorld),gs.setFromMatrixPosition(this.modelViewMatrix),t.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&ms.multiplyScalar(-gs.z);const n=this.material.rotation;let s,r;n!==0&&(r=Math.cos(n),s=Math.sin(n));const a=this.center;ho(lo.set(-.5,-.5,0),gs,a,ms,s,r),ho(ir.set(.5,-.5,0),gs,a,ms,s,r),ho(co.set(.5,.5,0),gs,a,ms,s,r),Au.set(0,0),Wa.set(1,0),Cu.set(1,1);let l=t.ray.intersectTriangle(lo,ir,co,!1,er);if(l===null&&(ho(ir.set(-.5,.5,0),gs,a,ms,s,r),Wa.set(0,1),l=t.ray.intersectTriangle(lo,co,ir,!1,er),l===null))return;const c=t.ray.origin.distanceTo(er);c<t.near||c>t.far||e.push({distance:c,point:er.clone(),uv:pn.getInterpolation(er,lo,ir,co,Au,Wa,Cu,new At),face:null,object:this})}copy(t,e){return super.copy(t,e),t.center!==void 0&&this.center.copy(t.center),this.material=t.material,this}}function ho(i,t,e,n,s,r){_s.subVectors(i,e).addScalar(.5).multiply(n),s!==void 0?(nr.x=r*_s.x-s*_s.y,nr.y=s*_s.x+r*_s.y):nr.copy(_s),i.copy(t),i.x+=nr.x,i.y+=nr.y,i.applyMatrix4(ud)}class mc extends wi{static get type(){return"LineBasicMaterial"}constructor(t){super(),this.isLineBasicMaterial=!0,this.color=new Pt(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}}const ko=new N,zo=new N,Ru=new xe,sr=new jo,uo=new Sr,Xa=new N,Pu=new N;class fd extends Pe{constructor(t=new be,e=new mc){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,n=[0];for(let s=1,r=e.count;s<r;s++)ko.fromBufferAttribute(e,s-1),zo.fromBufferAttribute(e,s),n[s]=n[s-1],n[s]+=ko.distanceTo(zo);t.setAttribute("lineDistance",new Te(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,e){const n=this.geometry,s=this.matrixWorld,r=t.params.Line.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),uo.copy(n.boundingSphere),uo.applyMatrix4(s),uo.radius+=r,t.ray.intersectsSphere(uo)===!1)return;Ru.copy(s).invert(),sr.copy(t.ray).applyMatrix4(Ru);const l=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=l*l,h=this.isLineSegments?2:1,d=n.index,m=n.attributes.position;if(d!==null){const x=Math.max(0,a.start),S=Math.min(d.count,a.start+a.count);for(let w=x,v=S-1;w<v;w+=h){const f=d.getX(w),U=d.getX(w+1),L=fo(this,t,sr,c,f,U);L&&e.push(L)}if(this.isLineLoop){const w=d.getX(S-1),v=d.getX(x),f=fo(this,t,sr,c,w,v);f&&e.push(f)}}else{const x=Math.max(0,a.start),S=Math.min(m.count,a.start+a.count);for(let w=x,v=S-1;w<v;w+=h){const f=fo(this,t,sr,c,w,w+1);f&&e.push(f)}if(this.isLineLoop){const w=fo(this,t,sr,c,S-1,x);w&&e.push(w)}}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const l=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[l]=r}}}}}function fo(i,t,e,n,s,r){const a=i.geometry.attributes.position;if(ko.fromBufferAttribute(a,s),zo.fromBufferAttribute(a,r),e.distanceSqToSegment(ko,zo,Xa,Pu)>n)return;Xa.applyMatrix4(i.matrixWorld);const c=t.ray.origin.distanceTo(Xa);if(!(c<t.near||c>t.far))return{distance:c,point:Pu.clone().applyMatrix4(i.matrixWorld),index:s,face:null,faceIndex:null,barycoord:null,object:i}}class Jo extends wi{static get type(){return"PointsMaterial"}constructor(t){super(),this.isPointsMaterial=!0,this.color=new Pt(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.size=t.size,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}const Iu=new xe,Wl=new jo,po=new Sr,mo=new N;class gc extends Pe{constructor(t=new be,e=new Jo){super(),this.isPoints=!0,this.type="Points",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}raycast(t,e){const n=this.geometry,s=this.matrixWorld,r=t.params.Points.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),po.copy(n.boundingSphere),po.applyMatrix4(s),po.radius+=r,t.ray.intersectsSphere(po)===!1)return;Iu.copy(s).invert(),Wl.copy(t.ray).applyMatrix4(Iu);const l=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=l*l,h=n.index,p=n.attributes.position;if(h!==null){const m=Math.max(0,a.start),x=Math.min(h.count,a.start+a.count);for(let S=m,w=x;S<w;S++){const v=h.getX(S);mo.fromBufferAttribute(p,v),Du(mo,v,c,s,t,e,this)}}else{const m=Math.max(0,a.start),x=Math.min(p.count,a.start+a.count);for(let S=m,w=x;S<w;S++)mo.fromBufferAttribute(p,S),Du(mo,S,c,s,t,e,this)}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const l=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[l]=r}}}}}function Du(i,t,e,n,s,r,a){const l=Wl.distanceSqToPoint(i);if(l<e){const c=new N;Wl.closestPointToPoint(i,c),c.applyMatrix4(n);const h=s.ray.origin.distanceTo(c);if(h<s.near||h>s.far)return;r.push({distance:h,distanceToRay:Math.sqrt(l),point:c,index:t,face:null,faceIndex:null,barycoord:null,object:a})}}class _c extends Qe{constructor(t,e,n,s,r,a,l,c,h){super(t,e,n,s,r,a,l,c,h),this.isCanvasTexture=!0,this.needsUpdate=!0}}class Er extends be{constructor(t=1,e=32,n=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:n,thetaLength:s},e=Math.max(3,e);const r=[],a=[],l=[],c=[],h=new N,d=new At;a.push(0,0,0),l.push(0,0,1),c.push(.5,.5);for(let p=0,m=3;p<=e;p++,m+=3){const x=n+p/e*s;h.x=t*Math.cos(x),h.y=t*Math.sin(x),a.push(h.x,h.y,h.z),l.push(0,0,1),d.x=(a[m]/t+1)/2,d.y=(a[m+1]/t+1)/2,c.push(d.x,d.y)}for(let p=1;p<=e;p++)r.push(p,p+1,0);this.setIndex(r),this.setAttribute("position",new Te(a,3)),this.setAttribute("normal",new Te(l,3)),this.setAttribute("uv",new Te(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Er(t.radius,t.segments,t.thetaStart,t.thetaLength)}}class kn extends be{constructor(t=1,e=1,n=1,s=32,r=1,a=!1,l=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:s,heightSegments:r,openEnded:a,thetaStart:l,thetaLength:c};const h=this;s=Math.floor(s),r=Math.floor(r);const d=[],p=[],m=[],x=[];let S=0;const w=[],v=n/2;let f=0;U(),a===!1&&(t>0&&L(!0),e>0&&L(!1)),this.setIndex(d),this.setAttribute("position",new Te(p,3)),this.setAttribute("normal",new Te(m,3)),this.setAttribute("uv",new Te(x,2));function U(){const P=new N,H=new N;let O=0;const E=(e-t)/n;for(let M=0;M<=r;M++){const g=[],_=M/r,T=_*(e-t)+t;for(let I=0;I<=s;I++){const b=I/s,K=b*c+l,Q=Math.sin(K),J=Math.cos(K);H.x=T*Q,H.y=-_*n+v,H.z=T*J,p.push(H.x,H.y,H.z),P.set(Q,E,J).normalize(),m.push(P.x,P.y,P.z),x.push(b,1-_),g.push(S++)}w.push(g)}for(let M=0;M<s;M++)for(let g=0;g<r;g++){const _=w[g][M],T=w[g+1][M],I=w[g+1][M+1],b=w[g][M+1];(t>0||g!==0)&&(d.push(_,T,b),O+=3),(e>0||g!==r-1)&&(d.push(T,I,b),O+=3)}h.addGroup(f,O,0),f+=O}function L(P){const H=S,O=new At,E=new N;let M=0;const g=P===!0?t:e,_=P===!0?1:-1;for(let I=1;I<=s;I++)p.push(0,v*_,0),m.push(0,_,0),x.push(.5,.5),S++;const T=S;for(let I=0;I<=s;I++){const K=I/s*c+l,Q=Math.cos(K),J=Math.sin(K);E.x=g*J,E.y=v*_,E.z=g*Q,p.push(E.x,E.y,E.z),m.push(0,_,0),O.x=Q*.5+.5,O.y=J*.5*_+.5,x.push(O.x,O.y),S++}for(let I=0;I<s;I++){const b=H+I,K=T+I;P===!0?d.push(K,K+1,b):d.push(K+1,K,b),M+=3}h.addGroup(f,M,P===!0?1:2),f+=M}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new kn(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class vc extends kn{constructor(t=1,e=1,n=32,s=1,r=!1,a=0,l=Math.PI*2){super(0,t,e,n,s,r,a,l),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:n,heightSegments:s,openEnded:r,thetaStart:a,thetaLength:l}}static fromJSON(t){return new vc(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class Zo extends be{constructor(t=.5,e=1,n=32,s=1,r=0,a=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:t,outerRadius:e,thetaSegments:n,phiSegments:s,thetaStart:r,thetaLength:a},n=Math.max(3,n),s=Math.max(1,s);const l=[],c=[],h=[],d=[];let p=t;const m=(e-t)/s,x=new N,S=new At;for(let w=0;w<=s;w++){for(let v=0;v<=n;v++){const f=r+v/n*a;x.x=p*Math.cos(f),x.y=p*Math.sin(f),c.push(x.x,x.y,x.z),h.push(0,0,1),S.x=(x.x/e+1)/2,S.y=(x.y/e+1)/2,d.push(S.x,S.y)}p+=m}for(let w=0;w<s;w++){const v=w*(n+1);for(let f=0;f<n;f++){const U=f+v,L=U,P=U+n+1,H=U+n+2,O=U+1;l.push(L,P,O),l.push(P,H,O)}}this.setIndex(l),this.setAttribute("position",new Te(c,3)),this.setAttribute("normal",new Te(h,3)),this.setAttribute("uv",new Te(d,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Zo(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}}class Pn extends be{constructor(t=1,e=32,n=16,s=0,r=Math.PI*2,a=0,l=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:s,phiLength:r,thetaStart:a,thetaLength:l},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));const c=Math.min(a+l,Math.PI);let h=0;const d=[],p=new N,m=new N,x=[],S=[],w=[],v=[];for(let f=0;f<=n;f++){const U=[],L=f/n;let P=0;f===0&&a===0?P=.5/e:f===n&&c===Math.PI&&(P=-.5/e);for(let H=0;H<=e;H++){const O=H/e;p.x=-t*Math.cos(s+O*r)*Math.sin(a+L*l),p.y=t*Math.cos(a+L*l),p.z=t*Math.sin(s+O*r)*Math.sin(a+L*l),S.push(p.x,p.y,p.z),m.copy(p).normalize(),w.push(m.x,m.y,m.z),v.push(O+P,1-L),U.push(h++)}d.push(U)}for(let f=0;f<n;f++)for(let U=0;U<e;U++){const L=d[f][U+1],P=d[f][U],H=d[f+1][U],O=d[f+1][U+1];(f!==0||a>0)&&x.push(L,P,O),(f!==n-1||c<Math.PI)&&x.push(P,H,O)}this.setIndex(x),this.setAttribute("position",new Te(S,3)),this.setAttribute("normal",new Te(w,3)),this.setAttribute("uv",new Te(v,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Pn(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}}class Ns extends be{constructor(t=1,e=.4,n=12,s=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:n,tubularSegments:s,arc:r},n=Math.floor(n),s=Math.floor(s);const a=[],l=[],c=[],h=[],d=new N,p=new N,m=new N;for(let x=0;x<=n;x++)for(let S=0;S<=s;S++){const w=S/s*r,v=x/n*Math.PI*2;p.x=(t+e*Math.cos(v))*Math.cos(w),p.y=(t+e*Math.cos(v))*Math.sin(w),p.z=e*Math.sin(v),l.push(p.x,p.y,p.z),d.x=t*Math.cos(w),d.y=t*Math.sin(w),m.subVectors(p,d).normalize(),c.push(m.x,m.y,m.z),h.push(S/s),h.push(x/n)}for(let x=1;x<=n;x++)for(let S=1;S<=s;S++){const w=(s+1)*x+S-1,v=(s+1)*(x-1)+S-1,f=(s+1)*(x-1)+S,U=(s+1)*x+S;a.push(w,v,U),a.push(v,f,U)}this.setIndex(a),this.setAttribute("position",new Te(l,3)),this.setAttribute("normal",new Te(c,3)),this.setAttribute("uv",new Te(h,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ns(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}}class mM extends Re{static get type(){return"RawShaderMaterial"}constructor(t){super(t),this.isRawShaderMaterial=!0}}class ge extends wi{static get type(){return"MeshStandardMaterial"}constructor(t){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.color=new Pt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Pt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Yf,this.normalScale=new At(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Rn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class Qo extends Pe{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new Pt(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}}class gM extends Qo{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Pe.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Pt(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}}const qa=new xe,Lu=new N,Uu=new N;class dd{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new At(512,512),this.map=null,this.mapPass=null,this.matrix=new xe,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new hc,this._frameExtents=new At(1,1),this._viewportCount=1,this._viewports=[new _e(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,n=this.matrix;Lu.setFromMatrixPosition(t.matrixWorld),e.position.copy(Lu),Uu.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(Uu),e.updateMatrixWorld(),qa.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(qa),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(qa)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}const Nu=new xe,rr=new N,ja=new N;class _M extends dd{constructor(){super(new cn(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new At(4,2),this._viewportCount=6,this._viewports=[new _e(2,1,1,1),new _e(0,1,1,1),new _e(3,1,1,1),new _e(1,1,1,1),new _e(3,0,1,1),new _e(1,0,1,1)],this._cubeDirections=[new N(1,0,0),new N(-1,0,0),new N(0,0,1),new N(0,0,-1),new N(0,1,0),new N(0,-1,0)],this._cubeUps=[new N(0,1,0),new N(0,1,0),new N(0,1,0),new N(0,1,0),new N(0,0,1),new N(0,0,-1)]}updateMatrices(t,e=0){const n=this.camera,s=this.matrix,r=t.distance||n.far;r!==n.far&&(n.far=r,n.updateProjectionMatrix()),rr.setFromMatrixPosition(t.matrixWorld),n.position.copy(rr),ja.copy(n.position),ja.add(this._cubeDirections[e]),n.up.copy(this._cubeUps[e]),n.lookAt(ja),n.updateMatrixWorld(),s.makeTranslation(-rr.x,-rr.y,-rr.z),Nu.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Nu)}}class Ou extends Qo{constructor(t,e,n=0,s=2){super(t,e),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=s,this.shadow=new _M}get power(){return this.intensity*4*Math.PI}set power(t){this.intensity=t/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.decay=t.decay,this.shadow=t.shadow.clone(),this}}class vM extends dd{constructor(){super(new uc(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class yM extends Qo{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Pe.DEFAULT_UP),this.updateMatrix(),this.target=new Pe,this.shadow=new vM}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}class xM extends Qo{constructor(t,e){super(t,e),this.isAmbientLight=!0,this.type="AmbientLight"}}class MM{constructor(t=!0){this.autoStart=t,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=Fu(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let t=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const e=Fu();t=(e-this.oldTime)/1e3,this.oldTime=e,this.elapsedTime+=t}return t}}function Fu(){return performance.now()}const Bu=new xe;class SM{constructor(t,e,n=0,s=1/0){this.ray=new jo(t,e),this.near=n,this.far=s,this.camera=null,this.layers=new lc,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):console.error("THREE.Raycaster: Unsupported camera type: "+e.type)}setFromXRController(t){return Bu.identity().extractRotation(t.matrixWorld),this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Bu),this}intersectObject(t,e=!0,n=[]){return Xl(t,this,n,e),n.sort(ku),n}intersectObjects(t,e=!0,n=[]){for(let s=0,r=t.length;s<r;s++)Xl(t[s],this,n,e);return n.sort(ku),n}}function ku(i,t){return i.distance-t.distance}function Xl(i,t,e,n){let s=!0;if(i.layers.test(t.layers)&&i.raycast(t,e)===!1&&(s=!1),s===!0&&n===!0){const r=i.children;for(let a=0,l=r.length;a<l;a++)Xl(r[a],t,e,!0)}}class zu{constructor(t=1,e=0,n=0){return this.radius=t,this.phi=e,this.theta=n,this}set(t,e,n){return this.radius=t,this.phi=e,this.theta=n,this}copy(t){return this.radius=t.radius,this.phi=t.phi,this.theta=t.theta,this}makeSafe(){return this.phi=Math.max(1e-6,Math.min(Math.PI-1e-6,this.phi)),this}setFromVector3(t){return this.setFromCartesianCoords(t.x,t.y,t.z)}setFromCartesianCoords(t,e,n){return this.radius=Math.sqrt(t*t+e*e+n*n),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(t,n),this.phi=Math.acos(Ke(e/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:tc}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=tc);class EM{constructor(){this.scene=new dM,this.scene.fog=new dc(658964,8e-4),this.setupLighting()}setupLighting(){this.sunLight=new yM(16774624,.5),this.sunLight.position.set(50,30,-20),this.sunLight.castShadow=!0,this.sunLight.shadow.mapSize.width=1024,this.sunLight.shadow.mapSize.height=1024,this.sunLight.shadow.camera.near=.5,this.sunLight.shadow.camera.far=200,this.sunLight.shadow.camera.left=-30,this.sunLight.shadow.camera.right=30,this.sunLight.shadow.camera.top=30,this.sunLight.shadow.camera.bottom=-30,this.sunLight.shadow.bias=-.001,this.scene.add(this.sunLight),this.ambientLight=new xM(1710638,.25),this.scene.add(this.ambientLight),this.hemiLight=new gM(2245802,2232576,.18),this.scene.add(this.hemiLight)}add(t){this.scene.add(t)}remove(t){this.scene.remove(t)}}const go=.08,TM=.08,wM=3,bM=600,AM=.1,CM=Math.PI-.1,RM=30,Vu=.002;class PM{constructor(t,e){this.camera=t,this.domElement=e,this.target=new N(0,0,0),this.spherical=new zu(100,Math.PI/3,0),this.targetSpherical=new zu(100,Math.PI/3,0),this.targetTarget=new N(0,0,0),this.isDragging=!1,this.isPanning=!1,this.dragStart=new At,this.dragDelta=new At,this.dragDistance=0,this.freeMode=!1,this.keys={},this.euler=new Rn(0,0,0,"YXZ"),this._bindEvents(),this._updateCameraPosition()}_bindEvents(){const t=this.domElement;t.addEventListener("pointerdown",e=>this._onPointerDown(e)),t.addEventListener("pointermove",e=>this._onPointerMove(e)),t.addEventListener("pointerup",e=>this._onPointerUp(e)),t.addEventListener("pointercancel",e=>this._onPointerUp(e)),t.addEventListener("wheel",e=>this._onWheel(e),{passive:!1}),t.addEventListener("contextmenu",e=>e.preventDefault()),window.addEventListener("keydown",e=>{this.keys[e.code]=!0,(e.code==="ShiftLeft"||e.code==="ShiftRight")&&(this.freeMode=!0)}),window.addEventListener("keyup",e=>{this.keys[e.code]=!1,(e.code==="ShiftLeft"||e.code==="ShiftRight")&&(this.freeMode=!1)})}_onPointerDown(t){t.button===0?this.isDragging=!0:(t.button===1||t.button===2)&&(this.isPanning=!0),this.dragStart.set(t.clientX,t.clientY),this.dragDistance=0}_onPointerMove(t){const e=t.clientX-this.dragStart.x,n=t.clientY-this.dragStart.y;if(this.dragDistance=Math.sqrt(e*e+n*n),this.isDragging&&this.dragDistance>4&&(this.freeMode?(this.euler.setFromQuaternion(this.camera.quaternion),this.euler.y-=t.movementX*Vu,this.euler.x-=t.movementY*Vu,this.euler.x=Math.max(-Math.PI/2+.01,Math.min(Math.PI/2-.01,this.euler.x)),this.camera.quaternion.setFromEuler(this.euler)):(this.targetSpherical.theta-=t.movementX*.005,this.targetSpherical.phi-=t.movementY*.005,this.targetSpherical.phi=Math.max(AM,Math.min(CM,this.targetSpherical.phi)))),this.isPanning){const s=this.spherical.radius*.001,r=new N,a=new N;r.setFromMatrixColumn(this.camera.matrixWorld,0),a.setFromMatrixColumn(this.camera.matrixWorld,1),this.targetTarget.addScaledVector(r,-t.movementX*s),this.targetTarget.addScaledVector(a,t.movementY*s)}this.dragStart.set(t.clientX,t.clientY)}_onPointerUp(t){this.isDragging=!1,this.isPanning=!1}_onWheel(t){t.preventDefault();const e=1+Math.sign(t.deltaY)*TM;this.targetSpherical.radius=Math.max(wM,Math.min(bM,this.targetSpherical.radius*e))}focusOnPosition(t,e=30){this.targetTarget.copy(t),this.targetSpherical.radius=e}wasClick(){return this.dragDistance<8}getZoomLevel(){const t=this.spherical.radius;return t>200?"galaxy":t>50?"system":t>15?"planet":"close"}update(t){if(this.freeMode){const e=RM*t,n=new N;this.camera.getWorldDirection(n);const s=new N;s.crossVectors(n,this.camera.up).normalize(),this.keys.KeyW&&this.camera.position.addScaledVector(n,e),this.keys.KeyS&&this.camera.position.addScaledVector(n,-e),this.keys.KeyA&&this.camera.position.addScaledVector(s,-e),this.keys.KeyD&&this.camera.position.addScaledVector(s,e),this.keys.Space&&(this.camera.position.y+=e),this.keys.KeyC&&(this.camera.position.y-=e)}else this.spherical.theta+=(this.targetSpherical.theta-this.spherical.theta)*go,this.spherical.phi+=(this.targetSpherical.phi-this.spherical.phi)*go,this.spherical.radius+=(this.targetSpherical.radius-this.spherical.radius)*go,this.target.lerp(this.targetTarget,go),this._updateCameraPosition()}_updateCameraPosition(){const t=new N().setFromSpherical(this.spherical);this.camera.position.copy(this.target).add(t),this.camera.lookAt(this.target);const e=this.spherical.radius;e<20?(this.camera.near=.05,this.camera.far=500):e<80?(this.camera.near=.1,this.camera.far=1e3):(this.camera.near=1,this.camera.far=2e3),this.camera.updateProjectionMatrix()}}const pd={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`};class Vs{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}const IM=new uc(-1,1,1,-1,0,1);class DM extends be{constructor(){super(),this.setAttribute("position",new Te([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new Te([0,2,0,0,2,0],2))}}const LM=new DM;class yc{constructor(t){this._mesh=new Bt(LM,t)}dispose(){this._mesh.geometry.dispose()}render(t){t.render(this._mesh,IM)}get material(){return this._mesh.material}set material(t){this._mesh.material=t}}class UM extends Vs{constructor(t,e){super(),this.textureID=e!==void 0?e:"tDiffuse",t instanceof Re?(this.uniforms=t.uniforms,this.material=t):t&&(this.uniforms=gr.clone(t.uniforms),this.material=new Re({name:t.name!==void 0?t.name:"unspecified",defines:Object.assign({},t.defines),uniforms:this.uniforms,vertexShader:t.vertexShader,fragmentShader:t.fragmentShader})),this.fsQuad=new yc(this.material)}render(t,e,n){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=n.texture),this.fsQuad.material=this.material,this.renderToScreen?(t.setRenderTarget(null),this.fsQuad.render(t)):(t.setRenderTarget(e),this.clear&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),this.fsQuad.render(t))}dispose(){this.material.dispose(),this.fsQuad.dispose()}}class Hu extends Vs{constructor(t,e){super(),this.scene=t,this.camera=e,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(t,e,n){const s=t.getContext(),r=t.state;r.buffers.color.setMask(!1),r.buffers.depth.setMask(!1),r.buffers.color.setLocked(!0),r.buffers.depth.setLocked(!0);let a,l;this.inverse?(a=0,l=1):(a=1,l=0),r.buffers.stencil.setTest(!0),r.buffers.stencil.setOp(s.REPLACE,s.REPLACE,s.REPLACE),r.buffers.stencil.setFunc(s.ALWAYS,a,4294967295),r.buffers.stencil.setClear(l),r.buffers.stencil.setLocked(!0),t.setRenderTarget(n),this.clear&&t.clear(),t.render(this.scene,this.camera),t.setRenderTarget(e),this.clear&&t.clear(),t.render(this.scene,this.camera),r.buffers.color.setLocked(!1),r.buffers.depth.setLocked(!1),r.buffers.color.setMask(!0),r.buffers.depth.setMask(!0),r.buffers.stencil.setLocked(!1),r.buffers.stencil.setFunc(s.EQUAL,1,4294967295),r.buffers.stencil.setOp(s.KEEP,s.KEEP,s.KEEP),r.buffers.stencil.setLocked(!0)}}class NM extends Vs{constructor(){super(),this.needsSwap=!1}render(t){t.state.buffers.stencil.setLocked(!1),t.state.buffers.stencil.setTest(!1)}}class OM{constructor(t,e){if(this.renderer=t,this._pixelRatio=t.getPixelRatio(),e===void 0){const n=t.getSize(new At);this._width=n.width,this._height=n.height,e=new Cn(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:Qn}),e.texture.name="EffectComposer.rt1"}else this._width=e.width,this._height=e.height;this.renderTarget1=e,this.renderTarget2=e.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new UM(pd),this.copyPass.material.blending=Zn,this.clock=new MM}swapBuffers(){const t=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=t}addPass(t){this.passes.push(t),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(t,e){this.passes.splice(e,0,t),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(t){const e=this.passes.indexOf(t);e!==-1&&this.passes.splice(e,1)}isLastEnabledPass(t){for(let e=t+1;e<this.passes.length;e++)if(this.passes[e].enabled)return!1;return!0}render(t){t===void 0&&(t=this.clock.getDelta());const e=this.renderer.getRenderTarget();let n=!1;for(let s=0,r=this.passes.length;s<r;s++){const a=this.passes[s];if(a.enabled!==!1){if(a.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(s),a.render(this.renderer,this.writeBuffer,this.readBuffer,t,n),a.needsSwap){if(n){const l=this.renderer.getContext(),c=this.renderer.state.buffers.stencil;c.setFunc(l.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,t),c.setFunc(l.EQUAL,1,4294967295)}this.swapBuffers()}Hu!==void 0&&(a instanceof Hu?n=!0:a instanceof NM&&(n=!1))}}this.renderer.setRenderTarget(e)}reset(t){if(t===void 0){const e=this.renderer.getSize(new At);this._pixelRatio=this.renderer.getPixelRatio(),this._width=e.width,this._height=e.height,t=this.renderTarget1.clone(),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=t,this.renderTarget2=t.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(t,e){this._width=t,this._height=e;const n=this._width*this._pixelRatio,s=this._height*this._pixelRatio;this.renderTarget1.setSize(n,s),this.renderTarget2.setSize(n,s);for(let r=0;r<this.passes.length;r++)this.passes[r].setSize(n,s)}setPixelRatio(t){this._pixelRatio=t,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}class FM extends Vs{constructor(t,e,n=null,s=null,r=null){super(),this.scene=t,this.camera=e,this.overrideMaterial=n,this.clearColor=s,this.clearAlpha=r,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this._oldClearColor=new Pt}render(t,e,n){const s=t.autoClear;t.autoClear=!1;let r,a;this.overrideMaterial!==null&&(a=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(t.getClearColor(this._oldClearColor),t.setClearColor(this.clearColor,t.getClearAlpha())),this.clearAlpha!==null&&(r=t.getClearAlpha(),t.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&t.clearDepth(),t.setRenderTarget(this.renderToScreen?null:n),this.clear===!0&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),t.render(this.scene,this.camera),this.clearColor!==null&&t.setClearColor(this._oldClearColor),this.clearAlpha!==null&&t.setClearAlpha(r),this.overrideMaterial!==null&&(this.scene.overrideMaterial=a),t.autoClear=s}}const BM={uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new Pt(0)},defaultOpacity:{value:0}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;
		uniform vec3 defaultColor;
		uniform float defaultOpacity;
		uniform float luminosityThreshold;
		uniform float smoothWidth;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );

			float v = luminance( texel.xyz );

			vec4 outputColor = vec4( defaultColor.rgb, defaultOpacity );

			float alpha = smoothstep( luminosityThreshold, luminosityThreshold + smoothWidth, v );

			gl_FragColor = mix( outputColor, texel, alpha );

		}`};class Os extends Vs{constructor(t,e,n,s){super(),this.strength=e!==void 0?e:1,this.radius=n,this.threshold=s,this.resolution=t!==void 0?new At(t.x,t.y):new At(256,256),this.clearColor=new Pt(0,0,0),this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let r=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);this.renderTargetBright=new Cn(r,a,{type:Qn}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let p=0;p<this.nMips;p++){const m=new Cn(r,a,{type:Qn});m.texture.name="UnrealBloomPass.h"+p,m.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(m);const x=new Cn(r,a,{type:Qn});x.texture.name="UnrealBloomPass.v"+p,x.texture.generateMipmaps=!1,this.renderTargetsVertical.push(x),r=Math.round(r/2),a=Math.round(a/2)}const l=BM;this.highPassUniforms=gr.clone(l.uniforms),this.highPassUniforms.luminosityThreshold.value=s,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new Re({uniforms:this.highPassUniforms,vertexShader:l.vertexShader,fragmentShader:l.fragmentShader}),this.separableBlurMaterials=[];const c=[3,5,7,9,11];r=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);for(let p=0;p<this.nMips;p++)this.separableBlurMaterials.push(this.getSeperableBlurMaterial(c[p])),this.separableBlurMaterials[p].uniforms.invSize.value=new At(1/r,1/a),r=Math.round(r/2),a=Math.round(a/2);this.compositeMaterial=this.getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=e,this.compositeMaterial.uniforms.bloomRadius.value=.1;const h=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=h,this.bloomTintColors=[new N(1,1,1),new N(1,1,1),new N(1,1,1),new N(1,1,1),new N(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors;const d=pd;this.copyUniforms=gr.clone(d.uniforms),this.blendMaterial=new Re({uniforms:this.copyUniforms,vertexShader:d.vertexShader,fragmentShader:d.fragmentShader,blending:_n,depthTest:!1,depthWrite:!1,transparent:!0}),this.enabled=!0,this.needsSwap=!1,this._oldClearColor=new Pt,this.oldClearAlpha=1,this.basic=new $o,this.fsQuad=new yc(null)}dispose(){for(let t=0;t<this.renderTargetsHorizontal.length;t++)this.renderTargetsHorizontal[t].dispose();for(let t=0;t<this.renderTargetsVertical.length;t++)this.renderTargetsVertical[t].dispose();this.renderTargetBright.dispose();for(let t=0;t<this.separableBlurMaterials.length;t++)this.separableBlurMaterials[t].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this.basic.dispose(),this.fsQuad.dispose()}setSize(t,e){let n=Math.round(t/2),s=Math.round(e/2);this.renderTargetBright.setSize(n,s);for(let r=0;r<this.nMips;r++)this.renderTargetsHorizontal[r].setSize(n,s),this.renderTargetsVertical[r].setSize(n,s),this.separableBlurMaterials[r].uniforms.invSize.value=new At(1/n,1/s),n=Math.round(n/2),s=Math.round(s/2)}render(t,e,n,s,r){t.getClearColor(this._oldClearColor),this.oldClearAlpha=t.getClearAlpha();const a=t.autoClear;t.autoClear=!1,t.setClearColor(this.clearColor,0),r&&t.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this.fsQuad.material=this.basic,this.basic.map=n.texture,t.setRenderTarget(null),t.clear(),this.fsQuad.render(t)),this.highPassUniforms.tDiffuse.value=n.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this.fsQuad.material=this.materialHighPassFilter,t.setRenderTarget(this.renderTargetBright),t.clear(),this.fsQuad.render(t);let l=this.renderTargetBright;for(let c=0;c<this.nMips;c++)this.fsQuad.material=this.separableBlurMaterials[c],this.separableBlurMaterials[c].uniforms.colorTexture.value=l.texture,this.separableBlurMaterials[c].uniforms.direction.value=Os.BlurDirectionX,t.setRenderTarget(this.renderTargetsHorizontal[c]),t.clear(),this.fsQuad.render(t),this.separableBlurMaterials[c].uniforms.colorTexture.value=this.renderTargetsHorizontal[c].texture,this.separableBlurMaterials[c].uniforms.direction.value=Os.BlurDirectionY,t.setRenderTarget(this.renderTargetsVertical[c]),t.clear(),this.fsQuad.render(t),l=this.renderTargetsVertical[c];this.fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,t.setRenderTarget(this.renderTargetsHorizontal[0]),t.clear(),this.fsQuad.render(t),this.fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,r&&t.state.buffers.stencil.setTest(!0),this.renderToScreen?(t.setRenderTarget(null),this.fsQuad.render(t)):(t.setRenderTarget(n),this.fsQuad.render(t)),t.setClearColor(this._oldClearColor,this.oldClearAlpha),t.autoClear=a}getSeperableBlurMaterial(t){const e=[];for(let n=0;n<t;n++)e.push(.39894*Math.exp(-.5*n*n/(t*t))/t);return new Re({defines:{KERNEL_RADIUS:t},uniforms:{colorTexture:{value:null},invSize:{value:new At(.5,.5)},direction:{value:new At(.5,.5)},gaussianCoefficients:{value:e}},vertexShader:`varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,fragmentShader:`#include <common>
				varying vec2 vUv;
				uniform sampler2D colorTexture;
				uniform vec2 invSize;
				uniform vec2 direction;
				uniform float gaussianCoefficients[KERNEL_RADIUS];

				void main() {
					float weightSum = gaussianCoefficients[0];
					vec3 diffuseSum = texture2D( colorTexture, vUv ).rgb * weightSum;
					for( int i = 1; i < KERNEL_RADIUS; i ++ ) {
						float x = float(i);
						float w = gaussianCoefficients[i];
						vec2 uvOffset = direction * invSize * x;
						vec3 sample1 = texture2D( colorTexture, vUv + uvOffset ).rgb;
						vec3 sample2 = texture2D( colorTexture, vUv - uvOffset ).rgb;
						diffuseSum += (sample1 + sample2) * w;
						weightSum += 2.0 * w;
					}
					gl_FragColor = vec4(diffuseSum/weightSum, 1.0);
				}`})}getCompositeMaterial(t){return new Re({defines:{NUM_MIPS:t},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,fragmentShader:`varying vec2 vUv;
				uniform sampler2D blurTexture1;
				uniform sampler2D blurTexture2;
				uniform sampler2D blurTexture3;
				uniform sampler2D blurTexture4;
				uniform sampler2D blurTexture5;
				uniform float bloomStrength;
				uniform float bloomRadius;
				uniform float bloomFactors[NUM_MIPS];
				uniform vec3 bloomTintColors[NUM_MIPS];

				float lerpBloomFactor(const in float factor) {
					float mirrorFactor = 1.2 - factor;
					return mix(factor, mirrorFactor, bloomRadius);
				}

				void main() {
					gl_FragColor = bloomStrength * ( lerpBloomFactor(bloomFactors[0]) * vec4(bloomTintColors[0], 1.0) * texture2D(blurTexture1, vUv) +
						lerpBloomFactor(bloomFactors[1]) * vec4(bloomTintColors[1], 1.0) * texture2D(blurTexture2, vUv) +
						lerpBloomFactor(bloomFactors[2]) * vec4(bloomTintColors[2], 1.0) * texture2D(blurTexture3, vUv) +
						lerpBloomFactor(bloomFactors[3]) * vec4(bloomTintColors[3], 1.0) * texture2D(blurTexture4, vUv) +
						lerpBloomFactor(bloomFactors[4]) * vec4(bloomTintColors[4], 1.0) * texture2D(blurTexture5, vUv) );
				}`})}}Os.BlurDirectionX=new At(1,0);Os.BlurDirectionY=new At(0,1);const kM={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
		precision highp float;

		uniform mat4 modelViewMatrix;
		uniform mat4 projectionMatrix;

		attribute vec3 position;
		attribute vec2 uv;

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`
	
		precision highp float;

		uniform sampler2D tDiffuse;

		#include <tonemapping_pars_fragment>
		#include <colorspace_pars_fragment>

		varying vec2 vUv;

		void main() {

			gl_FragColor = texture2D( tDiffuse, vUv );

			// tone mapping

			#ifdef LINEAR_TONE_MAPPING

				gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );

			#elif defined( REINHARD_TONE_MAPPING )

				gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );

			#elif defined( CINEON_TONE_MAPPING )

				gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );

			#elif defined( ACES_FILMIC_TONE_MAPPING )

				gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );

			#elif defined( AGX_TONE_MAPPING )

				gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );

			#elif defined( NEUTRAL_TONE_MAPPING )

				gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );

			#endif

			// color space

			#ifdef SRGB_TRANSFER

				gl_FragColor = sRGBTransferOETF( gl_FragColor );

			#endif

		}`};class zM extends Vs{constructor(){super();const t=kM;this.uniforms=gr.clone(t.uniforms),this.material=new mM({name:t.name,uniforms:this.uniforms,vertexShader:t.vertexShader,fragmentShader:t.fragmentShader}),this.fsQuad=new yc(this.material),this._outputColorSpace=null,this._toneMapping=null}render(t,e,n){this.uniforms.tDiffuse.value=n.texture,this.uniforms.toneMappingExposure.value=t.toneMappingExposure,(this._outputColorSpace!==t.outputColorSpace||this._toneMapping!==t.toneMapping)&&(this._outputColorSpace=t.outputColorSpace,this._toneMapping=t.toneMapping,this.material.defines={},ee.getTransfer(this._outputColorSpace)===ce&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===Lf?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===Uf?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===Nf?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===ec?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===Of?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===Ff&&(this.material.defines.NEUTRAL_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(t.setRenderTarget(null),this.fsQuad.render(t)):(t.setRenderTarget(e),this.clear&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),this.fsQuad.render(t))}dispose(){this.material.dispose(),this.fsQuad.dispose()}}class VM{constructor(t){this.renderer=new fM({logarithmicDepthBuffer:!0,antialias:!0,alpha:!1,powerPreference:"high-performance"}),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),this.renderer.setSize(window.innerWidth,window.innerHeight),this.renderer.setClearColor(658964,1),this.renderer.toneMapping=ec,this.renderer.toneMappingExposure=1.1,this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=If,t.appendChild(this.renderer.domElement),this.composer=null,this.bloomPass=null}setupPostProcessing(t,e){const n=new At(window.innerWidth,window.innerHeight);this.composer=new OM(this.renderer),this.composer.addPass(new FM(t,e)),this.bloomPass=new Os(n,.5,1,.75),this.composer.addPass(this.bloomPass),this.composer.addPass(new zM)}render(){this.composer&&this.composer.render()}resize(t,e){this.renderer.setSize(t,e),this.composer&&this.composer.setSize(t,e)}get domElement(){return this.renderer.domElement}}class HM{constructor(t,e,n){this.renderPipeline=t,this.cameraController=e,this.sceneManager=n,this._lastTime=0,this._running=!1,this._updateCallbacks=[],this._frame=this._frame.bind(this)}onUpdate(t){this._updateCallbacks.push(t)}start(){this._running=!0,this._lastTime=performance.now(),requestAnimationFrame(this._frame)}stop(){this._running=!1}_frame(t){if(!this._running)return;requestAnimationFrame(this._frame);const e=Math.min((t-this._lastTime)/1e3,.1);this._lastTime=t,Mt.tick(e),this.cameraController.update(e);for(const n of this._updateCallbacks)n(e,t/1e3);this.renderPipeline.render()}}class GM{constructor(t,e,n,s){this.camera=t,this.scene=e,this.domElement=n,this.cameraController=s,this.raycaster=new SM,this.pointer=new At,this.clickables=[],n.addEventListener("pointerup",r=>this._onPointerUp(r))}addClickable(t,e){t.userData._clickHandler=e,this.clickables.push(t)}removeClickable(t){this.clickables=this.clickables.filter(e=>e!==t),delete t.userData._clickHandler}_onPointerUp(t){if(!this.cameraController.wasClick()||t.button!==0)return;const e=this.domElement.getBoundingClientRect();this.pointer.x=(t.clientX-e.left)/e.width*2-1,this.pointer.y=-((t.clientY-e.top)/e.height)*2+1,this.raycaster.setFromCamera(this.pointer,this.camera);const n=this.raycaster.intersectObjects(this.clickables,!1);if(n.length>0){const s=n[0].object;s.userData._clickHandler&&s.userData._clickHandler(n[0])}}}const Gu={xerion:{x:2e3,y:2e3},drakon:{x:2280,y:1780},crystara:{x:1580,y:1640},voltara:{x:1380,y:2180},glacius:{x:1700,y:2620},nebulox:{x:2400,y:2720},solaris:{x:2900,y:2200},voidex:{x:2800,y:1400}},WM=[["xerion","drakon"],["xerion","crystara"],["drakon","crystara"],["crystara","voltara"],["voltara","glacius"],["glacius","nebulox"],["nebulox","solaris"],["solaris","voidex"],["drakon","voltara"],["nebulox","voidex"]],XM=4e3,Wu=XM/2,Xu=.05;function qM(i){const t=Math.sin(i*127.1+311.7)*43758.5453;return t-Math.floor(t)}function jM(i){const t=(i.x-Wu)*Xu,e=(i.y-Wu)*Xu,n=(qM(i.x*.01+i.y*.01)-.5)*12;return new N(t,n,e)}function $M(){const i={};for(const t in Gu)i[t]=jM(Gu[t]);return i}const zn=`
  // Hash-based pseudo-random
  float hash21(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  float hash31(vec3 p) {
    p = fract(p * vec3(0.1031, 0.1030, 0.0973));
    p += dot(p, p.yxz + 33.33);
    return fract((p.x + p.y) * p.z);
  }

  // Smooth value noise 2D
  float vnoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f); // smoothstep
    float a = hash21(i);
    float b = hash21(i + vec2(1.0, 0.0));
    float c = hash21(i + vec2(0.0, 1.0));
    float d = hash21(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  // Smooth value noise 3D
  float vnoise3(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float n000 = hash31(i);
    float n100 = hash31(i + vec3(1,0,0));
    float n010 = hash31(i + vec3(0,1,0));
    float n110 = hash31(i + vec3(1,1,0));
    float n001 = hash31(i + vec3(0,0,1));
    float n101 = hash31(i + vec3(1,0,1));
    float n011 = hash31(i + vec3(0,1,1));
    float n111 = hash31(i + vec3(1,1,1));
    float n00 = mix(n000, n100, f.x);
    float n10 = mix(n010, n110, f.x);
    float n01 = mix(n001, n101, f.x);
    float n11 = mix(n011, n111, f.x);
    float n0 = mix(n00, n10, f.y);
    float n1 = mix(n01, n11, f.y);
    return mix(n0, n1, f.z);
  }

  // Fractal Brownian Motion (2D)
  float fbm(vec2 p, int octaves) {
    float value = 0.0;
    float amp = 0.5;
    float freq = 1.0;
    for (int i = 0; i < 8; i++) {
      if (i >= octaves) break;
      value += amp * vnoise(p * freq);
      freq *= 2.0;
      amp *= 0.5;
    }
    return value;
  }

  // Fractal Brownian Motion (3D)
  float fbm3(vec3 p, int octaves) {
    float value = 0.0;
    float amp = 0.5;
    float freq = 1.0;
    for (int i = 0; i < 8; i++) {
      if (i >= octaves) break;
      value += amp * vnoise3(p * freq);
      freq *= 2.0;
      amp *= 0.5;
    }
    return value;
  }
`,ii=`
  float fresnel(vec3 viewDir, vec3 normal, float power) {
    return pow(1.0 - max(dot(viewDir, normal), 0.0), power);
  }
`,bi=`
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec3 vWorldPosition;
  varying vec3 vViewDir;

  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPos.xyz;
    vViewDir = normalize(cameraPosition - worldPos.xyz);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,YM=`
  varying vec3 vNormal;
  varying vec3 vViewDir;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vViewDir = normalize(cameraPosition - worldPos.xyz);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,md={vertex:bi,fragment:`
    ${zn}
    ${ii}

    uniform float uTime;
    uniform vec3 uColors[4];
    uniform vec3 uLightDir;

    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec3 vViewDir;

    void main() {
      // Spherical noise for land/ocean
      vec3 sp = vPosition * 2.5;
      float n = fbm3(sp + vec3(0.0, 0.0, uTime * 0.01), 5);

      // Land vs ocean threshold
      float land = smoothstep(0.42, 0.48, n);

      // Ocean color (deeper blue in deep areas)
      vec3 ocean = mix(uColors[0], uColors[1], smoothstep(0.3, 0.42, n));

      // Land color with elevation
      float elevation = smoothstep(0.48, 0.7, n);
      vec3 terrain = mix(uColors[2], uColors[3], elevation);

      vec3 baseColor = mix(ocean, terrain, land);

      // Cloud layer (separate noise, animated)
      float clouds = fbm3(vPosition * 3.0 + vec3(uTime * 0.03, uTime * 0.02, 0.0), 4);
      clouds = smoothstep(0.45, 0.65, clouds);
      baseColor = mix(baseColor, vec3(1.0, 1.0, 0.98), clouds * 0.5);

      // Lighting
      float diff = max(dot(vNormal, uLightDir), 0.0);
      float ambient = 0.15;
      vec3 lit = baseColor * (ambient + diff * 0.85);

      // Specular on ocean
      vec3 halfDir = normalize(uLightDir + vViewDir);
      float spec = pow(max(dot(vNormal, halfDir), 0.0), 40.0) * (1.0 - land) * 0.4;
      lit += vec3(spec);

      // Rim light
      float rim = fresnel(vViewDir, vNormal, 2.5);
      lit += uColors[0] * rim * 0.15;

      gl_FragColor = vec4(lit, 1.0);
    }
  `},KM={vertex:bi,fragment:`
    ${zn}
    ${ii}

    uniform float uTime;
    uniform vec3 uColors[4];
    uniform vec3 uLightDir;

    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec3 vViewDir;

    void main() {
      vec3 sp = vPosition * 3.0;

      // Slow churning lava flow
      float flow = fbm3(sp + vec3(uTime * 0.04, uTime * 0.02, uTime * 0.03), 5);

      // Crust vs lava cracks
      float crust = smoothstep(0.35, 0.55, flow);

      // Hot lava color in cracks (emissive)
      vec3 lavaColor = mix(uColors[0], uColors[1], flow);
      vec3 crustColor = mix(uColors[2], uColors[3], fbm3(sp * 2.0, 3));

      vec3 baseColor = mix(lavaColor, crustColor, crust);

      // Emissive glow from lava cracks
      float emissiveStrength = (1.0 - crust) * 1.5;

      // Lighting on crust
      float diff = max(dot(vNormal, uLightDir), 0.0);
      float ambient = 0.1;
      vec3 lit = baseColor * (ambient + diff * 0.6) + lavaColor * emissiveStrength;

      // Pulsing heat glow
      float pulse = sin(uTime * 0.5 + flow * 6.0) * 0.5 + 0.5;
      lit += uColors[0] * (1.0 - crust) * pulse * 0.3;

      // Rim
      float rim = fresnel(vViewDir, vNormal, 2.0);
      lit += uColors[1] * rim * 0.2;

      gl_FragColor = vec4(lit, 1.0);
    }
  `},JM={vertex:bi,fragment:`
    ${zn}
    ${ii}

    uniform float uTime;
    uniform vec3 uColors[4];
    uniform vec3 uLightDir;

    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec3 vViewDir;

    void main() {
      vec3 sp = vPosition * 4.0;

      // Crystal formation noise — sharp edges via power
      float n = fbm3(sp, 5);
      float crystal = pow(n, 3.0);

      // Base surface
      float bands = fbm3(sp * 1.5 + vec3(0.0, uTime * 0.01, 0.0), 3);
      vec3 baseColor = mix(uColors[2], uColors[3], bands);

      // Crystal veins
      vec3 crystalColor = mix(uColors[0], uColors[1], crystal * 2.0);
      float veinMask = smoothstep(0.08, 0.12, crystal);
      baseColor = mix(baseColor, crystalColor, veinMask);

      // Sparkle effect — high frequency noise pulsing with time
      float sparkle = vnoise3(vPosition * 30.0 + uTime * 2.0);
      sparkle = pow(sparkle, 12.0) * 4.0;

      // Lighting
      float diff = max(dot(vNormal, uLightDir), 0.0);
      float ambient = 0.12;
      vec3 lit = baseColor * (ambient + diff * 0.7);

      // Sharp specular for crystalline surface
      vec3 halfDir = normalize(uLightDir + vViewDir);
      float spec = pow(max(dot(vNormal, halfDir), 0.0), 80.0) * 0.8;
      lit += uColors[0] * spec;

      // Sparkle emission
      lit += uColors[0] * sparkle;

      // Rim
      float rim = fresnel(vViewDir, vNormal, 2.5);
      lit += uColors[1] * rim * 0.25;

      gl_FragColor = vec4(lit, 1.0);
    }
  `},ZM={vertex:bi,fragment:`
    ${zn}
    ${ii}

    uniform float uTime;
    uniform vec3 uColors[4];
    uniform vec3 uLightDir;

    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec3 vViewDir;

    void main() {
      // Latitude-based banding
      float lat = vPosition.y * 5.0;

      // Turbulence at band boundaries
      float turb = fbm3(vPosition * 8.0 + vec3(uTime * 0.06, 0.0, uTime * 0.02), 4);
      lat += turb * 0.5;

      // Band pattern
      float band = sin(lat) * 0.5 + 0.5;

      // Color from band position
      vec3 bandColor = mix(
        mix(uColors[0], uColors[1], band),
        mix(uColors[2], uColors[3], band),
        smoothstep(0.3, 0.7, band)
      );

      // Great spot (vortex)
      vec2 spotCenter = vec2(0.3, 0.1);
      vec3 spotRef = normalize(vec3(spotCenter.x, spotCenter.y, sqrt(max(0.0, 1.0 - dot(spotCenter, spotCenter)))));
      float spotDist = distance(normalize(vPosition), spotRef);
      float spot = smoothstep(0.2, 0.1, spotDist);
      float swirl = fbm3(vPosition * 15.0 + vec3(uTime * 0.1), 3);
      vec3 spotColor = mix(uColors[3], uColors[0], swirl);
      bandColor = mix(bandColor, spotColor, spot * 0.7);

      // Lighting
      float diff = max(dot(vNormal, uLightDir), 0.0);
      float ambient = 0.15;
      vec3 lit = bandColor * (ambient + diff * 0.75);

      // Soft atmospheric scattering
      float rim = fresnel(vViewDir, vNormal, 2.0);
      lit += uColors[1] * rim * 0.2;

      gl_FragColor = vec4(lit, 1.0);
    }
  `},QM={vertex:bi,fragment:`
    ${zn}
    ${ii}

    uniform float uTime;
    uniform vec3 uColors[4];
    uniform vec3 uLightDir;

    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec3 vViewDir;

    void main() {
      vec3 sp = vPosition * 3.0;

      // Ice surface — smooth with cracks
      float surface = fbm3(sp + vec3(0.0, 0.0, uTime * 0.005), 5);

      // Crack pattern (Voronoi-like via sharp noise)
      float cracks = fbm3(sp * 5.0, 4);
      cracks = pow(1.0 - cracks, 6.0);

      // Base ice color — high albedo
      vec3 baseColor = mix(uColors[0], uColors[1], surface);
      baseColor = mix(baseColor, uColors[2], smoothstep(0.4, 0.6, surface));

      // Dark cracks
      baseColor = mix(baseColor, uColors[3], cracks * 0.5);

      // Subsurface scattering approximation
      float sss = fresnel(vViewDir, vNormal, 1.2);
      float backlight = max(dot(vNormal, -uLightDir), 0.0);
      vec3 subsurface = uColors[1] * backlight * 0.15;

      // Lighting — high ambient for ice reflectivity
      float diff = max(dot(vNormal, uLightDir), 0.0);
      float ambient = 0.25;
      vec3 lit = baseColor * (ambient + diff * 0.65) + subsurface;

      // Sharp specular (ice is reflective)
      vec3 halfDir = normalize(uLightDir + vViewDir);
      float spec = pow(max(dot(vNormal, halfDir), 0.0), 60.0) * 0.5;
      lit += vec3(spec);

      // Blue rim
      float rim = fresnel(vViewDir, vNormal, 3.0);
      lit += uColors[1] * rim * 0.2;

      gl_FragColor = vec4(lit, 1.0);
    }
  `},tS={vertex:bi,fragment:`
    ${zn}
    ${ii}

    uniform float uTime;
    uniform vec3 uColors[4];
    uniform vec3 uLightDir;

    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec3 vViewDir;

    void main() {
      vec3 sp = vPosition * 2.0;

      // Multiple swirling gas layers at different speeds
      float layer1 = fbm3(sp + vec3(uTime * 0.04, uTime * 0.02, 0.0), 5);
      float layer2 = fbm3(sp * 1.5 + vec3(-uTime * 0.03, 0.0, uTime * 0.05), 4);
      float layer3 = fbm3(sp * 0.8 + vec3(0.0, uTime * 0.06, -uTime * 0.02), 3);

      // Blend layers with depth parallax effect
      float combined = layer1 * 0.5 + layer2 * 0.3 + layer3 * 0.2;

      // Color gradient through nebula gas
      vec3 color1 = mix(uColors[0], uColors[1], layer1);
      vec3 color2 = mix(uColors[2], uColors[3], layer2);
      vec3 baseColor = mix(color1, color2, combined);

      // Emissive hot spots in dense areas
      float density = pow(combined, 1.5);
      float emissive = smoothstep(0.5, 0.8, density) * 0.8;

      // Soft lighting
      float diff = max(dot(vNormal, uLightDir), 0.0);
      float ambient = 0.2;
      vec3 lit = baseColor * (ambient + diff * 0.5) + baseColor * emissive;

      // Strong rim glow
      float rim = fresnel(vViewDir, vNormal, 2.0);
      lit += uColors[1] * rim * 0.35;

      gl_FragColor = vec4(lit, 1.0);
    }
  `},eS={vertex:bi,fragment:`
    ${zn}
    ${ii}

    uniform float uTime;
    uniform vec3 uColors[4];
    uniform vec3 uLightDir;

    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec3 vViewDir;

    void main() {
      vec3 sp = vPosition * 3.0;

      // Churning plasma surface
      float plasma = fbm3(sp + vec3(uTime * 0.08, uTime * 0.05, uTime * 0.06), 5);

      // Surface convection cells
      float cells = fbm3(sp * 5.0 + uTime * 0.1, 3);
      cells = pow(cells, 2.0);

      // Color gradient — hottest center to cooler edges
      vec3 baseColor = mix(uColors[0], uColors[1], plasma);
      baseColor = mix(baseColor, uColors[2], cells * 0.4);

      // Solar flare rays
      float angle = atan(vPosition.z, vPosition.x);
      float flareNoise = vnoise(vec2(angle * 3.0, uTime * 0.3));
      float flareMask = pow(flareNoise, 5.0) * 2.0;
      float edgeDist = fresnel(vViewDir, vNormal, 1.5);
      float flare = flareMask * edgeDist;
      baseColor += uColors[0] * flare;

      // Pulsing intensity
      float pulse = sin(uTime * 1.5 + plasma * 4.0) * 0.1 + 1.0;

      // Fully emissive — stars don't receive shadows
      vec3 lit = baseColor * pulse * 1.8;

      // Corona rim
      float rim = fresnel(vViewDir, vNormal, 1.5);
      lit += uColors[1] * rim * 0.5;

      gl_FragColor = vec4(lit, 1.0);
    }
  `},nS={vertex:bi,fragment:`
    ${zn}
    ${ii}

    uniform float uTime;
    uniform vec3 uColors[4];
    uniform vec3 uLightDir;

    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec3 vViewDir;

    void main() {
      vec3 sp = vPosition * 2.5;

      // Spiraling void distortion
      float angle = atan(vPosition.z, vPosition.x);
      float dist = length(vPosition.xz);
      float spiral = angle + dist * 3.0 - uTime * 0.3;
      float spiralPattern = sin(spiral * 4.0) * 0.5 + 0.5;

      // Dark matter noise
      float darkNoise = fbm3(sp + vec3(uTime * 0.03, -uTime * 0.02, uTime * 0.04), 5);

      // Combined pattern
      float pattern = mix(spiralPattern, darkNoise, 0.6);

      // Inverted lighting — dark where lit, bright at edges
      float invertedLight = 1.0 - max(dot(vNormal, uLightDir), 0.0);

      // Base colors — very dark with purple/violet highlights
      vec3 baseColor = mix(uColors[3], uColors[2], pattern);
      vec3 highlight = mix(uColors[1], uColors[0], darkNoise);

      // Void energy veins
      float veins = pow(fbm3(sp * 6.0 + uTime * 0.1, 3), 4.0) * 3.0;
      baseColor += highlight * veins;

      // Dim emissive in void patterns
      float emissive = smoothstep(0.4, 0.8, pattern) * 0.4;

      // Lighting — mostly ambient + inverted contribution
      vec3 lit = baseColor * (0.15 + invertedLight * 0.3) + baseColor * emissive;

      // Eerie purple rim
      float rim = fresnel(vViewDir, vNormal, 2.0);
      lit += uColors[0] * rim * 0.4;

      // Dimensional rift pulsing
      float pulse = sin(uTime * 0.7 + pattern * 5.0) * 0.15 + 0.85;
      lit *= pulse;

      gl_FragColor = vec4(lit, 1.0);
    }
  `},qu={vertex:YM,fragment:`
    ${ii}

    uniform vec3 uAtmColor;
    uniform float uAtmIntensity;
    varying vec3 vNormal;
    varying vec3 vViewDir;

    void main() {
      float rim = fresnel(vViewDir, vNormal, 3.0);
      float inner = fresnel(vViewDir, vNormal, 6.0);
      // Multi-layer glow: soft outer + sharper inner
      float glow = rim * 0.7 + inner * 0.3;
      gl_FragColor = vec4(uAtmColor, glow * uAtmIntensity);
    }
  `},ju={vertex:`
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,fragment:`
    uniform vec3 uColor;
    uniform float uOpacity;
    varying vec2 vUv;

    void main() {
      // Radial position (0 = inner edge, 1 = outer edge)
      float r = length(vUv - 0.5) * 2.0;

      // Bell-curve opacity across ring width
      float ring = smoothstep(0.3, 0.45, r) * smoothstep(1.0, 0.85, r);

      // Gap ring in the middle
      float gap = 1.0 - smoothstep(0.58, 0.6, r) * (1.0 - smoothstep(0.62, 0.64, r));

      // Thin sub-rings
      float bands = 0.8 + 0.2 * sin(r * 60.0);

      float alpha = ring * gap * bands * uOpacity;
      if (alpha < 0.01) discard;

      gl_FragColor = vec4(uColor, alpha);
    }
  `},iS={terr:md,lava:KM,cryst:JM,gas:ZM,ice:QM,neb:tS,star:eS,void:nS},sS=["gas","star","void"];function rS(i){const t=new Pt(i);return new N(t.r,t.g,t.b)}class oS{constructor(t,e=10){this.def=t,this.radius=e,this.group=new Oe,this.group.userData.type="planet",this.group.userData.planetId=t.id,this._createPlanetMesh(),this._createAtmosphere(),sS.includes(t.type)&&this._createRings()}_createPlanetMesh(){const e=(Xc[this.def.type]||Xc.terr).map(rS),n=iS[this.def.type]||md,s=new N(1,.5,-.3).normalize();this.planetMaterial=new Re({vertexShader:n.vertex,fragmentShader:n.fragment,uniforms:{uTime:{value:0},uColors:{value:e},uLightDir:{value:s}}});const r=new Pn(this.radius,64,64);this.planetMesh=new Bt(r,this.planetMaterial),this.planetMesh.castShadow=!0,this.group.add(this.planetMesh)}_createAtmosphere(){const t=new Pt(this.def.glow),e=this.def.type==="star";this.atmosphereMaterial=new Re({vertexShader:qu.vertex,fragmentShader:qu.fragment,uniforms:{uAtmColor:{value:new N(t.r,t.g,t.b)},uAtmIntensity:{value:e?1.2:.8}},side:Ze,transparent:!0,depthWrite:!1,blending:_n});const n=new Pn(this.radius*1.15,48,48);this.atmosphereMesh=new Bt(n,this.atmosphereMaterial),this.group.add(this.atmosphereMesh)}_createRings(){const t=new Pt(this.def.glow),e=this.radius*1.3,n=this.radius*2.2;this.ringMaterial=new Re({vertexShader:ju.vertex,fragmentShader:ju.fragment,uniforms:{uColor:{value:new N(t.r,t.g,t.b)},uOpacity:{value:.5}},transparent:!0,side:Je,depthWrite:!1});const s=new Zo(e,n,128,1);this.ringMesh=new Bt(s,this.ringMaterial),this.ringMesh.rotation.x=-Math.PI/2+.15,this.ringMesh.receiveShadow=!0,this.group.add(this.ringMesh)}get clickTarget(){return this.planetMesh}update(t){this.planetMaterial.uniforms.uTime.value=t}setPosition(t,e,n){this.group.position.set(t,e,n)}dispose(){this.planetMesh.geometry.dispose(),this.planetMaterial.dispose(),this.atmosphereMesh.geometry.dispose(),this.atmosphereMaterial.dispose(),this.ringMesh&&(this.ringMesh.geometry.dispose(),this.ringMaterial.dispose())}}const _o=13150286,$a=9075278,Ya=8173662,aS=1709320;class lS{constructor(){this.group=new Oe,this._build(),this.orbitAngle=Math.random()*Math.PI*2,this.orbitRadius=15,this.orbitSpeed=.1}_build(){const t=new Ns(1.5,.08,12,48),e=new ge({color:_o,emissive:_o,emissiveIntensity:.4,metalness:.85,roughness:.25});this.outerRing=new Bt(t,e),this.outerRing.rotation.x=Math.PI/2,this.group.add(this.outerRing);const n=new Ns(.9,.05,12,36),s=new ge({color:$a,emissive:$a,emissiveIntensity:.2,metalness:.8,roughness:.3});this.innerRing=new Bt(n,s),this.innerRing.rotation.x=Math.PI/2,this.group.add(this.innerRing);const r=new Pn(.35,16,16),a=new ge({color:aS,emissive:Ya,emissiveIntensity:.6,metalness:.5,roughness:.4});this.hub=new Bt(r,a),this.group.add(this.hub);const l=new ge({color:$a,metalness:.7,roughness:.4});for(let S=0;S<4;S++){const w=S/4*Math.PI*2,v=new kn(.03,.03,1.15,6),f=new Bt(v,l);f.rotation.z=Math.PI/2,f.rotation.y=w,f.position.set(Math.cos(w)*.75,0,Math.sin(w)*.75),this.group.add(f)}const c=new ge({color:2245768,emissive:1122884,emissiveIntensity:.3,metalness:.6,roughness:.5});for(let S=0;S<4;S++){const w=S/4*Math.PI*2+Math.PI/4,v=new gn(.5,.02,.25),f=new Bt(v,c);f.position.set(Math.cos(w)*1.5,0,Math.sin(w)*1.5),f.rotation.y=w,this.group.add(f)}const h=new kn(.1,.15,.3,8),d=new ge({color:_o,emissive:_o,emissiveIntensity:.2,metalness:.8,roughness:.3}),p=new Bt(h,d);p.position.y=.3,this.group.add(p);const m=new Pn(.06,8,8),x=new ge({color:Ya,emissive:Ya,emissiveIntensity:2});this.navLight=new Bt(m,x),this.navLight.position.y=-.25,this.group.add(this.navLight),this.group.scale.setScalar(.8)}update(t){this.orbitAngle=t*this.orbitSpeed,this.group.position.set(Math.cos(this.orbitAngle)*this.orbitRadius,Math.sin(this.orbitAngle*.3)*1.5,Math.sin(this.orbitAngle)*this.orbitRadius),this.outerRing.rotation.z=t*.32,this.innerRing.rotation.z=-t*.2;const e=Math.sin(t*3)*.5+.5;this.navLight.material.emissiveIntensity=1+e*2}dispose(){this.group.traverse(t=>{t.isMesh&&(t.geometry.dispose(),t.material.dispose())})}}const vo=20,$u=3,Yu=11.5,cS=13.5;class Tr{constructor(t){this.group=new Oe,this.orbitRadius=Yu+Math.random()*(cS-Yu),this.orbitSpeed=.3+Math.random()*.2,this.angle=Math.random()*Math.PI*2,this.phaseOffset=Math.random()*Math.PI*2,this.verticalAmp=.8+Math.random()*1.2,this.cargo=Math.random()*$u,this.returning=!1,this.returnProgress=0,this.returnStart=new N,this.stationPos=new N(0,0,15),this.mesh=this._buildMesh(),this.mesh.scale.setScalar(.3),this.group.add(this.mesh),this._createTrail()}_buildMesh(){const t=new gn(1,.6,.8),e=new ge({color:13150286,metalness:.7,roughness:.3});return new Bt(t,e)}_createTrail(){const t=new Float32Array(vo*3);this.trailGeo=new be,this.trailGeo.setAttribute("position",new Fe(t,3)),this.trailMat=new mc({color:8173662,transparent:!0,opacity:.4,blending:_n,depthWrite:!1}),this.trail=new fd(this.trailGeo,this.trailMat),this.group.add(this.trail),this.trailPositions=[];for(let e=0;e<vo;e++)this.trailPositions.push(new N)}update(t,e){this.returning?this._updateReturn(t):(this._updateOrbit(t,e),this.cargo+=t*.5,this.cargo>=$u&&(this.returning=!0,this.returnProgress=0,this.returnStart.copy(this.group.position))),this._updateTrail()}_updateOrbit(t,e){this.angle+=this.orbitSpeed*t;const n=Math.sin(this.phaseOffset+e*.7)*.4;this.group.position.set(Math.cos(this.angle)*(this.orbitRadius+n),Math.sin(this.phaseOffset+e*.5)*this.verticalAmp,Math.sin(this.angle)*(this.orbitRadius+n));const s=.1,r=Math.cos(this.angle+s)*this.orbitRadius,a=Math.sin(this.angle+s)*this.orbitRadius;this.mesh.lookAt(r,this.group.position.y,a)}_updateReturn(t){if(this.returnProgress+=t*.5,this.returnProgress>=1){this.returning=!1,this.cargo=0,this.returnProgress=0;return}const e=this.returnProgress,n=e*e*(3-2*e);this.group.position.lerpVectors(this.returnStart,this.stationPos,n),this.mesh.lookAt(this.stationPos),this.trailMat.opacity=.7}_updateTrail(){for(let e=vo-1;e>0;e--)this.trailPositions[e].copy(this.trailPositions[e-1]);this.trailPositions[0].copy(this.group.position);const t=this.trailGeo.attributes.position.array;for(let e=0;e<vo;e++)t[e*3]=this.trailPositions[e].x,t[e*3+1]=this.trailPositions[e].y,t[e*3+2]=this.trailPositions[e].z;this.trailGeo.attributes.position.needsUpdate=!0,this.returning||(this.trailMat.opacity+=(.25-this.trailMat.opacity)*.1)}dispose(){this.mesh.traverse(t=>{t.isMesh&&(t.geometry.dispose(),t.material.dispose())}),this.trailGeo.dispose(),this.trailMat.dispose()}}class hS extends Tr{_buildMesh(){const t=new Oe,e=new gn(1,.6,.7),n=new ge({color:13404211,metalness:.8,roughness:.3});t.add(new Bt(e,n));const s=new vc(.15,.6,6),r=new ge({color:8947848,metalness:.9,roughness:.2}),a=new Bt(s,r);a.rotation.z=-Math.PI/2,a.position.set(.7,-.1,0),this._drill=a,t.add(a);const l=new gn(.3,.2,.5),c=new ge({color:8173662,emissive:8173662,emissiveIntensity:.5}),h=new Bt(l,c);return h.position.set(-.3,.2,0),t.add(h),t}update(t,e){super.update(t,e),this._drill&&(this._drill.rotation.y+=t*8)}}class uS extends Tr{_buildMesh(){const t=new Oe,e=new Pn(.4,12,12),n=new ge({color:4491468,metalness:.7,roughness:.3}),s=new Bt(e,n);s.scale.set(1.2,.7,.9),t.add(s);const r=new kn(.02,.02,.5,4),a=new ge({color:13421772,metalness:.8,roughness:.2}),l=new Bt(r,a);l.position.set(0,.45,0),t.add(l);const c=new Pn(.04,6,6),h=new ge({color:16729156,emissive:16729156,emissiveIntensity:2}),d=new Bt(c,h);d.position.set(0,.72,0),this._tip=d,t.add(d);const p=new Er(.15,8),m=new ge({color:11184810,metalness:.9,roughness:.1,side:Je}),x=new Bt(p,m);return x.position.set(.35,.1,0),x.rotation.y=Math.PI/2,t.add(x),t}update(t,e){super.update(t,e),this._tip&&(this._tip.material.emissiveIntensity=1+Math.sin(e*5)*1.5)}}class fS extends Tr{_buildMesh(){const t=new Oe,e=new Pn(.3,10,10),n=new ge({color:5592405,metalness:.8,roughness:.3});t.add(new Bt(e,n));const s=new Pn(.05,6,6),r=new ge({color:16720384,emissive:16720384,emissiveIntensity:2});for(let l=-1;l<=1;l+=2){const c=new Bt(s,r);c.position.set(.2,.1,l*.12),t.add(c)}this._legs=[];const a=new ge({color:7829367,metalness:.7,roughness:.4});for(let l=0;l<6;l++){const c=l/6*Math.PI*2,h=new kn(.015,.015,.4,4),d=new Bt(h,a);d.position.set(Math.cos(c)*.25,-.15,Math.sin(c)*.25),d.rotation.z=Math.cos(c)*.6,d.rotation.x=Math.sin(c)*.6,this._legs.push(d),t.add(d)}return t}update(t,e){super.update(t,e);for(let n=0;n<this._legs.length;n++){const s=n/this._legs.length*Math.PI*2;this._legs[n].rotation.z+=Math.sin(e*4+s)*t*2}}}class dS extends Tr{_buildMesh(){const t=new Oe,e=new kn(.35,.35,.12,16),n=new ge({color:4500172,metalness:.7,roughness:.3});t.add(new Bt(e,n));const s=new Pn(.2,12,8,0,Math.PI*2,0,Math.PI/2),r=new ge({color:8969727,metalness:.5,roughness:.2,transparent:!0,opacity:.7}),a=new Bt(s,r);a.position.y=.06,t.add(a);const l=new Ns(.45,.03,8,24),c=new ge({color:13150286,emissive:13150286,emissiveIntensity:.5,metalness:.8,roughness:.2});this._ring1=new Bt(l,c),this._ring1.rotation.x=Math.PI/2,t.add(this._ring1);const h=new Ns(.32,.02,8,20);this._ring2=new Bt(h,c.clone()),this._ring2.rotation.x=Math.PI/2,t.add(this._ring2);const d=new Er(.15,8),p=new ge({color:4508927,emissive:4508927,emissiveIntensity:2,side:Je}),m=new Bt(d,p);return m.rotation.x=Math.PI/2,m.position.y=-.07,t.add(m),t}update(t,e){super.update(t,e),this._ring1&&(this._ring1.rotation.z=e*2),this._ring2&&(this._ring2.rotation.z=-e*3)}}class pS extends Tr{_buildMesh(){const t=new Oe,e=new gn(1.2,.5,.8),n=new ge({color:6706483,metalness:.85,roughness:.3});t.add(new Bt(e,n));const s=new gn(.1,.4,.7),r=new ge({color:8943428,metalness:.9,roughness:.2}),a=new Bt(s,r);a.position.set(.65,0,0),t.add(a);const l=new kn(.2,.25,.15,8),c=new ge({color:7824964,metalness:.8,roughness:.3}),h=new Bt(l,c);h.position.set(-.1,.3,0),t.add(h);const d=new kn(.05,.06,.7,6),p=new ge({color:5592405,metalness:.9,roughness:.2});this._cannon=new Bt(d,p),this._cannon.rotation.z=Math.PI/2,this._cannon.position.set(.25,.35,0),t.add(this._cannon);const m=new gn(1,.15,.15),x=new ge({color:3355443,metalness:.6,roughness:.6});for(let v=-1;v<=1;v+=2){const f=new Bt(m,x);f.position.set(0,-.2,v*.45),t.add(f)}const S=new Er(.06,6),w=new ge({color:16737792,emissive:16737792,emissiveIntensity:1.5,side:Je});for(let v=0;v<2;v++){const f=new Bt(S,w);f.position.set(-.6,-.05+v*.15,0),f.rotation.y=Math.PI/2,t.add(f)}return t}update(t,e){super.update(t,e),this._cannon&&(this._cannon.rotation.y=Math.sin(e*.5)*.3)}}const mS=32,Ku=[hS,uS,fS,dS,pS];class gS{constructor(){this.group=new Oe,this.robots=[],this.targetCount=0}setStationPosition(t){for(const e of this.robots)e.stationPos.copy(t);this._stationPos=t.clone()}syncCount(t){for(this.targetCount=Math.min(t,mS);this.robots.length<this.targetCount;){const e=this.robots.length,n=Ku[e%Ku.length],s=new n(e);this._stationPos&&s.stationPos.copy(this._stationPos),this.robots.push(s),this.group.add(s.group)}for(let e=0;e<this.robots.length;e++)this.robots[e].group.visible=e<this.targetCount}update(t,e){for(let n=0;n<this.targetCount&&n<this.robots.length;n++)this.robots[n].update(t,e)}dispose(){for(const t of this.robots)t.dispose();this.robots=[]}}const or=200,Ju=18;class _S{constructor(t=13150286){this.group=new Oe;const e=new Float32Array(or*3),n=new Float32Array(or),s=new Float32Array(or);this.velocities=[];for(let a=0;a<or;a++){const l=11+Math.random()*Ju,c=Math.random()*Math.PI*2,h=Math.acos(2*Math.random()-1);e[a*3]=l*Math.sin(h)*Math.cos(c),e[a*3+1]=l*Math.sin(h)*Math.sin(c),e[a*3+2]=l*Math.cos(h),n[a]=.1+Math.random()*.4,s[a]=.1+Math.random()*.3,this.velocities.push(new N((Math.random()-.5)*.3,(Math.random()-.5)*.15,(Math.random()-.5)*.3))}const r=new be;r.setAttribute("position",new Fe(e,3)),r.setAttribute("size",new Fe(n,1)),this.material=new Jo({color:new Pt(t),size:.3,transparent:!0,opacity:.2,sizeAttenuation:!0,blending:_n,depthWrite:!1}),this.points=new gc(r,this.material),this.group.add(this.points)}update(t,e){const n=this.points.geometry.attributes.position.array;for(let s=0;s<or;s++){const r=s*3;if(n[r]+=this.velocities[s].x*t,n[r+1]+=this.velocities[s].y*t,n[r+2]+=this.velocities[s].z*t,Math.sqrt(n[r]**2+n[r+1]**2+n[r+2]**2)>11+Ju){const l=11+Math.random()*2,c=Math.random()*Math.PI*2,h=Math.acos(2*Math.random()-1);n[r]=l*Math.sin(h)*Math.cos(c),n[r+1]=l*Math.sin(h)*Math.sin(c),n[r+2]=l*Math.cos(h)}}this.points.geometry.attributes.position.needsUpdate=!0,this.group.rotation.y+=t*.02}dispose(){this.points.geometry.dispose(),this.material.dispose()}}class vS{constructor(t=2228292,e=4456584,n=40){const s=new Pt(t),r=new Pt(e);this.material=new Re({vertexShader:`
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,fragmentShader:`
        ${zn}

        uniform float uTime;
        uniform vec3 uColor1;
        uniform vec3 uColor2;

        varying vec2 vUv;

        void main() {
          vec2 p = (vUv - 0.5) * 2.0;
          float dist = length(p);

          // Circular falloff
          float falloff = smoothstep(1.0, 0.2, dist);

          // Noise layers for volume appearance
          float n1 = fbm(p * 2.0 + uTime * 0.015, 5);
          float n2 = fbm(p * 3.5 - uTime * 0.01, 4);

          float density = (n1 * 0.6 + n2 * 0.4);
          density = pow(density, 1.3);
          density *= falloff;

          vec3 color = mix(uColor1, uColor2, n1);

          // Bright core
          float core = smoothstep(0.5, 0.0, dist) * 0.3;
          color += vec3(core);

          float alpha = density * 0.15;
          if (alpha < 0.005) discard;

          gl_FragColor = vec4(color, alpha);
        }
      `,uniforms:{uTime:{value:0},uColor1:{value:new N(s.r,s.g,s.b)},uColor2:{value:new N(r.r,r.g,r.b)}},transparent:!0,depthWrite:!1,side:Je,blending:_n});const a=new ks(n,n);this.mesh=new Bt(a,this.material),this.mesh.renderOrder=-10}update(t,e){this.material.uniforms.uTime.value=t,this.mesh.lookAt(e.position)}dispose(){this.mesh.geometry.dispose(),this.material.dispose()}}class yS{constructor(t=16755251,e=1){this.group=new Oe,this.intensity=e;const n=new Pt(t);this.centralSprite=this._createGlowSprite(n,8,1),this.group.add(this.centralSprite),this.rings=[];const s=[{color:n.clone().lerp(new Pt(16777215),.3),size:3,offset:12,opacity:.3},{color:n.clone().lerp(new Pt(16729088),.4),size:2,offset:18,opacity:.15},{color:n.clone(),size:1.5,offset:25,opacity:.1}];for(const r of s){const a=this._createGlowSprite(r.color,r.size,r.opacity);a.position.y=r.offset,this.rings.push(a),this.group.add(a)}}_createGlowSprite(t,e,n){const s=document.createElement("canvas");s.width=128,s.height=128;const r=s.getContext("2d"),a=64,l=64,c=r.createRadialGradient(a,l,0,a,l,64);c.addColorStop(0,`rgba(255,255,255,${n})`),c.addColorStop(.15,`rgba(${Math.floor(t.r*255)},${Math.floor(t.g*255)},${Math.floor(t.b*255)},${n*.7})`),c.addColorStop(.5,`rgba(${Math.floor(t.r*255)},${Math.floor(t.g*255)},${Math.floor(t.b*255)},${n*.15})`),c.addColorStop(1,"rgba(0,0,0,0)"),r.fillStyle=c,r.fillRect(0,0,128,128),r.strokeStyle=`rgba(${Math.floor(t.r*255)},${Math.floor(t.g*255)},${Math.floor(t.b*255)},${n*.3})`,r.lineWidth=1;for(let m=0;m<4;m++){const x=m/4*Math.PI;r.beginPath(),r.moveTo(a+Math.cos(x)*10,l+Math.sin(x)*10),r.lineTo(a+Math.cos(x)*60,l+Math.sin(x)*60),r.stroke()}const h=new _c(s),d=new Ko({map:h,transparent:!0,blending:_n,depthWrite:!1,depthTest:!1}),p=new pc(d);return p.scale.setScalar(e),p}update(t,e){const n=.85+Math.sin(e*1.2)*.15;this.centralSprite.scale.setScalar(8*n*this.intensity),new N().subVectors(this.group.getWorldPosition(new N),t.position).normalize();for(let r=0;r<this.rings.length;r++){const a=.7+Math.sin(e*.8+r*1.5)*.3;this.rings[r].scale.setScalar((3-r)*a*this.intensity)}}dispose(){this.group.traverse(t=>{t.isSprite&&(t.material.map.dispose(),t.material.dispose())})}}class xS{constructor(t,e){var a;this.id=t.id,this.def=t,this.group=new Oe,this.group.position.copy(e),this.group.userData.type="solarSystem",this.group.userData.planetId=t.id,this.planet=new oS(t),this.group.add(this.planet.group),this.station=new lS,this.group.add(this.station.group),this.robotManager=new gS,this.group.add(this.robotManager.group),this._lastStationSync=0,this.dustCloud=new _S(t.glow),this.group.add(this.dustCloud.group);const n=((a=t.nebulaPalette)==null?void 0:a.colors)||["#110022","#220044"];this.nebulaVolume=new vS(n[1]||n[0],n[3]||n[1],35),this.nebulaVolume.mesh.position.set(0,0,-20),this.group.add(this.nebulaVolume.mesh),this.lensFlare=null,t.type==="star"&&(this.lensFlare=new yS(t.glow,1),this.group.add(this.lensFlare.group));const s=new Pt(t.glow);this.rimLight=new Ou(s,.8,50,1.5),this.rimLight.position.set(-8,3,12),this.group.add(this.rimLight);const r=s.clone().lerp(new Pt(16777215),.3);this.fillLight=new Ou(r,.3,35,2),this.fillLight.position.set(5,-6,5),this.group.add(this.fillLight),this._createLabel(t.name),this._onRobotsChanged=()=>this._syncRobots(),this._onPlanetChanged=()=>this._syncRobots(),this._onStateLoaded=()=>this._syncRobots(),this._syncRobots(),Mt.on("robotsChanged",this._onRobotsChanged),Mt.on("planetChanged",this._onPlanetChanged),Mt.on("stateLoaded",this._onStateLoaded)}_syncRobots(){const e=Mt.activePlanet===this.id?Mt.robots:0;this.robotManager.syncCount(e)}_createLabel(t){const e=document.createElement("canvas");e.width=256,e.height=64;const n=e.getContext("2d");n.font="bold 32px Orbitron, monospace",n.textAlign="center",n.fillStyle="#c8a84e",n.fillText(t,128,42);const s=new _c(e);s.minFilter=mn;const r=new Ko({map:s,transparent:!0,depthWrite:!1});this.label=new pc(r),this.label.scale.set(12,3,1),this.label.position.set(0,14,0),this.group.add(this.label)}get clickTarget(){return this.planet.clickTarget}get worldPosition(){return this.group.position}updateLOD(t,e,n,s){t<80&&this.planet.update(e);const r=t<60;this.station.group.visible=r,r&&(this.station.update(e),e-this._lastStationSync>.2&&(this._lastStationSync=e,this.robotManager.setStationPosition(this.station.group.position)));const a=t<45;this.robotManager.group.visible=a,a&&n!==void 0&&this.robotManager.update(n,e);const l=t<80;this.dustCloud.group.visible=l,l&&n!==void 0&&this.dustCloud.update(n,e);const c=t<150;if(this.nebulaVolume.mesh.visible=c,c&&s&&this.nebulaVolume.update(e,s),this.lensFlare&&(this.lensFlare.group.visible=t<200,this.lensFlare.group.visible&&s&&this.lensFlare.update(s,e)),this.label.visible=t>15&&t<300,this.label.visible){const h=Math.min(1,t/50);this.label.scale.set(12*h,3*h,1)}this.planet.atmosphereMesh&&(this.planet.atmosphereMesh.visible=t<120),this.planet.ringMesh&&(this.planet.ringMesh.visible=t<100),this.rimLight.visible=t<60,this.fillLight.visible=t<60}dispose(){Mt.off("robotsChanged",this._onRobotsChanged),Mt.off("planetChanged",this._onPlanetChanged),Mt.off("stateLoaded",this._onStateLoaded),this.planet.dispose(),this.station.dispose(),this.robotManager.dispose(),this.dustCloud.dispose(),this.nebulaVolume.dispose(),this.lensFlare&&this.lensFlare.dispose(),this.label&&(this.label.material.map.dispose(),this.label.material.dispose())}}const yo=20,MS=.15;class SS{constructor(t,e,n,s){this.fromId=n,this.toId=s,this.group=new Oe;const r=[t.clone(),e.clone()],a=new be().setFromPoints(r);this.lineMaterial=new mc({color:13150286,transparent:!0,opacity:.15,linewidth:1}),this.line=new fd(a,this.lineMaterial),this.group.add(this.line),this.direction=e.clone().sub(t),this.length=this.direction.length(),this.dirNorm=this.direction.clone().normalize(),this.fromPos=t.clone();const l=new Float32Array(yo*3);this.particleOffsets=new Float32Array(yo);for(let h=0;h<yo;h++){this.particleOffsets[h]=Math.random();const d=t.clone().addScaledVector(this.dirNorm,this.particleOffsets[h]*this.length);l[h*3]=d.x,l[h*3+1]=d.y,l[h*3+2]=d.z}const c=new be;c.setAttribute("position",new Fe(l,3)),this.particleMaterial=new Jo({color:13150286,size:.8,transparent:!0,opacity:.4,sizeAttenuation:!0,blending:_n,depthWrite:!1}),this.particles=new gc(c,this.particleMaterial),this.group.add(this.particles)}update(t,e){const n=this.particles.geometry.attributes.position.array;for(let r=0;r<yo;r++){this.particleOffsets[r]=(this.particleOffsets[r]+t*MS)%1;const a=this.particleOffsets[r],l=this.fromPos.clone().addScaledVector(this.dirNorm,a*this.length);n[r*3]=l.x,n[r*3+1]=l.y,n[r*3+2]=l.z}this.particles.geometry.attributes.position.needsUpdate=!0;const s=e?.35:.12;this.lineMaterial.opacity+=(s-this.lineMaterial.opacity)*.05,this.particleMaterial.opacity=e?.6:.3}dispose(){this.line.geometry.dispose(),this.lineMaterial.dispose(),this.particles.geometry.dispose(),this.particleMaterial.dispose()}}class ES{constructor(){this.group=new Oe,this.systems={},this.hyperlanes=[],this.worldPositions=$M(),this._createSystems(),this._createHyperlanes()}_createSystems(){for(const t of xs){const e=this.worldPositions[t.id],n=new xS(t,e);this.systems[t.id]=n,this.group.add(n.group)}}_createHyperlanes(){for(const[t,e]of WM){const n=this.worldPositions[t],s=this.worldPositions[e];if(n&&s){const r=new SS(n,s,t,e);this.hyperlanes.push(r),this.group.add(r.group)}}}getSystem(t){return this.systems[t]}getPosition(t){return this.worldPositions[t]}getClickTargets(){const t=[];for(const e in this.systems)t.push({mesh:this.systems[e].clickTarget,planetId:e,system:this.systems[e]});return t}update(t,e,n){const s=t.position;for(const a in this.systems){const l=this.systems[a],c=s.distanceTo(l.worldPosition);c>300?(l.group.visible=!0,Math.random()<.1&&l.updateLOD(c,n,e,t)):l.updateLOD(c,n,e,t)}const r=Mt.ownedPlanets;for(const a of this.hyperlanes)if(s.distanceTo(a.fromPos)<250){const c=r.includes(a.fromId)&&r.includes(a.toId);a.update(e,c)}}dispose(){for(const t in this.systems)this.systems[t].dispose();for(const t of this.hyperlanes)t.dispose()}}const vs=512,_i=500;class TS{constructor(t){this.scene=t,this._createStarCubemap(),this._createTwinkleStars(),this._createNebulaBackground(),this.targetPalette=[new N(.02,.08,.1),new N(.04,.1,.2),new N(.06,.16,.27),new N(.1,.33,.47),new N(.13,.53,.67)],this.targetDensity=.55}_createStarCubemap(){const t=[];for(let n=0;n<6;n++){const s=document.createElement("canvas");s.width=vs,s.height=vs;const r=s.getContext("2d");r.fillStyle="#050810",r.fillRect(0,0,vs,vs);const a=400;for(let l=0;l<a;l++){const c=Math.random()*vs,h=Math.random()*vs,d=.3+Math.random()*.7,p=.3+Math.random()*1.2,m=Math.random();let x,S,w;if(m<.2?(x=.6,S=.7,w=1):m<.5?(x=1,S=1,w=.95):m<.8?(x=1,S=.9,w=.7):(x=1,S=.6,w=.4),r.fillStyle=`rgba(${Math.floor(x*255)},${Math.floor(S*255)},${Math.floor(w*255)},${d})`,r.beginPath(),r.arc(c,h,p,0,Math.PI*2),r.fill(),d>.7&&p>.8){const v=r.createRadialGradient(c,h,0,c,h,p*3);v.addColorStop(0,`rgba(${Math.floor(x*255)},${Math.floor(S*255)},${Math.floor(w*255)},0.15)`),v.addColorStop(1,"rgba(0,0,0,0)"),r.fillStyle=v,r.beginPath(),r.arc(c,h,p*3,0,Math.PI*2),r.fill()}}t.push(s)}const e=new cc(t);e.needsUpdate=!0,this.scene.background=e}_createTwinkleStars(){const t=new Float32Array(_i*3),e=new Float32Array(_i*3);this._twinklePhases=new Float32Array(_i),this._twinkleSpeeds=new Float32Array(_i),this._twinkleBaseSizes=new Float32Array(_i);for(let s=0;s<_i;s++){const r=300+Math.random()*500,a=Math.random()*Math.PI*2,l=Math.acos(2*Math.random()-1);t[s*3]=r*Math.sin(l)*Math.cos(a),t[s*3+1]=r*Math.sin(l)*Math.sin(a),t[s*3+2]=r*Math.cos(l);const c=Math.random();c<.25?(e[s*3]=.65,e[s*3+1]=.75,e[s*3+2]=1):c<.55?(e[s*3]=1,e[s*3+1]=.98,e[s*3+2]=.92):c<.8?(e[s*3]=1,e[s*3+1]=.88,e[s*3+2]=.68):(e[s*3]=1,e[s*3+1]=.65,e[s*3+2]=.45),this._twinklePhases[s]=Math.random()*Math.PI*2,this._twinkleSpeeds[s]=1+Math.random()*3,this._twinkleBaseSizes[s]=1+Math.random()*2.5}const n=new be;n.setAttribute("position",new Fe(t,3)),n.setAttribute("color",new Fe(e,3)),this._twinkleSizeAttr=new Fe(new Float32Array(_i),1),n.setAttribute("size",this._twinkleSizeAttr),this._twinkleMaterial=new Jo({size:2,sizeAttenuation:!0,vertexColors:!0,transparent:!0,opacity:.85,blending:_n,depthWrite:!1}),this._twinklePoints=new gc(n,this._twinkleMaterial),this._twinklePoints.renderOrder=-500,this.scene.add(this._twinklePoints)}_createNebulaBackground(){const t=new ks(2,2);this.nebulaMaterial=new Re({vertexShader:`
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position.xy, 0.9999, 1.0);
        }
      `,fragmentShader:`
        ${zn}

        uniform float uTime;
        uniform vec2 uResolution;
        uniform vec3 uPalette[5];
        uniform float uDensity;
        uniform float uOpacity;

        varying vec2 vUv;

        vec3 sampleGradient(float t) {
          t = clamp(t, 0.0, 1.0) * 4.0;
          int idx = int(floor(t));
          float frac = fract(t);
          if (idx >= 4) return uPalette[4];
          return mix(uPalette[idx], uPalette[idx + 1], frac);
        }

        void main() {
          vec2 uv = vUv;
          uv.x *= uResolution.x / uResolution.y;

          // Two noise layers at different scales for more depth
          float n1 = fbm(uv * 2.5 + uTime * 0.008, 5);
          float n2 = fbm(uv * 1.2 - uTime * 0.005, 4);
          float n = n1 * 0.65 + n2 * 0.35;
          n = pow(n, 1.4);

          float d = max(0.0, n - (1.0 - uDensity)) / uDensity;

          vec3 color = sampleGradient(d * 0.85);

          // Subtle bright wisps
          float wisps = pow(fbm(uv * 4.0 + uTime * 0.012, 3), 2.5);
          color += sampleGradient(0.8) * wisps * 0.08;

          // Vignette
          float vig = 1.0 - length(vUv - 0.5) * 0.7;
          vig = clamp(vig, 0.0, 1.0);

          float alpha = d * 0.14 * vig * uOpacity;
          gl_FragColor = vec4(color, alpha);
        }
      `,uniforms:{uTime:{value:0},uResolution:{value:new At(window.innerWidth,window.innerHeight)},uPalette:{value:[new N(.02,.08,.1),new N(.04,.1,.2),new N(.06,.16,.27),new N(.1,.33,.47),new N(.13,.53,.67)]},uDensity:{value:.55},uOpacity:{value:1}},transparent:!0,depthWrite:!1,depthTest:!1,blending:_n}),this.nebulaMesh=new Bt(t,this.nebulaMaterial),this.nebulaMesh.renderOrder=-1e3,this.nebulaMesh.frustumCulled=!1,this.scene.add(this.nebulaMesh)}setPlanetPalette(t){if(!t.nebulaPalette)return;const{colors:e,density:n}=t.nebulaPalette;for(let s=0;s<5&&s<e.length;s++){const r=new Pt(e[s]);this.targetPalette[s].set(r.r,r.g,r.b)}this.targetDensity=n||.55}update(t){this.nebulaMaterial.uniforms.uTime.value=t;const e=this.nebulaMaterial.uniforms.uPalette.value;for(let r=0;r<5;r++)e[r].lerp(this.targetPalette[r],.015);const n=this.nebulaMaterial.uniforms.uDensity;n.value+=(this.targetDensity-n.value)*.015;const s=this._twinkleSizeAttr.array;for(let r=0;r<_i;r++){const a=this._twinklePhases[r],l=this._twinkleSpeeds[r],c=this._twinkleBaseSizes[r],h=.4+.6*(Math.sin(t*l+a)*.5+.5);s[r]=c*h}this._twinkleSizeAttr.needsUpdate=!0}resize(t,e){this.nebulaMaterial.uniforms.uResolution.value.set(t,e)}}const wS=8,Zu=.6;class bS{constructor(t){this.scene=t,this.activeRings=[]}spawn(t,e,n){const s=new Zo(.3,.5,32),r=new $o({color:13150286,transparent:!0,opacity:.8,side:Je,depthWrite:!1,blending:_n}),a=new Bt(s,r);a.position.copy(t),a.lookAt(t.clone().add(e)),this.scene.add(a);const l=this._createNumberSprite(n);l.position.copy(t).add(e.clone().multiplyScalar(.5)),this.scene.add(l);const c={ring:a,sprite:l,age:0,normal:e.clone(),startPos:t.clone()};for(this.activeRings.push(c);this.activeRings.length>wS;){const h=this.activeRings.shift();this.scene.remove(h.ring),this.scene.remove(h.sprite),h.ring.geometry.dispose(),h.ring.material.dispose(),h.sprite.material.map.dispose(),h.sprite.material.dispose()}}_createNumberSprite(t){const e=document.createElement("canvas");e.width=128,e.height=64;const n=e.getContext("2d");n.font="bold 36px Orbitron, monospace",n.textAlign="center",n.fillStyle="#c8a84e",n.fillText("+"+t,64,44);const s=new _c(e);s.minFilter=mn;const r=new Ko({map:s,transparent:!0,depthWrite:!1,depthTest:!1}),a=new pc(r);return a.scale.set(3,1.5,1),a}update(t){for(let e=this.activeRings.length-1;e>=0;e--){const n=this.activeRings[e];if(n.age+=t,n.age>=Zu){this.scene.remove(n.ring),this.scene.remove(n.sprite),n.ring.geometry.dispose(),n.ring.material.dispose(),n.sprite.material.map.dispose(),n.sprite.material.dispose(),this.activeRings.splice(e,1);continue}const s=n.age/Zu,r=1+s*4;n.ring.scale.setScalar(r),n.ring.material.opacity=(1-s)*.8,n.sprite.position.copy(n.startPos).add(n.normal.clone().multiplyScalar(.5+s*3)),n.sprite.material.opacity=1-s}}}function AS(){const i=document.getElementById("game-container"),t=new VM(i),e=new EM,n=new cn(60,window.innerWidth/window.innerHeight,.1,2e3),s=new PM(n,t.domElement);t.setupPostProcessing(e.scene,n);const r=new GM(n,e.scene,t.domElement,s),a=new HM(t,s,e),l=new TS(e.scene);l.setPlanetPalette(Mt.activePlanetDef);const c=new bS(e.scene),h=new ES;e.add(h.group);for(const p of h.getClickTargets())r.addClickable(p.mesh,m=>{const{planetId:x,system:S}=p,w=s.getZoomLevel();if((w==="planet"||w==="close")&&Mt.activePlanet===x){Mt.addOre(Mt.clickPow);const v=m.point,f=m.face?m.face.normal.clone().transformDirection(m.object.matrixWorld).normalize():new N(0,1,0);c.spawn(v,f,Mt.clickPow)}else Mt.ownedPlanets.includes(x)?Mt.switchPlanet(x):Mt.colonizePlanet(x);s.focusOnPosition(S.worldPosition,30)});const d=h.getPosition(Mt.activePlanet);return d&&(s.targetTarget.copy(d),s.target.copy(d),s.spherical.radius=30,s.targetSpherical.radius=30),Mt.on("planetChanged",p=>{const m=h.getPosition(p);m&&s.focusOnPosition(m,30),l.setPlanetPalette(Mt.activePlanetDef)}),Mt.on("planetColonized",p=>{const m=h.getPosition(p);m&&s.focusOnPosition(m,30),l.setPlanetPalette(Mt.activePlanetDef)}),a.onUpdate((p,m)=>{h.update(n,p,m),l.update(m),c.update(p)}),window.addEventListener("resize",()=>{const p=window.innerWidth,m=window.innerHeight;n.aspect=p/m,n.updateProjectionMatrix(),t.resize(p,m),l.resize(p,m)}),a.start(),{sceneManager:e,camera:n,cameraController:s,renderPipeline:t,animationLoop:a,inputManager:r,galaxy:h,skybox:l}}const an=i=>i>=1e12?(i/1e12).toFixed(2)+"T":i>=1e9?(i/1e9).toFixed(2)+"B":i>=1e6?(i/1e6).toFixed(2)+"M":i>=1e3?(i/1e3).toFixed(1)+"K":Math.floor(i)+"";class CS{constructor(t){this.game=t,this.updateTimer=0,this.dom={vOre:document.getElementById("vOre"),rOre:document.getElementById("rOre"),vCrys:document.getElementById("vCrys"),rCrys:document.getElementById("rCrys"),vEnrg:document.getElementById("vEnrg"),rEnrg:document.getElementById("rEnrg"),rcCrys:document.getElementById("rcCrys"),sepCrys:document.getElementById("sepCrys"),rcEnrg:document.getElementById("rcEnrg"),sRob:document.getElementById("sRob"),sWld:document.getElementById("sWld"),sClk:document.getElementById("sClk"),sRate:document.getElementById("sRate"),upgGrid:document.getElementById("upgGrid"),pList:document.getElementById("pList"),toast:document.getElementById("toast"),pdName:document.getElementById("pd-name"),pdType:document.getElementById("pd-type"),pdBonus:document.getElementById("pd-bonus"),galaxyToggle:document.getElementById("galaxyToggle"),leftPanel:document.getElementById("left-panel"),rightPanel:document.getElementById("right-panel"),leftToggle:document.getElementById("left-toggle"),rightToggle:document.getElementById("right-toggle")},this.leftPanelOpen=!0,this.rightPanelOpen=!0,this._setupButtons(),this._setupKeyboard(),this._setupEvents(),this._initialRender(),t.animationLoop.onUpdate(e=>this.update(e))}_setupButtons(){document.getElementById("m1").addEventListener("pointerdown",()=>this._setMult(1)),document.getElementById("m10").addEventListener("pointerdown",()=>this._setMult(10)),document.getElementById("m100").addEventListener("pointerdown",()=>this._setMult(100)),this.dom.galaxyToggle.addEventListener("pointerdown",t=>{t.stopPropagation()}),this.dom.leftToggle.addEventListener("pointerdown",t=>{t.stopPropagation(),this._toggleLeftPanel()}),this.dom.rightToggle.addEventListener("pointerdown",t=>{t.stopPropagation(),this._toggleRightPanel()})}_setupKeyboard(){this._keydownHandler=t=>{t.code==="KeyQ"&&this._toggleLeftPanel(),t.code==="KeyE"&&this._toggleRightPanel()},window.addEventListener("keydown",this._keydownHandler)}dispose(){window.removeEventListener("keydown",this._keydownHandler)}_setupEvents(){Mt.on("crystalUnlocked",()=>{this.dom.rcCrys.style.display="",this.dom.sepCrys.style.display="",this.toast("💎 CRYSTAL EXTRACTION ONLINE")}),Mt.on("energyUnlocked",()=>{this.dom.rcEnrg.style.display="",this.toast("⚡ FUSION REACTOR ONLINE")}),Mt.on("planetColonized",t=>{const e=xs.find(n=>n.id===t);this.toast("🌍 COLONIZED: "+(e?e.name:t)),this._renderPlanetDetail()}),Mt.on("planetChanged",()=>{this._renderPlanetDetail(),this._renderPlanets()}),Mt.on("stateLoaded",()=>{Mt.crystalUnlocked&&(this.dom.rcCrys.style.display="",this.dom.sepCrys.style.display=""),Mt.energyUnlocked&&(this.dom.rcEnrg.style.display=""),this._renderPlanetDetail()})}_initialRender(){if(this._renderUpgrades(),this._renderPlanets(),this._renderPlanetDetail(),Mt._offlineEarnings){const t=Mt._offlineEarnings,e=Math.floor(t.elapsed/3600),n=Math.floor(t.elapsed%3600/60),s=e>0?`${e}h ${n}m`:`${n}m`;this.toast(`OFFLINE ${s}: +${an(t.earned)} ORE`),delete Mt._offlineEarnings}else this.toast("WELCOME, COMMANDER — CLICK THE PLANET")}update(t){this.dom.vOre.textContent=an(Mt.ore),this.dom.rOre.textContent="+"+an(Mt.oreRate)+"/s",Mt.crystalUnlocked&&(this.dom.vCrys.textContent=an(Mt.crystal),this.dom.rCrys.textContent="+"+an(Mt.crystalRate)+"/s"),Mt.energyUnlocked&&(this.dom.vEnrg.textContent=an(Mt.energy),this.dom.rEnrg.textContent="+"+an(Mt.energyRate)+"/s"),this.dom.sRob.textContent=an(Mt.robots),this.dom.sWld.textContent=Mt.ownedPlanets.length,this.dom.sClk.textContent=an(Mt.clickPow),this.dom.sRate.textContent=an(Mt.oreRate),this.updateTimer+=t,this.updateTimer>=.35&&(this.updateTimer=0,this._renderUpgrades(),this._renderPlanets())}_setMult(t){Mt.buyMult=t,[1,10,100].forEach(e=>document.getElementById("m"+e).classList.toggle("on",e===t)),this._renderUpgrades()}_renderPlanetDetail(){const t=Mt.activePlanetDef;this.dom.pdName.textContent=t.name,this.dom.pdType.textContent=t.desc,t.mb>0?this.dom.pdBonus.textContent=`+${(t.mb*100).toFixed(0)}% extraction bonus`:this.dom.pdBonus.textContent="Base extraction rate"}_renderUpgrades(){const t=this.dom.upgGrid;t.innerHTML="";const e=Ka.filter(n=>{const s=Mt.upgradeLevels[n.id]||0;return!(n.max&&s>=n.max||n.effect==="cry"&&Mt.crystalUnlocked||n.effect==="enr"&&Mt.energyUnlocked)});for(const n of e){const s=Mt.upgradeCost(n.id),r=Mt.canAfford(n.id),a=Mt.upgradeLevels[n.id]||0;let l="";s.ore>0&&(l+="⬡"+an(s.ore)),s.crystal>0&&(l+=(l?" ":"")+"◈"+an(s.crystal)),s.mult>1&&(l+=` ×${s.mult}`);const c=document.createElement("div");c.className="upg "+(r?"can":"no"),c.innerHTML=`
        <div class="upg-top">
          <span class="upg-icon">${n.icon}</span>
          <span class="upg-name">${n.name}</span>
          ${a>0?`<span class="upg-lv">LV${a}</span>`:""}
        </div>
        <div class="upg-bottom">
          <span class="upg-desc">${n.desc}</span>
          <span class="upg-cost">${l}</span>
        </div>`,r&&c.addEventListener("pointerdown",h=>{h.stopPropagation(),Mt.buyUpgrade(n.id),this._renderUpgrades()}),t.appendChild(c)}}_renderPlanets(){const t=this.dom.pList;t.innerHTML="",xs.forEach(e=>{const n=Mt.ownedPlanets.includes(e.id),s=Mt.activePlanet===e.id,r=!n&&Mt.ore>=e.cost,a=!n&&!r,l=document.createElement("div");l.className="pl-chip"+(s?" act":r?" buy":a?" lck":""),l.innerHTML=`
        <div class="pl-dot" style="background:radial-gradient(circle at 35% 35%,${e.col}cc,${e.col}44);box-shadow:0 0 12px ${e.glow}44"></div>
        <div style="display:flex;flex-direction:column;gap:2px">
          <span class="pl-name">${e.name}</span>
          ${s?'<span class="pl-status">● ACTIVE</span>':""}
          ${!n&&e.cost>0?`<span class="pl-cost">⬡ ${an(e.cost)}</span>`:""}
          ${n&&!s?`<span class="pl-bonus">+${(e.mb*100).toFixed(0)}%</span>`:""}
        </div>
        ${n?"":'<span class="pl-lock">🔒</span>'}`,n?l.addEventListener("pointerdown",()=>{Mt.switchPlanet(e.id),this.toast("WARPING TO "+e.name)}):r&&l.addEventListener("pointerdown",()=>{Mt.colonizePlanet(e.id)}),t.appendChild(l)})}_toggleLeftPanel(t){const e=t!==void 0?t:!this.leftPanelOpen;this.leftPanelOpen=e,this.dom.leftPanel.classList.toggle("collapsed",!e),this.dom.leftToggle.classList.toggle("panel-hidden",!e),this.dom.leftToggle.innerHTML=e?"&#x25C0;":"&#x25B6;"}_toggleRightPanel(t){const e=t!==void 0?t:!this.rightPanelOpen;this.rightPanelOpen=e,this.dom.rightPanel.classList.toggle("collapsed",!e),this.dom.rightToggle.classList.toggle("panel-hidden",!e),this.dom.rightToggle.innerHTML=e?"&#x25B6;":"&#x25C0;"}toast(t){const e=this.dom.toast;e.textContent=t,e.classList.add("on"),this._toastTimer&&clearTimeout(this._toastTimer),this._toastTimer=setTimeout(()=>e.classList.remove("on"),2600)}}async function RS(){yg();let t=Dd();if(t){Mt.deserialize(t);const n=Mt.applyOfflineEarnings();n&&n.earned>0&&(Mt._offlineEarnings=n)}Ld();const e=AS();new CS(e)}RS();
