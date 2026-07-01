(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))s(i);new MutationObserver(i=>{for(const r of i)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&s(o)}).observe(document,{childList:!0,subtree:!0});function t(i){const r={};return i.integrity&&(r.integrity=i.integrity),i.referrerPolicy&&(r.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?r.credentials="include":i.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function s(i){if(i.ep)return;i.ep=!0;const r=t(i);fetch(i.href,r)}})();let ol=null,Ci=null,Ri=null,Is=null,Si=null,Ai=null,al=!1,ll=.8;function cl(){if(!ol)try{ol=new(window.AudioContext||window.webkitAudioContext)}catch(n){console.warn("Web Audio API not supported",n)}return ol}const vt={setVolume(n){ll=n/100,this.updateBuses()},ensureBuses(){const n=cl();if(!n)return null;if(Ci||(Ci=n.createGain(),Ci.gain.value=al?0:ll*.9,Ci.connect(n.destination)),!Ri){Ri=n.createGain(),Ri.gain.value=.9;try{Is=n.createMediaStreamDestination(),Ri.connect(Is)}catch(e){console.warn("MediaStream destination not supported for audio recording",e)}}return{ac:n,outGain:Ci,recGain:Ri}},updateBuses(){const n=this.ensureBuses();if(!n)return;const{ac:e,outGain:t}=n,s=al?0:ll*.9;try{t.gain.cancelScheduledValues(e.currentTime),t.gain.setTargetAtTime(s,e.currentTime,.05)}catch{}},envNoise(n=.08){try{const e=this.ensureBuses();if(!e)return null;const{ac:t,outGain:s,recGain:i}=e,r=t.createBuffer(1,t.sampleRate*2,t.sampleRate),o=r.getChannelData(0);for(let d=0;d<o.length;d++)o[d]=(Math.random()*2-1)*.35;const l=t.createBufferSource();l.buffer=r,l.loop=!0;const c=t.createBiquadFilter();c.type="lowpass",c.frequency.value=800;const h=t.createGain();return h.gain.value=n,l.connect(c),c.connect(h),h.connect(s),Is&&h.connect(i),{src:l,g:h}}catch{return null}},startCrowd(){try{const n=this.envNoise(.06);if(!n)return;Si=n.g,n.src.start(),Ai=n.src}catch{}},stopCrowd(){if(Ai){try{Ai.stop()}catch{}Ai=null,Si=null}},setOutputMuted(n){al=n,this.updateBuses()},createTone(n,e=.12,t="sine",s=.2){try{const i=this.ensureBuses();if(!i)return;const{ac:r,outGain:o,recGain:l}=i,c=r.createOscillator(),h=r.createGain();c.type=t,c.frequency.value=n,h.gain.value=s,c.connect(h),h.connect(o),Is&&h.connect(l),c.start(),h.gain.exponentialRampToValueAtTime(1e-4,r.currentTime+e),c.stop(r.currentTime+e)}catch{}},percuss(n=.18,e=.05){try{const t=this.ensureBuses();if(!t)return;const{ac:s,outGain:i,recGain:r}=t,o=s.createBuffer(1,s.sampleRate*e,s.sampleRate),l=o.getChannelData(0);for(let d=0;d<l.length;d++)l[d]+=(Math.random()*2-1)*(1-d/l.length);const c=s.createBufferSource(),h=s.createGain();h.gain.value=n,c.buffer=o,c.connect(h),h.connect(i),Is&&h.connect(r),c.start()}catch{}},playCheer(){try{if(Si||this.startCrowd(),!Si)return;const n=cl(),e=Si.gain,t=n.currentTime;e.cancelScheduledValues(t),e.setTargetAtTime(.25,t,.03),e.setTargetAtTime(.08,t+.6,.3)}catch{}},play(n){switch(n){case"kick":this.createTone(520,.05,"square",.18),this.createTone(260,.06,"square",.09);break;case"tackle":this.percuss(.22,.03),this.createTone(140,.06,"sawtooth",.22);break;case"dribble":this.createTone(800,.05,"triangle",.12),this.createTone(600,.05,"triangle",.08);break;case"power":this.createTone(360,.08,"sawtooth",.18),setTimeout(()=>this.createTone(720,.06,"square",.16),80),setTimeout(()=>this.percuss(.25,.04),120);break;case"post":this.createTone(900,.04,"square",.12),this.createTone(300,.06,"sine",.1);break;case"whistle":this.createTone(1800,.18,"sine",.12),this.createTone(1500,.18,"sine",.12);break;case"goal":this.createTone(480,.18,"triangle",.14),setTimeout(()=>this.createTone(960,.12,"sine",.12),120);break;case"cheer":this.playCheer();break}},ensureAudio(){const n=cl();n&&n.state==="suspended"&&n.resume(),Ai||this.startCrowd()},getRecordingStreamDestination(){return this.ensureBuses(),Is}};class my{constructor(){this.routes=new Map,this.currentScreenId="splash-screen"}register(e,t={}){this.routes.set(e,{onEnter:t.onEnter||null,onExit:t.onExit||null})}show(e){if(e!=="match-screen")try{vt.stopCrowd()}catch{}const t=document.getElementById(e);if(!t){console.error(`[Router] Tela não encontrada: ${e}`);return}const s=this.currentScreenId,i=this.routes.get(s),r=this.routes.get(e);if(i&&i.onExit)try{i.onExit()}catch(c){console.error(`[Router] Erro ao sair da tela ${s}:`,c)}document.querySelectorAll(".screen-view").forEach(c=>{c.classList.add("hidden"),c.classList.remove("active")}),t.classList.remove("hidden"),t.classList.add("active"),this.currentScreenId=e;const l=document.getElementById("global-chat-container");if(l&&(e==="menu-screen"||e==="multiplayer-screen"?l.classList.remove("hidden"):l.classList.add("hidden")),r&&r.onEnter)try{r.onEnter()}catch(c){console.error(`[Router] Erro ao entrar na tela ${e}:`,c)}}}const W=new my;var qu={};/**
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
 */const Qf={NODE_ADMIN:!1,SDK_VERSION:"${JSCORE_VERSION}"};/**
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
 */const M=function(n,e){if(!n)throw Js(e)},Js=function(n){return new Error("Firebase Database ("+Qf.SDK_VERSION+") INTERNAL ASSERT FAILED: "+n)};/**
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
 */const Yf=function(n){const e=[];let t=0;for(let s=0;s<n.length;s++){let i=n.charCodeAt(s);i<128?e[t++]=i:i<2048?(e[t++]=i>>6|192,e[t++]=i&63|128):(i&64512)===55296&&s+1<n.length&&(n.charCodeAt(s+1)&64512)===56320?(i=65536+((i&1023)<<10)+(n.charCodeAt(++s)&1023),e[t++]=i>>18|240,e[t++]=i>>12&63|128,e[t++]=i>>6&63|128,e[t++]=i&63|128):(e[t++]=i>>12|224,e[t++]=i>>6&63|128,e[t++]=i&63|128)}return e},py=function(n){const e=[];let t=0,s=0;for(;t<n.length;){const i=n[t++];if(i<128)e[s++]=String.fromCharCode(i);else if(i>191&&i<224){const r=n[t++];e[s++]=String.fromCharCode((i&31)<<6|r&63)}else if(i>239&&i<365){const r=n[t++],o=n[t++],l=n[t++],c=((i&7)<<18|(r&63)<<12|(o&63)<<6|l&63)-65536;e[s++]=String.fromCharCode(55296+(c>>10)),e[s++]=String.fromCharCode(56320+(c&1023))}else{const r=n[t++],o=n[t++];e[s++]=String.fromCharCode((i&15)<<12|(r&63)<<6|o&63)}}return e.join("")},mc={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(n,e){if(!Array.isArray(n))throw Error("encodeByteArray takes an array as a parameter");this.init_();const t=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,s=[];for(let i=0;i<n.length;i+=3){const r=n[i],o=i+1<n.length,l=o?n[i+1]:0,c=i+2<n.length,h=c?n[i+2]:0,d=r>>2,m=(r&3)<<4|l>>4;let p=(l&15)<<2|h>>6,E=h&63;c||(E=64,o||(p=64)),s.push(t[d],t[m],t[p],t[E])}return s.join("")},encodeString(n,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(n):this.encodeByteArray(Yf(n),e)},decodeString(n,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(n):py(this.decodeStringToByteArray(n,e))},decodeStringToByteArray(n,e){this.init_();const t=e?this.charToByteMapWebSafe_:this.charToByteMap_,s=[];for(let i=0;i<n.length;){const r=t[n.charAt(i++)],l=i<n.length?t[n.charAt(i)]:0;++i;const h=i<n.length?t[n.charAt(i)]:64;++i;const m=i<n.length?t[n.charAt(i)]:64;if(++i,r==null||l==null||h==null||m==null)throw new gy;const p=r<<2|l>>4;if(s.push(p),h!==64){const E=l<<4&240|h>>2;if(s.push(E),m!==64){const b=h<<6&192|m;s.push(b)}}}return s},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let n=0;n<this.ENCODED_VALS.length;n++)this.byteToCharMap_[n]=this.ENCODED_VALS.charAt(n),this.charToByteMap_[this.byteToCharMap_[n]]=n,this.byteToCharMapWebSafe_[n]=this.ENCODED_VALS_WEBSAFE.charAt(n),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[n]]=n,n>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(n)]=n,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(n)]=n)}}};class gy extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const Xf=function(n){const e=Yf(n);return mc.encodeByteArray(e,!0)},To=function(n){return Xf(n).replace(/\./g,"")},Io=function(n){try{return mc.decodeString(n,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
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
 */function _y(n){return Jf(void 0,n)}function Jf(n,e){if(!(e instanceof Object))return e;switch(e.constructor){case Date:const t=e;return new Date(t.getTime());case Object:n===void 0&&(n={});break;case Array:n=[];break;default:return e}for(const t in e)!e.hasOwnProperty(t)||!yy(t)||(n[t]=Jf(n[t],e[t]));return n}function yy(n){return n!=="__proto__"}/**
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
 */function vy(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
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
 */const Ey=()=>vy().__FIREBASE_DEFAULTS__,wy=()=>{if(typeof process>"u"||typeof qu>"u")return;const n=qu.__FIREBASE_DEFAULTS__;if(n)return JSON.parse(n)},Ty=()=>{if(typeof document>"u")return;let n;try{n=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const e=n&&Io(n[1]);return e&&JSON.parse(e)},ha=()=>{try{return Ey()||wy()||Ty()}catch(n){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${n}`);return}},Zf=n=>{var e,t;return(t=(e=ha())===null||e===void 0?void 0:e.emulatorHosts)===null||t===void 0?void 0:t[n]},em=n=>{const e=Zf(n);if(!e)return;const t=e.lastIndexOf(":");if(t<=0||t+1===e.length)throw new Error(`Invalid host ${e} with no separate hostname and port!`);const s=parseInt(e.substring(t+1),10);return e[0]==="["?[e.substring(1,t-1),s]:[e.substring(0,t),s]},tm=()=>{var n;return(n=ha())===null||n===void 0?void 0:n.config},nm=n=>{var e;return(e=ha())===null||e===void 0?void 0:e[`_${n}`]};/**
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
 */class Mt{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}wrapCallback(e){return(t,s)=>{t?this.reject(t):this.resolve(s),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(t):e(t,s))}}}/**
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
 */function sm(n,e){if(n.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');const t={alg:"none",type:"JWT"},s=e||"demo-project",i=n.iat||0,r=n.sub||n.user_id;if(!r)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");const o=Object.assign({iss:`https://securetoken.google.com/${s}`,aud:s,iat:i,exp:i+3600,auth_time:i,sub:r,user_id:r,firebase:{sign_in_provider:"custom",identities:{}}},n);return[To(JSON.stringify(t)),To(JSON.stringify(o)),""].join(".")}/**
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
 */function st(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function pc(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(st())}function Iy(){var n;const e=(n=ha())===null||n===void 0?void 0:n.forceEnvironment;if(e==="node")return!0;if(e==="browser")return!1;try{return Object.prototype.toString.call(global.process)==="[object process]"}catch{return!1}}function by(){return typeof navigator<"u"&&navigator.userAgent==="Cloudflare-Workers"}function Cy(){const n=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof n=="object"&&n.id!==void 0}function im(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function Ry(){const n=st();return n.indexOf("MSIE ")>=0||n.indexOf("Trident/")>=0}function Sy(){return Qf.NODE_ADMIN===!0}function Ay(){return!Iy()&&!!navigator.userAgent&&navigator.userAgent.includes("Safari")&&!navigator.userAgent.includes("Chrome")}function ky(){try{return typeof indexedDB=="object"}catch{return!1}}function Py(){return new Promise((n,e)=>{try{let t=!0;const s="validate-browser-context-for-indexeddb-analytics-module",i=self.indexedDB.open(s);i.onsuccess=()=>{i.result.close(),t||self.indexedDB.deleteDatabase(s),n(!0)},i.onupgradeneeded=()=>{t=!1},i.onerror=()=>{var r;e(((r=i.error)===null||r===void 0?void 0:r.message)||"")}}catch(t){e(t)}})}/**
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
 */const Ny="FirebaseError";class cn extends Error{constructor(e,t,s){super(t),this.code=e,this.customData=s,this.name=Ny,Object.setPrototypeOf(this,cn.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,pr.prototype.create)}}class pr{constructor(e,t,s){this.service=e,this.serviceName=t,this.errors=s}create(e,...t){const s=t[0]||{},i=`${this.service}/${e}`,r=this.errors[e],o=r?Dy(r,s):"Error",l=`${this.serviceName}: ${o} (${i}).`;return new cn(i,l,s)}}function Dy(n,e){return n.replace(xy,(t,s)=>{const i=e[s];return i!=null?String(i):`<${s}?>`})}const xy=/\{\$([^}]+)}/g;/**
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
 */function Ji(n){return JSON.parse(n)}function Oe(n){return JSON.stringify(n)}/**
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
 */const rm=function(n){let e={},t={},s={},i="";try{const r=n.split(".");e=Ji(Io(r[0])||""),t=Ji(Io(r[1])||""),i=r[2],s=t.d||{},delete t.d}catch{}return{header:e,claims:t,data:s,signature:i}},My=function(n){const e=rm(n),t=e.claims;return!!t&&typeof t=="object"&&t.hasOwnProperty("iat")},Ly=function(n){const e=rm(n).claims;return typeof e=="object"&&e.admin===!0};/**
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
 */function $t(n,e){return Object.prototype.hasOwnProperty.call(n,e)}function Os(n,e){if(Object.prototype.hasOwnProperty.call(n,e))return n[e]}function bo(n){for(const e in n)if(Object.prototype.hasOwnProperty.call(n,e))return!1;return!0}function Co(n,e,t){const s={};for(const i in n)Object.prototype.hasOwnProperty.call(n,i)&&(s[i]=e.call(t,n[i],i,n));return s}function Ro(n,e){if(n===e)return!0;const t=Object.keys(n),s=Object.keys(e);for(const i of t){if(!s.includes(i))return!1;const r=n[i],o=e[i];if(zu(r)&&zu(o)){if(!Ro(r,o))return!1}else if(r!==o)return!1}for(const i of s)if(!t.includes(i))return!1;return!0}function zu(n){return n!==null&&typeof n=="object"}/**
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
 */function Zs(n){const e=[];for(const[t,s]of Object.entries(n))Array.isArray(s)?s.forEach(i=>{e.push(encodeURIComponent(t)+"="+encodeURIComponent(i))}):e.push(encodeURIComponent(t)+"="+encodeURIComponent(s));return e.length?"&"+e.join("&"):""}/**
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
 */class Oy{constructor(){this.chain_=[],this.buf_=[],this.W_=[],this.pad_=[],this.inbuf_=0,this.total_=0,this.blockSize=512/8,this.pad_[0]=128;for(let e=1;e<this.blockSize;++e)this.pad_[e]=0;this.reset()}reset(){this.chain_[0]=1732584193,this.chain_[1]=4023233417,this.chain_[2]=2562383102,this.chain_[3]=271733878,this.chain_[4]=3285377520,this.inbuf_=0,this.total_=0}compress_(e,t){t||(t=0);const s=this.W_;if(typeof e=="string")for(let m=0;m<16;m++)s[m]=e.charCodeAt(t)<<24|e.charCodeAt(t+1)<<16|e.charCodeAt(t+2)<<8|e.charCodeAt(t+3),t+=4;else for(let m=0;m<16;m++)s[m]=e[t]<<24|e[t+1]<<16|e[t+2]<<8|e[t+3],t+=4;for(let m=16;m<80;m++){const p=s[m-3]^s[m-8]^s[m-14]^s[m-16];s[m]=(p<<1|p>>>31)&4294967295}let i=this.chain_[0],r=this.chain_[1],o=this.chain_[2],l=this.chain_[3],c=this.chain_[4],h,d;for(let m=0;m<80;m++){m<40?m<20?(h=l^r&(o^l),d=1518500249):(h=r^o^l,d=1859775393):m<60?(h=r&o|l&(r|o),d=2400959708):(h=r^o^l,d=3395469782);const p=(i<<5|i>>>27)+h+c+d+s[m]&4294967295;c=l,l=o,o=(r<<30|r>>>2)&4294967295,r=i,i=p}this.chain_[0]=this.chain_[0]+i&4294967295,this.chain_[1]=this.chain_[1]+r&4294967295,this.chain_[2]=this.chain_[2]+o&4294967295,this.chain_[3]=this.chain_[3]+l&4294967295,this.chain_[4]=this.chain_[4]+c&4294967295}update(e,t){if(e==null)return;t===void 0&&(t=e.length);const s=t-this.blockSize;let i=0;const r=this.buf_;let o=this.inbuf_;for(;i<t;){if(o===0)for(;i<=s;)this.compress_(e,i),i+=this.blockSize;if(typeof e=="string"){for(;i<t;)if(r[o]=e.charCodeAt(i),++o,++i,o===this.blockSize){this.compress_(r),o=0;break}}else for(;i<t;)if(r[o]=e[i],++o,++i,o===this.blockSize){this.compress_(r),o=0;break}}this.inbuf_=o,this.total_+=t}digest(){const e=[];let t=this.total_*8;this.inbuf_<56?this.update(this.pad_,56-this.inbuf_):this.update(this.pad_,this.blockSize-(this.inbuf_-56));for(let i=this.blockSize-1;i>=56;i--)this.buf_[i]=t&255,t/=256;this.compress_(this.buf_);let s=0;for(let i=0;i<5;i++)for(let r=24;r>=0;r-=8)e[s]=this.chain_[i]>>r&255,++s;return e}}function Vy(n,e){const t=new Fy(n,e);return t.subscribe.bind(t)}class Fy{constructor(e,t){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=t,this.task.then(()=>{e(this)}).catch(s=>{this.error(s)})}next(e){this.forEachObserver(t=>{t.next(e)})}error(e){this.forEachObserver(t=>{t.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,t,s){let i;if(e===void 0&&t===void 0&&s===void 0)throw new Error("Missing Observer.");By(e,["next","error","complete"])?i=e:i={next:e,error:t,complete:s},i.next===void 0&&(i.next=hl),i.error===void 0&&(i.error=hl),i.complete===void 0&&(i.complete=hl);const r=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?i.error(this.finalError):i.complete()}catch{}}),this.observers.push(i),r}unsubscribeOne(e){this.observers===void 0||this.observers[e]===void 0||(delete this.observers[e],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let t=0;t<this.observers.length;t++)this.sendOne(t,e)}sendOne(e,t){this.task.then(()=>{if(this.observers!==void 0&&this.observers[e]!==void 0)try{t(this.observers[e])}catch(s){typeof console<"u"&&console.error&&console.error(s)}})}close(e){this.finalized||(this.finalized=!0,e!==void 0&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function By(n,e){if(typeof n!="object"||n===null)return!1;for(const t of e)if(t in n&&typeof n[t]=="function")return!0;return!1}function hl(){}function Vs(n,e){return`${n} failed: ${e} argument `}/**
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
 */const Uy=function(n){const e=[];let t=0;for(let s=0;s<n.length;s++){let i=n.charCodeAt(s);if(i>=55296&&i<=56319){const r=i-55296;s++,M(s<n.length,"Surrogate pair missing trail surrogate.");const o=n.charCodeAt(s)-56320;i=65536+(r<<10)+o}i<128?e[t++]=i:i<2048?(e[t++]=i>>6|192,e[t++]=i&63|128):i<65536?(e[t++]=i>>12|224,e[t++]=i>>6&63|128,e[t++]=i&63|128):(e[t++]=i>>18|240,e[t++]=i>>12&63|128,e[t++]=i>>6&63|128,e[t++]=i&63|128)}return e},ua=function(n){let e=0;for(let t=0;t<n.length;t++){const s=n.charCodeAt(t);s<128?e++:s<2048?e+=2:s>=55296&&s<=56319?(e+=4,t++):e+=3}return e};/**
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
 */function me(n){return n&&n._delegate?n._delegate:n}class Pn{constructor(e,t,s){this.name=e,this.instanceFactory=t,this.type=s,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
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
 */const Gn="[DEFAULT]";/**
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
 */class jy{constructor(e,t){this.name=e,this.container=t,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const t=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(t)){const s=new Mt;if(this.instancesDeferred.set(t,s),this.isInitialized(t)||this.shouldAutoInitialize())try{const i=this.getOrInitializeService({instanceIdentifier:t});i&&s.resolve(i)}catch{}}return this.instancesDeferred.get(t).promise}getImmediate(e){var t;const s=this.normalizeInstanceIdentifier(e==null?void 0:e.identifier),i=(t=e==null?void 0:e.optional)!==null&&t!==void 0?t:!1;if(this.isInitialized(s)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:s})}catch(r){if(i)return null;throw r}else{if(i)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(Wy(e))try{this.getOrInitializeService({instanceIdentifier:Gn})}catch{}for(const[t,s]of this.instancesDeferred.entries()){const i=this.normalizeInstanceIdentifier(t);try{const r=this.getOrInitializeService({instanceIdentifier:i});s.resolve(r)}catch{}}}}clearInstance(e=Gn){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(t=>"INTERNAL"in t).map(t=>t.INTERNAL.delete()),...e.filter(t=>"_delete"in t).map(t=>t._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=Gn){return this.instances.has(e)}getOptions(e=Gn){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:t={}}=e,s=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(s))throw Error(`${this.name}(${s}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const i=this.getOrInitializeService({instanceIdentifier:s,options:t});for(const[r,o]of this.instancesDeferred.entries()){const l=this.normalizeInstanceIdentifier(r);s===l&&o.resolve(i)}return i}onInit(e,t){var s;const i=this.normalizeInstanceIdentifier(t),r=(s=this.onInitCallbacks.get(i))!==null&&s!==void 0?s:new Set;r.add(e),this.onInitCallbacks.set(i,r);const o=this.instances.get(i);return o&&e(o,i),()=>{r.delete(e)}}invokeOnInitCallbacks(e,t){const s=this.onInitCallbacks.get(t);if(s)for(const i of s)try{i(e,t)}catch{}}getOrInitializeService({instanceIdentifier:e,options:t={}}){let s=this.instances.get(e);if(!s&&this.component&&(s=this.component.instanceFactory(this.container,{instanceIdentifier:$y(e),options:t}),this.instances.set(e,s),this.instancesOptions.set(e,t),this.invokeOnInitCallbacks(s,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,s)}catch{}return s||null}normalizeInstanceIdentifier(e=Gn){return this.component?this.component.multipleInstances?e:Gn:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function $y(n){return n===Gn?void 0:n}function Wy(n){return n.instantiationMode==="EAGER"}/**
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
 */class qy{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const t=this.getProvider(e.name);if(t.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);t.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const t=new jy(e,this);return this.providers.set(e,t),t}getProviders(){return Array.from(this.providers.values())}}/**
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
 */var te;(function(n){n[n.DEBUG=0]="DEBUG",n[n.VERBOSE=1]="VERBOSE",n[n.INFO=2]="INFO",n[n.WARN=3]="WARN",n[n.ERROR=4]="ERROR",n[n.SILENT=5]="SILENT"})(te||(te={}));const zy={debug:te.DEBUG,verbose:te.VERBOSE,info:te.INFO,warn:te.WARN,error:te.ERROR,silent:te.SILENT},Hy=te.INFO,Gy={[te.DEBUG]:"log",[te.VERBOSE]:"log",[te.INFO]:"info",[te.WARN]:"warn",[te.ERROR]:"error"},Ky=(n,e,...t)=>{if(e<n.logLevel)return;const s=new Date().toISOString(),i=Gy[e];if(i)console[i](`[${s}]  ${n.name}:`,...t);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class da{constructor(e){this.name=e,this._logLevel=Hy,this._logHandler=Ky,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in te))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?zy[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,te.DEBUG,...e),this._logHandler(this,te.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,te.VERBOSE,...e),this._logHandler(this,te.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,te.INFO,...e),this._logHandler(this,te.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,te.WARN,...e),this._logHandler(this,te.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,te.ERROR,...e),this._logHandler(this,te.ERROR,...e)}}const Qy=(n,e)=>e.some(t=>n instanceof t);let Hu,Gu;function Yy(){return Hu||(Hu=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function Xy(){return Gu||(Gu=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const om=new WeakMap,Nl=new WeakMap,am=new WeakMap,ul=new WeakMap,gc=new WeakMap;function Jy(n){const e=new Promise((t,s)=>{const i=()=>{n.removeEventListener("success",r),n.removeEventListener("error",o)},r=()=>{t(bn(n.result)),i()},o=()=>{s(n.error),i()};n.addEventListener("success",r),n.addEventListener("error",o)});return e.then(t=>{t instanceof IDBCursor&&om.set(t,n)}).catch(()=>{}),gc.set(e,n),e}function Zy(n){if(Nl.has(n))return;const e=new Promise((t,s)=>{const i=()=>{n.removeEventListener("complete",r),n.removeEventListener("error",o),n.removeEventListener("abort",o)},r=()=>{t(),i()},o=()=>{s(n.error||new DOMException("AbortError","AbortError")),i()};n.addEventListener("complete",r),n.addEventListener("error",o),n.addEventListener("abort",o)});Nl.set(n,e)}let Dl={get(n,e,t){if(n instanceof IDBTransaction){if(e==="done")return Nl.get(n);if(e==="objectStoreNames")return n.objectStoreNames||am.get(n);if(e==="store")return t.objectStoreNames[1]?void 0:t.objectStore(t.objectStoreNames[0])}return bn(n[e])},set(n,e,t){return n[e]=t,!0},has(n,e){return n instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in n}};function ev(n){Dl=n(Dl)}function tv(n){return n===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...t){const s=n.call(dl(this),e,...t);return am.set(s,e.sort?e.sort():[e]),bn(s)}:Xy().includes(n)?function(...e){return n.apply(dl(this),e),bn(om.get(this))}:function(...e){return bn(n.apply(dl(this),e))}}function nv(n){return typeof n=="function"?tv(n):(n instanceof IDBTransaction&&Zy(n),Qy(n,Yy())?new Proxy(n,Dl):n)}function bn(n){if(n instanceof IDBRequest)return Jy(n);if(ul.has(n))return ul.get(n);const e=nv(n);return e!==n&&(ul.set(n,e),gc.set(e,n)),e}const dl=n=>gc.get(n);function sv(n,e,{blocked:t,upgrade:s,blocking:i,terminated:r}={}){const o=indexedDB.open(n,e),l=bn(o);return s&&o.addEventListener("upgradeneeded",c=>{s(bn(o.result),c.oldVersion,c.newVersion,bn(o.transaction),c)}),t&&o.addEventListener("blocked",c=>t(c.oldVersion,c.newVersion,c)),l.then(c=>{r&&c.addEventListener("close",()=>r()),i&&c.addEventListener("versionchange",h=>i(h.oldVersion,h.newVersion,h))}).catch(()=>{}),l}const iv=["get","getKey","getAll","getAllKeys","count"],rv=["put","add","delete","clear"],fl=new Map;function Ku(n,e){if(!(n instanceof IDBDatabase&&!(e in n)&&typeof e=="string"))return;if(fl.get(e))return fl.get(e);const t=e.replace(/FromIndex$/,""),s=e!==t,i=rv.includes(t);if(!(t in(s?IDBIndex:IDBObjectStore).prototype)||!(i||iv.includes(t)))return;const r=async function(o,...l){const c=this.transaction(o,i?"readwrite":"readonly");let h=c.store;return s&&(h=h.index(l.shift())),(await Promise.all([h[t](...l),i&&c.done]))[0]};return fl.set(e,r),r}ev(n=>({...n,get:(e,t,s)=>Ku(e,t)||n.get(e,t,s),has:(e,t)=>!!Ku(e,t)||n.has(e,t)}));/**
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
 */class ov{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(t=>{if(av(t)){const s=t.getImmediate();return`${s.library}/${s.version}`}else return null}).filter(t=>t).join(" ")}}function av(n){const e=n.getComponent();return(e==null?void 0:e.type)==="VERSION"}const xl="@firebase/app",Qu="0.10.13";/**
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
 */const sn=new da("@firebase/app"),lv="@firebase/app-compat",cv="@firebase/analytics-compat",hv="@firebase/analytics",uv="@firebase/app-check-compat",dv="@firebase/app-check",fv="@firebase/auth",mv="@firebase/auth-compat",pv="@firebase/database",gv="@firebase/data-connect",_v="@firebase/database-compat",yv="@firebase/functions",vv="@firebase/functions-compat",Ev="@firebase/installations",wv="@firebase/installations-compat",Tv="@firebase/messaging",Iv="@firebase/messaging-compat",bv="@firebase/performance",Cv="@firebase/performance-compat",Rv="@firebase/remote-config",Sv="@firebase/remote-config-compat",Av="@firebase/storage",kv="@firebase/storage-compat",Pv="@firebase/firestore",Nv="@firebase/vertexai-preview",Dv="@firebase/firestore-compat",xv="firebase",Mv="10.14.1";/**
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
 */const Ml="[DEFAULT]",Lv={[xl]:"fire-core",[lv]:"fire-core-compat",[hv]:"fire-analytics",[cv]:"fire-analytics-compat",[dv]:"fire-app-check",[uv]:"fire-app-check-compat",[fv]:"fire-auth",[mv]:"fire-auth-compat",[pv]:"fire-rtdb",[gv]:"fire-data-connect",[_v]:"fire-rtdb-compat",[yv]:"fire-fn",[vv]:"fire-fn-compat",[Ev]:"fire-iid",[wv]:"fire-iid-compat",[Tv]:"fire-fcm",[Iv]:"fire-fcm-compat",[bv]:"fire-perf",[Cv]:"fire-perf-compat",[Rv]:"fire-rc",[Sv]:"fire-rc-compat",[Av]:"fire-gcs",[kv]:"fire-gcs-compat",[Pv]:"fire-fst",[Dv]:"fire-fst-compat",[Nv]:"fire-vertex","fire-js":"fire-js",[xv]:"fire-js-all"};/**
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
 */const So=new Map,Ov=new Map,Ll=new Map;function Yu(n,e){try{n.container.addComponent(e)}catch(t){sn.debug(`Component ${e.name} failed to register with FirebaseApp ${n.name}`,t)}}function ss(n){const e=n.name;if(Ll.has(e))return sn.debug(`There were multiple attempts to register component ${e}.`),!1;Ll.set(e,n);for(const t of So.values())Yu(t,n);for(const t of Ov.values())Yu(t,n);return!0}function fa(n,e){const t=n.container.getProvider("heartbeat").getImmediate({optional:!0});return t&&t.triggerHeartbeat(),n.container.getProvider(e)}function Xt(n){return n.settings!==void 0}/**
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
 */const Vv={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},Cn=new pr("app","Firebase",Vv);/**
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
 */class Fv{constructor(e,t,s){this._isDeleted=!1,this._options=Object.assign({},e),this._config=Object.assign({},t),this._name=t.name,this._automaticDataCollectionEnabled=t.automaticDataCollectionEnabled,this._container=s,this.container.addComponent(new Pn("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw Cn.create("app-deleted",{appName:this._name})}}/**
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
 */const ds=Mv;function lm(n,e={}){let t=n;typeof e!="object"&&(e={name:e});const s=Object.assign({name:Ml,automaticDataCollectionEnabled:!1},e),i=s.name;if(typeof i!="string"||!i)throw Cn.create("bad-app-name",{appName:String(i)});if(t||(t=tm()),!t)throw Cn.create("no-options");const r=So.get(i);if(r){if(Ro(t,r.options)&&Ro(s,r.config))return r;throw Cn.create("duplicate-app",{appName:i})}const o=new qy(i);for(const c of Ll.values())o.addComponent(c);const l=new Fv(t,s,o);return So.set(i,l),l}function _c(n=Ml){const e=So.get(n);if(!e&&n===Ml&&tm())return lm();if(!e)throw Cn.create("no-app",{appName:n});return e}function Lt(n,e,t){var s;let i=(s=Lv[n])!==null&&s!==void 0?s:n;t&&(i+=`-${t}`);const r=i.match(/\s|\//),o=e.match(/\s|\//);if(r||o){const l=[`Unable to register library "${i}" with version "${e}":`];r&&l.push(`library name "${i}" contains illegal characters (whitespace or "/")`),r&&o&&l.push("and"),o&&l.push(`version name "${e}" contains illegal characters (whitespace or "/")`),sn.warn(l.join(" "));return}ss(new Pn(`${i}-version`,()=>({library:i,version:e}),"VERSION"))}/**
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
 */const Bv="firebase-heartbeat-database",Uv=1,Zi="firebase-heartbeat-store";let ml=null;function cm(){return ml||(ml=sv(Bv,Uv,{upgrade:(n,e)=>{switch(e){case 0:try{n.createObjectStore(Zi)}catch(t){console.warn(t)}}}}).catch(n=>{throw Cn.create("idb-open",{originalErrorMessage:n.message})})),ml}async function jv(n){try{const t=(await cm()).transaction(Zi),s=await t.objectStore(Zi).get(hm(n));return await t.done,s}catch(e){if(e instanceof cn)sn.warn(e.message);else{const t=Cn.create("idb-get",{originalErrorMessage:e==null?void 0:e.message});sn.warn(t.message)}}}async function Xu(n,e){try{const s=(await cm()).transaction(Zi,"readwrite");await s.objectStore(Zi).put(e,hm(n)),await s.done}catch(t){if(t instanceof cn)sn.warn(t.message);else{const s=Cn.create("idb-set",{originalErrorMessage:t==null?void 0:t.message});sn.warn(s.message)}}}function hm(n){return`${n.name}!${n.options.appId}`}/**
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
 */const $v=1024,Wv=30*24*60*60*1e3;class qv{constructor(e){this.container=e,this._heartbeatsCache=null;const t=this.container.getProvider("app").getImmediate();this._storage=new Hv(t),this._heartbeatsCachePromise=this._storage.read().then(s=>(this._heartbeatsCache=s,s))}async triggerHeartbeat(){var e,t;try{const i=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),r=Ju();return((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((t=this._heartbeatsCache)===null||t===void 0?void 0:t.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===r||this._heartbeatsCache.heartbeats.some(o=>o.date===r)?void 0:(this._heartbeatsCache.heartbeats.push({date:r,agent:i}),this._heartbeatsCache.heartbeats=this._heartbeatsCache.heartbeats.filter(o=>{const l=new Date(o.date).valueOf();return Date.now()-l<=Wv}),this._storage.overwrite(this._heartbeatsCache))}catch(s){sn.warn(s)}}async getHeartbeatsHeader(){var e;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const t=Ju(),{heartbeatsToSend:s,unsentEntries:i}=zv(this._heartbeatsCache.heartbeats),r=To(JSON.stringify({version:2,heartbeats:s}));return this._heartbeatsCache.lastSentHeartbeatDate=t,i.length>0?(this._heartbeatsCache.heartbeats=i,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),r}catch(t){return sn.warn(t),""}}}function Ju(){return new Date().toISOString().substring(0,10)}function zv(n,e=$v){const t=[];let s=n.slice();for(const i of n){const r=t.find(o=>o.agent===i.agent);if(r){if(r.dates.push(i.date),Zu(t)>e){r.dates.pop();break}}else if(t.push({agent:i.agent,dates:[i.date]}),Zu(t)>e){t.pop();break}s=s.slice(1)}return{heartbeatsToSend:t,unsentEntries:s}}class Hv{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return ky()?Py().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const t=await jv(this.app);return t!=null&&t.heartbeats?t:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){var t;if(await this._canUseIndexedDBPromise){const i=await this.read();return Xu(this.app,{lastSentHeartbeatDate:(t=e.lastSentHeartbeatDate)!==null&&t!==void 0?t:i.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){var t;if(await this._canUseIndexedDBPromise){const i=await this.read();return Xu(this.app,{lastSentHeartbeatDate:(t=e.lastSentHeartbeatDate)!==null&&t!==void 0?t:i.lastSentHeartbeatDate,heartbeats:[...i.heartbeats,...e.heartbeats]})}else return}}function Zu(n){return To(JSON.stringify({version:2,heartbeats:n})).length}/**
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
 */function Gv(n){ss(new Pn("platform-logger",e=>new ov(e),"PRIVATE")),ss(new Pn("heartbeat",e=>new qv(e),"PRIVATE")),Lt(xl,Qu,n),Lt(xl,Qu,"esm2017"),Lt("fire-js","")}Gv("");var Kv="firebase",Qv="10.14.1";/**
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
 */Lt(Kv,Qv,"app");function yc(n,e){var t={};for(var s in n)Object.prototype.hasOwnProperty.call(n,s)&&e.indexOf(s)<0&&(t[s]=n[s]);if(n!=null&&typeof Object.getOwnPropertySymbols=="function")for(var i=0,s=Object.getOwnPropertySymbols(n);i<s.length;i++)e.indexOf(s[i])<0&&Object.prototype.propertyIsEnumerable.call(n,s[i])&&(t[s[i]]=n[s[i]]);return t}function um(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}const Yv=um,dm=new pr("auth","Firebase",um());/**
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
 */const Ao=new da("@firebase/auth");function Xv(n,...e){Ao.logLevel<=te.WARN&&Ao.warn(`Auth (${ds}): ${n}`,...e)}function ho(n,...e){Ao.logLevel<=te.ERROR&&Ao.error(`Auth (${ds}): ${n}`,...e)}/**
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
 */function Bt(n,...e){throw Ec(n,...e)}function Pt(n,...e){return Ec(n,...e)}function vc(n,e,t){const s=Object.assign(Object.assign({},Yv()),{[e]:t});return new pr("auth","Firebase",s).create(e,{appName:n.name})}function es(n){return vc(n,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function Jv(n,e,t){const s=t;if(!(e instanceof s))throw s.name!==e.constructor.name&&Bt(n,"argument-error"),vc(n,"argument-error",`Type of ${e.constructor.name} does not match expected instance.Did you pass a reference from a different Auth SDK?`)}function Ec(n,...e){if(typeof n!="string"){const t=e[0],s=[...e.slice(1)];return s[0]&&(s[0].appName=n.name),n._errorFactory.create(t,...s)}return dm.create(n,...e)}function Q(n,e,...t){if(!n)throw Ec(e,...t)}function Jt(n){const e="INTERNAL ASSERTION FAILED: "+n;throw ho(e),new Error(e)}function rn(n,e){n||Jt(e)}/**
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
 */function Ol(){var n;return typeof self<"u"&&((n=self.location)===null||n===void 0?void 0:n.href)||""}function Zv(){return ed()==="http:"||ed()==="https:"}function ed(){var n;return typeof self<"u"&&((n=self.location)===null||n===void 0?void 0:n.protocol)||null}/**
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
 */function eE(){return typeof navigator<"u"&&navigator&&"onLine"in navigator&&typeof navigator.onLine=="boolean"&&(Zv()||Cy()||"connection"in navigator)?navigator.onLine:!0}function tE(){if(typeof navigator>"u")return null;const n=navigator;return n.languages&&n.languages[0]||n.language||null}/**
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
 */class gr{constructor(e,t){this.shortDelay=e,this.longDelay=t,rn(t>e,"Short delay should be less than long delay!"),this.isMobile=pc()||im()}get(){return eE()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}}/**
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
 */function wc(n,e){rn(n.emulator,"Emulator should always be set here");const{url:t}=n.emulator;return e?`${t}${e.startsWith("/")?e.slice(1):e}`:t}/**
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
 */class fm{static initialize(e,t,s){this.fetchImpl=e,t&&(this.headersImpl=t),s&&(this.responseImpl=s)}static fetch(){if(this.fetchImpl)return this.fetchImpl;if(typeof self<"u"&&"fetch"in self)return self.fetch;if(typeof globalThis<"u"&&globalThis.fetch)return globalThis.fetch;if(typeof fetch<"u")return fetch;Jt("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){if(this.headersImpl)return this.headersImpl;if(typeof self<"u"&&"Headers"in self)return self.Headers;if(typeof globalThis<"u"&&globalThis.Headers)return globalThis.Headers;if(typeof Headers<"u")return Headers;Jt("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){if(this.responseImpl)return this.responseImpl;if(typeof self<"u"&&"Response"in self)return self.Response;if(typeof globalThis<"u"&&globalThis.Response)return globalThis.Response;if(typeof Response<"u")return Response;Jt("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}/**
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
 */const nE={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"};/**
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
 */const sE=new gr(3e4,6e4);function Tc(n,e){return n.tenantId&&!e.tenantId?Object.assign(Object.assign({},e),{tenantId:n.tenantId}):e}async function ei(n,e,t,s,i={}){return mm(n,i,async()=>{let r={},o={};s&&(e==="GET"?o=s:r={body:JSON.stringify(s)});const l=Zs(Object.assign({key:n.config.apiKey},o)).slice(1),c=await n._getAdditionalHeaders();c["Content-Type"]="application/json",n.languageCode&&(c["X-Firebase-Locale"]=n.languageCode);const h=Object.assign({method:e,headers:c},r);return by()||(h.referrerPolicy="no-referrer"),fm.fetch()(pm(n,n.config.apiHost,t,l),h)})}async function mm(n,e,t){n._canInitEmulator=!1;const s=Object.assign(Object.assign({},nE),e);try{const i=new rE(n),r=await Promise.race([t(),i.promise]);i.clearNetworkTimeout();const o=await r.json();if("needConfirmation"in o)throw no(n,"account-exists-with-different-credential",o);if(r.ok&&!("errorMessage"in o))return o;{const l=r.ok?o.errorMessage:o.error.message,[c,h]=l.split(" : ");if(c==="FEDERATED_USER_ID_ALREADY_LINKED")throw no(n,"credential-already-in-use",o);if(c==="EMAIL_EXISTS")throw no(n,"email-already-in-use",o);if(c==="USER_DISABLED")throw no(n,"user-disabled",o);const d=s[c]||c.toLowerCase().replace(/[_\s]+/g,"-");if(h)throw vc(n,d,h);Bt(n,d)}}catch(i){if(i instanceof cn)throw i;Bt(n,"network-request-failed",{message:String(i)})}}async function iE(n,e,t,s,i={}){const r=await ei(n,e,t,s,i);return"mfaPendingCredential"in r&&Bt(n,"multi-factor-auth-required",{_serverResponse:r}),r}function pm(n,e,t,s){const i=`${e}${t}?${s}`;return n.config.emulator?wc(n.config,i):`${n.config.apiScheme}://${i}`}class rE{constructor(e){this.auth=e,this.timer=null,this.promise=new Promise((t,s)=>{this.timer=setTimeout(()=>s(Pt(this.auth,"network-request-failed")),sE.get())})}clearNetworkTimeout(){clearTimeout(this.timer)}}function no(n,e,t){const s={appName:n.name};t.email&&(s.email=t.email),t.phoneNumber&&(s.phoneNumber=t.phoneNumber);const i=Pt(n,e,s);return i.customData._tokenResponse=t,i}/**
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
 */async function oE(n,e){return ei(n,"POST","/v1/accounts:delete",e)}async function gm(n,e){return ei(n,"POST","/v1/accounts:lookup",e)}/**
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
 */function Fi(n){if(n)try{const e=new Date(Number(n));if(!isNaN(e.getTime()))return e.toUTCString()}catch{}}async function aE(n,e=!1){const t=me(n),s=await t.getIdToken(e),i=Ic(s);Q(i&&i.exp&&i.auth_time&&i.iat,t.auth,"internal-error");const r=typeof i.firebase=="object"?i.firebase:void 0,o=r==null?void 0:r.sign_in_provider;return{claims:i,token:s,authTime:Fi(pl(i.auth_time)),issuedAtTime:Fi(pl(i.iat)),expirationTime:Fi(pl(i.exp)),signInProvider:o||null,signInSecondFactor:(r==null?void 0:r.sign_in_second_factor)||null}}function pl(n){return Number(n)*1e3}function Ic(n){const[e,t,s]=n.split(".");if(e===void 0||t===void 0||s===void 0)return ho("JWT malformed, contained fewer than 3 sections"),null;try{const i=Io(t);return i?JSON.parse(i):(ho("Failed to decode base64 JWT payload"),null)}catch(i){return ho("Caught error parsing JWT payload as JSON",i==null?void 0:i.toString()),null}}function td(n){const e=Ic(n);return Q(e,"internal-error"),Q(typeof e.exp<"u","internal-error"),Q(typeof e.iat<"u","internal-error"),Number(e.exp)-Number(e.iat)}/**
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
 */async function er(n,e,t=!1){if(t)return e;try{return await e}catch(s){throw s instanceof cn&&lE(s)&&n.auth.currentUser===n&&await n.auth.signOut(),s}}function lE({code:n}){return n==="auth/user-disabled"||n==="auth/user-token-expired"}/**
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
 */class cE{constructor(e){this.user=e,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,this.timerId!==null&&clearTimeout(this.timerId))}getInterval(e){var t;if(e){const s=this.errorBackoff;return this.errorBackoff=Math.min(this.errorBackoff*2,96e4),s}else{this.errorBackoff=3e4;const i=((t=this.user.stsTokenManager.expirationTime)!==null&&t!==void 0?t:0)-Date.now()-3e5;return Math.max(0,i)}}schedule(e=!1){if(!this.isRunning)return;const t=this.getInterval(e);this.timerId=setTimeout(async()=>{await this.iteration()},t)}async iteration(){try{await this.user.getIdToken(!0)}catch(e){(e==null?void 0:e.code)==="auth/network-request-failed"&&this.schedule(!0);return}this.schedule()}}/**
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
 */class Vl{constructor(e,t){this.createdAt=e,this.lastLoginAt=t,this._initializeTime()}_initializeTime(){this.lastSignInTime=Fi(this.lastLoginAt),this.creationTime=Fi(this.createdAt)}_copy(e){this.createdAt=e.createdAt,this.lastLoginAt=e.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}}/**
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
 */async function ko(n){var e;const t=n.auth,s=await n.getIdToken(),i=await er(n,gm(t,{idToken:s}));Q(i==null?void 0:i.users.length,t,"internal-error");const r=i.users[0];n._notifyReloadListener(r);const o=!((e=r.providerUserInfo)===null||e===void 0)&&e.length?_m(r.providerUserInfo):[],l=uE(n.providerData,o),c=n.isAnonymous,h=!(n.email&&r.passwordHash)&&!(l!=null&&l.length),d=c?h:!1,m={uid:r.localId,displayName:r.displayName||null,photoURL:r.photoUrl||null,email:r.email||null,emailVerified:r.emailVerified||!1,phoneNumber:r.phoneNumber||null,tenantId:r.tenantId||null,providerData:l,metadata:new Vl(r.createdAt,r.lastLoginAt),isAnonymous:d};Object.assign(n,m)}async function hE(n){const e=me(n);await ko(e),await e.auth._persistUserIfCurrent(e),e.auth._notifyListenersIfCurrent(e)}function uE(n,e){return[...n.filter(s=>!e.some(i=>i.providerId===s.providerId)),...e]}function _m(n){return n.map(e=>{var{providerId:t}=e,s=yc(e,["providerId"]);return{providerId:t,uid:s.rawId||"",displayName:s.displayName||null,email:s.email||null,phoneNumber:s.phoneNumber||null,photoURL:s.photoUrl||null}})}/**
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
 */async function dE(n,e){const t=await mm(n,{},async()=>{const s=Zs({grant_type:"refresh_token",refresh_token:e}).slice(1),{tokenApiHost:i,apiKey:r}=n.config,o=pm(n,i,"/v1/token",`key=${r}`),l=await n._getAdditionalHeaders();return l["Content-Type"]="application/x-www-form-urlencoded",fm.fetch()(o,{method:"POST",headers:l,body:s})});return{accessToken:t.access_token,expiresIn:t.expires_in,refreshToken:t.refresh_token}}async function fE(n,e){return ei(n,"POST","/v2/accounts:revokeToken",Tc(n,e))}/**
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
 */class Ps{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(e){Q(e.idToken,"internal-error"),Q(typeof e.idToken<"u","internal-error"),Q(typeof e.refreshToken<"u","internal-error");const t="expiresIn"in e&&typeof e.expiresIn<"u"?Number(e.expiresIn):td(e.idToken);this.updateTokensAndExpiration(e.idToken,e.refreshToken,t)}updateFromIdToken(e){Q(e.length!==0,"internal-error");const t=td(e);this.updateTokensAndExpiration(e,null,t)}async getToken(e,t=!1){return!t&&this.accessToken&&!this.isExpired?this.accessToken:(Q(this.refreshToken,e,"user-token-expired"),this.refreshToken?(await this.refresh(e,this.refreshToken),this.accessToken):null)}clearRefreshToken(){this.refreshToken=null}async refresh(e,t){const{accessToken:s,refreshToken:i,expiresIn:r}=await dE(e,t);this.updateTokensAndExpiration(s,i,Number(r))}updateTokensAndExpiration(e,t,s){this.refreshToken=t||null,this.accessToken=e||null,this.expirationTime=Date.now()+s*1e3}static fromJSON(e,t){const{refreshToken:s,accessToken:i,expirationTime:r}=t,o=new Ps;return s&&(Q(typeof s=="string","internal-error",{appName:e}),o.refreshToken=s),i&&(Q(typeof i=="string","internal-error",{appName:e}),o.accessToken=i),r&&(Q(typeof r=="number","internal-error",{appName:e}),o.expirationTime=r),o}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(e){this.accessToken=e.accessToken,this.refreshToken=e.refreshToken,this.expirationTime=e.expirationTime}_clone(){return Object.assign(new Ps,this.toJSON())}_performRefresh(){return Jt("not implemented")}}/**
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
 */function gn(n,e){Q(typeof n=="string"||typeof n>"u","internal-error",{appName:e})}class Zt{constructor(e){var{uid:t,auth:s,stsTokenManager:i}=e,r=yc(e,["uid","auth","stsTokenManager"]);this.providerId="firebase",this.proactiveRefresh=new cE(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=t,this.auth=s,this.stsTokenManager=i,this.accessToken=i.accessToken,this.displayName=r.displayName||null,this.email=r.email||null,this.emailVerified=r.emailVerified||!1,this.phoneNumber=r.phoneNumber||null,this.photoURL=r.photoURL||null,this.isAnonymous=r.isAnonymous||!1,this.tenantId=r.tenantId||null,this.providerData=r.providerData?[...r.providerData]:[],this.metadata=new Vl(r.createdAt||void 0,r.lastLoginAt||void 0)}async getIdToken(e){const t=await er(this,this.stsTokenManager.getToken(this.auth,e));return Q(t,this.auth,"internal-error"),this.accessToken!==t&&(this.accessToken=t,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),t}getIdTokenResult(e){return aE(this,e)}reload(){return hE(this)}_assign(e){this!==e&&(Q(this.uid===e.uid,this.auth,"internal-error"),this.displayName=e.displayName,this.photoURL=e.photoURL,this.email=e.email,this.emailVerified=e.emailVerified,this.phoneNumber=e.phoneNumber,this.isAnonymous=e.isAnonymous,this.tenantId=e.tenantId,this.providerData=e.providerData.map(t=>Object.assign({},t)),this.metadata._copy(e.metadata),this.stsTokenManager._assign(e.stsTokenManager))}_clone(e){const t=new Zt(Object.assign(Object.assign({},this),{auth:e,stsTokenManager:this.stsTokenManager._clone()}));return t.metadata._copy(this.metadata),t}_onReload(e){Q(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=e,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(e){this.reloadListener?this.reloadListener(e):this.reloadUserInfo=e}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(e,t=!1){let s=!1;e.idToken&&e.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(e),s=!0),t&&await ko(this),await this.auth._persistUserIfCurrent(this),s&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(Xt(this.auth.app))return Promise.reject(es(this.auth));const e=await this.getIdToken();return await er(this,oE(this.auth,{idToken:e})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return Object.assign(Object.assign({uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(e=>Object.assign({},e)),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId},this.metadata.toJSON()),{apiKey:this.auth.config.apiKey,appName:this.auth.name})}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(e,t){var s,i,r,o,l,c,h,d;const m=(s=t.displayName)!==null&&s!==void 0?s:void 0,p=(i=t.email)!==null&&i!==void 0?i:void 0,E=(r=t.phoneNumber)!==null&&r!==void 0?r:void 0,b=(o=t.photoURL)!==null&&o!==void 0?o:void 0,S=(l=t.tenantId)!==null&&l!==void 0?l:void 0,P=(c=t._redirectEventId)!==null&&c!==void 0?c:void 0,F=(h=t.createdAt)!==null&&h!==void 0?h:void 0,U=(d=t.lastLoginAt)!==null&&d!==void 0?d:void 0,{uid:O,emailVerified:G,isAnonymous:ae,providerData:ee,stsTokenManager:T}=t;Q(O&&T,e,"internal-error");const _=Ps.fromJSON(this.name,T);Q(typeof O=="string",e,"internal-error"),gn(m,e.name),gn(p,e.name),Q(typeof G=="boolean",e,"internal-error"),Q(typeof ae=="boolean",e,"internal-error"),gn(E,e.name),gn(b,e.name),gn(S,e.name),gn(P,e.name),gn(F,e.name),gn(U,e.name);const v=new Zt({uid:O,auth:e,email:p,emailVerified:G,displayName:m,isAnonymous:ae,photoURL:b,phoneNumber:E,tenantId:S,stsTokenManager:_,createdAt:F,lastLoginAt:U});return ee&&Array.isArray(ee)&&(v.providerData=ee.map(w=>Object.assign({},w))),P&&(v._redirectEventId=P),v}static async _fromIdTokenResponse(e,t,s=!1){const i=new Ps;i.updateFromServerResponse(t);const r=new Zt({uid:t.localId,auth:e,stsTokenManager:i,isAnonymous:s});return await ko(r),r}static async _fromGetAccountInfoResponse(e,t,s){const i=t.users[0];Q(i.localId!==void 0,"internal-error");const r=i.providerUserInfo!==void 0?_m(i.providerUserInfo):[],o=!(i.email&&i.passwordHash)&&!(r!=null&&r.length),l=new Ps;l.updateFromIdToken(s);const c=new Zt({uid:i.localId,auth:e,stsTokenManager:l,isAnonymous:o}),h={uid:i.localId,displayName:i.displayName||null,photoURL:i.photoUrl||null,email:i.email||null,emailVerified:i.emailVerified||!1,phoneNumber:i.phoneNumber||null,tenantId:i.tenantId||null,providerData:r,metadata:new Vl(i.createdAt,i.lastLoginAt),isAnonymous:!(i.email&&i.passwordHash)&&!(r!=null&&r.length)};return Object.assign(c,h),c}}/**
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
 */const nd=new Map;function en(n){rn(n instanceof Function,"Expected a class definition");let e=nd.get(n);return e?(rn(e instanceof n,"Instance stored in cache mismatched with class"),e):(e=new n,nd.set(n,e),e)}/**
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
 */class ym{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(e,t){this.storage[e]=t}async _get(e){const t=this.storage[e];return t===void 0?null:t}async _remove(e){delete this.storage[e]}_addListener(e,t){}_removeListener(e,t){}}ym.type="NONE";const sd=ym;/**
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
 */function uo(n,e,t){return`firebase:${n}:${e}:${t}`}class Ns{constructor(e,t,s){this.persistence=e,this.auth=t,this.userKey=s;const{config:i,name:r}=this.auth;this.fullUserKey=uo(this.userKey,i.apiKey,r),this.fullPersistenceKey=uo("persistence",i.apiKey,r),this.boundEventHandler=t._onStorageEvent.bind(t),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(e){return this.persistence._set(this.fullUserKey,e.toJSON())}async getCurrentUser(){const e=await this.persistence._get(this.fullUserKey);return e?Zt._fromJSON(this.auth,e):null}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(e){if(this.persistence===e)return;const t=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=e,t)return this.setCurrentUser(t)}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(e,t,s="authUser"){if(!t.length)return new Ns(en(sd),e,s);const i=(await Promise.all(t.map(async h=>{if(await h._isAvailable())return h}))).filter(h=>h);let r=i[0]||en(sd);const o=uo(s,e.config.apiKey,e.name);let l=null;for(const h of t)try{const d=await h._get(o);if(d){const m=Zt._fromJSON(e,d);h!==r&&(l=m),r=h;break}}catch{}const c=i.filter(h=>h._shouldAllowMigration);return!r._shouldAllowMigration||!c.length?new Ns(r,e,s):(r=c[0],l&&await r._set(o,l.toJSON()),await Promise.all(t.map(async h=>{if(h!==r)try{await h._remove(o)}catch{}})),new Ns(r,e,s))}}/**
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
 */function id(n){const e=n.toLowerCase();if(e.includes("opera/")||e.includes("opr/")||e.includes("opios/"))return"Opera";if(Tm(e))return"IEMobile";if(e.includes("msie")||e.includes("trident/"))return"IE";if(e.includes("edge/"))return"Edge";if(vm(e))return"Firefox";if(e.includes("silk/"))return"Silk";if(bm(e))return"Blackberry";if(Cm(e))return"Webos";if(Em(e))return"Safari";if((e.includes("chrome/")||wm(e))&&!e.includes("edge/"))return"Chrome";if(Im(e))return"Android";{const t=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,s=n.match(t);if((s==null?void 0:s.length)===2)return s[1]}return"Other"}function vm(n=st()){return/firefox\//i.test(n)}function Em(n=st()){const e=n.toLowerCase();return e.includes("safari/")&&!e.includes("chrome/")&&!e.includes("crios/")&&!e.includes("android")}function wm(n=st()){return/crios\//i.test(n)}function Tm(n=st()){return/iemobile/i.test(n)}function Im(n=st()){return/android/i.test(n)}function bm(n=st()){return/blackberry/i.test(n)}function Cm(n=st()){return/webos/i.test(n)}function bc(n=st()){return/iphone|ipad|ipod/i.test(n)||/macintosh/i.test(n)&&/mobile/i.test(n)}function mE(n=st()){var e;return bc(n)&&!!(!((e=window.navigator)===null||e===void 0)&&e.standalone)}function pE(){return Ry()&&document.documentMode===10}function Rm(n=st()){return bc(n)||Im(n)||Cm(n)||bm(n)||/windows phone/i.test(n)||Tm(n)}/**
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
 */function Sm(n,e=[]){let t;switch(n){case"Browser":t=id(st());break;case"Worker":t=`${id(st())}-${n}`;break;default:t=n}const s=e.length?e.join(","):"FirebaseCore-web";return`${t}/JsCore/${ds}/${s}`}/**
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
 */class gE{constructor(e){this.auth=e,this.queue=[]}pushCallback(e,t){const s=r=>new Promise((o,l)=>{try{const c=e(r);o(c)}catch(c){l(c)}});s.onAbort=t,this.queue.push(s);const i=this.queue.length-1;return()=>{this.queue[i]=()=>Promise.resolve()}}async runMiddleware(e){if(this.auth.currentUser===e)return;const t=[];try{for(const s of this.queue)await s(e),s.onAbort&&t.push(s.onAbort)}catch(s){t.reverse();for(const i of t)try{i()}catch{}throw this.auth._errorFactory.create("login-blocked",{originalMessage:s==null?void 0:s.message})}}}/**
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
 */async function _E(n,e={}){return ei(n,"GET","/v2/passwordPolicy",Tc(n,e))}/**
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
 */const yE=6;class vE{constructor(e){var t,s,i,r;const o=e.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=(t=o.minPasswordLength)!==null&&t!==void 0?t:yE,o.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=o.maxPasswordLength),o.containsLowercaseCharacter!==void 0&&(this.customStrengthOptions.containsLowercaseLetter=o.containsLowercaseCharacter),o.containsUppercaseCharacter!==void 0&&(this.customStrengthOptions.containsUppercaseLetter=o.containsUppercaseCharacter),o.containsNumericCharacter!==void 0&&(this.customStrengthOptions.containsNumericCharacter=o.containsNumericCharacter),o.containsNonAlphanumericCharacter!==void 0&&(this.customStrengthOptions.containsNonAlphanumericCharacter=o.containsNonAlphanumericCharacter),this.enforcementState=e.enforcementState,this.enforcementState==="ENFORCEMENT_STATE_UNSPECIFIED"&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=(i=(s=e.allowedNonAlphanumericCharacters)===null||s===void 0?void 0:s.join(""))!==null&&i!==void 0?i:"",this.forceUpgradeOnSignin=(r=e.forceUpgradeOnSignin)!==null&&r!==void 0?r:!1,this.schemaVersion=e.schemaVersion}validatePassword(e){var t,s,i,r,o,l;const c={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(e,c),this.validatePasswordCharacterOptions(e,c),c.isValid&&(c.isValid=(t=c.meetsMinPasswordLength)!==null&&t!==void 0?t:!0),c.isValid&&(c.isValid=(s=c.meetsMaxPasswordLength)!==null&&s!==void 0?s:!0),c.isValid&&(c.isValid=(i=c.containsLowercaseLetter)!==null&&i!==void 0?i:!0),c.isValid&&(c.isValid=(r=c.containsUppercaseLetter)!==null&&r!==void 0?r:!0),c.isValid&&(c.isValid=(o=c.containsNumericCharacter)!==null&&o!==void 0?o:!0),c.isValid&&(c.isValid=(l=c.containsNonAlphanumericCharacter)!==null&&l!==void 0?l:!0),c}validatePasswordLengthOptions(e,t){const s=this.customStrengthOptions.minPasswordLength,i=this.customStrengthOptions.maxPasswordLength;s&&(t.meetsMinPasswordLength=e.length>=s),i&&(t.meetsMaxPasswordLength=e.length<=i)}validatePasswordCharacterOptions(e,t){this.updatePasswordCharacterOptionsStatuses(t,!1,!1,!1,!1);let s;for(let i=0;i<e.length;i++)s=e.charAt(i),this.updatePasswordCharacterOptionsStatuses(t,s>="a"&&s<="z",s>="A"&&s<="Z",s>="0"&&s<="9",this.allowedNonAlphanumericCharacters.includes(s))}updatePasswordCharacterOptionsStatuses(e,t,s,i,r){this.customStrengthOptions.containsLowercaseLetter&&(e.containsLowercaseLetter||(e.containsLowercaseLetter=t)),this.customStrengthOptions.containsUppercaseLetter&&(e.containsUppercaseLetter||(e.containsUppercaseLetter=s)),this.customStrengthOptions.containsNumericCharacter&&(e.containsNumericCharacter||(e.containsNumericCharacter=i)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(e.containsNonAlphanumericCharacter||(e.containsNonAlphanumericCharacter=r))}}/**
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
 */class EE{constructor(e,t,s,i){this.app=e,this.heartbeatServiceProvider=t,this.appCheckServiceProvider=s,this.config=i,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new rd(this),this.idTokenSubscription=new rd(this),this.beforeStateQueue=new gE(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=dm,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=e.name,this.clientVersion=i.sdkClientVersion}_initializeWithPersistence(e,t){return t&&(this._popupRedirectResolver=en(t)),this._initializationPromise=this.queue(async()=>{var s,i;if(!this._deleted&&(this.persistenceManager=await Ns.create(this,e),!this._deleted)){if(!((s=this._popupRedirectResolver)===null||s===void 0)&&s._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch{}await this.initializeCurrentUser(t),this.lastNotifiedUid=((i=this.currentUser)===null||i===void 0?void 0:i.uid)||null,!this._deleted&&(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;const e=await this.assertedPersistence.getCurrentUser();if(!(!this.currentUser&&!e)){if(this.currentUser&&e&&this.currentUser.uid===e.uid){this._currentUser._assign(e),await this.currentUser.getIdToken();return}await this._updateCurrentUser(e,!0)}}async initializeCurrentUserFromIdToken(e){try{const t=await gm(this,{idToken:e}),s=await Zt._fromGetAccountInfoResponse(this,t,e);await this.directlySetCurrentUser(s)}catch(t){console.warn("FirebaseServerApp could not login user with provided authIdToken: ",t),await this.directlySetCurrentUser(null)}}async initializeCurrentUser(e){var t;if(Xt(this.app)){const o=this.app.settings.authIdToken;return o?new Promise(l=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(o).then(l,l))}):this.directlySetCurrentUser(null)}const s=await this.assertedPersistence.getCurrentUser();let i=s,r=!1;if(e&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();const o=(t=this.redirectUser)===null||t===void 0?void 0:t._redirectEventId,l=i==null?void 0:i._redirectEventId,c=await this.tryRedirectSignIn(e);(!o||o===l)&&(c!=null&&c.user)&&(i=c.user,r=!0)}if(!i)return this.directlySetCurrentUser(null);if(!i._redirectEventId){if(r)try{await this.beforeStateQueue.runMiddleware(i)}catch(o){i=s,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(o))}return i?this.reloadAndSetCurrentUserOrClear(i):this.directlySetCurrentUser(null)}return Q(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===i._redirectEventId?this.directlySetCurrentUser(i):this.reloadAndSetCurrentUserOrClear(i)}async tryRedirectSignIn(e){let t=null;try{t=await this._popupRedirectResolver._completeRedirectFn(this,e,!0)}catch{await this._setRedirectUser(null)}return t}async reloadAndSetCurrentUserOrClear(e){try{await ko(e)}catch(t){if((t==null?void 0:t.code)!=="auth/network-request-failed")return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)}useDeviceLanguage(){this.languageCode=tE()}async _delete(){this._deleted=!0}async updateCurrentUser(e){if(Xt(this.app))return Promise.reject(es(this));const t=e?me(e):null;return t&&Q(t.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(t&&t._clone(this))}async _updateCurrentUser(e,t=!1){if(!this._deleted)return e&&Q(this.tenantId===e.tenantId,this,"tenant-id-mismatch"),t||await this.beforeStateQueue.runMiddleware(e),this.queue(async()=>{await this.directlySetCurrentUser(e),this.notifyAuthListeners()})}async signOut(){return Xt(this.app)?Promise.reject(es(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(e){return Xt(this.app)?Promise.reject(es(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(en(e))})}_getRecaptchaConfig(){return this.tenantId==null?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(e){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();const t=this._getPasswordPolicyInternal();return t.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):t.validatePassword(e)}_getPasswordPolicyInternal(){return this.tenantId===null?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){const e=await _E(this),t=new vE(e);this.tenantId===null?this._projectPasswordPolicy=t:this._tenantPasswordPolicies[this.tenantId]=t}_getPersistence(){return this.assertedPersistence.persistence.type}_updateErrorMap(e){this._errorFactory=new pr("auth","Firebase",e())}onAuthStateChanged(e,t,s){return this.registerStateListener(this.authStateSubscription,e,t,s)}beforeAuthStateChanged(e,t){return this.beforeStateQueue.pushCallback(e,t)}onIdTokenChanged(e,t,s){return this.registerStateListener(this.idTokenSubscription,e,t,s)}authStateReady(){return new Promise((e,t)=>{if(this.currentUser)e();else{const s=this.onAuthStateChanged(()=>{s(),e()},t)}})}async revokeAccessToken(e){if(this.currentUser){const t=await this.currentUser.getIdToken(),s={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:e,idToken:t};this.tenantId!=null&&(s.tenantId=this.tenantId),await fE(this,s)}}toJSON(){var e;return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:(e=this._currentUser)===null||e===void 0?void 0:e.toJSON()}}async _setRedirectUser(e,t){const s=await this.getOrInitRedirectPersistenceManager(t);return e===null?s.removeCurrentUser():s.setCurrentUser(e)}async getOrInitRedirectPersistenceManager(e){if(!this.redirectPersistenceManager){const t=e&&en(e)||this._popupRedirectResolver;Q(t,this,"argument-error"),this.redirectPersistenceManager=await Ns.create(this,[en(t._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(e){var t,s;return this._isInitialized&&await this.queue(async()=>{}),((t=this._currentUser)===null||t===void 0?void 0:t._redirectEventId)===e?this._currentUser:((s=this.redirectUser)===null||s===void 0?void 0:s._redirectEventId)===e?this.redirectUser:null}async _persistUserIfCurrent(e){if(e===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(e))}_notifyListenersIfCurrent(e){e===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){var e,t;if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);const s=(t=(e=this.currentUser)===null||e===void 0?void 0:e.uid)!==null&&t!==void 0?t:null;this.lastNotifiedUid!==s&&(this.lastNotifiedUid=s,this.authStateSubscription.next(this.currentUser))}registerStateListener(e,t,s,i){if(this._deleted)return()=>{};const r=typeof t=="function"?t:t.next.bind(t);let o=!1;const l=this._isInitialized?Promise.resolve():this._initializationPromise;if(Q(l,this,"internal-error"),l.then(()=>{o||r(this.currentUser)}),typeof t=="function"){const c=e.addObserver(t,s,i);return()=>{o=!0,c()}}else{const c=e.addObserver(t);return()=>{o=!0,c()}}}async directlySetCurrentUser(e){this.currentUser&&this.currentUser!==e&&this._currentUser._stopProactiveRefresh(),e&&this.isProactiveRefreshEnabled&&e._startProactiveRefresh(),this.currentUser=e,e?await this.assertedPersistence.setCurrentUser(e):await this.assertedPersistence.removeCurrentUser()}queue(e){return this.operations=this.operations.then(e,e),this.operations}get assertedPersistence(){return Q(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(e){!e||this.frameworks.includes(e)||(this.frameworks.push(e),this.frameworks.sort(),this.clientVersion=Sm(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){var e;const t={"X-Client-Version":this.clientVersion};this.app.options.appId&&(t["X-Firebase-gmpid"]=this.app.options.appId);const s=await((e=this.heartbeatServiceProvider.getImmediate({optional:!0}))===null||e===void 0?void 0:e.getHeartbeatsHeader());s&&(t["X-Firebase-Client"]=s);const i=await this._getAppCheckToken();return i&&(t["X-Firebase-AppCheck"]=i),t}async _getAppCheckToken(){var e;const t=await((e=this.appCheckServiceProvider.getImmediate({optional:!0}))===null||e===void 0?void 0:e.getToken());return t!=null&&t.error&&Xv(`Error while retrieving App Check token: ${t.error}`),t==null?void 0:t.token}}function ma(n){return me(n)}class rd{constructor(e){this.auth=e,this.observer=null,this.addObserver=Vy(t=>this.observer=t)}get next(){return Q(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}/**
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
 */let Cc={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function wE(n){Cc=n}function TE(n){return Cc.loadJS(n)}function IE(){return Cc.gapiScript}function bE(n){return`__${n}${Math.floor(Math.random()*1e6)}`}/**
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
 */function CE(n,e){const t=fa(n,"auth");if(t.isInitialized()){const i=t.getImmediate(),r=t.getOptions();if(Ro(r,e??{}))return i;Bt(i,"already-initialized")}return t.initialize({options:e})}function RE(n,e){const t=(e==null?void 0:e.persistence)||[],s=(Array.isArray(t)?t:[t]).map(en);e!=null&&e.errorMap&&n._updateErrorMap(e.errorMap),n._initializeWithPersistence(s,e==null?void 0:e.popupRedirectResolver)}function SE(n,e,t){const s=ma(n);Q(s._canInitEmulator,s,"emulator-config-failed"),Q(/^https?:\/\//.test(e),s,"invalid-emulator-scheme");const i=!1,r=Am(e),{host:o,port:l}=AE(e),c=l===null?"":`:${l}`;s.config.emulator={url:`${r}//${o}${c}/`},s.settings.appVerificationDisabledForTesting=!0,s.emulatorConfig=Object.freeze({host:o,port:l,protocol:r.replace(":",""),options:Object.freeze({disableWarnings:i})}),kE()}function Am(n){const e=n.indexOf(":");return e<0?"":n.substr(0,e+1)}function AE(n){const e=Am(n),t=/(\/\/)?([^?#/]+)/.exec(n.substr(e.length));if(!t)return{host:"",port:null};const s=t[2].split("@").pop()||"",i=/^(\[[^\]]+\])(:|$)/.exec(s);if(i){const r=i[1];return{host:r,port:od(s.substr(r.length+1))}}else{const[r,o]=s.split(":");return{host:r,port:od(o)}}}function od(n){if(!n)return null;const e=Number(n);return isNaN(e)?null:e}function kE(){function n(){const e=document.createElement("p"),t=e.style;e.innerText="Running in emulator mode. Do not use with production credentials.",t.position="fixed",t.width="100%",t.backgroundColor="#ffffff",t.border=".1em solid #000000",t.color="#b50000",t.bottom="0px",t.left="0px",t.margin="0px",t.zIndex="10000",t.textAlign="center",e.classList.add("firebase-emulator-warning"),document.body.appendChild(e)}typeof console<"u"&&typeof console.info=="function"&&console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials."),typeof window<"u"&&typeof document<"u"&&(document.readyState==="loading"?window.addEventListener("DOMContentLoaded",n):n())}/**
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
 */class km{constructor(e,t){this.providerId=e,this.signInMethod=t}toJSON(){return Jt("not implemented")}_getIdTokenResponse(e){return Jt("not implemented")}_linkToIdToken(e,t){return Jt("not implemented")}_getReauthenticationResolver(e){return Jt("not implemented")}}/**
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
 */async function Ds(n,e){return iE(n,"POST","/v1/accounts:signInWithIdp",Tc(n,e))}/**
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
 */const PE="http://localhost";class is extends km{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(e){const t=new is(e.providerId,e.signInMethod);return e.idToken||e.accessToken?(e.idToken&&(t.idToken=e.idToken),e.accessToken&&(t.accessToken=e.accessToken),e.nonce&&!e.pendingToken&&(t.nonce=e.nonce),e.pendingToken&&(t.pendingToken=e.pendingToken)):e.oauthToken&&e.oauthTokenSecret?(t.accessToken=e.oauthToken,t.secret=e.oauthTokenSecret):Bt("argument-error"),t}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(e){const t=typeof e=="string"?JSON.parse(e):e,{providerId:s,signInMethod:i}=t,r=yc(t,["providerId","signInMethod"]);if(!s||!i)return null;const o=new is(s,i);return o.idToken=r.idToken||void 0,o.accessToken=r.accessToken||void 0,o.secret=r.secret,o.nonce=r.nonce,o.pendingToken=r.pendingToken||null,o}_getIdTokenResponse(e){const t=this.buildRequest();return Ds(e,t)}_linkToIdToken(e,t){const s=this.buildRequest();return s.idToken=t,Ds(e,s)}_getReauthenticationResolver(e){const t=this.buildRequest();return t.autoCreate=!1,Ds(e,t)}buildRequest(){const e={requestUri:PE,returnSecureToken:!0};if(this.pendingToken)e.pendingToken=this.pendingToken;else{const t={};this.idToken&&(t.id_token=this.idToken),this.accessToken&&(t.access_token=this.accessToken),this.secret&&(t.oauth_token_secret=this.secret),t.providerId=this.providerId,this.nonce&&!this.pendingToken&&(t.nonce=this.nonce),e.postBody=Zs(t)}return e}}/**
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
 */class Rc{constructor(e){this.providerId=e,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(e){this.defaultLanguageCode=e}setCustomParameters(e){return this.customParameters=e,this}getCustomParameters(){return this.customParameters}}/**
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
 */class _r extends Rc{constructor(){super(...arguments),this.scopes=[]}addScope(e){return this.scopes.includes(e)||this.scopes.push(e),this}getScopes(){return[...this.scopes]}}/**
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
 */class yn extends _r{constructor(){super("facebook.com")}static credential(e){return is._fromParams({providerId:yn.PROVIDER_ID,signInMethod:yn.FACEBOOK_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return yn.credentialFromTaggedObject(e)}static credentialFromError(e){return yn.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return yn.credential(e.oauthAccessToken)}catch{return null}}}yn.FACEBOOK_SIGN_IN_METHOD="facebook.com";yn.PROVIDER_ID="facebook.com";/**
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
 */class Yt extends _r{constructor(){super("google.com"),this.addScope("profile")}static credential(e,t){return is._fromParams({providerId:Yt.PROVIDER_ID,signInMethod:Yt.GOOGLE_SIGN_IN_METHOD,idToken:e,accessToken:t})}static credentialFromResult(e){return Yt.credentialFromTaggedObject(e)}static credentialFromError(e){return Yt.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthIdToken:t,oauthAccessToken:s}=e;if(!t&&!s)return null;try{return Yt.credential(t,s)}catch{return null}}}Yt.GOOGLE_SIGN_IN_METHOD="google.com";Yt.PROVIDER_ID="google.com";/**
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
 */class vn extends _r{constructor(){super("github.com")}static credential(e){return is._fromParams({providerId:vn.PROVIDER_ID,signInMethod:vn.GITHUB_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return vn.credentialFromTaggedObject(e)}static credentialFromError(e){return vn.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return vn.credential(e.oauthAccessToken)}catch{return null}}}vn.GITHUB_SIGN_IN_METHOD="github.com";vn.PROVIDER_ID="github.com";/**
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
 */class En extends _r{constructor(){super("twitter.com")}static credential(e,t){return is._fromParams({providerId:En.PROVIDER_ID,signInMethod:En.TWITTER_SIGN_IN_METHOD,oauthToken:e,oauthTokenSecret:t})}static credentialFromResult(e){return En.credentialFromTaggedObject(e)}static credentialFromError(e){return En.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthAccessToken:t,oauthTokenSecret:s}=e;if(!t||!s)return null;try{return En.credential(t,s)}catch{return null}}}En.TWITTER_SIGN_IN_METHOD="twitter.com";En.PROVIDER_ID="twitter.com";/**
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
 */class Fs{constructor(e){this.user=e.user,this.providerId=e.providerId,this._tokenResponse=e._tokenResponse,this.operationType=e.operationType}static async _fromIdTokenResponse(e,t,s,i=!1){const r=await Zt._fromIdTokenResponse(e,s,i),o=ad(s);return new Fs({user:r,providerId:o,_tokenResponse:s,operationType:t})}static async _forOperation(e,t,s){await e._updateTokensIfNecessary(s,!0);const i=ad(s);return new Fs({user:e,providerId:i,_tokenResponse:s,operationType:t})}}function ad(n){return n.providerId?n.providerId:"phoneNumber"in n?"phone":null}/**
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
 */class Po extends cn{constructor(e,t,s,i){var r;super(t.code,t.message),this.operationType=s,this.user=i,Object.setPrototypeOf(this,Po.prototype),this.customData={appName:e.name,tenantId:(r=e.tenantId)!==null&&r!==void 0?r:void 0,_serverResponse:t.customData._serverResponse,operationType:s}}static _fromErrorAndOperation(e,t,s,i){return new Po(e,t,s,i)}}function Pm(n,e,t,s){return(e==="reauthenticate"?t._getReauthenticationResolver(n):t._getIdTokenResponse(n)).catch(r=>{throw r.code==="auth/multi-factor-auth-required"?Po._fromErrorAndOperation(n,r,e,s):r})}async function NE(n,e,t=!1){const s=await er(n,e._linkToIdToken(n.auth,await n.getIdToken()),t);return Fs._forOperation(n,"link",s)}/**
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
 */async function DE(n,e,t=!1){const{auth:s}=n;if(Xt(s.app))return Promise.reject(es(s));const i="reauthenticate";try{const r=await er(n,Pm(s,i,e,n),t);Q(r.idToken,s,"internal-error");const o=Ic(r.idToken);Q(o,s,"internal-error");const{sub:l}=o;return Q(n.uid===l,s,"user-mismatch"),Fs._forOperation(n,i,r)}catch(r){throw(r==null?void 0:r.code)==="auth/user-not-found"&&Bt(s,"user-mismatch"),r}}/**
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
 */async function xE(n,e,t=!1){if(Xt(n.app))return Promise.reject(es(n));const s="signIn",i=await Pm(n,s,e),r=await Fs._fromIdTokenResponse(n,s,i);return t||await n._updateCurrentUser(r.user),r}function ME(n,e,t,s){return me(n).onIdTokenChanged(e,t,s)}function LE(n,e,t){return me(n).beforeAuthStateChanged(e,t)}function Nm(n,e,t,s){return me(n).onAuthStateChanged(e,t,s)}function OE(n){return me(n).signOut()}const No="__sak";/**
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
 */class Dm{constructor(e,t){this.storageRetriever=e,this.type=t}_isAvailable(){try{return this.storage?(this.storage.setItem(No,"1"),this.storage.removeItem(No),Promise.resolve(!0)):Promise.resolve(!1)}catch{return Promise.resolve(!1)}}_set(e,t){return this.storage.setItem(e,JSON.stringify(t)),Promise.resolve()}_get(e){const t=this.storage.getItem(e);return Promise.resolve(t?JSON.parse(t):null)}_remove(e){return this.storage.removeItem(e),Promise.resolve()}get storage(){return this.storageRetriever()}}/**
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
 */const VE=1e3,FE=10;class xm extends Dm{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(e,t)=>this.onStorageEvent(e,t),this.listeners={},this.localCache={},this.pollTimer=null,this.fallbackToPolling=Rm(),this._shouldAllowMigration=!0}forAllChangedKeys(e){for(const t of Object.keys(this.listeners)){const s=this.storage.getItem(t),i=this.localCache[t];s!==i&&e(t,i,s)}}onStorageEvent(e,t=!1){if(!e.key){this.forAllChangedKeys((o,l,c)=>{this.notifyListeners(o,c)});return}const s=e.key;t?this.detachListener():this.stopPolling();const i=()=>{const o=this.storage.getItem(s);!t&&this.localCache[s]===o||this.notifyListeners(s,o)},r=this.storage.getItem(s);pE()&&r!==e.newValue&&e.newValue!==e.oldValue?setTimeout(i,FE):i()}notifyListeners(e,t){this.localCache[e]=t;const s=this.listeners[e];if(s)for(const i of Array.from(s))i(t&&JSON.parse(t))}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((e,t,s)=>{this.onStorageEvent(new StorageEvent("storage",{key:e,oldValue:t,newValue:s}),!0)})},VE)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(e,t){Object.keys(this.listeners).length===0&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[e]||(this.listeners[e]=new Set,this.localCache[e]=this.storage.getItem(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.detachListener(),this.stopPolling())}async _set(e,t){await super._set(e,t),this.localCache[e]=JSON.stringify(t)}async _get(e){const t=await super._get(e);return this.localCache[e]=JSON.stringify(t),t}async _remove(e){await super._remove(e),delete this.localCache[e]}}xm.type="LOCAL";const BE=xm;/**
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
 */class Mm extends Dm{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(e,t){}_removeListener(e,t){}}Mm.type="SESSION";const Lm=Mm;/**
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
 */function UE(n){return Promise.all(n.map(async e=>{try{return{fulfilled:!0,value:await e}}catch(t){return{fulfilled:!1,reason:t}}}))}/**
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
 */class pa{constructor(e){this.eventTarget=e,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(e){const t=this.receivers.find(i=>i.isListeningto(e));if(t)return t;const s=new pa(e);return this.receivers.push(s),s}isListeningto(e){return this.eventTarget===e}async handleEvent(e){const t=e,{eventId:s,eventType:i,data:r}=t.data,o=this.handlersMap[i];if(!(o!=null&&o.size))return;t.ports[0].postMessage({status:"ack",eventId:s,eventType:i});const l=Array.from(o).map(async h=>h(t.origin,r)),c=await UE(l);t.ports[0].postMessage({status:"done",eventId:s,eventType:i,response:c})}_subscribe(e,t){Object.keys(this.handlersMap).length===0&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[e]||(this.handlersMap[e]=new Set),this.handlersMap[e].add(t)}_unsubscribe(e,t){this.handlersMap[e]&&t&&this.handlersMap[e].delete(t),(!t||this.handlersMap[e].size===0)&&delete this.handlersMap[e],Object.keys(this.handlersMap).length===0&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}}pa.receivers=[];/**
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
 */function Sc(n="",e=10){let t="";for(let s=0;s<e;s++)t+=Math.floor(Math.random()*10);return n+t}/**
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
 */class jE{constructor(e){this.target=e,this.handlers=new Set}removeMessageHandler(e){e.messageChannel&&(e.messageChannel.port1.removeEventListener("message",e.onMessage),e.messageChannel.port1.close()),this.handlers.delete(e)}async _send(e,t,s=50){const i=typeof MessageChannel<"u"?new MessageChannel:null;if(!i)throw new Error("connection_unavailable");let r,o;return new Promise((l,c)=>{const h=Sc("",20);i.port1.start();const d=setTimeout(()=>{c(new Error("unsupported_event"))},s);o={messageChannel:i,onMessage(m){const p=m;if(p.data.eventId===h)switch(p.data.status){case"ack":clearTimeout(d),r=setTimeout(()=>{c(new Error("timeout"))},3e3);break;case"done":clearTimeout(r),l(p.data.response);break;default:clearTimeout(d),clearTimeout(r),c(new Error("invalid_response"));break}}},this.handlers.add(o),i.port1.addEventListener("message",o.onMessage),this.target.postMessage({eventType:e,eventId:h,data:t},[i.port2])}).finally(()=>{o&&this.removeMessageHandler(o)})}}/**
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
 */function Ot(){return window}function $E(n){Ot().location.href=n}/**
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
 */function Om(){return typeof Ot().WorkerGlobalScope<"u"&&typeof Ot().importScripts=="function"}async function WE(){if(!(navigator!=null&&navigator.serviceWorker))return null;try{return(await navigator.serviceWorker.ready).active}catch{return null}}function qE(){var n;return((n=navigator==null?void 0:navigator.serviceWorker)===null||n===void 0?void 0:n.controller)||null}function zE(){return Om()?self:null}/**
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
 */const Vm="firebaseLocalStorageDb",HE=1,Do="firebaseLocalStorage",Fm="fbase_key";class yr{constructor(e){this.request=e}toPromise(){return new Promise((e,t)=>{this.request.addEventListener("success",()=>{e(this.request.result)}),this.request.addEventListener("error",()=>{t(this.request.error)})})}}function ga(n,e){return n.transaction([Do],e?"readwrite":"readonly").objectStore(Do)}function GE(){const n=indexedDB.deleteDatabase(Vm);return new yr(n).toPromise()}function Fl(){const n=indexedDB.open(Vm,HE);return new Promise((e,t)=>{n.addEventListener("error",()=>{t(n.error)}),n.addEventListener("upgradeneeded",()=>{const s=n.result;try{s.createObjectStore(Do,{keyPath:Fm})}catch(i){t(i)}}),n.addEventListener("success",async()=>{const s=n.result;s.objectStoreNames.contains(Do)?e(s):(s.close(),await GE(),e(await Fl()))})})}async function ld(n,e,t){const s=ga(n,!0).put({[Fm]:e,value:t});return new yr(s).toPromise()}async function KE(n,e){const t=ga(n,!1).get(e),s=await new yr(t).toPromise();return s===void 0?null:s.value}function cd(n,e){const t=ga(n,!0).delete(e);return new yr(t).toPromise()}const QE=800,YE=3;class Bm{constructor(){this.type="LOCAL",this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){return this.db?this.db:(this.db=await Fl(),this.db)}async _withRetries(e){let t=0;for(;;)try{const s=await this._openDb();return await e(s)}catch(s){if(t++>YE)throw s;this.db&&(this.db.close(),this.db=void 0)}}async initializeServiceWorkerMessaging(){return Om()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=pa._getInstance(zE()),this.receiver._subscribe("keyChanged",async(e,t)=>({keyProcessed:(await this._poll()).includes(t.key)})),this.receiver._subscribe("ping",async(e,t)=>["keyChanged"])}async initializeSender(){var e,t;if(this.activeServiceWorker=await WE(),!this.activeServiceWorker)return;this.sender=new jE(this.activeServiceWorker);const s=await this.sender._send("ping",{},800);s&&!((e=s[0])===null||e===void 0)&&e.fulfilled&&!((t=s[0])===null||t===void 0)&&t.value.includes("keyChanged")&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(e){if(!(!this.sender||!this.activeServiceWorker||qE()!==this.activeServiceWorker))try{await this.sender._send("keyChanged",{key:e},this.serviceWorkerReceiverAvailable?800:50)}catch{}}async _isAvailable(){try{if(!indexedDB)return!1;const e=await Fl();return await ld(e,No,"1"),await cd(e,No),!0}catch{}return!1}async _withPendingWrite(e){this.pendingWrites++;try{await e()}finally{this.pendingWrites--}}async _set(e,t){return this._withPendingWrite(async()=>(await this._withRetries(s=>ld(s,e,t)),this.localCache[e]=t,this.notifyServiceWorker(e)))}async _get(e){const t=await this._withRetries(s=>KE(s,e));return this.localCache[e]=t,t}async _remove(e){return this._withPendingWrite(async()=>(await this._withRetries(t=>cd(t,e)),delete this.localCache[e],this.notifyServiceWorker(e)))}async _poll(){const e=await this._withRetries(i=>{const r=ga(i,!1).getAll();return new yr(r).toPromise()});if(!e)return[];if(this.pendingWrites!==0)return[];const t=[],s=new Set;if(e.length!==0)for(const{fbase_key:i,value:r}of e)s.add(i),JSON.stringify(this.localCache[i])!==JSON.stringify(r)&&(this.notifyListeners(i,r),t.push(i));for(const i of Object.keys(this.localCache))this.localCache[i]&&!s.has(i)&&(this.notifyListeners(i,null),t.push(i));return t}notifyListeners(e,t){this.localCache[e]=t;const s=this.listeners[e];if(s)for(const i of Array.from(s))i(t)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),QE)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(e,t){Object.keys(this.listeners).length===0&&this.startPolling(),this.listeners[e]||(this.listeners[e]=new Set,this._get(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&this.stopPolling()}}Bm.type="LOCAL";const XE=Bm;new gr(3e4,6e4);/**
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
 */function Um(n,e){return e?en(e):(Q(n._popupRedirectResolver,n,"argument-error"),n._popupRedirectResolver)}/**
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
 */class Ac extends km{constructor(e){super("custom","custom"),this.params=e}_getIdTokenResponse(e){return Ds(e,this._buildIdpRequest())}_linkToIdToken(e,t){return Ds(e,this._buildIdpRequest(t))}_getReauthenticationResolver(e){return Ds(e,this._buildIdpRequest())}_buildIdpRequest(e){const t={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return e&&(t.idToken=e),t}}function JE(n){return xE(n.auth,new Ac(n),n.bypassAuthState)}function ZE(n){const{auth:e,user:t}=n;return Q(t,e,"internal-error"),DE(t,new Ac(n),n.bypassAuthState)}async function ew(n){const{auth:e,user:t}=n;return Q(t,e,"internal-error"),NE(t,new Ac(n),n.bypassAuthState)}/**
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
 */class jm{constructor(e,t,s,i,r=!1){this.auth=e,this.resolver=s,this.user=i,this.bypassAuthState=r,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(t)?t:[t]}execute(){return new Promise(async(e,t)=>{this.pendingPromise={resolve:e,reject:t};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(s){this.reject(s)}})}async onAuthEvent(e){const{urlResponse:t,sessionId:s,postBody:i,tenantId:r,error:o,type:l}=e;if(o){this.reject(o);return}const c={auth:this.auth,requestUri:t,sessionId:s,tenantId:r||void 0,postBody:i||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(l)(c))}catch(h){this.reject(h)}}onError(e){this.reject(e)}getIdpTask(e){switch(e){case"signInViaPopup":case"signInViaRedirect":return JE;case"linkViaPopup":case"linkViaRedirect":return ew;case"reauthViaPopup":case"reauthViaRedirect":return ZE;default:Bt(this.auth,"internal-error")}}resolve(e){rn(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(e),this.unregisterAndCleanUp()}reject(e){rn(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(e),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}}/**
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
 */const tw=new gr(2e3,1e4);async function nw(n,e,t){if(Xt(n.app))return Promise.reject(Pt(n,"operation-not-supported-in-this-environment"));const s=ma(n);Jv(n,e,Rc);const i=Um(s,t);return new Yn(s,"signInViaPopup",e,i).executeNotNull()}class Yn extends jm{constructor(e,t,s,i,r){super(e,t,i,r),this.provider=s,this.authWindow=null,this.pollId=null,Yn.currentPopupAction&&Yn.currentPopupAction.cancel(),Yn.currentPopupAction=this}async executeNotNull(){const e=await this.execute();return Q(e,this.auth,"internal-error"),e}async onExecution(){rn(this.filter.length===1,"Popup operations only handle one event");const e=Sc();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],e),this.authWindow.associatedEvent=e,this.resolver._originValidation(this.auth).catch(t=>{this.reject(t)}),this.resolver._isIframeWebStorageSupported(this.auth,t=>{t||this.reject(Pt(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){var e;return((e=this.authWindow)===null||e===void 0?void 0:e.associatedEvent)||null}cancel(){this.reject(Pt(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,Yn.currentPopupAction=null}pollUserCancellation(){const e=()=>{var t,s;if(!((s=(t=this.authWindow)===null||t===void 0?void 0:t.window)===null||s===void 0)&&s.closed){this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(Pt(this.auth,"popup-closed-by-user"))},8e3);return}this.pollId=window.setTimeout(e,tw.get())};e()}}Yn.currentPopupAction=null;/**
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
 */const sw="pendingRedirect",fo=new Map;class iw extends jm{constructor(e,t,s=!1){super(e,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],t,void 0,s),this.eventId=null}async execute(){let e=fo.get(this.auth._key());if(!e){try{const s=await rw(this.resolver,this.auth)?await super.execute():null;e=()=>Promise.resolve(s)}catch(t){e=()=>Promise.reject(t)}fo.set(this.auth._key(),e)}return this.bypassAuthState||fo.set(this.auth._key(),()=>Promise.resolve(null)),e()}async onAuthEvent(e){if(e.type==="signInViaRedirect")return super.onAuthEvent(e);if(e.type==="unknown"){this.resolve(null);return}if(e.eventId){const t=await this.auth._redirectUserForId(e.eventId);if(t)return this.user=t,super.onAuthEvent(e);this.resolve(null)}}async onExecution(){}cleanUp(){}}async function rw(n,e){const t=lw(e),s=aw(n);if(!await s._isAvailable())return!1;const i=await s._get(t)==="true";return await s._remove(t),i}function ow(n,e){fo.set(n._key(),e)}function aw(n){return en(n._redirectPersistence)}function lw(n){return uo(sw,n.config.apiKey,n.name)}async function cw(n,e,t=!1){if(Xt(n.app))return Promise.reject(es(n));const s=ma(n),i=Um(s,e),o=await new iw(s,i,t).execute();return o&&!t&&(delete o.user._redirectEventId,await s._persistUserIfCurrent(o.user),await s._setRedirectUser(null,e)),o}/**
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
 */const hw=10*60*1e3;class uw{constructor(e){this.auth=e,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(e){this.consumers.add(e),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,e)&&(this.sendToConsumer(this.queuedRedirectEvent,e),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(e){this.consumers.delete(e)}onEvent(e){if(this.hasEventBeenHandled(e))return!1;let t=!1;return this.consumers.forEach(s=>{this.isEventForConsumer(e,s)&&(t=!0,this.sendToConsumer(e,s),this.saveEventToCache(e))}),this.hasHandledPotentialRedirect||!dw(e)||(this.hasHandledPotentialRedirect=!0,t||(this.queuedRedirectEvent=e,t=!0)),t}sendToConsumer(e,t){var s;if(e.error&&!$m(e)){const i=((s=e.error.code)===null||s===void 0?void 0:s.split("auth/")[1])||"internal-error";t.onError(Pt(this.auth,i))}else t.onAuthEvent(e)}isEventForConsumer(e,t){const s=t.eventId===null||!!e.eventId&&e.eventId===t.eventId;return t.filter.includes(e.type)&&s}hasEventBeenHandled(e){return Date.now()-this.lastProcessedEventTime>=hw&&this.cachedEventUids.clear(),this.cachedEventUids.has(hd(e))}saveEventToCache(e){this.cachedEventUids.add(hd(e)),this.lastProcessedEventTime=Date.now()}}function hd(n){return[n.type,n.eventId,n.sessionId,n.tenantId].filter(e=>e).join("-")}function $m({type:n,error:e}){return n==="unknown"&&(e==null?void 0:e.code)==="auth/no-auth-event"}function dw(n){switch(n.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return $m(n);default:return!1}}/**
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
 */async function fw(n,e={}){return ei(n,"GET","/v1/projects",e)}/**
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
 */const mw=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,pw=/^https?/;async function gw(n){if(n.config.emulator)return;const{authorizedDomains:e}=await fw(n);for(const t of e)try{if(_w(t))return}catch{}Bt(n,"unauthorized-domain")}function _w(n){const e=Ol(),{protocol:t,hostname:s}=new URL(e);if(n.startsWith("chrome-extension://")){const o=new URL(n);return o.hostname===""&&s===""?t==="chrome-extension:"&&n.replace("chrome-extension://","")===e.replace("chrome-extension://",""):t==="chrome-extension:"&&o.hostname===s}if(!pw.test(t))return!1;if(mw.test(n))return s===n;const i=n.replace(/\./g,"\\.");return new RegExp("^(.+\\."+i+"|"+i+")$","i").test(s)}/**
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
 */const yw=new gr(3e4,6e4);function ud(){const n=Ot().___jsl;if(n!=null&&n.H){for(const e of Object.keys(n.H))if(n.H[e].r=n.H[e].r||[],n.H[e].L=n.H[e].L||[],n.H[e].r=[...n.H[e].L],n.CP)for(let t=0;t<n.CP.length;t++)n.CP[t]=null}}function vw(n){return new Promise((e,t)=>{var s,i,r;function o(){ud(),gapi.load("gapi.iframes",{callback:()=>{e(gapi.iframes.getContext())},ontimeout:()=>{ud(),t(Pt(n,"network-request-failed"))},timeout:yw.get()})}if(!((i=(s=Ot().gapi)===null||s===void 0?void 0:s.iframes)===null||i===void 0)&&i.Iframe)e(gapi.iframes.getContext());else if(!((r=Ot().gapi)===null||r===void 0)&&r.load)o();else{const l=bE("iframefcb");return Ot()[l]=()=>{gapi.load?o():t(Pt(n,"network-request-failed"))},TE(`${IE()}?onload=${l}`).catch(c=>t(c))}}).catch(e=>{throw mo=null,e})}let mo=null;function Ew(n){return mo=mo||vw(n),mo}/**
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
 */const ww=new gr(5e3,15e3),Tw="__/auth/iframe",Iw="emulator/auth/iframe",bw={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},Cw=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function Rw(n){const e=n.config;Q(e.authDomain,n,"auth-domain-config-required");const t=e.emulator?wc(e,Iw):`https://${n.config.authDomain}/${Tw}`,s={apiKey:e.apiKey,appName:n.name,v:ds},i=Cw.get(n.config.apiHost);i&&(s.eid=i);const r=n._getFrameworks();return r.length&&(s.fw=r.join(",")),`${t}?${Zs(s).slice(1)}`}async function Sw(n){const e=await Ew(n),t=Ot().gapi;return Q(t,n,"internal-error"),e.open({where:document.body,url:Rw(n),messageHandlersFilter:t.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:bw,dontclear:!0},s=>new Promise(async(i,r)=>{await s.restyle({setHideOnLeave:!1});const o=Pt(n,"network-request-failed"),l=Ot().setTimeout(()=>{r(o)},ww.get());function c(){Ot().clearTimeout(l),i(s)}s.ping(c).then(c,()=>{r(o)})}))}/**
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
 */const Aw={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"},kw=500,Pw=600,Nw="_blank",Dw="http://localhost";class dd{constructor(e){this.window=e,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch{}}}function xw(n,e,t,s=kw,i=Pw){const r=Math.max((window.screen.availHeight-i)/2,0).toString(),o=Math.max((window.screen.availWidth-s)/2,0).toString();let l="";const c=Object.assign(Object.assign({},Aw),{width:s.toString(),height:i.toString(),top:r,left:o}),h=st().toLowerCase();t&&(l=wm(h)?Nw:t),vm(h)&&(e=e||Dw,c.scrollbars="yes");const d=Object.entries(c).reduce((p,[E,b])=>`${p}${E}=${b},`,"");if(mE(h)&&l!=="_self")return Mw(e||"",l),new dd(null);const m=window.open(e||"",l,d);Q(m,n,"popup-blocked");try{m.focus()}catch{}return new dd(m)}function Mw(n,e){const t=document.createElement("a");t.href=n,t.target=e;const s=document.createEvent("MouseEvent");s.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),t.dispatchEvent(s)}/**
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
 */const Lw="__/auth/handler",Ow="emulator/auth/handler",Vw=encodeURIComponent("fac");async function fd(n,e,t,s,i,r){Q(n.config.authDomain,n,"auth-domain-config-required"),Q(n.config.apiKey,n,"invalid-api-key");const o={apiKey:n.config.apiKey,appName:n.name,authType:t,redirectUrl:s,v:ds,eventId:i};if(e instanceof Rc){e.setDefaultLanguage(n.languageCode),o.providerId=e.providerId||"",bo(e.getCustomParameters())||(o.customParameters=JSON.stringify(e.getCustomParameters()));for(const[d,m]of Object.entries({}))o[d]=m}if(e instanceof _r){const d=e.getScopes().filter(m=>m!=="");d.length>0&&(o.scopes=d.join(","))}n.tenantId&&(o.tid=n.tenantId);const l=o;for(const d of Object.keys(l))l[d]===void 0&&delete l[d];const c=await n._getAppCheckToken(),h=c?`#${Vw}=${encodeURIComponent(c)}`:"";return`${Fw(n)}?${Zs(l).slice(1)}${h}`}function Fw({config:n}){return n.emulator?wc(n,Ow):`https://${n.authDomain}/${Lw}`}/**
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
 */const gl="webStorageSupport";class Bw{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=Lm,this._completeRedirectFn=cw,this._overrideRedirectResult=ow}async _openPopup(e,t,s,i){var r;rn((r=this.eventManagers[e._key()])===null||r===void 0?void 0:r.manager,"_initialize() not called before _openPopup()");const o=await fd(e,t,s,Ol(),i);return xw(e,o,Sc())}async _openRedirect(e,t,s,i){await this._originValidation(e);const r=await fd(e,t,s,Ol(),i);return $E(r),new Promise(()=>{})}_initialize(e){const t=e._key();if(this.eventManagers[t]){const{manager:i,promise:r}=this.eventManagers[t];return i?Promise.resolve(i):(rn(r,"If manager is not set, promise should be"),r)}const s=this.initAndGetManager(e);return this.eventManagers[t]={promise:s},s.catch(()=>{delete this.eventManagers[t]}),s}async initAndGetManager(e){const t=await Sw(e),s=new uw(e);return t.register("authEvent",i=>(Q(i==null?void 0:i.authEvent,e,"invalid-auth-event"),{status:s.onEvent(i.authEvent)?"ACK":"ERROR"}),gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[e._key()]={manager:s},this.iframes[e._key()]=t,s}_isIframeWebStorageSupported(e,t){this.iframes[e._key()].send(gl,{type:gl},i=>{var r;const o=(r=i==null?void 0:i[0])===null||r===void 0?void 0:r[gl];o!==void 0&&t(!!o),Bt(e,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(e){const t=e._key();return this.originValidationPromises[t]||(this.originValidationPromises[t]=gw(e)),this.originValidationPromises[t]}get _shouldInitProactively(){return Rm()||Em()||bc()}}const Uw=Bw;var md="@firebase/auth",pd="1.7.9";/**
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
 */class jw{constructor(e){this.auth=e,this.internalListeners=new Map}getUid(){var e;return this.assertAuthConfigured(),((e=this.auth.currentUser)===null||e===void 0?void 0:e.uid)||null}async getToken(e){return this.assertAuthConfigured(),await this.auth._initializationPromise,this.auth.currentUser?{accessToken:await this.auth.currentUser.getIdToken(e)}:null}addAuthTokenListener(e){if(this.assertAuthConfigured(),this.internalListeners.has(e))return;const t=this.auth.onIdTokenChanged(s=>{e((s==null?void 0:s.stsTokenManager.accessToken)||null)});this.internalListeners.set(e,t),this.updateProactiveRefresh()}removeAuthTokenListener(e){this.assertAuthConfigured();const t=this.internalListeners.get(e);t&&(this.internalListeners.delete(e),t(),this.updateProactiveRefresh())}assertAuthConfigured(){Q(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}/**
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
 */function $w(n){switch(n){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}function Ww(n){ss(new Pn("auth",(e,{options:t})=>{const s=e.getProvider("app").getImmediate(),i=e.getProvider("heartbeat"),r=e.getProvider("app-check-internal"),{apiKey:o,authDomain:l}=s.options;Q(o&&!o.includes(":"),"invalid-api-key",{appName:s.name});const c={apiKey:o,authDomain:l,clientPlatform:n,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:Sm(n)},h=new EE(s,i,r,c);return RE(h,t),h},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,t,s)=>{e.getProvider("auth-internal").initialize()})),ss(new Pn("auth-internal",e=>{const t=ma(e.getProvider("auth").getImmediate());return(s=>new jw(s))(t)},"PRIVATE").setInstantiationMode("EXPLICIT")),Lt(md,pd,$w(n)),Lt(md,pd,"esm2017")}/**
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
 */const qw=5*60,zw=nm("authIdTokenMaxAge")||qw;let gd=null;const Hw=n=>async e=>{const t=e&&await e.getIdTokenResult(),s=t&&(new Date().getTime()-Date.parse(t.issuedAtTime))/1e3;if(s&&s>zw)return;const i=t==null?void 0:t.token;gd!==i&&(gd=i,await fetch(n,{method:i?"POST":"DELETE",headers:i?{Authorization:`Bearer ${i}`}:{}}))};function Gw(n=_c()){const e=fa(n,"auth");if(e.isInitialized())return e.getImmediate();const t=CE(n,{popupRedirectResolver:Uw,persistence:[XE,BE,Lm]}),s=nm("authTokenSyncURL");if(s&&typeof isSecureContext=="boolean"&&isSecureContext){const r=new URL(s,location.origin);if(location.origin===r.origin){const o=Hw(r.toString());LE(t,o,()=>o(t.currentUser)),ME(t,l=>o(l))}}const i=Zf("auth");return i&&SE(t,`http://${i}`),t}function Kw(){var n,e;return(e=(n=document.getElementsByTagName("head"))===null||n===void 0?void 0:n[0])!==null&&e!==void 0?e:document}wE({loadJS(n){return new Promise((e,t)=>{const s=document.createElement("script");s.setAttribute("src",n),s.onload=e,s.onerror=i=>{const r=Pt("internal-error");r.customData=i,t(r)},s.type="text/javascript",s.charset="UTF-8",Kw().appendChild(s)})},gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="});Ww("Browser");var _d=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var ts,Wm;(function(){var n;/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/function e(T,_){function v(){}v.prototype=_.prototype,T.D=_.prototype,T.prototype=new v,T.prototype.constructor=T,T.C=function(w,I,C){for(var y=Array(arguments.length-2),j=2;j<arguments.length;j++)y[j-2]=arguments[j];return _.prototype[I].apply(w,y)}}function t(){this.blockSize=-1}function s(){this.blockSize=-1,this.blockSize=64,this.g=Array(4),this.B=Array(this.blockSize),this.o=this.h=0,this.s()}e(s,t),s.prototype.s=function(){this.g[0]=1732584193,this.g[1]=4023233417,this.g[2]=2562383102,this.g[3]=271733878,this.o=this.h=0};function i(T,_,v){v||(v=0);var w=Array(16);if(typeof _=="string")for(var I=0;16>I;++I)w[I]=_.charCodeAt(v++)|_.charCodeAt(v++)<<8|_.charCodeAt(v++)<<16|_.charCodeAt(v++)<<24;else for(I=0;16>I;++I)w[I]=_[v++]|_[v++]<<8|_[v++]<<16|_[v++]<<24;_=T.g[0],v=T.g[1],I=T.g[2];var C=T.g[3],y=_+(C^v&(I^C))+w[0]+3614090360&4294967295;_=v+(y<<7&4294967295|y>>>25),y=C+(I^_&(v^I))+w[1]+3905402710&4294967295,C=_+(y<<12&4294967295|y>>>20),y=I+(v^C&(_^v))+w[2]+606105819&4294967295,I=C+(y<<17&4294967295|y>>>15),y=v+(_^I&(C^_))+w[3]+3250441966&4294967295,v=I+(y<<22&4294967295|y>>>10),y=_+(C^v&(I^C))+w[4]+4118548399&4294967295,_=v+(y<<7&4294967295|y>>>25),y=C+(I^_&(v^I))+w[5]+1200080426&4294967295,C=_+(y<<12&4294967295|y>>>20),y=I+(v^C&(_^v))+w[6]+2821735955&4294967295,I=C+(y<<17&4294967295|y>>>15),y=v+(_^I&(C^_))+w[7]+4249261313&4294967295,v=I+(y<<22&4294967295|y>>>10),y=_+(C^v&(I^C))+w[8]+1770035416&4294967295,_=v+(y<<7&4294967295|y>>>25),y=C+(I^_&(v^I))+w[9]+2336552879&4294967295,C=_+(y<<12&4294967295|y>>>20),y=I+(v^C&(_^v))+w[10]+4294925233&4294967295,I=C+(y<<17&4294967295|y>>>15),y=v+(_^I&(C^_))+w[11]+2304563134&4294967295,v=I+(y<<22&4294967295|y>>>10),y=_+(C^v&(I^C))+w[12]+1804603682&4294967295,_=v+(y<<7&4294967295|y>>>25),y=C+(I^_&(v^I))+w[13]+4254626195&4294967295,C=_+(y<<12&4294967295|y>>>20),y=I+(v^C&(_^v))+w[14]+2792965006&4294967295,I=C+(y<<17&4294967295|y>>>15),y=v+(_^I&(C^_))+w[15]+1236535329&4294967295,v=I+(y<<22&4294967295|y>>>10),y=_+(I^C&(v^I))+w[1]+4129170786&4294967295,_=v+(y<<5&4294967295|y>>>27),y=C+(v^I&(_^v))+w[6]+3225465664&4294967295,C=_+(y<<9&4294967295|y>>>23),y=I+(_^v&(C^_))+w[11]+643717713&4294967295,I=C+(y<<14&4294967295|y>>>18),y=v+(C^_&(I^C))+w[0]+3921069994&4294967295,v=I+(y<<20&4294967295|y>>>12),y=_+(I^C&(v^I))+w[5]+3593408605&4294967295,_=v+(y<<5&4294967295|y>>>27),y=C+(v^I&(_^v))+w[10]+38016083&4294967295,C=_+(y<<9&4294967295|y>>>23),y=I+(_^v&(C^_))+w[15]+3634488961&4294967295,I=C+(y<<14&4294967295|y>>>18),y=v+(C^_&(I^C))+w[4]+3889429448&4294967295,v=I+(y<<20&4294967295|y>>>12),y=_+(I^C&(v^I))+w[9]+568446438&4294967295,_=v+(y<<5&4294967295|y>>>27),y=C+(v^I&(_^v))+w[14]+3275163606&4294967295,C=_+(y<<9&4294967295|y>>>23),y=I+(_^v&(C^_))+w[3]+4107603335&4294967295,I=C+(y<<14&4294967295|y>>>18),y=v+(C^_&(I^C))+w[8]+1163531501&4294967295,v=I+(y<<20&4294967295|y>>>12),y=_+(I^C&(v^I))+w[13]+2850285829&4294967295,_=v+(y<<5&4294967295|y>>>27),y=C+(v^I&(_^v))+w[2]+4243563512&4294967295,C=_+(y<<9&4294967295|y>>>23),y=I+(_^v&(C^_))+w[7]+1735328473&4294967295,I=C+(y<<14&4294967295|y>>>18),y=v+(C^_&(I^C))+w[12]+2368359562&4294967295,v=I+(y<<20&4294967295|y>>>12),y=_+(v^I^C)+w[5]+4294588738&4294967295,_=v+(y<<4&4294967295|y>>>28),y=C+(_^v^I)+w[8]+2272392833&4294967295,C=_+(y<<11&4294967295|y>>>21),y=I+(C^_^v)+w[11]+1839030562&4294967295,I=C+(y<<16&4294967295|y>>>16),y=v+(I^C^_)+w[14]+4259657740&4294967295,v=I+(y<<23&4294967295|y>>>9),y=_+(v^I^C)+w[1]+2763975236&4294967295,_=v+(y<<4&4294967295|y>>>28),y=C+(_^v^I)+w[4]+1272893353&4294967295,C=_+(y<<11&4294967295|y>>>21),y=I+(C^_^v)+w[7]+4139469664&4294967295,I=C+(y<<16&4294967295|y>>>16),y=v+(I^C^_)+w[10]+3200236656&4294967295,v=I+(y<<23&4294967295|y>>>9),y=_+(v^I^C)+w[13]+681279174&4294967295,_=v+(y<<4&4294967295|y>>>28),y=C+(_^v^I)+w[0]+3936430074&4294967295,C=_+(y<<11&4294967295|y>>>21),y=I+(C^_^v)+w[3]+3572445317&4294967295,I=C+(y<<16&4294967295|y>>>16),y=v+(I^C^_)+w[6]+76029189&4294967295,v=I+(y<<23&4294967295|y>>>9),y=_+(v^I^C)+w[9]+3654602809&4294967295,_=v+(y<<4&4294967295|y>>>28),y=C+(_^v^I)+w[12]+3873151461&4294967295,C=_+(y<<11&4294967295|y>>>21),y=I+(C^_^v)+w[15]+530742520&4294967295,I=C+(y<<16&4294967295|y>>>16),y=v+(I^C^_)+w[2]+3299628645&4294967295,v=I+(y<<23&4294967295|y>>>9),y=_+(I^(v|~C))+w[0]+4096336452&4294967295,_=v+(y<<6&4294967295|y>>>26),y=C+(v^(_|~I))+w[7]+1126891415&4294967295,C=_+(y<<10&4294967295|y>>>22),y=I+(_^(C|~v))+w[14]+2878612391&4294967295,I=C+(y<<15&4294967295|y>>>17),y=v+(C^(I|~_))+w[5]+4237533241&4294967295,v=I+(y<<21&4294967295|y>>>11),y=_+(I^(v|~C))+w[12]+1700485571&4294967295,_=v+(y<<6&4294967295|y>>>26),y=C+(v^(_|~I))+w[3]+2399980690&4294967295,C=_+(y<<10&4294967295|y>>>22),y=I+(_^(C|~v))+w[10]+4293915773&4294967295,I=C+(y<<15&4294967295|y>>>17),y=v+(C^(I|~_))+w[1]+2240044497&4294967295,v=I+(y<<21&4294967295|y>>>11),y=_+(I^(v|~C))+w[8]+1873313359&4294967295,_=v+(y<<6&4294967295|y>>>26),y=C+(v^(_|~I))+w[15]+4264355552&4294967295,C=_+(y<<10&4294967295|y>>>22),y=I+(_^(C|~v))+w[6]+2734768916&4294967295,I=C+(y<<15&4294967295|y>>>17),y=v+(C^(I|~_))+w[13]+1309151649&4294967295,v=I+(y<<21&4294967295|y>>>11),y=_+(I^(v|~C))+w[4]+4149444226&4294967295,_=v+(y<<6&4294967295|y>>>26),y=C+(v^(_|~I))+w[11]+3174756917&4294967295,C=_+(y<<10&4294967295|y>>>22),y=I+(_^(C|~v))+w[2]+718787259&4294967295,I=C+(y<<15&4294967295|y>>>17),y=v+(C^(I|~_))+w[9]+3951481745&4294967295,T.g[0]=T.g[0]+_&4294967295,T.g[1]=T.g[1]+(I+(y<<21&4294967295|y>>>11))&4294967295,T.g[2]=T.g[2]+I&4294967295,T.g[3]=T.g[3]+C&4294967295}s.prototype.u=function(T,_){_===void 0&&(_=T.length);for(var v=_-this.blockSize,w=this.B,I=this.h,C=0;C<_;){if(I==0)for(;C<=v;)i(this,T,C),C+=this.blockSize;if(typeof T=="string"){for(;C<_;)if(w[I++]=T.charCodeAt(C++),I==this.blockSize){i(this,w),I=0;break}}else for(;C<_;)if(w[I++]=T[C++],I==this.blockSize){i(this,w),I=0;break}}this.h=I,this.o+=_},s.prototype.v=function(){var T=Array((56>this.h?this.blockSize:2*this.blockSize)-this.h);T[0]=128;for(var _=1;_<T.length-8;++_)T[_]=0;var v=8*this.o;for(_=T.length-8;_<T.length;++_)T[_]=v&255,v/=256;for(this.u(T),T=Array(16),_=v=0;4>_;++_)for(var w=0;32>w;w+=8)T[v++]=this.g[_]>>>w&255;return T};function r(T,_){var v=l;return Object.prototype.hasOwnProperty.call(v,T)?v[T]:v[T]=_(T)}function o(T,_){this.h=_;for(var v=[],w=!0,I=T.length-1;0<=I;I--){var C=T[I]|0;w&&C==_||(v[I]=C,w=!1)}this.g=v}var l={};function c(T){return-128<=T&&128>T?r(T,function(_){return new o([_|0],0>_?-1:0)}):new o([T|0],0>T?-1:0)}function h(T){if(isNaN(T)||!isFinite(T))return m;if(0>T)return P(h(-T));for(var _=[],v=1,w=0;T>=v;w++)_[w]=T/v|0,v*=4294967296;return new o(_,0)}function d(T,_){if(T.length==0)throw Error("number format error: empty string");if(_=_||10,2>_||36<_)throw Error("radix out of range: "+_);if(T.charAt(0)=="-")return P(d(T.substring(1),_));if(0<=T.indexOf("-"))throw Error('number format error: interior "-" character');for(var v=h(Math.pow(_,8)),w=m,I=0;I<T.length;I+=8){var C=Math.min(8,T.length-I),y=parseInt(T.substring(I,I+C),_);8>C?(C=h(Math.pow(_,C)),w=w.j(C).add(h(y))):(w=w.j(v),w=w.add(h(y)))}return w}var m=c(0),p=c(1),E=c(16777216);n=o.prototype,n.m=function(){if(S(this))return-P(this).m();for(var T=0,_=1,v=0;v<this.g.length;v++){var w=this.i(v);T+=(0<=w?w:4294967296+w)*_,_*=4294967296}return T},n.toString=function(T){if(T=T||10,2>T||36<T)throw Error("radix out of range: "+T);if(b(this))return"0";if(S(this))return"-"+P(this).toString(T);for(var _=h(Math.pow(T,6)),v=this,w="";;){var I=G(v,_).g;v=F(v,I.j(_));var C=((0<v.g.length?v.g[0]:v.h)>>>0).toString(T);if(v=I,b(v))return C+w;for(;6>C.length;)C="0"+C;w=C+w}},n.i=function(T){return 0>T?0:T<this.g.length?this.g[T]:this.h};function b(T){if(T.h!=0)return!1;for(var _=0;_<T.g.length;_++)if(T.g[_]!=0)return!1;return!0}function S(T){return T.h==-1}n.l=function(T){return T=F(this,T),S(T)?-1:b(T)?0:1};function P(T){for(var _=T.g.length,v=[],w=0;w<_;w++)v[w]=~T.g[w];return new o(v,~T.h).add(p)}n.abs=function(){return S(this)?P(this):this},n.add=function(T){for(var _=Math.max(this.g.length,T.g.length),v=[],w=0,I=0;I<=_;I++){var C=w+(this.i(I)&65535)+(T.i(I)&65535),y=(C>>>16)+(this.i(I)>>>16)+(T.i(I)>>>16);w=y>>>16,C&=65535,y&=65535,v[I]=y<<16|C}return new o(v,v[v.length-1]&-2147483648?-1:0)};function F(T,_){return T.add(P(_))}n.j=function(T){if(b(this)||b(T))return m;if(S(this))return S(T)?P(this).j(P(T)):P(P(this).j(T));if(S(T))return P(this.j(P(T)));if(0>this.l(E)&&0>T.l(E))return h(this.m()*T.m());for(var _=this.g.length+T.g.length,v=[],w=0;w<2*_;w++)v[w]=0;for(w=0;w<this.g.length;w++)for(var I=0;I<T.g.length;I++){var C=this.i(w)>>>16,y=this.i(w)&65535,j=T.i(I)>>>16,se=T.i(I)&65535;v[2*w+2*I]+=y*se,U(v,2*w+2*I),v[2*w+2*I+1]+=C*se,U(v,2*w+2*I+1),v[2*w+2*I+1]+=y*j,U(v,2*w+2*I+1),v[2*w+2*I+2]+=C*j,U(v,2*w+2*I+2)}for(w=0;w<_;w++)v[w]=v[2*w+1]<<16|v[2*w];for(w=_;w<2*_;w++)v[w]=0;return new o(v,0)};function U(T,_){for(;(T[_]&65535)!=T[_];)T[_+1]+=T[_]>>>16,T[_]&=65535,_++}function O(T,_){this.g=T,this.h=_}function G(T,_){if(b(_))throw Error("division by zero");if(b(T))return new O(m,m);if(S(T))return _=G(P(T),_),new O(P(_.g),P(_.h));if(S(_))return _=G(T,P(_)),new O(P(_.g),_.h);if(30<T.g.length){if(S(T)||S(_))throw Error("slowDivide_ only works with positive integers.");for(var v=p,w=_;0>=w.l(T);)v=ae(v),w=ae(w);var I=ee(v,1),C=ee(w,1);for(w=ee(w,2),v=ee(v,2);!b(w);){var y=C.add(w);0>=y.l(T)&&(I=I.add(v),C=y),w=ee(w,1),v=ee(v,1)}return _=F(T,I.j(_)),new O(I,_)}for(I=m;0<=T.l(_);){for(v=Math.max(1,Math.floor(T.m()/_.m())),w=Math.ceil(Math.log(v)/Math.LN2),w=48>=w?1:Math.pow(2,w-48),C=h(v),y=C.j(_);S(y)||0<y.l(T);)v-=w,C=h(v),y=C.j(_);b(C)&&(C=p),I=I.add(C),T=F(T,y)}return new O(I,T)}n.A=function(T){return G(this,T).h},n.and=function(T){for(var _=Math.max(this.g.length,T.g.length),v=[],w=0;w<_;w++)v[w]=this.i(w)&T.i(w);return new o(v,this.h&T.h)},n.or=function(T){for(var _=Math.max(this.g.length,T.g.length),v=[],w=0;w<_;w++)v[w]=this.i(w)|T.i(w);return new o(v,this.h|T.h)},n.xor=function(T){for(var _=Math.max(this.g.length,T.g.length),v=[],w=0;w<_;w++)v[w]=this.i(w)^T.i(w);return new o(v,this.h^T.h)};function ae(T){for(var _=T.g.length+1,v=[],w=0;w<_;w++)v[w]=T.i(w)<<1|T.i(w-1)>>>31;return new o(v,T.h)}function ee(T,_){var v=_>>5;_%=32;for(var w=T.g.length-v,I=[],C=0;C<w;C++)I[C]=0<_?T.i(C+v)>>>_|T.i(C+v+1)<<32-_:T.i(C+v);return new o(I,T.h)}s.prototype.digest=s.prototype.v,s.prototype.reset=s.prototype.s,s.prototype.update=s.prototype.u,Wm=s,o.prototype.add=o.prototype.add,o.prototype.multiply=o.prototype.j,o.prototype.modulo=o.prototype.A,o.prototype.compare=o.prototype.l,o.prototype.toNumber=o.prototype.m,o.prototype.toString=o.prototype.toString,o.prototype.getBits=o.prototype.i,o.fromNumber=h,o.fromString=d,ts=o}).apply(typeof _d<"u"?_d:typeof self<"u"?self:typeof window<"u"?window:{});var so=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var qm,Li,zm,po,Bl,Hm,Gm,Km;(function(){var n,e=typeof Object.defineProperties=="function"?Object.defineProperty:function(a,u,f){return a==Array.prototype||a==Object.prototype||(a[u]=f.value),a};function t(a){a=[typeof globalThis=="object"&&globalThis,a,typeof window=="object"&&window,typeof self=="object"&&self,typeof so=="object"&&so];for(var u=0;u<a.length;++u){var f=a[u];if(f&&f.Math==Math)return f}throw Error("Cannot find global object")}var s=t(this);function i(a,u){if(u)e:{var f=s;a=a.split(".");for(var g=0;g<a.length-1;g++){var R=a[g];if(!(R in f))break e;f=f[R]}a=a[a.length-1],g=f[a],u=u(g),u!=g&&u!=null&&e(f,a,{configurable:!0,writable:!0,value:u})}}function r(a,u){a instanceof String&&(a+="");var f=0,g=!1,R={next:function(){if(!g&&f<a.length){var A=f++;return{value:u(A,a[A]),done:!1}}return g=!0,{done:!0,value:void 0}}};return R[Symbol.iterator]=function(){return R},R}i("Array.prototype.values",function(a){return a||function(){return r(this,function(u,f){return f})}});/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/var o=o||{},l=this||self;function c(a){var u=typeof a;return u=u!="object"?u:a?Array.isArray(a)?"array":u:"null",u=="array"||u=="object"&&typeof a.length=="number"}function h(a){var u=typeof a;return u=="object"&&a!=null||u=="function"}function d(a,u,f){return a.call.apply(a.bind,arguments)}function m(a,u,f){if(!a)throw Error();if(2<arguments.length){var g=Array.prototype.slice.call(arguments,2);return function(){var R=Array.prototype.slice.call(arguments);return Array.prototype.unshift.apply(R,g),a.apply(u,R)}}return function(){return a.apply(u,arguments)}}function p(a,u,f){return p=Function.prototype.bind&&Function.prototype.bind.toString().indexOf("native code")!=-1?d:m,p.apply(null,arguments)}function E(a,u){var f=Array.prototype.slice.call(arguments,1);return function(){var g=f.slice();return g.push.apply(g,arguments),a.apply(this,g)}}function b(a,u){function f(){}f.prototype=u.prototype,a.aa=u.prototype,a.prototype=new f,a.prototype.constructor=a,a.Qb=function(g,R,A){for(var L=Array(arguments.length-2),ge=2;ge<arguments.length;ge++)L[ge-2]=arguments[ge];return u.prototype[R].apply(g,L)}}function S(a){const u=a.length;if(0<u){const f=Array(u);for(let g=0;g<u;g++)f[g]=a[g];return f}return[]}function P(a,u){for(let f=1;f<arguments.length;f++){const g=arguments[f];if(c(g)){const R=a.length||0,A=g.length||0;a.length=R+A;for(let L=0;L<A;L++)a[R+L]=g[L]}else a.push(g)}}class F{constructor(u,f){this.i=u,this.j=f,this.h=0,this.g=null}get(){let u;return 0<this.h?(this.h--,u=this.g,this.g=u.next,u.next=null):u=this.i(),u}}function U(a){return/^[\s\xa0]*$/.test(a)}function O(){var a=l.navigator;return a&&(a=a.userAgent)?a:""}function G(a){return G[" "](a),a}G[" "]=function(){};var ae=O().indexOf("Gecko")!=-1&&!(O().toLowerCase().indexOf("webkit")!=-1&&O().indexOf("Edge")==-1)&&!(O().indexOf("Trident")!=-1||O().indexOf("MSIE")!=-1)&&O().indexOf("Edge")==-1;function ee(a,u,f){for(const g in a)u.call(f,a[g],g,a)}function T(a,u){for(const f in a)u.call(void 0,a[f],f,a)}function _(a){const u={};for(const f in a)u[f]=a[f];return u}const v="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function w(a,u){let f,g;for(let R=1;R<arguments.length;R++){g=arguments[R];for(f in g)a[f]=g[f];for(let A=0;A<v.length;A++)f=v[A],Object.prototype.hasOwnProperty.call(g,f)&&(a[f]=g[f])}}function I(a){var u=1;a=a.split(":");const f=[];for(;0<u&&a.length;)f.push(a.shift()),u--;return a.length&&f.push(a.join(":")),f}function C(a){l.setTimeout(()=>{throw a},0)}function y(){var a=gt;let u=null;return a.g&&(u=a.g,a.g=a.g.next,a.g||(a.h=null),u.next=null),u}class j{constructor(){this.h=this.g=null}add(u,f){const g=se.get();g.set(u,f),this.h?this.h.next=g:this.g=g,this.h=g}}var se=new F(()=>new ue,a=>a.reset());class ue{constructor(){this.next=this.g=this.h=null}set(u,f){this.h=u,this.g=f,this.next=null}reset(){this.next=this.g=this.h=null}}let Ne,Ae=!1,gt=new j,hn=()=>{const a=l.Promise.resolve(void 0);Ne=()=>{a.then(ys)}};var ys=()=>{for(var a;a=y();){try{a.h.call(a.g)}catch(f){C(f)}var u=se;u.j(a),100>u.h&&(u.h++,a.next=u.g,u.g=a)}Ae=!1};function Tt(){this.s=this.s,this.C=this.C}Tt.prototype.s=!1,Tt.prototype.ma=function(){this.s||(this.s=!0,this.N())},Tt.prototype.N=function(){if(this.C)for(;this.C.length;)this.C.shift()()};function ke(a,u){this.type=a,this.g=this.target=u,this.defaultPrevented=!1}ke.prototype.h=function(){this.defaultPrevented=!0};var Un=function(){if(!l.addEventListener||!Object.defineProperty)return!1;var a=!1,u=Object.defineProperty({},"passive",{get:function(){a=!0}});try{const f=()=>{};l.addEventListener("test",f,u),l.removeEventListener("test",f,u)}catch{}return a}();function qt(a,u){if(ke.call(this,a?a.type:""),this.relatedTarget=this.g=this.target=null,this.button=this.screenY=this.screenX=this.clientY=this.clientX=0,this.key="",this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1,this.state=null,this.pointerId=0,this.pointerType="",this.i=null,a){var f=this.type=a.type,g=a.changedTouches&&a.changedTouches.length?a.changedTouches[0]:null;if(this.target=a.target||a.srcElement,this.g=u,u=a.relatedTarget){if(ae){e:{try{G(u.nodeName);var R=!0;break e}catch{}R=!1}R||(u=null)}}else f=="mouseover"?u=a.fromElement:f=="mouseout"&&(u=a.toElement);this.relatedTarget=u,g?(this.clientX=g.clientX!==void 0?g.clientX:g.pageX,this.clientY=g.clientY!==void 0?g.clientY:g.pageY,this.screenX=g.screenX||0,this.screenY=g.screenY||0):(this.clientX=a.clientX!==void 0?a.clientX:a.pageX,this.clientY=a.clientY!==void 0?a.clientY:a.pageY,this.screenX=a.screenX||0,this.screenY=a.screenY||0),this.button=a.button,this.key=a.key||"",this.ctrlKey=a.ctrlKey,this.altKey=a.altKey,this.shiftKey=a.shiftKey,this.metaKey=a.metaKey,this.pointerId=a.pointerId||0,this.pointerType=typeof a.pointerType=="string"?a.pointerType:Or[a.pointerType]||"",this.state=a.state,this.i=a,a.defaultPrevented&&qt.aa.h.call(this)}}b(qt,ke);var Or={2:"touch",3:"pen",4:"mouse"};qt.prototype.h=function(){qt.aa.h.call(this);var a=this.i;a.preventDefault?a.preventDefault():a.returnValue=!1};var ie="closure_listenable_"+(1e6*Math.random()|0),Le=0;function Vr(a,u,f,g,R){this.listener=a,this.proxy=null,this.src=u,this.type=f,this.capture=!!g,this.ha=R,this.key=++Le,this.da=this.fa=!1}function x(a){a.da=!0,a.listener=null,a.proxy=null,a.src=null,a.ha=null}function Ie(a){this.src=a,this.g={},this.h=0}Ie.prototype.add=function(a,u,f,g,R){var A=a.toString();a=this.g[A],a||(a=this.g[A]=[],this.h++);var L=qe(a,u,g,R);return-1<L?(u=a[L],f||(u.fa=!1)):(u=new Vr(u,this.src,A,!!g,R),u.fa=f,a.push(u)),u};function pe(a,u){var f=u.type;if(f in a.g){var g=a.g[f],R=Array.prototype.indexOf.call(g,u,void 0),A;(A=0<=R)&&Array.prototype.splice.call(g,R,1),A&&(x(u),a.g[f].length==0&&(delete a.g[f],a.h--))}}function qe(a,u,f,g){for(var R=0;R<a.length;++R){var A=a[R];if(!A.da&&A.listener==u&&A.capture==!!f&&A.ha==g)return R}return-1}var jn="closure_lm_"+(1e6*Math.random()|0),un={};function ci(a,u,f,g,R){if(Array.isArray(u)){for(var A=0;A<u.length;A++)ci(a,u[A],f,g,R);return null}return f=ui(f),a&&a[ie]?a.K(u,f,h(g)?!!g.capture:!1,R):Fr(a,u,f,!1,g,R)}function Fr(a,u,f,g,R,A){if(!u)throw Error("Invalid event type");var L=h(R)?!!R.capture:!!R,ge=It(a);if(ge||(a[jn]=ge=new Ie(a)),f=ge.add(u,f,g,L,A),f.proxy)return f;if(g=Br(),f.proxy=g,g.src=a,g.listener=f,a.addEventListener)Un||(R=L),R===void 0&&(R=!1),a.addEventListener(u.toString(),g,R);else if(a.attachEvent)a.attachEvent(xt(u.toString()),g);else if(a.addListener&&a.removeListener)a.addListener(g);else throw Error("addEventListener and attachEvent are unavailable.");return f}function Br(){function a(f){return u.call(a.src,a.listener,f)}const u=Wa;return a}function hi(a,u,f,g,R){if(Array.isArray(u))for(var A=0;A<u.length;A++)hi(a,u[A],f,g,R);else g=h(g)?!!g.capture:!!g,f=ui(f),a&&a[ie]?(a=a.i,u=String(u).toString(),u in a.g&&(A=a.g[u],f=qe(A,f,g,R),-1<f&&(x(A[f]),Array.prototype.splice.call(A,f,1),A.length==0&&(delete a.g[u],a.h--)))):a&&(a=It(a))&&(u=a.g[u.toString()],a=-1,u&&(a=qe(u,f,g,R)),(f=-1<a?u[a]:null)&&dn(f))}function dn(a){if(typeof a!="number"&&a&&!a.da){var u=a.src;if(u&&u[ie])pe(u.i,a);else{var f=a.type,g=a.proxy;u.removeEventListener?u.removeEventListener(f,g,a.capture):u.detachEvent?u.detachEvent(xt(f),g):u.addListener&&u.removeListener&&u.removeListener(g),(f=It(u))?(pe(f,a),f.h==0&&(f.src=null,u[jn]=null)):x(a)}}}function xt(a){return a in un?un[a]:un[a]="on"+a}function Wa(a,u){if(a.da)a=!0;else{u=new qt(u,this);var f=a.listener,g=a.ha||a.src;a.fa&&dn(a),a=f.call(g,u)}return a}function It(a){return a=a[jn],a instanceof Ie?a:null}var zt="__closure_events_fn_"+(1e9*Math.random()>>>0);function ui(a){return typeof a=="function"?a:(a[zt]||(a[zt]=function(u){return a.handleEvent(u)}),a[zt])}function Qe(){Tt.call(this),this.i=new Ie(this),this.M=this,this.F=null}b(Qe,Tt),Qe.prototype[ie]=!0,Qe.prototype.removeEventListener=function(a,u,f,g){hi(this,a,u,f,g)};function it(a,u){var f,g=a.F;if(g)for(f=[];g;g=g.F)f.push(g);if(a=a.M,g=u.type||u,typeof u=="string")u=new ke(u,a);else if(u instanceof ke)u.target=u.target||a;else{var R=u;u=new ke(g,a),w(u,R)}if(R=!0,f)for(var A=f.length-1;0<=A;A--){var L=u.g=f[A];R=Ur(L,g,!0,u)&&R}if(L=u.g=a,R=Ur(L,g,!0,u)&&R,R=Ur(L,g,!1,u)&&R,f)for(A=0;A<f.length;A++)L=u.g=f[A],R=Ur(L,g,!1,u)&&R}Qe.prototype.N=function(){if(Qe.aa.N.call(this),this.i){var a=this.i,u;for(u in a.g){for(var f=a.g[u],g=0;g<f.length;g++)x(f[g]);delete a.g[u],a.h--}}this.F=null},Qe.prototype.K=function(a,u,f,g){return this.i.add(String(a),u,!1,f,g)},Qe.prototype.L=function(a,u,f,g){return this.i.add(String(a),u,!0,f,g)};function Ur(a,u,f,g){if(u=a.i.g[String(u)],!u)return!0;u=u.concat();for(var R=!0,A=0;A<u.length;++A){var L=u[A];if(L&&!L.da&&L.capture==f){var ge=L.listener,ze=L.ha||L.src;L.fa&&pe(a.i,L),R=ge.call(ze,g)!==!1&&R}}return R&&!g.defaultPrevented}function Qh(a,u,f){if(typeof a=="function")f&&(a=p(a,f));else if(a&&typeof a.handleEvent=="function")a=p(a.handleEvent,a);else throw Error("Invalid listener argument");return 2147483647<Number(u)?-1:l.setTimeout(a,u||0)}function Yh(a){a.g=Qh(()=>{a.g=null,a.i&&(a.i=!1,Yh(a))},a.l);const u=a.h;a.h=null,a.m.apply(null,u)}class $_ extends Tt{constructor(u,f){super(),this.m=u,this.l=f,this.h=null,this.i=!1,this.g=null}j(u){this.h=arguments,this.g?this.i=!0:Yh(this)}N(){super.N(),this.g&&(l.clearTimeout(this.g),this.g=null,this.i=!1,this.h=null)}}function di(a){Tt.call(this),this.h=a,this.g={}}b(di,Tt);var Xh=[];function Jh(a){ee(a.g,function(u,f){this.g.hasOwnProperty(f)&&dn(u)},a),a.g={}}di.prototype.N=function(){di.aa.N.call(this),Jh(this)},di.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented")};var qa=l.JSON.stringify,W_=l.JSON.parse,q_=class{stringify(a){return l.JSON.stringify(a,void 0)}parse(a){return l.JSON.parse(a,void 0)}};function za(){}za.prototype.h=null;function Zh(a){return a.h||(a.h=a.i())}function eu(){}var fi={OPEN:"a",kb:"b",Ja:"c",wb:"d"};function Ha(){ke.call(this,"d")}b(Ha,ke);function Ga(){ke.call(this,"c")}b(Ga,ke);var $n={},tu=null;function jr(){return tu=tu||new Qe}$n.La="serverreachability";function nu(a){ke.call(this,$n.La,a)}b(nu,ke);function mi(a){const u=jr();it(u,new nu(u))}$n.STAT_EVENT="statevent";function su(a,u){ke.call(this,$n.STAT_EVENT,a),this.stat=u}b(su,ke);function rt(a){const u=jr();it(u,new su(u,a))}$n.Ma="timingevent";function iu(a,u){ke.call(this,$n.Ma,a),this.size=u}b(iu,ke);function pi(a,u){if(typeof a!="function")throw Error("Fn must not be null and must be a function");return l.setTimeout(function(){a()},u)}function gi(){this.g=!0}gi.prototype.xa=function(){this.g=!1};function z_(a,u,f,g,R,A){a.info(function(){if(a.g)if(A)for(var L="",ge=A.split("&"),ze=0;ze<ge.length;ze++){var le=ge[ze].split("=");if(1<le.length){var Ye=le[0];le=le[1];var Xe=Ye.split("_");L=2<=Xe.length&&Xe[1]=="type"?L+(Ye+"="+le+"&"):L+(Ye+"=redacted&")}}else L=null;else L=A;return"XMLHTTP REQ ("+g+") [attempt "+R+"]: "+u+`
`+f+`
`+L})}function H_(a,u,f,g,R,A,L){a.info(function(){return"XMLHTTP RESP ("+g+") [ attempt "+R+"]: "+u+`
`+f+`
`+A+" "+L})}function vs(a,u,f,g){a.info(function(){return"XMLHTTP TEXT ("+u+"): "+K_(a,f)+(g?" "+g:"")})}function G_(a,u){a.info(function(){return"TIMEOUT: "+u})}gi.prototype.info=function(){};function K_(a,u){if(!a.g)return u;if(!u)return null;try{var f=JSON.parse(u);if(f){for(a=0;a<f.length;a++)if(Array.isArray(f[a])){var g=f[a];if(!(2>g.length)){var R=g[1];if(Array.isArray(R)&&!(1>R.length)){var A=R[0];if(A!="noop"&&A!="stop"&&A!="close")for(var L=1;L<R.length;L++)R[L]=""}}}}return qa(f)}catch{return u}}var $r={NO_ERROR:0,gb:1,tb:2,sb:3,nb:4,rb:5,ub:6,Ia:7,TIMEOUT:8,xb:9},ru={lb:"complete",Hb:"success",Ja:"error",Ia:"abort",zb:"ready",Ab:"readystatechange",TIMEOUT:"timeout",vb:"incrementaldata",yb:"progress",ob:"downloadprogress",Pb:"uploadprogress"},Ka;function Wr(){}b(Wr,za),Wr.prototype.g=function(){return new XMLHttpRequest},Wr.prototype.i=function(){return{}},Ka=new Wr;function fn(a,u,f,g){this.j=a,this.i=u,this.l=f,this.R=g||1,this.U=new di(this),this.I=45e3,this.H=null,this.o=!1,this.m=this.A=this.v=this.L=this.F=this.S=this.B=null,this.D=[],this.g=null,this.C=0,this.s=this.u=null,this.X=-1,this.J=!1,this.O=0,this.M=null,this.W=this.K=this.T=this.P=!1,this.h=new ou}function ou(){this.i=null,this.g="",this.h=!1}var au={},Qa={};function Ya(a,u,f){a.L=1,a.v=Gr(Ht(u)),a.m=f,a.P=!0,lu(a,null)}function lu(a,u){a.F=Date.now(),qr(a),a.A=Ht(a.v);var f=a.A,g=a.R;Array.isArray(g)||(g=[String(g)]),Tu(f.i,"t",g),a.C=0,f=a.j.J,a.h=new ou,a.g=Uu(a.j,f?u:null,!a.m),0<a.O&&(a.M=new $_(p(a.Y,a,a.g),a.O)),u=a.U,f=a.g,g=a.ca;var R="readystatechange";Array.isArray(R)||(R&&(Xh[0]=R.toString()),R=Xh);for(var A=0;A<R.length;A++){var L=ci(f,R[A],g||u.handleEvent,!1,u.h||u);if(!L)break;u.g[L.key]=L}u=a.H?_(a.H):{},a.m?(a.u||(a.u="POST"),u["Content-Type"]="application/x-www-form-urlencoded",a.g.ea(a.A,a.u,a.m,u)):(a.u="GET",a.g.ea(a.A,a.u,null,u)),mi(),z_(a.i,a.u,a.A,a.l,a.R,a.m)}fn.prototype.ca=function(a){a=a.target;const u=this.M;u&&Gt(a)==3?u.j():this.Y(a)},fn.prototype.Y=function(a){try{if(a==this.g)e:{const Xe=Gt(this.g);var u=this.g.Ba();const Ts=this.g.Z();if(!(3>Xe)&&(Xe!=3||this.g&&(this.h.h||this.g.oa()||ku(this.g)))){this.J||Xe!=4||u==7||(u==8||0>=Ts?mi(3):mi(2)),Xa(this);var f=this.g.Z();this.X=f;t:if(cu(this)){var g=ku(this.g);a="";var R=g.length,A=Gt(this.g)==4;if(!this.h.i){if(typeof TextDecoder>"u"){Wn(this),_i(this);var L="";break t}this.h.i=new l.TextDecoder}for(u=0;u<R;u++)this.h.h=!0,a+=this.h.i.decode(g[u],{stream:!(A&&u==R-1)});g.length=0,this.h.g+=a,this.C=0,L=this.h.g}else L=this.g.oa();if(this.o=f==200,H_(this.i,this.u,this.A,this.l,this.R,Xe,f),this.o){if(this.T&&!this.K){t:{if(this.g){var ge,ze=this.g;if((ge=ze.g?ze.g.getResponseHeader("X-HTTP-Initial-Response"):null)&&!U(ge)){var le=ge;break t}}le=null}if(f=le)vs(this.i,this.l,f,"Initial handshake response via X-HTTP-Initial-Response"),this.K=!0,Ja(this,f);else{this.o=!1,this.s=3,rt(12),Wn(this),_i(this);break e}}if(this.P){f=!0;let Rt;for(;!this.J&&this.C<L.length;)if(Rt=Q_(this,L),Rt==Qa){Xe==4&&(this.s=4,rt(14),f=!1),vs(this.i,this.l,null,"[Incomplete Response]");break}else if(Rt==au){this.s=4,rt(15),vs(this.i,this.l,L,"[Invalid Chunk]"),f=!1;break}else vs(this.i,this.l,Rt,null),Ja(this,Rt);if(cu(this)&&this.C!=0&&(this.h.g=this.h.g.slice(this.C),this.C=0),Xe!=4||L.length!=0||this.h.h||(this.s=1,rt(16),f=!1),this.o=this.o&&f,!f)vs(this.i,this.l,L,"[Invalid Chunked Response]"),Wn(this),_i(this);else if(0<L.length&&!this.W){this.W=!0;var Ye=this.j;Ye.g==this&&Ye.ba&&!Ye.M&&(Ye.j.info("Great, no buffering proxy detected. Bytes received: "+L.length),il(Ye),Ye.M=!0,rt(11))}}else vs(this.i,this.l,L,null),Ja(this,L);Xe==4&&Wn(this),this.o&&!this.J&&(Xe==4?Ou(this.j,this):(this.o=!1,qr(this)))}else dy(this.g),f==400&&0<L.indexOf("Unknown SID")?(this.s=3,rt(12)):(this.s=0,rt(13)),Wn(this),_i(this)}}}catch{}finally{}};function cu(a){return a.g?a.u=="GET"&&a.L!=2&&a.j.Ca:!1}function Q_(a,u){var f=a.C,g=u.indexOf(`
`,f);return g==-1?Qa:(f=Number(u.substring(f,g)),isNaN(f)?au:(g+=1,g+f>u.length?Qa:(u=u.slice(g,g+f),a.C=g+f,u)))}fn.prototype.cancel=function(){this.J=!0,Wn(this)};function qr(a){a.S=Date.now()+a.I,hu(a,a.I)}function hu(a,u){if(a.B!=null)throw Error("WatchDog timer not null");a.B=pi(p(a.ba,a),u)}function Xa(a){a.B&&(l.clearTimeout(a.B),a.B=null)}fn.prototype.ba=function(){this.B=null;const a=Date.now();0<=a-this.S?(G_(this.i,this.A),this.L!=2&&(mi(),rt(17)),Wn(this),this.s=2,_i(this)):hu(this,this.S-a)};function _i(a){a.j.G==0||a.J||Ou(a.j,a)}function Wn(a){Xa(a);var u=a.M;u&&typeof u.ma=="function"&&u.ma(),a.M=null,Jh(a.U),a.g&&(u=a.g,a.g=null,u.abort(),u.ma())}function Ja(a,u){try{var f=a.j;if(f.G!=0&&(f.g==a||Za(f.h,a))){if(!a.K&&Za(f.h,a)&&f.G==3){try{var g=f.Da.g.parse(u)}catch{g=null}if(Array.isArray(g)&&g.length==3){var R=g;if(R[0]==0){e:if(!f.u){if(f.g)if(f.g.F+3e3<a.F)Zr(f),Xr(f);else break e;sl(f),rt(18)}}else f.za=R[1],0<f.za-f.T&&37500>R[2]&&f.F&&f.v==0&&!f.C&&(f.C=pi(p(f.Za,f),6e3));if(1>=fu(f.h)&&f.ca){try{f.ca()}catch{}f.ca=void 0}}else zn(f,11)}else if((a.K||f.g==a)&&Zr(f),!U(u))for(R=f.Da.g.parse(u),u=0;u<R.length;u++){let le=R[u];if(f.T=le[0],le=le[1],f.G==2)if(le[0]=="c"){f.K=le[1],f.ia=le[2];const Ye=le[3];Ye!=null&&(f.la=Ye,f.j.info("VER="+f.la));const Xe=le[4];Xe!=null&&(f.Aa=Xe,f.j.info("SVER="+f.Aa));const Ts=le[5];Ts!=null&&typeof Ts=="number"&&0<Ts&&(g=1.5*Ts,f.L=g,f.j.info("backChannelRequestTimeoutMs_="+g)),g=f;const Rt=a.g;if(Rt){const to=Rt.g?Rt.g.getResponseHeader("X-Client-Wire-Protocol"):null;if(to){var A=g.h;A.g||to.indexOf("spdy")==-1&&to.indexOf("quic")==-1&&to.indexOf("h2")==-1||(A.j=A.l,A.g=new Set,A.h&&(el(A,A.h),A.h=null))}if(g.D){const rl=Rt.g?Rt.g.getResponseHeader("X-HTTP-Session-Id"):null;rl&&(g.ya=rl,Ee(g.I,g.D,rl))}}f.G=3,f.l&&f.l.ua(),f.ba&&(f.R=Date.now()-a.F,f.j.info("Handshake RTT: "+f.R+"ms")),g=f;var L=a;if(g.qa=Bu(g,g.J?g.ia:null,g.W),L.K){mu(g.h,L);var ge=L,ze=g.L;ze&&(ge.I=ze),ge.B&&(Xa(ge),qr(ge)),g.g=L}else Mu(g);0<f.i.length&&Jr(f)}else le[0]!="stop"&&le[0]!="close"||zn(f,7);else f.G==3&&(le[0]=="stop"||le[0]=="close"?le[0]=="stop"?zn(f,7):nl(f):le[0]!="noop"&&f.l&&f.l.ta(le),f.v=0)}}mi(4)}catch{}}var Y_=class{constructor(a,u){this.g=a,this.map=u}};function uu(a){this.l=a||10,l.PerformanceNavigationTiming?(a=l.performance.getEntriesByType("navigation"),a=0<a.length&&(a[0].nextHopProtocol=="hq"||a[0].nextHopProtocol=="h2")):a=!!(l.chrome&&l.chrome.loadTimes&&l.chrome.loadTimes()&&l.chrome.loadTimes().wasFetchedViaSpdy),this.j=a?this.l:1,this.g=null,1<this.j&&(this.g=new Set),this.h=null,this.i=[]}function du(a){return a.h?!0:a.g?a.g.size>=a.j:!1}function fu(a){return a.h?1:a.g?a.g.size:0}function Za(a,u){return a.h?a.h==u:a.g?a.g.has(u):!1}function el(a,u){a.g?a.g.add(u):a.h=u}function mu(a,u){a.h&&a.h==u?a.h=null:a.g&&a.g.has(u)&&a.g.delete(u)}uu.prototype.cancel=function(){if(this.i=pu(this),this.h)this.h.cancel(),this.h=null;else if(this.g&&this.g.size!==0){for(const a of this.g.values())a.cancel();this.g.clear()}};function pu(a){if(a.h!=null)return a.i.concat(a.h.D);if(a.g!=null&&a.g.size!==0){let u=a.i;for(const f of a.g.values())u=u.concat(f.D);return u}return S(a.i)}function X_(a){if(a.V&&typeof a.V=="function")return a.V();if(typeof Map<"u"&&a instanceof Map||typeof Set<"u"&&a instanceof Set)return Array.from(a.values());if(typeof a=="string")return a.split("");if(c(a)){for(var u=[],f=a.length,g=0;g<f;g++)u.push(a[g]);return u}u=[],f=0;for(g in a)u[f++]=a[g];return u}function J_(a){if(a.na&&typeof a.na=="function")return a.na();if(!a.V||typeof a.V!="function"){if(typeof Map<"u"&&a instanceof Map)return Array.from(a.keys());if(!(typeof Set<"u"&&a instanceof Set)){if(c(a)||typeof a=="string"){var u=[];a=a.length;for(var f=0;f<a;f++)u.push(f);return u}u=[],f=0;for(const g in a)u[f++]=g;return u}}}function gu(a,u){if(a.forEach&&typeof a.forEach=="function")a.forEach(u,void 0);else if(c(a)||typeof a=="string")Array.prototype.forEach.call(a,u,void 0);else for(var f=J_(a),g=X_(a),R=g.length,A=0;A<R;A++)u.call(void 0,g[A],f&&f[A],a)}var _u=RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");function Z_(a,u){if(a){a=a.split("&");for(var f=0;f<a.length;f++){var g=a[f].indexOf("="),R=null;if(0<=g){var A=a[f].substring(0,g);R=a[f].substring(g+1)}else A=a[f];u(A,R?decodeURIComponent(R.replace(/\+/g," ")):"")}}}function qn(a){if(this.g=this.o=this.j="",this.s=null,this.m=this.l="",this.h=!1,a instanceof qn){this.h=a.h,zr(this,a.j),this.o=a.o,this.g=a.g,Hr(this,a.s),this.l=a.l;var u=a.i,f=new Ei;f.i=u.i,u.g&&(f.g=new Map(u.g),f.h=u.h),yu(this,f),this.m=a.m}else a&&(u=String(a).match(_u))?(this.h=!1,zr(this,u[1]||"",!0),this.o=yi(u[2]||""),this.g=yi(u[3]||"",!0),Hr(this,u[4]),this.l=yi(u[5]||"",!0),yu(this,u[6]||"",!0),this.m=yi(u[7]||"")):(this.h=!1,this.i=new Ei(null,this.h))}qn.prototype.toString=function(){var a=[],u=this.j;u&&a.push(vi(u,vu,!0),":");var f=this.g;return(f||u=="file")&&(a.push("//"),(u=this.o)&&a.push(vi(u,vu,!0),"@"),a.push(encodeURIComponent(String(f)).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),f=this.s,f!=null&&a.push(":",String(f))),(f=this.l)&&(this.g&&f.charAt(0)!="/"&&a.push("/"),a.push(vi(f,f.charAt(0)=="/"?ny:ty,!0))),(f=this.i.toString())&&a.push("?",f),(f=this.m)&&a.push("#",vi(f,iy)),a.join("")};function Ht(a){return new qn(a)}function zr(a,u,f){a.j=f?yi(u,!0):u,a.j&&(a.j=a.j.replace(/:$/,""))}function Hr(a,u){if(u){if(u=Number(u),isNaN(u)||0>u)throw Error("Bad port number "+u);a.s=u}else a.s=null}function yu(a,u,f){u instanceof Ei?(a.i=u,ry(a.i,a.h)):(f||(u=vi(u,sy)),a.i=new Ei(u,a.h))}function Ee(a,u,f){a.i.set(u,f)}function Gr(a){return Ee(a,"zx",Math.floor(2147483648*Math.random()).toString(36)+Math.abs(Math.floor(2147483648*Math.random())^Date.now()).toString(36)),a}function yi(a,u){return a?u?decodeURI(a.replace(/%25/g,"%2525")):decodeURIComponent(a):""}function vi(a,u,f){return typeof a=="string"?(a=encodeURI(a).replace(u,ey),f&&(a=a.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),a):null}function ey(a){return a=a.charCodeAt(0),"%"+(a>>4&15).toString(16)+(a&15).toString(16)}var vu=/[#\/\?@]/g,ty=/[#\?:]/g,ny=/[#\?]/g,sy=/[#\?@]/g,iy=/#/g;function Ei(a,u){this.h=this.g=null,this.i=a||null,this.j=!!u}function mn(a){a.g||(a.g=new Map,a.h=0,a.i&&Z_(a.i,function(u,f){a.add(decodeURIComponent(u.replace(/\+/g," ")),f)}))}n=Ei.prototype,n.add=function(a,u){mn(this),this.i=null,a=Es(this,a);var f=this.g.get(a);return f||this.g.set(a,f=[]),f.push(u),this.h+=1,this};function Eu(a,u){mn(a),u=Es(a,u),a.g.has(u)&&(a.i=null,a.h-=a.g.get(u).length,a.g.delete(u))}function wu(a,u){return mn(a),u=Es(a,u),a.g.has(u)}n.forEach=function(a,u){mn(this),this.g.forEach(function(f,g){f.forEach(function(R){a.call(u,R,g,this)},this)},this)},n.na=function(){mn(this);const a=Array.from(this.g.values()),u=Array.from(this.g.keys()),f=[];for(let g=0;g<u.length;g++){const R=a[g];for(let A=0;A<R.length;A++)f.push(u[g])}return f},n.V=function(a){mn(this);let u=[];if(typeof a=="string")wu(this,a)&&(u=u.concat(this.g.get(Es(this,a))));else{a=Array.from(this.g.values());for(let f=0;f<a.length;f++)u=u.concat(a[f])}return u},n.set=function(a,u){return mn(this),this.i=null,a=Es(this,a),wu(this,a)&&(this.h-=this.g.get(a).length),this.g.set(a,[u]),this.h+=1,this},n.get=function(a,u){return a?(a=this.V(a),0<a.length?String(a[0]):u):u};function Tu(a,u,f){Eu(a,u),0<f.length&&(a.i=null,a.g.set(Es(a,u),S(f)),a.h+=f.length)}n.toString=function(){if(this.i)return this.i;if(!this.g)return"";const a=[],u=Array.from(this.g.keys());for(var f=0;f<u.length;f++){var g=u[f];const A=encodeURIComponent(String(g)),L=this.V(g);for(g=0;g<L.length;g++){var R=A;L[g]!==""&&(R+="="+encodeURIComponent(String(L[g]))),a.push(R)}}return this.i=a.join("&")};function Es(a,u){return u=String(u),a.j&&(u=u.toLowerCase()),u}function ry(a,u){u&&!a.j&&(mn(a),a.i=null,a.g.forEach(function(f,g){var R=g.toLowerCase();g!=R&&(Eu(this,g),Tu(this,R,f))},a)),a.j=u}function oy(a,u){const f=new gi;if(l.Image){const g=new Image;g.onload=E(pn,f,"TestLoadImage: loaded",!0,u,g),g.onerror=E(pn,f,"TestLoadImage: error",!1,u,g),g.onabort=E(pn,f,"TestLoadImage: abort",!1,u,g),g.ontimeout=E(pn,f,"TestLoadImage: timeout",!1,u,g),l.setTimeout(function(){g.ontimeout&&g.ontimeout()},1e4),g.src=a}else u(!1)}function ay(a,u){const f=new gi,g=new AbortController,R=setTimeout(()=>{g.abort(),pn(f,"TestPingServer: timeout",!1,u)},1e4);fetch(a,{signal:g.signal}).then(A=>{clearTimeout(R),A.ok?pn(f,"TestPingServer: ok",!0,u):pn(f,"TestPingServer: server error",!1,u)}).catch(()=>{clearTimeout(R),pn(f,"TestPingServer: error",!1,u)})}function pn(a,u,f,g,R){try{R&&(R.onload=null,R.onerror=null,R.onabort=null,R.ontimeout=null),g(f)}catch{}}function ly(){this.g=new q_}function cy(a,u,f){const g=f||"";try{gu(a,function(R,A){let L=R;h(R)&&(L=qa(R)),u.push(g+A+"="+encodeURIComponent(L))})}catch(R){throw u.push(g+"type="+encodeURIComponent("_badmap")),R}}function Kr(a){this.l=a.Ub||null,this.j=a.eb||!1}b(Kr,za),Kr.prototype.g=function(){return new Qr(this.l,this.j)},Kr.prototype.i=function(a){return function(){return a}}({});function Qr(a,u){Qe.call(this),this.D=a,this.o=u,this.m=void 0,this.status=this.readyState=0,this.responseType=this.responseText=this.response=this.statusText="",this.onreadystatechange=null,this.u=new Headers,this.h=null,this.B="GET",this.A="",this.g=!1,this.v=this.j=this.l=null}b(Qr,Qe),n=Qr.prototype,n.open=function(a,u){if(this.readyState!=0)throw this.abort(),Error("Error reopening a connection");this.B=a,this.A=u,this.readyState=1,Ti(this)},n.send=function(a){if(this.readyState!=1)throw this.abort(),Error("need to call open() first. ");this.g=!0;const u={headers:this.u,method:this.B,credentials:this.m,cache:void 0};a&&(u.body=a),(this.D||l).fetch(new Request(this.A,u)).then(this.Sa.bind(this),this.ga.bind(this))},n.abort=function(){this.response=this.responseText="",this.u=new Headers,this.status=0,this.j&&this.j.cancel("Request was aborted.").catch(()=>{}),1<=this.readyState&&this.g&&this.readyState!=4&&(this.g=!1,wi(this)),this.readyState=0},n.Sa=function(a){if(this.g&&(this.l=a,this.h||(this.status=this.l.status,this.statusText=this.l.statusText,this.h=a.headers,this.readyState=2,Ti(this)),this.g&&(this.readyState=3,Ti(this),this.g)))if(this.responseType==="arraybuffer")a.arrayBuffer().then(this.Qa.bind(this),this.ga.bind(this));else if(typeof l.ReadableStream<"u"&&"body"in a){if(this.j=a.body.getReader(),this.o){if(this.responseType)throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');this.response=[]}else this.response=this.responseText="",this.v=new TextDecoder;Iu(this)}else a.text().then(this.Ra.bind(this),this.ga.bind(this))};function Iu(a){a.j.read().then(a.Pa.bind(a)).catch(a.ga.bind(a))}n.Pa=function(a){if(this.g){if(this.o&&a.value)this.response.push(a.value);else if(!this.o){var u=a.value?a.value:new Uint8Array(0);(u=this.v.decode(u,{stream:!a.done}))&&(this.response=this.responseText+=u)}a.done?wi(this):Ti(this),this.readyState==3&&Iu(this)}},n.Ra=function(a){this.g&&(this.response=this.responseText=a,wi(this))},n.Qa=function(a){this.g&&(this.response=a,wi(this))},n.ga=function(){this.g&&wi(this)};function wi(a){a.readyState=4,a.l=null,a.j=null,a.v=null,Ti(a)}n.setRequestHeader=function(a,u){this.u.append(a,u)},n.getResponseHeader=function(a){return this.h&&this.h.get(a.toLowerCase())||""},n.getAllResponseHeaders=function(){if(!this.h)return"";const a=[],u=this.h.entries();for(var f=u.next();!f.done;)f=f.value,a.push(f[0]+": "+f[1]),f=u.next();return a.join(`\r
`)};function Ti(a){a.onreadystatechange&&a.onreadystatechange.call(a)}Object.defineProperty(Qr.prototype,"withCredentials",{get:function(){return this.m==="include"},set:function(a){this.m=a?"include":"same-origin"}});function bu(a){let u="";return ee(a,function(f,g){u+=g,u+=":",u+=f,u+=`\r
`}),u}function tl(a,u,f){e:{for(g in f){var g=!1;break e}g=!0}g||(f=bu(f),typeof a=="string"?f!=null&&encodeURIComponent(String(f)):Ee(a,u,f))}function Ce(a){Qe.call(this),this.headers=new Map,this.o=a||null,this.h=!1,this.v=this.g=null,this.D="",this.m=0,this.l="",this.j=this.B=this.u=this.A=!1,this.I=null,this.H="",this.J=!1}b(Ce,Qe);var hy=/^https?$/i,uy=["POST","PUT"];n=Ce.prototype,n.Ha=function(a){this.J=a},n.ea=function(a,u,f,g){if(this.g)throw Error("[goog.net.XhrIo] Object is active with another request="+this.D+"; newUri="+a);u=u?u.toUpperCase():"GET",this.D=a,this.l="",this.m=0,this.A=!1,this.h=!0,this.g=this.o?this.o.g():Ka.g(),this.v=this.o?Zh(this.o):Zh(Ka),this.g.onreadystatechange=p(this.Ea,this);try{this.B=!0,this.g.open(u,String(a),!0),this.B=!1}catch(A){Cu(this,A);return}if(a=f||"",f=new Map(this.headers),g)if(Object.getPrototypeOf(g)===Object.prototype)for(var R in g)f.set(R,g[R]);else if(typeof g.keys=="function"&&typeof g.get=="function")for(const A of g.keys())f.set(A,g.get(A));else throw Error("Unknown input type for opt_headers: "+String(g));g=Array.from(f.keys()).find(A=>A.toLowerCase()=="content-type"),R=l.FormData&&a instanceof l.FormData,!(0<=Array.prototype.indexOf.call(uy,u,void 0))||g||R||f.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");for(const[A,L]of f)this.g.setRequestHeader(A,L);this.H&&(this.g.responseType=this.H),"withCredentials"in this.g&&this.g.withCredentials!==this.J&&(this.g.withCredentials=this.J);try{Au(this),this.u=!0,this.g.send(a),this.u=!1}catch(A){Cu(this,A)}};function Cu(a,u){a.h=!1,a.g&&(a.j=!0,a.g.abort(),a.j=!1),a.l=u,a.m=5,Ru(a),Yr(a)}function Ru(a){a.A||(a.A=!0,it(a,"complete"),it(a,"error"))}n.abort=function(a){this.g&&this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1,this.m=a||7,it(this,"complete"),it(this,"abort"),Yr(this))},n.N=function(){this.g&&(this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1),Yr(this,!0)),Ce.aa.N.call(this)},n.Ea=function(){this.s||(this.B||this.u||this.j?Su(this):this.bb())},n.bb=function(){Su(this)};function Su(a){if(a.h&&typeof o<"u"&&(!a.v[1]||Gt(a)!=4||a.Z()!=2)){if(a.u&&Gt(a)==4)Qh(a.Ea,0,a);else if(it(a,"readystatechange"),Gt(a)==4){a.h=!1;try{const L=a.Z();e:switch(L){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:var u=!0;break e;default:u=!1}var f;if(!(f=u)){var g;if(g=L===0){var R=String(a.D).match(_u)[1]||null;!R&&l.self&&l.self.location&&(R=l.self.location.protocol.slice(0,-1)),g=!hy.test(R?R.toLowerCase():"")}f=g}if(f)it(a,"complete"),it(a,"success");else{a.m=6;try{var A=2<Gt(a)?a.g.statusText:""}catch{A=""}a.l=A+" ["+a.Z()+"]",Ru(a)}}finally{Yr(a)}}}}function Yr(a,u){if(a.g){Au(a);const f=a.g,g=a.v[0]?()=>{}:null;a.g=null,a.v=null,u||it(a,"ready");try{f.onreadystatechange=g}catch{}}}function Au(a){a.I&&(l.clearTimeout(a.I),a.I=null)}n.isActive=function(){return!!this.g};function Gt(a){return a.g?a.g.readyState:0}n.Z=function(){try{return 2<Gt(this)?this.g.status:-1}catch{return-1}},n.oa=function(){try{return this.g?this.g.responseText:""}catch{return""}},n.Oa=function(a){if(this.g){var u=this.g.responseText;return a&&u.indexOf(a)==0&&(u=u.substring(a.length)),W_(u)}};function ku(a){try{if(!a.g)return null;if("response"in a.g)return a.g.response;switch(a.H){case"":case"text":return a.g.responseText;case"arraybuffer":if("mozResponseArrayBuffer"in a.g)return a.g.mozResponseArrayBuffer}return null}catch{return null}}function dy(a){const u={};a=(a.g&&2<=Gt(a)&&a.g.getAllResponseHeaders()||"").split(`\r
`);for(let g=0;g<a.length;g++){if(U(a[g]))continue;var f=I(a[g]);const R=f[0];if(f=f[1],typeof f!="string")continue;f=f.trim();const A=u[R]||[];u[R]=A,A.push(f)}T(u,function(g){return g.join(", ")})}n.Ba=function(){return this.m},n.Ka=function(){return typeof this.l=="string"?this.l:String(this.l)};function Ii(a,u,f){return f&&f.internalChannelParams&&f.internalChannelParams[a]||u}function Pu(a){this.Aa=0,this.i=[],this.j=new gi,this.ia=this.qa=this.I=this.W=this.g=this.ya=this.D=this.H=this.m=this.S=this.o=null,this.Ya=this.U=0,this.Va=Ii("failFast",!1,a),this.F=this.C=this.u=this.s=this.l=null,this.X=!0,this.za=this.T=-1,this.Y=this.v=this.B=0,this.Ta=Ii("baseRetryDelayMs",5e3,a),this.cb=Ii("retryDelaySeedMs",1e4,a),this.Wa=Ii("forwardChannelMaxRetries",2,a),this.wa=Ii("forwardChannelRequestTimeoutMs",2e4,a),this.pa=a&&a.xmlHttpFactory||void 0,this.Xa=a&&a.Tb||void 0,this.Ca=a&&a.useFetchStreams||!1,this.L=void 0,this.J=a&&a.supportsCrossDomainXhr||!1,this.K="",this.h=new uu(a&&a.concurrentRequestLimit),this.Da=new ly,this.P=a&&a.fastHandshake||!1,this.O=a&&a.encodeInitMessageHeaders||!1,this.P&&this.O&&(this.O=!1),this.Ua=a&&a.Rb||!1,a&&a.xa&&this.j.xa(),a&&a.forceLongPolling&&(this.X=!1),this.ba=!this.P&&this.X&&a&&a.detectBufferingProxy||!1,this.ja=void 0,a&&a.longPollingTimeout&&0<a.longPollingTimeout&&(this.ja=a.longPollingTimeout),this.ca=void 0,this.R=0,this.M=!1,this.ka=this.A=null}n=Pu.prototype,n.la=8,n.G=1,n.connect=function(a,u,f,g){rt(0),this.W=a,this.H=u||{},f&&g!==void 0&&(this.H.OSID=f,this.H.OAID=g),this.F=this.X,this.I=Bu(this,null,this.W),Jr(this)};function nl(a){if(Nu(a),a.G==3){var u=a.U++,f=Ht(a.I);if(Ee(f,"SID",a.K),Ee(f,"RID",u),Ee(f,"TYPE","terminate"),bi(a,f),u=new fn(a,a.j,u),u.L=2,u.v=Gr(Ht(f)),f=!1,l.navigator&&l.navigator.sendBeacon)try{f=l.navigator.sendBeacon(u.v.toString(),"")}catch{}!f&&l.Image&&(new Image().src=u.v,f=!0),f||(u.g=Uu(u.j,null),u.g.ea(u.v)),u.F=Date.now(),qr(u)}Fu(a)}function Xr(a){a.g&&(il(a),a.g.cancel(),a.g=null)}function Nu(a){Xr(a),a.u&&(l.clearTimeout(a.u),a.u=null),Zr(a),a.h.cancel(),a.s&&(typeof a.s=="number"&&l.clearTimeout(a.s),a.s=null)}function Jr(a){if(!du(a.h)&&!a.s){a.s=!0;var u=a.Ga;Ne||hn(),Ae||(Ne(),Ae=!0),gt.add(u,a),a.B=0}}function fy(a,u){return fu(a.h)>=a.h.j-(a.s?1:0)?!1:a.s?(a.i=u.D.concat(a.i),!0):a.G==1||a.G==2||a.B>=(a.Va?0:a.Wa)?!1:(a.s=pi(p(a.Ga,a,u),Vu(a,a.B)),a.B++,!0)}n.Ga=function(a){if(this.s)if(this.s=null,this.G==1){if(!a){this.U=Math.floor(1e5*Math.random()),a=this.U++;const R=new fn(this,this.j,a);let A=this.o;if(this.S&&(A?(A=_(A),w(A,this.S)):A=this.S),this.m!==null||this.O||(R.H=A,A=null),this.P)e:{for(var u=0,f=0;f<this.i.length;f++){t:{var g=this.i[f];if("__data__"in g.map&&(g=g.map.__data__,typeof g=="string")){g=g.length;break t}g=void 0}if(g===void 0)break;if(u+=g,4096<u){u=f;break e}if(u===4096||f===this.i.length-1){u=f+1;break e}}u=1e3}else u=1e3;u=xu(this,R,u),f=Ht(this.I),Ee(f,"RID",a),Ee(f,"CVER",22),this.D&&Ee(f,"X-HTTP-Session-Id",this.D),bi(this,f),A&&(this.O?u="headers="+encodeURIComponent(String(bu(A)))+"&"+u:this.m&&tl(f,this.m,A)),el(this.h,R),this.Ua&&Ee(f,"TYPE","init"),this.P?(Ee(f,"$req",u),Ee(f,"SID","null"),R.T=!0,Ya(R,f,null)):Ya(R,f,u),this.G=2}}else this.G==3&&(a?Du(this,a):this.i.length==0||du(this.h)||Du(this))};function Du(a,u){var f;u?f=u.l:f=a.U++;const g=Ht(a.I);Ee(g,"SID",a.K),Ee(g,"RID",f),Ee(g,"AID",a.T),bi(a,g),a.m&&a.o&&tl(g,a.m,a.o),f=new fn(a,a.j,f,a.B+1),a.m===null&&(f.H=a.o),u&&(a.i=u.D.concat(a.i)),u=xu(a,f,1e3),f.I=Math.round(.5*a.wa)+Math.round(.5*a.wa*Math.random()),el(a.h,f),Ya(f,g,u)}function bi(a,u){a.H&&ee(a.H,function(f,g){Ee(u,g,f)}),a.l&&gu({},function(f,g){Ee(u,g,f)})}function xu(a,u,f){f=Math.min(a.i.length,f);var g=a.l?p(a.l.Na,a.l,a):null;e:{var R=a.i;let A=-1;for(;;){const L=["count="+f];A==-1?0<f?(A=R[0].g,L.push("ofs="+A)):A=0:L.push("ofs="+A);let ge=!0;for(let ze=0;ze<f;ze++){let le=R[ze].g;const Ye=R[ze].map;if(le-=A,0>le)A=Math.max(0,R[ze].g-100),ge=!1;else try{cy(Ye,L,"req"+le+"_")}catch{g&&g(Ye)}}if(ge){g=L.join("&");break e}}}return a=a.i.splice(0,f),u.D=a,g}function Mu(a){if(!a.g&&!a.u){a.Y=1;var u=a.Fa;Ne||hn(),Ae||(Ne(),Ae=!0),gt.add(u,a),a.v=0}}function sl(a){return a.g||a.u||3<=a.v?!1:(a.Y++,a.u=pi(p(a.Fa,a),Vu(a,a.v)),a.v++,!0)}n.Fa=function(){if(this.u=null,Lu(this),this.ba&&!(this.M||this.g==null||0>=this.R)){var a=2*this.R;this.j.info("BP detection timer enabled: "+a),this.A=pi(p(this.ab,this),a)}},n.ab=function(){this.A&&(this.A=null,this.j.info("BP detection timeout reached."),this.j.info("Buffering proxy detected and switch to long-polling!"),this.F=!1,this.M=!0,rt(10),Xr(this),Lu(this))};function il(a){a.A!=null&&(l.clearTimeout(a.A),a.A=null)}function Lu(a){a.g=new fn(a,a.j,"rpc",a.Y),a.m===null&&(a.g.H=a.o),a.g.O=0;var u=Ht(a.qa);Ee(u,"RID","rpc"),Ee(u,"SID",a.K),Ee(u,"AID",a.T),Ee(u,"CI",a.F?"0":"1"),!a.F&&a.ja&&Ee(u,"TO",a.ja),Ee(u,"TYPE","xmlhttp"),bi(a,u),a.m&&a.o&&tl(u,a.m,a.o),a.L&&(a.g.I=a.L);var f=a.g;a=a.ia,f.L=1,f.v=Gr(Ht(u)),f.m=null,f.P=!0,lu(f,a)}n.Za=function(){this.C!=null&&(this.C=null,Xr(this),sl(this),rt(19))};function Zr(a){a.C!=null&&(l.clearTimeout(a.C),a.C=null)}function Ou(a,u){var f=null;if(a.g==u){Zr(a),il(a),a.g=null;var g=2}else if(Za(a.h,u))f=u.D,mu(a.h,u),g=1;else return;if(a.G!=0){if(u.o)if(g==1){f=u.m?u.m.length:0,u=Date.now()-u.F;var R=a.B;g=jr(),it(g,new iu(g,f)),Jr(a)}else Mu(a);else if(R=u.s,R==3||R==0&&0<u.X||!(g==1&&fy(a,u)||g==2&&sl(a)))switch(f&&0<f.length&&(u=a.h,u.i=u.i.concat(f)),R){case 1:zn(a,5);break;case 4:zn(a,10);break;case 3:zn(a,6);break;default:zn(a,2)}}}function Vu(a,u){let f=a.Ta+Math.floor(Math.random()*a.cb);return a.isActive()||(f*=2),f*u}function zn(a,u){if(a.j.info("Error code "+u),u==2){var f=p(a.fb,a),g=a.Xa;const R=!g;g=new qn(g||"//www.google.com/images/cleardot.gif"),l.location&&l.location.protocol=="http"||zr(g,"https"),Gr(g),R?oy(g.toString(),f):ay(g.toString(),f)}else rt(2);a.G=0,a.l&&a.l.sa(u),Fu(a),Nu(a)}n.fb=function(a){a?(this.j.info("Successfully pinged google.com"),rt(2)):(this.j.info("Failed to ping google.com"),rt(1))};function Fu(a){if(a.G=0,a.ka=[],a.l){const u=pu(a.h);(u.length!=0||a.i.length!=0)&&(P(a.ka,u),P(a.ka,a.i),a.h.i.length=0,S(a.i),a.i.length=0),a.l.ra()}}function Bu(a,u,f){var g=f instanceof qn?Ht(f):new qn(f);if(g.g!="")u&&(g.g=u+"."+g.g),Hr(g,g.s);else{var R=l.location;g=R.protocol,u=u?u+"."+R.hostname:R.hostname,R=+R.port;var A=new qn(null);g&&zr(A,g),u&&(A.g=u),R&&Hr(A,R),f&&(A.l=f),g=A}return f=a.D,u=a.ya,f&&u&&Ee(g,f,u),Ee(g,"VER",a.la),bi(a,g),g}function Uu(a,u,f){if(u&&!a.J)throw Error("Can't create secondary domain capable XhrIo object.");return u=a.Ca&&!a.pa?new Ce(new Kr({eb:f})):new Ce(a.pa),u.Ha(a.J),u}n.isActive=function(){return!!this.l&&this.l.isActive(this)};function ju(){}n=ju.prototype,n.ua=function(){},n.ta=function(){},n.sa=function(){},n.ra=function(){},n.isActive=function(){return!0},n.Na=function(){};function eo(){}eo.prototype.g=function(a,u){return new _t(a,u)};function _t(a,u){Qe.call(this),this.g=new Pu(u),this.l=a,this.h=u&&u.messageUrlParams||null,a=u&&u.messageHeaders||null,u&&u.clientProtocolHeaderRequired&&(a?a["X-Client-Protocol"]="webchannel":a={"X-Client-Protocol":"webchannel"}),this.g.o=a,a=u&&u.initMessageHeaders||null,u&&u.messageContentType&&(a?a["X-WebChannel-Content-Type"]=u.messageContentType:a={"X-WebChannel-Content-Type":u.messageContentType}),u&&u.va&&(a?a["X-WebChannel-Client-Profile"]=u.va:a={"X-WebChannel-Client-Profile":u.va}),this.g.S=a,(a=u&&u.Sb)&&!U(a)&&(this.g.m=a),this.v=u&&u.supportsCrossDomainXhr||!1,this.u=u&&u.sendRawJson||!1,(u=u&&u.httpSessionIdParam)&&!U(u)&&(this.g.D=u,a=this.h,a!==null&&u in a&&(a=this.h,u in a&&delete a[u])),this.j=new ws(this)}b(_t,Qe),_t.prototype.m=function(){this.g.l=this.j,this.v&&(this.g.J=!0),this.g.connect(this.l,this.h||void 0)},_t.prototype.close=function(){nl(this.g)},_t.prototype.o=function(a){var u=this.g;if(typeof a=="string"){var f={};f.__data__=a,a=f}else this.u&&(f={},f.__data__=qa(a),a=f);u.i.push(new Y_(u.Ya++,a)),u.G==3&&Jr(u)},_t.prototype.N=function(){this.g.l=null,delete this.j,nl(this.g),delete this.g,_t.aa.N.call(this)};function $u(a){Ha.call(this),a.__headers__&&(this.headers=a.__headers__,this.statusCode=a.__status__,delete a.__headers__,delete a.__status__);var u=a.__sm__;if(u){e:{for(const f in u){a=f;break e}a=void 0}(this.i=a)&&(a=this.i,u=u!==null&&a in u?u[a]:void 0),this.data=u}else this.data=a}b($u,Ha);function Wu(){Ga.call(this),this.status=1}b(Wu,Ga);function ws(a){this.g=a}b(ws,ju),ws.prototype.ua=function(){it(this.g,"a")},ws.prototype.ta=function(a){it(this.g,new $u(a))},ws.prototype.sa=function(a){it(this.g,new Wu)},ws.prototype.ra=function(){it(this.g,"b")},eo.prototype.createWebChannel=eo.prototype.g,_t.prototype.send=_t.prototype.o,_t.prototype.open=_t.prototype.m,_t.prototype.close=_t.prototype.close,Km=function(){return new eo},Gm=function(){return jr()},Hm=$n,Bl={mb:0,pb:1,qb:2,Jb:3,Ob:4,Lb:5,Mb:6,Kb:7,Ib:8,Nb:9,PROXY:10,NOPROXY:11,Gb:12,Cb:13,Db:14,Bb:15,Eb:16,Fb:17,ib:18,hb:19,jb:20},$r.NO_ERROR=0,$r.TIMEOUT=8,$r.HTTP_ERROR=6,po=$r,ru.COMPLETE="complete",zm=ru,eu.EventType=fi,fi.OPEN="a",fi.CLOSE="b",fi.ERROR="c",fi.MESSAGE="d",Qe.prototype.listen=Qe.prototype.K,Li=eu,Ce.prototype.listenOnce=Ce.prototype.L,Ce.prototype.getLastError=Ce.prototype.Ka,Ce.prototype.getLastErrorCode=Ce.prototype.Ba,Ce.prototype.getStatus=Ce.prototype.Z,Ce.prototype.getResponseJson=Ce.prototype.Oa,Ce.prototype.getResponseText=Ce.prototype.oa,Ce.prototype.send=Ce.prototype.ea,Ce.prototype.setWithCredentials=Ce.prototype.Ha,qm=Ce}).apply(typeof so<"u"?so:typeof self<"u"?self:typeof window<"u"?window:{});const yd="@firebase/firestore";/**
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
 */class tt{constructor(e){this.uid=e}isAuthenticated(){return this.uid!=null}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(e){return e.uid===this.uid}}tt.UNAUTHENTICATED=new tt(null),tt.GOOGLE_CREDENTIALS=new tt("google-credentials-uid"),tt.FIRST_PARTY=new tt("first-party-uid"),tt.MOCK_USER=new tt("mock-user");/**
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
 */let ti="10.14.0";/**
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
 */const rs=new da("@firebase/firestore");function ki(){return rs.logLevel}function B(n,...e){if(rs.logLevel<=te.DEBUG){const t=e.map(kc);rs.debug(`Firestore (${ti}): ${n}`,...t)}}function on(n,...e){if(rs.logLevel<=te.ERROR){const t=e.map(kc);rs.error(`Firestore (${ti}): ${n}`,...t)}}function Bs(n,...e){if(rs.logLevel<=te.WARN){const t=e.map(kc);rs.warn(`Firestore (${ti}): ${n}`,...t)}}function kc(n){if(typeof n=="string")return n;try{/**
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
*/return function(t){return JSON.stringify(t)}(n)}catch{return n}}/**
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
 */function z(n="Unexpected state"){const e=`FIRESTORE (${ti}) INTERNAL ASSERTION FAILED: `+n;throw on(e),new Error(e)}function oe(n,e){n||z()}function Y(n,e){return n}/**
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
 */const k={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};class V extends cn{constructor(e,t){super(e,t),this.code=e,this.message=t,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}/**
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
 */class Vt{constructor(){this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}}/**
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
 */class Qm{constructor(e,t){this.user=t,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${e}`)}}class Qw{getToken(){return Promise.resolve(null)}invalidateToken(){}start(e,t){e.enqueueRetryable(()=>t(tt.UNAUTHENTICATED))}shutdown(){}}class Yw{constructor(e){this.token=e,this.changeListener=null}getToken(){return Promise.resolve(this.token)}invalidateToken(){}start(e,t){this.changeListener=t,e.enqueueRetryable(()=>t(this.token.user))}shutdown(){this.changeListener=null}}class Xw{constructor(e){this.t=e,this.currentUser=tt.UNAUTHENTICATED,this.i=0,this.forceRefresh=!1,this.auth=null}start(e,t){oe(this.o===void 0);let s=this.i;const i=c=>this.i!==s?(s=this.i,t(c)):Promise.resolve();let r=new Vt;this.o=()=>{this.i++,this.currentUser=this.u(),r.resolve(),r=new Vt,e.enqueueRetryable(()=>i(this.currentUser))};const o=()=>{const c=r;e.enqueueRetryable(async()=>{await c.promise,await i(this.currentUser)})},l=c=>{B("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=c,this.o&&(this.auth.addAuthTokenListener(this.o),o())};this.t.onInit(c=>l(c)),setTimeout(()=>{if(!this.auth){const c=this.t.getImmediate({optional:!0});c?l(c):(B("FirebaseAuthCredentialsProvider","Auth not yet detected"),r.resolve(),r=new Vt)}},0),o()}getToken(){const e=this.i,t=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(t).then(s=>this.i!==e?(B("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):s?(oe(typeof s.accessToken=="string"),new Qm(s.accessToken,this.currentUser)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.o&&this.auth.removeAuthTokenListener(this.o),this.o=void 0}u(){const e=this.auth&&this.auth.getUid();return oe(e===null||typeof e=="string"),new tt(e)}}class Jw{constructor(e,t,s){this.l=e,this.h=t,this.P=s,this.type="FirstParty",this.user=tt.FIRST_PARTY,this.I=new Map}T(){return this.P?this.P():null}get headers(){this.I.set("X-Goog-AuthUser",this.l);const e=this.T();return e&&this.I.set("Authorization",e),this.h&&this.I.set("X-Goog-Iam-Authorization-Token",this.h),this.I}}class Zw{constructor(e,t,s){this.l=e,this.h=t,this.P=s}getToken(){return Promise.resolve(new Jw(this.l,this.h,this.P))}start(e,t){e.enqueueRetryable(()=>t(tt.FIRST_PARTY))}shutdown(){}invalidateToken(){}}class eT{constructor(e){this.value=e,this.type="AppCheck",this.headers=new Map,e&&e.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class tT{constructor(e){this.A=e,this.forceRefresh=!1,this.appCheck=null,this.R=null}start(e,t){oe(this.o===void 0);const s=r=>{r.error!=null&&B("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${r.error.message}`);const o=r.token!==this.R;return this.R=r.token,B("FirebaseAppCheckTokenProvider",`Received ${o?"new":"existing"} token.`),o?t(r.token):Promise.resolve()};this.o=r=>{e.enqueueRetryable(()=>s(r))};const i=r=>{B("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=r,this.o&&this.appCheck.addTokenListener(this.o)};this.A.onInit(r=>i(r)),setTimeout(()=>{if(!this.appCheck){const r=this.A.getImmediate({optional:!0});r?i(r):B("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}},0)}getToken(){const e=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(e).then(t=>t?(oe(typeof t.token=="string"),this.R=t.token,new eT(t.token)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.o&&this.appCheck.removeTokenListener(this.o),this.o=void 0}}/**
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
 */function nT(n){const e=typeof self<"u"&&(self.crypto||self.msCrypto),t=new Uint8Array(n);if(e&&typeof e.getRandomValues=="function")e.getRandomValues(t);else for(let s=0;s<n;s++)t[s]=Math.floor(256*Math.random());return t}/**
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
 */class Ym{static newId(){const e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",t=Math.floor(256/e.length)*e.length;let s="";for(;s.length<20;){const i=nT(40);for(let r=0;r<i.length;++r)s.length<20&&i[r]<t&&(s+=e.charAt(i[r]%e.length))}return s}}function ce(n,e){return n<e?-1:n>e?1:0}function Us(n,e,t){return n.length===e.length&&n.every((s,i)=>t(s,e[i]))}/**
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
 */class Ve{constructor(e,t){if(this.seconds=e,this.nanoseconds=t,t<0)throw new V(k.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(t>=1e9)throw new V(k.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(e<-62135596800)throw new V(k.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e);if(e>=253402300800)throw new V(k.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e)}static now(){return Ve.fromMillis(Date.now())}static fromDate(e){return Ve.fromMillis(e.getTime())}static fromMillis(e){const t=Math.floor(e/1e3),s=Math.floor(1e6*(e-1e3*t));return new Ve(t,s)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/1e6}_compareTo(e){return this.seconds===e.seconds?ce(this.nanoseconds,e.nanoseconds):ce(this.seconds,e.seconds)}isEqual(e){return e.seconds===this.seconds&&e.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{seconds:this.seconds,nanoseconds:this.nanoseconds}}valueOf(){const e=this.seconds- -62135596800;return String(e).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}/**
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
 */class K{constructor(e){this.timestamp=e}static fromTimestamp(e){return new K(e)}static min(){return new K(new Ve(0,0))}static max(){return new K(new Ve(253402300799,999999999))}compareTo(e){return this.timestamp._compareTo(e.timestamp)}isEqual(e){return this.timestamp.isEqual(e.timestamp)}toMicroseconds(){return 1e6*this.timestamp.seconds+this.timestamp.nanoseconds/1e3}toString(){return"SnapshotVersion("+this.timestamp.toString()+")"}toTimestamp(){return this.timestamp}}/**
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
 */class tr{constructor(e,t,s){t===void 0?t=0:t>e.length&&z(),s===void 0?s=e.length-t:s>e.length-t&&z(),this.segments=e,this.offset=t,this.len=s}get length(){return this.len}isEqual(e){return tr.comparator(this,e)===0}child(e){const t=this.segments.slice(this.offset,this.limit());return e instanceof tr?e.forEach(s=>{t.push(s)}):t.push(e),this.construct(t)}limit(){return this.offset+this.length}popFirst(e){return e=e===void 0?1:e,this.construct(this.segments,this.offset+e,this.length-e)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(e){return this.segments[this.offset+e]}isEmpty(){return this.length===0}isPrefixOf(e){if(e.length<this.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}isImmediateParentOf(e){if(this.length+1!==e.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}forEach(e){for(let t=this.offset,s=this.limit();t<s;t++)e(this.segments[t])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(e,t){const s=Math.min(e.length,t.length);for(let i=0;i<s;i++){const r=e.get(i),o=t.get(i);if(r<o)return-1;if(r>o)return 1}return e.length<t.length?-1:e.length>t.length?1:0}}class ye extends tr{construct(e,t,s){return new ye(e,t,s)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...e){const t=[];for(const s of e){if(s.indexOf("//")>=0)throw new V(k.INVALID_ARGUMENT,`Invalid segment (${s}). Paths must not contain // in them.`);t.push(...s.split("/").filter(i=>i.length>0))}return new ye(t)}static emptyPath(){return new ye([])}}const sT=/^[_a-zA-Z][_a-zA-Z0-9]*$/;class He extends tr{construct(e,t,s){return new He(e,t,s)}static isValidIdentifier(e){return sT.test(e)}canonicalString(){return this.toArray().map(e=>(e=e.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),He.isValidIdentifier(e)||(e="`"+e+"`"),e)).join(".")}toString(){return this.canonicalString()}isKeyField(){return this.length===1&&this.get(0)==="__name__"}static keyField(){return new He(["__name__"])}static fromServerFormat(e){const t=[];let s="",i=0;const r=()=>{if(s.length===0)throw new V(k.INVALID_ARGUMENT,`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);t.push(s),s=""};let o=!1;for(;i<e.length;){const l=e[i];if(l==="\\"){if(i+1===e.length)throw new V(k.INVALID_ARGUMENT,"Path has trailing escape character: "+e);const c=e[i+1];if(c!=="\\"&&c!=="."&&c!=="`")throw new V(k.INVALID_ARGUMENT,"Path has invalid escape sequence: "+e);s+=c,i+=2}else l==="`"?(o=!o,i++):l!=="."||o?(s+=l,i++):(r(),i++)}if(r(),o)throw new V(k.INVALID_ARGUMENT,"Unterminated ` in path: "+e);return new He(t)}static emptyPath(){return new He([])}}/**
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
 */class ${constructor(e){this.path=e}static fromPath(e){return new $(ye.fromString(e))}static fromName(e){return new $(ye.fromString(e).popFirst(5))}static empty(){return new $(ye.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(e){return this.path.length>=2&&this.path.get(this.path.length-2)===e}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(e){return e!==null&&ye.comparator(this.path,e.path)===0}toString(){return this.path.toString()}static comparator(e,t){return ye.comparator(e.path,t.path)}static isDocumentKey(e){return e.length%2==0}static fromSegments(e){return new $(new ye(e.slice()))}}function iT(n,e){const t=n.toTimestamp().seconds,s=n.toTimestamp().nanoseconds+1,i=K.fromTimestamp(s===1e9?new Ve(t+1,0):new Ve(t,s));return new Nn(i,$.empty(),e)}function rT(n){return new Nn(n.readTime,n.key,-1)}class Nn{constructor(e,t,s){this.readTime=e,this.documentKey=t,this.largestBatchId=s}static min(){return new Nn(K.min(),$.empty(),-1)}static max(){return new Nn(K.max(),$.empty(),-1)}}function oT(n,e){let t=n.readTime.compareTo(e.readTime);return t!==0?t:(t=$.comparator(n.documentKey,e.documentKey),t!==0?t:ce(n.largestBatchId,e.largestBatchId))}/**
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
 */const aT="The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.";class lT{constructor(){this.onCommittedListeners=[]}addOnCommittedListener(e){this.onCommittedListeners.push(e)}raiseOnCommittedEvent(){this.onCommittedListeners.forEach(e=>e())}}/**
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
 */async function vr(n){if(n.code!==k.FAILED_PRECONDITION||n.message!==aT)throw n;B("LocalStore","Unexpectedly lost primary lease")}/**
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
 */class N{constructor(e){this.nextCallback=null,this.catchCallback=null,this.result=void 0,this.error=void 0,this.isDone=!1,this.callbackAttached=!1,e(t=>{this.isDone=!0,this.result=t,this.nextCallback&&this.nextCallback(t)},t=>{this.isDone=!0,this.error=t,this.catchCallback&&this.catchCallback(t)})}catch(e){return this.next(void 0,e)}next(e,t){return this.callbackAttached&&z(),this.callbackAttached=!0,this.isDone?this.error?this.wrapFailure(t,this.error):this.wrapSuccess(e,this.result):new N((s,i)=>{this.nextCallback=r=>{this.wrapSuccess(e,r).next(s,i)},this.catchCallback=r=>{this.wrapFailure(t,r).next(s,i)}})}toPromise(){return new Promise((e,t)=>{this.next(e,t)})}wrapUserFunction(e){try{const t=e();return t instanceof N?t:N.resolve(t)}catch(t){return N.reject(t)}}wrapSuccess(e,t){return e?this.wrapUserFunction(()=>e(t)):N.resolve(t)}wrapFailure(e,t){return e?this.wrapUserFunction(()=>e(t)):N.reject(t)}static resolve(e){return new N((t,s)=>{t(e)})}static reject(e){return new N((t,s)=>{s(e)})}static waitFor(e){return new N((t,s)=>{let i=0,r=0,o=!1;e.forEach(l=>{++i,l.next(()=>{++r,o&&r===i&&t()},c=>s(c))}),o=!0,r===i&&t()})}static or(e){let t=N.resolve(!1);for(const s of e)t=t.next(i=>i?N.resolve(i):s());return t}static forEach(e,t){const s=[];return e.forEach((i,r)=>{s.push(t.call(this,i,r))}),this.waitFor(s)}static mapArray(e,t){return new N((s,i)=>{const r=e.length,o=new Array(r);let l=0;for(let c=0;c<r;c++){const h=c;t(e[h]).next(d=>{o[h]=d,++l,l===r&&s(o)},d=>i(d))}})}static doWhile(e,t){return new N((s,i)=>{const r=()=>{e()===!0?t().next(()=>{r()},i):s()};r()})}}function cT(n){const e=n.match(/Android ([\d.]+)/i),t=e?e[1].split(".").slice(0,2).join("."):"-1";return Number(t)}function Er(n){return n.name==="IndexedDbTransactionError"}/**
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
 */class Pc{constructor(e,t){this.previousValue=e,t&&(t.sequenceNumberHandler=s=>this.ie(s),this.se=s=>t.writeSequenceNumber(s))}ie(e){return this.previousValue=Math.max(e,this.previousValue),this.previousValue}next(){const e=++this.previousValue;return this.se&&this.se(e),e}}Pc.oe=-1;function wr(n){return n==null}function xo(n){return n===0&&1/n==-1/0}function hT(n){return typeof n=="number"&&Number.isInteger(n)&&!xo(n)&&n<=Number.MAX_SAFE_INTEGER&&n>=Number.MIN_SAFE_INTEGER}/**
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
 */function vd(n){let e=0;for(const t in n)Object.prototype.hasOwnProperty.call(n,t)&&e++;return e}function fs(n,e){for(const t in n)Object.prototype.hasOwnProperty.call(n,t)&&e(t,n[t])}function Xm(n){for(const e in n)if(Object.prototype.hasOwnProperty.call(n,e))return!1;return!0}/**
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
 */let Me=class Ul{constructor(e,t){this.comparator=e,this.root=t||Rn.EMPTY}insert(e,t){return new Ul(this.comparator,this.root.insert(e,t,this.comparator).copy(null,null,Rn.BLACK,null,null))}remove(e){return new Ul(this.comparator,this.root.remove(e,this.comparator).copy(null,null,Rn.BLACK,null,null))}get(e){let t=this.root;for(;!t.isEmpty();){const s=this.comparator(e,t.key);if(s===0)return t.value;s<0?t=t.left:s>0&&(t=t.right)}return null}indexOf(e){let t=0,s=this.root;for(;!s.isEmpty();){const i=this.comparator(e,s.key);if(i===0)return t+s.left.size;i<0?s=s.left:(t+=s.left.size+1,s=s.right)}return-1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(e){return this.root.inorderTraversal(e)}forEach(e){this.inorderTraversal((t,s)=>(e(t,s),!1))}toString(){const e=[];return this.inorderTraversal((t,s)=>(e.push(`${t}:${s}`),!1)),`{${e.join(", ")}}`}reverseTraversal(e){return this.root.reverseTraversal(e)}getIterator(){return new io(this.root,null,this.comparator,!1)}getIteratorFrom(e){return new io(this.root,e,this.comparator,!1)}getReverseIterator(){return new io(this.root,null,this.comparator,!0)}getReverseIteratorFrom(e){return new io(this.root,e,this.comparator,!0)}},io=class{constructor(e,t,s,i){this.isReverse=i,this.nodeStack=[];let r=1;for(;!e.isEmpty();)if(r=t?s(e.key,t):1,t&&i&&(r*=-1),r<0)e=this.isReverse?e.left:e.right;else{if(r===0){this.nodeStack.push(e);break}this.nodeStack.push(e),e=this.isReverse?e.right:e.left}}getNext(){let e=this.nodeStack.pop();const t={key:e.key,value:e.value};if(this.isReverse)for(e=e.left;!e.isEmpty();)this.nodeStack.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack.push(e),e=e.left;return t}hasNext(){return this.nodeStack.length>0}peek(){if(this.nodeStack.length===0)return null;const e=this.nodeStack[this.nodeStack.length-1];return{key:e.key,value:e.value}}},Rn=class Qt{constructor(e,t,s,i,r){this.key=e,this.value=t,this.color=s??Qt.RED,this.left=i??Qt.EMPTY,this.right=r??Qt.EMPTY,this.size=this.left.size+1+this.right.size}copy(e,t,s,i,r){return new Qt(e??this.key,t??this.value,s??this.color,i??this.left,r??this.right)}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,t,s){let i=this;const r=s(e,i.key);return i=r<0?i.copy(null,null,null,i.left.insert(e,t,s),null):r===0?i.copy(null,t,null,null,null):i.copy(null,null,null,null,i.right.insert(e,t,s)),i.fixUp()}removeMin(){if(this.left.isEmpty())return Qt.EMPTY;let e=this;return e.left.isRed()||e.left.left.isRed()||(e=e.moveRedLeft()),e=e.copy(null,null,null,e.left.removeMin(),null),e.fixUp()}remove(e,t){let s,i=this;if(t(e,i.key)<0)i.left.isEmpty()||i.left.isRed()||i.left.left.isRed()||(i=i.moveRedLeft()),i=i.copy(null,null,null,i.left.remove(e,t),null);else{if(i.left.isRed()&&(i=i.rotateRight()),i.right.isEmpty()||i.right.isRed()||i.right.left.isRed()||(i=i.moveRedRight()),t(e,i.key)===0){if(i.right.isEmpty())return Qt.EMPTY;s=i.right.min(),i=i.copy(s.key,s.value,null,null,i.right.removeMin())}i=i.copy(null,null,null,null,i.right.remove(e,t))}return i.fixUp()}isRed(){return this.color}fixUp(){let e=this;return e.right.isRed()&&!e.left.isRed()&&(e=e.rotateLeft()),e.left.isRed()&&e.left.left.isRed()&&(e=e.rotateRight()),e.left.isRed()&&e.right.isRed()&&(e=e.colorFlip()),e}moveRedLeft(){let e=this.colorFlip();return e.right.left.isRed()&&(e=e.copy(null,null,null,null,e.right.rotateRight()),e=e.rotateLeft(),e=e.colorFlip()),e}moveRedRight(){let e=this.colorFlip();return e.left.left.isRed()&&(e=e.rotateRight(),e=e.colorFlip()),e}rotateLeft(){const e=this.copy(null,null,Qt.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight(){const e=this.copy(null,null,Qt.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip(){const e=this.left.copy(null,null,!this.left.color,null,null),t=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,t)}checkMaxDepth(){const e=this.check();return Math.pow(2,e)<=this.size+1}check(){if(this.isRed()&&this.left.isRed()||this.right.isRed())throw z();const e=this.left.check();if(e!==this.right.check())throw z();return e+(this.isRed()?0:1)}};Rn.EMPTY=null,Rn.RED=!0,Rn.BLACK=!1;Rn.EMPTY=new class{constructor(){this.size=0}get key(){throw z()}get value(){throw z()}get color(){throw z()}get left(){throw z()}get right(){throw z()}copy(e,t,s,i,r){return this}insert(e,t,s){return new Rn(e,t)}remove(e,t){return this}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}};/**
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
 */class Ge{constructor(e){this.comparator=e,this.data=new Me(this.comparator)}has(e){return this.data.get(e)!==null}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(e){return this.data.indexOf(e)}forEach(e){this.data.inorderTraversal((t,s)=>(e(t),!1))}forEachInRange(e,t){const s=this.data.getIteratorFrom(e[0]);for(;s.hasNext();){const i=s.getNext();if(this.comparator(i.key,e[1])>=0)return;t(i.key)}}forEachWhile(e,t){let s;for(s=t!==void 0?this.data.getIteratorFrom(t):this.data.getIterator();s.hasNext();)if(!e(s.getNext().key))return}firstAfterOrEqual(e){const t=this.data.getIteratorFrom(e);return t.hasNext()?t.getNext().key:null}getIterator(){return new Ed(this.data.getIterator())}getIteratorFrom(e){return new Ed(this.data.getIteratorFrom(e))}add(e){return this.copy(this.data.remove(e).insert(e,!0))}delete(e){return this.has(e)?this.copy(this.data.remove(e)):this}isEmpty(){return this.data.isEmpty()}unionWith(e){let t=this;return t.size<e.size&&(t=e,e=this),e.forEach(s=>{t=t.add(s)}),t}isEqual(e){if(!(e instanceof Ge)||this.size!==e.size)return!1;const t=this.data.getIterator(),s=e.data.getIterator();for(;t.hasNext();){const i=t.getNext().key,r=s.getNext().key;if(this.comparator(i,r)!==0)return!1}return!0}toArray(){const e=[];return this.forEach(t=>{e.push(t)}),e}toString(){const e=[];return this.forEach(t=>e.push(t)),"SortedSet("+e.toString()+")"}copy(e){const t=new Ge(this.comparator);return t.data=e,t}}class Ed{constructor(e){this.iter=e}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}}/**
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
 */class Et{constructor(e){this.fields=e,e.sort(He.comparator)}static empty(){return new Et([])}unionWith(e){let t=new Ge(He.comparator);for(const s of this.fields)t=t.add(s);for(const s of e)t=t.add(s);return new Et(t.toArray())}covers(e){for(const t of this.fields)if(t.isPrefixOf(e))return!0;return!1}isEqual(e){return Us(this.fields,e.fields,(t,s)=>t.isEqual(s))}}/**
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
 */class Jm extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}}/**
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
 */class Ke{constructor(e){this.binaryString=e}static fromBase64String(e){const t=function(i){try{return atob(i)}catch(r){throw typeof DOMException<"u"&&r instanceof DOMException?new Jm("Invalid base64 string: "+r):r}}(e);return new Ke(t)}static fromUint8Array(e){const t=function(i){let r="";for(let o=0;o<i.length;++o)r+=String.fromCharCode(i[o]);return r}(e);return new Ke(t)}[Symbol.iterator](){let e=0;return{next:()=>e<this.binaryString.length?{value:this.binaryString.charCodeAt(e++),done:!1}:{value:void 0,done:!0}}}toBase64(){return function(t){return btoa(t)}(this.binaryString)}toUint8Array(){return function(t){const s=new Uint8Array(t.length);for(let i=0;i<t.length;i++)s[i]=t.charCodeAt(i);return s}(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(e){return ce(this.binaryString,e.binaryString)}isEqual(e){return this.binaryString===e.binaryString}}Ke.EMPTY_BYTE_STRING=new Ke("");const uT=new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);function Dn(n){if(oe(!!n),typeof n=="string"){let e=0;const t=uT.exec(n);if(oe(!!t),t[1]){let i=t[1];i=(i+"000000000").substr(0,9),e=Number(i)}const s=new Date(n);return{seconds:Math.floor(s.getTime()/1e3),nanos:e}}return{seconds:Pe(n.seconds),nanos:Pe(n.nanos)}}function Pe(n){return typeof n=="number"?n:typeof n=="string"?Number(n):0}function os(n){return typeof n=="string"?Ke.fromBase64String(n):Ke.fromUint8Array(n)}/**
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
 */function Nc(n){var e,t;return((t=(((e=n==null?void 0:n.mapValue)===null||e===void 0?void 0:e.fields)||{}).__type__)===null||t===void 0?void 0:t.stringValue)==="server_timestamp"}function Dc(n){const e=n.mapValue.fields.__previous_value__;return Nc(e)?Dc(e):e}function nr(n){const e=Dn(n.mapValue.fields.__local_write_time__.timestampValue);return new Ve(e.seconds,e.nanos)}/**
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
 */class dT{constructor(e,t,s,i,r,o,l,c,h){this.databaseId=e,this.appId=t,this.persistenceKey=s,this.host=i,this.ssl=r,this.forceLongPolling=o,this.autoDetectLongPolling=l,this.longPollingOptions=c,this.useFetchStreams=h}}class sr{constructor(e,t){this.projectId=e,this.database=t||"(default)"}static empty(){return new sr("","")}get isDefaultDatabase(){return this.database==="(default)"}isEqual(e){return e instanceof sr&&e.projectId===this.projectId&&e.database===this.database}}/**
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
 */const ro={mapValue:{}};function as(n){return"nullValue"in n?0:"booleanValue"in n?1:"integerValue"in n||"doubleValue"in n?2:"timestampValue"in n?3:"stringValue"in n?5:"bytesValue"in n?6:"referenceValue"in n?7:"geoPointValue"in n?8:"arrayValue"in n?9:"mapValue"in n?Nc(n)?4:mT(n)?9007199254740991:fT(n)?10:11:z()}function Ut(n,e){if(n===e)return!0;const t=as(n);if(t!==as(e))return!1;switch(t){case 0:case 9007199254740991:return!0;case 1:return n.booleanValue===e.booleanValue;case 4:return nr(n).isEqual(nr(e));case 3:return function(i,r){if(typeof i.timestampValue=="string"&&typeof r.timestampValue=="string"&&i.timestampValue.length===r.timestampValue.length)return i.timestampValue===r.timestampValue;const o=Dn(i.timestampValue),l=Dn(r.timestampValue);return o.seconds===l.seconds&&o.nanos===l.nanos}(n,e);case 5:return n.stringValue===e.stringValue;case 6:return function(i,r){return os(i.bytesValue).isEqual(os(r.bytesValue))}(n,e);case 7:return n.referenceValue===e.referenceValue;case 8:return function(i,r){return Pe(i.geoPointValue.latitude)===Pe(r.geoPointValue.latitude)&&Pe(i.geoPointValue.longitude)===Pe(r.geoPointValue.longitude)}(n,e);case 2:return function(i,r){if("integerValue"in i&&"integerValue"in r)return Pe(i.integerValue)===Pe(r.integerValue);if("doubleValue"in i&&"doubleValue"in r){const o=Pe(i.doubleValue),l=Pe(r.doubleValue);return o===l?xo(o)===xo(l):isNaN(o)&&isNaN(l)}return!1}(n,e);case 9:return Us(n.arrayValue.values||[],e.arrayValue.values||[],Ut);case 10:case 11:return function(i,r){const o=i.mapValue.fields||{},l=r.mapValue.fields||{};if(vd(o)!==vd(l))return!1;for(const c in o)if(o.hasOwnProperty(c)&&(l[c]===void 0||!Ut(o[c],l[c])))return!1;return!0}(n,e);default:return z()}}function ir(n,e){return(n.values||[]).find(t=>Ut(t,e))!==void 0}function js(n,e){if(n===e)return 0;const t=as(n),s=as(e);if(t!==s)return ce(t,s);switch(t){case 0:case 9007199254740991:return 0;case 1:return ce(n.booleanValue,e.booleanValue);case 2:return function(r,o){const l=Pe(r.integerValue||r.doubleValue),c=Pe(o.integerValue||o.doubleValue);return l<c?-1:l>c?1:l===c?0:isNaN(l)?isNaN(c)?0:-1:1}(n,e);case 3:return wd(n.timestampValue,e.timestampValue);case 4:return wd(nr(n),nr(e));case 5:return ce(n.stringValue,e.stringValue);case 6:return function(r,o){const l=os(r),c=os(o);return l.compareTo(c)}(n.bytesValue,e.bytesValue);case 7:return function(r,o){const l=r.split("/"),c=o.split("/");for(let h=0;h<l.length&&h<c.length;h++){const d=ce(l[h],c[h]);if(d!==0)return d}return ce(l.length,c.length)}(n.referenceValue,e.referenceValue);case 8:return function(r,o){const l=ce(Pe(r.latitude),Pe(o.latitude));return l!==0?l:ce(Pe(r.longitude),Pe(o.longitude))}(n.geoPointValue,e.geoPointValue);case 9:return Td(n.arrayValue,e.arrayValue);case 10:return function(r,o){var l,c,h,d;const m=r.fields||{},p=o.fields||{},E=(l=m.value)===null||l===void 0?void 0:l.arrayValue,b=(c=p.value)===null||c===void 0?void 0:c.arrayValue,S=ce(((h=E==null?void 0:E.values)===null||h===void 0?void 0:h.length)||0,((d=b==null?void 0:b.values)===null||d===void 0?void 0:d.length)||0);return S!==0?S:Td(E,b)}(n.mapValue,e.mapValue);case 11:return function(r,o){if(r===ro.mapValue&&o===ro.mapValue)return 0;if(r===ro.mapValue)return 1;if(o===ro.mapValue)return-1;const l=r.fields||{},c=Object.keys(l),h=o.fields||{},d=Object.keys(h);c.sort(),d.sort();for(let m=0;m<c.length&&m<d.length;++m){const p=ce(c[m],d[m]);if(p!==0)return p;const E=js(l[c[m]],h[d[m]]);if(E!==0)return E}return ce(c.length,d.length)}(n.mapValue,e.mapValue);default:throw z()}}function wd(n,e){if(typeof n=="string"&&typeof e=="string"&&n.length===e.length)return ce(n,e);const t=Dn(n),s=Dn(e),i=ce(t.seconds,s.seconds);return i!==0?i:ce(t.nanos,s.nanos)}function Td(n,e){const t=n.values||[],s=e.values||[];for(let i=0;i<t.length&&i<s.length;++i){const r=js(t[i],s[i]);if(r)return r}return ce(t.length,s.length)}function $s(n){return jl(n)}function jl(n){return"nullValue"in n?"null":"booleanValue"in n?""+n.booleanValue:"integerValue"in n?""+n.integerValue:"doubleValue"in n?""+n.doubleValue:"timestampValue"in n?function(t){const s=Dn(t);return`time(${s.seconds},${s.nanos})`}(n.timestampValue):"stringValue"in n?n.stringValue:"bytesValue"in n?function(t){return os(t).toBase64()}(n.bytesValue):"referenceValue"in n?function(t){return $.fromName(t).toString()}(n.referenceValue):"geoPointValue"in n?function(t){return`geo(${t.latitude},${t.longitude})`}(n.geoPointValue):"arrayValue"in n?function(t){let s="[",i=!0;for(const r of t.values||[])i?i=!1:s+=",",s+=jl(r);return s+"]"}(n.arrayValue):"mapValue"in n?function(t){const s=Object.keys(t.fields||{}).sort();let i="{",r=!0;for(const o of s)r?r=!1:i+=",",i+=`${o}:${jl(t.fields[o])}`;return i+"}"}(n.mapValue):z()}function Id(n,e){return{referenceValue:`projects/${n.projectId}/databases/${n.database}/documents/${e.path.canonicalString()}`}}function $l(n){return!!n&&"integerValue"in n}function xc(n){return!!n&&"arrayValue"in n}function bd(n){return!!n&&"nullValue"in n}function Cd(n){return!!n&&"doubleValue"in n&&isNaN(Number(n.doubleValue))}function go(n){return!!n&&"mapValue"in n}function fT(n){var e,t;return((t=(((e=n==null?void 0:n.mapValue)===null||e===void 0?void 0:e.fields)||{}).__type__)===null||t===void 0?void 0:t.stringValue)==="__vector__"}function Bi(n){if(n.geoPointValue)return{geoPointValue:Object.assign({},n.geoPointValue)};if(n.timestampValue&&typeof n.timestampValue=="object")return{timestampValue:Object.assign({},n.timestampValue)};if(n.mapValue){const e={mapValue:{fields:{}}};return fs(n.mapValue.fields,(t,s)=>e.mapValue.fields[t]=Bi(s)),e}if(n.arrayValue){const e={arrayValue:{values:[]}};for(let t=0;t<(n.arrayValue.values||[]).length;++t)e.arrayValue.values[t]=Bi(n.arrayValue.values[t]);return e}return Object.assign({},n)}function mT(n){return(((n.mapValue||{}).fields||{}).__type__||{}).stringValue==="__max__"}/**
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
 */class ht{constructor(e){this.value=e}static empty(){return new ht({mapValue:{}})}field(e){if(e.isEmpty())return this.value;{let t=this.value;for(let s=0;s<e.length-1;++s)if(t=(t.mapValue.fields||{})[e.get(s)],!go(t))return null;return t=(t.mapValue.fields||{})[e.lastSegment()],t||null}}set(e,t){this.getFieldsMap(e.popLast())[e.lastSegment()]=Bi(t)}setAll(e){let t=He.emptyPath(),s={},i=[];e.forEach((o,l)=>{if(!t.isImmediateParentOf(l)){const c=this.getFieldsMap(t);this.applyChanges(c,s,i),s={},i=[],t=l.popLast()}o?s[l.lastSegment()]=Bi(o):i.push(l.lastSegment())});const r=this.getFieldsMap(t);this.applyChanges(r,s,i)}delete(e){const t=this.field(e.popLast());go(t)&&t.mapValue.fields&&delete t.mapValue.fields[e.lastSegment()]}isEqual(e){return Ut(this.value,e.value)}getFieldsMap(e){let t=this.value;t.mapValue.fields||(t.mapValue={fields:{}});for(let s=0;s<e.length;++s){let i=t.mapValue.fields[e.get(s)];go(i)&&i.mapValue.fields||(i={mapValue:{fields:{}}},t.mapValue.fields[e.get(s)]=i),t=i}return t.mapValue.fields}applyChanges(e,t,s){fs(t,(i,r)=>e[i]=r);for(const i of s)delete e[i]}clone(){return new ht(Bi(this.value))}}function Zm(n){const e=[];return fs(n.fields,(t,s)=>{const i=new He([t]);if(go(s)){const r=Zm(s.mapValue).fields;if(r.length===0)e.push(i);else for(const o of r)e.push(i.child(o))}else e.push(i)}),new Et(e)}/**
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
 */class je{constructor(e,t,s,i,r,o,l){this.key=e,this.documentType=t,this.version=s,this.readTime=i,this.createTime=r,this.data=o,this.documentState=l}static newInvalidDocument(e){return new je(e,0,K.min(),K.min(),K.min(),ht.empty(),0)}static newFoundDocument(e,t,s,i){return new je(e,1,t,K.min(),s,i,0)}static newNoDocument(e,t){return new je(e,2,t,K.min(),K.min(),ht.empty(),0)}static newUnknownDocument(e,t){return new je(e,3,t,K.min(),K.min(),ht.empty(),2)}convertToFoundDocument(e,t){return!this.createTime.isEqual(K.min())||this.documentType!==2&&this.documentType!==0||(this.createTime=e),this.version=e,this.documentType=1,this.data=t,this.documentState=0,this}convertToNoDocument(e){return this.version=e,this.documentType=2,this.data=ht.empty(),this.documentState=0,this}convertToUnknownDocument(e){return this.version=e,this.documentType=3,this.data=ht.empty(),this.documentState=2,this}setHasCommittedMutations(){return this.documentState=2,this}setHasLocalMutations(){return this.documentState=1,this.version=K.min(),this}setReadTime(e){return this.readTime=e,this}get hasLocalMutations(){return this.documentState===1}get hasCommittedMutations(){return this.documentState===2}get hasPendingWrites(){return this.hasLocalMutations||this.hasCommittedMutations}isValidDocument(){return this.documentType!==0}isFoundDocument(){return this.documentType===1}isNoDocument(){return this.documentType===2}isUnknownDocument(){return this.documentType===3}isEqual(e){return e instanceof je&&this.key.isEqual(e.key)&&this.version.isEqual(e.version)&&this.documentType===e.documentType&&this.documentState===e.documentState&&this.data.isEqual(e.data)}mutableCopy(){return new je(this.key,this.documentType,this.version,this.readTime,this.createTime,this.data.clone(),this.documentState)}toString(){return`Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`}}/**
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
 */class Mo{constructor(e,t){this.position=e,this.inclusive=t}}function Rd(n,e,t){let s=0;for(let i=0;i<n.position.length;i++){const r=e[i],o=n.position[i];if(r.field.isKeyField()?s=$.comparator($.fromName(o.referenceValue),t.key):s=js(o,t.data.field(r.field)),r.dir==="desc"&&(s*=-1),s!==0)break}return s}function Sd(n,e){if(n===null)return e===null;if(e===null||n.inclusive!==e.inclusive||n.position.length!==e.position.length)return!1;for(let t=0;t<n.position.length;t++)if(!Ut(n.position[t],e.position[t]))return!1;return!0}/**
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
 */class Lo{constructor(e,t="asc"){this.field=e,this.dir=t}}function pT(n,e){return n.dir===e.dir&&n.field.isEqual(e.field)}/**
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
 */class ep{}class xe extends ep{constructor(e,t,s){super(),this.field=e,this.op=t,this.value=s}static create(e,t,s){return e.isKeyField()?t==="in"||t==="not-in"?this.createKeyFieldInFilter(e,t,s):new _T(e,t,s):t==="array-contains"?new ET(e,s):t==="in"?new wT(e,s):t==="not-in"?new TT(e,s):t==="array-contains-any"?new IT(e,s):new xe(e,t,s)}static createKeyFieldInFilter(e,t,s){return t==="in"?new yT(e,s):new vT(e,s)}matches(e){const t=e.data.field(this.field);return this.op==="!="?t!==null&&this.matchesComparison(js(t,this.value)):t!==null&&as(this.value)===as(t)&&this.matchesComparison(js(t,this.value))}matchesComparison(e){switch(this.op){case"<":return e<0;case"<=":return e<=0;case"==":return e===0;case"!=":return e!==0;case">":return e>0;case">=":return e>=0;default:return z()}}isInequality(){return["<","<=",">",">=","!=","not-in"].indexOf(this.op)>=0}getFlattenedFilters(){return[this]}getFilters(){return[this]}}class Dt extends ep{constructor(e,t){super(),this.filters=e,this.op=t,this.ae=null}static create(e,t){return new Dt(e,t)}matches(e){return tp(this)?this.filters.find(t=>!t.matches(e))===void 0:this.filters.find(t=>t.matches(e))!==void 0}getFlattenedFilters(){return this.ae!==null||(this.ae=this.filters.reduce((e,t)=>e.concat(t.getFlattenedFilters()),[])),this.ae}getFilters(){return Object.assign([],this.filters)}}function tp(n){return n.op==="and"}function np(n){return gT(n)&&tp(n)}function gT(n){for(const e of n.filters)if(e instanceof Dt)return!1;return!0}function Wl(n){if(n instanceof xe)return n.field.canonicalString()+n.op.toString()+$s(n.value);if(np(n))return n.filters.map(e=>Wl(e)).join(",");{const e=n.filters.map(t=>Wl(t)).join(",");return`${n.op}(${e})`}}function sp(n,e){return n instanceof xe?function(s,i){return i instanceof xe&&s.op===i.op&&s.field.isEqual(i.field)&&Ut(s.value,i.value)}(n,e):n instanceof Dt?function(s,i){return i instanceof Dt&&s.op===i.op&&s.filters.length===i.filters.length?s.filters.reduce((r,o,l)=>r&&sp(o,i.filters[l]),!0):!1}(n,e):void z()}function ip(n){return n instanceof xe?function(t){return`${t.field.canonicalString()} ${t.op} ${$s(t.value)}`}(n):n instanceof Dt?function(t){return t.op.toString()+" {"+t.getFilters().map(ip).join(" ,")+"}"}(n):"Filter"}class _T extends xe{constructor(e,t,s){super(e,t,s),this.key=$.fromName(s.referenceValue)}matches(e){const t=$.comparator(e.key,this.key);return this.matchesComparison(t)}}class yT extends xe{constructor(e,t){super(e,"in",t),this.keys=rp("in",t)}matches(e){return this.keys.some(t=>t.isEqual(e.key))}}class vT extends xe{constructor(e,t){super(e,"not-in",t),this.keys=rp("not-in",t)}matches(e){return!this.keys.some(t=>t.isEqual(e.key))}}function rp(n,e){var t;return(((t=e.arrayValue)===null||t===void 0?void 0:t.values)||[]).map(s=>$.fromName(s.referenceValue))}class ET extends xe{constructor(e,t){super(e,"array-contains",t)}matches(e){const t=e.data.field(this.field);return xc(t)&&ir(t.arrayValue,this.value)}}class wT extends xe{constructor(e,t){super(e,"in",t)}matches(e){const t=e.data.field(this.field);return t!==null&&ir(this.value.arrayValue,t)}}class TT extends xe{constructor(e,t){super(e,"not-in",t)}matches(e){if(ir(this.value.arrayValue,{nullValue:"NULL_VALUE"}))return!1;const t=e.data.field(this.field);return t!==null&&!ir(this.value.arrayValue,t)}}class IT extends xe{constructor(e,t){super(e,"array-contains-any",t)}matches(e){const t=e.data.field(this.field);return!(!xc(t)||!t.arrayValue.values)&&t.arrayValue.values.some(s=>ir(this.value.arrayValue,s))}}/**
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
 */class bT{constructor(e,t=null,s=[],i=[],r=null,o=null,l=null){this.path=e,this.collectionGroup=t,this.orderBy=s,this.filters=i,this.limit=r,this.startAt=o,this.endAt=l,this.ue=null}}function Ad(n,e=null,t=[],s=[],i=null,r=null,o=null){return new bT(n,e,t,s,i,r,o)}function Mc(n){const e=Y(n);if(e.ue===null){let t=e.path.canonicalString();e.collectionGroup!==null&&(t+="|cg:"+e.collectionGroup),t+="|f:",t+=e.filters.map(s=>Wl(s)).join(","),t+="|ob:",t+=e.orderBy.map(s=>function(r){return r.field.canonicalString()+r.dir}(s)).join(","),wr(e.limit)||(t+="|l:",t+=e.limit),e.startAt&&(t+="|lb:",t+=e.startAt.inclusive?"b:":"a:",t+=e.startAt.position.map(s=>$s(s)).join(",")),e.endAt&&(t+="|ub:",t+=e.endAt.inclusive?"a:":"b:",t+=e.endAt.position.map(s=>$s(s)).join(",")),e.ue=t}return e.ue}function Lc(n,e){if(n.limit!==e.limit||n.orderBy.length!==e.orderBy.length)return!1;for(let t=0;t<n.orderBy.length;t++)if(!pT(n.orderBy[t],e.orderBy[t]))return!1;if(n.filters.length!==e.filters.length)return!1;for(let t=0;t<n.filters.length;t++)if(!sp(n.filters[t],e.filters[t]))return!1;return n.collectionGroup===e.collectionGroup&&!!n.path.isEqual(e.path)&&!!Sd(n.startAt,e.startAt)&&Sd(n.endAt,e.endAt)}function ql(n){return $.isDocumentKey(n.path)&&n.collectionGroup===null&&n.filters.length===0}/**
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
 */class Tr{constructor(e,t=null,s=[],i=[],r=null,o="F",l=null,c=null){this.path=e,this.collectionGroup=t,this.explicitOrderBy=s,this.filters=i,this.limit=r,this.limitType=o,this.startAt=l,this.endAt=c,this.ce=null,this.le=null,this.he=null,this.startAt,this.endAt}}function CT(n,e,t,s,i,r,o,l){return new Tr(n,e,t,s,i,r,o,l)}function Oc(n){return new Tr(n)}function kd(n){return n.filters.length===0&&n.limit===null&&n.startAt==null&&n.endAt==null&&(n.explicitOrderBy.length===0||n.explicitOrderBy.length===1&&n.explicitOrderBy[0].field.isKeyField())}function op(n){return n.collectionGroup!==null}function Ui(n){const e=Y(n);if(e.ce===null){e.ce=[];const t=new Set;for(const r of e.explicitOrderBy)e.ce.push(r),t.add(r.field.canonicalString());const s=e.explicitOrderBy.length>0?e.explicitOrderBy[e.explicitOrderBy.length-1].dir:"asc";(function(o){let l=new Ge(He.comparator);return o.filters.forEach(c=>{c.getFlattenedFilters().forEach(h=>{h.isInequality()&&(l=l.add(h.field))})}),l})(e).forEach(r=>{t.has(r.canonicalString())||r.isKeyField()||e.ce.push(new Lo(r,s))}),t.has(He.keyField().canonicalString())||e.ce.push(new Lo(He.keyField(),s))}return e.ce}function Ft(n){const e=Y(n);return e.le||(e.le=RT(e,Ui(n))),e.le}function RT(n,e){if(n.limitType==="F")return Ad(n.path,n.collectionGroup,e,n.filters,n.limit,n.startAt,n.endAt);{e=e.map(i=>{const r=i.dir==="desc"?"asc":"desc";return new Lo(i.field,r)});const t=n.endAt?new Mo(n.endAt.position,n.endAt.inclusive):null,s=n.startAt?new Mo(n.startAt.position,n.startAt.inclusive):null;return Ad(n.path,n.collectionGroup,e,n.filters,n.limit,t,s)}}function zl(n,e){const t=n.filters.concat([e]);return new Tr(n.path,n.collectionGroup,n.explicitOrderBy.slice(),t,n.limit,n.limitType,n.startAt,n.endAt)}function Oo(n,e,t){return new Tr(n.path,n.collectionGroup,n.explicitOrderBy.slice(),n.filters.slice(),e,t,n.startAt,n.endAt)}function _a(n,e){return Lc(Ft(n),Ft(e))&&n.limitType===e.limitType}function ap(n){return`${Mc(Ft(n))}|lt:${n.limitType}`}function Cs(n){return`Query(target=${function(t){let s=t.path.canonicalString();return t.collectionGroup!==null&&(s+=" collectionGroup="+t.collectionGroup),t.filters.length>0&&(s+=`, filters: [${t.filters.map(i=>ip(i)).join(", ")}]`),wr(t.limit)||(s+=", limit: "+t.limit),t.orderBy.length>0&&(s+=`, orderBy: [${t.orderBy.map(i=>function(o){return`${o.field.canonicalString()} (${o.dir})`}(i)).join(", ")}]`),t.startAt&&(s+=", startAt: ",s+=t.startAt.inclusive?"b:":"a:",s+=t.startAt.position.map(i=>$s(i)).join(",")),t.endAt&&(s+=", endAt: ",s+=t.endAt.inclusive?"a:":"b:",s+=t.endAt.position.map(i=>$s(i)).join(",")),`Target(${s})`}(Ft(n))}; limitType=${n.limitType})`}function ya(n,e){return e.isFoundDocument()&&function(s,i){const r=i.key.path;return s.collectionGroup!==null?i.key.hasCollectionId(s.collectionGroup)&&s.path.isPrefixOf(r):$.isDocumentKey(s.path)?s.path.isEqual(r):s.path.isImmediateParentOf(r)}(n,e)&&function(s,i){for(const r of Ui(s))if(!r.field.isKeyField()&&i.data.field(r.field)===null)return!1;return!0}(n,e)&&function(s,i){for(const r of s.filters)if(!r.matches(i))return!1;return!0}(n,e)&&function(s,i){return!(s.startAt&&!function(o,l,c){const h=Rd(o,l,c);return o.inclusive?h<=0:h<0}(s.startAt,Ui(s),i)||s.endAt&&!function(o,l,c){const h=Rd(o,l,c);return o.inclusive?h>=0:h>0}(s.endAt,Ui(s),i))}(n,e)}function ST(n){return n.collectionGroup||(n.path.length%2==1?n.path.lastSegment():n.path.get(n.path.length-2))}function lp(n){return(e,t)=>{let s=!1;for(const i of Ui(n)){const r=AT(i,e,t);if(r!==0)return r;s=s||i.field.isKeyField()}return 0}}function AT(n,e,t){const s=n.field.isKeyField()?$.comparator(e.key,t.key):function(r,o,l){const c=o.data.field(r),h=l.data.field(r);return c!==null&&h!==null?js(c,h):z()}(n.field,e,t);switch(n.dir){case"asc":return s;case"desc":return-1*s;default:return z()}}/**
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
 */class ni{constructor(e,t){this.mapKeyFn=e,this.equalsFn=t,this.inner={},this.innerSize=0}get(e){const t=this.mapKeyFn(e),s=this.inner[t];if(s!==void 0){for(const[i,r]of s)if(this.equalsFn(i,e))return r}}has(e){return this.get(e)!==void 0}set(e,t){const s=this.mapKeyFn(e),i=this.inner[s];if(i===void 0)return this.inner[s]=[[e,t]],void this.innerSize++;for(let r=0;r<i.length;r++)if(this.equalsFn(i[r][0],e))return void(i[r]=[e,t]);i.push([e,t]),this.innerSize++}delete(e){const t=this.mapKeyFn(e),s=this.inner[t];if(s===void 0)return!1;for(let i=0;i<s.length;i++)if(this.equalsFn(s[i][0],e))return s.length===1?delete this.inner[t]:s.splice(i,1),this.innerSize--,!0;return!1}forEach(e){fs(this.inner,(t,s)=>{for(const[i,r]of s)e(i,r)})}isEmpty(){return Xm(this.inner)}size(){return this.innerSize}}/**
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
 */const kT=new Me($.comparator);function an(){return kT}const cp=new Me($.comparator);function Oi(...n){let e=cp;for(const t of n)e=e.insert(t.key,t);return e}function hp(n){let e=cp;return n.forEach((t,s)=>e=e.insert(t,s.overlayedDocument)),e}function Xn(){return ji()}function up(){return ji()}function ji(){return new ni(n=>n.toString(),(n,e)=>n.isEqual(e))}const PT=new Me($.comparator),NT=new Ge($.comparator);function ne(...n){let e=NT;for(const t of n)e=e.add(t);return e}const DT=new Ge(ce);function xT(){return DT}/**
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
 */function Vc(n,e){if(n.useProto3Json){if(isNaN(e))return{doubleValue:"NaN"};if(e===1/0)return{doubleValue:"Infinity"};if(e===-1/0)return{doubleValue:"-Infinity"}}return{doubleValue:xo(e)?"-0":e}}function dp(n){return{integerValue:""+n}}function MT(n,e){return hT(e)?dp(e):Vc(n,e)}/**
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
 */class va{constructor(){this._=void 0}}function LT(n,e,t){return n instanceof Vo?function(i,r){const o={fields:{__type__:{stringValue:"server_timestamp"},__local_write_time__:{timestampValue:{seconds:i.seconds,nanos:i.nanoseconds}}}};return r&&Nc(r)&&(r=Dc(r)),r&&(o.fields.__previous_value__=r),{mapValue:o}}(t,e):n instanceof rr?mp(n,e):n instanceof or?pp(n,e):function(i,r){const o=fp(i,r),l=Pd(o)+Pd(i.Pe);return $l(o)&&$l(i.Pe)?dp(l):Vc(i.serializer,l)}(n,e)}function OT(n,e,t){return n instanceof rr?mp(n,e):n instanceof or?pp(n,e):t}function fp(n,e){return n instanceof Fo?function(s){return $l(s)||function(r){return!!r&&"doubleValue"in r}(s)}(e)?e:{integerValue:0}:null}class Vo extends va{}class rr extends va{constructor(e){super(),this.elements=e}}function mp(n,e){const t=gp(e);for(const s of n.elements)t.some(i=>Ut(i,s))||t.push(s);return{arrayValue:{values:t}}}class or extends va{constructor(e){super(),this.elements=e}}function pp(n,e){let t=gp(e);for(const s of n.elements)t=t.filter(i=>!Ut(i,s));return{arrayValue:{values:t}}}class Fo extends va{constructor(e,t){super(),this.serializer=e,this.Pe=t}}function Pd(n){return Pe(n.integerValue||n.doubleValue)}function gp(n){return xc(n)&&n.arrayValue.values?n.arrayValue.values.slice():[]}function VT(n,e){return n.field.isEqual(e.field)&&function(s,i){return s instanceof rr&&i instanceof rr||s instanceof or&&i instanceof or?Us(s.elements,i.elements,Ut):s instanceof Fo&&i instanceof Fo?Ut(s.Pe,i.Pe):s instanceof Vo&&i instanceof Vo}(n.transform,e.transform)}class FT{constructor(e,t){this.version=e,this.transformResults=t}}class ut{constructor(e,t){this.updateTime=e,this.exists=t}static none(){return new ut}static exists(e){return new ut(void 0,e)}static updateTime(e){return new ut(e)}get isNone(){return this.updateTime===void 0&&this.exists===void 0}isEqual(e){return this.exists===e.exists&&(this.updateTime?!!e.updateTime&&this.updateTime.isEqual(e.updateTime):!e.updateTime)}}function _o(n,e){return n.updateTime!==void 0?e.isFoundDocument()&&e.version.isEqual(n.updateTime):n.exists===void 0||n.exists===e.isFoundDocument()}class Ea{}function _p(n,e){if(!n.hasLocalMutations||e&&e.fields.length===0)return null;if(e===null)return n.isNoDocument()?new Fc(n.key,ut.none()):new Ir(n.key,n.data,ut.none());{const t=n.data,s=ht.empty();let i=new Ge(He.comparator);for(let r of e.fields)if(!i.has(r)){let o=t.field(r);o===null&&r.length>1&&(r=r.popLast(),o=t.field(r)),o===null?s.delete(r):s.set(r,o),i=i.add(r)}return new Bn(n.key,s,new Et(i.toArray()),ut.none())}}function BT(n,e,t){n instanceof Ir?function(i,r,o){const l=i.value.clone(),c=Dd(i.fieldTransforms,r,o.transformResults);l.setAll(c),r.convertToFoundDocument(o.version,l).setHasCommittedMutations()}(n,e,t):n instanceof Bn?function(i,r,o){if(!_o(i.precondition,r))return void r.convertToUnknownDocument(o.version);const l=Dd(i.fieldTransforms,r,o.transformResults),c=r.data;c.setAll(yp(i)),c.setAll(l),r.convertToFoundDocument(o.version,c).setHasCommittedMutations()}(n,e,t):function(i,r,o){r.convertToNoDocument(o.version).setHasCommittedMutations()}(0,e,t)}function $i(n,e,t,s){return n instanceof Ir?function(r,o,l,c){if(!_o(r.precondition,o))return l;const h=r.value.clone(),d=xd(r.fieldTransforms,c,o);return h.setAll(d),o.convertToFoundDocument(o.version,h).setHasLocalMutations(),null}(n,e,t,s):n instanceof Bn?function(r,o,l,c){if(!_o(r.precondition,o))return l;const h=xd(r.fieldTransforms,c,o),d=o.data;return d.setAll(yp(r)),d.setAll(h),o.convertToFoundDocument(o.version,d).setHasLocalMutations(),l===null?null:l.unionWith(r.fieldMask.fields).unionWith(r.fieldTransforms.map(m=>m.field))}(n,e,t,s):function(r,o,l){return _o(r.precondition,o)?(o.convertToNoDocument(o.version).setHasLocalMutations(),null):l}(n,e,t)}function UT(n,e){let t=null;for(const s of n.fieldTransforms){const i=e.data.field(s.field),r=fp(s.transform,i||null);r!=null&&(t===null&&(t=ht.empty()),t.set(s.field,r))}return t||null}function Nd(n,e){return n.type===e.type&&!!n.key.isEqual(e.key)&&!!n.precondition.isEqual(e.precondition)&&!!function(s,i){return s===void 0&&i===void 0||!(!s||!i)&&Us(s,i,(r,o)=>VT(r,o))}(n.fieldTransforms,e.fieldTransforms)&&(n.type===0?n.value.isEqual(e.value):n.type!==1||n.data.isEqual(e.data)&&n.fieldMask.isEqual(e.fieldMask))}class Ir extends Ea{constructor(e,t,s,i=[]){super(),this.key=e,this.value=t,this.precondition=s,this.fieldTransforms=i,this.type=0}getFieldMask(){return null}}class Bn extends Ea{constructor(e,t,s,i,r=[]){super(),this.key=e,this.data=t,this.fieldMask=s,this.precondition=i,this.fieldTransforms=r,this.type=1}getFieldMask(){return this.fieldMask}}function yp(n){const e=new Map;return n.fieldMask.fields.forEach(t=>{if(!t.isEmpty()){const s=n.data.field(t);e.set(t,s)}}),e}function Dd(n,e,t){const s=new Map;oe(n.length===t.length);for(let i=0;i<t.length;i++){const r=n[i],o=r.transform,l=e.data.field(r.field);s.set(r.field,OT(o,l,t[i]))}return s}function xd(n,e,t){const s=new Map;for(const i of n){const r=i.transform,o=t.data.field(i.field);s.set(i.field,LT(r,o,e))}return s}class Fc extends Ea{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=2,this.fieldTransforms=[]}getFieldMask(){return null}}class vp extends Ea{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=3,this.fieldTransforms=[]}getFieldMask(){return null}}/**
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
 */class jT{constructor(e,t,s,i){this.batchId=e,this.localWriteTime=t,this.baseMutations=s,this.mutations=i}applyToRemoteDocument(e,t){const s=t.mutationResults;for(let i=0;i<this.mutations.length;i++){const r=this.mutations[i];r.key.isEqual(e.key)&&BT(r,e,s[i])}}applyToLocalView(e,t){for(const s of this.baseMutations)s.key.isEqual(e.key)&&(t=$i(s,e,t,this.localWriteTime));for(const s of this.mutations)s.key.isEqual(e.key)&&(t=$i(s,e,t,this.localWriteTime));return t}applyToLocalDocumentSet(e,t){const s=up();return this.mutations.forEach(i=>{const r=e.get(i.key),o=r.overlayedDocument;let l=this.applyToLocalView(o,r.mutatedFields);l=t.has(i.key)?null:l;const c=_p(o,l);c!==null&&s.set(i.key,c),o.isValidDocument()||o.convertToNoDocument(K.min())}),s}keys(){return this.mutations.reduce((e,t)=>e.add(t.key),ne())}isEqual(e){return this.batchId===e.batchId&&Us(this.mutations,e.mutations,(t,s)=>Nd(t,s))&&Us(this.baseMutations,e.baseMutations,(t,s)=>Nd(t,s))}}class Bc{constructor(e,t,s,i){this.batch=e,this.commitVersion=t,this.mutationResults=s,this.docVersions=i}static from(e,t,s){oe(e.mutations.length===s.length);let i=function(){return PT}();const r=e.mutations;for(let o=0;o<r.length;o++)i=i.insert(r[o].key,s[o].version);return new Bc(e,t,s,i)}}/**
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
 */class $T{constructor(e,t){this.largestBatchId=e,this.mutation=t}getKey(){return this.mutation.key}isEqual(e){return e!==null&&this.mutation===e.mutation}toString(){return`Overlay{
      largestBatchId: ${this.largestBatchId},
      mutation: ${this.mutation.toString()}
    }`}}/**
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
 */class WT{constructor(e,t){this.count=e,this.unchangedNames=t}}/**
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
 */var De,re;function Ep(n){switch(n){default:return z();case k.CANCELLED:case k.UNKNOWN:case k.DEADLINE_EXCEEDED:case k.RESOURCE_EXHAUSTED:case k.INTERNAL:case k.UNAVAILABLE:case k.UNAUTHENTICATED:return!1;case k.INVALID_ARGUMENT:case k.NOT_FOUND:case k.ALREADY_EXISTS:case k.PERMISSION_DENIED:case k.FAILED_PRECONDITION:case k.ABORTED:case k.OUT_OF_RANGE:case k.UNIMPLEMENTED:case k.DATA_LOSS:return!0}}function wp(n){if(n===void 0)return on("GRPC error has no .code"),k.UNKNOWN;switch(n){case De.OK:return k.OK;case De.CANCELLED:return k.CANCELLED;case De.UNKNOWN:return k.UNKNOWN;case De.DEADLINE_EXCEEDED:return k.DEADLINE_EXCEEDED;case De.RESOURCE_EXHAUSTED:return k.RESOURCE_EXHAUSTED;case De.INTERNAL:return k.INTERNAL;case De.UNAVAILABLE:return k.UNAVAILABLE;case De.UNAUTHENTICATED:return k.UNAUTHENTICATED;case De.INVALID_ARGUMENT:return k.INVALID_ARGUMENT;case De.NOT_FOUND:return k.NOT_FOUND;case De.ALREADY_EXISTS:return k.ALREADY_EXISTS;case De.PERMISSION_DENIED:return k.PERMISSION_DENIED;case De.FAILED_PRECONDITION:return k.FAILED_PRECONDITION;case De.ABORTED:return k.ABORTED;case De.OUT_OF_RANGE:return k.OUT_OF_RANGE;case De.UNIMPLEMENTED:return k.UNIMPLEMENTED;case De.DATA_LOSS:return k.DATA_LOSS;default:return z()}}(re=De||(De={}))[re.OK=0]="OK",re[re.CANCELLED=1]="CANCELLED",re[re.UNKNOWN=2]="UNKNOWN",re[re.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",re[re.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",re[re.NOT_FOUND=5]="NOT_FOUND",re[re.ALREADY_EXISTS=6]="ALREADY_EXISTS",re[re.PERMISSION_DENIED=7]="PERMISSION_DENIED",re[re.UNAUTHENTICATED=16]="UNAUTHENTICATED",re[re.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",re[re.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",re[re.ABORTED=10]="ABORTED",re[re.OUT_OF_RANGE=11]="OUT_OF_RANGE",re[re.UNIMPLEMENTED=12]="UNIMPLEMENTED",re[re.INTERNAL=13]="INTERNAL",re[re.UNAVAILABLE=14]="UNAVAILABLE",re[re.DATA_LOSS=15]="DATA_LOSS";/**
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
 */function qT(){return new TextEncoder}/**
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
 */const zT=new ts([4294967295,4294967295],0);function Md(n){const e=qT().encode(n),t=new Wm;return t.update(e),new Uint8Array(t.digest())}function Ld(n){const e=new DataView(n.buffer),t=e.getUint32(0,!0),s=e.getUint32(4,!0),i=e.getUint32(8,!0),r=e.getUint32(12,!0);return[new ts([t,s],0),new ts([i,r],0)]}class Uc{constructor(e,t,s){if(this.bitmap=e,this.padding=t,this.hashCount=s,t<0||t>=8)throw new Vi(`Invalid padding: ${t}`);if(s<0)throw new Vi(`Invalid hash count: ${s}`);if(e.length>0&&this.hashCount===0)throw new Vi(`Invalid hash count: ${s}`);if(e.length===0&&t!==0)throw new Vi(`Invalid padding when bitmap length is 0: ${t}`);this.Ie=8*e.length-t,this.Te=ts.fromNumber(this.Ie)}Ee(e,t,s){let i=e.add(t.multiply(ts.fromNumber(s)));return i.compare(zT)===1&&(i=new ts([i.getBits(0),i.getBits(1)],0)),i.modulo(this.Te).toNumber()}de(e){return(this.bitmap[Math.floor(e/8)]&1<<e%8)!=0}mightContain(e){if(this.Ie===0)return!1;const t=Md(e),[s,i]=Ld(t);for(let r=0;r<this.hashCount;r++){const o=this.Ee(s,i,r);if(!this.de(o))return!1}return!0}static create(e,t,s){const i=e%8==0?0:8-e%8,r=new Uint8Array(Math.ceil(e/8)),o=new Uc(r,i,t);return s.forEach(l=>o.insert(l)),o}insert(e){if(this.Ie===0)return;const t=Md(e),[s,i]=Ld(t);for(let r=0;r<this.hashCount;r++){const o=this.Ee(s,i,r);this.Ae(o)}}Ae(e){const t=Math.floor(e/8),s=e%8;this.bitmap[t]|=1<<s}}class Vi extends Error{constructor(){super(...arguments),this.name="BloomFilterError"}}/**
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
 */class wa{constructor(e,t,s,i,r){this.snapshotVersion=e,this.targetChanges=t,this.targetMismatches=s,this.documentUpdates=i,this.resolvedLimboDocuments=r}static createSynthesizedRemoteEventForCurrentChange(e,t,s){const i=new Map;return i.set(e,br.createSynthesizedTargetChangeForCurrentChange(e,t,s)),new wa(K.min(),i,new Me(ce),an(),ne())}}class br{constructor(e,t,s,i,r){this.resumeToken=e,this.current=t,this.addedDocuments=s,this.modifiedDocuments=i,this.removedDocuments=r}static createSynthesizedTargetChangeForCurrentChange(e,t,s){return new br(s,t,ne(),ne(),ne())}}/**
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
 */class yo{constructor(e,t,s,i){this.Re=e,this.removedTargetIds=t,this.key=s,this.Ve=i}}class Tp{constructor(e,t){this.targetId=e,this.me=t}}class Ip{constructor(e,t,s=Ke.EMPTY_BYTE_STRING,i=null){this.state=e,this.targetIds=t,this.resumeToken=s,this.cause=i}}class Od{constructor(){this.fe=0,this.ge=Fd(),this.pe=Ke.EMPTY_BYTE_STRING,this.ye=!1,this.we=!0}get current(){return this.ye}get resumeToken(){return this.pe}get Se(){return this.fe!==0}get be(){return this.we}De(e){e.approximateByteSize()>0&&(this.we=!0,this.pe=e)}ve(){let e=ne(),t=ne(),s=ne();return this.ge.forEach((i,r)=>{switch(r){case 0:e=e.add(i);break;case 2:t=t.add(i);break;case 1:s=s.add(i);break;default:z()}}),new br(this.pe,this.ye,e,t,s)}Ce(){this.we=!1,this.ge=Fd()}Fe(e,t){this.we=!0,this.ge=this.ge.insert(e,t)}Me(e){this.we=!0,this.ge=this.ge.remove(e)}xe(){this.fe+=1}Oe(){this.fe-=1,oe(this.fe>=0)}Ne(){this.we=!0,this.ye=!0}}class HT{constructor(e){this.Le=e,this.Be=new Map,this.ke=an(),this.qe=Vd(),this.Qe=new Me(ce)}Ke(e){for(const t of e.Re)e.Ve&&e.Ve.isFoundDocument()?this.$e(t,e.Ve):this.Ue(t,e.key,e.Ve);for(const t of e.removedTargetIds)this.Ue(t,e.key,e.Ve)}We(e){this.forEachTarget(e,t=>{const s=this.Ge(t);switch(e.state){case 0:this.ze(t)&&s.De(e.resumeToken);break;case 1:s.Oe(),s.Se||s.Ce(),s.De(e.resumeToken);break;case 2:s.Oe(),s.Se||this.removeTarget(t);break;case 3:this.ze(t)&&(s.Ne(),s.De(e.resumeToken));break;case 4:this.ze(t)&&(this.je(t),s.De(e.resumeToken));break;default:z()}})}forEachTarget(e,t){e.targetIds.length>0?e.targetIds.forEach(t):this.Be.forEach((s,i)=>{this.ze(i)&&t(i)})}He(e){const t=e.targetId,s=e.me.count,i=this.Je(t);if(i){const r=i.target;if(ql(r))if(s===0){const o=new $(r.path);this.Ue(t,o,je.newNoDocument(o,K.min()))}else oe(s===1);else{const o=this.Ye(t);if(o!==s){const l=this.Ze(e),c=l?this.Xe(l,e,o):1;if(c!==0){this.je(t);const h=c===2?"TargetPurposeExistenceFilterMismatchBloom":"TargetPurposeExistenceFilterMismatch";this.Qe=this.Qe.insert(t,h)}}}}}Ze(e){const t=e.me.unchangedNames;if(!t||!t.bits)return null;const{bits:{bitmap:s="",padding:i=0},hashCount:r=0}=t;let o,l;try{o=os(s).toUint8Array()}catch(c){if(c instanceof Jm)return Bs("Decoding the base64 bloom filter in existence filter failed ("+c.message+"); ignoring the bloom filter and falling back to full re-query."),null;throw c}try{l=new Uc(o,i,r)}catch(c){return Bs(c instanceof Vi?"BloomFilter error: ":"Applying bloom filter failed: ",c),null}return l.Ie===0?null:l}Xe(e,t,s){return t.me.count===s-this.nt(e,t.targetId)?0:2}nt(e,t){const s=this.Le.getRemoteKeysForTarget(t);let i=0;return s.forEach(r=>{const o=this.Le.tt(),l=`projects/${o.projectId}/databases/${o.database}/documents/${r.path.canonicalString()}`;e.mightContain(l)||(this.Ue(t,r,null),i++)}),i}rt(e){const t=new Map;this.Be.forEach((r,o)=>{const l=this.Je(o);if(l){if(r.current&&ql(l.target)){const c=new $(l.target.path);this.ke.get(c)!==null||this.it(o,c)||this.Ue(o,c,je.newNoDocument(c,e))}r.be&&(t.set(o,r.ve()),r.Ce())}});let s=ne();this.qe.forEach((r,o)=>{let l=!0;o.forEachWhile(c=>{const h=this.Je(c);return!h||h.purpose==="TargetPurposeLimboResolution"||(l=!1,!1)}),l&&(s=s.add(r))}),this.ke.forEach((r,o)=>o.setReadTime(e));const i=new wa(e,t,this.Qe,this.ke,s);return this.ke=an(),this.qe=Vd(),this.Qe=new Me(ce),i}$e(e,t){if(!this.ze(e))return;const s=this.it(e,t.key)?2:0;this.Ge(e).Fe(t.key,s),this.ke=this.ke.insert(t.key,t),this.qe=this.qe.insert(t.key,this.st(t.key).add(e))}Ue(e,t,s){if(!this.ze(e))return;const i=this.Ge(e);this.it(e,t)?i.Fe(t,1):i.Me(t),this.qe=this.qe.insert(t,this.st(t).delete(e)),s&&(this.ke=this.ke.insert(t,s))}removeTarget(e){this.Be.delete(e)}Ye(e){const t=this.Ge(e).ve();return this.Le.getRemoteKeysForTarget(e).size+t.addedDocuments.size-t.removedDocuments.size}xe(e){this.Ge(e).xe()}Ge(e){let t=this.Be.get(e);return t||(t=new Od,this.Be.set(e,t)),t}st(e){let t=this.qe.get(e);return t||(t=new Ge(ce),this.qe=this.qe.insert(e,t)),t}ze(e){const t=this.Je(e)!==null;return t||B("WatchChangeAggregator","Detected inactive target",e),t}Je(e){const t=this.Be.get(e);return t&&t.Se?null:this.Le.ot(e)}je(e){this.Be.set(e,new Od),this.Le.getRemoteKeysForTarget(e).forEach(t=>{this.Ue(e,t,null)})}it(e,t){return this.Le.getRemoteKeysForTarget(e).has(t)}}function Vd(){return new Me($.comparator)}function Fd(){return new Me($.comparator)}const GT={asc:"ASCENDING",desc:"DESCENDING"},KT={"<":"LESS_THAN","<=":"LESS_THAN_OR_EQUAL",">":"GREATER_THAN",">=":"GREATER_THAN_OR_EQUAL","==":"EQUAL","!=":"NOT_EQUAL","array-contains":"ARRAY_CONTAINS",in:"IN","not-in":"NOT_IN","array-contains-any":"ARRAY_CONTAINS_ANY"},QT={and:"AND",or:"OR"};class YT{constructor(e,t){this.databaseId=e,this.useProto3Json=t}}function Hl(n,e){return n.useProto3Json||wr(e)?e:{value:e}}function Bo(n,e){return n.useProto3Json?`${new Date(1e3*e.seconds).toISOString().replace(/\.\d*/,"").replace("Z","")}.${("000000000"+e.nanoseconds).slice(-9)}Z`:{seconds:""+e.seconds,nanos:e.nanoseconds}}function bp(n,e){return n.useProto3Json?e.toBase64():e.toUint8Array()}function XT(n,e){return Bo(n,e.toTimestamp())}function wt(n){return oe(!!n),K.fromTimestamp(function(t){const s=Dn(t);return new Ve(s.seconds,s.nanos)}(n))}function jc(n,e){return Gl(n,e).canonicalString()}function Gl(n,e){const t=function(i){return new ye(["projects",i.projectId,"databases",i.database])}(n).child("documents");return e===void 0?t:t.child(e)}function Cp(n){const e=ye.fromString(n);return oe(Np(e)),e}function Uo(n,e){return jc(n.databaseId,e.path)}function Wi(n,e){const t=Cp(e);if(t.get(1)!==n.databaseId.projectId)throw new V(k.INVALID_ARGUMENT,"Tried to deserialize key from different project: "+t.get(1)+" vs "+n.databaseId.projectId);if(t.get(3)!==n.databaseId.database)throw new V(k.INVALID_ARGUMENT,"Tried to deserialize key from different database: "+t.get(3)+" vs "+n.databaseId.database);return new $(Sp(t))}function Rp(n,e){return jc(n.databaseId,e)}function JT(n){const e=Cp(n);return e.length===4?ye.emptyPath():Sp(e)}function Kl(n){return new ye(["projects",n.databaseId.projectId,"databases",n.databaseId.database]).canonicalString()}function Sp(n){return oe(n.length>4&&n.get(4)==="documents"),n.popFirst(5)}function Bd(n,e,t){return{name:Uo(n,e),fields:t.value.mapValue.fields}}function ZT(n,e){return"found"in e?function(s,i){oe(!!i.found),i.found.name,i.found.updateTime;const r=Wi(s,i.found.name),o=wt(i.found.updateTime),l=i.found.createTime?wt(i.found.createTime):K.min(),c=new ht({mapValue:{fields:i.found.fields}});return je.newFoundDocument(r,o,l,c)}(n,e):"missing"in e?function(s,i){oe(!!i.missing),oe(!!i.readTime);const r=Wi(s,i.missing),o=wt(i.readTime);return je.newNoDocument(r,o)}(n,e):z()}function eI(n,e){let t;if("targetChange"in e){e.targetChange;const s=function(h){return h==="NO_CHANGE"?0:h==="ADD"?1:h==="REMOVE"?2:h==="CURRENT"?3:h==="RESET"?4:z()}(e.targetChange.targetChangeType||"NO_CHANGE"),i=e.targetChange.targetIds||[],r=function(h,d){return h.useProto3Json?(oe(d===void 0||typeof d=="string"),Ke.fromBase64String(d||"")):(oe(d===void 0||d instanceof Buffer||d instanceof Uint8Array),Ke.fromUint8Array(d||new Uint8Array))}(n,e.targetChange.resumeToken),o=e.targetChange.cause,l=o&&function(h){const d=h.code===void 0?k.UNKNOWN:wp(h.code);return new V(d,h.message||"")}(o);t=new Ip(s,i,r,l||null)}else if("documentChange"in e){e.documentChange;const s=e.documentChange;s.document,s.document.name,s.document.updateTime;const i=Wi(n,s.document.name),r=wt(s.document.updateTime),o=s.document.createTime?wt(s.document.createTime):K.min(),l=new ht({mapValue:{fields:s.document.fields}}),c=je.newFoundDocument(i,r,o,l),h=s.targetIds||[],d=s.removedTargetIds||[];t=new yo(h,d,c.key,c)}else if("documentDelete"in e){e.documentDelete;const s=e.documentDelete;s.document;const i=Wi(n,s.document),r=s.readTime?wt(s.readTime):K.min(),o=je.newNoDocument(i,r),l=s.removedTargetIds||[];t=new yo([],l,o.key,o)}else if("documentRemove"in e){e.documentRemove;const s=e.documentRemove;s.document;const i=Wi(n,s.document),r=s.removedTargetIds||[];t=new yo([],r,i,null)}else{if(!("filter"in e))return z();{e.filter;const s=e.filter;s.targetId;const{count:i=0,unchangedNames:r}=s,o=new WT(i,r),l=s.targetId;t=new Tp(l,o)}}return t}function Ap(n,e){let t;if(e instanceof Ir)t={update:Bd(n,e.key,e.value)};else if(e instanceof Fc)t={delete:Uo(n,e.key)};else if(e instanceof Bn)t={update:Bd(n,e.key,e.data),updateMask:cI(e.fieldMask)};else{if(!(e instanceof vp))return z();t={verify:Uo(n,e.key)}}return e.fieldTransforms.length>0&&(t.updateTransforms=e.fieldTransforms.map(s=>function(r,o){const l=o.transform;if(l instanceof Vo)return{fieldPath:o.field.canonicalString(),setToServerValue:"REQUEST_TIME"};if(l instanceof rr)return{fieldPath:o.field.canonicalString(),appendMissingElements:{values:l.elements}};if(l instanceof or)return{fieldPath:o.field.canonicalString(),removeAllFromArray:{values:l.elements}};if(l instanceof Fo)return{fieldPath:o.field.canonicalString(),increment:l.Pe};throw z()}(0,s))),e.precondition.isNone||(t.currentDocument=function(i,r){return r.updateTime!==void 0?{updateTime:XT(i,r.updateTime)}:r.exists!==void 0?{exists:r.exists}:z()}(n,e.precondition)),t}function tI(n,e){return n&&n.length>0?(oe(e!==void 0),n.map(t=>function(i,r){let o=i.updateTime?wt(i.updateTime):wt(r);return o.isEqual(K.min())&&(o=wt(r)),new FT(o,i.transformResults||[])}(t,e))):[]}function nI(n,e){return{documents:[Rp(n,e.path)]}}function sI(n,e){const t={structuredQuery:{}},s=e.path;let i;e.collectionGroup!==null?(i=s,t.structuredQuery.from=[{collectionId:e.collectionGroup,allDescendants:!0}]):(i=s.popLast(),t.structuredQuery.from=[{collectionId:s.lastSegment()}]),t.parent=Rp(n,i);const r=function(h){if(h.length!==0)return Pp(Dt.create(h,"and"))}(e.filters);r&&(t.structuredQuery.where=r);const o=function(h){if(h.length!==0)return h.map(d=>function(p){return{field:Rs(p.field),direction:oI(p.dir)}}(d))}(e.orderBy);o&&(t.structuredQuery.orderBy=o);const l=Hl(n,e.limit);return l!==null&&(t.structuredQuery.limit=l),e.startAt&&(t.structuredQuery.startAt=function(h){return{before:h.inclusive,values:h.position}}(e.startAt)),e.endAt&&(t.structuredQuery.endAt=function(h){return{before:!h.inclusive,values:h.position}}(e.endAt)),{_t:t,parent:i}}function iI(n){let e=JT(n.parent);const t=n.structuredQuery,s=t.from?t.from.length:0;let i=null;if(s>0){oe(s===1);const d=t.from[0];d.allDescendants?i=d.collectionId:e=e.child(d.collectionId)}let r=[];t.where&&(r=function(m){const p=kp(m);return p instanceof Dt&&np(p)?p.getFilters():[p]}(t.where));let o=[];t.orderBy&&(o=function(m){return m.map(p=>function(b){return new Lo(Ss(b.field),function(P){switch(P){case"ASCENDING":return"asc";case"DESCENDING":return"desc";default:return}}(b.direction))}(p))}(t.orderBy));let l=null;t.limit&&(l=function(m){let p;return p=typeof m=="object"?m.value:m,wr(p)?null:p}(t.limit));let c=null;t.startAt&&(c=function(m){const p=!!m.before,E=m.values||[];return new Mo(E,p)}(t.startAt));let h=null;return t.endAt&&(h=function(m){const p=!m.before,E=m.values||[];return new Mo(E,p)}(t.endAt)),CT(e,i,o,r,l,"F",c,h)}function rI(n,e){const t=function(i){switch(i){case"TargetPurposeListen":return null;case"TargetPurposeExistenceFilterMismatch":return"existence-filter-mismatch";case"TargetPurposeExistenceFilterMismatchBloom":return"existence-filter-mismatch-bloom";case"TargetPurposeLimboResolution":return"limbo-document";default:return z()}}(e.purpose);return t==null?null:{"goog-listen-tags":t}}function kp(n){return n.unaryFilter!==void 0?function(t){switch(t.unaryFilter.op){case"IS_NAN":const s=Ss(t.unaryFilter.field);return xe.create(s,"==",{doubleValue:NaN});case"IS_NULL":const i=Ss(t.unaryFilter.field);return xe.create(i,"==",{nullValue:"NULL_VALUE"});case"IS_NOT_NAN":const r=Ss(t.unaryFilter.field);return xe.create(r,"!=",{doubleValue:NaN});case"IS_NOT_NULL":const o=Ss(t.unaryFilter.field);return xe.create(o,"!=",{nullValue:"NULL_VALUE"});default:return z()}}(n):n.fieldFilter!==void 0?function(t){return xe.create(Ss(t.fieldFilter.field),function(i){switch(i){case"EQUAL":return"==";case"NOT_EQUAL":return"!=";case"GREATER_THAN":return">";case"GREATER_THAN_OR_EQUAL":return">=";case"LESS_THAN":return"<";case"LESS_THAN_OR_EQUAL":return"<=";case"ARRAY_CONTAINS":return"array-contains";case"IN":return"in";case"NOT_IN":return"not-in";case"ARRAY_CONTAINS_ANY":return"array-contains-any";default:return z()}}(t.fieldFilter.op),t.fieldFilter.value)}(n):n.compositeFilter!==void 0?function(t){return Dt.create(t.compositeFilter.filters.map(s=>kp(s)),function(i){switch(i){case"AND":return"and";case"OR":return"or";default:return z()}}(t.compositeFilter.op))}(n):z()}function oI(n){return GT[n]}function aI(n){return KT[n]}function lI(n){return QT[n]}function Rs(n){return{fieldPath:n.canonicalString()}}function Ss(n){return He.fromServerFormat(n.fieldPath)}function Pp(n){return n instanceof xe?function(t){if(t.op==="=="){if(Cd(t.value))return{unaryFilter:{field:Rs(t.field),op:"IS_NAN"}};if(bd(t.value))return{unaryFilter:{field:Rs(t.field),op:"IS_NULL"}}}else if(t.op==="!="){if(Cd(t.value))return{unaryFilter:{field:Rs(t.field),op:"IS_NOT_NAN"}};if(bd(t.value))return{unaryFilter:{field:Rs(t.field),op:"IS_NOT_NULL"}}}return{fieldFilter:{field:Rs(t.field),op:aI(t.op),value:t.value}}}(n):n instanceof Dt?function(t){const s=t.getFilters().map(i=>Pp(i));return s.length===1?s[0]:{compositeFilter:{op:lI(t.op),filters:s}}}(n):z()}function cI(n){const e=[];return n.fields.forEach(t=>e.push(t.canonicalString())),{fieldPaths:e}}function Np(n){return n.length>=4&&n.get(0)==="projects"&&n.get(2)==="databases"}/**
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
 */class wn{constructor(e,t,s,i,r=K.min(),o=K.min(),l=Ke.EMPTY_BYTE_STRING,c=null){this.target=e,this.targetId=t,this.purpose=s,this.sequenceNumber=i,this.snapshotVersion=r,this.lastLimboFreeSnapshotVersion=o,this.resumeToken=l,this.expectedCount=c}withSequenceNumber(e){return new wn(this.target,this.targetId,this.purpose,e,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,this.expectedCount)}withResumeToken(e,t){return new wn(this.target,this.targetId,this.purpose,this.sequenceNumber,t,this.lastLimboFreeSnapshotVersion,e,null)}withExpectedCount(e){return new wn(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,e)}withLastLimboFreeSnapshotVersion(e){return new wn(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,e,this.resumeToken,this.expectedCount)}}/**
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
 */class hI{constructor(e){this.ct=e}}function uI(n){const e=iI({parent:n.parent,structuredQuery:n.structuredQuery});return n.limitType==="LAST"?Oo(e,e.limit,"L"):e}/**
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
 */class dI{constructor(){this.un=new fI}addToCollectionParentIndex(e,t){return this.un.add(t),N.resolve()}getCollectionParents(e,t){return N.resolve(this.un.getEntries(t))}addFieldIndex(e,t){return N.resolve()}deleteFieldIndex(e,t){return N.resolve()}deleteAllFieldIndexes(e){return N.resolve()}createTargetIndexes(e,t){return N.resolve()}getDocumentsMatchingTarget(e,t){return N.resolve(null)}getIndexType(e,t){return N.resolve(0)}getFieldIndexes(e,t){return N.resolve([])}getNextCollectionGroupToUpdate(e){return N.resolve(null)}getMinOffset(e,t){return N.resolve(Nn.min())}getMinOffsetFromCollectionGroup(e,t){return N.resolve(Nn.min())}updateCollectionGroup(e,t,s){return N.resolve()}updateIndexEntries(e,t){return N.resolve()}}class fI{constructor(){this.index={}}add(e){const t=e.lastSegment(),s=e.popLast(),i=this.index[t]||new Ge(ye.comparator),r=!i.has(s);return this.index[t]=i.add(s),r}has(e){const t=e.lastSegment(),s=e.popLast(),i=this.index[t];return i&&i.has(s)}getEntries(e){return(this.index[e]||new Ge(ye.comparator)).toArray()}}/**
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
 */class Ws{constructor(e){this.Ln=e}next(){return this.Ln+=2,this.Ln}static Bn(){return new Ws(0)}static kn(){return new Ws(-1)}}/**
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
 */class mI{constructor(){this.changes=new ni(e=>e.toString(),(e,t)=>e.isEqual(t)),this.changesApplied=!1}addEntry(e){this.assertNotApplied(),this.changes.set(e.key,e)}removeEntry(e,t){this.assertNotApplied(),this.changes.set(e,je.newInvalidDocument(e).setReadTime(t))}getEntry(e,t){this.assertNotApplied();const s=this.changes.get(t);return s!==void 0?N.resolve(s):this.getFromCache(e,t)}getEntries(e,t){return this.getAllFromCache(e,t)}apply(e){return this.assertNotApplied(),this.changesApplied=!0,this.applyChanges(e)}assertNotApplied(){}}/**
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
 *//**
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
 */class pI{constructor(e,t){this.overlayedDocument=e,this.mutatedFields=t}}/**
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
 */class gI{constructor(e,t,s,i){this.remoteDocumentCache=e,this.mutationQueue=t,this.documentOverlayCache=s,this.indexManager=i}getDocument(e,t){let s=null;return this.documentOverlayCache.getOverlay(e,t).next(i=>(s=i,this.remoteDocumentCache.getEntry(e,t))).next(i=>(s!==null&&$i(s.mutation,i,Et.empty(),Ve.now()),i))}getDocuments(e,t){return this.remoteDocumentCache.getEntries(e,t).next(s=>this.getLocalViewOfDocuments(e,s,ne()).next(()=>s))}getLocalViewOfDocuments(e,t,s=ne()){const i=Xn();return this.populateOverlays(e,i,t).next(()=>this.computeViews(e,t,i,s).next(r=>{let o=Oi();return r.forEach((l,c)=>{o=o.insert(l,c.overlayedDocument)}),o}))}getOverlayedDocuments(e,t){const s=Xn();return this.populateOverlays(e,s,t).next(()=>this.computeViews(e,t,s,ne()))}populateOverlays(e,t,s){const i=[];return s.forEach(r=>{t.has(r)||i.push(r)}),this.documentOverlayCache.getOverlays(e,i).next(r=>{r.forEach((o,l)=>{t.set(o,l)})})}computeViews(e,t,s,i){let r=an();const o=ji(),l=function(){return ji()}();return t.forEach((c,h)=>{const d=s.get(h.key);i.has(h.key)&&(d===void 0||d.mutation instanceof Bn)?r=r.insert(h.key,h):d!==void 0?(o.set(h.key,d.mutation.getFieldMask()),$i(d.mutation,h,d.mutation.getFieldMask(),Ve.now())):o.set(h.key,Et.empty())}),this.recalculateAndSaveOverlays(e,r).next(c=>(c.forEach((h,d)=>o.set(h,d)),t.forEach((h,d)=>{var m;return l.set(h,new pI(d,(m=o.get(h))!==null&&m!==void 0?m:null))}),l))}recalculateAndSaveOverlays(e,t){const s=ji();let i=new Me((o,l)=>o-l),r=ne();return this.mutationQueue.getAllMutationBatchesAffectingDocumentKeys(e,t).next(o=>{for(const l of o)l.keys().forEach(c=>{const h=t.get(c);if(h===null)return;let d=s.get(c)||Et.empty();d=l.applyToLocalView(h,d),s.set(c,d);const m=(i.get(l.batchId)||ne()).add(c);i=i.insert(l.batchId,m)})}).next(()=>{const o=[],l=i.getReverseIterator();for(;l.hasNext();){const c=l.getNext(),h=c.key,d=c.value,m=up();d.forEach(p=>{if(!r.has(p)){const E=_p(t.get(p),s.get(p));E!==null&&m.set(p,E),r=r.add(p)}}),o.push(this.documentOverlayCache.saveOverlays(e,h,m))}return N.waitFor(o)}).next(()=>s)}recalculateAndSaveOverlaysForDocumentKeys(e,t){return this.remoteDocumentCache.getEntries(e,t).next(s=>this.recalculateAndSaveOverlays(e,s))}getDocumentsMatchingQuery(e,t,s,i){return function(o){return $.isDocumentKey(o.path)&&o.collectionGroup===null&&o.filters.length===0}(t)?this.getDocumentsMatchingDocumentQuery(e,t.path):op(t)?this.getDocumentsMatchingCollectionGroupQuery(e,t,s,i):this.getDocumentsMatchingCollectionQuery(e,t,s,i)}getNextDocuments(e,t,s,i){return this.remoteDocumentCache.getAllFromCollectionGroup(e,t,s,i).next(r=>{const o=i-r.size>0?this.documentOverlayCache.getOverlaysForCollectionGroup(e,t,s.largestBatchId,i-r.size):N.resolve(Xn());let l=-1,c=r;return o.next(h=>N.forEach(h,(d,m)=>(l<m.largestBatchId&&(l=m.largestBatchId),r.get(d)?N.resolve():this.remoteDocumentCache.getEntry(e,d).next(p=>{c=c.insert(d,p)}))).next(()=>this.populateOverlays(e,h,r)).next(()=>this.computeViews(e,c,h,ne())).next(d=>({batchId:l,changes:hp(d)})))})}getDocumentsMatchingDocumentQuery(e,t){return this.getDocument(e,new $(t)).next(s=>{let i=Oi();return s.isFoundDocument()&&(i=i.insert(s.key,s)),i})}getDocumentsMatchingCollectionGroupQuery(e,t,s,i){const r=t.collectionGroup;let o=Oi();return this.indexManager.getCollectionParents(e,r).next(l=>N.forEach(l,c=>{const h=function(m,p){return new Tr(p,null,m.explicitOrderBy.slice(),m.filters.slice(),m.limit,m.limitType,m.startAt,m.endAt)}(t,c.child(r));return this.getDocumentsMatchingCollectionQuery(e,h,s,i).next(d=>{d.forEach((m,p)=>{o=o.insert(m,p)})})}).next(()=>o))}getDocumentsMatchingCollectionQuery(e,t,s,i){let r;return this.documentOverlayCache.getOverlaysForCollection(e,t.path,s.largestBatchId).next(o=>(r=o,this.remoteDocumentCache.getDocumentsMatchingQuery(e,t,s,r,i))).next(o=>{r.forEach((c,h)=>{const d=h.getKey();o.get(d)===null&&(o=o.insert(d,je.newInvalidDocument(d)))});let l=Oi();return o.forEach((c,h)=>{const d=r.get(c);d!==void 0&&$i(d.mutation,h,Et.empty(),Ve.now()),ya(t,h)&&(l=l.insert(c,h))}),l})}}/**
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
 */class _I{constructor(e){this.serializer=e,this.hr=new Map,this.Pr=new Map}getBundleMetadata(e,t){return N.resolve(this.hr.get(t))}saveBundleMetadata(e,t){return this.hr.set(t.id,function(i){return{id:i.id,version:i.version,createTime:wt(i.createTime)}}(t)),N.resolve()}getNamedQuery(e,t){return N.resolve(this.Pr.get(t))}saveNamedQuery(e,t){return this.Pr.set(t.name,function(i){return{name:i.name,query:uI(i.bundledQuery),readTime:wt(i.readTime)}}(t)),N.resolve()}}/**
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
 */class yI{constructor(){this.overlays=new Me($.comparator),this.Ir=new Map}getOverlay(e,t){return N.resolve(this.overlays.get(t))}getOverlays(e,t){const s=Xn();return N.forEach(t,i=>this.getOverlay(e,i).next(r=>{r!==null&&s.set(i,r)})).next(()=>s)}saveOverlays(e,t,s){return s.forEach((i,r)=>{this.ht(e,t,r)}),N.resolve()}removeOverlaysForBatchId(e,t,s){const i=this.Ir.get(s);return i!==void 0&&(i.forEach(r=>this.overlays=this.overlays.remove(r)),this.Ir.delete(s)),N.resolve()}getOverlaysForCollection(e,t,s){const i=Xn(),r=t.length+1,o=new $(t.child("")),l=this.overlays.getIteratorFrom(o);for(;l.hasNext();){const c=l.getNext().value,h=c.getKey();if(!t.isPrefixOf(h.path))break;h.path.length===r&&c.largestBatchId>s&&i.set(c.getKey(),c)}return N.resolve(i)}getOverlaysForCollectionGroup(e,t,s,i){let r=new Me((h,d)=>h-d);const o=this.overlays.getIterator();for(;o.hasNext();){const h=o.getNext().value;if(h.getKey().getCollectionGroup()===t&&h.largestBatchId>s){let d=r.get(h.largestBatchId);d===null&&(d=Xn(),r=r.insert(h.largestBatchId,d)),d.set(h.getKey(),h)}}const l=Xn(),c=r.getIterator();for(;c.hasNext()&&(c.getNext().value.forEach((h,d)=>l.set(h,d)),!(l.size()>=i)););return N.resolve(l)}ht(e,t,s){const i=this.overlays.get(s.key);if(i!==null){const o=this.Ir.get(i.largestBatchId).delete(s.key);this.Ir.set(i.largestBatchId,o)}this.overlays=this.overlays.insert(s.key,new $T(t,s));let r=this.Ir.get(t);r===void 0&&(r=ne(),this.Ir.set(t,r)),this.Ir.set(t,r.add(s.key))}}/**
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
 */class vI{constructor(){this.sessionToken=Ke.EMPTY_BYTE_STRING}getSessionToken(e){return N.resolve(this.sessionToken)}setSessionToken(e,t){return this.sessionToken=t,N.resolve()}}/**
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
 */class $c{constructor(){this.Tr=new Ge(Be.Er),this.dr=new Ge(Be.Ar)}isEmpty(){return this.Tr.isEmpty()}addReference(e,t){const s=new Be(e,t);this.Tr=this.Tr.add(s),this.dr=this.dr.add(s)}Rr(e,t){e.forEach(s=>this.addReference(s,t))}removeReference(e,t){this.Vr(new Be(e,t))}mr(e,t){e.forEach(s=>this.removeReference(s,t))}gr(e){const t=new $(new ye([])),s=new Be(t,e),i=new Be(t,e+1),r=[];return this.dr.forEachInRange([s,i],o=>{this.Vr(o),r.push(o.key)}),r}pr(){this.Tr.forEach(e=>this.Vr(e))}Vr(e){this.Tr=this.Tr.delete(e),this.dr=this.dr.delete(e)}yr(e){const t=new $(new ye([])),s=new Be(t,e),i=new Be(t,e+1);let r=ne();return this.dr.forEachInRange([s,i],o=>{r=r.add(o.key)}),r}containsKey(e){const t=new Be(e,0),s=this.Tr.firstAfterOrEqual(t);return s!==null&&e.isEqual(s.key)}}class Be{constructor(e,t){this.key=e,this.wr=t}static Er(e,t){return $.comparator(e.key,t.key)||ce(e.wr,t.wr)}static Ar(e,t){return ce(e.wr,t.wr)||$.comparator(e.key,t.key)}}/**
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
 */class EI{constructor(e,t){this.indexManager=e,this.referenceDelegate=t,this.mutationQueue=[],this.Sr=1,this.br=new Ge(Be.Er)}checkEmpty(e){return N.resolve(this.mutationQueue.length===0)}addMutationBatch(e,t,s,i){const r=this.Sr;this.Sr++,this.mutationQueue.length>0&&this.mutationQueue[this.mutationQueue.length-1];const o=new jT(r,t,s,i);this.mutationQueue.push(o);for(const l of i)this.br=this.br.add(new Be(l.key,r)),this.indexManager.addToCollectionParentIndex(e,l.key.path.popLast());return N.resolve(o)}lookupMutationBatch(e,t){return N.resolve(this.Dr(t))}getNextMutationBatchAfterBatchId(e,t){const s=t+1,i=this.vr(s),r=i<0?0:i;return N.resolve(this.mutationQueue.length>r?this.mutationQueue[r]:null)}getHighestUnacknowledgedBatchId(){return N.resolve(this.mutationQueue.length===0?-1:this.Sr-1)}getAllMutationBatches(e){return N.resolve(this.mutationQueue.slice())}getAllMutationBatchesAffectingDocumentKey(e,t){const s=new Be(t,0),i=new Be(t,Number.POSITIVE_INFINITY),r=[];return this.br.forEachInRange([s,i],o=>{const l=this.Dr(o.wr);r.push(l)}),N.resolve(r)}getAllMutationBatchesAffectingDocumentKeys(e,t){let s=new Ge(ce);return t.forEach(i=>{const r=new Be(i,0),o=new Be(i,Number.POSITIVE_INFINITY);this.br.forEachInRange([r,o],l=>{s=s.add(l.wr)})}),N.resolve(this.Cr(s))}getAllMutationBatchesAffectingQuery(e,t){const s=t.path,i=s.length+1;let r=s;$.isDocumentKey(r)||(r=r.child(""));const o=new Be(new $(r),0);let l=new Ge(ce);return this.br.forEachWhile(c=>{const h=c.key.path;return!!s.isPrefixOf(h)&&(h.length===i&&(l=l.add(c.wr)),!0)},o),N.resolve(this.Cr(l))}Cr(e){const t=[];return e.forEach(s=>{const i=this.Dr(s);i!==null&&t.push(i)}),t}removeMutationBatch(e,t){oe(this.Fr(t.batchId,"removed")===0),this.mutationQueue.shift();let s=this.br;return N.forEach(t.mutations,i=>{const r=new Be(i.key,t.batchId);return s=s.delete(r),this.referenceDelegate.markPotentiallyOrphaned(e,i.key)}).next(()=>{this.br=s})}On(e){}containsKey(e,t){const s=new Be(t,0),i=this.br.firstAfterOrEqual(s);return N.resolve(t.isEqual(i&&i.key))}performConsistencyCheck(e){return this.mutationQueue.length,N.resolve()}Fr(e,t){return this.vr(e)}vr(e){return this.mutationQueue.length===0?0:e-this.mutationQueue[0].batchId}Dr(e){const t=this.vr(e);return t<0||t>=this.mutationQueue.length?null:this.mutationQueue[t]}}/**
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
 */class wI{constructor(e){this.Mr=e,this.docs=function(){return new Me($.comparator)}(),this.size=0}setIndexManager(e){this.indexManager=e}addEntry(e,t){const s=t.key,i=this.docs.get(s),r=i?i.size:0,o=this.Mr(t);return this.docs=this.docs.insert(s,{document:t.mutableCopy(),size:o}),this.size+=o-r,this.indexManager.addToCollectionParentIndex(e,s.path.popLast())}removeEntry(e){const t=this.docs.get(e);t&&(this.docs=this.docs.remove(e),this.size-=t.size)}getEntry(e,t){const s=this.docs.get(t);return N.resolve(s?s.document.mutableCopy():je.newInvalidDocument(t))}getEntries(e,t){let s=an();return t.forEach(i=>{const r=this.docs.get(i);s=s.insert(i,r?r.document.mutableCopy():je.newInvalidDocument(i))}),N.resolve(s)}getDocumentsMatchingQuery(e,t,s,i){let r=an();const o=t.path,l=new $(o.child("")),c=this.docs.getIteratorFrom(l);for(;c.hasNext();){const{key:h,value:{document:d}}=c.getNext();if(!o.isPrefixOf(h.path))break;h.path.length>o.length+1||oT(rT(d),s)<=0||(i.has(d.key)||ya(t,d))&&(r=r.insert(d.key,d.mutableCopy()))}return N.resolve(r)}getAllFromCollectionGroup(e,t,s,i){z()}Or(e,t){return N.forEach(this.docs,s=>t(s))}newChangeBuffer(e){return new TI(this)}getSize(e){return N.resolve(this.size)}}class TI extends mI{constructor(e){super(),this.cr=e}applyChanges(e){const t=[];return this.changes.forEach((s,i)=>{i.isValidDocument()?t.push(this.cr.addEntry(e,i)):this.cr.removeEntry(s)}),N.waitFor(t)}getFromCache(e,t){return this.cr.getEntry(e,t)}getAllFromCache(e,t){return this.cr.getEntries(e,t)}}/**
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
 */class II{constructor(e){this.persistence=e,this.Nr=new ni(t=>Mc(t),Lc),this.lastRemoteSnapshotVersion=K.min(),this.highestTargetId=0,this.Lr=0,this.Br=new $c,this.targetCount=0,this.kr=Ws.Bn()}forEachTarget(e,t){return this.Nr.forEach((s,i)=>t(i)),N.resolve()}getLastRemoteSnapshotVersion(e){return N.resolve(this.lastRemoteSnapshotVersion)}getHighestSequenceNumber(e){return N.resolve(this.Lr)}allocateTargetId(e){return this.highestTargetId=this.kr.next(),N.resolve(this.highestTargetId)}setTargetsMetadata(e,t,s){return s&&(this.lastRemoteSnapshotVersion=s),t>this.Lr&&(this.Lr=t),N.resolve()}Kn(e){this.Nr.set(e.target,e);const t=e.targetId;t>this.highestTargetId&&(this.kr=new Ws(t),this.highestTargetId=t),e.sequenceNumber>this.Lr&&(this.Lr=e.sequenceNumber)}addTargetData(e,t){return this.Kn(t),this.targetCount+=1,N.resolve()}updateTargetData(e,t){return this.Kn(t),N.resolve()}removeTargetData(e,t){return this.Nr.delete(t.target),this.Br.gr(t.targetId),this.targetCount-=1,N.resolve()}removeTargets(e,t,s){let i=0;const r=[];return this.Nr.forEach((o,l)=>{l.sequenceNumber<=t&&s.get(l.targetId)===null&&(this.Nr.delete(o),r.push(this.removeMatchingKeysForTargetId(e,l.targetId)),i++)}),N.waitFor(r).next(()=>i)}getTargetCount(e){return N.resolve(this.targetCount)}getTargetData(e,t){const s=this.Nr.get(t)||null;return N.resolve(s)}addMatchingKeys(e,t,s){return this.Br.Rr(t,s),N.resolve()}removeMatchingKeys(e,t,s){this.Br.mr(t,s);const i=this.persistence.referenceDelegate,r=[];return i&&t.forEach(o=>{r.push(i.markPotentiallyOrphaned(e,o))}),N.waitFor(r)}removeMatchingKeysForTargetId(e,t){return this.Br.gr(t),N.resolve()}getMatchingKeysForTargetId(e,t){const s=this.Br.yr(t);return N.resolve(s)}containsKey(e,t){return N.resolve(this.Br.containsKey(t))}}/**
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
 */class bI{constructor(e,t){this.qr={},this.overlays={},this.Qr=new Pc(0),this.Kr=!1,this.Kr=!0,this.$r=new vI,this.referenceDelegate=e(this),this.Ur=new II(this),this.indexManager=new dI,this.remoteDocumentCache=function(i){return new wI(i)}(s=>this.referenceDelegate.Wr(s)),this.serializer=new hI(t),this.Gr=new _I(this.serializer)}start(){return Promise.resolve()}shutdown(){return this.Kr=!1,Promise.resolve()}get started(){return this.Kr}setDatabaseDeletedListener(){}setNetworkEnabled(){}getIndexManager(e){return this.indexManager}getDocumentOverlayCache(e){let t=this.overlays[e.toKey()];return t||(t=new yI,this.overlays[e.toKey()]=t),t}getMutationQueue(e,t){let s=this.qr[e.toKey()];return s||(s=new EI(t,this.referenceDelegate),this.qr[e.toKey()]=s),s}getGlobalsCache(){return this.$r}getTargetCache(){return this.Ur}getRemoteDocumentCache(){return this.remoteDocumentCache}getBundleCache(){return this.Gr}runTransaction(e,t,s){B("MemoryPersistence","Starting transaction:",e);const i=new CI(this.Qr.next());return this.referenceDelegate.zr(),s(i).next(r=>this.referenceDelegate.jr(i).next(()=>r)).toPromise().then(r=>(i.raiseOnCommittedEvent(),r))}Hr(e,t){return N.or(Object.values(this.qr).map(s=>()=>s.containsKey(e,t)))}}class CI extends lT{constructor(e){super(),this.currentSequenceNumber=e}}class Wc{constructor(e){this.persistence=e,this.Jr=new $c,this.Yr=null}static Zr(e){return new Wc(e)}get Xr(){if(this.Yr)return this.Yr;throw z()}addReference(e,t,s){return this.Jr.addReference(s,t),this.Xr.delete(s.toString()),N.resolve()}removeReference(e,t,s){return this.Jr.removeReference(s,t),this.Xr.add(s.toString()),N.resolve()}markPotentiallyOrphaned(e,t){return this.Xr.add(t.toString()),N.resolve()}removeTarget(e,t){this.Jr.gr(t.targetId).forEach(i=>this.Xr.add(i.toString()));const s=this.persistence.getTargetCache();return s.getMatchingKeysForTargetId(e,t.targetId).next(i=>{i.forEach(r=>this.Xr.add(r.toString()))}).next(()=>s.removeTargetData(e,t))}zr(){this.Yr=new Set}jr(e){const t=this.persistence.getRemoteDocumentCache().newChangeBuffer();return N.forEach(this.Xr,s=>{const i=$.fromPath(s);return this.ei(e,i).next(r=>{r||t.removeEntry(i,K.min())})}).next(()=>(this.Yr=null,t.apply(e)))}updateLimboDocument(e,t){return this.ei(e,t).next(s=>{s?this.Xr.delete(t.toString()):this.Xr.add(t.toString())})}Wr(e){return 0}ei(e,t){return N.or([()=>N.resolve(this.Jr.containsKey(t)),()=>this.persistence.getTargetCache().containsKey(e,t),()=>this.persistence.Hr(e,t)])}}/**
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
 */class qc{constructor(e,t,s,i){this.targetId=e,this.fromCache=t,this.$i=s,this.Ui=i}static Wi(e,t){let s=ne(),i=ne();for(const r of t.docChanges)switch(r.type){case 0:s=s.add(r.doc.key);break;case 1:i=i.add(r.doc.key)}return new qc(e,t.fromCache,s,i)}}/**
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
 */class RI{constructor(){this._documentReadCount=0}get documentReadCount(){return this._documentReadCount}incrementDocumentReadCount(e){this._documentReadCount+=e}}/**
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
 */class SI{constructor(){this.Gi=!1,this.zi=!1,this.ji=100,this.Hi=function(){return Ay()?8:cT(st())>0?6:4}()}initialize(e,t){this.Ji=e,this.indexManager=t,this.Gi=!0}getDocumentsMatchingQuery(e,t,s,i){const r={result:null};return this.Yi(e,t).next(o=>{r.result=o}).next(()=>{if(!r.result)return this.Zi(e,t,i,s).next(o=>{r.result=o})}).next(()=>{if(r.result)return;const o=new RI;return this.Xi(e,t,o).next(l=>{if(r.result=l,this.zi)return this.es(e,t,o,l.size)})}).next(()=>r.result)}es(e,t,s,i){return s.documentReadCount<this.ji?(ki()<=te.DEBUG&&B("QueryEngine","SDK will not create cache indexes for query:",Cs(t),"since it only creates cache indexes for collection contains","more than or equal to",this.ji,"documents"),N.resolve()):(ki()<=te.DEBUG&&B("QueryEngine","Query:",Cs(t),"scans",s.documentReadCount,"local documents and returns",i,"documents as results."),s.documentReadCount>this.Hi*i?(ki()<=te.DEBUG&&B("QueryEngine","The SDK decides to create cache indexes for query:",Cs(t),"as using cache indexes may help improve performance."),this.indexManager.createTargetIndexes(e,Ft(t))):N.resolve())}Yi(e,t){if(kd(t))return N.resolve(null);let s=Ft(t);return this.indexManager.getIndexType(e,s).next(i=>i===0?null:(t.limit!==null&&i===1&&(t=Oo(t,null,"F"),s=Ft(t)),this.indexManager.getDocumentsMatchingTarget(e,s).next(r=>{const o=ne(...r);return this.Ji.getDocuments(e,o).next(l=>this.indexManager.getMinOffset(e,s).next(c=>{const h=this.ts(t,l);return this.ns(t,h,o,c.readTime)?this.Yi(e,Oo(t,null,"F")):this.rs(e,h,t,c)}))})))}Zi(e,t,s,i){return kd(t)||i.isEqual(K.min())?N.resolve(null):this.Ji.getDocuments(e,s).next(r=>{const o=this.ts(t,r);return this.ns(t,o,s,i)?N.resolve(null):(ki()<=te.DEBUG&&B("QueryEngine","Re-using previous result from %s to execute query: %s",i.toString(),Cs(t)),this.rs(e,o,t,iT(i,-1)).next(l=>l))})}ts(e,t){let s=new Ge(lp(e));return t.forEach((i,r)=>{ya(e,r)&&(s=s.add(r))}),s}ns(e,t,s,i){if(e.limit===null)return!1;if(s.size!==t.size)return!0;const r=e.limitType==="F"?t.last():t.first();return!!r&&(r.hasPendingWrites||r.version.compareTo(i)>0)}Xi(e,t,s){return ki()<=te.DEBUG&&B("QueryEngine","Using full collection scan to execute query:",Cs(t)),this.Ji.getDocumentsMatchingQuery(e,t,Nn.min(),s)}rs(e,t,s,i){return this.Ji.getDocumentsMatchingQuery(e,s,i).next(r=>(t.forEach(o=>{r=r.insert(o.key,o)}),r))}}/**
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
 */class AI{constructor(e,t,s,i){this.persistence=e,this.ss=t,this.serializer=i,this.os=new Me(ce),this._s=new ni(r=>Mc(r),Lc),this.us=new Map,this.cs=e.getRemoteDocumentCache(),this.Ur=e.getTargetCache(),this.Gr=e.getBundleCache(),this.ls(s)}ls(e){this.documentOverlayCache=this.persistence.getDocumentOverlayCache(e),this.indexManager=this.persistence.getIndexManager(e),this.mutationQueue=this.persistence.getMutationQueue(e,this.indexManager),this.localDocuments=new gI(this.cs,this.mutationQueue,this.documentOverlayCache,this.indexManager),this.cs.setIndexManager(this.indexManager),this.ss.initialize(this.localDocuments,this.indexManager)}collectGarbage(e){return this.persistence.runTransaction("Collect garbage","readwrite-primary",t=>e.collect(t,this.os))}}function kI(n,e,t,s){return new AI(n,e,t,s)}async function Dp(n,e){const t=Y(n);return await t.persistence.runTransaction("Handle user change","readonly",s=>{let i;return t.mutationQueue.getAllMutationBatches(s).next(r=>(i=r,t.ls(e),t.mutationQueue.getAllMutationBatches(s))).next(r=>{const o=[],l=[];let c=ne();for(const h of i){o.push(h.batchId);for(const d of h.mutations)c=c.add(d.key)}for(const h of r){l.push(h.batchId);for(const d of h.mutations)c=c.add(d.key)}return t.localDocuments.getDocuments(s,c).next(h=>({hs:h,removedBatchIds:o,addedBatchIds:l}))})})}function PI(n,e){const t=Y(n);return t.persistence.runTransaction("Acknowledge batch","readwrite-primary",s=>{const i=e.batch.keys(),r=t.cs.newChangeBuffer({trackRemovals:!0});return function(l,c,h,d){const m=h.batch,p=m.keys();let E=N.resolve();return p.forEach(b=>{E=E.next(()=>d.getEntry(c,b)).next(S=>{const P=h.docVersions.get(b);oe(P!==null),S.version.compareTo(P)<0&&(m.applyToRemoteDocument(S,h),S.isValidDocument()&&(S.setReadTime(h.commitVersion),d.addEntry(S)))})}),E.next(()=>l.mutationQueue.removeMutationBatch(c,m))}(t,s,e,r).next(()=>r.apply(s)).next(()=>t.mutationQueue.performConsistencyCheck(s)).next(()=>t.documentOverlayCache.removeOverlaysForBatchId(s,i,e.batch.batchId)).next(()=>t.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(s,function(l){let c=ne();for(let h=0;h<l.mutationResults.length;++h)l.mutationResults[h].transformResults.length>0&&(c=c.add(l.batch.mutations[h].key));return c}(e))).next(()=>t.localDocuments.getDocuments(s,i))})}function xp(n){const e=Y(n);return e.persistence.runTransaction("Get last remote snapshot version","readonly",t=>e.Ur.getLastRemoteSnapshotVersion(t))}function NI(n,e){const t=Y(n),s=e.snapshotVersion;let i=t.os;return t.persistence.runTransaction("Apply remote event","readwrite-primary",r=>{const o=t.cs.newChangeBuffer({trackRemovals:!0});i=t.os;const l=[];e.targetChanges.forEach((d,m)=>{const p=i.get(m);if(!p)return;l.push(t.Ur.removeMatchingKeys(r,d.removedDocuments,m).next(()=>t.Ur.addMatchingKeys(r,d.addedDocuments,m)));let E=p.withSequenceNumber(r.currentSequenceNumber);e.targetMismatches.get(m)!==null?E=E.withResumeToken(Ke.EMPTY_BYTE_STRING,K.min()).withLastLimboFreeSnapshotVersion(K.min()):d.resumeToken.approximateByteSize()>0&&(E=E.withResumeToken(d.resumeToken,s)),i=i.insert(m,E),function(S,P,F){return S.resumeToken.approximateByteSize()===0||P.snapshotVersion.toMicroseconds()-S.snapshotVersion.toMicroseconds()>=3e8?!0:F.addedDocuments.size+F.modifiedDocuments.size+F.removedDocuments.size>0}(p,E,d)&&l.push(t.Ur.updateTargetData(r,E))});let c=an(),h=ne();if(e.documentUpdates.forEach(d=>{e.resolvedLimboDocuments.has(d)&&l.push(t.persistence.referenceDelegate.updateLimboDocument(r,d))}),l.push(DI(r,o,e.documentUpdates).next(d=>{c=d.Ps,h=d.Is})),!s.isEqual(K.min())){const d=t.Ur.getLastRemoteSnapshotVersion(r).next(m=>t.Ur.setTargetsMetadata(r,r.currentSequenceNumber,s));l.push(d)}return N.waitFor(l).next(()=>o.apply(r)).next(()=>t.localDocuments.getLocalViewOfDocuments(r,c,h)).next(()=>c)}).then(r=>(t.os=i,r))}function DI(n,e,t){let s=ne(),i=ne();return t.forEach(r=>s=s.add(r)),e.getEntries(n,s).next(r=>{let o=an();return t.forEach((l,c)=>{const h=r.get(l);c.isFoundDocument()!==h.isFoundDocument()&&(i=i.add(l)),c.isNoDocument()&&c.version.isEqual(K.min())?(e.removeEntry(l,c.readTime),o=o.insert(l,c)):!h.isValidDocument()||c.version.compareTo(h.version)>0||c.version.compareTo(h.version)===0&&h.hasPendingWrites?(e.addEntry(c),o=o.insert(l,c)):B("LocalStore","Ignoring outdated watch update for ",l,". Current version:",h.version," Watch version:",c.version)}),{Ps:o,Is:i}})}function xI(n,e){const t=Y(n);return t.persistence.runTransaction("Get next mutation batch","readonly",s=>(e===void 0&&(e=-1),t.mutationQueue.getNextMutationBatchAfterBatchId(s,e)))}function MI(n,e){const t=Y(n);return t.persistence.runTransaction("Allocate target","readwrite",s=>{let i;return t.Ur.getTargetData(s,e).next(r=>r?(i=r,N.resolve(i)):t.Ur.allocateTargetId(s).next(o=>(i=new wn(e,o,"TargetPurposeListen",s.currentSequenceNumber),t.Ur.addTargetData(s,i).next(()=>i))))}).then(s=>{const i=t.os.get(s.targetId);return(i===null||s.snapshotVersion.compareTo(i.snapshotVersion)>0)&&(t.os=t.os.insert(s.targetId,s),t._s.set(e,s.targetId)),s})}async function Ql(n,e,t){const s=Y(n),i=s.os.get(e),r=t?"readwrite":"readwrite-primary";try{t||await s.persistence.runTransaction("Release target",r,o=>s.persistence.referenceDelegate.removeTarget(o,i))}catch(o){if(!Er(o))throw o;B("LocalStore",`Failed to update sequence numbers for target ${e}: ${o}`)}s.os=s.os.remove(e),s._s.delete(i.target)}function Ud(n,e,t){const s=Y(n);let i=K.min(),r=ne();return s.persistence.runTransaction("Execute query","readwrite",o=>function(c,h,d){const m=Y(c),p=m._s.get(d);return p!==void 0?N.resolve(m.os.get(p)):m.Ur.getTargetData(h,d)}(s,o,Ft(e)).next(l=>{if(l)return i=l.lastLimboFreeSnapshotVersion,s.Ur.getMatchingKeysForTargetId(o,l.targetId).next(c=>{r=c})}).next(()=>s.ss.getDocumentsMatchingQuery(o,e,t?i:K.min(),t?r:ne())).next(l=>(LI(s,ST(e),l),{documents:l,Ts:r})))}function LI(n,e,t){let s=n.us.get(e)||K.min();t.forEach((i,r)=>{r.readTime.compareTo(s)>0&&(s=r.readTime)}),n.us.set(e,s)}class jd{constructor(){this.activeTargetIds=xT()}fs(e){this.activeTargetIds=this.activeTargetIds.add(e)}gs(e){this.activeTargetIds=this.activeTargetIds.delete(e)}Vs(){const e={activeTargetIds:this.activeTargetIds.toArray(),updateTimeMs:Date.now()};return JSON.stringify(e)}}class OI{constructor(){this.so=new jd,this.oo={},this.onlineStateHandler=null,this.sequenceNumberHandler=null}addPendingMutation(e){}updateMutationState(e,t,s){}addLocalQueryTarget(e,t=!0){return t&&this.so.fs(e),this.oo[e]||"not-current"}updateQueryState(e,t,s){this.oo[e]=t}removeLocalQueryTarget(e){this.so.gs(e)}isLocalQueryTarget(e){return this.so.activeTargetIds.has(e)}clearQueryState(e){delete this.oo[e]}getAllActiveQueryTargets(){return this.so.activeTargetIds}isActiveQueryTarget(e){return this.so.activeTargetIds.has(e)}start(){return this.so=new jd,Promise.resolve()}handleUserChange(e,t,s){}setOnlineState(e){}shutdown(){}writeSequenceNumber(e){}notifyBundleLoaded(e){}}/**
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
 */class VI{_o(e){}shutdown(){}}/**
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
 */class $d{constructor(){this.ao=()=>this.uo(),this.co=()=>this.lo(),this.ho=[],this.Po()}_o(e){this.ho.push(e)}shutdown(){window.removeEventListener("online",this.ao),window.removeEventListener("offline",this.co)}Po(){window.addEventListener("online",this.ao),window.addEventListener("offline",this.co)}uo(){B("ConnectivityMonitor","Network connectivity changed: AVAILABLE");for(const e of this.ho)e(0)}lo(){B("ConnectivityMonitor","Network connectivity changed: UNAVAILABLE");for(const e of this.ho)e(1)}static D(){return typeof window<"u"&&window.addEventListener!==void 0&&window.removeEventListener!==void 0}}/**
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
 */let oo=null;function _l(){return oo===null?oo=function(){return 268435456+Math.round(2147483648*Math.random())}():oo++,"0x"+oo.toString(16)}/**
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
 */const FI={BatchGetDocuments:"batchGet",Commit:"commit",RunQuery:"runQuery",RunAggregationQuery:"runAggregationQuery"};/**
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
 */class BI{constructor(e){this.Io=e.Io,this.To=e.To}Eo(e){this.Ao=e}Ro(e){this.Vo=e}mo(e){this.fo=e}onMessage(e){this.po=e}close(){this.To()}send(e){this.Io(e)}yo(){this.Ao()}wo(){this.Vo()}So(e){this.fo(e)}bo(e){this.po(e)}}/**
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
 */const Je="WebChannelConnection";class UI extends class{constructor(t){this.databaseInfo=t,this.databaseId=t.databaseId;const s=t.ssl?"https":"http",i=encodeURIComponent(this.databaseId.projectId),r=encodeURIComponent(this.databaseId.database);this.Do=s+"://"+t.host,this.vo=`projects/${i}/databases/${r}`,this.Co=this.databaseId.database==="(default)"?`project_id=${i}`:`project_id=${i}&database_id=${r}`}get Fo(){return!1}Mo(t,s,i,r,o){const l=_l(),c=this.xo(t,s.toUriEncodedString());B("RestConnection",`Sending RPC '${t}' ${l}:`,c,i);const h={"google-cloud-resource-prefix":this.vo,"x-goog-request-params":this.Co};return this.Oo(h,r,o),this.No(t,c,h,i).then(d=>(B("RestConnection",`Received RPC '${t}' ${l}: `,d),d),d=>{throw Bs("RestConnection",`RPC '${t}' ${l} failed with error: `,d,"url: ",c,"request:",i),d})}Lo(t,s,i,r,o,l){return this.Mo(t,s,i,r,o)}Oo(t,s,i){t["X-Goog-Api-Client"]=function(){return"gl-js/ fire/"+ti}(),t["Content-Type"]="text/plain",this.databaseInfo.appId&&(t["X-Firebase-GMPID"]=this.databaseInfo.appId),s&&s.headers.forEach((r,o)=>t[o]=r),i&&i.headers.forEach((r,o)=>t[o]=r)}xo(t,s){const i=FI[t];return`${this.Do}/v1/${s}:${i}`}terminate(){}}{constructor(e){super(e),this.forceLongPolling=e.forceLongPolling,this.autoDetectLongPolling=e.autoDetectLongPolling,this.useFetchStreams=e.useFetchStreams,this.longPollingOptions=e.longPollingOptions}No(e,t,s,i){const r=_l();return new Promise((o,l)=>{const c=new qm;c.setWithCredentials(!0),c.listenOnce(zm.COMPLETE,()=>{try{switch(c.getLastErrorCode()){case po.NO_ERROR:const d=c.getResponseJson();B(Je,`XHR for RPC '${e}' ${r} received:`,JSON.stringify(d)),o(d);break;case po.TIMEOUT:B(Je,`RPC '${e}' ${r} timed out`),l(new V(k.DEADLINE_EXCEEDED,"Request time out"));break;case po.HTTP_ERROR:const m=c.getStatus();if(B(Je,`RPC '${e}' ${r} failed with status:`,m,"response text:",c.getResponseText()),m>0){let p=c.getResponseJson();Array.isArray(p)&&(p=p[0]);const E=p==null?void 0:p.error;if(E&&E.status&&E.message){const b=function(P){const F=P.toLowerCase().replace(/_/g,"-");return Object.values(k).indexOf(F)>=0?F:k.UNKNOWN}(E.status);l(new V(b,E.message))}else l(new V(k.UNKNOWN,"Server responded with status "+c.getStatus()))}else l(new V(k.UNAVAILABLE,"Connection failed."));break;default:z()}}finally{B(Je,`RPC '${e}' ${r} completed.`)}});const h=JSON.stringify(i);B(Je,`RPC '${e}' ${r} sending request:`,i),c.send(t,"POST",h,s,15)})}Bo(e,t,s){const i=_l(),r=[this.Do,"/","google.firestore.v1.Firestore","/",e,"/channel"],o=Km(),l=Gm(),c={httpSessionIdParam:"gsessionid",initMessageHeaders:{},messageUrlParams:{database:`projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`},sendRawJson:!0,supportsCrossDomainXhr:!0,internalChannelParams:{forwardChannelRequestTimeoutMs:6e5},forceLongPolling:this.forceLongPolling,detectBufferingProxy:this.autoDetectLongPolling},h=this.longPollingOptions.timeoutSeconds;h!==void 0&&(c.longPollingTimeout=Math.round(1e3*h)),this.useFetchStreams&&(c.useFetchStreams=!0),this.Oo(c.initMessageHeaders,t,s),c.encodeInitMessageHeaders=!0;const d=r.join("");B(Je,`Creating RPC '${e}' stream ${i}: ${d}`,c);const m=o.createWebChannel(d,c);let p=!1,E=!1;const b=new BI({Io:P=>{E?B(Je,`Not sending because RPC '${e}' stream ${i} is closed:`,P):(p||(B(Je,`Opening RPC '${e}' stream ${i} transport.`),m.open(),p=!0),B(Je,`RPC '${e}' stream ${i} sending:`,P),m.send(P))},To:()=>m.close()}),S=(P,F,U)=>{P.listen(F,O=>{try{U(O)}catch(G){setTimeout(()=>{throw G},0)}})};return S(m,Li.EventType.OPEN,()=>{E||(B(Je,`RPC '${e}' stream ${i} transport opened.`),b.yo())}),S(m,Li.EventType.CLOSE,()=>{E||(E=!0,B(Je,`RPC '${e}' stream ${i} transport closed`),b.So())}),S(m,Li.EventType.ERROR,P=>{E||(E=!0,Bs(Je,`RPC '${e}' stream ${i} transport errored:`,P),b.So(new V(k.UNAVAILABLE,"The operation could not be completed")))}),S(m,Li.EventType.MESSAGE,P=>{var F;if(!E){const U=P.data[0];oe(!!U);const O=U,G=O.error||((F=O[0])===null||F===void 0?void 0:F.error);if(G){B(Je,`RPC '${e}' stream ${i} received error:`,G);const ae=G.status;let ee=function(v){const w=De[v];if(w!==void 0)return wp(w)}(ae),T=G.message;ee===void 0&&(ee=k.INTERNAL,T="Unknown error status: "+ae+" with message "+G.message),E=!0,b.So(new V(ee,T)),m.close()}else B(Je,`RPC '${e}' stream ${i} received:`,U),b.bo(U)}}),S(l,Hm.STAT_EVENT,P=>{P.stat===Bl.PROXY?B(Je,`RPC '${e}' stream ${i} detected buffering proxy`):P.stat===Bl.NOPROXY&&B(Je,`RPC '${e}' stream ${i} detected no buffering proxy`)}),setTimeout(()=>{b.wo()},0),b}}function yl(){return typeof document<"u"?document:null}/**
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
 */function Ta(n){return new YT(n,!0)}/**
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
 */class zc{constructor(e,t,s=1e3,i=1.5,r=6e4){this.ui=e,this.timerId=t,this.ko=s,this.qo=i,this.Qo=r,this.Ko=0,this.$o=null,this.Uo=Date.now(),this.reset()}reset(){this.Ko=0}Wo(){this.Ko=this.Qo}Go(e){this.cancel();const t=Math.floor(this.Ko+this.zo()),s=Math.max(0,Date.now()-this.Uo),i=Math.max(0,t-s);i>0&&B("ExponentialBackoff",`Backing off for ${i} ms (base delay: ${this.Ko} ms, delay with jitter: ${t} ms, last attempt: ${s} ms ago)`),this.$o=this.ui.enqueueAfterDelay(this.timerId,i,()=>(this.Uo=Date.now(),e())),this.Ko*=this.qo,this.Ko<this.ko&&(this.Ko=this.ko),this.Ko>this.Qo&&(this.Ko=this.Qo)}jo(){this.$o!==null&&(this.$o.skipDelay(),this.$o=null)}cancel(){this.$o!==null&&(this.$o.cancel(),this.$o=null)}zo(){return(Math.random()-.5)*this.Ko}}/**
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
 */class Mp{constructor(e,t,s,i,r,o,l,c){this.ui=e,this.Ho=s,this.Jo=i,this.connection=r,this.authCredentialsProvider=o,this.appCheckCredentialsProvider=l,this.listener=c,this.state=0,this.Yo=0,this.Zo=null,this.Xo=null,this.stream=null,this.e_=0,this.t_=new zc(e,t)}n_(){return this.state===1||this.state===5||this.r_()}r_(){return this.state===2||this.state===3}start(){this.e_=0,this.state!==4?this.auth():this.i_()}async stop(){this.n_()&&await this.close(0)}s_(){this.state=0,this.t_.reset()}o_(){this.r_()&&this.Zo===null&&(this.Zo=this.ui.enqueueAfterDelay(this.Ho,6e4,()=>this.__()))}a_(e){this.u_(),this.stream.send(e)}async __(){if(this.r_())return this.close(0)}u_(){this.Zo&&(this.Zo.cancel(),this.Zo=null)}c_(){this.Xo&&(this.Xo.cancel(),this.Xo=null)}async close(e,t){this.u_(),this.c_(),this.t_.cancel(),this.Yo++,e!==4?this.t_.reset():t&&t.code===k.RESOURCE_EXHAUSTED?(on(t.toString()),on("Using maximum backoff delay to prevent overloading the backend."),this.t_.Wo()):t&&t.code===k.UNAUTHENTICATED&&this.state!==3&&(this.authCredentialsProvider.invalidateToken(),this.appCheckCredentialsProvider.invalidateToken()),this.stream!==null&&(this.l_(),this.stream.close(),this.stream=null),this.state=e,await this.listener.mo(t)}l_(){}auth(){this.state=1;const e=this.h_(this.Yo),t=this.Yo;Promise.all([this.authCredentialsProvider.getToken(),this.appCheckCredentialsProvider.getToken()]).then(([s,i])=>{this.Yo===t&&this.P_(s,i)},s=>{e(()=>{const i=new V(k.UNKNOWN,"Fetching auth token failed: "+s.message);return this.I_(i)})})}P_(e,t){const s=this.h_(this.Yo);this.stream=this.T_(e,t),this.stream.Eo(()=>{s(()=>this.listener.Eo())}),this.stream.Ro(()=>{s(()=>(this.state=2,this.Xo=this.ui.enqueueAfterDelay(this.Jo,1e4,()=>(this.r_()&&(this.state=3),Promise.resolve())),this.listener.Ro()))}),this.stream.mo(i=>{s(()=>this.I_(i))}),this.stream.onMessage(i=>{s(()=>++this.e_==1?this.E_(i):this.onNext(i))})}i_(){this.state=5,this.t_.Go(async()=>{this.state=0,this.start()})}I_(e){return B("PersistentStream",`close with error: ${e}`),this.stream=null,this.close(4,e)}h_(e){return t=>{this.ui.enqueueAndForget(()=>this.Yo===e?t():(B("PersistentStream","stream callback skipped by getCloseGuardedDispatcher."),Promise.resolve()))}}}class jI extends Mp{constructor(e,t,s,i,r,o){super(e,"listen_stream_connection_backoff","listen_stream_idle","health_check_timeout",t,s,i,o),this.serializer=r}T_(e,t){return this.connection.Bo("Listen",e,t)}E_(e){return this.onNext(e)}onNext(e){this.t_.reset();const t=eI(this.serializer,e),s=function(r){if(!("targetChange"in r))return K.min();const o=r.targetChange;return o.targetIds&&o.targetIds.length?K.min():o.readTime?wt(o.readTime):K.min()}(e);return this.listener.d_(t,s)}A_(e){const t={};t.database=Kl(this.serializer),t.addTarget=function(r,o){let l;const c=o.target;if(l=ql(c)?{documents:nI(r,c)}:{query:sI(r,c)._t},l.targetId=o.targetId,o.resumeToken.approximateByteSize()>0){l.resumeToken=bp(r,o.resumeToken);const h=Hl(r,o.expectedCount);h!==null&&(l.expectedCount=h)}else if(o.snapshotVersion.compareTo(K.min())>0){l.readTime=Bo(r,o.snapshotVersion.toTimestamp());const h=Hl(r,o.expectedCount);h!==null&&(l.expectedCount=h)}return l}(this.serializer,e);const s=rI(this.serializer,e);s&&(t.labels=s),this.a_(t)}R_(e){const t={};t.database=Kl(this.serializer),t.removeTarget=e,this.a_(t)}}class $I extends Mp{constructor(e,t,s,i,r,o){super(e,"write_stream_connection_backoff","write_stream_idle","health_check_timeout",t,s,i,o),this.serializer=r}get V_(){return this.e_>0}start(){this.lastStreamToken=void 0,super.start()}l_(){this.V_&&this.m_([])}T_(e,t){return this.connection.Bo("Write",e,t)}E_(e){return oe(!!e.streamToken),this.lastStreamToken=e.streamToken,oe(!e.writeResults||e.writeResults.length===0),this.listener.f_()}onNext(e){oe(!!e.streamToken),this.lastStreamToken=e.streamToken,this.t_.reset();const t=tI(e.writeResults,e.commitTime),s=wt(e.commitTime);return this.listener.g_(s,t)}p_(){const e={};e.database=Kl(this.serializer),this.a_(e)}m_(e){const t={streamToken:this.lastStreamToken,writes:e.map(s=>Ap(this.serializer,s))};this.a_(t)}}/**
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
 */class WI extends class{}{constructor(e,t,s,i){super(),this.authCredentials=e,this.appCheckCredentials=t,this.connection=s,this.serializer=i,this.y_=!1}w_(){if(this.y_)throw new V(k.FAILED_PRECONDITION,"The client has already been terminated.")}Mo(e,t,s,i){return this.w_(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([r,o])=>this.connection.Mo(e,Gl(t,s),i,r,o)).catch(r=>{throw r.name==="FirebaseError"?(r.code===k.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),r):new V(k.UNKNOWN,r.toString())})}Lo(e,t,s,i,r){return this.w_(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([o,l])=>this.connection.Lo(e,Gl(t,s),i,o,l,r)).catch(o=>{throw o.name==="FirebaseError"?(o.code===k.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),o):new V(k.UNKNOWN,o.toString())})}terminate(){this.y_=!0,this.connection.terminate()}}class qI{constructor(e,t){this.asyncQueue=e,this.onlineStateHandler=t,this.state="Unknown",this.S_=0,this.b_=null,this.D_=!0}v_(){this.S_===0&&(this.C_("Unknown"),this.b_=this.asyncQueue.enqueueAfterDelay("online_state_timeout",1e4,()=>(this.b_=null,this.F_("Backend didn't respond within 10 seconds."),this.C_("Offline"),Promise.resolve())))}M_(e){this.state==="Online"?this.C_("Unknown"):(this.S_++,this.S_>=1&&(this.x_(),this.F_(`Connection failed 1 times. Most recent error: ${e.toString()}`),this.C_("Offline")))}set(e){this.x_(),this.S_=0,e==="Online"&&(this.D_=!1),this.C_(e)}C_(e){e!==this.state&&(this.state=e,this.onlineStateHandler(e))}F_(e){const t=`Could not reach Cloud Firestore backend. ${e}
This typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;this.D_?(on(t),this.D_=!1):B("OnlineStateTracker",t)}x_(){this.b_!==null&&(this.b_.cancel(),this.b_=null)}}/**
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
 */class zI{constructor(e,t,s,i,r){this.localStore=e,this.datastore=t,this.asyncQueue=s,this.remoteSyncer={},this.O_=[],this.N_=new Map,this.L_=new Set,this.B_=[],this.k_=r,this.k_._o(o=>{s.enqueueAndForget(async()=>{ms(this)&&(B("RemoteStore","Restarting streams for network reachability change."),await async function(c){const h=Y(c);h.L_.add(4),await Cr(h),h.q_.set("Unknown"),h.L_.delete(4),await Ia(h)}(this))})}),this.q_=new qI(s,i)}}async function Ia(n){if(ms(n))for(const e of n.B_)await e(!0)}async function Cr(n){for(const e of n.B_)await e(!1)}function Lp(n,e){const t=Y(n);t.N_.has(e.targetId)||(t.N_.set(e.targetId,e),Qc(t)?Kc(t):si(t).r_()&&Gc(t,e))}function Hc(n,e){const t=Y(n),s=si(t);t.N_.delete(e),s.r_()&&Op(t,e),t.N_.size===0&&(s.r_()?s.o_():ms(t)&&t.q_.set("Unknown"))}function Gc(n,e){if(n.Q_.xe(e.targetId),e.resumeToken.approximateByteSize()>0||e.snapshotVersion.compareTo(K.min())>0){const t=n.remoteSyncer.getRemoteKeysForTarget(e.targetId).size;e=e.withExpectedCount(t)}si(n).A_(e)}function Op(n,e){n.Q_.xe(e),si(n).R_(e)}function Kc(n){n.Q_=new HT({getRemoteKeysForTarget:e=>n.remoteSyncer.getRemoteKeysForTarget(e),ot:e=>n.N_.get(e)||null,tt:()=>n.datastore.serializer.databaseId}),si(n).start(),n.q_.v_()}function Qc(n){return ms(n)&&!si(n).n_()&&n.N_.size>0}function ms(n){return Y(n).L_.size===0}function Vp(n){n.Q_=void 0}async function HI(n){n.q_.set("Online")}async function GI(n){n.N_.forEach((e,t)=>{Gc(n,e)})}async function KI(n,e){Vp(n),Qc(n)?(n.q_.M_(e),Kc(n)):n.q_.set("Unknown")}async function QI(n,e,t){if(n.q_.set("Online"),e instanceof Ip&&e.state===2&&e.cause)try{await async function(i,r){const o=r.cause;for(const l of r.targetIds)i.N_.has(l)&&(await i.remoteSyncer.rejectListen(l,o),i.N_.delete(l),i.Q_.removeTarget(l))}(n,e)}catch(s){B("RemoteStore","Failed to remove targets %s: %s ",e.targetIds.join(","),s),await jo(n,s)}else if(e instanceof yo?n.Q_.Ke(e):e instanceof Tp?n.Q_.He(e):n.Q_.We(e),!t.isEqual(K.min()))try{const s=await xp(n.localStore);t.compareTo(s)>=0&&await function(r,o){const l=r.Q_.rt(o);return l.targetChanges.forEach((c,h)=>{if(c.resumeToken.approximateByteSize()>0){const d=r.N_.get(h);d&&r.N_.set(h,d.withResumeToken(c.resumeToken,o))}}),l.targetMismatches.forEach((c,h)=>{const d=r.N_.get(c);if(!d)return;r.N_.set(c,d.withResumeToken(Ke.EMPTY_BYTE_STRING,d.snapshotVersion)),Op(r,c);const m=new wn(d.target,c,h,d.sequenceNumber);Gc(r,m)}),r.remoteSyncer.applyRemoteEvent(l)}(n,t)}catch(s){B("RemoteStore","Failed to raise snapshot:",s),await jo(n,s)}}async function jo(n,e,t){if(!Er(e))throw e;n.L_.add(1),await Cr(n),n.q_.set("Offline"),t||(t=()=>xp(n.localStore)),n.asyncQueue.enqueueRetryable(async()=>{B("RemoteStore","Retrying IndexedDB access"),await t(),n.L_.delete(1),await Ia(n)})}function Fp(n,e){return e().catch(t=>jo(n,t,e))}async function ba(n){const e=Y(n),t=xn(e);let s=e.O_.length>0?e.O_[e.O_.length-1].batchId:-1;for(;YI(e);)try{const i=await xI(e.localStore,s);if(i===null){e.O_.length===0&&t.o_();break}s=i.batchId,XI(e,i)}catch(i){await jo(e,i)}Bp(e)&&Up(e)}function YI(n){return ms(n)&&n.O_.length<10}function XI(n,e){n.O_.push(e);const t=xn(n);t.r_()&&t.V_&&t.m_(e.mutations)}function Bp(n){return ms(n)&&!xn(n).n_()&&n.O_.length>0}function Up(n){xn(n).start()}async function JI(n){xn(n).p_()}async function ZI(n){const e=xn(n);for(const t of n.O_)e.m_(t.mutations)}async function e0(n,e,t){const s=n.O_.shift(),i=Bc.from(s,e,t);await Fp(n,()=>n.remoteSyncer.applySuccessfulWrite(i)),await ba(n)}async function t0(n,e){e&&xn(n).V_&&await async function(s,i){if(function(o){return Ep(o)&&o!==k.ABORTED}(i.code)){const r=s.O_.shift();xn(s).s_(),await Fp(s,()=>s.remoteSyncer.rejectFailedWrite(r.batchId,i)),await ba(s)}}(n,e),Bp(n)&&Up(n)}async function Wd(n,e){const t=Y(n);t.asyncQueue.verifyOperationInProgress(),B("RemoteStore","RemoteStore received new credentials");const s=ms(t);t.L_.add(3),await Cr(t),s&&t.q_.set("Unknown"),await t.remoteSyncer.handleCredentialChange(e),t.L_.delete(3),await Ia(t)}async function n0(n,e){const t=Y(n);e?(t.L_.delete(2),await Ia(t)):e||(t.L_.add(2),await Cr(t),t.q_.set("Unknown"))}function si(n){return n.K_||(n.K_=function(t,s,i){const r=Y(t);return r.w_(),new jI(s,r.connection,r.authCredentials,r.appCheckCredentials,r.serializer,i)}(n.datastore,n.asyncQueue,{Eo:HI.bind(null,n),Ro:GI.bind(null,n),mo:KI.bind(null,n),d_:QI.bind(null,n)}),n.B_.push(async e=>{e?(n.K_.s_(),Qc(n)?Kc(n):n.q_.set("Unknown")):(await n.K_.stop(),Vp(n))})),n.K_}function xn(n){return n.U_||(n.U_=function(t,s,i){const r=Y(t);return r.w_(),new $I(s,r.connection,r.authCredentials,r.appCheckCredentials,r.serializer,i)}(n.datastore,n.asyncQueue,{Eo:()=>Promise.resolve(),Ro:JI.bind(null,n),mo:t0.bind(null,n),f_:ZI.bind(null,n),g_:e0.bind(null,n)}),n.B_.push(async e=>{e?(n.U_.s_(),await ba(n)):(await n.U_.stop(),n.O_.length>0&&(B("RemoteStore",`Stopping write stream with ${n.O_.length} pending writes`),n.O_=[]))})),n.U_}/**
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
 */class Yc{constructor(e,t,s,i,r){this.asyncQueue=e,this.timerId=t,this.targetTimeMs=s,this.op=i,this.removalCallback=r,this.deferred=new Vt,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch(o=>{})}get promise(){return this.deferred.promise}static createAndSchedule(e,t,s,i,r){const o=Date.now()+s,l=new Yc(e,t,o,i,r);return l.start(s),l}start(e){this.timerHandle=setTimeout(()=>this.handleDelayElapsed(),e)}skipDelay(){return this.handleDelayElapsed()}cancel(e){this.timerHandle!==null&&(this.clearTimeout(),this.deferred.reject(new V(k.CANCELLED,"Operation cancelled"+(e?": "+e:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget(()=>this.timerHandle!==null?(this.clearTimeout(),this.op().then(e=>this.deferred.resolve(e))):Promise.resolve())}clearTimeout(){this.timerHandle!==null&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}}function Xc(n,e){if(on("AsyncQueue",`${e}: ${n}`),Er(n))return new V(k.UNAVAILABLE,`${e}: ${n}`);throw n}/**
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
 */class xs{constructor(e){this.comparator=e?(t,s)=>e(t,s)||$.comparator(t.key,s.key):(t,s)=>$.comparator(t.key,s.key),this.keyedMap=Oi(),this.sortedSet=new Me(this.comparator)}static emptySet(e){return new xs(e.comparator)}has(e){return this.keyedMap.get(e)!=null}get(e){return this.keyedMap.get(e)}first(){return this.sortedSet.minKey()}last(){return this.sortedSet.maxKey()}isEmpty(){return this.sortedSet.isEmpty()}indexOf(e){const t=this.keyedMap.get(e);return t?this.sortedSet.indexOf(t):-1}get size(){return this.sortedSet.size}forEach(e){this.sortedSet.inorderTraversal((t,s)=>(e(t),!1))}add(e){const t=this.delete(e.key);return t.copy(t.keyedMap.insert(e.key,e),t.sortedSet.insert(e,null))}delete(e){const t=this.get(e);return t?this.copy(this.keyedMap.remove(e),this.sortedSet.remove(t)):this}isEqual(e){if(!(e instanceof xs)||this.size!==e.size)return!1;const t=this.sortedSet.getIterator(),s=e.sortedSet.getIterator();for(;t.hasNext();){const i=t.getNext().key,r=s.getNext().key;if(!i.isEqual(r))return!1}return!0}toString(){const e=[];return this.forEach(t=>{e.push(t.toString())}),e.length===0?"DocumentSet ()":`DocumentSet (
  `+e.join(`  
`)+`
)`}copy(e,t){const s=new xs;return s.comparator=this.comparator,s.keyedMap=e,s.sortedSet=t,s}}/**
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
 */class qd{constructor(){this.W_=new Me($.comparator)}track(e){const t=e.doc.key,s=this.W_.get(t);s?e.type!==0&&s.type===3?this.W_=this.W_.insert(t,e):e.type===3&&s.type!==1?this.W_=this.W_.insert(t,{type:s.type,doc:e.doc}):e.type===2&&s.type===2?this.W_=this.W_.insert(t,{type:2,doc:e.doc}):e.type===2&&s.type===0?this.W_=this.W_.insert(t,{type:0,doc:e.doc}):e.type===1&&s.type===0?this.W_=this.W_.remove(t):e.type===1&&s.type===2?this.W_=this.W_.insert(t,{type:1,doc:s.doc}):e.type===0&&s.type===1?this.W_=this.W_.insert(t,{type:2,doc:e.doc}):z():this.W_=this.W_.insert(t,e)}G_(){const e=[];return this.W_.inorderTraversal((t,s)=>{e.push(s)}),e}}class qs{constructor(e,t,s,i,r,o,l,c,h){this.query=e,this.docs=t,this.oldDocs=s,this.docChanges=i,this.mutatedKeys=r,this.fromCache=o,this.syncStateChanged=l,this.excludesMetadataChanges=c,this.hasCachedResults=h}static fromInitialDocuments(e,t,s,i,r){const o=[];return t.forEach(l=>{o.push({type:0,doc:l})}),new qs(e,t,xs.emptySet(t),o,s,i,!0,!1,r)}get hasPendingWrites(){return!this.mutatedKeys.isEmpty()}isEqual(e){if(!(this.fromCache===e.fromCache&&this.hasCachedResults===e.hasCachedResults&&this.syncStateChanged===e.syncStateChanged&&this.mutatedKeys.isEqual(e.mutatedKeys)&&_a(this.query,e.query)&&this.docs.isEqual(e.docs)&&this.oldDocs.isEqual(e.oldDocs)))return!1;const t=this.docChanges,s=e.docChanges;if(t.length!==s.length)return!1;for(let i=0;i<t.length;i++)if(t[i].type!==s[i].type||!t[i].doc.isEqual(s[i].doc))return!1;return!0}}/**
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
 */class s0{constructor(){this.z_=void 0,this.j_=[]}H_(){return this.j_.some(e=>e.J_())}}class i0{constructor(){this.queries=zd(),this.onlineState="Unknown",this.Y_=new Set}terminate(){(function(t,s){const i=Y(t),r=i.queries;i.queries=zd(),r.forEach((o,l)=>{for(const c of l.j_)c.onError(s)})})(this,new V(k.ABORTED,"Firestore shutting down"))}}function zd(){return new ni(n=>ap(n),_a)}async function jp(n,e){const t=Y(n);let s=3;const i=e.query;let r=t.queries.get(i);r?!r.H_()&&e.J_()&&(s=2):(r=new s0,s=e.J_()?0:1);try{switch(s){case 0:r.z_=await t.onListen(i,!0);break;case 1:r.z_=await t.onListen(i,!1);break;case 2:await t.onFirstRemoteStoreListen(i)}}catch(o){const l=Xc(o,`Initialization of query '${Cs(e.query)}' failed`);return void e.onError(l)}t.queries.set(i,r),r.j_.push(e),e.Z_(t.onlineState),r.z_&&e.X_(r.z_)&&Jc(t)}async function $p(n,e){const t=Y(n),s=e.query;let i=3;const r=t.queries.get(s);if(r){const o=r.j_.indexOf(e);o>=0&&(r.j_.splice(o,1),r.j_.length===0?i=e.J_()?0:1:!r.H_()&&e.J_()&&(i=2))}switch(i){case 0:return t.queries.delete(s),t.onUnlisten(s,!0);case 1:return t.queries.delete(s),t.onUnlisten(s,!1);case 2:return t.onLastRemoteStoreUnlisten(s);default:return}}function r0(n,e){const t=Y(n);let s=!1;for(const i of e){const r=i.query,o=t.queries.get(r);if(o){for(const l of o.j_)l.X_(i)&&(s=!0);o.z_=i}}s&&Jc(t)}function o0(n,e,t){const s=Y(n),i=s.queries.get(e);if(i)for(const r of i.j_)r.onError(t);s.queries.delete(e)}function Jc(n){n.Y_.forEach(e=>{e.next()})}var Yl,Hd;(Hd=Yl||(Yl={})).ea="default",Hd.Cache="cache";class Wp{constructor(e,t,s){this.query=e,this.ta=t,this.na=!1,this.ra=null,this.onlineState="Unknown",this.options=s||{}}X_(e){if(!this.options.includeMetadataChanges){const s=[];for(const i of e.docChanges)i.type!==3&&s.push(i);e=new qs(e.query,e.docs,e.oldDocs,s,e.mutatedKeys,e.fromCache,e.syncStateChanged,!0,e.hasCachedResults)}let t=!1;return this.na?this.ia(e)&&(this.ta.next(e),t=!0):this.sa(e,this.onlineState)&&(this.oa(e),t=!0),this.ra=e,t}onError(e){this.ta.error(e)}Z_(e){this.onlineState=e;let t=!1;return this.ra&&!this.na&&this.sa(this.ra,e)&&(this.oa(this.ra),t=!0),t}sa(e,t){if(!e.fromCache||!this.J_())return!0;const s=t!=="Offline";return(!this.options._a||!s)&&(!e.docs.isEmpty()||e.hasCachedResults||t==="Offline")}ia(e){if(e.docChanges.length>0)return!0;const t=this.ra&&this.ra.hasPendingWrites!==e.hasPendingWrites;return!(!e.syncStateChanged&&!t)&&this.options.includeMetadataChanges===!0}oa(e){e=qs.fromInitialDocuments(e.query,e.docs,e.mutatedKeys,e.fromCache,e.hasCachedResults),this.na=!0,this.ta.next(e)}J_(){return this.options.source!==Yl.Cache}}/**
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
 */class qp{constructor(e){this.key=e}}class zp{constructor(e){this.key=e}}class a0{constructor(e,t){this.query=e,this.Ta=t,this.Ea=null,this.hasCachedResults=!1,this.current=!1,this.da=ne(),this.mutatedKeys=ne(),this.Aa=lp(e),this.Ra=new xs(this.Aa)}get Va(){return this.Ta}ma(e,t){const s=t?t.fa:new qd,i=t?t.Ra:this.Ra;let r=t?t.mutatedKeys:this.mutatedKeys,o=i,l=!1;const c=this.query.limitType==="F"&&i.size===this.query.limit?i.last():null,h=this.query.limitType==="L"&&i.size===this.query.limit?i.first():null;if(e.inorderTraversal((d,m)=>{const p=i.get(d),E=ya(this.query,m)?m:null,b=!!p&&this.mutatedKeys.has(p.key),S=!!E&&(E.hasLocalMutations||this.mutatedKeys.has(E.key)&&E.hasCommittedMutations);let P=!1;p&&E?p.data.isEqual(E.data)?b!==S&&(s.track({type:3,doc:E}),P=!0):this.ga(p,E)||(s.track({type:2,doc:E}),P=!0,(c&&this.Aa(E,c)>0||h&&this.Aa(E,h)<0)&&(l=!0)):!p&&E?(s.track({type:0,doc:E}),P=!0):p&&!E&&(s.track({type:1,doc:p}),P=!0,(c||h)&&(l=!0)),P&&(E?(o=o.add(E),r=S?r.add(d):r.delete(d)):(o=o.delete(d),r=r.delete(d)))}),this.query.limit!==null)for(;o.size>this.query.limit;){const d=this.query.limitType==="F"?o.last():o.first();o=o.delete(d.key),r=r.delete(d.key),s.track({type:1,doc:d})}return{Ra:o,fa:s,ns:l,mutatedKeys:r}}ga(e,t){return e.hasLocalMutations&&t.hasCommittedMutations&&!t.hasLocalMutations}applyChanges(e,t,s,i){const r=this.Ra;this.Ra=e.Ra,this.mutatedKeys=e.mutatedKeys;const o=e.fa.G_();o.sort((d,m)=>function(E,b){const S=P=>{switch(P){case 0:return 1;case 2:case 3:return 2;case 1:return 0;default:return z()}};return S(E)-S(b)}(d.type,m.type)||this.Aa(d.doc,m.doc)),this.pa(s),i=i!=null&&i;const l=t&&!i?this.ya():[],c=this.da.size===0&&this.current&&!i?1:0,h=c!==this.Ea;return this.Ea=c,o.length!==0||h?{snapshot:new qs(this.query,e.Ra,r,o,e.mutatedKeys,c===0,h,!1,!!s&&s.resumeToken.approximateByteSize()>0),wa:l}:{wa:l}}Z_(e){return this.current&&e==="Offline"?(this.current=!1,this.applyChanges({Ra:this.Ra,fa:new qd,mutatedKeys:this.mutatedKeys,ns:!1},!1)):{wa:[]}}Sa(e){return!this.Ta.has(e)&&!!this.Ra.has(e)&&!this.Ra.get(e).hasLocalMutations}pa(e){e&&(e.addedDocuments.forEach(t=>this.Ta=this.Ta.add(t)),e.modifiedDocuments.forEach(t=>{}),e.removedDocuments.forEach(t=>this.Ta=this.Ta.delete(t)),this.current=e.current)}ya(){if(!this.current)return[];const e=this.da;this.da=ne(),this.Ra.forEach(s=>{this.Sa(s.key)&&(this.da=this.da.add(s.key))});const t=[];return e.forEach(s=>{this.da.has(s)||t.push(new zp(s))}),this.da.forEach(s=>{e.has(s)||t.push(new qp(s))}),t}ba(e){this.Ta=e.Ts,this.da=ne();const t=this.ma(e.documents);return this.applyChanges(t,!0)}Da(){return qs.fromInitialDocuments(this.query,this.Ra,this.mutatedKeys,this.Ea===0,this.hasCachedResults)}}class l0{constructor(e,t,s){this.query=e,this.targetId=t,this.view=s}}class c0{constructor(e){this.key=e,this.va=!1}}class h0{constructor(e,t,s,i,r,o){this.localStore=e,this.remoteStore=t,this.eventManager=s,this.sharedClientState=i,this.currentUser=r,this.maxConcurrentLimboResolutions=o,this.Ca={},this.Fa=new ni(l=>ap(l),_a),this.Ma=new Map,this.xa=new Set,this.Oa=new Me($.comparator),this.Na=new Map,this.La=new $c,this.Ba={},this.ka=new Map,this.qa=Ws.kn(),this.onlineState="Unknown",this.Qa=void 0}get isPrimaryClient(){return this.Qa===!0}}async function u0(n,e,t=!0){const s=Xp(n);let i;const r=s.Fa.get(e);return r?(s.sharedClientState.addLocalQueryTarget(r.targetId),i=r.view.Da()):i=await Hp(s,e,t,!0),i}async function d0(n,e){const t=Xp(n);await Hp(t,e,!0,!1)}async function Hp(n,e,t,s){const i=await MI(n.localStore,Ft(e)),r=i.targetId,o=n.sharedClientState.addLocalQueryTarget(r,t);let l;return s&&(l=await f0(n,e,r,o==="current",i.resumeToken)),n.isPrimaryClient&&t&&Lp(n.remoteStore,i),l}async function f0(n,e,t,s,i){n.Ka=(m,p,E)=>async function(S,P,F,U){let O=P.view.ma(F);O.ns&&(O=await Ud(S.localStore,P.query,!1).then(({documents:T})=>P.view.ma(T,O)));const G=U&&U.targetChanges.get(P.targetId),ae=U&&U.targetMismatches.get(P.targetId)!=null,ee=P.view.applyChanges(O,S.isPrimaryClient,G,ae);return Kd(S,P.targetId,ee.wa),ee.snapshot}(n,m,p,E);const r=await Ud(n.localStore,e,!0),o=new a0(e,r.Ts),l=o.ma(r.documents),c=br.createSynthesizedTargetChangeForCurrentChange(t,s&&n.onlineState!=="Offline",i),h=o.applyChanges(l,n.isPrimaryClient,c);Kd(n,t,h.wa);const d=new l0(e,t,o);return n.Fa.set(e,d),n.Ma.has(t)?n.Ma.get(t).push(e):n.Ma.set(t,[e]),h.snapshot}async function m0(n,e,t){const s=Y(n),i=s.Fa.get(e),r=s.Ma.get(i.targetId);if(r.length>1)return s.Ma.set(i.targetId,r.filter(o=>!_a(o,e))),void s.Fa.delete(e);s.isPrimaryClient?(s.sharedClientState.removeLocalQueryTarget(i.targetId),s.sharedClientState.isActiveQueryTarget(i.targetId)||await Ql(s.localStore,i.targetId,!1).then(()=>{s.sharedClientState.clearQueryState(i.targetId),t&&Hc(s.remoteStore,i.targetId),Xl(s,i.targetId)}).catch(vr)):(Xl(s,i.targetId),await Ql(s.localStore,i.targetId,!0))}async function p0(n,e){const t=Y(n),s=t.Fa.get(e),i=t.Ma.get(s.targetId);t.isPrimaryClient&&i.length===1&&(t.sharedClientState.removeLocalQueryTarget(s.targetId),Hc(t.remoteStore,s.targetId))}async function g0(n,e,t){const s=I0(n);try{const i=await function(o,l){const c=Y(o),h=Ve.now(),d=l.reduce((E,b)=>E.add(b.key),ne());let m,p;return c.persistence.runTransaction("Locally write mutations","readwrite",E=>{let b=an(),S=ne();return c.cs.getEntries(E,d).next(P=>{b=P,b.forEach((F,U)=>{U.isValidDocument()||(S=S.add(F))})}).next(()=>c.localDocuments.getOverlayedDocuments(E,b)).next(P=>{m=P;const F=[];for(const U of l){const O=UT(U,m.get(U.key).overlayedDocument);O!=null&&F.push(new Bn(U.key,O,Zm(O.value.mapValue),ut.exists(!0)))}return c.mutationQueue.addMutationBatch(E,h,F,l)}).next(P=>{p=P;const F=P.applyToLocalDocumentSet(m,S);return c.documentOverlayCache.saveOverlays(E,P.batchId,F)})}).then(()=>({batchId:p.batchId,changes:hp(m)}))}(s.localStore,e);s.sharedClientState.addPendingMutation(i.batchId),function(o,l,c){let h=o.Ba[o.currentUser.toKey()];h||(h=new Me(ce)),h=h.insert(l,c),o.Ba[o.currentUser.toKey()]=h}(s,i.batchId,t),await Rr(s,i.changes),await ba(s.remoteStore)}catch(i){const r=Xc(i,"Failed to persist write");t.reject(r)}}async function Gp(n,e){const t=Y(n);try{const s=await NI(t.localStore,e);e.targetChanges.forEach((i,r)=>{const o=t.Na.get(r);o&&(oe(i.addedDocuments.size+i.modifiedDocuments.size+i.removedDocuments.size<=1),i.addedDocuments.size>0?o.va=!0:i.modifiedDocuments.size>0?oe(o.va):i.removedDocuments.size>0&&(oe(o.va),o.va=!1))}),await Rr(t,s,e)}catch(s){await vr(s)}}function Gd(n,e,t){const s=Y(n);if(s.isPrimaryClient&&t===0||!s.isPrimaryClient&&t===1){const i=[];s.Fa.forEach((r,o)=>{const l=o.view.Z_(e);l.snapshot&&i.push(l.snapshot)}),function(o,l){const c=Y(o);c.onlineState=l;let h=!1;c.queries.forEach((d,m)=>{for(const p of m.j_)p.Z_(l)&&(h=!0)}),h&&Jc(c)}(s.eventManager,e),i.length&&s.Ca.d_(i),s.onlineState=e,s.isPrimaryClient&&s.sharedClientState.setOnlineState(e)}}async function _0(n,e,t){const s=Y(n);s.sharedClientState.updateQueryState(e,"rejected",t);const i=s.Na.get(e),r=i&&i.key;if(r){let o=new Me($.comparator);o=o.insert(r,je.newNoDocument(r,K.min()));const l=ne().add(r),c=new wa(K.min(),new Map,new Me(ce),o,l);await Gp(s,c),s.Oa=s.Oa.remove(r),s.Na.delete(e),Zc(s)}else await Ql(s.localStore,e,!1).then(()=>Xl(s,e,t)).catch(vr)}async function y0(n,e){const t=Y(n),s=e.batch.batchId;try{const i=await PI(t.localStore,e);Qp(t,s,null),Kp(t,s),t.sharedClientState.updateMutationState(s,"acknowledged"),await Rr(t,i)}catch(i){await vr(i)}}async function v0(n,e,t){const s=Y(n);try{const i=await function(o,l){const c=Y(o);return c.persistence.runTransaction("Reject batch","readwrite-primary",h=>{let d;return c.mutationQueue.lookupMutationBatch(h,l).next(m=>(oe(m!==null),d=m.keys(),c.mutationQueue.removeMutationBatch(h,m))).next(()=>c.mutationQueue.performConsistencyCheck(h)).next(()=>c.documentOverlayCache.removeOverlaysForBatchId(h,d,l)).next(()=>c.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(h,d)).next(()=>c.localDocuments.getDocuments(h,d))})}(s.localStore,e);Qp(s,e,t),Kp(s,e),s.sharedClientState.updateMutationState(e,"rejected",t),await Rr(s,i)}catch(i){await vr(i)}}function Kp(n,e){(n.ka.get(e)||[]).forEach(t=>{t.resolve()}),n.ka.delete(e)}function Qp(n,e,t){const s=Y(n);let i=s.Ba[s.currentUser.toKey()];if(i){const r=i.get(e);r&&(t?r.reject(t):r.resolve(),i=i.remove(e)),s.Ba[s.currentUser.toKey()]=i}}function Xl(n,e,t=null){n.sharedClientState.removeLocalQueryTarget(e);for(const s of n.Ma.get(e))n.Fa.delete(s),t&&n.Ca.$a(s,t);n.Ma.delete(e),n.isPrimaryClient&&n.La.gr(e).forEach(s=>{n.La.containsKey(s)||Yp(n,s)})}function Yp(n,e){n.xa.delete(e.path.canonicalString());const t=n.Oa.get(e);t!==null&&(Hc(n.remoteStore,t),n.Oa=n.Oa.remove(e),n.Na.delete(t),Zc(n))}function Kd(n,e,t){for(const s of t)s instanceof qp?(n.La.addReference(s.key,e),E0(n,s)):s instanceof zp?(B("SyncEngine","Document no longer in limbo: "+s.key),n.La.removeReference(s.key,e),n.La.containsKey(s.key)||Yp(n,s.key)):z()}function E0(n,e){const t=e.key,s=t.path.canonicalString();n.Oa.get(t)||n.xa.has(s)||(B("SyncEngine","New document in limbo: "+t),n.xa.add(s),Zc(n))}function Zc(n){for(;n.xa.size>0&&n.Oa.size<n.maxConcurrentLimboResolutions;){const e=n.xa.values().next().value;n.xa.delete(e);const t=new $(ye.fromString(e)),s=n.qa.next();n.Na.set(s,new c0(t)),n.Oa=n.Oa.insert(t,s),Lp(n.remoteStore,new wn(Ft(Oc(t.path)),s,"TargetPurposeLimboResolution",Pc.oe))}}async function Rr(n,e,t){const s=Y(n),i=[],r=[],o=[];s.Fa.isEmpty()||(s.Fa.forEach((l,c)=>{o.push(s.Ka(c,e,t).then(h=>{var d;if((h||t)&&s.isPrimaryClient){const m=h?!h.fromCache:(d=t==null?void 0:t.targetChanges.get(c.targetId))===null||d===void 0?void 0:d.current;s.sharedClientState.updateQueryState(c.targetId,m?"current":"not-current")}if(h){i.push(h);const m=qc.Wi(c.targetId,h);r.push(m)}}))}),await Promise.all(o),s.Ca.d_(i),await async function(c,h){const d=Y(c);try{await d.persistence.runTransaction("notifyLocalViewChanges","readwrite",m=>N.forEach(h,p=>N.forEach(p.$i,E=>d.persistence.referenceDelegate.addReference(m,p.targetId,E)).next(()=>N.forEach(p.Ui,E=>d.persistence.referenceDelegate.removeReference(m,p.targetId,E)))))}catch(m){if(!Er(m))throw m;B("LocalStore","Failed to update sequence numbers: "+m)}for(const m of h){const p=m.targetId;if(!m.fromCache){const E=d.os.get(p),b=E.snapshotVersion,S=E.withLastLimboFreeSnapshotVersion(b);d.os=d.os.insert(p,S)}}}(s.localStore,r))}async function w0(n,e){const t=Y(n);if(!t.currentUser.isEqual(e)){B("SyncEngine","User change. New user:",e.toKey());const s=await Dp(t.localStore,e);t.currentUser=e,function(r,o){r.ka.forEach(l=>{l.forEach(c=>{c.reject(new V(k.CANCELLED,o))})}),r.ka.clear()}(t,"'waitForPendingWrites' promise is rejected due to a user change."),t.sharedClientState.handleUserChange(e,s.removedBatchIds,s.addedBatchIds),await Rr(t,s.hs)}}function T0(n,e){const t=Y(n),s=t.Na.get(e);if(s&&s.va)return ne().add(s.key);{let i=ne();const r=t.Ma.get(e);if(!r)return i;for(const o of r){const l=t.Fa.get(o);i=i.unionWith(l.view.Va)}return i}}function Xp(n){const e=Y(n);return e.remoteStore.remoteSyncer.applyRemoteEvent=Gp.bind(null,e),e.remoteStore.remoteSyncer.getRemoteKeysForTarget=T0.bind(null,e),e.remoteStore.remoteSyncer.rejectListen=_0.bind(null,e),e.Ca.d_=r0.bind(null,e.eventManager),e.Ca.$a=o0.bind(null,e.eventManager),e}function I0(n){const e=Y(n);return e.remoteStore.remoteSyncer.applySuccessfulWrite=y0.bind(null,e),e.remoteStore.remoteSyncer.rejectFailedWrite=v0.bind(null,e),e}class $o{constructor(){this.kind="memory",this.synchronizeTabs=!1}async initialize(e){this.serializer=Ta(e.databaseInfo.databaseId),this.sharedClientState=this.Wa(e),this.persistence=this.Ga(e),await this.persistence.start(),this.localStore=this.za(e),this.gcScheduler=this.ja(e,this.localStore),this.indexBackfillerScheduler=this.Ha(e,this.localStore)}ja(e,t){return null}Ha(e,t){return null}za(e){return kI(this.persistence,new SI,e.initialUser,this.serializer)}Ga(e){return new bI(Wc.Zr,this.serializer)}Wa(e){return new OI}async terminate(){var e,t;(e=this.gcScheduler)===null||e===void 0||e.stop(),(t=this.indexBackfillerScheduler)===null||t===void 0||t.stop(),this.sharedClientState.shutdown(),await this.persistence.shutdown()}}$o.provider={build:()=>new $o};class Jl{async initialize(e,t){this.localStore||(this.localStore=e.localStore,this.sharedClientState=e.sharedClientState,this.datastore=this.createDatastore(t),this.remoteStore=this.createRemoteStore(t),this.eventManager=this.createEventManager(t),this.syncEngine=this.createSyncEngine(t,!e.synchronizeTabs),this.sharedClientState.onlineStateHandler=s=>Gd(this.syncEngine,s,1),this.remoteStore.remoteSyncer.handleCredentialChange=w0.bind(null,this.syncEngine),await n0(this.remoteStore,this.syncEngine.isPrimaryClient))}createEventManager(e){return function(){return new i0}()}createDatastore(e){const t=Ta(e.databaseInfo.databaseId),s=function(r){return new UI(r)}(e.databaseInfo);return function(r,o,l,c){return new WI(r,o,l,c)}(e.authCredentials,e.appCheckCredentials,s,t)}createRemoteStore(e){return function(s,i,r,o,l){return new zI(s,i,r,o,l)}(this.localStore,this.datastore,e.asyncQueue,t=>Gd(this.syncEngine,t,0),function(){return $d.D()?new $d:new VI}())}createSyncEngine(e,t){return function(i,r,o,l,c,h,d){const m=new h0(i,r,o,l,c,h);return d&&(m.Qa=!0),m}(this.localStore,this.remoteStore,this.eventManager,this.sharedClientState,e.initialUser,e.maxConcurrentLimboResolutions,t)}async terminate(){var e,t;await async function(i){const r=Y(i);B("RemoteStore","RemoteStore shutting down."),r.L_.add(5),await Cr(r),r.k_.shutdown(),r.q_.set("Unknown")}(this.remoteStore),(e=this.datastore)===null||e===void 0||e.terminate(),(t=this.eventManager)===null||t===void 0||t.terminate()}}Jl.provider={build:()=>new Jl};/**
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
 *//**
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
 */class Jp{constructor(e){this.observer=e,this.muted=!1}next(e){this.muted||this.observer.next&&this.Ya(this.observer.next,e)}error(e){this.muted||(this.observer.error?this.Ya(this.observer.error,e):on("Uncaught Error in snapshot listener:",e.toString()))}Za(){this.muted=!0}Ya(e,t){setTimeout(()=>{this.muted||e(t)},0)}}/**
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
 */class b0{constructor(e){this.datastore=e,this.readVersions=new Map,this.mutations=[],this.committed=!1,this.lastTransactionError=null,this.writtenDocs=new Set}async lookup(e){if(this.ensureCommitNotCalled(),this.mutations.length>0)throw this.lastTransactionError=new V(k.INVALID_ARGUMENT,"Firestore transactions require all reads to be executed before all writes."),this.lastTransactionError;const t=await async function(i,r){const o=Y(i),l={documents:r.map(m=>Uo(o.serializer,m))},c=await o.Lo("BatchGetDocuments",o.serializer.databaseId,ye.emptyPath(),l,r.length),h=new Map;c.forEach(m=>{const p=ZT(o.serializer,m);h.set(p.key.toString(),p)});const d=[];return r.forEach(m=>{const p=h.get(m.toString());oe(!!p),d.push(p)}),d}(this.datastore,e);return t.forEach(s=>this.recordVersion(s)),t}set(e,t){this.write(t.toMutation(e,this.precondition(e))),this.writtenDocs.add(e.toString())}update(e,t){try{this.write(t.toMutation(e,this.preconditionForUpdate(e)))}catch(s){this.lastTransactionError=s}this.writtenDocs.add(e.toString())}delete(e){this.write(new Fc(e,this.precondition(e))),this.writtenDocs.add(e.toString())}async commit(){if(this.ensureCommitNotCalled(),this.lastTransactionError)throw this.lastTransactionError;const e=this.readVersions;this.mutations.forEach(t=>{e.delete(t.key.toString())}),e.forEach((t,s)=>{const i=$.fromPath(s);this.mutations.push(new vp(i,this.precondition(i)))}),await async function(s,i){const r=Y(s),o={writes:i.map(l=>Ap(r.serializer,l))};await r.Mo("Commit",r.serializer.databaseId,ye.emptyPath(),o)}(this.datastore,this.mutations),this.committed=!0}recordVersion(e){let t;if(e.isFoundDocument())t=e.version;else{if(!e.isNoDocument())throw z();t=K.min()}const s=this.readVersions.get(e.key.toString());if(s){if(!t.isEqual(s))throw new V(k.ABORTED,"Document version changed between two reads.")}else this.readVersions.set(e.key.toString(),t)}precondition(e){const t=this.readVersions.get(e.toString());return!this.writtenDocs.has(e.toString())&&t?t.isEqual(K.min())?ut.exists(!1):ut.updateTime(t):ut.none()}preconditionForUpdate(e){const t=this.readVersions.get(e.toString());if(!this.writtenDocs.has(e.toString())&&t){if(t.isEqual(K.min()))throw new V(k.INVALID_ARGUMENT,"Can't update a document that doesn't exist.");return ut.updateTime(t)}return ut.exists(!0)}write(e){this.ensureCommitNotCalled(),this.mutations.push(e)}ensureCommitNotCalled(){}}/**
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
 */class C0{constructor(e,t,s,i,r){this.asyncQueue=e,this.datastore=t,this.options=s,this.updateFunction=i,this.deferred=r,this._u=s.maxAttempts,this.t_=new zc(this.asyncQueue,"transaction_retry")}au(){this._u-=1,this.uu()}uu(){this.t_.Go(async()=>{const e=new b0(this.datastore),t=this.cu(e);t&&t.then(s=>{this.asyncQueue.enqueueAndForget(()=>e.commit().then(()=>{this.deferred.resolve(s)}).catch(i=>{this.lu(i)}))}).catch(s=>{this.lu(s)})})}cu(e){try{const t=this.updateFunction(e);return!wr(t)&&t.catch&&t.then?t:(this.deferred.reject(Error("Transaction callback must return a Promise")),null)}catch(t){return this.deferred.reject(t),null}}lu(e){this._u>0&&this.hu(e)?(this._u-=1,this.asyncQueue.enqueueAndForget(()=>(this.uu(),Promise.resolve()))):this.deferred.reject(e)}hu(e){if(e.name==="FirebaseError"){const t=e.code;return t==="aborted"||t==="failed-precondition"||t==="already-exists"||!Ep(t)}return!1}}/**
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
 */class R0{constructor(e,t,s,i,r){this.authCredentials=e,this.appCheckCredentials=t,this.asyncQueue=s,this.databaseInfo=i,this.user=tt.UNAUTHENTICATED,this.clientId=Ym.newId(),this.authCredentialListener=()=>Promise.resolve(),this.appCheckCredentialListener=()=>Promise.resolve(),this._uninitializedComponentsProvider=r,this.authCredentials.start(s,async o=>{B("FirestoreClient","Received user=",o.uid),await this.authCredentialListener(o),this.user=o}),this.appCheckCredentials.start(s,o=>(B("FirestoreClient","Received new app check token=",o),this.appCheckCredentialListener(o,this.user)))}get configuration(){return{asyncQueue:this.asyncQueue,databaseInfo:this.databaseInfo,clientId:this.clientId,authCredentials:this.authCredentials,appCheckCredentials:this.appCheckCredentials,initialUser:this.user,maxConcurrentLimboResolutions:100}}setCredentialChangeListener(e){this.authCredentialListener=e}setAppCheckTokenChangeListener(e){this.appCheckCredentialListener=e}terminate(){this.asyncQueue.enterRestrictedMode();const e=new Vt;return this.asyncQueue.enqueueAndForgetEvenWhileRestricted(async()=>{try{this._onlineComponents&&await this._onlineComponents.terminate(),this._offlineComponents&&await this._offlineComponents.terminate(),this.authCredentials.shutdown(),this.appCheckCredentials.shutdown(),e.resolve()}catch(t){const s=Xc(t,"Failed to shutdown persistence");e.reject(s)}}),e.promise}}async function vl(n,e){n.asyncQueue.verifyOperationInProgress(),B("FirestoreClient","Initializing OfflineComponentProvider");const t=n.configuration;await e.initialize(t);let s=t.initialUser;n.setCredentialChangeListener(async i=>{s.isEqual(i)||(await Dp(e.localStore,i),s=i)}),e.persistence.setDatabaseDeletedListener(()=>n.terminate()),n._offlineComponents=e}async function Qd(n,e){n.asyncQueue.verifyOperationInProgress();const t=await S0(n);B("FirestoreClient","Initializing OnlineComponentProvider"),await e.initialize(t,n.configuration),n.setCredentialChangeListener(s=>Wd(e.remoteStore,s)),n.setAppCheckTokenChangeListener((s,i)=>Wd(e.remoteStore,i)),n._onlineComponents=e}async function S0(n){if(!n._offlineComponents)if(n._uninitializedComponentsProvider){B("FirestoreClient","Using user provided OfflineComponentProvider");try{await vl(n,n._uninitializedComponentsProvider._offline)}catch(e){const t=e;if(!function(i){return i.name==="FirebaseError"?i.code===k.FAILED_PRECONDITION||i.code===k.UNIMPLEMENTED:!(typeof DOMException<"u"&&i instanceof DOMException)||i.code===22||i.code===20||i.code===11}(t))throw t;Bs("Error using user provided cache. Falling back to memory cache: "+t),await vl(n,new $o)}}else B("FirestoreClient","Using default OfflineComponentProvider"),await vl(n,new $o);return n._offlineComponents}async function eh(n){return n._onlineComponents||(n._uninitializedComponentsProvider?(B("FirestoreClient","Using user provided OnlineComponentProvider"),await Qd(n,n._uninitializedComponentsProvider._online)):(B("FirestoreClient","Using default OnlineComponentProvider"),await Qd(n,new Jl))),n._onlineComponents}function A0(n){return eh(n).then(e=>e.syncEngine)}function k0(n){return eh(n).then(e=>e.datastore)}async function Zp(n){const e=await eh(n),t=e.eventManager;return t.onListen=u0.bind(null,e.syncEngine),t.onUnlisten=m0.bind(null,e.syncEngine),t.onFirstRemoteStoreListen=d0.bind(null,e.syncEngine),t.onLastRemoteStoreUnlisten=p0.bind(null,e.syncEngine),t}function P0(n,e,t={}){const s=new Vt;return n.asyncQueue.enqueueAndForget(async()=>function(r,o,l,c,h){const d=new Jp({next:p=>{d.Za(),o.enqueueAndForget(()=>$p(r,m));const E=p.docs.has(l);!E&&p.fromCache?h.reject(new V(k.UNAVAILABLE,"Failed to get document because the client is offline.")):E&&p.fromCache&&c&&c.source==="server"?h.reject(new V(k.UNAVAILABLE,'Failed to get document from server. (However, this document does exist in the local cache. Run again without setting source to "server" to retrieve the cached document.)')):h.resolve(p)},error:p=>h.reject(p)}),m=new Wp(Oc(l.path),d,{includeMetadataChanges:!0,_a:!0});return jp(r,m)}(await Zp(n),n.asyncQueue,e,t,s)),s.promise}function N0(n,e,t={}){const s=new Vt;return n.asyncQueue.enqueueAndForget(async()=>function(r,o,l,c,h){const d=new Jp({next:p=>{d.Za(),o.enqueueAndForget(()=>$p(r,m)),p.fromCache&&c.source==="server"?h.reject(new V(k.UNAVAILABLE,'Failed to get documents from server. (However, these documents may exist in the local cache. Run again without setting source to "server" to retrieve the cached documents.)')):h.resolve(p)},error:p=>h.reject(p)}),m=new Wp(l,d,{includeMetadataChanges:!0,_a:!0});return jp(r,m)}(await Zp(n),n.asyncQueue,e,t,s)),s.promise}/**
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
 */function eg(n){const e={};return n.timeoutSeconds!==void 0&&(e.timeoutSeconds=n.timeoutSeconds),e}/**
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
 */const Yd=new Map;/**
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
 */function tg(n,e,t){if(!t)throw new V(k.INVALID_ARGUMENT,`Function ${n}() cannot be called with an empty ${e}.`)}function D0(n,e,t,s){if(e===!0&&s===!0)throw new V(k.INVALID_ARGUMENT,`${n} and ${t} cannot be used together.`)}function Xd(n){if(!$.isDocumentKey(n))throw new V(k.INVALID_ARGUMENT,`Invalid document reference. Document references must have an even number of segments, but ${n} has ${n.length}.`)}function Jd(n){if($.isDocumentKey(n))throw new V(k.INVALID_ARGUMENT,`Invalid collection reference. Collection references must have an odd number of segments, but ${n} has ${n.length}.`)}function Ca(n){if(n===void 0)return"undefined";if(n===null)return"null";if(typeof n=="string")return n.length>20&&(n=`${n.substring(0,20)}...`),JSON.stringify(n);if(typeof n=="number"||typeof n=="boolean")return""+n;if(typeof n=="object"){if(n instanceof Array)return"an array";{const e=function(s){return s.constructor?s.constructor.name:null}(n);return e?`a custom ${e} object`:"an object"}}return typeof n=="function"?"a function":z()}function jt(n,e){if("_delegate"in n&&(n=n._delegate),!(n instanceof e)){if(e.name===n.constructor.name)throw new V(k.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{const t=Ca(n);throw new V(k.INVALID_ARGUMENT,`Expected type '${e.name}', but it was: ${t}`)}}return n}/**
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
 */class Zd{constructor(e){var t,s;if(e.host===void 0){if(e.ssl!==void 0)throw new V(k.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host="firestore.googleapis.com",this.ssl=!0}else this.host=e.host,this.ssl=(t=e.ssl)===null||t===void 0||t;if(this.credentials=e.credentials,this.ignoreUndefinedProperties=!!e.ignoreUndefinedProperties,this.localCache=e.localCache,e.cacheSizeBytes===void 0)this.cacheSizeBytes=41943040;else{if(e.cacheSizeBytes!==-1&&e.cacheSizeBytes<1048576)throw new V(k.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=e.cacheSizeBytes}D0("experimentalForceLongPolling",e.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",e.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!e.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:e.experimentalAutoDetectLongPolling===void 0?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!e.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=eg((s=e.experimentalLongPollingOptions)!==null&&s!==void 0?s:{}),function(r){if(r.timeoutSeconds!==void 0){if(isNaN(r.timeoutSeconds))throw new V(k.INVALID_ARGUMENT,`invalid long polling timeout: ${r.timeoutSeconds} (must not be NaN)`);if(r.timeoutSeconds<5)throw new V(k.INVALID_ARGUMENT,`invalid long polling timeout: ${r.timeoutSeconds} (minimum allowed value is 5)`);if(r.timeoutSeconds>30)throw new V(k.INVALID_ARGUMENT,`invalid long polling timeout: ${r.timeoutSeconds} (maximum allowed value is 30)`)}}(this.experimentalLongPollingOptions),this.useFetchStreams=!!e.useFetchStreams}isEqual(e){return this.host===e.host&&this.ssl===e.ssl&&this.credentials===e.credentials&&this.cacheSizeBytes===e.cacheSizeBytes&&this.experimentalForceLongPolling===e.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===e.experimentalAutoDetectLongPolling&&function(s,i){return s.timeoutSeconds===i.timeoutSeconds}(this.experimentalLongPollingOptions,e.experimentalLongPollingOptions)&&this.ignoreUndefinedProperties===e.ignoreUndefinedProperties&&this.useFetchStreams===e.useFetchStreams}}class Ra{constructor(e,t,s,i){this._authCredentials=e,this._appCheckCredentials=t,this._databaseId=s,this._app=i,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new Zd({}),this._settingsFrozen=!1,this._terminateTask="notTerminated"}get app(){if(!this._app)throw new V(k.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return this._terminateTask!=="notTerminated"}_setSettings(e){if(this._settingsFrozen)throw new V(k.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new Zd(e),e.credentials!==void 0&&(this._authCredentials=function(s){if(!s)return new Qw;switch(s.type){case"firstParty":return new Zw(s.sessionIndex||"0",s.iamToken||null,s.authTokenFactory||null);case"provider":return s.client;default:throw new V(k.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}}(e.credentials))}_getSettings(){return this._settings}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask==="notTerminated"&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){this._terminateTask==="notTerminated"?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return function(t){const s=Yd.get(t);s&&(B("ComponentProvider","Removing Datastore"),Yd.delete(t),s.terminate())}(this),Promise.resolve()}}function x0(n,e,t,s={}){var i;const r=(n=jt(n,Ra))._getSettings(),o=`${e}:${t}`;if(r.host!=="firestore.googleapis.com"&&r.host!==o&&Bs("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used."),n._setSettings(Object.assign(Object.assign({},r),{host:o,ssl:!1})),s.mockUserToken){let l,c;if(typeof s.mockUserToken=="string")l=s.mockUserToken,c=tt.MOCK_USER;else{l=sm(s.mockUserToken,(i=n._app)===null||i===void 0?void 0:i.options.projectId);const h=s.mockUserToken.sub||s.mockUserToken.user_id;if(!h)throw new V(k.INVALID_ARGUMENT,"mockUserToken must contain 'sub' or 'user_id' field!");c=new tt(h)}n._authCredentials=new Yw(new Qm(l,c))}}/**
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
 */class ps{constructor(e,t,s){this.converter=t,this._query=s,this.type="query",this.firestore=e}withConverter(e){return new ps(this.firestore,e,this._query)}}class nt{constructor(e,t,s){this.converter=t,this._key=s,this.type="document",this.firestore=e}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new Sn(this.firestore,this.converter,this._key.path.popLast())}withConverter(e){return new nt(this.firestore,e,this._key)}}class Sn extends ps{constructor(e,t,s){super(e,t,Oc(s)),this._path=s,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){const e=this._path.popLast();return e.isEmpty()?null:new nt(this.firestore,null,new $(e))}withConverter(e){return new Sn(this.firestore,e,this._path)}}function ao(n,e,...t){if(n=me(n),tg("collection","path",e),n instanceof Ra){const s=ye.fromString(e,...t);return Jd(s),new Sn(n,null,s)}{if(!(n instanceof nt||n instanceof Sn))throw new V(k.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const s=n._path.child(ye.fromString(e,...t));return Jd(s),new Sn(n.firestore,null,s)}}function Kt(n,e,...t){if(n=me(n),arguments.length===1&&(e=Ym.newId()),tg("doc","path",e),n instanceof Ra){const s=ye.fromString(e,...t);return Xd(s),new nt(n,null,new $(s))}{if(!(n instanceof nt||n instanceof Sn))throw new V(k.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const s=n._path.child(ye.fromString(e,...t));return Xd(s),new nt(n.firestore,n instanceof Sn?n.converter:null,new $(s))}}/**
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
 */class ef{constructor(e=Promise.resolve()){this.Pu=[],this.Iu=!1,this.Tu=[],this.Eu=null,this.du=!1,this.Au=!1,this.Ru=[],this.t_=new zc(this,"async_queue_retry"),this.Vu=()=>{const s=yl();s&&B("AsyncQueue","Visibility state changed to "+s.visibilityState),this.t_.jo()},this.mu=e;const t=yl();t&&typeof t.addEventListener=="function"&&t.addEventListener("visibilitychange",this.Vu)}get isShuttingDown(){return this.Iu}enqueueAndForget(e){this.enqueue(e)}enqueueAndForgetEvenWhileRestricted(e){this.fu(),this.gu(e)}enterRestrictedMode(e){if(!this.Iu){this.Iu=!0,this.Au=e||!1;const t=yl();t&&typeof t.removeEventListener=="function"&&t.removeEventListener("visibilitychange",this.Vu)}}enqueue(e){if(this.fu(),this.Iu)return new Promise(()=>{});const t=new Vt;return this.gu(()=>this.Iu&&this.Au?Promise.resolve():(e().then(t.resolve,t.reject),t.promise)).then(()=>t.promise)}enqueueRetryable(e){this.enqueueAndForget(()=>(this.Pu.push(e),this.pu()))}async pu(){if(this.Pu.length!==0){try{await this.Pu[0](),this.Pu.shift(),this.t_.reset()}catch(e){if(!Er(e))throw e;B("AsyncQueue","Operation failed with retryable error: "+e)}this.Pu.length>0&&this.t_.Go(()=>this.pu())}}gu(e){const t=this.mu.then(()=>(this.du=!0,e().catch(s=>{this.Eu=s,this.du=!1;const i=function(o){let l=o.message||"";return o.stack&&(l=o.stack.includes(o.message)?o.stack:o.message+`
`+o.stack),l}(s);throw on("INTERNAL UNHANDLED ERROR: ",i),s}).then(s=>(this.du=!1,s))));return this.mu=t,t}enqueueAfterDelay(e,t,s){this.fu(),this.Ru.indexOf(e)>-1&&(t=0);const i=Yc.createAndSchedule(this,e,t,s,r=>this.yu(r));return this.Tu.push(i),i}fu(){this.Eu&&z()}verifyOperationInProgress(){}async wu(){let e;do e=this.mu,await e;while(e!==this.mu)}Su(e){for(const t of this.Tu)if(t.timerId===e)return!0;return!1}bu(e){return this.wu().then(()=>{this.Tu.sort((t,s)=>t.targetTimeMs-s.targetTimeMs);for(const t of this.Tu)if(t.skipDelay(),e!=="all"&&t.timerId===e)break;return this.wu()})}Du(e){this.Ru.push(e)}yu(e){const t=this.Tu.indexOf(e);this.Tu.splice(t,1)}}class ii extends Ra{constructor(e,t,s,i){super(e,t,s,i),this.type="firestore",this._queue=new ef,this._persistenceKey=(i==null?void 0:i.name)||"[DEFAULT]"}async _terminate(){if(this._firestoreClient){const e=this._firestoreClient.terminate();this._queue=new ef(e),this._firestoreClient=void 0,await e}}}function M0(n,e){const t=typeof n=="object"?n:_c(),s=typeof n=="string"?n:"(default)",i=fa(t,"firestore").getImmediate({identifier:s});if(!i._initialized){const r=em("firestore");r&&x0(i,...r)}return i}function Sa(n){if(n._terminated)throw new V(k.FAILED_PRECONDITION,"The client has already been terminated.");return n._firestoreClient||L0(n),n._firestoreClient}function L0(n){var e,t,s;const i=n._freezeSettings(),r=function(l,c,h,d){return new dT(l,c,h,d.host,d.ssl,d.experimentalForceLongPolling,d.experimentalAutoDetectLongPolling,eg(d.experimentalLongPollingOptions),d.useFetchStreams)}(n._databaseId,((e=n._app)===null||e===void 0?void 0:e.options.appId)||"",n._persistenceKey,i);n._componentsProvider||!((t=i.localCache)===null||t===void 0)&&t._offlineComponentProvider&&(!((s=i.localCache)===null||s===void 0)&&s._onlineComponentProvider)&&(n._componentsProvider={_offline:i.localCache._offlineComponentProvider,_online:i.localCache._onlineComponentProvider}),n._firestoreClient=new R0(n._authCredentials,n._appCheckCredentials,n._queue,r,n._componentsProvider&&function(l){const c=l==null?void 0:l._online.build();return{_offline:l==null?void 0:l._offline.build(c),_online:c}}(n._componentsProvider))}/**
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
 */class ls{constructor(e){this._byteString=e}static fromBase64String(e){try{return new ls(Ke.fromBase64String(e))}catch(t){throw new V(k.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+t)}}static fromUint8Array(e){return new ls(Ke.fromUint8Array(e))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(e){return this._byteString.isEqual(e._byteString)}}/**
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
 */class Sr{constructor(...e){for(let t=0;t<e.length;++t)if(e[t].length===0)throw new V(k.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new He(e)}isEqual(e){return this._internalPath.isEqual(e._internalPath)}}/**
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
 */class th{constructor(e){this._methodName=e}}/**
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
 */class nh{constructor(e,t){if(!isFinite(e)||e<-90||e>90)throw new V(k.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+e);if(!isFinite(t)||t<-180||t>180)throw new V(k.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+t);this._lat=e,this._long=t}get latitude(){return this._lat}get longitude(){return this._long}isEqual(e){return this._lat===e._lat&&this._long===e._long}toJSON(){return{latitude:this._lat,longitude:this._long}}_compareTo(e){return ce(this._lat,e._lat)||ce(this._long,e._long)}}/**
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
 */class sh{constructor(e){this._values=(e||[]).map(t=>t)}toArray(){return this._values.map(e=>e)}isEqual(e){return function(s,i){if(s.length!==i.length)return!1;for(let r=0;r<s.length;++r)if(s[r]!==i[r])return!1;return!0}(this._values,e._values)}}/**
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
 */const O0=/^__.*__$/;class V0{constructor(e,t,s){this.data=e,this.fieldMask=t,this.fieldTransforms=s}toMutation(e,t){return this.fieldMask!==null?new Bn(e,this.data,this.fieldMask,t,this.fieldTransforms):new Ir(e,this.data,t,this.fieldTransforms)}}class ng{constructor(e,t,s){this.data=e,this.fieldMask=t,this.fieldTransforms=s}toMutation(e,t){return new Bn(e,this.data,this.fieldMask,t,this.fieldTransforms)}}function sg(n){switch(n){case 0:case 2:case 1:return!0;case 3:case 4:return!1;default:throw z()}}class ih{constructor(e,t,s,i,r,o){this.settings=e,this.databaseId=t,this.serializer=s,this.ignoreUndefinedProperties=i,r===void 0&&this.vu(),this.fieldTransforms=r||[],this.fieldMask=o||[]}get path(){return this.settings.path}get Cu(){return this.settings.Cu}Fu(e){return new ih(Object.assign(Object.assign({},this.settings),e),this.databaseId,this.serializer,this.ignoreUndefinedProperties,this.fieldTransforms,this.fieldMask)}Mu(e){var t;const s=(t=this.path)===null||t===void 0?void 0:t.child(e),i=this.Fu({path:s,xu:!1});return i.Ou(e),i}Nu(e){var t;const s=(t=this.path)===null||t===void 0?void 0:t.child(e),i=this.Fu({path:s,xu:!1});return i.vu(),i}Lu(e){return this.Fu({path:void 0,xu:!0})}Bu(e){return Wo(e,this.settings.methodName,this.settings.ku||!1,this.path,this.settings.qu)}contains(e){return this.fieldMask.find(t=>e.isPrefixOf(t))!==void 0||this.fieldTransforms.find(t=>e.isPrefixOf(t.field))!==void 0}vu(){if(this.path)for(let e=0;e<this.path.length;e++)this.Ou(this.path.get(e))}Ou(e){if(e.length===0)throw this.Bu("Document fields must not be empty");if(sg(this.Cu)&&O0.test(e))throw this.Bu('Document fields cannot begin and end with "__"')}}class F0{constructor(e,t,s){this.databaseId=e,this.ignoreUndefinedProperties=t,this.serializer=s||Ta(e)}Qu(e,t,s,i=!1){return new ih({Cu:e,methodName:t,qu:s,path:He.emptyPath(),xu:!1,ku:i},this.databaseId,this.serializer,this.ignoreUndefinedProperties)}}function Aa(n){const e=n._freezeSettings(),t=Ta(n._databaseId);return new F0(n._databaseId,!!e.ignoreUndefinedProperties,t)}function ig(n,e,t,s,i,r={}){const o=n.Qu(r.merge||r.mergeFields?2:0,e,t,i);rh("Data must be an object, but it was:",o,s);const l=ag(s,o);let c,h;if(r.merge)c=new Et(o.fieldMask),h=o.fieldTransforms;else if(r.mergeFields){const d=[];for(const m of r.mergeFields){const p=Zl(e,m,t);if(!o.contains(p))throw new V(k.INVALID_ARGUMENT,`Field '${p}' is specified in your field mask but missing from your input data.`);cg(d,p)||d.push(p)}c=new Et(d),h=o.fieldTransforms.filter(m=>c.covers(m.field))}else c=null,h=o.fieldTransforms;return new V0(new ht(l),c,h)}class ka extends th{_toFieldTransform(e){if(e.Cu!==2)throw e.Cu===1?e.Bu(`${this._methodName}() can only appear at the top level of your update data`):e.Bu(`${this._methodName}() cannot be used with set() unless you pass {merge:true}`);return e.fieldMask.push(e.path),null}isEqual(e){return e instanceof ka}}function rg(n,e,t,s){const i=n.Qu(1,e,t);rh("Data must be an object, but it was:",i,s);const r=[],o=ht.empty();fs(s,(c,h)=>{const d=oh(e,c,t);h=me(h);const m=i.Nu(d);if(h instanceof ka)r.push(d);else{const p=Ar(h,m);p!=null&&(r.push(d),o.set(d,p))}});const l=new Et(r);return new ng(o,l,i.fieldTransforms)}function og(n,e,t,s,i,r){const o=n.Qu(1,e,t),l=[Zl(e,s,t)],c=[i];if(r.length%2!=0)throw new V(k.INVALID_ARGUMENT,`Function ${e}() needs to be called with an even number of arguments that alternate between field names and values.`);for(let p=0;p<r.length;p+=2)l.push(Zl(e,r[p])),c.push(r[p+1]);const h=[],d=ht.empty();for(let p=l.length-1;p>=0;--p)if(!cg(h,l[p])){const E=l[p];let b=c[p];b=me(b);const S=o.Nu(E);if(b instanceof ka)h.push(E);else{const P=Ar(b,S);P!=null&&(h.push(E),d.set(E,P))}}const m=new Et(h);return new ng(d,m,o.fieldTransforms)}function B0(n,e,t,s=!1){return Ar(t,n.Qu(s?4:3,e))}function Ar(n,e){if(lg(n=me(n)))return rh("Unsupported field value:",e,n),ag(n,e);if(n instanceof th)return function(s,i){if(!sg(i.Cu))throw i.Bu(`${s._methodName}() can only be used with update() and set()`);if(!i.path)throw i.Bu(`${s._methodName}() is not currently supported inside arrays`);const r=s._toFieldTransform(i);r&&i.fieldTransforms.push(r)}(n,e),null;if(n===void 0&&e.ignoreUndefinedProperties)return null;if(e.path&&e.fieldMask.push(e.path),n instanceof Array){if(e.settings.xu&&e.Cu!==4)throw e.Bu("Nested arrays are not supported");return function(s,i){const r=[];let o=0;for(const l of s){let c=Ar(l,i.Lu(o));c==null&&(c={nullValue:"NULL_VALUE"}),r.push(c),o++}return{arrayValue:{values:r}}}(n,e)}return function(s,i){if((s=me(s))===null)return{nullValue:"NULL_VALUE"};if(typeof s=="number")return MT(i.serializer,s);if(typeof s=="boolean")return{booleanValue:s};if(typeof s=="string")return{stringValue:s};if(s instanceof Date){const r=Ve.fromDate(s);return{timestampValue:Bo(i.serializer,r)}}if(s instanceof Ve){const r=new Ve(s.seconds,1e3*Math.floor(s.nanoseconds/1e3));return{timestampValue:Bo(i.serializer,r)}}if(s instanceof nh)return{geoPointValue:{latitude:s.latitude,longitude:s.longitude}};if(s instanceof ls)return{bytesValue:bp(i.serializer,s._byteString)};if(s instanceof nt){const r=i.databaseId,o=s.firestore._databaseId;if(!o.isEqual(r))throw i.Bu(`Document reference is for database ${o.projectId}/${o.database} but should be for database ${r.projectId}/${r.database}`);return{referenceValue:jc(s.firestore._databaseId||i.databaseId,s._key.path)}}if(s instanceof sh)return function(o,l){return{mapValue:{fields:{__type__:{stringValue:"__vector__"},value:{arrayValue:{values:o.toArray().map(c=>{if(typeof c!="number")throw l.Bu("VectorValues must only contain numeric values.");return Vc(l.serializer,c)})}}}}}}(s,i);throw i.Bu(`Unsupported field value: ${Ca(s)}`)}(n,e)}function ag(n,e){const t={};return Xm(n)?e.path&&e.path.length>0&&e.fieldMask.push(e.path):fs(n,(s,i)=>{const r=Ar(i,e.Mu(s));r!=null&&(t[s]=r)}),{mapValue:{fields:t}}}function lg(n){return!(typeof n!="object"||n===null||n instanceof Array||n instanceof Date||n instanceof Ve||n instanceof nh||n instanceof ls||n instanceof nt||n instanceof th||n instanceof sh)}function rh(n,e,t){if(!lg(t)||!function(i){return typeof i=="object"&&i!==null&&(Object.getPrototypeOf(i)===Object.prototype||Object.getPrototypeOf(i)===null)}(t)){const s=Ca(t);throw s==="an object"?e.Bu(n+" a custom object"):e.Bu(n+" "+s)}}function Zl(n,e,t){if((e=me(e))instanceof Sr)return e._internalPath;if(typeof e=="string")return oh(n,e);throw Wo("Field path arguments must be of type string or ",n,!1,void 0,t)}const U0=new RegExp("[~\\*/\\[\\]]");function oh(n,e,t){if(e.search(U0)>=0)throw Wo(`Invalid field path (${e}). Paths must not contain '~', '*', '/', '[', or ']'`,n,!1,void 0,t);try{return new Sr(...e.split("."))._internalPath}catch{throw Wo(`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,n,!1,void 0,t)}}function Wo(n,e,t,s,i){const r=s&&!s.isEmpty(),o=i!==void 0;let l=`Function ${e}() called with invalid data`;t&&(l+=" (via `toFirestore()`)"),l+=". ";let c="";return(r||o)&&(c+=" (found",r&&(c+=` in field ${s}`),o&&(c+=` in document ${i}`),c+=")"),new V(k.INVALID_ARGUMENT,l+n+c)}function cg(n,e){return n.some(t=>t.isEqual(e))}/**
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
 */class qo{constructor(e,t,s,i,r){this._firestore=e,this._userDataWriter=t,this._key=s,this._document=i,this._converter=r}get id(){return this._key.path.lastSegment()}get ref(){return new nt(this._firestore,this._converter,this._key)}exists(){return this._document!==null}data(){if(this._document){if(this._converter){const e=new j0(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(e)}return this._userDataWriter.convertValue(this._document.data.value)}}get(e){if(this._document){const t=this._document.data.field(ah("DocumentSnapshot.get",e));if(t!==null)return this._userDataWriter.convertValue(t)}}}class j0 extends qo{data(){return super.data()}}function ah(n,e){return typeof e=="string"?oh(n,e):e instanceof Sr?e._internalPath:e._delegate._internalPath}/**
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
 */function $0(n){if(n.limitType==="L"&&n.explicitOrderBy.length===0)throw new V(k.UNIMPLEMENTED,"limitToLast() queries require specifying at least one orderBy() clause")}class lh{}let hg=class extends lh{};function tf(n,e,...t){let s=[];e instanceof lh&&s.push(e),s=s.concat(t),function(r){const o=r.filter(c=>c instanceof ch).length,l=r.filter(c=>c instanceof Pa).length;if(o>1||o>0&&l>0)throw new V(k.INVALID_ARGUMENT,"InvalidQuery. When using composite filters, you cannot use more than one filter at the top level. Consider nesting the multiple filters within an `and(...)` statement. For example: change `query(query, where(...), or(...))` to `query(query, and(where(...), or(...)))`.")}(s);for(const i of s)n=i._apply(n);return n}class Pa extends hg{constructor(e,t,s){super(),this._field=e,this._op=t,this._value=s,this.type="where"}static _create(e,t,s){return new Pa(e,t,s)}_apply(e){const t=this._parse(e);return ug(e._query,t),new ps(e.firestore,e.converter,zl(e._query,t))}_parse(e){const t=Aa(e.firestore);return function(r,o,l,c,h,d,m){let p;if(h.isKeyField()){if(d==="array-contains"||d==="array-contains-any")throw new V(k.INVALID_ARGUMENT,`Invalid Query. You can't perform '${d}' queries on documentId().`);if(d==="in"||d==="not-in"){rf(m,d);const E=[];for(const b of m)E.push(sf(c,r,b));p={arrayValue:{values:E}}}else p=sf(c,r,m)}else d!=="in"&&d!=="not-in"&&d!=="array-contains-any"||rf(m,d),p=B0(l,o,m,d==="in"||d==="not-in");return xe.create(h,d,p)}(e._query,"where",t,e.firestore._databaseId,this._field,this._op,this._value)}}function nf(n,e,t){const s=e,i=ah("where",n);return Pa._create(i,s,t)}class ch extends lh{constructor(e,t){super(),this.type=e,this._queryConstraints=t}static _create(e,t){return new ch(e,t)}_parse(e){const t=this._queryConstraints.map(s=>s._parse(e)).filter(s=>s.getFilters().length>0);return t.length===1?t[0]:Dt.create(t,this._getOperator())}_apply(e){const t=this._parse(e);return t.getFilters().length===0?e:(function(i,r){let o=i;const l=r.getFlattenedFilters();for(const c of l)ug(o,c),o=zl(o,c)}(e._query,t),new ps(e.firestore,e.converter,zl(e._query,t)))}_getQueryConstraints(){return this._queryConstraints}_getOperator(){return this.type==="and"?"and":"or"}}class hh extends hg{constructor(e,t,s){super(),this.type=e,this._limit=t,this._limitType=s}static _create(e,t,s){return new hh(e,t,s)}_apply(e){return new ps(e.firestore,e.converter,Oo(e._query,this._limit,this._limitType))}}function W0(n){return hh._create("limit",n,"F")}function sf(n,e,t){if(typeof(t=me(t))=="string"){if(t==="")throw new V(k.INVALID_ARGUMENT,"Invalid query. When querying with documentId(), you must provide a valid document ID, but it was an empty string.");if(!op(e)&&t.indexOf("/")!==-1)throw new V(k.INVALID_ARGUMENT,`Invalid query. When querying a collection by documentId(), you must provide a plain document ID, but '${t}' contains a '/' character.`);const s=e.path.child(ye.fromString(t));if(!$.isDocumentKey(s))throw new V(k.INVALID_ARGUMENT,`Invalid query. When querying a collection group by documentId(), the value provided must result in a valid document path, but '${s}' is not because it has an odd number of segments (${s.length}).`);return Id(n,new $(s))}if(t instanceof nt)return Id(n,t._key);throw new V(k.INVALID_ARGUMENT,`Invalid query. When querying with documentId(), you must provide a valid string or a DocumentReference, but it was: ${Ca(t)}.`)}function rf(n,e){if(!Array.isArray(n)||n.length===0)throw new V(k.INVALID_ARGUMENT,`Invalid Query. A non-empty array is required for '${e.toString()}' filters.`)}function ug(n,e){const t=function(i,r){for(const o of i)for(const l of o.getFlattenedFilters())if(r.indexOf(l.op)>=0)return l.op;return null}(n.filters,function(i){switch(i){case"!=":return["!=","not-in"];case"array-contains-any":case"in":return["not-in"];case"not-in":return["array-contains-any","in","not-in","!="];default:return[]}}(e.op));if(t!==null)throw t===e.op?new V(k.INVALID_ARGUMENT,`Invalid query. You cannot use more than one '${e.op.toString()}' filter.`):new V(k.INVALID_ARGUMENT,`Invalid query. You cannot use '${e.op.toString()}' filters with '${t.toString()}' filters.`)}class dg{convertValue(e,t="none"){switch(as(e)){case 0:return null;case 1:return e.booleanValue;case 2:return Pe(e.integerValue||e.doubleValue);case 3:return this.convertTimestamp(e.timestampValue);case 4:return this.convertServerTimestamp(e,t);case 5:return e.stringValue;case 6:return this.convertBytes(os(e.bytesValue));case 7:return this.convertReference(e.referenceValue);case 8:return this.convertGeoPoint(e.geoPointValue);case 9:return this.convertArray(e.arrayValue,t);case 11:return this.convertObject(e.mapValue,t);case 10:return this.convertVectorValue(e.mapValue);default:throw z()}}convertObject(e,t){return this.convertObjectMap(e.fields,t)}convertObjectMap(e,t="none"){const s={};return fs(e,(i,r)=>{s[i]=this.convertValue(r,t)}),s}convertVectorValue(e){var t,s,i;const r=(i=(s=(t=e.fields)===null||t===void 0?void 0:t.value.arrayValue)===null||s===void 0?void 0:s.values)===null||i===void 0?void 0:i.map(o=>Pe(o.doubleValue));return new sh(r)}convertGeoPoint(e){return new nh(Pe(e.latitude),Pe(e.longitude))}convertArray(e,t){return(e.values||[]).map(s=>this.convertValue(s,t))}convertServerTimestamp(e,t){switch(t){case"previous":const s=Dc(e);return s==null?null:this.convertValue(s,t);case"estimate":return this.convertTimestamp(nr(e));default:return null}}convertTimestamp(e){const t=Dn(e);return new Ve(t.seconds,t.nanos)}convertDocumentKey(e,t){const s=ye.fromString(e);oe(Np(s));const i=new sr(s.get(1),s.get(3)),r=new $(s.popFirst(5));return i.isEqual(t)||on(`Document ${r} contains a document reference within a different database (${i.projectId}/${i.database}) which is not supported. It will be treated as a reference in the current database (${t.projectId}/${t.database}) instead.`),r}}/**
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
 */function fg(n,e,t){let s;return s=n?t&&(t.merge||t.mergeFields)?n.toFirestore(e,t):n.toFirestore(e):e,s}class q0 extends dg{constructor(e){super(),this.firestore=e}convertBytes(e){return new ls(e)}convertReference(e){const t=this.convertDocumentKey(e,this.firestore._databaseId);return new nt(this.firestore,null,t)}}/**
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
 */class As{constructor(e,t){this.hasPendingWrites=e,this.fromCache=t}isEqual(e){return this.hasPendingWrites===e.hasPendingWrites&&this.fromCache===e.fromCache}}class uh extends qo{constructor(e,t,s,i,r,o){super(e,t,s,i,o),this._firestore=e,this._firestoreImpl=e,this.metadata=r}exists(){return super.exists()}data(e={}){if(this._document){if(this._converter){const t=new vo(this._firestore,this._userDataWriter,this._key,this._document,this.metadata,null);return this._converter.fromFirestore(t,e)}return this._userDataWriter.convertValue(this._document.data.value,e.serverTimestamps)}}get(e,t={}){if(this._document){const s=this._document.data.field(ah("DocumentSnapshot.get",e));if(s!==null)return this._userDataWriter.convertValue(s,t.serverTimestamps)}}}class vo extends uh{data(e={}){return super.data(e)}}class z0{constructor(e,t,s,i){this._firestore=e,this._userDataWriter=t,this._snapshot=i,this.metadata=new As(i.hasPendingWrites,i.fromCache),this.query=s}get docs(){const e=[];return this.forEach(t=>e.push(t)),e}get size(){return this._snapshot.docs.size}get empty(){return this.size===0}forEach(e,t){this._snapshot.docs.forEach(s=>{e.call(t,new vo(this._firestore,this._userDataWriter,s.key,s,new As(this._snapshot.mutatedKeys.has(s.key),this._snapshot.fromCache),this.query.converter))})}docChanges(e={}){const t=!!e.includeMetadataChanges;if(t&&this._snapshot.excludesMetadataChanges)throw new V(k.INVALID_ARGUMENT,"To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");return this._cachedChanges&&this._cachedChangesIncludeMetadataChanges===t||(this._cachedChanges=function(i,r){if(i._snapshot.oldDocs.isEmpty()){let o=0;return i._snapshot.docChanges.map(l=>{const c=new vo(i._firestore,i._userDataWriter,l.doc.key,l.doc,new As(i._snapshot.mutatedKeys.has(l.doc.key),i._snapshot.fromCache),i.query.converter);return l.doc,{type:"added",doc:c,oldIndex:-1,newIndex:o++}})}{let o=i._snapshot.oldDocs;return i._snapshot.docChanges.filter(l=>r||l.type!==3).map(l=>{const c=new vo(i._firestore,i._userDataWriter,l.doc.key,l.doc,new As(i._snapshot.mutatedKeys.has(l.doc.key),i._snapshot.fromCache),i.query.converter);let h=-1,d=-1;return l.type!==0&&(h=o.indexOf(l.doc.key),o=o.delete(l.doc.key)),l.type!==1&&(o=o.add(l.doc),d=o.indexOf(l.doc.key)),{type:H0(l.type),doc:c,oldIndex:h,newIndex:d}})}}(this,t),this._cachedChangesIncludeMetadataChanges=t),this._cachedChanges}}function H0(n){switch(n){case 0:return"added";case 2:case 3:return"modified";case 1:return"removed";default:return z()}}/**
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
 */function El(n){n=jt(n,nt);const e=jt(n.firestore,ii);return P0(Sa(e),n._key).then(t=>G0(e,n,t))}class dh extends dg{constructor(e){super(),this.firestore=e}convertBytes(e){return new ls(e)}convertReference(e){const t=this.convertDocumentKey(e,this.firestore._databaseId);return new nt(this.firestore,null,t)}}function wl(n){n=jt(n,ps);const e=jt(n.firestore,ii),t=Sa(e),s=new dh(e);return $0(n._query),N0(t,n._query).then(i=>new z0(e,s,n,i))}function Tl(n,e,t){n=jt(n,nt);const s=jt(n.firestore,ii),i=fg(n.converter,e,t);return mg(s,[ig(Aa(s),"setDoc",n._key,i,n.converter!==null,t).toMutation(n._key,ut.none())])}function of(n,e,t,...s){n=jt(n,nt);const i=jt(n.firestore,ii),r=Aa(i);let o;return o=typeof(e=me(e))=="string"||e instanceof Sr?og(r,"updateDoc",n._key,e,t,s):rg(r,"updateDoc",n._key,e),mg(i,[o.toMutation(n._key,ut.exists(!0))])}function mg(n,e){return function(s,i){const r=new Vt;return s.asyncQueue.enqueueAndForget(async()=>g0(await A0(s),i,r)),r.promise}(Sa(n),e)}function G0(n,e,t){const s=t.docs.get(e._key),i=new dh(n);return new uh(n,i,e._key,s,new As(t.hasPendingWrites,t.fromCache),e.converter)}/**
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
 */const K0={maxAttempts:5};function Pi(n,e){if((n=me(n)).firestore!==e)throw new V(k.INVALID_ARGUMENT,"Provided document reference is from a different Firestore instance.");return n}/**
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
 *//**
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
 */class Q0 extends class{constructor(t,s){this._firestore=t,this._transaction=s,this._dataReader=Aa(t)}get(t){const s=Pi(t,this._firestore),i=new q0(this._firestore);return this._transaction.lookup([s._key]).then(r=>{if(!r||r.length!==1)return z();const o=r[0];if(o.isFoundDocument())return new qo(this._firestore,i,o.key,o,s.converter);if(o.isNoDocument())return new qo(this._firestore,i,s._key,null,s.converter);throw z()})}set(t,s,i){const r=Pi(t,this._firestore),o=fg(r.converter,s,i),l=ig(this._dataReader,"Transaction.set",r._key,o,r.converter!==null,i);return this._transaction.set(r._key,l),this}update(t,s,i,...r){const o=Pi(t,this._firestore);let l;return l=typeof(s=me(s))=="string"||s instanceof Sr?og(this._dataReader,"Transaction.update",o._key,s,i,r):rg(this._dataReader,"Transaction.update",o._key,s),this._transaction.update(o._key,l),this}delete(t){const s=Pi(t,this._firestore);return this._transaction.delete(s._key),this}}{constructor(e,t){super(e,t),this._firestore=e}get(e){const t=Pi(e,this._firestore),s=new dh(this._firestore);return super.get(e).then(i=>new uh(this._firestore,s,t._key,i._document,new As(!1,!1),t.converter))}}function Y0(n,e,t){n=jt(n,ii);const s=Object.assign(Object.assign({},K0),t);return function(r){if(r.maxAttempts<1)throw new V(k.INVALID_ARGUMENT,"Max attempts must be at least 1")}(s),function(r,o,l){const c=new Vt;return r.asyncQueue.enqueueAndForget(async()=>{const h=await k0(r);new C0(r.asyncQueue,h,l,o,c).au()}),c.promise}(Sa(n),i=>e(new Q0(n,i)),s)}(function(e,t=!0){(function(i){ti=i})(ds),ss(new Pn("firestore",(s,{instanceIdentifier:i,options:r})=>{const o=s.getProvider("app").getImmediate(),l=new ii(new Xw(s.getProvider("auth-internal")),new tT(s.getProvider("app-check-internal")),function(h,d){if(!Object.prototype.hasOwnProperty.apply(h.options,["projectId"]))throw new V(k.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new sr(h.options.projectId,d)}(o,i),o);return r=Object.assign({useFetchStreams:t},r),l._setSettings(r),l},"PUBLIC").setMultipleInstances(!0)),Lt(yd,"4.7.3",e),Lt(yd,"4.7.3","esm2017")})();var af={};const lf="@firebase/database",cf="1.0.8";/**
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
 */let pg="";function X0(n){pg=n}/**
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
 */class J0{constructor(e){this.domStorage_=e,this.prefix_="firebase:"}set(e,t){t==null?this.domStorage_.removeItem(this.prefixedName_(e)):this.domStorage_.setItem(this.prefixedName_(e),Oe(t))}get(e){const t=this.domStorage_.getItem(this.prefixedName_(e));return t==null?null:Ji(t)}remove(e){this.domStorage_.removeItem(this.prefixedName_(e))}prefixedName_(e){return this.prefix_+e}toString(){return this.domStorage_.toString()}}/**
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
 */class Z0{constructor(){this.cache_={},this.isInMemoryStorage=!0}set(e,t){t==null?delete this.cache_[e]:this.cache_[e]=t}get(e){return $t(this.cache_,e)?this.cache_[e]:null}remove(e){delete this.cache_[e]}}/**
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
 */const gg=function(n){try{if(typeof window<"u"&&typeof window[n]<"u"){const e=window[n];return e.setItem("firebase:sentinel","cache"),e.removeItem("firebase:sentinel"),new J0(e)}}catch{}return new Z0},Jn=gg("localStorage"),eb=gg("sessionStorage");/**
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
 */const Ms=new da("@firebase/database"),tb=function(){let n=1;return function(){return n++}}(),_g=function(n){const e=Uy(n),t=new Oy;t.update(e);const s=t.digest();return mc.encodeByteArray(s)},kr=function(...n){let e="";for(let t=0;t<n.length;t++){const s=n[t];Array.isArray(s)||s&&typeof s=="object"&&typeof s.length=="number"?e+=kr.apply(null,s):typeof s=="object"?e+=Oe(s):e+=s,e+=" "}return e};let qi=null,hf=!0;const nb=function(n,e){M(!0,"Can't turn on custom loggers persistently."),Ms.logLevel=te.VERBOSE,qi=Ms.log.bind(Ms)},$e=function(...n){if(hf===!0&&(hf=!1,qi===null&&eb.get("logging_enabled")===!0&&nb()),qi){const e=kr.apply(null,n);qi(e)}},Pr=function(n){return function(...e){$e(n,...e)}},ec=function(...n){const e="FIREBASE INTERNAL ERROR: "+kr(...n);Ms.error(e)},ln=function(...n){const e=`FIREBASE FATAL ERROR: ${kr(...n)}`;throw Ms.error(e),new Error(e)},ft=function(...n){const e="FIREBASE WARNING: "+kr(...n);Ms.warn(e)},sb=function(){typeof window<"u"&&window.location&&window.location.protocol&&window.location.protocol.indexOf("https:")!==-1&&ft("Insecure Firebase access from a secure page. Please use https in calls to new Firebase().")},Na=function(n){return typeof n=="number"&&(n!==n||n===Number.POSITIVE_INFINITY||n===Number.NEGATIVE_INFINITY)},ib=function(n){if(document.readyState==="complete")n();else{let e=!1;const t=function(){if(!document.body){setTimeout(t,Math.floor(10));return}e||(e=!0,n())};document.addEventListener?(document.addEventListener("DOMContentLoaded",t,!1),window.addEventListener("load",t,!1)):document.attachEvent&&(document.attachEvent("onreadystatechange",()=>{document.readyState==="complete"&&t()}),window.attachEvent("onload",t))}},cs="[MIN_NAME]",Mn="[MAX_NAME]",gs=function(n,e){if(n===e)return 0;if(n===cs||e===Mn)return-1;if(e===cs||n===Mn)return 1;{const t=uf(n),s=uf(e);return t!==null?s!==null?t-s===0?n.length-e.length:t-s:-1:s!==null?1:n<e?-1:1}},rb=function(n,e){return n===e?0:n<e?-1:1},Ni=function(n,e){if(e&&n in e)return e[n];throw new Error("Missing required key ("+n+") in object: "+Oe(e))},fh=function(n){if(typeof n!="object"||n===null)return Oe(n);const e=[];for(const s in n)e.push(s);e.sort();let t="{";for(let s=0;s<e.length;s++)s!==0&&(t+=","),t+=Oe(e[s]),t+=":",t+=fh(n[e[s]]);return t+="}",t},yg=function(n,e){const t=n.length;if(t<=e)return[n];const s=[];for(let i=0;i<t;i+=e)i+e>t?s.push(n.substring(i,t)):s.push(n.substring(i,i+e));return s};function We(n,e){for(const t in n)n.hasOwnProperty(t)&&e(t,n[t])}const vg=function(n){M(!Na(n),"Invalid JSON number");const e=11,t=52,s=(1<<e-1)-1;let i,r,o,l,c;n===0?(r=0,o=0,i=1/n===-1/0?1:0):(i=n<0,n=Math.abs(n),n>=Math.pow(2,1-s)?(l=Math.min(Math.floor(Math.log(n)/Math.LN2),s),r=l+s,o=Math.round(n*Math.pow(2,t-l)-Math.pow(2,t))):(r=0,o=Math.round(n/Math.pow(2,1-s-t))));const h=[];for(c=t;c;c-=1)h.push(o%2?1:0),o=Math.floor(o/2);for(c=e;c;c-=1)h.push(r%2?1:0),r=Math.floor(r/2);h.push(i?1:0),h.reverse();const d=h.join("");let m="";for(c=0;c<64;c+=8){let p=parseInt(d.substr(c,8),2).toString(16);p.length===1&&(p="0"+p),m=m+p}return m.toLowerCase()},ob=function(){return!!(typeof window=="object"&&window.chrome&&window.chrome.extension&&!/^chrome/.test(window.location.href))},ab=function(){return typeof Windows=="object"&&typeof Windows.UI=="object"};function lb(n,e){let t="Unknown Error";n==="too_big"?t="The data requested exceeds the maximum size that can be accessed with a single request.":n==="permission_denied"?t="Client doesn't have permission to access the desired data.":n==="unavailable"&&(t="The service is unavailable");const s=new Error(n+" at "+e._path.toString()+": "+t);return s.code=n.toUpperCase(),s}const cb=new RegExp("^-?(0*)\\d{1,10}$"),hb=-2147483648,ub=2147483647,uf=function(n){if(cb.test(n)){const e=Number(n);if(e>=hb&&e<=ub)return e}return null},ri=function(n){try{n()}catch(e){setTimeout(()=>{const t=e.stack||"";throw ft("Exception was thrown by user callback.",t),e},Math.floor(0))}},db=function(){return(typeof window=="object"&&window.navigator&&window.navigator.userAgent||"").search(/googlebot|google webmaster tools|bingbot|yahoo! slurp|baiduspider|yandexbot|duckduckbot/i)>=0},zi=function(n,e){const t=setTimeout(n,e);return typeof t=="number"&&typeof Deno<"u"&&Deno.unrefTimer?Deno.unrefTimer(t):typeof t=="object"&&t.unref&&t.unref(),t};/**
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
 */class fb{constructor(e,t){this.appName_=e,this.appCheckProvider=t,this.appCheck=t==null?void 0:t.getImmediate({optional:!0}),this.appCheck||t==null||t.get().then(s=>this.appCheck=s)}getToken(e){return this.appCheck?this.appCheck.getToken(e):new Promise((t,s)=>{setTimeout(()=>{this.appCheck?this.getToken(e).then(t,s):t(null)},0)})}addTokenChangeListener(e){var t;(t=this.appCheckProvider)===null||t===void 0||t.get().then(s=>s.addTokenListener(e))}notifyForInvalidToken(){ft(`Provided AppCheck credentials for the app named "${this.appName_}" are invalid. This usually indicates your app was not initialized correctly.`)}}/**
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
 */class mb{constructor(e,t,s){this.appName_=e,this.firebaseOptions_=t,this.authProvider_=s,this.auth_=null,this.auth_=s.getImmediate({optional:!0}),this.auth_||s.onInit(i=>this.auth_=i)}getToken(e){return this.auth_?this.auth_.getToken(e).catch(t=>t&&t.code==="auth/token-not-initialized"?($e("Got auth/token-not-initialized error.  Treating as null token."),null):Promise.reject(t)):new Promise((t,s)=>{setTimeout(()=>{this.auth_?this.getToken(e).then(t,s):t(null)},0)})}addTokenChangeListener(e){this.auth_?this.auth_.addAuthTokenListener(e):this.authProvider_.get().then(t=>t.addAuthTokenListener(e))}removeTokenChangeListener(e){this.authProvider_.get().then(t=>t.removeAuthTokenListener(e))}notifyForInvalidToken(){let e='Provided authentication credentials for the app named "'+this.appName_+'" are invalid. This usually indicates your app was not initialized correctly. ';"credential"in this.firebaseOptions_?e+='Make sure the "credential" property provided to initializeApp() is authorized to access the specified "databaseURL" and is from the correct project.':"serviceAccount"in this.firebaseOptions_?e+='Make sure the "serviceAccount" property provided to initializeApp() is authorized to access the specified "databaseURL" and is from the correct project.':e+='Make sure the "apiKey" and "databaseURL" properties provided to initializeApp() match the values provided for your app at https://console.firebase.google.com/.',ft(e)}}class Eo{constructor(e){this.accessToken=e}getToken(e){return Promise.resolve({accessToken:this.accessToken})}addTokenChangeListener(e){e(this.accessToken)}removeTokenChangeListener(e){}notifyForInvalidToken(){}}Eo.OWNER="owner";/**
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
 */const mh="5",Eg="v",wg="s",Tg="r",Ig="f",bg=/(console\.firebase|firebase-console-\w+\.corp|firebase\.corp)\.google\.com/,Cg="ls",Rg="p",tc="ac",Sg="websocket",Ag="long_polling";/**
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
 */class kg{constructor(e,t,s,i,r=!1,o="",l=!1,c=!1){this.secure=t,this.namespace=s,this.webSocketOnly=i,this.nodeAdmin=r,this.persistenceKey=o,this.includeNamespaceInQueryParams=l,this.isUsingEmulator=c,this._host=e.toLowerCase(),this._domain=this._host.substr(this._host.indexOf(".")+1),this.internalHost=Jn.get("host:"+e)||this._host}isCacheableHost(){return this.internalHost.substr(0,2)==="s-"}isCustomHost(){return this._domain!=="firebaseio.com"&&this._domain!=="firebaseio-demo.com"}get host(){return this._host}set host(e){e!==this.internalHost&&(this.internalHost=e,this.isCacheableHost()&&Jn.set("host:"+this._host,this.internalHost))}toString(){let e=this.toURLString();return this.persistenceKey&&(e+="<"+this.persistenceKey+">"),e}toURLString(){const e=this.secure?"https://":"http://",t=this.includeNamespaceInQueryParams?`?ns=${this.namespace}`:"";return`${e}${this.host}/${t}`}}function pb(n){return n.host!==n.internalHost||n.isCustomHost()||n.includeNamespaceInQueryParams}function Pg(n,e,t){M(typeof e=="string","typeof type must == string"),M(typeof t=="object","typeof params must == object");let s;if(e===Sg)s=(n.secure?"wss://":"ws://")+n.internalHost+"/.ws?";else if(e===Ag)s=(n.secure?"https://":"http://")+n.internalHost+"/.lp?";else throw new Error("Unknown connection type: "+e);pb(n)&&(t.ns=n.namespace);const i=[];return We(t,(r,o)=>{i.push(r+"="+o)}),s+i.join("&")}/**
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
 */class gb{constructor(){this.counters_={}}incrementCounter(e,t=1){$t(this.counters_,e)||(this.counters_[e]=0),this.counters_[e]+=t}get(){return _y(this.counters_)}}/**
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
 */const Il={},bl={};function ph(n){const e=n.toString();return Il[e]||(Il[e]=new gb),Il[e]}function _b(n,e){const t=n.toString();return bl[t]||(bl[t]=e()),bl[t]}/**
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
 */class yb{constructor(e){this.onMessage_=e,this.pendingResponses=[],this.currentResponseNum=0,this.closeAfterResponse=-1,this.onClose=null}closeAfter(e,t){this.closeAfterResponse=e,this.onClose=t,this.closeAfterResponse<this.currentResponseNum&&(this.onClose(),this.onClose=null)}handleResponse(e,t){for(this.pendingResponses[e]=t;this.pendingResponses[this.currentResponseNum];){const s=this.pendingResponses[this.currentResponseNum];delete this.pendingResponses[this.currentResponseNum];for(let i=0;i<s.length;++i)s[i]&&ri(()=>{this.onMessage_(s[i])});if(this.currentResponseNum===this.closeAfterResponse){this.onClose&&(this.onClose(),this.onClose=null);break}this.currentResponseNum++}}}/**
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
 */const df="start",vb="close",Eb="pLPCommand",wb="pRTLPCB",Ng="id",Dg="pw",xg="ser",Tb="cb",Ib="seg",bb="ts",Cb="d",Rb="dframe",Mg=1870,Lg=30,Sb=Mg-Lg,Ab=25e3,kb=3e4;class ks{constructor(e,t,s,i,r,o,l){this.connId=e,this.repoInfo=t,this.applicationId=s,this.appCheckToken=i,this.authToken=r,this.transportSessionId=o,this.lastSessionId=l,this.bytesSent=0,this.bytesReceived=0,this.everConnected_=!1,this.log_=Pr(e),this.stats_=ph(t),this.urlFn=c=>(this.appCheckToken&&(c[tc]=this.appCheckToken),Pg(t,Ag,c))}open(e,t){this.curSegmentNum=0,this.onDisconnect_=t,this.myPacketOrderer=new yb(e),this.isClosed_=!1,this.connectTimeoutTimer_=setTimeout(()=>{this.log_("Timed out trying to connect."),this.onClosed_(),this.connectTimeoutTimer_=null},Math.floor(kb)),ib(()=>{if(this.isClosed_)return;this.scriptTagHolder=new gh((...r)=>{const[o,l,c,h,d]=r;if(this.incrementIncomingBytes_(r),!!this.scriptTagHolder)if(this.connectTimeoutTimer_&&(clearTimeout(this.connectTimeoutTimer_),this.connectTimeoutTimer_=null),this.everConnected_=!0,o===df)this.id=l,this.password=c;else if(o===vb)l?(this.scriptTagHolder.sendNewPolls=!1,this.myPacketOrderer.closeAfter(l,()=>{this.onClosed_()})):this.onClosed_();else throw new Error("Unrecognized command received: "+o)},(...r)=>{const[o,l]=r;this.incrementIncomingBytes_(r),this.myPacketOrderer.handleResponse(o,l)},()=>{this.onClosed_()},this.urlFn);const s={};s[df]="t",s[xg]=Math.floor(Math.random()*1e8),this.scriptTagHolder.uniqueCallbackIdentifier&&(s[Tb]=this.scriptTagHolder.uniqueCallbackIdentifier),s[Eg]=mh,this.transportSessionId&&(s[wg]=this.transportSessionId),this.lastSessionId&&(s[Cg]=this.lastSessionId),this.applicationId&&(s[Rg]=this.applicationId),this.appCheckToken&&(s[tc]=this.appCheckToken),typeof location<"u"&&location.hostname&&bg.test(location.hostname)&&(s[Tg]=Ig);const i=this.urlFn(s);this.log_("Connecting via long-poll to "+i),this.scriptTagHolder.addTag(i,()=>{})})}start(){this.scriptTagHolder.startLongPoll(this.id,this.password),this.addDisconnectPingFrame(this.id,this.password)}static forceAllow(){ks.forceAllow_=!0}static forceDisallow(){ks.forceDisallow_=!0}static isAvailable(){return ks.forceAllow_?!0:!ks.forceDisallow_&&typeof document<"u"&&document.createElement!=null&&!ob()&&!ab()}markConnectionHealthy(){}shutdown_(){this.isClosed_=!0,this.scriptTagHolder&&(this.scriptTagHolder.close(),this.scriptTagHolder=null),this.myDisconnFrame&&(document.body.removeChild(this.myDisconnFrame),this.myDisconnFrame=null),this.connectTimeoutTimer_&&(clearTimeout(this.connectTimeoutTimer_),this.connectTimeoutTimer_=null)}onClosed_(){this.isClosed_||(this.log_("Longpoll is closing itself"),this.shutdown_(),this.onDisconnect_&&(this.onDisconnect_(this.everConnected_),this.onDisconnect_=null))}close(){this.isClosed_||(this.log_("Longpoll is being closed."),this.shutdown_())}send(e){const t=Oe(e);this.bytesSent+=t.length,this.stats_.incrementCounter("bytes_sent",t.length);const s=Xf(t),i=yg(s,Sb);for(let r=0;r<i.length;r++)this.scriptTagHolder.enqueueSegment(this.curSegmentNum,i.length,i[r]),this.curSegmentNum++}addDisconnectPingFrame(e,t){this.myDisconnFrame=document.createElement("iframe");const s={};s[Rb]="t",s[Ng]=e,s[Dg]=t,this.myDisconnFrame.src=this.urlFn(s),this.myDisconnFrame.style.display="none",document.body.appendChild(this.myDisconnFrame)}incrementIncomingBytes_(e){const t=Oe(e).length;this.bytesReceived+=t,this.stats_.incrementCounter("bytes_received",t)}}class gh{constructor(e,t,s,i){this.onDisconnect=s,this.urlFn=i,this.outstandingRequests=new Set,this.pendingSegs=[],this.currentSerial=Math.floor(Math.random()*1e8),this.sendNewPolls=!0;{this.uniqueCallbackIdentifier=tb(),window[Eb+this.uniqueCallbackIdentifier]=e,window[wb+this.uniqueCallbackIdentifier]=t,this.myIFrame=gh.createIFrame_();let r="";this.myIFrame.src&&this.myIFrame.src.substr(0,11)==="javascript:"&&(r='<script>document.domain="'+document.domain+'";<\/script>');const o="<html><body>"+r+"</body></html>";try{this.myIFrame.doc.open(),this.myIFrame.doc.write(o),this.myIFrame.doc.close()}catch(l){$e("frame writing exception"),l.stack&&$e(l.stack),$e(l)}}}static createIFrame_(){const e=document.createElement("iframe");if(e.style.display="none",document.body){document.body.appendChild(e);try{e.contentWindow.document||$e("No IE domain setting required")}catch{const s=document.domain;e.src="javascript:void((function(){document.open();document.domain='"+s+"';document.close();})())"}}else throw"Document body has not initialized. Wait to initialize Firebase until after the document is ready.";return e.contentDocument?e.doc=e.contentDocument:e.contentWindow?e.doc=e.contentWindow.document:e.document&&(e.doc=e.document),e}close(){this.alive=!1,this.myIFrame&&(this.myIFrame.doc.body.textContent="",setTimeout(()=>{this.myIFrame!==null&&(document.body.removeChild(this.myIFrame),this.myIFrame=null)},Math.floor(0)));const e=this.onDisconnect;e&&(this.onDisconnect=null,e())}startLongPoll(e,t){for(this.myID=e,this.myPW=t,this.alive=!0;this.newRequest_(););}newRequest_(){if(this.alive&&this.sendNewPolls&&this.outstandingRequests.size<(this.pendingSegs.length>0?2:1)){this.currentSerial++;const e={};e[Ng]=this.myID,e[Dg]=this.myPW,e[xg]=this.currentSerial;let t=this.urlFn(e),s="",i=0;for(;this.pendingSegs.length>0&&this.pendingSegs[0].d.length+Lg+s.length<=Mg;){const o=this.pendingSegs.shift();s=s+"&"+Ib+i+"="+o.seg+"&"+bb+i+"="+o.ts+"&"+Cb+i+"="+o.d,i++}return t=t+s,this.addLongPollTag_(t,this.currentSerial),!0}else return!1}enqueueSegment(e,t,s){this.pendingSegs.push({seg:e,ts:t,d:s}),this.alive&&this.newRequest_()}addLongPollTag_(e,t){this.outstandingRequests.add(t);const s=()=>{this.outstandingRequests.delete(t),this.newRequest_()},i=setTimeout(s,Math.floor(Ab)),r=()=>{clearTimeout(i),s()};this.addTag(e,r)}addTag(e,t){setTimeout(()=>{try{if(!this.sendNewPolls)return;const s=this.myIFrame.doc.createElement("script");s.type="text/javascript",s.async=!0,s.src=e,s.onload=s.onreadystatechange=function(){const i=s.readyState;(!i||i==="loaded"||i==="complete")&&(s.onload=s.onreadystatechange=null,s.parentNode&&s.parentNode.removeChild(s),t())},s.onerror=()=>{$e("Long-poll script failed to load: "+e),this.sendNewPolls=!1,this.close()},this.myIFrame.doc.body.appendChild(s)}catch{}},Math.floor(1))}}/**
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
 */const Pb=16384,Nb=45e3;let zo=null;typeof MozWebSocket<"u"?zo=MozWebSocket:typeof WebSocket<"u"&&(zo=WebSocket);class At{constructor(e,t,s,i,r,o,l){this.connId=e,this.applicationId=s,this.appCheckToken=i,this.authToken=r,this.keepaliveTimer=null,this.frames=null,this.totalFrames=0,this.bytesSent=0,this.bytesReceived=0,this.log_=Pr(this.connId),this.stats_=ph(t),this.connURL=At.connectionURL_(t,o,l,i,s),this.nodeAdmin=t.nodeAdmin}static connectionURL_(e,t,s,i,r){const o={};return o[Eg]=mh,typeof location<"u"&&location.hostname&&bg.test(location.hostname)&&(o[Tg]=Ig),t&&(o[wg]=t),s&&(o[Cg]=s),i&&(o[tc]=i),r&&(o[Rg]=r),Pg(e,Sg,o)}open(e,t){this.onDisconnect=t,this.onMessage=e,this.log_("Websocket connecting to "+this.connURL),this.everConnected_=!1,Jn.set("previous_websocket_failure",!0);try{let s;Sy(),this.mySock=new zo(this.connURL,[],s)}catch(s){this.log_("Error instantiating WebSocket.");const i=s.message||s.data;i&&this.log_(i),this.onClosed_();return}this.mySock.onopen=()=>{this.log_("Websocket connected."),this.everConnected_=!0},this.mySock.onclose=()=>{this.log_("Websocket connection was disconnected."),this.mySock=null,this.onClosed_()},this.mySock.onmessage=s=>{this.handleIncomingFrame(s)},this.mySock.onerror=s=>{this.log_("WebSocket error.  Closing connection.");const i=s.message||s.data;i&&this.log_(i),this.onClosed_()}}start(){}static forceDisallow(){At.forceDisallow_=!0}static isAvailable(){let e=!1;if(typeof navigator<"u"&&navigator.userAgent){const t=/Android ([0-9]{0,}\.[0-9]{0,})/,s=navigator.userAgent.match(t);s&&s.length>1&&parseFloat(s[1])<4.4&&(e=!0)}return!e&&zo!==null&&!At.forceDisallow_}static previouslyFailed(){return Jn.isInMemoryStorage||Jn.get("previous_websocket_failure")===!0}markConnectionHealthy(){Jn.remove("previous_websocket_failure")}appendFrame_(e){if(this.frames.push(e),this.frames.length===this.totalFrames){const t=this.frames.join("");this.frames=null;const s=Ji(t);this.onMessage(s)}}handleNewFrameCount_(e){this.totalFrames=e,this.frames=[]}extractFrameCount_(e){if(M(this.frames===null,"We already have a frame buffer"),e.length<=6){const t=Number(e);if(!isNaN(t))return this.handleNewFrameCount_(t),null}return this.handleNewFrameCount_(1),e}handleIncomingFrame(e){if(this.mySock===null)return;const t=e.data;if(this.bytesReceived+=t.length,this.stats_.incrementCounter("bytes_received",t.length),this.resetKeepAlive(),this.frames!==null)this.appendFrame_(t);else{const s=this.extractFrameCount_(t);s!==null&&this.appendFrame_(s)}}send(e){this.resetKeepAlive();const t=Oe(e);this.bytesSent+=t.length,this.stats_.incrementCounter("bytes_sent",t.length);const s=yg(t,Pb);s.length>1&&this.sendString_(String(s.length));for(let i=0;i<s.length;i++)this.sendString_(s[i])}shutdown_(){this.isClosed_=!0,this.keepaliveTimer&&(clearInterval(this.keepaliveTimer),this.keepaliveTimer=null),this.mySock&&(this.mySock.close(),this.mySock=null)}onClosed_(){this.isClosed_||(this.log_("WebSocket is closing itself"),this.shutdown_(),this.onDisconnect&&(this.onDisconnect(this.everConnected_),this.onDisconnect=null))}close(){this.isClosed_||(this.log_("WebSocket is being closed"),this.shutdown_())}resetKeepAlive(){clearInterval(this.keepaliveTimer),this.keepaliveTimer=setInterval(()=>{this.mySock&&this.sendString_("0"),this.resetKeepAlive()},Math.floor(Nb))}sendString_(e){try{this.mySock.send(e)}catch(t){this.log_("Exception thrown from WebSocket.send():",t.message||t.data,"Closing connection."),setTimeout(this.onClosed_.bind(this),0)}}}At.responsesRequiredToBeHealthy=2;At.healthyTimeout=3e4;/**
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
 */class ar{constructor(e){this.initTransports_(e)}static get ALL_TRANSPORTS(){return[ks,At]}static get IS_TRANSPORT_INITIALIZED(){return this.globalTransportInitialized_}initTransports_(e){const t=At&&At.isAvailable();let s=t&&!At.previouslyFailed();if(e.webSocketOnly&&(t||ft("wss:// URL used, but browser isn't known to support websockets.  Trying anyway."),s=!0),s)this.transports_=[At];else{const i=this.transports_=[];for(const r of ar.ALL_TRANSPORTS)r&&r.isAvailable()&&i.push(r);ar.globalTransportInitialized_=!0}}initialTransport(){if(this.transports_.length>0)return this.transports_[0];throw new Error("No transports available")}upgradeTransport(){return this.transports_.length>1?this.transports_[1]:null}}ar.globalTransportInitialized_=!1;/**
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
 */const Db=6e4,xb=5e3,Mb=10*1024,Lb=100*1024,Cl="t",ff="d",Ob="s",mf="r",Vb="e",pf="o",gf="a",_f="n",yf="p",Fb="h";class Bb{constructor(e,t,s,i,r,o,l,c,h,d){this.id=e,this.repoInfo_=t,this.applicationId_=s,this.appCheckToken_=i,this.authToken_=r,this.onMessage_=o,this.onReady_=l,this.onDisconnect_=c,this.onKill_=h,this.lastSessionId=d,this.connectionCount=0,this.pendingDataMessages=[],this.state_=0,this.log_=Pr("c:"+this.id+":"),this.transportManager_=new ar(t),this.log_("Connection created"),this.start_()}start_(){const e=this.transportManager_.initialTransport();this.conn_=new e(this.nextTransportId_(),this.repoInfo_,this.applicationId_,this.appCheckToken_,this.authToken_,null,this.lastSessionId),this.primaryResponsesRequired_=e.responsesRequiredToBeHealthy||0;const t=this.connReceiver_(this.conn_),s=this.disconnReceiver_(this.conn_);this.tx_=this.conn_,this.rx_=this.conn_,this.secondaryConn_=null,this.isHealthy_=!1,setTimeout(()=>{this.conn_&&this.conn_.open(t,s)},Math.floor(0));const i=e.healthyTimeout||0;i>0&&(this.healthyTimeout_=zi(()=>{this.healthyTimeout_=null,this.isHealthy_||(this.conn_&&this.conn_.bytesReceived>Lb?(this.log_("Connection exceeded healthy timeout but has received "+this.conn_.bytesReceived+" bytes.  Marking connection healthy."),this.isHealthy_=!0,this.conn_.markConnectionHealthy()):this.conn_&&this.conn_.bytesSent>Mb?this.log_("Connection exceeded healthy timeout but has sent "+this.conn_.bytesSent+" bytes.  Leaving connection alive."):(this.log_("Closing unhealthy connection after timeout."),this.close()))},Math.floor(i)))}nextTransportId_(){return"c:"+this.id+":"+this.connectionCount++}disconnReceiver_(e){return t=>{e===this.conn_?this.onConnectionLost_(t):e===this.secondaryConn_?(this.log_("Secondary connection lost."),this.onSecondaryConnectionLost_()):this.log_("closing an old connection")}}connReceiver_(e){return t=>{this.state_!==2&&(e===this.rx_?this.onPrimaryMessageReceived_(t):e===this.secondaryConn_?this.onSecondaryMessageReceived_(t):this.log_("message on old connection"))}}sendRequest(e){const t={t:"d",d:e};this.sendData_(t)}tryCleanupConnection(){this.tx_===this.secondaryConn_&&this.rx_===this.secondaryConn_&&(this.log_("cleaning up and promoting a connection: "+this.secondaryConn_.connId),this.conn_=this.secondaryConn_,this.secondaryConn_=null)}onSecondaryControl_(e){if(Cl in e){const t=e[Cl];t===gf?this.upgradeIfSecondaryHealthy_():t===mf?(this.log_("Got a reset on secondary, closing it"),this.secondaryConn_.close(),(this.tx_===this.secondaryConn_||this.rx_===this.secondaryConn_)&&this.close()):t===pf&&(this.log_("got pong on secondary."),this.secondaryResponsesRequired_--,this.upgradeIfSecondaryHealthy_())}}onSecondaryMessageReceived_(e){const t=Ni("t",e),s=Ni("d",e);if(t==="c")this.onSecondaryControl_(s);else if(t==="d")this.pendingDataMessages.push(s);else throw new Error("Unknown protocol layer: "+t)}upgradeIfSecondaryHealthy_(){this.secondaryResponsesRequired_<=0?(this.log_("Secondary connection is healthy."),this.isHealthy_=!0,this.secondaryConn_.markConnectionHealthy(),this.proceedWithUpgrade_()):(this.log_("sending ping on secondary."),this.secondaryConn_.send({t:"c",d:{t:yf,d:{}}}))}proceedWithUpgrade_(){this.secondaryConn_.start(),this.log_("sending client ack on secondary"),this.secondaryConn_.send({t:"c",d:{t:gf,d:{}}}),this.log_("Ending transmission on primary"),this.conn_.send({t:"c",d:{t:_f,d:{}}}),this.tx_=this.secondaryConn_,this.tryCleanupConnection()}onPrimaryMessageReceived_(e){const t=Ni("t",e),s=Ni("d",e);t==="c"?this.onControl_(s):t==="d"&&this.onDataMessage_(s)}onDataMessage_(e){this.onPrimaryResponse_(),this.onMessage_(e)}onPrimaryResponse_(){this.isHealthy_||(this.primaryResponsesRequired_--,this.primaryResponsesRequired_<=0&&(this.log_("Primary connection is healthy."),this.isHealthy_=!0,this.conn_.markConnectionHealthy()))}onControl_(e){const t=Ni(Cl,e);if(ff in e){const s=e[ff];if(t===Fb){const i=Object.assign({},s);this.repoInfo_.isUsingEmulator&&(i.h=this.repoInfo_.host),this.onHandshake_(i)}else if(t===_f){this.log_("recvd end transmission on primary"),this.rx_=this.secondaryConn_;for(let i=0;i<this.pendingDataMessages.length;++i)this.onDataMessage_(this.pendingDataMessages[i]);this.pendingDataMessages=[],this.tryCleanupConnection()}else t===Ob?this.onConnectionShutdown_(s):t===mf?this.onReset_(s):t===Vb?ec("Server Error: "+s):t===pf?(this.log_("got pong on primary."),this.onPrimaryResponse_(),this.sendPingOnPrimaryIfNecessary_()):ec("Unknown control packet command: "+t)}}onHandshake_(e){const t=e.ts,s=e.v,i=e.h;this.sessionId=e.s,this.repoInfo_.host=i,this.state_===0&&(this.conn_.start(),this.onConnectionEstablished_(this.conn_,t),mh!==s&&ft("Protocol version mismatch detected"),this.tryStartUpgrade_())}tryStartUpgrade_(){const e=this.transportManager_.upgradeTransport();e&&this.startUpgrade_(e)}startUpgrade_(e){this.secondaryConn_=new e(this.nextTransportId_(),this.repoInfo_,this.applicationId_,this.appCheckToken_,this.authToken_,this.sessionId),this.secondaryResponsesRequired_=e.responsesRequiredToBeHealthy||0;const t=this.connReceiver_(this.secondaryConn_),s=this.disconnReceiver_(this.secondaryConn_);this.secondaryConn_.open(t,s),zi(()=>{this.secondaryConn_&&(this.log_("Timed out trying to upgrade."),this.secondaryConn_.close())},Math.floor(Db))}onReset_(e){this.log_("Reset packet received.  New host: "+e),this.repoInfo_.host=e,this.state_===1?this.close():(this.closeConnections_(),this.start_())}onConnectionEstablished_(e,t){this.log_("Realtime connection established."),this.conn_=e,this.state_=1,this.onReady_&&(this.onReady_(t,this.sessionId),this.onReady_=null),this.primaryResponsesRequired_===0?(this.log_("Primary connection is healthy."),this.isHealthy_=!0):zi(()=>{this.sendPingOnPrimaryIfNecessary_()},Math.floor(xb))}sendPingOnPrimaryIfNecessary_(){!this.isHealthy_&&this.state_===1&&(this.log_("sending ping on primary."),this.sendData_({t:"c",d:{t:yf,d:{}}}))}onSecondaryConnectionLost_(){const e=this.secondaryConn_;this.secondaryConn_=null,(this.tx_===e||this.rx_===e)&&this.close()}onConnectionLost_(e){this.conn_=null,!e&&this.state_===0?(this.log_("Realtime connection failed."),this.repoInfo_.isCacheableHost()&&(Jn.remove("host:"+this.repoInfo_.host),this.repoInfo_.internalHost=this.repoInfo_.host)):this.state_===1&&this.log_("Realtime connection lost."),this.close()}onConnectionShutdown_(e){this.log_("Connection shutdown command received. Shutting down..."),this.onKill_&&(this.onKill_(e),this.onKill_=null),this.onDisconnect_=null,this.close()}sendData_(e){if(this.state_!==1)throw"Connection is not connected";this.tx_.send(e)}close(){this.state_!==2&&(this.log_("Closing realtime connection."),this.state_=2,this.closeConnections_(),this.onDisconnect_&&(this.onDisconnect_(),this.onDisconnect_=null))}closeConnections_(){this.log_("Shutting down all connections"),this.conn_&&(this.conn_.close(),this.conn_=null),this.secondaryConn_&&(this.secondaryConn_.close(),this.secondaryConn_=null),this.healthyTimeout_&&(clearTimeout(this.healthyTimeout_),this.healthyTimeout_=null)}}/**
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
 */class Og{put(e,t,s,i){}merge(e,t,s,i){}refreshAuthToken(e){}refreshAppCheckToken(e){}onDisconnectPut(e,t,s){}onDisconnectMerge(e,t,s){}onDisconnectCancel(e,t){}reportStats(e){}}/**
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
 */class Vg{constructor(e){this.allowedEvents_=e,this.listeners_={},M(Array.isArray(e)&&e.length>0,"Requires a non-empty array")}trigger(e,...t){if(Array.isArray(this.listeners_[e])){const s=[...this.listeners_[e]];for(let i=0;i<s.length;i++)s[i].callback.apply(s[i].context,t)}}on(e,t,s){this.validateEventType_(e),this.listeners_[e]=this.listeners_[e]||[],this.listeners_[e].push({callback:t,context:s});const i=this.getInitialEvent(e);i&&t.apply(s,i)}off(e,t,s){this.validateEventType_(e);const i=this.listeners_[e]||[];for(let r=0;r<i.length;r++)if(i[r].callback===t&&(!s||s===i[r].context)){i.splice(r,1);return}}validateEventType_(e){M(this.allowedEvents_.find(t=>t===e),"Unknown event: "+e)}}/**
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
 */class Ho extends Vg{constructor(){super(["online"]),this.online_=!0,typeof window<"u"&&typeof window.addEventListener<"u"&&!pc()&&(window.addEventListener("online",()=>{this.online_||(this.online_=!0,this.trigger("online",!0))},!1),window.addEventListener("offline",()=>{this.online_&&(this.online_=!1,this.trigger("online",!1))},!1))}static getInstance(){return new Ho}getInitialEvent(e){return M(e==="online","Unknown event type: "+e),[this.online_]}currentlyOnline(){return this.online_}}/**
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
 */const vf=32,Ef=768;class fe{constructor(e,t){if(t===void 0){this.pieces_=e.split("/");let s=0;for(let i=0;i<this.pieces_.length;i++)this.pieces_[i].length>0&&(this.pieces_[s]=this.pieces_[i],s++);this.pieces_.length=s,this.pieceNum_=0}else this.pieces_=e,this.pieceNum_=t}toString(){let e="";for(let t=this.pieceNum_;t<this.pieces_.length;t++)this.pieces_[t]!==""&&(e+="/"+this.pieces_[t]);return e||"/"}}function he(){return new fe("")}function X(n){return n.pieceNum_>=n.pieces_.length?null:n.pieces_[n.pieceNum_]}function Ln(n){return n.pieces_.length-n.pieceNum_}function _e(n){let e=n.pieceNum_;return e<n.pieces_.length&&e++,new fe(n.pieces_,e)}function _h(n){return n.pieceNum_<n.pieces_.length?n.pieces_[n.pieces_.length-1]:null}function Ub(n){let e="";for(let t=n.pieceNum_;t<n.pieces_.length;t++)n.pieces_[t]!==""&&(e+="/"+encodeURIComponent(String(n.pieces_[t])));return e||"/"}function lr(n,e=0){return n.pieces_.slice(n.pieceNum_+e)}function Fg(n){if(n.pieceNum_>=n.pieces_.length)return null;const e=[];for(let t=n.pieceNum_;t<n.pieces_.length-1;t++)e.push(n.pieces_[t]);return new fe(e,0)}function be(n,e){const t=[];for(let s=n.pieceNum_;s<n.pieces_.length;s++)t.push(n.pieces_[s]);if(e instanceof fe)for(let s=e.pieceNum_;s<e.pieces_.length;s++)t.push(e.pieces_[s]);else{const s=e.split("/");for(let i=0;i<s.length;i++)s[i].length>0&&t.push(s[i])}return new fe(t,0)}function J(n){return n.pieceNum_>=n.pieces_.length}function dt(n,e){const t=X(n),s=X(e);if(t===null)return e;if(t===s)return dt(_e(n),_e(e));throw new Error("INTERNAL ERROR: innerPath ("+e+") is not within outerPath ("+n+")")}function jb(n,e){const t=lr(n,0),s=lr(e,0);for(let i=0;i<t.length&&i<s.length;i++){const r=gs(t[i],s[i]);if(r!==0)return r}return t.length===s.length?0:t.length<s.length?-1:1}function yh(n,e){if(Ln(n)!==Ln(e))return!1;for(let t=n.pieceNum_,s=e.pieceNum_;t<=n.pieces_.length;t++,s++)if(n.pieces_[t]!==e.pieces_[s])return!1;return!0}function bt(n,e){let t=n.pieceNum_,s=e.pieceNum_;if(Ln(n)>Ln(e))return!1;for(;t<n.pieces_.length;){if(n.pieces_[t]!==e.pieces_[s])return!1;++t,++s}return!0}class $b{constructor(e,t){this.errorPrefix_=t,this.parts_=lr(e,0),this.byteLength_=Math.max(1,this.parts_.length);for(let s=0;s<this.parts_.length;s++)this.byteLength_+=ua(this.parts_[s]);Bg(this)}}function Wb(n,e){n.parts_.length>0&&(n.byteLength_+=1),n.parts_.push(e),n.byteLength_+=ua(e),Bg(n)}function qb(n){const e=n.parts_.pop();n.byteLength_-=ua(e),n.parts_.length>0&&(n.byteLength_-=1)}function Bg(n){if(n.byteLength_>Ef)throw new Error(n.errorPrefix_+"has a key path longer than "+Ef+" bytes ("+n.byteLength_+").");if(n.parts_.length>vf)throw new Error(n.errorPrefix_+"path specified exceeds the maximum depth that can be written ("+vf+") or object contains a cycle "+Kn(n))}function Kn(n){return n.parts_.length===0?"":"in property '"+n.parts_.join(".")+"'"}/**
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
 */class vh extends Vg{constructor(){super(["visible"]);let e,t;typeof document<"u"&&typeof document.addEventListener<"u"&&(typeof document.hidden<"u"?(t="visibilitychange",e="hidden"):typeof document.mozHidden<"u"?(t="mozvisibilitychange",e="mozHidden"):typeof document.msHidden<"u"?(t="msvisibilitychange",e="msHidden"):typeof document.webkitHidden<"u"&&(t="webkitvisibilitychange",e="webkitHidden")),this.visible_=!0,t&&document.addEventListener(t,()=>{const s=!document[e];s!==this.visible_&&(this.visible_=s,this.trigger("visible",s))},!1)}static getInstance(){return new vh}getInitialEvent(e){return M(e==="visible","Unknown event type: "+e),[this.visible_]}}/**
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
 */const Di=1e3,zb=60*5*1e3,wf=30*1e3,Hb=1.3,Gb=3e4,Kb="server_kill",Tf=3;class nn extends Og{constructor(e,t,s,i,r,o,l,c){if(super(),this.repoInfo_=e,this.applicationId_=t,this.onDataUpdate_=s,this.onConnectStatus_=i,this.onServerInfoUpdate_=r,this.authTokenProvider_=o,this.appCheckTokenProvider_=l,this.authOverride_=c,this.id=nn.nextPersistentConnectionId_++,this.log_=Pr("p:"+this.id+":"),this.interruptReasons_={},this.listens=new Map,this.outstandingPuts_=[],this.outstandingGets_=[],this.outstandingPutCount_=0,this.outstandingGetCount_=0,this.onDisconnectRequestQueue_=[],this.connected_=!1,this.reconnectDelay_=Di,this.maxReconnectDelay_=zb,this.securityDebugCallback_=null,this.lastSessionId=null,this.establishConnectionTimer_=null,this.visible_=!1,this.requestCBHash_={},this.requestNumber_=0,this.realtime_=null,this.authToken_=null,this.appCheckToken_=null,this.forceTokenRefresh_=!1,this.invalidAuthTokenCount_=0,this.invalidAppCheckTokenCount_=0,this.firstConnection_=!0,this.lastConnectionAttemptTime_=null,this.lastConnectionEstablishedTime_=null,c)throw new Error("Auth override specified in options, but not supported on non Node.js platforms");vh.getInstance().on("visible",this.onVisible_,this),e.host.indexOf("fblocal")===-1&&Ho.getInstance().on("online",this.onOnline_,this)}sendRequest(e,t,s){const i=++this.requestNumber_,r={r:i,a:e,b:t};this.log_(Oe(r)),M(this.connected_,"sendRequest call when we're not connected not allowed."),this.realtime_.sendRequest(r),s&&(this.requestCBHash_[i]=s)}get(e){this.initConnection_();const t=new Mt,i={action:"g",request:{p:e._path.toString(),q:e._queryObject},onComplete:o=>{const l=o.d;o.s==="ok"?t.resolve(l):t.reject(l)}};this.outstandingGets_.push(i),this.outstandingGetCount_++;const r=this.outstandingGets_.length-1;return this.connected_&&this.sendGet_(r),t.promise}listen(e,t,s,i){this.initConnection_();const r=e._queryIdentifier,o=e._path.toString();this.log_("Listen called for "+o+" "+r),this.listens.has(o)||this.listens.set(o,new Map),M(e._queryParams.isDefault()||!e._queryParams.loadsAllData(),"listen() called for non-default but complete query"),M(!this.listens.get(o).has(r),"listen() called twice for same path/queryId.");const l={onComplete:i,hashFn:t,query:e,tag:s};this.listens.get(o).set(r,l),this.connected_&&this.sendListen_(l)}sendGet_(e){const t=this.outstandingGets_[e];this.sendRequest("g",t.request,s=>{delete this.outstandingGets_[e],this.outstandingGetCount_--,this.outstandingGetCount_===0&&(this.outstandingGets_=[]),t.onComplete&&t.onComplete(s)})}sendListen_(e){const t=e.query,s=t._path.toString(),i=t._queryIdentifier;this.log_("Listen on "+s+" for "+i);const r={p:s},o="q";e.tag&&(r.q=t._queryObject,r.t=e.tag),r.h=e.hashFn(),this.sendRequest(o,r,l=>{const c=l.d,h=l.s;nn.warnOnListenWarnings_(c,t),(this.listens.get(s)&&this.listens.get(s).get(i))===e&&(this.log_("listen response",l),h!=="ok"&&this.removeListen_(s,i),e.onComplete&&e.onComplete(h,c))})}static warnOnListenWarnings_(e,t){if(e&&typeof e=="object"&&$t(e,"w")){const s=Os(e,"w");if(Array.isArray(s)&&~s.indexOf("no_index")){const i='".indexOn": "'+t._queryParams.getIndex().toString()+'"',r=t._path.toString();ft(`Using an unspecified index. Your data will be downloaded and filtered on the client. Consider adding ${i} at ${r} to your security rules for better performance.`)}}}refreshAuthToken(e){this.authToken_=e,this.log_("Auth token refreshed"),this.authToken_?this.tryAuth():this.connected_&&this.sendRequest("unauth",{},()=>{}),this.reduceReconnectDelayIfAdminCredential_(e)}reduceReconnectDelayIfAdminCredential_(e){(e&&e.length===40||Ly(e))&&(this.log_("Admin auth credential detected.  Reducing max reconnect time."),this.maxReconnectDelay_=wf)}refreshAppCheckToken(e){this.appCheckToken_=e,this.log_("App check token refreshed"),this.appCheckToken_?this.tryAppCheck():this.connected_&&this.sendRequest("unappeck",{},()=>{})}tryAuth(){if(this.connected_&&this.authToken_){const e=this.authToken_,t=My(e)?"auth":"gauth",s={cred:e};this.authOverride_===null?s.noauth=!0:typeof this.authOverride_=="object"&&(s.authvar=this.authOverride_),this.sendRequest(t,s,i=>{const r=i.s,o=i.d||"error";this.authToken_===e&&(r==="ok"?this.invalidAuthTokenCount_=0:this.onAuthRevoked_(r,o))})}}tryAppCheck(){this.connected_&&this.appCheckToken_&&this.sendRequest("appcheck",{token:this.appCheckToken_},e=>{const t=e.s,s=e.d||"error";t==="ok"?this.invalidAppCheckTokenCount_=0:this.onAppCheckRevoked_(t,s)})}unlisten(e,t){const s=e._path.toString(),i=e._queryIdentifier;this.log_("Unlisten called for "+s+" "+i),M(e._queryParams.isDefault()||!e._queryParams.loadsAllData(),"unlisten() called for non-default but complete query"),this.removeListen_(s,i)&&this.connected_&&this.sendUnlisten_(s,i,e._queryObject,t)}sendUnlisten_(e,t,s,i){this.log_("Unlisten on "+e+" for "+t);const r={p:e},o="n";i&&(r.q=s,r.t=i),this.sendRequest(o,r)}onDisconnectPut(e,t,s){this.initConnection_(),this.connected_?this.sendOnDisconnect_("o",e,t,s):this.onDisconnectRequestQueue_.push({pathString:e,action:"o",data:t,onComplete:s})}onDisconnectMerge(e,t,s){this.initConnection_(),this.connected_?this.sendOnDisconnect_("om",e,t,s):this.onDisconnectRequestQueue_.push({pathString:e,action:"om",data:t,onComplete:s})}onDisconnectCancel(e,t){this.initConnection_(),this.connected_?this.sendOnDisconnect_("oc",e,null,t):this.onDisconnectRequestQueue_.push({pathString:e,action:"oc",data:null,onComplete:t})}sendOnDisconnect_(e,t,s,i){const r={p:t,d:s};this.log_("onDisconnect "+e,r),this.sendRequest(e,r,o=>{i&&setTimeout(()=>{i(o.s,o.d)},Math.floor(0))})}put(e,t,s,i){this.putInternal("p",e,t,s,i)}merge(e,t,s,i){this.putInternal("m",e,t,s,i)}putInternal(e,t,s,i,r){this.initConnection_();const o={p:t,d:s};r!==void 0&&(o.h=r),this.outstandingPuts_.push({action:e,request:o,onComplete:i}),this.outstandingPutCount_++;const l=this.outstandingPuts_.length-1;this.connected_?this.sendPut_(l):this.log_("Buffering put: "+t)}sendPut_(e){const t=this.outstandingPuts_[e].action,s=this.outstandingPuts_[e].request,i=this.outstandingPuts_[e].onComplete;this.outstandingPuts_[e].queued=this.connected_,this.sendRequest(t,s,r=>{this.log_(t+" response",r),delete this.outstandingPuts_[e],this.outstandingPutCount_--,this.outstandingPutCount_===0&&(this.outstandingPuts_=[]),i&&i(r.s,r.d)})}reportStats(e){if(this.connected_){const t={c:e};this.log_("reportStats",t),this.sendRequest("s",t,s=>{if(s.s!=="ok"){const r=s.d;this.log_("reportStats","Error sending stats: "+r)}})}}onDataMessage_(e){if("r"in e){this.log_("from server: "+Oe(e));const t=e.r,s=this.requestCBHash_[t];s&&(delete this.requestCBHash_[t],s(e.b))}else{if("error"in e)throw"A server-side error has occurred: "+e.error;"a"in e&&this.onDataPush_(e.a,e.b)}}onDataPush_(e,t){this.log_("handleServerMessage",e,t),e==="d"?this.onDataUpdate_(t.p,t.d,!1,t.t):e==="m"?this.onDataUpdate_(t.p,t.d,!0,t.t):e==="c"?this.onListenRevoked_(t.p,t.q):e==="ac"?this.onAuthRevoked_(t.s,t.d):e==="apc"?this.onAppCheckRevoked_(t.s,t.d):e==="sd"?this.onSecurityDebugPacket_(t):ec("Unrecognized action received from server: "+Oe(e)+`
Are you using the latest client?`)}onReady_(e,t){this.log_("connection ready"),this.connected_=!0,this.lastConnectionEstablishedTime_=new Date().getTime(),this.handleTimestamp_(e),this.lastSessionId=t,this.firstConnection_&&this.sendConnectStats_(),this.restoreState_(),this.firstConnection_=!1,this.onConnectStatus_(!0)}scheduleConnect_(e){M(!this.realtime_,"Scheduling a connect when we're already connected/ing?"),this.establishConnectionTimer_&&clearTimeout(this.establishConnectionTimer_),this.establishConnectionTimer_=setTimeout(()=>{this.establishConnectionTimer_=null,this.establishConnection_()},Math.floor(e))}initConnection_(){!this.realtime_&&this.firstConnection_&&this.scheduleConnect_(0)}onVisible_(e){e&&!this.visible_&&this.reconnectDelay_===this.maxReconnectDelay_&&(this.log_("Window became visible.  Reducing delay."),this.reconnectDelay_=Di,this.realtime_||this.scheduleConnect_(0)),this.visible_=e}onOnline_(e){e?(this.log_("Browser went online."),this.reconnectDelay_=Di,this.realtime_||this.scheduleConnect_(0)):(this.log_("Browser went offline.  Killing connection."),this.realtime_&&this.realtime_.close())}onRealtimeDisconnect_(){if(this.log_("data client disconnected"),this.connected_=!1,this.realtime_=null,this.cancelSentTransactions_(),this.requestCBHash_={},this.shouldReconnect_()){this.visible_?this.lastConnectionEstablishedTime_&&(new Date().getTime()-this.lastConnectionEstablishedTime_>Gb&&(this.reconnectDelay_=Di),this.lastConnectionEstablishedTime_=null):(this.log_("Window isn't visible.  Delaying reconnect."),this.reconnectDelay_=this.maxReconnectDelay_,this.lastConnectionAttemptTime_=new Date().getTime());const e=new Date().getTime()-this.lastConnectionAttemptTime_;let t=Math.max(0,this.reconnectDelay_-e);t=Math.random()*t,this.log_("Trying to reconnect in "+t+"ms"),this.scheduleConnect_(t),this.reconnectDelay_=Math.min(this.maxReconnectDelay_,this.reconnectDelay_*Hb)}this.onConnectStatus_(!1)}async establishConnection_(){if(this.shouldReconnect_()){this.log_("Making a connection attempt"),this.lastConnectionAttemptTime_=new Date().getTime(),this.lastConnectionEstablishedTime_=null;const e=this.onDataMessage_.bind(this),t=this.onReady_.bind(this),s=this.onRealtimeDisconnect_.bind(this),i=this.id+":"+nn.nextConnectionId_++,r=this.lastSessionId;let o=!1,l=null;const c=function(){l?l.close():(o=!0,s())},h=function(m){M(l,"sendRequest call when we're not connected not allowed."),l.sendRequest(m)};this.realtime_={close:c,sendRequest:h};const d=this.forceTokenRefresh_;this.forceTokenRefresh_=!1;try{const[m,p]=await Promise.all([this.authTokenProvider_.getToken(d),this.appCheckTokenProvider_.getToken(d)]);o?$e("getToken() completed but was canceled"):($e("getToken() completed. Creating connection."),this.authToken_=m&&m.accessToken,this.appCheckToken_=p&&p.token,l=new Bb(i,this.repoInfo_,this.applicationId_,this.appCheckToken_,this.authToken_,e,t,s,E=>{ft(E+" ("+this.repoInfo_.toString()+")"),this.interrupt(Kb)},r))}catch(m){this.log_("Failed to get token: "+m),o||(this.repoInfo_.nodeAdmin&&ft(m),c())}}}interrupt(e){$e("Interrupting connection for reason: "+e),this.interruptReasons_[e]=!0,this.realtime_?this.realtime_.close():(this.establishConnectionTimer_&&(clearTimeout(this.establishConnectionTimer_),this.establishConnectionTimer_=null),this.connected_&&this.onRealtimeDisconnect_())}resume(e){$e("Resuming connection for reason: "+e),delete this.interruptReasons_[e],bo(this.interruptReasons_)&&(this.reconnectDelay_=Di,this.realtime_||this.scheduleConnect_(0))}handleTimestamp_(e){const t=e-new Date().getTime();this.onServerInfoUpdate_({serverTimeOffset:t})}cancelSentTransactions_(){for(let e=0;e<this.outstandingPuts_.length;e++){const t=this.outstandingPuts_[e];t&&"h"in t.request&&t.queued&&(t.onComplete&&t.onComplete("disconnect"),delete this.outstandingPuts_[e],this.outstandingPutCount_--)}this.outstandingPutCount_===0&&(this.outstandingPuts_=[])}onListenRevoked_(e,t){let s;t?s=t.map(r=>fh(r)).join("$"):s="default";const i=this.removeListen_(e,s);i&&i.onComplete&&i.onComplete("permission_denied")}removeListen_(e,t){const s=new fe(e).toString();let i;if(this.listens.has(s)){const r=this.listens.get(s);i=r.get(t),r.delete(t),r.size===0&&this.listens.delete(s)}else i=void 0;return i}onAuthRevoked_(e,t){$e("Auth token revoked: "+e+"/"+t),this.authToken_=null,this.forceTokenRefresh_=!0,this.realtime_.close(),(e==="invalid_token"||e==="permission_denied")&&(this.invalidAuthTokenCount_++,this.invalidAuthTokenCount_>=Tf&&(this.reconnectDelay_=wf,this.authTokenProvider_.notifyForInvalidToken()))}onAppCheckRevoked_(e,t){$e("App check token revoked: "+e+"/"+t),this.appCheckToken_=null,this.forceTokenRefresh_=!0,(e==="invalid_token"||e==="permission_denied")&&(this.invalidAppCheckTokenCount_++,this.invalidAppCheckTokenCount_>=Tf&&this.appCheckTokenProvider_.notifyForInvalidToken())}onSecurityDebugPacket_(e){this.securityDebugCallback_?this.securityDebugCallback_(e):"msg"in e&&console.log("FIREBASE: "+e.msg.replace(`
`,`
FIREBASE: `))}restoreState_(){this.tryAuth(),this.tryAppCheck();for(const e of this.listens.values())for(const t of e.values())this.sendListen_(t);for(let e=0;e<this.outstandingPuts_.length;e++)this.outstandingPuts_[e]&&this.sendPut_(e);for(;this.onDisconnectRequestQueue_.length;){const e=this.onDisconnectRequestQueue_.shift();this.sendOnDisconnect_(e.action,e.pathString,e.data,e.onComplete)}for(let e=0;e<this.outstandingGets_.length;e++)this.outstandingGets_[e]&&this.sendGet_(e)}sendConnectStats_(){const e={};let t="js";e["sdk."+t+"."+pg.replace(/\./g,"-")]=1,pc()?e["framework.cordova"]=1:im()&&(e["framework.reactnative"]=1),this.reportStats(e)}shouldReconnect_(){const e=Ho.getInstance().currentlyOnline();return bo(this.interruptReasons_)&&e}}nn.nextPersistentConnectionId_=0;nn.nextConnectionId_=0;/**
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
 */class Z{constructor(e,t){this.name=e,this.node=t}static Wrap(e,t){return new Z(e,t)}}/**
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
 */class Da{getCompare(){return this.compare.bind(this)}indexedValueChanged(e,t){const s=new Z(cs,e),i=new Z(cs,t);return this.compare(s,i)!==0}minPost(){return Z.MIN}}/**
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
 */let lo;class Ug extends Da{static get __EMPTY_NODE(){return lo}static set __EMPTY_NODE(e){lo=e}compare(e,t){return gs(e.name,t.name)}isDefinedOn(e){throw Js("KeyIndex.isDefinedOn not expected to be called.")}indexedValueChanged(e,t){return!1}minPost(){return Z.MIN}maxPost(){return new Z(Mn,lo)}makePost(e,t){return M(typeof e=="string","KeyIndex indexValue must always be a string."),new Z(e,lo)}toString(){return".key"}}const ns=new Ug;/**
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
 */class co{constructor(e,t,s,i,r=null){this.isReverse_=i,this.resultGenerator_=r,this.nodeStack_=[];let o=1;for(;!e.isEmpty();)if(e=e,o=t?s(e.key,t):1,i&&(o*=-1),o<0)this.isReverse_?e=e.left:e=e.right;else if(o===0){this.nodeStack_.push(e);break}else this.nodeStack_.push(e),this.isReverse_?e=e.right:e=e.left}getNext(){if(this.nodeStack_.length===0)return null;let e=this.nodeStack_.pop(),t;if(this.resultGenerator_?t=this.resultGenerator_(e.key,e.value):t={key:e.key,value:e.value},this.isReverse_)for(e=e.left;!e.isEmpty();)this.nodeStack_.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack_.push(e),e=e.left;return t}hasNext(){return this.nodeStack_.length>0}peek(){if(this.nodeStack_.length===0)return null;const e=this.nodeStack_[this.nodeStack_.length-1];return this.resultGenerator_?this.resultGenerator_(e.key,e.value):{key:e.key,value:e.value}}}class Ue{constructor(e,t,s,i,r){this.key=e,this.value=t,this.color=s??Ue.RED,this.left=i??pt.EMPTY_NODE,this.right=r??pt.EMPTY_NODE}copy(e,t,s,i,r){return new Ue(e??this.key,t??this.value,s??this.color,i??this.left,r??this.right)}count(){return this.left.count()+1+this.right.count()}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||!!e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min_(){return this.left.isEmpty()?this:this.left.min_()}minKey(){return this.min_().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,t,s){let i=this;const r=s(e,i.key);return r<0?i=i.copy(null,null,null,i.left.insert(e,t,s),null):r===0?i=i.copy(null,t,null,null,null):i=i.copy(null,null,null,null,i.right.insert(e,t,s)),i.fixUp_()}removeMin_(){if(this.left.isEmpty())return pt.EMPTY_NODE;let e=this;return!e.left.isRed_()&&!e.left.left.isRed_()&&(e=e.moveRedLeft_()),e=e.copy(null,null,null,e.left.removeMin_(),null),e.fixUp_()}remove(e,t){let s,i;if(s=this,t(e,s.key)<0)!s.left.isEmpty()&&!s.left.isRed_()&&!s.left.left.isRed_()&&(s=s.moveRedLeft_()),s=s.copy(null,null,null,s.left.remove(e,t),null);else{if(s.left.isRed_()&&(s=s.rotateRight_()),!s.right.isEmpty()&&!s.right.isRed_()&&!s.right.left.isRed_()&&(s=s.moveRedRight_()),t(e,s.key)===0){if(s.right.isEmpty())return pt.EMPTY_NODE;i=s.right.min_(),s=s.copy(i.key,i.value,null,null,s.right.removeMin_())}s=s.copy(null,null,null,null,s.right.remove(e,t))}return s.fixUp_()}isRed_(){return this.color}fixUp_(){let e=this;return e.right.isRed_()&&!e.left.isRed_()&&(e=e.rotateLeft_()),e.left.isRed_()&&e.left.left.isRed_()&&(e=e.rotateRight_()),e.left.isRed_()&&e.right.isRed_()&&(e=e.colorFlip_()),e}moveRedLeft_(){let e=this.colorFlip_();return e.right.left.isRed_()&&(e=e.copy(null,null,null,null,e.right.rotateRight_()),e=e.rotateLeft_(),e=e.colorFlip_()),e}moveRedRight_(){let e=this.colorFlip_();return e.left.left.isRed_()&&(e=e.rotateRight_(),e=e.colorFlip_()),e}rotateLeft_(){const e=this.copy(null,null,Ue.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight_(){const e=this.copy(null,null,Ue.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip_(){const e=this.left.copy(null,null,!this.left.color,null,null),t=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,t)}checkMaxDepth_(){const e=this.check_();return Math.pow(2,e)<=this.count()+1}check_(){if(this.isRed_()&&this.left.isRed_())throw new Error("Red node has red child("+this.key+","+this.value+")");if(this.right.isRed_())throw new Error("Right child of ("+this.key+","+this.value+") is red");const e=this.left.check_();if(e!==this.right.check_())throw new Error("Black depths differ");return e+(this.isRed_()?0:1)}}Ue.RED=!0;Ue.BLACK=!1;class Qb{copy(e,t,s,i,r){return this}insert(e,t,s){return new Ue(e,t,null)}remove(e,t){return this}count(){return 0}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}check_(){return 0}isRed_(){return!1}}class pt{constructor(e,t=pt.EMPTY_NODE){this.comparator_=e,this.root_=t}insert(e,t){return new pt(this.comparator_,this.root_.insert(e,t,this.comparator_).copy(null,null,Ue.BLACK,null,null))}remove(e){return new pt(this.comparator_,this.root_.remove(e,this.comparator_).copy(null,null,Ue.BLACK,null,null))}get(e){let t,s=this.root_;for(;!s.isEmpty();){if(t=this.comparator_(e,s.key),t===0)return s.value;t<0?s=s.left:t>0&&(s=s.right)}return null}getPredecessorKey(e){let t,s=this.root_,i=null;for(;!s.isEmpty();)if(t=this.comparator_(e,s.key),t===0){if(s.left.isEmpty())return i?i.key:null;for(s=s.left;!s.right.isEmpty();)s=s.right;return s.key}else t<0?s=s.left:t>0&&(i=s,s=s.right);throw new Error("Attempted to find predecessor key for a nonexistent key.  What gives?")}isEmpty(){return this.root_.isEmpty()}count(){return this.root_.count()}minKey(){return this.root_.minKey()}maxKey(){return this.root_.maxKey()}inorderTraversal(e){return this.root_.inorderTraversal(e)}reverseTraversal(e){return this.root_.reverseTraversal(e)}getIterator(e){return new co(this.root_,null,this.comparator_,!1,e)}getIteratorFrom(e,t){return new co(this.root_,e,this.comparator_,!1,t)}getReverseIteratorFrom(e,t){return new co(this.root_,e,this.comparator_,!0,t)}getReverseIterator(e){return new co(this.root_,null,this.comparator_,!0,e)}}pt.EMPTY_NODE=new Qb;/**
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
 */function Yb(n,e){return gs(n.name,e.name)}function Eh(n,e){return gs(n,e)}/**
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
 */let nc;function Xb(n){nc=n}const jg=function(n){return typeof n=="number"?"number:"+vg(n):"string:"+n},$g=function(n){if(n.isLeafNode()){const e=n.val();M(typeof e=="string"||typeof e=="number"||typeof e=="object"&&$t(e,".sv"),"Priority must be a string or number.")}else M(n===nc||n.isEmpty(),"priority of unexpected type.");M(n===nc||n.getPriority().isEmpty(),"Priority nodes can't have a priority of their own.")};/**
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
 */let If;class Fe{constructor(e,t=Fe.__childrenNodeConstructor.EMPTY_NODE){this.value_=e,this.priorityNode_=t,this.lazyHash_=null,M(this.value_!==void 0&&this.value_!==null,"LeafNode shouldn't be created with null/undefined value."),$g(this.priorityNode_)}static set __childrenNodeConstructor(e){If=e}static get __childrenNodeConstructor(){return If}isLeafNode(){return!0}getPriority(){return this.priorityNode_}updatePriority(e){return new Fe(this.value_,e)}getImmediateChild(e){return e===".priority"?this.priorityNode_:Fe.__childrenNodeConstructor.EMPTY_NODE}getChild(e){return J(e)?this:X(e)===".priority"?this.priorityNode_:Fe.__childrenNodeConstructor.EMPTY_NODE}hasChild(){return!1}getPredecessorChildName(e,t){return null}updateImmediateChild(e,t){return e===".priority"?this.updatePriority(t):t.isEmpty()&&e!==".priority"?this:Fe.__childrenNodeConstructor.EMPTY_NODE.updateImmediateChild(e,t).updatePriority(this.priorityNode_)}updateChild(e,t){const s=X(e);return s===null?t:t.isEmpty()&&s!==".priority"?this:(M(s!==".priority"||Ln(e)===1,".priority must be the last token in a path"),this.updateImmediateChild(s,Fe.__childrenNodeConstructor.EMPTY_NODE.updateChild(_e(e),t)))}isEmpty(){return!1}numChildren(){return 0}forEachChild(e,t){return!1}val(e){return e&&!this.getPriority().isEmpty()?{".value":this.getValue(),".priority":this.getPriority().val()}:this.getValue()}hash(){if(this.lazyHash_===null){let e="";this.priorityNode_.isEmpty()||(e+="priority:"+jg(this.priorityNode_.val())+":");const t=typeof this.value_;e+=t+":",t==="number"?e+=vg(this.value_):e+=this.value_,this.lazyHash_=_g(e)}return this.lazyHash_}getValue(){return this.value_}compareTo(e){return e===Fe.__childrenNodeConstructor.EMPTY_NODE?1:e instanceof Fe.__childrenNodeConstructor?-1:(M(e.isLeafNode(),"Unknown node type"),this.compareToLeafNode_(e))}compareToLeafNode_(e){const t=typeof e.value_,s=typeof this.value_,i=Fe.VALUE_TYPE_ORDER.indexOf(t),r=Fe.VALUE_TYPE_ORDER.indexOf(s);return M(i>=0,"Unknown leaf type: "+t),M(r>=0,"Unknown leaf type: "+s),i===r?s==="object"?0:this.value_<e.value_?-1:this.value_===e.value_?0:1:r-i}withIndex(){return this}isIndexed(){return!0}equals(e){if(e===this)return!0;if(e.isLeafNode()){const t=e;return this.value_===t.value_&&this.priorityNode_.equals(t.priorityNode_)}else return!1}}Fe.VALUE_TYPE_ORDER=["object","boolean","number","string"];/**
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
 */let Wg,qg;function Jb(n){Wg=n}function Zb(n){qg=n}class eC extends Da{compare(e,t){const s=e.node.getPriority(),i=t.node.getPriority(),r=s.compareTo(i);return r===0?gs(e.name,t.name):r}isDefinedOn(e){return!e.getPriority().isEmpty()}indexedValueChanged(e,t){return!e.getPriority().equals(t.getPriority())}minPost(){return Z.MIN}maxPost(){return new Z(Mn,new Fe("[PRIORITY-POST]",qg))}makePost(e,t){const s=Wg(e);return new Z(t,new Fe("[PRIORITY-POST]",s))}toString(){return".priority"}}const Te=new eC;/**
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
 */const tC=Math.log(2);class nC{constructor(e){const t=r=>parseInt(Math.log(r)/tC,10),s=r=>parseInt(Array(r+1).join("1"),2);this.count=t(e+1),this.current_=this.count-1;const i=s(this.count);this.bits_=e+1&i}nextBitIsOne(){const e=!(this.bits_&1<<this.current_);return this.current_--,e}}const Go=function(n,e,t,s){n.sort(e);const i=function(c,h){const d=h-c;let m,p;if(d===0)return null;if(d===1)return m=n[c],p=t?t(m):m,new Ue(p,m.node,Ue.BLACK,null,null);{const E=parseInt(d/2,10)+c,b=i(c,E),S=i(E+1,h);return m=n[E],p=t?t(m):m,new Ue(p,m.node,Ue.BLACK,b,S)}},r=function(c){let h=null,d=null,m=n.length;const p=function(b,S){const P=m-b,F=m;m-=b;const U=i(P+1,F),O=n[P],G=t?t(O):O;E(new Ue(G,O.node,S,null,U))},E=function(b){h?(h.left=b,h=b):(d=b,h=b)};for(let b=0;b<c.count;++b){const S=c.nextBitIsOne(),P=Math.pow(2,c.count-(b+1));S?p(P,Ue.BLACK):(p(P,Ue.BLACK),p(P,Ue.RED))}return d},o=new nC(n.length),l=r(o);return new pt(s||e,l)};/**
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
 */let Rl;const bs={};class tn{constructor(e,t){this.indexes_=e,this.indexSet_=t}static get Default(){return M(bs&&Te,"ChildrenNode.ts has not been loaded"),Rl=Rl||new tn({".priority":bs},{".priority":Te}),Rl}get(e){const t=Os(this.indexes_,e);if(!t)throw new Error("No index defined for "+e);return t instanceof pt?t:null}hasIndex(e){return $t(this.indexSet_,e.toString())}addIndex(e,t){M(e!==ns,"KeyIndex always exists and isn't meant to be added to the IndexMap.");const s=[];let i=!1;const r=t.getIterator(Z.Wrap);let o=r.getNext();for(;o;)i=i||e.isDefinedOn(o.node),s.push(o),o=r.getNext();let l;i?l=Go(s,e.getCompare()):l=bs;const c=e.toString(),h=Object.assign({},this.indexSet_);h[c]=e;const d=Object.assign({},this.indexes_);return d[c]=l,new tn(d,h)}addToIndexes(e,t){const s=Co(this.indexes_,(i,r)=>{const o=Os(this.indexSet_,r);if(M(o,"Missing index implementation for "+r),i===bs)if(o.isDefinedOn(e.node)){const l=[],c=t.getIterator(Z.Wrap);let h=c.getNext();for(;h;)h.name!==e.name&&l.push(h),h=c.getNext();return l.push(e),Go(l,o.getCompare())}else return bs;else{const l=t.get(e.name);let c=i;return l&&(c=c.remove(new Z(e.name,l))),c.insert(e,e.node)}});return new tn(s,this.indexSet_)}removeFromIndexes(e,t){const s=Co(this.indexes_,i=>{if(i===bs)return i;{const r=t.get(e.name);return r?i.remove(new Z(e.name,r)):i}});return new tn(s,this.indexSet_)}}/**
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
 */let xi;class H{constructor(e,t,s){this.children_=e,this.priorityNode_=t,this.indexMap_=s,this.lazyHash_=null,this.priorityNode_&&$g(this.priorityNode_),this.children_.isEmpty()&&M(!this.priorityNode_||this.priorityNode_.isEmpty(),"An empty node cannot have a priority")}static get EMPTY_NODE(){return xi||(xi=new H(new pt(Eh),null,tn.Default))}isLeafNode(){return!1}getPriority(){return this.priorityNode_||xi}updatePriority(e){return this.children_.isEmpty()?this:new H(this.children_,e,this.indexMap_)}getImmediateChild(e){if(e===".priority")return this.getPriority();{const t=this.children_.get(e);return t===null?xi:t}}getChild(e){const t=X(e);return t===null?this:this.getImmediateChild(t).getChild(_e(e))}hasChild(e){return this.children_.get(e)!==null}updateImmediateChild(e,t){if(M(t,"We should always be passing snapshot nodes"),e===".priority")return this.updatePriority(t);{const s=new Z(e,t);let i,r;t.isEmpty()?(i=this.children_.remove(e),r=this.indexMap_.removeFromIndexes(s,this.children_)):(i=this.children_.insert(e,t),r=this.indexMap_.addToIndexes(s,this.children_));const o=i.isEmpty()?xi:this.priorityNode_;return new H(i,o,r)}}updateChild(e,t){const s=X(e);if(s===null)return t;{M(X(e)!==".priority"||Ln(e)===1,".priority must be the last token in a path");const i=this.getImmediateChild(s).updateChild(_e(e),t);return this.updateImmediateChild(s,i)}}isEmpty(){return this.children_.isEmpty()}numChildren(){return this.children_.count()}val(e){if(this.isEmpty())return null;const t={};let s=0,i=0,r=!0;if(this.forEachChild(Te,(o,l)=>{t[o]=l.val(e),s++,r&&H.INTEGER_REGEXP_.test(o)?i=Math.max(i,Number(o)):r=!1}),!e&&r&&i<2*s){const o=[];for(const l in t)o[l]=t[l];return o}else return e&&!this.getPriority().isEmpty()&&(t[".priority"]=this.getPriority().val()),t}hash(){if(this.lazyHash_===null){let e="";this.getPriority().isEmpty()||(e+="priority:"+jg(this.getPriority().val())+":"),this.forEachChild(Te,(t,s)=>{const i=s.hash();i!==""&&(e+=":"+t+":"+i)}),this.lazyHash_=e===""?"":_g(e)}return this.lazyHash_}getPredecessorChildName(e,t,s){const i=this.resolveIndex_(s);if(i){const r=i.getPredecessorKey(new Z(e,t));return r?r.name:null}else return this.children_.getPredecessorKey(e)}getFirstChildName(e){const t=this.resolveIndex_(e);if(t){const s=t.minKey();return s&&s.name}else return this.children_.minKey()}getFirstChild(e){const t=this.getFirstChildName(e);return t?new Z(t,this.children_.get(t)):null}getLastChildName(e){const t=this.resolveIndex_(e);if(t){const s=t.maxKey();return s&&s.name}else return this.children_.maxKey()}getLastChild(e){const t=this.getLastChildName(e);return t?new Z(t,this.children_.get(t)):null}forEachChild(e,t){const s=this.resolveIndex_(e);return s?s.inorderTraversal(i=>t(i.name,i.node)):this.children_.inorderTraversal(t)}getIterator(e){return this.getIteratorFrom(e.minPost(),e)}getIteratorFrom(e,t){const s=this.resolveIndex_(t);if(s)return s.getIteratorFrom(e,i=>i);{const i=this.children_.getIteratorFrom(e.name,Z.Wrap);let r=i.peek();for(;r!=null&&t.compare(r,e)<0;)i.getNext(),r=i.peek();return i}}getReverseIterator(e){return this.getReverseIteratorFrom(e.maxPost(),e)}getReverseIteratorFrom(e,t){const s=this.resolveIndex_(t);if(s)return s.getReverseIteratorFrom(e,i=>i);{const i=this.children_.getReverseIteratorFrom(e.name,Z.Wrap);let r=i.peek();for(;r!=null&&t.compare(r,e)>0;)i.getNext(),r=i.peek();return i}}compareTo(e){return this.isEmpty()?e.isEmpty()?0:-1:e.isLeafNode()||e.isEmpty()?1:e===Nr?-1:0}withIndex(e){if(e===ns||this.indexMap_.hasIndex(e))return this;{const t=this.indexMap_.addIndex(e,this.children_);return new H(this.children_,this.priorityNode_,t)}}isIndexed(e){return e===ns||this.indexMap_.hasIndex(e)}equals(e){if(e===this)return!0;if(e.isLeafNode())return!1;{const t=e;if(this.getPriority().equals(t.getPriority()))if(this.children_.count()===t.children_.count()){const s=this.getIterator(Te),i=t.getIterator(Te);let r=s.getNext(),o=i.getNext();for(;r&&o;){if(r.name!==o.name||!r.node.equals(o.node))return!1;r=s.getNext(),o=i.getNext()}return r===null&&o===null}else return!1;else return!1}}resolveIndex_(e){return e===ns?null:this.indexMap_.get(e.toString())}}H.INTEGER_REGEXP_=/^(0|[1-9]\d*)$/;class sC extends H{constructor(){super(new pt(Eh),H.EMPTY_NODE,tn.Default)}compareTo(e){return e===this?0:1}equals(e){return e===this}getPriority(){return this}getImmediateChild(e){return H.EMPTY_NODE}isEmpty(){return!1}}const Nr=new sC;Object.defineProperties(Z,{MIN:{value:new Z(cs,H.EMPTY_NODE)},MAX:{value:new Z(Mn,Nr)}});Ug.__EMPTY_NODE=H.EMPTY_NODE;Fe.__childrenNodeConstructor=H;Xb(Nr);Zb(Nr);/**
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
 */const iC=!0;function Se(n,e=null){if(n===null)return H.EMPTY_NODE;if(typeof n=="object"&&".priority"in n&&(e=n[".priority"]),M(e===null||typeof e=="string"||typeof e=="number"||typeof e=="object"&&".sv"in e,"Invalid priority type found: "+typeof e),typeof n=="object"&&".value"in n&&n[".value"]!==null&&(n=n[".value"]),typeof n!="object"||".sv"in n){const t=n;return new Fe(t,Se(e))}if(!(n instanceof Array)&&iC){const t=[];let s=!1;if(We(n,(o,l)=>{if(o.substring(0,1)!=="."){const c=Se(l);c.isEmpty()||(s=s||!c.getPriority().isEmpty(),t.push(new Z(o,c)))}}),t.length===0)return H.EMPTY_NODE;const r=Go(t,Yb,o=>o.name,Eh);if(s){const o=Go(t,Te.getCompare());return new H(r,Se(e),new tn({".priority":o},{".priority":Te}))}else return new H(r,Se(e),tn.Default)}else{let t=H.EMPTY_NODE;return We(n,(s,i)=>{if($t(n,s)&&s.substring(0,1)!=="."){const r=Se(i);(r.isLeafNode()||!r.isEmpty())&&(t=t.updateImmediateChild(s,r))}}),t.updatePriority(Se(e))}}Jb(Se);/**
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
 */class wh extends Da{constructor(e){super(),this.indexPath_=e,M(!J(e)&&X(e)!==".priority","Can't create PathIndex with empty path or .priority key")}extractChild(e){return e.getChild(this.indexPath_)}isDefinedOn(e){return!e.getChild(this.indexPath_).isEmpty()}compare(e,t){const s=this.extractChild(e.node),i=this.extractChild(t.node),r=s.compareTo(i);return r===0?gs(e.name,t.name):r}makePost(e,t){const s=Se(e),i=H.EMPTY_NODE.updateChild(this.indexPath_,s);return new Z(t,i)}maxPost(){const e=H.EMPTY_NODE.updateChild(this.indexPath_,Nr);return new Z(Mn,e)}toString(){return lr(this.indexPath_,0).join("/")}}/**
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
 */class rC extends Da{compare(e,t){const s=e.node.compareTo(t.node);return s===0?gs(e.name,t.name):s}isDefinedOn(e){return!0}indexedValueChanged(e,t){return!e.equals(t)}minPost(){return Z.MIN}maxPost(){return Z.MAX}makePost(e,t){const s=Se(e);return new Z(t,s)}toString(){return".value"}}const zg=new rC;/**
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
 */function Hg(n){return{type:"value",snapshotNode:n}}function zs(n,e){return{type:"child_added",snapshotNode:e,childName:n}}function cr(n,e){return{type:"child_removed",snapshotNode:e,childName:n}}function hr(n,e,t){return{type:"child_changed",snapshotNode:e,childName:n,oldSnap:t}}function oC(n,e){return{type:"child_moved",snapshotNode:e,childName:n}}/**
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
 */class Th{constructor(e){this.index_=e}updateChild(e,t,s,i,r,o){M(e.isIndexed(this.index_),"A node must be indexed if only a child is updated");const l=e.getImmediateChild(t);return l.getChild(i).equals(s.getChild(i))&&l.isEmpty()===s.isEmpty()||(o!=null&&(s.isEmpty()?e.hasChild(t)?o.trackChildChange(cr(t,l)):M(e.isLeafNode(),"A child remove without an old child only makes sense on a leaf node"):l.isEmpty()?o.trackChildChange(zs(t,s)):o.trackChildChange(hr(t,s,l))),e.isLeafNode()&&s.isEmpty())?e:e.updateImmediateChild(t,s).withIndex(this.index_)}updateFullNode(e,t,s){return s!=null&&(e.isLeafNode()||e.forEachChild(Te,(i,r)=>{t.hasChild(i)||s.trackChildChange(cr(i,r))}),t.isLeafNode()||t.forEachChild(Te,(i,r)=>{if(e.hasChild(i)){const o=e.getImmediateChild(i);o.equals(r)||s.trackChildChange(hr(i,r,o))}else s.trackChildChange(zs(i,r))})),t.withIndex(this.index_)}updatePriority(e,t){return e.isEmpty()?H.EMPTY_NODE:e.updatePriority(t)}filtersNodes(){return!1}getIndexedFilter(){return this}getIndex(){return this.index_}}/**
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
 */class ur{constructor(e){this.indexedFilter_=new Th(e.getIndex()),this.index_=e.getIndex(),this.startPost_=ur.getStartPost_(e),this.endPost_=ur.getEndPost_(e),this.startIsInclusive_=!e.startAfterSet_,this.endIsInclusive_=!e.endBeforeSet_}getStartPost(){return this.startPost_}getEndPost(){return this.endPost_}matches(e){const t=this.startIsInclusive_?this.index_.compare(this.getStartPost(),e)<=0:this.index_.compare(this.getStartPost(),e)<0,s=this.endIsInclusive_?this.index_.compare(e,this.getEndPost())<=0:this.index_.compare(e,this.getEndPost())<0;return t&&s}updateChild(e,t,s,i,r,o){return this.matches(new Z(t,s))||(s=H.EMPTY_NODE),this.indexedFilter_.updateChild(e,t,s,i,r,o)}updateFullNode(e,t,s){t.isLeafNode()&&(t=H.EMPTY_NODE);let i=t.withIndex(this.index_);i=i.updatePriority(H.EMPTY_NODE);const r=this;return t.forEachChild(Te,(o,l)=>{r.matches(new Z(o,l))||(i=i.updateImmediateChild(o,H.EMPTY_NODE))}),this.indexedFilter_.updateFullNode(e,i,s)}updatePriority(e,t){return e}filtersNodes(){return!0}getIndexedFilter(){return this.indexedFilter_}getIndex(){return this.index_}static getStartPost_(e){if(e.hasStart()){const t=e.getIndexStartName();return e.getIndex().makePost(e.getIndexStartValue(),t)}else return e.getIndex().minPost()}static getEndPost_(e){if(e.hasEnd()){const t=e.getIndexEndName();return e.getIndex().makePost(e.getIndexEndValue(),t)}else return e.getIndex().maxPost()}}/**
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
 */class aC{constructor(e){this.withinDirectionalStart=t=>this.reverse_?this.withinEndPost(t):this.withinStartPost(t),this.withinDirectionalEnd=t=>this.reverse_?this.withinStartPost(t):this.withinEndPost(t),this.withinStartPost=t=>{const s=this.index_.compare(this.rangedFilter_.getStartPost(),t);return this.startIsInclusive_?s<=0:s<0},this.withinEndPost=t=>{const s=this.index_.compare(t,this.rangedFilter_.getEndPost());return this.endIsInclusive_?s<=0:s<0},this.rangedFilter_=new ur(e),this.index_=e.getIndex(),this.limit_=e.getLimit(),this.reverse_=!e.isViewFromLeft(),this.startIsInclusive_=!e.startAfterSet_,this.endIsInclusive_=!e.endBeforeSet_}updateChild(e,t,s,i,r,o){return this.rangedFilter_.matches(new Z(t,s))||(s=H.EMPTY_NODE),e.getImmediateChild(t).equals(s)?e:e.numChildren()<this.limit_?this.rangedFilter_.getIndexedFilter().updateChild(e,t,s,i,r,o):this.fullLimitUpdateChild_(e,t,s,r,o)}updateFullNode(e,t,s){let i;if(t.isLeafNode()||t.isEmpty())i=H.EMPTY_NODE.withIndex(this.index_);else if(this.limit_*2<t.numChildren()&&t.isIndexed(this.index_)){i=H.EMPTY_NODE.withIndex(this.index_);let r;this.reverse_?r=t.getReverseIteratorFrom(this.rangedFilter_.getEndPost(),this.index_):r=t.getIteratorFrom(this.rangedFilter_.getStartPost(),this.index_);let o=0;for(;r.hasNext()&&o<this.limit_;){const l=r.getNext();if(this.withinDirectionalStart(l))if(this.withinDirectionalEnd(l))i=i.updateImmediateChild(l.name,l.node),o++;else break;else continue}}else{i=t.withIndex(this.index_),i=i.updatePriority(H.EMPTY_NODE);let r;this.reverse_?r=i.getReverseIterator(this.index_):r=i.getIterator(this.index_);let o=0;for(;r.hasNext();){const l=r.getNext();o<this.limit_&&this.withinDirectionalStart(l)&&this.withinDirectionalEnd(l)?o++:i=i.updateImmediateChild(l.name,H.EMPTY_NODE)}}return this.rangedFilter_.getIndexedFilter().updateFullNode(e,i,s)}updatePriority(e,t){return e}filtersNodes(){return!0}getIndexedFilter(){return this.rangedFilter_.getIndexedFilter()}getIndex(){return this.index_}fullLimitUpdateChild_(e,t,s,i,r){let o;if(this.reverse_){const m=this.index_.getCompare();o=(p,E)=>m(E,p)}else o=this.index_.getCompare();const l=e;M(l.numChildren()===this.limit_,"");const c=new Z(t,s),h=this.reverse_?l.getFirstChild(this.index_):l.getLastChild(this.index_),d=this.rangedFilter_.matches(c);if(l.hasChild(t)){const m=l.getImmediateChild(t);let p=i.getChildAfterChild(this.index_,h,this.reverse_);for(;p!=null&&(p.name===t||l.hasChild(p.name));)p=i.getChildAfterChild(this.index_,p,this.reverse_);const E=p==null?1:o(p,c);if(d&&!s.isEmpty()&&E>=0)return r!=null&&r.trackChildChange(hr(t,s,m)),l.updateImmediateChild(t,s);{r!=null&&r.trackChildChange(cr(t,m));const S=l.updateImmediateChild(t,H.EMPTY_NODE);return p!=null&&this.rangedFilter_.matches(p)?(r!=null&&r.trackChildChange(zs(p.name,p.node)),S.updateImmediateChild(p.name,p.node)):S}}else return s.isEmpty()?e:d&&o(h,c)>=0?(r!=null&&(r.trackChildChange(cr(h.name,h.node)),r.trackChildChange(zs(t,s))),l.updateImmediateChild(t,s).updateImmediateChild(h.name,H.EMPTY_NODE)):e}}/**
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
 */class Ih{constructor(){this.limitSet_=!1,this.startSet_=!1,this.startNameSet_=!1,this.startAfterSet_=!1,this.endSet_=!1,this.endNameSet_=!1,this.endBeforeSet_=!1,this.limit_=0,this.viewFrom_="",this.indexStartValue_=null,this.indexStartName_="",this.indexEndValue_=null,this.indexEndName_="",this.index_=Te}hasStart(){return this.startSet_}isViewFromLeft(){return this.viewFrom_===""?this.startSet_:this.viewFrom_==="l"}getIndexStartValue(){return M(this.startSet_,"Only valid if start has been set"),this.indexStartValue_}getIndexStartName(){return M(this.startSet_,"Only valid if start has been set"),this.startNameSet_?this.indexStartName_:cs}hasEnd(){return this.endSet_}getIndexEndValue(){return M(this.endSet_,"Only valid if end has been set"),this.indexEndValue_}getIndexEndName(){return M(this.endSet_,"Only valid if end has been set"),this.endNameSet_?this.indexEndName_:Mn}hasLimit(){return this.limitSet_}hasAnchoredLimit(){return this.limitSet_&&this.viewFrom_!==""}getLimit(){return M(this.limitSet_,"Only valid if limit has been set"),this.limit_}getIndex(){return this.index_}loadsAllData(){return!(this.startSet_||this.endSet_||this.limitSet_)}isDefault(){return this.loadsAllData()&&this.index_===Te}copy(){const e=new Ih;return e.limitSet_=this.limitSet_,e.limit_=this.limit_,e.startSet_=this.startSet_,e.startAfterSet_=this.startAfterSet_,e.indexStartValue_=this.indexStartValue_,e.startNameSet_=this.startNameSet_,e.indexStartName_=this.indexStartName_,e.endSet_=this.endSet_,e.endBeforeSet_=this.endBeforeSet_,e.indexEndValue_=this.indexEndValue_,e.endNameSet_=this.endNameSet_,e.indexEndName_=this.indexEndName_,e.index_=this.index_,e.viewFrom_=this.viewFrom_,e}}function lC(n){return n.loadsAllData()?new Th(n.getIndex()):n.hasLimit()?new aC(n):new ur(n)}function cC(n,e,t){const s=n.copy();return s.endSet_=!0,e===void 0&&(e=null),s.indexEndValue_=e,t!==void 0?(s.endNameSet_=!0,s.indexEndName_=t):(s.endNameSet_=!1,s.indexEndName_=""),s}function hC(n,e){const t=n.copy();return t.index_=e,t}function bf(n){const e={};if(n.isDefault())return e;let t;if(n.index_===Te?t="$priority":n.index_===zg?t="$value":n.index_===ns?t="$key":(M(n.index_ instanceof wh,"Unrecognized index type!"),t=n.index_.toString()),e.orderBy=Oe(t),n.startSet_){const s=n.startAfterSet_?"startAfter":"startAt";e[s]=Oe(n.indexStartValue_),n.startNameSet_&&(e[s]+=","+Oe(n.indexStartName_))}if(n.endSet_){const s=n.endBeforeSet_?"endBefore":"endAt";e[s]=Oe(n.indexEndValue_),n.endNameSet_&&(e[s]+=","+Oe(n.indexEndName_))}return n.limitSet_&&(n.isViewFromLeft()?e.limitToFirst=n.limit_:e.limitToLast=n.limit_),e}function Cf(n){const e={};if(n.startSet_&&(e.sp=n.indexStartValue_,n.startNameSet_&&(e.sn=n.indexStartName_),e.sin=!n.startAfterSet_),n.endSet_&&(e.ep=n.indexEndValue_,n.endNameSet_&&(e.en=n.indexEndName_),e.ein=!n.endBeforeSet_),n.limitSet_){e.l=n.limit_;let t=n.viewFrom_;t===""&&(n.isViewFromLeft()?t="l":t="r"),e.vf=t}return n.index_!==Te&&(e.i=n.index_.toString()),e}/**
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
 */class Ko extends Og{constructor(e,t,s,i){super(),this.repoInfo_=e,this.onDataUpdate_=t,this.authTokenProvider_=s,this.appCheckTokenProvider_=i,this.log_=Pr("p:rest:"),this.listens_={}}reportStats(e){throw new Error("Method not implemented.")}static getListenId_(e,t){return t!==void 0?"tag$"+t:(M(e._queryParams.isDefault(),"should have a tag if it's not a default query."),e._path.toString())}listen(e,t,s,i){const r=e._path.toString();this.log_("Listen called for "+r+" "+e._queryIdentifier);const o=Ko.getListenId_(e,s),l={};this.listens_[o]=l;const c=bf(e._queryParams);this.restRequest_(r+".json",c,(h,d)=>{let m=d;if(h===404&&(m=null,h=null),h===null&&this.onDataUpdate_(r,m,!1,s),Os(this.listens_,o)===l){let p;h?h===401?p="permission_denied":p="rest_error:"+h:p="ok",i(p,null)}})}unlisten(e,t){const s=Ko.getListenId_(e,t);delete this.listens_[s]}get(e){const t=bf(e._queryParams),s=e._path.toString(),i=new Mt;return this.restRequest_(s+".json",t,(r,o)=>{let l=o;r===404&&(l=null,r=null),r===null?(this.onDataUpdate_(s,l,!1,null),i.resolve(l)):i.reject(new Error(l))}),i.promise}refreshAuthToken(e){}restRequest_(e,t={},s){return t.format="export",Promise.all([this.authTokenProvider_.getToken(!1),this.appCheckTokenProvider_.getToken(!1)]).then(([i,r])=>{i&&i.accessToken&&(t.auth=i.accessToken),r&&r.token&&(t.ac=r.token);const o=(this.repoInfo_.secure?"https://":"http://")+this.repoInfo_.host+e+"?ns="+this.repoInfo_.namespace+Zs(t);this.log_("Sending REST request for "+o);const l=new XMLHttpRequest;l.onreadystatechange=()=>{if(s&&l.readyState===4){this.log_("REST Response for "+o+" received. status:",l.status,"response:",l.responseText);let c=null;if(l.status>=200&&l.status<300){try{c=Ji(l.responseText)}catch{ft("Failed to parse JSON response for "+o+": "+l.responseText)}s(null,c)}else l.status!==401&&l.status!==404&&ft("Got unsuccessful REST response for "+o+" Status: "+l.status),s(l.status);s=null}},l.open("GET",o,!0),l.send()})}}/**
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
 */class uC{constructor(){this.rootNode_=H.EMPTY_NODE}getNode(e){return this.rootNode_.getChild(e)}updateSnapshot(e,t){this.rootNode_=this.rootNode_.updateChild(e,t)}}/**
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
 */function Qo(){return{value:null,children:new Map}}function oi(n,e,t){if(J(e))n.value=t,n.children.clear();else if(n.value!==null)n.value=n.value.updateChild(e,t);else{const s=X(e);n.children.has(s)||n.children.set(s,Qo());const i=n.children.get(s);e=_e(e),oi(i,e,t)}}function sc(n,e){if(J(e))return n.value=null,n.children.clear(),!0;if(n.value!==null){if(n.value.isLeafNode())return!1;{const t=n.value;return n.value=null,t.forEachChild(Te,(s,i)=>{oi(n,new fe(s),i)}),sc(n,e)}}else if(n.children.size>0){const t=X(e);return e=_e(e),n.children.has(t)&&sc(n.children.get(t),e)&&n.children.delete(t),n.children.size===0}else return!0}function ic(n,e,t){n.value!==null?t(e,n.value):dC(n,(s,i)=>{const r=new fe(e.toString()+"/"+s);ic(i,r,t)})}function dC(n,e){n.children.forEach((t,s)=>{e(s,t)})}/**
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
 */class fC{constructor(e){this.collection_=e,this.last_=null}get(){const e=this.collection_.get(),t=Object.assign({},e);return this.last_&&We(this.last_,(s,i)=>{t[s]=t[s]-i}),this.last_=e,t}}/**
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
 */const Rf=10*1e3,mC=30*1e3,pC=5*60*1e3;class gC{constructor(e,t){this.server_=t,this.statsToReport_={},this.statsListener_=new fC(e);const s=Rf+(mC-Rf)*Math.random();zi(this.reportStats_.bind(this),Math.floor(s))}reportStats_(){const e=this.statsListener_.get(),t={};let s=!1;We(e,(i,r)=>{r>0&&$t(this.statsToReport_,i)&&(t[i]=r,s=!0)}),s&&this.server_.reportStats(t),zi(this.reportStats_.bind(this),Math.floor(Math.random()*2*pC))}}/**
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
 */var kt;(function(n){n[n.OVERWRITE=0]="OVERWRITE",n[n.MERGE=1]="MERGE",n[n.ACK_USER_WRITE=2]="ACK_USER_WRITE",n[n.LISTEN_COMPLETE=3]="LISTEN_COMPLETE"})(kt||(kt={}));function bh(){return{fromUser:!0,fromServer:!1,queryId:null,tagged:!1}}function Ch(){return{fromUser:!1,fromServer:!0,queryId:null,tagged:!1}}function Rh(n){return{fromUser:!1,fromServer:!0,queryId:n,tagged:!0}}/**
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
 */class Yo{constructor(e,t,s){this.path=e,this.affectedTree=t,this.revert=s,this.type=kt.ACK_USER_WRITE,this.source=bh()}operationForChild(e){if(J(this.path)){if(this.affectedTree.value!=null)return M(this.affectedTree.children.isEmpty(),"affectedTree should not have overlapping affected paths."),this;{const t=this.affectedTree.subtree(new fe(e));return new Yo(he(),t,this.revert)}}else return M(X(this.path)===e,"operationForChild called for unrelated child."),new Yo(_e(this.path),this.affectedTree,this.revert)}}/**
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
 */class dr{constructor(e,t){this.source=e,this.path=t,this.type=kt.LISTEN_COMPLETE}operationForChild(e){return J(this.path)?new dr(this.source,he()):new dr(this.source,_e(this.path))}}/**
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
 */class hs{constructor(e,t,s){this.source=e,this.path=t,this.snap=s,this.type=kt.OVERWRITE}operationForChild(e){return J(this.path)?new hs(this.source,he(),this.snap.getImmediateChild(e)):new hs(this.source,_e(this.path),this.snap)}}/**
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
 */class Hs{constructor(e,t,s){this.source=e,this.path=t,this.children=s,this.type=kt.MERGE}operationForChild(e){if(J(this.path)){const t=this.children.subtree(new fe(e));return t.isEmpty()?null:t.value?new hs(this.source,he(),t.value):new Hs(this.source,he(),t)}else return M(X(this.path)===e,"Can't get a merge for a child not on the path of the operation"),new Hs(this.source,_e(this.path),this.children)}toString(){return"Operation("+this.path+": "+this.source.toString()+" merge: "+this.children.toString()+")"}}/**
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
 */class On{constructor(e,t,s){this.node_=e,this.fullyInitialized_=t,this.filtered_=s}isFullyInitialized(){return this.fullyInitialized_}isFiltered(){return this.filtered_}isCompleteForPath(e){if(J(e))return this.isFullyInitialized()&&!this.filtered_;const t=X(e);return this.isCompleteForChild(t)}isCompleteForChild(e){return this.isFullyInitialized()&&!this.filtered_||this.node_.hasChild(e)}getNode(){return this.node_}}/**
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
 */class _C{constructor(e){this.query_=e,this.index_=this.query_._queryParams.getIndex()}}function yC(n,e,t,s){const i=[],r=[];return e.forEach(o=>{o.type==="child_changed"&&n.index_.indexedValueChanged(o.oldSnap,o.snapshotNode)&&r.push(oC(o.childName,o.snapshotNode))}),Mi(n,i,"child_removed",e,s,t),Mi(n,i,"child_added",e,s,t),Mi(n,i,"child_moved",r,s,t),Mi(n,i,"child_changed",e,s,t),Mi(n,i,"value",e,s,t),i}function Mi(n,e,t,s,i,r){const o=s.filter(l=>l.type===t);o.sort((l,c)=>EC(n,l,c)),o.forEach(l=>{const c=vC(n,l,r);i.forEach(h=>{h.respondsTo(l.type)&&e.push(h.createEvent(c,n.query_))})})}function vC(n,e,t){return e.type==="value"||e.type==="child_removed"||(e.prevName=t.getPredecessorChildName(e.childName,e.snapshotNode,n.index_)),e}function EC(n,e,t){if(e.childName==null||t.childName==null)throw Js("Should only compare child_ events.");const s=new Z(e.childName,e.snapshotNode),i=new Z(t.childName,t.snapshotNode);return n.index_.compare(s,i)}/**
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
 */function xa(n,e){return{eventCache:n,serverCache:e}}function Hi(n,e,t,s){return xa(new On(e,t,s),n.serverCache)}function Gg(n,e,t,s){return xa(n.eventCache,new On(e,t,s))}function Xo(n){return n.eventCache.isFullyInitialized()?n.eventCache.getNode():null}function us(n){return n.serverCache.isFullyInitialized()?n.serverCache.getNode():null}/**
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
 */let Sl;const wC=()=>(Sl||(Sl=new pt(rb)),Sl);class ve{constructor(e,t=wC()){this.value=e,this.children=t}static fromObject(e){let t=new ve(null);return We(e,(s,i)=>{t=t.set(new fe(s),i)}),t}isEmpty(){return this.value===null&&this.children.isEmpty()}findRootMostMatchingPathAndValue(e,t){if(this.value!=null&&t(this.value))return{path:he(),value:this.value};if(J(e))return null;{const s=X(e),i=this.children.get(s);if(i!==null){const r=i.findRootMostMatchingPathAndValue(_e(e),t);return r!=null?{path:be(new fe(s),r.path),value:r.value}:null}else return null}}findRootMostValueAndPath(e){return this.findRootMostMatchingPathAndValue(e,()=>!0)}subtree(e){if(J(e))return this;{const t=X(e),s=this.children.get(t);return s!==null?s.subtree(_e(e)):new ve(null)}}set(e,t){if(J(e))return new ve(t,this.children);{const s=X(e),r=(this.children.get(s)||new ve(null)).set(_e(e),t),o=this.children.insert(s,r);return new ve(this.value,o)}}remove(e){if(J(e))return this.children.isEmpty()?new ve(null):new ve(null,this.children);{const t=X(e),s=this.children.get(t);if(s){const i=s.remove(_e(e));let r;return i.isEmpty()?r=this.children.remove(t):r=this.children.insert(t,i),this.value===null&&r.isEmpty()?new ve(null):new ve(this.value,r)}else return this}}get(e){if(J(e))return this.value;{const t=X(e),s=this.children.get(t);return s?s.get(_e(e)):null}}setTree(e,t){if(J(e))return t;{const s=X(e),r=(this.children.get(s)||new ve(null)).setTree(_e(e),t);let o;return r.isEmpty()?o=this.children.remove(s):o=this.children.insert(s,r),new ve(this.value,o)}}fold(e){return this.fold_(he(),e)}fold_(e,t){const s={};return this.children.inorderTraversal((i,r)=>{s[i]=r.fold_(be(e,i),t)}),t(e,this.value,s)}findOnPath(e,t){return this.findOnPath_(e,he(),t)}findOnPath_(e,t,s){const i=this.value?s(t,this.value):!1;if(i)return i;if(J(e))return null;{const r=X(e),o=this.children.get(r);return o?o.findOnPath_(_e(e),be(t,r),s):null}}foreachOnPath(e,t){return this.foreachOnPath_(e,he(),t)}foreachOnPath_(e,t,s){if(J(e))return this;{this.value&&s(t,this.value);const i=X(e),r=this.children.get(i);return r?r.foreachOnPath_(_e(e),be(t,i),s):new ve(null)}}foreach(e){this.foreach_(he(),e)}foreach_(e,t){this.children.inorderTraversal((s,i)=>{i.foreach_(be(e,s),t)}),this.value&&t(e,this.value)}foreachChild(e){this.children.inorderTraversal((t,s)=>{s.value&&e(t,s.value)})}}/**
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
 */class Nt{constructor(e){this.writeTree_=e}static empty(){return new Nt(new ve(null))}}function Gi(n,e,t){if(J(e))return new Nt(new ve(t));{const s=n.writeTree_.findRootMostValueAndPath(e);if(s!=null){const i=s.path;let r=s.value;const o=dt(i,e);return r=r.updateChild(o,t),new Nt(n.writeTree_.set(i,r))}else{const i=new ve(t),r=n.writeTree_.setTree(e,i);return new Nt(r)}}}function rc(n,e,t){let s=n;return We(t,(i,r)=>{s=Gi(s,be(e,i),r)}),s}function Sf(n,e){if(J(e))return Nt.empty();{const t=n.writeTree_.setTree(e,new ve(null));return new Nt(t)}}function oc(n,e){return _s(n,e)!=null}function _s(n,e){const t=n.writeTree_.findRootMostValueAndPath(e);return t!=null?n.writeTree_.get(t.path).getChild(dt(t.path,e)):null}function Af(n){const e=[],t=n.writeTree_.value;return t!=null?t.isLeafNode()||t.forEachChild(Te,(s,i)=>{e.push(new Z(s,i))}):n.writeTree_.children.inorderTraversal((s,i)=>{i.value!=null&&e.push(new Z(s,i.value))}),e}function An(n,e){if(J(e))return n;{const t=_s(n,e);return t!=null?new Nt(new ve(t)):new Nt(n.writeTree_.subtree(e))}}function ac(n){return n.writeTree_.isEmpty()}function Gs(n,e){return Kg(he(),n.writeTree_,e)}function Kg(n,e,t){if(e.value!=null)return t.updateChild(n,e.value);{let s=null;return e.children.inorderTraversal((i,r)=>{i===".priority"?(M(r.value!==null,"Priority writes must always be leaf nodes"),s=r.value):t=Kg(be(n,i),r,t)}),!t.getChild(n).isEmpty()&&s!==null&&(t=t.updateChild(be(n,".priority"),s)),t}}/**
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
 */function Ma(n,e){return Jg(e,n)}function TC(n,e,t,s,i){M(s>n.lastWriteId,"Stacking an older write on top of newer ones"),i===void 0&&(i=!0),n.allWrites.push({path:e,snap:t,writeId:s,visible:i}),i&&(n.visibleWrites=Gi(n.visibleWrites,e,t)),n.lastWriteId=s}function IC(n,e,t,s){M(s>n.lastWriteId,"Stacking an older merge on top of newer ones"),n.allWrites.push({path:e,children:t,writeId:s,visible:!0}),n.visibleWrites=rc(n.visibleWrites,e,t),n.lastWriteId=s}function bC(n,e){for(let t=0;t<n.allWrites.length;t++){const s=n.allWrites[t];if(s.writeId===e)return s}return null}function CC(n,e){const t=n.allWrites.findIndex(l=>l.writeId===e);M(t>=0,"removeWrite called with nonexistent writeId.");const s=n.allWrites[t];n.allWrites.splice(t,1);let i=s.visible,r=!1,o=n.allWrites.length-1;for(;i&&o>=0;){const l=n.allWrites[o];l.visible&&(o>=t&&RC(l,s.path)?i=!1:bt(s.path,l.path)&&(r=!0)),o--}if(i){if(r)return SC(n),!0;if(s.snap)n.visibleWrites=Sf(n.visibleWrites,s.path);else{const l=s.children;We(l,c=>{n.visibleWrites=Sf(n.visibleWrites,be(s.path,c))})}return!0}else return!1}function RC(n,e){if(n.snap)return bt(n.path,e);for(const t in n.children)if(n.children.hasOwnProperty(t)&&bt(be(n.path,t),e))return!0;return!1}function SC(n){n.visibleWrites=Qg(n.allWrites,AC,he()),n.allWrites.length>0?n.lastWriteId=n.allWrites[n.allWrites.length-1].writeId:n.lastWriteId=-1}function AC(n){return n.visible}function Qg(n,e,t){let s=Nt.empty();for(let i=0;i<n.length;++i){const r=n[i];if(e(r)){const o=r.path;let l;if(r.snap)bt(t,o)?(l=dt(t,o),s=Gi(s,l,r.snap)):bt(o,t)&&(l=dt(o,t),s=Gi(s,he(),r.snap.getChild(l)));else if(r.children){if(bt(t,o))l=dt(t,o),s=rc(s,l,r.children);else if(bt(o,t))if(l=dt(o,t),J(l))s=rc(s,he(),r.children);else{const c=Os(r.children,X(l));if(c){const h=c.getChild(_e(l));s=Gi(s,he(),h)}}}else throw Js("WriteRecord should have .snap or .children")}}return s}function Yg(n,e,t,s,i){if(!s&&!i){const r=_s(n.visibleWrites,e);if(r!=null)return r;{const o=An(n.visibleWrites,e);if(ac(o))return t;if(t==null&&!oc(o,he()))return null;{const l=t||H.EMPTY_NODE;return Gs(o,l)}}}else{const r=An(n.visibleWrites,e);if(!i&&ac(r))return t;if(!i&&t==null&&!oc(r,he()))return null;{const o=function(h){return(h.visible||i)&&(!s||!~s.indexOf(h.writeId))&&(bt(h.path,e)||bt(e,h.path))},l=Qg(n.allWrites,o,e),c=t||H.EMPTY_NODE;return Gs(l,c)}}}function kC(n,e,t){let s=H.EMPTY_NODE;const i=_s(n.visibleWrites,e);if(i)return i.isLeafNode()||i.forEachChild(Te,(r,o)=>{s=s.updateImmediateChild(r,o)}),s;if(t){const r=An(n.visibleWrites,e);return t.forEachChild(Te,(o,l)=>{const c=Gs(An(r,new fe(o)),l);s=s.updateImmediateChild(o,c)}),Af(r).forEach(o=>{s=s.updateImmediateChild(o.name,o.node)}),s}else{const r=An(n.visibleWrites,e);return Af(r).forEach(o=>{s=s.updateImmediateChild(o.name,o.node)}),s}}function PC(n,e,t,s,i){M(s||i,"Either existingEventSnap or existingServerSnap must exist");const r=be(e,t);if(oc(n.visibleWrites,r))return null;{const o=An(n.visibleWrites,r);return ac(o)?i.getChild(t):Gs(o,i.getChild(t))}}function NC(n,e,t,s){const i=be(e,t),r=_s(n.visibleWrites,i);if(r!=null)return r;if(s.isCompleteForChild(t)){const o=An(n.visibleWrites,i);return Gs(o,s.getNode().getImmediateChild(t))}else return null}function DC(n,e){return _s(n.visibleWrites,e)}function xC(n,e,t,s,i,r,o){let l;const c=An(n.visibleWrites,e),h=_s(c,he());if(h!=null)l=h;else if(t!=null)l=Gs(c,t);else return[];if(l=l.withIndex(o),!l.isEmpty()&&!l.isLeafNode()){const d=[],m=o.getCompare(),p=r?l.getReverseIteratorFrom(s,o):l.getIteratorFrom(s,o);let E=p.getNext();for(;E&&d.length<i;)m(E,s)!==0&&d.push(E),E=p.getNext();return d}else return[]}function MC(){return{visibleWrites:Nt.empty(),allWrites:[],lastWriteId:-1}}function Jo(n,e,t,s){return Yg(n.writeTree,n.treePath,e,t,s)}function Sh(n,e){return kC(n.writeTree,n.treePath,e)}function kf(n,e,t,s){return PC(n.writeTree,n.treePath,e,t,s)}function Zo(n,e){return DC(n.writeTree,be(n.treePath,e))}function LC(n,e,t,s,i,r){return xC(n.writeTree,n.treePath,e,t,s,i,r)}function Ah(n,e,t){return NC(n.writeTree,n.treePath,e,t)}function Xg(n,e){return Jg(be(n.treePath,e),n.writeTree)}function Jg(n,e){return{treePath:n,writeTree:e}}/**
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
 */class OC{constructor(){this.changeMap=new Map}trackChildChange(e){const t=e.type,s=e.childName;M(t==="child_added"||t==="child_changed"||t==="child_removed","Only child changes supported for tracking"),M(s!==".priority","Only non-priority child changes can be tracked.");const i=this.changeMap.get(s);if(i){const r=i.type;if(t==="child_added"&&r==="child_removed")this.changeMap.set(s,hr(s,e.snapshotNode,i.snapshotNode));else if(t==="child_removed"&&r==="child_added")this.changeMap.delete(s);else if(t==="child_removed"&&r==="child_changed")this.changeMap.set(s,cr(s,i.oldSnap));else if(t==="child_changed"&&r==="child_added")this.changeMap.set(s,zs(s,e.snapshotNode));else if(t==="child_changed"&&r==="child_changed")this.changeMap.set(s,hr(s,e.snapshotNode,i.oldSnap));else throw Js("Illegal combination of changes: "+e+" occurred after "+i)}else this.changeMap.set(s,e)}getChanges(){return Array.from(this.changeMap.values())}}/**
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
 */class VC{getCompleteChild(e){return null}getChildAfterChild(e,t,s){return null}}const Zg=new VC;class kh{constructor(e,t,s=null){this.writes_=e,this.viewCache_=t,this.optCompleteServerCache_=s}getCompleteChild(e){const t=this.viewCache_.eventCache;if(t.isCompleteForChild(e))return t.getNode().getImmediateChild(e);{const s=this.optCompleteServerCache_!=null?new On(this.optCompleteServerCache_,!0,!1):this.viewCache_.serverCache;return Ah(this.writes_,e,s)}}getChildAfterChild(e,t,s){const i=this.optCompleteServerCache_!=null?this.optCompleteServerCache_:us(this.viewCache_),r=LC(this.writes_,i,t,1,s,e);return r.length===0?null:r[0]}}/**
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
 */function FC(n){return{filter:n}}function BC(n,e){M(e.eventCache.getNode().isIndexed(n.filter.getIndex()),"Event snap not indexed"),M(e.serverCache.getNode().isIndexed(n.filter.getIndex()),"Server snap not indexed")}function UC(n,e,t,s,i){const r=new OC;let o,l;if(t.type===kt.OVERWRITE){const h=t;h.source.fromUser?o=lc(n,e,h.path,h.snap,s,i,r):(M(h.source.fromServer,"Unknown source."),l=h.source.tagged||e.serverCache.isFiltered()&&!J(h.path),o=ea(n,e,h.path,h.snap,s,i,l,r))}else if(t.type===kt.MERGE){const h=t;h.source.fromUser?o=$C(n,e,h.path,h.children,s,i,r):(M(h.source.fromServer,"Unknown source."),l=h.source.tagged||e.serverCache.isFiltered(),o=cc(n,e,h.path,h.children,s,i,l,r))}else if(t.type===kt.ACK_USER_WRITE){const h=t;h.revert?o=zC(n,e,h.path,s,i,r):o=WC(n,e,h.path,h.affectedTree,s,i,r)}else if(t.type===kt.LISTEN_COMPLETE)o=qC(n,e,t.path,s,r);else throw Js("Unknown operation type: "+t.type);const c=r.getChanges();return jC(e,o,c),{viewCache:o,changes:c}}function jC(n,e,t){const s=e.eventCache;if(s.isFullyInitialized()){const i=s.getNode().isLeafNode()||s.getNode().isEmpty(),r=Xo(n);(t.length>0||!n.eventCache.isFullyInitialized()||i&&!s.getNode().equals(r)||!s.getNode().getPriority().equals(r.getPriority()))&&t.push(Hg(Xo(e)))}}function e_(n,e,t,s,i,r){const o=e.eventCache;if(Zo(s,t)!=null)return e;{let l,c;if(J(t))if(M(e.serverCache.isFullyInitialized(),"If change path is empty, we must have complete server data"),e.serverCache.isFiltered()){const h=us(e),d=h instanceof H?h:H.EMPTY_NODE,m=Sh(s,d);l=n.filter.updateFullNode(e.eventCache.getNode(),m,r)}else{const h=Jo(s,us(e));l=n.filter.updateFullNode(e.eventCache.getNode(),h,r)}else{const h=X(t);if(h===".priority"){M(Ln(t)===1,"Can't have a priority with additional path components");const d=o.getNode();c=e.serverCache.getNode();const m=kf(s,t,d,c);m!=null?l=n.filter.updatePriority(d,m):l=o.getNode()}else{const d=_e(t);let m;if(o.isCompleteForChild(h)){c=e.serverCache.getNode();const p=kf(s,t,o.getNode(),c);p!=null?m=o.getNode().getImmediateChild(h).updateChild(d,p):m=o.getNode().getImmediateChild(h)}else m=Ah(s,h,e.serverCache);m!=null?l=n.filter.updateChild(o.getNode(),h,m,d,i,r):l=o.getNode()}}return Hi(e,l,o.isFullyInitialized()||J(t),n.filter.filtersNodes())}}function ea(n,e,t,s,i,r,o,l){const c=e.serverCache;let h;const d=o?n.filter:n.filter.getIndexedFilter();if(J(t))h=d.updateFullNode(c.getNode(),s,null);else if(d.filtersNodes()&&!c.isFiltered()){const E=c.getNode().updateChild(t,s);h=d.updateFullNode(c.getNode(),E,null)}else{const E=X(t);if(!c.isCompleteForPath(t)&&Ln(t)>1)return e;const b=_e(t),P=c.getNode().getImmediateChild(E).updateChild(b,s);E===".priority"?h=d.updatePriority(c.getNode(),P):h=d.updateChild(c.getNode(),E,P,b,Zg,null)}const m=Gg(e,h,c.isFullyInitialized()||J(t),d.filtersNodes()),p=new kh(i,m,r);return e_(n,m,t,i,p,l)}function lc(n,e,t,s,i,r,o){const l=e.eventCache;let c,h;const d=new kh(i,e,r);if(J(t))h=n.filter.updateFullNode(e.eventCache.getNode(),s,o),c=Hi(e,h,!0,n.filter.filtersNodes());else{const m=X(t);if(m===".priority")h=n.filter.updatePriority(e.eventCache.getNode(),s),c=Hi(e,h,l.isFullyInitialized(),l.isFiltered());else{const p=_e(t),E=l.getNode().getImmediateChild(m);let b;if(J(p))b=s;else{const S=d.getCompleteChild(m);S!=null?_h(p)===".priority"&&S.getChild(Fg(p)).isEmpty()?b=S:b=S.updateChild(p,s):b=H.EMPTY_NODE}if(E.equals(b))c=e;else{const S=n.filter.updateChild(l.getNode(),m,b,p,d,o);c=Hi(e,S,l.isFullyInitialized(),n.filter.filtersNodes())}}}return c}function Pf(n,e){return n.eventCache.isCompleteForChild(e)}function $C(n,e,t,s,i,r,o){let l=e;return s.foreach((c,h)=>{const d=be(t,c);Pf(e,X(d))&&(l=lc(n,l,d,h,i,r,o))}),s.foreach((c,h)=>{const d=be(t,c);Pf(e,X(d))||(l=lc(n,l,d,h,i,r,o))}),l}function Nf(n,e,t){return t.foreach((s,i)=>{e=e.updateChild(s,i)}),e}function cc(n,e,t,s,i,r,o,l){if(e.serverCache.getNode().isEmpty()&&!e.serverCache.isFullyInitialized())return e;let c=e,h;J(t)?h=s:h=new ve(null).setTree(t,s);const d=e.serverCache.getNode();return h.children.inorderTraversal((m,p)=>{if(d.hasChild(m)){const E=e.serverCache.getNode().getImmediateChild(m),b=Nf(n,E,p);c=ea(n,c,new fe(m),b,i,r,o,l)}}),h.children.inorderTraversal((m,p)=>{const E=!e.serverCache.isCompleteForChild(m)&&p.value===null;if(!d.hasChild(m)&&!E){const b=e.serverCache.getNode().getImmediateChild(m),S=Nf(n,b,p);c=ea(n,c,new fe(m),S,i,r,o,l)}}),c}function WC(n,e,t,s,i,r,o){if(Zo(i,t)!=null)return e;const l=e.serverCache.isFiltered(),c=e.serverCache;if(s.value!=null){if(J(t)&&c.isFullyInitialized()||c.isCompleteForPath(t))return ea(n,e,t,c.getNode().getChild(t),i,r,l,o);if(J(t)){let h=new ve(null);return c.getNode().forEachChild(ns,(d,m)=>{h=h.set(new fe(d),m)}),cc(n,e,t,h,i,r,l,o)}else return e}else{let h=new ve(null);return s.foreach((d,m)=>{const p=be(t,d);c.isCompleteForPath(p)&&(h=h.set(d,c.getNode().getChild(p)))}),cc(n,e,t,h,i,r,l,o)}}function qC(n,e,t,s,i){const r=e.serverCache,o=Gg(e,r.getNode(),r.isFullyInitialized()||J(t),r.isFiltered());return e_(n,o,t,s,Zg,i)}function zC(n,e,t,s,i,r){let o;if(Zo(s,t)!=null)return e;{const l=new kh(s,e,i),c=e.eventCache.getNode();let h;if(J(t)||X(t)===".priority"){let d;if(e.serverCache.isFullyInitialized())d=Jo(s,us(e));else{const m=e.serverCache.getNode();M(m instanceof H,"serverChildren would be complete if leaf node"),d=Sh(s,m)}d=d,h=n.filter.updateFullNode(c,d,r)}else{const d=X(t);let m=Ah(s,d,e.serverCache);m==null&&e.serverCache.isCompleteForChild(d)&&(m=c.getImmediateChild(d)),m!=null?h=n.filter.updateChild(c,d,m,_e(t),l,r):e.eventCache.getNode().hasChild(d)?h=n.filter.updateChild(c,d,H.EMPTY_NODE,_e(t),l,r):h=c,h.isEmpty()&&e.serverCache.isFullyInitialized()&&(o=Jo(s,us(e)),o.isLeafNode()&&(h=n.filter.updateFullNode(h,o,r)))}return o=e.serverCache.isFullyInitialized()||Zo(s,he())!=null,Hi(e,h,o,n.filter.filtersNodes())}}/**
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
 */class HC{constructor(e,t){this.query_=e,this.eventRegistrations_=[];const s=this.query_._queryParams,i=new Th(s.getIndex()),r=lC(s);this.processor_=FC(r);const o=t.serverCache,l=t.eventCache,c=i.updateFullNode(H.EMPTY_NODE,o.getNode(),null),h=r.updateFullNode(H.EMPTY_NODE,l.getNode(),null),d=new On(c,o.isFullyInitialized(),i.filtersNodes()),m=new On(h,l.isFullyInitialized(),r.filtersNodes());this.viewCache_=xa(m,d),this.eventGenerator_=new _C(this.query_)}get query(){return this.query_}}function GC(n){return n.viewCache_.serverCache.getNode()}function KC(n){return Xo(n.viewCache_)}function QC(n,e){const t=us(n.viewCache_);return t&&(n.query._queryParams.loadsAllData()||!J(e)&&!t.getImmediateChild(X(e)).isEmpty())?t.getChild(e):null}function Df(n){return n.eventRegistrations_.length===0}function YC(n,e){n.eventRegistrations_.push(e)}function xf(n,e,t){const s=[];if(t){M(e==null,"A cancel should cancel all event registrations.");const i=n.query._path;n.eventRegistrations_.forEach(r=>{const o=r.createCancelEvent(t,i);o&&s.push(o)})}if(e){let i=[];for(let r=0;r<n.eventRegistrations_.length;++r){const o=n.eventRegistrations_[r];if(!o.matches(e))i.push(o);else if(e.hasAnyCallback()){i=i.concat(n.eventRegistrations_.slice(r+1));break}}n.eventRegistrations_=i}else n.eventRegistrations_=[];return s}function Mf(n,e,t,s){e.type===kt.MERGE&&e.source.queryId!==null&&(M(us(n.viewCache_),"We should always have a full cache before handling merges"),M(Xo(n.viewCache_),"Missing event cache, even though we have a server cache"));const i=n.viewCache_,r=UC(n.processor_,i,e,t,s);return BC(n.processor_,r.viewCache),M(r.viewCache.serverCache.isFullyInitialized()||!i.serverCache.isFullyInitialized(),"Once a server snap is complete, it should never go back"),n.viewCache_=r.viewCache,t_(n,r.changes,r.viewCache.eventCache.getNode(),null)}function XC(n,e){const t=n.viewCache_.eventCache,s=[];return t.getNode().isLeafNode()||t.getNode().forEachChild(Te,(r,o)=>{s.push(zs(r,o))}),t.isFullyInitialized()&&s.push(Hg(t.getNode())),t_(n,s,t.getNode(),e)}function t_(n,e,t,s){const i=s?[s]:n.eventRegistrations_;return yC(n.eventGenerator_,e,t,i)}/**
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
 */let ta;class n_{constructor(){this.views=new Map}}function JC(n){M(!ta,"__referenceConstructor has already been defined"),ta=n}function ZC(){return M(ta,"Reference.ts has not been loaded"),ta}function eR(n){return n.views.size===0}function Ph(n,e,t,s){const i=e.source.queryId;if(i!==null){const r=n.views.get(i);return M(r!=null,"SyncTree gave us an op for an invalid query."),Mf(r,e,t,s)}else{let r=[];for(const o of n.views.values())r=r.concat(Mf(o,e,t,s));return r}}function s_(n,e,t,s,i){const r=e._queryIdentifier,o=n.views.get(r);if(!o){let l=Jo(t,i?s:null),c=!1;l?c=!0:s instanceof H?(l=Sh(t,s),c=!1):(l=H.EMPTY_NODE,c=!1);const h=xa(new On(l,c,!1),new On(s,i,!1));return new HC(e,h)}return o}function tR(n,e,t,s,i,r){const o=s_(n,e,s,i,r);return n.views.has(e._queryIdentifier)||n.views.set(e._queryIdentifier,o),YC(o,t),XC(o,t)}function nR(n,e,t,s){const i=e._queryIdentifier,r=[];let o=[];const l=Vn(n);if(i==="default")for(const[c,h]of n.views.entries())o=o.concat(xf(h,t,s)),Df(h)&&(n.views.delete(c),h.query._queryParams.loadsAllData()||r.push(h.query));else{const c=n.views.get(i);c&&(o=o.concat(xf(c,t,s)),Df(c)&&(n.views.delete(i),c.query._queryParams.loadsAllData()||r.push(c.query)))}return l&&!Vn(n)&&r.push(new(ZC())(e._repo,e._path)),{removed:r,events:o}}function i_(n){const e=[];for(const t of n.views.values())t.query._queryParams.loadsAllData()||e.push(t);return e}function kn(n,e){let t=null;for(const s of n.views.values())t=t||QC(s,e);return t}function r_(n,e){if(e._queryParams.loadsAllData())return La(n);{const s=e._queryIdentifier;return n.views.get(s)}}function o_(n,e){return r_(n,e)!=null}function Vn(n){return La(n)!=null}function La(n){for(const e of n.views.values())if(e.query._queryParams.loadsAllData())return e;return null}/**
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
 */let na;function sR(n){M(!na,"__referenceConstructor has already been defined"),na=n}function iR(){return M(na,"Reference.ts has not been loaded"),na}let rR=1;class Lf{constructor(e){this.listenProvider_=e,this.syncPointTree_=new ve(null),this.pendingWriteTree_=MC(),this.tagToQueryMap=new Map,this.queryToTagMap=new Map}}function a_(n,e,t,s,i){return TC(n.pendingWriteTree_,e,t,s,i),i?ai(n,new hs(bh(),e,t)):[]}function oR(n,e,t,s){IC(n.pendingWriteTree_,e,t,s);const i=ve.fromObject(t);return ai(n,new Hs(bh(),e,i))}function Tn(n,e,t=!1){const s=bC(n.pendingWriteTree_,e);if(CC(n.pendingWriteTree_,e)){let r=new ve(null);return s.snap!=null?r=r.set(he(),!0):We(s.children,o=>{r=r.set(new fe(o),!0)}),ai(n,new Yo(s.path,r,t))}else return[]}function Dr(n,e,t){return ai(n,new hs(Ch(),e,t))}function aR(n,e,t){const s=ve.fromObject(t);return ai(n,new Hs(Ch(),e,s))}function lR(n,e){return ai(n,new dr(Ch(),e))}function cR(n,e,t){const s=Dh(n,t);if(s){const i=xh(s),r=i.path,o=i.queryId,l=dt(r,e),c=new dr(Rh(o),l);return Mh(n,r,c)}else return[]}function sa(n,e,t,s,i=!1){const r=e._path,o=n.syncPointTree_.get(r);let l=[];if(o&&(e._queryIdentifier==="default"||o_(o,e))){const c=nR(o,e,t,s);eR(o)&&(n.syncPointTree_=n.syncPointTree_.remove(r));const h=c.removed;if(l=c.events,!i){const d=h.findIndex(p=>p._queryParams.loadsAllData())!==-1,m=n.syncPointTree_.findOnPath(r,(p,E)=>Vn(E));if(d&&!m){const p=n.syncPointTree_.subtree(r);if(!p.isEmpty()){const E=dR(p);for(let b=0;b<E.length;++b){const S=E[b],P=S.query,F=u_(n,S);n.listenProvider_.startListening(Ki(P),fr(n,P),F.hashFn,F.onComplete)}}}!m&&h.length>0&&!s&&(d?n.listenProvider_.stopListening(Ki(e),null):h.forEach(p=>{const E=n.queryToTagMap.get(Oa(p));n.listenProvider_.stopListening(Ki(p),E)}))}fR(n,h)}return l}function l_(n,e,t,s){const i=Dh(n,s);if(i!=null){const r=xh(i),o=r.path,l=r.queryId,c=dt(o,e),h=new hs(Rh(l),c,t);return Mh(n,o,h)}else return[]}function hR(n,e,t,s){const i=Dh(n,s);if(i){const r=xh(i),o=r.path,l=r.queryId,c=dt(o,e),h=ve.fromObject(t),d=new Hs(Rh(l),c,h);return Mh(n,o,d)}else return[]}function hc(n,e,t,s=!1){const i=e._path;let r=null,o=!1;n.syncPointTree_.foreachOnPath(i,(p,E)=>{const b=dt(p,i);r=r||kn(E,b),o=o||Vn(E)});let l=n.syncPointTree_.get(i);l?(o=o||Vn(l),r=r||kn(l,he())):(l=new n_,n.syncPointTree_=n.syncPointTree_.set(i,l));let c;r!=null?c=!0:(c=!1,r=H.EMPTY_NODE,n.syncPointTree_.subtree(i).foreachChild((E,b)=>{const S=kn(b,he());S&&(r=r.updateImmediateChild(E,S))}));const h=o_(l,e);if(!h&&!e._queryParams.loadsAllData()){const p=Oa(e);M(!n.queryToTagMap.has(p),"View does not exist, but we have a tag");const E=mR();n.queryToTagMap.set(p,E),n.tagToQueryMap.set(E,p)}const d=Ma(n.pendingWriteTree_,i);let m=tR(l,e,t,d,r,c);if(!h&&!o&&!s){const p=r_(l,e);m=m.concat(pR(n,e,p))}return m}function Nh(n,e,t){const i=n.pendingWriteTree_,r=n.syncPointTree_.findOnPath(e,(o,l)=>{const c=dt(o,e),h=kn(l,c);if(h)return h});return Yg(i,e,r,t,!0)}function uR(n,e){const t=e._path;let s=null;n.syncPointTree_.foreachOnPath(t,(h,d)=>{const m=dt(h,t);s=s||kn(d,m)});let i=n.syncPointTree_.get(t);i?s=s||kn(i,he()):(i=new n_,n.syncPointTree_=n.syncPointTree_.set(t,i));const r=s!=null,o=r?new On(s,!0,!1):null,l=Ma(n.pendingWriteTree_,e._path),c=s_(i,e,l,r?o.getNode():H.EMPTY_NODE,r);return KC(c)}function ai(n,e){return c_(e,n.syncPointTree_,null,Ma(n.pendingWriteTree_,he()))}function c_(n,e,t,s){if(J(n.path))return h_(n,e,t,s);{const i=e.get(he());t==null&&i!=null&&(t=kn(i,he()));let r=[];const o=X(n.path),l=n.operationForChild(o),c=e.children.get(o);if(c&&l){const h=t?t.getImmediateChild(o):null,d=Xg(s,o);r=r.concat(c_(l,c,h,d))}return i&&(r=r.concat(Ph(i,n,s,t))),r}}function h_(n,e,t,s){const i=e.get(he());t==null&&i!=null&&(t=kn(i,he()));let r=[];return e.children.inorderTraversal((o,l)=>{const c=t?t.getImmediateChild(o):null,h=Xg(s,o),d=n.operationForChild(o);d&&(r=r.concat(h_(d,l,c,h)))}),i&&(r=r.concat(Ph(i,n,s,t))),r}function u_(n,e){const t=e.query,s=fr(n,t);return{hashFn:()=>(GC(e)||H.EMPTY_NODE).hash(),onComplete:i=>{if(i==="ok")return s?cR(n,t._path,s):lR(n,t._path);{const r=lb(i,t);return sa(n,t,null,r)}}}}function fr(n,e){const t=Oa(e);return n.queryToTagMap.get(t)}function Oa(n){return n._path.toString()+"$"+n._queryIdentifier}function Dh(n,e){return n.tagToQueryMap.get(e)}function xh(n){const e=n.indexOf("$");return M(e!==-1&&e<n.length-1,"Bad queryKey."),{queryId:n.substr(e+1),path:new fe(n.substr(0,e))}}function Mh(n,e,t){const s=n.syncPointTree_.get(e);M(s,"Missing sync point for query tag that we're tracking");const i=Ma(n.pendingWriteTree_,e);return Ph(s,t,i,null)}function dR(n){return n.fold((e,t,s)=>{if(t&&Vn(t))return[La(t)];{let i=[];return t&&(i=i_(t)),We(s,(r,o)=>{i=i.concat(o)}),i}})}function Ki(n){return n._queryParams.loadsAllData()&&!n._queryParams.isDefault()?new(iR())(n._repo,n._path):n}function fR(n,e){for(let t=0;t<e.length;++t){const s=e[t];if(!s._queryParams.loadsAllData()){const i=Oa(s),r=n.queryToTagMap.get(i);n.queryToTagMap.delete(i),n.tagToQueryMap.delete(r)}}}function mR(){return rR++}function pR(n,e,t){const s=e._path,i=fr(n,e),r=u_(n,t),o=n.listenProvider_.startListening(Ki(e),i,r.hashFn,r.onComplete),l=n.syncPointTree_.subtree(s);if(i)M(!Vn(l.value),"If we're adding a query, it shouldn't be shadowed");else{const c=l.fold((h,d,m)=>{if(!J(h)&&d&&Vn(d))return[La(d).query];{let p=[];return d&&(p=p.concat(i_(d).map(E=>E.query))),We(m,(E,b)=>{p=p.concat(b)}),p}});for(let h=0;h<c.length;++h){const d=c[h];n.listenProvider_.stopListening(Ki(d),fr(n,d))}}return o}/**
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
 */class Lh{constructor(e){this.node_=e}getImmediateChild(e){const t=this.node_.getImmediateChild(e);return new Lh(t)}node(){return this.node_}}class Oh{constructor(e,t){this.syncTree_=e,this.path_=t}getImmediateChild(e){const t=be(this.path_,e);return new Oh(this.syncTree_,t)}node(){return Nh(this.syncTree_,this.path_)}}const gR=function(n){return n=n||{},n.timestamp=n.timestamp||new Date().getTime(),n},Of=function(n,e,t){if(!n||typeof n!="object")return n;if(M(".sv"in n,"Unexpected leaf node or priority contents"),typeof n[".sv"]=="string")return _R(n[".sv"],e,t);if(typeof n[".sv"]=="object")return yR(n[".sv"],e);M(!1,"Unexpected server value: "+JSON.stringify(n,null,2))},_R=function(n,e,t){switch(n){case"timestamp":return t.timestamp;default:M(!1,"Unexpected server value: "+n)}},yR=function(n,e,t){n.hasOwnProperty("increment")||M(!1,"Unexpected server value: "+JSON.stringify(n,null,2));const s=n.increment;typeof s!="number"&&M(!1,"Unexpected increment value: "+s);const i=e.node();if(M(i!==null&&typeof i<"u","Expected ChildrenNode.EMPTY_NODE for nulls"),!i.isLeafNode())return s;const o=i.getValue();return typeof o!="number"?s:o+s},d_=function(n,e,t,s){return Vh(e,new Oh(t,n),s)},f_=function(n,e,t){return Vh(n,new Lh(e),t)};function Vh(n,e,t){const s=n.getPriority().val(),i=Of(s,e.getImmediateChild(".priority"),t);let r;if(n.isLeafNode()){const o=n,l=Of(o.getValue(),e,t);return l!==o.getValue()||i!==o.getPriority().val()?new Fe(l,Se(i)):n}else{const o=n;return r=o,i!==o.getPriority().val()&&(r=r.updatePriority(new Fe(i))),o.forEachChild(Te,(l,c)=>{const h=Vh(c,e.getImmediateChild(l),t);h!==c&&(r=r.updateImmediateChild(l,h))}),r}}/**
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
 */class Fh{constructor(e="",t=null,s={children:{},childCount:0}){this.name=e,this.parent=t,this.node=s}}function Bh(n,e){let t=e instanceof fe?e:new fe(e),s=n,i=X(t);for(;i!==null;){const r=Os(s.node.children,i)||{children:{},childCount:0};s=new Fh(i,s,r),t=_e(t),i=X(t)}return s}function li(n){return n.node.value}function m_(n,e){n.node.value=e,uc(n)}function p_(n){return n.node.childCount>0}function vR(n){return li(n)===void 0&&!p_(n)}function Va(n,e){We(n.node.children,(t,s)=>{e(new Fh(t,n,s))})}function g_(n,e,t,s){t&&e(n),Va(n,i=>{g_(i,e,!0)})}function ER(n,e,t){let s=n.parent;for(;s!==null;){if(e(s))return!0;s=s.parent}return!1}function xr(n){return new fe(n.parent===null?n.name:xr(n.parent)+"/"+n.name)}function uc(n){n.parent!==null&&wR(n.parent,n.name,n)}function wR(n,e,t){const s=vR(t),i=$t(n.node.children,e);s&&i?(delete n.node.children[e],n.node.childCount--,uc(n)):!s&&!i&&(n.node.children[e]=t.node,n.node.childCount++,uc(n))}/**
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
 */const TR=/[\[\].#$\/\u0000-\u001F\u007F]/,IR=/[\[\].#$\u0000-\u001F\u007F]/,Al=10*1024*1024,Uh=function(n){return typeof n=="string"&&n.length!==0&&!TR.test(n)},__=function(n){return typeof n=="string"&&n.length!==0&&!IR.test(n)},bR=function(n){return n&&(n=n.replace(/^\/*\.info(\/|$)/,"/")),__(n)},ia=function(n){return n===null||typeof n=="string"||typeof n=="number"&&!Na(n)||n&&typeof n=="object"&&$t(n,".sv")},mr=function(n,e,t,s){s&&e===void 0||Fa(Vs(n,"value"),e,t)},Fa=function(n,e,t){const s=t instanceof fe?new $b(t,n):t;if(e===void 0)throw new Error(n+"contains undefined "+Kn(s));if(typeof e=="function")throw new Error(n+"contains a function "+Kn(s)+" with contents = "+e.toString());if(Na(e))throw new Error(n+"contains "+e.toString()+" "+Kn(s));if(typeof e=="string"&&e.length>Al/3&&ua(e)>Al)throw new Error(n+"contains a string greater than "+Al+" utf8 bytes "+Kn(s)+" ('"+e.substring(0,50)+"...')");if(e&&typeof e=="object"){let i=!1,r=!1;if(We(e,(o,l)=>{if(o===".value")i=!0;else if(o!==".priority"&&o!==".sv"&&(r=!0,!Uh(o)))throw new Error(n+" contains an invalid key ("+o+") "+Kn(s)+`.  Keys must be non-empty strings and can't contain ".", "#", "$", "/", "[", or "]"`);Wb(s,o),Fa(n,l,s),qb(s)}),i&&r)throw new Error(n+' contains ".value" child '+Kn(s)+" in addition to actual children.")}},CR=function(n,e){let t,s;for(t=0;t<e.length;t++){s=e[t];const r=lr(s);for(let o=0;o<r.length;o++)if(!(r[o]===".priority"&&o===r.length-1)){if(!Uh(r[o]))throw new Error(n+"contains an invalid key ("+r[o]+") in path "+s.toString()+`. Keys must be non-empty strings and can't contain ".", "#", "$", "/", "[", or "]"`)}}e.sort(jb);let i=null;for(t=0;t<e.length;t++){if(s=e[t],i!==null&&bt(i,s))throw new Error(n+"contains a path "+i.toString()+" that is ancestor of another path "+s.toString());i=s}},y_=function(n,e,t,s){const i=Vs(n,"values");if(!(e&&typeof e=="object")||Array.isArray(e))throw new Error(i+" must be an object containing the children to replace.");const r=[];We(e,(o,l)=>{const c=new fe(o);if(Fa(i,l,be(t,c)),_h(c)===".priority"&&!ia(l))throw new Error(i+"contains an invalid value for '"+c.toString()+"', which must be a valid Firebase priority (a string, finite number, server value, or null).");r.push(c)}),CR(i,r)},RR=function(n,e,t){if(Na(e))throw new Error(Vs(n,"priority")+"is "+e.toString()+", but must be a valid Firebase priority (a string, finite number, server value, or null).");if(!ia(e))throw new Error(Vs(n,"priority")+"must be a valid Firebase priority (a string, finite number, server value, or null).")},jh=function(n,e,t,s){if(!__(t))throw new Error(Vs(n,e)+'was an invalid path = "'+t+`". Paths must be non-empty strings and can't contain ".", "#", "$", "[", or "]"`)},SR=function(n,e,t,s){t&&(t=t.replace(/^\/*\.info(\/|$)/,"/")),jh(n,e,t)},Zn=function(n,e){if(X(e)===".info")throw new Error(n+" failed = Can't modify data under /.info/")},AR=function(n,e){const t=e.path.toString();if(typeof e.repoInfo.host!="string"||e.repoInfo.host.length===0||!Uh(e.repoInfo.namespace)&&e.repoInfo.host.split(":")[0]!=="localhost"||t.length!==0&&!bR(t))throw new Error(Vs(n,"url")+`must be a valid firebase URL and the path can't contain ".", "#", "$", "[", or "]".`)};/**
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
 */class kR{constructor(){this.eventLists_=[],this.recursionDepth_=0}}function Ba(n,e){let t=null;for(let s=0;s<e.length;s++){const i=e[s],r=i.getPath();t!==null&&!yh(r,t.path)&&(n.eventLists_.push(t),t=null),t===null&&(t={events:[],path:r}),t.events.push(i)}t&&n.eventLists_.push(t)}function v_(n,e,t){Ba(n,t),E_(n,s=>yh(s,e))}function Ct(n,e,t){Ba(n,t),E_(n,s=>bt(s,e)||bt(e,s))}function E_(n,e){n.recursionDepth_++;let t=!0;for(let s=0;s<n.eventLists_.length;s++){const i=n.eventLists_[s];if(i){const r=i.path;e(r)?(PR(n.eventLists_[s]),n.eventLists_[s]=null):t=!1}}t&&(n.eventLists_=[]),n.recursionDepth_--}function PR(n){for(let e=0;e<n.events.length;e++){const t=n.events[e];if(t!==null){n.events[e]=null;const s=t.getEventRunner();qi&&$e("event: "+t.toString()),ri(s)}}}/**
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
 */const NR="repo_interrupt",DR=25;class xR{constructor(e,t,s,i){this.repoInfo_=e,this.forceRestClient_=t,this.authTokenProvider_=s,this.appCheckProvider_=i,this.dataUpdateCount=0,this.statsListener_=null,this.eventQueue_=new kR,this.nextWriteId_=1,this.interceptServerDataCallback_=null,this.onDisconnect_=Qo(),this.transactionQueueTree_=new Fh,this.persistentConnection_=null,this.key=this.repoInfo_.toURLString()}toString(){return(this.repoInfo_.secure?"https://":"http://")+this.repoInfo_.host}}function MR(n,e,t){if(n.stats_=ph(n.repoInfo_),n.forceRestClient_||db())n.server_=new Ko(n.repoInfo_,(s,i,r,o)=>{Vf(n,s,i,r,o)},n.authTokenProvider_,n.appCheckProvider_),setTimeout(()=>Ff(n,!0),0);else{if(typeof t<"u"&&t!==null){if(typeof t!="object")throw new Error("Only objects are supported for option databaseAuthVariableOverride");try{Oe(t)}catch(s){throw new Error("Invalid authOverride provided: "+s)}}n.persistentConnection_=new nn(n.repoInfo_,e,(s,i,r,o)=>{Vf(n,s,i,r,o)},s=>{Ff(n,s)},s=>{LR(n,s)},n.authTokenProvider_,n.appCheckProvider_,t),n.server_=n.persistentConnection_}n.authTokenProvider_.addTokenChangeListener(s=>{n.server_.refreshAuthToken(s)}),n.appCheckProvider_.addTokenChangeListener(s=>{n.server_.refreshAppCheckToken(s.token)}),n.statsReporter_=_b(n.repoInfo_,()=>new gC(n.stats_,n.server_)),n.infoData_=new uC,n.infoSyncTree_=new Lf({startListening:(s,i,r,o)=>{let l=[];const c=n.infoData_.getNode(s._path);return c.isEmpty()||(l=Dr(n.infoSyncTree_,s._path,c),setTimeout(()=>{o("ok")},0)),l},stopListening:()=>{}}),$h(n,"connected",!1),n.serverSyncTree_=new Lf({startListening:(s,i,r,o)=>(n.server_.listen(s,r,i,(l,c)=>{const h=o(l,c);Ct(n.eventQueue_,s._path,h)}),[]),stopListening:(s,i)=>{n.server_.unlisten(s,i)}})}function w_(n){const t=n.infoData_.getNode(new fe(".info/serverTimeOffset")).val()||0;return new Date().getTime()+t}function Ua(n){return gR({timestamp:w_(n)})}function Vf(n,e,t,s,i){n.dataUpdateCount++;const r=new fe(e);t=n.interceptServerDataCallback_?n.interceptServerDataCallback_(e,t):t;let o=[];if(i)if(s){const c=Co(t,h=>Se(h));o=hR(n.serverSyncTree_,r,c,i)}else{const c=Se(t);o=l_(n.serverSyncTree_,r,c,i)}else if(s){const c=Co(t,h=>Se(h));o=aR(n.serverSyncTree_,r,c)}else{const c=Se(t);o=Dr(n.serverSyncTree_,r,c)}let l=r;o.length>0&&(l=Ks(n,r)),Ct(n.eventQueue_,l,o)}function Ff(n,e){$h(n,"connected",e),e===!1&&BR(n)}function LR(n,e){We(e,(t,s)=>{$h(n,t,s)})}function $h(n,e,t){const s=new fe("/.info/"+e),i=Se(t);n.infoData_.updateSnapshot(s,i);const r=Dr(n.infoSyncTree_,s,i);Ct(n.eventQueue_,s,r)}function Wh(n){return n.nextWriteId_++}function OR(n,e,t){const s=uR(n.serverSyncTree_,e);return s!=null?Promise.resolve(s):n.server_.get(e).then(i=>{const r=Se(i).withIndex(e._queryParams.getIndex());hc(n.serverSyncTree_,e,t,!0);let o;if(e._queryParams.loadsAllData())o=Dr(n.serverSyncTree_,e._path,r);else{const l=fr(n.serverSyncTree_,e);o=l_(n.serverSyncTree_,e._path,r,l)}return Ct(n.eventQueue_,e._path,o),sa(n.serverSyncTree_,e,t,null,!0),r},i=>(Mr(n,"get for query "+Oe(e)+" failed: "+i),Promise.reject(new Error(i))))}function VR(n,e,t,s,i){Mr(n,"set",{path:e.toString(),value:t,priority:s});const r=Ua(n),o=Se(t,s),l=Nh(n.serverSyncTree_,e),c=f_(o,l,r),h=Wh(n),d=a_(n.serverSyncTree_,e,c,h,!0);Ba(n.eventQueue_,d),n.server_.put(e.toString(),o.val(!0),(p,E)=>{const b=p==="ok";b||ft("set at "+e+" failed: "+p);const S=Tn(n.serverSyncTree_,h,!b);Ct(n.eventQueue_,e,S),Fn(n,i,p,E)});const m=zh(n,e);Ks(n,m),Ct(n.eventQueue_,m,[])}function FR(n,e,t,s){Mr(n,"update",{path:e.toString(),value:t});let i=!0;const r=Ua(n),o={};if(We(t,(l,c)=>{i=!1,o[l]=d_(be(e,l),Se(c),n.serverSyncTree_,r)}),i)$e("update() called with empty data.  Don't do anything."),Fn(n,s,"ok",void 0);else{const l=Wh(n),c=oR(n.serverSyncTree_,e,o,l);Ba(n.eventQueue_,c),n.server_.merge(e.toString(),t,(h,d)=>{const m=h==="ok";m||ft("update at "+e+" failed: "+h);const p=Tn(n.serverSyncTree_,l,!m),E=p.length>0?Ks(n,e):e;Ct(n.eventQueue_,E,p),Fn(n,s,h,d)}),We(t,h=>{const d=zh(n,be(e,h));Ks(n,d)}),Ct(n.eventQueue_,e,[])}}function BR(n){Mr(n,"onDisconnectEvents");const e=Ua(n),t=Qo();ic(n.onDisconnect_,he(),(i,r)=>{const o=d_(i,r,n.serverSyncTree_,e);oi(t,i,o)});let s=[];ic(t,he(),(i,r)=>{s=s.concat(Dr(n.serverSyncTree_,i,r));const o=zh(n,i);Ks(n,o)}),n.onDisconnect_=Qo(),Ct(n.eventQueue_,he(),s)}function UR(n,e,t){n.server_.onDisconnectCancel(e.toString(),(s,i)=>{s==="ok"&&sc(n.onDisconnect_,e),Fn(n,t,s,i)})}function Bf(n,e,t,s){const i=Se(t);n.server_.onDisconnectPut(e.toString(),i.val(!0),(r,o)=>{r==="ok"&&oi(n.onDisconnect_,e,i),Fn(n,s,r,o)})}function jR(n,e,t,s,i){const r=Se(t,s);n.server_.onDisconnectPut(e.toString(),r.val(!0),(o,l)=>{o==="ok"&&oi(n.onDisconnect_,e,r),Fn(n,i,o,l)})}function $R(n,e,t,s){if(bo(t)){$e("onDisconnect().update() called with empty data.  Don't do anything."),Fn(n,s,"ok",void 0);return}n.server_.onDisconnectMerge(e.toString(),t,(i,r)=>{i==="ok"&&We(t,(o,l)=>{const c=Se(l);oi(n.onDisconnect_,be(e,o),c)}),Fn(n,s,i,r)})}function WR(n,e,t){let s;X(e._path)===".info"?s=hc(n.infoSyncTree_,e,t):s=hc(n.serverSyncTree_,e,t),v_(n.eventQueue_,e._path,s)}function T_(n,e,t){let s;X(e._path)===".info"?s=sa(n.infoSyncTree_,e,t):s=sa(n.serverSyncTree_,e,t),v_(n.eventQueue_,e._path,s)}function qR(n){n.persistentConnection_&&n.persistentConnection_.interrupt(NR)}function Mr(n,...e){let t="";n.persistentConnection_&&(t=n.persistentConnection_.id+":"),$e(t,...e)}function Fn(n,e,t,s){e&&ri(()=>{if(t==="ok")e(null);else{const i=(t||"error").toUpperCase();let r=i;s&&(r+=": "+s);const o=new Error(r);o.code=i,e(o)}})}function I_(n,e,t){return Nh(n.serverSyncTree_,e,t)||H.EMPTY_NODE}function qh(n,e=n.transactionQueueTree_){if(e||ja(n,e),li(e)){const t=C_(n,e);M(t.length>0,"Sending zero length transaction queue"),t.every(i=>i.status===0)&&zR(n,xr(e),t)}else p_(e)&&Va(e,t=>{qh(n,t)})}function zR(n,e,t){const s=t.map(h=>h.currentWriteId),i=I_(n,e,s);let r=i;const o=i.hash();for(let h=0;h<t.length;h++){const d=t[h];M(d.status===0,"tryToSendTransactionQueue_: items in queue should all be run."),d.status=1,d.retryCount++;const m=dt(e,d.path);r=r.updateChild(m,d.currentOutputSnapshotRaw)}const l=r.val(!0),c=e;n.server_.put(c.toString(),l,h=>{Mr(n,"transaction put response",{path:c.toString(),status:h});let d=[];if(h==="ok"){const m=[];for(let p=0;p<t.length;p++)t[p].status=2,d=d.concat(Tn(n.serverSyncTree_,t[p].currentWriteId)),t[p].onComplete&&m.push(()=>t[p].onComplete(null,!0,t[p].currentOutputSnapshotResolved)),t[p].unwatcher();ja(n,Bh(n.transactionQueueTree_,e)),qh(n,n.transactionQueueTree_),Ct(n.eventQueue_,e,d);for(let p=0;p<m.length;p++)ri(m[p])}else{if(h==="datastale")for(let m=0;m<t.length;m++)t[m].status===3?t[m].status=4:t[m].status=0;else{ft("transaction at "+c.toString()+" failed: "+h);for(let m=0;m<t.length;m++)t[m].status=4,t[m].abortReason=h}Ks(n,e)}},o)}function Ks(n,e){const t=b_(n,e),s=xr(t),i=C_(n,t);return HR(n,i,s),s}function HR(n,e,t){if(e.length===0)return;const s=[];let i=[];const o=e.filter(l=>l.status===0).map(l=>l.currentWriteId);for(let l=0;l<e.length;l++){const c=e[l],h=dt(t,c.path);let d=!1,m;if(M(h!==null,"rerunTransactionsUnderNode_: relativePath should not be null."),c.status===4)d=!0,m=c.abortReason,i=i.concat(Tn(n.serverSyncTree_,c.currentWriteId,!0));else if(c.status===0)if(c.retryCount>=DR)d=!0,m="maxretry",i=i.concat(Tn(n.serverSyncTree_,c.currentWriteId,!0));else{const p=I_(n,c.path,o);c.currentInputSnapshot=p;const E=e[l].update(p.val());if(E!==void 0){Fa("transaction failed: Data returned ",E,c.path);let b=Se(E);typeof E=="object"&&E!=null&&$t(E,".priority")||(b=b.updatePriority(p.getPriority()));const P=c.currentWriteId,F=Ua(n),U=f_(b,p,F);c.currentOutputSnapshotRaw=b,c.currentOutputSnapshotResolved=U,c.currentWriteId=Wh(n),o.splice(o.indexOf(P),1),i=i.concat(a_(n.serverSyncTree_,c.path,U,c.currentWriteId,c.applyLocally)),i=i.concat(Tn(n.serverSyncTree_,P,!0))}else d=!0,m="nodata",i=i.concat(Tn(n.serverSyncTree_,c.currentWriteId,!0))}Ct(n.eventQueue_,t,i),i=[],d&&(e[l].status=2,function(p){setTimeout(p,Math.floor(0))}(e[l].unwatcher),e[l].onComplete&&(m==="nodata"?s.push(()=>e[l].onComplete(null,!1,e[l].currentInputSnapshot)):s.push(()=>e[l].onComplete(new Error(m),!1,null))))}ja(n,n.transactionQueueTree_);for(let l=0;l<s.length;l++)ri(s[l]);qh(n,n.transactionQueueTree_)}function b_(n,e){let t,s=n.transactionQueueTree_;for(t=X(e);t!==null&&li(s)===void 0;)s=Bh(s,t),e=_e(e),t=X(e);return s}function C_(n,e){const t=[];return R_(n,e,t),t.sort((s,i)=>s.order-i.order),t}function R_(n,e,t){const s=li(e);if(s)for(let i=0;i<s.length;i++)t.push(s[i]);Va(e,i=>{R_(n,i,t)})}function ja(n,e){const t=li(e);if(t){let s=0;for(let i=0;i<t.length;i++)t[i].status!==2&&(t[s]=t[i],s++);t.length=s,m_(e,t.length>0?t:void 0)}Va(e,s=>{ja(n,s)})}function zh(n,e){const t=xr(b_(n,e)),s=Bh(n.transactionQueueTree_,e);return ER(s,i=>{kl(n,i)}),kl(n,s),g_(s,i=>{kl(n,i)}),t}function kl(n,e){const t=li(e);if(t){const s=[];let i=[],r=-1;for(let o=0;o<t.length;o++)t[o].status===3||(t[o].status===1?(M(r===o-1,"All SENT items should be at beginning of queue."),r=o,t[o].status=3,t[o].abortReason="set"):(M(t[o].status===0,"Unexpected transaction status in abort"),t[o].unwatcher(),i=i.concat(Tn(n.serverSyncTree_,t[o].currentWriteId,!0)),t[o].onComplete&&s.push(t[o].onComplete.bind(null,new Error("set"),!1,null))));r===-1?m_(e,void 0):t.length=r+1,Ct(n.eventQueue_,xr(e),i);for(let o=0;o<s.length;o++)ri(s[o])}}/**
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
 */function GR(n){let e="";const t=n.split("/");for(let s=0;s<t.length;s++)if(t[s].length>0){let i=t[s];try{i=decodeURIComponent(i.replace(/\+/g," "))}catch{}e+="/"+i}return e}function KR(n){const e={};n.charAt(0)==="?"&&(n=n.substring(1));for(const t of n.split("&")){if(t.length===0)continue;const s=t.split("=");s.length===2?e[decodeURIComponent(s[0])]=decodeURIComponent(s[1]):ft(`Invalid query segment '${t}' in query '${n}'`)}return e}const Uf=function(n,e){const t=QR(n),s=t.namespace;t.domain==="firebase.com"&&ln(t.host+" is no longer supported. Please use <YOUR FIREBASE>.firebaseio.com instead"),(!s||s==="undefined")&&t.domain!=="localhost"&&ln("Cannot parse Firebase url. Please use https://<YOUR FIREBASE>.firebaseio.com"),t.secure||sb();const i=t.scheme==="ws"||t.scheme==="wss";return{repoInfo:new kg(t.host,t.secure,s,i,e,"",s!==t.subdomain),path:new fe(t.pathString)}},QR=function(n){let e="",t="",s="",i="",r="",o=!0,l="https",c=443;if(typeof n=="string"){let h=n.indexOf("//");h>=0&&(l=n.substring(0,h-1),n=n.substring(h+2));let d=n.indexOf("/");d===-1&&(d=n.length);let m=n.indexOf("?");m===-1&&(m=n.length),e=n.substring(0,Math.min(d,m)),d<m&&(i=GR(n.substring(d,m)));const p=KR(n.substring(Math.min(n.length,m)));h=e.indexOf(":"),h>=0?(o=l==="https"||l==="wss",c=parseInt(e.substring(h+1),10)):h=e.length;const E=e.slice(0,h);if(E.toLowerCase()==="localhost")t="localhost";else if(E.split(".").length<=2)t=E;else{const b=e.indexOf(".");s=e.substring(0,b).toLowerCase(),t=e.substring(b+1),r=s}"ns"in p&&(r=p.ns)}return{host:e,port:c,domain:t,subdomain:s,secure:o,scheme:l,pathString:i,namespace:r}};/**
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
 */const jf="-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz",YR=function(){let n=0;const e=[];return function(t){const s=t===n;n=t;let i;const r=new Array(8);for(i=7;i>=0;i--)r[i]=jf.charAt(t%64),t=Math.floor(t/64);M(t===0,"Cannot push at time == 0");let o=r.join("");if(s){for(i=11;i>=0&&e[i]===63;i--)e[i]=0;e[i]++}else for(i=0;i<12;i++)e[i]=Math.floor(Math.random()*64);for(i=0;i<12;i++)o+=jf.charAt(e[i]);return M(o.length===20,"nextPushId: Length should be 20."),o}}();/**
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
 */class S_{constructor(e,t,s,i){this.eventType=e,this.eventRegistration=t,this.snapshot=s,this.prevName=i}getPath(){const e=this.snapshot.ref;return this.eventType==="value"?e._path:e.parent._path}getEventType(){return this.eventType}getEventRunner(){return this.eventRegistration.getEventRunner(this)}toString(){return this.getPath().toString()+":"+this.eventType+":"+Oe(this.snapshot.exportVal())}}class A_{constructor(e,t,s){this.eventRegistration=e,this.error=t,this.path=s}getPath(){return this.path}getEventType(){return"cancel"}getEventRunner(){return this.eventRegistration.getEventRunner(this)}toString(){return this.path.toString()+":cancel"}}/**
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
 */class k_{constructor(e,t){this.snapshotCallback=e,this.cancelCallback=t}onValue(e,t){this.snapshotCallback.call(null,e,t)}onCancel(e){return M(this.hasCancelCallback,"Raising a cancel event on a listener with no cancel callback"),this.cancelCallback.call(null,e)}get hasCancelCallback(){return!!this.cancelCallback}matches(e){return this.snapshotCallback===e.snapshotCallback||this.snapshotCallback.userCallback!==void 0&&this.snapshotCallback.userCallback===e.snapshotCallback.userCallback&&this.snapshotCallback.context===e.snapshotCallback.context}}/**
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
 */class XR{constructor(e,t){this._repo=e,this._path=t}cancel(){const e=new Mt;return UR(this._repo,this._path,e.wrapCallback(()=>{})),e.promise}remove(){Zn("OnDisconnect.remove",this._path);const e=new Mt;return Bf(this._repo,this._path,null,e.wrapCallback(()=>{})),e.promise}set(e){Zn("OnDisconnect.set",this._path),mr("OnDisconnect.set",e,this._path,!1);const t=new Mt;return Bf(this._repo,this._path,e,t.wrapCallback(()=>{})),t.promise}setWithPriority(e,t){Zn("OnDisconnect.setWithPriority",this._path),mr("OnDisconnect.setWithPriority",e,this._path,!1),RR("OnDisconnect.setWithPriority",t);const s=new Mt;return jR(this._repo,this._path,e,t,s.wrapCallback(()=>{})),s.promise}update(e){Zn("OnDisconnect.update",this._path),y_("OnDisconnect.update",e,this._path);const t=new Mt;return $R(this._repo,this._path,e,t.wrapCallback(()=>{})),t.promise}}/**
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
 */class Lr{constructor(e,t,s,i){this._repo=e,this._path=t,this._queryParams=s,this._orderByCalled=i}get key(){return J(this._path)?null:_h(this._path)}get ref(){return new Wt(this._repo,this._path)}get _queryIdentifier(){const e=Cf(this._queryParams),t=fh(e);return t==="{}"?"default":t}get _queryObject(){return Cf(this._queryParams)}isEqual(e){if(e=me(e),!(e instanceof Lr))return!1;const t=this._repo===e._repo,s=yh(this._path,e._path),i=this._queryIdentifier===e._queryIdentifier;return t&&s&&i}toJSON(){return this.toString()}toString(){return this._repo.toString()+Ub(this._path)}}function JR(n,e){if(n._orderByCalled===!0)throw new Error(e+": You can't combine multiple orderBy calls.")}function P_(n){let e=null,t=null;if(n.hasStart()&&(e=n.getIndexStartValue()),n.hasEnd()&&(t=n.getIndexEndValue()),n.getIndex()===ns){const s="Query: When ordering by key, you may only pass one argument to startAt(), endAt(), or equalTo().",i="Query: When ordering by key, the argument passed to startAt(), startAfter(), endAt(), endBefore(), or equalTo() must be a string.";if(n.hasStart()){if(n.getIndexStartName()!==cs)throw new Error(s);if(typeof e!="string")throw new Error(i)}if(n.hasEnd()){if(n.getIndexEndName()!==Mn)throw new Error(s);if(typeof t!="string")throw new Error(i)}}else if(n.getIndex()===Te){if(e!=null&&!ia(e)||t!=null&&!ia(t))throw new Error("Query: When ordering by priority, the first argument passed to startAt(), startAfter() endAt(), endBefore(), or equalTo() must be a valid priority value (null, a number, or a string).")}else if(M(n.getIndex()instanceof wh||n.getIndex()===zg,"unknown index type."),e!=null&&typeof e=="object"||t!=null&&typeof t=="object")throw new Error("Query: First argument passed to startAt(), startAfter(), endAt(), endBefore(), or equalTo() cannot be an object.")}function ZR(n){if(n.hasStart()&&n.hasEnd()&&n.hasLimit()&&!n.hasAnchoredLimit())throw new Error("Query: Can't combine startAt(), startAfter(), endAt(), endBefore(), and limit(). Use limitToFirst() or limitToLast() instead.")}class Wt extends Lr{constructor(e,t){super(e,t,new Ih,!1)}get parent(){const e=Fg(this._path);return e===null?null:new Wt(this._repo,e)}get root(){let e=this;for(;e.parent!==null;)e=e.parent;return e}}class Qs{constructor(e,t,s){this._node=e,this.ref=t,this._index=s}get priority(){return this._node.getPriority().val()}get key(){return this.ref.key}get size(){return this._node.numChildren()}child(e){const t=new fe(e),s=Ys(this.ref,e);return new Qs(this._node.getChild(t),s,Te)}exists(){return!this._node.isEmpty()}exportVal(){return this._node.val(!0)}forEach(e){return this._node.isLeafNode()?!1:!!this._node.forEachChild(this._index,(s,i)=>e(new Qs(i,Ys(this.ref,s),Te)))}hasChild(e){const t=new fe(e);return!this._node.getChild(t).isEmpty()}hasChildren(){return this._node.isLeafNode()?!1:!this._node.isEmpty()}toJSON(){return this.exportVal()}val(){return this._node.val()}}function Ze(n,e){return n=me(n),n._checkNotDeleted("ref"),e!==void 0?Ys(n._root,e):n._root}function Ys(n,e){return n=me(n),X(n._path)===null?SR("child","path",e):jh("child","path",e),new Wt(n._repo,be(n._path,e))}function eS(n){return n=me(n),new XR(n._repo,n._path)}function tS(n,e){n=me(n),Zn("push",n._path),mr("push",e,n._path,!0);const t=w_(n._repo),s=YR(t),i=Ys(n,s),r=Ys(n,s);let o;return e!=null?o=ra(r,e).then(()=>r):o=Promise.resolve(r),i.then=o.then.bind(o),i.catch=o.then.bind(o,void 0),i}function nS(n){return Zn("remove",n._path),ra(n,null)}function ra(n,e){n=me(n),Zn("set",n._path),mr("set",e,n._path,!1);const t=new Mt;return VR(n._repo,n._path,e,null,t.wrapCallback(()=>{})),t.promise}function Qn(n,e){y_("update",e,n._path);const t=new Mt;return FR(n._repo,n._path,e,t.wrapCallback(()=>{})),t.promise}function dc(n){n=me(n);const e=new k_(()=>{}),t=new $a(e);return OR(n._repo,n,t).then(s=>new Qs(s,new Wt(n._repo,n._path),n._queryParams.getIndex()))}class $a{constructor(e){this.callbackContext=e}respondsTo(e){return e==="value"}createEvent(e,t){const s=t._queryParams.getIndex();return new S_("value",this,new Qs(e.snapshotNode,new Wt(t._repo,t._path),s))}getEventRunner(e){return e.getEventType()==="cancel"?()=>this.callbackContext.onCancel(e.error):()=>this.callbackContext.onValue(e.snapshot,null)}createCancelEvent(e,t){return this.callbackContext.hasCancelCallback?new A_(this,e,t):null}matches(e){return e instanceof $a?!e.callbackContext||!this.callbackContext?!0:e.callbackContext.matches(this.callbackContext):!1}hasAnyCallback(){return this.callbackContext!==null}}class Hh{constructor(e,t){this.eventType=e,this.callbackContext=t}respondsTo(e){let t=e==="children_added"?"child_added":e;return t=t==="children_removed"?"child_removed":t,this.eventType===t}createCancelEvent(e,t){return this.callbackContext.hasCancelCallback?new A_(this,e,t):null}createEvent(e,t){M(e.childName!=null,"Child events should have a childName.");const s=Ys(new Wt(t._repo,t._path),e.childName),i=t._queryParams.getIndex();return new S_(e.type,this,new Qs(e.snapshotNode,s,i),e.prevName)}getEventRunner(e){return e.getEventType()==="cancel"?()=>this.callbackContext.onCancel(e.error):()=>this.callbackContext.onValue(e.snapshot,e.prevName)}matches(e){return e instanceof Hh?this.eventType===e.eventType&&(!this.callbackContext||!e.callbackContext||this.callbackContext.matches(e.callbackContext)):!1}hasAnyCallback(){return!!this.callbackContext}}function N_(n,e,t,s,i){const r=new k_(t,void 0),o=e==="value"?new $a(r):new Hh(e,r);return WR(n._repo,n,o),()=>T_(n._repo,n,o)}function Pl(n,e,t,s){return N_(n,"value",e)}function sS(n,e,t,s){return N_(n,"child_added",e)}function iS(n,e,t){T_(n._repo,n,null)}class D_{}class rS extends D_{constructor(e,t){super(),this._value=e,this._key=t,this.type="endAt"}_apply(e){mr("endAt",this._value,e._path,!0);const t=cC(e._queryParams,this._value,this._key);if(ZR(t),P_(t),e._queryParams.hasEnd())throw new Error("endAt: Starting point was already set (by another call to endAt, endBefore or equalTo).");return new Lr(e._repo,e._path,t,e._orderByCalled)}}function oS(n,e){return new rS(n,e)}class aS extends D_{constructor(e){super(),this._path=e,this.type="orderByChild"}_apply(e){JR(e,"orderByChild");const t=new fe(this._path);if(J(t))throw new Error("orderByChild: cannot pass in empty path. Use orderByValue() instead.");const s=new wh(t),i=hC(e._queryParams,s);return P_(i),new Lr(e._repo,e._path,i,!0)}}function lS(n){return jh("orderByChild","path",n),new aS(n)}function cS(n,...e){let t=me(n);for(const s of e)t=s._apply(t);return t}JC(Wt);sR(Wt);/**
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
 */const hS="FIREBASE_DATABASE_EMULATOR_HOST",fc={};let uS=!1;function dS(n,e,t,s){n.repoInfo_=new kg(`${e}:${t}`,!1,n.repoInfo_.namespace,n.repoInfo_.webSocketOnly,n.repoInfo_.nodeAdmin,n.repoInfo_.persistenceKey,n.repoInfo_.includeNamespaceInQueryParams,!0),s&&(n.authTokenProvider_=s)}function fS(n,e,t,s,i){let r=s||n.options.databaseURL;r===void 0&&(n.options.projectId||ln("Can't determine Firebase Database URL. Be sure to include  a Project ID when calling firebase.initializeApp()."),$e("Using default host for project ",n.options.projectId),r=`${n.options.projectId}-default-rtdb.firebaseio.com`);let o=Uf(r,i),l=o.repoInfo,c;typeof process<"u"&&af&&(c=af[hS]),c?(r=`http://${c}?ns=${l.namespace}`,o=Uf(r,i),l=o.repoInfo):o.repoInfo.secure;const h=new mb(n.name,n.options,e);AR("Invalid Firebase Database URL",o),J(o.path)||ln("Database URL must point to the root of a Firebase Database (not including a child path).");const d=pS(l,n,h,new fb(n.name,t));return new gS(d,n)}function mS(n,e){const t=fc[e];(!t||t[n.key]!==n)&&ln(`Database ${e}(${n.repoInfo_}) has already been deleted.`),qR(n),delete t[n.key]}function pS(n,e,t,s){let i=fc[e.name];i||(i={},fc[e.name]=i);let r=i[n.toURLString()];return r&&ln("Database initialized multiple times. Please make sure the format of the database URL matches with each database() call."),r=new xR(n,uS,t,s),i[n.toURLString()]=r,r}class gS{constructor(e,t){this._repoInternal=e,this.app=t,this.type="database",this._instanceStarted=!1}get _repo(){return this._instanceStarted||(MR(this._repoInternal,this.app.options.appId,this.app.options.databaseAuthVariableOverride),this._instanceStarted=!0),this._repoInternal}get _root(){return this._rootInternal||(this._rootInternal=new Wt(this._repo,he())),this._rootInternal}_delete(){return this._rootInternal!==null&&(mS(this._repo,this.app.name),this._repoInternal=null,this._rootInternal=null),Promise.resolve()}_checkNotDeleted(e){this._rootInternal===null&&ln("Cannot call "+e+" on a deleted database.")}}function _S(n=_c(),e){const t=fa(n,"database").getImmediate({identifier:e});if(!t._instanceStarted){const s=em("database");s&&yS(t,...s)}return t}function yS(n,e,t,s={}){n=me(n),n._checkNotDeleted("useEmulator"),n._instanceStarted&&ln("Cannot call useEmulator() after instance has already been initialized.");const i=n._repoInternal;let r;if(i.repoInfo_.nodeAdmin)s.mockUserToken&&ln('mockUserToken is not supported by the Admin SDK. For client access with mock users, please use the "firebase" package instead of "firebase-admin".'),r=new Eo(Eo.OWNER);else if(s.mockUserToken){const o=typeof s.mockUserToken=="string"?s.mockUserToken:sm(s.mockUserToken,n.app.options.projectId);r=new Eo(o)}dS(i,e,t,r)}/**
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
 */function vS(n){X0(ds),ss(new Pn("database",(e,{instanceIdentifier:t})=>{const s=e.getProvider("app").getImmediate(),i=e.getProvider("auth-internal"),r=e.getProvider("app-check-internal");return fS(s,i,r,t)},"PUBLIC").setMultipleInstances(!0)),Lt(lf,cf,n),Lt(lf,cf,"esm2017")}/**
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
 */const ES={".sv":"timestamp"};function wS(){return ES}nn.prototype.simpleListen=function(n,e){this.sendRequest("q",{p:n},e)};nn.prototype.echo=function(n,e){this.sendRequest("echo",{d:n},e)};vS();const _n=n=>atob(n),TS={apiKey:_n("QUl6YVN5Q2FUUWE2Sm9NajJNQmdEZ2Rwb25WQllfTkFlUU84X3Vz"),authDomain:_n("a2lja2VyaGF4LW9ubGluZS5maXJlYmFzZWFwcC5jb20="),databaseURL:_n("aHR0cHM6Ly9raWNrZXJoYXgtb25saW5lLWRlZmF1bHQtcnRkYi5maXJlYmFzZWlvLmNvbQ=="),projectId:_n("a2lja2VyaGF4LW9ubGluZQ=="),storageBucket:_n("a2lja2VyaGF4LW9ubGluZS5maXJlYmFzdG9yYWdlLmFwcA=="),messagingSenderId:_n("MzM3NTk4NDY1MTcw"),appId:_n("MTozMzc1OTg0NjUxNzA6d2ViOjE5MDU0YWI4NDBkODBkMmMyMDUyNGI="),measurementId:_n("Ry0xWjhWN0NWRkcw")},Gh=lm(TS),wo=Gw(Gh),yt=M0(Gh),et=_S(Gh),mt={async loginWithGoogle(){const n=new Yt,e=await nw(wo,n),t=e.user,s=Kt(yt,"users",t.uid);if((await El(s)).exists())await of(s,{lastLogin:new Date().toISOString()});else{const r=Math.floor(Math.random()*9e3)+1e3,l=`${(t.displayName||"Jogador").replace(/\s+/g,"").replace(/[^a-zA-Z0-9]/g,"").toLowerCase()}${r}`.substring(0,12),c={uid:t.uid,username:l,displayName:l,badge:"👤",bio:"",level:1,xp:0,isNewUser:!0,dateCreated:new Date().toISOString(),lastLogin:new Date().toISOString(),settings:{volume:80,quality:"high",fieldSize:"medium"}},h={uid:t.uid,matchesPlayed:0,wins:0,losses:0,draws:0,goals:0,shots:0,dribbles:0,ownGoals:0,mvps:0};await Tl(Kt(yt,"users",t.uid),c),await Tl(Kt(yt,"stats",t.uid),h)}return e},async logout(){return await OE(wo)},subscribeToAuth(n){return Nm(wo,n)},async getUserProfile(n){const e=Kt(yt,"users",n),t=await El(e);return t.exists()?t.data():null},async updateUserProfile(n,e){const t=Kt(yt,"users",n);await of(t,e)},async getUserStats(n){const e=Kt(yt,"stats",n),t=await El(e);return t.exists()?t.data():null},async saveMatchResult(n,e,t,s,i,r,o,l,c,h){const d=Kt(yt,"stats",n),m=Kt(yt,"users",n);await Y0(yt,async p=>{const E=await p.get(d),b=await p.get(m);if(!E.exists()||!b.exists())throw new Error("Documento não encontrado");const S=E.data(),P=b.data(),F={matchesPlayed:(S.matchesPlayed||0)+1,wins:(S.wins||0)+(e?1:0),losses:(S.losses||0)+(t?1:0),draws:(S.draws||0)+(s?1:0),goals:(S.goals||0)+i,shots:(S.shots||0)+r,dribbles:(S.dribbles||0)+o,ownGoals:(S.ownGoals||0)+l,mvps:(S.mvps||0)+(c?1:0)};let U=(P.xp||0)+h,O=P.level||1,G=O*100;for(;U>=G;)U-=G,O++,G=O*100;p.update(d,F),p.update(m,{xp:U,level:O,lastLogin:new Date().toISOString()})})},async addMatchToHistory(n){const e=Kt(ao(yt,"history"));await Tl(e,n)},async getRecentHistory(n,e=5){const t=ao(yt,"history"),s=tf(t,nf("playerUids","array-contains",n),W0(20)),i=await wl(s),r=[];return i.forEach(o=>r.push({id:o.id,...o.data()})),r.sort((o,l)=>new Date(l.date)-new Date(o.date)),r.slice(0,e)},async getGlobalRanking(n="wins",e=10){try{const t=ao(yt,"users"),s=await wl(t),i=[];for(const r of s.docs){const o=r.data();if(!o.uid)continue;const l=await this.getUserStats(o.uid)||{};i.push({username:o.username,displayName:o.username,badge:o.badge||"🏳️",level:o.level||1,wins:l.wins||0,losses:l.losses||0,matchesPlayed:l.matchesPlayed||0,goals:l.goals||0,shots:l.shots||0,dribbles:l.dribbles||0,mvps:l.mvps||0,xp:o.xp||0})}return n==="level"?i.sort((r,o)=>o.level!==r.level?o.level-r.level:o.xp-r.xp):n==="wins"?i.sort((r,o)=>o.wins-r.wins):n==="goals"?i.sort((r,o)=>o.goals-r.goals):n==="shots"?i.sort((r,o)=>o.shots-r.shots):n==="dribbles"?i.sort((r,o)=>o.dribbles-r.dribbles):n==="matches"?i.sort((r,o)=>o.matchesPlayed-r.matchesPlayed):n==="mvps"?i.sort((r,o)=>o.mvps-r.mvps):n==="overall"&&i.sort((r,o)=>{const l=r.wins*8+r.goals*5+r.mvps*10+r.dribbles*2+r.shots+r.matchesPlayed*.5-r.losses*2;return o.wins*8+o.goals*5+o.mvps*10+o.dribbles*2+o.shots+o.matchesPlayed*.5-o.losses*2-l}),i.slice(0,e)}catch(t){throw console.error("[Firestore] Error fetching ranking:",t),t}},async isUsernameUnique(n,e){const t=tf(ao(yt,"users"),nf("username","==",n.toLowerCase())),s=await wl(t);let i=!0;return s.forEach(r=>{r.id!==e&&(i=!1)}),i},async pruneOldChatMessages(){try{const n=Ze(et,"globalChat"),e=Date.now()-72e5,t=cS(n,lS("timestamp"),oS(e)),s=await dc(t),i=await dc(n);if(s.exists()){const r={};s.forEach(o=>{r[o.key]=null}),await Qn(n,r)}if(i.exists()&&i.size>400){const r=[];i.forEach(l=>{r.push({key:l.key,timestamp:l.val().timestamp||0})}),r.sort((l,c)=>l.timestamp-c.timestamp);const o=r.slice(0,Math.max(0,r.length-300));if(o.length){const l={};o.forEach(c=>{l[c.key]=null}),await Qn(n,l)}}}catch(n){console.warn("Pruning skipped or unauthorized:",n)}},async sendGlobalChatMessage(n,e){this.pruneOldChatMessages().catch(s=>console.warn(s));const t=Ze(et,"globalChat");await tS(t,{uid:n.uid,username:n.username,badge:n.badge||"👤",text:e,timestamp:wS()})},subscribeToGlobalChat(n){const e=Ze(et,"globalChat");sS(e,t=>{n(t.val())})}};function de(n,e="info"){if(!document.getElementById("toast-style")){const r=document.createElement("style");r.id="toast-style",r.textContent=`
      .toast-container {
        position: fixed;
        bottom: 24px;
        right: 24px;
        display: flex;
        flex-direction: column;
        gap: 10px;
        z-index: 9999;
      }
      .toast {
        background: rgba(11, 18, 44, 0.9);
        backdrop-filter: blur(12px);
        border: 1px solid rgba(255, 255, 255, 0.08);
        padding: 14px 20px;
        border-radius: 10px;
        color: #fff;
        font-family: 'Inter', sans-serif;
        font-size: 14px;
        font-weight: 600;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
        transform: translateY(20px);
        opacity: 0;
        transition: transform 0.25s ease, opacity 0.25s ease;
        display: flex;
        align-items: center;
        gap: 10px;
      }
      .toast.show {
        transform: translateY(0);
        opacity: 1;
      }
      .toast-success { border-left: 4px solid #22c55e; }
      .toast-error { border-left: 4px solid #ef4444; }
      .toast-info { border-left: 4px solid #3b82f6; }
    `,document.head.appendChild(r)}let t=document.querySelector(".toast-container");t||(t=document.createElement("div"),t.className="toast-container",document.body.appendChild(t));const s=document.createElement("div");s.className=`toast toast-${e}`;let i="ℹ️";e==="success"&&(i="✅"),e==="error"&&(i="❌"),s.innerHTML=`<span>${i}</span> <span>${n}</span>`,t.appendChild(s),setTimeout(()=>s.classList.add("show"),50),setTimeout(()=>{s.classList.remove("show"),setTimeout(()=>s.remove(),250)},3500)}const IS={init(){const n=document.getElementById("btn-google-login");n&&n.addEventListener("click",async()=>{try{de("Iniciando login com Google...","info"),await mt.loginWithGoogle(),de("Login realizado com sucesso!","success")}catch(e){de(e.message||"Erro ao entrar com Google.","error")}})}};function bS(n){const e=(n??"").toString();if(!e)return[];try{const t=new Intl.Segmenter(void 0,{granularity:"grapheme"});return Array.from(t.segment(e),s=>s.segment)}catch{return Array.from(e)}}function CS(n){return new RegExp("\\p{Extended_Pictographic}","u").test(n||"")}const lt={currentUser:null,profileData:null,async init(n){if(this.currentUser=n,!n)return;const e=document.getElementById("menu-btn-play");e&&(e.onclick=()=>W.show("mode-select-screen"));const t=document.getElementById("menu-btn-profile");t&&(t.onclick=()=>W.show("profile-screen"));const s=document.getElementById("menu-quick-profile");s&&(s.onclick=()=>W.show("profile-screen"));const i=document.getElementById("menu-btn-ranking");i&&(i.onclick=()=>W.show("ranking-screen"));const r=document.getElementById("menu-btn-settings");r&&(r.onclick=()=>W.show("settings-screen"));const o=document.getElementById("menu-btn-controls");o&&(o.onclick=()=>W.show("controls-screen"));const l=document.getElementById("menu-btn-credits");l&&(l.onclick=()=>W.show("credits-screen"));const c=document.getElementById("menu-btn-logout");c&&(c.onclick=async()=>{try{await mt.logout(),de("Desconectado com sucesso.","info")}catch{de("Erro ao sair da conta.","error")}});const h=document.getElementById("credits-btn-back");h&&(h.onclick=()=>W.show("menu-screen")),W.register("menu-screen",{onEnter:()=>this.refreshQuickProfile()}),W.register("profile-screen",{onEnter:()=>this.loadProfileScreen()});const d=document.getElementById("profile-btn-back");d&&(d.onclick=()=>W.show("menu-screen"));const m=document.getElementById("profile-btn-save");m&&(m.onclick=async()=>{await this.saveProfileEdits()});const p=document.getElementById("profile-badge-select"),E=document.getElementById("profile-avatar-display");p&&E&&p.addEventListener("change",b=>{this.updateAvatarDisplay(E,b.target.value)}),await this.refreshQuickProfile()},async refreshQuickProfile(){if(this.currentUser)try{if(this.profileData=await mt.getUserProfile(this.currentUser.uid),!this.profileData)return;const n=document.getElementById("quick-profile-flag"),e=document.getElementById("quick-profile-name"),t=document.getElementById("quick-profile-level"),s=document.getElementById("quick-avatar-char"),i=document.querySelector(".quick-xp-fill");if(n&&(n.textContent=this.profileData.badge||"🇧🇷"),e&&(e.textContent=this.profileData.displayName||this.profileData.username),t&&(t.textContent=this.profileData.level||1),s&&(s.textContent=this.profileData.badge||"👤"),i){const r=this.profileData.level||1,o=this.profileData.xp||0,l=r*100,c=Math.min(100,Math.max(0,o/l*100));i.style.width=`${c}%`}}catch(n){console.error("Erro ao carregar perfil rápido:",n)}},async loadProfileScreen(){if(!this.currentUser||!this.profileData)return;this.profileData=await mt.getUserProfile(this.currentUser.uid);const n=document.getElementById("profile-username-input"),e=document.getElementById("profile-badge-select"),t=document.getElementById("profile-bio-input"),s=document.getElementById("profile-avatar-display");n&&(n.value=this.profileData.username||""),e&&(e.value=this.profileData.badge||"👤"),t&&(t.value=this.profileData.bio||""),s&&this.updateAvatarDisplay(s,this.profileData.badge);const i=await mt.getUserStats(this.currentUser.uid);if(i){const o=i.matchesPlayed>0?Math.round(i.wins/i.matchesPlayed*100):0;document.getElementById("stats-played").textContent=i.matchesPlayed||0,document.getElementById("stats-wins").textContent=i.wins||0,document.getElementById("stats-losses").textContent=i.losses||0,document.getElementById("stats-winrate").textContent=`${o}%`,document.getElementById("stats-goals").textContent=i.goals||0,document.getElementById("stats-shots").textContent=i.shots||0,document.getElementById("stats-dribbles").textContent=i.dribbles||0,document.getElementById("stats-own-goals").textContent=i.ownGoals||0,document.getElementById("stats-mvps").textContent=i.mvps||0,document.getElementById("stats-level").textContent=this.profileData.level||1,document.getElementById("stats-xp").textContent=this.profileData.xp||0}const r=document.getElementById("profile-match-history");if(r){r.innerHTML='<div class="subtext">Carregando histórico...</div>';try{const o=await mt.getRecentHistory(this.currentUser.uid);o.length===0?r.innerHTML='<div class="subtext">Nenhuma partida recente.</div>':(r.innerHTML="",o.forEach(l=>{const c=document.createElement("div");c.className="history-item";let h="draw",d="Empate";l.winner==="draw"?(h="draw",d="Empate"):l.winner===l.playerTeams[this.currentUser.uid]?(h="win",d="Vitória"):(h="loss",d="Derrota");const m=new Date(l.date).toLocaleDateString("pt-BR");c.innerHTML=`
              <span>📅 ${m} - ${l.mode==="solo"?"vs CPU":"Online"}</span>
              <span>${l.scoreRed} : ${l.scoreBlue}</span>
              <span class="history-result ${h}">${d}</span>
            `,r.appendChild(c)}))}catch{r.innerHTML='<div class="subtext text-danger">Erro ao carregar histórico.</div>'}}},async saveProfileEdits(){if(!this.currentUser)return;const n=document.getElementById("profile-username-input"),e=document.getElementById("profile-badge-select"),t=document.getElementById("profile-bio-input"),s=n?n.value.trim().toLowerCase():"",i=e?e.value:"👤",r=t?t.value.trim():"";if(s.length<3||s.length>12)return de("O nome de usuário precisa ter entre 3 e 12 caracteres.","error");if(!/^[a-zA-Z0-9_]+$/.test(s))return de("O nome de usuário só pode conter letras, números e sublinhado (_). Sem espaços!","error");try{if(de("Verificando disponibilidade do nome...","info"),!await mt.isUsernameUnique(s,this.currentUser.uid))return de("Este nome de usuário já está em uso por outro jogador.","error");de("Salvando dados...","info"),await mt.updateUserProfile(this.currentUser.uid,{username:s,displayName:s,badge:i,bio:r,isNewUser:!1}),this.profileData.username=s,this.profileData.displayName=s,this.profileData.badge=i,this.profileData.bio=r,this.profileData.isNewUser=!1;const c=document.getElementById("profile-btn-back");c&&(c.style.display=""),de("Perfil atualizado com sucesso!","success"),await this.refreshQuickProfile(),W.show("menu-screen")}catch{de("Erro ao atualizar perfil.","error")}},updateAvatarDisplay(n,e){n&&(n.innerHTML="",n.textContent=e||"👤")}},Qi={CTRL_P1:null,CTRL_P2:null,fieldSize:"medium",dimensions:{w:1024,h:640},waitingRemap:null,defaultP1:{up:"w",down:"s",left:"a",right:"d",sprint:"ShiftLeft",shoot:" ",dribble:"f",tackle:"e",power:"q"},defaultP2:{up:"arrowup",down:"arrowdown",left:"arrowleft",right:"arrowright",sprint:"ShiftRight",shoot:"1",dribble:"2",tackle:"3",power:"enter"},actions:[{id:"up",label:"Mover Cima"},{id:"down",label:"Mover Baixo"},{id:"left",label:"Mover Esquerda"},{id:"right",label:"Mover Direita"},{id:"sprint",label:"Correr"},{id:"shoot",label:"Chutar"},{id:"dribble",label:"Driblar"},{id:"tackle",label:"Desarme"},{id:"power",label:"Power Shoot"}],init(){this.loadSettings();const n=document.getElementById("settings-volume"),e=document.getElementById("volume-val-display");n&&n.addEventListener("input",r=>{const o=r.target.value;e&&(e.textContent=`${o}%`),vt.setVolume(o),localStorage.setItem("kicker_hax_volume",o)});const t=document.getElementById("settings-btn-back");t&&(t.onclick=()=>W.show("menu-screen"));const s=document.getElementById("controls-btn-back");s&&(s.onclick=()=>W.show("menu-screen")),window.addEventListener("keydown",r=>this.handleRemapKey(r));const i=document.getElementById("controls-btn-reset");i&&(i.onclick=()=>{this.CTRL_P1=JSON.parse(JSON.stringify(this.defaultP1)),this.CTRL_P2=JSON.parse(JSON.stringify(this.defaultP2)),this.saveControls(),this.renderRemapGrids(),de("Controles restaurados aos padrões!","success")}),W.register("settings-screen",{onEnter:()=>{const r=localStorage.getItem("kicker_hax_volume")||"80";n&&(n.value=r),e&&(e.textContent=`${r}%`)}}),W.register("controls-screen",{onEnter:()=>{this.renderRemapGrids();const r=document.getElementById("controls-restart-warning");r&&r.classList.add("hidden")}})},loadSettings(){const n=localStorage.getItem("kicker_hax_volume")||"80";vt.setVolume(parseInt(n,10)),this.fieldSize="medium",this.dimensions={w:1024,h:640};try{this.CTRL_P1=JSON.parse(localStorage.getItem("kicker_hax_keys_p1"))||JSON.parse(JSON.stringify(this.defaultP1)),this.CTRL_P2=JSON.parse(localStorage.getItem("kicker_hax_keys_p2"))||JSON.parse(JSON.stringify(this.defaultP2))}catch{this.CTRL_P1=JSON.parse(JSON.stringify(this.defaultP1)),this.CTRL_P2=JSON.parse(JSON.stringify(this.defaultP2))}},saveControls(){localStorage.setItem("kicker_hax_keys_p1",JSON.stringify(this.CTRL_P1)),localStorage.setItem("kicker_hax_keys_p2",JSON.stringify(this.CTRL_P2))},getKeyLabel(n){return n?n==="ShiftLeft"?"Shift Esq.":n==="ShiftRight"?"Shift Dir.":n===" "?"Espaço":n==="arrowup"?"↑":n==="arrowdown"?"↓":n==="arrowleft"?"←":n==="arrowright"?"→":n==="enter"?"Enter":n.toUpperCase():"—"},renderRemapGrids(){const n=document.getElementById("grid-controls-p1");if(!n)return;((t,s,i)=>{t.innerHTML="",this.actions.forEach(r=>{const o=document.createElement("div");o.className="map-label",o.textContent=r.label,t.appendChild(o);const l=i[r.id],c=document.createElement("button");c.className="map-key-btn",c.textContent=this.getKeyLabel(l),c.onclick=()=>this.startRemapping(s,r.id,c),t.appendChild(c)})})(n,1,this.CTRL_P1)},startRemapping(n,e,t){if(this.waitingRemap){const s=this.waitingRemap.btn,i=this.waitingRemap.playerNum===1?this.CTRL_P1[this.waitingRemap.actionId]:this.CTRL_P2[this.waitingRemap.actionId];s.textContent=this.getKeyLabel(i),s.classList.remove("active")}this.waitingRemap={playerNum:n,actionId:e,btn:t},t.textContent="Aguardando tecla...",t.classList.add("active")},handleRemapKey(n){if(!this.waitingRemap)return;n.preventDefault(),n.stopPropagation();const{playerNum:e,actionId:t,btn:s}=this.waitingRemap;s.classList.remove("active");const i=n.key||"",r=i.toLowerCase();if(i==="Escape"){const h=e===1?this.CTRL_P1[t]:this.CTRL_P2[t];s.textContent=this.getKeyLabel(h),this.waitingRemap=null;return}if(i==="Backspace"){e===1?this.CTRL_P1[t]="":this.CTRL_P2[t]="",this.saveControls(),this.renderRemapGrids(),this.waitingRemap=null;return}let o=r;(n.code==="ShiftLeft"||n.code==="ShiftRight"||n.code==="ControlLeft"||n.code==="ControlRight")&&(o=n.code);const l=e===1?this.CTRL_P1:this.CTRL_P2,c=Object.keys(l).find(h=>l[h]===o);if(c&&c!==t){const h=l[t];l[t]=o,l[c]=h}else l[t]=o;this.saveControls(),this.renderRemapGrids(),this.waitingRemap=null}};class RS{constructor(e,t,s,i={}){this.code=e.toUpperCase(),this.name=t||`Sala de ${e}`,this.hostId=s,this.maxPlayers=i.maxPlayers||10,this.password=i.password||null,this.duration=i.duration||3,this.goalLimit=i.goalLimit||3,this.fieldSize=i.fieldSize||"medium",this.showReplay=!0,this.players=[],this.chatHistory=[],this.status="lobby",this.match=null,this.spectators=[]}addPlayer(e,t,s="spectator"){const i=this.players.find(o=>o.id===e);if(i)return i;const r={id:e,uid:t.uid||"",username:t.username||"Jogador",badge:t.badge||"🏳️",team:s,ready:!1,ping:0,cpu:!!t.cpu,difficulty:t.difficulty||"medium"};return this.players.push(r),r}removePlayer(e){const t=this.players.findIndex(i=>i.id===e);if(t===-1)return null;const s=this.players.splice(t,1)[0];return e===this.hostId&&this.players.length>0&&(this.hostId=this.players[0].id),s}changeTeam(e,t){const s=this.players.find(i=>i.id===e);return s?(s.team=t,t==="spectator"&&(s.ready=!1),!0):!1}toggleReady(e){const t=this.players.find(s=>s.id===e);return!t||t.team==="spectator"?!1:(t.ready=!t.ready,t.ready)}updateSettings(e){e.name&&(this.name=e.name),e.maxPlayers&&(this.maxPlayers=parseInt(e.maxPlayers,10)),e.duration&&(this.duration=parseInt(e.duration,10)),e.goalLimit&&(this.goalLimit=parseInt(e.goalLimit,10)),e.password!==void 0&&(this.password=e.password||null),e.fieldSize&&(this.fieldSize=e.fieldSize),this.showReplay=!0}addChatMessage(e,t,s,i){const r={time:new Date().toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"}),username:e,avatar:t||"",badge:s||"",text:i.slice(0,120)};return this.chatHistory.push(r),this.chatHistory.length>50&&this.chatHistory.shift(),r}getPublicInfo(){return{code:this.code,name:this.name,playersCount:this.players.length,maxPlayers:this.maxPlayers,hasPassword:!!this.password,status:this.status,duration:this.duration,goalLimit:this.goalLimit,hostId:this.hostId}}getLobbyInfo(){return{code:this.code,name:this.name,maxPlayers:this.maxPlayers,duration:this.duration,goalLimit:this.goalLimit,fieldSize:this.fieldSize,showReplay:this.showReplay,hostId:this.hostId,status:this.status,players:this.players,chatHistory:this.chatHistory}}}const $f=1024,Wf=640,D=36,at=180,St=30,Re=6,In=10,ct=16,Xs=.955,qf=.9,SS=2.3,oa=3.2,x_=6,Kh=90,AS=.0035,kS=.0035,aa=82,M_=140,la=9,L_=120,O_=80,zf=30,Yi=1/3,ca=3.8,V_=12,F_=34,B_=12,Xi=1/3,U_=22,j_=60,Ls=180,Hf=180,we={RED:0,BLUE:1},Hn={EASY:"easy",MEDIUM:"medium",HARD:"hard"};class ot{static clamp(e,t,s){return Math.max(t,Math.min(s,e))}static rnd(e,t){return e+Math.random()*(t-e)}static normalizedAngle(e){return e%=Math.PI*2,e<-Math.PI?e+Math.PI*2:e>Math.PI?e-Math.PI*2:e}static lerpAngle(e,t,s){e=this.normalizedAngle(e),t=this.normalizedAngle(t);let i=this.normalizedAngle(t-e);return e+i*s}static circleCollision(e,t){const s=t.x-e.x,i=t.y-e.y,r=Math.hypot(s,i);return r<e.r+t.r?{dx:s,dy:i,d:r}:null}static collidePlayerWithCorner(e,t,s,i){const r=e.x-t,o=e.y-s,l=Math.hypot(r,o)||1e-6,c=e.r+i;if(l<c){const h=r/l,d=o/l,m=c-l;e.x+=h*m,e.y+=d*m;const p=e.vx*h+e.vy*d;e.vx-=.8*p*h,e.vy-=.8*p*d}}static collideBallWithCorner(e,t,s,i,r){const o=e.x-t,l=e.y-s,c=Math.hypot(o,l)||1e-6,h=e.r+i;if(c<h){const d=o/c,m=l/c,p=h-c;e.x+=d*p,e.y+=m*p;const E=e.vx*d+e.vy*m;e.vx-=1.7*E*d,e.vy-=1.7*E*m,e.strikeTimer>0&&(e.lastStrikeType==="kick"||e.lastStrikeType==="power")&&r&&r()}}static resolvePlayerPlayer(e){for(let t=0;t<e.length;t++)for(let s=t+1;s<e.length;s++){const i=e[t],r=e[s],o=this.circleCollision(i,r);if(!o)continue;const l=o.d||1e-6,c=o.dx/l,h=o.dy/l,d=(i.r+r.r-l)*.5;i.x-=c*d,i.y-=h*d,r.x+=c*d,r.y+=h*d;const m=r.vx-i.vx,p=r.vy-i.vy,E=m*c+p*h;let b=.7;(i.stun>0||r.stun>0||i.tackleFreeze>0||r.tackleFreeze>0)&&(b=0);const S=-E*b;i.vx-=S*c,i.vy-=S*h,r.vx+=S*c,r.vy+=S*h}}static resolvePlayerBall(e,t,s){for(const i of e){const r=this.circleCollision(i,t);if(!r)continue;const o=r.d||1e-6,l=r.dx/o,c=r.dy/o,h=i.r+t.r-o;t.owner||(t.noPickupFrames<=0||t.noPickupFrom!==i.id?(t.x+=l*h,t.y+=c*h,t.vx+=i.vx*.22,t.vy+=i.vy*.22,t.owner=i.id,t.lastStrikeType=null,t.strikeTimer=0,s&&s(i)):(t.x+=l*Math.max(0,h-1),t.y+=c*Math.max(0,h-1),t.vx+=i.vx*.05,t.vy+=i.vy*.05)),t.lastTouch=i.id}}static updatePlayerPhysics(e,t,s,i){if(e.stun>0){e.vx=0,e.vy=0,e.tackle_cd>0&&e.tackle_cd--,e.dribble_cd>0&&e.dribble_cd--,e.dash_time>0&&e.dash_time--,e.invuln>0&&e.invuln--,e.stun--,e.cool>0&&e.cool--,e.power_cd>0&&e.power_cd--,e.tackleFreeze>0&&e.tackleFreeze--,e.aiShootLock>0&&e.aiShootLock--,e.shootHalo>0&&e.shootHalo--,e.tackleEval>0&&(e.tackleEval--,e.tackleEval===0&&!e.tackleSuccess&&(e.stun=Math.max(e.stun,zf)));return}e.staminaLock>0?(e.stamina=0,e.staminaLock--):t.sprint&&e.stamina>0?(e.stamina=Math.max(0,e.stamina-kS),e.stamina===0&&(e.staminaLock=Kh)):e.stamina=Math.min(1,e.stamina+AS);const r=t.sprint&&e.staminaLock<=0&&e.stamina>0,o=e.slowTimer>0?.7:1;e.slowTimer>0&&e.slowTimer--;const c=SS*(r?1.5:1)*o,h=e.dash_time>0?1.7:1;let d=t.x||0,m=t.y||0;const p=Math.hypot(d,m)||1;if(e.vx=e.vx*qf+d/p*c*.12*h,e.vy=e.vy*qf+m/p*c*.12*h,d||m){const E=Math.atan2(m,d);e.dir=this.lerpAngle(e.dir,E,.35),e.lastMoveDir=e.dir}t.shoot?e.kickCharge=Math.min(1,e.kickCharge+.065):e.kickCharge*=.95,e.boostCooldown>0&&e.boostCooldown--,e.tackle_cd>0&&e.tackle_cd--,e.dribble_cd>0&&e.dribble_cd--,e.dash_time>0&&e.dash_time--,e.invuln>0&&e.invuln--,e.cool>0&&e.cool--,e.power_cd>0&&e.power_cd--,e.tackleFreeze>0&&e.tackleFreeze--,e.aiShootLock>0&&e.aiShootLock--,e.shootHalo>0&&e.shootHalo--,e.tackleEval>0&&(e.tackleEval--,e.tackleEval===0&&!e.tackleSuccess&&(e.vx=0,e.vy=0,e.stun=Math.max(e.stun,zf)))}static applyLimits(e,t,s,i,r,o,l,c,h=1024,d=640){let m=e.x+e.vx,p=e.y+e.vy;if(p>t&&p<s||(p-e.r<D&&(p=D+e.r,e.vy*=-.5),p+e.r>d-D&&(p=d-D-e.r,e.vy*=-.5)),p>t&&p<s){m-e.r<i&&(m=i+e.r,e.vx=Math.max(e.vx,0)*.5),m+e.r>r&&(m=r-e.r,e.vx=Math.min(e.vx,0)*.5);const E=m<D&&m>=i-6,b=m>h-D&&m<=r+6;(E||b)&&(p-e.r<t&&(p=t+e.r,e.vy=Math.max(e.vy,0)*.4),p+e.r>s&&(p=s-e.r,e.vy=Math.min(e.vy,0)*.4));const S={x:m,y:p,vx:e.vx,vy:e.vy,r:e.r};this.collidePlayerWithCorner(S,o,t,c),this.collidePlayerWithCorner(S,o,s,c),this.collidePlayerWithCorner(S,l,t,c),this.collidePlayerWithCorner(S,l,s,c),m=S.x,p=S.y,e.vx=S.vx,e.vy=S.vy}else{m-e.r<D&&(m=D+e.r,e.vx*=-.5),m+e.r>h-D&&(m=h-D-e.r,e.vx*=-.5);const E={x:m,y:p,vx:e.vx,vy:e.vy,r:e.r};this.collidePlayerWithCorner(E,o,t,c),this.collidePlayerWithCorner(E,o,s,c),this.collidePlayerWithCorner(E,l,t,c),this.collidePlayerWithCorner(E,l,s,c),m=E.x,p=E.y,e.vx=E.vx,e.vy=E.vy}e.x=m,e.y=p}static updateBallPhysics(e,t,s,i,r,o,l,c,h,d,m,p=1024,E=640){if(e.boostCooldown>0&&e.boostCooldown--,e.noPickupFrames>0&&(e.noPickupFrames--,e.noPickupFrames===0&&(e.noPickupFrom=null)),e.strikeTimer>0&&e.strikeTimer--,e.owner){const b=h.find(S=>S.id===e.owner);if(b){const S=b.r+e.r+1,P=Math.cos(b.dir||0),F=Math.sin(b.dir||0);let U=b.x+P*S,O=b.y+F*S,G=D+e.r,ae=p-D-e.r;O>t&&O<s&&(G=i+e.r,ae=r-e.r),e.x=this.clamp(U,G,ae),e.y=this.clamp(O,D+e.r,E-D-e.r),e.vx=b.vx,e.vy=b.vy,O>t&&O<s&&(e.x+e.r<=o&&m("blue",b.id),e.x-e.r>=l&&m("red",b.id));return}else e.owner=null}if(e.vx*=Xs,e.vy*=Xs,e.x+=e.vx,e.y+=e.vy,e.y-e.r<D&&(e.y=D+e.r,e.vy*=-.75),e.y+e.r>E-D&&(e.y=E-D-e.r,e.vy*=-.75),e.x-e.r<D&&(e.y>t&&e.y<s?(this.collideBallWithCorner(e,o,t,c,()=>d("post")),this.collideBallWithCorner(e,o,s,c,()=>d("post"))):(e.x=D+e.r,e.vx*=-.75)),e.x+e.r>p-D&&(e.y>t&&e.y<s?(this.collideBallWithCorner(e,l,t,c,()=>d("post")),this.collideBallWithCorner(e,l,s,c,()=>d("post"))):(e.x=p-D-e.r,e.vx*=-.75)),e.y>t&&e.y<s){const b=e.x<D&&e.x>=i-30,S=e.x>p-D&&e.x<=r+30;(b||S)&&(b&&e.x-e.r<i&&(e.x=i+e.r,e.vx*=-.65),S&&e.x+e.r>r&&(e.x=r-e.r,e.vx*=-.65),e.y-e.r<t&&(e.y=t+e.r,e.vy*=-.65),e.y+e.r>s&&(e.y=s-e.r,e.vy*=-.65))}e.y>t&&e.y<s&&(e.x+e.r<=o&&m("blue",e.lastTouch),e.x-e.r>=l&&m("red",e.lastTouch))}static kickBall(e,t,s,i){t.owner=null,t.noPickupFrames=14,t.noPickupFrom=e.id,t.vx+=Math.cos(s)*i,t.vy+=Math.sin(s)*i,t.vx+=this.rnd(-.05,.05),t.vy+=this.rnd(-.05,.05),t.lastTouch=e.id,t.lastStrikeType="kick",t.strikeTimer=40}static powerKick(e,t,s,i){t.owner=null,t.noPickupFrames=14,t.noPickupFrom=e.id,t.vx+=Math.cos(s)*i,t.vy+=Math.sin(s)*i,t.vx+=this.rnd(-.05,.05),t.vy+=this.rnd(-.05,.05),t.lastTouch=e.id,t.lastStrikeType="power",t.strikeTimer=40}}class PS{constructor(e,t,s,i,r,o,l="medium"){this.roomCode=e,this.duration=t,this.goalLimit=s,this.io=r,this.onMatchEnd=o,this.fieldSize=l,this.fieldSize==="small"?(this.w=896,this.h=560):this.fieldSize==="large"?(this.w=1280,this.h=768):(this.w=1024,this.h=640),this.score={red:0,blue:0},this.matchTime=t*60,this.status="countdown",this.countdownTimer=300,this.goalFreezeTimer=0,this.endFreezeTimer=0,this.isHostPaused=!1,this.ball={x:this.w/2,y:this.h/2,vx:0,vy:0,r:In,owner:null,lastTouch:null,strikeTimer:0,lastStrikeType:null,noPickupFrames:0,noPickupFrom:null},this.players=i.map(c=>this.createPhysicalPlayer(c)),this.hasBots=this.players.some(c=>c.cpu),this.inputs=new Map,this.players.forEach(c=>{c.cpu||this.inputs.set(c.id,{x:0,y:0,shoot:!1,sprint:!1,dribble:!1,tackle:!1,power:!1})}),this.soundEffects=[],this.replayBuffer=new Array(Ls*2),this.replayBufferIndex=0,this.lastGoal=null,this.playerStats=new Map,this.players.forEach(c=>{!c.cpu&&c.uid&&this.playerStats.set(c.id,{uid:c.uid,username:c.name,team:c.team,goals:0,ownGoals:0,shots:0,dribbles:0,tackles:0})}),this.tickInterval=setInterval(()=>this.tick(),1e3/60),this.kickoff()}createPhysicalPlayer(e){const s=e.team==="red"?D+120:this.w-D-120,i=this.h*.5;return{id:e.id,uid:e.uid||"",name:e.username,badge:e.badge,team:e.team==="red"?we.RED:we.BLUE,cpu:!!e.cpu,difficulty:e.difficulty||Hn.MEDIUM,role:"mf",x:s,y:i,vx:0,vy:0,r:ct,dir:0,lastMoveDir:0,stamina:1,staminaLock:0,stun:0,slowTimer:0,tackle_cd:0,dribble_cd:0,dash_time:0,invuln:0,power_cd:0,tackleFreeze:0,tackleSuccess:!1,tackleEval:0,shootHalo:0,aiShootLock:0,aiFeintLock:0,home:{x:s,y:i}}}updateInput(e,t){this.inputs.has(e)&&this.inputs.set(e,{x:ot.clamp(t.x||0,-1,1),y:ot.clamp(t.y||0,-1,1),shoot:!!t.shoot,sprint:!!t.sprint,dribble:!!t.dribble,tackle:!!t.tackle,power:!!t.power})}kickoff(){const e=this.players.filter(i=>i.team===we.RED),t=this.players.filter(i=>i.team===we.BLUE),s=(i,r)=>{const o=[{dx:120,dy:.5},{dx:250,dy:.5},{dx:180,dy:.3},{dx:180,dy:.7}];i.forEach((l,c)=>{const h=o[c%o.length],d=(Math.random()-.5)*20,m=(Math.random()-.5)*20;l.x=r?D+h.dx+d:this.w-D-h.dx+d,l.y=this.h*h.dy+m,l.vx=0,l.vy=0,l.kickCharge=0,l.stamina=1,l.staminaLock=0,l.stun=0,l.tackle_cd=0,l.dribble_cd=0,l.dash_time=0,l.invuln=0,l.power_cd=0,l.tackleFreeze=0,l.tackleSuccess=!1,l.tackleEval=0,l.shootHalo=0,l.aiShootLock=0,l.aiFeintLock=0})};s(e,!0),s(t,!1),this.ball.x=this.w*.5,this.ball.y=this.h*.5,this.ball.vx=0,this.ball.vy=0,this.ball.owner=null,this.ball.lastTouch=null,this.ball.strikeTimer=0,this.ball.lastStrikeType=null,this.ball.noPickupFrames=0,this.ball.noPickupFrom=null,this.soundEffects.push("whistle")}recordFrame(){const e=this.players.map(s=>({x:s.x,y:s.y,dir:s.dir,team:s.team,has:this.ball.owner===s.id,name:s.name||"",badge:s.badge||"",inv:s.invuln||0,stun:s.stun||0,halo:s.shootHalo||0})),t={ball:{x:this.ball.x,y:this.ball.y},players:e,score:{...this.score},sfx:[...this.soundEffects]};this.replayBuffer[this.replayBufferIndex]=t,this.replayBufferIndex=(this.replayBufferIndex+1)%this.replayBuffer.length}getReplayQueue(){const e=[];for(let t=0;t<this.replayBuffer.length;t++){const s=(this.replayBufferIndex+t)%this.replayBuffer.length;this.replayBuffer[s]&&e.push(this.replayBuffer[s])}return e}triggerGoal(e,t){if(this.status!=="playing")return;this.status="freeze",this.goalFreezeTimer=Ls;const s=this.players.find(l=>l.id===t),i=s?s.name:"Desconhecido",r=s?e==="blue"&&s.team===we.RED||e==="red"&&s.team===we.BLUE:!1;e==="blue"?this.score.blue++:this.score.red++;const o=this.playerStats.get(t);o&&(r?o.ownGoals++:o.goals++),this.lastGoal={side:e,scorerName:i,scorerId:t,ownGoal:r},this.soundEffects.push("whistle"),this.soundEffects.push("goal"),this.soundEffects.push("cheer")}processBotAI(e){if(e.stun>0)return;const t=this.players.filter(j=>j.team===e.team),s=this.players.filter(j=>j.team!==e.team),i=e.team===we.RED?this.w-D-Re-2:D+Re+2,r=(this.h-at)/2,o=(this.h+at)/2,l={x:this.ball.x,y:this.ball.y};if(!this.ball.owner){let j=this.ball.vx,se=this.ball.vy;for(let ue=0;ue<10;ue++)j*=Xs,se*=Xs,l.x+=j,l.y+=se}const c=Math.hypot(l.x-e.x,l.y-e.y),d=t.reduce((j,se)=>{const ue=Math.hypot(l.x-se.x,l.y-se.y);return ue<j.d?{p:se,d:ue}:j},{p:null,d:1e9}).p===e;let m=!1;e.difficulty!==Hn.EASY&&(m=this.ball.owner===e.id&&Math.abs(i-e.x)>220||!this.ball.owner&&(d||c>140));const p=m&&e.staminaLock<=0&&e.stamina>.35;let E=l.x,b=l.y;if(this.ball.owner===e.id)E=i,b=ot.clamp(e.y,r+20,o-20);else if(this.ball.owner&&this.players.find(j=>j.id===this.ball.owner).team!==e.team){const j=this.players.find(ue=>ue.id===this.ball.owner);if(Math.hypot(j.x-e.x,j.y-e.y)>200){const ue=e.team===we.RED?D:this.w-D;E=ue+(j.x-ue)*.7,b=this.h*.5+(j.y-this.h*.5)*.7}else E=j.x,b=j.y}let S=E-e.x,P=b-e.y,F=Math.hypot(S,P)||1,U=S/F,O=P/F,G=0,ae=0;if(e.difficulty===Hn.HARD)for(const j of s){const se=e.x-j.x,ue=e.y-j.y,Ne=Math.hypot(se,ue);if(Ne<110){const Ae=(110-Ne)/110;G+=se/(Ne||1)*Ae*.7,ae+=ue/(Ne||1)*Ae*.7}}let ee=U+G,T=O+ae;const _=Math.hypot(ee,T)||1;ee/=_,T/=_;let v=0;e.difficulty===Hn.EASY?v=.25:e.difficulty===Hn.MEDIUM&&(v=.12),v>0&&Math.random()<.05&&(ee+=ot.rnd(-v,v),T+=ot.rnd(-v,v));let w=!1,I=!1,C=!1,y=!1;if(this.ball.owner===e.id){const j=Math.abs(i-e.x),se=e.y>r&&e.y<o;(j<100||j<160&&se)&&(w=!0),e.difficulty===Hn.HARD&&(s.reduce((Ne,Ae)=>{const gt=Math.hypot(Ae.x-e.x,Ae.y-e.y);return gt<Ne.d?{p:Ae,d:gt}:Ne},{p:null,d:1e9}).d<90&&e.dribble_cd<=0&&e.stamina>=Xi&&(I=!0),e.power_cd<=0&&e.stamina>.98&&j>250&&j<500&&(y=!0))}else if(this.ball.owner&&this.players.find(j=>j.id===this.ball.owner).team!==e.team){const j=this.players.find(ue=>ue.id===this.ball.owner);Math.hypot(j.x-e.x,j.y-e.y)<aa&&e.tackle_cd<=0&&e.stamina>=Yi&&e.difficulty!==Hn.EASY&&(C=!0)}this.inputs.set(e.id,{x:ee,y:T,shoot:w,sprint:p,dribble:I,tackle:C,power:y})}tick(){if(this.soundEffects=[],this.isHostPaused){const h={ball:{x:this.ball.x,y:this.ball.y,vx:this.ball.vx,vy:this.ball.vy,owner:this.ball.owner,lastTouch:this.ball.lastTouch},players:this.players.map(d=>({id:d.id,team:d.team,x:d.x,y:d.y,dir:d.dir,stamina:d.stamina,staminaLock:d.staminaLock,stun:d.stun,shootHalo:d.shootHalo,kickCharge:d.kickCharge||0,invuln:d.invuln,badge:d.badge,name:d.name})),score:this.score,matchTime:this.matchTime,status:this.status,countdown:Math.max(0,Math.ceil(this.countdownTimer/60)),soundEffects:[],isHostPaused:!0};this.io.to(this.roomCode).emit("gameState",h);return}const e=(this.h-at)/2,t=(this.h+at)/2,s=D-Re,i=this.w-D+Re,r=s-St,o=i+St,l=10;if(this.status==="countdown")this.countdownTimer--,this.countdownTimer<=0&&(this.status="playing"),this.recordFrame();else if(this.status==="freeze")this.goalFreezeTimer--,this.recordFrame(),this.goalFreezeTimer<=0&&(this.io.to(this.roomCode).emit("playReplay",{replayFrames:this.getReplayQueue(),goalInfo:this.lastGoal}),this.status="replay",this.countdownTimer=Ls*2*3+5);else if(this.status==="replay")this.countdownTimer--,this.countdownTimer<=0&&((this.score.red>=this.goalLimit||this.score.blue>=this.goalLimit)&&this.goalLimit>0?(this.status="end-freeze",this.endFreezeTimer=Hf):(this.status="countdown",this.countdownTimer=300,this.kickoff()));else if(this.status==="end-freeze")this.endFreezeTimer--,this.recordFrame(),this.endFreezeTimer<=0&&(this.status="ended",this.onMatchEnd(this.buildMatchResult()),clearInterval(this.tickInterval));else if(this.status==="playing"){this.matchTime-=1/60,this.matchTime<=0&&(this.matchTime=0,this.status="end-freeze",this.endFreezeTimer=Hf);for(const h of this.players)h.cpu&&this.processBotAI(h);for(const h of this.players){const d=this.inputs.get(h.id)||{x:0,y:0,shoot:!1,sprint:!1,dribble:!1,tackle:!1,power:!1};if(h.stun<=0){if(d.tackle&&h.tackle_cd<=0&&h.stamina>=Yi){const m=this.playerStats.get(h.id);m&&m.tackles++,h.stamina=Math.max(0,h.stamina-Yi),h.tackle_cd=M_,h.tackleSuccess=!1,h.tackleEval=12,h.slowTimer=O_,h.tackleFreeze=8,this.soundEffects.push("tackle");const p=this.players.find(b=>b.id===this.ball.owner),E=p?Math.atan2(p.y-h.y,p.x-h.x):h.dir;h.vx+=Math.cos(E)*la,h.vy+=Math.sin(E)*la,p&&p.team!==h.team&&p.invuln<=0&&Math.hypot(p.x-h.x,p.y-h.y)<=aa&&(this.ball.owner=h.id,this.ball.lastTouch=h.id,this.ball.noPickupFrames=10,this.ball.noPickupFrom=null,this.ball.vx=0,this.ball.vy=0,p.stun=Math.max(p.stun,L_),p.vx=0,p.vy=0,h.tackleSuccess=!0)}if(d.dribble&&h.dribble_cd<=0&&this.ball.owner===h.id&&h.stamina>=Xi){const m=this.playerStats.get(h.id);m&&m.dribbles++,h.stamina=Math.max(0,h.stamina-Xi),h.dash_time=V_,h.invuln=B_,h.dribble_cd=F_,h.vx+=Math.cos(h.dir)*ca,h.vy+=Math.sin(h.dir)*ca,this.soundEffects.push("dribble")}if(d.power&&h.power_cd<=0&&h.stamina>=.5&&(this.ball.owner===h.id||Math.hypot(h.x-this.ball.x,h.y-this.ball.y)<h.r+this.ball.r+8)){const m=this.playerStats.get(h.id);m&&m.shots++,h.stamina=Math.max(0,h.stamina-.5),h.stamina===0&&(h.staminaLock=Kh),h.power_cd=j_,h.cool=12,h.shootHalo=22;const p=d.x||d.y?Math.atan2(d.y,d.x):h.dir;ot.powerKick(h,this.ball,p,U_),this.soundEffects.push("power")}if(h.kickCharge>0&&!d.shoot){if(this.ball.owner===h.id||Math.hypot(h.x-this.ball.x,h.y-this.ball.y)<h.r+this.ball.r+14){const p=ot.clamp(h.kickCharge,0,1);h.cool=14,h.shootHalo=18;const E=d.x||d.y?Math.atan2(d.y,d.x):h.dir,b=Math.max(oa,oa+x_*p),S=this.playerStats.get(h.id);S&&S.shots++,ot.kickBall(h,this.ball,E,b),this.soundEffects.push("kick")}h.kickCharge=0}}ot.updatePlayerPhysics(h,d,this.ball,m=>this.soundEffects.push(m)),ot.applyLimits(h,e,t,r,o,s,i,l,this.w,this.h)}ot.resolvePlayerPlayer(this.players),ot.resolvePlayerBall(this.players,this.ball,h=>{for(const d of this.players)d.tackleEval>0&&this.ball.owner===d.id&&(d.tackleSuccess=!0)}),ot.updateBallPhysics(this.ball,e,t,r,o,s,i,l,this.players,h=>this.soundEffects.push(h),(h,d)=>this.triggerGoal(h,d),this.w,this.h),this.recordFrame()}const c={ball:{x:this.ball.x,y:this.ball.y,vx:this.ball.vx,vy:this.ball.vy,owner:this.ball.owner,lastTouch:this.ball.lastTouch},players:this.players.map(h=>({id:h.id,team:h.team,x:h.x,y:h.y,dir:h.dir,stamina:h.stamina,staminaLock:h.staminaLock,stun:h.stun,shootHalo:h.shootHalo,kickCharge:h.kickCharge||0,invuln:h.invuln,badge:h.badge,name:h.name})),score:this.score,matchTime:this.matchTime,status:this.status,countdown:Math.max(0,Math.ceil(this.countdownTimer/60)),soundEffects:this.soundEffects,isHostPaused:!1};this.io.to(this.roomCode).emit("gameState",c)}buildMatchResult(){const e=Array.from(this.playerStats.entries()).map(([i,r])=>({playerId:i,...r})),t=this.score.red===this.score.blue?"draw":this.score.blue>this.score.red?we.BLUE:we.RED,s=e.filter(i=>t!=="draw"?i.team===t:!0).sort((i,r)=>{const o=i.goals*6+i.shots*2+i.dribbles*2+i.tackles-i.ownGoals*4;return r.goals*6+r.shots*2+r.dribbles*2+r.tackles-r.ownGoals*4-o})[0]||null;return{score:{...this.score},winnerTeam:t,mvp:s,playerStats:e,hasBots:this.hasBots}}changeFieldSize(e){this.fieldSize=e,this.fieldSize==="small"?(this.w=896,this.h=560):this.fieldSize==="large"?(this.w=1280,this.h=768):(this.w=1024,this.h=640),this.physics=new ot(this.w,this.h),this.ball.x=this.w/2,this.ball.y=this.h/2,this.ball.vx=0,this.ball.vy=0}resetMatch(){this.score={red:0,blue:0},this.matchTime=this.duration*60,this.status="countdown",this.countdownTimer=300,this.ball.x=this.w/2,this.ball.y=this.h/2,this.ball.vx=0,this.ball.vy=0}addTime(e){this.matchTime=Math.max(0,this.matchTime+e)}stop(){clearInterval(this.tickInterval)}}class NS{constructor(){this.listeners=new Map,this.clientId=null,this.peer=null,this.isHost=!1,this.roomCode=null,this.presenceBound=!1,this.connections=[],this.hostConn=null,this.serverRoom=null}connect(e=window.location.origin){return this.clientId||(this.clientId="user_"+Math.random().toString(36).substring(2,8)),console.log(`[P2PSocket] Inicializado com ID do Cliente: ${this.clientId}`),this.listenToPublicRooms(),this.setupPresenceTracking(),this}disconnect(){this.leaveRoom()}getSocket(){return this}get id(){return this.clientId}on(e,t){this.listeners.has(e)||this.listeners.set(e,[]),this.listeners.get(e).push(t)}once(e,t){const s=i=>{this.off(e,s),t(i)};this.on(e,s)}off(e,t){if(!t){this.listeners.delete(e);return}const s=this.listeners.get(e);s&&this.listeners.set(e,s.filter(i=>i!==t))}triggerLocalEvent(e,t){const s=this.listeners.get(e);s&&s.forEach(i=>{try{i(t)}catch(r){console.error(`[P2PSocket] Erro no listener do evento ${e}:`,r)}})}emit(e,t){this.isHost?this.handleHostReceivedData(this.clientId,e,t):this.hostConn&&this.hostConn.open&&this.hostConn.send({event:e,data:t})}broadcast(e,t){this.triggerLocalEvent(e,t),this.connections.forEach(s=>{s.open&&s.send({event:e,data:t})})}createRoom(e,t,s,i,r,o,l,c){const h="ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";let d="";for(let m=0;m<6;m++)d+=h.charAt(Math.floor(Math.random()*h.length));this.isHost=!0,this.roomCode=d,this.peer&&this.peer.destroy(),this.peer=new Peer(this.clientId),this.peer.on("open",m=>{console.log("[P2PSocket] Host Peer criado:",m),this.serverRoom=new RS(d,e,this.clientId,{maxPlayers:parseInt(s)||10,password:t||null,duration:parseInt(i)||3,goalLimit:parseInt(r)||3,fieldSize:o||"medium",showReplay:!0}),this.serverRoom.addPlayer(this.clientId,c,"spectator"),this.connections=[];const p=Ze(et,`multiplayerRooms/${d}`);ra(p,{code:d,name:e,maxPlayers:parseInt(s)||10,password:t||"",hasPassword:!!t,playersCount:1,status:"lobby",duration:parseInt(i)||3,goalLimit:parseInt(r)||3,fieldSize:o||"medium",hostPeerId:m}).then(()=>{this.triggerLocalEvent("roomCreated",d),this.triggerLocalEvent("lobbyUpdate",this.serverRoom.getLobbyInfo())})}),this.peer.on("connection",m=>{console.log("[P2PSocket] Recebida tentativa de conexão de:",m.peer),m.on("data",p=>{p&&p.event&&this.handleHostReceivedData(m.peer,p.event,p.data,m)}),m.on("close",()=>{this.handleHostPlayerDisconnect(m)}),m.on("error",p=>{console.error("[P2PSocket] Erro no canal de dados do peer:",p)})})}joinRoom(e,t,s){const i=e.toUpperCase();this.isHost=!1,this.roomCode=i;const r=Ze(et,`multiplayerRooms/${i}`);dc(r).then(o=>{if(!o.exists()){this.triggerLocalEvent("joinError","Sala não encontrada.");return}const l=o.val();if(l.status!=="lobby"){this.triggerLocalEvent("joinError","A partida desta sala já começou.");return}if(l.password&&l.password!==t){this.triggerLocalEvent("joinError","Senha incorreta.");return}if(l.playersCount>=l.maxPlayers){this.triggerLocalEvent("joinError","Sala cheia.");return}this.peer&&this.peer.destroy(),this.peer=new Peer(this.clientId),this.peer.on("open",c=>{console.log("[P2PSocket] Conectando como convidado com ID:",c);const h=this.peer.connect(l.hostPeerId);this.hostConn=h,h.on("open",()=>{console.log("[P2PSocket] WebRTC aberto com Host. Enviando requisição de entrada..."),h.send({event:"joinRoom",data:{profile:s}})}),h.on("data",d=>{const{event:m,data:p}=d;m==="joinSuccess"?this.triggerLocalEvent("joinSuccess",i):m==="joinError"?(this.triggerLocalEvent("joinError",p),this.leaveRoom()):this.triggerLocalEvent(m,p)}),h.on("close",()=>{console.log("[P2PSocket] Host encerrou a conexão."),this.triggerLocalEvent("kicked"),this.leaveRoom()})}),this.peer.on("error",c=>{console.error("[P2PSocket] Erro do guest peer:",c),this.triggerLocalEvent("joinError","Falha ao conectar via WebRTC.")})})}leaveRoom(){if(this.isHost&&this.roomCode){const e=Ze(et,`multiplayerRooms/${this.roomCode}`);nS(e),this.serverRoom&&this.serverRoom.match&&(this.serverRoom.match.isHostPaused=!1,clearInterval(this.serverRoom.match.tickInterval)),this.connections.forEach(t=>t.close()),this.connections=[],this.serverRoom=null}else this.hostConn&&(this.hostConn.close(),this.hostConn=null);this.peer&&(this.peer.destroy(),this.peer=null),this.isHost=!1,this.roomCode=null}handleHostReceivedData(e,t,s,i){if(this.serverRoom){if(t==="joinRoom"){const{profile:r}=s;if(this.serverRoom.players.length>=this.serverRoom.maxPlayers){i&&i.send({event:"joinError",data:"Sala cheia."});return}i&&(i.peerId=e,this.connections.push(i)),this.serverRoom.addPlayer(e,r,"spectator");const o=Ze(et,`multiplayerRooms/${this.roomCode}`);Qn(o,{playersCount:this.serverRoom.players.length}),i&&i.send({event:"joinSuccess",data:this.roomCode}),this.broadcast("lobbyUpdate",this.serverRoom.getLobbyInfo());const l=this.serverRoom.addChatMessage("Sistema","","📢",`${r.username} entrou na sala.`);this.broadcast("chatMessage",l)}else if(t==="changeTeam")this.serverRoom.changeTeam(e,s)&&this.broadcast("lobbyUpdate",this.serverRoom.getLobbyInfo());else if(t==="toggleReady")this.serverRoom.toggleReady(e),this.broadcast("lobbyUpdate",this.serverRoom.getLobbyInfo());else if(t==="chatMessage"){const r=this.serverRoom.players.find(h=>h.id===e),o=r?r.username:"Jogador",l=r?r.badge:"",c=this.serverRoom.addChatMessage(o,"",l,s);this.broadcast("chatMessage",c)}else if(t==="gameInput")this.serverRoom.match&&this.serverRoom.match.updateInput(e,s);else if(t==="hostFocusChanged")e===this.serverRoom.hostId&&this.serverRoom.match&&(this.serverRoom.match.isHostPaused=!!s.focusLost);else if(t==="hostSetPaused"){if(e===this.serverRoom.hostId&&this.serverRoom.match){this.serverRoom.match.isHostPaused=!!s.paused;const r=s.paused?"pausada":"retomada",o=this.serverRoom.addChatMessage("Sistema","","📢",`A partida foi ${r} pelo host.`);this.broadcast("chatMessage",o)}}else if(t==="hostResetMatch")e===this.serverRoom.hostId&&this.serverRoom.match&&(this.serverRoom.match.resetMatch(),this.broadcast("matchReset"));else if(t==="hostAddTime"){if(e===this.serverRoom.hostId&&this.serverRoom.match){const r=Math.max(0,Math.min(600,Number(s.seconds)||0));this.serverRoom.match.addTime(r);const o=this.serverRoom.addChatMessage("Sistema","","📢",`O host adicionou ${Math.round(r/60)} minuto(s) ao tempo.`);this.broadcast("chatMessage",o)}}else if(t==="hostChangeTeam"){if(e!==this.serverRoom.hostId)return;if(this.serverRoom.changeTeam(s.playerId,s.team)){if(this.serverRoom.match){const o=this.serverRoom.match.players.find(l=>l.id===s.playerId);o&&(o.team=s.team==="red"?we.RED:we.BLUE,this.serverRoom.match.kickoff())}this.broadcast("lobbyUpdate",this.serverRoom.getLobbyInfo())}}}}handleHostPlayerDisconnect(e){const t=e.peer;if(this.connections=this.connections.filter(s=>s!==e),this.serverRoom){const s=this.serverRoom.removePlayer(t),i=Ze(et,`multiplayerRooms/${this.roomCode}`);if(Qn(i,{playersCount:this.serverRoom.players.length}),s){const r=this.serverRoom.addChatMessage("Sistema","","📢",`${s.username} saiu da sala.`);if(this.broadcast("chatMessage",r),this.serverRoom.match){this.serverRoom.match.isHostPaused=!0;const o=this.serverRoom.addChatMessage("Sistema","","📢","Partida pausada para o host reorganizar os times.");this.broadcast("chatMessage",o)}}this.broadcast("lobbyUpdate",this.serverRoom.getLobbyInfo())}}changeTeam(e){this.emit("changeTeam",e)}toggleReady(){this.emit("toggleReady")}sendChatMessage(e){this.emit("chatMessage",e)}addBot(e){if(!this.isHost||!this.serverRoom)return;const t=`bot_${Math.random().toString(36).substr(2,5)}`,s={uid:"",username:`Bot ${e==="red"?"Vermelho":"Azul"} (CPU)`,badge:"⚙️",cpu:!0,difficulty:"medium"};this.serverRoom.addPlayer(t,s,e),this.broadcast("lobbyUpdate",this.serverRoom.getLobbyInfo())}removeBot(e){!this.isHost||!this.serverRoom||(this.serverRoom.removePlayer(e),this.broadcast("lobbyUpdate",this.serverRoom.getLobbyInfo()))}kickPlayer(e){if(!this.isHost||!this.serverRoom)return;const t=this.connections.find(i=>i.peer===e),s=this.serverRoom.players.find(i=>i.id===e);if(s){this.serverRoom.removePlayer(e),this.broadcast("lobbyUpdate",this.serverRoom.getLobbyInfo());const i=this.serverRoom.addChatMessage("Sistema","","📢",`${s.username} foi expulso da sala.`);this.broadcast("chatMessage",i),t&&(t.send({event:"kicked"}),t.close())}}updateRoomSettings(e){if(!this.isHost||!this.serverRoom)return;this.serverRoom.updateSettings(e),this.broadcast("lobbyUpdate",this.serverRoom.getLobbyInfo());const t=Ze(et,`multiplayerRooms/${this.roomCode}`);Qn(t,{name:this.serverRoom.name,maxPlayers:this.serverRoom.maxPlayers,duration:this.serverRoom.duration,goalLimit:this.serverRoom.goalLimit,fieldSize:this.serverRoom.fieldSize})}startGame(){if(!this.isHost||!this.serverRoom)return;const e=this.serverRoom.players.filter(o=>o.team!=="spectator"),t=e.filter(o=>o.team==="red"),s=e.filter(o=>o.team==="blue");if(t.length===0||s.length===0){this.triggerLocalEvent("startError","Cada time precisa de pelo menos 1 jogador (ou bot).");return}this.serverRoom.status="playing";const i={to:o=>({emit:(l,c)=>{this.broadcast(l,c)}})};this.serverRoom.match=new PS(this.roomCode,this.serverRoom.duration,this.serverRoom.goalLimit,e,i,o=>{this.serverRoom.status="lobby",this.serverRoom.players.forEach(c=>c.ready=!1),this.serverRoom.match=null,this.serverRoom.chatHistory=[],this.broadcast("matchEnded",o),this.broadcast("lobbyUpdate",this.serverRoom.getLobbyInfo());const l=Ze(et,`multiplayerRooms/${this.roomCode}`);Qn(l,{status:"lobby"})},this.serverRoom.fieldSize),this.broadcast("matchStarted");const r=Ze(et,`multiplayerRooms/${this.roomCode}`);Qn(r,{status:"playing"})}sendGameInput(e){this.emit("gameInput",e)}hostResetMatch(){this.emit("hostResetMatch")}hostSetPaused(e){this.emit("hostSetPaused",{paused:e})}hostAddTime(e){this.emit("hostAddTime",{seconds:e})}hostChangeTeam(e,t){this.emit("hostChangeTeam",{playerId:e,team:t})}onLobbyUpdate(e){this.on("lobbyUpdate",e)}onChat(e){this.on("chatMessage",e)}onMatchStarted(e){this.on("matchStarted",e)}onGameState(e){this.off("gameState"),this.on("gameState",e)}onPlayReplay(e){this.on("playReplay",e)}onMatchEnded(e){this.on("matchEnded",e)}onKicked(e){this.on("kicked",e)}onPublicRoomsList(e){this.on("publicRoomsList",e)}clearListeners(){this.off("lobbyUpdate"),this.off("chatMessage"),this.off("matchStarted"),this.off("gameState"),this.off("playReplay"),this.off("matchEnded"),this.off("kicked"),this.off("publicRoomsList")}listenToPublicRooms(){const e=Ze(et,"multiplayerRooms");Pl(e,t=>{const s=t.val()||{},i=Object.keys(s).map(r=>s[r]).filter(r=>r.status==="lobby");this.triggerLocalEvent("publicRoomsList",i)})}stopListeningToPublicRooms(){const e=Ze(et,"multiplayerRooms");iS(e)}setupPresenceTracking(){this.presenceBound||(this.presenceBound=!0,Nm(wo,e=>{if(e){console.log(`[Presence] Usuário autenticado: ${e.uid}. Monitorando presença...`);const t=Ze(et,".info/connected"),s=Ze(et,`presence/${e.uid}`);Pl(t,r=>{r.val()===!0&&(ra(s,{uid:e.uid,username:e.displayName||"Jogador",timestamp:Date.now()}),eS(s).remove())});const i=Ze(et,"presence");Pl(i,r=>{const o=r.val()||{},l=Object.keys(o).length,c=document.getElementById("online-users-count");c&&(c.textContent=l)})}else{const t=document.getElementById("online-users-count");t&&(t.textContent="...")}}))}}const q=new NS;class DS{constructor(){this.x=$f/2,this.y=Wf/2,this.r=In,this.targetX=$f/2,this.targetY=Wf/2,this.owner=null,this.lastTouch=null}updateState(e){this.targetX=e.x,this.targetY=e.y,this.owner=e.owner,this.lastTouch=e.lastTouch||null}interpolate(e=.35){this.x+=(this.targetX-this.x)*e,this.y+=(this.targetY-this.y)*e}draw(e){e.fillStyle="rgba(0,0,0,.25)",e.beginPath(),e.ellipse(this.x+3,this.y+6,this.r*1.1,this.r*.6,0,0,Math.PI*2),e.fill();const t=e.createRadialGradient(this.x-5,this.y-5,4,this.x,this.y,this.r);t.addColorStop(0,"#ffffff"),t.addColorStop(1,"#bfc8d6"),e.fillStyle=t,e.beginPath(),e.arc(this.x,this.y,this.r,0,Math.PI*2),e.fill()}}class Gf{constructor(e){this.id=e.id,this.name=e.name,this.badge=e.badge,this.team=e.team,this.x=e.x,this.y=e.y,this.r=ct,this.dir=e.dir||0,this.targetX=e.x,this.targetY=e.y,this.targetDir=e.dir||0,this.stamina=e.stamina,this.staminaLock=e.staminaLock,this.stun=e.stun,this.shootHalo=e.shootHalo,this.invuln=e.invuln,this.trail=[]}updateState(e){this.name=e.name,this.badge=e.badge,this.targetX=e.x,this.targetY=e.y,this.targetDir=e.dir,this.stamina=e.stamina,this.staminaLock=e.staminaLock,this.stun=e.stun,this.shootHalo=e.shootHalo,this.invuln=e.invuln,this.staminaLock<=0&&this.invuln>0?(this.trail.push({x:this.x,y:this.y,alpha:.5}),this.trail.length>5&&this.trail.shift()):this.trail.length>0&&this.trail.shift()}interpolate(e=.35){this.x+=(this.targetX-this.x)*e,this.y+=(this.targetY-this.y)*e;let t=this.targetDir-this.dir;t=Math.atan2(Math.sin(t),Math.cos(t)),this.dir+=t*e}draw(e,t){e.save();for(const s of this.trail)e.fillStyle=this.team===we.RED?`rgba(239, 68, 68, ${s.alpha})`:`rgba(96, 165, 250, ${s.alpha})`,e.beginPath(),e.arc(s.x,s.y,this.r-2,0,Math.PI*2),e.fill(),s.alpha-=.1;if(e.restore(),e.fillStyle="rgba(0,0,0,.25)",e.beginPath(),e.ellipse(this.x+4,this.y+8,this.r*1.1,this.r*.6,0,0,Math.PI*2),e.fill(),e.beginPath(),e.arc(this.x,this.y,this.r,0,Math.PI*2),e.fillStyle=this.team===we.RED?"#ef4444":"#3b82f6",e.fill(),e.lineWidth=2,e.strokeStyle="rgba(0,0,0,.45)",e.stroke(),this.shootHalo>0&&(e.strokeStyle="#000000",e.lineWidth=2,e.beginPath(),e.arc(this.x,this.y,this.r+2,0,Math.PI*2),e.stroke()),this.badge){e.fillStyle="#0b1020";const s=bS(this.badge),i=s.length>=2&&!CS(s[0])?14:16;e.font=`700 ${i}px system-ui, "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif`,e.textAlign="center",e.textBaseline="middle",e.fillText(this.badge,this.x,this.y)}this.invuln>0&&(e.strokeStyle="#22c55e",e.setLineDash([4,4]),e.beginPath(),e.arc(this.x,this.y,this.r+4,0,Math.PI*2),e.stroke(),e.setLineDash([])),t===this.id&&(e.fillStyle="rgba(255,255,255,.85)",e.beginPath(),e.moveTo(this.x,this.y-this.r-10),e.lineTo(this.x-6,this.y-this.r-2),e.lineTo(this.x+6,this.y-this.r-2),e.closePath(),e.fill()),this.stun>0&&(e.strokeStyle="#ef4444",e.lineWidth=2,e.beginPath(),e.arc(this.x,this.y,this.r+2,0,Math.PI*2),e.stroke()),this.name&&(e.fillStyle="#e2e8f0",e.font="700 12px system-ui",e.textAlign="center",e.fillText(this.name,this.x,this.y-this.r-14))}}const Kf={currentUser:null,mode:"solo",difficulty:"medium",score:{red:0,blue:0},matchTime:0,goalLimit:3,status:"lobby",countdown:0,activeRoom:null,canvas:null,ctx:null,ball:null,players:[],localPhysicsTick:null,keys:new Map,codes:new Map,replayFrames:[],inReplay:!1,replayFrameIdx:0,replayTimer:0,replayBlob:null,mediaRecorder:null,recordedChunks:[],isRecording:!1,goalsScored:0,assistsGained:0,savesDone:0,async init(n){this.currentUser=n,this.canvas=document.getElementById("match-canvas"),this.canvas&&(this.ctx=this.canvas.getContext("2d",{alpha:!1})),window.addEventListener("keydown",e=>{const s=(e.key||"").toLowerCase();s&&this.keys.set(s,!0),e.code&&this.codes.set(e.code,!0),W.currentScreenId==="match-screen"&&["arrowup","arrowdown","arrowleft","arrowright"," ","enter"].includes(s)&&e.preventDefault()}),window.addEventListener("keyup",e=>{const s=(e.key||"").toLowerCase();s&&this.keys.set(s,!1),e.code&&this.codes.set(e.code,!1)}),window.addEventListener("blur",()=>this.keys.clear()),this.setupViewTriggers(),this.bindDOMEvents();try{q.connect();const e=q.getSocket();e&&e.on("onlineUsersCount",t=>{const s=document.getElementById("online-users-count");s&&(s.textContent=t)})}catch(e){console.warn("[Socket.IO] Failed to connect on startup:",e)}},setupViewTriggers(){const n=document.getElementById("mode-btn-back");n&&(n.onclick=()=>W.show("menu-screen"));const e=document.getElementById("mode-card-solo");e&&(e.onclick=()=>{this.mode="solo",W.show("solo-screen")});const t=document.getElementById("mode-card-multiplayer");t&&(t.onclick=()=>{this.mode="multiplayer",W.show("multiplayer-screen")});const s=document.getElementById("solo-btn-back");s&&(s.onclick=()=>W.show("mode-select-screen"));const i=document.getElementById("multiplayer-btn-back");i&&(i.onclick=()=>W.show("mode-select-screen"));const r=document.getElementById("create-room-btn-back");r&&(r.onclick=()=>W.show("multiplayer-screen"));const o=document.getElementById("join-code-btn-back");o&&(o.onclick=()=>W.show("multiplayer-screen")),W.register("multiplayer-screen",{onEnter:()=>{q.connect(),q.onPublicRoomsList(l=>this.renderRoomsList(l))},onExit:()=>{q.clearListeners()}}),W.register("lobby-screen",{onEnter:()=>{q.onLobbyUpdate(l=>this.updateLobbyView(l)),q.onChat(l=>this.appendChatMessage(l)),q.onMatchStarted(()=>{de("A partida estÃ¡ comeÃ§ando!","success"),W.show("match-screen")}),q.onKicked(()=>{de("VocÃª foi expulso do lobby pelo Host.","error"),W.show("multiplayer-screen")})},onExit:()=>{q.clearListeners()}}),W.register("match-screen",{onEnter:()=>{vt.ensureAudio(),this.startMatchView()},onExit:()=>{this.stopMatchView()}}),W.register("ranking-screen",{onEnter:()=>this.loadRanking("overall")})},bindDOMEvents(){const n=document.querySelectorAll("#solo-ai-difficulty button");n.forEach(j=>{j.onclick=()=>{n.forEach(se=>se.classList.remove("active")),j.classList.add("active"),this.difficulty=j.getAttribute("data-diff")}});const e=document.getElementById("solo-btn-start");e&&(e.onclick=()=>{this.practiceMode=!1,this.goalLimit=parseInt(document.getElementById("solo-goals").value,10),this.matchTime=parseInt(document.getElementById("solo-minutes").value,10)*60,W.show("match-screen")});const t=document.getElementById("solo-btn-practice");t&&(t.onclick=()=>{this.practiceMode=!0,this.goalLimit=0,this.matchTime=24*60*60,W.show("match-screen")});const s=document.getElementById("lobby-btn-leave");s&&(s.onclick=()=>{q.leaveRoom(),W.show("multiplayer-screen")});const i=document.getElementById("lobby-btn-ready");i&&(i.onclick=()=>{q.toggleReady()});const r=document.getElementById("lobby-btn-start");r&&(r.onclick=()=>{q.startGame()});const o=document.getElementById("lobby-btn-join-red");o&&(o.onclick=()=>q.changeTeam("red"));const l=document.getElementById("lobby-btn-join-blue");l&&(l.onclick=()=>q.changeTeam("blue"));const c=document.getElementById("lobby-btn-join-spec");c&&(c.onclick=()=>q.changeTeam("spectator"));const h=document.getElementById("btn-add-bot-red");h&&(h.onclick=()=>q.addBot("red"));const d=document.getElementById("btn-add-bot-blue");d&&(d.onclick=()=>q.addBot("blue"));const m=document.getElementById("btn-copy-code");m&&(m.onclick=()=>{const j=document.getElementById("lobby-room-code").textContent;navigator.clipboard.writeText(j).then(()=>{de("CÃ³digo copiado!","success")})});const p=document.getElementById("lobby-chat-form");p&&(p.onsubmit=j=>{j.preventDefault();const se=document.getElementById("lobby-chat-input"),ue=se.value.trim();ue&&(q.sendChatMessage(ue),se.value="")});const E=document.getElementById("multi-btn-create-room");E&&(E.onclick=()=>W.show("create-room-screen"));const b=document.getElementById("multi-btn-join-code");b&&(b.onclick=()=>W.show("join-code-screen"));const S=document.getElementById("create-room-form");S&&(S.onsubmit=j=>{j.preventDefault();const se=document.getElementById("room-name-input").value,ue=document.getElementById("room-password-input").value,Ne=document.getElementById("room-max-players").value,Ae=document.getElementById("room-duration").value,gt=document.getElementById("room-goals").value,hn=document.getElementById("room-field-size"),ys=hn?hn.value:"medium",Tt=localStorage.getItem("kicker_hax_show_replay")!=="false",ke={uid:this.currentUser.uid,username:lt.profileData.username,badge:lt.profileData.badge||"ðŸ³ï¸"};q.createRoom(se,ue,Ne,Ae,gt,ys,Tt,ke);const Un=q.getSocket();Un&&Un.once("roomCreated",qt=>{de("Lobby criado!","success"),W.show("lobby-screen")})});const P=document.getElementById("join-code-form");P&&(P.onsubmit=j=>{j.preventDefault();const se=document.getElementById("join-code-input").value.toUpperCase(),ue=document.getElementById("join-password-input").value,Ne={uid:this.currentUser.uid,username:lt.profileData.username,badge:lt.profileData.badge||"ðŸ³ï¸"};q.joinRoom(se,ue,Ne);const Ae=q.getSocket();Ae&&(Ae.once("joinSuccess",()=>{de("Entrou no lobby com sucesso!","success"),W.show("lobby-screen")}),Ae.once("joinError",gt=>{de(gt,"error")}))});const F=document.getElementById("match-btn-exit");F&&(F.onclick=()=>{confirm("Deseja realmente sair da partida?")&&(this.localPhysicsTick&&cancelAnimationFrame(this.localPhysicsTick),vt.stopCrowd&&vt.stopCrowd(),this.mode==="multiplayer"?(q.leaveRoom(),W.show("multiplayer-screen")):W.show("solo-screen"))});const U=document.getElementById("btn-skip-replay");U&&(U.onclick=()=>{this.mode==="multiplayer"?q.skipReplay():this.endReplayPlayback()});const O=document.getElementById("btn-save-replay");O&&(O.onclick=()=>{this.downloadReplay()});const G=document.getElementById("game-chat-form");G&&(G.onsubmit=j=>{j.preventDefault();const se=document.getElementById("game-chat-input"),ue=se.value.trim();ue&&this.mode==="multiplayer"&&(q.sendChatMessage(ue),se.value=""),se.blur(),G.classList.remove("active"),this.canvas.focus()});const ae=document.getElementById("rank-filter-wins"),ee=document.getElementById("rank-filter-goals"),T=document.getElementById("rank-filter-shots"),_=document.getElementById("rank-filter-dribbles"),v=document.getElementById("rank-filter-matches"),w=document.getElementById("rank-filter-mvps"),I=document.getElementById("rank-filter-overall");ae&&(ae.onclick=()=>this.loadRanking("wins")),ee&&(ee.onclick=()=>this.loadRanking("goals")),T&&(T.onclick=()=>this.loadRanking("shots")),_&&(_.onclick=()=>this.loadRanking("dribbles")),v&&(v.onclick=()=>this.loadRanking("matches")),w&&(w.onclick=()=>this.loadRanking("mvps")),I&&(I.onclick=()=>this.loadRanking("overall"));const C=document.getElementById("post-btn-continue");C&&(C.onclick=()=>{this.mode==="multiplayer"?W.show("lobby-screen"):W.show("solo-screen")});const y=document.getElementById("ranking-btn-back");y&&(y.onclick=()=>W.show("menu-screen"))},startMatchView(){this.canvas=document.getElementById("match-canvas"),this.ctx=this.canvas.getContext("2d",{alpha:!1}),this.recordedChunks=[],this.isRecording=!1;const n=Qi.dimensions;this.canvas.width=n.w,this.canvas.height=n.h,this.resizeCanvasContainer(),window.addEventListener("resize",()=>this.resizeCanvasContainer()),this.p1PossessionFrames=0,this.cpuPossessionFrames=0,this.totalPossessionFrames=0,this.p1Shots=0,this.p1Tackles=0,this.p1Dribbles=0,this.shotCooldown=0,this.goalsScored=0,this.assistsGained=0,this.savesDone=0,this.score={red:0,blue:0},this.inReplay=!1,document.getElementById("focus-lost-badge");const e=()=>{if(this.mode==="multiplayer"&&this.isHost){const i=q.getSocket();i&&i.emit("hostFocusChanged",{focusLost:!0})}},t=()=>{if(this.mode==="multiplayer"&&this.isHost){const i=q.getSocket();i&&i.emit("hostFocusChanged",{focusLost:!1})}};document.addEventListener("visibilitychange",()=>{document.hidden?e():t()}),window.addEventListener("blur",e),window.addEventListener("focus",t),this.ball=new DS,this.players=[];const s=document.getElementById("game-chat-overlay");s&&s.classList.toggle("hidden",this.mode!=="multiplayer"),this.setupPauseMenu(),window.addEventListener("keydown",i=>{if(W.currentScreenId==="match-screen")if(i.key==="Enter"){const r=document.getElementById("game-chat-form"),o=document.getElementById("game-chat-input");r&&o&&(r.classList.contains("active")||(r.classList.add("active"),o.focus()))}else(i.key==="Escape"||i.key==="p"||i.key==="P")&&this.togglePauseMenu()}),this.mode==="solo"?this.startLocalSoloMatch():this.startOnlineMatch()},resizeCanvasContainer(){if(W.currentScreenId!=="match-screen"||!this.canvas)return;const n=document.querySelector(".match-wrap"),e=document.getElementById("match-stage");if(!n||!e)return;const t=this.canvas.width/this.canvas.height,s=window.innerWidth-80;let r=window.innerHeight-110,o=r*t;if(o>s){const c=s/o;o*=c,r*=c}o=Math.floor(o),r=Math.floor(r);const l=document.getElementById("match-side-left");this.mode==="solo"?(l&&(l.style.display="none"),e.style.gridTemplateColumns=`${o}px 150px`,e.style.width=`${o+150+16}px`):(l&&(l.style.display="flex"),e.style.gridTemplateColumns=`150px ${o}px 150px`,e.style.width=`${o+300+16}px`),e.style.height=`${r}px`,this.canvas.style.width=`${o}px`,this.canvas.style.height=`${r}px`},startLocalSoloMatch(){this.p1Tackles=0,this.p1Dribbles=0,this.p2Tackles=0,this.p2Dribbles=0,this.p1TackleLock=!1,this.p1DribbleLock=!1,this.p2TackleLock=!1,this.p2DribbleLock=!1;const n=lt.profileData.username,e=lt.profileData.badge||"ðŸ‡§ðŸ‡·",t=document.getElementById("solo-field-size"),s=t?t.value:"medium";this.showReplay=!0,s==="small"?(this.canvas.width=896,this.canvas.height=560):s==="large"?(this.canvas.width=1280,this.canvas.height=768):(this.canvas.width=1024,this.canvas.height=640),this.resizeCanvasContainer(),this.currentUser.uid,this.difficulty,this.p1PossessionFrames=0,this.cpuPossessionFrames=0,this.totalPossessionFrames=0,this.p1Shots=0,this.p1Tackles=0,this.p1Dribbles=0,this.shotCooldown=0,this.goalsScored=0,this.assistsGained=0,this.savesDone=0,this.status="countdown",this.countdown=300,this.ball.x=this.canvas.width/2,this.ball.y=this.canvas.height/2;const i={score:{red:0,blue:0},matchTime:this.matchTime,status:"countdown",countdownTimer:300,goalFreezeTimer:0,replayBuffer:[],replayIndex:0};this.localMatchSim=i;const r={id:"cpu",name:"CPU Bot",badge:"âš™ï¸",team:we.RED,cpu:!0,difficulty:this.difficulty,x:D+120,y:this.canvas.height*.5,vx:0,vy:0,r:ct,dir:0,lastMoveDir:0,stamina:1,staminaLock:0,stun:0,slowTimer:0,kickCharge:0,cool:0,tackle_cd:0,dribble_cd:0,dash_time:0,invuln:0,power_cd:0,tackleFreeze:0,tackleSuccess:!1,tackleEval:0,shootHalo:0,aiShootLock:0,aiFeintLock:0},o={id:"p1",name:n,badge:e,team:we.BLUE,cpu:!1,x:this.canvas.width-D-120,y:this.canvas.height*.5,vx:0,vy:0,r:ct,dir:0,lastMoveDir:0,stamina:1,staminaLock:0,stun:0,slowTimer:0,kickCharge:0,cool:0,tackle_cd:0,dribble_cd:0,dash_time:0,invuln:0,power_cd:0,tackleFreeze:0,tackleSuccess:!1,tackleEval:0,shootHalo:0},l=this.practiceMode?[o]:[r,o];this.players=l.map(h=>new Gf(h));const c={x:this.canvas.width/2,y:this.canvas.height/2,vx:0,vy:0,r:In,owner:null,lastTouch:null,strikeTimer:0,lastStrikeType:null,noPickupFrames:0,noPickupFrom:null};this.localBallSim=c,(()=>{const h=ot;let d=[],m=performance.now();const p=1e3/60;let E=0;const b=F=>{var U;if(W.currentScreenId==="match-screen"){try{typeof F!="number"&&(F=performance.now());let O=F-m;O>100&&(O=100),m=F,E+=O;const G=this.canvas.width,ae=this.canvas.height,ee=(ae-at)/2,T=(ae+at)/2,_=D-Re,v=G-D+Re,w=_-St,I=v+St,C=10;let y={x:0,y:0,shoot:!1,sprint:!1,dribble:!1,tackle:!1,power:!1};for(;E>=p;){if(d=[],!this.isPaused){if(i.status==="countdown")i.countdownTimer--,i.countdownTimer<=0&&(i.status="playing");else if(i.status==="freeze")i.goalFreezeTimer--,i.goalFreezeTimer<=0&&(this.inReplay=!0,this.replayFrames=[...i.replayBuffer],this.replayFrameIdx=0,this.replayTimer=0,(U=document.getElementById("replay-overlay"))==null||U.classList.remove("hidden"),i.status="replay",i.countdownTimer=Ls*2*3+5,this.startLocalReplayRecording());else if(i.status==="replay")i.countdownTimer--,i.countdownTimer<=0&&(this.endReplayPlayback(),(i.score.red>=this.goalLimit||i.score.blue>=this.goalLimit)&&this.goalLimit>0?(i.status="ended",this.localMatchEnd(i.score)):(i.status="countdown",i.countdownTimer=300,S()));else if(i.status==="playing"){i.matchTime-=1/60,i.matchTime<=0&&(i.matchTime=0,i.status="ended",this.localMatchEnd(i.score)),y={x:0,y:0,shoot:!1,sprint:!1,dribble:!1,tackle:!1,power:!1};const ie=Qi.CTRL_P1;this.keys.get(ie.up)&&(y.y-=1),this.keys.get(ie.down)&&(y.y+=1),this.keys.get(ie.left)&&(y.x-=1),this.keys.get(ie.right)&&(y.x+=1),ie.sprint.startsWith("Shift")?y.sprint=this.codes.get(ie.sprint):y.sprint=this.keys.get(ie.sprint),y.shoot=this.keys.get(ie.shoot),y.dribble=this.keys.get(ie.dribble),y.tackle=this.keys.get(ie.tackle),y.power=this.keys.get(ie.power);let Le={x:0,y:0,shoot:!1,sprint:!1,dribble:!1,tackle:!1,power:!1};if(!this.practiceMode&&r.stun<=0){const x={x:c.x,y:c.y};if(!c.owner){let It=c.vx,zt=c.vy;for(let ui=0;ui<10;ui++)It*=Xs,zt*=Xs,x.x+=It,x.y+=zt}const Ie=Math.hypot(x.x-r.x,x.y-r.y);let pe=x.x,qe=x.y;const jn=c.x<G/2;if(c.owner==="cpu"){pe=v;const It=Math.hypot(o.x-r.x,o.y-r.y);this.difficulty!=="easy"&&It<120?(qe=o.y>r.y?r.y-80:r.y+80,this.difficulty==="hard"&&r.dribble_cd<=0&&(Le.dribble=!0)):qe=h.clamp(r.y,ee+20,T-20)}else if(c.owner==="p1")if(Math.hypot(o.x-r.x,o.y-r.y)>200){const zt=D;pe=zt+(o.x-zt)*.7,qe=ae*.5+(o.y-ae*.5)*.7}else pe=o.x,qe=o.y;else jn&&Ie>260&&this.difficulty!=="easy"?(pe=D+50,qe=h.clamp(x.y,ee+10,T-10)):(pe=x.x,qe=x.y);let un=pe-r.x,ci=qe-r.y,Fr=Math.hypot(un,ci)||1,Br=un/Fr,hi=ci/Fr,dn=1,xt=0;this.difficulty==="easy"?(dn=.72,xt=.25):this.difficulty==="medium"&&(dn=.88,xt=.12),xt>0&&Math.random()<.05&&(Br+=h.rnd(-xt,xt),hi+=h.rnd(-xt,xt)),Le.x=Br*dn,Le.y=hi*dn;const Wa=c.owner==="cpu"&&Math.abs(v-r.x)>200||!c.owner&&Ie>120;if(Le.sprint=Wa&&r.staminaLock<=0&&r.stamina>.3,c.owner==="cpu"){const It=Math.abs(v-r.x);(It<100||It<160&&r.y>ee&&r.y<T)&&(Le.shoot=!0)}else c.owner==="p1"&&Ie<aa&&r.tackle_cd<=0&&this.difficulty!=="easy"&&(Le.tackle=!0)}const Vr=(x,Ie)=>{if(!(x.stun>0)){if(Ie.tackle&&x.tackle_cd<=0&&x.stamina>=Yi){x.stamina=Math.max(0,x.stamina-Yi),x.tackle_cd=M_,x.tackleSuccess=!1,x.tackleEval=12,x.slowTimer=O_,x.tackleFreeze=8,d.push("tackle");const pe=x.id==="p1"?r:o,qe=c.owner===pe.id?Math.atan2(pe.y-x.y,pe.x-x.x):x.dir;x.vx+=Math.cos(qe)*la,x.vy+=Math.sin(qe)*la,c.owner===pe.id&&pe.invuln<=0&&Math.hypot(pe.x-x.x,pe.y-x.y)<=aa&&(c.owner=x.id,c.lastTouch=x.id,c.noPickupFrames=10,c.noPickupFrom=null,c.vx=0,c.vy=0,pe.stun=Math.max(pe.stun,L_),pe.vx=0,pe.vy=0,x.tackleSuccess=!0)}if(Ie.dribble&&x.dribble_cd<=0&&c.owner===x.id&&x.stamina>=Xi&&(x.stamina=Math.max(0,x.stamina-Xi),x.dash_time=V_,x.invuln=B_,x.dribble_cd=F_,x.vx+=Math.cos(x.dir)*ca,x.vy+=Math.sin(x.dir)*ca,d.push("dribble")),Ie.power&&x.power_cd<=0&&x.stamina>=.5&&(c.owner===x.id||Math.hypot(x.x-c.x,x.y-c.y)<x.r+c.r+8)){x.id==="p1"&&(this.p1Shots=(this.p1Shots||0)+1),x.stamina=Math.max(0,x.stamina-.5),x.stamina===0&&(x.staminaLock=Kh),x.power_cd=j_,x.cool=12,x.shootHalo=22;const pe=Ie.x||Ie.y?Math.atan2(Ie.y,Ie.x):x.dir;h.powerKick(x,c,pe,U_),d.push("power")}if(x.kickCharge>0&&!Ie.shoot){if(c.owner===x.id||Math.hypot(x.x-c.x,x.y-c.y)<x.r+c.r+14){const qe=h.clamp(x.kickCharge,0,1);x.cool=14,x.shootHalo=18;const jn=Ie.x||Ie.y?Math.atan2(Ie.y,Ie.x):x.dir,un=Math.max(oa,oa+x_*qe);x.id==="p1"&&(this.p1Shots=(this.p1Shots||0)+1),h.kickBall(x,c,jn,un),d.push("kick")}x.kickCharge=0}}};Vr(o,y),this.practiceMode||Vr(r,Le),h.updatePlayerPhysics(o,y,c,x=>d.push(x)),this.practiceMode||h.updatePlayerPhysics(r,Le,c,x=>d.push(x)),h.applyLimits(o,ee,T,w,I,_,v,C,G,ae),this.practiceMode||h.applyLimits(r,ee,T,w,I,_,v,C,G,ae),h.resolvePlayerPlayer(l),h.resolvePlayerBall(l,c,()=>{for(const x of l)x.tackleEval>0&&c.owner===x.id&&(x.tackleSuccess=!0)}),h.updateBallPhysics(c,ee,T,w,I,_,v,C,l,x=>d.push(x),x=>{x==="blue"?i.score.blue++:i.score.red++;const Ie=c.lastTouch==="p1"?n:"CPU Bot",pe=x==="blue"&&c.lastTouch==="cpu"||x==="red"&&c.lastTouch==="p1";this.lastGoal={side:x,scorerName:Ie,ownGoal:pe},d.push("whistle"),d.push("goal"),d.push("cheer"),this.showReplay?(i.status="freeze",i.goalFreezeTimer=Ls):(i.score.red>=this.goalLimit||i.score.blue>=this.goalLimit)&&this.goalLimit>0?(i.status="ended",this.localMatchEnd(i.score)):(i.status="countdown",i.countdownTimer=300,S())},G,ae)}P()}E-=p}this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height),this.drawFieldGrid(this.ctx),this.inReplay?this.playbackReplay():(d.forEach(ie=>vt.play(ie)),this.ball.x=c.x,this.ball.y=c.y,this.ball.owner=c.owner,this.ball.draw(this.ctx),this.players.forEach(ie=>{const Le=ie.id==="p1"?o:r;ie.x=Le.x,ie.y=Le.y,ie.dir=Le.dir,ie.stamina=Le.stamina,ie.staminaLock=Le.staminaLock,ie.stun=Le.stun,ie.shootHalo=Le.shootHalo,ie.invuln=Le.invuln,ie.draw(this.ctx,c.owner)})),this.drawNetOverlay(this.ctx);const j=Math.floor(i.matchTime/60),se=Math.floor(i.matchTime%60),ue=document.getElementById("match-clock"),Ne=document.getElementById("match-score");ue&&(ue.textContent=`${String(j).padStart(2,"0")}:${String(se).padStart(2,"0")}`),Ne&&(Ne.textContent=`${i.score.red} : ${i.score.blue}`);const Ae=document.getElementById("right-stam-fill"),gt=document.getElementById("right-pow-fill"),hn=document.getElementById("left-stam-fill"),ys=document.getElementById("left-pow-fill");Ae&&(Ae.style.height=`${o.stamina*100}%`),gt&&(gt.style.height=`${o.kickCharge*100}%`),hn&&(hn.style.height=`${r.stamina*100}%`),ys&&(ys.style.height=`${r.kickCharge*100}%`),c.owner==="p1"?this.p1PossessionFrames=(this.p1PossessionFrames||0)+1:c.owner==="cpu"?this.cpuPossessionFrames=(this.cpuPossessionFrames||0)+1:c.lastTouch==="p1"?this.p1PossessionFrames=(this.p1PossessionFrames||0)+1:c.lastTouch==="cpu"&&(this.cpuPossessionFrames=(this.cpuPossessionFrames||0)+1),this.totalPossessionFrames=(this.totalPossessionFrames||0)+1;const Tt=Math.round((this.p1PossessionFrames||0)/(this.totalPossessionFrames||1)*100);o.tackle_cd>0&&!this.p1TackleLock?(this.p1Tackles=(this.p1Tackles||0)+1,this.p1TackleLock=!0):o.tackle_cd===0&&(this.p1TackleLock=!1),o.dribble_cd>0&&!this.p1DribbleLock?(this.p1Dribbles=(this.p1Dribbles||0)+1,this.p1DribbleLock=!0):o.dribble_cd===0&&(this.p1DribbleLock=!1);const ke=document.getElementById("right-stat-possession"),Un=document.getElementById("right-stat-shots"),qt=document.getElementById("right-stat-tackles"),Or=document.getElementById("right-stat-dribbles");if(ke&&(ke.textContent=`${Tt}%`),Un&&(Un.textContent=this.p1Shots||0),qt&&(qt.textContent=this.p1Tackles||0),Or&&(Or.textContent=this.p1Dribbles||0),i.status==="countdown"){const ie=Math.max(0,Math.ceil(i.countdownTimer/60));this.drawCenterBanner(`ComeÃ§a em ${ie}...`,"Prepare-se!")}else if(i.status==="freeze"){const ie=this.lastGoal&&this.lastGoal.ownGoal?`GOL CONTRA de ${this.lastGoal.scorerName}`:`GOL DE ${this.lastGoal&&this.lastGoal.scorerName||"???"}!`;this.drawCenterBanner(ie,"Revisando jogada...")}}catch(O){console.error("[Kicker Solo] Tick error:",O)}i.status!=="ended"&&(this.localPhysicsTick=requestAnimationFrame(b))}},S=()=>{const F=(Math.random()-.5)*20,U=(Math.random()-.5)*20;o.x=this.canvas.width-D-120+F,o.y=this.canvas.height*.5+U,o.vx=o.vy=0,o.kickCharge=0,o.stamina=1,o.staminaLock=0,o.stun=0;const O=(Math.random()-.5)*20,G=(Math.random()-.5)*20;r.x=D+120+O,r.y=this.canvas.height*.5+G,r.vx=r.vy=0,r.kickCharge=0,r.stamina=1,r.staminaLock=0,r.stun=0,c.x=this.canvas.width/2,c.y=this.canvas.height/2,c.vx=c.vy=0,c.owner=null,c.lastTouch=null},P=()=>{const F=l.map(O=>({x:O.x,y:O.y,dir:O.dir,team:O.team,has:c.owner===O.id,name:O.id==="p1"?n:"CPU Bot",badge:O.id==="p1"?e:"âš™ï¸",inv:O.invuln||0,stun:O.stun||0,halo:O.shootHalo||0})),U={ball:{x:c.x,y:c.y},players:F,score:{...i.score},sfx:[...d]};i.replayBuffer.push(U),i.replayBuffer.length>Ls*2&&i.replayBuffer.shift()};S(),this.localPhysicsTick=requestAnimationFrame(b)})()},localMatchEnd(n){cancelAnimationFrame(this.localPhysicsTick),this.stopLocalReplayRecording(),vt.stopCrowd(),de("Fim de jogo!","info");const e=n.red===n.blue?"Empate":n.blue>n.red?"Vitoria":"Derrota";document.getElementById("post-result-title").textContent=e,document.getElementById("post-score-red").textContent=n.red,document.getElementById("post-score-blue").textContent=n.blue,document.getElementById("post-mvp").textContent=n.blue>=n.red?lt.profileData.username:"CPU Bot",document.getElementById("post-xp-gained").textContent="+0 XP (Modo Treino)",W.show("post-game-screen")},showOnlineMatchEnd(n){var E,b;de("Partida finalizada!","info"),this.stopLocalReplayRecording();const e=(n==null?void 0:n.score)||n||{red:0,blue:0},t=q.getSocket().id,s=this.players.find(S=>S.id===t),i=!s||s.team==="spectator",r=(n==null?void 0:n.winnerTeam)||(e.red===e.blue?"draw":e.blue>e.red?we.BLUE:we.RED),o=r==="draw",l=!i&&s.team===r&&!o,c=!i&&s.team!==r&&!o,h=((E=n==null?void 0:n.playerStats)==null?void 0:E.find(S=>S.playerId===t))||{},d=!!(n!=null&&n.mvp)&&n.mvp.playerId===t,m=i?0:l?80:o?30:15;!i&&!(n!=null&&n.hasBots)&&mt.saveMatchResult(this.currentUser.uid,l,c,o,h.goals||0,h.shots||this.p1Shots||0,h.dribbles||this.p1Dribbles||0,h.ownGoals||0,d,m).then(()=>{const S={mode:"multiplayer",date:new Date().toISOString(),playerUids:[this.currentUser.uid],playerTeams:{[this.currentUser.uid]:s.team},winner:r,scoreRed:e.red,scoreBlue:e.blue};return mt.addMatchToHistory(S)}).catch(S=>console.warn("[Kicker Stats] Falha ao salvar resultado:",S));const p=o?"Empate":`Vitoria do Time ${r===we.BLUE?"Azul":"Vermelho"}`;document.getElementById("post-result-title").textContent=p,document.getElementById("post-score-red").textContent=e.red,document.getElementById("post-score-blue").textContent=e.blue,document.getElementById("post-mvp").textContent=((b=n==null?void 0:n.mvp)==null?void 0:b.username)||(r===we.BLUE?"Time Azul":r===we.RED?"Time Vermelho":"Empate"),document.getElementById("post-xp-gained").textContent=i?"Espectador":n!=null&&n.hasBots?"+0 XP (com bot)":`+${m} XP`,W.show("post-game-screen")},startOnlineMatch(){this.p1Tackles=0,this.p1Dribbles=0,this.p2Tackles=0,this.p2Dribbles=0,this.p1TackleLock=!1,this.p1DribbleLock=!1,this.p2TackleLock=!1,this.p2DribbleLock=!1;const n=q.getSocket();n&&(n.off("fieldSizeUpdated"),n.off("matchReset")),this.status="countdown",this.countdown=300,this.fieldSize==="small"?(this.canvas.width=896,this.canvas.height=560):this.fieldSize==="large"?(this.canvas.width=1280,this.canvas.height=768):(this.canvas.width=1024,this.canvas.height=640),this.resizeCanvasContainer(),q.onGameState(t=>{this.status=t.status,this.countdown=t.countdown,this.score=t.score,this.matchTime=t.matchTime,t.soundEffects.forEach(r=>vt.play(r));const s=document.getElementById("focus-lost-badge");s&&(t.isHostPaused?(s.textContent="â¸ï¸ Pausado (Dono da sala fora da aba)",s.classList.remove("hidden")):s.classList.add("hidden")),this.ball.updateState(t.ball),t.players.forEach(r=>{let o=this.players.find(l=>l.id===r.id);o||(o=new Gf(r),this.players.push(o)),o.updateState(r)});const i=t.players.map(r=>r.id);this.players=this.players.filter(r=>i.includes(r.id))}),q.getSocket().on("fieldSizeUpdated",({size:t})=>{this.fieldSize=t,t==="small"?(this.canvas.width=896,this.canvas.height=560):t==="large"?(this.canvas.width=1280,this.canvas.height=768):(this.canvas.width=1024,this.canvas.height=640),this.resizeCanvasContainer(),de("O Host alterou o tamanho do campo!","info")}),q.getSocket().on("matchReset",()=>{de("A partida foi reiniciada pelo Host!","info"),this.p1Tackles=0,this.p1Dribbles=0,this.p2Tackles=0,this.p2Dribbles=0}),q.onPlayReplay(({replayFrames:t,goalInfo:s})=>{var i;if(!t||t.length===0){this.lastGoal=s,this.endReplayPlayback();return}this.inReplay=!0,this.replayFrames=t,this.replayFrameIdx=0,this.replayTimer=0,this.lastGoal=s,(i=document.getElementById("replay-overlay"))==null||i.classList.remove("hidden"),this.startLocalReplayRecording()}),q.onMatchEnded(t=>{if(this.inReplay){this.pendingMatchResult=t;return}this.showOnlineMatchEnd(t)});const e=()=>{if(W.currentScreenId!=="match-screen")return;let t={x:0,y:0,shoot:!1,sprint:!1,dribble:!1,tackle:!1,power:!1};const s=Qi.CTRL_P1;this.keys.get(s.up)&&(t.y-=1),this.keys.get(s.down)&&(t.y+=1),this.keys.get(s.left)&&(t.x-=1),this.keys.get(s.right)&&(t.x+=1),s.sprint.startsWith("Shift")?t.sprint=this.codes.get(s.sprint):t.sprint=this.keys.get(s.sprint),t.shoot=this.keys.get(s.shoot),t.dribble=this.keys.get(s.dribble),t.tackle=this.keys.get(s.tackle),t.power=this.keys.get(s.power),q.sendGameInput(t),this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height),this.drawFieldGrid(this.ctx),this.inReplay?this.playbackReplay():(this.ball.interpolate(.35),this.ball.draw(this.ctx),this.players.forEach(m=>{m.interpolate(.35),m.draw(this.ctx,this.ball.owner)})),this.drawNetOverlay(this.ctx);const i=Math.floor(this.matchTime/60),r=Math.floor(this.matchTime%60),o=document.getElementById("match-clock"),l=document.getElementById("match-score");o&&(o.textContent=`${String(i).padStart(2,"0")}:${String(r).padStart(2,"0")}`),l&&(l.textContent=`${this.score.red} : ${this.score.blue}`);const c=q.getSocket().id,h=this.players.find(m=>m.id===c),d=this.players.find(m=>m.id!==c&&m.team!=="spectator");if(h){const m=document.getElementById("right-stam-fill"),p=document.getElementById("right-pow-fill");m&&(m.style.height=`${h.stamina*100}%`);let E=0;t.shoot&&(E=1),p&&(p.style.height=`${E*100}%`),d&&(this.ball.owner===h.id?this.p1PossessionFrames=(this.p1PossessionFrames||0)+1:this.ball.owner===d.id?this.cpuPossessionFrames=(this.cpuPossessionFrames||0)+1:this.ball.lastTouch===h.id?this.p1PossessionFrames=(this.p1PossessionFrames||0)+1:this.ball.lastTouch===d.id&&(this.cpuPossessionFrames=(this.cpuPossessionFrames||0)+1),this.totalPossessionFrames=(this.totalPossessionFrames||0)+1);const b=Math.round((this.p1PossessionFrames||0)/(this.totalPossessionFrames||1)*100);if(this.shotCooldown>0&&this.shotCooldown--,Math.hypot(h.x-this.ball.x,h.y-this.ball.y)<ct+In+12&&t.shoot&&!this.shotCooldown){const G=Math.atan2(this.ball.y-h.y,this.ball.x-h.x),ae=h.team===we.BLUE;(ae&&Math.cos(G)>.2||!ae&&Math.cos(G)<-.2)&&(this.p1Shots=(this.p1Shots||0)+1,this.shotCooldown=30)}h.tackle_cd>0&&!this.p1TackleLock?(this.p1Tackles=(this.p1Tackles||0)+1,this.p1TackleLock=!0):h.tackle_cd===0&&(this.p1TackleLock=!1),h.dribble_cd>0&&!this.p1DribbleLock?(this.p1Dribbles=(this.p1Dribbles||0)+1,this.p1DribbleLock=!0):h.dribble_cd===0&&(this.p1DribbleLock=!1);const P=document.getElementById("right-stat-possession"),F=document.getElementById("right-stat-shots"),U=document.getElementById("right-stat-tackles"),O=document.getElementById("right-stat-dribbles");P&&(P.textContent=`${b}%`),F&&(F.textContent=this.p1Shots||0),U&&(U.textContent=this.p1Tackles||0),O&&(O.textContent=this.p1Dribbles||0)}if(d){const m=document.getElementById("left-stam-fill"),p=document.getElementById("left-pow-fill");m&&(m.style.height=`${d.stamina*100}%`),p&&(p.style.height=`${(d.kickCharge||0)*100}%`)}if(this.status==="countdown")this.drawCenterBanner(`ComeÃ§a em ${this.countdown}...`,"Prepare-se!");else if(this.status==="freeze"){const m=this.lastGoal.ownGoal?`GOL CONTRA de ${this.lastGoal.scorerName}`:`GOL DE ${this.lastGoal.scorerName}!`;this.drawCenterBanner(m,"Revisando jogada...",!0)}this.localPhysicsTick=requestAnimationFrame(e)};this.localPhysicsTick=requestAnimationFrame(e)},stopMatchView(){var n;cancelAnimationFrame(this.localPhysicsTick),this.stopLocalReplayRecording(),vt.stopCrowd(),q.clearListeners(),(n=document.getElementById("replay-overlay"))==null||n.classList.add("hidden"),window.removeEventListener("resize",()=>this.resizeCanvasContainer())},startLocalReplayRecording(){if(!(!this.canvas||this.isRecording))try{const n=this.canvas.captureStream(30),e=vt.getRecordingStreamDestination();e&&e.stream.getAudioTracks().forEach(s=>n.addTrack(s)),this.recordedChunks=[],this.mediaRecorder=new MediaRecorder(n,{mimeType:"video/webm;codecs=vp9,opus"}),this.mediaRecorder.ondataavailable=t=>{t.data&&t.data.size>0&&this.recordedChunks.push(t.data)},this.mediaRecorder.onstop=()=>{this.replayBlob=new Blob(this.recordedChunks,{type:"video/webm"}),this.isRecording=!1;const t=document.getElementById("btn-save-replay");t&&(t.style.display="inline-block")},this.mediaRecorder.start(),this.isRecording=!0}catch(n){console.warn("Replay recording not supported on this browser.",n)}},stopLocalReplayRecording(){if(this.mediaRecorder&&this.isRecording)try{this.mediaRecorder.stop()}catch{}},downloadReplay(){if(!this.replayBlob)return;const n=URL.createObjectURL(this.replayBlob),e=document.createElement("a");e.href=n,e.download=`KickerHax-Replay-${Date.now()}.webm`,document.body.appendChild(e),e.click(),document.body.removeChild(e),URL.revokeObjectURL(n),de("Replay baixado com sucesso!","success")},playbackReplay(){if(this.replayFrames.length===0)return;if(this.replayTimer++,this.replayTimer%3===0&&(this.replayFrameIdx++,this.replayFrameIdx>=this.replayFrames.length)){this.endReplayPlayback(),this.mode==="solo"&&this.localMatchSim&&(this.localMatchSim.countdownTimer=0);return}const n=this.replayFrames[Math.min(this.replayFrameIdx,this.replayFrames.length-1)];if(!n)return;this.replayTimer%3===0&&n.sfx.forEach(t=>vt.play(t)),xS(this.ctx,n.ball.x,n.ball.y),n.players.forEach(t=>{MS(this.ctx,t.x,t.y,t.team,t.name,t.badge,t.halo,t.inv,t.stun,t.has)});const e=document.getElementById("replay-caption");if(e&&this.lastGoal){const t=this.lastGoal.ownGoal?`GOL CONTRA de ${this.lastGoal.scorerName}`:`GOL DE ${this.lastGoal.scorerName}!`;e.textContent=t,e.style.display="block"}},endReplayPlayback(){var e;this.inReplay=!1,this.stopLocalReplayRecording(),(e=document.getElementById("replay-overlay"))==null||e.classList.add("hidden");const n=document.getElementById("replay-caption");if(n&&(n.style.display="none"),vt.ensureAudio(),this.pendingMatchResult){const t=this.pendingMatchResult;this.pendingMatchResult=null,this.showOnlineMatchEnd(t)}},drawSpeedPad(n,e,t,s){n.save(),n.shadowColor="#00f0ff",n.shadowBlur=s?16:8,n.fillStyle=s?"rgba(0, 240, 255, 0.45)":"rgba(0, 240, 255, 0.18)",n.strokeStyle="#00f0ff",n.lineWidth=2.5,n.beginPath(),n.arc(e,t,32,0,Math.PI*2),n.fill(),n.stroke(),n.fillStyle="#00f0ff",n.beginPath(),e<this.canvas.width/2?(n.moveTo(e-6,t+6),n.lineTo(e+10,t-10),n.lineTo(e+2,t-10),n.lineTo(e+10,t-10),n.lineTo(e+10,t-2)):(n.moveTo(e+6,t-6),n.lineTo(e-10,t+10),n.lineTo(e-2,t+10),n.lineTo(e-10,t+10),n.lineTo(e-10,t+2)),n.strokeStyle="#00f0ff",n.lineWidth=3,n.stroke(),n.restore()},drawFieldGrid(n){const e=this.canvas.width,t=this.canvas.height,s=(t-at)/2;n.fillStyle="#1e293b",n.fillRect(0,0,e,t),n.strokeStyle="#334155",n.lineWidth=2;for(let d=4;d<D-8;d+=6)n.strokeRect(d,d,e-d*2,t-d*2);n.save();let i=12345;const r=()=>{let d=Math.sin(i++)*1e4;return d-Math.floor(d)};for(let d=8;d<e-8;d+=12)for(let m=8;m<t-8;m+=12){const p=d<D-8||d>e-D+8,E=m<D-8||m>t-D+8;if((p||E)&&r()<.35){const b=["#ef4444","#3b82f6","#10b981","#f59e0b","#ec4899","#94a3b8"];n.fillStyle=b[Math.floor(r()*b.length)],n.beginPath(),n.arc(d,m,2.5,0,Math.PI*2),n.fill()}}n.restore(),n.fillStyle="#2e7d32",n.fillRect(D-8,D-8,e-2*D+16,t-2*D+16);const o=14,l=(e-2*D+16)/o;n.fillStyle="#388e3c";for(let d=0;d<o;d+=2)n.fillRect(D-8+d*l,D-8,l,t-2*D+16);n.save(),n.strokeStyle="#ffffff",n.lineWidth=3,n.strokeRect(D,D,e-2*D,t-2*D),n.beginPath(),n.moveTo(e/2,D),n.lineTo(e/2,t-D),n.stroke(),n.beginPath(),n.arc(e/2,t/2,72,0,Math.PI*2),n.stroke(),n.beginPath(),n.arc(e/2,t/2,4,0,Math.PI*2),n.fillStyle="#ffffff",n.fill(),n.strokeRect(D,(t-260)/2,140,260),n.strokeRect(D,(t-110)/2,50,110),n.beginPath(),n.arc(D+100,t/2,3,0,Math.PI*2),n.fill(),n.strokeRect(e-D-140,(t-260)/2,140,260),n.strokeRect(e-D-50,(t-110)/2,50,110),n.beginPath(),n.arc(e-D-100,t/2,3,0,Math.PI*2),n.fill();const c=12;n.lineWidth=2,n.beginPath(),n.arc(D,D,c,0,Math.PI*.5),n.stroke(),n.beginPath(),n.arc(D,t-D,c,-Math.PI*.5,0),n.stroke(),n.beginPath(),n.arc(e-D,D,c,Math.PI*.5,Math.PI),n.stroke(),n.beginPath(),n.arc(e-D,t-D,c,Math.PI,-Math.PI*.5),n.stroke(),n.restore();const h=(d,m,p)=>{n.save(),n.translate(d,m),n.rotate(p),n.strokeStyle="#fbbf24",n.lineWidth=2,n.beginPath(),n.moveTo(0,0),n.lineTo(-6,-6),n.stroke(),n.fillStyle="#ef4444",n.beginPath(),n.moveTo(-6,-6),n.lineTo(-12,-4),n.lineTo(-8,-10),n.closePath(),n.fill(),n.restore()};h(D,D,0),h(D,t-D,-Math.PI*.5),h(e-D,D,Math.PI*.5),h(e-D,t-D,Math.PI),n.fillStyle="#0f172a",n.fillRect(D-Re,s,Re,at),n.fillRect(e-D,s,Re,at),n.fillStyle="rgba(255, 255, 255, 0.04)",n.fillRect(D-Re-St,s,St,at),n.fillRect(e-D+Re,s,St,at)},drawNetOverlay(n){const e=this.canvas.width,t=this.canvas.height,s=(t-at)/2,i=(t+at)/2;n.fillStyle="#0f172a",n.fillRect(D-Re,s,Re,at),n.fillRect(e-D,s,Re,at),n.save(),n.strokeStyle="rgba(255,255,255,.18)",n.lineWidth=1,n.beginPath();for(let r=D-Re-St;r<=D-Re;r+=10)n.moveTo(r,s),n.lineTo(r,i);for(let r=s;r<=i;r+=10)n.moveTo(D-Re-St,r),n.lineTo(D-Re,r);for(let r=e-D+Re;r<=e-D+Re+St;r+=10)n.moveTo(r,s),n.lineTo(r,i);for(let r=s;r<=i;r+=10)n.moveTo(e-D+Re,r),n.lineTo(e-D+Re+St,r);n.stroke(),n.restore()},drawCenterBanner(n,e,t=!1){const s=this.canvas.width,i=this.canvas.height;this.ctx.save(),this.ctx.globalAlpha=.95;const r=640,o=140,l=s/2-r/2,c=i*.25;if(t){const h=this.ctx.createLinearGradient(l,c,l+r,c);h.addColorStop(0,"rgba(245, 158, 11, 0.95)"),h.addColorStop(.5,"rgba(239, 68, 68, 0.95)"),h.addColorStop(1,"rgba(245, 158, 11, 0.95)"),this.ctx.fillStyle=h,this.ctx.fillRect(l,c,r,o),this.ctx.strokeStyle="#ffffff",this.ctx.lineWidth=3,this.ctx.strokeRect(l+.5,c+.5,r-1,o-1);const d=1+Math.sin(Date.now()/150)*.05;this.ctx.translate(s/2,c+45),this.ctx.scale(d,d),this.ctx.fillStyle="#ffffff",this.ctx.font="900 32px Outfit",this.ctx.textAlign="center",this.ctx.textBaseline="middle",this.ctx.shadowColor="rgba(0,0,0,0.5)",this.ctx.shadowBlur=10,this.ctx.fillText(n,0,0),this.ctx.restore(),this.ctx.save(),this.ctx.globalAlpha=.95,this.ctx.fillStyle="#ffffff",this.ctx.font="700 16px Inter",this.ctx.textAlign="center",this.ctx.textBaseline="middle",this.ctx.fillText(e,s/2,c+95),this.ctx.restore()}else this.ctx.fillStyle="rgba(7, 11, 25, 0.9)",this.ctx.fillRect(l,c,r,o),this.ctx.strokeStyle="rgba(255, 255, 255, 0.12)",this.ctx.strokeRect(l+.5,c+.5,r-1,o-1),this.ctx.fillStyle="#e2e8f0",this.ctx.font="800 24px Outfit",this.ctx.textAlign="center",this.ctx.textBaseline="middle",this.ctx.fillText(n,s/2,c+50),this.ctx.font="600 15px Inter",this.ctx.fillStyle="#60a5fa",this.ctx.fillText(e,s/2,c+90),this.ctx.restore()},renderRoomsList(n){const e=document.getElementById("rooms-list-body");if(e){if(n=n.filter(t=>t.status==="lobby"),n.length===0){e.innerHTML='<tr><td colspan="6" class="text-center">Nenhuma sala criada no momento. Seja o primeiro!</td></tr>';return}e.innerHTML="",n.forEach(t=>{const s=document.createElement("tr"),i=t.hasPassword||t.password?"Senha":"Publica";s.innerHTML=`
        <td><strong>${t.name}</strong></td>
        <td>${t.playersCount}/${t.maxPlayers}</td>
        <td>${t.duration} min</td>
        <td>${t.goalLimit} gols</td>
        <td>${i}</td>
        <td><button class="btn btn-secondary btn-sm" id="join-btn-${t.code}">Entrar</button></td>
      `,e.appendChild(s);const r=document.getElementById(`join-btn-${t.code}`);r&&(r.onclick=()=>{if(t.hasPassword||t.password){const o=prompt("Digite a senha da sala:");o!==null&&this.joinRoomWithCode(t.code,o)}else this.joinRoomWithCode(t.code,"")})})}},joinRoomWithCode(n,e){const t={uid:this.currentUser.uid,username:lt.profileData.username,badge:lt.profileData.badge||"ðŸ³ï¸"};q.joinRoom(n,e,t),q.getSocket().once("joinSuccess",()=>{de("Entrou na sala!","success"),W.show("lobby-screen")}),q.getSocket().once("joinError",s=>{de(s,"error")})},updateLobbyView(n){if(!n)return;this.activeRoom=n,this.fieldSize=n.fieldSize||"medium",this.showReplay=n.showReplay!==void 0?n.showReplay:!0,document.getElementById("lobby-room-name").textContent=n.name,document.getElementById("lobby-room-code").textContent=n.code,document.getElementById("lobby-setting-time").textContent=`${n.duration}m`,document.getElementById("lobby-setting-goals").textContent=n.goalLimit===0?"Sem Limite":n.goalLimit;const e={small:"Pequeno",medium:"MÃ©dio",large:"Grande"},t=document.getElementById("lobby-setting-size");t&&(t.textContent=e[this.fieldSize]||"MÃ©dio");const s=document.getElementById("lobby-setting-replay");s&&(s.textContent=this.showReplay?"Sim":"NÃ£o");const i=q.getSocket().id,r=n.hostId===i;this.isHost=r;const o=document.getElementById("lobby-btn-start"),l=document.getElementById("lobby-host-bot-controls");o&&o.classList.toggle("hidden",!r),l&&l.classList.toggle("hidden",!r);const c=document.getElementById("lobby-red-players"),h=document.getElementById("lobby-blue-players"),d=document.getElementById("lobby-spec-players");c&&(c.innerHTML=""),h&&(h.innerHTML=""),d&&(d.innerHTML=""),n.players.forEach(p=>{const E=document.createElement("div");E.className="lobby-player-row";const S=p.team==="spectator"?"":`<span class="ready-badge ${p.ready?"ready":""}">${p.ready?"Pronto":"Aguardando"}</span>`,P=r&&p.id!==i&&!p.cpu?`<button class="kick-btn" id="kick-btn-${p.id}">âŒ</button>`:"",F=r&&p.cpu?`<button class="kick-btn" id="remove-bot-btn-${p.id}">âŒ</button>`:"";E.innerHTML=`
        <span class="lobby-player-name"><span>${p.badge}</span> <span>${p.username}</span></span>
        <span class="lobby-player-meta">
          ${S}
          ${P}
          ${F}
        </span>
      `,p.team==="red"?c==null||c.appendChild(E):p.team==="blue"?h==null||h.appendChild(E):d==null||d.appendChild(E);const U=document.getElementById(`kick-btn-${p.id}`);U&&(U.onclick=()=>{q.kickPlayer(p.id)});const O=document.getElementById(`remove-bot-btn-${p.id}`);O&&(O.onclick=()=>{q.removeBot(p.id)})});const m=document.getElementById("lobby-chat-messages");m&&(m.innerHTML="",n.chatHistory.forEach(p=>this.appendChatMessage(p)))},appendChatMessage(n,e=!1){[document.getElementById("lobby-chat-messages"),document.getElementById("game-chat-messages")].forEach(s=>{if(!s)return;s.id;const i=document.createElement("div"),r=n.username==="Sistema";i.className=`chat-msg ${r?"system":""}`;const o=n.badge?`<span>${n.badge}</span> `:"";i.innerHTML=`
        <span class="msg-time">[${n.time}]</span>
        <span class="msg-sender">${o}${n.username}:</span>
        <span class="msg-text">${n.text}</span>
      `,s.appendChild(i),s.scrollTop=s.scrollHeight})},async loadRanking(n="overall"){const e=document.getElementById("leaderboard-body");if(!e)return;e.innerHTML='<tr><td colspan="9" class="text-center">Carregando dados da tabela...</td></tr>';const t=document.getElementById("rank-filter-wins"),s=document.getElementById("rank-filter-goals"),i=document.getElementById("rank-filter-shots"),r=document.getElementById("rank-filter-dribbles"),o=document.getElementById("rank-filter-matches"),l=document.getElementById("rank-filter-mvps"),c=document.getElementById("rank-filter-overall");[t,s,i,r,o,l,c].forEach(h=>h==null?void 0:h.classList.remove("active")),n==="wins"&&(t==null||t.classList.add("active")),n==="goals"&&(s==null||s.classList.add("active")),n==="shots"&&(i==null||i.classList.add("active")),n==="dribbles"&&(r==null||r.classList.add("active")),n==="matches"&&(o==null||o.classList.add("active")),n==="mvps"&&(l==null||l.classList.add("active")),n==="overall"&&(c==null||c.classList.add("active"));try{const h=await mt.getGlobalRanking(n,10);if(h.length===0){e.innerHTML='<tr><td colspan="9" class="text-center">Nenhum jogador registrado no ranking.</td></tr>';return}e.innerHTML="",h.forEach((d,m)=>{const p=d.wins+d.losses>0?Math.round(d.wins/(d.wins+d.losses)*100):0,E=document.createElement("tr");E.innerHTML=`
          <td><strong>#${m+1}</strong></td>
          <td><span>${d.badge}</span> <strong>${d.displayName||d.username}</strong></td>
          <td>${d.matchesPlayed||0}</td>
          <td class="text-success">${d.wins}</td>
          <td>${d.goals}</td>
          <td>${d.shots||0}</td>
          <td>${d.dribbles||0}</td>
          <td>${d.mvps||0}</td>
          <td>${p}%</td>
        `,e.appendChild(E)})}catch{e.innerHTML='<tr><td colspan="9" class="text-center text-danger">Erro ao carregar dados do banco.</td></tr>'}},togglePauseMenu(){const n=document.getElementById("pause-modal");if(n)if(n.classList.contains("hidden")){n.classList.remove("hidden"),this.mode==="solo"?this.isPaused=!0:this.mode==="multiplayer"&&this.isHost&&q.hostSetPaused(!0);const e=document.getElementById("host-controls");if(e){const t=this.mode==="solo"||this.mode==="multiplayer";e.style.display=t?"block":"none",this.populateHostControls(this.mode==="solo"||this.isHost)}}else n.classList.add("hidden"),this.mode==="solo"?this.isPaused=!1:this.mode==="multiplayer"&&this.isHost&&q.hostSetPaused(!1)},populateHostControls(n){var l,c;const e=document.getElementById("host-controls-note"),t=document.getElementById("pause-btn-reset-match"),s=document.getElementById("pause-btn-add-1m"),i=document.getElementById("pause-btn-add-3m"),r=document.getElementById("host-team-panel");if(e&&(e.textContent=n?"Gerencie tempo, reinicio e times da partida.":"Somente o host pode alterar esta partida."),t&&(t.disabled=!n),[s,i].forEach(h=>{h&&(h.disabled=!n||this.mode!=="multiplayer")}),s&&(s.onclick=()=>n&&this.mode==="multiplayer"&&q.hostAddTime(60)),i&&(i.onclick=()=>n&&this.mode==="multiplayer"&&q.hostAddTime(180)),!r)return;if(r.innerHTML="",this.mode!=="multiplayer"){r.style.display="none";return}r.style.display="flex",((c=(l=this.activeRoom)==null?void 0:l.players)!=null&&c.length?this.activeRoom.players:this.players.map(h=>({id:h.id,username:h.username||h.name||"Jogador",badge:h.badge||"",team:h.team===we.RED?"red":"blue",cpu:!!h.cpu}))).filter(h=>h.team!=="spectator").forEach(h=>{const d=document.createElement("div");d.className="host-player-row",d.innerHTML=`
        <span class="host-player-name">${h.badge||""} ${h.username}</span>
        <button class="btn btn-sm btn-danger" data-team="red">Vermelho</button>
        <button class="btn btn-sm btn-primary" data-team="blue">Azul</button>
        <button class="btn btn-sm btn-secondary" data-kick="true">Expulsar</button>
      `,d.querySelectorAll("button").forEach(m=>{m.disabled=!n||h.cpu,m.onclick=()=>{if(n){if(m.dataset.kick){q.kickPlayer(h.id);return}q.hostChangeTeam(h.id,m.dataset.team)}}}),r.appendChild(d)})},setupPauseMenu(){const n=document.getElementById("pause-btn-resume");n&&(n.onclick=()=>{this.togglePauseMenu()});const e=document.getElementById("pause-btn-exit-match");e&&(e.onclick=()=>{this.togglePauseMenu();const s=document.getElementById("match-btn-exit");s&&s.click()});const t=document.getElementById("pause-btn-reset-match");t&&(t.onclick=()=>{this.mode==="solo"?(this.score={red:0,blue:0},this.p1Tackles=0,this.p1Dribbles=0,this.p2Tackles=0,this.p2Dribbles=0,this.localMatchSim&&(this.localMatchSim.score={red:0,blue:0},this.localMatchSim.status="countdown",this.localMatchSim.countdownTimer=300,this.localBallSim.x=this.canvas.width/2,this.localBallSim.y=this.canvas.height/2,this.localBallSim.vx=0,this.localBallSim.vy=0),de("Partida reiniciada!","success")):this.mode==="multiplayer"&&q.getSocket().emit("hostResetMatch"),this.togglePauseMenu()})}};function xS(n,e,t){n.fillStyle="rgba(0,0,0,.25)",n.beginPath(),n.ellipse(e+3,t+6,In*1.1,In*.6,0,0,Math.PI*2),n.fill();const s=n.createRadialGradient(e-5,t-5,4,e,t,In);s.addColorStop(0,"#ffffff"),s.addColorStop(1,"#bfc8d6"),n.fillStyle=s,n.beginPath(),n.arc(e,t,In,0,Math.PI*2),n.fill()}function MS(n,e,t,s,i,r,o,l,c,h){LS(n,e,t),n.beginPath(),n.arc(e,t,ct,0,Math.PI*2),n.fillStyle=s===we.RED?"#ef4444":"#3b82f6",n.fill(),n.lineWidth=2,n.strokeStyle="rgba(0,0,0,.45)",n.stroke(),o>0&&(n.strokeStyle="#000000",n.lineWidth=2,n.beginPath(),n.arc(e,t,ct+2,0,Math.PI*2),n.stroke()),r&&(n.fillStyle="#0b1020",n.font="700 16px system-ui, sans-serif",n.textAlign="center",n.textBaseline="middle",n.fillText(r,e,t)),l>0&&(n.strokeStyle="#22c55e",n.setLineDash([4,4]),n.beginPath(),n.arc(e,t,ct+4,0,Math.PI*2),n.stroke(),n.setLineDash([])),c>0&&(n.strokeStyle="#ef4444",n.beginPath(),n.arc(e,t,ct+2,0,Math.PI*2),n.stroke()),h&&(n.fillStyle="rgba(255,255,255,.85)",n.beginPath(),n.moveTo(e,t-ct-10),n.lineTo(e-6,t-ct-2),n.lineTo(e+6,t-ct-2),n.closePath(),n.fill()),i&&(n.fillStyle="#e2e8f0",n.font="700 12px system-ui",n.textAlign="center",n.fillText(i,e,t-ct-14))}function LS(n,e,t){n.fillStyle="rgba(0,0,0,.25)",n.beginPath(),n.ellipse(e+4,t+8,ct*1.1,ct*.6,0,0,Math.PI*2),n.fill()}const OS={initialized:!1,init(){if(this.initialized)return;this.initialized=!0;const n=document.getElementById("global-chat-container"),e=document.getElementById("global-chat-toggle"),t=document.getElementById("global-chat-form"),s=document.getElementById("global-chat-input"),i=document.getElementById("global-chat-messages");!n||!e||!t||(e.addEventListener("click",()=>{n.classList.toggle("minimized"),n.classList.contains("minimized")||s.focus()}),t.addEventListener("submit",async r=>{r.preventDefault();const o=s.value.trim();if(o){if(!lt.profileData){de("Perfil não carregado ainda.","error");return}s.value="";try{await mt.sendGlobalChatMessage(lt.profileData,o)}catch(l){de("Erro ao enviar mensagem.","error"),console.error(l)}}}),mt.subscribeToGlobalChat(r=>{if(!r)return;const o=document.createElement("div");o.className="global-chat-msg";const l=r.timestamp?new Date(r.timestamp).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}):"";o.innerHTML=`
        <span class="msg-time">${l}</span>
        <span class="msg-badge">${r.badge}</span>
        <span class="msg-author">${r.username}:</span>
        <span class="msg-content">${r.text}</span>
      `,i.appendChild(o),i.scrollTop=i.scrollHeight}))}};function VS(){console.log("[Kicker Hax SPA] Inicializando...");const n=document.getElementById("match-btn-fullscreen");n&&(n.onclick=()=>FS());const e=document.getElementById("game-version-badge"),t=document.getElementById("changelog-modal"),s=document.getElementById("changelog-btn-close");e&&t&&(e.onclick=()=>{t.classList.remove("hidden")}),s&&t&&(s.onclick=()=>{t.classList.add("hidden")}),IS.init(),Qi.loadSettings(),OS.init(),document.querySelectorAll("button, .btn").forEach(r=>{r.addEventListener("click",o=>{const l=document.createElement("span");l.className="ripple";const c=r.getBoundingClientRect(),h=Math.max(c.width,c.height);l.style.width=l.style.height=`${h}px`,l.style.left=`${o.clientX-c.left-h/2}px`,l.style.top=`${o.clientY-c.top-h/2}px`,r.appendChild(l),setTimeout(()=>l.remove(),500)})});const i=document.getElementById("splash-status");mt.subscribeToAuth(async r=>{if(r)if(i&&(i.textContent="Conectando ao banco de dados..."),await lt.init(r),await Kf.init(r),Qi.init(),lt.profileData&&lt.profileData.isNewUser){de("Escolha seu apelido de jogador antes de começar!","info");const o=document.getElementById("profile-btn-back");o&&(o.style.display="none"),W.show("profile-screen")}else{const o=document.getElementById("profile-btn-back");o&&(o.style.display=""),W.show("menu-screen")}else lt.currentUser=null,Kf.currentUser=null,W.show("login-screen")})}function FS(){document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen().catch(n=>{console.warn(`Erro ao ativar tela cheia: ${n.message}`)})}window.addEventListener("DOMContentLoaded",VS);
