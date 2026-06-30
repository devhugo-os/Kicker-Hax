(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))s(i);new MutationObserver(i=>{for(const r of i)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&s(o)}).observe(document,{childList:!0,subtree:!0});function t(i){const r={};return i.integrity&&(r.integrity=i.integrity),i.referrerPolicy&&(r.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?r.credentials="include":i.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function s(i){if(i.ep)return;i.ep=!0;const r=t(i);fetch(i.href,r)}})();class Hy{constructor(){this.routes=new Map,this.currentScreenId="splash-screen"}register(e,t={}){this.routes.set(e,{onEnter:t.onEnter||null,onExit:t.onExit||null})}show(e){const t=document.getElementById(e);if(!t){console.error(`[Router] Tela não encontrada: ${e}`);return}const s=this.currentScreenId,i=this.routes.get(s),r=this.routes.get(e);if(i&&i.onExit)try{i.onExit()}catch(c){console.error(`[Router] Erro ao sair da tela ${s}:`,c)}document.querySelectorAll(".screen-view").forEach(c=>{c.classList.add("hidden"),c.classList.remove("active")}),t.classList.remove("hidden"),t.classList.add("active"),this.currentScreenId=e;const l=document.getElementById("global-chat-container");if(l&&(e==="menu-screen"||e==="multiplayer-screen"?l.classList.remove("hidden"):l.classList.add("hidden")),r&&r.onEnter)try{r.onEnter()}catch(c){console.error(`[Router] Erro ao entrar na tela ${e}:`,c)}}}const $=new Hy;var fd={};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Rp={NODE_ADMIN:!1,SDK_VERSION:"${JSCORE_VERSION}"};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const D=function(n,e){if(!n)throw Qs(e)},Qs=function(n){return new Error("Firebase Database ("+Rp.SDK_VERSION+") INTERNAL ASSERT FAILED: "+n)};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Sp=function(n){const e=[];let t=0;for(let s=0;s<n.length;s++){let i=n.charCodeAt(s);i<128?e[t++]=i:i<2048?(e[t++]=i>>6|192,e[t++]=i&63|128):(i&64512)===55296&&s+1<n.length&&(n.charCodeAt(s+1)&64512)===56320?(i=65536+((i&1023)<<10)+(n.charCodeAt(++s)&1023),e[t++]=i>>18|240,e[t++]=i>>12&63|128,e[t++]=i>>6&63|128,e[t++]=i&63|128):(e[t++]=i>>12|224,e[t++]=i>>6&63|128,e[t++]=i&63|128)}return e},Ky=function(n){const e=[];let t=0,s=0;for(;t<n.length;){const i=n[t++];if(i<128)e[s++]=String.fromCharCode(i);else if(i>191&&i<224){const r=n[t++];e[s++]=String.fromCharCode((i&31)<<6|r&63)}else if(i>239&&i<365){const r=n[t++],o=n[t++],l=n[t++],c=((i&7)<<18|(r&63)<<12|(o&63)<<6|l&63)-65536;e[s++]=String.fromCharCode(55296+(c>>10)),e[s++]=String.fromCharCode(56320+(c&1023))}else{const r=n[t++],o=n[t++];e[s++]=String.fromCharCode((i&15)<<12|(r&63)<<6|o&63)}}return e.join("")},Ac={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(n,e){if(!Array.isArray(n))throw Error("encodeByteArray takes an array as a parameter");this.init_();const t=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,s=[];for(let i=0;i<n.length;i+=3){const r=n[i],o=i+1<n.length,l=o?n[i+1]:0,c=i+2<n.length,h=c?n[i+2]:0,d=r>>2,p=(r&3)<<4|l>>4;let m=(l&15)<<2|h>>6,E=h&63;c||(E=64,o||(m=64)),s.push(t[d],t[p],t[m],t[E])}return s.join("")},encodeString(n,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(n):this.encodeByteArray(Sp(n),e)},decodeString(n,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(n):Ky(this.decodeStringToByteArray(n,e))},decodeStringToByteArray(n,e){this.init_();const t=e?this.charToByteMapWebSafe_:this.charToByteMap_,s=[];for(let i=0;i<n.length;){const r=t[n.charAt(i++)],l=i<n.length?t[n.charAt(i)]:0;++i;const h=i<n.length?t[n.charAt(i)]:64;++i;const p=i<n.length?t[n.charAt(i)]:64;if(++i,r==null||l==null||h==null||p==null)throw new Qy;const m=r<<2|l>>4;if(s.push(m),h!==64){const E=l<<4&240|h>>2;if(s.push(E),p!==64){const R=h<<6&192|p;s.push(R)}}}return s},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let n=0;n<this.ENCODED_VALS.length;n++)this.byteToCharMap_[n]=this.ENCODED_VALS.charAt(n),this.charToByteMap_[this.byteToCharMap_[n]]=n,this.byteToCharMapWebSafe_[n]=this.ENCODED_VALS_WEBSAFE.charAt(n),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[n]]=n,n>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(n)]=n,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(n)]=n)}}};class Qy extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const Ap=function(n){const e=Sp(n);return Ac.encodeByteArray(e,!0)},Ro=function(n){return Ap(n).replace(/\./g,"")},So=function(n){try{return Ac.decodeString(n,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Yy(n){return kp(void 0,n)}function kp(n,e){if(!(e instanceof Object))return e;switch(e.constructor){case Date:const t=e;return new Date(t.getTime());case Object:n===void 0&&(n={});break;case Array:n=[];break;default:return e}for(const t in e)!e.hasOwnProperty(t)||!Jy(t)||(n[t]=kp(n[t],e[t]));return n}function Jy(n){return n!=="__proto__"}/**
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
 */function Xy(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
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
 */const Zy=()=>Xy().__FIREBASE_DEFAULTS__,ev=()=>{if(typeof process>"u"||typeof fd>"u")return;const n=fd.__FIREBASE_DEFAULTS__;if(n)return JSON.parse(n)},tv=()=>{if(typeof document>"u")return;let n;try{n=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const e=n&&So(n[1]);return e&&JSON.parse(e)},aa=()=>{try{return Zy()||ev()||tv()}catch(n){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${n}`);return}},Pp=n=>{var e,t;return(t=(e=aa())===null||e===void 0?void 0:e.emulatorHosts)===null||t===void 0?void 0:t[n]},Np=n=>{const e=Pp(n);if(!e)return;const t=e.lastIndexOf(":");if(t<=0||t+1===e.length)throw new Error(`Invalid host ${e} with no separate hostname and port!`);const s=parseInt(e.substring(t+1),10);return e[0]==="["?[e.substring(1,t-1),s]:[e.substring(0,t),s]},Dp=()=>{var n;return(n=aa())===null||n===void 0?void 0:n.config},Lp=n=>{var e;return(e=aa())===null||e===void 0?void 0:e[`_${n}`]};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class dr{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}wrapCallback(e){return(t,s)=>{t?this.reject(t):this.resolve(s),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(t):e(t,s))}}}/**
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
 */function xp(n,e){if(n.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');const t={alg:"none",type:"JWT"},s=e||"demo-project",i=n.iat||0,r=n.sub||n.user_id;if(!r)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");const o=Object.assign({iss:`https://securetoken.google.com/${s}`,aud:s,iat:i,exp:i+3600,auth_time:i,sub:r,user_id:r,firebase:{sign_in_provider:"custom",identities:{}}},n);return[Ro(JSON.stringify(t)),Ro(JSON.stringify(o)),""].join(".")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ze(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function kc(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(Ze())}function nv(){var n;const e=(n=aa())===null||n===void 0?void 0:n.forceEnvironment;if(e==="node")return!0;if(e==="browser")return!1;try{return Object.prototype.toString.call(global.process)==="[object process]"}catch{return!1}}function sv(){return typeof navigator<"u"&&navigator.userAgent==="Cloudflare-Workers"}function iv(){const n=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof n=="object"&&n.id!==void 0}function Op(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function rv(){const n=Ze();return n.indexOf("MSIE ")>=0||n.indexOf("Trident/")>=0}function ov(){return Rp.NODE_ADMIN===!0}function av(){return!nv()&&!!navigator.userAgent&&navigator.userAgent.includes("Safari")&&!navigator.userAgent.includes("Chrome")}function lv(){try{return typeof indexedDB=="object"}catch{return!1}}function cv(){return new Promise((n,e)=>{try{let t=!0;const s="validate-browser-context-for-indexeddb-analytics-module",i=self.indexedDB.open(s);i.onsuccess=()=>{i.result.close(),t||self.indexedDB.deleteDatabase(s),n(!0)},i.onupgradeneeded=()=>{t=!1},i.onerror=()=>{var r;e(((r=i.error)===null||r===void 0?void 0:r.message)||"")}}catch(t){e(t)}})}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const hv="FirebaseError";class on extends Error{constructor(e,t,s){super(t),this.code=e,this.customData=s,this.name=hv,Object.setPrototypeOf(this,on.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,fr.prototype.create)}}class fr{constructor(e,t,s){this.service=e,this.serviceName=t,this.errors=s}create(e,...t){const s=t[0]||{},i=`${this.service}/${e}`,r=this.errors[e],o=r?uv(r,s):"Error",l=`${this.serviceName}: ${o} (${i}).`;return new on(i,l,s)}}function uv(n,e){return n.replace(dv,(t,s)=>{const i=e[s];return i!=null?String(i):`<${s}?>`})}const dv=/\{\$([^}]+)}/g;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Qi(n){return JSON.parse(n)}function De(n){return JSON.stringify(n)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Mp=function(n){let e={},t={},s={},i="";try{const r=n.split(".");e=Qi(So(r[0])||""),t=Qi(So(r[1])||""),i=r[2],s=t.d||{},delete t.d}catch{}return{header:e,claims:t,data:s,signature:i}},fv=function(n){const e=Mp(n),t=e.claims;return!!t&&typeof t=="object"&&t.hasOwnProperty("iat")},pv=function(n){const e=Mp(n).claims;return typeof e=="object"&&e.admin===!0};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Bt(n,e){return Object.prototype.hasOwnProperty.call(n,e)}function Os(n,e){if(Object.prototype.hasOwnProperty.call(n,e))return n[e]}function Fl(n){for(const e in n)if(Object.prototype.hasOwnProperty.call(n,e))return!1;return!0}function Ao(n,e,t){const s={};for(const i in n)Object.prototype.hasOwnProperty.call(n,i)&&(s[i]=e.call(t,n[i],i,n));return s}function ko(n,e){if(n===e)return!0;const t=Object.keys(n),s=Object.keys(e);for(const i of t){if(!s.includes(i))return!1;const r=n[i],o=e[i];if(pd(r)&&pd(o)){if(!ko(r,o))return!1}else if(r!==o)return!1}for(const i of s)if(!t.includes(i))return!1;return!0}function pd(n){return n!==null&&typeof n=="object"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ys(n){const e=[];for(const[t,s]of Object.entries(n))Array.isArray(s)?s.forEach(i=>{e.push(encodeURIComponent(t)+"="+encodeURIComponent(i))}):e.push(encodeURIComponent(t)+"="+encodeURIComponent(s));return e.length?"&"+e.join("&"):""}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class mv{constructor(){this.chain_=[],this.buf_=[],this.W_=[],this.pad_=[],this.inbuf_=0,this.total_=0,this.blockSize=512/8,this.pad_[0]=128;for(let e=1;e<this.blockSize;++e)this.pad_[e]=0;this.reset()}reset(){this.chain_[0]=1732584193,this.chain_[1]=4023233417,this.chain_[2]=2562383102,this.chain_[3]=271733878,this.chain_[4]=3285377520,this.inbuf_=0,this.total_=0}compress_(e,t){t||(t=0);const s=this.W_;if(typeof e=="string")for(let p=0;p<16;p++)s[p]=e.charCodeAt(t)<<24|e.charCodeAt(t+1)<<16|e.charCodeAt(t+2)<<8|e.charCodeAt(t+3),t+=4;else for(let p=0;p<16;p++)s[p]=e[t]<<24|e[t+1]<<16|e[t+2]<<8|e[t+3],t+=4;for(let p=16;p<80;p++){const m=s[p-3]^s[p-8]^s[p-14]^s[p-16];s[p]=(m<<1|m>>>31)&4294967295}let i=this.chain_[0],r=this.chain_[1],o=this.chain_[2],l=this.chain_[3],c=this.chain_[4],h,d;for(let p=0;p<80;p++){p<40?p<20?(h=l^r&(o^l),d=1518500249):(h=r^o^l,d=1859775393):p<60?(h=r&o|l&(r|o),d=2400959708):(h=r^o^l,d=3395469782);const m=(i<<5|i>>>27)+h+c+d+s[p]&4294967295;c=l,l=o,o=(r<<30|r>>>2)&4294967295,r=i,i=m}this.chain_[0]=this.chain_[0]+i&4294967295,this.chain_[1]=this.chain_[1]+r&4294967295,this.chain_[2]=this.chain_[2]+o&4294967295,this.chain_[3]=this.chain_[3]+l&4294967295,this.chain_[4]=this.chain_[4]+c&4294967295}update(e,t){if(e==null)return;t===void 0&&(t=e.length);const s=t-this.blockSize;let i=0;const r=this.buf_;let o=this.inbuf_;for(;i<t;){if(o===0)for(;i<=s;)this.compress_(e,i),i+=this.blockSize;if(typeof e=="string"){for(;i<t;)if(r[o]=e.charCodeAt(i),++o,++i,o===this.blockSize){this.compress_(r),o=0;break}}else for(;i<t;)if(r[o]=e[i],++o,++i,o===this.blockSize){this.compress_(r),o=0;break}}this.inbuf_=o,this.total_+=t}digest(){const e=[];let t=this.total_*8;this.inbuf_<56?this.update(this.pad_,56-this.inbuf_):this.update(this.pad_,this.blockSize-(this.inbuf_-56));for(let i=this.blockSize-1;i>=56;i--)this.buf_[i]=t&255,t/=256;this.compress_(this.buf_);let s=0;for(let i=0;i<5;i++)for(let r=24;r>=0;r-=8)e[s]=this.chain_[i]>>r&255,++s;return e}}function gv(n,e){const t=new _v(n,e);return t.subscribe.bind(t)}class _v{constructor(e,t){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=t,this.task.then(()=>{e(this)}).catch(s=>{this.error(s)})}next(e){this.forEachObserver(t=>{t.next(e)})}error(e){this.forEachObserver(t=>{t.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,t,s){let i;if(e===void 0&&t===void 0&&s===void 0)throw new Error("Missing Observer.");yv(e,["next","error","complete"])?i=e:i={next:e,error:t,complete:s},i.next===void 0&&(i.next=ol),i.error===void 0&&(i.error=ol),i.complete===void 0&&(i.complete=ol);const r=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?i.error(this.finalError):i.complete()}catch{}}),this.observers.push(i),r}unsubscribeOne(e){this.observers===void 0||this.observers[e]===void 0||(delete this.observers[e],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let t=0;t<this.observers.length;t++)this.sendOne(t,e)}sendOne(e,t){this.task.then(()=>{if(this.observers!==void 0&&this.observers[e]!==void 0)try{t(this.observers[e])}catch(s){typeof console<"u"&&console.error&&console.error(s)}})}close(e){this.finalized||(this.finalized=!0,e!==void 0&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function yv(n,e){if(typeof n!="object"||n===null)return!1;for(const t of e)if(t in n&&typeof n[t]=="function")return!0;return!1}function ol(){}function la(n,e){return`${n} failed: ${e} argument `}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const vv=function(n){const e=[];let t=0;for(let s=0;s<n.length;s++){let i=n.charCodeAt(s);if(i>=55296&&i<=56319){const r=i-55296;s++,D(s<n.length,"Surrogate pair missing trail surrogate.");const o=n.charCodeAt(s)-56320;i=65536+(r<<10)+o}i<128?e[t++]=i:i<2048?(e[t++]=i>>6|192,e[t++]=i&63|128):i<65536?(e[t++]=i>>12|224,e[t++]=i>>6&63|128,e[t++]=i&63|128):(e[t++]=i>>18|240,e[t++]=i>>12&63|128,e[t++]=i>>6&63|128,e[t++]=i&63|128)}return e},ca=function(n){let e=0;for(let t=0;t<n.length;t++){const s=n.charCodeAt(t);s<128?e++:s<2048?e+=2:s>=55296&&s<=56319?(e+=4,t++):e+=3}return e};/**
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
 */const jn="[DEFAULT]";/**
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
 */class Ev{constructor(e,t){this.name=e,this.container=t,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const t=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(t)){const s=new dr;if(this.instancesDeferred.set(t,s),this.isInitialized(t)||this.shouldAutoInitialize())try{const i=this.getOrInitializeService({instanceIdentifier:t});i&&s.resolve(i)}catch{}}return this.instancesDeferred.get(t).promise}getImmediate(e){var t;const s=this.normalizeInstanceIdentifier(e==null?void 0:e.identifier),i=(t=e==null?void 0:e.optional)!==null&&t!==void 0?t:!1;if(this.isInitialized(s)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:s})}catch(r){if(i)return null;throw r}else{if(i)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(Tv(e))try{this.getOrInitializeService({instanceIdentifier:jn})}catch{}for(const[t,s]of this.instancesDeferred.entries()){const i=this.normalizeInstanceIdentifier(t);try{const r=this.getOrInitializeService({instanceIdentifier:i});s.resolve(r)}catch{}}}}clearInstance(e=jn){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(t=>"INTERNAL"in t).map(t=>t.INTERNAL.delete()),...e.filter(t=>"_delete"in t).map(t=>t._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=jn){return this.instances.has(e)}getOptions(e=jn){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:t={}}=e,s=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(s))throw Error(`${this.name}(${s}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const i=this.getOrInitializeService({instanceIdentifier:s,options:t});for(const[r,o]of this.instancesDeferred.entries()){const l=this.normalizeInstanceIdentifier(r);s===l&&o.resolve(i)}return i}onInit(e,t){var s;const i=this.normalizeInstanceIdentifier(t),r=(s=this.onInitCallbacks.get(i))!==null&&s!==void 0?s:new Set;r.add(e),this.onInitCallbacks.set(i,r);const o=this.instances.get(i);return o&&e(o,i),()=>{r.delete(e)}}invokeOnInitCallbacks(e,t){const s=this.onInitCallbacks.get(t);if(s)for(const i of s)try{i(e,t)}catch{}}getOrInitializeService({instanceIdentifier:e,options:t={}}){let s=this.instances.get(e);if(!s&&this.component&&(s=this.component.instanceFactory(this.container,{instanceIdentifier:wv(e),options:t}),this.instances.set(e,s),this.instancesOptions.set(e,t),this.invokeOnInitCallbacks(s,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,s)}catch{}return s||null}normalizeInstanceIdentifier(e=jn){return this.component?this.component.multipleInstances?e:jn:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function wv(n){return n===jn?void 0:n}function Tv(n){return n.instantiationMode==="EAGER"}/**
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
 */class Iv{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const t=this.getProvider(e.name);if(t.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);t.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const t=new Ev(e,this);return this.providers.set(e,t),t}getProviders(){return Array.from(this.providers.values())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var te;(function(n){n[n.DEBUG=0]="DEBUG",n[n.VERBOSE=1]="VERBOSE",n[n.INFO=2]="INFO",n[n.WARN=3]="WARN",n[n.ERROR=4]="ERROR",n[n.SILENT=5]="SILENT"})(te||(te={}));const bv={debug:te.DEBUG,verbose:te.VERBOSE,info:te.INFO,warn:te.WARN,error:te.ERROR,silent:te.SILENT},Cv=te.INFO,Rv={[te.DEBUG]:"log",[te.VERBOSE]:"log",[te.INFO]:"info",[te.WARN]:"warn",[te.ERROR]:"error"},Sv=(n,e,...t)=>{if(e<n.logLevel)return;const s=new Date().toISOString(),i=Rv[e];if(i)console[i](`[${s}]  ${n.name}:`,...t);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class ha{constructor(e){this.name=e,this._logLevel=Cv,this._logHandler=Sv,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in te))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?bv[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,te.DEBUG,...e),this._logHandler(this,te.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,te.VERBOSE,...e),this._logHandler(this,te.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,te.INFO,...e),this._logHandler(this,te.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,te.WARN,...e),this._logHandler(this,te.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,te.ERROR,...e),this._logHandler(this,te.ERROR,...e)}}const Av=(n,e)=>e.some(t=>n instanceof t);let md,gd;function kv(){return md||(md=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function Pv(){return gd||(gd=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const Vp=new WeakMap,Bl=new WeakMap,Fp=new WeakMap,al=new WeakMap,Pc=new WeakMap;function Nv(n){const e=new Promise((t,s)=>{const i=()=>{n.removeEventListener("success",r),n.removeEventListener("error",o)},r=()=>{t(In(n.result)),i()},o=()=>{s(n.error),i()};n.addEventListener("success",r),n.addEventListener("error",o)});return e.then(t=>{t instanceof IDBCursor&&Vp.set(t,n)}).catch(()=>{}),Pc.set(e,n),e}function Dv(n){if(Bl.has(n))return;const e=new Promise((t,s)=>{const i=()=>{n.removeEventListener("complete",r),n.removeEventListener("error",o),n.removeEventListener("abort",o)},r=()=>{t(),i()},o=()=>{s(n.error||new DOMException("AbortError","AbortError")),i()};n.addEventListener("complete",r),n.addEventListener("error",o),n.addEventListener("abort",o)});Bl.set(n,e)}let Ul={get(n,e,t){if(n instanceof IDBTransaction){if(e==="done")return Bl.get(n);if(e==="objectStoreNames")return n.objectStoreNames||Fp.get(n);if(e==="store")return t.objectStoreNames[1]?void 0:t.objectStore(t.objectStoreNames[0])}return In(n[e])},set(n,e,t){return n[e]=t,!0},has(n,e){return n instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in n}};function Lv(n){Ul=n(Ul)}function xv(n){return n===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...t){const s=n.call(ll(this),e,...t);return Fp.set(s,e.sort?e.sort():[e]),In(s)}:Pv().includes(n)?function(...e){return n.apply(ll(this),e),In(Vp.get(this))}:function(...e){return In(n.apply(ll(this),e))}}function Ov(n){return typeof n=="function"?xv(n):(n instanceof IDBTransaction&&Dv(n),Av(n,kv())?new Proxy(n,Ul):n)}function In(n){if(n instanceof IDBRequest)return Nv(n);if(al.has(n))return al.get(n);const e=Ov(n);return e!==n&&(al.set(n,e),Pc.set(e,n)),e}const ll=n=>Pc.get(n);function Mv(n,e,{blocked:t,upgrade:s,blocking:i,terminated:r}={}){const o=indexedDB.open(n,e),l=In(o);return s&&o.addEventListener("upgradeneeded",c=>{s(In(o.result),c.oldVersion,c.newVersion,In(o.transaction),c)}),t&&o.addEventListener("blocked",c=>t(c.oldVersion,c.newVersion,c)),l.then(c=>{r&&c.addEventListener("close",()=>r()),i&&c.addEventListener("versionchange",h=>i(h.oldVersion,h.newVersion,h))}).catch(()=>{}),l}const Vv=["get","getKey","getAll","getAllKeys","count"],Fv=["put","add","delete","clear"],cl=new Map;function _d(n,e){if(!(n instanceof IDBDatabase&&!(e in n)&&typeof e=="string"))return;if(cl.get(e))return cl.get(e);const t=e.replace(/FromIndex$/,""),s=e!==t,i=Fv.includes(t);if(!(t in(s?IDBIndex:IDBObjectStore).prototype)||!(i||Vv.includes(t)))return;const r=async function(o,...l){const c=this.transaction(o,i?"readwrite":"readonly");let h=c.store;return s&&(h=h.index(l.shift())),(await Promise.all([h[t](...l),i&&c.done]))[0]};return cl.set(e,r),r}Lv(n=>({...n,get:(e,t,s)=>_d(e,t)||n.get(e,t,s),has:(e,t)=>!!_d(e,t)||n.has(e,t)}));/**
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
 */class Bv{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(t=>{if(Uv(t)){const s=t.getImmediate();return`${s.library}/${s.version}`}else return null}).filter(t=>t).join(" ")}}function Uv(n){const e=n.getComponent();return(e==null?void 0:e.type)==="VERSION"}const ql="@firebase/app",yd="0.10.13";/**
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
 */const en=new ha("@firebase/app"),qv="@firebase/app-compat",Wv="@firebase/analytics-compat",$v="@firebase/analytics",jv="@firebase/app-check-compat",Gv="@firebase/app-check",zv="@firebase/auth",Hv="@firebase/auth-compat",Kv="@firebase/database",Qv="@firebase/data-connect",Yv="@firebase/database-compat",Jv="@firebase/functions",Xv="@firebase/functions-compat",Zv="@firebase/installations",eE="@firebase/installations-compat",tE="@firebase/messaging",nE="@firebase/messaging-compat",sE="@firebase/performance",iE="@firebase/performance-compat",rE="@firebase/remote-config",oE="@firebase/remote-config-compat",aE="@firebase/storage",lE="@firebase/storage-compat",cE="@firebase/firestore",hE="@firebase/vertexai-preview",uE="@firebase/firestore-compat",dE="firebase",fE="10.14.1";/**
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
 */const Wl="[DEFAULT]",pE={[ql]:"fire-core",[qv]:"fire-core-compat",[$v]:"fire-analytics",[Wv]:"fire-analytics-compat",[Gv]:"fire-app-check",[jv]:"fire-app-check-compat",[zv]:"fire-auth",[Hv]:"fire-auth-compat",[Kv]:"fire-rtdb",[Qv]:"fire-data-connect",[Yv]:"fire-rtdb-compat",[Jv]:"fire-fn",[Xv]:"fire-fn-compat",[Zv]:"fire-iid",[eE]:"fire-iid-compat",[tE]:"fire-fcm",[nE]:"fire-fcm-compat",[sE]:"fire-perf",[iE]:"fire-perf-compat",[rE]:"fire-rc",[oE]:"fire-rc-compat",[aE]:"fire-gcs",[lE]:"fire-gcs-compat",[cE]:"fire-fst",[uE]:"fire-fst-compat",[hE]:"fire-vertex","fire-js":"fire-js",[dE]:"fire-js-all"};/**
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
 */const Po=new Map,mE=new Map,$l=new Map;function vd(n,e){try{n.container.addComponent(e)}catch(t){en.debug(`Component ${e.name} failed to register with FirebaseApp ${n.name}`,t)}}function Xn(n){const e=n.name;if($l.has(e))return en.debug(`There were multiple attempts to register component ${e}.`),!1;$l.set(e,n);for(const t of Po.values())vd(t,n);for(const t of mE.values())vd(t,n);return!0}function ua(n,e){const t=n.container.getProvider("heartbeat").getImmediate({optional:!0});return t&&t.triggerHeartbeat(),n.container.getProvider(e)}function Kt(n){return n.settings!==void 0}/**
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
 */const gE={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},bn=new fr("app","Firebase",gE);/**
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
 */class _E{constructor(e,t,s){this._isDeleted=!1,this._options=Object.assign({},e),this._config=Object.assign({},t),this._name=t.name,this._automaticDataCollectionEnabled=t.automaticDataCollectionEnabled,this._container=s,this.container.addComponent(new Pn("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw bn.create("app-deleted",{appName:this._name})}}/**
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
 */const as=fE;function Bp(n,e={}){let t=n;typeof e!="object"&&(e={name:e});const s=Object.assign({name:Wl,automaticDataCollectionEnabled:!1},e),i=s.name;if(typeof i!="string"||!i)throw bn.create("bad-app-name",{appName:String(i)});if(t||(t=Dp()),!t)throw bn.create("no-options");const r=Po.get(i);if(r){if(ko(t,r.options)&&ko(s,r.config))return r;throw bn.create("duplicate-app",{appName:i})}const o=new Iv(i);for(const c of $l.values())o.addComponent(c);const l=new _E(t,s,o);return Po.set(i,l),l}function Nc(n=Wl){const e=Po.get(n);if(!e&&n===Wl&&Dp())return Bp();if(!e)throw bn.create("no-app",{appName:n});return e}function Nt(n,e,t){var s;let i=(s=pE[n])!==null&&s!==void 0?s:n;t&&(i+=`-${t}`);const r=i.match(/\s|\//),o=e.match(/\s|\//);if(r||o){const l=[`Unable to register library "${i}" with version "${e}":`];r&&l.push(`library name "${i}" contains illegal characters (whitespace or "/")`),r&&o&&l.push("and"),o&&l.push(`version name "${e}" contains illegal characters (whitespace or "/")`),en.warn(l.join(" "));return}Xn(new Pn(`${i}-version`,()=>({library:i,version:e}),"VERSION"))}/**
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
 */const yE="firebase-heartbeat-database",vE=1,Yi="firebase-heartbeat-store";let hl=null;function Up(){return hl||(hl=Mv(yE,vE,{upgrade:(n,e)=>{switch(e){case 0:try{n.createObjectStore(Yi)}catch(t){console.warn(t)}}}}).catch(n=>{throw bn.create("idb-open",{originalErrorMessage:n.message})})),hl}async function EE(n){try{const t=(await Up()).transaction(Yi),s=await t.objectStore(Yi).get(qp(n));return await t.done,s}catch(e){if(e instanceof on)en.warn(e.message);else{const t=bn.create("idb-get",{originalErrorMessage:e==null?void 0:e.message});en.warn(t.message)}}}async function Ed(n,e){try{const s=(await Up()).transaction(Yi,"readwrite");await s.objectStore(Yi).put(e,qp(n)),await s.done}catch(t){if(t instanceof on)en.warn(t.message);else{const s=bn.create("idb-set",{originalErrorMessage:t==null?void 0:t.message});en.warn(s.message)}}}function qp(n){return`${n.name}!${n.options.appId}`}/**
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
 */const wE=1024,TE=30*24*60*60*1e3;class IE{constructor(e){this.container=e,this._heartbeatsCache=null;const t=this.container.getProvider("app").getImmediate();this._storage=new CE(t),this._heartbeatsCachePromise=this._storage.read().then(s=>(this._heartbeatsCache=s,s))}async triggerHeartbeat(){var e,t;try{const i=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),r=wd();return((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((t=this._heartbeatsCache)===null||t===void 0?void 0:t.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===r||this._heartbeatsCache.heartbeats.some(o=>o.date===r)?void 0:(this._heartbeatsCache.heartbeats.push({date:r,agent:i}),this._heartbeatsCache.heartbeats=this._heartbeatsCache.heartbeats.filter(o=>{const l=new Date(o.date).valueOf();return Date.now()-l<=TE}),this._storage.overwrite(this._heartbeatsCache))}catch(s){en.warn(s)}}async getHeartbeatsHeader(){var e;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const t=wd(),{heartbeatsToSend:s,unsentEntries:i}=bE(this._heartbeatsCache.heartbeats),r=Ro(JSON.stringify({version:2,heartbeats:s}));return this._heartbeatsCache.lastSentHeartbeatDate=t,i.length>0?(this._heartbeatsCache.heartbeats=i,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),r}catch(t){return en.warn(t),""}}}function wd(){return new Date().toISOString().substring(0,10)}function bE(n,e=wE){const t=[];let s=n.slice();for(const i of n){const r=t.find(o=>o.agent===i.agent);if(r){if(r.dates.push(i.date),Td(t)>e){r.dates.pop();break}}else if(t.push({agent:i.agent,dates:[i.date]}),Td(t)>e){t.pop();break}s=s.slice(1)}return{heartbeatsToSend:t,unsentEntries:s}}class CE{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return lv()?cv().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const t=await EE(this.app);return t!=null&&t.heartbeats?t:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){var t;if(await this._canUseIndexedDBPromise){const i=await this.read();return Ed(this.app,{lastSentHeartbeatDate:(t=e.lastSentHeartbeatDate)!==null&&t!==void 0?t:i.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){var t;if(await this._canUseIndexedDBPromise){const i=await this.read();return Ed(this.app,{lastSentHeartbeatDate:(t=e.lastSentHeartbeatDate)!==null&&t!==void 0?t:i.lastSentHeartbeatDate,heartbeats:[...i.heartbeats,...e.heartbeats]})}else return}}function Td(n){return Ro(JSON.stringify({version:2,heartbeats:n})).length}/**
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
 */function RE(n){Xn(new Pn("platform-logger",e=>new Bv(e),"PRIVATE")),Xn(new Pn("heartbeat",e=>new IE(e),"PRIVATE")),Nt(ql,yd,n),Nt(ql,yd,"esm2017"),Nt("fire-js","")}RE("");var SE="firebase",AE="10.14.1";/**
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
 */Nt(SE,AE,"app");function Dc(n,e){var t={};for(var s in n)Object.prototype.hasOwnProperty.call(n,s)&&e.indexOf(s)<0&&(t[s]=n[s]);if(n!=null&&typeof Object.getOwnPropertySymbols=="function")for(var i=0,s=Object.getOwnPropertySymbols(n);i<s.length;i++)e.indexOf(s[i])<0&&Object.prototype.propertyIsEnumerable.call(n,s[i])&&(t[s[i]]=n[s[i]]);return t}function Wp(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}const kE=Wp,$p=new fr("auth","Firebase",Wp());/**
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
 */const No=new ha("@firebase/auth");function PE(n,...e){No.logLevel<=te.WARN&&No.warn(`Auth (${as}): ${n}`,...e)}function ho(n,...e){No.logLevel<=te.ERROR&&No.error(`Auth (${as}): ${n}`,...e)}/**
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
 */function Ot(n,...e){throw xc(n,...e)}function Rt(n,...e){return xc(n,...e)}function Lc(n,e,t){const s=Object.assign(Object.assign({},kE()),{[e]:t});return new fr("auth","Firebase",s).create(e,{appName:n.name})}function Qn(n){return Lc(n,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function NE(n,e,t){const s=t;if(!(e instanceof s))throw s.name!==e.constructor.name&&Ot(n,"argument-error"),Lc(n,"argument-error",`Type of ${e.constructor.name} does not match expected instance.Did you pass a reference from a different Auth SDK?`)}function xc(n,...e){if(typeof n!="string"){const t=e[0],s=[...e.slice(1)];return s[0]&&(s[0].appName=n.name),n._errorFactory.create(t,...s)}return $p.create(n,...e)}function K(n,e,...t){if(!n)throw xc(e,...t)}function Qt(n){const e="INTERNAL ASSERTION FAILED: "+n;throw ho(e),new Error(e)}function tn(n,e){n||Qt(e)}/**
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
 */function jl(){var n;return typeof self<"u"&&((n=self.location)===null||n===void 0?void 0:n.href)||""}function DE(){return Id()==="http:"||Id()==="https:"}function Id(){var n;return typeof self<"u"&&((n=self.location)===null||n===void 0?void 0:n.protocol)||null}/**
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
 */function LE(){return typeof navigator<"u"&&navigator&&"onLine"in navigator&&typeof navigator.onLine=="boolean"&&(DE()||iv()||"connection"in navigator)?navigator.onLine:!0}function xE(){if(typeof navigator>"u")return null;const n=navigator;return n.languages&&n.languages[0]||n.language||null}/**
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
 */class pr{constructor(e,t){this.shortDelay=e,this.longDelay=t,tn(t>e,"Short delay should be less than long delay!"),this.isMobile=kc()||Op()}get(){return LE()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}}/**
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
 */function Oc(n,e){tn(n.emulator,"Emulator should always be set here");const{url:t}=n.emulator;return e?`${t}${e.startsWith("/")?e.slice(1):e}`:t}/**
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
 */class jp{static initialize(e,t,s){this.fetchImpl=e,t&&(this.headersImpl=t),s&&(this.responseImpl=s)}static fetch(){if(this.fetchImpl)return this.fetchImpl;if(typeof self<"u"&&"fetch"in self)return self.fetch;if(typeof globalThis<"u"&&globalThis.fetch)return globalThis.fetch;if(typeof fetch<"u")return fetch;Qt("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){if(this.headersImpl)return this.headersImpl;if(typeof self<"u"&&"Headers"in self)return self.Headers;if(typeof globalThis<"u"&&globalThis.Headers)return globalThis.Headers;if(typeof Headers<"u")return Headers;Qt("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){if(this.responseImpl)return this.responseImpl;if(typeof self<"u"&&"Response"in self)return self.Response;if(typeof globalThis<"u"&&globalThis.Response)return globalThis.Response;if(typeof Response<"u")return Response;Qt("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}/**
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
 */const OE={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"};/**
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
 */const ME=new pr(3e4,6e4);function Mc(n,e){return n.tenantId&&!e.tenantId?Object.assign(Object.assign({},e),{tenantId:n.tenantId}):e}async function Js(n,e,t,s,i={}){return Gp(n,i,async()=>{let r={},o={};s&&(e==="GET"?o=s:r={body:JSON.stringify(s)});const l=Ys(Object.assign({key:n.config.apiKey},o)).slice(1),c=await n._getAdditionalHeaders();c["Content-Type"]="application/json",n.languageCode&&(c["X-Firebase-Locale"]=n.languageCode);const h=Object.assign({method:e,headers:c},r);return sv()||(h.referrerPolicy="no-referrer"),jp.fetch()(zp(n,n.config.apiHost,t,l),h)})}async function Gp(n,e,t){n._canInitEmulator=!1;const s=Object.assign(Object.assign({},OE),e);try{const i=new FE(n),r=await Promise.race([t(),i.promise]);i.clearNetworkTimeout();const o=await r.json();if("needConfirmation"in o)throw Zr(n,"account-exists-with-different-credential",o);if(r.ok&&!("errorMessage"in o))return o;{const l=r.ok?o.errorMessage:o.error.message,[c,h]=l.split(" : ");if(c==="FEDERATED_USER_ID_ALREADY_LINKED")throw Zr(n,"credential-already-in-use",o);if(c==="EMAIL_EXISTS")throw Zr(n,"email-already-in-use",o);if(c==="USER_DISABLED")throw Zr(n,"user-disabled",o);const d=s[c]||c.toLowerCase().replace(/[_\s]+/g,"-");if(h)throw Lc(n,d,h);Ot(n,d)}}catch(i){if(i instanceof on)throw i;Ot(n,"network-request-failed",{message:String(i)})}}async function VE(n,e,t,s,i={}){const r=await Js(n,e,t,s,i);return"mfaPendingCredential"in r&&Ot(n,"multi-factor-auth-required",{_serverResponse:r}),r}function zp(n,e,t,s){const i=`${e}${t}?${s}`;return n.config.emulator?Oc(n.config,i):`${n.config.apiScheme}://${i}`}class FE{constructor(e){this.auth=e,this.timer=null,this.promise=new Promise((t,s)=>{this.timer=setTimeout(()=>s(Rt(this.auth,"network-request-failed")),ME.get())})}clearNetworkTimeout(){clearTimeout(this.timer)}}function Zr(n,e,t){const s={appName:n.name};t.email&&(s.email=t.email),t.phoneNumber&&(s.phoneNumber=t.phoneNumber);const i=Rt(n,e,s);return i.customData._tokenResponse=t,i}/**
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
 */async function BE(n,e){return Js(n,"POST","/v1/accounts:delete",e)}async function Hp(n,e){return Js(n,"POST","/v1/accounts:lookup",e)}/**
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
 */function Vi(n){if(n)try{const e=new Date(Number(n));if(!isNaN(e.getTime()))return e.toUTCString()}catch{}}async function UE(n,e=!1){const t=me(n),s=await t.getIdToken(e),i=Vc(s);K(i&&i.exp&&i.auth_time&&i.iat,t.auth,"internal-error");const r=typeof i.firebase=="object"?i.firebase:void 0,o=r==null?void 0:r.sign_in_provider;return{claims:i,token:s,authTime:Vi(ul(i.auth_time)),issuedAtTime:Vi(ul(i.iat)),expirationTime:Vi(ul(i.exp)),signInProvider:o||null,signInSecondFactor:(r==null?void 0:r.sign_in_second_factor)||null}}function ul(n){return Number(n)*1e3}function Vc(n){const[e,t,s]=n.split(".");if(e===void 0||t===void 0||s===void 0)return ho("JWT malformed, contained fewer than 3 sections"),null;try{const i=So(t);return i?JSON.parse(i):(ho("Failed to decode base64 JWT payload"),null)}catch(i){return ho("Caught error parsing JWT payload as JSON",i==null?void 0:i.toString()),null}}function bd(n){const e=Vc(n);return K(e,"internal-error"),K(typeof e.exp<"u","internal-error"),K(typeof e.iat<"u","internal-error"),Number(e.exp)-Number(e.iat)}/**
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
 */async function Ji(n,e,t=!1){if(t)return e;try{return await e}catch(s){throw s instanceof on&&qE(s)&&n.auth.currentUser===n&&await n.auth.signOut(),s}}function qE({code:n}){return n==="auth/user-disabled"||n==="auth/user-token-expired"}/**
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
 */class WE{constructor(e){this.user=e,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,this.timerId!==null&&clearTimeout(this.timerId))}getInterval(e){var t;if(e){const s=this.errorBackoff;return this.errorBackoff=Math.min(this.errorBackoff*2,96e4),s}else{this.errorBackoff=3e4;const i=((t=this.user.stsTokenManager.expirationTime)!==null&&t!==void 0?t:0)-Date.now()-3e5;return Math.max(0,i)}}schedule(e=!1){if(!this.isRunning)return;const t=this.getInterval(e);this.timerId=setTimeout(async()=>{await this.iteration()},t)}async iteration(){try{await this.user.getIdToken(!0)}catch(e){(e==null?void 0:e.code)==="auth/network-request-failed"&&this.schedule(!0);return}this.schedule()}}/**
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
 */class Gl{constructor(e,t){this.createdAt=e,this.lastLoginAt=t,this._initializeTime()}_initializeTime(){this.lastSignInTime=Vi(this.lastLoginAt),this.creationTime=Vi(this.createdAt)}_copy(e){this.createdAt=e.createdAt,this.lastLoginAt=e.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}}/**
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
 */async function Do(n){var e;const t=n.auth,s=await n.getIdToken(),i=await Ji(n,Hp(t,{idToken:s}));K(i==null?void 0:i.users.length,t,"internal-error");const r=i.users[0];n._notifyReloadListener(r);const o=!((e=r.providerUserInfo)===null||e===void 0)&&e.length?Kp(r.providerUserInfo):[],l=jE(n.providerData,o),c=n.isAnonymous,h=!(n.email&&r.passwordHash)&&!(l!=null&&l.length),d=c?h:!1,p={uid:r.localId,displayName:r.displayName||null,photoURL:r.photoUrl||null,email:r.email||null,emailVerified:r.emailVerified||!1,phoneNumber:r.phoneNumber||null,tenantId:r.tenantId||null,providerData:l,metadata:new Gl(r.createdAt,r.lastLoginAt),isAnonymous:d};Object.assign(n,p)}async function $E(n){const e=me(n);await Do(e),await e.auth._persistUserIfCurrent(e),e.auth._notifyListenersIfCurrent(e)}function jE(n,e){return[...n.filter(s=>!e.some(i=>i.providerId===s.providerId)),...e]}function Kp(n){return n.map(e=>{var{providerId:t}=e,s=Dc(e,["providerId"]);return{providerId:t,uid:s.rawId||"",displayName:s.displayName||null,email:s.email||null,phoneNumber:s.phoneNumber||null,photoURL:s.photoUrl||null}})}/**
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
 */async function GE(n,e){const t=await Gp(n,{},async()=>{const s=Ys({grant_type:"refresh_token",refresh_token:e}).slice(1),{tokenApiHost:i,apiKey:r}=n.config,o=zp(n,i,"/v1/token",`key=${r}`),l=await n._getAdditionalHeaders();return l["Content-Type"]="application/x-www-form-urlencoded",jp.fetch()(o,{method:"POST",headers:l,body:s})});return{accessToken:t.access_token,expiresIn:t.expires_in,refreshToken:t.refresh_token}}async function zE(n,e){return Js(n,"POST","/v2/accounts:revokeToken",Mc(n,e))}/**
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
 */class ks{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(e){K(e.idToken,"internal-error"),K(typeof e.idToken<"u","internal-error"),K(typeof e.refreshToken<"u","internal-error");const t="expiresIn"in e&&typeof e.expiresIn<"u"?Number(e.expiresIn):bd(e.idToken);this.updateTokensAndExpiration(e.idToken,e.refreshToken,t)}updateFromIdToken(e){K(e.length!==0,"internal-error");const t=bd(e);this.updateTokensAndExpiration(e,null,t)}async getToken(e,t=!1){return!t&&this.accessToken&&!this.isExpired?this.accessToken:(K(this.refreshToken,e,"user-token-expired"),this.refreshToken?(await this.refresh(e,this.refreshToken),this.accessToken):null)}clearRefreshToken(){this.refreshToken=null}async refresh(e,t){const{accessToken:s,refreshToken:i,expiresIn:r}=await GE(e,t);this.updateTokensAndExpiration(s,i,Number(r))}updateTokensAndExpiration(e,t,s){this.refreshToken=t||null,this.accessToken=e||null,this.expirationTime=Date.now()+s*1e3}static fromJSON(e,t){const{refreshToken:s,accessToken:i,expirationTime:r}=t,o=new ks;return s&&(K(typeof s=="string","internal-error",{appName:e}),o.refreshToken=s),i&&(K(typeof i=="string","internal-error",{appName:e}),o.accessToken=i),r&&(K(typeof r=="number","internal-error",{appName:e}),o.expirationTime=r),o}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(e){this.accessToken=e.accessToken,this.refreshToken=e.refreshToken,this.expirationTime=e.expirationTime}_clone(){return Object.assign(new ks,this.toJSON())}_performRefresh(){return Qt("not implemented")}}/**
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
 */function mn(n,e){K(typeof n=="string"||typeof n>"u","internal-error",{appName:e})}class Yt{constructor(e){var{uid:t,auth:s,stsTokenManager:i}=e,r=Dc(e,["uid","auth","stsTokenManager"]);this.providerId="firebase",this.proactiveRefresh=new WE(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=t,this.auth=s,this.stsTokenManager=i,this.accessToken=i.accessToken,this.displayName=r.displayName||null,this.email=r.email||null,this.emailVerified=r.emailVerified||!1,this.phoneNumber=r.phoneNumber||null,this.photoURL=r.photoURL||null,this.isAnonymous=r.isAnonymous||!1,this.tenantId=r.tenantId||null,this.providerData=r.providerData?[...r.providerData]:[],this.metadata=new Gl(r.createdAt||void 0,r.lastLoginAt||void 0)}async getIdToken(e){const t=await Ji(this,this.stsTokenManager.getToken(this.auth,e));return K(t,this.auth,"internal-error"),this.accessToken!==t&&(this.accessToken=t,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),t}getIdTokenResult(e){return UE(this,e)}reload(){return $E(this)}_assign(e){this!==e&&(K(this.uid===e.uid,this.auth,"internal-error"),this.displayName=e.displayName,this.photoURL=e.photoURL,this.email=e.email,this.emailVerified=e.emailVerified,this.phoneNumber=e.phoneNumber,this.isAnonymous=e.isAnonymous,this.tenantId=e.tenantId,this.providerData=e.providerData.map(t=>Object.assign({},t)),this.metadata._copy(e.metadata),this.stsTokenManager._assign(e.stsTokenManager))}_clone(e){const t=new Yt(Object.assign(Object.assign({},this),{auth:e,stsTokenManager:this.stsTokenManager._clone()}));return t.metadata._copy(this.metadata),t}_onReload(e){K(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=e,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(e){this.reloadListener?this.reloadListener(e):this.reloadUserInfo=e}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(e,t=!1){let s=!1;e.idToken&&e.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(e),s=!0),t&&await Do(this),await this.auth._persistUserIfCurrent(this),s&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(Kt(this.auth.app))return Promise.reject(Qn(this.auth));const e=await this.getIdToken();return await Ji(this,BE(this.auth,{idToken:e})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return Object.assign(Object.assign({uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(e=>Object.assign({},e)),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId},this.metadata.toJSON()),{apiKey:this.auth.config.apiKey,appName:this.auth.name})}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(e,t){var s,i,r,o,l,c,h,d;const p=(s=t.displayName)!==null&&s!==void 0?s:void 0,m=(i=t.email)!==null&&i!==void 0?i:void 0,E=(r=t.phoneNumber)!==null&&r!==void 0?r:void 0,R=(o=t.photoURL)!==null&&o!==void 0?o:void 0,A=(l=t.tenantId)!==null&&l!==void 0?l:void 0,P=(c=t._redirectEventId)!==null&&c!==void 0?c:void 0,V=(h=t.createdAt)!==null&&h!==void 0?h:void 0,U=(d=t.lastLoginAt)!==null&&d!==void 0?d:void 0,{uid:q,emailVerified:J,isAnonymous:ye,providerData:ue,stsTokenManager:I}=t;K(q&&I,e,"internal-error");const _=ks.fromJSON(this.name,I);K(typeof q=="string",e,"internal-error"),mn(p,e.name),mn(m,e.name),K(typeof J=="boolean",e,"internal-error"),K(typeof ye=="boolean",e,"internal-error"),mn(E,e.name),mn(R,e.name),mn(A,e.name),mn(P,e.name),mn(V,e.name),mn(U,e.name);const y=new Yt({uid:q,auth:e,email:m,emailVerified:J,displayName:p,isAnonymous:ye,photoURL:R,phoneNumber:E,tenantId:A,stsTokenManager:_,createdAt:V,lastLoginAt:U});return ue&&Array.isArray(ue)&&(y.providerData=ue.map(w=>Object.assign({},w))),P&&(y._redirectEventId=P),y}static async _fromIdTokenResponse(e,t,s=!1){const i=new ks;i.updateFromServerResponse(t);const r=new Yt({uid:t.localId,auth:e,stsTokenManager:i,isAnonymous:s});return await Do(r),r}static async _fromGetAccountInfoResponse(e,t,s){const i=t.users[0];K(i.localId!==void 0,"internal-error");const r=i.providerUserInfo!==void 0?Kp(i.providerUserInfo):[],o=!(i.email&&i.passwordHash)&&!(r!=null&&r.length),l=new ks;l.updateFromIdToken(s);const c=new Yt({uid:i.localId,auth:e,stsTokenManager:l,isAnonymous:o}),h={uid:i.localId,displayName:i.displayName||null,photoURL:i.photoUrl||null,email:i.email||null,emailVerified:i.emailVerified||!1,phoneNumber:i.phoneNumber||null,tenantId:i.tenantId||null,providerData:r,metadata:new Gl(i.createdAt,i.lastLoginAt),isAnonymous:!(i.email&&i.passwordHash)&&!(r!=null&&r.length)};return Object.assign(c,h),c}}/**
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
 */const Cd=new Map;function Jt(n){tn(n instanceof Function,"Expected a class definition");let e=Cd.get(n);return e?(tn(e instanceof n,"Instance stored in cache mismatched with class"),e):(e=new n,Cd.set(n,e),e)}/**
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
 */class Qp{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(e,t){this.storage[e]=t}async _get(e){const t=this.storage[e];return t===void 0?null:t}async _remove(e){delete this.storage[e]}_addListener(e,t){}_removeListener(e,t){}}Qp.type="NONE";const Rd=Qp;/**
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
 */function uo(n,e,t){return`firebase:${n}:${e}:${t}`}class Ps{constructor(e,t,s){this.persistence=e,this.auth=t,this.userKey=s;const{config:i,name:r}=this.auth;this.fullUserKey=uo(this.userKey,i.apiKey,r),this.fullPersistenceKey=uo("persistence",i.apiKey,r),this.boundEventHandler=t._onStorageEvent.bind(t),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(e){return this.persistence._set(this.fullUserKey,e.toJSON())}async getCurrentUser(){const e=await this.persistence._get(this.fullUserKey);return e?Yt._fromJSON(this.auth,e):null}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(e){if(this.persistence===e)return;const t=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=e,t)return this.setCurrentUser(t)}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(e,t,s="authUser"){if(!t.length)return new Ps(Jt(Rd),e,s);const i=(await Promise.all(t.map(async h=>{if(await h._isAvailable())return h}))).filter(h=>h);let r=i[0]||Jt(Rd);const o=uo(s,e.config.apiKey,e.name);let l=null;for(const h of t)try{const d=await h._get(o);if(d){const p=Yt._fromJSON(e,d);h!==r&&(l=p),r=h;break}}catch{}const c=i.filter(h=>h._shouldAllowMigration);return!r._shouldAllowMigration||!c.length?new Ps(r,e,s):(r=c[0],l&&await r._set(o,l.toJSON()),await Promise.all(t.map(async h=>{if(h!==r)try{await h._remove(o)}catch{}})),new Ps(r,e,s))}}/**
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
 */function Sd(n){const e=n.toLowerCase();if(e.includes("opera/")||e.includes("opr/")||e.includes("opios/"))return"Opera";if(Zp(e))return"IEMobile";if(e.includes("msie")||e.includes("trident/"))return"IE";if(e.includes("edge/"))return"Edge";if(Yp(e))return"Firefox";if(e.includes("silk/"))return"Silk";if(tm(e))return"Blackberry";if(nm(e))return"Webos";if(Jp(e))return"Safari";if((e.includes("chrome/")||Xp(e))&&!e.includes("edge/"))return"Chrome";if(em(e))return"Android";{const t=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,s=n.match(t);if((s==null?void 0:s.length)===2)return s[1]}return"Other"}function Yp(n=Ze()){return/firefox\//i.test(n)}function Jp(n=Ze()){const e=n.toLowerCase();return e.includes("safari/")&&!e.includes("chrome/")&&!e.includes("crios/")&&!e.includes("android")}function Xp(n=Ze()){return/crios\//i.test(n)}function Zp(n=Ze()){return/iemobile/i.test(n)}function em(n=Ze()){return/android/i.test(n)}function tm(n=Ze()){return/blackberry/i.test(n)}function nm(n=Ze()){return/webos/i.test(n)}function Fc(n=Ze()){return/iphone|ipad|ipod/i.test(n)||/macintosh/i.test(n)&&/mobile/i.test(n)}function HE(n=Ze()){var e;return Fc(n)&&!!(!((e=window.navigator)===null||e===void 0)&&e.standalone)}function KE(){return rv()&&document.documentMode===10}function sm(n=Ze()){return Fc(n)||em(n)||nm(n)||tm(n)||/windows phone/i.test(n)||Zp(n)}/**
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
 */function im(n,e=[]){let t;switch(n){case"Browser":t=Sd(Ze());break;case"Worker":t=`${Sd(Ze())}-${n}`;break;default:t=n}const s=e.length?e.join(","):"FirebaseCore-web";return`${t}/JsCore/${as}/${s}`}/**
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
 */class QE{constructor(e){this.auth=e,this.queue=[]}pushCallback(e,t){const s=r=>new Promise((o,l)=>{try{const c=e(r);o(c)}catch(c){l(c)}});s.onAbort=t,this.queue.push(s);const i=this.queue.length-1;return()=>{this.queue[i]=()=>Promise.resolve()}}async runMiddleware(e){if(this.auth.currentUser===e)return;const t=[];try{for(const s of this.queue)await s(e),s.onAbort&&t.push(s.onAbort)}catch(s){t.reverse();for(const i of t)try{i()}catch{}throw this.auth._errorFactory.create("login-blocked",{originalMessage:s==null?void 0:s.message})}}}/**
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
 */async function YE(n,e={}){return Js(n,"GET","/v2/passwordPolicy",Mc(n,e))}/**
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
 */const JE=6;class XE{constructor(e){var t,s,i,r;const o=e.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=(t=o.minPasswordLength)!==null&&t!==void 0?t:JE,o.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=o.maxPasswordLength),o.containsLowercaseCharacter!==void 0&&(this.customStrengthOptions.containsLowercaseLetter=o.containsLowercaseCharacter),o.containsUppercaseCharacter!==void 0&&(this.customStrengthOptions.containsUppercaseLetter=o.containsUppercaseCharacter),o.containsNumericCharacter!==void 0&&(this.customStrengthOptions.containsNumericCharacter=o.containsNumericCharacter),o.containsNonAlphanumericCharacter!==void 0&&(this.customStrengthOptions.containsNonAlphanumericCharacter=o.containsNonAlphanumericCharacter),this.enforcementState=e.enforcementState,this.enforcementState==="ENFORCEMENT_STATE_UNSPECIFIED"&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=(i=(s=e.allowedNonAlphanumericCharacters)===null||s===void 0?void 0:s.join(""))!==null&&i!==void 0?i:"",this.forceUpgradeOnSignin=(r=e.forceUpgradeOnSignin)!==null&&r!==void 0?r:!1,this.schemaVersion=e.schemaVersion}validatePassword(e){var t,s,i,r,o,l;const c={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(e,c),this.validatePasswordCharacterOptions(e,c),c.isValid&&(c.isValid=(t=c.meetsMinPasswordLength)!==null&&t!==void 0?t:!0),c.isValid&&(c.isValid=(s=c.meetsMaxPasswordLength)!==null&&s!==void 0?s:!0),c.isValid&&(c.isValid=(i=c.containsLowercaseLetter)!==null&&i!==void 0?i:!0),c.isValid&&(c.isValid=(r=c.containsUppercaseLetter)!==null&&r!==void 0?r:!0),c.isValid&&(c.isValid=(o=c.containsNumericCharacter)!==null&&o!==void 0?o:!0),c.isValid&&(c.isValid=(l=c.containsNonAlphanumericCharacter)!==null&&l!==void 0?l:!0),c}validatePasswordLengthOptions(e,t){const s=this.customStrengthOptions.minPasswordLength,i=this.customStrengthOptions.maxPasswordLength;s&&(t.meetsMinPasswordLength=e.length>=s),i&&(t.meetsMaxPasswordLength=e.length<=i)}validatePasswordCharacterOptions(e,t){this.updatePasswordCharacterOptionsStatuses(t,!1,!1,!1,!1);let s;for(let i=0;i<e.length;i++)s=e.charAt(i),this.updatePasswordCharacterOptionsStatuses(t,s>="a"&&s<="z",s>="A"&&s<="Z",s>="0"&&s<="9",this.allowedNonAlphanumericCharacters.includes(s))}updatePasswordCharacterOptionsStatuses(e,t,s,i,r){this.customStrengthOptions.containsLowercaseLetter&&(e.containsLowercaseLetter||(e.containsLowercaseLetter=t)),this.customStrengthOptions.containsUppercaseLetter&&(e.containsUppercaseLetter||(e.containsUppercaseLetter=s)),this.customStrengthOptions.containsNumericCharacter&&(e.containsNumericCharacter||(e.containsNumericCharacter=i)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(e.containsNonAlphanumericCharacter||(e.containsNonAlphanumericCharacter=r))}}/**
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
 */class ZE{constructor(e,t,s,i){this.app=e,this.heartbeatServiceProvider=t,this.appCheckServiceProvider=s,this.config=i,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new Ad(this),this.idTokenSubscription=new Ad(this),this.beforeStateQueue=new QE(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=$p,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=e.name,this.clientVersion=i.sdkClientVersion}_initializeWithPersistence(e,t){return t&&(this._popupRedirectResolver=Jt(t)),this._initializationPromise=this.queue(async()=>{var s,i;if(!this._deleted&&(this.persistenceManager=await Ps.create(this,e),!this._deleted)){if(!((s=this._popupRedirectResolver)===null||s===void 0)&&s._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch{}await this.initializeCurrentUser(t),this.lastNotifiedUid=((i=this.currentUser)===null||i===void 0?void 0:i.uid)||null,!this._deleted&&(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;const e=await this.assertedPersistence.getCurrentUser();if(!(!this.currentUser&&!e)){if(this.currentUser&&e&&this.currentUser.uid===e.uid){this._currentUser._assign(e),await this.currentUser.getIdToken();return}await this._updateCurrentUser(e,!0)}}async initializeCurrentUserFromIdToken(e){try{const t=await Hp(this,{idToken:e}),s=await Yt._fromGetAccountInfoResponse(this,t,e);await this.directlySetCurrentUser(s)}catch(t){console.warn("FirebaseServerApp could not login user with provided authIdToken: ",t),await this.directlySetCurrentUser(null)}}async initializeCurrentUser(e){var t;if(Kt(this.app)){const o=this.app.settings.authIdToken;return o?new Promise(l=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(o).then(l,l))}):this.directlySetCurrentUser(null)}const s=await this.assertedPersistence.getCurrentUser();let i=s,r=!1;if(e&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();const o=(t=this.redirectUser)===null||t===void 0?void 0:t._redirectEventId,l=i==null?void 0:i._redirectEventId,c=await this.tryRedirectSignIn(e);(!o||o===l)&&(c!=null&&c.user)&&(i=c.user,r=!0)}if(!i)return this.directlySetCurrentUser(null);if(!i._redirectEventId){if(r)try{await this.beforeStateQueue.runMiddleware(i)}catch(o){i=s,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(o))}return i?this.reloadAndSetCurrentUserOrClear(i):this.directlySetCurrentUser(null)}return K(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===i._redirectEventId?this.directlySetCurrentUser(i):this.reloadAndSetCurrentUserOrClear(i)}async tryRedirectSignIn(e){let t=null;try{t=await this._popupRedirectResolver._completeRedirectFn(this,e,!0)}catch{await this._setRedirectUser(null)}return t}async reloadAndSetCurrentUserOrClear(e){try{await Do(e)}catch(t){if((t==null?void 0:t.code)!=="auth/network-request-failed")return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)}useDeviceLanguage(){this.languageCode=xE()}async _delete(){this._deleted=!0}async updateCurrentUser(e){if(Kt(this.app))return Promise.reject(Qn(this));const t=e?me(e):null;return t&&K(t.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(t&&t._clone(this))}async _updateCurrentUser(e,t=!1){if(!this._deleted)return e&&K(this.tenantId===e.tenantId,this,"tenant-id-mismatch"),t||await this.beforeStateQueue.runMiddleware(e),this.queue(async()=>{await this.directlySetCurrentUser(e),this.notifyAuthListeners()})}async signOut(){return Kt(this.app)?Promise.reject(Qn(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(e){return Kt(this.app)?Promise.reject(Qn(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(Jt(e))})}_getRecaptchaConfig(){return this.tenantId==null?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(e){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();const t=this._getPasswordPolicyInternal();return t.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):t.validatePassword(e)}_getPasswordPolicyInternal(){return this.tenantId===null?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){const e=await YE(this),t=new XE(e);this.tenantId===null?this._projectPasswordPolicy=t:this._tenantPasswordPolicies[this.tenantId]=t}_getPersistence(){return this.assertedPersistence.persistence.type}_updateErrorMap(e){this._errorFactory=new fr("auth","Firebase",e())}onAuthStateChanged(e,t,s){return this.registerStateListener(this.authStateSubscription,e,t,s)}beforeAuthStateChanged(e,t){return this.beforeStateQueue.pushCallback(e,t)}onIdTokenChanged(e,t,s){return this.registerStateListener(this.idTokenSubscription,e,t,s)}authStateReady(){return new Promise((e,t)=>{if(this.currentUser)e();else{const s=this.onAuthStateChanged(()=>{s(),e()},t)}})}async revokeAccessToken(e){if(this.currentUser){const t=await this.currentUser.getIdToken(),s={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:e,idToken:t};this.tenantId!=null&&(s.tenantId=this.tenantId),await zE(this,s)}}toJSON(){var e;return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:(e=this._currentUser)===null||e===void 0?void 0:e.toJSON()}}async _setRedirectUser(e,t){const s=await this.getOrInitRedirectPersistenceManager(t);return e===null?s.removeCurrentUser():s.setCurrentUser(e)}async getOrInitRedirectPersistenceManager(e){if(!this.redirectPersistenceManager){const t=e&&Jt(e)||this._popupRedirectResolver;K(t,this,"argument-error"),this.redirectPersistenceManager=await Ps.create(this,[Jt(t._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(e){var t,s;return this._isInitialized&&await this.queue(async()=>{}),((t=this._currentUser)===null||t===void 0?void 0:t._redirectEventId)===e?this._currentUser:((s=this.redirectUser)===null||s===void 0?void 0:s._redirectEventId)===e?this.redirectUser:null}async _persistUserIfCurrent(e){if(e===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(e))}_notifyListenersIfCurrent(e){e===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){var e,t;if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);const s=(t=(e=this.currentUser)===null||e===void 0?void 0:e.uid)!==null&&t!==void 0?t:null;this.lastNotifiedUid!==s&&(this.lastNotifiedUid=s,this.authStateSubscription.next(this.currentUser))}registerStateListener(e,t,s,i){if(this._deleted)return()=>{};const r=typeof t=="function"?t:t.next.bind(t);let o=!1;const l=this._isInitialized?Promise.resolve():this._initializationPromise;if(K(l,this,"internal-error"),l.then(()=>{o||r(this.currentUser)}),typeof t=="function"){const c=e.addObserver(t,s,i);return()=>{o=!0,c()}}else{const c=e.addObserver(t);return()=>{o=!0,c()}}}async directlySetCurrentUser(e){this.currentUser&&this.currentUser!==e&&this._currentUser._stopProactiveRefresh(),e&&this.isProactiveRefreshEnabled&&e._startProactiveRefresh(),this.currentUser=e,e?await this.assertedPersistence.setCurrentUser(e):await this.assertedPersistence.removeCurrentUser()}queue(e){return this.operations=this.operations.then(e,e),this.operations}get assertedPersistence(){return K(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(e){!e||this.frameworks.includes(e)||(this.frameworks.push(e),this.frameworks.sort(),this.clientVersion=im(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){var e;const t={"X-Client-Version":this.clientVersion};this.app.options.appId&&(t["X-Firebase-gmpid"]=this.app.options.appId);const s=await((e=this.heartbeatServiceProvider.getImmediate({optional:!0}))===null||e===void 0?void 0:e.getHeartbeatsHeader());s&&(t["X-Firebase-Client"]=s);const i=await this._getAppCheckToken();return i&&(t["X-Firebase-AppCheck"]=i),t}async _getAppCheckToken(){var e;const t=await((e=this.appCheckServiceProvider.getImmediate({optional:!0}))===null||e===void 0?void 0:e.getToken());return t!=null&&t.error&&PE(`Error while retrieving App Check token: ${t.error}`),t==null?void 0:t.token}}function da(n){return me(n)}class Ad{constructor(e){this.auth=e,this.observer=null,this.addObserver=gv(t=>this.observer=t)}get next(){return K(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}/**
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
 */let Bc={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function ew(n){Bc=n}function tw(n){return Bc.loadJS(n)}function nw(){return Bc.gapiScript}function sw(n){return`__${n}${Math.floor(Math.random()*1e6)}`}/**
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
 */function iw(n,e){const t=ua(n,"auth");if(t.isInitialized()){const i=t.getImmediate(),r=t.getOptions();if(ko(r,e??{}))return i;Ot(i,"already-initialized")}return t.initialize({options:e})}function rw(n,e){const t=(e==null?void 0:e.persistence)||[],s=(Array.isArray(t)?t:[t]).map(Jt);e!=null&&e.errorMap&&n._updateErrorMap(e.errorMap),n._initializeWithPersistence(s,e==null?void 0:e.popupRedirectResolver)}function ow(n,e,t){const s=da(n);K(s._canInitEmulator,s,"emulator-config-failed"),K(/^https?:\/\//.test(e),s,"invalid-emulator-scheme");const i=!1,r=rm(e),{host:o,port:l}=aw(e),c=l===null?"":`:${l}`;s.config.emulator={url:`${r}//${o}${c}/`},s.settings.appVerificationDisabledForTesting=!0,s.emulatorConfig=Object.freeze({host:o,port:l,protocol:r.replace(":",""),options:Object.freeze({disableWarnings:i})}),lw()}function rm(n){const e=n.indexOf(":");return e<0?"":n.substr(0,e+1)}function aw(n){const e=rm(n),t=/(\/\/)?([^?#/]+)/.exec(n.substr(e.length));if(!t)return{host:"",port:null};const s=t[2].split("@").pop()||"",i=/^(\[[^\]]+\])(:|$)/.exec(s);if(i){const r=i[1];return{host:r,port:kd(s.substr(r.length+1))}}else{const[r,o]=s.split(":");return{host:r,port:kd(o)}}}function kd(n){if(!n)return null;const e=Number(n);return isNaN(e)?null:e}function lw(){function n(){const e=document.createElement("p"),t=e.style;e.innerText="Running in emulator mode. Do not use with production credentials.",t.position="fixed",t.width="100%",t.backgroundColor="#ffffff",t.border=".1em solid #000000",t.color="#b50000",t.bottom="0px",t.left="0px",t.margin="0px",t.zIndex="10000",t.textAlign="center",e.classList.add("firebase-emulator-warning"),document.body.appendChild(e)}typeof console<"u"&&typeof console.info=="function"&&console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials."),typeof window<"u"&&typeof document<"u"&&(document.readyState==="loading"?window.addEventListener("DOMContentLoaded",n):n())}/**
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
 */class om{constructor(e,t){this.providerId=e,this.signInMethod=t}toJSON(){return Qt("not implemented")}_getIdTokenResponse(e){return Qt("not implemented")}_linkToIdToken(e,t){return Qt("not implemented")}_getReauthenticationResolver(e){return Qt("not implemented")}}/**
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
 */async function Ns(n,e){return VE(n,"POST","/v1/accounts:signInWithIdp",Mc(n,e))}/**
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
 */const cw="http://localhost";class Zn extends om{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(e){const t=new Zn(e.providerId,e.signInMethod);return e.idToken||e.accessToken?(e.idToken&&(t.idToken=e.idToken),e.accessToken&&(t.accessToken=e.accessToken),e.nonce&&!e.pendingToken&&(t.nonce=e.nonce),e.pendingToken&&(t.pendingToken=e.pendingToken)):e.oauthToken&&e.oauthTokenSecret?(t.accessToken=e.oauthToken,t.secret=e.oauthTokenSecret):Ot("argument-error"),t}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(e){const t=typeof e=="string"?JSON.parse(e):e,{providerId:s,signInMethod:i}=t,r=Dc(t,["providerId","signInMethod"]);if(!s||!i)return null;const o=new Zn(s,i);return o.idToken=r.idToken||void 0,o.accessToken=r.accessToken||void 0,o.secret=r.secret,o.nonce=r.nonce,o.pendingToken=r.pendingToken||null,o}_getIdTokenResponse(e){const t=this.buildRequest();return Ns(e,t)}_linkToIdToken(e,t){const s=this.buildRequest();return s.idToken=t,Ns(e,s)}_getReauthenticationResolver(e){const t=this.buildRequest();return t.autoCreate=!1,Ns(e,t)}buildRequest(){const e={requestUri:cw,returnSecureToken:!0};if(this.pendingToken)e.pendingToken=this.pendingToken;else{const t={};this.idToken&&(t.id_token=this.idToken),this.accessToken&&(t.access_token=this.accessToken),this.secret&&(t.oauth_token_secret=this.secret),t.providerId=this.providerId,this.nonce&&!this.pendingToken&&(t.nonce=this.nonce),e.postBody=Ys(t)}return e}}/**
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
 */class Uc{constructor(e){this.providerId=e,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(e){this.defaultLanguageCode=e}setCustomParameters(e){return this.customParameters=e,this}getCustomParameters(){return this.customParameters}}/**
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
 */class mr extends Uc{constructor(){super(...arguments),this.scopes=[]}addScope(e){return this.scopes.includes(e)||this.scopes.push(e),this}getScopes(){return[...this.scopes]}}/**
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
 */class _n extends mr{constructor(){super("facebook.com")}static credential(e){return Zn._fromParams({providerId:_n.PROVIDER_ID,signInMethod:_n.FACEBOOK_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return _n.credentialFromTaggedObject(e)}static credentialFromError(e){return _n.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return _n.credential(e.oauthAccessToken)}catch{return null}}}_n.FACEBOOK_SIGN_IN_METHOD="facebook.com";_n.PROVIDER_ID="facebook.com";/**
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
 */class Ht extends mr{constructor(){super("google.com"),this.addScope("profile")}static credential(e,t){return Zn._fromParams({providerId:Ht.PROVIDER_ID,signInMethod:Ht.GOOGLE_SIGN_IN_METHOD,idToken:e,accessToken:t})}static credentialFromResult(e){return Ht.credentialFromTaggedObject(e)}static credentialFromError(e){return Ht.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthIdToken:t,oauthAccessToken:s}=e;if(!t&&!s)return null;try{return Ht.credential(t,s)}catch{return null}}}Ht.GOOGLE_SIGN_IN_METHOD="google.com";Ht.PROVIDER_ID="google.com";/**
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
 */class yn extends mr{constructor(){super("github.com")}static credential(e){return Zn._fromParams({providerId:yn.PROVIDER_ID,signInMethod:yn.GITHUB_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return yn.credentialFromTaggedObject(e)}static credentialFromError(e){return yn.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return yn.credential(e.oauthAccessToken)}catch{return null}}}yn.GITHUB_SIGN_IN_METHOD="github.com";yn.PROVIDER_ID="github.com";/**
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
 */class vn extends mr{constructor(){super("twitter.com")}static credential(e,t){return Zn._fromParams({providerId:vn.PROVIDER_ID,signInMethod:vn.TWITTER_SIGN_IN_METHOD,oauthToken:e,oauthTokenSecret:t})}static credentialFromResult(e){return vn.credentialFromTaggedObject(e)}static credentialFromError(e){return vn.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthAccessToken:t,oauthTokenSecret:s}=e;if(!t||!s)return null;try{return vn.credential(t,s)}catch{return null}}}vn.TWITTER_SIGN_IN_METHOD="twitter.com";vn.PROVIDER_ID="twitter.com";/**
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
 */class Ms{constructor(e){this.user=e.user,this.providerId=e.providerId,this._tokenResponse=e._tokenResponse,this.operationType=e.operationType}static async _fromIdTokenResponse(e,t,s,i=!1){const r=await Yt._fromIdTokenResponse(e,s,i),o=Pd(s);return new Ms({user:r,providerId:o,_tokenResponse:s,operationType:t})}static async _forOperation(e,t,s){await e._updateTokensIfNecessary(s,!0);const i=Pd(s);return new Ms({user:e,providerId:i,_tokenResponse:s,operationType:t})}}function Pd(n){return n.providerId?n.providerId:"phoneNumber"in n?"phone":null}/**
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
 */class Lo extends on{constructor(e,t,s,i){var r;super(t.code,t.message),this.operationType=s,this.user=i,Object.setPrototypeOf(this,Lo.prototype),this.customData={appName:e.name,tenantId:(r=e.tenantId)!==null&&r!==void 0?r:void 0,_serverResponse:t.customData._serverResponse,operationType:s}}static _fromErrorAndOperation(e,t,s,i){return new Lo(e,t,s,i)}}function am(n,e,t,s){return(e==="reauthenticate"?t._getReauthenticationResolver(n):t._getIdTokenResponse(n)).catch(r=>{throw r.code==="auth/multi-factor-auth-required"?Lo._fromErrorAndOperation(n,r,e,s):r})}async function hw(n,e,t=!1){const s=await Ji(n,e._linkToIdToken(n.auth,await n.getIdToken()),t);return Ms._forOperation(n,"link",s)}/**
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
 */async function uw(n,e,t=!1){const{auth:s}=n;if(Kt(s.app))return Promise.reject(Qn(s));const i="reauthenticate";try{const r=await Ji(n,am(s,i,e,n),t);K(r.idToken,s,"internal-error");const o=Vc(r.idToken);K(o,s,"internal-error");const{sub:l}=o;return K(n.uid===l,s,"user-mismatch"),Ms._forOperation(n,i,r)}catch(r){throw(r==null?void 0:r.code)==="auth/user-not-found"&&Ot(s,"user-mismatch"),r}}/**
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
 */async function dw(n,e,t=!1){if(Kt(n.app))return Promise.reject(Qn(n));const s="signIn",i=await am(n,s,e),r=await Ms._fromIdTokenResponse(n,s,i);return t||await n._updateCurrentUser(r.user),r}function fw(n,e,t,s){return me(n).onIdTokenChanged(e,t,s)}function pw(n,e,t){return me(n).beforeAuthStateChanged(e,t)}function mw(n,e,t,s){return me(n).onAuthStateChanged(e,t,s)}function gw(n){return me(n).signOut()}const xo="__sak";/**
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
 */class lm{constructor(e,t){this.storageRetriever=e,this.type=t}_isAvailable(){try{return this.storage?(this.storage.setItem(xo,"1"),this.storage.removeItem(xo),Promise.resolve(!0)):Promise.resolve(!1)}catch{return Promise.resolve(!1)}}_set(e,t){return this.storage.setItem(e,JSON.stringify(t)),Promise.resolve()}_get(e){const t=this.storage.getItem(e);return Promise.resolve(t?JSON.parse(t):null)}_remove(e){return this.storage.removeItem(e),Promise.resolve()}get storage(){return this.storageRetriever()}}/**
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
 */const _w=1e3,yw=10;class cm extends lm{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(e,t)=>this.onStorageEvent(e,t),this.listeners={},this.localCache={},this.pollTimer=null,this.fallbackToPolling=sm(),this._shouldAllowMigration=!0}forAllChangedKeys(e){for(const t of Object.keys(this.listeners)){const s=this.storage.getItem(t),i=this.localCache[t];s!==i&&e(t,i,s)}}onStorageEvent(e,t=!1){if(!e.key){this.forAllChangedKeys((o,l,c)=>{this.notifyListeners(o,c)});return}const s=e.key;t?this.detachListener():this.stopPolling();const i=()=>{const o=this.storage.getItem(s);!t&&this.localCache[s]===o||this.notifyListeners(s,o)},r=this.storage.getItem(s);KE()&&r!==e.newValue&&e.newValue!==e.oldValue?setTimeout(i,yw):i()}notifyListeners(e,t){this.localCache[e]=t;const s=this.listeners[e];if(s)for(const i of Array.from(s))i(t&&JSON.parse(t))}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((e,t,s)=>{this.onStorageEvent(new StorageEvent("storage",{key:e,oldValue:t,newValue:s}),!0)})},_w)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(e,t){Object.keys(this.listeners).length===0&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[e]||(this.listeners[e]=new Set,this.localCache[e]=this.storage.getItem(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.detachListener(),this.stopPolling())}async _set(e,t){await super._set(e,t),this.localCache[e]=JSON.stringify(t)}async _get(e){const t=await super._get(e);return this.localCache[e]=JSON.stringify(t),t}async _remove(e){await super._remove(e),delete this.localCache[e]}}cm.type="LOCAL";const vw=cm;/**
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
 */class hm extends lm{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(e,t){}_removeListener(e,t){}}hm.type="SESSION";const um=hm;/**
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
 */function Ew(n){return Promise.all(n.map(async e=>{try{return{fulfilled:!0,value:await e}}catch(t){return{fulfilled:!1,reason:t}}}))}/**
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
 */class fa{constructor(e){this.eventTarget=e,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(e){const t=this.receivers.find(i=>i.isListeningto(e));if(t)return t;const s=new fa(e);return this.receivers.push(s),s}isListeningto(e){return this.eventTarget===e}async handleEvent(e){const t=e,{eventId:s,eventType:i,data:r}=t.data,o=this.handlersMap[i];if(!(o!=null&&o.size))return;t.ports[0].postMessage({status:"ack",eventId:s,eventType:i});const l=Array.from(o).map(async h=>h(t.origin,r)),c=await Ew(l);t.ports[0].postMessage({status:"done",eventId:s,eventType:i,response:c})}_subscribe(e,t){Object.keys(this.handlersMap).length===0&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[e]||(this.handlersMap[e]=new Set),this.handlersMap[e].add(t)}_unsubscribe(e,t){this.handlersMap[e]&&t&&this.handlersMap[e].delete(t),(!t||this.handlersMap[e].size===0)&&delete this.handlersMap[e],Object.keys(this.handlersMap).length===0&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}}fa.receivers=[];/**
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
 */function qc(n="",e=10){let t="";for(let s=0;s<e;s++)t+=Math.floor(Math.random()*10);return n+t}/**
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
 */class ww{constructor(e){this.target=e,this.handlers=new Set}removeMessageHandler(e){e.messageChannel&&(e.messageChannel.port1.removeEventListener("message",e.onMessage),e.messageChannel.port1.close()),this.handlers.delete(e)}async _send(e,t,s=50){const i=typeof MessageChannel<"u"?new MessageChannel:null;if(!i)throw new Error("connection_unavailable");let r,o;return new Promise((l,c)=>{const h=qc("",20);i.port1.start();const d=setTimeout(()=>{c(new Error("unsupported_event"))},s);o={messageChannel:i,onMessage(p){const m=p;if(m.data.eventId===h)switch(m.data.status){case"ack":clearTimeout(d),r=setTimeout(()=>{c(new Error("timeout"))},3e3);break;case"done":clearTimeout(r),l(m.data.response);break;default:clearTimeout(d),clearTimeout(r),c(new Error("invalid_response"));break}}},this.handlers.add(o),i.port1.addEventListener("message",o.onMessage),this.target.postMessage({eventType:e,eventId:h,data:t},[i.port2])}).finally(()=>{o&&this.removeMessageHandler(o)})}}/**
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
 */function Dt(){return window}function Tw(n){Dt().location.href=n}/**
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
 */function dm(){return typeof Dt().WorkerGlobalScope<"u"&&typeof Dt().importScripts=="function"}async function Iw(){if(!(navigator!=null&&navigator.serviceWorker))return null;try{return(await navigator.serviceWorker.ready).active}catch{return null}}function bw(){var n;return((n=navigator==null?void 0:navigator.serviceWorker)===null||n===void 0?void 0:n.controller)||null}function Cw(){return dm()?self:null}/**
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
 */const fm="firebaseLocalStorageDb",Rw=1,Oo="firebaseLocalStorage",pm="fbase_key";class gr{constructor(e){this.request=e}toPromise(){return new Promise((e,t)=>{this.request.addEventListener("success",()=>{e(this.request.result)}),this.request.addEventListener("error",()=>{t(this.request.error)})})}}function pa(n,e){return n.transaction([Oo],e?"readwrite":"readonly").objectStore(Oo)}function Sw(){const n=indexedDB.deleteDatabase(fm);return new gr(n).toPromise()}function zl(){const n=indexedDB.open(fm,Rw);return new Promise((e,t)=>{n.addEventListener("error",()=>{t(n.error)}),n.addEventListener("upgradeneeded",()=>{const s=n.result;try{s.createObjectStore(Oo,{keyPath:pm})}catch(i){t(i)}}),n.addEventListener("success",async()=>{const s=n.result;s.objectStoreNames.contains(Oo)?e(s):(s.close(),await Sw(),e(await zl()))})})}async function Nd(n,e,t){const s=pa(n,!0).put({[pm]:e,value:t});return new gr(s).toPromise()}async function Aw(n,e){const t=pa(n,!1).get(e),s=await new gr(t).toPromise();return s===void 0?null:s.value}function Dd(n,e){const t=pa(n,!0).delete(e);return new gr(t).toPromise()}const kw=800,Pw=3;class mm{constructor(){this.type="LOCAL",this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){return this.db?this.db:(this.db=await zl(),this.db)}async _withRetries(e){let t=0;for(;;)try{const s=await this._openDb();return await e(s)}catch(s){if(t++>Pw)throw s;this.db&&(this.db.close(),this.db=void 0)}}async initializeServiceWorkerMessaging(){return dm()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=fa._getInstance(Cw()),this.receiver._subscribe("keyChanged",async(e,t)=>({keyProcessed:(await this._poll()).includes(t.key)})),this.receiver._subscribe("ping",async(e,t)=>["keyChanged"])}async initializeSender(){var e,t;if(this.activeServiceWorker=await Iw(),!this.activeServiceWorker)return;this.sender=new ww(this.activeServiceWorker);const s=await this.sender._send("ping",{},800);s&&!((e=s[0])===null||e===void 0)&&e.fulfilled&&!((t=s[0])===null||t===void 0)&&t.value.includes("keyChanged")&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(e){if(!(!this.sender||!this.activeServiceWorker||bw()!==this.activeServiceWorker))try{await this.sender._send("keyChanged",{key:e},this.serviceWorkerReceiverAvailable?800:50)}catch{}}async _isAvailable(){try{if(!indexedDB)return!1;const e=await zl();return await Nd(e,xo,"1"),await Dd(e,xo),!0}catch{}return!1}async _withPendingWrite(e){this.pendingWrites++;try{await e()}finally{this.pendingWrites--}}async _set(e,t){return this._withPendingWrite(async()=>(await this._withRetries(s=>Nd(s,e,t)),this.localCache[e]=t,this.notifyServiceWorker(e)))}async _get(e){const t=await this._withRetries(s=>Aw(s,e));return this.localCache[e]=t,t}async _remove(e){return this._withPendingWrite(async()=>(await this._withRetries(t=>Dd(t,e)),delete this.localCache[e],this.notifyServiceWorker(e)))}async _poll(){const e=await this._withRetries(i=>{const r=pa(i,!1).getAll();return new gr(r).toPromise()});if(!e)return[];if(this.pendingWrites!==0)return[];const t=[],s=new Set;if(e.length!==0)for(const{fbase_key:i,value:r}of e)s.add(i),JSON.stringify(this.localCache[i])!==JSON.stringify(r)&&(this.notifyListeners(i,r),t.push(i));for(const i of Object.keys(this.localCache))this.localCache[i]&&!s.has(i)&&(this.notifyListeners(i,null),t.push(i));return t}notifyListeners(e,t){this.localCache[e]=t;const s=this.listeners[e];if(s)for(const i of Array.from(s))i(t)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),kw)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(e,t){Object.keys(this.listeners).length===0&&this.startPolling(),this.listeners[e]||(this.listeners[e]=new Set,this._get(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&this.stopPolling()}}mm.type="LOCAL";const Nw=mm;new pr(3e4,6e4);/**
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
 */function gm(n,e){return e?Jt(e):(K(n._popupRedirectResolver,n,"argument-error"),n._popupRedirectResolver)}/**
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
 */class Wc extends om{constructor(e){super("custom","custom"),this.params=e}_getIdTokenResponse(e){return Ns(e,this._buildIdpRequest())}_linkToIdToken(e,t){return Ns(e,this._buildIdpRequest(t))}_getReauthenticationResolver(e){return Ns(e,this._buildIdpRequest())}_buildIdpRequest(e){const t={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return e&&(t.idToken=e),t}}function Dw(n){return dw(n.auth,new Wc(n),n.bypassAuthState)}function Lw(n){const{auth:e,user:t}=n;return K(t,e,"internal-error"),uw(t,new Wc(n),n.bypassAuthState)}async function xw(n){const{auth:e,user:t}=n;return K(t,e,"internal-error"),hw(t,new Wc(n),n.bypassAuthState)}/**
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
 */class _m{constructor(e,t,s,i,r=!1){this.auth=e,this.resolver=s,this.user=i,this.bypassAuthState=r,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(t)?t:[t]}execute(){return new Promise(async(e,t)=>{this.pendingPromise={resolve:e,reject:t};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(s){this.reject(s)}})}async onAuthEvent(e){const{urlResponse:t,sessionId:s,postBody:i,tenantId:r,error:o,type:l}=e;if(o){this.reject(o);return}const c={auth:this.auth,requestUri:t,sessionId:s,tenantId:r||void 0,postBody:i||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(l)(c))}catch(h){this.reject(h)}}onError(e){this.reject(e)}getIdpTask(e){switch(e){case"signInViaPopup":case"signInViaRedirect":return Dw;case"linkViaPopup":case"linkViaRedirect":return xw;case"reauthViaPopup":case"reauthViaRedirect":return Lw;default:Ot(this.auth,"internal-error")}}resolve(e){tn(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(e),this.unregisterAndCleanUp()}reject(e){tn(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(e),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}}/**
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
 */const Ow=new pr(2e3,1e4);async function Mw(n,e,t){if(Kt(n.app))return Promise.reject(Rt(n,"operation-not-supported-in-this-environment"));const s=da(n);NE(n,e,Uc);const i=gm(s,t);return new zn(s,"signInViaPopup",e,i).executeNotNull()}class zn extends _m{constructor(e,t,s,i,r){super(e,t,i,r),this.provider=s,this.authWindow=null,this.pollId=null,zn.currentPopupAction&&zn.currentPopupAction.cancel(),zn.currentPopupAction=this}async executeNotNull(){const e=await this.execute();return K(e,this.auth,"internal-error"),e}async onExecution(){tn(this.filter.length===1,"Popup operations only handle one event");const e=qc();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],e),this.authWindow.associatedEvent=e,this.resolver._originValidation(this.auth).catch(t=>{this.reject(t)}),this.resolver._isIframeWebStorageSupported(this.auth,t=>{t||this.reject(Rt(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){var e;return((e=this.authWindow)===null||e===void 0?void 0:e.associatedEvent)||null}cancel(){this.reject(Rt(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,zn.currentPopupAction=null}pollUserCancellation(){const e=()=>{var t,s;if(!((s=(t=this.authWindow)===null||t===void 0?void 0:t.window)===null||s===void 0)&&s.closed){this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(Rt(this.auth,"popup-closed-by-user"))},8e3);return}this.pollId=window.setTimeout(e,Ow.get())};e()}}zn.currentPopupAction=null;/**
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
 */const Vw="pendingRedirect",fo=new Map;class Fw extends _m{constructor(e,t,s=!1){super(e,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],t,void 0,s),this.eventId=null}async execute(){let e=fo.get(this.auth._key());if(!e){try{const s=await Bw(this.resolver,this.auth)?await super.execute():null;e=()=>Promise.resolve(s)}catch(t){e=()=>Promise.reject(t)}fo.set(this.auth._key(),e)}return this.bypassAuthState||fo.set(this.auth._key(),()=>Promise.resolve(null)),e()}async onAuthEvent(e){if(e.type==="signInViaRedirect")return super.onAuthEvent(e);if(e.type==="unknown"){this.resolve(null);return}if(e.eventId){const t=await this.auth._redirectUserForId(e.eventId);if(t)return this.user=t,super.onAuthEvent(e);this.resolve(null)}}async onExecution(){}cleanUp(){}}async function Bw(n,e){const t=Ww(e),s=qw(n);if(!await s._isAvailable())return!1;const i=await s._get(t)==="true";return await s._remove(t),i}function Uw(n,e){fo.set(n._key(),e)}function qw(n){return Jt(n._redirectPersistence)}function Ww(n){return uo(Vw,n.config.apiKey,n.name)}async function $w(n,e,t=!1){if(Kt(n.app))return Promise.reject(Qn(n));const s=da(n),i=gm(s,e),o=await new Fw(s,i,t).execute();return o&&!t&&(delete o.user._redirectEventId,await s._persistUserIfCurrent(o.user),await s._setRedirectUser(null,e)),o}/**
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
 */const jw=10*60*1e3;class Gw{constructor(e){this.auth=e,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(e){this.consumers.add(e),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,e)&&(this.sendToConsumer(this.queuedRedirectEvent,e),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(e){this.consumers.delete(e)}onEvent(e){if(this.hasEventBeenHandled(e))return!1;let t=!1;return this.consumers.forEach(s=>{this.isEventForConsumer(e,s)&&(t=!0,this.sendToConsumer(e,s),this.saveEventToCache(e))}),this.hasHandledPotentialRedirect||!zw(e)||(this.hasHandledPotentialRedirect=!0,t||(this.queuedRedirectEvent=e,t=!0)),t}sendToConsumer(e,t){var s;if(e.error&&!ym(e)){const i=((s=e.error.code)===null||s===void 0?void 0:s.split("auth/")[1])||"internal-error";t.onError(Rt(this.auth,i))}else t.onAuthEvent(e)}isEventForConsumer(e,t){const s=t.eventId===null||!!e.eventId&&e.eventId===t.eventId;return t.filter.includes(e.type)&&s}hasEventBeenHandled(e){return Date.now()-this.lastProcessedEventTime>=jw&&this.cachedEventUids.clear(),this.cachedEventUids.has(Ld(e))}saveEventToCache(e){this.cachedEventUids.add(Ld(e)),this.lastProcessedEventTime=Date.now()}}function Ld(n){return[n.type,n.eventId,n.sessionId,n.tenantId].filter(e=>e).join("-")}function ym({type:n,error:e}){return n==="unknown"&&(e==null?void 0:e.code)==="auth/no-auth-event"}function zw(n){switch(n.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return ym(n);default:return!1}}/**
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
 */async function Hw(n,e={}){return Js(n,"GET","/v1/projects",e)}/**
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
 */const Kw=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,Qw=/^https?/;async function Yw(n){if(n.config.emulator)return;const{authorizedDomains:e}=await Hw(n);for(const t of e)try{if(Jw(t))return}catch{}Ot(n,"unauthorized-domain")}function Jw(n){const e=jl(),{protocol:t,hostname:s}=new URL(e);if(n.startsWith("chrome-extension://")){const o=new URL(n);return o.hostname===""&&s===""?t==="chrome-extension:"&&n.replace("chrome-extension://","")===e.replace("chrome-extension://",""):t==="chrome-extension:"&&o.hostname===s}if(!Qw.test(t))return!1;if(Kw.test(n))return s===n;const i=n.replace(/\./g,"\\.");return new RegExp("^(.+\\."+i+"|"+i+")$","i").test(s)}/**
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
 */const Xw=new pr(3e4,6e4);function xd(){const n=Dt().___jsl;if(n!=null&&n.H){for(const e of Object.keys(n.H))if(n.H[e].r=n.H[e].r||[],n.H[e].L=n.H[e].L||[],n.H[e].r=[...n.H[e].L],n.CP)for(let t=0;t<n.CP.length;t++)n.CP[t]=null}}function Zw(n){return new Promise((e,t)=>{var s,i,r;function o(){xd(),gapi.load("gapi.iframes",{callback:()=>{e(gapi.iframes.getContext())},ontimeout:()=>{xd(),t(Rt(n,"network-request-failed"))},timeout:Xw.get()})}if(!((i=(s=Dt().gapi)===null||s===void 0?void 0:s.iframes)===null||i===void 0)&&i.Iframe)e(gapi.iframes.getContext());else if(!((r=Dt().gapi)===null||r===void 0)&&r.load)o();else{const l=sw("iframefcb");return Dt()[l]=()=>{gapi.load?o():t(Rt(n,"network-request-failed"))},tw(`${nw()}?onload=${l}`).catch(c=>t(c))}}).catch(e=>{throw po=null,e})}let po=null;function eT(n){return po=po||Zw(n),po}/**
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
 */const tT=new pr(5e3,15e3),nT="__/auth/iframe",sT="emulator/auth/iframe",iT={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},rT=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function oT(n){const e=n.config;K(e.authDomain,n,"auth-domain-config-required");const t=e.emulator?Oc(e,sT):`https://${n.config.authDomain}/${nT}`,s={apiKey:e.apiKey,appName:n.name,v:as},i=rT.get(n.config.apiHost);i&&(s.eid=i);const r=n._getFrameworks();return r.length&&(s.fw=r.join(",")),`${t}?${Ys(s).slice(1)}`}async function aT(n){const e=await eT(n),t=Dt().gapi;return K(t,n,"internal-error"),e.open({where:document.body,url:oT(n),messageHandlersFilter:t.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:iT,dontclear:!0},s=>new Promise(async(i,r)=>{await s.restyle({setHideOnLeave:!1});const o=Rt(n,"network-request-failed"),l=Dt().setTimeout(()=>{r(o)},tT.get());function c(){Dt().clearTimeout(l),i(s)}s.ping(c).then(c,()=>{r(o)})}))}/**
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
 */const lT={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"},cT=500,hT=600,uT="_blank",dT="http://localhost";class Od{constructor(e){this.window=e,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch{}}}function fT(n,e,t,s=cT,i=hT){const r=Math.max((window.screen.availHeight-i)/2,0).toString(),o=Math.max((window.screen.availWidth-s)/2,0).toString();let l="";const c=Object.assign(Object.assign({},lT),{width:s.toString(),height:i.toString(),top:r,left:o}),h=Ze().toLowerCase();t&&(l=Xp(h)?uT:t),Yp(h)&&(e=e||dT,c.scrollbars="yes");const d=Object.entries(c).reduce((m,[E,R])=>`${m}${E}=${R},`,"");if(HE(h)&&l!=="_self")return pT(e||"",l),new Od(null);const p=window.open(e||"",l,d);K(p,n,"popup-blocked");try{p.focus()}catch{}return new Od(p)}function pT(n,e){const t=document.createElement("a");t.href=n,t.target=e;const s=document.createEvent("MouseEvent");s.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),t.dispatchEvent(s)}/**
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
 */const mT="__/auth/handler",gT="emulator/auth/handler",_T=encodeURIComponent("fac");async function Md(n,e,t,s,i,r){K(n.config.authDomain,n,"auth-domain-config-required"),K(n.config.apiKey,n,"invalid-api-key");const o={apiKey:n.config.apiKey,appName:n.name,authType:t,redirectUrl:s,v:as,eventId:i};if(e instanceof Uc){e.setDefaultLanguage(n.languageCode),o.providerId=e.providerId||"",Fl(e.getCustomParameters())||(o.customParameters=JSON.stringify(e.getCustomParameters()));for(const[d,p]of Object.entries({}))o[d]=p}if(e instanceof mr){const d=e.getScopes().filter(p=>p!=="");d.length>0&&(o.scopes=d.join(","))}n.tenantId&&(o.tid=n.tenantId);const l=o;for(const d of Object.keys(l))l[d]===void 0&&delete l[d];const c=await n._getAppCheckToken(),h=c?`#${_T}=${encodeURIComponent(c)}`:"";return`${yT(n)}?${Ys(l).slice(1)}${h}`}function yT({config:n}){return n.emulator?Oc(n,gT):`https://${n.authDomain}/${mT}`}/**
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
 */const dl="webStorageSupport";class vT{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=um,this._completeRedirectFn=$w,this._overrideRedirectResult=Uw}async _openPopup(e,t,s,i){var r;tn((r=this.eventManagers[e._key()])===null||r===void 0?void 0:r.manager,"_initialize() not called before _openPopup()");const o=await Md(e,t,s,jl(),i);return fT(e,o,qc())}async _openRedirect(e,t,s,i){await this._originValidation(e);const r=await Md(e,t,s,jl(),i);return Tw(r),new Promise(()=>{})}_initialize(e){const t=e._key();if(this.eventManagers[t]){const{manager:i,promise:r}=this.eventManagers[t];return i?Promise.resolve(i):(tn(r,"If manager is not set, promise should be"),r)}const s=this.initAndGetManager(e);return this.eventManagers[t]={promise:s},s.catch(()=>{delete this.eventManagers[t]}),s}async initAndGetManager(e){const t=await aT(e),s=new Gw(e);return t.register("authEvent",i=>(K(i==null?void 0:i.authEvent,e,"invalid-auth-event"),{status:s.onEvent(i.authEvent)?"ACK":"ERROR"}),gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[e._key()]={manager:s},this.iframes[e._key()]=t,s}_isIframeWebStorageSupported(e,t){this.iframes[e._key()].send(dl,{type:dl},i=>{var r;const o=(r=i==null?void 0:i[0])===null||r===void 0?void 0:r[dl];o!==void 0&&t(!!o),Ot(e,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(e){const t=e._key();return this.originValidationPromises[t]||(this.originValidationPromises[t]=Yw(e)),this.originValidationPromises[t]}get _shouldInitProactively(){return sm()||Jp()||Fc()}}const ET=vT;var Vd="@firebase/auth",Fd="1.7.9";/**
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
 */class wT{constructor(e){this.auth=e,this.internalListeners=new Map}getUid(){var e;return this.assertAuthConfigured(),((e=this.auth.currentUser)===null||e===void 0?void 0:e.uid)||null}async getToken(e){return this.assertAuthConfigured(),await this.auth._initializationPromise,this.auth.currentUser?{accessToken:await this.auth.currentUser.getIdToken(e)}:null}addAuthTokenListener(e){if(this.assertAuthConfigured(),this.internalListeners.has(e))return;const t=this.auth.onIdTokenChanged(s=>{e((s==null?void 0:s.stsTokenManager.accessToken)||null)});this.internalListeners.set(e,t),this.updateProactiveRefresh()}removeAuthTokenListener(e){this.assertAuthConfigured();const t=this.internalListeners.get(e);t&&(this.internalListeners.delete(e),t(),this.updateProactiveRefresh())}assertAuthConfigured(){K(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}/**
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
 */function TT(n){switch(n){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}function IT(n){Xn(new Pn("auth",(e,{options:t})=>{const s=e.getProvider("app").getImmediate(),i=e.getProvider("heartbeat"),r=e.getProvider("app-check-internal"),{apiKey:o,authDomain:l}=s.options;K(o&&!o.includes(":"),"invalid-api-key",{appName:s.name});const c={apiKey:o,authDomain:l,clientPlatform:n,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:im(n)},h=new ZE(s,i,r,c);return rw(h,t),h},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,t,s)=>{e.getProvider("auth-internal").initialize()})),Xn(new Pn("auth-internal",e=>{const t=da(e.getProvider("auth").getImmediate());return(s=>new wT(s))(t)},"PRIVATE").setInstantiationMode("EXPLICIT")),Nt(Vd,Fd,TT(n)),Nt(Vd,Fd,"esm2017")}/**
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
 */const bT=5*60,CT=Lp("authIdTokenMaxAge")||bT;let Bd=null;const RT=n=>async e=>{const t=e&&await e.getIdTokenResult(),s=t&&(new Date().getTime()-Date.parse(t.issuedAtTime))/1e3;if(s&&s>CT)return;const i=t==null?void 0:t.token;Bd!==i&&(Bd=i,await fetch(n,{method:i?"POST":"DELETE",headers:i?{Authorization:`Bearer ${i}`}:{}}))};function ST(n=Nc()){const e=ua(n,"auth");if(e.isInitialized())return e.getImmediate();const t=iw(n,{popupRedirectResolver:ET,persistence:[Nw,vw,um]}),s=Lp("authTokenSyncURL");if(s&&typeof isSecureContext=="boolean"&&isSecureContext){const r=new URL(s,location.origin);if(location.origin===r.origin){const o=RT(r.toString());pw(t,o,()=>o(t.currentUser)),fw(t,l=>o(l))}}const i=Pp("auth");return i&&ow(t,`http://${i}`),t}function AT(){var n,e;return(e=(n=document.getElementsByTagName("head"))===null||n===void 0?void 0:n[0])!==null&&e!==void 0?e:document}ew({loadJS(n){return new Promise((e,t)=>{const s=document.createElement("script");s.setAttribute("src",n),s.onload=e,s.onerror=i=>{const r=Rt("internal-error");r.customData=i,t(r)},s.type="text/javascript",s.charset="UTF-8",AT().appendChild(s)})},gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="});IT("Browser");var Ud=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var Yn,vm;(function(){var n;/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/function e(I,_){function y(){}y.prototype=_.prototype,I.D=_.prototype,I.prototype=new y,I.prototype.constructor=I,I.C=function(w,T,C){for(var v=Array(arguments.length-2),at=2;at<arguments.length;at++)v[at-2]=arguments[at];return _.prototype[T].apply(w,v)}}function t(){this.blockSize=-1}function s(){this.blockSize=-1,this.blockSize=64,this.g=Array(4),this.B=Array(this.blockSize),this.o=this.h=0,this.s()}e(s,t),s.prototype.s=function(){this.g[0]=1732584193,this.g[1]=4023233417,this.g[2]=2562383102,this.g[3]=271733878,this.o=this.h=0};function i(I,_,y){y||(y=0);var w=Array(16);if(typeof _=="string")for(var T=0;16>T;++T)w[T]=_.charCodeAt(y++)|_.charCodeAt(y++)<<8|_.charCodeAt(y++)<<16|_.charCodeAt(y++)<<24;else for(T=0;16>T;++T)w[T]=_[y++]|_[y++]<<8|_[y++]<<16|_[y++]<<24;_=I.g[0],y=I.g[1],T=I.g[2];var C=I.g[3],v=_+(C^y&(T^C))+w[0]+3614090360&4294967295;_=y+(v<<7&4294967295|v>>>25),v=C+(T^_&(y^T))+w[1]+3905402710&4294967295,C=_+(v<<12&4294967295|v>>>20),v=T+(y^C&(_^y))+w[2]+606105819&4294967295,T=C+(v<<17&4294967295|v>>>15),v=y+(_^T&(C^_))+w[3]+3250441966&4294967295,y=T+(v<<22&4294967295|v>>>10),v=_+(C^y&(T^C))+w[4]+4118548399&4294967295,_=y+(v<<7&4294967295|v>>>25),v=C+(T^_&(y^T))+w[5]+1200080426&4294967295,C=_+(v<<12&4294967295|v>>>20),v=T+(y^C&(_^y))+w[6]+2821735955&4294967295,T=C+(v<<17&4294967295|v>>>15),v=y+(_^T&(C^_))+w[7]+4249261313&4294967295,y=T+(v<<22&4294967295|v>>>10),v=_+(C^y&(T^C))+w[8]+1770035416&4294967295,_=y+(v<<7&4294967295|v>>>25),v=C+(T^_&(y^T))+w[9]+2336552879&4294967295,C=_+(v<<12&4294967295|v>>>20),v=T+(y^C&(_^y))+w[10]+4294925233&4294967295,T=C+(v<<17&4294967295|v>>>15),v=y+(_^T&(C^_))+w[11]+2304563134&4294967295,y=T+(v<<22&4294967295|v>>>10),v=_+(C^y&(T^C))+w[12]+1804603682&4294967295,_=y+(v<<7&4294967295|v>>>25),v=C+(T^_&(y^T))+w[13]+4254626195&4294967295,C=_+(v<<12&4294967295|v>>>20),v=T+(y^C&(_^y))+w[14]+2792965006&4294967295,T=C+(v<<17&4294967295|v>>>15),v=y+(_^T&(C^_))+w[15]+1236535329&4294967295,y=T+(v<<22&4294967295|v>>>10),v=_+(T^C&(y^T))+w[1]+4129170786&4294967295,_=y+(v<<5&4294967295|v>>>27),v=C+(y^T&(_^y))+w[6]+3225465664&4294967295,C=_+(v<<9&4294967295|v>>>23),v=T+(_^y&(C^_))+w[11]+643717713&4294967295,T=C+(v<<14&4294967295|v>>>18),v=y+(C^_&(T^C))+w[0]+3921069994&4294967295,y=T+(v<<20&4294967295|v>>>12),v=_+(T^C&(y^T))+w[5]+3593408605&4294967295,_=y+(v<<5&4294967295|v>>>27),v=C+(y^T&(_^y))+w[10]+38016083&4294967295,C=_+(v<<9&4294967295|v>>>23),v=T+(_^y&(C^_))+w[15]+3634488961&4294967295,T=C+(v<<14&4294967295|v>>>18),v=y+(C^_&(T^C))+w[4]+3889429448&4294967295,y=T+(v<<20&4294967295|v>>>12),v=_+(T^C&(y^T))+w[9]+568446438&4294967295,_=y+(v<<5&4294967295|v>>>27),v=C+(y^T&(_^y))+w[14]+3275163606&4294967295,C=_+(v<<9&4294967295|v>>>23),v=T+(_^y&(C^_))+w[3]+4107603335&4294967295,T=C+(v<<14&4294967295|v>>>18),v=y+(C^_&(T^C))+w[8]+1163531501&4294967295,y=T+(v<<20&4294967295|v>>>12),v=_+(T^C&(y^T))+w[13]+2850285829&4294967295,_=y+(v<<5&4294967295|v>>>27),v=C+(y^T&(_^y))+w[2]+4243563512&4294967295,C=_+(v<<9&4294967295|v>>>23),v=T+(_^y&(C^_))+w[7]+1735328473&4294967295,T=C+(v<<14&4294967295|v>>>18),v=y+(C^_&(T^C))+w[12]+2368359562&4294967295,y=T+(v<<20&4294967295|v>>>12),v=_+(y^T^C)+w[5]+4294588738&4294967295,_=y+(v<<4&4294967295|v>>>28),v=C+(_^y^T)+w[8]+2272392833&4294967295,C=_+(v<<11&4294967295|v>>>21),v=T+(C^_^y)+w[11]+1839030562&4294967295,T=C+(v<<16&4294967295|v>>>16),v=y+(T^C^_)+w[14]+4259657740&4294967295,y=T+(v<<23&4294967295|v>>>9),v=_+(y^T^C)+w[1]+2763975236&4294967295,_=y+(v<<4&4294967295|v>>>28),v=C+(_^y^T)+w[4]+1272893353&4294967295,C=_+(v<<11&4294967295|v>>>21),v=T+(C^_^y)+w[7]+4139469664&4294967295,T=C+(v<<16&4294967295|v>>>16),v=y+(T^C^_)+w[10]+3200236656&4294967295,y=T+(v<<23&4294967295|v>>>9),v=_+(y^T^C)+w[13]+681279174&4294967295,_=y+(v<<4&4294967295|v>>>28),v=C+(_^y^T)+w[0]+3936430074&4294967295,C=_+(v<<11&4294967295|v>>>21),v=T+(C^_^y)+w[3]+3572445317&4294967295,T=C+(v<<16&4294967295|v>>>16),v=y+(T^C^_)+w[6]+76029189&4294967295,y=T+(v<<23&4294967295|v>>>9),v=_+(y^T^C)+w[9]+3654602809&4294967295,_=y+(v<<4&4294967295|v>>>28),v=C+(_^y^T)+w[12]+3873151461&4294967295,C=_+(v<<11&4294967295|v>>>21),v=T+(C^_^y)+w[15]+530742520&4294967295,T=C+(v<<16&4294967295|v>>>16),v=y+(T^C^_)+w[2]+3299628645&4294967295,y=T+(v<<23&4294967295|v>>>9),v=_+(T^(y|~C))+w[0]+4096336452&4294967295,_=y+(v<<6&4294967295|v>>>26),v=C+(y^(_|~T))+w[7]+1126891415&4294967295,C=_+(v<<10&4294967295|v>>>22),v=T+(_^(C|~y))+w[14]+2878612391&4294967295,T=C+(v<<15&4294967295|v>>>17),v=y+(C^(T|~_))+w[5]+4237533241&4294967295,y=T+(v<<21&4294967295|v>>>11),v=_+(T^(y|~C))+w[12]+1700485571&4294967295,_=y+(v<<6&4294967295|v>>>26),v=C+(y^(_|~T))+w[3]+2399980690&4294967295,C=_+(v<<10&4294967295|v>>>22),v=T+(_^(C|~y))+w[10]+4293915773&4294967295,T=C+(v<<15&4294967295|v>>>17),v=y+(C^(T|~_))+w[1]+2240044497&4294967295,y=T+(v<<21&4294967295|v>>>11),v=_+(T^(y|~C))+w[8]+1873313359&4294967295,_=y+(v<<6&4294967295|v>>>26),v=C+(y^(_|~T))+w[15]+4264355552&4294967295,C=_+(v<<10&4294967295|v>>>22),v=T+(_^(C|~y))+w[6]+2734768916&4294967295,T=C+(v<<15&4294967295|v>>>17),v=y+(C^(T|~_))+w[13]+1309151649&4294967295,y=T+(v<<21&4294967295|v>>>11),v=_+(T^(y|~C))+w[4]+4149444226&4294967295,_=y+(v<<6&4294967295|v>>>26),v=C+(y^(_|~T))+w[11]+3174756917&4294967295,C=_+(v<<10&4294967295|v>>>22),v=T+(_^(C|~y))+w[2]+718787259&4294967295,T=C+(v<<15&4294967295|v>>>17),v=y+(C^(T|~_))+w[9]+3951481745&4294967295,I.g[0]=I.g[0]+_&4294967295,I.g[1]=I.g[1]+(T+(v<<21&4294967295|v>>>11))&4294967295,I.g[2]=I.g[2]+T&4294967295,I.g[3]=I.g[3]+C&4294967295}s.prototype.u=function(I,_){_===void 0&&(_=I.length);for(var y=_-this.blockSize,w=this.B,T=this.h,C=0;C<_;){if(T==0)for(;C<=y;)i(this,I,C),C+=this.blockSize;if(typeof I=="string"){for(;C<_;)if(w[T++]=I.charCodeAt(C++),T==this.blockSize){i(this,w),T=0;break}}else for(;C<_;)if(w[T++]=I[C++],T==this.blockSize){i(this,w),T=0;break}}this.h=T,this.o+=_},s.prototype.v=function(){var I=Array((56>this.h?this.blockSize:2*this.blockSize)-this.h);I[0]=128;for(var _=1;_<I.length-8;++_)I[_]=0;var y=8*this.o;for(_=I.length-8;_<I.length;++_)I[_]=y&255,y/=256;for(this.u(I),I=Array(16),_=y=0;4>_;++_)for(var w=0;32>w;w+=8)I[y++]=this.g[_]>>>w&255;return I};function r(I,_){var y=l;return Object.prototype.hasOwnProperty.call(y,I)?y[I]:y[I]=_(I)}function o(I,_){this.h=_;for(var y=[],w=!0,T=I.length-1;0<=T;T--){var C=I[T]|0;w&&C==_||(y[T]=C,w=!1)}this.g=y}var l={};function c(I){return-128<=I&&128>I?r(I,function(_){return new o([_|0],0>_?-1:0)}):new o([I|0],0>I?-1:0)}function h(I){if(isNaN(I)||!isFinite(I))return p;if(0>I)return P(h(-I));for(var _=[],y=1,w=0;I>=y;w++)_[w]=I/y|0,y*=4294967296;return new o(_,0)}function d(I,_){if(I.length==0)throw Error("number format error: empty string");if(_=_||10,2>_||36<_)throw Error("radix out of range: "+_);if(I.charAt(0)=="-")return P(d(I.substring(1),_));if(0<=I.indexOf("-"))throw Error('number format error: interior "-" character');for(var y=h(Math.pow(_,8)),w=p,T=0;T<I.length;T+=8){var C=Math.min(8,I.length-T),v=parseInt(I.substring(T,T+C),_);8>C?(C=h(Math.pow(_,C)),w=w.j(C).add(h(v))):(w=w.j(y),w=w.add(h(v)))}return w}var p=c(0),m=c(1),E=c(16777216);n=o.prototype,n.m=function(){if(A(this))return-P(this).m();for(var I=0,_=1,y=0;y<this.g.length;y++){var w=this.i(y);I+=(0<=w?w:4294967296+w)*_,_*=4294967296}return I},n.toString=function(I){if(I=I||10,2>I||36<I)throw Error("radix out of range: "+I);if(R(this))return"0";if(A(this))return"-"+P(this).toString(I);for(var _=h(Math.pow(I,6)),y=this,w="";;){var T=J(y,_).g;y=V(y,T.j(_));var C=((0<y.g.length?y.g[0]:y.h)>>>0).toString(I);if(y=T,R(y))return C+w;for(;6>C.length;)C="0"+C;w=C+w}},n.i=function(I){return 0>I?0:I<this.g.length?this.g[I]:this.h};function R(I){if(I.h!=0)return!1;for(var _=0;_<I.g.length;_++)if(I.g[_]!=0)return!1;return!0}function A(I){return I.h==-1}n.l=function(I){return I=V(this,I),A(I)?-1:R(I)?0:1};function P(I){for(var _=I.g.length,y=[],w=0;w<_;w++)y[w]=~I.g[w];return new o(y,~I.h).add(m)}n.abs=function(){return A(this)?P(this):this},n.add=function(I){for(var _=Math.max(this.g.length,I.g.length),y=[],w=0,T=0;T<=_;T++){var C=w+(this.i(T)&65535)+(I.i(T)&65535),v=(C>>>16)+(this.i(T)>>>16)+(I.i(T)>>>16);w=v>>>16,C&=65535,v&=65535,y[T]=v<<16|C}return new o(y,y[y.length-1]&-2147483648?-1:0)};function V(I,_){return I.add(P(_))}n.j=function(I){if(R(this)||R(I))return p;if(A(this))return A(I)?P(this).j(P(I)):P(P(this).j(I));if(A(I))return P(this.j(P(I)));if(0>this.l(E)&&0>I.l(E))return h(this.m()*I.m());for(var _=this.g.length+I.g.length,y=[],w=0;w<2*_;w++)y[w]=0;for(w=0;w<this.g.length;w++)for(var T=0;T<I.g.length;T++){var C=this.i(w)>>>16,v=this.i(w)&65535,at=I.i(T)>>>16,vt=I.i(T)&65535;y[2*w+2*T]+=v*vt,U(y,2*w+2*T),y[2*w+2*T+1]+=C*vt,U(y,2*w+2*T+1),y[2*w+2*T+1]+=v*at,U(y,2*w+2*T+1),y[2*w+2*T+2]+=C*at,U(y,2*w+2*T+2)}for(w=0;w<_;w++)y[w]=y[2*w+1]<<16|y[2*w];for(w=_;w<2*_;w++)y[w]=0;return new o(y,0)};function U(I,_){for(;(I[_]&65535)!=I[_];)I[_+1]+=I[_]>>>16,I[_]&=65535,_++}function q(I,_){this.g=I,this.h=_}function J(I,_){if(R(_))throw Error("division by zero");if(R(I))return new q(p,p);if(A(I))return _=J(P(I),_),new q(P(_.g),P(_.h));if(A(_))return _=J(I,P(_)),new q(P(_.g),_.h);if(30<I.g.length){if(A(I)||A(_))throw Error("slowDivide_ only works with positive integers.");for(var y=m,w=_;0>=w.l(I);)y=ye(y),w=ye(w);var T=ue(y,1),C=ue(w,1);for(w=ue(w,2),y=ue(y,2);!R(w);){var v=C.add(w);0>=v.l(I)&&(T=T.add(y),C=v),w=ue(w,1),y=ue(y,1)}return _=V(I,T.j(_)),new q(T,_)}for(T=p;0<=I.l(_);){for(y=Math.max(1,Math.floor(I.m()/_.m())),w=Math.ceil(Math.log(y)/Math.LN2),w=48>=w?1:Math.pow(2,w-48),C=h(y),v=C.j(_);A(v)||0<v.l(I);)y-=w,C=h(y),v=C.j(_);R(C)&&(C=m),T=T.add(C),I=V(I,v)}return new q(T,I)}n.A=function(I){return J(this,I).h},n.and=function(I){for(var _=Math.max(this.g.length,I.g.length),y=[],w=0;w<_;w++)y[w]=this.i(w)&I.i(w);return new o(y,this.h&I.h)},n.or=function(I){for(var _=Math.max(this.g.length,I.g.length),y=[],w=0;w<_;w++)y[w]=this.i(w)|I.i(w);return new o(y,this.h|I.h)},n.xor=function(I){for(var _=Math.max(this.g.length,I.g.length),y=[],w=0;w<_;w++)y[w]=this.i(w)^I.i(w);return new o(y,this.h^I.h)};function ye(I){for(var _=I.g.length+1,y=[],w=0;w<_;w++)y[w]=I.i(w)<<1|I.i(w-1)>>>31;return new o(y,I.h)}function ue(I,_){var y=_>>5;_%=32;for(var w=I.g.length-y,T=[],C=0;C<w;C++)T[C]=0<_?I.i(C+y)>>>_|I.i(C+y+1)<<32-_:I.i(C+y);return new o(T,I.h)}s.prototype.digest=s.prototype.v,s.prototype.reset=s.prototype.s,s.prototype.update=s.prototype.u,vm=s,o.prototype.add=o.prototype.add,o.prototype.multiply=o.prototype.j,o.prototype.modulo=o.prototype.A,o.prototype.compare=o.prototype.l,o.prototype.toNumber=o.prototype.m,o.prototype.toString=o.prototype.toString,o.prototype.getBits=o.prototype.i,o.fromNumber=h,o.fromString=d,Yn=o}).apply(typeof Ud<"u"?Ud:typeof self<"u"?self:typeof window<"u"?window:{});var eo=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var Em,Li,wm,mo,Hl,Tm,Im,bm;(function(){var n,e=typeof Object.defineProperties=="function"?Object.defineProperty:function(a,u,f){return a==Array.prototype||a==Object.prototype||(a[u]=f.value),a};function t(a){a=[typeof globalThis=="object"&&globalThis,a,typeof window=="object"&&window,typeof self=="object"&&self,typeof eo=="object"&&eo];for(var u=0;u<a.length;++u){var f=a[u];if(f&&f.Math==Math)return f}throw Error("Cannot find global object")}var s=t(this);function i(a,u){if(u)e:{var f=s;a=a.split(".");for(var g=0;g<a.length-1;g++){var b=a[g];if(!(b in f))break e;f=f[b]}a=a[a.length-1],g=f[a],u=u(g),u!=g&&u!=null&&e(f,a,{configurable:!0,writable:!0,value:u})}}function r(a,u){a instanceof String&&(a+="");var f=0,g=!1,b={next:function(){if(!g&&f<a.length){var S=f++;return{value:u(S,a[S]),done:!1}}return g=!0,{done:!0,value:void 0}}};return b[Symbol.iterator]=function(){return b},b}i("Array.prototype.values",function(a){return a||function(){return r(this,function(u,f){return f})}});/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/var o=o||{},l=this||self;function c(a){var u=typeof a;return u=u!="object"?u:a?Array.isArray(a)?"array":u:"null",u=="array"||u=="object"&&typeof a.length=="number"}function h(a){var u=typeof a;return u=="object"&&a!=null||u=="function"}function d(a,u,f){return a.call.apply(a.bind,arguments)}function p(a,u,f){if(!a)throw Error();if(2<arguments.length){var g=Array.prototype.slice.call(arguments,2);return function(){var b=Array.prototype.slice.call(arguments);return Array.prototype.unshift.apply(b,g),a.apply(u,b)}}return function(){return a.apply(u,arguments)}}function m(a,u,f){return m=Function.prototype.bind&&Function.prototype.bind.toString().indexOf("native code")!=-1?d:p,m.apply(null,arguments)}function E(a,u){var f=Array.prototype.slice.call(arguments,1);return function(){var g=f.slice();return g.push.apply(g,arguments),a.apply(this,g)}}function R(a,u){function f(){}f.prototype=u.prototype,a.aa=u.prototype,a.prototype=new f,a.prototype.constructor=a,a.Qb=function(g,b,S){for(var O=Array(arguments.length-2),fe=2;fe<arguments.length;fe++)O[fe-2]=arguments[fe];return u.prototype[b].apply(g,O)}}function A(a){const u=a.length;if(0<u){const f=Array(u);for(let g=0;g<u;g++)f[g]=a[g];return f}return[]}function P(a,u){for(let f=1;f<arguments.length;f++){const g=arguments[f];if(c(g)){const b=a.length||0,S=g.length||0;a.length=b+S;for(let O=0;O<S;O++)a[b+O]=g[O]}else a.push(g)}}class V{constructor(u,f){this.i=u,this.j=f,this.h=0,this.g=null}get(){let u;return 0<this.h?(this.h--,u=this.g,this.g=u.next,u.next=null):u=this.i(),u}}function U(a){return/^[\s\xa0]*$/.test(a)}function q(){var a=l.navigator;return a&&(a=a.userAgent)?a:""}function J(a){return J[" "](a),a}J[" "]=function(){};var ye=q().indexOf("Gecko")!=-1&&!(q().toLowerCase().indexOf("webkit")!=-1&&q().indexOf("Edge")==-1)&&!(q().indexOf("Trident")!=-1||q().indexOf("MSIE")!=-1)&&q().indexOf("Edge")==-1;function ue(a,u,f){for(const g in a)u.call(f,a[g],g,a)}function I(a,u){for(const f in a)u.call(void 0,a[f],f,a)}function _(a){const u={};for(const f in a)u[f]=a[f];return u}const y="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function w(a,u){let f,g;for(let b=1;b<arguments.length;b++){g=arguments[b];for(f in g)a[f]=g[f];for(let S=0;S<y.length;S++)f=y[S],Object.prototype.hasOwnProperty.call(g,f)&&(a[f]=g[f])}}function T(a){var u=1;a=a.split(":");const f=[];for(;0<u&&a.length;)f.push(a.shift()),u--;return a.length&&f.push(a.join(":")),f}function C(a){l.setTimeout(()=>{throw a},0)}function v(){var a=ln;let u=null;return a.g&&(u=a.g,a.g=a.g.next,a.g||(a.h=null),u.next=null),u}class at{constructor(){this.h=this.g=null}add(u,f){const g=vt.get();g.set(u,f),this.h?this.h.next=g:this.g=g,this.h=g}}var vt=new V(()=>new ds,a=>a.reset());class ds{constructor(){this.next=this.g=this.h=null}set(u,f){this.h=u,this.g=f,this.next=null}reset(){this.next=this.g=this.h=null}}let an,kt=!1,ln=new at,fs=()=>{const a=l.Promise.resolve(void 0);an=()=>{a.then(Lr)}};var Lr=()=>{for(var a;a=v();){try{a.h.call(a.g)}catch(f){C(f)}var u=vt;u.j(a),100>u.h&&(u.h++,a.next=u.g,u.g=a)}kt=!1};function Et(){this.s=this.s,this.C=this.C}Et.prototype.s=!1,Et.prototype.ma=function(){this.s||(this.s=!0,this.N())},Et.prototype.N=function(){if(this.C)for(;this.C.length;)this.C.shift()()};function G(a,u){this.type=a,this.g=this.target=u,this.defaultPrevented=!1}G.prototype.h=function(){this.defaultPrevented=!0};var we=function(){if(!l.addEventListener||!Object.defineProperty)return!1;var a=!1,u=Object.defineProperty({},"passive",{get:function(){a=!0}});try{const f=()=>{};l.addEventListener("test",f,u),l.removeEventListener("test",f,u)}catch{}return a}();function lt(a,u){if(G.call(this,a?a.type:""),this.relatedTarget=this.g=this.target=null,this.button=this.screenY=this.screenX=this.clientY=this.clientX=0,this.key="",this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1,this.state=null,this.pointerId=0,this.pointerType="",this.i=null,a){var f=this.type=a.type,g=a.changedTouches&&a.changedTouches.length?a.changedTouches[0]:null;if(this.target=a.target||a.srcElement,this.g=u,u=a.relatedTarget){if(ye){e:{try{J(u.nodeName);var b=!0;break e}catch{}b=!1}b||(u=null)}}else f=="mouseover"?u=a.fromElement:f=="mouseout"&&(u=a.toElement);this.relatedTarget=u,g?(this.clientX=g.clientX!==void 0?g.clientX:g.pageX,this.clientY=g.clientY!==void 0?g.clientY:g.pageY,this.screenX=g.screenX||0,this.screenY=g.screenY||0):(this.clientX=a.clientX!==void 0?a.clientX:a.pageX,this.clientY=a.clientY!==void 0?a.clientY:a.pageY,this.screenX=a.screenX||0,this.screenY=a.screenY||0),this.button=a.button,this.key=a.key||"",this.ctrlKey=a.ctrlKey,this.altKey=a.altKey,this.shiftKey=a.shiftKey,this.metaKey=a.metaKey,this.pointerId=a.pointerId||0,this.pointerType=typeof a.pointerType=="string"?a.pointerType:xr[a.pointerType]||"",this.state=a.state,this.i=a,a.defaultPrevented&&lt.aa.h.call(this)}}R(lt,G);var xr={2:"touch",3:"pen",4:"mouse"};lt.prototype.h=function(){lt.aa.h.call(this);var a=this.i;a.preventDefault?a.preventDefault():a.returnValue=!1};var L="closure_listenable_"+(1e6*Math.random()|0),Ce=0;function de(a,u,f,g,b){this.listener=a,this.proxy=null,this.src=u,this.type=f,this.capture=!!g,this.ha=b,this.key=++Ce,this.da=this.fa=!1}function Pe(a){a.da=!0,a.listener=null,a.proxy=null,a.src=null,a.ha=null}function cn(a){this.src=a,this.g={},this.h=0}cn.prototype.add=function(a,u,f,g,b){var S=a.toString();a=this.g[S],a||(a=this.g[S]=[],this.h++);var O=ps(a,u,g,b);return-1<O?(u=a[O],f||(u.fa=!1)):(u=new de(u,this.src,S,!!g,b),u.fa=f,a.push(u)),u};function hn(a,u){var f=u.type;if(f in a.g){var g=a.g[f],b=Array.prototype.indexOf.call(g,u,void 0),S;(S=0<=b)&&Array.prototype.splice.call(g,b,1),S&&(Pe(u),a.g[f].length==0&&(delete a.g[f],a.h--))}}function ps(a,u,f,g){for(var b=0;b<a.length;++b){var S=a[b];if(!S.da&&S.listener==u&&S.capture==!!f&&S.ha==g)return b}return-1}var ms="closure_lm_"+(1e6*Math.random()|0),gs={};function ai(a,u,f,g,b){if(Array.isArray(u)){for(var S=0;S<u.length;S++)ai(a,u[S],f,g,b);return null}return f=_u(f),a&&a[L]?a.K(u,f,h(g)?!!g.capture:!1,b):_s(a,u,f,!1,g,b)}function _s(a,u,f,g,b,S){if(!u)throw Error("Invalid event type");var O=h(b)?!!b.capture:!!b,fe=Wa(a);if(fe||(a[ms]=fe=new cn(a)),f=fe.add(u,f,g,O,S),f.proxy)return f;if(g=qt(),f.proxy=g,g.src=a,g.listener=f,a.addEventListener)we||(b=O),b===void 0&&(b=!1),a.addEventListener(u.toString(),g,b);else if(a.attachEvent)a.attachEvent(un(u.toString()),g);else if(a.addListener&&a.removeListener)a.addListener(g);else throw Error("addEventListener and attachEvent are unavailable.");return f}function qt(){function a(f){return u.call(a.src,a.listener,f)}const u=Mr;return a}function Or(a,u,f,g,b){if(Array.isArray(u))for(var S=0;S<u.length;S++)Or(a,u[S],f,g,b);else g=h(g)?!!g.capture:!!g,f=_u(f),a&&a[L]?(a=a.i,u=String(u).toString(),u in a.g&&(S=a.g[u],f=ps(S,f,g,b),-1<f&&(Pe(S[f]),Array.prototype.splice.call(S,f,1),S.length==0&&(delete a.g[u],a.h--)))):a&&(a=Wa(a))&&(u=a.g[u.toString()],a=-1,u&&(a=ps(u,f,g,b)),(f=-1<a?u[a]:null)&&mt(f))}function mt(a){if(typeof a!="number"&&a&&!a.da){var u=a.src;if(u&&u[L])hn(u.i,a);else{var f=a.type,g=a.proxy;u.removeEventListener?u.removeEventListener(f,g,a.capture):u.detachEvent?u.detachEvent(un(f),g):u.addListener&&u.removeListener&&u.removeListener(g),(f=Wa(u))?(hn(f,a),f.h==0&&(f.src=null,u[ms]=null)):Pe(a)}}}function un(a){return a in gs?gs[a]:gs[a]="on"+a}function Mr(a,u){if(a.da)a=!0;else{u=new lt(u,this);var f=a.listener,g=a.ha||a.src;a.fa&&mt(a),a=f.call(g,u)}return a}function Wa(a){return a=a[ms],a instanceof cn?a:null}var $a="__closure_events_fn_"+(1e9*Math.random()>>>0);function _u(a){return typeof a=="function"?a:(a[$a]||(a[$a]=function(u){return a.handleEvent(u)}),a[$a])}function ze(){Et.call(this),this.i=new cn(this),this.M=this,this.F=null}R(ze,Et),ze.prototype[L]=!0,ze.prototype.removeEventListener=function(a,u,f,g){Or(this,a,u,f,g)};function et(a,u){var f,g=a.F;if(g)for(f=[];g;g=g.F)f.push(g);if(a=a.M,g=u.type||u,typeof u=="string")u=new G(u,a);else if(u instanceof G)u.target=u.target||a;else{var b=u;u=new G(g,a),w(u,b)}if(b=!0,f)for(var S=f.length-1;0<=S;S--){var O=u.g=f[S];b=Vr(O,g,!0,u)&&b}if(O=u.g=a,b=Vr(O,g,!0,u)&&b,b=Vr(O,g,!1,u)&&b,f)for(S=0;S<f.length;S++)O=u.g=f[S],b=Vr(O,g,!1,u)&&b}ze.prototype.N=function(){if(ze.aa.N.call(this),this.i){var a=this.i,u;for(u in a.g){for(var f=a.g[u],g=0;g<f.length;g++)Pe(f[g]);delete a.g[u],a.h--}}this.F=null},ze.prototype.K=function(a,u,f,g){return this.i.add(String(a),u,!1,f,g)},ze.prototype.L=function(a,u,f,g){return this.i.add(String(a),u,!0,f,g)};function Vr(a,u,f,g){if(u=a.i.g[String(u)],!u)return!0;u=u.concat();for(var b=!0,S=0;S<u.length;++S){var O=u[S];if(O&&!O.da&&O.capture==f){var fe=O.listener,Be=O.ha||O.src;O.fa&&hn(a.i,O),b=fe.call(Be,g)!==!1&&b}}return b&&!g.defaultPrevented}function yu(a,u,f){if(typeof a=="function")f&&(a=m(a,f));else if(a&&typeof a.handleEvent=="function")a=m(a.handleEvent,a);else throw Error("Invalid listener argument");return 2147483647<Number(u)?-1:l.setTimeout(a,u||0)}function vu(a){a.g=yu(()=>{a.g=null,a.i&&(a.i=!1,vu(a))},a.l);const u=a.h;a.h=null,a.m.apply(null,u)}class wy extends Et{constructor(u,f){super(),this.m=u,this.l=f,this.h=null,this.i=!1,this.g=null}j(u){this.h=arguments,this.g?this.i=!0:vu(this)}N(){super.N(),this.g&&(l.clearTimeout(this.g),this.g=null,this.i=!1,this.h=null)}}function li(a){Et.call(this),this.h=a,this.g={}}R(li,Et);var Eu=[];function wu(a){ue(a.g,function(u,f){this.g.hasOwnProperty(f)&&mt(u)},a),a.g={}}li.prototype.N=function(){li.aa.N.call(this),wu(this)},li.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented")};var ja=l.JSON.stringify,Ty=l.JSON.parse,Iy=class{stringify(a){return l.JSON.stringify(a,void 0)}parse(a){return l.JSON.parse(a,void 0)}};function Ga(){}Ga.prototype.h=null;function Tu(a){return a.h||(a.h=a.i())}function Iu(){}var ci={OPEN:"a",kb:"b",Ja:"c",wb:"d"};function za(){G.call(this,"d")}R(za,G);function Ha(){G.call(this,"c")}R(Ha,G);var Un={},bu=null;function Fr(){return bu=bu||new ze}Un.La="serverreachability";function Cu(a){G.call(this,Un.La,a)}R(Cu,G);function hi(a){const u=Fr();et(u,new Cu(u))}Un.STAT_EVENT="statevent";function Ru(a,u){G.call(this,Un.STAT_EVENT,a),this.stat=u}R(Ru,G);function tt(a){const u=Fr();et(u,new Ru(u,a))}Un.Ma="timingevent";function Su(a,u){G.call(this,Un.Ma,a),this.size=u}R(Su,G);function ui(a,u){if(typeof a!="function")throw Error("Fn must not be null and must be a function");return l.setTimeout(function(){a()},u)}function di(){this.g=!0}di.prototype.xa=function(){this.g=!1};function by(a,u,f,g,b,S){a.info(function(){if(a.g)if(S)for(var O="",fe=S.split("&"),Be=0;Be<fe.length;Be++){var oe=fe[Be].split("=");if(1<oe.length){var He=oe[0];oe=oe[1];var Ke=He.split("_");O=2<=Ke.length&&Ke[1]=="type"?O+(He+"="+oe+"&"):O+(He+"=redacted&")}}else O=null;else O=S;return"XMLHTTP REQ ("+g+") [attempt "+b+"]: "+u+`
`+f+`
`+O})}function Cy(a,u,f,g,b,S,O){a.info(function(){return"XMLHTTP RESP ("+g+") [ attempt "+b+"]: "+u+`
`+f+`
`+S+" "+O})}function ys(a,u,f,g){a.info(function(){return"XMLHTTP TEXT ("+u+"): "+Sy(a,f)+(g?" "+g:"")})}function Ry(a,u){a.info(function(){return"TIMEOUT: "+u})}di.prototype.info=function(){};function Sy(a,u){if(!a.g)return u;if(!u)return null;try{var f=JSON.parse(u);if(f){for(a=0;a<f.length;a++)if(Array.isArray(f[a])){var g=f[a];if(!(2>g.length)){var b=g[1];if(Array.isArray(b)&&!(1>b.length)){var S=b[0];if(S!="noop"&&S!="stop"&&S!="close")for(var O=1;O<b.length;O++)b[O]=""}}}}return ja(f)}catch{return u}}var Br={NO_ERROR:0,gb:1,tb:2,sb:3,nb:4,rb:5,ub:6,Ia:7,TIMEOUT:8,xb:9},Au={lb:"complete",Hb:"success",Ja:"error",Ia:"abort",zb:"ready",Ab:"readystatechange",TIMEOUT:"timeout",vb:"incrementaldata",yb:"progress",ob:"downloadprogress",Pb:"uploadprogress"},Ka;function Ur(){}R(Ur,Ga),Ur.prototype.g=function(){return new XMLHttpRequest},Ur.prototype.i=function(){return{}},Ka=new Ur;function dn(a,u,f,g){this.j=a,this.i=u,this.l=f,this.R=g||1,this.U=new li(this),this.I=45e3,this.H=null,this.o=!1,this.m=this.A=this.v=this.L=this.F=this.S=this.B=null,this.D=[],this.g=null,this.C=0,this.s=this.u=null,this.X=-1,this.J=!1,this.O=0,this.M=null,this.W=this.K=this.T=this.P=!1,this.h=new ku}function ku(){this.i=null,this.g="",this.h=!1}var Pu={},Qa={};function Ya(a,u,f){a.L=1,a.v=jr(Wt(u)),a.m=f,a.P=!0,Nu(a,null)}function Nu(a,u){a.F=Date.now(),qr(a),a.A=Wt(a.v);var f=a.A,g=a.R;Array.isArray(g)||(g=[String(g)]),Gu(f.i,"t",g),a.C=0,f=a.j.J,a.h=new ku,a.g=cd(a.j,f?u:null,!a.m),0<a.O&&(a.M=new wy(m(a.Y,a,a.g),a.O)),u=a.U,f=a.g,g=a.ca;var b="readystatechange";Array.isArray(b)||(b&&(Eu[0]=b.toString()),b=Eu);for(var S=0;S<b.length;S++){var O=ai(f,b[S],g||u.handleEvent,!1,u.h||u);if(!O)break;u.g[O.key]=O}u=a.H?_(a.H):{},a.m?(a.u||(a.u="POST"),u["Content-Type"]="application/x-www-form-urlencoded",a.g.ea(a.A,a.u,a.m,u)):(a.u="GET",a.g.ea(a.A,a.u,null,u)),hi(),by(a.i,a.u,a.A,a.l,a.R,a.m)}dn.prototype.ca=function(a){a=a.target;const u=this.M;u&&$t(a)==3?u.j():this.Y(a)},dn.prototype.Y=function(a){try{if(a==this.g)e:{const Ke=$t(this.g);var u=this.g.Ba();const ws=this.g.Z();if(!(3>Ke)&&(Ke!=3||this.g&&(this.h.h||this.g.oa()||Xu(this.g)))){this.J||Ke!=4||u==7||(u==8||0>=ws?hi(3):hi(2)),Ja(this);var f=this.g.Z();this.X=f;t:if(Du(this)){var g=Xu(this.g);a="";var b=g.length,S=$t(this.g)==4;if(!this.h.i){if(typeof TextDecoder>"u"){qn(this),fi(this);var O="";break t}this.h.i=new l.TextDecoder}for(u=0;u<b;u++)this.h.h=!0,a+=this.h.i.decode(g[u],{stream:!(S&&u==b-1)});g.length=0,this.h.g+=a,this.C=0,O=this.h.g}else O=this.g.oa();if(this.o=f==200,Cy(this.i,this.u,this.A,this.l,this.R,Ke,f),this.o){if(this.T&&!this.K){t:{if(this.g){var fe,Be=this.g;if((fe=Be.g?Be.g.getResponseHeader("X-HTTP-Initial-Response"):null)&&!U(fe)){var oe=fe;break t}}oe=null}if(f=oe)ys(this.i,this.l,f,"Initial handshake response via X-HTTP-Initial-Response"),this.K=!0,Xa(this,f);else{this.o=!1,this.s=3,tt(12),qn(this),fi(this);break e}}if(this.P){f=!0;let wt;for(;!this.J&&this.C<O.length;)if(wt=Ay(this,O),wt==Qa){Ke==4&&(this.s=4,tt(14),f=!1),ys(this.i,this.l,null,"[Incomplete Response]");break}else if(wt==Pu){this.s=4,tt(15),ys(this.i,this.l,O,"[Invalid Chunk]"),f=!1;break}else ys(this.i,this.l,wt,null),Xa(this,wt);if(Du(this)&&this.C!=0&&(this.h.g=this.h.g.slice(this.C),this.C=0),Ke!=4||O.length!=0||this.h.h||(this.s=1,tt(16),f=!1),this.o=this.o&&f,!f)ys(this.i,this.l,O,"[Invalid Chunked Response]"),qn(this),fi(this);else if(0<O.length&&!this.W){this.W=!0;var He=this.j;He.g==this&&He.ba&&!He.M&&(He.j.info("Great, no buffering proxy detected. Bytes received: "+O.length),il(He),He.M=!0,tt(11))}}else ys(this.i,this.l,O,null),Xa(this,O);Ke==4&&qn(this),this.o&&!this.J&&(Ke==4?rd(this.j,this):(this.o=!1,qr(this)))}else Gy(this.g),f==400&&0<O.indexOf("Unknown SID")?(this.s=3,tt(12)):(this.s=0,tt(13)),qn(this),fi(this)}}}catch{}finally{}};function Du(a){return a.g?a.u=="GET"&&a.L!=2&&a.j.Ca:!1}function Ay(a,u){var f=a.C,g=u.indexOf(`
`,f);return g==-1?Qa:(f=Number(u.substring(f,g)),isNaN(f)?Pu:(g+=1,g+f>u.length?Qa:(u=u.slice(g,g+f),a.C=g+f,u)))}dn.prototype.cancel=function(){this.J=!0,qn(this)};function qr(a){a.S=Date.now()+a.I,Lu(a,a.I)}function Lu(a,u){if(a.B!=null)throw Error("WatchDog timer not null");a.B=ui(m(a.ba,a),u)}function Ja(a){a.B&&(l.clearTimeout(a.B),a.B=null)}dn.prototype.ba=function(){this.B=null;const a=Date.now();0<=a-this.S?(Ry(this.i,this.A),this.L!=2&&(hi(),tt(17)),qn(this),this.s=2,fi(this)):Lu(this,this.S-a)};function fi(a){a.j.G==0||a.J||rd(a.j,a)}function qn(a){Ja(a);var u=a.M;u&&typeof u.ma=="function"&&u.ma(),a.M=null,wu(a.U),a.g&&(u=a.g,a.g=null,u.abort(),u.ma())}function Xa(a,u){try{var f=a.j;if(f.G!=0&&(f.g==a||Za(f.h,a))){if(!a.K&&Za(f.h,a)&&f.G==3){try{var g=f.Da.g.parse(u)}catch{g=null}if(Array.isArray(g)&&g.length==3){var b=g;if(b[0]==0){e:if(!f.u){if(f.g)if(f.g.F+3e3<a.F)Yr(f),Kr(f);else break e;sl(f),tt(18)}}else f.za=b[1],0<f.za-f.T&&37500>b[2]&&f.F&&f.v==0&&!f.C&&(f.C=ui(m(f.Za,f),6e3));if(1>=Mu(f.h)&&f.ca){try{f.ca()}catch{}f.ca=void 0}}else $n(f,11)}else if((a.K||f.g==a)&&Yr(f),!U(u))for(b=f.Da.g.parse(u),u=0;u<b.length;u++){let oe=b[u];if(f.T=oe[0],oe=oe[1],f.G==2)if(oe[0]=="c"){f.K=oe[1],f.ia=oe[2];const He=oe[3];He!=null&&(f.la=He,f.j.info("VER="+f.la));const Ke=oe[4];Ke!=null&&(f.Aa=Ke,f.j.info("SVER="+f.Aa));const ws=oe[5];ws!=null&&typeof ws=="number"&&0<ws&&(g=1.5*ws,f.L=g,f.j.info("backChannelRequestTimeoutMs_="+g)),g=f;const wt=a.g;if(wt){const Xr=wt.g?wt.g.getResponseHeader("X-Client-Wire-Protocol"):null;if(Xr){var S=g.h;S.g||Xr.indexOf("spdy")==-1&&Xr.indexOf("quic")==-1&&Xr.indexOf("h2")==-1||(S.j=S.l,S.g=new Set,S.h&&(el(S,S.h),S.h=null))}if(g.D){const rl=wt.g?wt.g.getResponseHeader("X-HTTP-Session-Id"):null;rl&&(g.ya=rl,ve(g.I,g.D,rl))}}f.G=3,f.l&&f.l.ua(),f.ba&&(f.R=Date.now()-a.F,f.j.info("Handshake RTT: "+f.R+"ms")),g=f;var O=a;if(g.qa=ld(g,g.J?g.ia:null,g.W),O.K){Vu(g.h,O);var fe=O,Be=g.L;Be&&(fe.I=Be),fe.B&&(Ja(fe),qr(fe)),g.g=O}else sd(g);0<f.i.length&&Qr(f)}else oe[0]!="stop"&&oe[0]!="close"||$n(f,7);else f.G==3&&(oe[0]=="stop"||oe[0]=="close"?oe[0]=="stop"?$n(f,7):nl(f):oe[0]!="noop"&&f.l&&f.l.ta(oe),f.v=0)}}hi(4)}catch{}}var ky=class{constructor(a,u){this.g=a,this.map=u}};function xu(a){this.l=a||10,l.PerformanceNavigationTiming?(a=l.performance.getEntriesByType("navigation"),a=0<a.length&&(a[0].nextHopProtocol=="hq"||a[0].nextHopProtocol=="h2")):a=!!(l.chrome&&l.chrome.loadTimes&&l.chrome.loadTimes()&&l.chrome.loadTimes().wasFetchedViaSpdy),this.j=a?this.l:1,this.g=null,1<this.j&&(this.g=new Set),this.h=null,this.i=[]}function Ou(a){return a.h?!0:a.g?a.g.size>=a.j:!1}function Mu(a){return a.h?1:a.g?a.g.size:0}function Za(a,u){return a.h?a.h==u:a.g?a.g.has(u):!1}function el(a,u){a.g?a.g.add(u):a.h=u}function Vu(a,u){a.h&&a.h==u?a.h=null:a.g&&a.g.has(u)&&a.g.delete(u)}xu.prototype.cancel=function(){if(this.i=Fu(this),this.h)this.h.cancel(),this.h=null;else if(this.g&&this.g.size!==0){for(const a of this.g.values())a.cancel();this.g.clear()}};function Fu(a){if(a.h!=null)return a.i.concat(a.h.D);if(a.g!=null&&a.g.size!==0){let u=a.i;for(const f of a.g.values())u=u.concat(f.D);return u}return A(a.i)}function Py(a){if(a.V&&typeof a.V=="function")return a.V();if(typeof Map<"u"&&a instanceof Map||typeof Set<"u"&&a instanceof Set)return Array.from(a.values());if(typeof a=="string")return a.split("");if(c(a)){for(var u=[],f=a.length,g=0;g<f;g++)u.push(a[g]);return u}u=[],f=0;for(g in a)u[f++]=a[g];return u}function Ny(a){if(a.na&&typeof a.na=="function")return a.na();if(!a.V||typeof a.V!="function"){if(typeof Map<"u"&&a instanceof Map)return Array.from(a.keys());if(!(typeof Set<"u"&&a instanceof Set)){if(c(a)||typeof a=="string"){var u=[];a=a.length;for(var f=0;f<a;f++)u.push(f);return u}u=[],f=0;for(const g in a)u[f++]=g;return u}}}function Bu(a,u){if(a.forEach&&typeof a.forEach=="function")a.forEach(u,void 0);else if(c(a)||typeof a=="string")Array.prototype.forEach.call(a,u,void 0);else for(var f=Ny(a),g=Py(a),b=g.length,S=0;S<b;S++)u.call(void 0,g[S],f&&f[S],a)}var Uu=RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");function Dy(a,u){if(a){a=a.split("&");for(var f=0;f<a.length;f++){var g=a[f].indexOf("="),b=null;if(0<=g){var S=a[f].substring(0,g);b=a[f].substring(g+1)}else S=a[f];u(S,b?decodeURIComponent(b.replace(/\+/g," ")):"")}}}function Wn(a){if(this.g=this.o=this.j="",this.s=null,this.m=this.l="",this.h=!1,a instanceof Wn){this.h=a.h,Wr(this,a.j),this.o=a.o,this.g=a.g,$r(this,a.s),this.l=a.l;var u=a.i,f=new gi;f.i=u.i,u.g&&(f.g=new Map(u.g),f.h=u.h),qu(this,f),this.m=a.m}else a&&(u=String(a).match(Uu))?(this.h=!1,Wr(this,u[1]||"",!0),this.o=pi(u[2]||""),this.g=pi(u[3]||"",!0),$r(this,u[4]),this.l=pi(u[5]||"",!0),qu(this,u[6]||"",!0),this.m=pi(u[7]||"")):(this.h=!1,this.i=new gi(null,this.h))}Wn.prototype.toString=function(){var a=[],u=this.j;u&&a.push(mi(u,Wu,!0),":");var f=this.g;return(f||u=="file")&&(a.push("//"),(u=this.o)&&a.push(mi(u,Wu,!0),"@"),a.push(encodeURIComponent(String(f)).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),f=this.s,f!=null&&a.push(":",String(f))),(f=this.l)&&(this.g&&f.charAt(0)!="/"&&a.push("/"),a.push(mi(f,f.charAt(0)=="/"?Oy:xy,!0))),(f=this.i.toString())&&a.push("?",f),(f=this.m)&&a.push("#",mi(f,Vy)),a.join("")};function Wt(a){return new Wn(a)}function Wr(a,u,f){a.j=f?pi(u,!0):u,a.j&&(a.j=a.j.replace(/:$/,""))}function $r(a,u){if(u){if(u=Number(u),isNaN(u)||0>u)throw Error("Bad port number "+u);a.s=u}else a.s=null}function qu(a,u,f){u instanceof gi?(a.i=u,Fy(a.i,a.h)):(f||(u=mi(u,My)),a.i=new gi(u,a.h))}function ve(a,u,f){a.i.set(u,f)}function jr(a){return ve(a,"zx",Math.floor(2147483648*Math.random()).toString(36)+Math.abs(Math.floor(2147483648*Math.random())^Date.now()).toString(36)),a}function pi(a,u){return a?u?decodeURI(a.replace(/%25/g,"%2525")):decodeURIComponent(a):""}function mi(a,u,f){return typeof a=="string"?(a=encodeURI(a).replace(u,Ly),f&&(a=a.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),a):null}function Ly(a){return a=a.charCodeAt(0),"%"+(a>>4&15).toString(16)+(a&15).toString(16)}var Wu=/[#\/\?@]/g,xy=/[#\?:]/g,Oy=/[#\?]/g,My=/[#\?@]/g,Vy=/#/g;function gi(a,u){this.h=this.g=null,this.i=a||null,this.j=!!u}function fn(a){a.g||(a.g=new Map,a.h=0,a.i&&Dy(a.i,function(u,f){a.add(decodeURIComponent(u.replace(/\+/g," ")),f)}))}n=gi.prototype,n.add=function(a,u){fn(this),this.i=null,a=vs(this,a);var f=this.g.get(a);return f||this.g.set(a,f=[]),f.push(u),this.h+=1,this};function $u(a,u){fn(a),u=vs(a,u),a.g.has(u)&&(a.i=null,a.h-=a.g.get(u).length,a.g.delete(u))}function ju(a,u){return fn(a),u=vs(a,u),a.g.has(u)}n.forEach=function(a,u){fn(this),this.g.forEach(function(f,g){f.forEach(function(b){a.call(u,b,g,this)},this)},this)},n.na=function(){fn(this);const a=Array.from(this.g.values()),u=Array.from(this.g.keys()),f=[];for(let g=0;g<u.length;g++){const b=a[g];for(let S=0;S<b.length;S++)f.push(u[g])}return f},n.V=function(a){fn(this);let u=[];if(typeof a=="string")ju(this,a)&&(u=u.concat(this.g.get(vs(this,a))));else{a=Array.from(this.g.values());for(let f=0;f<a.length;f++)u=u.concat(a[f])}return u},n.set=function(a,u){return fn(this),this.i=null,a=vs(this,a),ju(this,a)&&(this.h-=this.g.get(a).length),this.g.set(a,[u]),this.h+=1,this},n.get=function(a,u){return a?(a=this.V(a),0<a.length?String(a[0]):u):u};function Gu(a,u,f){$u(a,u),0<f.length&&(a.i=null,a.g.set(vs(a,u),A(f)),a.h+=f.length)}n.toString=function(){if(this.i)return this.i;if(!this.g)return"";const a=[],u=Array.from(this.g.keys());for(var f=0;f<u.length;f++){var g=u[f];const S=encodeURIComponent(String(g)),O=this.V(g);for(g=0;g<O.length;g++){var b=S;O[g]!==""&&(b+="="+encodeURIComponent(String(O[g]))),a.push(b)}}return this.i=a.join("&")};function vs(a,u){return u=String(u),a.j&&(u=u.toLowerCase()),u}function Fy(a,u){u&&!a.j&&(fn(a),a.i=null,a.g.forEach(function(f,g){var b=g.toLowerCase();g!=b&&($u(this,g),Gu(this,b,f))},a)),a.j=u}function By(a,u){const f=new di;if(l.Image){const g=new Image;g.onload=E(pn,f,"TestLoadImage: loaded",!0,u,g),g.onerror=E(pn,f,"TestLoadImage: error",!1,u,g),g.onabort=E(pn,f,"TestLoadImage: abort",!1,u,g),g.ontimeout=E(pn,f,"TestLoadImage: timeout",!1,u,g),l.setTimeout(function(){g.ontimeout&&g.ontimeout()},1e4),g.src=a}else u(!1)}function Uy(a,u){const f=new di,g=new AbortController,b=setTimeout(()=>{g.abort(),pn(f,"TestPingServer: timeout",!1,u)},1e4);fetch(a,{signal:g.signal}).then(S=>{clearTimeout(b),S.ok?pn(f,"TestPingServer: ok",!0,u):pn(f,"TestPingServer: server error",!1,u)}).catch(()=>{clearTimeout(b),pn(f,"TestPingServer: error",!1,u)})}function pn(a,u,f,g,b){try{b&&(b.onload=null,b.onerror=null,b.onabort=null,b.ontimeout=null),g(f)}catch{}}function qy(){this.g=new Iy}function Wy(a,u,f){const g=f||"";try{Bu(a,function(b,S){let O=b;h(b)&&(O=ja(b)),u.push(g+S+"="+encodeURIComponent(O))})}catch(b){throw u.push(g+"type="+encodeURIComponent("_badmap")),b}}function Gr(a){this.l=a.Ub||null,this.j=a.eb||!1}R(Gr,Ga),Gr.prototype.g=function(){return new zr(this.l,this.j)},Gr.prototype.i=function(a){return function(){return a}}({});function zr(a,u){ze.call(this),this.D=a,this.o=u,this.m=void 0,this.status=this.readyState=0,this.responseType=this.responseText=this.response=this.statusText="",this.onreadystatechange=null,this.u=new Headers,this.h=null,this.B="GET",this.A="",this.g=!1,this.v=this.j=this.l=null}R(zr,ze),n=zr.prototype,n.open=function(a,u){if(this.readyState!=0)throw this.abort(),Error("Error reopening a connection");this.B=a,this.A=u,this.readyState=1,yi(this)},n.send=function(a){if(this.readyState!=1)throw this.abort(),Error("need to call open() first. ");this.g=!0;const u={headers:this.u,method:this.B,credentials:this.m,cache:void 0};a&&(u.body=a),(this.D||l).fetch(new Request(this.A,u)).then(this.Sa.bind(this),this.ga.bind(this))},n.abort=function(){this.response=this.responseText="",this.u=new Headers,this.status=0,this.j&&this.j.cancel("Request was aborted.").catch(()=>{}),1<=this.readyState&&this.g&&this.readyState!=4&&(this.g=!1,_i(this)),this.readyState=0},n.Sa=function(a){if(this.g&&(this.l=a,this.h||(this.status=this.l.status,this.statusText=this.l.statusText,this.h=a.headers,this.readyState=2,yi(this)),this.g&&(this.readyState=3,yi(this),this.g)))if(this.responseType==="arraybuffer")a.arrayBuffer().then(this.Qa.bind(this),this.ga.bind(this));else if(typeof l.ReadableStream<"u"&&"body"in a){if(this.j=a.body.getReader(),this.o){if(this.responseType)throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');this.response=[]}else this.response=this.responseText="",this.v=new TextDecoder;zu(this)}else a.text().then(this.Ra.bind(this),this.ga.bind(this))};function zu(a){a.j.read().then(a.Pa.bind(a)).catch(a.ga.bind(a))}n.Pa=function(a){if(this.g){if(this.o&&a.value)this.response.push(a.value);else if(!this.o){var u=a.value?a.value:new Uint8Array(0);(u=this.v.decode(u,{stream:!a.done}))&&(this.response=this.responseText+=u)}a.done?_i(this):yi(this),this.readyState==3&&zu(this)}},n.Ra=function(a){this.g&&(this.response=this.responseText=a,_i(this))},n.Qa=function(a){this.g&&(this.response=a,_i(this))},n.ga=function(){this.g&&_i(this)};function _i(a){a.readyState=4,a.l=null,a.j=null,a.v=null,yi(a)}n.setRequestHeader=function(a,u){this.u.append(a,u)},n.getResponseHeader=function(a){return this.h&&this.h.get(a.toLowerCase())||""},n.getAllResponseHeaders=function(){if(!this.h)return"";const a=[],u=this.h.entries();for(var f=u.next();!f.done;)f=f.value,a.push(f[0]+": "+f[1]),f=u.next();return a.join(`\r
`)};function yi(a){a.onreadystatechange&&a.onreadystatechange.call(a)}Object.defineProperty(zr.prototype,"withCredentials",{get:function(){return this.m==="include"},set:function(a){this.m=a?"include":"same-origin"}});function Hu(a){let u="";return ue(a,function(f,g){u+=g,u+=":",u+=f,u+=`\r
`}),u}function tl(a,u,f){e:{for(g in f){var g=!1;break e}g=!0}g||(f=Hu(f),typeof a=="string"?f!=null&&encodeURIComponent(String(f)):ve(a,u,f))}function Te(a){ze.call(this),this.headers=new Map,this.o=a||null,this.h=!1,this.v=this.g=null,this.D="",this.m=0,this.l="",this.j=this.B=this.u=this.A=!1,this.I=null,this.H="",this.J=!1}R(Te,ze);var $y=/^https?$/i,jy=["POST","PUT"];n=Te.prototype,n.Ha=function(a){this.J=a},n.ea=function(a,u,f,g){if(this.g)throw Error("[goog.net.XhrIo] Object is active with another request="+this.D+"; newUri="+a);u=u?u.toUpperCase():"GET",this.D=a,this.l="",this.m=0,this.A=!1,this.h=!0,this.g=this.o?this.o.g():Ka.g(),this.v=this.o?Tu(this.o):Tu(Ka),this.g.onreadystatechange=m(this.Ea,this);try{this.B=!0,this.g.open(u,String(a),!0),this.B=!1}catch(S){Ku(this,S);return}if(a=f||"",f=new Map(this.headers),g)if(Object.getPrototypeOf(g)===Object.prototype)for(var b in g)f.set(b,g[b]);else if(typeof g.keys=="function"&&typeof g.get=="function")for(const S of g.keys())f.set(S,g.get(S));else throw Error("Unknown input type for opt_headers: "+String(g));g=Array.from(f.keys()).find(S=>S.toLowerCase()=="content-type"),b=l.FormData&&a instanceof l.FormData,!(0<=Array.prototype.indexOf.call(jy,u,void 0))||g||b||f.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");for(const[S,O]of f)this.g.setRequestHeader(S,O);this.H&&(this.g.responseType=this.H),"withCredentials"in this.g&&this.g.withCredentials!==this.J&&(this.g.withCredentials=this.J);try{Ju(this),this.u=!0,this.g.send(a),this.u=!1}catch(S){Ku(this,S)}};function Ku(a,u){a.h=!1,a.g&&(a.j=!0,a.g.abort(),a.j=!1),a.l=u,a.m=5,Qu(a),Hr(a)}function Qu(a){a.A||(a.A=!0,et(a,"complete"),et(a,"error"))}n.abort=function(a){this.g&&this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1,this.m=a||7,et(this,"complete"),et(this,"abort"),Hr(this))},n.N=function(){this.g&&(this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1),Hr(this,!0)),Te.aa.N.call(this)},n.Ea=function(){this.s||(this.B||this.u||this.j?Yu(this):this.bb())},n.bb=function(){Yu(this)};function Yu(a){if(a.h&&typeof o<"u"&&(!a.v[1]||$t(a)!=4||a.Z()!=2)){if(a.u&&$t(a)==4)yu(a.Ea,0,a);else if(et(a,"readystatechange"),$t(a)==4){a.h=!1;try{const O=a.Z();e:switch(O){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:var u=!0;break e;default:u=!1}var f;if(!(f=u)){var g;if(g=O===0){var b=String(a.D).match(Uu)[1]||null;!b&&l.self&&l.self.location&&(b=l.self.location.protocol.slice(0,-1)),g=!$y.test(b?b.toLowerCase():"")}f=g}if(f)et(a,"complete"),et(a,"success");else{a.m=6;try{var S=2<$t(a)?a.g.statusText:""}catch{S=""}a.l=S+" ["+a.Z()+"]",Qu(a)}}finally{Hr(a)}}}}function Hr(a,u){if(a.g){Ju(a);const f=a.g,g=a.v[0]?()=>{}:null;a.g=null,a.v=null,u||et(a,"ready");try{f.onreadystatechange=g}catch{}}}function Ju(a){a.I&&(l.clearTimeout(a.I),a.I=null)}n.isActive=function(){return!!this.g};function $t(a){return a.g?a.g.readyState:0}n.Z=function(){try{return 2<$t(this)?this.g.status:-1}catch{return-1}},n.oa=function(){try{return this.g?this.g.responseText:""}catch{return""}},n.Oa=function(a){if(this.g){var u=this.g.responseText;return a&&u.indexOf(a)==0&&(u=u.substring(a.length)),Ty(u)}};function Xu(a){try{if(!a.g)return null;if("response"in a.g)return a.g.response;switch(a.H){case"":case"text":return a.g.responseText;case"arraybuffer":if("mozResponseArrayBuffer"in a.g)return a.g.mozResponseArrayBuffer}return null}catch{return null}}function Gy(a){const u={};a=(a.g&&2<=$t(a)&&a.g.getAllResponseHeaders()||"").split(`\r
`);for(let g=0;g<a.length;g++){if(U(a[g]))continue;var f=T(a[g]);const b=f[0];if(f=f[1],typeof f!="string")continue;f=f.trim();const S=u[b]||[];u[b]=S,S.push(f)}I(u,function(g){return g.join(", ")})}n.Ba=function(){return this.m},n.Ka=function(){return typeof this.l=="string"?this.l:String(this.l)};function vi(a,u,f){return f&&f.internalChannelParams&&f.internalChannelParams[a]||u}function Zu(a){this.Aa=0,this.i=[],this.j=new di,this.ia=this.qa=this.I=this.W=this.g=this.ya=this.D=this.H=this.m=this.S=this.o=null,this.Ya=this.U=0,this.Va=vi("failFast",!1,a),this.F=this.C=this.u=this.s=this.l=null,this.X=!0,this.za=this.T=-1,this.Y=this.v=this.B=0,this.Ta=vi("baseRetryDelayMs",5e3,a),this.cb=vi("retryDelaySeedMs",1e4,a),this.Wa=vi("forwardChannelMaxRetries",2,a),this.wa=vi("forwardChannelRequestTimeoutMs",2e4,a),this.pa=a&&a.xmlHttpFactory||void 0,this.Xa=a&&a.Tb||void 0,this.Ca=a&&a.useFetchStreams||!1,this.L=void 0,this.J=a&&a.supportsCrossDomainXhr||!1,this.K="",this.h=new xu(a&&a.concurrentRequestLimit),this.Da=new qy,this.P=a&&a.fastHandshake||!1,this.O=a&&a.encodeInitMessageHeaders||!1,this.P&&this.O&&(this.O=!1),this.Ua=a&&a.Rb||!1,a&&a.xa&&this.j.xa(),a&&a.forceLongPolling&&(this.X=!1),this.ba=!this.P&&this.X&&a&&a.detectBufferingProxy||!1,this.ja=void 0,a&&a.longPollingTimeout&&0<a.longPollingTimeout&&(this.ja=a.longPollingTimeout),this.ca=void 0,this.R=0,this.M=!1,this.ka=this.A=null}n=Zu.prototype,n.la=8,n.G=1,n.connect=function(a,u,f,g){tt(0),this.W=a,this.H=u||{},f&&g!==void 0&&(this.H.OSID=f,this.H.OAID=g),this.F=this.X,this.I=ld(this,null,this.W),Qr(this)};function nl(a){if(ed(a),a.G==3){var u=a.U++,f=Wt(a.I);if(ve(f,"SID",a.K),ve(f,"RID",u),ve(f,"TYPE","terminate"),Ei(a,f),u=new dn(a,a.j,u),u.L=2,u.v=jr(Wt(f)),f=!1,l.navigator&&l.navigator.sendBeacon)try{f=l.navigator.sendBeacon(u.v.toString(),"")}catch{}!f&&l.Image&&(new Image().src=u.v,f=!0),f||(u.g=cd(u.j,null),u.g.ea(u.v)),u.F=Date.now(),qr(u)}ad(a)}function Kr(a){a.g&&(il(a),a.g.cancel(),a.g=null)}function ed(a){Kr(a),a.u&&(l.clearTimeout(a.u),a.u=null),Yr(a),a.h.cancel(),a.s&&(typeof a.s=="number"&&l.clearTimeout(a.s),a.s=null)}function Qr(a){if(!Ou(a.h)&&!a.s){a.s=!0;var u=a.Ga;an||fs(),kt||(an(),kt=!0),ln.add(u,a),a.B=0}}function zy(a,u){return Mu(a.h)>=a.h.j-(a.s?1:0)?!1:a.s?(a.i=u.D.concat(a.i),!0):a.G==1||a.G==2||a.B>=(a.Va?0:a.Wa)?!1:(a.s=ui(m(a.Ga,a,u),od(a,a.B)),a.B++,!0)}n.Ga=function(a){if(this.s)if(this.s=null,this.G==1){if(!a){this.U=Math.floor(1e5*Math.random()),a=this.U++;const b=new dn(this,this.j,a);let S=this.o;if(this.S&&(S?(S=_(S),w(S,this.S)):S=this.S),this.m!==null||this.O||(b.H=S,S=null),this.P)e:{for(var u=0,f=0;f<this.i.length;f++){t:{var g=this.i[f];if("__data__"in g.map&&(g=g.map.__data__,typeof g=="string")){g=g.length;break t}g=void 0}if(g===void 0)break;if(u+=g,4096<u){u=f;break e}if(u===4096||f===this.i.length-1){u=f+1;break e}}u=1e3}else u=1e3;u=nd(this,b,u),f=Wt(this.I),ve(f,"RID",a),ve(f,"CVER",22),this.D&&ve(f,"X-HTTP-Session-Id",this.D),Ei(this,f),S&&(this.O?u="headers="+encodeURIComponent(String(Hu(S)))+"&"+u:this.m&&tl(f,this.m,S)),el(this.h,b),this.Ua&&ve(f,"TYPE","init"),this.P?(ve(f,"$req",u),ve(f,"SID","null"),b.T=!0,Ya(b,f,null)):Ya(b,f,u),this.G=2}}else this.G==3&&(a?td(this,a):this.i.length==0||Ou(this.h)||td(this))};function td(a,u){var f;u?f=u.l:f=a.U++;const g=Wt(a.I);ve(g,"SID",a.K),ve(g,"RID",f),ve(g,"AID",a.T),Ei(a,g),a.m&&a.o&&tl(g,a.m,a.o),f=new dn(a,a.j,f,a.B+1),a.m===null&&(f.H=a.o),u&&(a.i=u.D.concat(a.i)),u=nd(a,f,1e3),f.I=Math.round(.5*a.wa)+Math.round(.5*a.wa*Math.random()),el(a.h,f),Ya(f,g,u)}function Ei(a,u){a.H&&ue(a.H,function(f,g){ve(u,g,f)}),a.l&&Bu({},function(f,g){ve(u,g,f)})}function nd(a,u,f){f=Math.min(a.i.length,f);var g=a.l?m(a.l.Na,a.l,a):null;e:{var b=a.i;let S=-1;for(;;){const O=["count="+f];S==-1?0<f?(S=b[0].g,O.push("ofs="+S)):S=0:O.push("ofs="+S);let fe=!0;for(let Be=0;Be<f;Be++){let oe=b[Be].g;const He=b[Be].map;if(oe-=S,0>oe)S=Math.max(0,b[Be].g-100),fe=!1;else try{Wy(He,O,"req"+oe+"_")}catch{g&&g(He)}}if(fe){g=O.join("&");break e}}}return a=a.i.splice(0,f),u.D=a,g}function sd(a){if(!a.g&&!a.u){a.Y=1;var u=a.Fa;an||fs(),kt||(an(),kt=!0),ln.add(u,a),a.v=0}}function sl(a){return a.g||a.u||3<=a.v?!1:(a.Y++,a.u=ui(m(a.Fa,a),od(a,a.v)),a.v++,!0)}n.Fa=function(){if(this.u=null,id(this),this.ba&&!(this.M||this.g==null||0>=this.R)){var a=2*this.R;this.j.info("BP detection timer enabled: "+a),this.A=ui(m(this.ab,this),a)}},n.ab=function(){this.A&&(this.A=null,this.j.info("BP detection timeout reached."),this.j.info("Buffering proxy detected and switch to long-polling!"),this.F=!1,this.M=!0,tt(10),Kr(this),id(this))};function il(a){a.A!=null&&(l.clearTimeout(a.A),a.A=null)}function id(a){a.g=new dn(a,a.j,"rpc",a.Y),a.m===null&&(a.g.H=a.o),a.g.O=0;var u=Wt(a.qa);ve(u,"RID","rpc"),ve(u,"SID",a.K),ve(u,"AID",a.T),ve(u,"CI",a.F?"0":"1"),!a.F&&a.ja&&ve(u,"TO",a.ja),ve(u,"TYPE","xmlhttp"),Ei(a,u),a.m&&a.o&&tl(u,a.m,a.o),a.L&&(a.g.I=a.L);var f=a.g;a=a.ia,f.L=1,f.v=jr(Wt(u)),f.m=null,f.P=!0,Nu(f,a)}n.Za=function(){this.C!=null&&(this.C=null,Kr(this),sl(this),tt(19))};function Yr(a){a.C!=null&&(l.clearTimeout(a.C),a.C=null)}function rd(a,u){var f=null;if(a.g==u){Yr(a),il(a),a.g=null;var g=2}else if(Za(a.h,u))f=u.D,Vu(a.h,u),g=1;else return;if(a.G!=0){if(u.o)if(g==1){f=u.m?u.m.length:0,u=Date.now()-u.F;var b=a.B;g=Fr(),et(g,new Su(g,f)),Qr(a)}else sd(a);else if(b=u.s,b==3||b==0&&0<u.X||!(g==1&&zy(a,u)||g==2&&sl(a)))switch(f&&0<f.length&&(u=a.h,u.i=u.i.concat(f)),b){case 1:$n(a,5);break;case 4:$n(a,10);break;case 3:$n(a,6);break;default:$n(a,2)}}}function od(a,u){let f=a.Ta+Math.floor(Math.random()*a.cb);return a.isActive()||(f*=2),f*u}function $n(a,u){if(a.j.info("Error code "+u),u==2){var f=m(a.fb,a),g=a.Xa;const b=!g;g=new Wn(g||"//www.google.com/images/cleardot.gif"),l.location&&l.location.protocol=="http"||Wr(g,"https"),jr(g),b?By(g.toString(),f):Uy(g.toString(),f)}else tt(2);a.G=0,a.l&&a.l.sa(u),ad(a),ed(a)}n.fb=function(a){a?(this.j.info("Successfully pinged google.com"),tt(2)):(this.j.info("Failed to ping google.com"),tt(1))};function ad(a){if(a.G=0,a.ka=[],a.l){const u=Fu(a.h);(u.length!=0||a.i.length!=0)&&(P(a.ka,u),P(a.ka,a.i),a.h.i.length=0,A(a.i),a.i.length=0),a.l.ra()}}function ld(a,u,f){var g=f instanceof Wn?Wt(f):new Wn(f);if(g.g!="")u&&(g.g=u+"."+g.g),$r(g,g.s);else{var b=l.location;g=b.protocol,u=u?u+"."+b.hostname:b.hostname,b=+b.port;var S=new Wn(null);g&&Wr(S,g),u&&(S.g=u),b&&$r(S,b),f&&(S.l=f),g=S}return f=a.D,u=a.ya,f&&u&&ve(g,f,u),ve(g,"VER",a.la),Ei(a,g),g}function cd(a,u,f){if(u&&!a.J)throw Error("Can't create secondary domain capable XhrIo object.");return u=a.Ca&&!a.pa?new Te(new Gr({eb:f})):new Te(a.pa),u.Ha(a.J),u}n.isActive=function(){return!!this.l&&this.l.isActive(this)};function hd(){}n=hd.prototype,n.ua=function(){},n.ta=function(){},n.sa=function(){},n.ra=function(){},n.isActive=function(){return!0},n.Na=function(){};function Jr(){}Jr.prototype.g=function(a,u){return new dt(a,u)};function dt(a,u){ze.call(this),this.g=new Zu(u),this.l=a,this.h=u&&u.messageUrlParams||null,a=u&&u.messageHeaders||null,u&&u.clientProtocolHeaderRequired&&(a?a["X-Client-Protocol"]="webchannel":a={"X-Client-Protocol":"webchannel"}),this.g.o=a,a=u&&u.initMessageHeaders||null,u&&u.messageContentType&&(a?a["X-WebChannel-Content-Type"]=u.messageContentType:a={"X-WebChannel-Content-Type":u.messageContentType}),u&&u.va&&(a?a["X-WebChannel-Client-Profile"]=u.va:a={"X-WebChannel-Client-Profile":u.va}),this.g.S=a,(a=u&&u.Sb)&&!U(a)&&(this.g.m=a),this.v=u&&u.supportsCrossDomainXhr||!1,this.u=u&&u.sendRawJson||!1,(u=u&&u.httpSessionIdParam)&&!U(u)&&(this.g.D=u,a=this.h,a!==null&&u in a&&(a=this.h,u in a&&delete a[u])),this.j=new Es(this)}R(dt,ze),dt.prototype.m=function(){this.g.l=this.j,this.v&&(this.g.J=!0),this.g.connect(this.l,this.h||void 0)},dt.prototype.close=function(){nl(this.g)},dt.prototype.o=function(a){var u=this.g;if(typeof a=="string"){var f={};f.__data__=a,a=f}else this.u&&(f={},f.__data__=ja(a),a=f);u.i.push(new ky(u.Ya++,a)),u.G==3&&Qr(u)},dt.prototype.N=function(){this.g.l=null,delete this.j,nl(this.g),delete this.g,dt.aa.N.call(this)};function ud(a){za.call(this),a.__headers__&&(this.headers=a.__headers__,this.statusCode=a.__status__,delete a.__headers__,delete a.__status__);var u=a.__sm__;if(u){e:{for(const f in u){a=f;break e}a=void 0}(this.i=a)&&(a=this.i,u=u!==null&&a in u?u[a]:void 0),this.data=u}else this.data=a}R(ud,za);function dd(){Ha.call(this),this.status=1}R(dd,Ha);function Es(a){this.g=a}R(Es,hd),Es.prototype.ua=function(){et(this.g,"a")},Es.prototype.ta=function(a){et(this.g,new ud(a))},Es.prototype.sa=function(a){et(this.g,new dd)},Es.prototype.ra=function(){et(this.g,"b")},Jr.prototype.createWebChannel=Jr.prototype.g,dt.prototype.send=dt.prototype.o,dt.prototype.open=dt.prototype.m,dt.prototype.close=dt.prototype.close,bm=function(){return new Jr},Im=function(){return Fr()},Tm=Un,Hl={mb:0,pb:1,qb:2,Jb:3,Ob:4,Lb:5,Mb:6,Kb:7,Ib:8,Nb:9,PROXY:10,NOPROXY:11,Gb:12,Cb:13,Db:14,Bb:15,Eb:16,Fb:17,ib:18,hb:19,jb:20},Br.NO_ERROR=0,Br.TIMEOUT=8,Br.HTTP_ERROR=6,mo=Br,Au.COMPLETE="complete",wm=Au,Iu.EventType=ci,ci.OPEN="a",ci.CLOSE="b",ci.ERROR="c",ci.MESSAGE="d",ze.prototype.listen=ze.prototype.K,Li=Iu,Te.prototype.listenOnce=Te.prototype.L,Te.prototype.getLastError=Te.prototype.Ka,Te.prototype.getLastErrorCode=Te.prototype.Ba,Te.prototype.getStatus=Te.prototype.Z,Te.prototype.getResponseJson=Te.prototype.Oa,Te.prototype.getResponseText=Te.prototype.oa,Te.prototype.send=Te.prototype.ea,Te.prototype.setWithCredentials=Te.prototype.Ha,Em=Te}).apply(typeof eo<"u"?eo:typeof self<"u"?self:typeof window<"u"?window:{});const qd="@firebase/firestore";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ye{constructor(e){this.uid=e}isAuthenticated(){return this.uid!=null}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(e){return e.uid===this.uid}}Ye.UNAUTHENTICATED=new Ye(null),Ye.GOOGLE_CREDENTIALS=new Ye("google-credentials-uid"),Ye.FIRST_PARTY=new Ye("first-party-uid"),Ye.MOCK_USER=new Ye("mock-user");/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Xs="10.14.0";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const es=new ha("@firebase/firestore");function wi(){return es.logLevel}function B(n,...e){if(es.logLevel<=te.DEBUG){const t=e.map($c);es.debug(`Firestore (${Xs}): ${n}`,...t)}}function nn(n,...e){if(es.logLevel<=te.ERROR){const t=e.map($c);es.error(`Firestore (${Xs}): ${n}`,...t)}}function Vs(n,...e){if(es.logLevel<=te.WARN){const t=e.map($c);es.warn(`Firestore (${Xs}): ${n}`,...t)}}function $c(n){if(typeof n=="string")return n;try{/**
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
 */function j(n="Unexpected state"){const e=`FIRESTORE (${Xs}) INTERNAL ASSERTION FAILED: `+n;throw nn(e),new Error(e)}function re(n,e){n||j()}function Q(n,e){return n}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const k={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};class M extends on{constructor(e,t){super(e,t),this.code=e,this.message=t,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Lt{constructor(){this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Cm{constructor(e,t){this.user=t,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${e}`)}}class kT{getToken(){return Promise.resolve(null)}invalidateToken(){}start(e,t){e.enqueueRetryable(()=>t(Ye.UNAUTHENTICATED))}shutdown(){}}class PT{constructor(e){this.token=e,this.changeListener=null}getToken(){return Promise.resolve(this.token)}invalidateToken(){}start(e,t){this.changeListener=t,e.enqueueRetryable(()=>t(this.token.user))}shutdown(){this.changeListener=null}}class NT{constructor(e){this.t=e,this.currentUser=Ye.UNAUTHENTICATED,this.i=0,this.forceRefresh=!1,this.auth=null}start(e,t){re(this.o===void 0);let s=this.i;const i=c=>this.i!==s?(s=this.i,t(c)):Promise.resolve();let r=new Lt;this.o=()=>{this.i++,this.currentUser=this.u(),r.resolve(),r=new Lt,e.enqueueRetryable(()=>i(this.currentUser))};const o=()=>{const c=r;e.enqueueRetryable(async()=>{await c.promise,await i(this.currentUser)})},l=c=>{B("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=c,this.o&&(this.auth.addAuthTokenListener(this.o),o())};this.t.onInit(c=>l(c)),setTimeout(()=>{if(!this.auth){const c=this.t.getImmediate({optional:!0});c?l(c):(B("FirebaseAuthCredentialsProvider","Auth not yet detected"),r.resolve(),r=new Lt)}},0),o()}getToken(){const e=this.i,t=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(t).then(s=>this.i!==e?(B("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):s?(re(typeof s.accessToken=="string"),new Cm(s.accessToken,this.currentUser)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.o&&this.auth.removeAuthTokenListener(this.o),this.o=void 0}u(){const e=this.auth&&this.auth.getUid();return re(e===null||typeof e=="string"),new Ye(e)}}class DT{constructor(e,t,s){this.l=e,this.h=t,this.P=s,this.type="FirstParty",this.user=Ye.FIRST_PARTY,this.I=new Map}T(){return this.P?this.P():null}get headers(){this.I.set("X-Goog-AuthUser",this.l);const e=this.T();return e&&this.I.set("Authorization",e),this.h&&this.I.set("X-Goog-Iam-Authorization-Token",this.h),this.I}}class LT{constructor(e,t,s){this.l=e,this.h=t,this.P=s}getToken(){return Promise.resolve(new DT(this.l,this.h,this.P))}start(e,t){e.enqueueRetryable(()=>t(Ye.FIRST_PARTY))}shutdown(){}invalidateToken(){}}class xT{constructor(e){this.value=e,this.type="AppCheck",this.headers=new Map,e&&e.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class OT{constructor(e){this.A=e,this.forceRefresh=!1,this.appCheck=null,this.R=null}start(e,t){re(this.o===void 0);const s=r=>{r.error!=null&&B("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${r.error.message}`);const o=r.token!==this.R;return this.R=r.token,B("FirebaseAppCheckTokenProvider",`Received ${o?"new":"existing"} token.`),o?t(r.token):Promise.resolve()};this.o=r=>{e.enqueueRetryable(()=>s(r))};const i=r=>{B("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=r,this.o&&this.appCheck.addTokenListener(this.o)};this.A.onInit(r=>i(r)),setTimeout(()=>{if(!this.appCheck){const r=this.A.getImmediate({optional:!0});r?i(r):B("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}},0)}getToken(){const e=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(e).then(t=>t?(re(typeof t.token=="string"),this.R=t.token,new xT(t.token)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.o&&this.appCheck.removeTokenListener(this.o),this.o=void 0}}/**
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
 */function MT(n){const e=typeof self<"u"&&(self.crypto||self.msCrypto),t=new Uint8Array(n);if(e&&typeof e.getRandomValues=="function")e.getRandomValues(t);else for(let s=0;s<n;s++)t[s]=Math.floor(256*Math.random());return t}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Rm{static newId(){const e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",t=Math.floor(256/e.length)*e.length;let s="";for(;s.length<20;){const i=MT(40);for(let r=0;r<i.length;++r)s.length<20&&i[r]<t&&(s+=e.charAt(i[r]%e.length))}return s}}function ae(n,e){return n<e?-1:n>e?1:0}function Fs(n,e,t){return n.length===e.length&&n.every((s,i)=>t(s,e[i]))}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Le{constructor(e,t){if(this.seconds=e,this.nanoseconds=t,t<0)throw new M(k.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(t>=1e9)throw new M(k.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(e<-62135596800)throw new M(k.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e);if(e>=253402300800)throw new M(k.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e)}static now(){return Le.fromMillis(Date.now())}static fromDate(e){return Le.fromMillis(e.getTime())}static fromMillis(e){const t=Math.floor(e/1e3),s=Math.floor(1e6*(e-1e3*t));return new Le(t,s)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/1e6}_compareTo(e){return this.seconds===e.seconds?ae(this.nanoseconds,e.nanoseconds):ae(this.seconds,e.seconds)}isEqual(e){return e.seconds===this.seconds&&e.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{seconds:this.seconds,nanoseconds:this.nanoseconds}}valueOf(){const e=this.seconds- -62135596800;return String(e).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class H{constructor(e){this.timestamp=e}static fromTimestamp(e){return new H(e)}static min(){return new H(new Le(0,0))}static max(){return new H(new Le(253402300799,999999999))}compareTo(e){return this.timestamp._compareTo(e.timestamp)}isEqual(e){return this.timestamp.isEqual(e.timestamp)}toMicroseconds(){return 1e6*this.timestamp.seconds+this.timestamp.nanoseconds/1e3}toString(){return"SnapshotVersion("+this.timestamp.toString()+")"}toTimestamp(){return this.timestamp}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Xi{constructor(e,t,s){t===void 0?t=0:t>e.length&&j(),s===void 0?s=e.length-t:s>e.length-t&&j(),this.segments=e,this.offset=t,this.len=s}get length(){return this.len}isEqual(e){return Xi.comparator(this,e)===0}child(e){const t=this.segments.slice(this.offset,this.limit());return e instanceof Xi?e.forEach(s=>{t.push(s)}):t.push(e),this.construct(t)}limit(){return this.offset+this.length}popFirst(e){return e=e===void 0?1:e,this.construct(this.segments,this.offset+e,this.length-e)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(e){return this.segments[this.offset+e]}isEmpty(){return this.length===0}isPrefixOf(e){if(e.length<this.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}isImmediateParentOf(e){if(this.length+1!==e.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}forEach(e){for(let t=this.offset,s=this.limit();t<s;t++)e(this.segments[t])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(e,t){const s=Math.min(e.length,t.length);for(let i=0;i<s;i++){const r=e.get(i),o=t.get(i);if(r<o)return-1;if(r>o)return 1}return e.length<t.length?-1:e.length>t.length?1:0}}class pe extends Xi{construct(e,t,s){return new pe(e,t,s)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...e){const t=[];for(const s of e){if(s.indexOf("//")>=0)throw new M(k.INVALID_ARGUMENT,`Invalid segment (${s}). Paths must not contain // in them.`);t.push(...s.split("/").filter(i=>i.length>0))}return new pe(t)}static emptyPath(){return new pe([])}}const VT=/^[_a-zA-Z][_a-zA-Z0-9]*$/;class We extends Xi{construct(e,t,s){return new We(e,t,s)}static isValidIdentifier(e){return VT.test(e)}canonicalString(){return this.toArray().map(e=>(e=e.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),We.isValidIdentifier(e)||(e="`"+e+"`"),e)).join(".")}toString(){return this.canonicalString()}isKeyField(){return this.length===1&&this.get(0)==="__name__"}static keyField(){return new We(["__name__"])}static fromServerFormat(e){const t=[];let s="",i=0;const r=()=>{if(s.length===0)throw new M(k.INVALID_ARGUMENT,`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);t.push(s),s=""};let o=!1;for(;i<e.length;){const l=e[i];if(l==="\\"){if(i+1===e.length)throw new M(k.INVALID_ARGUMENT,"Path has trailing escape character: "+e);const c=e[i+1];if(c!=="\\"&&c!=="."&&c!=="`")throw new M(k.INVALID_ARGUMENT,"Path has invalid escape sequence: "+e);s+=c,i+=2}else l==="`"?(o=!o,i++):l!=="."||o?(s+=l,i++):(r(),i++)}if(r(),o)throw new M(k.INVALID_ARGUMENT,"Unterminated ` in path: "+e);return new We(t)}static emptyPath(){return new We([])}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class W{constructor(e){this.path=e}static fromPath(e){return new W(pe.fromString(e))}static fromName(e){return new W(pe.fromString(e).popFirst(5))}static empty(){return new W(pe.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(e){return this.path.length>=2&&this.path.get(this.path.length-2)===e}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(e){return e!==null&&pe.comparator(this.path,e.path)===0}toString(){return this.path.toString()}static comparator(e,t){return pe.comparator(e.path,t.path)}static isDocumentKey(e){return e.length%2==0}static fromSegments(e){return new W(new pe(e.slice()))}}function FT(n,e){const t=n.toTimestamp().seconds,s=n.toTimestamp().nanoseconds+1,i=H.fromTimestamp(s===1e9?new Le(t+1,0):new Le(t,s));return new Nn(i,W.empty(),e)}function BT(n){return new Nn(n.readTime,n.key,-1)}class Nn{constructor(e,t,s){this.readTime=e,this.documentKey=t,this.largestBatchId=s}static min(){return new Nn(H.min(),W.empty(),-1)}static max(){return new Nn(H.max(),W.empty(),-1)}}function UT(n,e){let t=n.readTime.compareTo(e.readTime);return t!==0?t:(t=W.comparator(n.documentKey,e.documentKey),t!==0?t:ae(n.largestBatchId,e.largestBatchId))}/**
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
 */const qT="The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.";class WT{constructor(){this.onCommittedListeners=[]}addOnCommittedListener(e){this.onCommittedListeners.push(e)}raiseOnCommittedEvent(){this.onCommittedListeners.forEach(e=>e())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function _r(n){if(n.code!==k.FAILED_PRECONDITION||n.message!==qT)throw n;B("LocalStore","Unexpectedly lost primary lease")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class N{constructor(e){this.nextCallback=null,this.catchCallback=null,this.result=void 0,this.error=void 0,this.isDone=!1,this.callbackAttached=!1,e(t=>{this.isDone=!0,this.result=t,this.nextCallback&&this.nextCallback(t)},t=>{this.isDone=!0,this.error=t,this.catchCallback&&this.catchCallback(t)})}catch(e){return this.next(void 0,e)}next(e,t){return this.callbackAttached&&j(),this.callbackAttached=!0,this.isDone?this.error?this.wrapFailure(t,this.error):this.wrapSuccess(e,this.result):new N((s,i)=>{this.nextCallback=r=>{this.wrapSuccess(e,r).next(s,i)},this.catchCallback=r=>{this.wrapFailure(t,r).next(s,i)}})}toPromise(){return new Promise((e,t)=>{this.next(e,t)})}wrapUserFunction(e){try{const t=e();return t instanceof N?t:N.resolve(t)}catch(t){return N.reject(t)}}wrapSuccess(e,t){return e?this.wrapUserFunction(()=>e(t)):N.resolve(t)}wrapFailure(e,t){return e?this.wrapUserFunction(()=>e(t)):N.reject(t)}static resolve(e){return new N((t,s)=>{t(e)})}static reject(e){return new N((t,s)=>{s(e)})}static waitFor(e){return new N((t,s)=>{let i=0,r=0,o=!1;e.forEach(l=>{++i,l.next(()=>{++r,o&&r===i&&t()},c=>s(c))}),o=!0,r===i&&t()})}static or(e){let t=N.resolve(!1);for(const s of e)t=t.next(i=>i?N.resolve(i):s());return t}static forEach(e,t){const s=[];return e.forEach((i,r)=>{s.push(t.call(this,i,r))}),this.waitFor(s)}static mapArray(e,t){return new N((s,i)=>{const r=e.length,o=new Array(r);let l=0;for(let c=0;c<r;c++){const h=c;t(e[h]).next(d=>{o[h]=d,++l,l===r&&s(o)},d=>i(d))}})}static doWhile(e,t){return new N((s,i)=>{const r=()=>{e()===!0?t().next(()=>{r()},i):s()};r()})}}function $T(n){const e=n.match(/Android ([\d.]+)/i),t=e?e[1].split(".").slice(0,2).join("."):"-1";return Number(t)}function yr(n){return n.name==="IndexedDbTransactionError"}/**
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
 */class jc{constructor(e,t){this.previousValue=e,t&&(t.sequenceNumberHandler=s=>this.ie(s),this.se=s=>t.writeSequenceNumber(s))}ie(e){return this.previousValue=Math.max(e,this.previousValue),this.previousValue}next(){const e=++this.previousValue;return this.se&&this.se(e),e}}jc.oe=-1;function vr(n){return n==null}function Mo(n){return n===0&&1/n==-1/0}function jT(n){return typeof n=="number"&&Number.isInteger(n)&&!Mo(n)&&n<=Number.MAX_SAFE_INTEGER&&n>=Number.MIN_SAFE_INTEGER}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Wd(n){let e=0;for(const t in n)Object.prototype.hasOwnProperty.call(n,t)&&e++;return e}function ls(n,e){for(const t in n)Object.prototype.hasOwnProperty.call(n,t)&&e(t,n[t])}function Sm(n){for(const e in n)if(Object.prototype.hasOwnProperty.call(n,e))return!1;return!0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let ke=class Kl{constructor(e,t){this.comparator=e,this.root=t||Cn.EMPTY}insert(e,t){return new Kl(this.comparator,this.root.insert(e,t,this.comparator).copy(null,null,Cn.BLACK,null,null))}remove(e){return new Kl(this.comparator,this.root.remove(e,this.comparator).copy(null,null,Cn.BLACK,null,null))}get(e){let t=this.root;for(;!t.isEmpty();){const s=this.comparator(e,t.key);if(s===0)return t.value;s<0?t=t.left:s>0&&(t=t.right)}return null}indexOf(e){let t=0,s=this.root;for(;!s.isEmpty();){const i=this.comparator(e,s.key);if(i===0)return t+s.left.size;i<0?s=s.left:(t+=s.left.size+1,s=s.right)}return-1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(e){return this.root.inorderTraversal(e)}forEach(e){this.inorderTraversal((t,s)=>(e(t,s),!1))}toString(){const e=[];return this.inorderTraversal((t,s)=>(e.push(`${t}:${s}`),!1)),`{${e.join(", ")}}`}reverseTraversal(e){return this.root.reverseTraversal(e)}getIterator(){return new to(this.root,null,this.comparator,!1)}getIteratorFrom(e){return new to(this.root,e,this.comparator,!1)}getReverseIterator(){return new to(this.root,null,this.comparator,!0)}getReverseIteratorFrom(e){return new to(this.root,e,this.comparator,!0)}},to=class{constructor(e,t,s,i){this.isReverse=i,this.nodeStack=[];let r=1;for(;!e.isEmpty();)if(r=t?s(e.key,t):1,t&&i&&(r*=-1),r<0)e=this.isReverse?e.left:e.right;else{if(r===0){this.nodeStack.push(e);break}this.nodeStack.push(e),e=this.isReverse?e.right:e.left}}getNext(){let e=this.nodeStack.pop();const t={key:e.key,value:e.value};if(this.isReverse)for(e=e.left;!e.isEmpty();)this.nodeStack.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack.push(e),e=e.left;return t}hasNext(){return this.nodeStack.length>0}peek(){if(this.nodeStack.length===0)return null;const e=this.nodeStack[this.nodeStack.length-1];return{key:e.key,value:e.value}}},Cn=class zt{constructor(e,t,s,i,r){this.key=e,this.value=t,this.color=s??zt.RED,this.left=i??zt.EMPTY,this.right=r??zt.EMPTY,this.size=this.left.size+1+this.right.size}copy(e,t,s,i,r){return new zt(e??this.key,t??this.value,s??this.color,i??this.left,r??this.right)}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,t,s){let i=this;const r=s(e,i.key);return i=r<0?i.copy(null,null,null,i.left.insert(e,t,s),null):r===0?i.copy(null,t,null,null,null):i.copy(null,null,null,null,i.right.insert(e,t,s)),i.fixUp()}removeMin(){if(this.left.isEmpty())return zt.EMPTY;let e=this;return e.left.isRed()||e.left.left.isRed()||(e=e.moveRedLeft()),e=e.copy(null,null,null,e.left.removeMin(),null),e.fixUp()}remove(e,t){let s,i=this;if(t(e,i.key)<0)i.left.isEmpty()||i.left.isRed()||i.left.left.isRed()||(i=i.moveRedLeft()),i=i.copy(null,null,null,i.left.remove(e,t),null);else{if(i.left.isRed()&&(i=i.rotateRight()),i.right.isEmpty()||i.right.isRed()||i.right.left.isRed()||(i=i.moveRedRight()),t(e,i.key)===0){if(i.right.isEmpty())return zt.EMPTY;s=i.right.min(),i=i.copy(s.key,s.value,null,null,i.right.removeMin())}i=i.copy(null,null,null,null,i.right.remove(e,t))}return i.fixUp()}isRed(){return this.color}fixUp(){let e=this;return e.right.isRed()&&!e.left.isRed()&&(e=e.rotateLeft()),e.left.isRed()&&e.left.left.isRed()&&(e=e.rotateRight()),e.left.isRed()&&e.right.isRed()&&(e=e.colorFlip()),e}moveRedLeft(){let e=this.colorFlip();return e.right.left.isRed()&&(e=e.copy(null,null,null,null,e.right.rotateRight()),e=e.rotateLeft(),e=e.colorFlip()),e}moveRedRight(){let e=this.colorFlip();return e.left.left.isRed()&&(e=e.rotateRight(),e=e.colorFlip()),e}rotateLeft(){const e=this.copy(null,null,zt.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight(){const e=this.copy(null,null,zt.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip(){const e=this.left.copy(null,null,!this.left.color,null,null),t=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,t)}checkMaxDepth(){const e=this.check();return Math.pow(2,e)<=this.size+1}check(){if(this.isRed()&&this.left.isRed()||this.right.isRed())throw j();const e=this.left.check();if(e!==this.right.check())throw j();return e+(this.isRed()?0:1)}};Cn.EMPTY=null,Cn.RED=!0,Cn.BLACK=!1;Cn.EMPTY=new class{constructor(){this.size=0}get key(){throw j()}get value(){throw j()}get color(){throw j()}get left(){throw j()}get right(){throw j()}copy(e,t,s,i,r){return this}insert(e,t,s){return new Cn(e,t)}remove(e,t){return this}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $e{constructor(e){this.comparator=e,this.data=new ke(this.comparator)}has(e){return this.data.get(e)!==null}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(e){return this.data.indexOf(e)}forEach(e){this.data.inorderTraversal((t,s)=>(e(t),!1))}forEachInRange(e,t){const s=this.data.getIteratorFrom(e[0]);for(;s.hasNext();){const i=s.getNext();if(this.comparator(i.key,e[1])>=0)return;t(i.key)}}forEachWhile(e,t){let s;for(s=t!==void 0?this.data.getIteratorFrom(t):this.data.getIterator();s.hasNext();)if(!e(s.getNext().key))return}firstAfterOrEqual(e){const t=this.data.getIteratorFrom(e);return t.hasNext()?t.getNext().key:null}getIterator(){return new $d(this.data.getIterator())}getIteratorFrom(e){return new $d(this.data.getIteratorFrom(e))}add(e){return this.copy(this.data.remove(e).insert(e,!0))}delete(e){return this.has(e)?this.copy(this.data.remove(e)):this}isEmpty(){return this.data.isEmpty()}unionWith(e){let t=this;return t.size<e.size&&(t=e,e=this),e.forEach(s=>{t=t.add(s)}),t}isEqual(e){if(!(e instanceof $e)||this.size!==e.size)return!1;const t=this.data.getIterator(),s=e.data.getIterator();for(;t.hasNext();){const i=t.getNext().key,r=s.getNext().key;if(this.comparator(i,r)!==0)return!1}return!0}toArray(){const e=[];return this.forEach(t=>{e.push(t)}),e}toString(){const e=[];return this.forEach(t=>e.push(t)),"SortedSet("+e.toString()+")"}copy(e){const t=new $e(this.comparator);return t.data=e,t}}class $d{constructor(e){this.iter=e}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}}/**
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
 */class ft{constructor(e){this.fields=e,e.sort(We.comparator)}static empty(){return new ft([])}unionWith(e){let t=new $e(We.comparator);for(const s of this.fields)t=t.add(s);for(const s of e)t=t.add(s);return new ft(t.toArray())}covers(e){for(const t of this.fields)if(t.isPrefixOf(e))return!0;return!1}isEqual(e){return Fs(this.fields,e.fields,(t,s)=>t.isEqual(s))}}/**
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
 */class Am extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}}/**
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
 */class je{constructor(e){this.binaryString=e}static fromBase64String(e){const t=function(i){try{return atob(i)}catch(r){throw typeof DOMException<"u"&&r instanceof DOMException?new Am("Invalid base64 string: "+r):r}}(e);return new je(t)}static fromUint8Array(e){const t=function(i){let r="";for(let o=0;o<i.length;++o)r+=String.fromCharCode(i[o]);return r}(e);return new je(t)}[Symbol.iterator](){let e=0;return{next:()=>e<this.binaryString.length?{value:this.binaryString.charCodeAt(e++),done:!1}:{value:void 0,done:!0}}}toBase64(){return function(t){return btoa(t)}(this.binaryString)}toUint8Array(){return function(t){const s=new Uint8Array(t.length);for(let i=0;i<t.length;i++)s[i]=t.charCodeAt(i);return s}(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(e){return ae(this.binaryString,e.binaryString)}isEqual(e){return this.binaryString===e.binaryString}}je.EMPTY_BYTE_STRING=new je("");const GT=new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);function Dn(n){if(re(!!n),typeof n=="string"){let e=0;const t=GT.exec(n);if(re(!!t),t[1]){let i=t[1];i=(i+"000000000").substr(0,9),e=Number(i)}const s=new Date(n);return{seconds:Math.floor(s.getTime()/1e3),nanos:e}}return{seconds:be(n.seconds),nanos:be(n.nanos)}}function be(n){return typeof n=="number"?n:typeof n=="string"?Number(n):0}function ts(n){return typeof n=="string"?je.fromBase64String(n):je.fromUint8Array(n)}/**
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
 */function Gc(n){var e,t;return((t=(((e=n==null?void 0:n.mapValue)===null||e===void 0?void 0:e.fields)||{}).__type__)===null||t===void 0?void 0:t.stringValue)==="server_timestamp"}function zc(n){const e=n.mapValue.fields.__previous_value__;return Gc(e)?zc(e):e}function Zi(n){const e=Dn(n.mapValue.fields.__local_write_time__.timestampValue);return new Le(e.seconds,e.nanos)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zT{constructor(e,t,s,i,r,o,l,c,h){this.databaseId=e,this.appId=t,this.persistenceKey=s,this.host=i,this.ssl=r,this.forceLongPolling=o,this.autoDetectLongPolling=l,this.longPollingOptions=c,this.useFetchStreams=h}}class er{constructor(e,t){this.projectId=e,this.database=t||"(default)"}static empty(){return new er("","")}get isDefaultDatabase(){return this.database==="(default)"}isEqual(e){return e instanceof er&&e.projectId===this.projectId&&e.database===this.database}}/**
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
 */const no={mapValue:{}};function ns(n){return"nullValue"in n?0:"booleanValue"in n?1:"integerValue"in n||"doubleValue"in n?2:"timestampValue"in n?3:"stringValue"in n?5:"bytesValue"in n?6:"referenceValue"in n?7:"geoPointValue"in n?8:"arrayValue"in n?9:"mapValue"in n?Gc(n)?4:KT(n)?9007199254740991:HT(n)?10:11:j()}function Mt(n,e){if(n===e)return!0;const t=ns(n);if(t!==ns(e))return!1;switch(t){case 0:case 9007199254740991:return!0;case 1:return n.booleanValue===e.booleanValue;case 4:return Zi(n).isEqual(Zi(e));case 3:return function(i,r){if(typeof i.timestampValue=="string"&&typeof r.timestampValue=="string"&&i.timestampValue.length===r.timestampValue.length)return i.timestampValue===r.timestampValue;const o=Dn(i.timestampValue),l=Dn(r.timestampValue);return o.seconds===l.seconds&&o.nanos===l.nanos}(n,e);case 5:return n.stringValue===e.stringValue;case 6:return function(i,r){return ts(i.bytesValue).isEqual(ts(r.bytesValue))}(n,e);case 7:return n.referenceValue===e.referenceValue;case 8:return function(i,r){return be(i.geoPointValue.latitude)===be(r.geoPointValue.latitude)&&be(i.geoPointValue.longitude)===be(r.geoPointValue.longitude)}(n,e);case 2:return function(i,r){if("integerValue"in i&&"integerValue"in r)return be(i.integerValue)===be(r.integerValue);if("doubleValue"in i&&"doubleValue"in r){const o=be(i.doubleValue),l=be(r.doubleValue);return o===l?Mo(o)===Mo(l):isNaN(o)&&isNaN(l)}return!1}(n,e);case 9:return Fs(n.arrayValue.values||[],e.arrayValue.values||[],Mt);case 10:case 11:return function(i,r){const o=i.mapValue.fields||{},l=r.mapValue.fields||{};if(Wd(o)!==Wd(l))return!1;for(const c in o)if(o.hasOwnProperty(c)&&(l[c]===void 0||!Mt(o[c],l[c])))return!1;return!0}(n,e);default:return j()}}function tr(n,e){return(n.values||[]).find(t=>Mt(t,e))!==void 0}function Bs(n,e){if(n===e)return 0;const t=ns(n),s=ns(e);if(t!==s)return ae(t,s);switch(t){case 0:case 9007199254740991:return 0;case 1:return ae(n.booleanValue,e.booleanValue);case 2:return function(r,o){const l=be(r.integerValue||r.doubleValue),c=be(o.integerValue||o.doubleValue);return l<c?-1:l>c?1:l===c?0:isNaN(l)?isNaN(c)?0:-1:1}(n,e);case 3:return jd(n.timestampValue,e.timestampValue);case 4:return jd(Zi(n),Zi(e));case 5:return ae(n.stringValue,e.stringValue);case 6:return function(r,o){const l=ts(r),c=ts(o);return l.compareTo(c)}(n.bytesValue,e.bytesValue);case 7:return function(r,o){const l=r.split("/"),c=o.split("/");for(let h=0;h<l.length&&h<c.length;h++){const d=ae(l[h],c[h]);if(d!==0)return d}return ae(l.length,c.length)}(n.referenceValue,e.referenceValue);case 8:return function(r,o){const l=ae(be(r.latitude),be(o.latitude));return l!==0?l:ae(be(r.longitude),be(o.longitude))}(n.geoPointValue,e.geoPointValue);case 9:return Gd(n.arrayValue,e.arrayValue);case 10:return function(r,o){var l,c,h,d;const p=r.fields||{},m=o.fields||{},E=(l=p.value)===null||l===void 0?void 0:l.arrayValue,R=(c=m.value)===null||c===void 0?void 0:c.arrayValue,A=ae(((h=E==null?void 0:E.values)===null||h===void 0?void 0:h.length)||0,((d=R==null?void 0:R.values)===null||d===void 0?void 0:d.length)||0);return A!==0?A:Gd(E,R)}(n.mapValue,e.mapValue);case 11:return function(r,o){if(r===no.mapValue&&o===no.mapValue)return 0;if(r===no.mapValue)return 1;if(o===no.mapValue)return-1;const l=r.fields||{},c=Object.keys(l),h=o.fields||{},d=Object.keys(h);c.sort(),d.sort();for(let p=0;p<c.length&&p<d.length;++p){const m=ae(c[p],d[p]);if(m!==0)return m;const E=Bs(l[c[p]],h[d[p]]);if(E!==0)return E}return ae(c.length,d.length)}(n.mapValue,e.mapValue);default:throw j()}}function jd(n,e){if(typeof n=="string"&&typeof e=="string"&&n.length===e.length)return ae(n,e);const t=Dn(n),s=Dn(e),i=ae(t.seconds,s.seconds);return i!==0?i:ae(t.nanos,s.nanos)}function Gd(n,e){const t=n.values||[],s=e.values||[];for(let i=0;i<t.length&&i<s.length;++i){const r=Bs(t[i],s[i]);if(r)return r}return ae(t.length,s.length)}function Us(n){return Ql(n)}function Ql(n){return"nullValue"in n?"null":"booleanValue"in n?""+n.booleanValue:"integerValue"in n?""+n.integerValue:"doubleValue"in n?""+n.doubleValue:"timestampValue"in n?function(t){const s=Dn(t);return`time(${s.seconds},${s.nanos})`}(n.timestampValue):"stringValue"in n?n.stringValue:"bytesValue"in n?function(t){return ts(t).toBase64()}(n.bytesValue):"referenceValue"in n?function(t){return W.fromName(t).toString()}(n.referenceValue):"geoPointValue"in n?function(t){return`geo(${t.latitude},${t.longitude})`}(n.geoPointValue):"arrayValue"in n?function(t){let s="[",i=!0;for(const r of t.values||[])i?i=!1:s+=",",s+=Ql(r);return s+"]"}(n.arrayValue):"mapValue"in n?function(t){const s=Object.keys(t.fields||{}).sort();let i="{",r=!0;for(const o of s)r?r=!1:i+=",",i+=`${o}:${Ql(t.fields[o])}`;return i+"}"}(n.mapValue):j()}function zd(n,e){return{referenceValue:`projects/${n.projectId}/databases/${n.database}/documents/${e.path.canonicalString()}`}}function Yl(n){return!!n&&"integerValue"in n}function Hc(n){return!!n&&"arrayValue"in n}function Hd(n){return!!n&&"nullValue"in n}function Kd(n){return!!n&&"doubleValue"in n&&isNaN(Number(n.doubleValue))}function go(n){return!!n&&"mapValue"in n}function HT(n){var e,t;return((t=(((e=n==null?void 0:n.mapValue)===null||e===void 0?void 0:e.fields)||{}).__type__)===null||t===void 0?void 0:t.stringValue)==="__vector__"}function Fi(n){if(n.geoPointValue)return{geoPointValue:Object.assign({},n.geoPointValue)};if(n.timestampValue&&typeof n.timestampValue=="object")return{timestampValue:Object.assign({},n.timestampValue)};if(n.mapValue){const e={mapValue:{fields:{}}};return ls(n.mapValue.fields,(t,s)=>e.mapValue.fields[t]=Fi(s)),e}if(n.arrayValue){const e={arrayValue:{values:[]}};for(let t=0;t<(n.arrayValue.values||[]).length;++t)e.arrayValue.values[t]=Fi(n.arrayValue.values[t]);return e}return Object.assign({},n)}function KT(n){return(((n.mapValue||{}).fields||{}).__type__||{}).stringValue==="__max__"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class st{constructor(e){this.value=e}static empty(){return new st({mapValue:{}})}field(e){if(e.isEmpty())return this.value;{let t=this.value;for(let s=0;s<e.length-1;++s)if(t=(t.mapValue.fields||{})[e.get(s)],!go(t))return null;return t=(t.mapValue.fields||{})[e.lastSegment()],t||null}}set(e,t){this.getFieldsMap(e.popLast())[e.lastSegment()]=Fi(t)}setAll(e){let t=We.emptyPath(),s={},i=[];e.forEach((o,l)=>{if(!t.isImmediateParentOf(l)){const c=this.getFieldsMap(t);this.applyChanges(c,s,i),s={},i=[],t=l.popLast()}o?s[l.lastSegment()]=Fi(o):i.push(l.lastSegment())});const r=this.getFieldsMap(t);this.applyChanges(r,s,i)}delete(e){const t=this.field(e.popLast());go(t)&&t.mapValue.fields&&delete t.mapValue.fields[e.lastSegment()]}isEqual(e){return Mt(this.value,e.value)}getFieldsMap(e){let t=this.value;t.mapValue.fields||(t.mapValue={fields:{}});for(let s=0;s<e.length;++s){let i=t.mapValue.fields[e.get(s)];go(i)&&i.mapValue.fields||(i={mapValue:{fields:{}}},t.mapValue.fields[e.get(s)]=i),t=i}return t.mapValue.fields}applyChanges(e,t,s){ls(t,(i,r)=>e[i]=r);for(const i of s)delete e[i]}clone(){return new st(Fi(this.value))}}function km(n){const e=[];return ls(n.fields,(t,s)=>{const i=new We([t]);if(go(s)){const r=km(s.mapValue).fields;if(r.length===0)e.push(i);else for(const o of r)e.push(i.child(o))}else e.push(i)}),new ft(e)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fe{constructor(e,t,s,i,r,o,l){this.key=e,this.documentType=t,this.version=s,this.readTime=i,this.createTime=r,this.data=o,this.documentState=l}static newInvalidDocument(e){return new Fe(e,0,H.min(),H.min(),H.min(),st.empty(),0)}static newFoundDocument(e,t,s,i){return new Fe(e,1,t,H.min(),s,i,0)}static newNoDocument(e,t){return new Fe(e,2,t,H.min(),H.min(),st.empty(),0)}static newUnknownDocument(e,t){return new Fe(e,3,t,H.min(),H.min(),st.empty(),2)}convertToFoundDocument(e,t){return!this.createTime.isEqual(H.min())||this.documentType!==2&&this.documentType!==0||(this.createTime=e),this.version=e,this.documentType=1,this.data=t,this.documentState=0,this}convertToNoDocument(e){return this.version=e,this.documentType=2,this.data=st.empty(),this.documentState=0,this}convertToUnknownDocument(e){return this.version=e,this.documentType=3,this.data=st.empty(),this.documentState=2,this}setHasCommittedMutations(){return this.documentState=2,this}setHasLocalMutations(){return this.documentState=1,this.version=H.min(),this}setReadTime(e){return this.readTime=e,this}get hasLocalMutations(){return this.documentState===1}get hasCommittedMutations(){return this.documentState===2}get hasPendingWrites(){return this.hasLocalMutations||this.hasCommittedMutations}isValidDocument(){return this.documentType!==0}isFoundDocument(){return this.documentType===1}isNoDocument(){return this.documentType===2}isUnknownDocument(){return this.documentType===3}isEqual(e){return e instanceof Fe&&this.key.isEqual(e.key)&&this.version.isEqual(e.version)&&this.documentType===e.documentType&&this.documentState===e.documentState&&this.data.isEqual(e.data)}mutableCopy(){return new Fe(this.key,this.documentType,this.version,this.readTime,this.createTime,this.data.clone(),this.documentState)}toString(){return`Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`}}/**
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
 */class Vo{constructor(e,t){this.position=e,this.inclusive=t}}function Qd(n,e,t){let s=0;for(let i=0;i<n.position.length;i++){const r=e[i],o=n.position[i];if(r.field.isKeyField()?s=W.comparator(W.fromName(o.referenceValue),t.key):s=Bs(o,t.data.field(r.field)),r.dir==="desc"&&(s*=-1),s!==0)break}return s}function Yd(n,e){if(n===null)return e===null;if(e===null||n.inclusive!==e.inclusive||n.position.length!==e.position.length)return!1;for(let t=0;t<n.position.length;t++)if(!Mt(n.position[t],e.position[t]))return!1;return!0}/**
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
 */class nr{constructor(e,t="asc"){this.field=e,this.dir=t}}function QT(n,e){return n.dir===e.dir&&n.field.isEqual(e.field)}/**
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
 */class Pm{}class Se extends Pm{constructor(e,t,s){super(),this.field=e,this.op=t,this.value=s}static create(e,t,s){return e.isKeyField()?t==="in"||t==="not-in"?this.createKeyFieldInFilter(e,t,s):new JT(e,t,s):t==="array-contains"?new eI(e,s):t==="in"?new tI(e,s):t==="not-in"?new nI(e,s):t==="array-contains-any"?new sI(e,s):new Se(e,t,s)}static createKeyFieldInFilter(e,t,s){return t==="in"?new XT(e,s):new ZT(e,s)}matches(e){const t=e.data.field(this.field);return this.op==="!="?t!==null&&this.matchesComparison(Bs(t,this.value)):t!==null&&ns(this.value)===ns(t)&&this.matchesComparison(Bs(t,this.value))}matchesComparison(e){switch(this.op){case"<":return e<0;case"<=":return e<=0;case"==":return e===0;case"!=":return e!==0;case">":return e>0;case">=":return e>=0;default:return j()}}isInequality(){return["<","<=",">",">=","!=","not-in"].indexOf(this.op)>=0}getFlattenedFilters(){return[this]}getFilters(){return[this]}}class At extends Pm{constructor(e,t){super(),this.filters=e,this.op=t,this.ae=null}static create(e,t){return new At(e,t)}matches(e){return Nm(this)?this.filters.find(t=>!t.matches(e))===void 0:this.filters.find(t=>t.matches(e))!==void 0}getFlattenedFilters(){return this.ae!==null||(this.ae=this.filters.reduce((e,t)=>e.concat(t.getFlattenedFilters()),[])),this.ae}getFilters(){return Object.assign([],this.filters)}}function Nm(n){return n.op==="and"}function Dm(n){return YT(n)&&Nm(n)}function YT(n){for(const e of n.filters)if(e instanceof At)return!1;return!0}function Jl(n){if(n instanceof Se)return n.field.canonicalString()+n.op.toString()+Us(n.value);if(Dm(n))return n.filters.map(e=>Jl(e)).join(",");{const e=n.filters.map(t=>Jl(t)).join(",");return`${n.op}(${e})`}}function Lm(n,e){return n instanceof Se?function(s,i){return i instanceof Se&&s.op===i.op&&s.field.isEqual(i.field)&&Mt(s.value,i.value)}(n,e):n instanceof At?function(s,i){return i instanceof At&&s.op===i.op&&s.filters.length===i.filters.length?s.filters.reduce((r,o,l)=>r&&Lm(o,i.filters[l]),!0):!1}(n,e):void j()}function xm(n){return n instanceof Se?function(t){return`${t.field.canonicalString()} ${t.op} ${Us(t.value)}`}(n):n instanceof At?function(t){return t.op.toString()+" {"+t.getFilters().map(xm).join(" ,")+"}"}(n):"Filter"}class JT extends Se{constructor(e,t,s){super(e,t,s),this.key=W.fromName(s.referenceValue)}matches(e){const t=W.comparator(e.key,this.key);return this.matchesComparison(t)}}class XT extends Se{constructor(e,t){super(e,"in",t),this.keys=Om("in",t)}matches(e){return this.keys.some(t=>t.isEqual(e.key))}}class ZT extends Se{constructor(e,t){super(e,"not-in",t),this.keys=Om("not-in",t)}matches(e){return!this.keys.some(t=>t.isEqual(e.key))}}function Om(n,e){var t;return(((t=e.arrayValue)===null||t===void 0?void 0:t.values)||[]).map(s=>W.fromName(s.referenceValue))}class eI extends Se{constructor(e,t){super(e,"array-contains",t)}matches(e){const t=e.data.field(this.field);return Hc(t)&&tr(t.arrayValue,this.value)}}class tI extends Se{constructor(e,t){super(e,"in",t)}matches(e){const t=e.data.field(this.field);return t!==null&&tr(this.value.arrayValue,t)}}class nI extends Se{constructor(e,t){super(e,"not-in",t)}matches(e){if(tr(this.value.arrayValue,{nullValue:"NULL_VALUE"}))return!1;const t=e.data.field(this.field);return t!==null&&!tr(this.value.arrayValue,t)}}class sI extends Se{constructor(e,t){super(e,"array-contains-any",t)}matches(e){const t=e.data.field(this.field);return!(!Hc(t)||!t.arrayValue.values)&&t.arrayValue.values.some(s=>tr(this.value.arrayValue,s))}}/**
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
 */class iI{constructor(e,t=null,s=[],i=[],r=null,o=null,l=null){this.path=e,this.collectionGroup=t,this.orderBy=s,this.filters=i,this.limit=r,this.startAt=o,this.endAt=l,this.ue=null}}function Jd(n,e=null,t=[],s=[],i=null,r=null,o=null){return new iI(n,e,t,s,i,r,o)}function Kc(n){const e=Q(n);if(e.ue===null){let t=e.path.canonicalString();e.collectionGroup!==null&&(t+="|cg:"+e.collectionGroup),t+="|f:",t+=e.filters.map(s=>Jl(s)).join(","),t+="|ob:",t+=e.orderBy.map(s=>function(r){return r.field.canonicalString()+r.dir}(s)).join(","),vr(e.limit)||(t+="|l:",t+=e.limit),e.startAt&&(t+="|lb:",t+=e.startAt.inclusive?"b:":"a:",t+=e.startAt.position.map(s=>Us(s)).join(",")),e.endAt&&(t+="|ub:",t+=e.endAt.inclusive?"a:":"b:",t+=e.endAt.position.map(s=>Us(s)).join(",")),e.ue=t}return e.ue}function Qc(n,e){if(n.limit!==e.limit||n.orderBy.length!==e.orderBy.length)return!1;for(let t=0;t<n.orderBy.length;t++)if(!QT(n.orderBy[t],e.orderBy[t]))return!1;if(n.filters.length!==e.filters.length)return!1;for(let t=0;t<n.filters.length;t++)if(!Lm(n.filters[t],e.filters[t]))return!1;return n.collectionGroup===e.collectionGroup&&!!n.path.isEqual(e.path)&&!!Yd(n.startAt,e.startAt)&&Yd(n.endAt,e.endAt)}function Xl(n){return W.isDocumentKey(n.path)&&n.collectionGroup===null&&n.filters.length===0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Zs{constructor(e,t=null,s=[],i=[],r=null,o="F",l=null,c=null){this.path=e,this.collectionGroup=t,this.explicitOrderBy=s,this.filters=i,this.limit=r,this.limitType=o,this.startAt=l,this.endAt=c,this.ce=null,this.le=null,this.he=null,this.startAt,this.endAt}}function rI(n,e,t,s,i,r,o,l){return new Zs(n,e,t,s,i,r,o,l)}function Yc(n){return new Zs(n)}function Xd(n){return n.filters.length===0&&n.limit===null&&n.startAt==null&&n.endAt==null&&(n.explicitOrderBy.length===0||n.explicitOrderBy.length===1&&n.explicitOrderBy[0].field.isKeyField())}function Mm(n){return n.collectionGroup!==null}function Bi(n){const e=Q(n);if(e.ce===null){e.ce=[];const t=new Set;for(const r of e.explicitOrderBy)e.ce.push(r),t.add(r.field.canonicalString());const s=e.explicitOrderBy.length>0?e.explicitOrderBy[e.explicitOrderBy.length-1].dir:"asc";(function(o){let l=new $e(We.comparator);return o.filters.forEach(c=>{c.getFlattenedFilters().forEach(h=>{h.isInequality()&&(l=l.add(h.field))})}),l})(e).forEach(r=>{t.has(r.canonicalString())||r.isKeyField()||e.ce.push(new nr(r,s))}),t.has(We.keyField().canonicalString())||e.ce.push(new nr(We.keyField(),s))}return e.ce}function xt(n){const e=Q(n);return e.le||(e.le=oI(e,Bi(n))),e.le}function oI(n,e){if(n.limitType==="F")return Jd(n.path,n.collectionGroup,e,n.filters,n.limit,n.startAt,n.endAt);{e=e.map(i=>{const r=i.dir==="desc"?"asc":"desc";return new nr(i.field,r)});const t=n.endAt?new Vo(n.endAt.position,n.endAt.inclusive):null,s=n.startAt?new Vo(n.startAt.position,n.startAt.inclusive):null;return Jd(n.path,n.collectionGroup,e,n.filters,n.limit,t,s)}}function Zl(n,e){const t=n.filters.concat([e]);return new Zs(n.path,n.collectionGroup,n.explicitOrderBy.slice(),t,n.limit,n.limitType,n.startAt,n.endAt)}function Fo(n,e,t){return new Zs(n.path,n.collectionGroup,n.explicitOrderBy.slice(),n.filters.slice(),e,t,n.startAt,n.endAt)}function ma(n,e){return Qc(xt(n),xt(e))&&n.limitType===e.limitType}function Vm(n){return`${Kc(xt(n))}|lt:${n.limitType}`}function bs(n){return`Query(target=${function(t){let s=t.path.canonicalString();return t.collectionGroup!==null&&(s+=" collectionGroup="+t.collectionGroup),t.filters.length>0&&(s+=`, filters: [${t.filters.map(i=>xm(i)).join(", ")}]`),vr(t.limit)||(s+=", limit: "+t.limit),t.orderBy.length>0&&(s+=`, orderBy: [${t.orderBy.map(i=>function(o){return`${o.field.canonicalString()} (${o.dir})`}(i)).join(", ")}]`),t.startAt&&(s+=", startAt: ",s+=t.startAt.inclusive?"b:":"a:",s+=t.startAt.position.map(i=>Us(i)).join(",")),t.endAt&&(s+=", endAt: ",s+=t.endAt.inclusive?"a:":"b:",s+=t.endAt.position.map(i=>Us(i)).join(",")),`Target(${s})`}(xt(n))}; limitType=${n.limitType})`}function ga(n,e){return e.isFoundDocument()&&function(s,i){const r=i.key.path;return s.collectionGroup!==null?i.key.hasCollectionId(s.collectionGroup)&&s.path.isPrefixOf(r):W.isDocumentKey(s.path)?s.path.isEqual(r):s.path.isImmediateParentOf(r)}(n,e)&&function(s,i){for(const r of Bi(s))if(!r.field.isKeyField()&&i.data.field(r.field)===null)return!1;return!0}(n,e)&&function(s,i){for(const r of s.filters)if(!r.matches(i))return!1;return!0}(n,e)&&function(s,i){return!(s.startAt&&!function(o,l,c){const h=Qd(o,l,c);return o.inclusive?h<=0:h<0}(s.startAt,Bi(s),i)||s.endAt&&!function(o,l,c){const h=Qd(o,l,c);return o.inclusive?h>=0:h>0}(s.endAt,Bi(s),i))}(n,e)}function aI(n){return n.collectionGroup||(n.path.length%2==1?n.path.lastSegment():n.path.get(n.path.length-2))}function Fm(n){return(e,t)=>{let s=!1;for(const i of Bi(n)){const r=lI(i,e,t);if(r!==0)return r;s=s||i.field.isKeyField()}return 0}}function lI(n,e,t){const s=n.field.isKeyField()?W.comparator(e.key,t.key):function(r,o,l){const c=o.data.field(r),h=l.data.field(r);return c!==null&&h!==null?Bs(c,h):j()}(n.field,e,t);switch(n.dir){case"asc":return s;case"desc":return-1*s;default:return j()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ei{constructor(e,t){this.mapKeyFn=e,this.equalsFn=t,this.inner={},this.innerSize=0}get(e){const t=this.mapKeyFn(e),s=this.inner[t];if(s!==void 0){for(const[i,r]of s)if(this.equalsFn(i,e))return r}}has(e){return this.get(e)!==void 0}set(e,t){const s=this.mapKeyFn(e),i=this.inner[s];if(i===void 0)return this.inner[s]=[[e,t]],void this.innerSize++;for(let r=0;r<i.length;r++)if(this.equalsFn(i[r][0],e))return void(i[r]=[e,t]);i.push([e,t]),this.innerSize++}delete(e){const t=this.mapKeyFn(e),s=this.inner[t];if(s===void 0)return!1;for(let i=0;i<s.length;i++)if(this.equalsFn(s[i][0],e))return s.length===1?delete this.inner[t]:s.splice(i,1),this.innerSize--,!0;return!1}forEach(e){ls(this.inner,(t,s)=>{for(const[i,r]of s)e(i,r)})}isEmpty(){return Sm(this.inner)}size(){return this.innerSize}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const cI=new ke(W.comparator);function sn(){return cI}const Bm=new ke(W.comparator);function xi(...n){let e=Bm;for(const t of n)e=e.insert(t.key,t);return e}function Um(n){let e=Bm;return n.forEach((t,s)=>e=e.insert(t,s.overlayedDocument)),e}function Hn(){return Ui()}function qm(){return Ui()}function Ui(){return new ei(n=>n.toString(),(n,e)=>n.isEqual(e))}const hI=new ke(W.comparator),uI=new $e(W.comparator);function ne(...n){let e=uI;for(const t of n)e=e.add(t);return e}const dI=new $e(ae);function fI(){return dI}/**
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
 */function Jc(n,e){if(n.useProto3Json){if(isNaN(e))return{doubleValue:"NaN"};if(e===1/0)return{doubleValue:"Infinity"};if(e===-1/0)return{doubleValue:"-Infinity"}}return{doubleValue:Mo(e)?"-0":e}}function Wm(n){return{integerValue:""+n}}function pI(n,e){return jT(e)?Wm(e):Jc(n,e)}/**
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
 */class _a{constructor(){this._=void 0}}function mI(n,e,t){return n instanceof Bo?function(i,r){const o={fields:{__type__:{stringValue:"server_timestamp"},__local_write_time__:{timestampValue:{seconds:i.seconds,nanos:i.nanoseconds}}}};return r&&Gc(r)&&(r=zc(r)),r&&(o.fields.__previous_value__=r),{mapValue:o}}(t,e):n instanceof sr?jm(n,e):n instanceof ir?Gm(n,e):function(i,r){const o=$m(i,r),l=Zd(o)+Zd(i.Pe);return Yl(o)&&Yl(i.Pe)?Wm(l):Jc(i.serializer,l)}(n,e)}function gI(n,e,t){return n instanceof sr?jm(n,e):n instanceof ir?Gm(n,e):t}function $m(n,e){return n instanceof Uo?function(s){return Yl(s)||function(r){return!!r&&"doubleValue"in r}(s)}(e)?e:{integerValue:0}:null}class Bo extends _a{}class sr extends _a{constructor(e){super(),this.elements=e}}function jm(n,e){const t=zm(e);for(const s of n.elements)t.some(i=>Mt(i,s))||t.push(s);return{arrayValue:{values:t}}}class ir extends _a{constructor(e){super(),this.elements=e}}function Gm(n,e){let t=zm(e);for(const s of n.elements)t=t.filter(i=>!Mt(i,s));return{arrayValue:{values:t}}}class Uo extends _a{constructor(e,t){super(),this.serializer=e,this.Pe=t}}function Zd(n){return be(n.integerValue||n.doubleValue)}function zm(n){return Hc(n)&&n.arrayValue.values?n.arrayValue.values.slice():[]}function _I(n,e){return n.field.isEqual(e.field)&&function(s,i){return s instanceof sr&&i instanceof sr||s instanceof ir&&i instanceof ir?Fs(s.elements,i.elements,Mt):s instanceof Uo&&i instanceof Uo?Mt(s.Pe,i.Pe):s instanceof Bo&&i instanceof Bo}(n.transform,e.transform)}class yI{constructor(e,t){this.version=e,this.transformResults=t}}class it{constructor(e,t){this.updateTime=e,this.exists=t}static none(){return new it}static exists(e){return new it(void 0,e)}static updateTime(e){return new it(e)}get isNone(){return this.updateTime===void 0&&this.exists===void 0}isEqual(e){return this.exists===e.exists&&(this.updateTime?!!e.updateTime&&this.updateTime.isEqual(e.updateTime):!e.updateTime)}}function _o(n,e){return n.updateTime!==void 0?e.isFoundDocument()&&e.version.isEqual(n.updateTime):n.exists===void 0||n.exists===e.isFoundDocument()}class ya{}function Hm(n,e){if(!n.hasLocalMutations||e&&e.fields.length===0)return null;if(e===null)return n.isNoDocument()?new Xc(n.key,it.none()):new Er(n.key,n.data,it.none());{const t=n.data,s=st.empty();let i=new $e(We.comparator);for(let r of e.fields)if(!i.has(r)){let o=t.field(r);o===null&&r.length>1&&(r=r.popLast(),o=t.field(r)),o===null?s.delete(r):s.set(r,o),i=i.add(r)}return new Fn(n.key,s,new ft(i.toArray()),it.none())}}function vI(n,e,t){n instanceof Er?function(i,r,o){const l=i.value.clone(),c=tf(i.fieldTransforms,r,o.transformResults);l.setAll(c),r.convertToFoundDocument(o.version,l).setHasCommittedMutations()}(n,e,t):n instanceof Fn?function(i,r,o){if(!_o(i.precondition,r))return void r.convertToUnknownDocument(o.version);const l=tf(i.fieldTransforms,r,o.transformResults),c=r.data;c.setAll(Km(i)),c.setAll(l),r.convertToFoundDocument(o.version,c).setHasCommittedMutations()}(n,e,t):function(i,r,o){r.convertToNoDocument(o.version).setHasCommittedMutations()}(0,e,t)}function qi(n,e,t,s){return n instanceof Er?function(r,o,l,c){if(!_o(r.precondition,o))return l;const h=r.value.clone(),d=nf(r.fieldTransforms,c,o);return h.setAll(d),o.convertToFoundDocument(o.version,h).setHasLocalMutations(),null}(n,e,t,s):n instanceof Fn?function(r,o,l,c){if(!_o(r.precondition,o))return l;const h=nf(r.fieldTransforms,c,o),d=o.data;return d.setAll(Km(r)),d.setAll(h),o.convertToFoundDocument(o.version,d).setHasLocalMutations(),l===null?null:l.unionWith(r.fieldMask.fields).unionWith(r.fieldTransforms.map(p=>p.field))}(n,e,t,s):function(r,o,l){return _o(r.precondition,o)?(o.convertToNoDocument(o.version).setHasLocalMutations(),null):l}(n,e,t)}function EI(n,e){let t=null;for(const s of n.fieldTransforms){const i=e.data.field(s.field),r=$m(s.transform,i||null);r!=null&&(t===null&&(t=st.empty()),t.set(s.field,r))}return t||null}function ef(n,e){return n.type===e.type&&!!n.key.isEqual(e.key)&&!!n.precondition.isEqual(e.precondition)&&!!function(s,i){return s===void 0&&i===void 0||!(!s||!i)&&Fs(s,i,(r,o)=>_I(r,o))}(n.fieldTransforms,e.fieldTransforms)&&(n.type===0?n.value.isEqual(e.value):n.type!==1||n.data.isEqual(e.data)&&n.fieldMask.isEqual(e.fieldMask))}class Er extends ya{constructor(e,t,s,i=[]){super(),this.key=e,this.value=t,this.precondition=s,this.fieldTransforms=i,this.type=0}getFieldMask(){return null}}class Fn extends ya{constructor(e,t,s,i,r=[]){super(),this.key=e,this.data=t,this.fieldMask=s,this.precondition=i,this.fieldTransforms=r,this.type=1}getFieldMask(){return this.fieldMask}}function Km(n){const e=new Map;return n.fieldMask.fields.forEach(t=>{if(!t.isEmpty()){const s=n.data.field(t);e.set(t,s)}}),e}function tf(n,e,t){const s=new Map;re(n.length===t.length);for(let i=0;i<t.length;i++){const r=n[i],o=r.transform,l=e.data.field(r.field);s.set(r.field,gI(o,l,t[i]))}return s}function nf(n,e,t){const s=new Map;for(const i of n){const r=i.transform,o=t.data.field(i.field);s.set(i.field,mI(r,o,e))}return s}class Xc extends ya{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=2,this.fieldTransforms=[]}getFieldMask(){return null}}class Qm extends ya{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=3,this.fieldTransforms=[]}getFieldMask(){return null}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class wI{constructor(e,t,s,i){this.batchId=e,this.localWriteTime=t,this.baseMutations=s,this.mutations=i}applyToRemoteDocument(e,t){const s=t.mutationResults;for(let i=0;i<this.mutations.length;i++){const r=this.mutations[i];r.key.isEqual(e.key)&&vI(r,e,s[i])}}applyToLocalView(e,t){for(const s of this.baseMutations)s.key.isEqual(e.key)&&(t=qi(s,e,t,this.localWriteTime));for(const s of this.mutations)s.key.isEqual(e.key)&&(t=qi(s,e,t,this.localWriteTime));return t}applyToLocalDocumentSet(e,t){const s=qm();return this.mutations.forEach(i=>{const r=e.get(i.key),o=r.overlayedDocument;let l=this.applyToLocalView(o,r.mutatedFields);l=t.has(i.key)?null:l;const c=Hm(o,l);c!==null&&s.set(i.key,c),o.isValidDocument()||o.convertToNoDocument(H.min())}),s}keys(){return this.mutations.reduce((e,t)=>e.add(t.key),ne())}isEqual(e){return this.batchId===e.batchId&&Fs(this.mutations,e.mutations,(t,s)=>ef(t,s))&&Fs(this.baseMutations,e.baseMutations,(t,s)=>ef(t,s))}}class Zc{constructor(e,t,s,i){this.batch=e,this.commitVersion=t,this.mutationResults=s,this.docVersions=i}static from(e,t,s){re(e.mutations.length===s.length);let i=function(){return hI}();const r=e.mutations;for(let o=0;o<r.length;o++)i=i.insert(r[o].key,s[o].version);return new Zc(e,t,s,i)}}/**
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
 */class TI{constructor(e,t){this.largestBatchId=e,this.mutation=t}getKey(){return this.mutation.key}isEqual(e){return e!==null&&this.mutation===e.mutation}toString(){return`Overlay{
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
 */class II{constructor(e,t){this.count=e,this.unchangedNames=t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Re,ie;function Ym(n){switch(n){default:return j();case k.CANCELLED:case k.UNKNOWN:case k.DEADLINE_EXCEEDED:case k.RESOURCE_EXHAUSTED:case k.INTERNAL:case k.UNAVAILABLE:case k.UNAUTHENTICATED:return!1;case k.INVALID_ARGUMENT:case k.NOT_FOUND:case k.ALREADY_EXISTS:case k.PERMISSION_DENIED:case k.FAILED_PRECONDITION:case k.ABORTED:case k.OUT_OF_RANGE:case k.UNIMPLEMENTED:case k.DATA_LOSS:return!0}}function Jm(n){if(n===void 0)return nn("GRPC error has no .code"),k.UNKNOWN;switch(n){case Re.OK:return k.OK;case Re.CANCELLED:return k.CANCELLED;case Re.UNKNOWN:return k.UNKNOWN;case Re.DEADLINE_EXCEEDED:return k.DEADLINE_EXCEEDED;case Re.RESOURCE_EXHAUSTED:return k.RESOURCE_EXHAUSTED;case Re.INTERNAL:return k.INTERNAL;case Re.UNAVAILABLE:return k.UNAVAILABLE;case Re.UNAUTHENTICATED:return k.UNAUTHENTICATED;case Re.INVALID_ARGUMENT:return k.INVALID_ARGUMENT;case Re.NOT_FOUND:return k.NOT_FOUND;case Re.ALREADY_EXISTS:return k.ALREADY_EXISTS;case Re.PERMISSION_DENIED:return k.PERMISSION_DENIED;case Re.FAILED_PRECONDITION:return k.FAILED_PRECONDITION;case Re.ABORTED:return k.ABORTED;case Re.OUT_OF_RANGE:return k.OUT_OF_RANGE;case Re.UNIMPLEMENTED:return k.UNIMPLEMENTED;case Re.DATA_LOSS:return k.DATA_LOSS;default:return j()}}(ie=Re||(Re={}))[ie.OK=0]="OK",ie[ie.CANCELLED=1]="CANCELLED",ie[ie.UNKNOWN=2]="UNKNOWN",ie[ie.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",ie[ie.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",ie[ie.NOT_FOUND=5]="NOT_FOUND",ie[ie.ALREADY_EXISTS=6]="ALREADY_EXISTS",ie[ie.PERMISSION_DENIED=7]="PERMISSION_DENIED",ie[ie.UNAUTHENTICATED=16]="UNAUTHENTICATED",ie[ie.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",ie[ie.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",ie[ie.ABORTED=10]="ABORTED",ie[ie.OUT_OF_RANGE=11]="OUT_OF_RANGE",ie[ie.UNIMPLEMENTED=12]="UNIMPLEMENTED",ie[ie.INTERNAL=13]="INTERNAL",ie[ie.UNAVAILABLE=14]="UNAVAILABLE",ie[ie.DATA_LOSS=15]="DATA_LOSS";/**
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
 */function bI(){return new TextEncoder}/**
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
 */const CI=new Yn([4294967295,4294967295],0);function sf(n){const e=bI().encode(n),t=new vm;return t.update(e),new Uint8Array(t.digest())}function rf(n){const e=new DataView(n.buffer),t=e.getUint32(0,!0),s=e.getUint32(4,!0),i=e.getUint32(8,!0),r=e.getUint32(12,!0);return[new Yn([t,s],0),new Yn([i,r],0)]}class eh{constructor(e,t,s){if(this.bitmap=e,this.padding=t,this.hashCount=s,t<0||t>=8)throw new Oi(`Invalid padding: ${t}`);if(s<0)throw new Oi(`Invalid hash count: ${s}`);if(e.length>0&&this.hashCount===0)throw new Oi(`Invalid hash count: ${s}`);if(e.length===0&&t!==0)throw new Oi(`Invalid padding when bitmap length is 0: ${t}`);this.Ie=8*e.length-t,this.Te=Yn.fromNumber(this.Ie)}Ee(e,t,s){let i=e.add(t.multiply(Yn.fromNumber(s)));return i.compare(CI)===1&&(i=new Yn([i.getBits(0),i.getBits(1)],0)),i.modulo(this.Te).toNumber()}de(e){return(this.bitmap[Math.floor(e/8)]&1<<e%8)!=0}mightContain(e){if(this.Ie===0)return!1;const t=sf(e),[s,i]=rf(t);for(let r=0;r<this.hashCount;r++){const o=this.Ee(s,i,r);if(!this.de(o))return!1}return!0}static create(e,t,s){const i=e%8==0?0:8-e%8,r=new Uint8Array(Math.ceil(e/8)),o=new eh(r,i,t);return s.forEach(l=>o.insert(l)),o}insert(e){if(this.Ie===0)return;const t=sf(e),[s,i]=rf(t);for(let r=0;r<this.hashCount;r++){const o=this.Ee(s,i,r);this.Ae(o)}}Ae(e){const t=Math.floor(e/8),s=e%8;this.bitmap[t]|=1<<s}}class Oi extends Error{constructor(){super(...arguments),this.name="BloomFilterError"}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class va{constructor(e,t,s,i,r){this.snapshotVersion=e,this.targetChanges=t,this.targetMismatches=s,this.documentUpdates=i,this.resolvedLimboDocuments=r}static createSynthesizedRemoteEventForCurrentChange(e,t,s){const i=new Map;return i.set(e,wr.createSynthesizedTargetChangeForCurrentChange(e,t,s)),new va(H.min(),i,new ke(ae),sn(),ne())}}class wr{constructor(e,t,s,i,r){this.resumeToken=e,this.current=t,this.addedDocuments=s,this.modifiedDocuments=i,this.removedDocuments=r}static createSynthesizedTargetChangeForCurrentChange(e,t,s){return new wr(s,t,ne(),ne(),ne())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yo{constructor(e,t,s,i){this.Re=e,this.removedTargetIds=t,this.key=s,this.Ve=i}}class Xm{constructor(e,t){this.targetId=e,this.me=t}}class Zm{constructor(e,t,s=je.EMPTY_BYTE_STRING,i=null){this.state=e,this.targetIds=t,this.resumeToken=s,this.cause=i}}class of{constructor(){this.fe=0,this.ge=lf(),this.pe=je.EMPTY_BYTE_STRING,this.ye=!1,this.we=!0}get current(){return this.ye}get resumeToken(){return this.pe}get Se(){return this.fe!==0}get be(){return this.we}De(e){e.approximateByteSize()>0&&(this.we=!0,this.pe=e)}ve(){let e=ne(),t=ne(),s=ne();return this.ge.forEach((i,r)=>{switch(r){case 0:e=e.add(i);break;case 2:t=t.add(i);break;case 1:s=s.add(i);break;default:j()}}),new wr(this.pe,this.ye,e,t,s)}Ce(){this.we=!1,this.ge=lf()}Fe(e,t){this.we=!0,this.ge=this.ge.insert(e,t)}Me(e){this.we=!0,this.ge=this.ge.remove(e)}xe(){this.fe+=1}Oe(){this.fe-=1,re(this.fe>=0)}Ne(){this.we=!0,this.ye=!0}}class RI{constructor(e){this.Le=e,this.Be=new Map,this.ke=sn(),this.qe=af(),this.Qe=new ke(ae)}Ke(e){for(const t of e.Re)e.Ve&&e.Ve.isFoundDocument()?this.$e(t,e.Ve):this.Ue(t,e.key,e.Ve);for(const t of e.removedTargetIds)this.Ue(t,e.key,e.Ve)}We(e){this.forEachTarget(e,t=>{const s=this.Ge(t);switch(e.state){case 0:this.ze(t)&&s.De(e.resumeToken);break;case 1:s.Oe(),s.Se||s.Ce(),s.De(e.resumeToken);break;case 2:s.Oe(),s.Se||this.removeTarget(t);break;case 3:this.ze(t)&&(s.Ne(),s.De(e.resumeToken));break;case 4:this.ze(t)&&(this.je(t),s.De(e.resumeToken));break;default:j()}})}forEachTarget(e,t){e.targetIds.length>0?e.targetIds.forEach(t):this.Be.forEach((s,i)=>{this.ze(i)&&t(i)})}He(e){const t=e.targetId,s=e.me.count,i=this.Je(t);if(i){const r=i.target;if(Xl(r))if(s===0){const o=new W(r.path);this.Ue(t,o,Fe.newNoDocument(o,H.min()))}else re(s===1);else{const o=this.Ye(t);if(o!==s){const l=this.Ze(e),c=l?this.Xe(l,e,o):1;if(c!==0){this.je(t);const h=c===2?"TargetPurposeExistenceFilterMismatchBloom":"TargetPurposeExistenceFilterMismatch";this.Qe=this.Qe.insert(t,h)}}}}}Ze(e){const t=e.me.unchangedNames;if(!t||!t.bits)return null;const{bits:{bitmap:s="",padding:i=0},hashCount:r=0}=t;let o,l;try{o=ts(s).toUint8Array()}catch(c){if(c instanceof Am)return Vs("Decoding the base64 bloom filter in existence filter failed ("+c.message+"); ignoring the bloom filter and falling back to full re-query."),null;throw c}try{l=new eh(o,i,r)}catch(c){return Vs(c instanceof Oi?"BloomFilter error: ":"Applying bloom filter failed: ",c),null}return l.Ie===0?null:l}Xe(e,t,s){return t.me.count===s-this.nt(e,t.targetId)?0:2}nt(e,t){const s=this.Le.getRemoteKeysForTarget(t);let i=0;return s.forEach(r=>{const o=this.Le.tt(),l=`projects/${o.projectId}/databases/${o.database}/documents/${r.path.canonicalString()}`;e.mightContain(l)||(this.Ue(t,r,null),i++)}),i}rt(e){const t=new Map;this.Be.forEach((r,o)=>{const l=this.Je(o);if(l){if(r.current&&Xl(l.target)){const c=new W(l.target.path);this.ke.get(c)!==null||this.it(o,c)||this.Ue(o,c,Fe.newNoDocument(c,e))}r.be&&(t.set(o,r.ve()),r.Ce())}});let s=ne();this.qe.forEach((r,o)=>{let l=!0;o.forEachWhile(c=>{const h=this.Je(c);return!h||h.purpose==="TargetPurposeLimboResolution"||(l=!1,!1)}),l&&(s=s.add(r))}),this.ke.forEach((r,o)=>o.setReadTime(e));const i=new va(e,t,this.Qe,this.ke,s);return this.ke=sn(),this.qe=af(),this.Qe=new ke(ae),i}$e(e,t){if(!this.ze(e))return;const s=this.it(e,t.key)?2:0;this.Ge(e).Fe(t.key,s),this.ke=this.ke.insert(t.key,t),this.qe=this.qe.insert(t.key,this.st(t.key).add(e))}Ue(e,t,s){if(!this.ze(e))return;const i=this.Ge(e);this.it(e,t)?i.Fe(t,1):i.Me(t),this.qe=this.qe.insert(t,this.st(t).delete(e)),s&&(this.ke=this.ke.insert(t,s))}removeTarget(e){this.Be.delete(e)}Ye(e){const t=this.Ge(e).ve();return this.Le.getRemoteKeysForTarget(e).size+t.addedDocuments.size-t.removedDocuments.size}xe(e){this.Ge(e).xe()}Ge(e){let t=this.Be.get(e);return t||(t=new of,this.Be.set(e,t)),t}st(e){let t=this.qe.get(e);return t||(t=new $e(ae),this.qe=this.qe.insert(e,t)),t}ze(e){const t=this.Je(e)!==null;return t||B("WatchChangeAggregator","Detected inactive target",e),t}Je(e){const t=this.Be.get(e);return t&&t.Se?null:this.Le.ot(e)}je(e){this.Be.set(e,new of),this.Le.getRemoteKeysForTarget(e).forEach(t=>{this.Ue(e,t,null)})}it(e,t){return this.Le.getRemoteKeysForTarget(e).has(t)}}function af(){return new ke(W.comparator)}function lf(){return new ke(W.comparator)}const SI={asc:"ASCENDING",desc:"DESCENDING"},AI={"<":"LESS_THAN","<=":"LESS_THAN_OR_EQUAL",">":"GREATER_THAN",">=":"GREATER_THAN_OR_EQUAL","==":"EQUAL","!=":"NOT_EQUAL","array-contains":"ARRAY_CONTAINS",in:"IN","not-in":"NOT_IN","array-contains-any":"ARRAY_CONTAINS_ANY"},kI={and:"AND",or:"OR"};class PI{constructor(e,t){this.databaseId=e,this.useProto3Json=t}}function ec(n,e){return n.useProto3Json||vr(e)?e:{value:e}}function qo(n,e){return n.useProto3Json?`${new Date(1e3*e.seconds).toISOString().replace(/\.\d*/,"").replace("Z","")}.${("000000000"+e.nanoseconds).slice(-9)}Z`:{seconds:""+e.seconds,nanos:e.nanoseconds}}function eg(n,e){return n.useProto3Json?e.toBase64():e.toUint8Array()}function NI(n,e){return qo(n,e.toTimestamp())}function pt(n){return re(!!n),H.fromTimestamp(function(t){const s=Dn(t);return new Le(s.seconds,s.nanos)}(n))}function th(n,e){return tc(n,e).canonicalString()}function tc(n,e){const t=function(i){return new pe(["projects",i.projectId,"databases",i.database])}(n).child("documents");return e===void 0?t:t.child(e)}function tg(n){const e=pe.fromString(n);return re(ag(e)),e}function Wo(n,e){return th(n.databaseId,e.path)}function Wi(n,e){const t=tg(e);if(t.get(1)!==n.databaseId.projectId)throw new M(k.INVALID_ARGUMENT,"Tried to deserialize key from different project: "+t.get(1)+" vs "+n.databaseId.projectId);if(t.get(3)!==n.databaseId.database)throw new M(k.INVALID_ARGUMENT,"Tried to deserialize key from different database: "+t.get(3)+" vs "+n.databaseId.database);return new W(sg(t))}function ng(n,e){return th(n.databaseId,e)}function DI(n){const e=tg(n);return e.length===4?pe.emptyPath():sg(e)}function nc(n){return new pe(["projects",n.databaseId.projectId,"databases",n.databaseId.database]).canonicalString()}function sg(n){return re(n.length>4&&n.get(4)==="documents"),n.popFirst(5)}function cf(n,e,t){return{name:Wo(n,e),fields:t.value.mapValue.fields}}function LI(n,e){return"found"in e?function(s,i){re(!!i.found),i.found.name,i.found.updateTime;const r=Wi(s,i.found.name),o=pt(i.found.updateTime),l=i.found.createTime?pt(i.found.createTime):H.min(),c=new st({mapValue:{fields:i.found.fields}});return Fe.newFoundDocument(r,o,l,c)}(n,e):"missing"in e?function(s,i){re(!!i.missing),re(!!i.readTime);const r=Wi(s,i.missing),o=pt(i.readTime);return Fe.newNoDocument(r,o)}(n,e):j()}function xI(n,e){let t;if("targetChange"in e){e.targetChange;const s=function(h){return h==="NO_CHANGE"?0:h==="ADD"?1:h==="REMOVE"?2:h==="CURRENT"?3:h==="RESET"?4:j()}(e.targetChange.targetChangeType||"NO_CHANGE"),i=e.targetChange.targetIds||[],r=function(h,d){return h.useProto3Json?(re(d===void 0||typeof d=="string"),je.fromBase64String(d||"")):(re(d===void 0||d instanceof Buffer||d instanceof Uint8Array),je.fromUint8Array(d||new Uint8Array))}(n,e.targetChange.resumeToken),o=e.targetChange.cause,l=o&&function(h){const d=h.code===void 0?k.UNKNOWN:Jm(h.code);return new M(d,h.message||"")}(o);t=new Zm(s,i,r,l||null)}else if("documentChange"in e){e.documentChange;const s=e.documentChange;s.document,s.document.name,s.document.updateTime;const i=Wi(n,s.document.name),r=pt(s.document.updateTime),o=s.document.createTime?pt(s.document.createTime):H.min(),l=new st({mapValue:{fields:s.document.fields}}),c=Fe.newFoundDocument(i,r,o,l),h=s.targetIds||[],d=s.removedTargetIds||[];t=new yo(h,d,c.key,c)}else if("documentDelete"in e){e.documentDelete;const s=e.documentDelete;s.document;const i=Wi(n,s.document),r=s.readTime?pt(s.readTime):H.min(),o=Fe.newNoDocument(i,r),l=s.removedTargetIds||[];t=new yo([],l,o.key,o)}else if("documentRemove"in e){e.documentRemove;const s=e.documentRemove;s.document;const i=Wi(n,s.document),r=s.removedTargetIds||[];t=new yo([],r,i,null)}else{if(!("filter"in e))return j();{e.filter;const s=e.filter;s.targetId;const{count:i=0,unchangedNames:r}=s,o=new II(i,r),l=s.targetId;t=new Xm(l,o)}}return t}function ig(n,e){let t;if(e instanceof Er)t={update:cf(n,e.key,e.value)};else if(e instanceof Xc)t={delete:Wo(n,e.key)};else if(e instanceof Fn)t={update:cf(n,e.key,e.data),updateMask:$I(e.fieldMask)};else{if(!(e instanceof Qm))return j();t={verify:Wo(n,e.key)}}return e.fieldTransforms.length>0&&(t.updateTransforms=e.fieldTransforms.map(s=>function(r,o){const l=o.transform;if(l instanceof Bo)return{fieldPath:o.field.canonicalString(),setToServerValue:"REQUEST_TIME"};if(l instanceof sr)return{fieldPath:o.field.canonicalString(),appendMissingElements:{values:l.elements}};if(l instanceof ir)return{fieldPath:o.field.canonicalString(),removeAllFromArray:{values:l.elements}};if(l instanceof Uo)return{fieldPath:o.field.canonicalString(),increment:l.Pe};throw j()}(0,s))),e.precondition.isNone||(t.currentDocument=function(i,r){return r.updateTime!==void 0?{updateTime:NI(i,r.updateTime)}:r.exists!==void 0?{exists:r.exists}:j()}(n,e.precondition)),t}function OI(n,e){return n&&n.length>0?(re(e!==void 0),n.map(t=>function(i,r){let o=i.updateTime?pt(i.updateTime):pt(r);return o.isEqual(H.min())&&(o=pt(r)),new yI(o,i.transformResults||[])}(t,e))):[]}function MI(n,e){return{documents:[ng(n,e.path)]}}function VI(n,e){const t={structuredQuery:{}},s=e.path;let i;e.collectionGroup!==null?(i=s,t.structuredQuery.from=[{collectionId:e.collectionGroup,allDescendants:!0}]):(i=s.popLast(),t.structuredQuery.from=[{collectionId:s.lastSegment()}]),t.parent=ng(n,i);const r=function(h){if(h.length!==0)return og(At.create(h,"and"))}(e.filters);r&&(t.structuredQuery.where=r);const o=function(h){if(h.length!==0)return h.map(d=>function(m){return{field:Cs(m.field),direction:UI(m.dir)}}(d))}(e.orderBy);o&&(t.structuredQuery.orderBy=o);const l=ec(n,e.limit);return l!==null&&(t.structuredQuery.limit=l),e.startAt&&(t.structuredQuery.startAt=function(h){return{before:h.inclusive,values:h.position}}(e.startAt)),e.endAt&&(t.structuredQuery.endAt=function(h){return{before:!h.inclusive,values:h.position}}(e.endAt)),{_t:t,parent:i}}function FI(n){let e=DI(n.parent);const t=n.structuredQuery,s=t.from?t.from.length:0;let i=null;if(s>0){re(s===1);const d=t.from[0];d.allDescendants?i=d.collectionId:e=e.child(d.collectionId)}let r=[];t.where&&(r=function(p){const m=rg(p);return m instanceof At&&Dm(m)?m.getFilters():[m]}(t.where));let o=[];t.orderBy&&(o=function(p){return p.map(m=>function(R){return new nr(Rs(R.field),function(P){switch(P){case"ASCENDING":return"asc";case"DESCENDING":return"desc";default:return}}(R.direction))}(m))}(t.orderBy));let l=null;t.limit&&(l=function(p){let m;return m=typeof p=="object"?p.value:p,vr(m)?null:m}(t.limit));let c=null;t.startAt&&(c=function(p){const m=!!p.before,E=p.values||[];return new Vo(E,m)}(t.startAt));let h=null;return t.endAt&&(h=function(p){const m=!p.before,E=p.values||[];return new Vo(E,m)}(t.endAt)),rI(e,i,o,r,l,"F",c,h)}function BI(n,e){const t=function(i){switch(i){case"TargetPurposeListen":return null;case"TargetPurposeExistenceFilterMismatch":return"existence-filter-mismatch";case"TargetPurposeExistenceFilterMismatchBloom":return"existence-filter-mismatch-bloom";case"TargetPurposeLimboResolution":return"limbo-document";default:return j()}}(e.purpose);return t==null?null:{"goog-listen-tags":t}}function rg(n){return n.unaryFilter!==void 0?function(t){switch(t.unaryFilter.op){case"IS_NAN":const s=Rs(t.unaryFilter.field);return Se.create(s,"==",{doubleValue:NaN});case"IS_NULL":const i=Rs(t.unaryFilter.field);return Se.create(i,"==",{nullValue:"NULL_VALUE"});case"IS_NOT_NAN":const r=Rs(t.unaryFilter.field);return Se.create(r,"!=",{doubleValue:NaN});case"IS_NOT_NULL":const o=Rs(t.unaryFilter.field);return Se.create(o,"!=",{nullValue:"NULL_VALUE"});default:return j()}}(n):n.fieldFilter!==void 0?function(t){return Se.create(Rs(t.fieldFilter.field),function(i){switch(i){case"EQUAL":return"==";case"NOT_EQUAL":return"!=";case"GREATER_THAN":return">";case"GREATER_THAN_OR_EQUAL":return">=";case"LESS_THAN":return"<";case"LESS_THAN_OR_EQUAL":return"<=";case"ARRAY_CONTAINS":return"array-contains";case"IN":return"in";case"NOT_IN":return"not-in";case"ARRAY_CONTAINS_ANY":return"array-contains-any";default:return j()}}(t.fieldFilter.op),t.fieldFilter.value)}(n):n.compositeFilter!==void 0?function(t){return At.create(t.compositeFilter.filters.map(s=>rg(s)),function(i){switch(i){case"AND":return"and";case"OR":return"or";default:return j()}}(t.compositeFilter.op))}(n):j()}function UI(n){return SI[n]}function qI(n){return AI[n]}function WI(n){return kI[n]}function Cs(n){return{fieldPath:n.canonicalString()}}function Rs(n){return We.fromServerFormat(n.fieldPath)}function og(n){return n instanceof Se?function(t){if(t.op==="=="){if(Kd(t.value))return{unaryFilter:{field:Cs(t.field),op:"IS_NAN"}};if(Hd(t.value))return{unaryFilter:{field:Cs(t.field),op:"IS_NULL"}}}else if(t.op==="!="){if(Kd(t.value))return{unaryFilter:{field:Cs(t.field),op:"IS_NOT_NAN"}};if(Hd(t.value))return{unaryFilter:{field:Cs(t.field),op:"IS_NOT_NULL"}}}return{fieldFilter:{field:Cs(t.field),op:qI(t.op),value:t.value}}}(n):n instanceof At?function(t){const s=t.getFilters().map(i=>og(i));return s.length===1?s[0]:{compositeFilter:{op:WI(t.op),filters:s}}}(n):j()}function $I(n){const e=[];return n.fields.forEach(t=>e.push(t.canonicalString())),{fieldPaths:e}}function ag(n){return n.length>=4&&n.get(0)==="projects"&&n.get(2)==="databases"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class En{constructor(e,t,s,i,r=H.min(),o=H.min(),l=je.EMPTY_BYTE_STRING,c=null){this.target=e,this.targetId=t,this.purpose=s,this.sequenceNumber=i,this.snapshotVersion=r,this.lastLimboFreeSnapshotVersion=o,this.resumeToken=l,this.expectedCount=c}withSequenceNumber(e){return new En(this.target,this.targetId,this.purpose,e,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,this.expectedCount)}withResumeToken(e,t){return new En(this.target,this.targetId,this.purpose,this.sequenceNumber,t,this.lastLimboFreeSnapshotVersion,e,null)}withExpectedCount(e){return new En(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,e)}withLastLimboFreeSnapshotVersion(e){return new En(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,e,this.resumeToken,this.expectedCount)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class jI{constructor(e){this.ct=e}}function GI(n){const e=FI({parent:n.parent,structuredQuery:n.structuredQuery});return n.limitType==="LAST"?Fo(e,e.limit,"L"):e}/**
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
 */class zI{constructor(){this.un=new HI}addToCollectionParentIndex(e,t){return this.un.add(t),N.resolve()}getCollectionParents(e,t){return N.resolve(this.un.getEntries(t))}addFieldIndex(e,t){return N.resolve()}deleteFieldIndex(e,t){return N.resolve()}deleteAllFieldIndexes(e){return N.resolve()}createTargetIndexes(e,t){return N.resolve()}getDocumentsMatchingTarget(e,t){return N.resolve(null)}getIndexType(e,t){return N.resolve(0)}getFieldIndexes(e,t){return N.resolve([])}getNextCollectionGroupToUpdate(e){return N.resolve(null)}getMinOffset(e,t){return N.resolve(Nn.min())}getMinOffsetFromCollectionGroup(e,t){return N.resolve(Nn.min())}updateCollectionGroup(e,t,s){return N.resolve()}updateIndexEntries(e,t){return N.resolve()}}class HI{constructor(){this.index={}}add(e){const t=e.lastSegment(),s=e.popLast(),i=this.index[t]||new $e(pe.comparator),r=!i.has(s);return this.index[t]=i.add(s),r}has(e){const t=e.lastSegment(),s=e.popLast(),i=this.index[t];return i&&i.has(s)}getEntries(e){return(this.index[e]||new $e(pe.comparator)).toArray()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qs{constructor(e){this.Ln=e}next(){return this.Ln+=2,this.Ln}static Bn(){return new qs(0)}static kn(){return new qs(-1)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class KI{constructor(){this.changes=new ei(e=>e.toString(),(e,t)=>e.isEqual(t)),this.changesApplied=!1}addEntry(e){this.assertNotApplied(),this.changes.set(e.key,e)}removeEntry(e,t){this.assertNotApplied(),this.changes.set(e,Fe.newInvalidDocument(e).setReadTime(t))}getEntry(e,t){this.assertNotApplied();const s=this.changes.get(t);return s!==void 0?N.resolve(s):this.getFromCache(e,t)}getEntries(e,t){return this.getAllFromCache(e,t)}apply(e){return this.assertNotApplied(),this.changesApplied=!0,this.applyChanges(e)}assertNotApplied(){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
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
 */class QI{constructor(e,t){this.overlayedDocument=e,this.mutatedFields=t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class YI{constructor(e,t,s,i){this.remoteDocumentCache=e,this.mutationQueue=t,this.documentOverlayCache=s,this.indexManager=i}getDocument(e,t){let s=null;return this.documentOverlayCache.getOverlay(e,t).next(i=>(s=i,this.remoteDocumentCache.getEntry(e,t))).next(i=>(s!==null&&qi(s.mutation,i,ft.empty(),Le.now()),i))}getDocuments(e,t){return this.remoteDocumentCache.getEntries(e,t).next(s=>this.getLocalViewOfDocuments(e,s,ne()).next(()=>s))}getLocalViewOfDocuments(e,t,s=ne()){const i=Hn();return this.populateOverlays(e,i,t).next(()=>this.computeViews(e,t,i,s).next(r=>{let o=xi();return r.forEach((l,c)=>{o=o.insert(l,c.overlayedDocument)}),o}))}getOverlayedDocuments(e,t){const s=Hn();return this.populateOverlays(e,s,t).next(()=>this.computeViews(e,t,s,ne()))}populateOverlays(e,t,s){const i=[];return s.forEach(r=>{t.has(r)||i.push(r)}),this.documentOverlayCache.getOverlays(e,i).next(r=>{r.forEach((o,l)=>{t.set(o,l)})})}computeViews(e,t,s,i){let r=sn();const o=Ui(),l=function(){return Ui()}();return t.forEach((c,h)=>{const d=s.get(h.key);i.has(h.key)&&(d===void 0||d.mutation instanceof Fn)?r=r.insert(h.key,h):d!==void 0?(o.set(h.key,d.mutation.getFieldMask()),qi(d.mutation,h,d.mutation.getFieldMask(),Le.now())):o.set(h.key,ft.empty())}),this.recalculateAndSaveOverlays(e,r).next(c=>(c.forEach((h,d)=>o.set(h,d)),t.forEach((h,d)=>{var p;return l.set(h,new QI(d,(p=o.get(h))!==null&&p!==void 0?p:null))}),l))}recalculateAndSaveOverlays(e,t){const s=Ui();let i=new ke((o,l)=>o-l),r=ne();return this.mutationQueue.getAllMutationBatchesAffectingDocumentKeys(e,t).next(o=>{for(const l of o)l.keys().forEach(c=>{const h=t.get(c);if(h===null)return;let d=s.get(c)||ft.empty();d=l.applyToLocalView(h,d),s.set(c,d);const p=(i.get(l.batchId)||ne()).add(c);i=i.insert(l.batchId,p)})}).next(()=>{const o=[],l=i.getReverseIterator();for(;l.hasNext();){const c=l.getNext(),h=c.key,d=c.value,p=qm();d.forEach(m=>{if(!r.has(m)){const E=Hm(t.get(m),s.get(m));E!==null&&p.set(m,E),r=r.add(m)}}),o.push(this.documentOverlayCache.saveOverlays(e,h,p))}return N.waitFor(o)}).next(()=>s)}recalculateAndSaveOverlaysForDocumentKeys(e,t){return this.remoteDocumentCache.getEntries(e,t).next(s=>this.recalculateAndSaveOverlays(e,s))}getDocumentsMatchingQuery(e,t,s,i){return function(o){return W.isDocumentKey(o.path)&&o.collectionGroup===null&&o.filters.length===0}(t)?this.getDocumentsMatchingDocumentQuery(e,t.path):Mm(t)?this.getDocumentsMatchingCollectionGroupQuery(e,t,s,i):this.getDocumentsMatchingCollectionQuery(e,t,s,i)}getNextDocuments(e,t,s,i){return this.remoteDocumentCache.getAllFromCollectionGroup(e,t,s,i).next(r=>{const o=i-r.size>0?this.documentOverlayCache.getOverlaysForCollectionGroup(e,t,s.largestBatchId,i-r.size):N.resolve(Hn());let l=-1,c=r;return o.next(h=>N.forEach(h,(d,p)=>(l<p.largestBatchId&&(l=p.largestBatchId),r.get(d)?N.resolve():this.remoteDocumentCache.getEntry(e,d).next(m=>{c=c.insert(d,m)}))).next(()=>this.populateOverlays(e,h,r)).next(()=>this.computeViews(e,c,h,ne())).next(d=>({batchId:l,changes:Um(d)})))})}getDocumentsMatchingDocumentQuery(e,t){return this.getDocument(e,new W(t)).next(s=>{let i=xi();return s.isFoundDocument()&&(i=i.insert(s.key,s)),i})}getDocumentsMatchingCollectionGroupQuery(e,t,s,i){const r=t.collectionGroup;let o=xi();return this.indexManager.getCollectionParents(e,r).next(l=>N.forEach(l,c=>{const h=function(p,m){return new Zs(m,null,p.explicitOrderBy.slice(),p.filters.slice(),p.limit,p.limitType,p.startAt,p.endAt)}(t,c.child(r));return this.getDocumentsMatchingCollectionQuery(e,h,s,i).next(d=>{d.forEach((p,m)=>{o=o.insert(p,m)})})}).next(()=>o))}getDocumentsMatchingCollectionQuery(e,t,s,i){let r;return this.documentOverlayCache.getOverlaysForCollection(e,t.path,s.largestBatchId).next(o=>(r=o,this.remoteDocumentCache.getDocumentsMatchingQuery(e,t,s,r,i))).next(o=>{r.forEach((c,h)=>{const d=h.getKey();o.get(d)===null&&(o=o.insert(d,Fe.newInvalidDocument(d)))});let l=xi();return o.forEach((c,h)=>{const d=r.get(c);d!==void 0&&qi(d.mutation,h,ft.empty(),Le.now()),ga(t,h)&&(l=l.insert(c,h))}),l})}}/**
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
 */class JI{constructor(e){this.serializer=e,this.hr=new Map,this.Pr=new Map}getBundleMetadata(e,t){return N.resolve(this.hr.get(t))}saveBundleMetadata(e,t){return this.hr.set(t.id,function(i){return{id:i.id,version:i.version,createTime:pt(i.createTime)}}(t)),N.resolve()}getNamedQuery(e,t){return N.resolve(this.Pr.get(t))}saveNamedQuery(e,t){return this.Pr.set(t.name,function(i){return{name:i.name,query:GI(i.bundledQuery),readTime:pt(i.readTime)}}(t)),N.resolve()}}/**
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
 */class XI{constructor(){this.overlays=new ke(W.comparator),this.Ir=new Map}getOverlay(e,t){return N.resolve(this.overlays.get(t))}getOverlays(e,t){const s=Hn();return N.forEach(t,i=>this.getOverlay(e,i).next(r=>{r!==null&&s.set(i,r)})).next(()=>s)}saveOverlays(e,t,s){return s.forEach((i,r)=>{this.ht(e,t,r)}),N.resolve()}removeOverlaysForBatchId(e,t,s){const i=this.Ir.get(s);return i!==void 0&&(i.forEach(r=>this.overlays=this.overlays.remove(r)),this.Ir.delete(s)),N.resolve()}getOverlaysForCollection(e,t,s){const i=Hn(),r=t.length+1,o=new W(t.child("")),l=this.overlays.getIteratorFrom(o);for(;l.hasNext();){const c=l.getNext().value,h=c.getKey();if(!t.isPrefixOf(h.path))break;h.path.length===r&&c.largestBatchId>s&&i.set(c.getKey(),c)}return N.resolve(i)}getOverlaysForCollectionGroup(e,t,s,i){let r=new ke((h,d)=>h-d);const o=this.overlays.getIterator();for(;o.hasNext();){const h=o.getNext().value;if(h.getKey().getCollectionGroup()===t&&h.largestBatchId>s){let d=r.get(h.largestBatchId);d===null&&(d=Hn(),r=r.insert(h.largestBatchId,d)),d.set(h.getKey(),h)}}const l=Hn(),c=r.getIterator();for(;c.hasNext()&&(c.getNext().value.forEach((h,d)=>l.set(h,d)),!(l.size()>=i)););return N.resolve(l)}ht(e,t,s){const i=this.overlays.get(s.key);if(i!==null){const o=this.Ir.get(i.largestBatchId).delete(s.key);this.Ir.set(i.largestBatchId,o)}this.overlays=this.overlays.insert(s.key,new TI(t,s));let r=this.Ir.get(t);r===void 0&&(r=ne(),this.Ir.set(t,r)),this.Ir.set(t,r.add(s.key))}}/**
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
 */class ZI{constructor(){this.sessionToken=je.EMPTY_BYTE_STRING}getSessionToken(e){return N.resolve(this.sessionToken)}setSessionToken(e,t){return this.sessionToken=t,N.resolve()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class nh{constructor(){this.Tr=new $e(Me.Er),this.dr=new $e(Me.Ar)}isEmpty(){return this.Tr.isEmpty()}addReference(e,t){const s=new Me(e,t);this.Tr=this.Tr.add(s),this.dr=this.dr.add(s)}Rr(e,t){e.forEach(s=>this.addReference(s,t))}removeReference(e,t){this.Vr(new Me(e,t))}mr(e,t){e.forEach(s=>this.removeReference(s,t))}gr(e){const t=new W(new pe([])),s=new Me(t,e),i=new Me(t,e+1),r=[];return this.dr.forEachInRange([s,i],o=>{this.Vr(o),r.push(o.key)}),r}pr(){this.Tr.forEach(e=>this.Vr(e))}Vr(e){this.Tr=this.Tr.delete(e),this.dr=this.dr.delete(e)}yr(e){const t=new W(new pe([])),s=new Me(t,e),i=new Me(t,e+1);let r=ne();return this.dr.forEachInRange([s,i],o=>{r=r.add(o.key)}),r}containsKey(e){const t=new Me(e,0),s=this.Tr.firstAfterOrEqual(t);return s!==null&&e.isEqual(s.key)}}class Me{constructor(e,t){this.key=e,this.wr=t}static Er(e,t){return W.comparator(e.key,t.key)||ae(e.wr,t.wr)}static Ar(e,t){return ae(e.wr,t.wr)||W.comparator(e.key,t.key)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class e0{constructor(e,t){this.indexManager=e,this.referenceDelegate=t,this.mutationQueue=[],this.Sr=1,this.br=new $e(Me.Er)}checkEmpty(e){return N.resolve(this.mutationQueue.length===0)}addMutationBatch(e,t,s,i){const r=this.Sr;this.Sr++,this.mutationQueue.length>0&&this.mutationQueue[this.mutationQueue.length-1];const o=new wI(r,t,s,i);this.mutationQueue.push(o);for(const l of i)this.br=this.br.add(new Me(l.key,r)),this.indexManager.addToCollectionParentIndex(e,l.key.path.popLast());return N.resolve(o)}lookupMutationBatch(e,t){return N.resolve(this.Dr(t))}getNextMutationBatchAfterBatchId(e,t){const s=t+1,i=this.vr(s),r=i<0?0:i;return N.resolve(this.mutationQueue.length>r?this.mutationQueue[r]:null)}getHighestUnacknowledgedBatchId(){return N.resolve(this.mutationQueue.length===0?-1:this.Sr-1)}getAllMutationBatches(e){return N.resolve(this.mutationQueue.slice())}getAllMutationBatchesAffectingDocumentKey(e,t){const s=new Me(t,0),i=new Me(t,Number.POSITIVE_INFINITY),r=[];return this.br.forEachInRange([s,i],o=>{const l=this.Dr(o.wr);r.push(l)}),N.resolve(r)}getAllMutationBatchesAffectingDocumentKeys(e,t){let s=new $e(ae);return t.forEach(i=>{const r=new Me(i,0),o=new Me(i,Number.POSITIVE_INFINITY);this.br.forEachInRange([r,o],l=>{s=s.add(l.wr)})}),N.resolve(this.Cr(s))}getAllMutationBatchesAffectingQuery(e,t){const s=t.path,i=s.length+1;let r=s;W.isDocumentKey(r)||(r=r.child(""));const o=new Me(new W(r),0);let l=new $e(ae);return this.br.forEachWhile(c=>{const h=c.key.path;return!!s.isPrefixOf(h)&&(h.length===i&&(l=l.add(c.wr)),!0)},o),N.resolve(this.Cr(l))}Cr(e){const t=[];return e.forEach(s=>{const i=this.Dr(s);i!==null&&t.push(i)}),t}removeMutationBatch(e,t){re(this.Fr(t.batchId,"removed")===0),this.mutationQueue.shift();let s=this.br;return N.forEach(t.mutations,i=>{const r=new Me(i.key,t.batchId);return s=s.delete(r),this.referenceDelegate.markPotentiallyOrphaned(e,i.key)}).next(()=>{this.br=s})}On(e){}containsKey(e,t){const s=new Me(t,0),i=this.br.firstAfterOrEqual(s);return N.resolve(t.isEqual(i&&i.key))}performConsistencyCheck(e){return this.mutationQueue.length,N.resolve()}Fr(e,t){return this.vr(e)}vr(e){return this.mutationQueue.length===0?0:e-this.mutationQueue[0].batchId}Dr(e){const t=this.vr(e);return t<0||t>=this.mutationQueue.length?null:this.mutationQueue[t]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class t0{constructor(e){this.Mr=e,this.docs=function(){return new ke(W.comparator)}(),this.size=0}setIndexManager(e){this.indexManager=e}addEntry(e,t){const s=t.key,i=this.docs.get(s),r=i?i.size:0,o=this.Mr(t);return this.docs=this.docs.insert(s,{document:t.mutableCopy(),size:o}),this.size+=o-r,this.indexManager.addToCollectionParentIndex(e,s.path.popLast())}removeEntry(e){const t=this.docs.get(e);t&&(this.docs=this.docs.remove(e),this.size-=t.size)}getEntry(e,t){const s=this.docs.get(t);return N.resolve(s?s.document.mutableCopy():Fe.newInvalidDocument(t))}getEntries(e,t){let s=sn();return t.forEach(i=>{const r=this.docs.get(i);s=s.insert(i,r?r.document.mutableCopy():Fe.newInvalidDocument(i))}),N.resolve(s)}getDocumentsMatchingQuery(e,t,s,i){let r=sn();const o=t.path,l=new W(o.child("")),c=this.docs.getIteratorFrom(l);for(;c.hasNext();){const{key:h,value:{document:d}}=c.getNext();if(!o.isPrefixOf(h.path))break;h.path.length>o.length+1||UT(BT(d),s)<=0||(i.has(d.key)||ga(t,d))&&(r=r.insert(d.key,d.mutableCopy()))}return N.resolve(r)}getAllFromCollectionGroup(e,t,s,i){j()}Or(e,t){return N.forEach(this.docs,s=>t(s))}newChangeBuffer(e){return new n0(this)}getSize(e){return N.resolve(this.size)}}class n0 extends KI{constructor(e){super(),this.cr=e}applyChanges(e){const t=[];return this.changes.forEach((s,i)=>{i.isValidDocument()?t.push(this.cr.addEntry(e,i)):this.cr.removeEntry(s)}),N.waitFor(t)}getFromCache(e,t){return this.cr.getEntry(e,t)}getAllFromCache(e,t){return this.cr.getEntries(e,t)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class s0{constructor(e){this.persistence=e,this.Nr=new ei(t=>Kc(t),Qc),this.lastRemoteSnapshotVersion=H.min(),this.highestTargetId=0,this.Lr=0,this.Br=new nh,this.targetCount=0,this.kr=qs.Bn()}forEachTarget(e,t){return this.Nr.forEach((s,i)=>t(i)),N.resolve()}getLastRemoteSnapshotVersion(e){return N.resolve(this.lastRemoteSnapshotVersion)}getHighestSequenceNumber(e){return N.resolve(this.Lr)}allocateTargetId(e){return this.highestTargetId=this.kr.next(),N.resolve(this.highestTargetId)}setTargetsMetadata(e,t,s){return s&&(this.lastRemoteSnapshotVersion=s),t>this.Lr&&(this.Lr=t),N.resolve()}Kn(e){this.Nr.set(e.target,e);const t=e.targetId;t>this.highestTargetId&&(this.kr=new qs(t),this.highestTargetId=t),e.sequenceNumber>this.Lr&&(this.Lr=e.sequenceNumber)}addTargetData(e,t){return this.Kn(t),this.targetCount+=1,N.resolve()}updateTargetData(e,t){return this.Kn(t),N.resolve()}removeTargetData(e,t){return this.Nr.delete(t.target),this.Br.gr(t.targetId),this.targetCount-=1,N.resolve()}removeTargets(e,t,s){let i=0;const r=[];return this.Nr.forEach((o,l)=>{l.sequenceNumber<=t&&s.get(l.targetId)===null&&(this.Nr.delete(o),r.push(this.removeMatchingKeysForTargetId(e,l.targetId)),i++)}),N.waitFor(r).next(()=>i)}getTargetCount(e){return N.resolve(this.targetCount)}getTargetData(e,t){const s=this.Nr.get(t)||null;return N.resolve(s)}addMatchingKeys(e,t,s){return this.Br.Rr(t,s),N.resolve()}removeMatchingKeys(e,t,s){this.Br.mr(t,s);const i=this.persistence.referenceDelegate,r=[];return i&&t.forEach(o=>{r.push(i.markPotentiallyOrphaned(e,o))}),N.waitFor(r)}removeMatchingKeysForTargetId(e,t){return this.Br.gr(t),N.resolve()}getMatchingKeysForTargetId(e,t){const s=this.Br.yr(t);return N.resolve(s)}containsKey(e,t){return N.resolve(this.Br.containsKey(t))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class i0{constructor(e,t){this.qr={},this.overlays={},this.Qr=new jc(0),this.Kr=!1,this.Kr=!0,this.$r=new ZI,this.referenceDelegate=e(this),this.Ur=new s0(this),this.indexManager=new zI,this.remoteDocumentCache=function(i){return new t0(i)}(s=>this.referenceDelegate.Wr(s)),this.serializer=new jI(t),this.Gr=new JI(this.serializer)}start(){return Promise.resolve()}shutdown(){return this.Kr=!1,Promise.resolve()}get started(){return this.Kr}setDatabaseDeletedListener(){}setNetworkEnabled(){}getIndexManager(e){return this.indexManager}getDocumentOverlayCache(e){let t=this.overlays[e.toKey()];return t||(t=new XI,this.overlays[e.toKey()]=t),t}getMutationQueue(e,t){let s=this.qr[e.toKey()];return s||(s=new e0(t,this.referenceDelegate),this.qr[e.toKey()]=s),s}getGlobalsCache(){return this.$r}getTargetCache(){return this.Ur}getRemoteDocumentCache(){return this.remoteDocumentCache}getBundleCache(){return this.Gr}runTransaction(e,t,s){B("MemoryPersistence","Starting transaction:",e);const i=new r0(this.Qr.next());return this.referenceDelegate.zr(),s(i).next(r=>this.referenceDelegate.jr(i).next(()=>r)).toPromise().then(r=>(i.raiseOnCommittedEvent(),r))}Hr(e,t){return N.or(Object.values(this.qr).map(s=>()=>s.containsKey(e,t)))}}class r0 extends WT{constructor(e){super(),this.currentSequenceNumber=e}}class sh{constructor(e){this.persistence=e,this.Jr=new nh,this.Yr=null}static Zr(e){return new sh(e)}get Xr(){if(this.Yr)return this.Yr;throw j()}addReference(e,t,s){return this.Jr.addReference(s,t),this.Xr.delete(s.toString()),N.resolve()}removeReference(e,t,s){return this.Jr.removeReference(s,t),this.Xr.add(s.toString()),N.resolve()}markPotentiallyOrphaned(e,t){return this.Xr.add(t.toString()),N.resolve()}removeTarget(e,t){this.Jr.gr(t.targetId).forEach(i=>this.Xr.add(i.toString()));const s=this.persistence.getTargetCache();return s.getMatchingKeysForTargetId(e,t.targetId).next(i=>{i.forEach(r=>this.Xr.add(r.toString()))}).next(()=>s.removeTargetData(e,t))}zr(){this.Yr=new Set}jr(e){const t=this.persistence.getRemoteDocumentCache().newChangeBuffer();return N.forEach(this.Xr,s=>{const i=W.fromPath(s);return this.ei(e,i).next(r=>{r||t.removeEntry(i,H.min())})}).next(()=>(this.Yr=null,t.apply(e)))}updateLimboDocument(e,t){return this.ei(e,t).next(s=>{s?this.Xr.delete(t.toString()):this.Xr.add(t.toString())})}Wr(e){return 0}ei(e,t){return N.or([()=>N.resolve(this.Jr.containsKey(t)),()=>this.persistence.getTargetCache().containsKey(e,t),()=>this.persistence.Hr(e,t)])}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ih{constructor(e,t,s,i){this.targetId=e,this.fromCache=t,this.$i=s,this.Ui=i}static Wi(e,t){let s=ne(),i=ne();for(const r of t.docChanges)switch(r.type){case 0:s=s.add(r.doc.key);break;case 1:i=i.add(r.doc.key)}return new ih(e,t.fromCache,s,i)}}/**
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
 */class o0{constructor(){this._documentReadCount=0}get documentReadCount(){return this._documentReadCount}incrementDocumentReadCount(e){this._documentReadCount+=e}}/**
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
 */class a0{constructor(){this.Gi=!1,this.zi=!1,this.ji=100,this.Hi=function(){return av()?8:$T(Ze())>0?6:4}()}initialize(e,t){this.Ji=e,this.indexManager=t,this.Gi=!0}getDocumentsMatchingQuery(e,t,s,i){const r={result:null};return this.Yi(e,t).next(o=>{r.result=o}).next(()=>{if(!r.result)return this.Zi(e,t,i,s).next(o=>{r.result=o})}).next(()=>{if(r.result)return;const o=new o0;return this.Xi(e,t,o).next(l=>{if(r.result=l,this.zi)return this.es(e,t,o,l.size)})}).next(()=>r.result)}es(e,t,s,i){return s.documentReadCount<this.ji?(wi()<=te.DEBUG&&B("QueryEngine","SDK will not create cache indexes for query:",bs(t),"since it only creates cache indexes for collection contains","more than or equal to",this.ji,"documents"),N.resolve()):(wi()<=te.DEBUG&&B("QueryEngine","Query:",bs(t),"scans",s.documentReadCount,"local documents and returns",i,"documents as results."),s.documentReadCount>this.Hi*i?(wi()<=te.DEBUG&&B("QueryEngine","The SDK decides to create cache indexes for query:",bs(t),"as using cache indexes may help improve performance."),this.indexManager.createTargetIndexes(e,xt(t))):N.resolve())}Yi(e,t){if(Xd(t))return N.resolve(null);let s=xt(t);return this.indexManager.getIndexType(e,s).next(i=>i===0?null:(t.limit!==null&&i===1&&(t=Fo(t,null,"F"),s=xt(t)),this.indexManager.getDocumentsMatchingTarget(e,s).next(r=>{const o=ne(...r);return this.Ji.getDocuments(e,o).next(l=>this.indexManager.getMinOffset(e,s).next(c=>{const h=this.ts(t,l);return this.ns(t,h,o,c.readTime)?this.Yi(e,Fo(t,null,"F")):this.rs(e,h,t,c)}))})))}Zi(e,t,s,i){return Xd(t)||i.isEqual(H.min())?N.resolve(null):this.Ji.getDocuments(e,s).next(r=>{const o=this.ts(t,r);return this.ns(t,o,s,i)?N.resolve(null):(wi()<=te.DEBUG&&B("QueryEngine","Re-using previous result from %s to execute query: %s",i.toString(),bs(t)),this.rs(e,o,t,FT(i,-1)).next(l=>l))})}ts(e,t){let s=new $e(Fm(e));return t.forEach((i,r)=>{ga(e,r)&&(s=s.add(r))}),s}ns(e,t,s,i){if(e.limit===null)return!1;if(s.size!==t.size)return!0;const r=e.limitType==="F"?t.last():t.first();return!!r&&(r.hasPendingWrites||r.version.compareTo(i)>0)}Xi(e,t,s){return wi()<=te.DEBUG&&B("QueryEngine","Using full collection scan to execute query:",bs(t)),this.Ji.getDocumentsMatchingQuery(e,t,Nn.min(),s)}rs(e,t,s,i){return this.Ji.getDocumentsMatchingQuery(e,s,i).next(r=>(t.forEach(o=>{r=r.insert(o.key,o)}),r))}}/**
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
 */class l0{constructor(e,t,s,i){this.persistence=e,this.ss=t,this.serializer=i,this.os=new ke(ae),this._s=new ei(r=>Kc(r),Qc),this.us=new Map,this.cs=e.getRemoteDocumentCache(),this.Ur=e.getTargetCache(),this.Gr=e.getBundleCache(),this.ls(s)}ls(e){this.documentOverlayCache=this.persistence.getDocumentOverlayCache(e),this.indexManager=this.persistence.getIndexManager(e),this.mutationQueue=this.persistence.getMutationQueue(e,this.indexManager),this.localDocuments=new YI(this.cs,this.mutationQueue,this.documentOverlayCache,this.indexManager),this.cs.setIndexManager(this.indexManager),this.ss.initialize(this.localDocuments,this.indexManager)}collectGarbage(e){return this.persistence.runTransaction("Collect garbage","readwrite-primary",t=>e.collect(t,this.os))}}function c0(n,e,t,s){return new l0(n,e,t,s)}async function lg(n,e){const t=Q(n);return await t.persistence.runTransaction("Handle user change","readonly",s=>{let i;return t.mutationQueue.getAllMutationBatches(s).next(r=>(i=r,t.ls(e),t.mutationQueue.getAllMutationBatches(s))).next(r=>{const o=[],l=[];let c=ne();for(const h of i){o.push(h.batchId);for(const d of h.mutations)c=c.add(d.key)}for(const h of r){l.push(h.batchId);for(const d of h.mutations)c=c.add(d.key)}return t.localDocuments.getDocuments(s,c).next(h=>({hs:h,removedBatchIds:o,addedBatchIds:l}))})})}function h0(n,e){const t=Q(n);return t.persistence.runTransaction("Acknowledge batch","readwrite-primary",s=>{const i=e.batch.keys(),r=t.cs.newChangeBuffer({trackRemovals:!0});return function(l,c,h,d){const p=h.batch,m=p.keys();let E=N.resolve();return m.forEach(R=>{E=E.next(()=>d.getEntry(c,R)).next(A=>{const P=h.docVersions.get(R);re(P!==null),A.version.compareTo(P)<0&&(p.applyToRemoteDocument(A,h),A.isValidDocument()&&(A.setReadTime(h.commitVersion),d.addEntry(A)))})}),E.next(()=>l.mutationQueue.removeMutationBatch(c,p))}(t,s,e,r).next(()=>r.apply(s)).next(()=>t.mutationQueue.performConsistencyCheck(s)).next(()=>t.documentOverlayCache.removeOverlaysForBatchId(s,i,e.batch.batchId)).next(()=>t.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(s,function(l){let c=ne();for(let h=0;h<l.mutationResults.length;++h)l.mutationResults[h].transformResults.length>0&&(c=c.add(l.batch.mutations[h].key));return c}(e))).next(()=>t.localDocuments.getDocuments(s,i))})}function cg(n){const e=Q(n);return e.persistence.runTransaction("Get last remote snapshot version","readonly",t=>e.Ur.getLastRemoteSnapshotVersion(t))}function u0(n,e){const t=Q(n),s=e.snapshotVersion;let i=t.os;return t.persistence.runTransaction("Apply remote event","readwrite-primary",r=>{const o=t.cs.newChangeBuffer({trackRemovals:!0});i=t.os;const l=[];e.targetChanges.forEach((d,p)=>{const m=i.get(p);if(!m)return;l.push(t.Ur.removeMatchingKeys(r,d.removedDocuments,p).next(()=>t.Ur.addMatchingKeys(r,d.addedDocuments,p)));let E=m.withSequenceNumber(r.currentSequenceNumber);e.targetMismatches.get(p)!==null?E=E.withResumeToken(je.EMPTY_BYTE_STRING,H.min()).withLastLimboFreeSnapshotVersion(H.min()):d.resumeToken.approximateByteSize()>0&&(E=E.withResumeToken(d.resumeToken,s)),i=i.insert(p,E),function(A,P,V){return A.resumeToken.approximateByteSize()===0||P.snapshotVersion.toMicroseconds()-A.snapshotVersion.toMicroseconds()>=3e8?!0:V.addedDocuments.size+V.modifiedDocuments.size+V.removedDocuments.size>0}(m,E,d)&&l.push(t.Ur.updateTargetData(r,E))});let c=sn(),h=ne();if(e.documentUpdates.forEach(d=>{e.resolvedLimboDocuments.has(d)&&l.push(t.persistence.referenceDelegate.updateLimboDocument(r,d))}),l.push(d0(r,o,e.documentUpdates).next(d=>{c=d.Ps,h=d.Is})),!s.isEqual(H.min())){const d=t.Ur.getLastRemoteSnapshotVersion(r).next(p=>t.Ur.setTargetsMetadata(r,r.currentSequenceNumber,s));l.push(d)}return N.waitFor(l).next(()=>o.apply(r)).next(()=>t.localDocuments.getLocalViewOfDocuments(r,c,h)).next(()=>c)}).then(r=>(t.os=i,r))}function d0(n,e,t){let s=ne(),i=ne();return t.forEach(r=>s=s.add(r)),e.getEntries(n,s).next(r=>{let o=sn();return t.forEach((l,c)=>{const h=r.get(l);c.isFoundDocument()!==h.isFoundDocument()&&(i=i.add(l)),c.isNoDocument()&&c.version.isEqual(H.min())?(e.removeEntry(l,c.readTime),o=o.insert(l,c)):!h.isValidDocument()||c.version.compareTo(h.version)>0||c.version.compareTo(h.version)===0&&h.hasPendingWrites?(e.addEntry(c),o=o.insert(l,c)):B("LocalStore","Ignoring outdated watch update for ",l,". Current version:",h.version," Watch version:",c.version)}),{Ps:o,Is:i}})}function f0(n,e){const t=Q(n);return t.persistence.runTransaction("Get next mutation batch","readonly",s=>(e===void 0&&(e=-1),t.mutationQueue.getNextMutationBatchAfterBatchId(s,e)))}function p0(n,e){const t=Q(n);return t.persistence.runTransaction("Allocate target","readwrite",s=>{let i;return t.Ur.getTargetData(s,e).next(r=>r?(i=r,N.resolve(i)):t.Ur.allocateTargetId(s).next(o=>(i=new En(e,o,"TargetPurposeListen",s.currentSequenceNumber),t.Ur.addTargetData(s,i).next(()=>i))))}).then(s=>{const i=t.os.get(s.targetId);return(i===null||s.snapshotVersion.compareTo(i.snapshotVersion)>0)&&(t.os=t.os.insert(s.targetId,s),t._s.set(e,s.targetId)),s})}async function sc(n,e,t){const s=Q(n),i=s.os.get(e),r=t?"readwrite":"readwrite-primary";try{t||await s.persistence.runTransaction("Release target",r,o=>s.persistence.referenceDelegate.removeTarget(o,i))}catch(o){if(!yr(o))throw o;B("LocalStore",`Failed to update sequence numbers for target ${e}: ${o}`)}s.os=s.os.remove(e),s._s.delete(i.target)}function hf(n,e,t){const s=Q(n);let i=H.min(),r=ne();return s.persistence.runTransaction("Execute query","readwrite",o=>function(c,h,d){const p=Q(c),m=p._s.get(d);return m!==void 0?N.resolve(p.os.get(m)):p.Ur.getTargetData(h,d)}(s,o,xt(e)).next(l=>{if(l)return i=l.lastLimboFreeSnapshotVersion,s.Ur.getMatchingKeysForTargetId(o,l.targetId).next(c=>{r=c})}).next(()=>s.ss.getDocumentsMatchingQuery(o,e,t?i:H.min(),t?r:ne())).next(l=>(m0(s,aI(e),l),{documents:l,Ts:r})))}function m0(n,e,t){let s=n.us.get(e)||H.min();t.forEach((i,r)=>{r.readTime.compareTo(s)>0&&(s=r.readTime)}),n.us.set(e,s)}class uf{constructor(){this.activeTargetIds=fI()}fs(e){this.activeTargetIds=this.activeTargetIds.add(e)}gs(e){this.activeTargetIds=this.activeTargetIds.delete(e)}Vs(){const e={activeTargetIds:this.activeTargetIds.toArray(),updateTimeMs:Date.now()};return JSON.stringify(e)}}class g0{constructor(){this.so=new uf,this.oo={},this.onlineStateHandler=null,this.sequenceNumberHandler=null}addPendingMutation(e){}updateMutationState(e,t,s){}addLocalQueryTarget(e,t=!0){return t&&this.so.fs(e),this.oo[e]||"not-current"}updateQueryState(e,t,s){this.oo[e]=t}removeLocalQueryTarget(e){this.so.gs(e)}isLocalQueryTarget(e){return this.so.activeTargetIds.has(e)}clearQueryState(e){delete this.oo[e]}getAllActiveQueryTargets(){return this.so.activeTargetIds}isActiveQueryTarget(e){return this.so.activeTargetIds.has(e)}start(){return this.so=new uf,Promise.resolve()}handleUserChange(e,t,s){}setOnlineState(e){}shutdown(){}writeSequenceNumber(e){}notifyBundleLoaded(e){}}/**
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
 */class _0{_o(e){}shutdown(){}}/**
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
 */class df{constructor(){this.ao=()=>this.uo(),this.co=()=>this.lo(),this.ho=[],this.Po()}_o(e){this.ho.push(e)}shutdown(){window.removeEventListener("online",this.ao),window.removeEventListener("offline",this.co)}Po(){window.addEventListener("online",this.ao),window.addEventListener("offline",this.co)}uo(){B("ConnectivityMonitor","Network connectivity changed: AVAILABLE");for(const e of this.ho)e(0)}lo(){B("ConnectivityMonitor","Network connectivity changed: UNAVAILABLE");for(const e of this.ho)e(1)}static D(){return typeof window<"u"&&window.addEventListener!==void 0&&window.removeEventListener!==void 0}}/**
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
 */let so=null;function fl(){return so===null?so=function(){return 268435456+Math.round(2147483648*Math.random())}():so++,"0x"+so.toString(16)}/**
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
 */const y0={BatchGetDocuments:"batchGet",Commit:"commit",RunQuery:"runQuery",RunAggregationQuery:"runAggregationQuery"};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class v0{constructor(e){this.Io=e.Io,this.To=e.To}Eo(e){this.Ao=e}Ro(e){this.Vo=e}mo(e){this.fo=e}onMessage(e){this.po=e}close(){this.To()}send(e){this.Io(e)}yo(){this.Ao()}wo(){this.Vo()}So(e){this.fo(e)}bo(e){this.po(e)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Qe="WebChannelConnection";class E0 extends class{constructor(t){this.databaseInfo=t,this.databaseId=t.databaseId;const s=t.ssl?"https":"http",i=encodeURIComponent(this.databaseId.projectId),r=encodeURIComponent(this.databaseId.database);this.Do=s+"://"+t.host,this.vo=`projects/${i}/databases/${r}`,this.Co=this.databaseId.database==="(default)"?`project_id=${i}`:`project_id=${i}&database_id=${r}`}get Fo(){return!1}Mo(t,s,i,r,o){const l=fl(),c=this.xo(t,s.toUriEncodedString());B("RestConnection",`Sending RPC '${t}' ${l}:`,c,i);const h={"google-cloud-resource-prefix":this.vo,"x-goog-request-params":this.Co};return this.Oo(h,r,o),this.No(t,c,h,i).then(d=>(B("RestConnection",`Received RPC '${t}' ${l}: `,d),d),d=>{throw Vs("RestConnection",`RPC '${t}' ${l} failed with error: `,d,"url: ",c,"request:",i),d})}Lo(t,s,i,r,o,l){return this.Mo(t,s,i,r,o)}Oo(t,s,i){t["X-Goog-Api-Client"]=function(){return"gl-js/ fire/"+Xs}(),t["Content-Type"]="text/plain",this.databaseInfo.appId&&(t["X-Firebase-GMPID"]=this.databaseInfo.appId),s&&s.headers.forEach((r,o)=>t[o]=r),i&&i.headers.forEach((r,o)=>t[o]=r)}xo(t,s){const i=y0[t];return`${this.Do}/v1/${s}:${i}`}terminate(){}}{constructor(e){super(e),this.forceLongPolling=e.forceLongPolling,this.autoDetectLongPolling=e.autoDetectLongPolling,this.useFetchStreams=e.useFetchStreams,this.longPollingOptions=e.longPollingOptions}No(e,t,s,i){const r=fl();return new Promise((o,l)=>{const c=new Em;c.setWithCredentials(!0),c.listenOnce(wm.COMPLETE,()=>{try{switch(c.getLastErrorCode()){case mo.NO_ERROR:const d=c.getResponseJson();B(Qe,`XHR for RPC '${e}' ${r} received:`,JSON.stringify(d)),o(d);break;case mo.TIMEOUT:B(Qe,`RPC '${e}' ${r} timed out`),l(new M(k.DEADLINE_EXCEEDED,"Request time out"));break;case mo.HTTP_ERROR:const p=c.getStatus();if(B(Qe,`RPC '${e}' ${r} failed with status:`,p,"response text:",c.getResponseText()),p>0){let m=c.getResponseJson();Array.isArray(m)&&(m=m[0]);const E=m==null?void 0:m.error;if(E&&E.status&&E.message){const R=function(P){const V=P.toLowerCase().replace(/_/g,"-");return Object.values(k).indexOf(V)>=0?V:k.UNKNOWN}(E.status);l(new M(R,E.message))}else l(new M(k.UNKNOWN,"Server responded with status "+c.getStatus()))}else l(new M(k.UNAVAILABLE,"Connection failed."));break;default:j()}}finally{B(Qe,`RPC '${e}' ${r} completed.`)}});const h=JSON.stringify(i);B(Qe,`RPC '${e}' ${r} sending request:`,i),c.send(t,"POST",h,s,15)})}Bo(e,t,s){const i=fl(),r=[this.Do,"/","google.firestore.v1.Firestore","/",e,"/channel"],o=bm(),l=Im(),c={httpSessionIdParam:"gsessionid",initMessageHeaders:{},messageUrlParams:{database:`projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`},sendRawJson:!0,supportsCrossDomainXhr:!0,internalChannelParams:{forwardChannelRequestTimeoutMs:6e5},forceLongPolling:this.forceLongPolling,detectBufferingProxy:this.autoDetectLongPolling},h=this.longPollingOptions.timeoutSeconds;h!==void 0&&(c.longPollingTimeout=Math.round(1e3*h)),this.useFetchStreams&&(c.useFetchStreams=!0),this.Oo(c.initMessageHeaders,t,s),c.encodeInitMessageHeaders=!0;const d=r.join("");B(Qe,`Creating RPC '${e}' stream ${i}: ${d}`,c);const p=o.createWebChannel(d,c);let m=!1,E=!1;const R=new v0({Io:P=>{E?B(Qe,`Not sending because RPC '${e}' stream ${i} is closed:`,P):(m||(B(Qe,`Opening RPC '${e}' stream ${i} transport.`),p.open(),m=!0),B(Qe,`RPC '${e}' stream ${i} sending:`,P),p.send(P))},To:()=>p.close()}),A=(P,V,U)=>{P.listen(V,q=>{try{U(q)}catch(J){setTimeout(()=>{throw J},0)}})};return A(p,Li.EventType.OPEN,()=>{E||(B(Qe,`RPC '${e}' stream ${i} transport opened.`),R.yo())}),A(p,Li.EventType.CLOSE,()=>{E||(E=!0,B(Qe,`RPC '${e}' stream ${i} transport closed`),R.So())}),A(p,Li.EventType.ERROR,P=>{E||(E=!0,Vs(Qe,`RPC '${e}' stream ${i} transport errored:`,P),R.So(new M(k.UNAVAILABLE,"The operation could not be completed")))}),A(p,Li.EventType.MESSAGE,P=>{var V;if(!E){const U=P.data[0];re(!!U);const q=U,J=q.error||((V=q[0])===null||V===void 0?void 0:V.error);if(J){B(Qe,`RPC '${e}' stream ${i} received error:`,J);const ye=J.status;let ue=function(y){const w=Re[y];if(w!==void 0)return Jm(w)}(ye),I=J.message;ue===void 0&&(ue=k.INTERNAL,I="Unknown error status: "+ye+" with message "+J.message),E=!0,R.So(new M(ue,I)),p.close()}else B(Qe,`RPC '${e}' stream ${i} received:`,U),R.bo(U)}}),A(l,Tm.STAT_EVENT,P=>{P.stat===Hl.PROXY?B(Qe,`RPC '${e}' stream ${i} detected buffering proxy`):P.stat===Hl.NOPROXY&&B(Qe,`RPC '${e}' stream ${i} detected no buffering proxy`)}),setTimeout(()=>{R.wo()},0),R}}function pl(){return typeof document<"u"?document:null}/**
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
 */function Ea(n){return new PI(n,!0)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rh{constructor(e,t,s=1e3,i=1.5,r=6e4){this.ui=e,this.timerId=t,this.ko=s,this.qo=i,this.Qo=r,this.Ko=0,this.$o=null,this.Uo=Date.now(),this.reset()}reset(){this.Ko=0}Wo(){this.Ko=this.Qo}Go(e){this.cancel();const t=Math.floor(this.Ko+this.zo()),s=Math.max(0,Date.now()-this.Uo),i=Math.max(0,t-s);i>0&&B("ExponentialBackoff",`Backing off for ${i} ms (base delay: ${this.Ko} ms, delay with jitter: ${t} ms, last attempt: ${s} ms ago)`),this.$o=this.ui.enqueueAfterDelay(this.timerId,i,()=>(this.Uo=Date.now(),e())),this.Ko*=this.qo,this.Ko<this.ko&&(this.Ko=this.ko),this.Ko>this.Qo&&(this.Ko=this.Qo)}jo(){this.$o!==null&&(this.$o.skipDelay(),this.$o=null)}cancel(){this.$o!==null&&(this.$o.cancel(),this.$o=null)}zo(){return(Math.random()-.5)*this.Ko}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class hg{constructor(e,t,s,i,r,o,l,c){this.ui=e,this.Ho=s,this.Jo=i,this.connection=r,this.authCredentialsProvider=o,this.appCheckCredentialsProvider=l,this.listener=c,this.state=0,this.Yo=0,this.Zo=null,this.Xo=null,this.stream=null,this.e_=0,this.t_=new rh(e,t)}n_(){return this.state===1||this.state===5||this.r_()}r_(){return this.state===2||this.state===3}start(){this.e_=0,this.state!==4?this.auth():this.i_()}async stop(){this.n_()&&await this.close(0)}s_(){this.state=0,this.t_.reset()}o_(){this.r_()&&this.Zo===null&&(this.Zo=this.ui.enqueueAfterDelay(this.Ho,6e4,()=>this.__()))}a_(e){this.u_(),this.stream.send(e)}async __(){if(this.r_())return this.close(0)}u_(){this.Zo&&(this.Zo.cancel(),this.Zo=null)}c_(){this.Xo&&(this.Xo.cancel(),this.Xo=null)}async close(e,t){this.u_(),this.c_(),this.t_.cancel(),this.Yo++,e!==4?this.t_.reset():t&&t.code===k.RESOURCE_EXHAUSTED?(nn(t.toString()),nn("Using maximum backoff delay to prevent overloading the backend."),this.t_.Wo()):t&&t.code===k.UNAUTHENTICATED&&this.state!==3&&(this.authCredentialsProvider.invalidateToken(),this.appCheckCredentialsProvider.invalidateToken()),this.stream!==null&&(this.l_(),this.stream.close(),this.stream=null),this.state=e,await this.listener.mo(t)}l_(){}auth(){this.state=1;const e=this.h_(this.Yo),t=this.Yo;Promise.all([this.authCredentialsProvider.getToken(),this.appCheckCredentialsProvider.getToken()]).then(([s,i])=>{this.Yo===t&&this.P_(s,i)},s=>{e(()=>{const i=new M(k.UNKNOWN,"Fetching auth token failed: "+s.message);return this.I_(i)})})}P_(e,t){const s=this.h_(this.Yo);this.stream=this.T_(e,t),this.stream.Eo(()=>{s(()=>this.listener.Eo())}),this.stream.Ro(()=>{s(()=>(this.state=2,this.Xo=this.ui.enqueueAfterDelay(this.Jo,1e4,()=>(this.r_()&&(this.state=3),Promise.resolve())),this.listener.Ro()))}),this.stream.mo(i=>{s(()=>this.I_(i))}),this.stream.onMessage(i=>{s(()=>++this.e_==1?this.E_(i):this.onNext(i))})}i_(){this.state=5,this.t_.Go(async()=>{this.state=0,this.start()})}I_(e){return B("PersistentStream",`close with error: ${e}`),this.stream=null,this.close(4,e)}h_(e){return t=>{this.ui.enqueueAndForget(()=>this.Yo===e?t():(B("PersistentStream","stream callback skipped by getCloseGuardedDispatcher."),Promise.resolve()))}}}class w0 extends hg{constructor(e,t,s,i,r,o){super(e,"listen_stream_connection_backoff","listen_stream_idle","health_check_timeout",t,s,i,o),this.serializer=r}T_(e,t){return this.connection.Bo("Listen",e,t)}E_(e){return this.onNext(e)}onNext(e){this.t_.reset();const t=xI(this.serializer,e),s=function(r){if(!("targetChange"in r))return H.min();const o=r.targetChange;return o.targetIds&&o.targetIds.length?H.min():o.readTime?pt(o.readTime):H.min()}(e);return this.listener.d_(t,s)}A_(e){const t={};t.database=nc(this.serializer),t.addTarget=function(r,o){let l;const c=o.target;if(l=Xl(c)?{documents:MI(r,c)}:{query:VI(r,c)._t},l.targetId=o.targetId,o.resumeToken.approximateByteSize()>0){l.resumeToken=eg(r,o.resumeToken);const h=ec(r,o.expectedCount);h!==null&&(l.expectedCount=h)}else if(o.snapshotVersion.compareTo(H.min())>0){l.readTime=qo(r,o.snapshotVersion.toTimestamp());const h=ec(r,o.expectedCount);h!==null&&(l.expectedCount=h)}return l}(this.serializer,e);const s=BI(this.serializer,e);s&&(t.labels=s),this.a_(t)}R_(e){const t={};t.database=nc(this.serializer),t.removeTarget=e,this.a_(t)}}class T0 extends hg{constructor(e,t,s,i,r,o){super(e,"write_stream_connection_backoff","write_stream_idle","health_check_timeout",t,s,i,o),this.serializer=r}get V_(){return this.e_>0}start(){this.lastStreamToken=void 0,super.start()}l_(){this.V_&&this.m_([])}T_(e,t){return this.connection.Bo("Write",e,t)}E_(e){return re(!!e.streamToken),this.lastStreamToken=e.streamToken,re(!e.writeResults||e.writeResults.length===0),this.listener.f_()}onNext(e){re(!!e.streamToken),this.lastStreamToken=e.streamToken,this.t_.reset();const t=OI(e.writeResults,e.commitTime),s=pt(e.commitTime);return this.listener.g_(s,t)}p_(){const e={};e.database=nc(this.serializer),this.a_(e)}m_(e){const t={streamToken:this.lastStreamToken,writes:e.map(s=>ig(this.serializer,s))};this.a_(t)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class I0 extends class{}{constructor(e,t,s,i){super(),this.authCredentials=e,this.appCheckCredentials=t,this.connection=s,this.serializer=i,this.y_=!1}w_(){if(this.y_)throw new M(k.FAILED_PRECONDITION,"The client has already been terminated.")}Mo(e,t,s,i){return this.w_(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([r,o])=>this.connection.Mo(e,tc(t,s),i,r,o)).catch(r=>{throw r.name==="FirebaseError"?(r.code===k.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),r):new M(k.UNKNOWN,r.toString())})}Lo(e,t,s,i,r){return this.w_(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([o,l])=>this.connection.Lo(e,tc(t,s),i,o,l,r)).catch(o=>{throw o.name==="FirebaseError"?(o.code===k.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),o):new M(k.UNKNOWN,o.toString())})}terminate(){this.y_=!0,this.connection.terminate()}}class b0{constructor(e,t){this.asyncQueue=e,this.onlineStateHandler=t,this.state="Unknown",this.S_=0,this.b_=null,this.D_=!0}v_(){this.S_===0&&(this.C_("Unknown"),this.b_=this.asyncQueue.enqueueAfterDelay("online_state_timeout",1e4,()=>(this.b_=null,this.F_("Backend didn't respond within 10 seconds."),this.C_("Offline"),Promise.resolve())))}M_(e){this.state==="Online"?this.C_("Unknown"):(this.S_++,this.S_>=1&&(this.x_(),this.F_(`Connection failed 1 times. Most recent error: ${e.toString()}`),this.C_("Offline")))}set(e){this.x_(),this.S_=0,e==="Online"&&(this.D_=!1),this.C_(e)}C_(e){e!==this.state&&(this.state=e,this.onlineStateHandler(e))}F_(e){const t=`Could not reach Cloud Firestore backend. ${e}
This typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;this.D_?(nn(t),this.D_=!1):B("OnlineStateTracker",t)}x_(){this.b_!==null&&(this.b_.cancel(),this.b_=null)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class C0{constructor(e,t,s,i,r){this.localStore=e,this.datastore=t,this.asyncQueue=s,this.remoteSyncer={},this.O_=[],this.N_=new Map,this.L_=new Set,this.B_=[],this.k_=r,this.k_._o(o=>{s.enqueueAndForget(async()=>{cs(this)&&(B("RemoteStore","Restarting streams for network reachability change."),await async function(c){const h=Q(c);h.L_.add(4),await Tr(h),h.q_.set("Unknown"),h.L_.delete(4),await wa(h)}(this))})}),this.q_=new b0(s,i)}}async function wa(n){if(cs(n))for(const e of n.B_)await e(!0)}async function Tr(n){for(const e of n.B_)await e(!1)}function ug(n,e){const t=Q(n);t.N_.has(e.targetId)||(t.N_.set(e.targetId,e),ch(t)?lh(t):ti(t).r_()&&ah(t,e))}function oh(n,e){const t=Q(n),s=ti(t);t.N_.delete(e),s.r_()&&dg(t,e),t.N_.size===0&&(s.r_()?s.o_():cs(t)&&t.q_.set("Unknown"))}function ah(n,e){if(n.Q_.xe(e.targetId),e.resumeToken.approximateByteSize()>0||e.snapshotVersion.compareTo(H.min())>0){const t=n.remoteSyncer.getRemoteKeysForTarget(e.targetId).size;e=e.withExpectedCount(t)}ti(n).A_(e)}function dg(n,e){n.Q_.xe(e),ti(n).R_(e)}function lh(n){n.Q_=new RI({getRemoteKeysForTarget:e=>n.remoteSyncer.getRemoteKeysForTarget(e),ot:e=>n.N_.get(e)||null,tt:()=>n.datastore.serializer.databaseId}),ti(n).start(),n.q_.v_()}function ch(n){return cs(n)&&!ti(n).n_()&&n.N_.size>0}function cs(n){return Q(n).L_.size===0}function fg(n){n.Q_=void 0}async function R0(n){n.q_.set("Online")}async function S0(n){n.N_.forEach((e,t)=>{ah(n,e)})}async function A0(n,e){fg(n),ch(n)?(n.q_.M_(e),lh(n)):n.q_.set("Unknown")}async function k0(n,e,t){if(n.q_.set("Online"),e instanceof Zm&&e.state===2&&e.cause)try{await async function(i,r){const o=r.cause;for(const l of r.targetIds)i.N_.has(l)&&(await i.remoteSyncer.rejectListen(l,o),i.N_.delete(l),i.Q_.removeTarget(l))}(n,e)}catch(s){B("RemoteStore","Failed to remove targets %s: %s ",e.targetIds.join(","),s),await $o(n,s)}else if(e instanceof yo?n.Q_.Ke(e):e instanceof Xm?n.Q_.He(e):n.Q_.We(e),!t.isEqual(H.min()))try{const s=await cg(n.localStore);t.compareTo(s)>=0&&await function(r,o){const l=r.Q_.rt(o);return l.targetChanges.forEach((c,h)=>{if(c.resumeToken.approximateByteSize()>0){const d=r.N_.get(h);d&&r.N_.set(h,d.withResumeToken(c.resumeToken,o))}}),l.targetMismatches.forEach((c,h)=>{const d=r.N_.get(c);if(!d)return;r.N_.set(c,d.withResumeToken(je.EMPTY_BYTE_STRING,d.snapshotVersion)),dg(r,c);const p=new En(d.target,c,h,d.sequenceNumber);ah(r,p)}),r.remoteSyncer.applyRemoteEvent(l)}(n,t)}catch(s){B("RemoteStore","Failed to raise snapshot:",s),await $o(n,s)}}async function $o(n,e,t){if(!yr(e))throw e;n.L_.add(1),await Tr(n),n.q_.set("Offline"),t||(t=()=>cg(n.localStore)),n.asyncQueue.enqueueRetryable(async()=>{B("RemoteStore","Retrying IndexedDB access"),await t(),n.L_.delete(1),await wa(n)})}function pg(n,e){return e().catch(t=>$o(n,t,e))}async function Ta(n){const e=Q(n),t=Ln(e);let s=e.O_.length>0?e.O_[e.O_.length-1].batchId:-1;for(;P0(e);)try{const i=await f0(e.localStore,s);if(i===null){e.O_.length===0&&t.o_();break}s=i.batchId,N0(e,i)}catch(i){await $o(e,i)}mg(e)&&gg(e)}function P0(n){return cs(n)&&n.O_.length<10}function N0(n,e){n.O_.push(e);const t=Ln(n);t.r_()&&t.V_&&t.m_(e.mutations)}function mg(n){return cs(n)&&!Ln(n).n_()&&n.O_.length>0}function gg(n){Ln(n).start()}async function D0(n){Ln(n).p_()}async function L0(n){const e=Ln(n);for(const t of n.O_)e.m_(t.mutations)}async function x0(n,e,t){const s=n.O_.shift(),i=Zc.from(s,e,t);await pg(n,()=>n.remoteSyncer.applySuccessfulWrite(i)),await Ta(n)}async function O0(n,e){e&&Ln(n).V_&&await async function(s,i){if(function(o){return Ym(o)&&o!==k.ABORTED}(i.code)){const r=s.O_.shift();Ln(s).s_(),await pg(s,()=>s.remoteSyncer.rejectFailedWrite(r.batchId,i)),await Ta(s)}}(n,e),mg(n)&&gg(n)}async function ff(n,e){const t=Q(n);t.asyncQueue.verifyOperationInProgress(),B("RemoteStore","RemoteStore received new credentials");const s=cs(t);t.L_.add(3),await Tr(t),s&&t.q_.set("Unknown"),await t.remoteSyncer.handleCredentialChange(e),t.L_.delete(3),await wa(t)}async function M0(n,e){const t=Q(n);e?(t.L_.delete(2),await wa(t)):e||(t.L_.add(2),await Tr(t),t.q_.set("Unknown"))}function ti(n){return n.K_||(n.K_=function(t,s,i){const r=Q(t);return r.w_(),new w0(s,r.connection,r.authCredentials,r.appCheckCredentials,r.serializer,i)}(n.datastore,n.asyncQueue,{Eo:R0.bind(null,n),Ro:S0.bind(null,n),mo:A0.bind(null,n),d_:k0.bind(null,n)}),n.B_.push(async e=>{e?(n.K_.s_(),ch(n)?lh(n):n.q_.set("Unknown")):(await n.K_.stop(),fg(n))})),n.K_}function Ln(n){return n.U_||(n.U_=function(t,s,i){const r=Q(t);return r.w_(),new T0(s,r.connection,r.authCredentials,r.appCheckCredentials,r.serializer,i)}(n.datastore,n.asyncQueue,{Eo:()=>Promise.resolve(),Ro:D0.bind(null,n),mo:O0.bind(null,n),f_:L0.bind(null,n),g_:x0.bind(null,n)}),n.B_.push(async e=>{e?(n.U_.s_(),await Ta(n)):(await n.U_.stop(),n.O_.length>0&&(B("RemoteStore",`Stopping write stream with ${n.O_.length} pending writes`),n.O_=[]))})),n.U_}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class hh{constructor(e,t,s,i,r){this.asyncQueue=e,this.timerId=t,this.targetTimeMs=s,this.op=i,this.removalCallback=r,this.deferred=new Lt,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch(o=>{})}get promise(){return this.deferred.promise}static createAndSchedule(e,t,s,i,r){const o=Date.now()+s,l=new hh(e,t,o,i,r);return l.start(s),l}start(e){this.timerHandle=setTimeout(()=>this.handleDelayElapsed(),e)}skipDelay(){return this.handleDelayElapsed()}cancel(e){this.timerHandle!==null&&(this.clearTimeout(),this.deferred.reject(new M(k.CANCELLED,"Operation cancelled"+(e?": "+e:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget(()=>this.timerHandle!==null?(this.clearTimeout(),this.op().then(e=>this.deferred.resolve(e))):Promise.resolve())}clearTimeout(){this.timerHandle!==null&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}}function uh(n,e){if(nn("AsyncQueue",`${e}: ${n}`),yr(n))return new M(k.UNAVAILABLE,`${e}: ${n}`);throw n}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ds{constructor(e){this.comparator=e?(t,s)=>e(t,s)||W.comparator(t.key,s.key):(t,s)=>W.comparator(t.key,s.key),this.keyedMap=xi(),this.sortedSet=new ke(this.comparator)}static emptySet(e){return new Ds(e.comparator)}has(e){return this.keyedMap.get(e)!=null}get(e){return this.keyedMap.get(e)}first(){return this.sortedSet.minKey()}last(){return this.sortedSet.maxKey()}isEmpty(){return this.sortedSet.isEmpty()}indexOf(e){const t=this.keyedMap.get(e);return t?this.sortedSet.indexOf(t):-1}get size(){return this.sortedSet.size}forEach(e){this.sortedSet.inorderTraversal((t,s)=>(e(t),!1))}add(e){const t=this.delete(e.key);return t.copy(t.keyedMap.insert(e.key,e),t.sortedSet.insert(e,null))}delete(e){const t=this.get(e);return t?this.copy(this.keyedMap.remove(e),this.sortedSet.remove(t)):this}isEqual(e){if(!(e instanceof Ds)||this.size!==e.size)return!1;const t=this.sortedSet.getIterator(),s=e.sortedSet.getIterator();for(;t.hasNext();){const i=t.getNext().key,r=s.getNext().key;if(!i.isEqual(r))return!1}return!0}toString(){const e=[];return this.forEach(t=>{e.push(t.toString())}),e.length===0?"DocumentSet ()":`DocumentSet (
  `+e.join(`  
`)+`
)`}copy(e,t){const s=new Ds;return s.comparator=this.comparator,s.keyedMap=e,s.sortedSet=t,s}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pf{constructor(){this.W_=new ke(W.comparator)}track(e){const t=e.doc.key,s=this.W_.get(t);s?e.type!==0&&s.type===3?this.W_=this.W_.insert(t,e):e.type===3&&s.type!==1?this.W_=this.W_.insert(t,{type:s.type,doc:e.doc}):e.type===2&&s.type===2?this.W_=this.W_.insert(t,{type:2,doc:e.doc}):e.type===2&&s.type===0?this.W_=this.W_.insert(t,{type:0,doc:e.doc}):e.type===1&&s.type===0?this.W_=this.W_.remove(t):e.type===1&&s.type===2?this.W_=this.W_.insert(t,{type:1,doc:s.doc}):e.type===0&&s.type===1?this.W_=this.W_.insert(t,{type:2,doc:e.doc}):j():this.W_=this.W_.insert(t,e)}G_(){const e=[];return this.W_.inorderTraversal((t,s)=>{e.push(s)}),e}}class Ws{constructor(e,t,s,i,r,o,l,c,h){this.query=e,this.docs=t,this.oldDocs=s,this.docChanges=i,this.mutatedKeys=r,this.fromCache=o,this.syncStateChanged=l,this.excludesMetadataChanges=c,this.hasCachedResults=h}static fromInitialDocuments(e,t,s,i,r){const o=[];return t.forEach(l=>{o.push({type:0,doc:l})}),new Ws(e,t,Ds.emptySet(t),o,s,i,!0,!1,r)}get hasPendingWrites(){return!this.mutatedKeys.isEmpty()}isEqual(e){if(!(this.fromCache===e.fromCache&&this.hasCachedResults===e.hasCachedResults&&this.syncStateChanged===e.syncStateChanged&&this.mutatedKeys.isEqual(e.mutatedKeys)&&ma(this.query,e.query)&&this.docs.isEqual(e.docs)&&this.oldDocs.isEqual(e.oldDocs)))return!1;const t=this.docChanges,s=e.docChanges;if(t.length!==s.length)return!1;for(let i=0;i<t.length;i++)if(t[i].type!==s[i].type||!t[i].doc.isEqual(s[i].doc))return!1;return!0}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class V0{constructor(){this.z_=void 0,this.j_=[]}H_(){return this.j_.some(e=>e.J_())}}class F0{constructor(){this.queries=mf(),this.onlineState="Unknown",this.Y_=new Set}terminate(){(function(t,s){const i=Q(t),r=i.queries;i.queries=mf(),r.forEach((o,l)=>{for(const c of l.j_)c.onError(s)})})(this,new M(k.ABORTED,"Firestore shutting down"))}}function mf(){return new ei(n=>Vm(n),ma)}async function _g(n,e){const t=Q(n);let s=3;const i=e.query;let r=t.queries.get(i);r?!r.H_()&&e.J_()&&(s=2):(r=new V0,s=e.J_()?0:1);try{switch(s){case 0:r.z_=await t.onListen(i,!0);break;case 1:r.z_=await t.onListen(i,!1);break;case 2:await t.onFirstRemoteStoreListen(i)}}catch(o){const l=uh(o,`Initialization of query '${bs(e.query)}' failed`);return void e.onError(l)}t.queries.set(i,r),r.j_.push(e),e.Z_(t.onlineState),r.z_&&e.X_(r.z_)&&dh(t)}async function yg(n,e){const t=Q(n),s=e.query;let i=3;const r=t.queries.get(s);if(r){const o=r.j_.indexOf(e);o>=0&&(r.j_.splice(o,1),r.j_.length===0?i=e.J_()?0:1:!r.H_()&&e.J_()&&(i=2))}switch(i){case 0:return t.queries.delete(s),t.onUnlisten(s,!0);case 1:return t.queries.delete(s),t.onUnlisten(s,!1);case 2:return t.onLastRemoteStoreUnlisten(s);default:return}}function B0(n,e){const t=Q(n);let s=!1;for(const i of e){const r=i.query,o=t.queries.get(r);if(o){for(const l of o.j_)l.X_(i)&&(s=!0);o.z_=i}}s&&dh(t)}function U0(n,e,t){const s=Q(n),i=s.queries.get(e);if(i)for(const r of i.j_)r.onError(t);s.queries.delete(e)}function dh(n){n.Y_.forEach(e=>{e.next()})}var ic,gf;(gf=ic||(ic={})).ea="default",gf.Cache="cache";class vg{constructor(e,t,s){this.query=e,this.ta=t,this.na=!1,this.ra=null,this.onlineState="Unknown",this.options=s||{}}X_(e){if(!this.options.includeMetadataChanges){const s=[];for(const i of e.docChanges)i.type!==3&&s.push(i);e=new Ws(e.query,e.docs,e.oldDocs,s,e.mutatedKeys,e.fromCache,e.syncStateChanged,!0,e.hasCachedResults)}let t=!1;return this.na?this.ia(e)&&(this.ta.next(e),t=!0):this.sa(e,this.onlineState)&&(this.oa(e),t=!0),this.ra=e,t}onError(e){this.ta.error(e)}Z_(e){this.onlineState=e;let t=!1;return this.ra&&!this.na&&this.sa(this.ra,e)&&(this.oa(this.ra),t=!0),t}sa(e,t){if(!e.fromCache||!this.J_())return!0;const s=t!=="Offline";return(!this.options._a||!s)&&(!e.docs.isEmpty()||e.hasCachedResults||t==="Offline")}ia(e){if(e.docChanges.length>0)return!0;const t=this.ra&&this.ra.hasPendingWrites!==e.hasPendingWrites;return!(!e.syncStateChanged&&!t)&&this.options.includeMetadataChanges===!0}oa(e){e=Ws.fromInitialDocuments(e.query,e.docs,e.mutatedKeys,e.fromCache,e.hasCachedResults),this.na=!0,this.ta.next(e)}J_(){return this.options.source!==ic.Cache}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Eg{constructor(e){this.key=e}}class wg{constructor(e){this.key=e}}class q0{constructor(e,t){this.query=e,this.Ta=t,this.Ea=null,this.hasCachedResults=!1,this.current=!1,this.da=ne(),this.mutatedKeys=ne(),this.Aa=Fm(e),this.Ra=new Ds(this.Aa)}get Va(){return this.Ta}ma(e,t){const s=t?t.fa:new pf,i=t?t.Ra:this.Ra;let r=t?t.mutatedKeys:this.mutatedKeys,o=i,l=!1;const c=this.query.limitType==="F"&&i.size===this.query.limit?i.last():null,h=this.query.limitType==="L"&&i.size===this.query.limit?i.first():null;if(e.inorderTraversal((d,p)=>{const m=i.get(d),E=ga(this.query,p)?p:null,R=!!m&&this.mutatedKeys.has(m.key),A=!!E&&(E.hasLocalMutations||this.mutatedKeys.has(E.key)&&E.hasCommittedMutations);let P=!1;m&&E?m.data.isEqual(E.data)?R!==A&&(s.track({type:3,doc:E}),P=!0):this.ga(m,E)||(s.track({type:2,doc:E}),P=!0,(c&&this.Aa(E,c)>0||h&&this.Aa(E,h)<0)&&(l=!0)):!m&&E?(s.track({type:0,doc:E}),P=!0):m&&!E&&(s.track({type:1,doc:m}),P=!0,(c||h)&&(l=!0)),P&&(E?(o=o.add(E),r=A?r.add(d):r.delete(d)):(o=o.delete(d),r=r.delete(d)))}),this.query.limit!==null)for(;o.size>this.query.limit;){const d=this.query.limitType==="F"?o.last():o.first();o=o.delete(d.key),r=r.delete(d.key),s.track({type:1,doc:d})}return{Ra:o,fa:s,ns:l,mutatedKeys:r}}ga(e,t){return e.hasLocalMutations&&t.hasCommittedMutations&&!t.hasLocalMutations}applyChanges(e,t,s,i){const r=this.Ra;this.Ra=e.Ra,this.mutatedKeys=e.mutatedKeys;const o=e.fa.G_();o.sort((d,p)=>function(E,R){const A=P=>{switch(P){case 0:return 1;case 2:case 3:return 2;case 1:return 0;default:return j()}};return A(E)-A(R)}(d.type,p.type)||this.Aa(d.doc,p.doc)),this.pa(s),i=i!=null&&i;const l=t&&!i?this.ya():[],c=this.da.size===0&&this.current&&!i?1:0,h=c!==this.Ea;return this.Ea=c,o.length!==0||h?{snapshot:new Ws(this.query,e.Ra,r,o,e.mutatedKeys,c===0,h,!1,!!s&&s.resumeToken.approximateByteSize()>0),wa:l}:{wa:l}}Z_(e){return this.current&&e==="Offline"?(this.current=!1,this.applyChanges({Ra:this.Ra,fa:new pf,mutatedKeys:this.mutatedKeys,ns:!1},!1)):{wa:[]}}Sa(e){return!this.Ta.has(e)&&!!this.Ra.has(e)&&!this.Ra.get(e).hasLocalMutations}pa(e){e&&(e.addedDocuments.forEach(t=>this.Ta=this.Ta.add(t)),e.modifiedDocuments.forEach(t=>{}),e.removedDocuments.forEach(t=>this.Ta=this.Ta.delete(t)),this.current=e.current)}ya(){if(!this.current)return[];const e=this.da;this.da=ne(),this.Ra.forEach(s=>{this.Sa(s.key)&&(this.da=this.da.add(s.key))});const t=[];return e.forEach(s=>{this.da.has(s)||t.push(new wg(s))}),this.da.forEach(s=>{e.has(s)||t.push(new Eg(s))}),t}ba(e){this.Ta=e.Ts,this.da=ne();const t=this.ma(e.documents);return this.applyChanges(t,!0)}Da(){return Ws.fromInitialDocuments(this.query,this.Ra,this.mutatedKeys,this.Ea===0,this.hasCachedResults)}}class W0{constructor(e,t,s){this.query=e,this.targetId=t,this.view=s}}class $0{constructor(e){this.key=e,this.va=!1}}class j0{constructor(e,t,s,i,r,o){this.localStore=e,this.remoteStore=t,this.eventManager=s,this.sharedClientState=i,this.currentUser=r,this.maxConcurrentLimboResolutions=o,this.Ca={},this.Fa=new ei(l=>Vm(l),ma),this.Ma=new Map,this.xa=new Set,this.Oa=new ke(W.comparator),this.Na=new Map,this.La=new nh,this.Ba={},this.ka=new Map,this.qa=qs.kn(),this.onlineState="Unknown",this.Qa=void 0}get isPrimaryClient(){return this.Qa===!0}}async function G0(n,e,t=!0){const s=Sg(n);let i;const r=s.Fa.get(e);return r?(s.sharedClientState.addLocalQueryTarget(r.targetId),i=r.view.Da()):i=await Tg(s,e,t,!0),i}async function z0(n,e){const t=Sg(n);await Tg(t,e,!0,!1)}async function Tg(n,e,t,s){const i=await p0(n.localStore,xt(e)),r=i.targetId,o=n.sharedClientState.addLocalQueryTarget(r,t);let l;return s&&(l=await H0(n,e,r,o==="current",i.resumeToken)),n.isPrimaryClient&&t&&ug(n.remoteStore,i),l}async function H0(n,e,t,s,i){n.Ka=(p,m,E)=>async function(A,P,V,U){let q=P.view.ma(V);q.ns&&(q=await hf(A.localStore,P.query,!1).then(({documents:I})=>P.view.ma(I,q)));const J=U&&U.targetChanges.get(P.targetId),ye=U&&U.targetMismatches.get(P.targetId)!=null,ue=P.view.applyChanges(q,A.isPrimaryClient,J,ye);return yf(A,P.targetId,ue.wa),ue.snapshot}(n,p,m,E);const r=await hf(n.localStore,e,!0),o=new q0(e,r.Ts),l=o.ma(r.documents),c=wr.createSynthesizedTargetChangeForCurrentChange(t,s&&n.onlineState!=="Offline",i),h=o.applyChanges(l,n.isPrimaryClient,c);yf(n,t,h.wa);const d=new W0(e,t,o);return n.Fa.set(e,d),n.Ma.has(t)?n.Ma.get(t).push(e):n.Ma.set(t,[e]),h.snapshot}async function K0(n,e,t){const s=Q(n),i=s.Fa.get(e),r=s.Ma.get(i.targetId);if(r.length>1)return s.Ma.set(i.targetId,r.filter(o=>!ma(o,e))),void s.Fa.delete(e);s.isPrimaryClient?(s.sharedClientState.removeLocalQueryTarget(i.targetId),s.sharedClientState.isActiveQueryTarget(i.targetId)||await sc(s.localStore,i.targetId,!1).then(()=>{s.sharedClientState.clearQueryState(i.targetId),t&&oh(s.remoteStore,i.targetId),rc(s,i.targetId)}).catch(_r)):(rc(s,i.targetId),await sc(s.localStore,i.targetId,!0))}async function Q0(n,e){const t=Q(n),s=t.Fa.get(e),i=t.Ma.get(s.targetId);t.isPrimaryClient&&i.length===1&&(t.sharedClientState.removeLocalQueryTarget(s.targetId),oh(t.remoteStore,s.targetId))}async function Y0(n,e,t){const s=sb(n);try{const i=await function(o,l){const c=Q(o),h=Le.now(),d=l.reduce((E,R)=>E.add(R.key),ne());let p,m;return c.persistence.runTransaction("Locally write mutations","readwrite",E=>{let R=sn(),A=ne();return c.cs.getEntries(E,d).next(P=>{R=P,R.forEach((V,U)=>{U.isValidDocument()||(A=A.add(V))})}).next(()=>c.localDocuments.getOverlayedDocuments(E,R)).next(P=>{p=P;const V=[];for(const U of l){const q=EI(U,p.get(U.key).overlayedDocument);q!=null&&V.push(new Fn(U.key,q,km(q.value.mapValue),it.exists(!0)))}return c.mutationQueue.addMutationBatch(E,h,V,l)}).next(P=>{m=P;const V=P.applyToLocalDocumentSet(p,A);return c.documentOverlayCache.saveOverlays(E,P.batchId,V)})}).then(()=>({batchId:m.batchId,changes:Um(p)}))}(s.localStore,e);s.sharedClientState.addPendingMutation(i.batchId),function(o,l,c){let h=o.Ba[o.currentUser.toKey()];h||(h=new ke(ae)),h=h.insert(l,c),o.Ba[o.currentUser.toKey()]=h}(s,i.batchId,t),await Ir(s,i.changes),await Ta(s.remoteStore)}catch(i){const r=uh(i,"Failed to persist write");t.reject(r)}}async function Ig(n,e){const t=Q(n);try{const s=await u0(t.localStore,e);e.targetChanges.forEach((i,r)=>{const o=t.Na.get(r);o&&(re(i.addedDocuments.size+i.modifiedDocuments.size+i.removedDocuments.size<=1),i.addedDocuments.size>0?o.va=!0:i.modifiedDocuments.size>0?re(o.va):i.removedDocuments.size>0&&(re(o.va),o.va=!1))}),await Ir(t,s,e)}catch(s){await _r(s)}}function _f(n,e,t){const s=Q(n);if(s.isPrimaryClient&&t===0||!s.isPrimaryClient&&t===1){const i=[];s.Fa.forEach((r,o)=>{const l=o.view.Z_(e);l.snapshot&&i.push(l.snapshot)}),function(o,l){const c=Q(o);c.onlineState=l;let h=!1;c.queries.forEach((d,p)=>{for(const m of p.j_)m.Z_(l)&&(h=!0)}),h&&dh(c)}(s.eventManager,e),i.length&&s.Ca.d_(i),s.onlineState=e,s.isPrimaryClient&&s.sharedClientState.setOnlineState(e)}}async function J0(n,e,t){const s=Q(n);s.sharedClientState.updateQueryState(e,"rejected",t);const i=s.Na.get(e),r=i&&i.key;if(r){let o=new ke(W.comparator);o=o.insert(r,Fe.newNoDocument(r,H.min()));const l=ne().add(r),c=new va(H.min(),new Map,new ke(ae),o,l);await Ig(s,c),s.Oa=s.Oa.remove(r),s.Na.delete(e),fh(s)}else await sc(s.localStore,e,!1).then(()=>rc(s,e,t)).catch(_r)}async function X0(n,e){const t=Q(n),s=e.batch.batchId;try{const i=await h0(t.localStore,e);Cg(t,s,null),bg(t,s),t.sharedClientState.updateMutationState(s,"acknowledged"),await Ir(t,i)}catch(i){await _r(i)}}async function Z0(n,e,t){const s=Q(n);try{const i=await function(o,l){const c=Q(o);return c.persistence.runTransaction("Reject batch","readwrite-primary",h=>{let d;return c.mutationQueue.lookupMutationBatch(h,l).next(p=>(re(p!==null),d=p.keys(),c.mutationQueue.removeMutationBatch(h,p))).next(()=>c.mutationQueue.performConsistencyCheck(h)).next(()=>c.documentOverlayCache.removeOverlaysForBatchId(h,d,l)).next(()=>c.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(h,d)).next(()=>c.localDocuments.getDocuments(h,d))})}(s.localStore,e);Cg(s,e,t),bg(s,e),s.sharedClientState.updateMutationState(e,"rejected",t),await Ir(s,i)}catch(i){await _r(i)}}function bg(n,e){(n.ka.get(e)||[]).forEach(t=>{t.resolve()}),n.ka.delete(e)}function Cg(n,e,t){const s=Q(n);let i=s.Ba[s.currentUser.toKey()];if(i){const r=i.get(e);r&&(t?r.reject(t):r.resolve(),i=i.remove(e)),s.Ba[s.currentUser.toKey()]=i}}function rc(n,e,t=null){n.sharedClientState.removeLocalQueryTarget(e);for(const s of n.Ma.get(e))n.Fa.delete(s),t&&n.Ca.$a(s,t);n.Ma.delete(e),n.isPrimaryClient&&n.La.gr(e).forEach(s=>{n.La.containsKey(s)||Rg(n,s)})}function Rg(n,e){n.xa.delete(e.path.canonicalString());const t=n.Oa.get(e);t!==null&&(oh(n.remoteStore,t),n.Oa=n.Oa.remove(e),n.Na.delete(t),fh(n))}function yf(n,e,t){for(const s of t)s instanceof Eg?(n.La.addReference(s.key,e),eb(n,s)):s instanceof wg?(B("SyncEngine","Document no longer in limbo: "+s.key),n.La.removeReference(s.key,e),n.La.containsKey(s.key)||Rg(n,s.key)):j()}function eb(n,e){const t=e.key,s=t.path.canonicalString();n.Oa.get(t)||n.xa.has(s)||(B("SyncEngine","New document in limbo: "+t),n.xa.add(s),fh(n))}function fh(n){for(;n.xa.size>0&&n.Oa.size<n.maxConcurrentLimboResolutions;){const e=n.xa.values().next().value;n.xa.delete(e);const t=new W(pe.fromString(e)),s=n.qa.next();n.Na.set(s,new $0(t)),n.Oa=n.Oa.insert(t,s),ug(n.remoteStore,new En(xt(Yc(t.path)),s,"TargetPurposeLimboResolution",jc.oe))}}async function Ir(n,e,t){const s=Q(n),i=[],r=[],o=[];s.Fa.isEmpty()||(s.Fa.forEach((l,c)=>{o.push(s.Ka(c,e,t).then(h=>{var d;if((h||t)&&s.isPrimaryClient){const p=h?!h.fromCache:(d=t==null?void 0:t.targetChanges.get(c.targetId))===null||d===void 0?void 0:d.current;s.sharedClientState.updateQueryState(c.targetId,p?"current":"not-current")}if(h){i.push(h);const p=ih.Wi(c.targetId,h);r.push(p)}}))}),await Promise.all(o),s.Ca.d_(i),await async function(c,h){const d=Q(c);try{await d.persistence.runTransaction("notifyLocalViewChanges","readwrite",p=>N.forEach(h,m=>N.forEach(m.$i,E=>d.persistence.referenceDelegate.addReference(p,m.targetId,E)).next(()=>N.forEach(m.Ui,E=>d.persistence.referenceDelegate.removeReference(p,m.targetId,E)))))}catch(p){if(!yr(p))throw p;B("LocalStore","Failed to update sequence numbers: "+p)}for(const p of h){const m=p.targetId;if(!p.fromCache){const E=d.os.get(m),R=E.snapshotVersion,A=E.withLastLimboFreeSnapshotVersion(R);d.os=d.os.insert(m,A)}}}(s.localStore,r))}async function tb(n,e){const t=Q(n);if(!t.currentUser.isEqual(e)){B("SyncEngine","User change. New user:",e.toKey());const s=await lg(t.localStore,e);t.currentUser=e,function(r,o){r.ka.forEach(l=>{l.forEach(c=>{c.reject(new M(k.CANCELLED,o))})}),r.ka.clear()}(t,"'waitForPendingWrites' promise is rejected due to a user change."),t.sharedClientState.handleUserChange(e,s.removedBatchIds,s.addedBatchIds),await Ir(t,s.hs)}}function nb(n,e){const t=Q(n),s=t.Na.get(e);if(s&&s.va)return ne().add(s.key);{let i=ne();const r=t.Ma.get(e);if(!r)return i;for(const o of r){const l=t.Fa.get(o);i=i.unionWith(l.view.Va)}return i}}function Sg(n){const e=Q(n);return e.remoteStore.remoteSyncer.applyRemoteEvent=Ig.bind(null,e),e.remoteStore.remoteSyncer.getRemoteKeysForTarget=nb.bind(null,e),e.remoteStore.remoteSyncer.rejectListen=J0.bind(null,e),e.Ca.d_=B0.bind(null,e.eventManager),e.Ca.$a=U0.bind(null,e.eventManager),e}function sb(n){const e=Q(n);return e.remoteStore.remoteSyncer.applySuccessfulWrite=X0.bind(null,e),e.remoteStore.remoteSyncer.rejectFailedWrite=Z0.bind(null,e),e}class jo{constructor(){this.kind="memory",this.synchronizeTabs=!1}async initialize(e){this.serializer=Ea(e.databaseInfo.databaseId),this.sharedClientState=this.Wa(e),this.persistence=this.Ga(e),await this.persistence.start(),this.localStore=this.za(e),this.gcScheduler=this.ja(e,this.localStore),this.indexBackfillerScheduler=this.Ha(e,this.localStore)}ja(e,t){return null}Ha(e,t){return null}za(e){return c0(this.persistence,new a0,e.initialUser,this.serializer)}Ga(e){return new i0(sh.Zr,this.serializer)}Wa(e){return new g0}async terminate(){var e,t;(e=this.gcScheduler)===null||e===void 0||e.stop(),(t=this.indexBackfillerScheduler)===null||t===void 0||t.stop(),this.sharedClientState.shutdown(),await this.persistence.shutdown()}}jo.provider={build:()=>new jo};class oc{async initialize(e,t){this.localStore||(this.localStore=e.localStore,this.sharedClientState=e.sharedClientState,this.datastore=this.createDatastore(t),this.remoteStore=this.createRemoteStore(t),this.eventManager=this.createEventManager(t),this.syncEngine=this.createSyncEngine(t,!e.synchronizeTabs),this.sharedClientState.onlineStateHandler=s=>_f(this.syncEngine,s,1),this.remoteStore.remoteSyncer.handleCredentialChange=tb.bind(null,this.syncEngine),await M0(this.remoteStore,this.syncEngine.isPrimaryClient))}createEventManager(e){return function(){return new F0}()}createDatastore(e){const t=Ea(e.databaseInfo.databaseId),s=function(r){return new E0(r)}(e.databaseInfo);return function(r,o,l,c){return new I0(r,o,l,c)}(e.authCredentials,e.appCheckCredentials,s,t)}createRemoteStore(e){return function(s,i,r,o,l){return new C0(s,i,r,o,l)}(this.localStore,this.datastore,e.asyncQueue,t=>_f(this.syncEngine,t,0),function(){return df.D()?new df:new _0}())}createSyncEngine(e,t){return function(i,r,o,l,c,h,d){const p=new j0(i,r,o,l,c,h);return d&&(p.Qa=!0),p}(this.localStore,this.remoteStore,this.eventManager,this.sharedClientState,e.initialUser,e.maxConcurrentLimboResolutions,t)}async terminate(){var e,t;await async function(i){const r=Q(i);B("RemoteStore","RemoteStore shutting down."),r.L_.add(5),await Tr(r),r.k_.shutdown(),r.q_.set("Unknown")}(this.remoteStore),(e=this.datastore)===null||e===void 0||e.terminate(),(t=this.eventManager)===null||t===void 0||t.terminate()}}oc.provider={build:()=>new oc};/**
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
 */class Ag{constructor(e){this.observer=e,this.muted=!1}next(e){this.muted||this.observer.next&&this.Ya(this.observer.next,e)}error(e){this.muted||(this.observer.error?this.Ya(this.observer.error,e):nn("Uncaught Error in snapshot listener:",e.toString()))}Za(){this.muted=!0}Ya(e,t){setTimeout(()=>{this.muted||e(t)},0)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ib{constructor(e){this.datastore=e,this.readVersions=new Map,this.mutations=[],this.committed=!1,this.lastTransactionError=null,this.writtenDocs=new Set}async lookup(e){if(this.ensureCommitNotCalled(),this.mutations.length>0)throw this.lastTransactionError=new M(k.INVALID_ARGUMENT,"Firestore transactions require all reads to be executed before all writes."),this.lastTransactionError;const t=await async function(i,r){const o=Q(i),l={documents:r.map(p=>Wo(o.serializer,p))},c=await o.Lo("BatchGetDocuments",o.serializer.databaseId,pe.emptyPath(),l,r.length),h=new Map;c.forEach(p=>{const m=LI(o.serializer,p);h.set(m.key.toString(),m)});const d=[];return r.forEach(p=>{const m=h.get(p.toString());re(!!m),d.push(m)}),d}(this.datastore,e);return t.forEach(s=>this.recordVersion(s)),t}set(e,t){this.write(t.toMutation(e,this.precondition(e))),this.writtenDocs.add(e.toString())}update(e,t){try{this.write(t.toMutation(e,this.preconditionForUpdate(e)))}catch(s){this.lastTransactionError=s}this.writtenDocs.add(e.toString())}delete(e){this.write(new Xc(e,this.precondition(e))),this.writtenDocs.add(e.toString())}async commit(){if(this.ensureCommitNotCalled(),this.lastTransactionError)throw this.lastTransactionError;const e=this.readVersions;this.mutations.forEach(t=>{e.delete(t.key.toString())}),e.forEach((t,s)=>{const i=W.fromPath(s);this.mutations.push(new Qm(i,this.precondition(i)))}),await async function(s,i){const r=Q(s),o={writes:i.map(l=>ig(r.serializer,l))};await r.Mo("Commit",r.serializer.databaseId,pe.emptyPath(),o)}(this.datastore,this.mutations),this.committed=!0}recordVersion(e){let t;if(e.isFoundDocument())t=e.version;else{if(!e.isNoDocument())throw j();t=H.min()}const s=this.readVersions.get(e.key.toString());if(s){if(!t.isEqual(s))throw new M(k.ABORTED,"Document version changed between two reads.")}else this.readVersions.set(e.key.toString(),t)}precondition(e){const t=this.readVersions.get(e.toString());return!this.writtenDocs.has(e.toString())&&t?t.isEqual(H.min())?it.exists(!1):it.updateTime(t):it.none()}preconditionForUpdate(e){const t=this.readVersions.get(e.toString());if(!this.writtenDocs.has(e.toString())&&t){if(t.isEqual(H.min()))throw new M(k.INVALID_ARGUMENT,"Can't update a document that doesn't exist.");return it.updateTime(t)}return it.exists(!0)}write(e){this.ensureCommitNotCalled(),this.mutations.push(e)}ensureCommitNotCalled(){}}/**
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
 */class rb{constructor(e,t,s,i,r){this.asyncQueue=e,this.datastore=t,this.options=s,this.updateFunction=i,this.deferred=r,this._u=s.maxAttempts,this.t_=new rh(this.asyncQueue,"transaction_retry")}au(){this._u-=1,this.uu()}uu(){this.t_.Go(async()=>{const e=new ib(this.datastore),t=this.cu(e);t&&t.then(s=>{this.asyncQueue.enqueueAndForget(()=>e.commit().then(()=>{this.deferred.resolve(s)}).catch(i=>{this.lu(i)}))}).catch(s=>{this.lu(s)})})}cu(e){try{const t=this.updateFunction(e);return!vr(t)&&t.catch&&t.then?t:(this.deferred.reject(Error("Transaction callback must return a Promise")),null)}catch(t){return this.deferred.reject(t),null}}lu(e){this._u>0&&this.hu(e)?(this._u-=1,this.asyncQueue.enqueueAndForget(()=>(this.uu(),Promise.resolve()))):this.deferred.reject(e)}hu(e){if(e.name==="FirebaseError"){const t=e.code;return t==="aborted"||t==="failed-precondition"||t==="already-exists"||!Ym(t)}return!1}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ob{constructor(e,t,s,i,r){this.authCredentials=e,this.appCheckCredentials=t,this.asyncQueue=s,this.databaseInfo=i,this.user=Ye.UNAUTHENTICATED,this.clientId=Rm.newId(),this.authCredentialListener=()=>Promise.resolve(),this.appCheckCredentialListener=()=>Promise.resolve(),this._uninitializedComponentsProvider=r,this.authCredentials.start(s,async o=>{B("FirestoreClient","Received user=",o.uid),await this.authCredentialListener(o),this.user=o}),this.appCheckCredentials.start(s,o=>(B("FirestoreClient","Received new app check token=",o),this.appCheckCredentialListener(o,this.user)))}get configuration(){return{asyncQueue:this.asyncQueue,databaseInfo:this.databaseInfo,clientId:this.clientId,authCredentials:this.authCredentials,appCheckCredentials:this.appCheckCredentials,initialUser:this.user,maxConcurrentLimboResolutions:100}}setCredentialChangeListener(e){this.authCredentialListener=e}setAppCheckTokenChangeListener(e){this.appCheckCredentialListener=e}terminate(){this.asyncQueue.enterRestrictedMode();const e=new Lt;return this.asyncQueue.enqueueAndForgetEvenWhileRestricted(async()=>{try{this._onlineComponents&&await this._onlineComponents.terminate(),this._offlineComponents&&await this._offlineComponents.terminate(),this.authCredentials.shutdown(),this.appCheckCredentials.shutdown(),e.resolve()}catch(t){const s=uh(t,"Failed to shutdown persistence");e.reject(s)}}),e.promise}}async function ml(n,e){n.asyncQueue.verifyOperationInProgress(),B("FirestoreClient","Initializing OfflineComponentProvider");const t=n.configuration;await e.initialize(t);let s=t.initialUser;n.setCredentialChangeListener(async i=>{s.isEqual(i)||(await lg(e.localStore,i),s=i)}),e.persistence.setDatabaseDeletedListener(()=>n.terminate()),n._offlineComponents=e}async function vf(n,e){n.asyncQueue.verifyOperationInProgress();const t=await ab(n);B("FirestoreClient","Initializing OnlineComponentProvider"),await e.initialize(t,n.configuration),n.setCredentialChangeListener(s=>ff(e.remoteStore,s)),n.setAppCheckTokenChangeListener((s,i)=>ff(e.remoteStore,i)),n._onlineComponents=e}async function ab(n){if(!n._offlineComponents)if(n._uninitializedComponentsProvider){B("FirestoreClient","Using user provided OfflineComponentProvider");try{await ml(n,n._uninitializedComponentsProvider._offline)}catch(e){const t=e;if(!function(i){return i.name==="FirebaseError"?i.code===k.FAILED_PRECONDITION||i.code===k.UNIMPLEMENTED:!(typeof DOMException<"u"&&i instanceof DOMException)||i.code===22||i.code===20||i.code===11}(t))throw t;Vs("Error using user provided cache. Falling back to memory cache: "+t),await ml(n,new jo)}}else B("FirestoreClient","Using default OfflineComponentProvider"),await ml(n,new jo);return n._offlineComponents}async function ph(n){return n._onlineComponents||(n._uninitializedComponentsProvider?(B("FirestoreClient","Using user provided OnlineComponentProvider"),await vf(n,n._uninitializedComponentsProvider._online)):(B("FirestoreClient","Using default OnlineComponentProvider"),await vf(n,new oc))),n._onlineComponents}function lb(n){return ph(n).then(e=>e.syncEngine)}function cb(n){return ph(n).then(e=>e.datastore)}async function kg(n){const e=await ph(n),t=e.eventManager;return t.onListen=G0.bind(null,e.syncEngine),t.onUnlisten=K0.bind(null,e.syncEngine),t.onFirstRemoteStoreListen=z0.bind(null,e.syncEngine),t.onLastRemoteStoreUnlisten=Q0.bind(null,e.syncEngine),t}function hb(n,e,t={}){const s=new Lt;return n.asyncQueue.enqueueAndForget(async()=>function(r,o,l,c,h){const d=new Ag({next:m=>{d.Za(),o.enqueueAndForget(()=>yg(r,p));const E=m.docs.has(l);!E&&m.fromCache?h.reject(new M(k.UNAVAILABLE,"Failed to get document because the client is offline.")):E&&m.fromCache&&c&&c.source==="server"?h.reject(new M(k.UNAVAILABLE,'Failed to get document from server. (However, this document does exist in the local cache. Run again without setting source to "server" to retrieve the cached document.)')):h.resolve(m)},error:m=>h.reject(m)}),p=new vg(Yc(l.path),d,{includeMetadataChanges:!0,_a:!0});return _g(r,p)}(await kg(n),n.asyncQueue,e,t,s)),s.promise}function ub(n,e,t={}){const s=new Lt;return n.asyncQueue.enqueueAndForget(async()=>function(r,o,l,c,h){const d=new Ag({next:m=>{d.Za(),o.enqueueAndForget(()=>yg(r,p)),m.fromCache&&c.source==="server"?h.reject(new M(k.UNAVAILABLE,'Failed to get documents from server. (However, these documents may exist in the local cache. Run again without setting source to "server" to retrieve the cached documents.)')):h.resolve(m)},error:m=>h.reject(m)}),p=new vg(l,d,{includeMetadataChanges:!0,_a:!0});return _g(r,p)}(await kg(n),n.asyncQueue,e,t,s)),s.promise}/**
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
 */function Pg(n){const e={};return n.timeoutSeconds!==void 0&&(e.timeoutSeconds=n.timeoutSeconds),e}/**
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
 */const Ef=new Map;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ng(n,e,t){if(!t)throw new M(k.INVALID_ARGUMENT,`Function ${n}() cannot be called with an empty ${e}.`)}function db(n,e,t,s){if(e===!0&&s===!0)throw new M(k.INVALID_ARGUMENT,`${n} and ${t} cannot be used together.`)}function wf(n){if(!W.isDocumentKey(n))throw new M(k.INVALID_ARGUMENT,`Invalid document reference. Document references must have an even number of segments, but ${n} has ${n.length}.`)}function Tf(n){if(W.isDocumentKey(n))throw new M(k.INVALID_ARGUMENT,`Invalid collection reference. Collection references must have an odd number of segments, but ${n} has ${n.length}.`)}function Ia(n){if(n===void 0)return"undefined";if(n===null)return"null";if(typeof n=="string")return n.length>20&&(n=`${n.substring(0,20)}...`),JSON.stringify(n);if(typeof n=="number"||typeof n=="boolean")return""+n;if(typeof n=="object"){if(n instanceof Array)return"an array";{const e=function(s){return s.constructor?s.constructor.name:null}(n);return e?`a custom ${e} object`:"an object"}}return typeof n=="function"?"a function":j()}function Vt(n,e){if("_delegate"in n&&(n=n._delegate),!(n instanceof e)){if(e.name===n.constructor.name)throw new M(k.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{const t=Ia(n);throw new M(k.INVALID_ARGUMENT,`Expected type '${e.name}', but it was: ${t}`)}}return n}function fb(n,e){if(e<=0)throw new M(k.INVALID_ARGUMENT,`Function ${n}() requires a positive number, but it was: ${e}.`)}/**
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
 */class If{constructor(e){var t,s;if(e.host===void 0){if(e.ssl!==void 0)throw new M(k.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host="firestore.googleapis.com",this.ssl=!0}else this.host=e.host,this.ssl=(t=e.ssl)===null||t===void 0||t;if(this.credentials=e.credentials,this.ignoreUndefinedProperties=!!e.ignoreUndefinedProperties,this.localCache=e.localCache,e.cacheSizeBytes===void 0)this.cacheSizeBytes=41943040;else{if(e.cacheSizeBytes!==-1&&e.cacheSizeBytes<1048576)throw new M(k.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=e.cacheSizeBytes}db("experimentalForceLongPolling",e.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",e.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!e.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:e.experimentalAutoDetectLongPolling===void 0?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!e.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=Pg((s=e.experimentalLongPollingOptions)!==null&&s!==void 0?s:{}),function(r){if(r.timeoutSeconds!==void 0){if(isNaN(r.timeoutSeconds))throw new M(k.INVALID_ARGUMENT,`invalid long polling timeout: ${r.timeoutSeconds} (must not be NaN)`);if(r.timeoutSeconds<5)throw new M(k.INVALID_ARGUMENT,`invalid long polling timeout: ${r.timeoutSeconds} (minimum allowed value is 5)`);if(r.timeoutSeconds>30)throw new M(k.INVALID_ARGUMENT,`invalid long polling timeout: ${r.timeoutSeconds} (maximum allowed value is 30)`)}}(this.experimentalLongPollingOptions),this.useFetchStreams=!!e.useFetchStreams}isEqual(e){return this.host===e.host&&this.ssl===e.ssl&&this.credentials===e.credentials&&this.cacheSizeBytes===e.cacheSizeBytes&&this.experimentalForceLongPolling===e.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===e.experimentalAutoDetectLongPolling&&function(s,i){return s.timeoutSeconds===i.timeoutSeconds}(this.experimentalLongPollingOptions,e.experimentalLongPollingOptions)&&this.ignoreUndefinedProperties===e.ignoreUndefinedProperties&&this.useFetchStreams===e.useFetchStreams}}class ba{constructor(e,t,s,i){this._authCredentials=e,this._appCheckCredentials=t,this._databaseId=s,this._app=i,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new If({}),this._settingsFrozen=!1,this._terminateTask="notTerminated"}get app(){if(!this._app)throw new M(k.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return this._terminateTask!=="notTerminated"}_setSettings(e){if(this._settingsFrozen)throw new M(k.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new If(e),e.credentials!==void 0&&(this._authCredentials=function(s){if(!s)return new kT;switch(s.type){case"firstParty":return new LT(s.sessionIndex||"0",s.iamToken||null,s.authTokenFactory||null);case"provider":return s.client;default:throw new M(k.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}}(e.credentials))}_getSettings(){return this._settings}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask==="notTerminated"&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){this._terminateTask==="notTerminated"?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return function(t){const s=Ef.get(t);s&&(B("ComponentProvider","Removing Datastore"),Ef.delete(t),s.terminate())}(this),Promise.resolve()}}function pb(n,e,t,s={}){var i;const r=(n=Vt(n,ba))._getSettings(),o=`${e}:${t}`;if(r.host!=="firestore.googleapis.com"&&r.host!==o&&Vs("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used."),n._setSettings(Object.assign(Object.assign({},r),{host:o,ssl:!1})),s.mockUserToken){let l,c;if(typeof s.mockUserToken=="string")l=s.mockUserToken,c=Ye.MOCK_USER;else{l=xp(s.mockUserToken,(i=n._app)===null||i===void 0?void 0:i.options.projectId);const h=s.mockUserToken.sub||s.mockUserToken.user_id;if(!h)throw new M(k.INVALID_ARGUMENT,"mockUserToken must contain 'sub' or 'user_id' field!");c=new Ye(h)}n._authCredentials=new PT(new Cm(l,c))}}/**
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
 */class Bn{constructor(e,t,s){this.converter=t,this._query=s,this.type="query",this.firestore=e}withConverter(e){return new Bn(this.firestore,e,this._query)}}class Xe{constructor(e,t,s){this.converter=t,this._key=s,this.type="document",this.firestore=e}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new Rn(this.firestore,this.converter,this._key.path.popLast())}withConverter(e){return new Xe(this.firestore,e,this._key)}}class Rn extends Bn{constructor(e,t,s){super(e,t,Yc(s)),this._path=s,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){const e=this._path.popLast();return e.isEmpty()?null:new Xe(this.firestore,null,new W(e))}withConverter(e){return new Rn(this.firestore,e,this._path)}}function Ti(n,e,...t){if(n=me(n),Ng("collection","path",e),n instanceof ba){const s=pe.fromString(e,...t);return Tf(s),new Rn(n,null,s)}{if(!(n instanceof Xe||n instanceof Rn))throw new M(k.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const s=n._path.child(pe.fromString(e,...t));return Tf(s),new Rn(n.firestore,null,s)}}function jt(n,e,...t){if(n=me(n),arguments.length===1&&(e=Rm.newId()),Ng("doc","path",e),n instanceof ba){const s=pe.fromString(e,...t);return wf(s),new Xe(n,null,new W(s))}{if(!(n instanceof Xe||n instanceof Rn))throw new M(k.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const s=n._path.child(pe.fromString(e,...t));return wf(s),new Xe(n.firestore,n instanceof Rn?n.converter:null,new W(s))}}/**
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
 */class bf{constructor(e=Promise.resolve()){this.Pu=[],this.Iu=!1,this.Tu=[],this.Eu=null,this.du=!1,this.Au=!1,this.Ru=[],this.t_=new rh(this,"async_queue_retry"),this.Vu=()=>{const s=pl();s&&B("AsyncQueue","Visibility state changed to "+s.visibilityState),this.t_.jo()},this.mu=e;const t=pl();t&&typeof t.addEventListener=="function"&&t.addEventListener("visibilitychange",this.Vu)}get isShuttingDown(){return this.Iu}enqueueAndForget(e){this.enqueue(e)}enqueueAndForgetEvenWhileRestricted(e){this.fu(),this.gu(e)}enterRestrictedMode(e){if(!this.Iu){this.Iu=!0,this.Au=e||!1;const t=pl();t&&typeof t.removeEventListener=="function"&&t.removeEventListener("visibilitychange",this.Vu)}}enqueue(e){if(this.fu(),this.Iu)return new Promise(()=>{});const t=new Lt;return this.gu(()=>this.Iu&&this.Au?Promise.resolve():(e().then(t.resolve,t.reject),t.promise)).then(()=>t.promise)}enqueueRetryable(e){this.enqueueAndForget(()=>(this.Pu.push(e),this.pu()))}async pu(){if(this.Pu.length!==0){try{await this.Pu[0](),this.Pu.shift(),this.t_.reset()}catch(e){if(!yr(e))throw e;B("AsyncQueue","Operation failed with retryable error: "+e)}this.Pu.length>0&&this.t_.Go(()=>this.pu())}}gu(e){const t=this.mu.then(()=>(this.du=!0,e().catch(s=>{this.Eu=s,this.du=!1;const i=function(o){let l=o.message||"";return o.stack&&(l=o.stack.includes(o.message)?o.stack:o.message+`
`+o.stack),l}(s);throw nn("INTERNAL UNHANDLED ERROR: ",i),s}).then(s=>(this.du=!1,s))));return this.mu=t,t}enqueueAfterDelay(e,t,s){this.fu(),this.Ru.indexOf(e)>-1&&(t=0);const i=hh.createAndSchedule(this,e,t,s,r=>this.yu(r));return this.Tu.push(i),i}fu(){this.Eu&&j()}verifyOperationInProgress(){}async wu(){let e;do e=this.mu,await e;while(e!==this.mu)}Su(e){for(const t of this.Tu)if(t.timerId===e)return!0;return!1}bu(e){return this.wu().then(()=>{this.Tu.sort((t,s)=>t.targetTimeMs-s.targetTimeMs);for(const t of this.Tu)if(t.skipDelay(),e!=="all"&&t.timerId===e)break;return this.wu()})}Du(e){this.Ru.push(e)}yu(e){const t=this.Tu.indexOf(e);this.Tu.splice(t,1)}}class ni extends ba{constructor(e,t,s,i){super(e,t,s,i),this.type="firestore",this._queue=new bf,this._persistenceKey=(i==null?void 0:i.name)||"[DEFAULT]"}async _terminate(){if(this._firestoreClient){const e=this._firestoreClient.terminate();this._queue=new bf(e),this._firestoreClient=void 0,await e}}}function mb(n,e){const t=typeof n=="object"?n:Nc(),s=typeof n=="string"?n:"(default)",i=ua(t,"firestore").getImmediate({identifier:s});if(!i._initialized){const r=Np("firestore");r&&pb(i,...r)}return i}function Ca(n){if(n._terminated)throw new M(k.FAILED_PRECONDITION,"The client has already been terminated.");return n._firestoreClient||gb(n),n._firestoreClient}function gb(n){var e,t,s;const i=n._freezeSettings(),r=function(l,c,h,d){return new zT(l,c,h,d.host,d.ssl,d.experimentalForceLongPolling,d.experimentalAutoDetectLongPolling,Pg(d.experimentalLongPollingOptions),d.useFetchStreams)}(n._databaseId,((e=n._app)===null||e===void 0?void 0:e.options.appId)||"",n._persistenceKey,i);n._componentsProvider||!((t=i.localCache)===null||t===void 0)&&t._offlineComponentProvider&&(!((s=i.localCache)===null||s===void 0)&&s._onlineComponentProvider)&&(n._componentsProvider={_offline:i.localCache._offlineComponentProvider,_online:i.localCache._onlineComponentProvider}),n._firestoreClient=new ob(n._authCredentials,n._appCheckCredentials,n._queue,r,n._componentsProvider&&function(l){const c=l==null?void 0:l._online.build();return{_offline:l==null?void 0:l._offline.build(c),_online:c}}(n._componentsProvider))}/**
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
 */class ss{constructor(e){this._byteString=e}static fromBase64String(e){try{return new ss(je.fromBase64String(e))}catch(t){throw new M(k.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+t)}}static fromUint8Array(e){return new ss(je.fromUint8Array(e))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(e){return this._byteString.isEqual(e._byteString)}}/**
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
 */class br{constructor(...e){for(let t=0;t<e.length;++t)if(e[t].length===0)throw new M(k.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new We(e)}isEqual(e){return this._internalPath.isEqual(e._internalPath)}}/**
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
 */class mh{constructor(e){this._methodName=e}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gh{constructor(e,t){if(!isFinite(e)||e<-90||e>90)throw new M(k.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+e);if(!isFinite(t)||t<-180||t>180)throw new M(k.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+t);this._lat=e,this._long=t}get latitude(){return this._lat}get longitude(){return this._long}isEqual(e){return this._lat===e._lat&&this._long===e._long}toJSON(){return{latitude:this._lat,longitude:this._long}}_compareTo(e){return ae(this._lat,e._lat)||ae(this._long,e._long)}}/**
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
 */class _h{constructor(e){this._values=(e||[]).map(t=>t)}toArray(){return this._values.map(e=>e)}isEqual(e){return function(s,i){if(s.length!==i.length)return!1;for(let r=0;r<s.length;++r)if(s[r]!==i[r])return!1;return!0}(this._values,e._values)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const _b=/^__.*__$/;class yb{constructor(e,t,s){this.data=e,this.fieldMask=t,this.fieldTransforms=s}toMutation(e,t){return this.fieldMask!==null?new Fn(e,this.data,this.fieldMask,t,this.fieldTransforms):new Er(e,this.data,t,this.fieldTransforms)}}class Dg{constructor(e,t,s){this.data=e,this.fieldMask=t,this.fieldTransforms=s}toMutation(e,t){return new Fn(e,this.data,this.fieldMask,t,this.fieldTransforms)}}function Lg(n){switch(n){case 0:case 2:case 1:return!0;case 3:case 4:return!1;default:throw j()}}class yh{constructor(e,t,s,i,r,o){this.settings=e,this.databaseId=t,this.serializer=s,this.ignoreUndefinedProperties=i,r===void 0&&this.vu(),this.fieldTransforms=r||[],this.fieldMask=o||[]}get path(){return this.settings.path}get Cu(){return this.settings.Cu}Fu(e){return new yh(Object.assign(Object.assign({},this.settings),e),this.databaseId,this.serializer,this.ignoreUndefinedProperties,this.fieldTransforms,this.fieldMask)}Mu(e){var t;const s=(t=this.path)===null||t===void 0?void 0:t.child(e),i=this.Fu({path:s,xu:!1});return i.Ou(e),i}Nu(e){var t;const s=(t=this.path)===null||t===void 0?void 0:t.child(e),i=this.Fu({path:s,xu:!1});return i.vu(),i}Lu(e){return this.Fu({path:void 0,xu:!0})}Bu(e){return Go(e,this.settings.methodName,this.settings.ku||!1,this.path,this.settings.qu)}contains(e){return this.fieldMask.find(t=>e.isPrefixOf(t))!==void 0||this.fieldTransforms.find(t=>e.isPrefixOf(t.field))!==void 0}vu(){if(this.path)for(let e=0;e<this.path.length;e++)this.Ou(this.path.get(e))}Ou(e){if(e.length===0)throw this.Bu("Document fields must not be empty");if(Lg(this.Cu)&&_b.test(e))throw this.Bu('Document fields cannot begin and end with "__"')}}class vb{constructor(e,t,s){this.databaseId=e,this.ignoreUndefinedProperties=t,this.serializer=s||Ea(e)}Qu(e,t,s,i=!1){return new yh({Cu:e,methodName:t,qu:s,path:We.emptyPath(),xu:!1,ku:i},this.databaseId,this.serializer,this.ignoreUndefinedProperties)}}function Ra(n){const e=n._freezeSettings(),t=Ea(n._databaseId);return new vb(n._databaseId,!!e.ignoreUndefinedProperties,t)}function xg(n,e,t,s,i,r={}){const o=n.Qu(r.merge||r.mergeFields?2:0,e,t,i);vh("Data must be an object, but it was:",o,s);const l=Vg(s,o);let c,h;if(r.merge)c=new ft(o.fieldMask),h=o.fieldTransforms;else if(r.mergeFields){const d=[];for(const p of r.mergeFields){const m=ac(e,p,t);if(!o.contains(m))throw new M(k.INVALID_ARGUMENT,`Field '${m}' is specified in your field mask but missing from your input data.`);Bg(d,m)||d.push(m)}c=new ft(d),h=o.fieldTransforms.filter(p=>c.covers(p.field))}else c=null,h=o.fieldTransforms;return new yb(new st(l),c,h)}class Sa extends mh{_toFieldTransform(e){if(e.Cu!==2)throw e.Cu===1?e.Bu(`${this._methodName}() can only appear at the top level of your update data`):e.Bu(`${this._methodName}() cannot be used with set() unless you pass {merge:true}`);return e.fieldMask.push(e.path),null}isEqual(e){return e instanceof Sa}}function Og(n,e,t,s){const i=n.Qu(1,e,t);vh("Data must be an object, but it was:",i,s);const r=[],o=st.empty();ls(s,(c,h)=>{const d=Eh(e,c,t);h=me(h);const p=i.Nu(d);if(h instanceof Sa)r.push(d);else{const m=Cr(h,p);m!=null&&(r.push(d),o.set(d,m))}});const l=new ft(r);return new Dg(o,l,i.fieldTransforms)}function Mg(n,e,t,s,i,r){const o=n.Qu(1,e,t),l=[ac(e,s,t)],c=[i];if(r.length%2!=0)throw new M(k.INVALID_ARGUMENT,`Function ${e}() needs to be called with an even number of arguments that alternate between field names and values.`);for(let m=0;m<r.length;m+=2)l.push(ac(e,r[m])),c.push(r[m+1]);const h=[],d=st.empty();for(let m=l.length-1;m>=0;--m)if(!Bg(h,l[m])){const E=l[m];let R=c[m];R=me(R);const A=o.Nu(E);if(R instanceof Sa)h.push(E);else{const P=Cr(R,A);P!=null&&(h.push(E),d.set(E,P))}}const p=new ft(h);return new Dg(d,p,o.fieldTransforms)}function Eb(n,e,t,s=!1){return Cr(t,n.Qu(s?4:3,e))}function Cr(n,e){if(Fg(n=me(n)))return vh("Unsupported field value:",e,n),Vg(n,e);if(n instanceof mh)return function(s,i){if(!Lg(i.Cu))throw i.Bu(`${s._methodName}() can only be used with update() and set()`);if(!i.path)throw i.Bu(`${s._methodName}() is not currently supported inside arrays`);const r=s._toFieldTransform(i);r&&i.fieldTransforms.push(r)}(n,e),null;if(n===void 0&&e.ignoreUndefinedProperties)return null;if(e.path&&e.fieldMask.push(e.path),n instanceof Array){if(e.settings.xu&&e.Cu!==4)throw e.Bu("Nested arrays are not supported");return function(s,i){const r=[];let o=0;for(const l of s){let c=Cr(l,i.Lu(o));c==null&&(c={nullValue:"NULL_VALUE"}),r.push(c),o++}return{arrayValue:{values:r}}}(n,e)}return function(s,i){if((s=me(s))===null)return{nullValue:"NULL_VALUE"};if(typeof s=="number")return pI(i.serializer,s);if(typeof s=="boolean")return{booleanValue:s};if(typeof s=="string")return{stringValue:s};if(s instanceof Date){const r=Le.fromDate(s);return{timestampValue:qo(i.serializer,r)}}if(s instanceof Le){const r=new Le(s.seconds,1e3*Math.floor(s.nanoseconds/1e3));return{timestampValue:qo(i.serializer,r)}}if(s instanceof gh)return{geoPointValue:{latitude:s.latitude,longitude:s.longitude}};if(s instanceof ss)return{bytesValue:eg(i.serializer,s._byteString)};if(s instanceof Xe){const r=i.databaseId,o=s.firestore._databaseId;if(!o.isEqual(r))throw i.Bu(`Document reference is for database ${o.projectId}/${o.database} but should be for database ${r.projectId}/${r.database}`);return{referenceValue:th(s.firestore._databaseId||i.databaseId,s._key.path)}}if(s instanceof _h)return function(o,l){return{mapValue:{fields:{__type__:{stringValue:"__vector__"},value:{arrayValue:{values:o.toArray().map(c=>{if(typeof c!="number")throw l.Bu("VectorValues must only contain numeric values.");return Jc(l.serializer,c)})}}}}}}(s,i);throw i.Bu(`Unsupported field value: ${Ia(s)}`)}(n,e)}function Vg(n,e){const t={};return Sm(n)?e.path&&e.path.length>0&&e.fieldMask.push(e.path):ls(n,(s,i)=>{const r=Cr(i,e.Mu(s));r!=null&&(t[s]=r)}),{mapValue:{fields:t}}}function Fg(n){return!(typeof n!="object"||n===null||n instanceof Array||n instanceof Date||n instanceof Le||n instanceof gh||n instanceof ss||n instanceof Xe||n instanceof mh||n instanceof _h)}function vh(n,e,t){if(!Fg(t)||!function(i){return typeof i=="object"&&i!==null&&(Object.getPrototypeOf(i)===Object.prototype||Object.getPrototypeOf(i)===null)}(t)){const s=Ia(t);throw s==="an object"?e.Bu(n+" a custom object"):e.Bu(n+" "+s)}}function ac(n,e,t){if((e=me(e))instanceof br)return e._internalPath;if(typeof e=="string")return Eh(n,e);throw Go("Field path arguments must be of type string or ",n,!1,void 0,t)}const wb=new RegExp("[~\\*/\\[\\]]");function Eh(n,e,t){if(e.search(wb)>=0)throw Go(`Invalid field path (${e}). Paths must not contain '~', '*', '/', '[', or ']'`,n,!1,void 0,t);try{return new br(...e.split("."))._internalPath}catch{throw Go(`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,n,!1,void 0,t)}}function Go(n,e,t,s,i){const r=s&&!s.isEmpty(),o=i!==void 0;let l=`Function ${e}() called with invalid data`;t&&(l+=" (via `toFirestore()`)"),l+=". ";let c="";return(r||o)&&(c+=" (found",r&&(c+=` in field ${s}`),o&&(c+=` in document ${i}`),c+=")"),new M(k.INVALID_ARGUMENT,l+n+c)}function Bg(n,e){return n.some(t=>t.isEqual(e))}/**
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
 */class zo{constructor(e,t,s,i,r){this._firestore=e,this._userDataWriter=t,this._key=s,this._document=i,this._converter=r}get id(){return this._key.path.lastSegment()}get ref(){return new Xe(this._firestore,this._converter,this._key)}exists(){return this._document!==null}data(){if(this._document){if(this._converter){const e=new Tb(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(e)}return this._userDataWriter.convertValue(this._document.data.value)}}get(e){if(this._document){const t=this._document.data.field(Aa("DocumentSnapshot.get",e));if(t!==null)return this._userDataWriter.convertValue(t)}}}class Tb extends zo{data(){return super.data()}}function Aa(n,e){return typeof e=="string"?Eh(n,e):e instanceof br?e._internalPath:e._delegate._internalPath}/**
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
 */function Ib(n){if(n.limitType==="L"&&n.explicitOrderBy.length===0)throw new M(k.UNIMPLEMENTED,"limitToLast() queries require specifying at least one orderBy() clause")}class wh{}let Th=class extends wh{};function io(n,e,...t){let s=[];e instanceof wh&&s.push(e),s=s.concat(t),function(r){const o=r.filter(c=>c instanceof Ih).length,l=r.filter(c=>c instanceof ka).length;if(o>1||o>0&&l>0)throw new M(k.INVALID_ARGUMENT,"InvalidQuery. When using composite filters, you cannot use more than one filter at the top level. Consider nesting the multiple filters within an `and(...)` statement. For example: change `query(query, where(...), or(...))` to `query(query, and(where(...), or(...)))`.")}(s);for(const i of s)n=i._apply(n);return n}class ka extends Th{constructor(e,t,s){super(),this._field=e,this._op=t,this._value=s,this.type="where"}static _create(e,t,s){return new ka(e,t,s)}_apply(e){const t=this._parse(e);return Ug(e._query,t),new Bn(e.firestore,e.converter,Zl(e._query,t))}_parse(e){const t=Ra(e.firestore);return function(r,o,l,c,h,d,p){let m;if(h.isKeyField()){if(d==="array-contains"||d==="array-contains-any")throw new M(k.INVALID_ARGUMENT,`Invalid Query. You can't perform '${d}' queries on documentId().`);if(d==="in"||d==="not-in"){Sf(p,d);const E=[];for(const R of p)E.push(Rf(c,r,R));m={arrayValue:{values:E}}}else m=Rf(c,r,p)}else d!=="in"&&d!=="not-in"&&d!=="array-contains-any"||Sf(p,d),m=Eb(l,o,p,d==="in"||d==="not-in");return Se.create(h,d,m)}(e._query,"where",t,e.firestore._databaseId,this._field,this._op,this._value)}}function Cf(n,e,t){const s=e,i=Aa("where",n);return ka._create(i,s,t)}class Ih extends wh{constructor(e,t){super(),this.type=e,this._queryConstraints=t}static _create(e,t){return new Ih(e,t)}_parse(e){const t=this._queryConstraints.map(s=>s._parse(e)).filter(s=>s.getFilters().length>0);return t.length===1?t[0]:At.create(t,this._getOperator())}_apply(e){const t=this._parse(e);return t.getFilters().length===0?e:(function(i,r){let o=i;const l=r.getFlattenedFilters();for(const c of l)Ug(o,c),o=Zl(o,c)}(e._query,t),new Bn(e.firestore,e.converter,Zl(e._query,t)))}_getQueryConstraints(){return this._queryConstraints}_getOperator(){return this.type==="and"?"and":"or"}}class bh extends Th{constructor(e,t){super(),this._field=e,this._direction=t,this.type="orderBy"}static _create(e,t){return new bh(e,t)}_apply(e){const t=function(i,r,o){if(i.startAt!==null)throw new M(k.INVALID_ARGUMENT,"Invalid query. You must not call startAt() or startAfter() before calling orderBy().");if(i.endAt!==null)throw new M(k.INVALID_ARGUMENT,"Invalid query. You must not call endAt() or endBefore() before calling orderBy().");return new nr(r,o)}(e._query,this._field,this._direction);return new Bn(e.firestore,e.converter,function(i,r){const o=i.explicitOrderBy.concat([r]);return new Zs(i.path,i.collectionGroup,o,i.filters.slice(),i.limit,i.limitType,i.startAt,i.endAt)}(e._query,t))}}function gl(n,e="asc"){const t=e,s=Aa("orderBy",n);return bh._create(s,t)}class Ch extends Th{constructor(e,t,s){super(),this.type=e,this._limit=t,this._limitType=s}static _create(e,t,s){return new Ch(e,t,s)}_apply(e){return new Bn(e.firestore,e.converter,Fo(e._query,this._limit,this._limitType))}}function _l(n){return fb("limit",n),Ch._create("limit",n,"F")}function Rf(n,e,t){if(typeof(t=me(t))=="string"){if(t==="")throw new M(k.INVALID_ARGUMENT,"Invalid query. When querying with documentId(), you must provide a valid document ID, but it was an empty string.");if(!Mm(e)&&t.indexOf("/")!==-1)throw new M(k.INVALID_ARGUMENT,`Invalid query. When querying a collection by documentId(), you must provide a plain document ID, but '${t}' contains a '/' character.`);const s=e.path.child(pe.fromString(t));if(!W.isDocumentKey(s))throw new M(k.INVALID_ARGUMENT,`Invalid query. When querying a collection group by documentId(), the value provided must result in a valid document path, but '${s}' is not because it has an odd number of segments (${s.length}).`);return zd(n,new W(s))}if(t instanceof Xe)return zd(n,t._key);throw new M(k.INVALID_ARGUMENT,`Invalid query. When querying with documentId(), you must provide a valid string or a DocumentReference, but it was: ${Ia(t)}.`)}function Sf(n,e){if(!Array.isArray(n)||n.length===0)throw new M(k.INVALID_ARGUMENT,`Invalid Query. A non-empty array is required for '${e.toString()}' filters.`)}function Ug(n,e){const t=function(i,r){for(const o of i)for(const l of o.getFlattenedFilters())if(r.indexOf(l.op)>=0)return l.op;return null}(n.filters,function(i){switch(i){case"!=":return["!=","not-in"];case"array-contains-any":case"in":return["not-in"];case"not-in":return["array-contains-any","in","not-in","!="];default:return[]}}(e.op));if(t!==null)throw t===e.op?new M(k.INVALID_ARGUMENT,`Invalid query. You cannot use more than one '${e.op.toString()}' filter.`):new M(k.INVALID_ARGUMENT,`Invalid query. You cannot use '${e.op.toString()}' filters with '${t.toString()}' filters.`)}class qg{convertValue(e,t="none"){switch(ns(e)){case 0:return null;case 1:return e.booleanValue;case 2:return be(e.integerValue||e.doubleValue);case 3:return this.convertTimestamp(e.timestampValue);case 4:return this.convertServerTimestamp(e,t);case 5:return e.stringValue;case 6:return this.convertBytes(ts(e.bytesValue));case 7:return this.convertReference(e.referenceValue);case 8:return this.convertGeoPoint(e.geoPointValue);case 9:return this.convertArray(e.arrayValue,t);case 11:return this.convertObject(e.mapValue,t);case 10:return this.convertVectorValue(e.mapValue);default:throw j()}}convertObject(e,t){return this.convertObjectMap(e.fields,t)}convertObjectMap(e,t="none"){const s={};return ls(e,(i,r)=>{s[i]=this.convertValue(r,t)}),s}convertVectorValue(e){var t,s,i;const r=(i=(s=(t=e.fields)===null||t===void 0?void 0:t.value.arrayValue)===null||s===void 0?void 0:s.values)===null||i===void 0?void 0:i.map(o=>be(o.doubleValue));return new _h(r)}convertGeoPoint(e){return new gh(be(e.latitude),be(e.longitude))}convertArray(e,t){return(e.values||[]).map(s=>this.convertValue(s,t))}convertServerTimestamp(e,t){switch(t){case"previous":const s=zc(e);return s==null?null:this.convertValue(s,t);case"estimate":return this.convertTimestamp(Zi(e));default:return null}}convertTimestamp(e){const t=Dn(e);return new Le(t.seconds,t.nanos)}convertDocumentKey(e,t){const s=pe.fromString(e);re(ag(s));const i=new er(s.get(1),s.get(3)),r=new W(s.popFirst(5));return i.isEqual(t)||nn(`Document ${r} contains a document reference within a different database (${i.projectId}/${i.database}) which is not supported. It will be treated as a reference in the current database (${t.projectId}/${t.database}) instead.`),r}}/**
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
 */function Wg(n,e,t){let s;return s=n?t&&(t.merge||t.mergeFields)?n.toFirestore(e,t):n.toFirestore(e):e,s}class bb extends qg{constructor(e){super(),this.firestore=e}convertBytes(e){return new ss(e)}convertReference(e){const t=this.convertDocumentKey(e,this.firestore._databaseId);return new Xe(this.firestore,null,t)}}/**
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
 */class Ss{constructor(e,t){this.hasPendingWrites=e,this.fromCache=t}isEqual(e){return this.hasPendingWrites===e.hasPendingWrites&&this.fromCache===e.fromCache}}class Rh extends zo{constructor(e,t,s,i,r,o){super(e,t,s,i,o),this._firestore=e,this._firestoreImpl=e,this.metadata=r}exists(){return super.exists()}data(e={}){if(this._document){if(this._converter){const t=new vo(this._firestore,this._userDataWriter,this._key,this._document,this.metadata,null);return this._converter.fromFirestore(t,e)}return this._userDataWriter.convertValue(this._document.data.value,e.serverTimestamps)}}get(e,t={}){if(this._document){const s=this._document.data.field(Aa("DocumentSnapshot.get",e));if(s!==null)return this._userDataWriter.convertValue(s,t.serverTimestamps)}}}class vo extends Rh{data(e={}){return super.data(e)}}class Cb{constructor(e,t,s,i){this._firestore=e,this._userDataWriter=t,this._snapshot=i,this.metadata=new Ss(i.hasPendingWrites,i.fromCache),this.query=s}get docs(){const e=[];return this.forEach(t=>e.push(t)),e}get size(){return this._snapshot.docs.size}get empty(){return this.size===0}forEach(e,t){this._snapshot.docs.forEach(s=>{e.call(t,new vo(this._firestore,this._userDataWriter,s.key,s,new Ss(this._snapshot.mutatedKeys.has(s.key),this._snapshot.fromCache),this.query.converter))})}docChanges(e={}){const t=!!e.includeMetadataChanges;if(t&&this._snapshot.excludesMetadataChanges)throw new M(k.INVALID_ARGUMENT,"To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");return this._cachedChanges&&this._cachedChangesIncludeMetadataChanges===t||(this._cachedChanges=function(i,r){if(i._snapshot.oldDocs.isEmpty()){let o=0;return i._snapshot.docChanges.map(l=>{const c=new vo(i._firestore,i._userDataWriter,l.doc.key,l.doc,new Ss(i._snapshot.mutatedKeys.has(l.doc.key),i._snapshot.fromCache),i.query.converter);return l.doc,{type:"added",doc:c,oldIndex:-1,newIndex:o++}})}{let o=i._snapshot.oldDocs;return i._snapshot.docChanges.filter(l=>r||l.type!==3).map(l=>{const c=new vo(i._firestore,i._userDataWriter,l.doc.key,l.doc,new Ss(i._snapshot.mutatedKeys.has(l.doc.key),i._snapshot.fromCache),i.query.converter);let h=-1,d=-1;return l.type!==0&&(h=o.indexOf(l.doc.key),o=o.delete(l.doc.key)),l.type!==1&&(o=o.add(l.doc),d=o.indexOf(l.doc.key)),{type:Rb(l.type),doc:c,oldIndex:h,newIndex:d}})}}(this,t),this._cachedChangesIncludeMetadataChanges=t),this._cachedChanges}}function Rb(n){switch(n){case 0:return"added";case 2:case 3:return"modified";case 1:return"removed";default:return j()}}/**
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
 */function yl(n){n=Vt(n,Xe);const e=Vt(n.firestore,ni);return hb(Ca(e),n._key).then(t=>Sb(e,n,t))}class Sh extends qg{constructor(e){super(),this.firestore=e}convertBytes(e){return new ss(e)}convertReference(e){const t=this.convertDocumentKey(e,this.firestore._databaseId);return new Xe(this.firestore,null,t)}}function ro(n){n=Vt(n,Bn);const e=Vt(n.firestore,ni),t=Ca(e),s=new Sh(e);return Ib(n._query),ub(t,n._query).then(i=>new Cb(e,s,n,i))}function vl(n,e,t){n=Vt(n,Xe);const s=Vt(n.firestore,ni),i=Wg(n.converter,e,t);return $g(s,[xg(Ra(s),"setDoc",n._key,i,n.converter!==null,t).toMutation(n._key,it.none())])}function Af(n,e,t,...s){n=Vt(n,Xe);const i=Vt(n.firestore,ni),r=Ra(i);let o;return o=typeof(e=me(e))=="string"||e instanceof br?Mg(r,"updateDoc",n._key,e,t,s):Og(r,"updateDoc",n._key,e),$g(i,[o.toMutation(n._key,it.exists(!0))])}function $g(n,e){return function(s,i){const r=new Lt;return s.asyncQueue.enqueueAndForget(async()=>Y0(await lb(s),i,r)),r.promise}(Ca(n),e)}function Sb(n,e,t){const s=t.docs.get(e._key),i=new Sh(n);return new Rh(n,i,e._key,s,new Ss(t.hasPendingWrites,t.fromCache),e.converter)}/**
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
 */const Ab={maxAttempts:5};function Ii(n,e){if((n=me(n)).firestore!==e)throw new M(k.INVALID_ARGUMENT,"Provided document reference is from a different Firestore instance.");return n}/**
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
 */class kb extends class{constructor(t,s){this._firestore=t,this._transaction=s,this._dataReader=Ra(t)}get(t){const s=Ii(t,this._firestore),i=new bb(this._firestore);return this._transaction.lookup([s._key]).then(r=>{if(!r||r.length!==1)return j();const o=r[0];if(o.isFoundDocument())return new zo(this._firestore,i,o.key,o,s.converter);if(o.isNoDocument())return new zo(this._firestore,i,s._key,null,s.converter);throw j()})}set(t,s,i){const r=Ii(t,this._firestore),o=Wg(r.converter,s,i),l=xg(this._dataReader,"Transaction.set",r._key,o,r.converter!==null,i);return this._transaction.set(r._key,l),this}update(t,s,i,...r){const o=Ii(t,this._firestore);let l;return l=typeof(s=me(s))=="string"||s instanceof br?Mg(this._dataReader,"Transaction.update",o._key,s,i,r):Og(this._dataReader,"Transaction.update",o._key,s),this._transaction.update(o._key,l),this}delete(t){const s=Ii(t,this._firestore);return this._transaction.delete(s._key),this}}{constructor(e,t){super(e,t),this._firestore=e}get(e){const t=Ii(e,this._firestore),s=new Sh(this._firestore);return super.get(e).then(i=>new Rh(this._firestore,s,t._key,i._document,new Ss(!1,!1),t.converter))}}function Pb(n,e,t){n=Vt(n,ni);const s=Object.assign(Object.assign({},Ab),t);return function(r){if(r.maxAttempts<1)throw new M(k.INVALID_ARGUMENT,"Max attempts must be at least 1")}(s),function(r,o,l){const c=new Lt;return r.asyncQueue.enqueueAndForget(async()=>{const h=await cb(r);new rb(r.asyncQueue,h,l,o,c).au()}),c.promise}(Ca(n),i=>e(new kb(n,i)),s)}(function(e,t=!0){(function(i){Xs=i})(as),Xn(new Pn("firestore",(s,{instanceIdentifier:i,options:r})=>{const o=s.getProvider("app").getImmediate(),l=new ni(new NT(s.getProvider("auth-internal")),new OT(s.getProvider("app-check-internal")),function(h,d){if(!Object.prototype.hasOwnProperty.apply(h.options,["projectId"]))throw new M(k.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new er(h.options.projectId,d)}(o,i),o);return r=Object.assign({useFetchStreams:t},r),l._setSettings(r),l},"PUBLIC").setMultipleInstances(!0)),Nt(qd,"4.7.3",e),Nt(qd,"4.7.3","esm2017")})();var kf={};const Pf="@firebase/database",Nf="1.0.8";/**
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
 */let jg="";function Nb(n){jg=n}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Db{constructor(e){this.domStorage_=e,this.prefix_="firebase:"}set(e,t){t==null?this.domStorage_.removeItem(this.prefixedName_(e)):this.domStorage_.setItem(this.prefixedName_(e),De(t))}get(e){const t=this.domStorage_.getItem(this.prefixedName_(e));return t==null?null:Qi(t)}remove(e){this.domStorage_.removeItem(this.prefixedName_(e))}prefixedName_(e){return this.prefix_+e}toString(){return this.domStorage_.toString()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Lb{constructor(){this.cache_={},this.isInMemoryStorage=!0}set(e,t){t==null?delete this.cache_[e]:this.cache_[e]=t}get(e){return Bt(this.cache_,e)?this.cache_[e]:null}remove(e){delete this.cache_[e]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Gg=function(n){try{if(typeof window<"u"&&typeof window[n]<"u"){const e=window[n];return e.setItem("firebase:sentinel","cache"),e.removeItem("firebase:sentinel"),new Db(e)}}catch{}return new Lb},Kn=Gg("localStorage"),xb=Gg("sessionStorage");/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ls=new ha("@firebase/database"),Ob=function(){let n=1;return function(){return n++}}(),zg=function(n){const e=vv(n),t=new mv;t.update(e);const s=t.digest();return Ac.encodeByteArray(s)},Rr=function(...n){let e="";for(let t=0;t<n.length;t++){const s=n[t];Array.isArray(s)||s&&typeof s=="object"&&typeof s.length=="number"?e+=Rr.apply(null,s):typeof s=="object"?e+=De(s):e+=s,e+=" "}return e};let $i=null,Df=!0;const Mb=function(n,e){D(!0,"Can't turn on custom loggers persistently."),Ls.logLevel=te.VERBOSE,$i=Ls.log.bind(Ls)},qe=function(...n){if(Df===!0&&(Df=!1,$i===null&&xb.get("logging_enabled")===!0&&Mb()),$i){const e=Rr.apply(null,n);$i(e)}},Sr=function(n){return function(...e){qe(n,...e)}},lc=function(...n){const e="FIREBASE INTERNAL ERROR: "+Rr(...n);Ls.error(e)},rn=function(...n){const e=`FIREBASE FATAL ERROR: ${Rr(...n)}`;throw Ls.error(e),new Error(e)},ot=function(...n){const e="FIREBASE WARNING: "+Rr(...n);Ls.warn(e)},Vb=function(){typeof window<"u"&&window.location&&window.location.protocol&&window.location.protocol.indexOf("https:")!==-1&&ot("Insecure Firebase access from a secure page. Please use https in calls to new Firebase().")},Ah=function(n){return typeof n=="number"&&(n!==n||n===Number.POSITIVE_INFINITY||n===Number.NEGATIVE_INFINITY)},Fb=function(n){if(document.readyState==="complete")n();else{let e=!1;const t=function(){if(!document.body){setTimeout(t,Math.floor(10));return}e||(e=!0,n())};document.addEventListener?(document.addEventListener("DOMContentLoaded",t,!1),window.addEventListener("load",t,!1)):document.attachEvent&&(document.attachEvent("onreadystatechange",()=>{document.readyState==="complete"&&t()}),window.attachEvent("onload",t))}},is="[MIN_NAME]",xn="[MAX_NAME]",hs=function(n,e){if(n===e)return 0;if(n===is||e===xn)return-1;if(e===is||n===xn)return 1;{const t=Lf(n),s=Lf(e);return t!==null?s!==null?t-s===0?n.length-e.length:t-s:-1:s!==null?1:n<e?-1:1}},Bb=function(n,e){return n===e?0:n<e?-1:1},bi=function(n,e){if(e&&n in e)return e[n];throw new Error("Missing required key ("+n+") in object: "+De(e))},kh=function(n){if(typeof n!="object"||n===null)return De(n);const e=[];for(const s in n)e.push(s);e.sort();let t="{";for(let s=0;s<e.length;s++)s!==0&&(t+=","),t+=De(e[s]),t+=":",t+=kh(n[e[s]]);return t+="}",t},Hg=function(n,e){const t=n.length;if(t<=e)return[n];const s=[];for(let i=0;i<t;i+=e)i+e>t?s.push(n.substring(i,t)):s.push(n.substring(i,i+e));return s};function Ge(n,e){for(const t in n)n.hasOwnProperty(t)&&e(t,n[t])}const Kg=function(n){D(!Ah(n),"Invalid JSON number");const e=11,t=52,s=(1<<e-1)-1;let i,r,o,l,c;n===0?(r=0,o=0,i=1/n===-1/0?1:0):(i=n<0,n=Math.abs(n),n>=Math.pow(2,1-s)?(l=Math.min(Math.floor(Math.log(n)/Math.LN2),s),r=l+s,o=Math.round(n*Math.pow(2,t-l)-Math.pow(2,t))):(r=0,o=Math.round(n/Math.pow(2,1-s-t))));const h=[];for(c=t;c;c-=1)h.push(o%2?1:0),o=Math.floor(o/2);for(c=e;c;c-=1)h.push(r%2?1:0),r=Math.floor(r/2);h.push(i?1:0),h.reverse();const d=h.join("");let p="";for(c=0;c<64;c+=8){let m=parseInt(d.substr(c,8),2).toString(16);m.length===1&&(m="0"+m),p=p+m}return p.toLowerCase()},Ub=function(){return!!(typeof window=="object"&&window.chrome&&window.chrome.extension&&!/^chrome/.test(window.location.href))},qb=function(){return typeof Windows=="object"&&typeof Windows.UI=="object"};function Wb(n,e){let t="Unknown Error";n==="too_big"?t="The data requested exceeds the maximum size that can be accessed with a single request.":n==="permission_denied"?t="Client doesn't have permission to access the desired data.":n==="unavailable"&&(t="The service is unavailable");const s=new Error(n+" at "+e._path.toString()+": "+t);return s.code=n.toUpperCase(),s}const $b=new RegExp("^-?(0*)\\d{1,10}$"),jb=-2147483648,Gb=2147483647,Lf=function(n){if($b.test(n)){const e=Number(n);if(e>=jb&&e<=Gb)return e}return null},si=function(n){try{n()}catch(e){setTimeout(()=>{const t=e.stack||"";throw ot("Exception was thrown by user callback.",t),e},Math.floor(0))}},zb=function(){return(typeof window=="object"&&window.navigator&&window.navigator.userAgent||"").search(/googlebot|google webmaster tools|bingbot|yahoo! slurp|baiduspider|yandexbot|duckduckbot/i)>=0},ji=function(n,e){const t=setTimeout(n,e);return typeof t=="number"&&typeof Deno<"u"&&Deno.unrefTimer?Deno.unrefTimer(t):typeof t=="object"&&t.unref&&t.unref(),t};/**
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
 */class Hb{constructor(e,t){this.appName_=e,this.appCheckProvider=t,this.appCheck=t==null?void 0:t.getImmediate({optional:!0}),this.appCheck||t==null||t.get().then(s=>this.appCheck=s)}getToken(e){return this.appCheck?this.appCheck.getToken(e):new Promise((t,s)=>{setTimeout(()=>{this.appCheck?this.getToken(e).then(t,s):t(null)},0)})}addTokenChangeListener(e){var t;(t=this.appCheckProvider)===null||t===void 0||t.get().then(s=>s.addTokenListener(e))}notifyForInvalidToken(){ot(`Provided AppCheck credentials for the app named "${this.appName_}" are invalid. This usually indicates your app was not initialized correctly.`)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Kb{constructor(e,t,s){this.appName_=e,this.firebaseOptions_=t,this.authProvider_=s,this.auth_=null,this.auth_=s.getImmediate({optional:!0}),this.auth_||s.onInit(i=>this.auth_=i)}getToken(e){return this.auth_?this.auth_.getToken(e).catch(t=>t&&t.code==="auth/token-not-initialized"?(qe("Got auth/token-not-initialized error.  Treating as null token."),null):Promise.reject(t)):new Promise((t,s)=>{setTimeout(()=>{this.auth_?this.getToken(e).then(t,s):t(null)},0)})}addTokenChangeListener(e){this.auth_?this.auth_.addAuthTokenListener(e):this.authProvider_.get().then(t=>t.addAuthTokenListener(e))}removeTokenChangeListener(e){this.authProvider_.get().then(t=>t.removeAuthTokenListener(e))}notifyForInvalidToken(){let e='Provided authentication credentials for the app named "'+this.appName_+'" are invalid. This usually indicates your app was not initialized correctly. ';"credential"in this.firebaseOptions_?e+='Make sure the "credential" property provided to initializeApp() is authorized to access the specified "databaseURL" and is from the correct project.':"serviceAccount"in this.firebaseOptions_?e+='Make sure the "serviceAccount" property provided to initializeApp() is authorized to access the specified "databaseURL" and is from the correct project.':e+='Make sure the "apiKey" and "databaseURL" properties provided to initializeApp() match the values provided for your app at https://console.firebase.google.com/.',ot(e)}}class Eo{constructor(e){this.accessToken=e}getToken(e){return Promise.resolve({accessToken:this.accessToken})}addTokenChangeListener(e){e(this.accessToken)}removeTokenChangeListener(e){}notifyForInvalidToken(){}}Eo.OWNER="owner";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ph="5",Qg="v",Yg="s",Jg="r",Xg="f",Zg=/(console\.firebase|firebase-console-\w+\.corp|firebase\.corp)\.google\.com/,e_="ls",t_="p",cc="ac",n_="websocket",s_="long_polling";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class i_{constructor(e,t,s,i,r=!1,o="",l=!1,c=!1){this.secure=t,this.namespace=s,this.webSocketOnly=i,this.nodeAdmin=r,this.persistenceKey=o,this.includeNamespaceInQueryParams=l,this.isUsingEmulator=c,this._host=e.toLowerCase(),this._domain=this._host.substr(this._host.indexOf(".")+1),this.internalHost=Kn.get("host:"+e)||this._host}isCacheableHost(){return this.internalHost.substr(0,2)==="s-"}isCustomHost(){return this._domain!=="firebaseio.com"&&this._domain!=="firebaseio-demo.com"}get host(){return this._host}set host(e){e!==this.internalHost&&(this.internalHost=e,this.isCacheableHost()&&Kn.set("host:"+this._host,this.internalHost))}toString(){let e=this.toURLString();return this.persistenceKey&&(e+="<"+this.persistenceKey+">"),e}toURLString(){const e=this.secure?"https://":"http://",t=this.includeNamespaceInQueryParams?`?ns=${this.namespace}`:"";return`${e}${this.host}/${t}`}}function Qb(n){return n.host!==n.internalHost||n.isCustomHost()||n.includeNamespaceInQueryParams}function r_(n,e,t){D(typeof e=="string","typeof type must == string"),D(typeof t=="object","typeof params must == object");let s;if(e===n_)s=(n.secure?"wss://":"ws://")+n.internalHost+"/.ws?";else if(e===s_)s=(n.secure?"https://":"http://")+n.internalHost+"/.lp?";else throw new Error("Unknown connection type: "+e);Qb(n)&&(t.ns=n.namespace);const i=[];return Ge(t,(r,o)=>{i.push(r+"="+o)}),s+i.join("&")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Yb{constructor(){this.counters_={}}incrementCounter(e,t=1){Bt(this.counters_,e)||(this.counters_[e]=0),this.counters_[e]+=t}get(){return Yy(this.counters_)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const El={},wl={};function Nh(n){const e=n.toString();return El[e]||(El[e]=new Yb),El[e]}function Jb(n,e){const t=n.toString();return wl[t]||(wl[t]=e()),wl[t]}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Xb{constructor(e){this.onMessage_=e,this.pendingResponses=[],this.currentResponseNum=0,this.closeAfterResponse=-1,this.onClose=null}closeAfter(e,t){this.closeAfterResponse=e,this.onClose=t,this.closeAfterResponse<this.currentResponseNum&&(this.onClose(),this.onClose=null)}handleResponse(e,t){for(this.pendingResponses[e]=t;this.pendingResponses[this.currentResponseNum];){const s=this.pendingResponses[this.currentResponseNum];delete this.pendingResponses[this.currentResponseNum];for(let i=0;i<s.length;++i)s[i]&&si(()=>{this.onMessage_(s[i])});if(this.currentResponseNum===this.closeAfterResponse){this.onClose&&(this.onClose(),this.onClose=null);break}this.currentResponseNum++}}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const xf="start",Zb="close",eC="pLPCommand",tC="pRTLPCB",o_="id",a_="pw",l_="ser",nC="cb",sC="seg",iC="ts",rC="d",oC="dframe",c_=1870,h_=30,aC=c_-h_,lC=25e3,cC=3e4;class As{constructor(e,t,s,i,r,o,l){this.connId=e,this.repoInfo=t,this.applicationId=s,this.appCheckToken=i,this.authToken=r,this.transportSessionId=o,this.lastSessionId=l,this.bytesSent=0,this.bytesReceived=0,this.everConnected_=!1,this.log_=Sr(e),this.stats_=Nh(t),this.urlFn=c=>(this.appCheckToken&&(c[cc]=this.appCheckToken),r_(t,s_,c))}open(e,t){this.curSegmentNum=0,this.onDisconnect_=t,this.myPacketOrderer=new Xb(e),this.isClosed_=!1,this.connectTimeoutTimer_=setTimeout(()=>{this.log_("Timed out trying to connect."),this.onClosed_(),this.connectTimeoutTimer_=null},Math.floor(cC)),Fb(()=>{if(this.isClosed_)return;this.scriptTagHolder=new Dh((...r)=>{const[o,l,c,h,d]=r;if(this.incrementIncomingBytes_(r),!!this.scriptTagHolder)if(this.connectTimeoutTimer_&&(clearTimeout(this.connectTimeoutTimer_),this.connectTimeoutTimer_=null),this.everConnected_=!0,o===xf)this.id=l,this.password=c;else if(o===Zb)l?(this.scriptTagHolder.sendNewPolls=!1,this.myPacketOrderer.closeAfter(l,()=>{this.onClosed_()})):this.onClosed_();else throw new Error("Unrecognized command received: "+o)},(...r)=>{const[o,l]=r;this.incrementIncomingBytes_(r),this.myPacketOrderer.handleResponse(o,l)},()=>{this.onClosed_()},this.urlFn);const s={};s[xf]="t",s[l_]=Math.floor(Math.random()*1e8),this.scriptTagHolder.uniqueCallbackIdentifier&&(s[nC]=this.scriptTagHolder.uniqueCallbackIdentifier),s[Qg]=Ph,this.transportSessionId&&(s[Yg]=this.transportSessionId),this.lastSessionId&&(s[e_]=this.lastSessionId),this.applicationId&&(s[t_]=this.applicationId),this.appCheckToken&&(s[cc]=this.appCheckToken),typeof location<"u"&&location.hostname&&Zg.test(location.hostname)&&(s[Jg]=Xg);const i=this.urlFn(s);this.log_("Connecting via long-poll to "+i),this.scriptTagHolder.addTag(i,()=>{})})}start(){this.scriptTagHolder.startLongPoll(this.id,this.password),this.addDisconnectPingFrame(this.id,this.password)}static forceAllow(){As.forceAllow_=!0}static forceDisallow(){As.forceDisallow_=!0}static isAvailable(){return As.forceAllow_?!0:!As.forceDisallow_&&typeof document<"u"&&document.createElement!=null&&!Ub()&&!qb()}markConnectionHealthy(){}shutdown_(){this.isClosed_=!0,this.scriptTagHolder&&(this.scriptTagHolder.close(),this.scriptTagHolder=null),this.myDisconnFrame&&(document.body.removeChild(this.myDisconnFrame),this.myDisconnFrame=null),this.connectTimeoutTimer_&&(clearTimeout(this.connectTimeoutTimer_),this.connectTimeoutTimer_=null)}onClosed_(){this.isClosed_||(this.log_("Longpoll is closing itself"),this.shutdown_(),this.onDisconnect_&&(this.onDisconnect_(this.everConnected_),this.onDisconnect_=null))}close(){this.isClosed_||(this.log_("Longpoll is being closed."),this.shutdown_())}send(e){const t=De(e);this.bytesSent+=t.length,this.stats_.incrementCounter("bytes_sent",t.length);const s=Ap(t),i=Hg(s,aC);for(let r=0;r<i.length;r++)this.scriptTagHolder.enqueueSegment(this.curSegmentNum,i.length,i[r]),this.curSegmentNum++}addDisconnectPingFrame(e,t){this.myDisconnFrame=document.createElement("iframe");const s={};s[oC]="t",s[o_]=e,s[a_]=t,this.myDisconnFrame.src=this.urlFn(s),this.myDisconnFrame.style.display="none",document.body.appendChild(this.myDisconnFrame)}incrementIncomingBytes_(e){const t=De(e).length;this.bytesReceived+=t,this.stats_.incrementCounter("bytes_received",t)}}class Dh{constructor(e,t,s,i){this.onDisconnect=s,this.urlFn=i,this.outstandingRequests=new Set,this.pendingSegs=[],this.currentSerial=Math.floor(Math.random()*1e8),this.sendNewPolls=!0;{this.uniqueCallbackIdentifier=Ob(),window[eC+this.uniqueCallbackIdentifier]=e,window[tC+this.uniqueCallbackIdentifier]=t,this.myIFrame=Dh.createIFrame_();let r="";this.myIFrame.src&&this.myIFrame.src.substr(0,11)==="javascript:"&&(r='<script>document.domain="'+document.domain+'";<\/script>');const o="<html><body>"+r+"</body></html>";try{this.myIFrame.doc.open(),this.myIFrame.doc.write(o),this.myIFrame.doc.close()}catch(l){qe("frame writing exception"),l.stack&&qe(l.stack),qe(l)}}}static createIFrame_(){const e=document.createElement("iframe");if(e.style.display="none",document.body){document.body.appendChild(e);try{e.contentWindow.document||qe("No IE domain setting required")}catch{const s=document.domain;e.src="javascript:void((function(){document.open();document.domain='"+s+"';document.close();})())"}}else throw"Document body has not initialized. Wait to initialize Firebase until after the document is ready.";return e.contentDocument?e.doc=e.contentDocument:e.contentWindow?e.doc=e.contentWindow.document:e.document&&(e.doc=e.document),e}close(){this.alive=!1,this.myIFrame&&(this.myIFrame.doc.body.textContent="",setTimeout(()=>{this.myIFrame!==null&&(document.body.removeChild(this.myIFrame),this.myIFrame=null)},Math.floor(0)));const e=this.onDisconnect;e&&(this.onDisconnect=null,e())}startLongPoll(e,t){for(this.myID=e,this.myPW=t,this.alive=!0;this.newRequest_(););}newRequest_(){if(this.alive&&this.sendNewPolls&&this.outstandingRequests.size<(this.pendingSegs.length>0?2:1)){this.currentSerial++;const e={};e[o_]=this.myID,e[a_]=this.myPW,e[l_]=this.currentSerial;let t=this.urlFn(e),s="",i=0;for(;this.pendingSegs.length>0&&this.pendingSegs[0].d.length+h_+s.length<=c_;){const o=this.pendingSegs.shift();s=s+"&"+sC+i+"="+o.seg+"&"+iC+i+"="+o.ts+"&"+rC+i+"="+o.d,i++}return t=t+s,this.addLongPollTag_(t,this.currentSerial),!0}else return!1}enqueueSegment(e,t,s){this.pendingSegs.push({seg:e,ts:t,d:s}),this.alive&&this.newRequest_()}addLongPollTag_(e,t){this.outstandingRequests.add(t);const s=()=>{this.outstandingRequests.delete(t),this.newRequest_()},i=setTimeout(s,Math.floor(lC)),r=()=>{clearTimeout(i),s()};this.addTag(e,r)}addTag(e,t){setTimeout(()=>{try{if(!this.sendNewPolls)return;const s=this.myIFrame.doc.createElement("script");s.type="text/javascript",s.async=!0,s.src=e,s.onload=s.onreadystatechange=function(){const i=s.readyState;(!i||i==="loaded"||i==="complete")&&(s.onload=s.onreadystatechange=null,s.parentNode&&s.parentNode.removeChild(s),t())},s.onerror=()=>{qe("Long-poll script failed to load: "+e),this.sendNewPolls=!1,this.close()},this.myIFrame.doc.body.appendChild(s)}catch{}},Math.floor(1))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const hC=16384,uC=45e3;let Ho=null;typeof MozWebSocket<"u"?Ho=MozWebSocket:typeof WebSocket<"u"&&(Ho=WebSocket);class bt{constructor(e,t,s,i,r,o,l){this.connId=e,this.applicationId=s,this.appCheckToken=i,this.authToken=r,this.keepaliveTimer=null,this.frames=null,this.totalFrames=0,this.bytesSent=0,this.bytesReceived=0,this.log_=Sr(this.connId),this.stats_=Nh(t),this.connURL=bt.connectionURL_(t,o,l,i,s),this.nodeAdmin=t.nodeAdmin}static connectionURL_(e,t,s,i,r){const o={};return o[Qg]=Ph,typeof location<"u"&&location.hostname&&Zg.test(location.hostname)&&(o[Jg]=Xg),t&&(o[Yg]=t),s&&(o[e_]=s),i&&(o[cc]=i),r&&(o[t_]=r),r_(e,n_,o)}open(e,t){this.onDisconnect=t,this.onMessage=e,this.log_("Websocket connecting to "+this.connURL),this.everConnected_=!1,Kn.set("previous_websocket_failure",!0);try{let s;ov(),this.mySock=new Ho(this.connURL,[],s)}catch(s){this.log_("Error instantiating WebSocket.");const i=s.message||s.data;i&&this.log_(i),this.onClosed_();return}this.mySock.onopen=()=>{this.log_("Websocket connected."),this.everConnected_=!0},this.mySock.onclose=()=>{this.log_("Websocket connection was disconnected."),this.mySock=null,this.onClosed_()},this.mySock.onmessage=s=>{this.handleIncomingFrame(s)},this.mySock.onerror=s=>{this.log_("WebSocket error.  Closing connection.");const i=s.message||s.data;i&&this.log_(i),this.onClosed_()}}start(){}static forceDisallow(){bt.forceDisallow_=!0}static isAvailable(){let e=!1;if(typeof navigator<"u"&&navigator.userAgent){const t=/Android ([0-9]{0,}\.[0-9]{0,})/,s=navigator.userAgent.match(t);s&&s.length>1&&parseFloat(s[1])<4.4&&(e=!0)}return!e&&Ho!==null&&!bt.forceDisallow_}static previouslyFailed(){return Kn.isInMemoryStorage||Kn.get("previous_websocket_failure")===!0}markConnectionHealthy(){Kn.remove("previous_websocket_failure")}appendFrame_(e){if(this.frames.push(e),this.frames.length===this.totalFrames){const t=this.frames.join("");this.frames=null;const s=Qi(t);this.onMessage(s)}}handleNewFrameCount_(e){this.totalFrames=e,this.frames=[]}extractFrameCount_(e){if(D(this.frames===null,"We already have a frame buffer"),e.length<=6){const t=Number(e);if(!isNaN(t))return this.handleNewFrameCount_(t),null}return this.handleNewFrameCount_(1),e}handleIncomingFrame(e){if(this.mySock===null)return;const t=e.data;if(this.bytesReceived+=t.length,this.stats_.incrementCounter("bytes_received",t.length),this.resetKeepAlive(),this.frames!==null)this.appendFrame_(t);else{const s=this.extractFrameCount_(t);s!==null&&this.appendFrame_(s)}}send(e){this.resetKeepAlive();const t=De(e);this.bytesSent+=t.length,this.stats_.incrementCounter("bytes_sent",t.length);const s=Hg(t,hC);s.length>1&&this.sendString_(String(s.length));for(let i=0;i<s.length;i++)this.sendString_(s[i])}shutdown_(){this.isClosed_=!0,this.keepaliveTimer&&(clearInterval(this.keepaliveTimer),this.keepaliveTimer=null),this.mySock&&(this.mySock.close(),this.mySock=null)}onClosed_(){this.isClosed_||(this.log_("WebSocket is closing itself"),this.shutdown_(),this.onDisconnect&&(this.onDisconnect(this.everConnected_),this.onDisconnect=null))}close(){this.isClosed_||(this.log_("WebSocket is being closed"),this.shutdown_())}resetKeepAlive(){clearInterval(this.keepaliveTimer),this.keepaliveTimer=setInterval(()=>{this.mySock&&this.sendString_("0"),this.resetKeepAlive()},Math.floor(uC))}sendString_(e){try{this.mySock.send(e)}catch(t){this.log_("Exception thrown from WebSocket.send():",t.message||t.data,"Closing connection."),setTimeout(this.onClosed_.bind(this),0)}}}bt.responsesRequiredToBeHealthy=2;bt.healthyTimeout=3e4;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rr{constructor(e){this.initTransports_(e)}static get ALL_TRANSPORTS(){return[As,bt]}static get IS_TRANSPORT_INITIALIZED(){return this.globalTransportInitialized_}initTransports_(e){const t=bt&&bt.isAvailable();let s=t&&!bt.previouslyFailed();if(e.webSocketOnly&&(t||ot("wss:// URL used, but browser isn't known to support websockets.  Trying anyway."),s=!0),s)this.transports_=[bt];else{const i=this.transports_=[];for(const r of rr.ALL_TRANSPORTS)r&&r.isAvailable()&&i.push(r);rr.globalTransportInitialized_=!0}}initialTransport(){if(this.transports_.length>0)return this.transports_[0];throw new Error("No transports available")}upgradeTransport(){return this.transports_.length>1?this.transports_[1]:null}}rr.globalTransportInitialized_=!1;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const dC=6e4,fC=5e3,pC=10*1024,mC=100*1024,Tl="t",Of="d",gC="s",Mf="r",_C="e",Vf="o",Ff="a",Bf="n",Uf="p",yC="h";class vC{constructor(e,t,s,i,r,o,l,c,h,d){this.id=e,this.repoInfo_=t,this.applicationId_=s,this.appCheckToken_=i,this.authToken_=r,this.onMessage_=o,this.onReady_=l,this.onDisconnect_=c,this.onKill_=h,this.lastSessionId=d,this.connectionCount=0,this.pendingDataMessages=[],this.state_=0,this.log_=Sr("c:"+this.id+":"),this.transportManager_=new rr(t),this.log_("Connection created"),this.start_()}start_(){const e=this.transportManager_.initialTransport();this.conn_=new e(this.nextTransportId_(),this.repoInfo_,this.applicationId_,this.appCheckToken_,this.authToken_,null,this.lastSessionId),this.primaryResponsesRequired_=e.responsesRequiredToBeHealthy||0;const t=this.connReceiver_(this.conn_),s=this.disconnReceiver_(this.conn_);this.tx_=this.conn_,this.rx_=this.conn_,this.secondaryConn_=null,this.isHealthy_=!1,setTimeout(()=>{this.conn_&&this.conn_.open(t,s)},Math.floor(0));const i=e.healthyTimeout||0;i>0&&(this.healthyTimeout_=ji(()=>{this.healthyTimeout_=null,this.isHealthy_||(this.conn_&&this.conn_.bytesReceived>mC?(this.log_("Connection exceeded healthy timeout but has received "+this.conn_.bytesReceived+" bytes.  Marking connection healthy."),this.isHealthy_=!0,this.conn_.markConnectionHealthy()):this.conn_&&this.conn_.bytesSent>pC?this.log_("Connection exceeded healthy timeout but has sent "+this.conn_.bytesSent+" bytes.  Leaving connection alive."):(this.log_("Closing unhealthy connection after timeout."),this.close()))},Math.floor(i)))}nextTransportId_(){return"c:"+this.id+":"+this.connectionCount++}disconnReceiver_(e){return t=>{e===this.conn_?this.onConnectionLost_(t):e===this.secondaryConn_?(this.log_("Secondary connection lost."),this.onSecondaryConnectionLost_()):this.log_("closing an old connection")}}connReceiver_(e){return t=>{this.state_!==2&&(e===this.rx_?this.onPrimaryMessageReceived_(t):e===this.secondaryConn_?this.onSecondaryMessageReceived_(t):this.log_("message on old connection"))}}sendRequest(e){const t={t:"d",d:e};this.sendData_(t)}tryCleanupConnection(){this.tx_===this.secondaryConn_&&this.rx_===this.secondaryConn_&&(this.log_("cleaning up and promoting a connection: "+this.secondaryConn_.connId),this.conn_=this.secondaryConn_,this.secondaryConn_=null)}onSecondaryControl_(e){if(Tl in e){const t=e[Tl];t===Ff?this.upgradeIfSecondaryHealthy_():t===Mf?(this.log_("Got a reset on secondary, closing it"),this.secondaryConn_.close(),(this.tx_===this.secondaryConn_||this.rx_===this.secondaryConn_)&&this.close()):t===Vf&&(this.log_("got pong on secondary."),this.secondaryResponsesRequired_--,this.upgradeIfSecondaryHealthy_())}}onSecondaryMessageReceived_(e){const t=bi("t",e),s=bi("d",e);if(t==="c")this.onSecondaryControl_(s);else if(t==="d")this.pendingDataMessages.push(s);else throw new Error("Unknown protocol layer: "+t)}upgradeIfSecondaryHealthy_(){this.secondaryResponsesRequired_<=0?(this.log_("Secondary connection is healthy."),this.isHealthy_=!0,this.secondaryConn_.markConnectionHealthy(),this.proceedWithUpgrade_()):(this.log_("sending ping on secondary."),this.secondaryConn_.send({t:"c",d:{t:Uf,d:{}}}))}proceedWithUpgrade_(){this.secondaryConn_.start(),this.log_("sending client ack on secondary"),this.secondaryConn_.send({t:"c",d:{t:Ff,d:{}}}),this.log_("Ending transmission on primary"),this.conn_.send({t:"c",d:{t:Bf,d:{}}}),this.tx_=this.secondaryConn_,this.tryCleanupConnection()}onPrimaryMessageReceived_(e){const t=bi("t",e),s=bi("d",e);t==="c"?this.onControl_(s):t==="d"&&this.onDataMessage_(s)}onDataMessage_(e){this.onPrimaryResponse_(),this.onMessage_(e)}onPrimaryResponse_(){this.isHealthy_||(this.primaryResponsesRequired_--,this.primaryResponsesRequired_<=0&&(this.log_("Primary connection is healthy."),this.isHealthy_=!0,this.conn_.markConnectionHealthy()))}onControl_(e){const t=bi(Tl,e);if(Of in e){const s=e[Of];if(t===yC){const i=Object.assign({},s);this.repoInfo_.isUsingEmulator&&(i.h=this.repoInfo_.host),this.onHandshake_(i)}else if(t===Bf){this.log_("recvd end transmission on primary"),this.rx_=this.secondaryConn_;for(let i=0;i<this.pendingDataMessages.length;++i)this.onDataMessage_(this.pendingDataMessages[i]);this.pendingDataMessages=[],this.tryCleanupConnection()}else t===gC?this.onConnectionShutdown_(s):t===Mf?this.onReset_(s):t===_C?lc("Server Error: "+s):t===Vf?(this.log_("got pong on primary."),this.onPrimaryResponse_(),this.sendPingOnPrimaryIfNecessary_()):lc("Unknown control packet command: "+t)}}onHandshake_(e){const t=e.ts,s=e.v,i=e.h;this.sessionId=e.s,this.repoInfo_.host=i,this.state_===0&&(this.conn_.start(),this.onConnectionEstablished_(this.conn_,t),Ph!==s&&ot("Protocol version mismatch detected"),this.tryStartUpgrade_())}tryStartUpgrade_(){const e=this.transportManager_.upgradeTransport();e&&this.startUpgrade_(e)}startUpgrade_(e){this.secondaryConn_=new e(this.nextTransportId_(),this.repoInfo_,this.applicationId_,this.appCheckToken_,this.authToken_,this.sessionId),this.secondaryResponsesRequired_=e.responsesRequiredToBeHealthy||0;const t=this.connReceiver_(this.secondaryConn_),s=this.disconnReceiver_(this.secondaryConn_);this.secondaryConn_.open(t,s),ji(()=>{this.secondaryConn_&&(this.log_("Timed out trying to upgrade."),this.secondaryConn_.close())},Math.floor(dC))}onReset_(e){this.log_("Reset packet received.  New host: "+e),this.repoInfo_.host=e,this.state_===1?this.close():(this.closeConnections_(),this.start_())}onConnectionEstablished_(e,t){this.log_("Realtime connection established."),this.conn_=e,this.state_=1,this.onReady_&&(this.onReady_(t,this.sessionId),this.onReady_=null),this.primaryResponsesRequired_===0?(this.log_("Primary connection is healthy."),this.isHealthy_=!0):ji(()=>{this.sendPingOnPrimaryIfNecessary_()},Math.floor(fC))}sendPingOnPrimaryIfNecessary_(){!this.isHealthy_&&this.state_===1&&(this.log_("sending ping on primary."),this.sendData_({t:"c",d:{t:Uf,d:{}}}))}onSecondaryConnectionLost_(){const e=this.secondaryConn_;this.secondaryConn_=null,(this.tx_===e||this.rx_===e)&&this.close()}onConnectionLost_(e){this.conn_=null,!e&&this.state_===0?(this.log_("Realtime connection failed."),this.repoInfo_.isCacheableHost()&&(Kn.remove("host:"+this.repoInfo_.host),this.repoInfo_.internalHost=this.repoInfo_.host)):this.state_===1&&this.log_("Realtime connection lost."),this.close()}onConnectionShutdown_(e){this.log_("Connection shutdown command received. Shutting down..."),this.onKill_&&(this.onKill_(e),this.onKill_=null),this.onDisconnect_=null,this.close()}sendData_(e){if(this.state_!==1)throw"Connection is not connected";this.tx_.send(e)}close(){this.state_!==2&&(this.log_("Closing realtime connection."),this.state_=2,this.closeConnections_(),this.onDisconnect_&&(this.onDisconnect_(),this.onDisconnect_=null))}closeConnections_(){this.log_("Shutting down all connections"),this.conn_&&(this.conn_.close(),this.conn_=null),this.secondaryConn_&&(this.secondaryConn_.close(),this.secondaryConn_=null),this.healthyTimeout_&&(clearTimeout(this.healthyTimeout_),this.healthyTimeout_=null)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class u_{put(e,t,s,i){}merge(e,t,s,i){}refreshAuthToken(e){}refreshAppCheckToken(e){}onDisconnectPut(e,t,s){}onDisconnectMerge(e,t,s){}onDisconnectCancel(e,t){}reportStats(e){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class d_{constructor(e){this.allowedEvents_=e,this.listeners_={},D(Array.isArray(e)&&e.length>0,"Requires a non-empty array")}trigger(e,...t){if(Array.isArray(this.listeners_[e])){const s=[...this.listeners_[e]];for(let i=0;i<s.length;i++)s[i].callback.apply(s[i].context,t)}}on(e,t,s){this.validateEventType_(e),this.listeners_[e]=this.listeners_[e]||[],this.listeners_[e].push({callback:t,context:s});const i=this.getInitialEvent(e);i&&t.apply(s,i)}off(e,t,s){this.validateEventType_(e);const i=this.listeners_[e]||[];for(let r=0;r<i.length;r++)if(i[r].callback===t&&(!s||s===i[r].context)){i.splice(r,1);return}}validateEventType_(e){D(this.allowedEvents_.find(t=>t===e),"Unknown event: "+e)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ko extends d_{constructor(){super(["online"]),this.online_=!0,typeof window<"u"&&typeof window.addEventListener<"u"&&!kc()&&(window.addEventListener("online",()=>{this.online_||(this.online_=!0,this.trigger("online",!0))},!1),window.addEventListener("offline",()=>{this.online_&&(this.online_=!1,this.trigger("online",!1))},!1))}static getInstance(){return new Ko}getInitialEvent(e){return D(e==="online","Unknown event type: "+e),[this.online_]}currentlyOnline(){return this.online_}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const qf=32,Wf=768;class he{constructor(e,t){if(t===void 0){this.pieces_=e.split("/");let s=0;for(let i=0;i<this.pieces_.length;i++)this.pieces_[i].length>0&&(this.pieces_[s]=this.pieces_[i],s++);this.pieces_.length=s,this.pieceNum_=0}else this.pieces_=e,this.pieceNum_=t}toString(){let e="";for(let t=this.pieceNum_;t<this.pieces_.length;t++)this.pieces_[t]!==""&&(e+="/"+this.pieces_[t]);return e||"/"}}function le(){return new he("")}function X(n){return n.pieceNum_>=n.pieces_.length?null:n.pieces_[n.pieceNum_]}function On(n){return n.pieces_.length-n.pieceNum_}function _e(n){let e=n.pieceNum_;return e<n.pieces_.length&&e++,new he(n.pieces_,e)}function Lh(n){return n.pieceNum_<n.pieces_.length?n.pieces_[n.pieces_.length-1]:null}function EC(n){let e="";for(let t=n.pieceNum_;t<n.pieces_.length;t++)n.pieces_[t]!==""&&(e+="/"+encodeURIComponent(String(n.pieces_[t])));return e||"/"}function or(n,e=0){return n.pieces_.slice(n.pieceNum_+e)}function f_(n){if(n.pieceNum_>=n.pieces_.length)return null;const e=[];for(let t=n.pieceNum_;t<n.pieces_.length-1;t++)e.push(n.pieces_[t]);return new he(e,0)}function Ie(n,e){const t=[];for(let s=n.pieceNum_;s<n.pieces_.length;s++)t.push(n.pieces_[s]);if(e instanceof he)for(let s=e.pieceNum_;s<e.pieces_.length;s++)t.push(e.pieces_[s]);else{const s=e.split("/");for(let i=0;i<s.length;i++)s[i].length>0&&t.push(s[i])}return new he(t,0)}function Z(n){return n.pieceNum_>=n.pieces_.length}function rt(n,e){const t=X(n),s=X(e);if(t===null)return e;if(t===s)return rt(_e(n),_e(e));throw new Error("INTERNAL ERROR: innerPath ("+e+") is not within outerPath ("+n+")")}function wC(n,e){const t=or(n,0),s=or(e,0);for(let i=0;i<t.length&&i<s.length;i++){const r=hs(t[i],s[i]);if(r!==0)return r}return t.length===s.length?0:t.length<s.length?-1:1}function xh(n,e){if(On(n)!==On(e))return!1;for(let t=n.pieceNum_,s=e.pieceNum_;t<=n.pieces_.length;t++,s++)if(n.pieces_[t]!==e.pieces_[s])return!1;return!0}function _t(n,e){let t=n.pieceNum_,s=e.pieceNum_;if(On(n)>On(e))return!1;for(;t<n.pieces_.length;){if(n.pieces_[t]!==e.pieces_[s])return!1;++t,++s}return!0}class TC{constructor(e,t){this.errorPrefix_=t,this.parts_=or(e,0),this.byteLength_=Math.max(1,this.parts_.length);for(let s=0;s<this.parts_.length;s++)this.byteLength_+=ca(this.parts_[s]);p_(this)}}function IC(n,e){n.parts_.length>0&&(n.byteLength_+=1),n.parts_.push(e),n.byteLength_+=ca(e),p_(n)}function bC(n){const e=n.parts_.pop();n.byteLength_-=ca(e),n.parts_.length>0&&(n.byteLength_-=1)}function p_(n){if(n.byteLength_>Wf)throw new Error(n.errorPrefix_+"has a key path longer than "+Wf+" bytes ("+n.byteLength_+").");if(n.parts_.length>qf)throw new Error(n.errorPrefix_+"path specified exceeds the maximum depth that can be written ("+qf+") or object contains a cycle "+Gn(n))}function Gn(n){return n.parts_.length===0?"":"in property '"+n.parts_.join(".")+"'"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Oh extends d_{constructor(){super(["visible"]);let e,t;typeof document<"u"&&typeof document.addEventListener<"u"&&(typeof document.hidden<"u"?(t="visibilitychange",e="hidden"):typeof document.mozHidden<"u"?(t="mozvisibilitychange",e="mozHidden"):typeof document.msHidden<"u"?(t="msvisibilitychange",e="msHidden"):typeof document.webkitHidden<"u"&&(t="webkitvisibilitychange",e="webkitHidden")),this.visible_=!0,t&&document.addEventListener(t,()=>{const s=!document[e];s!==this.visible_&&(this.visible_=s,this.trigger("visible",s))},!1)}static getInstance(){return new Oh}getInitialEvent(e){return D(e==="visible","Unknown event type: "+e),[this.visible_]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ci=1e3,CC=60*5*1e3,$f=30*1e3,RC=1.3,SC=3e4,AC="server_kill",jf=3;class Zt extends u_{constructor(e,t,s,i,r,o,l,c){if(super(),this.repoInfo_=e,this.applicationId_=t,this.onDataUpdate_=s,this.onConnectStatus_=i,this.onServerInfoUpdate_=r,this.authTokenProvider_=o,this.appCheckTokenProvider_=l,this.authOverride_=c,this.id=Zt.nextPersistentConnectionId_++,this.log_=Sr("p:"+this.id+":"),this.interruptReasons_={},this.listens=new Map,this.outstandingPuts_=[],this.outstandingGets_=[],this.outstandingPutCount_=0,this.outstandingGetCount_=0,this.onDisconnectRequestQueue_=[],this.connected_=!1,this.reconnectDelay_=Ci,this.maxReconnectDelay_=CC,this.securityDebugCallback_=null,this.lastSessionId=null,this.establishConnectionTimer_=null,this.visible_=!1,this.requestCBHash_={},this.requestNumber_=0,this.realtime_=null,this.authToken_=null,this.appCheckToken_=null,this.forceTokenRefresh_=!1,this.invalidAuthTokenCount_=0,this.invalidAppCheckTokenCount_=0,this.firstConnection_=!0,this.lastConnectionAttemptTime_=null,this.lastConnectionEstablishedTime_=null,c)throw new Error("Auth override specified in options, but not supported on non Node.js platforms");Oh.getInstance().on("visible",this.onVisible_,this),e.host.indexOf("fblocal")===-1&&Ko.getInstance().on("online",this.onOnline_,this)}sendRequest(e,t,s){const i=++this.requestNumber_,r={r:i,a:e,b:t};this.log_(De(r)),D(this.connected_,"sendRequest call when we're not connected not allowed."),this.realtime_.sendRequest(r),s&&(this.requestCBHash_[i]=s)}get(e){this.initConnection_();const t=new dr,i={action:"g",request:{p:e._path.toString(),q:e._queryObject},onComplete:o=>{const l=o.d;o.s==="ok"?t.resolve(l):t.reject(l)}};this.outstandingGets_.push(i),this.outstandingGetCount_++;const r=this.outstandingGets_.length-1;return this.connected_&&this.sendGet_(r),t.promise}listen(e,t,s,i){this.initConnection_();const r=e._queryIdentifier,o=e._path.toString();this.log_("Listen called for "+o+" "+r),this.listens.has(o)||this.listens.set(o,new Map),D(e._queryParams.isDefault()||!e._queryParams.loadsAllData(),"listen() called for non-default but complete query"),D(!this.listens.get(o).has(r),"listen() called twice for same path/queryId.");const l={onComplete:i,hashFn:t,query:e,tag:s};this.listens.get(o).set(r,l),this.connected_&&this.sendListen_(l)}sendGet_(e){const t=this.outstandingGets_[e];this.sendRequest("g",t.request,s=>{delete this.outstandingGets_[e],this.outstandingGetCount_--,this.outstandingGetCount_===0&&(this.outstandingGets_=[]),t.onComplete&&t.onComplete(s)})}sendListen_(e){const t=e.query,s=t._path.toString(),i=t._queryIdentifier;this.log_("Listen on "+s+" for "+i);const r={p:s},o="q";e.tag&&(r.q=t._queryObject,r.t=e.tag),r.h=e.hashFn(),this.sendRequest(o,r,l=>{const c=l.d,h=l.s;Zt.warnOnListenWarnings_(c,t),(this.listens.get(s)&&this.listens.get(s).get(i))===e&&(this.log_("listen response",l),h!=="ok"&&this.removeListen_(s,i),e.onComplete&&e.onComplete(h,c))})}static warnOnListenWarnings_(e,t){if(e&&typeof e=="object"&&Bt(e,"w")){const s=Os(e,"w");if(Array.isArray(s)&&~s.indexOf("no_index")){const i='".indexOn": "'+t._queryParams.getIndex().toString()+'"',r=t._path.toString();ot(`Using an unspecified index. Your data will be downloaded and filtered on the client. Consider adding ${i} at ${r} to your security rules for better performance.`)}}}refreshAuthToken(e){this.authToken_=e,this.log_("Auth token refreshed"),this.authToken_?this.tryAuth():this.connected_&&this.sendRequest("unauth",{},()=>{}),this.reduceReconnectDelayIfAdminCredential_(e)}reduceReconnectDelayIfAdminCredential_(e){(e&&e.length===40||pv(e))&&(this.log_("Admin auth credential detected.  Reducing max reconnect time."),this.maxReconnectDelay_=$f)}refreshAppCheckToken(e){this.appCheckToken_=e,this.log_("App check token refreshed"),this.appCheckToken_?this.tryAppCheck():this.connected_&&this.sendRequest("unappeck",{},()=>{})}tryAuth(){if(this.connected_&&this.authToken_){const e=this.authToken_,t=fv(e)?"auth":"gauth",s={cred:e};this.authOverride_===null?s.noauth=!0:typeof this.authOverride_=="object"&&(s.authvar=this.authOverride_),this.sendRequest(t,s,i=>{const r=i.s,o=i.d||"error";this.authToken_===e&&(r==="ok"?this.invalidAuthTokenCount_=0:this.onAuthRevoked_(r,o))})}}tryAppCheck(){this.connected_&&this.appCheckToken_&&this.sendRequest("appcheck",{token:this.appCheckToken_},e=>{const t=e.s,s=e.d||"error";t==="ok"?this.invalidAppCheckTokenCount_=0:this.onAppCheckRevoked_(t,s)})}unlisten(e,t){const s=e._path.toString(),i=e._queryIdentifier;this.log_("Unlisten called for "+s+" "+i),D(e._queryParams.isDefault()||!e._queryParams.loadsAllData(),"unlisten() called for non-default but complete query"),this.removeListen_(s,i)&&this.connected_&&this.sendUnlisten_(s,i,e._queryObject,t)}sendUnlisten_(e,t,s,i){this.log_("Unlisten on "+e+" for "+t);const r={p:e},o="n";i&&(r.q=s,r.t=i),this.sendRequest(o,r)}onDisconnectPut(e,t,s){this.initConnection_(),this.connected_?this.sendOnDisconnect_("o",e,t,s):this.onDisconnectRequestQueue_.push({pathString:e,action:"o",data:t,onComplete:s})}onDisconnectMerge(e,t,s){this.initConnection_(),this.connected_?this.sendOnDisconnect_("om",e,t,s):this.onDisconnectRequestQueue_.push({pathString:e,action:"om",data:t,onComplete:s})}onDisconnectCancel(e,t){this.initConnection_(),this.connected_?this.sendOnDisconnect_("oc",e,null,t):this.onDisconnectRequestQueue_.push({pathString:e,action:"oc",data:null,onComplete:t})}sendOnDisconnect_(e,t,s,i){const r={p:t,d:s};this.log_("onDisconnect "+e,r),this.sendRequest(e,r,o=>{i&&setTimeout(()=>{i(o.s,o.d)},Math.floor(0))})}put(e,t,s,i){this.putInternal("p",e,t,s,i)}merge(e,t,s,i){this.putInternal("m",e,t,s,i)}putInternal(e,t,s,i,r){this.initConnection_();const o={p:t,d:s};r!==void 0&&(o.h=r),this.outstandingPuts_.push({action:e,request:o,onComplete:i}),this.outstandingPutCount_++;const l=this.outstandingPuts_.length-1;this.connected_?this.sendPut_(l):this.log_("Buffering put: "+t)}sendPut_(e){const t=this.outstandingPuts_[e].action,s=this.outstandingPuts_[e].request,i=this.outstandingPuts_[e].onComplete;this.outstandingPuts_[e].queued=this.connected_,this.sendRequest(t,s,r=>{this.log_(t+" response",r),delete this.outstandingPuts_[e],this.outstandingPutCount_--,this.outstandingPutCount_===0&&(this.outstandingPuts_=[]),i&&i(r.s,r.d)})}reportStats(e){if(this.connected_){const t={c:e};this.log_("reportStats",t),this.sendRequest("s",t,s=>{if(s.s!=="ok"){const r=s.d;this.log_("reportStats","Error sending stats: "+r)}})}}onDataMessage_(e){if("r"in e){this.log_("from server: "+De(e));const t=e.r,s=this.requestCBHash_[t];s&&(delete this.requestCBHash_[t],s(e.b))}else{if("error"in e)throw"A server-side error has occurred: "+e.error;"a"in e&&this.onDataPush_(e.a,e.b)}}onDataPush_(e,t){this.log_("handleServerMessage",e,t),e==="d"?this.onDataUpdate_(t.p,t.d,!1,t.t):e==="m"?this.onDataUpdate_(t.p,t.d,!0,t.t):e==="c"?this.onListenRevoked_(t.p,t.q):e==="ac"?this.onAuthRevoked_(t.s,t.d):e==="apc"?this.onAppCheckRevoked_(t.s,t.d):e==="sd"?this.onSecurityDebugPacket_(t):lc("Unrecognized action received from server: "+De(e)+`
Are you using the latest client?`)}onReady_(e,t){this.log_("connection ready"),this.connected_=!0,this.lastConnectionEstablishedTime_=new Date().getTime(),this.handleTimestamp_(e),this.lastSessionId=t,this.firstConnection_&&this.sendConnectStats_(),this.restoreState_(),this.firstConnection_=!1,this.onConnectStatus_(!0)}scheduleConnect_(e){D(!this.realtime_,"Scheduling a connect when we're already connected/ing?"),this.establishConnectionTimer_&&clearTimeout(this.establishConnectionTimer_),this.establishConnectionTimer_=setTimeout(()=>{this.establishConnectionTimer_=null,this.establishConnection_()},Math.floor(e))}initConnection_(){!this.realtime_&&this.firstConnection_&&this.scheduleConnect_(0)}onVisible_(e){e&&!this.visible_&&this.reconnectDelay_===this.maxReconnectDelay_&&(this.log_("Window became visible.  Reducing delay."),this.reconnectDelay_=Ci,this.realtime_||this.scheduleConnect_(0)),this.visible_=e}onOnline_(e){e?(this.log_("Browser went online."),this.reconnectDelay_=Ci,this.realtime_||this.scheduleConnect_(0)):(this.log_("Browser went offline.  Killing connection."),this.realtime_&&this.realtime_.close())}onRealtimeDisconnect_(){if(this.log_("data client disconnected"),this.connected_=!1,this.realtime_=null,this.cancelSentTransactions_(),this.requestCBHash_={},this.shouldReconnect_()){this.visible_?this.lastConnectionEstablishedTime_&&(new Date().getTime()-this.lastConnectionEstablishedTime_>SC&&(this.reconnectDelay_=Ci),this.lastConnectionEstablishedTime_=null):(this.log_("Window isn't visible.  Delaying reconnect."),this.reconnectDelay_=this.maxReconnectDelay_,this.lastConnectionAttemptTime_=new Date().getTime());const e=new Date().getTime()-this.lastConnectionAttemptTime_;let t=Math.max(0,this.reconnectDelay_-e);t=Math.random()*t,this.log_("Trying to reconnect in "+t+"ms"),this.scheduleConnect_(t),this.reconnectDelay_=Math.min(this.maxReconnectDelay_,this.reconnectDelay_*RC)}this.onConnectStatus_(!1)}async establishConnection_(){if(this.shouldReconnect_()){this.log_("Making a connection attempt"),this.lastConnectionAttemptTime_=new Date().getTime(),this.lastConnectionEstablishedTime_=null;const e=this.onDataMessage_.bind(this),t=this.onReady_.bind(this),s=this.onRealtimeDisconnect_.bind(this),i=this.id+":"+Zt.nextConnectionId_++,r=this.lastSessionId;let o=!1,l=null;const c=function(){l?l.close():(o=!0,s())},h=function(p){D(l,"sendRequest call when we're not connected not allowed."),l.sendRequest(p)};this.realtime_={close:c,sendRequest:h};const d=this.forceTokenRefresh_;this.forceTokenRefresh_=!1;try{const[p,m]=await Promise.all([this.authTokenProvider_.getToken(d),this.appCheckTokenProvider_.getToken(d)]);o?qe("getToken() completed but was canceled"):(qe("getToken() completed. Creating connection."),this.authToken_=p&&p.accessToken,this.appCheckToken_=m&&m.token,l=new vC(i,this.repoInfo_,this.applicationId_,this.appCheckToken_,this.authToken_,e,t,s,E=>{ot(E+" ("+this.repoInfo_.toString()+")"),this.interrupt(AC)},r))}catch(p){this.log_("Failed to get token: "+p),o||(this.repoInfo_.nodeAdmin&&ot(p),c())}}}interrupt(e){qe("Interrupting connection for reason: "+e),this.interruptReasons_[e]=!0,this.realtime_?this.realtime_.close():(this.establishConnectionTimer_&&(clearTimeout(this.establishConnectionTimer_),this.establishConnectionTimer_=null),this.connected_&&this.onRealtimeDisconnect_())}resume(e){qe("Resuming connection for reason: "+e),delete this.interruptReasons_[e],Fl(this.interruptReasons_)&&(this.reconnectDelay_=Ci,this.realtime_||this.scheduleConnect_(0))}handleTimestamp_(e){const t=e-new Date().getTime();this.onServerInfoUpdate_({serverTimeOffset:t})}cancelSentTransactions_(){for(let e=0;e<this.outstandingPuts_.length;e++){const t=this.outstandingPuts_[e];t&&"h"in t.request&&t.queued&&(t.onComplete&&t.onComplete("disconnect"),delete this.outstandingPuts_[e],this.outstandingPutCount_--)}this.outstandingPutCount_===0&&(this.outstandingPuts_=[])}onListenRevoked_(e,t){let s;t?s=t.map(r=>kh(r)).join("$"):s="default";const i=this.removeListen_(e,s);i&&i.onComplete&&i.onComplete("permission_denied")}removeListen_(e,t){const s=new he(e).toString();let i;if(this.listens.has(s)){const r=this.listens.get(s);i=r.get(t),r.delete(t),r.size===0&&this.listens.delete(s)}else i=void 0;return i}onAuthRevoked_(e,t){qe("Auth token revoked: "+e+"/"+t),this.authToken_=null,this.forceTokenRefresh_=!0,this.realtime_.close(),(e==="invalid_token"||e==="permission_denied")&&(this.invalidAuthTokenCount_++,this.invalidAuthTokenCount_>=jf&&(this.reconnectDelay_=$f,this.authTokenProvider_.notifyForInvalidToken()))}onAppCheckRevoked_(e,t){qe("App check token revoked: "+e+"/"+t),this.appCheckToken_=null,this.forceTokenRefresh_=!0,(e==="invalid_token"||e==="permission_denied")&&(this.invalidAppCheckTokenCount_++,this.invalidAppCheckTokenCount_>=jf&&this.appCheckTokenProvider_.notifyForInvalidToken())}onSecurityDebugPacket_(e){this.securityDebugCallback_?this.securityDebugCallback_(e):"msg"in e&&console.log("FIREBASE: "+e.msg.replace(`
`,`
FIREBASE: `))}restoreState_(){this.tryAuth(),this.tryAppCheck();for(const e of this.listens.values())for(const t of e.values())this.sendListen_(t);for(let e=0;e<this.outstandingPuts_.length;e++)this.outstandingPuts_[e]&&this.sendPut_(e);for(;this.onDisconnectRequestQueue_.length;){const e=this.onDisconnectRequestQueue_.shift();this.sendOnDisconnect_(e.action,e.pathString,e.data,e.onComplete)}for(let e=0;e<this.outstandingGets_.length;e++)this.outstandingGets_[e]&&this.sendGet_(e)}sendConnectStats_(){const e={};let t="js";e["sdk."+t+"."+jg.replace(/\./g,"-")]=1,kc()?e["framework.cordova"]=1:Op()&&(e["framework.reactnative"]=1),this.reportStats(e)}shouldReconnect_(){const e=Ko.getInstance().currentlyOnline();return Fl(this.interruptReasons_)&&e}}Zt.nextPersistentConnectionId_=0;Zt.nextConnectionId_=0;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ee{constructor(e,t){this.name=e,this.node=t}static Wrap(e,t){return new ee(e,t)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Pa{getCompare(){return this.compare.bind(this)}indexedValueChanged(e,t){const s=new ee(is,e),i=new ee(is,t);return this.compare(s,i)!==0}minPost(){return ee.MIN}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let oo;class m_ extends Pa{static get __EMPTY_NODE(){return oo}static set __EMPTY_NODE(e){oo=e}compare(e,t){return hs(e.name,t.name)}isDefinedOn(e){throw Qs("KeyIndex.isDefinedOn not expected to be called.")}indexedValueChanged(e,t){return!1}minPost(){return ee.MIN}maxPost(){return new ee(xn,oo)}makePost(e,t){return D(typeof e=="string","KeyIndex indexValue must always be a string."),new ee(e,oo)}toString(){return".key"}}const Jn=new m_;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ao{constructor(e,t,s,i,r=null){this.isReverse_=i,this.resultGenerator_=r,this.nodeStack_=[];let o=1;for(;!e.isEmpty();)if(e=e,o=t?s(e.key,t):1,i&&(o*=-1),o<0)this.isReverse_?e=e.left:e=e.right;else if(o===0){this.nodeStack_.push(e);break}else this.nodeStack_.push(e),this.isReverse_?e=e.right:e=e.left}getNext(){if(this.nodeStack_.length===0)return null;let e=this.nodeStack_.pop(),t;if(this.resultGenerator_?t=this.resultGenerator_(e.key,e.value):t={key:e.key,value:e.value},this.isReverse_)for(e=e.left;!e.isEmpty();)this.nodeStack_.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack_.push(e),e=e.left;return t}hasNext(){return this.nodeStack_.length>0}peek(){if(this.nodeStack_.length===0)return null;const e=this.nodeStack_[this.nodeStack_.length-1];return this.resultGenerator_?this.resultGenerator_(e.key,e.value):{key:e.key,value:e.value}}}class Ve{constructor(e,t,s,i,r){this.key=e,this.value=t,this.color=s??Ve.RED,this.left=i??ut.EMPTY_NODE,this.right=r??ut.EMPTY_NODE}copy(e,t,s,i,r){return new Ve(e??this.key,t??this.value,s??this.color,i??this.left,r??this.right)}count(){return this.left.count()+1+this.right.count()}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||!!e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min_(){return this.left.isEmpty()?this:this.left.min_()}minKey(){return this.min_().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,t,s){let i=this;const r=s(e,i.key);return r<0?i=i.copy(null,null,null,i.left.insert(e,t,s),null):r===0?i=i.copy(null,t,null,null,null):i=i.copy(null,null,null,null,i.right.insert(e,t,s)),i.fixUp_()}removeMin_(){if(this.left.isEmpty())return ut.EMPTY_NODE;let e=this;return!e.left.isRed_()&&!e.left.left.isRed_()&&(e=e.moveRedLeft_()),e=e.copy(null,null,null,e.left.removeMin_(),null),e.fixUp_()}remove(e,t){let s,i;if(s=this,t(e,s.key)<0)!s.left.isEmpty()&&!s.left.isRed_()&&!s.left.left.isRed_()&&(s=s.moveRedLeft_()),s=s.copy(null,null,null,s.left.remove(e,t),null);else{if(s.left.isRed_()&&(s=s.rotateRight_()),!s.right.isEmpty()&&!s.right.isRed_()&&!s.right.left.isRed_()&&(s=s.moveRedRight_()),t(e,s.key)===0){if(s.right.isEmpty())return ut.EMPTY_NODE;i=s.right.min_(),s=s.copy(i.key,i.value,null,null,s.right.removeMin_())}s=s.copy(null,null,null,null,s.right.remove(e,t))}return s.fixUp_()}isRed_(){return this.color}fixUp_(){let e=this;return e.right.isRed_()&&!e.left.isRed_()&&(e=e.rotateLeft_()),e.left.isRed_()&&e.left.left.isRed_()&&(e=e.rotateRight_()),e.left.isRed_()&&e.right.isRed_()&&(e=e.colorFlip_()),e}moveRedLeft_(){let e=this.colorFlip_();return e.right.left.isRed_()&&(e=e.copy(null,null,null,null,e.right.rotateRight_()),e=e.rotateLeft_(),e=e.colorFlip_()),e}moveRedRight_(){let e=this.colorFlip_();return e.left.left.isRed_()&&(e=e.rotateRight_(),e=e.colorFlip_()),e}rotateLeft_(){const e=this.copy(null,null,Ve.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight_(){const e=this.copy(null,null,Ve.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip_(){const e=this.left.copy(null,null,!this.left.color,null,null),t=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,t)}checkMaxDepth_(){const e=this.check_();return Math.pow(2,e)<=this.count()+1}check_(){if(this.isRed_()&&this.left.isRed_())throw new Error("Red node has red child("+this.key+","+this.value+")");if(this.right.isRed_())throw new Error("Right child of ("+this.key+","+this.value+") is red");const e=this.left.check_();if(e!==this.right.check_())throw new Error("Black depths differ");return e+(this.isRed_()?0:1)}}Ve.RED=!0;Ve.BLACK=!1;class kC{copy(e,t,s,i,r){return this}insert(e,t,s){return new Ve(e,t,null)}remove(e,t){return this}count(){return 0}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}check_(){return 0}isRed_(){return!1}}class ut{constructor(e,t=ut.EMPTY_NODE){this.comparator_=e,this.root_=t}insert(e,t){return new ut(this.comparator_,this.root_.insert(e,t,this.comparator_).copy(null,null,Ve.BLACK,null,null))}remove(e){return new ut(this.comparator_,this.root_.remove(e,this.comparator_).copy(null,null,Ve.BLACK,null,null))}get(e){let t,s=this.root_;for(;!s.isEmpty();){if(t=this.comparator_(e,s.key),t===0)return s.value;t<0?s=s.left:t>0&&(s=s.right)}return null}getPredecessorKey(e){let t,s=this.root_,i=null;for(;!s.isEmpty();)if(t=this.comparator_(e,s.key),t===0){if(s.left.isEmpty())return i?i.key:null;for(s=s.left;!s.right.isEmpty();)s=s.right;return s.key}else t<0?s=s.left:t>0&&(i=s,s=s.right);throw new Error("Attempted to find predecessor key for a nonexistent key.  What gives?")}isEmpty(){return this.root_.isEmpty()}count(){return this.root_.count()}minKey(){return this.root_.minKey()}maxKey(){return this.root_.maxKey()}inorderTraversal(e){return this.root_.inorderTraversal(e)}reverseTraversal(e){return this.root_.reverseTraversal(e)}getIterator(e){return new ao(this.root_,null,this.comparator_,!1,e)}getIteratorFrom(e,t){return new ao(this.root_,e,this.comparator_,!1,t)}getReverseIteratorFrom(e,t){return new ao(this.root_,e,this.comparator_,!0,t)}getReverseIterator(e){return new ao(this.root_,null,this.comparator_,!0,e)}}ut.EMPTY_NODE=new kC;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function PC(n,e){return hs(n.name,e.name)}function Mh(n,e){return hs(n,e)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let hc;function NC(n){hc=n}const g_=function(n){return typeof n=="number"?"number:"+Kg(n):"string:"+n},__=function(n){if(n.isLeafNode()){const e=n.val();D(typeof e=="string"||typeof e=="number"||typeof e=="object"&&Bt(e,".sv"),"Priority must be a string or number.")}else D(n===hc||n.isEmpty(),"priority of unexpected type.");D(n===hc||n.getPriority().isEmpty(),"Priority nodes can't have a priority of their own.")};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Gf;class Oe{constructor(e,t=Oe.__childrenNodeConstructor.EMPTY_NODE){this.value_=e,this.priorityNode_=t,this.lazyHash_=null,D(this.value_!==void 0&&this.value_!==null,"LeafNode shouldn't be created with null/undefined value."),__(this.priorityNode_)}static set __childrenNodeConstructor(e){Gf=e}static get __childrenNodeConstructor(){return Gf}isLeafNode(){return!0}getPriority(){return this.priorityNode_}updatePriority(e){return new Oe(this.value_,e)}getImmediateChild(e){return e===".priority"?this.priorityNode_:Oe.__childrenNodeConstructor.EMPTY_NODE}getChild(e){return Z(e)?this:X(e)===".priority"?this.priorityNode_:Oe.__childrenNodeConstructor.EMPTY_NODE}hasChild(){return!1}getPredecessorChildName(e,t){return null}updateImmediateChild(e,t){return e===".priority"?this.updatePriority(t):t.isEmpty()&&e!==".priority"?this:Oe.__childrenNodeConstructor.EMPTY_NODE.updateImmediateChild(e,t).updatePriority(this.priorityNode_)}updateChild(e,t){const s=X(e);return s===null?t:t.isEmpty()&&s!==".priority"?this:(D(s!==".priority"||On(e)===1,".priority must be the last token in a path"),this.updateImmediateChild(s,Oe.__childrenNodeConstructor.EMPTY_NODE.updateChild(_e(e),t)))}isEmpty(){return!1}numChildren(){return 0}forEachChild(e,t){return!1}val(e){return e&&!this.getPriority().isEmpty()?{".value":this.getValue(),".priority":this.getPriority().val()}:this.getValue()}hash(){if(this.lazyHash_===null){let e="";this.priorityNode_.isEmpty()||(e+="priority:"+g_(this.priorityNode_.val())+":");const t=typeof this.value_;e+=t+":",t==="number"?e+=Kg(this.value_):e+=this.value_,this.lazyHash_=zg(e)}return this.lazyHash_}getValue(){return this.value_}compareTo(e){return e===Oe.__childrenNodeConstructor.EMPTY_NODE?1:e instanceof Oe.__childrenNodeConstructor?-1:(D(e.isLeafNode(),"Unknown node type"),this.compareToLeafNode_(e))}compareToLeafNode_(e){const t=typeof e.value_,s=typeof this.value_,i=Oe.VALUE_TYPE_ORDER.indexOf(t),r=Oe.VALUE_TYPE_ORDER.indexOf(s);return D(i>=0,"Unknown leaf type: "+t),D(r>=0,"Unknown leaf type: "+s),i===r?s==="object"?0:this.value_<e.value_?-1:this.value_===e.value_?0:1:r-i}withIndex(){return this}isIndexed(){return!0}equals(e){if(e===this)return!0;if(e.isLeafNode()){const t=e;return this.value_===t.value_&&this.priorityNode_.equals(t.priorityNode_)}else return!1}}Oe.VALUE_TYPE_ORDER=["object","boolean","number","string"];/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let y_,v_;function DC(n){y_=n}function LC(n){v_=n}class xC extends Pa{compare(e,t){const s=e.node.getPriority(),i=t.node.getPriority(),r=s.compareTo(i);return r===0?hs(e.name,t.name):r}isDefinedOn(e){return!e.getPriority().isEmpty()}indexedValueChanged(e,t){return!e.getPriority().equals(t.getPriority())}minPost(){return ee.MIN}maxPost(){return new ee(xn,new Oe("[PRIORITY-POST]",v_))}makePost(e,t){const s=y_(e);return new ee(t,new Oe("[PRIORITY-POST]",s))}toString(){return".priority"}}const Ee=new xC;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const OC=Math.log(2);class MC{constructor(e){const t=r=>parseInt(Math.log(r)/OC,10),s=r=>parseInt(Array(r+1).join("1"),2);this.count=t(e+1),this.current_=this.count-1;const i=s(this.count);this.bits_=e+1&i}nextBitIsOne(){const e=!(this.bits_&1<<this.current_);return this.current_--,e}}const Qo=function(n,e,t,s){n.sort(e);const i=function(c,h){const d=h-c;let p,m;if(d===0)return null;if(d===1)return p=n[c],m=t?t(p):p,new Ve(m,p.node,Ve.BLACK,null,null);{const E=parseInt(d/2,10)+c,R=i(c,E),A=i(E+1,h);return p=n[E],m=t?t(p):p,new Ve(m,p.node,Ve.BLACK,R,A)}},r=function(c){let h=null,d=null,p=n.length;const m=function(R,A){const P=p-R,V=p;p-=R;const U=i(P+1,V),q=n[P],J=t?t(q):q;E(new Ve(J,q.node,A,null,U))},E=function(R){h?(h.left=R,h=R):(d=R,h=R)};for(let R=0;R<c.count;++R){const A=c.nextBitIsOne(),P=Math.pow(2,c.count-(R+1));A?m(P,Ve.BLACK):(m(P,Ve.BLACK),m(P,Ve.RED))}return d},o=new MC(n.length),l=r(o);return new ut(s||e,l)};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Il;const Ts={};class Xt{constructor(e,t){this.indexes_=e,this.indexSet_=t}static get Default(){return D(Ts&&Ee,"ChildrenNode.ts has not been loaded"),Il=Il||new Xt({".priority":Ts},{".priority":Ee}),Il}get(e){const t=Os(this.indexes_,e);if(!t)throw new Error("No index defined for "+e);return t instanceof ut?t:null}hasIndex(e){return Bt(this.indexSet_,e.toString())}addIndex(e,t){D(e!==Jn,"KeyIndex always exists and isn't meant to be added to the IndexMap.");const s=[];let i=!1;const r=t.getIterator(ee.Wrap);let o=r.getNext();for(;o;)i=i||e.isDefinedOn(o.node),s.push(o),o=r.getNext();let l;i?l=Qo(s,e.getCompare()):l=Ts;const c=e.toString(),h=Object.assign({},this.indexSet_);h[c]=e;const d=Object.assign({},this.indexes_);return d[c]=l,new Xt(d,h)}addToIndexes(e,t){const s=Ao(this.indexes_,(i,r)=>{const o=Os(this.indexSet_,r);if(D(o,"Missing index implementation for "+r),i===Ts)if(o.isDefinedOn(e.node)){const l=[],c=t.getIterator(ee.Wrap);let h=c.getNext();for(;h;)h.name!==e.name&&l.push(h),h=c.getNext();return l.push(e),Qo(l,o.getCompare())}else return Ts;else{const l=t.get(e.name);let c=i;return l&&(c=c.remove(new ee(e.name,l))),c.insert(e,e.node)}});return new Xt(s,this.indexSet_)}removeFromIndexes(e,t){const s=Ao(this.indexes_,i=>{if(i===Ts)return i;{const r=t.get(e.name);return r?i.remove(new ee(e.name,r)):i}});return new Xt(s,this.indexSet_)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Ri;class z{constructor(e,t,s){this.children_=e,this.priorityNode_=t,this.indexMap_=s,this.lazyHash_=null,this.priorityNode_&&__(this.priorityNode_),this.children_.isEmpty()&&D(!this.priorityNode_||this.priorityNode_.isEmpty(),"An empty node cannot have a priority")}static get EMPTY_NODE(){return Ri||(Ri=new z(new ut(Mh),null,Xt.Default))}isLeafNode(){return!1}getPriority(){return this.priorityNode_||Ri}updatePriority(e){return this.children_.isEmpty()?this:new z(this.children_,e,this.indexMap_)}getImmediateChild(e){if(e===".priority")return this.getPriority();{const t=this.children_.get(e);return t===null?Ri:t}}getChild(e){const t=X(e);return t===null?this:this.getImmediateChild(t).getChild(_e(e))}hasChild(e){return this.children_.get(e)!==null}updateImmediateChild(e,t){if(D(t,"We should always be passing snapshot nodes"),e===".priority")return this.updatePriority(t);{const s=new ee(e,t);let i,r;t.isEmpty()?(i=this.children_.remove(e),r=this.indexMap_.removeFromIndexes(s,this.children_)):(i=this.children_.insert(e,t),r=this.indexMap_.addToIndexes(s,this.children_));const o=i.isEmpty()?Ri:this.priorityNode_;return new z(i,o,r)}}updateChild(e,t){const s=X(e);if(s===null)return t;{D(X(e)!==".priority"||On(e)===1,".priority must be the last token in a path");const i=this.getImmediateChild(s).updateChild(_e(e),t);return this.updateImmediateChild(s,i)}}isEmpty(){return this.children_.isEmpty()}numChildren(){return this.children_.count()}val(e){if(this.isEmpty())return null;const t={};let s=0,i=0,r=!0;if(this.forEachChild(Ee,(o,l)=>{t[o]=l.val(e),s++,r&&z.INTEGER_REGEXP_.test(o)?i=Math.max(i,Number(o)):r=!1}),!e&&r&&i<2*s){const o=[];for(const l in t)o[l]=t[l];return o}else return e&&!this.getPriority().isEmpty()&&(t[".priority"]=this.getPriority().val()),t}hash(){if(this.lazyHash_===null){let e="";this.getPriority().isEmpty()||(e+="priority:"+g_(this.getPriority().val())+":"),this.forEachChild(Ee,(t,s)=>{const i=s.hash();i!==""&&(e+=":"+t+":"+i)}),this.lazyHash_=e===""?"":zg(e)}return this.lazyHash_}getPredecessorChildName(e,t,s){const i=this.resolveIndex_(s);if(i){const r=i.getPredecessorKey(new ee(e,t));return r?r.name:null}else return this.children_.getPredecessorKey(e)}getFirstChildName(e){const t=this.resolveIndex_(e);if(t){const s=t.minKey();return s&&s.name}else return this.children_.minKey()}getFirstChild(e){const t=this.getFirstChildName(e);return t?new ee(t,this.children_.get(t)):null}getLastChildName(e){const t=this.resolveIndex_(e);if(t){const s=t.maxKey();return s&&s.name}else return this.children_.maxKey()}getLastChild(e){const t=this.getLastChildName(e);return t?new ee(t,this.children_.get(t)):null}forEachChild(e,t){const s=this.resolveIndex_(e);return s?s.inorderTraversal(i=>t(i.name,i.node)):this.children_.inorderTraversal(t)}getIterator(e){return this.getIteratorFrom(e.minPost(),e)}getIteratorFrom(e,t){const s=this.resolveIndex_(t);if(s)return s.getIteratorFrom(e,i=>i);{const i=this.children_.getIteratorFrom(e.name,ee.Wrap);let r=i.peek();for(;r!=null&&t.compare(r,e)<0;)i.getNext(),r=i.peek();return i}}getReverseIterator(e){return this.getReverseIteratorFrom(e.maxPost(),e)}getReverseIteratorFrom(e,t){const s=this.resolveIndex_(t);if(s)return s.getReverseIteratorFrom(e,i=>i);{const i=this.children_.getReverseIteratorFrom(e.name,ee.Wrap);let r=i.peek();for(;r!=null&&t.compare(r,e)>0;)i.getNext(),r=i.peek();return i}}compareTo(e){return this.isEmpty()?e.isEmpty()?0:-1:e.isLeafNode()||e.isEmpty()?1:e===Ar?-1:0}withIndex(e){if(e===Jn||this.indexMap_.hasIndex(e))return this;{const t=this.indexMap_.addIndex(e,this.children_);return new z(this.children_,this.priorityNode_,t)}}isIndexed(e){return e===Jn||this.indexMap_.hasIndex(e)}equals(e){if(e===this)return!0;if(e.isLeafNode())return!1;{const t=e;if(this.getPriority().equals(t.getPriority()))if(this.children_.count()===t.children_.count()){const s=this.getIterator(Ee),i=t.getIterator(Ee);let r=s.getNext(),o=i.getNext();for(;r&&o;){if(r.name!==o.name||!r.node.equals(o.node))return!1;r=s.getNext(),o=i.getNext()}return r===null&&o===null}else return!1;else return!1}}resolveIndex_(e){return e===Jn?null:this.indexMap_.get(e.toString())}}z.INTEGER_REGEXP_=/^(0|[1-9]\d*)$/;class VC extends z{constructor(){super(new ut(Mh),z.EMPTY_NODE,Xt.Default)}compareTo(e){return e===this?0:1}equals(e){return e===this}getPriority(){return this}getImmediateChild(e){return z.EMPTY_NODE}isEmpty(){return!1}}const Ar=new VC;Object.defineProperties(ee,{MIN:{value:new ee(is,z.EMPTY_NODE)},MAX:{value:new ee(xn,Ar)}});m_.__EMPTY_NODE=z.EMPTY_NODE;Oe.__childrenNodeConstructor=z;NC(Ar);LC(Ar);/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const FC=!0;function Ne(n,e=null){if(n===null)return z.EMPTY_NODE;if(typeof n=="object"&&".priority"in n&&(e=n[".priority"]),D(e===null||typeof e=="string"||typeof e=="number"||typeof e=="object"&&".sv"in e,"Invalid priority type found: "+typeof e),typeof n=="object"&&".value"in n&&n[".value"]!==null&&(n=n[".value"]),typeof n!="object"||".sv"in n){const t=n;return new Oe(t,Ne(e))}if(!(n instanceof Array)&&FC){const t=[];let s=!1;if(Ge(n,(o,l)=>{if(o.substring(0,1)!=="."){const c=Ne(l);c.isEmpty()||(s=s||!c.getPriority().isEmpty(),t.push(new ee(o,c)))}}),t.length===0)return z.EMPTY_NODE;const r=Qo(t,PC,o=>o.name,Mh);if(s){const o=Qo(t,Ee.getCompare());return new z(r,Ne(e),new Xt({".priority":o},{".priority":Ee}))}else return new z(r,Ne(e),Xt.Default)}else{let t=z.EMPTY_NODE;return Ge(n,(s,i)=>{if(Bt(n,s)&&s.substring(0,1)!=="."){const r=Ne(i);(r.isLeafNode()||!r.isEmpty())&&(t=t.updateImmediateChild(s,r))}}),t.updatePriority(Ne(e))}}DC(Ne);/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Vh extends Pa{constructor(e){super(),this.indexPath_=e,D(!Z(e)&&X(e)!==".priority","Can't create PathIndex with empty path or .priority key")}extractChild(e){return e.getChild(this.indexPath_)}isDefinedOn(e){return!e.getChild(this.indexPath_).isEmpty()}compare(e,t){const s=this.extractChild(e.node),i=this.extractChild(t.node),r=s.compareTo(i);return r===0?hs(e.name,t.name):r}makePost(e,t){const s=Ne(e),i=z.EMPTY_NODE.updateChild(this.indexPath_,s);return new ee(t,i)}maxPost(){const e=z.EMPTY_NODE.updateChild(this.indexPath_,Ar);return new ee(xn,e)}toString(){return or(this.indexPath_,0).join("/")}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class BC extends Pa{compare(e,t){const s=e.node.compareTo(t.node);return s===0?hs(e.name,t.name):s}isDefinedOn(e){return!0}indexedValueChanged(e,t){return!e.equals(t)}minPost(){return ee.MIN}maxPost(){return ee.MAX}makePost(e,t){const s=Ne(e);return new ee(t,s)}toString(){return".value"}}const E_=new BC;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function w_(n){return{type:"value",snapshotNode:n}}function $s(n,e){return{type:"child_added",snapshotNode:e,childName:n}}function ar(n,e){return{type:"child_removed",snapshotNode:e,childName:n}}function lr(n,e,t){return{type:"child_changed",snapshotNode:e,childName:n,oldSnap:t}}function UC(n,e){return{type:"child_moved",snapshotNode:e,childName:n}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fh{constructor(e){this.index_=e}updateChild(e,t,s,i,r,o){D(e.isIndexed(this.index_),"A node must be indexed if only a child is updated");const l=e.getImmediateChild(t);return l.getChild(i).equals(s.getChild(i))&&l.isEmpty()===s.isEmpty()||(o!=null&&(s.isEmpty()?e.hasChild(t)?o.trackChildChange(ar(t,l)):D(e.isLeafNode(),"A child remove without an old child only makes sense on a leaf node"):l.isEmpty()?o.trackChildChange($s(t,s)):o.trackChildChange(lr(t,s,l))),e.isLeafNode()&&s.isEmpty())?e:e.updateImmediateChild(t,s).withIndex(this.index_)}updateFullNode(e,t,s){return s!=null&&(e.isLeafNode()||e.forEachChild(Ee,(i,r)=>{t.hasChild(i)||s.trackChildChange(ar(i,r))}),t.isLeafNode()||t.forEachChild(Ee,(i,r)=>{if(e.hasChild(i)){const o=e.getImmediateChild(i);o.equals(r)||s.trackChildChange(lr(i,r,o))}else s.trackChildChange($s(i,r))})),t.withIndex(this.index_)}updatePriority(e,t){return e.isEmpty()?z.EMPTY_NODE:e.updatePriority(t)}filtersNodes(){return!1}getIndexedFilter(){return this}getIndex(){return this.index_}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class cr{constructor(e){this.indexedFilter_=new Fh(e.getIndex()),this.index_=e.getIndex(),this.startPost_=cr.getStartPost_(e),this.endPost_=cr.getEndPost_(e),this.startIsInclusive_=!e.startAfterSet_,this.endIsInclusive_=!e.endBeforeSet_}getStartPost(){return this.startPost_}getEndPost(){return this.endPost_}matches(e){const t=this.startIsInclusive_?this.index_.compare(this.getStartPost(),e)<=0:this.index_.compare(this.getStartPost(),e)<0,s=this.endIsInclusive_?this.index_.compare(e,this.getEndPost())<=0:this.index_.compare(e,this.getEndPost())<0;return t&&s}updateChild(e,t,s,i,r,o){return this.matches(new ee(t,s))||(s=z.EMPTY_NODE),this.indexedFilter_.updateChild(e,t,s,i,r,o)}updateFullNode(e,t,s){t.isLeafNode()&&(t=z.EMPTY_NODE);let i=t.withIndex(this.index_);i=i.updatePriority(z.EMPTY_NODE);const r=this;return t.forEachChild(Ee,(o,l)=>{r.matches(new ee(o,l))||(i=i.updateImmediateChild(o,z.EMPTY_NODE))}),this.indexedFilter_.updateFullNode(e,i,s)}updatePriority(e,t){return e}filtersNodes(){return!0}getIndexedFilter(){return this.indexedFilter_}getIndex(){return this.index_}static getStartPost_(e){if(e.hasStart()){const t=e.getIndexStartName();return e.getIndex().makePost(e.getIndexStartValue(),t)}else return e.getIndex().minPost()}static getEndPost_(e){if(e.hasEnd()){const t=e.getIndexEndName();return e.getIndex().makePost(e.getIndexEndValue(),t)}else return e.getIndex().maxPost()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qC{constructor(e){this.withinDirectionalStart=t=>this.reverse_?this.withinEndPost(t):this.withinStartPost(t),this.withinDirectionalEnd=t=>this.reverse_?this.withinStartPost(t):this.withinEndPost(t),this.withinStartPost=t=>{const s=this.index_.compare(this.rangedFilter_.getStartPost(),t);return this.startIsInclusive_?s<=0:s<0},this.withinEndPost=t=>{const s=this.index_.compare(t,this.rangedFilter_.getEndPost());return this.endIsInclusive_?s<=0:s<0},this.rangedFilter_=new cr(e),this.index_=e.getIndex(),this.limit_=e.getLimit(),this.reverse_=!e.isViewFromLeft(),this.startIsInclusive_=!e.startAfterSet_,this.endIsInclusive_=!e.endBeforeSet_}updateChild(e,t,s,i,r,o){return this.rangedFilter_.matches(new ee(t,s))||(s=z.EMPTY_NODE),e.getImmediateChild(t).equals(s)?e:e.numChildren()<this.limit_?this.rangedFilter_.getIndexedFilter().updateChild(e,t,s,i,r,o):this.fullLimitUpdateChild_(e,t,s,r,o)}updateFullNode(e,t,s){let i;if(t.isLeafNode()||t.isEmpty())i=z.EMPTY_NODE.withIndex(this.index_);else if(this.limit_*2<t.numChildren()&&t.isIndexed(this.index_)){i=z.EMPTY_NODE.withIndex(this.index_);let r;this.reverse_?r=t.getReverseIteratorFrom(this.rangedFilter_.getEndPost(),this.index_):r=t.getIteratorFrom(this.rangedFilter_.getStartPost(),this.index_);let o=0;for(;r.hasNext()&&o<this.limit_;){const l=r.getNext();if(this.withinDirectionalStart(l))if(this.withinDirectionalEnd(l))i=i.updateImmediateChild(l.name,l.node),o++;else break;else continue}}else{i=t.withIndex(this.index_),i=i.updatePriority(z.EMPTY_NODE);let r;this.reverse_?r=i.getReverseIterator(this.index_):r=i.getIterator(this.index_);let o=0;for(;r.hasNext();){const l=r.getNext();o<this.limit_&&this.withinDirectionalStart(l)&&this.withinDirectionalEnd(l)?o++:i=i.updateImmediateChild(l.name,z.EMPTY_NODE)}}return this.rangedFilter_.getIndexedFilter().updateFullNode(e,i,s)}updatePriority(e,t){return e}filtersNodes(){return!0}getIndexedFilter(){return this.rangedFilter_.getIndexedFilter()}getIndex(){return this.index_}fullLimitUpdateChild_(e,t,s,i,r){let o;if(this.reverse_){const p=this.index_.getCompare();o=(m,E)=>p(E,m)}else o=this.index_.getCompare();const l=e;D(l.numChildren()===this.limit_,"");const c=new ee(t,s),h=this.reverse_?l.getFirstChild(this.index_):l.getLastChild(this.index_),d=this.rangedFilter_.matches(c);if(l.hasChild(t)){const p=l.getImmediateChild(t);let m=i.getChildAfterChild(this.index_,h,this.reverse_);for(;m!=null&&(m.name===t||l.hasChild(m.name));)m=i.getChildAfterChild(this.index_,m,this.reverse_);const E=m==null?1:o(m,c);if(d&&!s.isEmpty()&&E>=0)return r!=null&&r.trackChildChange(lr(t,s,p)),l.updateImmediateChild(t,s);{r!=null&&r.trackChildChange(ar(t,p));const A=l.updateImmediateChild(t,z.EMPTY_NODE);return m!=null&&this.rangedFilter_.matches(m)?(r!=null&&r.trackChildChange($s(m.name,m.node)),A.updateImmediateChild(m.name,m.node)):A}}else return s.isEmpty()?e:d&&o(h,c)>=0?(r!=null&&(r.trackChildChange(ar(h.name,h.node)),r.trackChildChange($s(t,s))),l.updateImmediateChild(t,s).updateImmediateChild(h.name,z.EMPTY_NODE)):e}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Bh{constructor(){this.limitSet_=!1,this.startSet_=!1,this.startNameSet_=!1,this.startAfterSet_=!1,this.endSet_=!1,this.endNameSet_=!1,this.endBeforeSet_=!1,this.limit_=0,this.viewFrom_="",this.indexStartValue_=null,this.indexStartName_="",this.indexEndValue_=null,this.indexEndName_="",this.index_=Ee}hasStart(){return this.startSet_}isViewFromLeft(){return this.viewFrom_===""?this.startSet_:this.viewFrom_==="l"}getIndexStartValue(){return D(this.startSet_,"Only valid if start has been set"),this.indexStartValue_}getIndexStartName(){return D(this.startSet_,"Only valid if start has been set"),this.startNameSet_?this.indexStartName_:is}hasEnd(){return this.endSet_}getIndexEndValue(){return D(this.endSet_,"Only valid if end has been set"),this.indexEndValue_}getIndexEndName(){return D(this.endSet_,"Only valid if end has been set"),this.endNameSet_?this.indexEndName_:xn}hasLimit(){return this.limitSet_}hasAnchoredLimit(){return this.limitSet_&&this.viewFrom_!==""}getLimit(){return D(this.limitSet_,"Only valid if limit has been set"),this.limit_}getIndex(){return this.index_}loadsAllData(){return!(this.startSet_||this.endSet_||this.limitSet_)}isDefault(){return this.loadsAllData()&&this.index_===Ee}copy(){const e=new Bh;return e.limitSet_=this.limitSet_,e.limit_=this.limit_,e.startSet_=this.startSet_,e.startAfterSet_=this.startAfterSet_,e.indexStartValue_=this.indexStartValue_,e.startNameSet_=this.startNameSet_,e.indexStartName_=this.indexStartName_,e.endSet_=this.endSet_,e.endBeforeSet_=this.endBeforeSet_,e.indexEndValue_=this.indexEndValue_,e.endNameSet_=this.endNameSet_,e.indexEndName_=this.indexEndName_,e.index_=this.index_,e.viewFrom_=this.viewFrom_,e}}function WC(n){return n.loadsAllData()?new Fh(n.getIndex()):n.hasLimit()?new qC(n):new cr(n)}function $C(n,e,t){const s=n.copy();return s.endSet_=!0,e===void 0&&(e=null),s.indexEndValue_=e,t!==void 0?(s.endNameSet_=!0,s.indexEndName_=t):(s.endNameSet_=!1,s.indexEndName_=""),s}function jC(n,e){const t=n.copy();return t.index_=e,t}function zf(n){const e={};if(n.isDefault())return e;let t;if(n.index_===Ee?t="$priority":n.index_===E_?t="$value":n.index_===Jn?t="$key":(D(n.index_ instanceof Vh,"Unrecognized index type!"),t=n.index_.toString()),e.orderBy=De(t),n.startSet_){const s=n.startAfterSet_?"startAfter":"startAt";e[s]=De(n.indexStartValue_),n.startNameSet_&&(e[s]+=","+De(n.indexStartName_))}if(n.endSet_){const s=n.endBeforeSet_?"endBefore":"endAt";e[s]=De(n.indexEndValue_),n.endNameSet_&&(e[s]+=","+De(n.indexEndName_))}return n.limitSet_&&(n.isViewFromLeft()?e.limitToFirst=n.limit_:e.limitToLast=n.limit_),e}function Hf(n){const e={};if(n.startSet_&&(e.sp=n.indexStartValue_,n.startNameSet_&&(e.sn=n.indexStartName_),e.sin=!n.startAfterSet_),n.endSet_&&(e.ep=n.indexEndValue_,n.endNameSet_&&(e.en=n.indexEndName_),e.ein=!n.endBeforeSet_),n.limitSet_){e.l=n.limit_;let t=n.viewFrom_;t===""&&(n.isViewFromLeft()?t="l":t="r"),e.vf=t}return n.index_!==Ee&&(e.i=n.index_.toString()),e}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Yo extends u_{constructor(e,t,s,i){super(),this.repoInfo_=e,this.onDataUpdate_=t,this.authTokenProvider_=s,this.appCheckTokenProvider_=i,this.log_=Sr("p:rest:"),this.listens_={}}reportStats(e){throw new Error("Method not implemented.")}static getListenId_(e,t){return t!==void 0?"tag$"+t:(D(e._queryParams.isDefault(),"should have a tag if it's not a default query."),e._path.toString())}listen(e,t,s,i){const r=e._path.toString();this.log_("Listen called for "+r+" "+e._queryIdentifier);const o=Yo.getListenId_(e,s),l={};this.listens_[o]=l;const c=zf(e._queryParams);this.restRequest_(r+".json",c,(h,d)=>{let p=d;if(h===404&&(p=null,h=null),h===null&&this.onDataUpdate_(r,p,!1,s),Os(this.listens_,o)===l){let m;h?h===401?m="permission_denied":m="rest_error:"+h:m="ok",i(m,null)}})}unlisten(e,t){const s=Yo.getListenId_(e,t);delete this.listens_[s]}get(e){const t=zf(e._queryParams),s=e._path.toString(),i=new dr;return this.restRequest_(s+".json",t,(r,o)=>{let l=o;r===404&&(l=null,r=null),r===null?(this.onDataUpdate_(s,l,!1,null),i.resolve(l)):i.reject(new Error(l))}),i.promise}refreshAuthToken(e){}restRequest_(e,t={},s){return t.format="export",Promise.all([this.authTokenProvider_.getToken(!1),this.appCheckTokenProvider_.getToken(!1)]).then(([i,r])=>{i&&i.accessToken&&(t.auth=i.accessToken),r&&r.token&&(t.ac=r.token);const o=(this.repoInfo_.secure?"https://":"http://")+this.repoInfo_.host+e+"?ns="+this.repoInfo_.namespace+Ys(t);this.log_("Sending REST request for "+o);const l=new XMLHttpRequest;l.onreadystatechange=()=>{if(s&&l.readyState===4){this.log_("REST Response for "+o+" received. status:",l.status,"response:",l.responseText);let c=null;if(l.status>=200&&l.status<300){try{c=Qi(l.responseText)}catch{ot("Failed to parse JSON response for "+o+": "+l.responseText)}s(null,c)}else l.status!==401&&l.status!==404&&ot("Got unsuccessful REST response for "+o+" Status: "+l.status),s(l.status);s=null}},l.open("GET",o,!0),l.send()})}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class GC{constructor(){this.rootNode_=z.EMPTY_NODE}getNode(e){return this.rootNode_.getChild(e)}updateSnapshot(e,t){this.rootNode_=this.rootNode_.updateChild(e,t)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Jo(){return{value:null,children:new Map}}function T_(n,e,t){if(Z(e))n.value=t,n.children.clear();else if(n.value!==null)n.value=n.value.updateChild(e,t);else{const s=X(e);n.children.has(s)||n.children.set(s,Jo());const i=n.children.get(s);e=_e(e),T_(i,e,t)}}function uc(n,e,t){n.value!==null?t(e,n.value):zC(n,(s,i)=>{const r=new he(e.toString()+"/"+s);uc(i,r,t)})}function zC(n,e){n.children.forEach((t,s)=>{e(s,t)})}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class HC{constructor(e){this.collection_=e,this.last_=null}get(){const e=this.collection_.get(),t=Object.assign({},e);return this.last_&&Ge(this.last_,(s,i)=>{t[s]=t[s]-i}),this.last_=e,t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Kf=10*1e3,KC=30*1e3,QC=5*60*1e3;class YC{constructor(e,t){this.server_=t,this.statsToReport_={},this.statsListener_=new HC(e);const s=Kf+(KC-Kf)*Math.random();ji(this.reportStats_.bind(this),Math.floor(s))}reportStats_(){const e=this.statsListener_.get(),t={};let s=!1;Ge(e,(i,r)=>{r>0&&Bt(this.statsToReport_,i)&&(t[i]=r,s=!0)}),s&&this.server_.reportStats(t),ji(this.reportStats_.bind(this),Math.floor(Math.random()*2*QC))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Ct;(function(n){n[n.OVERWRITE=0]="OVERWRITE",n[n.MERGE=1]="MERGE",n[n.ACK_USER_WRITE=2]="ACK_USER_WRITE",n[n.LISTEN_COMPLETE=3]="LISTEN_COMPLETE"})(Ct||(Ct={}));function Uh(){return{fromUser:!0,fromServer:!1,queryId:null,tagged:!1}}function qh(){return{fromUser:!1,fromServer:!0,queryId:null,tagged:!1}}function Wh(n){return{fromUser:!1,fromServer:!0,queryId:n,tagged:!0}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Xo{constructor(e,t,s){this.path=e,this.affectedTree=t,this.revert=s,this.type=Ct.ACK_USER_WRITE,this.source=Uh()}operationForChild(e){if(Z(this.path)){if(this.affectedTree.value!=null)return D(this.affectedTree.children.isEmpty(),"affectedTree should not have overlapping affected paths."),this;{const t=this.affectedTree.subtree(new he(e));return new Xo(le(),t,this.revert)}}else return D(X(this.path)===e,"operationForChild called for unrelated child."),new Xo(_e(this.path),this.affectedTree,this.revert)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class hr{constructor(e,t){this.source=e,this.path=t,this.type=Ct.LISTEN_COMPLETE}operationForChild(e){return Z(this.path)?new hr(this.source,le()):new hr(this.source,_e(this.path))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rs{constructor(e,t,s){this.source=e,this.path=t,this.snap=s,this.type=Ct.OVERWRITE}operationForChild(e){return Z(this.path)?new rs(this.source,le(),this.snap.getImmediateChild(e)):new rs(this.source,_e(this.path),this.snap)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class js{constructor(e,t,s){this.source=e,this.path=t,this.children=s,this.type=Ct.MERGE}operationForChild(e){if(Z(this.path)){const t=this.children.subtree(new he(e));return t.isEmpty()?null:t.value?new rs(this.source,le(),t.value):new js(this.source,le(),t)}else return D(X(this.path)===e,"Can't get a merge for a child not on the path of the operation"),new js(this.source,_e(this.path),this.children)}toString(){return"Operation("+this.path+": "+this.source.toString()+" merge: "+this.children.toString()+")"}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Mn{constructor(e,t,s){this.node_=e,this.fullyInitialized_=t,this.filtered_=s}isFullyInitialized(){return this.fullyInitialized_}isFiltered(){return this.filtered_}isCompleteForPath(e){if(Z(e))return this.isFullyInitialized()&&!this.filtered_;const t=X(e);return this.isCompleteForChild(t)}isCompleteForChild(e){return this.isFullyInitialized()&&!this.filtered_||this.node_.hasChild(e)}getNode(){return this.node_}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class JC{constructor(e){this.query_=e,this.index_=this.query_._queryParams.getIndex()}}function XC(n,e,t,s){const i=[],r=[];return e.forEach(o=>{o.type==="child_changed"&&n.index_.indexedValueChanged(o.oldSnap,o.snapshotNode)&&r.push(UC(o.childName,o.snapshotNode))}),Si(n,i,"child_removed",e,s,t),Si(n,i,"child_added",e,s,t),Si(n,i,"child_moved",r,s,t),Si(n,i,"child_changed",e,s,t),Si(n,i,"value",e,s,t),i}function Si(n,e,t,s,i,r){const o=s.filter(l=>l.type===t);o.sort((l,c)=>eR(n,l,c)),o.forEach(l=>{const c=ZC(n,l,r);i.forEach(h=>{h.respondsTo(l.type)&&e.push(h.createEvent(c,n.query_))})})}function ZC(n,e,t){return e.type==="value"||e.type==="child_removed"||(e.prevName=t.getPredecessorChildName(e.childName,e.snapshotNode,n.index_)),e}function eR(n,e,t){if(e.childName==null||t.childName==null)throw Qs("Should only compare child_ events.");const s=new ee(e.childName,e.snapshotNode),i=new ee(t.childName,t.snapshotNode);return n.index_.compare(s,i)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Na(n,e){return{eventCache:n,serverCache:e}}function Gi(n,e,t,s){return Na(new Mn(e,t,s),n.serverCache)}function I_(n,e,t,s){return Na(n.eventCache,new Mn(e,t,s))}function Zo(n){return n.eventCache.isFullyInitialized()?n.eventCache.getNode():null}function os(n){return n.serverCache.isFullyInitialized()?n.serverCache.getNode():null}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let bl;const tR=()=>(bl||(bl=new ut(Bb)),bl);class ge{constructor(e,t=tR()){this.value=e,this.children=t}static fromObject(e){let t=new ge(null);return Ge(e,(s,i)=>{t=t.set(new he(s),i)}),t}isEmpty(){return this.value===null&&this.children.isEmpty()}findRootMostMatchingPathAndValue(e,t){if(this.value!=null&&t(this.value))return{path:le(),value:this.value};if(Z(e))return null;{const s=X(e),i=this.children.get(s);if(i!==null){const r=i.findRootMostMatchingPathAndValue(_e(e),t);return r!=null?{path:Ie(new he(s),r.path),value:r.value}:null}else return null}}findRootMostValueAndPath(e){return this.findRootMostMatchingPathAndValue(e,()=>!0)}subtree(e){if(Z(e))return this;{const t=X(e),s=this.children.get(t);return s!==null?s.subtree(_e(e)):new ge(null)}}set(e,t){if(Z(e))return new ge(t,this.children);{const s=X(e),r=(this.children.get(s)||new ge(null)).set(_e(e),t),o=this.children.insert(s,r);return new ge(this.value,o)}}remove(e){if(Z(e))return this.children.isEmpty()?new ge(null):new ge(null,this.children);{const t=X(e),s=this.children.get(t);if(s){const i=s.remove(_e(e));let r;return i.isEmpty()?r=this.children.remove(t):r=this.children.insert(t,i),this.value===null&&r.isEmpty()?new ge(null):new ge(this.value,r)}else return this}}get(e){if(Z(e))return this.value;{const t=X(e),s=this.children.get(t);return s?s.get(_e(e)):null}}setTree(e,t){if(Z(e))return t;{const s=X(e),r=(this.children.get(s)||new ge(null)).setTree(_e(e),t);let o;return r.isEmpty()?o=this.children.remove(s):o=this.children.insert(s,r),new ge(this.value,o)}}fold(e){return this.fold_(le(),e)}fold_(e,t){const s={};return this.children.inorderTraversal((i,r)=>{s[i]=r.fold_(Ie(e,i),t)}),t(e,this.value,s)}findOnPath(e,t){return this.findOnPath_(e,le(),t)}findOnPath_(e,t,s){const i=this.value?s(t,this.value):!1;if(i)return i;if(Z(e))return null;{const r=X(e),o=this.children.get(r);return o?o.findOnPath_(_e(e),Ie(t,r),s):null}}foreachOnPath(e,t){return this.foreachOnPath_(e,le(),t)}foreachOnPath_(e,t,s){if(Z(e))return this;{this.value&&s(t,this.value);const i=X(e),r=this.children.get(i);return r?r.foreachOnPath_(_e(e),Ie(t,i),s):new ge(null)}}foreach(e){this.foreach_(le(),e)}foreach_(e,t){this.children.inorderTraversal((s,i)=>{i.foreach_(Ie(e,s),t)}),this.value&&t(e,this.value)}foreachChild(e){this.children.inorderTraversal((t,s)=>{s.value&&e(t,s.value)})}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class St{constructor(e){this.writeTree_=e}static empty(){return new St(new ge(null))}}function zi(n,e,t){if(Z(e))return new St(new ge(t));{const s=n.writeTree_.findRootMostValueAndPath(e);if(s!=null){const i=s.path;let r=s.value;const o=rt(i,e);return r=r.updateChild(o,t),new St(n.writeTree_.set(i,r))}else{const i=new ge(t),r=n.writeTree_.setTree(e,i);return new St(r)}}}function dc(n,e,t){let s=n;return Ge(t,(i,r)=>{s=zi(s,Ie(e,i),r)}),s}function Qf(n,e){if(Z(e))return St.empty();{const t=n.writeTree_.setTree(e,new ge(null));return new St(t)}}function fc(n,e){return us(n,e)!=null}function us(n,e){const t=n.writeTree_.findRootMostValueAndPath(e);return t!=null?n.writeTree_.get(t.path).getChild(rt(t.path,e)):null}function Yf(n){const e=[],t=n.writeTree_.value;return t!=null?t.isLeafNode()||t.forEachChild(Ee,(s,i)=>{e.push(new ee(s,i))}):n.writeTree_.children.inorderTraversal((s,i)=>{i.value!=null&&e.push(new ee(s,i.value))}),e}function Sn(n,e){if(Z(e))return n;{const t=us(n,e);return t!=null?new St(new ge(t)):new St(n.writeTree_.subtree(e))}}function pc(n){return n.writeTree_.isEmpty()}function Gs(n,e){return b_(le(),n.writeTree_,e)}function b_(n,e,t){if(e.value!=null)return t.updateChild(n,e.value);{let s=null;return e.children.inorderTraversal((i,r)=>{i===".priority"?(D(r.value!==null,"Priority writes must always be leaf nodes"),s=r.value):t=b_(Ie(n,i),r,t)}),!t.getChild(n).isEmpty()&&s!==null&&(t=t.updateChild(Ie(n,".priority"),s)),t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Da(n,e){return A_(e,n)}function nR(n,e,t,s,i){D(s>n.lastWriteId,"Stacking an older write on top of newer ones"),i===void 0&&(i=!0),n.allWrites.push({path:e,snap:t,writeId:s,visible:i}),i&&(n.visibleWrites=zi(n.visibleWrites,e,t)),n.lastWriteId=s}function sR(n,e,t,s){D(s>n.lastWriteId,"Stacking an older merge on top of newer ones"),n.allWrites.push({path:e,children:t,writeId:s,visible:!0}),n.visibleWrites=dc(n.visibleWrites,e,t),n.lastWriteId=s}function iR(n,e){for(let t=0;t<n.allWrites.length;t++){const s=n.allWrites[t];if(s.writeId===e)return s}return null}function rR(n,e){const t=n.allWrites.findIndex(l=>l.writeId===e);D(t>=0,"removeWrite called with nonexistent writeId.");const s=n.allWrites[t];n.allWrites.splice(t,1);let i=s.visible,r=!1,o=n.allWrites.length-1;for(;i&&o>=0;){const l=n.allWrites[o];l.visible&&(o>=t&&oR(l,s.path)?i=!1:_t(s.path,l.path)&&(r=!0)),o--}if(i){if(r)return aR(n),!0;if(s.snap)n.visibleWrites=Qf(n.visibleWrites,s.path);else{const l=s.children;Ge(l,c=>{n.visibleWrites=Qf(n.visibleWrites,Ie(s.path,c))})}return!0}else return!1}function oR(n,e){if(n.snap)return _t(n.path,e);for(const t in n.children)if(n.children.hasOwnProperty(t)&&_t(Ie(n.path,t),e))return!0;return!1}function aR(n){n.visibleWrites=C_(n.allWrites,lR,le()),n.allWrites.length>0?n.lastWriteId=n.allWrites[n.allWrites.length-1].writeId:n.lastWriteId=-1}function lR(n){return n.visible}function C_(n,e,t){let s=St.empty();for(let i=0;i<n.length;++i){const r=n[i];if(e(r)){const o=r.path;let l;if(r.snap)_t(t,o)?(l=rt(t,o),s=zi(s,l,r.snap)):_t(o,t)&&(l=rt(o,t),s=zi(s,le(),r.snap.getChild(l)));else if(r.children){if(_t(t,o))l=rt(t,o),s=dc(s,l,r.children);else if(_t(o,t))if(l=rt(o,t),Z(l))s=dc(s,le(),r.children);else{const c=Os(r.children,X(l));if(c){const h=c.getChild(_e(l));s=zi(s,le(),h)}}}else throw Qs("WriteRecord should have .snap or .children")}}return s}function R_(n,e,t,s,i){if(!s&&!i){const r=us(n.visibleWrites,e);if(r!=null)return r;{const o=Sn(n.visibleWrites,e);if(pc(o))return t;if(t==null&&!fc(o,le()))return null;{const l=t||z.EMPTY_NODE;return Gs(o,l)}}}else{const r=Sn(n.visibleWrites,e);if(!i&&pc(r))return t;if(!i&&t==null&&!fc(r,le()))return null;{const o=function(h){return(h.visible||i)&&(!s||!~s.indexOf(h.writeId))&&(_t(h.path,e)||_t(e,h.path))},l=C_(n.allWrites,o,e),c=t||z.EMPTY_NODE;return Gs(l,c)}}}function cR(n,e,t){let s=z.EMPTY_NODE;const i=us(n.visibleWrites,e);if(i)return i.isLeafNode()||i.forEachChild(Ee,(r,o)=>{s=s.updateImmediateChild(r,o)}),s;if(t){const r=Sn(n.visibleWrites,e);return t.forEachChild(Ee,(o,l)=>{const c=Gs(Sn(r,new he(o)),l);s=s.updateImmediateChild(o,c)}),Yf(r).forEach(o=>{s=s.updateImmediateChild(o.name,o.node)}),s}else{const r=Sn(n.visibleWrites,e);return Yf(r).forEach(o=>{s=s.updateImmediateChild(o.name,o.node)}),s}}function hR(n,e,t,s,i){D(s||i,"Either existingEventSnap or existingServerSnap must exist");const r=Ie(e,t);if(fc(n.visibleWrites,r))return null;{const o=Sn(n.visibleWrites,r);return pc(o)?i.getChild(t):Gs(o,i.getChild(t))}}function uR(n,e,t,s){const i=Ie(e,t),r=us(n.visibleWrites,i);if(r!=null)return r;if(s.isCompleteForChild(t)){const o=Sn(n.visibleWrites,i);return Gs(o,s.getNode().getImmediateChild(t))}else return null}function dR(n,e){return us(n.visibleWrites,e)}function fR(n,e,t,s,i,r,o){let l;const c=Sn(n.visibleWrites,e),h=us(c,le());if(h!=null)l=h;else if(t!=null)l=Gs(c,t);else return[];if(l=l.withIndex(o),!l.isEmpty()&&!l.isLeafNode()){const d=[],p=o.getCompare(),m=r?l.getReverseIteratorFrom(s,o):l.getIteratorFrom(s,o);let E=m.getNext();for(;E&&d.length<i;)p(E,s)!==0&&d.push(E),E=m.getNext();return d}else return[]}function pR(){return{visibleWrites:St.empty(),allWrites:[],lastWriteId:-1}}function ea(n,e,t,s){return R_(n.writeTree,n.treePath,e,t,s)}function $h(n,e){return cR(n.writeTree,n.treePath,e)}function Jf(n,e,t,s){return hR(n.writeTree,n.treePath,e,t,s)}function ta(n,e){return dR(n.writeTree,Ie(n.treePath,e))}function mR(n,e,t,s,i,r){return fR(n.writeTree,n.treePath,e,t,s,i,r)}function jh(n,e,t){return uR(n.writeTree,n.treePath,e,t)}function S_(n,e){return A_(Ie(n.treePath,e),n.writeTree)}function A_(n,e){return{treePath:n,writeTree:e}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gR{constructor(){this.changeMap=new Map}trackChildChange(e){const t=e.type,s=e.childName;D(t==="child_added"||t==="child_changed"||t==="child_removed","Only child changes supported for tracking"),D(s!==".priority","Only non-priority child changes can be tracked.");const i=this.changeMap.get(s);if(i){const r=i.type;if(t==="child_added"&&r==="child_removed")this.changeMap.set(s,lr(s,e.snapshotNode,i.snapshotNode));else if(t==="child_removed"&&r==="child_added")this.changeMap.delete(s);else if(t==="child_removed"&&r==="child_changed")this.changeMap.set(s,ar(s,i.oldSnap));else if(t==="child_changed"&&r==="child_added")this.changeMap.set(s,$s(s,e.snapshotNode));else if(t==="child_changed"&&r==="child_changed")this.changeMap.set(s,lr(s,e.snapshotNode,i.oldSnap));else throw Qs("Illegal combination of changes: "+e+" occurred after "+i)}else this.changeMap.set(s,e)}getChanges(){return Array.from(this.changeMap.values())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _R{getCompleteChild(e){return null}getChildAfterChild(e,t,s){return null}}const k_=new _R;class Gh{constructor(e,t,s=null){this.writes_=e,this.viewCache_=t,this.optCompleteServerCache_=s}getCompleteChild(e){const t=this.viewCache_.eventCache;if(t.isCompleteForChild(e))return t.getNode().getImmediateChild(e);{const s=this.optCompleteServerCache_!=null?new Mn(this.optCompleteServerCache_,!0,!1):this.viewCache_.serverCache;return jh(this.writes_,e,s)}}getChildAfterChild(e,t,s){const i=this.optCompleteServerCache_!=null?this.optCompleteServerCache_:os(this.viewCache_),r=mR(this.writes_,i,t,1,s,e);return r.length===0?null:r[0]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function yR(n){return{filter:n}}function vR(n,e){D(e.eventCache.getNode().isIndexed(n.filter.getIndex()),"Event snap not indexed"),D(e.serverCache.getNode().isIndexed(n.filter.getIndex()),"Server snap not indexed")}function ER(n,e,t,s,i){const r=new gR;let o,l;if(t.type===Ct.OVERWRITE){const h=t;h.source.fromUser?o=mc(n,e,h.path,h.snap,s,i,r):(D(h.source.fromServer,"Unknown source."),l=h.source.tagged||e.serverCache.isFiltered()&&!Z(h.path),o=na(n,e,h.path,h.snap,s,i,l,r))}else if(t.type===Ct.MERGE){const h=t;h.source.fromUser?o=TR(n,e,h.path,h.children,s,i,r):(D(h.source.fromServer,"Unknown source."),l=h.source.tagged||e.serverCache.isFiltered(),o=gc(n,e,h.path,h.children,s,i,l,r))}else if(t.type===Ct.ACK_USER_WRITE){const h=t;h.revert?o=CR(n,e,h.path,s,i,r):o=IR(n,e,h.path,h.affectedTree,s,i,r)}else if(t.type===Ct.LISTEN_COMPLETE)o=bR(n,e,t.path,s,r);else throw Qs("Unknown operation type: "+t.type);const c=r.getChanges();return wR(e,o,c),{viewCache:o,changes:c}}function wR(n,e,t){const s=e.eventCache;if(s.isFullyInitialized()){const i=s.getNode().isLeafNode()||s.getNode().isEmpty(),r=Zo(n);(t.length>0||!n.eventCache.isFullyInitialized()||i&&!s.getNode().equals(r)||!s.getNode().getPriority().equals(r.getPriority()))&&t.push(w_(Zo(e)))}}function P_(n,e,t,s,i,r){const o=e.eventCache;if(ta(s,t)!=null)return e;{let l,c;if(Z(t))if(D(e.serverCache.isFullyInitialized(),"If change path is empty, we must have complete server data"),e.serverCache.isFiltered()){const h=os(e),d=h instanceof z?h:z.EMPTY_NODE,p=$h(s,d);l=n.filter.updateFullNode(e.eventCache.getNode(),p,r)}else{const h=ea(s,os(e));l=n.filter.updateFullNode(e.eventCache.getNode(),h,r)}else{const h=X(t);if(h===".priority"){D(On(t)===1,"Can't have a priority with additional path components");const d=o.getNode();c=e.serverCache.getNode();const p=Jf(s,t,d,c);p!=null?l=n.filter.updatePriority(d,p):l=o.getNode()}else{const d=_e(t);let p;if(o.isCompleteForChild(h)){c=e.serverCache.getNode();const m=Jf(s,t,o.getNode(),c);m!=null?p=o.getNode().getImmediateChild(h).updateChild(d,m):p=o.getNode().getImmediateChild(h)}else p=jh(s,h,e.serverCache);p!=null?l=n.filter.updateChild(o.getNode(),h,p,d,i,r):l=o.getNode()}}return Gi(e,l,o.isFullyInitialized()||Z(t),n.filter.filtersNodes())}}function na(n,e,t,s,i,r,o,l){const c=e.serverCache;let h;const d=o?n.filter:n.filter.getIndexedFilter();if(Z(t))h=d.updateFullNode(c.getNode(),s,null);else if(d.filtersNodes()&&!c.isFiltered()){const E=c.getNode().updateChild(t,s);h=d.updateFullNode(c.getNode(),E,null)}else{const E=X(t);if(!c.isCompleteForPath(t)&&On(t)>1)return e;const R=_e(t),P=c.getNode().getImmediateChild(E).updateChild(R,s);E===".priority"?h=d.updatePriority(c.getNode(),P):h=d.updateChild(c.getNode(),E,P,R,k_,null)}const p=I_(e,h,c.isFullyInitialized()||Z(t),d.filtersNodes()),m=new Gh(i,p,r);return P_(n,p,t,i,m,l)}function mc(n,e,t,s,i,r,o){const l=e.eventCache;let c,h;const d=new Gh(i,e,r);if(Z(t))h=n.filter.updateFullNode(e.eventCache.getNode(),s,o),c=Gi(e,h,!0,n.filter.filtersNodes());else{const p=X(t);if(p===".priority")h=n.filter.updatePriority(e.eventCache.getNode(),s),c=Gi(e,h,l.isFullyInitialized(),l.isFiltered());else{const m=_e(t),E=l.getNode().getImmediateChild(p);let R;if(Z(m))R=s;else{const A=d.getCompleteChild(p);A!=null?Lh(m)===".priority"&&A.getChild(f_(m)).isEmpty()?R=A:R=A.updateChild(m,s):R=z.EMPTY_NODE}if(E.equals(R))c=e;else{const A=n.filter.updateChild(l.getNode(),p,R,m,d,o);c=Gi(e,A,l.isFullyInitialized(),n.filter.filtersNodes())}}}return c}function Xf(n,e){return n.eventCache.isCompleteForChild(e)}function TR(n,e,t,s,i,r,o){let l=e;return s.foreach((c,h)=>{const d=Ie(t,c);Xf(e,X(d))&&(l=mc(n,l,d,h,i,r,o))}),s.foreach((c,h)=>{const d=Ie(t,c);Xf(e,X(d))||(l=mc(n,l,d,h,i,r,o))}),l}function Zf(n,e,t){return t.foreach((s,i)=>{e=e.updateChild(s,i)}),e}function gc(n,e,t,s,i,r,o,l){if(e.serverCache.getNode().isEmpty()&&!e.serverCache.isFullyInitialized())return e;let c=e,h;Z(t)?h=s:h=new ge(null).setTree(t,s);const d=e.serverCache.getNode();return h.children.inorderTraversal((p,m)=>{if(d.hasChild(p)){const E=e.serverCache.getNode().getImmediateChild(p),R=Zf(n,E,m);c=na(n,c,new he(p),R,i,r,o,l)}}),h.children.inorderTraversal((p,m)=>{const E=!e.serverCache.isCompleteForChild(p)&&m.value===null;if(!d.hasChild(p)&&!E){const R=e.serverCache.getNode().getImmediateChild(p),A=Zf(n,R,m);c=na(n,c,new he(p),A,i,r,o,l)}}),c}function IR(n,e,t,s,i,r,o){if(ta(i,t)!=null)return e;const l=e.serverCache.isFiltered(),c=e.serverCache;if(s.value!=null){if(Z(t)&&c.isFullyInitialized()||c.isCompleteForPath(t))return na(n,e,t,c.getNode().getChild(t),i,r,l,o);if(Z(t)){let h=new ge(null);return c.getNode().forEachChild(Jn,(d,p)=>{h=h.set(new he(d),p)}),gc(n,e,t,h,i,r,l,o)}else return e}else{let h=new ge(null);return s.foreach((d,p)=>{const m=Ie(t,d);c.isCompleteForPath(m)&&(h=h.set(d,c.getNode().getChild(m)))}),gc(n,e,t,h,i,r,l,o)}}function bR(n,e,t,s,i){const r=e.serverCache,o=I_(e,r.getNode(),r.isFullyInitialized()||Z(t),r.isFiltered());return P_(n,o,t,s,k_,i)}function CR(n,e,t,s,i,r){let o;if(ta(s,t)!=null)return e;{const l=new Gh(s,e,i),c=e.eventCache.getNode();let h;if(Z(t)||X(t)===".priority"){let d;if(e.serverCache.isFullyInitialized())d=ea(s,os(e));else{const p=e.serverCache.getNode();D(p instanceof z,"serverChildren would be complete if leaf node"),d=$h(s,p)}d=d,h=n.filter.updateFullNode(c,d,r)}else{const d=X(t);let p=jh(s,d,e.serverCache);p==null&&e.serverCache.isCompleteForChild(d)&&(p=c.getImmediateChild(d)),p!=null?h=n.filter.updateChild(c,d,p,_e(t),l,r):e.eventCache.getNode().hasChild(d)?h=n.filter.updateChild(c,d,z.EMPTY_NODE,_e(t),l,r):h=c,h.isEmpty()&&e.serverCache.isFullyInitialized()&&(o=ea(s,os(e)),o.isLeafNode()&&(h=n.filter.updateFullNode(h,o,r)))}return o=e.serverCache.isFullyInitialized()||ta(s,le())!=null,Gi(e,h,o,n.filter.filtersNodes())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class RR{constructor(e,t){this.query_=e,this.eventRegistrations_=[];const s=this.query_._queryParams,i=new Fh(s.getIndex()),r=WC(s);this.processor_=yR(r);const o=t.serverCache,l=t.eventCache,c=i.updateFullNode(z.EMPTY_NODE,o.getNode(),null),h=r.updateFullNode(z.EMPTY_NODE,l.getNode(),null),d=new Mn(c,o.isFullyInitialized(),i.filtersNodes()),p=new Mn(h,l.isFullyInitialized(),r.filtersNodes());this.viewCache_=Na(p,d),this.eventGenerator_=new JC(this.query_)}get query(){return this.query_}}function SR(n){return n.viewCache_.serverCache.getNode()}function AR(n){return Zo(n.viewCache_)}function kR(n,e){const t=os(n.viewCache_);return t&&(n.query._queryParams.loadsAllData()||!Z(e)&&!t.getImmediateChild(X(e)).isEmpty())?t.getChild(e):null}function ep(n){return n.eventRegistrations_.length===0}function PR(n,e){n.eventRegistrations_.push(e)}function tp(n,e,t){const s=[];if(t){D(e==null,"A cancel should cancel all event registrations.");const i=n.query._path;n.eventRegistrations_.forEach(r=>{const o=r.createCancelEvent(t,i);o&&s.push(o)})}if(e){let i=[];for(let r=0;r<n.eventRegistrations_.length;++r){const o=n.eventRegistrations_[r];if(!o.matches(e))i.push(o);else if(e.hasAnyCallback()){i=i.concat(n.eventRegistrations_.slice(r+1));break}}n.eventRegistrations_=i}else n.eventRegistrations_=[];return s}function np(n,e,t,s){e.type===Ct.MERGE&&e.source.queryId!==null&&(D(os(n.viewCache_),"We should always have a full cache before handling merges"),D(Zo(n.viewCache_),"Missing event cache, even though we have a server cache"));const i=n.viewCache_,r=ER(n.processor_,i,e,t,s);return vR(n.processor_,r.viewCache),D(r.viewCache.serverCache.isFullyInitialized()||!i.serverCache.isFullyInitialized(),"Once a server snap is complete, it should never go back"),n.viewCache_=r.viewCache,N_(n,r.changes,r.viewCache.eventCache.getNode(),null)}function NR(n,e){const t=n.viewCache_.eventCache,s=[];return t.getNode().isLeafNode()||t.getNode().forEachChild(Ee,(r,o)=>{s.push($s(r,o))}),t.isFullyInitialized()&&s.push(w_(t.getNode())),N_(n,s,t.getNode(),e)}function N_(n,e,t,s){const i=s?[s]:n.eventRegistrations_;return XC(n.eventGenerator_,e,t,i)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let sa;class D_{constructor(){this.views=new Map}}function DR(n){D(!sa,"__referenceConstructor has already been defined"),sa=n}function LR(){return D(sa,"Reference.ts has not been loaded"),sa}function xR(n){return n.views.size===0}function zh(n,e,t,s){const i=e.source.queryId;if(i!==null){const r=n.views.get(i);return D(r!=null,"SyncTree gave us an op for an invalid query."),np(r,e,t,s)}else{let r=[];for(const o of n.views.values())r=r.concat(np(o,e,t,s));return r}}function L_(n,e,t,s,i){const r=e._queryIdentifier,o=n.views.get(r);if(!o){let l=ea(t,i?s:null),c=!1;l?c=!0:s instanceof z?(l=$h(t,s),c=!1):(l=z.EMPTY_NODE,c=!1);const h=Na(new Mn(l,c,!1),new Mn(s,i,!1));return new RR(e,h)}return o}function OR(n,e,t,s,i,r){const o=L_(n,e,s,i,r);return n.views.has(e._queryIdentifier)||n.views.set(e._queryIdentifier,o),PR(o,t),NR(o,t)}function MR(n,e,t,s){const i=e._queryIdentifier,r=[];let o=[];const l=Vn(n);if(i==="default")for(const[c,h]of n.views.entries())o=o.concat(tp(h,t,s)),ep(h)&&(n.views.delete(c),h.query._queryParams.loadsAllData()||r.push(h.query));else{const c=n.views.get(i);c&&(o=o.concat(tp(c,t,s)),ep(c)&&(n.views.delete(i),c.query._queryParams.loadsAllData()||r.push(c.query)))}return l&&!Vn(n)&&r.push(new(LR())(e._repo,e._path)),{removed:r,events:o}}function x_(n){const e=[];for(const t of n.views.values())t.query._queryParams.loadsAllData()||e.push(t);return e}function An(n,e){let t=null;for(const s of n.views.values())t=t||kR(s,e);return t}function O_(n,e){if(e._queryParams.loadsAllData())return La(n);{const s=e._queryIdentifier;return n.views.get(s)}}function M_(n,e){return O_(n,e)!=null}function Vn(n){return La(n)!=null}function La(n){for(const e of n.views.values())if(e.query._queryParams.loadsAllData())return e;return null}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let ia;function VR(n){D(!ia,"__referenceConstructor has already been defined"),ia=n}function FR(){return D(ia,"Reference.ts has not been loaded"),ia}let BR=1;class sp{constructor(e){this.listenProvider_=e,this.syncPointTree_=new ge(null),this.pendingWriteTree_=pR(),this.tagToQueryMap=new Map,this.queryToTagMap=new Map}}function V_(n,e,t,s,i){return nR(n.pendingWriteTree_,e,t,s,i),i?ii(n,new rs(Uh(),e,t)):[]}function UR(n,e,t,s){sR(n.pendingWriteTree_,e,t,s);const i=ge.fromObject(t);return ii(n,new js(Uh(),e,i))}function wn(n,e,t=!1){const s=iR(n.pendingWriteTree_,e);if(rR(n.pendingWriteTree_,e)){let r=new ge(null);return s.snap!=null?r=r.set(le(),!0):Ge(s.children,o=>{r=r.set(new he(o),!0)}),ii(n,new Xo(s.path,r,t))}else return[]}function kr(n,e,t){return ii(n,new rs(qh(),e,t))}function qR(n,e,t){const s=ge.fromObject(t);return ii(n,new js(qh(),e,s))}function WR(n,e){return ii(n,new hr(qh(),e))}function $R(n,e,t){const s=Kh(n,t);if(s){const i=Qh(s),r=i.path,o=i.queryId,l=rt(r,e),c=new hr(Wh(o),l);return Yh(n,r,c)}else return[]}function ra(n,e,t,s,i=!1){const r=e._path,o=n.syncPointTree_.get(r);let l=[];if(o&&(e._queryIdentifier==="default"||M_(o,e))){const c=MR(o,e,t,s);xR(o)&&(n.syncPointTree_=n.syncPointTree_.remove(r));const h=c.removed;if(l=c.events,!i){const d=h.findIndex(m=>m._queryParams.loadsAllData())!==-1,p=n.syncPointTree_.findOnPath(r,(m,E)=>Vn(E));if(d&&!p){const m=n.syncPointTree_.subtree(r);if(!m.isEmpty()){const E=zR(m);for(let R=0;R<E.length;++R){const A=E[R],P=A.query,V=q_(n,A);n.listenProvider_.startListening(Hi(P),ur(n,P),V.hashFn,V.onComplete)}}}!p&&h.length>0&&!s&&(d?n.listenProvider_.stopListening(Hi(e),null):h.forEach(m=>{const E=n.queryToTagMap.get(xa(m));n.listenProvider_.stopListening(Hi(m),E)}))}HR(n,h)}return l}function F_(n,e,t,s){const i=Kh(n,s);if(i!=null){const r=Qh(i),o=r.path,l=r.queryId,c=rt(o,e),h=new rs(Wh(l),c,t);return Yh(n,o,h)}else return[]}function jR(n,e,t,s){const i=Kh(n,s);if(i){const r=Qh(i),o=r.path,l=r.queryId,c=rt(o,e),h=ge.fromObject(t),d=new js(Wh(l),c,h);return Yh(n,o,d)}else return[]}function _c(n,e,t,s=!1){const i=e._path;let r=null,o=!1;n.syncPointTree_.foreachOnPath(i,(m,E)=>{const R=rt(m,i);r=r||An(E,R),o=o||Vn(E)});let l=n.syncPointTree_.get(i);l?(o=o||Vn(l),r=r||An(l,le())):(l=new D_,n.syncPointTree_=n.syncPointTree_.set(i,l));let c;r!=null?c=!0:(c=!1,r=z.EMPTY_NODE,n.syncPointTree_.subtree(i).foreachChild((E,R)=>{const A=An(R,le());A&&(r=r.updateImmediateChild(E,A))}));const h=M_(l,e);if(!h&&!e._queryParams.loadsAllData()){const m=xa(e);D(!n.queryToTagMap.has(m),"View does not exist, but we have a tag");const E=KR();n.queryToTagMap.set(m,E),n.tagToQueryMap.set(E,m)}const d=Da(n.pendingWriteTree_,i);let p=OR(l,e,t,d,r,c);if(!h&&!o&&!s){const m=O_(l,e);p=p.concat(QR(n,e,m))}return p}function Hh(n,e,t){const i=n.pendingWriteTree_,r=n.syncPointTree_.findOnPath(e,(o,l)=>{const c=rt(o,e),h=An(l,c);if(h)return h});return R_(i,e,r,t,!0)}function GR(n,e){const t=e._path;let s=null;n.syncPointTree_.foreachOnPath(t,(h,d)=>{const p=rt(h,t);s=s||An(d,p)});let i=n.syncPointTree_.get(t);i?s=s||An(i,le()):(i=new D_,n.syncPointTree_=n.syncPointTree_.set(t,i));const r=s!=null,o=r?new Mn(s,!0,!1):null,l=Da(n.pendingWriteTree_,e._path),c=L_(i,e,l,r?o.getNode():z.EMPTY_NODE,r);return AR(c)}function ii(n,e){return B_(e,n.syncPointTree_,null,Da(n.pendingWriteTree_,le()))}function B_(n,e,t,s){if(Z(n.path))return U_(n,e,t,s);{const i=e.get(le());t==null&&i!=null&&(t=An(i,le()));let r=[];const o=X(n.path),l=n.operationForChild(o),c=e.children.get(o);if(c&&l){const h=t?t.getImmediateChild(o):null,d=S_(s,o);r=r.concat(B_(l,c,h,d))}return i&&(r=r.concat(zh(i,n,s,t))),r}}function U_(n,e,t,s){const i=e.get(le());t==null&&i!=null&&(t=An(i,le()));let r=[];return e.children.inorderTraversal((o,l)=>{const c=t?t.getImmediateChild(o):null,h=S_(s,o),d=n.operationForChild(o);d&&(r=r.concat(U_(d,l,c,h)))}),i&&(r=r.concat(zh(i,n,s,t))),r}function q_(n,e){const t=e.query,s=ur(n,t);return{hashFn:()=>(SR(e)||z.EMPTY_NODE).hash(),onComplete:i=>{if(i==="ok")return s?$R(n,t._path,s):WR(n,t._path);{const r=Wb(i,t);return ra(n,t,null,r)}}}}function ur(n,e){const t=xa(e);return n.queryToTagMap.get(t)}function xa(n){return n._path.toString()+"$"+n._queryIdentifier}function Kh(n,e){return n.tagToQueryMap.get(e)}function Qh(n){const e=n.indexOf("$");return D(e!==-1&&e<n.length-1,"Bad queryKey."),{queryId:n.substr(e+1),path:new he(n.substr(0,e))}}function Yh(n,e,t){const s=n.syncPointTree_.get(e);D(s,"Missing sync point for query tag that we're tracking");const i=Da(n.pendingWriteTree_,e);return zh(s,t,i,null)}function zR(n){return n.fold((e,t,s)=>{if(t&&Vn(t))return[La(t)];{let i=[];return t&&(i=x_(t)),Ge(s,(r,o)=>{i=i.concat(o)}),i}})}function Hi(n){return n._queryParams.loadsAllData()&&!n._queryParams.isDefault()?new(FR())(n._repo,n._path):n}function HR(n,e){for(let t=0;t<e.length;++t){const s=e[t];if(!s._queryParams.loadsAllData()){const i=xa(s),r=n.queryToTagMap.get(i);n.queryToTagMap.delete(i),n.tagToQueryMap.delete(r)}}}function KR(){return BR++}function QR(n,e,t){const s=e._path,i=ur(n,e),r=q_(n,t),o=n.listenProvider_.startListening(Hi(e),i,r.hashFn,r.onComplete),l=n.syncPointTree_.subtree(s);if(i)D(!Vn(l.value),"If we're adding a query, it shouldn't be shadowed");else{const c=l.fold((h,d,p)=>{if(!Z(h)&&d&&Vn(d))return[La(d).query];{let m=[];return d&&(m=m.concat(x_(d).map(E=>E.query))),Ge(p,(E,R)=>{m=m.concat(R)}),m}});for(let h=0;h<c.length;++h){const d=c[h];n.listenProvider_.stopListening(Hi(d),ur(n,d))}}return o}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Jh{constructor(e){this.node_=e}getImmediateChild(e){const t=this.node_.getImmediateChild(e);return new Jh(t)}node(){return this.node_}}class Xh{constructor(e,t){this.syncTree_=e,this.path_=t}getImmediateChild(e){const t=Ie(this.path_,e);return new Xh(this.syncTree_,t)}node(){return Hh(this.syncTree_,this.path_)}}const YR=function(n){return n=n||{},n.timestamp=n.timestamp||new Date().getTime(),n},ip=function(n,e,t){if(!n||typeof n!="object")return n;if(D(".sv"in n,"Unexpected leaf node or priority contents"),typeof n[".sv"]=="string")return JR(n[".sv"],e,t);if(typeof n[".sv"]=="object")return XR(n[".sv"],e);D(!1,"Unexpected server value: "+JSON.stringify(n,null,2))},JR=function(n,e,t){switch(n){case"timestamp":return t.timestamp;default:D(!1,"Unexpected server value: "+n)}},XR=function(n,e,t){n.hasOwnProperty("increment")||D(!1,"Unexpected server value: "+JSON.stringify(n,null,2));const s=n.increment;typeof s!="number"&&D(!1,"Unexpected increment value: "+s);const i=e.node();if(D(i!==null&&typeof i<"u","Expected ChildrenNode.EMPTY_NODE for nulls"),!i.isLeafNode())return s;const o=i.getValue();return typeof o!="number"?s:o+s},W_=function(n,e,t,s){return Zh(e,new Xh(t,n),s)},$_=function(n,e,t){return Zh(n,new Jh(e),t)};function Zh(n,e,t){const s=n.getPriority().val(),i=ip(s,e.getImmediateChild(".priority"),t);let r;if(n.isLeafNode()){const o=n,l=ip(o.getValue(),e,t);return l!==o.getValue()||i!==o.getPriority().val()?new Oe(l,Ne(i)):n}else{const o=n;return r=o,i!==o.getPriority().val()&&(r=r.updatePriority(new Oe(i))),o.forEachChild(Ee,(l,c)=>{const h=Zh(c,e.getImmediateChild(l),t);h!==c&&(r=r.updateImmediateChild(l,h))}),r}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class eu{constructor(e="",t=null,s={children:{},childCount:0}){this.name=e,this.parent=t,this.node=s}}function tu(n,e){let t=e instanceof he?e:new he(e),s=n,i=X(t);for(;i!==null;){const r=Os(s.node.children,i)||{children:{},childCount:0};s=new eu(i,s,r),t=_e(t),i=X(t)}return s}function ri(n){return n.node.value}function j_(n,e){n.node.value=e,yc(n)}function G_(n){return n.node.childCount>0}function ZR(n){return ri(n)===void 0&&!G_(n)}function Oa(n,e){Ge(n.node.children,(t,s)=>{e(new eu(t,n,s))})}function z_(n,e,t,s){t&&e(n),Oa(n,i=>{z_(i,e,!0)})}function eS(n,e,t){let s=n.parent;for(;s!==null;){if(e(s))return!0;s=s.parent}return!1}function Pr(n){return new he(n.parent===null?n.name:Pr(n.parent)+"/"+n.name)}function yc(n){n.parent!==null&&tS(n.parent,n.name,n)}function tS(n,e,t){const s=ZR(t),i=Bt(n.node.children,e);s&&i?(delete n.node.children[e],n.node.childCount--,yc(n)):!s&&!i&&(n.node.children[e]=t.node,n.node.childCount++,yc(n))}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const nS=/[\[\].#$\/\u0000-\u001F\u007F]/,sS=/[\[\].#$\u0000-\u001F\u007F]/,Cl=10*1024*1024,nu=function(n){return typeof n=="string"&&n.length!==0&&!nS.test(n)},H_=function(n){return typeof n=="string"&&n.length!==0&&!sS.test(n)},iS=function(n){return n&&(n=n.replace(/^\/*\.info(\/|$)/,"/")),H_(n)},vc=function(n){return n===null||typeof n=="string"||typeof n=="number"&&!Ah(n)||n&&typeof n=="object"&&Bt(n,".sv")},su=function(n,e,t,s){s&&e===void 0||Ma(la(n,"value"),e,t)},Ma=function(n,e,t){const s=t instanceof he?new TC(t,n):t;if(e===void 0)throw new Error(n+"contains undefined "+Gn(s));if(typeof e=="function")throw new Error(n+"contains a function "+Gn(s)+" with contents = "+e.toString());if(Ah(e))throw new Error(n+"contains "+e.toString()+" "+Gn(s));if(typeof e=="string"&&e.length>Cl/3&&ca(e)>Cl)throw new Error(n+"contains a string greater than "+Cl+" utf8 bytes "+Gn(s)+" ('"+e.substring(0,50)+"...')");if(e&&typeof e=="object"){let i=!1,r=!1;if(Ge(e,(o,l)=>{if(o===".value")i=!0;else if(o!==".priority"&&o!==".sv"&&(r=!0,!nu(o)))throw new Error(n+" contains an invalid key ("+o+") "+Gn(s)+`.  Keys must be non-empty strings and can't contain ".", "#", "$", "/", "[", or "]"`);IC(s,o),Ma(n,l,s),bC(s)}),i&&r)throw new Error(n+' contains ".value" child '+Gn(s)+" in addition to actual children.")}},rS=function(n,e){let t,s;for(t=0;t<e.length;t++){s=e[t];const r=or(s);for(let o=0;o<r.length;o++)if(!(r[o]===".priority"&&o===r.length-1)){if(!nu(r[o]))throw new Error(n+"contains an invalid key ("+r[o]+") in path "+s.toString()+`. Keys must be non-empty strings and can't contain ".", "#", "$", "/", "[", or "]"`)}}e.sort(wC);let i=null;for(t=0;t<e.length;t++){if(s=e[t],i!==null&&_t(i,s))throw new Error(n+"contains a path "+i.toString()+" that is ancestor of another path "+s.toString());i=s}},oS=function(n,e,t,s){const i=la(n,"values");if(!(e&&typeof e=="object")||Array.isArray(e))throw new Error(i+" must be an object containing the children to replace.");const r=[];Ge(e,(o,l)=>{const c=new he(o);if(Ma(i,l,Ie(t,c)),Lh(c)===".priority"&&!vc(l))throw new Error(i+"contains an invalid value for '"+c.toString()+"', which must be a valid Firebase priority (a string, finite number, server value, or null).");r.push(c)}),rS(i,r)},iu=function(n,e,t,s){if(!H_(t))throw new Error(la(n,e)+'was an invalid path = "'+t+`". Paths must be non-empty strings and can't contain ".", "#", "$", "[", or "]"`)},aS=function(n,e,t,s){t&&(t=t.replace(/^\/*\.info(\/|$)/,"/")),iu(n,e,t)},K_=function(n,e){if(X(e)===".info")throw new Error(n+" failed = Can't modify data under /.info/")},lS=function(n,e){const t=e.path.toString();if(typeof e.repoInfo.host!="string"||e.repoInfo.host.length===0||!nu(e.repoInfo.namespace)&&e.repoInfo.host.split(":")[0]!=="localhost"||t.length!==0&&!iS(t))throw new Error(la(n,"url")+`must be a valid firebase URL and the path can't contain ".", "#", "$", "[", or "]".`)};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class cS{constructor(){this.eventLists_=[],this.recursionDepth_=0}}function Va(n,e){let t=null;for(let s=0;s<e.length;s++){const i=e[s],r=i.getPath();t!==null&&!xh(r,t.path)&&(n.eventLists_.push(t),t=null),t===null&&(t={events:[],path:r}),t.events.push(i)}t&&n.eventLists_.push(t)}function Q_(n,e,t){Va(n,t),Y_(n,s=>xh(s,e))}function yt(n,e,t){Va(n,t),Y_(n,s=>_t(s,e)||_t(e,s))}function Y_(n,e){n.recursionDepth_++;let t=!0;for(let s=0;s<n.eventLists_.length;s++){const i=n.eventLists_[s];if(i){const r=i.path;e(r)?(hS(n.eventLists_[s]),n.eventLists_[s]=null):t=!1}}t&&(n.eventLists_=[]),n.recursionDepth_--}function hS(n){for(let e=0;e<n.events.length;e++){const t=n.events[e];if(t!==null){n.events[e]=null;const s=t.getEventRunner();$i&&qe("event: "+t.toString()),si(s)}}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const uS="repo_interrupt",dS=25;class fS{constructor(e,t,s,i){this.repoInfo_=e,this.forceRestClient_=t,this.authTokenProvider_=s,this.appCheckProvider_=i,this.dataUpdateCount=0,this.statsListener_=null,this.eventQueue_=new cS,this.nextWriteId_=1,this.interceptServerDataCallback_=null,this.onDisconnect_=Jo(),this.transactionQueueTree_=new eu,this.persistentConnection_=null,this.key=this.repoInfo_.toURLString()}toString(){return(this.repoInfo_.secure?"https://":"http://")+this.repoInfo_.host}}function pS(n,e,t){if(n.stats_=Nh(n.repoInfo_),n.forceRestClient_||zb())n.server_=new Yo(n.repoInfo_,(s,i,r,o)=>{rp(n,s,i,r,o)},n.authTokenProvider_,n.appCheckProvider_),setTimeout(()=>op(n,!0),0);else{if(typeof t<"u"&&t!==null){if(typeof t!="object")throw new Error("Only objects are supported for option databaseAuthVariableOverride");try{De(t)}catch(s){throw new Error("Invalid authOverride provided: "+s)}}n.persistentConnection_=new Zt(n.repoInfo_,e,(s,i,r,o)=>{rp(n,s,i,r,o)},s=>{op(n,s)},s=>{mS(n,s)},n.authTokenProvider_,n.appCheckProvider_,t),n.server_=n.persistentConnection_}n.authTokenProvider_.addTokenChangeListener(s=>{n.server_.refreshAuthToken(s)}),n.appCheckProvider_.addTokenChangeListener(s=>{n.server_.refreshAppCheckToken(s.token)}),n.statsReporter_=Jb(n.repoInfo_,()=>new YC(n.stats_,n.server_)),n.infoData_=new GC,n.infoSyncTree_=new sp({startListening:(s,i,r,o)=>{let l=[];const c=n.infoData_.getNode(s._path);return c.isEmpty()||(l=kr(n.infoSyncTree_,s._path,c),setTimeout(()=>{o("ok")},0)),l},stopListening:()=>{}}),ru(n,"connected",!1),n.serverSyncTree_=new sp({startListening:(s,i,r,o)=>(n.server_.listen(s,r,i,(l,c)=>{const h=o(l,c);yt(n.eventQueue_,s._path,h)}),[]),stopListening:(s,i)=>{n.server_.unlisten(s,i)}})}function J_(n){const t=n.infoData_.getNode(new he(".info/serverTimeOffset")).val()||0;return new Date().getTime()+t}function Fa(n){return YR({timestamp:J_(n)})}function rp(n,e,t,s,i){n.dataUpdateCount++;const r=new he(e);t=n.interceptServerDataCallback_?n.interceptServerDataCallback_(e,t):t;let o=[];if(i)if(s){const c=Ao(t,h=>Ne(h));o=jR(n.serverSyncTree_,r,c,i)}else{const c=Ne(t);o=F_(n.serverSyncTree_,r,c,i)}else if(s){const c=Ao(t,h=>Ne(h));o=qR(n.serverSyncTree_,r,c)}else{const c=Ne(t);o=kr(n.serverSyncTree_,r,c)}let l=r;o.length>0&&(l=zs(n,r)),yt(n.eventQueue_,l,o)}function op(n,e){ru(n,"connected",e),e===!1&&vS(n)}function mS(n,e){Ge(e,(t,s)=>{ru(n,t,s)})}function ru(n,e,t){const s=new he("/.info/"+e),i=Ne(t);n.infoData_.updateSnapshot(s,i);const r=kr(n.infoSyncTree_,s,i);yt(n.eventQueue_,s,r)}function ou(n){return n.nextWriteId_++}function gS(n,e,t){const s=GR(n.serverSyncTree_,e);return s!=null?Promise.resolve(s):n.server_.get(e).then(i=>{const r=Ne(i).withIndex(e._queryParams.getIndex());_c(n.serverSyncTree_,e,t,!0);let o;if(e._queryParams.loadsAllData())o=kr(n.serverSyncTree_,e._path,r);else{const l=ur(n.serverSyncTree_,e);o=F_(n.serverSyncTree_,e._path,r,l)}return yt(n.eventQueue_,e._path,o),ra(n.serverSyncTree_,e,t,null,!0),r},i=>(Nr(n,"get for query "+De(e)+" failed: "+i),Promise.reject(new Error(i))))}function _S(n,e,t,s,i){Nr(n,"set",{path:e.toString(),value:t,priority:s});const r=Fa(n),o=Ne(t,s),l=Hh(n.serverSyncTree_,e),c=$_(o,l,r),h=ou(n),d=V_(n.serverSyncTree_,e,c,h,!0);Va(n.eventQueue_,d),n.server_.put(e.toString(),o.val(!0),(m,E)=>{const R=m==="ok";R||ot("set at "+e+" failed: "+m);const A=wn(n.serverSyncTree_,h,!R);yt(n.eventQueue_,e,A),Ec(n,i,m,E)});const p=lu(n,e);zs(n,p),yt(n.eventQueue_,p,[])}function yS(n,e,t,s){Nr(n,"update",{path:e.toString(),value:t});let i=!0;const r=Fa(n),o={};if(Ge(t,(l,c)=>{i=!1,o[l]=W_(Ie(e,l),Ne(c),n.serverSyncTree_,r)}),i)qe("update() called with empty data.  Don't do anything."),Ec(n,s,"ok",void 0);else{const l=ou(n),c=UR(n.serverSyncTree_,e,o,l);Va(n.eventQueue_,c),n.server_.merge(e.toString(),t,(h,d)=>{const p=h==="ok";p||ot("update at "+e+" failed: "+h);const m=wn(n.serverSyncTree_,l,!p),E=m.length>0?zs(n,e):e;yt(n.eventQueue_,E,m),Ec(n,s,h,d)}),Ge(t,h=>{const d=lu(n,Ie(e,h));zs(n,d)}),yt(n.eventQueue_,e,[])}}function vS(n){Nr(n,"onDisconnectEvents");const e=Fa(n),t=Jo();uc(n.onDisconnect_,le(),(i,r)=>{const o=W_(i,r,n.serverSyncTree_,e);T_(t,i,o)});let s=[];uc(t,le(),(i,r)=>{s=s.concat(kr(n.serverSyncTree_,i,r));const o=lu(n,i);zs(n,o)}),n.onDisconnect_=Jo(),yt(n.eventQueue_,le(),s)}function ES(n,e,t){let s;X(e._path)===".info"?s=_c(n.infoSyncTree_,e,t):s=_c(n.serverSyncTree_,e,t),Q_(n.eventQueue_,e._path,s)}function wS(n,e,t){let s;X(e._path)===".info"?s=ra(n.infoSyncTree_,e,t):s=ra(n.serverSyncTree_,e,t),Q_(n.eventQueue_,e._path,s)}function TS(n){n.persistentConnection_&&n.persistentConnection_.interrupt(uS)}function Nr(n,...e){let t="";n.persistentConnection_&&(t=n.persistentConnection_.id+":"),qe(t,...e)}function Ec(n,e,t,s){e&&si(()=>{if(t==="ok")e(null);else{const i=(t||"error").toUpperCase();let r=i;s&&(r+=": "+s);const o=new Error(r);o.code=i,e(o)}})}function X_(n,e,t){return Hh(n.serverSyncTree_,e,t)||z.EMPTY_NODE}function au(n,e=n.transactionQueueTree_){if(e||Ba(n,e),ri(e)){const t=ey(n,e);D(t.length>0,"Sending zero length transaction queue"),t.every(i=>i.status===0)&&IS(n,Pr(e),t)}else G_(e)&&Oa(e,t=>{au(n,t)})}function IS(n,e,t){const s=t.map(h=>h.currentWriteId),i=X_(n,e,s);let r=i;const o=i.hash();for(let h=0;h<t.length;h++){const d=t[h];D(d.status===0,"tryToSendTransactionQueue_: items in queue should all be run."),d.status=1,d.retryCount++;const p=rt(e,d.path);r=r.updateChild(p,d.currentOutputSnapshotRaw)}const l=r.val(!0),c=e;n.server_.put(c.toString(),l,h=>{Nr(n,"transaction put response",{path:c.toString(),status:h});let d=[];if(h==="ok"){const p=[];for(let m=0;m<t.length;m++)t[m].status=2,d=d.concat(wn(n.serverSyncTree_,t[m].currentWriteId)),t[m].onComplete&&p.push(()=>t[m].onComplete(null,!0,t[m].currentOutputSnapshotResolved)),t[m].unwatcher();Ba(n,tu(n.transactionQueueTree_,e)),au(n,n.transactionQueueTree_),yt(n.eventQueue_,e,d);for(let m=0;m<p.length;m++)si(p[m])}else{if(h==="datastale")for(let p=0;p<t.length;p++)t[p].status===3?t[p].status=4:t[p].status=0;else{ot("transaction at "+c.toString()+" failed: "+h);for(let p=0;p<t.length;p++)t[p].status=4,t[p].abortReason=h}zs(n,e)}},o)}function zs(n,e){const t=Z_(n,e),s=Pr(t),i=ey(n,t);return bS(n,i,s),s}function bS(n,e,t){if(e.length===0)return;const s=[];let i=[];const o=e.filter(l=>l.status===0).map(l=>l.currentWriteId);for(let l=0;l<e.length;l++){const c=e[l],h=rt(t,c.path);let d=!1,p;if(D(h!==null,"rerunTransactionsUnderNode_: relativePath should not be null."),c.status===4)d=!0,p=c.abortReason,i=i.concat(wn(n.serverSyncTree_,c.currentWriteId,!0));else if(c.status===0)if(c.retryCount>=dS)d=!0,p="maxretry",i=i.concat(wn(n.serverSyncTree_,c.currentWriteId,!0));else{const m=X_(n,c.path,o);c.currentInputSnapshot=m;const E=e[l].update(m.val());if(E!==void 0){Ma("transaction failed: Data returned ",E,c.path);let R=Ne(E);typeof E=="object"&&E!=null&&Bt(E,".priority")||(R=R.updatePriority(m.getPriority()));const P=c.currentWriteId,V=Fa(n),U=$_(R,m,V);c.currentOutputSnapshotRaw=R,c.currentOutputSnapshotResolved=U,c.currentWriteId=ou(n),o.splice(o.indexOf(P),1),i=i.concat(V_(n.serverSyncTree_,c.path,U,c.currentWriteId,c.applyLocally)),i=i.concat(wn(n.serverSyncTree_,P,!0))}else d=!0,p="nodata",i=i.concat(wn(n.serverSyncTree_,c.currentWriteId,!0))}yt(n.eventQueue_,t,i),i=[],d&&(e[l].status=2,function(m){setTimeout(m,Math.floor(0))}(e[l].unwatcher),e[l].onComplete&&(p==="nodata"?s.push(()=>e[l].onComplete(null,!1,e[l].currentInputSnapshot)):s.push(()=>e[l].onComplete(new Error(p),!1,null))))}Ba(n,n.transactionQueueTree_);for(let l=0;l<s.length;l++)si(s[l]);au(n,n.transactionQueueTree_)}function Z_(n,e){let t,s=n.transactionQueueTree_;for(t=X(e);t!==null&&ri(s)===void 0;)s=tu(s,t),e=_e(e),t=X(e);return s}function ey(n,e){const t=[];return ty(n,e,t),t.sort((s,i)=>s.order-i.order),t}function ty(n,e,t){const s=ri(e);if(s)for(let i=0;i<s.length;i++)t.push(s[i]);Oa(e,i=>{ty(n,i,t)})}function Ba(n,e){const t=ri(e);if(t){let s=0;for(let i=0;i<t.length;i++)t[i].status!==2&&(t[s]=t[i],s++);t.length=s,j_(e,t.length>0?t:void 0)}Oa(e,s=>{Ba(n,s)})}function lu(n,e){const t=Pr(Z_(n,e)),s=tu(n.transactionQueueTree_,e);return eS(s,i=>{Rl(n,i)}),Rl(n,s),z_(s,i=>{Rl(n,i)}),t}function Rl(n,e){const t=ri(e);if(t){const s=[];let i=[],r=-1;for(let o=0;o<t.length;o++)t[o].status===3||(t[o].status===1?(D(r===o-1,"All SENT items should be at beginning of queue."),r=o,t[o].status=3,t[o].abortReason="set"):(D(t[o].status===0,"Unexpected transaction status in abort"),t[o].unwatcher(),i=i.concat(wn(n.serverSyncTree_,t[o].currentWriteId,!0)),t[o].onComplete&&s.push(t[o].onComplete.bind(null,new Error("set"),!1,null))));r===-1?j_(e,void 0):t.length=r+1,yt(n.eventQueue_,Pr(e),i);for(let o=0;o<s.length;o++)si(s[o])}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function CS(n){let e="";const t=n.split("/");for(let s=0;s<t.length;s++)if(t[s].length>0){let i=t[s];try{i=decodeURIComponent(i.replace(/\+/g," "))}catch{}e+="/"+i}return e}function RS(n){const e={};n.charAt(0)==="?"&&(n=n.substring(1));for(const t of n.split("&")){if(t.length===0)continue;const s=t.split("=");s.length===2?e[decodeURIComponent(s[0])]=decodeURIComponent(s[1]):ot(`Invalid query segment '${t}' in query '${n}'`)}return e}const ap=function(n,e){const t=SS(n),s=t.namespace;t.domain==="firebase.com"&&rn(t.host+" is no longer supported. Please use <YOUR FIREBASE>.firebaseio.com instead"),(!s||s==="undefined")&&t.domain!=="localhost"&&rn("Cannot parse Firebase url. Please use https://<YOUR FIREBASE>.firebaseio.com"),t.secure||Vb();const i=t.scheme==="ws"||t.scheme==="wss";return{repoInfo:new i_(t.host,t.secure,s,i,e,"",s!==t.subdomain),path:new he(t.pathString)}},SS=function(n){let e="",t="",s="",i="",r="",o=!0,l="https",c=443;if(typeof n=="string"){let h=n.indexOf("//");h>=0&&(l=n.substring(0,h-1),n=n.substring(h+2));let d=n.indexOf("/");d===-1&&(d=n.length);let p=n.indexOf("?");p===-1&&(p=n.length),e=n.substring(0,Math.min(d,p)),d<p&&(i=CS(n.substring(d,p)));const m=RS(n.substring(Math.min(n.length,p)));h=e.indexOf(":"),h>=0?(o=l==="https"||l==="wss",c=parseInt(e.substring(h+1),10)):h=e.length;const E=e.slice(0,h);if(E.toLowerCase()==="localhost")t="localhost";else if(E.split(".").length<=2)t=E;else{const R=e.indexOf(".");s=e.substring(0,R).toLowerCase(),t=e.substring(R+1),r=s}"ns"in m&&(r=m.ns)}return{host:e,port:c,domain:t,subdomain:s,secure:o,scheme:l,pathString:i,namespace:r}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const lp="-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz",AS=function(){let n=0;const e=[];return function(t){const s=t===n;n=t;let i;const r=new Array(8);for(i=7;i>=0;i--)r[i]=lp.charAt(t%64),t=Math.floor(t/64);D(t===0,"Cannot push at time == 0");let o=r.join("");if(s){for(i=11;i>=0&&e[i]===63;i--)e[i]=0;e[i]++}else for(i=0;i<12;i++)e[i]=Math.floor(Math.random()*64);for(i=0;i<12;i++)o+=lp.charAt(e[i]);return D(o.length===20,"nextPushId: Length should be 20."),o}}();/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ny{constructor(e,t,s,i){this.eventType=e,this.eventRegistration=t,this.snapshot=s,this.prevName=i}getPath(){const e=this.snapshot.ref;return this.eventType==="value"?e._path:e.parent._path}getEventType(){return this.eventType}getEventRunner(){return this.eventRegistration.getEventRunner(this)}toString(){return this.getPath().toString()+":"+this.eventType+":"+De(this.snapshot.exportVal())}}class sy{constructor(e,t,s){this.eventRegistration=e,this.error=t,this.path=s}getPath(){return this.path}getEventType(){return"cancel"}getEventRunner(){return this.eventRegistration.getEventRunner(this)}toString(){return this.path.toString()+":cancel"}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class iy{constructor(e,t){this.snapshotCallback=e,this.cancelCallback=t}onValue(e,t){this.snapshotCallback.call(null,e,t)}onCancel(e){return D(this.hasCancelCallback,"Raising a cancel event on a listener with no cancel callback"),this.cancelCallback.call(null,e)}get hasCancelCallback(){return!!this.cancelCallback}matches(e){return this.snapshotCallback===e.snapshotCallback||this.snapshotCallback.userCallback!==void 0&&this.snapshotCallback.userCallback===e.snapshotCallback.userCallback&&this.snapshotCallback.context===e.snapshotCallback.context}}/**
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
 */class Dr{constructor(e,t,s,i){this._repo=e,this._path=t,this._queryParams=s,this._orderByCalled=i}get key(){return Z(this._path)?null:Lh(this._path)}get ref(){return new Ut(this._repo,this._path)}get _queryIdentifier(){const e=Hf(this._queryParams),t=kh(e);return t==="{}"?"default":t}get _queryObject(){return Hf(this._queryParams)}isEqual(e){if(e=me(e),!(e instanceof Dr))return!1;const t=this._repo===e._repo,s=xh(this._path,e._path),i=this._queryIdentifier===e._queryIdentifier;return t&&s&&i}toJSON(){return this.toString()}toString(){return this._repo.toString()+EC(this._path)}}function kS(n,e){if(n._orderByCalled===!0)throw new Error(e+": You can't combine multiple orderBy calls.")}function ry(n){let e=null,t=null;if(n.hasStart()&&(e=n.getIndexStartValue()),n.hasEnd()&&(t=n.getIndexEndValue()),n.getIndex()===Jn){const s="Query: When ordering by key, you may only pass one argument to startAt(), endAt(), or equalTo().",i="Query: When ordering by key, the argument passed to startAt(), startAfter(), endAt(), endBefore(), or equalTo() must be a string.";if(n.hasStart()){if(n.getIndexStartName()!==is)throw new Error(s);if(typeof e!="string")throw new Error(i)}if(n.hasEnd()){if(n.getIndexEndName()!==xn)throw new Error(s);if(typeof t!="string")throw new Error(i)}}else if(n.getIndex()===Ee){if(e!=null&&!vc(e)||t!=null&&!vc(t))throw new Error("Query: When ordering by priority, the first argument passed to startAt(), startAfter() endAt(), endBefore(), or equalTo() must be a valid priority value (null, a number, or a string).")}else if(D(n.getIndex()instanceof Vh||n.getIndex()===E_,"unknown index type."),e!=null&&typeof e=="object"||t!=null&&typeof t=="object")throw new Error("Query: First argument passed to startAt(), startAfter(), endAt(), endBefore(), or equalTo() cannot be an object.")}function PS(n){if(n.hasStart()&&n.hasEnd()&&n.hasLimit()&&!n.hasAnchoredLimit())throw new Error("Query: Can't combine startAt(), startAfter(), endAt(), endBefore(), and limit(). Use limitToFirst() or limitToLast() instead.")}class Ut extends Dr{constructor(e,t){super(e,t,new Bh,!1)}get parent(){const e=f_(this._path);return e===null?null:new Ut(this._repo,e)}get root(){let e=this;for(;e.parent!==null;)e=e.parent;return e}}class Hs{constructor(e,t,s){this._node=e,this.ref=t,this._index=s}get priority(){return this._node.getPriority().val()}get key(){return this.ref.key}get size(){return this._node.numChildren()}child(e){const t=new he(e),s=Ks(this.ref,e);return new Hs(this._node.getChild(t),s,Ee)}exists(){return!this._node.isEmpty()}exportVal(){return this._node.val(!0)}forEach(e){return this._node.isLeafNode()?!1:!!this._node.forEachChild(this._index,(s,i)=>e(new Hs(i,Ks(this.ref,s),Ee)))}hasChild(e){const t=new he(e);return!this._node.getChild(t).isEmpty()}hasChildren(){return this._node.isLeafNode()?!1:!this._node.isEmpty()}toJSON(){return this.exportVal()}val(){return this._node.val()}}function Sl(n,e){return n=me(n),n._checkNotDeleted("ref"),Ks(n._root,e)}function Ks(n,e){return n=me(n),X(n._path)===null?aS("child","path",e):iu("child","path",e),new Ut(n._repo,Ie(n._path,e))}function NS(n,e){n=me(n),K_("push",n._path),su("push",e,n._path,!0);const t=J_(n._repo),s=AS(t),i=Ks(n,s),r=Ks(n,s);let o;return e!=null?o=DS(r,e).then(()=>r):o=Promise.resolve(r),i.then=o.then.bind(o),i.catch=o.then.bind(o,void 0),i}function DS(n,e){n=me(n),K_("set",n._path),su("set",e,n._path,!1);const t=new dr;return _S(n._repo,n._path,e,null,t.wrapCallback(()=>{})),t.promise}function LS(n,e){oS("update",e,n._path);const t=new dr;return yS(n._repo,n._path,e,t.wrapCallback(()=>{})),t.promise}function xS(n){n=me(n);const e=new iy(()=>{}),t=new cu(e);return gS(n._repo,n,t).then(s=>new Hs(s,new Ut(n._repo,n._path),n._queryParams.getIndex()))}class cu{constructor(e){this.callbackContext=e}respondsTo(e){return e==="value"}createEvent(e,t){const s=t._queryParams.getIndex();return new ny("value",this,new Hs(e.snapshotNode,new Ut(t._repo,t._path),s))}getEventRunner(e){return e.getEventType()==="cancel"?()=>this.callbackContext.onCancel(e.error):()=>this.callbackContext.onValue(e.snapshot,null)}createCancelEvent(e,t){return this.callbackContext.hasCancelCallback?new sy(this,e,t):null}matches(e){return e instanceof cu?!e.callbackContext||!this.callbackContext?!0:e.callbackContext.matches(this.callbackContext):!1}hasAnyCallback(){return this.callbackContext!==null}}class hu{constructor(e,t){this.eventType=e,this.callbackContext=t}respondsTo(e){let t=e==="children_added"?"child_added":e;return t=t==="children_removed"?"child_removed":t,this.eventType===t}createCancelEvent(e,t){return this.callbackContext.hasCancelCallback?new sy(this,e,t):null}createEvent(e,t){D(e.childName!=null,"Child events should have a childName.");const s=Ks(new Ut(t._repo,t._path),e.childName),i=t._queryParams.getIndex();return new ny(e.type,this,new Hs(e.snapshotNode,s,i),e.prevName)}getEventRunner(e){return e.getEventType()==="cancel"?()=>this.callbackContext.onCancel(e.error):()=>this.callbackContext.onValue(e.snapshot,e.prevName)}matches(e){return e instanceof hu?this.eventType===e.eventType&&(!this.callbackContext||!e.callbackContext||this.callbackContext.matches(e.callbackContext)):!1}hasAnyCallback(){return!!this.callbackContext}}function OS(n,e,t,s,i){const r=new iy(t,void 0),o=new hu(e,r);return ES(n._repo,n,o),()=>wS(n._repo,n,o)}function MS(n,e,t,s){return OS(n,"child_added",e)}class oy{}class VS extends oy{constructor(e,t){super(),this._value=e,this._key=t,this.type="endAt"}_apply(e){su("endAt",this._value,e._path,!0);const t=$C(e._queryParams,this._value,this._key);if(PS(t),ry(t),e._queryParams.hasEnd())throw new Error("endAt: Starting point was already set (by another call to endAt, endBefore or equalTo).");return new Dr(e._repo,e._path,t,e._orderByCalled)}}function FS(n,e){return new VS(n,e)}class BS extends oy{constructor(e){super(),this._path=e,this.type="orderByChild"}_apply(e){kS(e,"orderByChild");const t=new he(this._path);if(Z(t))throw new Error("orderByChild: cannot pass in empty path. Use orderByValue() instead.");const s=new Vh(t),i=jC(e._queryParams,s);return ry(i),new Dr(e._repo,e._path,i,!0)}}function US(n){return iu("orderByChild","path",n),new BS(n)}function qS(n,...e){let t=me(n);for(const s of e)t=s._apply(t);return t}DR(Ut);VR(Ut);/**
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
 */const WS="FIREBASE_DATABASE_EMULATOR_HOST",wc={};let $S=!1;function jS(n,e,t,s){n.repoInfo_=new i_(`${e}:${t}`,!1,n.repoInfo_.namespace,n.repoInfo_.webSocketOnly,n.repoInfo_.nodeAdmin,n.repoInfo_.persistenceKey,n.repoInfo_.includeNamespaceInQueryParams,!0),s&&(n.authTokenProvider_=s)}function GS(n,e,t,s,i){let r=s||n.options.databaseURL;r===void 0&&(n.options.projectId||rn("Can't determine Firebase Database URL. Be sure to include  a Project ID when calling firebase.initializeApp()."),qe("Using default host for project ",n.options.projectId),r=`${n.options.projectId}-default-rtdb.firebaseio.com`);let o=ap(r,i),l=o.repoInfo,c;typeof process<"u"&&kf&&(c=kf[WS]),c?(r=`http://${c}?ns=${l.namespace}`,o=ap(r,i),l=o.repoInfo):o.repoInfo.secure;const h=new Kb(n.name,n.options,e);lS("Invalid Firebase Database URL",o),Z(o.path)||rn("Database URL must point to the root of a Firebase Database (not including a child path).");const d=HS(l,n,h,new Hb(n.name,t));return new KS(d,n)}function zS(n,e){const t=wc[e];(!t||t[n.key]!==n)&&rn(`Database ${e}(${n.repoInfo_}) has already been deleted.`),TS(n),delete t[n.key]}function HS(n,e,t,s){let i=wc[e.name];i||(i={},wc[e.name]=i);let r=i[n.toURLString()];return r&&rn("Database initialized multiple times. Please make sure the format of the database URL matches with each database() call."),r=new fS(n,$S,t,s),i[n.toURLString()]=r,r}class KS{constructor(e,t){this._repoInternal=e,this.app=t,this.type="database",this._instanceStarted=!1}get _repo(){return this._instanceStarted||(pS(this._repoInternal,this.app.options.appId,this.app.options.databaseAuthVariableOverride),this._instanceStarted=!0),this._repoInternal}get _root(){return this._rootInternal||(this._rootInternal=new Ut(this._repo,le())),this._rootInternal}_delete(){return this._rootInternal!==null&&(zS(this._repo,this.app.name),this._repoInternal=null,this._rootInternal=null),Promise.resolve()}_checkNotDeleted(e){this._rootInternal===null&&rn("Cannot call "+e+" on a deleted database.")}}function QS(n=Nc(),e){const t=ua(n,"database").getImmediate({identifier:e});if(!t._instanceStarted){const s=Np("database");s&&YS(t,...s)}return t}function YS(n,e,t,s={}){n=me(n),n._checkNotDeleted("useEmulator"),n._instanceStarted&&rn("Cannot call useEmulator() after instance has already been initialized.");const i=n._repoInternal;let r;if(i.repoInfo_.nodeAdmin)s.mockUserToken&&rn('mockUserToken is not supported by the Admin SDK. For client access with mock users, please use the "firebase" package instead of "firebase-admin".'),r=new Eo(Eo.OWNER);else if(s.mockUserToken){const o=typeof s.mockUserToken=="string"?s.mockUserToken:xp(s.mockUserToken,n.app.options.projectId);r=new Eo(o)}jS(i,e,t,r)}/**
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
 */function JS(n){Nb(as),Xn(new Pn("database",(e,{instanceIdentifier:t})=>{const s=e.getProvider("app").getImmediate(),i=e.getProvider("auth-internal"),r=e.getProvider("app-check-internal");return GS(s,i,r,t)},"PUBLIC").setMultipleInstances(!0)),Nt(Pf,Nf,n),Nt(Pf,Nf,"esm2017")}/**
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
 */const XS={".sv":"timestamp"};function ZS(){return XS}Zt.prototype.simpleListen=function(n,e){this.sendRequest("q",{p:n},e)};Zt.prototype.echo=function(n,e){this.sendRequest("echo",{d:n},e)};JS();const gn=n=>atob(n),eA={apiKey:gn("QUl6YVN5Q2FUUWE2Sm9NajJNQmdEZ2Rwb25WQllfTkFlUU84X3Vz"),authDomain:gn("a2lja2VyaGF4LW9ubGluZS5maXJlYmFzYXBwLmNvbQ=="),databaseURL:gn("aHR0cHM6Ly9raWNrZXJoYXgtb25saW5lLWRlZmF1bHQtcnRkYi5maXJlYmFzZWlvLmNvbQ=="),projectId:gn("a2lja2VyaGF4LW9ubGluZQ=="),storageBucket:gn("a2lja2VyaGF4LW9ubGluZS5maXJlYmFzdG9yYWdlLmFwcA=="),messagingSenderId:gn("MzM3NTk4NDY1MTcw"),appId:gn("MTozMzc1OTg0NjUxNzA6d2ViOjE5MDU0YWI4NDBkODBkMmMyMDUyNGI="),measurementId:gn("Ry0xWjhWN0NWRkcw")},uu=Bp(eA),Al=ST(uu),ct=mb(uu),kl=QS(uu),Je={async loginWithGoogle(){const n=new Ht,e=await Mw(Al,n),t=e.user,s=jt(ct,"users",t.uid);if((await yl(s)).exists())await Af(s,{lastLogin:new Date().toISOString()});else{const r=Math.floor(Math.random()*9e3)+1e3,l=`${(t.displayName||"Jogador").replace(/\s+/g,"").replace(/[^a-zA-Z0-9]/g,"").toLowerCase()}${r}`.substring(0,12),c={uid:t.uid,username:l,displayName:l,badge:"👤",bio:"",level:1,xp:0,isNewUser:!0,dateCreated:new Date().toISOString(),lastLogin:new Date().toISOString(),settings:{volume:80,quality:"high",fieldSize:"medium"}},h={uid:t.uid,matchesPlayed:0,wins:0,losses:0,draws:0,goals:0,assists:0,saves:0};await vl(jt(ct,"users",t.uid),c),await vl(jt(ct,"stats",t.uid),h)}return e},async logout(){return await gw(Al)},subscribeToAuth(n){return mw(Al,n)},async getUserProfile(n){const e=jt(ct,"users",n),t=await yl(e);return t.exists()?t.data():null},async updateUserProfile(n,e){const t=jt(ct,"users",n);await Af(t,e)},async getUserStats(n){const e=jt(ct,"stats",n),t=await yl(e);return t.exists()?t.data():null},async saveMatchResult(n,e,t,s,i,r,o,l){const c=jt(ct,"stats",n),h=jt(ct,"users",n);await Pb(ct,async d=>{const p=await d.get(c),m=await d.get(h);if(!p.exists()||!m.exists())throw new Error("Documento não encontrado");const E=p.data(),R=m.data(),A={matchesPlayed:(E.matchesPlayed||0)+1,wins:(E.wins||0)+(e?1:0),losses:(E.losses||0)+(t?1:0),draws:(E.draws||0)+(s?1:0),goals:(E.goals||0)+i,assists:(E.assists||0)+r,saves:(E.saves||0)+o};let P=(R.xp||0)+l,V=R.level||1,U=V*100;for(;P>=U;)P-=U,V++,U=V*100;d.update(c,A),d.update(h,{xp:P,level:V,lastLogin:new Date().toISOString()})})},async addMatchToHistory(n){const e=jt(Ti(ct,"history"));await vl(e,n)},async getRecentHistory(n,e=5){const t=Ti(ct,"history"),s=io(t,Cf("playerUids","array-contains",n),_l(20)),i=await ro(s),r=[];return i.forEach(o=>r.push({id:o.id,...o.data()})),r.sort((o,l)=>new Date(l.date)-new Date(o.date)),r.slice(0,e)},async getGlobalRanking(n="wins",e=10){let t;if(n==="level"){const s=Ti(ct,"users");t=io(s,gl("level","desc"),gl("xp","desc"),_l(e));const i=await ro(t),r=[];for(const o of i.docs){const l=o.data(),c=await this.getUserStats(l.uid)||{};r.push({username:l.username,displayName:l.username,badge:l.badge,level:l.level,wins:c.wins||0,losses:c.losses||0,goals:c.goals||0})}return r}else{const s=Ti(ct,"stats");t=io(s,gl(n,"desc"),_l(e));const i=await ro(t),r=[];for(const o of i.docs){const l=o.data(),c=await this.getUserProfile(l.uid);c&&r.push({username:c.username,displayName:c.username,badge:c.badge,level:c.level,wins:l.wins||0,losses:l.losses||0,goals:l.goals||0})}return r}},async isUsernameUnique(n,e){const t=io(Ti(ct,"users"),Cf("username","==",n.toLowerCase())),s=await ro(t);let i=!0;return s.forEach(r=>{r.id!==e&&(i=!1)}),i},async pruneOldChatMessages(){try{const n=Sl(kl,"globalChat"),e=Date.now()-72e5,t=qS(n,US("timestamp"),FS(e)),s=await xS(t);if(s.exists()){const i={};s.forEach(r=>{i[r.key]=null}),await LS(n,i)}}catch(n){console.warn("Pruning skipped or unauthorized:",n)}},async sendGlobalChatMessage(n,e){this.pruneOldChatMessages().catch(s=>console.warn(s));const t=Sl(kl,"globalChat");await NS(t,{uid:n.uid,username:n.username,badge:n.badge||"👤",text:e,timestamp:ZS()})},subscribeToGlobalChat(n){const e=Sl(kl,"globalChat");MS(e,t=>{n(t.val())})}};function ce(n,e="info"){if(!document.getElementById("toast-style")){const r=document.createElement("style");r.id="toast-style",r.textContent=`
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
    `,document.head.appendChild(r)}let t=document.querySelector(".toast-container");t||(t=document.createElement("div"),t.className="toast-container",document.body.appendChild(t));const s=document.createElement("div");s.className=`toast toast-${e}`;let i="ℹ️";e==="success"&&(i="✅"),e==="error"&&(i="❌"),s.innerHTML=`<span>${i}</span> <span>${n}</span>`,t.appendChild(s),setTimeout(()=>s.classList.add("show"),50),setTimeout(()=>{s.classList.remove("show"),setTimeout(()=>s.remove(),250)},3500)}const tA={init(){const n=document.getElementById("btn-google-login");n&&n.addEventListener("click",async()=>{try{ce("Iniciando login com Google...","info"),await Je.loginWithGoogle(),ce("Login realizado com sucesso!","success")}catch(e){ce(e.message||"Erro ao entrar com Google.","error")}})}};function nA(n){const e=(n??"").toString();if(!e)return[];try{const t=new Intl.Segmenter(void 0,{granularity:"grapheme"});return Array.from(t.segment(e),s=>s.segment)}catch{return Array.from(e)}}function sA(n){return new RegExp("\\p{Extended_Pictographic}","u").test(n||"")}const Ue={currentUser:null,profileData:null,async init(n){if(this.currentUser=n,!n)return;const e=document.getElementById("menu-btn-play");e&&(e.onclick=()=>$.show("mode-select-screen"));const t=document.getElementById("menu-btn-profile");t&&(t.onclick=()=>$.show("profile-screen"));const s=document.getElementById("menu-quick-profile");s&&(s.onclick=()=>$.show("profile-screen"));const i=document.getElementById("menu-btn-ranking");i&&(i.onclick=()=>$.show("ranking-screen"));const r=document.getElementById("menu-btn-settings");r&&(r.onclick=()=>$.show("settings-screen"));const o=document.getElementById("menu-btn-controls");o&&(o.onclick=()=>$.show("controls-screen"));const l=document.getElementById("menu-btn-credits");l&&(l.onclick=()=>$.show("credits-screen"));const c=document.getElementById("menu-btn-logout");c&&(c.onclick=async()=>{try{await Je.logout(),ce("Desconectado com sucesso.","info")}catch{ce("Erro ao sair da conta.","error")}});const h=document.getElementById("credits-btn-back");h&&(h.onclick=()=>$.show("menu-screen")),$.register("menu-screen",{onEnter:()=>this.refreshQuickProfile()}),$.register("profile-screen",{onEnter:()=>this.loadProfileScreen()});const d=document.getElementById("profile-btn-back");d&&(d.onclick=()=>$.show("menu-screen"));const p=document.getElementById("profile-btn-save");p&&(p.onclick=async()=>{await this.saveProfileEdits()});const m=document.getElementById("profile-badge-select"),E=document.getElementById("profile-avatar-display");m&&E&&m.addEventListener("change",R=>{this.updateAvatarDisplay(E,R.target.value)}),await this.refreshQuickProfile()},async refreshQuickProfile(){if(this.currentUser)try{if(this.profileData=await Je.getUserProfile(this.currentUser.uid),!this.profileData)return;const n=document.getElementById("quick-profile-flag"),e=document.getElementById("quick-profile-name"),t=document.getElementById("quick-profile-level"),s=document.getElementById("quick-avatar-char"),i=document.querySelector(".quick-xp-fill");if(n&&(n.textContent=this.profileData.badge||"🇧🇷"),e&&(e.textContent=this.profileData.displayName||this.profileData.username),t&&(t.textContent=this.profileData.level||1),s&&(s.textContent=this.profileData.badge||"👤"),i){const r=this.profileData.level||1,o=this.profileData.xp||0,l=r*100,c=Math.min(100,Math.max(0,o/l*100));i.style.width=`${c}%`}}catch(n){console.error("Erro ao carregar perfil rápido:",n)}},async loadProfileScreen(){if(!this.currentUser||!this.profileData)return;this.profileData=await Je.getUserProfile(this.currentUser.uid);const n=document.getElementById("profile-username-input"),e=document.getElementById("profile-badge-select"),t=document.getElementById("profile-bio-input"),s=document.getElementById("profile-avatar-display");n&&(n.value=this.profileData.username||""),e&&(e.value=this.profileData.badge||"👤"),t&&(t.value=this.profileData.bio||""),s&&this.updateAvatarDisplay(s,this.profileData.badge);const i=await Je.getUserStats(this.currentUser.uid);if(i){const o=i.matchesPlayed>0?Math.round(i.wins/i.matchesPlayed*100):0;document.getElementById("stats-played").textContent=i.matchesPlayed||0,document.getElementById("stats-wins").textContent=i.wins||0,document.getElementById("stats-losses").textContent=i.losses||0,document.getElementById("stats-winrate").textContent=`${o}%`,document.getElementById("stats-goals").textContent=i.goals||0,document.getElementById("stats-assists").textContent=i.assists||0,document.getElementById("stats-saves").textContent=i.saves||0,document.getElementById("stats-level").textContent=this.profileData.level||1,document.getElementById("stats-xp").textContent=this.profileData.xp||0}const r=document.getElementById("profile-match-history");if(r){r.innerHTML='<div class="subtext">Carregando histórico...</div>';try{const o=await Je.getRecentHistory(this.currentUser.uid);o.length===0?r.innerHTML='<div class="subtext">Nenhuma partida recente.</div>':(r.innerHTML="",o.forEach(l=>{const c=document.createElement("div");c.className="history-item";let h="draw",d="Empate";l.winner==="draw"?(h="draw",d="Empate"):l.winner===l.playerTeams[this.currentUser.uid]?(h="win",d="Vitória"):(h="loss",d="Derrota");const p=new Date(l.date).toLocaleDateString("pt-BR");c.innerHTML=`
              <span>📅 ${p} - ${l.mode==="solo"?"vs CPU":"Online"}</span>
              <span>${l.scoreRed} : ${l.scoreBlue}</span>
              <span class="history-result ${h}">${d}</span>
            `,r.appendChild(c)}))}catch{r.innerHTML='<div class="subtext text-danger">Erro ao carregar histórico.</div>'}}},async saveProfileEdits(){if(!this.currentUser)return;const n=document.getElementById("profile-username-input"),e=document.getElementById("profile-badge-select"),t=document.getElementById("profile-bio-input"),s=n?n.value.trim().toLowerCase():"",i=e?e.value:"👤",r=t?t.value.trim():"";if(s.length<3||s.length>12)return ce("O nome de usuário precisa ter entre 3 e 12 caracteres.","error");if(!/^[a-zA-Z0-9_]+$/.test(s))return ce("O nome de usuário só pode conter letras, números e sublinhado (_). Sem espaços!","error");try{if(ce("Verificando disponibilidade do nome...","info"),!await Je.isUsernameUnique(s,this.currentUser.uid))return ce("Este nome de usuário já está em uso por outro jogador.","error");ce("Salvando dados...","info"),await Je.updateUserProfile(this.currentUser.uid,{username:s,displayName:s,badge:i,bio:r,isNewUser:!1}),this.profileData.username=s,this.profileData.displayName=s,this.profileData.badge=i,this.profileData.bio=r,this.profileData.isNewUser=!1;const c=document.getElementById("profile-btn-back");c&&(c.style.display=""),ce("Perfil atualizado com sucesso!","success"),await this.refreshQuickProfile(),$.show("menu-screen")}catch{ce("Erro ao atualizar perfil.","error")}},updateAvatarDisplay(n,e){n&&(n.innerHTML="",n.textContent=e||"👤")}};let Pl=null,Ai=null,ki=null,Is=null,Pi=null,Ni=null,Nl=!1,Dl=.8;function Ll(){if(!Pl)try{Pl=new(window.AudioContext||window.webkitAudioContext)}catch(n){console.warn("Web Audio API not supported",n)}return Pl}const Pt={setVolume(n){Dl=n/100,this.updateBuses()},ensureBuses(){const n=Ll();if(!n)return null;if(Ai||(Ai=n.createGain(),Ai.gain.value=Nl?0:Dl*.9,Ai.connect(n.destination)),!ki){ki=n.createGain(),ki.gain.value=.9;try{Is=n.createMediaStreamDestination(),ki.connect(Is)}catch(e){console.warn("MediaStream destination not supported for audio recording",e)}}return{ac:n,outGain:Ai,recGain:ki}},updateBuses(){const n=this.ensureBuses();if(!n)return;const{ac:e,outGain:t}=n,s=Nl?0:Dl*.9;try{t.gain.cancelScheduledValues(e.currentTime),t.gain.setTargetAtTime(s,e.currentTime,.05)}catch{}},envNoise(n=.08){try{const e=this.ensureBuses();if(!e)return null;const{ac:t,outGain:s,recGain:i}=e,r=t.createBuffer(1,t.sampleRate*2,t.sampleRate),o=r.getChannelData(0);for(let d=0;d<o.length;d++)o[d]=(Math.random()*2-1)*.35;const l=t.createBufferSource();l.buffer=r,l.loop=!0;const c=t.createBiquadFilter();c.type="lowpass",c.frequency.value=800;const h=t.createGain();return h.gain.value=n,l.connect(c),c.connect(h),h.connect(s),Is&&h.connect(i),{src:l,g:h}}catch{return null}},startCrowd(){try{const n=this.envNoise(.06);if(!n)return;Pi=n.g,n.src.start(),Ni=n.src}catch{}},stopCrowd(){if(Ni){try{Ni.stop()}catch{}Ni=null,Pi=null}},setOutputMuted(n){Nl=n,this.updateBuses()},createTone(n,e=.12,t="sine",s=.2){try{const i=this.ensureBuses();if(!i)return;const{ac:r,outGain:o,recGain:l}=i,c=r.createOscillator(),h=r.createGain();c.type=t,c.frequency.value=n,h.gain.value=s,c.connect(h),h.connect(o),Is&&h.connect(l),c.start(),h.gain.exponentialRampToValueAtTime(1e-4,r.currentTime+e),c.stop(r.currentTime+e)}catch{}},percuss(n=.18,e=.05){try{const t=this.ensureBuses();if(!t)return;const{ac:s,outGain:i,recGain:r}=t,o=s.createBuffer(1,s.sampleRate*e,s.sampleRate),l=o.getChannelData(0);for(let d=0;d<l.length;d++)l[d]+=(Math.random()*2-1)*(1-d/l.length);const c=s.createBufferSource(),h=s.createGain();h.gain.value=n,c.buffer=o,c.connect(h),h.connect(i),Is&&h.connect(r),c.start()}catch{}},playCheer(){try{if(Pi||this.startCrowd(),!Pi)return;const n=Ll(),e=Pi.gain,t=n.currentTime;e.cancelScheduledValues(t),e.setTargetAtTime(.25,t,.03),e.setTargetAtTime(.08,t+.6,.3)}catch{}},play(n){switch(n){case"kick":this.createTone(520,.05,"square",.18),this.createTone(260,.06,"square",.09);break;case"tackle":this.percuss(.22,.03),this.createTone(140,.06,"sawtooth",.22);break;case"dribble":this.createTone(800,.05,"triangle",.12),this.createTone(600,.05,"triangle",.08);break;case"power":this.createTone(360,.08,"sawtooth",.18),setTimeout(()=>this.createTone(720,.06,"square",.16),80),setTimeout(()=>this.percuss(.25,.04),120);break;case"post":this.createTone(900,.04,"square",.12),this.createTone(300,.06,"sine",.1);break;case"whistle":this.createTone(1800,.18,"sine",.12),this.createTone(1500,.18,"sine",.12);break;case"goal":this.createTone(480,.18,"triangle",.14),setTimeout(()=>this.createTone(960,.12,"sine",.12),120);break;case"cheer":this.playCheer();break}},ensureAudio(){const n=Ll();n&&n.state==="suspended"&&n.resume(),Ni||this.startCrowd()},getRecordingStreamDestination(){return this.ensureBuses(),Is}},Ki={CTRL_P1:null,CTRL_P2:null,fieldSize:"medium",dimensions:{w:1024,h:640},waitingRemap:null,defaultP1:{up:"w",down:"s",left:"a",right:"d",sprint:"ShiftLeft",shoot:" ",dribble:"f",tackle:"e",power:"q"},defaultP2:{up:"arrowup",down:"arrowdown",left:"arrowleft",right:"arrowright",sprint:"ShiftRight",shoot:"1",dribble:"2",tackle:"3",power:"enter"},actions:[{id:"up",label:"Mover Cima"},{id:"down",label:"Mover Baixo"},{id:"left",label:"Mover Esquerda"},{id:"right",label:"Mover Direita"},{id:"sprint",label:"Correr"},{id:"shoot",label:"Chutar"},{id:"dribble",label:"Driblar"},{id:"tackle",label:"Desarme"},{id:"power",label:"Power Shoot"}],init(){this.loadSettings();const n=document.getElementById("settings-volume"),e=document.getElementById("volume-val-display");n&&n.addEventListener("input",r=>{const o=r.target.value;e&&(e.textContent=`${o}%`),Pt.setVolume(o),localStorage.setItem("kicker_hax_volume",o)});const t=document.getElementById("settings-btn-back");t&&(t.onclick=()=>$.show("menu-screen"));const s=document.getElementById("controls-btn-back");s&&(s.onclick=()=>$.show("menu-screen")),window.addEventListener("keydown",r=>this.handleRemapKey(r));const i=document.getElementById("controls-btn-reset");i&&(i.onclick=()=>{this.CTRL_P1=JSON.parse(JSON.stringify(this.defaultP1)),this.CTRL_P2=JSON.parse(JSON.stringify(this.defaultP2)),this.saveControls(),this.renderRemapGrids(),ce("Controles restaurados aos padrões!","success")}),$.register("settings-screen",{onEnter:()=>{const r=localStorage.getItem("kicker_hax_volume")||"80";n&&(n.value=r),e&&(e.textContent=`${r}%`)}}),$.register("controls-screen",{onEnter:()=>{this.renderRemapGrids();const r=document.getElementById("controls-restart-warning");r&&r.classList.add("hidden")}})},loadSettings(){const n=localStorage.getItem("kicker_hax_volume")||"80";Pt.setVolume(parseInt(n,10)),this.fieldSize="medium",this.dimensions={w:1024,h:640};try{this.CTRL_P1=JSON.parse(localStorage.getItem("kicker_hax_keys_p1"))||JSON.parse(JSON.stringify(this.defaultP1)),this.CTRL_P2=JSON.parse(localStorage.getItem("kicker_hax_keys_p2"))||JSON.parse(JSON.stringify(this.defaultP2))}catch{this.CTRL_P1=JSON.parse(JSON.stringify(this.defaultP1)),this.CTRL_P2=JSON.parse(JSON.stringify(this.defaultP2))}},saveControls(){localStorage.setItem("kicker_hax_keys_p1",JSON.stringify(this.CTRL_P1)),localStorage.setItem("kicker_hax_keys_p2",JSON.stringify(this.CTRL_P2))},getKeyLabel(n){return n?n==="ShiftLeft"?"Shift Esq.":n==="ShiftRight"?"Shift Dir.":n===" "?"Espaço":n==="arrowup"?"↑":n==="arrowdown"?"↓":n==="arrowleft"?"←":n==="arrowright"?"→":n==="enter"?"Enter":n.toUpperCase():"—"},renderRemapGrids(){const n=document.getElementById("grid-controls-p1"),e=document.getElementById("grid-controls-p2");if(!n||!e)return;const t=(s,i,r)=>{s.innerHTML="",this.actions.forEach(o=>{const l=document.createElement("div");l.className="map-label",l.textContent=o.label,s.appendChild(l);const c=r[o.id],h=document.createElement("button");h.className="map-key-btn",h.textContent=this.getKeyLabel(c),h.onclick=()=>this.startRemapping(i,o.id,h),s.appendChild(h)})};t(n,1,this.CTRL_P1),t(e,2,this.CTRL_P2)},startRemapping(n,e,t){if(this.waitingRemap){const s=this.waitingRemap.btn,i=this.waitingRemap.playerNum===1?this.CTRL_P1[this.waitingRemap.actionId]:this.CTRL_P2[this.waitingRemap.actionId];s.textContent=this.getKeyLabel(i),s.classList.remove("active")}this.waitingRemap={playerNum:n,actionId:e,btn:t},t.textContent="Aguardando tecla...",t.classList.add("active")},handleRemapKey(n){if(!this.waitingRemap)return;n.preventDefault(),n.stopPropagation();const{playerNum:e,actionId:t,btn:s}=this.waitingRemap;if(s.classList.remove("active"),n.key==="Escape"){const h=e===1?this.CTRL_P1[t]:this.CTRL_P2[t];s.textContent=this.getKeyLabel(h),this.waitingRemap=null;return}if(n.key==="Backspace"){e===1?this.CTRL_P1[t]="":this.CTRL_P2[t]="",this.saveControls(),this.renderRemapGrids(),this.waitingRemap=null;return}let i=n.key.toLowerCase();(n.code==="ShiftLeft"||n.code==="ShiftRight"||n.code==="ControlLeft"||n.code==="ControlRight")&&(i=n.code);const r=e===1?this.CTRL_P1:this.CTRL_P2,o=e===1?this.CTRL_P2:this.CTRL_P1;if(Object.values(o).includes(i)&&i){s.classList.add("warn"),s.textContent="Já em uso pelo outro jogador!",setTimeout(()=>{s.classList.remove("warn");const h=e===1?this.CTRL_P1[t]:this.CTRL_P2[t];s.textContent=this.getKeyLabel(h)},1e3),this.waitingRemap=null;return}const c=Object.keys(r).find(h=>r[h]===i);if(c&&c!==t){const h=r[t];r[t]=i,r[c]=h}else r[t]=i;this.saveControls(),this.renderRemapGrids(),this.waitingRemap=null}},Ft=Object.create(null);Ft.open="0";Ft.close="1";Ft.ping="2";Ft.pong="3";Ft.message="4";Ft.upgrade="5";Ft.noop="6";const wo=Object.create(null);Object.keys(Ft).forEach(n=>{wo[Ft[n]]=n});const Tc={type:"error",data:"parser error"},ay=typeof Blob=="function"||typeof Blob<"u"&&Object.prototype.toString.call(Blob)==="[object BlobConstructor]",ly=typeof ArrayBuffer=="function",cy=n=>typeof ArrayBuffer.isView=="function"?ArrayBuffer.isView(n):n&&n.buffer instanceof ArrayBuffer,du=({type:n,data:e},t,s)=>ay&&e instanceof Blob?t?s(e):cp(e,s):ly&&(e instanceof ArrayBuffer||cy(e))?t?s(e):cp(new Blob([e]),s):s(Ft[n]+(e||"")),cp=(n,e)=>{const t=new FileReader;return t.onload=function(){const s=t.result.split(",")[1];e("b"+(s||""))},t.readAsDataURL(n)};function hp(n){return n instanceof Uint8Array?n:n instanceof ArrayBuffer?new Uint8Array(n):new Uint8Array(n.buffer,n.byteOffset,n.byteLength)}let xl;function iA(n,e){if(ay&&n.data instanceof Blob)return n.data.arrayBuffer().then(hp).then(e);if(ly&&(n.data instanceof ArrayBuffer||cy(n.data)))return e(hp(n.data));du(n,!1,t=>{xl||(xl=new TextEncoder),e(xl.encode(t))})}const up="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",Mi=typeof Uint8Array>"u"?[]:new Uint8Array(256);for(let n=0;n<up.length;n++)Mi[up.charCodeAt(n)]=n;const rA=n=>{let e=n.length*.75,t=n.length,s,i=0,r,o,l,c;n[n.length-1]==="="&&(e--,n[n.length-2]==="="&&e--);const h=new ArrayBuffer(e),d=new Uint8Array(h);for(s=0;s<t;s+=4)r=Mi[n.charCodeAt(s)],o=Mi[n.charCodeAt(s+1)],l=Mi[n.charCodeAt(s+2)],c=Mi[n.charCodeAt(s+3)],d[i++]=r<<2|o>>4,d[i++]=(o&15)<<4|l>>2,d[i++]=(l&3)<<6|c&63;return h},oA=typeof ArrayBuffer=="function",fu=(n,e)=>{if(typeof n!="string")return{type:"message",data:hy(n,e)};const t=n.charAt(0);return t==="b"?{type:"message",data:aA(n.substring(1),e)}:wo[t]?n.length>1?{type:wo[t],data:n.substring(1)}:{type:wo[t]}:Tc},aA=(n,e)=>{if(oA){const t=rA(n);return hy(t,e)}else return{base64:!0,data:n}},hy=(n,e)=>{switch(e){case"blob":return n instanceof Blob?n:new Blob([n]);case"arraybuffer":default:return n instanceof ArrayBuffer?n:n.buffer}},uy="",lA=(n,e)=>{const t=n.length,s=new Array(t);let i=0;n.forEach((r,o)=>{du(r,!1,l=>{s[o]=l,++i===t&&e(s.join(uy))})})},cA=(n,e)=>{const t=n.split(uy),s=[];for(let i=0;i<t.length;i++){const r=fu(t[i],e);if(s.push(r),r.type==="error")break}return s};function hA(){return new TransformStream({transform(n,e){iA(n,t=>{const s=t.length;let i;if(s<126)i=new Uint8Array(1),new DataView(i.buffer).setUint8(0,s);else if(s<65536){i=new Uint8Array(3);const r=new DataView(i.buffer);r.setUint8(0,126),r.setUint16(1,s)}else{i=new Uint8Array(9);const r=new DataView(i.buffer);r.setUint8(0,127),r.setBigUint64(1,BigInt(s))}n.data&&typeof n.data!="string"&&(i[0]|=128),e.enqueue(i),e.enqueue(t)})}})}let Ol;function lo(n){return n.reduce((e,t)=>e+t.length,0)}function co(n,e){if(n[0].length===e)return n.shift();const t=new Uint8Array(e);let s=0;for(let i=0;i<e;i++)t[i]=n[0][s++],s===n[0].length&&(n.shift(),s=0);return n.length&&s<n[0].length&&(n[0]=n[0].slice(s)),t}function uA(n,e){Ol||(Ol=new TextDecoder);const t=[];let s=0,i=-1,r=!1;return new TransformStream({transform(o,l){for(t.push(o);;){if(s===0){if(lo(t)<1)break;const c=co(t,1);r=(c[0]&128)===128,i=c[0]&127,i<126?s=3:i===126?s=1:s=2}else if(s===1){if(lo(t)<2)break;const c=co(t,2);i=new DataView(c.buffer,c.byteOffset,c.length).getUint16(0),s=3}else if(s===2){if(lo(t)<8)break;const c=co(t,8),h=new DataView(c.buffer,c.byteOffset,c.length),d=h.getUint32(0);if(d>Math.pow(2,21)-1){l.enqueue(Tc);break}i=d*Math.pow(2,32)+h.getUint32(4),s=3}else{if(lo(t)<i)break;const c=co(t,i);l.enqueue(fu(r?c:Ol.decode(c),e)),s=0}if(i===0||i>n){l.enqueue(Tc);break}}}})}const dy=4;function Ae(n){if(n)return dA(n)}function dA(n){for(var e in Ae.prototype)n[e]=Ae.prototype[e];return n}Ae.prototype.on=Ae.prototype.addEventListener=function(n,e){return this._callbacks=this._callbacks||{},(this._callbacks["$"+n]=this._callbacks["$"+n]||[]).push(e),this};Ae.prototype.once=function(n,e){function t(){this.off(n,t),e.apply(this,arguments)}return t.fn=e,this.on(n,t),this};Ae.prototype.off=Ae.prototype.removeListener=Ae.prototype.removeAllListeners=Ae.prototype.removeEventListener=function(n,e){if(this._callbacks=this._callbacks||{},arguments.length==0)return this._callbacks={},this;var t=this._callbacks["$"+n];if(!t)return this;if(arguments.length==1)return delete this._callbacks["$"+n],this;for(var s,i=0;i<t.length;i++)if(s=t[i],s===e||s.fn===e){t.splice(i,1);break}return t.length===0&&delete this._callbacks["$"+n],this};Ae.prototype.emit=function(n){this._callbacks=this._callbacks||{};for(var e=new Array(arguments.length-1),t=this._callbacks["$"+n],s=1;s<arguments.length;s++)e[s-1]=arguments[s];if(t){t=t.slice(0);for(var s=0,i=t.length;s<i;++s)t[s].apply(this,e)}return this};Ae.prototype.emitReserved=Ae.prototype.emit;Ae.prototype.listeners=function(n){return this._callbacks=this._callbacks||{},this._callbacks["$"+n]||[]};Ae.prototype.hasListeners=function(n){return!!this.listeners(n).length};const Ua=typeof Promise=="function"&&typeof Promise.resolve=="function"?e=>Promise.resolve().then(e):(e,t)=>t(e,0),gt=typeof self<"u"?self:typeof window<"u"?window:Function("return this")(),fA="arraybuffer";function fy(n,...e){return e.reduce((t,s)=>(n.hasOwnProperty(s)&&(t[s]=n[s]),t),{})}const pA=gt.setTimeout,mA=gt.clearTimeout;function qa(n,e){e.useNativeTimers?(n.setTimeoutFn=pA.bind(gt),n.clearTimeoutFn=mA.bind(gt)):(n.setTimeoutFn=gt.setTimeout.bind(gt),n.clearTimeoutFn=gt.clearTimeout.bind(gt))}const gA=1.33;function _A(n){return typeof n=="string"?yA(n):Math.ceil((n.byteLength||n.size)*gA)}function yA(n){let e=0,t=0;for(let s=0,i=n.length;s<i;s++)e=n.charCodeAt(s),e<128?t+=1:e<2048?t+=2:e<55296||e>=57344?t+=3:(s++,t+=4);return t}function py(){return Date.now().toString(36).substring(3)+Math.random().toString(36).substring(2,5)}function vA(n){let e="";for(let t in n)n.hasOwnProperty(t)&&(e.length&&(e+="&"),e+=encodeURIComponent(t)+"="+encodeURIComponent(n[t]));return e}function EA(n){let e={},t=n.split("&");for(let s=0,i=t.length;s<i;s++){let r=t[s].split("=");e[decodeURIComponent(r[0])]=decodeURIComponent(r[1])}return e}class wA extends Error{constructor(e,t,s){super(e),this.description=t,this.context=s,this.type="TransportError"}}class pu extends Ae{constructor(e){super(),this.writable=!1,qa(this,e),this.opts=e,this.query=e.query,this.socket=e.socket,this.supportsBinary=!e.forceBase64}onError(e,t,s){return super.emitReserved("error",new wA(e,t,s)),this}open(){return this.readyState="opening",this.doOpen(),this}close(){return(this.readyState==="opening"||this.readyState==="open")&&(this.doClose(),this.onClose()),this}send(e){this.readyState==="open"&&this.write(e)}onOpen(){this.readyState="open",this.writable=!0,super.emitReserved("open")}onData(e){const t=fu(e,this.socket.binaryType);this.onPacket(t)}onPacket(e){super.emitReserved("packet",e)}onClose(e){this.readyState="closed",super.emitReserved("close",e)}pause(e){}createUri(e,t={}){return e+"://"+this._hostname()+this._port()+this.opts.path+this._query(t)}_hostname(){const e=this.opts.hostname;return e.indexOf(":")===-1?e:"["+e+"]"}_port(){return this.opts.port&&(this.opts.secure&&Number(this.opts.port)!==443||!this.opts.secure&&Number(this.opts.port)!==80)?":"+this.opts.port:""}_query(e){const t=vA(e);return t.length?"?"+t:""}}class TA extends pu{constructor(){super(...arguments),this._polling=!1}get name(){return"polling"}doOpen(){this._poll()}pause(e){this.readyState="pausing";const t=()=>{this.readyState="paused",e()};if(this._polling||!this.writable){let s=0;this._polling&&(s++,this.once("pollComplete",function(){--s||t()})),this.writable||(s++,this.once("drain",function(){--s||t()}))}else t()}_poll(){this._polling=!0,this.doPoll(),this.emitReserved("poll")}onData(e){const t=s=>{if(this.readyState==="opening"&&s.type==="open"&&this.onOpen(),s.type==="close")return this.onClose({description:"transport closed by the server"}),!1;this.onPacket(s)};cA(e,this.socket.binaryType).forEach(t),this.readyState!=="closed"&&(this._polling=!1,this.emitReserved("pollComplete"),this.readyState==="open"&&this._poll())}doClose(){const e=()=>{this.write([{type:"close"}])};this.readyState==="open"?e():this.once("open",e)}write(e){this.writable=!1,lA(e,t=>{this.doWrite(t,()=>{this.writable=!0,this.emitReserved("drain")})})}uri(){const e=this.opts.secure?"https":"http",t=this.query||{};return this.opts.timestampRequests!==!1&&(t[this.opts.timestampParam]=py()),!this.supportsBinary&&!t.sid&&(t.b64=1),this.createUri(e,t)}}let my=!1;try{my=typeof XMLHttpRequest<"u"&&"withCredentials"in new XMLHttpRequest}catch{}const IA=my;function bA(){}class CA extends TA{constructor(e){if(super(e),typeof location<"u"){const t=location.protocol==="https:";let s=location.port;s||(s=t?"443":"80"),this.xd=typeof location<"u"&&e.hostname!==location.hostname||s!==e.port}}doWrite(e,t){const s=this.request({method:"POST",data:e});s.on("success",t),s.on("error",(i,r)=>{this.onError("xhr post error",i,r)})}doPoll(){const e=this.request();e.on("data",this.onData.bind(this)),e.on("error",(t,s)=>{this.onError("xhr poll error",t,s)}),this.pollXhr=e}}let xs=class To extends Ae{constructor(e,t,s){super(),this.createRequest=e,qa(this,s),this._opts=s,this._method=s.method||"GET",this._uri=t,this._data=s.data!==void 0?s.data:null,this._create()}_create(){var e;const t=fy(this._opts,"agent","pfx","key","passphrase","cert","ca","ciphers","rejectUnauthorized","autoUnref");t.xdomain=!!this._opts.xd;const s=this._xhr=this.createRequest(t);try{s.open(this._method,this._uri,!0);try{if(this._opts.extraHeaders){s.setDisableHeaderCheck&&s.setDisableHeaderCheck(!0);for(let i in this._opts.extraHeaders)this._opts.extraHeaders.hasOwnProperty(i)&&s.setRequestHeader(i,this._opts.extraHeaders[i])}}catch{}if(this._method==="POST")try{s.setRequestHeader("Content-type","text/plain;charset=UTF-8")}catch{}try{s.setRequestHeader("Accept","*/*")}catch{}(e=this._opts.cookieJar)===null||e===void 0||e.addCookies(s),"withCredentials"in s&&(s.withCredentials=this._opts.withCredentials),this._opts.requestTimeout&&(s.timeout=this._opts.requestTimeout),s.onreadystatechange=()=>{var i;s.readyState===3&&((i=this._opts.cookieJar)===null||i===void 0||i.parseCookies(s.getResponseHeader("set-cookie"))),s.readyState===4&&(s.status===200||s.status===1223?this._onLoad():this.setTimeoutFn(()=>{this._onError(typeof s.status=="number"?s.status:0)},0))},s.send(this._data)}catch(i){this.setTimeoutFn(()=>{this._onError(i)},0);return}typeof document<"u"&&(this._index=To.requestsCount++,To.requests[this._index]=this)}_onError(e){this.emitReserved("error",e,this._xhr),this._cleanup(!0)}_cleanup(e){if(!(typeof this._xhr>"u"||this._xhr===null)){if(this._xhr.onreadystatechange=bA,e)try{this._xhr.abort()}catch{}typeof document<"u"&&delete To.requests[this._index],this._xhr=null}}_onLoad(){const e=this._xhr.responseText;e!==null&&(this.emitReserved("data",e),this.emitReserved("success"),this._cleanup())}abort(){this._cleanup()}};xs.requestsCount=0;xs.requests={};if(typeof document<"u"){if(typeof attachEvent=="function")attachEvent("onunload",dp);else if(typeof addEventListener=="function"){const n="onpagehide"in gt?"pagehide":"unload";addEventListener(n,dp,!1)}}function dp(){for(let n in xs.requests)xs.requests.hasOwnProperty(n)&&xs.requests[n].abort()}const RA=function(){const n=gy({xdomain:!1});return n&&n.responseType!==null}();class SA extends CA{constructor(e){super(e);const t=e&&e.forceBase64;this.supportsBinary=RA&&!t}request(e={}){return Object.assign(e,{xd:this.xd},this.opts),new xs(gy,this.uri(),e)}}function gy(n){const e=n.xdomain;try{if(typeof XMLHttpRequest<"u"&&(!e||IA))return new XMLHttpRequest}catch{}if(!e)try{return new gt[["Active"].concat("Object").join("X")]("Microsoft.XMLHTTP")}catch{}}const _y=typeof navigator<"u"&&typeof navigator.product=="string"&&navigator.product.toLowerCase()==="reactnative";class AA extends pu{get name(){return"websocket"}doOpen(){const e=this.uri(),t=this.opts.protocols,s=_y?{}:fy(this.opts,"agent","perMessageDeflate","pfx","key","passphrase","cert","ca","ciphers","rejectUnauthorized","localAddress","protocolVersion","origin","maxPayload","family","checkServerIdentity");this.opts.extraHeaders&&(s.headers=this.opts.extraHeaders);try{this.ws=this.createSocket(e,t,s)}catch(i){return this.emitReserved("error",i)}this.ws.binaryType=this.socket.binaryType,this.addEventListeners()}addEventListeners(){this.ws.onopen=()=>{this.opts.autoUnref&&this.ws._socket.unref(),this.onOpen()},this.ws.onclose=e=>this.onClose({description:"websocket connection closed",context:e}),this.ws.onmessage=e=>this.onData(e.data),this.ws.onerror=e=>this.onError("websocket error",e)}write(e){this.writable=!1;for(let t=0;t<e.length;t++){const s=e[t],i=t===e.length-1;du(s,this.supportsBinary,r=>{try{this.doWrite(s,r)}catch{}i&&Ua(()=>{this.writable=!0,this.emitReserved("drain")},this.setTimeoutFn)})}}doClose(){typeof this.ws<"u"&&(this.ws.onerror=()=>{},this.ws.close(),this.ws=null)}uri(){const e=this.opts.secure?"wss":"ws",t=this.query||{};return this.opts.timestampRequests&&(t[this.opts.timestampParam]=py()),this.supportsBinary||(t.b64=1),this.createUri(e,t)}}const Ml=gt.WebSocket||gt.MozWebSocket;class kA extends AA{createSocket(e,t,s){return _y?new Ml(e,t,s):t?new Ml(e,t):new Ml(e)}doWrite(e,t){this.ws.send(t)}}class PA extends pu{get name(){return"webtransport"}doOpen(){try{this._transport=new WebTransport(this.createUri("https"),this.opts.transportOptions[this.name])}catch(e){return this.emitReserved("error",e)}this._transport.closed.then(()=>{this.onClose()}).catch(e=>{this.onError("webtransport error",e)}),this._transport.ready.then(()=>{this._transport.createBidirectionalStream().then(e=>{const t=uA(Number.MAX_SAFE_INTEGER,this.socket.binaryType),s=e.readable.pipeThrough(t).getReader(),i=hA();i.readable.pipeTo(e.writable),this._writer=i.writable.getWriter();const r=()=>{s.read().then(({done:l,value:c})=>{l||(this.onPacket(c),r())}).catch(l=>{})};r();const o={type:"open"};this.query.sid&&(o.data=`{"sid":"${this.query.sid}"}`),this._writer.write(o).then(()=>this.onOpen())})})}write(e){this.writable=!1;for(let t=0;t<e.length;t++){const s=e[t],i=t===e.length-1;this._writer.write(s).then(()=>{i&&Ua(()=>{this.writable=!0,this.emitReserved("drain")},this.setTimeoutFn)})}}doClose(){var e;(e=this._transport)===null||e===void 0||e.close()}}const NA={websocket:kA,webtransport:PA,polling:SA},DA=/^(?:(?![^:@\/?#]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@\/?#]*)(?::([^:@\/?#]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/,LA=["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"];function Ic(n){if(n.length>8e3)throw"URI too long";const e=n,t=n.indexOf("["),s=n.indexOf("]");t!=-1&&s!=-1&&(n=n.substring(0,t)+n.substring(t,s).replace(/:/g,";")+n.substring(s,n.length));let i=DA.exec(n||""),r={},o=14;for(;o--;)r[LA[o]]=i[o]||"";return t!=-1&&s!=-1&&(r.source=e,r.host=r.host.substring(1,r.host.length-1).replace(/;/g,":"),r.authority=r.authority.replace("[","").replace("]","").replace(/;/g,":"),r.ipv6uri=!0),r.pathNames=xA(r,r.path),r.queryKey=OA(r,r.query),r}function xA(n,e){const t=/\/{2,9}/g,s=e.replace(t,"/").split("/");return(e.slice(0,1)=="/"||e.length===0)&&s.splice(0,1),e.slice(-1)=="/"&&s.splice(s.length-1,1),s}function OA(n,e){const t={};return e.replace(/(?:^|&)([^&=]*)=?([^&]*)/g,function(s,i,r){i&&(t[i]=r)}),t}const bc=typeof addEventListener=="function"&&typeof removeEventListener=="function",Io=[];bc&&addEventListener("offline",()=>{Io.forEach(n=>n())},!1);class kn extends Ae{constructor(e,t){if(super(),this.binaryType=fA,this.writeBuffer=[],this._prevBufferLen=0,this._pingInterval=-1,this._pingTimeout=-1,this._maxPayload=-1,this._pingTimeoutTime=1/0,e&&typeof e=="object"&&(t=e,e=null),e){const s=Ic(e);t.hostname=s.host,t.secure=s.protocol==="https"||s.protocol==="wss",t.port=s.port,s.query&&(t.query=s.query)}else t.host&&(t.hostname=Ic(t.host).host);qa(this,t),this.secure=t.secure!=null?t.secure:typeof location<"u"&&location.protocol==="https:",t.hostname&&!t.port&&(t.port=this.secure?"443":"80"),this.hostname=t.hostname||(typeof location<"u"?location.hostname:"localhost"),this.port=t.port||(typeof location<"u"&&location.port?location.port:this.secure?"443":"80"),this.transports=[],this._transportsByName={},t.transports.forEach(s=>{const i=s.prototype.name;this.transports.push(i),this._transportsByName[i]=s}),this.opts=Object.assign({path:"/engine.io",agent:!1,withCredentials:!1,upgrade:!0,timestampParam:"t",rememberUpgrade:!1,addTrailingSlash:!0,rejectUnauthorized:!0,perMessageDeflate:{threshold:1024},transportOptions:{},closeOnBeforeunload:!1},t),this.opts.path=this.opts.path.replace(/\/$/,"")+(this.opts.addTrailingSlash?"/":""),typeof this.opts.query=="string"&&(this.opts.query=EA(this.opts.query)),bc&&(this.opts.closeOnBeforeunload&&(this._beforeunloadEventListener=()=>{this.transport&&(this.transport.removeAllListeners(),this.transport.close())},addEventListener("beforeunload",this._beforeunloadEventListener,!1)),this.hostname!=="localhost"&&(this._offlineEventListener=()=>{this._onClose("transport close",{description:"network connection lost"})},Io.push(this._offlineEventListener))),this.opts.withCredentials&&(this._cookieJar=void 0),this._open()}createTransport(e){const t=Object.assign({},this.opts.query);t.EIO=dy,t.transport=e,this.id&&(t.sid=this.id);const s=Object.assign({},this.opts,{query:t,socket:this,hostname:this.hostname,secure:this.secure,port:this.port},this.opts.transportOptions[e]);return new this._transportsByName[e](s)}_open(){if(this.transports.length===0){this.setTimeoutFn(()=>{this.emitReserved("error","No transports available")},0);return}const e=this.opts.rememberUpgrade&&kn.priorWebsocketSuccess&&this.transports.indexOf("websocket")!==-1?"websocket":this.transports[0];this.readyState="opening";const t=this.createTransport(e);t.open(),this.setTransport(t)}setTransport(e){this.transport&&this.transport.removeAllListeners(),this.transport=e,e.on("drain",this._onDrain.bind(this)).on("packet",this._onPacket.bind(this)).on("error",this._onError.bind(this)).on("close",t=>this._onClose("transport close",t))}onOpen(){this.readyState="open",kn.priorWebsocketSuccess=this.transport.name==="websocket",this.emitReserved("open"),this.flush()}_onPacket(e){if(this.readyState==="opening"||this.readyState==="open"||this.readyState==="closing")switch(this.emitReserved("packet",e),this.emitReserved("heartbeat"),e.type){case"open":this.onHandshake(JSON.parse(e.data));break;case"ping":this._sendPacket("pong"),this.emitReserved("ping"),this.emitReserved("pong"),this._resetPingTimeout();break;case"error":const t=new Error("server error");t.code=e.data,this._onError(t);break;case"message":this.emitReserved("data",e.data),this.emitReserved("message",e.data);break}}onHandshake(e){this.emitReserved("handshake",e),this.id=e.sid,this.transport.query.sid=e.sid,this._pingInterval=e.pingInterval,this._pingTimeout=e.pingTimeout,this._maxPayload=e.maxPayload,this.onOpen(),this.readyState!=="closed"&&this._resetPingTimeout()}_resetPingTimeout(){this.clearTimeoutFn(this._pingTimeoutTimer);const e=this._pingInterval+this._pingTimeout;this._pingTimeoutTime=Date.now()+e,this._pingTimeoutTimer=this.setTimeoutFn(()=>{this._onClose("ping timeout")},e),this.opts.autoUnref&&this._pingTimeoutTimer.unref()}_onDrain(){this.writeBuffer.splice(0,this._prevBufferLen),this._prevBufferLen=0,this.writeBuffer.length===0?this.emitReserved("drain"):this.flush()}flush(){if(this.readyState!=="closed"&&this.transport.writable&&!this.upgrading&&this.writeBuffer.length){const e=this._getWritablePackets();this.transport.send(e),this._prevBufferLen=e.length,this.emitReserved("flush")}}_getWritablePackets(){if(!(this._maxPayload&&this.transport.name==="polling"&&this.writeBuffer.length>1))return this.writeBuffer;let t=1;for(let s=0;s<this.writeBuffer.length;s++){const i=this.writeBuffer[s].data;if(i&&(t+=_A(i)),s>0&&t>this._maxPayload)return this.writeBuffer.slice(0,s);t+=2}return this.writeBuffer}_hasPingExpired(){if(!this._pingTimeoutTime)return!0;const e=Date.now()>this._pingTimeoutTime;return e&&(this._pingTimeoutTime=0,Ua(()=>{this._onClose("ping timeout")},this.setTimeoutFn)),e}write(e,t,s){return this._sendPacket("message",e,t,s),this}send(e,t,s){return this._sendPacket("message",e,t,s),this}_sendPacket(e,t,s,i){if(typeof t=="function"&&(i=t,t=void 0),typeof s=="function"&&(i=s,s=null),this.readyState==="closing"||this.readyState==="closed")return;s=s||{},s.compress=s.compress!==!1;const r={type:e,data:t,options:s};this.emitReserved("packetCreate",r),this.writeBuffer.push(r),i&&this.once("flush",i),this.flush()}close(){const e=()=>{this._onClose("forced close"),this.transport.close()},t=()=>{this.off("upgrade",t),this.off("upgradeError",t),e()},s=()=>{this.once("upgrade",t),this.once("upgradeError",t)};return(this.readyState==="opening"||this.readyState==="open")&&(this.readyState="closing",this.writeBuffer.length?this.once("drain",()=>{this.upgrading?s():e()}):this.upgrading?s():e()),this}_onError(e){if(kn.priorWebsocketSuccess=!1,this.opts.tryAllTransports&&this.transports.length>1&&this.readyState==="opening")return this.transports.shift(),this._open();this.emitReserved("error",e),this._onClose("transport error",e)}_onClose(e,t){if(this.readyState==="opening"||this.readyState==="open"||this.readyState==="closing"){if(this.clearTimeoutFn(this._pingTimeoutTimer),this.transport.removeAllListeners("close"),this.transport.close(),this.transport.removeAllListeners(),bc&&(this._beforeunloadEventListener&&removeEventListener("beforeunload",this._beforeunloadEventListener,!1),this._offlineEventListener)){const s=Io.indexOf(this._offlineEventListener);s!==-1&&Io.splice(s,1)}this.readyState="closed",this.id=null,this.emitReserved("close",e,t),this.writeBuffer=[],this._prevBufferLen=0}}}kn.protocol=dy;class MA extends kn{constructor(){super(...arguments),this._upgrades=[]}onOpen(){if(super.onOpen(),this.readyState==="open"&&this.opts.upgrade)for(let e=0;e<this._upgrades.length;e++)this._probe(this._upgrades[e])}_probe(e){let t=this.createTransport(e),s=!1;kn.priorWebsocketSuccess=!1;const i=()=>{s||(t.send([{type:"ping",data:"probe"}]),t.once("packet",p=>{if(!s)if(p.type==="pong"&&p.data==="probe"){if(this.upgrading=!0,this.emitReserved("upgrading",t),!t)return;kn.priorWebsocketSuccess=t.name==="websocket",this.transport.pause(()=>{s||this.readyState!=="closed"&&(d(),this.setTransport(t),t.send([{type:"upgrade"}]),this.emitReserved("upgrade",t),t=null,this.upgrading=!1,this.flush())})}else{const m=new Error("probe error");m.transport=t.name,this.emitReserved("upgradeError",m)}}))};function r(){s||(s=!0,d(),t.close(),t=null)}const o=p=>{const m=new Error("probe error: "+p);m.transport=t.name,r(),this.emitReserved("upgradeError",m)};function l(){o("transport closed")}function c(){o("socket closed")}function h(p){t&&p.name!==t.name&&r()}const d=()=>{t.removeListener("open",i),t.removeListener("error",o),t.removeListener("close",l),this.off("close",c),this.off("upgrading",h)};t.once("open",i),t.once("error",o),t.once("close",l),this.once("close",c),this.once("upgrading",h),this._upgrades.indexOf("webtransport")!==-1&&e!=="webtransport"?this.setTimeoutFn(()=>{s||t.open()},200):t.open()}onHandshake(e){this._upgrades=this._filterUpgrades(e.upgrades),super.onHandshake(e)}_filterUpgrades(e){const t=[];for(let s=0;s<e.length;s++)~this.transports.indexOf(e[s])&&t.push(e[s]);return t}}let VA=class extends MA{constructor(e,t={}){const s=typeof e=="object",i=s?{...e}:{...t};(!i.transports||i.transports&&typeof i.transports[0]=="string")&&(i.transports=(i.transports||["polling","websocket","webtransport"]).map(r=>NA[r]).filter(r=>!!r)),super(s?i:e,i)}};function FA(n,e="",t){let s=n;t=t||typeof location<"u"&&location,n==null&&(n=t.protocol+"//"+t.host),typeof n=="string"&&(n.charAt(0)==="/"&&(n.charAt(1)==="/"?n=t.protocol+n:n=t.host+n),/^(https?|wss?):\/\//.test(n)||(typeof t<"u"?n=t.protocol+"//"+n:n="https://"+n),s=Ic(n)),s.port||(/^(http|ws)$/.test(s.protocol)?s.port="80":/^(http|ws)s$/.test(s.protocol)&&(s.port="443")),s.path=s.path||"/";const r=s.host.indexOf(":")!==-1?"["+s.host+"]":s.host;return s.id=s.protocol+"://"+r+":"+s.port+e,s.href=s.protocol+"://"+r+(t&&t.port===s.port?"":":"+s.port),s}const BA=typeof ArrayBuffer=="function",UA=n=>typeof ArrayBuffer.isView=="function"?ArrayBuffer.isView(n):n.buffer instanceof ArrayBuffer,yy=Object.prototype.toString,qA=typeof Blob=="function"||typeof Blob<"u"&&yy.call(Blob)==="[object BlobConstructor]",WA=typeof File=="function"||typeof File<"u"&&yy.call(File)==="[object FileConstructor]";function mu(n){return BA&&(n instanceof ArrayBuffer||UA(n))||qA&&n instanceof Blob||WA&&n instanceof File}function bo(n,e){if(!n||typeof n!="object")return!1;if(Array.isArray(n)){for(let t=0,s=n.length;t<s;t++)if(bo(n[t]))return!0;return!1}if(mu(n))return!0;if(n.toJSON&&typeof n.toJSON=="function"&&arguments.length===1)return bo(n.toJSON(),!0);for(const t in n)if(Object.prototype.hasOwnProperty.call(n,t)&&bo(n[t]))return!0;return!1}function $A(n){const e=[],t=n.data,s=n;return s.data=Cc(t,e),s.attachments=e.length,{packet:s,buffers:e}}function Cc(n,e){if(!n)return n;if(mu(n)){const t={_placeholder:!0,num:e.length};return e.push(n),t}else if(Array.isArray(n)){const t=new Array(n.length);for(let s=0;s<n.length;s++)t[s]=Cc(n[s],e);return t}else if(typeof n=="object"&&!(n instanceof Date)){const t={};for(const s in n)Object.prototype.hasOwnProperty.call(n,s)&&(t[s]=Cc(n[s],e));return t}return n}function jA(n,e){return n.data=Rc(n.data,e),delete n.attachments,n}function Rc(n,e){if(!n)return n;if(n&&n._placeholder===!0){if(typeof n.num=="number"&&n.num>=0&&n.num<e.length)return e[n.num];throw new Error("illegal attachments")}else if(Array.isArray(n))for(let t=0;t<n.length;t++)n[t]=Rc(n[t],e);else if(typeof n=="object")for(const t in n)Object.prototype.hasOwnProperty.call(n,t)&&(n[t]=Rc(n[t],e));return n}const GA=["connect","connect_error","disconnect","disconnecting","newListener","removeListener"];var se;(function(n){n[n.CONNECT=0]="CONNECT",n[n.DISCONNECT=1]="DISCONNECT",n[n.EVENT=2]="EVENT",n[n.ACK=3]="ACK",n[n.CONNECT_ERROR=4]="CONNECT_ERROR",n[n.BINARY_EVENT=5]="BINARY_EVENT",n[n.BINARY_ACK=6]="BINARY_ACK"})(se||(se={}));class zA{constructor(e){this.replacer=e}encode(e){return(e.type===se.EVENT||e.type===se.ACK)&&bo(e)?this.encodeAsBinary({type:e.type===se.EVENT?se.BINARY_EVENT:se.BINARY_ACK,nsp:e.nsp,data:e.data,id:e.id}):[this.encodeAsString(e)]}encodeAsString(e){let t=""+e.type;return(e.type===se.BINARY_EVENT||e.type===se.BINARY_ACK)&&(t+=e.attachments+"-"),e.nsp&&e.nsp!=="/"&&(t+=e.nsp+","),e.id!=null&&(t+=e.id),e.data!=null&&(t+=JSON.stringify(e.data,this.replacer)),t}encodeAsBinary(e){const t=$A(e),s=this.encodeAsString(t.packet),i=t.buffers;return i.unshift(s),i}}class gu extends Ae{constructor(e){super(),this.opts=Object.assign({reviver:void 0,maxAttachments:10},typeof e=="function"?{reviver:e}:e)}add(e){let t;if(typeof e=="string"){if(this.reconstructor)throw new Error("got plaintext data when reconstructing a packet");t=this.decodeString(e);const s=t.type===se.BINARY_EVENT;s||t.type===se.BINARY_ACK?(t.type=s?se.EVENT:se.ACK,this.reconstructor=new HA(t),t.attachments===0&&super.emitReserved("decoded",t)):super.emitReserved("decoded",t)}else if(mu(e)||e.base64)if(this.reconstructor)t=this.reconstructor.takeBinaryData(e),t&&(this.reconstructor=null,super.emitReserved("decoded",t));else throw new Error("got binary data when not reconstructing a packet");else throw new Error("Unknown type: "+e)}decodeString(e){let t=0;const s={type:Number(e.charAt(0))};if(se[s.type]===void 0)throw new Error("unknown packet type "+s.type);if(s.type===se.BINARY_EVENT||s.type===se.BINARY_ACK){const r=t+1;for(;e.charAt(++t)!=="-"&&t!=e.length;);const o=e.substring(r,t);if(o!=Number(o)||e.charAt(t)!=="-")throw new Error("Illegal attachments");const l=Number(o);if(!KA(l)||l<0)throw new Error("Illegal attachments");if(l>this.opts.maxAttachments)throw new Error("too many attachments");s.attachments=l}if(e.charAt(t+1)==="/"){const r=t+1;for(;++t&&!(e.charAt(t)===","||t===e.length););s.nsp=e.substring(r,t)}else s.nsp="/";const i=e.charAt(t+1);if(i!==""&&Number(i)==i){const r=t+1;for(;++t;){const o=e.charAt(t);if(o==null||Number(o)!=o){--t;break}if(t===e.length)break}s.id=Number(e.substring(r,t+1))}if(e.charAt(++t)){const r=this.tryParse(e.substr(t));if(gu.isPayloadValid(s.type,r))s.data=r;else throw new Error("invalid payload")}return s}tryParse(e){try{return JSON.parse(e,this.opts.reviver)}catch{return!1}}static isPayloadValid(e,t){switch(e){case se.CONNECT:return fp(t);case se.DISCONNECT:return t===void 0;case se.CONNECT_ERROR:return typeof t=="string"||fp(t);case se.EVENT:case se.BINARY_EVENT:return Array.isArray(t)&&(typeof t[0]=="number"||typeof t[0]=="string"&&GA.indexOf(t[0])===-1);case se.ACK:case se.BINARY_ACK:return Array.isArray(t)}}destroy(){this.reconstructor&&(this.reconstructor.finishedReconstruction(),this.reconstructor=null)}}class HA{constructor(e){this.packet=e,this.buffers=[],this.reconPack=e}takeBinaryData(e){if(this.buffers.push(e),this.buffers.length===this.reconPack.attachments){const t=jA(this.reconPack,this.buffers);return this.finishedReconstruction(),t}return null}finishedReconstruction(){this.reconPack=null,this.buffers=[]}}const KA=Number.isInteger||function(n){return typeof n=="number"&&isFinite(n)&&Math.floor(n)===n};function fp(n){return Object.prototype.toString.call(n)==="[object Object]"}const QA=Object.freeze(Object.defineProperty({__proto__:null,Decoder:gu,Encoder:zA,get PacketType(){return se}},Symbol.toStringTag,{value:"Module"}));function It(n,e,t){return n.on(e,t),function(){n.off(e,t)}}const YA=Object.freeze({connect:1,connect_error:1,disconnect:1,disconnecting:1,newListener:1,removeListener:1});class vy extends Ae{constructor(e,t,s){super(),this.connected=!1,this.recovered=!1,this.receiveBuffer=[],this.sendBuffer=[],this._queue=[],this._queueSeq=0,this.ids=0,this.acks={},this.flags={},this.io=e,this.nsp=t,s&&s.auth&&(this.auth=s.auth),this._opts=Object.assign({},s),this.io._autoConnect&&this.open()}get disconnected(){return!this.connected}subEvents(){if(this.subs)return;const e=this.io;this.subs=[It(e,"open",this.onopen.bind(this)),It(e,"packet",this.onpacket.bind(this)),It(e,"error",this.onerror.bind(this)),It(e,"close",this.onclose.bind(this))]}get active(){return!!this.subs}connect(){return this.connected?this:(this.subEvents(),this.io._reconnecting||this.io.open(),this.io._readyState==="open"&&this.onopen(),this)}open(){return this.connect()}send(...e){return e.unshift("message"),this.emit.apply(this,e),this}emit(e,...t){var s,i,r;if(YA.hasOwnProperty(e))throw new Error('"'+e.toString()+'" is a reserved event name');if(t.unshift(e),this._opts.retries&&!this.flags.fromQueue&&!this.flags.volatile)return this._addToQueue(t),this;const o={type:se.EVENT,data:t};if(o.options={},o.options.compress=this.flags.compress!==!1,typeof t[t.length-1]=="function"){const d=this.ids++,p=t.pop();this._registerAckCallback(d,p),o.id=d}const l=(i=(s=this.io.engine)===null||s===void 0?void 0:s.transport)===null||i===void 0?void 0:i.writable,c=this.connected&&!(!((r=this.io.engine)===null||r===void 0)&&r._hasPingExpired());return this.flags.volatile&&!l||(c?(this.notifyOutgoingListeners(o),this.packet(o)):this.sendBuffer.push(o)),this.flags={},this}_registerAckCallback(e,t){var s;const i=(s=this.flags.timeout)!==null&&s!==void 0?s:this._opts.ackTimeout;if(i===void 0){this.acks[e]=t;return}const r=this.io.setTimeoutFn(()=>{delete this.acks[e];for(let l=0;l<this.sendBuffer.length;l++)this.sendBuffer[l].id===e&&this.sendBuffer.splice(l,1);t.call(this,new Error("operation has timed out"))},i),o=(...l)=>{this.io.clearTimeoutFn(r),t.apply(this,l)};o.withError=!0,this.acks[e]=o}emitWithAck(e,...t){return new Promise((s,i)=>{const r=(o,l)=>o?i(o):s(l);r.withError=!0,t.push(r),this.emit(e,...t)})}_addToQueue(e){let t;typeof e[e.length-1]=="function"&&(t=e.pop());const s={id:this._queueSeq++,tryCount:0,pending:!1,args:e,flags:Object.assign({fromQueue:!0},this.flags)};e.push((i,...r)=>(this._queue[0],i!==null?s.tryCount>this._opts.retries&&(this._queue.shift(),t&&t(i)):(this._queue.shift(),t&&t(null,...r)),s.pending=!1,this._drainQueue())),this._queue.push(s),this._drainQueue()}_drainQueue(e=!1){if(!this.connected||this._queue.length===0)return;const t=this._queue[0];t.pending&&!e||(t.pending=!0,t.tryCount++,this.flags=t.flags,this.emit.apply(this,t.args))}packet(e){e.nsp=this.nsp,this.io._packet(e)}onopen(){typeof this.auth=="function"?this.auth(e=>{this._sendConnectPacket(e)}):this._sendConnectPacket(this.auth)}_sendConnectPacket(e){this.packet({type:se.CONNECT,data:this._pid?Object.assign({pid:this._pid,offset:this._lastOffset},e):e})}onerror(e){this.connected||this.emitReserved("connect_error",e)}onclose(e,t){this.connected=!1,delete this.id,this.emitReserved("disconnect",e,t),this._clearAcks()}_clearAcks(){Object.keys(this.acks).forEach(e=>{if(!this.sendBuffer.some(s=>String(s.id)===e)){const s=this.acks[e];delete this.acks[e],s.withError&&s.call(this,new Error("socket has been disconnected"))}})}onpacket(e){if(e.nsp===this.nsp)switch(e.type){case se.CONNECT:e.data&&e.data.sid?this.onconnect(e.data.sid,e.data.pid):this.emitReserved("connect_error",new Error("It seems you are trying to reach a Socket.IO server in v2.x with a v3.x client, but they are not compatible (more information here: https://socket.io/docs/v3/migrating-from-2-x-to-3-0/)"));break;case se.EVENT:case se.BINARY_EVENT:this.onevent(e);break;case se.ACK:case se.BINARY_ACK:this.onack(e);break;case se.DISCONNECT:this.ondisconnect();break;case se.CONNECT_ERROR:this.destroy();const s=new Error(e.data.message);s.data=e.data.data,this.emitReserved("connect_error",s);break}}onevent(e){const t=e.data||[];e.id!=null&&t.push(this.ack(e.id)),this.connected?this.emitEvent(t):this.receiveBuffer.push(Object.freeze(t))}emitEvent(e){if(this._anyListeners&&this._anyListeners.length){const t=this._anyListeners.slice();for(const s of t)s.apply(this,e)}super.emit.apply(this,e),this._pid&&e.length&&typeof e[e.length-1]=="string"&&(this._lastOffset=e[e.length-1])}ack(e){const t=this;let s=!1;return function(...i){s||(s=!0,t.packet({type:se.ACK,id:e,data:i}))}}onack(e){const t=this.acks[e.id];typeof t=="function"&&(delete this.acks[e.id],t.withError&&e.data.unshift(null),t.apply(this,e.data))}onconnect(e,t){this.id=e,this.recovered=t&&this._pid===t,this._pid=t,this.connected=!0,this.emitBuffered(),this._drainQueue(!0),this.emitReserved("connect")}emitBuffered(){this.receiveBuffer.forEach(e=>this.emitEvent(e)),this.receiveBuffer=[],this.sendBuffer.forEach(e=>{this.notifyOutgoingListeners(e),this.packet(e)}),this.sendBuffer=[]}ondisconnect(){this.destroy(),this.onclose("io server disconnect")}destroy(){this.subs&&(this.subs.forEach(e=>e()),this.subs=void 0),this.io._destroy(this)}disconnect(){return this.connected&&this.packet({type:se.DISCONNECT}),this.destroy(),this.connected&&this.onclose("io client disconnect"),this}close(){return this.disconnect()}compress(e){return this.flags.compress=e,this}get volatile(){return this.flags.volatile=!0,this}timeout(e){return this.flags.timeout=e,this}onAny(e){return this._anyListeners=this._anyListeners||[],this._anyListeners.push(e),this}prependAny(e){return this._anyListeners=this._anyListeners||[],this._anyListeners.unshift(e),this}offAny(e){if(!this._anyListeners)return this;if(e){const t=this._anyListeners;for(let s=0;s<t.length;s++)if(e===t[s])return t.splice(s,1),this}else this._anyListeners=[];return this}listenersAny(){return this._anyListeners||[]}onAnyOutgoing(e){return this._anyOutgoingListeners=this._anyOutgoingListeners||[],this._anyOutgoingListeners.push(e),this}prependAnyOutgoing(e){return this._anyOutgoingListeners=this._anyOutgoingListeners||[],this._anyOutgoingListeners.unshift(e),this}offAnyOutgoing(e){if(!this._anyOutgoingListeners)return this;if(e){const t=this._anyOutgoingListeners;for(let s=0;s<t.length;s++)if(e===t[s])return t.splice(s,1),this}else this._anyOutgoingListeners=[];return this}listenersAnyOutgoing(){return this._anyOutgoingListeners||[]}notifyOutgoingListeners(e){if(this._anyOutgoingListeners&&this._anyOutgoingListeners.length){const t=this._anyOutgoingListeners.slice();for(const s of t)s.apply(this,e.data)}}}function oi(n){n=n||{},this.ms=n.min||100,this.max=n.max||1e4,this.factor=n.factor||2,this.jitter=n.jitter>0&&n.jitter<=1?n.jitter:0,this.attempts=0}oi.prototype.duration=function(){var n=this.ms*Math.pow(this.factor,this.attempts++);if(this.jitter){var e=Math.random(),t=Math.floor(e*this.jitter*n);n=Math.floor(e*10)&1?n+t:n-t}return Math.min(n,this.max)|0};oi.prototype.reset=function(){this.attempts=0};oi.prototype.setMin=function(n){this.ms=n};oi.prototype.setMax=function(n){this.max=n};oi.prototype.setJitter=function(n){this.jitter=n};class Sc extends Ae{constructor(e,t){var s;super(),this.nsps={},this.subs=[],e&&typeof e=="object"&&(t=e,e=void 0),t=t||{},t.path=t.path||"/socket.io",this.opts=t,qa(this,t),this.reconnection(t.reconnection!==!1),this.reconnectionAttempts(t.reconnectionAttempts||1/0),this.reconnectionDelay(t.reconnectionDelay||1e3),this.reconnectionDelayMax(t.reconnectionDelayMax||5e3),this.randomizationFactor((s=t.randomizationFactor)!==null&&s!==void 0?s:.5),this.backoff=new oi({min:this.reconnectionDelay(),max:this.reconnectionDelayMax(),jitter:this.randomizationFactor()}),this.timeout(t.timeout==null?2e4:t.timeout),this._readyState="closed",this.uri=e;const i=t.parser||QA;this.encoder=new i.Encoder,this.decoder=new i.Decoder,this._autoConnect=t.autoConnect!==!1,this._autoConnect&&this.open()}reconnection(e){return arguments.length?(this._reconnection=!!e,e||(this.skipReconnect=!0),this):this._reconnection}reconnectionAttempts(e){return e===void 0?this._reconnectionAttempts:(this._reconnectionAttempts=e,this)}reconnectionDelay(e){var t;return e===void 0?this._reconnectionDelay:(this._reconnectionDelay=e,(t=this.backoff)===null||t===void 0||t.setMin(e),this)}randomizationFactor(e){var t;return e===void 0?this._randomizationFactor:(this._randomizationFactor=e,(t=this.backoff)===null||t===void 0||t.setJitter(e),this)}reconnectionDelayMax(e){var t;return e===void 0?this._reconnectionDelayMax:(this._reconnectionDelayMax=e,(t=this.backoff)===null||t===void 0||t.setMax(e),this)}timeout(e){return arguments.length?(this._timeout=e,this):this._timeout}maybeReconnectOnOpen(){!this._reconnecting&&this._reconnection&&this.backoff.attempts===0&&this.reconnect()}open(e){if(~this._readyState.indexOf("open"))return this;this.engine=new VA(this.uri,this.opts);const t=this.engine,s=this;this._readyState="opening",this.skipReconnect=!1;const i=It(t,"open",function(){s.onopen(),e&&e()}),r=l=>{this.cleanup(),this._readyState="closed",this.emitReserved("error",l),e?e(l):this.maybeReconnectOnOpen()},o=It(t,"error",r);if(this._timeout!==!1){const l=this._timeout,c=this.setTimeoutFn(()=>{i(),r(new Error("timeout")),t.close()},l);this.opts.autoUnref&&c.unref(),this.subs.push(()=>{this.clearTimeoutFn(c)})}return this.subs.push(i),this.subs.push(o),this}connect(e){return this.open(e)}onopen(){this.cleanup(),this._readyState="open",this.emitReserved("open");const e=this.engine;this.subs.push(It(e,"ping",this.onping.bind(this)),It(e,"data",this.ondata.bind(this)),It(e,"error",this.onerror.bind(this)),It(e,"close",this.onclose.bind(this)),It(this.decoder,"decoded",this.ondecoded.bind(this)))}onping(){this.emitReserved("ping")}ondata(e){try{this.decoder.add(e)}catch(t){this.onclose("parse error",t)}}ondecoded(e){Ua(()=>{this.emitReserved("packet",e)},this.setTimeoutFn)}onerror(e){this.emitReserved("error",e)}socket(e,t){let s=this.nsps[e];return s?this._autoConnect&&!s.active&&s.connect():(s=new vy(this,e,t),this.nsps[e]=s),s}_destroy(e){const t=Object.keys(this.nsps);for(const s of t)if(this.nsps[s].active)return;this._close()}_packet(e){const t=this.encoder.encode(e);for(let s=0;s<t.length;s++)this.engine.write(t[s],e.options)}cleanup(){this.subs.forEach(e=>e()),this.subs.length=0,this.decoder.destroy()}_close(){this.skipReconnect=!0,this._reconnecting=!1,this.onclose("forced close")}disconnect(){return this._close()}onclose(e,t){var s;this.cleanup(),(s=this.engine)===null||s===void 0||s.close(),this.backoff.reset(),this._readyState="closed",this.emitReserved("close",e,t),this._reconnection&&!this.skipReconnect&&this.reconnect()}reconnect(){if(this._reconnecting||this.skipReconnect)return this;const e=this;if(this.backoff.attempts>=this._reconnectionAttempts)this.backoff.reset(),this.emitReserved("reconnect_failed"),this._reconnecting=!1;else{const t=this.backoff.duration();this._reconnecting=!0;const s=this.setTimeoutFn(()=>{e.skipReconnect||(this.emitReserved("reconnect_attempt",e.backoff.attempts),!e.skipReconnect&&e.open(i=>{i?(e._reconnecting=!1,e.reconnect(),this.emitReserved("reconnect_error",i)):e.onreconnect()}))},t);this.opts.autoUnref&&s.unref(),this.subs.push(()=>{this.clearTimeoutFn(s)})}}onreconnect(){const e=this.backoff.attempts;this._reconnecting=!1,this.backoff.reset(),this.emitReserved("reconnect",e)}}const Di={};function Co(n,e){typeof n=="object"&&(e=n,n=void 0),e=e||{};const t=FA(n,e.path||"/socket.io"),s=t.source,i=t.id,r=t.path,o=Di[i]&&r in Di[i].nsps,l=e.forceNew||e["force new connection"]||e.multiplex===!1||o;let c;return l?c=new Sc(s,e):(Di[i]||(Di[i]=new Sc(s,e)),c=Di[i]),t.query&&!e.query&&(e.query=t.queryKey),c.socket(t.path,e)}Object.assign(Co,{Manager:Sc,Socket:vy,io:Co,connect:Co});let F=null;const Y={connect(n=window.location.origin){if(F)return F;let e=n;return window.location.hostname==="localhost"||window.location.hostname==="127.0.0.1"?(n.includes(":3000")||n.includes(":5173"))&&(e=`http://${window.location.hostname}:8080`):e="https://kicker-hax-server.onrender.com",F=Co(e,{autoConnect:!0,reconnection:!0,reconnectionAttempts:5,reconnectionDelay:1e3}),F.on("connect",()=>{console.log(`[Socket.IO] Conectado: ${F.id}`)}),F.on("disconnect",()=>{console.log("[Socket.IO] Desconectado.")}),F},disconnect(){F&&(F.disconnect(),F=null)},getSocket(){return F},createRoom(n,e,t,s,i,r,o,l){F&&F.emit("createRoom",{name:n,password:e,maxPlayers:t,duration:s,goalLimit:i,fieldSize:r,showReplay:o,profile:l})},joinRoom(n,e,t){F&&F.emit("joinRoom",{roomCode:n,password:e,profile:t})},leaveRoom(){F&&F.emit("leaveRoom")},changeTeam(n){F&&F.emit("changeTeam",n)},toggleReady(){F&&F.emit("toggleReady")},sendChatMessage(n){F&&F.emit("chatMessage",n)},addBot(n){F&&F.emit("addBot",n)},removeBot(n){F&&F.emit("removeBot",n)},kickPlayer(n){F&&F.emit("kickPlayer",n)},updateRoomSettings(n){F&&F.emit("updateRoomSettings",n)},startGame(){F&&F.emit("startGame")},sendGameInput(n){F&&F.emit("gameInput",n)},skipReplay(){F&&F.emit("skipReplay")},onLobbyUpdate(n){F&&F.on("lobbyUpdate",n)},onChat(n){F&&F.on("chatMessage",n)},onMatchStarted(n){F&&F.on("matchStarted",n)},onGameState(n){F&&(F.off("gameState"),F.on("gameState",n))},onPlayReplay(n){F&&F.on("playReplay",n)},onMatchEnded(n){F&&F.on("matchEnded",n)},onKicked(n){F&&F.on("kicked",n)},onPublicRoomsList(n){F&&F.on("publicRoomsList",n)},clearListeners(){F&&(F.off("lobbyUpdate"),F.off("chatMessage"),F.off("matchStarted"),F.off("gameState"),F.off("playReplay"),F.off("matchEnded"),F.off("kicked"),F.off("publicRoomsList"))}},pp=1024,mp=640,x=36,Tt=180,Gt=30,xe=6,Tn=10,nt=16,oa=.955,gp=.9,JA=1.9,_p=3.2,XA=6,Ey=90,ZA=.0022,ek=.006,yp=82,tk=140,vp=9,nk=120,sk=80,Ep=30,wp=1/3,Tp=3.8,ik=12,rk=34,ok=12,Ip=1/3,ak=22,lk=60,Vl=120,ht={RED:0,BLUE:1};class ck{constructor(){this.x=pp/2,this.y=mp/2,this.r=Tn,this.targetX=pp/2,this.targetY=mp/2,this.owner=null}updateState(e){this.targetX=e.x,this.targetY=e.y,this.owner=e.owner}interpolate(e=.35){this.x+=(this.targetX-this.x)*e,this.y+=(this.targetY-this.y)*e}draw(e){e.fillStyle="rgba(0,0,0,.25)",e.beginPath(),e.ellipse(this.x+3,this.y+6,this.r*1.1,this.r*.6,0,0,Math.PI*2),e.fill();const t=e.createRadialGradient(this.x-5,this.y-5,4,this.x,this.y,this.r);t.addColorStop(0,"#ffffff"),t.addColorStop(1,"#bfc8d6"),e.fillStyle=t,e.beginPath(),e.arc(this.x,this.y,this.r,0,Math.PI*2),e.fill()}}class bp{constructor(e){this.id=e.id,this.name=e.name,this.badge=e.badge,this.team=e.team,this.x=e.x,this.y=e.y,this.r=nt,this.dir=e.dir||0,this.targetX=e.x,this.targetY=e.y,this.targetDir=e.dir||0,this.stamina=e.stamina,this.staminaLock=e.staminaLock,this.stun=e.stun,this.shootHalo=e.shootHalo,this.invuln=e.invuln,this.trail=[]}updateState(e){this.name=e.name,this.badge=e.badge,this.targetX=e.x,this.targetY=e.y,this.targetDir=e.dir,this.stamina=e.stamina,this.staminaLock=e.staminaLock,this.stun=e.stun,this.shootHalo=e.shootHalo,this.invuln=e.invuln,this.staminaLock<=0&&this.invuln>0?(this.trail.push({x:this.x,y:this.y,alpha:.5}),this.trail.length>5&&this.trail.shift()):this.trail.length>0&&this.trail.shift()}interpolate(e=.35){this.x+=(this.targetX-this.x)*e,this.y+=(this.targetY-this.y)*e;let t=this.targetDir-this.dir;t=Math.atan2(Math.sin(t),Math.cos(t)),this.dir+=t*e}draw(e,t){e.save();for(const s of this.trail)e.fillStyle=this.team===ht.RED?`rgba(239, 68, 68, ${s.alpha})`:`rgba(96, 165, 250, ${s.alpha})`,e.beginPath(),e.arc(s.x,s.y,this.r-2,0,Math.PI*2),e.fill(),s.alpha-=.1;if(e.restore(),e.fillStyle="rgba(0,0,0,.25)",e.beginPath(),e.ellipse(this.x+4,this.y+8,this.r*1.1,this.r*.6,0,0,Math.PI*2),e.fill(),e.beginPath(),e.arc(this.x,this.y,this.r,0,Math.PI*2),e.fillStyle=this.team===ht.RED?"#ef4444":"#3b82f6",e.fill(),e.lineWidth=2,e.strokeStyle="rgba(0,0,0,.45)",e.stroke(),this.shootHalo>0&&(e.strokeStyle="#000000",e.lineWidth=2,e.beginPath(),e.arc(this.x,this.y,this.r+2,0,Math.PI*2),e.stroke()),this.badge){e.fillStyle="#0b1020";const s=nA(this.badge),i=s.length>=2&&!sA(s[0])?14:16;e.font=`700 ${i}px system-ui, "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif`,e.textAlign="center",e.textBaseline="middle",e.fillText(this.badge,this.x,this.y)}this.invuln>0&&(e.strokeStyle="#22c55e",e.setLineDash([4,4]),e.beginPath(),e.arc(this.x,this.y,this.r+4,0,Math.PI*2),e.stroke(),e.setLineDash([])),t===this.id&&(e.fillStyle="rgba(255,255,255,.85)",e.beginPath(),e.moveTo(this.x,this.y-this.r-10),e.lineTo(this.x-6,this.y-this.r-2),e.lineTo(this.x+6,this.y-this.r-2),e.closePath(),e.fill()),this.stun>0&&(e.strokeStyle="#ef4444",e.lineWidth=2,e.beginPath(),e.arc(this.x,this.y,this.r+2,0,Math.PI*2),e.stroke()),this.name&&(e.fillStyle="#e2e8f0",e.font="700 12px system-ui",e.textAlign="center",e.fillText(this.name,this.x,this.y-this.r-14))}}class hk{static clamp(e,t,s){return Math.max(t,Math.min(s,e))}static rnd(e,t){return e+Math.random()*(t-e)}static normalizedAngle(e){return e%=Math.PI*2,e<-Math.PI?e+Math.PI*2:e>Math.PI?e-Math.PI*2:e}static lerpAngle(e,t,s){e=this.normalizedAngle(e),t=this.normalizedAngle(t);let i=this.normalizedAngle(t-e);return e+i*s}static circleCollision(e,t){const s=t.x-e.x,i=t.y-e.y,r=Math.hypot(s,i);return r<e.r+t.r?{dx:s,dy:i,d:r}:null}static collidePlayerWithCorner(e,t,s,i){const r=e.x-t,o=e.y-s,l=Math.hypot(r,o)||1e-6,c=e.r+i;if(l<c){const h=r/l,d=o/l,p=c-l;e.x+=h*p,e.y+=d*p;const m=e.vx*h+e.vy*d;e.vx-=.8*m*h,e.vy-=.8*m*d}}static collideBallWithCorner(e,t,s,i,r){const o=e.x-t,l=e.y-s,c=Math.hypot(o,l)||1e-6,h=e.r+i;if(c<h){const d=o/c,p=l/c,m=h-c;e.x+=d*m,e.y+=p*m;const E=e.vx*d+e.vy*p;e.vx-=1.7*E*d,e.vy-=1.7*E*p,e.strikeTimer>0&&(e.lastStrikeType==="kick"||e.lastStrikeType==="power")&&r&&r()}}static resolvePlayerPlayer(e){for(let t=0;t<e.length;t++)for(let s=t+1;s<e.length;s++){const i=e[t],r=e[s],o=this.circleCollision(i,r);if(!o)continue;const l=o.d||1e-6,c=o.dx/l,h=o.dy/l,d=(i.r+r.r-l)*.5;i.x-=c*d,i.y-=h*d,r.x+=c*d,r.y+=h*d;const p=r.vx-i.vx,m=r.vy-i.vy,E=p*c+m*h;let R=.7;(i.stun>0||r.stun>0||i.tackleFreeze>0||r.tackleFreeze>0)&&(R=0);const A=-E*R;i.vx-=A*c,i.vy-=A*h,r.vx+=A*c,r.vy+=A*h}}static resolvePlayerBall(e,t,s){for(const i of e){const r=this.circleCollision(i,t);if(!r)continue;const o=r.d||1e-6,l=r.dx/o,c=r.dy/o,h=i.r+t.r-o;t.owner||(t.noPickupFrames<=0||t.noPickupFrom!==i.id?(t.x+=l*h,t.y+=c*h,t.vx+=i.vx*.22,t.vy+=i.vy*.22,t.owner=i.id,t.lastStrikeType=null,t.strikeTimer=0,s&&s(i)):(t.x+=l*Math.max(0,h-1),t.y+=c*Math.max(0,h-1),t.vx+=i.vx*.05,t.vy+=i.vy*.05)),t.lastTouch=i.id}}static updatePlayerPhysics(e,t,s,i){if(e.stun>0){e.vx=0,e.vy=0,e.tackle_cd>0&&e.tackle_cd--,e.dribble_cd>0&&e.dribble_cd--,e.dash_time>0&&e.dash_time--,e.invuln>0&&e.invuln--,e.stun--,e.cool>0&&e.cool--,e.power_cd>0&&e.power_cd--,e.tackleFreeze>0&&e.tackleFreeze--,e.aiShootLock>0&&e.aiShootLock--,e.shootHalo>0&&e.shootHalo--,e.tackleEval>0&&(e.tackleEval--,e.tackleEval===0&&!e.tackleSuccess&&(e.stun=Math.max(e.stun,Ep)));return}e.staminaLock>0?(e.stamina=0,e.staminaLock--):t.sprint&&e.stamina>0?(e.stamina=Math.max(0,e.stamina-ek),e.stamina===0&&(e.staminaLock=Ey)):e.stamina=Math.min(1,e.stamina+ZA);const r=t.sprint&&e.staminaLock<=0&&e.stamina>0,o=e.slowTimer>0?.7:1;e.slowTimer>0&&e.slowTimer--;const l=r?1+(1.3-1)*e.stamina:1,c=JA*l*o,h=e.dash_time>0?1.7:1;let d=t.x||0,p=t.y||0;const m=Math.hypot(d,p)||1;if(e.vx=e.vx*gp+d/m*c*.12*h,e.vy=e.vy*gp+p/m*c*.12*h,d||p){const E=Math.atan2(p,d);e.dir=this.lerpAngle(e.dir,E,.35),e.lastMoveDir=e.dir}t.shoot?e.kickCharge=Math.min(1,e.kickCharge+.065):e.kickCharge*=.95,e.boostCooldown>0&&e.boostCooldown--,e.tackle_cd>0&&e.tackle_cd--,e.dribble_cd>0&&e.dribble_cd--,e.dash_time>0&&e.dash_time--,e.invuln>0&&e.invuln--,e.cool>0&&e.cool--,e.power_cd>0&&e.power_cd--,e.tackleFreeze>0&&e.tackleFreeze--,e.aiShootLock>0&&e.aiShootLock--,e.shootHalo>0&&e.shootHalo--,e.tackleEval>0&&(e.tackleEval--,e.tackleEval===0&&!e.tackleSuccess&&(e.vx=0,e.vy=0,e.stun=Math.max(e.stun,Ep)))}static applyLimits(e,t,s,i,r,o,l,c,h=1024,d=640){let p=e.x+e.vx,m=e.y+e.vy;if(m>t&&m<s||(m-e.r<x&&(m=x+e.r,e.vy*=-.5),m+e.r>d-x&&(m=d-x-e.r,e.vy*=-.5)),m>t&&m<s){p-e.r<i&&(p=i+e.r,e.vx=Math.max(e.vx,0)*.5),p+e.r>r&&(p=r-e.r,e.vx=Math.min(e.vx,0)*.5);const E=p<x&&p>=i-6,R=p>h-x&&p<=r+6;(E||R)&&(m-e.r<t&&(m=t+e.r,e.vy=Math.max(e.vy,0)*.4),m+e.r>s&&(m=s-e.r,e.vy=Math.min(e.vy,0)*.4));const A={x:p,y:m,vx:e.vx,vy:e.vy,r:e.r};this.collidePlayerWithCorner(A,o,t,c),this.collidePlayerWithCorner(A,o,s,c),this.collidePlayerWithCorner(A,l,t,c),this.collidePlayerWithCorner(A,l,s,c),p=A.x,m=A.y,e.vx=A.vx,e.vy=A.vy}else{p-e.r<x&&(p=x+e.r,e.vx*=-.5),p+e.r>h-x&&(p=h-x-e.r,e.vx*=-.5);const E={x:p,y:m,vx:e.vx,vy:e.vy,r:e.r};this.collidePlayerWithCorner(E,o,t,c),this.collidePlayerWithCorner(E,o,s,c),this.collidePlayerWithCorner(E,l,t,c),this.collidePlayerWithCorner(E,l,s,c),p=E.x,m=E.y,e.vx=E.vx,e.vy=E.vy}e.x=p,e.y=m}static updateBallPhysics(e,t,s,i,r,o,l,c,h,d,p,m=1024,E=640){if(e.boostCooldown>0&&e.boostCooldown--,e.noPickupFrames>0&&(e.noPickupFrames--,e.noPickupFrames===0&&(e.noPickupFrom=null)),e.strikeTimer>0&&e.strikeTimer--,e.owner){const R=h.find(A=>A.id===e.owner);if(R){const A=R.r+e.r+1,P=Math.cos(R.dir||0),V=Math.sin(R.dir||0);let U=R.x+P*A,q=R.y+V*A,J=x+e.r,ye=m-x-e.r;q>t&&q<s&&(J=i+e.r,ye=r-e.r),e.x=this.clamp(U,J,ye),e.y=this.clamp(q,x+e.r,E-x-e.r),e.vx=R.vx,e.vy=R.vy,q>t&&q<s&&(e.x+e.r<=o&&p("blue",R.id),e.x-e.r>=l&&p("red",R.id));return}else e.owner=null}if(e.vx*=oa,e.vy*=oa,e.x+=e.vx,e.y+=e.vy,e.y-e.r<x&&(e.y=x+e.r,e.vy*=-.75),e.y+e.r>E-x&&(e.y=E-x-e.r,e.vy*=-.75),e.x-e.r<x&&(e.y>t&&e.y<s?(this.collideBallWithCorner(e,o,t,c,()=>d("post")),this.collideBallWithCorner(e,o,s,c,()=>d("post"))):(e.x=x+e.r,e.vx*=-.75)),e.x+e.r>m-x&&(e.y>t&&e.y<s?(this.collideBallWithCorner(e,l,t,c,()=>d("post")),this.collideBallWithCorner(e,l,s,c,()=>d("post"))):(e.x=m-x-e.r,e.vx*=-.75)),e.y>t&&e.y<s){const R=e.x<x&&e.x>=i-30,A=e.x>m-x&&e.x<=r+30;(R||A)&&(R&&e.x-e.r<i&&(e.x=i+e.r,e.vx*=-.65),A&&e.x+e.r>r&&(e.x=r-e.r,e.vx*=-.65),e.y-e.r<t&&(e.y=t+e.r,e.vy*=-.65),e.y+e.r>s&&(e.y=s-e.r,e.vy*=-.65))}e.y>t&&e.y<s&&(e.x+e.r<=o&&p("blue",e.lastTouch),e.x-e.r>=l&&p("red",e.lastTouch))}static kickBall(e,t,s,i){t.owner=null,t.noPickupFrames=14,t.noPickupFrom=e.id,t.vx+=Math.cos(s)*i,t.vy+=Math.sin(s)*i,t.vx+=this.rnd(-.05,.05),t.vy+=this.rnd(-.05,.05),t.lastTouch=e.id,t.lastStrikeType="kick",t.strikeTimer=40}static powerKick(e,t,s,i){t.owner=null,t.noPickupFrames=14,t.noPickupFrom=e.id,t.vx+=Math.cos(s)*i,t.vy+=Math.sin(s)*i,t.vx+=this.rnd(-.05,.05),t.vy+=this.rnd(-.05,.05),t.lastTouch=e.id,t.lastStrikeType="power",t.strikeTimer=40}}const Cp={currentUser:null,mode:"solo",difficulty:"medium",score:{red:0,blue:0},matchTime:0,goalLimit:3,status:"lobby",countdown:0,activeRoom:null,canvas:null,ctx:null,ball:null,players:[],localPhysicsTick:null,keys:new Map,codes:new Map,replayFrames:[],inReplay:!1,replayFrameIdx:0,replayTimer:0,replayBlob:null,mediaRecorder:null,recordedChunks:[],isRecording:!1,goalsScored:0,assistsGained:0,savesDone:0,async init(n){this.currentUser=n,this.canvas=document.getElementById("match-canvas"),this.canvas&&(this.ctx=this.canvas.getContext("2d",{alpha:!1})),window.addEventListener("keydown",e=>{const t=e.key.toLowerCase();this.keys.set(t,!0),this.codes.set(e.code,!0),$.currentScreenId==="match-screen"&&["arrowup","arrowdown","arrowleft","arrowright"," ","enter"].includes(t)&&e.preventDefault()}),window.addEventListener("keyup",e=>{this.keys.set(e.key.toLowerCase(),!1),this.codes.set(e.code,!1)}),window.addEventListener("blur",()=>this.keys.clear()),this.setupViewTriggers(),this.bindDOMEvents()},setupViewTriggers(){const n=document.getElementById("mode-btn-back");n&&(n.onclick=()=>$.show("menu-screen"));const e=document.getElementById("mode-card-solo");e&&(e.onclick=()=>{this.mode="solo",$.show("solo-screen")});const t=document.getElementById("mode-card-multiplayer");t&&(t.onclick=()=>{this.mode="multiplayer",$.show("multiplayer-screen")});const s=document.getElementById("solo-btn-back");s&&(s.onclick=()=>$.show("mode-select-screen"));const i=document.getElementById("multiplayer-btn-back");i&&(i.onclick=()=>$.show("mode-select-screen"));const r=document.getElementById("create-room-btn-back");r&&(r.onclick=()=>$.show("multiplayer-screen"));const o=document.getElementById("join-code-btn-back");o&&(o.onclick=()=>$.show("multiplayer-screen")),$.register("multiplayer-screen",{onEnter:()=>{Y.connect(),Y.onPublicRoomsList(l=>this.renderRoomsList(l))},onExit:()=>{Y.clearListeners()}}),$.register("lobby-screen",{onEnter:()=>{Y.onLobbyUpdate(l=>this.updateLobbyView(l)),Y.onChat(l=>this.appendChatMessage(l)),Y.onMatchStarted(()=>{ce("A partida está começando!","success"),$.show("match-screen")}),Y.onKicked(()=>{ce("Você foi expulso do lobby pelo Host.","error"),$.show("multiplayer-screen")})},onExit:()=>{Y.clearListeners()}}),$.register("match-screen",{onEnter:()=>{Pt.ensureAudio(),this.startMatchView()},onExit:()=>{this.stopMatchView()}}),$.register("ranking-screen",{onEnter:()=>this.loadRanking("wins")})},bindDOMEvents(){const n=document.querySelectorAll("#solo-ai-difficulty button");n.forEach(y=>{y.onclick=()=>{n.forEach(w=>w.classList.remove("active")),y.classList.add("active"),this.difficulty=y.getAttribute("data-diff")}});const e=document.getElementById("solo-btn-start");e&&(e.onclick=()=>{this.goalLimit=parseInt(document.getElementById("solo-goals").value,10),this.matchTime=parseInt(document.getElementById("solo-minutes").value,10)*60,$.show("match-screen")});const t=document.getElementById("lobby-btn-leave");t&&(t.onclick=()=>{Y.leaveRoom(),$.show("multiplayer-screen")});const s=document.getElementById("lobby-btn-ready");s&&(s.onclick=()=>{Y.toggleReady()});const i=document.getElementById("lobby-btn-start");i&&(i.onclick=()=>{Y.startGame()});const r=document.getElementById("lobby-btn-join-red");r&&(r.onclick=()=>Y.changeTeam("red"));const o=document.getElementById("lobby-btn-join-blue");o&&(o.onclick=()=>Y.changeTeam("blue"));const l=document.getElementById("lobby-btn-join-spec");l&&(l.onclick=()=>Y.changeTeam("spectator"));const c=document.getElementById("btn-add-bot-red");c&&(c.onclick=()=>Y.addBot("red"));const h=document.getElementById("btn-add-bot-blue");h&&(h.onclick=()=>Y.addBot("blue"));const d=document.getElementById("btn-copy-code");d&&(d.onclick=()=>{const y=document.getElementById("lobby-room-code").textContent;navigator.clipboard.writeText(y).then(()=>{ce("Código copiado!","success")})});const p=document.getElementById("lobby-chat-form");p&&(p.onsubmit=y=>{y.preventDefault();const w=document.getElementById("lobby-chat-input"),T=w.value.trim();T&&(Y.sendChatMessage(T),w.value="")});const m=document.getElementById("multi-btn-create-room");m&&(m.onclick=()=>$.show("create-room-screen"));const E=document.getElementById("multi-btn-join-code");E&&(E.onclick=()=>$.show("join-code-screen"));const R=document.getElementById("create-room-form");R&&(R.onsubmit=y=>{y.preventDefault();const w=document.getElementById("room-name-input").value,T=document.getElementById("room-password-input").value,C=document.getElementById("room-max-players").value,v=document.getElementById("room-duration").value,at=document.getElementById("room-goals").value,vt=document.getElementById("room-field-size"),ds=document.getElementById("room-replay-toggle"),an=vt?vt.value:"medium",kt=ds?ds.checked:!0,ln={uid:this.currentUser.uid,username:Ue.profileData.username,badge:Ue.profileData.badge||"🏳️"};Y.createRoom(w,T,C,v,at,an,kt,ln),Y.getSocket().once("roomCreated",fs=>{ce("Lobby criado!","success"),$.show("lobby-screen")})});const A=document.getElementById("join-code-form");A&&(A.onsubmit=y=>{y.preventDefault();const w=document.getElementById("join-code-input").value.toUpperCase(),T=document.getElementById("join-password-input").value,C={uid:this.currentUser.uid,username:Ue.profileData.username,badge:Ue.profileData.badge||"🏳️"};Y.joinRoom(w,T,C),Y.getSocket().once("joinSuccess",()=>{ce("Entrou no lobby com sucesso!","success"),$.show("lobby-screen")}),Y.getSocket().once("joinError",v=>{ce(v,"error")})});const P=document.getElementById("match-btn-exit");P&&(P.onclick=()=>{confirm("Deseja realmente sair da partida?")&&(this.localPhysicsTick&&cancelAnimationFrame(this.localPhysicsTick),Pt.stopCrowd&&Pt.stopCrowd(),this.mode==="multiplayer"?(Y.leaveRoom(),$.show("multiplayer-screen")):$.show("solo-screen"))});const V=document.getElementById("btn-skip-replay");V&&(V.onclick=()=>{this.mode==="multiplayer"?Y.skipReplay():this.endReplayPlayback()});const U=document.getElementById("btn-save-replay");U&&(U.onclick=()=>{this.downloadReplay()});const q=document.getElementById("game-chat-form");q&&(q.onsubmit=y=>{y.preventDefault();const w=document.getElementById("game-chat-input"),T=w.value.trim();T&&(this.mode==="multiplayer"?Y.sendChatMessage(T):this.appendChatMessage({time:new Date().toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"}),username:Ue.profileData.displayName,badge:Ue.profileData.badge,text:T},!0),w.value=""),w.blur(),q.classList.remove("active"),this.canvas.focus()});const J=document.getElementById("rank-filter-wins"),ye=document.getElementById("rank-filter-goals"),ue=document.getElementById("rank-filter-level");J&&(J.onclick=()=>this.loadRanking("wins")),ye&&(ye.onclick=()=>this.loadRanking("goals")),ue&&(ue.onclick=()=>this.loadRanking("level"));const I=document.getElementById("post-btn-continue");I&&(I.onclick=()=>{this.mode==="multiplayer"?$.show("lobby-screen"):$.show("solo-screen")});const _=document.getElementById("ranking-btn-back");_&&(_.onclick=()=>$.show("menu-screen"))},startMatchView(){this.canvas=document.getElementById("match-canvas"),this.ctx=this.canvas.getContext("2d",{alpha:!1}),this.recordedChunks=[],this.isRecording=!1;const n=Ki.dimensions;this.canvas.width=n.w,this.canvas.height=n.h,this.resizeCanvasContainer(),window.addEventListener("resize",()=>this.resizeCanvasContainer()),this.p1PossessionFrames=0,this.cpuPossessionFrames=0,this.totalPossessionFrames=0,this.p1Shots=0,this.p1Tackles=0,this.p1Dribbles=0,this.shotCooldown=0,this.goalsScored=0,this.assistsGained=0,this.savesDone=0,this.score={red:0,blue:0},this.inReplay=!1;const e=document.getElementById("focus-lost-badge"),t=()=>{const s=document.hidden||!document.hasFocus();e&&(s?e.classList.remove("hidden"):e.classList.add("hidden"))};document.addEventListener("visibilitychange",t),window.addEventListener("blur",()=>{e&&e.classList.remove("hidden")}),window.addEventListener("focus",()=>{e&&e.classList.add("hidden")}),this.ball=new ck,this.players=[],this.setupPauseMenu(),window.addEventListener("keydown",s=>{if($.currentScreenId==="match-screen")if(s.key==="Enter"){const i=document.getElementById("game-chat-form"),r=document.getElementById("game-chat-input");i&&r&&(i.classList.contains("active")||(i.classList.add("active"),r.focus()))}else(s.key==="Escape"||s.key==="p"||s.key==="P")&&this.togglePauseMenu()}),this.mode==="solo"?this.startLocalSoloMatch():this.startOnlineMatch()},resizeCanvasContainer(){if($.currentScreenId!=="match-screen"||!this.canvas)return;const n=document.querySelector(".match-wrap"),e=document.getElementById("match-stage");if(!n||!e)return;const t=this.canvas.width/this.canvas.height,s=window.innerWidth-80;let r=window.innerHeight-110,o=r*t;if(o>s){const l=s/o;o*=l,r*=l}o=Math.floor(o),r=Math.floor(r),e.style.gridTemplateColumns=`56px ${o}px 56px`,e.style.width=`${o+112+16}px`,e.style.height=`${r}px`,this.canvas.style.width=`${o}px`,this.canvas.style.height=`${r}px`},startLocalSoloMatch(){this.p1Tackles=0,this.p1Dribbles=0,this.p2Tackles=0,this.p2Dribbles=0,this.p1TackleLock=!1,this.p1DribbleLock=!1,this.p2TackleLock=!1,this.p2DribbleLock=!1;const n=Ue.profileData.username,e=Ue.profileData.badge||"🇧🇷",t=document.getElementById("solo-field-size"),s=document.getElementById("solo-replay-toggle"),i=t?t.value:"medium";this.showReplay=s?s.checked:!0,i==="small"?(this.canvas.width=896,this.canvas.height=560):i==="large"?(this.canvas.width=1280,this.canvas.height=768):(this.canvas.width=1024,this.canvas.height=640),this.resizeCanvasContainer(),this.currentUser.uid,this.difficulty,this.p1PossessionFrames=0,this.cpuPossessionFrames=0,this.totalPossessionFrames=0,this.p1Shots=0,this.p1Tackles=0,this.p1Dribbles=0,this.shotCooldown=0,this.goalsScored=0,this.assistsGained=0,this.savesDone=0,this.status="countdown",this.countdown=150,this.ball.x=this.canvas.width/2,this.ball.y=this.canvas.height/2;const r={score:{red:0,blue:0},matchTime:this.matchTime,status:"countdown",countdownTimer:150,goalFreezeTimer:0,replayBuffer:[]},o={id:"cpu",team:ht.RED,cpu:!0,difficulty:this.difficulty,x:x+120,y:this.canvas.height*.5,vx:0,vy:0,r:nt,dir:0,lastMoveDir:0,stamina:1,staminaLock:0,stun:0,slowTimer:0,tackle_cd:0,dribble_cd:0,dash_time:0,invuln:0,power_cd:0,tackleFreeze:0,tackleSuccess:!1,tackleEval:0,shootHalo:0,aiShootLock:0,aiFeintLock:0},l={id:"p1",team:ht.BLUE,cpu:!1,x:this.canvas.width-x-120,y:this.canvas.height*.5,vx:0,vy:0,r:nt,dir:0,lastMoveDir:0,stamina:1,staminaLock:0,stun:0,slowTimer:0,tackle_cd:0,dribble_cd:0,dash_time:0,invuln:0,power_cd:0,tackleFreeze:0,tackleSuccess:!1,tackleEval:0,shootHalo:0},c=[o,l];this.players=c.map(d=>new bp(d));const h={x:this.canvas.width/2,y:this.canvas.height/2,vx:0,vy:0,r:Tn,owner:null,lastTouch:null,strikeTimer:0,lastStrikeType:null,noPickupFrames:0,noPickupFrom:null};(()=>{const d=hk;let p=[];const m=()=>{var Et;if($.currentScreenId!=="match-screen")return;p=[];const A=this.canvas.width,P=this.canvas.height,V=(P-Tt)/2,U=(P+Tt)/2,q=x-xe,J=A-x+xe,ye=q-Gt,ue=J+Gt,I=10;if(!this.isPaused){if(r.status==="countdown")r.countdownTimer--,r.countdownTimer<=0&&(r.status="playing");else if(r.status==="freeze")r.goalFreezeTimer--,r.goalFreezeTimer<=0&&(this.inReplay=!0,this.replayFrames=[...r.replayBuffer],this.replayFrameIdx=0,this.replayTimer=0,(Et=document.getElementById("replay-overlay"))==null||Et.classList.remove("hidden"),r.status="replay",r.countdownTimer=Vl*2+30,this.startLocalReplayRecording());else if(r.status==="replay")r.countdownTimer--,r.countdownTimer<=0&&(this.endReplayPlayback(),(r.score.red>=this.goalLimit||r.score.blue>=this.goalLimit)&&this.goalLimit>0?(r.status="ended",this.localMatchEnd(r.score)):(r.status="countdown",r.countdownTimer=150,E()));else if(r.status==="playing"){r.matchTime-=1/60,r.matchTime<=0&&(r.matchTime=0,r.status="ended",this.localMatchEnd(r.score));let G={x:0,y:0,shoot:!1,sprint:!1,dribble:!1,tackle:!1,power:!1};const we=Ki.CTRL_P1;this.keys.get(we.up)&&(G.y-=1),this.keys.get(we.down)&&(G.y+=1),this.keys.get(we.left)&&(G.x-=1),this.keys.get(we.right)&&(G.x+=1),we.sprint.startsWith("Shift")?G.sprint=this.codes.get(we.sprint):G.sprint=this.keys.get(we.sprint),G.shoot=this.keys.get(we.shoot),G.dribble=this.keys.get(we.dribble),G.tackle=this.keys.get(we.tackle),G.power=this.keys.get(we.power);let lt={x:0,y:0,shoot:!1,sprint:!1,dribble:!1,tackle:!1,power:!1};if(o.stun<=0){const L={x:h.x,y:h.y};if(!h.owner){let mt=h.vx,un=h.vy;for(let Mr=0;Mr<10;Mr++)mt*=oa,un*=oa,L.x+=mt,L.y+=un}const Ce=Math.hypot(L.x-o.x,L.y-o.y);let de=L.x,Pe=L.y;const cn=h.x<A/2;if(h.owner==="cpu"){de=J;const mt=Math.hypot(l.x-o.x,l.y-o.y);this.difficulty!=="easy"&&mt<120?(Pe=l.y>o.y?o.y-80:o.y+80,this.difficulty==="hard"&&o.dribble_cd<=0&&(lt.dribble=!0)):Pe=d.clamp(o.y,V+20,U-20)}else if(h.owner==="p1")if(Math.hypot(l.x-o.x,l.y-o.y)>200){const un=x;de=un+(l.x-un)*.7,Pe=P*.5+(l.y-P*.5)*.7}else de=l.x,Pe=l.y;else cn&&Ce>260&&this.difficulty!=="easy"?(de=x+50,Pe=d.clamp(L.y,V+10,U-10)):(de=L.x,Pe=L.y);let hn=de-o.x,ps=Pe-o.y,ms=Math.hypot(hn,ps)||1,gs=hn/ms,ai=ps/ms,_s=1,qt=0;this.difficulty==="easy"?(_s=.72,qt=.25):this.difficulty==="medium"&&(_s=.88,qt=.12),qt>0&&Math.random()<.05&&(gs+=d.rnd(-qt,qt),ai+=d.rnd(-qt,qt)),lt.x=gs*_s,lt.y=ai*_s;const Or=h.owner==="cpu"&&Math.abs(J-o.x)>200||!h.owner&&Ce>120;if(lt.sprint=Or&&o.staminaLock<=0&&o.stamina>.3,h.owner==="cpu"){const mt=Math.abs(J-o.x);(mt<100||mt<160&&o.y>V&&o.y<U)&&(lt.shoot=!0)}else h.owner==="p1"&&Ce<yp&&o.tackle_cd<=0&&this.difficulty!=="easy"&&(lt.tackle=!0)}const xr=(L,Ce)=>{if(!(L.stun>0)){if(Ce.tackle&&L.tackle_cd<=0&&L.stamina>=wp){L.stamina=Math.max(0,L.stamina-wp),L.tackle_cd=tk,L.tackleSuccess=!1,L.tackleEval=12,L.slowTimer=sk,L.tackleFreeze=8,p.push("tackle");const de=L.id==="p1"?o:l,Pe=h.owner===de.id?Math.atan2(de.y-L.y,de.x-L.x):L.dir;L.vx+=Math.cos(Pe)*vp,L.vy+=Math.sin(Pe)*vp,h.owner===de.id&&de.invuln<=0&&Math.hypot(de.x-L.x,de.y-L.y)<=yp&&(h.owner=L.id,h.lastTouch=L.id,h.noPickupFrames=10,h.noPickupFrom=null,h.vx=0,h.vy=0,de.stun=Math.max(de.stun,nk),de.vx=0,de.vy=0,L.tackleSuccess=!0)}if(Ce.dribble&&L.dribble_cd<=0&&h.owner===L.id&&L.stamina>=Ip&&(L.stamina=Math.max(0,L.stamina-Ip),L.dash_time=ik,L.invuln=ok,L.dribble_cd=rk,L.vx+=Math.cos(L.dir)*Tp,L.vy+=Math.sin(L.dir)*Tp,p.push("dribble")),Ce.power&&L.power_cd<=0&&L.stamina>=.98&&(h.owner===L.id||Math.hypot(L.x-h.x,L.y-h.y)<L.r+h.r+8)){L.stamina=0,L.staminaLock=Ey,L.power_cd=lk,L.cool=12,L.shootHalo=22;const de=Ce.x||Ce.y?Math.atan2(Ce.y,Ce.x):L.dir;d.powerKick(L,h,de,ak),p.push("power")}if(L.kickCharge>0&&!Ce.shoot){const de=d.clamp(L.kickCharge,0,1),Pe=Math.max(.08,.4*de);if(L.staminaLock<=0&&L.stamina>=Pe){L.stamina=Math.max(0,L.stamina-Pe),L.cool=14,L.shootHalo=18;const cn=Ce.x||Ce.y?Math.atan2(Ce.y,Ce.x):L.dir,hn=Math.max(_p,_p+XA*de);d.kickBall(L,h,cn,hn),p.push("kick")}L.kickCharge=0}}};xr(l,G),xr(o,lt),d.updatePlayerPhysics(l,G,h,L=>p.push(L)),d.updatePlayerPhysics(o,lt,h,L=>p.push(L)),d.applyLimits(l,V,U,ye,ue,q,J,I,A,P),d.applyLimits(o,V,U,ye,ue,q,J,I,A,P),d.resolvePlayerPlayer(c),d.resolvePlayerBall(c,h,()=>{for(const L of c)L.tackleEval>0&&h.owner===L.id&&(L.tackleSuccess=!0)}),d.updateBallPhysics(h,V,U,ye,ue,q,J,I,c,L=>p.push(L),L=>{L==="blue"?r.score.blue++:r.score.red++;const Ce=h.lastTouch==="p1"?n:"CPU Bot",de=L==="blue"&&h.lastTouch==="cpu"||L==="red"&&h.lastTouch==="p1";this.lastGoal={side:L,scorerName:Ce,ownGoal:de},p.push("whistle"),p.push("goal"),p.push("cheer"),(r.score.red>=this.goalLimit||r.score.blue>=this.goalLimit)&&this.goalLimit>0?(r.status="ended",this.localMatchEnd(r.score)):this.showReplay?(r.status="freeze",r.goalFreezeTimer=Vl):(r.status="countdown",r.countdownTimer=150,E())},A,P)}R()}this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height),this.drawFieldGrid(this.ctx),this.inReplay?this.playbackReplay():(p.forEach(G=>Pt.play(G)),this.ball.x=h.x,this.ball.y=h.y,this.ball.owner=h.owner,this.ball.draw(this.ctx),this.players.forEach(G=>{const we=G.id==="p1"?l:o;G.x=we.x,G.y=we.y,G.dir=we.dir,G.stamina=we.stamina,G.staminaLock=we.staminaLock,G.stun=we.stun,G.shootHalo=we.shootHalo,G.invuln=we.invuln,G.draw(this.ctx,h.owner)})),this.drawNetOverlay(this.ctx);const _=Math.floor(r.matchTime/60),y=Math.floor(r.matchTime%60),w=document.getElementById("match-clock"),T=document.getElementById("match-score");w&&(w.textContent=`${String(_).padStart(2,"0")}:${String(y).padStart(2,"0")}`),T&&(T.textContent=`${r.score.red} : ${r.score.blue}`);const C=document.getElementById("right-stam-fill"),v=document.getElementById("right-pow-fill"),at=document.getElementById("left-stam-fill"),vt=document.getElementById("left-pow-fill");C&&(C.style.height=`${l.stamina*100}%`),v&&(v.style.height=`${l.kickCharge*100}%`),at&&(at.style.height=`${o.stamina*100}%`),vt&&(vt.style.height=`${o.kickCharge*100}%`),h.owner==="p1"?this.p1PossessionFrames=(this.p1PossessionFrames||0)+1:h.owner==="cpu"?this.cpuPossessionFrames=(this.cpuPossessionFrames||0)+1:h.lastTouch==="p1"?this.p1PossessionFrames=(this.p1PossessionFrames||0)+1:h.lastTouch==="cpu"&&(this.cpuPossessionFrames=(this.cpuPossessionFrames||0)+1),this.totalPossessionFrames=(this.totalPossessionFrames||0)+1;const ds=Math.round((this.p1PossessionFrames||0)/(this.totalPossessionFrames||1)*100);if(this.shotCooldown>0&&this.shotCooldown--,Math.hypot(l.x-h.x,l.y-h.y)<nt+Tn+12&&(inputP1.shoot||inputP1.power)&&!this.shotCooldown){const G=Math.atan2(h.y-l.y,h.x-l.x);Math.cos(G)>.2&&(this.p1Shots=(this.p1Shots||0)+1,this.shotCooldown=30)}l.tackle_cd>0&&!this.p1TackleLock?(this.p1Tackles=(this.p1Tackles||0)+1,this.p1TackleLock=!0):l.tackle_cd===0&&(this.p1TackleLock=!1),l.dribble_cd>0&&!this.p1DribbleLock?(this.p1Dribbles=(this.p1Dribbles||0)+1,this.p1DribbleLock=!0):l.dribble_cd===0&&(this.p1DribbleLock=!1);const kt=document.getElementById("right-stat-possession"),ln=document.getElementById("right-stat-shots"),fs=document.getElementById("right-stat-tackles"),Lr=document.getElementById("right-stat-dribbles");if(kt&&(kt.textContent=`${ds}%`),ln&&(ln.textContent=this.p1Shots||0),fs&&(fs.textContent=this.p1Tackles||0),Lr&&(Lr.textContent=this.p1Dribbles||0),r.status==="countdown"){const G=Math.max(0,Math.ceil(r.countdownTimer/60));this.drawCenterBanner(`Começa em ${G}...`,"Prepare-se!")}else if(r.status==="freeze"){const G=this.lastGoal.ownGoal?`GOL CONTRA de ${this.lastGoal.scorerName}`:`GOL DE ${this.lastGoal.scorerName}!`;this.drawCenterBanner(G,"Revisando jogada...")}r.status!=="ended"&&(this.localPhysicsTick=requestAnimationFrame(m))},E=()=>{const A=(Math.random()-.5)*20,P=(Math.random()-.5)*20;l.x=this.canvas.width-x-120+A,l.y=this.canvas.height*.5+P,l.vx=l.vy=0,l.kickCharge=0,l.stamina=1,l.staminaLock=0,l.stun=0;const V=(Math.random()-.5)*20,U=(Math.random()-.5)*20;o.x=x+120+V,o.y=this.canvas.height*.5+U,o.vx=o.vy=0,o.kickCharge=0,o.stamina=1,o.staminaLock=0,o.stun=0,h.x=this.canvas.width/2,h.y=this.canvas.height/2,h.vx=h.vy=0,h.owner=null,h.lastTouch=null},R=()=>{const A=c.map(V=>({x:V.x,y:V.y,dir:V.dir,team:V.team,has:h.owner===V.id,name:V.id==="p1"?n:"CPU Bot",badge:V.id==="p1"?e:"⚙️",inv:V.invuln||0,stun:V.stun||0,halo:V.shootHalo||0})),P={ball:{x:h.x,y:h.y},players:A,score:{...r.score},sfx:[...p]};r.replayBuffer.push(P),r.replayBuffer.length>Vl*2&&r.replayBuffer.shift()};E(),this.localPhysicsTick=requestAnimationFrame(m)})()},localMatchEnd(n){cancelAnimationFrame(this.localPhysicsTick),this.stopLocalReplayRecording(),ce("Fim de jogo!","info");const e=n.blue>n.red,t=n.red>n.blue,s=n.red===n.blue,i=e?50:s?20:10;Je.saveMatchResult(this.currentUser.uid,e,t,s,this.goalsScored,this.assistsGained,this.savesDone,i).then(()=>{const r={mode:"solo",date:new Date().toISOString(),playerUids:[this.currentUser.uid],playerTeams:{[this.currentUser.uid]:e?ht.BLUE:s?-1:ht.RED},winner:e?ht.BLUE:s?"draw":ht.RED,scoreRed:n.red,scoreBlue:n.blue};return Je.addMatchToHistory(r)}).then(()=>{document.getElementById("post-score-red").textContent=n.red,document.getElementById("post-score-blue").textContent=n.blue,document.getElementById("post-mvp").textContent=n.blue>=n.red?Ue.profileData.username:"CPU Bot",document.getElementById("post-xp-gained").textContent=`+${i} XP`,document.getElementById("post-total-goals").textContent=n.red+n.blue,$.show("post-game-screen")}).catch(r=>{console.error(r),$.show("solo-screen")})},startOnlineMatch(){this.p1Tackles=0,this.p1Dribbles=0,this.p2Tackles=0,this.p2Dribbles=0,this.p1TackleLock=!1,this.p1DribbleLock=!1,this.p2TackleLock=!1,this.p2DribbleLock=!1;const n=Y.getSocket();n&&(n.off("fieldSizeUpdated"),n.off("matchReset")),this.status="countdown",this.countdown=150,this.fieldSize==="small"?(this.canvas.width=896,this.canvas.height=560):this.fieldSize==="large"?(this.canvas.width=1280,this.canvas.height=768):(this.canvas.width=1024,this.canvas.height=640),this.resizeCanvasContainer(),Y.onGameState(t=>{this.status=t.status,this.countdown=t.countdown,this.score=t.score,this.matchTime=t.matchTime,t.soundEffects.forEach(i=>Pt.play(i)),this.ball.updateState(t.ball),t.players.forEach(i=>{let r=this.players.find(o=>o.id===i.id);r||(r=new bp(i),this.players.push(r)),r.updateState(i)});const s=t.players.map(i=>i.id);this.players=this.players.filter(i=>s.includes(i.id))}),Y.getSocket().on("fieldSizeUpdated",({size:t})=>{this.fieldSize=t,t==="small"?(this.canvas.width=896,this.canvas.height=560):t==="large"?(this.canvas.width=1280,this.canvas.height=768):(this.canvas.width=1024,this.canvas.height=640),this.resizeCanvasContainer(),ce("O Host alterou o tamanho do campo!","info")}),Y.getSocket().on("matchReset",()=>{ce("A partida foi reiniciada pelo Host!","info"),this.p1Tackles=0,this.p1Dribbles=0,this.p2Tackles=0,this.p2Dribbles=0}),Y.onPlayReplay(({replayFrames:t,goalInfo:s})=>{var i;this.inReplay=!0,this.replayFrames=t,this.replayFrameIdx=0,this.replayTimer=0,this.lastGoal=s,(i=document.getElementById("replay-overlay"))==null||i.classList.remove("hidden"),this.startLocalReplayRecording()}),Y.onMatchEnded(t=>{ce("Partida finalizada!","info"),this.stopLocalReplayRecording();const s=!this.players.find(c=>c.id===Y.getSocket().id&&c.team!=="spectator");let i=!1,r=!1,o=t.red===t.blue;if(!s){const c=this.players.find(d=>d.id===Y.getSocket().id),h=t.blue>t.red?ht.BLUE:ht.RED;i=c.team===h&&!o,r=c.team!==h&&!o}const l=s?0:i?80:o?30:15;s||Je.saveMatchResult(this.currentUser.uid,i,r,o,this.goalsScored,this.assistsGained,this.savesDone,l).then(()=>{const c={mode:"multiplayer",date:new Date().toISOString(),playerUids:[this.currentUser.uid],playerTeams:{[this.currentUser.uid]:localP.team},winner:t.blue>t.red?ht.BLUE:o?"draw":ht.RED,scoreRed:t.red,scoreBlue:t.blue};return Je.addMatchToHistory(c)}),document.getElementById("post-score-red").textContent=t.red,document.getElementById("post-score-blue").textContent=t.blue,document.getElementById("post-mvp").textContent=t.blue>=t.red?"Azul":"Vermelho",document.getElementById("post-xp-gained").textContent=s?"Espectador":`+${l} XP`,document.getElementById("post-total-goals").textContent=t.red+t.blue,$.show("post-game-screen")});const e=()=>{if($.currentScreenId!=="match-screen")return;let t={x:0,y:0,shoot:!1,sprint:!1,dribble:!1,tackle:!1,power:!1};const s=Ki.CTRL_P1;this.keys.get(s.up)&&(t.y-=1),this.keys.get(s.down)&&(t.y+=1),this.keys.get(s.left)&&(t.x-=1),this.keys.get(s.right)&&(t.x+=1),s.sprint.startsWith("Shift")?t.sprint=this.codes.get(s.sprint):t.sprint=this.keys.get(s.sprint),t.shoot=this.keys.get(s.shoot),t.dribble=this.keys.get(s.dribble),t.tackle=this.keys.get(s.tackle),t.power=this.keys.get(s.power),Y.sendGameInput(t),this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height),this.drawFieldGrid(this.ctx),this.inReplay?this.playbackReplay():(this.ball.interpolate(.35),this.ball.draw(this.ctx),this.players.forEach(p=>{p.interpolate(.35),p.draw(this.ctx,this.ball.owner)})),this.drawNetOverlay(this.ctx);const i=Math.floor(this.matchTime/60),r=Math.floor(this.matchTime%60),o=document.getElementById("match-clock"),l=document.getElementById("match-score");o&&(o.textContent=`${String(i).padStart(2,"0")}:${String(r).padStart(2,"0")}`),l&&(l.textContent=`${this.score.red} : ${this.score.blue}`);const c=Y.getSocket().id,h=this.players.find(p=>p.id===c),d=this.players.find(p=>p.id!==c&&p.team!=="spectator");if(h){const p=document.getElementById("right-stam-fill"),m=document.getElementById("right-pow-fill");p&&(p.style.height=`${h.stamina*100}%`);let E=0;t.shoot&&(E=1),m&&(m.style.height=`${E*100}%`),d&&(this.ball.owner===h.id?this.p1PossessionFrames=(this.p1PossessionFrames||0)+1:this.ball.owner===d.id?this.cpuPossessionFrames=(this.cpuPossessionFrames||0)+1:this.ball.lastTouch===h.id?this.p1PossessionFrames=(this.p1PossessionFrames||0)+1:this.ball.lastTouch===d.id&&(this.cpuPossessionFrames=(this.cpuPossessionFrames||0)+1),this.totalPossessionFrames=(this.totalPossessionFrames||0)+1);const R=Math.round((this.p1PossessionFrames||0)/(this.totalPossessionFrames||1)*100);if(this.shotCooldown>0&&this.shotCooldown--,Math.hypot(h.x-this.ball.x,h.y-this.ball.y)<nt+Tn+12&&t.shoot&&!this.shotCooldown){const J=Math.atan2(this.ball.y-h.y,this.ball.x-h.x),ye=h.team===ht.BLUE;(ye&&Math.cos(J)>.2||!ye&&Math.cos(J)<-.2)&&(this.p1Shots=(this.p1Shots||0)+1,this.shotCooldown=30)}h.tackle_cd>0&&!this.p1TackleLock?(this.p1Tackles=(this.p1Tackles||0)+1,this.p1TackleLock=!0):h.tackle_cd===0&&(this.p1TackleLock=!1),h.dribble_cd>0&&!this.p1DribbleLock?(this.p1Dribbles=(this.p1Dribbles||0)+1,this.p1DribbleLock=!0):h.dribble_cd===0&&(this.p1DribbleLock=!1);const P=document.getElementById("right-stat-possession"),V=document.getElementById("right-stat-shots"),U=document.getElementById("right-stat-tackles"),q=document.getElementById("right-stat-dribbles");P&&(P.textContent=`${R}%`),V&&(V.textContent=this.p1Shots||0),U&&(U.textContent=this.p1Tackles||0),q&&(q.textContent=this.p1Dribbles||0)}if(d){const p=document.getElementById("left-stam-fill"),m=document.getElementById("left-pow-fill");p&&(p.style.height=`${d.stamina*100}%`),m&&(m.style.height=`${(d.kickCharge||0)*100}%`)}if(this.status==="countdown")this.drawCenterBanner(`Começa em ${this.countdown}...`,"Prepare-se!");else if(this.status==="freeze"){const p=this.lastGoal.ownGoal?`GOL CONTRA de ${this.lastGoal.scorerName}`:`GOL DE ${this.lastGoal.scorerName}!`;this.drawCenterBanner(p,"Revisando jogada...")}this.localPhysicsTick=requestAnimationFrame(e)};this.localPhysicsTick=requestAnimationFrame(e)},stopMatchView(){var n;cancelAnimationFrame(this.localPhysicsTick),this.stopLocalReplayRecording(),Y.clearListeners(),(n=document.getElementById("replay-overlay"))==null||n.classList.add("hidden"),window.removeEventListener("resize",()=>this.resizeCanvasContainer())},startLocalReplayRecording(){if(!(!this.canvas||this.isRecording))try{const n=this.canvas.captureStream(30),e=Pt.getRecordingStreamDestination();e&&e.stream.getAudioTracks().forEach(s=>n.addTrack(s)),this.recordedChunks=[],this.mediaRecorder=new MediaRecorder(n,{mimeType:"video/webm;codecs=vp9,opus"}),this.mediaRecorder.ondataavailable=t=>{t.data&&t.data.size>0&&this.recordedChunks.push(t.data)},this.mediaRecorder.onstop=()=>{this.replayBlob=new Blob(this.recordedChunks,{type:"video/webm"}),this.isRecording=!1;const t=document.getElementById("btn-save-replay");t&&(t.style.display="inline-block")},this.mediaRecorder.start(),this.isRecording=!0}catch(n){console.warn("Replay recording not supported on this browser.",n)}},stopLocalReplayRecording(){if(this.mediaRecorder&&this.isRecording)try{this.mediaRecorder.stop()}catch{}},downloadReplay(){if(!this.replayBlob)return;const n=URL.createObjectURL(this.replayBlob),e=document.createElement("a");e.href=n,e.download=`KickerHax-Replay-${Date.now()}.webm`,document.body.appendChild(e),e.click(),document.body.removeChild(e),URL.revokeObjectURL(n),ce("Replay baixado com sucesso!","success")},playbackReplay(){if(this.replayFrames.length===0)return;if(this.replayTimer++,this.replayTimer%2===0&&(this.replayFrameIdx++,this.replayFrameIdx>=this.replayFrames.length)){this.endReplayPlayback();return}const n=this.replayFrames[Math.min(this.replayFrameIdx,this.replayFrames.length-1)];if(!n)return;this.replayTimer%2===0&&n.sfx.forEach(t=>Pt.play(t)),uk(this.ctx,n.ball.x,n.ball.y),n.players.forEach(t=>{dk(this.ctx,t.x,t.y,t.team,t.name,t.badge,t.halo,t.inv,t.stun,t.has)});const e=document.getElementById("replay-caption");if(e&&this.lastGoal){const t=this.lastGoal.ownGoal?`GOL CONTRA de ${this.lastGoal.scorerName}`:`GOL DE ${this.lastGoal.scorerName}!`;e.textContent=t,e.style.display="block"}},endReplayPlayback(){var e;this.inReplay=!1,this.stopLocalReplayRecording(),(e=document.getElementById("replay-overlay"))==null||e.classList.add("hidden");const n=document.getElementById("replay-caption");n&&(n.style.display="none"),Pt.ensureAudio()},drawSpeedPad(n,e,t,s){n.save(),n.shadowColor="#00f0ff",n.shadowBlur=s?16:8,n.fillStyle=s?"rgba(0, 240, 255, 0.45)":"rgba(0, 240, 255, 0.18)",n.strokeStyle="#00f0ff",n.lineWidth=2.5,n.beginPath(),n.arc(e,t,32,0,Math.PI*2),n.fill(),n.stroke(),n.fillStyle="#00f0ff",n.beginPath(),e<this.canvas.width/2?(n.moveTo(e-6,t+6),n.lineTo(e+10,t-10),n.lineTo(e+2,t-10),n.lineTo(e+10,t-10),n.lineTo(e+10,t-2)):(n.moveTo(e+6,t-6),n.lineTo(e-10,t+10),n.lineTo(e-2,t+10),n.lineTo(e-10,t+10),n.lineTo(e-10,t+2)),n.strokeStyle="#00f0ff",n.lineWidth=3,n.stroke(),n.restore()},drawFieldGrid(n){const e=this.canvas.width,t=this.canvas.height,s=(t-Tt)/2;n.fillStyle="#1e293b",n.fillRect(0,0,e,t),n.strokeStyle="#334155",n.lineWidth=2;for(let d=4;d<x-8;d+=6)n.strokeRect(d,d,e-d*2,t-d*2);n.save();let i=12345;const r=()=>{let d=Math.sin(i++)*1e4;return d-Math.floor(d)};for(let d=8;d<e-8;d+=12)for(let p=8;p<t-8;p+=12){const m=d<x-8||d>e-x+8,E=p<x-8||p>t-x+8;if((m||E)&&r()<.35){const R=["#ef4444","#3b82f6","#10b981","#f59e0b","#ec4899","#94a3b8"];n.fillStyle=R[Math.floor(r()*R.length)],n.beginPath(),n.arc(d,p,2.5,0,Math.PI*2),n.fill()}}n.restore(),n.fillStyle="#2e7d32",n.fillRect(x-8,x-8,e-2*x+16,t-2*x+16);const o=14,l=(e-2*x+16)/o;n.fillStyle="#388e3c";for(let d=0;d<o;d+=2)n.fillRect(x-8+d*l,x-8,l,t-2*x+16);n.save(),n.strokeStyle="#ffffff",n.lineWidth=3,n.strokeRect(x,x,e-2*x,t-2*x),n.beginPath(),n.moveTo(e/2,x),n.lineTo(e/2,t-x),n.stroke(),n.beginPath(),n.arc(e/2,t/2,72,0,Math.PI*2),n.stroke(),n.beginPath(),n.arc(e/2,t/2,4,0,Math.PI*2),n.fillStyle="#ffffff",n.fill(),n.strokeRect(x,(t-260)/2,140,260),n.strokeRect(x,(t-110)/2,50,110),n.beginPath(),n.arc(x+100,t/2,3,0,Math.PI*2),n.fill(),n.strokeRect(e-x-140,(t-260)/2,140,260),n.strokeRect(e-x-50,(t-110)/2,50,110),n.beginPath(),n.arc(e-x-100,t/2,3,0,Math.PI*2),n.fill();const c=12;n.lineWidth=2,n.beginPath(),n.arc(x,x,c,0,Math.PI*.5),n.stroke(),n.beginPath(),n.arc(x,t-x,c,-Math.PI*.5,0),n.stroke(),n.beginPath(),n.arc(e-x,x,c,Math.PI*.5,Math.PI),n.stroke(),n.beginPath(),n.arc(e-x,t-x,c,Math.PI,-Math.PI*.5),n.stroke(),n.restore();const h=(d,p,m)=>{n.save(),n.translate(d,p),n.rotate(m),n.strokeStyle="#fbbf24",n.lineWidth=2,n.beginPath(),n.moveTo(0,0),n.lineTo(-6,-6),n.stroke(),n.fillStyle="#ef4444",n.beginPath(),n.moveTo(-6,-6),n.lineTo(-12,-4),n.lineTo(-8,-10),n.closePath(),n.fill(),n.restore()};h(x,x,0),h(x,t-x,-Math.PI*.5),h(e-x,x,Math.PI*.5),h(e-x,t-x,Math.PI),n.fillStyle="#0f172a",n.fillRect(x-xe,s,xe,Tt),n.fillRect(e-x,s,xe,Tt),n.fillStyle="rgba(255, 255, 255, 0.04)",n.fillRect(x-xe-Gt,s,Gt,Tt),n.fillRect(e-x+xe,s,Gt,Tt)},drawNetOverlay(n){const e=this.canvas.width,t=this.canvas.height,s=(t-Tt)/2,i=(t+Tt)/2;n.fillStyle="#0f172a",n.fillRect(x-xe,s,xe,Tt),n.fillRect(e-x,s,xe,Tt),n.save(),n.strokeStyle="rgba(255,255,255,.18)",n.lineWidth=1,n.beginPath();for(let r=x-xe-Gt;r<=x-xe;r+=10)n.moveTo(r,s),n.lineTo(r,i);for(let r=s;r<=i;r+=10)n.moveTo(x-xe-Gt,r),n.lineTo(x-xe,r);for(let r=e-x+xe;r<=e-x+xe+Gt;r+=10)n.moveTo(r,s),n.lineTo(r,i);for(let r=s;r<=i;r+=10)n.moveTo(e-x+xe,r),n.lineTo(e-x+xe+Gt,r);n.stroke(),n.restore()},drawCenterBanner(n,e){const t=this.canvas.width,s=this.canvas.height;this.ctx.save(),this.ctx.globalAlpha=.95;const i=640,r=140,o=t/2-i/2,l=s*.25;this.ctx.fillStyle="rgba(7, 11, 25, 0.9)",this.ctx.fillRect(o,l,i,r),this.ctx.strokeStyle="rgba(255, 255, 255, 0.12)",this.ctx.strokeRect(o+.5,l+.5,i-1,r-1),this.ctx.fillStyle="#e2e8f0",this.ctx.font="800 24px Outfit",this.ctx.textAlign="center",this.ctx.textBaseline="middle",this.ctx.fillText(n,t/2,l+50),this.ctx.font="600 15px Inter",this.ctx.fillStyle="#60a5fa",this.ctx.fillText(e,t/2,l+90),this.ctx.restore()},renderRoomsList(n){const e=document.getElementById("rooms-list-body");if(e){if(n.length===0){e.innerHTML='<tr><td colspan="6" class="text-center">Nenhuma sala criada no momento. Seja o primeiro!</td></tr>';return}e.innerHTML="",n.forEach(t=>{const s=document.createElement("tr"),i=t.hasPassword?"🔒 Senha":"🔓 Pública";s.innerHTML=`
        <td><strong>${t.name}</strong></td>
        <td>${t.playersCount}/${t.maxPlayers}</td>
        <td>${t.duration} min</td>
        <td>${t.goalLimit} gols</td>
        <td>${i}</td>
        <td><button class="btn btn-secondary btn-sm" id="join-btn-${t.code}">Entrar</button></td>
      `,e.appendChild(s);const r=document.getElementById(`join-btn-${t.code}`);r&&(r.onclick=()=>{if(t.hasPassword){const o=prompt("Digite a senha da sala:");o!==null&&this.joinRoomWithCode(t.code,o)}else this.joinRoomWithCode(t.code,"")})})}},joinRoomWithCode(n,e){const t={uid:this.currentUser.uid,username:Ue.profileData.username,badge:Ue.profileData.badge||"🏳️"};Y.joinRoom(n,e,t),Y.getSocket().once("joinSuccess",()=>{ce("Entrou na sala!","success"),$.show("lobby-screen")}),Y.getSocket().once("joinError",s=>{ce(s,"error")})},updateLobbyView(n){if(!n)return;this.fieldSize=n.fieldSize||"medium",this.showReplay=n.showReplay!==void 0?n.showReplay:!0,document.getElementById("lobby-room-name").textContent=n.name,document.getElementById("lobby-room-code").textContent=n.code,document.getElementById("lobby-setting-time").textContent=`${n.duration}m`,document.getElementById("lobby-setting-goals").textContent=n.goalLimit===0?"Sem Limite":n.goalLimit;const e={small:"Pequeno",medium:"Médio",large:"Grande"},t=document.getElementById("lobby-setting-size");t&&(t.textContent=e[this.fieldSize]||"Médio");const s=document.getElementById("lobby-setting-replay");s&&(s.textContent=this.showReplay?"Sim":"Não");const i=Y.getSocket().id,r=n.hostId===i,o=document.getElementById("lobby-btn-start"),l=document.getElementById("lobby-host-bot-controls");o&&o.classList.toggle("hidden",!r),l&&l.classList.toggle("hidden",!r);const c=document.getElementById("lobby-red-players"),h=document.getElementById("lobby-blue-players"),d=document.getElementById("lobby-spec-players");c&&(c.innerHTML=""),h&&(h.innerHTML=""),d&&(d.innerHTML=""),n.players.forEach(m=>{const E=document.createElement("div");E.className="lobby-player-row";const A=m.team==="spectator"?"":`<span class="ready-badge ${m.ready?"ready":""}">${m.ready?"Pronto":"Aguardando"}</span>`,P=r&&m.id!==i&&!m.cpu?`<button class="kick-btn" id="kick-btn-${m.id}">❌</button>`:"",V=r&&m.cpu?`<button class="kick-btn" id="remove-bot-btn-${m.id}">❌</button>`:"";E.innerHTML=`
        <span class="lobby-player-name"><span>${m.badge}</span> <span>${m.username}</span></span>
        <span class="lobby-player-meta">
          ${A}
          ${P}
          ${V}
        </span>
      `,m.team==="red"?c==null||c.appendChild(E):m.team==="blue"?h==null||h.appendChild(E):d==null||d.appendChild(E);const U=document.getElementById(`kick-btn-${m.id}`);U&&(U.onclick=()=>{Y.kickPlayer(m.id)});const q=document.getElementById(`remove-bot-btn-${m.id}`);q&&(q.onclick=()=>{Y.removeBot(m.id)})});const p=document.getElementById("lobby-chat-messages");p&&(p.innerHTML="",n.chatHistory.forEach(m=>this.appendChatMessage(m)))},appendChatMessage(n,e=!1){[document.getElementById("lobby-chat-messages"),document.getElementById("game-chat-messages")].forEach(s=>{if(!s)return;s.id==="lobby-chat-messages"||(s.classList.remove("inactive"),clearTimeout(s._fadeTimer),s._fadeTimer=setTimeout(()=>s.classList.add("inactive"),4e3));const r=document.createElement("div"),o=n.username==="Sistema";r.className=`chat-msg ${o?"system":""}`;const l=n.badge?`<span>${n.badge}</span> `:"";r.innerHTML=`
        <span class="msg-time">[${n.time}]</span>
        <span class="msg-sender">${l}${n.username}:</span>
        <span class="msg-text">${n.text}</span>
      `,s.appendChild(r),s.scrollTop=s.scrollHeight})},async loadRanking(n="wins"){const e=document.getElementById("leaderboard-body");if(!e)return;e.innerHTML='<tr><td colspan="7" class="text-center">Carregando dados da tabela...</td></tr>';const t=document.getElementById("rank-filter-wins"),s=document.getElementById("rank-filter-goals"),i=document.getElementById("rank-filter-level");[t,s,i].forEach(r=>r==null?void 0:r.classList.remove("active")),n==="wins"&&(t==null||t.classList.add("active")),n==="goals"&&(s==null||s.classList.add("active")),n==="level"&&(i==null||i.classList.add("active"));try{const r=await Je.getGlobalRanking(n,10);if(r.length===0){e.innerHTML='<tr><td colspan="7" class="text-center">Nenhum jogador registrado no ranking.</td></tr>';return}e.innerHTML="",r.forEach((o,l)=>{const c=o.wins+o.losses>0?Math.round(o.wins/(o.wins+o.losses)*100):0,h=document.createElement("tr");h.innerHTML=`
          <td><strong>#${l+1}</strong></td>
          <td><span>${o.badge}</span> <strong>${o.displayName||o.username}</strong></td>
          <td>${o.level||1}</td>
          <td class="text-success">${o.wins}</td>
          <td class="text-danger">${o.losses}</td>
          <td>${o.goals}</td>
          <td>${c}%</td>
        `,e.appendChild(h)})}catch{e.innerHTML='<tr><td colspan="7" class="text-center text-danger">Erro ao carregar dados do banco.</td></tr>'}},togglePauseMenu(){const n=document.getElementById("pause-modal");if(n)if(n.classList.contains("hidden")){n.classList.remove("hidden"),this.mode==="solo"&&(this.isPaused=!0);const e=document.getElementById("host-controls");if(e){const t=this.mode==="solo"||this.mode==="online"&&this.isHost;e.style.display=t?"block":"none"}}else n.classList.add("hidden"),this.mode==="solo"&&(this.isPaused=!1)},setupPauseMenu(){const n=document.getElementById("pause-btn-resume");n&&(n.onclick=()=>{this.togglePauseMenu()});const e=document.getElementById("pause-btn-exit-match");e&&(e.onclick=()=>{this.togglePauseMenu();const r=document.getElementById("match-btn-exit");r&&r.click()});const t=document.getElementById("pause-btn-apply-settings"),s=document.getElementById("pause-field-size");t&&s&&(t.onclick=()=>{const r=s.value;this.mode==="solo"?(r==="small"?(this.canvas.width=896,this.canvas.height=560):r==="large"?(this.canvas.width=1280,this.canvas.height=768):(this.canvas.width=1024,this.canvas.height=640),this.resizeCanvasContainer(),ce("Tamanho do campo alterado!","success")):this.mode==="online"&&Y.getSocket().emit("hostChangeFieldSize",{size:r}),this.togglePauseMenu()});const i=document.getElementById("pause-btn-reset-match");i&&(i.onclick=()=>{this.mode==="solo"?(this.score={red:0,blue:0},this.p1Tackles=0,this.p1Dribbles=0,this.p2Tackles=0,this.p2Dribbles=0,this.localMatchSim&&(this.localMatchSim.score={red:0,blue:0},this.localMatchSim.status="countdown",this.localMatchSim.countdownTimer=150,this.localBallSim.x=this.canvas.width/2,this.localBallSim.y=this.canvas.height/2,this.localBallSim.vx=0,this.localBallSim.vy=0),ce("Partida reiniciada!","success")):this.mode==="online"&&Y.getSocket().emit("hostResetMatch"),this.togglePauseMenu()})}};function uk(n,e,t){n.fillStyle="rgba(0,0,0,.25)",n.beginPath(),n.ellipse(e+3,t+6,Tn*1.1,Tn*.6,0,0,Math.PI*2),n.fill();const s=n.createRadialGradient(e-5,t-5,4,e,t,Tn);s.addColorStop(0,"#ffffff"),s.addColorStop(1,"#bfc8d6"),n.fillStyle=s,n.beginPath(),n.arc(e,t,Tn,0,Math.PI*2),n.fill()}function dk(n,e,t,s,i,r,o,l,c,h){fk(n,e,t),n.beginPath(),n.arc(e,t,nt,0,Math.PI*2),n.fillStyle=s===ht.RED?"#ef4444":"#3b82f6",n.fill(),n.lineWidth=2,n.strokeStyle="rgba(0,0,0,.45)",n.stroke(),o>0&&(n.strokeStyle="#000000",n.lineWidth=2,n.beginPath(),n.arc(e,t,nt+2,0,Math.PI*2),n.stroke()),r&&(n.fillStyle="#0b1020",n.font="700 16px system-ui, sans-serif",n.textAlign="center",n.textBaseline="middle",n.fillText(r,e,t)),l>0&&(n.strokeStyle="#22c55e",n.setLineDash([4,4]),n.beginPath(),n.arc(e,t,nt+4,0,Math.PI*2),n.stroke(),n.setLineDash([])),c>0&&(n.strokeStyle="#ef4444",n.beginPath(),n.arc(e,t,nt+2,0,Math.PI*2),n.stroke()),h&&(n.fillStyle="rgba(255,255,255,.85)",n.beginPath(),n.moveTo(e,t-nt-10),n.lineTo(e-6,t-nt-2),n.lineTo(e+6,t-nt-2),n.closePath(),n.fill()),i&&(n.fillStyle="#e2e8f0",n.font="700 12px system-ui",n.textAlign="center",n.fillText(i,e,t-nt-14))}function fk(n,e,t){n.fillStyle="rgba(0,0,0,.25)",n.beginPath(),n.ellipse(e+4,t+8,nt*1.1,nt*.6,0,0,Math.PI*2),n.fill()}const pk={initialized:!1,init(){if(this.initialized)return;this.initialized=!0;const n=document.getElementById("global-chat-container"),e=document.getElementById("global-chat-toggle"),t=document.getElementById("global-chat-form"),s=document.getElementById("global-chat-input"),i=document.getElementById("global-chat-messages");!n||!e||!t||(e.addEventListener("click",()=>{n.classList.toggle("minimized"),n.classList.contains("minimized")||s.focus()}),t.addEventListener("submit",async r=>{r.preventDefault();const o=s.value.trim();if(o){if(!Ue.profileData){ce("Perfil não carregado ainda.","error");return}s.value="";try{await Je.sendGlobalChatMessage(Ue.profileData,o)}catch(l){ce("Erro ao enviar mensagem.","error"),console.error(l)}}}),Je.subscribeToGlobalChat(r=>{if(!r)return;const o=document.createElement("div");o.className="global-chat-msg";const l=r.timestamp?new Date(r.timestamp).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}):"";o.innerHTML=`
        <span class="msg-time">${l}</span>
        <span class="msg-badge">${r.badge}</span>
        <span class="msg-author">${r.username}:</span>
        <span class="msg-content">${r.text}</span>
      `,i.appendChild(o),i.scrollTop=i.scrollHeight}))}};function mk(){console.log("[Kicker Hax SPA] Inicializando...");const n=document.getElementById("match-btn-fullscreen");n&&(n.onclick=()=>gk()),tA.init(),Ki.loadSettings(),pk.init(),document.querySelectorAll("button, .btn").forEach(t=>{t.addEventListener("click",s=>{const i=document.createElement("span");i.className="ripple";const r=t.getBoundingClientRect(),o=Math.max(r.width,r.height);i.style.width=i.style.height=`${o}px`,i.style.left=`${s.clientX-r.left-o/2}px`,i.style.top=`${s.clientY-r.top-o/2}px`,t.appendChild(i),setTimeout(()=>i.remove(),500)})});const e=document.getElementById("splash-status");Je.subscribeToAuth(async t=>{if(t)if(e&&(e.textContent="Conectando ao banco de dados..."),await Ue.init(t),await Cp.init(t),Ki.init(),Ue.profileData&&Ue.profileData.isNewUser){ce("Escolha seu apelido de jogador antes de começar!","info");const s=document.getElementById("profile-btn-back");s&&(s.style.display="none"),$.show("profile-screen")}else{const s=document.getElementById("profile-btn-back");s&&(s.style.display=""),$.show("menu-screen")}else Ue.currentUser=null,Cp.currentUser=null,$.show("login-screen")})}function gk(){document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen().catch(n=>{console.warn(`Erro ao ativar tela cheia: ${n.message}`)})}window.addEventListener("DOMContentLoaded",mk);
