(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function e(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(s){if(s.ep)return;s.ep=!0;const r=e(s);fetch(s.href,r)}})();const qi=[{id:"xerion",name:"XERION",col:"#1a6fff",glow:"#4499ff",type:"terr",cost:0,desc:"Home world. Rich in ore.",mb:0,orbit:{radius:120,speed:.022,inclination:.02,phase:0},nebulaPalette:{colors:["#020810","#0a1a33","#102844","#1a5577","#2288aa"],density:.55,seed:42}},{id:"drakon",name:"DRAKON",col:"#cc3300",glow:"#ff6633",type:"lava",cost:500,desc:"Volcanic. High-temp deposits.",mb:.4,orbit:{radius:220,speed:.015,inclination:.04,phase:2.1},nebulaPalette:{colors:["#0a0200","#331000","#662200","#994422","#cc7744"],density:.6,seed:137}},{id:"crystara",name:"CRYSTARA",col:"#aa44ff",glow:"#cc88ff",type:"cryst",cost:2500,desc:"Crystal-rich atmosphere.",mb:.8,orbit:{radius:340,speed:.011,inclination:.06,phase:4.4},nebulaPalette:{colors:["#06000e","#1a0033","#3d1166","#6633aa","#9955dd"],density:.6,seed:271}},{id:"voltara",name:"VOLTARA",col:"#ffcc00",glow:"#ffee66",type:"gas",cost:12e3,desc:"Gas giant. Limitless energy.",mb:1.5,orbit:{radius:480,speed:.008,inclination:.03,phase:1},nebulaPalette:{colors:["#050300","#1a0e00","#33220a","#664411","#aa7733"],density:.55,seed:389}},{id:"glacius",name:"GLACIUS",col:"#88ddff",glow:"#aaeeff",type:"ice",cost:6e4,desc:"Frozen. Dense crystal matrix.",mb:2.5,orbit:{radius:650,speed:.006,inclination:.05,phase:3.3},nebulaPalette:{colors:["#000508","#051520","#0a2a40","#1a5570","#338899"],density:.5,seed:503}},{id:"nebulox",name:"NEBULOX",col:"#ff44aa",glow:"#ff88cc",type:"neb",cost:3e5,desc:"Nebula core. Exotic matter.",mb:5,orbit:{radius:850,speed:.0045,inclination:.07,phase:5.5},nebulaPalette:{colors:["#0a0006","#2a0022","#551144","#882266","#cc4499"],density:.7,seed:617}},{id:"solaris",name:"SOLARIS",col:"#ff8800",glow:"#ffaa33",type:"star",cost:15e5,desc:"Star fragment. Pure energy.",mb:12,orbit:{radius:1100,speed:.003,inclination:.04,phase:.7},nebulaPalette:{colors:["#080200","#221000","#552200","#884400","#cc6600"],density:.65,seed:739}},{id:"voidex",name:"VOIDEX",col:"#880088",glow:"#bb44bb",type:"void",cost:8e6,desc:"Void matter. Dimensional ore.",mb:30,orbit:{radius:1400,speed:.002,inclination:.09,phase:3.8},nebulaPalette:{colors:["#020008","#0a0022","#1a0044","#2a0066","#440088"],density:.6,seed:853}}],nl={terr:["#88ddff","#3388ee","#1a55cc","#0a2266"],lava:["#ffcc66","#ff5522","#cc2200","#551100"],cryst:["#ffbbff","#dd66ff","#9933cc","#440066"],gas:["#ffff99","#ffcc33","#ee8800","#553300"],ice:["#ffffff","#cceeff","#66bbee","#113366"],neb:["#ffaadd","#ff5599","#cc2266","#330022"],star:["#ffffee","#ffee66","#ffaa22","#663300"],void:["#dd66ee","#9933bb","#553388","#110022"]},Fo=[{id:"d1",cat:"robots",icon:"🤖",name:"DRONE MK.I",desc:"+1 drone",oreCost:10,crystalCost:0,effect:"rob",amt:1,max:null},{id:"d2",cat:"mining",icon:"⚙️",name:"DRILL MK.II",desc:"+5 drones",oreCost:80,crystalCost:0,effect:"rob",amt:5,max:null},{id:"d3",cat:"robots",icon:"🦾",name:"MECH DRILL",desc:"+25 drones",oreCost:500,crystalCost:0,effect:"rob",amt:25,max:null},{id:"a1",cat:"mining",icon:"🔄",name:"AUTO-MINE",desc:"+2 ore/s passive",oreCost:200,crystalCost:0,effect:"aut",amt:2,max:null},{id:"e1",cat:"mining",icon:"📡",name:"EFFICIENCY+",desc:"All rates ×1.5",oreCost:1e3,crystalCost:5,effect:"eff",amt:.5,max:null},{id:"q1",cat:"tech",icon:"🌀",name:"QUANTUM CORE",desc:"All rates ×2",oreCost:5e3,crystalCost:20,effect:"eff",amt:1,max:null},{id:"sw",cat:"robots",icon:"🚀",name:"DRONE SWARM",desc:"+50 drones",oreCost:3e3,crystalCost:10,effect:"rob",amt:50,max:null},{id:"dk",cat:"tech",icon:"💎",name:"DARK ORE",desc:"Unlock crystals",oreCost:2e3,crystalCost:0,effect:"cry",amt:1,max:1},{id:"fu",cat:"tech",icon:"🔥",name:"FUSION CORE",desc:"Unlock energy",oreCost:8e3,crystalCost:50,effect:"enr",amt:1,max:1},{id:"mg",cat:"robots",icon:"🏭",name:"MEGA ARRAY",desc:"+200 drones",oreCost:2e4,crystalCost:100,effect:"rob",amt:200,max:null}],nh=1.15;class Kf{constructor(){this._listeners={}}on(t,e){var n;((n=this._listeners)[t]||(n[t]=[])).push(e)}off(t,e){const n=this._listeners[t];n&&(this._listeners[t]=n.filter(s=>s!==e))}emit(t,e){(this._listeners[t]||[]).forEach(n=>n(e))}}class Jf extends Kf{constructor(){super(),this.ore=0,this.crystal=0,this.energy=0,this.robots=0,this.clickPow=1,this.autoRate=0,this.effMult=1,this.crystalUnlocked=!1,this.energyUnlocked=!1,this.ownedPlanets=["xerion"],this.activePlanet="xerion",this.upgradeLevels={},this.buyMult=1,this.lastSaved=Date.now()}reset(){this.ore=0,this.crystal=0,this.energy=0,this.robots=0,this.clickPow=1,this.autoRate=0,this.effMult=1,this.crystalUnlocked=!1,this.energyUnlocked=!1,this.ownedPlanets=["xerion"],this.activePlanet="xerion",this.upgradeLevels={},this.buyMult=1,this.lastSaved=Date.now(),this.emit("stateLoaded"),this.emit("robotsChanged",0)}get activePlanetDef(){return qi.find(t=>t.id===this.activePlanet)||qi[0]}get planetMultiplier(){return 1+(this.activePlanetDef.mb||0)}get oreRate(){return this.robots*.5*this.effMult*this.planetMultiplier+this.autoRate}get crystalRate(){return this.crystalUnlocked?this.robots*.05*this.effMult*this.planetMultiplier:0}get energyRate(){return this.energyUnlocked?this.robots*.02*this.effMult*this.planetMultiplier:0}tick(t){this.ore+=this.oreRate*t,this.crystal+=this.crystalRate*t,this.energy+=this.energyRate*t}addOre(t){this.ore+=t}upgradeCost(t){const e=Fo.find(a=>a.id===t);if(!e)return null;const n=this.upgradeLevels[t]||0,r=e.effect==="cry"||e.effect==="enr"?1:this.buyMult;return{ore:Math.floor(e.oreCost*Math.pow(nh,n)*r),crystal:Math.floor(e.crystalCost*Math.pow(nh,n)*r),mult:r}}canAfford(t){const e=this.upgradeCost(t);return e?this.ore>=e.ore&&this.crystal>=e.crystal:!1}buyUpgrade(t){const e=Fo.find(l=>l.id===t);if(!e)return!1;const n=this.upgradeCost(t);if(!n||this.ore<n.ore||this.crystal<n.crystal)return!1;const s=this.upgradeLevels[t]||0;if(e.max&&s>=e.max)return!1;this.ore-=n.ore,this.crystal-=n.crystal,this.upgradeLevels[t]=s+1;const a=e.effect==="cry"||e.effect==="enr"?1:this.buyMult;switch(e.effect){case"rob":this.robots+=e.amt*a,this.emit("robotsChanged",this.robots);break;case"aut":this.autoRate+=e.amt*a;break;case"eff":this.effMult+=e.amt*a;break;case"cry":this.crystalUnlocked=!0,this.emit("crystalUnlocked");break;case"enr":this.energyUnlocked=!0,this.emit("energyUnlocked");break}return this.emit("upgradeBought",t),!0}colonizePlanet(t){const e=qi.find(n=>n.id===t);return!e||this.ownedPlanets.includes(t)||this.ore<e.cost?!1:(this.ore-=e.cost,this.ownedPlanets.push(t),this.activePlanet=t,this.emit("planetColonized",t),!0)}switchPlanet(t){return this.ownedPlanets.includes(t)?(this.activePlanet=t,this.emit("planetChanged",t),!0):!1}serialize(){return{ore:this.ore,crystal:this.crystal,energy:this.energy,robots:this.robots,clickPow:this.clickPow,autoRate:this.autoRate,effMult:this.effMult,cryUnlocked:this.crystalUnlocked,enrUnlocked:this.energyUnlocked,ownedPlanets:this.ownedPlanets,activePlanet:this.activePlanet,upgradeLevels:this.upgradeLevels,lastSaved:Date.now()}}deserialize(t){t&&(this.ore=t.ore??0,this.crystal=t.crystal??0,this.energy=t.energy??0,this.robots=t.robots??0,this.clickPow=t.clickPow??1,this.autoRate=t.autoRate??0,this.effMult=t.effMult??1,this.crystalUnlocked=t.cryUnlocked??!1,this.energyUnlocked=t.enrUnlocked??!1,this.ownedPlanets=t.ownedPlanets??["xerion"],this.activePlanet=t.activePlanet??"xerion",this.upgradeLevels=t.upgradeLevels??{},this.lastSaved=t.lastSaved??Date.now(),this.emit("stateLoaded"),this.emit("robotsChanged",this.robots),this.crystalUnlocked&&this.emit("crystalUnlocked"),this.energyUnlocked&&this.emit("energyUnlocked"))}applyOfflineEarnings(){const t=Math.min((Date.now()-this.lastSaved)/1e3,28800);if(t>10){const e=this.oreRate*t*.5,n=this.crystalRate*t*.5,s=this.energyRate*t*.5;return this.ore+=e,this.crystal+=n,this.energy+=s,{elapsed:t,earned:e,crystalEarned:n,energyEarned:s}}return null}}const Ct=new Jf,Ql="astro_save";function qr(){try{const i=Ct.serialize();localStorage.setItem(Ql,JSON.stringify(i))}catch(i){console.warn("LocalStorage save failed:",i)}}function Zf(){try{const i=localStorage.getItem(Ql);if(i)return JSON.parse(i)}catch(i){console.warn("LocalStorage load failed:",i)}return null}function ih(){return!!localStorage.getItem(Ql)}let fa=null;function Qf(i=1e4){fa&&clearInterval(fa),fa=setInterval(qr,i),Ct.on("upgradeBought",qr),Ct.on("planetColonized",qr),document.addEventListener("visibilitychange",()=>{document.visibilityState==="hidden"&&qr()})}const tp=()=>{};var sh={};/**
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
 */const yd=function(i){const t=[];let e=0;for(let n=0;n<i.length;n++){let s=i.charCodeAt(n);s<128?t[e++]=s:s<2048?(t[e++]=s>>6|192,t[e++]=s&63|128):(s&64512)===55296&&n+1<i.length&&(i.charCodeAt(n+1)&64512)===56320?(s=65536+((s&1023)<<10)+(i.charCodeAt(++n)&1023),t[e++]=s>>18|240,t[e++]=s>>12&63|128,t[e++]=s>>6&63|128,t[e++]=s&63|128):(t[e++]=s>>12|224,t[e++]=s>>6&63|128,t[e++]=s&63|128)}return t},ep=function(i){const t=[];let e=0,n=0;for(;e<i.length;){const s=i[e++];if(s<128)t[n++]=String.fromCharCode(s);else if(s>191&&s<224){const r=i[e++];t[n++]=String.fromCharCode((s&31)<<6|r&63)}else if(s>239&&s<365){const r=i[e++],a=i[e++],l=i[e++],c=((s&7)<<18|(r&63)<<12|(a&63)<<6|l&63)-65536;t[n++]=String.fromCharCode(55296+(c>>10)),t[n++]=String.fromCharCode(56320+(c&1023))}else{const r=i[e++],a=i[e++];t[n++]=String.fromCharCode((s&15)<<12|(r&63)<<6|a&63)}}return t.join("")},xd={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(i,t){if(!Array.isArray(i))throw Error("encodeByteArray takes an array as a parameter");this.init_();const e=t?this.byteToCharMapWebSafe_:this.byteToCharMap_,n=[];for(let s=0;s<i.length;s+=3){const r=i[s],a=s+1<i.length,l=a?i[s+1]:0,c=s+2<i.length,h=c?i[s+2]:0,d=r>>2,p=(r&3)<<4|l>>4;let m=(l&15)<<2|h>>6,y=h&63;c||(y=64,a||(m=64)),n.push(e[d],e[p],e[m],e[y])}return n.join("")},encodeString(i,t){return this.HAS_NATIVE_SUPPORT&&!t?btoa(i):this.encodeByteArray(yd(i),t)},decodeString(i,t){return this.HAS_NATIVE_SUPPORT&&!t?atob(i):ep(this.decodeStringToByteArray(i,t))},decodeStringToByteArray(i,t){this.init_();const e=t?this.charToByteMapWebSafe_:this.charToByteMap_,n=[];for(let s=0;s<i.length;){const r=e[i.charAt(s++)],l=s<i.length?e[i.charAt(s)]:0;++s;const h=s<i.length?e[i.charAt(s)]:64;++s;const p=s<i.length?e[i.charAt(s)]:64;if(++s,r==null||l==null||h==null||p==null)throw new np;const m=r<<2|l>>4;if(n.push(m),h!==64){const y=l<<4&240|h>>2;if(n.push(y),p!==64){const M=h<<6&192|p;n.push(M)}}}return n},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let i=0;i<this.ENCODED_VALS.length;i++)this.byteToCharMap_[i]=this.ENCODED_VALS.charAt(i),this.charToByteMap_[this.byteToCharMap_[i]]=i,this.byteToCharMapWebSafe_[i]=this.ENCODED_VALS_WEBSAFE.charAt(i),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[i]]=i,i>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(i)]=i,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(i)]=i)}}};class np extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const ip=function(i){const t=yd(i);return xd.encodeByteArray(t,!0)},Md=function(i){return ip(i).replace(/\./g,"")},Sd=function(i){try{return xd.decodeString(i,!0)}catch(t){console.error("base64Decode failed: ",t)}return null};/**
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
 */function sp(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
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
 */const rp=()=>sp().__FIREBASE_DEFAULTS__,op=()=>{if(typeof process>"u"||typeof sh>"u")return;const i=sh.__FIREBASE_DEFAULTS__;if(i)return JSON.parse(i)},ap=()=>{if(typeof document>"u")return;let i;try{i=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const t=i&&Sd(i[1]);return t&&JSON.parse(t)},lp=()=>{try{return tp()||rp()||op()||ap()}catch(i){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${i}`);return}},cp=i=>{var t;return(t=lp())===null||t===void 0?void 0:t[`_${i}`]};/**
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
 */function Ed(i){try{return(i.startsWith("http://")||i.startsWith("https://")?new URL(i).hostname:i).endsWith(".cloudworkstations.dev")}catch{return!1}}/**
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
 */function zn(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function hp(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(zn())}function up(){return typeof navigator<"u"&&navigator.userAgent==="Cloudflare-Workers"}function dp(){const i=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof i=="object"&&i.id!==void 0}function fp(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function pp(){try{return typeof indexedDB=="object"}catch{return!1}}function mp(){return new Promise((i,t)=>{try{let e=!0;const n="validate-browser-context-for-indexeddb-analytics-module",s=self.indexedDB.open(n);s.onsuccess=()=>{s.result.close(),e||self.indexedDB.deleteDatabase(n),i(!0)},s.onupgradeneeded=()=>{e=!1},s.onerror=()=>{var r;t(((r=s.error)===null||r===void 0?void 0:r.message)||"")}}catch(e){t(e)}})}/**
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
 */const gp="FirebaseError";class wi extends Error{constructor(t,e,n){super(e),this.code=t,this.customData=n,this.name=gp,Object.setPrototypeOf(this,wi.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,Rr.prototype.create)}}class Rr{constructor(t,e,n){this.service=t,this.serviceName=e,this.errors=n}create(t,...e){const n=e[0]||{},s=`${this.service}/${t}`,r=this.errors[t],a=r?_p(r,n):"Error",l=`${this.serviceName}: ${a} (${s}).`;return new wi(s,l,n)}}function _p(i,t){return i.replace(vp,(e,n)=>{const s=t[n];return s!=null?String(s):`<${n}?>`})}const vp=/\{\$([^}]+)}/g;/**
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
 */function bd(i){const t=[];for(const[e,n]of Object.entries(i))Array.isArray(n)?n.forEach(s=>{t.push(encodeURIComponent(e)+"="+encodeURIComponent(s))}):t.push(encodeURIComponent(e)+"="+encodeURIComponent(n));return t.length?"&"+t.join("&"):""}function yp(i,t){const e=new xp(i,t);return e.subscribe.bind(e)}class xp{constructor(t,e){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=e,this.task.then(()=>{t(this)}).catch(n=>{this.error(n)})}next(t){this.forEachObserver(e=>{e.next(t)})}error(t){this.forEachObserver(e=>{e.error(t)}),this.close(t)}complete(){this.forEachObserver(t=>{t.complete()}),this.close()}subscribe(t,e,n){let s;if(t===void 0&&e===void 0&&n===void 0)throw new Error("Missing Observer.");Mp(t,["next","error","complete"])?s=t:s={next:t,error:e,complete:n},s.next===void 0&&(s.next=pa),s.error===void 0&&(s.error=pa),s.complete===void 0&&(s.complete=pa);const r=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?s.error(this.finalError):s.complete()}catch{}}),this.observers.push(s),r}unsubscribeOne(t){this.observers===void 0||this.observers[t]===void 0||(delete this.observers[t],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(t){if(!this.finalized)for(let e=0;e<this.observers.length;e++)this.sendOne(e,t)}sendOne(t,e){this.task.then(()=>{if(this.observers!==void 0&&this.observers[t]!==void 0)try{e(this.observers[t])}catch(n){typeof console<"u"&&console.error&&console.error(n)}})}close(t){this.finalized||(this.finalized=!0,t!==void 0&&(this.finalError=t),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function Mp(i,t){if(typeof i!="object"||i===null)return!1;for(const e of t)if(e in i&&typeof i[e]=="function")return!0;return!1}function pa(){}/**
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
 */function Ko(i){return i&&i._delegate?i._delegate:i}class Ns{constructor(t,e,n){this.name=t,this.instanceFactory=e,this.type=n,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(t){return this.instantiationMode=t,this}setMultipleInstances(t){return this.multipleInstances=t,this}setServiceProps(t){return this.serviceProps=t,this}setInstanceCreatedCallback(t){return this.onInstanceCreated=t,this}}/**
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
 */var de;(function(i){i[i.DEBUG=0]="DEBUG",i[i.VERBOSE=1]="VERBOSE",i[i.INFO=2]="INFO",i[i.WARN=3]="WARN",i[i.ERROR=4]="ERROR",i[i.SILENT=5]="SILENT"})(de||(de={}));const Sp={debug:de.DEBUG,verbose:de.VERBOSE,info:de.INFO,warn:de.WARN,error:de.ERROR,silent:de.SILENT},Ep=de.INFO,bp={[de.DEBUG]:"log",[de.VERBOSE]:"log",[de.INFO]:"info",[de.WARN]:"warn",[de.ERROR]:"error"},wp=(i,t,...e)=>{if(t<i.logLevel)return;const n=new Date().toISOString(),s=bp[t];if(s)console[s](`[${n}]  ${i.name}:`,...e);else throw new Error(`Attempted to log a message with an invalid logType (value: ${t})`)};class tc{constructor(t){this.name=t,this._logLevel=Ep,this._logHandler=wp,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(t){if(!(t in de))throw new TypeError(`Invalid value "${t}" assigned to \`logLevel\``);this._logLevel=t}setLogLevel(t){this._logLevel=typeof t=="string"?Sp[t]:t}get logHandler(){return this._logHandler}set logHandler(t){if(typeof t!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=t}get userLogHandler(){return this._userLogHandler}set userLogHandler(t){this._userLogHandler=t}debug(...t){this._userLogHandler&&this._userLogHandler(this,de.DEBUG,...t),this._logHandler(this,de.DEBUG,...t)}log(...t){this._userLogHandler&&this._userLogHandler(this,de.VERBOSE,...t),this._logHandler(this,de.VERBOSE,...t)}info(...t){this._userLogHandler&&this._userLogHandler(this,de.INFO,...t),this._logHandler(this,de.INFO,...t)}warn(...t){this._userLogHandler&&this._userLogHandler(this,de.WARN,...t),this._logHandler(this,de.WARN,...t)}error(...t){this._userLogHandler&&this._userLogHandler(this,de.ERROR,...t),this._logHandler(this,de.ERROR,...t)}}const Tp=(i,t)=>t.some(e=>i instanceof e);let rh,oh;function Ap(){return rh||(rh=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function Cp(){return oh||(oh=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const wd=new WeakMap,il=new WeakMap,Td=new WeakMap,ma=new WeakMap,ec=new WeakMap;function Rp(i){const t=new Promise((e,n)=>{const s=()=>{i.removeEventListener("success",r),i.removeEventListener("error",a)},r=()=>{e(Mi(i.result)),s()},a=()=>{n(i.error),s()};i.addEventListener("success",r),i.addEventListener("error",a)});return t.then(e=>{e instanceof IDBCursor&&wd.set(e,i)}).catch(()=>{}),ec.set(t,i),t}function Pp(i){if(il.has(i))return;const t=new Promise((e,n)=>{const s=()=>{i.removeEventListener("complete",r),i.removeEventListener("error",a),i.removeEventListener("abort",a)},r=()=>{e(),s()},a=()=>{n(i.error||new DOMException("AbortError","AbortError")),s()};i.addEventListener("complete",r),i.addEventListener("error",a),i.addEventListener("abort",a)});il.set(i,t)}let sl={get(i,t,e){if(i instanceof IDBTransaction){if(t==="done")return il.get(i);if(t==="objectStoreNames")return i.objectStoreNames||Td.get(i);if(t==="store")return e.objectStoreNames[1]?void 0:e.objectStore(e.objectStoreNames[0])}return Mi(i[t])},set(i,t,e){return i[t]=e,!0},has(i,t){return i instanceof IDBTransaction&&(t==="done"||t==="store")?!0:t in i}};function Ip(i){sl=i(sl)}function Dp(i){return i===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(t,...e){const n=i.call(ga(this),t,...e);return Td.set(n,t.sort?t.sort():[t]),Mi(n)}:Cp().includes(i)?function(...t){return i.apply(ga(this),t),Mi(wd.get(this))}:function(...t){return Mi(i.apply(ga(this),t))}}function Lp(i){return typeof i=="function"?Dp(i):(i instanceof IDBTransaction&&Pp(i),Tp(i,Ap())?new Proxy(i,sl):i)}function Mi(i){if(i instanceof IDBRequest)return Rp(i);if(ma.has(i))return ma.get(i);const t=Lp(i);return t!==i&&(ma.set(i,t),ec.set(t,i)),t}const ga=i=>ec.get(i);function Up(i,t,{blocked:e,upgrade:n,blocking:s,terminated:r}={}){const a=indexedDB.open(i,t),l=Mi(a);return n&&a.addEventListener("upgradeneeded",c=>{n(Mi(a.result),c.oldVersion,c.newVersion,Mi(a.transaction),c)}),e&&a.addEventListener("blocked",c=>e(c.oldVersion,c.newVersion,c)),l.then(c=>{r&&c.addEventListener("close",()=>r()),s&&c.addEventListener("versionchange",h=>s(h.oldVersion,h.newVersion,h))}).catch(()=>{}),l}const Np=["get","getKey","getAll","getAllKeys","count"],Op=["put","add","delete","clear"],_a=new Map;function ah(i,t){if(!(i instanceof IDBDatabase&&!(t in i)&&typeof t=="string"))return;if(_a.get(t))return _a.get(t);const e=t.replace(/FromIndex$/,""),n=t!==e,s=Op.includes(e);if(!(e in(n?IDBIndex:IDBObjectStore).prototype)||!(s||Np.includes(e)))return;const r=async function(a,...l){const c=this.transaction(a,s?"readwrite":"readonly");let h=c.store;return n&&(h=h.index(l.shift())),(await Promise.all([h[e](...l),s&&c.done]))[0]};return _a.set(t,r),r}Ip(i=>({...i,get:(t,e,n)=>ah(t,e)||i.get(t,e,n),has:(t,e)=>!!ah(t,e)||i.has(t,e)}));/**
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
 */class Fp{constructor(t){this.container=t}getPlatformInfoString(){return this.container.getProviders().map(e=>{if(Bp(e)){const n=e.getImmediate();return`${n.library}/${n.version}`}else return null}).filter(e=>e).join(" ")}}function Bp(i){const t=i.getComponent();return(t==null?void 0:t.type)==="VERSION"}const rl="@firebase/app",lh="0.13.2";/**
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
 */const si=new tc("@firebase/app"),kp="@firebase/app-compat",zp="@firebase/analytics-compat",Vp="@firebase/analytics",Gp="@firebase/app-check-compat",Hp="@firebase/app-check",Wp="@firebase/auth",Xp="@firebase/auth-compat",qp="@firebase/database",jp="@firebase/data-connect",$p="@firebase/database-compat",Yp="@firebase/functions",Kp="@firebase/functions-compat",Jp="@firebase/installations",Zp="@firebase/installations-compat",Qp="@firebase/messaging",tm="@firebase/messaging-compat",em="@firebase/performance",nm="@firebase/performance-compat",im="@firebase/remote-config",sm="@firebase/remote-config-compat",rm="@firebase/storage",om="@firebase/storage-compat",am="@firebase/firestore",lm="@firebase/ai",cm="@firebase/firestore-compat",hm="firebase",um="11.10.0",dm={[rl]:"fire-core",[kp]:"fire-core-compat",[Vp]:"fire-analytics",[zp]:"fire-analytics-compat",[Hp]:"fire-app-check",[Gp]:"fire-app-check-compat",[Wp]:"fire-auth",[Xp]:"fire-auth-compat",[qp]:"fire-rtdb",[jp]:"fire-data-connect",[$p]:"fire-rtdb-compat",[Yp]:"fire-fn",[Kp]:"fire-fn-compat",[Jp]:"fire-iid",[Zp]:"fire-iid-compat",[Qp]:"fire-fcm",[tm]:"fire-fcm-compat",[em]:"fire-perf",[nm]:"fire-perf-compat",[im]:"fire-rc",[sm]:"fire-rc-compat",[rm]:"fire-gcs",[om]:"fire-gcs-compat",[am]:"fire-fst",[cm]:"fire-fst-compat",[lm]:"fire-vertex","fire-js":"fire-js",[hm]:"fire-js-all"};/**
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
 */const fm=new Map,pm=new Map,ch=new Map;function hh(i,t){try{i.container.addComponent(t)}catch(e){si.debug(`Component ${t.name} failed to register with FirebaseApp ${i.name}`,e)}}function Os(i){const t=i.name;if(ch.has(t))return si.debug(`There were multiple attempts to register component ${t}.`),!1;ch.set(t,i);for(const e of fm.values())hh(e,i);for(const e of pm.values())hh(e,i);return!0}function Bi(i){return i==null?!1:i.settings!==void 0}/**
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
 */const mm={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},nc=new Rr("app","Firebase",mm);/**
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
 */const Jo=um;function Si(i,t,e){var n;let s=(n=dm[i])!==null&&n!==void 0?n:i;e&&(s+=`-${e}`);const r=s.match(/\s|\//),a=t.match(/\s|\//);if(r||a){const l=[`Unable to register library "${s}" with version "${t}":`];r&&l.push(`library name "${s}" contains illegal characters (whitespace or "/")`),r&&a&&l.push("and"),a&&l.push(`version name "${t}" contains illegal characters (whitespace or "/")`),si.warn(l.join(" "));return}Os(new Ns(`${s}-version`,()=>({library:s,version:t}),"VERSION"))}/**
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
 */const gm="firebase-heartbeat-database",_m=1,wr="firebase-heartbeat-store";let va=null;function Ad(){return va||(va=Up(gm,_m,{upgrade:(i,t)=>{switch(t){case 0:try{i.createObjectStore(wr)}catch(e){console.warn(e)}}}}).catch(i=>{throw nc.create("idb-open",{originalErrorMessage:i.message})})),va}async function vm(i){try{const e=(await Ad()).transaction(wr),n=await e.objectStore(wr).get(Cd(i));return await e.done,n}catch(t){if(t instanceof wi)si.warn(t.message);else{const e=nc.create("idb-get",{originalErrorMessage:t==null?void 0:t.message});si.warn(e.message)}}}async function uh(i,t){try{const n=(await Ad()).transaction(wr,"readwrite");await n.objectStore(wr).put(t,Cd(i)),await n.done}catch(e){if(e instanceof wi)si.warn(e.message);else{const n=nc.create("idb-set",{originalErrorMessage:e==null?void 0:e.message});si.warn(n.message)}}}function Cd(i){return`${i.name}!${i.options.appId}`}/**
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
 */const ym=1024,xm=30;class Mm{constructor(t){this.container=t,this._heartbeatsCache=null;const e=this.container.getProvider("app").getImmediate();this._storage=new Em(e),this._heartbeatsCachePromise=this._storage.read().then(n=>(this._heartbeatsCache=n,n))}async triggerHeartbeat(){var t,e;try{const s=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),r=dh();if(((t=this._heartbeatsCache)===null||t===void 0?void 0:t.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===r||this._heartbeatsCache.heartbeats.some(a=>a.date===r))return;if(this._heartbeatsCache.heartbeats.push({date:r,agent:s}),this._heartbeatsCache.heartbeats.length>xm){const a=bm(this._heartbeatsCache.heartbeats);this._heartbeatsCache.heartbeats.splice(a,1)}return this._storage.overwrite(this._heartbeatsCache)}catch(n){si.warn(n)}}async getHeartbeatsHeader(){var t;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((t=this._heartbeatsCache)===null||t===void 0?void 0:t.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const e=dh(),{heartbeatsToSend:n,unsentEntries:s}=Sm(this._heartbeatsCache.heartbeats),r=Md(JSON.stringify({version:2,heartbeats:n}));return this._heartbeatsCache.lastSentHeartbeatDate=e,s.length>0?(this._heartbeatsCache.heartbeats=s,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),r}catch(e){return si.warn(e),""}}}function dh(){return new Date().toISOString().substring(0,10)}function Sm(i,t=ym){const e=[];let n=i.slice();for(const s of i){const r=e.find(a=>a.agent===s.agent);if(r){if(r.dates.push(s.date),fh(e)>t){r.dates.pop();break}}else if(e.push({agent:s.agent,dates:[s.date]}),fh(e)>t){e.pop();break}n=n.slice(1)}return{heartbeatsToSend:e,unsentEntries:n}}class Em{constructor(t){this.app=t,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return pp()?mp().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const e=await vm(this.app);return e!=null&&e.heartbeats?e:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(t){var e;if(await this._canUseIndexedDBPromise){const s=await this.read();return uh(this.app,{lastSentHeartbeatDate:(e=t.lastSentHeartbeatDate)!==null&&e!==void 0?e:s.lastSentHeartbeatDate,heartbeats:t.heartbeats})}else return}async add(t){var e;if(await this._canUseIndexedDBPromise){const s=await this.read();return uh(this.app,{lastSentHeartbeatDate:(e=t.lastSentHeartbeatDate)!==null&&e!==void 0?e:s.lastSentHeartbeatDate,heartbeats:[...s.heartbeats,...t.heartbeats]})}else return}}function fh(i){return Md(JSON.stringify({version:2,heartbeats:i})).length}function bm(i){if(i.length===0)return-1;let t=0,e=i[0].date;for(let n=1;n<i.length;n++)i[n].date<e&&(e=i[n].date,t=n);return t}/**
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
 */function wm(i){Os(new Ns("platform-logger",t=>new Fp(t),"PRIVATE")),Os(new Ns("heartbeat",t=>new Mm(t),"PRIVATE")),Si(rl,lh,i),Si(rl,lh,"esm2017"),Si("fire-js","")}wm("");var Tm="firebase",Am="11.10.0";/**
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
 */Si(Tm,Am,"app");function Rd(i,t){var e={};for(var n in i)Object.prototype.hasOwnProperty.call(i,n)&&t.indexOf(n)<0&&(e[n]=i[n]);if(i!=null&&typeof Object.getOwnPropertySymbols=="function")for(var s=0,n=Object.getOwnPropertySymbols(i);s<n.length;s++)t.indexOf(n[s])<0&&Object.prototype.propertyIsEnumerable.call(i,n[s])&&(e[n[s]]=i[n[s]]);return e}function Pd(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}const Cm=Pd,Id=new Rr("auth","Firebase",Pd());/**
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
 */const Bo=new tc("@firebase/auth");function Rm(i,...t){Bo.logLevel<=de.WARN&&Bo.warn(`Auth (${Jo}): ${i}`,...t)}function Co(i,...t){Bo.logLevel<=de.ERROR&&Bo.error(`Auth (${Jo}): ${i}`,...t)}/**
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
 */function ph(i,...t){throw ic(i,...t)}function Dd(i,...t){return ic(i,...t)}function Ld(i,t,e){const n=Object.assign(Object.assign({},Cm()),{[t]:e});return new Rr("auth","Firebase",n).create(t,{appName:i.name})}function Ro(i){return Ld(i,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function ic(i,...t){if(typeof i!="string"){const e=t[0],n=[...t.slice(1)];return n[0]&&(n[0].appName=i.name),i._errorFactory.create(e,...n)}return Id.create(i,...t)}function se(i,t,...e){if(!i)throw ic(t,...e)}function vr(i){const t="INTERNAL ASSERTION FAILED: "+i;throw Co(t),new Error(t)}function ko(i,t){i||vr(t)}function Pm(){return mh()==="http:"||mh()==="https:"}function mh(){var i;return typeof self<"u"&&((i=self.location)===null||i===void 0?void 0:i.protocol)||null}/**
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
 */function Im(){return typeof navigator<"u"&&navigator&&"onLine"in navigator&&typeof navigator.onLine=="boolean"&&(Pm()||dp()||"connection"in navigator)?navigator.onLine:!0}function Dm(){if(typeof navigator>"u")return null;const i=navigator;return i.languages&&i.languages[0]||i.language||null}/**
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
 */class Pr{constructor(t,e){this.shortDelay=t,this.longDelay=e,ko(e>t,"Short delay should be less than long delay!"),this.isMobile=hp()||fp()}get(){return Im()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}}/**
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
 */function Lm(i,t){ko(i.emulator,"Emulator should always be set here");const{url:e}=i.emulator;return t?`${e}${t.startsWith("/")?t.slice(1):t}`:e}/**
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
 */class Ud{static initialize(t,e,n){this.fetchImpl=t,e&&(this.headersImpl=e),n&&(this.responseImpl=n)}static fetch(){if(this.fetchImpl)return this.fetchImpl;if(typeof self<"u"&&"fetch"in self)return self.fetch;if(typeof globalThis<"u"&&globalThis.fetch)return globalThis.fetch;if(typeof fetch<"u")return fetch;vr("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){if(this.headersImpl)return this.headersImpl;if(typeof self<"u"&&"Headers"in self)return self.Headers;if(typeof globalThis<"u"&&globalThis.Headers)return globalThis.Headers;if(typeof Headers<"u")return Headers;vr("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){if(this.responseImpl)return this.responseImpl;if(typeof self<"u"&&"Response"in self)return self.Response;if(typeof globalThis<"u"&&globalThis.Response)return globalThis.Response;if(typeof Response<"u")return Response;vr("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}/**
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
 */const Um={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"};/**
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
 */const Nm=["/v1/accounts:signInWithCustomToken","/v1/accounts:signInWithEmailLink","/v1/accounts:signInWithIdp","/v1/accounts:signInWithPassword","/v1/accounts:signInWithPhoneNumber","/v1/token"],Om=new Pr(3e4,6e4);function Nd(i,t){return i.tenantId&&!t.tenantId?Object.assign(Object.assign({},t),{tenantId:i.tenantId}):t}async function Zo(i,t,e,n,s={}){return Od(i,s,async()=>{let r={},a={};n&&(t==="GET"?a=n:r={body:JSON.stringify(n)});const l=bd(Object.assign({key:i.config.apiKey},a)).slice(1),c=await i._getAdditionalHeaders();c["Content-Type"]="application/json",i.languageCode&&(c["X-Firebase-Locale"]=i.languageCode);const h=Object.assign({method:t,headers:c},r);return up()||(h.referrerPolicy="no-referrer"),i.emulatorConfig&&Ed(i.emulatorConfig.host)&&(h.credentials="include"),Ud.fetch()(await Fd(i,i.config.apiHost,e,l),h)})}async function Od(i,t,e){i._canInitEmulator=!1;const n=Object.assign(Object.assign({},Um),t);try{const s=new Fm(i),r=await Promise.race([e(),s.promise]);s.clearNetworkTimeout();const a=await r.json();if("needConfirmation"in a)throw jr(i,"account-exists-with-different-credential",a);if(r.ok&&!("errorMessage"in a))return a;{const l=r.ok?a.errorMessage:a.error.message,[c,h]=l.split(" : ");if(c==="FEDERATED_USER_ID_ALREADY_LINKED")throw jr(i,"credential-already-in-use",a);if(c==="EMAIL_EXISTS")throw jr(i,"email-already-in-use",a);if(c==="USER_DISABLED")throw jr(i,"user-disabled",a);const d=n[c]||c.toLowerCase().replace(/[_\s]+/g,"-");if(h)throw Ld(i,d,h);ph(i,d)}}catch(s){if(s instanceof wi)throw s;ph(i,"network-request-failed",{message:String(s)})}}async function Fd(i,t,e,n){const s=`${t}${e}?${n}`,r=i,a=r.config.emulator?Lm(i.config,s):`${i.config.apiScheme}://${s}`;return Nm.includes(e)&&(await r._persistenceManagerAvailable,r._getPersistenceType()==="COOKIE")?r._getPersistence()._getFinalTarget(a).toString():a}class Fm{clearNetworkTimeout(){clearTimeout(this.timer)}constructor(t){this.auth=t,this.timer=null,this.promise=new Promise((e,n)=>{this.timer=setTimeout(()=>n(Dd(this.auth,"network-request-failed")),Om.get())})}}function jr(i,t,e){const n={appName:i.name};e.email&&(n.email=e.email),e.phoneNumber&&(n.phoneNumber=e.phoneNumber);const s=Dd(i,t,n);return s.customData._tokenResponse=e,s}/**
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
 */async function Bm(i,t){return Zo(i,"POST","/v1/accounts:delete",t)}async function zo(i,t){return Zo(i,"POST","/v1/accounts:lookup",t)}/**
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
 */function yr(i){if(i)try{const t=new Date(Number(i));if(!isNaN(t.getTime()))return t.toUTCString()}catch{}}async function km(i,t=!1){const e=Ko(i),n=await e.getIdToken(t),s=Bd(n);se(s&&s.exp&&s.auth_time&&s.iat,e.auth,"internal-error");const r=typeof s.firebase=="object"?s.firebase:void 0,a=r==null?void 0:r.sign_in_provider;return{claims:s,token:n,authTime:yr(ya(s.auth_time)),issuedAtTime:yr(ya(s.iat)),expirationTime:yr(ya(s.exp)),signInProvider:a||null,signInSecondFactor:(r==null?void 0:r.sign_in_second_factor)||null}}function ya(i){return Number(i)*1e3}function Bd(i){const[t,e,n]=i.split(".");if(t===void 0||e===void 0||n===void 0)return Co("JWT malformed, contained fewer than 3 sections"),null;try{const s=Sd(e);return s?JSON.parse(s):(Co("Failed to decode base64 JWT payload"),null)}catch(s){return Co("Caught error parsing JWT payload as JSON",s==null?void 0:s.toString()),null}}function gh(i){const t=Bd(i);return se(t,"internal-error"),se(typeof t.exp<"u","internal-error"),se(typeof t.iat<"u","internal-error"),Number(t.exp)-Number(t.iat)}/**
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
 */async function ol(i,t,e=!1){if(e)return t;try{return await t}catch(n){throw n instanceof wi&&zm(n)&&i.auth.currentUser===i&&await i.auth.signOut(),n}}function zm({code:i}){return i==="auth/user-disabled"||i==="auth/user-token-expired"}/**
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
 */class Vm{constructor(t){this.user=t,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,this.timerId!==null&&clearTimeout(this.timerId))}getInterval(t){var e;if(t){const n=this.errorBackoff;return this.errorBackoff=Math.min(this.errorBackoff*2,96e4),n}else{this.errorBackoff=3e4;const s=((e=this.user.stsTokenManager.expirationTime)!==null&&e!==void 0?e:0)-Date.now()-3e5;return Math.max(0,s)}}schedule(t=!1){if(!this.isRunning)return;const e=this.getInterval(t);this.timerId=setTimeout(async()=>{await this.iteration()},e)}async iteration(){try{await this.user.getIdToken(!0)}catch(t){(t==null?void 0:t.code)==="auth/network-request-failed"&&this.schedule(!0);return}this.schedule()}}/**
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
 */class al{constructor(t,e){this.createdAt=t,this.lastLoginAt=e,this._initializeTime()}_initializeTime(){this.lastSignInTime=yr(this.lastLoginAt),this.creationTime=yr(this.createdAt)}_copy(t){this.createdAt=t.createdAt,this.lastLoginAt=t.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}}/**
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
 */async function Vo(i){var t;const e=i.auth,n=await i.getIdToken(),s=await ol(i,zo(e,{idToken:n}));se(s==null?void 0:s.users.length,e,"internal-error");const r=s.users[0];i._notifyReloadListener(r);const a=!((t=r.providerUserInfo)===null||t===void 0)&&t.length?kd(r.providerUserInfo):[],l=Hm(i.providerData,a),c=i.isAnonymous,h=!(i.email&&r.passwordHash)&&!(l!=null&&l.length),d=c?h:!1,p={uid:r.localId,displayName:r.displayName||null,photoURL:r.photoUrl||null,email:r.email||null,emailVerified:r.emailVerified||!1,phoneNumber:r.phoneNumber||null,tenantId:r.tenantId||null,providerData:l,metadata:new al(r.createdAt,r.lastLoginAt),isAnonymous:d};Object.assign(i,p)}async function Gm(i){const t=Ko(i);await Vo(t),await t.auth._persistUserIfCurrent(t),t.auth._notifyListenersIfCurrent(t)}function Hm(i,t){return[...i.filter(n=>!t.some(s=>s.providerId===n.providerId)),...t]}function kd(i){return i.map(t=>{var{providerId:e}=t,n=Rd(t,["providerId"]);return{providerId:e,uid:n.rawId||"",displayName:n.displayName||null,email:n.email||null,phoneNumber:n.phoneNumber||null,photoURL:n.photoUrl||null}})}/**
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
 */async function Wm(i,t){const e=await Od(i,{},async()=>{const n=bd({grant_type:"refresh_token",refresh_token:t}).slice(1),{tokenApiHost:s,apiKey:r}=i.config,a=await Fd(i,s,"/v1/token",`key=${r}`),l=await i._getAdditionalHeaders();l["Content-Type"]="application/x-www-form-urlencoded";const c={method:"POST",headers:l,body:n};return i.emulatorConfig&&Ed(i.emulatorConfig.host)&&(c.credentials="include"),Ud.fetch()(a,c)});return{accessToken:e.access_token,expiresIn:e.expires_in,refreshToken:e.refresh_token}}async function Xm(i,t){return Zo(i,"POST","/v2/accounts:revokeToken",Nd(i,t))}/**
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
 */class Rs{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(t){se(t.idToken,"internal-error"),se(typeof t.idToken<"u","internal-error"),se(typeof t.refreshToken<"u","internal-error");const e="expiresIn"in t&&typeof t.expiresIn<"u"?Number(t.expiresIn):gh(t.idToken);this.updateTokensAndExpiration(t.idToken,t.refreshToken,e)}updateFromIdToken(t){se(t.length!==0,"internal-error");const e=gh(t);this.updateTokensAndExpiration(t,null,e)}async getToken(t,e=!1){return!e&&this.accessToken&&!this.isExpired?this.accessToken:(se(this.refreshToken,t,"user-token-expired"),this.refreshToken?(await this.refresh(t,this.refreshToken),this.accessToken):null)}clearRefreshToken(){this.refreshToken=null}async refresh(t,e){const{accessToken:n,refreshToken:s,expiresIn:r}=await Wm(t,e);this.updateTokensAndExpiration(n,s,Number(r))}updateTokensAndExpiration(t,e,n){this.refreshToken=e||null,this.accessToken=t||null,this.expirationTime=Date.now()+n*1e3}static fromJSON(t,e){const{refreshToken:n,accessToken:s,expirationTime:r}=e,a=new Rs;return n&&(se(typeof n=="string","internal-error",{appName:t}),a.refreshToken=n),s&&(se(typeof s=="string","internal-error",{appName:t}),a.accessToken=s),r&&(se(typeof r=="number","internal-error",{appName:t}),a.expirationTime=r),a}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(t){this.accessToken=t.accessToken,this.refreshToken=t.refreshToken,this.expirationTime=t.expirationTime}_clone(){return Object.assign(new Rs,this.toJSON())}_performRefresh(){return vr("not implemented")}}/**
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
 */function fi(i,t){se(typeof i=="string"||typeof i>"u","internal-error",{appName:t})}class Fn{constructor(t){var{uid:e,auth:n,stsTokenManager:s}=t,r=Rd(t,["uid","auth","stsTokenManager"]);this.providerId="firebase",this.proactiveRefresh=new Vm(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=e,this.auth=n,this.stsTokenManager=s,this.accessToken=s.accessToken,this.displayName=r.displayName||null,this.email=r.email||null,this.emailVerified=r.emailVerified||!1,this.phoneNumber=r.phoneNumber||null,this.photoURL=r.photoURL||null,this.isAnonymous=r.isAnonymous||!1,this.tenantId=r.tenantId||null,this.providerData=r.providerData?[...r.providerData]:[],this.metadata=new al(r.createdAt||void 0,r.lastLoginAt||void 0)}async getIdToken(t){const e=await ol(this,this.stsTokenManager.getToken(this.auth,t));return se(e,this.auth,"internal-error"),this.accessToken!==e&&(this.accessToken=e,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),e}getIdTokenResult(t){return km(this,t)}reload(){return Gm(this)}_assign(t){this!==t&&(se(this.uid===t.uid,this.auth,"internal-error"),this.displayName=t.displayName,this.photoURL=t.photoURL,this.email=t.email,this.emailVerified=t.emailVerified,this.phoneNumber=t.phoneNumber,this.isAnonymous=t.isAnonymous,this.tenantId=t.tenantId,this.providerData=t.providerData.map(e=>Object.assign({},e)),this.metadata._copy(t.metadata),this.stsTokenManager._assign(t.stsTokenManager))}_clone(t){const e=new Fn(Object.assign(Object.assign({},this),{auth:t,stsTokenManager:this.stsTokenManager._clone()}));return e.metadata._copy(this.metadata),e}_onReload(t){se(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=t,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(t){this.reloadListener?this.reloadListener(t):this.reloadUserInfo=t}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(t,e=!1){let n=!1;t.idToken&&t.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(t),n=!0),e&&await Vo(this),await this.auth._persistUserIfCurrent(this),n&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(Bi(this.auth.app))return Promise.reject(Ro(this.auth));const t=await this.getIdToken();return await ol(this,Bm(this.auth,{idToken:t})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return Object.assign(Object.assign({uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(t=>Object.assign({},t)),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId},this.metadata.toJSON()),{apiKey:this.auth.config.apiKey,appName:this.auth.name})}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(t,e){var n,s,r,a,l,c,h,d;const p=(n=e.displayName)!==null&&n!==void 0?n:void 0,m=(s=e.email)!==null&&s!==void 0?s:void 0,y=(r=e.phoneNumber)!==null&&r!==void 0?r:void 0,M=(a=e.photoURL)!==null&&a!==void 0?a:void 0,b=(l=e.tenantId)!==null&&l!==void 0?l:void 0,v=(c=e._redirectEventId)!==null&&c!==void 0?c:void 0,f=(h=e.createdAt)!==null&&h!==void 0?h:void 0,D=(d=e.lastLoginAt)!==null&&d!==void 0?d:void 0,{uid:I,emailVerified:C,isAnonymous:z,providerData:N,stsTokenManager:E}=e;se(I&&E,t,"internal-error");const S=Rs.fromJSON(this.name,E);se(typeof I=="string",t,"internal-error"),fi(p,t.name),fi(m,t.name),se(typeof C=="boolean",t,"internal-error"),se(typeof z=="boolean",t,"internal-error"),fi(y,t.name),fi(M,t.name),fi(b,t.name),fi(v,t.name),fi(f,t.name),fi(D,t.name);const g=new Fn({uid:I,auth:t,email:m,emailVerified:C,displayName:p,isAnonymous:z,photoURL:M,phoneNumber:y,tenantId:b,stsTokenManager:S,createdAt:f,lastLoginAt:D});return N&&Array.isArray(N)&&(g.providerData=N.map(_=>Object.assign({},_))),v&&(g._redirectEventId=v),g}static async _fromIdTokenResponse(t,e,n=!1){const s=new Rs;s.updateFromServerResponse(e);const r=new Fn({uid:e.localId,auth:t,stsTokenManager:s,isAnonymous:n});return await Vo(r),r}static async _fromGetAccountInfoResponse(t,e,n){const s=e.users[0];se(s.localId!==void 0,"internal-error");const r=s.providerUserInfo!==void 0?kd(s.providerUserInfo):[],a=!(s.email&&s.passwordHash)&&!(r!=null&&r.length),l=new Rs;l.updateFromIdToken(n);const c=new Fn({uid:s.localId,auth:t,stsTokenManager:l,isAnonymous:a}),h={uid:s.localId,displayName:s.displayName||null,photoURL:s.photoUrl||null,email:s.email||null,emailVerified:s.emailVerified||!1,phoneNumber:s.phoneNumber||null,tenantId:s.tenantId||null,providerData:r,metadata:new al(s.createdAt,s.lastLoginAt),isAnonymous:!(s.email&&s.passwordHash)&&!(r!=null&&r.length)};return Object.assign(c,h),c}}/**
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
 */const _h=new Map;function Gi(i){ko(i instanceof Function,"Expected a class definition");let t=_h.get(i);return t?(ko(t instanceof i,"Instance stored in cache mismatched with class"),t):(t=new i,_h.set(i,t),t)}/**
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
 */class zd{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(t,e){this.storage[t]=e}async _get(t){const e=this.storage[t];return e===void 0?null:e}async _remove(t){delete this.storage[t]}_addListener(t,e){}_removeListener(t,e){}}zd.type="NONE";const vh=zd;/**
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
 */function xa(i,t,e){return`firebase:${i}:${t}:${e}`}class Ps{constructor(t,e,n){this.persistence=t,this.auth=e,this.userKey=n;const{config:s,name:r}=this.auth;this.fullUserKey=xa(this.userKey,s.apiKey,r),this.fullPersistenceKey=xa("persistence",s.apiKey,r),this.boundEventHandler=e._onStorageEvent.bind(e),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(t){return this.persistence._set(this.fullUserKey,t.toJSON())}async getCurrentUser(){const t=await this.persistence._get(this.fullUserKey);if(!t)return null;if(typeof t=="string"){const e=await zo(this.auth,{idToken:t}).catch(()=>{});return e?Fn._fromGetAccountInfoResponse(this.auth,e,t):null}return Fn._fromJSON(this.auth,t)}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(t){if(this.persistence===t)return;const e=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=t,e)return this.setCurrentUser(e)}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(t,e,n="authUser"){if(!e.length)return new Ps(Gi(vh),t,n);const s=(await Promise.all(e.map(async h=>{if(await h._isAvailable())return h}))).filter(h=>h);let r=s[0]||Gi(vh);const a=xa(n,t.config.apiKey,t.name);let l=null;for(const h of e)try{const d=await h._get(a);if(d){let p;if(typeof d=="string"){const m=await zo(t,{idToken:d}).catch(()=>{});if(!m)break;p=await Fn._fromGetAccountInfoResponse(t,m,d)}else p=Fn._fromJSON(t,d);h!==r&&(l=p),r=h;break}}catch{}const c=s.filter(h=>h._shouldAllowMigration);return!r._shouldAllowMigration||!c.length?new Ps(r,t,n):(r=c[0],l&&await r._set(a,l.toJSON()),await Promise.all(e.map(async h=>{if(h!==r)try{await h._remove(a)}catch{}})),new Ps(r,t,n))}}/**
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
 */function yh(i){const t=i.toLowerCase();if(t.includes("opera/")||t.includes("opr/")||t.includes("opios/"))return"Opera";if(Ym(t))return"IEMobile";if(t.includes("msie")||t.includes("trident/"))return"IE";if(t.includes("edge/"))return"Edge";if(qm(t))return"Firefox";if(t.includes("silk/"))return"Silk";if(Jm(t))return"Blackberry";if(Zm(t))return"Webos";if(jm(t))return"Safari";if((t.includes("chrome/")||$m(t))&&!t.includes("edge/"))return"Chrome";if(Km(t))return"Android";{const e=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,n=i.match(e);if((n==null?void 0:n.length)===2)return n[1]}return"Other"}function qm(i=zn()){return/firefox\//i.test(i)}function jm(i=zn()){const t=i.toLowerCase();return t.includes("safari/")&&!t.includes("chrome/")&&!t.includes("crios/")&&!t.includes("android")}function $m(i=zn()){return/crios\//i.test(i)}function Ym(i=zn()){return/iemobile/i.test(i)}function Km(i=zn()){return/android/i.test(i)}function Jm(i=zn()){return/blackberry/i.test(i)}function Zm(i=zn()){return/webos/i.test(i)}/**
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
 */function Vd(i,t=[]){let e;switch(i){case"Browser":e=yh(zn());break;case"Worker":e=`${yh(zn())}-${i}`;break;default:e=i}const n=t.length?t.join(","):"FirebaseCore-web";return`${e}/JsCore/${Jo}/${n}`}/**
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
 */class Qm{constructor(t){this.auth=t,this.queue=[]}pushCallback(t,e){const n=r=>new Promise((a,l)=>{try{const c=t(r);a(c)}catch(c){l(c)}});n.onAbort=e,this.queue.push(n);const s=this.queue.length-1;return()=>{this.queue[s]=()=>Promise.resolve()}}async runMiddleware(t){if(this.auth.currentUser===t)return;const e=[];try{for(const n of this.queue)await n(t),n.onAbort&&e.push(n.onAbort)}catch(n){e.reverse();for(const s of e)try{s()}catch{}throw this.auth._errorFactory.create("login-blocked",{originalMessage:n==null?void 0:n.message})}}}/**
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
 */async function tg(i,t={}){return Zo(i,"GET","/v2/passwordPolicy",Nd(i,t))}/**
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
 */const eg=6;class ng{constructor(t){var e,n,s,r;const a=t.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=(e=a.minPasswordLength)!==null&&e!==void 0?e:eg,a.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=a.maxPasswordLength),a.containsLowercaseCharacter!==void 0&&(this.customStrengthOptions.containsLowercaseLetter=a.containsLowercaseCharacter),a.containsUppercaseCharacter!==void 0&&(this.customStrengthOptions.containsUppercaseLetter=a.containsUppercaseCharacter),a.containsNumericCharacter!==void 0&&(this.customStrengthOptions.containsNumericCharacter=a.containsNumericCharacter),a.containsNonAlphanumericCharacter!==void 0&&(this.customStrengthOptions.containsNonAlphanumericCharacter=a.containsNonAlphanumericCharacter),this.enforcementState=t.enforcementState,this.enforcementState==="ENFORCEMENT_STATE_UNSPECIFIED"&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=(s=(n=t.allowedNonAlphanumericCharacters)===null||n===void 0?void 0:n.join(""))!==null&&s!==void 0?s:"",this.forceUpgradeOnSignin=(r=t.forceUpgradeOnSignin)!==null&&r!==void 0?r:!1,this.schemaVersion=t.schemaVersion}validatePassword(t){var e,n,s,r,a,l;const c={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(t,c),this.validatePasswordCharacterOptions(t,c),c.isValid&&(c.isValid=(e=c.meetsMinPasswordLength)!==null&&e!==void 0?e:!0),c.isValid&&(c.isValid=(n=c.meetsMaxPasswordLength)!==null&&n!==void 0?n:!0),c.isValid&&(c.isValid=(s=c.containsLowercaseLetter)!==null&&s!==void 0?s:!0),c.isValid&&(c.isValid=(r=c.containsUppercaseLetter)!==null&&r!==void 0?r:!0),c.isValid&&(c.isValid=(a=c.containsNumericCharacter)!==null&&a!==void 0?a:!0),c.isValid&&(c.isValid=(l=c.containsNonAlphanumericCharacter)!==null&&l!==void 0?l:!0),c}validatePasswordLengthOptions(t,e){const n=this.customStrengthOptions.minPasswordLength,s=this.customStrengthOptions.maxPasswordLength;n&&(e.meetsMinPasswordLength=t.length>=n),s&&(e.meetsMaxPasswordLength=t.length<=s)}validatePasswordCharacterOptions(t,e){this.updatePasswordCharacterOptionsStatuses(e,!1,!1,!1,!1);let n;for(let s=0;s<t.length;s++)n=t.charAt(s),this.updatePasswordCharacterOptionsStatuses(e,n>="a"&&n<="z",n>="A"&&n<="Z",n>="0"&&n<="9",this.allowedNonAlphanumericCharacters.includes(n))}updatePasswordCharacterOptionsStatuses(t,e,n,s,r){this.customStrengthOptions.containsLowercaseLetter&&(t.containsLowercaseLetter||(t.containsLowercaseLetter=e)),this.customStrengthOptions.containsUppercaseLetter&&(t.containsUppercaseLetter||(t.containsUppercaseLetter=n)),this.customStrengthOptions.containsNumericCharacter&&(t.containsNumericCharacter||(t.containsNumericCharacter=s)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(t.containsNonAlphanumericCharacter||(t.containsNonAlphanumericCharacter=r))}}/**
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
 */class ig{constructor(t,e,n,s){this.app=t,this.heartbeatServiceProvider=e,this.appCheckServiceProvider=n,this.config=s,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new xh(this),this.idTokenSubscription=new xh(this),this.beforeStateQueue=new Qm(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=Id,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this._resolvePersistenceManagerAvailable=void 0,this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=t.name,this.clientVersion=s.sdkClientVersion,this._persistenceManagerAvailable=new Promise(r=>this._resolvePersistenceManagerAvailable=r)}_initializeWithPersistence(t,e){return e&&(this._popupRedirectResolver=Gi(e)),this._initializationPromise=this.queue(async()=>{var n,s,r;if(!this._deleted&&(this.persistenceManager=await Ps.create(this,t),(n=this._resolvePersistenceManagerAvailable)===null||n===void 0||n.call(this),!this._deleted)){if(!((s=this._popupRedirectResolver)===null||s===void 0)&&s._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch{}await this.initializeCurrentUser(e),this.lastNotifiedUid=((r=this.currentUser)===null||r===void 0?void 0:r.uid)||null,!this._deleted&&(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;const t=await this.assertedPersistence.getCurrentUser();if(!(!this.currentUser&&!t)){if(this.currentUser&&t&&this.currentUser.uid===t.uid){this._currentUser._assign(t),await this.currentUser.getIdToken();return}await this._updateCurrentUser(t,!0)}}async initializeCurrentUserFromIdToken(t){try{const e=await zo(this,{idToken:t}),n=await Fn._fromGetAccountInfoResponse(this,e,t);await this.directlySetCurrentUser(n)}catch(e){console.warn("FirebaseServerApp could not login user with provided authIdToken: ",e),await this.directlySetCurrentUser(null)}}async initializeCurrentUser(t){var e;if(Bi(this.app)){const a=this.app.settings.authIdToken;return a?new Promise(l=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(a).then(l,l))}):this.directlySetCurrentUser(null)}const n=await this.assertedPersistence.getCurrentUser();let s=n,r=!1;if(t&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();const a=(e=this.redirectUser)===null||e===void 0?void 0:e._redirectEventId,l=s==null?void 0:s._redirectEventId,c=await this.tryRedirectSignIn(t);(!a||a===l)&&(c!=null&&c.user)&&(s=c.user,r=!0)}if(!s)return this.directlySetCurrentUser(null);if(!s._redirectEventId){if(r)try{await this.beforeStateQueue.runMiddleware(s)}catch(a){s=n,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(a))}return s?this.reloadAndSetCurrentUserOrClear(s):this.directlySetCurrentUser(null)}return se(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===s._redirectEventId?this.directlySetCurrentUser(s):this.reloadAndSetCurrentUserOrClear(s)}async tryRedirectSignIn(t){let e=null;try{e=await this._popupRedirectResolver._completeRedirectFn(this,t,!0)}catch{await this._setRedirectUser(null)}return e}async reloadAndSetCurrentUserOrClear(t){try{await Vo(t)}catch(e){if((e==null?void 0:e.code)!=="auth/network-request-failed")return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(t)}useDeviceLanguage(){this.languageCode=Dm()}async _delete(){this._deleted=!0}async updateCurrentUser(t){if(Bi(this.app))return Promise.reject(Ro(this));const e=t?Ko(t):null;return e&&se(e.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(e&&e._clone(this))}async _updateCurrentUser(t,e=!1){if(!this._deleted)return t&&se(this.tenantId===t.tenantId,this,"tenant-id-mismatch"),e||await this.beforeStateQueue.runMiddleware(t),this.queue(async()=>{await this.directlySetCurrentUser(t),this.notifyAuthListeners()})}async signOut(){return Bi(this.app)?Promise.reject(Ro(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(t){return Bi(this.app)?Promise.reject(Ro(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(Gi(t))})}_getRecaptchaConfig(){return this.tenantId==null?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(t){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();const e=this._getPasswordPolicyInternal();return e.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):e.validatePassword(t)}_getPasswordPolicyInternal(){return this.tenantId===null?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){const t=await tg(this),e=new ng(t);this.tenantId===null?this._projectPasswordPolicy=e:this._tenantPasswordPolicies[this.tenantId]=e}_getPersistenceType(){return this.assertedPersistence.persistence.type}_getPersistence(){return this.assertedPersistence.persistence}_updateErrorMap(t){this._errorFactory=new Rr("auth","Firebase",t())}onAuthStateChanged(t,e,n){return this.registerStateListener(this.authStateSubscription,t,e,n)}beforeAuthStateChanged(t,e){return this.beforeStateQueue.pushCallback(t,e)}onIdTokenChanged(t,e,n){return this.registerStateListener(this.idTokenSubscription,t,e,n)}authStateReady(){return new Promise((t,e)=>{if(this.currentUser)t();else{const n=this.onAuthStateChanged(()=>{n(),t()},e)}})}async revokeAccessToken(t){if(this.currentUser){const e=await this.currentUser.getIdToken(),n={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:t,idToken:e};this.tenantId!=null&&(n.tenantId=this.tenantId),await Xm(this,n)}}toJSON(){var t;return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:(t=this._currentUser)===null||t===void 0?void 0:t.toJSON()}}async _setRedirectUser(t,e){const n=await this.getOrInitRedirectPersistenceManager(e);return t===null?n.removeCurrentUser():n.setCurrentUser(t)}async getOrInitRedirectPersistenceManager(t){if(!this.redirectPersistenceManager){const e=t&&Gi(t)||this._popupRedirectResolver;se(e,this,"argument-error"),this.redirectPersistenceManager=await Ps.create(this,[Gi(e._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(t){var e,n;return this._isInitialized&&await this.queue(async()=>{}),((e=this._currentUser)===null||e===void 0?void 0:e._redirectEventId)===t?this._currentUser:((n=this.redirectUser)===null||n===void 0?void 0:n._redirectEventId)===t?this.redirectUser:null}async _persistUserIfCurrent(t){if(t===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(t))}_notifyListenersIfCurrent(t){t===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){var t,e;if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);const n=(e=(t=this.currentUser)===null||t===void 0?void 0:t.uid)!==null&&e!==void 0?e:null;this.lastNotifiedUid!==n&&(this.lastNotifiedUid=n,this.authStateSubscription.next(this.currentUser))}registerStateListener(t,e,n,s){if(this._deleted)return()=>{};const r=typeof e=="function"?e:e.next.bind(e);let a=!1;const l=this._isInitialized?Promise.resolve():this._initializationPromise;if(se(l,this,"internal-error"),l.then(()=>{a||r(this.currentUser)}),typeof e=="function"){const c=t.addObserver(e,n,s);return()=>{a=!0,c()}}else{const c=t.addObserver(e);return()=>{a=!0,c()}}}async directlySetCurrentUser(t){this.currentUser&&this.currentUser!==t&&this._currentUser._stopProactiveRefresh(),t&&this.isProactiveRefreshEnabled&&t._startProactiveRefresh(),this.currentUser=t,t?await this.assertedPersistence.setCurrentUser(t):await this.assertedPersistence.removeCurrentUser()}queue(t){return this.operations=this.operations.then(t,t),this.operations}get assertedPersistence(){return se(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(t){!t||this.frameworks.includes(t)||(this.frameworks.push(t),this.frameworks.sort(),this.clientVersion=Vd(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){var t;const e={"X-Client-Version":this.clientVersion};this.app.options.appId&&(e["X-Firebase-gmpid"]=this.app.options.appId);const n=await((t=this.heartbeatServiceProvider.getImmediate({optional:!0}))===null||t===void 0?void 0:t.getHeartbeatsHeader());n&&(e["X-Firebase-Client"]=n);const s=await this._getAppCheckToken();return s&&(e["X-Firebase-AppCheck"]=s),e}async _getAppCheckToken(){var t;if(Bi(this.app)&&this.app.settings.appCheckToken)return this.app.settings.appCheckToken;const e=await((t=this.appCheckServiceProvider.getImmediate({optional:!0}))===null||t===void 0?void 0:t.getToken());return e!=null&&e.error&&Rm(`Error while retrieving App Check token: ${e.error}`),e==null?void 0:e.token}}function sg(i){return Ko(i)}class xh{constructor(t){this.auth=t,this.observer=null,this.addObserver=yp(e=>this.observer=e)}get next(){return se(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}function rg(i,t){const e=(t==null?void 0:t.persistence)||[],n=(Array.isArray(e)?e:[e]).map(Gi);t!=null&&t.errorMap&&i._updateErrorMap(t.errorMap),i._initializeWithPersistence(n,t==null?void 0:t.popupRedirectResolver)}new Pr(3e4,6e4);/**
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
 */new Pr(2e3,1e4);/**
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
 */new Pr(3e4,6e4);/**
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
 */new Pr(5e3,15e3);var Mh="@firebase/auth",Sh="1.10.8";/**
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
 */class og{constructor(t){this.auth=t,this.internalListeners=new Map}getUid(){var t;return this.assertAuthConfigured(),((t=this.auth.currentUser)===null||t===void 0?void 0:t.uid)||null}async getToken(t){return this.assertAuthConfigured(),await this.auth._initializationPromise,this.auth.currentUser?{accessToken:await this.auth.currentUser.getIdToken(t)}:null}addAuthTokenListener(t){if(this.assertAuthConfigured(),this.internalListeners.has(t))return;const e=this.auth.onIdTokenChanged(n=>{t((n==null?void 0:n.stsTokenManager.accessToken)||null)});this.internalListeners.set(t,e),this.updateProactiveRefresh()}removeAuthTokenListener(t){this.assertAuthConfigured();const e=this.internalListeners.get(t);e&&(this.internalListeners.delete(t),e(),this.updateProactiveRefresh())}assertAuthConfigured(){se(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}/**
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
 */function ag(i){switch(i){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}function lg(i){Os(new Ns("auth",(t,{options:e})=>{const n=t.getProvider("app").getImmediate(),s=t.getProvider("heartbeat"),r=t.getProvider("app-check-internal"),{apiKey:a,authDomain:l}=n.options;se(a&&!a.includes(":"),"invalid-api-key",{appName:n.name});const c={apiKey:a,authDomain:l,clientPlatform:i,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:Vd(i)},h=new ig(n,s,r,c);return rg(h,e),h},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((t,e,n)=>{t.getProvider("auth-internal").initialize()})),Os(new Ns("auth-internal",t=>{const e=sg(t.getProvider("auth").getImmediate());return(n=>new og(n))(e)},"PRIVATE").setInstantiationMode("EXPLICIT")),Si(Mh,Sh,ag(i)),Si(Mh,Sh,"esm2017")}/**
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
 */const cg=300;cp("authIdTokenMaxAge");lg("Browser");var Eh=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var sc;(function(){var i;/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/function t(E,S){function g(){}g.prototype=S.prototype,E.D=S.prototype,E.prototype=new g,E.prototype.constructor=E,E.C=function(_,w,L){for(var T=Array(arguments.length-2),K=2;K<arguments.length;K++)T[K-2]=arguments[K];return S.prototype[w].apply(_,T)}}function e(){this.blockSize=-1}function n(){this.blockSize=-1,this.blockSize=64,this.g=Array(4),this.B=Array(this.blockSize),this.o=this.h=0,this.s()}t(n,e),n.prototype.s=function(){this.g[0]=1732584193,this.g[1]=4023233417,this.g[2]=2562383102,this.g[3]=271733878,this.o=this.h=0};function s(E,S,g){g||(g=0);var _=Array(16);if(typeof S=="string")for(var w=0;16>w;++w)_[w]=S.charCodeAt(g++)|S.charCodeAt(g++)<<8|S.charCodeAt(g++)<<16|S.charCodeAt(g++)<<24;else for(w=0;16>w;++w)_[w]=S[g++]|S[g++]<<8|S[g++]<<16|S[g++]<<24;S=E.g[0],g=E.g[1],w=E.g[2];var L=E.g[3],T=S+(L^g&(w^L))+_[0]+3614090360&4294967295;S=g+(T<<7&4294967295|T>>>25),T=L+(w^S&(g^w))+_[1]+3905402710&4294967295,L=S+(T<<12&4294967295|T>>>20),T=w+(g^L&(S^g))+_[2]+606105819&4294967295,w=L+(T<<17&4294967295|T>>>15),T=g+(S^w&(L^S))+_[3]+3250441966&4294967295,g=w+(T<<22&4294967295|T>>>10),T=S+(L^g&(w^L))+_[4]+4118548399&4294967295,S=g+(T<<7&4294967295|T>>>25),T=L+(w^S&(g^w))+_[5]+1200080426&4294967295,L=S+(T<<12&4294967295|T>>>20),T=w+(g^L&(S^g))+_[6]+2821735955&4294967295,w=L+(T<<17&4294967295|T>>>15),T=g+(S^w&(L^S))+_[7]+4249261313&4294967295,g=w+(T<<22&4294967295|T>>>10),T=S+(L^g&(w^L))+_[8]+1770035416&4294967295,S=g+(T<<7&4294967295|T>>>25),T=L+(w^S&(g^w))+_[9]+2336552879&4294967295,L=S+(T<<12&4294967295|T>>>20),T=w+(g^L&(S^g))+_[10]+4294925233&4294967295,w=L+(T<<17&4294967295|T>>>15),T=g+(S^w&(L^S))+_[11]+2304563134&4294967295,g=w+(T<<22&4294967295|T>>>10),T=S+(L^g&(w^L))+_[12]+1804603682&4294967295,S=g+(T<<7&4294967295|T>>>25),T=L+(w^S&(g^w))+_[13]+4254626195&4294967295,L=S+(T<<12&4294967295|T>>>20),T=w+(g^L&(S^g))+_[14]+2792965006&4294967295,w=L+(T<<17&4294967295|T>>>15),T=g+(S^w&(L^S))+_[15]+1236535329&4294967295,g=w+(T<<22&4294967295|T>>>10),T=S+(w^L&(g^w))+_[1]+4129170786&4294967295,S=g+(T<<5&4294967295|T>>>27),T=L+(g^w&(S^g))+_[6]+3225465664&4294967295,L=S+(T<<9&4294967295|T>>>23),T=w+(S^g&(L^S))+_[11]+643717713&4294967295,w=L+(T<<14&4294967295|T>>>18),T=g+(L^S&(w^L))+_[0]+3921069994&4294967295,g=w+(T<<20&4294967295|T>>>12),T=S+(w^L&(g^w))+_[5]+3593408605&4294967295,S=g+(T<<5&4294967295|T>>>27),T=L+(g^w&(S^g))+_[10]+38016083&4294967295,L=S+(T<<9&4294967295|T>>>23),T=w+(S^g&(L^S))+_[15]+3634488961&4294967295,w=L+(T<<14&4294967295|T>>>18),T=g+(L^S&(w^L))+_[4]+3889429448&4294967295,g=w+(T<<20&4294967295|T>>>12),T=S+(w^L&(g^w))+_[9]+568446438&4294967295,S=g+(T<<5&4294967295|T>>>27),T=L+(g^w&(S^g))+_[14]+3275163606&4294967295,L=S+(T<<9&4294967295|T>>>23),T=w+(S^g&(L^S))+_[3]+4107603335&4294967295,w=L+(T<<14&4294967295|T>>>18),T=g+(L^S&(w^L))+_[8]+1163531501&4294967295,g=w+(T<<20&4294967295|T>>>12),T=S+(w^L&(g^w))+_[13]+2850285829&4294967295,S=g+(T<<5&4294967295|T>>>27),T=L+(g^w&(S^g))+_[2]+4243563512&4294967295,L=S+(T<<9&4294967295|T>>>23),T=w+(S^g&(L^S))+_[7]+1735328473&4294967295,w=L+(T<<14&4294967295|T>>>18),T=g+(L^S&(w^L))+_[12]+2368359562&4294967295,g=w+(T<<20&4294967295|T>>>12),T=S+(g^w^L)+_[5]+4294588738&4294967295,S=g+(T<<4&4294967295|T>>>28),T=L+(S^g^w)+_[8]+2272392833&4294967295,L=S+(T<<11&4294967295|T>>>21),T=w+(L^S^g)+_[11]+1839030562&4294967295,w=L+(T<<16&4294967295|T>>>16),T=g+(w^L^S)+_[14]+4259657740&4294967295,g=w+(T<<23&4294967295|T>>>9),T=S+(g^w^L)+_[1]+2763975236&4294967295,S=g+(T<<4&4294967295|T>>>28),T=L+(S^g^w)+_[4]+1272893353&4294967295,L=S+(T<<11&4294967295|T>>>21),T=w+(L^S^g)+_[7]+4139469664&4294967295,w=L+(T<<16&4294967295|T>>>16),T=g+(w^L^S)+_[10]+3200236656&4294967295,g=w+(T<<23&4294967295|T>>>9),T=S+(g^w^L)+_[13]+681279174&4294967295,S=g+(T<<4&4294967295|T>>>28),T=L+(S^g^w)+_[0]+3936430074&4294967295,L=S+(T<<11&4294967295|T>>>21),T=w+(L^S^g)+_[3]+3572445317&4294967295,w=L+(T<<16&4294967295|T>>>16),T=g+(w^L^S)+_[6]+76029189&4294967295,g=w+(T<<23&4294967295|T>>>9),T=S+(g^w^L)+_[9]+3654602809&4294967295,S=g+(T<<4&4294967295|T>>>28),T=L+(S^g^w)+_[12]+3873151461&4294967295,L=S+(T<<11&4294967295|T>>>21),T=w+(L^S^g)+_[15]+530742520&4294967295,w=L+(T<<16&4294967295|T>>>16),T=g+(w^L^S)+_[2]+3299628645&4294967295,g=w+(T<<23&4294967295|T>>>9),T=S+(w^(g|~L))+_[0]+4096336452&4294967295,S=g+(T<<6&4294967295|T>>>26),T=L+(g^(S|~w))+_[7]+1126891415&4294967295,L=S+(T<<10&4294967295|T>>>22),T=w+(S^(L|~g))+_[14]+2878612391&4294967295,w=L+(T<<15&4294967295|T>>>17),T=g+(L^(w|~S))+_[5]+4237533241&4294967295,g=w+(T<<21&4294967295|T>>>11),T=S+(w^(g|~L))+_[12]+1700485571&4294967295,S=g+(T<<6&4294967295|T>>>26),T=L+(g^(S|~w))+_[3]+2399980690&4294967295,L=S+(T<<10&4294967295|T>>>22),T=w+(S^(L|~g))+_[10]+4293915773&4294967295,w=L+(T<<15&4294967295|T>>>17),T=g+(L^(w|~S))+_[1]+2240044497&4294967295,g=w+(T<<21&4294967295|T>>>11),T=S+(w^(g|~L))+_[8]+1873313359&4294967295,S=g+(T<<6&4294967295|T>>>26),T=L+(g^(S|~w))+_[15]+4264355552&4294967295,L=S+(T<<10&4294967295|T>>>22),T=w+(S^(L|~g))+_[6]+2734768916&4294967295,w=L+(T<<15&4294967295|T>>>17),T=g+(L^(w|~S))+_[13]+1309151649&4294967295,g=w+(T<<21&4294967295|T>>>11),T=S+(w^(g|~L))+_[4]+4149444226&4294967295,S=g+(T<<6&4294967295|T>>>26),T=L+(g^(S|~w))+_[11]+3174756917&4294967295,L=S+(T<<10&4294967295|T>>>22),T=w+(S^(L|~g))+_[2]+718787259&4294967295,w=L+(T<<15&4294967295|T>>>17),T=g+(L^(w|~S))+_[9]+3951481745&4294967295,E.g[0]=E.g[0]+S&4294967295,E.g[1]=E.g[1]+(w+(T<<21&4294967295|T>>>11))&4294967295,E.g[2]=E.g[2]+w&4294967295,E.g[3]=E.g[3]+L&4294967295}n.prototype.u=function(E,S){S===void 0&&(S=E.length);for(var g=S-this.blockSize,_=this.B,w=this.h,L=0;L<S;){if(w==0)for(;L<=g;)s(this,E,L),L+=this.blockSize;if(typeof E=="string"){for(;L<S;)if(_[w++]=E.charCodeAt(L++),w==this.blockSize){s(this,_),w=0;break}}else for(;L<S;)if(_[w++]=E[L++],w==this.blockSize){s(this,_),w=0;break}}this.h=w,this.o+=S},n.prototype.v=function(){var E=Array((56>this.h?this.blockSize:2*this.blockSize)-this.h);E[0]=128;for(var S=1;S<E.length-8;++S)E[S]=0;var g=8*this.o;for(S=E.length-8;S<E.length;++S)E[S]=g&255,g/=256;for(this.u(E),E=Array(16),S=g=0;4>S;++S)for(var _=0;32>_;_+=8)E[g++]=this.g[S]>>>_&255;return E};function r(E,S){var g=l;return Object.prototype.hasOwnProperty.call(g,E)?g[E]:g[E]=S(E)}function a(E,S){this.h=S;for(var g=[],_=!0,w=E.length-1;0<=w;w--){var L=E[w]|0;_&&L==S||(g[w]=L,_=!1)}this.g=g}var l={};function c(E){return-128<=E&&128>E?r(E,function(S){return new a([S|0],0>S?-1:0)}):new a([E|0],0>E?-1:0)}function h(E){if(isNaN(E)||!isFinite(E))return p;if(0>E)return v(h(-E));for(var S=[],g=1,_=0;E>=g;_++)S[_]=E/g|0,g*=4294967296;return new a(S,0)}function d(E,S){if(E.length==0)throw Error("number format error: empty string");if(S=S||10,2>S||36<S)throw Error("radix out of range: "+S);if(E.charAt(0)=="-")return v(d(E.substring(1),S));if(0<=E.indexOf("-"))throw Error('number format error: interior "-" character');for(var g=h(Math.pow(S,8)),_=p,w=0;w<E.length;w+=8){var L=Math.min(8,E.length-w),T=parseInt(E.substring(w,w+L),S);8>L?(L=h(Math.pow(S,L)),_=_.j(L).add(h(T))):(_=_.j(g),_=_.add(h(T)))}return _}var p=c(0),m=c(1),y=c(16777216);i=a.prototype,i.m=function(){if(b(this))return-v(this).m();for(var E=0,S=1,g=0;g<this.g.length;g++){var _=this.i(g);E+=(0<=_?_:4294967296+_)*S,S*=4294967296}return E},i.toString=function(E){if(E=E||10,2>E||36<E)throw Error("radix out of range: "+E);if(M(this))return"0";if(b(this))return"-"+v(this).toString(E);for(var S=h(Math.pow(E,6)),g=this,_="";;){var w=C(g,S).g;g=f(g,w.j(S));var L=((0<g.g.length?g.g[0]:g.h)>>>0).toString(E);if(g=w,M(g))return L+_;for(;6>L.length;)L="0"+L;_=L+_}},i.i=function(E){return 0>E?0:E<this.g.length?this.g[E]:this.h};function M(E){if(E.h!=0)return!1;for(var S=0;S<E.g.length;S++)if(E.g[S]!=0)return!1;return!0}function b(E){return E.h==-1}i.l=function(E){return E=f(this,E),b(E)?-1:M(E)?0:1};function v(E){for(var S=E.g.length,g=[],_=0;_<S;_++)g[_]=~E.g[_];return new a(g,~E.h).add(m)}i.abs=function(){return b(this)?v(this):this},i.add=function(E){for(var S=Math.max(this.g.length,E.g.length),g=[],_=0,w=0;w<=S;w++){var L=_+(this.i(w)&65535)+(E.i(w)&65535),T=(L>>>16)+(this.i(w)>>>16)+(E.i(w)>>>16);_=T>>>16,L&=65535,T&=65535,g[w]=T<<16|L}return new a(g,g[g.length-1]&-2147483648?-1:0)};function f(E,S){return E.add(v(S))}i.j=function(E){if(M(this)||M(E))return p;if(b(this))return b(E)?v(this).j(v(E)):v(v(this).j(E));if(b(E))return v(this.j(v(E)));if(0>this.l(y)&&0>E.l(y))return h(this.m()*E.m());for(var S=this.g.length+E.g.length,g=[],_=0;_<2*S;_++)g[_]=0;for(_=0;_<this.g.length;_++)for(var w=0;w<E.g.length;w++){var L=this.i(_)>>>16,T=this.i(_)&65535,K=E.i(w)>>>16,Q=E.i(w)&65535;g[2*_+2*w]+=T*Q,D(g,2*_+2*w),g[2*_+2*w+1]+=L*Q,D(g,2*_+2*w+1),g[2*_+2*w+1]+=T*K,D(g,2*_+2*w+1),g[2*_+2*w+2]+=L*K,D(g,2*_+2*w+2)}for(_=0;_<S;_++)g[_]=g[2*_+1]<<16|g[2*_];for(_=S;_<2*S;_++)g[_]=0;return new a(g,0)};function D(E,S){for(;(E[S]&65535)!=E[S];)E[S+1]+=E[S]>>>16,E[S]&=65535,S++}function I(E,S){this.g=E,this.h=S}function C(E,S){if(M(S))throw Error("division by zero");if(M(E))return new I(p,p);if(b(E))return S=C(v(E),S),new I(v(S.g),v(S.h));if(b(S))return S=C(E,v(S)),new I(v(S.g),S.h);if(30<E.g.length){if(b(E)||b(S))throw Error("slowDivide_ only works with positive integers.");for(var g=m,_=S;0>=_.l(E);)g=z(g),_=z(_);var w=N(g,1),L=N(_,1);for(_=N(_,2),g=N(g,2);!M(_);){var T=L.add(_);0>=T.l(E)&&(w=w.add(g),L=T),_=N(_,1),g=N(g,1)}return S=f(E,w.j(S)),new I(w,S)}for(w=p;0<=E.l(S);){for(g=Math.max(1,Math.floor(E.m()/S.m())),_=Math.ceil(Math.log(g)/Math.LN2),_=48>=_?1:Math.pow(2,_-48),L=h(g),T=L.j(S);b(T)||0<T.l(E);)g-=_,L=h(g),T=L.j(S);M(L)&&(L=m),w=w.add(L),E=f(E,T)}return new I(w,E)}i.A=function(E){return C(this,E).h},i.and=function(E){for(var S=Math.max(this.g.length,E.g.length),g=[],_=0;_<S;_++)g[_]=this.i(_)&E.i(_);return new a(g,this.h&E.h)},i.or=function(E){for(var S=Math.max(this.g.length,E.g.length),g=[],_=0;_<S;_++)g[_]=this.i(_)|E.i(_);return new a(g,this.h|E.h)},i.xor=function(E){for(var S=Math.max(this.g.length,E.g.length),g=[],_=0;_<S;_++)g[_]=this.i(_)^E.i(_);return new a(g,this.h^E.h)};function z(E){for(var S=E.g.length+1,g=[],_=0;_<S;_++)g[_]=E.i(_)<<1|E.i(_-1)>>>31;return new a(g,E.h)}function N(E,S){var g=S>>5;S%=32;for(var _=E.g.length-g,w=[],L=0;L<_;L++)w[L]=0<S?E.i(L+g)>>>S|E.i(L+g+1)<<32-S:E.i(L+g);return new a(w,E.h)}n.prototype.digest=n.prototype.v,n.prototype.reset=n.prototype.s,n.prototype.update=n.prototype.u,a.prototype.add=a.prototype.add,a.prototype.multiply=a.prototype.j,a.prototype.modulo=a.prototype.A,a.prototype.compare=a.prototype.l,a.prototype.toNumber=a.prototype.m,a.prototype.toString=a.prototype.toString,a.prototype.getBits=a.prototype.i,a.fromNumber=h,a.fromString=d,sc=a}).apply(typeof Eh<"u"?Eh:typeof self<"u"?self:typeof window<"u"?window:{});var $r=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};(function(){var i,t=typeof Object.defineProperties=="function"?Object.defineProperty:function(o,u,x){return o==Array.prototype||o==Object.prototype||(o[u]=x.value),o};function e(o){o=[typeof globalThis=="object"&&globalThis,o,typeof window=="object"&&window,typeof self=="object"&&self,typeof $r=="object"&&$r];for(var u=0;u<o.length;++u){var x=o[u];if(x&&x.Math==Math)return x}throw Error("Cannot find global object")}var n=e(this);function s(o,u){if(u)t:{var x=n;o=o.split(".");for(var P=0;P<o.length-1;P++){var G=o[P];if(!(G in x))break t;x=x[G]}o=o[o.length-1],P=x[o],u=u(P),u!=P&&u!=null&&t(x,o,{configurable:!0,writable:!0,value:u})}}function r(o,u){o instanceof String&&(o+="");var x=0,P=!1,G={next:function(){if(!P&&x<o.length){var q=x++;return{value:u(q,o[q]),done:!1}}return P=!0,{done:!0,value:void 0}}};return G[Symbol.iterator]=function(){return G},G}s("Array.prototype.values",function(o){return o||function(){return r(this,function(u,x){return x})}});/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/var a=a||{},l=this||self;function c(o){var u=typeof o;return u=u!="object"?u:o?Array.isArray(o)?"array":u:"null",u=="array"||u=="object"&&typeof o.length=="number"}function h(o){var u=typeof o;return u=="object"&&o!=null||u=="function"}function d(o,u,x){return o.call.apply(o.bind,arguments)}function p(o,u,x){if(!o)throw Error();if(2<arguments.length){var P=Array.prototype.slice.call(arguments,2);return function(){var G=Array.prototype.slice.call(arguments);return Array.prototype.unshift.apply(G,P),o.apply(u,G)}}return function(){return o.apply(u,arguments)}}function m(o,u,x){return m=Function.prototype.bind&&Function.prototype.bind.toString().indexOf("native code")!=-1?d:p,m.apply(null,arguments)}function y(o,u){var x=Array.prototype.slice.call(arguments,1);return function(){var P=x.slice();return P.push.apply(P,arguments),o.apply(this,P)}}function M(o,u){function x(){}x.prototype=u.prototype,o.aa=u.prototype,o.prototype=new x,o.prototype.constructor=o,o.Qb=function(P,G,q){for(var at=Array(arguments.length-2),Me=2;Me<arguments.length;Me++)at[Me-2]=arguments[Me];return u.prototype[G].apply(P,at)}}function b(o){const u=o.length;if(0<u){const x=Array(u);for(let P=0;P<u;P++)x[P]=o[P];return x}return[]}function v(o,u){for(let x=1;x<arguments.length;x++){const P=arguments[x];if(c(P)){const G=o.length||0,q=P.length||0;o.length=G+q;for(let at=0;at<q;at++)o[G+at]=P[at]}else o.push(P)}}class f{constructor(u,x){this.i=u,this.j=x,this.h=0,this.g=null}get(){let u;return 0<this.h?(this.h--,u=this.g,this.g=u.next,u.next=null):u=this.i(),u}}function D(o){return/^[\s\xa0]*$/.test(o)}function I(){var o=l.navigator;return o&&(o=o.userAgent)?o:""}function C(o){return C[" "](o),o}C[" "]=function(){};var z=I().indexOf("Gecko")!=-1&&!(I().toLowerCase().indexOf("webkit")!=-1&&I().indexOf("Edge")==-1)&&!(I().indexOf("Trident")!=-1||I().indexOf("MSIE")!=-1)&&I().indexOf("Edge")==-1;function N(o,u,x){for(const P in o)u.call(x,o[P],P,o)}function E(o,u){for(const x in o)u.call(void 0,o[x],x,o)}function S(o){const u={};for(const x in o)u[x]=o[x];return u}const g="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function _(o,u){let x,P;for(let G=1;G<arguments.length;G++){P=arguments[G];for(x in P)o[x]=P[x];for(let q=0;q<g.length;q++)x=g[q],Object.prototype.hasOwnProperty.call(P,x)&&(o[x]=P[x])}}function w(o){var u=1;o=o.split(":");const x=[];for(;0<u&&o.length;)x.push(o.shift()),u--;return o.length&&x.push(o.join(":")),x}function L(o){l.setTimeout(()=>{throw o},0)}function T(){var o=ut;let u=null;return o.g&&(u=o.g,o.g=o.g.next,o.g||(o.h=null),u.next=null),u}class K{constructor(){this.h=this.g=null}add(u,x){const P=Q.get();P.set(u,x),this.h?this.h.next=P:this.g=P,this.h=P}}var Q=new f(()=>new J,o=>o.reset());class J{constructor(){this.next=this.g=this.h=null}set(u,x){this.h=u,this.g=x,this.next=null}reset(){this.next=this.g=this.h=null}}let nt,$=!1,ut=new K,vt=()=>{const o=l.Promise.resolve(void 0);nt=()=>{o.then(Rt)}};var Rt=()=>{for(var o;o=T();){try{o.h.call(o.g)}catch(x){L(x)}var u=Q;u.j(o),100>u.h&&(u.h++,o.next=u.g,u.g=o)}$=!1};function Bt(){this.s=this.s,this.C=this.C}Bt.prototype.s=!1,Bt.prototype.ma=function(){this.s||(this.s=!0,this.N())},Bt.prototype.N=function(){if(this.C)for(;this.C.length;)this.C.shift()()};function kt(o,u){this.type=o,this.g=this.target=u,this.defaultPrevented=!1}kt.prototype.h=function(){this.defaultPrevented=!0};var Z=(function(){if(!l.addEventListener||!Object.defineProperty)return!1;var o=!1,u=Object.defineProperty({},"passive",{get:function(){o=!0}});try{const x=()=>{};l.addEventListener("test",x,u),l.removeEventListener("test",x,u)}catch{}return o})();function st(o,u){if(kt.call(this,o?o.type:""),this.relatedTarget=this.g=this.target=null,this.button=this.screenY=this.screenX=this.clientY=this.clientX=0,this.key="",this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1,this.state=null,this.pointerId=0,this.pointerType="",this.i=null,o){var x=this.type=o.type,P=o.changedTouches&&o.changedTouches.length?o.changedTouches[0]:null;if(this.target=o.target||o.srcElement,this.g=u,u=o.relatedTarget){if(z){t:{try{C(u.nodeName);var G=!0;break t}catch{}G=!1}G||(u=null)}}else x=="mouseover"?u=o.fromElement:x=="mouseout"&&(u=o.toElement);this.relatedTarget=u,P?(this.clientX=P.clientX!==void 0?P.clientX:P.pageX,this.clientY=P.clientY!==void 0?P.clientY:P.pageY,this.screenX=P.screenX||0,this.screenY=P.screenY||0):(this.clientX=o.clientX!==void 0?o.clientX:o.pageX,this.clientY=o.clientY!==void 0?o.clientY:o.pageY,this.screenX=o.screenX||0,this.screenY=o.screenY||0),this.button=o.button,this.key=o.key||"",this.ctrlKey=o.ctrlKey,this.altKey=o.altKey,this.shiftKey=o.shiftKey,this.metaKey=o.metaKey,this.pointerId=o.pointerId||0,this.pointerType=typeof o.pointerType=="string"?o.pointerType:At[o.pointerType]||"",this.state=o.state,this.i=o,o.defaultPrevented&&st.aa.h.call(this)}}M(st,kt);var At={2:"touch",3:"pen",4:"mouse"};st.prototype.h=function(){st.aa.h.call(this);var o=this.i;o.preventDefault?o.preventDefault():o.returnValue=!1};var ct="closure_listenable_"+(1e6*Math.random()|0),Ut=0;function zt(o,u,x,P,G){this.listener=o,this.proxy=null,this.src=u,this.type=x,this.capture=!!P,this.ha=G,this.key=++Ut,this.da=this.fa=!1}function Gt(o){o.da=!0,o.listener=null,o.proxy=null,o.src=null,o.ha=null}function pe(o){this.src=o,this.g={},this.h=0}pe.prototype.add=function(o,u,x,P,G){var q=o.toString();o=this.g[q],o||(o=this.g[q]=[],this.h++);var at=Ee(o,u,P,G);return-1<at?(u=o[at],x||(u.fa=!1)):(u=new zt(u,this.src,q,!!P,G),u.fa=x,o.push(u)),u};function qt(o,u){var x=u.type;if(x in o.g){var P=o.g[x],G=Array.prototype.indexOf.call(P,u,void 0),q;(q=0<=G)&&Array.prototype.splice.call(P,G,1),q&&(Gt(u),o.g[x].length==0&&(delete o.g[x],o.h--))}}function Ee(o,u,x,P){for(var G=0;G<o.length;++G){var q=o[G];if(!q.da&&q.listener==u&&q.capture==!!x&&q.ha==P)return G}return-1}var V="closure_lm_"+(1e6*Math.random()|0),Ve={};function jt(o,u,x,P,G){if(Array.isArray(u)){for(var q=0;q<u.length;q++)jt(o,u[q],x,P,G);return null}return x=it(x),o&&o[ct]?o.K(u,x,h(P)?!!P.capture:!1,G):$t(o,u,x,!1,P,G)}function $t(o,u,x,P,G,q){if(!u)throw Error("Invalid event type");var at=h(G)?!!G.capture:!!G,Me=H(o);if(Me||(o[V]=Me=new pe(o)),x=Me.add(u,x,P,at,q),x.proxy)return x;if(P=It(),x.proxy=P,P.src=o,P.listener=x,o.addEventListener)Z||(G=at),G===void 0&&(G=!1),o.addEventListener(u.toString(),P,G);else if(o.attachEvent)o.attachEvent(U(u.toString()),P);else if(o.addListener&&o.removeListener)o.addListener(P);else throw Error("addEventListener and attachEvent are unavailable.");return x}function It(){function o(x){return u.call(o.src,o.listener,x)}const u=A;return o}function me(o,u,x,P,G){if(Array.isArray(u))for(var q=0;q<u.length;q++)me(o,u[q],x,P,G);else P=h(P)?!!P.capture:!!P,x=it(x),o&&o[ct]?(o=o.i,u=String(u).toString(),u in o.g&&(q=o.g[u],x=Ee(q,x,P,G),-1<x&&(Gt(q[x]),Array.prototype.splice.call(q,x,1),q.length==0&&(delete o.g[u],o.h--)))):o&&(o=H(o))&&(u=o.g[u.toString()],o=-1,u&&(o=Ee(u,x,P,G)),(x=-1<o?u[o]:null)&&Pt(x))}function Pt(o){if(typeof o!="number"&&o&&!o.da){var u=o.src;if(u&&u[ct])qt(u.i,o);else{var x=o.type,P=o.proxy;u.removeEventListener?u.removeEventListener(x,P,o.capture):u.detachEvent?u.detachEvent(U(x),P):u.addListener&&u.removeListener&&u.removeListener(P),(x=H(u))?(qt(x,o),x.h==0&&(x.src=null,u[V]=null)):Gt(o)}}}function U(o){return o in Ve?Ve[o]:Ve[o]="on"+o}function A(o,u){if(o.da)o=!0;else{u=new st(u,this);var x=o.listener,P=o.ha||o.src;o.fa&&Pt(o),o=x.call(P,u)}return o}function H(o){return o=o[V],o instanceof pe?o:null}var tt="__closure_events_fn_"+(1e9*Math.random()>>>0);function it(o){return typeof o=="function"?o:(o[tt]||(o[tt]=function(u){return o.handleEvent(u)}),o[tt])}function Y(){Bt.call(this),this.i=new pe(this),this.M=this,this.F=null}M(Y,Bt),Y.prototype[ct]=!0,Y.prototype.removeEventListener=function(o,u,x,P){me(this,o,u,x,P)};function gt(o,u){var x,P=o.F;if(P)for(x=[];P;P=P.F)x.push(P);if(o=o.M,P=u.type||u,typeof u=="string")u=new kt(u,o);else if(u instanceof kt)u.target=u.target||o;else{var G=u;u=new kt(P,o),_(u,G)}if(G=!0,x)for(var q=x.length-1;0<=q;q--){var at=u.g=x[q];G=ht(at,P,!0,u)&&G}if(at=u.g=o,G=ht(at,P,!0,u)&&G,G=ht(at,P,!1,u)&&G,x)for(q=0;q<x.length;q++)at=u.g=x[q],G=ht(at,P,!1,u)&&G}Y.prototype.N=function(){if(Y.aa.N.call(this),this.i){var o=this.i,u;for(u in o.g){for(var x=o.g[u],P=0;P<x.length;P++)Gt(x[P]);delete o.g[u],o.h--}}this.F=null},Y.prototype.K=function(o,u,x,P){return this.i.add(String(o),u,!1,x,P)},Y.prototype.L=function(o,u,x,P){return this.i.add(String(o),u,!0,x,P)};function ht(o,u,x,P){if(u=o.i.g[String(u)],!u)return!0;u=u.concat();for(var G=!0,q=0;q<u.length;++q){var at=u[q];if(at&&!at.da&&at.capture==x){var Me=at.listener,ze=at.ha||at.src;at.fa&&qt(o.i,at),G=Me.call(ze,P)!==!1&&G}}return G&&!P.defaultPrevented}function yt(o,u,x){if(typeof o=="function")x&&(o=m(o,x));else if(o&&typeof o.handleEvent=="function")o=m(o.handleEvent,o);else throw Error("Invalid listener argument");return 2147483647<Number(u)?-1:l.setTimeout(o,u||0)}function Yt(o){o.g=yt(()=>{o.g=null,o.i&&(o.i=!1,Yt(o))},o.l);const u=o.h;o.h=null,o.m.apply(null,u)}class rt extends Bt{constructor(u,x){super(),this.m=u,this.l=x,this.h=null,this.i=!1,this.g=null}j(u){this.h=arguments,this.g?this.i=!0:Yt(this)}N(){super.N(),this.g&&(l.clearTimeout(this.g),this.g=null,this.i=!1,this.h=null)}}function _t(o){Bt.call(this),this.h=o,this.g={}}M(_t,Bt);var Dt=[];function Ot(o){N(o.g,function(u,x){this.g.hasOwnProperty(x)&&Pt(u)},o),o.g={}}_t.prototype.N=function(){_t.aa.N.call(this),Ot(this)},_t.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented")};var xt=l.JSON.stringify,Kt=l.JSON.parse,Ht=class{stringify(o){return l.JSON.stringify(o,void 0)}parse(o){return l.JSON.parse(o,void 0)}};function ae(){}ae.prototype.h=null;function F(o){return o.h||(o.h=o.i())}function pt(){}var j={OPEN:"a",kb:"b",Ja:"c",wb:"d"};function et(){kt.call(this,"d")}M(et,kt);function mt(){kt.call(this,"c")}M(mt,kt);var lt={},Vt=null;function Se(){return Vt=Vt||new Y}lt.La="serverreachability";function Le(o){kt.call(this,lt.La,o)}M(Le,kt);function Jt(o){const u=Se();gt(u,new Le(u))}lt.STAT_EVENT="statevent";function tn(o,u){kt.call(this,lt.STAT_EVENT,o),this.stat=u}M(tn,kt);function be(o){const u=Se();gt(u,new tn(u,o))}lt.Ma="timingevent";function Ks(o,u){kt.call(this,lt.Ma,o),this.size=u}M(Ks,kt);function ai(o,u){if(typeof o!="function")throw Error("Fn must not be null and must be a function");return l.setTimeout(function(){o()},u)}function en(){this.g=!0}en.prototype.xa=function(){this.g=!1};function Js(o,u,x,P,G,q){o.info(function(){if(o.g)if(q)for(var at="",Me=q.split("&"),ze=0;ze<Me.length;ze++){var ie=Me[ze].split("=");if(1<ie.length){var He=ie[0];ie=ie[1];var We=He.split("_");at=2<=We.length&&We[1]=="type"?at+(He+"="+ie+"&"):at+(He+"=redacted&")}}else at=null;else at=q;return"XMLHTTP REQ ("+P+") [attempt "+G+"]: "+u+`
`+x+`
`+at})}function Ur(o,u,x,P,G,q,at){o.info(function(){return"XMLHTTP RESP ("+P+") [ attempt "+G+"]: "+u+`
`+x+`
`+q+" "+at})}function Hn(o,u,x,P){o.info(function(){return"XMLHTTP TEXT ("+u+"): "+Nr(o,x)+(P?" "+P:"")})}function ts(o,u){o.info(function(){return"TIMEOUT: "+u})}en.prototype.info=function(){};function Nr(o,u){if(!o.g)return u;if(!u)return null;try{var x=JSON.parse(u);if(x){for(o=0;o<x.length;o++)if(Array.isArray(x[o])){var P=x[o];if(!(2>P.length)){var G=P[1];if(Array.isArray(G)&&!(1>G.length)){var q=G[0];if(q!="noop"&&q!="stop"&&q!="close")for(var at=1;at<G.length;at++)G[at]=""}}}}return xt(x)}catch{return u}}var li={NO_ERROR:0,TIMEOUT:8},Or={},es;function ns(){}M(ns,ae),ns.prototype.g=function(){return new XMLHttpRequest},ns.prototype.i=function(){return{}},es=new ns;function Dn(o,u,x,P){this.j=o,this.i=u,this.l=x,this.R=P||1,this.U=new _t(this),this.I=45e3,this.H=null,this.o=!1,this.m=this.A=this.v=this.L=this.F=this.S=this.B=null,this.D=[],this.g=null,this.C=0,this.s=this.u=null,this.X=-1,this.J=!1,this.O=0,this.M=null,this.W=this.K=this.T=this.P=!1,this.h=new Fr}function Fr(){this.i=null,this.g="",this.h=!1}var R={},B={};function W(o,u,x){o.L=1,o.v=Br(Ye(u)),o.m=x,o.P=!0,X(o,null)}function X(o,u){o.F=Date.now(),dt(o),o.A=Ye(o.v);var x=o.A,P=o.R;Array.isArray(P)||(P=[String(P)]),Uc(x.i,"t",P),o.C=0,x=o.j.J,o.h=new Fr,o.g=Zc(o.j,x?u:null,!o.m),0<o.O&&(o.M=new rt(m(o.Y,o,o.g),o.O)),u=o.U,x=o.g,P=o.ca;var G="readystatechange";Array.isArray(G)||(G&&(Dt[0]=G.toString()),G=Dt);for(var q=0;q<G.length;q++){var at=jt(x,G[q],P||u.handleEvent,!1,u.h||u);if(!at)break;u.g[at.key]=at}u=o.H?S(o.H):{},o.m?(o.u||(o.u="POST"),u["Content-Type"]="application/x-www-form-urlencoded",o.g.ea(o.A,o.u,o.m,u)):(o.u="GET",o.g.ea(o.A,o.u,null,u)),Jt(),Js(o.i,o.u,o.A,o.l,o.R,o.m)}Dn.prototype.ca=function(o){o=o.target;const u=this.M;u&&Wn(o)==3?u.j():this.Y(o)},Dn.prototype.Y=function(o){try{if(o==this.g)t:{const We=Wn(this.g);var u=this.g.Ba();const rs=this.g.Z();if(!(3>We)&&(We!=3||this.g&&(this.h.h||this.g.oa()||Vc(this.g)))){this.J||We!=4||u==7||(u==8||0>=rs?Jt(3):Jt(2)),St(this);var x=this.g.Z();this.X=x;e:if(k(this)){var P=Vc(this.g);o="";var G=P.length,q=Wn(this.g)==4;if(!this.h.i){if(typeof TextDecoder>"u"){Nt(this),Lt(this);var at="";break e}this.h.i=new l.TextDecoder}for(u=0;u<G;u++)this.h.h=!0,o+=this.h.i.decode(P[u],{stream:!(q&&u==G-1)});P.length=0,this.h.g+=o,this.C=0,at=this.h.g}else at=this.g.oa();if(this.o=x==200,Ur(this.i,this.u,this.A,this.l,this.R,We,x),this.o){if(this.T&&!this.K){e:{if(this.g){var Me,ze=this.g;if((Me=ze.g?ze.g.getResponseHeader("X-HTTP-Initial-Response"):null)&&!D(Me)){var ie=Me;break e}}ie=null}if(x=ie)Hn(this.i,this.l,x,"Initial handshake response via X-HTTP-Initial-Response"),this.K=!0,Et(this,x);else{this.o=!1,this.s=3,be(12),Nt(this),Lt(this);break t}}if(this.P){x=!0;let xn;for(;!this.J&&this.C<at.length;)if(xn=ot(this,at),xn==B){We==4&&(this.s=4,be(14),x=!1),Hn(this.i,this.l,null,"[Incomplete Response]");break}else if(xn==R){this.s=4,be(15),Hn(this.i,this.l,at,"[Invalid Chunk]"),x=!1;break}else Hn(this.i,this.l,xn,null),Et(this,xn);if(k(this)&&this.C!=0&&(this.h.g=this.h.g.slice(this.C),this.C=0),We!=4||at.length!=0||this.h.h||(this.s=1,be(16),x=!1),this.o=this.o&&x,!x)Hn(this.i,this.l,at,"[Invalid Chunked Response]"),Nt(this),Lt(this);else if(0<at.length&&!this.W){this.W=!0;var He=this.j;He.g==this&&He.ba&&!He.M&&(He.j.info("Great, no buffering proxy detected. Bytes received: "+at.length),ua(He),He.M=!0,be(11))}}else Hn(this.i,this.l,at,null),Et(this,at);We==4&&Nt(this),this.o&&!this.J&&(We==4?$c(this.j,this):(this.o=!1,dt(this)))}else $f(this.g),x==400&&0<at.indexOf("Unknown SID")?(this.s=3,be(12)):(this.s=0,be(13)),Nt(this),Lt(this)}}}catch{}finally{}};function k(o){return o.g?o.u=="GET"&&o.L!=2&&o.j.Ca:!1}function ot(o,u){var x=o.C,P=u.indexOf(`
`,x);return P==-1?B:(x=Number(u.substring(x,P)),isNaN(x)?R:(P+=1,P+x>u.length?B:(u=u.slice(P,P+x),o.C=P+x,u)))}Dn.prototype.cancel=function(){this.J=!0,Nt(this)};function dt(o){o.S=Date.now()+o.I,wt(o,o.I)}function wt(o,u){if(o.B!=null)throw Error("WatchDog timer not null");o.B=ai(m(o.ba,o),u)}function St(o){o.B&&(l.clearTimeout(o.B),o.B=null)}Dn.prototype.ba=function(){this.B=null;const o=Date.now();0<=o-this.S?(ts(this.i,this.A),this.L!=2&&(Jt(),be(17)),Nt(this),this.s=2,Lt(this)):wt(this,this.S-o)};function Lt(o){o.j.G==0||o.J||$c(o.j,o)}function Nt(o){St(o);var u=o.M;u&&typeof u.ma=="function"&&u.ma(),o.M=null,Ot(o.U),o.g&&(u=o.g,o.g=null,u.abort(),u.ma())}function Et(o,u){try{var x=o.j;if(x.G!=0&&(x.g==o||Qt(x.h,o))){if(!o.K&&Qt(x.h,o)&&x.G==3){try{var P=x.Da.g.parse(u)}catch{P=null}if(Array.isArray(P)&&P.length==3){var G=P;if(G[0]==0){t:if(!x.u){if(x.g)if(x.g.F+3e3<o.F)Wr(x),Gr(x);else break t;ha(x),be(18)}}else x.za=G[1],0<x.za-x.T&&37500>G[2]&&x.F&&x.v==0&&!x.C&&(x.C=ai(m(x.Za,x),6e3));if(1>=Be(x.h)&&x.ca){try{x.ca()}catch{}x.ca=void 0}}else Ci(x,11)}else if((o.K||x.g==o)&&Wr(x),!D(u))for(G=x.Da.g.parse(u),u=0;u<G.length;u++){let ie=G[u];if(x.T=ie[0],ie=ie[1],x.G==2)if(ie[0]=="c"){x.K=ie[1],x.ia=ie[2];const He=ie[3];He!=null&&(x.la=He,x.j.info("VER="+x.la));const We=ie[4];We!=null&&(x.Aa=We,x.j.info("SVER="+x.Aa));const rs=ie[5];rs!=null&&typeof rs=="number"&&0<rs&&(P=1.5*rs,x.L=P,x.j.info("backChannelRequestTimeoutMs_="+P)),P=x;const xn=o.g;if(xn){const Xr=xn.g?xn.g.getResponseHeader("X-Client-Wire-Protocol"):null;if(Xr){var q=P.h;q.g||Xr.indexOf("spdy")==-1&&Xr.indexOf("quic")==-1&&Xr.indexOf("h2")==-1||(q.j=q.l,q.g=new Set,q.h&&(Tt(q,q.h),q.h=null))}if(P.D){const da=xn.g?xn.g.getResponseHeader("X-HTTP-Session-Id"):null;da&&(P.ya=da,_e(P.I,P.D,da))}}x.G=3,x.l&&x.l.ua(),x.ba&&(x.R=Date.now()-o.F,x.j.info("Handshake RTT: "+x.R+"ms")),P=x;var at=o;if(P.qa=Jc(P,P.J?P.ia:null,P.W),at.K){un(P.h,at);var Me=at,ze=P.L;ze&&(Me.I=ze),Me.B&&(St(Me),dt(Me)),P.g=at}else qc(P);0<x.i.length&&Hr(x)}else ie[0]!="stop"&&ie[0]!="close"||Ci(x,7);else x.G==3&&(ie[0]=="stop"||ie[0]=="close"?ie[0]=="stop"?Ci(x,7):ca(x):ie[0]!="noop"&&x.l&&x.l.ta(ie),x.v=0)}}Jt(4)}catch{}}var Zt=class{constructor(o,u){this.g=o,this.map=u}};function ce(o){this.l=o||10,l.PerformanceNavigationTiming?(o=l.performance.getEntriesByType("navigation"),o=0<o.length&&(o[0].nextHopProtocol=="hq"||o[0].nextHopProtocol=="h2")):o=!!(l.chrome&&l.chrome.loadTimes&&l.chrome.loadTimes()&&l.chrome.loadTimes().wasFetchedViaSpdy),this.j=o?this.l:1,this.g=null,1<this.j&&(this.g=new Set),this.h=null,this.i=[]}function ge(o){return o.h?!0:o.g?o.g.size>=o.j:!1}function Be(o){return o.h?1:o.g?o.g.size:0}function Qt(o,u){return o.h?o.h==u:o.g?o.g.has(u):!1}function Tt(o,u){o.g?o.g.add(u):o.h=u}function un(o,u){o.h&&o.h==u?o.h=null:o.g&&o.g.has(u)&&o.g.delete(u)}ce.prototype.cancel=function(){if(this.i=ne(this),this.h)this.h.cancel(),this.h=null;else if(this.g&&this.g.size!==0){for(const o of this.g.values())o.cancel();this.g.clear()}};function ne(o){if(o.h!=null)return o.i.concat(o.h.D);if(o.g!=null&&o.g.size!==0){let u=o.i;for(const x of o.g.values())u=u.concat(x.D);return u}return b(o.i)}function nn(o){if(o.V&&typeof o.V=="function")return o.V();if(typeof Map<"u"&&o instanceof Map||typeof Set<"u"&&o instanceof Set)return Array.from(o.values());if(typeof o=="string")return o.split("");if(c(o)){for(var u=[],x=o.length,P=0;P<x;P++)u.push(o[P]);return u}u=[],x=0;for(P in o)u[x++]=o[P];return u}function ci(o){if(o.na&&typeof o.na=="function")return o.na();if(!o.V||typeof o.V!="function"){if(typeof Map<"u"&&o instanceof Map)return Array.from(o.keys());if(!(typeof Set<"u"&&o instanceof Set)){if(c(o)||typeof o=="string"){var u=[];o=o.length;for(var x=0;x<o;x++)u.push(x);return u}u=[],x=0;for(const P in o)u[x++]=P;return u}}}function Ge(o,u){if(o.forEach&&typeof o.forEach=="function")o.forEach(u,void 0);else if(c(o)||typeof o=="string")Array.prototype.forEach.call(o,u,void 0);else for(var x=ci(o),P=nn(o),G=P.length,q=0;q<G;q++)u.call(void 0,P[q],x&&x[q],o)}var hi=RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");function xe(o,u){if(o){o=o.split("&");for(var x=0;x<o.length;x++){var P=o[x].indexOf("="),G=null;if(0<=P){var q=o[x].substring(0,P);G=o[x].substring(P+1)}else q=o[x];u(q,G?decodeURIComponent(G.replace(/\+/g," ")):"")}}}function Oe(o){if(this.g=this.o=this.j="",this.s=null,this.m=this.l="",this.h=!1,o instanceof Oe){this.h=o.h,ke(this,o.j),this.o=o.o,this.g=o.g,sn(this,o.s),this.l=o.l;var u=o.i,x=new tr;x.i=u.i,u.g&&(x.g=new Map(u.g),x.h=u.h),yn(this,x),this.m=o.m}else o&&(u=String(o).match(hi))?(this.h=!1,ke(this,u[1]||"",!0),this.o=Zs(u[2]||""),this.g=Zs(u[3]||"",!0),sn(this,u[4]),this.l=Zs(u[5]||"",!0),yn(this,u[6]||"",!0),this.m=Zs(u[7]||"")):(this.h=!1,this.i=new tr(null,this.h))}Oe.prototype.toString=function(){var o=[],u=this.j;u&&o.push(Qs(u,Ic,!0),":");var x=this.g;return(x||u=="file")&&(o.push("//"),(u=this.o)&&o.push(Qs(u,Ic,!0),"@"),o.push(encodeURIComponent(String(x)).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),x=this.s,x!=null&&o.push(":",String(x))),(x=this.l)&&(this.g&&x.charAt(0)!="/"&&o.push("/"),o.push(Qs(x,x.charAt(0)=="/"?Bf:Ff,!0))),(x=this.i.toString())&&o.push("?",x),(x=this.m)&&o.push("#",Qs(x,zf)),o.join("")};function Ye(o){return new Oe(o)}function ke(o,u,x){o.j=x?Zs(u,!0):u,o.j&&(o.j=o.j.replace(/:$/,""))}function sn(o,u){if(u){if(u=Number(u),isNaN(u)||0>u)throw Error("Bad port number "+u);o.s=u}else o.s=null}function yn(o,u,x){u instanceof tr?(o.i=u,Vf(o.i,o.h)):(x||(u=Qs(u,kf)),o.i=new tr(u,o.h))}function _e(o,u,x){o.i.set(u,x)}function Br(o){return _e(o,"zx",Math.floor(2147483648*Math.random()).toString(36)+Math.abs(Math.floor(2147483648*Math.random())^Date.now()).toString(36)),o}function Zs(o,u){return o?u?decodeURI(o.replace(/%25/g,"%2525")):decodeURIComponent(o):""}function Qs(o,u,x){return typeof o=="string"?(o=encodeURI(o).replace(u,Of),x&&(o=o.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),o):null}function Of(o){return o=o.charCodeAt(0),"%"+(o>>4&15).toString(16)+(o&15).toString(16)}var Ic=/[#\/\?@]/g,Ff=/[#\?:]/g,Bf=/[#\?]/g,kf=/[#\?@]/g,zf=/#/g;function tr(o,u){this.h=this.g=null,this.i=o||null,this.j=!!u}function ui(o){o.g||(o.g=new Map,o.h=0,o.i&&xe(o.i,function(u,x){o.add(decodeURIComponent(u.replace(/\+/g," ")),x)}))}i=tr.prototype,i.add=function(o,u){ui(this),this.i=null,o=is(this,o);var x=this.g.get(o);return x||this.g.set(o,x=[]),x.push(u),this.h+=1,this};function Dc(o,u){ui(o),u=is(o,u),o.g.has(u)&&(o.i=null,o.h-=o.g.get(u).length,o.g.delete(u))}function Lc(o,u){return ui(o),u=is(o,u),o.g.has(u)}i.forEach=function(o,u){ui(this),this.g.forEach(function(x,P){x.forEach(function(G){o.call(u,G,P,this)},this)},this)},i.na=function(){ui(this);const o=Array.from(this.g.values()),u=Array.from(this.g.keys()),x=[];for(let P=0;P<u.length;P++){const G=o[P];for(let q=0;q<G.length;q++)x.push(u[P])}return x},i.V=function(o){ui(this);let u=[];if(typeof o=="string")Lc(this,o)&&(u=u.concat(this.g.get(is(this,o))));else{o=Array.from(this.g.values());for(let x=0;x<o.length;x++)u=u.concat(o[x])}return u},i.set=function(o,u){return ui(this),this.i=null,o=is(this,o),Lc(this,o)&&(this.h-=this.g.get(o).length),this.g.set(o,[u]),this.h+=1,this},i.get=function(o,u){return o?(o=this.V(o),0<o.length?String(o[0]):u):u};function Uc(o,u,x){Dc(o,u),0<x.length&&(o.i=null,o.g.set(is(o,u),b(x)),o.h+=x.length)}i.toString=function(){if(this.i)return this.i;if(!this.g)return"";const o=[],u=Array.from(this.g.keys());for(var x=0;x<u.length;x++){var P=u[x];const q=encodeURIComponent(String(P)),at=this.V(P);for(P=0;P<at.length;P++){var G=q;at[P]!==""&&(G+="="+encodeURIComponent(String(at[P]))),o.push(G)}}return this.i=o.join("&")};function is(o,u){return u=String(u),o.j&&(u=u.toLowerCase()),u}function Vf(o,u){u&&!o.j&&(ui(o),o.i=null,o.g.forEach(function(x,P){var G=P.toLowerCase();P!=G&&(Dc(this,P),Uc(this,G,x))},o)),o.j=u}function Gf(o,u){const x=new en;if(l.Image){const P=new Image;P.onload=y(di,x,"TestLoadImage: loaded",!0,u,P),P.onerror=y(di,x,"TestLoadImage: error",!1,u,P),P.onabort=y(di,x,"TestLoadImage: abort",!1,u,P),P.ontimeout=y(di,x,"TestLoadImage: timeout",!1,u,P),l.setTimeout(function(){P.ontimeout&&P.ontimeout()},1e4),P.src=o}else u(!1)}function Hf(o,u){const x=new en,P=new AbortController,G=setTimeout(()=>{P.abort(),di(x,"TestPingServer: timeout",!1,u)},1e4);fetch(o,{signal:P.signal}).then(q=>{clearTimeout(G),q.ok?di(x,"TestPingServer: ok",!0,u):di(x,"TestPingServer: server error",!1,u)}).catch(()=>{clearTimeout(G),di(x,"TestPingServer: error",!1,u)})}function di(o,u,x,P,G){try{G&&(G.onload=null,G.onerror=null,G.onabort=null,G.ontimeout=null),P(x)}catch{}}function Wf(){this.g=new Ht}function Xf(o,u,x){const P=x||"";try{Ge(o,function(G,q){let at=G;h(G)&&(at=xt(G)),u.push(P+q+"="+encodeURIComponent(at))})}catch(G){throw u.push(P+"type="+encodeURIComponent("_badmap")),G}}function kr(o){this.l=o.Ub||null,this.j=o.eb||!1}M(kr,ae),kr.prototype.g=function(){return new zr(this.l,this.j)},kr.prototype.i=(function(o){return function(){return o}})({});function zr(o,u){Y.call(this),this.D=o,this.o=u,this.m=void 0,this.status=this.readyState=0,this.responseType=this.responseText=this.response=this.statusText="",this.onreadystatechange=null,this.u=new Headers,this.h=null,this.B="GET",this.A="",this.g=!1,this.v=this.j=this.l=null}M(zr,Y),i=zr.prototype,i.open=function(o,u){if(this.readyState!=0)throw this.abort(),Error("Error reopening a connection");this.B=o,this.A=u,this.readyState=1,nr(this)},i.send=function(o){if(this.readyState!=1)throw this.abort(),Error("need to call open() first. ");this.g=!0;const u={headers:this.u,method:this.B,credentials:this.m,cache:void 0};o&&(u.body=o),(this.D||l).fetch(new Request(this.A,u)).then(this.Sa.bind(this),this.ga.bind(this))},i.abort=function(){this.response=this.responseText="",this.u=new Headers,this.status=0,this.j&&this.j.cancel("Request was aborted.").catch(()=>{}),1<=this.readyState&&this.g&&this.readyState!=4&&(this.g=!1,er(this)),this.readyState=0},i.Sa=function(o){if(this.g&&(this.l=o,this.h||(this.status=this.l.status,this.statusText=this.l.statusText,this.h=o.headers,this.readyState=2,nr(this)),this.g&&(this.readyState=3,nr(this),this.g)))if(this.responseType==="arraybuffer")o.arrayBuffer().then(this.Qa.bind(this),this.ga.bind(this));else if(typeof l.ReadableStream<"u"&&"body"in o){if(this.j=o.body.getReader(),this.o){if(this.responseType)throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');this.response=[]}else this.response=this.responseText="",this.v=new TextDecoder;Nc(this)}else o.text().then(this.Ra.bind(this),this.ga.bind(this))};function Nc(o){o.j.read().then(o.Pa.bind(o)).catch(o.ga.bind(o))}i.Pa=function(o){if(this.g){if(this.o&&o.value)this.response.push(o.value);else if(!this.o){var u=o.value?o.value:new Uint8Array(0);(u=this.v.decode(u,{stream:!o.done}))&&(this.response=this.responseText+=u)}o.done?er(this):nr(this),this.readyState==3&&Nc(this)}},i.Ra=function(o){this.g&&(this.response=this.responseText=o,er(this))},i.Qa=function(o){this.g&&(this.response=o,er(this))},i.ga=function(){this.g&&er(this)};function er(o){o.readyState=4,o.l=null,o.j=null,o.v=null,nr(o)}i.setRequestHeader=function(o,u){this.u.append(o,u)},i.getResponseHeader=function(o){return this.h&&this.h.get(o.toLowerCase())||""},i.getAllResponseHeaders=function(){if(!this.h)return"";const o=[],u=this.h.entries();for(var x=u.next();!x.done;)x=x.value,o.push(x[0]+": "+x[1]),x=u.next();return o.join(`\r
`)};function nr(o){o.onreadystatechange&&o.onreadystatechange.call(o)}Object.defineProperty(zr.prototype,"withCredentials",{get:function(){return this.m==="include"},set:function(o){this.m=o?"include":"same-origin"}});function Oc(o){let u="";return N(o,function(x,P){u+=P,u+=":",u+=x,u+=`\r
`}),u}function la(o,u,x){t:{for(P in x){var P=!1;break t}P=!0}P||(x=Oc(x),typeof o=="string"?x!=null&&encodeURIComponent(String(x)):_e(o,u,x))}function Ae(o){Y.call(this),this.headers=new Map,this.o=o||null,this.h=!1,this.v=this.g=null,this.D="",this.m=0,this.l="",this.j=this.B=this.u=this.A=!1,this.I=null,this.H="",this.J=!1}M(Ae,Y);var qf=/^https?$/i,jf=["POST","PUT"];i=Ae.prototype,i.Ha=function(o){this.J=o},i.ea=function(o,u,x,P){if(this.g)throw Error("[goog.net.XhrIo] Object is active with another request="+this.D+"; newUri="+o);u=u?u.toUpperCase():"GET",this.D=o,this.l="",this.m=0,this.A=!1,this.h=!0,this.g=this.o?this.o.g():es.g(),this.v=this.o?F(this.o):F(es),this.g.onreadystatechange=m(this.Ea,this);try{this.B=!0,this.g.open(u,String(o),!0),this.B=!1}catch(q){Fc(this,q);return}if(o=x||"",x=new Map(this.headers),P)if(Object.getPrototypeOf(P)===Object.prototype)for(var G in P)x.set(G,P[G]);else if(typeof P.keys=="function"&&typeof P.get=="function")for(const q of P.keys())x.set(q,P.get(q));else throw Error("Unknown input type for opt_headers: "+String(P));P=Array.from(x.keys()).find(q=>q.toLowerCase()=="content-type"),G=l.FormData&&o instanceof l.FormData,!(0<=Array.prototype.indexOf.call(jf,u,void 0))||P||G||x.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");for(const[q,at]of x)this.g.setRequestHeader(q,at);this.H&&(this.g.responseType=this.H),"withCredentials"in this.g&&this.g.withCredentials!==this.J&&(this.g.withCredentials=this.J);try{zc(this),this.u=!0,this.g.send(o),this.u=!1}catch(q){Fc(this,q)}};function Fc(o,u){o.h=!1,o.g&&(o.j=!0,o.g.abort(),o.j=!1),o.l=u,o.m=5,Bc(o),Vr(o)}function Bc(o){o.A||(o.A=!0,gt(o,"complete"),gt(o,"error"))}i.abort=function(o){this.g&&this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1,this.m=o||7,gt(this,"complete"),gt(this,"abort"),Vr(this))},i.N=function(){this.g&&(this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1),Vr(this,!0)),Ae.aa.N.call(this)},i.Ea=function(){this.s||(this.B||this.u||this.j?kc(this):this.bb())},i.bb=function(){kc(this)};function kc(o){if(o.h&&typeof a<"u"&&(!o.v[1]||Wn(o)!=4||o.Z()!=2)){if(o.u&&Wn(o)==4)yt(o.Ea,0,o);else if(gt(o,"readystatechange"),Wn(o)==4){o.h=!1;try{const at=o.Z();t:switch(at){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:var u=!0;break t;default:u=!1}var x;if(!(x=u)){var P;if(P=at===0){var G=String(o.D).match(hi)[1]||null;!G&&l.self&&l.self.location&&(G=l.self.location.protocol.slice(0,-1)),P=!qf.test(G?G.toLowerCase():"")}x=P}if(x)gt(o,"complete"),gt(o,"success");else{o.m=6;try{var q=2<Wn(o)?o.g.statusText:""}catch{q=""}o.l=q+" ["+o.Z()+"]",Bc(o)}}finally{Vr(o)}}}}function Vr(o,u){if(o.g){zc(o);const x=o.g,P=o.v[0]?()=>{}:null;o.g=null,o.v=null,u||gt(o,"ready");try{x.onreadystatechange=P}catch{}}}function zc(o){o.I&&(l.clearTimeout(o.I),o.I=null)}i.isActive=function(){return!!this.g};function Wn(o){return o.g?o.g.readyState:0}i.Z=function(){try{return 2<Wn(this)?this.g.status:-1}catch{return-1}},i.oa=function(){try{return this.g?this.g.responseText:""}catch{return""}},i.Oa=function(o){if(this.g){var u=this.g.responseText;return o&&u.indexOf(o)==0&&(u=u.substring(o.length)),Kt(u)}};function Vc(o){try{if(!o.g)return null;if("response"in o.g)return o.g.response;switch(o.H){case"":case"text":return o.g.responseText;case"arraybuffer":if("mozResponseArrayBuffer"in o.g)return o.g.mozResponseArrayBuffer}return null}catch{return null}}function $f(o){const u={};o=(o.g&&2<=Wn(o)&&o.g.getAllResponseHeaders()||"").split(`\r
`);for(let P=0;P<o.length;P++){if(D(o[P]))continue;var x=w(o[P]);const G=x[0];if(x=x[1],typeof x!="string")continue;x=x.trim();const q=u[G]||[];u[G]=q,q.push(x)}E(u,function(P){return P.join(", ")})}i.Ba=function(){return this.m},i.Ka=function(){return typeof this.l=="string"?this.l:String(this.l)};function ir(o,u,x){return x&&x.internalChannelParams&&x.internalChannelParams[o]||u}function Gc(o){this.Aa=0,this.i=[],this.j=new en,this.ia=this.qa=this.I=this.W=this.g=this.ya=this.D=this.H=this.m=this.S=this.o=null,this.Ya=this.U=0,this.Va=ir("failFast",!1,o),this.F=this.C=this.u=this.s=this.l=null,this.X=!0,this.za=this.T=-1,this.Y=this.v=this.B=0,this.Ta=ir("baseRetryDelayMs",5e3,o),this.cb=ir("retryDelaySeedMs",1e4,o),this.Wa=ir("forwardChannelMaxRetries",2,o),this.wa=ir("forwardChannelRequestTimeoutMs",2e4,o),this.pa=o&&o.xmlHttpFactory||void 0,this.Xa=o&&o.Tb||void 0,this.Ca=o&&o.useFetchStreams||!1,this.L=void 0,this.J=o&&o.supportsCrossDomainXhr||!1,this.K="",this.h=new ce(o&&o.concurrentRequestLimit),this.Da=new Wf,this.P=o&&o.fastHandshake||!1,this.O=o&&o.encodeInitMessageHeaders||!1,this.P&&this.O&&(this.O=!1),this.Ua=o&&o.Rb||!1,o&&o.xa&&this.j.xa(),o&&o.forceLongPolling&&(this.X=!1),this.ba=!this.P&&this.X&&o&&o.detectBufferingProxy||!1,this.ja=void 0,o&&o.longPollingTimeout&&0<o.longPollingTimeout&&(this.ja=o.longPollingTimeout),this.ca=void 0,this.R=0,this.M=!1,this.ka=this.A=null}i=Gc.prototype,i.la=8,i.G=1,i.connect=function(o,u,x,P){be(0),this.W=o,this.H=u||{},x&&P!==void 0&&(this.H.OSID=x,this.H.OAID=P),this.F=this.X,this.I=Jc(this,null,this.W),Hr(this)};function ca(o){if(Hc(o),o.G==3){var u=o.U++,x=Ye(o.I);if(_e(x,"SID",o.K),_e(x,"RID",u),_e(x,"TYPE","terminate"),sr(o,x),u=new Dn(o,o.j,u),u.L=2,u.v=Br(Ye(x)),x=!1,l.navigator&&l.navigator.sendBeacon)try{x=l.navigator.sendBeacon(u.v.toString(),"")}catch{}!x&&l.Image&&(new Image().src=u.v,x=!0),x||(u.g=Zc(u.j,null),u.g.ea(u.v)),u.F=Date.now(),dt(u)}Kc(o)}function Gr(o){o.g&&(ua(o),o.g.cancel(),o.g=null)}function Hc(o){Gr(o),o.u&&(l.clearTimeout(o.u),o.u=null),Wr(o),o.h.cancel(),o.s&&(typeof o.s=="number"&&l.clearTimeout(o.s),o.s=null)}function Hr(o){if(!ge(o.h)&&!o.s){o.s=!0;var u=o.Ga;nt||vt(),$||(nt(),$=!0),ut.add(u,o),o.B=0}}function Yf(o,u){return Be(o.h)>=o.h.j-(o.s?1:0)?!1:o.s?(o.i=u.D.concat(o.i),!0):o.G==1||o.G==2||o.B>=(o.Va?0:o.Wa)?!1:(o.s=ai(m(o.Ga,o,u),Yc(o,o.B)),o.B++,!0)}i.Ga=function(o){if(this.s)if(this.s=null,this.G==1){if(!o){this.U=Math.floor(1e5*Math.random()),o=this.U++;const G=new Dn(this,this.j,o);let q=this.o;if(this.S&&(q?(q=S(q),_(q,this.S)):q=this.S),this.m!==null||this.O||(G.H=q,q=null),this.P)t:{for(var u=0,x=0;x<this.i.length;x++){e:{var P=this.i[x];if("__data__"in P.map&&(P=P.map.__data__,typeof P=="string")){P=P.length;break e}P=void 0}if(P===void 0)break;if(u+=P,4096<u){u=x;break t}if(u===4096||x===this.i.length-1){u=x+1;break t}}u=1e3}else u=1e3;u=Xc(this,G,u),x=Ye(this.I),_e(x,"RID",o),_e(x,"CVER",22),this.D&&_e(x,"X-HTTP-Session-Id",this.D),sr(this,x),q&&(this.O?u="headers="+encodeURIComponent(String(Oc(q)))+"&"+u:this.m&&la(x,this.m,q)),Tt(this.h,G),this.Ua&&_e(x,"TYPE","init"),this.P?(_e(x,"$req",u),_e(x,"SID","null"),G.T=!0,W(G,x,null)):W(G,x,u),this.G=2}}else this.G==3&&(o?Wc(this,o):this.i.length==0||ge(this.h)||Wc(this))};function Wc(o,u){var x;u?x=u.l:x=o.U++;const P=Ye(o.I);_e(P,"SID",o.K),_e(P,"RID",x),_e(P,"AID",o.T),sr(o,P),o.m&&o.o&&la(P,o.m,o.o),x=new Dn(o,o.j,x,o.B+1),o.m===null&&(x.H=o.o),u&&(o.i=u.D.concat(o.i)),u=Xc(o,x,1e3),x.I=Math.round(.5*o.wa)+Math.round(.5*o.wa*Math.random()),Tt(o.h,x),W(x,P,u)}function sr(o,u){o.H&&N(o.H,function(x,P){_e(u,P,x)}),o.l&&Ge({},function(x,P){_e(u,P,x)})}function Xc(o,u,x){x=Math.min(o.i.length,x);var P=o.l?m(o.l.Na,o.l,o):null;t:{var G=o.i;let q=-1;for(;;){const at=["count="+x];q==-1?0<x?(q=G[0].g,at.push("ofs="+q)):q=0:at.push("ofs="+q);let Me=!0;for(let ze=0;ze<x;ze++){let ie=G[ze].g;const He=G[ze].map;if(ie-=q,0>ie)q=Math.max(0,G[ze].g-100),Me=!1;else try{Xf(He,at,"req"+ie+"_")}catch{P&&P(He)}}if(Me){P=at.join("&");break t}}}return o=o.i.splice(0,x),u.D=o,P}function qc(o){if(!o.g&&!o.u){o.Y=1;var u=o.Fa;nt||vt(),$||(nt(),$=!0),ut.add(u,o),o.v=0}}function ha(o){return o.g||o.u||3<=o.v?!1:(o.Y++,o.u=ai(m(o.Fa,o),Yc(o,o.v)),o.v++,!0)}i.Fa=function(){if(this.u=null,jc(this),this.ba&&!(this.M||this.g==null||0>=this.R)){var o=2*this.R;this.j.info("BP detection timer enabled: "+o),this.A=ai(m(this.ab,this),o)}},i.ab=function(){this.A&&(this.A=null,this.j.info("BP detection timeout reached."),this.j.info("Buffering proxy detected and switch to long-polling!"),this.F=!1,this.M=!0,be(10),Gr(this),jc(this))};function ua(o){o.A!=null&&(l.clearTimeout(o.A),o.A=null)}function jc(o){o.g=new Dn(o,o.j,"rpc",o.Y),o.m===null&&(o.g.H=o.o),o.g.O=0;var u=Ye(o.qa);_e(u,"RID","rpc"),_e(u,"SID",o.K),_e(u,"AID",o.T),_e(u,"CI",o.F?"0":"1"),!o.F&&o.ja&&_e(u,"TO",o.ja),_e(u,"TYPE","xmlhttp"),sr(o,u),o.m&&o.o&&la(u,o.m,o.o),o.L&&(o.g.I=o.L);var x=o.g;o=o.ia,x.L=1,x.v=Br(Ye(u)),x.m=null,x.P=!0,X(x,o)}i.Za=function(){this.C!=null&&(this.C=null,Gr(this),ha(this),be(19))};function Wr(o){o.C!=null&&(l.clearTimeout(o.C),o.C=null)}function $c(o,u){var x=null;if(o.g==u){Wr(o),ua(o),o.g=null;var P=2}else if(Qt(o.h,u))x=u.D,un(o.h,u),P=1;else return;if(o.G!=0){if(u.o)if(P==1){x=u.m?u.m.length:0,u=Date.now()-u.F;var G=o.B;P=Se(),gt(P,new Ks(P,x)),Hr(o)}else qc(o);else if(G=u.s,G==3||G==0&&0<u.X||!(P==1&&Yf(o,u)||P==2&&ha(o)))switch(x&&0<x.length&&(u=o.h,u.i=u.i.concat(x)),G){case 1:Ci(o,5);break;case 4:Ci(o,10);break;case 3:Ci(o,6);break;default:Ci(o,2)}}}function Yc(o,u){let x=o.Ta+Math.floor(Math.random()*o.cb);return o.isActive()||(x*=2),x*u}function Ci(o,u){if(o.j.info("Error code "+u),u==2){var x=m(o.fb,o),P=o.Xa;const G=!P;P=new Oe(P||"//www.google.com/images/cleardot.gif"),l.location&&l.location.protocol=="http"||ke(P,"https"),Br(P),G?Gf(P.toString(),x):Hf(P.toString(),x)}else be(2);o.G=0,o.l&&o.l.sa(u),Kc(o),Hc(o)}i.fb=function(o){o?(this.j.info("Successfully pinged google.com"),be(2)):(this.j.info("Failed to ping google.com"),be(1))};function Kc(o){if(o.G=0,o.ka=[],o.l){const u=ne(o.h);(u.length!=0||o.i.length!=0)&&(v(o.ka,u),v(o.ka,o.i),o.h.i.length=0,b(o.i),o.i.length=0),o.l.ra()}}function Jc(o,u,x){var P=x instanceof Oe?Ye(x):new Oe(x);if(P.g!="")u&&(P.g=u+"."+P.g),sn(P,P.s);else{var G=l.location;P=G.protocol,u=u?u+"."+G.hostname:G.hostname,G=+G.port;var q=new Oe(null);P&&ke(q,P),u&&(q.g=u),G&&sn(q,G),x&&(q.l=x),P=q}return x=o.D,u=o.ya,x&&u&&_e(P,x,u),_e(P,"VER",o.la),sr(o,P),P}function Zc(o,u,x){if(u&&!o.J)throw Error("Can't create secondary domain capable XhrIo object.");return u=o.Ca&&!o.pa?new Ae(new kr({eb:x})):new Ae(o.pa),u.Ha(o.J),u}i.isActive=function(){return!!this.l&&this.l.isActive(this)};function Qc(){}i=Qc.prototype,i.ua=function(){},i.ta=function(){},i.sa=function(){},i.ra=function(){},i.isActive=function(){return!0},i.Na=function(){};function dn(o,u){Y.call(this),this.g=new Gc(u),this.l=o,this.h=u&&u.messageUrlParams||null,o=u&&u.messageHeaders||null,u&&u.clientProtocolHeaderRequired&&(o?o["X-Client-Protocol"]="webchannel":o={"X-Client-Protocol":"webchannel"}),this.g.o=o,o=u&&u.initMessageHeaders||null,u&&u.messageContentType&&(o?o["X-WebChannel-Content-Type"]=u.messageContentType:o={"X-WebChannel-Content-Type":u.messageContentType}),u&&u.va&&(o?o["X-WebChannel-Client-Profile"]=u.va:o={"X-WebChannel-Client-Profile":u.va}),this.g.S=o,(o=u&&u.Sb)&&!D(o)&&(this.g.m=o),this.v=u&&u.supportsCrossDomainXhr||!1,this.u=u&&u.sendRawJson||!1,(u=u&&u.httpSessionIdParam)&&!D(u)&&(this.g.D=u,o=this.h,o!==null&&u in o&&(o=this.h,u in o&&delete o[u])),this.j=new ss(this)}M(dn,Y),dn.prototype.m=function(){this.g.l=this.j,this.v&&(this.g.J=!0),this.g.connect(this.l,this.h||void 0)},dn.prototype.close=function(){ca(this.g)},dn.prototype.o=function(o){var u=this.g;if(typeof o=="string"){var x={};x.__data__=o,o=x}else this.u&&(x={},x.__data__=xt(o),o=x);u.i.push(new Zt(u.Ya++,o)),u.G==3&&Hr(u)},dn.prototype.N=function(){this.g.l=null,delete this.j,ca(this.g),delete this.g,dn.aa.N.call(this)};function th(o){et.call(this),o.__headers__&&(this.headers=o.__headers__,this.statusCode=o.__status__,delete o.__headers__,delete o.__status__);var u=o.__sm__;if(u){t:{for(const x in u){o=x;break t}o=void 0}(this.i=o)&&(o=this.i,u=u!==null&&o in u?u[o]:void 0),this.data=u}else this.data=o}M(th,et);function eh(){mt.call(this),this.status=1}M(eh,mt);function ss(o){this.g=o}M(ss,Qc),ss.prototype.ua=function(){gt(this.g,"a")},ss.prototype.ta=function(o){gt(this.g,new th(o))},ss.prototype.sa=function(o){gt(this.g,new eh)},ss.prototype.ra=function(){gt(this.g,"b")},dn.prototype.send=dn.prototype.o,dn.prototype.open=dn.prototype.m,dn.prototype.close=dn.prototype.close,li.NO_ERROR=0,li.TIMEOUT=8,li.HTTP_ERROR=6,Or.COMPLETE="complete",pt.EventType=j,j.OPEN="a",j.CLOSE="b",j.ERROR="c",j.MESSAGE="d",Y.prototype.listen=Y.prototype.K,Ae.prototype.listenOnce=Ae.prototype.L,Ae.prototype.getLastError=Ae.prototype.Ka,Ae.prototype.getLastErrorCode=Ae.prototype.Ba,Ae.prototype.getStatus=Ae.prototype.Z,Ae.prototype.getResponseJson=Ae.prototype.Oa,Ae.prototype.getResponseText=Ae.prototype.oa,Ae.prototype.send=Ae.prototype.ea,Ae.prototype.setWithCredentials=Ae.prototype.Ha}).apply(typeof $r<"u"?$r:typeof self<"u"?self:typeof window<"u"?window:{});const bh="@firebase/firestore",wh="4.8.0";/**
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
 */class an{constructor(t){this.uid=t}isAuthenticated(){return this.uid!=null}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(t){return t.uid===this.uid}}an.UNAUTHENTICATED=new an(null),an.GOOGLE_CREDENTIALS=new an("google-credentials-uid"),an.FIRST_PARTY=new an("first-party-uid"),an.MOCK_USER=new an("mock-user");/**
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
 */let Qo="11.10.0";/**
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
 */const Go=new tc("@firebase/firestore");function Tn(i,...t){if(Go.logLevel<=de.DEBUG){const e=t.map(Hd);Go.debug(`Firestore (${Qo}): ${i}`,...e)}}function Gd(i,...t){if(Go.logLevel<=de.ERROR){const e=t.map(Hd);Go.error(`Firestore (${Qo}): ${i}`,...e)}}function Hd(i){if(typeof i=="string")return i;try{/**
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
 */function Ho(i,t,e){let n="Unexpected state";typeof t=="string"?n=t:e=t,Wd(i,n,e)}function Wd(i,t,e){let n=`FIRESTORE (${Qo}) INTERNAL ASSERTION FAILED: ${t} (ID: ${i.toString(16)})`;if(e!==void 0)try{n+=" CONTEXT: "+JSON.stringify(e)}catch{n+=" CONTEXT: "+e}throw Gd(n),new Error(n)}function xr(i,t,e,n){let s="Unexpected state";typeof e=="string"?s=e:n=e,i||Wd(t,s,n)}/**
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
 */const re={CANCELLED:"cancelled",INVALID_ARGUMENT:"invalid-argument",FAILED_PRECONDITION:"failed-precondition"};class oe extends wi{constructor(t,e){super(t,e),this.code=t,this.message=e,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}/**
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
 */class Mr{constructor(){this.promise=new Promise(((t,e)=>{this.resolve=t,this.reject=e}))}}/**
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
 */class hg{constructor(t,e){this.user=e,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${t}`)}}class ug{getToken(){return Promise.resolve(null)}invalidateToken(){}start(t,e){t.enqueueRetryable((()=>e(an.UNAUTHENTICATED)))}shutdown(){}}class dg{constructor(t){this.t=t,this.currentUser=an.UNAUTHENTICATED,this.i=0,this.forceRefresh=!1,this.auth=null}start(t,e){xr(this.o===void 0,42304);let n=this.i;const s=c=>this.i!==n?(n=this.i,e(c)):Promise.resolve();let r=new Mr;this.o=()=>{this.i++,this.currentUser=this.u(),r.resolve(),r=new Mr,t.enqueueRetryable((()=>s(this.currentUser)))};const a=()=>{const c=r;t.enqueueRetryable((async()=>{await c.promise,await s(this.currentUser)}))},l=c=>{Tn("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=c,this.o&&(this.auth.addAuthTokenListener(this.o),a())};this.t.onInit((c=>l(c))),setTimeout((()=>{if(!this.auth){const c=this.t.getImmediate({optional:!0});c?l(c):(Tn("FirebaseAuthCredentialsProvider","Auth not yet detected"),r.resolve(),r=new Mr)}}),0),a()}getToken(){const t=this.i,e=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(e).then((n=>this.i!==t?(Tn("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):n?(xr(typeof n.accessToken=="string",31837,{l:n}),new hg(n.accessToken,this.currentUser)):null)):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.o&&this.auth.removeAuthTokenListener(this.o),this.o=void 0}u(){const t=this.auth&&this.auth.getUid();return xr(t===null||typeof t=="string",2055,{h:t}),new an(t)}}class fg{constructor(t,e,n){this.P=t,this.T=e,this.I=n,this.type="FirstParty",this.user=an.FIRST_PARTY,this.A=new Map}R(){return this.I?this.I():null}get headers(){this.A.set("X-Goog-AuthUser",this.P);const t=this.R();return t&&this.A.set("Authorization",t),this.T&&this.A.set("X-Goog-Iam-Authorization-Token",this.T),this.A}}class pg{constructor(t,e,n){this.P=t,this.T=e,this.I=n}getToken(){return Promise.resolve(new fg(this.P,this.T,this.I))}start(t,e){t.enqueueRetryable((()=>e(an.FIRST_PARTY)))}shutdown(){}invalidateToken(){}}class Th{constructor(t){this.value=t,this.type="AppCheck",this.headers=new Map,t&&t.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class mg{constructor(t,e){this.V=e,this.forceRefresh=!1,this.appCheck=null,this.m=null,this.p=null,Bi(t)&&t.settings.appCheckToken&&(this.p=t.settings.appCheckToken)}start(t,e){xr(this.o===void 0,3512);const n=r=>{r.error!=null&&Tn("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${r.error.message}`);const a=r.token!==this.m;return this.m=r.token,Tn("FirebaseAppCheckTokenProvider",`Received ${a?"new":"existing"} token.`),a?e(r.token):Promise.resolve()};this.o=r=>{t.enqueueRetryable((()=>n(r)))};const s=r=>{Tn("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=r,this.o&&this.appCheck.addTokenListener(this.o)};this.V.onInit((r=>s(r))),setTimeout((()=>{if(!this.appCheck){const r=this.V.getImmediate({optional:!0});r?s(r):Tn("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}}),0)}getToken(){if(this.p)return Promise.resolve(new Th(this.p));const t=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(t).then((e=>e?(xr(typeof e.token=="string",44558,{tokenResult:e}),this.m=e.token,new Th(e.token)):null)):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.o&&this.appCheck.removeTokenListener(this.o),this.o=void 0}}/**
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
 */function gg(i){const t=typeof self<"u"&&(self.crypto||self.msCrypto),e=new Uint8Array(i);if(t&&typeof t.getRandomValues=="function")t.getRandomValues(e);else for(let n=0;n<i;n++)e[n]=Math.floor(256*Math.random());return e}/**
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
 */function _g(){return new TextEncoder}/**
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
 */class vg{static newId(){const t="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",e=62*Math.floor(4.129032258064516);let n="";for(;n.length<20;){const s=gg(40);for(let r=0;r<s.length;++r)n.length<20&&s[r]<e&&(n+=t.charAt(s[r]%62))}return n}}function Cn(i,t){return i<t?-1:i>t?1:0}function yg(i,t){let e=0;for(;e<i.length&&e<t.length;){const n=i.codePointAt(e),s=t.codePointAt(e);if(n!==s){if(n<128&&s<128)return Cn(n,s);{const r=_g(),a=xg(r.encode(Ah(i,e)),r.encode(Ah(t,e)));return a!==0?a:Cn(n,s)}}e+=n>65535?2:1}return Cn(i.length,t.length)}function Ah(i,t){return i.codePointAt(t)>65535?i.substring(t,t+2):i.substring(t,t+1)}function xg(i,t){for(let e=0;e<i.length&&e<t.length;++e)if(i[e]!==t[e])return Cn(i[e],t[e]);return Cn(i.length,t.length)}/**
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
 */const Ch="__name__";class Un{constructor(t,e,n){e===void 0?e=0:e>t.length&&Ho(637,{offset:e,range:t.length}),n===void 0?n=t.length-e:n>t.length-e&&Ho(1746,{length:n,range:t.length-e}),this.segments=t,this.offset=e,this.len=n}get length(){return this.len}isEqual(t){return Un.comparator(this,t)===0}child(t){const e=this.segments.slice(this.offset,this.limit());return t instanceof Un?t.forEach((n=>{e.push(n)})):e.push(t),this.construct(e)}limit(){return this.offset+this.length}popFirst(t){return t=t===void 0?1:t,this.construct(this.segments,this.offset+t,this.length-t)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(t){return this.segments[this.offset+t]}isEmpty(){return this.length===0}isPrefixOf(t){if(t.length<this.length)return!1;for(let e=0;e<this.length;e++)if(this.get(e)!==t.get(e))return!1;return!0}isImmediateParentOf(t){if(this.length+1!==t.length)return!1;for(let e=0;e<this.length;e++)if(this.get(e)!==t.get(e))return!1;return!0}forEach(t){for(let e=this.offset,n=this.limit();e<n;e++)t(this.segments[e])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(t,e){const n=Math.min(t.length,e.length);for(let s=0;s<n;s++){const r=Un.compareSegments(t.get(s),e.get(s));if(r!==0)return r}return Cn(t.length,e.length)}static compareSegments(t,e){const n=Un.isNumericId(t),s=Un.isNumericId(e);return n&&!s?-1:!n&&s?1:n&&s?Un.extractNumericId(t).compare(Un.extractNumericId(e)):yg(t,e)}static isNumericId(t){return t.startsWith("__id")&&t.endsWith("__")}static extractNumericId(t){return sc.fromString(t.substring(4,t.length-2))}}class bn extends Un{construct(t,e,n){return new bn(t,e,n)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...t){const e=[];for(const n of t){if(n.indexOf("//")>=0)throw new oe(re.INVALID_ARGUMENT,`Invalid segment (${n}). Paths must not contain // in them.`);e.push(...n.split("/").filter((s=>s.length>0)))}return new bn(e)}static emptyPath(){return new bn([])}}const Mg=/^[_a-zA-Z][_a-zA-Z0-9]*$/;class ki extends Un{construct(t,e,n){return new ki(t,e,n)}static isValidIdentifier(t){return Mg.test(t)}canonicalString(){return this.toArray().map((t=>(t=t.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),ki.isValidIdentifier(t)||(t="`"+t+"`"),t))).join(".")}toString(){return this.canonicalString()}isKeyField(){return this.length===1&&this.get(0)===Ch}static keyField(){return new ki([Ch])}static fromServerFormat(t){const e=[];let n="",s=0;const r=()=>{if(n.length===0)throw new oe(re.INVALID_ARGUMENT,`Invalid field path (${t}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);e.push(n),n=""};let a=!1;for(;s<t.length;){const l=t[s];if(l==="\\"){if(s+1===t.length)throw new oe(re.INVALID_ARGUMENT,"Path has trailing escape character: "+t);const c=t[s+1];if(c!=="\\"&&c!=="."&&c!=="`")throw new oe(re.INVALID_ARGUMENT,"Path has invalid escape sequence: "+t);n+=c,s+=2}else l==="`"?(a=!a,s++):l!=="."||a?(n+=l,s++):(r(),s++)}if(r(),a)throw new oe(re.INVALID_ARGUMENT,"Unterminated ` in path: "+t);return new ki(e)}static emptyPath(){return new ki([])}}/**
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
 */class Hi{constructor(t){this.path=t}static fromPath(t){return new Hi(bn.fromString(t))}static fromName(t){return new Hi(bn.fromString(t).popFirst(5))}static empty(){return new Hi(bn.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(t){return this.path.length>=2&&this.path.get(this.path.length-2)===t}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(t){return t!==null&&bn.comparator(this.path,t.path)===0}toString(){return this.path.toString()}static comparator(t,e){return bn.comparator(t.path,e.path)}static isDocumentKey(t){return t.length%2==0}static fromSegments(t){return new Hi(new bn(t.slice()))}}function Sg(i,t,e,n){if(t===!0&&n===!0)throw new oe(re.INVALID_ARGUMENT,`${i} and ${e} cannot be used together.`)}function Eg(i){return typeof i=="object"&&i!==null&&(Object.getPrototypeOf(i)===Object.prototype||Object.getPrototypeOf(i)===null)}/**
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
 */function Ie(i,t){const e={typeString:i};return t&&(e.value=t),e}function Ir(i,t){if(!Eg(i))throw new oe(re.INVALID_ARGUMENT,"JSON must be an object");let e;for(const n in t)if(t[n]){const s=t[n].typeString,r="value"in t[n]?{value:t[n].value}:void 0;if(!(n in i)){e=`JSON missing required field: '${n}'`;break}const a=i[n];if(s&&typeof a!==s){e=`JSON field '${n}' must be a ${s}.`;break}if(r!==void 0&&a!==r.value){e=`Expected '${n}' field to equal '${r.value}'`;break}}if(e)throw new oe(re.INVALID_ARGUMENT,e);return!0}/**
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
 */const Rh=-62135596800,Ph=1e6;class Nn{static now(){return Nn.fromMillis(Date.now())}static fromDate(t){return Nn.fromMillis(t.getTime())}static fromMillis(t){const e=Math.floor(t/1e3),n=Math.floor((t-1e3*e)*Ph);return new Nn(e,n)}constructor(t,e){if(this.seconds=t,this.nanoseconds=e,e<0)throw new oe(re.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+e);if(e>=1e9)throw new oe(re.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+e);if(t<Rh)throw new oe(re.INVALID_ARGUMENT,"Timestamp seconds out of range: "+t);if(t>=253402300800)throw new oe(re.INVALID_ARGUMENT,"Timestamp seconds out of range: "+t)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/Ph}_compareTo(t){return this.seconds===t.seconds?Cn(this.nanoseconds,t.nanoseconds):Cn(this.seconds,t.seconds)}isEqual(t){return t.seconds===this.seconds&&t.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{type:Nn._jsonSchemaVersion,seconds:this.seconds,nanoseconds:this.nanoseconds}}static fromJSON(t){if(Ir(t,Nn._jsonSchema))return new Nn(t.seconds,t.nanoseconds)}valueOf(){const t=this.seconds-Rh;return String(t).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}Nn._jsonSchemaVersion="firestore/timestamp/1.0",Nn._jsonSchema={type:Ie("string",Nn._jsonSchemaVersion),seconds:Ie("number"),nanoseconds:Ie("number")};function bg(i){return i.name==="IndexedDbTransactionError"}/**
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
 */class wg extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}}/**
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
 */class Yi{constructor(t){this.binaryString=t}static fromBase64String(t){const e=(function(s){try{return atob(s)}catch(r){throw typeof DOMException<"u"&&r instanceof DOMException?new wg("Invalid base64 string: "+r):r}})(t);return new Yi(e)}static fromUint8Array(t){const e=(function(s){let r="";for(let a=0;a<s.length;++a)r+=String.fromCharCode(s[a]);return r})(t);return new Yi(e)}[Symbol.iterator](){let t=0;return{next:()=>t<this.binaryString.length?{value:this.binaryString.charCodeAt(t++),done:!1}:{value:void 0,done:!0}}}toBase64(){return(function(e){return btoa(e)})(this.binaryString)}toUint8Array(){return(function(e){const n=new Uint8Array(e.length);for(let s=0;s<e.length;s++)n[s]=e.charCodeAt(s);return n})(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(t){return Cn(this.binaryString,t.binaryString)}isEqual(t){return this.binaryString===t.binaryString}}Yi.EMPTY_BYTE_STRING=new Yi("");const Ih="(default)";class Wo{constructor(t,e){this.projectId=t,this.database=e||Ih}static empty(){return new Wo("","")}get isDefaultDatabase(){return this.database===Ih}isEqual(t){return t instanceof Wo&&t.projectId===this.projectId&&t.database===this.database}}/**
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
 */class Tg{constructor(t,e=null,n=[],s=[],r=null,a="F",l=null,c=null){this.path=t,this.collectionGroup=e,this.explicitOrderBy=n,this.filters=s,this.limit=r,this.limitType=a,this.startAt=l,this.endAt=c,this.Te=null,this.Ie=null,this.de=null,this.startAt,this.endAt}}function Ag(i){return new Tg(i)}/**
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
 */var Dh,te;(te=Dh||(Dh={}))[te.OK=0]="OK",te[te.CANCELLED=1]="CANCELLED",te[te.UNKNOWN=2]="UNKNOWN",te[te.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",te[te.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",te[te.NOT_FOUND=5]="NOT_FOUND",te[te.ALREADY_EXISTS=6]="ALREADY_EXISTS",te[te.PERMISSION_DENIED=7]="PERMISSION_DENIED",te[te.UNAUTHENTICATED=16]="UNAUTHENTICATED",te[te.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",te[te.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",te[te.ABORTED=10]="ABORTED",te[te.OUT_OF_RANGE=11]="OUT_OF_RANGE",te[te.UNIMPLEMENTED=12]="UNIMPLEMENTED",te[te.INTERNAL=13]="INTERNAL",te[te.UNAVAILABLE=14]="UNAVAILABLE",te[te.DATA_LOSS=15]="DATA_LOSS";/**
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
 */new sc([4294967295,4294967295],0);/**
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
 */const Cg=41943040;/**
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
 */const Rg=1048576;function Ma(){return typeof document<"u"?document:null}/**
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
 */class Pg{constructor(t,e,n=1e3,s=1.5,r=6e4){this.Fi=t,this.timerId=e,this.d_=n,this.E_=s,this.A_=r,this.R_=0,this.V_=null,this.m_=Date.now(),this.reset()}reset(){this.R_=0}f_(){this.R_=this.A_}g_(t){this.cancel();const e=Math.floor(this.R_+this.p_()),n=Math.max(0,Date.now()-this.m_),s=Math.max(0,e-n);s>0&&Tn("ExponentialBackoff",`Backing off for ${s} ms (base delay: ${this.R_} ms, delay with jitter: ${e} ms, last attempt: ${n} ms ago)`),this.V_=this.Fi.enqueueAfterDelay(this.timerId,s,(()=>(this.m_=Date.now(),t()))),this.R_*=this.E_,this.R_<this.d_&&(this.R_=this.d_),this.R_>this.A_&&(this.R_=this.A_)}y_(){this.V_!==null&&(this.V_.skipDelay(),this.V_=null)}cancel(){this.V_!==null&&(this.V_.cancel(),this.V_=null)}p_(){return(Math.random()-.5)*this.R_}}/**
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
 */class rc{constructor(t,e,n,s,r){this.asyncQueue=t,this.timerId=e,this.targetTimeMs=n,this.op=s,this.removalCallback=r,this.deferred=new Mr,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch((a=>{}))}get promise(){return this.deferred.promise}static createAndSchedule(t,e,n,s,r){const a=Date.now()+n,l=new rc(t,e,a,s,r);return l.start(n),l}start(t){this.timerHandle=setTimeout((()=>this.handleDelayElapsed()),t)}skipDelay(){return this.handleDelayElapsed()}cancel(t){this.timerHandle!==null&&(this.clearTimeout(),this.deferred.reject(new oe(re.CANCELLED,"Operation cancelled"+(t?": "+t:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget((()=>this.timerHandle!==null?(this.clearTimeout(),this.op().then((t=>this.deferred.resolve(t)))):Promise.resolve()))}clearTimeout(){this.timerHandle!==null&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}}var Lh,Uh;(Uh=Lh||(Lh={})).Fa="default",Uh.Cache="cache";/**
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
 */function Ig(i){const t={};return i.timeoutSeconds!==void 0&&(t.timeoutSeconds=i.timeoutSeconds),t}/**
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
 */const Nh=new Map;/**
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
 */const Dg="firestore.googleapis.com",Oh=!0;class Fh{constructor(t){var e,n;if(t.host===void 0){if(t.ssl!==void 0)throw new oe(re.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host=Dg,this.ssl=Oh}else this.host=t.host,this.ssl=(e=t.ssl)!==null&&e!==void 0?e:Oh;if(this.isUsingEmulator=t.emulatorOptions!==void 0,this.credentials=t.credentials,this.ignoreUndefinedProperties=!!t.ignoreUndefinedProperties,this.localCache=t.localCache,t.cacheSizeBytes===void 0)this.cacheSizeBytes=Cg;else{if(t.cacheSizeBytes!==-1&&t.cacheSizeBytes<Rg)throw new oe(re.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=t.cacheSizeBytes}Sg("experimentalForceLongPolling",t.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",t.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!t.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:t.experimentalAutoDetectLongPolling===void 0?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!t.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=Ig((n=t.experimentalLongPollingOptions)!==null&&n!==void 0?n:{}),(function(r){if(r.timeoutSeconds!==void 0){if(isNaN(r.timeoutSeconds))throw new oe(re.INVALID_ARGUMENT,`invalid long polling timeout: ${r.timeoutSeconds} (must not be NaN)`);if(r.timeoutSeconds<5)throw new oe(re.INVALID_ARGUMENT,`invalid long polling timeout: ${r.timeoutSeconds} (minimum allowed value is 5)`);if(r.timeoutSeconds>30)throw new oe(re.INVALID_ARGUMENT,`invalid long polling timeout: ${r.timeoutSeconds} (maximum allowed value is 30)`)}})(this.experimentalLongPollingOptions),this.useFetchStreams=!!t.useFetchStreams}isEqual(t){return this.host===t.host&&this.ssl===t.ssl&&this.credentials===t.credentials&&this.cacheSizeBytes===t.cacheSizeBytes&&this.experimentalForceLongPolling===t.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===t.experimentalAutoDetectLongPolling&&(function(n,s){return n.timeoutSeconds===s.timeoutSeconds})(this.experimentalLongPollingOptions,t.experimentalLongPollingOptions)&&this.ignoreUndefinedProperties===t.ignoreUndefinedProperties&&this.useFetchStreams===t.useFetchStreams}}class Lg{constructor(t,e,n,s){this._authCredentials=t,this._appCheckCredentials=e,this._databaseId=n,this._app=s,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new Fh({}),this._settingsFrozen=!1,this._emulatorOptions={},this._terminateTask="notTerminated"}get app(){if(!this._app)throw new oe(re.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return this._terminateTask!=="notTerminated"}_setSettings(t){if(this._settingsFrozen)throw new oe(re.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new Fh(t),this._emulatorOptions=t.emulatorOptions||{},t.credentials!==void 0&&(this._authCredentials=(function(n){if(!n)return new ug;switch(n.type){case"firstParty":return new pg(n.sessionIndex||"0",n.iamToken||null,n.authTokenFactory||null);case"provider":return n.client;default:throw new oe(re.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}})(t.credentials))}_getSettings(){return this._settings}_getEmulatorOptions(){return this._emulatorOptions}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask==="notTerminated"&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){this._terminateTask==="notTerminated"?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return(function(e){const n=Nh.get(e);n&&(Tn("ComponentProvider","Removing Datastore"),Nh.delete(e),n.terminate())})(this),Promise.resolve()}}/**
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
 */class oc{constructor(t,e,n){this.converter=e,this._query=n,this.type="query",this.firestore=t}withConverter(t){return new oc(this.firestore,t,this._query)}}class Bn{constructor(t,e,n){this.converter=e,this._key=n,this.type="document",this.firestore=t}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new ac(this.firestore,this.converter,this._key.path.popLast())}withConverter(t){return new Bn(this.firestore,t,this._key)}toJSON(){return{type:Bn._jsonSchemaVersion,referencePath:this._key.toString()}}static fromJSON(t,e,n){if(Ir(e,Bn._jsonSchema))return new Bn(t,n||null,new Hi(bn.fromString(e.referencePath)))}}Bn._jsonSchemaVersion="firestore/documentReference/1.0",Bn._jsonSchema={type:Ie("string",Bn._jsonSchemaVersion),referencePath:Ie("string")};class ac extends oc{constructor(t,e,n){super(t,e,Ag(n)),this._path=n,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){const t=this._path.popLast();return t.isEmpty()?null:new Bn(this.firestore,null,new Hi(t))}withConverter(t){return new ac(this.firestore,t,this._path)}}/**
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
 */const Bh="AsyncQueue";class kh{constructor(t=Promise.resolve()){this.Zu=[],this.Xu=!1,this.ec=[],this.tc=null,this.nc=!1,this.rc=!1,this.sc=[],this.F_=new Pg(this,"async_queue_retry"),this.oc=()=>{const n=Ma();n&&Tn(Bh,"Visibility state changed to "+n.visibilityState),this.F_.y_()},this._c=t;const e=Ma();e&&typeof e.addEventListener=="function"&&e.addEventListener("visibilitychange",this.oc)}get isShuttingDown(){return this.Xu}enqueueAndForget(t){this.enqueue(t)}enqueueAndForgetEvenWhileRestricted(t){this.ac(),this.uc(t)}enterRestrictedMode(t){if(!this.Xu){this.Xu=!0,this.rc=t||!1;const e=Ma();e&&typeof e.removeEventListener=="function"&&e.removeEventListener("visibilitychange",this.oc)}}enqueue(t){if(this.ac(),this.Xu)return new Promise((()=>{}));const e=new Mr;return this.uc((()=>this.Xu&&this.rc?Promise.resolve():(t().then(e.resolve,e.reject),e.promise))).then((()=>e.promise))}enqueueRetryable(t){this.enqueueAndForget((()=>(this.Zu.push(t),this.cc())))}async cc(){if(this.Zu.length!==0){try{await this.Zu[0](),this.Zu.shift(),this.F_.reset()}catch(t){if(!bg(t))throw t;Tn(Bh,"Operation failed with retryable error: "+t)}this.Zu.length>0&&this.F_.g_((()=>this.cc()))}}uc(t){const e=this._c.then((()=>(this.nc=!0,t().catch((n=>{throw this.tc=n,this.nc=!1,Gd("INTERNAL UNHANDLED ERROR: ",zh(n)),n})).then((n=>(this.nc=!1,n))))));return this._c=e,e}enqueueAfterDelay(t,e,n){this.ac(),this.sc.indexOf(t)>-1&&(e=0);const s=rc.createAndSchedule(this,t,e,n,(r=>this.lc(r)));return this.ec.push(s),s}ac(){this.tc&&Ho(47125,{hc:zh(this.tc)})}verifyOperationInProgress(){}async Pc(){let t;do t=this._c,await t;while(t!==this._c)}Tc(t){for(const e of this.ec)if(e.timerId===t)return!0;return!1}Ic(t){return this.Pc().then((()=>{this.ec.sort(((e,n)=>e.targetTimeMs-n.targetTimeMs));for(const e of this.ec)if(e.skipDelay(),t!=="all"&&e.timerId===t)break;return this.Pc()}))}dc(t){this.sc.push(t)}lc(t){const e=this.ec.indexOf(t);this.ec.splice(e,1)}}function zh(i){let t=i.message||"";return i.stack&&(t=i.stack.includes(i.message)?i.stack:i.message+`
`+i.stack),t}class Ug extends Lg{constructor(t,e,n,s){super(t,e,n,s),this.type="firestore",this._queue=new kh,this._persistenceKey=(s==null?void 0:s.name)||"[DEFAULT]"}async _terminate(){if(this._firestoreClient){const t=this._firestoreClient.terminate();this._queue=new kh(t),this._firestoreClient=void 0,await t}}}/**
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
 */class Zn{constructor(t){this._byteString=t}static fromBase64String(t){try{return new Zn(Yi.fromBase64String(t))}catch(e){throw new oe(re.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+e)}}static fromUint8Array(t){return new Zn(Yi.fromUint8Array(t))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(t){return this._byteString.isEqual(t._byteString)}toJSON(){return{type:Zn._jsonSchemaVersion,bytes:this.toBase64()}}static fromJSON(t){if(Ir(t,Zn._jsonSchema))return Zn.fromBase64String(t.bytes)}}Zn._jsonSchemaVersion="firestore/bytes/1.0",Zn._jsonSchema={type:Ie("string",Zn._jsonSchemaVersion),bytes:Ie("string")};/**
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
 */class Xd{constructor(...t){for(let e=0;e<t.length;++e)if(t[e].length===0)throw new oe(re.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new ki(t)}isEqual(t){return this._internalPath.isEqual(t._internalPath)}}/**
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
 */class ji{constructor(t,e){if(!isFinite(t)||t<-90||t>90)throw new oe(re.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+t);if(!isFinite(e)||e<-180||e>180)throw new oe(re.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+e);this._lat=t,this._long=e}get latitude(){return this._lat}get longitude(){return this._long}isEqual(t){return this._lat===t._lat&&this._long===t._long}_compareTo(t){return Cn(this._lat,t._lat)||Cn(this._long,t._long)}toJSON(){return{latitude:this._lat,longitude:this._long,type:ji._jsonSchemaVersion}}static fromJSON(t){if(Ir(t,ji._jsonSchema))return new ji(t.latitude,t.longitude)}}ji._jsonSchemaVersion="firestore/geoPoint/1.0",ji._jsonSchema={type:Ie("string",ji._jsonSchemaVersion),latitude:Ie("number"),longitude:Ie("number")};/**
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
 */class $i{constructor(t){this._values=(t||[]).map((e=>e))}toArray(){return this._values.map((t=>t))}isEqual(t){return(function(n,s){if(n.length!==s.length)return!1;for(let r=0;r<n.length;++r)if(n[r]!==s[r])return!1;return!0})(this._values,t._values)}toJSON(){return{type:$i._jsonSchemaVersion,vectorValues:this._values}}static fromJSON(t){if(Ir(t,$i._jsonSchema)){if(Array.isArray(t.vectorValues)&&t.vectorValues.every((e=>typeof e=="number")))return new $i(t.vectorValues);throw new oe(re.INVALID_ARGUMENT,"Expected 'vectorValues' field to be a number array")}}}$i._jsonSchemaVersion="firestore/vectorValue/1.0",$i._jsonSchema={type:Ie("string",$i._jsonSchemaVersion),vectorValues:Ie("object")};const Ng=new RegExp("[~\\*/\\[\\]]");function Og(i,t,e){if(t.search(Ng)>=0)throw Vh(`Invalid field path (${t}). Paths must not contain '~', '*', '/', '[', or ']'`,i);try{return new Xd(...t.split("."))._internalPath}catch{throw Vh(`Invalid field path (${t}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,i)}}function Vh(i,t,e,n,s){let r=`Function ${t}() called with invalid data`;r+=". ";let a="";return new oe(re.INVALID_ARGUMENT,r+i+a)}/**
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
 */class qd{constructor(t,e,n,s,r){this._firestore=t,this._userDataWriter=e,this._key=n,this._document=s,this._converter=r}get id(){return this._key.path.lastSegment()}get ref(){return new Bn(this._firestore,this._converter,this._key)}exists(){return this._document!==null}data(){if(this._document){if(this._converter){const t=new Fg(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(t)}return this._userDataWriter.convertValue(this._document.data.value)}}get(t){if(this._document){const e=this._document.data.field(jd("DocumentSnapshot.get",t));if(e!==null)return this._userDataWriter.convertValue(e)}}}class Fg extends qd{data(){return super.data()}}function jd(i,t){return typeof t=="string"?Og(i,t):t instanceof Xd?t._internalPath:t._delegate._internalPath}class Yr{constructor(t,e){this.hasPendingWrites=t,this.fromCache=e}isEqual(t){return this.hasPendingWrites===t.hasPendingWrites&&this.fromCache===t.fromCache}}class Is extends qd{constructor(t,e,n,s,r,a){super(t,e,n,s,a),this._firestore=t,this._firestoreImpl=t,this.metadata=r}exists(){return super.exists()}data(t={}){if(this._document){if(this._converter){const e=new Po(this._firestore,this._userDataWriter,this._key,this._document,this.metadata,null);return this._converter.fromFirestore(e,t)}return this._userDataWriter.convertValue(this._document.data.value,t.serverTimestamps)}}get(t,e={}){if(this._document){const n=this._document.data.field(jd("DocumentSnapshot.get",t));if(n!==null)return this._userDataWriter.convertValue(n,e.serverTimestamps)}}toJSON(){if(this.metadata.hasPendingWrites)throw new oe(re.FAILED_PRECONDITION,"DocumentSnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const t=this._document,e={};return e.type=Is._jsonSchemaVersion,e.bundle="",e.bundleSource="DocumentSnapshot",e.bundleName=this._key.toString(),!t||!t.isValidDocument()||!t.isFoundDocument()?e:(this._userDataWriter.convertObjectMap(t.data.value.mapValue.fields,"previous"),e.bundle=(this._firestore,this.ref.path,"NOT SUPPORTED"),e)}}Is._jsonSchemaVersion="firestore/documentSnapshot/1.0",Is._jsonSchema={type:Ie("string",Is._jsonSchemaVersion),bundleSource:Ie("string","DocumentSnapshot"),bundleName:Ie("string"),bundle:Ie("string")};class Po extends Is{data(t={}){return super.data(t)}}class Sr{constructor(t,e,n,s){this._firestore=t,this._userDataWriter=e,this._snapshot=s,this.metadata=new Yr(s.hasPendingWrites,s.fromCache),this.query=n}get docs(){const t=[];return this.forEach((e=>t.push(e))),t}get size(){return this._snapshot.docs.size}get empty(){return this.size===0}forEach(t,e){this._snapshot.docs.forEach((n=>{t.call(e,new Po(this._firestore,this._userDataWriter,n.key,n,new Yr(this._snapshot.mutatedKeys.has(n.key),this._snapshot.fromCache),this.query.converter))}))}docChanges(t={}){const e=!!t.includeMetadataChanges;if(e&&this._snapshot.excludesMetadataChanges)throw new oe(re.INVALID_ARGUMENT,"To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");return this._cachedChanges&&this._cachedChangesIncludeMetadataChanges===e||(this._cachedChanges=(function(s,r){if(s._snapshot.oldDocs.isEmpty()){let a=0;return s._snapshot.docChanges.map((l=>{const c=new Po(s._firestore,s._userDataWriter,l.doc.key,l.doc,new Yr(s._snapshot.mutatedKeys.has(l.doc.key),s._snapshot.fromCache),s.query.converter);return l.doc,{type:"added",doc:c,oldIndex:-1,newIndex:a++}}))}{let a=s._snapshot.oldDocs;return s._snapshot.docChanges.filter((l=>r||l.type!==3)).map((l=>{const c=new Po(s._firestore,s._userDataWriter,l.doc.key,l.doc,new Yr(s._snapshot.mutatedKeys.has(l.doc.key),s._snapshot.fromCache),s.query.converter);let h=-1,d=-1;return l.type!==0&&(h=a.indexOf(l.doc.key),a=a.delete(l.doc.key)),l.type!==1&&(a=a.add(l.doc),d=a.indexOf(l.doc.key)),{type:Bg(l.type),doc:c,oldIndex:h,newIndex:d}}))}})(this,e),this._cachedChangesIncludeMetadataChanges=e),this._cachedChanges}toJSON(){if(this.metadata.hasPendingWrites)throw new oe(re.FAILED_PRECONDITION,"QuerySnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const t={};t.type=Sr._jsonSchemaVersion,t.bundleSource="QuerySnapshot",t.bundleName=vg.newId(),this._firestore._databaseId.database,this._firestore._databaseId.projectId;const e=[],n=[],s=[];return this.docs.forEach((r=>{r._document!==null&&(e.push(r._document),n.push(this._userDataWriter.convertObjectMap(r._document.data.value.mapValue.fields,"previous")),s.push(r.ref.path))})),t.bundle=(this._firestore,this.query._query,t.bundleName,"NOT SUPPORTED"),t}}function Bg(i){switch(i){case 0:return"added";case 2:case 3:return"modified";case 1:return"removed";default:return Ho(61501,{type:i})}}Sr._jsonSchemaVersion="firestore/querySnapshot/1.0",Sr._jsonSchema={type:Ie("string",Sr._jsonSchemaVersion),bundleSource:Ie("string","QuerySnapshot"),bundleName:Ie("string"),bundle:Ie("string")};(function(t,e=!0){(function(s){Qo=s})(Jo),Os(new Ns("firestore",((n,{instanceIdentifier:s,options:r})=>{const a=n.getProvider("app").getImmediate(),l=new Ug(new dg(n.getProvider("auth-internal")),new mg(a,n.getProvider("app-check-internal")),(function(h,d){if(!Object.prototype.hasOwnProperty.apply(h.options,["projectId"]))throw new oe(re.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new Wo(h.options.projectId,d)})(a,s),a);return r=Object.assign({useFetchStreams:e},r),l._setSettings(r),l}),"PUBLIC").setMultipleInstances(!0)),Si(bh,wh,t),Si(bh,wh,"esm2017")})();function kg(){return!1}function zg(){return console.warn("Firebase not configured — running in offline-only mode"),{app:null,auth:null,db:null}}function Vg(){return null}function Gh(){return!1}async function Gg(){return null}/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const lc="170",Hg=0,Hh=1,Wg=2,$d=1,Yd=2,Jn=3,bi=0,Qe=1,Ze=2,ti=0,Ds=1,Pn=2,Wh=3,Xh=4,Xg=5,zi=100,qg=101,jg=102,$g=103,Yg=104,Kg=200,Jg=201,Zg=202,Qg=203,ll=204,cl=205,t0=206,e0=207,n0=208,i0=209,s0=210,r0=211,o0=212,a0=213,l0=214,hl=0,ul=1,dl=2,Fs=3,fl=4,pl=5,ml=6,gl=7,Kd=0,c0=1,h0=2,Ei=0,Jd=1,Zd=2,Qd=3,cc=4,u0=5,tf=6,ef=7,nf=300,Bs=301,ks=302,_l=303,vl=304,ta=306,yl=1e3,Wi=1001,xl=1002,hn=1003,d0=1004,Kr=1005,gn=1006,Sa=1007,Xi=1008,ri=1009,sf=1010,rf=1011,Tr=1012,hc=1013,Ki=1014,kn=1015,ei=1016,uc=1017,dc=1018,zs=1020,of=35902,af=1021,lf=1022,An=1023,cf=1024,hf=1025,Ls=1026,Vs=1027,fc=1028,pc=1029,uf=1030,mc=1031,gc=1033,Io=33776,Do=33777,Lo=33778,Uo=33779,Ml=35840,Sl=35841,El=35842,bl=35843,wl=36196,Tl=37492,Al=37496,Cl=37808,Rl=37809,Pl=37810,Il=37811,Dl=37812,Ll=37813,Ul=37814,Nl=37815,Ol=37816,Fl=37817,Bl=37818,kl=37819,zl=37820,Vl=37821,No=36492,Gl=36494,Hl=36495,df=36283,Wl=36284,Xl=36285,ql=36286,f0=3200,p0=3201,ff=0,m0=1,xi="",ln="srgb",Ws="srgb-linear",ea="linear",he="srgb",os=7680,qh=519,g0=512,_0=513,v0=514,pf=515,y0=516,x0=517,M0=518,S0=519,jl=35044,E0=35048,jh="300 es",Qn=2e3,Xo=2001;class Xs{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;const n=this._listeners;return n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;const s=this._listeners[t];if(s!==void 0){const r=s.indexOf(e);r!==-1&&s.splice(r,1)}}dispatchEvent(t){if(this._listeners===void 0)return;const n=this._listeners[t.type];if(n!==void 0){t.target=this;const s=n.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,t);t.target=null}}}const Xe=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let $h=1234567;const Er=Math.PI/180,Ar=180/Math.PI;function ni(){const i=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Xe[i&255]+Xe[i>>8&255]+Xe[i>>16&255]+Xe[i>>24&255]+"-"+Xe[t&255]+Xe[t>>8&255]+"-"+Xe[t>>16&15|64]+Xe[t>>24&255]+"-"+Xe[e&63|128]+Xe[e>>8&255]+"-"+Xe[e>>16&255]+Xe[e>>24&255]+Xe[n&255]+Xe[n>>8&255]+Xe[n>>16&255]+Xe[n>>24&255]).toLowerCase()}function je(i,t,e){return Math.max(t,Math.min(e,i))}function _c(i,t){return(i%t+t)%t}function b0(i,t,e,n,s){return n+(i-t)*(s-n)/(e-t)}function w0(i,t,e){return i!==t?(e-i)/(t-i):0}function br(i,t,e){return(1-e)*i+e*t}function T0(i,t,e,n){return br(i,t,1-Math.exp(-e*n))}function A0(i,t=1){return t-Math.abs(_c(i,t*2)-t)}function C0(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*(3-2*i))}function R0(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*i*(i*(i*6-15)+10))}function P0(i,t){return i+Math.floor(Math.random()*(t-i+1))}function I0(i,t){return i+Math.random()*(t-i)}function D0(i){return i*(.5-Math.random())}function L0(i){i!==void 0&&($h=i);let t=$h+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function U0(i){return i*Er}function N0(i){return i*Ar}function O0(i){return(i&i-1)===0&&i!==0}function F0(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function B0(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function k0(i,t,e,n,s){const r=Math.cos,a=Math.sin,l=r(e/2),c=a(e/2),h=r((t+n)/2),d=a((t+n)/2),p=r((t-n)/2),m=a((t-n)/2),y=r((n-t)/2),M=a((n-t)/2);switch(s){case"XYX":i.set(l*d,c*p,c*m,l*h);break;case"YZY":i.set(c*m,l*d,c*p,l*h);break;case"ZXZ":i.set(c*p,c*m,l*d,l*h);break;case"XZX":i.set(l*d,c*M,c*y,l*h);break;case"YXY":i.set(c*y,l*d,c*M,l*h);break;case"ZYZ":i.set(c*M,c*y,l*d,l*h);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function wn(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function ue(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}const Ni={DEG2RAD:Er,RAD2DEG:Ar,generateUUID:ni,clamp:je,euclideanModulo:_c,mapLinear:b0,inverseLerp:w0,lerp:br,damp:T0,pingpong:A0,smoothstep:C0,smootherstep:R0,randInt:P0,randFloat:I0,randFloatSpread:D0,seededRandom:L0,degToRad:U0,radToDeg:N0,isPowerOfTwo:O0,ceilPowerOfTwo:F0,floorPowerOfTwo:B0,setQuaternionFromProperEuler:k0,normalize:ue,denormalize:wn};class Mt{constructor(t=0,e=0){Mt.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,n=this.y,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6],this.y=s[1]*e+s[4]*n+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(je(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const n=Math.cos(e),s=Math.sin(e),r=this.x-t.x,a=this.y-t.y;return this.x=r*n-a*s+t.x,this.y=r*s+a*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Wt{constructor(t,e,n,s,r,a,l,c,h){Wt.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,a,l,c,h)}set(t,e,n,s,r,a,l,c,h){const d=this.elements;return d[0]=t,d[1]=s,d[2]=l,d[3]=e,d[4]=r,d[5]=c,d[6]=n,d[7]=a,d[8]=h,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,r=this.elements,a=n[0],l=n[3],c=n[6],h=n[1],d=n[4],p=n[7],m=n[2],y=n[5],M=n[8],b=s[0],v=s[3],f=s[6],D=s[1],I=s[4],C=s[7],z=s[2],N=s[5],E=s[8];return r[0]=a*b+l*D+c*z,r[3]=a*v+l*I+c*N,r[6]=a*f+l*C+c*E,r[1]=h*b+d*D+p*z,r[4]=h*v+d*I+p*N,r[7]=h*f+d*C+p*E,r[2]=m*b+y*D+M*z,r[5]=m*v+y*I+M*N,r[8]=m*f+y*C+M*E,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],a=t[4],l=t[5],c=t[6],h=t[7],d=t[8];return e*a*d-e*l*h-n*r*d+n*l*c+s*r*h-s*a*c}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],a=t[4],l=t[5],c=t[6],h=t[7],d=t[8],p=d*a-l*h,m=l*c-d*r,y=h*r-a*c,M=e*p+n*m+s*y;if(M===0)return this.set(0,0,0,0,0,0,0,0,0);const b=1/M;return t[0]=p*b,t[1]=(s*h-d*n)*b,t[2]=(l*n-s*a)*b,t[3]=m*b,t[4]=(d*e-s*c)*b,t[5]=(s*r-l*e)*b,t[6]=y*b,t[7]=(n*c-h*e)*b,t[8]=(a*e-n*r)*b,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,s,r,a,l){const c=Math.cos(r),h=Math.sin(r);return this.set(n*c,n*h,-n*(c*a+h*l)+a+t,-s*h,s*c,-s*(-h*a+c*l)+l+e,0,0,1),this}scale(t,e){return this.premultiply(Ea.makeScale(t,e)),this}rotate(t){return this.premultiply(Ea.makeRotation(-t)),this}translate(t,e){return this.premultiply(Ea.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<9;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const Ea=new Wt;function mf(i){for(let t=i.length-1;t>=0;--t)if(i[t]>=65535)return!0;return!1}function qo(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function z0(){const i=qo("canvas");return i.style.display="block",i}const Yh={};function gr(i){i in Yh||(Yh[i]=!0,console.warn(i))}function V0(i,t,e){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(t,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,e);break;default:n()}}setTimeout(r,e)})}function G0(i){const t=i.elements;t[2]=.5*t[2]+.5*t[3],t[6]=.5*t[6]+.5*t[7],t[10]=.5*t[10]+.5*t[11],t[14]=.5*t[14]+.5*t[15]}function H0(i){const t=i.elements;t[11]===-1?(t[10]=-t[10]-1,t[14]=-t[14]):(t[10]=-t[10],t[14]=-t[14]+1)}const ee={enabled:!0,workingColorSpace:Ws,spaces:{},convert:function(i,t,e){return this.enabled===!1||t===e||!t||!e||(this.spaces[t].transfer===he&&(i.r=ii(i.r),i.g=ii(i.g),i.b=ii(i.b)),this.spaces[t].primaries!==this.spaces[e].primaries&&(i.applyMatrix3(this.spaces[t].toXYZ),i.applyMatrix3(this.spaces[e].fromXYZ)),this.spaces[e].transfer===he&&(i.r=Us(i.r),i.g=Us(i.g),i.b=Us(i.b))),i},fromWorkingColorSpace:function(i,t){return this.convert(i,this.workingColorSpace,t)},toWorkingColorSpace:function(i,t){return this.convert(i,t,this.workingColorSpace)},getPrimaries:function(i){return this.spaces[i].primaries},getTransfer:function(i){return i===xi?ea:this.spaces[i].transfer},getLuminanceCoefficients:function(i,t=this.workingColorSpace){return i.fromArray(this.spaces[t].luminanceCoefficients)},define:function(i){Object.assign(this.spaces,i)},_getMatrix:function(i,t,e){return i.copy(this.spaces[t].toXYZ).multiply(this.spaces[e].fromXYZ)},_getDrawingBufferColorSpace:function(i){return this.spaces[i].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(i=this.workingColorSpace){return this.spaces[i].workingColorSpaceConfig.unpackColorSpace}};function ii(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function Us(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}const Kh=[.64,.33,.3,.6,.15,.06],Jh=[.2126,.7152,.0722],Zh=[.3127,.329],Qh=new Wt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),tu=new Wt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);ee.define({[Ws]:{primaries:Kh,whitePoint:Zh,transfer:ea,toXYZ:Qh,fromXYZ:tu,luminanceCoefficients:Jh,workingColorSpaceConfig:{unpackColorSpace:ln},outputColorSpaceConfig:{drawingBufferColorSpace:ln}},[ln]:{primaries:Kh,whitePoint:Zh,transfer:he,toXYZ:Qh,fromXYZ:tu,luminanceCoefficients:Jh,outputColorSpaceConfig:{drawingBufferColorSpace:ln}}});let as;class W0{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{as===void 0&&(as=qo("canvas")),as.width=t.width,as.height=t.height;const n=as.getContext("2d");t instanceof ImageData?n.putImageData(t,0,0):n.drawImage(t,0,0,t.width,t.height),e=as}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=qo("canvas");e.width=t.width,e.height=t.height;const n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);const s=n.getImageData(0,0,t.width,t.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=ii(r[a]/255)*255;return n.putImageData(s,0,0),e}else if(t.data){const e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(ii(e[n]/255)*255):e[n]=ii(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let X0=0;class gf{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:X0++}),this.uuid=ni(),this.data=t,this.dataReady=!0,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,l=s.length;a<l;a++)s[a].isDataTexture?r.push(ba(s[a].image)):r.push(ba(s[a]))}else r=ba(s);n.url=r}return e||(t.images[this.uuid]=n),n}}function ba(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?W0.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let q0=0;class $e extends Xs{constructor(t=$e.DEFAULT_IMAGE,e=$e.DEFAULT_MAPPING,n=Wi,s=Wi,r=gn,a=Xi,l=An,c=ri,h=$e.DEFAULT_ANISOTROPY,d=xi){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:q0++}),this.uuid=ni(),this.name="",this.source=new gf(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=h,this.format=l,this.internalFormat=null,this.type=c,this.offset=new Mt(0,0),this.repeat=new Mt(1,1),this.center=new Mt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Wt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=d,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==nf)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case yl:t.x=t.x-Math.floor(t.x);break;case Wi:t.x=t.x<0?0:1;break;case xl:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case yl:t.y=t.y-Math.floor(t.y);break;case Wi:t.y=t.y<0?0:1;break;case xl:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}$e.DEFAULT_IMAGE=null;$e.DEFAULT_MAPPING=nf;$e.DEFAULT_ANISOTROPY=1;class ve{constructor(t=0,e=0,n=0,s=1){ve.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,s){return this.x=t,this.y=e,this.z=n,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,r=this.w,a=t.elements;return this.x=a[0]*e+a[4]*n+a[8]*s+a[12]*r,this.y=a[1]*e+a[5]*n+a[9]*s+a[13]*r,this.z=a[2]*e+a[6]*n+a[10]*s+a[14]*r,this.w=a[3]*e+a[7]*n+a[11]*s+a[15]*r,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,s,r;const c=t.elements,h=c[0],d=c[4],p=c[8],m=c[1],y=c[5],M=c[9],b=c[2],v=c[6],f=c[10];if(Math.abs(d-m)<.01&&Math.abs(p-b)<.01&&Math.abs(M-v)<.01){if(Math.abs(d+m)<.1&&Math.abs(p+b)<.1&&Math.abs(M+v)<.1&&Math.abs(h+y+f-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const I=(h+1)/2,C=(y+1)/2,z=(f+1)/2,N=(d+m)/4,E=(p+b)/4,S=(M+v)/4;return I>C&&I>z?I<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(I),s=N/n,r=E/n):C>z?C<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(C),n=N/s,r=S/s):z<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(z),n=E/r,s=S/r),this.set(n,s,r,e),this}let D=Math.sqrt((v-M)*(v-M)+(p-b)*(p-b)+(m-d)*(m-d));return Math.abs(D)<.001&&(D=1),this.x=(v-M)/D,this.y=(p-b)/D,this.z=(m-d)/D,this.w=Math.acos((h+y+f-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class j0 extends Xs{constructor(t=1,e=1,n={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new ve(0,0,t,e),this.scissorTest=!1,this.viewport=new ve(0,0,t,e);const s={width:t,height:e,depth:1};n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:gn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},n);const r=new $e(s,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace);r.flipY=!1,r.generateMipmaps=n.generateMipmaps,r.internalFormat=n.internalFormat,this.textures=[];const a=n.count;for(let l=0;l<a;l++)this.textures[l]=r.clone(),this.textures[l].isRenderTargetTexture=!0;this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=t,this.textures[s].image.height=e,this.textures[s].image.depth=n;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let n=0,s=t.textures.length;n<s;n++)this.textures[n]=t.textures[n].clone(),this.textures[n].isRenderTargetTexture=!0;const e=Object.assign({},t.texture.image);return this.texture.source=new gf(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Rn extends j0{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}}class _f extends $e{constructor(t=null,e=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=hn,this.minFilter=hn,this.wrapR=Wi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class $0 extends $e{constructor(t=null,e=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=hn,this.minFilter=hn,this.wrapR=Wi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class qs{constructor(t=0,e=0,n=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=s}static slerpFlat(t,e,n,s,r,a,l){let c=n[s+0],h=n[s+1],d=n[s+2],p=n[s+3];const m=r[a+0],y=r[a+1],M=r[a+2],b=r[a+3];if(l===0){t[e+0]=c,t[e+1]=h,t[e+2]=d,t[e+3]=p;return}if(l===1){t[e+0]=m,t[e+1]=y,t[e+2]=M,t[e+3]=b;return}if(p!==b||c!==m||h!==y||d!==M){let v=1-l;const f=c*m+h*y+d*M+p*b,D=f>=0?1:-1,I=1-f*f;if(I>Number.EPSILON){const z=Math.sqrt(I),N=Math.atan2(z,f*D);v=Math.sin(v*N)/z,l=Math.sin(l*N)/z}const C=l*D;if(c=c*v+m*C,h=h*v+y*C,d=d*v+M*C,p=p*v+b*C,v===1-l){const z=1/Math.sqrt(c*c+h*h+d*d+p*p);c*=z,h*=z,d*=z,p*=z}}t[e]=c,t[e+1]=h,t[e+2]=d,t[e+3]=p}static multiplyQuaternionsFlat(t,e,n,s,r,a){const l=n[s],c=n[s+1],h=n[s+2],d=n[s+3],p=r[a],m=r[a+1],y=r[a+2],M=r[a+3];return t[e]=l*M+d*p+c*y-h*m,t[e+1]=c*M+d*m+h*p-l*y,t[e+2]=h*M+d*y+l*m-c*p,t[e+3]=d*M-l*p-c*m-h*y,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,s){return this._x=t,this._y=e,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const n=t._x,s=t._y,r=t._z,a=t._order,l=Math.cos,c=Math.sin,h=l(n/2),d=l(s/2),p=l(r/2),m=c(n/2),y=c(s/2),M=c(r/2);switch(a){case"XYZ":this._x=m*d*p+h*y*M,this._y=h*y*p-m*d*M,this._z=h*d*M+m*y*p,this._w=h*d*p-m*y*M;break;case"YXZ":this._x=m*d*p+h*y*M,this._y=h*y*p-m*d*M,this._z=h*d*M-m*y*p,this._w=h*d*p+m*y*M;break;case"ZXY":this._x=m*d*p-h*y*M,this._y=h*y*p+m*d*M,this._z=h*d*M+m*y*p,this._w=h*d*p-m*y*M;break;case"ZYX":this._x=m*d*p-h*y*M,this._y=h*y*p+m*d*M,this._z=h*d*M-m*y*p,this._w=h*d*p+m*y*M;break;case"YZX":this._x=m*d*p+h*y*M,this._y=h*y*p+m*d*M,this._z=h*d*M-m*y*p,this._w=h*d*p-m*y*M;break;case"XZY":this._x=m*d*p-h*y*M,this._y=h*y*p-m*d*M,this._z=h*d*M+m*y*p,this._w=h*d*p+m*y*M;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const n=e/2,s=Math.sin(n);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,n=e[0],s=e[4],r=e[8],a=e[1],l=e[5],c=e[9],h=e[2],d=e[6],p=e[10],m=n+l+p;if(m>0){const y=.5/Math.sqrt(m+1);this._w=.25/y,this._x=(d-c)*y,this._y=(r-h)*y,this._z=(a-s)*y}else if(n>l&&n>p){const y=2*Math.sqrt(1+n-l-p);this._w=(d-c)/y,this._x=.25*y,this._y=(s+a)/y,this._z=(r+h)/y}else if(l>p){const y=2*Math.sqrt(1+l-n-p);this._w=(r-h)/y,this._x=(s+a)/y,this._y=.25*y,this._z=(c+d)/y}else{const y=2*Math.sqrt(1+p-n-l);this._w=(a-s)/y,this._x=(r+h)/y,this._y=(c+d)/y,this._z=.25*y}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<Number.EPSILON?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(je(this.dot(t),-1,1)))}rotateTowards(t,e){const n=this.angleTo(t);if(n===0)return this;const s=Math.min(1,e/n);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const n=t._x,s=t._y,r=t._z,a=t._w,l=e._x,c=e._y,h=e._z,d=e._w;return this._x=n*d+a*l+s*h-r*c,this._y=s*d+a*c+r*l-n*h,this._z=r*d+a*h+n*c-s*l,this._w=a*d-n*l-s*c-r*h,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const n=this._x,s=this._y,r=this._z,a=this._w;let l=a*t._w+n*t._x+s*t._y+r*t._z;if(l<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,l=-l):this.copy(t),l>=1)return this._w=a,this._x=n,this._y=s,this._z=r,this;const c=1-l*l;if(c<=Number.EPSILON){const y=1-e;return this._w=y*a+e*this._w,this._x=y*n+e*this._x,this._y=y*s+e*this._y,this._z=y*r+e*this._z,this.normalize(),this}const h=Math.sqrt(c),d=Math.atan2(h,l),p=Math.sin((1-e)*d)/h,m=Math.sin(e*d)/h;return this._w=a*p+this._w*m,this._x=n*p+this._x*m,this._y=s*p+this._y*m,this._z=r*p+this._z*m,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(t),s*Math.cos(t),r*Math.sin(e),r*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class O{constructor(t=0,e=0,n=0){O.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(eu.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(eu.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6]*s,this.y=r[1]*e+r[4]*n+r[7]*s,this.z=r[2]*e+r[5]*n+r[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,r=t.elements,a=1/(r[3]*e+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*e+r[4]*n+r[8]*s+r[12])*a,this.y=(r[1]*e+r[5]*n+r[9]*s+r[13])*a,this.z=(r[2]*e+r[6]*n+r[10]*s+r[14])*a,this}applyQuaternion(t){const e=this.x,n=this.y,s=this.z,r=t.x,a=t.y,l=t.z,c=t.w,h=2*(a*s-l*n),d=2*(l*e-r*s),p=2*(r*n-a*e);return this.x=e+c*h+a*p-l*d,this.y=n+c*d+l*h-r*p,this.z=s+c*p+r*d-a*h,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*s,this.y=r[1]*e+r[5]*n+r[9]*s,this.z=r[2]*e+r[6]*n+r[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const n=t.x,s=t.y,r=t.z,a=e.x,l=e.y,c=e.z;return this.x=s*c-r*l,this.y=r*a-n*c,this.z=n*l-s*a,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return wa.copy(this).projectOnVector(t),this.sub(wa)}reflect(t){return this.sub(wa.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(je(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y,s=this.z-t.z;return e*e+n*n+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){const s=Math.sin(e)*t;return this.x=s*Math.sin(n),this.y=Math.cos(e)*t,this.z=s*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const wa=new O,eu=new qs;class Zi{constructor(t=new O(1/0,1/0,1/0),e=new O(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(Mn.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(Mn.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const n=Mn.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const n=t.geometry;if(n!==void 0){const r=n.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let a=0,l=r.count;a<l;a++)t.isMesh===!0?t.getVertexPosition(a,Mn):Mn.fromBufferAttribute(r,a),Mn.applyMatrix4(t.matrixWorld),this.expandByPoint(Mn);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),Jr.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Jr.copy(n.boundingBox)),Jr.applyMatrix4(t.matrixWorld),this.union(Jr)}const s=t.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,Mn),Mn.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(rr),Zr.subVectors(this.max,rr),ls.subVectors(t.a,rr),cs.subVectors(t.b,rr),hs.subVectors(t.c,rr),pi.subVectors(cs,ls),mi.subVectors(hs,cs),Ri.subVectors(ls,hs);let e=[0,-pi.z,pi.y,0,-mi.z,mi.y,0,-Ri.z,Ri.y,pi.z,0,-pi.x,mi.z,0,-mi.x,Ri.z,0,-Ri.x,-pi.y,pi.x,0,-mi.y,mi.x,0,-Ri.y,Ri.x,0];return!Ta(e,ls,cs,hs,Zr)||(e=[1,0,0,0,1,0,0,0,1],!Ta(e,ls,cs,hs,Zr))?!1:(Qr.crossVectors(pi,mi),e=[Qr.x,Qr.y,Qr.z],Ta(e,ls,cs,hs,Zr))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,Mn).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(Mn).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(Xn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),Xn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),Xn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),Xn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),Xn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),Xn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),Xn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),Xn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(Xn),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}}const Xn=[new O,new O,new O,new O,new O,new O,new O,new O],Mn=new O,Jr=new Zi,ls=new O,cs=new O,hs=new O,pi=new O,mi=new O,Ri=new O,rr=new O,Zr=new O,Qr=new O,Pi=new O;function Ta(i,t,e,n,s){for(let r=0,a=i.length-3;r<=a;r+=3){Pi.fromArray(i,r);const l=s.x*Math.abs(Pi.x)+s.y*Math.abs(Pi.y)+s.z*Math.abs(Pi.z),c=t.dot(Pi),h=e.dot(Pi),d=n.dot(Pi);if(Math.max(-Math.max(c,h,d),Math.min(c,h,d))>l)return!1}return!0}const Y0=new Zi,or=new O,Aa=new O;class Qi{constructor(t=new O,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const n=this.center;e!==void 0?n.copy(e):Y0.setFromPoints(t).getCenter(n);let s=0;for(let r=0,a=t.length;r<a;r++)s=Math.max(s,n.distanceToSquared(t[r]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;or.subVectors(t,this.center);const e=or.lengthSq();if(e>this.radius*this.radius){const n=Math.sqrt(e),s=(n-this.radius)*.5;this.center.addScaledVector(or,s/n),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(Aa.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(or.copy(t.center).add(Aa)),this.expandByPoint(or.copy(t.center).sub(Aa))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}}const qn=new O,Ca=new O,to=new O,gi=new O,Ra=new O,eo=new O,Pa=new O;class na{constructor(t=new O,e=new O(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,qn)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=qn.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(qn.copy(this.origin).addScaledVector(this.direction,e),qn.distanceToSquared(t))}distanceSqToSegment(t,e,n,s){Ca.copy(t).add(e).multiplyScalar(.5),to.copy(e).sub(t).normalize(),gi.copy(this.origin).sub(Ca);const r=t.distanceTo(e)*.5,a=-this.direction.dot(to),l=gi.dot(this.direction),c=-gi.dot(to),h=gi.lengthSq(),d=Math.abs(1-a*a);let p,m,y,M;if(d>0)if(p=a*c-l,m=a*l-c,M=r*d,p>=0)if(m>=-M)if(m<=M){const b=1/d;p*=b,m*=b,y=p*(p+a*m+2*l)+m*(a*p+m+2*c)+h}else m=r,p=Math.max(0,-(a*m+l)),y=-p*p+m*(m+2*c)+h;else m=-r,p=Math.max(0,-(a*m+l)),y=-p*p+m*(m+2*c)+h;else m<=-M?(p=Math.max(0,-(-a*r+l)),m=p>0?-r:Math.min(Math.max(-r,-c),r),y=-p*p+m*(m+2*c)+h):m<=M?(p=0,m=Math.min(Math.max(-r,-c),r),y=m*(m+2*c)+h):(p=Math.max(0,-(a*r+l)),m=p>0?r:Math.min(Math.max(-r,-c),r),y=-p*p+m*(m+2*c)+h);else m=a>0?-r:r,p=Math.max(0,-(a*m+l)),y=-p*p+m*(m+2*c)+h;return n&&n.copy(this.origin).addScaledVector(this.direction,p),s&&s.copy(Ca).addScaledVector(to,m),y}intersectSphere(t,e){qn.subVectors(t.center,this.origin);const n=qn.dot(this.direction),s=qn.dot(qn)-n*n,r=t.radius*t.radius;if(s>r)return null;const a=Math.sqrt(r-s),l=n-a,c=n+a;return c<0?null:l<0?this.at(c,e):this.at(l,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){const n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,s,r,a,l,c;const h=1/this.direction.x,d=1/this.direction.y,p=1/this.direction.z,m=this.origin;return h>=0?(n=(t.min.x-m.x)*h,s=(t.max.x-m.x)*h):(n=(t.max.x-m.x)*h,s=(t.min.x-m.x)*h),d>=0?(r=(t.min.y-m.y)*d,a=(t.max.y-m.y)*d):(r=(t.max.y-m.y)*d,a=(t.min.y-m.y)*d),n>a||r>s||((r>n||isNaN(n))&&(n=r),(a<s||isNaN(s))&&(s=a),p>=0?(l=(t.min.z-m.z)*p,c=(t.max.z-m.z)*p):(l=(t.max.z-m.z)*p,c=(t.min.z-m.z)*p),n>c||l>s)||((l>n||n!==n)&&(n=l),(c<s||s!==s)&&(s=c),s<0)?null:this.at(n>=0?n:s,e)}intersectsBox(t){return this.intersectBox(t,qn)!==null}intersectTriangle(t,e,n,s,r){Ra.subVectors(e,t),eo.subVectors(n,t),Pa.crossVectors(Ra,eo);let a=this.direction.dot(Pa),l;if(a>0){if(s)return null;l=1}else if(a<0)l=-1,a=-a;else return null;gi.subVectors(this.origin,t);const c=l*this.direction.dot(eo.crossVectors(gi,eo));if(c<0)return null;const h=l*this.direction.dot(Ra.cross(gi));if(h<0||c+h>a)return null;const d=-l*gi.dot(Pa);return d<0?null:this.at(d/a,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class le{constructor(t,e,n,s,r,a,l,c,h,d,p,m,y,M,b,v){le.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,a,l,c,h,d,p,m,y,M,b,v)}set(t,e,n,s,r,a,l,c,h,d,p,m,y,M,b,v){const f=this.elements;return f[0]=t,f[4]=e,f[8]=n,f[12]=s,f[1]=r,f[5]=a,f[9]=l,f[13]=c,f[2]=h,f[6]=d,f[10]=p,f[14]=m,f[3]=y,f[7]=M,f[11]=b,f[15]=v,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new le().fromArray(this.elements)}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){const e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,n=t.elements,s=1/us.setFromMatrixColumn(t,0).length(),r=1/us.setFromMatrixColumn(t,1).length(),a=1/us.setFromMatrixColumn(t,2).length();return e[0]=n[0]*s,e[1]=n[1]*s,e[2]=n[2]*s,e[3]=0,e[4]=n[4]*r,e[5]=n[5]*r,e[6]=n[6]*r,e[7]=0,e[8]=n[8]*a,e[9]=n[9]*a,e[10]=n[10]*a,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,n=t.x,s=t.y,r=t.z,a=Math.cos(n),l=Math.sin(n),c=Math.cos(s),h=Math.sin(s),d=Math.cos(r),p=Math.sin(r);if(t.order==="XYZ"){const m=a*d,y=a*p,M=l*d,b=l*p;e[0]=c*d,e[4]=-c*p,e[8]=h,e[1]=y+M*h,e[5]=m-b*h,e[9]=-l*c,e[2]=b-m*h,e[6]=M+y*h,e[10]=a*c}else if(t.order==="YXZ"){const m=c*d,y=c*p,M=h*d,b=h*p;e[0]=m+b*l,e[4]=M*l-y,e[8]=a*h,e[1]=a*p,e[5]=a*d,e[9]=-l,e[2]=y*l-M,e[6]=b+m*l,e[10]=a*c}else if(t.order==="ZXY"){const m=c*d,y=c*p,M=h*d,b=h*p;e[0]=m-b*l,e[4]=-a*p,e[8]=M+y*l,e[1]=y+M*l,e[5]=a*d,e[9]=b-m*l,e[2]=-a*h,e[6]=l,e[10]=a*c}else if(t.order==="ZYX"){const m=a*d,y=a*p,M=l*d,b=l*p;e[0]=c*d,e[4]=M*h-y,e[8]=m*h+b,e[1]=c*p,e[5]=b*h+m,e[9]=y*h-M,e[2]=-h,e[6]=l*c,e[10]=a*c}else if(t.order==="YZX"){const m=a*c,y=a*h,M=l*c,b=l*h;e[0]=c*d,e[4]=b-m*p,e[8]=M*p+y,e[1]=p,e[5]=a*d,e[9]=-l*d,e[2]=-h*d,e[6]=y*p+M,e[10]=m-b*p}else if(t.order==="XZY"){const m=a*c,y=a*h,M=l*c,b=l*h;e[0]=c*d,e[4]=-p,e[8]=h*d,e[1]=m*p+b,e[5]=a*d,e[9]=y*p-M,e[2]=M*p-y,e[6]=l*d,e[10]=b*p+m}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(K0,t,J0)}lookAt(t,e,n){const s=this.elements;return rn.subVectors(t,e),rn.lengthSq()===0&&(rn.z=1),rn.normalize(),_i.crossVectors(n,rn),_i.lengthSq()===0&&(Math.abs(n.z)===1?rn.x+=1e-4:rn.z+=1e-4,rn.normalize(),_i.crossVectors(n,rn)),_i.normalize(),no.crossVectors(rn,_i),s[0]=_i.x,s[4]=no.x,s[8]=rn.x,s[1]=_i.y,s[5]=no.y,s[9]=rn.y,s[2]=_i.z,s[6]=no.z,s[10]=rn.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,r=this.elements,a=n[0],l=n[4],c=n[8],h=n[12],d=n[1],p=n[5],m=n[9],y=n[13],M=n[2],b=n[6],v=n[10],f=n[14],D=n[3],I=n[7],C=n[11],z=n[15],N=s[0],E=s[4],S=s[8],g=s[12],_=s[1],w=s[5],L=s[9],T=s[13],K=s[2],Q=s[6],J=s[10],nt=s[14],$=s[3],ut=s[7],vt=s[11],Rt=s[15];return r[0]=a*N+l*_+c*K+h*$,r[4]=a*E+l*w+c*Q+h*ut,r[8]=a*S+l*L+c*J+h*vt,r[12]=a*g+l*T+c*nt+h*Rt,r[1]=d*N+p*_+m*K+y*$,r[5]=d*E+p*w+m*Q+y*ut,r[9]=d*S+p*L+m*J+y*vt,r[13]=d*g+p*T+m*nt+y*Rt,r[2]=M*N+b*_+v*K+f*$,r[6]=M*E+b*w+v*Q+f*ut,r[10]=M*S+b*L+v*J+f*vt,r[14]=M*g+b*T+v*nt+f*Rt,r[3]=D*N+I*_+C*K+z*$,r[7]=D*E+I*w+C*Q+z*ut,r[11]=D*S+I*L+C*J+z*vt,r[15]=D*g+I*T+C*nt+z*Rt,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[4],s=t[8],r=t[12],a=t[1],l=t[5],c=t[9],h=t[13],d=t[2],p=t[6],m=t[10],y=t[14],M=t[3],b=t[7],v=t[11],f=t[15];return M*(+r*c*p-s*h*p-r*l*m+n*h*m+s*l*y-n*c*y)+b*(+e*c*y-e*h*m+r*a*m-s*a*y+s*h*d-r*c*d)+v*(+e*h*p-e*l*y-r*a*p+n*a*y+r*l*d-n*h*d)+f*(-s*l*d-e*c*p+e*l*m+s*a*p-n*a*m+n*c*d)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){const s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=n),this}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],a=t[4],l=t[5],c=t[6],h=t[7],d=t[8],p=t[9],m=t[10],y=t[11],M=t[12],b=t[13],v=t[14],f=t[15],D=p*v*h-b*m*h+b*c*y-l*v*y-p*c*f+l*m*f,I=M*m*h-d*v*h-M*c*y+a*v*y+d*c*f-a*m*f,C=d*b*h-M*p*h+M*l*y-a*b*y-d*l*f+a*p*f,z=M*p*c-d*b*c-M*l*m+a*b*m+d*l*v-a*p*v,N=e*D+n*I+s*C+r*z;if(N===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const E=1/N;return t[0]=D*E,t[1]=(b*m*r-p*v*r-b*s*y+n*v*y+p*s*f-n*m*f)*E,t[2]=(l*v*r-b*c*r+b*s*h-n*v*h-l*s*f+n*c*f)*E,t[3]=(p*c*r-l*m*r-p*s*h+n*m*h+l*s*y-n*c*y)*E,t[4]=I*E,t[5]=(d*v*r-M*m*r+M*s*y-e*v*y-d*s*f+e*m*f)*E,t[6]=(M*c*r-a*v*r-M*s*h+e*v*h+a*s*f-e*c*f)*E,t[7]=(a*m*r-d*c*r+d*s*h-e*m*h-a*s*y+e*c*y)*E,t[8]=C*E,t[9]=(M*p*r-d*b*r-M*n*y+e*b*y+d*n*f-e*p*f)*E,t[10]=(a*b*r-M*l*r+M*n*h-e*b*h-a*n*f+e*l*f)*E,t[11]=(d*l*r-a*p*r-d*n*h+e*p*h+a*n*y-e*l*y)*E,t[12]=z*E,t[13]=(d*b*s-M*p*s+M*n*m-e*b*m-d*n*v+e*p*v)*E,t[14]=(M*l*s-a*b*s-M*n*c+e*b*c+a*n*v-e*l*v)*E,t[15]=(a*p*s-d*l*s+d*n*c-e*p*c-a*n*m+e*l*m)*E,this}scale(t){const e=this.elements,n=t.x,s=t.y,r=t.z;return e[0]*=n,e[4]*=s,e[8]*=r,e[1]*=n,e[5]*=s,e[9]*=r,e[2]*=n,e[6]*=s,e[10]*=r,e[3]*=n,e[7]*=s,e[11]*=r,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,s))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const n=Math.cos(e),s=Math.sin(e),r=1-n,a=t.x,l=t.y,c=t.z,h=r*a,d=r*l;return this.set(h*a+n,h*l-s*c,h*c+s*l,0,h*l+s*c,d*l+n,d*c-s*a,0,h*c-s*l,d*c+s*a,r*c*c+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,s,r,a){return this.set(1,n,r,0,t,1,a,0,e,s,1,0,0,0,0,1),this}compose(t,e,n){const s=this.elements,r=e._x,a=e._y,l=e._z,c=e._w,h=r+r,d=a+a,p=l+l,m=r*h,y=r*d,M=r*p,b=a*d,v=a*p,f=l*p,D=c*h,I=c*d,C=c*p,z=n.x,N=n.y,E=n.z;return s[0]=(1-(b+f))*z,s[1]=(y+C)*z,s[2]=(M-I)*z,s[3]=0,s[4]=(y-C)*N,s[5]=(1-(m+f))*N,s[6]=(v+D)*N,s[7]=0,s[8]=(M+I)*E,s[9]=(v-D)*E,s[10]=(1-(m+b))*E,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,n){const s=this.elements;let r=us.set(s[0],s[1],s[2]).length();const a=us.set(s[4],s[5],s[6]).length(),l=us.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),t.x=s[12],t.y=s[13],t.z=s[14],Sn.copy(this);const h=1/r,d=1/a,p=1/l;return Sn.elements[0]*=h,Sn.elements[1]*=h,Sn.elements[2]*=h,Sn.elements[4]*=d,Sn.elements[5]*=d,Sn.elements[6]*=d,Sn.elements[8]*=p,Sn.elements[9]*=p,Sn.elements[10]*=p,e.setFromRotationMatrix(Sn),n.x=r,n.y=a,n.z=l,this}makePerspective(t,e,n,s,r,a,l=Qn){const c=this.elements,h=2*r/(e-t),d=2*r/(n-s),p=(e+t)/(e-t),m=(n+s)/(n-s);let y,M;if(l===Qn)y=-(a+r)/(a-r),M=-2*a*r/(a-r);else if(l===Xo)y=-a/(a-r),M=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+l);return c[0]=h,c[4]=0,c[8]=p,c[12]=0,c[1]=0,c[5]=d,c[9]=m,c[13]=0,c[2]=0,c[6]=0,c[10]=y,c[14]=M,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,n,s,r,a,l=Qn){const c=this.elements,h=1/(e-t),d=1/(n-s),p=1/(a-r),m=(e+t)*h,y=(n+s)*d;let M,b;if(l===Qn)M=(a+r)*p,b=-2*p;else if(l===Xo)M=r*p,b=-1*p;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+l);return c[0]=2*h,c[4]=0,c[8]=0,c[12]=-m,c[1]=0,c[5]=2*d,c[9]=0,c[13]=-y,c[2]=0,c[6]=0,c[10]=b,c[14]=-M,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<16;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}}const us=new O,Sn=new le,K0=new O(0,0,0),J0=new O(1,1,1),_i=new O,no=new O,rn=new O,nu=new le,iu=new qs;class In{constructor(t=0,e=0,n=0,s=In.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,s=this._order){return this._x=t,this._y=e,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){const s=t.elements,r=s[0],a=s[4],l=s[8],c=s[1],h=s[5],d=s[9],p=s[2],m=s[6],y=s[10];switch(e){case"XYZ":this._y=Math.asin(je(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-d,y),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(m,h),this._z=0);break;case"YXZ":this._x=Math.asin(-je(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(l,y),this._z=Math.atan2(c,h)):(this._y=Math.atan2(-p,r),this._z=0);break;case"ZXY":this._x=Math.asin(je(m,-1,1)),Math.abs(m)<.9999999?(this._y=Math.atan2(-p,y),this._z=Math.atan2(-a,h)):(this._y=0,this._z=Math.atan2(c,r));break;case"ZYX":this._y=Math.asin(-je(p,-1,1)),Math.abs(p)<.9999999?(this._x=Math.atan2(m,y),this._z=Math.atan2(c,r)):(this._x=0,this._z=Math.atan2(-a,h));break;case"YZX":this._z=Math.asin(je(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-d,h),this._y=Math.atan2(-p,r)):(this._x=0,this._y=Math.atan2(l,y));break;case"XZY":this._z=Math.asin(-je(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(m,h),this._y=Math.atan2(l,r)):(this._x=Math.atan2(-d,y),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return nu.makeRotationFromQuaternion(t),this.setFromRotationMatrix(nu,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return iu.setFromEuler(this),this.setFromQuaternion(iu,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}In.DEFAULT_ORDER="XYZ";class vc{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let Z0=0;const su=new O,ds=new qs,jn=new le,io=new O,ar=new O,Q0=new O,t_=new qs,ru=new O(1,0,0),ou=new O(0,1,0),au=new O(0,0,1),lu={type:"added"},e_={type:"removed"},fs={type:"childadded",child:null},Ia={type:"childremoved",child:null};class Te extends Xs{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Z0++}),this.uuid=ni(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Te.DEFAULT_UP.clone();const t=new O,e=new In,n=new qs,s=new O(1,1,1);function r(){n.setFromEuler(e,!1)}function a(){e.setFromQuaternion(n,void 0,!1)}e._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new le},normalMatrix:{value:new Wt}}),this.matrix=new le,this.matrixWorld=new le,this.matrixAutoUpdate=Te.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Te.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new vc,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return ds.setFromAxisAngle(t,e),this.quaternion.multiply(ds),this}rotateOnWorldAxis(t,e){return ds.setFromAxisAngle(t,e),this.quaternion.premultiply(ds),this}rotateX(t){return this.rotateOnAxis(ru,t)}rotateY(t){return this.rotateOnAxis(ou,t)}rotateZ(t){return this.rotateOnAxis(au,t)}translateOnAxis(t,e){return su.copy(t).applyQuaternion(this.quaternion),this.position.add(su.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(ru,t)}translateY(t){return this.translateOnAxis(ou,t)}translateZ(t){return this.translateOnAxis(au,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(jn.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?io.copy(t):io.set(t,e,n);const s=this.parent;this.updateWorldMatrix(!0,!1),ar.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?jn.lookAt(ar,io,this.up):jn.lookAt(io,ar,this.up),this.quaternion.setFromRotationMatrix(jn),s&&(jn.extractRotation(s.matrixWorld),ds.setFromRotationMatrix(jn),this.quaternion.premultiply(ds.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(lu),fs.child=t,this.dispatchEvent(fs),fs.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(e_),Ia.child=t,this.dispatchEvent(Ia),Ia.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),jn.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),jn.multiply(t.parent.matrixWorld)),t.applyMatrix4(jn),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(lu),fs.child=t,this.dispatchEvent(fs),fs.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,s=this.children.length;n<s;n++){const a=this.children[n].getObjectByProperty(t,e);if(a!==void 0)return a}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ar,t,Q0),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ar,t_,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e){const n=this.parent;if(t===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(t){const e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.visibility=this._visibility,s.active=this._active,s.bounds=this._bounds.map(l=>({boxInitialized:l.boxInitialized,boxMin:l.box.min.toArray(),boxMax:l.box.max.toArray(),sphereInitialized:l.sphereInitialized,sphereRadius:l.sphere.radius,sphereCenter:l.sphere.center.toArray()})),s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.geometryCount=this._geometryCount,s.matricesTexture=this._matricesTexture.toJSON(t),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(s.boundingSphere={center:s.boundingSphere.center.toArray(),radius:s.boundingSphere.radius}),this.boundingBox!==null&&(s.boundingBox={min:s.boundingBox.min.toArray(),max:s.boundingBox.max.toArray()}));function r(l,c){return l[c.uuid]===void 0&&(l[c.uuid]=c.toJSON(t)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(t.geometries,this.geometry);const l=this.geometry.parameters;if(l!==void 0&&l.shapes!==void 0){const c=l.shapes;if(Array.isArray(c))for(let h=0,d=c.length;h<d;h++){const p=c[h];r(t.shapes,p)}else r(t.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const l=[];for(let c=0,h=this.material.length;c<h;c++)l.push(r(t.materials,this.material[c]));s.material=l}else s.material=r(t.materials,this.material);if(this.children.length>0){s.children=[];for(let l=0;l<this.children.length;l++)s.children.push(this.children[l].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let l=0;l<this.animations.length;l++){const c=this.animations[l];s.animations.push(r(t.animations,c))}}if(e){const l=a(t.geometries),c=a(t.materials),h=a(t.textures),d=a(t.images),p=a(t.shapes),m=a(t.skeletons),y=a(t.animations),M=a(t.nodes);l.length>0&&(n.geometries=l),c.length>0&&(n.materials=c),h.length>0&&(n.textures=h),d.length>0&&(n.images=d),p.length>0&&(n.shapes=p),m.length>0&&(n.skeletons=m),y.length>0&&(n.animations=y),M.length>0&&(n.nodes=M)}return n.object=s,n;function a(l){const c=[];for(const h in l){const d=l[h];delete d.metadata,c.push(d)}return c}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){const s=t.children[n];this.add(s.clone())}return this}}Te.DEFAULT_UP=new O(0,1,0);Te.DEFAULT_MATRIX_AUTO_UPDATE=!0;Te.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const En=new O,$n=new O,Da=new O,Yn=new O,ps=new O,ms=new O,cu=new O,La=new O,Ua=new O,Na=new O,Oa=new ve,Fa=new ve,Ba=new ve;class mn{constructor(t=new O,e=new O,n=new O){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,s){s.subVectors(n,e),En.subVectors(t,e),s.cross(En);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(t,e,n,s,r){En.subVectors(s,e),$n.subVectors(n,e),Da.subVectors(t,e);const a=En.dot(En),l=En.dot($n),c=En.dot(Da),h=$n.dot($n),d=$n.dot(Da),p=a*h-l*l;if(p===0)return r.set(0,0,0),null;const m=1/p,y=(h*c-l*d)*m,M=(a*d-l*c)*m;return r.set(1-y-M,M,y)}static containsPoint(t,e,n,s){return this.getBarycoord(t,e,n,s,Yn)===null?!1:Yn.x>=0&&Yn.y>=0&&Yn.x+Yn.y<=1}static getInterpolation(t,e,n,s,r,a,l,c){return this.getBarycoord(t,e,n,s,Yn)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(r,Yn.x),c.addScaledVector(a,Yn.y),c.addScaledVector(l,Yn.z),c)}static getInterpolatedAttribute(t,e,n,s,r,a){return Oa.setScalar(0),Fa.setScalar(0),Ba.setScalar(0),Oa.fromBufferAttribute(t,e),Fa.fromBufferAttribute(t,n),Ba.fromBufferAttribute(t,s),a.setScalar(0),a.addScaledVector(Oa,r.x),a.addScaledVector(Fa,r.y),a.addScaledVector(Ba,r.z),a}static isFrontFacing(t,e,n,s){return En.subVectors(n,e),$n.subVectors(t,e),En.cross($n).dot(s)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,s){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,n,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return En.subVectors(this.c,this.b),$n.subVectors(this.a,this.b),En.cross($n).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return mn.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return mn.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,s,r){return mn.getInterpolation(t,this.a,this.b,this.c,e,n,s,r)}containsPoint(t){return mn.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return mn.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const n=this.a,s=this.b,r=this.c;let a,l;ps.subVectors(s,n),ms.subVectors(r,n),La.subVectors(t,n);const c=ps.dot(La),h=ms.dot(La);if(c<=0&&h<=0)return e.copy(n);Ua.subVectors(t,s);const d=ps.dot(Ua),p=ms.dot(Ua);if(d>=0&&p<=d)return e.copy(s);const m=c*p-d*h;if(m<=0&&c>=0&&d<=0)return a=c/(c-d),e.copy(n).addScaledVector(ps,a);Na.subVectors(t,r);const y=ps.dot(Na),M=ms.dot(Na);if(M>=0&&y<=M)return e.copy(r);const b=y*h-c*M;if(b<=0&&h>=0&&M<=0)return l=h/(h-M),e.copy(n).addScaledVector(ms,l);const v=d*M-y*p;if(v<=0&&p-d>=0&&y-M>=0)return cu.subVectors(r,s),l=(p-d)/(p-d+(y-M)),e.copy(s).addScaledVector(cu,l);const f=1/(v+b+m);return a=b*f,l=m*f,e.copy(n).addScaledVector(ps,a).addScaledVector(ms,l)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const vf={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},vi={h:0,s:0,l:0},so={h:0,s:0,l:0};function ka(i,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?i+(t-i)*6*e:e<1/2?t:e<2/3?i+(t-i)*6*(2/3-e):i}class bt{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){const s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=ln){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,ee.toWorkingColorSpace(this,e),this}setRGB(t,e,n,s=ee.workingColorSpace){return this.r=t,this.g=e,this.b=n,ee.toWorkingColorSpace(this,s),this}setHSL(t,e,n,s=ee.workingColorSpace){if(t=_c(t,1),e=je(e,0,1),n=je(n,0,1),e===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+e):n+e-n*e,a=2*n-r;this.r=ka(a,r,t+1/3),this.g=ka(a,r,t),this.b=ka(a,r,t-1/3)}return ee.toWorkingColorSpace(this,s),this}setStyle(t,e=ln){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let r;const a=s[1],l=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(l))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(l))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(l))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){const r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(a===6)return this.setHex(parseInt(r,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=ln){const n=vf[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=ii(t.r),this.g=ii(t.g),this.b=ii(t.b),this}copyLinearToSRGB(t){return this.r=Us(t.r),this.g=Us(t.g),this.b=Us(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=ln){return ee.fromWorkingColorSpace(qe.copy(this),t),Math.round(je(qe.r*255,0,255))*65536+Math.round(je(qe.g*255,0,255))*256+Math.round(je(qe.b*255,0,255))}getHexString(t=ln){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=ee.workingColorSpace){ee.fromWorkingColorSpace(qe.copy(this),e);const n=qe.r,s=qe.g,r=qe.b,a=Math.max(n,s,r),l=Math.min(n,s,r);let c,h;const d=(l+a)/2;if(l===a)c=0,h=0;else{const p=a-l;switch(h=d<=.5?p/(a+l):p/(2-a-l),a){case n:c=(s-r)/p+(s<r?6:0);break;case s:c=(r-n)/p+2;break;case r:c=(n-s)/p+4;break}c/=6}return t.h=c,t.s=h,t.l=d,t}getRGB(t,e=ee.workingColorSpace){return ee.fromWorkingColorSpace(qe.copy(this),e),t.r=qe.r,t.g=qe.g,t.b=qe.b,t}getStyle(t=ln){ee.fromWorkingColorSpace(qe.copy(this),t);const e=qe.r,n=qe.g,s=qe.b;return t!==ln?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(t,e,n){return this.getHSL(vi),this.setHSL(vi.h+t,vi.s+e,vi.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(vi),t.getHSL(so);const n=br(vi.h,so.h,e),s=br(vi.s,so.s,e),r=br(vi.l,so.l,e);return this.setHSL(n,s,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,n=this.g,s=this.b,r=t.elements;return this.r=r[0]*e+r[3]*n+r[6]*s,this.g=r[1]*e+r[4]*n+r[7]*s,this.b=r[2]*e+r[5]*n+r[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const qe=new bt;bt.NAMES=vf;let n_=0;class Ti extends Xs{static get type(){return"Material"}get type(){return this.constructor.type}set type(t){}constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:n_++}),this.uuid=ni(),this.name="",this.blending=Ds,this.side=bi,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=ll,this.blendDst=cl,this.blendEquation=zi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new bt(0,0,0),this.blendAlpha=0,this.depthFunc=Fs,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=qh,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=os,this.stencilZFail=os,this.stencilZPass=os,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Ds&&(n.blending=this.blending),this.side!==bi&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==ll&&(n.blendSrc=this.blendSrc),this.blendDst!==cl&&(n.blendDst=this.blendDst),this.blendEquation!==zi&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==Fs&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==qh&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==os&&(n.stencilFail=this.stencilFail),this.stencilZFail!==os&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==os&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){const a=[];for(const l in r){const c=r[l];delete c.metadata,a.push(c)}return a}if(e){const r=s(t.textures),a=s(t.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let n=null;if(e!==null){const s=e.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=e[r].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class ia extends Ti{static get type(){return"MeshBasicMaterial"}constructor(t){super(),this.isMeshBasicMaterial=!0,this.color=new bt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new In,this.combine=Kd,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const Pe=new O,ro=new Mt;class Ce{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=jl,this.updateRanges=[],this.gpuType=kn,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[t+s]=e.array[n+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)ro.fromBufferAttribute(this,e),ro.applyMatrix3(t),this.setXY(e,ro.x,ro.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)Pe.fromBufferAttribute(this,e),Pe.applyMatrix3(t),this.setXYZ(e,Pe.x,Pe.y,Pe.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)Pe.fromBufferAttribute(this,e),Pe.applyMatrix4(t),this.setXYZ(e,Pe.x,Pe.y,Pe.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)Pe.fromBufferAttribute(this,e),Pe.applyNormalMatrix(t),this.setXYZ(e,Pe.x,Pe.y,Pe.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)Pe.fromBufferAttribute(this,e),Pe.transformDirection(t),this.setXYZ(e,Pe.x,Pe.y,Pe.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=wn(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=ue(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=wn(e,this.array)),e}setX(t,e){return this.normalized&&(e=ue(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=wn(e,this.array)),e}setY(t,e){return this.normalized&&(e=ue(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=wn(e,this.array)),e}setZ(t,e){return this.normalized&&(e=ue(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=wn(e,this.array)),e}setW(t,e){return this.normalized&&(e=ue(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=ue(e,this.array),n=ue(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,s){return t*=this.itemSize,this.normalized&&(e=ue(e,this.array),n=ue(n,this.array),s=ue(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t*=this.itemSize,this.normalized&&(e=ue(e,this.array),n=ue(n,this.array),s=ue(s,this.array),r=ue(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==jl&&(t.usage=this.usage),t}}class yf extends Ce{constructor(t,e,n){super(new Uint16Array(t),e,n)}}class xf extends Ce{constructor(t,e,n){super(new Uint32Array(t),e,n)}}class ye extends Ce{constructor(t,e,n){super(new Float32Array(t),e,n)}}let i_=0;const fn=new le,za=new Te,gs=new O,on=new Zi,lr=new Zi,Fe=new O;class Re extends Xs{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:i_++}),this.uuid=ni(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(mf(t)?xf:yf)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new Wt().getNormalMatrix(t);n.applyNormalMatrix(r),n.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return fn.makeRotationFromQuaternion(t),this.applyMatrix4(fn),this}rotateX(t){return fn.makeRotationX(t),this.applyMatrix4(fn),this}rotateY(t){return fn.makeRotationY(t),this.applyMatrix4(fn),this}rotateZ(t){return fn.makeRotationZ(t),this.applyMatrix4(fn),this}translate(t,e,n){return fn.makeTranslation(t,e,n),this.applyMatrix4(fn),this}scale(t,e,n){return fn.makeScale(t,e,n),this.applyMatrix4(fn),this}lookAt(t){return za.lookAt(t),za.updateMatrix(),this.applyMatrix4(za.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(gs).negate(),this.translate(gs.x,gs.y,gs.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const n=[];for(let s=0,r=t.length;s<r;s++){const a=t[s];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new ye(n,3))}else{for(let n=0,s=e.count;n<s;n++){const r=t[n];e.setXYZ(n,r.x,r.y,r.z||0)}t.length>e.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Zi);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new O(-1/0,-1/0,-1/0),new O(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,s=e.length;n<s;n++){const r=e[n];on.setFromBufferAttribute(r),this.morphTargetsRelative?(Fe.addVectors(this.boundingBox.min,on.min),this.boundingBox.expandByPoint(Fe),Fe.addVectors(this.boundingBox.max,on.max),this.boundingBox.expandByPoint(Fe)):(this.boundingBox.expandByPoint(on.min),this.boundingBox.expandByPoint(on.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Qi);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new O,1/0);return}if(t){const n=this.boundingSphere.center;if(on.setFromBufferAttribute(t),e)for(let r=0,a=e.length;r<a;r++){const l=e[r];lr.setFromBufferAttribute(l),this.morphTargetsRelative?(Fe.addVectors(on.min,lr.min),on.expandByPoint(Fe),Fe.addVectors(on.max,lr.max),on.expandByPoint(Fe)):(on.expandByPoint(lr.min),on.expandByPoint(lr.max))}on.getCenter(n);let s=0;for(let r=0,a=t.count;r<a;r++)Fe.fromBufferAttribute(t,r),s=Math.max(s,n.distanceToSquared(Fe));if(e)for(let r=0,a=e.length;r<a;r++){const l=e[r],c=this.morphTargetsRelative;for(let h=0,d=l.count;h<d;h++)Fe.fromBufferAttribute(l,h),c&&(gs.fromBufferAttribute(t,h),Fe.add(gs)),s=Math.max(s,n.distanceToSquared(Fe))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=e.position,s=e.normal,r=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Ce(new Float32Array(4*n.count),4));const a=this.getAttribute("tangent"),l=[],c=[];for(let S=0;S<n.count;S++)l[S]=new O,c[S]=new O;const h=new O,d=new O,p=new O,m=new Mt,y=new Mt,M=new Mt,b=new O,v=new O;function f(S,g,_){h.fromBufferAttribute(n,S),d.fromBufferAttribute(n,g),p.fromBufferAttribute(n,_),m.fromBufferAttribute(r,S),y.fromBufferAttribute(r,g),M.fromBufferAttribute(r,_),d.sub(h),p.sub(h),y.sub(m),M.sub(m);const w=1/(y.x*M.y-M.x*y.y);isFinite(w)&&(b.copy(d).multiplyScalar(M.y).addScaledVector(p,-y.y).multiplyScalar(w),v.copy(p).multiplyScalar(y.x).addScaledVector(d,-M.x).multiplyScalar(w),l[S].add(b),l[g].add(b),l[_].add(b),c[S].add(v),c[g].add(v),c[_].add(v))}let D=this.groups;D.length===0&&(D=[{start:0,count:t.count}]);for(let S=0,g=D.length;S<g;++S){const _=D[S],w=_.start,L=_.count;for(let T=w,K=w+L;T<K;T+=3)f(t.getX(T+0),t.getX(T+1),t.getX(T+2))}const I=new O,C=new O,z=new O,N=new O;function E(S){z.fromBufferAttribute(s,S),N.copy(z);const g=l[S];I.copy(g),I.sub(z.multiplyScalar(z.dot(g))).normalize(),C.crossVectors(N,g);const w=C.dot(c[S])<0?-1:1;a.setXYZW(S,I.x,I.y,I.z,w)}for(let S=0,g=D.length;S<g;++S){const _=D[S],w=_.start,L=_.count;for(let T=w,K=w+L;T<K;T+=3)E(t.getX(T+0)),E(t.getX(T+1)),E(t.getX(T+2))}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Ce(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let m=0,y=n.count;m<y;m++)n.setXYZ(m,0,0,0);const s=new O,r=new O,a=new O,l=new O,c=new O,h=new O,d=new O,p=new O;if(t)for(let m=0,y=t.count;m<y;m+=3){const M=t.getX(m+0),b=t.getX(m+1),v=t.getX(m+2);s.fromBufferAttribute(e,M),r.fromBufferAttribute(e,b),a.fromBufferAttribute(e,v),d.subVectors(a,r),p.subVectors(s,r),d.cross(p),l.fromBufferAttribute(n,M),c.fromBufferAttribute(n,b),h.fromBufferAttribute(n,v),l.add(d),c.add(d),h.add(d),n.setXYZ(M,l.x,l.y,l.z),n.setXYZ(b,c.x,c.y,c.z),n.setXYZ(v,h.x,h.y,h.z)}else for(let m=0,y=e.count;m<y;m+=3)s.fromBufferAttribute(e,m+0),r.fromBufferAttribute(e,m+1),a.fromBufferAttribute(e,m+2),d.subVectors(a,r),p.subVectors(s,r),d.cross(p),n.setXYZ(m+0,d.x,d.y,d.z),n.setXYZ(m+1,d.x,d.y,d.z),n.setXYZ(m+2,d.x,d.y,d.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)Fe.fromBufferAttribute(t,e),Fe.normalize(),t.setXYZ(e,Fe.x,Fe.y,Fe.z)}toNonIndexed(){function t(l,c){const h=l.array,d=l.itemSize,p=l.normalized,m=new h.constructor(c.length*d);let y=0,M=0;for(let b=0,v=c.length;b<v;b++){l.isInterleavedBufferAttribute?y=c[b]*l.data.stride+l.offset:y=c[b]*d;for(let f=0;f<d;f++)m[M++]=h[y++]}return new Ce(m,d,p)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new Re,n=this.index.array,s=this.attributes;for(const l in s){const c=s[l],h=t(c,n);e.setAttribute(l,h)}const r=this.morphAttributes;for(const l in r){const c=[],h=r[l];for(let d=0,p=h.length;d<p;d++){const m=h[d],y=t(m,n);c.push(y)}e.morphAttributes[l]=c}e.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let l=0,c=a.length;l<c;l++){const h=a[l];e.addGroup(h.start,h.count,h.materialIndex)}return e}toJSON(){const t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const h in c)c[h]!==void 0&&(t[h]=c[h]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const n=this.attributes;for(const c in n){const h=n[c];t.data.attributes[c]=h.toJSON(t.data)}const s={};let r=!1;for(const c in this.morphAttributes){const h=this.morphAttributes[c],d=[];for(let p=0,m=h.length;p<m;p++){const y=h[p];d.push(y.toJSON(t.data))}d.length>0&&(s[c]=d,r=!0)}r&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(t.data.groups=JSON.parse(JSON.stringify(a)));const l=this.boundingSphere;return l!==null&&(t.data.boundingSphere={center:l.center.toArray(),radius:l.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const n=t.index;n!==null&&this.setIndex(n.clone(e));const s=t.attributes;for(const h in s){const d=s[h];this.setAttribute(h,d.clone(e))}const r=t.morphAttributes;for(const h in r){const d=[],p=r[h];for(let m=0,y=p.length;m<y;m++)d.push(p[m].clone(e));this.morphAttributes[h]=d}this.morphTargetsRelative=t.morphTargetsRelative;const a=t.groups;for(let h=0,d=a.length;h<d;h++){const p=a[h];this.addGroup(p.start,p.count,p.materialIndex)}const l=t.boundingBox;l!==null&&(this.boundingBox=l.clone());const c=t.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const hu=new le,Ii=new na,oo=new Qi,uu=new O,ao=new O,lo=new O,co=new O,Va=new O,ho=new O,du=new O,uo=new O;class Ft extends Te{constructor(t=new Re,e=new ia){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const l=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[l]=r}}}}getVertexPosition(t,e){const n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,a=n.morphTargetsRelative;e.fromBufferAttribute(s,t);const l=this.morphTargetInfluences;if(r&&l){ho.set(0,0,0);for(let c=0,h=r.length;c<h;c++){const d=l[c],p=r[c];d!==0&&(Va.fromBufferAttribute(p,t),a?ho.addScaledVector(Va,d):ho.addScaledVector(Va.sub(e),d))}e.add(ho)}return e}raycast(t,e){const n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),oo.copy(n.boundingSphere),oo.applyMatrix4(r),Ii.copy(t.ray).recast(t.near),!(oo.containsPoint(Ii.origin)===!1&&(Ii.intersectSphere(oo,uu)===null||Ii.origin.distanceToSquared(uu)>(t.far-t.near)**2))&&(hu.copy(r).invert(),Ii.copy(t.ray).applyMatrix4(hu),!(n.boundingBox!==null&&Ii.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,Ii)))}_computeIntersections(t,e,n){let s;const r=this.geometry,a=this.material,l=r.index,c=r.attributes.position,h=r.attributes.uv,d=r.attributes.uv1,p=r.attributes.normal,m=r.groups,y=r.drawRange;if(l!==null)if(Array.isArray(a))for(let M=0,b=m.length;M<b;M++){const v=m[M],f=a[v.materialIndex],D=Math.max(v.start,y.start),I=Math.min(l.count,Math.min(v.start+v.count,y.start+y.count));for(let C=D,z=I;C<z;C+=3){const N=l.getX(C),E=l.getX(C+1),S=l.getX(C+2);s=fo(this,f,t,n,h,d,p,N,E,S),s&&(s.faceIndex=Math.floor(C/3),s.face.materialIndex=v.materialIndex,e.push(s))}}else{const M=Math.max(0,y.start),b=Math.min(l.count,y.start+y.count);for(let v=M,f=b;v<f;v+=3){const D=l.getX(v),I=l.getX(v+1),C=l.getX(v+2);s=fo(this,a,t,n,h,d,p,D,I,C),s&&(s.faceIndex=Math.floor(v/3),e.push(s))}}else if(c!==void 0)if(Array.isArray(a))for(let M=0,b=m.length;M<b;M++){const v=m[M],f=a[v.materialIndex],D=Math.max(v.start,y.start),I=Math.min(c.count,Math.min(v.start+v.count,y.start+y.count));for(let C=D,z=I;C<z;C+=3){const N=C,E=C+1,S=C+2;s=fo(this,f,t,n,h,d,p,N,E,S),s&&(s.faceIndex=Math.floor(C/3),s.face.materialIndex=v.materialIndex,e.push(s))}}else{const M=Math.max(0,y.start),b=Math.min(c.count,y.start+y.count);for(let v=M,f=b;v<f;v+=3){const D=v,I=v+1,C=v+2;s=fo(this,a,t,n,h,d,p,D,I,C),s&&(s.faceIndex=Math.floor(v/3),e.push(s))}}}}function s_(i,t,e,n,s,r,a,l){let c;if(t.side===Qe?c=n.intersectTriangle(a,r,s,!0,l):c=n.intersectTriangle(s,r,a,t.side===bi,l),c===null)return null;uo.copy(l),uo.applyMatrix4(i.matrixWorld);const h=e.ray.origin.distanceTo(uo);return h<e.near||h>e.far?null:{distance:h,point:uo.clone(),object:i}}function fo(i,t,e,n,s,r,a,l,c,h){i.getVertexPosition(l,ao),i.getVertexPosition(c,lo),i.getVertexPosition(h,co);const d=s_(i,t,e,n,ao,lo,co,du);if(d){const p=new O;mn.getBarycoord(du,ao,lo,co,p),s&&(d.uv=mn.getInterpolatedAttribute(s,l,c,h,p,new Mt)),r&&(d.uv1=mn.getInterpolatedAttribute(r,l,c,h,p,new Mt)),a&&(d.normal=mn.getInterpolatedAttribute(a,l,c,h,p,new O),d.normal.dot(n.direction)>0&&d.normal.multiplyScalar(-1));const m={a:l,b:c,c:h,normal:new O,materialIndex:0};mn.getNormal(ao,lo,co,m.normal),d.face=m,d.barycoord=p}return d}class _n extends Re{constructor(t=1,e=1,n=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:s,heightSegments:r,depthSegments:a};const l=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);const c=[],h=[],d=[],p=[];let m=0,y=0;M("z","y","x",-1,-1,n,e,t,a,r,0),M("z","y","x",1,-1,n,e,-t,a,r,1),M("x","z","y",1,1,t,n,e,s,a,2),M("x","z","y",1,-1,t,n,-e,s,a,3),M("x","y","z",1,-1,t,e,n,s,r,4),M("x","y","z",-1,-1,t,e,-n,s,r,5),this.setIndex(c),this.setAttribute("position",new ye(h,3)),this.setAttribute("normal",new ye(d,3)),this.setAttribute("uv",new ye(p,2));function M(b,v,f,D,I,C,z,N,E,S,g){const _=C/E,w=z/S,L=C/2,T=z/2,K=N/2,Q=E+1,J=S+1;let nt=0,$=0;const ut=new O;for(let vt=0;vt<J;vt++){const Rt=vt*w-T;for(let Bt=0;Bt<Q;Bt++){const kt=Bt*_-L;ut[b]=kt*D,ut[v]=Rt*I,ut[f]=K,h.push(ut.x,ut.y,ut.z),ut[b]=0,ut[v]=0,ut[f]=N>0?1:-1,d.push(ut.x,ut.y,ut.z),p.push(Bt/E),p.push(1-vt/S),nt+=1}}for(let vt=0;vt<S;vt++)for(let Rt=0;Rt<E;Rt++){const Bt=m+Rt+Q*vt,kt=m+Rt+Q*(vt+1),Z=m+(Rt+1)+Q*(vt+1),st=m+(Rt+1)+Q*vt;c.push(Bt,kt,st),c.push(kt,Z,st),$+=6}l.addGroup(y,$,g),y+=$,m+=nt}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new _n(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function Gs(i){const t={};for(const e in i){t[e]={};for(const n in i[e]){const s=i[e][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=s.clone():Array.isArray(s)?t[e][n]=s.slice():t[e][n]=s}}return t}function Je(i){const t={};for(let e=0;e<i.length;e++){const n=Gs(i[e]);for(const s in n)t[s]=n[s]}return t}function r_(i){const t=[];for(let e=0;e<i.length;e++)t.push(i[e].clone());return t}function Mf(i){const t=i.getRenderTarget();return t===null?i.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:ee.workingColorSpace}const Cr={clone:Gs,merge:Je};var o_=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,a_=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class we extends Ti{static get type(){return"ShaderMaterial"}constructor(t){super(),this.isShaderMaterial=!0,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=o_,this.fragmentShader=a_,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Gs(t.uniforms),this.uniformsGroups=r_(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const s in this.uniforms){const a=this.uniforms[s].value;a&&a.isTexture?e.uniforms[s]={type:"t",value:a.toJSON(t).uuid}:a&&a.isColor?e.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?e.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?e.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?e.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?e.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?e.uniforms[s]={type:"m4",value:a.toArray()}:e.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const n={};for(const s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}}class Sf extends Te{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new le,this.projectionMatrix=new le,this.projectionMatrixInverse=new le,this.coordinateSystem=Qn}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const yi=new O,fu=new Mt,pu=new Mt;class cn extends Sf{constructor(t=50,e=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=Ar*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(Er*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return Ar*2*Math.atan(Math.tan(Er*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){yi.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(yi.x,yi.y).multiplyScalar(-t/yi.z),yi.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(yi.x,yi.y).multiplyScalar(-t/yi.z)}getViewSize(t,e){return this.getViewBounds(t,fu,pu),e.subVectors(pu,fu)}setViewOffset(t,e,n,s,r,a){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(Er*.5*this.fov)/this.zoom,n=2*e,s=this.aspect*n,r=-.5*s;const a=this.view;if(this.view!==null&&this.view.enabled){const c=a.fullWidth,h=a.fullHeight;r+=a.offsetX*s/c,e-=a.offsetY*n/h,s*=a.width/c,n*=a.height/h}const l=this.filmOffset;l!==0&&(r+=t*l/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,e,e-n,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const _s=-90,vs=1;class l_ extends Te{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new cn(_s,vs,t,e);s.layers=this.layers,this.add(s);const r=new cn(_s,vs,t,e);r.layers=this.layers,this.add(r);const a=new cn(_s,vs,t,e);a.layers=this.layers,this.add(a);const l=new cn(_s,vs,t,e);l.layers=this.layers,this.add(l);const c=new cn(_s,vs,t,e);c.layers=this.layers,this.add(c);const h=new cn(_s,vs,t,e);h.layers=this.layers,this.add(h)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[n,s,r,a,l,c]=e;for(const h of e)this.remove(h);if(t===Qn)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),l.up.set(0,1,0),l.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(t===Xo)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),l.up.set(0,-1,0),l.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const h of e)this.add(h),h.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[r,a,l,c,h,d]=this.children,p=t.getRenderTarget(),m=t.getActiveCubeFace(),y=t.getActiveMipmapLevel(),M=t.xr.enabled;t.xr.enabled=!1;const b=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,s),t.render(e,r),t.setRenderTarget(n,1,s),t.render(e,a),t.setRenderTarget(n,2,s),t.render(e,l),t.setRenderTarget(n,3,s),t.render(e,c),t.setRenderTarget(n,4,s),t.render(e,h),n.texture.generateMipmaps=b,t.setRenderTarget(n,5,s),t.render(e,d),t.setRenderTarget(p,m,y),t.xr.enabled=M,n.texture.needsPMREMUpdate=!0}}class yc extends $e{constructor(t,e,n,s,r,a,l,c,h,d){t=t!==void 0?t:[],e=e!==void 0?e:Bs,super(t,e,n,s,r,a,l,c,h,d),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class c_ extends Rn{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const n={width:t,height:t,depth:1},s=[n,n,n,n,n,n];this.texture=new yc(s,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:gn}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new _n(5,5,5),r=new we({name:"CubemapFromEquirect",uniforms:Gs(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Qe,blending:ti});r.uniforms.tEquirect.value=e;const a=new Ft(s,r),l=e.minFilter;return e.minFilter===Xi&&(e.minFilter=gn),new l_(1,10,this).update(t,a),e.minFilter=l,a.geometry.dispose(),a.material.dispose(),this}clear(t,e,n,s){const r=t.getRenderTarget();for(let a=0;a<6;a++)t.setRenderTarget(this,a),t.clear(e,n,s);t.setRenderTarget(r)}}const Ga=new O,h_=new O,u_=new Wt;class Oi{constructor(t=new O(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,s){return this.normal.set(t,e,n),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){const s=Ga.subVectors(n,e).cross(h_.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const n=t.delta(Ga),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const r=-(t.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:e.copy(t.start).addScaledVector(n,r)}intersectsLine(t){const e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const n=e||u_.getNormalMatrix(t),s=this.coplanarPoint(Ga).applyMatrix4(t),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Di=new Qi,po=new O;class xc{constructor(t=new Oi,e=new Oi,n=new Oi,s=new Oi,r=new Oi,a=new Oi){this.planes=[t,e,n,s,r,a]}set(t,e,n,s,r,a){const l=this.planes;return l[0].copy(t),l[1].copy(e),l[2].copy(n),l[3].copy(s),l[4].copy(r),l[5].copy(a),this}copy(t){const e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=Qn){const n=this.planes,s=t.elements,r=s[0],a=s[1],l=s[2],c=s[3],h=s[4],d=s[5],p=s[6],m=s[7],y=s[8],M=s[9],b=s[10],v=s[11],f=s[12],D=s[13],I=s[14],C=s[15];if(n[0].setComponents(c-r,m-h,v-y,C-f).normalize(),n[1].setComponents(c+r,m+h,v+y,C+f).normalize(),n[2].setComponents(c+a,m+d,v+M,C+D).normalize(),n[3].setComponents(c-a,m-d,v-M,C-D).normalize(),n[4].setComponents(c-l,m-p,v-b,C-I).normalize(),e===Qn)n[5].setComponents(c+l,m+p,v+b,C+I).normalize();else if(e===Xo)n[5].setComponents(l,p,b,I).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),Di.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),Di.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(Di)}intersectsSprite(t){return Di.center.set(0,0,0),Di.radius=.7071067811865476,Di.applyMatrix4(t.matrixWorld),this.intersectsSphere(Di)}intersectsSphere(t){const e=this.planes,n=t.center,s=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(t){const e=this.planes;for(let n=0;n<6;n++){const s=e[n];if(po.x=s.normal.x>0?t.max.x:t.min.x,po.y=s.normal.y>0?t.max.y:t.min.y,po.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(po)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function Ef(){let i=null,t=!1,e=null,n=null;function s(r,a){e(r,a),n=i.requestAnimationFrame(s)}return{start:function(){t!==!0&&e!==null&&(n=i.requestAnimationFrame(s),t=!0)},stop:function(){i.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){i=r}}}function d_(i){const t=new WeakMap;function e(l,c){const h=l.array,d=l.usage,p=h.byteLength,m=i.createBuffer();i.bindBuffer(c,m),i.bufferData(c,h,d),l.onUploadCallback();let y;if(h instanceof Float32Array)y=i.FLOAT;else if(h instanceof Uint16Array)l.isFloat16BufferAttribute?y=i.HALF_FLOAT:y=i.UNSIGNED_SHORT;else if(h instanceof Int16Array)y=i.SHORT;else if(h instanceof Uint32Array)y=i.UNSIGNED_INT;else if(h instanceof Int32Array)y=i.INT;else if(h instanceof Int8Array)y=i.BYTE;else if(h instanceof Uint8Array)y=i.UNSIGNED_BYTE;else if(h instanceof Uint8ClampedArray)y=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+h);return{buffer:m,type:y,bytesPerElement:h.BYTES_PER_ELEMENT,version:l.version,size:p}}function n(l,c,h){const d=c.array,p=c.updateRanges;if(i.bindBuffer(h,l),p.length===0)i.bufferSubData(h,0,d);else{p.sort((y,M)=>y.start-M.start);let m=0;for(let y=1;y<p.length;y++){const M=p[m],b=p[y];b.start<=M.start+M.count+1?M.count=Math.max(M.count,b.start+b.count-M.start):(++m,p[m]=b)}p.length=m+1;for(let y=0,M=p.length;y<M;y++){const b=p[y];i.bufferSubData(h,b.start*d.BYTES_PER_ELEMENT,d,b.start,b.count)}c.clearUpdateRanges()}c.onUploadCallback()}function s(l){return l.isInterleavedBufferAttribute&&(l=l.data),t.get(l)}function r(l){l.isInterleavedBufferAttribute&&(l=l.data);const c=t.get(l);c&&(i.deleteBuffer(c.buffer),t.delete(l))}function a(l,c){if(l.isInterleavedBufferAttribute&&(l=l.data),l.isGLBufferAttribute){const d=t.get(l);(!d||d.version<l.version)&&t.set(l,{buffer:l.buffer,type:l.type,bytesPerElement:l.elementSize,version:l.version});return}const h=t.get(l);if(h===void 0)t.set(l,e(l,c));else if(h.version<l.version){if(h.size!==l.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(h.buffer,l,c),h.version=l.version}}return{get:s,remove:r,update:a}}class js extends Re{constructor(t=1,e=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:s};const r=t/2,a=e/2,l=Math.floor(n),c=Math.floor(s),h=l+1,d=c+1,p=t/l,m=e/c,y=[],M=[],b=[],v=[];for(let f=0;f<d;f++){const D=f*m-a;for(let I=0;I<h;I++){const C=I*p-r;M.push(C,-D,0),b.push(0,0,1),v.push(I/l),v.push(1-f/c)}}for(let f=0;f<c;f++)for(let D=0;D<l;D++){const I=D+h*f,C=D+h*(f+1),z=D+1+h*(f+1),N=D+1+h*f;y.push(I,C,N),y.push(C,z,N)}this.setIndex(y),this.setAttribute("position",new ye(M,3)),this.setAttribute("normal",new ye(b,3)),this.setAttribute("uv",new ye(v,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new js(t.width,t.height,t.widthSegments,t.heightSegments)}}var f_=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,p_=`#ifdef USE_ALPHAHASH
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
#endif`,m_=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,g_=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,__=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,v_=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,y_=`#ifdef USE_AOMAP
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
#endif`,x_=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,M_=`#ifdef USE_BATCHING
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
#endif`,S_=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,E_=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,b_=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,w_=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,T_=`#ifdef USE_IRIDESCENCE
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
#endif`,A_=`#ifdef USE_BUMPMAP
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
#endif`,C_=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,R_=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,P_=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,I_=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,D_=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,L_=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,U_=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,N_=`#if defined( USE_COLOR_ALPHA )
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
#endif`,O_=`#define PI 3.141592653589793
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
} // validated`,F_=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,B_=`vec3 transformedNormal = objectNormal;
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
#endif`,k_=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,z_=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,V_=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,G_=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,H_="gl_FragColor = linearToOutputTexel( gl_FragColor );",W_=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,X_=`#ifdef USE_ENVMAP
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
#endif`,q_=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,j_=`#ifdef USE_ENVMAP
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
#endif`,$_=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Y_=`#ifdef USE_ENVMAP
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
#endif`,K_=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,J_=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Z_=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Q_=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,tv=`#ifdef USE_GRADIENTMAP
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
}`,ev=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,nv=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,iv=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,sv=`uniform bool receiveShadow;
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
#endif`,rv=`#ifdef USE_ENVMAP
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
#endif`,ov=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,av=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,lv=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,cv=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,hv=`PhysicalMaterial material;
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
#endif`,uv=`struct PhysicalMaterial {
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
}`,dv=`
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
#endif`,fv=`#if defined( RE_IndirectDiffuse )
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
#endif`,pv=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,mv=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,gv=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,_v=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,vv=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,yv=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,xv=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Mv=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,Sv=`#if defined( USE_POINTS_UV )
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
#endif`,Ev=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,bv=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,wv=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Tv=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Av=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Cv=`#ifdef USE_MORPHTARGETS
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
#endif`,Rv=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Pv=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,Iv=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,Dv=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Lv=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Uv=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Nv=`#ifdef USE_NORMALMAP
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
#endif`,Ov=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Fv=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Bv=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,kv=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,zv=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Vv=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,Gv=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Hv=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Wv=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Xv=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,qv=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,jv=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,$v=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Yv=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Kv=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,Jv=`float getShadowMask() {
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
}`,Zv=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Qv=`#ifdef USE_SKINNING
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
#endif`,ty=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,ey=`#ifdef USE_SKINNING
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
#endif`,ny=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,iy=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,sy=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,ry=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,oy=`#ifdef USE_TRANSMISSION
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
#endif`,ay=`#ifdef USE_TRANSMISSION
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
#endif`,ly=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,cy=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,hy=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,uy=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const dy=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,fy=`uniform sampler2D t2D;
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
}`,py=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,my=`#ifdef ENVMAP_TYPE_CUBE
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
}`,gy=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,_y=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,vy=`#include <common>
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
}`,yy=`#if DEPTH_PACKING == 3200
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
}`,xy=`#define DISTANCE
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
}`,My=`#define DISTANCE
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
}`,Sy=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Ey=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,by=`uniform float scale;
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
}`,wy=`uniform vec3 diffuse;
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
}`,Ty=`#include <common>
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
}`,Ay=`uniform vec3 diffuse;
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
}`,Cy=`#define LAMBERT
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
}`,Ry=`#define LAMBERT
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
}`,Py=`#define MATCAP
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
}`,Iy=`#define MATCAP
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
}`,Dy=`#define NORMAL
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
}`,Ly=`#define NORMAL
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
}`,Uy=`#define PHONG
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
}`,Ny=`#define PHONG
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
}`,Oy=`#define STANDARD
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
}`,Fy=`#define STANDARD
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
}`,By=`#define TOON
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
}`,ky=`#define TOON
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
}`,zy=`uniform float size;
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
}`,Vy=`uniform vec3 diffuse;
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
}`,Gy=`#include <common>
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
}`,Hy=`uniform vec3 color;
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
}`,Wy=`uniform float rotation;
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
}`,Xy=`uniform vec3 diffuse;
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
}`,Xt={alphahash_fragment:f_,alphahash_pars_fragment:p_,alphamap_fragment:m_,alphamap_pars_fragment:g_,alphatest_fragment:__,alphatest_pars_fragment:v_,aomap_fragment:y_,aomap_pars_fragment:x_,batching_pars_vertex:M_,batching_vertex:S_,begin_vertex:E_,beginnormal_vertex:b_,bsdfs:w_,iridescence_fragment:T_,bumpmap_pars_fragment:A_,clipping_planes_fragment:C_,clipping_planes_pars_fragment:R_,clipping_planes_pars_vertex:P_,clipping_planes_vertex:I_,color_fragment:D_,color_pars_fragment:L_,color_pars_vertex:U_,color_vertex:N_,common:O_,cube_uv_reflection_fragment:F_,defaultnormal_vertex:B_,displacementmap_pars_vertex:k_,displacementmap_vertex:z_,emissivemap_fragment:V_,emissivemap_pars_fragment:G_,colorspace_fragment:H_,colorspace_pars_fragment:W_,envmap_fragment:X_,envmap_common_pars_fragment:q_,envmap_pars_fragment:j_,envmap_pars_vertex:$_,envmap_physical_pars_fragment:rv,envmap_vertex:Y_,fog_vertex:K_,fog_pars_vertex:J_,fog_fragment:Z_,fog_pars_fragment:Q_,gradientmap_pars_fragment:tv,lightmap_pars_fragment:ev,lights_lambert_fragment:nv,lights_lambert_pars_fragment:iv,lights_pars_begin:sv,lights_toon_fragment:ov,lights_toon_pars_fragment:av,lights_phong_fragment:lv,lights_phong_pars_fragment:cv,lights_physical_fragment:hv,lights_physical_pars_fragment:uv,lights_fragment_begin:dv,lights_fragment_maps:fv,lights_fragment_end:pv,logdepthbuf_fragment:mv,logdepthbuf_pars_fragment:gv,logdepthbuf_pars_vertex:_v,logdepthbuf_vertex:vv,map_fragment:yv,map_pars_fragment:xv,map_particle_fragment:Mv,map_particle_pars_fragment:Sv,metalnessmap_fragment:Ev,metalnessmap_pars_fragment:bv,morphinstance_vertex:wv,morphcolor_vertex:Tv,morphnormal_vertex:Av,morphtarget_pars_vertex:Cv,morphtarget_vertex:Rv,normal_fragment_begin:Pv,normal_fragment_maps:Iv,normal_pars_fragment:Dv,normal_pars_vertex:Lv,normal_vertex:Uv,normalmap_pars_fragment:Nv,clearcoat_normal_fragment_begin:Ov,clearcoat_normal_fragment_maps:Fv,clearcoat_pars_fragment:Bv,iridescence_pars_fragment:kv,opaque_fragment:zv,packing:Vv,premultiplied_alpha_fragment:Gv,project_vertex:Hv,dithering_fragment:Wv,dithering_pars_fragment:Xv,roughnessmap_fragment:qv,roughnessmap_pars_fragment:jv,shadowmap_pars_fragment:$v,shadowmap_pars_vertex:Yv,shadowmap_vertex:Kv,shadowmask_pars_fragment:Jv,skinbase_vertex:Zv,skinning_pars_vertex:Qv,skinning_vertex:ty,skinnormal_vertex:ey,specularmap_fragment:ny,specularmap_pars_fragment:iy,tonemapping_fragment:sy,tonemapping_pars_fragment:ry,transmission_fragment:oy,transmission_pars_fragment:ay,uv_pars_fragment:ly,uv_pars_vertex:cy,uv_vertex:hy,worldpos_vertex:uy,background_vert:dy,background_frag:fy,backgroundCube_vert:py,backgroundCube_frag:my,cube_vert:gy,cube_frag:_y,depth_vert:vy,depth_frag:yy,distanceRGBA_vert:xy,distanceRGBA_frag:My,equirect_vert:Sy,equirect_frag:Ey,linedashed_vert:by,linedashed_frag:wy,meshbasic_vert:Ty,meshbasic_frag:Ay,meshlambert_vert:Cy,meshlambert_frag:Ry,meshmatcap_vert:Py,meshmatcap_frag:Iy,meshnormal_vert:Dy,meshnormal_frag:Ly,meshphong_vert:Uy,meshphong_frag:Ny,meshphysical_vert:Oy,meshphysical_frag:Fy,meshtoon_vert:By,meshtoon_frag:ky,points_vert:zy,points_frag:Vy,shadow_vert:Gy,shadow_frag:Hy,sprite_vert:Wy,sprite_frag:Xy},ft={common:{diffuse:{value:new bt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Wt},alphaMap:{value:null},alphaMapTransform:{value:new Wt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Wt}},envmap:{envMap:{value:null},envMapRotation:{value:new Wt},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Wt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Wt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Wt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Wt},normalScale:{value:new Mt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Wt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Wt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Wt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Wt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new bt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new bt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Wt},alphaTest:{value:0},uvTransform:{value:new Wt}},sprite:{diffuse:{value:new bt(16777215)},opacity:{value:1},center:{value:new Mt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Wt},alphaMap:{value:null},alphaMapTransform:{value:new Wt},alphaTest:{value:0}}},On={basic:{uniforms:Je([ft.common,ft.specularmap,ft.envmap,ft.aomap,ft.lightmap,ft.fog]),vertexShader:Xt.meshbasic_vert,fragmentShader:Xt.meshbasic_frag},lambert:{uniforms:Je([ft.common,ft.specularmap,ft.envmap,ft.aomap,ft.lightmap,ft.emissivemap,ft.bumpmap,ft.normalmap,ft.displacementmap,ft.fog,ft.lights,{emissive:{value:new bt(0)}}]),vertexShader:Xt.meshlambert_vert,fragmentShader:Xt.meshlambert_frag},phong:{uniforms:Je([ft.common,ft.specularmap,ft.envmap,ft.aomap,ft.lightmap,ft.emissivemap,ft.bumpmap,ft.normalmap,ft.displacementmap,ft.fog,ft.lights,{emissive:{value:new bt(0)},specular:{value:new bt(1118481)},shininess:{value:30}}]),vertexShader:Xt.meshphong_vert,fragmentShader:Xt.meshphong_frag},standard:{uniforms:Je([ft.common,ft.envmap,ft.aomap,ft.lightmap,ft.emissivemap,ft.bumpmap,ft.normalmap,ft.displacementmap,ft.roughnessmap,ft.metalnessmap,ft.fog,ft.lights,{emissive:{value:new bt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Xt.meshphysical_vert,fragmentShader:Xt.meshphysical_frag},toon:{uniforms:Je([ft.common,ft.aomap,ft.lightmap,ft.emissivemap,ft.bumpmap,ft.normalmap,ft.displacementmap,ft.gradientmap,ft.fog,ft.lights,{emissive:{value:new bt(0)}}]),vertexShader:Xt.meshtoon_vert,fragmentShader:Xt.meshtoon_frag},matcap:{uniforms:Je([ft.common,ft.bumpmap,ft.normalmap,ft.displacementmap,ft.fog,{matcap:{value:null}}]),vertexShader:Xt.meshmatcap_vert,fragmentShader:Xt.meshmatcap_frag},points:{uniforms:Je([ft.points,ft.fog]),vertexShader:Xt.points_vert,fragmentShader:Xt.points_frag},dashed:{uniforms:Je([ft.common,ft.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Xt.linedashed_vert,fragmentShader:Xt.linedashed_frag},depth:{uniforms:Je([ft.common,ft.displacementmap]),vertexShader:Xt.depth_vert,fragmentShader:Xt.depth_frag},normal:{uniforms:Je([ft.common,ft.bumpmap,ft.normalmap,ft.displacementmap,{opacity:{value:1}}]),vertexShader:Xt.meshnormal_vert,fragmentShader:Xt.meshnormal_frag},sprite:{uniforms:Je([ft.sprite,ft.fog]),vertexShader:Xt.sprite_vert,fragmentShader:Xt.sprite_frag},background:{uniforms:{uvTransform:{value:new Wt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Xt.background_vert,fragmentShader:Xt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Wt}},vertexShader:Xt.backgroundCube_vert,fragmentShader:Xt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Xt.cube_vert,fragmentShader:Xt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Xt.equirect_vert,fragmentShader:Xt.equirect_frag},distanceRGBA:{uniforms:Je([ft.common,ft.displacementmap,{referencePosition:{value:new O},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Xt.distanceRGBA_vert,fragmentShader:Xt.distanceRGBA_frag},shadow:{uniforms:Je([ft.lights,ft.fog,{color:{value:new bt(0)},opacity:{value:1}}]),vertexShader:Xt.shadow_vert,fragmentShader:Xt.shadow_frag}};On.physical={uniforms:Je([On.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Wt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Wt},clearcoatNormalScale:{value:new Mt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Wt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Wt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Wt},sheen:{value:0},sheenColor:{value:new bt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Wt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Wt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Wt},transmissionSamplerSize:{value:new Mt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Wt},attenuationDistance:{value:0},attenuationColor:{value:new bt(0)},specularColor:{value:new bt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Wt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Wt},anisotropyVector:{value:new Mt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Wt}}]),vertexShader:Xt.meshphysical_vert,fragmentShader:Xt.meshphysical_frag};const mo={r:0,b:0,g:0},Li=new In,qy=new le;function jy(i,t,e,n,s,r,a){const l=new bt(0);let c=r===!0?0:1,h,d,p=null,m=0,y=null;function M(D){let I=D.isScene===!0?D.background:null;return I&&I.isTexture&&(I=(D.backgroundBlurriness>0?e:t).get(I)),I}function b(D){let I=!1;const C=M(D);C===null?f(l,c):C&&C.isColor&&(f(C,1),I=!0);const z=i.xr.getEnvironmentBlendMode();z==="additive"?n.buffers.color.setClear(0,0,0,1,a):z==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,a),(i.autoClear||I)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function v(D,I){const C=M(I);C&&(C.isCubeTexture||C.mapping===ta)?(d===void 0&&(d=new Ft(new _n(1,1,1),new we({name:"BackgroundCubeMaterial",uniforms:Gs(On.backgroundCube.uniforms),vertexShader:On.backgroundCube.vertexShader,fragmentShader:On.backgroundCube.fragmentShader,side:Qe,depthTest:!1,depthWrite:!1,fog:!1})),d.geometry.deleteAttribute("normal"),d.geometry.deleteAttribute("uv"),d.onBeforeRender=function(z,N,E){this.matrixWorld.copyPosition(E.matrixWorld)},Object.defineProperty(d.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(d)),Li.copy(I.backgroundRotation),Li.x*=-1,Li.y*=-1,Li.z*=-1,C.isCubeTexture&&C.isRenderTargetTexture===!1&&(Li.y*=-1,Li.z*=-1),d.material.uniforms.envMap.value=C,d.material.uniforms.flipEnvMap.value=C.isCubeTexture&&C.isRenderTargetTexture===!1?-1:1,d.material.uniforms.backgroundBlurriness.value=I.backgroundBlurriness,d.material.uniforms.backgroundIntensity.value=I.backgroundIntensity,d.material.uniforms.backgroundRotation.value.setFromMatrix4(qy.makeRotationFromEuler(Li)),d.material.toneMapped=ee.getTransfer(C.colorSpace)!==he,(p!==C||m!==C.version||y!==i.toneMapping)&&(d.material.needsUpdate=!0,p=C,m=C.version,y=i.toneMapping),d.layers.enableAll(),D.unshift(d,d.geometry,d.material,0,0,null)):C&&C.isTexture&&(h===void 0&&(h=new Ft(new js(2,2),new we({name:"BackgroundMaterial",uniforms:Gs(On.background.uniforms),vertexShader:On.background.vertexShader,fragmentShader:On.background.fragmentShader,side:bi,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),Object.defineProperty(h.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(h)),h.material.uniforms.t2D.value=C,h.material.uniforms.backgroundIntensity.value=I.backgroundIntensity,h.material.toneMapped=ee.getTransfer(C.colorSpace)!==he,C.matrixAutoUpdate===!0&&C.updateMatrix(),h.material.uniforms.uvTransform.value.copy(C.matrix),(p!==C||m!==C.version||y!==i.toneMapping)&&(h.material.needsUpdate=!0,p=C,m=C.version,y=i.toneMapping),h.layers.enableAll(),D.unshift(h,h.geometry,h.material,0,0,null))}function f(D,I){D.getRGB(mo,Mf(i)),n.buffers.color.setClear(mo.r,mo.g,mo.b,I,a)}return{getClearColor:function(){return l},setClearColor:function(D,I=1){l.set(D),c=I,f(l,c)},getClearAlpha:function(){return c},setClearAlpha:function(D){c=D,f(l,c)},render:b,addToRenderList:v}}function $y(i,t){const e=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=m(null);let r=s,a=!1;function l(_,w,L,T,K){let Q=!1;const J=p(T,L,w);r!==J&&(r=J,h(r.object)),Q=y(_,T,L,K),Q&&M(_,T,L,K),K!==null&&t.update(K,i.ELEMENT_ARRAY_BUFFER),(Q||a)&&(a=!1,C(_,w,L,T),K!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,t.get(K).buffer))}function c(){return i.createVertexArray()}function h(_){return i.bindVertexArray(_)}function d(_){return i.deleteVertexArray(_)}function p(_,w,L){const T=L.wireframe===!0;let K=n[_.id];K===void 0&&(K={},n[_.id]=K);let Q=K[w.id];Q===void 0&&(Q={},K[w.id]=Q);let J=Q[T];return J===void 0&&(J=m(c()),Q[T]=J),J}function m(_){const w=[],L=[],T=[];for(let K=0;K<e;K++)w[K]=0,L[K]=0,T[K]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:w,enabledAttributes:L,attributeDivisors:T,object:_,attributes:{},index:null}}function y(_,w,L,T){const K=r.attributes,Q=w.attributes;let J=0;const nt=L.getAttributes();for(const $ in nt)if(nt[$].location>=0){const vt=K[$];let Rt=Q[$];if(Rt===void 0&&($==="instanceMatrix"&&_.instanceMatrix&&(Rt=_.instanceMatrix),$==="instanceColor"&&_.instanceColor&&(Rt=_.instanceColor)),vt===void 0||vt.attribute!==Rt||Rt&&vt.data!==Rt.data)return!0;J++}return r.attributesNum!==J||r.index!==T}function M(_,w,L,T){const K={},Q=w.attributes;let J=0;const nt=L.getAttributes();for(const $ in nt)if(nt[$].location>=0){let vt=Q[$];vt===void 0&&($==="instanceMatrix"&&_.instanceMatrix&&(vt=_.instanceMatrix),$==="instanceColor"&&_.instanceColor&&(vt=_.instanceColor));const Rt={};Rt.attribute=vt,vt&&vt.data&&(Rt.data=vt.data),K[$]=Rt,J++}r.attributes=K,r.attributesNum=J,r.index=T}function b(){const _=r.newAttributes;for(let w=0,L=_.length;w<L;w++)_[w]=0}function v(_){f(_,0)}function f(_,w){const L=r.newAttributes,T=r.enabledAttributes,K=r.attributeDivisors;L[_]=1,T[_]===0&&(i.enableVertexAttribArray(_),T[_]=1),K[_]!==w&&(i.vertexAttribDivisor(_,w),K[_]=w)}function D(){const _=r.newAttributes,w=r.enabledAttributes;for(let L=0,T=w.length;L<T;L++)w[L]!==_[L]&&(i.disableVertexAttribArray(L),w[L]=0)}function I(_,w,L,T,K,Q,J){J===!0?i.vertexAttribIPointer(_,w,L,K,Q):i.vertexAttribPointer(_,w,L,T,K,Q)}function C(_,w,L,T){b();const K=T.attributes,Q=L.getAttributes(),J=w.defaultAttributeValues;for(const nt in Q){const $=Q[nt];if($.location>=0){let ut=K[nt];if(ut===void 0&&(nt==="instanceMatrix"&&_.instanceMatrix&&(ut=_.instanceMatrix),nt==="instanceColor"&&_.instanceColor&&(ut=_.instanceColor)),ut!==void 0){const vt=ut.normalized,Rt=ut.itemSize,Bt=t.get(ut);if(Bt===void 0)continue;const kt=Bt.buffer,Z=Bt.type,st=Bt.bytesPerElement,At=Z===i.INT||Z===i.UNSIGNED_INT||ut.gpuType===hc;if(ut.isInterleavedBufferAttribute){const ct=ut.data,Ut=ct.stride,zt=ut.offset;if(ct.isInstancedInterleavedBuffer){for(let Gt=0;Gt<$.locationSize;Gt++)f($.location+Gt,ct.meshPerAttribute);_.isInstancedMesh!==!0&&T._maxInstanceCount===void 0&&(T._maxInstanceCount=ct.meshPerAttribute*ct.count)}else for(let Gt=0;Gt<$.locationSize;Gt++)v($.location+Gt);i.bindBuffer(i.ARRAY_BUFFER,kt);for(let Gt=0;Gt<$.locationSize;Gt++)I($.location+Gt,Rt/$.locationSize,Z,vt,Ut*st,(zt+Rt/$.locationSize*Gt)*st,At)}else{if(ut.isInstancedBufferAttribute){for(let ct=0;ct<$.locationSize;ct++)f($.location+ct,ut.meshPerAttribute);_.isInstancedMesh!==!0&&T._maxInstanceCount===void 0&&(T._maxInstanceCount=ut.meshPerAttribute*ut.count)}else for(let ct=0;ct<$.locationSize;ct++)v($.location+ct);i.bindBuffer(i.ARRAY_BUFFER,kt);for(let ct=0;ct<$.locationSize;ct++)I($.location+ct,Rt/$.locationSize,Z,vt,Rt*st,Rt/$.locationSize*ct*st,At)}}else if(J!==void 0){const vt=J[nt];if(vt!==void 0)switch(vt.length){case 2:i.vertexAttrib2fv($.location,vt);break;case 3:i.vertexAttrib3fv($.location,vt);break;case 4:i.vertexAttrib4fv($.location,vt);break;default:i.vertexAttrib1fv($.location,vt)}}}}D()}function z(){S();for(const _ in n){const w=n[_];for(const L in w){const T=w[L];for(const K in T)d(T[K].object),delete T[K];delete w[L]}delete n[_]}}function N(_){if(n[_.id]===void 0)return;const w=n[_.id];for(const L in w){const T=w[L];for(const K in T)d(T[K].object),delete T[K];delete w[L]}delete n[_.id]}function E(_){for(const w in n){const L=n[w];if(L[_.id]===void 0)continue;const T=L[_.id];for(const K in T)d(T[K].object),delete T[K];delete L[_.id]}}function S(){g(),a=!0,r!==s&&(r=s,h(r.object))}function g(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:l,reset:S,resetDefaultState:g,dispose:z,releaseStatesOfGeometry:N,releaseStatesOfProgram:E,initAttributes:b,enableAttribute:v,disableUnusedAttributes:D}}function Yy(i,t,e){let n;function s(h){n=h}function r(h,d){i.drawArrays(n,h,d),e.update(d,n,1)}function a(h,d,p){p!==0&&(i.drawArraysInstanced(n,h,d,p),e.update(d,n,p))}function l(h,d,p){if(p===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,h,0,d,0,p);let y=0;for(let M=0;M<p;M++)y+=d[M];e.update(y,n,1)}function c(h,d,p,m){if(p===0)return;const y=t.get("WEBGL_multi_draw");if(y===null)for(let M=0;M<h.length;M++)a(h[M],d[M],m[M]);else{y.multiDrawArraysInstancedWEBGL(n,h,0,d,0,m,0,p);let M=0;for(let b=0;b<p;b++)M+=d[b]*m[b];e.update(M,n,1)}}this.setMode=s,this.render=r,this.renderInstances=a,this.renderMultiDraw=l,this.renderMultiDrawInstances=c}function Ky(i,t,e,n){let s;function r(){if(s!==void 0)return s;if(t.has("EXT_texture_filter_anisotropic")===!0){const E=t.get("EXT_texture_filter_anisotropic");s=i.getParameter(E.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(E){return!(E!==An&&n.convert(E)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function l(E){const S=E===ei&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(E!==ri&&n.convert(E)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&E!==kn&&!S)}function c(E){if(E==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";E="mediump"}return E==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let h=e.precision!==void 0?e.precision:"highp";const d=c(h);d!==h&&(console.warn("THREE.WebGLRenderer:",h,"not supported, using",d,"instead."),h=d);const p=e.logarithmicDepthBuffer===!0,m=e.reverseDepthBuffer===!0&&t.has("EXT_clip_control"),y=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),M=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),b=i.getParameter(i.MAX_TEXTURE_SIZE),v=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),f=i.getParameter(i.MAX_VERTEX_ATTRIBS),D=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),I=i.getParameter(i.MAX_VARYING_VECTORS),C=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),z=M>0,N=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:c,textureFormatReadable:a,textureTypeReadable:l,precision:h,logarithmicDepthBuffer:p,reverseDepthBuffer:m,maxTextures:y,maxVertexTextures:M,maxTextureSize:b,maxCubemapSize:v,maxAttributes:f,maxVertexUniforms:D,maxVaryings:I,maxFragmentUniforms:C,vertexTextures:z,maxSamples:N}}function Jy(i){const t=this;let e=null,n=0,s=!1,r=!1;const a=new Oi,l=new Wt,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(p,m){const y=p.length!==0||m||n!==0||s;return s=m,n=p.length,y},this.beginShadows=function(){r=!0,d(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(p,m){e=d(p,m,0)},this.setState=function(p,m,y){const M=p.clippingPlanes,b=p.clipIntersection,v=p.clipShadows,f=i.get(p);if(!s||M===null||M.length===0||r&&!v)r?d(null):h();else{const D=r?0:n,I=D*4;let C=f.clippingState||null;c.value=C,C=d(M,m,I,y);for(let z=0;z!==I;++z)C[z]=e[z];f.clippingState=C,this.numIntersection=b?this.numPlanes:0,this.numPlanes+=D}};function h(){c.value!==e&&(c.value=e,c.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function d(p,m,y,M){const b=p!==null?p.length:0;let v=null;if(b!==0){if(v=c.value,M!==!0||v===null){const f=y+b*4,D=m.matrixWorldInverse;l.getNormalMatrix(D),(v===null||v.length<f)&&(v=new Float32Array(f));for(let I=0,C=y;I!==b;++I,C+=4)a.copy(p[I]).applyMatrix4(D,l),a.normal.toArray(v,C),v[C+3]=a.constant}c.value=v,c.needsUpdate=!0}return t.numPlanes=b,t.numIntersection=0,v}}function Zy(i){let t=new WeakMap;function e(a,l){return l===_l?a.mapping=Bs:l===vl&&(a.mapping=ks),a}function n(a){if(a&&a.isTexture){const l=a.mapping;if(l===_l||l===vl)if(t.has(a)){const c=t.get(a).texture;return e(c,a.mapping)}else{const c=a.image;if(c&&c.height>0){const h=new c_(c.height);return h.fromEquirectangularTexture(i,a),t.set(a,h),a.addEventListener("dispose",s),e(h.texture,a.mapping)}else return null}}return a}function s(a){const l=a.target;l.removeEventListener("dispose",s);const c=t.get(l);c!==void 0&&(t.delete(l),c.dispose())}function r(){t=new WeakMap}return{get:n,dispose:r}}class Mc extends Sf{constructor(t=-1,e=1,n=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=n-t,a=n+t,l=s+e,c=s-e;if(this.view!==null&&this.view.enabled){const h=(this.right-this.left)/this.view.fullWidth/this.zoom,d=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=h*this.view.offsetX,a=r+h*this.view.width,l-=d*this.view.offsetY,c=l-d*this.view.height}this.projectionMatrix.makeOrthographic(r,a,l,c,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}const Cs=4,mu=[.125,.215,.35,.446,.526,.582],Vi=20,Ha=new Mc,gu=new bt;let Wa=null,Xa=0,qa=0,ja=!1;const Fi=(1+Math.sqrt(5))/2,ys=1/Fi,_u=[new O(-Fi,ys,0),new O(Fi,ys,0),new O(-ys,0,Fi),new O(ys,0,Fi),new O(0,Fi,-ys),new O(0,Fi,ys),new O(-1,1,-1),new O(1,1,-1),new O(-1,1,1),new O(1,1,1)];class vu{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,s=100){Wa=this._renderer.getRenderTarget(),Xa=this._renderer.getActiveCubeFace(),qa=this._renderer.getActiveMipmapLevel(),ja=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const r=this._allocateTargets();return r.depthBuffer=!0,this._sceneToCubeUV(t,n,s,r),e>0&&this._blur(r,0,0,e),this._applyPMREM(r),this._cleanup(r),r}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Mu(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=xu(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(Wa,Xa,qa),this._renderer.xr.enabled=ja,t.scissorTest=!1,go(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===Bs||t.mapping===ks?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),Wa=this._renderer.getRenderTarget(),Xa=this._renderer.getActiveCubeFace(),qa=this._renderer.getActiveMipmapLevel(),ja=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:gn,minFilter:gn,generateMipmaps:!1,type:ei,format:An,colorSpace:Ws,depthBuffer:!1},s=yu(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=yu(t,e,n);const{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Qy(r)),this._blurMaterial=tx(r,t,e)}return s}_compileMaterial(t){const e=new Ft(this._lodPlanes[0],t);this._renderer.compile(e,Ha)}_sceneToCubeUV(t,e,n,s){const l=new cn(90,1,e,n),c=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],d=this._renderer,p=d.autoClear,m=d.toneMapping;d.getClearColor(gu),d.toneMapping=Ei,d.autoClear=!1;const y=new ia({name:"PMREM.Background",side:Qe,depthWrite:!1,depthTest:!1}),M=new Ft(new _n,y);let b=!1;const v=t.background;v?v.isColor&&(y.color.copy(v),t.background=null,b=!0):(y.color.copy(gu),b=!0);for(let f=0;f<6;f++){const D=f%3;D===0?(l.up.set(0,c[f],0),l.lookAt(h[f],0,0)):D===1?(l.up.set(0,0,c[f]),l.lookAt(0,h[f],0)):(l.up.set(0,c[f],0),l.lookAt(0,0,h[f]));const I=this._cubeSize;go(s,D*I,f>2?I:0,I,I),d.setRenderTarget(s),b&&d.render(M,l),d.render(t,l)}M.geometry.dispose(),M.material.dispose(),d.toneMapping=m,d.autoClear=p,t.background=v}_textureToCubeUV(t,e){const n=this._renderer,s=t.mapping===Bs||t.mapping===ks;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Mu()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=xu());const r=s?this._cubemapMaterial:this._equirectMaterial,a=new Ft(this._lodPlanes[0],r),l=r.uniforms;l.envMap.value=t;const c=this._cubeSize;go(e,0,0,3*c,2*c),n.setRenderTarget(e),n.render(a,Ha)}_applyPMREM(t){const e=this._renderer,n=e.autoClear;e.autoClear=!1;const s=this._lodPlanes.length;for(let r=1;r<s;r++){const a=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),l=_u[(s-r-1)%_u.length];this._blur(t,r-1,r,a,l)}e.autoClear=n}_blur(t,e,n,s,r){const a=this._pingPongRenderTarget;this._halfBlur(t,a,e,n,s,"latitudinal",r),this._halfBlur(a,t,n,n,s,"longitudinal",r)}_halfBlur(t,e,n,s,r,a,l){const c=this._renderer,h=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const d=3,p=new Ft(this._lodPlanes[s],h),m=h.uniforms,y=this._sizeLods[n]-1,M=isFinite(r)?Math.PI/(2*y):2*Math.PI/(2*Vi-1),b=r/M,v=isFinite(r)?1+Math.floor(d*b):Vi;v>Vi&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${v} samples when the maximum is set to ${Vi}`);const f=[];let D=0;for(let E=0;E<Vi;++E){const S=E/b,g=Math.exp(-S*S/2);f.push(g),E===0?D+=g:E<v&&(D+=2*g)}for(let E=0;E<f.length;E++)f[E]=f[E]/D;m.envMap.value=t.texture,m.samples.value=v,m.weights.value=f,m.latitudinal.value=a==="latitudinal",l&&(m.poleAxis.value=l);const{_lodMax:I}=this;m.dTheta.value=M,m.mipInt.value=I-n;const C=this._sizeLods[s],z=3*C*(s>I-Cs?s-I+Cs:0),N=4*(this._cubeSize-C);go(e,z,N,3*C,2*C),c.setRenderTarget(e),c.render(p,Ha)}}function Qy(i){const t=[],e=[],n=[];let s=i;const r=i-Cs+1+mu.length;for(let a=0;a<r;a++){const l=Math.pow(2,s);e.push(l);let c=1/l;a>i-Cs?c=mu[a-i+Cs-1]:a===0&&(c=0),n.push(c);const h=1/(l-2),d=-h,p=1+h,m=[d,d,p,d,p,p,d,d,p,p,d,p],y=6,M=6,b=3,v=2,f=1,D=new Float32Array(b*M*y),I=new Float32Array(v*M*y),C=new Float32Array(f*M*y);for(let N=0;N<y;N++){const E=N%3*2/3-1,S=N>2?0:-1,g=[E,S,0,E+2/3,S,0,E+2/3,S+1,0,E,S,0,E+2/3,S+1,0,E,S+1,0];D.set(g,b*M*N),I.set(m,v*M*N);const _=[N,N,N,N,N,N];C.set(_,f*M*N)}const z=new Re;z.setAttribute("position",new Ce(D,b)),z.setAttribute("uv",new Ce(I,v)),z.setAttribute("faceIndex",new Ce(C,f)),t.push(z),s>Cs&&s--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function yu(i,t,e){const n=new Rn(i,t,e);return n.texture.mapping=ta,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function go(i,t,e,n,s){i.viewport.set(t,e,n,s),i.scissor.set(t,e,n,s)}function tx(i,t,e){const n=new Float32Array(Vi),s=new O(0,1,0);return new we({name:"SphericalGaussianBlur",defines:{n:Vi,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:Sc(),fragmentShader:`

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
		`,blending:ti,depthTest:!1,depthWrite:!1})}function xu(){return new we({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Sc(),fragmentShader:`

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
		`,blending:ti,depthTest:!1,depthWrite:!1})}function Mu(){return new we({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Sc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:ti,depthTest:!1,depthWrite:!1})}function Sc(){return`

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
	`}function ex(i){let t=new WeakMap,e=null;function n(l){if(l&&l.isTexture){const c=l.mapping,h=c===_l||c===vl,d=c===Bs||c===ks;if(h||d){let p=t.get(l);const m=p!==void 0?p.texture.pmremVersion:0;if(l.isRenderTargetTexture&&l.pmremVersion!==m)return e===null&&(e=new vu(i)),p=h?e.fromEquirectangular(l,p):e.fromCubemap(l,p),p.texture.pmremVersion=l.pmremVersion,t.set(l,p),p.texture;if(p!==void 0)return p.texture;{const y=l.image;return h&&y&&y.height>0||d&&y&&s(y)?(e===null&&(e=new vu(i)),p=h?e.fromEquirectangular(l):e.fromCubemap(l),p.texture.pmremVersion=l.pmremVersion,t.set(l,p),l.addEventListener("dispose",r),p.texture):null}}}return l}function s(l){let c=0;const h=6;for(let d=0;d<h;d++)l[d]!==void 0&&c++;return c===h}function r(l){const c=l.target;c.removeEventListener("dispose",r);const h=t.get(c);h!==void 0&&(t.delete(c),h.dispose())}function a(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:a}}function nx(i){const t={};function e(n){if(t[n]!==void 0)return t[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return t[n]=s,s}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){const s=e(n);return s===null&&gr("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function ix(i,t,e,n){const s={},r=new WeakMap;function a(p){const m=p.target;m.index!==null&&t.remove(m.index);for(const M in m.attributes)t.remove(m.attributes[M]);for(const M in m.morphAttributes){const b=m.morphAttributes[M];for(let v=0,f=b.length;v<f;v++)t.remove(b[v])}m.removeEventListener("dispose",a),delete s[m.id];const y=r.get(m);y&&(t.remove(y),r.delete(m)),n.releaseStatesOfGeometry(m),m.isInstancedBufferGeometry===!0&&delete m._maxInstanceCount,e.memory.geometries--}function l(p,m){return s[m.id]===!0||(m.addEventListener("dispose",a),s[m.id]=!0,e.memory.geometries++),m}function c(p){const m=p.attributes;for(const M in m)t.update(m[M],i.ARRAY_BUFFER);const y=p.morphAttributes;for(const M in y){const b=y[M];for(let v=0,f=b.length;v<f;v++)t.update(b[v],i.ARRAY_BUFFER)}}function h(p){const m=[],y=p.index,M=p.attributes.position;let b=0;if(y!==null){const D=y.array;b=y.version;for(let I=0,C=D.length;I<C;I+=3){const z=D[I+0],N=D[I+1],E=D[I+2];m.push(z,N,N,E,E,z)}}else if(M!==void 0){const D=M.array;b=M.version;for(let I=0,C=D.length/3-1;I<C;I+=3){const z=I+0,N=I+1,E=I+2;m.push(z,N,N,E,E,z)}}else return;const v=new(mf(m)?xf:yf)(m,1);v.version=b;const f=r.get(p);f&&t.remove(f),r.set(p,v)}function d(p){const m=r.get(p);if(m){const y=p.index;y!==null&&m.version<y.version&&h(p)}else h(p);return r.get(p)}return{get:l,update:c,getWireframeAttribute:d}}function sx(i,t,e){let n;function s(m){n=m}let r,a;function l(m){r=m.type,a=m.bytesPerElement}function c(m,y){i.drawElements(n,y,r,m*a),e.update(y,n,1)}function h(m,y,M){M!==0&&(i.drawElementsInstanced(n,y,r,m*a,M),e.update(y,n,M))}function d(m,y,M){if(M===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,y,0,r,m,0,M);let v=0;for(let f=0;f<M;f++)v+=y[f];e.update(v,n,1)}function p(m,y,M,b){if(M===0)return;const v=t.get("WEBGL_multi_draw");if(v===null)for(let f=0;f<m.length;f++)h(m[f]/a,y[f],b[f]);else{v.multiDrawElementsInstancedWEBGL(n,y,0,r,m,0,b,0,M);let f=0;for(let D=0;D<M;D++)f+=y[D]*b[D];e.update(f,n,1)}}this.setMode=s,this.setIndex=l,this.render=c,this.renderInstances=h,this.renderMultiDraw=d,this.renderMultiDrawInstances=p}function rx(i){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,l){switch(e.calls++,a){case i.TRIANGLES:e.triangles+=l*(r/3);break;case i.LINES:e.lines+=l*(r/2);break;case i.LINE_STRIP:e.lines+=l*(r-1);break;case i.LINE_LOOP:e.lines+=l*r;break;case i.POINTS:e.points+=l*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:n}}function ox(i,t,e){const n=new WeakMap,s=new ve;function r(a,l,c){const h=a.morphTargetInfluences,d=l.morphAttributes.position||l.morphAttributes.normal||l.morphAttributes.color,p=d!==void 0?d.length:0;let m=n.get(l);if(m===void 0||m.count!==p){let _=function(){S.dispose(),n.delete(l),l.removeEventListener("dispose",_)};var y=_;m!==void 0&&m.texture.dispose();const M=l.morphAttributes.position!==void 0,b=l.morphAttributes.normal!==void 0,v=l.morphAttributes.color!==void 0,f=l.morphAttributes.position||[],D=l.morphAttributes.normal||[],I=l.morphAttributes.color||[];let C=0;M===!0&&(C=1),b===!0&&(C=2),v===!0&&(C=3);let z=l.attributes.position.count*C,N=1;z>t.maxTextureSize&&(N=Math.ceil(z/t.maxTextureSize),z=t.maxTextureSize);const E=new Float32Array(z*N*4*p),S=new _f(E,z,N,p);S.type=kn,S.needsUpdate=!0;const g=C*4;for(let w=0;w<p;w++){const L=f[w],T=D[w],K=I[w],Q=z*N*4*w;for(let J=0;J<L.count;J++){const nt=J*g;M===!0&&(s.fromBufferAttribute(L,J),E[Q+nt+0]=s.x,E[Q+nt+1]=s.y,E[Q+nt+2]=s.z,E[Q+nt+3]=0),b===!0&&(s.fromBufferAttribute(T,J),E[Q+nt+4]=s.x,E[Q+nt+5]=s.y,E[Q+nt+6]=s.z,E[Q+nt+7]=0),v===!0&&(s.fromBufferAttribute(K,J),E[Q+nt+8]=s.x,E[Q+nt+9]=s.y,E[Q+nt+10]=s.z,E[Q+nt+11]=K.itemSize===4?s.w:1)}}m={count:p,texture:S,size:new Mt(z,N)},n.set(l,m),l.addEventListener("dispose",_)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)c.getUniforms().setValue(i,"morphTexture",a.morphTexture,e);else{let M=0;for(let v=0;v<h.length;v++)M+=h[v];const b=l.morphTargetsRelative?1:1-M;c.getUniforms().setValue(i,"morphTargetBaseInfluence",b),c.getUniforms().setValue(i,"morphTargetInfluences",h)}c.getUniforms().setValue(i,"morphTargetsTexture",m.texture,e),c.getUniforms().setValue(i,"morphTargetsTextureSize",m.size)}return{update:r}}function ax(i,t,e,n){let s=new WeakMap;function r(c){const h=n.render.frame,d=c.geometry,p=t.get(c,d);if(s.get(p)!==h&&(t.update(p),s.set(p,h)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),s.get(c)!==h&&(e.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,i.ARRAY_BUFFER),s.set(c,h))),c.isSkinnedMesh){const m=c.skeleton;s.get(m)!==h&&(m.update(),s.set(m,h))}return p}function a(){s=new WeakMap}function l(c){const h=c.target;h.removeEventListener("dispose",l),e.remove(h.instanceMatrix),h.instanceColor!==null&&e.remove(h.instanceColor)}return{update:r,dispose:a}}class bf extends $e{constructor(t,e,n,s,r,a,l,c,h,d=Ls){if(d!==Ls&&d!==Vs)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&d===Ls&&(n=Ki),n===void 0&&d===Vs&&(n=zs),super(null,s,r,a,l,c,d,n,h),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=l!==void 0?l:hn,this.minFilter=c!==void 0?c:hn,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}const wf=new $e,Su=new bf(1,1),Tf=new _f,Af=new $0,Cf=new yc,Eu=[],bu=[],wu=new Float32Array(16),Tu=new Float32Array(9),Au=new Float32Array(4);function $s(i,t,e){const n=i[0];if(n<=0||n>0)return i;const s=t*e;let r=Eu[s];if(r===void 0&&(r=new Float32Array(s),Eu[s]=r),t!==0){n.toArray(r,0);for(let a=1,l=0;a!==t;++a)l+=e,i[a].toArray(r,l)}return r}function Ue(i,t){if(i.length!==t.length)return!1;for(let e=0,n=i.length;e<n;e++)if(i[e]!==t[e])return!1;return!0}function Ne(i,t){for(let e=0,n=t.length;e<n;e++)i[e]=t[e]}function sa(i,t){let e=bu[t];e===void 0&&(e=new Int32Array(t),bu[t]=e);for(let n=0;n!==t;++n)e[n]=i.allocateTextureUnit();return e}function lx(i,t){const e=this.cache;e[0]!==t&&(i.uniform1f(this.addr,t),e[0]=t)}function cx(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ue(e,t))return;i.uniform2fv(this.addr,t),Ne(e,t)}}function hx(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(i.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(Ue(e,t))return;i.uniform3fv(this.addr,t),Ne(e,t)}}function ux(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ue(e,t))return;i.uniform4fv(this.addr,t),Ne(e,t)}}function dx(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Ue(e,t))return;i.uniformMatrix2fv(this.addr,!1,t),Ne(e,t)}else{if(Ue(e,n))return;Au.set(n),i.uniformMatrix2fv(this.addr,!1,Au),Ne(e,n)}}function fx(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Ue(e,t))return;i.uniformMatrix3fv(this.addr,!1,t),Ne(e,t)}else{if(Ue(e,n))return;Tu.set(n),i.uniformMatrix3fv(this.addr,!1,Tu),Ne(e,n)}}function px(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Ue(e,t))return;i.uniformMatrix4fv(this.addr,!1,t),Ne(e,t)}else{if(Ue(e,n))return;wu.set(n),i.uniformMatrix4fv(this.addr,!1,wu),Ne(e,n)}}function mx(i,t){const e=this.cache;e[0]!==t&&(i.uniform1i(this.addr,t),e[0]=t)}function gx(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ue(e,t))return;i.uniform2iv(this.addr,t),Ne(e,t)}}function _x(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Ue(e,t))return;i.uniform3iv(this.addr,t),Ne(e,t)}}function vx(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ue(e,t))return;i.uniform4iv(this.addr,t),Ne(e,t)}}function yx(i,t){const e=this.cache;e[0]!==t&&(i.uniform1ui(this.addr,t),e[0]=t)}function xx(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ue(e,t))return;i.uniform2uiv(this.addr,t),Ne(e,t)}}function Mx(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Ue(e,t))return;i.uniform3uiv(this.addr,t),Ne(e,t)}}function Sx(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ue(e,t))return;i.uniform4uiv(this.addr,t),Ne(e,t)}}function Ex(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(Su.compareFunction=pf,r=Su):r=wf,e.setTexture2D(t||r,s)}function bx(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture3D(t||Af,s)}function wx(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTextureCube(t||Cf,s)}function Tx(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture2DArray(t||Tf,s)}function Ax(i){switch(i){case 5126:return lx;case 35664:return cx;case 35665:return hx;case 35666:return ux;case 35674:return dx;case 35675:return fx;case 35676:return px;case 5124:case 35670:return mx;case 35667:case 35671:return gx;case 35668:case 35672:return _x;case 35669:case 35673:return vx;case 5125:return yx;case 36294:return xx;case 36295:return Mx;case 36296:return Sx;case 35678:case 36198:case 36298:case 36306:case 35682:return Ex;case 35679:case 36299:case 36307:return bx;case 35680:case 36300:case 36308:case 36293:return wx;case 36289:case 36303:case 36311:case 36292:return Tx}}function Cx(i,t){i.uniform1fv(this.addr,t)}function Rx(i,t){const e=$s(t,this.size,2);i.uniform2fv(this.addr,e)}function Px(i,t){const e=$s(t,this.size,3);i.uniform3fv(this.addr,e)}function Ix(i,t){const e=$s(t,this.size,4);i.uniform4fv(this.addr,e)}function Dx(i,t){const e=$s(t,this.size,4);i.uniformMatrix2fv(this.addr,!1,e)}function Lx(i,t){const e=$s(t,this.size,9);i.uniformMatrix3fv(this.addr,!1,e)}function Ux(i,t){const e=$s(t,this.size,16);i.uniformMatrix4fv(this.addr,!1,e)}function Nx(i,t){i.uniform1iv(this.addr,t)}function Ox(i,t){i.uniform2iv(this.addr,t)}function Fx(i,t){i.uniform3iv(this.addr,t)}function Bx(i,t){i.uniform4iv(this.addr,t)}function kx(i,t){i.uniform1uiv(this.addr,t)}function zx(i,t){i.uniform2uiv(this.addr,t)}function Vx(i,t){i.uniform3uiv(this.addr,t)}function Gx(i,t){i.uniform4uiv(this.addr,t)}function Hx(i,t,e){const n=this.cache,s=t.length,r=sa(e,s);Ue(n,r)||(i.uniform1iv(this.addr,r),Ne(n,r));for(let a=0;a!==s;++a)e.setTexture2D(t[a]||wf,r[a])}function Wx(i,t,e){const n=this.cache,s=t.length,r=sa(e,s);Ue(n,r)||(i.uniform1iv(this.addr,r),Ne(n,r));for(let a=0;a!==s;++a)e.setTexture3D(t[a]||Af,r[a])}function Xx(i,t,e){const n=this.cache,s=t.length,r=sa(e,s);Ue(n,r)||(i.uniform1iv(this.addr,r),Ne(n,r));for(let a=0;a!==s;++a)e.setTextureCube(t[a]||Cf,r[a])}function qx(i,t,e){const n=this.cache,s=t.length,r=sa(e,s);Ue(n,r)||(i.uniform1iv(this.addr,r),Ne(n,r));for(let a=0;a!==s;++a)e.setTexture2DArray(t[a]||Tf,r[a])}function jx(i){switch(i){case 5126:return Cx;case 35664:return Rx;case 35665:return Px;case 35666:return Ix;case 35674:return Dx;case 35675:return Lx;case 35676:return Ux;case 5124:case 35670:return Nx;case 35667:case 35671:return Ox;case 35668:case 35672:return Fx;case 35669:case 35673:return Bx;case 5125:return kx;case 36294:return zx;case 36295:return Vx;case 36296:return Gx;case 35678:case 36198:case 36298:case 36306:case 35682:return Hx;case 35679:case 36299:case 36307:return Wx;case 35680:case 36300:case 36308:case 36293:return Xx;case 36289:case 36303:case 36311:case 36292:return qx}}class $x{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=Ax(e.type)}}class Yx{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=jx(e.type)}}class Kx{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){const s=this.seq;for(let r=0,a=s.length;r!==a;++r){const l=s[r];l.setValue(t,e[l.id],n)}}}const $a=/(\w+)(\])?(\[|\.)?/g;function Cu(i,t){i.seq.push(t),i.map[t.id]=t}function Jx(i,t,e){const n=i.name,s=n.length;for($a.lastIndex=0;;){const r=$a.exec(n),a=$a.lastIndex;let l=r[1];const c=r[2]==="]",h=r[3];if(c&&(l=l|0),h===void 0||h==="["&&a+2===s){Cu(e,h===void 0?new $x(l,i,t):new Yx(l,i,t));break}else{let p=e.map[l];p===void 0&&(p=new Kx(l),Cu(e,p)),e=p}}}class Oo{constructor(t,e){this.seq=[],this.map={};const n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){const r=t.getActiveUniform(e,s),a=t.getUniformLocation(e,r.name);Jx(r,a,this)}}setValue(t,e,n,s){const r=this.map[e];r!==void 0&&r.setValue(t,n,s)}setOptional(t,e,n){const s=e[n];s!==void 0&&this.setValue(t,n,s)}static upload(t,e,n,s){for(let r=0,a=e.length;r!==a;++r){const l=e[r],c=n[l.id];c.needsUpdate!==!1&&l.setValue(t,c.value,s)}}static seqWithValue(t,e){const n=[];for(let s=0,r=t.length;s!==r;++s){const a=t[s];a.id in e&&n.push(a)}return n}}function Ru(i,t,e){const n=i.createShader(t);return i.shaderSource(n,e),i.compileShader(n),n}const Zx=37297;let Qx=0;function tM(i,t){const e=i.split(`
`),n=[],s=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let a=s;a<r;a++){const l=a+1;n.push(`${l===t?">":" "} ${l}: ${e[a]}`)}return n.join(`
`)}const Pu=new Wt;function eM(i){ee._getMatrix(Pu,ee.workingColorSpace,i);const t=`mat3( ${Pu.elements.map(e=>e.toFixed(4))} )`;switch(ee.getTransfer(i)){case ea:return[t,"LinearTransferOETF"];case he:return[t,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",i),[t,"LinearTransferOETF"]}}function Iu(i,t,e){const n=i.getShaderParameter(t,i.COMPILE_STATUS),s=i.getShaderInfoLog(t).trim();if(n&&s==="")return"";const r=/ERROR: 0:(\d+)/.exec(s);if(r){const a=parseInt(r[1]);return e.toUpperCase()+`

`+s+`

`+tM(i.getShaderSource(t),a)}else return s}function nM(i,t){const e=eM(t);return[`vec4 ${i}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}function iM(i,t){let e;switch(t){case Jd:e="Linear";break;case Zd:e="Reinhard";break;case Qd:e="Cineon";break;case cc:e="ACESFilmic";break;case tf:e="AgX";break;case ef:e="Neutral";break;case u0:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+i+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const _o=new O;function sM(){ee.getLuminanceCoefficients(_o);const i=_o.x.toFixed(4),t=_o.y.toFixed(4),e=_o.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function rM(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(_r).join(`
`)}function oM(i){const t=[];for(const e in i){const n=i[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function aM(i,t){const e={},n=i.getProgramParameter(t,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){const r=i.getActiveAttrib(t,s),a=r.name;let l=1;r.type===i.FLOAT_MAT2&&(l=2),r.type===i.FLOAT_MAT3&&(l=3),r.type===i.FLOAT_MAT4&&(l=4),e[a]={type:r.type,location:i.getAttribLocation(t,a),locationSize:l}}return e}function _r(i){return i!==""}function Du(i,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Lu(i,t){return i.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const lM=/^[ \t]*#include +<([\w\d./]+)>/gm;function $l(i){return i.replace(lM,hM)}const cM=new Map;function hM(i,t){let e=Xt[t];if(e===void 0){const n=cM.get(t);if(n!==void 0)e=Xt[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return $l(e)}const uM=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Uu(i){return i.replace(uM,dM)}function dM(i,t,e,n){let s="";for(let r=parseInt(t);r<parseInt(e);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Nu(i){let t=`precision ${i.precision} float;
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
#define LOW_PRECISION`),t}function fM(i){let t="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===$d?t="SHADOWMAP_TYPE_PCF":i.shadowMapType===Yd?t="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===Jn&&(t="SHADOWMAP_TYPE_VSM"),t}function pM(i){let t="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case Bs:case ks:t="ENVMAP_TYPE_CUBE";break;case ta:t="ENVMAP_TYPE_CUBE_UV";break}return t}function mM(i){let t="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case ks:t="ENVMAP_MODE_REFRACTION";break}return t}function gM(i){let t="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case Kd:t="ENVMAP_BLENDING_MULTIPLY";break;case c0:t="ENVMAP_BLENDING_MIX";break;case h0:t="ENVMAP_BLENDING_ADD";break}return t}function _M(i){const t=i.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),112)),texelHeight:n,maxMip:e}}function vM(i,t,e,n){const s=i.getContext(),r=e.defines;let a=e.vertexShader,l=e.fragmentShader;const c=fM(e),h=pM(e),d=mM(e),p=gM(e),m=_M(e),y=rM(e),M=oM(r),b=s.createProgram();let v,f,D=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(v=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,M].filter(_r).join(`
`),v.length>0&&(v+=`
`),f=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,M].filter(_r).join(`
`),f.length>0&&(f+=`
`)):(v=[Nu(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,M,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+d:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(_r).join(`
`),f=[Nu(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,M,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.envMap?"#define "+d:"",e.envMap?"#define "+p:"",m?"#define CUBEUV_TEXEL_WIDTH "+m.texelWidth:"",m?"#define CUBEUV_TEXEL_HEIGHT "+m.texelHeight:"",m?"#define CUBEUV_MAX_MIP "+m.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==Ei?"#define TONE_MAPPING":"",e.toneMapping!==Ei?Xt.tonemapping_pars_fragment:"",e.toneMapping!==Ei?iM("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",Xt.colorspace_pars_fragment,nM("linearToOutputTexel",e.outputColorSpace),sM(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(_r).join(`
`)),a=$l(a),a=Du(a,e),a=Lu(a,e),l=$l(l),l=Du(l,e),l=Lu(l,e),a=Uu(a),l=Uu(l),e.isRawShaderMaterial!==!0&&(D=`#version 300 es
`,v=[y,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+v,f=["#define varying in",e.glslVersion===jh?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===jh?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+f);const I=D+v+a,C=D+f+l,z=Ru(s,s.VERTEX_SHADER,I),N=Ru(s,s.FRAGMENT_SHADER,C);s.attachShader(b,z),s.attachShader(b,N),e.index0AttributeName!==void 0?s.bindAttribLocation(b,0,e.index0AttributeName):e.morphTargets===!0&&s.bindAttribLocation(b,0,"position"),s.linkProgram(b);function E(w){if(i.debug.checkShaderErrors){const L=s.getProgramInfoLog(b).trim(),T=s.getShaderInfoLog(z).trim(),K=s.getShaderInfoLog(N).trim();let Q=!0,J=!0;if(s.getProgramParameter(b,s.LINK_STATUS)===!1)if(Q=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,b,z,N);else{const nt=Iu(s,z,"vertex"),$=Iu(s,N,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(b,s.VALIDATE_STATUS)+`

Material Name: `+w.name+`
Material Type: `+w.type+`

Program Info Log: `+L+`
`+nt+`
`+$)}else L!==""?console.warn("THREE.WebGLProgram: Program Info Log:",L):(T===""||K==="")&&(J=!1);J&&(w.diagnostics={runnable:Q,programLog:L,vertexShader:{log:T,prefix:v},fragmentShader:{log:K,prefix:f}})}s.deleteShader(z),s.deleteShader(N),S=new Oo(s,b),g=aM(s,b)}let S;this.getUniforms=function(){return S===void 0&&E(this),S};let g;this.getAttributes=function(){return g===void 0&&E(this),g};let _=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return _===!1&&(_=s.getProgramParameter(b,Zx)),_},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(b),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=Qx++,this.cacheKey=t,this.usedTimes=1,this.program=b,this.vertexShader=z,this.fragmentShader=N,this}let yM=0;class xM{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,n=t.fragmentShader,s=this._getShaderStage(e),r=this._getShaderStage(n),a=this._getShaderCacheForMaterial(t);return a.has(s)===!1&&(a.add(s),s.usedTimes++),a.has(r)===!1&&(a.add(r),r.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){const e=this.shaderCache;let n=e.get(t);return n===void 0&&(n=new MM(t),e.set(t,n)),n}}class MM{constructor(t){this.id=yM++,this.code=t,this.usedTimes=0}}function SM(i,t,e,n,s,r,a){const l=new vc,c=new xM,h=new Set,d=[],p=s.logarithmicDepthBuffer,m=s.vertexTextures;let y=s.precision;const M={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function b(g){return h.add(g),g===0?"uv":`uv${g}`}function v(g,_,w,L,T){const K=L.fog,Q=T.geometry,J=g.isMeshStandardMaterial?L.environment:null,nt=(g.isMeshStandardMaterial?e:t).get(g.envMap||J),$=nt&&nt.mapping===ta?nt.image.height:null,ut=M[g.type];g.precision!==null&&(y=s.getMaxPrecision(g.precision),y!==g.precision&&console.warn("THREE.WebGLProgram.getParameters:",g.precision,"not supported, using",y,"instead."));const vt=Q.morphAttributes.position||Q.morphAttributes.normal||Q.morphAttributes.color,Rt=vt!==void 0?vt.length:0;let Bt=0;Q.morphAttributes.position!==void 0&&(Bt=1),Q.morphAttributes.normal!==void 0&&(Bt=2),Q.morphAttributes.color!==void 0&&(Bt=3);let kt,Z,st,At;if(ut){const Jt=On[ut];kt=Jt.vertexShader,Z=Jt.fragmentShader}else kt=g.vertexShader,Z=g.fragmentShader,c.update(g),st=c.getVertexShaderID(g),At=c.getFragmentShaderID(g);const ct=i.getRenderTarget(),Ut=i.state.buffers.depth.getReversed(),zt=T.isInstancedMesh===!0,Gt=T.isBatchedMesh===!0,pe=!!g.map,qt=!!g.matcap,Ee=!!nt,V=!!g.aoMap,Ve=!!g.lightMap,jt=!!g.bumpMap,$t=!!g.normalMap,It=!!g.displacementMap,me=!!g.emissiveMap,Pt=!!g.metalnessMap,U=!!g.roughnessMap,A=g.anisotropy>0,H=g.clearcoat>0,tt=g.dispersion>0,it=g.iridescence>0,Y=g.sheen>0,gt=g.transmission>0,ht=A&&!!g.anisotropyMap,yt=H&&!!g.clearcoatMap,Yt=H&&!!g.clearcoatNormalMap,rt=H&&!!g.clearcoatRoughnessMap,_t=it&&!!g.iridescenceMap,Dt=it&&!!g.iridescenceThicknessMap,Ot=Y&&!!g.sheenColorMap,xt=Y&&!!g.sheenRoughnessMap,Kt=!!g.specularMap,Ht=!!g.specularColorMap,ae=!!g.specularIntensityMap,F=gt&&!!g.transmissionMap,pt=gt&&!!g.thicknessMap,j=!!g.gradientMap,et=!!g.alphaMap,mt=g.alphaTest>0,lt=!!g.alphaHash,Vt=!!g.extensions;let Se=Ei;g.toneMapped&&(ct===null||ct.isXRRenderTarget===!0)&&(Se=i.toneMapping);const Le={shaderID:ut,shaderType:g.type,shaderName:g.name,vertexShader:kt,fragmentShader:Z,defines:g.defines,customVertexShaderID:st,customFragmentShaderID:At,isRawShaderMaterial:g.isRawShaderMaterial===!0,glslVersion:g.glslVersion,precision:y,batching:Gt,batchingColor:Gt&&T._colorsTexture!==null,instancing:zt,instancingColor:zt&&T.instanceColor!==null,instancingMorph:zt&&T.morphTexture!==null,supportsVertexTextures:m,outputColorSpace:ct===null?i.outputColorSpace:ct.isXRRenderTarget===!0?ct.texture.colorSpace:Ws,alphaToCoverage:!!g.alphaToCoverage,map:pe,matcap:qt,envMap:Ee,envMapMode:Ee&&nt.mapping,envMapCubeUVHeight:$,aoMap:V,lightMap:Ve,bumpMap:jt,normalMap:$t,displacementMap:m&&It,emissiveMap:me,normalMapObjectSpace:$t&&g.normalMapType===m0,normalMapTangentSpace:$t&&g.normalMapType===ff,metalnessMap:Pt,roughnessMap:U,anisotropy:A,anisotropyMap:ht,clearcoat:H,clearcoatMap:yt,clearcoatNormalMap:Yt,clearcoatRoughnessMap:rt,dispersion:tt,iridescence:it,iridescenceMap:_t,iridescenceThicknessMap:Dt,sheen:Y,sheenColorMap:Ot,sheenRoughnessMap:xt,specularMap:Kt,specularColorMap:Ht,specularIntensityMap:ae,transmission:gt,transmissionMap:F,thicknessMap:pt,gradientMap:j,opaque:g.transparent===!1&&g.blending===Ds&&g.alphaToCoverage===!1,alphaMap:et,alphaTest:mt,alphaHash:lt,combine:g.combine,mapUv:pe&&b(g.map.channel),aoMapUv:V&&b(g.aoMap.channel),lightMapUv:Ve&&b(g.lightMap.channel),bumpMapUv:jt&&b(g.bumpMap.channel),normalMapUv:$t&&b(g.normalMap.channel),displacementMapUv:It&&b(g.displacementMap.channel),emissiveMapUv:me&&b(g.emissiveMap.channel),metalnessMapUv:Pt&&b(g.metalnessMap.channel),roughnessMapUv:U&&b(g.roughnessMap.channel),anisotropyMapUv:ht&&b(g.anisotropyMap.channel),clearcoatMapUv:yt&&b(g.clearcoatMap.channel),clearcoatNormalMapUv:Yt&&b(g.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:rt&&b(g.clearcoatRoughnessMap.channel),iridescenceMapUv:_t&&b(g.iridescenceMap.channel),iridescenceThicknessMapUv:Dt&&b(g.iridescenceThicknessMap.channel),sheenColorMapUv:Ot&&b(g.sheenColorMap.channel),sheenRoughnessMapUv:xt&&b(g.sheenRoughnessMap.channel),specularMapUv:Kt&&b(g.specularMap.channel),specularColorMapUv:Ht&&b(g.specularColorMap.channel),specularIntensityMapUv:ae&&b(g.specularIntensityMap.channel),transmissionMapUv:F&&b(g.transmissionMap.channel),thicknessMapUv:pt&&b(g.thicknessMap.channel),alphaMapUv:et&&b(g.alphaMap.channel),vertexTangents:!!Q.attributes.tangent&&($t||A),vertexColors:g.vertexColors,vertexAlphas:g.vertexColors===!0&&!!Q.attributes.color&&Q.attributes.color.itemSize===4,pointsUvs:T.isPoints===!0&&!!Q.attributes.uv&&(pe||et),fog:!!K,useFog:g.fog===!0,fogExp2:!!K&&K.isFogExp2,flatShading:g.flatShading===!0,sizeAttenuation:g.sizeAttenuation===!0,logarithmicDepthBuffer:p,reverseDepthBuffer:Ut,skinning:T.isSkinnedMesh===!0,morphTargets:Q.morphAttributes.position!==void 0,morphNormals:Q.morphAttributes.normal!==void 0,morphColors:Q.morphAttributes.color!==void 0,morphTargetsCount:Rt,morphTextureStride:Bt,numDirLights:_.directional.length,numPointLights:_.point.length,numSpotLights:_.spot.length,numSpotLightMaps:_.spotLightMap.length,numRectAreaLights:_.rectArea.length,numHemiLights:_.hemi.length,numDirLightShadows:_.directionalShadowMap.length,numPointLightShadows:_.pointShadowMap.length,numSpotLightShadows:_.spotShadowMap.length,numSpotLightShadowsWithMaps:_.numSpotLightShadowsWithMaps,numLightProbes:_.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:g.dithering,shadowMapEnabled:i.shadowMap.enabled&&w.length>0,shadowMapType:i.shadowMap.type,toneMapping:Se,decodeVideoTexture:pe&&g.map.isVideoTexture===!0&&ee.getTransfer(g.map.colorSpace)===he,decodeVideoTextureEmissive:me&&g.emissiveMap.isVideoTexture===!0&&ee.getTransfer(g.emissiveMap.colorSpace)===he,premultipliedAlpha:g.premultipliedAlpha,doubleSided:g.side===Ze,flipSided:g.side===Qe,useDepthPacking:g.depthPacking>=0,depthPacking:g.depthPacking||0,index0AttributeName:g.index0AttributeName,extensionClipCullDistance:Vt&&g.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Vt&&g.extensions.multiDraw===!0||Gt)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:g.customProgramCacheKey()};return Le.vertexUv1s=h.has(1),Le.vertexUv2s=h.has(2),Le.vertexUv3s=h.has(3),h.clear(),Le}function f(g){const _=[];if(g.shaderID?_.push(g.shaderID):(_.push(g.customVertexShaderID),_.push(g.customFragmentShaderID)),g.defines!==void 0)for(const w in g.defines)_.push(w),_.push(g.defines[w]);return g.isRawShaderMaterial===!1&&(D(_,g),I(_,g),_.push(i.outputColorSpace)),_.push(g.customProgramCacheKey),_.join()}function D(g,_){g.push(_.precision),g.push(_.outputColorSpace),g.push(_.envMapMode),g.push(_.envMapCubeUVHeight),g.push(_.mapUv),g.push(_.alphaMapUv),g.push(_.lightMapUv),g.push(_.aoMapUv),g.push(_.bumpMapUv),g.push(_.normalMapUv),g.push(_.displacementMapUv),g.push(_.emissiveMapUv),g.push(_.metalnessMapUv),g.push(_.roughnessMapUv),g.push(_.anisotropyMapUv),g.push(_.clearcoatMapUv),g.push(_.clearcoatNormalMapUv),g.push(_.clearcoatRoughnessMapUv),g.push(_.iridescenceMapUv),g.push(_.iridescenceThicknessMapUv),g.push(_.sheenColorMapUv),g.push(_.sheenRoughnessMapUv),g.push(_.specularMapUv),g.push(_.specularColorMapUv),g.push(_.specularIntensityMapUv),g.push(_.transmissionMapUv),g.push(_.thicknessMapUv),g.push(_.combine),g.push(_.fogExp2),g.push(_.sizeAttenuation),g.push(_.morphTargetsCount),g.push(_.morphAttributeCount),g.push(_.numDirLights),g.push(_.numPointLights),g.push(_.numSpotLights),g.push(_.numSpotLightMaps),g.push(_.numHemiLights),g.push(_.numRectAreaLights),g.push(_.numDirLightShadows),g.push(_.numPointLightShadows),g.push(_.numSpotLightShadows),g.push(_.numSpotLightShadowsWithMaps),g.push(_.numLightProbes),g.push(_.shadowMapType),g.push(_.toneMapping),g.push(_.numClippingPlanes),g.push(_.numClipIntersection),g.push(_.depthPacking)}function I(g,_){l.disableAll(),_.supportsVertexTextures&&l.enable(0),_.instancing&&l.enable(1),_.instancingColor&&l.enable(2),_.instancingMorph&&l.enable(3),_.matcap&&l.enable(4),_.envMap&&l.enable(5),_.normalMapObjectSpace&&l.enable(6),_.normalMapTangentSpace&&l.enable(7),_.clearcoat&&l.enable(8),_.iridescence&&l.enable(9),_.alphaTest&&l.enable(10),_.vertexColors&&l.enable(11),_.vertexAlphas&&l.enable(12),_.vertexUv1s&&l.enable(13),_.vertexUv2s&&l.enable(14),_.vertexUv3s&&l.enable(15),_.vertexTangents&&l.enable(16),_.anisotropy&&l.enable(17),_.alphaHash&&l.enable(18),_.batching&&l.enable(19),_.dispersion&&l.enable(20),_.batchingColor&&l.enable(21),g.push(l.mask),l.disableAll(),_.fog&&l.enable(0),_.useFog&&l.enable(1),_.flatShading&&l.enable(2),_.logarithmicDepthBuffer&&l.enable(3),_.reverseDepthBuffer&&l.enable(4),_.skinning&&l.enable(5),_.morphTargets&&l.enable(6),_.morphNormals&&l.enable(7),_.morphColors&&l.enable(8),_.premultipliedAlpha&&l.enable(9),_.shadowMapEnabled&&l.enable(10),_.doubleSided&&l.enable(11),_.flipSided&&l.enable(12),_.useDepthPacking&&l.enable(13),_.dithering&&l.enable(14),_.transmission&&l.enable(15),_.sheen&&l.enable(16),_.opaque&&l.enable(17),_.pointsUvs&&l.enable(18),_.decodeVideoTexture&&l.enable(19),_.decodeVideoTextureEmissive&&l.enable(20),_.alphaToCoverage&&l.enable(21),g.push(l.mask)}function C(g){const _=M[g.type];let w;if(_){const L=On[_];w=Cr.clone(L.uniforms)}else w=g.uniforms;return w}function z(g,_){let w;for(let L=0,T=d.length;L<T;L++){const K=d[L];if(K.cacheKey===_){w=K,++w.usedTimes;break}}return w===void 0&&(w=new vM(i,_,g,r),d.push(w)),w}function N(g){if(--g.usedTimes===0){const _=d.indexOf(g);d[_]=d[d.length-1],d.pop(),g.destroy()}}function E(g){c.remove(g)}function S(){c.dispose()}return{getParameters:v,getProgramCacheKey:f,getUniforms:C,acquireProgram:z,releaseProgram:N,releaseShaderCache:E,programs:d,dispose:S}}function EM(){let i=new WeakMap;function t(a){return i.has(a)}function e(a){let l=i.get(a);return l===void 0&&(l={},i.set(a,l)),l}function n(a){i.delete(a)}function s(a,l,c){i.get(a)[l]=c}function r(){i=new WeakMap}return{has:t,get:e,remove:n,update:s,dispose:r}}function bM(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.material.id!==t.material.id?i.material.id-t.material.id:i.z!==t.z?i.z-t.z:i.id-t.id}function Ou(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.z!==t.z?t.z-i.z:i.id-t.id}function Fu(){const i=[];let t=0;const e=[],n=[],s=[];function r(){t=0,e.length=0,n.length=0,s.length=0}function a(p,m,y,M,b,v){let f=i[t];return f===void 0?(f={id:p.id,object:p,geometry:m,material:y,groupOrder:M,renderOrder:p.renderOrder,z:b,group:v},i[t]=f):(f.id=p.id,f.object=p,f.geometry=m,f.material=y,f.groupOrder=M,f.renderOrder=p.renderOrder,f.z=b,f.group=v),t++,f}function l(p,m,y,M,b,v){const f=a(p,m,y,M,b,v);y.transmission>0?n.push(f):y.transparent===!0?s.push(f):e.push(f)}function c(p,m,y,M,b,v){const f=a(p,m,y,M,b,v);y.transmission>0?n.unshift(f):y.transparent===!0?s.unshift(f):e.unshift(f)}function h(p,m){e.length>1&&e.sort(p||bM),n.length>1&&n.sort(m||Ou),s.length>1&&s.sort(m||Ou)}function d(){for(let p=t,m=i.length;p<m;p++){const y=i[p];if(y.id===null)break;y.id=null,y.object=null,y.geometry=null,y.material=null,y.group=null}}return{opaque:e,transmissive:n,transparent:s,init:r,push:l,unshift:c,finish:d,sort:h}}function wM(){let i=new WeakMap;function t(n,s){const r=i.get(n);let a;return r===void 0?(a=new Fu,i.set(n,[a])):s>=r.length?(a=new Fu,r.push(a)):a=r[s],a}function e(){i=new WeakMap}return{get:t,dispose:e}}function TM(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new O,color:new bt};break;case"SpotLight":e={position:new O,direction:new O,color:new bt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new O,color:new bt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new O,skyColor:new bt,groundColor:new bt};break;case"RectAreaLight":e={color:new bt,position:new O,halfWidth:new O,halfHeight:new O};break}return i[t.id]=e,e}}}function AM(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Mt};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Mt};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Mt,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[t.id]=e,e}}}let CM=0;function RM(i,t){return(t.castShadow?2:0)-(i.castShadow?2:0)+(t.map?1:0)-(i.map?1:0)}function PM(i){const t=new TM,e=AM(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let h=0;h<9;h++)n.probe.push(new O);const s=new O,r=new le,a=new le;function l(h){let d=0,p=0,m=0;for(let g=0;g<9;g++)n.probe[g].set(0,0,0);let y=0,M=0,b=0,v=0,f=0,D=0,I=0,C=0,z=0,N=0,E=0;h.sort(RM);for(let g=0,_=h.length;g<_;g++){const w=h[g],L=w.color,T=w.intensity,K=w.distance,Q=w.shadow&&w.shadow.map?w.shadow.map.texture:null;if(w.isAmbientLight)d+=L.r*T,p+=L.g*T,m+=L.b*T;else if(w.isLightProbe){for(let J=0;J<9;J++)n.probe[J].addScaledVector(w.sh.coefficients[J],T);E++}else if(w.isDirectionalLight){const J=t.get(w);if(J.color.copy(w.color).multiplyScalar(w.intensity),w.castShadow){const nt=w.shadow,$=e.get(w);$.shadowIntensity=nt.intensity,$.shadowBias=nt.bias,$.shadowNormalBias=nt.normalBias,$.shadowRadius=nt.radius,$.shadowMapSize=nt.mapSize,n.directionalShadow[y]=$,n.directionalShadowMap[y]=Q,n.directionalShadowMatrix[y]=w.shadow.matrix,D++}n.directional[y]=J,y++}else if(w.isSpotLight){const J=t.get(w);J.position.setFromMatrixPosition(w.matrixWorld),J.color.copy(L).multiplyScalar(T),J.distance=K,J.coneCos=Math.cos(w.angle),J.penumbraCos=Math.cos(w.angle*(1-w.penumbra)),J.decay=w.decay,n.spot[b]=J;const nt=w.shadow;if(w.map&&(n.spotLightMap[z]=w.map,z++,nt.updateMatrices(w),w.castShadow&&N++),n.spotLightMatrix[b]=nt.matrix,w.castShadow){const $=e.get(w);$.shadowIntensity=nt.intensity,$.shadowBias=nt.bias,$.shadowNormalBias=nt.normalBias,$.shadowRadius=nt.radius,$.shadowMapSize=nt.mapSize,n.spotShadow[b]=$,n.spotShadowMap[b]=Q,C++}b++}else if(w.isRectAreaLight){const J=t.get(w);J.color.copy(L).multiplyScalar(T),J.halfWidth.set(w.width*.5,0,0),J.halfHeight.set(0,w.height*.5,0),n.rectArea[v]=J,v++}else if(w.isPointLight){const J=t.get(w);if(J.color.copy(w.color).multiplyScalar(w.intensity),J.distance=w.distance,J.decay=w.decay,w.castShadow){const nt=w.shadow,$=e.get(w);$.shadowIntensity=nt.intensity,$.shadowBias=nt.bias,$.shadowNormalBias=nt.normalBias,$.shadowRadius=nt.radius,$.shadowMapSize=nt.mapSize,$.shadowCameraNear=nt.camera.near,$.shadowCameraFar=nt.camera.far,n.pointShadow[M]=$,n.pointShadowMap[M]=Q,n.pointShadowMatrix[M]=w.shadow.matrix,I++}n.point[M]=J,M++}else if(w.isHemisphereLight){const J=t.get(w);J.skyColor.copy(w.color).multiplyScalar(T),J.groundColor.copy(w.groundColor).multiplyScalar(T),n.hemi[f]=J,f++}}v>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=ft.LTC_FLOAT_1,n.rectAreaLTC2=ft.LTC_FLOAT_2):(n.rectAreaLTC1=ft.LTC_HALF_1,n.rectAreaLTC2=ft.LTC_HALF_2)),n.ambient[0]=d,n.ambient[1]=p,n.ambient[2]=m;const S=n.hash;(S.directionalLength!==y||S.pointLength!==M||S.spotLength!==b||S.rectAreaLength!==v||S.hemiLength!==f||S.numDirectionalShadows!==D||S.numPointShadows!==I||S.numSpotShadows!==C||S.numSpotMaps!==z||S.numLightProbes!==E)&&(n.directional.length=y,n.spot.length=b,n.rectArea.length=v,n.point.length=M,n.hemi.length=f,n.directionalShadow.length=D,n.directionalShadowMap.length=D,n.pointShadow.length=I,n.pointShadowMap.length=I,n.spotShadow.length=C,n.spotShadowMap.length=C,n.directionalShadowMatrix.length=D,n.pointShadowMatrix.length=I,n.spotLightMatrix.length=C+z-N,n.spotLightMap.length=z,n.numSpotLightShadowsWithMaps=N,n.numLightProbes=E,S.directionalLength=y,S.pointLength=M,S.spotLength=b,S.rectAreaLength=v,S.hemiLength=f,S.numDirectionalShadows=D,S.numPointShadows=I,S.numSpotShadows=C,S.numSpotMaps=z,S.numLightProbes=E,n.version=CM++)}function c(h,d){let p=0,m=0,y=0,M=0,b=0;const v=d.matrixWorldInverse;for(let f=0,D=h.length;f<D;f++){const I=h[f];if(I.isDirectionalLight){const C=n.directional[p];C.direction.setFromMatrixPosition(I.matrixWorld),s.setFromMatrixPosition(I.target.matrixWorld),C.direction.sub(s),C.direction.transformDirection(v),p++}else if(I.isSpotLight){const C=n.spot[y];C.position.setFromMatrixPosition(I.matrixWorld),C.position.applyMatrix4(v),C.direction.setFromMatrixPosition(I.matrixWorld),s.setFromMatrixPosition(I.target.matrixWorld),C.direction.sub(s),C.direction.transformDirection(v),y++}else if(I.isRectAreaLight){const C=n.rectArea[M];C.position.setFromMatrixPosition(I.matrixWorld),C.position.applyMatrix4(v),a.identity(),r.copy(I.matrixWorld),r.premultiply(v),a.extractRotation(r),C.halfWidth.set(I.width*.5,0,0),C.halfHeight.set(0,I.height*.5,0),C.halfWidth.applyMatrix4(a),C.halfHeight.applyMatrix4(a),M++}else if(I.isPointLight){const C=n.point[m];C.position.setFromMatrixPosition(I.matrixWorld),C.position.applyMatrix4(v),m++}else if(I.isHemisphereLight){const C=n.hemi[b];C.direction.setFromMatrixPosition(I.matrixWorld),C.direction.transformDirection(v),b++}}}return{setup:l,setupView:c,state:n}}function Bu(i){const t=new PM(i),e=[],n=[];function s(d){h.camera=d,e.length=0,n.length=0}function r(d){e.push(d)}function a(d){n.push(d)}function l(){t.setup(e)}function c(d){t.setupView(e,d)}const h={lightsArray:e,shadowsArray:n,camera:null,lights:t,transmissionRenderTarget:{}};return{init:s,state:h,setupLights:l,setupLightsView:c,pushLight:r,pushShadow:a}}function IM(i){let t=new WeakMap;function e(s,r=0){const a=t.get(s);let l;return a===void 0?(l=new Bu(i),t.set(s,[l])):r>=a.length?(l=new Bu(i),a.push(l)):l=a[r],l}function n(){t=new WeakMap}return{get:e,dispose:n}}class DM extends Ti{static get type(){return"MeshDepthMaterial"}constructor(t){super(),this.isMeshDepthMaterial=!0,this.depthPacking=f0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class LM extends Ti{static get type(){return"MeshDistanceMaterial"}constructor(t){super(),this.isMeshDistanceMaterial=!0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}const UM=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,NM=`uniform sampler2D shadow_pass;
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
}`;function OM(i,t,e){let n=new xc;const s=new Mt,r=new Mt,a=new ve,l=new DM({depthPacking:p0}),c=new LM,h={},d=e.maxTextureSize,p={[bi]:Qe,[Qe]:bi,[Ze]:Ze},m=new we({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Mt},radius:{value:4}},vertexShader:UM,fragmentShader:NM}),y=m.clone();y.defines.HORIZONTAL_PASS=1;const M=new Re;M.setAttribute("position",new Ce(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const b=new Ft(M,m),v=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=$d;let f=this.type;this.render=function(N,E,S){if(v.enabled===!1||v.autoUpdate===!1&&v.needsUpdate===!1||N.length===0)return;const g=i.getRenderTarget(),_=i.getActiveCubeFace(),w=i.getActiveMipmapLevel(),L=i.state;L.setBlending(ti),L.buffers.color.setClear(1,1,1,1),L.buffers.depth.setTest(!0),L.setScissorTest(!1);const T=f!==Jn&&this.type===Jn,K=f===Jn&&this.type!==Jn;for(let Q=0,J=N.length;Q<J;Q++){const nt=N[Q],$=nt.shadow;if($===void 0){console.warn("THREE.WebGLShadowMap:",nt,"has no shadow.");continue}if($.autoUpdate===!1&&$.needsUpdate===!1)continue;s.copy($.mapSize);const ut=$.getFrameExtents();if(s.multiply(ut),r.copy($.mapSize),(s.x>d||s.y>d)&&(s.x>d&&(r.x=Math.floor(d/ut.x),s.x=r.x*ut.x,$.mapSize.x=r.x),s.y>d&&(r.y=Math.floor(d/ut.y),s.y=r.y*ut.y,$.mapSize.y=r.y)),$.map===null||T===!0||K===!0){const Rt=this.type!==Jn?{minFilter:hn,magFilter:hn}:{};$.map!==null&&$.map.dispose(),$.map=new Rn(s.x,s.y,Rt),$.map.texture.name=nt.name+".shadowMap",$.camera.updateProjectionMatrix()}i.setRenderTarget($.map),i.clear();const vt=$.getViewportCount();for(let Rt=0;Rt<vt;Rt++){const Bt=$.getViewport(Rt);a.set(r.x*Bt.x,r.y*Bt.y,r.x*Bt.z,r.y*Bt.w),L.viewport(a),$.updateMatrices(nt,Rt),n=$.getFrustum(),C(E,S,$.camera,nt,this.type)}$.isPointLightShadow!==!0&&this.type===Jn&&D($,S),$.needsUpdate=!1}f=this.type,v.needsUpdate=!1,i.setRenderTarget(g,_,w)};function D(N,E){const S=t.update(b);m.defines.VSM_SAMPLES!==N.blurSamples&&(m.defines.VSM_SAMPLES=N.blurSamples,y.defines.VSM_SAMPLES=N.blurSamples,m.needsUpdate=!0,y.needsUpdate=!0),N.mapPass===null&&(N.mapPass=new Rn(s.x,s.y)),m.uniforms.shadow_pass.value=N.map.texture,m.uniforms.resolution.value=N.mapSize,m.uniforms.radius.value=N.radius,i.setRenderTarget(N.mapPass),i.clear(),i.renderBufferDirect(E,null,S,m,b,null),y.uniforms.shadow_pass.value=N.mapPass.texture,y.uniforms.resolution.value=N.mapSize,y.uniforms.radius.value=N.radius,i.setRenderTarget(N.map),i.clear(),i.renderBufferDirect(E,null,S,y,b,null)}function I(N,E,S,g){let _=null;const w=S.isPointLight===!0?N.customDistanceMaterial:N.customDepthMaterial;if(w!==void 0)_=w;else if(_=S.isPointLight===!0?c:l,i.localClippingEnabled&&E.clipShadows===!0&&Array.isArray(E.clippingPlanes)&&E.clippingPlanes.length!==0||E.displacementMap&&E.displacementScale!==0||E.alphaMap&&E.alphaTest>0||E.map&&E.alphaTest>0){const L=_.uuid,T=E.uuid;let K=h[L];K===void 0&&(K={},h[L]=K);let Q=K[T];Q===void 0&&(Q=_.clone(),K[T]=Q,E.addEventListener("dispose",z)),_=Q}if(_.visible=E.visible,_.wireframe=E.wireframe,g===Jn?_.side=E.shadowSide!==null?E.shadowSide:E.side:_.side=E.shadowSide!==null?E.shadowSide:p[E.side],_.alphaMap=E.alphaMap,_.alphaTest=E.alphaTest,_.map=E.map,_.clipShadows=E.clipShadows,_.clippingPlanes=E.clippingPlanes,_.clipIntersection=E.clipIntersection,_.displacementMap=E.displacementMap,_.displacementScale=E.displacementScale,_.displacementBias=E.displacementBias,_.wireframeLinewidth=E.wireframeLinewidth,_.linewidth=E.linewidth,S.isPointLight===!0&&_.isMeshDistanceMaterial===!0){const L=i.properties.get(_);L.light=S}return _}function C(N,E,S,g,_){if(N.visible===!1)return;if(N.layers.test(E.layers)&&(N.isMesh||N.isLine||N.isPoints)&&(N.castShadow||N.receiveShadow&&_===Jn)&&(!N.frustumCulled||n.intersectsObject(N))){N.modelViewMatrix.multiplyMatrices(S.matrixWorldInverse,N.matrixWorld);const T=t.update(N),K=N.material;if(Array.isArray(K)){const Q=T.groups;for(let J=0,nt=Q.length;J<nt;J++){const $=Q[J],ut=K[$.materialIndex];if(ut&&ut.visible){const vt=I(N,ut,g,_);N.onBeforeShadow(i,N,E,S,T,vt,$),i.renderBufferDirect(S,null,T,vt,N,$),N.onAfterShadow(i,N,E,S,T,vt,$)}}}else if(K.visible){const Q=I(N,K,g,_);N.onBeforeShadow(i,N,E,S,T,Q,null),i.renderBufferDirect(S,null,T,Q,N,null),N.onAfterShadow(i,N,E,S,T,Q,null)}}const L=N.children;for(let T=0,K=L.length;T<K;T++)C(L[T],E,S,g,_)}function z(N){N.target.removeEventListener("dispose",z);for(const S in h){const g=h[S],_=N.target.uuid;_ in g&&(g[_].dispose(),delete g[_])}}}const FM={[hl]:ul,[dl]:ml,[fl]:gl,[Fs]:pl,[ul]:hl,[ml]:dl,[gl]:fl,[pl]:Fs};function BM(i,t){function e(){let F=!1;const pt=new ve;let j=null;const et=new ve(0,0,0,0);return{setMask:function(mt){j!==mt&&!F&&(i.colorMask(mt,mt,mt,mt),j=mt)},setLocked:function(mt){F=mt},setClear:function(mt,lt,Vt,Se,Le){Le===!0&&(mt*=Se,lt*=Se,Vt*=Se),pt.set(mt,lt,Vt,Se),et.equals(pt)===!1&&(i.clearColor(mt,lt,Vt,Se),et.copy(pt))},reset:function(){F=!1,j=null,et.set(-1,0,0,0)}}}function n(){let F=!1,pt=!1,j=null,et=null,mt=null;return{setReversed:function(lt){if(pt!==lt){const Vt=t.get("EXT_clip_control");pt?Vt.clipControlEXT(Vt.LOWER_LEFT_EXT,Vt.ZERO_TO_ONE_EXT):Vt.clipControlEXT(Vt.LOWER_LEFT_EXT,Vt.NEGATIVE_ONE_TO_ONE_EXT);const Se=mt;mt=null,this.setClear(Se)}pt=lt},getReversed:function(){return pt},setTest:function(lt){lt?ct(i.DEPTH_TEST):Ut(i.DEPTH_TEST)},setMask:function(lt){j!==lt&&!F&&(i.depthMask(lt),j=lt)},setFunc:function(lt){if(pt&&(lt=FM[lt]),et!==lt){switch(lt){case hl:i.depthFunc(i.NEVER);break;case ul:i.depthFunc(i.ALWAYS);break;case dl:i.depthFunc(i.LESS);break;case Fs:i.depthFunc(i.LEQUAL);break;case fl:i.depthFunc(i.EQUAL);break;case pl:i.depthFunc(i.GEQUAL);break;case ml:i.depthFunc(i.GREATER);break;case gl:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}et=lt}},setLocked:function(lt){F=lt},setClear:function(lt){mt!==lt&&(pt&&(lt=1-lt),i.clearDepth(lt),mt=lt)},reset:function(){F=!1,j=null,et=null,mt=null,pt=!1}}}function s(){let F=!1,pt=null,j=null,et=null,mt=null,lt=null,Vt=null,Se=null,Le=null;return{setTest:function(Jt){F||(Jt?ct(i.STENCIL_TEST):Ut(i.STENCIL_TEST))},setMask:function(Jt){pt!==Jt&&!F&&(i.stencilMask(Jt),pt=Jt)},setFunc:function(Jt,tn,be){(j!==Jt||et!==tn||mt!==be)&&(i.stencilFunc(Jt,tn,be),j=Jt,et=tn,mt=be)},setOp:function(Jt,tn,be){(lt!==Jt||Vt!==tn||Se!==be)&&(i.stencilOp(Jt,tn,be),lt=Jt,Vt=tn,Se=be)},setLocked:function(Jt){F=Jt},setClear:function(Jt){Le!==Jt&&(i.clearStencil(Jt),Le=Jt)},reset:function(){F=!1,pt=null,j=null,et=null,mt=null,lt=null,Vt=null,Se=null,Le=null}}}const r=new e,a=new n,l=new s,c=new WeakMap,h=new WeakMap;let d={},p={},m=new WeakMap,y=[],M=null,b=!1,v=null,f=null,D=null,I=null,C=null,z=null,N=null,E=new bt(0,0,0),S=0,g=!1,_=null,w=null,L=null,T=null,K=null;const Q=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let J=!1,nt=0;const $=i.getParameter(i.VERSION);$.indexOf("WebGL")!==-1?(nt=parseFloat(/^WebGL (\d)/.exec($)[1]),J=nt>=1):$.indexOf("OpenGL ES")!==-1&&(nt=parseFloat(/^OpenGL ES (\d)/.exec($)[1]),J=nt>=2);let ut=null,vt={};const Rt=i.getParameter(i.SCISSOR_BOX),Bt=i.getParameter(i.VIEWPORT),kt=new ve().fromArray(Rt),Z=new ve().fromArray(Bt);function st(F,pt,j,et){const mt=new Uint8Array(4),lt=i.createTexture();i.bindTexture(F,lt),i.texParameteri(F,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(F,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let Vt=0;Vt<j;Vt++)F===i.TEXTURE_3D||F===i.TEXTURE_2D_ARRAY?i.texImage3D(pt,0,i.RGBA,1,1,et,0,i.RGBA,i.UNSIGNED_BYTE,mt):i.texImage2D(pt+Vt,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,mt);return lt}const At={};At[i.TEXTURE_2D]=st(i.TEXTURE_2D,i.TEXTURE_2D,1),At[i.TEXTURE_CUBE_MAP]=st(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),At[i.TEXTURE_2D_ARRAY]=st(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),At[i.TEXTURE_3D]=st(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),l.setClear(0),ct(i.DEPTH_TEST),a.setFunc(Fs),jt(!1),$t(Hh),ct(i.CULL_FACE),V(ti);function ct(F){d[F]!==!0&&(i.enable(F),d[F]=!0)}function Ut(F){d[F]!==!1&&(i.disable(F),d[F]=!1)}function zt(F,pt){return p[F]!==pt?(i.bindFramebuffer(F,pt),p[F]=pt,F===i.DRAW_FRAMEBUFFER&&(p[i.FRAMEBUFFER]=pt),F===i.FRAMEBUFFER&&(p[i.DRAW_FRAMEBUFFER]=pt),!0):!1}function Gt(F,pt){let j=y,et=!1;if(F){j=m.get(pt),j===void 0&&(j=[],m.set(pt,j));const mt=F.textures;if(j.length!==mt.length||j[0]!==i.COLOR_ATTACHMENT0){for(let lt=0,Vt=mt.length;lt<Vt;lt++)j[lt]=i.COLOR_ATTACHMENT0+lt;j.length=mt.length,et=!0}}else j[0]!==i.BACK&&(j[0]=i.BACK,et=!0);et&&i.drawBuffers(j)}function pe(F){return M!==F?(i.useProgram(F),M=F,!0):!1}const qt={[zi]:i.FUNC_ADD,[qg]:i.FUNC_SUBTRACT,[jg]:i.FUNC_REVERSE_SUBTRACT};qt[$g]=i.MIN,qt[Yg]=i.MAX;const Ee={[Kg]:i.ZERO,[Jg]:i.ONE,[Zg]:i.SRC_COLOR,[ll]:i.SRC_ALPHA,[s0]:i.SRC_ALPHA_SATURATE,[n0]:i.DST_COLOR,[t0]:i.DST_ALPHA,[Qg]:i.ONE_MINUS_SRC_COLOR,[cl]:i.ONE_MINUS_SRC_ALPHA,[i0]:i.ONE_MINUS_DST_COLOR,[e0]:i.ONE_MINUS_DST_ALPHA,[r0]:i.CONSTANT_COLOR,[o0]:i.ONE_MINUS_CONSTANT_COLOR,[a0]:i.CONSTANT_ALPHA,[l0]:i.ONE_MINUS_CONSTANT_ALPHA};function V(F,pt,j,et,mt,lt,Vt,Se,Le,Jt){if(F===ti){b===!0&&(Ut(i.BLEND),b=!1);return}if(b===!1&&(ct(i.BLEND),b=!0),F!==Xg){if(F!==v||Jt!==g){if((f!==zi||C!==zi)&&(i.blendEquation(i.FUNC_ADD),f=zi,C=zi),Jt)switch(F){case Ds:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Pn:i.blendFunc(i.ONE,i.ONE);break;case Wh:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Xh:i.blendFuncSeparate(i.ZERO,i.SRC_COLOR,i.ZERO,i.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",F);break}else switch(F){case Ds:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Pn:i.blendFunc(i.SRC_ALPHA,i.ONE);break;case Wh:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Xh:i.blendFunc(i.ZERO,i.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",F);break}D=null,I=null,z=null,N=null,E.set(0,0,0),S=0,v=F,g=Jt}return}mt=mt||pt,lt=lt||j,Vt=Vt||et,(pt!==f||mt!==C)&&(i.blendEquationSeparate(qt[pt],qt[mt]),f=pt,C=mt),(j!==D||et!==I||lt!==z||Vt!==N)&&(i.blendFuncSeparate(Ee[j],Ee[et],Ee[lt],Ee[Vt]),D=j,I=et,z=lt,N=Vt),(Se.equals(E)===!1||Le!==S)&&(i.blendColor(Se.r,Se.g,Se.b,Le),E.copy(Se),S=Le),v=F,g=!1}function Ve(F,pt){F.side===Ze?Ut(i.CULL_FACE):ct(i.CULL_FACE);let j=F.side===Qe;pt&&(j=!j),jt(j),F.blending===Ds&&F.transparent===!1?V(ti):V(F.blending,F.blendEquation,F.blendSrc,F.blendDst,F.blendEquationAlpha,F.blendSrcAlpha,F.blendDstAlpha,F.blendColor,F.blendAlpha,F.premultipliedAlpha),a.setFunc(F.depthFunc),a.setTest(F.depthTest),a.setMask(F.depthWrite),r.setMask(F.colorWrite);const et=F.stencilWrite;l.setTest(et),et&&(l.setMask(F.stencilWriteMask),l.setFunc(F.stencilFunc,F.stencilRef,F.stencilFuncMask),l.setOp(F.stencilFail,F.stencilZFail,F.stencilZPass)),me(F.polygonOffset,F.polygonOffsetFactor,F.polygonOffsetUnits),F.alphaToCoverage===!0?ct(i.SAMPLE_ALPHA_TO_COVERAGE):Ut(i.SAMPLE_ALPHA_TO_COVERAGE)}function jt(F){_!==F&&(F?i.frontFace(i.CW):i.frontFace(i.CCW),_=F)}function $t(F){F!==Hg?(ct(i.CULL_FACE),F!==w&&(F===Hh?i.cullFace(i.BACK):F===Wg?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):Ut(i.CULL_FACE),w=F}function It(F){F!==L&&(J&&i.lineWidth(F),L=F)}function me(F,pt,j){F?(ct(i.POLYGON_OFFSET_FILL),(T!==pt||K!==j)&&(i.polygonOffset(pt,j),T=pt,K=j)):Ut(i.POLYGON_OFFSET_FILL)}function Pt(F){F?ct(i.SCISSOR_TEST):Ut(i.SCISSOR_TEST)}function U(F){F===void 0&&(F=i.TEXTURE0+Q-1),ut!==F&&(i.activeTexture(F),ut=F)}function A(F,pt,j){j===void 0&&(ut===null?j=i.TEXTURE0+Q-1:j=ut);let et=vt[j];et===void 0&&(et={type:void 0,texture:void 0},vt[j]=et),(et.type!==F||et.texture!==pt)&&(ut!==j&&(i.activeTexture(j),ut=j),i.bindTexture(F,pt||At[F]),et.type=F,et.texture=pt)}function H(){const F=vt[ut];F!==void 0&&F.type!==void 0&&(i.bindTexture(F.type,null),F.type=void 0,F.texture=void 0)}function tt(){try{i.compressedTexImage2D.apply(i,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function it(){try{i.compressedTexImage3D.apply(i,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function Y(){try{i.texSubImage2D.apply(i,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function gt(){try{i.texSubImage3D.apply(i,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function ht(){try{i.compressedTexSubImage2D.apply(i,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function yt(){try{i.compressedTexSubImage3D.apply(i,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function Yt(){try{i.texStorage2D.apply(i,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function rt(){try{i.texStorage3D.apply(i,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function _t(){try{i.texImage2D.apply(i,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function Dt(){try{i.texImage3D.apply(i,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function Ot(F){kt.equals(F)===!1&&(i.scissor(F.x,F.y,F.z,F.w),kt.copy(F))}function xt(F){Z.equals(F)===!1&&(i.viewport(F.x,F.y,F.z,F.w),Z.copy(F))}function Kt(F,pt){let j=h.get(pt);j===void 0&&(j=new WeakMap,h.set(pt,j));let et=j.get(F);et===void 0&&(et=i.getUniformBlockIndex(pt,F.name),j.set(F,et))}function Ht(F,pt){const et=h.get(pt).get(F);c.get(pt)!==et&&(i.uniformBlockBinding(pt,et,F.__bindingPointIndex),c.set(pt,et))}function ae(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),a.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),d={},ut=null,vt={},p={},m=new WeakMap,y=[],M=null,b=!1,v=null,f=null,D=null,I=null,C=null,z=null,N=null,E=new bt(0,0,0),S=0,g=!1,_=null,w=null,L=null,T=null,K=null,kt.set(0,0,i.canvas.width,i.canvas.height),Z.set(0,0,i.canvas.width,i.canvas.height),r.reset(),a.reset(),l.reset()}return{buffers:{color:r,depth:a,stencil:l},enable:ct,disable:Ut,bindFramebuffer:zt,drawBuffers:Gt,useProgram:pe,setBlending:V,setMaterial:Ve,setFlipSided:jt,setCullFace:$t,setLineWidth:It,setPolygonOffset:me,setScissorTest:Pt,activeTexture:U,bindTexture:A,unbindTexture:H,compressedTexImage2D:tt,compressedTexImage3D:it,texImage2D:_t,texImage3D:Dt,updateUBOMapping:Kt,uniformBlockBinding:Ht,texStorage2D:Yt,texStorage3D:rt,texSubImage2D:Y,texSubImage3D:gt,compressedTexSubImage2D:ht,compressedTexSubImage3D:yt,scissor:Ot,viewport:xt,reset:ae}}function ku(i,t,e,n){const s=kM(n);switch(e){case af:return i*t;case cf:return i*t;case hf:return i*t*2;case fc:return i*t/s.components*s.byteLength;case pc:return i*t/s.components*s.byteLength;case uf:return i*t*2/s.components*s.byteLength;case mc:return i*t*2/s.components*s.byteLength;case lf:return i*t*3/s.components*s.byteLength;case An:return i*t*4/s.components*s.byteLength;case gc:return i*t*4/s.components*s.byteLength;case Io:case Do:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case Lo:case Uo:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case Sl:case bl:return Math.max(i,16)*Math.max(t,8)/4;case Ml:case El:return Math.max(i,8)*Math.max(t,8)/2;case wl:case Tl:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case Al:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case Cl:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case Rl:return Math.floor((i+4)/5)*Math.floor((t+3)/4)*16;case Pl:return Math.floor((i+4)/5)*Math.floor((t+4)/5)*16;case Il:return Math.floor((i+5)/6)*Math.floor((t+4)/5)*16;case Dl:return Math.floor((i+5)/6)*Math.floor((t+5)/6)*16;case Ll:return Math.floor((i+7)/8)*Math.floor((t+4)/5)*16;case Ul:return Math.floor((i+7)/8)*Math.floor((t+5)/6)*16;case Nl:return Math.floor((i+7)/8)*Math.floor((t+7)/8)*16;case Ol:return Math.floor((i+9)/10)*Math.floor((t+4)/5)*16;case Fl:return Math.floor((i+9)/10)*Math.floor((t+5)/6)*16;case Bl:return Math.floor((i+9)/10)*Math.floor((t+7)/8)*16;case kl:return Math.floor((i+9)/10)*Math.floor((t+9)/10)*16;case zl:return Math.floor((i+11)/12)*Math.floor((t+9)/10)*16;case Vl:return Math.floor((i+11)/12)*Math.floor((t+11)/12)*16;case No:case Gl:case Hl:return Math.ceil(i/4)*Math.ceil(t/4)*16;case df:case Wl:return Math.ceil(i/4)*Math.ceil(t/4)*8;case Xl:case ql:return Math.ceil(i/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function kM(i){switch(i){case ri:case sf:return{byteLength:1,components:1};case Tr:case rf:case ei:return{byteLength:2,components:1};case uc:case dc:return{byteLength:2,components:4};case Ki:case hc:case kn:return{byteLength:4,components:1};case of:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}function zM(i,t,e,n,s,r,a){const l=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),h=new Mt,d=new WeakMap;let p;const m=new WeakMap;let y=!1;try{y=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function M(U,A){return y?new OffscreenCanvas(U,A):qo("canvas")}function b(U,A,H){let tt=1;const it=Pt(U);if((it.width>H||it.height>H)&&(tt=H/Math.max(it.width,it.height)),tt<1)if(typeof HTMLImageElement<"u"&&U instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&U instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&U instanceof ImageBitmap||typeof VideoFrame<"u"&&U instanceof VideoFrame){const Y=Math.floor(tt*it.width),gt=Math.floor(tt*it.height);p===void 0&&(p=M(Y,gt));const ht=A?M(Y,gt):p;return ht.width=Y,ht.height=gt,ht.getContext("2d").drawImage(U,0,0,Y,gt),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+it.width+"x"+it.height+") to ("+Y+"x"+gt+")."),ht}else return"data"in U&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+it.width+"x"+it.height+")."),U;return U}function v(U){return U.generateMipmaps}function f(U){i.generateMipmap(U)}function D(U){return U.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:U.isWebGL3DRenderTarget?i.TEXTURE_3D:U.isWebGLArrayRenderTarget||U.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function I(U,A,H,tt,it=!1){if(U!==null){if(i[U]!==void 0)return i[U];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+U+"'")}let Y=A;if(A===i.RED&&(H===i.FLOAT&&(Y=i.R32F),H===i.HALF_FLOAT&&(Y=i.R16F),H===i.UNSIGNED_BYTE&&(Y=i.R8)),A===i.RED_INTEGER&&(H===i.UNSIGNED_BYTE&&(Y=i.R8UI),H===i.UNSIGNED_SHORT&&(Y=i.R16UI),H===i.UNSIGNED_INT&&(Y=i.R32UI),H===i.BYTE&&(Y=i.R8I),H===i.SHORT&&(Y=i.R16I),H===i.INT&&(Y=i.R32I)),A===i.RG&&(H===i.FLOAT&&(Y=i.RG32F),H===i.HALF_FLOAT&&(Y=i.RG16F),H===i.UNSIGNED_BYTE&&(Y=i.RG8)),A===i.RG_INTEGER&&(H===i.UNSIGNED_BYTE&&(Y=i.RG8UI),H===i.UNSIGNED_SHORT&&(Y=i.RG16UI),H===i.UNSIGNED_INT&&(Y=i.RG32UI),H===i.BYTE&&(Y=i.RG8I),H===i.SHORT&&(Y=i.RG16I),H===i.INT&&(Y=i.RG32I)),A===i.RGB_INTEGER&&(H===i.UNSIGNED_BYTE&&(Y=i.RGB8UI),H===i.UNSIGNED_SHORT&&(Y=i.RGB16UI),H===i.UNSIGNED_INT&&(Y=i.RGB32UI),H===i.BYTE&&(Y=i.RGB8I),H===i.SHORT&&(Y=i.RGB16I),H===i.INT&&(Y=i.RGB32I)),A===i.RGBA_INTEGER&&(H===i.UNSIGNED_BYTE&&(Y=i.RGBA8UI),H===i.UNSIGNED_SHORT&&(Y=i.RGBA16UI),H===i.UNSIGNED_INT&&(Y=i.RGBA32UI),H===i.BYTE&&(Y=i.RGBA8I),H===i.SHORT&&(Y=i.RGBA16I),H===i.INT&&(Y=i.RGBA32I)),A===i.RGB&&H===i.UNSIGNED_INT_5_9_9_9_REV&&(Y=i.RGB9_E5),A===i.RGBA){const gt=it?ea:ee.getTransfer(tt);H===i.FLOAT&&(Y=i.RGBA32F),H===i.HALF_FLOAT&&(Y=i.RGBA16F),H===i.UNSIGNED_BYTE&&(Y=gt===he?i.SRGB8_ALPHA8:i.RGBA8),H===i.UNSIGNED_SHORT_4_4_4_4&&(Y=i.RGBA4),H===i.UNSIGNED_SHORT_5_5_5_1&&(Y=i.RGB5_A1)}return(Y===i.R16F||Y===i.R32F||Y===i.RG16F||Y===i.RG32F||Y===i.RGBA16F||Y===i.RGBA32F)&&t.get("EXT_color_buffer_float"),Y}function C(U,A){let H;return U?A===null||A===Ki||A===zs?H=i.DEPTH24_STENCIL8:A===kn?H=i.DEPTH32F_STENCIL8:A===Tr&&(H=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):A===null||A===Ki||A===zs?H=i.DEPTH_COMPONENT24:A===kn?H=i.DEPTH_COMPONENT32F:A===Tr&&(H=i.DEPTH_COMPONENT16),H}function z(U,A){return v(U)===!0||U.isFramebufferTexture&&U.minFilter!==hn&&U.minFilter!==gn?Math.log2(Math.max(A.width,A.height))+1:U.mipmaps!==void 0&&U.mipmaps.length>0?U.mipmaps.length:U.isCompressedTexture&&Array.isArray(U.image)?A.mipmaps.length:1}function N(U){const A=U.target;A.removeEventListener("dispose",N),S(A),A.isVideoTexture&&d.delete(A)}function E(U){const A=U.target;A.removeEventListener("dispose",E),_(A)}function S(U){const A=n.get(U);if(A.__webglInit===void 0)return;const H=U.source,tt=m.get(H);if(tt){const it=tt[A.__cacheKey];it.usedTimes--,it.usedTimes===0&&g(U),Object.keys(tt).length===0&&m.delete(H)}n.remove(U)}function g(U){const A=n.get(U);i.deleteTexture(A.__webglTexture);const H=U.source,tt=m.get(H);delete tt[A.__cacheKey],a.memory.textures--}function _(U){const A=n.get(U);if(U.depthTexture&&(U.depthTexture.dispose(),n.remove(U.depthTexture)),U.isWebGLCubeRenderTarget)for(let tt=0;tt<6;tt++){if(Array.isArray(A.__webglFramebuffer[tt]))for(let it=0;it<A.__webglFramebuffer[tt].length;it++)i.deleteFramebuffer(A.__webglFramebuffer[tt][it]);else i.deleteFramebuffer(A.__webglFramebuffer[tt]);A.__webglDepthbuffer&&i.deleteRenderbuffer(A.__webglDepthbuffer[tt])}else{if(Array.isArray(A.__webglFramebuffer))for(let tt=0;tt<A.__webglFramebuffer.length;tt++)i.deleteFramebuffer(A.__webglFramebuffer[tt]);else i.deleteFramebuffer(A.__webglFramebuffer);if(A.__webglDepthbuffer&&i.deleteRenderbuffer(A.__webglDepthbuffer),A.__webglMultisampledFramebuffer&&i.deleteFramebuffer(A.__webglMultisampledFramebuffer),A.__webglColorRenderbuffer)for(let tt=0;tt<A.__webglColorRenderbuffer.length;tt++)A.__webglColorRenderbuffer[tt]&&i.deleteRenderbuffer(A.__webglColorRenderbuffer[tt]);A.__webglDepthRenderbuffer&&i.deleteRenderbuffer(A.__webglDepthRenderbuffer)}const H=U.textures;for(let tt=0,it=H.length;tt<it;tt++){const Y=n.get(H[tt]);Y.__webglTexture&&(i.deleteTexture(Y.__webglTexture),a.memory.textures--),n.remove(H[tt])}n.remove(U)}let w=0;function L(){w=0}function T(){const U=w;return U>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+U+" texture units while this GPU supports only "+s.maxTextures),w+=1,U}function K(U){const A=[];return A.push(U.wrapS),A.push(U.wrapT),A.push(U.wrapR||0),A.push(U.magFilter),A.push(U.minFilter),A.push(U.anisotropy),A.push(U.internalFormat),A.push(U.format),A.push(U.type),A.push(U.generateMipmaps),A.push(U.premultiplyAlpha),A.push(U.flipY),A.push(U.unpackAlignment),A.push(U.colorSpace),A.join()}function Q(U,A){const H=n.get(U);if(U.isVideoTexture&&It(U),U.isRenderTargetTexture===!1&&U.version>0&&H.__version!==U.version){const tt=U.image;if(tt===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(tt.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{Z(H,U,A);return}}e.bindTexture(i.TEXTURE_2D,H.__webglTexture,i.TEXTURE0+A)}function J(U,A){const H=n.get(U);if(U.version>0&&H.__version!==U.version){Z(H,U,A);return}e.bindTexture(i.TEXTURE_2D_ARRAY,H.__webglTexture,i.TEXTURE0+A)}function nt(U,A){const H=n.get(U);if(U.version>0&&H.__version!==U.version){Z(H,U,A);return}e.bindTexture(i.TEXTURE_3D,H.__webglTexture,i.TEXTURE0+A)}function $(U,A){const H=n.get(U);if(U.version>0&&H.__version!==U.version){st(H,U,A);return}e.bindTexture(i.TEXTURE_CUBE_MAP,H.__webglTexture,i.TEXTURE0+A)}const ut={[yl]:i.REPEAT,[Wi]:i.CLAMP_TO_EDGE,[xl]:i.MIRRORED_REPEAT},vt={[hn]:i.NEAREST,[d0]:i.NEAREST_MIPMAP_NEAREST,[Kr]:i.NEAREST_MIPMAP_LINEAR,[gn]:i.LINEAR,[Sa]:i.LINEAR_MIPMAP_NEAREST,[Xi]:i.LINEAR_MIPMAP_LINEAR},Rt={[g0]:i.NEVER,[S0]:i.ALWAYS,[_0]:i.LESS,[pf]:i.LEQUAL,[v0]:i.EQUAL,[M0]:i.GEQUAL,[y0]:i.GREATER,[x0]:i.NOTEQUAL};function Bt(U,A){if(A.type===kn&&t.has("OES_texture_float_linear")===!1&&(A.magFilter===gn||A.magFilter===Sa||A.magFilter===Kr||A.magFilter===Xi||A.minFilter===gn||A.minFilter===Sa||A.minFilter===Kr||A.minFilter===Xi)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(U,i.TEXTURE_WRAP_S,ut[A.wrapS]),i.texParameteri(U,i.TEXTURE_WRAP_T,ut[A.wrapT]),(U===i.TEXTURE_3D||U===i.TEXTURE_2D_ARRAY)&&i.texParameteri(U,i.TEXTURE_WRAP_R,ut[A.wrapR]),i.texParameteri(U,i.TEXTURE_MAG_FILTER,vt[A.magFilter]),i.texParameteri(U,i.TEXTURE_MIN_FILTER,vt[A.minFilter]),A.compareFunction&&(i.texParameteri(U,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(U,i.TEXTURE_COMPARE_FUNC,Rt[A.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(A.magFilter===hn||A.minFilter!==Kr&&A.minFilter!==Xi||A.type===kn&&t.has("OES_texture_float_linear")===!1)return;if(A.anisotropy>1||n.get(A).__currentAnisotropy){const H=t.get("EXT_texture_filter_anisotropic");i.texParameterf(U,H.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(A.anisotropy,s.getMaxAnisotropy())),n.get(A).__currentAnisotropy=A.anisotropy}}}function kt(U,A){let H=!1;U.__webglInit===void 0&&(U.__webglInit=!0,A.addEventListener("dispose",N));const tt=A.source;let it=m.get(tt);it===void 0&&(it={},m.set(tt,it));const Y=K(A);if(Y!==U.__cacheKey){it[Y]===void 0&&(it[Y]={texture:i.createTexture(),usedTimes:0},a.memory.textures++,H=!0),it[Y].usedTimes++;const gt=it[U.__cacheKey];gt!==void 0&&(it[U.__cacheKey].usedTimes--,gt.usedTimes===0&&g(A)),U.__cacheKey=Y,U.__webglTexture=it[Y].texture}return H}function Z(U,A,H){let tt=i.TEXTURE_2D;(A.isDataArrayTexture||A.isCompressedArrayTexture)&&(tt=i.TEXTURE_2D_ARRAY),A.isData3DTexture&&(tt=i.TEXTURE_3D);const it=kt(U,A),Y=A.source;e.bindTexture(tt,U.__webglTexture,i.TEXTURE0+H);const gt=n.get(Y);if(Y.version!==gt.__version||it===!0){e.activeTexture(i.TEXTURE0+H);const ht=ee.getPrimaries(ee.workingColorSpace),yt=A.colorSpace===xi?null:ee.getPrimaries(A.colorSpace),Yt=A.colorSpace===xi||ht===yt?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,A.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,A.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,A.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Yt);let rt=b(A.image,!1,s.maxTextureSize);rt=me(A,rt);const _t=r.convert(A.format,A.colorSpace),Dt=r.convert(A.type);let Ot=I(A.internalFormat,_t,Dt,A.colorSpace,A.isVideoTexture);Bt(tt,A);let xt;const Kt=A.mipmaps,Ht=A.isVideoTexture!==!0,ae=gt.__version===void 0||it===!0,F=Y.dataReady,pt=z(A,rt);if(A.isDepthTexture)Ot=C(A.format===Vs,A.type),ae&&(Ht?e.texStorage2D(i.TEXTURE_2D,1,Ot,rt.width,rt.height):e.texImage2D(i.TEXTURE_2D,0,Ot,rt.width,rt.height,0,_t,Dt,null));else if(A.isDataTexture)if(Kt.length>0){Ht&&ae&&e.texStorage2D(i.TEXTURE_2D,pt,Ot,Kt[0].width,Kt[0].height);for(let j=0,et=Kt.length;j<et;j++)xt=Kt[j],Ht?F&&e.texSubImage2D(i.TEXTURE_2D,j,0,0,xt.width,xt.height,_t,Dt,xt.data):e.texImage2D(i.TEXTURE_2D,j,Ot,xt.width,xt.height,0,_t,Dt,xt.data);A.generateMipmaps=!1}else Ht?(ae&&e.texStorage2D(i.TEXTURE_2D,pt,Ot,rt.width,rt.height),F&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,rt.width,rt.height,_t,Dt,rt.data)):e.texImage2D(i.TEXTURE_2D,0,Ot,rt.width,rt.height,0,_t,Dt,rt.data);else if(A.isCompressedTexture)if(A.isCompressedArrayTexture){Ht&&ae&&e.texStorage3D(i.TEXTURE_2D_ARRAY,pt,Ot,Kt[0].width,Kt[0].height,rt.depth);for(let j=0,et=Kt.length;j<et;j++)if(xt=Kt[j],A.format!==An)if(_t!==null)if(Ht){if(F)if(A.layerUpdates.size>0){const mt=ku(xt.width,xt.height,A.format,A.type);for(const lt of A.layerUpdates){const Vt=xt.data.subarray(lt*mt/xt.data.BYTES_PER_ELEMENT,(lt+1)*mt/xt.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,j,0,0,lt,xt.width,xt.height,1,_t,Vt)}A.clearLayerUpdates()}else e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,j,0,0,0,xt.width,xt.height,rt.depth,_t,xt.data)}else e.compressedTexImage3D(i.TEXTURE_2D_ARRAY,j,Ot,xt.width,xt.height,rt.depth,0,xt.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Ht?F&&e.texSubImage3D(i.TEXTURE_2D_ARRAY,j,0,0,0,xt.width,xt.height,rt.depth,_t,Dt,xt.data):e.texImage3D(i.TEXTURE_2D_ARRAY,j,Ot,xt.width,xt.height,rt.depth,0,_t,Dt,xt.data)}else{Ht&&ae&&e.texStorage2D(i.TEXTURE_2D,pt,Ot,Kt[0].width,Kt[0].height);for(let j=0,et=Kt.length;j<et;j++)xt=Kt[j],A.format!==An?_t!==null?Ht?F&&e.compressedTexSubImage2D(i.TEXTURE_2D,j,0,0,xt.width,xt.height,_t,xt.data):e.compressedTexImage2D(i.TEXTURE_2D,j,Ot,xt.width,xt.height,0,xt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Ht?F&&e.texSubImage2D(i.TEXTURE_2D,j,0,0,xt.width,xt.height,_t,Dt,xt.data):e.texImage2D(i.TEXTURE_2D,j,Ot,xt.width,xt.height,0,_t,Dt,xt.data)}else if(A.isDataArrayTexture)if(Ht){if(ae&&e.texStorage3D(i.TEXTURE_2D_ARRAY,pt,Ot,rt.width,rt.height,rt.depth),F)if(A.layerUpdates.size>0){const j=ku(rt.width,rt.height,A.format,A.type);for(const et of A.layerUpdates){const mt=rt.data.subarray(et*j/rt.data.BYTES_PER_ELEMENT,(et+1)*j/rt.data.BYTES_PER_ELEMENT);e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,et,rt.width,rt.height,1,_t,Dt,mt)}A.clearLayerUpdates()}else e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,rt.width,rt.height,rt.depth,_t,Dt,rt.data)}else e.texImage3D(i.TEXTURE_2D_ARRAY,0,Ot,rt.width,rt.height,rt.depth,0,_t,Dt,rt.data);else if(A.isData3DTexture)Ht?(ae&&e.texStorage3D(i.TEXTURE_3D,pt,Ot,rt.width,rt.height,rt.depth),F&&e.texSubImage3D(i.TEXTURE_3D,0,0,0,0,rt.width,rt.height,rt.depth,_t,Dt,rt.data)):e.texImage3D(i.TEXTURE_3D,0,Ot,rt.width,rt.height,rt.depth,0,_t,Dt,rt.data);else if(A.isFramebufferTexture){if(ae)if(Ht)e.texStorage2D(i.TEXTURE_2D,pt,Ot,rt.width,rt.height);else{let j=rt.width,et=rt.height;for(let mt=0;mt<pt;mt++)e.texImage2D(i.TEXTURE_2D,mt,Ot,j,et,0,_t,Dt,null),j>>=1,et>>=1}}else if(Kt.length>0){if(Ht&&ae){const j=Pt(Kt[0]);e.texStorage2D(i.TEXTURE_2D,pt,Ot,j.width,j.height)}for(let j=0,et=Kt.length;j<et;j++)xt=Kt[j],Ht?F&&e.texSubImage2D(i.TEXTURE_2D,j,0,0,_t,Dt,xt):e.texImage2D(i.TEXTURE_2D,j,Ot,_t,Dt,xt);A.generateMipmaps=!1}else if(Ht){if(ae){const j=Pt(rt);e.texStorage2D(i.TEXTURE_2D,pt,Ot,j.width,j.height)}F&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,_t,Dt,rt)}else e.texImage2D(i.TEXTURE_2D,0,Ot,_t,Dt,rt);v(A)&&f(tt),gt.__version=Y.version,A.onUpdate&&A.onUpdate(A)}U.__version=A.version}function st(U,A,H){if(A.image.length!==6)return;const tt=kt(U,A),it=A.source;e.bindTexture(i.TEXTURE_CUBE_MAP,U.__webglTexture,i.TEXTURE0+H);const Y=n.get(it);if(it.version!==Y.__version||tt===!0){e.activeTexture(i.TEXTURE0+H);const gt=ee.getPrimaries(ee.workingColorSpace),ht=A.colorSpace===xi?null:ee.getPrimaries(A.colorSpace),yt=A.colorSpace===xi||gt===ht?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,A.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,A.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,A.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,yt);const Yt=A.isCompressedTexture||A.image[0].isCompressedTexture,rt=A.image[0]&&A.image[0].isDataTexture,_t=[];for(let et=0;et<6;et++)!Yt&&!rt?_t[et]=b(A.image[et],!0,s.maxCubemapSize):_t[et]=rt?A.image[et].image:A.image[et],_t[et]=me(A,_t[et]);const Dt=_t[0],Ot=r.convert(A.format,A.colorSpace),xt=r.convert(A.type),Kt=I(A.internalFormat,Ot,xt,A.colorSpace),Ht=A.isVideoTexture!==!0,ae=Y.__version===void 0||tt===!0,F=it.dataReady;let pt=z(A,Dt);Bt(i.TEXTURE_CUBE_MAP,A);let j;if(Yt){Ht&&ae&&e.texStorage2D(i.TEXTURE_CUBE_MAP,pt,Kt,Dt.width,Dt.height);for(let et=0;et<6;et++){j=_t[et].mipmaps;for(let mt=0;mt<j.length;mt++){const lt=j[mt];A.format!==An?Ot!==null?Ht?F&&e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+et,mt,0,0,lt.width,lt.height,Ot,lt.data):e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+et,mt,Kt,lt.width,lt.height,0,lt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Ht?F&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+et,mt,0,0,lt.width,lt.height,Ot,xt,lt.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+et,mt,Kt,lt.width,lt.height,0,Ot,xt,lt.data)}}}else{if(j=A.mipmaps,Ht&&ae){j.length>0&&pt++;const et=Pt(_t[0]);e.texStorage2D(i.TEXTURE_CUBE_MAP,pt,Kt,et.width,et.height)}for(let et=0;et<6;et++)if(rt){Ht?F&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+et,0,0,0,_t[et].width,_t[et].height,Ot,xt,_t[et].data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+et,0,Kt,_t[et].width,_t[et].height,0,Ot,xt,_t[et].data);for(let mt=0;mt<j.length;mt++){const Vt=j[mt].image[et].image;Ht?F&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+et,mt+1,0,0,Vt.width,Vt.height,Ot,xt,Vt.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+et,mt+1,Kt,Vt.width,Vt.height,0,Ot,xt,Vt.data)}}else{Ht?F&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+et,0,0,0,Ot,xt,_t[et]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+et,0,Kt,Ot,xt,_t[et]);for(let mt=0;mt<j.length;mt++){const lt=j[mt];Ht?F&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+et,mt+1,0,0,Ot,xt,lt.image[et]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+et,mt+1,Kt,Ot,xt,lt.image[et])}}}v(A)&&f(i.TEXTURE_CUBE_MAP),Y.__version=it.version,A.onUpdate&&A.onUpdate(A)}U.__version=A.version}function At(U,A,H,tt,it,Y){const gt=r.convert(H.format,H.colorSpace),ht=r.convert(H.type),yt=I(H.internalFormat,gt,ht,H.colorSpace),Yt=n.get(A),rt=n.get(H);if(rt.__renderTarget=A,!Yt.__hasExternalTextures){const _t=Math.max(1,A.width>>Y),Dt=Math.max(1,A.height>>Y);it===i.TEXTURE_3D||it===i.TEXTURE_2D_ARRAY?e.texImage3D(it,Y,yt,_t,Dt,A.depth,0,gt,ht,null):e.texImage2D(it,Y,yt,_t,Dt,0,gt,ht,null)}e.bindFramebuffer(i.FRAMEBUFFER,U),$t(A)?l.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,tt,it,rt.__webglTexture,0,jt(A)):(it===i.TEXTURE_2D||it>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&it<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,tt,it,rt.__webglTexture,Y),e.bindFramebuffer(i.FRAMEBUFFER,null)}function ct(U,A,H){if(i.bindRenderbuffer(i.RENDERBUFFER,U),A.depthBuffer){const tt=A.depthTexture,it=tt&&tt.isDepthTexture?tt.type:null,Y=C(A.stencilBuffer,it),gt=A.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ht=jt(A);$t(A)?l.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,ht,Y,A.width,A.height):H?i.renderbufferStorageMultisample(i.RENDERBUFFER,ht,Y,A.width,A.height):i.renderbufferStorage(i.RENDERBUFFER,Y,A.width,A.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,gt,i.RENDERBUFFER,U)}else{const tt=A.textures;for(let it=0;it<tt.length;it++){const Y=tt[it],gt=r.convert(Y.format,Y.colorSpace),ht=r.convert(Y.type),yt=I(Y.internalFormat,gt,ht,Y.colorSpace),Yt=jt(A);H&&$t(A)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,Yt,yt,A.width,A.height):$t(A)?l.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Yt,yt,A.width,A.height):i.renderbufferStorage(i.RENDERBUFFER,yt,A.width,A.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function Ut(U,A){if(A&&A.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(i.FRAMEBUFFER,U),!(A.depthTexture&&A.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const tt=n.get(A.depthTexture);tt.__renderTarget=A,(!tt.__webglTexture||A.depthTexture.image.width!==A.width||A.depthTexture.image.height!==A.height)&&(A.depthTexture.image.width=A.width,A.depthTexture.image.height=A.height,A.depthTexture.needsUpdate=!0),Q(A.depthTexture,0);const it=tt.__webglTexture,Y=jt(A);if(A.depthTexture.format===Ls)$t(A)?l.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,it,0,Y):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,it,0);else if(A.depthTexture.format===Vs)$t(A)?l.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,it,0,Y):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,it,0);else throw new Error("Unknown depthTexture format")}function zt(U){const A=n.get(U),H=U.isWebGLCubeRenderTarget===!0;if(A.__boundDepthTexture!==U.depthTexture){const tt=U.depthTexture;if(A.__depthDisposeCallback&&A.__depthDisposeCallback(),tt){const it=()=>{delete A.__boundDepthTexture,delete A.__depthDisposeCallback,tt.removeEventListener("dispose",it)};tt.addEventListener("dispose",it),A.__depthDisposeCallback=it}A.__boundDepthTexture=tt}if(U.depthTexture&&!A.__autoAllocateDepthBuffer){if(H)throw new Error("target.depthTexture not supported in Cube render targets");Ut(A.__webglFramebuffer,U)}else if(H){A.__webglDepthbuffer=[];for(let tt=0;tt<6;tt++)if(e.bindFramebuffer(i.FRAMEBUFFER,A.__webglFramebuffer[tt]),A.__webglDepthbuffer[tt]===void 0)A.__webglDepthbuffer[tt]=i.createRenderbuffer(),ct(A.__webglDepthbuffer[tt],U,!1);else{const it=U.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Y=A.__webglDepthbuffer[tt];i.bindRenderbuffer(i.RENDERBUFFER,Y),i.framebufferRenderbuffer(i.FRAMEBUFFER,it,i.RENDERBUFFER,Y)}}else if(e.bindFramebuffer(i.FRAMEBUFFER,A.__webglFramebuffer),A.__webglDepthbuffer===void 0)A.__webglDepthbuffer=i.createRenderbuffer(),ct(A.__webglDepthbuffer,U,!1);else{const tt=U.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,it=A.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,it),i.framebufferRenderbuffer(i.FRAMEBUFFER,tt,i.RENDERBUFFER,it)}e.bindFramebuffer(i.FRAMEBUFFER,null)}function Gt(U,A,H){const tt=n.get(U);A!==void 0&&At(tt.__webglFramebuffer,U,U.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),H!==void 0&&zt(U)}function pe(U){const A=U.texture,H=n.get(U),tt=n.get(A);U.addEventListener("dispose",E);const it=U.textures,Y=U.isWebGLCubeRenderTarget===!0,gt=it.length>1;if(gt||(tt.__webglTexture===void 0&&(tt.__webglTexture=i.createTexture()),tt.__version=A.version,a.memory.textures++),Y){H.__webglFramebuffer=[];for(let ht=0;ht<6;ht++)if(A.mipmaps&&A.mipmaps.length>0){H.__webglFramebuffer[ht]=[];for(let yt=0;yt<A.mipmaps.length;yt++)H.__webglFramebuffer[ht][yt]=i.createFramebuffer()}else H.__webglFramebuffer[ht]=i.createFramebuffer()}else{if(A.mipmaps&&A.mipmaps.length>0){H.__webglFramebuffer=[];for(let ht=0;ht<A.mipmaps.length;ht++)H.__webglFramebuffer[ht]=i.createFramebuffer()}else H.__webglFramebuffer=i.createFramebuffer();if(gt)for(let ht=0,yt=it.length;ht<yt;ht++){const Yt=n.get(it[ht]);Yt.__webglTexture===void 0&&(Yt.__webglTexture=i.createTexture(),a.memory.textures++)}if(U.samples>0&&$t(U)===!1){H.__webglMultisampledFramebuffer=i.createFramebuffer(),H.__webglColorRenderbuffer=[],e.bindFramebuffer(i.FRAMEBUFFER,H.__webglMultisampledFramebuffer);for(let ht=0;ht<it.length;ht++){const yt=it[ht];H.__webglColorRenderbuffer[ht]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,H.__webglColorRenderbuffer[ht]);const Yt=r.convert(yt.format,yt.colorSpace),rt=r.convert(yt.type),_t=I(yt.internalFormat,Yt,rt,yt.colorSpace,U.isXRRenderTarget===!0),Dt=jt(U);i.renderbufferStorageMultisample(i.RENDERBUFFER,Dt,_t,U.width,U.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ht,i.RENDERBUFFER,H.__webglColorRenderbuffer[ht])}i.bindRenderbuffer(i.RENDERBUFFER,null),U.depthBuffer&&(H.__webglDepthRenderbuffer=i.createRenderbuffer(),ct(H.__webglDepthRenderbuffer,U,!0)),e.bindFramebuffer(i.FRAMEBUFFER,null)}}if(Y){e.bindTexture(i.TEXTURE_CUBE_MAP,tt.__webglTexture),Bt(i.TEXTURE_CUBE_MAP,A);for(let ht=0;ht<6;ht++)if(A.mipmaps&&A.mipmaps.length>0)for(let yt=0;yt<A.mipmaps.length;yt++)At(H.__webglFramebuffer[ht][yt],U,A,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+ht,yt);else At(H.__webglFramebuffer[ht],U,A,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+ht,0);v(A)&&f(i.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(gt){for(let ht=0,yt=it.length;ht<yt;ht++){const Yt=it[ht],rt=n.get(Yt);e.bindTexture(i.TEXTURE_2D,rt.__webglTexture),Bt(i.TEXTURE_2D,Yt),At(H.__webglFramebuffer,U,Yt,i.COLOR_ATTACHMENT0+ht,i.TEXTURE_2D,0),v(Yt)&&f(i.TEXTURE_2D)}e.unbindTexture()}else{let ht=i.TEXTURE_2D;if((U.isWebGL3DRenderTarget||U.isWebGLArrayRenderTarget)&&(ht=U.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(ht,tt.__webglTexture),Bt(ht,A),A.mipmaps&&A.mipmaps.length>0)for(let yt=0;yt<A.mipmaps.length;yt++)At(H.__webglFramebuffer[yt],U,A,i.COLOR_ATTACHMENT0,ht,yt);else At(H.__webglFramebuffer,U,A,i.COLOR_ATTACHMENT0,ht,0);v(A)&&f(ht),e.unbindTexture()}U.depthBuffer&&zt(U)}function qt(U){const A=U.textures;for(let H=0,tt=A.length;H<tt;H++){const it=A[H];if(v(it)){const Y=D(U),gt=n.get(it).__webglTexture;e.bindTexture(Y,gt),f(Y),e.unbindTexture()}}}const Ee=[],V=[];function Ve(U){if(U.samples>0){if($t(U)===!1){const A=U.textures,H=U.width,tt=U.height;let it=i.COLOR_BUFFER_BIT;const Y=U.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,gt=n.get(U),ht=A.length>1;if(ht)for(let yt=0;yt<A.length;yt++)e.bindFramebuffer(i.FRAMEBUFFER,gt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+yt,i.RENDERBUFFER,null),e.bindFramebuffer(i.FRAMEBUFFER,gt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+yt,i.TEXTURE_2D,null,0);e.bindFramebuffer(i.READ_FRAMEBUFFER,gt.__webglMultisampledFramebuffer),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,gt.__webglFramebuffer);for(let yt=0;yt<A.length;yt++){if(U.resolveDepthBuffer&&(U.depthBuffer&&(it|=i.DEPTH_BUFFER_BIT),U.stencilBuffer&&U.resolveStencilBuffer&&(it|=i.STENCIL_BUFFER_BIT)),ht){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,gt.__webglColorRenderbuffer[yt]);const Yt=n.get(A[yt]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,Yt,0)}i.blitFramebuffer(0,0,H,tt,0,0,H,tt,it,i.NEAREST),c===!0&&(Ee.length=0,V.length=0,Ee.push(i.COLOR_ATTACHMENT0+yt),U.depthBuffer&&U.resolveDepthBuffer===!1&&(Ee.push(Y),V.push(Y),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,V)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,Ee))}if(e.bindFramebuffer(i.READ_FRAMEBUFFER,null),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),ht)for(let yt=0;yt<A.length;yt++){e.bindFramebuffer(i.FRAMEBUFFER,gt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+yt,i.RENDERBUFFER,gt.__webglColorRenderbuffer[yt]);const Yt=n.get(A[yt]).__webglTexture;e.bindFramebuffer(i.FRAMEBUFFER,gt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+yt,i.TEXTURE_2D,Yt,0)}e.bindFramebuffer(i.DRAW_FRAMEBUFFER,gt.__webglMultisampledFramebuffer)}else if(U.depthBuffer&&U.resolveDepthBuffer===!1&&c){const A=U.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[A])}}}function jt(U){return Math.min(s.maxSamples,U.samples)}function $t(U){const A=n.get(U);return U.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&A.__useRenderToTexture!==!1}function It(U){const A=a.render.frame;d.get(U)!==A&&(d.set(U,A),U.update())}function me(U,A){const H=U.colorSpace,tt=U.format,it=U.type;return U.isCompressedTexture===!0||U.isVideoTexture===!0||H!==Ws&&H!==xi&&(ee.getTransfer(H)===he?(tt!==An||it!==ri)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",H)),A}function Pt(U){return typeof HTMLImageElement<"u"&&U instanceof HTMLImageElement?(h.width=U.naturalWidth||U.width,h.height=U.naturalHeight||U.height):typeof VideoFrame<"u"&&U instanceof VideoFrame?(h.width=U.displayWidth,h.height=U.displayHeight):(h.width=U.width,h.height=U.height),h}this.allocateTextureUnit=T,this.resetTextureUnits=L,this.setTexture2D=Q,this.setTexture2DArray=J,this.setTexture3D=nt,this.setTextureCube=$,this.rebindTextures=Gt,this.setupRenderTarget=pe,this.updateRenderTargetMipmap=qt,this.updateMultisampleRenderTarget=Ve,this.setupDepthRenderbuffer=zt,this.setupFrameBufferTexture=At,this.useMultisampledRTT=$t}function VM(i,t){function e(n,s=xi){let r;const a=ee.getTransfer(s);if(n===ri)return i.UNSIGNED_BYTE;if(n===uc)return i.UNSIGNED_SHORT_4_4_4_4;if(n===dc)return i.UNSIGNED_SHORT_5_5_5_1;if(n===of)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===sf)return i.BYTE;if(n===rf)return i.SHORT;if(n===Tr)return i.UNSIGNED_SHORT;if(n===hc)return i.INT;if(n===Ki)return i.UNSIGNED_INT;if(n===kn)return i.FLOAT;if(n===ei)return i.HALF_FLOAT;if(n===af)return i.ALPHA;if(n===lf)return i.RGB;if(n===An)return i.RGBA;if(n===cf)return i.LUMINANCE;if(n===hf)return i.LUMINANCE_ALPHA;if(n===Ls)return i.DEPTH_COMPONENT;if(n===Vs)return i.DEPTH_STENCIL;if(n===fc)return i.RED;if(n===pc)return i.RED_INTEGER;if(n===uf)return i.RG;if(n===mc)return i.RG_INTEGER;if(n===gc)return i.RGBA_INTEGER;if(n===Io||n===Do||n===Lo||n===Uo)if(a===he)if(r=t.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===Io)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Do)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Lo)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Uo)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=t.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===Io)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Do)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Lo)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Uo)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Ml||n===Sl||n===El||n===bl)if(r=t.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===Ml)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Sl)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===El)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===bl)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===wl||n===Tl||n===Al)if(r=t.get("WEBGL_compressed_texture_etc"),r!==null){if(n===wl||n===Tl)return a===he?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===Al)return a===he?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===Cl||n===Rl||n===Pl||n===Il||n===Dl||n===Ll||n===Ul||n===Nl||n===Ol||n===Fl||n===Bl||n===kl||n===zl||n===Vl)if(r=t.get("WEBGL_compressed_texture_astc"),r!==null){if(n===Cl)return a===he?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Rl)return a===he?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Pl)return a===he?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Il)return a===he?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===Dl)return a===he?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===Ll)return a===he?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Ul)return a===he?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===Nl)return a===he?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Ol)return a===he?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Fl)return a===he?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Bl)return a===he?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===kl)return a===he?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===zl)return a===he?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Vl)return a===he?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===No||n===Gl||n===Hl)if(r=t.get("EXT_texture_compression_bptc"),r!==null){if(n===No)return a===he?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===Gl)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===Hl)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===df||n===Wl||n===Xl||n===ql)if(r=t.get("EXT_texture_compression_rgtc"),r!==null){if(n===No)return r.COMPRESSED_RED_RGTC1_EXT;if(n===Wl)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Xl)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===ql)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===zs?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:e}}class GM extends cn{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}}class De extends Te{constructor(){super(),this.isGroup=!0,this.type="Group"}}const HM={type:"move"};class Ya{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new De,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new De,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new O,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new O),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new De,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new O,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new O),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let s=null,r=null,a=null;const l=this._targetRay,c=this._grip,h=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(h&&t.hand){a=!0;for(const b of t.hand.values()){const v=e.getJointPose(b,n),f=this._getHandJoint(h,b);v!==null&&(f.matrix.fromArray(v.transform.matrix),f.matrix.decompose(f.position,f.rotation,f.scale),f.matrixWorldNeedsUpdate=!0,f.jointRadius=v.radius),f.visible=v!==null}const d=h.joints["index-finger-tip"],p=h.joints["thumb-tip"],m=d.position.distanceTo(p.position),y=.02,M=.005;h.inputState.pinching&&m>y+M?(h.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!h.inputState.pinching&&m<=y-M&&(h.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else c!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,n),r!==null&&(c.matrix.fromArray(r.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,r.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(r.linearVelocity)):c.hasLinearVelocity=!1,r.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(r.angularVelocity)):c.hasAngularVelocity=!1));l!==null&&(s=e.getPose(t.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(l.matrix.fromArray(s.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,s.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(s.linearVelocity)):l.hasLinearVelocity=!1,s.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(s.angularVelocity)):l.hasAngularVelocity=!1,this.dispatchEvent(HM)))}return l!==null&&(l.visible=s!==null),c!==null&&(c.visible=r!==null),h!==null&&(h.visible=a!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const n=new De;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}}const WM=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,XM=`
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

}`;class qM{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e,n){if(this.texture===null){const s=new $e,r=t.properties.get(s);r.__webglTexture=e.texture,(e.depthNear!=n.depthNear||e.depthFar!=n.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=s}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,n=new we({vertexShader:WM,fragmentShader:XM,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new Ft(new js(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class jM extends Xs{constructor(t,e){super();const n=this;let s=null,r=1,a=null,l="local-floor",c=1,h=null,d=null,p=null,m=null,y=null,M=null;const b=new qM,v=e.getContextAttributes();let f=null,D=null;const I=[],C=[],z=new Mt;let N=null;const E=new cn;E.viewport=new ve;const S=new cn;S.viewport=new ve;const g=[E,S],_=new GM;let w=null,L=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Z){let st=I[Z];return st===void 0&&(st=new Ya,I[Z]=st),st.getTargetRaySpace()},this.getControllerGrip=function(Z){let st=I[Z];return st===void 0&&(st=new Ya,I[Z]=st),st.getGripSpace()},this.getHand=function(Z){let st=I[Z];return st===void 0&&(st=new Ya,I[Z]=st),st.getHandSpace()};function T(Z){const st=C.indexOf(Z.inputSource);if(st===-1)return;const At=I[st];At!==void 0&&(At.update(Z.inputSource,Z.frame,h||a),At.dispatchEvent({type:Z.type,data:Z.inputSource}))}function K(){s.removeEventListener("select",T),s.removeEventListener("selectstart",T),s.removeEventListener("selectend",T),s.removeEventListener("squeeze",T),s.removeEventListener("squeezestart",T),s.removeEventListener("squeezeend",T),s.removeEventListener("end",K),s.removeEventListener("inputsourceschange",Q);for(let Z=0;Z<I.length;Z++){const st=C[Z];st!==null&&(C[Z]=null,I[Z].disconnect(st))}w=null,L=null,b.reset(),t.setRenderTarget(f),y=null,m=null,p=null,s=null,D=null,kt.stop(),n.isPresenting=!1,t.setPixelRatio(N),t.setSize(z.width,z.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Z){r=Z,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Z){l=Z,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return h||a},this.setReferenceSpace=function(Z){h=Z},this.getBaseLayer=function(){return m!==null?m:y},this.getBinding=function(){return p},this.getFrame=function(){return M},this.getSession=function(){return s},this.setSession=async function(Z){if(s=Z,s!==null){if(f=t.getRenderTarget(),s.addEventListener("select",T),s.addEventListener("selectstart",T),s.addEventListener("selectend",T),s.addEventListener("squeeze",T),s.addEventListener("squeezestart",T),s.addEventListener("squeezeend",T),s.addEventListener("end",K),s.addEventListener("inputsourceschange",Q),v.xrCompatible!==!0&&await e.makeXRCompatible(),N=t.getPixelRatio(),t.getSize(z),s.renderState.layers===void 0){const st={antialias:v.antialias,alpha:!0,depth:v.depth,stencil:v.stencil,framebufferScaleFactor:r};y=new XRWebGLLayer(s,e,st),s.updateRenderState({baseLayer:y}),t.setPixelRatio(1),t.setSize(y.framebufferWidth,y.framebufferHeight,!1),D=new Rn(y.framebufferWidth,y.framebufferHeight,{format:An,type:ri,colorSpace:t.outputColorSpace,stencilBuffer:v.stencil})}else{let st=null,At=null,ct=null;v.depth&&(ct=v.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,st=v.stencil?Vs:Ls,At=v.stencil?zs:Ki);const Ut={colorFormat:e.RGBA8,depthFormat:ct,scaleFactor:r};p=new XRWebGLBinding(s,e),m=p.createProjectionLayer(Ut),s.updateRenderState({layers:[m]}),t.setPixelRatio(1),t.setSize(m.textureWidth,m.textureHeight,!1),D=new Rn(m.textureWidth,m.textureHeight,{format:An,type:ri,depthTexture:new bf(m.textureWidth,m.textureHeight,At,void 0,void 0,void 0,void 0,void 0,void 0,st),stencilBuffer:v.stencil,colorSpace:t.outputColorSpace,samples:v.antialias?4:0,resolveDepthBuffer:m.ignoreDepthValues===!1})}D.isXRRenderTarget=!0,this.setFoveation(c),h=null,a=await s.requestReferenceSpace(l),kt.setContext(s),kt.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return b.getDepthTexture()};function Q(Z){for(let st=0;st<Z.removed.length;st++){const At=Z.removed[st],ct=C.indexOf(At);ct>=0&&(C[ct]=null,I[ct].disconnect(At))}for(let st=0;st<Z.added.length;st++){const At=Z.added[st];let ct=C.indexOf(At);if(ct===-1){for(let zt=0;zt<I.length;zt++)if(zt>=C.length){C.push(At),ct=zt;break}else if(C[zt]===null){C[zt]=At,ct=zt;break}if(ct===-1)break}const Ut=I[ct];Ut&&Ut.connect(At)}}const J=new O,nt=new O;function $(Z,st,At){J.setFromMatrixPosition(st.matrixWorld),nt.setFromMatrixPosition(At.matrixWorld);const ct=J.distanceTo(nt),Ut=st.projectionMatrix.elements,zt=At.projectionMatrix.elements,Gt=Ut[14]/(Ut[10]-1),pe=Ut[14]/(Ut[10]+1),qt=(Ut[9]+1)/Ut[5],Ee=(Ut[9]-1)/Ut[5],V=(Ut[8]-1)/Ut[0],Ve=(zt[8]+1)/zt[0],jt=Gt*V,$t=Gt*Ve,It=ct/(-V+Ve),me=It*-V;if(st.matrixWorld.decompose(Z.position,Z.quaternion,Z.scale),Z.translateX(me),Z.translateZ(It),Z.matrixWorld.compose(Z.position,Z.quaternion,Z.scale),Z.matrixWorldInverse.copy(Z.matrixWorld).invert(),Ut[10]===-1)Z.projectionMatrix.copy(st.projectionMatrix),Z.projectionMatrixInverse.copy(st.projectionMatrixInverse);else{const Pt=Gt+It,U=pe+It,A=jt-me,H=$t+(ct-me),tt=qt*pe/U*Pt,it=Ee*pe/U*Pt;Z.projectionMatrix.makePerspective(A,H,tt,it,Pt,U),Z.projectionMatrixInverse.copy(Z.projectionMatrix).invert()}}function ut(Z,st){st===null?Z.matrixWorld.copy(Z.matrix):Z.matrixWorld.multiplyMatrices(st.matrixWorld,Z.matrix),Z.matrixWorldInverse.copy(Z.matrixWorld).invert()}this.updateCamera=function(Z){if(s===null)return;let st=Z.near,At=Z.far;b.texture!==null&&(b.depthNear>0&&(st=b.depthNear),b.depthFar>0&&(At=b.depthFar)),_.near=S.near=E.near=st,_.far=S.far=E.far=At,(w!==_.near||L!==_.far)&&(s.updateRenderState({depthNear:_.near,depthFar:_.far}),w=_.near,L=_.far),E.layers.mask=Z.layers.mask|2,S.layers.mask=Z.layers.mask|4,_.layers.mask=E.layers.mask|S.layers.mask;const ct=Z.parent,Ut=_.cameras;ut(_,ct);for(let zt=0;zt<Ut.length;zt++)ut(Ut[zt],ct);Ut.length===2?$(_,E,S):_.projectionMatrix.copy(E.projectionMatrix),vt(Z,_,ct)};function vt(Z,st,At){At===null?Z.matrix.copy(st.matrixWorld):(Z.matrix.copy(At.matrixWorld),Z.matrix.invert(),Z.matrix.multiply(st.matrixWorld)),Z.matrix.decompose(Z.position,Z.quaternion,Z.scale),Z.updateMatrixWorld(!0),Z.projectionMatrix.copy(st.projectionMatrix),Z.projectionMatrixInverse.copy(st.projectionMatrixInverse),Z.isPerspectiveCamera&&(Z.fov=Ar*2*Math.atan(1/Z.projectionMatrix.elements[5]),Z.zoom=1)}this.getCamera=function(){return _},this.getFoveation=function(){if(!(m===null&&y===null))return c},this.setFoveation=function(Z){c=Z,m!==null&&(m.fixedFoveation=Z),y!==null&&y.fixedFoveation!==void 0&&(y.fixedFoveation=Z)},this.hasDepthSensing=function(){return b.texture!==null},this.getDepthSensingMesh=function(){return b.getMesh(_)};let Rt=null;function Bt(Z,st){if(d=st.getViewerPose(h||a),M=st,d!==null){const At=d.views;y!==null&&(t.setRenderTargetFramebuffer(D,y.framebuffer),t.setRenderTarget(D));let ct=!1;At.length!==_.cameras.length&&(_.cameras.length=0,ct=!0);for(let zt=0;zt<At.length;zt++){const Gt=At[zt];let pe=null;if(y!==null)pe=y.getViewport(Gt);else{const Ee=p.getViewSubImage(m,Gt);pe=Ee.viewport,zt===0&&(t.setRenderTargetTextures(D,Ee.colorTexture,m.ignoreDepthValues?void 0:Ee.depthStencilTexture),t.setRenderTarget(D))}let qt=g[zt];qt===void 0&&(qt=new cn,qt.layers.enable(zt),qt.viewport=new ve,g[zt]=qt),qt.matrix.fromArray(Gt.transform.matrix),qt.matrix.decompose(qt.position,qt.quaternion,qt.scale),qt.projectionMatrix.fromArray(Gt.projectionMatrix),qt.projectionMatrixInverse.copy(qt.projectionMatrix).invert(),qt.viewport.set(pe.x,pe.y,pe.width,pe.height),zt===0&&(_.matrix.copy(qt.matrix),_.matrix.decompose(_.position,_.quaternion,_.scale)),ct===!0&&_.cameras.push(qt)}const Ut=s.enabledFeatures;if(Ut&&Ut.includes("depth-sensing")){const zt=p.getDepthInformation(At[0]);zt&&zt.isValid&&zt.texture&&b.init(t,zt,s.renderState)}}for(let At=0;At<I.length;At++){const ct=C[At],Ut=I[At];ct!==null&&Ut!==void 0&&Ut.update(ct,st,h||a)}Rt&&Rt(Z,st),st.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:st}),M=null}const kt=new Ef;kt.setAnimationLoop(Bt),this.setAnimationLoop=function(Z){Rt=Z},this.dispose=function(){}}}const Ui=new In,$M=new le;function YM(i,t){function e(v,f){v.matrixAutoUpdate===!0&&v.updateMatrix(),f.value.copy(v.matrix)}function n(v,f){f.color.getRGB(v.fogColor.value,Mf(i)),f.isFog?(v.fogNear.value=f.near,v.fogFar.value=f.far):f.isFogExp2&&(v.fogDensity.value=f.density)}function s(v,f,D,I,C){f.isMeshBasicMaterial||f.isMeshLambertMaterial?r(v,f):f.isMeshToonMaterial?(r(v,f),p(v,f)):f.isMeshPhongMaterial?(r(v,f),d(v,f)):f.isMeshStandardMaterial?(r(v,f),m(v,f),f.isMeshPhysicalMaterial&&y(v,f,C)):f.isMeshMatcapMaterial?(r(v,f),M(v,f)):f.isMeshDepthMaterial?r(v,f):f.isMeshDistanceMaterial?(r(v,f),b(v,f)):f.isMeshNormalMaterial?r(v,f):f.isLineBasicMaterial?(a(v,f),f.isLineDashedMaterial&&l(v,f)):f.isPointsMaterial?c(v,f,D,I):f.isSpriteMaterial?h(v,f):f.isShadowMaterial?(v.color.value.copy(f.color),v.opacity.value=f.opacity):f.isShaderMaterial&&(f.uniformsNeedUpdate=!1)}function r(v,f){v.opacity.value=f.opacity,f.color&&v.diffuse.value.copy(f.color),f.emissive&&v.emissive.value.copy(f.emissive).multiplyScalar(f.emissiveIntensity),f.map&&(v.map.value=f.map,e(f.map,v.mapTransform)),f.alphaMap&&(v.alphaMap.value=f.alphaMap,e(f.alphaMap,v.alphaMapTransform)),f.bumpMap&&(v.bumpMap.value=f.bumpMap,e(f.bumpMap,v.bumpMapTransform),v.bumpScale.value=f.bumpScale,f.side===Qe&&(v.bumpScale.value*=-1)),f.normalMap&&(v.normalMap.value=f.normalMap,e(f.normalMap,v.normalMapTransform),v.normalScale.value.copy(f.normalScale),f.side===Qe&&v.normalScale.value.negate()),f.displacementMap&&(v.displacementMap.value=f.displacementMap,e(f.displacementMap,v.displacementMapTransform),v.displacementScale.value=f.displacementScale,v.displacementBias.value=f.displacementBias),f.emissiveMap&&(v.emissiveMap.value=f.emissiveMap,e(f.emissiveMap,v.emissiveMapTransform)),f.specularMap&&(v.specularMap.value=f.specularMap,e(f.specularMap,v.specularMapTransform)),f.alphaTest>0&&(v.alphaTest.value=f.alphaTest);const D=t.get(f),I=D.envMap,C=D.envMapRotation;I&&(v.envMap.value=I,Ui.copy(C),Ui.x*=-1,Ui.y*=-1,Ui.z*=-1,I.isCubeTexture&&I.isRenderTargetTexture===!1&&(Ui.y*=-1,Ui.z*=-1),v.envMapRotation.value.setFromMatrix4($M.makeRotationFromEuler(Ui)),v.flipEnvMap.value=I.isCubeTexture&&I.isRenderTargetTexture===!1?-1:1,v.reflectivity.value=f.reflectivity,v.ior.value=f.ior,v.refractionRatio.value=f.refractionRatio),f.lightMap&&(v.lightMap.value=f.lightMap,v.lightMapIntensity.value=f.lightMapIntensity,e(f.lightMap,v.lightMapTransform)),f.aoMap&&(v.aoMap.value=f.aoMap,v.aoMapIntensity.value=f.aoMapIntensity,e(f.aoMap,v.aoMapTransform))}function a(v,f){v.diffuse.value.copy(f.color),v.opacity.value=f.opacity,f.map&&(v.map.value=f.map,e(f.map,v.mapTransform))}function l(v,f){v.dashSize.value=f.dashSize,v.totalSize.value=f.dashSize+f.gapSize,v.scale.value=f.scale}function c(v,f,D,I){v.diffuse.value.copy(f.color),v.opacity.value=f.opacity,v.size.value=f.size*D,v.scale.value=I*.5,f.map&&(v.map.value=f.map,e(f.map,v.uvTransform)),f.alphaMap&&(v.alphaMap.value=f.alphaMap,e(f.alphaMap,v.alphaMapTransform)),f.alphaTest>0&&(v.alphaTest.value=f.alphaTest)}function h(v,f){v.diffuse.value.copy(f.color),v.opacity.value=f.opacity,v.rotation.value=f.rotation,f.map&&(v.map.value=f.map,e(f.map,v.mapTransform)),f.alphaMap&&(v.alphaMap.value=f.alphaMap,e(f.alphaMap,v.alphaMapTransform)),f.alphaTest>0&&(v.alphaTest.value=f.alphaTest)}function d(v,f){v.specular.value.copy(f.specular),v.shininess.value=Math.max(f.shininess,1e-4)}function p(v,f){f.gradientMap&&(v.gradientMap.value=f.gradientMap)}function m(v,f){v.metalness.value=f.metalness,f.metalnessMap&&(v.metalnessMap.value=f.metalnessMap,e(f.metalnessMap,v.metalnessMapTransform)),v.roughness.value=f.roughness,f.roughnessMap&&(v.roughnessMap.value=f.roughnessMap,e(f.roughnessMap,v.roughnessMapTransform)),f.envMap&&(v.envMapIntensity.value=f.envMapIntensity)}function y(v,f,D){v.ior.value=f.ior,f.sheen>0&&(v.sheenColor.value.copy(f.sheenColor).multiplyScalar(f.sheen),v.sheenRoughness.value=f.sheenRoughness,f.sheenColorMap&&(v.sheenColorMap.value=f.sheenColorMap,e(f.sheenColorMap,v.sheenColorMapTransform)),f.sheenRoughnessMap&&(v.sheenRoughnessMap.value=f.sheenRoughnessMap,e(f.sheenRoughnessMap,v.sheenRoughnessMapTransform))),f.clearcoat>0&&(v.clearcoat.value=f.clearcoat,v.clearcoatRoughness.value=f.clearcoatRoughness,f.clearcoatMap&&(v.clearcoatMap.value=f.clearcoatMap,e(f.clearcoatMap,v.clearcoatMapTransform)),f.clearcoatRoughnessMap&&(v.clearcoatRoughnessMap.value=f.clearcoatRoughnessMap,e(f.clearcoatRoughnessMap,v.clearcoatRoughnessMapTransform)),f.clearcoatNormalMap&&(v.clearcoatNormalMap.value=f.clearcoatNormalMap,e(f.clearcoatNormalMap,v.clearcoatNormalMapTransform),v.clearcoatNormalScale.value.copy(f.clearcoatNormalScale),f.side===Qe&&v.clearcoatNormalScale.value.negate())),f.dispersion>0&&(v.dispersion.value=f.dispersion),f.iridescence>0&&(v.iridescence.value=f.iridescence,v.iridescenceIOR.value=f.iridescenceIOR,v.iridescenceThicknessMinimum.value=f.iridescenceThicknessRange[0],v.iridescenceThicknessMaximum.value=f.iridescenceThicknessRange[1],f.iridescenceMap&&(v.iridescenceMap.value=f.iridescenceMap,e(f.iridescenceMap,v.iridescenceMapTransform)),f.iridescenceThicknessMap&&(v.iridescenceThicknessMap.value=f.iridescenceThicknessMap,e(f.iridescenceThicknessMap,v.iridescenceThicknessMapTransform))),f.transmission>0&&(v.transmission.value=f.transmission,v.transmissionSamplerMap.value=D.texture,v.transmissionSamplerSize.value.set(D.width,D.height),f.transmissionMap&&(v.transmissionMap.value=f.transmissionMap,e(f.transmissionMap,v.transmissionMapTransform)),v.thickness.value=f.thickness,f.thicknessMap&&(v.thicknessMap.value=f.thicknessMap,e(f.thicknessMap,v.thicknessMapTransform)),v.attenuationDistance.value=f.attenuationDistance,v.attenuationColor.value.copy(f.attenuationColor)),f.anisotropy>0&&(v.anisotropyVector.value.set(f.anisotropy*Math.cos(f.anisotropyRotation),f.anisotropy*Math.sin(f.anisotropyRotation)),f.anisotropyMap&&(v.anisotropyMap.value=f.anisotropyMap,e(f.anisotropyMap,v.anisotropyMapTransform))),v.specularIntensity.value=f.specularIntensity,v.specularColor.value.copy(f.specularColor),f.specularColorMap&&(v.specularColorMap.value=f.specularColorMap,e(f.specularColorMap,v.specularColorMapTransform)),f.specularIntensityMap&&(v.specularIntensityMap.value=f.specularIntensityMap,e(f.specularIntensityMap,v.specularIntensityMapTransform))}function M(v,f){f.matcap&&(v.matcap.value=f.matcap)}function b(v,f){const D=t.get(f).light;v.referencePosition.value.setFromMatrixPosition(D.matrixWorld),v.nearDistance.value=D.shadow.camera.near,v.farDistance.value=D.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function KM(i,t,e,n){let s={},r={},a=[];const l=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function c(D,I){const C=I.program;n.uniformBlockBinding(D,C)}function h(D,I){let C=s[D.id];C===void 0&&(M(D),C=d(D),s[D.id]=C,D.addEventListener("dispose",v));const z=I.program;n.updateUBOMapping(D,z);const N=t.render.frame;r[D.id]!==N&&(m(D),r[D.id]=N)}function d(D){const I=p();D.__bindingPointIndex=I;const C=i.createBuffer(),z=D.__size,N=D.usage;return i.bindBuffer(i.UNIFORM_BUFFER,C),i.bufferData(i.UNIFORM_BUFFER,z,N),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,I,C),C}function p(){for(let D=0;D<l;D++)if(a.indexOf(D)===-1)return a.push(D),D;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function m(D){const I=s[D.id],C=D.uniforms,z=D.__cache;i.bindBuffer(i.UNIFORM_BUFFER,I);for(let N=0,E=C.length;N<E;N++){const S=Array.isArray(C[N])?C[N]:[C[N]];for(let g=0,_=S.length;g<_;g++){const w=S[g];if(y(w,N,g,z)===!0){const L=w.__offset,T=Array.isArray(w.value)?w.value:[w.value];let K=0;for(let Q=0;Q<T.length;Q++){const J=T[Q],nt=b(J);typeof J=="number"||typeof J=="boolean"?(w.__data[0]=J,i.bufferSubData(i.UNIFORM_BUFFER,L+K,w.__data)):J.isMatrix3?(w.__data[0]=J.elements[0],w.__data[1]=J.elements[1],w.__data[2]=J.elements[2],w.__data[3]=0,w.__data[4]=J.elements[3],w.__data[5]=J.elements[4],w.__data[6]=J.elements[5],w.__data[7]=0,w.__data[8]=J.elements[6],w.__data[9]=J.elements[7],w.__data[10]=J.elements[8],w.__data[11]=0):(J.toArray(w.__data,K),K+=nt.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,L,w.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function y(D,I,C,z){const N=D.value,E=I+"_"+C;if(z[E]===void 0)return typeof N=="number"||typeof N=="boolean"?z[E]=N:z[E]=N.clone(),!0;{const S=z[E];if(typeof N=="number"||typeof N=="boolean"){if(S!==N)return z[E]=N,!0}else if(S.equals(N)===!1)return S.copy(N),!0}return!1}function M(D){const I=D.uniforms;let C=0;const z=16;for(let E=0,S=I.length;E<S;E++){const g=Array.isArray(I[E])?I[E]:[I[E]];for(let _=0,w=g.length;_<w;_++){const L=g[_],T=Array.isArray(L.value)?L.value:[L.value];for(let K=0,Q=T.length;K<Q;K++){const J=T[K],nt=b(J),$=C%z,ut=$%nt.boundary,vt=$+ut;C+=ut,vt!==0&&z-vt<nt.storage&&(C+=z-vt),L.__data=new Float32Array(nt.storage/Float32Array.BYTES_PER_ELEMENT),L.__offset=C,C+=nt.storage}}}const N=C%z;return N>0&&(C+=z-N),D.__size=C,D.__cache={},this}function b(D){const I={boundary:0,storage:0};return typeof D=="number"||typeof D=="boolean"?(I.boundary=4,I.storage=4):D.isVector2?(I.boundary=8,I.storage=8):D.isVector3||D.isColor?(I.boundary=16,I.storage=12):D.isVector4?(I.boundary=16,I.storage=16):D.isMatrix3?(I.boundary=48,I.storage=48):D.isMatrix4?(I.boundary=64,I.storage=64):D.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",D),I}function v(D){const I=D.target;I.removeEventListener("dispose",v);const C=a.indexOf(I.__bindingPointIndex);a.splice(C,1),i.deleteBuffer(s[I.id]),delete s[I.id],delete r[I.id]}function f(){for(const D in s)i.deleteBuffer(s[D]);a=[],s={},r={}}return{bind:c,update:h,dispose:f}}class JM{constructor(t={}){const{canvas:e=z0(),context:n=null,depth:s=!0,stencil:r=!1,alpha:a=!1,antialias:l=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:h=!1,powerPreference:d="default",failIfMajorPerformanceCaveat:p=!1,reverseDepthBuffer:m=!1}=t;this.isWebGLRenderer=!0;let y;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");y=n.getContextAttributes().alpha}else y=a;const M=new Uint32Array(4),b=new Int32Array(4);let v=null,f=null;const D=[],I=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=ln,this.toneMapping=Ei,this.toneMappingExposure=1;const C=this;let z=!1,N=0,E=0,S=null,g=-1,_=null;const w=new ve,L=new ve;let T=null;const K=new bt(0);let Q=0,J=e.width,nt=e.height,$=1,ut=null,vt=null;const Rt=new ve(0,0,J,nt),Bt=new ve(0,0,J,nt);let kt=!1;const Z=new xc;let st=!1,At=!1;const ct=new le,Ut=new le,zt=new O,Gt=new ve,pe={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let qt=!1;function Ee(){return S===null?$:1}let V=n;function Ve(R,B){return e.getContext(R,B)}try{const R={alpha:!0,depth:s,stencil:r,antialias:l,premultipliedAlpha:c,preserveDrawingBuffer:h,powerPreference:d,failIfMajorPerformanceCaveat:p};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${lc}`),e.addEventListener("webglcontextlost",et,!1),e.addEventListener("webglcontextrestored",mt,!1),e.addEventListener("webglcontextcreationerror",lt,!1),V===null){const B="webgl2";if(V=Ve(B,R),V===null)throw Ve(B)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(R){throw console.error("THREE.WebGLRenderer: "+R.message),R}let jt,$t,It,me,Pt,U,A,H,tt,it,Y,gt,ht,yt,Yt,rt,_t,Dt,Ot,xt,Kt,Ht,ae,F;function pt(){jt=new nx(V),jt.init(),Ht=new VM(V,jt),$t=new Ky(V,jt,t,Ht),It=new BM(V,jt),$t.reverseDepthBuffer&&m&&It.buffers.depth.setReversed(!0),me=new rx(V),Pt=new EM,U=new zM(V,jt,It,Pt,$t,Ht,me),A=new Zy(C),H=new ex(C),tt=new d_(V),ae=new $y(V,tt),it=new ix(V,tt,me,ae),Y=new ax(V,it,tt,me),Ot=new ox(V,$t,U),rt=new Jy(Pt),gt=new SM(C,A,H,jt,$t,ae,rt),ht=new YM(C,Pt),yt=new wM,Yt=new IM(jt),Dt=new jy(C,A,H,It,Y,y,c),_t=new OM(C,Y,$t),F=new KM(V,me,$t,It),xt=new Yy(V,jt,me),Kt=new sx(V,jt,me),me.programs=gt.programs,C.capabilities=$t,C.extensions=jt,C.properties=Pt,C.renderLists=yt,C.shadowMap=_t,C.state=It,C.info=me}pt();const j=new jM(C,V);this.xr=j,this.getContext=function(){return V},this.getContextAttributes=function(){return V.getContextAttributes()},this.forceContextLoss=function(){const R=jt.get("WEBGL_lose_context");R&&R.loseContext()},this.forceContextRestore=function(){const R=jt.get("WEBGL_lose_context");R&&R.restoreContext()},this.getPixelRatio=function(){return $},this.setPixelRatio=function(R){R!==void 0&&($=R,this.setSize(J,nt,!1))},this.getSize=function(R){return R.set(J,nt)},this.setSize=function(R,B,W=!0){if(j.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}J=R,nt=B,e.width=Math.floor(R*$),e.height=Math.floor(B*$),W===!0&&(e.style.width=R+"px",e.style.height=B+"px"),this.setViewport(0,0,R,B)},this.getDrawingBufferSize=function(R){return R.set(J*$,nt*$).floor()},this.setDrawingBufferSize=function(R,B,W){J=R,nt=B,$=W,e.width=Math.floor(R*W),e.height=Math.floor(B*W),this.setViewport(0,0,R,B)},this.getCurrentViewport=function(R){return R.copy(w)},this.getViewport=function(R){return R.copy(Rt)},this.setViewport=function(R,B,W,X){R.isVector4?Rt.set(R.x,R.y,R.z,R.w):Rt.set(R,B,W,X),It.viewport(w.copy(Rt).multiplyScalar($).round())},this.getScissor=function(R){return R.copy(Bt)},this.setScissor=function(R,B,W,X){R.isVector4?Bt.set(R.x,R.y,R.z,R.w):Bt.set(R,B,W,X),It.scissor(L.copy(Bt).multiplyScalar($).round())},this.getScissorTest=function(){return kt},this.setScissorTest=function(R){It.setScissorTest(kt=R)},this.setOpaqueSort=function(R){ut=R},this.setTransparentSort=function(R){vt=R},this.getClearColor=function(R){return R.copy(Dt.getClearColor())},this.setClearColor=function(){Dt.setClearColor.apply(Dt,arguments)},this.getClearAlpha=function(){return Dt.getClearAlpha()},this.setClearAlpha=function(){Dt.setClearAlpha.apply(Dt,arguments)},this.clear=function(R=!0,B=!0,W=!0){let X=0;if(R){let k=!1;if(S!==null){const ot=S.texture.format;k=ot===gc||ot===mc||ot===pc}if(k){const ot=S.texture.type,dt=ot===ri||ot===Ki||ot===Tr||ot===zs||ot===uc||ot===dc,wt=Dt.getClearColor(),St=Dt.getClearAlpha(),Lt=wt.r,Nt=wt.g,Et=wt.b;dt?(M[0]=Lt,M[1]=Nt,M[2]=Et,M[3]=St,V.clearBufferuiv(V.COLOR,0,M)):(b[0]=Lt,b[1]=Nt,b[2]=Et,b[3]=St,V.clearBufferiv(V.COLOR,0,b))}else X|=V.COLOR_BUFFER_BIT}B&&(X|=V.DEPTH_BUFFER_BIT),W&&(X|=V.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),V.clear(X)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",et,!1),e.removeEventListener("webglcontextrestored",mt,!1),e.removeEventListener("webglcontextcreationerror",lt,!1),yt.dispose(),Yt.dispose(),Pt.dispose(),A.dispose(),H.dispose(),Y.dispose(),ae.dispose(),F.dispose(),gt.dispose(),j.dispose(),j.removeEventListener("sessionstart",Ks),j.removeEventListener("sessionend",ai),en.stop()};function et(R){R.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),z=!0}function mt(){console.log("THREE.WebGLRenderer: Context Restored."),z=!1;const R=me.autoReset,B=_t.enabled,W=_t.autoUpdate,X=_t.needsUpdate,k=_t.type;pt(),me.autoReset=R,_t.enabled=B,_t.autoUpdate=W,_t.needsUpdate=X,_t.type=k}function lt(R){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",R.statusMessage)}function Vt(R){const B=R.target;B.removeEventListener("dispose",Vt),Se(B)}function Se(R){Le(R),Pt.remove(R)}function Le(R){const B=Pt.get(R).programs;B!==void 0&&(B.forEach(function(W){gt.releaseProgram(W)}),R.isShaderMaterial&&gt.releaseShaderCache(R))}this.renderBufferDirect=function(R,B,W,X,k,ot){B===null&&(B=pe);const dt=k.isMesh&&k.matrixWorld.determinant()<0,wt=ns(R,B,W,X,k);It.setMaterial(X,dt);let St=W.index,Lt=1;if(X.wireframe===!0){if(St=it.getWireframeAttribute(W),St===void 0)return;Lt=2}const Nt=W.drawRange,Et=W.attributes.position;let Zt=Nt.start*Lt,ce=(Nt.start+Nt.count)*Lt;ot!==null&&(Zt=Math.max(Zt,ot.start*Lt),ce=Math.min(ce,(ot.start+ot.count)*Lt)),St!==null?(Zt=Math.max(Zt,0),ce=Math.min(ce,St.count)):Et!=null&&(Zt=Math.max(Zt,0),ce=Math.min(ce,Et.count));const ge=ce-Zt;if(ge<0||ge===1/0)return;ae.setup(k,X,wt,W,St);let Be,Qt=xt;if(St!==null&&(Be=tt.get(St),Qt=Kt,Qt.setIndex(Be)),k.isMesh)X.wireframe===!0?(It.setLineWidth(X.wireframeLinewidth*Ee()),Qt.setMode(V.LINES)):Qt.setMode(V.TRIANGLES);else if(k.isLine){let Tt=X.linewidth;Tt===void 0&&(Tt=1),It.setLineWidth(Tt*Ee()),k.isLineSegments?Qt.setMode(V.LINES):k.isLineLoop?Qt.setMode(V.LINE_LOOP):Qt.setMode(V.LINE_STRIP)}else k.isPoints?Qt.setMode(V.POINTS):k.isSprite&&Qt.setMode(V.TRIANGLES);if(k.isBatchedMesh)if(k._multiDrawInstances!==null)Qt.renderMultiDrawInstances(k._multiDrawStarts,k._multiDrawCounts,k._multiDrawCount,k._multiDrawInstances);else if(jt.get("WEBGL_multi_draw"))Qt.renderMultiDraw(k._multiDrawStarts,k._multiDrawCounts,k._multiDrawCount);else{const Tt=k._multiDrawStarts,un=k._multiDrawCounts,ne=k._multiDrawCount,nn=St?tt.get(St).bytesPerElement:1,ci=Pt.get(X).currentProgram.getUniforms();for(let Ge=0;Ge<ne;Ge++)ci.setValue(V,"_gl_DrawID",Ge),Qt.render(Tt[Ge]/nn,un[Ge])}else if(k.isInstancedMesh)Qt.renderInstances(Zt,ge,k.count);else if(W.isInstancedBufferGeometry){const Tt=W._maxInstanceCount!==void 0?W._maxInstanceCount:1/0,un=Math.min(W.instanceCount,Tt);Qt.renderInstances(Zt,ge,un)}else Qt.render(Zt,ge)};function Jt(R,B,W){R.transparent===!0&&R.side===Ze&&R.forceSinglePass===!1?(R.side=Qe,R.needsUpdate=!0,li(R,B,W),R.side=bi,R.needsUpdate=!0,li(R,B,W),R.side=Ze):li(R,B,W)}this.compile=function(R,B,W=null){W===null&&(W=R),f=Yt.get(W),f.init(B),I.push(f),W.traverseVisible(function(k){k.isLight&&k.layers.test(B.layers)&&(f.pushLight(k),k.castShadow&&f.pushShadow(k))}),R!==W&&R.traverseVisible(function(k){k.isLight&&k.layers.test(B.layers)&&(f.pushLight(k),k.castShadow&&f.pushShadow(k))}),f.setupLights();const X=new Set;return R.traverse(function(k){if(!(k.isMesh||k.isPoints||k.isLine||k.isSprite))return;const ot=k.material;if(ot)if(Array.isArray(ot))for(let dt=0;dt<ot.length;dt++){const wt=ot[dt];Jt(wt,W,k),X.add(wt)}else Jt(ot,W,k),X.add(ot)}),I.pop(),f=null,X},this.compileAsync=function(R,B,W=null){const X=this.compile(R,B,W);return new Promise(k=>{function ot(){if(X.forEach(function(dt){Pt.get(dt).currentProgram.isReady()&&X.delete(dt)}),X.size===0){k(R);return}setTimeout(ot,10)}jt.get("KHR_parallel_shader_compile")!==null?ot():setTimeout(ot,10)})};let tn=null;function be(R){tn&&tn(R)}function Ks(){en.stop()}function ai(){en.start()}const en=new Ef;en.setAnimationLoop(be),typeof self<"u"&&en.setContext(self),this.setAnimationLoop=function(R){tn=R,j.setAnimationLoop(R),R===null?en.stop():en.start()},j.addEventListener("sessionstart",Ks),j.addEventListener("sessionend",ai),this.render=function(R,B){if(B!==void 0&&B.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(z===!0)return;if(R.matrixWorldAutoUpdate===!0&&R.updateMatrixWorld(),B.parent===null&&B.matrixWorldAutoUpdate===!0&&B.updateMatrixWorld(),j.enabled===!0&&j.isPresenting===!0&&(j.cameraAutoUpdate===!0&&j.updateCamera(B),B=j.getCamera()),R.isScene===!0&&R.onBeforeRender(C,R,B,S),f=Yt.get(R,I.length),f.init(B),I.push(f),Ut.multiplyMatrices(B.projectionMatrix,B.matrixWorldInverse),Z.setFromProjectionMatrix(Ut),At=this.localClippingEnabled,st=rt.init(this.clippingPlanes,At),v=yt.get(R,D.length),v.init(),D.push(v),j.enabled===!0&&j.isPresenting===!0){const ot=C.xr.getDepthSensingMesh();ot!==null&&Js(ot,B,-1/0,C.sortObjects)}Js(R,B,0,C.sortObjects),v.finish(),C.sortObjects===!0&&v.sort(ut,vt),qt=j.enabled===!1||j.isPresenting===!1||j.hasDepthSensing()===!1,qt&&Dt.addToRenderList(v,R),this.info.render.frame++,st===!0&&rt.beginShadows();const W=f.state.shadowsArray;_t.render(W,R,B),st===!0&&rt.endShadows(),this.info.autoReset===!0&&this.info.reset();const X=v.opaque,k=v.transmissive;if(f.setupLights(),B.isArrayCamera){const ot=B.cameras;if(k.length>0)for(let dt=0,wt=ot.length;dt<wt;dt++){const St=ot[dt];Hn(X,k,R,St)}qt&&Dt.render(R);for(let dt=0,wt=ot.length;dt<wt;dt++){const St=ot[dt];Ur(v,R,St,St.viewport)}}else k.length>0&&Hn(X,k,R,B),qt&&Dt.render(R),Ur(v,R,B);S!==null&&(U.updateMultisampleRenderTarget(S),U.updateRenderTargetMipmap(S)),R.isScene===!0&&R.onAfterRender(C,R,B),ae.resetDefaultState(),g=-1,_=null,I.pop(),I.length>0?(f=I[I.length-1],st===!0&&rt.setGlobalState(C.clippingPlanes,f.state.camera)):f=null,D.pop(),D.length>0?v=D[D.length-1]:v=null};function Js(R,B,W,X){if(R.visible===!1)return;if(R.layers.test(B.layers)){if(R.isGroup)W=R.renderOrder;else if(R.isLOD)R.autoUpdate===!0&&R.update(B);else if(R.isLight)f.pushLight(R),R.castShadow&&f.pushShadow(R);else if(R.isSprite){if(!R.frustumCulled||Z.intersectsSprite(R)){X&&Gt.setFromMatrixPosition(R.matrixWorld).applyMatrix4(Ut);const dt=Y.update(R),wt=R.material;wt.visible&&v.push(R,dt,wt,W,Gt.z,null)}}else if((R.isMesh||R.isLine||R.isPoints)&&(!R.frustumCulled||Z.intersectsObject(R))){const dt=Y.update(R),wt=R.material;if(X&&(R.boundingSphere!==void 0?(R.boundingSphere===null&&R.computeBoundingSphere(),Gt.copy(R.boundingSphere.center)):(dt.boundingSphere===null&&dt.computeBoundingSphere(),Gt.copy(dt.boundingSphere.center)),Gt.applyMatrix4(R.matrixWorld).applyMatrix4(Ut)),Array.isArray(wt)){const St=dt.groups;for(let Lt=0,Nt=St.length;Lt<Nt;Lt++){const Et=St[Lt],Zt=wt[Et.materialIndex];Zt&&Zt.visible&&v.push(R,dt,Zt,W,Gt.z,Et)}}else wt.visible&&v.push(R,dt,wt,W,Gt.z,null)}}const ot=R.children;for(let dt=0,wt=ot.length;dt<wt;dt++)Js(ot[dt],B,W,X)}function Ur(R,B,W,X){const k=R.opaque,ot=R.transmissive,dt=R.transparent;f.setupLightsView(W),st===!0&&rt.setGlobalState(C.clippingPlanes,W),X&&It.viewport(w.copy(X)),k.length>0&&ts(k,B,W),ot.length>0&&ts(ot,B,W),dt.length>0&&ts(dt,B,W),It.buffers.depth.setTest(!0),It.buffers.depth.setMask(!0),It.buffers.color.setMask(!0),It.setPolygonOffset(!1)}function Hn(R,B,W,X){if((W.isScene===!0?W.overrideMaterial:null)!==null)return;f.state.transmissionRenderTarget[X.id]===void 0&&(f.state.transmissionRenderTarget[X.id]=new Rn(1,1,{generateMipmaps:!0,type:jt.has("EXT_color_buffer_half_float")||jt.has("EXT_color_buffer_float")?ei:ri,minFilter:Xi,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:ee.workingColorSpace}));const ot=f.state.transmissionRenderTarget[X.id],dt=X.viewport||w;ot.setSize(dt.z,dt.w);const wt=C.getRenderTarget();C.setRenderTarget(ot),C.getClearColor(K),Q=C.getClearAlpha(),Q<1&&C.setClearColor(16777215,.5),C.clear(),qt&&Dt.render(W);const St=C.toneMapping;C.toneMapping=Ei;const Lt=X.viewport;if(X.viewport!==void 0&&(X.viewport=void 0),f.setupLightsView(X),st===!0&&rt.setGlobalState(C.clippingPlanes,X),ts(R,W,X),U.updateMultisampleRenderTarget(ot),U.updateRenderTargetMipmap(ot),jt.has("WEBGL_multisampled_render_to_texture")===!1){let Nt=!1;for(let Et=0,Zt=B.length;Et<Zt;Et++){const ce=B[Et],ge=ce.object,Be=ce.geometry,Qt=ce.material,Tt=ce.group;if(Qt.side===Ze&&ge.layers.test(X.layers)){const un=Qt.side;Qt.side=Qe,Qt.needsUpdate=!0,Nr(ge,W,X,Be,Qt,Tt),Qt.side=un,Qt.needsUpdate=!0,Nt=!0}}Nt===!0&&(U.updateMultisampleRenderTarget(ot),U.updateRenderTargetMipmap(ot))}C.setRenderTarget(wt),C.setClearColor(K,Q),Lt!==void 0&&(X.viewport=Lt),C.toneMapping=St}function ts(R,B,W){const X=B.isScene===!0?B.overrideMaterial:null;for(let k=0,ot=R.length;k<ot;k++){const dt=R[k],wt=dt.object,St=dt.geometry,Lt=X===null?dt.material:X,Nt=dt.group;wt.layers.test(W.layers)&&Nr(wt,B,W,St,Lt,Nt)}}function Nr(R,B,W,X,k,ot){R.onBeforeRender(C,B,W,X,k,ot),R.modelViewMatrix.multiplyMatrices(W.matrixWorldInverse,R.matrixWorld),R.normalMatrix.getNormalMatrix(R.modelViewMatrix),k.onBeforeRender(C,B,W,X,R,ot),k.transparent===!0&&k.side===Ze&&k.forceSinglePass===!1?(k.side=Qe,k.needsUpdate=!0,C.renderBufferDirect(W,B,X,k,R,ot),k.side=bi,k.needsUpdate=!0,C.renderBufferDirect(W,B,X,k,R,ot),k.side=Ze):C.renderBufferDirect(W,B,X,k,R,ot),R.onAfterRender(C,B,W,X,k,ot)}function li(R,B,W){B.isScene!==!0&&(B=pe);const X=Pt.get(R),k=f.state.lights,ot=f.state.shadowsArray,dt=k.state.version,wt=gt.getParameters(R,k.state,ot,B,W),St=gt.getProgramCacheKey(wt);let Lt=X.programs;X.environment=R.isMeshStandardMaterial?B.environment:null,X.fog=B.fog,X.envMap=(R.isMeshStandardMaterial?H:A).get(R.envMap||X.environment),X.envMapRotation=X.environment!==null&&R.envMap===null?B.environmentRotation:R.envMapRotation,Lt===void 0&&(R.addEventListener("dispose",Vt),Lt=new Map,X.programs=Lt);let Nt=Lt.get(St);if(Nt!==void 0){if(X.currentProgram===Nt&&X.lightsStateVersion===dt)return es(R,wt),Nt}else wt.uniforms=gt.getUniforms(R),R.onBeforeCompile(wt,C),Nt=gt.acquireProgram(wt,St),Lt.set(St,Nt),X.uniforms=wt.uniforms;const Et=X.uniforms;return(!R.isShaderMaterial&&!R.isRawShaderMaterial||R.clipping===!0)&&(Et.clippingPlanes=rt.uniform),es(R,wt),X.needsLights=Fr(R),X.lightsStateVersion=dt,X.needsLights&&(Et.ambientLightColor.value=k.state.ambient,Et.lightProbe.value=k.state.probe,Et.directionalLights.value=k.state.directional,Et.directionalLightShadows.value=k.state.directionalShadow,Et.spotLights.value=k.state.spot,Et.spotLightShadows.value=k.state.spotShadow,Et.rectAreaLights.value=k.state.rectArea,Et.ltc_1.value=k.state.rectAreaLTC1,Et.ltc_2.value=k.state.rectAreaLTC2,Et.pointLights.value=k.state.point,Et.pointLightShadows.value=k.state.pointShadow,Et.hemisphereLights.value=k.state.hemi,Et.directionalShadowMap.value=k.state.directionalShadowMap,Et.directionalShadowMatrix.value=k.state.directionalShadowMatrix,Et.spotShadowMap.value=k.state.spotShadowMap,Et.spotLightMatrix.value=k.state.spotLightMatrix,Et.spotLightMap.value=k.state.spotLightMap,Et.pointShadowMap.value=k.state.pointShadowMap,Et.pointShadowMatrix.value=k.state.pointShadowMatrix),X.currentProgram=Nt,X.uniformsList=null,Nt}function Or(R){if(R.uniformsList===null){const B=R.currentProgram.getUniforms();R.uniformsList=Oo.seqWithValue(B.seq,R.uniforms)}return R.uniformsList}function es(R,B){const W=Pt.get(R);W.outputColorSpace=B.outputColorSpace,W.batching=B.batching,W.batchingColor=B.batchingColor,W.instancing=B.instancing,W.instancingColor=B.instancingColor,W.instancingMorph=B.instancingMorph,W.skinning=B.skinning,W.morphTargets=B.morphTargets,W.morphNormals=B.morphNormals,W.morphColors=B.morphColors,W.morphTargetsCount=B.morphTargetsCount,W.numClippingPlanes=B.numClippingPlanes,W.numIntersection=B.numClipIntersection,W.vertexAlphas=B.vertexAlphas,W.vertexTangents=B.vertexTangents,W.toneMapping=B.toneMapping}function ns(R,B,W,X,k){B.isScene!==!0&&(B=pe),U.resetTextureUnits();const ot=B.fog,dt=X.isMeshStandardMaterial?B.environment:null,wt=S===null?C.outputColorSpace:S.isXRRenderTarget===!0?S.texture.colorSpace:Ws,St=(X.isMeshStandardMaterial?H:A).get(X.envMap||dt),Lt=X.vertexColors===!0&&!!W.attributes.color&&W.attributes.color.itemSize===4,Nt=!!W.attributes.tangent&&(!!X.normalMap||X.anisotropy>0),Et=!!W.morphAttributes.position,Zt=!!W.morphAttributes.normal,ce=!!W.morphAttributes.color;let ge=Ei;X.toneMapped&&(S===null||S.isXRRenderTarget===!0)&&(ge=C.toneMapping);const Be=W.morphAttributes.position||W.morphAttributes.normal||W.morphAttributes.color,Qt=Be!==void 0?Be.length:0,Tt=Pt.get(X),un=f.state.lights;if(st===!0&&(At===!0||R!==_)){const ke=R===_&&X.id===g;rt.setState(X,R,ke)}let ne=!1;X.version===Tt.__version?(Tt.needsLights&&Tt.lightsStateVersion!==un.state.version||Tt.outputColorSpace!==wt||k.isBatchedMesh&&Tt.batching===!1||!k.isBatchedMesh&&Tt.batching===!0||k.isBatchedMesh&&Tt.batchingColor===!0&&k.colorTexture===null||k.isBatchedMesh&&Tt.batchingColor===!1&&k.colorTexture!==null||k.isInstancedMesh&&Tt.instancing===!1||!k.isInstancedMesh&&Tt.instancing===!0||k.isSkinnedMesh&&Tt.skinning===!1||!k.isSkinnedMesh&&Tt.skinning===!0||k.isInstancedMesh&&Tt.instancingColor===!0&&k.instanceColor===null||k.isInstancedMesh&&Tt.instancingColor===!1&&k.instanceColor!==null||k.isInstancedMesh&&Tt.instancingMorph===!0&&k.morphTexture===null||k.isInstancedMesh&&Tt.instancingMorph===!1&&k.morphTexture!==null||Tt.envMap!==St||X.fog===!0&&Tt.fog!==ot||Tt.numClippingPlanes!==void 0&&(Tt.numClippingPlanes!==rt.numPlanes||Tt.numIntersection!==rt.numIntersection)||Tt.vertexAlphas!==Lt||Tt.vertexTangents!==Nt||Tt.morphTargets!==Et||Tt.morphNormals!==Zt||Tt.morphColors!==ce||Tt.toneMapping!==ge||Tt.morphTargetsCount!==Qt)&&(ne=!0):(ne=!0,Tt.__version=X.version);let nn=Tt.currentProgram;ne===!0&&(nn=li(X,B,k));let ci=!1,Ge=!1,hi=!1;const xe=nn.getUniforms(),Oe=Tt.uniforms;if(It.useProgram(nn.program)&&(ci=!0,Ge=!0,hi=!0),X.id!==g&&(g=X.id,Ge=!0),ci||_!==R){It.buffers.depth.getReversed()?(ct.copy(R.projectionMatrix),G0(ct),H0(ct),xe.setValue(V,"projectionMatrix",ct)):xe.setValue(V,"projectionMatrix",R.projectionMatrix),xe.setValue(V,"viewMatrix",R.matrixWorldInverse);const sn=xe.map.cameraPosition;sn!==void 0&&sn.setValue(V,zt.setFromMatrixPosition(R.matrixWorld)),$t.logarithmicDepthBuffer&&xe.setValue(V,"logDepthBufFC",2/(Math.log(R.far+1)/Math.LN2)),(X.isMeshPhongMaterial||X.isMeshToonMaterial||X.isMeshLambertMaterial||X.isMeshBasicMaterial||X.isMeshStandardMaterial||X.isShaderMaterial)&&xe.setValue(V,"isOrthographic",R.isOrthographicCamera===!0),_!==R&&(_=R,Ge=!0,hi=!0)}if(k.isSkinnedMesh){xe.setOptional(V,k,"bindMatrix"),xe.setOptional(V,k,"bindMatrixInverse");const ke=k.skeleton;ke&&(ke.boneTexture===null&&ke.computeBoneTexture(),xe.setValue(V,"boneTexture",ke.boneTexture,U))}k.isBatchedMesh&&(xe.setOptional(V,k,"batchingTexture"),xe.setValue(V,"batchingTexture",k._matricesTexture,U),xe.setOptional(V,k,"batchingIdTexture"),xe.setValue(V,"batchingIdTexture",k._indirectTexture,U),xe.setOptional(V,k,"batchingColorTexture"),k._colorsTexture!==null&&xe.setValue(V,"batchingColorTexture",k._colorsTexture,U));const Ye=W.morphAttributes;if((Ye.position!==void 0||Ye.normal!==void 0||Ye.color!==void 0)&&Ot.update(k,W,nn),(Ge||Tt.receiveShadow!==k.receiveShadow)&&(Tt.receiveShadow=k.receiveShadow,xe.setValue(V,"receiveShadow",k.receiveShadow)),X.isMeshGouraudMaterial&&X.envMap!==null&&(Oe.envMap.value=St,Oe.flipEnvMap.value=St.isCubeTexture&&St.isRenderTargetTexture===!1?-1:1),X.isMeshStandardMaterial&&X.envMap===null&&B.environment!==null&&(Oe.envMapIntensity.value=B.environmentIntensity),Ge&&(xe.setValue(V,"toneMappingExposure",C.toneMappingExposure),Tt.needsLights&&Dn(Oe,hi),ot&&X.fog===!0&&ht.refreshFogUniforms(Oe,ot),ht.refreshMaterialUniforms(Oe,X,$,nt,f.state.transmissionRenderTarget[R.id]),Oo.upload(V,Or(Tt),Oe,U)),X.isShaderMaterial&&X.uniformsNeedUpdate===!0&&(Oo.upload(V,Or(Tt),Oe,U),X.uniformsNeedUpdate=!1),X.isSpriteMaterial&&xe.setValue(V,"center",k.center),xe.setValue(V,"modelViewMatrix",k.modelViewMatrix),xe.setValue(V,"normalMatrix",k.normalMatrix),xe.setValue(V,"modelMatrix",k.matrixWorld),X.isShaderMaterial||X.isRawShaderMaterial){const ke=X.uniformsGroups;for(let sn=0,yn=ke.length;sn<yn;sn++){const _e=ke[sn];F.update(_e,nn),F.bind(_e,nn)}}return nn}function Dn(R,B){R.ambientLightColor.needsUpdate=B,R.lightProbe.needsUpdate=B,R.directionalLights.needsUpdate=B,R.directionalLightShadows.needsUpdate=B,R.pointLights.needsUpdate=B,R.pointLightShadows.needsUpdate=B,R.spotLights.needsUpdate=B,R.spotLightShadows.needsUpdate=B,R.rectAreaLights.needsUpdate=B,R.hemisphereLights.needsUpdate=B}function Fr(R){return R.isMeshLambertMaterial||R.isMeshToonMaterial||R.isMeshPhongMaterial||R.isMeshStandardMaterial||R.isShadowMaterial||R.isShaderMaterial&&R.lights===!0}this.getActiveCubeFace=function(){return N},this.getActiveMipmapLevel=function(){return E},this.getRenderTarget=function(){return S},this.setRenderTargetTextures=function(R,B,W){Pt.get(R.texture).__webglTexture=B,Pt.get(R.depthTexture).__webglTexture=W;const X=Pt.get(R);X.__hasExternalTextures=!0,X.__autoAllocateDepthBuffer=W===void 0,X.__autoAllocateDepthBuffer||jt.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),X.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(R,B){const W=Pt.get(R);W.__webglFramebuffer=B,W.__useDefaultFramebuffer=B===void 0},this.setRenderTarget=function(R,B=0,W=0){S=R,N=B,E=W;let X=!0,k=null,ot=!1,dt=!1;if(R){const St=Pt.get(R);if(St.__useDefaultFramebuffer!==void 0)It.bindFramebuffer(V.FRAMEBUFFER,null),X=!1;else if(St.__webglFramebuffer===void 0)U.setupRenderTarget(R);else if(St.__hasExternalTextures)U.rebindTextures(R,Pt.get(R.texture).__webglTexture,Pt.get(R.depthTexture).__webglTexture);else if(R.depthBuffer){const Et=R.depthTexture;if(St.__boundDepthTexture!==Et){if(Et!==null&&Pt.has(Et)&&(R.width!==Et.image.width||R.height!==Et.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");U.setupDepthRenderbuffer(R)}}const Lt=R.texture;(Lt.isData3DTexture||Lt.isDataArrayTexture||Lt.isCompressedArrayTexture)&&(dt=!0);const Nt=Pt.get(R).__webglFramebuffer;R.isWebGLCubeRenderTarget?(Array.isArray(Nt[B])?k=Nt[B][W]:k=Nt[B],ot=!0):R.samples>0&&U.useMultisampledRTT(R)===!1?k=Pt.get(R).__webglMultisampledFramebuffer:Array.isArray(Nt)?k=Nt[W]:k=Nt,w.copy(R.viewport),L.copy(R.scissor),T=R.scissorTest}else w.copy(Rt).multiplyScalar($).floor(),L.copy(Bt).multiplyScalar($).floor(),T=kt;if(It.bindFramebuffer(V.FRAMEBUFFER,k)&&X&&It.drawBuffers(R,k),It.viewport(w),It.scissor(L),It.setScissorTest(T),ot){const St=Pt.get(R.texture);V.framebufferTexture2D(V.FRAMEBUFFER,V.COLOR_ATTACHMENT0,V.TEXTURE_CUBE_MAP_POSITIVE_X+B,St.__webglTexture,W)}else if(dt){const St=Pt.get(R.texture),Lt=B||0;V.framebufferTextureLayer(V.FRAMEBUFFER,V.COLOR_ATTACHMENT0,St.__webglTexture,W||0,Lt)}g=-1},this.readRenderTargetPixels=function(R,B,W,X,k,ot,dt){if(!(R&&R.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let wt=Pt.get(R).__webglFramebuffer;if(R.isWebGLCubeRenderTarget&&dt!==void 0&&(wt=wt[dt]),wt){It.bindFramebuffer(V.FRAMEBUFFER,wt);try{const St=R.texture,Lt=St.format,Nt=St.type;if(!$t.textureFormatReadable(Lt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!$t.textureTypeReadable(Nt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}B>=0&&B<=R.width-X&&W>=0&&W<=R.height-k&&V.readPixels(B,W,X,k,Ht.convert(Lt),Ht.convert(Nt),ot)}finally{const St=S!==null?Pt.get(S).__webglFramebuffer:null;It.bindFramebuffer(V.FRAMEBUFFER,St)}}},this.readRenderTargetPixelsAsync=async function(R,B,W,X,k,ot,dt){if(!(R&&R.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let wt=Pt.get(R).__webglFramebuffer;if(R.isWebGLCubeRenderTarget&&dt!==void 0&&(wt=wt[dt]),wt){const St=R.texture,Lt=St.format,Nt=St.type;if(!$t.textureFormatReadable(Lt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!$t.textureTypeReadable(Nt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(B>=0&&B<=R.width-X&&W>=0&&W<=R.height-k){It.bindFramebuffer(V.FRAMEBUFFER,wt);const Et=V.createBuffer();V.bindBuffer(V.PIXEL_PACK_BUFFER,Et),V.bufferData(V.PIXEL_PACK_BUFFER,ot.byteLength,V.STREAM_READ),V.readPixels(B,W,X,k,Ht.convert(Lt),Ht.convert(Nt),0);const Zt=S!==null?Pt.get(S).__webglFramebuffer:null;It.bindFramebuffer(V.FRAMEBUFFER,Zt);const ce=V.fenceSync(V.SYNC_GPU_COMMANDS_COMPLETE,0);return V.flush(),await V0(V,ce,4),V.bindBuffer(V.PIXEL_PACK_BUFFER,Et),V.getBufferSubData(V.PIXEL_PACK_BUFFER,0,ot),V.deleteBuffer(Et),V.deleteSync(ce),ot}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(R,B=null,W=0){R.isTexture!==!0&&(gr("WebGLRenderer: copyFramebufferToTexture function signature has changed."),B=arguments[0]||null,R=arguments[1]);const X=Math.pow(2,-W),k=Math.floor(R.image.width*X),ot=Math.floor(R.image.height*X),dt=B!==null?B.x:0,wt=B!==null?B.y:0;U.setTexture2D(R,0),V.copyTexSubImage2D(V.TEXTURE_2D,W,0,0,dt,wt,k,ot),It.unbindTexture()},this.copyTextureToTexture=function(R,B,W=null,X=null,k=0){R.isTexture!==!0&&(gr("WebGLRenderer: copyTextureToTexture function signature has changed."),X=arguments[0]||null,R=arguments[1],B=arguments[2],k=arguments[3]||0,W=null);let ot,dt,wt,St,Lt,Nt,Et,Zt,ce;const ge=R.isCompressedTexture?R.mipmaps[k]:R.image;W!==null?(ot=W.max.x-W.min.x,dt=W.max.y-W.min.y,wt=W.isBox3?W.max.z-W.min.z:1,St=W.min.x,Lt=W.min.y,Nt=W.isBox3?W.min.z:0):(ot=ge.width,dt=ge.height,wt=ge.depth||1,St=0,Lt=0,Nt=0),X!==null?(Et=X.x,Zt=X.y,ce=X.z):(Et=0,Zt=0,ce=0);const Be=Ht.convert(B.format),Qt=Ht.convert(B.type);let Tt;B.isData3DTexture?(U.setTexture3D(B,0),Tt=V.TEXTURE_3D):B.isDataArrayTexture||B.isCompressedArrayTexture?(U.setTexture2DArray(B,0),Tt=V.TEXTURE_2D_ARRAY):(U.setTexture2D(B,0),Tt=V.TEXTURE_2D),V.pixelStorei(V.UNPACK_FLIP_Y_WEBGL,B.flipY),V.pixelStorei(V.UNPACK_PREMULTIPLY_ALPHA_WEBGL,B.premultiplyAlpha),V.pixelStorei(V.UNPACK_ALIGNMENT,B.unpackAlignment);const un=V.getParameter(V.UNPACK_ROW_LENGTH),ne=V.getParameter(V.UNPACK_IMAGE_HEIGHT),nn=V.getParameter(V.UNPACK_SKIP_PIXELS),ci=V.getParameter(V.UNPACK_SKIP_ROWS),Ge=V.getParameter(V.UNPACK_SKIP_IMAGES);V.pixelStorei(V.UNPACK_ROW_LENGTH,ge.width),V.pixelStorei(V.UNPACK_IMAGE_HEIGHT,ge.height),V.pixelStorei(V.UNPACK_SKIP_PIXELS,St),V.pixelStorei(V.UNPACK_SKIP_ROWS,Lt),V.pixelStorei(V.UNPACK_SKIP_IMAGES,Nt);const hi=R.isDataArrayTexture||R.isData3DTexture,xe=B.isDataArrayTexture||B.isData3DTexture;if(R.isRenderTargetTexture||R.isDepthTexture){const Oe=Pt.get(R),Ye=Pt.get(B),ke=Pt.get(Oe.__renderTarget),sn=Pt.get(Ye.__renderTarget);It.bindFramebuffer(V.READ_FRAMEBUFFER,ke.__webglFramebuffer),It.bindFramebuffer(V.DRAW_FRAMEBUFFER,sn.__webglFramebuffer);for(let yn=0;yn<wt;yn++)hi&&V.framebufferTextureLayer(V.READ_FRAMEBUFFER,V.COLOR_ATTACHMENT0,Pt.get(R).__webglTexture,k,Nt+yn),R.isDepthTexture?(xe&&V.framebufferTextureLayer(V.DRAW_FRAMEBUFFER,V.COLOR_ATTACHMENT0,Pt.get(B).__webglTexture,k,ce+yn),V.blitFramebuffer(St,Lt,ot,dt,Et,Zt,ot,dt,V.DEPTH_BUFFER_BIT,V.NEAREST)):xe?V.copyTexSubImage3D(Tt,k,Et,Zt,ce+yn,St,Lt,ot,dt):V.copyTexSubImage2D(Tt,k,Et,Zt,ce+yn,St,Lt,ot,dt);It.bindFramebuffer(V.READ_FRAMEBUFFER,null),It.bindFramebuffer(V.DRAW_FRAMEBUFFER,null)}else xe?R.isDataTexture||R.isData3DTexture?V.texSubImage3D(Tt,k,Et,Zt,ce,ot,dt,wt,Be,Qt,ge.data):B.isCompressedArrayTexture?V.compressedTexSubImage3D(Tt,k,Et,Zt,ce,ot,dt,wt,Be,ge.data):V.texSubImage3D(Tt,k,Et,Zt,ce,ot,dt,wt,Be,Qt,ge):R.isDataTexture?V.texSubImage2D(V.TEXTURE_2D,k,Et,Zt,ot,dt,Be,Qt,ge.data):R.isCompressedTexture?V.compressedTexSubImage2D(V.TEXTURE_2D,k,Et,Zt,ge.width,ge.height,Be,ge.data):V.texSubImage2D(V.TEXTURE_2D,k,Et,Zt,ot,dt,Be,Qt,ge);V.pixelStorei(V.UNPACK_ROW_LENGTH,un),V.pixelStorei(V.UNPACK_IMAGE_HEIGHT,ne),V.pixelStorei(V.UNPACK_SKIP_PIXELS,nn),V.pixelStorei(V.UNPACK_SKIP_ROWS,ci),V.pixelStorei(V.UNPACK_SKIP_IMAGES,Ge),k===0&&B.generateMipmaps&&V.generateMipmap(Tt),It.unbindTexture()},this.copyTextureToTexture3D=function(R,B,W=null,X=null,k=0){return R.isTexture!==!0&&(gr("WebGLRenderer: copyTextureToTexture3D function signature has changed."),W=arguments[0]||null,X=arguments[1]||null,R=arguments[2],B=arguments[3],k=arguments[4]||0),gr('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(R,B,W,X,k)},this.initRenderTarget=function(R){Pt.get(R).__webglFramebuffer===void 0&&U.setupRenderTarget(R)},this.initTexture=function(R){R.isCubeTexture?U.setTextureCube(R,0):R.isData3DTexture?U.setTexture3D(R,0):R.isDataArrayTexture||R.isCompressedArrayTexture?U.setTexture2DArray(R,0):U.setTexture2D(R,0),It.unbindTexture()},this.resetState=function(){N=0,E=0,S=null,It.reset(),ae.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Qn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorspace=ee._getDrawingBufferColorSpace(t),e.unpackColorSpace=ee._getUnpackColorSpace()}}class Ec{constructor(t,e=25e-5){this.isFogExp2=!0,this.name="",this.color=new bt(t),this.density=e}clone(){return new Ec(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}}class ZM extends Te{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new In,this.environmentIntensity=1,this.environmentRotation=new In,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}class QM{constructor(t,e){this.isInterleavedBuffer=!0,this.array=t,this.stride=e,this.count=t!==void 0?t.length/e:0,this.usage=jl,this.updateRanges=[],this.version=0,this.uuid=ni()}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.array=new t.array.constructor(t.array),this.count=t.count,this.stride=t.stride,this.usage=t.usage,this}copyAt(t,e,n){t*=this.stride,n*=e.stride;for(let s=0,r=this.stride;s<r;s++)this.array[t+s]=e.array[n+s];return this}set(t,e=0){return this.array.set(t,e),this}clone(t){t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=ni()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const e=new this.array.constructor(t.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(e,this.stride);return n.setUsage(this.usage),n}onUpload(t){return this.onUploadCallback=t,this}toJSON(t){return t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=ni()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const Ke=new O;class jo{constructor(t,e,n,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=t,this.itemSize=e,this.offset=n,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(t){this.data.needsUpdate=t}applyMatrix4(t){for(let e=0,n=this.data.count;e<n;e++)Ke.fromBufferAttribute(this,e),Ke.applyMatrix4(t),this.setXYZ(e,Ke.x,Ke.y,Ke.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)Ke.fromBufferAttribute(this,e),Ke.applyNormalMatrix(t),this.setXYZ(e,Ke.x,Ke.y,Ke.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)Ke.fromBufferAttribute(this,e),Ke.transformDirection(t),this.setXYZ(e,Ke.x,Ke.y,Ke.z);return this}getComponent(t,e){let n=this.array[t*this.data.stride+this.offset+e];return this.normalized&&(n=wn(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=ue(n,this.array)),this.data.array[t*this.data.stride+this.offset+e]=n,this}setX(t,e){return this.normalized&&(e=ue(e,this.array)),this.data.array[t*this.data.stride+this.offset]=e,this}setY(t,e){return this.normalized&&(e=ue(e,this.array)),this.data.array[t*this.data.stride+this.offset+1]=e,this}setZ(t,e){return this.normalized&&(e=ue(e,this.array)),this.data.array[t*this.data.stride+this.offset+2]=e,this}setW(t,e){return this.normalized&&(e=ue(e,this.array)),this.data.array[t*this.data.stride+this.offset+3]=e,this}getX(t){let e=this.data.array[t*this.data.stride+this.offset];return this.normalized&&(e=wn(e,this.array)),e}getY(t){let e=this.data.array[t*this.data.stride+this.offset+1];return this.normalized&&(e=wn(e,this.array)),e}getZ(t){let e=this.data.array[t*this.data.stride+this.offset+2];return this.normalized&&(e=wn(e,this.array)),e}getW(t){let e=this.data.array[t*this.data.stride+this.offset+3];return this.normalized&&(e=wn(e,this.array)),e}setXY(t,e,n){return t=t*this.data.stride+this.offset,this.normalized&&(e=ue(e,this.array),n=ue(n,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this}setXYZ(t,e,n,s){return t=t*this.data.stride+this.offset,this.normalized&&(e=ue(e,this.array),n=ue(n,this.array),s=ue(s,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t=t*this.data.stride+this.offset,this.normalized&&(e=ue(e,this.array),n=ue(n,this.array),s=ue(s,this.array),r=ue(r,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=s,this.data.array[t+3]=r,this}clone(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let n=0;n<this.count;n++){const s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[s+r])}return new Ce(new this.array.constructor(e),this.itemSize,this.normalized)}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new jo(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let n=0;n<this.count;n++){const s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[s+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:e,normalized:this.normalized}}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.toJSON(t)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class ra extends Ti{static get type(){return"SpriteMaterial"}constructor(t){super(),this.isSpriteMaterial=!0,this.color=new bt(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.rotation=t.rotation,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}let xs;const cr=new O,Ms=new O,Ss=new O,Es=new Mt,hr=new Mt,Rf=new le,vo=new O,ur=new O,yo=new O,zu=new Mt,Ka=new Mt,Vu=new Mt;class bc extends Te{constructor(t=new ra){if(super(),this.isSprite=!0,this.type="Sprite",xs===void 0){xs=new Re;const e=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new QM(e,5);xs.setIndex([0,1,2,0,2,3]),xs.setAttribute("position",new jo(n,3,0,!1)),xs.setAttribute("uv",new jo(n,2,3,!1))}this.geometry=xs,this.material=t,this.center=new Mt(.5,.5)}raycast(t,e){t.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),Ms.setFromMatrixScale(this.matrixWorld),Rf.copy(t.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(t.camera.matrixWorldInverse,this.matrixWorld),Ss.setFromMatrixPosition(this.modelViewMatrix),t.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&Ms.multiplyScalar(-Ss.z);const n=this.material.rotation;let s,r;n!==0&&(r=Math.cos(n),s=Math.sin(n));const a=this.center;xo(vo.set(-.5,-.5,0),Ss,a,Ms,s,r),xo(ur.set(.5,-.5,0),Ss,a,Ms,s,r),xo(yo.set(.5,.5,0),Ss,a,Ms,s,r),zu.set(0,0),Ka.set(1,0),Vu.set(1,1);let l=t.ray.intersectTriangle(vo,ur,yo,!1,cr);if(l===null&&(xo(ur.set(-.5,.5,0),Ss,a,Ms,s,r),Ka.set(0,1),l=t.ray.intersectTriangle(vo,yo,ur,!1,cr),l===null))return;const c=t.ray.origin.distanceTo(cr);c<t.near||c>t.far||e.push({distance:c,point:cr.clone(),uv:mn.getInterpolation(cr,vo,ur,yo,zu,Ka,Vu,new Mt),face:null,object:this})}copy(t,e){return super.copy(t,e),t.center!==void 0&&this.center.copy(t.center),this.material=t.material,this}}function xo(i,t,e,n,s,r){Es.subVectors(i,e).addScalar(.5).multiply(n),s!==void 0?(hr.x=r*Es.x-s*Es.y,hr.y=s*Es.x+r*Es.y):hr.copy(Es),i.copy(t),i.x+=hr.x,i.y+=hr.y,i.applyMatrix4(Rf)}class tS extends $e{constructor(t=null,e=1,n=1,s,r,a,l,c,h=hn,d=hn,p,m){super(null,a,l,c,h,d,s,r,p,m),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Gu extends Ce{constructor(t,e,n,s=1){super(t,e,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){const t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}}const bs=new le,Hu=new le,Mo=[],Wu=new Zi,eS=new le,dr=new Ft,fr=new Qi;class nS extends Ft{constructor(t,e,n){super(t,e),this.isInstancedMesh=!0,this.instanceMatrix=new Gu(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<n;s++)this.setMatrixAt(s,eS)}computeBoundingBox(){const t=this.geometry,e=this.count;this.boundingBox===null&&(this.boundingBox=new Zi),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,bs),Wu.copy(t.boundingBox).applyMatrix4(bs),this.boundingBox.union(Wu)}computeBoundingSphere(){const t=this.geometry,e=this.count;this.boundingSphere===null&&(this.boundingSphere=new Qi),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,bs),fr.copy(t.boundingSphere).applyMatrix4(bs),this.boundingSphere.union(fr)}copy(t,e){return super.copy(t,e),this.instanceMatrix.copy(t.instanceMatrix),t.morphTexture!==null&&(this.morphTexture=t.morphTexture.clone()),t.instanceColor!==null&&(this.instanceColor=t.instanceColor.clone()),this.count=t.count,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}getColorAt(t,e){e.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,e){e.fromArray(this.instanceMatrix.array,t*16)}getMorphAt(t,e){const n=e.morphTargetInfluences,s=this.morphTexture.source.data.data,r=n.length+1,a=t*r+1;for(let l=0;l<n.length;l++)n[l]=s[a+l]}raycast(t,e){const n=this.matrixWorld,s=this.count;if(dr.geometry=this.geometry,dr.material=this.material,dr.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),fr.copy(this.boundingSphere),fr.applyMatrix4(n),t.ray.intersectsSphere(fr)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,bs),Hu.multiplyMatrices(n,bs),dr.matrixWorld=Hu,dr.raycast(t,Mo);for(let a=0,l=Mo.length;a<l;a++){const c=Mo[a];c.instanceId=r,c.object=this,e.push(c)}Mo.length=0}}setColorAt(t,e){this.instanceColor===null&&(this.instanceColor=new Gu(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),e.toArray(this.instanceColor.array,t*3)}setMatrixAt(t,e){e.toArray(this.instanceMatrix.array,t*16)}setMorphAt(t,e){const n=e.morphTargetInfluences,s=n.length+1;this.morphTexture===null&&(this.morphTexture=new tS(new Float32Array(s*this.count),s,this.count,fc,kn));const r=this.morphTexture.source.data.data;let a=0;for(let h=0;h<n.length;h++)a+=n[h];const l=this.geometry.morphTargetsRelative?1:1-a,c=s*t;r[c]=l,r.set(n,c+1)}updateMorphTargets(){}dispose(){return this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null),this}}class wc extends Ti{static get type(){return"LineBasicMaterial"}constructor(t){super(),this.isLineBasicMaterial=!0,this.color=new bt(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}}const $o=new O,Yo=new O,Xu=new le,pr=new na,So=new Qi,Ja=new O,qu=new O;class Pf extends Te{constructor(t=new Re,e=new wc){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,n=[0];for(let s=1,r=e.count;s<r;s++)$o.fromBufferAttribute(e,s-1),Yo.fromBufferAttribute(e,s),n[s]=n[s-1],n[s]+=$o.distanceTo(Yo);t.setAttribute("lineDistance",new ye(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,e){const n=this.geometry,s=this.matrixWorld,r=t.params.Line.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),So.copy(n.boundingSphere),So.applyMatrix4(s),So.radius+=r,t.ray.intersectsSphere(So)===!1)return;Xu.copy(s).invert(),pr.copy(t.ray).applyMatrix4(Xu);const l=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=l*l,h=this.isLineSegments?2:1,d=n.index,m=n.attributes.position;if(d!==null){const y=Math.max(0,a.start),M=Math.min(d.count,a.start+a.count);for(let b=y,v=M-1;b<v;b+=h){const f=d.getX(b),D=d.getX(b+1),I=Eo(this,t,pr,c,f,D);I&&e.push(I)}if(this.isLineLoop){const b=d.getX(M-1),v=d.getX(y),f=Eo(this,t,pr,c,b,v);f&&e.push(f)}}else{const y=Math.max(0,a.start),M=Math.min(m.count,a.start+a.count);for(let b=y,v=M-1;b<v;b+=h){const f=Eo(this,t,pr,c,b,b+1);f&&e.push(f)}if(this.isLineLoop){const b=Eo(this,t,pr,c,M-1,y);b&&e.push(b)}}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const l=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[l]=r}}}}}function Eo(i,t,e,n,s,r){const a=i.geometry.attributes.position;if($o.fromBufferAttribute(a,s),Yo.fromBufferAttribute(a,r),e.distanceSqToSegment($o,Yo,Ja,qu)>n)return;Ja.applyMatrix4(i.matrixWorld);const c=t.ray.origin.distanceTo(Ja);if(!(c<t.near||c>t.far))return{distance:c,point:qu.clone().applyMatrix4(i.matrixWorld),index:s,face:null,faceIndex:null,barycoord:null,object:i}}class iS extends Ti{static get type(){return"PointsMaterial"}constructor(t){super(),this.isPointsMaterial=!0,this.color=new bt(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.size=t.size,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}const ju=new le,Yl=new na,bo=new Qi,wo=new O;class If extends Te{constructor(t=new Re,e=new iS){super(),this.isPoints=!0,this.type="Points",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}raycast(t,e){const n=this.geometry,s=this.matrixWorld,r=t.params.Points.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),bo.copy(n.boundingSphere),bo.applyMatrix4(s),bo.radius+=r,t.ray.intersectsSphere(bo)===!1)return;ju.copy(s).invert(),Yl.copy(t.ray).applyMatrix4(ju);const l=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=l*l,h=n.index,p=n.attributes.position;if(h!==null){const m=Math.max(0,a.start),y=Math.min(h.count,a.start+a.count);for(let M=m,b=y;M<b;M++){const v=h.getX(M);wo.fromBufferAttribute(p,v),$u(wo,v,c,s,t,e,this)}}else{const m=Math.max(0,a.start),y=Math.min(p.count,a.start+a.count);for(let M=m,b=y;M<b;M++)wo.fromBufferAttribute(p,M),$u(wo,M,c,s,t,e,this)}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const l=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[l]=r}}}}}function $u(i,t,e,n,s,r,a){const l=Yl.distanceSqToPoint(i);if(l<e){const c=new O;Yl.closestPointToPoint(i,c),c.applyMatrix4(n);const h=s.ray.origin.distanceTo(c);if(h<s.near||h>s.far)return;r.push({distance:h,distanceToRay:Math.sqrt(l),point:c,index:t,face:null,faceIndex:null,barycoord:null,object:a})}}class Tc extends $e{constructor(t,e,n,s,r,a,l,c,h){super(t,e,n,s,r,a,l,c,h),this.isCanvasTexture=!0,this.needsUpdate=!0}}class Dr extends Re{constructor(t=1,e=32,n=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:n,thetaLength:s},e=Math.max(3,e);const r=[],a=[],l=[],c=[],h=new O,d=new Mt;a.push(0,0,0),l.push(0,0,1),c.push(.5,.5);for(let p=0,m=3;p<=e;p++,m+=3){const y=n+p/e*s;h.x=t*Math.cos(y),h.y=t*Math.sin(y),a.push(h.x,h.y,h.z),l.push(0,0,1),d.x=(a[m]/t+1)/2,d.y=(a[m+1]/t+1)/2,c.push(d.x,d.y)}for(let p=1;p<=e;p++)r.push(p,p+1,0);this.setIndex(r),this.setAttribute("position",new ye(a,3)),this.setAttribute("normal",new ye(l,3)),this.setAttribute("uv",new ye(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Dr(t.radius,t.segments,t.thetaStart,t.thetaLength)}}class Vn extends Re{constructor(t=1,e=1,n=1,s=32,r=1,a=!1,l=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:s,heightSegments:r,openEnded:a,thetaStart:l,thetaLength:c};const h=this;s=Math.floor(s),r=Math.floor(r);const d=[],p=[],m=[],y=[];let M=0;const b=[],v=n/2;let f=0;D(),a===!1&&(t>0&&I(!0),e>0&&I(!1)),this.setIndex(d),this.setAttribute("position",new ye(p,3)),this.setAttribute("normal",new ye(m,3)),this.setAttribute("uv",new ye(y,2));function D(){const C=new O,z=new O;let N=0;const E=(e-t)/n;for(let S=0;S<=r;S++){const g=[],_=S/r,w=_*(e-t)+t;for(let L=0;L<=s;L++){const T=L/s,K=T*c+l,Q=Math.sin(K),J=Math.cos(K);z.x=w*Q,z.y=-_*n+v,z.z=w*J,p.push(z.x,z.y,z.z),C.set(Q,E,J).normalize(),m.push(C.x,C.y,C.z),y.push(T,1-_),g.push(M++)}b.push(g)}for(let S=0;S<s;S++)for(let g=0;g<r;g++){const _=b[g][S],w=b[g+1][S],L=b[g+1][S+1],T=b[g][S+1];(t>0||g!==0)&&(d.push(_,w,T),N+=3),(e>0||g!==r-1)&&(d.push(w,L,T),N+=3)}h.addGroup(f,N,0),f+=N}function I(C){const z=M,N=new Mt,E=new O;let S=0;const g=C===!0?t:e,_=C===!0?1:-1;for(let L=1;L<=s;L++)p.push(0,v*_,0),m.push(0,_,0),y.push(.5,.5),M++;const w=M;for(let L=0;L<=s;L++){const K=L/s*c+l,Q=Math.cos(K),J=Math.sin(K);E.x=g*J,E.y=v*_,E.z=g*Q,p.push(E.x,E.y,E.z),m.push(0,_,0),N.x=Q*.5+.5,N.y=J*.5*_+.5,y.push(N.x,N.y),M++}for(let L=0;L<s;L++){const T=z+L,K=w+L;C===!0?d.push(K,K+1,T):d.push(K+1,K,T),S+=3}h.addGroup(f,S,C===!0?1:2),f+=S}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Vn(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class Ac extends Vn{constructor(t=1,e=1,n=32,s=1,r=!1,a=0,l=Math.PI*2){super(0,t,e,n,s,r,a,l),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:n,heightSegments:s,openEnded:r,thetaStart:a,thetaLength:l}}static fromJSON(t){return new Ac(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class Cc extends Re{constructor(t=[],e=[],n=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:n,detail:s};const r=[],a=[];l(s),h(n),d(),this.setAttribute("position",new ye(r,3)),this.setAttribute("normal",new ye(r.slice(),3)),this.setAttribute("uv",new ye(a,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function l(D){const I=new O,C=new O,z=new O;for(let N=0;N<e.length;N+=3)y(e[N+0],I),y(e[N+1],C),y(e[N+2],z),c(I,C,z,D)}function c(D,I,C,z){const N=z+1,E=[];for(let S=0;S<=N;S++){E[S]=[];const g=D.clone().lerp(C,S/N),_=I.clone().lerp(C,S/N),w=N-S;for(let L=0;L<=w;L++)L===0&&S===N?E[S][L]=g:E[S][L]=g.clone().lerp(_,L/w)}for(let S=0;S<N;S++)for(let g=0;g<2*(N-S)-1;g++){const _=Math.floor(g/2);g%2===0?(m(E[S][_+1]),m(E[S+1][_]),m(E[S][_])):(m(E[S][_+1]),m(E[S+1][_+1]),m(E[S+1][_]))}}function h(D){const I=new O;for(let C=0;C<r.length;C+=3)I.x=r[C+0],I.y=r[C+1],I.z=r[C+2],I.normalize().multiplyScalar(D),r[C+0]=I.x,r[C+1]=I.y,r[C+2]=I.z}function d(){const D=new O;for(let I=0;I<r.length;I+=3){D.x=r[I+0],D.y=r[I+1],D.z=r[I+2];const C=v(D)/2/Math.PI+.5,z=f(D)/Math.PI+.5;a.push(C,1-z)}M(),p()}function p(){for(let D=0;D<a.length;D+=6){const I=a[D+0],C=a[D+2],z=a[D+4],N=Math.max(I,C,z),E=Math.min(I,C,z);N>.9&&E<.1&&(I<.2&&(a[D+0]+=1),C<.2&&(a[D+2]+=1),z<.2&&(a[D+4]+=1))}}function m(D){r.push(D.x,D.y,D.z)}function y(D,I){const C=D*3;I.x=t[C+0],I.y=t[C+1],I.z=t[C+2]}function M(){const D=new O,I=new O,C=new O,z=new O,N=new Mt,E=new Mt,S=new Mt;for(let g=0,_=0;g<r.length;g+=9,_+=6){D.set(r[g+0],r[g+1],r[g+2]),I.set(r[g+3],r[g+4],r[g+5]),C.set(r[g+6],r[g+7],r[g+8]),N.set(a[_+0],a[_+1]),E.set(a[_+2],a[_+3]),S.set(a[_+4],a[_+5]),z.copy(D).add(I).add(C).divideScalar(3);const w=v(z);b(N,_+0,D,w),b(E,_+2,I,w),b(S,_+4,C,w)}}function b(D,I,C,z){z<0&&D.x===1&&(a[I]=D.x-1),C.x===0&&C.z===0&&(a[I]=z/2/Math.PI+.5)}function v(D){return Math.atan2(D.z,-D.x)}function f(D){return Math.atan2(-D.y,Math.sqrt(D.x*D.x+D.z*D.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Cc(t.vertices,t.indices,t.radius,t.details)}}class Rc extends Cc{constructor(t=1,e=0){const n=(1+Math.sqrt(5))/2,s=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,r,t,e),this.type="IcosahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new Rc(t.radius,t.detail)}}class oa extends Re{constructor(t=.5,e=1,n=32,s=1,r=0,a=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:t,outerRadius:e,thetaSegments:n,phiSegments:s,thetaStart:r,thetaLength:a},n=Math.max(3,n),s=Math.max(1,s);const l=[],c=[],h=[],d=[];let p=t;const m=(e-t)/s,y=new O,M=new Mt;for(let b=0;b<=s;b++){for(let v=0;v<=n;v++){const f=r+v/n*a;y.x=p*Math.cos(f),y.y=p*Math.sin(f),c.push(y.x,y.y,y.z),h.push(0,0,1),M.x=(y.x/e+1)/2,M.y=(y.y/e+1)/2,d.push(M.x,M.y)}p+=m}for(let b=0;b<s;b++){const v=b*(n+1);for(let f=0;f<n;f++){const D=f+v,I=D,C=D+n+1,z=D+n+2,N=D+1;l.push(I,C,N),l.push(C,z,N)}}this.setIndex(l),this.setAttribute("position",new ye(c,3)),this.setAttribute("normal",new ye(h,3)),this.setAttribute("uv",new ye(d,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new oa(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}}class vn extends Re{constructor(t=1,e=32,n=16,s=0,r=Math.PI*2,a=0,l=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:s,phiLength:r,thetaStart:a,thetaLength:l},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));const c=Math.min(a+l,Math.PI);let h=0;const d=[],p=new O,m=new O,y=[],M=[],b=[],v=[];for(let f=0;f<=n;f++){const D=[],I=f/n;let C=0;f===0&&a===0?C=.5/e:f===n&&c===Math.PI&&(C=-.5/e);for(let z=0;z<=e;z++){const N=z/e;p.x=-t*Math.cos(s+N*r)*Math.sin(a+I*l),p.y=t*Math.cos(a+I*l),p.z=t*Math.sin(s+N*r)*Math.sin(a+I*l),M.push(p.x,p.y,p.z),m.copy(p).normalize(),b.push(m.x,m.y,m.z),v.push(N+C,1-I),D.push(h++)}d.push(D)}for(let f=0;f<n;f++)for(let D=0;D<e;D++){const I=d[f][D+1],C=d[f][D],z=d[f+1][D],N=d[f+1][D+1];(f!==0||a>0)&&y.push(I,C,N),(f!==n-1||c<Math.PI)&&y.push(C,z,N)}this.setIndex(y),this.setAttribute("position",new ye(M,3)),this.setAttribute("normal",new ye(b,3)),this.setAttribute("uv",new ye(v,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new vn(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}}class Hs extends Re{constructor(t=1,e=.4,n=12,s=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:n,tubularSegments:s,arc:r},n=Math.floor(n),s=Math.floor(s);const a=[],l=[],c=[],h=[],d=new O,p=new O,m=new O;for(let y=0;y<=n;y++)for(let M=0;M<=s;M++){const b=M/s*r,v=y/n*Math.PI*2;p.x=(t+e*Math.cos(v))*Math.cos(b),p.y=(t+e*Math.cos(v))*Math.sin(b),p.z=e*Math.sin(v),l.push(p.x,p.y,p.z),d.x=t*Math.cos(b),d.y=t*Math.sin(b),m.subVectors(p,d).normalize(),c.push(m.x,m.y,m.z),h.push(M/s),h.push(y/n)}for(let y=1;y<=n;y++)for(let M=1;M<=s;M++){const b=(s+1)*y+M-1,v=(s+1)*(y-1)+M-1,f=(s+1)*(y-1)+M,D=(s+1)*y+M;a.push(b,v,D),a.push(v,f,D)}this.setIndex(a),this.setAttribute("position",new ye(l,3)),this.setAttribute("normal",new ye(c,3)),this.setAttribute("uv",new ye(h,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Hs(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}}class sS extends we{static get type(){return"RawShaderMaterial"}constructor(t){super(t),this.isRawShaderMaterial=!0}}class fe extends Ti{static get type(){return"MeshStandardMaterial"}constructor(t){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.color=new bt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new bt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=ff,this.normalScale=new Mt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new In,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class aa extends Te{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new bt(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}}class rS extends aa{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Te.DEFAULT_UP),this.updateMatrix(),this.groundColor=new bt(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}}const Za=new le,Yu=new O,Ku=new O;class Df{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Mt(512,512),this.map=null,this.mapPass=null,this.matrix=new le,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new xc,this._frameExtents=new Mt(1,1),this._viewportCount=1,this._viewports=[new ve(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,n=this.matrix;Yu.setFromMatrixPosition(t.matrixWorld),e.position.copy(Yu),Ku.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(Ku),e.updateMatrixWorld(),Za.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Za),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(Za)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}const Ju=new le,mr=new O,Qa=new O;class oS extends Df{constructor(){super(new cn(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new Mt(4,2),this._viewportCount=6,this._viewports=[new ve(2,1,1,1),new ve(0,1,1,1),new ve(3,1,1,1),new ve(1,1,1,1),new ve(3,0,1,1),new ve(1,0,1,1)],this._cubeDirections=[new O(1,0,0),new O(-1,0,0),new O(0,0,1),new O(0,0,-1),new O(0,1,0),new O(0,-1,0)],this._cubeUps=[new O(0,1,0),new O(0,1,0),new O(0,1,0),new O(0,1,0),new O(0,0,1),new O(0,0,-1)]}updateMatrices(t,e=0){const n=this.camera,s=this.matrix,r=t.distance||n.far;r!==n.far&&(n.far=r,n.updateProjectionMatrix()),mr.setFromMatrixPosition(t.matrixWorld),n.position.copy(mr),Qa.copy(n.position),Qa.add(this._cubeDirections[e]),n.up.copy(this._cubeUps[e]),n.lookAt(Qa),n.updateMatrixWorld(),s.makeTranslation(-mr.x,-mr.y,-mr.z),Ju.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Ju)}}class Kl extends aa{constructor(t,e,n=0,s=2){super(t,e),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=s,this.shadow=new oS}get power(){return this.intensity*4*Math.PI}set power(t){this.intensity=t/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.decay=t.decay,this.shadow=t.shadow.clone(),this}}class aS extends Df{constructor(){super(new Mc(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class lS extends aa{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Te.DEFAULT_UP),this.updateMatrix(),this.target=new Te,this.shadow=new aS}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}class cS extends aa{constructor(t,e){super(t,e),this.isAmbientLight=!0,this.type="AmbientLight"}}class hS{constructor(t=!0){this.autoStart=t,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=Zu(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let t=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const e=Zu();t=(e-this.oldTime)/1e3,this.oldTime=e,this.elapsedTime+=t}return t}}function Zu(){return performance.now()}const Qu=new le;class uS{constructor(t,e,n=0,s=1/0){this.ray=new na(t,e),this.near=n,this.far=s,this.camera=null,this.layers=new vc,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):console.error("THREE.Raycaster: Unsupported camera type: "+e.type)}setFromXRController(t){return Qu.identity().extractRotation(t.matrixWorld),this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Qu),this}intersectObject(t,e=!0,n=[]){return Jl(t,this,n,e),n.sort(td),n}intersectObjects(t,e=!0,n=[]){for(let s=0,r=t.length;s<r;s++)Jl(t[s],this,n,e);return n.sort(td),n}}function td(i,t){return i.distance-t.distance}function Jl(i,t,e,n){let s=!0;if(i.layers.test(t.layers)&&i.raycast(t,e)===!1&&(s=!1),s===!0&&n===!0){const r=i.children;for(let a=0,l=r.length;a<l;a++)Jl(r[a],t,e,!0)}}class ed{constructor(t=1,e=0,n=0){return this.radius=t,this.phi=e,this.theta=n,this}set(t,e,n){return this.radius=t,this.phi=e,this.theta=n,this}copy(t){return this.radius=t.radius,this.phi=t.phi,this.theta=t.theta,this}makeSafe(){return this.phi=Math.max(1e-6,Math.min(Math.PI-1e-6,this.phi)),this}setFromVector3(t){return this.setFromCartesianCoords(t.x,t.y,t.z)}setFromCartesianCoords(t,e,n){return this.radius=Math.sqrt(t*t+e*e+n*n),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(t,n),this.phi=Math.acos(je(e/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:lc}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=lc);class dS{constructor(){this.scene=new ZM,this.scene.fog=new Ec(658964,8e-4),this.setupLighting()}setupLighting(){this.sunLight=new lS(16774624,.5),this.sunLight.position.set(50,30,-20),this.sunLight.castShadow=!0,this.sunLight.shadow.mapSize.width=1024,this.sunLight.shadow.mapSize.height=1024,this.sunLight.shadow.camera.near=.5,this.sunLight.shadow.camera.far=200,this.sunLight.shadow.camera.left=-30,this.sunLight.shadow.camera.right=30,this.sunLight.shadow.camera.top=30,this.sunLight.shadow.camera.bottom=-30,this.sunLight.shadow.bias=-.001,this.scene.add(this.sunLight),this.ambientLight=new cS(1710638,.25),this.scene.add(this.ambientLight),this.hemiLight=new rS(2245802,2232576,.18),this.scene.add(this.hemiLight)}add(t){this.scene.add(t)}remove(t){this.scene.remove(t)}}const fS=.08,pS=.08,mS=3,gS=.5,_S=600,vS=.1,yS=Math.PI-.1,xS=30,nd=.002;class MS{constructor(t,e){this.camera=t,this.domElement=e,this.target=new O(0,0,0),this.spherical=new ed(100,Math.PI/3,0),this.targetSpherical=new ed(100,Math.PI/3,0),this.targetTarget=new O(0,0,0),this.isDragging=!1,this.isPanning=!1,this.dragStart=new Mt,this.dragDelta=new Mt,this.dragDistance=0,this.freeMode=!1,this.keys={},this.euler=new In(0,0,0,"YXZ"),this._bindEvents(),this._updateCameraPosition()}_bindEvents(){const t=this.domElement;t.addEventListener("pointerdown",e=>this._onPointerDown(e)),t.addEventListener("pointermove",e=>this._onPointerMove(e)),t.addEventListener("pointerup",e=>this._onPointerUp(e)),t.addEventListener("pointercancel",e=>this._onPointerUp(e)),t.addEventListener("wheel",e=>this._onWheel(e),{passive:!1}),t.addEventListener("contextmenu",e=>e.preventDefault()),window.addEventListener("keydown",e=>{this.keys[e.code]=!0,(e.code==="ShiftLeft"||e.code==="ShiftRight")&&(this.freeMode=!0)}),window.addEventListener("keyup",e=>{this.keys[e.code]=!1,(e.code==="ShiftLeft"||e.code==="ShiftRight")&&(this.freeMode=!1)})}_onPointerDown(t){t.button===0?this.isDragging=!0:(t.button===1||t.button===2)&&(this.isPanning=!0),this.dragStart.set(t.clientX,t.clientY),this.dragDistance=0}_onPointerMove(t){const e=t.clientX-this.dragStart.x,n=t.clientY-this.dragStart.y;if(this.dragDistance=Math.sqrt(e*e+n*n),this.isDragging&&this.dragDistance>4&&(this.freeMode?(this.euler.setFromQuaternion(this.camera.quaternion),this.euler.y-=t.movementX*nd,this.euler.x-=t.movementY*nd,this.euler.x=Math.max(-Math.PI/2+.01,Math.min(Math.PI/2-.01,this.euler.x)),this.camera.quaternion.setFromEuler(this.euler)):(this.targetSpherical.theta-=t.movementX*.005,this.targetSpherical.phi-=t.movementY*.005,this.targetSpherical.phi=Math.max(vS,Math.min(yS,this.targetSpherical.phi)))),this.isPanning){const s=this.spherical.radius*.001,r=new O,a=new O;r.setFromMatrixColumn(this.camera.matrixWorld,0),a.setFromMatrixColumn(this.camera.matrixWorld,1),this.targetTarget.addScaledVector(r,-t.movementX*s),this.targetTarget.addScaledVector(a,t.movementY*s)}this.dragStart.set(t.clientX,t.clientY)}_onPointerUp(t){this.isDragging=!1,this.isPanning=!1}_onWheel(t){t.preventDefault();const e=1+Math.sign(t.deltaY)*pS;this.targetSpherical.radius=Math.max(mS,Math.min(_S,this.targetSpherical.radius*e))}setPlanetColliders(t){this._planetColliders=t}focusOnPosition(t,e=30){this._trackFn=null,this.targetTarget.copy(t),this.targetSpherical.radius=e}trackObject(t,e=30){this._trackFn=t,this.targetSpherical.radius=e}stopTracking(){this._trackFn=null}wasClick(){return this.dragDistance<8}getZoomLevel(){const t=this.spherical.radius;return t>200?"galaxy":t>50?"system":t>15?"planet":"close"}update(t){if(this.freeMode){const e=xS*t,n=new O;this.camera.getWorldDirection(n);const s=new O;s.crossVectors(n,this.camera.up).normalize(),this.keys.KeyW&&this.camera.position.addScaledVector(n,e),this.keys.KeyS&&this.camera.position.addScaledVector(n,-e),this.keys.KeyA&&this.camera.position.addScaledVector(s,-e),this.keys.KeyD&&this.camera.position.addScaledVector(s,e),this.keys.Space&&(this.camera.position.y+=e),this.keys.KeyC&&(this.camera.position.y-=e)}else{if(this.keys.KeyW||this.keys.KeyS||this.keys.KeyA||this.keys.KeyD){this._trackFn=null;const s=this.spherical.radius*.8*t,r=new O;this.camera.getWorldDirection(r),r.y=0,r.lengthSq()<1e-4&&r.set(0,0,-1),r.normalize();const a=new O().crossVectors(r,new O(0,1,0)).normalize();this.keys.KeyW&&this.targetTarget.addScaledVector(r,s),this.keys.KeyS&&this.targetTarget.addScaledVector(r,-s),this.keys.KeyA&&this.targetTarget.addScaledVector(a,-s),this.keys.KeyD&&this.targetTarget.addScaledVector(a,s)}if(this._trackFn){const s=this._trackFn();s&&this.targetTarget.copy(s)}const n=1-Math.pow(1-fS,t*60);this.spherical.theta+=(this.targetSpherical.theta-this.spherical.theta)*n,this.spherical.phi+=(this.targetSpherical.phi-this.spherical.phi)*n,this.spherical.radius+=(this.targetSpherical.radius-this.spherical.radius)*n,this.target.lerp(this.targetTarget,n),this._updateCameraPosition()}}_updateCameraPosition(){const t=new O().setFromSpherical(this.spherical),e=new O().copy(this.target).add(t);if(this._planetColliders)for(const{position:s,radius:r}of this._planetColliders){const a=r+gS;if(e.distanceTo(s)<a){const l=e.clone().sub(s);l.lengthSq()<1e-4&&l.set(0,1,0),l.normalize(),e.copy(s).addScaledVector(l,a),this.spherical.radius=e.distanceTo(this.target),this.targetSpherical.radius=Math.max(this.targetSpherical.radius,this.spherical.radius)}}this.camera.position.copy(e),this.camera.lookAt(this.target);const n=this.spherical.radius;n<20?(this.camera.near=.05,this.camera.far=500):n<80?(this.camera.near=.1,this.camera.far=1e3):(this.camera.near=1,this.camera.far=2e3),this.camera.updateProjectionMatrix()}}const Lf={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

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


		}`};class Ys{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}const SS=new Mc(-1,1,1,-1,0,1);class ES extends Re{constructor(){super(),this.setAttribute("position",new ye([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new ye([0,2,0,0,2,0],2))}}const bS=new ES;class Pc{constructor(t){this._mesh=new Ft(bS,t)}dispose(){this._mesh.geometry.dispose()}render(t){t.render(this._mesh,SS)}get material(){return this._mesh.material}set material(t){this._mesh.material=t}}class As extends Ys{constructor(t,e){super(),this.textureID=e!==void 0?e:"tDiffuse",t instanceof we?(this.uniforms=t.uniforms,this.material=t):t&&(this.uniforms=Cr.clone(t.uniforms),this.material=new we({name:t.name!==void 0?t.name:"unspecified",defines:Object.assign({},t.defines),uniforms:this.uniforms,vertexShader:t.vertexShader,fragmentShader:t.fragmentShader})),this.fsQuad=new Pc(this.material)}render(t,e,n){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=n.texture),this.fsQuad.material=this.material,this.renderToScreen?(t.setRenderTarget(null),this.fsQuad.render(t)):(t.setRenderTarget(e),this.clear&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),this.fsQuad.render(t))}dispose(){this.material.dispose(),this.fsQuad.dispose()}}class id extends Ys{constructor(t,e){super(),this.scene=t,this.camera=e,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(t,e,n){const s=t.getContext(),r=t.state;r.buffers.color.setMask(!1),r.buffers.depth.setMask(!1),r.buffers.color.setLocked(!0),r.buffers.depth.setLocked(!0);let a,l;this.inverse?(a=0,l=1):(a=1,l=0),r.buffers.stencil.setTest(!0),r.buffers.stencil.setOp(s.REPLACE,s.REPLACE,s.REPLACE),r.buffers.stencil.setFunc(s.ALWAYS,a,4294967295),r.buffers.stencil.setClear(l),r.buffers.stencil.setLocked(!0),t.setRenderTarget(n),this.clear&&t.clear(),t.render(this.scene,this.camera),t.setRenderTarget(e),this.clear&&t.clear(),t.render(this.scene,this.camera),r.buffers.color.setLocked(!1),r.buffers.depth.setLocked(!1),r.buffers.color.setMask(!0),r.buffers.depth.setMask(!0),r.buffers.stencil.setLocked(!1),r.buffers.stencil.setFunc(s.EQUAL,1,4294967295),r.buffers.stencil.setOp(s.KEEP,s.KEEP,s.KEEP),r.buffers.stencil.setLocked(!0)}}class wS extends Ys{constructor(){super(),this.needsSwap=!1}render(t){t.state.buffers.stencil.setLocked(!1),t.state.buffers.stencil.setTest(!1)}}class TS{constructor(t,e){if(this.renderer=t,this._pixelRatio=t.getPixelRatio(),e===void 0){const n=t.getSize(new Mt);this._width=n.width,this._height=n.height,e=new Rn(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:ei}),e.texture.name="EffectComposer.rt1"}else this._width=e.width,this._height=e.height;this.renderTarget1=e,this.renderTarget2=e.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new As(Lf),this.copyPass.material.blending=ti,this.clock=new hS}swapBuffers(){const t=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=t}addPass(t){this.passes.push(t),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(t,e){this.passes.splice(e,0,t),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(t){const e=this.passes.indexOf(t);e!==-1&&this.passes.splice(e,1)}isLastEnabledPass(t){for(let e=t+1;e<this.passes.length;e++)if(this.passes[e].enabled)return!1;return!0}render(t){t===void 0&&(t=this.clock.getDelta());const e=this.renderer.getRenderTarget();let n=!1;for(let s=0,r=this.passes.length;s<r;s++){const a=this.passes[s];if(a.enabled!==!1){if(a.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(s),a.render(this.renderer,this.writeBuffer,this.readBuffer,t,n),a.needsSwap){if(n){const l=this.renderer.getContext(),c=this.renderer.state.buffers.stencil;c.setFunc(l.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,t),c.setFunc(l.EQUAL,1,4294967295)}this.swapBuffers()}id!==void 0&&(a instanceof id?n=!0:a instanceof wS&&(n=!1))}}this.renderer.setRenderTarget(e)}reset(t){if(t===void 0){const e=this.renderer.getSize(new Mt);this._pixelRatio=this.renderer.getPixelRatio(),this._width=e.width,this._height=e.height,t=this.renderTarget1.clone(),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=t,this.renderTarget2=t.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(t,e){this._width=t,this._height=e;const n=this._width*this._pixelRatio,s=this._height*this._pixelRatio;this.renderTarget1.setSize(n,s),this.renderTarget2.setSize(n,s);for(let r=0;r<this.passes.length;r++)this.passes[r].setSize(n,s)}setPixelRatio(t){this._pixelRatio=t,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}class sd extends Ys{constructor(t,e,n=null,s=null,r=null){super(),this.scene=t,this.camera=e,this.overrideMaterial=n,this.clearColor=s,this.clearAlpha=r,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this._oldClearColor=new bt}render(t,e,n){const s=t.autoClear;t.autoClear=!1;let r,a;this.overrideMaterial!==null&&(a=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(t.getClearColor(this._oldClearColor),t.setClearColor(this.clearColor,t.getClearAlpha())),this.clearAlpha!==null&&(r=t.getClearAlpha(),t.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&t.clearDepth(),t.setRenderTarget(this.renderToScreen?null:n),this.clear===!0&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),t.render(this.scene,this.camera),this.clearColor!==null&&t.setClearColor(this._oldClearColor),this.clearAlpha!==null&&t.setClearAlpha(r),this.overrideMaterial!==null&&(this.scene.overrideMaterial=a),t.autoClear=s}}const AS={uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new bt(0)},defaultOpacity:{value:0}},vertexShader:`

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

		}`};class Ji extends Ys{constructor(t,e,n,s){super(),this.strength=e!==void 0?e:1,this.radius=n,this.threshold=s,this.resolution=t!==void 0?new Mt(t.x,t.y):new Mt(256,256),this.clearColor=new bt(0,0,0),this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let r=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);this.renderTargetBright=new Rn(r,a,{type:ei}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let p=0;p<this.nMips;p++){const m=new Rn(r,a,{type:ei});m.texture.name="UnrealBloomPass.h"+p,m.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(m);const y=new Rn(r,a,{type:ei});y.texture.name="UnrealBloomPass.v"+p,y.texture.generateMipmaps=!1,this.renderTargetsVertical.push(y),r=Math.round(r/2),a=Math.round(a/2)}const l=AS;this.highPassUniforms=Cr.clone(l.uniforms),this.highPassUniforms.luminosityThreshold.value=s,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new we({uniforms:this.highPassUniforms,vertexShader:l.vertexShader,fragmentShader:l.fragmentShader}),this.separableBlurMaterials=[];const c=[3,5,7,9,11];r=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);for(let p=0;p<this.nMips;p++)this.separableBlurMaterials.push(this.getSeperableBlurMaterial(c[p])),this.separableBlurMaterials[p].uniforms.invSize.value=new Mt(1/r,1/a),r=Math.round(r/2),a=Math.round(a/2);this.compositeMaterial=this.getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=e,this.compositeMaterial.uniforms.bloomRadius.value=.1;const h=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=h,this.bloomTintColors=[new O(1,1,1),new O(1,1,1),new O(1,1,1),new O(1,1,1),new O(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors;const d=Lf;this.copyUniforms=Cr.clone(d.uniforms),this.blendMaterial=new we({uniforms:this.copyUniforms,vertexShader:d.vertexShader,fragmentShader:d.fragmentShader,blending:Pn,depthTest:!1,depthWrite:!1,transparent:!0}),this.enabled=!0,this.needsSwap=!1,this._oldClearColor=new bt,this.oldClearAlpha=1,this.basic=new ia,this.fsQuad=new Pc(null)}dispose(){for(let t=0;t<this.renderTargetsHorizontal.length;t++)this.renderTargetsHorizontal[t].dispose();for(let t=0;t<this.renderTargetsVertical.length;t++)this.renderTargetsVertical[t].dispose();this.renderTargetBright.dispose();for(let t=0;t<this.separableBlurMaterials.length;t++)this.separableBlurMaterials[t].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this.basic.dispose(),this.fsQuad.dispose()}setSize(t,e){let n=Math.round(t/2),s=Math.round(e/2);this.renderTargetBright.setSize(n,s);for(let r=0;r<this.nMips;r++)this.renderTargetsHorizontal[r].setSize(n,s),this.renderTargetsVertical[r].setSize(n,s),this.separableBlurMaterials[r].uniforms.invSize.value=new Mt(1/n,1/s),n=Math.round(n/2),s=Math.round(s/2)}render(t,e,n,s,r){t.getClearColor(this._oldClearColor),this.oldClearAlpha=t.getClearAlpha();const a=t.autoClear;t.autoClear=!1,t.setClearColor(this.clearColor,0),r&&t.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this.fsQuad.material=this.basic,this.basic.map=n.texture,t.setRenderTarget(null),t.clear(),this.fsQuad.render(t)),this.highPassUniforms.tDiffuse.value=n.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this.fsQuad.material=this.materialHighPassFilter,t.setRenderTarget(this.renderTargetBright),t.clear(),this.fsQuad.render(t);let l=this.renderTargetBright;for(let c=0;c<this.nMips;c++)this.fsQuad.material=this.separableBlurMaterials[c],this.separableBlurMaterials[c].uniforms.colorTexture.value=l.texture,this.separableBlurMaterials[c].uniforms.direction.value=Ji.BlurDirectionX,t.setRenderTarget(this.renderTargetsHorizontal[c]),t.clear(),this.fsQuad.render(t),this.separableBlurMaterials[c].uniforms.colorTexture.value=this.renderTargetsHorizontal[c].texture,this.separableBlurMaterials[c].uniforms.direction.value=Ji.BlurDirectionY,t.setRenderTarget(this.renderTargetsVertical[c]),t.clear(),this.fsQuad.render(t),l=this.renderTargetsVertical[c];this.fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,t.setRenderTarget(this.renderTargetsHorizontal[0]),t.clear(),this.fsQuad.render(t),this.fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,r&&t.state.buffers.stencil.setTest(!0),this.renderToScreen?(t.setRenderTarget(null),this.fsQuad.render(t)):(t.setRenderTarget(n),this.fsQuad.render(t)),t.setClearColor(this._oldClearColor,this.oldClearAlpha),t.autoClear=a}getSeperableBlurMaterial(t){const e=[];for(let n=0;n<t;n++)e.push(.39894*Math.exp(-.5*n*n/(t*t))/t);return new we({defines:{KERNEL_RADIUS:t},uniforms:{colorTexture:{value:null},invSize:{value:new Mt(.5,.5)},direction:{value:new Mt(.5,.5)},gaussianCoefficients:{value:e}},vertexShader:`varying vec2 vUv;
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
				}`})}getCompositeMaterial(t){return new we({defines:{NUM_MIPS:t},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`varying vec2 vUv;
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
				}`})}}Ji.BlurDirectionX=new Mt(1,0);Ji.BlurDirectionY=new Mt(0,1);const CS={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
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

		}`};class rd extends Ys{constructor(){super();const t=CS;this.uniforms=Cr.clone(t.uniforms),this.material=new sS({name:t.name,uniforms:this.uniforms,vertexShader:t.vertexShader,fragmentShader:t.fragmentShader}),this.fsQuad=new Pc(this.material),this._outputColorSpace=null,this._toneMapping=null}render(t,e,n){this.uniforms.tDiffuse.value=n.texture,this.uniforms.toneMappingExposure.value=t.toneMappingExposure,(this._outputColorSpace!==t.outputColorSpace||this._toneMapping!==t.toneMapping)&&(this._outputColorSpace=t.outputColorSpace,this._toneMapping=t.toneMapping,this.material.defines={},ee.getTransfer(this._outputColorSpace)===he&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===Jd?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===Zd?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===Qd?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===cc?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===tf?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===ef&&(this.material.defines.NEUTRAL_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(t.setRenderTarget(null),this.fsQuad.render(t)):(t.setRenderTarget(e),this.clear&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),this.fsQuad.render(t))}dispose(){this.material.dispose(),this.fsQuad.dispose()}}const od={name:"ColorGradeShader",uniforms:{tDiffuse:{value:null},uSaturation:{value:1.35},uContrast:{value:1.12},uVigStrength:{value:.45},uCAStrength:{value:.0018}},vertexShader:`
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,fragmentShader:`
    uniform sampler2D tDiffuse;
    uniform float uSaturation;
    uniform float uContrast;
    uniform float uVigStrength;
    uniform float uCAStrength;
    varying vec2 vUv;

    vec3 sCurve(vec3 x) {
      // Smoothstep S-curve: keeps darks dark, boosts mids, compresses highlights
      x = clamp(x, 0.0, 1.0);
      return x * x * (3.0 - 2.0 * x);
    }

    vec3 adjustSaturation(vec3 col, float sat) {
      float luma = dot(col, vec3(0.2126, 0.7152, 0.0722));
      return mix(vec3(luma), col, sat);
    }

    void main() {
      vec2 center = vUv - 0.5;

      // Chromatic aberration: R pushed out, B pushed in
      float dist = length(center);
      vec2 aberr = normalize(center + 0.0001) * dist * uCAStrength;

      float r = texture2D(tDiffuse, vUv + aberr).r;
      float g = texture2D(tDiffuse, vUv).g;
      float b = texture2D(tDiffuse, vUv - aberr).b;
      vec3 col = vec3(r, g, b);

      // S-curve contrast
      col = sCurve(col) * uContrast;

      // Cool shadows / warm highlights (sci-fi color grade)
      float luma = dot(col, vec3(0.2126, 0.7152, 0.0722));
      col = mix(col, col * vec3(0.85, 0.90, 1.10), smoothstep(0.3, 0.0, luma));
      col = mix(col, col * vec3(1.08, 1.04, 0.92), smoothstep(0.6, 1.0, luma));

      // Saturation boost
      col = adjustSaturation(col, uSaturation);

      // Vignette
      float vig = 1.0 - dot(center, center) * uVigStrength * 3.5;
      col *= clamp(vig, 0.0, 1.0);

      gl_FragColor = vec4(col, 1.0);
    }
  `},ad={name:"FilmGrainShader",uniforms:{tDiffuse:{value:null},uTime:{value:0},uStrength:{value:.028}},vertexShader:`
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,fragmentShader:`
    uniform sampler2D tDiffuse;
    uniform float uTime;
    uniform float uStrength;
    varying vec2 vUv;

    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
    }

    void main() {
      vec4 col = texture2D(tDiffuse, vUv);
      // Seed changes each frame via uTime so grain doesn't burn in
      float grain = hash(vUv + fract(uTime * 0.07)) * 2.0 - 1.0;
      col.rgb += grain * uStrength;
      gl_FragColor = col;
    }
  `};class RS{constructor(t){this.renderer=new JM({logarithmicDepthBuffer:!0,antialias:!0,alpha:!1,powerPreference:"high-performance"}),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),this.renderer.setSize(window.innerWidth,window.innerHeight),this.renderer.setClearColor(658964,1),this.renderer.toneMapping=cc,this.renderer.toneMappingExposure=1.1,this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=Yd,t.appendChild(this.renderer.domElement),this.composer=null,this.bloomPass=null,this.godRayPass=null,this.colorGradePass=null,this.grainPass=null}setupPostProcessing(t,e){const n=new Mt(window.innerWidth,window.innerHeight);this.composer=new TS(this.renderer),this.composer.addPass(new sd(t,e)),this.bloomPass=new Ji(n,.8,.6,.55),this.composer.addPass(this.bloomPass),this.colorGradePass=new As(od),this.composer.addPass(this.colorGradePass),this.grainPass=new As(ad),this.composer.addPass(this.grainPass),this.composer.addPass(new rd)}tick(t){this.grainPass&&(this.grainPass.uniforms.uTime.value=t)}addGodRayPass(t){if(this.godRayPass)return;this.bloomPass&&this.bloomPass.dispose(),this.colorGradePass&&this.colorGradePass.dispose(),this.grainPass&&this.grainPass.dispose();const e=this.composer.passes[0].scene,n=this.composer.passes[0].camera,s=new Mt(window.innerWidth,window.innerHeight);this.composer.passes.length=0,this.composer.addPass(new sd(e,n)),this.bloomPass=new Ji(s,.8,.6,.55),this.composer.addPass(this.bloomPass),this.godRayPass=new As(t),this.godRayPass.uniforms.uLightPos.value=new Mt(.5,.5),this.godRayPass.uniforms.uEnabled.value=0,this.composer.addPass(this.godRayPass),this.colorGradePass=new As(od),this.composer.addPass(this.colorGradePass),this.grainPass=new As(ad),this.composer.addPass(this.grainPass),this.composer.addPass(new rd)}setGodRaySource(t,e){this.godRayPass&&(this.godRayPass.uniforms.uLightPos.value.copy(t),this.godRayPass.uniforms.uEnabled.value=e)}render(){this.composer&&this.composer.render()}resize(t,e){this.renderer.setSize(t,e),this.composer&&this.composer.setSize(t,e)}get domElement(){return this.renderer.domElement}}class PS{constructor(t,e,n){this.renderPipeline=t,this.cameraController=e,this.sceneManager=n,this._lastTime=0,this._running=!1,this._updateCallbacks=[],this._frame=this._frame.bind(this)}onUpdate(t){this._updateCallbacks.push(t)}start(){this._running=!0,this._lastTime=performance.now(),requestAnimationFrame(this._frame)}stop(){this._running=!1}_frame(t){if(!this._running)return;requestAnimationFrame(this._frame);const e=Math.min((t-this._lastTime)/1e3,.1);this._lastTime=t,Ct.tick(e);for(const n of this._updateCallbacks)n(e,t/1e3);this.cameraController.update(e),this.renderPipeline.render()}}class IS{constructor(t,e,n,s){this.camera=t,this.scene=e,this.domElement=n,this.cameraController=s,this.raycaster=new uS,this.pointer=new Mt,this.clickables=[],this._hoveredPlanet=null,this._onHoverCallbacks=[],n.addEventListener("pointerup",r=>this._onPointerUp(r)),n.addEventListener("pointermove",r=>this._onPointerMove(r))}addClickable(t,e){t.userData._clickHandler=e,this.clickables.push(t)}removeClickable(t){this.clickables=this.clickables.filter(e=>e!==t),delete t.userData._clickHandler}onHover(t){this._onHoverCallbacks.push(t)}_onPointerUp(t){if(!this.cameraController.wasClick()||t.button!==0)return;const e=this.domElement.getBoundingClientRect();this.pointer.x=(t.clientX-e.left)/e.width*2-1,this.pointer.y=-((t.clientY-e.top)/e.height)*2+1,this.raycaster.setFromCamera(this.pointer,this.camera);const n=this.raycaster.intersectObjects(this.clickables,!1);if(n.length>0){const s=n[0].object;s.userData._clickHandler&&s.userData._clickHandler(n[0])}}_onPointerMove(t){var r;const e=this.domElement.getBoundingClientRect();this.pointer.x=(t.clientX-e.left)/e.width*2-1,this.pointer.y=-((t.clientY-e.top)/e.height)*2+1,this.raycaster.setFromCamera(this.pointer,this.camera);const n=this.raycaster.intersectObjects(this.clickables,!1);let s=null;if(n.length>0){let a=n[0].object;for(;a;){if((r=a.userData)!=null&&r.planetId){s=a.userData.planetId;break}a=a.parent}}if(s!==this._hoveredPlanet||s){this._hoveredPlanet=s;for(const a of this._onHoverCallbacks)a(s,t.clientX,t.clientY)}}}const ld={xerion:{x:2e3,y:2e3},drakon:{x:2e3,y:2e3},crystara:{x:2e3,y:2e3},voltara:{x:2e3,y:2e3},glacius:{x:2e3,y:2e3},nebulox:{x:2e3,y:2e3},solaris:{x:2e3,y:2e3},voidex:{x:2e3,y:2e3}},DS=4e3,LS={color:"#ffdd44",size:12},cd=DS/2,hd=.05;function US(i){const t=Math.sin(i*127.1+311.7)*43758.5453;return t-Math.floor(t)}function NS(i){const t=(i.x-cd)*hd,e=(i.y-cd)*hd,n=(US(i.x*.01+i.y*.01)-.5)*12;return new O(t,n,e)}function OS(){const i={};for(const t in ld)i[t]=NS(ld[t]);return i}const Gn=`
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
`,oi=`
  float fresnel(vec3 viewDir, vec3 normal, float power) {
    return pow(1.0 - max(dot(viewDir, normal), 0.0), power);
  }
`,Ai=`
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
`,FS=`
  varying vec3 vNormal;
  varying vec3 vViewDir;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vViewDir = normalize(cameraPosition - worldPos.xyz);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,Uf={vertex:Ai,fragment:`
    ${Gn}
    ${oi}

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
  `},BS={vertex:Ai,fragment:`
    ${Gn}
    ${oi}

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
  `},kS={vertex:Ai,fragment:`
    ${Gn}
    ${oi}

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
  `},zS={vertex:Ai,fragment:`
    ${Gn}
    ${oi}

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
  `},VS={vertex:Ai,fragment:`
    ${Gn}
    ${oi}

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
  `},GS={vertex:Ai,fragment:`
    ${Gn}
    ${oi}

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
  `},Zl={vertex:Ai,fragment:`
    ${Gn}
    ${oi}

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
  `},HS={vertex:Ai,fragment:`
    ${Gn}
    ${oi}

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
  `},ud={vertex:FS,fragment:`
    ${oi}

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
  `},dd={vertex:`
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
  `},WS={terr:Uf,lava:BS,cryst:kS,gas:zS,ice:VS,neb:GS,star:Zl,void:HS},XS=["gas","star","void"];function qS(i){const t=new bt(i);return new O(t.r,t.g,t.b)}class jS{constructor(t,e=10){this.def=t,this.radius=e,this.group=new De,this.group.userData.type="planet",this.group.userData.planetId=t.id,this._createPlanetMesh(),this._createAtmosphere(),XS.includes(t.type)&&this._createRings()}_createPlanetMesh(){const e=(nl[this.def.type]||nl.terr).map(qS),n=WS[this.def.type]||Uf,s=new O(1,.5,-.3).normalize();this.planetMaterial=new we({vertexShader:n.vertex,fragmentShader:n.fragment,uniforms:{uTime:{value:0},uColors:{value:e},uLightDir:{value:s}}});const r=new vn(this.radius,64,64);this.planetMesh=new Ft(r,this.planetMaterial),this.planetMesh.castShadow=!0,this.group.add(this.planetMesh)}_createAtmosphere(){const t=new bt(this.def.glow),e=this.def.type==="star";this.atmosphereMaterial=new we({vertexShader:ud.vertex,fragmentShader:ud.fragment,uniforms:{uAtmColor:{value:new O(t.r,t.g,t.b)},uAtmIntensity:{value:e?1.2:.8}},side:Qe,transparent:!0,depthWrite:!1,blending:Pn});const n=new vn(this.radius*1.15,48,48);this.atmosphereMesh=new Ft(n,this.atmosphereMaterial),this.group.add(this.atmosphereMesh)}_createRings(){const t=new bt(this.def.glow),e=this.radius*1.3,n=this.radius*2.2;this.ringMaterial=new we({vertexShader:dd.vertex,fragmentShader:dd.fragment,uniforms:{uColor:{value:new O(t.r,t.g,t.b)},uOpacity:{value:.5}},transparent:!0,side:Ze,depthWrite:!1});const s=new oa(e,n,128,1);this.ringMesh=new Ft(s,this.ringMaterial),this.ringMesh.rotation.x=-Math.PI/2+.15,this.ringMesh.receiveShadow=!0,this.group.add(this.ringMesh)}get clickTarget(){return this.planetMesh}update(t){this.planetMaterial.uniforms.uTime.value=t}setPosition(t,e,n){this.group.position.set(t,e,n)}dispose(){this.planetMesh.geometry.dispose(),this.planetMaterial.dispose(),this.atmosphereMesh.geometry.dispose(),this.atmosphereMaterial.dispose(),this.ringMesh&&(this.ringMesh.geometry.dispose(),this.ringMaterial.dispose())}}const To=13150286,tl=9075278,el=8173662,$S=1709320;class YS{constructor(){this.group=new De,this._build(),this.orbitAngle=Math.random()*Math.PI*2,this.orbitRadius=15,this.orbitSpeed=.1}_build(){const t=new Hs(1.5,.08,12,48),e=new fe({color:To,emissive:To,emissiveIntensity:.4,metalness:.85,roughness:.25});this.outerRing=new Ft(t,e),this.outerRing.rotation.x=Math.PI/2,this.group.add(this.outerRing);const n=new Hs(.9,.05,12,36),s=new fe({color:tl,emissive:tl,emissiveIntensity:.2,metalness:.8,roughness:.3});this.innerRing=new Ft(n,s),this.innerRing.rotation.x=Math.PI/2,this.group.add(this.innerRing);const r=new vn(.35,16,16),a=new fe({color:$S,emissive:el,emissiveIntensity:.6,metalness:.5,roughness:.4});this.hub=new Ft(r,a),this.group.add(this.hub);const l=new fe({color:tl,metalness:.7,roughness:.4});for(let M=0;M<4;M++){const b=M/4*Math.PI*2,v=new Vn(.03,.03,1.15,6),f=new Ft(v,l);f.rotation.z=Math.PI/2,f.rotation.y=b,f.position.set(Math.cos(b)*.75,0,Math.sin(b)*.75),this.group.add(f)}const c=new fe({color:2245768,emissive:1122884,emissiveIntensity:.3,metalness:.6,roughness:.5});for(let M=0;M<4;M++){const b=M/4*Math.PI*2+Math.PI/4,v=new _n(.5,.02,.25),f=new Ft(v,c);f.position.set(Math.cos(b)*1.5,0,Math.sin(b)*1.5),f.rotation.y=b,this.group.add(f)}const h=new Vn(.1,.15,.3,8),d=new fe({color:To,emissive:To,emissiveIntensity:.2,metalness:.8,roughness:.3}),p=new Ft(h,d);p.position.y=.3,this.group.add(p);const m=new vn(.06,8,8),y=new fe({color:el,emissive:el,emissiveIntensity:2});this.navLight=new Ft(m,y),this.navLight.position.y=-.25,this.group.add(this.navLight),this.group.scale.setScalar(.8)}update(t){this.orbitAngle=t*this.orbitSpeed,this.group.position.set(Math.cos(this.orbitAngle)*this.orbitRadius,Math.sin(this.orbitAngle*.3)*1.5,Math.sin(this.orbitAngle)*this.orbitRadius),this.outerRing.rotation.z=t*.32,this.innerRing.rotation.z=-t*.2;const e=Math.sin(t*3)*.5+.5;this.navLight.material.emissiveIntensity=1+e*2}dispose(){this.group.traverse(t=>{t.isMesh&&(t.geometry.dispose(),t.material.dispose())})}}const Ao=20,fd=3,pd=11.5,KS=13.5;class Lr{constructor(t){this.group=new De,this.orbitRadius=pd+Math.random()*(KS-pd),this.orbitSpeed=.3+Math.random()*.2,this.angle=Math.random()*Math.PI*2,this.phaseOffset=Math.random()*Math.PI*2,this.verticalAmp=.8+Math.random()*1.2,this.cargo=Math.random()*fd,this.returning=!1,this.returnProgress=0,this.returnStart=new O,this.stationPos=new O(0,0,15),this.mesh=this._buildMesh(),this.mesh.scale.setScalar(.3),this.group.add(this.mesh),this._createTrail()}_buildMesh(){const t=new _n(1,.6,.8),e=new fe({color:13150286,metalness:.7,roughness:.3});return new Ft(t,e)}_createTrail(){const t=new Float32Array(Ao*3);this.trailGeo=new Re,this.trailGeo.setAttribute("position",new Ce(t,3)),this.trailMat=new wc({color:8173662,transparent:!0,opacity:.4,blending:Pn,depthWrite:!1}),this.trail=new Pf(this.trailGeo,this.trailMat),this.trailPositions=[];for(let e=0;e<Ao;e++)this.trailPositions.push(new O)}update(t,e){this.returning?this._updateReturn(t):(this._updateOrbit(t,e),this.cargo+=t*.5,this.cargo>=fd&&(this.returning=!0,this.returnProgress=0,this.returnStart.copy(this.group.position))),this._updateTrail()}_updateOrbit(t,e){this.angle+=this.orbitSpeed*t;const n=Math.sin(this.phaseOffset+e*.7)*.4;this.group.position.set(Math.cos(this.angle)*(this.orbitRadius+n),Math.sin(this.phaseOffset+e*.5)*this.verticalAmp,Math.sin(this.angle)*(this.orbitRadius+n));const s=.1,r=Math.cos(this.angle+s)*this.orbitRadius,a=Math.sin(this.angle+s)*this.orbitRadius;this.mesh.lookAt(r,this.group.position.y,a)}_updateReturn(t){if(this.returnProgress+=t*.5,this.returnProgress>=1){this.returning=!1,this.cargo=0,this.returnProgress=0;return}const e=this.returnProgress,n=e*e*(3-2*e);this.group.position.lerpVectors(this.returnStart,this.stationPos,n),this.mesh.lookAt(this.stationPos),this.trailMat.opacity=.7}_updateTrail(){for(let e=Ao-1;e>0;e--)this.trailPositions[e].copy(this.trailPositions[e-1]);this.trailPositions[0].copy(this.group.position);const t=this.trailGeo.attributes.position.array;for(let e=0;e<Ao;e++)t[e*3]=this.trailPositions[e].x,t[e*3+1]=this.trailPositions[e].y,t[e*3+2]=this.trailPositions[e].z;this.trailGeo.attributes.position.needsUpdate=!0,this.returning||(this.trailMat.opacity+=(.25-this.trailMat.opacity)*.1)}dispose(){this.mesh.traverse(t=>{t.isMesh&&(t.geometry.dispose(),t.material.dispose())}),this.trailGeo.dispose(),this.trailMat.dispose()}}class JS extends Lr{_buildMesh(){const t=new De,e=new _n(1,.6,.7),n=new fe({color:13404211,metalness:.8,roughness:.3});t.add(new Ft(e,n));const s=new Ac(.15,.6,6),r=new fe({color:8947848,metalness:.9,roughness:.2}),a=new Ft(s,r);a.rotation.z=-Math.PI/2,a.position.set(.7,-.1,0),this._drill=a,t.add(a);const l=new _n(.3,.2,.5),c=new fe({color:8173662,emissive:8173662,emissiveIntensity:.5}),h=new Ft(l,c);return h.position.set(-.3,.2,0),t.add(h),t}update(t,e){super.update(t,e),this._drill&&(this._drill.rotation.y+=t*8)}}class ZS extends Lr{_buildMesh(){const t=new De,e=new vn(.4,12,12),n=new fe({color:4491468,metalness:.7,roughness:.3}),s=new Ft(e,n);s.scale.set(1.2,.7,.9),t.add(s);const r=new Vn(.02,.02,.5,4),a=new fe({color:13421772,metalness:.8,roughness:.2}),l=new Ft(r,a);l.position.set(0,.45,0),t.add(l);const c=new vn(.04,6,6),h=new fe({color:16729156,emissive:16729156,emissiveIntensity:2}),d=new Ft(c,h);d.position.set(0,.72,0),this._tip=d,t.add(d);const p=new Dr(.15,8),m=new fe({color:11184810,metalness:.9,roughness:.1,side:Ze}),y=new Ft(p,m);return y.position.set(.35,.1,0),y.rotation.y=Math.PI/2,t.add(y),t}update(t,e){super.update(t,e),this._tip&&(this._tip.material.emissiveIntensity=1+Math.sin(e*5)*1.5)}}class QS extends Lr{_buildMesh(){const t=new De,e=new vn(.3,10,10),n=new fe({color:5592405,metalness:.8,roughness:.3});t.add(new Ft(e,n));const s=new vn(.05,6,6),r=new fe({color:16720384,emissive:16720384,emissiveIntensity:2});for(let l=-1;l<=1;l+=2){const c=new Ft(s,r);c.position.set(.2,.1,l*.12),t.add(c)}this._legs=[];const a=new fe({color:7829367,metalness:.7,roughness:.4});for(let l=0;l<6;l++){const c=l/6*Math.PI*2,h=new Vn(.015,.015,.4,4),d=new Ft(h,a);d.position.set(Math.cos(c)*.25,-.15,Math.sin(c)*.25),d.rotation.z=Math.cos(c)*.6,d.rotation.x=Math.sin(c)*.6,this._legs.push(d),t.add(d)}return t}update(t,e){super.update(t,e);for(let n=0;n<this._legs.length;n++){const s=n/this._legs.length*Math.PI*2;this._legs[n].rotation.z+=Math.sin(e*4+s)*t*2}}}class tE extends Lr{_buildMesh(){const t=new De,e=new Vn(.35,.35,.12,16),n=new fe({color:4500172,metalness:.7,roughness:.3});t.add(new Ft(e,n));const s=new vn(.2,12,8,0,Math.PI*2,0,Math.PI/2),r=new fe({color:8969727,metalness:.5,roughness:.2,transparent:!0,opacity:.7}),a=new Ft(s,r);a.position.y=.06,t.add(a);const l=new Hs(.45,.03,8,24),c=new fe({color:13150286,emissive:13150286,emissiveIntensity:.5,metalness:.8,roughness:.2});this._ring1=new Ft(l,c),this._ring1.rotation.x=Math.PI/2,t.add(this._ring1);const h=new Hs(.32,.02,8,20);this._ring2=new Ft(h,c.clone()),this._ring2.rotation.x=Math.PI/2,t.add(this._ring2);const d=new Dr(.15,8),p=new fe({color:4508927,emissive:4508927,emissiveIntensity:2,side:Ze}),m=new Ft(d,p);return m.rotation.x=Math.PI/2,m.position.y=-.07,t.add(m),t}update(t,e){super.update(t,e),this._ring1&&(this._ring1.rotation.z=e*2),this._ring2&&(this._ring2.rotation.z=-e*3)}}class eE extends Lr{_buildMesh(){const t=new De,e=new _n(1.2,.5,.8),n=new fe({color:6706483,metalness:.85,roughness:.3});t.add(new Ft(e,n));const s=new _n(.1,.4,.7),r=new fe({color:8943428,metalness:.9,roughness:.2}),a=new Ft(s,r);a.position.set(.65,0,0),t.add(a);const l=new Vn(.2,.25,.15,8),c=new fe({color:7824964,metalness:.8,roughness:.3}),h=new Ft(l,c);h.position.set(-.1,.3,0),t.add(h);const d=new Vn(.05,.06,.7,6),p=new fe({color:5592405,metalness:.9,roughness:.2});this._cannon=new Ft(d,p),this._cannon.rotation.z=Math.PI/2,this._cannon.position.set(.25,.35,0),t.add(this._cannon);const m=new _n(1,.15,.15),y=new fe({color:3355443,metalness:.6,roughness:.6});for(let v=-1;v<=1;v+=2){const f=new Ft(m,y);f.position.set(0,-.2,v*.45),t.add(f)}const M=new Dr(.06,6),b=new fe({color:16737792,emissive:16737792,emissiveIntensity:1.5,side:Ze});for(let v=0;v<2;v++){const f=new Ft(M,b);f.position.set(-.6,-.05+v*.15,0),f.rotation.y=Math.PI/2,t.add(f)}return t}update(t,e){super.update(t,e),this._cannon&&(this._cannon.rotation.y=Math.sin(e*.5)*.3)}}const nE=32,md=[JS,ZS,QS,tE,eE];class iE{constructor(){this.group=new De,this.robots=[],this.targetCount=0}setStationPosition(t){for(const e of this.robots)e.stationPos.copy(t);this._stationPos=t.clone()}syncCount(t){for(this.targetCount=Math.min(t,nE);this.robots.length<this.targetCount;){const e=this.robots.length,n=md[e%md.length],s=new n(e);this._stationPos&&s.stationPos.copy(this._stationPos),this.robots.push(s),this.group.add(s.group),this.group.add(s.trail)}for(let e=0;e<this.robots.length;e++)this.robots[e].group.visible=e<this.targetCount,this.robots[e].trail.visible=e<this.targetCount}update(t,e){for(let n=0;n<this.targetCount&&n<this.robots.length;n++)this.robots[n].update(t,e)}dispose(){for(const t of this.robots)t.dispose();this.robots=[]}}const ws=600,gd=18;class sE{constructor(t=13150286){this.group=new De;const e=new Float32Array(ws*3),n=new Float32Array(ws),s=new Float32Array(ws),r=new Float32Array(ws*3),a=new bt(t);this.velocities=[];for(let c=0;c<ws;c++){const h=11+Math.random()*gd,d=Math.random()*Math.PI*2,p=Math.acos(2*Math.random()-1),m=h*Math.sin(p)*Math.cos(d),y=h*Math.sin(p)*Math.sin(d),M=h*Math.cos(p);e[c*3]=m,e[c*3+1]=y,e[c*3+2]=M,n[c]=.15+Math.random()*.5,s[c]=.15+Math.random()*.35;const b=.8+Math.random()*.4,v=a.clone().multiplyScalar(b);r[c*3]=v.r,r[c*3+1]=v.g,r[c*3+2]=v.b;const f=new O((Math.random()-.5)*.3,(Math.random()-.5)*.15,(Math.random()-.5)*.3),D=Math.sqrt(m*m+M*M)+.001,I=.08;f.x+=-M/D*I,f.z+=m/D*I,this.velocities.push(f)}const l=new Re;l.setAttribute("position",new Ce(e,3)),l.setAttribute("size",new Ce(n,1)),l.setAttribute("aOpacity",new Ce(s,1)),l.setAttribute("aColor",new Ce(r,3)),this.material=new we({vertexShader:`
        attribute float size;
        attribute float aOpacity;
        attribute vec3  aColor;
        varying float vOpacity;
        varying vec3  vColor;

        void main() {
          vOpacity = aOpacity;
          vColor   = aColor;
          vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * (200.0 / -mvPos.z);
          gl_Position  = projectionMatrix * mvPos;
        }
      `,fragmentShader:`
        uniform float uOpacity;
        varying float vOpacity;
        varying vec3  vColor;

        void main() {
          vec2 uv = gl_PointCoord - 0.5;
          // Gaussian soft-puff — no hard edges
          float alpha = exp(-dot(uv, uv) * 10.0) * vOpacity * uOpacity;
          if (alpha < 0.01) discard;
          gl_FragColor = vec4(vColor, alpha);
        }
      `,uniforms:{uOpacity:{value:.35}},transparent:!0,blending:Pn,depthWrite:!1}),this.points=new If(l,this.material),this.group.add(this.points)}setOpacity(t){this.material.uniforms.uOpacity.value=t}update(t){const e=this.points.geometry.attributes.position.array;for(let n=0;n<ws;n++){const s=n*3;if(e[s]+=this.velocities[n].x*t,e[s+1]+=this.velocities[n].y*t,e[s+2]+=this.velocities[n].z*t,Math.sqrt(e[s]**2+e[s+1]**2+e[s+2]**2)>11+gd){const a=11+Math.random()*2,l=Math.random()*Math.PI*2,c=Math.acos(2*Math.random()-1);e[s]=a*Math.sin(c)*Math.cos(l),e[s+1]=a*Math.sin(c)*Math.sin(l),e[s+2]=a*Math.cos(c)}}this.points.geometry.attributes.position.needsUpdate=!0,this.group.rotation.y+=t*.05}dispose(){this.points.geometry.dispose(),this.material.dispose()}}class _d{constructor(t=2228292,e=4456584,n=13124,s=80){const r=new bt(t),a=new bt(e),l=new bt(n);this.material=new we({vertexShader:`
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,fragmentShader:`
        ${Gn}

        uniform float uTime;
        uniform float uOpacity;
        uniform vec3  uColor1;
        uniform vec3  uColor2;
        uniform vec3  uColor3;

        varying vec2 vUv;

        void main() {
          vec2 p    = (vUv - 0.5) * 2.0;
          float dist = length(p);

          // Circular falloff — sharp center, soft edge
          float falloff = smoothstep(1.0, 0.12, dist);

          // Domain-warped noise for organic cloud shapes
          vec2 q = vec2(
            fbm(p * 1.5 + uTime * 0.010, 4),
            fbm(p * 1.5 + vec2(1.7, 9.2) + uTime * 0.008, 4)
          );
          float n1 = fbm(p * 2.0 + q * 2.0 + uTime * 0.012, 5);
          float n2 = fbm(p * 3.5 + q * 1.5 - uTime * 0.008, 4);
          float n3 = fbm(p * 5.0 - q * 1.0 + uTime * 0.006, 3);

          float density = n1 * 0.55 + n2 * 0.30 + n3 * 0.15;
          density = pow(density, 1.2);
          density *= falloff;

          // Three-channel color blend
          vec3 color = mix(uColor1, uColor2, n1);
          color = mix(color, uColor3, n2 * 0.4);

          // Emission hotspots — 2 scattered bright cores
          float h1 = smoothstep(0.35, 0.0, length(p - vec2( 0.20,  0.15)));
          float h2 = smoothstep(0.25, 0.0, length(p - vec2(-0.18, -0.22)));
          color += (uColor1 * 1.8 + vec3(0.4)) * (h1 + h2) * 0.5;

          // Bright inner core glow
          float core = smoothstep(0.45, 0.0, dist);
          color += uColor2 * core * 0.4;

          float alpha = density * 0.40 * uOpacity;
          if (alpha < 0.005) discard;

          gl_FragColor = vec4(color, alpha);
        }
      `,uniforms:{uTime:{value:0},uOpacity:{value:1},uColor1:{value:new O(r.r,r.g,r.b)},uColor2:{value:new O(a.r,a.g,a.b)},uColor3:{value:new O(l.r,l.g,l.b)}},transparent:!0,depthWrite:!1,side:Ze,blending:Pn});const c=new js(s,s);this.mesh=new Ft(c,this.material),this.mesh.renderOrder=-10}update(t,e){this.material.uniforms.uTime.value=t,this.mesh.lookAt(e.position)}dispose(){this.mesh.geometry.dispose(),this.material.dispose()}}const Ln=400;class rE{constructor(t=9074016){this.group=new De,this._orbitAngles=new Float32Array(Ln),this._orbitRadii=new Float32Array(Ln),this._orbitSpeeds=new Float32Array(Ln),this._orbitHeights=new Float32Array(Ln),this._scales=new Float32Array(Ln),this._selfRotAxes=[],this._selfRotAngles=new Float32Array(Ln),this._selfRotSpeeds=new Float32Array(Ln);const e=new Rc(1,1),n=new fe({roughness:.92,metalness:.04,color:new bt(t),transparent:!0,opacity:1});this.mesh=new nS(e,n,Ln),this.mesh.instanceMatrix.setUsage(E0),this.mesh.castShadow=!1,this.mesh.receiveShadow=!1;const s=new Te,r=new bt;for(let a=0;a<Ln;a++){this._orbitAngles[a]=Math.random()*Math.PI*2,this._orbitRadii[a]=20+Math.random()*15,this._orbitSpeeds[a]=(.03+Math.random()*.06)*(Math.random()<.5?1:-1),this._orbitHeights[a]=(Math.random()-.5)*4,this._scales[a]=.05+Math.random()*.2,this._selfRotAxes.push(new O(Math.random(),Math.random(),Math.random()).normalize()),this._selfRotAngles[a]=Math.random()*Math.PI*2,this._selfRotSpeeds[a]=.2+Math.random()*.8;const l=this._orbitAngles[a],c=this._orbitRadii[a];s.position.set(Math.cos(l)*c,this._orbitHeights[a],Math.sin(l)*c),s.scale.setScalar(this._scales[a]),s.rotation.set(Math.random()*Math.PI*2,Math.random()*Math.PI*2,0),s.updateMatrix(),this.mesh.setMatrixAt(a,s.matrix);const h=.06+Math.random()*.05,d=.12+Math.random()*.25,p=.18+Math.random()*.22;r.setHSL(h,d,p),this.mesh.setColorAt(a,r)}this.mesh.instanceMatrix.needsUpdate=!0,this.mesh.instanceColor&&(this.mesh.instanceColor.needsUpdate=!0),this.group.add(this.mesh),this._dummy=new Te,this._quat=new qs}update(t){const e=this._dummy,n=this._quat;for(let s=0;s<Ln;s++){this._orbitAngles[s]+=this._orbitSpeeds[s]*t,this._selfRotAngles[s]+=this._selfRotSpeeds[s]*t;const r=this._orbitAngles[s],a=this._orbitRadii[s];e.position.set(Math.cos(r)*a,this._orbitHeights[s],Math.sin(r)*a),e.scale.setScalar(this._scales[s]),n.setFromAxisAngle(this._selfRotAxes[s],this._selfRotAngles[s]),e.quaternion.copy(n),e.updateMatrix(),this.mesh.setMatrixAt(s,e.matrix)}this.mesh.instanceMatrix.needsUpdate=!0}dispose(){this.mesh.geometry.dispose(),this.mesh.material.dispose()}}class oE{constructor(t=16755251,e=1){this.group=new De,this.intensity=e;const n=new bt(t);this.centralSprite=this._createGlowSprite(n,8,1),this.group.add(this.centralSprite),this.rings=[];const s=[{color:n.clone().lerp(new bt(16777215),.3),size:3,offset:12,opacity:.3},{color:n.clone().lerp(new bt(16729088),.4),size:2,offset:18,opacity:.15},{color:n.clone(),size:1.5,offset:25,opacity:.1}];for(const r of s){const a=this._createGlowSprite(r.color,r.size,r.opacity);a.position.y=r.offset,this.rings.push(a),this.group.add(a)}}_createGlowSprite(t,e,n){const s=document.createElement("canvas");s.width=128,s.height=128;const r=s.getContext("2d"),a=64,l=64,c=r.createRadialGradient(a,l,0,a,l,64);c.addColorStop(0,`rgba(255,255,255,${n})`),c.addColorStop(.15,`rgba(${Math.floor(t.r*255)},${Math.floor(t.g*255)},${Math.floor(t.b*255)},${n*.7})`),c.addColorStop(.5,`rgba(${Math.floor(t.r*255)},${Math.floor(t.g*255)},${Math.floor(t.b*255)},${n*.15})`),c.addColorStop(1,"rgba(0,0,0,0)"),r.fillStyle=c,r.fillRect(0,0,128,128),r.strokeStyle=`rgba(${Math.floor(t.r*255)},${Math.floor(t.g*255)},${Math.floor(t.b*255)},${n*.3})`,r.lineWidth=1;for(let m=0;m<4;m++){const y=m/4*Math.PI;r.beginPath(),r.moveTo(a+Math.cos(y)*10,l+Math.sin(y)*10),r.lineTo(a+Math.cos(y)*60,l+Math.sin(y)*60),r.stroke()}const h=new Tc(s),d=new ra({map:h,transparent:!0,blending:Pn,depthWrite:!1,depthTest:!1}),p=new bc(d);return p.scale.setScalar(e),p}update(t,e){const n=.85+Math.sin(e*1.2)*.15;this.centralSprite.scale.setScalar(8*n*this.intensity),new O().subVectors(this.group.getWorldPosition(new O),t.position).normalize();for(let r=0;r<this.rings.length;r++){const a=.7+Math.sin(e*.8+r*1.5)*.3;this.rings[r].scale.setScalar((3-r)*a*this.intensity)}}dispose(){this.group.traverse(t=>{t.isSprite&&(t.material.map.dispose(),t.material.dispose())})}}class aE{constructor(t,e){var c;this.id=t.id,this.def=t,this.group=new De,this.group.position.copy(e),this.group.userData.type="solarSystem",this.group.userData.planetId=t.id;const n=t.orbit||{radius:0,speed:0,inclination:0,phase:0};this.orbitRadius=n.radius,this.orbitSpeed=n.speed,this.orbitInclination=n.inclination,this.orbitPhase=n.phase,this._cachedPlanetWorldPos=new O,this._createOrbitLine(t),this.orbitGroup=new De,this.group.add(this.orbitGroup),this.planet=new jS(t),this.orbitGroup.add(this.planet.group),this.station=new YS,this.orbitGroup.add(this.station.group),this.robotManager=new iE,this.orbitGroup.add(this.robotManager.group),this._lastStationSync=0,this.dustCloud=new sE(t.glow),this.orbitGroup.add(this.dustCloud.group);const s=((c=t.nebulaPalette)==null?void 0:c.colors)||["#110022","#220044","#003344","#220055","#004455"],r=s[4]||s[2]||"#003344";if(this.nebulaVolume=new _d(s[1]||s[0],s[3]||s[1],r,80),this.nebulaVolume.mesh.position.set(0,0,-20),this.orbitGroup.add(this.nebulaVolume.mesh),this.nebulaVolume2=new _d(s[3]||s[0],s[0],s[2]||s[1],70),this.nebulaVolume2.mesh.position.set(5,3,-30),this.nebulaVolume2.mesh.rotation.z=Math.PI/4,this.orbitGroup.add(this.nebulaVolume2.mesh),this.asteroidBelt=null,t.type!=="star"){const h=new bt(t.col||t.glow).lerp(new bt(8943462),.65);this.asteroidBelt=new rE(h.getHex()),this.orbitGroup.add(this.asteroidBelt.group)}this.lensFlare=null,t.type==="star"&&(this.lensFlare=new oE(t.glow,1),this.orbitGroup.add(this.lensFlare.group));const a=new bt(t.glow);this.rimLight=new Kl(a,.8,50,1.5),this.rimLight.position.set(-8,3,12),this.orbitGroup.add(this.rimLight);const l=a.clone().lerp(new bt(16777215),.3);this.fillLight=new Kl(l,.3,35,2),this.fillLight.position.set(5,-6,5),this.orbitGroup.add(this.fillLight),this._createLabel(t.name),this._onRobotsChanged=()=>this._syncRobots(),this._onPlanetChanged=()=>this._syncRobots(),this._onStateLoaded=()=>this._syncRobots(),this._syncRobots(),Ct.on("robotsChanged",this._onRobotsChanged),Ct.on("planetChanged",this._onPlanetChanged),Ct.on("stateLoaded",this._onStateLoaded),this._updateOrbit(0)}_createOrbitLine(t){if(this.orbitRadius===0)return;const e=128,n=[],s=this.orbitRadius,r=this.orbitInclination;for(let c=0;c<=e;c++){const h=c/e*Math.PI*2;n.push(new O(Math.cos(h)*s,Math.sin(r)*Math.sin(h)*s*.3,Math.sin(h)*s))}const a=new Re().setFromPoints(n),l=new bt(t.glow);this.orbitLineMaterial=new wc({color:l,transparent:!0,opacity:.06,depthWrite:!1}),this.orbitLine=new Pf(a,this.orbitLineMaterial),this.group.add(this.orbitLine)}_syncRobots(){const e=Ct.activePlanet===this.id?Ct.robots:0;this.robotManager.syncCount(e)}_createLabel(t){const e=document.createElement("canvas");e.width=256,e.height=64;const n=e.getContext("2d");n.font="bold 32px Orbitron, monospace",n.textAlign="center",n.fillStyle="#c8a84e",n.fillText(t,128,42);const s=new Tc(e);s.minFilter=gn;const r=new ra({map:s,transparent:!0,depthWrite:!1});this.label=new bc(r),this.label.scale.set(12,3,1),this.label.position.set(0,14,0),this.orbitGroup.add(this.label)}get clickTarget(){return this.planet.clickTarget}get worldPosition(){return this.group.position}get planetWorldPosition(){return this.orbitGroup.getWorldPosition(this._cachedPlanetWorldPos),this._cachedPlanetWorldPos}_updateOrbit(t){if(this.orbitRadius===0)return;const e=t*this.orbitSpeed+this.orbitPhase,n=this.orbitRadius;this.orbitGroup.position.set(Math.cos(e)*n,Math.sin(this.orbitInclination)*Math.sin(e)*n*.3,Math.sin(e)*n)}updateLOD(t,e,n,s){this._updateOrbit(e),t<180&&this.planet.update(e);const r=t<80;this.station.group.visible=r,r&&(this.station.update(e),e-this._lastStationSync>.2&&(this._lastStationSync=e,this.robotManager.setStationPosition(this.station.group.position)));const a=t<60;if(this.robotManager.group.visible=a,a&&n!==void 0&&this.robotManager.update(n,e),this.asteroidBelt){const h=Ni.smoothstep(220,180,t);this.asteroidBelt.group.visible=h>0,h>0&&n!==void 0&&(this.asteroidBelt.update(n),this.asteroidBelt.mesh.material.opacity=h,this.asteroidBelt.mesh.material.transparent=h<.99)}const l=Ni.smoothstep(160,130,t);this.dustCloud.group.visible=l>0,l>0&&n!==void 0&&(this.dustCloud.setOpacity(.35*l),this.dustCloud.update(n,e));const c=Ni.smoothstep(350,300,t);if(this.nebulaVolume.mesh.visible=c>0,this.nebulaVolume2.mesh.visible=c>0,c>0&&s&&(this.nebulaVolume.material.uniforms.uOpacity.value=c,this.nebulaVolume.update(e,s),this.nebulaVolume2.material.uniforms.uOpacity.value=c*.7,this.nebulaVolume2.update(e,s)),this.lensFlare){const h=Ni.smoothstep(450,390,t);this.lensFlare.group.visible=h>0,h>0&&s&&(this.lensFlare.group.traverse(d=>{d.isSprite&&(d.material.opacity=h)}),this.lensFlare.update(s,e))}if(this.label.visible=t>15&&t<300,this.label.visible){const h=Math.min(1,t/50);this.label.scale.set(12*h,3*h,1)}if(this.planet.atmosphereMesh){const h=Ni.smoothstep(280,240,t);if(this.planet.atmosphereMesh.visible=h>0,h>0){const d=this.planet.def.type==="star"?1.2:.8;this.planet.atmosphereMaterial.uniforms.uAtmIntensity.value=d*h}}if(this.planet.ringMesh){const h=Ni.smoothstep(250,210,t);this.planet.ringMesh.visible=h>0,h>0&&(this.planet.ringMaterial.uniforms.uOpacity.value=.5*h)}this.rimLight.visible=t<100,this.fillLight.visible=t<100}dispose(){Ct.off("robotsChanged",this._onRobotsChanged),Ct.off("planetChanged",this._onPlanetChanged),Ct.off("stateLoaded",this._onStateLoaded),this.planet.dispose(),this.station.dispose(),this.robotManager.dispose(),this.dustCloud.dispose(),this.nebulaVolume.dispose(),this.nebulaVolume2.dispose(),this.asteroidBelt&&this.asteroidBelt.dispose(),this.orbitLine&&(this.orbitLine.geometry.dispose(),this.orbitLineMaterial.dispose()),this.lensFlare&&this.lensFlare.dispose(),this.label&&(this.label.material.map.dispose(),this.label.material.dispose())}}function lE(i){const t=new bt(i);return new O(t.r,t.g,t.b)}class cE{constructor(t){if(this.group=new De,this.size=t.size,this.size===0)return;const n=nl.star.map(lE),s=new bt(t.color);n[0]=new O(n[0].x*.5+s.r*.5,n[0].y*.5+s.g*.5,n[0].z*.5+s.b*.5),this.material=new we({vertexShader:Zl.vertex,fragmentShader:Zl.fragment,uniforms:{uTime:{value:0},uColors:{value:n},uLightDir:{value:new O(1,.5,-.3).normalize()}}});const r=new vn(this.size,32,32);this.mesh=new Ft(r,this.material),this.group.add(this.mesh),this.light=new Kl(s,1.5,50,1.5),this.group.add(this.light)}update(t){this.size!==0&&(this.material.uniforms.uTime.value=t)}dispose(){this.size!==0&&(this.mesh.geometry.dispose(),this.material.dispose())}}class hE{constructor(){this.group=new De,this.systems={},this.worldPositions=OS(),this.centralStar=new cE(LS);const t=this.worldPositions[qi[0].id];this.centralStar.group.position.copy(t),this.group.add(this.centralStar.group),this._createSystems()}_createSystems(){for(const t of qi){const e=this.worldPositions[t.id],n=new aE(t,e);this.systems[t.id]=n,this.group.add(n.group)}}getSystem(t){return this.systems[t]}getPosition(t){return this.worldPositions[t]}getPlanetWorldPosition(t){var e;return(e=this.systems[t])==null?void 0:e.planetWorldPosition}getClickTargets(){const t=[];for(const e in this.systems)t.push({mesh:this.systems[e].clickTarget,planetId:e,system:this.systems[e]});return t}update(t,e,n){const s=t.position;this.centralStar.update(n);for(const r in this.systems){const a=this.systems[r],l=s.distanceTo(a.planetWorldPosition);l>430?(a.group.visible=!0,a._updateOrbit(n),Math.random()<.1&&a.updateLOD(l,n,e,t)):a.updateLOD(l,n,e,t)}}dispose(){this.centralStar.dispose();for(const t in this.systems)this.systems[t].dispose()}}const Ts=2048,uE=2e3,Kn=2e3;class dE{constructor(t){this.scene=t,this._createStarCubemap(),this._createTwinkleStars(),this._createNebulaBackground(),this._targetNeb1=new O(.18,.05,.4),this._targetNeb2=new O(.65,.35,.08),this._targetNeb3=new O(.05,.45,.55),this._targetMilkyWay=.55,this.targetDensity=.55}_createStarCubemap(){const t=[];for(let n=0;n<6;n++){const s=document.createElement("canvas");s.width=Ts,s.height=Ts;const r=s.getContext("2d");r.fillStyle="#050810",r.fillRect(0,0,Ts,Ts);for(let a=0;a<uE;a++){const l=Math.random()*Ts,c=Math.random()*Ts,h=.3+Math.random()*.7,d=.3+Math.random()*3.7,p=Math.random();let m,y,M;if(p<.15?(m=.55,y=.65,M=1):p<.35?(m=.75,y=.82,M=1):p<.6?(m=1,y=1,M=.95):p<.8?(m=1,y=.9,M=.7):(m=1,y=.6,M=.4),r.fillStyle=`rgba(${Math.floor(m*255)},${Math.floor(y*255)},${Math.floor(M*255)},${h})`,r.beginPath(),r.arc(l,c,d,0,Math.PI*2),r.fill(),h>.55&&d>.8){const b=d*4,v=r.createRadialGradient(l,c,0,l,c,b);v.addColorStop(0,`rgba(${Math.floor(m*255)},${Math.floor(y*255)},${Math.floor(M*255)},${h*.18})`),v.addColorStop(1,"rgba(0,0,0,0)"),r.fillStyle=v,r.beginPath(),r.arc(l,c,b,0,Math.PI*2),r.fill()}if(Math.random()<.05&&h>.65&&d>1.2){const b=d*18;r.save();for(let v=0;v<4;v++){const f=v/4*Math.PI,D=Math.cos(f),I=Math.sin(f),C=h*.3,z=r.createLinearGradient(l,c,l+D*b,c+I*b);z.addColorStop(0,`rgba(${Math.floor(m*255)},${Math.floor(y*255)},${Math.floor(M*255)},${C})`),z.addColorStop(1,"rgba(0,0,0,0)"),r.strokeStyle=z,r.lineWidth=.8,r.beginPath(),r.moveTo(l,c),r.lineTo(l+D*b,c+I*b),r.stroke();const N=r.createLinearGradient(l,c,l-D*b,c-I*b);N.addColorStop(0,`rgba(${Math.floor(m*255)},${Math.floor(y*255)},${Math.floor(M*255)},${C})`),N.addColorStop(1,"rgba(0,0,0,0)"),r.strokeStyle=N,r.beginPath(),r.moveTo(l,c),r.lineTo(l-D*b,c-I*b),r.stroke()}r.restore()}}t.push(s)}const e=new yc(t);e.colorSpace=ln,e.needsUpdate=!0,this.scene.background=e}_createTwinkleStars(){const t=new Float32Array(Kn*3),e=new Float32Array(Kn*3),n=new Float32Array(Kn);this._twinklePhases=new Float32Array(Kn),this._twinkleSpeeds=new Float32Array(Kn),this._twinkleBaseSizes=new Float32Array(Kn);for(let r=0;r<Kn;r++){const a=300+Math.random()*500,l=Math.random()*Math.PI*2,c=Math.acos(2*Math.random()-1);t[r*3]=a*Math.sin(c)*Math.cos(l),t[r*3+1]=a*Math.sin(c)*Math.sin(l),t[r*3+2]=a*Math.cos(c);const h=Math.random();h<.2?(e[r*3]=.6,e[r*3+1]=.72,e[r*3+2]=1):h<.45?(e[r*3]=.85,e[r*3+1]=.92,e[r*3+2]=1):h<.7?(e[r*3]=1,e[r*3+1]=.98,e[r*3+2]=.92):h<.88?(e[r*3]=1,e[r*3+1]=.88,e[r*3+2]=.68):(e[r*3]=1,e[r*3+1]=.65,e[r*3+2]=.45),n[r]=Math.random()<.1?3:1,this._twinklePhases[r]=Math.random()*Math.PI*2,this._twinkleSpeeds[r]=1+Math.random()*3,this._twinkleBaseSizes[r]=1+Math.random()*2.5}const s=new Re;s.setAttribute("position",new Ce(t,3)),s.setAttribute("color",new Ce(e,3)),s.setAttribute("aGlowFactor",new Ce(n,1)),this._twinkleSizeAttr=new Ce(new Float32Array(Kn),1),s.setAttribute("size",this._twinkleSizeAttr),this._twinkleMaterial=new we({vertexShader:`
        attribute float size;
        attribute float aGlowFactor;
        attribute vec3 color;
        varying vec3 vColor;
        varying float vGlow;

        void main() {
          vColor = color;
          vGlow  = aGlowFactor;
          vec4 mvPos  = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * aGlowFactor * (300.0 / -mvPos.z);
          gl_Position  = projectionMatrix * mvPos;
        }
      `,fragmentShader:`
        varying vec3 vColor;
        varying float vGlow;

        void main() {
          vec2 uv   = gl_PointCoord - 0.5;
          float dist = length(uv);

          // Soft-circle core
          float core = smoothstep(0.5, 0.08, dist);
          // Gaussian glow halo — larger for super-bright stars
          float halo = exp(-dist * dist * 8.0) * vGlow * 0.45;

          float alpha = clamp(core + halo, 0.0, 1.0) * 0.88;
          if (alpha < 0.01) discard;

          // Halo tinted slightly blue for lens-effect
          vec3 col = vColor + vec3(0.0, 0.05, 0.12) * halo;
          gl_FragColor = vec4(col, alpha);
        }
      `,transparent:!0,blending:Pn,depthWrite:!1}),this._twinklePoints=new If(s,this._twinkleMaterial),this._twinklePoints.renderOrder=-500,this.scene.add(this._twinklePoints)}_createNebulaBackground(){const t=new js(2,2);this.nebulaMaterial=new we({vertexShader:`
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position.xy, 0.9999, 1.0);
        }
      `,fragmentShader:`
        ${Gn}

        uniform float uTime;
        uniform vec2  uResolution;
        uniform float uDensity;
        uniform float uOpacity;

        // Three-channel nebula colors
        uniform vec3 uNebulaColor1;   // deep purple/blue
        uniform vec3 uNebulaColor2;   // orange/gold
        uniform vec3 uNebulaColor3;   // teal/cyan
        uniform float uMilkyWayStrength;

        varying vec2 vUv;

        // Domain-warped FBM: q offsets uv by an fbm field before sampling
        float warpedFbm(vec2 uv, float warpScale, int oct) {
          vec2 q = vec2(
            fbm(uv,                       oct),
            fbm(uv + vec2(5.2, 1.3),      oct)
          );
          return fbm(uv + q * warpScale, oct);
        }

        void main() {
          vec2 uv = vUv;
          uv.x *= uResolution.x / uResolution.y;
          float t = uTime * 0.004; // very slow drift

          // Channel 1 — deep purple/blue structure (dominant large forms)
          float n1 = warpedFbm(uv * 1.8 + t, 1.8, 6);
          n1 = pow(max(0.0, n1 - (1.0 - uDensity)), 1.3);

          // Channel 2 — orange/gold wisps (medium-scale filaments)
          float n2 = warpedFbm(uv * 2.4 - t * 0.7 + vec2(3.1, 1.7), 1.4, 5);
          n2 = pow(max(0.0, n2 - 0.45), 1.6);

          // Channel 3 — teal/cyan tendrils (fine detail)
          float n3 = warpedFbm(uv * 3.1 + t * 0.5 + vec2(7.3, 4.1), 1.2, 4);
          n3 = pow(max(0.0, n3 - 0.50), 1.8);

          vec3 nebColor = uNebulaColor1 * n1
                        + uNebulaColor2 * n2 * 0.7
                        + uNebulaColor3 * n3 * 0.5;
          float totalDensity = n1 + n2 * 0.6 + n3 * 0.4;

          // Milky Way band — gaussian strip with structured noise inside
          float bandY    = (vUv.y - 0.45) * 3.5;
          float mwBand   = exp(-bandY * bandY);
          float mwNoise  = fbm(vec2(uv.x * 4.0 + t * 0.3, uv.y * 8.0), 4);
          float mwDensity = mwBand * mwNoise * uMilkyWayStrength;
          nebColor     += vec3(0.60, 0.65, 0.85) * mwDensity;
          totalDensity += mwDensity * 0.5;

          // Bright emission hotspots (5 scattered nebula cores)
          vec2 p = vUv;
          float h = 0.0;
          h += exp(-dot(p - vec2(0.25,0.60), p - vec2(0.25,0.60)) * 25.0) * 0.5;
          h += exp(-dot(p - vec2(0.75,0.40), p - vec2(0.75,0.40)) * 25.0) * 0.5;
          h += exp(-dot(p - vec2(0.50,0.25), p - vec2(0.50,0.25)) * 25.0) * 0.4;
          h += exp(-dot(p - vec2(0.15,0.35), p - vec2(0.15,0.35)) * 25.0) * 0.3;
          h += exp(-dot(p - vec2(0.85,0.70), p - vec2(0.85,0.70)) * 25.0) * 0.3;
          nebColor += (uNebulaColor1 * 1.5 + vec3(0.3)) * h;

          // Vignette
          float vig = 1.0 - length(vUv - 0.5) * 0.65;
          vig = clamp(vig, 0.0, 1.0);

          float alpha = clamp(totalDensity * 0.35, 0.0, 0.35) * vig * uOpacity;
          if (alpha < 0.003) discard;

          gl_FragColor = vec4(nebColor, alpha);
        }
      `,uniforms:{uTime:{value:0},uResolution:{value:new Mt(window.innerWidth,window.innerHeight)},uDensity:{value:.55},uOpacity:{value:1},uNebulaColor1:{value:new O(.18,.05,.4)},uNebulaColor2:{value:new O(.65,.35,.08)},uNebulaColor3:{value:new O(.05,.45,.55)},uMilkyWayStrength:{value:.55}},transparent:!0,depthWrite:!1,depthTest:!1,blending:Pn}),this.nebulaMesh=new Ft(t,this.nebulaMaterial),this.nebulaMesh.renderOrder=-1e3,this.nebulaMesh.frustumCulled=!1,this.scene.add(this.nebulaMesh)}setPlanetPalette(t){if(!(t!=null&&t.nebulaPalette))return;const{colors:e,density:n}=t.nebulaPalette;if(e[0]){const s=new bt(e[0]);this._targetNeb1.set(s.r*.7,s.g*.4,s.b)}if(e[2]){const s=new bt(e[2]);this._targetNeb2.set(s.r+.15,s.g*.8,s.b*.3)}if(e[4]){const s=new bt(e[4]);this._targetNeb3.set(s.r*.2,s.g*.6+.2,s.b*.8+.1)}this.targetDensity=n||.55,this._targetMilkyWay=.4+Math.random()*.25}update(t){const e=this.nebulaMaterial.uniforms;e.uTime.value=t;const n=.012;e.uNebulaColor1.value.lerp(this._targetNeb1,n),e.uNebulaColor2.value.lerp(this._targetNeb2,n),e.uNebulaColor3.value.lerp(this._targetNeb3,n),e.uDensity.value+=(this.targetDensity-e.uDensity.value)*n,e.uMilkyWayStrength.value+=(this._targetMilkyWay-e.uMilkyWayStrength.value)*n;const s=this._twinkleSizeAttr.array;for(let r=0;r<Kn;r++){const a=.4+.6*(Math.sin(t*this._twinkleSpeeds[r]+this._twinklePhases[r])*.5+.5);s[r]=this._twinkleBaseSizes[r]*a}this._twinkleSizeAttr.needsUpdate=!0}resize(t,e){this.nebulaMaterial.uniforms.uResolution.value.set(t,e)}}const fE=8,vd=.6;class pE{constructor(t){this.scene=t,this.activeRings=[]}spawn(t,e,n){const s=new oa(.3,.5,32),r=new ia({color:13150286,transparent:!0,opacity:.8,side:Ze,depthWrite:!1,blending:Pn}),a=new Ft(s,r);a.position.copy(t),a.lookAt(t.clone().add(e)),this.scene.add(a);const l=this._createNumberSprite(n);l.position.copy(t).add(e.clone().multiplyScalar(.5)),this.scene.add(l);const c={ring:a,sprite:l,age:0,normal:e.clone(),startPos:t.clone()};for(this.activeRings.push(c);this.activeRings.length>fE;){const h=this.activeRings.shift();this.scene.remove(h.ring),this.scene.remove(h.sprite),h.ring.geometry.dispose(),h.ring.material.dispose(),h.sprite.material.map.dispose(),h.sprite.material.dispose()}}_createNumberSprite(t){const e=document.createElement("canvas");e.width=128,e.height=64;const n=e.getContext("2d");n.font="bold 36px Orbitron, monospace",n.textAlign="center",n.fillStyle="#c8a84e",n.fillText("+"+t,64,44);const s=new Tc(e);s.minFilter=gn;const r=new ra({map:s,transparent:!0,depthWrite:!1,depthTest:!1}),a=new bc(r);return a.scale.set(3,1.5,1),a}update(t){for(let e=this.activeRings.length-1;e>=0;e--){const n=this.activeRings[e];if(n.age+=t,n.age>=vd){this.scene.remove(n.ring),this.scene.remove(n.sprite),n.ring.geometry.dispose(),n.ring.material.dispose(),n.sprite.material.map.dispose(),n.sprite.material.dispose(),this.activeRings.splice(e,1);continue}const s=n.age/vd,r=1+s*4;n.ring.scale.setScalar(r),n.ring.material.opacity=(1-s)*.8,n.sprite.position.copy(n.startPos).add(n.normal.clone().multiplyScalar(.5+s*3)),n.sprite.material.opacity=1-s}}}const mE={name:"GodRayShader",uniforms:{tDiffuse:{value:null},uLightPos:{value:new Mt(.5,.5)},uDecay:{value:.96},uDensity:{value:.85},uWeight:{value:.35},uExposure:{value:.18},uEnabled:{value:0}},vertexShader:`
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,fragmentShader:`
    #define NUM_SAMPLES 64

    uniform sampler2D tDiffuse;
    uniform vec2  uLightPos;
    uniform float uDecay;
    uniform float uDensity;
    uniform float uWeight;
    uniform float uExposure;
    uniform float uEnabled;

    varying vec2 vUv;

    void main() {
      vec4 base = texture2D(tDiffuse, vUv);

      // Zero-cost early exit when god rays are off
      if (uEnabled < 0.01) {
        gl_FragColor = base;
        return;
      }

      vec2 texCoord = vUv;
      vec2 deltaTexCoord = (texCoord - uLightPos) * (1.0 / float(NUM_SAMPLES)) * uDensity;

      float illuminationDecay = 1.0;
      vec4  accum = vec4(0.0);

      for (int i = 0; i < NUM_SAMPLES; i++) {
        texCoord -= deltaTexCoord;
        vec2 clamped = clamp(texCoord, 0.0, 1.0);
        vec4 sample  = texture2D(tDiffuse, clamped);
        sample      *= illuminationDecay * uWeight;
        accum       += sample;
        illuminationDecay *= uDecay;
      }

      // Additive blend over original frame
      gl_FragColor = base + accum * uExposure * uEnabled;
    }
  `};function gE(){const i=document.getElementById("game-container"),t=new RS(i),e=new dS,n=new cn(60,window.innerWidth/window.innerHeight,.1,2e3),s=new MS(n,t.domElement);t.setupPostProcessing(e.scene,n),t.addGodRayPass(mE);const r=new IS(n,e.scene,t.domElement,s),a=new PS(t,s,e),l=new dE(e.scene);l.setPlanetPalette(Ct.activePlanetDef);const c=new pE(e.scene),h=new hE;e.add(h.group);const d=Object.values(h.systems).map(M=>({get position(){return M.planetWorldPosition},radius:M.planet.radius}));s.setPlanetColliders(d);for(const M of h.getClickTargets())r.addClickable(M.mesh,b=>{const{planetId:v,system:f}=M;Ct.ownedPlanets.includes(v)?Ct.switchPlanet(v):Ct.colonizePlanet(v),s.trackObject(()=>f.planetWorldPosition,55)});const p=h.getSystem(Ct.activePlanet);if(p){const M=p.planetWorldPosition;s.targetTarget.copy(M),s.target.copy(M),s.spherical.radius=30,s.targetSpherical.radius=30,s.trackObject(()=>p.planetWorldPosition,55)}Ct.on("planetChanged",M=>{const b=h.getSystem(M);b&&s.trackObject(()=>b.planetWorldPosition,55),l.setPlanetPalette(Ct.activePlanetDef)}),Ct.on("planetColonized",M=>{const b=h.getSystem(M);b&&s.trackObject(()=>b.planetWorldPosition,55),l.setPlanetPalette(Ct.activePlanetDef)});const m=new Mt,y=new O;return a.onUpdate((M,b)=>{h.update(n,M,b),l.update(b),c.update(M),t.tick(b);const v=Ct.activePlanetDef;if((v==null?void 0:v.type)==="star"){const f=h.getSystem(v.id);if(f){y.copy(f.worldPosition).project(n),m.set((y.x+1)*.5,(y.y+1)*.5);const D=n.position.distanceTo(f.worldPosition),I=Math.abs(y.x)<1.8&&Math.abs(y.y)<1.8&&y.z<1,C=Ni.smoothstep(350,80,D);t.setGodRaySource(m,I?C:0)}}else t.setGodRaySource(m.set(.5,.5),0)}),window.addEventListener("resize",()=>{const M=window.innerWidth,b=window.innerHeight;n.aspect=M/b,n.updateProjectionMatrix(),t.resize(M,b),l.resize(M,b)}),a.start(),{sceneManager:e,camera:n,cameraController:s,renderPipeline:t,animationLoop:a,inputManager:r,galaxy:h,skybox:l}}const pn=i=>i>=1e12?(i/1e12).toFixed(2)+"T":i>=1e9?(i/1e9).toFixed(2)+"B":i>=1e6?(i/1e6).toFixed(2)+"M":i>=1e3?(i/1e3).toFixed(1)+"K":Math.floor(i)+"";class _E{constructor(t){if(this.game=t,this.activeTab="mining",this.minimized=!1,this.updateTimer=0,this.dom={vOre:document.getElementById("vOre"),rOre:document.getElementById("rOre"),vCrys:document.getElementById("vCrys"),rCrys:document.getElementById("rCrys"),vEnrg:document.getElementById("vEnrg"),rEnrg:document.getElementById("rEnrg"),rcCrys:document.getElementById("rcCrys"),sepCrys:document.getElementById("sepCrys"),rcEnrg:document.getElementById("rcEnrg"),barUpgrades:document.getElementById("bar-upgrades"),barMinimize:document.getElementById("bar-minimize"),bottomBar:document.getElementById("bottom-bar"),upgTooltip:document.getElementById("upg-tooltip"),planetTooltip:document.getElementById("planet-tooltip"),toast:document.getElementById("toast")},this._setupTabs(),this._setupMultiplier(),this._setupMinimize(),this._setupPlanetHover(),this._setupEvents(),this._renderUpgrades(),Ct._offlineEarnings){const e=Ct._offlineEarnings,n=Math.floor(e.elapsed/3600),s=Math.floor(e.elapsed%3600/60),r=n>0?`${n}h ${s}m`:`${s}m`;this.toast(`OFFLINE ${r}: +${pn(e.earned)} ORE`),delete Ct._offlineEarnings}else this.toast("WELCOME, COMMANDER");t.animationLoop.onUpdate(e=>this.update(e))}_setupTabs(){document.querySelectorAll(".bar-tab").forEach(t=>{t.addEventListener("pointerdown",e=>{e.stopPropagation(),this.activeTab=t.dataset.cat,document.querySelectorAll(".bar-tab").forEach(n=>n.classList.toggle("active",n===t)),this._renderUpgrades()})})}_updateTabBadges(){const t=["mining","robots","tech"];for(const e of t){const n=Fo.filter(r=>r.cat===e&&Ct.canAfford(r.id)).length,s=document.getElementById(`tbadge-${e}`);s&&(s.textContent=n>0?n:"")}}_setupMultiplier(){document.getElementById("m1").addEventListener("pointerdown",()=>this._setMult(1)),document.getElementById("m10").addEventListener("pointerdown",()=>this._setMult(10)),document.getElementById("m100").addEventListener("pointerdown",()=>this._setMult(100))}_setupMinimize(){this.dom.barMinimize.addEventListener("pointerdown",t=>{t.stopPropagation(),this._toggleMinimize()}),window.addEventListener("keydown",t=>{t.code==="Tab"&&(t.preventDefault(),this._toggleMinimize())})}_toggleMinimize(){this.minimized=!this.minimized,this.dom.bottomBar.classList.toggle("minimized",this.minimized),this.dom.barMinimize.textContent=this.minimized?"▲":"▼"}_setupPlanetHover(){this.game.inputManager.onHover((t,e,n)=>{const s=this.dom.planetTooltip;if(!t){s.classList.remove("visible");return}const r=qi.find(c=>c.id===t);if(!r)return;const a=Ct.ownedPlanets.includes(t),l=Ct.activePlanet===t;s.innerHTML=`
        <div class="pt-name">${r.name}</div>
        <div class="pt-type">${r.desc}</div>
        ${r.mb>0?`<div class="pt-bonus">+${(r.mb*100).toFixed(0)}% extraction bonus</div>`:""}
        ${a&&l?`<div class="pt-stats">
          <span>DRONES — ${pn(Ct.robots)}</span>
          <span>WORLDS — ${Ct.ownedPlanets.length}</span>
          <span>ORE/S — ${pn(Ct.oreRate)}</span>
        </div>`:""}
        ${a&&!l?'<div class="pt-type">Click to warp</div>':""}
        ${a?"":`<div class="pt-cost">⬡ ${pn(r.cost)}</div>`}
      `,s.classList.add("visible"),s.style.left=e+16+"px",s.style.top=n-10+"px"})}_setupEvents(){Ct.on("crystalUnlocked",()=>{this.dom.rcCrys.style.display="",this.dom.sepCrys.style.display="",this.toast("💎 CRYSTAL EXTRACTION ONLINE")}),Ct.on("energyUnlocked",()=>{this.dom.rcEnrg.style.display="",this.toast("⚡ FUSION REACTOR ONLINE")}),Ct.on("planetColonized",t=>{const e=qi.find(n=>n.id===t);this.toast("🌍 COLONIZED: "+(e?e.name:t))}),Ct.on("stateLoaded",()=>{Ct.crystalUnlocked&&(this.dom.rcCrys.style.display="",this.dom.sepCrys.style.display=""),Ct.energyUnlocked&&(this.dom.rcEnrg.style.display="")})}update(t){this.dom.vOre.textContent=pn(Ct.ore),this.dom.rOre.textContent="+"+pn(Ct.oreRate)+"/s",Ct.crystalUnlocked&&(this.dom.vCrys.textContent=pn(Ct.crystal),this.dom.rCrys.textContent="+"+pn(Ct.crystalRate)+"/s"),Ct.energyUnlocked&&(this.dom.vEnrg.textContent=pn(Ct.energy),this.dom.rEnrg.textContent="+"+pn(Ct.energyRate)+"/s"),this.updateTimer+=t,this.updateTimer>=.35&&(this.updateTimer=0,this._renderUpgrades())}_setMult(t){Ct.buyMult=t,[1,10,100].forEach(e=>document.getElementById("m"+e).classList.toggle("on",e===t)),this._renderUpgrades()}_renderUpgrades(){const t=this.dom.barUpgrades;t.innerHTML="";const e=Fo.filter(n=>{if(n.cat!==this.activeTab)return!1;const s=Ct.upgradeLevels[n.id]||0;return!(n.max&&s>=n.max||n.effect==="cry"&&Ct.crystalUnlocked||n.effect==="enr"&&Ct.energyUnlocked)});for(const n of e){const s=Ct.canAfford(n.id),r=Ct.upgradeLevels[n.id]||0,a=document.createElement("div");a.className="bar-upg "+(s?"can":"no"),a.innerHTML=`
        <span class="bar-upg-icon">${n.icon}</span>
        ${r>0?`<span class="upg-badge">${r}</span>`:""}
      `,a.addEventListener("mouseenter",l=>this._showUpgTooltip(n,l)),a.addEventListener("mouseleave",()=>this._hideUpgTooltip()),s&&a.addEventListener("pointerdown",l=>{l.stopPropagation(),Ct.buyUpgrade(n.id),this._renderUpgrades()}),t.appendChild(a)}this._updateTabBadges()}_showUpgTooltip(t,e){const n=Ct.upgradeCost(t.id),s=Ct.upgradeLevels[t.id]||0;let r="";n.ore>0&&(r+="⬡ "+pn(n.ore)),n.crystal>0&&(r+=(r?"  ":"")+"◈ "+pn(n.crystal)),this.dom.upgTooltip.innerHTML=`
      <div class="utt-name">${t.name}</div>
      ${s>0?`<div class="utt-level">LEVEL ${s}</div>`:""}
      <div class="utt-desc">${t.desc}</div>
      <div class="utt-cost">${r}</div>
    `,this.dom.upgTooltip.classList.add("visible");const a=e.target.closest(".bar-upg").getBoundingClientRect();this.dom.upgTooltip.style.left=a.left+"px",this.dom.upgTooltip.style.bottom=window.innerHeight-a.top+8+"px",this.dom.upgTooltip.style.top="auto"}_hideUpgTooltip(){this.dom.upgTooltip.classList.remove("visible")}toast(t){const e=this.dom.toast;e.textContent=t,e.classList.add("on"),this._toastTimer&&clearTimeout(this._toastTimer),this._toastTimer=setTimeout(()=>e.classList.remove("on"),2600)}}function vE(i){return i>=1e9?(i/1e9).toFixed(2)+"B":i>=1e6?(i/1e6).toFixed(2)+"M":i>=1e3?(i/1e3).toFixed(1)+"K":Math.floor(i).toString()}class Nf{constructor({inGame:t=!1}={}){this._inGame=t,this._resolve=null,this._newGamePending=!1,this._newGameTimer=null,this._onKeyDown=n=>{n.key==="Escape"&&this._handleResume()},this._overlay=this._buildDOM(),document.body.appendChild(this._overlay),document.addEventListener("keydown",this._onKeyDown);const e=document.getElementById("hud-overlay");e&&(e.style.visibility="hidden")}_buildDOM(){const t=document.createElement("div");t.id="landing-overlay";const e=this._inGame?"RESUME":"CONTINUE",n=this._inGame?"Return to game":"Loading...";return t.innerHTML=`
      <div id="landing-bg-gradient"></div>
      <div id="landing-scanlines"></div>
      <div id="landing-content">
        <div id="landing-logo">
          <div class="landing-logo-hex">&#x2B22;</div>
          <h1 class="landing-title">ASTRO HARVEST</h1>
          <div class="landing-subtitle">Galactic Extraction</div>
          <div class="landing-version">v1.0</div>
        </div>
        <nav id="landing-nav">
          <button class="landing-btn" id="btn-continue">
            ${e}
            <span class="landing-btn-sub" id="btn-continue-sub">${n}</span>
          </button>
          <button class="landing-btn" id="btn-cloud">
            CLOUD SAVES
            <span class="landing-btn-sub">Sync with Google account</span>
          </button>
          <button class="landing-btn" id="btn-new">
            NEW GAME
            <span class="landing-btn-sub">Start from scratch</span>
          </button>
          <button class="landing-btn" id="btn-settings">
            SETTINGS
            <span class="landing-btn-sub">Audio, graphics &amp; more</span>
          </button>
          <button class="landing-btn" id="btn-login">
            LOGIN WITH GOOGLE
            <span class="landing-btn-sub">Link account for cloud saves</span>
          </button>
        </nav>
        <div id="landing-subpanel"></div>
        <div id="landing-footer">
          <span class="landing-footer-l" id="footer-left">SAVE: LOCAL ONLY</span>
          <span class="landing-footer-r" id="footer-right">ANONYMOUS</span>
        </div>
      </div>
    `,t}async init(){const t=document.getElementById("btn-continue"),e=document.getElementById("btn-continue-sub");if(this._inGame)t.classList.add("landing-btn-primary"),e.textContent="Return to game  [ESC]";else if(ih()){t.classList.add("landing-btn-primary");try{const s=localStorage.getItem("astro_save"),r=s?JSON.parse(s):null,a=(r==null?void 0:r.ore)||0;e.textContent=a>0?vE(a)+" ore":"No progress yet"}catch{e.textContent="Local save found"}}else t.disabled=!0,e.textContent="No save found";const n=document.getElementById("btn-cloud");n.disabled=!0,document.querySelector("#btn-cloud .landing-btn-sub").textContent="Firebase not configured",Gh()&&(document.getElementById("btn-login").style.display="none"),!this._inGame&&!ih()&&document.getElementById("btn-new").classList.add("landing-btn-primary"),this._updateFooter(),this._attachListeners()}_attachListeners(){document.getElementById("btn-continue").addEventListener("click",()=>this._handleResume()),document.getElementById("btn-cloud").addEventListener("click",()=>this._showCloudSavesPanel()),document.getElementById("btn-new").addEventListener("click",()=>this._handleNewGame()),document.getElementById("btn-settings").addEventListener("click",()=>this._showSettingsPanel()),document.getElementById("btn-login").addEventListener("click",()=>this._handleLogin())}show(){requestAnimationFrame(()=>{this._overlay.classList.add("landing-visible")})}waitForChoice(){return new Promise(t=>{this._resolve=t})}_dismiss(){clearTimeout(this._newGameTimer),document.removeEventListener("keydown",this._onKeyDown),this._overlay.classList.add("landing-exit");const t=document.getElementById("hud-overlay");t&&(t.style.visibility=""),this._overlay.addEventListener("transitionend",()=>{this._overlay.remove()},{once:!0})}_handleResume(){const t=this._inGame?"resume":"continue";this._resolve({action:t}),this._dismiss()}_handleNewGame(){const t=document.getElementById("btn-new");if(this._newGamePending)clearTimeout(this._newGameTimer),this._resolve({action:"newgame"}),this._dismiss();else{this._newGamePending=!0,t.classList.add("landing-btn-confirm");const e=t.querySelector(".landing-btn-sub");t.childNodes[0].textContent=" CONFIRM NEW GAME? ",e.textContent="Click again to confirm — resets local save",this._newGameTimer=setTimeout(()=>{this._newGamePending=!1,t.classList.remove("landing-btn-confirm"),t.childNodes[0].textContent=" NEW GAME ",e.textContent="Start from scratch"},3e3)}}async _handleLogin(){const t=document.getElementById("btn-login"),e=document.getElementById("footer-right");t.disabled=!0,t.querySelector(".landing-btn-sub").textContent="Opening Google sign-in...",await Gg()?(t.style.display="none",this._updateFooter(),document.getElementById("btn-cloud")):(t.disabled=!1,t.querySelector(".landing-btn-sub").textContent="Link account for cloud saves",e.textContent="LOGIN FAILED",e.classList.add("landing-footer-error"),setTimeout(()=>{e.classList.remove("landing-footer-error"),this._updateFooter()},3e3))}async _showCloudSavesPanel(){this._closeSubPanel();const t=document.getElementById("landing-subpanel");t.innerHTML=`
      <div class="landing-panel-box">
        <div class="landing-panel-title">CLOUD SAVES</div>
        <div class="landing-spinner"></div>
      </div>
    `,t.classList.add("open");{t.innerHTML=`
        <div class="landing-panel-box">
          <div class="landing-panel-title">CLOUD SAVES</div>
          <div class="landing-msg">Sign in with Google to access cloud saves.</div>
          <button class="landing-btn-back" id="panel-back">BACK</button>
        </div>
      `,document.getElementById("panel-back").addEventListener("click",()=>this._closeSubPanel());return}}_showSettingsPanel(){this._closeSubPanel();const t=document.getElementById("landing-subpanel");t.innerHTML=`
      <div class="landing-panel-box">
        <div class="landing-panel-title">SETTINGS</div>
        <div class="landing-setting-row">
          <span class="landing-setting-label">AUDIO VOLUME</span>
          <span class="landing-setting-ctrl">&#x25A0;&#x25A0;&#x25A0;&#x25A1;&#x25A1;</span>
        </div>
        <div class="landing-setting-row">
          <span class="landing-setting-label">RENDER QUALITY</span>
          <span class="landing-setting-ctrl">HIGH</span>
        </div>
        <div class="landing-setting-row">
          <span class="landing-setting-label">BLOOM EFFECT</span>
          <span class="landing-setting-ctrl">ON</span>
        </div>
        <div class="landing-coming-soon">— COMING IN FUTURE UPDATE —</div>
        <button class="landing-btn-back" id="panel-back">BACK</button>
      </div>
    `,t.classList.add("open"),document.getElementById("panel-back").addEventListener("click",()=>this._closeSubPanel())}_closeSubPanel(){const t=document.getElementById("landing-subpanel");t.classList.remove("open"),setTimeout(()=>{t.innerHTML=""},300)}_updateFooter(){const t=document.getElementById("footer-left"),e=document.getElementById("footer-right"),n=Vg();Gh()?(t.textContent="SAVE: CLOUD + LOCAL",e.textContent=n.email||n.displayName||"GOOGLE USER"):(t.textContent="SAVE: LOCAL ONLY",e.textContent="OFFLINE")}}async function yE(){const i=new Nf({inGame:!0});await i.init(),i.show();const t=await i.waitForChoice();t.action!=="resume"&&(t.action==="newgame"?(localStorage.removeItem("astro_save"),location.reload()):t.action==="cloud"&&t.saveData&&(localStorage.setItem("astro_save",JSON.stringify(t.saveData)),location.reload()))}async function xE(){zg();const i=gE(),t=new Nf;await t.init(),t.show();const e=await t.waitForChoice();let n=null;if(e.action==="continue"?n=Zf():e.action==="cloud"?n=e.saveData:e.action==="newgame"&&(localStorage.removeItem("astro_save"),Ct.reset()),e.action!=="newgame"&&kg(),n){Ct.deserialize(n);const l=Ct.applyOfflineEarnings();l&&l.earned>0&&(Ct._offlineEarnings=l)}Qf(),new _E(i);let s=!1;const r=async()=>{s||(s=!0,await yE(),s=!1)};document.addEventListener("keydown",l=>{l.key==="Escape"&&r()});const a=document.getElementById("menu-btn");a&&a.addEventListener("click",r)}xE();
