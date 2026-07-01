(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))s(i);new MutationObserver(i=>{for(const r of i)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&s(o)}).observe(document,{childList:!0,subtree:!0});function t(i){const r={};return i.integrity&&(r.integrity=i.integrity),i.referrerPolicy&&(r.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?r.credentials="include":i.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function s(i){if(i.ep)return;i.ep=!0;const r=t(i);fetch(i.href,r)}})();let ol=null,Ci=null,Ri=null,Is=null,Si=null,Ai=null,al=!1,ll=.8;function cl(){if(!ol)try{ol=new(window.AudioContext||window.webkitAudioContext)}catch(n){console.warn("Web Audio API not supported",n)}return ol}const yt={setVolume(n){ll=n/100,this.updateBuses()},ensureBuses(){const n=cl();if(!n)return null;if(Ci||(Ci=n.createGain(),Ci.gain.value=al?0:ll*.9,Ci.connect(n.destination)),!Ri){Ri=n.createGain(),Ri.gain.value=.9;try{Is=n.createMediaStreamDestination(),Ri.connect(Is)}catch(e){console.warn("MediaStream destination not supported for audio recording",e)}}return{ac:n,outGain:Ci,recGain:Ri}},updateBuses(){const n=this.ensureBuses();if(!n)return;const{ac:e,outGain:t}=n,s=al?0:ll*.9;try{t.gain.cancelScheduledValues(e.currentTime),t.gain.setTargetAtTime(s,e.currentTime,.05)}catch{}},envNoise(n=.08){try{const e=this.ensureBuses();if(!e)return null;const{ac:t,outGain:s,recGain:i}=e,r=t.createBuffer(1,t.sampleRate*2,t.sampleRate),o=r.getChannelData(0);for(let d=0;d<o.length;d++)o[d]=(Math.random()*2-1)*.35;const l=t.createBufferSource();l.buffer=r,l.loop=!0;const c=t.createBiquadFilter();c.type="lowpass",c.frequency.value=800;const h=t.createGain();return h.gain.value=n,l.connect(c),c.connect(h),h.connect(s),Is&&h.connect(i),{src:l,g:h}}catch{return null}},startCrowd(){try{const n=this.envNoise(.06);if(!n)return;Si=n.g,n.src.start(),Ai=n.src}catch{}},stopCrowd(){if(Ai){try{Ai.stop()}catch{}Ai=null,Si=null}},setOutputMuted(n){al=n,this.updateBuses()},createTone(n,e=.12,t="sine",s=.2){try{const i=this.ensureBuses();if(!i)return;const{ac:r,outGain:o,recGain:l}=i,c=r.createOscillator(),h=r.createGain();c.type=t,c.frequency.value=n,h.gain.value=s,c.connect(h),h.connect(o),Is&&h.connect(l),c.start(),h.gain.exponentialRampToValueAtTime(1e-4,r.currentTime+e),c.stop(r.currentTime+e)}catch{}},percuss(n=.18,e=.05){try{const t=this.ensureBuses();if(!t)return;const{ac:s,outGain:i,recGain:r}=t,o=s.createBuffer(1,s.sampleRate*e,s.sampleRate),l=o.getChannelData(0);for(let d=0;d<l.length;d++)l[d]+=(Math.random()*2-1)*(1-d/l.length);const c=s.createBufferSource(),h=s.createGain();h.gain.value=n,c.buffer=o,c.connect(h),h.connect(i),Is&&h.connect(r),c.start()}catch{}},playCheer(){try{if(Si||this.startCrowd(),!Si)return;const n=cl(),e=Si.gain,t=n.currentTime;e.cancelScheduledValues(t),e.setTargetAtTime(.25,t,.03),e.setTargetAtTime(.08,t+.6,.3)}catch{}},play(n){switch(n){case"kick":this.createTone(520,.05,"square",.18),this.createTone(260,.06,"square",.09);break;case"tackle":this.percuss(.22,.03),this.createTone(140,.06,"sawtooth",.22);break;case"dribble":this.createTone(800,.05,"triangle",.12),this.createTone(600,.05,"triangle",.08);break;case"power":this.createTone(360,.08,"sawtooth",.18),setTimeout(()=>this.createTone(720,.06,"square",.16),80),setTimeout(()=>this.percuss(.25,.04),120);break;case"post":this.createTone(900,.04,"square",.12),this.createTone(300,.06,"sine",.1);break;case"whistle":this.createTone(1800,.18,"sine",.12),this.createTone(1500,.18,"sine",.12);break;case"goal":this.createTone(480,.18,"triangle",.14),setTimeout(()=>this.createTone(960,.12,"sine",.12),120);break;case"cheer":this.playCheer();break}},ensureAudio(){const n=cl();n&&n.state==="suspended"&&n.resume(),Ai||this.startCrowd()},getRecordingStreamDestination(){return this.ensureBuses(),Is}};class my{constructor(){this.routes=new Map,this.currentScreenId="splash-screen"}register(e,t={}){this.routes.set(e,{onEnter:t.onEnter||null,onExit:t.onExit||null})}show(e){if(e!=="match-screen")try{yt.stopCrowd()}catch{}const t=document.getElementById(e);if(!t){console.error(`[Router] Tela não encontrada: ${e}`);return}const s=this.currentScreenId,i=this.routes.get(s),r=this.routes.get(e);if(i&&i.onExit)try{i.onExit()}catch(c){console.error(`[Router] Erro ao sair da tela ${s}:`,c)}document.querySelectorAll(".screen-view").forEach(c=>{c.classList.add("hidden"),c.classList.remove("active")}),t.classList.remove("hidden"),t.classList.add("active"),this.currentScreenId=e;const l=document.getElementById("global-chat-container");if(l&&(e==="menu-screen"||e==="multiplayer-screen"?l.classList.remove("hidden"):l.classList.add("hidden")),r&&r.onEnter)try{r.onEnter()}catch(c){console.error(`[Router] Erro ao entrar na tela ${e}:`,c)}}}const W=new my;var qu={};/**
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
 */const Kf={NODE_ADMIN:!1,SDK_VERSION:"${JSCORE_VERSION}"};/**
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
 */const M=function(n,e){if(!n)throw Zs(e)},Zs=function(n){return new Error("Firebase Database ("+Kf.SDK_VERSION+") INTERNAL ASSERT FAILED: "+n)};/**
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
 */const Qf=function(n){const e=[];let t=0;for(let s=0;s<n.length;s++){let i=n.charCodeAt(s);i<128?e[t++]=i:i<2048?(e[t++]=i>>6|192,e[t++]=i&63|128):(i&64512)===55296&&s+1<n.length&&(n.charCodeAt(s+1)&64512)===56320?(i=65536+((i&1023)<<10)+(n.charCodeAt(++s)&1023),e[t++]=i>>18|240,e[t++]=i>>12&63|128,e[t++]=i>>6&63|128,e[t++]=i&63|128):(e[t++]=i>>12|224,e[t++]=i>>6&63|128,e[t++]=i&63|128)}return e},py=function(n){const e=[];let t=0,s=0;for(;t<n.length;){const i=n[t++];if(i<128)e[s++]=String.fromCharCode(i);else if(i>191&&i<224){const r=n[t++];e[s++]=String.fromCharCode((i&31)<<6|r&63)}else if(i>239&&i<365){const r=n[t++],o=n[t++],l=n[t++],c=((i&7)<<18|(r&63)<<12|(o&63)<<6|l&63)-65536;e[s++]=String.fromCharCode(55296+(c>>10)),e[s++]=String.fromCharCode(56320+(c&1023))}else{const r=n[t++],o=n[t++];e[s++]=String.fromCharCode((i&15)<<12|(r&63)<<6|o&63)}}return e.join("")},fc={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(n,e){if(!Array.isArray(n))throw Error("encodeByteArray takes an array as a parameter");this.init_();const t=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,s=[];for(let i=0;i<n.length;i+=3){const r=n[i],o=i+1<n.length,l=o?n[i+1]:0,c=i+2<n.length,h=c?n[i+2]:0,d=r>>2,m=(r&3)<<4|l>>4;let p=(l&15)<<2|h>>6,E=h&63;c||(E=64,o||(p=64)),s.push(t[d],t[m],t[p],t[E])}return s.join("")},encodeString(n,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(n):this.encodeByteArray(Qf(n),e)},decodeString(n,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(n):py(this.decodeStringToByteArray(n,e))},decodeStringToByteArray(n,e){this.init_();const t=e?this.charToByteMapWebSafe_:this.charToByteMap_,s=[];for(let i=0;i<n.length;){const r=t[n.charAt(i++)],l=i<n.length?t[n.charAt(i)]:0;++i;const h=i<n.length?t[n.charAt(i)]:64;++i;const m=i<n.length?t[n.charAt(i)]:64;if(++i,r==null||l==null||h==null||m==null)throw new gy;const p=r<<2|l>>4;if(s.push(p),h!==64){const E=l<<4&240|h>>2;if(s.push(E),m!==64){const b=h<<6&192|m;s.push(b)}}}return s},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let n=0;n<this.ENCODED_VALS.length;n++)this.byteToCharMap_[n]=this.ENCODED_VALS.charAt(n),this.charToByteMap_[this.byteToCharMap_[n]]=n,this.byteToCharMapWebSafe_[n]=this.ENCODED_VALS_WEBSAFE.charAt(n),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[n]]=n,n>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(n)]=n,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(n)]=n)}}};class gy extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const Yf=function(n){const e=Qf(n);return fc.encodeByteArray(e,!0)},Io=function(n){return Yf(n).replace(/\./g,"")},bo=function(n){try{return fc.decodeString(n,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
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
 */function _y(n){return Xf(void 0,n)}function Xf(n,e){if(!(e instanceof Object))return e;switch(e.constructor){case Date:const t=e;return new Date(t.getTime());case Object:n===void 0&&(n={});break;case Array:n=[];break;default:return e}for(const t in e)!e.hasOwnProperty(t)||!yy(t)||(n[t]=Xf(n[t],e[t]));return n}function yy(n){return n!=="__proto__"}/**
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
 */const Ey=()=>vy().__FIREBASE_DEFAULTS__,wy=()=>{if(typeof process>"u"||typeof qu>"u")return;const n=qu.__FIREBASE_DEFAULTS__;if(n)return JSON.parse(n)},Ty=()=>{if(typeof document>"u")return;let n;try{n=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const e=n&&bo(n[1]);return e&&JSON.parse(e)},ua=()=>{try{return Ey()||wy()||Ty()}catch(n){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${n}`);return}},Jf=n=>{var e,t;return(t=(e=ua())===null||e===void 0?void 0:e.emulatorHosts)===null||t===void 0?void 0:t[n]},Zf=n=>{const e=Jf(n);if(!e)return;const t=e.lastIndexOf(":");if(t<=0||t+1===e.length)throw new Error(`Invalid host ${e} with no separate hostname and port!`);const s=parseInt(e.substring(t+1),10);return e[0]==="["?[e.substring(1,t-1),s]:[e.substring(0,t),s]},em=()=>{var n;return(n=ua())===null||n===void 0?void 0:n.config},tm=n=>{var e;return(e=ua())===null||e===void 0?void 0:e[`_${n}`]};/**
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
 */class xt{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}wrapCallback(e){return(t,s)=>{t?this.reject(t):this.resolve(s),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(t):e(t,s))}}}/**
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
 */function nm(n,e){if(n.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');const t={alg:"none",type:"JWT"},s=e||"demo-project",i=n.iat||0,r=n.sub||n.user_id;if(!r)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");const o=Object.assign({iss:`https://securetoken.google.com/${s}`,aud:s,iat:i,exp:i+3600,auth_time:i,sub:r,user_id:r,firebase:{sign_in_provider:"custom",identities:{}}},n);return[Io(JSON.stringify(t)),Io(JSON.stringify(o)),""].join(".")}/**
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
 */function rt(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function mc(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(rt())}function Iy(){var n;const e=(n=ua())===null||n===void 0?void 0:n.forceEnvironment;if(e==="node")return!0;if(e==="browser")return!1;try{return Object.prototype.toString.call(global.process)==="[object process]"}catch{return!1}}function by(){return typeof navigator<"u"&&navigator.userAgent==="Cloudflare-Workers"}function Cy(){const n=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof n=="object"&&n.id!==void 0}function sm(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function Ry(){const n=rt();return n.indexOf("MSIE ")>=0||n.indexOf("Trident/")>=0}function Sy(){return Kf.NODE_ADMIN===!0}function Ay(){return!Iy()&&!!navigator.userAgent&&navigator.userAgent.includes("Safari")&&!navigator.userAgent.includes("Chrome")}function ky(){try{return typeof indexedDB=="object"}catch{return!1}}function Py(){return new Promise((n,e)=>{try{let t=!0;const s="validate-browser-context-for-indexeddb-analytics-module",i=self.indexedDB.open(s);i.onsuccess=()=>{i.result.close(),t||self.indexedDB.deleteDatabase(s),n(!0)},i.onupgradeneeded=()=>{t=!1},i.onerror=()=>{var r;e(((r=i.error)===null||r===void 0?void 0:r.message)||"")}}catch(t){e(t)}})}/**
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
 */const Ny="FirebaseError";class ln extends Error{constructor(e,t,s){super(t),this.code=e,this.customData=s,this.name=Ny,Object.setPrototypeOf(this,ln.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,pr.prototype.create)}}class pr{constructor(e,t,s){this.service=e,this.serviceName=t,this.errors=s}create(e,...t){const s=t[0]||{},i=`${this.service}/${e}`,r=this.errors[e],o=r?Dy(r,s):"Error",l=`${this.serviceName}: ${o} (${i}).`;return new ln(i,l,s)}}function Dy(n,e){return n.replace(xy,(t,s)=>{const i=e[s];return i!=null?String(i):`<${s}?>`})}const xy=/\{\$([^}]+)}/g;/**
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
 */function Ji(n){return JSON.parse(n)}function xe(n){return JSON.stringify(n)}/**
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
 */const im=function(n){let e={},t={},s={},i="";try{const r=n.split(".");e=Ji(bo(r[0])||""),t=Ji(bo(r[1])||""),i=r[2],s=t.d||{},delete t.d}catch{}return{header:e,claims:t,data:s,signature:i}},My=function(n){const e=im(n),t=e.claims;return!!t&&typeof t=="object"&&t.hasOwnProperty("iat")},Ly=function(n){const e=im(n).claims;return typeof e=="object"&&e.admin===!0};/**
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
 */function jt(n,e){return Object.prototype.hasOwnProperty.call(n,e)}function Vs(n,e){if(Object.prototype.hasOwnProperty.call(n,e))return n[e]}function Co(n){for(const e in n)if(Object.prototype.hasOwnProperty.call(n,e))return!1;return!0}function Ro(n,e,t){const s={};for(const i in n)Object.prototype.hasOwnProperty.call(n,i)&&(s[i]=e.call(t,n[i],i,n));return s}function So(n,e){if(n===e)return!0;const t=Object.keys(n),s=Object.keys(e);for(const i of t){if(!s.includes(i))return!1;const r=n[i],o=e[i];if($u(r)&&$u(o)){if(!So(r,o))return!1}else if(r!==o)return!1}for(const i of s)if(!t.includes(i))return!1;return!0}function $u(n){return n!==null&&typeof n=="object"}/**
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
 */function ei(n){const e=[];for(const[t,s]of Object.entries(n))Array.isArray(s)?s.forEach(i=>{e.push(encodeURIComponent(t)+"="+encodeURIComponent(i))}):e.push(encodeURIComponent(t)+"="+encodeURIComponent(s));return e.length?"&"+e.join("&"):""}/**
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
 */class Oy{constructor(){this.chain_=[],this.buf_=[],this.W_=[],this.pad_=[],this.inbuf_=0,this.total_=0,this.blockSize=512/8,this.pad_[0]=128;for(let e=1;e<this.blockSize;++e)this.pad_[e]=0;this.reset()}reset(){this.chain_[0]=1732584193,this.chain_[1]=4023233417,this.chain_[2]=2562383102,this.chain_[3]=271733878,this.chain_[4]=3285377520,this.inbuf_=0,this.total_=0}compress_(e,t){t||(t=0);const s=this.W_;if(typeof e=="string")for(let m=0;m<16;m++)s[m]=e.charCodeAt(t)<<24|e.charCodeAt(t+1)<<16|e.charCodeAt(t+2)<<8|e.charCodeAt(t+3),t+=4;else for(let m=0;m<16;m++)s[m]=e[t]<<24|e[t+1]<<16|e[t+2]<<8|e[t+3],t+=4;for(let m=16;m<80;m++){const p=s[m-3]^s[m-8]^s[m-14]^s[m-16];s[m]=(p<<1|p>>>31)&4294967295}let i=this.chain_[0],r=this.chain_[1],o=this.chain_[2],l=this.chain_[3],c=this.chain_[4],h,d;for(let m=0;m<80;m++){m<40?m<20?(h=l^r&(o^l),d=1518500249):(h=r^o^l,d=1859775393):m<60?(h=r&o|l&(r|o),d=2400959708):(h=r^o^l,d=3395469782);const p=(i<<5|i>>>27)+h+c+d+s[m]&4294967295;c=l,l=o,o=(r<<30|r>>>2)&4294967295,r=i,i=p}this.chain_[0]=this.chain_[0]+i&4294967295,this.chain_[1]=this.chain_[1]+r&4294967295,this.chain_[2]=this.chain_[2]+o&4294967295,this.chain_[3]=this.chain_[3]+l&4294967295,this.chain_[4]=this.chain_[4]+c&4294967295}update(e,t){if(e==null)return;t===void 0&&(t=e.length);const s=t-this.blockSize;let i=0;const r=this.buf_;let o=this.inbuf_;for(;i<t;){if(o===0)for(;i<=s;)this.compress_(e,i),i+=this.blockSize;if(typeof e=="string"){for(;i<t;)if(r[o]=e.charCodeAt(i),++o,++i,o===this.blockSize){this.compress_(r),o=0;break}}else for(;i<t;)if(r[o]=e[i],++o,++i,o===this.blockSize){this.compress_(r),o=0;break}}this.inbuf_=o,this.total_+=t}digest(){const e=[];let t=this.total_*8;this.inbuf_<56?this.update(this.pad_,56-this.inbuf_):this.update(this.pad_,this.blockSize-(this.inbuf_-56));for(let i=this.blockSize-1;i>=56;i--)this.buf_[i]=t&255,t/=256;this.compress_(this.buf_);let s=0;for(let i=0;i<5;i++)for(let r=24;r>=0;r-=8)e[s]=this.chain_[i]>>r&255,++s;return e}}function Vy(n,e){const t=new Fy(n,e);return t.subscribe.bind(t)}class Fy{constructor(e,t){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=t,this.task.then(()=>{e(this)}).catch(s=>{this.error(s)})}next(e){this.forEachObserver(t=>{t.next(e)})}error(e){this.forEachObserver(t=>{t.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,t,s){let i;if(e===void 0&&t===void 0&&s===void 0)throw new Error("Missing Observer.");By(e,["next","error","complete"])?i=e:i={next:e,error:t,complete:s},i.next===void 0&&(i.next=hl),i.error===void 0&&(i.error=hl),i.complete===void 0&&(i.complete=hl);const r=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?i.error(this.finalError):i.complete()}catch{}}),this.observers.push(i),r}unsubscribeOne(e){this.observers===void 0||this.observers[e]===void 0||(delete this.observers[e],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let t=0;t<this.observers.length;t++)this.sendOne(t,e)}sendOne(e,t){this.task.then(()=>{if(this.observers!==void 0&&this.observers[e]!==void 0)try{t(this.observers[e])}catch(s){typeof console<"u"&&console.error&&console.error(s)}})}close(e){this.finalized||(this.finalized=!0,e!==void 0&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function By(n,e){if(typeof n!="object"||n===null)return!1;for(const t of e)if(t in n&&typeof n[t]=="function")return!0;return!1}function hl(){}function Fs(n,e){return`${n} failed: ${e} argument `}/**
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
 */const Uy=function(n){const e=[];let t=0;for(let s=0;s<n.length;s++){let i=n.charCodeAt(s);if(i>=55296&&i<=56319){const r=i-55296;s++,M(s<n.length,"Surrogate pair missing trail surrogate.");const o=n.charCodeAt(s)-56320;i=65536+(r<<10)+o}i<128?e[t++]=i:i<2048?(e[t++]=i>>6|192,e[t++]=i&63|128):i<65536?(e[t++]=i>>12|224,e[t++]=i>>6&63|128,e[t++]=i&63|128):(e[t++]=i>>18|240,e[t++]=i>>12&63|128,e[t++]=i>>6&63|128,e[t++]=i&63|128)}return e},da=function(n){let e=0;for(let t=0;t<n.length;t++){const s=n.charCodeAt(t);s<128?e++:s<2048?e+=2:s>=55296&&s<=56319?(e+=4,t++):e+=3}return e};/**
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
 */function de(n){return n&&n._delegate?n._delegate:n}class Sn{constructor(e,t,s){this.name=e,this.instanceFactory=t,this.type=s,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
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
 */class jy{constructor(e,t){this.name=e,this.container=t,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const t=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(t)){const s=new xt;if(this.instancesDeferred.set(t,s),this.isInitialized(t)||this.shouldAutoInitialize())try{const i=this.getOrInitializeService({instanceIdentifier:t});i&&s.resolve(i)}catch{}}return this.instancesDeferred.get(t).promise}getImmediate(e){var t;const s=this.normalizeInstanceIdentifier(e==null?void 0:e.identifier),i=(t=e==null?void 0:e.optional)!==null&&t!==void 0?t:!1;if(this.isInitialized(s)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:s})}catch(r){if(i)return null;throw r}else{if(i)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(qy(e))try{this.getOrInitializeService({instanceIdentifier:Gn})}catch{}for(const[t,s]of this.instancesDeferred.entries()){const i=this.normalizeInstanceIdentifier(t);try{const r=this.getOrInitializeService({instanceIdentifier:i});s.resolve(r)}catch{}}}}clearInstance(e=Gn){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(t=>"INTERNAL"in t).map(t=>t.INTERNAL.delete()),...e.filter(t=>"_delete"in t).map(t=>t._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=Gn){return this.instances.has(e)}getOptions(e=Gn){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:t={}}=e,s=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(s))throw Error(`${this.name}(${s}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const i=this.getOrInitializeService({instanceIdentifier:s,options:t});for(const[r,o]of this.instancesDeferred.entries()){const l=this.normalizeInstanceIdentifier(r);s===l&&o.resolve(i)}return i}onInit(e,t){var s;const i=this.normalizeInstanceIdentifier(t),r=(s=this.onInitCallbacks.get(i))!==null&&s!==void 0?s:new Set;r.add(e),this.onInitCallbacks.set(i,r);const o=this.instances.get(i);return o&&e(o,i),()=>{r.delete(e)}}invokeOnInitCallbacks(e,t){const s=this.onInitCallbacks.get(t);if(s)for(const i of s)try{i(e,t)}catch{}}getOrInitializeService({instanceIdentifier:e,options:t={}}){let s=this.instances.get(e);if(!s&&this.component&&(s=this.component.instanceFactory(this.container,{instanceIdentifier:Wy(e),options:t}),this.instances.set(e,s),this.instancesOptions.set(e,t),this.invokeOnInitCallbacks(s,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,s)}catch{}return s||null}normalizeInstanceIdentifier(e=Gn){return this.component?this.component.multipleInstances?e:Gn:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function Wy(n){return n===Gn?void 0:n}function qy(n){return n.instantiationMode==="EAGER"}/**
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
 */class $y{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const t=this.getProvider(e.name);if(t.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);t.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const t=new jy(e,this);return this.providers.set(e,t),t}getProviders(){return Array.from(this.providers.values())}}/**
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
 */var te;(function(n){n[n.DEBUG=0]="DEBUG",n[n.VERBOSE=1]="VERBOSE",n[n.INFO=2]="INFO",n[n.WARN=3]="WARN",n[n.ERROR=4]="ERROR",n[n.SILENT=5]="SILENT"})(te||(te={}));const zy={debug:te.DEBUG,verbose:te.VERBOSE,info:te.INFO,warn:te.WARN,error:te.ERROR,silent:te.SILENT},Hy=te.INFO,Gy={[te.DEBUG]:"log",[te.VERBOSE]:"log",[te.INFO]:"info",[te.WARN]:"warn",[te.ERROR]:"error"},Ky=(n,e,...t)=>{if(e<n.logLevel)return;const s=new Date().toISOString(),i=Gy[e];if(i)console[i](`[${s}]  ${n.name}:`,...t);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class fa{constructor(e){this.name=e,this._logLevel=Hy,this._logHandler=Ky,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in te))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?zy[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,te.DEBUG,...e),this._logHandler(this,te.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,te.VERBOSE,...e),this._logHandler(this,te.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,te.INFO,...e),this._logHandler(this,te.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,te.WARN,...e),this._logHandler(this,te.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,te.ERROR,...e),this._logHandler(this,te.ERROR,...e)}}const Qy=(n,e)=>e.some(t=>n instanceof t);let zu,Hu;function Yy(){return zu||(zu=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function Xy(){return Hu||(Hu=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const rm=new WeakMap,Nl=new WeakMap,om=new WeakMap,ul=new WeakMap,pc=new WeakMap;function Jy(n){const e=new Promise((t,s)=>{const i=()=>{n.removeEventListener("success",r),n.removeEventListener("error",o)},r=()=>{t(wn(n.result)),i()},o=()=>{s(n.error),i()};n.addEventListener("success",r),n.addEventListener("error",o)});return e.then(t=>{t instanceof IDBCursor&&rm.set(t,n)}).catch(()=>{}),pc.set(e,n),e}function Zy(n){if(Nl.has(n))return;const e=new Promise((t,s)=>{const i=()=>{n.removeEventListener("complete",r),n.removeEventListener("error",o),n.removeEventListener("abort",o)},r=()=>{t(),i()},o=()=>{s(n.error||new DOMException("AbortError","AbortError")),i()};n.addEventListener("complete",r),n.addEventListener("error",o),n.addEventListener("abort",o)});Nl.set(n,e)}let Dl={get(n,e,t){if(n instanceof IDBTransaction){if(e==="done")return Nl.get(n);if(e==="objectStoreNames")return n.objectStoreNames||om.get(n);if(e==="store")return t.objectStoreNames[1]?void 0:t.objectStore(t.objectStoreNames[0])}return wn(n[e])},set(n,e,t){return n[e]=t,!0},has(n,e){return n instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in n}};function ev(n){Dl=n(Dl)}function tv(n){return n===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...t){const s=n.call(dl(this),e,...t);return om.set(s,e.sort?e.sort():[e]),wn(s)}:Xy().includes(n)?function(...e){return n.apply(dl(this),e),wn(rm.get(this))}:function(...e){return wn(n.apply(dl(this),e))}}function nv(n){return typeof n=="function"?tv(n):(n instanceof IDBTransaction&&Zy(n),Qy(n,Yy())?new Proxy(n,Dl):n)}function wn(n){if(n instanceof IDBRequest)return Jy(n);if(ul.has(n))return ul.get(n);const e=nv(n);return e!==n&&(ul.set(n,e),pc.set(e,n)),e}const dl=n=>pc.get(n);function sv(n,e,{blocked:t,upgrade:s,blocking:i,terminated:r}={}){const o=indexedDB.open(n,e),l=wn(o);return s&&o.addEventListener("upgradeneeded",c=>{s(wn(o.result),c.oldVersion,c.newVersion,wn(o.transaction),c)}),t&&o.addEventListener("blocked",c=>t(c.oldVersion,c.newVersion,c)),l.then(c=>{r&&c.addEventListener("close",()=>r()),i&&c.addEventListener("versionchange",h=>i(h.oldVersion,h.newVersion,h))}).catch(()=>{}),l}const iv=["get","getKey","getAll","getAllKeys","count"],rv=["put","add","delete","clear"],fl=new Map;function Gu(n,e){if(!(n instanceof IDBDatabase&&!(e in n)&&typeof e=="string"))return;if(fl.get(e))return fl.get(e);const t=e.replace(/FromIndex$/,""),s=e!==t,i=rv.includes(t);if(!(t in(s?IDBIndex:IDBObjectStore).prototype)||!(i||iv.includes(t)))return;const r=async function(o,...l){const c=this.transaction(o,i?"readwrite":"readonly");let h=c.store;return s&&(h=h.index(l.shift())),(await Promise.all([h[t](...l),i&&c.done]))[0]};return fl.set(e,r),r}ev(n=>({...n,get:(e,t,s)=>Gu(e,t)||n.get(e,t,s),has:(e,t)=>!!Gu(e,t)||n.has(e,t)}));/**
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
 */class ov{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(t=>{if(av(t)){const s=t.getImmediate();return`${s.library}/${s.version}`}else return null}).filter(t=>t).join(" ")}}function av(n){const e=n.getComponent();return(e==null?void 0:e.type)==="VERSION"}const xl="@firebase/app",Ku="0.10.13";/**
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
 */const nn=new fa("@firebase/app"),lv="@firebase/app-compat",cv="@firebase/analytics-compat",hv="@firebase/analytics",uv="@firebase/app-check-compat",dv="@firebase/app-check",fv="@firebase/auth",mv="@firebase/auth-compat",pv="@firebase/database",gv="@firebase/data-connect",_v="@firebase/database-compat",yv="@firebase/functions",vv="@firebase/functions-compat",Ev="@firebase/installations",wv="@firebase/installations-compat",Tv="@firebase/messaging",Iv="@firebase/messaging-compat",bv="@firebase/performance",Cv="@firebase/performance-compat",Rv="@firebase/remote-config",Sv="@firebase/remote-config-compat",Av="@firebase/storage",kv="@firebase/storage-compat",Pv="@firebase/firestore",Nv="@firebase/vertexai-preview",Dv="@firebase/firestore-compat",xv="firebase",Mv="10.14.1";/**
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
 */const Ao=new Map,Ov=new Map,Ll=new Map;function Qu(n,e){try{n.container.addComponent(e)}catch(t){nn.debug(`Component ${e.name} failed to register with FirebaseApp ${n.name}`,t)}}function ns(n){const e=n.name;if(Ll.has(e))return nn.debug(`There were multiple attempts to register component ${e}.`),!1;Ll.set(e,n);for(const t of Ao.values())Qu(t,n);for(const t of Ov.values())Qu(t,n);return!0}function ma(n,e){const t=n.container.getProvider("heartbeat").getImmediate({optional:!0});return t&&t.triggerHeartbeat(),n.container.getProvider(e)}function Qt(n){return n.settings!==void 0}/**
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
 */const Vv={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},Tn=new pr("app","Firebase",Vv);/**
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
 */class Fv{constructor(e,t,s){this._isDeleted=!1,this._options=Object.assign({},e),this._config=Object.assign({},t),this._name=t.name,this._automaticDataCollectionEnabled=t.automaticDataCollectionEnabled,this._container=s,this.container.addComponent(new Sn("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw Tn.create("app-deleted",{appName:this._name})}}/**
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
 */const us=Mv;function am(n,e={}){let t=n;typeof e!="object"&&(e={name:e});const s=Object.assign({name:Ml,automaticDataCollectionEnabled:!1},e),i=s.name;if(typeof i!="string"||!i)throw Tn.create("bad-app-name",{appName:String(i)});if(t||(t=em()),!t)throw Tn.create("no-options");const r=Ao.get(i);if(r){if(So(t,r.options)&&So(s,r.config))return r;throw Tn.create("duplicate-app",{appName:i})}const o=new $y(i);for(const c of Ll.values())o.addComponent(c);const l=new Fv(t,s,o);return Ao.set(i,l),l}function gc(n=Ml){const e=Ao.get(n);if(!e&&n===Ml&&em())return am();if(!e)throw Tn.create("no-app",{appName:n});return e}function Mt(n,e,t){var s;let i=(s=Lv[n])!==null&&s!==void 0?s:n;t&&(i+=`-${t}`);const r=i.match(/\s|\//),o=e.match(/\s|\//);if(r||o){const l=[`Unable to register library "${i}" with version "${e}":`];r&&l.push(`library name "${i}" contains illegal characters (whitespace or "/")`),r&&o&&l.push("and"),o&&l.push(`version name "${e}" contains illegal characters (whitespace or "/")`),nn.warn(l.join(" "));return}ns(new Sn(`${i}-version`,()=>({library:i,version:e}),"VERSION"))}/**
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
 */const Bv="firebase-heartbeat-database",Uv=1,Zi="firebase-heartbeat-store";let ml=null;function lm(){return ml||(ml=sv(Bv,Uv,{upgrade:(n,e)=>{switch(e){case 0:try{n.createObjectStore(Zi)}catch(t){console.warn(t)}}}}).catch(n=>{throw Tn.create("idb-open",{originalErrorMessage:n.message})})),ml}async function jv(n){try{const t=(await lm()).transaction(Zi),s=await t.objectStore(Zi).get(cm(n));return await t.done,s}catch(e){if(e instanceof ln)nn.warn(e.message);else{const t=Tn.create("idb-get",{originalErrorMessage:e==null?void 0:e.message});nn.warn(t.message)}}}async function Yu(n,e){try{const s=(await lm()).transaction(Zi,"readwrite");await s.objectStore(Zi).put(e,cm(n)),await s.done}catch(t){if(t instanceof ln)nn.warn(t.message);else{const s=Tn.create("idb-set",{originalErrorMessage:t==null?void 0:t.message});nn.warn(s.message)}}}function cm(n){return`${n.name}!${n.options.appId}`}/**
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
 */const Wv=1024,qv=30*24*60*60*1e3;class $v{constructor(e){this.container=e,this._heartbeatsCache=null;const t=this.container.getProvider("app").getImmediate();this._storage=new Hv(t),this._heartbeatsCachePromise=this._storage.read().then(s=>(this._heartbeatsCache=s,s))}async triggerHeartbeat(){var e,t;try{const i=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),r=Xu();return((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((t=this._heartbeatsCache)===null||t===void 0?void 0:t.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===r||this._heartbeatsCache.heartbeats.some(o=>o.date===r)?void 0:(this._heartbeatsCache.heartbeats.push({date:r,agent:i}),this._heartbeatsCache.heartbeats=this._heartbeatsCache.heartbeats.filter(o=>{const l=new Date(o.date).valueOf();return Date.now()-l<=qv}),this._storage.overwrite(this._heartbeatsCache))}catch(s){nn.warn(s)}}async getHeartbeatsHeader(){var e;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const t=Xu(),{heartbeatsToSend:s,unsentEntries:i}=zv(this._heartbeatsCache.heartbeats),r=Io(JSON.stringify({version:2,heartbeats:s}));return this._heartbeatsCache.lastSentHeartbeatDate=t,i.length>0?(this._heartbeatsCache.heartbeats=i,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),r}catch(t){return nn.warn(t),""}}}function Xu(){return new Date().toISOString().substring(0,10)}function zv(n,e=Wv){const t=[];let s=n.slice();for(const i of n){const r=t.find(o=>o.agent===i.agent);if(r){if(r.dates.push(i.date),Ju(t)>e){r.dates.pop();break}}else if(t.push({agent:i.agent,dates:[i.date]}),Ju(t)>e){t.pop();break}s=s.slice(1)}return{heartbeatsToSend:t,unsentEntries:s}}class Hv{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return ky()?Py().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const t=await jv(this.app);return t!=null&&t.heartbeats?t:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){var t;if(await this._canUseIndexedDBPromise){const i=await this.read();return Yu(this.app,{lastSentHeartbeatDate:(t=e.lastSentHeartbeatDate)!==null&&t!==void 0?t:i.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){var t;if(await this._canUseIndexedDBPromise){const i=await this.read();return Yu(this.app,{lastSentHeartbeatDate:(t=e.lastSentHeartbeatDate)!==null&&t!==void 0?t:i.lastSentHeartbeatDate,heartbeats:[...i.heartbeats,...e.heartbeats]})}else return}}function Ju(n){return Io(JSON.stringify({version:2,heartbeats:n})).length}/**
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
 */function Gv(n){ns(new Sn("platform-logger",e=>new ov(e),"PRIVATE")),ns(new Sn("heartbeat",e=>new $v(e),"PRIVATE")),Mt(xl,Ku,n),Mt(xl,Ku,"esm2017"),Mt("fire-js","")}Gv("");var Kv="firebase",Qv="10.14.1";/**
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
 */Mt(Kv,Qv,"app");function _c(n,e){var t={};for(var s in n)Object.prototype.hasOwnProperty.call(n,s)&&e.indexOf(s)<0&&(t[s]=n[s]);if(n!=null&&typeof Object.getOwnPropertySymbols=="function")for(var i=0,s=Object.getOwnPropertySymbols(n);i<s.length;i++)e.indexOf(s[i])<0&&Object.prototype.propertyIsEnumerable.call(n,s[i])&&(t[s[i]]=n[s[i]]);return t}function hm(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}const Yv=hm,um=new pr("auth","Firebase",hm());/**
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
 */const ko=new fa("@firebase/auth");function Xv(n,...e){ko.logLevel<=te.WARN&&ko.warn(`Auth (${us}): ${n}`,...e)}function uo(n,...e){ko.logLevel<=te.ERROR&&ko.error(`Auth (${us}): ${n}`,...e)}/**
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
 */function Ft(n,...e){throw vc(n,...e)}function kt(n,...e){return vc(n,...e)}function yc(n,e,t){const s=Object.assign(Object.assign({},Yv()),{[e]:t});return new pr("auth","Firebase",s).create(e,{appName:n.name})}function Zn(n){return yc(n,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function Jv(n,e,t){const s=t;if(!(e instanceof s))throw s.name!==e.constructor.name&&Ft(n,"argument-error"),yc(n,"argument-error",`Type of ${e.constructor.name} does not match expected instance.Did you pass a reference from a different Auth SDK?`)}function vc(n,...e){if(typeof n!="string"){const t=e[0],s=[...e.slice(1)];return s[0]&&(s[0].appName=n.name),n._errorFactory.create(t,...s)}return um.create(n,...e)}function K(n,e,...t){if(!n)throw vc(e,...t)}function Yt(n){const e="INTERNAL ASSERTION FAILED: "+n;throw uo(e),new Error(e)}function sn(n,e){n||Yt(e)}/**
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
 */function Ol(){var n;return typeof self<"u"&&((n=self.location)===null||n===void 0?void 0:n.href)||""}function Zv(){return Zu()==="http:"||Zu()==="https:"}function Zu(){var n;return typeof self<"u"&&((n=self.location)===null||n===void 0?void 0:n.protocol)||null}/**
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
 */class gr{constructor(e,t){this.shortDelay=e,this.longDelay=t,sn(t>e,"Short delay should be less than long delay!"),this.isMobile=mc()||sm()}get(){return eE()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}}/**
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
 */function Ec(n,e){sn(n.emulator,"Emulator should always be set here");const{url:t}=n.emulator;return e?`${t}${e.startsWith("/")?e.slice(1):e}`:t}/**
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
 */class dm{static initialize(e,t,s){this.fetchImpl=e,t&&(this.headersImpl=t),s&&(this.responseImpl=s)}static fetch(){if(this.fetchImpl)return this.fetchImpl;if(typeof self<"u"&&"fetch"in self)return self.fetch;if(typeof globalThis<"u"&&globalThis.fetch)return globalThis.fetch;if(typeof fetch<"u")return fetch;Yt("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){if(this.headersImpl)return this.headersImpl;if(typeof self<"u"&&"Headers"in self)return self.Headers;if(typeof globalThis<"u"&&globalThis.Headers)return globalThis.Headers;if(typeof Headers<"u")return Headers;Yt("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){if(this.responseImpl)return this.responseImpl;if(typeof self<"u"&&"Response"in self)return self.Response;if(typeof globalThis<"u"&&globalThis.Response)return globalThis.Response;if(typeof Response<"u")return Response;Yt("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}/**
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
 */const sE=new gr(3e4,6e4);function wc(n,e){return n.tenantId&&!e.tenantId?Object.assign(Object.assign({},e),{tenantId:n.tenantId}):e}async function ti(n,e,t,s,i={}){return fm(n,i,async()=>{let r={},o={};s&&(e==="GET"?o=s:r={body:JSON.stringify(s)});const l=ei(Object.assign({key:n.config.apiKey},o)).slice(1),c=await n._getAdditionalHeaders();c["Content-Type"]="application/json",n.languageCode&&(c["X-Firebase-Locale"]=n.languageCode);const h=Object.assign({method:e,headers:c},r);return by()||(h.referrerPolicy="no-referrer"),dm.fetch()(mm(n,n.config.apiHost,t,l),h)})}async function fm(n,e,t){n._canInitEmulator=!1;const s=Object.assign(Object.assign({},nE),e);try{const i=new rE(n),r=await Promise.race([t(),i.promise]);i.clearNetworkTimeout();const o=await r.json();if("needConfirmation"in o)throw so(n,"account-exists-with-different-credential",o);if(r.ok&&!("errorMessage"in o))return o;{const l=r.ok?o.errorMessage:o.error.message,[c,h]=l.split(" : ");if(c==="FEDERATED_USER_ID_ALREADY_LINKED")throw so(n,"credential-already-in-use",o);if(c==="EMAIL_EXISTS")throw so(n,"email-already-in-use",o);if(c==="USER_DISABLED")throw so(n,"user-disabled",o);const d=s[c]||c.toLowerCase().replace(/[_\s]+/g,"-");if(h)throw yc(n,d,h);Ft(n,d)}}catch(i){if(i instanceof ln)throw i;Ft(n,"network-request-failed",{message:String(i)})}}async function iE(n,e,t,s,i={}){const r=await ti(n,e,t,s,i);return"mfaPendingCredential"in r&&Ft(n,"multi-factor-auth-required",{_serverResponse:r}),r}function mm(n,e,t,s){const i=`${e}${t}?${s}`;return n.config.emulator?Ec(n.config,i):`${n.config.apiScheme}://${i}`}class rE{constructor(e){this.auth=e,this.timer=null,this.promise=new Promise((t,s)=>{this.timer=setTimeout(()=>s(kt(this.auth,"network-request-failed")),sE.get())})}clearNetworkTimeout(){clearTimeout(this.timer)}}function so(n,e,t){const s={appName:n.name};t.email&&(s.email=t.email),t.phoneNumber&&(s.phoneNumber=t.phoneNumber);const i=kt(n,e,s);return i.customData._tokenResponse=t,i}/**
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
 */async function oE(n,e){return ti(n,"POST","/v1/accounts:delete",e)}async function pm(n,e){return ti(n,"POST","/v1/accounts:lookup",e)}/**
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
 */function Fi(n){if(n)try{const e=new Date(Number(n));if(!isNaN(e.getTime()))return e.toUTCString()}catch{}}async function aE(n,e=!1){const t=de(n),s=await t.getIdToken(e),i=Tc(s);K(i&&i.exp&&i.auth_time&&i.iat,t.auth,"internal-error");const r=typeof i.firebase=="object"?i.firebase:void 0,o=r==null?void 0:r.sign_in_provider;return{claims:i,token:s,authTime:Fi(pl(i.auth_time)),issuedAtTime:Fi(pl(i.iat)),expirationTime:Fi(pl(i.exp)),signInProvider:o||null,signInSecondFactor:(r==null?void 0:r.sign_in_second_factor)||null}}function pl(n){return Number(n)*1e3}function Tc(n){const[e,t,s]=n.split(".");if(e===void 0||t===void 0||s===void 0)return uo("JWT malformed, contained fewer than 3 sections"),null;try{const i=bo(t);return i?JSON.parse(i):(uo("Failed to decode base64 JWT payload"),null)}catch(i){return uo("Caught error parsing JWT payload as JSON",i==null?void 0:i.toString()),null}}function ed(n){const e=Tc(n);return K(e,"internal-error"),K(typeof e.exp<"u","internal-error"),K(typeof e.iat<"u","internal-error"),Number(e.exp)-Number(e.iat)}/**
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
 */async function er(n,e,t=!1){if(t)return e;try{return await e}catch(s){throw s instanceof ln&&lE(s)&&n.auth.currentUser===n&&await n.auth.signOut(),s}}function lE({code:n}){return n==="auth/user-disabled"||n==="auth/user-token-expired"}/**
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
 */async function Po(n){var e;const t=n.auth,s=await n.getIdToken(),i=await er(n,pm(t,{idToken:s}));K(i==null?void 0:i.users.length,t,"internal-error");const r=i.users[0];n._notifyReloadListener(r);const o=!((e=r.providerUserInfo)===null||e===void 0)&&e.length?gm(r.providerUserInfo):[],l=uE(n.providerData,o),c=n.isAnonymous,h=!(n.email&&r.passwordHash)&&!(l!=null&&l.length),d=c?h:!1,m={uid:r.localId,displayName:r.displayName||null,photoURL:r.photoUrl||null,email:r.email||null,emailVerified:r.emailVerified||!1,phoneNumber:r.phoneNumber||null,tenantId:r.tenantId||null,providerData:l,metadata:new Vl(r.createdAt,r.lastLoginAt),isAnonymous:d};Object.assign(n,m)}async function hE(n){const e=de(n);await Po(e),await e.auth._persistUserIfCurrent(e),e.auth._notifyListenersIfCurrent(e)}function uE(n,e){return[...n.filter(s=>!e.some(i=>i.providerId===s.providerId)),...e]}function gm(n){return n.map(e=>{var{providerId:t}=e,s=_c(e,["providerId"]);return{providerId:t,uid:s.rawId||"",displayName:s.displayName||null,email:s.email||null,phoneNumber:s.phoneNumber||null,photoURL:s.photoUrl||null}})}/**
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
 */async function dE(n,e){const t=await fm(n,{},async()=>{const s=ei({grant_type:"refresh_token",refresh_token:e}).slice(1),{tokenApiHost:i,apiKey:r}=n.config,o=mm(n,i,"/v1/token",`key=${r}`),l=await n._getAdditionalHeaders();return l["Content-Type"]="application/x-www-form-urlencoded",dm.fetch()(o,{method:"POST",headers:l,body:s})});return{accessToken:t.access_token,expiresIn:t.expires_in,refreshToken:t.refresh_token}}async function fE(n,e){return ti(n,"POST","/v2/accounts:revokeToken",wc(n,e))}/**
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
 */class Ns{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(e){K(e.idToken,"internal-error"),K(typeof e.idToken<"u","internal-error"),K(typeof e.refreshToken<"u","internal-error");const t="expiresIn"in e&&typeof e.expiresIn<"u"?Number(e.expiresIn):ed(e.idToken);this.updateTokensAndExpiration(e.idToken,e.refreshToken,t)}updateFromIdToken(e){K(e.length!==0,"internal-error");const t=ed(e);this.updateTokensAndExpiration(e,null,t)}async getToken(e,t=!1){return!t&&this.accessToken&&!this.isExpired?this.accessToken:(K(this.refreshToken,e,"user-token-expired"),this.refreshToken?(await this.refresh(e,this.refreshToken),this.accessToken):null)}clearRefreshToken(){this.refreshToken=null}async refresh(e,t){const{accessToken:s,refreshToken:i,expiresIn:r}=await dE(e,t);this.updateTokensAndExpiration(s,i,Number(r))}updateTokensAndExpiration(e,t,s){this.refreshToken=t||null,this.accessToken=e||null,this.expirationTime=Date.now()+s*1e3}static fromJSON(e,t){const{refreshToken:s,accessToken:i,expirationTime:r}=t,o=new Ns;return s&&(K(typeof s=="string","internal-error",{appName:e}),o.refreshToken=s),i&&(K(typeof i=="string","internal-error",{appName:e}),o.accessToken=i),r&&(K(typeof r=="number","internal-error",{appName:e}),o.expirationTime=r),o}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(e){this.accessToken=e.accessToken,this.refreshToken=e.refreshToken,this.expirationTime=e.expirationTime}_clone(){return Object.assign(new Ns,this.toJSON())}_performRefresh(){return Yt("not implemented")}}/**
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
 */function mn(n,e){K(typeof n=="string"||typeof n>"u","internal-error",{appName:e})}class Xt{constructor(e){var{uid:t,auth:s,stsTokenManager:i}=e,r=_c(e,["uid","auth","stsTokenManager"]);this.providerId="firebase",this.proactiveRefresh=new cE(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=t,this.auth=s,this.stsTokenManager=i,this.accessToken=i.accessToken,this.displayName=r.displayName||null,this.email=r.email||null,this.emailVerified=r.emailVerified||!1,this.phoneNumber=r.phoneNumber||null,this.photoURL=r.photoURL||null,this.isAnonymous=r.isAnonymous||!1,this.tenantId=r.tenantId||null,this.providerData=r.providerData?[...r.providerData]:[],this.metadata=new Vl(r.createdAt||void 0,r.lastLoginAt||void 0)}async getIdToken(e){const t=await er(this,this.stsTokenManager.getToken(this.auth,e));return K(t,this.auth,"internal-error"),this.accessToken!==t&&(this.accessToken=t,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),t}getIdTokenResult(e){return aE(this,e)}reload(){return hE(this)}_assign(e){this!==e&&(K(this.uid===e.uid,this.auth,"internal-error"),this.displayName=e.displayName,this.photoURL=e.photoURL,this.email=e.email,this.emailVerified=e.emailVerified,this.phoneNumber=e.phoneNumber,this.isAnonymous=e.isAnonymous,this.tenantId=e.tenantId,this.providerData=e.providerData.map(t=>Object.assign({},t)),this.metadata._copy(e.metadata),this.stsTokenManager._assign(e.stsTokenManager))}_clone(e){const t=new Xt(Object.assign(Object.assign({},this),{auth:e,stsTokenManager:this.stsTokenManager._clone()}));return t.metadata._copy(this.metadata),t}_onReload(e){K(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=e,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(e){this.reloadListener?this.reloadListener(e):this.reloadUserInfo=e}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(e,t=!1){let s=!1;e.idToken&&e.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(e),s=!0),t&&await Po(this),await this.auth._persistUserIfCurrent(this),s&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(Qt(this.auth.app))return Promise.reject(Zn(this.auth));const e=await this.getIdToken();return await er(this,oE(this.auth,{idToken:e})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return Object.assign(Object.assign({uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(e=>Object.assign({},e)),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId},this.metadata.toJSON()),{apiKey:this.auth.config.apiKey,appName:this.auth.name})}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(e,t){var s,i,r,o,l,c,h,d;const m=(s=t.displayName)!==null&&s!==void 0?s:void 0,p=(i=t.email)!==null&&i!==void 0?i:void 0,E=(r=t.phoneNumber)!==null&&r!==void 0?r:void 0,b=(o=t.photoURL)!==null&&o!==void 0?o:void 0,A=(l=t.tenantId)!==null&&l!==void 0?l:void 0,P=(c=t._redirectEventId)!==null&&c!==void 0?c:void 0,F=(h=t.createdAt)!==null&&h!==void 0?h:void 0,U=(d=t.lastLoginAt)!==null&&d!==void 0?d:void 0,{uid:O,emailVerified:Y,isAnonymous:oe,providerData:ee,stsTokenManager:I}=t;K(O&&I,e,"internal-error");const y=Ns.fromJSON(this.name,I);K(typeof O=="string",e,"internal-error"),mn(m,e.name),mn(p,e.name),K(typeof Y=="boolean",e,"internal-error"),K(typeof oe=="boolean",e,"internal-error"),mn(E,e.name),mn(b,e.name),mn(A,e.name),mn(P,e.name),mn(F,e.name),mn(U,e.name);const _=new Xt({uid:O,auth:e,email:p,emailVerified:Y,displayName:m,isAnonymous:oe,photoURL:b,phoneNumber:E,tenantId:A,stsTokenManager:y,createdAt:F,lastLoginAt:U});return ee&&Array.isArray(ee)&&(_.providerData=ee.map(w=>Object.assign({},w))),P&&(_._redirectEventId=P),_}static async _fromIdTokenResponse(e,t,s=!1){const i=new Ns;i.updateFromServerResponse(t);const r=new Xt({uid:t.localId,auth:e,stsTokenManager:i,isAnonymous:s});return await Po(r),r}static async _fromGetAccountInfoResponse(e,t,s){const i=t.users[0];K(i.localId!==void 0,"internal-error");const r=i.providerUserInfo!==void 0?gm(i.providerUserInfo):[],o=!(i.email&&i.passwordHash)&&!(r!=null&&r.length),l=new Ns;l.updateFromIdToken(s);const c=new Xt({uid:i.localId,auth:e,stsTokenManager:l,isAnonymous:o}),h={uid:i.localId,displayName:i.displayName||null,photoURL:i.photoUrl||null,email:i.email||null,emailVerified:i.emailVerified||!1,phoneNumber:i.phoneNumber||null,tenantId:i.tenantId||null,providerData:r,metadata:new Vl(i.createdAt,i.lastLoginAt),isAnonymous:!(i.email&&i.passwordHash)&&!(r!=null&&r.length)};return Object.assign(c,h),c}}/**
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
 */const td=new Map;function Jt(n){sn(n instanceof Function,"Expected a class definition");let e=td.get(n);return e?(sn(e instanceof n,"Instance stored in cache mismatched with class"),e):(e=new n,td.set(n,e),e)}/**
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
 */class _m{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(e,t){this.storage[e]=t}async _get(e){const t=this.storage[e];return t===void 0?null:t}async _remove(e){delete this.storage[e]}_addListener(e,t){}_removeListener(e,t){}}_m.type="NONE";const nd=_m;/**
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
 */function fo(n,e,t){return`firebase:${n}:${e}:${t}`}class Ds{constructor(e,t,s){this.persistence=e,this.auth=t,this.userKey=s;const{config:i,name:r}=this.auth;this.fullUserKey=fo(this.userKey,i.apiKey,r),this.fullPersistenceKey=fo("persistence",i.apiKey,r),this.boundEventHandler=t._onStorageEvent.bind(t),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(e){return this.persistence._set(this.fullUserKey,e.toJSON())}async getCurrentUser(){const e=await this.persistence._get(this.fullUserKey);return e?Xt._fromJSON(this.auth,e):null}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(e){if(this.persistence===e)return;const t=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=e,t)return this.setCurrentUser(t)}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(e,t,s="authUser"){if(!t.length)return new Ds(Jt(nd),e,s);const i=(await Promise.all(t.map(async h=>{if(await h._isAvailable())return h}))).filter(h=>h);let r=i[0]||Jt(nd);const o=fo(s,e.config.apiKey,e.name);let l=null;for(const h of t)try{const d=await h._get(o);if(d){const m=Xt._fromJSON(e,d);h!==r&&(l=m),r=h;break}}catch{}const c=i.filter(h=>h._shouldAllowMigration);return!r._shouldAllowMigration||!c.length?new Ds(r,e,s):(r=c[0],l&&await r._set(o,l.toJSON()),await Promise.all(t.map(async h=>{if(h!==r)try{await h._remove(o)}catch{}})),new Ds(r,e,s))}}/**
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
 */function sd(n){const e=n.toLowerCase();if(e.includes("opera/")||e.includes("opr/")||e.includes("opios/"))return"Opera";if(wm(e))return"IEMobile";if(e.includes("msie")||e.includes("trident/"))return"IE";if(e.includes("edge/"))return"Edge";if(ym(e))return"Firefox";if(e.includes("silk/"))return"Silk";if(Im(e))return"Blackberry";if(bm(e))return"Webos";if(vm(e))return"Safari";if((e.includes("chrome/")||Em(e))&&!e.includes("edge/"))return"Chrome";if(Tm(e))return"Android";{const t=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,s=n.match(t);if((s==null?void 0:s.length)===2)return s[1]}return"Other"}function ym(n=rt()){return/firefox\//i.test(n)}function vm(n=rt()){const e=n.toLowerCase();return e.includes("safari/")&&!e.includes("chrome/")&&!e.includes("crios/")&&!e.includes("android")}function Em(n=rt()){return/crios\//i.test(n)}function wm(n=rt()){return/iemobile/i.test(n)}function Tm(n=rt()){return/android/i.test(n)}function Im(n=rt()){return/blackberry/i.test(n)}function bm(n=rt()){return/webos/i.test(n)}function Ic(n=rt()){return/iphone|ipad|ipod/i.test(n)||/macintosh/i.test(n)&&/mobile/i.test(n)}function mE(n=rt()){var e;return Ic(n)&&!!(!((e=window.navigator)===null||e===void 0)&&e.standalone)}function pE(){return Ry()&&document.documentMode===10}function Cm(n=rt()){return Ic(n)||Tm(n)||bm(n)||Im(n)||/windows phone/i.test(n)||wm(n)}/**
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
 */function Rm(n,e=[]){let t;switch(n){case"Browser":t=sd(rt());break;case"Worker":t=`${sd(rt())}-${n}`;break;default:t=n}const s=e.length?e.join(","):"FirebaseCore-web";return`${t}/JsCore/${us}/${s}`}/**
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
 */async function _E(n,e={}){return ti(n,"GET","/v2/passwordPolicy",wc(n,e))}/**
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
 */class EE{constructor(e,t,s,i){this.app=e,this.heartbeatServiceProvider=t,this.appCheckServiceProvider=s,this.config=i,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new id(this),this.idTokenSubscription=new id(this),this.beforeStateQueue=new gE(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=um,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=e.name,this.clientVersion=i.sdkClientVersion}_initializeWithPersistence(e,t){return t&&(this._popupRedirectResolver=Jt(t)),this._initializationPromise=this.queue(async()=>{var s,i;if(!this._deleted&&(this.persistenceManager=await Ds.create(this,e),!this._deleted)){if(!((s=this._popupRedirectResolver)===null||s===void 0)&&s._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch{}await this.initializeCurrentUser(t),this.lastNotifiedUid=((i=this.currentUser)===null||i===void 0?void 0:i.uid)||null,!this._deleted&&(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;const e=await this.assertedPersistence.getCurrentUser();if(!(!this.currentUser&&!e)){if(this.currentUser&&e&&this.currentUser.uid===e.uid){this._currentUser._assign(e),await this.currentUser.getIdToken();return}await this._updateCurrentUser(e,!0)}}async initializeCurrentUserFromIdToken(e){try{const t=await pm(this,{idToken:e}),s=await Xt._fromGetAccountInfoResponse(this,t,e);await this.directlySetCurrentUser(s)}catch(t){console.warn("FirebaseServerApp could not login user with provided authIdToken: ",t),await this.directlySetCurrentUser(null)}}async initializeCurrentUser(e){var t;if(Qt(this.app)){const o=this.app.settings.authIdToken;return o?new Promise(l=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(o).then(l,l))}):this.directlySetCurrentUser(null)}const s=await this.assertedPersistence.getCurrentUser();let i=s,r=!1;if(e&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();const o=(t=this.redirectUser)===null||t===void 0?void 0:t._redirectEventId,l=i==null?void 0:i._redirectEventId,c=await this.tryRedirectSignIn(e);(!o||o===l)&&(c!=null&&c.user)&&(i=c.user,r=!0)}if(!i)return this.directlySetCurrentUser(null);if(!i._redirectEventId){if(r)try{await this.beforeStateQueue.runMiddleware(i)}catch(o){i=s,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(o))}return i?this.reloadAndSetCurrentUserOrClear(i):this.directlySetCurrentUser(null)}return K(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===i._redirectEventId?this.directlySetCurrentUser(i):this.reloadAndSetCurrentUserOrClear(i)}async tryRedirectSignIn(e){let t=null;try{t=await this._popupRedirectResolver._completeRedirectFn(this,e,!0)}catch{await this._setRedirectUser(null)}return t}async reloadAndSetCurrentUserOrClear(e){try{await Po(e)}catch(t){if((t==null?void 0:t.code)!=="auth/network-request-failed")return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)}useDeviceLanguage(){this.languageCode=tE()}async _delete(){this._deleted=!0}async updateCurrentUser(e){if(Qt(this.app))return Promise.reject(Zn(this));const t=e?de(e):null;return t&&K(t.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(t&&t._clone(this))}async _updateCurrentUser(e,t=!1){if(!this._deleted)return e&&K(this.tenantId===e.tenantId,this,"tenant-id-mismatch"),t||await this.beforeStateQueue.runMiddleware(e),this.queue(async()=>{await this.directlySetCurrentUser(e),this.notifyAuthListeners()})}async signOut(){return Qt(this.app)?Promise.reject(Zn(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(e){return Qt(this.app)?Promise.reject(Zn(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(Jt(e))})}_getRecaptchaConfig(){return this.tenantId==null?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(e){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();const t=this._getPasswordPolicyInternal();return t.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):t.validatePassword(e)}_getPasswordPolicyInternal(){return this.tenantId===null?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){const e=await _E(this),t=new vE(e);this.tenantId===null?this._projectPasswordPolicy=t:this._tenantPasswordPolicies[this.tenantId]=t}_getPersistence(){return this.assertedPersistence.persistence.type}_updateErrorMap(e){this._errorFactory=new pr("auth","Firebase",e())}onAuthStateChanged(e,t,s){return this.registerStateListener(this.authStateSubscription,e,t,s)}beforeAuthStateChanged(e,t){return this.beforeStateQueue.pushCallback(e,t)}onIdTokenChanged(e,t,s){return this.registerStateListener(this.idTokenSubscription,e,t,s)}authStateReady(){return new Promise((e,t)=>{if(this.currentUser)e();else{const s=this.onAuthStateChanged(()=>{s(),e()},t)}})}async revokeAccessToken(e){if(this.currentUser){const t=await this.currentUser.getIdToken(),s={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:e,idToken:t};this.tenantId!=null&&(s.tenantId=this.tenantId),await fE(this,s)}}toJSON(){var e;return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:(e=this._currentUser)===null||e===void 0?void 0:e.toJSON()}}async _setRedirectUser(e,t){const s=await this.getOrInitRedirectPersistenceManager(t);return e===null?s.removeCurrentUser():s.setCurrentUser(e)}async getOrInitRedirectPersistenceManager(e){if(!this.redirectPersistenceManager){const t=e&&Jt(e)||this._popupRedirectResolver;K(t,this,"argument-error"),this.redirectPersistenceManager=await Ds.create(this,[Jt(t._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(e){var t,s;return this._isInitialized&&await this.queue(async()=>{}),((t=this._currentUser)===null||t===void 0?void 0:t._redirectEventId)===e?this._currentUser:((s=this.redirectUser)===null||s===void 0?void 0:s._redirectEventId)===e?this.redirectUser:null}async _persistUserIfCurrent(e){if(e===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(e))}_notifyListenersIfCurrent(e){e===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){var e,t;if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);const s=(t=(e=this.currentUser)===null||e===void 0?void 0:e.uid)!==null&&t!==void 0?t:null;this.lastNotifiedUid!==s&&(this.lastNotifiedUid=s,this.authStateSubscription.next(this.currentUser))}registerStateListener(e,t,s,i){if(this._deleted)return()=>{};const r=typeof t=="function"?t:t.next.bind(t);let o=!1;const l=this._isInitialized?Promise.resolve():this._initializationPromise;if(K(l,this,"internal-error"),l.then(()=>{o||r(this.currentUser)}),typeof t=="function"){const c=e.addObserver(t,s,i);return()=>{o=!0,c()}}else{const c=e.addObserver(t);return()=>{o=!0,c()}}}async directlySetCurrentUser(e){this.currentUser&&this.currentUser!==e&&this._currentUser._stopProactiveRefresh(),e&&this.isProactiveRefreshEnabled&&e._startProactiveRefresh(),this.currentUser=e,e?await this.assertedPersistence.setCurrentUser(e):await this.assertedPersistence.removeCurrentUser()}queue(e){return this.operations=this.operations.then(e,e),this.operations}get assertedPersistence(){return K(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(e){!e||this.frameworks.includes(e)||(this.frameworks.push(e),this.frameworks.sort(),this.clientVersion=Rm(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){var e;const t={"X-Client-Version":this.clientVersion};this.app.options.appId&&(t["X-Firebase-gmpid"]=this.app.options.appId);const s=await((e=this.heartbeatServiceProvider.getImmediate({optional:!0}))===null||e===void 0?void 0:e.getHeartbeatsHeader());s&&(t["X-Firebase-Client"]=s);const i=await this._getAppCheckToken();return i&&(t["X-Firebase-AppCheck"]=i),t}async _getAppCheckToken(){var e;const t=await((e=this.appCheckServiceProvider.getImmediate({optional:!0}))===null||e===void 0?void 0:e.getToken());return t!=null&&t.error&&Xv(`Error while retrieving App Check token: ${t.error}`),t==null?void 0:t.token}}function pa(n){return de(n)}class id{constructor(e){this.auth=e,this.observer=null,this.addObserver=Vy(t=>this.observer=t)}get next(){return K(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}/**
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
 */let bc={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function wE(n){bc=n}function TE(n){return bc.loadJS(n)}function IE(){return bc.gapiScript}function bE(n){return`__${n}${Math.floor(Math.random()*1e6)}`}/**
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
 */function CE(n,e){const t=ma(n,"auth");if(t.isInitialized()){const i=t.getImmediate(),r=t.getOptions();if(So(r,e??{}))return i;Ft(i,"already-initialized")}return t.initialize({options:e})}function RE(n,e){const t=(e==null?void 0:e.persistence)||[],s=(Array.isArray(t)?t:[t]).map(Jt);e!=null&&e.errorMap&&n._updateErrorMap(e.errorMap),n._initializeWithPersistence(s,e==null?void 0:e.popupRedirectResolver)}function SE(n,e,t){const s=pa(n);K(s._canInitEmulator,s,"emulator-config-failed"),K(/^https?:\/\//.test(e),s,"invalid-emulator-scheme");const i=!1,r=Sm(e),{host:o,port:l}=AE(e),c=l===null?"":`:${l}`;s.config.emulator={url:`${r}//${o}${c}/`},s.settings.appVerificationDisabledForTesting=!0,s.emulatorConfig=Object.freeze({host:o,port:l,protocol:r.replace(":",""),options:Object.freeze({disableWarnings:i})}),kE()}function Sm(n){const e=n.indexOf(":");return e<0?"":n.substr(0,e+1)}function AE(n){const e=Sm(n),t=/(\/\/)?([^?#/]+)/.exec(n.substr(e.length));if(!t)return{host:"",port:null};const s=t[2].split("@").pop()||"",i=/^(\[[^\]]+\])(:|$)/.exec(s);if(i){const r=i[1];return{host:r,port:rd(s.substr(r.length+1))}}else{const[r,o]=s.split(":");return{host:r,port:rd(o)}}}function rd(n){if(!n)return null;const e=Number(n);return isNaN(e)?null:e}function kE(){function n(){const e=document.createElement("p"),t=e.style;e.innerText="Running in emulator mode. Do not use with production credentials.",t.position="fixed",t.width="100%",t.backgroundColor="#ffffff",t.border=".1em solid #000000",t.color="#b50000",t.bottom="0px",t.left="0px",t.margin="0px",t.zIndex="10000",t.textAlign="center",e.classList.add("firebase-emulator-warning"),document.body.appendChild(e)}typeof console<"u"&&typeof console.info=="function"&&console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials."),typeof window<"u"&&typeof document<"u"&&(document.readyState==="loading"?window.addEventListener("DOMContentLoaded",n):n())}/**
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
 */class Am{constructor(e,t){this.providerId=e,this.signInMethod=t}toJSON(){return Yt("not implemented")}_getIdTokenResponse(e){return Yt("not implemented")}_linkToIdToken(e,t){return Yt("not implemented")}_getReauthenticationResolver(e){return Yt("not implemented")}}/**
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
 */async function xs(n,e){return iE(n,"POST","/v1/accounts:signInWithIdp",wc(n,e))}/**
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
 */const PE="http://localhost";class ss extends Am{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(e){const t=new ss(e.providerId,e.signInMethod);return e.idToken||e.accessToken?(e.idToken&&(t.idToken=e.idToken),e.accessToken&&(t.accessToken=e.accessToken),e.nonce&&!e.pendingToken&&(t.nonce=e.nonce),e.pendingToken&&(t.pendingToken=e.pendingToken)):e.oauthToken&&e.oauthTokenSecret?(t.accessToken=e.oauthToken,t.secret=e.oauthTokenSecret):Ft("argument-error"),t}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(e){const t=typeof e=="string"?JSON.parse(e):e,{providerId:s,signInMethod:i}=t,r=_c(t,["providerId","signInMethod"]);if(!s||!i)return null;const o=new ss(s,i);return o.idToken=r.idToken||void 0,o.accessToken=r.accessToken||void 0,o.secret=r.secret,o.nonce=r.nonce,o.pendingToken=r.pendingToken||null,o}_getIdTokenResponse(e){const t=this.buildRequest();return xs(e,t)}_linkToIdToken(e,t){const s=this.buildRequest();return s.idToken=t,xs(e,s)}_getReauthenticationResolver(e){const t=this.buildRequest();return t.autoCreate=!1,xs(e,t)}buildRequest(){const e={requestUri:PE,returnSecureToken:!0};if(this.pendingToken)e.pendingToken=this.pendingToken;else{const t={};this.idToken&&(t.id_token=this.idToken),this.accessToken&&(t.access_token=this.accessToken),this.secret&&(t.oauth_token_secret=this.secret),t.providerId=this.providerId,this.nonce&&!this.pendingToken&&(t.nonce=this.nonce),e.postBody=ei(t)}return e}}/**
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
 */class Cc{constructor(e){this.providerId=e,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(e){this.defaultLanguageCode=e}setCustomParameters(e){return this.customParameters=e,this}getCustomParameters(){return this.customParameters}}/**
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
 */class _r extends Cc{constructor(){super(...arguments),this.scopes=[]}addScope(e){return this.scopes.includes(e)||this.scopes.push(e),this}getScopes(){return[...this.scopes]}}/**
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
 */class gn extends _r{constructor(){super("facebook.com")}static credential(e){return ss._fromParams({providerId:gn.PROVIDER_ID,signInMethod:gn.FACEBOOK_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return gn.credentialFromTaggedObject(e)}static credentialFromError(e){return gn.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return gn.credential(e.oauthAccessToken)}catch{return null}}}gn.FACEBOOK_SIGN_IN_METHOD="facebook.com";gn.PROVIDER_ID="facebook.com";/**
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
 */class Kt extends _r{constructor(){super("google.com"),this.addScope("profile")}static credential(e,t){return ss._fromParams({providerId:Kt.PROVIDER_ID,signInMethod:Kt.GOOGLE_SIGN_IN_METHOD,idToken:e,accessToken:t})}static credentialFromResult(e){return Kt.credentialFromTaggedObject(e)}static credentialFromError(e){return Kt.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthIdToken:t,oauthAccessToken:s}=e;if(!t&&!s)return null;try{return Kt.credential(t,s)}catch{return null}}}Kt.GOOGLE_SIGN_IN_METHOD="google.com";Kt.PROVIDER_ID="google.com";/**
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
 */class _n extends _r{constructor(){super("github.com")}static credential(e){return ss._fromParams({providerId:_n.PROVIDER_ID,signInMethod:_n.GITHUB_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return _n.credentialFromTaggedObject(e)}static credentialFromError(e){return _n.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return _n.credential(e.oauthAccessToken)}catch{return null}}}_n.GITHUB_SIGN_IN_METHOD="github.com";_n.PROVIDER_ID="github.com";/**
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
 */class yn extends _r{constructor(){super("twitter.com")}static credential(e,t){return ss._fromParams({providerId:yn.PROVIDER_ID,signInMethod:yn.TWITTER_SIGN_IN_METHOD,oauthToken:e,oauthTokenSecret:t})}static credentialFromResult(e){return yn.credentialFromTaggedObject(e)}static credentialFromError(e){return yn.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthAccessToken:t,oauthTokenSecret:s}=e;if(!t||!s)return null;try{return yn.credential(t,s)}catch{return null}}}yn.TWITTER_SIGN_IN_METHOD="twitter.com";yn.PROVIDER_ID="twitter.com";/**
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
 */class Bs{constructor(e){this.user=e.user,this.providerId=e.providerId,this._tokenResponse=e._tokenResponse,this.operationType=e.operationType}static async _fromIdTokenResponse(e,t,s,i=!1){const r=await Xt._fromIdTokenResponse(e,s,i),o=od(s);return new Bs({user:r,providerId:o,_tokenResponse:s,operationType:t})}static async _forOperation(e,t,s){await e._updateTokensIfNecessary(s,!0);const i=od(s);return new Bs({user:e,providerId:i,_tokenResponse:s,operationType:t})}}function od(n){return n.providerId?n.providerId:"phoneNumber"in n?"phone":null}/**
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
 */class No extends ln{constructor(e,t,s,i){var r;super(t.code,t.message),this.operationType=s,this.user=i,Object.setPrototypeOf(this,No.prototype),this.customData={appName:e.name,tenantId:(r=e.tenantId)!==null&&r!==void 0?r:void 0,_serverResponse:t.customData._serverResponse,operationType:s}}static _fromErrorAndOperation(e,t,s,i){return new No(e,t,s,i)}}function km(n,e,t,s){return(e==="reauthenticate"?t._getReauthenticationResolver(n):t._getIdTokenResponse(n)).catch(r=>{throw r.code==="auth/multi-factor-auth-required"?No._fromErrorAndOperation(n,r,e,s):r})}async function NE(n,e,t=!1){const s=await er(n,e._linkToIdToken(n.auth,await n.getIdToken()),t);return Bs._forOperation(n,"link",s)}/**
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
 */async function DE(n,e,t=!1){const{auth:s}=n;if(Qt(s.app))return Promise.reject(Zn(s));const i="reauthenticate";try{const r=await er(n,km(s,i,e,n),t);K(r.idToken,s,"internal-error");const o=Tc(r.idToken);K(o,s,"internal-error");const{sub:l}=o;return K(n.uid===l,s,"user-mismatch"),Bs._forOperation(n,i,r)}catch(r){throw(r==null?void 0:r.code)==="auth/user-not-found"&&Ft(s,"user-mismatch"),r}}/**
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
 */async function xE(n,e,t=!1){if(Qt(n.app))return Promise.reject(Zn(n));const s="signIn",i=await km(n,s,e),r=await Bs._fromIdTokenResponse(n,s,i);return t||await n._updateCurrentUser(r.user),r}function ME(n,e,t,s){return de(n).onIdTokenChanged(e,t,s)}function LE(n,e,t){return de(n).beforeAuthStateChanged(e,t)}function Pm(n,e,t,s){return de(n).onAuthStateChanged(e,t,s)}function OE(n){return de(n).signOut()}const Do="__sak";/**
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
 */class Nm{constructor(e,t){this.storageRetriever=e,this.type=t}_isAvailable(){try{return this.storage?(this.storage.setItem(Do,"1"),this.storage.removeItem(Do),Promise.resolve(!0)):Promise.resolve(!1)}catch{return Promise.resolve(!1)}}_set(e,t){return this.storage.setItem(e,JSON.stringify(t)),Promise.resolve()}_get(e){const t=this.storage.getItem(e);return Promise.resolve(t?JSON.parse(t):null)}_remove(e){return this.storage.removeItem(e),Promise.resolve()}get storage(){return this.storageRetriever()}}/**
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
 */const VE=1e3,FE=10;class Dm extends Nm{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(e,t)=>this.onStorageEvent(e,t),this.listeners={},this.localCache={},this.pollTimer=null,this.fallbackToPolling=Cm(),this._shouldAllowMigration=!0}forAllChangedKeys(e){for(const t of Object.keys(this.listeners)){const s=this.storage.getItem(t),i=this.localCache[t];s!==i&&e(t,i,s)}}onStorageEvent(e,t=!1){if(!e.key){this.forAllChangedKeys((o,l,c)=>{this.notifyListeners(o,c)});return}const s=e.key;t?this.detachListener():this.stopPolling();const i=()=>{const o=this.storage.getItem(s);!t&&this.localCache[s]===o||this.notifyListeners(s,o)},r=this.storage.getItem(s);pE()&&r!==e.newValue&&e.newValue!==e.oldValue?setTimeout(i,FE):i()}notifyListeners(e,t){this.localCache[e]=t;const s=this.listeners[e];if(s)for(const i of Array.from(s))i(t&&JSON.parse(t))}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((e,t,s)=>{this.onStorageEvent(new StorageEvent("storage",{key:e,oldValue:t,newValue:s}),!0)})},VE)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(e,t){Object.keys(this.listeners).length===0&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[e]||(this.listeners[e]=new Set,this.localCache[e]=this.storage.getItem(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.detachListener(),this.stopPolling())}async _set(e,t){await super._set(e,t),this.localCache[e]=JSON.stringify(t)}async _get(e){const t=await super._get(e);return this.localCache[e]=JSON.stringify(t),t}async _remove(e){await super._remove(e),delete this.localCache[e]}}Dm.type="LOCAL";const BE=Dm;/**
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
 */class xm extends Nm{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(e,t){}_removeListener(e,t){}}xm.type="SESSION";const Mm=xm;/**
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
 */class ga{constructor(e){this.eventTarget=e,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(e){const t=this.receivers.find(i=>i.isListeningto(e));if(t)return t;const s=new ga(e);return this.receivers.push(s),s}isListeningto(e){return this.eventTarget===e}async handleEvent(e){const t=e,{eventId:s,eventType:i,data:r}=t.data,o=this.handlersMap[i];if(!(o!=null&&o.size))return;t.ports[0].postMessage({status:"ack",eventId:s,eventType:i});const l=Array.from(o).map(async h=>h(t.origin,r)),c=await UE(l);t.ports[0].postMessage({status:"done",eventId:s,eventType:i,response:c})}_subscribe(e,t){Object.keys(this.handlersMap).length===0&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[e]||(this.handlersMap[e]=new Set),this.handlersMap[e].add(t)}_unsubscribe(e,t){this.handlersMap[e]&&t&&this.handlersMap[e].delete(t),(!t||this.handlersMap[e].size===0)&&delete this.handlersMap[e],Object.keys(this.handlersMap).length===0&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}}ga.receivers=[];/**
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
 */function Rc(n="",e=10){let t="";for(let s=0;s<e;s++)t+=Math.floor(Math.random()*10);return n+t}/**
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
 */class jE{constructor(e){this.target=e,this.handlers=new Set}removeMessageHandler(e){e.messageChannel&&(e.messageChannel.port1.removeEventListener("message",e.onMessage),e.messageChannel.port1.close()),this.handlers.delete(e)}async _send(e,t,s=50){const i=typeof MessageChannel<"u"?new MessageChannel:null;if(!i)throw new Error("connection_unavailable");let r,o;return new Promise((l,c)=>{const h=Rc("",20);i.port1.start();const d=setTimeout(()=>{c(new Error("unsupported_event"))},s);o={messageChannel:i,onMessage(m){const p=m;if(p.data.eventId===h)switch(p.data.status){case"ack":clearTimeout(d),r=setTimeout(()=>{c(new Error("timeout"))},3e3);break;case"done":clearTimeout(r),l(p.data.response);break;default:clearTimeout(d),clearTimeout(r),c(new Error("invalid_response"));break}}},this.handlers.add(o),i.port1.addEventListener("message",o.onMessage),this.target.postMessage({eventType:e,eventId:h,data:t},[i.port2])}).finally(()=>{o&&this.removeMessageHandler(o)})}}/**
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
 */function Lt(){return window}function WE(n){Lt().location.href=n}/**
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
 */function Lm(){return typeof Lt().WorkerGlobalScope<"u"&&typeof Lt().importScripts=="function"}async function qE(){if(!(navigator!=null&&navigator.serviceWorker))return null;try{return(await navigator.serviceWorker.ready).active}catch{return null}}function $E(){var n;return((n=navigator==null?void 0:navigator.serviceWorker)===null||n===void 0?void 0:n.controller)||null}function zE(){return Lm()?self:null}/**
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
 */const Om="firebaseLocalStorageDb",HE=1,xo="firebaseLocalStorage",Vm="fbase_key";class yr{constructor(e){this.request=e}toPromise(){return new Promise((e,t)=>{this.request.addEventListener("success",()=>{e(this.request.result)}),this.request.addEventListener("error",()=>{t(this.request.error)})})}}function _a(n,e){return n.transaction([xo],e?"readwrite":"readonly").objectStore(xo)}function GE(){const n=indexedDB.deleteDatabase(Om);return new yr(n).toPromise()}function Fl(){const n=indexedDB.open(Om,HE);return new Promise((e,t)=>{n.addEventListener("error",()=>{t(n.error)}),n.addEventListener("upgradeneeded",()=>{const s=n.result;try{s.createObjectStore(xo,{keyPath:Vm})}catch(i){t(i)}}),n.addEventListener("success",async()=>{const s=n.result;s.objectStoreNames.contains(xo)?e(s):(s.close(),await GE(),e(await Fl()))})})}async function ad(n,e,t){const s=_a(n,!0).put({[Vm]:e,value:t});return new yr(s).toPromise()}async function KE(n,e){const t=_a(n,!1).get(e),s=await new yr(t).toPromise();return s===void 0?null:s.value}function ld(n,e){const t=_a(n,!0).delete(e);return new yr(t).toPromise()}const QE=800,YE=3;class Fm{constructor(){this.type="LOCAL",this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){return this.db?this.db:(this.db=await Fl(),this.db)}async _withRetries(e){let t=0;for(;;)try{const s=await this._openDb();return await e(s)}catch(s){if(t++>YE)throw s;this.db&&(this.db.close(),this.db=void 0)}}async initializeServiceWorkerMessaging(){return Lm()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=ga._getInstance(zE()),this.receiver._subscribe("keyChanged",async(e,t)=>({keyProcessed:(await this._poll()).includes(t.key)})),this.receiver._subscribe("ping",async(e,t)=>["keyChanged"])}async initializeSender(){var e,t;if(this.activeServiceWorker=await qE(),!this.activeServiceWorker)return;this.sender=new jE(this.activeServiceWorker);const s=await this.sender._send("ping",{},800);s&&!((e=s[0])===null||e===void 0)&&e.fulfilled&&!((t=s[0])===null||t===void 0)&&t.value.includes("keyChanged")&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(e){if(!(!this.sender||!this.activeServiceWorker||$E()!==this.activeServiceWorker))try{await this.sender._send("keyChanged",{key:e},this.serviceWorkerReceiverAvailable?800:50)}catch{}}async _isAvailable(){try{if(!indexedDB)return!1;const e=await Fl();return await ad(e,Do,"1"),await ld(e,Do),!0}catch{}return!1}async _withPendingWrite(e){this.pendingWrites++;try{await e()}finally{this.pendingWrites--}}async _set(e,t){return this._withPendingWrite(async()=>(await this._withRetries(s=>ad(s,e,t)),this.localCache[e]=t,this.notifyServiceWorker(e)))}async _get(e){const t=await this._withRetries(s=>KE(s,e));return this.localCache[e]=t,t}async _remove(e){return this._withPendingWrite(async()=>(await this._withRetries(t=>ld(t,e)),delete this.localCache[e],this.notifyServiceWorker(e)))}async _poll(){const e=await this._withRetries(i=>{const r=_a(i,!1).getAll();return new yr(r).toPromise()});if(!e)return[];if(this.pendingWrites!==0)return[];const t=[],s=new Set;if(e.length!==0)for(const{fbase_key:i,value:r}of e)s.add(i),JSON.stringify(this.localCache[i])!==JSON.stringify(r)&&(this.notifyListeners(i,r),t.push(i));for(const i of Object.keys(this.localCache))this.localCache[i]&&!s.has(i)&&(this.notifyListeners(i,null),t.push(i));return t}notifyListeners(e,t){this.localCache[e]=t;const s=this.listeners[e];if(s)for(const i of Array.from(s))i(t)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),QE)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(e,t){Object.keys(this.listeners).length===0&&this.startPolling(),this.listeners[e]||(this.listeners[e]=new Set,this._get(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&this.stopPolling()}}Fm.type="LOCAL";const XE=Fm;new gr(3e4,6e4);/**
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
 */function Bm(n,e){return e?Jt(e):(K(n._popupRedirectResolver,n,"argument-error"),n._popupRedirectResolver)}/**
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
 */class Sc extends Am{constructor(e){super("custom","custom"),this.params=e}_getIdTokenResponse(e){return xs(e,this._buildIdpRequest())}_linkToIdToken(e,t){return xs(e,this._buildIdpRequest(t))}_getReauthenticationResolver(e){return xs(e,this._buildIdpRequest())}_buildIdpRequest(e){const t={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return e&&(t.idToken=e),t}}function JE(n){return xE(n.auth,new Sc(n),n.bypassAuthState)}function ZE(n){const{auth:e,user:t}=n;return K(t,e,"internal-error"),DE(t,new Sc(n),n.bypassAuthState)}async function ew(n){const{auth:e,user:t}=n;return K(t,e,"internal-error"),NE(t,new Sc(n),n.bypassAuthState)}/**
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
 */class Um{constructor(e,t,s,i,r=!1){this.auth=e,this.resolver=s,this.user=i,this.bypassAuthState=r,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(t)?t:[t]}execute(){return new Promise(async(e,t)=>{this.pendingPromise={resolve:e,reject:t};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(s){this.reject(s)}})}async onAuthEvent(e){const{urlResponse:t,sessionId:s,postBody:i,tenantId:r,error:o,type:l}=e;if(o){this.reject(o);return}const c={auth:this.auth,requestUri:t,sessionId:s,tenantId:r||void 0,postBody:i||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(l)(c))}catch(h){this.reject(h)}}onError(e){this.reject(e)}getIdpTask(e){switch(e){case"signInViaPopup":case"signInViaRedirect":return JE;case"linkViaPopup":case"linkViaRedirect":return ew;case"reauthViaPopup":case"reauthViaRedirect":return ZE;default:Ft(this.auth,"internal-error")}}resolve(e){sn(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(e),this.unregisterAndCleanUp()}reject(e){sn(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(e),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}}/**
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
 */const tw=new gr(2e3,1e4);async function nw(n,e,t){if(Qt(n.app))return Promise.reject(kt(n,"operation-not-supported-in-this-environment"));const s=pa(n);Jv(n,e,Cc);const i=Bm(s,t);return new Qn(s,"signInViaPopup",e,i).executeNotNull()}class Qn extends Um{constructor(e,t,s,i,r){super(e,t,i,r),this.provider=s,this.authWindow=null,this.pollId=null,Qn.currentPopupAction&&Qn.currentPopupAction.cancel(),Qn.currentPopupAction=this}async executeNotNull(){const e=await this.execute();return K(e,this.auth,"internal-error"),e}async onExecution(){sn(this.filter.length===1,"Popup operations only handle one event");const e=Rc();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],e),this.authWindow.associatedEvent=e,this.resolver._originValidation(this.auth).catch(t=>{this.reject(t)}),this.resolver._isIframeWebStorageSupported(this.auth,t=>{t||this.reject(kt(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){var e;return((e=this.authWindow)===null||e===void 0?void 0:e.associatedEvent)||null}cancel(){this.reject(kt(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,Qn.currentPopupAction=null}pollUserCancellation(){const e=()=>{var t,s;if(!((s=(t=this.authWindow)===null||t===void 0?void 0:t.window)===null||s===void 0)&&s.closed){this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(kt(this.auth,"popup-closed-by-user"))},8e3);return}this.pollId=window.setTimeout(e,tw.get())};e()}}Qn.currentPopupAction=null;/**
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
 */const sw="pendingRedirect",mo=new Map;class iw extends Um{constructor(e,t,s=!1){super(e,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],t,void 0,s),this.eventId=null}async execute(){let e=mo.get(this.auth._key());if(!e){try{const s=await rw(this.resolver,this.auth)?await super.execute():null;e=()=>Promise.resolve(s)}catch(t){e=()=>Promise.reject(t)}mo.set(this.auth._key(),e)}return this.bypassAuthState||mo.set(this.auth._key(),()=>Promise.resolve(null)),e()}async onAuthEvent(e){if(e.type==="signInViaRedirect")return super.onAuthEvent(e);if(e.type==="unknown"){this.resolve(null);return}if(e.eventId){const t=await this.auth._redirectUserForId(e.eventId);if(t)return this.user=t,super.onAuthEvent(e);this.resolve(null)}}async onExecution(){}cleanUp(){}}async function rw(n,e){const t=lw(e),s=aw(n);if(!await s._isAvailable())return!1;const i=await s._get(t)==="true";return await s._remove(t),i}function ow(n,e){mo.set(n._key(),e)}function aw(n){return Jt(n._redirectPersistence)}function lw(n){return fo(sw,n.config.apiKey,n.name)}async function cw(n,e,t=!1){if(Qt(n.app))return Promise.reject(Zn(n));const s=pa(n),i=Bm(s,e),o=await new iw(s,i,t).execute();return o&&!t&&(delete o.user._redirectEventId,await s._persistUserIfCurrent(o.user),await s._setRedirectUser(null,e)),o}/**
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
 */const hw=10*60*1e3;class uw{constructor(e){this.auth=e,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(e){this.consumers.add(e),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,e)&&(this.sendToConsumer(this.queuedRedirectEvent,e),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(e){this.consumers.delete(e)}onEvent(e){if(this.hasEventBeenHandled(e))return!1;let t=!1;return this.consumers.forEach(s=>{this.isEventForConsumer(e,s)&&(t=!0,this.sendToConsumer(e,s),this.saveEventToCache(e))}),this.hasHandledPotentialRedirect||!dw(e)||(this.hasHandledPotentialRedirect=!0,t||(this.queuedRedirectEvent=e,t=!0)),t}sendToConsumer(e,t){var s;if(e.error&&!jm(e)){const i=((s=e.error.code)===null||s===void 0?void 0:s.split("auth/")[1])||"internal-error";t.onError(kt(this.auth,i))}else t.onAuthEvent(e)}isEventForConsumer(e,t){const s=t.eventId===null||!!e.eventId&&e.eventId===t.eventId;return t.filter.includes(e.type)&&s}hasEventBeenHandled(e){return Date.now()-this.lastProcessedEventTime>=hw&&this.cachedEventUids.clear(),this.cachedEventUids.has(cd(e))}saveEventToCache(e){this.cachedEventUids.add(cd(e)),this.lastProcessedEventTime=Date.now()}}function cd(n){return[n.type,n.eventId,n.sessionId,n.tenantId].filter(e=>e).join("-")}function jm({type:n,error:e}){return n==="unknown"&&(e==null?void 0:e.code)==="auth/no-auth-event"}function dw(n){switch(n.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return jm(n);default:return!1}}/**
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
 */async function fw(n,e={}){return ti(n,"GET","/v1/projects",e)}/**
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
 */const mw=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,pw=/^https?/;async function gw(n){if(n.config.emulator)return;const{authorizedDomains:e}=await fw(n);for(const t of e)try{if(_w(t))return}catch{}Ft(n,"unauthorized-domain")}function _w(n){const e=Ol(),{protocol:t,hostname:s}=new URL(e);if(n.startsWith("chrome-extension://")){const o=new URL(n);return o.hostname===""&&s===""?t==="chrome-extension:"&&n.replace("chrome-extension://","")===e.replace("chrome-extension://",""):t==="chrome-extension:"&&o.hostname===s}if(!pw.test(t))return!1;if(mw.test(n))return s===n;const i=n.replace(/\./g,"\\.");return new RegExp("^(.+\\."+i+"|"+i+")$","i").test(s)}/**
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
 */const yw=new gr(3e4,6e4);function hd(){const n=Lt().___jsl;if(n!=null&&n.H){for(const e of Object.keys(n.H))if(n.H[e].r=n.H[e].r||[],n.H[e].L=n.H[e].L||[],n.H[e].r=[...n.H[e].L],n.CP)for(let t=0;t<n.CP.length;t++)n.CP[t]=null}}function vw(n){return new Promise((e,t)=>{var s,i,r;function o(){hd(),gapi.load("gapi.iframes",{callback:()=>{e(gapi.iframes.getContext())},ontimeout:()=>{hd(),t(kt(n,"network-request-failed"))},timeout:yw.get()})}if(!((i=(s=Lt().gapi)===null||s===void 0?void 0:s.iframes)===null||i===void 0)&&i.Iframe)e(gapi.iframes.getContext());else if(!((r=Lt().gapi)===null||r===void 0)&&r.load)o();else{const l=bE("iframefcb");return Lt()[l]=()=>{gapi.load?o():t(kt(n,"network-request-failed"))},TE(`${IE()}?onload=${l}`).catch(c=>t(c))}}).catch(e=>{throw po=null,e})}let po=null;function Ew(n){return po=po||vw(n),po}/**
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
 */const ww=new gr(5e3,15e3),Tw="__/auth/iframe",Iw="emulator/auth/iframe",bw={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},Cw=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function Rw(n){const e=n.config;K(e.authDomain,n,"auth-domain-config-required");const t=e.emulator?Ec(e,Iw):`https://${n.config.authDomain}/${Tw}`,s={apiKey:e.apiKey,appName:n.name,v:us},i=Cw.get(n.config.apiHost);i&&(s.eid=i);const r=n._getFrameworks();return r.length&&(s.fw=r.join(",")),`${t}?${ei(s).slice(1)}`}async function Sw(n){const e=await Ew(n),t=Lt().gapi;return K(t,n,"internal-error"),e.open({where:document.body,url:Rw(n),messageHandlersFilter:t.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:bw,dontclear:!0},s=>new Promise(async(i,r)=>{await s.restyle({setHideOnLeave:!1});const o=kt(n,"network-request-failed"),l=Lt().setTimeout(()=>{r(o)},ww.get());function c(){Lt().clearTimeout(l),i(s)}s.ping(c).then(c,()=>{r(o)})}))}/**
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
 */const Aw={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"},kw=500,Pw=600,Nw="_blank",Dw="http://localhost";class ud{constructor(e){this.window=e,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch{}}}function xw(n,e,t,s=kw,i=Pw){const r=Math.max((window.screen.availHeight-i)/2,0).toString(),o=Math.max((window.screen.availWidth-s)/2,0).toString();let l="";const c=Object.assign(Object.assign({},Aw),{width:s.toString(),height:i.toString(),top:r,left:o}),h=rt().toLowerCase();t&&(l=Em(h)?Nw:t),ym(h)&&(e=e||Dw,c.scrollbars="yes");const d=Object.entries(c).reduce((p,[E,b])=>`${p}${E}=${b},`,"");if(mE(h)&&l!=="_self")return Mw(e||"",l),new ud(null);const m=window.open(e||"",l,d);K(m,n,"popup-blocked");try{m.focus()}catch{}return new ud(m)}function Mw(n,e){const t=document.createElement("a");t.href=n,t.target=e;const s=document.createEvent("MouseEvent");s.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),t.dispatchEvent(s)}/**
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
 */const Lw="__/auth/handler",Ow="emulator/auth/handler",Vw=encodeURIComponent("fac");async function dd(n,e,t,s,i,r){K(n.config.authDomain,n,"auth-domain-config-required"),K(n.config.apiKey,n,"invalid-api-key");const o={apiKey:n.config.apiKey,appName:n.name,authType:t,redirectUrl:s,v:us,eventId:i};if(e instanceof Cc){e.setDefaultLanguage(n.languageCode),o.providerId=e.providerId||"",Co(e.getCustomParameters())||(o.customParameters=JSON.stringify(e.getCustomParameters()));for(const[d,m]of Object.entries({}))o[d]=m}if(e instanceof _r){const d=e.getScopes().filter(m=>m!=="");d.length>0&&(o.scopes=d.join(","))}n.tenantId&&(o.tid=n.tenantId);const l=o;for(const d of Object.keys(l))l[d]===void 0&&delete l[d];const c=await n._getAppCheckToken(),h=c?`#${Vw}=${encodeURIComponent(c)}`:"";return`${Fw(n)}?${ei(l).slice(1)}${h}`}function Fw({config:n}){return n.emulator?Ec(n,Ow):`https://${n.authDomain}/${Lw}`}/**
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
 */const gl="webStorageSupport";class Bw{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=Mm,this._completeRedirectFn=cw,this._overrideRedirectResult=ow}async _openPopup(e,t,s,i){var r;sn((r=this.eventManagers[e._key()])===null||r===void 0?void 0:r.manager,"_initialize() not called before _openPopup()");const o=await dd(e,t,s,Ol(),i);return xw(e,o,Rc())}async _openRedirect(e,t,s,i){await this._originValidation(e);const r=await dd(e,t,s,Ol(),i);return WE(r),new Promise(()=>{})}_initialize(e){const t=e._key();if(this.eventManagers[t]){const{manager:i,promise:r}=this.eventManagers[t];return i?Promise.resolve(i):(sn(r,"If manager is not set, promise should be"),r)}const s=this.initAndGetManager(e);return this.eventManagers[t]={promise:s},s.catch(()=>{delete this.eventManagers[t]}),s}async initAndGetManager(e){const t=await Sw(e),s=new uw(e);return t.register("authEvent",i=>(K(i==null?void 0:i.authEvent,e,"invalid-auth-event"),{status:s.onEvent(i.authEvent)?"ACK":"ERROR"}),gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[e._key()]={manager:s},this.iframes[e._key()]=t,s}_isIframeWebStorageSupported(e,t){this.iframes[e._key()].send(gl,{type:gl},i=>{var r;const o=(r=i==null?void 0:i[0])===null||r===void 0?void 0:r[gl];o!==void 0&&t(!!o),Ft(e,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(e){const t=e._key();return this.originValidationPromises[t]||(this.originValidationPromises[t]=gw(e)),this.originValidationPromises[t]}get _shouldInitProactively(){return Cm()||vm()||Ic()}}const Uw=Bw;var fd="@firebase/auth",md="1.7.9";/**
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
 */class jw{constructor(e){this.auth=e,this.internalListeners=new Map}getUid(){var e;return this.assertAuthConfigured(),((e=this.auth.currentUser)===null||e===void 0?void 0:e.uid)||null}async getToken(e){return this.assertAuthConfigured(),await this.auth._initializationPromise,this.auth.currentUser?{accessToken:await this.auth.currentUser.getIdToken(e)}:null}addAuthTokenListener(e){if(this.assertAuthConfigured(),this.internalListeners.has(e))return;const t=this.auth.onIdTokenChanged(s=>{e((s==null?void 0:s.stsTokenManager.accessToken)||null)});this.internalListeners.set(e,t),this.updateProactiveRefresh()}removeAuthTokenListener(e){this.assertAuthConfigured();const t=this.internalListeners.get(e);t&&(this.internalListeners.delete(e),t(),this.updateProactiveRefresh())}assertAuthConfigured(){K(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}/**
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
 */function Ww(n){switch(n){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}function qw(n){ns(new Sn("auth",(e,{options:t})=>{const s=e.getProvider("app").getImmediate(),i=e.getProvider("heartbeat"),r=e.getProvider("app-check-internal"),{apiKey:o,authDomain:l}=s.options;K(o&&!o.includes(":"),"invalid-api-key",{appName:s.name});const c={apiKey:o,authDomain:l,clientPlatform:n,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:Rm(n)},h=new EE(s,i,r,c);return RE(h,t),h},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,t,s)=>{e.getProvider("auth-internal").initialize()})),ns(new Sn("auth-internal",e=>{const t=pa(e.getProvider("auth").getImmediate());return(s=>new jw(s))(t)},"PRIVATE").setInstantiationMode("EXPLICIT")),Mt(fd,md,Ww(n)),Mt(fd,md,"esm2017")}/**
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
 */const $w=5*60,zw=tm("authIdTokenMaxAge")||$w;let pd=null;const Hw=n=>async e=>{const t=e&&await e.getIdTokenResult(),s=t&&(new Date().getTime()-Date.parse(t.issuedAtTime))/1e3;if(s&&s>zw)return;const i=t==null?void 0:t.token;pd!==i&&(pd=i,await fetch(n,{method:i?"POST":"DELETE",headers:i?{Authorization:`Bearer ${i}`}:{}}))};function Gw(n=gc()){const e=ma(n,"auth");if(e.isInitialized())return e.getImmediate();const t=CE(n,{popupRedirectResolver:Uw,persistence:[XE,BE,Mm]}),s=tm("authTokenSyncURL");if(s&&typeof isSecureContext=="boolean"&&isSecureContext){const r=new URL(s,location.origin);if(location.origin===r.origin){const o=Hw(r.toString());LE(t,o,()=>o(t.currentUser)),ME(t,l=>o(l))}}const i=Jf("auth");return i&&SE(t,`http://${i}`),t}function Kw(){var n,e;return(e=(n=document.getElementsByTagName("head"))===null||n===void 0?void 0:n[0])!==null&&e!==void 0?e:document}wE({loadJS(n){return new Promise((e,t)=>{const s=document.createElement("script");s.setAttribute("src",n),s.onload=e,s.onerror=i=>{const r=kt("internal-error");r.customData=i,t(r)},s.type="text/javascript",s.charset="UTF-8",Kw().appendChild(s)})},gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="});qw("Browser");var gd=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var es,Wm;(function(){var n;/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/function e(I,y){function _(){}_.prototype=y.prototype,I.D=y.prototype,I.prototype=new _,I.prototype.constructor=I,I.C=function(w,T,C){for(var v=Array(arguments.length-2),H=2;H<arguments.length;H++)v[H-2]=arguments[H];return y.prototype[T].apply(w,v)}}function t(){this.blockSize=-1}function s(){this.blockSize=-1,this.blockSize=64,this.g=Array(4),this.B=Array(this.blockSize),this.o=this.h=0,this.s()}e(s,t),s.prototype.s=function(){this.g[0]=1732584193,this.g[1]=4023233417,this.g[2]=2562383102,this.g[3]=271733878,this.o=this.h=0};function i(I,y,_){_||(_=0);var w=Array(16);if(typeof y=="string")for(var T=0;16>T;++T)w[T]=y.charCodeAt(_++)|y.charCodeAt(_++)<<8|y.charCodeAt(_++)<<16|y.charCodeAt(_++)<<24;else for(T=0;16>T;++T)w[T]=y[_++]|y[_++]<<8|y[_++]<<16|y[_++]<<24;y=I.g[0],_=I.g[1],T=I.g[2];var C=I.g[3],v=y+(C^_&(T^C))+w[0]+3614090360&4294967295;y=_+(v<<7&4294967295|v>>>25),v=C+(T^y&(_^T))+w[1]+3905402710&4294967295,C=y+(v<<12&4294967295|v>>>20),v=T+(_^C&(y^_))+w[2]+606105819&4294967295,T=C+(v<<17&4294967295|v>>>15),v=_+(y^T&(C^y))+w[3]+3250441966&4294967295,_=T+(v<<22&4294967295|v>>>10),v=y+(C^_&(T^C))+w[4]+4118548399&4294967295,y=_+(v<<7&4294967295|v>>>25),v=C+(T^y&(_^T))+w[5]+1200080426&4294967295,C=y+(v<<12&4294967295|v>>>20),v=T+(_^C&(y^_))+w[6]+2821735955&4294967295,T=C+(v<<17&4294967295|v>>>15),v=_+(y^T&(C^y))+w[7]+4249261313&4294967295,_=T+(v<<22&4294967295|v>>>10),v=y+(C^_&(T^C))+w[8]+1770035416&4294967295,y=_+(v<<7&4294967295|v>>>25),v=C+(T^y&(_^T))+w[9]+2336552879&4294967295,C=y+(v<<12&4294967295|v>>>20),v=T+(_^C&(y^_))+w[10]+4294925233&4294967295,T=C+(v<<17&4294967295|v>>>15),v=_+(y^T&(C^y))+w[11]+2304563134&4294967295,_=T+(v<<22&4294967295|v>>>10),v=y+(C^_&(T^C))+w[12]+1804603682&4294967295,y=_+(v<<7&4294967295|v>>>25),v=C+(T^y&(_^T))+w[13]+4254626195&4294967295,C=y+(v<<12&4294967295|v>>>20),v=T+(_^C&(y^_))+w[14]+2792965006&4294967295,T=C+(v<<17&4294967295|v>>>15),v=_+(y^T&(C^y))+w[15]+1236535329&4294967295,_=T+(v<<22&4294967295|v>>>10),v=y+(T^C&(_^T))+w[1]+4129170786&4294967295,y=_+(v<<5&4294967295|v>>>27),v=C+(_^T&(y^_))+w[6]+3225465664&4294967295,C=y+(v<<9&4294967295|v>>>23),v=T+(y^_&(C^y))+w[11]+643717713&4294967295,T=C+(v<<14&4294967295|v>>>18),v=_+(C^y&(T^C))+w[0]+3921069994&4294967295,_=T+(v<<20&4294967295|v>>>12),v=y+(T^C&(_^T))+w[5]+3593408605&4294967295,y=_+(v<<5&4294967295|v>>>27),v=C+(_^T&(y^_))+w[10]+38016083&4294967295,C=y+(v<<9&4294967295|v>>>23),v=T+(y^_&(C^y))+w[15]+3634488961&4294967295,T=C+(v<<14&4294967295|v>>>18),v=_+(C^y&(T^C))+w[4]+3889429448&4294967295,_=T+(v<<20&4294967295|v>>>12),v=y+(T^C&(_^T))+w[9]+568446438&4294967295,y=_+(v<<5&4294967295|v>>>27),v=C+(_^T&(y^_))+w[14]+3275163606&4294967295,C=y+(v<<9&4294967295|v>>>23),v=T+(y^_&(C^y))+w[3]+4107603335&4294967295,T=C+(v<<14&4294967295|v>>>18),v=_+(C^y&(T^C))+w[8]+1163531501&4294967295,_=T+(v<<20&4294967295|v>>>12),v=y+(T^C&(_^T))+w[13]+2850285829&4294967295,y=_+(v<<5&4294967295|v>>>27),v=C+(_^T&(y^_))+w[2]+4243563512&4294967295,C=y+(v<<9&4294967295|v>>>23),v=T+(y^_&(C^y))+w[7]+1735328473&4294967295,T=C+(v<<14&4294967295|v>>>18),v=_+(C^y&(T^C))+w[12]+2368359562&4294967295,_=T+(v<<20&4294967295|v>>>12),v=y+(_^T^C)+w[5]+4294588738&4294967295,y=_+(v<<4&4294967295|v>>>28),v=C+(y^_^T)+w[8]+2272392833&4294967295,C=y+(v<<11&4294967295|v>>>21),v=T+(C^y^_)+w[11]+1839030562&4294967295,T=C+(v<<16&4294967295|v>>>16),v=_+(T^C^y)+w[14]+4259657740&4294967295,_=T+(v<<23&4294967295|v>>>9),v=y+(_^T^C)+w[1]+2763975236&4294967295,y=_+(v<<4&4294967295|v>>>28),v=C+(y^_^T)+w[4]+1272893353&4294967295,C=y+(v<<11&4294967295|v>>>21),v=T+(C^y^_)+w[7]+4139469664&4294967295,T=C+(v<<16&4294967295|v>>>16),v=_+(T^C^y)+w[10]+3200236656&4294967295,_=T+(v<<23&4294967295|v>>>9),v=y+(_^T^C)+w[13]+681279174&4294967295,y=_+(v<<4&4294967295|v>>>28),v=C+(y^_^T)+w[0]+3936430074&4294967295,C=y+(v<<11&4294967295|v>>>21),v=T+(C^y^_)+w[3]+3572445317&4294967295,T=C+(v<<16&4294967295|v>>>16),v=_+(T^C^y)+w[6]+76029189&4294967295,_=T+(v<<23&4294967295|v>>>9),v=y+(_^T^C)+w[9]+3654602809&4294967295,y=_+(v<<4&4294967295|v>>>28),v=C+(y^_^T)+w[12]+3873151461&4294967295,C=y+(v<<11&4294967295|v>>>21),v=T+(C^y^_)+w[15]+530742520&4294967295,T=C+(v<<16&4294967295|v>>>16),v=_+(T^C^y)+w[2]+3299628645&4294967295,_=T+(v<<23&4294967295|v>>>9),v=y+(T^(_|~C))+w[0]+4096336452&4294967295,y=_+(v<<6&4294967295|v>>>26),v=C+(_^(y|~T))+w[7]+1126891415&4294967295,C=y+(v<<10&4294967295|v>>>22),v=T+(y^(C|~_))+w[14]+2878612391&4294967295,T=C+(v<<15&4294967295|v>>>17),v=_+(C^(T|~y))+w[5]+4237533241&4294967295,_=T+(v<<21&4294967295|v>>>11),v=y+(T^(_|~C))+w[12]+1700485571&4294967295,y=_+(v<<6&4294967295|v>>>26),v=C+(_^(y|~T))+w[3]+2399980690&4294967295,C=y+(v<<10&4294967295|v>>>22),v=T+(y^(C|~_))+w[10]+4293915773&4294967295,T=C+(v<<15&4294967295|v>>>17),v=_+(C^(T|~y))+w[1]+2240044497&4294967295,_=T+(v<<21&4294967295|v>>>11),v=y+(T^(_|~C))+w[8]+1873313359&4294967295,y=_+(v<<6&4294967295|v>>>26),v=C+(_^(y|~T))+w[15]+4264355552&4294967295,C=y+(v<<10&4294967295|v>>>22),v=T+(y^(C|~_))+w[6]+2734768916&4294967295,T=C+(v<<15&4294967295|v>>>17),v=_+(C^(T|~y))+w[13]+1309151649&4294967295,_=T+(v<<21&4294967295|v>>>11),v=y+(T^(_|~C))+w[4]+4149444226&4294967295,y=_+(v<<6&4294967295|v>>>26),v=C+(_^(y|~T))+w[11]+3174756917&4294967295,C=y+(v<<10&4294967295|v>>>22),v=T+(y^(C|~_))+w[2]+718787259&4294967295,T=C+(v<<15&4294967295|v>>>17),v=_+(C^(T|~y))+w[9]+3951481745&4294967295,I.g[0]=I.g[0]+y&4294967295,I.g[1]=I.g[1]+(T+(v<<21&4294967295|v>>>11))&4294967295,I.g[2]=I.g[2]+T&4294967295,I.g[3]=I.g[3]+C&4294967295}s.prototype.u=function(I,y){y===void 0&&(y=I.length);for(var _=y-this.blockSize,w=this.B,T=this.h,C=0;C<y;){if(T==0)for(;C<=_;)i(this,I,C),C+=this.blockSize;if(typeof I=="string"){for(;C<y;)if(w[T++]=I.charCodeAt(C++),T==this.blockSize){i(this,w),T=0;break}}else for(;C<y;)if(w[T++]=I[C++],T==this.blockSize){i(this,w),T=0;break}}this.h=T,this.o+=y},s.prototype.v=function(){var I=Array((56>this.h?this.blockSize:2*this.blockSize)-this.h);I[0]=128;for(var y=1;y<I.length-8;++y)I[y]=0;var _=8*this.o;for(y=I.length-8;y<I.length;++y)I[y]=_&255,_/=256;for(this.u(I),I=Array(16),y=_=0;4>y;++y)for(var w=0;32>w;w+=8)I[_++]=this.g[y]>>>w&255;return I};function r(I,y){var _=l;return Object.prototype.hasOwnProperty.call(_,I)?_[I]:_[I]=y(I)}function o(I,y){this.h=y;for(var _=[],w=!0,T=I.length-1;0<=T;T--){var C=I[T]|0;w&&C==y||(_[T]=C,w=!1)}this.g=_}var l={};function c(I){return-128<=I&&128>I?r(I,function(y){return new o([y|0],0>y?-1:0)}):new o([I|0],0>I?-1:0)}function h(I){if(isNaN(I)||!isFinite(I))return m;if(0>I)return P(h(-I));for(var y=[],_=1,w=0;I>=_;w++)y[w]=I/_|0,_*=4294967296;return new o(y,0)}function d(I,y){if(I.length==0)throw Error("number format error: empty string");if(y=y||10,2>y||36<y)throw Error("radix out of range: "+y);if(I.charAt(0)=="-")return P(d(I.substring(1),y));if(0<=I.indexOf("-"))throw Error('number format error: interior "-" character');for(var _=h(Math.pow(y,8)),w=m,T=0;T<I.length;T+=8){var C=Math.min(8,I.length-T),v=parseInt(I.substring(T,T+C),y);8>C?(C=h(Math.pow(y,C)),w=w.j(C).add(h(v))):(w=w.j(_),w=w.add(h(v)))}return w}var m=c(0),p=c(1),E=c(16777216);n=o.prototype,n.m=function(){if(A(this))return-P(this).m();for(var I=0,y=1,_=0;_<this.g.length;_++){var w=this.i(_);I+=(0<=w?w:4294967296+w)*y,y*=4294967296}return I},n.toString=function(I){if(I=I||10,2>I||36<I)throw Error("radix out of range: "+I);if(b(this))return"0";if(A(this))return"-"+P(this).toString(I);for(var y=h(Math.pow(I,6)),_=this,w="";;){var T=Y(_,y).g;_=F(_,T.j(y));var C=((0<_.g.length?_.g[0]:_.h)>>>0).toString(I);if(_=T,b(_))return C+w;for(;6>C.length;)C="0"+C;w=C+w}},n.i=function(I){return 0>I?0:I<this.g.length?this.g[I]:this.h};function b(I){if(I.h!=0)return!1;for(var y=0;y<I.g.length;y++)if(I.g[y]!=0)return!1;return!0}function A(I){return I.h==-1}n.l=function(I){return I=F(this,I),A(I)?-1:b(I)?0:1};function P(I){for(var y=I.g.length,_=[],w=0;w<y;w++)_[w]=~I.g[w];return new o(_,~I.h).add(p)}n.abs=function(){return A(this)?P(this):this},n.add=function(I){for(var y=Math.max(this.g.length,I.g.length),_=[],w=0,T=0;T<=y;T++){var C=w+(this.i(T)&65535)+(I.i(T)&65535),v=(C>>>16)+(this.i(T)>>>16)+(I.i(T)>>>16);w=v>>>16,C&=65535,v&=65535,_[T]=v<<16|C}return new o(_,_[_.length-1]&-2147483648?-1:0)};function F(I,y){return I.add(P(y))}n.j=function(I){if(b(this)||b(I))return m;if(A(this))return A(I)?P(this).j(P(I)):P(P(this).j(I));if(A(I))return P(this.j(P(I)));if(0>this.l(E)&&0>I.l(E))return h(this.m()*I.m());for(var y=this.g.length+I.g.length,_=[],w=0;w<2*y;w++)_[w]=0;for(w=0;w<this.g.length;w++)for(var T=0;T<I.g.length;T++){var C=this.i(w)>>>16,v=this.i(w)&65535,H=I.i(T)>>>16,ve=I.i(T)&65535;_[2*w+2*T]+=v*ve,U(_,2*w+2*T),_[2*w+2*T+1]+=C*ve,U(_,2*w+2*T+1),_[2*w+2*T+1]+=v*H,U(_,2*w+2*T+1),_[2*w+2*T+2]+=C*H,U(_,2*w+2*T+2)}for(w=0;w<y;w++)_[w]=_[2*w+1]<<16|_[2*w];for(w=y;w<2*y;w++)_[w]=0;return new o(_,0)};function U(I,y){for(;(I[y]&65535)!=I[y];)I[y+1]+=I[y]>>>16,I[y]&=65535,y++}function O(I,y){this.g=I,this.h=y}function Y(I,y){if(b(y))throw Error("division by zero");if(b(I))return new O(m,m);if(A(I))return y=Y(P(I),y),new O(P(y.g),P(y.h));if(A(y))return y=Y(I,P(y)),new O(P(y.g),y.h);if(30<I.g.length){if(A(I)||A(y))throw Error("slowDivide_ only works with positive integers.");for(var _=p,w=y;0>=w.l(I);)_=oe(_),w=oe(w);var T=ee(_,1),C=ee(w,1);for(w=ee(w,2),_=ee(_,2);!b(w);){var v=C.add(w);0>=v.l(I)&&(T=T.add(_),C=v),w=ee(w,1),_=ee(_,1)}return y=F(I,T.j(y)),new O(T,y)}for(T=m;0<=I.l(y);){for(_=Math.max(1,Math.floor(I.m()/y.m())),w=Math.ceil(Math.log(_)/Math.LN2),w=48>=w?1:Math.pow(2,w-48),C=h(_),v=C.j(y);A(v)||0<v.l(I);)_-=w,C=h(_),v=C.j(y);b(C)&&(C=p),T=T.add(C),I=F(I,v)}return new O(T,I)}n.A=function(I){return Y(this,I).h},n.and=function(I){for(var y=Math.max(this.g.length,I.g.length),_=[],w=0;w<y;w++)_[w]=this.i(w)&I.i(w);return new o(_,this.h&I.h)},n.or=function(I){for(var y=Math.max(this.g.length,I.g.length),_=[],w=0;w<y;w++)_[w]=this.i(w)|I.i(w);return new o(_,this.h|I.h)},n.xor=function(I){for(var y=Math.max(this.g.length,I.g.length),_=[],w=0;w<y;w++)_[w]=this.i(w)^I.i(w);return new o(_,this.h^I.h)};function oe(I){for(var y=I.g.length+1,_=[],w=0;w<y;w++)_[w]=I.i(w)<<1|I.i(w-1)>>>31;return new o(_,I.h)}function ee(I,y){var _=y>>5;y%=32;for(var w=I.g.length-_,T=[],C=0;C<w;C++)T[C]=0<y?I.i(C+_)>>>y|I.i(C+_+1)<<32-y:I.i(C+_);return new o(T,I.h)}s.prototype.digest=s.prototype.v,s.prototype.reset=s.prototype.s,s.prototype.update=s.prototype.u,Wm=s,o.prototype.add=o.prototype.add,o.prototype.multiply=o.prototype.j,o.prototype.modulo=o.prototype.A,o.prototype.compare=o.prototype.l,o.prototype.toNumber=o.prototype.m,o.prototype.toString=o.prototype.toString,o.prototype.getBits=o.prototype.i,o.fromNumber=h,o.fromString=d,es=o}).apply(typeof gd<"u"?gd:typeof self<"u"?self:typeof window<"u"?window:{});var io=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var qm,Li,$m,go,Bl,zm,Hm,Gm;(function(){var n,e=typeof Object.defineProperties=="function"?Object.defineProperty:function(a,u,f){return a==Array.prototype||a==Object.prototype||(a[u]=f.value),a};function t(a){a=[typeof globalThis=="object"&&globalThis,a,typeof window=="object"&&window,typeof self=="object"&&self,typeof io=="object"&&io];for(var u=0;u<a.length;++u){var f=a[u];if(f&&f.Math==Math)return f}throw Error("Cannot find global object")}var s=t(this);function i(a,u){if(u)e:{var f=s;a=a.split(".");for(var g=0;g<a.length-1;g++){var R=a[g];if(!(R in f))break e;f=f[R]}a=a[a.length-1],g=f[a],u=u(g),u!=g&&u!=null&&e(f,a,{configurable:!0,writable:!0,value:u})}}function r(a,u){a instanceof String&&(a+="");var f=0,g=!1,R={next:function(){if(!g&&f<a.length){var S=f++;return{value:u(S,a[S]),done:!1}}return g=!0,{done:!0,value:void 0}}};return R[Symbol.iterator]=function(){return R},R}i("Array.prototype.values",function(a){return a||function(){return r(this,function(u,f){return f})}});/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/var o=o||{},l=this||self;function c(a){var u=typeof a;return u=u!="object"?u:a?Array.isArray(a)?"array":u:"null",u=="array"||u=="object"&&typeof a.length=="number"}function h(a){var u=typeof a;return u=="object"&&a!=null||u=="function"}function d(a,u,f){return a.call.apply(a.bind,arguments)}function m(a,u,f){if(!a)throw Error();if(2<arguments.length){var g=Array.prototype.slice.call(arguments,2);return function(){var R=Array.prototype.slice.call(arguments);return Array.prototype.unshift.apply(R,g),a.apply(u,R)}}return function(){return a.apply(u,arguments)}}function p(a,u,f){return p=Function.prototype.bind&&Function.prototype.bind.toString().indexOf("native code")!=-1?d:m,p.apply(null,arguments)}function E(a,u){var f=Array.prototype.slice.call(arguments,1);return function(){var g=f.slice();return g.push.apply(g,arguments),a.apply(this,g)}}function b(a,u){function f(){}f.prototype=u.prototype,a.aa=u.prototype,a.prototype=new f,a.prototype.constructor=a,a.Qb=function(g,R,S){for(var L=Array(arguments.length-2),me=2;me<arguments.length;me++)L[me-2]=arguments[me];return u.prototype[R].apply(g,L)}}function A(a){const u=a.length;if(0<u){const f=Array(u);for(let g=0;g<u;g++)f[g]=a[g];return f}return[]}function P(a,u){for(let f=1;f<arguments.length;f++){const g=arguments[f];if(c(g)){const R=a.length||0,S=g.length||0;a.length=R+S;for(let L=0;L<S;L++)a[R+L]=g[L]}else a.push(g)}}class F{constructor(u,f){this.i=u,this.j=f,this.h=0,this.g=null}get(){let u;return 0<this.h?(this.h--,u=this.g,this.g=u.next,u.next=null):u=this.i(),u}}function U(a){return/^[\s\xa0]*$/.test(a)}function O(){var a=l.navigator;return a&&(a=a.userAgent)?a:""}function Y(a){return Y[" "](a),a}Y[" "]=function(){};var oe=O().indexOf("Gecko")!=-1&&!(O().toLowerCase().indexOf("webkit")!=-1&&O().indexOf("Edge")==-1)&&!(O().indexOf("Trident")!=-1||O().indexOf("MSIE")!=-1)&&O().indexOf("Edge")==-1;function ee(a,u,f){for(const g in a)u.call(f,a[g],g,a)}function I(a,u){for(const f in a)u.call(void 0,a[f],f,a)}function y(a){const u={};for(const f in a)u[f]=a[f];return u}const _="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function w(a,u){let f,g;for(let R=1;R<arguments.length;R++){g=arguments[R];for(f in g)a[f]=g[f];for(let S=0;S<_.length;S++)f=_[S],Object.prototype.hasOwnProperty.call(g,f)&&(a[f]=g[f])}}function T(a){var u=1;a=a.split(":");const f=[];for(;0<u&&a.length;)f.push(a.shift()),u--;return a.length&&f.push(a.join(":")),f}function C(a){l.setTimeout(()=>{throw a},0)}function v(){var a=wt;let u=null;return a.g&&(u=a.g,a.g=a.g.next,a.g||(a.h=null),u.next=null),u}class H{constructor(){this.h=this.g=null}add(u,f){const g=ve.get();g.set(u,f),this.h?this.h.next=g:this.g=g,this.h=g}}var ve=new F(()=>new we,a=>a.reset());class we{constructor(){this.next=this.g=this.h=null}set(u,f){this.h=u,this.g=f,this.next=null}reset(){this.next=this.g=this.h=null}}let Le,qe=!1,wt=new H,_s=()=>{const a=l.Promise.resolve(void 0);Le=()=>{a.then(Or)}};var Or=()=>{for(var a;a=v();){try{a.h.call(a.g)}catch(f){C(f)}var u=ve;u.j(a),100>u.h&&(u.h++,a.next=u.g,u.g=a)}qe=!1};function Dt(){this.s=this.s,this.C=this.C}Dt.prototype.s=!1,Dt.prototype.ma=function(){this.s||(this.s=!0,this.N())},Dt.prototype.N=function(){if(this.C)for(;this.C.length;)this.C.shift()()};function $e(a,u){this.type=a,this.g=this.target=u,this.defaultPrevented=!1}$e.prototype.h=function(){this.defaultPrevented=!0};var Vr=function(){if(!l.addEventListener||!Object.defineProperty)return!1;var a=!1,u=Object.defineProperty({},"passive",{get:function(){a=!0}});try{const f=()=>{};l.addEventListener("test",f,u),l.removeEventListener("test",f,u)}catch{}return a}();function cn(a,u){if($e.call(this,a?a.type:""),this.relatedTarget=this.g=this.target=null,this.button=this.screenY=this.screenX=this.clientY=this.clientX=0,this.key="",this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1,this.state=null,this.pointerId=0,this.pointerType="",this.i=null,a){var f=this.type=a.type,g=a.changedTouches&&a.changedTouches.length?a.changedTouches[0]:null;if(this.target=a.target||a.srcElement,this.g=u,u=a.relatedTarget){if(oe){e:{try{Y(u.nodeName);var R=!0;break e}catch{}R=!1}R||(u=null)}}else f=="mouseover"?u=a.fromElement:f=="mouseout"&&(u=a.toElement);this.relatedTarget=u,g?(this.clientX=g.clientX!==void 0?g.clientX:g.pageX,this.clientY=g.clientY!==void 0?g.clientY:g.pageY,this.screenX=g.screenX||0,this.screenY=g.screenY||0):(this.clientX=a.clientX!==void 0?a.clientX:a.pageX,this.clientY=a.clientY!==void 0?a.clientY:a.pageY,this.screenX=a.screenX||0,this.screenY=a.screenY||0),this.button=a.button,this.key=a.key||"",this.ctrlKey=a.ctrlKey,this.altKey=a.altKey,this.shiftKey=a.shiftKey,this.metaKey=a.metaKey,this.pointerId=a.pointerId||0,this.pointerType=typeof a.pointerType=="string"?a.pointerType:Fr[a.pointerType]||"",this.state=a.state,this.i=a,a.defaultPrevented&&cn.aa.h.call(this)}}b(cn,$e);var Fr={2:"touch",3:"pen",4:"mouse"};cn.prototype.h=function(){cn.aa.h.call(this);var a=this.i;a.preventDefault?a.preventDefault():a.returnValue=!1};var Vn="closure_listenable_"+(1e6*Math.random()|0),ie=0;function Ne(a,u,f,g,R){this.listener=a,this.proxy=null,this.src=u,this.type=f,this.capture=!!g,this.ha=R,this.key=++ie,this.da=this.fa=!1}function Fn(a){a.da=!0,a.listener=null,a.proxy=null,a.src=null,a.ha=null}function x(a){this.src=a,this.g={},this.h=0}x.prototype.add=function(a,u,f,g,R){var S=a.toString();a=this.g[S],a||(a=this.g[S]=[],this.h++);var L=fe(a,u,g,R);return-1<L?(u=a[L],f||(u.fa=!1)):(u=new Ne(u,this.src,S,!!g,R),u.fa=f,a.push(u)),u};function Ie(a,u){var f=u.type;if(f in a.g){var g=a.g[f],R=Array.prototype.indexOf.call(g,u,void 0),S;(S=0<=R)&&Array.prototype.splice.call(g,R,1),S&&(Fn(u),a.g[f].length==0&&(delete a.g[f],a.h--))}}function fe(a,u,f,g){for(var R=0;R<a.length;++R){var S=a[R];if(!S.da&&S.listener==u&&S.capture==!!f&&S.ha==g)return R}return-1}var ze="closure_lm_"+(1e6*Math.random()|0),Bn={};function Un(a,u,f,g,R){if(Array.isArray(u)){for(var S=0;S<u.length;S++)Un(a,u[S],f,g,R);return null}return f=hn(f),a&&a[Vn]?a.K(u,f,h(g)?!!g.capture:!1,R):Br(a,u,f,!1,g,R)}function Br(a,u,f,g,R,S){if(!u)throw Error("Invalid event type");var L=h(R)?!!R.capture:!!R,me=ui(a);if(me||(a[ze]=me=new x(a)),f=me.add(u,f,g,L,S),f.proxy)return f;if(g=Ur(),f.proxy=g,g.src=a,g.listener=f,a.addEventListener)Vr||(R=L),R===void 0&&(R=!1),a.addEventListener(u.toString(),g,R);else if(a.attachEvent)a.attachEvent(jn(u.toString()),g);else if(a.addListener&&a.removeListener)a.addListener(g);else throw Error("addEventListener and attachEvent are unavailable.");return f}function Ur(){function a(f){return u.call(a.src,a.listener,f)}const u=qt;return a}function hi(a,u,f,g,R){if(Array.isArray(u))for(var S=0;S<u.length;S++)hi(a,u[S],f,g,R);else g=h(g)?!!g.capture:!!g,f=hn(f),a&&a[Vn]?(a=a.i,u=String(u).toString(),u in a.g&&(S=a.g[u],f=fe(S,f,g,R),-1<f&&(Fn(S[f]),Array.prototype.splice.call(S,f,1),S.length==0&&(delete a.g[u],a.h--)))):a&&(a=ui(a))&&(u=a.g[u.toString()],a=-1,u&&(a=fe(u,f,g,R)),(f=-1<a?u[a]:null)&&ys(f))}function ys(a){if(typeof a!="number"&&a&&!a.da){var u=a.src;if(u&&u[Vn])Ie(u.i,a);else{var f=a.type,g=a.proxy;u.removeEventListener?u.removeEventListener(f,g,a.capture):u.detachEvent?u.detachEvent(jn(f),g):u.addListener&&u.removeListener&&u.removeListener(g),(f=ui(u))?(Ie(f,a),f.h==0&&(f.src=null,u[ze]=null)):Fn(a)}}}function jn(a){return a in Bn?Bn[a]:Bn[a]="on"+a}function qt(a,u){if(a.da)a=!0;else{u=new cn(u,this);var f=a.listener,g=a.ha||a.src;a.fa&&ys(a),a=f.call(g,u)}return a}function ui(a){return a=a[ze],a instanceof x?a:null}var Tt="__closure_events_fn_"+(1e9*Math.random()>>>0);function hn(a){return typeof a=="function"?a:(a[Tt]||(a[Tt]=function(u){return a.handleEvent(u)}),a[Tt])}function De(){Dt.call(this),this.i=new x(this),this.M=this,this.F=null}b(De,Dt),De.prototype[Vn]=!0,De.prototype.removeEventListener=function(a,u,f,g){hi(this,a,u,f,g)};function ot(a,u){var f,g=a.F;if(g)for(f=[];g;g=g.F)f.push(g);if(a=a.M,g=u.type||u,typeof u=="string")u=new $e(u,a);else if(u instanceof $e)u.target=u.target||a;else{var R=u;u=new $e(g,a),w(u,R)}if(R=!0,f)for(var S=f.length-1;0<=S;S--){var L=u.g=f[S];R=jr(L,g,!0,u)&&R}if(L=u.g=a,R=jr(L,g,!0,u)&&R,R=jr(L,g,!1,u)&&R,f)for(S=0;S<f.length;S++)L=u.g=f[S],R=jr(L,g,!1,u)&&R}De.prototype.N=function(){if(De.aa.N.call(this),this.i){var a=this.i,u;for(u in a.g){for(var f=a.g[u],g=0;g<f.length;g++)Fn(f[g]);delete a.g[u],a.h--}}this.F=null},De.prototype.K=function(a,u,f,g){return this.i.add(String(a),u,!1,f,g)},De.prototype.L=function(a,u,f,g){return this.i.add(String(a),u,!0,f,g)};function jr(a,u,f,g){if(u=a.i.g[String(u)],!u)return!0;u=u.concat();for(var R=!0,S=0;S<u.length;++S){var L=u[S];if(L&&!L.da&&L.capture==f){var me=L.listener,He=L.ha||L.src;L.fa&&Ie(a.i,L),R=me.call(He,g)!==!1&&R}}return R&&!g.defaultPrevented}function Kh(a,u,f){if(typeof a=="function")f&&(a=p(a,f));else if(a&&typeof a.handleEvent=="function")a=p(a.handleEvent,a);else throw Error("Invalid listener argument");return 2147483647<Number(u)?-1:l.setTimeout(a,u||0)}function Qh(a){a.g=Kh(()=>{a.g=null,a.i&&(a.i=!1,Qh(a))},a.l);const u=a.h;a.h=null,a.m.apply(null,u)}class W_ extends Dt{constructor(u,f){super(),this.m=u,this.l=f,this.h=null,this.i=!1,this.g=null}j(u){this.h=arguments,this.g?this.i=!0:Qh(this)}N(){super.N(),this.g&&(l.clearTimeout(this.g),this.g=null,this.i=!1,this.h=null)}}function di(a){Dt.call(this),this.h=a,this.g={}}b(di,Dt);var Yh=[];function Xh(a){ee(a.g,function(u,f){this.g.hasOwnProperty(f)&&ys(u)},a),a.g={}}di.prototype.N=function(){di.aa.N.call(this),Xh(this)},di.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented")};var $a=l.JSON.stringify,q_=l.JSON.parse,$_=class{stringify(a){return l.JSON.stringify(a,void 0)}parse(a){return l.JSON.parse(a,void 0)}};function za(){}za.prototype.h=null;function Jh(a){return a.h||(a.h=a.i())}function Zh(){}var fi={OPEN:"a",kb:"b",Ja:"c",wb:"d"};function Ha(){$e.call(this,"d")}b(Ha,$e);function Ga(){$e.call(this,"c")}b(Ga,$e);var Wn={},eu=null;function Wr(){return eu=eu||new De}Wn.La="serverreachability";function tu(a){$e.call(this,Wn.La,a)}b(tu,$e);function mi(a){const u=Wr();ot(u,new tu(u))}Wn.STAT_EVENT="statevent";function nu(a,u){$e.call(this,Wn.STAT_EVENT,a),this.stat=u}b(nu,$e);function at(a){const u=Wr();ot(u,new nu(u,a))}Wn.Ma="timingevent";function su(a,u){$e.call(this,Wn.Ma,a),this.size=u}b(su,$e);function pi(a,u){if(typeof a!="function")throw Error("Fn must not be null and must be a function");return l.setTimeout(function(){a()},u)}function gi(){this.g=!0}gi.prototype.xa=function(){this.g=!1};function z_(a,u,f,g,R,S){a.info(function(){if(a.g)if(S)for(var L="",me=S.split("&"),He=0;He<me.length;He++){var ae=me[He].split("=");if(1<ae.length){var Xe=ae[0];ae=ae[1];var Je=Xe.split("_");L=2<=Je.length&&Je[1]=="type"?L+(Xe+"="+ae+"&"):L+(Xe+"=redacted&")}}else L=null;else L=S;return"XMLHTTP REQ ("+g+") [attempt "+R+"]: "+u+`
`+f+`
`+L})}function H_(a,u,f,g,R,S,L){a.info(function(){return"XMLHTTP RESP ("+g+") [ attempt "+R+"]: "+u+`
`+f+`
`+S+" "+L})}function vs(a,u,f,g){a.info(function(){return"XMLHTTP TEXT ("+u+"): "+K_(a,f)+(g?" "+g:"")})}function G_(a,u){a.info(function(){return"TIMEOUT: "+u})}gi.prototype.info=function(){};function K_(a,u){if(!a.g)return u;if(!u)return null;try{var f=JSON.parse(u);if(f){for(a=0;a<f.length;a++)if(Array.isArray(f[a])){var g=f[a];if(!(2>g.length)){var R=g[1];if(Array.isArray(R)&&!(1>R.length)){var S=R[0];if(S!="noop"&&S!="stop"&&S!="close")for(var L=1;L<R.length;L++)R[L]=""}}}}return $a(f)}catch{return u}}var qr={NO_ERROR:0,gb:1,tb:2,sb:3,nb:4,rb:5,ub:6,Ia:7,TIMEOUT:8,xb:9},iu={lb:"complete",Hb:"success",Ja:"error",Ia:"abort",zb:"ready",Ab:"readystatechange",TIMEOUT:"timeout",vb:"incrementaldata",yb:"progress",ob:"downloadprogress",Pb:"uploadprogress"},Ka;function $r(){}b($r,za),$r.prototype.g=function(){return new XMLHttpRequest},$r.prototype.i=function(){return{}},Ka=new $r;function un(a,u,f,g){this.j=a,this.i=u,this.l=f,this.R=g||1,this.U=new di(this),this.I=45e3,this.H=null,this.o=!1,this.m=this.A=this.v=this.L=this.F=this.S=this.B=null,this.D=[],this.g=null,this.C=0,this.s=this.u=null,this.X=-1,this.J=!1,this.O=0,this.M=null,this.W=this.K=this.T=this.P=!1,this.h=new ru}function ru(){this.i=null,this.g="",this.h=!1}var ou={},Qa={};function Ya(a,u,f){a.L=1,a.v=Kr($t(u)),a.m=f,a.P=!0,au(a,null)}function au(a,u){a.F=Date.now(),zr(a),a.A=$t(a.v);var f=a.A,g=a.R;Array.isArray(g)||(g=[String(g)]),wu(f.i,"t",g),a.C=0,f=a.j.J,a.h=new ru,a.g=Bu(a.j,f?u:null,!a.m),0<a.O&&(a.M=new W_(p(a.Y,a,a.g),a.O)),u=a.U,f=a.g,g=a.ca;var R="readystatechange";Array.isArray(R)||(R&&(Yh[0]=R.toString()),R=Yh);for(var S=0;S<R.length;S++){var L=Un(f,R[S],g||u.handleEvent,!1,u.h||u);if(!L)break;u.g[L.key]=L}u=a.H?y(a.H):{},a.m?(a.u||(a.u="POST"),u["Content-Type"]="application/x-www-form-urlencoded",a.g.ea(a.A,a.u,a.m,u)):(a.u="GET",a.g.ea(a.A,a.u,null,u)),mi(),z_(a.i,a.u,a.A,a.l,a.R,a.m)}un.prototype.ca=function(a){a=a.target;const u=this.M;u&&zt(a)==3?u.j():this.Y(a)},un.prototype.Y=function(a){try{if(a==this.g)e:{const Je=zt(this.g);var u=this.g.Ba();const Ts=this.g.Z();if(!(3>Je)&&(Je!=3||this.g&&(this.h.h||this.g.oa()||Au(this.g)))){this.J||Je!=4||u==7||(u==8||0>=Ts?mi(3):mi(2)),Xa(this);var f=this.g.Z();this.X=f;t:if(lu(this)){var g=Au(this.g);a="";var R=g.length,S=zt(this.g)==4;if(!this.h.i){if(typeof TextDecoder>"u"){qn(this),_i(this);var L="";break t}this.h.i=new l.TextDecoder}for(u=0;u<R;u++)this.h.h=!0,a+=this.h.i.decode(g[u],{stream:!(S&&u==R-1)});g.length=0,this.h.g+=a,this.C=0,L=this.h.g}else L=this.g.oa();if(this.o=f==200,H_(this.i,this.u,this.A,this.l,this.R,Je,f),this.o){if(this.T&&!this.K){t:{if(this.g){var me,He=this.g;if((me=He.g?He.g.getResponseHeader("X-HTTP-Initial-Response"):null)&&!U(me)){var ae=me;break t}}ae=null}if(f=ae)vs(this.i,this.l,f,"Initial handshake response via X-HTTP-Initial-Response"),this.K=!0,Ja(this,f);else{this.o=!1,this.s=3,at(12),qn(this),_i(this);break e}}if(this.P){f=!0;let Ct;for(;!this.J&&this.C<L.length;)if(Ct=Q_(this,L),Ct==Qa){Je==4&&(this.s=4,at(14),f=!1),vs(this.i,this.l,null,"[Incomplete Response]");break}else if(Ct==ou){this.s=4,at(15),vs(this.i,this.l,L,"[Invalid Chunk]"),f=!1;break}else vs(this.i,this.l,Ct,null),Ja(this,Ct);if(lu(this)&&this.C!=0&&(this.h.g=this.h.g.slice(this.C),this.C=0),Je!=4||L.length!=0||this.h.h||(this.s=1,at(16),f=!1),this.o=this.o&&f,!f)vs(this.i,this.l,L,"[Invalid Chunked Response]"),qn(this),_i(this);else if(0<L.length&&!this.W){this.W=!0;var Xe=this.j;Xe.g==this&&Xe.ba&&!Xe.M&&(Xe.j.info("Great, no buffering proxy detected. Bytes received: "+L.length),il(Xe),Xe.M=!0,at(11))}}else vs(this.i,this.l,L,null),Ja(this,L);Je==4&&qn(this),this.o&&!this.J&&(Je==4?Lu(this.j,this):(this.o=!1,zr(this)))}else dy(this.g),f==400&&0<L.indexOf("Unknown SID")?(this.s=3,at(12)):(this.s=0,at(13)),qn(this),_i(this)}}}catch{}finally{}};function lu(a){return a.g?a.u=="GET"&&a.L!=2&&a.j.Ca:!1}function Q_(a,u){var f=a.C,g=u.indexOf(`
`,f);return g==-1?Qa:(f=Number(u.substring(f,g)),isNaN(f)?ou:(g+=1,g+f>u.length?Qa:(u=u.slice(g,g+f),a.C=g+f,u)))}un.prototype.cancel=function(){this.J=!0,qn(this)};function zr(a){a.S=Date.now()+a.I,cu(a,a.I)}function cu(a,u){if(a.B!=null)throw Error("WatchDog timer not null");a.B=pi(p(a.ba,a),u)}function Xa(a){a.B&&(l.clearTimeout(a.B),a.B=null)}un.prototype.ba=function(){this.B=null;const a=Date.now();0<=a-this.S?(G_(this.i,this.A),this.L!=2&&(mi(),at(17)),qn(this),this.s=2,_i(this)):cu(this,this.S-a)};function _i(a){a.j.G==0||a.J||Lu(a.j,a)}function qn(a){Xa(a);var u=a.M;u&&typeof u.ma=="function"&&u.ma(),a.M=null,Xh(a.U),a.g&&(u=a.g,a.g=null,u.abort(),u.ma())}function Ja(a,u){try{var f=a.j;if(f.G!=0&&(f.g==a||Za(f.h,a))){if(!a.K&&Za(f.h,a)&&f.G==3){try{var g=f.Da.g.parse(u)}catch{g=null}if(Array.isArray(g)&&g.length==3){var R=g;if(R[0]==0){e:if(!f.u){if(f.g)if(f.g.F+3e3<a.F)eo(f),Jr(f);else break e;sl(f),at(18)}}else f.za=R[1],0<f.za-f.T&&37500>R[2]&&f.F&&f.v==0&&!f.C&&(f.C=pi(p(f.Za,f),6e3));if(1>=du(f.h)&&f.ca){try{f.ca()}catch{}f.ca=void 0}}else zn(f,11)}else if((a.K||f.g==a)&&eo(f),!U(u))for(R=f.Da.g.parse(u),u=0;u<R.length;u++){let ae=R[u];if(f.T=ae[0],ae=ae[1],f.G==2)if(ae[0]=="c"){f.K=ae[1],f.ia=ae[2];const Xe=ae[3];Xe!=null&&(f.la=Xe,f.j.info("VER="+f.la));const Je=ae[4];Je!=null&&(f.Aa=Je,f.j.info("SVER="+f.Aa));const Ts=ae[5];Ts!=null&&typeof Ts=="number"&&0<Ts&&(g=1.5*Ts,f.L=g,f.j.info("backChannelRequestTimeoutMs_="+g)),g=f;const Ct=a.g;if(Ct){const no=Ct.g?Ct.g.getResponseHeader("X-Client-Wire-Protocol"):null;if(no){var S=g.h;S.g||no.indexOf("spdy")==-1&&no.indexOf("quic")==-1&&no.indexOf("h2")==-1||(S.j=S.l,S.g=new Set,S.h&&(el(S,S.h),S.h=null))}if(g.D){const rl=Ct.g?Ct.g.getResponseHeader("X-HTTP-Session-Id"):null;rl&&(g.ya=rl,ye(g.I,g.D,rl))}}f.G=3,f.l&&f.l.ua(),f.ba&&(f.R=Date.now()-a.F,f.j.info("Handshake RTT: "+f.R+"ms")),g=f;var L=a;if(g.qa=Fu(g,g.J?g.ia:null,g.W),L.K){fu(g.h,L);var me=L,He=g.L;He&&(me.I=He),me.B&&(Xa(me),zr(me)),g.g=L}else xu(g);0<f.i.length&&Zr(f)}else ae[0]!="stop"&&ae[0]!="close"||zn(f,7);else f.G==3&&(ae[0]=="stop"||ae[0]=="close"?ae[0]=="stop"?zn(f,7):nl(f):ae[0]!="noop"&&f.l&&f.l.ta(ae),f.v=0)}}mi(4)}catch{}}var Y_=class{constructor(a,u){this.g=a,this.map=u}};function hu(a){this.l=a||10,l.PerformanceNavigationTiming?(a=l.performance.getEntriesByType("navigation"),a=0<a.length&&(a[0].nextHopProtocol=="hq"||a[0].nextHopProtocol=="h2")):a=!!(l.chrome&&l.chrome.loadTimes&&l.chrome.loadTimes()&&l.chrome.loadTimes().wasFetchedViaSpdy),this.j=a?this.l:1,this.g=null,1<this.j&&(this.g=new Set),this.h=null,this.i=[]}function uu(a){return a.h?!0:a.g?a.g.size>=a.j:!1}function du(a){return a.h?1:a.g?a.g.size:0}function Za(a,u){return a.h?a.h==u:a.g?a.g.has(u):!1}function el(a,u){a.g?a.g.add(u):a.h=u}function fu(a,u){a.h&&a.h==u?a.h=null:a.g&&a.g.has(u)&&a.g.delete(u)}hu.prototype.cancel=function(){if(this.i=mu(this),this.h)this.h.cancel(),this.h=null;else if(this.g&&this.g.size!==0){for(const a of this.g.values())a.cancel();this.g.clear()}};function mu(a){if(a.h!=null)return a.i.concat(a.h.D);if(a.g!=null&&a.g.size!==0){let u=a.i;for(const f of a.g.values())u=u.concat(f.D);return u}return A(a.i)}function X_(a){if(a.V&&typeof a.V=="function")return a.V();if(typeof Map<"u"&&a instanceof Map||typeof Set<"u"&&a instanceof Set)return Array.from(a.values());if(typeof a=="string")return a.split("");if(c(a)){for(var u=[],f=a.length,g=0;g<f;g++)u.push(a[g]);return u}u=[],f=0;for(g in a)u[f++]=a[g];return u}function J_(a){if(a.na&&typeof a.na=="function")return a.na();if(!a.V||typeof a.V!="function"){if(typeof Map<"u"&&a instanceof Map)return Array.from(a.keys());if(!(typeof Set<"u"&&a instanceof Set)){if(c(a)||typeof a=="string"){var u=[];a=a.length;for(var f=0;f<a;f++)u.push(f);return u}u=[],f=0;for(const g in a)u[f++]=g;return u}}}function pu(a,u){if(a.forEach&&typeof a.forEach=="function")a.forEach(u,void 0);else if(c(a)||typeof a=="string")Array.prototype.forEach.call(a,u,void 0);else for(var f=J_(a),g=X_(a),R=g.length,S=0;S<R;S++)u.call(void 0,g[S],f&&f[S],a)}var gu=RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");function Z_(a,u){if(a){a=a.split("&");for(var f=0;f<a.length;f++){var g=a[f].indexOf("="),R=null;if(0<=g){var S=a[f].substring(0,g);R=a[f].substring(g+1)}else S=a[f];u(S,R?decodeURIComponent(R.replace(/\+/g," ")):"")}}}function $n(a){if(this.g=this.o=this.j="",this.s=null,this.m=this.l="",this.h=!1,a instanceof $n){this.h=a.h,Hr(this,a.j),this.o=a.o,this.g=a.g,Gr(this,a.s),this.l=a.l;var u=a.i,f=new Ei;f.i=u.i,u.g&&(f.g=new Map(u.g),f.h=u.h),_u(this,f),this.m=a.m}else a&&(u=String(a).match(gu))?(this.h=!1,Hr(this,u[1]||"",!0),this.o=yi(u[2]||""),this.g=yi(u[3]||"",!0),Gr(this,u[4]),this.l=yi(u[5]||"",!0),_u(this,u[6]||"",!0),this.m=yi(u[7]||"")):(this.h=!1,this.i=new Ei(null,this.h))}$n.prototype.toString=function(){var a=[],u=this.j;u&&a.push(vi(u,yu,!0),":");var f=this.g;return(f||u=="file")&&(a.push("//"),(u=this.o)&&a.push(vi(u,yu,!0),"@"),a.push(encodeURIComponent(String(f)).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),f=this.s,f!=null&&a.push(":",String(f))),(f=this.l)&&(this.g&&f.charAt(0)!="/"&&a.push("/"),a.push(vi(f,f.charAt(0)=="/"?ny:ty,!0))),(f=this.i.toString())&&a.push("?",f),(f=this.m)&&a.push("#",vi(f,iy)),a.join("")};function $t(a){return new $n(a)}function Hr(a,u,f){a.j=f?yi(u,!0):u,a.j&&(a.j=a.j.replace(/:$/,""))}function Gr(a,u){if(u){if(u=Number(u),isNaN(u)||0>u)throw Error("Bad port number "+u);a.s=u}else a.s=null}function _u(a,u,f){u instanceof Ei?(a.i=u,ry(a.i,a.h)):(f||(u=vi(u,sy)),a.i=new Ei(u,a.h))}function ye(a,u,f){a.i.set(u,f)}function Kr(a){return ye(a,"zx",Math.floor(2147483648*Math.random()).toString(36)+Math.abs(Math.floor(2147483648*Math.random())^Date.now()).toString(36)),a}function yi(a,u){return a?u?decodeURI(a.replace(/%25/g,"%2525")):decodeURIComponent(a):""}function vi(a,u,f){return typeof a=="string"?(a=encodeURI(a).replace(u,ey),f&&(a=a.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),a):null}function ey(a){return a=a.charCodeAt(0),"%"+(a>>4&15).toString(16)+(a&15).toString(16)}var yu=/[#\/\?@]/g,ty=/[#\?:]/g,ny=/[#\?]/g,sy=/[#\?@]/g,iy=/#/g;function Ei(a,u){this.h=this.g=null,this.i=a||null,this.j=!!u}function dn(a){a.g||(a.g=new Map,a.h=0,a.i&&Z_(a.i,function(u,f){a.add(decodeURIComponent(u.replace(/\+/g," ")),f)}))}n=Ei.prototype,n.add=function(a,u){dn(this),this.i=null,a=Es(this,a);var f=this.g.get(a);return f||this.g.set(a,f=[]),f.push(u),this.h+=1,this};function vu(a,u){dn(a),u=Es(a,u),a.g.has(u)&&(a.i=null,a.h-=a.g.get(u).length,a.g.delete(u))}function Eu(a,u){return dn(a),u=Es(a,u),a.g.has(u)}n.forEach=function(a,u){dn(this),this.g.forEach(function(f,g){f.forEach(function(R){a.call(u,R,g,this)},this)},this)},n.na=function(){dn(this);const a=Array.from(this.g.values()),u=Array.from(this.g.keys()),f=[];for(let g=0;g<u.length;g++){const R=a[g];for(let S=0;S<R.length;S++)f.push(u[g])}return f},n.V=function(a){dn(this);let u=[];if(typeof a=="string")Eu(this,a)&&(u=u.concat(this.g.get(Es(this,a))));else{a=Array.from(this.g.values());for(let f=0;f<a.length;f++)u=u.concat(a[f])}return u},n.set=function(a,u){return dn(this),this.i=null,a=Es(this,a),Eu(this,a)&&(this.h-=this.g.get(a).length),this.g.set(a,[u]),this.h+=1,this},n.get=function(a,u){return a?(a=this.V(a),0<a.length?String(a[0]):u):u};function wu(a,u,f){vu(a,u),0<f.length&&(a.i=null,a.g.set(Es(a,u),A(f)),a.h+=f.length)}n.toString=function(){if(this.i)return this.i;if(!this.g)return"";const a=[],u=Array.from(this.g.keys());for(var f=0;f<u.length;f++){var g=u[f];const S=encodeURIComponent(String(g)),L=this.V(g);for(g=0;g<L.length;g++){var R=S;L[g]!==""&&(R+="="+encodeURIComponent(String(L[g]))),a.push(R)}}return this.i=a.join("&")};function Es(a,u){return u=String(u),a.j&&(u=u.toLowerCase()),u}function ry(a,u){u&&!a.j&&(dn(a),a.i=null,a.g.forEach(function(f,g){var R=g.toLowerCase();g!=R&&(vu(this,g),wu(this,R,f))},a)),a.j=u}function oy(a,u){const f=new gi;if(l.Image){const g=new Image;g.onload=E(fn,f,"TestLoadImage: loaded",!0,u,g),g.onerror=E(fn,f,"TestLoadImage: error",!1,u,g),g.onabort=E(fn,f,"TestLoadImage: abort",!1,u,g),g.ontimeout=E(fn,f,"TestLoadImage: timeout",!1,u,g),l.setTimeout(function(){g.ontimeout&&g.ontimeout()},1e4),g.src=a}else u(!1)}function ay(a,u){const f=new gi,g=new AbortController,R=setTimeout(()=>{g.abort(),fn(f,"TestPingServer: timeout",!1,u)},1e4);fetch(a,{signal:g.signal}).then(S=>{clearTimeout(R),S.ok?fn(f,"TestPingServer: ok",!0,u):fn(f,"TestPingServer: server error",!1,u)}).catch(()=>{clearTimeout(R),fn(f,"TestPingServer: error",!1,u)})}function fn(a,u,f,g,R){try{R&&(R.onload=null,R.onerror=null,R.onabort=null,R.ontimeout=null),g(f)}catch{}}function ly(){this.g=new $_}function cy(a,u,f){const g=f||"";try{pu(a,function(R,S){let L=R;h(R)&&(L=$a(R)),u.push(g+S+"="+encodeURIComponent(L))})}catch(R){throw u.push(g+"type="+encodeURIComponent("_badmap")),R}}function Qr(a){this.l=a.Ub||null,this.j=a.eb||!1}b(Qr,za),Qr.prototype.g=function(){return new Yr(this.l,this.j)},Qr.prototype.i=function(a){return function(){return a}}({});function Yr(a,u){De.call(this),this.D=a,this.o=u,this.m=void 0,this.status=this.readyState=0,this.responseType=this.responseText=this.response=this.statusText="",this.onreadystatechange=null,this.u=new Headers,this.h=null,this.B="GET",this.A="",this.g=!1,this.v=this.j=this.l=null}b(Yr,De),n=Yr.prototype,n.open=function(a,u){if(this.readyState!=0)throw this.abort(),Error("Error reopening a connection");this.B=a,this.A=u,this.readyState=1,Ti(this)},n.send=function(a){if(this.readyState!=1)throw this.abort(),Error("need to call open() first. ");this.g=!0;const u={headers:this.u,method:this.B,credentials:this.m,cache:void 0};a&&(u.body=a),(this.D||l).fetch(new Request(this.A,u)).then(this.Sa.bind(this),this.ga.bind(this))},n.abort=function(){this.response=this.responseText="",this.u=new Headers,this.status=0,this.j&&this.j.cancel("Request was aborted.").catch(()=>{}),1<=this.readyState&&this.g&&this.readyState!=4&&(this.g=!1,wi(this)),this.readyState=0},n.Sa=function(a){if(this.g&&(this.l=a,this.h||(this.status=this.l.status,this.statusText=this.l.statusText,this.h=a.headers,this.readyState=2,Ti(this)),this.g&&(this.readyState=3,Ti(this),this.g)))if(this.responseType==="arraybuffer")a.arrayBuffer().then(this.Qa.bind(this),this.ga.bind(this));else if(typeof l.ReadableStream<"u"&&"body"in a){if(this.j=a.body.getReader(),this.o){if(this.responseType)throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');this.response=[]}else this.response=this.responseText="",this.v=new TextDecoder;Tu(this)}else a.text().then(this.Ra.bind(this),this.ga.bind(this))};function Tu(a){a.j.read().then(a.Pa.bind(a)).catch(a.ga.bind(a))}n.Pa=function(a){if(this.g){if(this.o&&a.value)this.response.push(a.value);else if(!this.o){var u=a.value?a.value:new Uint8Array(0);(u=this.v.decode(u,{stream:!a.done}))&&(this.response=this.responseText+=u)}a.done?wi(this):Ti(this),this.readyState==3&&Tu(this)}},n.Ra=function(a){this.g&&(this.response=this.responseText=a,wi(this))},n.Qa=function(a){this.g&&(this.response=a,wi(this))},n.ga=function(){this.g&&wi(this)};function wi(a){a.readyState=4,a.l=null,a.j=null,a.v=null,Ti(a)}n.setRequestHeader=function(a,u){this.u.append(a,u)},n.getResponseHeader=function(a){return this.h&&this.h.get(a.toLowerCase())||""},n.getAllResponseHeaders=function(){if(!this.h)return"";const a=[],u=this.h.entries();for(var f=u.next();!f.done;)f=f.value,a.push(f[0]+": "+f[1]),f=u.next();return a.join(`\r
`)};function Ti(a){a.onreadystatechange&&a.onreadystatechange.call(a)}Object.defineProperty(Yr.prototype,"withCredentials",{get:function(){return this.m==="include"},set:function(a){this.m=a?"include":"same-origin"}});function Iu(a){let u="";return ee(a,function(f,g){u+=g,u+=":",u+=f,u+=`\r
`}),u}function tl(a,u,f){e:{for(g in f){var g=!1;break e}g=!0}g||(f=Iu(f),typeof a=="string"?f!=null&&encodeURIComponent(String(f)):ye(a,u,f))}function be(a){De.call(this),this.headers=new Map,this.o=a||null,this.h=!1,this.v=this.g=null,this.D="",this.m=0,this.l="",this.j=this.B=this.u=this.A=!1,this.I=null,this.H="",this.J=!1}b(be,De);var hy=/^https?$/i,uy=["POST","PUT"];n=be.prototype,n.Ha=function(a){this.J=a},n.ea=function(a,u,f,g){if(this.g)throw Error("[goog.net.XhrIo] Object is active with another request="+this.D+"; newUri="+a);u=u?u.toUpperCase():"GET",this.D=a,this.l="",this.m=0,this.A=!1,this.h=!0,this.g=this.o?this.o.g():Ka.g(),this.v=this.o?Jh(this.o):Jh(Ka),this.g.onreadystatechange=p(this.Ea,this);try{this.B=!0,this.g.open(u,String(a),!0),this.B=!1}catch(S){bu(this,S);return}if(a=f||"",f=new Map(this.headers),g)if(Object.getPrototypeOf(g)===Object.prototype)for(var R in g)f.set(R,g[R]);else if(typeof g.keys=="function"&&typeof g.get=="function")for(const S of g.keys())f.set(S,g.get(S));else throw Error("Unknown input type for opt_headers: "+String(g));g=Array.from(f.keys()).find(S=>S.toLowerCase()=="content-type"),R=l.FormData&&a instanceof l.FormData,!(0<=Array.prototype.indexOf.call(uy,u,void 0))||g||R||f.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");for(const[S,L]of f)this.g.setRequestHeader(S,L);this.H&&(this.g.responseType=this.H),"withCredentials"in this.g&&this.g.withCredentials!==this.J&&(this.g.withCredentials=this.J);try{Su(this),this.u=!0,this.g.send(a),this.u=!1}catch(S){bu(this,S)}};function bu(a,u){a.h=!1,a.g&&(a.j=!0,a.g.abort(),a.j=!1),a.l=u,a.m=5,Cu(a),Xr(a)}function Cu(a){a.A||(a.A=!0,ot(a,"complete"),ot(a,"error"))}n.abort=function(a){this.g&&this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1,this.m=a||7,ot(this,"complete"),ot(this,"abort"),Xr(this))},n.N=function(){this.g&&(this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1),Xr(this,!0)),be.aa.N.call(this)},n.Ea=function(){this.s||(this.B||this.u||this.j?Ru(this):this.bb())},n.bb=function(){Ru(this)};function Ru(a){if(a.h&&typeof o<"u"&&(!a.v[1]||zt(a)!=4||a.Z()!=2)){if(a.u&&zt(a)==4)Kh(a.Ea,0,a);else if(ot(a,"readystatechange"),zt(a)==4){a.h=!1;try{const L=a.Z();e:switch(L){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:var u=!0;break e;default:u=!1}var f;if(!(f=u)){var g;if(g=L===0){var R=String(a.D).match(gu)[1]||null;!R&&l.self&&l.self.location&&(R=l.self.location.protocol.slice(0,-1)),g=!hy.test(R?R.toLowerCase():"")}f=g}if(f)ot(a,"complete"),ot(a,"success");else{a.m=6;try{var S=2<zt(a)?a.g.statusText:""}catch{S=""}a.l=S+" ["+a.Z()+"]",Cu(a)}}finally{Xr(a)}}}}function Xr(a,u){if(a.g){Su(a);const f=a.g,g=a.v[0]?()=>{}:null;a.g=null,a.v=null,u||ot(a,"ready");try{f.onreadystatechange=g}catch{}}}function Su(a){a.I&&(l.clearTimeout(a.I),a.I=null)}n.isActive=function(){return!!this.g};function zt(a){return a.g?a.g.readyState:0}n.Z=function(){try{return 2<zt(this)?this.g.status:-1}catch{return-1}},n.oa=function(){try{return this.g?this.g.responseText:""}catch{return""}},n.Oa=function(a){if(this.g){var u=this.g.responseText;return a&&u.indexOf(a)==0&&(u=u.substring(a.length)),q_(u)}};function Au(a){try{if(!a.g)return null;if("response"in a.g)return a.g.response;switch(a.H){case"":case"text":return a.g.responseText;case"arraybuffer":if("mozResponseArrayBuffer"in a.g)return a.g.mozResponseArrayBuffer}return null}catch{return null}}function dy(a){const u={};a=(a.g&&2<=zt(a)&&a.g.getAllResponseHeaders()||"").split(`\r
`);for(let g=0;g<a.length;g++){if(U(a[g]))continue;var f=T(a[g]);const R=f[0];if(f=f[1],typeof f!="string")continue;f=f.trim();const S=u[R]||[];u[R]=S,S.push(f)}I(u,function(g){return g.join(", ")})}n.Ba=function(){return this.m},n.Ka=function(){return typeof this.l=="string"?this.l:String(this.l)};function Ii(a,u,f){return f&&f.internalChannelParams&&f.internalChannelParams[a]||u}function ku(a){this.Aa=0,this.i=[],this.j=new gi,this.ia=this.qa=this.I=this.W=this.g=this.ya=this.D=this.H=this.m=this.S=this.o=null,this.Ya=this.U=0,this.Va=Ii("failFast",!1,a),this.F=this.C=this.u=this.s=this.l=null,this.X=!0,this.za=this.T=-1,this.Y=this.v=this.B=0,this.Ta=Ii("baseRetryDelayMs",5e3,a),this.cb=Ii("retryDelaySeedMs",1e4,a),this.Wa=Ii("forwardChannelMaxRetries",2,a),this.wa=Ii("forwardChannelRequestTimeoutMs",2e4,a),this.pa=a&&a.xmlHttpFactory||void 0,this.Xa=a&&a.Tb||void 0,this.Ca=a&&a.useFetchStreams||!1,this.L=void 0,this.J=a&&a.supportsCrossDomainXhr||!1,this.K="",this.h=new hu(a&&a.concurrentRequestLimit),this.Da=new ly,this.P=a&&a.fastHandshake||!1,this.O=a&&a.encodeInitMessageHeaders||!1,this.P&&this.O&&(this.O=!1),this.Ua=a&&a.Rb||!1,a&&a.xa&&this.j.xa(),a&&a.forceLongPolling&&(this.X=!1),this.ba=!this.P&&this.X&&a&&a.detectBufferingProxy||!1,this.ja=void 0,a&&a.longPollingTimeout&&0<a.longPollingTimeout&&(this.ja=a.longPollingTimeout),this.ca=void 0,this.R=0,this.M=!1,this.ka=this.A=null}n=ku.prototype,n.la=8,n.G=1,n.connect=function(a,u,f,g){at(0),this.W=a,this.H=u||{},f&&g!==void 0&&(this.H.OSID=f,this.H.OAID=g),this.F=this.X,this.I=Fu(this,null,this.W),Zr(this)};function nl(a){if(Pu(a),a.G==3){var u=a.U++,f=$t(a.I);if(ye(f,"SID",a.K),ye(f,"RID",u),ye(f,"TYPE","terminate"),bi(a,f),u=new un(a,a.j,u),u.L=2,u.v=Kr($t(f)),f=!1,l.navigator&&l.navigator.sendBeacon)try{f=l.navigator.sendBeacon(u.v.toString(),"")}catch{}!f&&l.Image&&(new Image().src=u.v,f=!0),f||(u.g=Bu(u.j,null),u.g.ea(u.v)),u.F=Date.now(),zr(u)}Vu(a)}function Jr(a){a.g&&(il(a),a.g.cancel(),a.g=null)}function Pu(a){Jr(a),a.u&&(l.clearTimeout(a.u),a.u=null),eo(a),a.h.cancel(),a.s&&(typeof a.s=="number"&&l.clearTimeout(a.s),a.s=null)}function Zr(a){if(!uu(a.h)&&!a.s){a.s=!0;var u=a.Ga;Le||_s(),qe||(Le(),qe=!0),wt.add(u,a),a.B=0}}function fy(a,u){return du(a.h)>=a.h.j-(a.s?1:0)?!1:a.s?(a.i=u.D.concat(a.i),!0):a.G==1||a.G==2||a.B>=(a.Va?0:a.Wa)?!1:(a.s=pi(p(a.Ga,a,u),Ou(a,a.B)),a.B++,!0)}n.Ga=function(a){if(this.s)if(this.s=null,this.G==1){if(!a){this.U=Math.floor(1e5*Math.random()),a=this.U++;const R=new un(this,this.j,a);let S=this.o;if(this.S&&(S?(S=y(S),w(S,this.S)):S=this.S),this.m!==null||this.O||(R.H=S,S=null),this.P)e:{for(var u=0,f=0;f<this.i.length;f++){t:{var g=this.i[f];if("__data__"in g.map&&(g=g.map.__data__,typeof g=="string")){g=g.length;break t}g=void 0}if(g===void 0)break;if(u+=g,4096<u){u=f;break e}if(u===4096||f===this.i.length-1){u=f+1;break e}}u=1e3}else u=1e3;u=Du(this,R,u),f=$t(this.I),ye(f,"RID",a),ye(f,"CVER",22),this.D&&ye(f,"X-HTTP-Session-Id",this.D),bi(this,f),S&&(this.O?u="headers="+encodeURIComponent(String(Iu(S)))+"&"+u:this.m&&tl(f,this.m,S)),el(this.h,R),this.Ua&&ye(f,"TYPE","init"),this.P?(ye(f,"$req",u),ye(f,"SID","null"),R.T=!0,Ya(R,f,null)):Ya(R,f,u),this.G=2}}else this.G==3&&(a?Nu(this,a):this.i.length==0||uu(this.h)||Nu(this))};function Nu(a,u){var f;u?f=u.l:f=a.U++;const g=$t(a.I);ye(g,"SID",a.K),ye(g,"RID",f),ye(g,"AID",a.T),bi(a,g),a.m&&a.o&&tl(g,a.m,a.o),f=new un(a,a.j,f,a.B+1),a.m===null&&(f.H=a.o),u&&(a.i=u.D.concat(a.i)),u=Du(a,f,1e3),f.I=Math.round(.5*a.wa)+Math.round(.5*a.wa*Math.random()),el(a.h,f),Ya(f,g,u)}function bi(a,u){a.H&&ee(a.H,function(f,g){ye(u,g,f)}),a.l&&pu({},function(f,g){ye(u,g,f)})}function Du(a,u,f){f=Math.min(a.i.length,f);var g=a.l?p(a.l.Na,a.l,a):null;e:{var R=a.i;let S=-1;for(;;){const L=["count="+f];S==-1?0<f?(S=R[0].g,L.push("ofs="+S)):S=0:L.push("ofs="+S);let me=!0;for(let He=0;He<f;He++){let ae=R[He].g;const Xe=R[He].map;if(ae-=S,0>ae)S=Math.max(0,R[He].g-100),me=!1;else try{cy(Xe,L,"req"+ae+"_")}catch{g&&g(Xe)}}if(me){g=L.join("&");break e}}}return a=a.i.splice(0,f),u.D=a,g}function xu(a){if(!a.g&&!a.u){a.Y=1;var u=a.Fa;Le||_s(),qe||(Le(),qe=!0),wt.add(u,a),a.v=0}}function sl(a){return a.g||a.u||3<=a.v?!1:(a.Y++,a.u=pi(p(a.Fa,a),Ou(a,a.v)),a.v++,!0)}n.Fa=function(){if(this.u=null,Mu(this),this.ba&&!(this.M||this.g==null||0>=this.R)){var a=2*this.R;this.j.info("BP detection timer enabled: "+a),this.A=pi(p(this.ab,this),a)}},n.ab=function(){this.A&&(this.A=null,this.j.info("BP detection timeout reached."),this.j.info("Buffering proxy detected and switch to long-polling!"),this.F=!1,this.M=!0,at(10),Jr(this),Mu(this))};function il(a){a.A!=null&&(l.clearTimeout(a.A),a.A=null)}function Mu(a){a.g=new un(a,a.j,"rpc",a.Y),a.m===null&&(a.g.H=a.o),a.g.O=0;var u=$t(a.qa);ye(u,"RID","rpc"),ye(u,"SID",a.K),ye(u,"AID",a.T),ye(u,"CI",a.F?"0":"1"),!a.F&&a.ja&&ye(u,"TO",a.ja),ye(u,"TYPE","xmlhttp"),bi(a,u),a.m&&a.o&&tl(u,a.m,a.o),a.L&&(a.g.I=a.L);var f=a.g;a=a.ia,f.L=1,f.v=Kr($t(u)),f.m=null,f.P=!0,au(f,a)}n.Za=function(){this.C!=null&&(this.C=null,Jr(this),sl(this),at(19))};function eo(a){a.C!=null&&(l.clearTimeout(a.C),a.C=null)}function Lu(a,u){var f=null;if(a.g==u){eo(a),il(a),a.g=null;var g=2}else if(Za(a.h,u))f=u.D,fu(a.h,u),g=1;else return;if(a.G!=0){if(u.o)if(g==1){f=u.m?u.m.length:0,u=Date.now()-u.F;var R=a.B;g=Wr(),ot(g,new su(g,f)),Zr(a)}else xu(a);else if(R=u.s,R==3||R==0&&0<u.X||!(g==1&&fy(a,u)||g==2&&sl(a)))switch(f&&0<f.length&&(u=a.h,u.i=u.i.concat(f)),R){case 1:zn(a,5);break;case 4:zn(a,10);break;case 3:zn(a,6);break;default:zn(a,2)}}}function Ou(a,u){let f=a.Ta+Math.floor(Math.random()*a.cb);return a.isActive()||(f*=2),f*u}function zn(a,u){if(a.j.info("Error code "+u),u==2){var f=p(a.fb,a),g=a.Xa;const R=!g;g=new $n(g||"//www.google.com/images/cleardot.gif"),l.location&&l.location.protocol=="http"||Hr(g,"https"),Kr(g),R?oy(g.toString(),f):ay(g.toString(),f)}else at(2);a.G=0,a.l&&a.l.sa(u),Vu(a),Pu(a)}n.fb=function(a){a?(this.j.info("Successfully pinged google.com"),at(2)):(this.j.info("Failed to ping google.com"),at(1))};function Vu(a){if(a.G=0,a.ka=[],a.l){const u=mu(a.h);(u.length!=0||a.i.length!=0)&&(P(a.ka,u),P(a.ka,a.i),a.h.i.length=0,A(a.i),a.i.length=0),a.l.ra()}}function Fu(a,u,f){var g=f instanceof $n?$t(f):new $n(f);if(g.g!="")u&&(g.g=u+"."+g.g),Gr(g,g.s);else{var R=l.location;g=R.protocol,u=u?u+"."+R.hostname:R.hostname,R=+R.port;var S=new $n(null);g&&Hr(S,g),u&&(S.g=u),R&&Gr(S,R),f&&(S.l=f),g=S}return f=a.D,u=a.ya,f&&u&&ye(g,f,u),ye(g,"VER",a.la),bi(a,g),g}function Bu(a,u,f){if(u&&!a.J)throw Error("Can't create secondary domain capable XhrIo object.");return u=a.Ca&&!a.pa?new be(new Qr({eb:f})):new be(a.pa),u.Ha(a.J),u}n.isActive=function(){return!!this.l&&this.l.isActive(this)};function Uu(){}n=Uu.prototype,n.ua=function(){},n.ta=function(){},n.sa=function(){},n.ra=function(){},n.isActive=function(){return!0},n.Na=function(){};function to(){}to.prototype.g=function(a,u){return new gt(a,u)};function gt(a,u){De.call(this),this.g=new ku(u),this.l=a,this.h=u&&u.messageUrlParams||null,a=u&&u.messageHeaders||null,u&&u.clientProtocolHeaderRequired&&(a?a["X-Client-Protocol"]="webchannel":a={"X-Client-Protocol":"webchannel"}),this.g.o=a,a=u&&u.initMessageHeaders||null,u&&u.messageContentType&&(a?a["X-WebChannel-Content-Type"]=u.messageContentType:a={"X-WebChannel-Content-Type":u.messageContentType}),u&&u.va&&(a?a["X-WebChannel-Client-Profile"]=u.va:a={"X-WebChannel-Client-Profile":u.va}),this.g.S=a,(a=u&&u.Sb)&&!U(a)&&(this.g.m=a),this.v=u&&u.supportsCrossDomainXhr||!1,this.u=u&&u.sendRawJson||!1,(u=u&&u.httpSessionIdParam)&&!U(u)&&(this.g.D=u,a=this.h,a!==null&&u in a&&(a=this.h,u in a&&delete a[u])),this.j=new ws(this)}b(gt,De),gt.prototype.m=function(){this.g.l=this.j,this.v&&(this.g.J=!0),this.g.connect(this.l,this.h||void 0)},gt.prototype.close=function(){nl(this.g)},gt.prototype.o=function(a){var u=this.g;if(typeof a=="string"){var f={};f.__data__=a,a=f}else this.u&&(f={},f.__data__=$a(a),a=f);u.i.push(new Y_(u.Ya++,a)),u.G==3&&Zr(u)},gt.prototype.N=function(){this.g.l=null,delete this.j,nl(this.g),delete this.g,gt.aa.N.call(this)};function ju(a){Ha.call(this),a.__headers__&&(this.headers=a.__headers__,this.statusCode=a.__status__,delete a.__headers__,delete a.__status__);var u=a.__sm__;if(u){e:{for(const f in u){a=f;break e}a=void 0}(this.i=a)&&(a=this.i,u=u!==null&&a in u?u[a]:void 0),this.data=u}else this.data=a}b(ju,Ha);function Wu(){Ga.call(this),this.status=1}b(Wu,Ga);function ws(a){this.g=a}b(ws,Uu),ws.prototype.ua=function(){ot(this.g,"a")},ws.prototype.ta=function(a){ot(this.g,new ju(a))},ws.prototype.sa=function(a){ot(this.g,new Wu)},ws.prototype.ra=function(){ot(this.g,"b")},to.prototype.createWebChannel=to.prototype.g,gt.prototype.send=gt.prototype.o,gt.prototype.open=gt.prototype.m,gt.prototype.close=gt.prototype.close,Gm=function(){return new to},Hm=function(){return Wr()},zm=Wn,Bl={mb:0,pb:1,qb:2,Jb:3,Ob:4,Lb:5,Mb:6,Kb:7,Ib:8,Nb:9,PROXY:10,NOPROXY:11,Gb:12,Cb:13,Db:14,Bb:15,Eb:16,Fb:17,ib:18,hb:19,jb:20},qr.NO_ERROR=0,qr.TIMEOUT=8,qr.HTTP_ERROR=6,go=qr,iu.COMPLETE="complete",$m=iu,Zh.EventType=fi,fi.OPEN="a",fi.CLOSE="b",fi.ERROR="c",fi.MESSAGE="d",De.prototype.listen=De.prototype.K,Li=Zh,be.prototype.listenOnce=be.prototype.L,be.prototype.getLastError=be.prototype.Ka,be.prototype.getLastErrorCode=be.prototype.Ba,be.prototype.getStatus=be.prototype.Z,be.prototype.getResponseJson=be.prototype.Oa,be.prototype.getResponseText=be.prototype.oa,be.prototype.send=be.prototype.ea,be.prototype.setWithCredentials=be.prototype.Ha,qm=be}).apply(typeof io<"u"?io:typeof self<"u"?self:typeof window<"u"?window:{});const _d="@firebase/firestore";/**
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
 */class nt{constructor(e){this.uid=e}isAuthenticated(){return this.uid!=null}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(e){return e.uid===this.uid}}nt.UNAUTHENTICATED=new nt(null),nt.GOOGLE_CREDENTIALS=new nt("google-credentials-uid"),nt.FIRST_PARTY=new nt("first-party-uid"),nt.MOCK_USER=new nt("mock-user");/**
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
 */let ni="10.14.0";/**
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
 */const is=new fa("@firebase/firestore");function ki(){return is.logLevel}function B(n,...e){if(is.logLevel<=te.DEBUG){const t=e.map(Ac);is.debug(`Firestore (${ni}): ${n}`,...t)}}function rn(n,...e){if(is.logLevel<=te.ERROR){const t=e.map(Ac);is.error(`Firestore (${ni}): ${n}`,...t)}}function Us(n,...e){if(is.logLevel<=te.WARN){const t=e.map(Ac);is.warn(`Firestore (${ni}): ${n}`,...t)}}function Ac(n){if(typeof n=="string")return n;try{/**
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
 */function q(n="Unexpected state"){const e=`FIRESTORE (${ni}) INTERNAL ASSERTION FAILED: `+n;throw rn(e),new Error(e)}function re(n,e){n||q()}function Q(n,e){return n}/**
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
 */const k={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};class V extends ln{constructor(e,t){super(e,t),this.code=e,this.message=t,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}/**
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
 */class Ot{constructor(){this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}}/**
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
 */class Km{constructor(e,t){this.user=t,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${e}`)}}class Qw{getToken(){return Promise.resolve(null)}invalidateToken(){}start(e,t){e.enqueueRetryable(()=>t(nt.UNAUTHENTICATED))}shutdown(){}}class Yw{constructor(e){this.token=e,this.changeListener=null}getToken(){return Promise.resolve(this.token)}invalidateToken(){}start(e,t){this.changeListener=t,e.enqueueRetryable(()=>t(this.token.user))}shutdown(){this.changeListener=null}}class Xw{constructor(e){this.t=e,this.currentUser=nt.UNAUTHENTICATED,this.i=0,this.forceRefresh=!1,this.auth=null}start(e,t){re(this.o===void 0);let s=this.i;const i=c=>this.i!==s?(s=this.i,t(c)):Promise.resolve();let r=new Ot;this.o=()=>{this.i++,this.currentUser=this.u(),r.resolve(),r=new Ot,e.enqueueRetryable(()=>i(this.currentUser))};const o=()=>{const c=r;e.enqueueRetryable(async()=>{await c.promise,await i(this.currentUser)})},l=c=>{B("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=c,this.o&&(this.auth.addAuthTokenListener(this.o),o())};this.t.onInit(c=>l(c)),setTimeout(()=>{if(!this.auth){const c=this.t.getImmediate({optional:!0});c?l(c):(B("FirebaseAuthCredentialsProvider","Auth not yet detected"),r.resolve(),r=new Ot)}},0),o()}getToken(){const e=this.i,t=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(t).then(s=>this.i!==e?(B("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):s?(re(typeof s.accessToken=="string"),new Km(s.accessToken,this.currentUser)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.o&&this.auth.removeAuthTokenListener(this.o),this.o=void 0}u(){const e=this.auth&&this.auth.getUid();return re(e===null||typeof e=="string"),new nt(e)}}class Jw{constructor(e,t,s){this.l=e,this.h=t,this.P=s,this.type="FirstParty",this.user=nt.FIRST_PARTY,this.I=new Map}T(){return this.P?this.P():null}get headers(){this.I.set("X-Goog-AuthUser",this.l);const e=this.T();return e&&this.I.set("Authorization",e),this.h&&this.I.set("X-Goog-Iam-Authorization-Token",this.h),this.I}}class Zw{constructor(e,t,s){this.l=e,this.h=t,this.P=s}getToken(){return Promise.resolve(new Jw(this.l,this.h,this.P))}start(e,t){e.enqueueRetryable(()=>t(nt.FIRST_PARTY))}shutdown(){}invalidateToken(){}}class eT{constructor(e){this.value=e,this.type="AppCheck",this.headers=new Map,e&&e.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class tT{constructor(e){this.A=e,this.forceRefresh=!1,this.appCheck=null,this.R=null}start(e,t){re(this.o===void 0);const s=r=>{r.error!=null&&B("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${r.error.message}`);const o=r.token!==this.R;return this.R=r.token,B("FirebaseAppCheckTokenProvider",`Received ${o?"new":"existing"} token.`),o?t(r.token):Promise.resolve()};this.o=r=>{e.enqueueRetryable(()=>s(r))};const i=r=>{B("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=r,this.o&&this.appCheck.addTokenListener(this.o)};this.A.onInit(r=>i(r)),setTimeout(()=>{if(!this.appCheck){const r=this.A.getImmediate({optional:!0});r?i(r):B("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}},0)}getToken(){const e=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(e).then(t=>t?(re(typeof t.token=="string"),this.R=t.token,new eT(t.token)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.o&&this.appCheck.removeTokenListener(this.o),this.o=void 0}}/**
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
 */class Qm{static newId(){const e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",t=Math.floor(256/e.length)*e.length;let s="";for(;s.length<20;){const i=nT(40);for(let r=0;r<i.length;++r)s.length<20&&i[r]<t&&(s+=e.charAt(i[r]%e.length))}return s}}function le(n,e){return n<e?-1:n>e?1:0}function js(n,e,t){return n.length===e.length&&n.every((s,i)=>t(s,e[i]))}/**
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
 */class Me{constructor(e,t){if(this.seconds=e,this.nanoseconds=t,t<0)throw new V(k.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(t>=1e9)throw new V(k.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(e<-62135596800)throw new V(k.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e);if(e>=253402300800)throw new V(k.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e)}static now(){return Me.fromMillis(Date.now())}static fromDate(e){return Me.fromMillis(e.getTime())}static fromMillis(e){const t=Math.floor(e/1e3),s=Math.floor(1e6*(e-1e3*t));return new Me(t,s)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/1e6}_compareTo(e){return this.seconds===e.seconds?le(this.nanoseconds,e.nanoseconds):le(this.seconds,e.seconds)}isEqual(e){return e.seconds===this.seconds&&e.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{seconds:this.seconds,nanoseconds:this.nanoseconds}}valueOf(){const e=this.seconds- -62135596800;return String(e).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}/**
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
 */class z{constructor(e){this.timestamp=e}static fromTimestamp(e){return new z(e)}static min(){return new z(new Me(0,0))}static max(){return new z(new Me(253402300799,999999999))}compareTo(e){return this.timestamp._compareTo(e.timestamp)}isEqual(e){return this.timestamp.isEqual(e.timestamp)}toMicroseconds(){return 1e6*this.timestamp.seconds+this.timestamp.nanoseconds/1e3}toString(){return"SnapshotVersion("+this.timestamp.toString()+")"}toTimestamp(){return this.timestamp}}/**
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
 */class tr{constructor(e,t,s){t===void 0?t=0:t>e.length&&q(),s===void 0?s=e.length-t:s>e.length-t&&q(),this.segments=e,this.offset=t,this.len=s}get length(){return this.len}isEqual(e){return tr.comparator(this,e)===0}child(e){const t=this.segments.slice(this.offset,this.limit());return e instanceof tr?e.forEach(s=>{t.push(s)}):t.push(e),this.construct(t)}limit(){return this.offset+this.length}popFirst(e){return e=e===void 0?1:e,this.construct(this.segments,this.offset+e,this.length-e)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(e){return this.segments[this.offset+e]}isEmpty(){return this.length===0}isPrefixOf(e){if(e.length<this.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}isImmediateParentOf(e){if(this.length+1!==e.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}forEach(e){for(let t=this.offset,s=this.limit();t<s;t++)e(this.segments[t])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(e,t){const s=Math.min(e.length,t.length);for(let i=0;i<s;i++){const r=e.get(i),o=t.get(i);if(r<o)return-1;if(r>o)return 1}return e.length<t.length?-1:e.length>t.length?1:0}}class ge extends tr{construct(e,t,s){return new ge(e,t,s)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...e){const t=[];for(const s of e){if(s.indexOf("//")>=0)throw new V(k.INVALID_ARGUMENT,`Invalid segment (${s}). Paths must not contain // in them.`);t.push(...s.split("/").filter(i=>i.length>0))}return new ge(t)}static emptyPath(){return new ge([])}}const sT=/^[_a-zA-Z][_a-zA-Z0-9]*$/;class Ke extends tr{construct(e,t,s){return new Ke(e,t,s)}static isValidIdentifier(e){return sT.test(e)}canonicalString(){return this.toArray().map(e=>(e=e.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),Ke.isValidIdentifier(e)||(e="`"+e+"`"),e)).join(".")}toString(){return this.canonicalString()}isKeyField(){return this.length===1&&this.get(0)==="__name__"}static keyField(){return new Ke(["__name__"])}static fromServerFormat(e){const t=[];let s="",i=0;const r=()=>{if(s.length===0)throw new V(k.INVALID_ARGUMENT,`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);t.push(s),s=""};let o=!1;for(;i<e.length;){const l=e[i];if(l==="\\"){if(i+1===e.length)throw new V(k.INVALID_ARGUMENT,"Path has trailing escape character: "+e);const c=e[i+1];if(c!=="\\"&&c!=="."&&c!=="`")throw new V(k.INVALID_ARGUMENT,"Path has invalid escape sequence: "+e);s+=c,i+=2}else l==="`"?(o=!o,i++):l!=="."||o?(s+=l,i++):(r(),i++)}if(r(),o)throw new V(k.INVALID_ARGUMENT,"Unterminated ` in path: "+e);return new Ke(t)}static emptyPath(){return new Ke([])}}/**
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
 */class j{constructor(e){this.path=e}static fromPath(e){return new j(ge.fromString(e))}static fromName(e){return new j(ge.fromString(e).popFirst(5))}static empty(){return new j(ge.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(e){return this.path.length>=2&&this.path.get(this.path.length-2)===e}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(e){return e!==null&&ge.comparator(this.path,e.path)===0}toString(){return this.path.toString()}static comparator(e,t){return ge.comparator(e.path,t.path)}static isDocumentKey(e){return e.length%2==0}static fromSegments(e){return new j(new ge(e.slice()))}}function iT(n,e){const t=n.toTimestamp().seconds,s=n.toTimestamp().nanoseconds+1,i=z.fromTimestamp(s===1e9?new Me(t+1,0):new Me(t,s));return new An(i,j.empty(),e)}function rT(n){return new An(n.readTime,n.key,-1)}class An{constructor(e,t,s){this.readTime=e,this.documentKey=t,this.largestBatchId=s}static min(){return new An(z.min(),j.empty(),-1)}static max(){return new An(z.max(),j.empty(),-1)}}function oT(n,e){let t=n.readTime.compareTo(e.readTime);return t!==0?t:(t=j.comparator(n.documentKey,e.documentKey),t!==0?t:le(n.largestBatchId,e.largestBatchId))}/**
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
 */class N{constructor(e){this.nextCallback=null,this.catchCallback=null,this.result=void 0,this.error=void 0,this.isDone=!1,this.callbackAttached=!1,e(t=>{this.isDone=!0,this.result=t,this.nextCallback&&this.nextCallback(t)},t=>{this.isDone=!0,this.error=t,this.catchCallback&&this.catchCallback(t)})}catch(e){return this.next(void 0,e)}next(e,t){return this.callbackAttached&&q(),this.callbackAttached=!0,this.isDone?this.error?this.wrapFailure(t,this.error):this.wrapSuccess(e,this.result):new N((s,i)=>{this.nextCallback=r=>{this.wrapSuccess(e,r).next(s,i)},this.catchCallback=r=>{this.wrapFailure(t,r).next(s,i)}})}toPromise(){return new Promise((e,t)=>{this.next(e,t)})}wrapUserFunction(e){try{const t=e();return t instanceof N?t:N.resolve(t)}catch(t){return N.reject(t)}}wrapSuccess(e,t){return e?this.wrapUserFunction(()=>e(t)):N.resolve(t)}wrapFailure(e,t){return e?this.wrapUserFunction(()=>e(t)):N.reject(t)}static resolve(e){return new N((t,s)=>{t(e)})}static reject(e){return new N((t,s)=>{s(e)})}static waitFor(e){return new N((t,s)=>{let i=0,r=0,o=!1;e.forEach(l=>{++i,l.next(()=>{++r,o&&r===i&&t()},c=>s(c))}),o=!0,r===i&&t()})}static or(e){let t=N.resolve(!1);for(const s of e)t=t.next(i=>i?N.resolve(i):s());return t}static forEach(e,t){const s=[];return e.forEach((i,r)=>{s.push(t.call(this,i,r))}),this.waitFor(s)}static mapArray(e,t){return new N((s,i)=>{const r=e.length,o=new Array(r);let l=0;for(let c=0;c<r;c++){const h=c;t(e[h]).next(d=>{o[h]=d,++l,l===r&&s(o)},d=>i(d))}})}static doWhile(e,t){return new N((s,i)=>{const r=()=>{e()===!0?t().next(()=>{r()},i):s()};r()})}}function cT(n){const e=n.match(/Android ([\d.]+)/i),t=e?e[1].split(".").slice(0,2).join("."):"-1";return Number(t)}function Er(n){return n.name==="IndexedDbTransactionError"}/**
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
 */class kc{constructor(e,t){this.previousValue=e,t&&(t.sequenceNumberHandler=s=>this.ie(s),this.se=s=>t.writeSequenceNumber(s))}ie(e){return this.previousValue=Math.max(e,this.previousValue),this.previousValue}next(){const e=++this.previousValue;return this.se&&this.se(e),e}}kc.oe=-1;function wr(n){return n==null}function Mo(n){return n===0&&1/n==-1/0}function hT(n){return typeof n=="number"&&Number.isInteger(n)&&!Mo(n)&&n<=Number.MAX_SAFE_INTEGER&&n>=Number.MIN_SAFE_INTEGER}/**
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
 */function yd(n){let e=0;for(const t in n)Object.prototype.hasOwnProperty.call(n,t)&&e++;return e}function ds(n,e){for(const t in n)Object.prototype.hasOwnProperty.call(n,t)&&e(t,n[t])}function Ym(n){for(const e in n)if(Object.prototype.hasOwnProperty.call(n,e))return!1;return!0}/**
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
 */let Pe=class Ul{constructor(e,t){this.comparator=e,this.root=t||In.EMPTY}insert(e,t){return new Ul(this.comparator,this.root.insert(e,t,this.comparator).copy(null,null,In.BLACK,null,null))}remove(e){return new Ul(this.comparator,this.root.remove(e,this.comparator).copy(null,null,In.BLACK,null,null))}get(e){let t=this.root;for(;!t.isEmpty();){const s=this.comparator(e,t.key);if(s===0)return t.value;s<0?t=t.left:s>0&&(t=t.right)}return null}indexOf(e){let t=0,s=this.root;for(;!s.isEmpty();){const i=this.comparator(e,s.key);if(i===0)return t+s.left.size;i<0?s=s.left:(t+=s.left.size+1,s=s.right)}return-1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(e){return this.root.inorderTraversal(e)}forEach(e){this.inorderTraversal((t,s)=>(e(t,s),!1))}toString(){const e=[];return this.inorderTraversal((t,s)=>(e.push(`${t}:${s}`),!1)),`{${e.join(", ")}}`}reverseTraversal(e){return this.root.reverseTraversal(e)}getIterator(){return new ro(this.root,null,this.comparator,!1)}getIteratorFrom(e){return new ro(this.root,e,this.comparator,!1)}getReverseIterator(){return new ro(this.root,null,this.comparator,!0)}getReverseIteratorFrom(e){return new ro(this.root,e,this.comparator,!0)}},ro=class{constructor(e,t,s,i){this.isReverse=i,this.nodeStack=[];let r=1;for(;!e.isEmpty();)if(r=t?s(e.key,t):1,t&&i&&(r*=-1),r<0)e=this.isReverse?e.left:e.right;else{if(r===0){this.nodeStack.push(e);break}this.nodeStack.push(e),e=this.isReverse?e.right:e.left}}getNext(){let e=this.nodeStack.pop();const t={key:e.key,value:e.value};if(this.isReverse)for(e=e.left;!e.isEmpty();)this.nodeStack.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack.push(e),e=e.left;return t}hasNext(){return this.nodeStack.length>0}peek(){if(this.nodeStack.length===0)return null;const e=this.nodeStack[this.nodeStack.length-1];return{key:e.key,value:e.value}}},In=class Gt{constructor(e,t,s,i,r){this.key=e,this.value=t,this.color=s??Gt.RED,this.left=i??Gt.EMPTY,this.right=r??Gt.EMPTY,this.size=this.left.size+1+this.right.size}copy(e,t,s,i,r){return new Gt(e??this.key,t??this.value,s??this.color,i??this.left,r??this.right)}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,t,s){let i=this;const r=s(e,i.key);return i=r<0?i.copy(null,null,null,i.left.insert(e,t,s),null):r===0?i.copy(null,t,null,null,null):i.copy(null,null,null,null,i.right.insert(e,t,s)),i.fixUp()}removeMin(){if(this.left.isEmpty())return Gt.EMPTY;let e=this;return e.left.isRed()||e.left.left.isRed()||(e=e.moveRedLeft()),e=e.copy(null,null,null,e.left.removeMin(),null),e.fixUp()}remove(e,t){let s,i=this;if(t(e,i.key)<0)i.left.isEmpty()||i.left.isRed()||i.left.left.isRed()||(i=i.moveRedLeft()),i=i.copy(null,null,null,i.left.remove(e,t),null);else{if(i.left.isRed()&&(i=i.rotateRight()),i.right.isEmpty()||i.right.isRed()||i.right.left.isRed()||(i=i.moveRedRight()),t(e,i.key)===0){if(i.right.isEmpty())return Gt.EMPTY;s=i.right.min(),i=i.copy(s.key,s.value,null,null,i.right.removeMin())}i=i.copy(null,null,null,null,i.right.remove(e,t))}return i.fixUp()}isRed(){return this.color}fixUp(){let e=this;return e.right.isRed()&&!e.left.isRed()&&(e=e.rotateLeft()),e.left.isRed()&&e.left.left.isRed()&&(e=e.rotateRight()),e.left.isRed()&&e.right.isRed()&&(e=e.colorFlip()),e}moveRedLeft(){let e=this.colorFlip();return e.right.left.isRed()&&(e=e.copy(null,null,null,null,e.right.rotateRight()),e=e.rotateLeft(),e=e.colorFlip()),e}moveRedRight(){let e=this.colorFlip();return e.left.left.isRed()&&(e=e.rotateRight(),e=e.colorFlip()),e}rotateLeft(){const e=this.copy(null,null,Gt.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight(){const e=this.copy(null,null,Gt.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip(){const e=this.left.copy(null,null,!this.left.color,null,null),t=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,t)}checkMaxDepth(){const e=this.check();return Math.pow(2,e)<=this.size+1}check(){if(this.isRed()&&this.left.isRed()||this.right.isRed())throw q();const e=this.left.check();if(e!==this.right.check())throw q();return e+(this.isRed()?0:1)}};In.EMPTY=null,In.RED=!0,In.BLACK=!1;In.EMPTY=new class{constructor(){this.size=0}get key(){throw q()}get value(){throw q()}get color(){throw q()}get left(){throw q()}get right(){throw q()}copy(e,t,s,i,r){return this}insert(e,t,s){return new In(e,t)}remove(e,t){return this}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}};/**
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
 */class Qe{constructor(e){this.comparator=e,this.data=new Pe(this.comparator)}has(e){return this.data.get(e)!==null}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(e){return this.data.indexOf(e)}forEach(e){this.data.inorderTraversal((t,s)=>(e(t),!1))}forEachInRange(e,t){const s=this.data.getIteratorFrom(e[0]);for(;s.hasNext();){const i=s.getNext();if(this.comparator(i.key,e[1])>=0)return;t(i.key)}}forEachWhile(e,t){let s;for(s=t!==void 0?this.data.getIteratorFrom(t):this.data.getIterator();s.hasNext();)if(!e(s.getNext().key))return}firstAfterOrEqual(e){const t=this.data.getIteratorFrom(e);return t.hasNext()?t.getNext().key:null}getIterator(){return new vd(this.data.getIterator())}getIteratorFrom(e){return new vd(this.data.getIteratorFrom(e))}add(e){return this.copy(this.data.remove(e).insert(e,!0))}delete(e){return this.has(e)?this.copy(this.data.remove(e)):this}isEmpty(){return this.data.isEmpty()}unionWith(e){let t=this;return t.size<e.size&&(t=e,e=this),e.forEach(s=>{t=t.add(s)}),t}isEqual(e){if(!(e instanceof Qe)||this.size!==e.size)return!1;const t=this.data.getIterator(),s=e.data.getIterator();for(;t.hasNext();){const i=t.getNext().key,r=s.getNext().key;if(this.comparator(i,r)!==0)return!1}return!0}toArray(){const e=[];return this.forEach(t=>{e.push(t)}),e}toString(){const e=[];return this.forEach(t=>e.push(t)),"SortedSet("+e.toString()+")"}copy(e){const t=new Qe(this.comparator);return t.data=e,t}}class vd{constructor(e){this.iter=e}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}}/**
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
 */class vt{constructor(e){this.fields=e,e.sort(Ke.comparator)}static empty(){return new vt([])}unionWith(e){let t=new Qe(Ke.comparator);for(const s of this.fields)t=t.add(s);for(const s of e)t=t.add(s);return new vt(t.toArray())}covers(e){for(const t of this.fields)if(t.isPrefixOf(e))return!0;return!1}isEqual(e){return js(this.fields,e.fields,(t,s)=>t.isEqual(s))}}/**
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
 */class Xm extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}}/**
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
 */class Ye{constructor(e){this.binaryString=e}static fromBase64String(e){const t=function(i){try{return atob(i)}catch(r){throw typeof DOMException<"u"&&r instanceof DOMException?new Xm("Invalid base64 string: "+r):r}}(e);return new Ye(t)}static fromUint8Array(e){const t=function(i){let r="";for(let o=0;o<i.length;++o)r+=String.fromCharCode(i[o]);return r}(e);return new Ye(t)}[Symbol.iterator](){let e=0;return{next:()=>e<this.binaryString.length?{value:this.binaryString.charCodeAt(e++),done:!1}:{value:void 0,done:!0}}}toBase64(){return function(t){return btoa(t)}(this.binaryString)}toUint8Array(){return function(t){const s=new Uint8Array(t.length);for(let i=0;i<t.length;i++)s[i]=t.charCodeAt(i);return s}(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(e){return le(this.binaryString,e.binaryString)}isEqual(e){return this.binaryString===e.binaryString}}Ye.EMPTY_BYTE_STRING=new Ye("");const uT=new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);function kn(n){if(re(!!n),typeof n=="string"){let e=0;const t=uT.exec(n);if(re(!!t),t[1]){let i=t[1];i=(i+"000000000").substr(0,9),e=Number(i)}const s=new Date(n);return{seconds:Math.floor(s.getTime()/1e3),nanos:e}}return{seconds:Se(n.seconds),nanos:Se(n.nanos)}}function Se(n){return typeof n=="number"?n:typeof n=="string"?Number(n):0}function rs(n){return typeof n=="string"?Ye.fromBase64String(n):Ye.fromUint8Array(n)}/**
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
 */function Pc(n){var e,t;return((t=(((e=n==null?void 0:n.mapValue)===null||e===void 0?void 0:e.fields)||{}).__type__)===null||t===void 0?void 0:t.stringValue)==="server_timestamp"}function Nc(n){const e=n.mapValue.fields.__previous_value__;return Pc(e)?Nc(e):e}function nr(n){const e=kn(n.mapValue.fields.__local_write_time__.timestampValue);return new Me(e.seconds,e.nanos)}/**
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
 */const oo={mapValue:{}};function os(n){return"nullValue"in n?0:"booleanValue"in n?1:"integerValue"in n||"doubleValue"in n?2:"timestampValue"in n?3:"stringValue"in n?5:"bytesValue"in n?6:"referenceValue"in n?7:"geoPointValue"in n?8:"arrayValue"in n?9:"mapValue"in n?Pc(n)?4:mT(n)?9007199254740991:fT(n)?10:11:q()}function Bt(n,e){if(n===e)return!0;const t=os(n);if(t!==os(e))return!1;switch(t){case 0:case 9007199254740991:return!0;case 1:return n.booleanValue===e.booleanValue;case 4:return nr(n).isEqual(nr(e));case 3:return function(i,r){if(typeof i.timestampValue=="string"&&typeof r.timestampValue=="string"&&i.timestampValue.length===r.timestampValue.length)return i.timestampValue===r.timestampValue;const o=kn(i.timestampValue),l=kn(r.timestampValue);return o.seconds===l.seconds&&o.nanos===l.nanos}(n,e);case 5:return n.stringValue===e.stringValue;case 6:return function(i,r){return rs(i.bytesValue).isEqual(rs(r.bytesValue))}(n,e);case 7:return n.referenceValue===e.referenceValue;case 8:return function(i,r){return Se(i.geoPointValue.latitude)===Se(r.geoPointValue.latitude)&&Se(i.geoPointValue.longitude)===Se(r.geoPointValue.longitude)}(n,e);case 2:return function(i,r){if("integerValue"in i&&"integerValue"in r)return Se(i.integerValue)===Se(r.integerValue);if("doubleValue"in i&&"doubleValue"in r){const o=Se(i.doubleValue),l=Se(r.doubleValue);return o===l?Mo(o)===Mo(l):isNaN(o)&&isNaN(l)}return!1}(n,e);case 9:return js(n.arrayValue.values||[],e.arrayValue.values||[],Bt);case 10:case 11:return function(i,r){const o=i.mapValue.fields||{},l=r.mapValue.fields||{};if(yd(o)!==yd(l))return!1;for(const c in o)if(o.hasOwnProperty(c)&&(l[c]===void 0||!Bt(o[c],l[c])))return!1;return!0}(n,e);default:return q()}}function ir(n,e){return(n.values||[]).find(t=>Bt(t,e))!==void 0}function Ws(n,e){if(n===e)return 0;const t=os(n),s=os(e);if(t!==s)return le(t,s);switch(t){case 0:case 9007199254740991:return 0;case 1:return le(n.booleanValue,e.booleanValue);case 2:return function(r,o){const l=Se(r.integerValue||r.doubleValue),c=Se(o.integerValue||o.doubleValue);return l<c?-1:l>c?1:l===c?0:isNaN(l)?isNaN(c)?0:-1:1}(n,e);case 3:return Ed(n.timestampValue,e.timestampValue);case 4:return Ed(nr(n),nr(e));case 5:return le(n.stringValue,e.stringValue);case 6:return function(r,o){const l=rs(r),c=rs(o);return l.compareTo(c)}(n.bytesValue,e.bytesValue);case 7:return function(r,o){const l=r.split("/"),c=o.split("/");for(let h=0;h<l.length&&h<c.length;h++){const d=le(l[h],c[h]);if(d!==0)return d}return le(l.length,c.length)}(n.referenceValue,e.referenceValue);case 8:return function(r,o){const l=le(Se(r.latitude),Se(o.latitude));return l!==0?l:le(Se(r.longitude),Se(o.longitude))}(n.geoPointValue,e.geoPointValue);case 9:return wd(n.arrayValue,e.arrayValue);case 10:return function(r,o){var l,c,h,d;const m=r.fields||{},p=o.fields||{},E=(l=m.value)===null||l===void 0?void 0:l.arrayValue,b=(c=p.value)===null||c===void 0?void 0:c.arrayValue,A=le(((h=E==null?void 0:E.values)===null||h===void 0?void 0:h.length)||0,((d=b==null?void 0:b.values)===null||d===void 0?void 0:d.length)||0);return A!==0?A:wd(E,b)}(n.mapValue,e.mapValue);case 11:return function(r,o){if(r===oo.mapValue&&o===oo.mapValue)return 0;if(r===oo.mapValue)return 1;if(o===oo.mapValue)return-1;const l=r.fields||{},c=Object.keys(l),h=o.fields||{},d=Object.keys(h);c.sort(),d.sort();for(let m=0;m<c.length&&m<d.length;++m){const p=le(c[m],d[m]);if(p!==0)return p;const E=Ws(l[c[m]],h[d[m]]);if(E!==0)return E}return le(c.length,d.length)}(n.mapValue,e.mapValue);default:throw q()}}function Ed(n,e){if(typeof n=="string"&&typeof e=="string"&&n.length===e.length)return le(n,e);const t=kn(n),s=kn(e),i=le(t.seconds,s.seconds);return i!==0?i:le(t.nanos,s.nanos)}function wd(n,e){const t=n.values||[],s=e.values||[];for(let i=0;i<t.length&&i<s.length;++i){const r=Ws(t[i],s[i]);if(r)return r}return le(t.length,s.length)}function qs(n){return jl(n)}function jl(n){return"nullValue"in n?"null":"booleanValue"in n?""+n.booleanValue:"integerValue"in n?""+n.integerValue:"doubleValue"in n?""+n.doubleValue:"timestampValue"in n?function(t){const s=kn(t);return`time(${s.seconds},${s.nanos})`}(n.timestampValue):"stringValue"in n?n.stringValue:"bytesValue"in n?function(t){return rs(t).toBase64()}(n.bytesValue):"referenceValue"in n?function(t){return j.fromName(t).toString()}(n.referenceValue):"geoPointValue"in n?function(t){return`geo(${t.latitude},${t.longitude})`}(n.geoPointValue):"arrayValue"in n?function(t){let s="[",i=!0;for(const r of t.values||[])i?i=!1:s+=",",s+=jl(r);return s+"]"}(n.arrayValue):"mapValue"in n?function(t){const s=Object.keys(t.fields||{}).sort();let i="{",r=!0;for(const o of s)r?r=!1:i+=",",i+=`${o}:${jl(t.fields[o])}`;return i+"}"}(n.mapValue):q()}function Td(n,e){return{referenceValue:`projects/${n.projectId}/databases/${n.database}/documents/${e.path.canonicalString()}`}}function Wl(n){return!!n&&"integerValue"in n}function Dc(n){return!!n&&"arrayValue"in n}function Id(n){return!!n&&"nullValue"in n}function bd(n){return!!n&&"doubleValue"in n&&isNaN(Number(n.doubleValue))}function _o(n){return!!n&&"mapValue"in n}function fT(n){var e,t;return((t=(((e=n==null?void 0:n.mapValue)===null||e===void 0?void 0:e.fields)||{}).__type__)===null||t===void 0?void 0:t.stringValue)==="__vector__"}function Bi(n){if(n.geoPointValue)return{geoPointValue:Object.assign({},n.geoPointValue)};if(n.timestampValue&&typeof n.timestampValue=="object")return{timestampValue:Object.assign({},n.timestampValue)};if(n.mapValue){const e={mapValue:{fields:{}}};return ds(n.mapValue.fields,(t,s)=>e.mapValue.fields[t]=Bi(s)),e}if(n.arrayValue){const e={arrayValue:{values:[]}};for(let t=0;t<(n.arrayValue.values||[]).length;++t)e.arrayValue.values[t]=Bi(n.arrayValue.values[t]);return e}return Object.assign({},n)}function mT(n){return(((n.mapValue||{}).fields||{}).__type__||{}).stringValue==="__max__"}/**
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
 */class ht{constructor(e){this.value=e}static empty(){return new ht({mapValue:{}})}field(e){if(e.isEmpty())return this.value;{let t=this.value;for(let s=0;s<e.length-1;++s)if(t=(t.mapValue.fields||{})[e.get(s)],!_o(t))return null;return t=(t.mapValue.fields||{})[e.lastSegment()],t||null}}set(e,t){this.getFieldsMap(e.popLast())[e.lastSegment()]=Bi(t)}setAll(e){let t=Ke.emptyPath(),s={},i=[];e.forEach((o,l)=>{if(!t.isImmediateParentOf(l)){const c=this.getFieldsMap(t);this.applyChanges(c,s,i),s={},i=[],t=l.popLast()}o?s[l.lastSegment()]=Bi(o):i.push(l.lastSegment())});const r=this.getFieldsMap(t);this.applyChanges(r,s,i)}delete(e){const t=this.field(e.popLast());_o(t)&&t.mapValue.fields&&delete t.mapValue.fields[e.lastSegment()]}isEqual(e){return Bt(this.value,e.value)}getFieldsMap(e){let t=this.value;t.mapValue.fields||(t.mapValue={fields:{}});for(let s=0;s<e.length;++s){let i=t.mapValue.fields[e.get(s)];_o(i)&&i.mapValue.fields||(i={mapValue:{fields:{}}},t.mapValue.fields[e.get(s)]=i),t=i}return t.mapValue.fields}applyChanges(e,t,s){ds(t,(i,r)=>e[i]=r);for(const i of s)delete e[i]}clone(){return new ht(Bi(this.value))}}function Jm(n){const e=[];return ds(n.fields,(t,s)=>{const i=new Ke([t]);if(_o(s)){const r=Jm(s.mapValue).fields;if(r.length===0)e.push(i);else for(const o of r)e.push(i.child(o))}else e.push(i)}),new vt(e)}/**
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
 */class Ue{constructor(e,t,s,i,r,o,l){this.key=e,this.documentType=t,this.version=s,this.readTime=i,this.createTime=r,this.data=o,this.documentState=l}static newInvalidDocument(e){return new Ue(e,0,z.min(),z.min(),z.min(),ht.empty(),0)}static newFoundDocument(e,t,s,i){return new Ue(e,1,t,z.min(),s,i,0)}static newNoDocument(e,t){return new Ue(e,2,t,z.min(),z.min(),ht.empty(),0)}static newUnknownDocument(e,t){return new Ue(e,3,t,z.min(),z.min(),ht.empty(),2)}convertToFoundDocument(e,t){return!this.createTime.isEqual(z.min())||this.documentType!==2&&this.documentType!==0||(this.createTime=e),this.version=e,this.documentType=1,this.data=t,this.documentState=0,this}convertToNoDocument(e){return this.version=e,this.documentType=2,this.data=ht.empty(),this.documentState=0,this}convertToUnknownDocument(e){return this.version=e,this.documentType=3,this.data=ht.empty(),this.documentState=2,this}setHasCommittedMutations(){return this.documentState=2,this}setHasLocalMutations(){return this.documentState=1,this.version=z.min(),this}setReadTime(e){return this.readTime=e,this}get hasLocalMutations(){return this.documentState===1}get hasCommittedMutations(){return this.documentState===2}get hasPendingWrites(){return this.hasLocalMutations||this.hasCommittedMutations}isValidDocument(){return this.documentType!==0}isFoundDocument(){return this.documentType===1}isNoDocument(){return this.documentType===2}isUnknownDocument(){return this.documentType===3}isEqual(e){return e instanceof Ue&&this.key.isEqual(e.key)&&this.version.isEqual(e.version)&&this.documentType===e.documentType&&this.documentState===e.documentState&&this.data.isEqual(e.data)}mutableCopy(){return new Ue(this.key,this.documentType,this.version,this.readTime,this.createTime,this.data.clone(),this.documentState)}toString(){return`Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`}}/**
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
 */class Lo{constructor(e,t){this.position=e,this.inclusive=t}}function Cd(n,e,t){let s=0;for(let i=0;i<n.position.length;i++){const r=e[i],o=n.position[i];if(r.field.isKeyField()?s=j.comparator(j.fromName(o.referenceValue),t.key):s=Ws(o,t.data.field(r.field)),r.dir==="desc"&&(s*=-1),s!==0)break}return s}function Rd(n,e){if(n===null)return e===null;if(e===null||n.inclusive!==e.inclusive||n.position.length!==e.position.length)return!1;for(let t=0;t<n.position.length;t++)if(!Bt(n.position[t],e.position[t]))return!1;return!0}/**
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
 */class Oo{constructor(e,t="asc"){this.field=e,this.dir=t}}function pT(n,e){return n.dir===e.dir&&n.field.isEqual(e.field)}/**
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
 */class Zm{}class ke extends Zm{constructor(e,t,s){super(),this.field=e,this.op=t,this.value=s}static create(e,t,s){return e.isKeyField()?t==="in"||t==="not-in"?this.createKeyFieldInFilter(e,t,s):new _T(e,t,s):t==="array-contains"?new ET(e,s):t==="in"?new wT(e,s):t==="not-in"?new TT(e,s):t==="array-contains-any"?new IT(e,s):new ke(e,t,s)}static createKeyFieldInFilter(e,t,s){return t==="in"?new yT(e,s):new vT(e,s)}matches(e){const t=e.data.field(this.field);return this.op==="!="?t!==null&&this.matchesComparison(Ws(t,this.value)):t!==null&&os(this.value)===os(t)&&this.matchesComparison(Ws(t,this.value))}matchesComparison(e){switch(this.op){case"<":return e<0;case"<=":return e<=0;case"==":return e===0;case"!=":return e!==0;case">":return e>0;case">=":return e>=0;default:return q()}}isInequality(){return["<","<=",">",">=","!=","not-in"].indexOf(this.op)>=0}getFlattenedFilters(){return[this]}getFilters(){return[this]}}class Nt extends Zm{constructor(e,t){super(),this.filters=e,this.op=t,this.ae=null}static create(e,t){return new Nt(e,t)}matches(e){return ep(this)?this.filters.find(t=>!t.matches(e))===void 0:this.filters.find(t=>t.matches(e))!==void 0}getFlattenedFilters(){return this.ae!==null||(this.ae=this.filters.reduce((e,t)=>e.concat(t.getFlattenedFilters()),[])),this.ae}getFilters(){return Object.assign([],this.filters)}}function ep(n){return n.op==="and"}function tp(n){return gT(n)&&ep(n)}function gT(n){for(const e of n.filters)if(e instanceof Nt)return!1;return!0}function ql(n){if(n instanceof ke)return n.field.canonicalString()+n.op.toString()+qs(n.value);if(tp(n))return n.filters.map(e=>ql(e)).join(",");{const e=n.filters.map(t=>ql(t)).join(",");return`${n.op}(${e})`}}function np(n,e){return n instanceof ke?function(s,i){return i instanceof ke&&s.op===i.op&&s.field.isEqual(i.field)&&Bt(s.value,i.value)}(n,e):n instanceof Nt?function(s,i){return i instanceof Nt&&s.op===i.op&&s.filters.length===i.filters.length?s.filters.reduce((r,o,l)=>r&&np(o,i.filters[l]),!0):!1}(n,e):void q()}function sp(n){return n instanceof ke?function(t){return`${t.field.canonicalString()} ${t.op} ${qs(t.value)}`}(n):n instanceof Nt?function(t){return t.op.toString()+" {"+t.getFilters().map(sp).join(" ,")+"}"}(n):"Filter"}class _T extends ke{constructor(e,t,s){super(e,t,s),this.key=j.fromName(s.referenceValue)}matches(e){const t=j.comparator(e.key,this.key);return this.matchesComparison(t)}}class yT extends ke{constructor(e,t){super(e,"in",t),this.keys=ip("in",t)}matches(e){return this.keys.some(t=>t.isEqual(e.key))}}class vT extends ke{constructor(e,t){super(e,"not-in",t),this.keys=ip("not-in",t)}matches(e){return!this.keys.some(t=>t.isEqual(e.key))}}function ip(n,e){var t;return(((t=e.arrayValue)===null||t===void 0?void 0:t.values)||[]).map(s=>j.fromName(s.referenceValue))}class ET extends ke{constructor(e,t){super(e,"array-contains",t)}matches(e){const t=e.data.field(this.field);return Dc(t)&&ir(t.arrayValue,this.value)}}class wT extends ke{constructor(e,t){super(e,"in",t)}matches(e){const t=e.data.field(this.field);return t!==null&&ir(this.value.arrayValue,t)}}class TT extends ke{constructor(e,t){super(e,"not-in",t)}matches(e){if(ir(this.value.arrayValue,{nullValue:"NULL_VALUE"}))return!1;const t=e.data.field(this.field);return t!==null&&!ir(this.value.arrayValue,t)}}class IT extends ke{constructor(e,t){super(e,"array-contains-any",t)}matches(e){const t=e.data.field(this.field);return!(!Dc(t)||!t.arrayValue.values)&&t.arrayValue.values.some(s=>ir(this.value.arrayValue,s))}}/**
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
 */class bT{constructor(e,t=null,s=[],i=[],r=null,o=null,l=null){this.path=e,this.collectionGroup=t,this.orderBy=s,this.filters=i,this.limit=r,this.startAt=o,this.endAt=l,this.ue=null}}function Sd(n,e=null,t=[],s=[],i=null,r=null,o=null){return new bT(n,e,t,s,i,r,o)}function xc(n){const e=Q(n);if(e.ue===null){let t=e.path.canonicalString();e.collectionGroup!==null&&(t+="|cg:"+e.collectionGroup),t+="|f:",t+=e.filters.map(s=>ql(s)).join(","),t+="|ob:",t+=e.orderBy.map(s=>function(r){return r.field.canonicalString()+r.dir}(s)).join(","),wr(e.limit)||(t+="|l:",t+=e.limit),e.startAt&&(t+="|lb:",t+=e.startAt.inclusive?"b:":"a:",t+=e.startAt.position.map(s=>qs(s)).join(",")),e.endAt&&(t+="|ub:",t+=e.endAt.inclusive?"a:":"b:",t+=e.endAt.position.map(s=>qs(s)).join(",")),e.ue=t}return e.ue}function Mc(n,e){if(n.limit!==e.limit||n.orderBy.length!==e.orderBy.length)return!1;for(let t=0;t<n.orderBy.length;t++)if(!pT(n.orderBy[t],e.orderBy[t]))return!1;if(n.filters.length!==e.filters.length)return!1;for(let t=0;t<n.filters.length;t++)if(!np(n.filters[t],e.filters[t]))return!1;return n.collectionGroup===e.collectionGroup&&!!n.path.isEqual(e.path)&&!!Rd(n.startAt,e.startAt)&&Rd(n.endAt,e.endAt)}function $l(n){return j.isDocumentKey(n.path)&&n.collectionGroup===null&&n.filters.length===0}/**
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
 */class Tr{constructor(e,t=null,s=[],i=[],r=null,o="F",l=null,c=null){this.path=e,this.collectionGroup=t,this.explicitOrderBy=s,this.filters=i,this.limit=r,this.limitType=o,this.startAt=l,this.endAt=c,this.ce=null,this.le=null,this.he=null,this.startAt,this.endAt}}function CT(n,e,t,s,i,r,o,l){return new Tr(n,e,t,s,i,r,o,l)}function Lc(n){return new Tr(n)}function Ad(n){return n.filters.length===0&&n.limit===null&&n.startAt==null&&n.endAt==null&&(n.explicitOrderBy.length===0||n.explicitOrderBy.length===1&&n.explicitOrderBy[0].field.isKeyField())}function rp(n){return n.collectionGroup!==null}function Ui(n){const e=Q(n);if(e.ce===null){e.ce=[];const t=new Set;for(const r of e.explicitOrderBy)e.ce.push(r),t.add(r.field.canonicalString());const s=e.explicitOrderBy.length>0?e.explicitOrderBy[e.explicitOrderBy.length-1].dir:"asc";(function(o){let l=new Qe(Ke.comparator);return o.filters.forEach(c=>{c.getFlattenedFilters().forEach(h=>{h.isInequality()&&(l=l.add(h.field))})}),l})(e).forEach(r=>{t.has(r.canonicalString())||r.isKeyField()||e.ce.push(new Oo(r,s))}),t.has(Ke.keyField().canonicalString())||e.ce.push(new Oo(Ke.keyField(),s))}return e.ce}function Vt(n){const e=Q(n);return e.le||(e.le=RT(e,Ui(n))),e.le}function RT(n,e){if(n.limitType==="F")return Sd(n.path,n.collectionGroup,e,n.filters,n.limit,n.startAt,n.endAt);{e=e.map(i=>{const r=i.dir==="desc"?"asc":"desc";return new Oo(i.field,r)});const t=n.endAt?new Lo(n.endAt.position,n.endAt.inclusive):null,s=n.startAt?new Lo(n.startAt.position,n.startAt.inclusive):null;return Sd(n.path,n.collectionGroup,e,n.filters,n.limit,t,s)}}function zl(n,e){const t=n.filters.concat([e]);return new Tr(n.path,n.collectionGroup,n.explicitOrderBy.slice(),t,n.limit,n.limitType,n.startAt,n.endAt)}function Vo(n,e,t){return new Tr(n.path,n.collectionGroup,n.explicitOrderBy.slice(),n.filters.slice(),e,t,n.startAt,n.endAt)}function ya(n,e){return Mc(Vt(n),Vt(e))&&n.limitType===e.limitType}function op(n){return`${xc(Vt(n))}|lt:${n.limitType}`}function Cs(n){return`Query(target=${function(t){let s=t.path.canonicalString();return t.collectionGroup!==null&&(s+=" collectionGroup="+t.collectionGroup),t.filters.length>0&&(s+=`, filters: [${t.filters.map(i=>sp(i)).join(", ")}]`),wr(t.limit)||(s+=", limit: "+t.limit),t.orderBy.length>0&&(s+=`, orderBy: [${t.orderBy.map(i=>function(o){return`${o.field.canonicalString()} (${o.dir})`}(i)).join(", ")}]`),t.startAt&&(s+=", startAt: ",s+=t.startAt.inclusive?"b:":"a:",s+=t.startAt.position.map(i=>qs(i)).join(",")),t.endAt&&(s+=", endAt: ",s+=t.endAt.inclusive?"a:":"b:",s+=t.endAt.position.map(i=>qs(i)).join(",")),`Target(${s})`}(Vt(n))}; limitType=${n.limitType})`}function va(n,e){return e.isFoundDocument()&&function(s,i){const r=i.key.path;return s.collectionGroup!==null?i.key.hasCollectionId(s.collectionGroup)&&s.path.isPrefixOf(r):j.isDocumentKey(s.path)?s.path.isEqual(r):s.path.isImmediateParentOf(r)}(n,e)&&function(s,i){for(const r of Ui(s))if(!r.field.isKeyField()&&i.data.field(r.field)===null)return!1;return!0}(n,e)&&function(s,i){for(const r of s.filters)if(!r.matches(i))return!1;return!0}(n,e)&&function(s,i){return!(s.startAt&&!function(o,l,c){const h=Cd(o,l,c);return o.inclusive?h<=0:h<0}(s.startAt,Ui(s),i)||s.endAt&&!function(o,l,c){const h=Cd(o,l,c);return o.inclusive?h>=0:h>0}(s.endAt,Ui(s),i))}(n,e)}function ST(n){return n.collectionGroup||(n.path.length%2==1?n.path.lastSegment():n.path.get(n.path.length-2))}function ap(n){return(e,t)=>{let s=!1;for(const i of Ui(n)){const r=AT(i,e,t);if(r!==0)return r;s=s||i.field.isKeyField()}return 0}}function AT(n,e,t){const s=n.field.isKeyField()?j.comparator(e.key,t.key):function(r,o,l){const c=o.data.field(r),h=l.data.field(r);return c!==null&&h!==null?Ws(c,h):q()}(n.field,e,t);switch(n.dir){case"asc":return s;case"desc":return-1*s;default:return q()}}/**
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
 */class si{constructor(e,t){this.mapKeyFn=e,this.equalsFn=t,this.inner={},this.innerSize=0}get(e){const t=this.mapKeyFn(e),s=this.inner[t];if(s!==void 0){for(const[i,r]of s)if(this.equalsFn(i,e))return r}}has(e){return this.get(e)!==void 0}set(e,t){const s=this.mapKeyFn(e),i=this.inner[s];if(i===void 0)return this.inner[s]=[[e,t]],void this.innerSize++;for(let r=0;r<i.length;r++)if(this.equalsFn(i[r][0],e))return void(i[r]=[e,t]);i.push([e,t]),this.innerSize++}delete(e){const t=this.mapKeyFn(e),s=this.inner[t];if(s===void 0)return!1;for(let i=0;i<s.length;i++)if(this.equalsFn(s[i][0],e))return s.length===1?delete this.inner[t]:s.splice(i,1),this.innerSize--,!0;return!1}forEach(e){ds(this.inner,(t,s)=>{for(const[i,r]of s)e(i,r)})}isEmpty(){return Ym(this.inner)}size(){return this.innerSize}}/**
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
 */const kT=new Pe(j.comparator);function on(){return kT}const lp=new Pe(j.comparator);function Oi(...n){let e=lp;for(const t of n)e=e.insert(t.key,t);return e}function cp(n){let e=lp;return n.forEach((t,s)=>e=e.insert(t,s.overlayedDocument)),e}function Yn(){return ji()}function hp(){return ji()}function ji(){return new si(n=>n.toString(),(n,e)=>n.isEqual(e))}const PT=new Pe(j.comparator),NT=new Qe(j.comparator);function ne(...n){let e=NT;for(const t of n)e=e.add(t);return e}const DT=new Qe(le);function xT(){return DT}/**
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
 */function Oc(n,e){if(n.useProto3Json){if(isNaN(e))return{doubleValue:"NaN"};if(e===1/0)return{doubleValue:"Infinity"};if(e===-1/0)return{doubleValue:"-Infinity"}}return{doubleValue:Mo(e)?"-0":e}}function up(n){return{integerValue:""+n}}function MT(n,e){return hT(e)?up(e):Oc(n,e)}/**
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
 */class Ea{constructor(){this._=void 0}}function LT(n,e,t){return n instanceof Fo?function(i,r){const o={fields:{__type__:{stringValue:"server_timestamp"},__local_write_time__:{timestampValue:{seconds:i.seconds,nanos:i.nanoseconds}}}};return r&&Pc(r)&&(r=Nc(r)),r&&(o.fields.__previous_value__=r),{mapValue:o}}(t,e):n instanceof rr?fp(n,e):n instanceof or?mp(n,e):function(i,r){const o=dp(i,r),l=kd(o)+kd(i.Pe);return Wl(o)&&Wl(i.Pe)?up(l):Oc(i.serializer,l)}(n,e)}function OT(n,e,t){return n instanceof rr?fp(n,e):n instanceof or?mp(n,e):t}function dp(n,e){return n instanceof Bo?function(s){return Wl(s)||function(r){return!!r&&"doubleValue"in r}(s)}(e)?e:{integerValue:0}:null}class Fo extends Ea{}class rr extends Ea{constructor(e){super(),this.elements=e}}function fp(n,e){const t=pp(e);for(const s of n.elements)t.some(i=>Bt(i,s))||t.push(s);return{arrayValue:{values:t}}}class or extends Ea{constructor(e){super(),this.elements=e}}function mp(n,e){let t=pp(e);for(const s of n.elements)t=t.filter(i=>!Bt(i,s));return{arrayValue:{values:t}}}class Bo extends Ea{constructor(e,t){super(),this.serializer=e,this.Pe=t}}function kd(n){return Se(n.integerValue||n.doubleValue)}function pp(n){return Dc(n)&&n.arrayValue.values?n.arrayValue.values.slice():[]}function VT(n,e){return n.field.isEqual(e.field)&&function(s,i){return s instanceof rr&&i instanceof rr||s instanceof or&&i instanceof or?js(s.elements,i.elements,Bt):s instanceof Bo&&i instanceof Bo?Bt(s.Pe,i.Pe):s instanceof Fo&&i instanceof Fo}(n.transform,e.transform)}class FT{constructor(e,t){this.version=e,this.transformResults=t}}class ut{constructor(e,t){this.updateTime=e,this.exists=t}static none(){return new ut}static exists(e){return new ut(void 0,e)}static updateTime(e){return new ut(e)}get isNone(){return this.updateTime===void 0&&this.exists===void 0}isEqual(e){return this.exists===e.exists&&(this.updateTime?!!e.updateTime&&this.updateTime.isEqual(e.updateTime):!e.updateTime)}}function yo(n,e){return n.updateTime!==void 0?e.isFoundDocument()&&e.version.isEqual(n.updateTime):n.exists===void 0||n.exists===e.isFoundDocument()}class wa{}function gp(n,e){if(!n.hasLocalMutations||e&&e.fields.length===0)return null;if(e===null)return n.isNoDocument()?new Vc(n.key,ut.none()):new Ir(n.key,n.data,ut.none());{const t=n.data,s=ht.empty();let i=new Qe(Ke.comparator);for(let r of e.fields)if(!i.has(r)){let o=t.field(r);o===null&&r.length>1&&(r=r.popLast(),o=t.field(r)),o===null?s.delete(r):s.set(r,o),i=i.add(r)}return new On(n.key,s,new vt(i.toArray()),ut.none())}}function BT(n,e,t){n instanceof Ir?function(i,r,o){const l=i.value.clone(),c=Nd(i.fieldTransforms,r,o.transformResults);l.setAll(c),r.convertToFoundDocument(o.version,l).setHasCommittedMutations()}(n,e,t):n instanceof On?function(i,r,o){if(!yo(i.precondition,r))return void r.convertToUnknownDocument(o.version);const l=Nd(i.fieldTransforms,r,o.transformResults),c=r.data;c.setAll(_p(i)),c.setAll(l),r.convertToFoundDocument(o.version,c).setHasCommittedMutations()}(n,e,t):function(i,r,o){r.convertToNoDocument(o.version).setHasCommittedMutations()}(0,e,t)}function Wi(n,e,t,s){return n instanceof Ir?function(r,o,l,c){if(!yo(r.precondition,o))return l;const h=r.value.clone(),d=Dd(r.fieldTransforms,c,o);return h.setAll(d),o.convertToFoundDocument(o.version,h).setHasLocalMutations(),null}(n,e,t,s):n instanceof On?function(r,o,l,c){if(!yo(r.precondition,o))return l;const h=Dd(r.fieldTransforms,c,o),d=o.data;return d.setAll(_p(r)),d.setAll(h),o.convertToFoundDocument(o.version,d).setHasLocalMutations(),l===null?null:l.unionWith(r.fieldMask.fields).unionWith(r.fieldTransforms.map(m=>m.field))}(n,e,t,s):function(r,o,l){return yo(r.precondition,o)?(o.convertToNoDocument(o.version).setHasLocalMutations(),null):l}(n,e,t)}function UT(n,e){let t=null;for(const s of n.fieldTransforms){const i=e.data.field(s.field),r=dp(s.transform,i||null);r!=null&&(t===null&&(t=ht.empty()),t.set(s.field,r))}return t||null}function Pd(n,e){return n.type===e.type&&!!n.key.isEqual(e.key)&&!!n.precondition.isEqual(e.precondition)&&!!function(s,i){return s===void 0&&i===void 0||!(!s||!i)&&js(s,i,(r,o)=>VT(r,o))}(n.fieldTransforms,e.fieldTransforms)&&(n.type===0?n.value.isEqual(e.value):n.type!==1||n.data.isEqual(e.data)&&n.fieldMask.isEqual(e.fieldMask))}class Ir extends wa{constructor(e,t,s,i=[]){super(),this.key=e,this.value=t,this.precondition=s,this.fieldTransforms=i,this.type=0}getFieldMask(){return null}}class On extends wa{constructor(e,t,s,i,r=[]){super(),this.key=e,this.data=t,this.fieldMask=s,this.precondition=i,this.fieldTransforms=r,this.type=1}getFieldMask(){return this.fieldMask}}function _p(n){const e=new Map;return n.fieldMask.fields.forEach(t=>{if(!t.isEmpty()){const s=n.data.field(t);e.set(t,s)}}),e}function Nd(n,e,t){const s=new Map;re(n.length===t.length);for(let i=0;i<t.length;i++){const r=n[i],o=r.transform,l=e.data.field(r.field);s.set(r.field,OT(o,l,t[i]))}return s}function Dd(n,e,t){const s=new Map;for(const i of n){const r=i.transform,o=t.data.field(i.field);s.set(i.field,LT(r,o,e))}return s}class Vc extends wa{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=2,this.fieldTransforms=[]}getFieldMask(){return null}}class yp extends wa{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=3,this.fieldTransforms=[]}getFieldMask(){return null}}/**
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
 */class jT{constructor(e,t,s,i){this.batchId=e,this.localWriteTime=t,this.baseMutations=s,this.mutations=i}applyToRemoteDocument(e,t){const s=t.mutationResults;for(let i=0;i<this.mutations.length;i++){const r=this.mutations[i];r.key.isEqual(e.key)&&BT(r,e,s[i])}}applyToLocalView(e,t){for(const s of this.baseMutations)s.key.isEqual(e.key)&&(t=Wi(s,e,t,this.localWriteTime));for(const s of this.mutations)s.key.isEqual(e.key)&&(t=Wi(s,e,t,this.localWriteTime));return t}applyToLocalDocumentSet(e,t){const s=hp();return this.mutations.forEach(i=>{const r=e.get(i.key),o=r.overlayedDocument;let l=this.applyToLocalView(o,r.mutatedFields);l=t.has(i.key)?null:l;const c=gp(o,l);c!==null&&s.set(i.key,c),o.isValidDocument()||o.convertToNoDocument(z.min())}),s}keys(){return this.mutations.reduce((e,t)=>e.add(t.key),ne())}isEqual(e){return this.batchId===e.batchId&&js(this.mutations,e.mutations,(t,s)=>Pd(t,s))&&js(this.baseMutations,e.baseMutations,(t,s)=>Pd(t,s))}}class Fc{constructor(e,t,s,i){this.batch=e,this.commitVersion=t,this.mutationResults=s,this.docVersions=i}static from(e,t,s){re(e.mutations.length===s.length);let i=function(){return PT}();const r=e.mutations;for(let o=0;o<r.length;o++)i=i.insert(r[o].key,s[o].version);return new Fc(e,t,s,i)}}/**
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
 */class WT{constructor(e,t){this.largestBatchId=e,this.mutation=t}getKey(){return this.mutation.key}isEqual(e){return e!==null&&this.mutation===e.mutation}toString(){return`Overlay{
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
 */class qT{constructor(e,t){this.count=e,this.unchangedNames=t}}/**
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
 */var Ae,se;function vp(n){switch(n){default:return q();case k.CANCELLED:case k.UNKNOWN:case k.DEADLINE_EXCEEDED:case k.RESOURCE_EXHAUSTED:case k.INTERNAL:case k.UNAVAILABLE:case k.UNAUTHENTICATED:return!1;case k.INVALID_ARGUMENT:case k.NOT_FOUND:case k.ALREADY_EXISTS:case k.PERMISSION_DENIED:case k.FAILED_PRECONDITION:case k.ABORTED:case k.OUT_OF_RANGE:case k.UNIMPLEMENTED:case k.DATA_LOSS:return!0}}function Ep(n){if(n===void 0)return rn("GRPC error has no .code"),k.UNKNOWN;switch(n){case Ae.OK:return k.OK;case Ae.CANCELLED:return k.CANCELLED;case Ae.UNKNOWN:return k.UNKNOWN;case Ae.DEADLINE_EXCEEDED:return k.DEADLINE_EXCEEDED;case Ae.RESOURCE_EXHAUSTED:return k.RESOURCE_EXHAUSTED;case Ae.INTERNAL:return k.INTERNAL;case Ae.UNAVAILABLE:return k.UNAVAILABLE;case Ae.UNAUTHENTICATED:return k.UNAUTHENTICATED;case Ae.INVALID_ARGUMENT:return k.INVALID_ARGUMENT;case Ae.NOT_FOUND:return k.NOT_FOUND;case Ae.ALREADY_EXISTS:return k.ALREADY_EXISTS;case Ae.PERMISSION_DENIED:return k.PERMISSION_DENIED;case Ae.FAILED_PRECONDITION:return k.FAILED_PRECONDITION;case Ae.ABORTED:return k.ABORTED;case Ae.OUT_OF_RANGE:return k.OUT_OF_RANGE;case Ae.UNIMPLEMENTED:return k.UNIMPLEMENTED;case Ae.DATA_LOSS:return k.DATA_LOSS;default:return q()}}(se=Ae||(Ae={}))[se.OK=0]="OK",se[se.CANCELLED=1]="CANCELLED",se[se.UNKNOWN=2]="UNKNOWN",se[se.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",se[se.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",se[se.NOT_FOUND=5]="NOT_FOUND",se[se.ALREADY_EXISTS=6]="ALREADY_EXISTS",se[se.PERMISSION_DENIED=7]="PERMISSION_DENIED",se[se.UNAUTHENTICATED=16]="UNAUTHENTICATED",se[se.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",se[se.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",se[se.ABORTED=10]="ABORTED",se[se.OUT_OF_RANGE=11]="OUT_OF_RANGE",se[se.UNIMPLEMENTED=12]="UNIMPLEMENTED",se[se.INTERNAL=13]="INTERNAL",se[se.UNAVAILABLE=14]="UNAVAILABLE",se[se.DATA_LOSS=15]="DATA_LOSS";/**
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
 */function $T(){return new TextEncoder}/**
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
 */const zT=new es([4294967295,4294967295],0);function xd(n){const e=$T().encode(n),t=new Wm;return t.update(e),new Uint8Array(t.digest())}function Md(n){const e=new DataView(n.buffer),t=e.getUint32(0,!0),s=e.getUint32(4,!0),i=e.getUint32(8,!0),r=e.getUint32(12,!0);return[new es([t,s],0),new es([i,r],0)]}class Bc{constructor(e,t,s){if(this.bitmap=e,this.padding=t,this.hashCount=s,t<0||t>=8)throw new Vi(`Invalid padding: ${t}`);if(s<0)throw new Vi(`Invalid hash count: ${s}`);if(e.length>0&&this.hashCount===0)throw new Vi(`Invalid hash count: ${s}`);if(e.length===0&&t!==0)throw new Vi(`Invalid padding when bitmap length is 0: ${t}`);this.Ie=8*e.length-t,this.Te=es.fromNumber(this.Ie)}Ee(e,t,s){let i=e.add(t.multiply(es.fromNumber(s)));return i.compare(zT)===1&&(i=new es([i.getBits(0),i.getBits(1)],0)),i.modulo(this.Te).toNumber()}de(e){return(this.bitmap[Math.floor(e/8)]&1<<e%8)!=0}mightContain(e){if(this.Ie===0)return!1;const t=xd(e),[s,i]=Md(t);for(let r=0;r<this.hashCount;r++){const o=this.Ee(s,i,r);if(!this.de(o))return!1}return!0}static create(e,t,s){const i=e%8==0?0:8-e%8,r=new Uint8Array(Math.ceil(e/8)),o=new Bc(r,i,t);return s.forEach(l=>o.insert(l)),o}insert(e){if(this.Ie===0)return;const t=xd(e),[s,i]=Md(t);for(let r=0;r<this.hashCount;r++){const o=this.Ee(s,i,r);this.Ae(o)}}Ae(e){const t=Math.floor(e/8),s=e%8;this.bitmap[t]|=1<<s}}class Vi extends Error{constructor(){super(...arguments),this.name="BloomFilterError"}}/**
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
 */class Ta{constructor(e,t,s,i,r){this.snapshotVersion=e,this.targetChanges=t,this.targetMismatches=s,this.documentUpdates=i,this.resolvedLimboDocuments=r}static createSynthesizedRemoteEventForCurrentChange(e,t,s){const i=new Map;return i.set(e,br.createSynthesizedTargetChangeForCurrentChange(e,t,s)),new Ta(z.min(),i,new Pe(le),on(),ne())}}class br{constructor(e,t,s,i,r){this.resumeToken=e,this.current=t,this.addedDocuments=s,this.modifiedDocuments=i,this.removedDocuments=r}static createSynthesizedTargetChangeForCurrentChange(e,t,s){return new br(s,t,ne(),ne(),ne())}}/**
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
 */class vo{constructor(e,t,s,i){this.Re=e,this.removedTargetIds=t,this.key=s,this.Ve=i}}class wp{constructor(e,t){this.targetId=e,this.me=t}}class Tp{constructor(e,t,s=Ye.EMPTY_BYTE_STRING,i=null){this.state=e,this.targetIds=t,this.resumeToken=s,this.cause=i}}class Ld{constructor(){this.fe=0,this.ge=Vd(),this.pe=Ye.EMPTY_BYTE_STRING,this.ye=!1,this.we=!0}get current(){return this.ye}get resumeToken(){return this.pe}get Se(){return this.fe!==0}get be(){return this.we}De(e){e.approximateByteSize()>0&&(this.we=!0,this.pe=e)}ve(){let e=ne(),t=ne(),s=ne();return this.ge.forEach((i,r)=>{switch(r){case 0:e=e.add(i);break;case 2:t=t.add(i);break;case 1:s=s.add(i);break;default:q()}}),new br(this.pe,this.ye,e,t,s)}Ce(){this.we=!1,this.ge=Vd()}Fe(e,t){this.we=!0,this.ge=this.ge.insert(e,t)}Me(e){this.we=!0,this.ge=this.ge.remove(e)}xe(){this.fe+=1}Oe(){this.fe-=1,re(this.fe>=0)}Ne(){this.we=!0,this.ye=!0}}class HT{constructor(e){this.Le=e,this.Be=new Map,this.ke=on(),this.qe=Od(),this.Qe=new Pe(le)}Ke(e){for(const t of e.Re)e.Ve&&e.Ve.isFoundDocument()?this.$e(t,e.Ve):this.Ue(t,e.key,e.Ve);for(const t of e.removedTargetIds)this.Ue(t,e.key,e.Ve)}We(e){this.forEachTarget(e,t=>{const s=this.Ge(t);switch(e.state){case 0:this.ze(t)&&s.De(e.resumeToken);break;case 1:s.Oe(),s.Se||s.Ce(),s.De(e.resumeToken);break;case 2:s.Oe(),s.Se||this.removeTarget(t);break;case 3:this.ze(t)&&(s.Ne(),s.De(e.resumeToken));break;case 4:this.ze(t)&&(this.je(t),s.De(e.resumeToken));break;default:q()}})}forEachTarget(e,t){e.targetIds.length>0?e.targetIds.forEach(t):this.Be.forEach((s,i)=>{this.ze(i)&&t(i)})}He(e){const t=e.targetId,s=e.me.count,i=this.Je(t);if(i){const r=i.target;if($l(r))if(s===0){const o=new j(r.path);this.Ue(t,o,Ue.newNoDocument(o,z.min()))}else re(s===1);else{const o=this.Ye(t);if(o!==s){const l=this.Ze(e),c=l?this.Xe(l,e,o):1;if(c!==0){this.je(t);const h=c===2?"TargetPurposeExistenceFilterMismatchBloom":"TargetPurposeExistenceFilterMismatch";this.Qe=this.Qe.insert(t,h)}}}}}Ze(e){const t=e.me.unchangedNames;if(!t||!t.bits)return null;const{bits:{bitmap:s="",padding:i=0},hashCount:r=0}=t;let o,l;try{o=rs(s).toUint8Array()}catch(c){if(c instanceof Xm)return Us("Decoding the base64 bloom filter in existence filter failed ("+c.message+"); ignoring the bloom filter and falling back to full re-query."),null;throw c}try{l=new Bc(o,i,r)}catch(c){return Us(c instanceof Vi?"BloomFilter error: ":"Applying bloom filter failed: ",c),null}return l.Ie===0?null:l}Xe(e,t,s){return t.me.count===s-this.nt(e,t.targetId)?0:2}nt(e,t){const s=this.Le.getRemoteKeysForTarget(t);let i=0;return s.forEach(r=>{const o=this.Le.tt(),l=`projects/${o.projectId}/databases/${o.database}/documents/${r.path.canonicalString()}`;e.mightContain(l)||(this.Ue(t,r,null),i++)}),i}rt(e){const t=new Map;this.Be.forEach((r,o)=>{const l=this.Je(o);if(l){if(r.current&&$l(l.target)){const c=new j(l.target.path);this.ke.get(c)!==null||this.it(o,c)||this.Ue(o,c,Ue.newNoDocument(c,e))}r.be&&(t.set(o,r.ve()),r.Ce())}});let s=ne();this.qe.forEach((r,o)=>{let l=!0;o.forEachWhile(c=>{const h=this.Je(c);return!h||h.purpose==="TargetPurposeLimboResolution"||(l=!1,!1)}),l&&(s=s.add(r))}),this.ke.forEach((r,o)=>o.setReadTime(e));const i=new Ta(e,t,this.Qe,this.ke,s);return this.ke=on(),this.qe=Od(),this.Qe=new Pe(le),i}$e(e,t){if(!this.ze(e))return;const s=this.it(e,t.key)?2:0;this.Ge(e).Fe(t.key,s),this.ke=this.ke.insert(t.key,t),this.qe=this.qe.insert(t.key,this.st(t.key).add(e))}Ue(e,t,s){if(!this.ze(e))return;const i=this.Ge(e);this.it(e,t)?i.Fe(t,1):i.Me(t),this.qe=this.qe.insert(t,this.st(t).delete(e)),s&&(this.ke=this.ke.insert(t,s))}removeTarget(e){this.Be.delete(e)}Ye(e){const t=this.Ge(e).ve();return this.Le.getRemoteKeysForTarget(e).size+t.addedDocuments.size-t.removedDocuments.size}xe(e){this.Ge(e).xe()}Ge(e){let t=this.Be.get(e);return t||(t=new Ld,this.Be.set(e,t)),t}st(e){let t=this.qe.get(e);return t||(t=new Qe(le),this.qe=this.qe.insert(e,t)),t}ze(e){const t=this.Je(e)!==null;return t||B("WatchChangeAggregator","Detected inactive target",e),t}Je(e){const t=this.Be.get(e);return t&&t.Se?null:this.Le.ot(e)}je(e){this.Be.set(e,new Ld),this.Le.getRemoteKeysForTarget(e).forEach(t=>{this.Ue(e,t,null)})}it(e,t){return this.Le.getRemoteKeysForTarget(e).has(t)}}function Od(){return new Pe(j.comparator)}function Vd(){return new Pe(j.comparator)}const GT={asc:"ASCENDING",desc:"DESCENDING"},KT={"<":"LESS_THAN","<=":"LESS_THAN_OR_EQUAL",">":"GREATER_THAN",">=":"GREATER_THAN_OR_EQUAL","==":"EQUAL","!=":"NOT_EQUAL","array-contains":"ARRAY_CONTAINS",in:"IN","not-in":"NOT_IN","array-contains-any":"ARRAY_CONTAINS_ANY"},QT={and:"AND",or:"OR"};class YT{constructor(e,t){this.databaseId=e,this.useProto3Json=t}}function Hl(n,e){return n.useProto3Json||wr(e)?e:{value:e}}function Uo(n,e){return n.useProto3Json?`${new Date(1e3*e.seconds).toISOString().replace(/\.\d*/,"").replace("Z","")}.${("000000000"+e.nanoseconds).slice(-9)}Z`:{seconds:""+e.seconds,nanos:e.nanoseconds}}function Ip(n,e){return n.useProto3Json?e.toBase64():e.toUint8Array()}function XT(n,e){return Uo(n,e.toTimestamp())}function Et(n){return re(!!n),z.fromTimestamp(function(t){const s=kn(t);return new Me(s.seconds,s.nanos)}(n))}function Uc(n,e){return Gl(n,e).canonicalString()}function Gl(n,e){const t=function(i){return new ge(["projects",i.projectId,"databases",i.database])}(n).child("documents");return e===void 0?t:t.child(e)}function bp(n){const e=ge.fromString(n);return re(Pp(e)),e}function jo(n,e){return Uc(n.databaseId,e.path)}function qi(n,e){const t=bp(e);if(t.get(1)!==n.databaseId.projectId)throw new V(k.INVALID_ARGUMENT,"Tried to deserialize key from different project: "+t.get(1)+" vs "+n.databaseId.projectId);if(t.get(3)!==n.databaseId.database)throw new V(k.INVALID_ARGUMENT,"Tried to deserialize key from different database: "+t.get(3)+" vs "+n.databaseId.database);return new j(Rp(t))}function Cp(n,e){return Uc(n.databaseId,e)}function JT(n){const e=bp(n);return e.length===4?ge.emptyPath():Rp(e)}function Kl(n){return new ge(["projects",n.databaseId.projectId,"databases",n.databaseId.database]).canonicalString()}function Rp(n){return re(n.length>4&&n.get(4)==="documents"),n.popFirst(5)}function Fd(n,e,t){return{name:jo(n,e),fields:t.value.mapValue.fields}}function ZT(n,e){return"found"in e?function(s,i){re(!!i.found),i.found.name,i.found.updateTime;const r=qi(s,i.found.name),o=Et(i.found.updateTime),l=i.found.createTime?Et(i.found.createTime):z.min(),c=new ht({mapValue:{fields:i.found.fields}});return Ue.newFoundDocument(r,o,l,c)}(n,e):"missing"in e?function(s,i){re(!!i.missing),re(!!i.readTime);const r=qi(s,i.missing),o=Et(i.readTime);return Ue.newNoDocument(r,o)}(n,e):q()}function eI(n,e){let t;if("targetChange"in e){e.targetChange;const s=function(h){return h==="NO_CHANGE"?0:h==="ADD"?1:h==="REMOVE"?2:h==="CURRENT"?3:h==="RESET"?4:q()}(e.targetChange.targetChangeType||"NO_CHANGE"),i=e.targetChange.targetIds||[],r=function(h,d){return h.useProto3Json?(re(d===void 0||typeof d=="string"),Ye.fromBase64String(d||"")):(re(d===void 0||d instanceof Buffer||d instanceof Uint8Array),Ye.fromUint8Array(d||new Uint8Array))}(n,e.targetChange.resumeToken),o=e.targetChange.cause,l=o&&function(h){const d=h.code===void 0?k.UNKNOWN:Ep(h.code);return new V(d,h.message||"")}(o);t=new Tp(s,i,r,l||null)}else if("documentChange"in e){e.documentChange;const s=e.documentChange;s.document,s.document.name,s.document.updateTime;const i=qi(n,s.document.name),r=Et(s.document.updateTime),o=s.document.createTime?Et(s.document.createTime):z.min(),l=new ht({mapValue:{fields:s.document.fields}}),c=Ue.newFoundDocument(i,r,o,l),h=s.targetIds||[],d=s.removedTargetIds||[];t=new vo(h,d,c.key,c)}else if("documentDelete"in e){e.documentDelete;const s=e.documentDelete;s.document;const i=qi(n,s.document),r=s.readTime?Et(s.readTime):z.min(),o=Ue.newNoDocument(i,r),l=s.removedTargetIds||[];t=new vo([],l,o.key,o)}else if("documentRemove"in e){e.documentRemove;const s=e.documentRemove;s.document;const i=qi(n,s.document),r=s.removedTargetIds||[];t=new vo([],r,i,null)}else{if(!("filter"in e))return q();{e.filter;const s=e.filter;s.targetId;const{count:i=0,unchangedNames:r}=s,o=new qT(i,r),l=s.targetId;t=new wp(l,o)}}return t}function Sp(n,e){let t;if(e instanceof Ir)t={update:Fd(n,e.key,e.value)};else if(e instanceof Vc)t={delete:jo(n,e.key)};else if(e instanceof On)t={update:Fd(n,e.key,e.data),updateMask:cI(e.fieldMask)};else{if(!(e instanceof yp))return q();t={verify:jo(n,e.key)}}return e.fieldTransforms.length>0&&(t.updateTransforms=e.fieldTransforms.map(s=>function(r,o){const l=o.transform;if(l instanceof Fo)return{fieldPath:o.field.canonicalString(),setToServerValue:"REQUEST_TIME"};if(l instanceof rr)return{fieldPath:o.field.canonicalString(),appendMissingElements:{values:l.elements}};if(l instanceof or)return{fieldPath:o.field.canonicalString(),removeAllFromArray:{values:l.elements}};if(l instanceof Bo)return{fieldPath:o.field.canonicalString(),increment:l.Pe};throw q()}(0,s))),e.precondition.isNone||(t.currentDocument=function(i,r){return r.updateTime!==void 0?{updateTime:XT(i,r.updateTime)}:r.exists!==void 0?{exists:r.exists}:q()}(n,e.precondition)),t}function tI(n,e){return n&&n.length>0?(re(e!==void 0),n.map(t=>function(i,r){let o=i.updateTime?Et(i.updateTime):Et(r);return o.isEqual(z.min())&&(o=Et(r)),new FT(o,i.transformResults||[])}(t,e))):[]}function nI(n,e){return{documents:[Cp(n,e.path)]}}function sI(n,e){const t={structuredQuery:{}},s=e.path;let i;e.collectionGroup!==null?(i=s,t.structuredQuery.from=[{collectionId:e.collectionGroup,allDescendants:!0}]):(i=s.popLast(),t.structuredQuery.from=[{collectionId:s.lastSegment()}]),t.parent=Cp(n,i);const r=function(h){if(h.length!==0)return kp(Nt.create(h,"and"))}(e.filters);r&&(t.structuredQuery.where=r);const o=function(h){if(h.length!==0)return h.map(d=>function(p){return{field:Rs(p.field),direction:oI(p.dir)}}(d))}(e.orderBy);o&&(t.structuredQuery.orderBy=o);const l=Hl(n,e.limit);return l!==null&&(t.structuredQuery.limit=l),e.startAt&&(t.structuredQuery.startAt=function(h){return{before:h.inclusive,values:h.position}}(e.startAt)),e.endAt&&(t.structuredQuery.endAt=function(h){return{before:!h.inclusive,values:h.position}}(e.endAt)),{_t:t,parent:i}}function iI(n){let e=JT(n.parent);const t=n.structuredQuery,s=t.from?t.from.length:0;let i=null;if(s>0){re(s===1);const d=t.from[0];d.allDescendants?i=d.collectionId:e=e.child(d.collectionId)}let r=[];t.where&&(r=function(m){const p=Ap(m);return p instanceof Nt&&tp(p)?p.getFilters():[p]}(t.where));let o=[];t.orderBy&&(o=function(m){return m.map(p=>function(b){return new Oo(Ss(b.field),function(P){switch(P){case"ASCENDING":return"asc";case"DESCENDING":return"desc";default:return}}(b.direction))}(p))}(t.orderBy));let l=null;t.limit&&(l=function(m){let p;return p=typeof m=="object"?m.value:m,wr(p)?null:p}(t.limit));let c=null;t.startAt&&(c=function(m){const p=!!m.before,E=m.values||[];return new Lo(E,p)}(t.startAt));let h=null;return t.endAt&&(h=function(m){const p=!m.before,E=m.values||[];return new Lo(E,p)}(t.endAt)),CT(e,i,o,r,l,"F",c,h)}function rI(n,e){const t=function(i){switch(i){case"TargetPurposeListen":return null;case"TargetPurposeExistenceFilterMismatch":return"existence-filter-mismatch";case"TargetPurposeExistenceFilterMismatchBloom":return"existence-filter-mismatch-bloom";case"TargetPurposeLimboResolution":return"limbo-document";default:return q()}}(e.purpose);return t==null?null:{"goog-listen-tags":t}}function Ap(n){return n.unaryFilter!==void 0?function(t){switch(t.unaryFilter.op){case"IS_NAN":const s=Ss(t.unaryFilter.field);return ke.create(s,"==",{doubleValue:NaN});case"IS_NULL":const i=Ss(t.unaryFilter.field);return ke.create(i,"==",{nullValue:"NULL_VALUE"});case"IS_NOT_NAN":const r=Ss(t.unaryFilter.field);return ke.create(r,"!=",{doubleValue:NaN});case"IS_NOT_NULL":const o=Ss(t.unaryFilter.field);return ke.create(o,"!=",{nullValue:"NULL_VALUE"});default:return q()}}(n):n.fieldFilter!==void 0?function(t){return ke.create(Ss(t.fieldFilter.field),function(i){switch(i){case"EQUAL":return"==";case"NOT_EQUAL":return"!=";case"GREATER_THAN":return">";case"GREATER_THAN_OR_EQUAL":return">=";case"LESS_THAN":return"<";case"LESS_THAN_OR_EQUAL":return"<=";case"ARRAY_CONTAINS":return"array-contains";case"IN":return"in";case"NOT_IN":return"not-in";case"ARRAY_CONTAINS_ANY":return"array-contains-any";default:return q()}}(t.fieldFilter.op),t.fieldFilter.value)}(n):n.compositeFilter!==void 0?function(t){return Nt.create(t.compositeFilter.filters.map(s=>Ap(s)),function(i){switch(i){case"AND":return"and";case"OR":return"or";default:return q()}}(t.compositeFilter.op))}(n):q()}function oI(n){return GT[n]}function aI(n){return KT[n]}function lI(n){return QT[n]}function Rs(n){return{fieldPath:n.canonicalString()}}function Ss(n){return Ke.fromServerFormat(n.fieldPath)}function kp(n){return n instanceof ke?function(t){if(t.op==="=="){if(bd(t.value))return{unaryFilter:{field:Rs(t.field),op:"IS_NAN"}};if(Id(t.value))return{unaryFilter:{field:Rs(t.field),op:"IS_NULL"}}}else if(t.op==="!="){if(bd(t.value))return{unaryFilter:{field:Rs(t.field),op:"IS_NOT_NAN"}};if(Id(t.value))return{unaryFilter:{field:Rs(t.field),op:"IS_NOT_NULL"}}}return{fieldFilter:{field:Rs(t.field),op:aI(t.op),value:t.value}}}(n):n instanceof Nt?function(t){const s=t.getFilters().map(i=>kp(i));return s.length===1?s[0]:{compositeFilter:{op:lI(t.op),filters:s}}}(n):q()}function cI(n){const e=[];return n.fields.forEach(t=>e.push(t.canonicalString())),{fieldPaths:e}}function Pp(n){return n.length>=4&&n.get(0)==="projects"&&n.get(2)==="databases"}/**
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
 */class vn{constructor(e,t,s,i,r=z.min(),o=z.min(),l=Ye.EMPTY_BYTE_STRING,c=null){this.target=e,this.targetId=t,this.purpose=s,this.sequenceNumber=i,this.snapshotVersion=r,this.lastLimboFreeSnapshotVersion=o,this.resumeToken=l,this.expectedCount=c}withSequenceNumber(e){return new vn(this.target,this.targetId,this.purpose,e,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,this.expectedCount)}withResumeToken(e,t){return new vn(this.target,this.targetId,this.purpose,this.sequenceNumber,t,this.lastLimboFreeSnapshotVersion,e,null)}withExpectedCount(e){return new vn(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,e)}withLastLimboFreeSnapshotVersion(e){return new vn(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,e,this.resumeToken,this.expectedCount)}}/**
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
 */class hI{constructor(e){this.ct=e}}function uI(n){const e=iI({parent:n.parent,structuredQuery:n.structuredQuery});return n.limitType==="LAST"?Vo(e,e.limit,"L"):e}/**
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
 */class dI{constructor(){this.un=new fI}addToCollectionParentIndex(e,t){return this.un.add(t),N.resolve()}getCollectionParents(e,t){return N.resolve(this.un.getEntries(t))}addFieldIndex(e,t){return N.resolve()}deleteFieldIndex(e,t){return N.resolve()}deleteAllFieldIndexes(e){return N.resolve()}createTargetIndexes(e,t){return N.resolve()}getDocumentsMatchingTarget(e,t){return N.resolve(null)}getIndexType(e,t){return N.resolve(0)}getFieldIndexes(e,t){return N.resolve([])}getNextCollectionGroupToUpdate(e){return N.resolve(null)}getMinOffset(e,t){return N.resolve(An.min())}getMinOffsetFromCollectionGroup(e,t){return N.resolve(An.min())}updateCollectionGroup(e,t,s){return N.resolve()}updateIndexEntries(e,t){return N.resolve()}}class fI{constructor(){this.index={}}add(e){const t=e.lastSegment(),s=e.popLast(),i=this.index[t]||new Qe(ge.comparator),r=!i.has(s);return this.index[t]=i.add(s),r}has(e){const t=e.lastSegment(),s=e.popLast(),i=this.index[t];return i&&i.has(s)}getEntries(e){return(this.index[e]||new Qe(ge.comparator)).toArray()}}/**
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
 */class $s{constructor(e){this.Ln=e}next(){return this.Ln+=2,this.Ln}static Bn(){return new $s(0)}static kn(){return new $s(-1)}}/**
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
 */class mI{constructor(){this.changes=new si(e=>e.toString(),(e,t)=>e.isEqual(t)),this.changesApplied=!1}addEntry(e){this.assertNotApplied(),this.changes.set(e.key,e)}removeEntry(e,t){this.assertNotApplied(),this.changes.set(e,Ue.newInvalidDocument(e).setReadTime(t))}getEntry(e,t){this.assertNotApplied();const s=this.changes.get(t);return s!==void 0?N.resolve(s):this.getFromCache(e,t)}getEntries(e,t){return this.getAllFromCache(e,t)}apply(e){return this.assertNotApplied(),this.changesApplied=!0,this.applyChanges(e)}assertNotApplied(){}}/**
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
 */class gI{constructor(e,t,s,i){this.remoteDocumentCache=e,this.mutationQueue=t,this.documentOverlayCache=s,this.indexManager=i}getDocument(e,t){let s=null;return this.documentOverlayCache.getOverlay(e,t).next(i=>(s=i,this.remoteDocumentCache.getEntry(e,t))).next(i=>(s!==null&&Wi(s.mutation,i,vt.empty(),Me.now()),i))}getDocuments(e,t){return this.remoteDocumentCache.getEntries(e,t).next(s=>this.getLocalViewOfDocuments(e,s,ne()).next(()=>s))}getLocalViewOfDocuments(e,t,s=ne()){const i=Yn();return this.populateOverlays(e,i,t).next(()=>this.computeViews(e,t,i,s).next(r=>{let o=Oi();return r.forEach((l,c)=>{o=o.insert(l,c.overlayedDocument)}),o}))}getOverlayedDocuments(e,t){const s=Yn();return this.populateOverlays(e,s,t).next(()=>this.computeViews(e,t,s,ne()))}populateOverlays(e,t,s){const i=[];return s.forEach(r=>{t.has(r)||i.push(r)}),this.documentOverlayCache.getOverlays(e,i).next(r=>{r.forEach((o,l)=>{t.set(o,l)})})}computeViews(e,t,s,i){let r=on();const o=ji(),l=function(){return ji()}();return t.forEach((c,h)=>{const d=s.get(h.key);i.has(h.key)&&(d===void 0||d.mutation instanceof On)?r=r.insert(h.key,h):d!==void 0?(o.set(h.key,d.mutation.getFieldMask()),Wi(d.mutation,h,d.mutation.getFieldMask(),Me.now())):o.set(h.key,vt.empty())}),this.recalculateAndSaveOverlays(e,r).next(c=>(c.forEach((h,d)=>o.set(h,d)),t.forEach((h,d)=>{var m;return l.set(h,new pI(d,(m=o.get(h))!==null&&m!==void 0?m:null))}),l))}recalculateAndSaveOverlays(e,t){const s=ji();let i=new Pe((o,l)=>o-l),r=ne();return this.mutationQueue.getAllMutationBatchesAffectingDocumentKeys(e,t).next(o=>{for(const l of o)l.keys().forEach(c=>{const h=t.get(c);if(h===null)return;let d=s.get(c)||vt.empty();d=l.applyToLocalView(h,d),s.set(c,d);const m=(i.get(l.batchId)||ne()).add(c);i=i.insert(l.batchId,m)})}).next(()=>{const o=[],l=i.getReverseIterator();for(;l.hasNext();){const c=l.getNext(),h=c.key,d=c.value,m=hp();d.forEach(p=>{if(!r.has(p)){const E=gp(t.get(p),s.get(p));E!==null&&m.set(p,E),r=r.add(p)}}),o.push(this.documentOverlayCache.saveOverlays(e,h,m))}return N.waitFor(o)}).next(()=>s)}recalculateAndSaveOverlaysForDocumentKeys(e,t){return this.remoteDocumentCache.getEntries(e,t).next(s=>this.recalculateAndSaveOverlays(e,s))}getDocumentsMatchingQuery(e,t,s,i){return function(o){return j.isDocumentKey(o.path)&&o.collectionGroup===null&&o.filters.length===0}(t)?this.getDocumentsMatchingDocumentQuery(e,t.path):rp(t)?this.getDocumentsMatchingCollectionGroupQuery(e,t,s,i):this.getDocumentsMatchingCollectionQuery(e,t,s,i)}getNextDocuments(e,t,s,i){return this.remoteDocumentCache.getAllFromCollectionGroup(e,t,s,i).next(r=>{const o=i-r.size>0?this.documentOverlayCache.getOverlaysForCollectionGroup(e,t,s.largestBatchId,i-r.size):N.resolve(Yn());let l=-1,c=r;return o.next(h=>N.forEach(h,(d,m)=>(l<m.largestBatchId&&(l=m.largestBatchId),r.get(d)?N.resolve():this.remoteDocumentCache.getEntry(e,d).next(p=>{c=c.insert(d,p)}))).next(()=>this.populateOverlays(e,h,r)).next(()=>this.computeViews(e,c,h,ne())).next(d=>({batchId:l,changes:cp(d)})))})}getDocumentsMatchingDocumentQuery(e,t){return this.getDocument(e,new j(t)).next(s=>{let i=Oi();return s.isFoundDocument()&&(i=i.insert(s.key,s)),i})}getDocumentsMatchingCollectionGroupQuery(e,t,s,i){const r=t.collectionGroup;let o=Oi();return this.indexManager.getCollectionParents(e,r).next(l=>N.forEach(l,c=>{const h=function(m,p){return new Tr(p,null,m.explicitOrderBy.slice(),m.filters.slice(),m.limit,m.limitType,m.startAt,m.endAt)}(t,c.child(r));return this.getDocumentsMatchingCollectionQuery(e,h,s,i).next(d=>{d.forEach((m,p)=>{o=o.insert(m,p)})})}).next(()=>o))}getDocumentsMatchingCollectionQuery(e,t,s,i){let r;return this.documentOverlayCache.getOverlaysForCollection(e,t.path,s.largestBatchId).next(o=>(r=o,this.remoteDocumentCache.getDocumentsMatchingQuery(e,t,s,r,i))).next(o=>{r.forEach((c,h)=>{const d=h.getKey();o.get(d)===null&&(o=o.insert(d,Ue.newInvalidDocument(d)))});let l=Oi();return o.forEach((c,h)=>{const d=r.get(c);d!==void 0&&Wi(d.mutation,h,vt.empty(),Me.now()),va(t,h)&&(l=l.insert(c,h))}),l})}}/**
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
 */class _I{constructor(e){this.serializer=e,this.hr=new Map,this.Pr=new Map}getBundleMetadata(e,t){return N.resolve(this.hr.get(t))}saveBundleMetadata(e,t){return this.hr.set(t.id,function(i){return{id:i.id,version:i.version,createTime:Et(i.createTime)}}(t)),N.resolve()}getNamedQuery(e,t){return N.resolve(this.Pr.get(t))}saveNamedQuery(e,t){return this.Pr.set(t.name,function(i){return{name:i.name,query:uI(i.bundledQuery),readTime:Et(i.readTime)}}(t)),N.resolve()}}/**
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
 */class yI{constructor(){this.overlays=new Pe(j.comparator),this.Ir=new Map}getOverlay(e,t){return N.resolve(this.overlays.get(t))}getOverlays(e,t){const s=Yn();return N.forEach(t,i=>this.getOverlay(e,i).next(r=>{r!==null&&s.set(i,r)})).next(()=>s)}saveOverlays(e,t,s){return s.forEach((i,r)=>{this.ht(e,t,r)}),N.resolve()}removeOverlaysForBatchId(e,t,s){const i=this.Ir.get(s);return i!==void 0&&(i.forEach(r=>this.overlays=this.overlays.remove(r)),this.Ir.delete(s)),N.resolve()}getOverlaysForCollection(e,t,s){const i=Yn(),r=t.length+1,o=new j(t.child("")),l=this.overlays.getIteratorFrom(o);for(;l.hasNext();){const c=l.getNext().value,h=c.getKey();if(!t.isPrefixOf(h.path))break;h.path.length===r&&c.largestBatchId>s&&i.set(c.getKey(),c)}return N.resolve(i)}getOverlaysForCollectionGroup(e,t,s,i){let r=new Pe((h,d)=>h-d);const o=this.overlays.getIterator();for(;o.hasNext();){const h=o.getNext().value;if(h.getKey().getCollectionGroup()===t&&h.largestBatchId>s){let d=r.get(h.largestBatchId);d===null&&(d=Yn(),r=r.insert(h.largestBatchId,d)),d.set(h.getKey(),h)}}const l=Yn(),c=r.getIterator();for(;c.hasNext()&&(c.getNext().value.forEach((h,d)=>l.set(h,d)),!(l.size()>=i)););return N.resolve(l)}ht(e,t,s){const i=this.overlays.get(s.key);if(i!==null){const o=this.Ir.get(i.largestBatchId).delete(s.key);this.Ir.set(i.largestBatchId,o)}this.overlays=this.overlays.insert(s.key,new WT(t,s));let r=this.Ir.get(t);r===void 0&&(r=ne(),this.Ir.set(t,r)),this.Ir.set(t,r.add(s.key))}}/**
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
 */class vI{constructor(){this.sessionToken=Ye.EMPTY_BYTE_STRING}getSessionToken(e){return N.resolve(this.sessionToken)}setSessionToken(e,t){return this.sessionToken=t,N.resolve()}}/**
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
 */class jc{constructor(){this.Tr=new Qe(Ve.Er),this.dr=new Qe(Ve.Ar)}isEmpty(){return this.Tr.isEmpty()}addReference(e,t){const s=new Ve(e,t);this.Tr=this.Tr.add(s),this.dr=this.dr.add(s)}Rr(e,t){e.forEach(s=>this.addReference(s,t))}removeReference(e,t){this.Vr(new Ve(e,t))}mr(e,t){e.forEach(s=>this.removeReference(s,t))}gr(e){const t=new j(new ge([])),s=new Ve(t,e),i=new Ve(t,e+1),r=[];return this.dr.forEachInRange([s,i],o=>{this.Vr(o),r.push(o.key)}),r}pr(){this.Tr.forEach(e=>this.Vr(e))}Vr(e){this.Tr=this.Tr.delete(e),this.dr=this.dr.delete(e)}yr(e){const t=new j(new ge([])),s=new Ve(t,e),i=new Ve(t,e+1);let r=ne();return this.dr.forEachInRange([s,i],o=>{r=r.add(o.key)}),r}containsKey(e){const t=new Ve(e,0),s=this.Tr.firstAfterOrEqual(t);return s!==null&&e.isEqual(s.key)}}class Ve{constructor(e,t){this.key=e,this.wr=t}static Er(e,t){return j.comparator(e.key,t.key)||le(e.wr,t.wr)}static Ar(e,t){return le(e.wr,t.wr)||j.comparator(e.key,t.key)}}/**
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
 */class EI{constructor(e,t){this.indexManager=e,this.referenceDelegate=t,this.mutationQueue=[],this.Sr=1,this.br=new Qe(Ve.Er)}checkEmpty(e){return N.resolve(this.mutationQueue.length===0)}addMutationBatch(e,t,s,i){const r=this.Sr;this.Sr++,this.mutationQueue.length>0&&this.mutationQueue[this.mutationQueue.length-1];const o=new jT(r,t,s,i);this.mutationQueue.push(o);for(const l of i)this.br=this.br.add(new Ve(l.key,r)),this.indexManager.addToCollectionParentIndex(e,l.key.path.popLast());return N.resolve(o)}lookupMutationBatch(e,t){return N.resolve(this.Dr(t))}getNextMutationBatchAfterBatchId(e,t){const s=t+1,i=this.vr(s),r=i<0?0:i;return N.resolve(this.mutationQueue.length>r?this.mutationQueue[r]:null)}getHighestUnacknowledgedBatchId(){return N.resolve(this.mutationQueue.length===0?-1:this.Sr-1)}getAllMutationBatches(e){return N.resolve(this.mutationQueue.slice())}getAllMutationBatchesAffectingDocumentKey(e,t){const s=new Ve(t,0),i=new Ve(t,Number.POSITIVE_INFINITY),r=[];return this.br.forEachInRange([s,i],o=>{const l=this.Dr(o.wr);r.push(l)}),N.resolve(r)}getAllMutationBatchesAffectingDocumentKeys(e,t){let s=new Qe(le);return t.forEach(i=>{const r=new Ve(i,0),o=new Ve(i,Number.POSITIVE_INFINITY);this.br.forEachInRange([r,o],l=>{s=s.add(l.wr)})}),N.resolve(this.Cr(s))}getAllMutationBatchesAffectingQuery(e,t){const s=t.path,i=s.length+1;let r=s;j.isDocumentKey(r)||(r=r.child(""));const o=new Ve(new j(r),0);let l=new Qe(le);return this.br.forEachWhile(c=>{const h=c.key.path;return!!s.isPrefixOf(h)&&(h.length===i&&(l=l.add(c.wr)),!0)},o),N.resolve(this.Cr(l))}Cr(e){const t=[];return e.forEach(s=>{const i=this.Dr(s);i!==null&&t.push(i)}),t}removeMutationBatch(e,t){re(this.Fr(t.batchId,"removed")===0),this.mutationQueue.shift();let s=this.br;return N.forEach(t.mutations,i=>{const r=new Ve(i.key,t.batchId);return s=s.delete(r),this.referenceDelegate.markPotentiallyOrphaned(e,i.key)}).next(()=>{this.br=s})}On(e){}containsKey(e,t){const s=new Ve(t,0),i=this.br.firstAfterOrEqual(s);return N.resolve(t.isEqual(i&&i.key))}performConsistencyCheck(e){return this.mutationQueue.length,N.resolve()}Fr(e,t){return this.vr(e)}vr(e){return this.mutationQueue.length===0?0:e-this.mutationQueue[0].batchId}Dr(e){const t=this.vr(e);return t<0||t>=this.mutationQueue.length?null:this.mutationQueue[t]}}/**
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
 */class wI{constructor(e){this.Mr=e,this.docs=function(){return new Pe(j.comparator)}(),this.size=0}setIndexManager(e){this.indexManager=e}addEntry(e,t){const s=t.key,i=this.docs.get(s),r=i?i.size:0,o=this.Mr(t);return this.docs=this.docs.insert(s,{document:t.mutableCopy(),size:o}),this.size+=o-r,this.indexManager.addToCollectionParentIndex(e,s.path.popLast())}removeEntry(e){const t=this.docs.get(e);t&&(this.docs=this.docs.remove(e),this.size-=t.size)}getEntry(e,t){const s=this.docs.get(t);return N.resolve(s?s.document.mutableCopy():Ue.newInvalidDocument(t))}getEntries(e,t){let s=on();return t.forEach(i=>{const r=this.docs.get(i);s=s.insert(i,r?r.document.mutableCopy():Ue.newInvalidDocument(i))}),N.resolve(s)}getDocumentsMatchingQuery(e,t,s,i){let r=on();const o=t.path,l=new j(o.child("")),c=this.docs.getIteratorFrom(l);for(;c.hasNext();){const{key:h,value:{document:d}}=c.getNext();if(!o.isPrefixOf(h.path))break;h.path.length>o.length+1||oT(rT(d),s)<=0||(i.has(d.key)||va(t,d))&&(r=r.insert(d.key,d.mutableCopy()))}return N.resolve(r)}getAllFromCollectionGroup(e,t,s,i){q()}Or(e,t){return N.forEach(this.docs,s=>t(s))}newChangeBuffer(e){return new TI(this)}getSize(e){return N.resolve(this.size)}}class TI extends mI{constructor(e){super(),this.cr=e}applyChanges(e){const t=[];return this.changes.forEach((s,i)=>{i.isValidDocument()?t.push(this.cr.addEntry(e,i)):this.cr.removeEntry(s)}),N.waitFor(t)}getFromCache(e,t){return this.cr.getEntry(e,t)}getAllFromCache(e,t){return this.cr.getEntries(e,t)}}/**
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
 */class II{constructor(e){this.persistence=e,this.Nr=new si(t=>xc(t),Mc),this.lastRemoteSnapshotVersion=z.min(),this.highestTargetId=0,this.Lr=0,this.Br=new jc,this.targetCount=0,this.kr=$s.Bn()}forEachTarget(e,t){return this.Nr.forEach((s,i)=>t(i)),N.resolve()}getLastRemoteSnapshotVersion(e){return N.resolve(this.lastRemoteSnapshotVersion)}getHighestSequenceNumber(e){return N.resolve(this.Lr)}allocateTargetId(e){return this.highestTargetId=this.kr.next(),N.resolve(this.highestTargetId)}setTargetsMetadata(e,t,s){return s&&(this.lastRemoteSnapshotVersion=s),t>this.Lr&&(this.Lr=t),N.resolve()}Kn(e){this.Nr.set(e.target,e);const t=e.targetId;t>this.highestTargetId&&(this.kr=new $s(t),this.highestTargetId=t),e.sequenceNumber>this.Lr&&(this.Lr=e.sequenceNumber)}addTargetData(e,t){return this.Kn(t),this.targetCount+=1,N.resolve()}updateTargetData(e,t){return this.Kn(t),N.resolve()}removeTargetData(e,t){return this.Nr.delete(t.target),this.Br.gr(t.targetId),this.targetCount-=1,N.resolve()}removeTargets(e,t,s){let i=0;const r=[];return this.Nr.forEach((o,l)=>{l.sequenceNumber<=t&&s.get(l.targetId)===null&&(this.Nr.delete(o),r.push(this.removeMatchingKeysForTargetId(e,l.targetId)),i++)}),N.waitFor(r).next(()=>i)}getTargetCount(e){return N.resolve(this.targetCount)}getTargetData(e,t){const s=this.Nr.get(t)||null;return N.resolve(s)}addMatchingKeys(e,t,s){return this.Br.Rr(t,s),N.resolve()}removeMatchingKeys(e,t,s){this.Br.mr(t,s);const i=this.persistence.referenceDelegate,r=[];return i&&t.forEach(o=>{r.push(i.markPotentiallyOrphaned(e,o))}),N.waitFor(r)}removeMatchingKeysForTargetId(e,t){return this.Br.gr(t),N.resolve()}getMatchingKeysForTargetId(e,t){const s=this.Br.yr(t);return N.resolve(s)}containsKey(e,t){return N.resolve(this.Br.containsKey(t))}}/**
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
 */class bI{constructor(e,t){this.qr={},this.overlays={},this.Qr=new kc(0),this.Kr=!1,this.Kr=!0,this.$r=new vI,this.referenceDelegate=e(this),this.Ur=new II(this),this.indexManager=new dI,this.remoteDocumentCache=function(i){return new wI(i)}(s=>this.referenceDelegate.Wr(s)),this.serializer=new hI(t),this.Gr=new _I(this.serializer)}start(){return Promise.resolve()}shutdown(){return this.Kr=!1,Promise.resolve()}get started(){return this.Kr}setDatabaseDeletedListener(){}setNetworkEnabled(){}getIndexManager(e){return this.indexManager}getDocumentOverlayCache(e){let t=this.overlays[e.toKey()];return t||(t=new yI,this.overlays[e.toKey()]=t),t}getMutationQueue(e,t){let s=this.qr[e.toKey()];return s||(s=new EI(t,this.referenceDelegate),this.qr[e.toKey()]=s),s}getGlobalsCache(){return this.$r}getTargetCache(){return this.Ur}getRemoteDocumentCache(){return this.remoteDocumentCache}getBundleCache(){return this.Gr}runTransaction(e,t,s){B("MemoryPersistence","Starting transaction:",e);const i=new CI(this.Qr.next());return this.referenceDelegate.zr(),s(i).next(r=>this.referenceDelegate.jr(i).next(()=>r)).toPromise().then(r=>(i.raiseOnCommittedEvent(),r))}Hr(e,t){return N.or(Object.values(this.qr).map(s=>()=>s.containsKey(e,t)))}}class CI extends lT{constructor(e){super(),this.currentSequenceNumber=e}}class Wc{constructor(e){this.persistence=e,this.Jr=new jc,this.Yr=null}static Zr(e){return new Wc(e)}get Xr(){if(this.Yr)return this.Yr;throw q()}addReference(e,t,s){return this.Jr.addReference(s,t),this.Xr.delete(s.toString()),N.resolve()}removeReference(e,t,s){return this.Jr.removeReference(s,t),this.Xr.add(s.toString()),N.resolve()}markPotentiallyOrphaned(e,t){return this.Xr.add(t.toString()),N.resolve()}removeTarget(e,t){this.Jr.gr(t.targetId).forEach(i=>this.Xr.add(i.toString()));const s=this.persistence.getTargetCache();return s.getMatchingKeysForTargetId(e,t.targetId).next(i=>{i.forEach(r=>this.Xr.add(r.toString()))}).next(()=>s.removeTargetData(e,t))}zr(){this.Yr=new Set}jr(e){const t=this.persistence.getRemoteDocumentCache().newChangeBuffer();return N.forEach(this.Xr,s=>{const i=j.fromPath(s);return this.ei(e,i).next(r=>{r||t.removeEntry(i,z.min())})}).next(()=>(this.Yr=null,t.apply(e)))}updateLimboDocument(e,t){return this.ei(e,t).next(s=>{s?this.Xr.delete(t.toString()):this.Xr.add(t.toString())})}Wr(e){return 0}ei(e,t){return N.or([()=>N.resolve(this.Jr.containsKey(t)),()=>this.persistence.getTargetCache().containsKey(e,t),()=>this.persistence.Hr(e,t)])}}/**
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
 */class SI{constructor(){this.Gi=!1,this.zi=!1,this.ji=100,this.Hi=function(){return Ay()?8:cT(rt())>0?6:4}()}initialize(e,t){this.Ji=e,this.indexManager=t,this.Gi=!0}getDocumentsMatchingQuery(e,t,s,i){const r={result:null};return this.Yi(e,t).next(o=>{r.result=o}).next(()=>{if(!r.result)return this.Zi(e,t,i,s).next(o=>{r.result=o})}).next(()=>{if(r.result)return;const o=new RI;return this.Xi(e,t,o).next(l=>{if(r.result=l,this.zi)return this.es(e,t,o,l.size)})}).next(()=>r.result)}es(e,t,s,i){return s.documentReadCount<this.ji?(ki()<=te.DEBUG&&B("QueryEngine","SDK will not create cache indexes for query:",Cs(t),"since it only creates cache indexes for collection contains","more than or equal to",this.ji,"documents"),N.resolve()):(ki()<=te.DEBUG&&B("QueryEngine","Query:",Cs(t),"scans",s.documentReadCount,"local documents and returns",i,"documents as results."),s.documentReadCount>this.Hi*i?(ki()<=te.DEBUG&&B("QueryEngine","The SDK decides to create cache indexes for query:",Cs(t),"as using cache indexes may help improve performance."),this.indexManager.createTargetIndexes(e,Vt(t))):N.resolve())}Yi(e,t){if(Ad(t))return N.resolve(null);let s=Vt(t);return this.indexManager.getIndexType(e,s).next(i=>i===0?null:(t.limit!==null&&i===1&&(t=Vo(t,null,"F"),s=Vt(t)),this.indexManager.getDocumentsMatchingTarget(e,s).next(r=>{const o=ne(...r);return this.Ji.getDocuments(e,o).next(l=>this.indexManager.getMinOffset(e,s).next(c=>{const h=this.ts(t,l);return this.ns(t,h,o,c.readTime)?this.Yi(e,Vo(t,null,"F")):this.rs(e,h,t,c)}))})))}Zi(e,t,s,i){return Ad(t)||i.isEqual(z.min())?N.resolve(null):this.Ji.getDocuments(e,s).next(r=>{const o=this.ts(t,r);return this.ns(t,o,s,i)?N.resolve(null):(ki()<=te.DEBUG&&B("QueryEngine","Re-using previous result from %s to execute query: %s",i.toString(),Cs(t)),this.rs(e,o,t,iT(i,-1)).next(l=>l))})}ts(e,t){let s=new Qe(ap(e));return t.forEach((i,r)=>{va(e,r)&&(s=s.add(r))}),s}ns(e,t,s,i){if(e.limit===null)return!1;if(s.size!==t.size)return!0;const r=e.limitType==="F"?t.last():t.first();return!!r&&(r.hasPendingWrites||r.version.compareTo(i)>0)}Xi(e,t,s){return ki()<=te.DEBUG&&B("QueryEngine","Using full collection scan to execute query:",Cs(t)),this.Ji.getDocumentsMatchingQuery(e,t,An.min(),s)}rs(e,t,s,i){return this.Ji.getDocumentsMatchingQuery(e,s,i).next(r=>(t.forEach(o=>{r=r.insert(o.key,o)}),r))}}/**
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
 */class AI{constructor(e,t,s,i){this.persistence=e,this.ss=t,this.serializer=i,this.os=new Pe(le),this._s=new si(r=>xc(r),Mc),this.us=new Map,this.cs=e.getRemoteDocumentCache(),this.Ur=e.getTargetCache(),this.Gr=e.getBundleCache(),this.ls(s)}ls(e){this.documentOverlayCache=this.persistence.getDocumentOverlayCache(e),this.indexManager=this.persistence.getIndexManager(e),this.mutationQueue=this.persistence.getMutationQueue(e,this.indexManager),this.localDocuments=new gI(this.cs,this.mutationQueue,this.documentOverlayCache,this.indexManager),this.cs.setIndexManager(this.indexManager),this.ss.initialize(this.localDocuments,this.indexManager)}collectGarbage(e){return this.persistence.runTransaction("Collect garbage","readwrite-primary",t=>e.collect(t,this.os))}}function kI(n,e,t,s){return new AI(n,e,t,s)}async function Np(n,e){const t=Q(n);return await t.persistence.runTransaction("Handle user change","readonly",s=>{let i;return t.mutationQueue.getAllMutationBatches(s).next(r=>(i=r,t.ls(e),t.mutationQueue.getAllMutationBatches(s))).next(r=>{const o=[],l=[];let c=ne();for(const h of i){o.push(h.batchId);for(const d of h.mutations)c=c.add(d.key)}for(const h of r){l.push(h.batchId);for(const d of h.mutations)c=c.add(d.key)}return t.localDocuments.getDocuments(s,c).next(h=>({hs:h,removedBatchIds:o,addedBatchIds:l}))})})}function PI(n,e){const t=Q(n);return t.persistence.runTransaction("Acknowledge batch","readwrite-primary",s=>{const i=e.batch.keys(),r=t.cs.newChangeBuffer({trackRemovals:!0});return function(l,c,h,d){const m=h.batch,p=m.keys();let E=N.resolve();return p.forEach(b=>{E=E.next(()=>d.getEntry(c,b)).next(A=>{const P=h.docVersions.get(b);re(P!==null),A.version.compareTo(P)<0&&(m.applyToRemoteDocument(A,h),A.isValidDocument()&&(A.setReadTime(h.commitVersion),d.addEntry(A)))})}),E.next(()=>l.mutationQueue.removeMutationBatch(c,m))}(t,s,e,r).next(()=>r.apply(s)).next(()=>t.mutationQueue.performConsistencyCheck(s)).next(()=>t.documentOverlayCache.removeOverlaysForBatchId(s,i,e.batch.batchId)).next(()=>t.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(s,function(l){let c=ne();for(let h=0;h<l.mutationResults.length;++h)l.mutationResults[h].transformResults.length>0&&(c=c.add(l.batch.mutations[h].key));return c}(e))).next(()=>t.localDocuments.getDocuments(s,i))})}function Dp(n){const e=Q(n);return e.persistence.runTransaction("Get last remote snapshot version","readonly",t=>e.Ur.getLastRemoteSnapshotVersion(t))}function NI(n,e){const t=Q(n),s=e.snapshotVersion;let i=t.os;return t.persistence.runTransaction("Apply remote event","readwrite-primary",r=>{const o=t.cs.newChangeBuffer({trackRemovals:!0});i=t.os;const l=[];e.targetChanges.forEach((d,m)=>{const p=i.get(m);if(!p)return;l.push(t.Ur.removeMatchingKeys(r,d.removedDocuments,m).next(()=>t.Ur.addMatchingKeys(r,d.addedDocuments,m)));let E=p.withSequenceNumber(r.currentSequenceNumber);e.targetMismatches.get(m)!==null?E=E.withResumeToken(Ye.EMPTY_BYTE_STRING,z.min()).withLastLimboFreeSnapshotVersion(z.min()):d.resumeToken.approximateByteSize()>0&&(E=E.withResumeToken(d.resumeToken,s)),i=i.insert(m,E),function(A,P,F){return A.resumeToken.approximateByteSize()===0||P.snapshotVersion.toMicroseconds()-A.snapshotVersion.toMicroseconds()>=3e8?!0:F.addedDocuments.size+F.modifiedDocuments.size+F.removedDocuments.size>0}(p,E,d)&&l.push(t.Ur.updateTargetData(r,E))});let c=on(),h=ne();if(e.documentUpdates.forEach(d=>{e.resolvedLimboDocuments.has(d)&&l.push(t.persistence.referenceDelegate.updateLimboDocument(r,d))}),l.push(DI(r,o,e.documentUpdates).next(d=>{c=d.Ps,h=d.Is})),!s.isEqual(z.min())){const d=t.Ur.getLastRemoteSnapshotVersion(r).next(m=>t.Ur.setTargetsMetadata(r,r.currentSequenceNumber,s));l.push(d)}return N.waitFor(l).next(()=>o.apply(r)).next(()=>t.localDocuments.getLocalViewOfDocuments(r,c,h)).next(()=>c)}).then(r=>(t.os=i,r))}function DI(n,e,t){let s=ne(),i=ne();return t.forEach(r=>s=s.add(r)),e.getEntries(n,s).next(r=>{let o=on();return t.forEach((l,c)=>{const h=r.get(l);c.isFoundDocument()!==h.isFoundDocument()&&(i=i.add(l)),c.isNoDocument()&&c.version.isEqual(z.min())?(e.removeEntry(l,c.readTime),o=o.insert(l,c)):!h.isValidDocument()||c.version.compareTo(h.version)>0||c.version.compareTo(h.version)===0&&h.hasPendingWrites?(e.addEntry(c),o=o.insert(l,c)):B("LocalStore","Ignoring outdated watch update for ",l,". Current version:",h.version," Watch version:",c.version)}),{Ps:o,Is:i}})}function xI(n,e){const t=Q(n);return t.persistence.runTransaction("Get next mutation batch","readonly",s=>(e===void 0&&(e=-1),t.mutationQueue.getNextMutationBatchAfterBatchId(s,e)))}function MI(n,e){const t=Q(n);return t.persistence.runTransaction("Allocate target","readwrite",s=>{let i;return t.Ur.getTargetData(s,e).next(r=>r?(i=r,N.resolve(i)):t.Ur.allocateTargetId(s).next(o=>(i=new vn(e,o,"TargetPurposeListen",s.currentSequenceNumber),t.Ur.addTargetData(s,i).next(()=>i))))}).then(s=>{const i=t.os.get(s.targetId);return(i===null||s.snapshotVersion.compareTo(i.snapshotVersion)>0)&&(t.os=t.os.insert(s.targetId,s),t._s.set(e,s.targetId)),s})}async function Ql(n,e,t){const s=Q(n),i=s.os.get(e),r=t?"readwrite":"readwrite-primary";try{t||await s.persistence.runTransaction("Release target",r,o=>s.persistence.referenceDelegate.removeTarget(o,i))}catch(o){if(!Er(o))throw o;B("LocalStore",`Failed to update sequence numbers for target ${e}: ${o}`)}s.os=s.os.remove(e),s._s.delete(i.target)}function Bd(n,e,t){const s=Q(n);let i=z.min(),r=ne();return s.persistence.runTransaction("Execute query","readwrite",o=>function(c,h,d){const m=Q(c),p=m._s.get(d);return p!==void 0?N.resolve(m.os.get(p)):m.Ur.getTargetData(h,d)}(s,o,Vt(e)).next(l=>{if(l)return i=l.lastLimboFreeSnapshotVersion,s.Ur.getMatchingKeysForTargetId(o,l.targetId).next(c=>{r=c})}).next(()=>s.ss.getDocumentsMatchingQuery(o,e,t?i:z.min(),t?r:ne())).next(l=>(LI(s,ST(e),l),{documents:l,Ts:r})))}function LI(n,e,t){let s=n.us.get(e)||z.min();t.forEach((i,r)=>{r.readTime.compareTo(s)>0&&(s=r.readTime)}),n.us.set(e,s)}class Ud{constructor(){this.activeTargetIds=xT()}fs(e){this.activeTargetIds=this.activeTargetIds.add(e)}gs(e){this.activeTargetIds=this.activeTargetIds.delete(e)}Vs(){const e={activeTargetIds:this.activeTargetIds.toArray(),updateTimeMs:Date.now()};return JSON.stringify(e)}}class OI{constructor(){this.so=new Ud,this.oo={},this.onlineStateHandler=null,this.sequenceNumberHandler=null}addPendingMutation(e){}updateMutationState(e,t,s){}addLocalQueryTarget(e,t=!0){return t&&this.so.fs(e),this.oo[e]||"not-current"}updateQueryState(e,t,s){this.oo[e]=t}removeLocalQueryTarget(e){this.so.gs(e)}isLocalQueryTarget(e){return this.so.activeTargetIds.has(e)}clearQueryState(e){delete this.oo[e]}getAllActiveQueryTargets(){return this.so.activeTargetIds}isActiveQueryTarget(e){return this.so.activeTargetIds.has(e)}start(){return this.so=new Ud,Promise.resolve()}handleUserChange(e,t,s){}setOnlineState(e){}shutdown(){}writeSequenceNumber(e){}notifyBundleLoaded(e){}}/**
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
 */class jd{constructor(){this.ao=()=>this.uo(),this.co=()=>this.lo(),this.ho=[],this.Po()}_o(e){this.ho.push(e)}shutdown(){window.removeEventListener("online",this.ao),window.removeEventListener("offline",this.co)}Po(){window.addEventListener("online",this.ao),window.addEventListener("offline",this.co)}uo(){B("ConnectivityMonitor","Network connectivity changed: AVAILABLE");for(const e of this.ho)e(0)}lo(){B("ConnectivityMonitor","Network connectivity changed: UNAVAILABLE");for(const e of this.ho)e(1)}static D(){return typeof window<"u"&&window.addEventListener!==void 0&&window.removeEventListener!==void 0}}/**
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
 */let ao=null;function _l(){return ao===null?ao=function(){return 268435456+Math.round(2147483648*Math.random())}():ao++,"0x"+ao.toString(16)}/**
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
 */const Ze="WebChannelConnection";class UI extends class{constructor(t){this.databaseInfo=t,this.databaseId=t.databaseId;const s=t.ssl?"https":"http",i=encodeURIComponent(this.databaseId.projectId),r=encodeURIComponent(this.databaseId.database);this.Do=s+"://"+t.host,this.vo=`projects/${i}/databases/${r}`,this.Co=this.databaseId.database==="(default)"?`project_id=${i}`:`project_id=${i}&database_id=${r}`}get Fo(){return!1}Mo(t,s,i,r,o){const l=_l(),c=this.xo(t,s.toUriEncodedString());B("RestConnection",`Sending RPC '${t}' ${l}:`,c,i);const h={"google-cloud-resource-prefix":this.vo,"x-goog-request-params":this.Co};return this.Oo(h,r,o),this.No(t,c,h,i).then(d=>(B("RestConnection",`Received RPC '${t}' ${l}: `,d),d),d=>{throw Us("RestConnection",`RPC '${t}' ${l} failed with error: `,d,"url: ",c,"request:",i),d})}Lo(t,s,i,r,o,l){return this.Mo(t,s,i,r,o)}Oo(t,s,i){t["X-Goog-Api-Client"]=function(){return"gl-js/ fire/"+ni}(),t["Content-Type"]="text/plain",this.databaseInfo.appId&&(t["X-Firebase-GMPID"]=this.databaseInfo.appId),s&&s.headers.forEach((r,o)=>t[o]=r),i&&i.headers.forEach((r,o)=>t[o]=r)}xo(t,s){const i=FI[t];return`${this.Do}/v1/${s}:${i}`}terminate(){}}{constructor(e){super(e),this.forceLongPolling=e.forceLongPolling,this.autoDetectLongPolling=e.autoDetectLongPolling,this.useFetchStreams=e.useFetchStreams,this.longPollingOptions=e.longPollingOptions}No(e,t,s,i){const r=_l();return new Promise((o,l)=>{const c=new qm;c.setWithCredentials(!0),c.listenOnce($m.COMPLETE,()=>{try{switch(c.getLastErrorCode()){case go.NO_ERROR:const d=c.getResponseJson();B(Ze,`XHR for RPC '${e}' ${r} received:`,JSON.stringify(d)),o(d);break;case go.TIMEOUT:B(Ze,`RPC '${e}' ${r} timed out`),l(new V(k.DEADLINE_EXCEEDED,"Request time out"));break;case go.HTTP_ERROR:const m=c.getStatus();if(B(Ze,`RPC '${e}' ${r} failed with status:`,m,"response text:",c.getResponseText()),m>0){let p=c.getResponseJson();Array.isArray(p)&&(p=p[0]);const E=p==null?void 0:p.error;if(E&&E.status&&E.message){const b=function(P){const F=P.toLowerCase().replace(/_/g,"-");return Object.values(k).indexOf(F)>=0?F:k.UNKNOWN}(E.status);l(new V(b,E.message))}else l(new V(k.UNKNOWN,"Server responded with status "+c.getStatus()))}else l(new V(k.UNAVAILABLE,"Connection failed."));break;default:q()}}finally{B(Ze,`RPC '${e}' ${r} completed.`)}});const h=JSON.stringify(i);B(Ze,`RPC '${e}' ${r} sending request:`,i),c.send(t,"POST",h,s,15)})}Bo(e,t,s){const i=_l(),r=[this.Do,"/","google.firestore.v1.Firestore","/",e,"/channel"],o=Gm(),l=Hm(),c={httpSessionIdParam:"gsessionid",initMessageHeaders:{},messageUrlParams:{database:`projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`},sendRawJson:!0,supportsCrossDomainXhr:!0,internalChannelParams:{forwardChannelRequestTimeoutMs:6e5},forceLongPolling:this.forceLongPolling,detectBufferingProxy:this.autoDetectLongPolling},h=this.longPollingOptions.timeoutSeconds;h!==void 0&&(c.longPollingTimeout=Math.round(1e3*h)),this.useFetchStreams&&(c.useFetchStreams=!0),this.Oo(c.initMessageHeaders,t,s),c.encodeInitMessageHeaders=!0;const d=r.join("");B(Ze,`Creating RPC '${e}' stream ${i}: ${d}`,c);const m=o.createWebChannel(d,c);let p=!1,E=!1;const b=new BI({Io:P=>{E?B(Ze,`Not sending because RPC '${e}' stream ${i} is closed:`,P):(p||(B(Ze,`Opening RPC '${e}' stream ${i} transport.`),m.open(),p=!0),B(Ze,`RPC '${e}' stream ${i} sending:`,P),m.send(P))},To:()=>m.close()}),A=(P,F,U)=>{P.listen(F,O=>{try{U(O)}catch(Y){setTimeout(()=>{throw Y},0)}})};return A(m,Li.EventType.OPEN,()=>{E||(B(Ze,`RPC '${e}' stream ${i} transport opened.`),b.yo())}),A(m,Li.EventType.CLOSE,()=>{E||(E=!0,B(Ze,`RPC '${e}' stream ${i} transport closed`),b.So())}),A(m,Li.EventType.ERROR,P=>{E||(E=!0,Us(Ze,`RPC '${e}' stream ${i} transport errored:`,P),b.So(new V(k.UNAVAILABLE,"The operation could not be completed")))}),A(m,Li.EventType.MESSAGE,P=>{var F;if(!E){const U=P.data[0];re(!!U);const O=U,Y=O.error||((F=O[0])===null||F===void 0?void 0:F.error);if(Y){B(Ze,`RPC '${e}' stream ${i} received error:`,Y);const oe=Y.status;let ee=function(_){const w=Ae[_];if(w!==void 0)return Ep(w)}(oe),I=Y.message;ee===void 0&&(ee=k.INTERNAL,I="Unknown error status: "+oe+" with message "+Y.message),E=!0,b.So(new V(ee,I)),m.close()}else B(Ze,`RPC '${e}' stream ${i} received:`,U),b.bo(U)}}),A(l,zm.STAT_EVENT,P=>{P.stat===Bl.PROXY?B(Ze,`RPC '${e}' stream ${i} detected buffering proxy`):P.stat===Bl.NOPROXY&&B(Ze,`RPC '${e}' stream ${i} detected no buffering proxy`)}),setTimeout(()=>{b.wo()},0),b}}function yl(){return typeof document<"u"?document:null}/**
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
 */function Ia(n){return new YT(n,!0)}/**
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
 */class $c{constructor(e,t,s=1e3,i=1.5,r=6e4){this.ui=e,this.timerId=t,this.ko=s,this.qo=i,this.Qo=r,this.Ko=0,this.$o=null,this.Uo=Date.now(),this.reset()}reset(){this.Ko=0}Wo(){this.Ko=this.Qo}Go(e){this.cancel();const t=Math.floor(this.Ko+this.zo()),s=Math.max(0,Date.now()-this.Uo),i=Math.max(0,t-s);i>0&&B("ExponentialBackoff",`Backing off for ${i} ms (base delay: ${this.Ko} ms, delay with jitter: ${t} ms, last attempt: ${s} ms ago)`),this.$o=this.ui.enqueueAfterDelay(this.timerId,i,()=>(this.Uo=Date.now(),e())),this.Ko*=this.qo,this.Ko<this.ko&&(this.Ko=this.ko),this.Ko>this.Qo&&(this.Ko=this.Qo)}jo(){this.$o!==null&&(this.$o.skipDelay(),this.$o=null)}cancel(){this.$o!==null&&(this.$o.cancel(),this.$o=null)}zo(){return(Math.random()-.5)*this.Ko}}/**
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
 */class xp{constructor(e,t,s,i,r,o,l,c){this.ui=e,this.Ho=s,this.Jo=i,this.connection=r,this.authCredentialsProvider=o,this.appCheckCredentialsProvider=l,this.listener=c,this.state=0,this.Yo=0,this.Zo=null,this.Xo=null,this.stream=null,this.e_=0,this.t_=new $c(e,t)}n_(){return this.state===1||this.state===5||this.r_()}r_(){return this.state===2||this.state===3}start(){this.e_=0,this.state!==4?this.auth():this.i_()}async stop(){this.n_()&&await this.close(0)}s_(){this.state=0,this.t_.reset()}o_(){this.r_()&&this.Zo===null&&(this.Zo=this.ui.enqueueAfterDelay(this.Ho,6e4,()=>this.__()))}a_(e){this.u_(),this.stream.send(e)}async __(){if(this.r_())return this.close(0)}u_(){this.Zo&&(this.Zo.cancel(),this.Zo=null)}c_(){this.Xo&&(this.Xo.cancel(),this.Xo=null)}async close(e,t){this.u_(),this.c_(),this.t_.cancel(),this.Yo++,e!==4?this.t_.reset():t&&t.code===k.RESOURCE_EXHAUSTED?(rn(t.toString()),rn("Using maximum backoff delay to prevent overloading the backend."),this.t_.Wo()):t&&t.code===k.UNAUTHENTICATED&&this.state!==3&&(this.authCredentialsProvider.invalidateToken(),this.appCheckCredentialsProvider.invalidateToken()),this.stream!==null&&(this.l_(),this.stream.close(),this.stream=null),this.state=e,await this.listener.mo(t)}l_(){}auth(){this.state=1;const e=this.h_(this.Yo),t=this.Yo;Promise.all([this.authCredentialsProvider.getToken(),this.appCheckCredentialsProvider.getToken()]).then(([s,i])=>{this.Yo===t&&this.P_(s,i)},s=>{e(()=>{const i=new V(k.UNKNOWN,"Fetching auth token failed: "+s.message);return this.I_(i)})})}P_(e,t){const s=this.h_(this.Yo);this.stream=this.T_(e,t),this.stream.Eo(()=>{s(()=>this.listener.Eo())}),this.stream.Ro(()=>{s(()=>(this.state=2,this.Xo=this.ui.enqueueAfterDelay(this.Jo,1e4,()=>(this.r_()&&(this.state=3),Promise.resolve())),this.listener.Ro()))}),this.stream.mo(i=>{s(()=>this.I_(i))}),this.stream.onMessage(i=>{s(()=>++this.e_==1?this.E_(i):this.onNext(i))})}i_(){this.state=5,this.t_.Go(async()=>{this.state=0,this.start()})}I_(e){return B("PersistentStream",`close with error: ${e}`),this.stream=null,this.close(4,e)}h_(e){return t=>{this.ui.enqueueAndForget(()=>this.Yo===e?t():(B("PersistentStream","stream callback skipped by getCloseGuardedDispatcher."),Promise.resolve()))}}}class jI extends xp{constructor(e,t,s,i,r,o){super(e,"listen_stream_connection_backoff","listen_stream_idle","health_check_timeout",t,s,i,o),this.serializer=r}T_(e,t){return this.connection.Bo("Listen",e,t)}E_(e){return this.onNext(e)}onNext(e){this.t_.reset();const t=eI(this.serializer,e),s=function(r){if(!("targetChange"in r))return z.min();const o=r.targetChange;return o.targetIds&&o.targetIds.length?z.min():o.readTime?Et(o.readTime):z.min()}(e);return this.listener.d_(t,s)}A_(e){const t={};t.database=Kl(this.serializer),t.addTarget=function(r,o){let l;const c=o.target;if(l=$l(c)?{documents:nI(r,c)}:{query:sI(r,c)._t},l.targetId=o.targetId,o.resumeToken.approximateByteSize()>0){l.resumeToken=Ip(r,o.resumeToken);const h=Hl(r,o.expectedCount);h!==null&&(l.expectedCount=h)}else if(o.snapshotVersion.compareTo(z.min())>0){l.readTime=Uo(r,o.snapshotVersion.toTimestamp());const h=Hl(r,o.expectedCount);h!==null&&(l.expectedCount=h)}return l}(this.serializer,e);const s=rI(this.serializer,e);s&&(t.labels=s),this.a_(t)}R_(e){const t={};t.database=Kl(this.serializer),t.removeTarget=e,this.a_(t)}}class WI extends xp{constructor(e,t,s,i,r,o){super(e,"write_stream_connection_backoff","write_stream_idle","health_check_timeout",t,s,i,o),this.serializer=r}get V_(){return this.e_>0}start(){this.lastStreamToken=void 0,super.start()}l_(){this.V_&&this.m_([])}T_(e,t){return this.connection.Bo("Write",e,t)}E_(e){return re(!!e.streamToken),this.lastStreamToken=e.streamToken,re(!e.writeResults||e.writeResults.length===0),this.listener.f_()}onNext(e){re(!!e.streamToken),this.lastStreamToken=e.streamToken,this.t_.reset();const t=tI(e.writeResults,e.commitTime),s=Et(e.commitTime);return this.listener.g_(s,t)}p_(){const e={};e.database=Kl(this.serializer),this.a_(e)}m_(e){const t={streamToken:this.lastStreamToken,writes:e.map(s=>Sp(this.serializer,s))};this.a_(t)}}/**
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
 */class qI extends class{}{constructor(e,t,s,i){super(),this.authCredentials=e,this.appCheckCredentials=t,this.connection=s,this.serializer=i,this.y_=!1}w_(){if(this.y_)throw new V(k.FAILED_PRECONDITION,"The client has already been terminated.")}Mo(e,t,s,i){return this.w_(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([r,o])=>this.connection.Mo(e,Gl(t,s),i,r,o)).catch(r=>{throw r.name==="FirebaseError"?(r.code===k.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),r):new V(k.UNKNOWN,r.toString())})}Lo(e,t,s,i,r){return this.w_(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([o,l])=>this.connection.Lo(e,Gl(t,s),i,o,l,r)).catch(o=>{throw o.name==="FirebaseError"?(o.code===k.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),o):new V(k.UNKNOWN,o.toString())})}terminate(){this.y_=!0,this.connection.terminate()}}class $I{constructor(e,t){this.asyncQueue=e,this.onlineStateHandler=t,this.state="Unknown",this.S_=0,this.b_=null,this.D_=!0}v_(){this.S_===0&&(this.C_("Unknown"),this.b_=this.asyncQueue.enqueueAfterDelay("online_state_timeout",1e4,()=>(this.b_=null,this.F_("Backend didn't respond within 10 seconds."),this.C_("Offline"),Promise.resolve())))}M_(e){this.state==="Online"?this.C_("Unknown"):(this.S_++,this.S_>=1&&(this.x_(),this.F_(`Connection failed 1 times. Most recent error: ${e.toString()}`),this.C_("Offline")))}set(e){this.x_(),this.S_=0,e==="Online"&&(this.D_=!1),this.C_(e)}C_(e){e!==this.state&&(this.state=e,this.onlineStateHandler(e))}F_(e){const t=`Could not reach Cloud Firestore backend. ${e}
This typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;this.D_?(rn(t),this.D_=!1):B("OnlineStateTracker",t)}x_(){this.b_!==null&&(this.b_.cancel(),this.b_=null)}}/**
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
 */class zI{constructor(e,t,s,i,r){this.localStore=e,this.datastore=t,this.asyncQueue=s,this.remoteSyncer={},this.O_=[],this.N_=new Map,this.L_=new Set,this.B_=[],this.k_=r,this.k_._o(o=>{s.enqueueAndForget(async()=>{fs(this)&&(B("RemoteStore","Restarting streams for network reachability change."),await async function(c){const h=Q(c);h.L_.add(4),await Cr(h),h.q_.set("Unknown"),h.L_.delete(4),await ba(h)}(this))})}),this.q_=new $I(s,i)}}async function ba(n){if(fs(n))for(const e of n.B_)await e(!0)}async function Cr(n){for(const e of n.B_)await e(!1)}function Mp(n,e){const t=Q(n);t.N_.has(e.targetId)||(t.N_.set(e.targetId,e),Kc(t)?Gc(t):ii(t).r_()&&Hc(t,e))}function zc(n,e){const t=Q(n),s=ii(t);t.N_.delete(e),s.r_()&&Lp(t,e),t.N_.size===0&&(s.r_()?s.o_():fs(t)&&t.q_.set("Unknown"))}function Hc(n,e){if(n.Q_.xe(e.targetId),e.resumeToken.approximateByteSize()>0||e.snapshotVersion.compareTo(z.min())>0){const t=n.remoteSyncer.getRemoteKeysForTarget(e.targetId).size;e=e.withExpectedCount(t)}ii(n).A_(e)}function Lp(n,e){n.Q_.xe(e),ii(n).R_(e)}function Gc(n){n.Q_=new HT({getRemoteKeysForTarget:e=>n.remoteSyncer.getRemoteKeysForTarget(e),ot:e=>n.N_.get(e)||null,tt:()=>n.datastore.serializer.databaseId}),ii(n).start(),n.q_.v_()}function Kc(n){return fs(n)&&!ii(n).n_()&&n.N_.size>0}function fs(n){return Q(n).L_.size===0}function Op(n){n.Q_=void 0}async function HI(n){n.q_.set("Online")}async function GI(n){n.N_.forEach((e,t)=>{Hc(n,e)})}async function KI(n,e){Op(n),Kc(n)?(n.q_.M_(e),Gc(n)):n.q_.set("Unknown")}async function QI(n,e,t){if(n.q_.set("Online"),e instanceof Tp&&e.state===2&&e.cause)try{await async function(i,r){const o=r.cause;for(const l of r.targetIds)i.N_.has(l)&&(await i.remoteSyncer.rejectListen(l,o),i.N_.delete(l),i.Q_.removeTarget(l))}(n,e)}catch(s){B("RemoteStore","Failed to remove targets %s: %s ",e.targetIds.join(","),s),await Wo(n,s)}else if(e instanceof vo?n.Q_.Ke(e):e instanceof wp?n.Q_.He(e):n.Q_.We(e),!t.isEqual(z.min()))try{const s=await Dp(n.localStore);t.compareTo(s)>=0&&await function(r,o){const l=r.Q_.rt(o);return l.targetChanges.forEach((c,h)=>{if(c.resumeToken.approximateByteSize()>0){const d=r.N_.get(h);d&&r.N_.set(h,d.withResumeToken(c.resumeToken,o))}}),l.targetMismatches.forEach((c,h)=>{const d=r.N_.get(c);if(!d)return;r.N_.set(c,d.withResumeToken(Ye.EMPTY_BYTE_STRING,d.snapshotVersion)),Lp(r,c);const m=new vn(d.target,c,h,d.sequenceNumber);Hc(r,m)}),r.remoteSyncer.applyRemoteEvent(l)}(n,t)}catch(s){B("RemoteStore","Failed to raise snapshot:",s),await Wo(n,s)}}async function Wo(n,e,t){if(!Er(e))throw e;n.L_.add(1),await Cr(n),n.q_.set("Offline"),t||(t=()=>Dp(n.localStore)),n.asyncQueue.enqueueRetryable(async()=>{B("RemoteStore","Retrying IndexedDB access"),await t(),n.L_.delete(1),await ba(n)})}function Vp(n,e){return e().catch(t=>Wo(n,t,e))}async function Ca(n){const e=Q(n),t=Pn(e);let s=e.O_.length>0?e.O_[e.O_.length-1].batchId:-1;for(;YI(e);)try{const i=await xI(e.localStore,s);if(i===null){e.O_.length===0&&t.o_();break}s=i.batchId,XI(e,i)}catch(i){await Wo(e,i)}Fp(e)&&Bp(e)}function YI(n){return fs(n)&&n.O_.length<10}function XI(n,e){n.O_.push(e);const t=Pn(n);t.r_()&&t.V_&&t.m_(e.mutations)}function Fp(n){return fs(n)&&!Pn(n).n_()&&n.O_.length>0}function Bp(n){Pn(n).start()}async function JI(n){Pn(n).p_()}async function ZI(n){const e=Pn(n);for(const t of n.O_)e.m_(t.mutations)}async function e0(n,e,t){const s=n.O_.shift(),i=Fc.from(s,e,t);await Vp(n,()=>n.remoteSyncer.applySuccessfulWrite(i)),await Ca(n)}async function t0(n,e){e&&Pn(n).V_&&await async function(s,i){if(function(o){return vp(o)&&o!==k.ABORTED}(i.code)){const r=s.O_.shift();Pn(s).s_(),await Vp(s,()=>s.remoteSyncer.rejectFailedWrite(r.batchId,i)),await Ca(s)}}(n,e),Fp(n)&&Bp(n)}async function Wd(n,e){const t=Q(n);t.asyncQueue.verifyOperationInProgress(),B("RemoteStore","RemoteStore received new credentials");const s=fs(t);t.L_.add(3),await Cr(t),s&&t.q_.set("Unknown"),await t.remoteSyncer.handleCredentialChange(e),t.L_.delete(3),await ba(t)}async function n0(n,e){const t=Q(n);e?(t.L_.delete(2),await ba(t)):e||(t.L_.add(2),await Cr(t),t.q_.set("Unknown"))}function ii(n){return n.K_||(n.K_=function(t,s,i){const r=Q(t);return r.w_(),new jI(s,r.connection,r.authCredentials,r.appCheckCredentials,r.serializer,i)}(n.datastore,n.asyncQueue,{Eo:HI.bind(null,n),Ro:GI.bind(null,n),mo:KI.bind(null,n),d_:QI.bind(null,n)}),n.B_.push(async e=>{e?(n.K_.s_(),Kc(n)?Gc(n):n.q_.set("Unknown")):(await n.K_.stop(),Op(n))})),n.K_}function Pn(n){return n.U_||(n.U_=function(t,s,i){const r=Q(t);return r.w_(),new WI(s,r.connection,r.authCredentials,r.appCheckCredentials,r.serializer,i)}(n.datastore,n.asyncQueue,{Eo:()=>Promise.resolve(),Ro:JI.bind(null,n),mo:t0.bind(null,n),f_:ZI.bind(null,n),g_:e0.bind(null,n)}),n.B_.push(async e=>{e?(n.U_.s_(),await Ca(n)):(await n.U_.stop(),n.O_.length>0&&(B("RemoteStore",`Stopping write stream with ${n.O_.length} pending writes`),n.O_=[]))})),n.U_}/**
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
 */class Qc{constructor(e,t,s,i,r){this.asyncQueue=e,this.timerId=t,this.targetTimeMs=s,this.op=i,this.removalCallback=r,this.deferred=new Ot,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch(o=>{})}get promise(){return this.deferred.promise}static createAndSchedule(e,t,s,i,r){const o=Date.now()+s,l=new Qc(e,t,o,i,r);return l.start(s),l}start(e){this.timerHandle=setTimeout(()=>this.handleDelayElapsed(),e)}skipDelay(){return this.handleDelayElapsed()}cancel(e){this.timerHandle!==null&&(this.clearTimeout(),this.deferred.reject(new V(k.CANCELLED,"Operation cancelled"+(e?": "+e:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget(()=>this.timerHandle!==null?(this.clearTimeout(),this.op().then(e=>this.deferred.resolve(e))):Promise.resolve())}clearTimeout(){this.timerHandle!==null&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}}function Yc(n,e){if(rn("AsyncQueue",`${e}: ${n}`),Er(n))return new V(k.UNAVAILABLE,`${e}: ${n}`);throw n}/**
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
 */class Ms{constructor(e){this.comparator=e?(t,s)=>e(t,s)||j.comparator(t.key,s.key):(t,s)=>j.comparator(t.key,s.key),this.keyedMap=Oi(),this.sortedSet=new Pe(this.comparator)}static emptySet(e){return new Ms(e.comparator)}has(e){return this.keyedMap.get(e)!=null}get(e){return this.keyedMap.get(e)}first(){return this.sortedSet.minKey()}last(){return this.sortedSet.maxKey()}isEmpty(){return this.sortedSet.isEmpty()}indexOf(e){const t=this.keyedMap.get(e);return t?this.sortedSet.indexOf(t):-1}get size(){return this.sortedSet.size}forEach(e){this.sortedSet.inorderTraversal((t,s)=>(e(t),!1))}add(e){const t=this.delete(e.key);return t.copy(t.keyedMap.insert(e.key,e),t.sortedSet.insert(e,null))}delete(e){const t=this.get(e);return t?this.copy(this.keyedMap.remove(e),this.sortedSet.remove(t)):this}isEqual(e){if(!(e instanceof Ms)||this.size!==e.size)return!1;const t=this.sortedSet.getIterator(),s=e.sortedSet.getIterator();for(;t.hasNext();){const i=t.getNext().key,r=s.getNext().key;if(!i.isEqual(r))return!1}return!0}toString(){const e=[];return this.forEach(t=>{e.push(t.toString())}),e.length===0?"DocumentSet ()":`DocumentSet (
  `+e.join(`  
`)+`
)`}copy(e,t){const s=new Ms;return s.comparator=this.comparator,s.keyedMap=e,s.sortedSet=t,s}}/**
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
 */class qd{constructor(){this.W_=new Pe(j.comparator)}track(e){const t=e.doc.key,s=this.W_.get(t);s?e.type!==0&&s.type===3?this.W_=this.W_.insert(t,e):e.type===3&&s.type!==1?this.W_=this.W_.insert(t,{type:s.type,doc:e.doc}):e.type===2&&s.type===2?this.W_=this.W_.insert(t,{type:2,doc:e.doc}):e.type===2&&s.type===0?this.W_=this.W_.insert(t,{type:0,doc:e.doc}):e.type===1&&s.type===0?this.W_=this.W_.remove(t):e.type===1&&s.type===2?this.W_=this.W_.insert(t,{type:1,doc:s.doc}):e.type===0&&s.type===1?this.W_=this.W_.insert(t,{type:2,doc:e.doc}):q():this.W_=this.W_.insert(t,e)}G_(){const e=[];return this.W_.inorderTraversal((t,s)=>{e.push(s)}),e}}class zs{constructor(e,t,s,i,r,o,l,c,h){this.query=e,this.docs=t,this.oldDocs=s,this.docChanges=i,this.mutatedKeys=r,this.fromCache=o,this.syncStateChanged=l,this.excludesMetadataChanges=c,this.hasCachedResults=h}static fromInitialDocuments(e,t,s,i,r){const o=[];return t.forEach(l=>{o.push({type:0,doc:l})}),new zs(e,t,Ms.emptySet(t),o,s,i,!0,!1,r)}get hasPendingWrites(){return!this.mutatedKeys.isEmpty()}isEqual(e){if(!(this.fromCache===e.fromCache&&this.hasCachedResults===e.hasCachedResults&&this.syncStateChanged===e.syncStateChanged&&this.mutatedKeys.isEqual(e.mutatedKeys)&&ya(this.query,e.query)&&this.docs.isEqual(e.docs)&&this.oldDocs.isEqual(e.oldDocs)))return!1;const t=this.docChanges,s=e.docChanges;if(t.length!==s.length)return!1;for(let i=0;i<t.length;i++)if(t[i].type!==s[i].type||!t[i].doc.isEqual(s[i].doc))return!1;return!0}}/**
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
 */class s0{constructor(){this.z_=void 0,this.j_=[]}H_(){return this.j_.some(e=>e.J_())}}class i0{constructor(){this.queries=$d(),this.onlineState="Unknown",this.Y_=new Set}terminate(){(function(t,s){const i=Q(t),r=i.queries;i.queries=$d(),r.forEach((o,l)=>{for(const c of l.j_)c.onError(s)})})(this,new V(k.ABORTED,"Firestore shutting down"))}}function $d(){return new si(n=>op(n),ya)}async function Up(n,e){const t=Q(n);let s=3;const i=e.query;let r=t.queries.get(i);r?!r.H_()&&e.J_()&&(s=2):(r=new s0,s=e.J_()?0:1);try{switch(s){case 0:r.z_=await t.onListen(i,!0);break;case 1:r.z_=await t.onListen(i,!1);break;case 2:await t.onFirstRemoteStoreListen(i)}}catch(o){const l=Yc(o,`Initialization of query '${Cs(e.query)}' failed`);return void e.onError(l)}t.queries.set(i,r),r.j_.push(e),e.Z_(t.onlineState),r.z_&&e.X_(r.z_)&&Xc(t)}async function jp(n,e){const t=Q(n),s=e.query;let i=3;const r=t.queries.get(s);if(r){const o=r.j_.indexOf(e);o>=0&&(r.j_.splice(o,1),r.j_.length===0?i=e.J_()?0:1:!r.H_()&&e.J_()&&(i=2))}switch(i){case 0:return t.queries.delete(s),t.onUnlisten(s,!0);case 1:return t.queries.delete(s),t.onUnlisten(s,!1);case 2:return t.onLastRemoteStoreUnlisten(s);default:return}}function r0(n,e){const t=Q(n);let s=!1;for(const i of e){const r=i.query,o=t.queries.get(r);if(o){for(const l of o.j_)l.X_(i)&&(s=!0);o.z_=i}}s&&Xc(t)}function o0(n,e,t){const s=Q(n),i=s.queries.get(e);if(i)for(const r of i.j_)r.onError(t);s.queries.delete(e)}function Xc(n){n.Y_.forEach(e=>{e.next()})}var Yl,zd;(zd=Yl||(Yl={})).ea="default",zd.Cache="cache";class Wp{constructor(e,t,s){this.query=e,this.ta=t,this.na=!1,this.ra=null,this.onlineState="Unknown",this.options=s||{}}X_(e){if(!this.options.includeMetadataChanges){const s=[];for(const i of e.docChanges)i.type!==3&&s.push(i);e=new zs(e.query,e.docs,e.oldDocs,s,e.mutatedKeys,e.fromCache,e.syncStateChanged,!0,e.hasCachedResults)}let t=!1;return this.na?this.ia(e)&&(this.ta.next(e),t=!0):this.sa(e,this.onlineState)&&(this.oa(e),t=!0),this.ra=e,t}onError(e){this.ta.error(e)}Z_(e){this.onlineState=e;let t=!1;return this.ra&&!this.na&&this.sa(this.ra,e)&&(this.oa(this.ra),t=!0),t}sa(e,t){if(!e.fromCache||!this.J_())return!0;const s=t!=="Offline";return(!this.options._a||!s)&&(!e.docs.isEmpty()||e.hasCachedResults||t==="Offline")}ia(e){if(e.docChanges.length>0)return!0;const t=this.ra&&this.ra.hasPendingWrites!==e.hasPendingWrites;return!(!e.syncStateChanged&&!t)&&this.options.includeMetadataChanges===!0}oa(e){e=zs.fromInitialDocuments(e.query,e.docs,e.mutatedKeys,e.fromCache,e.hasCachedResults),this.na=!0,this.ta.next(e)}J_(){return this.options.source!==Yl.Cache}}/**
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
 */class qp{constructor(e){this.key=e}}class $p{constructor(e){this.key=e}}class a0{constructor(e,t){this.query=e,this.Ta=t,this.Ea=null,this.hasCachedResults=!1,this.current=!1,this.da=ne(),this.mutatedKeys=ne(),this.Aa=ap(e),this.Ra=new Ms(this.Aa)}get Va(){return this.Ta}ma(e,t){const s=t?t.fa:new qd,i=t?t.Ra:this.Ra;let r=t?t.mutatedKeys:this.mutatedKeys,o=i,l=!1;const c=this.query.limitType==="F"&&i.size===this.query.limit?i.last():null,h=this.query.limitType==="L"&&i.size===this.query.limit?i.first():null;if(e.inorderTraversal((d,m)=>{const p=i.get(d),E=va(this.query,m)?m:null,b=!!p&&this.mutatedKeys.has(p.key),A=!!E&&(E.hasLocalMutations||this.mutatedKeys.has(E.key)&&E.hasCommittedMutations);let P=!1;p&&E?p.data.isEqual(E.data)?b!==A&&(s.track({type:3,doc:E}),P=!0):this.ga(p,E)||(s.track({type:2,doc:E}),P=!0,(c&&this.Aa(E,c)>0||h&&this.Aa(E,h)<0)&&(l=!0)):!p&&E?(s.track({type:0,doc:E}),P=!0):p&&!E&&(s.track({type:1,doc:p}),P=!0,(c||h)&&(l=!0)),P&&(E?(o=o.add(E),r=A?r.add(d):r.delete(d)):(o=o.delete(d),r=r.delete(d)))}),this.query.limit!==null)for(;o.size>this.query.limit;){const d=this.query.limitType==="F"?o.last():o.first();o=o.delete(d.key),r=r.delete(d.key),s.track({type:1,doc:d})}return{Ra:o,fa:s,ns:l,mutatedKeys:r}}ga(e,t){return e.hasLocalMutations&&t.hasCommittedMutations&&!t.hasLocalMutations}applyChanges(e,t,s,i){const r=this.Ra;this.Ra=e.Ra,this.mutatedKeys=e.mutatedKeys;const o=e.fa.G_();o.sort((d,m)=>function(E,b){const A=P=>{switch(P){case 0:return 1;case 2:case 3:return 2;case 1:return 0;default:return q()}};return A(E)-A(b)}(d.type,m.type)||this.Aa(d.doc,m.doc)),this.pa(s),i=i!=null&&i;const l=t&&!i?this.ya():[],c=this.da.size===0&&this.current&&!i?1:0,h=c!==this.Ea;return this.Ea=c,o.length!==0||h?{snapshot:new zs(this.query,e.Ra,r,o,e.mutatedKeys,c===0,h,!1,!!s&&s.resumeToken.approximateByteSize()>0),wa:l}:{wa:l}}Z_(e){return this.current&&e==="Offline"?(this.current=!1,this.applyChanges({Ra:this.Ra,fa:new qd,mutatedKeys:this.mutatedKeys,ns:!1},!1)):{wa:[]}}Sa(e){return!this.Ta.has(e)&&!!this.Ra.has(e)&&!this.Ra.get(e).hasLocalMutations}pa(e){e&&(e.addedDocuments.forEach(t=>this.Ta=this.Ta.add(t)),e.modifiedDocuments.forEach(t=>{}),e.removedDocuments.forEach(t=>this.Ta=this.Ta.delete(t)),this.current=e.current)}ya(){if(!this.current)return[];const e=this.da;this.da=ne(),this.Ra.forEach(s=>{this.Sa(s.key)&&(this.da=this.da.add(s.key))});const t=[];return e.forEach(s=>{this.da.has(s)||t.push(new $p(s))}),this.da.forEach(s=>{e.has(s)||t.push(new qp(s))}),t}ba(e){this.Ta=e.Ts,this.da=ne();const t=this.ma(e.documents);return this.applyChanges(t,!0)}Da(){return zs.fromInitialDocuments(this.query,this.Ra,this.mutatedKeys,this.Ea===0,this.hasCachedResults)}}class l0{constructor(e,t,s){this.query=e,this.targetId=t,this.view=s}}class c0{constructor(e){this.key=e,this.va=!1}}class h0{constructor(e,t,s,i,r,o){this.localStore=e,this.remoteStore=t,this.eventManager=s,this.sharedClientState=i,this.currentUser=r,this.maxConcurrentLimboResolutions=o,this.Ca={},this.Fa=new si(l=>op(l),ya),this.Ma=new Map,this.xa=new Set,this.Oa=new Pe(j.comparator),this.Na=new Map,this.La=new jc,this.Ba={},this.ka=new Map,this.qa=$s.kn(),this.onlineState="Unknown",this.Qa=void 0}get isPrimaryClient(){return this.Qa===!0}}async function u0(n,e,t=!0){const s=Yp(n);let i;const r=s.Fa.get(e);return r?(s.sharedClientState.addLocalQueryTarget(r.targetId),i=r.view.Da()):i=await zp(s,e,t,!0),i}async function d0(n,e){const t=Yp(n);await zp(t,e,!0,!1)}async function zp(n,e,t,s){const i=await MI(n.localStore,Vt(e)),r=i.targetId,o=n.sharedClientState.addLocalQueryTarget(r,t);let l;return s&&(l=await f0(n,e,r,o==="current",i.resumeToken)),n.isPrimaryClient&&t&&Mp(n.remoteStore,i),l}async function f0(n,e,t,s,i){n.Ka=(m,p,E)=>async function(A,P,F,U){let O=P.view.ma(F);O.ns&&(O=await Bd(A.localStore,P.query,!1).then(({documents:I})=>P.view.ma(I,O)));const Y=U&&U.targetChanges.get(P.targetId),oe=U&&U.targetMismatches.get(P.targetId)!=null,ee=P.view.applyChanges(O,A.isPrimaryClient,Y,oe);return Gd(A,P.targetId,ee.wa),ee.snapshot}(n,m,p,E);const r=await Bd(n.localStore,e,!0),o=new a0(e,r.Ts),l=o.ma(r.documents),c=br.createSynthesizedTargetChangeForCurrentChange(t,s&&n.onlineState!=="Offline",i),h=o.applyChanges(l,n.isPrimaryClient,c);Gd(n,t,h.wa);const d=new l0(e,t,o);return n.Fa.set(e,d),n.Ma.has(t)?n.Ma.get(t).push(e):n.Ma.set(t,[e]),h.snapshot}async function m0(n,e,t){const s=Q(n),i=s.Fa.get(e),r=s.Ma.get(i.targetId);if(r.length>1)return s.Ma.set(i.targetId,r.filter(o=>!ya(o,e))),void s.Fa.delete(e);s.isPrimaryClient?(s.sharedClientState.removeLocalQueryTarget(i.targetId),s.sharedClientState.isActiveQueryTarget(i.targetId)||await Ql(s.localStore,i.targetId,!1).then(()=>{s.sharedClientState.clearQueryState(i.targetId),t&&zc(s.remoteStore,i.targetId),Xl(s,i.targetId)}).catch(vr)):(Xl(s,i.targetId),await Ql(s.localStore,i.targetId,!0))}async function p0(n,e){const t=Q(n),s=t.Fa.get(e),i=t.Ma.get(s.targetId);t.isPrimaryClient&&i.length===1&&(t.sharedClientState.removeLocalQueryTarget(s.targetId),zc(t.remoteStore,s.targetId))}async function g0(n,e,t){const s=I0(n);try{const i=await function(o,l){const c=Q(o),h=Me.now(),d=l.reduce((E,b)=>E.add(b.key),ne());let m,p;return c.persistence.runTransaction("Locally write mutations","readwrite",E=>{let b=on(),A=ne();return c.cs.getEntries(E,d).next(P=>{b=P,b.forEach((F,U)=>{U.isValidDocument()||(A=A.add(F))})}).next(()=>c.localDocuments.getOverlayedDocuments(E,b)).next(P=>{m=P;const F=[];for(const U of l){const O=UT(U,m.get(U.key).overlayedDocument);O!=null&&F.push(new On(U.key,O,Jm(O.value.mapValue),ut.exists(!0)))}return c.mutationQueue.addMutationBatch(E,h,F,l)}).next(P=>{p=P;const F=P.applyToLocalDocumentSet(m,A);return c.documentOverlayCache.saveOverlays(E,P.batchId,F)})}).then(()=>({batchId:p.batchId,changes:cp(m)}))}(s.localStore,e);s.sharedClientState.addPendingMutation(i.batchId),function(o,l,c){let h=o.Ba[o.currentUser.toKey()];h||(h=new Pe(le)),h=h.insert(l,c),o.Ba[o.currentUser.toKey()]=h}(s,i.batchId,t),await Rr(s,i.changes),await Ca(s.remoteStore)}catch(i){const r=Yc(i,"Failed to persist write");t.reject(r)}}async function Hp(n,e){const t=Q(n);try{const s=await NI(t.localStore,e);e.targetChanges.forEach((i,r)=>{const o=t.Na.get(r);o&&(re(i.addedDocuments.size+i.modifiedDocuments.size+i.removedDocuments.size<=1),i.addedDocuments.size>0?o.va=!0:i.modifiedDocuments.size>0?re(o.va):i.removedDocuments.size>0&&(re(o.va),o.va=!1))}),await Rr(t,s,e)}catch(s){await vr(s)}}function Hd(n,e,t){const s=Q(n);if(s.isPrimaryClient&&t===0||!s.isPrimaryClient&&t===1){const i=[];s.Fa.forEach((r,o)=>{const l=o.view.Z_(e);l.snapshot&&i.push(l.snapshot)}),function(o,l){const c=Q(o);c.onlineState=l;let h=!1;c.queries.forEach((d,m)=>{for(const p of m.j_)p.Z_(l)&&(h=!0)}),h&&Xc(c)}(s.eventManager,e),i.length&&s.Ca.d_(i),s.onlineState=e,s.isPrimaryClient&&s.sharedClientState.setOnlineState(e)}}async function _0(n,e,t){const s=Q(n);s.sharedClientState.updateQueryState(e,"rejected",t);const i=s.Na.get(e),r=i&&i.key;if(r){let o=new Pe(j.comparator);o=o.insert(r,Ue.newNoDocument(r,z.min()));const l=ne().add(r),c=new Ta(z.min(),new Map,new Pe(le),o,l);await Hp(s,c),s.Oa=s.Oa.remove(r),s.Na.delete(e),Jc(s)}else await Ql(s.localStore,e,!1).then(()=>Xl(s,e,t)).catch(vr)}async function y0(n,e){const t=Q(n),s=e.batch.batchId;try{const i=await PI(t.localStore,e);Kp(t,s,null),Gp(t,s),t.sharedClientState.updateMutationState(s,"acknowledged"),await Rr(t,i)}catch(i){await vr(i)}}async function v0(n,e,t){const s=Q(n);try{const i=await function(o,l){const c=Q(o);return c.persistence.runTransaction("Reject batch","readwrite-primary",h=>{let d;return c.mutationQueue.lookupMutationBatch(h,l).next(m=>(re(m!==null),d=m.keys(),c.mutationQueue.removeMutationBatch(h,m))).next(()=>c.mutationQueue.performConsistencyCheck(h)).next(()=>c.documentOverlayCache.removeOverlaysForBatchId(h,d,l)).next(()=>c.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(h,d)).next(()=>c.localDocuments.getDocuments(h,d))})}(s.localStore,e);Kp(s,e,t),Gp(s,e),s.sharedClientState.updateMutationState(e,"rejected",t),await Rr(s,i)}catch(i){await vr(i)}}function Gp(n,e){(n.ka.get(e)||[]).forEach(t=>{t.resolve()}),n.ka.delete(e)}function Kp(n,e,t){const s=Q(n);let i=s.Ba[s.currentUser.toKey()];if(i){const r=i.get(e);r&&(t?r.reject(t):r.resolve(),i=i.remove(e)),s.Ba[s.currentUser.toKey()]=i}}function Xl(n,e,t=null){n.sharedClientState.removeLocalQueryTarget(e);for(const s of n.Ma.get(e))n.Fa.delete(s),t&&n.Ca.$a(s,t);n.Ma.delete(e),n.isPrimaryClient&&n.La.gr(e).forEach(s=>{n.La.containsKey(s)||Qp(n,s)})}function Qp(n,e){n.xa.delete(e.path.canonicalString());const t=n.Oa.get(e);t!==null&&(zc(n.remoteStore,t),n.Oa=n.Oa.remove(e),n.Na.delete(t),Jc(n))}function Gd(n,e,t){for(const s of t)s instanceof qp?(n.La.addReference(s.key,e),E0(n,s)):s instanceof $p?(B("SyncEngine","Document no longer in limbo: "+s.key),n.La.removeReference(s.key,e),n.La.containsKey(s.key)||Qp(n,s.key)):q()}function E0(n,e){const t=e.key,s=t.path.canonicalString();n.Oa.get(t)||n.xa.has(s)||(B("SyncEngine","New document in limbo: "+t),n.xa.add(s),Jc(n))}function Jc(n){for(;n.xa.size>0&&n.Oa.size<n.maxConcurrentLimboResolutions;){const e=n.xa.values().next().value;n.xa.delete(e);const t=new j(ge.fromString(e)),s=n.qa.next();n.Na.set(s,new c0(t)),n.Oa=n.Oa.insert(t,s),Mp(n.remoteStore,new vn(Vt(Lc(t.path)),s,"TargetPurposeLimboResolution",kc.oe))}}async function Rr(n,e,t){const s=Q(n),i=[],r=[],o=[];s.Fa.isEmpty()||(s.Fa.forEach((l,c)=>{o.push(s.Ka(c,e,t).then(h=>{var d;if((h||t)&&s.isPrimaryClient){const m=h?!h.fromCache:(d=t==null?void 0:t.targetChanges.get(c.targetId))===null||d===void 0?void 0:d.current;s.sharedClientState.updateQueryState(c.targetId,m?"current":"not-current")}if(h){i.push(h);const m=qc.Wi(c.targetId,h);r.push(m)}}))}),await Promise.all(o),s.Ca.d_(i),await async function(c,h){const d=Q(c);try{await d.persistence.runTransaction("notifyLocalViewChanges","readwrite",m=>N.forEach(h,p=>N.forEach(p.$i,E=>d.persistence.referenceDelegate.addReference(m,p.targetId,E)).next(()=>N.forEach(p.Ui,E=>d.persistence.referenceDelegate.removeReference(m,p.targetId,E)))))}catch(m){if(!Er(m))throw m;B("LocalStore","Failed to update sequence numbers: "+m)}for(const m of h){const p=m.targetId;if(!m.fromCache){const E=d.os.get(p),b=E.snapshotVersion,A=E.withLastLimboFreeSnapshotVersion(b);d.os=d.os.insert(p,A)}}}(s.localStore,r))}async function w0(n,e){const t=Q(n);if(!t.currentUser.isEqual(e)){B("SyncEngine","User change. New user:",e.toKey());const s=await Np(t.localStore,e);t.currentUser=e,function(r,o){r.ka.forEach(l=>{l.forEach(c=>{c.reject(new V(k.CANCELLED,o))})}),r.ka.clear()}(t,"'waitForPendingWrites' promise is rejected due to a user change."),t.sharedClientState.handleUserChange(e,s.removedBatchIds,s.addedBatchIds),await Rr(t,s.hs)}}function T0(n,e){const t=Q(n),s=t.Na.get(e);if(s&&s.va)return ne().add(s.key);{let i=ne();const r=t.Ma.get(e);if(!r)return i;for(const o of r){const l=t.Fa.get(o);i=i.unionWith(l.view.Va)}return i}}function Yp(n){const e=Q(n);return e.remoteStore.remoteSyncer.applyRemoteEvent=Hp.bind(null,e),e.remoteStore.remoteSyncer.getRemoteKeysForTarget=T0.bind(null,e),e.remoteStore.remoteSyncer.rejectListen=_0.bind(null,e),e.Ca.d_=r0.bind(null,e.eventManager),e.Ca.$a=o0.bind(null,e.eventManager),e}function I0(n){const e=Q(n);return e.remoteStore.remoteSyncer.applySuccessfulWrite=y0.bind(null,e),e.remoteStore.remoteSyncer.rejectFailedWrite=v0.bind(null,e),e}class qo{constructor(){this.kind="memory",this.synchronizeTabs=!1}async initialize(e){this.serializer=Ia(e.databaseInfo.databaseId),this.sharedClientState=this.Wa(e),this.persistence=this.Ga(e),await this.persistence.start(),this.localStore=this.za(e),this.gcScheduler=this.ja(e,this.localStore),this.indexBackfillerScheduler=this.Ha(e,this.localStore)}ja(e,t){return null}Ha(e,t){return null}za(e){return kI(this.persistence,new SI,e.initialUser,this.serializer)}Ga(e){return new bI(Wc.Zr,this.serializer)}Wa(e){return new OI}async terminate(){var e,t;(e=this.gcScheduler)===null||e===void 0||e.stop(),(t=this.indexBackfillerScheduler)===null||t===void 0||t.stop(),this.sharedClientState.shutdown(),await this.persistence.shutdown()}}qo.provider={build:()=>new qo};class Jl{async initialize(e,t){this.localStore||(this.localStore=e.localStore,this.sharedClientState=e.sharedClientState,this.datastore=this.createDatastore(t),this.remoteStore=this.createRemoteStore(t),this.eventManager=this.createEventManager(t),this.syncEngine=this.createSyncEngine(t,!e.synchronizeTabs),this.sharedClientState.onlineStateHandler=s=>Hd(this.syncEngine,s,1),this.remoteStore.remoteSyncer.handleCredentialChange=w0.bind(null,this.syncEngine),await n0(this.remoteStore,this.syncEngine.isPrimaryClient))}createEventManager(e){return function(){return new i0}()}createDatastore(e){const t=Ia(e.databaseInfo.databaseId),s=function(r){return new UI(r)}(e.databaseInfo);return function(r,o,l,c){return new qI(r,o,l,c)}(e.authCredentials,e.appCheckCredentials,s,t)}createRemoteStore(e){return function(s,i,r,o,l){return new zI(s,i,r,o,l)}(this.localStore,this.datastore,e.asyncQueue,t=>Hd(this.syncEngine,t,0),function(){return jd.D()?new jd:new VI}())}createSyncEngine(e,t){return function(i,r,o,l,c,h,d){const m=new h0(i,r,o,l,c,h);return d&&(m.Qa=!0),m}(this.localStore,this.remoteStore,this.eventManager,this.sharedClientState,e.initialUser,e.maxConcurrentLimboResolutions,t)}async terminate(){var e,t;await async function(i){const r=Q(i);B("RemoteStore","RemoteStore shutting down."),r.L_.add(5),await Cr(r),r.k_.shutdown(),r.q_.set("Unknown")}(this.remoteStore),(e=this.datastore)===null||e===void 0||e.terminate(),(t=this.eventManager)===null||t===void 0||t.terminate()}}Jl.provider={build:()=>new Jl};/**
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
 */class Xp{constructor(e){this.observer=e,this.muted=!1}next(e){this.muted||this.observer.next&&this.Ya(this.observer.next,e)}error(e){this.muted||(this.observer.error?this.Ya(this.observer.error,e):rn("Uncaught Error in snapshot listener:",e.toString()))}Za(){this.muted=!0}Ya(e,t){setTimeout(()=>{this.muted||e(t)},0)}}/**
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
 */class b0{constructor(e){this.datastore=e,this.readVersions=new Map,this.mutations=[],this.committed=!1,this.lastTransactionError=null,this.writtenDocs=new Set}async lookup(e){if(this.ensureCommitNotCalled(),this.mutations.length>0)throw this.lastTransactionError=new V(k.INVALID_ARGUMENT,"Firestore transactions require all reads to be executed before all writes."),this.lastTransactionError;const t=await async function(i,r){const o=Q(i),l={documents:r.map(m=>jo(o.serializer,m))},c=await o.Lo("BatchGetDocuments",o.serializer.databaseId,ge.emptyPath(),l,r.length),h=new Map;c.forEach(m=>{const p=ZT(o.serializer,m);h.set(p.key.toString(),p)});const d=[];return r.forEach(m=>{const p=h.get(m.toString());re(!!p),d.push(p)}),d}(this.datastore,e);return t.forEach(s=>this.recordVersion(s)),t}set(e,t){this.write(t.toMutation(e,this.precondition(e))),this.writtenDocs.add(e.toString())}update(e,t){try{this.write(t.toMutation(e,this.preconditionForUpdate(e)))}catch(s){this.lastTransactionError=s}this.writtenDocs.add(e.toString())}delete(e){this.write(new Vc(e,this.precondition(e))),this.writtenDocs.add(e.toString())}async commit(){if(this.ensureCommitNotCalled(),this.lastTransactionError)throw this.lastTransactionError;const e=this.readVersions;this.mutations.forEach(t=>{e.delete(t.key.toString())}),e.forEach((t,s)=>{const i=j.fromPath(s);this.mutations.push(new yp(i,this.precondition(i)))}),await async function(s,i){const r=Q(s),o={writes:i.map(l=>Sp(r.serializer,l))};await r.Mo("Commit",r.serializer.databaseId,ge.emptyPath(),o)}(this.datastore,this.mutations),this.committed=!0}recordVersion(e){let t;if(e.isFoundDocument())t=e.version;else{if(!e.isNoDocument())throw q();t=z.min()}const s=this.readVersions.get(e.key.toString());if(s){if(!t.isEqual(s))throw new V(k.ABORTED,"Document version changed between two reads.")}else this.readVersions.set(e.key.toString(),t)}precondition(e){const t=this.readVersions.get(e.toString());return!this.writtenDocs.has(e.toString())&&t?t.isEqual(z.min())?ut.exists(!1):ut.updateTime(t):ut.none()}preconditionForUpdate(e){const t=this.readVersions.get(e.toString());if(!this.writtenDocs.has(e.toString())&&t){if(t.isEqual(z.min()))throw new V(k.INVALID_ARGUMENT,"Can't update a document that doesn't exist.");return ut.updateTime(t)}return ut.exists(!0)}write(e){this.ensureCommitNotCalled(),this.mutations.push(e)}ensureCommitNotCalled(){}}/**
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
 */class C0{constructor(e,t,s,i,r){this.asyncQueue=e,this.datastore=t,this.options=s,this.updateFunction=i,this.deferred=r,this._u=s.maxAttempts,this.t_=new $c(this.asyncQueue,"transaction_retry")}au(){this._u-=1,this.uu()}uu(){this.t_.Go(async()=>{const e=new b0(this.datastore),t=this.cu(e);t&&t.then(s=>{this.asyncQueue.enqueueAndForget(()=>e.commit().then(()=>{this.deferred.resolve(s)}).catch(i=>{this.lu(i)}))}).catch(s=>{this.lu(s)})})}cu(e){try{const t=this.updateFunction(e);return!wr(t)&&t.catch&&t.then?t:(this.deferred.reject(Error("Transaction callback must return a Promise")),null)}catch(t){return this.deferred.reject(t),null}}lu(e){this._u>0&&this.hu(e)?(this._u-=1,this.asyncQueue.enqueueAndForget(()=>(this.uu(),Promise.resolve()))):this.deferred.reject(e)}hu(e){if(e.name==="FirebaseError"){const t=e.code;return t==="aborted"||t==="failed-precondition"||t==="already-exists"||!vp(t)}return!1}}/**
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
 */class R0{constructor(e,t,s,i,r){this.authCredentials=e,this.appCheckCredentials=t,this.asyncQueue=s,this.databaseInfo=i,this.user=nt.UNAUTHENTICATED,this.clientId=Qm.newId(),this.authCredentialListener=()=>Promise.resolve(),this.appCheckCredentialListener=()=>Promise.resolve(),this._uninitializedComponentsProvider=r,this.authCredentials.start(s,async o=>{B("FirestoreClient","Received user=",o.uid),await this.authCredentialListener(o),this.user=o}),this.appCheckCredentials.start(s,o=>(B("FirestoreClient","Received new app check token=",o),this.appCheckCredentialListener(o,this.user)))}get configuration(){return{asyncQueue:this.asyncQueue,databaseInfo:this.databaseInfo,clientId:this.clientId,authCredentials:this.authCredentials,appCheckCredentials:this.appCheckCredentials,initialUser:this.user,maxConcurrentLimboResolutions:100}}setCredentialChangeListener(e){this.authCredentialListener=e}setAppCheckTokenChangeListener(e){this.appCheckCredentialListener=e}terminate(){this.asyncQueue.enterRestrictedMode();const e=new Ot;return this.asyncQueue.enqueueAndForgetEvenWhileRestricted(async()=>{try{this._onlineComponents&&await this._onlineComponents.terminate(),this._offlineComponents&&await this._offlineComponents.terminate(),this.authCredentials.shutdown(),this.appCheckCredentials.shutdown(),e.resolve()}catch(t){const s=Yc(t,"Failed to shutdown persistence");e.reject(s)}}),e.promise}}async function vl(n,e){n.asyncQueue.verifyOperationInProgress(),B("FirestoreClient","Initializing OfflineComponentProvider");const t=n.configuration;await e.initialize(t);let s=t.initialUser;n.setCredentialChangeListener(async i=>{s.isEqual(i)||(await Np(e.localStore,i),s=i)}),e.persistence.setDatabaseDeletedListener(()=>n.terminate()),n._offlineComponents=e}async function Kd(n,e){n.asyncQueue.verifyOperationInProgress();const t=await S0(n);B("FirestoreClient","Initializing OnlineComponentProvider"),await e.initialize(t,n.configuration),n.setCredentialChangeListener(s=>Wd(e.remoteStore,s)),n.setAppCheckTokenChangeListener((s,i)=>Wd(e.remoteStore,i)),n._onlineComponents=e}async function S0(n){if(!n._offlineComponents)if(n._uninitializedComponentsProvider){B("FirestoreClient","Using user provided OfflineComponentProvider");try{await vl(n,n._uninitializedComponentsProvider._offline)}catch(e){const t=e;if(!function(i){return i.name==="FirebaseError"?i.code===k.FAILED_PRECONDITION||i.code===k.UNIMPLEMENTED:!(typeof DOMException<"u"&&i instanceof DOMException)||i.code===22||i.code===20||i.code===11}(t))throw t;Us("Error using user provided cache. Falling back to memory cache: "+t),await vl(n,new qo)}}else B("FirestoreClient","Using default OfflineComponentProvider"),await vl(n,new qo);return n._offlineComponents}async function Zc(n){return n._onlineComponents||(n._uninitializedComponentsProvider?(B("FirestoreClient","Using user provided OnlineComponentProvider"),await Kd(n,n._uninitializedComponentsProvider._online)):(B("FirestoreClient","Using default OnlineComponentProvider"),await Kd(n,new Jl))),n._onlineComponents}function A0(n){return Zc(n).then(e=>e.syncEngine)}function k0(n){return Zc(n).then(e=>e.datastore)}async function Jp(n){const e=await Zc(n),t=e.eventManager;return t.onListen=u0.bind(null,e.syncEngine),t.onUnlisten=m0.bind(null,e.syncEngine),t.onFirstRemoteStoreListen=d0.bind(null,e.syncEngine),t.onLastRemoteStoreUnlisten=p0.bind(null,e.syncEngine),t}function P0(n,e,t={}){const s=new Ot;return n.asyncQueue.enqueueAndForget(async()=>function(r,o,l,c,h){const d=new Xp({next:p=>{d.Za(),o.enqueueAndForget(()=>jp(r,m));const E=p.docs.has(l);!E&&p.fromCache?h.reject(new V(k.UNAVAILABLE,"Failed to get document because the client is offline.")):E&&p.fromCache&&c&&c.source==="server"?h.reject(new V(k.UNAVAILABLE,'Failed to get document from server. (However, this document does exist in the local cache. Run again without setting source to "server" to retrieve the cached document.)')):h.resolve(p)},error:p=>h.reject(p)}),m=new Wp(Lc(l.path),d,{includeMetadataChanges:!0,_a:!0});return Up(r,m)}(await Jp(n),n.asyncQueue,e,t,s)),s.promise}function N0(n,e,t={}){const s=new Ot;return n.asyncQueue.enqueueAndForget(async()=>function(r,o,l,c,h){const d=new Xp({next:p=>{d.Za(),o.enqueueAndForget(()=>jp(r,m)),p.fromCache&&c.source==="server"?h.reject(new V(k.UNAVAILABLE,'Failed to get documents from server. (However, these documents may exist in the local cache. Run again without setting source to "server" to retrieve the cached documents.)')):h.resolve(p)},error:p=>h.reject(p)}),m=new Wp(l,d,{includeMetadataChanges:!0,_a:!0});return Up(r,m)}(await Jp(n),n.asyncQueue,e,t,s)),s.promise}/**
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
 */function Zp(n){const e={};return n.timeoutSeconds!==void 0&&(e.timeoutSeconds=n.timeoutSeconds),e}/**
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
 */const Qd=new Map;/**
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
 */function eg(n,e,t){if(!t)throw new V(k.INVALID_ARGUMENT,`Function ${n}() cannot be called with an empty ${e}.`)}function D0(n,e,t,s){if(e===!0&&s===!0)throw new V(k.INVALID_ARGUMENT,`${n} and ${t} cannot be used together.`)}function Yd(n){if(!j.isDocumentKey(n))throw new V(k.INVALID_ARGUMENT,`Invalid document reference. Document references must have an even number of segments, but ${n} has ${n.length}.`)}function Xd(n){if(j.isDocumentKey(n))throw new V(k.INVALID_ARGUMENT,`Invalid collection reference. Collection references must have an odd number of segments, but ${n} has ${n.length}.`)}function Ra(n){if(n===void 0)return"undefined";if(n===null)return"null";if(typeof n=="string")return n.length>20&&(n=`${n.substring(0,20)}...`),JSON.stringify(n);if(typeof n=="number"||typeof n=="boolean")return""+n;if(typeof n=="object"){if(n instanceof Array)return"an array";{const e=function(s){return s.constructor?s.constructor.name:null}(n);return e?`a custom ${e} object`:"an object"}}return typeof n=="function"?"a function":q()}function Ut(n,e){if("_delegate"in n&&(n=n._delegate),!(n instanceof e)){if(e.name===n.constructor.name)throw new V(k.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{const t=Ra(n);throw new V(k.INVALID_ARGUMENT,`Expected type '${e.name}', but it was: ${t}`)}}return n}/**
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
 */class Jd{constructor(e){var t,s;if(e.host===void 0){if(e.ssl!==void 0)throw new V(k.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host="firestore.googleapis.com",this.ssl=!0}else this.host=e.host,this.ssl=(t=e.ssl)===null||t===void 0||t;if(this.credentials=e.credentials,this.ignoreUndefinedProperties=!!e.ignoreUndefinedProperties,this.localCache=e.localCache,e.cacheSizeBytes===void 0)this.cacheSizeBytes=41943040;else{if(e.cacheSizeBytes!==-1&&e.cacheSizeBytes<1048576)throw new V(k.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=e.cacheSizeBytes}D0("experimentalForceLongPolling",e.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",e.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!e.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:e.experimentalAutoDetectLongPolling===void 0?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!e.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=Zp((s=e.experimentalLongPollingOptions)!==null&&s!==void 0?s:{}),function(r){if(r.timeoutSeconds!==void 0){if(isNaN(r.timeoutSeconds))throw new V(k.INVALID_ARGUMENT,`invalid long polling timeout: ${r.timeoutSeconds} (must not be NaN)`);if(r.timeoutSeconds<5)throw new V(k.INVALID_ARGUMENT,`invalid long polling timeout: ${r.timeoutSeconds} (minimum allowed value is 5)`);if(r.timeoutSeconds>30)throw new V(k.INVALID_ARGUMENT,`invalid long polling timeout: ${r.timeoutSeconds} (maximum allowed value is 30)`)}}(this.experimentalLongPollingOptions),this.useFetchStreams=!!e.useFetchStreams}isEqual(e){return this.host===e.host&&this.ssl===e.ssl&&this.credentials===e.credentials&&this.cacheSizeBytes===e.cacheSizeBytes&&this.experimentalForceLongPolling===e.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===e.experimentalAutoDetectLongPolling&&function(s,i){return s.timeoutSeconds===i.timeoutSeconds}(this.experimentalLongPollingOptions,e.experimentalLongPollingOptions)&&this.ignoreUndefinedProperties===e.ignoreUndefinedProperties&&this.useFetchStreams===e.useFetchStreams}}class Sa{constructor(e,t,s,i){this._authCredentials=e,this._appCheckCredentials=t,this._databaseId=s,this._app=i,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new Jd({}),this._settingsFrozen=!1,this._terminateTask="notTerminated"}get app(){if(!this._app)throw new V(k.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return this._terminateTask!=="notTerminated"}_setSettings(e){if(this._settingsFrozen)throw new V(k.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new Jd(e),e.credentials!==void 0&&(this._authCredentials=function(s){if(!s)return new Qw;switch(s.type){case"firstParty":return new Zw(s.sessionIndex||"0",s.iamToken||null,s.authTokenFactory||null);case"provider":return s.client;default:throw new V(k.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}}(e.credentials))}_getSettings(){return this._settings}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask==="notTerminated"&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){this._terminateTask==="notTerminated"?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return function(t){const s=Qd.get(t);s&&(B("ComponentProvider","Removing Datastore"),Qd.delete(t),s.terminate())}(this),Promise.resolve()}}function x0(n,e,t,s={}){var i;const r=(n=Ut(n,Sa))._getSettings(),o=`${e}:${t}`;if(r.host!=="firestore.googleapis.com"&&r.host!==o&&Us("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used."),n._setSettings(Object.assign(Object.assign({},r),{host:o,ssl:!1})),s.mockUserToken){let l,c;if(typeof s.mockUserToken=="string")l=s.mockUserToken,c=nt.MOCK_USER;else{l=nm(s.mockUserToken,(i=n._app)===null||i===void 0?void 0:i.options.projectId);const h=s.mockUserToken.sub||s.mockUserToken.user_id;if(!h)throw new V(k.INVALID_ARGUMENT,"mockUserToken must contain 'sub' or 'user_id' field!");c=new nt(h)}n._authCredentials=new Yw(new Km(l,c))}}/**
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
 */class ms{constructor(e,t,s){this.converter=t,this._query=s,this.type="query",this.firestore=e}withConverter(e){return new ms(this.firestore,e,this._query)}}class it{constructor(e,t,s){this.converter=t,this._key=s,this.type="document",this.firestore=e}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new bn(this.firestore,this.converter,this._key.path.popLast())}withConverter(e){return new it(this.firestore,e,this._key)}}class bn extends ms{constructor(e,t,s){super(e,t,Lc(s)),this._path=s,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){const e=this._path.popLast();return e.isEmpty()?null:new it(this.firestore,null,new j(e))}withConverter(e){return new bn(this.firestore,e,this._path)}}function lo(n,e,...t){if(n=de(n),eg("collection","path",e),n instanceof Sa){const s=ge.fromString(e,...t);return Xd(s),new bn(n,null,s)}{if(!(n instanceof it||n instanceof bn))throw new V(k.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const s=n._path.child(ge.fromString(e,...t));return Xd(s),new bn(n.firestore,null,s)}}function Ht(n,e,...t){if(n=de(n),arguments.length===1&&(e=Qm.newId()),eg("doc","path",e),n instanceof Sa){const s=ge.fromString(e,...t);return Yd(s),new it(n,null,new j(s))}{if(!(n instanceof it||n instanceof bn))throw new V(k.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const s=n._path.child(ge.fromString(e,...t));return Yd(s),new it(n.firestore,n instanceof bn?n.converter:null,new j(s))}}/**
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
 */class Zd{constructor(e=Promise.resolve()){this.Pu=[],this.Iu=!1,this.Tu=[],this.Eu=null,this.du=!1,this.Au=!1,this.Ru=[],this.t_=new $c(this,"async_queue_retry"),this.Vu=()=>{const s=yl();s&&B("AsyncQueue","Visibility state changed to "+s.visibilityState),this.t_.jo()},this.mu=e;const t=yl();t&&typeof t.addEventListener=="function"&&t.addEventListener("visibilitychange",this.Vu)}get isShuttingDown(){return this.Iu}enqueueAndForget(e){this.enqueue(e)}enqueueAndForgetEvenWhileRestricted(e){this.fu(),this.gu(e)}enterRestrictedMode(e){if(!this.Iu){this.Iu=!0,this.Au=e||!1;const t=yl();t&&typeof t.removeEventListener=="function"&&t.removeEventListener("visibilitychange",this.Vu)}}enqueue(e){if(this.fu(),this.Iu)return new Promise(()=>{});const t=new Ot;return this.gu(()=>this.Iu&&this.Au?Promise.resolve():(e().then(t.resolve,t.reject),t.promise)).then(()=>t.promise)}enqueueRetryable(e){this.enqueueAndForget(()=>(this.Pu.push(e),this.pu()))}async pu(){if(this.Pu.length!==0){try{await this.Pu[0](),this.Pu.shift(),this.t_.reset()}catch(e){if(!Er(e))throw e;B("AsyncQueue","Operation failed with retryable error: "+e)}this.Pu.length>0&&this.t_.Go(()=>this.pu())}}gu(e){const t=this.mu.then(()=>(this.du=!0,e().catch(s=>{this.Eu=s,this.du=!1;const i=function(o){let l=o.message||"";return o.stack&&(l=o.stack.includes(o.message)?o.stack:o.message+`
`+o.stack),l}(s);throw rn("INTERNAL UNHANDLED ERROR: ",i),s}).then(s=>(this.du=!1,s))));return this.mu=t,t}enqueueAfterDelay(e,t,s){this.fu(),this.Ru.indexOf(e)>-1&&(t=0);const i=Qc.createAndSchedule(this,e,t,s,r=>this.yu(r));return this.Tu.push(i),i}fu(){this.Eu&&q()}verifyOperationInProgress(){}async wu(){let e;do e=this.mu,await e;while(e!==this.mu)}Su(e){for(const t of this.Tu)if(t.timerId===e)return!0;return!1}bu(e){return this.wu().then(()=>{this.Tu.sort((t,s)=>t.targetTimeMs-s.targetTimeMs);for(const t of this.Tu)if(t.skipDelay(),e!=="all"&&t.timerId===e)break;return this.wu()})}Du(e){this.Ru.push(e)}yu(e){const t=this.Tu.indexOf(e);this.Tu.splice(t,1)}}class ri extends Sa{constructor(e,t,s,i){super(e,t,s,i),this.type="firestore",this._queue=new Zd,this._persistenceKey=(i==null?void 0:i.name)||"[DEFAULT]"}async _terminate(){if(this._firestoreClient){const e=this._firestoreClient.terminate();this._queue=new Zd(e),this._firestoreClient=void 0,await e}}}function M0(n,e){const t=typeof n=="object"?n:gc(),s=typeof n=="string"?n:"(default)",i=ma(t,"firestore").getImmediate({identifier:s});if(!i._initialized){const r=Zf("firestore");r&&x0(i,...r)}return i}function Aa(n){if(n._terminated)throw new V(k.FAILED_PRECONDITION,"The client has already been terminated.");return n._firestoreClient||L0(n),n._firestoreClient}function L0(n){var e,t,s;const i=n._freezeSettings(),r=function(l,c,h,d){return new dT(l,c,h,d.host,d.ssl,d.experimentalForceLongPolling,d.experimentalAutoDetectLongPolling,Zp(d.experimentalLongPollingOptions),d.useFetchStreams)}(n._databaseId,((e=n._app)===null||e===void 0?void 0:e.options.appId)||"",n._persistenceKey,i);n._componentsProvider||!((t=i.localCache)===null||t===void 0)&&t._offlineComponentProvider&&(!((s=i.localCache)===null||s===void 0)&&s._onlineComponentProvider)&&(n._componentsProvider={_offline:i.localCache._offlineComponentProvider,_online:i.localCache._onlineComponentProvider}),n._firestoreClient=new R0(n._authCredentials,n._appCheckCredentials,n._queue,r,n._componentsProvider&&function(l){const c=l==null?void 0:l._online.build();return{_offline:l==null?void 0:l._offline.build(c),_online:c}}(n._componentsProvider))}/**
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
 */class as{constructor(e){this._byteString=e}static fromBase64String(e){try{return new as(Ye.fromBase64String(e))}catch(t){throw new V(k.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+t)}}static fromUint8Array(e){return new as(Ye.fromUint8Array(e))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(e){return this._byteString.isEqual(e._byteString)}}/**
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
 */class Sr{constructor(...e){for(let t=0;t<e.length;++t)if(e[t].length===0)throw new V(k.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new Ke(e)}isEqual(e){return this._internalPath.isEqual(e._internalPath)}}/**
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
 */class eh{constructor(e){this._methodName=e}}/**
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
 */class th{constructor(e,t){if(!isFinite(e)||e<-90||e>90)throw new V(k.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+e);if(!isFinite(t)||t<-180||t>180)throw new V(k.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+t);this._lat=e,this._long=t}get latitude(){return this._lat}get longitude(){return this._long}isEqual(e){return this._lat===e._lat&&this._long===e._long}toJSON(){return{latitude:this._lat,longitude:this._long}}_compareTo(e){return le(this._lat,e._lat)||le(this._long,e._long)}}/**
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
 */class nh{constructor(e){this._values=(e||[]).map(t=>t)}toArray(){return this._values.map(e=>e)}isEqual(e){return function(s,i){if(s.length!==i.length)return!1;for(let r=0;r<s.length;++r)if(s[r]!==i[r])return!1;return!0}(this._values,e._values)}}/**
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
 */const O0=/^__.*__$/;class V0{constructor(e,t,s){this.data=e,this.fieldMask=t,this.fieldTransforms=s}toMutation(e,t){return this.fieldMask!==null?new On(e,this.data,this.fieldMask,t,this.fieldTransforms):new Ir(e,this.data,t,this.fieldTransforms)}}class tg{constructor(e,t,s){this.data=e,this.fieldMask=t,this.fieldTransforms=s}toMutation(e,t){return new On(e,this.data,this.fieldMask,t,this.fieldTransforms)}}function ng(n){switch(n){case 0:case 2:case 1:return!0;case 3:case 4:return!1;default:throw q()}}class sh{constructor(e,t,s,i,r,o){this.settings=e,this.databaseId=t,this.serializer=s,this.ignoreUndefinedProperties=i,r===void 0&&this.vu(),this.fieldTransforms=r||[],this.fieldMask=o||[]}get path(){return this.settings.path}get Cu(){return this.settings.Cu}Fu(e){return new sh(Object.assign(Object.assign({},this.settings),e),this.databaseId,this.serializer,this.ignoreUndefinedProperties,this.fieldTransforms,this.fieldMask)}Mu(e){var t;const s=(t=this.path)===null||t===void 0?void 0:t.child(e),i=this.Fu({path:s,xu:!1});return i.Ou(e),i}Nu(e){var t;const s=(t=this.path)===null||t===void 0?void 0:t.child(e),i=this.Fu({path:s,xu:!1});return i.vu(),i}Lu(e){return this.Fu({path:void 0,xu:!0})}Bu(e){return $o(e,this.settings.methodName,this.settings.ku||!1,this.path,this.settings.qu)}contains(e){return this.fieldMask.find(t=>e.isPrefixOf(t))!==void 0||this.fieldTransforms.find(t=>e.isPrefixOf(t.field))!==void 0}vu(){if(this.path)for(let e=0;e<this.path.length;e++)this.Ou(this.path.get(e))}Ou(e){if(e.length===0)throw this.Bu("Document fields must not be empty");if(ng(this.Cu)&&O0.test(e))throw this.Bu('Document fields cannot begin and end with "__"')}}class F0{constructor(e,t,s){this.databaseId=e,this.ignoreUndefinedProperties=t,this.serializer=s||Ia(e)}Qu(e,t,s,i=!1){return new sh({Cu:e,methodName:t,qu:s,path:Ke.emptyPath(),xu:!1,ku:i},this.databaseId,this.serializer,this.ignoreUndefinedProperties)}}function ka(n){const e=n._freezeSettings(),t=Ia(n._databaseId);return new F0(n._databaseId,!!e.ignoreUndefinedProperties,t)}function sg(n,e,t,s,i,r={}){const o=n.Qu(r.merge||r.mergeFields?2:0,e,t,i);ih("Data must be an object, but it was:",o,s);const l=og(s,o);let c,h;if(r.merge)c=new vt(o.fieldMask),h=o.fieldTransforms;else if(r.mergeFields){const d=[];for(const m of r.mergeFields){const p=Zl(e,m,t);if(!o.contains(p))throw new V(k.INVALID_ARGUMENT,`Field '${p}' is specified in your field mask but missing from your input data.`);lg(d,p)||d.push(p)}c=new vt(d),h=o.fieldTransforms.filter(m=>c.covers(m.field))}else c=null,h=o.fieldTransforms;return new V0(new ht(l),c,h)}class Pa extends eh{_toFieldTransform(e){if(e.Cu!==2)throw e.Cu===1?e.Bu(`${this._methodName}() can only appear at the top level of your update data`):e.Bu(`${this._methodName}() cannot be used with set() unless you pass {merge:true}`);return e.fieldMask.push(e.path),null}isEqual(e){return e instanceof Pa}}function ig(n,e,t,s){const i=n.Qu(1,e,t);ih("Data must be an object, but it was:",i,s);const r=[],o=ht.empty();ds(s,(c,h)=>{const d=rh(e,c,t);h=de(h);const m=i.Nu(d);if(h instanceof Pa)r.push(d);else{const p=Ar(h,m);p!=null&&(r.push(d),o.set(d,p))}});const l=new vt(r);return new tg(o,l,i.fieldTransforms)}function rg(n,e,t,s,i,r){const o=n.Qu(1,e,t),l=[Zl(e,s,t)],c=[i];if(r.length%2!=0)throw new V(k.INVALID_ARGUMENT,`Function ${e}() needs to be called with an even number of arguments that alternate between field names and values.`);for(let p=0;p<r.length;p+=2)l.push(Zl(e,r[p])),c.push(r[p+1]);const h=[],d=ht.empty();for(let p=l.length-1;p>=0;--p)if(!lg(h,l[p])){const E=l[p];let b=c[p];b=de(b);const A=o.Nu(E);if(b instanceof Pa)h.push(E);else{const P=Ar(b,A);P!=null&&(h.push(E),d.set(E,P))}}const m=new vt(h);return new tg(d,m,o.fieldTransforms)}function B0(n,e,t,s=!1){return Ar(t,n.Qu(s?4:3,e))}function Ar(n,e){if(ag(n=de(n)))return ih("Unsupported field value:",e,n),og(n,e);if(n instanceof eh)return function(s,i){if(!ng(i.Cu))throw i.Bu(`${s._methodName}() can only be used with update() and set()`);if(!i.path)throw i.Bu(`${s._methodName}() is not currently supported inside arrays`);const r=s._toFieldTransform(i);r&&i.fieldTransforms.push(r)}(n,e),null;if(n===void 0&&e.ignoreUndefinedProperties)return null;if(e.path&&e.fieldMask.push(e.path),n instanceof Array){if(e.settings.xu&&e.Cu!==4)throw e.Bu("Nested arrays are not supported");return function(s,i){const r=[];let o=0;for(const l of s){let c=Ar(l,i.Lu(o));c==null&&(c={nullValue:"NULL_VALUE"}),r.push(c),o++}return{arrayValue:{values:r}}}(n,e)}return function(s,i){if((s=de(s))===null)return{nullValue:"NULL_VALUE"};if(typeof s=="number")return MT(i.serializer,s);if(typeof s=="boolean")return{booleanValue:s};if(typeof s=="string")return{stringValue:s};if(s instanceof Date){const r=Me.fromDate(s);return{timestampValue:Uo(i.serializer,r)}}if(s instanceof Me){const r=new Me(s.seconds,1e3*Math.floor(s.nanoseconds/1e3));return{timestampValue:Uo(i.serializer,r)}}if(s instanceof th)return{geoPointValue:{latitude:s.latitude,longitude:s.longitude}};if(s instanceof as)return{bytesValue:Ip(i.serializer,s._byteString)};if(s instanceof it){const r=i.databaseId,o=s.firestore._databaseId;if(!o.isEqual(r))throw i.Bu(`Document reference is for database ${o.projectId}/${o.database} but should be for database ${r.projectId}/${r.database}`);return{referenceValue:Uc(s.firestore._databaseId||i.databaseId,s._key.path)}}if(s instanceof nh)return function(o,l){return{mapValue:{fields:{__type__:{stringValue:"__vector__"},value:{arrayValue:{values:o.toArray().map(c=>{if(typeof c!="number")throw l.Bu("VectorValues must only contain numeric values.");return Oc(l.serializer,c)})}}}}}}(s,i);throw i.Bu(`Unsupported field value: ${Ra(s)}`)}(n,e)}function og(n,e){const t={};return Ym(n)?e.path&&e.path.length>0&&e.fieldMask.push(e.path):ds(n,(s,i)=>{const r=Ar(i,e.Mu(s));r!=null&&(t[s]=r)}),{mapValue:{fields:t}}}function ag(n){return!(typeof n!="object"||n===null||n instanceof Array||n instanceof Date||n instanceof Me||n instanceof th||n instanceof as||n instanceof it||n instanceof eh||n instanceof nh)}function ih(n,e,t){if(!ag(t)||!function(i){return typeof i=="object"&&i!==null&&(Object.getPrototypeOf(i)===Object.prototype||Object.getPrototypeOf(i)===null)}(t)){const s=Ra(t);throw s==="an object"?e.Bu(n+" a custom object"):e.Bu(n+" "+s)}}function Zl(n,e,t){if((e=de(e))instanceof Sr)return e._internalPath;if(typeof e=="string")return rh(n,e);throw $o("Field path arguments must be of type string or ",n,!1,void 0,t)}const U0=new RegExp("[~\\*/\\[\\]]");function rh(n,e,t){if(e.search(U0)>=0)throw $o(`Invalid field path (${e}). Paths must not contain '~', '*', '/', '[', or ']'`,n,!1,void 0,t);try{return new Sr(...e.split("."))._internalPath}catch{throw $o(`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,n,!1,void 0,t)}}function $o(n,e,t,s,i){const r=s&&!s.isEmpty(),o=i!==void 0;let l=`Function ${e}() called with invalid data`;t&&(l+=" (via `toFirestore()`)"),l+=". ";let c="";return(r||o)&&(c+=" (found",r&&(c+=` in field ${s}`),o&&(c+=` in document ${i}`),c+=")"),new V(k.INVALID_ARGUMENT,l+n+c)}function lg(n,e){return n.some(t=>t.isEqual(e))}/**
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
 */class zo{constructor(e,t,s,i,r){this._firestore=e,this._userDataWriter=t,this._key=s,this._document=i,this._converter=r}get id(){return this._key.path.lastSegment()}get ref(){return new it(this._firestore,this._converter,this._key)}exists(){return this._document!==null}data(){if(this._document){if(this._converter){const e=new j0(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(e)}return this._userDataWriter.convertValue(this._document.data.value)}}get(e){if(this._document){const t=this._document.data.field(oh("DocumentSnapshot.get",e));if(t!==null)return this._userDataWriter.convertValue(t)}}}class j0 extends zo{data(){return super.data()}}function oh(n,e){return typeof e=="string"?rh(n,e):e instanceof Sr?e._internalPath:e._delegate._internalPath}/**
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
 */function W0(n){if(n.limitType==="L"&&n.explicitOrderBy.length===0)throw new V(k.UNIMPLEMENTED,"limitToLast() queries require specifying at least one orderBy() clause")}class ah{}let cg=class extends ah{};function ef(n,e,...t){let s=[];e instanceof ah&&s.push(e),s=s.concat(t),function(r){const o=r.filter(c=>c instanceof lh).length,l=r.filter(c=>c instanceof Na).length;if(o>1||o>0&&l>0)throw new V(k.INVALID_ARGUMENT,"InvalidQuery. When using composite filters, you cannot use more than one filter at the top level. Consider nesting the multiple filters within an `and(...)` statement. For example: change `query(query, where(...), or(...))` to `query(query, and(where(...), or(...)))`.")}(s);for(const i of s)n=i._apply(n);return n}class Na extends cg{constructor(e,t,s){super(),this._field=e,this._op=t,this._value=s,this.type="where"}static _create(e,t,s){return new Na(e,t,s)}_apply(e){const t=this._parse(e);return hg(e._query,t),new ms(e.firestore,e.converter,zl(e._query,t))}_parse(e){const t=ka(e.firestore);return function(r,o,l,c,h,d,m){let p;if(h.isKeyField()){if(d==="array-contains"||d==="array-contains-any")throw new V(k.INVALID_ARGUMENT,`Invalid Query. You can't perform '${d}' queries on documentId().`);if(d==="in"||d==="not-in"){sf(m,d);const E=[];for(const b of m)E.push(nf(c,r,b));p={arrayValue:{values:E}}}else p=nf(c,r,m)}else d!=="in"&&d!=="not-in"&&d!=="array-contains-any"||sf(m,d),p=B0(l,o,m,d==="in"||d==="not-in");return ke.create(h,d,p)}(e._query,"where",t,e.firestore._databaseId,this._field,this._op,this._value)}}function tf(n,e,t){const s=e,i=oh("where",n);return Na._create(i,s,t)}class lh extends ah{constructor(e,t){super(),this.type=e,this._queryConstraints=t}static _create(e,t){return new lh(e,t)}_parse(e){const t=this._queryConstraints.map(s=>s._parse(e)).filter(s=>s.getFilters().length>0);return t.length===1?t[0]:Nt.create(t,this._getOperator())}_apply(e){const t=this._parse(e);return t.getFilters().length===0?e:(function(i,r){let o=i;const l=r.getFlattenedFilters();for(const c of l)hg(o,c),o=zl(o,c)}(e._query,t),new ms(e.firestore,e.converter,zl(e._query,t)))}_getQueryConstraints(){return this._queryConstraints}_getOperator(){return this.type==="and"?"and":"or"}}class ch extends cg{constructor(e,t,s){super(),this.type=e,this._limit=t,this._limitType=s}static _create(e,t,s){return new ch(e,t,s)}_apply(e){return new ms(e.firestore,e.converter,Vo(e._query,this._limit,this._limitType))}}function q0(n){return ch._create("limit",n,"F")}function nf(n,e,t){if(typeof(t=de(t))=="string"){if(t==="")throw new V(k.INVALID_ARGUMENT,"Invalid query. When querying with documentId(), you must provide a valid document ID, but it was an empty string.");if(!rp(e)&&t.indexOf("/")!==-1)throw new V(k.INVALID_ARGUMENT,`Invalid query. When querying a collection by documentId(), you must provide a plain document ID, but '${t}' contains a '/' character.`);const s=e.path.child(ge.fromString(t));if(!j.isDocumentKey(s))throw new V(k.INVALID_ARGUMENT,`Invalid query. When querying a collection group by documentId(), the value provided must result in a valid document path, but '${s}' is not because it has an odd number of segments (${s.length}).`);return Td(n,new j(s))}if(t instanceof it)return Td(n,t._key);throw new V(k.INVALID_ARGUMENT,`Invalid query. When querying with documentId(), you must provide a valid string or a DocumentReference, but it was: ${Ra(t)}.`)}function sf(n,e){if(!Array.isArray(n)||n.length===0)throw new V(k.INVALID_ARGUMENT,`Invalid Query. A non-empty array is required for '${e.toString()}' filters.`)}function hg(n,e){const t=function(i,r){for(const o of i)for(const l of o.getFlattenedFilters())if(r.indexOf(l.op)>=0)return l.op;return null}(n.filters,function(i){switch(i){case"!=":return["!=","not-in"];case"array-contains-any":case"in":return["not-in"];case"not-in":return["array-contains-any","in","not-in","!="];default:return[]}}(e.op));if(t!==null)throw t===e.op?new V(k.INVALID_ARGUMENT,`Invalid query. You cannot use more than one '${e.op.toString()}' filter.`):new V(k.INVALID_ARGUMENT,`Invalid query. You cannot use '${e.op.toString()}' filters with '${t.toString()}' filters.`)}class ug{convertValue(e,t="none"){switch(os(e)){case 0:return null;case 1:return e.booleanValue;case 2:return Se(e.integerValue||e.doubleValue);case 3:return this.convertTimestamp(e.timestampValue);case 4:return this.convertServerTimestamp(e,t);case 5:return e.stringValue;case 6:return this.convertBytes(rs(e.bytesValue));case 7:return this.convertReference(e.referenceValue);case 8:return this.convertGeoPoint(e.geoPointValue);case 9:return this.convertArray(e.arrayValue,t);case 11:return this.convertObject(e.mapValue,t);case 10:return this.convertVectorValue(e.mapValue);default:throw q()}}convertObject(e,t){return this.convertObjectMap(e.fields,t)}convertObjectMap(e,t="none"){const s={};return ds(e,(i,r)=>{s[i]=this.convertValue(r,t)}),s}convertVectorValue(e){var t,s,i;const r=(i=(s=(t=e.fields)===null||t===void 0?void 0:t.value.arrayValue)===null||s===void 0?void 0:s.values)===null||i===void 0?void 0:i.map(o=>Se(o.doubleValue));return new nh(r)}convertGeoPoint(e){return new th(Se(e.latitude),Se(e.longitude))}convertArray(e,t){return(e.values||[]).map(s=>this.convertValue(s,t))}convertServerTimestamp(e,t){switch(t){case"previous":const s=Nc(e);return s==null?null:this.convertValue(s,t);case"estimate":return this.convertTimestamp(nr(e));default:return null}}convertTimestamp(e){const t=kn(e);return new Me(t.seconds,t.nanos)}convertDocumentKey(e,t){const s=ge.fromString(e);re(Pp(s));const i=new sr(s.get(1),s.get(3)),r=new j(s.popFirst(5));return i.isEqual(t)||rn(`Document ${r} contains a document reference within a different database (${i.projectId}/${i.database}) which is not supported. It will be treated as a reference in the current database (${t.projectId}/${t.database}) instead.`),r}}/**
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
 */function dg(n,e,t){let s;return s=n?t&&(t.merge||t.mergeFields)?n.toFirestore(e,t):n.toFirestore(e):e,s}class $0 extends ug{constructor(e){super(),this.firestore=e}convertBytes(e){return new as(e)}convertReference(e){const t=this.convertDocumentKey(e,this.firestore._databaseId);return new it(this.firestore,null,t)}}/**
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
 */class ks{constructor(e,t){this.hasPendingWrites=e,this.fromCache=t}isEqual(e){return this.hasPendingWrites===e.hasPendingWrites&&this.fromCache===e.fromCache}}class hh extends zo{constructor(e,t,s,i,r,o){super(e,t,s,i,o),this._firestore=e,this._firestoreImpl=e,this.metadata=r}exists(){return super.exists()}data(e={}){if(this._document){if(this._converter){const t=new Eo(this._firestore,this._userDataWriter,this._key,this._document,this.metadata,null);return this._converter.fromFirestore(t,e)}return this._userDataWriter.convertValue(this._document.data.value,e.serverTimestamps)}}get(e,t={}){if(this._document){const s=this._document.data.field(oh("DocumentSnapshot.get",e));if(s!==null)return this._userDataWriter.convertValue(s,t.serverTimestamps)}}}class Eo extends hh{data(e={}){return super.data(e)}}class z0{constructor(e,t,s,i){this._firestore=e,this._userDataWriter=t,this._snapshot=i,this.metadata=new ks(i.hasPendingWrites,i.fromCache),this.query=s}get docs(){const e=[];return this.forEach(t=>e.push(t)),e}get size(){return this._snapshot.docs.size}get empty(){return this.size===0}forEach(e,t){this._snapshot.docs.forEach(s=>{e.call(t,new Eo(this._firestore,this._userDataWriter,s.key,s,new ks(this._snapshot.mutatedKeys.has(s.key),this._snapshot.fromCache),this.query.converter))})}docChanges(e={}){const t=!!e.includeMetadataChanges;if(t&&this._snapshot.excludesMetadataChanges)throw new V(k.INVALID_ARGUMENT,"To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");return this._cachedChanges&&this._cachedChangesIncludeMetadataChanges===t||(this._cachedChanges=function(i,r){if(i._snapshot.oldDocs.isEmpty()){let o=0;return i._snapshot.docChanges.map(l=>{const c=new Eo(i._firestore,i._userDataWriter,l.doc.key,l.doc,new ks(i._snapshot.mutatedKeys.has(l.doc.key),i._snapshot.fromCache),i.query.converter);return l.doc,{type:"added",doc:c,oldIndex:-1,newIndex:o++}})}{let o=i._snapshot.oldDocs;return i._snapshot.docChanges.filter(l=>r||l.type!==3).map(l=>{const c=new Eo(i._firestore,i._userDataWriter,l.doc.key,l.doc,new ks(i._snapshot.mutatedKeys.has(l.doc.key),i._snapshot.fromCache),i.query.converter);let h=-1,d=-1;return l.type!==0&&(h=o.indexOf(l.doc.key),o=o.delete(l.doc.key)),l.type!==1&&(o=o.add(l.doc),d=o.indexOf(l.doc.key)),{type:H0(l.type),doc:c,oldIndex:h,newIndex:d}})}}(this,t),this._cachedChangesIncludeMetadataChanges=t),this._cachedChanges}}function H0(n){switch(n){case 0:return"added";case 2:case 3:return"modified";case 1:return"removed";default:return q()}}/**
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
 */function El(n){n=Ut(n,it);const e=Ut(n.firestore,ri);return P0(Aa(e),n._key).then(t=>G0(e,n,t))}class uh extends ug{constructor(e){super(),this.firestore=e}convertBytes(e){return new as(e)}convertReference(e){const t=this.convertDocumentKey(e,this.firestore._databaseId);return new it(this.firestore,null,t)}}function wl(n){n=Ut(n,ms);const e=Ut(n.firestore,ri),t=Aa(e),s=new uh(e);return W0(n._query),N0(t,n._query).then(i=>new z0(e,s,n,i))}function Tl(n,e,t){n=Ut(n,it);const s=Ut(n.firestore,ri),i=dg(n.converter,e,t);return fg(s,[sg(ka(s),"setDoc",n._key,i,n.converter!==null,t).toMutation(n._key,ut.none())])}function rf(n,e,t,...s){n=Ut(n,it);const i=Ut(n.firestore,ri),r=ka(i);let o;return o=typeof(e=de(e))=="string"||e instanceof Sr?rg(r,"updateDoc",n._key,e,t,s):ig(r,"updateDoc",n._key,e),fg(i,[o.toMutation(n._key,ut.exists(!0))])}function fg(n,e){return function(s,i){const r=new Ot;return s.asyncQueue.enqueueAndForget(async()=>g0(await A0(s),i,r)),r.promise}(Aa(n),e)}function G0(n,e,t){const s=t.docs.get(e._key),i=new uh(n);return new hh(n,i,e._key,s,new ks(t.hasPendingWrites,t.fromCache),e.converter)}/**
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
 */const K0={maxAttempts:5};function Pi(n,e){if((n=de(n)).firestore!==e)throw new V(k.INVALID_ARGUMENT,"Provided document reference is from a different Firestore instance.");return n}/**
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
 */class Q0 extends class{constructor(t,s){this._firestore=t,this._transaction=s,this._dataReader=ka(t)}get(t){const s=Pi(t,this._firestore),i=new $0(this._firestore);return this._transaction.lookup([s._key]).then(r=>{if(!r||r.length!==1)return q();const o=r[0];if(o.isFoundDocument())return new zo(this._firestore,i,o.key,o,s.converter);if(o.isNoDocument())return new zo(this._firestore,i,s._key,null,s.converter);throw q()})}set(t,s,i){const r=Pi(t,this._firestore),o=dg(r.converter,s,i),l=sg(this._dataReader,"Transaction.set",r._key,o,r.converter!==null,i);return this._transaction.set(r._key,l),this}update(t,s,i,...r){const o=Pi(t,this._firestore);let l;return l=typeof(s=de(s))=="string"||s instanceof Sr?rg(this._dataReader,"Transaction.update",o._key,s,i,r):ig(this._dataReader,"Transaction.update",o._key,s),this._transaction.update(o._key,l),this}delete(t){const s=Pi(t,this._firestore);return this._transaction.delete(s._key),this}}{constructor(e,t){super(e,t),this._firestore=e}get(e){const t=Pi(e,this._firestore),s=new uh(this._firestore);return super.get(e).then(i=>new hh(this._firestore,s,t._key,i._document,new ks(!1,!1),t.converter))}}function Y0(n,e,t){n=Ut(n,ri);const s=Object.assign(Object.assign({},K0),t);return function(r){if(r.maxAttempts<1)throw new V(k.INVALID_ARGUMENT,"Max attempts must be at least 1")}(s),function(r,o,l){const c=new Ot;return r.asyncQueue.enqueueAndForget(async()=>{const h=await k0(r);new C0(r.asyncQueue,h,l,o,c).au()}),c.promise}(Aa(n),i=>e(new Q0(n,i)),s)}(function(e,t=!0){(function(i){ni=i})(us),ns(new Sn("firestore",(s,{instanceIdentifier:i,options:r})=>{const o=s.getProvider("app").getImmediate(),l=new ri(new Xw(s.getProvider("auth-internal")),new tT(s.getProvider("app-check-internal")),function(h,d){if(!Object.prototype.hasOwnProperty.apply(h.options,["projectId"]))throw new V(k.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new sr(h.options.projectId,d)}(o,i),o);return r=Object.assign({useFetchStreams:t},r),l._setSettings(r),l},"PUBLIC").setMultipleInstances(!0)),Mt(_d,"4.7.3",e),Mt(_d,"4.7.3","esm2017")})();var of={};const af="@firebase/database",lf="1.0.8";/**
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
 */let mg="";function X0(n){mg=n}/**
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
 */class J0{constructor(e){this.domStorage_=e,this.prefix_="firebase:"}set(e,t){t==null?this.domStorage_.removeItem(this.prefixedName_(e)):this.domStorage_.setItem(this.prefixedName_(e),xe(t))}get(e){const t=this.domStorage_.getItem(this.prefixedName_(e));return t==null?null:Ji(t)}remove(e){this.domStorage_.removeItem(this.prefixedName_(e))}prefixedName_(e){return this.prefix_+e}toString(){return this.domStorage_.toString()}}/**
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
 */class Z0{constructor(){this.cache_={},this.isInMemoryStorage=!0}set(e,t){t==null?delete this.cache_[e]:this.cache_[e]=t}get(e){return jt(this.cache_,e)?this.cache_[e]:null}remove(e){delete this.cache_[e]}}/**
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
 */const pg=function(n){try{if(typeof window<"u"&&typeof window[n]<"u"){const e=window[n];return e.setItem("firebase:sentinel","cache"),e.removeItem("firebase:sentinel"),new J0(e)}}catch{}return new Z0},Xn=pg("localStorage"),eb=pg("sessionStorage");/**
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
 */const Ls=new fa("@firebase/database"),tb=function(){let n=1;return function(){return n++}}(),gg=function(n){const e=Uy(n),t=new Oy;t.update(e);const s=t.digest();return fc.encodeByteArray(s)},kr=function(...n){let e="";for(let t=0;t<n.length;t++){const s=n[t];Array.isArray(s)||s&&typeof s=="object"&&typeof s.length=="number"?e+=kr.apply(null,s):typeof s=="object"?e+=xe(s):e+=s,e+=" "}return e};let $i=null,cf=!0;const nb=function(n,e){M(!0,"Can't turn on custom loggers persistently."),Ls.logLevel=te.VERBOSE,$i=Ls.log.bind(Ls)},je=function(...n){if(cf===!0&&(cf=!1,$i===null&&eb.get("logging_enabled")===!0&&nb()),$i){const e=kr.apply(null,n);$i(e)}},Pr=function(n){return function(...e){je(n,...e)}},ec=function(...n){const e="FIREBASE INTERNAL ERROR: "+kr(...n);Ls.error(e)},an=function(...n){const e=`FIREBASE FATAL ERROR: ${kr(...n)}`;throw Ls.error(e),new Error(e)},ft=function(...n){const e="FIREBASE WARNING: "+kr(...n);Ls.warn(e)},sb=function(){typeof window<"u"&&window.location&&window.location.protocol&&window.location.protocol.indexOf("https:")!==-1&&ft("Insecure Firebase access from a secure page. Please use https in calls to new Firebase().")},Da=function(n){return typeof n=="number"&&(n!==n||n===Number.POSITIVE_INFINITY||n===Number.NEGATIVE_INFINITY)},ib=function(n){if(document.readyState==="complete")n();else{let e=!1;const t=function(){if(!document.body){setTimeout(t,Math.floor(10));return}e||(e=!0,n())};document.addEventListener?(document.addEventListener("DOMContentLoaded",t,!1),window.addEventListener("load",t,!1)):document.attachEvent&&(document.attachEvent("onreadystatechange",()=>{document.readyState==="complete"&&t()}),window.attachEvent("onload",t))}},ls="[MIN_NAME]",Nn="[MAX_NAME]",ps=function(n,e){if(n===e)return 0;if(n===ls||e===Nn)return-1;if(e===ls||n===Nn)return 1;{const t=hf(n),s=hf(e);return t!==null?s!==null?t-s===0?n.length-e.length:t-s:-1:s!==null?1:n<e?-1:1}},rb=function(n,e){return n===e?0:n<e?-1:1},Ni=function(n,e){if(e&&n in e)return e[n];throw new Error("Missing required key ("+n+") in object: "+xe(e))},dh=function(n){if(typeof n!="object"||n===null)return xe(n);const e=[];for(const s in n)e.push(s);e.sort();let t="{";for(let s=0;s<e.length;s++)s!==0&&(t+=","),t+=xe(e[s]),t+=":",t+=dh(n[e[s]]);return t+="}",t},_g=function(n,e){const t=n.length;if(t<=e)return[n];const s=[];for(let i=0;i<t;i+=e)i+e>t?s.push(n.substring(i,t)):s.push(n.substring(i,i+e));return s};function We(n,e){for(const t in n)n.hasOwnProperty(t)&&e(t,n[t])}const yg=function(n){M(!Da(n),"Invalid JSON number");const e=11,t=52,s=(1<<e-1)-1;let i,r,o,l,c;n===0?(r=0,o=0,i=1/n===-1/0?1:0):(i=n<0,n=Math.abs(n),n>=Math.pow(2,1-s)?(l=Math.min(Math.floor(Math.log(n)/Math.LN2),s),r=l+s,o=Math.round(n*Math.pow(2,t-l)-Math.pow(2,t))):(r=0,o=Math.round(n/Math.pow(2,1-s-t))));const h=[];for(c=t;c;c-=1)h.push(o%2?1:0),o=Math.floor(o/2);for(c=e;c;c-=1)h.push(r%2?1:0),r=Math.floor(r/2);h.push(i?1:0),h.reverse();const d=h.join("");let m="";for(c=0;c<64;c+=8){let p=parseInt(d.substr(c,8),2).toString(16);p.length===1&&(p="0"+p),m=m+p}return m.toLowerCase()},ob=function(){return!!(typeof window=="object"&&window.chrome&&window.chrome.extension&&!/^chrome/.test(window.location.href))},ab=function(){return typeof Windows=="object"&&typeof Windows.UI=="object"};function lb(n,e){let t="Unknown Error";n==="too_big"?t="The data requested exceeds the maximum size that can be accessed with a single request.":n==="permission_denied"?t="Client doesn't have permission to access the desired data.":n==="unavailable"&&(t="The service is unavailable");const s=new Error(n+" at "+e._path.toString()+": "+t);return s.code=n.toUpperCase(),s}const cb=new RegExp("^-?(0*)\\d{1,10}$"),hb=-2147483648,ub=2147483647,hf=function(n){if(cb.test(n)){const e=Number(n);if(e>=hb&&e<=ub)return e}return null},oi=function(n){try{n()}catch(e){setTimeout(()=>{const t=e.stack||"";throw ft("Exception was thrown by user callback.",t),e},Math.floor(0))}},db=function(){return(typeof window=="object"&&window.navigator&&window.navigator.userAgent||"").search(/googlebot|google webmaster tools|bingbot|yahoo! slurp|baiduspider|yandexbot|duckduckbot/i)>=0},zi=function(n,e){const t=setTimeout(n,e);return typeof t=="number"&&typeof Deno<"u"&&Deno.unrefTimer?Deno.unrefTimer(t):typeof t=="object"&&t.unref&&t.unref(),t};/**
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
 */class mb{constructor(e,t,s){this.appName_=e,this.firebaseOptions_=t,this.authProvider_=s,this.auth_=null,this.auth_=s.getImmediate({optional:!0}),this.auth_||s.onInit(i=>this.auth_=i)}getToken(e){return this.auth_?this.auth_.getToken(e).catch(t=>t&&t.code==="auth/token-not-initialized"?(je("Got auth/token-not-initialized error.  Treating as null token."),null):Promise.reject(t)):new Promise((t,s)=>{setTimeout(()=>{this.auth_?this.getToken(e).then(t,s):t(null)},0)})}addTokenChangeListener(e){this.auth_?this.auth_.addAuthTokenListener(e):this.authProvider_.get().then(t=>t.addAuthTokenListener(e))}removeTokenChangeListener(e){this.authProvider_.get().then(t=>t.removeAuthTokenListener(e))}notifyForInvalidToken(){let e='Provided authentication credentials for the app named "'+this.appName_+'" are invalid. This usually indicates your app was not initialized correctly. ';"credential"in this.firebaseOptions_?e+='Make sure the "credential" property provided to initializeApp() is authorized to access the specified "databaseURL" and is from the correct project.':"serviceAccount"in this.firebaseOptions_?e+='Make sure the "serviceAccount" property provided to initializeApp() is authorized to access the specified "databaseURL" and is from the correct project.':e+='Make sure the "apiKey" and "databaseURL" properties provided to initializeApp() match the values provided for your app at https://console.firebase.google.com/.',ft(e)}}class wo{constructor(e){this.accessToken=e}getToken(e){return Promise.resolve({accessToken:this.accessToken})}addTokenChangeListener(e){e(this.accessToken)}removeTokenChangeListener(e){}notifyForInvalidToken(){}}wo.OWNER="owner";/**
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
 */const fh="5",vg="v",Eg="s",wg="r",Tg="f",Ig=/(console\.firebase|firebase-console-\w+\.corp|firebase\.corp)\.google\.com/,bg="ls",Cg="p",tc="ac",Rg="websocket",Sg="long_polling";/**
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
 */class Ag{constructor(e,t,s,i,r=!1,o="",l=!1,c=!1){this.secure=t,this.namespace=s,this.webSocketOnly=i,this.nodeAdmin=r,this.persistenceKey=o,this.includeNamespaceInQueryParams=l,this.isUsingEmulator=c,this._host=e.toLowerCase(),this._domain=this._host.substr(this._host.indexOf(".")+1),this.internalHost=Xn.get("host:"+e)||this._host}isCacheableHost(){return this.internalHost.substr(0,2)==="s-"}isCustomHost(){return this._domain!=="firebaseio.com"&&this._domain!=="firebaseio-demo.com"}get host(){return this._host}set host(e){e!==this.internalHost&&(this.internalHost=e,this.isCacheableHost()&&Xn.set("host:"+this._host,this.internalHost))}toString(){let e=this.toURLString();return this.persistenceKey&&(e+="<"+this.persistenceKey+">"),e}toURLString(){const e=this.secure?"https://":"http://",t=this.includeNamespaceInQueryParams?`?ns=${this.namespace}`:"";return`${e}${this.host}/${t}`}}function pb(n){return n.host!==n.internalHost||n.isCustomHost()||n.includeNamespaceInQueryParams}function kg(n,e,t){M(typeof e=="string","typeof type must == string"),M(typeof t=="object","typeof params must == object");let s;if(e===Rg)s=(n.secure?"wss://":"ws://")+n.internalHost+"/.ws?";else if(e===Sg)s=(n.secure?"https://":"http://")+n.internalHost+"/.lp?";else throw new Error("Unknown connection type: "+e);pb(n)&&(t.ns=n.namespace);const i=[];return We(t,(r,o)=>{i.push(r+"="+o)}),s+i.join("&")}/**
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
 */class gb{constructor(){this.counters_={}}incrementCounter(e,t=1){jt(this.counters_,e)||(this.counters_[e]=0),this.counters_[e]+=t}get(){return _y(this.counters_)}}/**
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
 */const Il={},bl={};function mh(n){const e=n.toString();return Il[e]||(Il[e]=new gb),Il[e]}function _b(n,e){const t=n.toString();return bl[t]||(bl[t]=e()),bl[t]}/**
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
 */class yb{constructor(e){this.onMessage_=e,this.pendingResponses=[],this.currentResponseNum=0,this.closeAfterResponse=-1,this.onClose=null}closeAfter(e,t){this.closeAfterResponse=e,this.onClose=t,this.closeAfterResponse<this.currentResponseNum&&(this.onClose(),this.onClose=null)}handleResponse(e,t){for(this.pendingResponses[e]=t;this.pendingResponses[this.currentResponseNum];){const s=this.pendingResponses[this.currentResponseNum];delete this.pendingResponses[this.currentResponseNum];for(let i=0;i<s.length;++i)s[i]&&oi(()=>{this.onMessage_(s[i])});if(this.currentResponseNum===this.closeAfterResponse){this.onClose&&(this.onClose(),this.onClose=null);break}this.currentResponseNum++}}}/**
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
 */const uf="start",vb="close",Eb="pLPCommand",wb="pRTLPCB",Pg="id",Ng="pw",Dg="ser",Tb="cb",Ib="seg",bb="ts",Cb="d",Rb="dframe",xg=1870,Mg=30,Sb=xg-Mg,Ab=25e3,kb=3e4;class Ps{constructor(e,t,s,i,r,o,l){this.connId=e,this.repoInfo=t,this.applicationId=s,this.appCheckToken=i,this.authToken=r,this.transportSessionId=o,this.lastSessionId=l,this.bytesSent=0,this.bytesReceived=0,this.everConnected_=!1,this.log_=Pr(e),this.stats_=mh(t),this.urlFn=c=>(this.appCheckToken&&(c[tc]=this.appCheckToken),kg(t,Sg,c))}open(e,t){this.curSegmentNum=0,this.onDisconnect_=t,this.myPacketOrderer=new yb(e),this.isClosed_=!1,this.connectTimeoutTimer_=setTimeout(()=>{this.log_("Timed out trying to connect."),this.onClosed_(),this.connectTimeoutTimer_=null},Math.floor(kb)),ib(()=>{if(this.isClosed_)return;this.scriptTagHolder=new ph((...r)=>{const[o,l,c,h,d]=r;if(this.incrementIncomingBytes_(r),!!this.scriptTagHolder)if(this.connectTimeoutTimer_&&(clearTimeout(this.connectTimeoutTimer_),this.connectTimeoutTimer_=null),this.everConnected_=!0,o===uf)this.id=l,this.password=c;else if(o===vb)l?(this.scriptTagHolder.sendNewPolls=!1,this.myPacketOrderer.closeAfter(l,()=>{this.onClosed_()})):this.onClosed_();else throw new Error("Unrecognized command received: "+o)},(...r)=>{const[o,l]=r;this.incrementIncomingBytes_(r),this.myPacketOrderer.handleResponse(o,l)},()=>{this.onClosed_()},this.urlFn);const s={};s[uf]="t",s[Dg]=Math.floor(Math.random()*1e8),this.scriptTagHolder.uniqueCallbackIdentifier&&(s[Tb]=this.scriptTagHolder.uniqueCallbackIdentifier),s[vg]=fh,this.transportSessionId&&(s[Eg]=this.transportSessionId),this.lastSessionId&&(s[bg]=this.lastSessionId),this.applicationId&&(s[Cg]=this.applicationId),this.appCheckToken&&(s[tc]=this.appCheckToken),typeof location<"u"&&location.hostname&&Ig.test(location.hostname)&&(s[wg]=Tg);const i=this.urlFn(s);this.log_("Connecting via long-poll to "+i),this.scriptTagHolder.addTag(i,()=>{})})}start(){this.scriptTagHolder.startLongPoll(this.id,this.password),this.addDisconnectPingFrame(this.id,this.password)}static forceAllow(){Ps.forceAllow_=!0}static forceDisallow(){Ps.forceDisallow_=!0}static isAvailable(){return Ps.forceAllow_?!0:!Ps.forceDisallow_&&typeof document<"u"&&document.createElement!=null&&!ob()&&!ab()}markConnectionHealthy(){}shutdown_(){this.isClosed_=!0,this.scriptTagHolder&&(this.scriptTagHolder.close(),this.scriptTagHolder=null),this.myDisconnFrame&&(document.body.removeChild(this.myDisconnFrame),this.myDisconnFrame=null),this.connectTimeoutTimer_&&(clearTimeout(this.connectTimeoutTimer_),this.connectTimeoutTimer_=null)}onClosed_(){this.isClosed_||(this.log_("Longpoll is closing itself"),this.shutdown_(),this.onDisconnect_&&(this.onDisconnect_(this.everConnected_),this.onDisconnect_=null))}close(){this.isClosed_||(this.log_("Longpoll is being closed."),this.shutdown_())}send(e){const t=xe(e);this.bytesSent+=t.length,this.stats_.incrementCounter("bytes_sent",t.length);const s=Yf(t),i=_g(s,Sb);for(let r=0;r<i.length;r++)this.scriptTagHolder.enqueueSegment(this.curSegmentNum,i.length,i[r]),this.curSegmentNum++}addDisconnectPingFrame(e,t){this.myDisconnFrame=document.createElement("iframe");const s={};s[Rb]="t",s[Pg]=e,s[Ng]=t,this.myDisconnFrame.src=this.urlFn(s),this.myDisconnFrame.style.display="none",document.body.appendChild(this.myDisconnFrame)}incrementIncomingBytes_(e){const t=xe(e).length;this.bytesReceived+=t,this.stats_.incrementCounter("bytes_received",t)}}class ph{constructor(e,t,s,i){this.onDisconnect=s,this.urlFn=i,this.outstandingRequests=new Set,this.pendingSegs=[],this.currentSerial=Math.floor(Math.random()*1e8),this.sendNewPolls=!0;{this.uniqueCallbackIdentifier=tb(),window[Eb+this.uniqueCallbackIdentifier]=e,window[wb+this.uniqueCallbackIdentifier]=t,this.myIFrame=ph.createIFrame_();let r="";this.myIFrame.src&&this.myIFrame.src.substr(0,11)==="javascript:"&&(r='<script>document.domain="'+document.domain+'";<\/script>');const o="<html><body>"+r+"</body></html>";try{this.myIFrame.doc.open(),this.myIFrame.doc.write(o),this.myIFrame.doc.close()}catch(l){je("frame writing exception"),l.stack&&je(l.stack),je(l)}}}static createIFrame_(){const e=document.createElement("iframe");if(e.style.display="none",document.body){document.body.appendChild(e);try{e.contentWindow.document||je("No IE domain setting required")}catch{const s=document.domain;e.src="javascript:void((function(){document.open();document.domain='"+s+"';document.close();})())"}}else throw"Document body has not initialized. Wait to initialize Firebase until after the document is ready.";return e.contentDocument?e.doc=e.contentDocument:e.contentWindow?e.doc=e.contentWindow.document:e.document&&(e.doc=e.document),e}close(){this.alive=!1,this.myIFrame&&(this.myIFrame.doc.body.textContent="",setTimeout(()=>{this.myIFrame!==null&&(document.body.removeChild(this.myIFrame),this.myIFrame=null)},Math.floor(0)));const e=this.onDisconnect;e&&(this.onDisconnect=null,e())}startLongPoll(e,t){for(this.myID=e,this.myPW=t,this.alive=!0;this.newRequest_(););}newRequest_(){if(this.alive&&this.sendNewPolls&&this.outstandingRequests.size<(this.pendingSegs.length>0?2:1)){this.currentSerial++;const e={};e[Pg]=this.myID,e[Ng]=this.myPW,e[Dg]=this.currentSerial;let t=this.urlFn(e),s="",i=0;for(;this.pendingSegs.length>0&&this.pendingSegs[0].d.length+Mg+s.length<=xg;){const o=this.pendingSegs.shift();s=s+"&"+Ib+i+"="+o.seg+"&"+bb+i+"="+o.ts+"&"+Cb+i+"="+o.d,i++}return t=t+s,this.addLongPollTag_(t,this.currentSerial),!0}else return!1}enqueueSegment(e,t,s){this.pendingSegs.push({seg:e,ts:t,d:s}),this.alive&&this.newRequest_()}addLongPollTag_(e,t){this.outstandingRequests.add(t);const s=()=>{this.outstandingRequests.delete(t),this.newRequest_()},i=setTimeout(s,Math.floor(Ab)),r=()=>{clearTimeout(i),s()};this.addTag(e,r)}addTag(e,t){setTimeout(()=>{try{if(!this.sendNewPolls)return;const s=this.myIFrame.doc.createElement("script");s.type="text/javascript",s.async=!0,s.src=e,s.onload=s.onreadystatechange=function(){const i=s.readyState;(!i||i==="loaded"||i==="complete")&&(s.onload=s.onreadystatechange=null,s.parentNode&&s.parentNode.removeChild(s),t())},s.onerror=()=>{je("Long-poll script failed to load: "+e),this.sendNewPolls=!1,this.close()},this.myIFrame.doc.body.appendChild(s)}catch{}},Math.floor(1))}}/**
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
 */const Pb=16384,Nb=45e3;let Ho=null;typeof MozWebSocket<"u"?Ho=MozWebSocket:typeof WebSocket<"u"&&(Ho=WebSocket);class St{constructor(e,t,s,i,r,o,l){this.connId=e,this.applicationId=s,this.appCheckToken=i,this.authToken=r,this.keepaliveTimer=null,this.frames=null,this.totalFrames=0,this.bytesSent=0,this.bytesReceived=0,this.log_=Pr(this.connId),this.stats_=mh(t),this.connURL=St.connectionURL_(t,o,l,i,s),this.nodeAdmin=t.nodeAdmin}static connectionURL_(e,t,s,i,r){const o={};return o[vg]=fh,typeof location<"u"&&location.hostname&&Ig.test(location.hostname)&&(o[wg]=Tg),t&&(o[Eg]=t),s&&(o[bg]=s),i&&(o[tc]=i),r&&(o[Cg]=r),kg(e,Rg,o)}open(e,t){this.onDisconnect=t,this.onMessage=e,this.log_("Websocket connecting to "+this.connURL),this.everConnected_=!1,Xn.set("previous_websocket_failure",!0);try{let s;Sy(),this.mySock=new Ho(this.connURL,[],s)}catch(s){this.log_("Error instantiating WebSocket.");const i=s.message||s.data;i&&this.log_(i),this.onClosed_();return}this.mySock.onopen=()=>{this.log_("Websocket connected."),this.everConnected_=!0},this.mySock.onclose=()=>{this.log_("Websocket connection was disconnected."),this.mySock=null,this.onClosed_()},this.mySock.onmessage=s=>{this.handleIncomingFrame(s)},this.mySock.onerror=s=>{this.log_("WebSocket error.  Closing connection.");const i=s.message||s.data;i&&this.log_(i),this.onClosed_()}}start(){}static forceDisallow(){St.forceDisallow_=!0}static isAvailable(){let e=!1;if(typeof navigator<"u"&&navigator.userAgent){const t=/Android ([0-9]{0,}\.[0-9]{0,})/,s=navigator.userAgent.match(t);s&&s.length>1&&parseFloat(s[1])<4.4&&(e=!0)}return!e&&Ho!==null&&!St.forceDisallow_}static previouslyFailed(){return Xn.isInMemoryStorage||Xn.get("previous_websocket_failure")===!0}markConnectionHealthy(){Xn.remove("previous_websocket_failure")}appendFrame_(e){if(this.frames.push(e),this.frames.length===this.totalFrames){const t=this.frames.join("");this.frames=null;const s=Ji(t);this.onMessage(s)}}handleNewFrameCount_(e){this.totalFrames=e,this.frames=[]}extractFrameCount_(e){if(M(this.frames===null,"We already have a frame buffer"),e.length<=6){const t=Number(e);if(!isNaN(t))return this.handleNewFrameCount_(t),null}return this.handleNewFrameCount_(1),e}handleIncomingFrame(e){if(this.mySock===null)return;const t=e.data;if(this.bytesReceived+=t.length,this.stats_.incrementCounter("bytes_received",t.length),this.resetKeepAlive(),this.frames!==null)this.appendFrame_(t);else{const s=this.extractFrameCount_(t);s!==null&&this.appendFrame_(s)}}send(e){this.resetKeepAlive();const t=xe(e);this.bytesSent+=t.length,this.stats_.incrementCounter("bytes_sent",t.length);const s=_g(t,Pb);s.length>1&&this.sendString_(String(s.length));for(let i=0;i<s.length;i++)this.sendString_(s[i])}shutdown_(){this.isClosed_=!0,this.keepaliveTimer&&(clearInterval(this.keepaliveTimer),this.keepaliveTimer=null),this.mySock&&(this.mySock.close(),this.mySock=null)}onClosed_(){this.isClosed_||(this.log_("WebSocket is closing itself"),this.shutdown_(),this.onDisconnect&&(this.onDisconnect(this.everConnected_),this.onDisconnect=null))}close(){this.isClosed_||(this.log_("WebSocket is being closed"),this.shutdown_())}resetKeepAlive(){clearInterval(this.keepaliveTimer),this.keepaliveTimer=setInterval(()=>{this.mySock&&this.sendString_("0"),this.resetKeepAlive()},Math.floor(Nb))}sendString_(e){try{this.mySock.send(e)}catch(t){this.log_("Exception thrown from WebSocket.send():",t.message||t.data,"Closing connection."),setTimeout(this.onClosed_.bind(this),0)}}}St.responsesRequiredToBeHealthy=2;St.healthyTimeout=3e4;/**
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
 */class ar{constructor(e){this.initTransports_(e)}static get ALL_TRANSPORTS(){return[Ps,St]}static get IS_TRANSPORT_INITIALIZED(){return this.globalTransportInitialized_}initTransports_(e){const t=St&&St.isAvailable();let s=t&&!St.previouslyFailed();if(e.webSocketOnly&&(t||ft("wss:// URL used, but browser isn't known to support websockets.  Trying anyway."),s=!0),s)this.transports_=[St];else{const i=this.transports_=[];for(const r of ar.ALL_TRANSPORTS)r&&r.isAvailable()&&i.push(r);ar.globalTransportInitialized_=!0}}initialTransport(){if(this.transports_.length>0)return this.transports_[0];throw new Error("No transports available")}upgradeTransport(){return this.transports_.length>1?this.transports_[1]:null}}ar.globalTransportInitialized_=!1;/**
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
 */const Db=6e4,xb=5e3,Mb=10*1024,Lb=100*1024,Cl="t",df="d",Ob="s",ff="r",Vb="e",mf="o",pf="a",gf="n",_f="p",Fb="h";class Bb{constructor(e,t,s,i,r,o,l,c,h,d){this.id=e,this.repoInfo_=t,this.applicationId_=s,this.appCheckToken_=i,this.authToken_=r,this.onMessage_=o,this.onReady_=l,this.onDisconnect_=c,this.onKill_=h,this.lastSessionId=d,this.connectionCount=0,this.pendingDataMessages=[],this.state_=0,this.log_=Pr("c:"+this.id+":"),this.transportManager_=new ar(t),this.log_("Connection created"),this.start_()}start_(){const e=this.transportManager_.initialTransport();this.conn_=new e(this.nextTransportId_(),this.repoInfo_,this.applicationId_,this.appCheckToken_,this.authToken_,null,this.lastSessionId),this.primaryResponsesRequired_=e.responsesRequiredToBeHealthy||0;const t=this.connReceiver_(this.conn_),s=this.disconnReceiver_(this.conn_);this.tx_=this.conn_,this.rx_=this.conn_,this.secondaryConn_=null,this.isHealthy_=!1,setTimeout(()=>{this.conn_&&this.conn_.open(t,s)},Math.floor(0));const i=e.healthyTimeout||0;i>0&&(this.healthyTimeout_=zi(()=>{this.healthyTimeout_=null,this.isHealthy_||(this.conn_&&this.conn_.bytesReceived>Lb?(this.log_("Connection exceeded healthy timeout but has received "+this.conn_.bytesReceived+" bytes.  Marking connection healthy."),this.isHealthy_=!0,this.conn_.markConnectionHealthy()):this.conn_&&this.conn_.bytesSent>Mb?this.log_("Connection exceeded healthy timeout but has sent "+this.conn_.bytesSent+" bytes.  Leaving connection alive."):(this.log_("Closing unhealthy connection after timeout."),this.close()))},Math.floor(i)))}nextTransportId_(){return"c:"+this.id+":"+this.connectionCount++}disconnReceiver_(e){return t=>{e===this.conn_?this.onConnectionLost_(t):e===this.secondaryConn_?(this.log_("Secondary connection lost."),this.onSecondaryConnectionLost_()):this.log_("closing an old connection")}}connReceiver_(e){return t=>{this.state_!==2&&(e===this.rx_?this.onPrimaryMessageReceived_(t):e===this.secondaryConn_?this.onSecondaryMessageReceived_(t):this.log_("message on old connection"))}}sendRequest(e){const t={t:"d",d:e};this.sendData_(t)}tryCleanupConnection(){this.tx_===this.secondaryConn_&&this.rx_===this.secondaryConn_&&(this.log_("cleaning up and promoting a connection: "+this.secondaryConn_.connId),this.conn_=this.secondaryConn_,this.secondaryConn_=null)}onSecondaryControl_(e){if(Cl in e){const t=e[Cl];t===pf?this.upgradeIfSecondaryHealthy_():t===ff?(this.log_("Got a reset on secondary, closing it"),this.secondaryConn_.close(),(this.tx_===this.secondaryConn_||this.rx_===this.secondaryConn_)&&this.close()):t===mf&&(this.log_("got pong on secondary."),this.secondaryResponsesRequired_--,this.upgradeIfSecondaryHealthy_())}}onSecondaryMessageReceived_(e){const t=Ni("t",e),s=Ni("d",e);if(t==="c")this.onSecondaryControl_(s);else if(t==="d")this.pendingDataMessages.push(s);else throw new Error("Unknown protocol layer: "+t)}upgradeIfSecondaryHealthy_(){this.secondaryResponsesRequired_<=0?(this.log_("Secondary connection is healthy."),this.isHealthy_=!0,this.secondaryConn_.markConnectionHealthy(),this.proceedWithUpgrade_()):(this.log_("sending ping on secondary."),this.secondaryConn_.send({t:"c",d:{t:_f,d:{}}}))}proceedWithUpgrade_(){this.secondaryConn_.start(),this.log_("sending client ack on secondary"),this.secondaryConn_.send({t:"c",d:{t:pf,d:{}}}),this.log_("Ending transmission on primary"),this.conn_.send({t:"c",d:{t:gf,d:{}}}),this.tx_=this.secondaryConn_,this.tryCleanupConnection()}onPrimaryMessageReceived_(e){const t=Ni("t",e),s=Ni("d",e);t==="c"?this.onControl_(s):t==="d"&&this.onDataMessage_(s)}onDataMessage_(e){this.onPrimaryResponse_(),this.onMessage_(e)}onPrimaryResponse_(){this.isHealthy_||(this.primaryResponsesRequired_--,this.primaryResponsesRequired_<=0&&(this.log_("Primary connection is healthy."),this.isHealthy_=!0,this.conn_.markConnectionHealthy()))}onControl_(e){const t=Ni(Cl,e);if(df in e){const s=e[df];if(t===Fb){const i=Object.assign({},s);this.repoInfo_.isUsingEmulator&&(i.h=this.repoInfo_.host),this.onHandshake_(i)}else if(t===gf){this.log_("recvd end transmission on primary"),this.rx_=this.secondaryConn_;for(let i=0;i<this.pendingDataMessages.length;++i)this.onDataMessage_(this.pendingDataMessages[i]);this.pendingDataMessages=[],this.tryCleanupConnection()}else t===Ob?this.onConnectionShutdown_(s):t===ff?this.onReset_(s):t===Vb?ec("Server Error: "+s):t===mf?(this.log_("got pong on primary."),this.onPrimaryResponse_(),this.sendPingOnPrimaryIfNecessary_()):ec("Unknown control packet command: "+t)}}onHandshake_(e){const t=e.ts,s=e.v,i=e.h;this.sessionId=e.s,this.repoInfo_.host=i,this.state_===0&&(this.conn_.start(),this.onConnectionEstablished_(this.conn_,t),fh!==s&&ft("Protocol version mismatch detected"),this.tryStartUpgrade_())}tryStartUpgrade_(){const e=this.transportManager_.upgradeTransport();e&&this.startUpgrade_(e)}startUpgrade_(e){this.secondaryConn_=new e(this.nextTransportId_(),this.repoInfo_,this.applicationId_,this.appCheckToken_,this.authToken_,this.sessionId),this.secondaryResponsesRequired_=e.responsesRequiredToBeHealthy||0;const t=this.connReceiver_(this.secondaryConn_),s=this.disconnReceiver_(this.secondaryConn_);this.secondaryConn_.open(t,s),zi(()=>{this.secondaryConn_&&(this.log_("Timed out trying to upgrade."),this.secondaryConn_.close())},Math.floor(Db))}onReset_(e){this.log_("Reset packet received.  New host: "+e),this.repoInfo_.host=e,this.state_===1?this.close():(this.closeConnections_(),this.start_())}onConnectionEstablished_(e,t){this.log_("Realtime connection established."),this.conn_=e,this.state_=1,this.onReady_&&(this.onReady_(t,this.sessionId),this.onReady_=null),this.primaryResponsesRequired_===0?(this.log_("Primary connection is healthy."),this.isHealthy_=!0):zi(()=>{this.sendPingOnPrimaryIfNecessary_()},Math.floor(xb))}sendPingOnPrimaryIfNecessary_(){!this.isHealthy_&&this.state_===1&&(this.log_("sending ping on primary."),this.sendData_({t:"c",d:{t:_f,d:{}}}))}onSecondaryConnectionLost_(){const e=this.secondaryConn_;this.secondaryConn_=null,(this.tx_===e||this.rx_===e)&&this.close()}onConnectionLost_(e){this.conn_=null,!e&&this.state_===0?(this.log_("Realtime connection failed."),this.repoInfo_.isCacheableHost()&&(Xn.remove("host:"+this.repoInfo_.host),this.repoInfo_.internalHost=this.repoInfo_.host)):this.state_===1&&this.log_("Realtime connection lost."),this.close()}onConnectionShutdown_(e){this.log_("Connection shutdown command received. Shutting down..."),this.onKill_&&(this.onKill_(e),this.onKill_=null),this.onDisconnect_=null,this.close()}sendData_(e){if(this.state_!==1)throw"Connection is not connected";this.tx_.send(e)}close(){this.state_!==2&&(this.log_("Closing realtime connection."),this.state_=2,this.closeConnections_(),this.onDisconnect_&&(this.onDisconnect_(),this.onDisconnect_=null))}closeConnections_(){this.log_("Shutting down all connections"),this.conn_&&(this.conn_.close(),this.conn_=null),this.secondaryConn_&&(this.secondaryConn_.close(),this.secondaryConn_=null),this.healthyTimeout_&&(clearTimeout(this.healthyTimeout_),this.healthyTimeout_=null)}}/**
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
 */class Lg{put(e,t,s,i){}merge(e,t,s,i){}refreshAuthToken(e){}refreshAppCheckToken(e){}onDisconnectPut(e,t,s){}onDisconnectMerge(e,t,s){}onDisconnectCancel(e,t){}reportStats(e){}}/**
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
 */class Og{constructor(e){this.allowedEvents_=e,this.listeners_={},M(Array.isArray(e)&&e.length>0,"Requires a non-empty array")}trigger(e,...t){if(Array.isArray(this.listeners_[e])){const s=[...this.listeners_[e]];for(let i=0;i<s.length;i++)s[i].callback.apply(s[i].context,t)}}on(e,t,s){this.validateEventType_(e),this.listeners_[e]=this.listeners_[e]||[],this.listeners_[e].push({callback:t,context:s});const i=this.getInitialEvent(e);i&&t.apply(s,i)}off(e,t,s){this.validateEventType_(e);const i=this.listeners_[e]||[];for(let r=0;r<i.length;r++)if(i[r].callback===t&&(!s||s===i[r].context)){i.splice(r,1);return}}validateEventType_(e){M(this.allowedEvents_.find(t=>t===e),"Unknown event: "+e)}}/**
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
 */class Go extends Og{constructor(){super(["online"]),this.online_=!0,typeof window<"u"&&typeof window.addEventListener<"u"&&!mc()&&(window.addEventListener("online",()=>{this.online_||(this.online_=!0,this.trigger("online",!0))},!1),window.addEventListener("offline",()=>{this.online_&&(this.online_=!1,this.trigger("online",!1))},!1))}static getInstance(){return new Go}getInitialEvent(e){return M(e==="online","Unknown event type: "+e),[this.online_]}currentlyOnline(){return this.online_}}/**
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
 */const yf=32,vf=768;class ue{constructor(e,t){if(t===void 0){this.pieces_=e.split("/");let s=0;for(let i=0;i<this.pieces_.length;i++)this.pieces_[i].length>0&&(this.pieces_[s]=this.pieces_[i],s++);this.pieces_.length=s,this.pieceNum_=0}else this.pieces_=e,this.pieceNum_=t}toString(){let e="";for(let t=this.pieceNum_;t<this.pieces_.length;t++)this.pieces_[t]!==""&&(e+="/"+this.pieces_[t]);return e||"/"}}function ce(){return new ue("")}function X(n){return n.pieceNum_>=n.pieces_.length?null:n.pieces_[n.pieceNum_]}function Dn(n){return n.pieces_.length-n.pieceNum_}function pe(n){let e=n.pieceNum_;return e<n.pieces_.length&&e++,new ue(n.pieces_,e)}function gh(n){return n.pieceNum_<n.pieces_.length?n.pieces_[n.pieces_.length-1]:null}function Ub(n){let e="";for(let t=n.pieceNum_;t<n.pieces_.length;t++)n.pieces_[t]!==""&&(e+="/"+encodeURIComponent(String(n.pieces_[t])));return e||"/"}function lr(n,e=0){return n.pieces_.slice(n.pieceNum_+e)}function Vg(n){if(n.pieceNum_>=n.pieces_.length)return null;const e=[];for(let t=n.pieceNum_;t<n.pieces_.length-1;t++)e.push(n.pieces_[t]);return new ue(e,0)}function Te(n,e){const t=[];for(let s=n.pieceNum_;s<n.pieces_.length;s++)t.push(n.pieces_[s]);if(e instanceof ue)for(let s=e.pieceNum_;s<e.pieces_.length;s++)t.push(e.pieces_[s]);else{const s=e.split("/");for(let i=0;i<s.length;i++)s[i].length>0&&t.push(s[i])}return new ue(t,0)}function J(n){return n.pieceNum_>=n.pieces_.length}function dt(n,e){const t=X(n),s=X(e);if(t===null)return e;if(t===s)return dt(pe(n),pe(e));throw new Error("INTERNAL ERROR: innerPath ("+e+") is not within outerPath ("+n+")")}function jb(n,e){const t=lr(n,0),s=lr(e,0);for(let i=0;i<t.length&&i<s.length;i++){const r=ps(t[i],s[i]);if(r!==0)return r}return t.length===s.length?0:t.length<s.length?-1:1}function _h(n,e){if(Dn(n)!==Dn(e))return!1;for(let t=n.pieceNum_,s=e.pieceNum_;t<=n.pieces_.length;t++,s++)if(n.pieces_[t]!==e.pieces_[s])return!1;return!0}function It(n,e){let t=n.pieceNum_,s=e.pieceNum_;if(Dn(n)>Dn(e))return!1;for(;t<n.pieces_.length;){if(n.pieces_[t]!==e.pieces_[s])return!1;++t,++s}return!0}class Wb{constructor(e,t){this.errorPrefix_=t,this.parts_=lr(e,0),this.byteLength_=Math.max(1,this.parts_.length);for(let s=0;s<this.parts_.length;s++)this.byteLength_+=da(this.parts_[s]);Fg(this)}}function qb(n,e){n.parts_.length>0&&(n.byteLength_+=1),n.parts_.push(e),n.byteLength_+=da(e),Fg(n)}function $b(n){const e=n.parts_.pop();n.byteLength_-=da(e),n.parts_.length>0&&(n.byteLength_-=1)}function Fg(n){if(n.byteLength_>vf)throw new Error(n.errorPrefix_+"has a key path longer than "+vf+" bytes ("+n.byteLength_+").");if(n.parts_.length>yf)throw new Error(n.errorPrefix_+"path specified exceeds the maximum depth that can be written ("+yf+") or object contains a cycle "+Kn(n))}function Kn(n){return n.parts_.length===0?"":"in property '"+n.parts_.join(".")+"'"}/**
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
 */class yh extends Og{constructor(){super(["visible"]);let e,t;typeof document<"u"&&typeof document.addEventListener<"u"&&(typeof document.hidden<"u"?(t="visibilitychange",e="hidden"):typeof document.mozHidden<"u"?(t="mozvisibilitychange",e="mozHidden"):typeof document.msHidden<"u"?(t="msvisibilitychange",e="msHidden"):typeof document.webkitHidden<"u"&&(t="webkitvisibilitychange",e="webkitHidden")),this.visible_=!0,t&&document.addEventListener(t,()=>{const s=!document[e];s!==this.visible_&&(this.visible_=s,this.trigger("visible",s))},!1)}static getInstance(){return new yh}getInitialEvent(e){return M(e==="visible","Unknown event type: "+e),[this.visible_]}}/**
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
 */const Di=1e3,zb=60*5*1e3,Ef=30*1e3,Hb=1.3,Gb=3e4,Kb="server_kill",wf=3;class tn extends Lg{constructor(e,t,s,i,r,o,l,c){if(super(),this.repoInfo_=e,this.applicationId_=t,this.onDataUpdate_=s,this.onConnectStatus_=i,this.onServerInfoUpdate_=r,this.authTokenProvider_=o,this.appCheckTokenProvider_=l,this.authOverride_=c,this.id=tn.nextPersistentConnectionId_++,this.log_=Pr("p:"+this.id+":"),this.interruptReasons_={},this.listens=new Map,this.outstandingPuts_=[],this.outstandingGets_=[],this.outstandingPutCount_=0,this.outstandingGetCount_=0,this.onDisconnectRequestQueue_=[],this.connected_=!1,this.reconnectDelay_=Di,this.maxReconnectDelay_=zb,this.securityDebugCallback_=null,this.lastSessionId=null,this.establishConnectionTimer_=null,this.visible_=!1,this.requestCBHash_={},this.requestNumber_=0,this.realtime_=null,this.authToken_=null,this.appCheckToken_=null,this.forceTokenRefresh_=!1,this.invalidAuthTokenCount_=0,this.invalidAppCheckTokenCount_=0,this.firstConnection_=!0,this.lastConnectionAttemptTime_=null,this.lastConnectionEstablishedTime_=null,c)throw new Error("Auth override specified in options, but not supported on non Node.js platforms");yh.getInstance().on("visible",this.onVisible_,this),e.host.indexOf("fblocal")===-1&&Go.getInstance().on("online",this.onOnline_,this)}sendRequest(e,t,s){const i=++this.requestNumber_,r={r:i,a:e,b:t};this.log_(xe(r)),M(this.connected_,"sendRequest call when we're not connected not allowed."),this.realtime_.sendRequest(r),s&&(this.requestCBHash_[i]=s)}get(e){this.initConnection_();const t=new xt,i={action:"g",request:{p:e._path.toString(),q:e._queryObject},onComplete:o=>{const l=o.d;o.s==="ok"?t.resolve(l):t.reject(l)}};this.outstandingGets_.push(i),this.outstandingGetCount_++;const r=this.outstandingGets_.length-1;return this.connected_&&this.sendGet_(r),t.promise}listen(e,t,s,i){this.initConnection_();const r=e._queryIdentifier,o=e._path.toString();this.log_("Listen called for "+o+" "+r),this.listens.has(o)||this.listens.set(o,new Map),M(e._queryParams.isDefault()||!e._queryParams.loadsAllData(),"listen() called for non-default but complete query"),M(!this.listens.get(o).has(r),"listen() called twice for same path/queryId.");const l={onComplete:i,hashFn:t,query:e,tag:s};this.listens.get(o).set(r,l),this.connected_&&this.sendListen_(l)}sendGet_(e){const t=this.outstandingGets_[e];this.sendRequest("g",t.request,s=>{delete this.outstandingGets_[e],this.outstandingGetCount_--,this.outstandingGetCount_===0&&(this.outstandingGets_=[]),t.onComplete&&t.onComplete(s)})}sendListen_(e){const t=e.query,s=t._path.toString(),i=t._queryIdentifier;this.log_("Listen on "+s+" for "+i);const r={p:s},o="q";e.tag&&(r.q=t._queryObject,r.t=e.tag),r.h=e.hashFn(),this.sendRequest(o,r,l=>{const c=l.d,h=l.s;tn.warnOnListenWarnings_(c,t),(this.listens.get(s)&&this.listens.get(s).get(i))===e&&(this.log_("listen response",l),h!=="ok"&&this.removeListen_(s,i),e.onComplete&&e.onComplete(h,c))})}static warnOnListenWarnings_(e,t){if(e&&typeof e=="object"&&jt(e,"w")){const s=Vs(e,"w");if(Array.isArray(s)&&~s.indexOf("no_index")){const i='".indexOn": "'+t._queryParams.getIndex().toString()+'"',r=t._path.toString();ft(`Using an unspecified index. Your data will be downloaded and filtered on the client. Consider adding ${i} at ${r} to your security rules for better performance.`)}}}refreshAuthToken(e){this.authToken_=e,this.log_("Auth token refreshed"),this.authToken_?this.tryAuth():this.connected_&&this.sendRequest("unauth",{},()=>{}),this.reduceReconnectDelayIfAdminCredential_(e)}reduceReconnectDelayIfAdminCredential_(e){(e&&e.length===40||Ly(e))&&(this.log_("Admin auth credential detected.  Reducing max reconnect time."),this.maxReconnectDelay_=Ef)}refreshAppCheckToken(e){this.appCheckToken_=e,this.log_("App check token refreshed"),this.appCheckToken_?this.tryAppCheck():this.connected_&&this.sendRequest("unappeck",{},()=>{})}tryAuth(){if(this.connected_&&this.authToken_){const e=this.authToken_,t=My(e)?"auth":"gauth",s={cred:e};this.authOverride_===null?s.noauth=!0:typeof this.authOverride_=="object"&&(s.authvar=this.authOverride_),this.sendRequest(t,s,i=>{const r=i.s,o=i.d||"error";this.authToken_===e&&(r==="ok"?this.invalidAuthTokenCount_=0:this.onAuthRevoked_(r,o))})}}tryAppCheck(){this.connected_&&this.appCheckToken_&&this.sendRequest("appcheck",{token:this.appCheckToken_},e=>{const t=e.s,s=e.d||"error";t==="ok"?this.invalidAppCheckTokenCount_=0:this.onAppCheckRevoked_(t,s)})}unlisten(e,t){const s=e._path.toString(),i=e._queryIdentifier;this.log_("Unlisten called for "+s+" "+i),M(e._queryParams.isDefault()||!e._queryParams.loadsAllData(),"unlisten() called for non-default but complete query"),this.removeListen_(s,i)&&this.connected_&&this.sendUnlisten_(s,i,e._queryObject,t)}sendUnlisten_(e,t,s,i){this.log_("Unlisten on "+e+" for "+t);const r={p:e},o="n";i&&(r.q=s,r.t=i),this.sendRequest(o,r)}onDisconnectPut(e,t,s){this.initConnection_(),this.connected_?this.sendOnDisconnect_("o",e,t,s):this.onDisconnectRequestQueue_.push({pathString:e,action:"o",data:t,onComplete:s})}onDisconnectMerge(e,t,s){this.initConnection_(),this.connected_?this.sendOnDisconnect_("om",e,t,s):this.onDisconnectRequestQueue_.push({pathString:e,action:"om",data:t,onComplete:s})}onDisconnectCancel(e,t){this.initConnection_(),this.connected_?this.sendOnDisconnect_("oc",e,null,t):this.onDisconnectRequestQueue_.push({pathString:e,action:"oc",data:null,onComplete:t})}sendOnDisconnect_(e,t,s,i){const r={p:t,d:s};this.log_("onDisconnect "+e,r),this.sendRequest(e,r,o=>{i&&setTimeout(()=>{i(o.s,o.d)},Math.floor(0))})}put(e,t,s,i){this.putInternal("p",e,t,s,i)}merge(e,t,s,i){this.putInternal("m",e,t,s,i)}putInternal(e,t,s,i,r){this.initConnection_();const o={p:t,d:s};r!==void 0&&(o.h=r),this.outstandingPuts_.push({action:e,request:o,onComplete:i}),this.outstandingPutCount_++;const l=this.outstandingPuts_.length-1;this.connected_?this.sendPut_(l):this.log_("Buffering put: "+t)}sendPut_(e){const t=this.outstandingPuts_[e].action,s=this.outstandingPuts_[e].request,i=this.outstandingPuts_[e].onComplete;this.outstandingPuts_[e].queued=this.connected_,this.sendRequest(t,s,r=>{this.log_(t+" response",r),delete this.outstandingPuts_[e],this.outstandingPutCount_--,this.outstandingPutCount_===0&&(this.outstandingPuts_=[]),i&&i(r.s,r.d)})}reportStats(e){if(this.connected_){const t={c:e};this.log_("reportStats",t),this.sendRequest("s",t,s=>{if(s.s!=="ok"){const r=s.d;this.log_("reportStats","Error sending stats: "+r)}})}}onDataMessage_(e){if("r"in e){this.log_("from server: "+xe(e));const t=e.r,s=this.requestCBHash_[t];s&&(delete this.requestCBHash_[t],s(e.b))}else{if("error"in e)throw"A server-side error has occurred: "+e.error;"a"in e&&this.onDataPush_(e.a,e.b)}}onDataPush_(e,t){this.log_("handleServerMessage",e,t),e==="d"?this.onDataUpdate_(t.p,t.d,!1,t.t):e==="m"?this.onDataUpdate_(t.p,t.d,!0,t.t):e==="c"?this.onListenRevoked_(t.p,t.q):e==="ac"?this.onAuthRevoked_(t.s,t.d):e==="apc"?this.onAppCheckRevoked_(t.s,t.d):e==="sd"?this.onSecurityDebugPacket_(t):ec("Unrecognized action received from server: "+xe(e)+`
Are you using the latest client?`)}onReady_(e,t){this.log_("connection ready"),this.connected_=!0,this.lastConnectionEstablishedTime_=new Date().getTime(),this.handleTimestamp_(e),this.lastSessionId=t,this.firstConnection_&&this.sendConnectStats_(),this.restoreState_(),this.firstConnection_=!1,this.onConnectStatus_(!0)}scheduleConnect_(e){M(!this.realtime_,"Scheduling a connect when we're already connected/ing?"),this.establishConnectionTimer_&&clearTimeout(this.establishConnectionTimer_),this.establishConnectionTimer_=setTimeout(()=>{this.establishConnectionTimer_=null,this.establishConnection_()},Math.floor(e))}initConnection_(){!this.realtime_&&this.firstConnection_&&this.scheduleConnect_(0)}onVisible_(e){e&&!this.visible_&&this.reconnectDelay_===this.maxReconnectDelay_&&(this.log_("Window became visible.  Reducing delay."),this.reconnectDelay_=Di,this.realtime_||this.scheduleConnect_(0)),this.visible_=e}onOnline_(e){e?(this.log_("Browser went online."),this.reconnectDelay_=Di,this.realtime_||this.scheduleConnect_(0)):(this.log_("Browser went offline.  Killing connection."),this.realtime_&&this.realtime_.close())}onRealtimeDisconnect_(){if(this.log_("data client disconnected"),this.connected_=!1,this.realtime_=null,this.cancelSentTransactions_(),this.requestCBHash_={},this.shouldReconnect_()){this.visible_?this.lastConnectionEstablishedTime_&&(new Date().getTime()-this.lastConnectionEstablishedTime_>Gb&&(this.reconnectDelay_=Di),this.lastConnectionEstablishedTime_=null):(this.log_("Window isn't visible.  Delaying reconnect."),this.reconnectDelay_=this.maxReconnectDelay_,this.lastConnectionAttemptTime_=new Date().getTime());const e=new Date().getTime()-this.lastConnectionAttemptTime_;let t=Math.max(0,this.reconnectDelay_-e);t=Math.random()*t,this.log_("Trying to reconnect in "+t+"ms"),this.scheduleConnect_(t),this.reconnectDelay_=Math.min(this.maxReconnectDelay_,this.reconnectDelay_*Hb)}this.onConnectStatus_(!1)}async establishConnection_(){if(this.shouldReconnect_()){this.log_("Making a connection attempt"),this.lastConnectionAttemptTime_=new Date().getTime(),this.lastConnectionEstablishedTime_=null;const e=this.onDataMessage_.bind(this),t=this.onReady_.bind(this),s=this.onRealtimeDisconnect_.bind(this),i=this.id+":"+tn.nextConnectionId_++,r=this.lastSessionId;let o=!1,l=null;const c=function(){l?l.close():(o=!0,s())},h=function(m){M(l,"sendRequest call when we're not connected not allowed."),l.sendRequest(m)};this.realtime_={close:c,sendRequest:h};const d=this.forceTokenRefresh_;this.forceTokenRefresh_=!1;try{const[m,p]=await Promise.all([this.authTokenProvider_.getToken(d),this.appCheckTokenProvider_.getToken(d)]);o?je("getToken() completed but was canceled"):(je("getToken() completed. Creating connection."),this.authToken_=m&&m.accessToken,this.appCheckToken_=p&&p.token,l=new Bb(i,this.repoInfo_,this.applicationId_,this.appCheckToken_,this.authToken_,e,t,s,E=>{ft(E+" ("+this.repoInfo_.toString()+")"),this.interrupt(Kb)},r))}catch(m){this.log_("Failed to get token: "+m),o||(this.repoInfo_.nodeAdmin&&ft(m),c())}}}interrupt(e){je("Interrupting connection for reason: "+e),this.interruptReasons_[e]=!0,this.realtime_?this.realtime_.close():(this.establishConnectionTimer_&&(clearTimeout(this.establishConnectionTimer_),this.establishConnectionTimer_=null),this.connected_&&this.onRealtimeDisconnect_())}resume(e){je("Resuming connection for reason: "+e),delete this.interruptReasons_[e],Co(this.interruptReasons_)&&(this.reconnectDelay_=Di,this.realtime_||this.scheduleConnect_(0))}handleTimestamp_(e){const t=e-new Date().getTime();this.onServerInfoUpdate_({serverTimeOffset:t})}cancelSentTransactions_(){for(let e=0;e<this.outstandingPuts_.length;e++){const t=this.outstandingPuts_[e];t&&"h"in t.request&&t.queued&&(t.onComplete&&t.onComplete("disconnect"),delete this.outstandingPuts_[e],this.outstandingPutCount_--)}this.outstandingPutCount_===0&&(this.outstandingPuts_=[])}onListenRevoked_(e,t){let s;t?s=t.map(r=>dh(r)).join("$"):s="default";const i=this.removeListen_(e,s);i&&i.onComplete&&i.onComplete("permission_denied")}removeListen_(e,t){const s=new ue(e).toString();let i;if(this.listens.has(s)){const r=this.listens.get(s);i=r.get(t),r.delete(t),r.size===0&&this.listens.delete(s)}else i=void 0;return i}onAuthRevoked_(e,t){je("Auth token revoked: "+e+"/"+t),this.authToken_=null,this.forceTokenRefresh_=!0,this.realtime_.close(),(e==="invalid_token"||e==="permission_denied")&&(this.invalidAuthTokenCount_++,this.invalidAuthTokenCount_>=wf&&(this.reconnectDelay_=Ef,this.authTokenProvider_.notifyForInvalidToken()))}onAppCheckRevoked_(e,t){je("App check token revoked: "+e+"/"+t),this.appCheckToken_=null,this.forceTokenRefresh_=!0,(e==="invalid_token"||e==="permission_denied")&&(this.invalidAppCheckTokenCount_++,this.invalidAppCheckTokenCount_>=wf&&this.appCheckTokenProvider_.notifyForInvalidToken())}onSecurityDebugPacket_(e){this.securityDebugCallback_?this.securityDebugCallback_(e):"msg"in e&&console.log("FIREBASE: "+e.msg.replace(`
`,`
FIREBASE: `))}restoreState_(){this.tryAuth(),this.tryAppCheck();for(const e of this.listens.values())for(const t of e.values())this.sendListen_(t);for(let e=0;e<this.outstandingPuts_.length;e++)this.outstandingPuts_[e]&&this.sendPut_(e);for(;this.onDisconnectRequestQueue_.length;){const e=this.onDisconnectRequestQueue_.shift();this.sendOnDisconnect_(e.action,e.pathString,e.data,e.onComplete)}for(let e=0;e<this.outstandingGets_.length;e++)this.outstandingGets_[e]&&this.sendGet_(e)}sendConnectStats_(){const e={};let t="js";e["sdk."+t+"."+mg.replace(/\./g,"-")]=1,mc()?e["framework.cordova"]=1:sm()&&(e["framework.reactnative"]=1),this.reportStats(e)}shouldReconnect_(){const e=Go.getInstance().currentlyOnline();return Co(this.interruptReasons_)&&e}}tn.nextPersistentConnectionId_=0;tn.nextConnectionId_=0;/**
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
 */class xa{getCompare(){return this.compare.bind(this)}indexedValueChanged(e,t){const s=new Z(ls,e),i=new Z(ls,t);return this.compare(s,i)!==0}minPost(){return Z.MIN}}/**
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
 */let co;class Bg extends xa{static get __EMPTY_NODE(){return co}static set __EMPTY_NODE(e){co=e}compare(e,t){return ps(e.name,t.name)}isDefinedOn(e){throw Zs("KeyIndex.isDefinedOn not expected to be called.")}indexedValueChanged(e,t){return!1}minPost(){return Z.MIN}maxPost(){return new Z(Nn,co)}makePost(e,t){return M(typeof e=="string","KeyIndex indexValue must always be a string."),new Z(e,co)}toString(){return".key"}}const ts=new Bg;/**
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
 */class ho{constructor(e,t,s,i,r=null){this.isReverse_=i,this.resultGenerator_=r,this.nodeStack_=[];let o=1;for(;!e.isEmpty();)if(e=e,o=t?s(e.key,t):1,i&&(o*=-1),o<0)this.isReverse_?e=e.left:e=e.right;else if(o===0){this.nodeStack_.push(e);break}else this.nodeStack_.push(e),this.isReverse_?e=e.right:e=e.left}getNext(){if(this.nodeStack_.length===0)return null;let e=this.nodeStack_.pop(),t;if(this.resultGenerator_?t=this.resultGenerator_(e.key,e.value):t={key:e.key,value:e.value},this.isReverse_)for(e=e.left;!e.isEmpty();)this.nodeStack_.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack_.push(e),e=e.left;return t}hasNext(){return this.nodeStack_.length>0}peek(){if(this.nodeStack_.length===0)return null;const e=this.nodeStack_[this.nodeStack_.length-1];return this.resultGenerator_?this.resultGenerator_(e.key,e.value):{key:e.key,value:e.value}}}class Fe{constructor(e,t,s,i,r){this.key=e,this.value=t,this.color=s??Fe.RED,this.left=i??pt.EMPTY_NODE,this.right=r??pt.EMPTY_NODE}copy(e,t,s,i,r){return new Fe(e??this.key,t??this.value,s??this.color,i??this.left,r??this.right)}count(){return this.left.count()+1+this.right.count()}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||!!e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min_(){return this.left.isEmpty()?this:this.left.min_()}minKey(){return this.min_().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,t,s){let i=this;const r=s(e,i.key);return r<0?i=i.copy(null,null,null,i.left.insert(e,t,s),null):r===0?i=i.copy(null,t,null,null,null):i=i.copy(null,null,null,null,i.right.insert(e,t,s)),i.fixUp_()}removeMin_(){if(this.left.isEmpty())return pt.EMPTY_NODE;let e=this;return!e.left.isRed_()&&!e.left.left.isRed_()&&(e=e.moveRedLeft_()),e=e.copy(null,null,null,e.left.removeMin_(),null),e.fixUp_()}remove(e,t){let s,i;if(s=this,t(e,s.key)<0)!s.left.isEmpty()&&!s.left.isRed_()&&!s.left.left.isRed_()&&(s=s.moveRedLeft_()),s=s.copy(null,null,null,s.left.remove(e,t),null);else{if(s.left.isRed_()&&(s=s.rotateRight_()),!s.right.isEmpty()&&!s.right.isRed_()&&!s.right.left.isRed_()&&(s=s.moveRedRight_()),t(e,s.key)===0){if(s.right.isEmpty())return pt.EMPTY_NODE;i=s.right.min_(),s=s.copy(i.key,i.value,null,null,s.right.removeMin_())}s=s.copy(null,null,null,null,s.right.remove(e,t))}return s.fixUp_()}isRed_(){return this.color}fixUp_(){let e=this;return e.right.isRed_()&&!e.left.isRed_()&&(e=e.rotateLeft_()),e.left.isRed_()&&e.left.left.isRed_()&&(e=e.rotateRight_()),e.left.isRed_()&&e.right.isRed_()&&(e=e.colorFlip_()),e}moveRedLeft_(){let e=this.colorFlip_();return e.right.left.isRed_()&&(e=e.copy(null,null,null,null,e.right.rotateRight_()),e=e.rotateLeft_(),e=e.colorFlip_()),e}moveRedRight_(){let e=this.colorFlip_();return e.left.left.isRed_()&&(e=e.rotateRight_(),e=e.colorFlip_()),e}rotateLeft_(){const e=this.copy(null,null,Fe.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight_(){const e=this.copy(null,null,Fe.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip_(){const e=this.left.copy(null,null,!this.left.color,null,null),t=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,t)}checkMaxDepth_(){const e=this.check_();return Math.pow(2,e)<=this.count()+1}check_(){if(this.isRed_()&&this.left.isRed_())throw new Error("Red node has red child("+this.key+","+this.value+")");if(this.right.isRed_())throw new Error("Right child of ("+this.key+","+this.value+") is red");const e=this.left.check_();if(e!==this.right.check_())throw new Error("Black depths differ");return e+(this.isRed_()?0:1)}}Fe.RED=!0;Fe.BLACK=!1;class Qb{copy(e,t,s,i,r){return this}insert(e,t,s){return new Fe(e,t,null)}remove(e,t){return this}count(){return 0}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}check_(){return 0}isRed_(){return!1}}class pt{constructor(e,t=pt.EMPTY_NODE){this.comparator_=e,this.root_=t}insert(e,t){return new pt(this.comparator_,this.root_.insert(e,t,this.comparator_).copy(null,null,Fe.BLACK,null,null))}remove(e){return new pt(this.comparator_,this.root_.remove(e,this.comparator_).copy(null,null,Fe.BLACK,null,null))}get(e){let t,s=this.root_;for(;!s.isEmpty();){if(t=this.comparator_(e,s.key),t===0)return s.value;t<0?s=s.left:t>0&&(s=s.right)}return null}getPredecessorKey(e){let t,s=this.root_,i=null;for(;!s.isEmpty();)if(t=this.comparator_(e,s.key),t===0){if(s.left.isEmpty())return i?i.key:null;for(s=s.left;!s.right.isEmpty();)s=s.right;return s.key}else t<0?s=s.left:t>0&&(i=s,s=s.right);throw new Error("Attempted to find predecessor key for a nonexistent key.  What gives?")}isEmpty(){return this.root_.isEmpty()}count(){return this.root_.count()}minKey(){return this.root_.minKey()}maxKey(){return this.root_.maxKey()}inorderTraversal(e){return this.root_.inorderTraversal(e)}reverseTraversal(e){return this.root_.reverseTraversal(e)}getIterator(e){return new ho(this.root_,null,this.comparator_,!1,e)}getIteratorFrom(e,t){return new ho(this.root_,e,this.comparator_,!1,t)}getReverseIteratorFrom(e,t){return new ho(this.root_,e,this.comparator_,!0,t)}getReverseIterator(e){return new ho(this.root_,null,this.comparator_,!0,e)}}pt.EMPTY_NODE=new Qb;/**
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
 */function Yb(n,e){return ps(n.name,e.name)}function vh(n,e){return ps(n,e)}/**
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
 */let nc;function Xb(n){nc=n}const Ug=function(n){return typeof n=="number"?"number:"+yg(n):"string:"+n},jg=function(n){if(n.isLeafNode()){const e=n.val();M(typeof e=="string"||typeof e=="number"||typeof e=="object"&&jt(e,".sv"),"Priority must be a string or number.")}else M(n===nc||n.isEmpty(),"priority of unexpected type.");M(n===nc||n.getPriority().isEmpty(),"Priority nodes can't have a priority of their own.")};/**
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
 */let Tf;class Oe{constructor(e,t=Oe.__childrenNodeConstructor.EMPTY_NODE){this.value_=e,this.priorityNode_=t,this.lazyHash_=null,M(this.value_!==void 0&&this.value_!==null,"LeafNode shouldn't be created with null/undefined value."),jg(this.priorityNode_)}static set __childrenNodeConstructor(e){Tf=e}static get __childrenNodeConstructor(){return Tf}isLeafNode(){return!0}getPriority(){return this.priorityNode_}updatePriority(e){return new Oe(this.value_,e)}getImmediateChild(e){return e===".priority"?this.priorityNode_:Oe.__childrenNodeConstructor.EMPTY_NODE}getChild(e){return J(e)?this:X(e)===".priority"?this.priorityNode_:Oe.__childrenNodeConstructor.EMPTY_NODE}hasChild(){return!1}getPredecessorChildName(e,t){return null}updateImmediateChild(e,t){return e===".priority"?this.updatePriority(t):t.isEmpty()&&e!==".priority"?this:Oe.__childrenNodeConstructor.EMPTY_NODE.updateImmediateChild(e,t).updatePriority(this.priorityNode_)}updateChild(e,t){const s=X(e);return s===null?t:t.isEmpty()&&s!==".priority"?this:(M(s!==".priority"||Dn(e)===1,".priority must be the last token in a path"),this.updateImmediateChild(s,Oe.__childrenNodeConstructor.EMPTY_NODE.updateChild(pe(e),t)))}isEmpty(){return!1}numChildren(){return 0}forEachChild(e,t){return!1}val(e){return e&&!this.getPriority().isEmpty()?{".value":this.getValue(),".priority":this.getPriority().val()}:this.getValue()}hash(){if(this.lazyHash_===null){let e="";this.priorityNode_.isEmpty()||(e+="priority:"+Ug(this.priorityNode_.val())+":");const t=typeof this.value_;e+=t+":",t==="number"?e+=yg(this.value_):e+=this.value_,this.lazyHash_=gg(e)}return this.lazyHash_}getValue(){return this.value_}compareTo(e){return e===Oe.__childrenNodeConstructor.EMPTY_NODE?1:e instanceof Oe.__childrenNodeConstructor?-1:(M(e.isLeafNode(),"Unknown node type"),this.compareToLeafNode_(e))}compareToLeafNode_(e){const t=typeof e.value_,s=typeof this.value_,i=Oe.VALUE_TYPE_ORDER.indexOf(t),r=Oe.VALUE_TYPE_ORDER.indexOf(s);return M(i>=0,"Unknown leaf type: "+t),M(r>=0,"Unknown leaf type: "+s),i===r?s==="object"?0:this.value_<e.value_?-1:this.value_===e.value_?0:1:r-i}withIndex(){return this}isIndexed(){return!0}equals(e){if(e===this)return!0;if(e.isLeafNode()){const t=e;return this.value_===t.value_&&this.priorityNode_.equals(t.priorityNode_)}else return!1}}Oe.VALUE_TYPE_ORDER=["object","boolean","number","string"];/**
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
 */let Wg,qg;function Jb(n){Wg=n}function Zb(n){qg=n}class eC extends xa{compare(e,t){const s=e.node.getPriority(),i=t.node.getPriority(),r=s.compareTo(i);return r===0?ps(e.name,t.name):r}isDefinedOn(e){return!e.getPriority().isEmpty()}indexedValueChanged(e,t){return!e.getPriority().equals(t.getPriority())}minPost(){return Z.MIN}maxPost(){return new Z(Nn,new Oe("[PRIORITY-POST]",qg))}makePost(e,t){const s=Wg(e);return new Z(t,new Oe("[PRIORITY-POST]",s))}toString(){return".priority"}}const Ee=new eC;/**
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
 */const tC=Math.log(2);class nC{constructor(e){const t=r=>parseInt(Math.log(r)/tC,10),s=r=>parseInt(Array(r+1).join("1"),2);this.count=t(e+1),this.current_=this.count-1;const i=s(this.count);this.bits_=e+1&i}nextBitIsOne(){const e=!(this.bits_&1<<this.current_);return this.current_--,e}}const Ko=function(n,e,t,s){n.sort(e);const i=function(c,h){const d=h-c;let m,p;if(d===0)return null;if(d===1)return m=n[c],p=t?t(m):m,new Fe(p,m.node,Fe.BLACK,null,null);{const E=parseInt(d/2,10)+c,b=i(c,E),A=i(E+1,h);return m=n[E],p=t?t(m):m,new Fe(p,m.node,Fe.BLACK,b,A)}},r=function(c){let h=null,d=null,m=n.length;const p=function(b,A){const P=m-b,F=m;m-=b;const U=i(P+1,F),O=n[P],Y=t?t(O):O;E(new Fe(Y,O.node,A,null,U))},E=function(b){h?(h.left=b,h=b):(d=b,h=b)};for(let b=0;b<c.count;++b){const A=c.nextBitIsOne(),P=Math.pow(2,c.count-(b+1));A?p(P,Fe.BLACK):(p(P,Fe.BLACK),p(P,Fe.RED))}return d},o=new nC(n.length),l=r(o);return new pt(s||e,l)};/**
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
 */let Rl;const bs={};class Zt{constructor(e,t){this.indexes_=e,this.indexSet_=t}static get Default(){return M(bs&&Ee,"ChildrenNode.ts has not been loaded"),Rl=Rl||new Zt({".priority":bs},{".priority":Ee}),Rl}get(e){const t=Vs(this.indexes_,e);if(!t)throw new Error("No index defined for "+e);return t instanceof pt?t:null}hasIndex(e){return jt(this.indexSet_,e.toString())}addIndex(e,t){M(e!==ts,"KeyIndex always exists and isn't meant to be added to the IndexMap.");const s=[];let i=!1;const r=t.getIterator(Z.Wrap);let o=r.getNext();for(;o;)i=i||e.isDefinedOn(o.node),s.push(o),o=r.getNext();let l;i?l=Ko(s,e.getCompare()):l=bs;const c=e.toString(),h=Object.assign({},this.indexSet_);h[c]=e;const d=Object.assign({},this.indexes_);return d[c]=l,new Zt(d,h)}addToIndexes(e,t){const s=Ro(this.indexes_,(i,r)=>{const o=Vs(this.indexSet_,r);if(M(o,"Missing index implementation for "+r),i===bs)if(o.isDefinedOn(e.node)){const l=[],c=t.getIterator(Z.Wrap);let h=c.getNext();for(;h;)h.name!==e.name&&l.push(h),h=c.getNext();return l.push(e),Ko(l,o.getCompare())}else return bs;else{const l=t.get(e.name);let c=i;return l&&(c=c.remove(new Z(e.name,l))),c.insert(e,e.node)}});return new Zt(s,this.indexSet_)}removeFromIndexes(e,t){const s=Ro(this.indexes_,i=>{if(i===bs)return i;{const r=t.get(e.name);return r?i.remove(new Z(e.name,r)):i}});return new Zt(s,this.indexSet_)}}/**
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
 */let xi;class ${constructor(e,t,s){this.children_=e,this.priorityNode_=t,this.indexMap_=s,this.lazyHash_=null,this.priorityNode_&&jg(this.priorityNode_),this.children_.isEmpty()&&M(!this.priorityNode_||this.priorityNode_.isEmpty(),"An empty node cannot have a priority")}static get EMPTY_NODE(){return xi||(xi=new $(new pt(vh),null,Zt.Default))}isLeafNode(){return!1}getPriority(){return this.priorityNode_||xi}updatePriority(e){return this.children_.isEmpty()?this:new $(this.children_,e,this.indexMap_)}getImmediateChild(e){if(e===".priority")return this.getPriority();{const t=this.children_.get(e);return t===null?xi:t}}getChild(e){const t=X(e);return t===null?this:this.getImmediateChild(t).getChild(pe(e))}hasChild(e){return this.children_.get(e)!==null}updateImmediateChild(e,t){if(M(t,"We should always be passing snapshot nodes"),e===".priority")return this.updatePriority(t);{const s=new Z(e,t);let i,r;t.isEmpty()?(i=this.children_.remove(e),r=this.indexMap_.removeFromIndexes(s,this.children_)):(i=this.children_.insert(e,t),r=this.indexMap_.addToIndexes(s,this.children_));const o=i.isEmpty()?xi:this.priorityNode_;return new $(i,o,r)}}updateChild(e,t){const s=X(e);if(s===null)return t;{M(X(e)!==".priority"||Dn(e)===1,".priority must be the last token in a path");const i=this.getImmediateChild(s).updateChild(pe(e),t);return this.updateImmediateChild(s,i)}}isEmpty(){return this.children_.isEmpty()}numChildren(){return this.children_.count()}val(e){if(this.isEmpty())return null;const t={};let s=0,i=0,r=!0;if(this.forEachChild(Ee,(o,l)=>{t[o]=l.val(e),s++,r&&$.INTEGER_REGEXP_.test(o)?i=Math.max(i,Number(o)):r=!1}),!e&&r&&i<2*s){const o=[];for(const l in t)o[l]=t[l];return o}else return e&&!this.getPriority().isEmpty()&&(t[".priority"]=this.getPriority().val()),t}hash(){if(this.lazyHash_===null){let e="";this.getPriority().isEmpty()||(e+="priority:"+Ug(this.getPriority().val())+":"),this.forEachChild(Ee,(t,s)=>{const i=s.hash();i!==""&&(e+=":"+t+":"+i)}),this.lazyHash_=e===""?"":gg(e)}return this.lazyHash_}getPredecessorChildName(e,t,s){const i=this.resolveIndex_(s);if(i){const r=i.getPredecessorKey(new Z(e,t));return r?r.name:null}else return this.children_.getPredecessorKey(e)}getFirstChildName(e){const t=this.resolveIndex_(e);if(t){const s=t.minKey();return s&&s.name}else return this.children_.minKey()}getFirstChild(e){const t=this.getFirstChildName(e);return t?new Z(t,this.children_.get(t)):null}getLastChildName(e){const t=this.resolveIndex_(e);if(t){const s=t.maxKey();return s&&s.name}else return this.children_.maxKey()}getLastChild(e){const t=this.getLastChildName(e);return t?new Z(t,this.children_.get(t)):null}forEachChild(e,t){const s=this.resolveIndex_(e);return s?s.inorderTraversal(i=>t(i.name,i.node)):this.children_.inorderTraversal(t)}getIterator(e){return this.getIteratorFrom(e.minPost(),e)}getIteratorFrom(e,t){const s=this.resolveIndex_(t);if(s)return s.getIteratorFrom(e,i=>i);{const i=this.children_.getIteratorFrom(e.name,Z.Wrap);let r=i.peek();for(;r!=null&&t.compare(r,e)<0;)i.getNext(),r=i.peek();return i}}getReverseIterator(e){return this.getReverseIteratorFrom(e.maxPost(),e)}getReverseIteratorFrom(e,t){const s=this.resolveIndex_(t);if(s)return s.getReverseIteratorFrom(e,i=>i);{const i=this.children_.getReverseIteratorFrom(e.name,Z.Wrap);let r=i.peek();for(;r!=null&&t.compare(r,e)>0;)i.getNext(),r=i.peek();return i}}compareTo(e){return this.isEmpty()?e.isEmpty()?0:-1:e.isLeafNode()||e.isEmpty()?1:e===Nr?-1:0}withIndex(e){if(e===ts||this.indexMap_.hasIndex(e))return this;{const t=this.indexMap_.addIndex(e,this.children_);return new $(this.children_,this.priorityNode_,t)}}isIndexed(e){return e===ts||this.indexMap_.hasIndex(e)}equals(e){if(e===this)return!0;if(e.isLeafNode())return!1;{const t=e;if(this.getPriority().equals(t.getPriority()))if(this.children_.count()===t.children_.count()){const s=this.getIterator(Ee),i=t.getIterator(Ee);let r=s.getNext(),o=i.getNext();for(;r&&o;){if(r.name!==o.name||!r.node.equals(o.node))return!1;r=s.getNext(),o=i.getNext()}return r===null&&o===null}else return!1;else return!1}}resolveIndex_(e){return e===ts?null:this.indexMap_.get(e.toString())}}$.INTEGER_REGEXP_=/^(0|[1-9]\d*)$/;class sC extends ${constructor(){super(new pt(vh),$.EMPTY_NODE,Zt.Default)}compareTo(e){return e===this?0:1}equals(e){return e===this}getPriority(){return this}getImmediateChild(e){return $.EMPTY_NODE}isEmpty(){return!1}}const Nr=new sC;Object.defineProperties(Z,{MIN:{value:new Z(ls,$.EMPTY_NODE)},MAX:{value:new Z(Nn,Nr)}});Bg.__EMPTY_NODE=$.EMPTY_NODE;Oe.__childrenNodeConstructor=$;Xb(Nr);Zb(Nr);/**
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
 */const iC=!0;function Re(n,e=null){if(n===null)return $.EMPTY_NODE;if(typeof n=="object"&&".priority"in n&&(e=n[".priority"]),M(e===null||typeof e=="string"||typeof e=="number"||typeof e=="object"&&".sv"in e,"Invalid priority type found: "+typeof e),typeof n=="object"&&".value"in n&&n[".value"]!==null&&(n=n[".value"]),typeof n!="object"||".sv"in n){const t=n;return new Oe(t,Re(e))}if(!(n instanceof Array)&&iC){const t=[];let s=!1;if(We(n,(o,l)=>{if(o.substring(0,1)!=="."){const c=Re(l);c.isEmpty()||(s=s||!c.getPriority().isEmpty(),t.push(new Z(o,c)))}}),t.length===0)return $.EMPTY_NODE;const r=Ko(t,Yb,o=>o.name,vh);if(s){const o=Ko(t,Ee.getCompare());return new $(r,Re(e),new Zt({".priority":o},{".priority":Ee}))}else return new $(r,Re(e),Zt.Default)}else{let t=$.EMPTY_NODE;return We(n,(s,i)=>{if(jt(n,s)&&s.substring(0,1)!=="."){const r=Re(i);(r.isLeafNode()||!r.isEmpty())&&(t=t.updateImmediateChild(s,r))}}),t.updatePriority(Re(e))}}Jb(Re);/**
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
 */class Eh extends xa{constructor(e){super(),this.indexPath_=e,M(!J(e)&&X(e)!==".priority","Can't create PathIndex with empty path or .priority key")}extractChild(e){return e.getChild(this.indexPath_)}isDefinedOn(e){return!e.getChild(this.indexPath_).isEmpty()}compare(e,t){const s=this.extractChild(e.node),i=this.extractChild(t.node),r=s.compareTo(i);return r===0?ps(e.name,t.name):r}makePost(e,t){const s=Re(e),i=$.EMPTY_NODE.updateChild(this.indexPath_,s);return new Z(t,i)}maxPost(){const e=$.EMPTY_NODE.updateChild(this.indexPath_,Nr);return new Z(Nn,e)}toString(){return lr(this.indexPath_,0).join("/")}}/**
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
 */class rC extends xa{compare(e,t){const s=e.node.compareTo(t.node);return s===0?ps(e.name,t.name):s}isDefinedOn(e){return!0}indexedValueChanged(e,t){return!e.equals(t)}minPost(){return Z.MIN}maxPost(){return Z.MAX}makePost(e,t){const s=Re(e);return new Z(t,s)}toString(){return".value"}}const $g=new rC;/**
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
 */function zg(n){return{type:"value",snapshotNode:n}}function Hs(n,e){return{type:"child_added",snapshotNode:e,childName:n}}function cr(n,e){return{type:"child_removed",snapshotNode:e,childName:n}}function hr(n,e,t){return{type:"child_changed",snapshotNode:e,childName:n,oldSnap:t}}function oC(n,e){return{type:"child_moved",snapshotNode:e,childName:n}}/**
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
 */class wh{constructor(e){this.index_=e}updateChild(e,t,s,i,r,o){M(e.isIndexed(this.index_),"A node must be indexed if only a child is updated");const l=e.getImmediateChild(t);return l.getChild(i).equals(s.getChild(i))&&l.isEmpty()===s.isEmpty()||(o!=null&&(s.isEmpty()?e.hasChild(t)?o.trackChildChange(cr(t,l)):M(e.isLeafNode(),"A child remove without an old child only makes sense on a leaf node"):l.isEmpty()?o.trackChildChange(Hs(t,s)):o.trackChildChange(hr(t,s,l))),e.isLeafNode()&&s.isEmpty())?e:e.updateImmediateChild(t,s).withIndex(this.index_)}updateFullNode(e,t,s){return s!=null&&(e.isLeafNode()||e.forEachChild(Ee,(i,r)=>{t.hasChild(i)||s.trackChildChange(cr(i,r))}),t.isLeafNode()||t.forEachChild(Ee,(i,r)=>{if(e.hasChild(i)){const o=e.getImmediateChild(i);o.equals(r)||s.trackChildChange(hr(i,r,o))}else s.trackChildChange(Hs(i,r))})),t.withIndex(this.index_)}updatePriority(e,t){return e.isEmpty()?$.EMPTY_NODE:e.updatePriority(t)}filtersNodes(){return!1}getIndexedFilter(){return this}getIndex(){return this.index_}}/**
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
 */class ur{constructor(e){this.indexedFilter_=new wh(e.getIndex()),this.index_=e.getIndex(),this.startPost_=ur.getStartPost_(e),this.endPost_=ur.getEndPost_(e),this.startIsInclusive_=!e.startAfterSet_,this.endIsInclusive_=!e.endBeforeSet_}getStartPost(){return this.startPost_}getEndPost(){return this.endPost_}matches(e){const t=this.startIsInclusive_?this.index_.compare(this.getStartPost(),e)<=0:this.index_.compare(this.getStartPost(),e)<0,s=this.endIsInclusive_?this.index_.compare(e,this.getEndPost())<=0:this.index_.compare(e,this.getEndPost())<0;return t&&s}updateChild(e,t,s,i,r,o){return this.matches(new Z(t,s))||(s=$.EMPTY_NODE),this.indexedFilter_.updateChild(e,t,s,i,r,o)}updateFullNode(e,t,s){t.isLeafNode()&&(t=$.EMPTY_NODE);let i=t.withIndex(this.index_);i=i.updatePriority($.EMPTY_NODE);const r=this;return t.forEachChild(Ee,(o,l)=>{r.matches(new Z(o,l))||(i=i.updateImmediateChild(o,$.EMPTY_NODE))}),this.indexedFilter_.updateFullNode(e,i,s)}updatePriority(e,t){return e}filtersNodes(){return!0}getIndexedFilter(){return this.indexedFilter_}getIndex(){return this.index_}static getStartPost_(e){if(e.hasStart()){const t=e.getIndexStartName();return e.getIndex().makePost(e.getIndexStartValue(),t)}else return e.getIndex().minPost()}static getEndPost_(e){if(e.hasEnd()){const t=e.getIndexEndName();return e.getIndex().makePost(e.getIndexEndValue(),t)}else return e.getIndex().maxPost()}}/**
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
 */class aC{constructor(e){this.withinDirectionalStart=t=>this.reverse_?this.withinEndPost(t):this.withinStartPost(t),this.withinDirectionalEnd=t=>this.reverse_?this.withinStartPost(t):this.withinEndPost(t),this.withinStartPost=t=>{const s=this.index_.compare(this.rangedFilter_.getStartPost(),t);return this.startIsInclusive_?s<=0:s<0},this.withinEndPost=t=>{const s=this.index_.compare(t,this.rangedFilter_.getEndPost());return this.endIsInclusive_?s<=0:s<0},this.rangedFilter_=new ur(e),this.index_=e.getIndex(),this.limit_=e.getLimit(),this.reverse_=!e.isViewFromLeft(),this.startIsInclusive_=!e.startAfterSet_,this.endIsInclusive_=!e.endBeforeSet_}updateChild(e,t,s,i,r,o){return this.rangedFilter_.matches(new Z(t,s))||(s=$.EMPTY_NODE),e.getImmediateChild(t).equals(s)?e:e.numChildren()<this.limit_?this.rangedFilter_.getIndexedFilter().updateChild(e,t,s,i,r,o):this.fullLimitUpdateChild_(e,t,s,r,o)}updateFullNode(e,t,s){let i;if(t.isLeafNode()||t.isEmpty())i=$.EMPTY_NODE.withIndex(this.index_);else if(this.limit_*2<t.numChildren()&&t.isIndexed(this.index_)){i=$.EMPTY_NODE.withIndex(this.index_);let r;this.reverse_?r=t.getReverseIteratorFrom(this.rangedFilter_.getEndPost(),this.index_):r=t.getIteratorFrom(this.rangedFilter_.getStartPost(),this.index_);let o=0;for(;r.hasNext()&&o<this.limit_;){const l=r.getNext();if(this.withinDirectionalStart(l))if(this.withinDirectionalEnd(l))i=i.updateImmediateChild(l.name,l.node),o++;else break;else continue}}else{i=t.withIndex(this.index_),i=i.updatePriority($.EMPTY_NODE);let r;this.reverse_?r=i.getReverseIterator(this.index_):r=i.getIterator(this.index_);let o=0;for(;r.hasNext();){const l=r.getNext();o<this.limit_&&this.withinDirectionalStart(l)&&this.withinDirectionalEnd(l)?o++:i=i.updateImmediateChild(l.name,$.EMPTY_NODE)}}return this.rangedFilter_.getIndexedFilter().updateFullNode(e,i,s)}updatePriority(e,t){return e}filtersNodes(){return!0}getIndexedFilter(){return this.rangedFilter_.getIndexedFilter()}getIndex(){return this.index_}fullLimitUpdateChild_(e,t,s,i,r){let o;if(this.reverse_){const m=this.index_.getCompare();o=(p,E)=>m(E,p)}else o=this.index_.getCompare();const l=e;M(l.numChildren()===this.limit_,"");const c=new Z(t,s),h=this.reverse_?l.getFirstChild(this.index_):l.getLastChild(this.index_),d=this.rangedFilter_.matches(c);if(l.hasChild(t)){const m=l.getImmediateChild(t);let p=i.getChildAfterChild(this.index_,h,this.reverse_);for(;p!=null&&(p.name===t||l.hasChild(p.name));)p=i.getChildAfterChild(this.index_,p,this.reverse_);const E=p==null?1:o(p,c);if(d&&!s.isEmpty()&&E>=0)return r!=null&&r.trackChildChange(hr(t,s,m)),l.updateImmediateChild(t,s);{r!=null&&r.trackChildChange(cr(t,m));const A=l.updateImmediateChild(t,$.EMPTY_NODE);return p!=null&&this.rangedFilter_.matches(p)?(r!=null&&r.trackChildChange(Hs(p.name,p.node)),A.updateImmediateChild(p.name,p.node)):A}}else return s.isEmpty()?e:d&&o(h,c)>=0?(r!=null&&(r.trackChildChange(cr(h.name,h.node)),r.trackChildChange(Hs(t,s))),l.updateImmediateChild(t,s).updateImmediateChild(h.name,$.EMPTY_NODE)):e}}/**
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
 */class Th{constructor(){this.limitSet_=!1,this.startSet_=!1,this.startNameSet_=!1,this.startAfterSet_=!1,this.endSet_=!1,this.endNameSet_=!1,this.endBeforeSet_=!1,this.limit_=0,this.viewFrom_="",this.indexStartValue_=null,this.indexStartName_="",this.indexEndValue_=null,this.indexEndName_="",this.index_=Ee}hasStart(){return this.startSet_}isViewFromLeft(){return this.viewFrom_===""?this.startSet_:this.viewFrom_==="l"}getIndexStartValue(){return M(this.startSet_,"Only valid if start has been set"),this.indexStartValue_}getIndexStartName(){return M(this.startSet_,"Only valid if start has been set"),this.startNameSet_?this.indexStartName_:ls}hasEnd(){return this.endSet_}getIndexEndValue(){return M(this.endSet_,"Only valid if end has been set"),this.indexEndValue_}getIndexEndName(){return M(this.endSet_,"Only valid if end has been set"),this.endNameSet_?this.indexEndName_:Nn}hasLimit(){return this.limitSet_}hasAnchoredLimit(){return this.limitSet_&&this.viewFrom_!==""}getLimit(){return M(this.limitSet_,"Only valid if limit has been set"),this.limit_}getIndex(){return this.index_}loadsAllData(){return!(this.startSet_||this.endSet_||this.limitSet_)}isDefault(){return this.loadsAllData()&&this.index_===Ee}copy(){const e=new Th;return e.limitSet_=this.limitSet_,e.limit_=this.limit_,e.startSet_=this.startSet_,e.startAfterSet_=this.startAfterSet_,e.indexStartValue_=this.indexStartValue_,e.startNameSet_=this.startNameSet_,e.indexStartName_=this.indexStartName_,e.endSet_=this.endSet_,e.endBeforeSet_=this.endBeforeSet_,e.indexEndValue_=this.indexEndValue_,e.endNameSet_=this.endNameSet_,e.indexEndName_=this.indexEndName_,e.index_=this.index_,e.viewFrom_=this.viewFrom_,e}}function lC(n){return n.loadsAllData()?new wh(n.getIndex()):n.hasLimit()?new aC(n):new ur(n)}function cC(n,e,t){const s=n.copy();return s.endSet_=!0,e===void 0&&(e=null),s.indexEndValue_=e,t!==void 0?(s.endNameSet_=!0,s.indexEndName_=t):(s.endNameSet_=!1,s.indexEndName_=""),s}function hC(n,e){const t=n.copy();return t.index_=e,t}function If(n){const e={};if(n.isDefault())return e;let t;if(n.index_===Ee?t="$priority":n.index_===$g?t="$value":n.index_===ts?t="$key":(M(n.index_ instanceof Eh,"Unrecognized index type!"),t=n.index_.toString()),e.orderBy=xe(t),n.startSet_){const s=n.startAfterSet_?"startAfter":"startAt";e[s]=xe(n.indexStartValue_),n.startNameSet_&&(e[s]+=","+xe(n.indexStartName_))}if(n.endSet_){const s=n.endBeforeSet_?"endBefore":"endAt";e[s]=xe(n.indexEndValue_),n.endNameSet_&&(e[s]+=","+xe(n.indexEndName_))}return n.limitSet_&&(n.isViewFromLeft()?e.limitToFirst=n.limit_:e.limitToLast=n.limit_),e}function bf(n){const e={};if(n.startSet_&&(e.sp=n.indexStartValue_,n.startNameSet_&&(e.sn=n.indexStartName_),e.sin=!n.startAfterSet_),n.endSet_&&(e.ep=n.indexEndValue_,n.endNameSet_&&(e.en=n.indexEndName_),e.ein=!n.endBeforeSet_),n.limitSet_){e.l=n.limit_;let t=n.viewFrom_;t===""&&(n.isViewFromLeft()?t="l":t="r"),e.vf=t}return n.index_!==Ee&&(e.i=n.index_.toString()),e}/**
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
 */class Qo extends Lg{constructor(e,t,s,i){super(),this.repoInfo_=e,this.onDataUpdate_=t,this.authTokenProvider_=s,this.appCheckTokenProvider_=i,this.log_=Pr("p:rest:"),this.listens_={}}reportStats(e){throw new Error("Method not implemented.")}static getListenId_(e,t){return t!==void 0?"tag$"+t:(M(e._queryParams.isDefault(),"should have a tag if it's not a default query."),e._path.toString())}listen(e,t,s,i){const r=e._path.toString();this.log_("Listen called for "+r+" "+e._queryIdentifier);const o=Qo.getListenId_(e,s),l={};this.listens_[o]=l;const c=If(e._queryParams);this.restRequest_(r+".json",c,(h,d)=>{let m=d;if(h===404&&(m=null,h=null),h===null&&this.onDataUpdate_(r,m,!1,s),Vs(this.listens_,o)===l){let p;h?h===401?p="permission_denied":p="rest_error:"+h:p="ok",i(p,null)}})}unlisten(e,t){const s=Qo.getListenId_(e,t);delete this.listens_[s]}get(e){const t=If(e._queryParams),s=e._path.toString(),i=new xt;return this.restRequest_(s+".json",t,(r,o)=>{let l=o;r===404&&(l=null,r=null),r===null?(this.onDataUpdate_(s,l,!1,null),i.resolve(l)):i.reject(new Error(l))}),i.promise}refreshAuthToken(e){}restRequest_(e,t={},s){return t.format="export",Promise.all([this.authTokenProvider_.getToken(!1),this.appCheckTokenProvider_.getToken(!1)]).then(([i,r])=>{i&&i.accessToken&&(t.auth=i.accessToken),r&&r.token&&(t.ac=r.token);const o=(this.repoInfo_.secure?"https://":"http://")+this.repoInfo_.host+e+"?ns="+this.repoInfo_.namespace+ei(t);this.log_("Sending REST request for "+o);const l=new XMLHttpRequest;l.onreadystatechange=()=>{if(s&&l.readyState===4){this.log_("REST Response for "+o+" received. status:",l.status,"response:",l.responseText);let c=null;if(l.status>=200&&l.status<300){try{c=Ji(l.responseText)}catch{ft("Failed to parse JSON response for "+o+": "+l.responseText)}s(null,c)}else l.status!==401&&l.status!==404&&ft("Got unsuccessful REST response for "+o+" Status: "+l.status),s(l.status);s=null}},l.open("GET",o,!0),l.send()})}}/**
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
 */class uC{constructor(){this.rootNode_=$.EMPTY_NODE}getNode(e){return this.rootNode_.getChild(e)}updateSnapshot(e,t){this.rootNode_=this.rootNode_.updateChild(e,t)}}/**
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
 */function Yo(){return{value:null,children:new Map}}function ai(n,e,t){if(J(e))n.value=t,n.children.clear();else if(n.value!==null)n.value=n.value.updateChild(e,t);else{const s=X(e);n.children.has(s)||n.children.set(s,Yo());const i=n.children.get(s);e=pe(e),ai(i,e,t)}}function sc(n,e){if(J(e))return n.value=null,n.children.clear(),!0;if(n.value!==null){if(n.value.isLeafNode())return!1;{const t=n.value;return n.value=null,t.forEachChild(Ee,(s,i)=>{ai(n,new ue(s),i)}),sc(n,e)}}else if(n.children.size>0){const t=X(e);return e=pe(e),n.children.has(t)&&sc(n.children.get(t),e)&&n.children.delete(t),n.children.size===0}else return!0}function ic(n,e,t){n.value!==null?t(e,n.value):dC(n,(s,i)=>{const r=new ue(e.toString()+"/"+s);ic(i,r,t)})}function dC(n,e){n.children.forEach((t,s)=>{e(s,t)})}/**
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
 */const Cf=10*1e3,mC=30*1e3,pC=5*60*1e3;class gC{constructor(e,t){this.server_=t,this.statsToReport_={},this.statsListener_=new fC(e);const s=Cf+(mC-Cf)*Math.random();zi(this.reportStats_.bind(this),Math.floor(s))}reportStats_(){const e=this.statsListener_.get(),t={};let s=!1;We(e,(i,r)=>{r>0&&jt(this.statsToReport_,i)&&(t[i]=r,s=!0)}),s&&this.server_.reportStats(t),zi(this.reportStats_.bind(this),Math.floor(Math.random()*2*pC))}}/**
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
 */var At;(function(n){n[n.OVERWRITE=0]="OVERWRITE",n[n.MERGE=1]="MERGE",n[n.ACK_USER_WRITE=2]="ACK_USER_WRITE",n[n.LISTEN_COMPLETE=3]="LISTEN_COMPLETE"})(At||(At={}));function Ih(){return{fromUser:!0,fromServer:!1,queryId:null,tagged:!1}}function bh(){return{fromUser:!1,fromServer:!0,queryId:null,tagged:!1}}function Ch(n){return{fromUser:!1,fromServer:!0,queryId:n,tagged:!0}}/**
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
 */class Xo{constructor(e,t,s){this.path=e,this.affectedTree=t,this.revert=s,this.type=At.ACK_USER_WRITE,this.source=Ih()}operationForChild(e){if(J(this.path)){if(this.affectedTree.value!=null)return M(this.affectedTree.children.isEmpty(),"affectedTree should not have overlapping affected paths."),this;{const t=this.affectedTree.subtree(new ue(e));return new Xo(ce(),t,this.revert)}}else return M(X(this.path)===e,"operationForChild called for unrelated child."),new Xo(pe(this.path),this.affectedTree,this.revert)}}/**
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
 */class dr{constructor(e,t){this.source=e,this.path=t,this.type=At.LISTEN_COMPLETE}operationForChild(e){return J(this.path)?new dr(this.source,ce()):new dr(this.source,pe(this.path))}}/**
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
 */class cs{constructor(e,t,s){this.source=e,this.path=t,this.snap=s,this.type=At.OVERWRITE}operationForChild(e){return J(this.path)?new cs(this.source,ce(),this.snap.getImmediateChild(e)):new cs(this.source,pe(this.path),this.snap)}}/**
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
 */class Gs{constructor(e,t,s){this.source=e,this.path=t,this.children=s,this.type=At.MERGE}operationForChild(e){if(J(this.path)){const t=this.children.subtree(new ue(e));return t.isEmpty()?null:t.value?new cs(this.source,ce(),t.value):new Gs(this.source,ce(),t)}else return M(X(this.path)===e,"Can't get a merge for a child not on the path of the operation"),new Gs(this.source,pe(this.path),this.children)}toString(){return"Operation("+this.path+": "+this.source.toString()+" merge: "+this.children.toString()+")"}}/**
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
 */class xn{constructor(e,t,s){this.node_=e,this.fullyInitialized_=t,this.filtered_=s}isFullyInitialized(){return this.fullyInitialized_}isFiltered(){return this.filtered_}isCompleteForPath(e){if(J(e))return this.isFullyInitialized()&&!this.filtered_;const t=X(e);return this.isCompleteForChild(t)}isCompleteForChild(e){return this.isFullyInitialized()&&!this.filtered_||this.node_.hasChild(e)}getNode(){return this.node_}}/**
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
 */class _C{constructor(e){this.query_=e,this.index_=this.query_._queryParams.getIndex()}}function yC(n,e,t,s){const i=[],r=[];return e.forEach(o=>{o.type==="child_changed"&&n.index_.indexedValueChanged(o.oldSnap,o.snapshotNode)&&r.push(oC(o.childName,o.snapshotNode))}),Mi(n,i,"child_removed",e,s,t),Mi(n,i,"child_added",e,s,t),Mi(n,i,"child_moved",r,s,t),Mi(n,i,"child_changed",e,s,t),Mi(n,i,"value",e,s,t),i}function Mi(n,e,t,s,i,r){const o=s.filter(l=>l.type===t);o.sort((l,c)=>EC(n,l,c)),o.forEach(l=>{const c=vC(n,l,r);i.forEach(h=>{h.respondsTo(l.type)&&e.push(h.createEvent(c,n.query_))})})}function vC(n,e,t){return e.type==="value"||e.type==="child_removed"||(e.prevName=t.getPredecessorChildName(e.childName,e.snapshotNode,n.index_)),e}function EC(n,e,t){if(e.childName==null||t.childName==null)throw Zs("Should only compare child_ events.");const s=new Z(e.childName,e.snapshotNode),i=new Z(t.childName,t.snapshotNode);return n.index_.compare(s,i)}/**
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
 */function Ma(n,e){return{eventCache:n,serverCache:e}}function Hi(n,e,t,s){return Ma(new xn(e,t,s),n.serverCache)}function Hg(n,e,t,s){return Ma(n.eventCache,new xn(e,t,s))}function Jo(n){return n.eventCache.isFullyInitialized()?n.eventCache.getNode():null}function hs(n){return n.serverCache.isFullyInitialized()?n.serverCache.getNode():null}/**
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
 */let Sl;const wC=()=>(Sl||(Sl=new pt(rb)),Sl);class _e{constructor(e,t=wC()){this.value=e,this.children=t}static fromObject(e){let t=new _e(null);return We(e,(s,i)=>{t=t.set(new ue(s),i)}),t}isEmpty(){return this.value===null&&this.children.isEmpty()}findRootMostMatchingPathAndValue(e,t){if(this.value!=null&&t(this.value))return{path:ce(),value:this.value};if(J(e))return null;{const s=X(e),i=this.children.get(s);if(i!==null){const r=i.findRootMostMatchingPathAndValue(pe(e),t);return r!=null?{path:Te(new ue(s),r.path),value:r.value}:null}else return null}}findRootMostValueAndPath(e){return this.findRootMostMatchingPathAndValue(e,()=>!0)}subtree(e){if(J(e))return this;{const t=X(e),s=this.children.get(t);return s!==null?s.subtree(pe(e)):new _e(null)}}set(e,t){if(J(e))return new _e(t,this.children);{const s=X(e),r=(this.children.get(s)||new _e(null)).set(pe(e),t),o=this.children.insert(s,r);return new _e(this.value,o)}}remove(e){if(J(e))return this.children.isEmpty()?new _e(null):new _e(null,this.children);{const t=X(e),s=this.children.get(t);if(s){const i=s.remove(pe(e));let r;return i.isEmpty()?r=this.children.remove(t):r=this.children.insert(t,i),this.value===null&&r.isEmpty()?new _e(null):new _e(this.value,r)}else return this}}get(e){if(J(e))return this.value;{const t=X(e),s=this.children.get(t);return s?s.get(pe(e)):null}}setTree(e,t){if(J(e))return t;{const s=X(e),r=(this.children.get(s)||new _e(null)).setTree(pe(e),t);let o;return r.isEmpty()?o=this.children.remove(s):o=this.children.insert(s,r),new _e(this.value,o)}}fold(e){return this.fold_(ce(),e)}fold_(e,t){const s={};return this.children.inorderTraversal((i,r)=>{s[i]=r.fold_(Te(e,i),t)}),t(e,this.value,s)}findOnPath(e,t){return this.findOnPath_(e,ce(),t)}findOnPath_(e,t,s){const i=this.value?s(t,this.value):!1;if(i)return i;if(J(e))return null;{const r=X(e),o=this.children.get(r);return o?o.findOnPath_(pe(e),Te(t,r),s):null}}foreachOnPath(e,t){return this.foreachOnPath_(e,ce(),t)}foreachOnPath_(e,t,s){if(J(e))return this;{this.value&&s(t,this.value);const i=X(e),r=this.children.get(i);return r?r.foreachOnPath_(pe(e),Te(t,i),s):new _e(null)}}foreach(e){this.foreach_(ce(),e)}foreach_(e,t){this.children.inorderTraversal((s,i)=>{i.foreach_(Te(e,s),t)}),this.value&&t(e,this.value)}foreachChild(e){this.children.inorderTraversal((t,s)=>{s.value&&e(t,s.value)})}}/**
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
 */class Pt{constructor(e){this.writeTree_=e}static empty(){return new Pt(new _e(null))}}function Gi(n,e,t){if(J(e))return new Pt(new _e(t));{const s=n.writeTree_.findRootMostValueAndPath(e);if(s!=null){const i=s.path;let r=s.value;const o=dt(i,e);return r=r.updateChild(o,t),new Pt(n.writeTree_.set(i,r))}else{const i=new _e(t),r=n.writeTree_.setTree(e,i);return new Pt(r)}}}function rc(n,e,t){let s=n;return We(t,(i,r)=>{s=Gi(s,Te(e,i),r)}),s}function Rf(n,e){if(J(e))return Pt.empty();{const t=n.writeTree_.setTree(e,new _e(null));return new Pt(t)}}function oc(n,e){return gs(n,e)!=null}function gs(n,e){const t=n.writeTree_.findRootMostValueAndPath(e);return t!=null?n.writeTree_.get(t.path).getChild(dt(t.path,e)):null}function Sf(n){const e=[],t=n.writeTree_.value;return t!=null?t.isLeafNode()||t.forEachChild(Ee,(s,i)=>{e.push(new Z(s,i))}):n.writeTree_.children.inorderTraversal((s,i)=>{i.value!=null&&e.push(new Z(s,i.value))}),e}function Cn(n,e){if(J(e))return n;{const t=gs(n,e);return t!=null?new Pt(new _e(t)):new Pt(n.writeTree_.subtree(e))}}function ac(n){return n.writeTree_.isEmpty()}function Ks(n,e){return Gg(ce(),n.writeTree_,e)}function Gg(n,e,t){if(e.value!=null)return t.updateChild(n,e.value);{let s=null;return e.children.inorderTraversal((i,r)=>{i===".priority"?(M(r.value!==null,"Priority writes must always be leaf nodes"),s=r.value):t=Gg(Te(n,i),r,t)}),!t.getChild(n).isEmpty()&&s!==null&&(t=t.updateChild(Te(n,".priority"),s)),t}}/**
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
 */function La(n,e){return Xg(e,n)}function TC(n,e,t,s,i){M(s>n.lastWriteId,"Stacking an older write on top of newer ones"),i===void 0&&(i=!0),n.allWrites.push({path:e,snap:t,writeId:s,visible:i}),i&&(n.visibleWrites=Gi(n.visibleWrites,e,t)),n.lastWriteId=s}function IC(n,e,t,s){M(s>n.lastWriteId,"Stacking an older merge on top of newer ones"),n.allWrites.push({path:e,children:t,writeId:s,visible:!0}),n.visibleWrites=rc(n.visibleWrites,e,t),n.lastWriteId=s}function bC(n,e){for(let t=0;t<n.allWrites.length;t++){const s=n.allWrites[t];if(s.writeId===e)return s}return null}function CC(n,e){const t=n.allWrites.findIndex(l=>l.writeId===e);M(t>=0,"removeWrite called with nonexistent writeId.");const s=n.allWrites[t];n.allWrites.splice(t,1);let i=s.visible,r=!1,o=n.allWrites.length-1;for(;i&&o>=0;){const l=n.allWrites[o];l.visible&&(o>=t&&RC(l,s.path)?i=!1:It(s.path,l.path)&&(r=!0)),o--}if(i){if(r)return SC(n),!0;if(s.snap)n.visibleWrites=Rf(n.visibleWrites,s.path);else{const l=s.children;We(l,c=>{n.visibleWrites=Rf(n.visibleWrites,Te(s.path,c))})}return!0}else return!1}function RC(n,e){if(n.snap)return It(n.path,e);for(const t in n.children)if(n.children.hasOwnProperty(t)&&It(Te(n.path,t),e))return!0;return!1}function SC(n){n.visibleWrites=Kg(n.allWrites,AC,ce()),n.allWrites.length>0?n.lastWriteId=n.allWrites[n.allWrites.length-1].writeId:n.lastWriteId=-1}function AC(n){return n.visible}function Kg(n,e,t){let s=Pt.empty();for(let i=0;i<n.length;++i){const r=n[i];if(e(r)){const o=r.path;let l;if(r.snap)It(t,o)?(l=dt(t,o),s=Gi(s,l,r.snap)):It(o,t)&&(l=dt(o,t),s=Gi(s,ce(),r.snap.getChild(l)));else if(r.children){if(It(t,o))l=dt(t,o),s=rc(s,l,r.children);else if(It(o,t))if(l=dt(o,t),J(l))s=rc(s,ce(),r.children);else{const c=Vs(r.children,X(l));if(c){const h=c.getChild(pe(l));s=Gi(s,ce(),h)}}}else throw Zs("WriteRecord should have .snap or .children")}}return s}function Qg(n,e,t,s,i){if(!s&&!i){const r=gs(n.visibleWrites,e);if(r!=null)return r;{const o=Cn(n.visibleWrites,e);if(ac(o))return t;if(t==null&&!oc(o,ce()))return null;{const l=t||$.EMPTY_NODE;return Ks(o,l)}}}else{const r=Cn(n.visibleWrites,e);if(!i&&ac(r))return t;if(!i&&t==null&&!oc(r,ce()))return null;{const o=function(h){return(h.visible||i)&&(!s||!~s.indexOf(h.writeId))&&(It(h.path,e)||It(e,h.path))},l=Kg(n.allWrites,o,e),c=t||$.EMPTY_NODE;return Ks(l,c)}}}function kC(n,e,t){let s=$.EMPTY_NODE;const i=gs(n.visibleWrites,e);if(i)return i.isLeafNode()||i.forEachChild(Ee,(r,o)=>{s=s.updateImmediateChild(r,o)}),s;if(t){const r=Cn(n.visibleWrites,e);return t.forEachChild(Ee,(o,l)=>{const c=Ks(Cn(r,new ue(o)),l);s=s.updateImmediateChild(o,c)}),Sf(r).forEach(o=>{s=s.updateImmediateChild(o.name,o.node)}),s}else{const r=Cn(n.visibleWrites,e);return Sf(r).forEach(o=>{s=s.updateImmediateChild(o.name,o.node)}),s}}function PC(n,e,t,s,i){M(s||i,"Either existingEventSnap or existingServerSnap must exist");const r=Te(e,t);if(oc(n.visibleWrites,r))return null;{const o=Cn(n.visibleWrites,r);return ac(o)?i.getChild(t):Ks(o,i.getChild(t))}}function NC(n,e,t,s){const i=Te(e,t),r=gs(n.visibleWrites,i);if(r!=null)return r;if(s.isCompleteForChild(t)){const o=Cn(n.visibleWrites,i);return Ks(o,s.getNode().getImmediateChild(t))}else return null}function DC(n,e){return gs(n.visibleWrites,e)}function xC(n,e,t,s,i,r,o){let l;const c=Cn(n.visibleWrites,e),h=gs(c,ce());if(h!=null)l=h;else if(t!=null)l=Ks(c,t);else return[];if(l=l.withIndex(o),!l.isEmpty()&&!l.isLeafNode()){const d=[],m=o.getCompare(),p=r?l.getReverseIteratorFrom(s,o):l.getIteratorFrom(s,o);let E=p.getNext();for(;E&&d.length<i;)m(E,s)!==0&&d.push(E),E=p.getNext();return d}else return[]}function MC(){return{visibleWrites:Pt.empty(),allWrites:[],lastWriteId:-1}}function Zo(n,e,t,s){return Qg(n.writeTree,n.treePath,e,t,s)}function Rh(n,e){return kC(n.writeTree,n.treePath,e)}function Af(n,e,t,s){return PC(n.writeTree,n.treePath,e,t,s)}function ea(n,e){return DC(n.writeTree,Te(n.treePath,e))}function LC(n,e,t,s,i,r){return xC(n.writeTree,n.treePath,e,t,s,i,r)}function Sh(n,e,t){return NC(n.writeTree,n.treePath,e,t)}function Yg(n,e){return Xg(Te(n.treePath,e),n.writeTree)}function Xg(n,e){return{treePath:n,writeTree:e}}/**
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
 */class OC{constructor(){this.changeMap=new Map}trackChildChange(e){const t=e.type,s=e.childName;M(t==="child_added"||t==="child_changed"||t==="child_removed","Only child changes supported for tracking"),M(s!==".priority","Only non-priority child changes can be tracked.");const i=this.changeMap.get(s);if(i){const r=i.type;if(t==="child_added"&&r==="child_removed")this.changeMap.set(s,hr(s,e.snapshotNode,i.snapshotNode));else if(t==="child_removed"&&r==="child_added")this.changeMap.delete(s);else if(t==="child_removed"&&r==="child_changed")this.changeMap.set(s,cr(s,i.oldSnap));else if(t==="child_changed"&&r==="child_added")this.changeMap.set(s,Hs(s,e.snapshotNode));else if(t==="child_changed"&&r==="child_changed")this.changeMap.set(s,hr(s,e.snapshotNode,i.oldSnap));else throw Zs("Illegal combination of changes: "+e+" occurred after "+i)}else this.changeMap.set(s,e)}getChanges(){return Array.from(this.changeMap.values())}}/**
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
 */class VC{getCompleteChild(e){return null}getChildAfterChild(e,t,s){return null}}const Jg=new VC;class Ah{constructor(e,t,s=null){this.writes_=e,this.viewCache_=t,this.optCompleteServerCache_=s}getCompleteChild(e){const t=this.viewCache_.eventCache;if(t.isCompleteForChild(e))return t.getNode().getImmediateChild(e);{const s=this.optCompleteServerCache_!=null?new xn(this.optCompleteServerCache_,!0,!1):this.viewCache_.serverCache;return Sh(this.writes_,e,s)}}getChildAfterChild(e,t,s){const i=this.optCompleteServerCache_!=null?this.optCompleteServerCache_:hs(this.viewCache_),r=LC(this.writes_,i,t,1,s,e);return r.length===0?null:r[0]}}/**
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
 */function FC(n){return{filter:n}}function BC(n,e){M(e.eventCache.getNode().isIndexed(n.filter.getIndex()),"Event snap not indexed"),M(e.serverCache.getNode().isIndexed(n.filter.getIndex()),"Server snap not indexed")}function UC(n,e,t,s,i){const r=new OC;let o,l;if(t.type===At.OVERWRITE){const h=t;h.source.fromUser?o=lc(n,e,h.path,h.snap,s,i,r):(M(h.source.fromServer,"Unknown source."),l=h.source.tagged||e.serverCache.isFiltered()&&!J(h.path),o=ta(n,e,h.path,h.snap,s,i,l,r))}else if(t.type===At.MERGE){const h=t;h.source.fromUser?o=WC(n,e,h.path,h.children,s,i,r):(M(h.source.fromServer,"Unknown source."),l=h.source.tagged||e.serverCache.isFiltered(),o=cc(n,e,h.path,h.children,s,i,l,r))}else if(t.type===At.ACK_USER_WRITE){const h=t;h.revert?o=zC(n,e,h.path,s,i,r):o=qC(n,e,h.path,h.affectedTree,s,i,r)}else if(t.type===At.LISTEN_COMPLETE)o=$C(n,e,t.path,s,r);else throw Zs("Unknown operation type: "+t.type);const c=r.getChanges();return jC(e,o,c),{viewCache:o,changes:c}}function jC(n,e,t){const s=e.eventCache;if(s.isFullyInitialized()){const i=s.getNode().isLeafNode()||s.getNode().isEmpty(),r=Jo(n);(t.length>0||!n.eventCache.isFullyInitialized()||i&&!s.getNode().equals(r)||!s.getNode().getPriority().equals(r.getPriority()))&&t.push(zg(Jo(e)))}}function Zg(n,e,t,s,i,r){const o=e.eventCache;if(ea(s,t)!=null)return e;{let l,c;if(J(t))if(M(e.serverCache.isFullyInitialized(),"If change path is empty, we must have complete server data"),e.serverCache.isFiltered()){const h=hs(e),d=h instanceof $?h:$.EMPTY_NODE,m=Rh(s,d);l=n.filter.updateFullNode(e.eventCache.getNode(),m,r)}else{const h=Zo(s,hs(e));l=n.filter.updateFullNode(e.eventCache.getNode(),h,r)}else{const h=X(t);if(h===".priority"){M(Dn(t)===1,"Can't have a priority with additional path components");const d=o.getNode();c=e.serverCache.getNode();const m=Af(s,t,d,c);m!=null?l=n.filter.updatePriority(d,m):l=o.getNode()}else{const d=pe(t);let m;if(o.isCompleteForChild(h)){c=e.serverCache.getNode();const p=Af(s,t,o.getNode(),c);p!=null?m=o.getNode().getImmediateChild(h).updateChild(d,p):m=o.getNode().getImmediateChild(h)}else m=Sh(s,h,e.serverCache);m!=null?l=n.filter.updateChild(o.getNode(),h,m,d,i,r):l=o.getNode()}}return Hi(e,l,o.isFullyInitialized()||J(t),n.filter.filtersNodes())}}function ta(n,e,t,s,i,r,o,l){const c=e.serverCache;let h;const d=o?n.filter:n.filter.getIndexedFilter();if(J(t))h=d.updateFullNode(c.getNode(),s,null);else if(d.filtersNodes()&&!c.isFiltered()){const E=c.getNode().updateChild(t,s);h=d.updateFullNode(c.getNode(),E,null)}else{const E=X(t);if(!c.isCompleteForPath(t)&&Dn(t)>1)return e;const b=pe(t),P=c.getNode().getImmediateChild(E).updateChild(b,s);E===".priority"?h=d.updatePriority(c.getNode(),P):h=d.updateChild(c.getNode(),E,P,b,Jg,null)}const m=Hg(e,h,c.isFullyInitialized()||J(t),d.filtersNodes()),p=new Ah(i,m,r);return Zg(n,m,t,i,p,l)}function lc(n,e,t,s,i,r,o){const l=e.eventCache;let c,h;const d=new Ah(i,e,r);if(J(t))h=n.filter.updateFullNode(e.eventCache.getNode(),s,o),c=Hi(e,h,!0,n.filter.filtersNodes());else{const m=X(t);if(m===".priority")h=n.filter.updatePriority(e.eventCache.getNode(),s),c=Hi(e,h,l.isFullyInitialized(),l.isFiltered());else{const p=pe(t),E=l.getNode().getImmediateChild(m);let b;if(J(p))b=s;else{const A=d.getCompleteChild(m);A!=null?gh(p)===".priority"&&A.getChild(Vg(p)).isEmpty()?b=A:b=A.updateChild(p,s):b=$.EMPTY_NODE}if(E.equals(b))c=e;else{const A=n.filter.updateChild(l.getNode(),m,b,p,d,o);c=Hi(e,A,l.isFullyInitialized(),n.filter.filtersNodes())}}}return c}function kf(n,e){return n.eventCache.isCompleteForChild(e)}function WC(n,e,t,s,i,r,o){let l=e;return s.foreach((c,h)=>{const d=Te(t,c);kf(e,X(d))&&(l=lc(n,l,d,h,i,r,o))}),s.foreach((c,h)=>{const d=Te(t,c);kf(e,X(d))||(l=lc(n,l,d,h,i,r,o))}),l}function Pf(n,e,t){return t.foreach((s,i)=>{e=e.updateChild(s,i)}),e}function cc(n,e,t,s,i,r,o,l){if(e.serverCache.getNode().isEmpty()&&!e.serverCache.isFullyInitialized())return e;let c=e,h;J(t)?h=s:h=new _e(null).setTree(t,s);const d=e.serverCache.getNode();return h.children.inorderTraversal((m,p)=>{if(d.hasChild(m)){const E=e.serverCache.getNode().getImmediateChild(m),b=Pf(n,E,p);c=ta(n,c,new ue(m),b,i,r,o,l)}}),h.children.inorderTraversal((m,p)=>{const E=!e.serverCache.isCompleteForChild(m)&&p.value===null;if(!d.hasChild(m)&&!E){const b=e.serverCache.getNode().getImmediateChild(m),A=Pf(n,b,p);c=ta(n,c,new ue(m),A,i,r,o,l)}}),c}function qC(n,e,t,s,i,r,o){if(ea(i,t)!=null)return e;const l=e.serverCache.isFiltered(),c=e.serverCache;if(s.value!=null){if(J(t)&&c.isFullyInitialized()||c.isCompleteForPath(t))return ta(n,e,t,c.getNode().getChild(t),i,r,l,o);if(J(t)){let h=new _e(null);return c.getNode().forEachChild(ts,(d,m)=>{h=h.set(new ue(d),m)}),cc(n,e,t,h,i,r,l,o)}else return e}else{let h=new _e(null);return s.foreach((d,m)=>{const p=Te(t,d);c.isCompleteForPath(p)&&(h=h.set(d,c.getNode().getChild(p)))}),cc(n,e,t,h,i,r,l,o)}}function $C(n,e,t,s,i){const r=e.serverCache,o=Hg(e,r.getNode(),r.isFullyInitialized()||J(t),r.isFiltered());return Zg(n,o,t,s,Jg,i)}function zC(n,e,t,s,i,r){let o;if(ea(s,t)!=null)return e;{const l=new Ah(s,e,i),c=e.eventCache.getNode();let h;if(J(t)||X(t)===".priority"){let d;if(e.serverCache.isFullyInitialized())d=Zo(s,hs(e));else{const m=e.serverCache.getNode();M(m instanceof $,"serverChildren would be complete if leaf node"),d=Rh(s,m)}d=d,h=n.filter.updateFullNode(c,d,r)}else{const d=X(t);let m=Sh(s,d,e.serverCache);m==null&&e.serverCache.isCompleteForChild(d)&&(m=c.getImmediateChild(d)),m!=null?h=n.filter.updateChild(c,d,m,pe(t),l,r):e.eventCache.getNode().hasChild(d)?h=n.filter.updateChild(c,d,$.EMPTY_NODE,pe(t),l,r):h=c,h.isEmpty()&&e.serverCache.isFullyInitialized()&&(o=Zo(s,hs(e)),o.isLeafNode()&&(h=n.filter.updateFullNode(h,o,r)))}return o=e.serverCache.isFullyInitialized()||ea(s,ce())!=null,Hi(e,h,o,n.filter.filtersNodes())}}/**
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
 */class HC{constructor(e,t){this.query_=e,this.eventRegistrations_=[];const s=this.query_._queryParams,i=new wh(s.getIndex()),r=lC(s);this.processor_=FC(r);const o=t.serverCache,l=t.eventCache,c=i.updateFullNode($.EMPTY_NODE,o.getNode(),null),h=r.updateFullNode($.EMPTY_NODE,l.getNode(),null),d=new xn(c,o.isFullyInitialized(),i.filtersNodes()),m=new xn(h,l.isFullyInitialized(),r.filtersNodes());this.viewCache_=Ma(m,d),this.eventGenerator_=new _C(this.query_)}get query(){return this.query_}}function GC(n){return n.viewCache_.serverCache.getNode()}function KC(n){return Jo(n.viewCache_)}function QC(n,e){const t=hs(n.viewCache_);return t&&(n.query._queryParams.loadsAllData()||!J(e)&&!t.getImmediateChild(X(e)).isEmpty())?t.getChild(e):null}function Nf(n){return n.eventRegistrations_.length===0}function YC(n,e){n.eventRegistrations_.push(e)}function Df(n,e,t){const s=[];if(t){M(e==null,"A cancel should cancel all event registrations.");const i=n.query._path;n.eventRegistrations_.forEach(r=>{const o=r.createCancelEvent(t,i);o&&s.push(o)})}if(e){let i=[];for(let r=0;r<n.eventRegistrations_.length;++r){const o=n.eventRegistrations_[r];if(!o.matches(e))i.push(o);else if(e.hasAnyCallback()){i=i.concat(n.eventRegistrations_.slice(r+1));break}}n.eventRegistrations_=i}else n.eventRegistrations_=[];return s}function xf(n,e,t,s){e.type===At.MERGE&&e.source.queryId!==null&&(M(hs(n.viewCache_),"We should always have a full cache before handling merges"),M(Jo(n.viewCache_),"Missing event cache, even though we have a server cache"));const i=n.viewCache_,r=UC(n.processor_,i,e,t,s);return BC(n.processor_,r.viewCache),M(r.viewCache.serverCache.isFullyInitialized()||!i.serverCache.isFullyInitialized(),"Once a server snap is complete, it should never go back"),n.viewCache_=r.viewCache,e_(n,r.changes,r.viewCache.eventCache.getNode(),null)}function XC(n,e){const t=n.viewCache_.eventCache,s=[];return t.getNode().isLeafNode()||t.getNode().forEachChild(Ee,(r,o)=>{s.push(Hs(r,o))}),t.isFullyInitialized()&&s.push(zg(t.getNode())),e_(n,s,t.getNode(),e)}function e_(n,e,t,s){const i=s?[s]:n.eventRegistrations_;return yC(n.eventGenerator_,e,t,i)}/**
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
 */let na;class t_{constructor(){this.views=new Map}}function JC(n){M(!na,"__referenceConstructor has already been defined"),na=n}function ZC(){return M(na,"Reference.ts has not been loaded"),na}function eR(n){return n.views.size===0}function kh(n,e,t,s){const i=e.source.queryId;if(i!==null){const r=n.views.get(i);return M(r!=null,"SyncTree gave us an op for an invalid query."),xf(r,e,t,s)}else{let r=[];for(const o of n.views.values())r=r.concat(xf(o,e,t,s));return r}}function n_(n,e,t,s,i){const r=e._queryIdentifier,o=n.views.get(r);if(!o){let l=Zo(t,i?s:null),c=!1;l?c=!0:s instanceof $?(l=Rh(t,s),c=!1):(l=$.EMPTY_NODE,c=!1);const h=Ma(new xn(l,c,!1),new xn(s,i,!1));return new HC(e,h)}return o}function tR(n,e,t,s,i,r){const o=n_(n,e,s,i,r);return n.views.has(e._queryIdentifier)||n.views.set(e._queryIdentifier,o),YC(o,t),XC(o,t)}function nR(n,e,t,s){const i=e._queryIdentifier,r=[];let o=[];const l=Mn(n);if(i==="default")for(const[c,h]of n.views.entries())o=o.concat(Df(h,t,s)),Nf(h)&&(n.views.delete(c),h.query._queryParams.loadsAllData()||r.push(h.query));else{const c=n.views.get(i);c&&(o=o.concat(Df(c,t,s)),Nf(c)&&(n.views.delete(i),c.query._queryParams.loadsAllData()||r.push(c.query)))}return l&&!Mn(n)&&r.push(new(ZC())(e._repo,e._path)),{removed:r,events:o}}function s_(n){const e=[];for(const t of n.views.values())t.query._queryParams.loadsAllData()||e.push(t);return e}function Rn(n,e){let t=null;for(const s of n.views.values())t=t||QC(s,e);return t}function i_(n,e){if(e._queryParams.loadsAllData())return Oa(n);{const s=e._queryIdentifier;return n.views.get(s)}}function r_(n,e){return i_(n,e)!=null}function Mn(n){return Oa(n)!=null}function Oa(n){for(const e of n.views.values())if(e.query._queryParams.loadsAllData())return e;return null}/**
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
 */let sa;function sR(n){M(!sa,"__referenceConstructor has already been defined"),sa=n}function iR(){return M(sa,"Reference.ts has not been loaded"),sa}let rR=1;class Mf{constructor(e){this.listenProvider_=e,this.syncPointTree_=new _e(null),this.pendingWriteTree_=MC(),this.tagToQueryMap=new Map,this.queryToTagMap=new Map}}function o_(n,e,t,s,i){return TC(n.pendingWriteTree_,e,t,s,i),i?li(n,new cs(Ih(),e,t)):[]}function oR(n,e,t,s){IC(n.pendingWriteTree_,e,t,s);const i=_e.fromObject(t);return li(n,new Gs(Ih(),e,i))}function En(n,e,t=!1){const s=bC(n.pendingWriteTree_,e);if(CC(n.pendingWriteTree_,e)){let r=new _e(null);return s.snap!=null?r=r.set(ce(),!0):We(s.children,o=>{r=r.set(new ue(o),!0)}),li(n,new Xo(s.path,r,t))}else return[]}function Dr(n,e,t){return li(n,new cs(bh(),e,t))}function aR(n,e,t){const s=_e.fromObject(t);return li(n,new Gs(bh(),e,s))}function lR(n,e){return li(n,new dr(bh(),e))}function cR(n,e,t){const s=Nh(n,t);if(s){const i=Dh(s),r=i.path,o=i.queryId,l=dt(r,e),c=new dr(Ch(o),l);return xh(n,r,c)}else return[]}function ia(n,e,t,s,i=!1){const r=e._path,o=n.syncPointTree_.get(r);let l=[];if(o&&(e._queryIdentifier==="default"||r_(o,e))){const c=nR(o,e,t,s);eR(o)&&(n.syncPointTree_=n.syncPointTree_.remove(r));const h=c.removed;if(l=c.events,!i){const d=h.findIndex(p=>p._queryParams.loadsAllData())!==-1,m=n.syncPointTree_.findOnPath(r,(p,E)=>Mn(E));if(d&&!m){const p=n.syncPointTree_.subtree(r);if(!p.isEmpty()){const E=dR(p);for(let b=0;b<E.length;++b){const A=E[b],P=A.query,F=h_(n,A);n.listenProvider_.startListening(Ki(P),fr(n,P),F.hashFn,F.onComplete)}}}!m&&h.length>0&&!s&&(d?n.listenProvider_.stopListening(Ki(e),null):h.forEach(p=>{const E=n.queryToTagMap.get(Va(p));n.listenProvider_.stopListening(Ki(p),E)}))}fR(n,h)}return l}function a_(n,e,t,s){const i=Nh(n,s);if(i!=null){const r=Dh(i),o=r.path,l=r.queryId,c=dt(o,e),h=new cs(Ch(l),c,t);return xh(n,o,h)}else return[]}function hR(n,e,t,s){const i=Nh(n,s);if(i){const r=Dh(i),o=r.path,l=r.queryId,c=dt(o,e),h=_e.fromObject(t),d=new Gs(Ch(l),c,h);return xh(n,o,d)}else return[]}function hc(n,e,t,s=!1){const i=e._path;let r=null,o=!1;n.syncPointTree_.foreachOnPath(i,(p,E)=>{const b=dt(p,i);r=r||Rn(E,b),o=o||Mn(E)});let l=n.syncPointTree_.get(i);l?(o=o||Mn(l),r=r||Rn(l,ce())):(l=new t_,n.syncPointTree_=n.syncPointTree_.set(i,l));let c;r!=null?c=!0:(c=!1,r=$.EMPTY_NODE,n.syncPointTree_.subtree(i).foreachChild((E,b)=>{const A=Rn(b,ce());A&&(r=r.updateImmediateChild(E,A))}));const h=r_(l,e);if(!h&&!e._queryParams.loadsAllData()){const p=Va(e);M(!n.queryToTagMap.has(p),"View does not exist, but we have a tag");const E=mR();n.queryToTagMap.set(p,E),n.tagToQueryMap.set(E,p)}const d=La(n.pendingWriteTree_,i);let m=tR(l,e,t,d,r,c);if(!h&&!o&&!s){const p=i_(l,e);m=m.concat(pR(n,e,p))}return m}function Ph(n,e,t){const i=n.pendingWriteTree_,r=n.syncPointTree_.findOnPath(e,(o,l)=>{const c=dt(o,e),h=Rn(l,c);if(h)return h});return Qg(i,e,r,t,!0)}function uR(n,e){const t=e._path;let s=null;n.syncPointTree_.foreachOnPath(t,(h,d)=>{const m=dt(h,t);s=s||Rn(d,m)});let i=n.syncPointTree_.get(t);i?s=s||Rn(i,ce()):(i=new t_,n.syncPointTree_=n.syncPointTree_.set(t,i));const r=s!=null,o=r?new xn(s,!0,!1):null,l=La(n.pendingWriteTree_,e._path),c=n_(i,e,l,r?o.getNode():$.EMPTY_NODE,r);return KC(c)}function li(n,e){return l_(e,n.syncPointTree_,null,La(n.pendingWriteTree_,ce()))}function l_(n,e,t,s){if(J(n.path))return c_(n,e,t,s);{const i=e.get(ce());t==null&&i!=null&&(t=Rn(i,ce()));let r=[];const o=X(n.path),l=n.operationForChild(o),c=e.children.get(o);if(c&&l){const h=t?t.getImmediateChild(o):null,d=Yg(s,o);r=r.concat(l_(l,c,h,d))}return i&&(r=r.concat(kh(i,n,s,t))),r}}function c_(n,e,t,s){const i=e.get(ce());t==null&&i!=null&&(t=Rn(i,ce()));let r=[];return e.children.inorderTraversal((o,l)=>{const c=t?t.getImmediateChild(o):null,h=Yg(s,o),d=n.operationForChild(o);d&&(r=r.concat(c_(d,l,c,h)))}),i&&(r=r.concat(kh(i,n,s,t))),r}function h_(n,e){const t=e.query,s=fr(n,t);return{hashFn:()=>(GC(e)||$.EMPTY_NODE).hash(),onComplete:i=>{if(i==="ok")return s?cR(n,t._path,s):lR(n,t._path);{const r=lb(i,t);return ia(n,t,null,r)}}}}function fr(n,e){const t=Va(e);return n.queryToTagMap.get(t)}function Va(n){return n._path.toString()+"$"+n._queryIdentifier}function Nh(n,e){return n.tagToQueryMap.get(e)}function Dh(n){const e=n.indexOf("$");return M(e!==-1&&e<n.length-1,"Bad queryKey."),{queryId:n.substr(e+1),path:new ue(n.substr(0,e))}}function xh(n,e,t){const s=n.syncPointTree_.get(e);M(s,"Missing sync point for query tag that we're tracking");const i=La(n.pendingWriteTree_,e);return kh(s,t,i,null)}function dR(n){return n.fold((e,t,s)=>{if(t&&Mn(t))return[Oa(t)];{let i=[];return t&&(i=s_(t)),We(s,(r,o)=>{i=i.concat(o)}),i}})}function Ki(n){return n._queryParams.loadsAllData()&&!n._queryParams.isDefault()?new(iR())(n._repo,n._path):n}function fR(n,e){for(let t=0;t<e.length;++t){const s=e[t];if(!s._queryParams.loadsAllData()){const i=Va(s),r=n.queryToTagMap.get(i);n.queryToTagMap.delete(i),n.tagToQueryMap.delete(r)}}}function mR(){return rR++}function pR(n,e,t){const s=e._path,i=fr(n,e),r=h_(n,t),o=n.listenProvider_.startListening(Ki(e),i,r.hashFn,r.onComplete),l=n.syncPointTree_.subtree(s);if(i)M(!Mn(l.value),"If we're adding a query, it shouldn't be shadowed");else{const c=l.fold((h,d,m)=>{if(!J(h)&&d&&Mn(d))return[Oa(d).query];{let p=[];return d&&(p=p.concat(s_(d).map(E=>E.query))),We(m,(E,b)=>{p=p.concat(b)}),p}});for(let h=0;h<c.length;++h){const d=c[h];n.listenProvider_.stopListening(Ki(d),fr(n,d))}}return o}/**
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
 */class Mh{constructor(e){this.node_=e}getImmediateChild(e){const t=this.node_.getImmediateChild(e);return new Mh(t)}node(){return this.node_}}class Lh{constructor(e,t){this.syncTree_=e,this.path_=t}getImmediateChild(e){const t=Te(this.path_,e);return new Lh(this.syncTree_,t)}node(){return Ph(this.syncTree_,this.path_)}}const gR=function(n){return n=n||{},n.timestamp=n.timestamp||new Date().getTime(),n},Lf=function(n,e,t){if(!n||typeof n!="object")return n;if(M(".sv"in n,"Unexpected leaf node or priority contents"),typeof n[".sv"]=="string")return _R(n[".sv"],e,t);if(typeof n[".sv"]=="object")return yR(n[".sv"],e);M(!1,"Unexpected server value: "+JSON.stringify(n,null,2))},_R=function(n,e,t){switch(n){case"timestamp":return t.timestamp;default:M(!1,"Unexpected server value: "+n)}},yR=function(n,e,t){n.hasOwnProperty("increment")||M(!1,"Unexpected server value: "+JSON.stringify(n,null,2));const s=n.increment;typeof s!="number"&&M(!1,"Unexpected increment value: "+s);const i=e.node();if(M(i!==null&&typeof i<"u","Expected ChildrenNode.EMPTY_NODE for nulls"),!i.isLeafNode())return s;const o=i.getValue();return typeof o!="number"?s:o+s},u_=function(n,e,t,s){return Oh(e,new Lh(t,n),s)},d_=function(n,e,t){return Oh(n,new Mh(e),t)};function Oh(n,e,t){const s=n.getPriority().val(),i=Lf(s,e.getImmediateChild(".priority"),t);let r;if(n.isLeafNode()){const o=n,l=Lf(o.getValue(),e,t);return l!==o.getValue()||i!==o.getPriority().val()?new Oe(l,Re(i)):n}else{const o=n;return r=o,i!==o.getPriority().val()&&(r=r.updatePriority(new Oe(i))),o.forEachChild(Ee,(l,c)=>{const h=Oh(c,e.getImmediateChild(l),t);h!==c&&(r=r.updateImmediateChild(l,h))}),r}}/**
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
 */class Vh{constructor(e="",t=null,s={children:{},childCount:0}){this.name=e,this.parent=t,this.node=s}}function Fh(n,e){let t=e instanceof ue?e:new ue(e),s=n,i=X(t);for(;i!==null;){const r=Vs(s.node.children,i)||{children:{},childCount:0};s=new Vh(i,s,r),t=pe(t),i=X(t)}return s}function ci(n){return n.node.value}function f_(n,e){n.node.value=e,uc(n)}function m_(n){return n.node.childCount>0}function vR(n){return ci(n)===void 0&&!m_(n)}function Fa(n,e){We(n.node.children,(t,s)=>{e(new Vh(t,n,s))})}function p_(n,e,t,s){t&&e(n),Fa(n,i=>{p_(i,e,!0)})}function ER(n,e,t){let s=n.parent;for(;s!==null;){if(e(s))return!0;s=s.parent}return!1}function xr(n){return new ue(n.parent===null?n.name:xr(n.parent)+"/"+n.name)}function uc(n){n.parent!==null&&wR(n.parent,n.name,n)}function wR(n,e,t){const s=vR(t),i=jt(n.node.children,e);s&&i?(delete n.node.children[e],n.node.childCount--,uc(n)):!s&&!i&&(n.node.children[e]=t.node,n.node.childCount++,uc(n))}/**
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
 */const TR=/[\[\].#$\/\u0000-\u001F\u007F]/,IR=/[\[\].#$\u0000-\u001F\u007F]/,Al=10*1024*1024,Bh=function(n){return typeof n=="string"&&n.length!==0&&!TR.test(n)},g_=function(n){return typeof n=="string"&&n.length!==0&&!IR.test(n)},bR=function(n){return n&&(n=n.replace(/^\/*\.info(\/|$)/,"/")),g_(n)},ra=function(n){return n===null||typeof n=="string"||typeof n=="number"&&!Da(n)||n&&typeof n=="object"&&jt(n,".sv")},mr=function(n,e,t,s){s&&e===void 0||Ba(Fs(n,"value"),e,t)},Ba=function(n,e,t){const s=t instanceof ue?new Wb(t,n):t;if(e===void 0)throw new Error(n+"contains undefined "+Kn(s));if(typeof e=="function")throw new Error(n+"contains a function "+Kn(s)+" with contents = "+e.toString());if(Da(e))throw new Error(n+"contains "+e.toString()+" "+Kn(s));if(typeof e=="string"&&e.length>Al/3&&da(e)>Al)throw new Error(n+"contains a string greater than "+Al+" utf8 bytes "+Kn(s)+" ('"+e.substring(0,50)+"...')");if(e&&typeof e=="object"){let i=!1,r=!1;if(We(e,(o,l)=>{if(o===".value")i=!0;else if(o!==".priority"&&o!==".sv"&&(r=!0,!Bh(o)))throw new Error(n+" contains an invalid key ("+o+") "+Kn(s)+`.  Keys must be non-empty strings and can't contain ".", "#", "$", "/", "[", or "]"`);qb(s,o),Ba(n,l,s),$b(s)}),i&&r)throw new Error(n+' contains ".value" child '+Kn(s)+" in addition to actual children.")}},CR=function(n,e){let t,s;for(t=0;t<e.length;t++){s=e[t];const r=lr(s);for(let o=0;o<r.length;o++)if(!(r[o]===".priority"&&o===r.length-1)){if(!Bh(r[o]))throw new Error(n+"contains an invalid key ("+r[o]+") in path "+s.toString()+`. Keys must be non-empty strings and can't contain ".", "#", "$", "/", "[", or "]"`)}}e.sort(jb);let i=null;for(t=0;t<e.length;t++){if(s=e[t],i!==null&&It(i,s))throw new Error(n+"contains a path "+i.toString()+" that is ancestor of another path "+s.toString());i=s}},__=function(n,e,t,s){const i=Fs(n,"values");if(!(e&&typeof e=="object")||Array.isArray(e))throw new Error(i+" must be an object containing the children to replace.");const r=[];We(e,(o,l)=>{const c=new ue(o);if(Ba(i,l,Te(t,c)),gh(c)===".priority"&&!ra(l))throw new Error(i+"contains an invalid value for '"+c.toString()+"', which must be a valid Firebase priority (a string, finite number, server value, or null).");r.push(c)}),CR(i,r)},RR=function(n,e,t){if(Da(e))throw new Error(Fs(n,"priority")+"is "+e.toString()+", but must be a valid Firebase priority (a string, finite number, server value, or null).");if(!ra(e))throw new Error(Fs(n,"priority")+"must be a valid Firebase priority (a string, finite number, server value, or null).")},Uh=function(n,e,t,s){if(!g_(t))throw new Error(Fs(n,e)+'was an invalid path = "'+t+`". Paths must be non-empty strings and can't contain ".", "#", "$", "[", or "]"`)},SR=function(n,e,t,s){t&&(t=t.replace(/^\/*\.info(\/|$)/,"/")),Uh(n,e,t)},Jn=function(n,e){if(X(e)===".info")throw new Error(n+" failed = Can't modify data under /.info/")},AR=function(n,e){const t=e.path.toString();if(typeof e.repoInfo.host!="string"||e.repoInfo.host.length===0||!Bh(e.repoInfo.namespace)&&e.repoInfo.host.split(":")[0]!=="localhost"||t.length!==0&&!bR(t))throw new Error(Fs(n,"url")+`must be a valid firebase URL and the path can't contain ".", "#", "$", "[", or "]".`)};/**
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
 */class kR{constructor(){this.eventLists_=[],this.recursionDepth_=0}}function Ua(n,e){let t=null;for(let s=0;s<e.length;s++){const i=e[s],r=i.getPath();t!==null&&!_h(r,t.path)&&(n.eventLists_.push(t),t=null),t===null&&(t={events:[],path:r}),t.events.push(i)}t&&n.eventLists_.push(t)}function y_(n,e,t){Ua(n,t),v_(n,s=>_h(s,e))}function bt(n,e,t){Ua(n,t),v_(n,s=>It(s,e)||It(e,s))}function v_(n,e){n.recursionDepth_++;let t=!0;for(let s=0;s<n.eventLists_.length;s++){const i=n.eventLists_[s];if(i){const r=i.path;e(r)?(PR(n.eventLists_[s]),n.eventLists_[s]=null):t=!1}}t&&(n.eventLists_=[]),n.recursionDepth_--}function PR(n){for(let e=0;e<n.events.length;e++){const t=n.events[e];if(t!==null){n.events[e]=null;const s=t.getEventRunner();$i&&je("event: "+t.toString()),oi(s)}}}/**
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
 */const NR="repo_interrupt",DR=25;class xR{constructor(e,t,s,i){this.repoInfo_=e,this.forceRestClient_=t,this.authTokenProvider_=s,this.appCheckProvider_=i,this.dataUpdateCount=0,this.statsListener_=null,this.eventQueue_=new kR,this.nextWriteId_=1,this.interceptServerDataCallback_=null,this.onDisconnect_=Yo(),this.transactionQueueTree_=new Vh,this.persistentConnection_=null,this.key=this.repoInfo_.toURLString()}toString(){return(this.repoInfo_.secure?"https://":"http://")+this.repoInfo_.host}}function MR(n,e,t){if(n.stats_=mh(n.repoInfo_),n.forceRestClient_||db())n.server_=new Qo(n.repoInfo_,(s,i,r,o)=>{Of(n,s,i,r,o)},n.authTokenProvider_,n.appCheckProvider_),setTimeout(()=>Vf(n,!0),0);else{if(typeof t<"u"&&t!==null){if(typeof t!="object")throw new Error("Only objects are supported for option databaseAuthVariableOverride");try{xe(t)}catch(s){throw new Error("Invalid authOverride provided: "+s)}}n.persistentConnection_=new tn(n.repoInfo_,e,(s,i,r,o)=>{Of(n,s,i,r,o)},s=>{Vf(n,s)},s=>{LR(n,s)},n.authTokenProvider_,n.appCheckProvider_,t),n.server_=n.persistentConnection_}n.authTokenProvider_.addTokenChangeListener(s=>{n.server_.refreshAuthToken(s)}),n.appCheckProvider_.addTokenChangeListener(s=>{n.server_.refreshAppCheckToken(s.token)}),n.statsReporter_=_b(n.repoInfo_,()=>new gC(n.stats_,n.server_)),n.infoData_=new uC,n.infoSyncTree_=new Mf({startListening:(s,i,r,o)=>{let l=[];const c=n.infoData_.getNode(s._path);return c.isEmpty()||(l=Dr(n.infoSyncTree_,s._path,c),setTimeout(()=>{o("ok")},0)),l},stopListening:()=>{}}),jh(n,"connected",!1),n.serverSyncTree_=new Mf({startListening:(s,i,r,o)=>(n.server_.listen(s,r,i,(l,c)=>{const h=o(l,c);bt(n.eventQueue_,s._path,h)}),[]),stopListening:(s,i)=>{n.server_.unlisten(s,i)}})}function E_(n){const t=n.infoData_.getNode(new ue(".info/serverTimeOffset")).val()||0;return new Date().getTime()+t}function ja(n){return gR({timestamp:E_(n)})}function Of(n,e,t,s,i){n.dataUpdateCount++;const r=new ue(e);t=n.interceptServerDataCallback_?n.interceptServerDataCallback_(e,t):t;let o=[];if(i)if(s){const c=Ro(t,h=>Re(h));o=hR(n.serverSyncTree_,r,c,i)}else{const c=Re(t);o=a_(n.serverSyncTree_,r,c,i)}else if(s){const c=Ro(t,h=>Re(h));o=aR(n.serverSyncTree_,r,c)}else{const c=Re(t);o=Dr(n.serverSyncTree_,r,c)}let l=r;o.length>0&&(l=Qs(n,r)),bt(n.eventQueue_,l,o)}function Vf(n,e){jh(n,"connected",e),e===!1&&BR(n)}function LR(n,e){We(e,(t,s)=>{jh(n,t,s)})}function jh(n,e,t){const s=new ue("/.info/"+e),i=Re(t);n.infoData_.updateSnapshot(s,i);const r=Dr(n.infoSyncTree_,s,i);bt(n.eventQueue_,s,r)}function Wh(n){return n.nextWriteId_++}function OR(n,e,t){const s=uR(n.serverSyncTree_,e);return s!=null?Promise.resolve(s):n.server_.get(e).then(i=>{const r=Re(i).withIndex(e._queryParams.getIndex());hc(n.serverSyncTree_,e,t,!0);let o;if(e._queryParams.loadsAllData())o=Dr(n.serverSyncTree_,e._path,r);else{const l=fr(n.serverSyncTree_,e);o=a_(n.serverSyncTree_,e._path,r,l)}return bt(n.eventQueue_,e._path,o),ia(n.serverSyncTree_,e,t,null,!0),r},i=>(Mr(n,"get for query "+xe(e)+" failed: "+i),Promise.reject(new Error(i))))}function VR(n,e,t,s,i){Mr(n,"set",{path:e.toString(),value:t,priority:s});const r=ja(n),o=Re(t,s),l=Ph(n.serverSyncTree_,e),c=d_(o,l,r),h=Wh(n),d=o_(n.serverSyncTree_,e,c,h,!0);Ua(n.eventQueue_,d),n.server_.put(e.toString(),o.val(!0),(p,E)=>{const b=p==="ok";b||ft("set at "+e+" failed: "+p);const A=En(n.serverSyncTree_,h,!b);bt(n.eventQueue_,e,A),Ln(n,i,p,E)});const m=$h(n,e);Qs(n,m),bt(n.eventQueue_,m,[])}function FR(n,e,t,s){Mr(n,"update",{path:e.toString(),value:t});let i=!0;const r=ja(n),o={};if(We(t,(l,c)=>{i=!1,o[l]=u_(Te(e,l),Re(c),n.serverSyncTree_,r)}),i)je("update() called with empty data.  Don't do anything."),Ln(n,s,"ok",void 0);else{const l=Wh(n),c=oR(n.serverSyncTree_,e,o,l);Ua(n.eventQueue_,c),n.server_.merge(e.toString(),t,(h,d)=>{const m=h==="ok";m||ft("update at "+e+" failed: "+h);const p=En(n.serverSyncTree_,l,!m),E=p.length>0?Qs(n,e):e;bt(n.eventQueue_,E,p),Ln(n,s,h,d)}),We(t,h=>{const d=$h(n,Te(e,h));Qs(n,d)}),bt(n.eventQueue_,e,[])}}function BR(n){Mr(n,"onDisconnectEvents");const e=ja(n),t=Yo();ic(n.onDisconnect_,ce(),(i,r)=>{const o=u_(i,r,n.serverSyncTree_,e);ai(t,i,o)});let s=[];ic(t,ce(),(i,r)=>{s=s.concat(Dr(n.serverSyncTree_,i,r));const o=$h(n,i);Qs(n,o)}),n.onDisconnect_=Yo(),bt(n.eventQueue_,ce(),s)}function UR(n,e,t){n.server_.onDisconnectCancel(e.toString(),(s,i)=>{s==="ok"&&sc(n.onDisconnect_,e),Ln(n,t,s,i)})}function Ff(n,e,t,s){const i=Re(t);n.server_.onDisconnectPut(e.toString(),i.val(!0),(r,o)=>{r==="ok"&&ai(n.onDisconnect_,e,i),Ln(n,s,r,o)})}function jR(n,e,t,s,i){const r=Re(t,s);n.server_.onDisconnectPut(e.toString(),r.val(!0),(o,l)=>{o==="ok"&&ai(n.onDisconnect_,e,r),Ln(n,i,o,l)})}function WR(n,e,t,s){if(Co(t)){je("onDisconnect().update() called with empty data.  Don't do anything."),Ln(n,s,"ok",void 0);return}n.server_.onDisconnectMerge(e.toString(),t,(i,r)=>{i==="ok"&&We(t,(o,l)=>{const c=Re(l);ai(n.onDisconnect_,Te(e,o),c)}),Ln(n,s,i,r)})}function qR(n,e,t){let s;X(e._path)===".info"?s=hc(n.infoSyncTree_,e,t):s=hc(n.serverSyncTree_,e,t),y_(n.eventQueue_,e._path,s)}function w_(n,e,t){let s;X(e._path)===".info"?s=ia(n.infoSyncTree_,e,t):s=ia(n.serverSyncTree_,e,t),y_(n.eventQueue_,e._path,s)}function $R(n){n.persistentConnection_&&n.persistentConnection_.interrupt(NR)}function Mr(n,...e){let t="";n.persistentConnection_&&(t=n.persistentConnection_.id+":"),je(t,...e)}function Ln(n,e,t,s){e&&oi(()=>{if(t==="ok")e(null);else{const i=(t||"error").toUpperCase();let r=i;s&&(r+=": "+s);const o=new Error(r);o.code=i,e(o)}})}function T_(n,e,t){return Ph(n.serverSyncTree_,e,t)||$.EMPTY_NODE}function qh(n,e=n.transactionQueueTree_){if(e||Wa(n,e),ci(e)){const t=b_(n,e);M(t.length>0,"Sending zero length transaction queue"),t.every(i=>i.status===0)&&zR(n,xr(e),t)}else m_(e)&&Fa(e,t=>{qh(n,t)})}function zR(n,e,t){const s=t.map(h=>h.currentWriteId),i=T_(n,e,s);let r=i;const o=i.hash();for(let h=0;h<t.length;h++){const d=t[h];M(d.status===0,"tryToSendTransactionQueue_: items in queue should all be run."),d.status=1,d.retryCount++;const m=dt(e,d.path);r=r.updateChild(m,d.currentOutputSnapshotRaw)}const l=r.val(!0),c=e;n.server_.put(c.toString(),l,h=>{Mr(n,"transaction put response",{path:c.toString(),status:h});let d=[];if(h==="ok"){const m=[];for(let p=0;p<t.length;p++)t[p].status=2,d=d.concat(En(n.serverSyncTree_,t[p].currentWriteId)),t[p].onComplete&&m.push(()=>t[p].onComplete(null,!0,t[p].currentOutputSnapshotResolved)),t[p].unwatcher();Wa(n,Fh(n.transactionQueueTree_,e)),qh(n,n.transactionQueueTree_),bt(n.eventQueue_,e,d);for(let p=0;p<m.length;p++)oi(m[p])}else{if(h==="datastale")for(let m=0;m<t.length;m++)t[m].status===3?t[m].status=4:t[m].status=0;else{ft("transaction at "+c.toString()+" failed: "+h);for(let m=0;m<t.length;m++)t[m].status=4,t[m].abortReason=h}Qs(n,e)}},o)}function Qs(n,e){const t=I_(n,e),s=xr(t),i=b_(n,t);return HR(n,i,s),s}function HR(n,e,t){if(e.length===0)return;const s=[];let i=[];const o=e.filter(l=>l.status===0).map(l=>l.currentWriteId);for(let l=0;l<e.length;l++){const c=e[l],h=dt(t,c.path);let d=!1,m;if(M(h!==null,"rerunTransactionsUnderNode_: relativePath should not be null."),c.status===4)d=!0,m=c.abortReason,i=i.concat(En(n.serverSyncTree_,c.currentWriteId,!0));else if(c.status===0)if(c.retryCount>=DR)d=!0,m="maxretry",i=i.concat(En(n.serverSyncTree_,c.currentWriteId,!0));else{const p=T_(n,c.path,o);c.currentInputSnapshot=p;const E=e[l].update(p.val());if(E!==void 0){Ba("transaction failed: Data returned ",E,c.path);let b=Re(E);typeof E=="object"&&E!=null&&jt(E,".priority")||(b=b.updatePriority(p.getPriority()));const P=c.currentWriteId,F=ja(n),U=d_(b,p,F);c.currentOutputSnapshotRaw=b,c.currentOutputSnapshotResolved=U,c.currentWriteId=Wh(n),o.splice(o.indexOf(P),1),i=i.concat(o_(n.serverSyncTree_,c.path,U,c.currentWriteId,c.applyLocally)),i=i.concat(En(n.serverSyncTree_,P,!0))}else d=!0,m="nodata",i=i.concat(En(n.serverSyncTree_,c.currentWriteId,!0))}bt(n.eventQueue_,t,i),i=[],d&&(e[l].status=2,function(p){setTimeout(p,Math.floor(0))}(e[l].unwatcher),e[l].onComplete&&(m==="nodata"?s.push(()=>e[l].onComplete(null,!1,e[l].currentInputSnapshot)):s.push(()=>e[l].onComplete(new Error(m),!1,null))))}Wa(n,n.transactionQueueTree_);for(let l=0;l<s.length;l++)oi(s[l]);qh(n,n.transactionQueueTree_)}function I_(n,e){let t,s=n.transactionQueueTree_;for(t=X(e);t!==null&&ci(s)===void 0;)s=Fh(s,t),e=pe(e),t=X(e);return s}function b_(n,e){const t=[];return C_(n,e,t),t.sort((s,i)=>s.order-i.order),t}function C_(n,e,t){const s=ci(e);if(s)for(let i=0;i<s.length;i++)t.push(s[i]);Fa(e,i=>{C_(n,i,t)})}function Wa(n,e){const t=ci(e);if(t){let s=0;for(let i=0;i<t.length;i++)t[i].status!==2&&(t[s]=t[i],s++);t.length=s,f_(e,t.length>0?t:void 0)}Fa(e,s=>{Wa(n,s)})}function $h(n,e){const t=xr(I_(n,e)),s=Fh(n.transactionQueueTree_,e);return ER(s,i=>{kl(n,i)}),kl(n,s),p_(s,i=>{kl(n,i)}),t}function kl(n,e){const t=ci(e);if(t){const s=[];let i=[],r=-1;for(let o=0;o<t.length;o++)t[o].status===3||(t[o].status===1?(M(r===o-1,"All SENT items should be at beginning of queue."),r=o,t[o].status=3,t[o].abortReason="set"):(M(t[o].status===0,"Unexpected transaction status in abort"),t[o].unwatcher(),i=i.concat(En(n.serverSyncTree_,t[o].currentWriteId,!0)),t[o].onComplete&&s.push(t[o].onComplete.bind(null,new Error("set"),!1,null))));r===-1?f_(e,void 0):t.length=r+1,bt(n.eventQueue_,xr(e),i);for(let o=0;o<s.length;o++)oi(s[o])}}/**
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
 */function GR(n){let e="";const t=n.split("/");for(let s=0;s<t.length;s++)if(t[s].length>0){let i=t[s];try{i=decodeURIComponent(i.replace(/\+/g," "))}catch{}e+="/"+i}return e}function KR(n){const e={};n.charAt(0)==="?"&&(n=n.substring(1));for(const t of n.split("&")){if(t.length===0)continue;const s=t.split("=");s.length===2?e[decodeURIComponent(s[0])]=decodeURIComponent(s[1]):ft(`Invalid query segment '${t}' in query '${n}'`)}return e}const Bf=function(n,e){const t=QR(n),s=t.namespace;t.domain==="firebase.com"&&an(t.host+" is no longer supported. Please use <YOUR FIREBASE>.firebaseio.com instead"),(!s||s==="undefined")&&t.domain!=="localhost"&&an("Cannot parse Firebase url. Please use https://<YOUR FIREBASE>.firebaseio.com"),t.secure||sb();const i=t.scheme==="ws"||t.scheme==="wss";return{repoInfo:new Ag(t.host,t.secure,s,i,e,"",s!==t.subdomain),path:new ue(t.pathString)}},QR=function(n){let e="",t="",s="",i="",r="",o=!0,l="https",c=443;if(typeof n=="string"){let h=n.indexOf("//");h>=0&&(l=n.substring(0,h-1),n=n.substring(h+2));let d=n.indexOf("/");d===-1&&(d=n.length);let m=n.indexOf("?");m===-1&&(m=n.length),e=n.substring(0,Math.min(d,m)),d<m&&(i=GR(n.substring(d,m)));const p=KR(n.substring(Math.min(n.length,m)));h=e.indexOf(":"),h>=0?(o=l==="https"||l==="wss",c=parseInt(e.substring(h+1),10)):h=e.length;const E=e.slice(0,h);if(E.toLowerCase()==="localhost")t="localhost";else if(E.split(".").length<=2)t=E;else{const b=e.indexOf(".");s=e.substring(0,b).toLowerCase(),t=e.substring(b+1),r=s}"ns"in p&&(r=p.ns)}return{host:e,port:c,domain:t,subdomain:s,secure:o,scheme:l,pathString:i,namespace:r}};/**
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
 */const Uf="-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz",YR=function(){let n=0;const e=[];return function(t){const s=t===n;n=t;let i;const r=new Array(8);for(i=7;i>=0;i--)r[i]=Uf.charAt(t%64),t=Math.floor(t/64);M(t===0,"Cannot push at time == 0");let o=r.join("");if(s){for(i=11;i>=0&&e[i]===63;i--)e[i]=0;e[i]++}else for(i=0;i<12;i++)e[i]=Math.floor(Math.random()*64);for(i=0;i<12;i++)o+=Uf.charAt(e[i]);return M(o.length===20,"nextPushId: Length should be 20."),o}}();/**
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
 */class R_{constructor(e,t,s,i){this.eventType=e,this.eventRegistration=t,this.snapshot=s,this.prevName=i}getPath(){const e=this.snapshot.ref;return this.eventType==="value"?e._path:e.parent._path}getEventType(){return this.eventType}getEventRunner(){return this.eventRegistration.getEventRunner(this)}toString(){return this.getPath().toString()+":"+this.eventType+":"+xe(this.snapshot.exportVal())}}class S_{constructor(e,t,s){this.eventRegistration=e,this.error=t,this.path=s}getPath(){return this.path}getEventType(){return"cancel"}getEventRunner(){return this.eventRegistration.getEventRunner(this)}toString(){return this.path.toString()+":cancel"}}/**
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
 */class A_{constructor(e,t){this.snapshotCallback=e,this.cancelCallback=t}onValue(e,t){this.snapshotCallback.call(null,e,t)}onCancel(e){return M(this.hasCancelCallback,"Raising a cancel event on a listener with no cancel callback"),this.cancelCallback.call(null,e)}get hasCancelCallback(){return!!this.cancelCallback}matches(e){return this.snapshotCallback===e.snapshotCallback||this.snapshotCallback.userCallback!==void 0&&this.snapshotCallback.userCallback===e.snapshotCallback.userCallback&&this.snapshotCallback.context===e.snapshotCallback.context}}/**
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
 */class XR{constructor(e,t){this._repo=e,this._path=t}cancel(){const e=new xt;return UR(this._repo,this._path,e.wrapCallback(()=>{})),e.promise}remove(){Jn("OnDisconnect.remove",this._path);const e=new xt;return Ff(this._repo,this._path,null,e.wrapCallback(()=>{})),e.promise}set(e){Jn("OnDisconnect.set",this._path),mr("OnDisconnect.set",e,this._path,!1);const t=new xt;return Ff(this._repo,this._path,e,t.wrapCallback(()=>{})),t.promise}setWithPriority(e,t){Jn("OnDisconnect.setWithPriority",this._path),mr("OnDisconnect.setWithPriority",e,this._path,!1),RR("OnDisconnect.setWithPriority",t);const s=new xt;return jR(this._repo,this._path,e,t,s.wrapCallback(()=>{})),s.promise}update(e){Jn("OnDisconnect.update",this._path),__("OnDisconnect.update",e,this._path);const t=new xt;return WR(this._repo,this._path,e,t.wrapCallback(()=>{})),t.promise}}/**
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
 */class Lr{constructor(e,t,s,i){this._repo=e,this._path=t,this._queryParams=s,this._orderByCalled=i}get key(){return J(this._path)?null:gh(this._path)}get ref(){return new Wt(this._repo,this._path)}get _queryIdentifier(){const e=bf(this._queryParams),t=dh(e);return t==="{}"?"default":t}get _queryObject(){return bf(this._queryParams)}isEqual(e){if(e=de(e),!(e instanceof Lr))return!1;const t=this._repo===e._repo,s=_h(this._path,e._path),i=this._queryIdentifier===e._queryIdentifier;return t&&s&&i}toJSON(){return this.toString()}toString(){return this._repo.toString()+Ub(this._path)}}function JR(n,e){if(n._orderByCalled===!0)throw new Error(e+": You can't combine multiple orderBy calls.")}function k_(n){let e=null,t=null;if(n.hasStart()&&(e=n.getIndexStartValue()),n.hasEnd()&&(t=n.getIndexEndValue()),n.getIndex()===ts){const s="Query: When ordering by key, you may only pass one argument to startAt(), endAt(), or equalTo().",i="Query: When ordering by key, the argument passed to startAt(), startAfter(), endAt(), endBefore(), or equalTo() must be a string.";if(n.hasStart()){if(n.getIndexStartName()!==ls)throw new Error(s);if(typeof e!="string")throw new Error(i)}if(n.hasEnd()){if(n.getIndexEndName()!==Nn)throw new Error(s);if(typeof t!="string")throw new Error(i)}}else if(n.getIndex()===Ee){if(e!=null&&!ra(e)||t!=null&&!ra(t))throw new Error("Query: When ordering by priority, the first argument passed to startAt(), startAfter() endAt(), endBefore(), or equalTo() must be a valid priority value (null, a number, or a string).")}else if(M(n.getIndex()instanceof Eh||n.getIndex()===$g,"unknown index type."),e!=null&&typeof e=="object"||t!=null&&typeof t=="object")throw new Error("Query: First argument passed to startAt(), startAfter(), endAt(), endBefore(), or equalTo() cannot be an object.")}function ZR(n){if(n.hasStart()&&n.hasEnd()&&n.hasLimit()&&!n.hasAnchoredLimit())throw new Error("Query: Can't combine startAt(), startAfter(), endAt(), endBefore(), and limit(). Use limitToFirst() or limitToLast() instead.")}class Wt extends Lr{constructor(e,t){super(e,t,new Th,!1)}get parent(){const e=Vg(this._path);return e===null?null:new Wt(this._repo,e)}get root(){let e=this;for(;e.parent!==null;)e=e.parent;return e}}class Ys{constructor(e,t,s){this._node=e,this.ref=t,this._index=s}get priority(){return this._node.getPriority().val()}get key(){return this.ref.key}get size(){return this._node.numChildren()}child(e){const t=new ue(e),s=Xs(this.ref,e);return new Ys(this._node.getChild(t),s,Ee)}exists(){return!this._node.isEmpty()}exportVal(){return this._node.val(!0)}forEach(e){return this._node.isLeafNode()?!1:!!this._node.forEachChild(this._index,(s,i)=>e(new Ys(i,Xs(this.ref,s),Ee)))}hasChild(e){const t=new ue(e);return!this._node.getChild(t).isEmpty()}hasChildren(){return this._node.isLeafNode()?!1:!this._node.isEmpty()}toJSON(){return this.exportVal()}val(){return this._node.val()}}function et(n,e){return n=de(n),n._checkNotDeleted("ref"),e!==void 0?Xs(n._root,e):n._root}function Xs(n,e){return n=de(n),X(n._path)===null?SR("child","path",e):Uh("child","path",e),new Wt(n._repo,Te(n._path,e))}function eS(n){return n=de(n),new XR(n._repo,n._path)}function tS(n,e){n=de(n),Jn("push",n._path),mr("push",e,n._path,!0);const t=E_(n._repo),s=YR(t),i=Xs(n,s),r=Xs(n,s);let o;return e!=null?o=oa(r,e).then(()=>r):o=Promise.resolve(r),i.then=o.then.bind(o),i.catch=o.then.bind(o,void 0),i}function nS(n){return Jn("remove",n._path),oa(n,null)}function oa(n,e){n=de(n),Jn("set",n._path),mr("set",e,n._path,!1);const t=new xt;return VR(n._repo,n._path,e,null,t.wrapCallback(()=>{})),t.promise}function As(n,e){__("update",e,n._path);const t=new xt;return FR(n._repo,n._path,e,t.wrapCallback(()=>{})),t.promise}function P_(n){n=de(n);const e=new A_(()=>{}),t=new qa(e);return OR(n._repo,n,t).then(s=>new Ys(s,new Wt(n._repo,n._path),n._queryParams.getIndex()))}class qa{constructor(e){this.callbackContext=e}respondsTo(e){return e==="value"}createEvent(e,t){const s=t._queryParams.getIndex();return new R_("value",this,new Ys(e.snapshotNode,new Wt(t._repo,t._path),s))}getEventRunner(e){return e.getEventType()==="cancel"?()=>this.callbackContext.onCancel(e.error):()=>this.callbackContext.onValue(e.snapshot,null)}createCancelEvent(e,t){return this.callbackContext.hasCancelCallback?new S_(this,e,t):null}matches(e){return e instanceof qa?!e.callbackContext||!this.callbackContext?!0:e.callbackContext.matches(this.callbackContext):!1}hasAnyCallback(){return this.callbackContext!==null}}class zh{constructor(e,t){this.eventType=e,this.callbackContext=t}respondsTo(e){let t=e==="children_added"?"child_added":e;return t=t==="children_removed"?"child_removed":t,this.eventType===t}createCancelEvent(e,t){return this.callbackContext.hasCancelCallback?new S_(this,e,t):null}createEvent(e,t){M(e.childName!=null,"Child events should have a childName.");const s=Xs(new Wt(t._repo,t._path),e.childName),i=t._queryParams.getIndex();return new R_(e.type,this,new Ys(e.snapshotNode,s,i),e.prevName)}getEventRunner(e){return e.getEventType()==="cancel"?()=>this.callbackContext.onCancel(e.error):()=>this.callbackContext.onValue(e.snapshot,e.prevName)}matches(e){return e instanceof zh?this.eventType===e.eventType&&(!this.callbackContext||!e.callbackContext||this.callbackContext.matches(e.callbackContext)):!1}hasAnyCallback(){return!!this.callbackContext}}function N_(n,e,t,s,i){const r=new A_(t,void 0),o=e==="value"?new qa(r):new zh(e,r);return qR(n._repo,n,o),()=>w_(n._repo,n,o)}function Pl(n,e,t,s){return N_(n,"value",e)}function sS(n,e,t,s){return N_(n,"child_added",e)}function iS(n,e,t){w_(n._repo,n,null)}class D_{}class rS extends D_{constructor(e,t){super(),this._value=e,this._key=t,this.type="endAt"}_apply(e){mr("endAt",this._value,e._path,!0);const t=cC(e._queryParams,this._value,this._key);if(ZR(t),k_(t),e._queryParams.hasEnd())throw new Error("endAt: Starting point was already set (by another call to endAt, endBefore or equalTo).");return new Lr(e._repo,e._path,t,e._orderByCalled)}}function oS(n,e){return new rS(n,e)}class aS extends D_{constructor(e){super(),this._path=e,this.type="orderByChild"}_apply(e){JR(e,"orderByChild");const t=new ue(this._path);if(J(t))throw new Error("orderByChild: cannot pass in empty path. Use orderByValue() instead.");const s=new Eh(t),i=hC(e._queryParams,s);return k_(i),new Lr(e._repo,e._path,i,!0)}}function lS(n){return Uh("orderByChild","path",n),new aS(n)}function cS(n,...e){let t=de(n);for(const s of e)t=s._apply(t);return t}JC(Wt);sR(Wt);/**
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
 */const hS="FIREBASE_DATABASE_EMULATOR_HOST",dc={};let uS=!1;function dS(n,e,t,s){n.repoInfo_=new Ag(`${e}:${t}`,!1,n.repoInfo_.namespace,n.repoInfo_.webSocketOnly,n.repoInfo_.nodeAdmin,n.repoInfo_.persistenceKey,n.repoInfo_.includeNamespaceInQueryParams,!0),s&&(n.authTokenProvider_=s)}function fS(n,e,t,s,i){let r=s||n.options.databaseURL;r===void 0&&(n.options.projectId||an("Can't determine Firebase Database URL. Be sure to include  a Project ID when calling firebase.initializeApp()."),je("Using default host for project ",n.options.projectId),r=`${n.options.projectId}-default-rtdb.firebaseio.com`);let o=Bf(r,i),l=o.repoInfo,c;typeof process<"u"&&of&&(c=of[hS]),c?(r=`http://${c}?ns=${l.namespace}`,o=Bf(r,i),l=o.repoInfo):o.repoInfo.secure;const h=new mb(n.name,n.options,e);AR("Invalid Firebase Database URL",o),J(o.path)||an("Database URL must point to the root of a Firebase Database (not including a child path).");const d=pS(l,n,h,new fb(n.name,t));return new gS(d,n)}function mS(n,e){const t=dc[e];(!t||t[n.key]!==n)&&an(`Database ${e}(${n.repoInfo_}) has already been deleted.`),$R(n),delete t[n.key]}function pS(n,e,t,s){let i=dc[e.name];i||(i={},dc[e.name]=i);let r=i[n.toURLString()];return r&&an("Database initialized multiple times. Please make sure the format of the database URL matches with each database() call."),r=new xR(n,uS,t,s),i[n.toURLString()]=r,r}class gS{constructor(e,t){this._repoInternal=e,this.app=t,this.type="database",this._instanceStarted=!1}get _repo(){return this._instanceStarted||(MR(this._repoInternal,this.app.options.appId,this.app.options.databaseAuthVariableOverride),this._instanceStarted=!0),this._repoInternal}get _root(){return this._rootInternal||(this._rootInternal=new Wt(this._repo,ce())),this._rootInternal}_delete(){return this._rootInternal!==null&&(mS(this._repo,this.app.name),this._repoInternal=null,this._rootInternal=null),Promise.resolve()}_checkNotDeleted(e){this._rootInternal===null&&an("Cannot call "+e+" on a deleted database.")}}function _S(n=gc(),e){const t=ma(n,"database").getImmediate({identifier:e});if(!t._instanceStarted){const s=Zf("database");s&&yS(t,...s)}return t}function yS(n,e,t,s={}){n=de(n),n._checkNotDeleted("useEmulator"),n._instanceStarted&&an("Cannot call useEmulator() after instance has already been initialized.");const i=n._repoInternal;let r;if(i.repoInfo_.nodeAdmin)s.mockUserToken&&an('mockUserToken is not supported by the Admin SDK. For client access with mock users, please use the "firebase" package instead of "firebase-admin".'),r=new wo(wo.OWNER);else if(s.mockUserToken){const o=typeof s.mockUserToken=="string"?s.mockUserToken:nm(s.mockUserToken,n.app.options.projectId);r=new wo(o)}dS(i,e,t,r)}/**
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
 */function vS(n){X0(us),ns(new Sn("database",(e,{instanceIdentifier:t})=>{const s=e.getProvider("app").getImmediate(),i=e.getProvider("auth-internal"),r=e.getProvider("app-check-internal");return fS(s,i,r,t)},"PUBLIC").setMultipleInstances(!0)),Mt(af,lf,n),Mt(af,lf,"esm2017")}/**
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
 */const ES={".sv":"timestamp"};function wS(){return ES}tn.prototype.simpleListen=function(n,e){this.sendRequest("q",{p:n},e)};tn.prototype.echo=function(n,e){this.sendRequest("echo",{d:n},e)};vS();const pn=n=>atob(n),TS={apiKey:pn("QUl6YVN5Q2FUUWE2Sm9NajJNQmdEZ2Rwb25WQllfTkFlUU84X3Vz"),authDomain:pn("a2lja2VyaGF4LW9ubGluZS5maXJlYmFzZWFwcC5jb20="),databaseURL:pn("aHR0cHM6Ly9raWNrZXJoYXgtb25saW5lLWRlZmF1bHQtcnRkYi5maXJlYmFzZWlvLmNvbQ=="),projectId:pn("a2lja2VyaGF4LW9ubGluZQ=="),storageBucket:pn("a2lja2VyaGF4LW9ubGluZS5maXJlYmFzdG9yYWdlLmFwcA=="),messagingSenderId:pn("MzM3NTk4NDY1MTcw"),appId:pn("MTozMzc1OTg0NjUxNzA6d2ViOjE5MDU0YWI4NDBkODBkMmMyMDUyNGI="),measurementId:pn("Ry0xWjhWN0NWRkcw")},Hh=am(TS),To=Gw(Hh),_t=M0(Hh),tt=_S(Hh),mt={async loginWithGoogle(){const n=new Kt,e=await nw(To,n),t=e.user,s=Ht(_t,"users",t.uid);if((await El(s)).exists())await rf(s,{lastLogin:new Date().toISOString()});else{const r=Math.floor(Math.random()*9e3)+1e3,l=`${(t.displayName||"Jogador").replace(/\s+/g,"").replace(/[^a-zA-Z0-9]/g,"").toLowerCase()}${r}`.substring(0,12),c={uid:t.uid,username:l,displayName:l,badge:"👤",bio:"",level:1,xp:0,isNewUser:!0,dateCreated:new Date().toISOString(),lastLogin:new Date().toISOString(),settings:{volume:80,quality:"high",fieldSize:"medium"}},h={uid:t.uid,matchesPlayed:0,wins:0,losses:0,draws:0,goals:0,assists:0,saves:0};await Tl(Ht(_t,"users",t.uid),c),await Tl(Ht(_t,"stats",t.uid),h)}return e},async logout(){return await OE(To)},subscribeToAuth(n){return Pm(To,n)},async getUserProfile(n){const e=Ht(_t,"users",n),t=await El(e);return t.exists()?t.data():null},async updateUserProfile(n,e){const t=Ht(_t,"users",n);await rf(t,e)},async getUserStats(n){const e=Ht(_t,"stats",n),t=await El(e);return t.exists()?t.data():null},async saveMatchResult(n,e,t,s,i,r,o,l){const c=Ht(_t,"stats",n),h=Ht(_t,"users",n);await Y0(_t,async d=>{const m=await d.get(c),p=await d.get(h);if(!m.exists()||!p.exists())throw new Error("Documento não encontrado");const E=m.data(),b=p.data(),A={matchesPlayed:(E.matchesPlayed||0)+1,wins:(E.wins||0)+(e?1:0),losses:(E.losses||0)+(t?1:0),draws:(E.draws||0)+(s?1:0),goals:(E.goals||0)+i,assists:(E.assists||0)+r,saves:(E.saves||0)+o};let P=(b.xp||0)+l,F=b.level||1,U=F*100;for(;P>=U;)P-=U,F++,U=F*100;d.update(c,A),d.update(h,{xp:P,level:F,lastLogin:new Date().toISOString()})})},async addMatchToHistory(n){const e=Ht(lo(_t,"history"));await Tl(e,n)},async getRecentHistory(n,e=5){const t=lo(_t,"history"),s=ef(t,tf("playerUids","array-contains",n),q0(20)),i=await wl(s),r=[];return i.forEach(o=>r.push({id:o.id,...o.data()})),r.sort((o,l)=>new Date(l.date)-new Date(o.date)),r.slice(0,e)},async getGlobalRanking(n="wins",e=10){try{const t=lo(_t,"users"),s=await wl(t),i=[];for(const r of s.docs){const o=r.data();if(!o.uid)continue;const l=await this.getUserStats(o.uid)||{};i.push({username:o.username,displayName:o.username,badge:o.badge||"🏳️",level:o.level||1,wins:l.wins||0,losses:l.losses||0,goals:l.goals||0,xp:o.xp||0})}return n==="level"?i.sort((r,o)=>o.level!==r.level?o.level-r.level:o.xp-r.xp):n==="wins"?i.sort((r,o)=>o.wins-r.wins):n==="goals"&&i.sort((r,o)=>o.goals-r.goals),i.slice(0,e)}catch(t){throw console.error("[Firestore] Error fetching ranking:",t),t}},async isUsernameUnique(n,e){const t=ef(lo(_t,"users"),tf("username","==",n.toLowerCase())),s=await wl(t);let i=!0;return s.forEach(r=>{r.id!==e&&(i=!1)}),i},async pruneOldChatMessages(){try{const n=et(tt,"globalChat"),e=Date.now()-72e5,t=cS(n,lS("timestamp"),oS(e)),s=await P_(t);if(s.exists()){const i={};s.forEach(r=>{i[r.key]=null}),await As(n,i)}}catch(n){console.warn("Pruning skipped or unauthorized:",n)}},async sendGlobalChatMessage(n,e){this.pruneOldChatMessages().catch(s=>console.warn(s));const t=et(tt,"globalChat");await tS(t,{uid:n.uid,username:n.username,badge:n.badge||"👤",text:e,timestamp:wS()})},subscribeToGlobalChat(n){const e=et(tt,"globalChat");sS(e,t=>{n(t.val())})}};function he(n,e="info"){if(!document.getElementById("toast-style")){const r=document.createElement("style");r.id="toast-style",r.textContent=`
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
    `,document.head.appendChild(r)}let t=document.querySelector(".toast-container");t||(t=document.createElement("div"),t.className="toast-container",document.body.appendChild(t));const s=document.createElement("div");s.className=`toast toast-${e}`;let i="ℹ️";e==="success"&&(i="✅"),e==="error"&&(i="❌"),s.innerHTML=`<span>${i}</span> <span>${n}</span>`,t.appendChild(s),setTimeout(()=>s.classList.add("show"),50),setTimeout(()=>{s.classList.remove("show"),setTimeout(()=>s.remove(),250)},3500)}const IS={init(){const n=document.getElementById("btn-google-login");n&&n.addEventListener("click",async()=>{try{he("Iniciando login com Google...","info"),await mt.loginWithGoogle(),he("Login realizado com sucesso!","success")}catch(e){he(e.message||"Erro ao entrar com Google.","error")}})}};function bS(n){const e=(n??"").toString();if(!e)return[];try{const t=new Intl.Segmenter(void 0,{granularity:"grapheme"});return Array.from(t.segment(e),s=>s.segment)}catch{return Array.from(e)}}function CS(n){return new RegExp("\\p{Extended_Pictographic}","u").test(n||"")}const Ge={currentUser:null,profileData:null,async init(n){if(this.currentUser=n,!n)return;const e=document.getElementById("menu-btn-play");e&&(e.onclick=()=>W.show("mode-select-screen"));const t=document.getElementById("menu-btn-profile");t&&(t.onclick=()=>W.show("profile-screen"));const s=document.getElementById("menu-quick-profile");s&&(s.onclick=()=>W.show("profile-screen"));const i=document.getElementById("menu-btn-ranking");i&&(i.onclick=()=>W.show("ranking-screen"));const r=document.getElementById("menu-btn-settings");r&&(r.onclick=()=>W.show("settings-screen"));const o=document.getElementById("menu-btn-controls");o&&(o.onclick=()=>W.show("controls-screen"));const l=document.getElementById("menu-btn-credits");l&&(l.onclick=()=>W.show("credits-screen"));const c=document.getElementById("menu-btn-logout");c&&(c.onclick=async()=>{try{await mt.logout(),he("Desconectado com sucesso.","info")}catch{he("Erro ao sair da conta.","error")}});const h=document.getElementById("credits-btn-back");h&&(h.onclick=()=>W.show("menu-screen")),W.register("menu-screen",{onEnter:()=>this.refreshQuickProfile()}),W.register("profile-screen",{onEnter:()=>this.loadProfileScreen()});const d=document.getElementById("profile-btn-back");d&&(d.onclick=()=>W.show("menu-screen"));const m=document.getElementById("profile-btn-save");m&&(m.onclick=async()=>{await this.saveProfileEdits()});const p=document.getElementById("profile-badge-select"),E=document.getElementById("profile-avatar-display");p&&E&&p.addEventListener("change",b=>{this.updateAvatarDisplay(E,b.target.value)}),await this.refreshQuickProfile()},async refreshQuickProfile(){if(this.currentUser)try{if(this.profileData=await mt.getUserProfile(this.currentUser.uid),!this.profileData)return;const n=document.getElementById("quick-profile-flag"),e=document.getElementById("quick-profile-name"),t=document.getElementById("quick-profile-level"),s=document.getElementById("quick-avatar-char"),i=document.querySelector(".quick-xp-fill");if(n&&(n.textContent=this.profileData.badge||"🇧🇷"),e&&(e.textContent=this.profileData.displayName||this.profileData.username),t&&(t.textContent=this.profileData.level||1),s&&(s.textContent=this.profileData.badge||"👤"),i){const r=this.profileData.level||1,o=this.profileData.xp||0,l=r*100,c=Math.min(100,Math.max(0,o/l*100));i.style.width=`${c}%`}}catch(n){console.error("Erro ao carregar perfil rápido:",n)}},async loadProfileScreen(){if(!this.currentUser||!this.profileData)return;this.profileData=await mt.getUserProfile(this.currentUser.uid);const n=document.getElementById("profile-username-input"),e=document.getElementById("profile-badge-select"),t=document.getElementById("profile-bio-input"),s=document.getElementById("profile-avatar-display");n&&(n.value=this.profileData.username||""),e&&(e.value=this.profileData.badge||"👤"),t&&(t.value=this.profileData.bio||""),s&&this.updateAvatarDisplay(s,this.profileData.badge);const i=await mt.getUserStats(this.currentUser.uid);if(i){const o=i.matchesPlayed>0?Math.round(i.wins/i.matchesPlayed*100):0;document.getElementById("stats-played").textContent=i.matchesPlayed||0,document.getElementById("stats-wins").textContent=i.wins||0,document.getElementById("stats-losses").textContent=i.losses||0,document.getElementById("stats-winrate").textContent=`${o}%`,document.getElementById("stats-goals").textContent=i.goals||0,document.getElementById("stats-assists").textContent=i.assists||0,document.getElementById("stats-saves").textContent=i.saves||0,document.getElementById("stats-level").textContent=this.profileData.level||1,document.getElementById("stats-xp").textContent=this.profileData.xp||0}const r=document.getElementById("profile-match-history");if(r){r.innerHTML='<div class="subtext">Carregando histórico...</div>';try{const o=await mt.getRecentHistory(this.currentUser.uid);o.length===0?r.innerHTML='<div class="subtext">Nenhuma partida recente.</div>':(r.innerHTML="",o.forEach(l=>{const c=document.createElement("div");c.className="history-item";let h="draw",d="Empate";l.winner==="draw"?(h="draw",d="Empate"):l.winner===l.playerTeams[this.currentUser.uid]?(h="win",d="Vitória"):(h="loss",d="Derrota");const m=new Date(l.date).toLocaleDateString("pt-BR");c.innerHTML=`
              <span>📅 ${m} - ${l.mode==="solo"?"vs CPU":"Online"}</span>
              <span>${l.scoreRed} : ${l.scoreBlue}</span>
              <span class="history-result ${h}">${d}</span>
            `,r.appendChild(c)}))}catch{r.innerHTML='<div class="subtext text-danger">Erro ao carregar histórico.</div>'}}},async saveProfileEdits(){if(!this.currentUser)return;const n=document.getElementById("profile-username-input"),e=document.getElementById("profile-badge-select"),t=document.getElementById("profile-bio-input"),s=n?n.value.trim().toLowerCase():"",i=e?e.value:"👤",r=t?t.value.trim():"";if(s.length<3||s.length>12)return he("O nome de usuário precisa ter entre 3 e 12 caracteres.","error");if(!/^[a-zA-Z0-9_]+$/.test(s))return he("O nome de usuário só pode conter letras, números e sublinhado (_). Sem espaços!","error");try{if(he("Verificando disponibilidade do nome...","info"),!await mt.isUsernameUnique(s,this.currentUser.uid))return he("Este nome de usuário já está em uso por outro jogador.","error");he("Salvando dados...","info"),await mt.updateUserProfile(this.currentUser.uid,{username:s,displayName:s,badge:i,bio:r,isNewUser:!1}),this.profileData.username=s,this.profileData.displayName=s,this.profileData.badge=i,this.profileData.bio=r,this.profileData.isNewUser=!1;const c=document.getElementById("profile-btn-back");c&&(c.style.display=""),he("Perfil atualizado com sucesso!","success"),await this.refreshQuickProfile(),W.show("menu-screen")}catch{he("Erro ao atualizar perfil.","error")}},updateAvatarDisplay(n,e){n&&(n.innerHTML="",n.textContent=e||"👤")}},Qi={CTRL_P1:null,CTRL_P2:null,fieldSize:"medium",dimensions:{w:1024,h:640},waitingRemap:null,defaultP1:{up:"w",down:"s",left:"a",right:"d",sprint:"ShiftLeft",shoot:" ",dribble:"f",tackle:"e",power:"q"},defaultP2:{up:"arrowup",down:"arrowdown",left:"arrowleft",right:"arrowright",sprint:"ShiftRight",shoot:"1",dribble:"2",tackle:"3",power:"enter"},actions:[{id:"up",label:"Mover Cima"},{id:"down",label:"Mover Baixo"},{id:"left",label:"Mover Esquerda"},{id:"right",label:"Mover Direita"},{id:"sprint",label:"Correr"},{id:"shoot",label:"Chutar"},{id:"dribble",label:"Driblar"},{id:"tackle",label:"Desarme"},{id:"power",label:"Power Shoot"}],init(){this.loadSettings();const n=document.getElementById("settings-volume"),e=document.getElementById("volume-val-display");n&&n.addEventListener("input",r=>{const o=r.target.value;e&&(e.textContent=`${o}%`),yt.setVolume(o),localStorage.setItem("kicker_hax_volume",o)});const t=document.getElementById("settings-btn-back");t&&(t.onclick=()=>W.show("menu-screen"));const s=document.getElementById("controls-btn-back");s&&(s.onclick=()=>W.show("menu-screen")),window.addEventListener("keydown",r=>this.handleRemapKey(r));const i=document.getElementById("controls-btn-reset");i&&(i.onclick=()=>{this.CTRL_P1=JSON.parse(JSON.stringify(this.defaultP1)),this.CTRL_P2=JSON.parse(JSON.stringify(this.defaultP2)),this.saveControls(),this.renderRemapGrids(),he("Controles restaurados aos padrões!","success")}),W.register("settings-screen",{onEnter:()=>{const r=localStorage.getItem("kicker_hax_volume")||"80";n&&(n.value=r),e&&(e.textContent=`${r}%`)}}),W.register("controls-screen",{onEnter:()=>{this.renderRemapGrids();const r=document.getElementById("controls-restart-warning");r&&r.classList.add("hidden")}})},loadSettings(){const n=localStorage.getItem("kicker_hax_volume")||"80";yt.setVolume(parseInt(n,10)),this.fieldSize="medium",this.dimensions={w:1024,h:640};try{this.CTRL_P1=JSON.parse(localStorage.getItem("kicker_hax_keys_p1"))||JSON.parse(JSON.stringify(this.defaultP1)),this.CTRL_P2=JSON.parse(localStorage.getItem("kicker_hax_keys_p2"))||JSON.parse(JSON.stringify(this.defaultP2))}catch{this.CTRL_P1=JSON.parse(JSON.stringify(this.defaultP1)),this.CTRL_P2=JSON.parse(JSON.stringify(this.defaultP2))}},saveControls(){localStorage.setItem("kicker_hax_keys_p1",JSON.stringify(this.CTRL_P1)),localStorage.setItem("kicker_hax_keys_p2",JSON.stringify(this.CTRL_P2))},getKeyLabel(n){return n?n==="ShiftLeft"?"Shift Esq.":n==="ShiftRight"?"Shift Dir.":n===" "?"Espaço":n==="arrowup"?"↑":n==="arrowdown"?"↓":n==="arrowleft"?"←":n==="arrowright"?"→":n==="enter"?"Enter":n.toUpperCase():"—"},renderRemapGrids(){const n=document.getElementById("grid-controls-p1");if(!n)return;((t,s,i)=>{t.innerHTML="",this.actions.forEach(r=>{const o=document.createElement("div");o.className="map-label",o.textContent=r.label,t.appendChild(o);const l=i[r.id],c=document.createElement("button");c.className="map-key-btn",c.textContent=this.getKeyLabel(l),c.onclick=()=>this.startRemapping(s,r.id,c),t.appendChild(c)})})(n,1,this.CTRL_P1)},startRemapping(n,e,t){if(this.waitingRemap){const s=this.waitingRemap.btn,i=this.waitingRemap.playerNum===1?this.CTRL_P1[this.waitingRemap.actionId]:this.CTRL_P2[this.waitingRemap.actionId];s.textContent=this.getKeyLabel(i),s.classList.remove("active")}this.waitingRemap={playerNum:n,actionId:e,btn:t},t.textContent="Aguardando tecla...",t.classList.add("active")},handleRemapKey(n){if(!this.waitingRemap)return;n.preventDefault(),n.stopPropagation();const{playerNum:e,actionId:t,btn:s}=this.waitingRemap;s.classList.remove("active");const i=n.key||"",r=i.toLowerCase();if(i==="Escape"){const m=e===1?this.CTRL_P1[t]:this.CTRL_P2[t];s.textContent=this.getKeyLabel(m),this.waitingRemap=null;return}if(i==="Backspace"){e===1?this.CTRL_P1[t]="":this.CTRL_P2[t]="",this.saveControls(),this.renderRemapGrids(),this.waitingRemap=null;return}let o=r;(n.code==="ShiftLeft"||n.code==="ShiftRight"||n.code==="ControlLeft"||n.code==="ControlRight")&&(o=n.code);const l=e===1?this.CTRL_P1:this.CTRL_P2,c=e===1?this.CTRL_P2:this.CTRL_P1;if(Object.values(c).includes(o)&&o){s.classList.add("warn"),s.textContent="Já em uso pelo outro jogador!",setTimeout(()=>{s.classList.remove("warn");const m=e===1?this.CTRL_P1[t]:this.CTRL_P2[t];s.textContent=this.getKeyLabel(m)},1e3),this.waitingRemap=null;return}const d=Object.keys(l).find(m=>l[m]===o);if(d&&d!==t){const m=l[t];l[t]=o,l[d]=m}else l[t]=o;this.saveControls(),this.renderRemapGrids(),this.waitingRemap=null}};class RS{constructor(e,t,s,i={}){this.code=e.toUpperCase(),this.name=t||`Sala de ${e}`,this.hostId=s,this.maxPlayers=i.maxPlayers||10,this.password=i.password||null,this.duration=i.duration||3,this.goalLimit=i.goalLimit||3,this.fieldSize=i.fieldSize||"medium",this.showReplay=!0,this.players=[],this.chatHistory=[],this.status="lobby",this.match=null,this.spectators=[]}addPlayer(e,t,s="spectator"){const i=this.players.find(o=>o.id===e);if(i)return i;const r={id:e,uid:t.uid||"",username:t.username||"Jogador",badge:t.badge||"🏳️",team:s,ready:!1,ping:0};return this.players.push(r),r}removePlayer(e){const t=this.players.findIndex(i=>i.id===e);if(t===-1)return null;const s=this.players.splice(t,1)[0];return e===this.hostId&&this.players.length>0&&(this.hostId=this.players[0].id),s}changeTeam(e,t){const s=this.players.find(i=>i.id===e);return s?(s.team=t,t==="spectator"&&(s.ready=!1),!0):!1}toggleReady(e){const t=this.players.find(s=>s.id===e);return!t||t.team==="spectator"?!1:(t.ready=!t.ready,t.ready)}updateSettings(e){e.name&&(this.name=e.name),e.maxPlayers&&(this.maxPlayers=parseInt(e.maxPlayers,10)),e.duration&&(this.duration=parseInt(e.duration,10)),e.goalLimit&&(this.goalLimit=parseInt(e.goalLimit,10)),e.password!==void 0&&(this.password=e.password||null),e.fieldSize&&(this.fieldSize=e.fieldSize),this.showReplay=!0}addChatMessage(e,t,s,i){const r={time:new Date().toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"}),username:e,avatar:t||"",badge:s||"",text:i.slice(0,120)};return this.chatHistory.push(r),this.chatHistory.length>50&&this.chatHistory.shift(),r}getPublicInfo(){return{code:this.code,name:this.name,playersCount:this.players.length,maxPlayers:this.maxPlayers,hasPassword:!!this.password,status:this.status,duration:this.duration,goalLimit:this.goalLimit,hostId:this.hostId}}getLobbyInfo(){return{code:this.code,name:this.name,maxPlayers:this.maxPlayers,duration:this.duration,goalLimit:this.goalLimit,fieldSize:this.fieldSize,showReplay:this.showReplay,hostId:this.hostId,status:this.status,players:this.players,chatHistory:this.chatHistory}}}const jf=1024,Wf=640,D=36,ct=180,Rt=30,Ce=6,en=10,st=16,Js=.955,qf=.9,SS=2.3,aa=3.2,x_=6,Gh=90,AS=.0035,kS=.0035,la=82,M_=140,ca=9,L_=120,O_=80,$f=30,Yi=1/3,ha=3.8,V_=12,F_=34,B_=12,Xi=1/3,U_=22,j_=60,Os=180,zf=180,Be={RED:0,BLUE:1},Hn={EASY:"easy",MEDIUM:"medium",HARD:"hard"};class lt{static clamp(e,t,s){return Math.max(t,Math.min(s,e))}static rnd(e,t){return e+Math.random()*(t-e)}static normalizedAngle(e){return e%=Math.PI*2,e<-Math.PI?e+Math.PI*2:e>Math.PI?e-Math.PI*2:e}static lerpAngle(e,t,s){e=this.normalizedAngle(e),t=this.normalizedAngle(t);let i=this.normalizedAngle(t-e);return e+i*s}static circleCollision(e,t){const s=t.x-e.x,i=t.y-e.y,r=Math.hypot(s,i);return r<e.r+t.r?{dx:s,dy:i,d:r}:null}static collidePlayerWithCorner(e,t,s,i){const r=e.x-t,o=e.y-s,l=Math.hypot(r,o)||1e-6,c=e.r+i;if(l<c){const h=r/l,d=o/l,m=c-l;e.x+=h*m,e.y+=d*m;const p=e.vx*h+e.vy*d;e.vx-=.8*p*h,e.vy-=.8*p*d}}static collideBallWithCorner(e,t,s,i,r){const o=e.x-t,l=e.y-s,c=Math.hypot(o,l)||1e-6,h=e.r+i;if(c<h){const d=o/c,m=l/c,p=h-c;e.x+=d*p,e.y+=m*p;const E=e.vx*d+e.vy*m;e.vx-=1.7*E*d,e.vy-=1.7*E*m,e.strikeTimer>0&&(e.lastStrikeType==="kick"||e.lastStrikeType==="power")&&r&&r()}}static resolvePlayerPlayer(e){for(let t=0;t<e.length;t++)for(let s=t+1;s<e.length;s++){const i=e[t],r=e[s],o=this.circleCollision(i,r);if(!o)continue;const l=o.d||1e-6,c=o.dx/l,h=o.dy/l,d=(i.r+r.r-l)*.5;i.x-=c*d,i.y-=h*d,r.x+=c*d,r.y+=h*d;const m=r.vx-i.vx,p=r.vy-i.vy,E=m*c+p*h;let b=.7;(i.stun>0||r.stun>0||i.tackleFreeze>0||r.tackleFreeze>0)&&(b=0);const A=-E*b;i.vx-=A*c,i.vy-=A*h,r.vx+=A*c,r.vy+=A*h}}static resolvePlayerBall(e,t,s){for(const i of e){const r=this.circleCollision(i,t);if(!r)continue;const o=r.d||1e-6,l=r.dx/o,c=r.dy/o,h=i.r+t.r-o;t.owner||(t.noPickupFrames<=0||t.noPickupFrom!==i.id?(t.x+=l*h,t.y+=c*h,t.vx+=i.vx*.22,t.vy+=i.vy*.22,t.owner=i.id,t.lastStrikeType=null,t.strikeTimer=0,s&&s(i)):(t.x+=l*Math.max(0,h-1),t.y+=c*Math.max(0,h-1),t.vx+=i.vx*.05,t.vy+=i.vy*.05)),t.lastTouch=i.id}}static updatePlayerPhysics(e,t,s,i){if(e.stun>0){e.vx=0,e.vy=0,e.tackle_cd>0&&e.tackle_cd--,e.dribble_cd>0&&e.dribble_cd--,e.dash_time>0&&e.dash_time--,e.invuln>0&&e.invuln--,e.stun--,e.cool>0&&e.cool--,e.power_cd>0&&e.power_cd--,e.tackleFreeze>0&&e.tackleFreeze--,e.aiShootLock>0&&e.aiShootLock--,e.shootHalo>0&&e.shootHalo--,e.tackleEval>0&&(e.tackleEval--,e.tackleEval===0&&!e.tackleSuccess&&(e.stun=Math.max(e.stun,$f)));return}e.staminaLock>0?(e.stamina=0,e.staminaLock--):t.sprint&&e.stamina>0?(e.stamina=Math.max(0,e.stamina-kS),e.stamina===0&&(e.staminaLock=Gh)):e.stamina=Math.min(1,e.stamina+AS);const r=t.sprint&&e.staminaLock<=0&&e.stamina>0,o=e.slowTimer>0?.7:1;e.slowTimer>0&&e.slowTimer--;const c=SS*(r?1.5:1)*o,h=e.dash_time>0?1.7:1;let d=t.x||0,m=t.y||0;const p=Math.hypot(d,m)||1;if(e.vx=e.vx*qf+d/p*c*.12*h,e.vy=e.vy*qf+m/p*c*.12*h,d||m){const E=Math.atan2(m,d);e.dir=this.lerpAngle(e.dir,E,.35),e.lastMoveDir=e.dir}t.shoot?e.kickCharge=Math.min(1,e.kickCharge+.065):e.kickCharge*=.95,e.boostCooldown>0&&e.boostCooldown--,e.tackle_cd>0&&e.tackle_cd--,e.dribble_cd>0&&e.dribble_cd--,e.dash_time>0&&e.dash_time--,e.invuln>0&&e.invuln--,e.cool>0&&e.cool--,e.power_cd>0&&e.power_cd--,e.tackleFreeze>0&&e.tackleFreeze--,e.aiShootLock>0&&e.aiShootLock--,e.shootHalo>0&&e.shootHalo--,e.tackleEval>0&&(e.tackleEval--,e.tackleEval===0&&!e.tackleSuccess&&(e.vx=0,e.vy=0,e.stun=Math.max(e.stun,$f)))}static applyLimits(e,t,s,i,r,o,l,c,h=1024,d=640){let m=e.x+e.vx,p=e.y+e.vy;if(p>t&&p<s||(p-e.r<D&&(p=D+e.r,e.vy*=-.5),p+e.r>d-D&&(p=d-D-e.r,e.vy*=-.5)),p>t&&p<s){m-e.r<i&&(m=i+e.r,e.vx=Math.max(e.vx,0)*.5),m+e.r>r&&(m=r-e.r,e.vx=Math.min(e.vx,0)*.5);const E=m<D&&m>=i-6,b=m>h-D&&m<=r+6;(E||b)&&(p-e.r<t&&(p=t+e.r,e.vy=Math.max(e.vy,0)*.4),p+e.r>s&&(p=s-e.r,e.vy=Math.min(e.vy,0)*.4));const A={x:m,y:p,vx:e.vx,vy:e.vy,r:e.r};this.collidePlayerWithCorner(A,o,t,c),this.collidePlayerWithCorner(A,o,s,c),this.collidePlayerWithCorner(A,l,t,c),this.collidePlayerWithCorner(A,l,s,c),m=A.x,p=A.y,e.vx=A.vx,e.vy=A.vy}else{m-e.r<D&&(m=D+e.r,e.vx*=-.5),m+e.r>h-D&&(m=h-D-e.r,e.vx*=-.5);const E={x:m,y:p,vx:e.vx,vy:e.vy,r:e.r};this.collidePlayerWithCorner(E,o,t,c),this.collidePlayerWithCorner(E,o,s,c),this.collidePlayerWithCorner(E,l,t,c),this.collidePlayerWithCorner(E,l,s,c),m=E.x,p=E.y,e.vx=E.vx,e.vy=E.vy}e.x=m,e.y=p}static updateBallPhysics(e,t,s,i,r,o,l,c,h,d,m,p=1024,E=640){if(e.boostCooldown>0&&e.boostCooldown--,e.noPickupFrames>0&&(e.noPickupFrames--,e.noPickupFrames===0&&(e.noPickupFrom=null)),e.strikeTimer>0&&e.strikeTimer--,e.owner){const b=h.find(A=>A.id===e.owner);if(b){const A=b.r+e.r+1,P=Math.cos(b.dir||0),F=Math.sin(b.dir||0);let U=b.x+P*A,O=b.y+F*A,Y=D+e.r,oe=p-D-e.r;O>t&&O<s&&(Y=i+e.r,oe=r-e.r),e.x=this.clamp(U,Y,oe),e.y=this.clamp(O,D+e.r,E-D-e.r),e.vx=b.vx,e.vy=b.vy,O>t&&O<s&&(e.x+e.r<=o&&m("blue",b.id),e.x-e.r>=l&&m("red",b.id));return}else e.owner=null}if(e.vx*=Js,e.vy*=Js,e.x+=e.vx,e.y+=e.vy,e.y-e.r<D&&(e.y=D+e.r,e.vy*=-.75),e.y+e.r>E-D&&(e.y=E-D-e.r,e.vy*=-.75),e.x-e.r<D&&(e.y>t&&e.y<s?(this.collideBallWithCorner(e,o,t,c,()=>d("post")),this.collideBallWithCorner(e,o,s,c,()=>d("post"))):(e.x=D+e.r,e.vx*=-.75)),e.x+e.r>p-D&&(e.y>t&&e.y<s?(this.collideBallWithCorner(e,l,t,c,()=>d("post")),this.collideBallWithCorner(e,l,s,c,()=>d("post"))):(e.x=p-D-e.r,e.vx*=-.75)),e.y>t&&e.y<s){const b=e.x<D&&e.x>=i-30,A=e.x>p-D&&e.x<=r+30;(b||A)&&(b&&e.x-e.r<i&&(e.x=i+e.r,e.vx*=-.65),A&&e.x+e.r>r&&(e.x=r-e.r,e.vx*=-.65),e.y-e.r<t&&(e.y=t+e.r,e.vy*=-.65),e.y+e.r>s&&(e.y=s-e.r,e.vy*=-.65))}e.y>t&&e.y<s&&(e.x+e.r<=o&&m("blue",e.lastTouch),e.x-e.r>=l&&m("red",e.lastTouch))}static kickBall(e,t,s,i){t.owner=null,t.noPickupFrames=14,t.noPickupFrom=e.id,t.vx+=Math.cos(s)*i,t.vy+=Math.sin(s)*i,t.vx+=this.rnd(-.05,.05),t.vy+=this.rnd(-.05,.05),t.lastTouch=e.id,t.lastStrikeType="kick",t.strikeTimer=40}static powerKick(e,t,s,i){t.owner=null,t.noPickupFrames=14,t.noPickupFrom=e.id,t.vx+=Math.cos(s)*i,t.vy+=Math.sin(s)*i,t.vx+=this.rnd(-.05,.05),t.vy+=this.rnd(-.05,.05),t.lastTouch=e.id,t.lastStrikeType="power",t.strikeTimer=40}}class PS{constructor(e,t,s,i,r,o,l="medium"){this.roomCode=e,this.duration=t,this.goalLimit=s,this.io=r,this.onMatchEnd=o,this.fieldSize=l,this.fieldSize==="small"?(this.w=896,this.h=560):this.fieldSize==="large"?(this.w=1280,this.h=768):(this.w=1024,this.h=640),this.score={red:0,blue:0},this.matchTime=t*60,this.status="countdown",this.countdownTimer=300,this.goalFreezeTimer=0,this.endFreezeTimer=0,this.isHostPaused=!1,this.ball={x:this.w/2,y:this.h/2,vx:0,vy:0,r:en,owner:null,lastTouch:null,strikeTimer:0,lastStrikeType:null,noPickupFrames:0,noPickupFrom:null},this.players=i.map(c=>this.createPhysicalPlayer(c)),this.inputs=new Map,this.players.forEach(c=>{c.cpu||this.inputs.set(c.id,{x:0,y:0,shoot:!1,sprint:!1,dribble:!1,tackle:!1,power:!1})}),this.soundEffects=[],this.replayBuffer=new Array(Os*2),this.replayBufferIndex=0,this.lastGoal=null,this.tickInterval=setInterval(()=>this.tick(),1e3/60),this.kickoff()}createPhysicalPlayer(e){const s=e.team==="red"?D+120:this.w-D-120,i=this.h*.5;return{id:e.id,uid:e.uid||"",name:e.username,badge:e.badge,team:e.team==="red"?Be.RED:Be.BLUE,cpu:!!e.cpu,difficulty:e.difficulty||Hn.MEDIUM,role:"mf",x:s,y:i,vx:0,vy:0,r:st,dir:0,lastMoveDir:0,stamina:1,staminaLock:0,stun:0,slowTimer:0,tackle_cd:0,dribble_cd:0,dash_time:0,invuln:0,power_cd:0,tackleFreeze:0,tackleSuccess:!1,tackleEval:0,shootHalo:0,aiShootLock:0,aiFeintLock:0,home:{x:s,y:i}}}updateInput(e,t){this.inputs.has(e)&&this.inputs.set(e,{x:lt.clamp(t.x||0,-1,1),y:lt.clamp(t.y||0,-1,1),shoot:!!t.shoot,sprint:!!t.sprint,dribble:!!t.dribble,tackle:!!t.tackle,power:!!t.power})}kickoff(){const e=this.players.filter(i=>i.team===Be.RED),t=this.players.filter(i=>i.team===Be.BLUE),s=(i,r)=>{const o=[{dx:120,dy:.5},{dx:250,dy:.5},{dx:180,dy:.3},{dx:180,dy:.7}];i.forEach((l,c)=>{const h=o[c%o.length],d=(Math.random()-.5)*20,m=(Math.random()-.5)*20;l.x=r?D+h.dx+d:this.w-D-h.dx+d,l.y=this.h*h.dy+m,l.vx=0,l.vy=0,l.kickCharge=0,l.stamina=1,l.staminaLock=0,l.stun=0,l.tackle_cd=0,l.dribble_cd=0,l.dash_time=0,l.invuln=0,l.power_cd=0,l.tackleFreeze=0,l.tackleSuccess=!1,l.tackleEval=0,l.shootHalo=0,l.aiShootLock=0,l.aiFeintLock=0})};s(e,!0),s(t,!1),this.ball.x=this.w*.5,this.ball.y=this.h*.5,this.ball.vx=0,this.ball.vy=0,this.ball.owner=null,this.ball.lastTouch=null,this.ball.strikeTimer=0,this.ball.lastStrikeType=null,this.ball.noPickupFrames=0,this.ball.noPickupFrom=null,this.soundEffects.push("whistle")}recordFrame(){const e=this.players.map(s=>({x:s.x,y:s.y,dir:s.dir,team:s.team,has:this.ball.owner===s.id,name:s.name||"",badge:s.badge||"",inv:s.invuln||0,stun:s.stun||0,halo:s.shootHalo||0})),t={ball:{x:this.ball.x,y:this.ball.y},players:e,score:{...this.score},sfx:[...this.soundEffects]};this.replayBuffer[this.replayBufferIndex]=t,this.replayBufferIndex=(this.replayBufferIndex+1)%this.replayBuffer.length}getReplayQueue(){const e=[];for(let t=0;t<this.replayBuffer.length;t++){const s=(this.replayBufferIndex+t)%this.replayBuffer.length;this.replayBuffer[s]&&e.push(this.replayBuffer[s])}return e}triggerGoal(e,t){if(this.status!=="playing")return;this.status="freeze",this.goalFreezeTimer=Os;const s=this.players.find(o=>o.id===t),i=s?s.name:"Desconhecido",r=s?e==="blue"&&s.team===Be.RED||e==="red"&&s.team===Be.BLUE:!1;e==="blue"?this.score.blue++:this.score.red++,this.lastGoal={side:e,scorerName:i,scorerId:t,ownGoal:r},this.soundEffects.push("whistle"),this.soundEffects.push("goal"),this.soundEffects.push("cheer")}processBotAI(e){if(e.stun>0)return;const t=this.players.filter(H=>H.team===e.team),s=this.players.filter(H=>H.team!==e.team),i=e.team===Be.RED?this.w-D-Ce-2:D+Ce+2,r=(this.h-ct)/2,o=(this.h+ct)/2,l={x:this.ball.x,y:this.ball.y};if(!this.ball.owner){let H=this.ball.vx,ve=this.ball.vy;for(let we=0;we<10;we++)H*=Js,ve*=Js,l.x+=H,l.y+=ve}const c=Math.hypot(l.x-e.x,l.y-e.y),d=t.reduce((H,ve)=>{const we=Math.hypot(l.x-ve.x,l.y-ve.y);return we<H.d?{p:ve,d:we}:H},{p:null,d:1e9}).p===e;let m=!1;e.difficulty!==Hn.EASY&&(m=this.ball.owner===e.id&&Math.abs(i-e.x)>220||!this.ball.owner&&(d||c>140));const p=m&&e.staminaLock<=0&&e.stamina>.35;let E=l.x,b=l.y;if(this.ball.owner===e.id)E=i,b=lt.clamp(e.y,r+20,o-20);else if(this.ball.owner&&this.players.find(H=>H.id===this.ball.owner).team!==e.team){const H=this.players.find(we=>we.id===this.ball.owner);if(Math.hypot(H.x-e.x,H.y-e.y)>200){const we=e.team===Be.RED?D:this.w-D;E=we+(H.x-we)*.7,b=this.h*.5+(H.y-this.h*.5)*.7}else E=H.x,b=H.y}let A=E-e.x,P=b-e.y,F=Math.hypot(A,P)||1,U=A/F,O=P/F,Y=0,oe=0;if(e.difficulty===Hn.HARD)for(const H of s){const ve=e.x-H.x,we=e.y-H.y,Le=Math.hypot(ve,we);if(Le<110){const qe=(110-Le)/110;Y+=ve/(Le||1)*qe*.7,oe+=we/(Le||1)*qe*.7}}let ee=U+Y,I=O+oe;const y=Math.hypot(ee,I)||1;ee/=y,I/=y;let _=0;e.difficulty===Hn.EASY?_=.25:e.difficulty===Hn.MEDIUM&&(_=.12),_>0&&Math.random()<.05&&(ee+=lt.rnd(-_,_),I+=lt.rnd(-_,_));let w=!1,T=!1,C=!1,v=!1;if(this.ball.owner===e.id){const H=Math.abs(i-e.x),ve=e.y>r&&e.y<o;(H<100||H<160&&ve)&&(w=!0),e.difficulty===Hn.HARD&&(s.reduce((Le,qe)=>{const wt=Math.hypot(qe.x-e.x,qe.y-e.y);return wt<Le.d?{p:qe,d:wt}:Le},{p:null,d:1e9}).d<90&&e.dribble_cd<=0&&e.stamina>=Xi&&(T=!0),e.power_cd<=0&&e.stamina>.98&&H>250&&H<500&&(v=!0))}else if(this.ball.owner&&this.players.find(H=>H.id===this.ball.owner).team!==e.team){const H=this.players.find(we=>we.id===this.ball.owner);Math.hypot(H.x-e.x,H.y-e.y)<la&&e.tackle_cd<=0&&e.stamina>=Yi&&e.difficulty!==Hn.EASY&&(C=!0)}this.inputs.set(e.id,{x:ee,y:I,shoot:w,sprint:p,dribble:T,tackle:C,power:v})}tick(){if(this.soundEffects=[],this.isHostPaused){const h={ball:{x:this.ball.x,y:this.ball.y,vx:this.ball.vx,vy:this.ball.vy,owner:this.ball.owner},players:this.players.map(d=>({id:d.id,team:d.team,x:d.x,y:d.y,dir:d.dir,stamina:d.stamina,staminaLock:d.staminaLock,stun:d.stun,shootHalo:d.shootHalo,invuln:d.invuln,badge:d.badge,name:d.name})),score:this.score,matchTime:this.matchTime,status:this.status,countdown:Math.max(0,Math.ceil(this.countdownTimer/60)),soundEffects:[],isHostPaused:!0};this.io.to(this.roomCode).emit("gameState",h);return}const e=(this.h-ct)/2,t=(this.h+ct)/2,s=D-Ce,i=this.w-D+Ce,r=s-Rt,o=i+Rt,l=10;if(this.status==="countdown")this.countdownTimer--,this.countdownTimer<=0&&(this.status="playing"),this.recordFrame();else if(this.status==="freeze")this.goalFreezeTimer--,this.recordFrame(),this.goalFreezeTimer<=0&&(this.io.to(this.roomCode).emit("playReplay",{replayFrames:this.getReplayQueue(),goalInfo:this.lastGoal}),this.status="replay",this.countdownTimer=Os*2*3+5);else if(this.status==="replay")this.countdownTimer--,this.countdownTimer<=0&&((this.score.red>=this.goalLimit||this.score.blue>=this.goalLimit)&&this.goalLimit>0?(this.status="end-freeze",this.endFreezeTimer=zf):(this.status="countdown",this.countdownTimer=300,this.kickoff()));else if(this.status==="end-freeze")this.endFreezeTimer--,this.recordFrame(),this.endFreezeTimer<=0&&(this.status="ended",this.onMatchEnd(this.score),clearInterval(this.tickInterval));else if(this.status==="playing"){this.matchTime-=1/60,this.matchTime<=0&&(this.matchTime=0,this.status="end-freeze",this.endFreezeTimer=zf);for(const h of this.players)h.cpu&&this.processBotAI(h);for(const h of this.players){const d=this.inputs.get(h.id)||{x:0,y:0,shoot:!1,sprint:!1,dribble:!1,tackle:!1,power:!1};if(h.stun<=0){if(d.tackle&&h.tackle_cd<=0&&h.stamina>=Yi){h.stamina=Math.max(0,h.stamina-Yi),h.tackle_cd=M_,h.tackleSuccess=!1,h.tackleEval=12,h.slowTimer=O_,h.tackleFreeze=8,this.soundEffects.push("tackle");const m=this.players.find(E=>E.id===this.ball.owner),p=m?Math.atan2(m.y-h.y,m.x-h.x):h.dir;h.vx+=Math.cos(p)*ca,h.vy+=Math.sin(p)*ca,m&&m.team!==h.team&&m.invuln<=0&&Math.hypot(m.x-h.x,m.y-h.y)<=la&&(this.ball.owner=h.id,this.ball.lastTouch=h.id,this.ball.noPickupFrames=10,this.ball.noPickupFrom=null,this.ball.vx=0,this.ball.vy=0,m.stun=Math.max(m.stun,L_),m.vx=0,m.vy=0,h.tackleSuccess=!0)}if(d.dribble&&h.dribble_cd<=0&&this.ball.owner===h.id&&h.stamina>=Xi&&(h.stamina=Math.max(0,h.stamina-Xi),h.dash_time=V_,h.invuln=B_,h.dribble_cd=F_,h.vx+=Math.cos(h.dir)*ha,h.vy+=Math.sin(h.dir)*ha,this.soundEffects.push("dribble")),d.power&&h.power_cd<=0&&h.stamina>=.5&&(this.ball.owner===h.id||Math.hypot(h.x-this.ball.x,h.y-this.ball.y)<h.r+this.ball.r+8)){h.stamina=Math.max(0,h.stamina-.5),h.stamina===0&&(h.staminaLock=Gh),h.power_cd=j_,h.cool=12,h.shootHalo=22;const m=d.x||d.y?Math.atan2(d.y,d.x):h.dir;lt.powerKick(h,this.ball,m,U_),this.soundEffects.push("power")}if(h.kickCharge>0&&!d.shoot){if(this.ball.owner===h.id||Math.hypot(h.x-this.ball.x,h.y-this.ball.y)<h.r+this.ball.r+14){const p=lt.clamp(h.kickCharge,0,1);h.cool=14,h.shootHalo=18;const E=d.x||d.y?Math.atan2(d.y,d.x):h.dir,b=Math.max(aa,aa+x_*p);lt.kickBall(h,this.ball,E,b),this.soundEffects.push("kick")}h.kickCharge=0}}lt.updatePlayerPhysics(h,d,this.ball,m=>this.soundEffects.push(m)),lt.applyLimits(h,e,t,r,o,s,i,l,this.w,this.h)}lt.resolvePlayerPlayer(this.players),lt.resolvePlayerBall(this.players,this.ball,h=>{for(const d of this.players)d.tackleEval>0&&this.ball.owner===d.id&&(d.tackleSuccess=!0)}),lt.updateBallPhysics(this.ball,e,t,r,o,s,i,l,this.players,h=>this.soundEffects.push(h),(h,d)=>this.triggerGoal(h,d),this.w,this.h),this.recordFrame()}const c={ball:{x:this.ball.x,y:this.ball.y,vx:this.ball.vx,vy:this.ball.vy,owner:this.ball.owner},players:this.players.map(h=>({id:h.id,team:h.team,x:h.x,y:h.y,dir:h.dir,stamina:h.stamina,staminaLock:h.staminaLock,stun:h.stun,shootHalo:h.shootHalo,invuln:h.invuln,badge:h.badge,name:h.name})),score:this.score,matchTime:this.matchTime,status:this.status,countdown:Math.max(0,Math.ceil(this.countdownTimer/60)),soundEffects:this.soundEffects,isHostPaused:!1};this.io.to(this.roomCode).emit("gameState",c)}changeFieldSize(e){this.fieldSize=e,this.fieldSize==="small"?(this.w=896,this.h=560):this.fieldSize==="large"?(this.w=1280,this.h=768):(this.w=1024,this.h=640),this.physics=new lt(this.w,this.h),this.ball.x=this.w/2,this.ball.y=this.h/2,this.ball.vx=0,this.ball.vy=0}resetMatch(){this.score={red:0,blue:0},this.matchTime=this.duration*60,this.status="countdown",this.countdownTimer=300,this.ball.x=this.w/2,this.ball.y=this.h/2,this.ball.vx=0,this.ball.vy=0}stop(){clearInterval(this.tickInterval)}}class NS{constructor(){this.listeners=new Map,this.clientId=null,this.peer=null,this.isHost=!1,this.roomCode=null,this.presenceBound=!1,this.connections=[],this.hostConn=null,this.serverRoom=null}connect(e=window.location.origin){return this.clientId||(this.clientId="user_"+Math.random().toString(36).substring(2,8)),console.log(`[P2PSocket] Inicializado com ID do Cliente: ${this.clientId}`),this.listenToPublicRooms(),this.setupPresenceTracking(),this}disconnect(){this.leaveRoom()}getSocket(){return this}get id(){return this.clientId}on(e,t){this.listeners.has(e)||this.listeners.set(e,[]),this.listeners.get(e).push(t)}once(e,t){const s=i=>{this.off(e,s),t(i)};this.on(e,s)}off(e,t){if(!t){this.listeners.delete(e);return}const s=this.listeners.get(e);s&&this.listeners.set(e,s.filter(i=>i!==t))}triggerLocalEvent(e,t){const s=this.listeners.get(e);s&&s.forEach(i=>{try{i(t)}catch(r){console.error(`[P2PSocket] Erro no listener do evento ${e}:`,r)}})}emit(e,t){this.isHost?this.handleHostReceivedData(this.clientId,e,t):this.hostConn&&this.hostConn.open&&this.hostConn.send({event:e,data:t})}broadcast(e,t){this.triggerLocalEvent(e,t),this.connections.forEach(s=>{s.open&&s.send({event:e,data:t})})}createRoom(e,t,s,i,r,o,l,c){const h="ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";let d="";for(let m=0;m<6;m++)d+=h.charAt(Math.floor(Math.random()*h.length));this.isHost=!0,this.roomCode=d,this.peer&&this.peer.destroy(),this.peer=new Peer(this.clientId),this.peer.on("open",m=>{console.log("[P2PSocket] Host Peer criado:",m),this.serverRoom=new RS(d,e,this.clientId,{maxPlayers:parseInt(s)||10,password:t||null,duration:parseInt(i)||3,goalLimit:parseInt(r)||3,fieldSize:o||"medium",showReplay:!0}),this.serverRoom.addPlayer(this.clientId,c,"spectator"),this.connections=[];const p=et(tt,`multiplayerRooms/${d}`);oa(p,{code:d,name:e,maxPlayers:parseInt(s)||10,password:t||"",playersCount:1,status:"lobby",duration:parseInt(i)||3,goalLimit:parseInt(r)||3,fieldSize:o||"medium",hostPeerId:m}).then(()=>{this.triggerLocalEvent("roomCreated",d),this.triggerLocalEvent("lobbyUpdate",this.serverRoom.getLobbyInfo())})}),this.peer.on("connection",m=>{console.log("[P2PSocket] Recebida tentativa de conexão de:",m.peer),m.on("data",p=>{p&&p.event&&this.handleHostReceivedData(m.peer,p.event,p.data,m)}),m.on("close",()=>{this.handleHostPlayerDisconnect(m)}),m.on("error",p=>{console.error("[P2PSocket] Erro no canal de dados do peer:",p)})})}joinRoom(e,t,s){const i=e.toUpperCase();this.isHost=!1,this.roomCode=i;const r=et(tt,`multiplayerRooms/${i}`);P_(r).then(o=>{if(!o.exists()){this.triggerLocalEvent("joinError","Sala não encontrada.");return}const l=o.val();if(l.password&&l.password!==t){this.triggerLocalEvent("joinError","Senha incorreta.");return}if(l.playersCount>=l.maxPlayers){this.triggerLocalEvent("joinError","Sala cheia.");return}this.peer&&this.peer.destroy(),this.peer=new Peer(this.clientId),this.peer.on("open",c=>{console.log("[P2PSocket] Conectando como convidado com ID:",c);const h=this.peer.connect(l.hostPeerId);this.hostConn=h,h.on("open",()=>{console.log("[P2PSocket] WebRTC aberto com Host. Enviando requisição de entrada..."),h.send({event:"joinRoom",data:{profile:s}})}),h.on("data",d=>{const{event:m,data:p}=d;m==="joinSuccess"?this.triggerLocalEvent("joinSuccess",i):m==="joinError"?(this.triggerLocalEvent("joinError",p),this.leaveRoom()):this.triggerLocalEvent(m,p)}),h.on("close",()=>{console.log("[P2PSocket] Host encerrou a conexão."),this.triggerLocalEvent("kicked"),this.leaveRoom()})}),this.peer.on("error",c=>{console.error("[P2PSocket] Erro do guest peer:",c),this.triggerLocalEvent("joinError","Falha ao conectar via WebRTC.")})})}leaveRoom(){if(this.isHost&&this.roomCode){const e=et(tt,`multiplayerRooms/${this.roomCode}`);nS(e),this.serverRoom&&this.serverRoom.match&&(this.serverRoom.match.isHostPaused=!1,clearInterval(this.serverRoom.match.tickInterval)),this.connections.forEach(t=>t.close()),this.connections=[],this.serverRoom=null}else this.hostConn&&(this.hostConn.close(),this.hostConn=null);this.peer&&(this.peer.destroy(),this.peer=null),this.isHost=!1,this.roomCode=null}handleHostReceivedData(e,t,s,i){if(this.serverRoom)if(t==="joinRoom"){const{profile:r}=s;if(this.serverRoom.players.length>=this.serverRoom.maxPlayers){i&&i.send({event:"joinError",data:"Sala cheia."});return}i&&(i.peerId=e,this.connections.push(i)),this.serverRoom.addPlayer(e,r,"spectator");const o=et(tt,`multiplayerRooms/${this.roomCode}`);As(o,{playersCount:this.serverRoom.players.length}),i&&i.send({event:"joinSuccess",data:this.roomCode}),this.broadcast("lobbyUpdate",this.serverRoom.getLobbyInfo());const l=this.serverRoom.addChatMessage("Sistema","","📢",`${r.username} entrou na sala.`);this.broadcast("chatMessage",l)}else if(t==="changeTeam")this.serverRoom.changeTeam(e,s)&&this.broadcast("lobbyUpdate",this.serverRoom.getLobbyInfo());else if(t==="toggleReady")this.serverRoom.toggleReady(e),this.broadcast("lobbyUpdate",this.serverRoom.getLobbyInfo());else if(t==="chatMessage"){const r=this.serverRoom.players.find(h=>h.id===e),o=r?r.username:"Jogador",l=r?r.badge:"",c=this.serverRoom.addChatMessage(o,"",l,s);this.broadcast("chatMessage",c)}else t==="gameInput"?this.serverRoom.match&&this.serverRoom.match.updateInput(e,s):t==="hostFocusChanged"&&this.serverRoom.match&&(this.serverRoom.match.isHostPaused=!!s.focusLost)}handleHostPlayerDisconnect(e){const t=e.peer;if(this.connections=this.connections.filter(s=>s!==e),this.serverRoom){const s=this.serverRoom.removePlayer(t),i=et(tt,`multiplayerRooms/${this.roomCode}`);if(As(i,{playersCount:this.serverRoom.players.length}),s){const r=this.serverRoom.addChatMessage("Sistema","","📢",`${s.username} saiu da sala.`);this.broadcast("chatMessage",r)}this.broadcast("lobbyUpdate",this.serverRoom.getLobbyInfo())}}changeTeam(e){this.emit("changeTeam",e)}toggleReady(){this.emit("toggleReady")}sendChatMessage(e){this.emit("chatMessage",e)}addBot(e){if(!this.isHost||!this.serverRoom)return;const t=`bot_${Math.random().toString(36).substr(2,5)}`,s={uid:"",username:`Bot ${e==="red"?"Vermelho":"Azul"} (CPU)`,badge:"⚙️",cpu:!0,difficulty:"medium"};this.serverRoom.addPlayer(t,s,e),this.broadcast("lobbyUpdate",this.serverRoom.getLobbyInfo())}removeBot(e){!this.isHost||!this.serverRoom||(this.serverRoom.removePlayer(e),this.broadcast("lobbyUpdate",this.serverRoom.getLobbyInfo()))}kickPlayer(e){if(!this.isHost||!this.serverRoom)return;const t=this.connections.find(i=>i.peer===e),s=this.serverRoom.players.find(i=>i.id===e);if(s){this.serverRoom.removePlayer(e),this.broadcast("lobbyUpdate",this.serverRoom.getLobbyInfo());const i=this.serverRoom.addChatMessage("Sistema","","📢",`${s.username} foi expulso da sala.`);this.broadcast("chatMessage",i),t&&(t.send({event:"kicked"}),t.close())}}updateRoomSettings(e){if(!this.isHost||!this.serverRoom)return;this.serverRoom.updateSettings(e),this.broadcast("lobbyUpdate",this.serverRoom.getLobbyInfo());const t=et(tt,`multiplayerRooms/${this.roomCode}`);As(t,{name:this.serverRoom.name,maxPlayers:this.serverRoom.maxPlayers,duration:this.serverRoom.duration,goalLimit:this.serverRoom.goalLimit,fieldSize:this.serverRoom.fieldSize})}startGame(){if(!this.isHost||!this.serverRoom)return;const e=this.serverRoom.players.filter(r=>r.team==="red"),t=this.serverRoom.players.filter(r=>r.team==="blue");if(e.length===0||t.length===0){this.triggerLocalEvent("startError","Cada time precisa de pelo menos 1 jogador (ou bot).");return}this.serverRoom.status="playing";const s={to:r=>({emit:(o,l)=>{this.broadcast(o,l)}})};this.serverRoom.match=new PS(this.roomCode,this.serverRoom.duration,this.serverRoom.goalLimit,this.serverRoom.players,s,r=>{this.serverRoom.status="lobby",this.serverRoom.players.forEach(l=>l.ready=!1),this.serverRoom.match=null,this.broadcast("matchEnded",r),this.broadcast("lobbyUpdate",this.serverRoom.getLobbyInfo());const o=et(tt,`multiplayerRooms/${this.roomCode}`);As(o,{status:"lobby"})},this.serverRoom.fieldSize),this.broadcast("matchStarted");const i=et(tt,`multiplayerRooms/${this.roomCode}`);As(i,{status:"playing"})}sendGameInput(e){this.emit("gameInput",e)}hostResetMatch(){this.isHost&&this.serverRoom&&this.serverRoom.match&&(this.serverRoom.match.resetMatch(),this.broadcast("matchReset"))}hostChangeFieldSize(e){this.isHost&&this.serverRoom&&(this.serverRoom.fieldSize=e,this.serverRoom.match&&this.serverRoom.match.changeFieldSize(e),this.broadcast("fieldSizeUpdated",{size:e}))}onLobbyUpdate(e){this.on("lobbyUpdate",e)}onChat(e){this.on("chatMessage",e)}onMatchStarted(e){this.on("matchStarted",e)}onGameState(e){this.off("gameState"),this.on("gameState",e)}onPlayReplay(e){this.on("playReplay",e)}onMatchEnded(e){this.on("matchEnded",e)}onKicked(e){this.on("kicked",e)}onPublicRoomsList(e){this.on("publicRoomsList",e)}clearListeners(){this.off("lobbyUpdate"),this.off("chatMessage"),this.off("matchStarted"),this.off("gameState"),this.off("playReplay"),this.off("matchEnded"),this.off("kicked"),this.off("publicRoomsList")}listenToPublicRooms(){const e=et(tt,"multiplayerRooms");Pl(e,t=>{const s=t.val()||{},i=Object.keys(s).map(r=>s[r]);this.triggerLocalEvent("publicRoomsList",i)})}stopListeningToPublicRooms(){const e=et(tt,"multiplayerRooms");iS(e)}setupPresenceTracking(){this.presenceBound||(this.presenceBound=!0,Pm(To,e=>{if(e){console.log(`[Presence] Usuário autenticado: ${e.uid}. Monitorando presença...`);const t=et(tt,".info/connected"),s=et(tt,`presence/${e.uid}`);Pl(t,r=>{r.val()===!0&&(oa(s,{uid:e.uid,username:e.displayName||"Jogador",timestamp:Date.now()}),eS(s).remove())});const i=et(tt,"presence");Pl(i,r=>{const o=r.val()||{},l=Object.keys(o).length,c=document.getElementById("online-users-count");c&&(c.textContent=l)})}else{const t=document.getElementById("online-users-count");t&&(t.textContent="...")}}))}}const G=new NS;class DS{constructor(){this.x=jf/2,this.y=Wf/2,this.r=en,this.targetX=jf/2,this.targetY=Wf/2,this.owner=null}updateState(e){this.targetX=e.x,this.targetY=e.y,this.owner=e.owner}interpolate(e=.35){this.x+=(this.targetX-this.x)*e,this.y+=(this.targetY-this.y)*e}draw(e){e.fillStyle="rgba(0,0,0,.25)",e.beginPath(),e.ellipse(this.x+3,this.y+6,this.r*1.1,this.r*.6,0,0,Math.PI*2),e.fill();const t=e.createRadialGradient(this.x-5,this.y-5,4,this.x,this.y,this.r);t.addColorStop(0,"#ffffff"),t.addColorStop(1,"#bfc8d6"),e.fillStyle=t,e.beginPath(),e.arc(this.x,this.y,this.r,0,Math.PI*2),e.fill()}}class Hf{constructor(e){this.id=e.id,this.name=e.name,this.badge=e.badge,this.team=e.team,this.x=e.x,this.y=e.y,this.r=st,this.dir=e.dir||0,this.targetX=e.x,this.targetY=e.y,this.targetDir=e.dir||0,this.stamina=e.stamina,this.staminaLock=e.staminaLock,this.stun=e.stun,this.shootHalo=e.shootHalo,this.invuln=e.invuln,this.trail=[]}updateState(e){this.name=e.name,this.badge=e.badge,this.targetX=e.x,this.targetY=e.y,this.targetDir=e.dir,this.stamina=e.stamina,this.staminaLock=e.staminaLock,this.stun=e.stun,this.shootHalo=e.shootHalo,this.invuln=e.invuln,this.staminaLock<=0&&this.invuln>0?(this.trail.push({x:this.x,y:this.y,alpha:.5}),this.trail.length>5&&this.trail.shift()):this.trail.length>0&&this.trail.shift()}interpolate(e=.35){this.x+=(this.targetX-this.x)*e,this.y+=(this.targetY-this.y)*e;let t=this.targetDir-this.dir;t=Math.atan2(Math.sin(t),Math.cos(t)),this.dir+=t*e}draw(e,t){e.save();for(const s of this.trail)e.fillStyle=this.team===Be.RED?`rgba(239, 68, 68, ${s.alpha})`:`rgba(96, 165, 250, ${s.alpha})`,e.beginPath(),e.arc(s.x,s.y,this.r-2,0,Math.PI*2),e.fill(),s.alpha-=.1;if(e.restore(),e.fillStyle="rgba(0,0,0,.25)",e.beginPath(),e.ellipse(this.x+4,this.y+8,this.r*1.1,this.r*.6,0,0,Math.PI*2),e.fill(),e.beginPath(),e.arc(this.x,this.y,this.r,0,Math.PI*2),e.fillStyle=this.team===Be.RED?"#ef4444":"#3b82f6",e.fill(),e.lineWidth=2,e.strokeStyle="rgba(0,0,0,.45)",e.stroke(),this.shootHalo>0&&(e.strokeStyle="#000000",e.lineWidth=2,e.beginPath(),e.arc(this.x,this.y,this.r+2,0,Math.PI*2),e.stroke()),this.badge){e.fillStyle="#0b1020";const s=bS(this.badge),i=s.length>=2&&!CS(s[0])?14:16;e.font=`700 ${i}px system-ui, "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif`,e.textAlign="center",e.textBaseline="middle",e.fillText(this.badge,this.x,this.y)}this.invuln>0&&(e.strokeStyle="#22c55e",e.setLineDash([4,4]),e.beginPath(),e.arc(this.x,this.y,this.r+4,0,Math.PI*2),e.stroke(),e.setLineDash([])),t===this.id&&(e.fillStyle="rgba(255,255,255,.85)",e.beginPath(),e.moveTo(this.x,this.y-this.r-10),e.lineTo(this.x-6,this.y-this.r-2),e.lineTo(this.x+6,this.y-this.r-2),e.closePath(),e.fill()),this.stun>0&&(e.strokeStyle="#ef4444",e.lineWidth=2,e.beginPath(),e.arc(this.x,this.y,this.r+2,0,Math.PI*2),e.stroke()),this.name&&(e.fillStyle="#e2e8f0",e.font="700 12px system-ui",e.textAlign="center",e.fillText(this.name,this.x,this.y-this.r-14))}}const Gf={currentUser:null,mode:"solo",difficulty:"medium",score:{red:0,blue:0},matchTime:0,goalLimit:3,status:"lobby",countdown:0,activeRoom:null,canvas:null,ctx:null,ball:null,players:[],localPhysicsTick:null,keys:new Map,codes:new Map,replayFrames:[],inReplay:!1,replayFrameIdx:0,replayTimer:0,replayBlob:null,mediaRecorder:null,recordedChunks:[],isRecording:!1,goalsScored:0,assistsGained:0,savesDone:0,async init(n){this.currentUser=n,this.canvas=document.getElementById("match-canvas"),this.canvas&&(this.ctx=this.canvas.getContext("2d",{alpha:!1})),window.addEventListener("keydown",e=>{const s=(e.key||"").toLowerCase();s&&this.keys.set(s,!0),e.code&&this.codes.set(e.code,!0),W.currentScreenId==="match-screen"&&["arrowup","arrowdown","arrowleft","arrowright"," ","enter"].includes(s)&&e.preventDefault()}),window.addEventListener("keyup",e=>{const s=(e.key||"").toLowerCase();s&&this.keys.set(s,!1),e.code&&this.codes.set(e.code,!1)}),window.addEventListener("blur",()=>this.keys.clear()),this.setupViewTriggers(),this.bindDOMEvents();try{G.connect();const e=G.getSocket();e&&e.on("onlineUsersCount",t=>{const s=document.getElementById("online-users-count");s&&(s.textContent=t)})}catch(e){console.warn("[Socket.IO] Failed to connect on startup:",e)}},setupViewTriggers(){const n=document.getElementById("mode-btn-back");n&&(n.onclick=()=>W.show("menu-screen"));const e=document.getElementById("mode-card-solo");e&&(e.onclick=()=>{this.mode="solo",W.show("solo-screen")});const t=document.getElementById("mode-card-multiplayer");t&&(t.onclick=()=>{this.mode="multiplayer",W.show("multiplayer-screen")});const s=document.getElementById("solo-btn-back");s&&(s.onclick=()=>W.show("mode-select-screen"));const i=document.getElementById("multiplayer-btn-back");i&&(i.onclick=()=>W.show("mode-select-screen"));const r=document.getElementById("create-room-btn-back");r&&(r.onclick=()=>W.show("multiplayer-screen"));const o=document.getElementById("join-code-btn-back");o&&(o.onclick=()=>W.show("multiplayer-screen")),W.register("multiplayer-screen",{onEnter:()=>{G.connect(),G.onPublicRoomsList(l=>this.renderRoomsList(l))},onExit:()=>{G.clearListeners()}}),W.register("lobby-screen",{onEnter:()=>{G.onLobbyUpdate(l=>this.updateLobbyView(l)),G.onChat(l=>this.appendChatMessage(l)),G.onMatchStarted(()=>{he("A partida está começando!","success"),W.show("match-screen")}),G.onKicked(()=>{he("Você foi expulso do lobby pelo Host.","error"),W.show("multiplayer-screen")})},onExit:()=>{G.clearListeners()}}),W.register("match-screen",{onEnter:()=>{yt.ensureAudio(),this.startMatchView()},onExit:()=>{this.stopMatchView()}}),W.register("ranking-screen",{onEnter:()=>this.loadRanking("wins")})},bindDOMEvents(){const n=document.querySelectorAll("#solo-ai-difficulty button");n.forEach(_=>{_.onclick=()=>{n.forEach(w=>w.classList.remove("active")),_.classList.add("active"),this.difficulty=_.getAttribute("data-diff")}});const e=document.getElementById("solo-btn-start");e&&(e.onclick=()=>{this.goalLimit=parseInt(document.getElementById("solo-goals").value,10),this.matchTime=parseInt(document.getElementById("solo-minutes").value,10)*60,W.show("match-screen")});const t=document.getElementById("lobby-btn-leave");t&&(t.onclick=()=>{G.leaveRoom(),W.show("multiplayer-screen")});const s=document.getElementById("lobby-btn-ready");s&&(s.onclick=()=>{G.toggleReady()});const i=document.getElementById("lobby-btn-start");i&&(i.onclick=()=>{G.startGame()});const r=document.getElementById("lobby-btn-join-red");r&&(r.onclick=()=>G.changeTeam("red"));const o=document.getElementById("lobby-btn-join-blue");o&&(o.onclick=()=>G.changeTeam("blue"));const l=document.getElementById("lobby-btn-join-spec");l&&(l.onclick=()=>G.changeTeam("spectator"));const c=document.getElementById("btn-add-bot-red");c&&(c.onclick=()=>G.addBot("red"));const h=document.getElementById("btn-add-bot-blue");h&&(h.onclick=()=>G.addBot("blue"));const d=document.getElementById("btn-copy-code");d&&(d.onclick=()=>{const _=document.getElementById("lobby-room-code").textContent;navigator.clipboard.writeText(_).then(()=>{he("Código copiado!","success")})});const m=document.getElementById("lobby-chat-form");m&&(m.onsubmit=_=>{_.preventDefault();const w=document.getElementById("lobby-chat-input"),T=w.value.trim();T&&(G.sendChatMessage(T),w.value="")});const p=document.getElementById("multi-btn-create-room");p&&(p.onclick=()=>W.show("create-room-screen"));const E=document.getElementById("multi-btn-join-code");E&&(E.onclick=()=>W.show("join-code-screen"));const b=document.getElementById("create-room-form");b&&(b.onsubmit=_=>{_.preventDefault();const w=document.getElementById("room-name-input").value,T=document.getElementById("room-password-input").value,C=document.getElementById("room-max-players").value,v=document.getElementById("room-duration").value,H=document.getElementById("room-goals").value,ve=document.getElementById("room-field-size"),we=ve?ve.value:"medium",Le=localStorage.getItem("kicker_hax_show_replay")!=="false",qe={uid:this.currentUser.uid,username:Ge.profileData.username,badge:Ge.profileData.badge||"🏳️"};G.createRoom(w,T,C,v,H,we,Le,qe);const wt=G.getSocket();wt&&wt.once("roomCreated",_s=>{he("Lobby criado!","success"),W.show("lobby-screen")})});const A=document.getElementById("join-code-form");A&&(A.onsubmit=_=>{_.preventDefault();const w=document.getElementById("join-code-input").value.toUpperCase(),T=document.getElementById("join-password-input").value,C={uid:this.currentUser.uid,username:Ge.profileData.username,badge:Ge.profileData.badge||"🏳️"};G.joinRoom(w,T,C);const v=G.getSocket();v&&(v.once("joinSuccess",()=>{he("Entrou no lobby com sucesso!","success"),W.show("lobby-screen")}),v.once("joinError",H=>{he(H,"error")}))});const P=document.getElementById("match-btn-exit");P&&(P.onclick=()=>{confirm("Deseja realmente sair da partida?")&&(this.localPhysicsTick&&cancelAnimationFrame(this.localPhysicsTick),yt.stopCrowd&&yt.stopCrowd(),this.mode==="multiplayer"?(G.leaveRoom(),W.show("multiplayer-screen")):W.show("solo-screen"))});const F=document.getElementById("btn-skip-replay");F&&(F.onclick=()=>{this.mode==="multiplayer"?G.skipReplay():this.endReplayPlayback()});const U=document.getElementById("btn-save-replay");U&&(U.onclick=()=>{this.downloadReplay()});const O=document.getElementById("game-chat-form");O&&(O.onsubmit=_=>{_.preventDefault();const w=document.getElementById("game-chat-input"),T=w.value.trim();T&&(this.mode==="multiplayer"?G.sendChatMessage(T):this.appendChatMessage({time:new Date().toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"}),username:Ge.profileData.displayName,badge:Ge.profileData.badge,text:T},!0),w.value=""),w.blur(),O.classList.remove("active"),this.canvas.focus()});const Y=document.getElementById("rank-filter-wins"),oe=document.getElementById("rank-filter-goals"),ee=document.getElementById("rank-filter-level");Y&&(Y.onclick=()=>this.loadRanking("wins")),oe&&(oe.onclick=()=>this.loadRanking("goals")),ee&&(ee.onclick=()=>this.loadRanking("level"));const I=document.getElementById("post-btn-continue");I&&(I.onclick=()=>{this.mode==="multiplayer"?W.show("lobby-screen"):W.show("solo-screen")});const y=document.getElementById("ranking-btn-back");y&&(y.onclick=()=>W.show("menu-screen"))},startMatchView(){this.canvas=document.getElementById("match-canvas"),this.ctx=this.canvas.getContext("2d",{alpha:!1}),this.recordedChunks=[],this.isRecording=!1;const n=Qi.dimensions;this.canvas.width=n.w,this.canvas.height=n.h,this.resizeCanvasContainer(),window.addEventListener("resize",()=>this.resizeCanvasContainer()),this.p1PossessionFrames=0,this.cpuPossessionFrames=0,this.totalPossessionFrames=0,this.p1Shots=0,this.p1Tackles=0,this.p1Dribbles=0,this.shotCooldown=0,this.goalsScored=0,this.assistsGained=0,this.savesDone=0,this.score={red:0,blue:0},this.inReplay=!1,document.getElementById("focus-lost-badge");const e=()=>{if(this.mode==="solo")!this.isPaused&&W.currentScreenId==="match-screen"&&this.togglePauseMenu();else if(this.mode==="multiplayer"&&this.isHost){const s=G.getSocket();s&&s.emit("hostFocusChanged",{focusLost:!0})}},t=()=>{if(this.mode==="multiplayer"&&this.isHost){const s=G.getSocket();s&&s.emit("hostFocusChanged",{focusLost:!1})}};document.addEventListener("visibilitychange",()=>{document.hidden?e():t()}),window.addEventListener("blur",e),window.addEventListener("focus",t),this.ball=new DS,this.players=[],this.setupPauseMenu(),window.addEventListener("keydown",s=>{if(W.currentScreenId==="match-screen")if(s.key==="Enter"){const i=document.getElementById("game-chat-form"),r=document.getElementById("game-chat-input");i&&r&&(i.classList.contains("active")||(i.classList.add("active"),r.focus()))}else(s.key==="Escape"||s.key==="p"||s.key==="P")&&this.togglePauseMenu()}),this.mode==="solo"?this.startLocalSoloMatch():this.startOnlineMatch()},resizeCanvasContainer(){if(W.currentScreenId!=="match-screen"||!this.canvas)return;const n=document.querySelector(".match-wrap"),e=document.getElementById("match-stage");if(!n||!e)return;const t=this.canvas.width/this.canvas.height,s=window.innerWidth-80;let r=window.innerHeight-110,o=r*t;if(o>s){const c=s/o;o*=c,r*=c}o=Math.floor(o),r=Math.floor(r);const l=document.getElementById("match-side-left");this.mode==="solo"?(l&&(l.style.display="none"),e.style.gridTemplateColumns=`${o}px 150px`,e.style.width=`${o+150+16}px`):(l&&(l.style.display="flex"),e.style.gridTemplateColumns=`150px ${o}px 150px`,e.style.width=`${o+300+16}px`),e.style.height=`${r}px`,this.canvas.style.width=`${o}px`,this.canvas.style.height=`${r}px`},startLocalSoloMatch(){this.p1Tackles=0,this.p1Dribbles=0,this.p2Tackles=0,this.p2Dribbles=0,this.p1TackleLock=!1,this.p1DribbleLock=!1,this.p2TackleLock=!1,this.p2DribbleLock=!1;const n=Ge.profileData.username,e=Ge.profileData.badge||"🇧🇷",t=document.getElementById("solo-field-size"),s=t?t.value:"medium";this.showReplay=!0,s==="small"?(this.canvas.width=896,this.canvas.height=560):s==="large"?(this.canvas.width=1280,this.canvas.height=768):(this.canvas.width=1024,this.canvas.height=640),this.resizeCanvasContainer(),this.currentUser.uid,this.difficulty,this.p1PossessionFrames=0,this.cpuPossessionFrames=0,this.totalPossessionFrames=0,this.p1Shots=0,this.p1Tackles=0,this.p1Dribbles=0,this.shotCooldown=0,this.goalsScored=0,this.assistsGained=0,this.savesDone=0,this.status="countdown",this.countdown=300,this.ball.x=this.canvas.width/2,this.ball.y=this.canvas.height/2;const i={score:{red:0,blue:0},matchTime:this.matchTime,status:"countdown",countdownTimer:300,goalFreezeTimer:0,replayBuffer:[],replayIndex:0};this.localMatchSim=i;const r={id:"cpu",name:"CPU Bot",badge:"⚙️",team:Be.RED,cpu:!0,difficulty:this.difficulty,x:D+120,y:this.canvas.height*.5,vx:0,vy:0,r:st,dir:0,lastMoveDir:0,stamina:1,staminaLock:0,stun:0,slowTimer:0,kickCharge:0,cool:0,tackle_cd:0,dribble_cd:0,dash_time:0,invuln:0,power_cd:0,tackleFreeze:0,tackleSuccess:!1,tackleEval:0,shootHalo:0,aiShootLock:0,aiFeintLock:0},o={id:"p1",name:n,badge:e,team:Be.BLUE,cpu:!1,x:this.canvas.width-D-120,y:this.canvas.height*.5,vx:0,vy:0,r:st,dir:0,lastMoveDir:0,stamina:1,staminaLock:0,stun:0,slowTimer:0,kickCharge:0,cool:0,tackle_cd:0,dribble_cd:0,dash_time:0,invuln:0,power_cd:0,tackleFreeze:0,tackleSuccess:!1,tackleEval:0,shootHalo:0},l=[r,o];this.players=l.map(h=>new Hf(h));const c={x:this.canvas.width/2,y:this.canvas.height/2,vx:0,vy:0,r:en,owner:null,lastTouch:null,strikeTimer:0,lastStrikeType:null,noPickupFrames:0,noPickupFrom:null};this.localBallSim=c,(()=>{const h=lt;let d=[],m=performance.now();const p=1e3/60;let E=0;const b=F=>{var U;if(W.currentScreenId==="match-screen"){try{typeof F!="number"&&(F=performance.now());let O=F-m;O>100&&(O=100),m=F,E+=O;const Y=this.canvas.width,oe=this.canvas.height,ee=(oe-ct)/2,I=(oe+ct)/2,y=D-Ce,_=Y-D+Ce,w=y-Rt,T=_+Rt,C=10;let v={x:0,y:0,shoot:!1,sprint:!1,dribble:!1,tackle:!1,power:!1};for(;E>=p;){if(d=[],!this.isPaused){if(i.status==="countdown")i.countdownTimer--,i.countdownTimer<=0&&(i.status="playing");else if(i.status==="freeze")i.goalFreezeTimer--,i.goalFreezeTimer<=0&&(this.inReplay=!0,this.replayFrames=[...i.replayBuffer],this.replayFrameIdx=0,this.replayTimer=0,(U=document.getElementById("replay-overlay"))==null||U.classList.remove("hidden"),i.status="replay",i.countdownTimer=Os*2*3+5,this.startLocalReplayRecording());else if(i.status==="replay")i.countdownTimer--,i.countdownTimer<=0&&(this.endReplayPlayback(),(i.score.red>=this.goalLimit||i.score.blue>=this.goalLimit)&&this.goalLimit>0?(i.status="ended",this.localMatchEnd(i.score)):(i.status="countdown",i.countdownTimer=300,A()));else if(i.status==="playing"){i.matchTime-=1/60,i.matchTime<=0&&(i.matchTime=0,i.status="ended",this.localMatchEnd(i.score)),v={x:0,y:0,shoot:!1,sprint:!1,dribble:!1,tackle:!1,power:!1};const ie=Qi.CTRL_P1;this.keys.get(ie.up)&&(v.y-=1),this.keys.get(ie.down)&&(v.y+=1),this.keys.get(ie.left)&&(v.x-=1),this.keys.get(ie.right)&&(v.x+=1),ie.sprint.startsWith("Shift")?v.sprint=this.codes.get(ie.sprint):v.sprint=this.keys.get(ie.sprint),v.shoot=this.keys.get(ie.shoot),v.dribble=this.keys.get(ie.dribble),v.tackle=this.keys.get(ie.tackle),v.power=this.keys.get(ie.power);let Ne={x:0,y:0,shoot:!1,sprint:!1,dribble:!1,tackle:!1,power:!1};if(r.stun<=0){const x={x:c.x,y:c.y};if(!c.owner){let Tt=c.vx,hn=c.vy;for(let De=0;De<10;De++)Tt*=Js,hn*=Js,x.x+=Tt,x.y+=hn}const Ie=Math.hypot(x.x-r.x,x.y-r.y);let fe=x.x,ze=x.y;const Bn=c.x<Y/2;if(c.owner==="cpu"){fe=_;const Tt=Math.hypot(o.x-r.x,o.y-r.y);this.difficulty!=="easy"&&Tt<120?(ze=o.y>r.y?r.y-80:r.y+80,this.difficulty==="hard"&&r.dribble_cd<=0&&(Ne.dribble=!0)):ze=h.clamp(r.y,ee+20,I-20)}else if(c.owner==="p1")if(Math.hypot(o.x-r.x,o.y-r.y)>200){const hn=D;fe=hn+(o.x-hn)*.7,ze=oe*.5+(o.y-oe*.5)*.7}else fe=o.x,ze=o.y;else Bn&&Ie>260&&this.difficulty!=="easy"?(fe=D+50,ze=h.clamp(x.y,ee+10,I-10)):(fe=x.x,ze=x.y);let Un=fe-r.x,Br=ze-r.y,Ur=Math.hypot(Un,Br)||1,hi=Un/Ur,ys=Br/Ur,jn=1,qt=0;this.difficulty==="easy"?(jn=.72,qt=.25):this.difficulty==="medium"&&(jn=.88,qt=.12),qt>0&&Math.random()<.05&&(hi+=h.rnd(-qt,qt),ys+=h.rnd(-qt,qt)),Ne.x=hi*jn,Ne.y=ys*jn;const ui=c.owner==="cpu"&&Math.abs(_-r.x)>200||!c.owner&&Ie>120;if(Ne.sprint=ui&&r.staminaLock<=0&&r.stamina>.3,c.owner==="cpu"){const Tt=Math.abs(_-r.x);(Tt<100||Tt<160&&r.y>ee&&r.y<I)&&(Ne.shoot=!0)}else c.owner==="p1"&&Ie<la&&r.tackle_cd<=0&&this.difficulty!=="easy"&&(Ne.tackle=!0)}const Fn=(x,Ie)=>{if(!(x.stun>0)){if(Ie.tackle&&x.tackle_cd<=0&&x.stamina>=Yi){x.stamina=Math.max(0,x.stamina-Yi),x.tackle_cd=M_,x.tackleSuccess=!1,x.tackleEval=12,x.slowTimer=O_,x.tackleFreeze=8,d.push("tackle");const fe=x.id==="p1"?r:o,ze=c.owner===fe.id?Math.atan2(fe.y-x.y,fe.x-x.x):x.dir;x.vx+=Math.cos(ze)*ca,x.vy+=Math.sin(ze)*ca,c.owner===fe.id&&fe.invuln<=0&&Math.hypot(fe.x-x.x,fe.y-x.y)<=la&&(c.owner=x.id,c.lastTouch=x.id,c.noPickupFrames=10,c.noPickupFrom=null,c.vx=0,c.vy=0,fe.stun=Math.max(fe.stun,L_),fe.vx=0,fe.vy=0,x.tackleSuccess=!0)}if(Ie.dribble&&x.dribble_cd<=0&&c.owner===x.id&&x.stamina>=Xi&&(x.stamina=Math.max(0,x.stamina-Xi),x.dash_time=V_,x.invuln=B_,x.dribble_cd=F_,x.vx+=Math.cos(x.dir)*ha,x.vy+=Math.sin(x.dir)*ha,d.push("dribble")),Ie.power&&x.power_cd<=0&&x.stamina>=.5&&(c.owner===x.id||Math.hypot(x.x-c.x,x.y-c.y)<x.r+c.r+8)){x.stamina=Math.max(0,x.stamina-.5),x.stamina===0&&(x.staminaLock=Gh),x.power_cd=j_,x.cool=12,x.shootHalo=22;const fe=Ie.x||Ie.y?Math.atan2(Ie.y,Ie.x):x.dir;h.powerKick(x,c,fe,U_),d.push("power")}if(x.kickCharge>0&&!Ie.shoot){if(c.owner===x.id||Math.hypot(x.x-c.x,x.y-c.y)<x.r+c.r+14){const ze=h.clamp(x.kickCharge,0,1);x.cool=14,x.shootHalo=18;const Bn=Ie.x||Ie.y?Math.atan2(Ie.y,Ie.x):x.dir,Un=Math.max(aa,aa+x_*ze);h.kickBall(x,c,Bn,Un),d.push("kick")}x.kickCharge=0}}};Fn(o,v),Fn(r,Ne),h.updatePlayerPhysics(o,v,c,x=>d.push(x)),h.updatePlayerPhysics(r,Ne,c,x=>d.push(x)),h.applyLimits(o,ee,I,w,T,y,_,C,Y,oe),h.applyLimits(r,ee,I,w,T,y,_,C,Y,oe),h.resolvePlayerPlayer(l),h.resolvePlayerBall(l,c,()=>{for(const x of l)x.tackleEval>0&&c.owner===x.id&&(x.tackleSuccess=!0)}),h.updateBallPhysics(c,ee,I,w,T,y,_,C,l,x=>d.push(x),x=>{x==="blue"?i.score.blue++:i.score.red++;const Ie=c.lastTouch==="p1"?n:"CPU Bot",fe=x==="blue"&&c.lastTouch==="cpu"||x==="red"&&c.lastTouch==="p1";this.lastGoal={side:x,scorerName:Ie,ownGoal:fe},d.push("whistle"),d.push("goal"),d.push("cheer"),(i.score.red>=this.goalLimit||i.score.blue>=this.goalLimit)&&this.goalLimit>0?(i.status="ended",this.localMatchEnd(i.score)):this.showReplay?(i.status="freeze",i.goalFreezeTimer=Os):(i.status="countdown",i.countdownTimer=300,A())},Y,oe)}P()}E-=p}this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height),this.drawFieldGrid(this.ctx),this.inReplay?this.playbackReplay():(d.forEach(ie=>yt.play(ie)),this.ball.x=c.x,this.ball.y=c.y,this.ball.owner=c.owner,this.ball.draw(this.ctx),this.players.forEach(ie=>{const Ne=ie.id==="p1"?o:r;ie.x=Ne.x,ie.y=Ne.y,ie.dir=Ne.dir,ie.stamina=Ne.stamina,ie.staminaLock=Ne.staminaLock,ie.stun=Ne.stun,ie.shootHalo=Ne.shootHalo,ie.invuln=Ne.invuln,ie.draw(this.ctx,c.owner)})),this.drawNetOverlay(this.ctx);const H=Math.floor(i.matchTime/60),ve=Math.floor(i.matchTime%60),we=document.getElementById("match-clock"),Le=document.getElementById("match-score");we&&(we.textContent=`${String(H).padStart(2,"0")}:${String(ve).padStart(2,"0")}`),Le&&(Le.textContent=`${i.score.red} : ${i.score.blue}`);const qe=document.getElementById("right-stam-fill"),wt=document.getElementById("right-pow-fill"),_s=document.getElementById("left-stam-fill"),Or=document.getElementById("left-pow-fill");qe&&(qe.style.height=`${o.stamina*100}%`),wt&&(wt.style.height=`${o.kickCharge*100}%`),_s&&(_s.style.height=`${r.stamina*100}%`),Or&&(Or.style.height=`${r.kickCharge*100}%`),c.owner==="p1"?this.p1PossessionFrames=(this.p1PossessionFrames||0)+1:c.owner==="cpu"?this.cpuPossessionFrames=(this.cpuPossessionFrames||0)+1:c.lastTouch==="p1"?this.p1PossessionFrames=(this.p1PossessionFrames||0)+1:c.lastTouch==="cpu"&&(this.cpuPossessionFrames=(this.cpuPossessionFrames||0)+1),this.totalPossessionFrames=(this.totalPossessionFrames||0)+1;const Dt=Math.round((this.p1PossessionFrames||0)/(this.totalPossessionFrames||1)*100);if(this.shotCooldown>0&&this.shotCooldown--,Math.hypot(o.x-c.x,o.y-c.y)<st+en+12&&(v.shoot||v.power)&&!this.shotCooldown){const ie=Math.atan2(c.y-o.y,c.x-o.x);Math.cos(ie)>.2&&(this.p1Shots=(this.p1Shots||0)+1,this.shotCooldown=30)}o.tackle_cd>0&&!this.p1TackleLock?(this.p1Tackles=(this.p1Tackles||0)+1,this.p1TackleLock=!0):o.tackle_cd===0&&(this.p1TackleLock=!1),o.dribble_cd>0&&!this.p1DribbleLock?(this.p1Dribbles=(this.p1Dribbles||0)+1,this.p1DribbleLock=!0):o.dribble_cd===0&&(this.p1DribbleLock=!1);const Vr=document.getElementById("right-stat-possession"),cn=document.getElementById("right-stat-shots"),Fr=document.getElementById("right-stat-tackles"),Vn=document.getElementById("right-stat-dribbles");if(Vr&&(Vr.textContent=`${Dt}%`),cn&&(cn.textContent=this.p1Shots||0),Fr&&(Fr.textContent=this.p1Tackles||0),Vn&&(Vn.textContent=this.p1Dribbles||0),i.status==="countdown"){const ie=Math.max(0,Math.ceil(i.countdownTimer/60));this.drawCenterBanner(`Começa em ${ie}...`,"Prepare-se!")}else if(i.status==="freeze"){const ie=this.lastGoal&&this.lastGoal.ownGoal?`GOL CONTRA de ${this.lastGoal.scorerName}`:`GOL DE ${this.lastGoal&&this.lastGoal.scorerName||"???"}!`;this.drawCenterBanner(ie,"Revisando jogada...")}}catch(O){console.error("[Kicker Solo] Tick error:",O)}i.status!=="ended"&&(this.localPhysicsTick=requestAnimationFrame(b))}},A=()=>{const F=(Math.random()-.5)*20,U=(Math.random()-.5)*20;o.x=this.canvas.width-D-120+F,o.y=this.canvas.height*.5+U,o.vx=o.vy=0,o.kickCharge=0,o.stamina=1,o.staminaLock=0,o.stun=0;const O=(Math.random()-.5)*20,Y=(Math.random()-.5)*20;r.x=D+120+O,r.y=this.canvas.height*.5+Y,r.vx=r.vy=0,r.kickCharge=0,r.stamina=1,r.staminaLock=0,r.stun=0,c.x=this.canvas.width/2,c.y=this.canvas.height/2,c.vx=c.vy=0,c.owner=null,c.lastTouch=null},P=()=>{const F=l.map(O=>({x:O.x,y:O.y,dir:O.dir,team:O.team,has:c.owner===O.id,name:O.id==="p1"?n:"CPU Bot",badge:O.id==="p1"?e:"⚙️",inv:O.invuln||0,stun:O.stun||0,halo:O.shootHalo||0})),U={ball:{x:c.x,y:c.y},players:F,score:{...i.score},sfx:[...d]};i.replayBuffer.push(U),i.replayBuffer.length>Os*2&&i.replayBuffer.shift()};A(),this.localPhysicsTick=requestAnimationFrame(b)})()},localMatchEnd(n){cancelAnimationFrame(this.localPhysicsTick),this.stopLocalReplayRecording(),yt.stopCrowd(),he("Fim de jogo!","info"),document.getElementById("post-score-red").textContent=n.red,document.getElementById("post-score-blue").textContent=n.blue,document.getElementById("post-mvp").textContent=n.blue>=n.red?Ge.profileData.username:"CPU Bot",document.getElementById("post-xp-gained").textContent="+0 XP (Modo Treino)",document.getElementById("post-total-goals").textContent=n.red+n.blue,W.show("post-game-screen")},startOnlineMatch(){this.p1Tackles=0,this.p1Dribbles=0,this.p2Tackles=0,this.p2Dribbles=0,this.p1TackleLock=!1,this.p1DribbleLock=!1,this.p2TackleLock=!1,this.p2DribbleLock=!1;const n=G.getSocket();n&&(n.off("fieldSizeUpdated"),n.off("matchReset")),this.status="countdown",this.countdown=300,this.fieldSize==="small"?(this.canvas.width=896,this.canvas.height=560):this.fieldSize==="large"?(this.canvas.width=1280,this.canvas.height=768):(this.canvas.width=1024,this.canvas.height=640),this.resizeCanvasContainer(),G.onGameState(t=>{this.status=t.status,this.countdown=t.countdown,this.score=t.score,this.matchTime=t.matchTime,t.soundEffects.forEach(r=>yt.play(r));const s=document.getElementById("focus-lost-badge");s&&(t.isHostPaused?(s.textContent="⏸️ Pausado (Dono da sala fora da aba)",s.classList.remove("hidden")):s.classList.add("hidden")),this.ball.updateState(t.ball),t.players.forEach(r=>{let o=this.players.find(l=>l.id===r.id);o||(o=new Hf(r),this.players.push(o)),o.updateState(r)});const i=t.players.map(r=>r.id);this.players=this.players.filter(r=>i.includes(r.id))}),G.getSocket().on("fieldSizeUpdated",({size:t})=>{this.fieldSize=t,t==="small"?(this.canvas.width=896,this.canvas.height=560):t==="large"?(this.canvas.width=1280,this.canvas.height=768):(this.canvas.width=1024,this.canvas.height=640),this.resizeCanvasContainer(),he("O Host alterou o tamanho do campo!","info")}),G.getSocket().on("matchReset",()=>{he("A partida foi reiniciada pelo Host!","info"),this.p1Tackles=0,this.p1Dribbles=0,this.p2Tackles=0,this.p2Dribbles=0}),G.onPlayReplay(({replayFrames:t,goalInfo:s})=>{var i;this.inReplay=!0,this.replayFrames=t,this.replayFrameIdx=0,this.replayTimer=0,this.lastGoal=s,(i=document.getElementById("replay-overlay"))==null||i.classList.remove("hidden"),this.startLocalReplayRecording()}),G.onMatchEnded(t=>{he("Partida finalizada!","info"),this.stopLocalReplayRecording();const s=!this.players.find(c=>c.id===G.getSocket().id&&c.team!=="spectator");let i=!1,r=!1,o=t.red===t.blue;if(!s){const c=this.players.find(d=>d.id===G.getSocket().id),h=t.blue>t.red?Be.BLUE:Be.RED;i=c.team===h&&!o,r=c.team!==h&&!o}const l=s?0:i?80:o?30:15;s||mt.saveMatchResult(this.currentUser.uid,i,r,o,this.goalsScored,this.assistsGained,this.savesDone,l).then(()=>{const c={mode:"multiplayer",date:new Date().toISOString(),playerUids:[this.currentUser.uid],playerTeams:{[this.currentUser.uid]:localP.team},winner:t.blue>t.red?Be.BLUE:o?"draw":Be.RED,scoreRed:t.red,scoreBlue:t.blue};return mt.addMatchToHistory(c)}),document.getElementById("post-score-red").textContent=t.red,document.getElementById("post-score-blue").textContent=t.blue,document.getElementById("post-mvp").textContent=t.blue>=t.red?"Azul":"Vermelho",document.getElementById("post-xp-gained").textContent=s?"Espectador":`+${l} XP`,document.getElementById("post-total-goals").textContent=t.red+t.blue,W.show("post-game-screen")});const e=()=>{if(W.currentScreenId!=="match-screen")return;let t={x:0,y:0,shoot:!1,sprint:!1,dribble:!1,tackle:!1,power:!1};const s=Qi.CTRL_P1;this.keys.get(s.up)&&(t.y-=1),this.keys.get(s.down)&&(t.y+=1),this.keys.get(s.left)&&(t.x-=1),this.keys.get(s.right)&&(t.x+=1),s.sprint.startsWith("Shift")?t.sprint=this.codes.get(s.sprint):t.sprint=this.keys.get(s.sprint),t.shoot=this.keys.get(s.shoot),t.dribble=this.keys.get(s.dribble),t.tackle=this.keys.get(s.tackle),t.power=this.keys.get(s.power),G.sendGameInput(t),this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height),this.drawFieldGrid(this.ctx),this.inReplay?this.playbackReplay():(this.ball.interpolate(.35),this.ball.draw(this.ctx),this.players.forEach(m=>{m.interpolate(.35),m.draw(this.ctx,this.ball.owner)})),this.drawNetOverlay(this.ctx);const i=Math.floor(this.matchTime/60),r=Math.floor(this.matchTime%60),o=document.getElementById("match-clock"),l=document.getElementById("match-score");o&&(o.textContent=`${String(i).padStart(2,"0")}:${String(r).padStart(2,"0")}`),l&&(l.textContent=`${this.score.red} : ${this.score.blue}`);const c=G.getSocket().id,h=this.players.find(m=>m.id===c),d=this.players.find(m=>m.id!==c&&m.team!=="spectator");if(h){const m=document.getElementById("right-stam-fill"),p=document.getElementById("right-pow-fill");m&&(m.style.height=`${h.stamina*100}%`);let E=0;t.shoot&&(E=1),p&&(p.style.height=`${E*100}%`),d&&(this.ball.owner===h.id?this.p1PossessionFrames=(this.p1PossessionFrames||0)+1:this.ball.owner===d.id?this.cpuPossessionFrames=(this.cpuPossessionFrames||0)+1:this.ball.lastTouch===h.id?this.p1PossessionFrames=(this.p1PossessionFrames||0)+1:this.ball.lastTouch===d.id&&(this.cpuPossessionFrames=(this.cpuPossessionFrames||0)+1),this.totalPossessionFrames=(this.totalPossessionFrames||0)+1);const b=Math.round((this.p1PossessionFrames||0)/(this.totalPossessionFrames||1)*100);if(this.shotCooldown>0&&this.shotCooldown--,Math.hypot(h.x-this.ball.x,h.y-this.ball.y)<st+en+12&&t.shoot&&!this.shotCooldown){const Y=Math.atan2(this.ball.y-h.y,this.ball.x-h.x),oe=h.team===Be.BLUE;(oe&&Math.cos(Y)>.2||!oe&&Math.cos(Y)<-.2)&&(this.p1Shots=(this.p1Shots||0)+1,this.shotCooldown=30)}h.tackle_cd>0&&!this.p1TackleLock?(this.p1Tackles=(this.p1Tackles||0)+1,this.p1TackleLock=!0):h.tackle_cd===0&&(this.p1TackleLock=!1),h.dribble_cd>0&&!this.p1DribbleLock?(this.p1Dribbles=(this.p1Dribbles||0)+1,this.p1DribbleLock=!0):h.dribble_cd===0&&(this.p1DribbleLock=!1);const P=document.getElementById("right-stat-possession"),F=document.getElementById("right-stat-shots"),U=document.getElementById("right-stat-tackles"),O=document.getElementById("right-stat-dribbles");P&&(P.textContent=`${b}%`),F&&(F.textContent=this.p1Shots||0),U&&(U.textContent=this.p1Tackles||0),O&&(O.textContent=this.p1Dribbles||0)}if(d){const m=document.getElementById("left-stam-fill"),p=document.getElementById("left-pow-fill");m&&(m.style.height=`${d.stamina*100}%`),p&&(p.style.height=`${(d.kickCharge||0)*100}%`)}if(this.status==="countdown")this.drawCenterBanner(`Começa em ${this.countdown}...`,"Prepare-se!");else if(this.status==="freeze"){const m=this.lastGoal.ownGoal?`GOL CONTRA de ${this.lastGoal.scorerName}`:`GOL DE ${this.lastGoal.scorerName}!`;this.drawCenterBanner(m,"Revisando jogada...",!0)}this.localPhysicsTick=requestAnimationFrame(e)};this.localPhysicsTick=requestAnimationFrame(e)},stopMatchView(){var n;cancelAnimationFrame(this.localPhysicsTick),this.stopLocalReplayRecording(),yt.stopCrowd(),G.clearListeners(),(n=document.getElementById("replay-overlay"))==null||n.classList.add("hidden"),window.removeEventListener("resize",()=>this.resizeCanvasContainer())},startLocalReplayRecording(){if(!(!this.canvas||this.isRecording))try{const n=this.canvas.captureStream(30),e=yt.getRecordingStreamDestination();e&&e.stream.getAudioTracks().forEach(s=>n.addTrack(s)),this.recordedChunks=[],this.mediaRecorder=new MediaRecorder(n,{mimeType:"video/webm;codecs=vp9,opus"}),this.mediaRecorder.ondataavailable=t=>{t.data&&t.data.size>0&&this.recordedChunks.push(t.data)},this.mediaRecorder.onstop=()=>{this.replayBlob=new Blob(this.recordedChunks,{type:"video/webm"}),this.isRecording=!1;const t=document.getElementById("btn-save-replay");t&&(t.style.display="inline-block")},this.mediaRecorder.start(),this.isRecording=!0}catch(n){console.warn("Replay recording not supported on this browser.",n)}},stopLocalReplayRecording(){if(this.mediaRecorder&&this.isRecording)try{this.mediaRecorder.stop()}catch{}},downloadReplay(){if(!this.replayBlob)return;const n=URL.createObjectURL(this.replayBlob),e=document.createElement("a");e.href=n,e.download=`KickerHax-Replay-${Date.now()}.webm`,document.body.appendChild(e),e.click(),document.body.removeChild(e),URL.revokeObjectURL(n),he("Replay baixado com sucesso!","success")},playbackReplay(){if(this.replayFrames.length===0)return;if(this.replayTimer++,this.replayTimer%3===0&&(this.replayFrameIdx++,this.replayFrameIdx>=this.replayFrames.length)){this.endReplayPlayback(),this.mode==="solo"&&this.localMatchSim&&(this.localMatchSim.countdownTimer=0);return}const n=this.replayFrames[Math.min(this.replayFrameIdx,this.replayFrames.length-1)];if(!n)return;this.replayTimer%3===0&&n.sfx.forEach(t=>yt.play(t)),xS(this.ctx,n.ball.x,n.ball.y),n.players.forEach(t=>{MS(this.ctx,t.x,t.y,t.team,t.name,t.badge,t.halo,t.inv,t.stun,t.has)});const e=document.getElementById("replay-caption");if(e&&this.lastGoal){const t=this.lastGoal.ownGoal?`GOL CONTRA de ${this.lastGoal.scorerName}`:`GOL DE ${this.lastGoal.scorerName}!`;e.textContent=t,e.style.display="block"}},endReplayPlayback(){var e;this.inReplay=!1,this.stopLocalReplayRecording(),(e=document.getElementById("replay-overlay"))==null||e.classList.add("hidden");const n=document.getElementById("replay-caption");n&&(n.style.display="none"),yt.ensureAudio()},drawSpeedPad(n,e,t,s){n.save(),n.shadowColor="#00f0ff",n.shadowBlur=s?16:8,n.fillStyle=s?"rgba(0, 240, 255, 0.45)":"rgba(0, 240, 255, 0.18)",n.strokeStyle="#00f0ff",n.lineWidth=2.5,n.beginPath(),n.arc(e,t,32,0,Math.PI*2),n.fill(),n.stroke(),n.fillStyle="#00f0ff",n.beginPath(),e<this.canvas.width/2?(n.moveTo(e-6,t+6),n.lineTo(e+10,t-10),n.lineTo(e+2,t-10),n.lineTo(e+10,t-10),n.lineTo(e+10,t-2)):(n.moveTo(e+6,t-6),n.lineTo(e-10,t+10),n.lineTo(e-2,t+10),n.lineTo(e-10,t+10),n.lineTo(e-10,t+2)),n.strokeStyle="#00f0ff",n.lineWidth=3,n.stroke(),n.restore()},drawFieldGrid(n){const e=this.canvas.width,t=this.canvas.height,s=(t-ct)/2;n.fillStyle="#1e293b",n.fillRect(0,0,e,t),n.strokeStyle="#334155",n.lineWidth=2;for(let d=4;d<D-8;d+=6)n.strokeRect(d,d,e-d*2,t-d*2);n.save();let i=12345;const r=()=>{let d=Math.sin(i++)*1e4;return d-Math.floor(d)};for(let d=8;d<e-8;d+=12)for(let m=8;m<t-8;m+=12){const p=d<D-8||d>e-D+8,E=m<D-8||m>t-D+8;if((p||E)&&r()<.35){const b=["#ef4444","#3b82f6","#10b981","#f59e0b","#ec4899","#94a3b8"];n.fillStyle=b[Math.floor(r()*b.length)],n.beginPath(),n.arc(d,m,2.5,0,Math.PI*2),n.fill()}}n.restore(),n.fillStyle="#2e7d32",n.fillRect(D-8,D-8,e-2*D+16,t-2*D+16);const o=14,l=(e-2*D+16)/o;n.fillStyle="#388e3c";for(let d=0;d<o;d+=2)n.fillRect(D-8+d*l,D-8,l,t-2*D+16);n.save(),n.strokeStyle="#ffffff",n.lineWidth=3,n.strokeRect(D,D,e-2*D,t-2*D),n.beginPath(),n.moveTo(e/2,D),n.lineTo(e/2,t-D),n.stroke(),n.beginPath(),n.arc(e/2,t/2,72,0,Math.PI*2),n.stroke(),n.beginPath(),n.arc(e/2,t/2,4,0,Math.PI*2),n.fillStyle="#ffffff",n.fill(),n.strokeRect(D,(t-260)/2,140,260),n.strokeRect(D,(t-110)/2,50,110),n.beginPath(),n.arc(D+100,t/2,3,0,Math.PI*2),n.fill(),n.strokeRect(e-D-140,(t-260)/2,140,260),n.strokeRect(e-D-50,(t-110)/2,50,110),n.beginPath(),n.arc(e-D-100,t/2,3,0,Math.PI*2),n.fill();const c=12;n.lineWidth=2,n.beginPath(),n.arc(D,D,c,0,Math.PI*.5),n.stroke(),n.beginPath(),n.arc(D,t-D,c,-Math.PI*.5,0),n.stroke(),n.beginPath(),n.arc(e-D,D,c,Math.PI*.5,Math.PI),n.stroke(),n.beginPath(),n.arc(e-D,t-D,c,Math.PI,-Math.PI*.5),n.stroke(),n.restore();const h=(d,m,p)=>{n.save(),n.translate(d,m),n.rotate(p),n.strokeStyle="#fbbf24",n.lineWidth=2,n.beginPath(),n.moveTo(0,0),n.lineTo(-6,-6),n.stroke(),n.fillStyle="#ef4444",n.beginPath(),n.moveTo(-6,-6),n.lineTo(-12,-4),n.lineTo(-8,-10),n.closePath(),n.fill(),n.restore()};h(D,D,0),h(D,t-D,-Math.PI*.5),h(e-D,D,Math.PI*.5),h(e-D,t-D,Math.PI),n.fillStyle="#0f172a",n.fillRect(D-Ce,s,Ce,ct),n.fillRect(e-D,s,Ce,ct),n.fillStyle="rgba(255, 255, 255, 0.04)",n.fillRect(D-Ce-Rt,s,Rt,ct),n.fillRect(e-D+Ce,s,Rt,ct)},drawNetOverlay(n){const e=this.canvas.width,t=this.canvas.height,s=(t-ct)/2,i=(t+ct)/2;n.fillStyle="#0f172a",n.fillRect(D-Ce,s,Ce,ct),n.fillRect(e-D,s,Ce,ct),n.save(),n.strokeStyle="rgba(255,255,255,.18)",n.lineWidth=1,n.beginPath();for(let r=D-Ce-Rt;r<=D-Ce;r+=10)n.moveTo(r,s),n.lineTo(r,i);for(let r=s;r<=i;r+=10)n.moveTo(D-Ce-Rt,r),n.lineTo(D-Ce,r);for(let r=e-D+Ce;r<=e-D+Ce+Rt;r+=10)n.moveTo(r,s),n.lineTo(r,i);for(let r=s;r<=i;r+=10)n.moveTo(e-D+Ce,r),n.lineTo(e-D+Ce+Rt,r);n.stroke(),n.restore()},drawCenterBanner(n,e,t=!1){const s=this.canvas.width,i=this.canvas.height;this.ctx.save(),this.ctx.globalAlpha=.95;const r=640,o=140,l=s/2-r/2,c=i*.25;if(t){const h=this.ctx.createLinearGradient(l,c,l+r,c);h.addColorStop(0,"rgba(245, 158, 11, 0.95)"),h.addColorStop(.5,"rgba(239, 68, 68, 0.95)"),h.addColorStop(1,"rgba(245, 158, 11, 0.95)"),this.ctx.fillStyle=h,this.ctx.fillRect(l,c,r,o),this.ctx.strokeStyle="#ffffff",this.ctx.lineWidth=3,this.ctx.strokeRect(l+.5,c+.5,r-1,o-1);const d=1+Math.sin(Date.now()/150)*.05;this.ctx.translate(s/2,c+45),this.ctx.scale(d,d),this.ctx.fillStyle="#ffffff",this.ctx.font="900 32px Outfit",this.ctx.textAlign="center",this.ctx.textBaseline="middle",this.ctx.shadowColor="rgba(0,0,0,0.5)",this.ctx.shadowBlur=10,this.ctx.fillText(n,0,0),this.ctx.restore(),this.ctx.save(),this.ctx.globalAlpha=.95,this.ctx.fillStyle="#ffffff",this.ctx.font="700 16px Inter",this.ctx.textAlign="center",this.ctx.textBaseline="middle",this.ctx.fillText(e,s/2,c+95),this.ctx.restore()}else this.ctx.fillStyle="rgba(7, 11, 25, 0.9)",this.ctx.fillRect(l,c,r,o),this.ctx.strokeStyle="rgba(255, 255, 255, 0.12)",this.ctx.strokeRect(l+.5,c+.5,r-1,o-1),this.ctx.fillStyle="#e2e8f0",this.ctx.font="800 24px Outfit",this.ctx.textAlign="center",this.ctx.textBaseline="middle",this.ctx.fillText(n,s/2,c+50),this.ctx.font="600 15px Inter",this.ctx.fillStyle="#60a5fa",this.ctx.fillText(e,s/2,c+90),this.ctx.restore()},renderRoomsList(n){const e=document.getElementById("rooms-list-body");if(e){if(n.length===0){e.innerHTML='<tr><td colspan="6" class="text-center">Nenhuma sala criada no momento. Seja o primeiro!</td></tr>';return}e.innerHTML="",n.forEach(t=>{const s=document.createElement("tr"),i=t.hasPassword?"🔒 Senha":"🔓 Pública";s.innerHTML=`
        <td><strong>${t.name}</strong></td>
        <td>${t.playersCount}/${t.maxPlayers}</td>
        <td>${t.duration} min</td>
        <td>${t.goalLimit} gols</td>
        <td>${i}</td>
        <td><button class="btn btn-secondary btn-sm" id="join-btn-${t.code}">Entrar</button></td>
      `,e.appendChild(s);const r=document.getElementById(`join-btn-${t.code}`);r&&(r.onclick=()=>{if(t.hasPassword){const o=prompt("Digite a senha da sala:");o!==null&&this.joinRoomWithCode(t.code,o)}else this.joinRoomWithCode(t.code,"")})})}},joinRoomWithCode(n,e){const t={uid:this.currentUser.uid,username:Ge.profileData.username,badge:Ge.profileData.badge||"🏳️"};G.joinRoom(n,e,t),G.getSocket().once("joinSuccess",()=>{he("Entrou na sala!","success"),W.show("lobby-screen")}),G.getSocket().once("joinError",s=>{he(s,"error")})},updateLobbyView(n){if(!n)return;this.fieldSize=n.fieldSize||"medium",this.showReplay=n.showReplay!==void 0?n.showReplay:!0,document.getElementById("lobby-room-name").textContent=n.name,document.getElementById("lobby-room-code").textContent=n.code,document.getElementById("lobby-setting-time").textContent=`${n.duration}m`,document.getElementById("lobby-setting-goals").textContent=n.goalLimit===0?"Sem Limite":n.goalLimit;const e={small:"Pequeno",medium:"Médio",large:"Grande"},t=document.getElementById("lobby-setting-size");t&&(t.textContent=e[this.fieldSize]||"Médio");const s=document.getElementById("lobby-setting-replay");s&&(s.textContent=this.showReplay?"Sim":"Não");const i=G.getSocket().id,r=n.hostId===i;this.isHost=r;const o=document.getElementById("lobby-btn-start"),l=document.getElementById("lobby-host-bot-controls");o&&o.classList.toggle("hidden",!r),l&&l.classList.toggle("hidden",!r);const c=document.getElementById("lobby-red-players"),h=document.getElementById("lobby-blue-players"),d=document.getElementById("lobby-spec-players");c&&(c.innerHTML=""),h&&(h.innerHTML=""),d&&(d.innerHTML=""),n.players.forEach(p=>{const E=document.createElement("div");E.className="lobby-player-row";const A=p.team==="spectator"?"":`<span class="ready-badge ${p.ready?"ready":""}">${p.ready?"Pronto":"Aguardando"}</span>`,P=r&&p.id!==i&&!p.cpu?`<button class="kick-btn" id="kick-btn-${p.id}">❌</button>`:"",F=r&&p.cpu?`<button class="kick-btn" id="remove-bot-btn-${p.id}">❌</button>`:"";E.innerHTML=`
        <span class="lobby-player-name"><span>${p.badge}</span> <span>${p.username}</span></span>
        <span class="lobby-player-meta">
          ${A}
          ${P}
          ${F}
        </span>
      `,p.team==="red"?c==null||c.appendChild(E):p.team==="blue"?h==null||h.appendChild(E):d==null||d.appendChild(E);const U=document.getElementById(`kick-btn-${p.id}`);U&&(U.onclick=()=>{G.kickPlayer(p.id)});const O=document.getElementById(`remove-bot-btn-${p.id}`);O&&(O.onclick=()=>{G.removeBot(p.id)})});const m=document.getElementById("lobby-chat-messages");m&&(m.innerHTML="",n.chatHistory.forEach(p=>this.appendChatMessage(p)))},appendChatMessage(n,e=!1){[document.getElementById("lobby-chat-messages"),document.getElementById("game-chat-messages")].forEach(s=>{if(!s)return;s.id==="lobby-chat-messages"||(s.classList.remove("inactive"),clearTimeout(s._fadeTimer),s._fadeTimer=setTimeout(()=>s.classList.add("inactive"),4e3));const r=document.createElement("div"),o=n.username==="Sistema";r.className=`chat-msg ${o?"system":""}`;const l=n.badge?`<span>${n.badge}</span> `:"";r.innerHTML=`
        <span class="msg-time">[${n.time}]</span>
        <span class="msg-sender">${l}${n.username}:</span>
        <span class="msg-text">${n.text}</span>
      `,s.appendChild(r),s.scrollTop=s.scrollHeight})},async loadRanking(n="wins"){const e=document.getElementById("leaderboard-body");if(!e)return;e.innerHTML='<tr><td colspan="7" class="text-center">Carregando dados da tabela...</td></tr>';const t=document.getElementById("rank-filter-wins"),s=document.getElementById("rank-filter-goals"),i=document.getElementById("rank-filter-level");[t,s,i].forEach(r=>r==null?void 0:r.classList.remove("active")),n==="wins"&&(t==null||t.classList.add("active")),n==="goals"&&(s==null||s.classList.add("active")),n==="level"&&(i==null||i.classList.add("active"));try{const r=await mt.getGlobalRanking(n,10);if(r.length===0){e.innerHTML='<tr><td colspan="7" class="text-center">Nenhum jogador registrado no ranking.</td></tr>';return}e.innerHTML="",r.forEach((o,l)=>{const c=o.wins+o.losses>0?Math.round(o.wins/(o.wins+o.losses)*100):0,h=document.createElement("tr");h.innerHTML=`
          <td><strong>#${l+1}</strong></td>
          <td><span>${o.badge}</span> <strong>${o.displayName||o.username}</strong></td>
          <td>${o.level||1}</td>
          <td class="text-success">${o.wins}</td>
          <td class="text-danger">${o.losses}</td>
          <td>${o.goals}</td>
          <td>${c}%</td>
        `,e.appendChild(h)})}catch{e.innerHTML='<tr><td colspan="7" class="text-center text-danger">Erro ao carregar dados do banco.</td></tr>'}},togglePauseMenu(){const n=document.getElementById("pause-modal");if(n)if(n.classList.contains("hidden")){n.classList.remove("hidden"),this.mode==="solo"&&(this.isPaused=!0);const e=document.getElementById("host-controls");if(e){const t=this.mode==="solo"||this.mode==="online"&&this.isHost;e.style.display=t?"block":"none"}}else n.classList.add("hidden"),this.mode==="solo"&&(this.isPaused=!1)},setupPauseMenu(){const n=document.getElementById("pause-btn-resume");n&&(n.onclick=()=>{this.togglePauseMenu()});const e=document.getElementById("pause-btn-exit-match");e&&(e.onclick=()=>{this.togglePauseMenu();const r=document.getElementById("match-btn-exit");r&&r.click()});const t=document.getElementById("pause-btn-apply-settings"),s=document.getElementById("pause-field-size");t&&s&&(t.onclick=()=>{const r=s.value;this.mode==="solo"?(r==="small"?(this.canvas.width=896,this.canvas.height=560):r==="large"?(this.canvas.width=1280,this.canvas.height=768):(this.canvas.width=1024,this.canvas.height=640),this.resizeCanvasContainer(),he("Tamanho do campo alterado!","success")):this.mode==="online"&&G.getSocket().emit("hostChangeFieldSize",{size:r}),this.togglePauseMenu()});const i=document.getElementById("pause-btn-reset-match");i&&(i.onclick=()=>{this.mode==="solo"?(this.score={red:0,blue:0},this.p1Tackles=0,this.p1Dribbles=0,this.p2Tackles=0,this.p2Dribbles=0,this.localMatchSim&&(this.localMatchSim.score={red:0,blue:0},this.localMatchSim.status="countdown",this.localMatchSim.countdownTimer=300,this.localBallSim.x=this.canvas.width/2,this.localBallSim.y=this.canvas.height/2,this.localBallSim.vx=0,this.localBallSim.vy=0),he("Partida reiniciada!","success")):this.mode==="online"&&G.getSocket().emit("hostResetMatch"),this.togglePauseMenu()})}};function xS(n,e,t){n.fillStyle="rgba(0,0,0,.25)",n.beginPath(),n.ellipse(e+3,t+6,en*1.1,en*.6,0,0,Math.PI*2),n.fill();const s=n.createRadialGradient(e-5,t-5,4,e,t,en);s.addColorStop(0,"#ffffff"),s.addColorStop(1,"#bfc8d6"),n.fillStyle=s,n.beginPath(),n.arc(e,t,en,0,Math.PI*2),n.fill()}function MS(n,e,t,s,i,r,o,l,c,h){LS(n,e,t),n.beginPath(),n.arc(e,t,st,0,Math.PI*2),n.fillStyle=s===Be.RED?"#ef4444":"#3b82f6",n.fill(),n.lineWidth=2,n.strokeStyle="rgba(0,0,0,.45)",n.stroke(),o>0&&(n.strokeStyle="#000000",n.lineWidth=2,n.beginPath(),n.arc(e,t,st+2,0,Math.PI*2),n.stroke()),r&&(n.fillStyle="#0b1020",n.font="700 16px system-ui, sans-serif",n.textAlign="center",n.textBaseline="middle",n.fillText(r,e,t)),l>0&&(n.strokeStyle="#22c55e",n.setLineDash([4,4]),n.beginPath(),n.arc(e,t,st+4,0,Math.PI*2),n.stroke(),n.setLineDash([])),c>0&&(n.strokeStyle="#ef4444",n.beginPath(),n.arc(e,t,st+2,0,Math.PI*2),n.stroke()),h&&(n.fillStyle="rgba(255,255,255,.85)",n.beginPath(),n.moveTo(e,t-st-10),n.lineTo(e-6,t-st-2),n.lineTo(e+6,t-st-2),n.closePath(),n.fill()),i&&(n.fillStyle="#e2e8f0",n.font="700 12px system-ui",n.textAlign="center",n.fillText(i,e,t-st-14))}function LS(n,e,t){n.fillStyle="rgba(0,0,0,.25)",n.beginPath(),n.ellipse(e+4,t+8,st*1.1,st*.6,0,0,Math.PI*2),n.fill()}const OS={initialized:!1,init(){if(this.initialized)return;this.initialized=!0;const n=document.getElementById("global-chat-container"),e=document.getElementById("global-chat-toggle"),t=document.getElementById("global-chat-form"),s=document.getElementById("global-chat-input"),i=document.getElementById("global-chat-messages");!n||!e||!t||(e.addEventListener("click",()=>{n.classList.toggle("minimized"),n.classList.contains("minimized")||s.focus()}),t.addEventListener("submit",async r=>{r.preventDefault();const o=s.value.trim();if(o){if(!Ge.profileData){he("Perfil não carregado ainda.","error");return}s.value="";try{await mt.sendGlobalChatMessage(Ge.profileData,o)}catch(l){he("Erro ao enviar mensagem.","error"),console.error(l)}}}),mt.subscribeToGlobalChat(r=>{if(!r)return;const o=document.createElement("div");o.className="global-chat-msg";const l=r.timestamp?new Date(r.timestamp).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}):"";o.innerHTML=`
        <span class="msg-time">${l}</span>
        <span class="msg-badge">${r.badge}</span>
        <span class="msg-author">${r.username}:</span>
        <span class="msg-content">${r.text}</span>
      `,i.appendChild(o),i.scrollTop=i.scrollHeight}))}};function VS(){console.log("[Kicker Hax SPA] Inicializando...");const n=document.getElementById("match-btn-fullscreen");n&&(n.onclick=()=>FS());const e=document.getElementById("game-version-badge"),t=document.getElementById("changelog-modal"),s=document.getElementById("changelog-btn-close");e&&t&&(e.onclick=()=>{t.classList.remove("hidden")}),s&&t&&(s.onclick=()=>{t.classList.add("hidden")}),IS.init(),Qi.loadSettings(),OS.init(),document.querySelectorAll("button, .btn").forEach(r=>{r.addEventListener("click",o=>{const l=document.createElement("span");l.className="ripple";const c=r.getBoundingClientRect(),h=Math.max(c.width,c.height);l.style.width=l.style.height=`${h}px`,l.style.left=`${o.clientX-c.left-h/2}px`,l.style.top=`${o.clientY-c.top-h/2}px`,r.appendChild(l),setTimeout(()=>l.remove(),500)})});const i=document.getElementById("splash-status");mt.subscribeToAuth(async r=>{if(r)if(i&&(i.textContent="Conectando ao banco de dados..."),await Ge.init(r),await Gf.init(r),Qi.init(),Ge.profileData&&Ge.profileData.isNewUser){he("Escolha seu apelido de jogador antes de começar!","info");const o=document.getElementById("profile-btn-back");o&&(o.style.display="none"),W.show("profile-screen")}else{const o=document.getElementById("profile-btn-back");o&&(o.style.display=""),W.show("menu-screen")}else Ge.currentUser=null,Gf.currentUser=null,W.show("login-screen")})}function FS(){document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen().catch(n=>{console.warn(`Erro ao ativar tela cheia: ${n.message}`)})}window.addEventListener("DOMContentLoaded",VS);
