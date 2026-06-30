(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))s(i);new MutationObserver(i=>{for(const r of i)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&s(o)}).observe(document,{childList:!0,subtree:!0});function t(i){const r={};return i.integrity&&(r.integrity=i.integrity),i.referrerPolicy&&(r.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?r.credentials="include":i.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function s(i){if(i.ep)return;i.ep=!0;const r=t(i);fetch(i.href,r)}})();class jy{constructor(){this.routes=new Map,this.currentScreenId="splash-screen"}register(e,t={}){this.routes.set(e,{onEnter:t.onEnter||null,onExit:t.onExit||null})}show(e){const t=document.getElementById(e);if(!t){console.error(`[Router] Tela não encontrada: ${e}`);return}const s=this.currentScreenId,i=this.routes.get(s),r=this.routes.get(e);if(i&&i.onExit)try{i.onExit()}catch(c){console.error(`[Router] Erro ao sair da tela ${s}:`,c)}document.querySelectorAll(".screen-view").forEach(c=>{c.classList.add("hidden"),c.classList.remove("active")}),t.classList.remove("hidden"),t.classList.add("active"),this.currentScreenId=e;const l=document.getElementById("global-chat-container");if(l&&(e==="menu-screen"||e==="multiplayer-screen"?l.classList.remove("hidden"):l.classList.add("hidden")),r&&r.onEnter)try{r.onEnter()}catch(c){console.error(`[Router] Erro ao entrar na tela ${e}:`,c)}}}const $=new jy;var ad={};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const wp={NODE_ADMIN:!1,SDK_VERSION:"${JSCORE_VERSION}"};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const D=function(n,e){if(!n)throw Ys(e)},Ys=function(n){return new Error("Firebase Database ("+wp.SDK_VERSION+") INTERNAL ASSERT FAILED: "+n)};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Tp=function(n){const e=[];let t=0;for(let s=0;s<n.length;s++){let i=n.charCodeAt(s);i<128?e[t++]=i:i<2048?(e[t++]=i>>6|192,e[t++]=i&63|128):(i&64512)===55296&&s+1<n.length&&(n.charCodeAt(s+1)&64512)===56320?(i=65536+((i&1023)<<10)+(n.charCodeAt(++s)&1023),e[t++]=i>>18|240,e[t++]=i>>12&63|128,e[t++]=i>>6&63|128,e[t++]=i&63|128):(e[t++]=i>>12|224,e[t++]=i>>6&63|128,e[t++]=i&63|128)}return e},zy=function(n){const e=[];let t=0,s=0;for(;t<n.length;){const i=n[t++];if(i<128)e[s++]=String.fromCharCode(i);else if(i>191&&i<224){const r=n[t++];e[s++]=String.fromCharCode((i&31)<<6|r&63)}else if(i>239&&i<365){const r=n[t++],o=n[t++],l=n[t++],c=((i&7)<<18|(r&63)<<12|(o&63)<<6|l&63)-65536;e[s++]=String.fromCharCode(55296+(c>>10)),e[s++]=String.fromCharCode(56320+(c&1023))}else{const r=n[t++],o=n[t++];e[s++]=String.fromCharCode((i&15)<<12|(r&63)<<6|o&63)}}return e.join("")},Ic={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(n,e){if(!Array.isArray(n))throw Error("encodeByteArray takes an array as a parameter");this.init_();const t=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,s=[];for(let i=0;i<n.length;i+=3){const r=n[i],o=i+1<n.length,l=o?n[i+1]:0,c=i+2<n.length,h=c?n[i+2]:0,d=r>>2,p=(r&3)<<4|l>>4;let m=(l&15)<<2|h>>6,E=h&63;c||(E=64,o||(m=64)),s.push(t[d],t[p],t[m],t[E])}return s.join("")},encodeString(n,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(n):this.encodeByteArray(Tp(n),e)},decodeString(n,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(n):zy(this.decodeStringToByteArray(n,e))},decodeStringToByteArray(n,e){this.init_();const t=e?this.charToByteMapWebSafe_:this.charToByteMap_,s=[];for(let i=0;i<n.length;){const r=t[n.charAt(i++)],l=i<n.length?t[n.charAt(i)]:0;++i;const h=i<n.length?t[n.charAt(i)]:64;++i;const p=i<n.length?t[n.charAt(i)]:64;if(++i,r==null||l==null||h==null||p==null)throw new Gy;const m=r<<2|l>>4;if(s.push(m),h!==64){const E=l<<4&240|h>>2;if(s.push(E),p!==64){const C=h<<6&192|p;s.push(C)}}}return s},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let n=0;n<this.ENCODED_VALS.length;n++)this.byteToCharMap_[n]=this.ENCODED_VALS.charAt(n),this.charToByteMap_[this.byteToCharMap_[n]]=n,this.byteToCharMapWebSafe_[n]=this.ENCODED_VALS_WEBSAFE.charAt(n),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[n]]=n,n>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(n)]=n,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(n)]=n)}}};class Gy extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const Ip=function(n){const e=Tp(n);return Ic.encodeByteArray(e,!0)},wo=function(n){return Ip(n).replace(/\./g,"")},To=function(n){try{return Ic.decodeString(n,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Hy(n){return Cp(void 0,n)}function Cp(n,e){if(!(e instanceof Object))return e;switch(e.constructor){case Date:const t=e;return new Date(t.getTime());case Object:n===void 0&&(n={});break;case Array:n=[];break;default:return e}for(const t in e)!e.hasOwnProperty(t)||!Ky(t)||(n[t]=Cp(n[t],e[t]));return n}function Ky(n){return n!=="__proto__"}/**
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
 */function Qy(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
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
 */const Yy=()=>Qy().__FIREBASE_DEFAULTS__,Jy=()=>{if(typeof process>"u"||typeof ad>"u")return;const n=ad.__FIREBASE_DEFAULTS__;if(n)return JSON.parse(n)},Xy=()=>{if(typeof document>"u")return;let n;try{n=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const e=n&&To(n[1]);return e&&JSON.parse(e)},sa=()=>{try{return Yy()||Jy()||Xy()}catch(n){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${n}`);return}},bp=n=>{var e,t;return(t=(e=sa())===null||e===void 0?void 0:e.emulatorHosts)===null||t===void 0?void 0:t[n]},Rp=n=>{const e=bp(n);if(!e)return;const t=e.lastIndexOf(":");if(t<=0||t+1===e.length)throw new Error(`Invalid host ${e} with no separate hostname and port!`);const s=parseInt(e.substring(t+1),10);return e[0]==="["?[e.substring(1,t-1),s]:[e.substring(0,t),s]},Sp=()=>{var n;return(n=sa())===null||n===void 0?void 0:n.config},Ap=n=>{var e;return(e=sa())===null||e===void 0?void 0:e[`_${n}`]};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class hr{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}wrapCallback(e){return(t,s)=>{t?this.reject(t):this.resolve(s),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(t):e(t,s))}}}/**
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
 */function kp(n,e){if(n.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');const t={alg:"none",type:"JWT"},s=e||"demo-project",i=n.iat||0,r=n.sub||n.user_id;if(!r)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");const o=Object.assign({iss:`https://securetoken.google.com/${s}`,aud:s,iat:i,exp:i+3600,auth_time:i,sub:r,user_id:r,firebase:{sign_in_provider:"custom",identities:{}}},n);return[wo(JSON.stringify(t)),wo(JSON.stringify(o)),""].join(".")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function et(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function Cc(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(et())}function Zy(){var n;const e=(n=sa())===null||n===void 0?void 0:n.forceEnvironment;if(e==="node")return!0;if(e==="browser")return!1;try{return Object.prototype.toString.call(global.process)==="[object process]"}catch{return!1}}function ev(){return typeof navigator<"u"&&navigator.userAgent==="Cloudflare-Workers"}function tv(){const n=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof n=="object"&&n.id!==void 0}function Pp(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function nv(){const n=et();return n.indexOf("MSIE ")>=0||n.indexOf("Trident/")>=0}function sv(){return wp.NODE_ADMIN===!0}function iv(){return!Zy()&&!!navigator.userAgent&&navigator.userAgent.includes("Safari")&&!navigator.userAgent.includes("Chrome")}function rv(){try{return typeof indexedDB=="object"}catch{return!1}}function ov(){return new Promise((n,e)=>{try{let t=!0;const s="validate-browser-context-for-indexeddb-analytics-module",i=self.indexedDB.open(s);i.onsuccess=()=>{i.result.close(),t||self.indexedDB.deleteDatabase(s),n(!0)},i.onupgradeneeded=()=>{t=!1},i.onerror=()=>{var r;e(((r=i.error)===null||r===void 0?void 0:r.message)||"")}}catch(t){e(t)}})}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const av="FirebaseError";class ln extends Error{constructor(e,t,s){super(t),this.code=e,this.customData=s,this.name=av,Object.setPrototypeOf(this,ln.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,ur.prototype.create)}}class ur{constructor(e,t,s){this.service=e,this.serviceName=t,this.errors=s}create(e,...t){const s=t[0]||{},i=`${this.service}/${e}`,r=this.errors[e],o=r?lv(r,s):"Error",l=`${this.serviceName}: ${o} (${i}).`;return new ln(i,l,s)}}function lv(n,e){return n.replace(cv,(t,s)=>{const i=e[s];return i!=null?String(i):`<${s}?>`})}const cv=/\{\$([^}]+)}/g;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ki(n){return JSON.parse(n)}function Ne(n){return JSON.stringify(n)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Np=function(n){let e={},t={},s={},i="";try{const r=n.split(".");e=Ki(To(r[0])||""),t=Ki(To(r[1])||""),i=r[2],s=t.d||{},delete t.d}catch{}return{header:e,claims:t,data:s,signature:i}},hv=function(n){const e=Np(n),t=e.claims;return!!t&&typeof t=="object"&&t.hasOwnProperty("iat")},uv=function(n){const e=Np(n).claims;return typeof e=="object"&&e.admin===!0};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Vt(n,e){return Object.prototype.hasOwnProperty.call(n,e)}function Ms(n,e){if(Object.prototype.hasOwnProperty.call(n,e))return n[e]}function Ll(n){for(const e in n)if(Object.prototype.hasOwnProperty.call(n,e))return!1;return!0}function Io(n,e,t){const s={};for(const i in n)Object.prototype.hasOwnProperty.call(n,i)&&(s[i]=e.call(t,n[i],i,n));return s}function Co(n,e){if(n===e)return!0;const t=Object.keys(n),s=Object.keys(e);for(const i of t){if(!s.includes(i))return!1;const r=n[i],o=e[i];if(ld(r)&&ld(o)){if(!Co(r,o))return!1}else if(r!==o)return!1}for(const i of s)if(!t.includes(i))return!1;return!0}function ld(n){return n!==null&&typeof n=="object"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Js(n){const e=[];for(const[t,s]of Object.entries(n))Array.isArray(s)?s.forEach(i=>{e.push(encodeURIComponent(t)+"="+encodeURIComponent(i))}):e.push(encodeURIComponent(t)+"="+encodeURIComponent(s));return e.length?"&"+e.join("&"):""}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class dv{constructor(){this.chain_=[],this.buf_=[],this.W_=[],this.pad_=[],this.inbuf_=0,this.total_=0,this.blockSize=512/8,this.pad_[0]=128;for(let e=1;e<this.blockSize;++e)this.pad_[e]=0;this.reset()}reset(){this.chain_[0]=1732584193,this.chain_[1]=4023233417,this.chain_[2]=2562383102,this.chain_[3]=271733878,this.chain_[4]=3285377520,this.inbuf_=0,this.total_=0}compress_(e,t){t||(t=0);const s=this.W_;if(typeof e=="string")for(let p=0;p<16;p++)s[p]=e.charCodeAt(t)<<24|e.charCodeAt(t+1)<<16|e.charCodeAt(t+2)<<8|e.charCodeAt(t+3),t+=4;else for(let p=0;p<16;p++)s[p]=e[t]<<24|e[t+1]<<16|e[t+2]<<8|e[t+3],t+=4;for(let p=16;p<80;p++){const m=s[p-3]^s[p-8]^s[p-14]^s[p-16];s[p]=(m<<1|m>>>31)&4294967295}let i=this.chain_[0],r=this.chain_[1],o=this.chain_[2],l=this.chain_[3],c=this.chain_[4],h,d;for(let p=0;p<80;p++){p<40?p<20?(h=l^r&(o^l),d=1518500249):(h=r^o^l,d=1859775393):p<60?(h=r&o|l&(r|o),d=2400959708):(h=r^o^l,d=3395469782);const m=(i<<5|i>>>27)+h+c+d+s[p]&4294967295;c=l,l=o,o=(r<<30|r>>>2)&4294967295,r=i,i=m}this.chain_[0]=this.chain_[0]+i&4294967295,this.chain_[1]=this.chain_[1]+r&4294967295,this.chain_[2]=this.chain_[2]+o&4294967295,this.chain_[3]=this.chain_[3]+l&4294967295,this.chain_[4]=this.chain_[4]+c&4294967295}update(e,t){if(e==null)return;t===void 0&&(t=e.length);const s=t-this.blockSize;let i=0;const r=this.buf_;let o=this.inbuf_;for(;i<t;){if(o===0)for(;i<=s;)this.compress_(e,i),i+=this.blockSize;if(typeof e=="string"){for(;i<t;)if(r[o]=e.charCodeAt(i),++o,++i,o===this.blockSize){this.compress_(r),o=0;break}}else for(;i<t;)if(r[o]=e[i],++o,++i,o===this.blockSize){this.compress_(r),o=0;break}}this.inbuf_=o,this.total_+=t}digest(){const e=[];let t=this.total_*8;this.inbuf_<56?this.update(this.pad_,56-this.inbuf_):this.update(this.pad_,this.blockSize-(this.inbuf_-56));for(let i=this.blockSize-1;i>=56;i--)this.buf_[i]=t&255,t/=256;this.compress_(this.buf_);let s=0;for(let i=0;i<5;i++)for(let r=24;r>=0;r-=8)e[s]=this.chain_[i]>>r&255,++s;return e}}function fv(n,e){const t=new pv(n,e);return t.subscribe.bind(t)}class pv{constructor(e,t){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=t,this.task.then(()=>{e(this)}).catch(s=>{this.error(s)})}next(e){this.forEachObserver(t=>{t.next(e)})}error(e){this.forEachObserver(t=>{t.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,t,s){let i;if(e===void 0&&t===void 0&&s===void 0)throw new Error("Missing Observer.");mv(e,["next","error","complete"])?i=e:i={next:e,error:t,complete:s},i.next===void 0&&(i.next=nl),i.error===void 0&&(i.error=nl),i.complete===void 0&&(i.complete=nl);const r=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?i.error(this.finalError):i.complete()}catch{}}),this.observers.push(i),r}unsubscribeOne(e){this.observers===void 0||this.observers[e]===void 0||(delete this.observers[e],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let t=0;t<this.observers.length;t++)this.sendOne(t,e)}sendOne(e,t){this.task.then(()=>{if(this.observers!==void 0&&this.observers[e]!==void 0)try{t(this.observers[e])}catch(s){typeof console<"u"&&console.error&&console.error(s)}})}close(e){this.finalized||(this.finalized=!0,e!==void 0&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function mv(n,e){if(typeof n!="object"||n===null)return!1;for(const t of e)if(t in n&&typeof n[t]=="function")return!0;return!1}function nl(){}function ia(n,e){return`${n} failed: ${e} argument `}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const gv=function(n){const e=[];let t=0;for(let s=0;s<n.length;s++){let i=n.charCodeAt(s);if(i>=55296&&i<=56319){const r=i-55296;s++,D(s<n.length,"Surrogate pair missing trail surrogate.");const o=n.charCodeAt(s)-56320;i=65536+(r<<10)+o}i<128?e[t++]=i:i<2048?(e[t++]=i>>6|192,e[t++]=i&63|128):i<65536?(e[t++]=i>>12|224,e[t++]=i>>6&63|128,e[t++]=i&63|128):(e[t++]=i>>18|240,e[t++]=i>>12&63|128,e[t++]=i>>6&63|128,e[t++]=i&63|128)}return e},ra=function(n){let e=0;for(let t=0;t<n.length;t++){const s=n.charCodeAt(t);s<128?e++:s<2048?e+=2:s>=55296&&s<=56319?(e+=4,t++):e+=3}return e};/**
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
 */function ge(n){return n&&n._delegate?n._delegate:n}class Pn{constructor(e,t,s){this.name=e,this.instanceFactory=t,this.type=s,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
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
 */class _v{constructor(e,t){this.name=e,this.container=t,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const t=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(t)){const s=new hr;if(this.instancesDeferred.set(t,s),this.isInitialized(t)||this.shouldAutoInitialize())try{const i=this.getOrInitializeService({instanceIdentifier:t});i&&s.resolve(i)}catch{}}return this.instancesDeferred.get(t).promise}getImmediate(e){var t;const s=this.normalizeInstanceIdentifier(e==null?void 0:e.identifier),i=(t=e==null?void 0:e.optional)!==null&&t!==void 0?t:!1;if(this.isInitialized(s)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:s})}catch(r){if(i)return null;throw r}else{if(i)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(vv(e))try{this.getOrInitializeService({instanceIdentifier:jn})}catch{}for(const[t,s]of this.instancesDeferred.entries()){const i=this.normalizeInstanceIdentifier(t);try{const r=this.getOrInitializeService({instanceIdentifier:i});s.resolve(r)}catch{}}}}clearInstance(e=jn){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(t=>"INTERNAL"in t).map(t=>t.INTERNAL.delete()),...e.filter(t=>"_delete"in t).map(t=>t._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=jn){return this.instances.has(e)}getOptions(e=jn){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:t={}}=e,s=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(s))throw Error(`${this.name}(${s}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const i=this.getOrInitializeService({instanceIdentifier:s,options:t});for(const[r,o]of this.instancesDeferred.entries()){const l=this.normalizeInstanceIdentifier(r);s===l&&o.resolve(i)}return i}onInit(e,t){var s;const i=this.normalizeInstanceIdentifier(t),r=(s=this.onInitCallbacks.get(i))!==null&&s!==void 0?s:new Set;r.add(e),this.onInitCallbacks.set(i,r);const o=this.instances.get(i);return o&&e(o,i),()=>{r.delete(e)}}invokeOnInitCallbacks(e,t){const s=this.onInitCallbacks.get(t);if(s)for(const i of s)try{i(e,t)}catch{}}getOrInitializeService({instanceIdentifier:e,options:t={}}){let s=this.instances.get(e);if(!s&&this.component&&(s=this.component.instanceFactory(this.container,{instanceIdentifier:yv(e),options:t}),this.instances.set(e,s),this.instancesOptions.set(e,t),this.invokeOnInitCallbacks(s,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,s)}catch{}return s||null}normalizeInstanceIdentifier(e=jn){return this.component?this.component.multipleInstances?e:jn:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function yv(n){return n===jn?void 0:n}function vv(n){return n.instantiationMode==="EAGER"}/**
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
 */class Ev{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const t=this.getProvider(e.name);if(t.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);t.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const t=new _v(e,this);return this.providers.set(e,t),t}getProviders(){return Array.from(this.providers.values())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var te;(function(n){n[n.DEBUG=0]="DEBUG",n[n.VERBOSE=1]="VERBOSE",n[n.INFO=2]="INFO",n[n.WARN=3]="WARN",n[n.ERROR=4]="ERROR",n[n.SILENT=5]="SILENT"})(te||(te={}));const wv={debug:te.DEBUG,verbose:te.VERBOSE,info:te.INFO,warn:te.WARN,error:te.ERROR,silent:te.SILENT},Tv=te.INFO,Iv={[te.DEBUG]:"log",[te.VERBOSE]:"log",[te.INFO]:"info",[te.WARN]:"warn",[te.ERROR]:"error"},Cv=(n,e,...t)=>{if(e<n.logLevel)return;const s=new Date().toISOString(),i=Iv[e];if(i)console[i](`[${s}]  ${n.name}:`,...t);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class oa{constructor(e){this.name=e,this._logLevel=Tv,this._logHandler=Cv,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in te))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?wv[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,te.DEBUG,...e),this._logHandler(this,te.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,te.VERBOSE,...e),this._logHandler(this,te.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,te.INFO,...e),this._logHandler(this,te.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,te.WARN,...e),this._logHandler(this,te.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,te.ERROR,...e),this._logHandler(this,te.ERROR,...e)}}const bv=(n,e)=>e.some(t=>n instanceof t);let cd,hd;function Rv(){return cd||(cd=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function Sv(){return hd||(hd=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const Dp=new WeakMap,xl=new WeakMap,Lp=new WeakMap,sl=new WeakMap,bc=new WeakMap;function Av(n){const e=new Promise((t,s)=>{const i=()=>{n.removeEventListener("success",r),n.removeEventListener("error",o)},r=()=>{t(In(n.result)),i()},o=()=>{s(n.error),i()};n.addEventListener("success",r),n.addEventListener("error",o)});return e.then(t=>{t instanceof IDBCursor&&Dp.set(t,n)}).catch(()=>{}),bc.set(e,n),e}function kv(n){if(xl.has(n))return;const e=new Promise((t,s)=>{const i=()=>{n.removeEventListener("complete",r),n.removeEventListener("error",o),n.removeEventListener("abort",o)},r=()=>{t(),i()},o=()=>{s(n.error||new DOMException("AbortError","AbortError")),i()};n.addEventListener("complete",r),n.addEventListener("error",o),n.addEventListener("abort",o)});xl.set(n,e)}let Ol={get(n,e,t){if(n instanceof IDBTransaction){if(e==="done")return xl.get(n);if(e==="objectStoreNames")return n.objectStoreNames||Lp.get(n);if(e==="store")return t.objectStoreNames[1]?void 0:t.objectStore(t.objectStoreNames[0])}return In(n[e])},set(n,e,t){return n[e]=t,!0},has(n,e){return n instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in n}};function Pv(n){Ol=n(Ol)}function Nv(n){return n===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...t){const s=n.call(il(this),e,...t);return Lp.set(s,e.sort?e.sort():[e]),In(s)}:Sv().includes(n)?function(...e){return n.apply(il(this),e),In(Dp.get(this))}:function(...e){return In(n.apply(il(this),e))}}function Dv(n){return typeof n=="function"?Nv(n):(n instanceof IDBTransaction&&kv(n),bv(n,Rv())?new Proxy(n,Ol):n)}function In(n){if(n instanceof IDBRequest)return Av(n);if(sl.has(n))return sl.get(n);const e=Dv(n);return e!==n&&(sl.set(n,e),bc.set(e,n)),e}const il=n=>bc.get(n);function Lv(n,e,{blocked:t,upgrade:s,blocking:i,terminated:r}={}){const o=indexedDB.open(n,e),l=In(o);return s&&o.addEventListener("upgradeneeded",c=>{s(In(o.result),c.oldVersion,c.newVersion,In(o.transaction),c)}),t&&o.addEventListener("blocked",c=>t(c.oldVersion,c.newVersion,c)),l.then(c=>{r&&c.addEventListener("close",()=>r()),i&&c.addEventListener("versionchange",h=>i(h.oldVersion,h.newVersion,h))}).catch(()=>{}),l}const xv=["get","getKey","getAll","getAllKeys","count"],Ov=["put","add","delete","clear"],rl=new Map;function ud(n,e){if(!(n instanceof IDBDatabase&&!(e in n)&&typeof e=="string"))return;if(rl.get(e))return rl.get(e);const t=e.replace(/FromIndex$/,""),s=e!==t,i=Ov.includes(t);if(!(t in(s?IDBIndex:IDBObjectStore).prototype)||!(i||xv.includes(t)))return;const r=async function(o,...l){const c=this.transaction(o,i?"readwrite":"readonly");let h=c.store;return s&&(h=h.index(l.shift())),(await Promise.all([h[t](...l),i&&c.done]))[0]};return rl.set(e,r),r}Pv(n=>({...n,get:(e,t,s)=>ud(e,t)||n.get(e,t,s),has:(e,t)=>!!ud(e,t)||n.has(e,t)}));/**
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
 */class Mv{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(t=>{if(Vv(t)){const s=t.getImmediate();return`${s.library}/${s.version}`}else return null}).filter(t=>t).join(" ")}}function Vv(n){const e=n.getComponent();return(e==null?void 0:e.type)==="VERSION"}const Ml="@firebase/app",dd="0.10.13";/**
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
 */const nn=new oa("@firebase/app"),Fv="@firebase/app-compat",Bv="@firebase/analytics-compat",Uv="@firebase/analytics",qv="@firebase/app-check-compat",Wv="@firebase/app-check",$v="@firebase/auth",jv="@firebase/auth-compat",zv="@firebase/database",Gv="@firebase/data-connect",Hv="@firebase/database-compat",Kv="@firebase/functions",Qv="@firebase/functions-compat",Yv="@firebase/installations",Jv="@firebase/installations-compat",Xv="@firebase/messaging",Zv="@firebase/messaging-compat",eE="@firebase/performance",tE="@firebase/performance-compat",nE="@firebase/remote-config",sE="@firebase/remote-config-compat",iE="@firebase/storage",rE="@firebase/storage-compat",oE="@firebase/firestore",aE="@firebase/vertexai-preview",lE="@firebase/firestore-compat",cE="firebase",hE="10.14.1";/**
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
 */const Vl="[DEFAULT]",uE={[Ml]:"fire-core",[Fv]:"fire-core-compat",[Uv]:"fire-analytics",[Bv]:"fire-analytics-compat",[Wv]:"fire-app-check",[qv]:"fire-app-check-compat",[$v]:"fire-auth",[jv]:"fire-auth-compat",[zv]:"fire-rtdb",[Gv]:"fire-data-connect",[Hv]:"fire-rtdb-compat",[Kv]:"fire-fn",[Qv]:"fire-fn-compat",[Yv]:"fire-iid",[Jv]:"fire-iid-compat",[Xv]:"fire-fcm",[Zv]:"fire-fcm-compat",[eE]:"fire-perf",[tE]:"fire-perf-compat",[nE]:"fire-rc",[sE]:"fire-rc-compat",[iE]:"fire-gcs",[rE]:"fire-gcs-compat",[oE]:"fire-fst",[lE]:"fire-fst-compat",[aE]:"fire-vertex","fire-js":"fire-js",[cE]:"fire-js-all"};/**
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
 */const bo=new Map,dE=new Map,Fl=new Map;function fd(n,e){try{n.container.addComponent(e)}catch(t){nn.debug(`Component ${e.name} failed to register with FirebaseApp ${n.name}`,t)}}function Xn(n){const e=n.name;if(Fl.has(e))return nn.debug(`There were multiple attempts to register component ${e}.`),!1;Fl.set(e,n);for(const t of bo.values())fd(t,n);for(const t of dE.values())fd(t,n);return!0}function aa(n,e){const t=n.container.getProvider("heartbeat").getImmediate({optional:!0});return t&&t.triggerHeartbeat(),n.container.getProvider(e)}function Yt(n){return n.settings!==void 0}/**
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
 */const fE={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},Cn=new ur("app","Firebase",fE);/**
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
 */class pE{constructor(e,t,s){this._isDeleted=!1,this._options=Object.assign({},e),this._config=Object.assign({},t),this._name=t.name,this._automaticDataCollectionEnabled=t.automaticDataCollectionEnabled,this._container=s,this.container.addComponent(new Pn("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw Cn.create("app-deleted",{appName:this._name})}}/**
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
 */const as=hE;function xp(n,e={}){let t=n;typeof e!="object"&&(e={name:e});const s=Object.assign({name:Vl,automaticDataCollectionEnabled:!1},e),i=s.name;if(typeof i!="string"||!i)throw Cn.create("bad-app-name",{appName:String(i)});if(t||(t=Sp()),!t)throw Cn.create("no-options");const r=bo.get(i);if(r){if(Co(t,r.options)&&Co(s,r.config))return r;throw Cn.create("duplicate-app",{appName:i})}const o=new Ev(i);for(const c of Fl.values())o.addComponent(c);const l=new pE(t,s,o);return bo.set(i,l),l}function Rc(n=Vl){const e=bo.get(n);if(!e&&n===Vl&&Sp())return xp();if(!e)throw Cn.create("no-app",{appName:n});return e}function kt(n,e,t){var s;let i=(s=uE[n])!==null&&s!==void 0?s:n;t&&(i+=`-${t}`);const r=i.match(/\s|\//),o=e.match(/\s|\//);if(r||o){const l=[`Unable to register library "${i}" with version "${e}":`];r&&l.push(`library name "${i}" contains illegal characters (whitespace or "/")`),r&&o&&l.push("and"),o&&l.push(`version name "${e}" contains illegal characters (whitespace or "/")`),nn.warn(l.join(" "));return}Xn(new Pn(`${i}-version`,()=>({library:i,version:e}),"VERSION"))}/**
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
 */const mE="firebase-heartbeat-database",gE=1,Qi="firebase-heartbeat-store";let ol=null;function Op(){return ol||(ol=Lv(mE,gE,{upgrade:(n,e)=>{switch(e){case 0:try{n.createObjectStore(Qi)}catch(t){console.warn(t)}}}}).catch(n=>{throw Cn.create("idb-open",{originalErrorMessage:n.message})})),ol}async function _E(n){try{const t=(await Op()).transaction(Qi),s=await t.objectStore(Qi).get(Mp(n));return await t.done,s}catch(e){if(e instanceof ln)nn.warn(e.message);else{const t=Cn.create("idb-get",{originalErrorMessage:e==null?void 0:e.message});nn.warn(t.message)}}}async function pd(n,e){try{const s=(await Op()).transaction(Qi,"readwrite");await s.objectStore(Qi).put(e,Mp(n)),await s.done}catch(t){if(t instanceof ln)nn.warn(t.message);else{const s=Cn.create("idb-set",{originalErrorMessage:t==null?void 0:t.message});nn.warn(s.message)}}}function Mp(n){return`${n.name}!${n.options.appId}`}/**
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
 */const yE=1024,vE=30*24*60*60*1e3;class EE{constructor(e){this.container=e,this._heartbeatsCache=null;const t=this.container.getProvider("app").getImmediate();this._storage=new TE(t),this._heartbeatsCachePromise=this._storage.read().then(s=>(this._heartbeatsCache=s,s))}async triggerHeartbeat(){var e,t;try{const i=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),r=md();return((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((t=this._heartbeatsCache)===null||t===void 0?void 0:t.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===r||this._heartbeatsCache.heartbeats.some(o=>o.date===r)?void 0:(this._heartbeatsCache.heartbeats.push({date:r,agent:i}),this._heartbeatsCache.heartbeats=this._heartbeatsCache.heartbeats.filter(o=>{const l=new Date(o.date).valueOf();return Date.now()-l<=vE}),this._storage.overwrite(this._heartbeatsCache))}catch(s){nn.warn(s)}}async getHeartbeatsHeader(){var e;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const t=md(),{heartbeatsToSend:s,unsentEntries:i}=wE(this._heartbeatsCache.heartbeats),r=wo(JSON.stringify({version:2,heartbeats:s}));return this._heartbeatsCache.lastSentHeartbeatDate=t,i.length>0?(this._heartbeatsCache.heartbeats=i,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),r}catch(t){return nn.warn(t),""}}}function md(){return new Date().toISOString().substring(0,10)}function wE(n,e=yE){const t=[];let s=n.slice();for(const i of n){const r=t.find(o=>o.agent===i.agent);if(r){if(r.dates.push(i.date),gd(t)>e){r.dates.pop();break}}else if(t.push({agent:i.agent,dates:[i.date]}),gd(t)>e){t.pop();break}s=s.slice(1)}return{heartbeatsToSend:t,unsentEntries:s}}class TE{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return rv()?ov().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const t=await _E(this.app);return t!=null&&t.heartbeats?t:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){var t;if(await this._canUseIndexedDBPromise){const i=await this.read();return pd(this.app,{lastSentHeartbeatDate:(t=e.lastSentHeartbeatDate)!==null&&t!==void 0?t:i.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){var t;if(await this._canUseIndexedDBPromise){const i=await this.read();return pd(this.app,{lastSentHeartbeatDate:(t=e.lastSentHeartbeatDate)!==null&&t!==void 0?t:i.lastSentHeartbeatDate,heartbeats:[...i.heartbeats,...e.heartbeats]})}else return}}function gd(n){return wo(JSON.stringify({version:2,heartbeats:n})).length}/**
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
 */function IE(n){Xn(new Pn("platform-logger",e=>new Mv(e),"PRIVATE")),Xn(new Pn("heartbeat",e=>new EE(e),"PRIVATE")),kt(Ml,dd,n),kt(Ml,dd,"esm2017"),kt("fire-js","")}IE("");var CE="firebase",bE="10.14.1";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */kt(CE,bE,"app");function Sc(n,e){var t={};for(var s in n)Object.prototype.hasOwnProperty.call(n,s)&&e.indexOf(s)<0&&(t[s]=n[s]);if(n!=null&&typeof Object.getOwnPropertySymbols=="function")for(var i=0,s=Object.getOwnPropertySymbols(n);i<s.length;i++)e.indexOf(s[i])<0&&Object.prototype.propertyIsEnumerable.call(n,s[i])&&(t[s[i]]=n[s[i]]);return t}function Vp(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}const RE=Vp,Fp=new ur("auth","Firebase",Vp());/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ro=new oa("@firebase/auth");function SE(n,...e){Ro.logLevel<=te.WARN&&Ro.warn(`Auth (${as}): ${n}`,...e)}function ro(n,...e){Ro.logLevel<=te.ERROR&&Ro.error(`Auth (${as}): ${n}`,...e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Lt(n,...e){throw kc(n,...e)}function Rt(n,...e){return kc(n,...e)}function Ac(n,e,t){const s=Object.assign(Object.assign({},RE()),{[e]:t});return new ur("auth","Firebase",s).create(e,{appName:n.name})}function Qn(n){return Ac(n,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function AE(n,e,t){const s=t;if(!(e instanceof s))throw s.name!==e.constructor.name&&Lt(n,"argument-error"),Ac(n,"argument-error",`Type of ${e.constructor.name} does not match expected instance.Did you pass a reference from a different Auth SDK?`)}function kc(n,...e){if(typeof n!="string"){const t=e[0],s=[...e.slice(1)];return s[0]&&(s[0].appName=n.name),n._errorFactory.create(t,...s)}return Fp.create(n,...e)}function K(n,e,...t){if(!n)throw kc(e,...t)}function Jt(n){const e="INTERNAL ASSERTION FAILED: "+n;throw ro(e),new Error(e)}function sn(n,e){n||Jt(e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Bl(){var n;return typeof self<"u"&&((n=self.location)===null||n===void 0?void 0:n.href)||""}function kE(){return _d()==="http:"||_d()==="https:"}function _d(){var n;return typeof self<"u"&&((n=self.location)===null||n===void 0?void 0:n.protocol)||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function PE(){return typeof navigator<"u"&&navigator&&"onLine"in navigator&&typeof navigator.onLine=="boolean"&&(kE()||tv()||"connection"in navigator)?navigator.onLine:!0}function NE(){if(typeof navigator>"u")return null;const n=navigator;return n.languages&&n.languages[0]||n.language||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class dr{constructor(e,t){this.shortDelay=e,this.longDelay=t,sn(t>e,"Short delay should be less than long delay!"),this.isMobile=Cc()||Pp()}get(){return PE()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Pc(n,e){sn(n.emulator,"Emulator should always be set here");const{url:t}=n.emulator;return e?`${t}${e.startsWith("/")?e.slice(1):e}`:t}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Bp{static initialize(e,t,s){this.fetchImpl=e,t&&(this.headersImpl=t),s&&(this.responseImpl=s)}static fetch(){if(this.fetchImpl)return this.fetchImpl;if(typeof self<"u"&&"fetch"in self)return self.fetch;if(typeof globalThis<"u"&&globalThis.fetch)return globalThis.fetch;if(typeof fetch<"u")return fetch;Jt("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){if(this.headersImpl)return this.headersImpl;if(typeof self<"u"&&"Headers"in self)return self.Headers;if(typeof globalThis<"u"&&globalThis.Headers)return globalThis.Headers;if(typeof Headers<"u")return Headers;Jt("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){if(this.responseImpl)return this.responseImpl;if(typeof self<"u"&&"Response"in self)return self.Response;if(typeof globalThis<"u"&&globalThis.Response)return globalThis.Response;if(typeof Response<"u")return Response;Jt("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const DE={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const LE=new dr(3e4,6e4);function Nc(n,e){return n.tenantId&&!e.tenantId?Object.assign(Object.assign({},e),{tenantId:n.tenantId}):e}async function Xs(n,e,t,s,i={}){return Up(n,i,async()=>{let r={},o={};s&&(e==="GET"?o=s:r={body:JSON.stringify(s)});const l=Js(Object.assign({key:n.config.apiKey},o)).slice(1),c=await n._getAdditionalHeaders();c["Content-Type"]="application/json",n.languageCode&&(c["X-Firebase-Locale"]=n.languageCode);const h=Object.assign({method:e,headers:c},r);return ev()||(h.referrerPolicy="no-referrer"),Bp.fetch()(qp(n,n.config.apiHost,t,l),h)})}async function Up(n,e,t){n._canInitEmulator=!1;const s=Object.assign(Object.assign({},DE),e);try{const i=new OE(n),r=await Promise.race([t(),i.promise]);i.clearNetworkTimeout();const o=await r.json();if("needConfirmation"in o)throw Qr(n,"account-exists-with-different-credential",o);if(r.ok&&!("errorMessage"in o))return o;{const l=r.ok?o.errorMessage:o.error.message,[c,h]=l.split(" : ");if(c==="FEDERATED_USER_ID_ALREADY_LINKED")throw Qr(n,"credential-already-in-use",o);if(c==="EMAIL_EXISTS")throw Qr(n,"email-already-in-use",o);if(c==="USER_DISABLED")throw Qr(n,"user-disabled",o);const d=s[c]||c.toLowerCase().replace(/[_\s]+/g,"-");if(h)throw Ac(n,d,h);Lt(n,d)}}catch(i){if(i instanceof ln)throw i;Lt(n,"network-request-failed",{message:String(i)})}}async function xE(n,e,t,s,i={}){const r=await Xs(n,e,t,s,i);return"mfaPendingCredential"in r&&Lt(n,"multi-factor-auth-required",{_serverResponse:r}),r}function qp(n,e,t,s){const i=`${e}${t}?${s}`;return n.config.emulator?Pc(n.config,i):`${n.config.apiScheme}://${i}`}class OE{constructor(e){this.auth=e,this.timer=null,this.promise=new Promise((t,s)=>{this.timer=setTimeout(()=>s(Rt(this.auth,"network-request-failed")),LE.get())})}clearNetworkTimeout(){clearTimeout(this.timer)}}function Qr(n,e,t){const s={appName:n.name};t.email&&(s.email=t.email),t.phoneNumber&&(s.phoneNumber=t.phoneNumber);const i=Rt(n,e,s);return i.customData._tokenResponse=t,i}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function ME(n,e){return Xs(n,"POST","/v1/accounts:delete",e)}async function Wp(n,e){return Xs(n,"POST","/v1/accounts:lookup",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Mi(n){if(n)try{const e=new Date(Number(n));if(!isNaN(e.getTime()))return e.toUTCString()}catch{}}async function VE(n,e=!1){const t=ge(n),s=await t.getIdToken(e),i=Dc(s);K(i&&i.exp&&i.auth_time&&i.iat,t.auth,"internal-error");const r=typeof i.firebase=="object"?i.firebase:void 0,o=r==null?void 0:r.sign_in_provider;return{claims:i,token:s,authTime:Mi(al(i.auth_time)),issuedAtTime:Mi(al(i.iat)),expirationTime:Mi(al(i.exp)),signInProvider:o||null,signInSecondFactor:(r==null?void 0:r.sign_in_second_factor)||null}}function al(n){return Number(n)*1e3}function Dc(n){const[e,t,s]=n.split(".");if(e===void 0||t===void 0||s===void 0)return ro("JWT malformed, contained fewer than 3 sections"),null;try{const i=To(t);return i?JSON.parse(i):(ro("Failed to decode base64 JWT payload"),null)}catch(i){return ro("Caught error parsing JWT payload as JSON",i==null?void 0:i.toString()),null}}function yd(n){const e=Dc(n);return K(e,"internal-error"),K(typeof e.exp<"u","internal-error"),K(typeof e.iat<"u","internal-error"),Number(e.exp)-Number(e.iat)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Yi(n,e,t=!1){if(t)return e;try{return await e}catch(s){throw s instanceof ln&&FE(s)&&n.auth.currentUser===n&&await n.auth.signOut(),s}}function FE({code:n}){return n==="auth/user-disabled"||n==="auth/user-token-expired"}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class BE{constructor(e){this.user=e,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,this.timerId!==null&&clearTimeout(this.timerId))}getInterval(e){var t;if(e){const s=this.errorBackoff;return this.errorBackoff=Math.min(this.errorBackoff*2,96e4),s}else{this.errorBackoff=3e4;const i=((t=this.user.stsTokenManager.expirationTime)!==null&&t!==void 0?t:0)-Date.now()-3e5;return Math.max(0,i)}}schedule(e=!1){if(!this.isRunning)return;const t=this.getInterval(e);this.timerId=setTimeout(async()=>{await this.iteration()},t)}async iteration(){try{await this.user.getIdToken(!0)}catch(e){(e==null?void 0:e.code)==="auth/network-request-failed"&&this.schedule(!0);return}this.schedule()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ul{constructor(e,t){this.createdAt=e,this.lastLoginAt=t,this._initializeTime()}_initializeTime(){this.lastSignInTime=Mi(this.lastLoginAt),this.creationTime=Mi(this.createdAt)}_copy(e){this.createdAt=e.createdAt,this.lastLoginAt=e.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}}/**
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
 */async function So(n){var e;const t=n.auth,s=await n.getIdToken(),i=await Yi(n,Wp(t,{idToken:s}));K(i==null?void 0:i.users.length,t,"internal-error");const r=i.users[0];n._notifyReloadListener(r);const o=!((e=r.providerUserInfo)===null||e===void 0)&&e.length?$p(r.providerUserInfo):[],l=qE(n.providerData,o),c=n.isAnonymous,h=!(n.email&&r.passwordHash)&&!(l!=null&&l.length),d=c?h:!1,p={uid:r.localId,displayName:r.displayName||null,photoURL:r.photoUrl||null,email:r.email||null,emailVerified:r.emailVerified||!1,phoneNumber:r.phoneNumber||null,tenantId:r.tenantId||null,providerData:l,metadata:new Ul(r.createdAt,r.lastLoginAt),isAnonymous:d};Object.assign(n,p)}async function UE(n){const e=ge(n);await So(e),await e.auth._persistUserIfCurrent(e),e.auth._notifyListenersIfCurrent(e)}function qE(n,e){return[...n.filter(s=>!e.some(i=>i.providerId===s.providerId)),...e]}function $p(n){return n.map(e=>{var{providerId:t}=e,s=Sc(e,["providerId"]);return{providerId:t,uid:s.rawId||"",displayName:s.displayName||null,email:s.email||null,phoneNumber:s.phoneNumber||null,photoURL:s.photoUrl||null}})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function WE(n,e){const t=await Up(n,{},async()=>{const s=Js({grant_type:"refresh_token",refresh_token:e}).slice(1),{tokenApiHost:i,apiKey:r}=n.config,o=qp(n,i,"/v1/token",`key=${r}`),l=await n._getAdditionalHeaders();return l["Content-Type"]="application/x-www-form-urlencoded",Bp.fetch()(o,{method:"POST",headers:l,body:s})});return{accessToken:t.access_token,expiresIn:t.expires_in,refreshToken:t.refresh_token}}async function $E(n,e){return Xs(n,"POST","/v2/accounts:revokeToken",Nc(n,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ps{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(e){K(e.idToken,"internal-error"),K(typeof e.idToken<"u","internal-error"),K(typeof e.refreshToken<"u","internal-error");const t="expiresIn"in e&&typeof e.expiresIn<"u"?Number(e.expiresIn):yd(e.idToken);this.updateTokensAndExpiration(e.idToken,e.refreshToken,t)}updateFromIdToken(e){K(e.length!==0,"internal-error");const t=yd(e);this.updateTokensAndExpiration(e,null,t)}async getToken(e,t=!1){return!t&&this.accessToken&&!this.isExpired?this.accessToken:(K(this.refreshToken,e,"user-token-expired"),this.refreshToken?(await this.refresh(e,this.refreshToken),this.accessToken):null)}clearRefreshToken(){this.refreshToken=null}async refresh(e,t){const{accessToken:s,refreshToken:i,expiresIn:r}=await WE(e,t);this.updateTokensAndExpiration(s,i,Number(r))}updateTokensAndExpiration(e,t,s){this.refreshToken=t||null,this.accessToken=e||null,this.expirationTime=Date.now()+s*1e3}static fromJSON(e,t){const{refreshToken:s,accessToken:i,expirationTime:r}=t,o=new Ps;return s&&(K(typeof s=="string","internal-error",{appName:e}),o.refreshToken=s),i&&(K(typeof i=="string","internal-error",{appName:e}),o.accessToken=i),r&&(K(typeof r=="number","internal-error",{appName:e}),o.expirationTime=r),o}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(e){this.accessToken=e.accessToken,this.refreshToken=e.refreshToken,this.expirationTime=e.expirationTime}_clone(){return Object.assign(new Ps,this.toJSON())}_performRefresh(){return Jt("not implemented")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function mn(n,e){K(typeof n=="string"||typeof n>"u","internal-error",{appName:e})}class Xt{constructor(e){var{uid:t,auth:s,stsTokenManager:i}=e,r=Sc(e,["uid","auth","stsTokenManager"]);this.providerId="firebase",this.proactiveRefresh=new BE(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=t,this.auth=s,this.stsTokenManager=i,this.accessToken=i.accessToken,this.displayName=r.displayName||null,this.email=r.email||null,this.emailVerified=r.emailVerified||!1,this.phoneNumber=r.phoneNumber||null,this.photoURL=r.photoURL||null,this.isAnonymous=r.isAnonymous||!1,this.tenantId=r.tenantId||null,this.providerData=r.providerData?[...r.providerData]:[],this.metadata=new Ul(r.createdAt||void 0,r.lastLoginAt||void 0)}async getIdToken(e){const t=await Yi(this,this.stsTokenManager.getToken(this.auth,e));return K(t,this.auth,"internal-error"),this.accessToken!==t&&(this.accessToken=t,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),t}getIdTokenResult(e){return VE(this,e)}reload(){return UE(this)}_assign(e){this!==e&&(K(this.uid===e.uid,this.auth,"internal-error"),this.displayName=e.displayName,this.photoURL=e.photoURL,this.email=e.email,this.emailVerified=e.emailVerified,this.phoneNumber=e.phoneNumber,this.isAnonymous=e.isAnonymous,this.tenantId=e.tenantId,this.providerData=e.providerData.map(t=>Object.assign({},t)),this.metadata._copy(e.metadata),this.stsTokenManager._assign(e.stsTokenManager))}_clone(e){const t=new Xt(Object.assign(Object.assign({},this),{auth:e,stsTokenManager:this.stsTokenManager._clone()}));return t.metadata._copy(this.metadata),t}_onReload(e){K(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=e,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(e){this.reloadListener?this.reloadListener(e):this.reloadUserInfo=e}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(e,t=!1){let s=!1;e.idToken&&e.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(e),s=!0),t&&await So(this),await this.auth._persistUserIfCurrent(this),s&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(Yt(this.auth.app))return Promise.reject(Qn(this.auth));const e=await this.getIdToken();return await Yi(this,ME(this.auth,{idToken:e})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return Object.assign(Object.assign({uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(e=>Object.assign({},e)),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId},this.metadata.toJSON()),{apiKey:this.auth.config.apiKey,appName:this.auth.name})}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(e,t){var s,i,r,o,l,c,h,d;const p=(s=t.displayName)!==null&&s!==void 0?s:void 0,m=(i=t.email)!==null&&i!==void 0?i:void 0,E=(r=t.phoneNumber)!==null&&r!==void 0?r:void 0,C=(o=t.photoURL)!==null&&o!==void 0?o:void 0,S=(l=t.tenantId)!==null&&l!==void 0?l:void 0,k=(c=t._redirectEventId)!==null&&c!==void 0?c:void 0,F=(h=t.createdAt)!==null&&h!==void 0?h:void 0,U=(d=t.lastLoginAt)!==null&&d!==void 0?d:void 0,{uid:q,emailVerified:ee,isAnonymous:he,providerData:de,stsTokenManager:I}=t;K(q&&I,e,"internal-error");const _=Ps.fromJSON(this.name,I);K(typeof q=="string",e,"internal-error"),mn(p,e.name),mn(m,e.name),K(typeof ee=="boolean",e,"internal-error"),K(typeof he=="boolean",e,"internal-error"),mn(E,e.name),mn(C,e.name),mn(S,e.name),mn(k,e.name),mn(F,e.name),mn(U,e.name);const y=new Xt({uid:q,auth:e,email:m,emailVerified:ee,displayName:p,isAnonymous:he,photoURL:C,phoneNumber:E,tenantId:S,stsTokenManager:_,createdAt:F,lastLoginAt:U});return de&&Array.isArray(de)&&(y.providerData=de.map(w=>Object.assign({},w))),k&&(y._redirectEventId=k),y}static async _fromIdTokenResponse(e,t,s=!1){const i=new Ps;i.updateFromServerResponse(t);const r=new Xt({uid:t.localId,auth:e,stsTokenManager:i,isAnonymous:s});return await So(r),r}static async _fromGetAccountInfoResponse(e,t,s){const i=t.users[0];K(i.localId!==void 0,"internal-error");const r=i.providerUserInfo!==void 0?$p(i.providerUserInfo):[],o=!(i.email&&i.passwordHash)&&!(r!=null&&r.length),l=new Ps;l.updateFromIdToken(s);const c=new Xt({uid:i.localId,auth:e,stsTokenManager:l,isAnonymous:o}),h={uid:i.localId,displayName:i.displayName||null,photoURL:i.photoUrl||null,email:i.email||null,emailVerified:i.emailVerified||!1,phoneNumber:i.phoneNumber||null,tenantId:i.tenantId||null,providerData:r,metadata:new Ul(i.createdAt,i.lastLoginAt),isAnonymous:!(i.email&&i.passwordHash)&&!(r!=null&&r.length)};return Object.assign(c,h),c}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const vd=new Map;function Zt(n){sn(n instanceof Function,"Expected a class definition");let e=vd.get(n);return e?(sn(e instanceof n,"Instance stored in cache mismatched with class"),e):(e=new n,vd.set(n,e),e)}/**
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
 */class jp{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(e,t){this.storage[e]=t}async _get(e){const t=this.storage[e];return t===void 0?null:t}async _remove(e){delete this.storage[e]}_addListener(e,t){}_removeListener(e,t){}}jp.type="NONE";const Ed=jp;/**
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
 */function oo(n,e,t){return`firebase:${n}:${e}:${t}`}class Ns{constructor(e,t,s){this.persistence=e,this.auth=t,this.userKey=s;const{config:i,name:r}=this.auth;this.fullUserKey=oo(this.userKey,i.apiKey,r),this.fullPersistenceKey=oo("persistence",i.apiKey,r),this.boundEventHandler=t._onStorageEvent.bind(t),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(e){return this.persistence._set(this.fullUserKey,e.toJSON())}async getCurrentUser(){const e=await this.persistence._get(this.fullUserKey);return e?Xt._fromJSON(this.auth,e):null}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(e){if(this.persistence===e)return;const t=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=e,t)return this.setCurrentUser(t)}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(e,t,s="authUser"){if(!t.length)return new Ns(Zt(Ed),e,s);const i=(await Promise.all(t.map(async h=>{if(await h._isAvailable())return h}))).filter(h=>h);let r=i[0]||Zt(Ed);const o=oo(s,e.config.apiKey,e.name);let l=null;for(const h of t)try{const d=await h._get(o);if(d){const p=Xt._fromJSON(e,d);h!==r&&(l=p),r=h;break}}catch{}const c=i.filter(h=>h._shouldAllowMigration);return!r._shouldAllowMigration||!c.length?new Ns(r,e,s):(r=c[0],l&&await r._set(o,l.toJSON()),await Promise.all(t.map(async h=>{if(h!==r)try{await h._remove(o)}catch{}})),new Ns(r,e,s))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function wd(n){const e=n.toLowerCase();if(e.includes("opera/")||e.includes("opr/")||e.includes("opios/"))return"Opera";if(Kp(e))return"IEMobile";if(e.includes("msie")||e.includes("trident/"))return"IE";if(e.includes("edge/"))return"Edge";if(zp(e))return"Firefox";if(e.includes("silk/"))return"Silk";if(Yp(e))return"Blackberry";if(Jp(e))return"Webos";if(Gp(e))return"Safari";if((e.includes("chrome/")||Hp(e))&&!e.includes("edge/"))return"Chrome";if(Qp(e))return"Android";{const t=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,s=n.match(t);if((s==null?void 0:s.length)===2)return s[1]}return"Other"}function zp(n=et()){return/firefox\//i.test(n)}function Gp(n=et()){const e=n.toLowerCase();return e.includes("safari/")&&!e.includes("chrome/")&&!e.includes("crios/")&&!e.includes("android")}function Hp(n=et()){return/crios\//i.test(n)}function Kp(n=et()){return/iemobile/i.test(n)}function Qp(n=et()){return/android/i.test(n)}function Yp(n=et()){return/blackberry/i.test(n)}function Jp(n=et()){return/webos/i.test(n)}function Lc(n=et()){return/iphone|ipad|ipod/i.test(n)||/macintosh/i.test(n)&&/mobile/i.test(n)}function jE(n=et()){var e;return Lc(n)&&!!(!((e=window.navigator)===null||e===void 0)&&e.standalone)}function zE(){return nv()&&document.documentMode===10}function Xp(n=et()){return Lc(n)||Qp(n)||Jp(n)||Yp(n)||/windows phone/i.test(n)||Kp(n)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Zp(n,e=[]){let t;switch(n){case"Browser":t=wd(et());break;case"Worker":t=`${wd(et())}-${n}`;break;default:t=n}const s=e.length?e.join(","):"FirebaseCore-web";return`${t}/JsCore/${as}/${s}`}/**
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
 */class GE{constructor(e){this.auth=e,this.queue=[]}pushCallback(e,t){const s=r=>new Promise((o,l)=>{try{const c=e(r);o(c)}catch(c){l(c)}});s.onAbort=t,this.queue.push(s);const i=this.queue.length-1;return()=>{this.queue[i]=()=>Promise.resolve()}}async runMiddleware(e){if(this.auth.currentUser===e)return;const t=[];try{for(const s of this.queue)await s(e),s.onAbort&&t.push(s.onAbort)}catch(s){t.reverse();for(const i of t)try{i()}catch{}throw this.auth._errorFactory.create("login-blocked",{originalMessage:s==null?void 0:s.message})}}}/**
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
 */async function HE(n,e={}){return Xs(n,"GET","/v2/passwordPolicy",Nc(n,e))}/**
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
 */const KE=6;class QE{constructor(e){var t,s,i,r;const o=e.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=(t=o.minPasswordLength)!==null&&t!==void 0?t:KE,o.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=o.maxPasswordLength),o.containsLowercaseCharacter!==void 0&&(this.customStrengthOptions.containsLowercaseLetter=o.containsLowercaseCharacter),o.containsUppercaseCharacter!==void 0&&(this.customStrengthOptions.containsUppercaseLetter=o.containsUppercaseCharacter),o.containsNumericCharacter!==void 0&&(this.customStrengthOptions.containsNumericCharacter=o.containsNumericCharacter),o.containsNonAlphanumericCharacter!==void 0&&(this.customStrengthOptions.containsNonAlphanumericCharacter=o.containsNonAlphanumericCharacter),this.enforcementState=e.enforcementState,this.enforcementState==="ENFORCEMENT_STATE_UNSPECIFIED"&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=(i=(s=e.allowedNonAlphanumericCharacters)===null||s===void 0?void 0:s.join(""))!==null&&i!==void 0?i:"",this.forceUpgradeOnSignin=(r=e.forceUpgradeOnSignin)!==null&&r!==void 0?r:!1,this.schemaVersion=e.schemaVersion}validatePassword(e){var t,s,i,r,o,l;const c={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(e,c),this.validatePasswordCharacterOptions(e,c),c.isValid&&(c.isValid=(t=c.meetsMinPasswordLength)!==null&&t!==void 0?t:!0),c.isValid&&(c.isValid=(s=c.meetsMaxPasswordLength)!==null&&s!==void 0?s:!0),c.isValid&&(c.isValid=(i=c.containsLowercaseLetter)!==null&&i!==void 0?i:!0),c.isValid&&(c.isValid=(r=c.containsUppercaseLetter)!==null&&r!==void 0?r:!0),c.isValid&&(c.isValid=(o=c.containsNumericCharacter)!==null&&o!==void 0?o:!0),c.isValid&&(c.isValid=(l=c.containsNonAlphanumericCharacter)!==null&&l!==void 0?l:!0),c}validatePasswordLengthOptions(e,t){const s=this.customStrengthOptions.minPasswordLength,i=this.customStrengthOptions.maxPasswordLength;s&&(t.meetsMinPasswordLength=e.length>=s),i&&(t.meetsMaxPasswordLength=e.length<=i)}validatePasswordCharacterOptions(e,t){this.updatePasswordCharacterOptionsStatuses(t,!1,!1,!1,!1);let s;for(let i=0;i<e.length;i++)s=e.charAt(i),this.updatePasswordCharacterOptionsStatuses(t,s>="a"&&s<="z",s>="A"&&s<="Z",s>="0"&&s<="9",this.allowedNonAlphanumericCharacters.includes(s))}updatePasswordCharacterOptionsStatuses(e,t,s,i,r){this.customStrengthOptions.containsLowercaseLetter&&(e.containsLowercaseLetter||(e.containsLowercaseLetter=t)),this.customStrengthOptions.containsUppercaseLetter&&(e.containsUppercaseLetter||(e.containsUppercaseLetter=s)),this.customStrengthOptions.containsNumericCharacter&&(e.containsNumericCharacter||(e.containsNumericCharacter=i)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(e.containsNonAlphanumericCharacter||(e.containsNonAlphanumericCharacter=r))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class YE{constructor(e,t,s,i){this.app=e,this.heartbeatServiceProvider=t,this.appCheckServiceProvider=s,this.config=i,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new Td(this),this.idTokenSubscription=new Td(this),this.beforeStateQueue=new GE(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=Fp,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=e.name,this.clientVersion=i.sdkClientVersion}_initializeWithPersistence(e,t){return t&&(this._popupRedirectResolver=Zt(t)),this._initializationPromise=this.queue(async()=>{var s,i;if(!this._deleted&&(this.persistenceManager=await Ns.create(this,e),!this._deleted)){if(!((s=this._popupRedirectResolver)===null||s===void 0)&&s._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch{}await this.initializeCurrentUser(t),this.lastNotifiedUid=((i=this.currentUser)===null||i===void 0?void 0:i.uid)||null,!this._deleted&&(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;const e=await this.assertedPersistence.getCurrentUser();if(!(!this.currentUser&&!e)){if(this.currentUser&&e&&this.currentUser.uid===e.uid){this._currentUser._assign(e),await this.currentUser.getIdToken();return}await this._updateCurrentUser(e,!0)}}async initializeCurrentUserFromIdToken(e){try{const t=await Wp(this,{idToken:e}),s=await Xt._fromGetAccountInfoResponse(this,t,e);await this.directlySetCurrentUser(s)}catch(t){console.warn("FirebaseServerApp could not login user with provided authIdToken: ",t),await this.directlySetCurrentUser(null)}}async initializeCurrentUser(e){var t;if(Yt(this.app)){const o=this.app.settings.authIdToken;return o?new Promise(l=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(o).then(l,l))}):this.directlySetCurrentUser(null)}const s=await this.assertedPersistence.getCurrentUser();let i=s,r=!1;if(e&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();const o=(t=this.redirectUser)===null||t===void 0?void 0:t._redirectEventId,l=i==null?void 0:i._redirectEventId,c=await this.tryRedirectSignIn(e);(!o||o===l)&&(c!=null&&c.user)&&(i=c.user,r=!0)}if(!i)return this.directlySetCurrentUser(null);if(!i._redirectEventId){if(r)try{await this.beforeStateQueue.runMiddleware(i)}catch(o){i=s,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(o))}return i?this.reloadAndSetCurrentUserOrClear(i):this.directlySetCurrentUser(null)}return K(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===i._redirectEventId?this.directlySetCurrentUser(i):this.reloadAndSetCurrentUserOrClear(i)}async tryRedirectSignIn(e){let t=null;try{t=await this._popupRedirectResolver._completeRedirectFn(this,e,!0)}catch{await this._setRedirectUser(null)}return t}async reloadAndSetCurrentUserOrClear(e){try{await So(e)}catch(t){if((t==null?void 0:t.code)!=="auth/network-request-failed")return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)}useDeviceLanguage(){this.languageCode=NE()}async _delete(){this._deleted=!0}async updateCurrentUser(e){if(Yt(this.app))return Promise.reject(Qn(this));const t=e?ge(e):null;return t&&K(t.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(t&&t._clone(this))}async _updateCurrentUser(e,t=!1){if(!this._deleted)return e&&K(this.tenantId===e.tenantId,this,"tenant-id-mismatch"),t||await this.beforeStateQueue.runMiddleware(e),this.queue(async()=>{await this.directlySetCurrentUser(e),this.notifyAuthListeners()})}async signOut(){return Yt(this.app)?Promise.reject(Qn(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(e){return Yt(this.app)?Promise.reject(Qn(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(Zt(e))})}_getRecaptchaConfig(){return this.tenantId==null?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(e){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();const t=this._getPasswordPolicyInternal();return t.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):t.validatePassword(e)}_getPasswordPolicyInternal(){return this.tenantId===null?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){const e=await HE(this),t=new QE(e);this.tenantId===null?this._projectPasswordPolicy=t:this._tenantPasswordPolicies[this.tenantId]=t}_getPersistence(){return this.assertedPersistence.persistence.type}_updateErrorMap(e){this._errorFactory=new ur("auth","Firebase",e())}onAuthStateChanged(e,t,s){return this.registerStateListener(this.authStateSubscription,e,t,s)}beforeAuthStateChanged(e,t){return this.beforeStateQueue.pushCallback(e,t)}onIdTokenChanged(e,t,s){return this.registerStateListener(this.idTokenSubscription,e,t,s)}authStateReady(){return new Promise((e,t)=>{if(this.currentUser)e();else{const s=this.onAuthStateChanged(()=>{s(),e()},t)}})}async revokeAccessToken(e){if(this.currentUser){const t=await this.currentUser.getIdToken(),s={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:e,idToken:t};this.tenantId!=null&&(s.tenantId=this.tenantId),await $E(this,s)}}toJSON(){var e;return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:(e=this._currentUser)===null||e===void 0?void 0:e.toJSON()}}async _setRedirectUser(e,t){const s=await this.getOrInitRedirectPersistenceManager(t);return e===null?s.removeCurrentUser():s.setCurrentUser(e)}async getOrInitRedirectPersistenceManager(e){if(!this.redirectPersistenceManager){const t=e&&Zt(e)||this._popupRedirectResolver;K(t,this,"argument-error"),this.redirectPersistenceManager=await Ns.create(this,[Zt(t._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(e){var t,s;return this._isInitialized&&await this.queue(async()=>{}),((t=this._currentUser)===null||t===void 0?void 0:t._redirectEventId)===e?this._currentUser:((s=this.redirectUser)===null||s===void 0?void 0:s._redirectEventId)===e?this.redirectUser:null}async _persistUserIfCurrent(e){if(e===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(e))}_notifyListenersIfCurrent(e){e===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){var e,t;if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);const s=(t=(e=this.currentUser)===null||e===void 0?void 0:e.uid)!==null&&t!==void 0?t:null;this.lastNotifiedUid!==s&&(this.lastNotifiedUid=s,this.authStateSubscription.next(this.currentUser))}registerStateListener(e,t,s,i){if(this._deleted)return()=>{};const r=typeof t=="function"?t:t.next.bind(t);let o=!1;const l=this._isInitialized?Promise.resolve():this._initializationPromise;if(K(l,this,"internal-error"),l.then(()=>{o||r(this.currentUser)}),typeof t=="function"){const c=e.addObserver(t,s,i);return()=>{o=!0,c()}}else{const c=e.addObserver(t);return()=>{o=!0,c()}}}async directlySetCurrentUser(e){this.currentUser&&this.currentUser!==e&&this._currentUser._stopProactiveRefresh(),e&&this.isProactiveRefreshEnabled&&e._startProactiveRefresh(),this.currentUser=e,e?await this.assertedPersistence.setCurrentUser(e):await this.assertedPersistence.removeCurrentUser()}queue(e){return this.operations=this.operations.then(e,e),this.operations}get assertedPersistence(){return K(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(e){!e||this.frameworks.includes(e)||(this.frameworks.push(e),this.frameworks.sort(),this.clientVersion=Zp(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){var e;const t={"X-Client-Version":this.clientVersion};this.app.options.appId&&(t["X-Firebase-gmpid"]=this.app.options.appId);const s=await((e=this.heartbeatServiceProvider.getImmediate({optional:!0}))===null||e===void 0?void 0:e.getHeartbeatsHeader());s&&(t["X-Firebase-Client"]=s);const i=await this._getAppCheckToken();return i&&(t["X-Firebase-AppCheck"]=i),t}async _getAppCheckToken(){var e;const t=await((e=this.appCheckServiceProvider.getImmediate({optional:!0}))===null||e===void 0?void 0:e.getToken());return t!=null&&t.error&&SE(`Error while retrieving App Check token: ${t.error}`),t==null?void 0:t.token}}function la(n){return ge(n)}class Td{constructor(e){this.auth=e,this.observer=null,this.addObserver=fv(t=>this.observer=t)}get next(){return K(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let xc={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function JE(n){xc=n}function XE(n){return xc.loadJS(n)}function ZE(){return xc.gapiScript}function ew(n){return`__${n}${Math.floor(Math.random()*1e6)}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function tw(n,e){const t=aa(n,"auth");if(t.isInitialized()){const i=t.getImmediate(),r=t.getOptions();if(Co(r,e??{}))return i;Lt(i,"already-initialized")}return t.initialize({options:e})}function nw(n,e){const t=(e==null?void 0:e.persistence)||[],s=(Array.isArray(t)?t:[t]).map(Zt);e!=null&&e.errorMap&&n._updateErrorMap(e.errorMap),n._initializeWithPersistence(s,e==null?void 0:e.popupRedirectResolver)}function sw(n,e,t){const s=la(n);K(s._canInitEmulator,s,"emulator-config-failed"),K(/^https?:\/\//.test(e),s,"invalid-emulator-scheme");const i=!1,r=em(e),{host:o,port:l}=iw(e),c=l===null?"":`:${l}`;s.config.emulator={url:`${r}//${o}${c}/`},s.settings.appVerificationDisabledForTesting=!0,s.emulatorConfig=Object.freeze({host:o,port:l,protocol:r.replace(":",""),options:Object.freeze({disableWarnings:i})}),rw()}function em(n){const e=n.indexOf(":");return e<0?"":n.substr(0,e+1)}function iw(n){const e=em(n),t=/(\/\/)?([^?#/]+)/.exec(n.substr(e.length));if(!t)return{host:"",port:null};const s=t[2].split("@").pop()||"",i=/^(\[[^\]]+\])(:|$)/.exec(s);if(i){const r=i[1];return{host:r,port:Id(s.substr(r.length+1))}}else{const[r,o]=s.split(":");return{host:r,port:Id(o)}}}function Id(n){if(!n)return null;const e=Number(n);return isNaN(e)?null:e}function rw(){function n(){const e=document.createElement("p"),t=e.style;e.innerText="Running in emulator mode. Do not use with production credentials.",t.position="fixed",t.width="100%",t.backgroundColor="#ffffff",t.border=".1em solid #000000",t.color="#b50000",t.bottom="0px",t.left="0px",t.margin="0px",t.zIndex="10000",t.textAlign="center",e.classList.add("firebase-emulator-warning"),document.body.appendChild(e)}typeof console<"u"&&typeof console.info=="function"&&console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials."),typeof window<"u"&&typeof document<"u"&&(document.readyState==="loading"?window.addEventListener("DOMContentLoaded",n):n())}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tm{constructor(e,t){this.providerId=e,this.signInMethod=t}toJSON(){return Jt("not implemented")}_getIdTokenResponse(e){return Jt("not implemented")}_linkToIdToken(e,t){return Jt("not implemented")}_getReauthenticationResolver(e){return Jt("not implemented")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Ds(n,e){return xE(n,"POST","/v1/accounts:signInWithIdp",Nc(n,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ow="http://localhost";class Zn extends tm{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(e){const t=new Zn(e.providerId,e.signInMethod);return e.idToken||e.accessToken?(e.idToken&&(t.idToken=e.idToken),e.accessToken&&(t.accessToken=e.accessToken),e.nonce&&!e.pendingToken&&(t.nonce=e.nonce),e.pendingToken&&(t.pendingToken=e.pendingToken)):e.oauthToken&&e.oauthTokenSecret?(t.accessToken=e.oauthToken,t.secret=e.oauthTokenSecret):Lt("argument-error"),t}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(e){const t=typeof e=="string"?JSON.parse(e):e,{providerId:s,signInMethod:i}=t,r=Sc(t,["providerId","signInMethod"]);if(!s||!i)return null;const o=new Zn(s,i);return o.idToken=r.idToken||void 0,o.accessToken=r.accessToken||void 0,o.secret=r.secret,o.nonce=r.nonce,o.pendingToken=r.pendingToken||null,o}_getIdTokenResponse(e){const t=this.buildRequest();return Ds(e,t)}_linkToIdToken(e,t){const s=this.buildRequest();return s.idToken=t,Ds(e,s)}_getReauthenticationResolver(e){const t=this.buildRequest();return t.autoCreate=!1,Ds(e,t)}buildRequest(){const e={requestUri:ow,returnSecureToken:!0};if(this.pendingToken)e.pendingToken=this.pendingToken;else{const t={};this.idToken&&(t.id_token=this.idToken),this.accessToken&&(t.access_token=this.accessToken),this.secret&&(t.oauth_token_secret=this.secret),t.providerId=this.providerId,this.nonce&&!this.pendingToken&&(t.nonce=this.nonce),e.postBody=Js(t)}return e}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Oc{constructor(e){this.providerId=e,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(e){this.defaultLanguageCode=e}setCustomParameters(e){return this.customParameters=e,this}getCustomParameters(){return this.customParameters}}/**
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
 */class fr extends Oc{constructor(){super(...arguments),this.scopes=[]}addScope(e){return this.scopes.includes(e)||this.scopes.push(e),this}getScopes(){return[...this.scopes]}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _n extends fr{constructor(){super("facebook.com")}static credential(e){return Zn._fromParams({providerId:_n.PROVIDER_ID,signInMethod:_n.FACEBOOK_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return _n.credentialFromTaggedObject(e)}static credentialFromError(e){return _n.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return _n.credential(e.oauthAccessToken)}catch{return null}}}_n.FACEBOOK_SIGN_IN_METHOD="facebook.com";_n.PROVIDER_ID="facebook.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qt extends fr{constructor(){super("google.com"),this.addScope("profile")}static credential(e,t){return Zn._fromParams({providerId:Qt.PROVIDER_ID,signInMethod:Qt.GOOGLE_SIGN_IN_METHOD,idToken:e,accessToken:t})}static credentialFromResult(e){return Qt.credentialFromTaggedObject(e)}static credentialFromError(e){return Qt.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthIdToken:t,oauthAccessToken:s}=e;if(!t&&!s)return null;try{return Qt.credential(t,s)}catch{return null}}}Qt.GOOGLE_SIGN_IN_METHOD="google.com";Qt.PROVIDER_ID="google.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yn extends fr{constructor(){super("github.com")}static credential(e){return Zn._fromParams({providerId:yn.PROVIDER_ID,signInMethod:yn.GITHUB_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return yn.credentialFromTaggedObject(e)}static credentialFromError(e){return yn.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return yn.credential(e.oauthAccessToken)}catch{return null}}}yn.GITHUB_SIGN_IN_METHOD="github.com";yn.PROVIDER_ID="github.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vn extends fr{constructor(){super("twitter.com")}static credential(e,t){return Zn._fromParams({providerId:vn.PROVIDER_ID,signInMethod:vn.TWITTER_SIGN_IN_METHOD,oauthToken:e,oauthTokenSecret:t})}static credentialFromResult(e){return vn.credentialFromTaggedObject(e)}static credentialFromError(e){return vn.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthAccessToken:t,oauthTokenSecret:s}=e;if(!t||!s)return null;try{return vn.credential(t,s)}catch{return null}}}vn.TWITTER_SIGN_IN_METHOD="twitter.com";vn.PROVIDER_ID="twitter.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Vs{constructor(e){this.user=e.user,this.providerId=e.providerId,this._tokenResponse=e._tokenResponse,this.operationType=e.operationType}static async _fromIdTokenResponse(e,t,s,i=!1){const r=await Xt._fromIdTokenResponse(e,s,i),o=Cd(s);return new Vs({user:r,providerId:o,_tokenResponse:s,operationType:t})}static async _forOperation(e,t,s){await e._updateTokensIfNecessary(s,!0);const i=Cd(s);return new Vs({user:e,providerId:i,_tokenResponse:s,operationType:t})}}function Cd(n){return n.providerId?n.providerId:"phoneNumber"in n?"phone":null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ao extends ln{constructor(e,t,s,i){var r;super(t.code,t.message),this.operationType=s,this.user=i,Object.setPrototypeOf(this,Ao.prototype),this.customData={appName:e.name,tenantId:(r=e.tenantId)!==null&&r!==void 0?r:void 0,_serverResponse:t.customData._serverResponse,operationType:s}}static _fromErrorAndOperation(e,t,s,i){return new Ao(e,t,s,i)}}function nm(n,e,t,s){return(e==="reauthenticate"?t._getReauthenticationResolver(n):t._getIdTokenResponse(n)).catch(r=>{throw r.code==="auth/multi-factor-auth-required"?Ao._fromErrorAndOperation(n,r,e,s):r})}async function aw(n,e,t=!1){const s=await Yi(n,e._linkToIdToken(n.auth,await n.getIdToken()),t);return Vs._forOperation(n,"link",s)}/**
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
 */async function lw(n,e,t=!1){const{auth:s}=n;if(Yt(s.app))return Promise.reject(Qn(s));const i="reauthenticate";try{const r=await Yi(n,nm(s,i,e,n),t);K(r.idToken,s,"internal-error");const o=Dc(r.idToken);K(o,s,"internal-error");const{sub:l}=o;return K(n.uid===l,s,"user-mismatch"),Vs._forOperation(n,i,r)}catch(r){throw(r==null?void 0:r.code)==="auth/user-not-found"&&Lt(s,"user-mismatch"),r}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function cw(n,e,t=!1){if(Yt(n.app))return Promise.reject(Qn(n));const s="signIn",i=await nm(n,s,e),r=await Vs._fromIdTokenResponse(n,s,i);return t||await n._updateCurrentUser(r.user),r}function hw(n,e,t,s){return ge(n).onIdTokenChanged(e,t,s)}function uw(n,e,t){return ge(n).beforeAuthStateChanged(e,t)}function dw(n,e,t,s){return ge(n).onAuthStateChanged(e,t,s)}function fw(n){return ge(n).signOut()}const ko="__sak";/**
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
 */class sm{constructor(e,t){this.storageRetriever=e,this.type=t}_isAvailable(){try{return this.storage?(this.storage.setItem(ko,"1"),this.storage.removeItem(ko),Promise.resolve(!0)):Promise.resolve(!1)}catch{return Promise.resolve(!1)}}_set(e,t){return this.storage.setItem(e,JSON.stringify(t)),Promise.resolve()}_get(e){const t=this.storage.getItem(e);return Promise.resolve(t?JSON.parse(t):null)}_remove(e){return this.storage.removeItem(e),Promise.resolve()}get storage(){return this.storageRetriever()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const pw=1e3,mw=10;class im extends sm{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(e,t)=>this.onStorageEvent(e,t),this.listeners={},this.localCache={},this.pollTimer=null,this.fallbackToPolling=Xp(),this._shouldAllowMigration=!0}forAllChangedKeys(e){for(const t of Object.keys(this.listeners)){const s=this.storage.getItem(t),i=this.localCache[t];s!==i&&e(t,i,s)}}onStorageEvent(e,t=!1){if(!e.key){this.forAllChangedKeys((o,l,c)=>{this.notifyListeners(o,c)});return}const s=e.key;t?this.detachListener():this.stopPolling();const i=()=>{const o=this.storage.getItem(s);!t&&this.localCache[s]===o||this.notifyListeners(s,o)},r=this.storage.getItem(s);zE()&&r!==e.newValue&&e.newValue!==e.oldValue?setTimeout(i,mw):i()}notifyListeners(e,t){this.localCache[e]=t;const s=this.listeners[e];if(s)for(const i of Array.from(s))i(t&&JSON.parse(t))}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((e,t,s)=>{this.onStorageEvent(new StorageEvent("storage",{key:e,oldValue:t,newValue:s}),!0)})},pw)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(e,t){Object.keys(this.listeners).length===0&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[e]||(this.listeners[e]=new Set,this.localCache[e]=this.storage.getItem(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.detachListener(),this.stopPolling())}async _set(e,t){await super._set(e,t),this.localCache[e]=JSON.stringify(t)}async _get(e){const t=await super._get(e);return this.localCache[e]=JSON.stringify(t),t}async _remove(e){await super._remove(e),delete this.localCache[e]}}im.type="LOCAL";const gw=im;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rm extends sm{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(e,t){}_removeListener(e,t){}}rm.type="SESSION";const om=rm;/**
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
 */function _w(n){return Promise.all(n.map(async e=>{try{return{fulfilled:!0,value:await e}}catch(t){return{fulfilled:!1,reason:t}}}))}/**
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
 */class ca{constructor(e){this.eventTarget=e,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(e){const t=this.receivers.find(i=>i.isListeningto(e));if(t)return t;const s=new ca(e);return this.receivers.push(s),s}isListeningto(e){return this.eventTarget===e}async handleEvent(e){const t=e,{eventId:s,eventType:i,data:r}=t.data,o=this.handlersMap[i];if(!(o!=null&&o.size))return;t.ports[0].postMessage({status:"ack",eventId:s,eventType:i});const l=Array.from(o).map(async h=>h(t.origin,r)),c=await _w(l);t.ports[0].postMessage({status:"done",eventId:s,eventType:i,response:c})}_subscribe(e,t){Object.keys(this.handlersMap).length===0&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[e]||(this.handlersMap[e]=new Set),this.handlersMap[e].add(t)}_unsubscribe(e,t){this.handlersMap[e]&&t&&this.handlersMap[e].delete(t),(!t||this.handlersMap[e].size===0)&&delete this.handlersMap[e],Object.keys(this.handlersMap).length===0&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}}ca.receivers=[];/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Mc(n="",e=10){let t="";for(let s=0;s<e;s++)t+=Math.floor(Math.random()*10);return n+t}/**
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
 */class yw{constructor(e){this.target=e,this.handlers=new Set}removeMessageHandler(e){e.messageChannel&&(e.messageChannel.port1.removeEventListener("message",e.onMessage),e.messageChannel.port1.close()),this.handlers.delete(e)}async _send(e,t,s=50){const i=typeof MessageChannel<"u"?new MessageChannel:null;if(!i)throw new Error("connection_unavailable");let r,o;return new Promise((l,c)=>{const h=Mc("",20);i.port1.start();const d=setTimeout(()=>{c(new Error("unsupported_event"))},s);o={messageChannel:i,onMessage(p){const m=p;if(m.data.eventId===h)switch(m.data.status){case"ack":clearTimeout(d),r=setTimeout(()=>{c(new Error("timeout"))},3e3);break;case"done":clearTimeout(r),l(m.data.response);break;default:clearTimeout(d),clearTimeout(r),c(new Error("invalid_response"));break}}},this.handlers.add(o),i.port1.addEventListener("message",o.onMessage),this.target.postMessage({eventType:e,eventId:h,data:t},[i.port2])}).finally(()=>{o&&this.removeMessageHandler(o)})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Pt(){return window}function vw(n){Pt().location.href=n}/**
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
 */function am(){return typeof Pt().WorkerGlobalScope<"u"&&typeof Pt().importScripts=="function"}async function Ew(){if(!(navigator!=null&&navigator.serviceWorker))return null;try{return(await navigator.serviceWorker.ready).active}catch{return null}}function ww(){var n;return((n=navigator==null?void 0:navigator.serviceWorker)===null||n===void 0?void 0:n.controller)||null}function Tw(){return am()?self:null}/**
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
 */const lm="firebaseLocalStorageDb",Iw=1,Po="firebaseLocalStorage",cm="fbase_key";class pr{constructor(e){this.request=e}toPromise(){return new Promise((e,t)=>{this.request.addEventListener("success",()=>{e(this.request.result)}),this.request.addEventListener("error",()=>{t(this.request.error)})})}}function ha(n,e){return n.transaction([Po],e?"readwrite":"readonly").objectStore(Po)}function Cw(){const n=indexedDB.deleteDatabase(lm);return new pr(n).toPromise()}function ql(){const n=indexedDB.open(lm,Iw);return new Promise((e,t)=>{n.addEventListener("error",()=>{t(n.error)}),n.addEventListener("upgradeneeded",()=>{const s=n.result;try{s.createObjectStore(Po,{keyPath:cm})}catch(i){t(i)}}),n.addEventListener("success",async()=>{const s=n.result;s.objectStoreNames.contains(Po)?e(s):(s.close(),await Cw(),e(await ql()))})})}async function bd(n,e,t){const s=ha(n,!0).put({[cm]:e,value:t});return new pr(s).toPromise()}async function bw(n,e){const t=ha(n,!1).get(e),s=await new pr(t).toPromise();return s===void 0?null:s.value}function Rd(n,e){const t=ha(n,!0).delete(e);return new pr(t).toPromise()}const Rw=800,Sw=3;class hm{constructor(){this.type="LOCAL",this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){return this.db?this.db:(this.db=await ql(),this.db)}async _withRetries(e){let t=0;for(;;)try{const s=await this._openDb();return await e(s)}catch(s){if(t++>Sw)throw s;this.db&&(this.db.close(),this.db=void 0)}}async initializeServiceWorkerMessaging(){return am()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=ca._getInstance(Tw()),this.receiver._subscribe("keyChanged",async(e,t)=>({keyProcessed:(await this._poll()).includes(t.key)})),this.receiver._subscribe("ping",async(e,t)=>["keyChanged"])}async initializeSender(){var e,t;if(this.activeServiceWorker=await Ew(),!this.activeServiceWorker)return;this.sender=new yw(this.activeServiceWorker);const s=await this.sender._send("ping",{},800);s&&!((e=s[0])===null||e===void 0)&&e.fulfilled&&!((t=s[0])===null||t===void 0)&&t.value.includes("keyChanged")&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(e){if(!(!this.sender||!this.activeServiceWorker||ww()!==this.activeServiceWorker))try{await this.sender._send("keyChanged",{key:e},this.serviceWorkerReceiverAvailable?800:50)}catch{}}async _isAvailable(){try{if(!indexedDB)return!1;const e=await ql();return await bd(e,ko,"1"),await Rd(e,ko),!0}catch{}return!1}async _withPendingWrite(e){this.pendingWrites++;try{await e()}finally{this.pendingWrites--}}async _set(e,t){return this._withPendingWrite(async()=>(await this._withRetries(s=>bd(s,e,t)),this.localCache[e]=t,this.notifyServiceWorker(e)))}async _get(e){const t=await this._withRetries(s=>bw(s,e));return this.localCache[e]=t,t}async _remove(e){return this._withPendingWrite(async()=>(await this._withRetries(t=>Rd(t,e)),delete this.localCache[e],this.notifyServiceWorker(e)))}async _poll(){const e=await this._withRetries(i=>{const r=ha(i,!1).getAll();return new pr(r).toPromise()});if(!e)return[];if(this.pendingWrites!==0)return[];const t=[],s=new Set;if(e.length!==0)for(const{fbase_key:i,value:r}of e)s.add(i),JSON.stringify(this.localCache[i])!==JSON.stringify(r)&&(this.notifyListeners(i,r),t.push(i));for(const i of Object.keys(this.localCache))this.localCache[i]&&!s.has(i)&&(this.notifyListeners(i,null),t.push(i));return t}notifyListeners(e,t){this.localCache[e]=t;const s=this.listeners[e];if(s)for(const i of Array.from(s))i(t)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),Rw)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(e,t){Object.keys(this.listeners).length===0&&this.startPolling(),this.listeners[e]||(this.listeners[e]=new Set,this._get(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&this.stopPolling()}}hm.type="LOCAL";const Aw=hm;new dr(3e4,6e4);/**
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
 */function um(n,e){return e?Zt(e):(K(n._popupRedirectResolver,n,"argument-error"),n._popupRedirectResolver)}/**
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
 */class Vc extends tm{constructor(e){super("custom","custom"),this.params=e}_getIdTokenResponse(e){return Ds(e,this._buildIdpRequest())}_linkToIdToken(e,t){return Ds(e,this._buildIdpRequest(t))}_getReauthenticationResolver(e){return Ds(e,this._buildIdpRequest())}_buildIdpRequest(e){const t={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return e&&(t.idToken=e),t}}function kw(n){return cw(n.auth,new Vc(n),n.bypassAuthState)}function Pw(n){const{auth:e,user:t}=n;return K(t,e,"internal-error"),lw(t,new Vc(n),n.bypassAuthState)}async function Nw(n){const{auth:e,user:t}=n;return K(t,e,"internal-error"),aw(t,new Vc(n),n.bypassAuthState)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class dm{constructor(e,t,s,i,r=!1){this.auth=e,this.resolver=s,this.user=i,this.bypassAuthState=r,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(t)?t:[t]}execute(){return new Promise(async(e,t)=>{this.pendingPromise={resolve:e,reject:t};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(s){this.reject(s)}})}async onAuthEvent(e){const{urlResponse:t,sessionId:s,postBody:i,tenantId:r,error:o,type:l}=e;if(o){this.reject(o);return}const c={auth:this.auth,requestUri:t,sessionId:s,tenantId:r||void 0,postBody:i||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(l)(c))}catch(h){this.reject(h)}}onError(e){this.reject(e)}getIdpTask(e){switch(e){case"signInViaPopup":case"signInViaRedirect":return kw;case"linkViaPopup":case"linkViaRedirect":return Nw;case"reauthViaPopup":case"reauthViaRedirect":return Pw;default:Lt(this.auth,"internal-error")}}resolve(e){sn(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(e),this.unregisterAndCleanUp()}reject(e){sn(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(e),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Dw=new dr(2e3,1e4);async function Lw(n,e,t){if(Yt(n.app))return Promise.reject(Rt(n,"operation-not-supported-in-this-environment"));const s=la(n);AE(n,e,Oc);const i=um(s,t);return new Gn(s,"signInViaPopup",e,i).executeNotNull()}class Gn extends dm{constructor(e,t,s,i,r){super(e,t,i,r),this.provider=s,this.authWindow=null,this.pollId=null,Gn.currentPopupAction&&Gn.currentPopupAction.cancel(),Gn.currentPopupAction=this}async executeNotNull(){const e=await this.execute();return K(e,this.auth,"internal-error"),e}async onExecution(){sn(this.filter.length===1,"Popup operations only handle one event");const e=Mc();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],e),this.authWindow.associatedEvent=e,this.resolver._originValidation(this.auth).catch(t=>{this.reject(t)}),this.resolver._isIframeWebStorageSupported(this.auth,t=>{t||this.reject(Rt(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){var e;return((e=this.authWindow)===null||e===void 0?void 0:e.associatedEvent)||null}cancel(){this.reject(Rt(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,Gn.currentPopupAction=null}pollUserCancellation(){const e=()=>{var t,s;if(!((s=(t=this.authWindow)===null||t===void 0?void 0:t.window)===null||s===void 0)&&s.closed){this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(Rt(this.auth,"popup-closed-by-user"))},8e3);return}this.pollId=window.setTimeout(e,Dw.get())};e()}}Gn.currentPopupAction=null;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const xw="pendingRedirect",ao=new Map;class Ow extends dm{constructor(e,t,s=!1){super(e,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],t,void 0,s),this.eventId=null}async execute(){let e=ao.get(this.auth._key());if(!e){try{const s=await Mw(this.resolver,this.auth)?await super.execute():null;e=()=>Promise.resolve(s)}catch(t){e=()=>Promise.reject(t)}ao.set(this.auth._key(),e)}return this.bypassAuthState||ao.set(this.auth._key(),()=>Promise.resolve(null)),e()}async onAuthEvent(e){if(e.type==="signInViaRedirect")return super.onAuthEvent(e);if(e.type==="unknown"){this.resolve(null);return}if(e.eventId){const t=await this.auth._redirectUserForId(e.eventId);if(t)return this.user=t,super.onAuthEvent(e);this.resolve(null)}}async onExecution(){}cleanUp(){}}async function Mw(n,e){const t=Bw(e),s=Fw(n);if(!await s._isAvailable())return!1;const i=await s._get(t)==="true";return await s._remove(t),i}function Vw(n,e){ao.set(n._key(),e)}function Fw(n){return Zt(n._redirectPersistence)}function Bw(n){return oo(xw,n.config.apiKey,n.name)}async function Uw(n,e,t=!1){if(Yt(n.app))return Promise.reject(Qn(n));const s=la(n),i=um(s,e),o=await new Ow(s,i,t).execute();return o&&!t&&(delete o.user._redirectEventId,await s._persistUserIfCurrent(o.user),await s._setRedirectUser(null,e)),o}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const qw=10*60*1e3;class Ww{constructor(e){this.auth=e,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(e){this.consumers.add(e),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,e)&&(this.sendToConsumer(this.queuedRedirectEvent,e),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(e){this.consumers.delete(e)}onEvent(e){if(this.hasEventBeenHandled(e))return!1;let t=!1;return this.consumers.forEach(s=>{this.isEventForConsumer(e,s)&&(t=!0,this.sendToConsumer(e,s),this.saveEventToCache(e))}),this.hasHandledPotentialRedirect||!$w(e)||(this.hasHandledPotentialRedirect=!0,t||(this.queuedRedirectEvent=e,t=!0)),t}sendToConsumer(e,t){var s;if(e.error&&!fm(e)){const i=((s=e.error.code)===null||s===void 0?void 0:s.split("auth/")[1])||"internal-error";t.onError(Rt(this.auth,i))}else t.onAuthEvent(e)}isEventForConsumer(e,t){const s=t.eventId===null||!!e.eventId&&e.eventId===t.eventId;return t.filter.includes(e.type)&&s}hasEventBeenHandled(e){return Date.now()-this.lastProcessedEventTime>=qw&&this.cachedEventUids.clear(),this.cachedEventUids.has(Sd(e))}saveEventToCache(e){this.cachedEventUids.add(Sd(e)),this.lastProcessedEventTime=Date.now()}}function Sd(n){return[n.type,n.eventId,n.sessionId,n.tenantId].filter(e=>e).join("-")}function fm({type:n,error:e}){return n==="unknown"&&(e==null?void 0:e.code)==="auth/no-auth-event"}function $w(n){switch(n.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return fm(n);default:return!1}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function jw(n,e={}){return Xs(n,"GET","/v1/projects",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const zw=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,Gw=/^https?/;async function Hw(n){if(n.config.emulator)return;const{authorizedDomains:e}=await jw(n);for(const t of e)try{if(Kw(t))return}catch{}Lt(n,"unauthorized-domain")}function Kw(n){const e=Bl(),{protocol:t,hostname:s}=new URL(e);if(n.startsWith("chrome-extension://")){const o=new URL(n);return o.hostname===""&&s===""?t==="chrome-extension:"&&n.replace("chrome-extension://","")===e.replace("chrome-extension://",""):t==="chrome-extension:"&&o.hostname===s}if(!Gw.test(t))return!1;if(zw.test(n))return s===n;const i=n.replace(/\./g,"\\.");return new RegExp("^(.+\\."+i+"|"+i+")$","i").test(s)}/**
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
 */const Qw=new dr(3e4,6e4);function Ad(){const n=Pt().___jsl;if(n!=null&&n.H){for(const e of Object.keys(n.H))if(n.H[e].r=n.H[e].r||[],n.H[e].L=n.H[e].L||[],n.H[e].r=[...n.H[e].L],n.CP)for(let t=0;t<n.CP.length;t++)n.CP[t]=null}}function Yw(n){return new Promise((e,t)=>{var s,i,r;function o(){Ad(),gapi.load("gapi.iframes",{callback:()=>{e(gapi.iframes.getContext())},ontimeout:()=>{Ad(),t(Rt(n,"network-request-failed"))},timeout:Qw.get()})}if(!((i=(s=Pt().gapi)===null||s===void 0?void 0:s.iframes)===null||i===void 0)&&i.Iframe)e(gapi.iframes.getContext());else if(!((r=Pt().gapi)===null||r===void 0)&&r.load)o();else{const l=ew("iframefcb");return Pt()[l]=()=>{gapi.load?o():t(Rt(n,"network-request-failed"))},XE(`${ZE()}?onload=${l}`).catch(c=>t(c))}}).catch(e=>{throw lo=null,e})}let lo=null;function Jw(n){return lo=lo||Yw(n),lo}/**
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
 */const Xw=new dr(5e3,15e3),Zw="__/auth/iframe",eT="emulator/auth/iframe",tT={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},nT=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function sT(n){const e=n.config;K(e.authDomain,n,"auth-domain-config-required");const t=e.emulator?Pc(e,eT):`https://${n.config.authDomain}/${Zw}`,s={apiKey:e.apiKey,appName:n.name,v:as},i=nT.get(n.config.apiHost);i&&(s.eid=i);const r=n._getFrameworks();return r.length&&(s.fw=r.join(",")),`${t}?${Js(s).slice(1)}`}async function iT(n){const e=await Jw(n),t=Pt().gapi;return K(t,n,"internal-error"),e.open({where:document.body,url:sT(n),messageHandlersFilter:t.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:tT,dontclear:!0},s=>new Promise(async(i,r)=>{await s.restyle({setHideOnLeave:!1});const o=Rt(n,"network-request-failed"),l=Pt().setTimeout(()=>{r(o)},Xw.get());function c(){Pt().clearTimeout(l),i(s)}s.ping(c).then(c,()=>{r(o)})}))}/**
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
 */const rT={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"},oT=500,aT=600,lT="_blank",cT="http://localhost";class kd{constructor(e){this.window=e,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch{}}}function hT(n,e,t,s=oT,i=aT){const r=Math.max((window.screen.availHeight-i)/2,0).toString(),o=Math.max((window.screen.availWidth-s)/2,0).toString();let l="";const c=Object.assign(Object.assign({},rT),{width:s.toString(),height:i.toString(),top:r,left:o}),h=et().toLowerCase();t&&(l=Hp(h)?lT:t),zp(h)&&(e=e||cT,c.scrollbars="yes");const d=Object.entries(c).reduce((m,[E,C])=>`${m}${E}=${C},`,"");if(jE(h)&&l!=="_self")return uT(e||"",l),new kd(null);const p=window.open(e||"",l,d);K(p,n,"popup-blocked");try{p.focus()}catch{}return new kd(p)}function uT(n,e){const t=document.createElement("a");t.href=n,t.target=e;const s=document.createEvent("MouseEvent");s.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),t.dispatchEvent(s)}/**
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
 */const dT="__/auth/handler",fT="emulator/auth/handler",pT=encodeURIComponent("fac");async function Pd(n,e,t,s,i,r){K(n.config.authDomain,n,"auth-domain-config-required"),K(n.config.apiKey,n,"invalid-api-key");const o={apiKey:n.config.apiKey,appName:n.name,authType:t,redirectUrl:s,v:as,eventId:i};if(e instanceof Oc){e.setDefaultLanguage(n.languageCode),o.providerId=e.providerId||"",Ll(e.getCustomParameters())||(o.customParameters=JSON.stringify(e.getCustomParameters()));for(const[d,p]of Object.entries({}))o[d]=p}if(e instanceof fr){const d=e.getScopes().filter(p=>p!=="");d.length>0&&(o.scopes=d.join(","))}n.tenantId&&(o.tid=n.tenantId);const l=o;for(const d of Object.keys(l))l[d]===void 0&&delete l[d];const c=await n._getAppCheckToken(),h=c?`#${pT}=${encodeURIComponent(c)}`:"";return`${mT(n)}?${Js(l).slice(1)}${h}`}function mT({config:n}){return n.emulator?Pc(n,fT):`https://${n.authDomain}/${dT}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ll="webStorageSupport";class gT{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=om,this._completeRedirectFn=Uw,this._overrideRedirectResult=Vw}async _openPopup(e,t,s,i){var r;sn((r=this.eventManagers[e._key()])===null||r===void 0?void 0:r.manager,"_initialize() not called before _openPopup()");const o=await Pd(e,t,s,Bl(),i);return hT(e,o,Mc())}async _openRedirect(e,t,s,i){await this._originValidation(e);const r=await Pd(e,t,s,Bl(),i);return vw(r),new Promise(()=>{})}_initialize(e){const t=e._key();if(this.eventManagers[t]){const{manager:i,promise:r}=this.eventManagers[t];return i?Promise.resolve(i):(sn(r,"If manager is not set, promise should be"),r)}const s=this.initAndGetManager(e);return this.eventManagers[t]={promise:s},s.catch(()=>{delete this.eventManagers[t]}),s}async initAndGetManager(e){const t=await iT(e),s=new Ww(e);return t.register("authEvent",i=>(K(i==null?void 0:i.authEvent,e,"invalid-auth-event"),{status:s.onEvent(i.authEvent)?"ACK":"ERROR"}),gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[e._key()]={manager:s},this.iframes[e._key()]=t,s}_isIframeWebStorageSupported(e,t){this.iframes[e._key()].send(ll,{type:ll},i=>{var r;const o=(r=i==null?void 0:i[0])===null||r===void 0?void 0:r[ll];o!==void 0&&t(!!o),Lt(e,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(e){const t=e._key();return this.originValidationPromises[t]||(this.originValidationPromises[t]=Hw(e)),this.originValidationPromises[t]}get _shouldInitProactively(){return Xp()||Gp()||Lc()}}const _T=gT;var Nd="@firebase/auth",Dd="1.7.9";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yT{constructor(e){this.auth=e,this.internalListeners=new Map}getUid(){var e;return this.assertAuthConfigured(),((e=this.auth.currentUser)===null||e===void 0?void 0:e.uid)||null}async getToken(e){return this.assertAuthConfigured(),await this.auth._initializationPromise,this.auth.currentUser?{accessToken:await this.auth.currentUser.getIdToken(e)}:null}addAuthTokenListener(e){if(this.assertAuthConfigured(),this.internalListeners.has(e))return;const t=this.auth.onIdTokenChanged(s=>{e((s==null?void 0:s.stsTokenManager.accessToken)||null)});this.internalListeners.set(e,t),this.updateProactiveRefresh()}removeAuthTokenListener(e){this.assertAuthConfigured();const t=this.internalListeners.get(e);t&&(this.internalListeners.delete(e),t(),this.updateProactiveRefresh())}assertAuthConfigured(){K(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function vT(n){switch(n){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}function ET(n){Xn(new Pn("auth",(e,{options:t})=>{const s=e.getProvider("app").getImmediate(),i=e.getProvider("heartbeat"),r=e.getProvider("app-check-internal"),{apiKey:o,authDomain:l}=s.options;K(o&&!o.includes(":"),"invalid-api-key",{appName:s.name});const c={apiKey:o,authDomain:l,clientPlatform:n,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:Zp(n)},h=new YE(s,i,r,c);return nw(h,t),h},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,t,s)=>{e.getProvider("auth-internal").initialize()})),Xn(new Pn("auth-internal",e=>{const t=la(e.getProvider("auth").getImmediate());return(s=>new yT(s))(t)},"PRIVATE").setInstantiationMode("EXPLICIT")),kt(Nd,Dd,vT(n)),kt(Nd,Dd,"esm2017")}/**
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
 */const wT=5*60,TT=Ap("authIdTokenMaxAge")||wT;let Ld=null;const IT=n=>async e=>{const t=e&&await e.getIdTokenResult(),s=t&&(new Date().getTime()-Date.parse(t.issuedAtTime))/1e3;if(s&&s>TT)return;const i=t==null?void 0:t.token;Ld!==i&&(Ld=i,await fetch(n,{method:i?"POST":"DELETE",headers:i?{Authorization:`Bearer ${i}`}:{}}))};function CT(n=Rc()){const e=aa(n,"auth");if(e.isInitialized())return e.getImmediate();const t=tw(n,{popupRedirectResolver:_T,persistence:[Aw,gw,om]}),s=Ap("authTokenSyncURL");if(s&&typeof isSecureContext=="boolean"&&isSecureContext){const r=new URL(s,location.origin);if(location.origin===r.origin){const o=IT(r.toString());uw(t,o,()=>o(t.currentUser)),hw(t,l=>o(l))}}const i=bp("auth");return i&&sw(t,`http://${i}`),t}function bT(){var n,e;return(e=(n=document.getElementsByTagName("head"))===null||n===void 0?void 0:n[0])!==null&&e!==void 0?e:document}JE({loadJS(n){return new Promise((e,t)=>{const s=document.createElement("script");s.setAttribute("src",n),s.onload=e,s.onerror=i=>{const r=Rt("internal-error");r.customData=i,t(r)},s.type="text/javascript",s.charset="UTF-8",bT().appendChild(s)})},gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="});ET("Browser");var xd=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var Yn,pm;(function(){var n;/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/function e(I,_){function y(){}y.prototype=_.prototype,I.D=_.prototype,I.prototype=new y,I.prototype.constructor=I,I.C=function(w,T,R){for(var v=Array(arguments.length-2),ze=2;ze<arguments.length;ze++)v[ze-2]=arguments[ze];return _.prototype[T].apply(w,v)}}function t(){this.blockSize=-1}function s(){this.blockSize=-1,this.blockSize=64,this.g=Array(4),this.B=Array(this.blockSize),this.o=this.h=0,this.s()}e(s,t),s.prototype.s=function(){this.g[0]=1732584193,this.g[1]=4023233417,this.g[2]=2562383102,this.g[3]=271733878,this.o=this.h=0};function i(I,_,y){y||(y=0);var w=Array(16);if(typeof _=="string")for(var T=0;16>T;++T)w[T]=_.charCodeAt(y++)|_.charCodeAt(y++)<<8|_.charCodeAt(y++)<<16|_.charCodeAt(y++)<<24;else for(T=0;16>T;++T)w[T]=_[y++]|_[y++]<<8|_[y++]<<16|_[y++]<<24;_=I.g[0],y=I.g[1],T=I.g[2];var R=I.g[3],v=_+(R^y&(T^R))+w[0]+3614090360&4294967295;_=y+(v<<7&4294967295|v>>>25),v=R+(T^_&(y^T))+w[1]+3905402710&4294967295,R=_+(v<<12&4294967295|v>>>20),v=T+(y^R&(_^y))+w[2]+606105819&4294967295,T=R+(v<<17&4294967295|v>>>15),v=y+(_^T&(R^_))+w[3]+3250441966&4294967295,y=T+(v<<22&4294967295|v>>>10),v=_+(R^y&(T^R))+w[4]+4118548399&4294967295,_=y+(v<<7&4294967295|v>>>25),v=R+(T^_&(y^T))+w[5]+1200080426&4294967295,R=_+(v<<12&4294967295|v>>>20),v=T+(y^R&(_^y))+w[6]+2821735955&4294967295,T=R+(v<<17&4294967295|v>>>15),v=y+(_^T&(R^_))+w[7]+4249261313&4294967295,y=T+(v<<22&4294967295|v>>>10),v=_+(R^y&(T^R))+w[8]+1770035416&4294967295,_=y+(v<<7&4294967295|v>>>25),v=R+(T^_&(y^T))+w[9]+2336552879&4294967295,R=_+(v<<12&4294967295|v>>>20),v=T+(y^R&(_^y))+w[10]+4294925233&4294967295,T=R+(v<<17&4294967295|v>>>15),v=y+(_^T&(R^_))+w[11]+2304563134&4294967295,y=T+(v<<22&4294967295|v>>>10),v=_+(R^y&(T^R))+w[12]+1804603682&4294967295,_=y+(v<<7&4294967295|v>>>25),v=R+(T^_&(y^T))+w[13]+4254626195&4294967295,R=_+(v<<12&4294967295|v>>>20),v=T+(y^R&(_^y))+w[14]+2792965006&4294967295,T=R+(v<<17&4294967295|v>>>15),v=y+(_^T&(R^_))+w[15]+1236535329&4294967295,y=T+(v<<22&4294967295|v>>>10),v=_+(T^R&(y^T))+w[1]+4129170786&4294967295,_=y+(v<<5&4294967295|v>>>27),v=R+(y^T&(_^y))+w[6]+3225465664&4294967295,R=_+(v<<9&4294967295|v>>>23),v=T+(_^y&(R^_))+w[11]+643717713&4294967295,T=R+(v<<14&4294967295|v>>>18),v=y+(R^_&(T^R))+w[0]+3921069994&4294967295,y=T+(v<<20&4294967295|v>>>12),v=_+(T^R&(y^T))+w[5]+3593408605&4294967295,_=y+(v<<5&4294967295|v>>>27),v=R+(y^T&(_^y))+w[10]+38016083&4294967295,R=_+(v<<9&4294967295|v>>>23),v=T+(_^y&(R^_))+w[15]+3634488961&4294967295,T=R+(v<<14&4294967295|v>>>18),v=y+(R^_&(T^R))+w[4]+3889429448&4294967295,y=T+(v<<20&4294967295|v>>>12),v=_+(T^R&(y^T))+w[9]+568446438&4294967295,_=y+(v<<5&4294967295|v>>>27),v=R+(y^T&(_^y))+w[14]+3275163606&4294967295,R=_+(v<<9&4294967295|v>>>23),v=T+(_^y&(R^_))+w[3]+4107603335&4294967295,T=R+(v<<14&4294967295|v>>>18),v=y+(R^_&(T^R))+w[8]+1163531501&4294967295,y=T+(v<<20&4294967295|v>>>12),v=_+(T^R&(y^T))+w[13]+2850285829&4294967295,_=y+(v<<5&4294967295|v>>>27),v=R+(y^T&(_^y))+w[2]+4243563512&4294967295,R=_+(v<<9&4294967295|v>>>23),v=T+(_^y&(R^_))+w[7]+1735328473&4294967295,T=R+(v<<14&4294967295|v>>>18),v=y+(R^_&(T^R))+w[12]+2368359562&4294967295,y=T+(v<<20&4294967295|v>>>12),v=_+(y^T^R)+w[5]+4294588738&4294967295,_=y+(v<<4&4294967295|v>>>28),v=R+(_^y^T)+w[8]+2272392833&4294967295,R=_+(v<<11&4294967295|v>>>21),v=T+(R^_^y)+w[11]+1839030562&4294967295,T=R+(v<<16&4294967295|v>>>16),v=y+(T^R^_)+w[14]+4259657740&4294967295,y=T+(v<<23&4294967295|v>>>9),v=_+(y^T^R)+w[1]+2763975236&4294967295,_=y+(v<<4&4294967295|v>>>28),v=R+(_^y^T)+w[4]+1272893353&4294967295,R=_+(v<<11&4294967295|v>>>21),v=T+(R^_^y)+w[7]+4139469664&4294967295,T=R+(v<<16&4294967295|v>>>16),v=y+(T^R^_)+w[10]+3200236656&4294967295,y=T+(v<<23&4294967295|v>>>9),v=_+(y^T^R)+w[13]+681279174&4294967295,_=y+(v<<4&4294967295|v>>>28),v=R+(_^y^T)+w[0]+3936430074&4294967295,R=_+(v<<11&4294967295|v>>>21),v=T+(R^_^y)+w[3]+3572445317&4294967295,T=R+(v<<16&4294967295|v>>>16),v=y+(T^R^_)+w[6]+76029189&4294967295,y=T+(v<<23&4294967295|v>>>9),v=_+(y^T^R)+w[9]+3654602809&4294967295,_=y+(v<<4&4294967295|v>>>28),v=R+(_^y^T)+w[12]+3873151461&4294967295,R=_+(v<<11&4294967295|v>>>21),v=T+(R^_^y)+w[15]+530742520&4294967295,T=R+(v<<16&4294967295|v>>>16),v=y+(T^R^_)+w[2]+3299628645&4294967295,y=T+(v<<23&4294967295|v>>>9),v=_+(T^(y|~R))+w[0]+4096336452&4294967295,_=y+(v<<6&4294967295|v>>>26),v=R+(y^(_|~T))+w[7]+1126891415&4294967295,R=_+(v<<10&4294967295|v>>>22),v=T+(_^(R|~y))+w[14]+2878612391&4294967295,T=R+(v<<15&4294967295|v>>>17),v=y+(R^(T|~_))+w[5]+4237533241&4294967295,y=T+(v<<21&4294967295|v>>>11),v=_+(T^(y|~R))+w[12]+1700485571&4294967295,_=y+(v<<6&4294967295|v>>>26),v=R+(y^(_|~T))+w[3]+2399980690&4294967295,R=_+(v<<10&4294967295|v>>>22),v=T+(_^(R|~y))+w[10]+4293915773&4294967295,T=R+(v<<15&4294967295|v>>>17),v=y+(R^(T|~_))+w[1]+2240044497&4294967295,y=T+(v<<21&4294967295|v>>>11),v=_+(T^(y|~R))+w[8]+1873313359&4294967295,_=y+(v<<6&4294967295|v>>>26),v=R+(y^(_|~T))+w[15]+4264355552&4294967295,R=_+(v<<10&4294967295|v>>>22),v=T+(_^(R|~y))+w[6]+2734768916&4294967295,T=R+(v<<15&4294967295|v>>>17),v=y+(R^(T|~_))+w[13]+1309151649&4294967295,y=T+(v<<21&4294967295|v>>>11),v=_+(T^(y|~R))+w[4]+4149444226&4294967295,_=y+(v<<6&4294967295|v>>>26),v=R+(y^(_|~T))+w[11]+3174756917&4294967295,R=_+(v<<10&4294967295|v>>>22),v=T+(_^(R|~y))+w[2]+718787259&4294967295,T=R+(v<<15&4294967295|v>>>17),v=y+(R^(T|~_))+w[9]+3951481745&4294967295,I.g[0]=I.g[0]+_&4294967295,I.g[1]=I.g[1]+(T+(v<<21&4294967295|v>>>11))&4294967295,I.g[2]=I.g[2]+T&4294967295,I.g[3]=I.g[3]+R&4294967295}s.prototype.u=function(I,_){_===void 0&&(_=I.length);for(var y=_-this.blockSize,w=this.B,T=this.h,R=0;R<_;){if(T==0)for(;R<=y;)i(this,I,R),R+=this.blockSize;if(typeof I=="string"){for(;R<_;)if(w[T++]=I.charCodeAt(R++),T==this.blockSize){i(this,w),T=0;break}}else for(;R<_;)if(w[T++]=I[R++],T==this.blockSize){i(this,w),T=0;break}}this.h=T,this.o+=_},s.prototype.v=function(){var I=Array((56>this.h?this.blockSize:2*this.blockSize)-this.h);I[0]=128;for(var _=1;_<I.length-8;++_)I[_]=0;var y=8*this.o;for(_=I.length-8;_<I.length;++_)I[_]=y&255,y/=256;for(this.u(I),I=Array(16),_=y=0;4>_;++_)for(var w=0;32>w;w+=8)I[y++]=this.g[_]>>>w&255;return I};function r(I,_){var y=l;return Object.prototype.hasOwnProperty.call(y,I)?y[I]:y[I]=_(I)}function o(I,_){this.h=_;for(var y=[],w=!0,T=I.length-1;0<=T;T--){var R=I[T]|0;w&&R==_||(y[T]=R,w=!1)}this.g=y}var l={};function c(I){return-128<=I&&128>I?r(I,function(_){return new o([_|0],0>_?-1:0)}):new o([I|0],0>I?-1:0)}function h(I){if(isNaN(I)||!isFinite(I))return p;if(0>I)return k(h(-I));for(var _=[],y=1,w=0;I>=y;w++)_[w]=I/y|0,y*=4294967296;return new o(_,0)}function d(I,_){if(I.length==0)throw Error("number format error: empty string");if(_=_||10,2>_||36<_)throw Error("radix out of range: "+_);if(I.charAt(0)=="-")return k(d(I.substring(1),_));if(0<=I.indexOf("-"))throw Error('number format error: interior "-" character');for(var y=h(Math.pow(_,8)),w=p,T=0;T<I.length;T+=8){var R=Math.min(8,I.length-T),v=parseInt(I.substring(T,T+R),_);8>R?(R=h(Math.pow(_,R)),w=w.j(R).add(h(v))):(w=w.j(y),w=w.add(h(v)))}return w}var p=c(0),m=c(1),E=c(16777216);n=o.prototype,n.m=function(){if(S(this))return-k(this).m();for(var I=0,_=1,y=0;y<this.g.length;y++){var w=this.i(y);I+=(0<=w?w:4294967296+w)*_,_*=4294967296}return I},n.toString=function(I){if(I=I||10,2>I||36<I)throw Error("radix out of range: "+I);if(C(this))return"0";if(S(this))return"-"+k(this).toString(I);for(var _=h(Math.pow(I,6)),y=this,w="";;){var T=ee(y,_).g;y=F(y,T.j(_));var R=((0<y.g.length?y.g[0]:y.h)>>>0).toString(I);if(y=T,C(y))return R+w;for(;6>R.length;)R="0"+R;w=R+w}},n.i=function(I){return 0>I?0:I<this.g.length?this.g[I]:this.h};function C(I){if(I.h!=0)return!1;for(var _=0;_<I.g.length;_++)if(I.g[_]!=0)return!1;return!0}function S(I){return I.h==-1}n.l=function(I){return I=F(this,I),S(I)?-1:C(I)?0:1};function k(I){for(var _=I.g.length,y=[],w=0;w<_;w++)y[w]=~I.g[w];return new o(y,~I.h).add(m)}n.abs=function(){return S(this)?k(this):this},n.add=function(I){for(var _=Math.max(this.g.length,I.g.length),y=[],w=0,T=0;T<=_;T++){var R=w+(this.i(T)&65535)+(I.i(T)&65535),v=(R>>>16)+(this.i(T)>>>16)+(I.i(T)>>>16);w=v>>>16,R&=65535,v&=65535,y[T]=v<<16|R}return new o(y,y[y.length-1]&-2147483648?-1:0)};function F(I,_){return I.add(k(_))}n.j=function(I){if(C(this)||C(I))return p;if(S(this))return S(I)?k(this).j(k(I)):k(k(this).j(I));if(S(I))return k(this.j(k(I)));if(0>this.l(E)&&0>I.l(E))return h(this.m()*I.m());for(var _=this.g.length+I.g.length,y=[],w=0;w<2*_;w++)y[w]=0;for(w=0;w<this.g.length;w++)for(var T=0;T<I.g.length;T++){var R=this.i(w)>>>16,v=this.i(w)&65535,ze=I.i(T)>>>16,yt=I.i(T)&65535;y[2*w+2*T]+=v*yt,U(y,2*w+2*T),y[2*w+2*T+1]+=R*yt,U(y,2*w+2*T+1),y[2*w+2*T+1]+=v*ze,U(y,2*w+2*T+1),y[2*w+2*T+2]+=R*ze,U(y,2*w+2*T+2)}for(w=0;w<_;w++)y[w]=y[2*w+1]<<16|y[2*w];for(w=_;w<2*_;w++)y[w]=0;return new o(y,0)};function U(I,_){for(;(I[_]&65535)!=I[_];)I[_+1]+=I[_]>>>16,I[_]&=65535,_++}function q(I,_){this.g=I,this.h=_}function ee(I,_){if(C(_))throw Error("division by zero");if(C(I))return new q(p,p);if(S(I))return _=ee(k(I),_),new q(k(_.g),k(_.h));if(S(_))return _=ee(I,k(_)),new q(k(_.g),_.h);if(30<I.g.length){if(S(I)||S(_))throw Error("slowDivide_ only works with positive integers.");for(var y=m,w=_;0>=w.l(I);)y=he(y),w=he(w);var T=de(y,1),R=de(w,1);for(w=de(w,2),y=de(y,2);!C(w);){var v=R.add(w);0>=v.l(I)&&(T=T.add(y),R=v),w=de(w,1),y=de(y,1)}return _=F(I,T.j(_)),new q(T,_)}for(T=p;0<=I.l(_);){for(y=Math.max(1,Math.floor(I.m()/_.m())),w=Math.ceil(Math.log(y)/Math.LN2),w=48>=w?1:Math.pow(2,w-48),R=h(y),v=R.j(_);S(v)||0<v.l(I);)y-=w,R=h(y),v=R.j(_);C(R)&&(R=m),T=T.add(R),I=F(I,v)}return new q(T,I)}n.A=function(I){return ee(this,I).h},n.and=function(I){for(var _=Math.max(this.g.length,I.g.length),y=[],w=0;w<_;w++)y[w]=this.i(w)&I.i(w);return new o(y,this.h&I.h)},n.or=function(I){for(var _=Math.max(this.g.length,I.g.length),y=[],w=0;w<_;w++)y[w]=this.i(w)|I.i(w);return new o(y,this.h|I.h)},n.xor=function(I){for(var _=Math.max(this.g.length,I.g.length),y=[],w=0;w<_;w++)y[w]=this.i(w)^I.i(w);return new o(y,this.h^I.h)};function he(I){for(var _=I.g.length+1,y=[],w=0;w<_;w++)y[w]=I.i(w)<<1|I.i(w-1)>>>31;return new o(y,I.h)}function de(I,_){var y=_>>5;_%=32;for(var w=I.g.length-y,T=[],R=0;R<w;R++)T[R]=0<_?I.i(R+y)>>>_|I.i(R+y+1)<<32-_:I.i(R+y);return new o(T,I.h)}s.prototype.digest=s.prototype.v,s.prototype.reset=s.prototype.s,s.prototype.update=s.prototype.u,pm=s,o.prototype.add=o.prototype.add,o.prototype.multiply=o.prototype.j,o.prototype.modulo=o.prototype.A,o.prototype.compare=o.prototype.l,o.prototype.toNumber=o.prototype.m,o.prototype.toString=o.prototype.toString,o.prototype.getBits=o.prototype.i,o.fromNumber=h,o.fromString=d,Yn=o}).apply(typeof xd<"u"?xd:typeof self<"u"?self:typeof window<"u"?window:{});var Yr=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var mm,Di,gm,co,Wl,_m,ym,vm;(function(){var n,e=typeof Object.defineProperties=="function"?Object.defineProperty:function(a,u,f){return a==Array.prototype||a==Object.prototype||(a[u]=f.value),a};function t(a){a=[typeof globalThis=="object"&&globalThis,a,typeof window=="object"&&window,typeof self=="object"&&self,typeof Yr=="object"&&Yr];for(var u=0;u<a.length;++u){var f=a[u];if(f&&f.Math==Math)return f}throw Error("Cannot find global object")}var s=t(this);function i(a,u){if(u)e:{var f=s;a=a.split(".");for(var g=0;g<a.length-1;g++){var b=a[g];if(!(b in f))break e;f=f[b]}a=a[a.length-1],g=f[a],u=u(g),u!=g&&u!=null&&e(f,a,{configurable:!0,writable:!0,value:u})}}function r(a,u){a instanceof String&&(a+="");var f=0,g=!1,b={next:function(){if(!g&&f<a.length){var A=f++;return{value:u(A,a[A]),done:!1}}return g=!0,{done:!0,value:void 0}}};return b[Symbol.iterator]=function(){return b},b}i("Array.prototype.values",function(a){return a||function(){return r(this,function(u,f){return f})}});/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/var o=o||{},l=this||self;function c(a){var u=typeof a;return u=u!="object"?u:a?Array.isArray(a)?"array":u:"null",u=="array"||u=="object"&&typeof a.length=="number"}function h(a){var u=typeof a;return u=="object"&&a!=null||u=="function"}function d(a,u,f){return a.call.apply(a.bind,arguments)}function p(a,u,f){if(!a)throw Error();if(2<arguments.length){var g=Array.prototype.slice.call(arguments,2);return function(){var b=Array.prototype.slice.call(arguments);return Array.prototype.unshift.apply(b,g),a.apply(u,b)}}return function(){return a.apply(u,arguments)}}function m(a,u,f){return m=Function.prototype.bind&&Function.prototype.bind.toString().indexOf("native code")!=-1?d:p,m.apply(null,arguments)}function E(a,u){var f=Array.prototype.slice.call(arguments,1);return function(){var g=f.slice();return g.push.apply(g,arguments),a.apply(this,g)}}function C(a,u){function f(){}f.prototype=u.prototype,a.aa=u.prototype,a.prototype=new f,a.prototype.constructor=a,a.Qb=function(g,b,A){for(var O=Array(arguments.length-2),pe=2;pe<arguments.length;pe++)O[pe-2]=arguments[pe];return u.prototype[b].apply(g,O)}}function S(a){const u=a.length;if(0<u){const f=Array(u);for(let g=0;g<u;g++)f[g]=a[g];return f}return[]}function k(a,u){for(let f=1;f<arguments.length;f++){const g=arguments[f];if(c(g)){const b=a.length||0,A=g.length||0;a.length=b+A;for(let O=0;O<A;O++)a[b+O]=g[O]}else a.push(g)}}class F{constructor(u,f){this.i=u,this.j=f,this.h=0,this.g=null}get(){let u;return 0<this.h?(this.h--,u=this.g,this.g=u.next,u.next=null):u=this.i(),u}}function U(a){return/^[\s\xa0]*$/.test(a)}function q(){var a=l.navigator;return a&&(a=a.userAgent)?a:""}function ee(a){return ee[" "](a),a}ee[" "]=function(){};var he=q().indexOf("Gecko")!=-1&&!(q().toLowerCase().indexOf("webkit")!=-1&&q().indexOf("Edge")==-1)&&!(q().indexOf("Trident")!=-1||q().indexOf("MSIE")!=-1)&&q().indexOf("Edge")==-1;function de(a,u,f){for(const g in a)u.call(f,a[g],g,a)}function I(a,u){for(const f in a)u.call(void 0,a[f],f,a)}function _(a){const u={};for(const f in a)u[f]=a[f];return u}const y="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function w(a,u){let f,g;for(let b=1;b<arguments.length;b++){g=arguments[b];for(f in g)a[f]=g[f];for(let A=0;A<y.length;A++)f=y[A],Object.prototype.hasOwnProperty.call(g,f)&&(a[f]=g[f])}}function T(a){var u=1;a=a.split(":");const f=[];for(;0<u&&a.length;)f.push(a.shift()),u--;return a.length&&f.push(a.join(":")),f}function R(a){l.setTimeout(()=>{throw a},0)}function v(){var a=Ut;let u=null;return a.g&&(u=a.g,a.g=a.g.next,a.g||(a.h=null),u.next=null),u}class ze{constructor(){this.h=this.g=null}add(u,f){const g=yt.get();g.set(u,f),this.h?this.h.next=g:this.g=g,this.h=g}}var yt=new F(()=>new fs,a=>a.reset());class fs{constructor(){this.next=this.g=this.h=null}set(u,f){this.h=u,this.g=f,this.next=null}reset(){this.next=this.g=this.h=null}}let Bt,cn=!1,Ut=new ze,ps=()=>{const a=l.Promise.resolve(void 0);Bt=()=>{a.then(Dr)}};var Dr=()=>{for(var a;a=v();){try{a.h.call(a.g)}catch(f){R(f)}var u=yt;u.j(a),100>u.h&&(u.h++,a.next=u.g,u.g=a)}cn=!1};function vt(){this.s=this.s,this.C=this.C}vt.prototype.s=!1,vt.prototype.ma=function(){this.s||(this.s=!0,this.N())},vt.prototype.N=function(){if(this.C)for(;this.C.length;)this.C.shift()()};function G(a,u){this.type=a,this.g=this.target=u,this.defaultPrevented=!1}G.prototype.h=function(){this.defaultPrevented=!0};var ke=function(){if(!l.addEventListener||!Object.defineProperty)return!1;var a=!1,u=Object.defineProperty({},"passive",{get:function(){a=!0}});try{const f=()=>{};l.addEventListener("test",f,u),l.removeEventListener("test",f,u)}catch{}return a}();function hn(a,u){if(G.call(this,a?a.type:""),this.relatedTarget=this.g=this.target=null,this.button=this.screenY=this.screenX=this.clientY=this.clientX=0,this.key="",this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1,this.state=null,this.pointerId=0,this.pointerType="",this.i=null,a){var f=this.type=a.type,g=a.changedTouches&&a.changedTouches.length?a.changedTouches[0]:null;if(this.target=a.target||a.srcElement,this.g=u,u=a.relatedTarget){if(he){e:{try{ee(u.nodeName);var b=!0;break e}catch{}b=!1}b||(u=null)}}else f=="mouseover"?u=a.fromElement:f=="mouseout"&&(u=a.toElement);this.relatedTarget=u,g?(this.clientX=g.clientX!==void 0?g.clientX:g.pageX,this.clientY=g.clientY!==void 0?g.clientY:g.pageY,this.screenX=g.screenX||0,this.screenY=g.screenY||0):(this.clientX=a.clientX!==void 0?a.clientX:a.pageX,this.clientY=a.clientY!==void 0?a.clientY:a.pageY,this.screenX=a.screenX||0,this.screenY=a.screenY||0),this.button=a.button,this.key=a.key||"",this.ctrlKey=a.ctrlKey,this.altKey=a.altKey,this.shiftKey=a.shiftKey,this.metaKey=a.metaKey,this.pointerId=a.pointerId||0,this.pointerType=typeof a.pointerType=="string"?a.pointerType:x[a.pointerType]||"",this.state=a.state,this.i=a,a.defaultPrevented&&hn.aa.h.call(this)}}C(hn,G);var x={2:"touch",3:"pen",4:"mouse"};hn.prototype.h=function(){hn.aa.h.call(this);var a=this.i;a.preventDefault?a.preventDefault():a.returnValue=!1};var Ee="closure_listenable_"+(1e6*Math.random()|0),fe=0;function Ge(a,u,f,g,b){this.listener=a,this.proxy=null,this.src=u,this.type=f,this.capture=!!g,this.ha=b,this.key=++fe,this.da=this.fa=!1}function un(a){a.da=!0,a.listener=null,a.proxy=null,a.src=null,a.ha=null}function qt(a){this.src=a,this.g={},this.h=0}qt.prototype.add=function(a,u,f,g,b){var A=a.toString();a=this.g[A],a||(a=this.g[A]=[],this.h++);var O=gs(a,u,g,b);return-1<O?(u=a[O],f||(u.fa=!1)):(u=new Ge(u,this.src,A,!!g,b),u.fa=f,a.push(u)),u};function ms(a,u){var f=u.type;if(f in a.g){var g=a.g[f],b=Array.prototype.indexOf.call(g,u,void 0),A;(A=0<=b)&&Array.prototype.splice.call(g,b,1),A&&(un(u),a.g[f].length==0&&(delete a.g[f],a.h--))}}function gs(a,u,f,g){for(var b=0;b<a.length;++b){var A=a[b];if(!A.da&&A.listener==u&&A.capture==!!f&&A.ha==g)return b}return-1}var _s="closure_lm_"+(1e6*Math.random()|0),ys={};function Bn(a,u,f,g,b){if(Array.isArray(u)){for(var A=0;A<u.length;A++)Bn(a,u[A],f,g,b);return null}return f=uu(f),a&&a[Ee]?a.K(u,f,h(g)?!!g.capture:!1,b):Wt(a,u,f,!1,g,b)}function Wt(a,u,f,g,b,A){if(!u)throw Error("Invalid event type");var O=h(b)?!!b.capture:!!b,pe=Fa(a);if(pe||(a[_s]=pe=new qt(a)),f=pe.add(u,f,g,O,A),f.proxy)return f;if(g=Va(),f.proxy=g,g.src=a,g.listener=f,a.addEventListener)ke||(b=O),b===void 0&&(b=!1),a.addEventListener(u.toString(),g,b);else if(a.attachEvent)a.attachEvent(ai(u.toString()),g);else if(a.addListener&&a.removeListener)a.addListener(g);else throw Error("addEventListener and attachEvent are unavailable.");return f}function Va(){function a(f){return u.call(a.src,a.listener,f)}const u=_y;return a}function Et(a,u,f,g,b){if(Array.isArray(u))for(var A=0;A<u.length;A++)Et(a,u[A],f,g,b);else g=h(g)?!!g.capture:!!g,f=uu(f),a&&a[Ee]?(a=a.i,u=String(u).toString(),u in a.g&&(A=a.g[u],f=gs(A,f,g,b),-1<f&&(un(A[f]),Array.prototype.splice.call(A,f,1),A.length==0&&(delete a.g[u],a.h--)))):a&&(a=Fa(a))&&(u=a.g[u.toString()],a=-1,u&&(a=gs(u,f,g,b)),(f=-1<a?u[a]:null)&&$t(f))}function $t(a){if(typeof a!="number"&&a&&!a.da){var u=a.src;if(u&&u[Ee])ms(u.i,a);else{var f=a.type,g=a.proxy;u.removeEventListener?u.removeEventListener(f,g,a.capture):u.detachEvent?u.detachEvent(ai(f),g):u.addListener&&u.removeListener&&u.removeListener(g),(f=Fa(u))?(ms(f,a),f.h==0&&(f.src=null,u[_s]=null)):un(a)}}}function ai(a){return a in ys?ys[a]:ys[a]="on"+a}function _y(a,u){if(a.da)a=!0;else{u=new hn(u,this);var f=a.listener,g=a.ha||a.src;a.fa&&$t(a),a=f.call(g,u)}return a}function Fa(a){return a=a[_s],a instanceof qt?a:null}var Ba="__closure_events_fn_"+(1e9*Math.random()>>>0);function uu(a){return typeof a=="function"?a:(a[Ba]||(a[Ba]=function(u){return a.handleEvent(u)}),a[Ba])}function He(){vt.call(this),this.i=new qt(this),this.M=this,this.F=null}C(He,vt),He.prototype[Ee]=!0,He.prototype.removeEventListener=function(a,u,f,g){Et(this,a,u,f,g)};function tt(a,u){var f,g=a.F;if(g)for(f=[];g;g=g.F)f.push(g);if(a=a.M,g=u.type||u,typeof u=="string")u=new G(u,a);else if(u instanceof G)u.target=u.target||a;else{var b=u;u=new G(g,a),w(u,b)}if(b=!0,f)for(var A=f.length-1;0<=A;A--){var O=u.g=f[A];b=Lr(O,g,!0,u)&&b}if(O=u.g=a,b=Lr(O,g,!0,u)&&b,b=Lr(O,g,!1,u)&&b,f)for(A=0;A<f.length;A++)O=u.g=f[A],b=Lr(O,g,!1,u)&&b}He.prototype.N=function(){if(He.aa.N.call(this),this.i){var a=this.i,u;for(u in a.g){for(var f=a.g[u],g=0;g<f.length;g++)un(f[g]);delete a.g[u],a.h--}}this.F=null},He.prototype.K=function(a,u,f,g){return this.i.add(String(a),u,!1,f,g)},He.prototype.L=function(a,u,f,g){return this.i.add(String(a),u,!0,f,g)};function Lr(a,u,f,g){if(u=a.i.g[String(u)],!u)return!0;u=u.concat();for(var b=!0,A=0;A<u.length;++A){var O=u[A];if(O&&!O.da&&O.capture==f){var pe=O.listener,Fe=O.ha||O.src;O.fa&&ms(a.i,O),b=pe.call(Fe,g)!==!1&&b}}return b&&!g.defaultPrevented}function du(a,u,f){if(typeof a=="function")f&&(a=m(a,f));else if(a&&typeof a.handleEvent=="function")a=m(a.handleEvent,a);else throw Error("Invalid listener argument");return 2147483647<Number(u)?-1:l.setTimeout(a,u||0)}function fu(a){a.g=du(()=>{a.g=null,a.i&&(a.i=!1,fu(a))},a.l);const u=a.h;a.h=null,a.m.apply(null,u)}class yy extends vt{constructor(u,f){super(),this.m=u,this.l=f,this.h=null,this.i=!1,this.g=null}j(u){this.h=arguments,this.g?this.i=!0:fu(this)}N(){super.N(),this.g&&(l.clearTimeout(this.g),this.g=null,this.i=!1,this.h=null)}}function li(a){vt.call(this),this.h=a,this.g={}}C(li,vt);var pu=[];function mu(a){de(a.g,function(u,f){this.g.hasOwnProperty(f)&&$t(u)},a),a.g={}}li.prototype.N=function(){li.aa.N.call(this),mu(this)},li.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented")};var Ua=l.JSON.stringify,vy=l.JSON.parse,Ey=class{stringify(a){return l.JSON.stringify(a,void 0)}parse(a){return l.JSON.parse(a,void 0)}};function qa(){}qa.prototype.h=null;function gu(a){return a.h||(a.h=a.i())}function _u(){}var ci={OPEN:"a",kb:"b",Ja:"c",wb:"d"};function Wa(){G.call(this,"d")}C(Wa,G);function $a(){G.call(this,"c")}C($a,G);var Un={},yu=null;function xr(){return yu=yu||new He}Un.La="serverreachability";function vu(a){G.call(this,Un.La,a)}C(vu,G);function hi(a){const u=xr();tt(u,new vu(u))}Un.STAT_EVENT="statevent";function Eu(a,u){G.call(this,Un.STAT_EVENT,a),this.stat=u}C(Eu,G);function nt(a){const u=xr();tt(u,new Eu(u,a))}Un.Ma="timingevent";function wu(a,u){G.call(this,Un.Ma,a),this.size=u}C(wu,G);function ui(a,u){if(typeof a!="function")throw Error("Fn must not be null and must be a function");return l.setTimeout(function(){a()},u)}function di(){this.g=!0}di.prototype.xa=function(){this.g=!1};function wy(a,u,f,g,b,A){a.info(function(){if(a.g)if(A)for(var O="",pe=A.split("&"),Fe=0;Fe<pe.length;Fe++){var oe=pe[Fe].split("=");if(1<oe.length){var Ke=oe[0];oe=oe[1];var Qe=Ke.split("_");O=2<=Qe.length&&Qe[1]=="type"?O+(Ke+"="+oe+"&"):O+(Ke+"=redacted&")}}else O=null;else O=A;return"XMLHTTP REQ ("+g+") [attempt "+b+"]: "+u+`
`+f+`
`+O})}function Ty(a,u,f,g,b,A,O){a.info(function(){return"XMLHTTP RESP ("+g+") [ attempt "+b+"]: "+u+`
`+f+`
`+A+" "+O})}function vs(a,u,f,g){a.info(function(){return"XMLHTTP TEXT ("+u+"): "+Cy(a,f)+(g?" "+g:"")})}function Iy(a,u){a.info(function(){return"TIMEOUT: "+u})}di.prototype.info=function(){};function Cy(a,u){if(!a.g)return u;if(!u)return null;try{var f=JSON.parse(u);if(f){for(a=0;a<f.length;a++)if(Array.isArray(f[a])){var g=f[a];if(!(2>g.length)){var b=g[1];if(Array.isArray(b)&&!(1>b.length)){var A=b[0];if(A!="noop"&&A!="stop"&&A!="close")for(var O=1;O<b.length;O++)b[O]=""}}}}return Ua(f)}catch{return u}}var Or={NO_ERROR:0,gb:1,tb:2,sb:3,nb:4,rb:5,ub:6,Ia:7,TIMEOUT:8,xb:9},Tu={lb:"complete",Hb:"success",Ja:"error",Ia:"abort",zb:"ready",Ab:"readystatechange",TIMEOUT:"timeout",vb:"incrementaldata",yb:"progress",ob:"downloadprogress",Pb:"uploadprogress"},ja;function Mr(){}C(Mr,qa),Mr.prototype.g=function(){return new XMLHttpRequest},Mr.prototype.i=function(){return{}},ja=new Mr;function dn(a,u,f,g){this.j=a,this.i=u,this.l=f,this.R=g||1,this.U=new li(this),this.I=45e3,this.H=null,this.o=!1,this.m=this.A=this.v=this.L=this.F=this.S=this.B=null,this.D=[],this.g=null,this.C=0,this.s=this.u=null,this.X=-1,this.J=!1,this.O=0,this.M=null,this.W=this.K=this.T=this.P=!1,this.h=new Iu}function Iu(){this.i=null,this.g="",this.h=!1}var Cu={},za={};function Ga(a,u,f){a.L=1,a.v=Ur(jt(u)),a.m=f,a.P=!0,bu(a,null)}function bu(a,u){a.F=Date.now(),Vr(a),a.A=jt(a.v);var f=a.A,g=a.R;Array.isArray(g)||(g=[String(g)]),Bu(f.i,"t",g),a.C=0,f=a.j.J,a.h=new Iu,a.g=sd(a.j,f?u:null,!a.m),0<a.O&&(a.M=new yy(m(a.Y,a,a.g),a.O)),u=a.U,f=a.g,g=a.ca;var b="readystatechange";Array.isArray(b)||(b&&(pu[0]=b.toString()),b=pu);for(var A=0;A<b.length;A++){var O=Bn(f,b[A],g||u.handleEvent,!1,u.h||u);if(!O)break;u.g[O.key]=O}u=a.H?_(a.H):{},a.m?(a.u||(a.u="POST"),u["Content-Type"]="application/x-www-form-urlencoded",a.g.ea(a.A,a.u,a.m,u)):(a.u="GET",a.g.ea(a.A,a.u,null,u)),hi(),wy(a.i,a.u,a.A,a.l,a.R,a.m)}dn.prototype.ca=function(a){a=a.target;const u=this.M;u&&zt(a)==3?u.j():this.Y(a)},dn.prototype.Y=function(a){try{if(a==this.g)e:{const Qe=zt(this.g);var u=this.g.Ba();const Ts=this.g.Z();if(!(3>Qe)&&(Qe!=3||this.g&&(this.h.h||this.g.oa()||Gu(this.g)))){this.J||Qe!=4||u==7||(u==8||0>=Ts?hi(3):hi(2)),Ha(this);var f=this.g.Z();this.X=f;t:if(Ru(this)){var g=Gu(this.g);a="";var b=g.length,A=zt(this.g)==4;if(!this.h.i){if(typeof TextDecoder>"u"){qn(this),fi(this);var O="";break t}this.h.i=new l.TextDecoder}for(u=0;u<b;u++)this.h.h=!0,a+=this.h.i.decode(g[u],{stream:!(A&&u==b-1)});g.length=0,this.h.g+=a,this.C=0,O=this.h.g}else O=this.g.oa();if(this.o=f==200,Ty(this.i,this.u,this.A,this.l,this.R,Qe,f),this.o){if(this.T&&!this.K){t:{if(this.g){var pe,Fe=this.g;if((pe=Fe.g?Fe.g.getResponseHeader("X-HTTP-Initial-Response"):null)&&!U(pe)){var oe=pe;break t}}oe=null}if(f=oe)vs(this.i,this.l,f,"Initial handshake response via X-HTTP-Initial-Response"),this.K=!0,Ka(this,f);else{this.o=!1,this.s=3,nt(12),qn(this),fi(this);break e}}if(this.P){f=!0;let wt;for(;!this.J&&this.C<O.length;)if(wt=by(this,O),wt==za){Qe==4&&(this.s=4,nt(14),f=!1),vs(this.i,this.l,null,"[Incomplete Response]");break}else if(wt==Cu){this.s=4,nt(15),vs(this.i,this.l,O,"[Invalid Chunk]"),f=!1;break}else vs(this.i,this.l,wt,null),Ka(this,wt);if(Ru(this)&&this.C!=0&&(this.h.g=this.h.g.slice(this.C),this.C=0),Qe!=4||O.length!=0||this.h.h||(this.s=1,nt(16),f=!1),this.o=this.o&&f,!f)vs(this.i,this.l,O,"[Invalid Chunked Response]"),qn(this),fi(this);else if(0<O.length&&!this.W){this.W=!0;var Ke=this.j;Ke.g==this&&Ke.ba&&!Ke.M&&(Ke.j.info("Great, no buffering proxy detected. Bytes received: "+O.length),el(Ke),Ke.M=!0,nt(11))}}else vs(this.i,this.l,O,null),Ka(this,O);Qe==4&&qn(this),this.o&&!this.J&&(Qe==4?Zu(this.j,this):(this.o=!1,Vr(this)))}else Wy(this.g),f==400&&0<O.indexOf("Unknown SID")?(this.s=3,nt(12)):(this.s=0,nt(13)),qn(this),fi(this)}}}catch{}finally{}};function Ru(a){return a.g?a.u=="GET"&&a.L!=2&&a.j.Ca:!1}function by(a,u){var f=a.C,g=u.indexOf(`
`,f);return g==-1?za:(f=Number(u.substring(f,g)),isNaN(f)?Cu:(g+=1,g+f>u.length?za:(u=u.slice(g,g+f),a.C=g+f,u)))}dn.prototype.cancel=function(){this.J=!0,qn(this)};function Vr(a){a.S=Date.now()+a.I,Su(a,a.I)}function Su(a,u){if(a.B!=null)throw Error("WatchDog timer not null");a.B=ui(m(a.ba,a),u)}function Ha(a){a.B&&(l.clearTimeout(a.B),a.B=null)}dn.prototype.ba=function(){this.B=null;const a=Date.now();0<=a-this.S?(Iy(this.i,this.A),this.L!=2&&(hi(),nt(17)),qn(this),this.s=2,fi(this)):Su(this,this.S-a)};function fi(a){a.j.G==0||a.J||Zu(a.j,a)}function qn(a){Ha(a);var u=a.M;u&&typeof u.ma=="function"&&u.ma(),a.M=null,mu(a.U),a.g&&(u=a.g,a.g=null,u.abort(),u.ma())}function Ka(a,u){try{var f=a.j;if(f.G!=0&&(f.g==a||Qa(f.h,a))){if(!a.K&&Qa(f.h,a)&&f.G==3){try{var g=f.Da.g.parse(u)}catch{g=null}if(Array.isArray(g)&&g.length==3){var b=g;if(b[0]==0){e:if(!f.u){if(f.g)if(f.g.F+3e3<a.F)Gr(f),jr(f);else break e;Za(f),nt(18)}}else f.za=b[1],0<f.za-f.T&&37500>b[2]&&f.F&&f.v==0&&!f.C&&(f.C=ui(m(f.Za,f),6e3));if(1>=Pu(f.h)&&f.ca){try{f.ca()}catch{}f.ca=void 0}}else $n(f,11)}else if((a.K||f.g==a)&&Gr(f),!U(u))for(b=f.Da.g.parse(u),u=0;u<b.length;u++){let oe=b[u];if(f.T=oe[0],oe=oe[1],f.G==2)if(oe[0]=="c"){f.K=oe[1],f.ia=oe[2];const Ke=oe[3];Ke!=null&&(f.la=Ke,f.j.info("VER="+f.la));const Qe=oe[4];Qe!=null&&(f.Aa=Qe,f.j.info("SVER="+f.Aa));const Ts=oe[5];Ts!=null&&typeof Ts=="number"&&0<Ts&&(g=1.5*Ts,f.L=g,f.j.info("backChannelRequestTimeoutMs_="+g)),g=f;const wt=a.g;if(wt){const Kr=wt.g?wt.g.getResponseHeader("X-Client-Wire-Protocol"):null;if(Kr){var A=g.h;A.g||Kr.indexOf("spdy")==-1&&Kr.indexOf("quic")==-1&&Kr.indexOf("h2")==-1||(A.j=A.l,A.g=new Set,A.h&&(Ya(A,A.h),A.h=null))}if(g.D){const tl=wt.g?wt.g.getResponseHeader("X-HTTP-Session-Id"):null;tl&&(g.ya=tl,ve(g.I,g.D,tl))}}f.G=3,f.l&&f.l.ua(),f.ba&&(f.R=Date.now()-a.F,f.j.info("Handshake RTT: "+f.R+"ms")),g=f;var O=a;if(g.qa=nd(g,g.J?g.ia:null,g.W),O.K){Nu(g.h,O);var pe=O,Fe=g.L;Fe&&(pe.I=Fe),pe.B&&(Ha(pe),Vr(pe)),g.g=O}else Ju(g);0<f.i.length&&zr(f)}else oe[0]!="stop"&&oe[0]!="close"||$n(f,7);else f.G==3&&(oe[0]=="stop"||oe[0]=="close"?oe[0]=="stop"?$n(f,7):Xa(f):oe[0]!="noop"&&f.l&&f.l.ta(oe),f.v=0)}}hi(4)}catch{}}var Ry=class{constructor(a,u){this.g=a,this.map=u}};function Au(a){this.l=a||10,l.PerformanceNavigationTiming?(a=l.performance.getEntriesByType("navigation"),a=0<a.length&&(a[0].nextHopProtocol=="hq"||a[0].nextHopProtocol=="h2")):a=!!(l.chrome&&l.chrome.loadTimes&&l.chrome.loadTimes()&&l.chrome.loadTimes().wasFetchedViaSpdy),this.j=a?this.l:1,this.g=null,1<this.j&&(this.g=new Set),this.h=null,this.i=[]}function ku(a){return a.h?!0:a.g?a.g.size>=a.j:!1}function Pu(a){return a.h?1:a.g?a.g.size:0}function Qa(a,u){return a.h?a.h==u:a.g?a.g.has(u):!1}function Ya(a,u){a.g?a.g.add(u):a.h=u}function Nu(a,u){a.h&&a.h==u?a.h=null:a.g&&a.g.has(u)&&a.g.delete(u)}Au.prototype.cancel=function(){if(this.i=Du(this),this.h)this.h.cancel(),this.h=null;else if(this.g&&this.g.size!==0){for(const a of this.g.values())a.cancel();this.g.clear()}};function Du(a){if(a.h!=null)return a.i.concat(a.h.D);if(a.g!=null&&a.g.size!==0){let u=a.i;for(const f of a.g.values())u=u.concat(f.D);return u}return S(a.i)}function Sy(a){if(a.V&&typeof a.V=="function")return a.V();if(typeof Map<"u"&&a instanceof Map||typeof Set<"u"&&a instanceof Set)return Array.from(a.values());if(typeof a=="string")return a.split("");if(c(a)){for(var u=[],f=a.length,g=0;g<f;g++)u.push(a[g]);return u}u=[],f=0;for(g in a)u[f++]=a[g];return u}function Ay(a){if(a.na&&typeof a.na=="function")return a.na();if(!a.V||typeof a.V!="function"){if(typeof Map<"u"&&a instanceof Map)return Array.from(a.keys());if(!(typeof Set<"u"&&a instanceof Set)){if(c(a)||typeof a=="string"){var u=[];a=a.length;for(var f=0;f<a;f++)u.push(f);return u}u=[],f=0;for(const g in a)u[f++]=g;return u}}}function Lu(a,u){if(a.forEach&&typeof a.forEach=="function")a.forEach(u,void 0);else if(c(a)||typeof a=="string")Array.prototype.forEach.call(a,u,void 0);else for(var f=Ay(a),g=Sy(a),b=g.length,A=0;A<b;A++)u.call(void 0,g[A],f&&f[A],a)}var xu=RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");function ky(a,u){if(a){a=a.split("&");for(var f=0;f<a.length;f++){var g=a[f].indexOf("="),b=null;if(0<=g){var A=a[f].substring(0,g);b=a[f].substring(g+1)}else A=a[f];u(A,b?decodeURIComponent(b.replace(/\+/g," ")):"")}}}function Wn(a){if(this.g=this.o=this.j="",this.s=null,this.m=this.l="",this.h=!1,a instanceof Wn){this.h=a.h,Fr(this,a.j),this.o=a.o,this.g=a.g,Br(this,a.s),this.l=a.l;var u=a.i,f=new gi;f.i=u.i,u.g&&(f.g=new Map(u.g),f.h=u.h),Ou(this,f),this.m=a.m}else a&&(u=String(a).match(xu))?(this.h=!1,Fr(this,u[1]||"",!0),this.o=pi(u[2]||""),this.g=pi(u[3]||"",!0),Br(this,u[4]),this.l=pi(u[5]||"",!0),Ou(this,u[6]||"",!0),this.m=pi(u[7]||"")):(this.h=!1,this.i=new gi(null,this.h))}Wn.prototype.toString=function(){var a=[],u=this.j;u&&a.push(mi(u,Mu,!0),":");var f=this.g;return(f||u=="file")&&(a.push("//"),(u=this.o)&&a.push(mi(u,Mu,!0),"@"),a.push(encodeURIComponent(String(f)).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),f=this.s,f!=null&&a.push(":",String(f))),(f=this.l)&&(this.g&&f.charAt(0)!="/"&&a.push("/"),a.push(mi(f,f.charAt(0)=="/"?Dy:Ny,!0))),(f=this.i.toString())&&a.push("?",f),(f=this.m)&&a.push("#",mi(f,xy)),a.join("")};function jt(a){return new Wn(a)}function Fr(a,u,f){a.j=f?pi(u,!0):u,a.j&&(a.j=a.j.replace(/:$/,""))}function Br(a,u){if(u){if(u=Number(u),isNaN(u)||0>u)throw Error("Bad port number "+u);a.s=u}else a.s=null}function Ou(a,u,f){u instanceof gi?(a.i=u,Oy(a.i,a.h)):(f||(u=mi(u,Ly)),a.i=new gi(u,a.h))}function ve(a,u,f){a.i.set(u,f)}function Ur(a){return ve(a,"zx",Math.floor(2147483648*Math.random()).toString(36)+Math.abs(Math.floor(2147483648*Math.random())^Date.now()).toString(36)),a}function pi(a,u){return a?u?decodeURI(a.replace(/%25/g,"%2525")):decodeURIComponent(a):""}function mi(a,u,f){return typeof a=="string"?(a=encodeURI(a).replace(u,Py),f&&(a=a.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),a):null}function Py(a){return a=a.charCodeAt(0),"%"+(a>>4&15).toString(16)+(a&15).toString(16)}var Mu=/[#\/\?@]/g,Ny=/[#\?:]/g,Dy=/[#\?]/g,Ly=/[#\?@]/g,xy=/#/g;function gi(a,u){this.h=this.g=null,this.i=a||null,this.j=!!u}function fn(a){a.g||(a.g=new Map,a.h=0,a.i&&ky(a.i,function(u,f){a.add(decodeURIComponent(u.replace(/\+/g," ")),f)}))}n=gi.prototype,n.add=function(a,u){fn(this),this.i=null,a=Es(this,a);var f=this.g.get(a);return f||this.g.set(a,f=[]),f.push(u),this.h+=1,this};function Vu(a,u){fn(a),u=Es(a,u),a.g.has(u)&&(a.i=null,a.h-=a.g.get(u).length,a.g.delete(u))}function Fu(a,u){return fn(a),u=Es(a,u),a.g.has(u)}n.forEach=function(a,u){fn(this),this.g.forEach(function(f,g){f.forEach(function(b){a.call(u,b,g,this)},this)},this)},n.na=function(){fn(this);const a=Array.from(this.g.values()),u=Array.from(this.g.keys()),f=[];for(let g=0;g<u.length;g++){const b=a[g];for(let A=0;A<b.length;A++)f.push(u[g])}return f},n.V=function(a){fn(this);let u=[];if(typeof a=="string")Fu(this,a)&&(u=u.concat(this.g.get(Es(this,a))));else{a=Array.from(this.g.values());for(let f=0;f<a.length;f++)u=u.concat(a[f])}return u},n.set=function(a,u){return fn(this),this.i=null,a=Es(this,a),Fu(this,a)&&(this.h-=this.g.get(a).length),this.g.set(a,[u]),this.h+=1,this},n.get=function(a,u){return a?(a=this.V(a),0<a.length?String(a[0]):u):u};function Bu(a,u,f){Vu(a,u),0<f.length&&(a.i=null,a.g.set(Es(a,u),S(f)),a.h+=f.length)}n.toString=function(){if(this.i)return this.i;if(!this.g)return"";const a=[],u=Array.from(this.g.keys());for(var f=0;f<u.length;f++){var g=u[f];const A=encodeURIComponent(String(g)),O=this.V(g);for(g=0;g<O.length;g++){var b=A;O[g]!==""&&(b+="="+encodeURIComponent(String(O[g]))),a.push(b)}}return this.i=a.join("&")};function Es(a,u){return u=String(u),a.j&&(u=u.toLowerCase()),u}function Oy(a,u){u&&!a.j&&(fn(a),a.i=null,a.g.forEach(function(f,g){var b=g.toLowerCase();g!=b&&(Vu(this,g),Bu(this,b,f))},a)),a.j=u}function My(a,u){const f=new di;if(l.Image){const g=new Image;g.onload=E(pn,f,"TestLoadImage: loaded",!0,u,g),g.onerror=E(pn,f,"TestLoadImage: error",!1,u,g),g.onabort=E(pn,f,"TestLoadImage: abort",!1,u,g),g.ontimeout=E(pn,f,"TestLoadImage: timeout",!1,u,g),l.setTimeout(function(){g.ontimeout&&g.ontimeout()},1e4),g.src=a}else u(!1)}function Vy(a,u){const f=new di,g=new AbortController,b=setTimeout(()=>{g.abort(),pn(f,"TestPingServer: timeout",!1,u)},1e4);fetch(a,{signal:g.signal}).then(A=>{clearTimeout(b),A.ok?pn(f,"TestPingServer: ok",!0,u):pn(f,"TestPingServer: server error",!1,u)}).catch(()=>{clearTimeout(b),pn(f,"TestPingServer: error",!1,u)})}function pn(a,u,f,g,b){try{b&&(b.onload=null,b.onerror=null,b.onabort=null,b.ontimeout=null),g(f)}catch{}}function Fy(){this.g=new Ey}function By(a,u,f){const g=f||"";try{Lu(a,function(b,A){let O=b;h(b)&&(O=Ua(b)),u.push(g+A+"="+encodeURIComponent(O))})}catch(b){throw u.push(g+"type="+encodeURIComponent("_badmap")),b}}function qr(a){this.l=a.Ub||null,this.j=a.eb||!1}C(qr,qa),qr.prototype.g=function(){return new Wr(this.l,this.j)},qr.prototype.i=function(a){return function(){return a}}({});function Wr(a,u){He.call(this),this.D=a,this.o=u,this.m=void 0,this.status=this.readyState=0,this.responseType=this.responseText=this.response=this.statusText="",this.onreadystatechange=null,this.u=new Headers,this.h=null,this.B="GET",this.A="",this.g=!1,this.v=this.j=this.l=null}C(Wr,He),n=Wr.prototype,n.open=function(a,u){if(this.readyState!=0)throw this.abort(),Error("Error reopening a connection");this.B=a,this.A=u,this.readyState=1,yi(this)},n.send=function(a){if(this.readyState!=1)throw this.abort(),Error("need to call open() first. ");this.g=!0;const u={headers:this.u,method:this.B,credentials:this.m,cache:void 0};a&&(u.body=a),(this.D||l).fetch(new Request(this.A,u)).then(this.Sa.bind(this),this.ga.bind(this))},n.abort=function(){this.response=this.responseText="",this.u=new Headers,this.status=0,this.j&&this.j.cancel("Request was aborted.").catch(()=>{}),1<=this.readyState&&this.g&&this.readyState!=4&&(this.g=!1,_i(this)),this.readyState=0},n.Sa=function(a){if(this.g&&(this.l=a,this.h||(this.status=this.l.status,this.statusText=this.l.statusText,this.h=a.headers,this.readyState=2,yi(this)),this.g&&(this.readyState=3,yi(this),this.g)))if(this.responseType==="arraybuffer")a.arrayBuffer().then(this.Qa.bind(this),this.ga.bind(this));else if(typeof l.ReadableStream<"u"&&"body"in a){if(this.j=a.body.getReader(),this.o){if(this.responseType)throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');this.response=[]}else this.response=this.responseText="",this.v=new TextDecoder;Uu(this)}else a.text().then(this.Ra.bind(this),this.ga.bind(this))};function Uu(a){a.j.read().then(a.Pa.bind(a)).catch(a.ga.bind(a))}n.Pa=function(a){if(this.g){if(this.o&&a.value)this.response.push(a.value);else if(!this.o){var u=a.value?a.value:new Uint8Array(0);(u=this.v.decode(u,{stream:!a.done}))&&(this.response=this.responseText+=u)}a.done?_i(this):yi(this),this.readyState==3&&Uu(this)}},n.Ra=function(a){this.g&&(this.response=this.responseText=a,_i(this))},n.Qa=function(a){this.g&&(this.response=a,_i(this))},n.ga=function(){this.g&&_i(this)};function _i(a){a.readyState=4,a.l=null,a.j=null,a.v=null,yi(a)}n.setRequestHeader=function(a,u){this.u.append(a,u)},n.getResponseHeader=function(a){return this.h&&this.h.get(a.toLowerCase())||""},n.getAllResponseHeaders=function(){if(!this.h)return"";const a=[],u=this.h.entries();for(var f=u.next();!f.done;)f=f.value,a.push(f[0]+": "+f[1]),f=u.next();return a.join(`\r
`)};function yi(a){a.onreadystatechange&&a.onreadystatechange.call(a)}Object.defineProperty(Wr.prototype,"withCredentials",{get:function(){return this.m==="include"},set:function(a){this.m=a?"include":"same-origin"}});function qu(a){let u="";return de(a,function(f,g){u+=g,u+=":",u+=f,u+=`\r
`}),u}function Ja(a,u,f){e:{for(g in f){var g=!1;break e}g=!0}g||(f=qu(f),typeof a=="string"?f!=null&&encodeURIComponent(String(f)):ve(a,u,f))}function Te(a){He.call(this),this.headers=new Map,this.o=a||null,this.h=!1,this.v=this.g=null,this.D="",this.m=0,this.l="",this.j=this.B=this.u=this.A=!1,this.I=null,this.H="",this.J=!1}C(Te,He);var Uy=/^https?$/i,qy=["POST","PUT"];n=Te.prototype,n.Ha=function(a){this.J=a},n.ea=function(a,u,f,g){if(this.g)throw Error("[goog.net.XhrIo] Object is active with another request="+this.D+"; newUri="+a);u=u?u.toUpperCase():"GET",this.D=a,this.l="",this.m=0,this.A=!1,this.h=!0,this.g=this.o?this.o.g():ja.g(),this.v=this.o?gu(this.o):gu(ja),this.g.onreadystatechange=m(this.Ea,this);try{this.B=!0,this.g.open(u,String(a),!0),this.B=!1}catch(A){Wu(this,A);return}if(a=f||"",f=new Map(this.headers),g)if(Object.getPrototypeOf(g)===Object.prototype)for(var b in g)f.set(b,g[b]);else if(typeof g.keys=="function"&&typeof g.get=="function")for(const A of g.keys())f.set(A,g.get(A));else throw Error("Unknown input type for opt_headers: "+String(g));g=Array.from(f.keys()).find(A=>A.toLowerCase()=="content-type"),b=l.FormData&&a instanceof l.FormData,!(0<=Array.prototype.indexOf.call(qy,u,void 0))||g||b||f.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");for(const[A,O]of f)this.g.setRequestHeader(A,O);this.H&&(this.g.responseType=this.H),"withCredentials"in this.g&&this.g.withCredentials!==this.J&&(this.g.withCredentials=this.J);try{zu(this),this.u=!0,this.g.send(a),this.u=!1}catch(A){Wu(this,A)}};function Wu(a,u){a.h=!1,a.g&&(a.j=!0,a.g.abort(),a.j=!1),a.l=u,a.m=5,$u(a),$r(a)}function $u(a){a.A||(a.A=!0,tt(a,"complete"),tt(a,"error"))}n.abort=function(a){this.g&&this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1,this.m=a||7,tt(this,"complete"),tt(this,"abort"),$r(this))},n.N=function(){this.g&&(this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1),$r(this,!0)),Te.aa.N.call(this)},n.Ea=function(){this.s||(this.B||this.u||this.j?ju(this):this.bb())},n.bb=function(){ju(this)};function ju(a){if(a.h&&typeof o<"u"&&(!a.v[1]||zt(a)!=4||a.Z()!=2)){if(a.u&&zt(a)==4)du(a.Ea,0,a);else if(tt(a,"readystatechange"),zt(a)==4){a.h=!1;try{const O=a.Z();e:switch(O){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:var u=!0;break e;default:u=!1}var f;if(!(f=u)){var g;if(g=O===0){var b=String(a.D).match(xu)[1]||null;!b&&l.self&&l.self.location&&(b=l.self.location.protocol.slice(0,-1)),g=!Uy.test(b?b.toLowerCase():"")}f=g}if(f)tt(a,"complete"),tt(a,"success");else{a.m=6;try{var A=2<zt(a)?a.g.statusText:""}catch{A=""}a.l=A+" ["+a.Z()+"]",$u(a)}}finally{$r(a)}}}}function $r(a,u){if(a.g){zu(a);const f=a.g,g=a.v[0]?()=>{}:null;a.g=null,a.v=null,u||tt(a,"ready");try{f.onreadystatechange=g}catch{}}}function zu(a){a.I&&(l.clearTimeout(a.I),a.I=null)}n.isActive=function(){return!!this.g};function zt(a){return a.g?a.g.readyState:0}n.Z=function(){try{return 2<zt(this)?this.g.status:-1}catch{return-1}},n.oa=function(){try{return this.g?this.g.responseText:""}catch{return""}},n.Oa=function(a){if(this.g){var u=this.g.responseText;return a&&u.indexOf(a)==0&&(u=u.substring(a.length)),vy(u)}};function Gu(a){try{if(!a.g)return null;if("response"in a.g)return a.g.response;switch(a.H){case"":case"text":return a.g.responseText;case"arraybuffer":if("mozResponseArrayBuffer"in a.g)return a.g.mozResponseArrayBuffer}return null}catch{return null}}function Wy(a){const u={};a=(a.g&&2<=zt(a)&&a.g.getAllResponseHeaders()||"").split(`\r
`);for(let g=0;g<a.length;g++){if(U(a[g]))continue;var f=T(a[g]);const b=f[0];if(f=f[1],typeof f!="string")continue;f=f.trim();const A=u[b]||[];u[b]=A,A.push(f)}I(u,function(g){return g.join(", ")})}n.Ba=function(){return this.m},n.Ka=function(){return typeof this.l=="string"?this.l:String(this.l)};function vi(a,u,f){return f&&f.internalChannelParams&&f.internalChannelParams[a]||u}function Hu(a){this.Aa=0,this.i=[],this.j=new di,this.ia=this.qa=this.I=this.W=this.g=this.ya=this.D=this.H=this.m=this.S=this.o=null,this.Ya=this.U=0,this.Va=vi("failFast",!1,a),this.F=this.C=this.u=this.s=this.l=null,this.X=!0,this.za=this.T=-1,this.Y=this.v=this.B=0,this.Ta=vi("baseRetryDelayMs",5e3,a),this.cb=vi("retryDelaySeedMs",1e4,a),this.Wa=vi("forwardChannelMaxRetries",2,a),this.wa=vi("forwardChannelRequestTimeoutMs",2e4,a),this.pa=a&&a.xmlHttpFactory||void 0,this.Xa=a&&a.Tb||void 0,this.Ca=a&&a.useFetchStreams||!1,this.L=void 0,this.J=a&&a.supportsCrossDomainXhr||!1,this.K="",this.h=new Au(a&&a.concurrentRequestLimit),this.Da=new Fy,this.P=a&&a.fastHandshake||!1,this.O=a&&a.encodeInitMessageHeaders||!1,this.P&&this.O&&(this.O=!1),this.Ua=a&&a.Rb||!1,a&&a.xa&&this.j.xa(),a&&a.forceLongPolling&&(this.X=!1),this.ba=!this.P&&this.X&&a&&a.detectBufferingProxy||!1,this.ja=void 0,a&&a.longPollingTimeout&&0<a.longPollingTimeout&&(this.ja=a.longPollingTimeout),this.ca=void 0,this.R=0,this.M=!1,this.ka=this.A=null}n=Hu.prototype,n.la=8,n.G=1,n.connect=function(a,u,f,g){nt(0),this.W=a,this.H=u||{},f&&g!==void 0&&(this.H.OSID=f,this.H.OAID=g),this.F=this.X,this.I=nd(this,null,this.W),zr(this)};function Xa(a){if(Ku(a),a.G==3){var u=a.U++,f=jt(a.I);if(ve(f,"SID",a.K),ve(f,"RID",u),ve(f,"TYPE","terminate"),Ei(a,f),u=new dn(a,a.j,u),u.L=2,u.v=Ur(jt(f)),f=!1,l.navigator&&l.navigator.sendBeacon)try{f=l.navigator.sendBeacon(u.v.toString(),"")}catch{}!f&&l.Image&&(new Image().src=u.v,f=!0),f||(u.g=sd(u.j,null),u.g.ea(u.v)),u.F=Date.now(),Vr(u)}td(a)}function jr(a){a.g&&(el(a),a.g.cancel(),a.g=null)}function Ku(a){jr(a),a.u&&(l.clearTimeout(a.u),a.u=null),Gr(a),a.h.cancel(),a.s&&(typeof a.s=="number"&&l.clearTimeout(a.s),a.s=null)}function zr(a){if(!ku(a.h)&&!a.s){a.s=!0;var u=a.Ga;Bt||ps(),cn||(Bt(),cn=!0),Ut.add(u,a),a.B=0}}function $y(a,u){return Pu(a.h)>=a.h.j-(a.s?1:0)?!1:a.s?(a.i=u.D.concat(a.i),!0):a.G==1||a.G==2||a.B>=(a.Va?0:a.Wa)?!1:(a.s=ui(m(a.Ga,a,u),ed(a,a.B)),a.B++,!0)}n.Ga=function(a){if(this.s)if(this.s=null,this.G==1){if(!a){this.U=Math.floor(1e5*Math.random()),a=this.U++;const b=new dn(this,this.j,a);let A=this.o;if(this.S&&(A?(A=_(A),w(A,this.S)):A=this.S),this.m!==null||this.O||(b.H=A,A=null),this.P)e:{for(var u=0,f=0;f<this.i.length;f++){t:{var g=this.i[f];if("__data__"in g.map&&(g=g.map.__data__,typeof g=="string")){g=g.length;break t}g=void 0}if(g===void 0)break;if(u+=g,4096<u){u=f;break e}if(u===4096||f===this.i.length-1){u=f+1;break e}}u=1e3}else u=1e3;u=Yu(this,b,u),f=jt(this.I),ve(f,"RID",a),ve(f,"CVER",22),this.D&&ve(f,"X-HTTP-Session-Id",this.D),Ei(this,f),A&&(this.O?u="headers="+encodeURIComponent(String(qu(A)))+"&"+u:this.m&&Ja(f,this.m,A)),Ya(this.h,b),this.Ua&&ve(f,"TYPE","init"),this.P?(ve(f,"$req",u),ve(f,"SID","null"),b.T=!0,Ga(b,f,null)):Ga(b,f,u),this.G=2}}else this.G==3&&(a?Qu(this,a):this.i.length==0||ku(this.h)||Qu(this))};function Qu(a,u){var f;u?f=u.l:f=a.U++;const g=jt(a.I);ve(g,"SID",a.K),ve(g,"RID",f),ve(g,"AID",a.T),Ei(a,g),a.m&&a.o&&Ja(g,a.m,a.o),f=new dn(a,a.j,f,a.B+1),a.m===null&&(f.H=a.o),u&&(a.i=u.D.concat(a.i)),u=Yu(a,f,1e3),f.I=Math.round(.5*a.wa)+Math.round(.5*a.wa*Math.random()),Ya(a.h,f),Ga(f,g,u)}function Ei(a,u){a.H&&de(a.H,function(f,g){ve(u,g,f)}),a.l&&Lu({},function(f,g){ve(u,g,f)})}function Yu(a,u,f){f=Math.min(a.i.length,f);var g=a.l?m(a.l.Na,a.l,a):null;e:{var b=a.i;let A=-1;for(;;){const O=["count="+f];A==-1?0<f?(A=b[0].g,O.push("ofs="+A)):A=0:O.push("ofs="+A);let pe=!0;for(let Fe=0;Fe<f;Fe++){let oe=b[Fe].g;const Ke=b[Fe].map;if(oe-=A,0>oe)A=Math.max(0,b[Fe].g-100),pe=!1;else try{By(Ke,O,"req"+oe+"_")}catch{g&&g(Ke)}}if(pe){g=O.join("&");break e}}}return a=a.i.splice(0,f),u.D=a,g}function Ju(a){if(!a.g&&!a.u){a.Y=1;var u=a.Fa;Bt||ps(),cn||(Bt(),cn=!0),Ut.add(u,a),a.v=0}}function Za(a){return a.g||a.u||3<=a.v?!1:(a.Y++,a.u=ui(m(a.Fa,a),ed(a,a.v)),a.v++,!0)}n.Fa=function(){if(this.u=null,Xu(this),this.ba&&!(this.M||this.g==null||0>=this.R)){var a=2*this.R;this.j.info("BP detection timer enabled: "+a),this.A=ui(m(this.ab,this),a)}},n.ab=function(){this.A&&(this.A=null,this.j.info("BP detection timeout reached."),this.j.info("Buffering proxy detected and switch to long-polling!"),this.F=!1,this.M=!0,nt(10),jr(this),Xu(this))};function el(a){a.A!=null&&(l.clearTimeout(a.A),a.A=null)}function Xu(a){a.g=new dn(a,a.j,"rpc",a.Y),a.m===null&&(a.g.H=a.o),a.g.O=0;var u=jt(a.qa);ve(u,"RID","rpc"),ve(u,"SID",a.K),ve(u,"AID",a.T),ve(u,"CI",a.F?"0":"1"),!a.F&&a.ja&&ve(u,"TO",a.ja),ve(u,"TYPE","xmlhttp"),Ei(a,u),a.m&&a.o&&Ja(u,a.m,a.o),a.L&&(a.g.I=a.L);var f=a.g;a=a.ia,f.L=1,f.v=Ur(jt(u)),f.m=null,f.P=!0,bu(f,a)}n.Za=function(){this.C!=null&&(this.C=null,jr(this),Za(this),nt(19))};function Gr(a){a.C!=null&&(l.clearTimeout(a.C),a.C=null)}function Zu(a,u){var f=null;if(a.g==u){Gr(a),el(a),a.g=null;var g=2}else if(Qa(a.h,u))f=u.D,Nu(a.h,u),g=1;else return;if(a.G!=0){if(u.o)if(g==1){f=u.m?u.m.length:0,u=Date.now()-u.F;var b=a.B;g=xr(),tt(g,new wu(g,f)),zr(a)}else Ju(a);else if(b=u.s,b==3||b==0&&0<u.X||!(g==1&&$y(a,u)||g==2&&Za(a)))switch(f&&0<f.length&&(u=a.h,u.i=u.i.concat(f)),b){case 1:$n(a,5);break;case 4:$n(a,10);break;case 3:$n(a,6);break;default:$n(a,2)}}}function ed(a,u){let f=a.Ta+Math.floor(Math.random()*a.cb);return a.isActive()||(f*=2),f*u}function $n(a,u){if(a.j.info("Error code "+u),u==2){var f=m(a.fb,a),g=a.Xa;const b=!g;g=new Wn(g||"//www.google.com/images/cleardot.gif"),l.location&&l.location.protocol=="http"||Fr(g,"https"),Ur(g),b?My(g.toString(),f):Vy(g.toString(),f)}else nt(2);a.G=0,a.l&&a.l.sa(u),td(a),Ku(a)}n.fb=function(a){a?(this.j.info("Successfully pinged google.com"),nt(2)):(this.j.info("Failed to ping google.com"),nt(1))};function td(a){if(a.G=0,a.ka=[],a.l){const u=Du(a.h);(u.length!=0||a.i.length!=0)&&(k(a.ka,u),k(a.ka,a.i),a.h.i.length=0,S(a.i),a.i.length=0),a.l.ra()}}function nd(a,u,f){var g=f instanceof Wn?jt(f):new Wn(f);if(g.g!="")u&&(g.g=u+"."+g.g),Br(g,g.s);else{var b=l.location;g=b.protocol,u=u?u+"."+b.hostname:b.hostname,b=+b.port;var A=new Wn(null);g&&Fr(A,g),u&&(A.g=u),b&&Br(A,b),f&&(A.l=f),g=A}return f=a.D,u=a.ya,f&&u&&ve(g,f,u),ve(g,"VER",a.la),Ei(a,g),g}function sd(a,u,f){if(u&&!a.J)throw Error("Can't create secondary domain capable XhrIo object.");return u=a.Ca&&!a.pa?new Te(new qr({eb:f})):new Te(a.pa),u.Ha(a.J),u}n.isActive=function(){return!!this.l&&this.l.isActive(this)};function id(){}n=id.prototype,n.ua=function(){},n.ta=function(){},n.sa=function(){},n.ra=function(){},n.isActive=function(){return!0},n.Na=function(){};function Hr(){}Hr.prototype.g=function(a,u){return new ht(a,u)};function ht(a,u){He.call(this),this.g=new Hu(u),this.l=a,this.h=u&&u.messageUrlParams||null,a=u&&u.messageHeaders||null,u&&u.clientProtocolHeaderRequired&&(a?a["X-Client-Protocol"]="webchannel":a={"X-Client-Protocol":"webchannel"}),this.g.o=a,a=u&&u.initMessageHeaders||null,u&&u.messageContentType&&(a?a["X-WebChannel-Content-Type"]=u.messageContentType:a={"X-WebChannel-Content-Type":u.messageContentType}),u&&u.va&&(a?a["X-WebChannel-Client-Profile"]=u.va:a={"X-WebChannel-Client-Profile":u.va}),this.g.S=a,(a=u&&u.Sb)&&!U(a)&&(this.g.m=a),this.v=u&&u.supportsCrossDomainXhr||!1,this.u=u&&u.sendRawJson||!1,(u=u&&u.httpSessionIdParam)&&!U(u)&&(this.g.D=u,a=this.h,a!==null&&u in a&&(a=this.h,u in a&&delete a[u])),this.j=new ws(this)}C(ht,He),ht.prototype.m=function(){this.g.l=this.j,this.v&&(this.g.J=!0),this.g.connect(this.l,this.h||void 0)},ht.prototype.close=function(){Xa(this.g)},ht.prototype.o=function(a){var u=this.g;if(typeof a=="string"){var f={};f.__data__=a,a=f}else this.u&&(f={},f.__data__=Ua(a),a=f);u.i.push(new Ry(u.Ya++,a)),u.G==3&&zr(u)},ht.prototype.N=function(){this.g.l=null,delete this.j,Xa(this.g),delete this.g,ht.aa.N.call(this)};function rd(a){Wa.call(this),a.__headers__&&(this.headers=a.__headers__,this.statusCode=a.__status__,delete a.__headers__,delete a.__status__);var u=a.__sm__;if(u){e:{for(const f in u){a=f;break e}a=void 0}(this.i=a)&&(a=this.i,u=u!==null&&a in u?u[a]:void 0),this.data=u}else this.data=a}C(rd,Wa);function od(){$a.call(this),this.status=1}C(od,$a);function ws(a){this.g=a}C(ws,id),ws.prototype.ua=function(){tt(this.g,"a")},ws.prototype.ta=function(a){tt(this.g,new rd(a))},ws.prototype.sa=function(a){tt(this.g,new od)},ws.prototype.ra=function(){tt(this.g,"b")},Hr.prototype.createWebChannel=Hr.prototype.g,ht.prototype.send=ht.prototype.o,ht.prototype.open=ht.prototype.m,ht.prototype.close=ht.prototype.close,vm=function(){return new Hr},ym=function(){return xr()},_m=Un,Wl={mb:0,pb:1,qb:2,Jb:3,Ob:4,Lb:5,Mb:6,Kb:7,Ib:8,Nb:9,PROXY:10,NOPROXY:11,Gb:12,Cb:13,Db:14,Bb:15,Eb:16,Fb:17,ib:18,hb:19,jb:20},Or.NO_ERROR=0,Or.TIMEOUT=8,Or.HTTP_ERROR=6,co=Or,Tu.COMPLETE="complete",gm=Tu,_u.EventType=ci,ci.OPEN="a",ci.CLOSE="b",ci.ERROR="c",ci.MESSAGE="d",He.prototype.listen=He.prototype.K,Di=_u,Te.prototype.listenOnce=Te.prototype.L,Te.prototype.getLastError=Te.prototype.Ka,Te.prototype.getLastErrorCode=Te.prototype.Ba,Te.prototype.getStatus=Te.prototype.Z,Te.prototype.getResponseJson=Te.prototype.Oa,Te.prototype.getResponseText=Te.prototype.oa,Te.prototype.send=Te.prototype.ea,Te.prototype.setWithCredentials=Te.prototype.Ha,mm=Te}).apply(typeof Yr<"u"?Yr:typeof self<"u"?self:typeof window<"u"?window:{});const Od="@firebase/firestore";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Je{constructor(e){this.uid=e}isAuthenticated(){return this.uid!=null}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(e){return e.uid===this.uid}}Je.UNAUTHENTICATED=new Je(null),Je.GOOGLE_CREDENTIALS=new Je("google-credentials-uid"),Je.FIRST_PARTY=new Je("first-party-uid"),Je.MOCK_USER=new Je("mock-user");/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Zs="10.14.0";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const es=new oa("@firebase/firestore");function wi(){return es.logLevel}function B(n,...e){if(es.logLevel<=te.DEBUG){const t=e.map(Fc);es.debug(`Firestore (${Zs}): ${n}`,...t)}}function rn(n,...e){if(es.logLevel<=te.ERROR){const t=e.map(Fc);es.error(`Firestore (${Zs}): ${n}`,...t)}}function Fs(n,...e){if(es.logLevel<=te.WARN){const t=e.map(Fc);es.warn(`Firestore (${Zs}): ${n}`,...t)}}function Fc(n){if(typeof n=="string")return n;try{/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
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
 */function j(n="Unexpected state"){const e=`FIRESTORE (${Zs}) INTERNAL ASSERTION FAILED: `+n;throw rn(e),new Error(e)}function re(n,e){n||j()}function Q(n,e){return n}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const P={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};class M extends ln{constructor(e,t){super(e,t),this.code=e,this.message=t,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Nt{constructor(){this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Em{constructor(e,t){this.user=t,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${e}`)}}class RT{getToken(){return Promise.resolve(null)}invalidateToken(){}start(e,t){e.enqueueRetryable(()=>t(Je.UNAUTHENTICATED))}shutdown(){}}class ST{constructor(e){this.token=e,this.changeListener=null}getToken(){return Promise.resolve(this.token)}invalidateToken(){}start(e,t){this.changeListener=t,e.enqueueRetryable(()=>t(this.token.user))}shutdown(){this.changeListener=null}}class AT{constructor(e){this.t=e,this.currentUser=Je.UNAUTHENTICATED,this.i=0,this.forceRefresh=!1,this.auth=null}start(e,t){re(this.o===void 0);let s=this.i;const i=c=>this.i!==s?(s=this.i,t(c)):Promise.resolve();let r=new Nt;this.o=()=>{this.i++,this.currentUser=this.u(),r.resolve(),r=new Nt,e.enqueueRetryable(()=>i(this.currentUser))};const o=()=>{const c=r;e.enqueueRetryable(async()=>{await c.promise,await i(this.currentUser)})},l=c=>{B("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=c,this.o&&(this.auth.addAuthTokenListener(this.o),o())};this.t.onInit(c=>l(c)),setTimeout(()=>{if(!this.auth){const c=this.t.getImmediate({optional:!0});c?l(c):(B("FirebaseAuthCredentialsProvider","Auth not yet detected"),r.resolve(),r=new Nt)}},0),o()}getToken(){const e=this.i,t=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(t).then(s=>this.i!==e?(B("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):s?(re(typeof s.accessToken=="string"),new Em(s.accessToken,this.currentUser)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.o&&this.auth.removeAuthTokenListener(this.o),this.o=void 0}u(){const e=this.auth&&this.auth.getUid();return re(e===null||typeof e=="string"),new Je(e)}}class kT{constructor(e,t,s){this.l=e,this.h=t,this.P=s,this.type="FirstParty",this.user=Je.FIRST_PARTY,this.I=new Map}T(){return this.P?this.P():null}get headers(){this.I.set("X-Goog-AuthUser",this.l);const e=this.T();return e&&this.I.set("Authorization",e),this.h&&this.I.set("X-Goog-Iam-Authorization-Token",this.h),this.I}}class PT{constructor(e,t,s){this.l=e,this.h=t,this.P=s}getToken(){return Promise.resolve(new kT(this.l,this.h,this.P))}start(e,t){e.enqueueRetryable(()=>t(Je.FIRST_PARTY))}shutdown(){}invalidateToken(){}}class NT{constructor(e){this.value=e,this.type="AppCheck",this.headers=new Map,e&&e.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class DT{constructor(e){this.A=e,this.forceRefresh=!1,this.appCheck=null,this.R=null}start(e,t){re(this.o===void 0);const s=r=>{r.error!=null&&B("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${r.error.message}`);const o=r.token!==this.R;return this.R=r.token,B("FirebaseAppCheckTokenProvider",`Received ${o?"new":"existing"} token.`),o?t(r.token):Promise.resolve()};this.o=r=>{e.enqueueRetryable(()=>s(r))};const i=r=>{B("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=r,this.o&&this.appCheck.addTokenListener(this.o)};this.A.onInit(r=>i(r)),setTimeout(()=>{if(!this.appCheck){const r=this.A.getImmediate({optional:!0});r?i(r):B("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}},0)}getToken(){const e=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(e).then(t=>t?(re(typeof t.token=="string"),this.R=t.token,new NT(t.token)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.o&&this.appCheck.removeTokenListener(this.o),this.o=void 0}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function LT(n){const e=typeof self<"u"&&(self.crypto||self.msCrypto),t=new Uint8Array(n);if(e&&typeof e.getRandomValues=="function")e.getRandomValues(t);else for(let s=0;s<n;s++)t[s]=Math.floor(256*Math.random());return t}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class wm{static newId(){const e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",t=Math.floor(256/e.length)*e.length;let s="";for(;s.length<20;){const i=LT(40);for(let r=0;r<i.length;++r)s.length<20&&i[r]<t&&(s+=e.charAt(i[r]%e.length))}return s}}function ae(n,e){return n<e?-1:n>e?1:0}function Bs(n,e,t){return n.length===e.length&&n.every((s,i)=>t(s,e[i]))}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class De{constructor(e,t){if(this.seconds=e,this.nanoseconds=t,t<0)throw new M(P.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(t>=1e9)throw new M(P.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(e<-62135596800)throw new M(P.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e);if(e>=253402300800)throw new M(P.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e)}static now(){return De.fromMillis(Date.now())}static fromDate(e){return De.fromMillis(e.getTime())}static fromMillis(e){const t=Math.floor(e/1e3),s=Math.floor(1e6*(e-1e3*t));return new De(t,s)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/1e6}_compareTo(e){return this.seconds===e.seconds?ae(this.nanoseconds,e.nanoseconds):ae(this.seconds,e.seconds)}isEqual(e){return e.seconds===this.seconds&&e.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{seconds:this.seconds,nanoseconds:this.nanoseconds}}valueOf(){const e=this.seconds- -62135596800;return String(e).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class H{constructor(e){this.timestamp=e}static fromTimestamp(e){return new H(e)}static min(){return new H(new De(0,0))}static max(){return new H(new De(253402300799,999999999))}compareTo(e){return this.timestamp._compareTo(e.timestamp)}isEqual(e){return this.timestamp.isEqual(e.timestamp)}toMicroseconds(){return 1e6*this.timestamp.seconds+this.timestamp.nanoseconds/1e3}toString(){return"SnapshotVersion("+this.timestamp.toString()+")"}toTimestamp(){return this.timestamp}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ji{constructor(e,t,s){t===void 0?t=0:t>e.length&&j(),s===void 0?s=e.length-t:s>e.length-t&&j(),this.segments=e,this.offset=t,this.len=s}get length(){return this.len}isEqual(e){return Ji.comparator(this,e)===0}child(e){const t=this.segments.slice(this.offset,this.limit());return e instanceof Ji?e.forEach(s=>{t.push(s)}):t.push(e),this.construct(t)}limit(){return this.offset+this.length}popFirst(e){return e=e===void 0?1:e,this.construct(this.segments,this.offset+e,this.length-e)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(e){return this.segments[this.offset+e]}isEmpty(){return this.length===0}isPrefixOf(e){if(e.length<this.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}isImmediateParentOf(e){if(this.length+1!==e.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}forEach(e){for(let t=this.offset,s=this.limit();t<s;t++)e(this.segments[t])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(e,t){const s=Math.min(e.length,t.length);for(let i=0;i<s;i++){const r=e.get(i),o=t.get(i);if(r<o)return-1;if(r>o)return 1}return e.length<t.length?-1:e.length>t.length?1:0}}class me extends Ji{construct(e,t,s){return new me(e,t,s)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...e){const t=[];for(const s of e){if(s.indexOf("//")>=0)throw new M(P.INVALID_ARGUMENT,`Invalid segment (${s}). Paths must not contain // in them.`);t.push(...s.split("/").filter(i=>i.length>0))}return new me(t)}static emptyPath(){return new me([])}}const xT=/^[_a-zA-Z][_a-zA-Z0-9]*$/;class qe extends Ji{construct(e,t,s){return new qe(e,t,s)}static isValidIdentifier(e){return xT.test(e)}canonicalString(){return this.toArray().map(e=>(e=e.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),qe.isValidIdentifier(e)||(e="`"+e+"`"),e)).join(".")}toString(){return this.canonicalString()}isKeyField(){return this.length===1&&this.get(0)==="__name__"}static keyField(){return new qe(["__name__"])}static fromServerFormat(e){const t=[];let s="",i=0;const r=()=>{if(s.length===0)throw new M(P.INVALID_ARGUMENT,`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);t.push(s),s=""};let o=!1;for(;i<e.length;){const l=e[i];if(l==="\\"){if(i+1===e.length)throw new M(P.INVALID_ARGUMENT,"Path has trailing escape character: "+e);const c=e[i+1];if(c!=="\\"&&c!=="."&&c!=="`")throw new M(P.INVALID_ARGUMENT,"Path has invalid escape sequence: "+e);s+=c,i+=2}else l==="`"?(o=!o,i++):l!=="."||o?(s+=l,i++):(r(),i++)}if(r(),o)throw new M(P.INVALID_ARGUMENT,"Unterminated ` in path: "+e);return new qe(t)}static emptyPath(){return new qe([])}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class W{constructor(e){this.path=e}static fromPath(e){return new W(me.fromString(e))}static fromName(e){return new W(me.fromString(e).popFirst(5))}static empty(){return new W(me.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(e){return this.path.length>=2&&this.path.get(this.path.length-2)===e}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(e){return e!==null&&me.comparator(this.path,e.path)===0}toString(){return this.path.toString()}static comparator(e,t){return me.comparator(e.path,t.path)}static isDocumentKey(e){return e.length%2==0}static fromSegments(e){return new W(new me(e.slice()))}}function OT(n,e){const t=n.toTimestamp().seconds,s=n.toTimestamp().nanoseconds+1,i=H.fromTimestamp(s===1e9?new De(t+1,0):new De(t,s));return new Nn(i,W.empty(),e)}function MT(n){return new Nn(n.readTime,n.key,-1)}class Nn{constructor(e,t,s){this.readTime=e,this.documentKey=t,this.largestBatchId=s}static min(){return new Nn(H.min(),W.empty(),-1)}static max(){return new Nn(H.max(),W.empty(),-1)}}function VT(n,e){let t=n.readTime.compareTo(e.readTime);return t!==0?t:(t=W.comparator(n.documentKey,e.documentKey),t!==0?t:ae(n.largestBatchId,e.largestBatchId))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const FT="The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.";class BT{constructor(){this.onCommittedListeners=[]}addOnCommittedListener(e){this.onCommittedListeners.push(e)}raiseOnCommittedEvent(){this.onCommittedListeners.forEach(e=>e())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function mr(n){if(n.code!==P.FAILED_PRECONDITION||n.message!==FT)throw n;B("LocalStore","Unexpectedly lost primary lease")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class N{constructor(e){this.nextCallback=null,this.catchCallback=null,this.result=void 0,this.error=void 0,this.isDone=!1,this.callbackAttached=!1,e(t=>{this.isDone=!0,this.result=t,this.nextCallback&&this.nextCallback(t)},t=>{this.isDone=!0,this.error=t,this.catchCallback&&this.catchCallback(t)})}catch(e){return this.next(void 0,e)}next(e,t){return this.callbackAttached&&j(),this.callbackAttached=!0,this.isDone?this.error?this.wrapFailure(t,this.error):this.wrapSuccess(e,this.result):new N((s,i)=>{this.nextCallback=r=>{this.wrapSuccess(e,r).next(s,i)},this.catchCallback=r=>{this.wrapFailure(t,r).next(s,i)}})}toPromise(){return new Promise((e,t)=>{this.next(e,t)})}wrapUserFunction(e){try{const t=e();return t instanceof N?t:N.resolve(t)}catch(t){return N.reject(t)}}wrapSuccess(e,t){return e?this.wrapUserFunction(()=>e(t)):N.resolve(t)}wrapFailure(e,t){return e?this.wrapUserFunction(()=>e(t)):N.reject(t)}static resolve(e){return new N((t,s)=>{t(e)})}static reject(e){return new N((t,s)=>{s(e)})}static waitFor(e){return new N((t,s)=>{let i=0,r=0,o=!1;e.forEach(l=>{++i,l.next(()=>{++r,o&&r===i&&t()},c=>s(c))}),o=!0,r===i&&t()})}static or(e){let t=N.resolve(!1);for(const s of e)t=t.next(i=>i?N.resolve(i):s());return t}static forEach(e,t){const s=[];return e.forEach((i,r)=>{s.push(t.call(this,i,r))}),this.waitFor(s)}static mapArray(e,t){return new N((s,i)=>{const r=e.length,o=new Array(r);let l=0;for(let c=0;c<r;c++){const h=c;t(e[h]).next(d=>{o[h]=d,++l,l===r&&s(o)},d=>i(d))}})}static doWhile(e,t){return new N((s,i)=>{const r=()=>{e()===!0?t().next(()=>{r()},i):s()};r()})}}function UT(n){const e=n.match(/Android ([\d.]+)/i),t=e?e[1].split(".").slice(0,2).join("."):"-1";return Number(t)}function gr(n){return n.name==="IndexedDbTransactionError"}/**
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
 */class Bc{constructor(e,t){this.previousValue=e,t&&(t.sequenceNumberHandler=s=>this.ie(s),this.se=s=>t.writeSequenceNumber(s))}ie(e){return this.previousValue=Math.max(e,this.previousValue),this.previousValue}next(){const e=++this.previousValue;return this.se&&this.se(e),e}}Bc.oe=-1;function _r(n){return n==null}function No(n){return n===0&&1/n==-1/0}function qT(n){return typeof n=="number"&&Number.isInteger(n)&&!No(n)&&n<=Number.MAX_SAFE_INTEGER&&n>=Number.MIN_SAFE_INTEGER}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Md(n){let e=0;for(const t in n)Object.prototype.hasOwnProperty.call(n,t)&&e++;return e}function ls(n,e){for(const t in n)Object.prototype.hasOwnProperty.call(n,t)&&e(t,n[t])}function Tm(n){for(const e in n)if(Object.prototype.hasOwnProperty.call(n,e))return!1;return!0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Ae=class $l{constructor(e,t){this.comparator=e,this.root=t||bn.EMPTY}insert(e,t){return new $l(this.comparator,this.root.insert(e,t,this.comparator).copy(null,null,bn.BLACK,null,null))}remove(e){return new $l(this.comparator,this.root.remove(e,this.comparator).copy(null,null,bn.BLACK,null,null))}get(e){let t=this.root;for(;!t.isEmpty();){const s=this.comparator(e,t.key);if(s===0)return t.value;s<0?t=t.left:s>0&&(t=t.right)}return null}indexOf(e){let t=0,s=this.root;for(;!s.isEmpty();){const i=this.comparator(e,s.key);if(i===0)return t+s.left.size;i<0?s=s.left:(t+=s.left.size+1,s=s.right)}return-1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(e){return this.root.inorderTraversal(e)}forEach(e){this.inorderTraversal((t,s)=>(e(t,s),!1))}toString(){const e=[];return this.inorderTraversal((t,s)=>(e.push(`${t}:${s}`),!1)),`{${e.join(", ")}}`}reverseTraversal(e){return this.root.reverseTraversal(e)}getIterator(){return new Jr(this.root,null,this.comparator,!1)}getIteratorFrom(e){return new Jr(this.root,e,this.comparator,!1)}getReverseIterator(){return new Jr(this.root,null,this.comparator,!0)}getReverseIteratorFrom(e){return new Jr(this.root,e,this.comparator,!0)}},Jr=class{constructor(e,t,s,i){this.isReverse=i,this.nodeStack=[];let r=1;for(;!e.isEmpty();)if(r=t?s(e.key,t):1,t&&i&&(r*=-1),r<0)e=this.isReverse?e.left:e.right;else{if(r===0){this.nodeStack.push(e);break}this.nodeStack.push(e),e=this.isReverse?e.right:e.left}}getNext(){let e=this.nodeStack.pop();const t={key:e.key,value:e.value};if(this.isReverse)for(e=e.left;!e.isEmpty();)this.nodeStack.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack.push(e),e=e.left;return t}hasNext(){return this.nodeStack.length>0}peek(){if(this.nodeStack.length===0)return null;const e=this.nodeStack[this.nodeStack.length-1];return{key:e.key,value:e.value}}},bn=class Kt{constructor(e,t,s,i,r){this.key=e,this.value=t,this.color=s??Kt.RED,this.left=i??Kt.EMPTY,this.right=r??Kt.EMPTY,this.size=this.left.size+1+this.right.size}copy(e,t,s,i,r){return new Kt(e??this.key,t??this.value,s??this.color,i??this.left,r??this.right)}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,t,s){let i=this;const r=s(e,i.key);return i=r<0?i.copy(null,null,null,i.left.insert(e,t,s),null):r===0?i.copy(null,t,null,null,null):i.copy(null,null,null,null,i.right.insert(e,t,s)),i.fixUp()}removeMin(){if(this.left.isEmpty())return Kt.EMPTY;let e=this;return e.left.isRed()||e.left.left.isRed()||(e=e.moveRedLeft()),e=e.copy(null,null,null,e.left.removeMin(),null),e.fixUp()}remove(e,t){let s,i=this;if(t(e,i.key)<0)i.left.isEmpty()||i.left.isRed()||i.left.left.isRed()||(i=i.moveRedLeft()),i=i.copy(null,null,null,i.left.remove(e,t),null);else{if(i.left.isRed()&&(i=i.rotateRight()),i.right.isEmpty()||i.right.isRed()||i.right.left.isRed()||(i=i.moveRedRight()),t(e,i.key)===0){if(i.right.isEmpty())return Kt.EMPTY;s=i.right.min(),i=i.copy(s.key,s.value,null,null,i.right.removeMin())}i=i.copy(null,null,null,null,i.right.remove(e,t))}return i.fixUp()}isRed(){return this.color}fixUp(){let e=this;return e.right.isRed()&&!e.left.isRed()&&(e=e.rotateLeft()),e.left.isRed()&&e.left.left.isRed()&&(e=e.rotateRight()),e.left.isRed()&&e.right.isRed()&&(e=e.colorFlip()),e}moveRedLeft(){let e=this.colorFlip();return e.right.left.isRed()&&(e=e.copy(null,null,null,null,e.right.rotateRight()),e=e.rotateLeft(),e=e.colorFlip()),e}moveRedRight(){let e=this.colorFlip();return e.left.left.isRed()&&(e=e.rotateRight(),e=e.colorFlip()),e}rotateLeft(){const e=this.copy(null,null,Kt.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight(){const e=this.copy(null,null,Kt.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip(){const e=this.left.copy(null,null,!this.left.color,null,null),t=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,t)}checkMaxDepth(){const e=this.check();return Math.pow(2,e)<=this.size+1}check(){if(this.isRed()&&this.left.isRed()||this.right.isRed())throw j();const e=this.left.check();if(e!==this.right.check())throw j();return e+(this.isRed()?0:1)}};bn.EMPTY=null,bn.RED=!0,bn.BLACK=!1;bn.EMPTY=new class{constructor(){this.size=0}get key(){throw j()}get value(){throw j()}get color(){throw j()}get left(){throw j()}get right(){throw j()}copy(e,t,s,i,r){return this}insert(e,t,s){return new bn(e,t)}remove(e,t){return this}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class We{constructor(e){this.comparator=e,this.data=new Ae(this.comparator)}has(e){return this.data.get(e)!==null}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(e){return this.data.indexOf(e)}forEach(e){this.data.inorderTraversal((t,s)=>(e(t),!1))}forEachInRange(e,t){const s=this.data.getIteratorFrom(e[0]);for(;s.hasNext();){const i=s.getNext();if(this.comparator(i.key,e[1])>=0)return;t(i.key)}}forEachWhile(e,t){let s;for(s=t!==void 0?this.data.getIteratorFrom(t):this.data.getIterator();s.hasNext();)if(!e(s.getNext().key))return}firstAfterOrEqual(e){const t=this.data.getIteratorFrom(e);return t.hasNext()?t.getNext().key:null}getIterator(){return new Vd(this.data.getIterator())}getIteratorFrom(e){return new Vd(this.data.getIteratorFrom(e))}add(e){return this.copy(this.data.remove(e).insert(e,!0))}delete(e){return this.has(e)?this.copy(this.data.remove(e)):this}isEmpty(){return this.data.isEmpty()}unionWith(e){let t=this;return t.size<e.size&&(t=e,e=this),e.forEach(s=>{t=t.add(s)}),t}isEqual(e){if(!(e instanceof We)||this.size!==e.size)return!1;const t=this.data.getIterator(),s=e.data.getIterator();for(;t.hasNext();){const i=t.getNext().key,r=s.getNext().key;if(this.comparator(i,r)!==0)return!1}return!0}toArray(){const e=[];return this.forEach(t=>{e.push(t)}),e}toString(){const e=[];return this.forEach(t=>e.push(t)),"SortedSet("+e.toString()+")"}copy(e){const t=new We(this.comparator);return t.data=e,t}}class Vd{constructor(e){this.iter=e}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class dt{constructor(e){this.fields=e,e.sort(qe.comparator)}static empty(){return new dt([])}unionWith(e){let t=new We(qe.comparator);for(const s of this.fields)t=t.add(s);for(const s of e)t=t.add(s);return new dt(t.toArray())}covers(e){for(const t of this.fields)if(t.isPrefixOf(e))return!0;return!1}isEqual(e){return Bs(this.fields,e.fields,(t,s)=>t.isEqual(s))}}/**
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
 */class Im extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $e{constructor(e){this.binaryString=e}static fromBase64String(e){const t=function(i){try{return atob(i)}catch(r){throw typeof DOMException<"u"&&r instanceof DOMException?new Im("Invalid base64 string: "+r):r}}(e);return new $e(t)}static fromUint8Array(e){const t=function(i){let r="";for(let o=0;o<i.length;++o)r+=String.fromCharCode(i[o]);return r}(e);return new $e(t)}[Symbol.iterator](){let e=0;return{next:()=>e<this.binaryString.length?{value:this.binaryString.charCodeAt(e++),done:!1}:{value:void 0,done:!0}}}toBase64(){return function(t){return btoa(t)}(this.binaryString)}toUint8Array(){return function(t){const s=new Uint8Array(t.length);for(let i=0;i<t.length;i++)s[i]=t.charCodeAt(i);return s}(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(e){return ae(this.binaryString,e.binaryString)}isEqual(e){return this.binaryString===e.binaryString}}$e.EMPTY_BYTE_STRING=new $e("");const WT=new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);function Dn(n){if(re(!!n),typeof n=="string"){let e=0;const t=WT.exec(n);if(re(!!t),t[1]){let i=t[1];i=(i+"000000000").substr(0,9),e=Number(i)}const s=new Date(n);return{seconds:Math.floor(s.getTime()/1e3),nanos:e}}return{seconds:Ce(n.seconds),nanos:Ce(n.nanos)}}function Ce(n){return typeof n=="number"?n:typeof n=="string"?Number(n):0}function ts(n){return typeof n=="string"?$e.fromBase64String(n):$e.fromUint8Array(n)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Uc(n){var e,t;return((t=(((e=n==null?void 0:n.mapValue)===null||e===void 0?void 0:e.fields)||{}).__type__)===null||t===void 0?void 0:t.stringValue)==="server_timestamp"}function qc(n){const e=n.mapValue.fields.__previous_value__;return Uc(e)?qc(e):e}function Xi(n){const e=Dn(n.mapValue.fields.__local_write_time__.timestampValue);return new De(e.seconds,e.nanos)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $T{constructor(e,t,s,i,r,o,l,c,h){this.databaseId=e,this.appId=t,this.persistenceKey=s,this.host=i,this.ssl=r,this.forceLongPolling=o,this.autoDetectLongPolling=l,this.longPollingOptions=c,this.useFetchStreams=h}}class Zi{constructor(e,t){this.projectId=e,this.database=t||"(default)"}static empty(){return new Zi("","")}get isDefaultDatabase(){return this.database==="(default)"}isEqual(e){return e instanceof Zi&&e.projectId===this.projectId&&e.database===this.database}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Xr={mapValue:{}};function ns(n){return"nullValue"in n?0:"booleanValue"in n?1:"integerValue"in n||"doubleValue"in n?2:"timestampValue"in n?3:"stringValue"in n?5:"bytesValue"in n?6:"referenceValue"in n?7:"geoPointValue"in n?8:"arrayValue"in n?9:"mapValue"in n?Uc(n)?4:zT(n)?9007199254740991:jT(n)?10:11:j()}function xt(n,e){if(n===e)return!0;const t=ns(n);if(t!==ns(e))return!1;switch(t){case 0:case 9007199254740991:return!0;case 1:return n.booleanValue===e.booleanValue;case 4:return Xi(n).isEqual(Xi(e));case 3:return function(i,r){if(typeof i.timestampValue=="string"&&typeof r.timestampValue=="string"&&i.timestampValue.length===r.timestampValue.length)return i.timestampValue===r.timestampValue;const o=Dn(i.timestampValue),l=Dn(r.timestampValue);return o.seconds===l.seconds&&o.nanos===l.nanos}(n,e);case 5:return n.stringValue===e.stringValue;case 6:return function(i,r){return ts(i.bytesValue).isEqual(ts(r.bytesValue))}(n,e);case 7:return n.referenceValue===e.referenceValue;case 8:return function(i,r){return Ce(i.geoPointValue.latitude)===Ce(r.geoPointValue.latitude)&&Ce(i.geoPointValue.longitude)===Ce(r.geoPointValue.longitude)}(n,e);case 2:return function(i,r){if("integerValue"in i&&"integerValue"in r)return Ce(i.integerValue)===Ce(r.integerValue);if("doubleValue"in i&&"doubleValue"in r){const o=Ce(i.doubleValue),l=Ce(r.doubleValue);return o===l?No(o)===No(l):isNaN(o)&&isNaN(l)}return!1}(n,e);case 9:return Bs(n.arrayValue.values||[],e.arrayValue.values||[],xt);case 10:case 11:return function(i,r){const o=i.mapValue.fields||{},l=r.mapValue.fields||{};if(Md(o)!==Md(l))return!1;for(const c in o)if(o.hasOwnProperty(c)&&(l[c]===void 0||!xt(o[c],l[c])))return!1;return!0}(n,e);default:return j()}}function er(n,e){return(n.values||[]).find(t=>xt(t,e))!==void 0}function Us(n,e){if(n===e)return 0;const t=ns(n),s=ns(e);if(t!==s)return ae(t,s);switch(t){case 0:case 9007199254740991:return 0;case 1:return ae(n.booleanValue,e.booleanValue);case 2:return function(r,o){const l=Ce(r.integerValue||r.doubleValue),c=Ce(o.integerValue||o.doubleValue);return l<c?-1:l>c?1:l===c?0:isNaN(l)?isNaN(c)?0:-1:1}(n,e);case 3:return Fd(n.timestampValue,e.timestampValue);case 4:return Fd(Xi(n),Xi(e));case 5:return ae(n.stringValue,e.stringValue);case 6:return function(r,o){const l=ts(r),c=ts(o);return l.compareTo(c)}(n.bytesValue,e.bytesValue);case 7:return function(r,o){const l=r.split("/"),c=o.split("/");for(let h=0;h<l.length&&h<c.length;h++){const d=ae(l[h],c[h]);if(d!==0)return d}return ae(l.length,c.length)}(n.referenceValue,e.referenceValue);case 8:return function(r,o){const l=ae(Ce(r.latitude),Ce(o.latitude));return l!==0?l:ae(Ce(r.longitude),Ce(o.longitude))}(n.geoPointValue,e.geoPointValue);case 9:return Bd(n.arrayValue,e.arrayValue);case 10:return function(r,o){var l,c,h,d;const p=r.fields||{},m=o.fields||{},E=(l=p.value)===null||l===void 0?void 0:l.arrayValue,C=(c=m.value)===null||c===void 0?void 0:c.arrayValue,S=ae(((h=E==null?void 0:E.values)===null||h===void 0?void 0:h.length)||0,((d=C==null?void 0:C.values)===null||d===void 0?void 0:d.length)||0);return S!==0?S:Bd(E,C)}(n.mapValue,e.mapValue);case 11:return function(r,o){if(r===Xr.mapValue&&o===Xr.mapValue)return 0;if(r===Xr.mapValue)return 1;if(o===Xr.mapValue)return-1;const l=r.fields||{},c=Object.keys(l),h=o.fields||{},d=Object.keys(h);c.sort(),d.sort();for(let p=0;p<c.length&&p<d.length;++p){const m=ae(c[p],d[p]);if(m!==0)return m;const E=Us(l[c[p]],h[d[p]]);if(E!==0)return E}return ae(c.length,d.length)}(n.mapValue,e.mapValue);default:throw j()}}function Fd(n,e){if(typeof n=="string"&&typeof e=="string"&&n.length===e.length)return ae(n,e);const t=Dn(n),s=Dn(e),i=ae(t.seconds,s.seconds);return i!==0?i:ae(t.nanos,s.nanos)}function Bd(n,e){const t=n.values||[],s=e.values||[];for(let i=0;i<t.length&&i<s.length;++i){const r=Us(t[i],s[i]);if(r)return r}return ae(t.length,s.length)}function qs(n){return jl(n)}function jl(n){return"nullValue"in n?"null":"booleanValue"in n?""+n.booleanValue:"integerValue"in n?""+n.integerValue:"doubleValue"in n?""+n.doubleValue:"timestampValue"in n?function(t){const s=Dn(t);return`time(${s.seconds},${s.nanos})`}(n.timestampValue):"stringValue"in n?n.stringValue:"bytesValue"in n?function(t){return ts(t).toBase64()}(n.bytesValue):"referenceValue"in n?function(t){return W.fromName(t).toString()}(n.referenceValue):"geoPointValue"in n?function(t){return`geo(${t.latitude},${t.longitude})`}(n.geoPointValue):"arrayValue"in n?function(t){let s="[",i=!0;for(const r of t.values||[])i?i=!1:s+=",",s+=jl(r);return s+"]"}(n.arrayValue):"mapValue"in n?function(t){const s=Object.keys(t.fields||{}).sort();let i="{",r=!0;for(const o of s)r?r=!1:i+=",",i+=`${o}:${jl(t.fields[o])}`;return i+"}"}(n.mapValue):j()}function Ud(n,e){return{referenceValue:`projects/${n.projectId}/databases/${n.database}/documents/${e.path.canonicalString()}`}}function zl(n){return!!n&&"integerValue"in n}function Wc(n){return!!n&&"arrayValue"in n}function qd(n){return!!n&&"nullValue"in n}function Wd(n){return!!n&&"doubleValue"in n&&isNaN(Number(n.doubleValue))}function ho(n){return!!n&&"mapValue"in n}function jT(n){var e,t;return((t=(((e=n==null?void 0:n.mapValue)===null||e===void 0?void 0:e.fields)||{}).__type__)===null||t===void 0?void 0:t.stringValue)==="__vector__"}function Vi(n){if(n.geoPointValue)return{geoPointValue:Object.assign({},n.geoPointValue)};if(n.timestampValue&&typeof n.timestampValue=="object")return{timestampValue:Object.assign({},n.timestampValue)};if(n.mapValue){const e={mapValue:{fields:{}}};return ls(n.mapValue.fields,(t,s)=>e.mapValue.fields[t]=Vi(s)),e}if(n.arrayValue){const e={arrayValue:{values:[]}};for(let t=0;t<(n.arrayValue.values||[]).length;++t)e.arrayValue.values[t]=Vi(n.arrayValue.values[t]);return e}return Object.assign({},n)}function zT(n){return(((n.mapValue||{}).fields||{}).__type__||{}).stringValue==="__max__"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class it{constructor(e){this.value=e}static empty(){return new it({mapValue:{}})}field(e){if(e.isEmpty())return this.value;{let t=this.value;for(let s=0;s<e.length-1;++s)if(t=(t.mapValue.fields||{})[e.get(s)],!ho(t))return null;return t=(t.mapValue.fields||{})[e.lastSegment()],t||null}}set(e,t){this.getFieldsMap(e.popLast())[e.lastSegment()]=Vi(t)}setAll(e){let t=qe.emptyPath(),s={},i=[];e.forEach((o,l)=>{if(!t.isImmediateParentOf(l)){const c=this.getFieldsMap(t);this.applyChanges(c,s,i),s={},i=[],t=l.popLast()}o?s[l.lastSegment()]=Vi(o):i.push(l.lastSegment())});const r=this.getFieldsMap(t);this.applyChanges(r,s,i)}delete(e){const t=this.field(e.popLast());ho(t)&&t.mapValue.fields&&delete t.mapValue.fields[e.lastSegment()]}isEqual(e){return xt(this.value,e.value)}getFieldsMap(e){let t=this.value;t.mapValue.fields||(t.mapValue={fields:{}});for(let s=0;s<e.length;++s){let i=t.mapValue.fields[e.get(s)];ho(i)&&i.mapValue.fields||(i={mapValue:{fields:{}}},t.mapValue.fields[e.get(s)]=i),t=i}return t.mapValue.fields}applyChanges(e,t,s){ls(t,(i,r)=>e[i]=r);for(const i of s)delete e[i]}clone(){return new it(Vi(this.value))}}function Cm(n){const e=[];return ls(n.fields,(t,s)=>{const i=new qe([t]);if(ho(s)){const r=Cm(s.mapValue).fields;if(r.length===0)e.push(i);else for(const o of r)e.push(i.child(o))}else e.push(i)}),new dt(e)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ve{constructor(e,t,s,i,r,o,l){this.key=e,this.documentType=t,this.version=s,this.readTime=i,this.createTime=r,this.data=o,this.documentState=l}static newInvalidDocument(e){return new Ve(e,0,H.min(),H.min(),H.min(),it.empty(),0)}static newFoundDocument(e,t,s,i){return new Ve(e,1,t,H.min(),s,i,0)}static newNoDocument(e,t){return new Ve(e,2,t,H.min(),H.min(),it.empty(),0)}static newUnknownDocument(e,t){return new Ve(e,3,t,H.min(),H.min(),it.empty(),2)}convertToFoundDocument(e,t){return!this.createTime.isEqual(H.min())||this.documentType!==2&&this.documentType!==0||(this.createTime=e),this.version=e,this.documentType=1,this.data=t,this.documentState=0,this}convertToNoDocument(e){return this.version=e,this.documentType=2,this.data=it.empty(),this.documentState=0,this}convertToUnknownDocument(e){return this.version=e,this.documentType=3,this.data=it.empty(),this.documentState=2,this}setHasCommittedMutations(){return this.documentState=2,this}setHasLocalMutations(){return this.documentState=1,this.version=H.min(),this}setReadTime(e){return this.readTime=e,this}get hasLocalMutations(){return this.documentState===1}get hasCommittedMutations(){return this.documentState===2}get hasPendingWrites(){return this.hasLocalMutations||this.hasCommittedMutations}isValidDocument(){return this.documentType!==0}isFoundDocument(){return this.documentType===1}isNoDocument(){return this.documentType===2}isUnknownDocument(){return this.documentType===3}isEqual(e){return e instanceof Ve&&this.key.isEqual(e.key)&&this.version.isEqual(e.version)&&this.documentType===e.documentType&&this.documentState===e.documentState&&this.data.isEqual(e.data)}mutableCopy(){return new Ve(this.key,this.documentType,this.version,this.readTime,this.createTime,this.data.clone(),this.documentState)}toString(){return`Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`}}/**
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
 */class Do{constructor(e,t){this.position=e,this.inclusive=t}}function $d(n,e,t){let s=0;for(let i=0;i<n.position.length;i++){const r=e[i],o=n.position[i];if(r.field.isKeyField()?s=W.comparator(W.fromName(o.referenceValue),t.key):s=Us(o,t.data.field(r.field)),r.dir==="desc"&&(s*=-1),s!==0)break}return s}function jd(n,e){if(n===null)return e===null;if(e===null||n.inclusive!==e.inclusive||n.position.length!==e.position.length)return!1;for(let t=0;t<n.position.length;t++)if(!xt(n.position[t],e.position[t]))return!1;return!0}/**
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
 */class Lo{constructor(e,t="asc"){this.field=e,this.dir=t}}function GT(n,e){return n.dir===e.dir&&n.field.isEqual(e.field)}/**
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
 */class bm{}class Re extends bm{constructor(e,t,s){super(),this.field=e,this.op=t,this.value=s}static create(e,t,s){return e.isKeyField()?t==="in"||t==="not-in"?this.createKeyFieldInFilter(e,t,s):new KT(e,t,s):t==="array-contains"?new JT(e,s):t==="in"?new XT(e,s):t==="not-in"?new ZT(e,s):t==="array-contains-any"?new eI(e,s):new Re(e,t,s)}static createKeyFieldInFilter(e,t,s){return t==="in"?new QT(e,s):new YT(e,s)}matches(e){const t=e.data.field(this.field);return this.op==="!="?t!==null&&this.matchesComparison(Us(t,this.value)):t!==null&&ns(this.value)===ns(t)&&this.matchesComparison(Us(t,this.value))}matchesComparison(e){switch(this.op){case"<":return e<0;case"<=":return e<=0;case"==":return e===0;case"!=":return e!==0;case">":return e>0;case">=":return e>=0;default:return j()}}isInequality(){return["<","<=",">",">=","!=","not-in"].indexOf(this.op)>=0}getFlattenedFilters(){return[this]}getFilters(){return[this]}}class At extends bm{constructor(e,t){super(),this.filters=e,this.op=t,this.ae=null}static create(e,t){return new At(e,t)}matches(e){return Rm(this)?this.filters.find(t=>!t.matches(e))===void 0:this.filters.find(t=>t.matches(e))!==void 0}getFlattenedFilters(){return this.ae!==null||(this.ae=this.filters.reduce((e,t)=>e.concat(t.getFlattenedFilters()),[])),this.ae}getFilters(){return Object.assign([],this.filters)}}function Rm(n){return n.op==="and"}function Sm(n){return HT(n)&&Rm(n)}function HT(n){for(const e of n.filters)if(e instanceof At)return!1;return!0}function Gl(n){if(n instanceof Re)return n.field.canonicalString()+n.op.toString()+qs(n.value);if(Sm(n))return n.filters.map(e=>Gl(e)).join(",");{const e=n.filters.map(t=>Gl(t)).join(",");return`${n.op}(${e})`}}function Am(n,e){return n instanceof Re?function(s,i){return i instanceof Re&&s.op===i.op&&s.field.isEqual(i.field)&&xt(s.value,i.value)}(n,e):n instanceof At?function(s,i){return i instanceof At&&s.op===i.op&&s.filters.length===i.filters.length?s.filters.reduce((r,o,l)=>r&&Am(o,i.filters[l]),!0):!1}(n,e):void j()}function km(n){return n instanceof Re?function(t){return`${t.field.canonicalString()} ${t.op} ${qs(t.value)}`}(n):n instanceof At?function(t){return t.op.toString()+" {"+t.getFilters().map(km).join(" ,")+"}"}(n):"Filter"}class KT extends Re{constructor(e,t,s){super(e,t,s),this.key=W.fromName(s.referenceValue)}matches(e){const t=W.comparator(e.key,this.key);return this.matchesComparison(t)}}class QT extends Re{constructor(e,t){super(e,"in",t),this.keys=Pm("in",t)}matches(e){return this.keys.some(t=>t.isEqual(e.key))}}class YT extends Re{constructor(e,t){super(e,"not-in",t),this.keys=Pm("not-in",t)}matches(e){return!this.keys.some(t=>t.isEqual(e.key))}}function Pm(n,e){var t;return(((t=e.arrayValue)===null||t===void 0?void 0:t.values)||[]).map(s=>W.fromName(s.referenceValue))}class JT extends Re{constructor(e,t){super(e,"array-contains",t)}matches(e){const t=e.data.field(this.field);return Wc(t)&&er(t.arrayValue,this.value)}}class XT extends Re{constructor(e,t){super(e,"in",t)}matches(e){const t=e.data.field(this.field);return t!==null&&er(this.value.arrayValue,t)}}class ZT extends Re{constructor(e,t){super(e,"not-in",t)}matches(e){if(er(this.value.arrayValue,{nullValue:"NULL_VALUE"}))return!1;const t=e.data.field(this.field);return t!==null&&!er(this.value.arrayValue,t)}}class eI extends Re{constructor(e,t){super(e,"array-contains-any",t)}matches(e){const t=e.data.field(this.field);return!(!Wc(t)||!t.arrayValue.values)&&t.arrayValue.values.some(s=>er(this.value.arrayValue,s))}}/**
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
 */class tI{constructor(e,t=null,s=[],i=[],r=null,o=null,l=null){this.path=e,this.collectionGroup=t,this.orderBy=s,this.filters=i,this.limit=r,this.startAt=o,this.endAt=l,this.ue=null}}function zd(n,e=null,t=[],s=[],i=null,r=null,o=null){return new tI(n,e,t,s,i,r,o)}function $c(n){const e=Q(n);if(e.ue===null){let t=e.path.canonicalString();e.collectionGroup!==null&&(t+="|cg:"+e.collectionGroup),t+="|f:",t+=e.filters.map(s=>Gl(s)).join(","),t+="|ob:",t+=e.orderBy.map(s=>function(r){return r.field.canonicalString()+r.dir}(s)).join(","),_r(e.limit)||(t+="|l:",t+=e.limit),e.startAt&&(t+="|lb:",t+=e.startAt.inclusive?"b:":"a:",t+=e.startAt.position.map(s=>qs(s)).join(",")),e.endAt&&(t+="|ub:",t+=e.endAt.inclusive?"a:":"b:",t+=e.endAt.position.map(s=>qs(s)).join(",")),e.ue=t}return e.ue}function jc(n,e){if(n.limit!==e.limit||n.orderBy.length!==e.orderBy.length)return!1;for(let t=0;t<n.orderBy.length;t++)if(!GT(n.orderBy[t],e.orderBy[t]))return!1;if(n.filters.length!==e.filters.length)return!1;for(let t=0;t<n.filters.length;t++)if(!Am(n.filters[t],e.filters[t]))return!1;return n.collectionGroup===e.collectionGroup&&!!n.path.isEqual(e.path)&&!!jd(n.startAt,e.startAt)&&jd(n.endAt,e.endAt)}function Hl(n){return W.isDocumentKey(n.path)&&n.collectionGroup===null&&n.filters.length===0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yr{constructor(e,t=null,s=[],i=[],r=null,o="F",l=null,c=null){this.path=e,this.collectionGroup=t,this.explicitOrderBy=s,this.filters=i,this.limit=r,this.limitType=o,this.startAt=l,this.endAt=c,this.ce=null,this.le=null,this.he=null,this.startAt,this.endAt}}function nI(n,e,t,s,i,r,o,l){return new yr(n,e,t,s,i,r,o,l)}function zc(n){return new yr(n)}function Gd(n){return n.filters.length===0&&n.limit===null&&n.startAt==null&&n.endAt==null&&(n.explicitOrderBy.length===0||n.explicitOrderBy.length===1&&n.explicitOrderBy[0].field.isKeyField())}function Nm(n){return n.collectionGroup!==null}function Fi(n){const e=Q(n);if(e.ce===null){e.ce=[];const t=new Set;for(const r of e.explicitOrderBy)e.ce.push(r),t.add(r.field.canonicalString());const s=e.explicitOrderBy.length>0?e.explicitOrderBy[e.explicitOrderBy.length-1].dir:"asc";(function(o){let l=new We(qe.comparator);return o.filters.forEach(c=>{c.getFlattenedFilters().forEach(h=>{h.isInequality()&&(l=l.add(h.field))})}),l})(e).forEach(r=>{t.has(r.canonicalString())||r.isKeyField()||e.ce.push(new Lo(r,s))}),t.has(qe.keyField().canonicalString())||e.ce.push(new Lo(qe.keyField(),s))}return e.ce}function Dt(n){const e=Q(n);return e.le||(e.le=sI(e,Fi(n))),e.le}function sI(n,e){if(n.limitType==="F")return zd(n.path,n.collectionGroup,e,n.filters,n.limit,n.startAt,n.endAt);{e=e.map(i=>{const r=i.dir==="desc"?"asc":"desc";return new Lo(i.field,r)});const t=n.endAt?new Do(n.endAt.position,n.endAt.inclusive):null,s=n.startAt?new Do(n.startAt.position,n.startAt.inclusive):null;return zd(n.path,n.collectionGroup,e,n.filters,n.limit,t,s)}}function Kl(n,e){const t=n.filters.concat([e]);return new yr(n.path,n.collectionGroup,n.explicitOrderBy.slice(),t,n.limit,n.limitType,n.startAt,n.endAt)}function xo(n,e,t){return new yr(n.path,n.collectionGroup,n.explicitOrderBy.slice(),n.filters.slice(),e,t,n.startAt,n.endAt)}function ua(n,e){return jc(Dt(n),Dt(e))&&n.limitType===e.limitType}function Dm(n){return`${$c(Dt(n))}|lt:${n.limitType}`}function bs(n){return`Query(target=${function(t){let s=t.path.canonicalString();return t.collectionGroup!==null&&(s+=" collectionGroup="+t.collectionGroup),t.filters.length>0&&(s+=`, filters: [${t.filters.map(i=>km(i)).join(", ")}]`),_r(t.limit)||(s+=", limit: "+t.limit),t.orderBy.length>0&&(s+=`, orderBy: [${t.orderBy.map(i=>function(o){return`${o.field.canonicalString()} (${o.dir})`}(i)).join(", ")}]`),t.startAt&&(s+=", startAt: ",s+=t.startAt.inclusive?"b:":"a:",s+=t.startAt.position.map(i=>qs(i)).join(",")),t.endAt&&(s+=", endAt: ",s+=t.endAt.inclusive?"a:":"b:",s+=t.endAt.position.map(i=>qs(i)).join(",")),`Target(${s})`}(Dt(n))}; limitType=${n.limitType})`}function da(n,e){return e.isFoundDocument()&&function(s,i){const r=i.key.path;return s.collectionGroup!==null?i.key.hasCollectionId(s.collectionGroup)&&s.path.isPrefixOf(r):W.isDocumentKey(s.path)?s.path.isEqual(r):s.path.isImmediateParentOf(r)}(n,e)&&function(s,i){for(const r of Fi(s))if(!r.field.isKeyField()&&i.data.field(r.field)===null)return!1;return!0}(n,e)&&function(s,i){for(const r of s.filters)if(!r.matches(i))return!1;return!0}(n,e)&&function(s,i){return!(s.startAt&&!function(o,l,c){const h=$d(o,l,c);return o.inclusive?h<=0:h<0}(s.startAt,Fi(s),i)||s.endAt&&!function(o,l,c){const h=$d(o,l,c);return o.inclusive?h>=0:h>0}(s.endAt,Fi(s),i))}(n,e)}function iI(n){return n.collectionGroup||(n.path.length%2==1?n.path.lastSegment():n.path.get(n.path.length-2))}function Lm(n){return(e,t)=>{let s=!1;for(const i of Fi(n)){const r=rI(i,e,t);if(r!==0)return r;s=s||i.field.isKeyField()}return 0}}function rI(n,e,t){const s=n.field.isKeyField()?W.comparator(e.key,t.key):function(r,o,l){const c=o.data.field(r),h=l.data.field(r);return c!==null&&h!==null?Us(c,h):j()}(n.field,e,t);switch(n.dir){case"asc":return s;case"desc":return-1*s;default:return j()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ei{constructor(e,t){this.mapKeyFn=e,this.equalsFn=t,this.inner={},this.innerSize=0}get(e){const t=this.mapKeyFn(e),s=this.inner[t];if(s!==void 0){for(const[i,r]of s)if(this.equalsFn(i,e))return r}}has(e){return this.get(e)!==void 0}set(e,t){const s=this.mapKeyFn(e),i=this.inner[s];if(i===void 0)return this.inner[s]=[[e,t]],void this.innerSize++;for(let r=0;r<i.length;r++)if(this.equalsFn(i[r][0],e))return void(i[r]=[e,t]);i.push([e,t]),this.innerSize++}delete(e){const t=this.mapKeyFn(e),s=this.inner[t];if(s===void 0)return!1;for(let i=0;i<s.length;i++)if(this.equalsFn(s[i][0],e))return s.length===1?delete this.inner[t]:s.splice(i,1),this.innerSize--,!0;return!1}forEach(e){ls(this.inner,(t,s)=>{for(const[i,r]of s)e(i,r)})}isEmpty(){return Tm(this.inner)}size(){return this.innerSize}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const oI=new Ae(W.comparator);function on(){return oI}const xm=new Ae(W.comparator);function Li(...n){let e=xm;for(const t of n)e=e.insert(t.key,t);return e}function Om(n){let e=xm;return n.forEach((t,s)=>e=e.insert(t,s.overlayedDocument)),e}function Hn(){return Bi()}function Mm(){return Bi()}function Bi(){return new ei(n=>n.toString(),(n,e)=>n.isEqual(e))}const aI=new Ae(W.comparator),lI=new We(W.comparator);function ne(...n){let e=lI;for(const t of n)e=e.add(t);return e}const cI=new We(ae);function hI(){return cI}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Gc(n,e){if(n.useProto3Json){if(isNaN(e))return{doubleValue:"NaN"};if(e===1/0)return{doubleValue:"Infinity"};if(e===-1/0)return{doubleValue:"-Infinity"}}return{doubleValue:No(e)?"-0":e}}function Vm(n){return{integerValue:""+n}}function uI(n,e){return qT(e)?Vm(e):Gc(n,e)}/**
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
 */class fa{constructor(){this._=void 0}}function dI(n,e,t){return n instanceof Oo?function(i,r){const o={fields:{__type__:{stringValue:"server_timestamp"},__local_write_time__:{timestampValue:{seconds:i.seconds,nanos:i.nanoseconds}}}};return r&&Uc(r)&&(r=qc(r)),r&&(o.fields.__previous_value__=r),{mapValue:o}}(t,e):n instanceof tr?Bm(n,e):n instanceof nr?Um(n,e):function(i,r){const o=Fm(i,r),l=Hd(o)+Hd(i.Pe);return zl(o)&&zl(i.Pe)?Vm(l):Gc(i.serializer,l)}(n,e)}function fI(n,e,t){return n instanceof tr?Bm(n,e):n instanceof nr?Um(n,e):t}function Fm(n,e){return n instanceof Mo?function(s){return zl(s)||function(r){return!!r&&"doubleValue"in r}(s)}(e)?e:{integerValue:0}:null}class Oo extends fa{}class tr extends fa{constructor(e){super(),this.elements=e}}function Bm(n,e){const t=qm(e);for(const s of n.elements)t.some(i=>xt(i,s))||t.push(s);return{arrayValue:{values:t}}}class nr extends fa{constructor(e){super(),this.elements=e}}function Um(n,e){let t=qm(e);for(const s of n.elements)t=t.filter(i=>!xt(i,s));return{arrayValue:{values:t}}}class Mo extends fa{constructor(e,t){super(),this.serializer=e,this.Pe=t}}function Hd(n){return Ce(n.integerValue||n.doubleValue)}function qm(n){return Wc(n)&&n.arrayValue.values?n.arrayValue.values.slice():[]}function pI(n,e){return n.field.isEqual(e.field)&&function(s,i){return s instanceof tr&&i instanceof tr||s instanceof nr&&i instanceof nr?Bs(s.elements,i.elements,xt):s instanceof Mo&&i instanceof Mo?xt(s.Pe,i.Pe):s instanceof Oo&&i instanceof Oo}(n.transform,e.transform)}class mI{constructor(e,t){this.version=e,this.transformResults=t}}class rt{constructor(e,t){this.updateTime=e,this.exists=t}static none(){return new rt}static exists(e){return new rt(void 0,e)}static updateTime(e){return new rt(e)}get isNone(){return this.updateTime===void 0&&this.exists===void 0}isEqual(e){return this.exists===e.exists&&(this.updateTime?!!e.updateTime&&this.updateTime.isEqual(e.updateTime):!e.updateTime)}}function uo(n,e){return n.updateTime!==void 0?e.isFoundDocument()&&e.version.isEqual(n.updateTime):n.exists===void 0||n.exists===e.isFoundDocument()}class pa{}function Wm(n,e){if(!n.hasLocalMutations||e&&e.fields.length===0)return null;if(e===null)return n.isNoDocument()?new Hc(n.key,rt.none()):new vr(n.key,n.data,rt.none());{const t=n.data,s=it.empty();let i=new We(qe.comparator);for(let r of e.fields)if(!i.has(r)){let o=t.field(r);o===null&&r.length>1&&(r=r.popLast(),o=t.field(r)),o===null?s.delete(r):s.set(r,o),i=i.add(r)}return new Fn(n.key,s,new dt(i.toArray()),rt.none())}}function gI(n,e,t){n instanceof vr?function(i,r,o){const l=i.value.clone(),c=Qd(i.fieldTransforms,r,o.transformResults);l.setAll(c),r.convertToFoundDocument(o.version,l).setHasCommittedMutations()}(n,e,t):n instanceof Fn?function(i,r,o){if(!uo(i.precondition,r))return void r.convertToUnknownDocument(o.version);const l=Qd(i.fieldTransforms,r,o.transformResults),c=r.data;c.setAll($m(i)),c.setAll(l),r.convertToFoundDocument(o.version,c).setHasCommittedMutations()}(n,e,t):function(i,r,o){r.convertToNoDocument(o.version).setHasCommittedMutations()}(0,e,t)}function Ui(n,e,t,s){return n instanceof vr?function(r,o,l,c){if(!uo(r.precondition,o))return l;const h=r.value.clone(),d=Yd(r.fieldTransforms,c,o);return h.setAll(d),o.convertToFoundDocument(o.version,h).setHasLocalMutations(),null}(n,e,t,s):n instanceof Fn?function(r,o,l,c){if(!uo(r.precondition,o))return l;const h=Yd(r.fieldTransforms,c,o),d=o.data;return d.setAll($m(r)),d.setAll(h),o.convertToFoundDocument(o.version,d).setHasLocalMutations(),l===null?null:l.unionWith(r.fieldMask.fields).unionWith(r.fieldTransforms.map(p=>p.field))}(n,e,t,s):function(r,o,l){return uo(r.precondition,o)?(o.convertToNoDocument(o.version).setHasLocalMutations(),null):l}(n,e,t)}function _I(n,e){let t=null;for(const s of n.fieldTransforms){const i=e.data.field(s.field),r=Fm(s.transform,i||null);r!=null&&(t===null&&(t=it.empty()),t.set(s.field,r))}return t||null}function Kd(n,e){return n.type===e.type&&!!n.key.isEqual(e.key)&&!!n.precondition.isEqual(e.precondition)&&!!function(s,i){return s===void 0&&i===void 0||!(!s||!i)&&Bs(s,i,(r,o)=>pI(r,o))}(n.fieldTransforms,e.fieldTransforms)&&(n.type===0?n.value.isEqual(e.value):n.type!==1||n.data.isEqual(e.data)&&n.fieldMask.isEqual(e.fieldMask))}class vr extends pa{constructor(e,t,s,i=[]){super(),this.key=e,this.value=t,this.precondition=s,this.fieldTransforms=i,this.type=0}getFieldMask(){return null}}class Fn extends pa{constructor(e,t,s,i,r=[]){super(),this.key=e,this.data=t,this.fieldMask=s,this.precondition=i,this.fieldTransforms=r,this.type=1}getFieldMask(){return this.fieldMask}}function $m(n){const e=new Map;return n.fieldMask.fields.forEach(t=>{if(!t.isEmpty()){const s=n.data.field(t);e.set(t,s)}}),e}function Qd(n,e,t){const s=new Map;re(n.length===t.length);for(let i=0;i<t.length;i++){const r=n[i],o=r.transform,l=e.data.field(r.field);s.set(r.field,fI(o,l,t[i]))}return s}function Yd(n,e,t){const s=new Map;for(const i of n){const r=i.transform,o=t.data.field(i.field);s.set(i.field,dI(r,o,e))}return s}class Hc extends pa{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=2,this.fieldTransforms=[]}getFieldMask(){return null}}class jm extends pa{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=3,this.fieldTransforms=[]}getFieldMask(){return null}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yI{constructor(e,t,s,i){this.batchId=e,this.localWriteTime=t,this.baseMutations=s,this.mutations=i}applyToRemoteDocument(e,t){const s=t.mutationResults;for(let i=0;i<this.mutations.length;i++){const r=this.mutations[i];r.key.isEqual(e.key)&&gI(r,e,s[i])}}applyToLocalView(e,t){for(const s of this.baseMutations)s.key.isEqual(e.key)&&(t=Ui(s,e,t,this.localWriteTime));for(const s of this.mutations)s.key.isEqual(e.key)&&(t=Ui(s,e,t,this.localWriteTime));return t}applyToLocalDocumentSet(e,t){const s=Mm();return this.mutations.forEach(i=>{const r=e.get(i.key),o=r.overlayedDocument;let l=this.applyToLocalView(o,r.mutatedFields);l=t.has(i.key)?null:l;const c=Wm(o,l);c!==null&&s.set(i.key,c),o.isValidDocument()||o.convertToNoDocument(H.min())}),s}keys(){return this.mutations.reduce((e,t)=>e.add(t.key),ne())}isEqual(e){return this.batchId===e.batchId&&Bs(this.mutations,e.mutations,(t,s)=>Kd(t,s))&&Bs(this.baseMutations,e.baseMutations,(t,s)=>Kd(t,s))}}class Kc{constructor(e,t,s,i){this.batch=e,this.commitVersion=t,this.mutationResults=s,this.docVersions=i}static from(e,t,s){re(e.mutations.length===s.length);let i=function(){return aI}();const r=e.mutations;for(let o=0;o<r.length;o++)i=i.insert(r[o].key,s[o].version);return new Kc(e,t,s,i)}}/**
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
 */class vI{constructor(e,t){this.largestBatchId=e,this.mutation=t}getKey(){return this.mutation.key}isEqual(e){return e!==null&&this.mutation===e.mutation}toString(){return`Overlay{
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
 */class EI{constructor(e,t){this.count=e,this.unchangedNames=t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var be,ie;function zm(n){switch(n){default:return j();case P.CANCELLED:case P.UNKNOWN:case P.DEADLINE_EXCEEDED:case P.RESOURCE_EXHAUSTED:case P.INTERNAL:case P.UNAVAILABLE:case P.UNAUTHENTICATED:return!1;case P.INVALID_ARGUMENT:case P.NOT_FOUND:case P.ALREADY_EXISTS:case P.PERMISSION_DENIED:case P.FAILED_PRECONDITION:case P.ABORTED:case P.OUT_OF_RANGE:case P.UNIMPLEMENTED:case P.DATA_LOSS:return!0}}function Gm(n){if(n===void 0)return rn("GRPC error has no .code"),P.UNKNOWN;switch(n){case be.OK:return P.OK;case be.CANCELLED:return P.CANCELLED;case be.UNKNOWN:return P.UNKNOWN;case be.DEADLINE_EXCEEDED:return P.DEADLINE_EXCEEDED;case be.RESOURCE_EXHAUSTED:return P.RESOURCE_EXHAUSTED;case be.INTERNAL:return P.INTERNAL;case be.UNAVAILABLE:return P.UNAVAILABLE;case be.UNAUTHENTICATED:return P.UNAUTHENTICATED;case be.INVALID_ARGUMENT:return P.INVALID_ARGUMENT;case be.NOT_FOUND:return P.NOT_FOUND;case be.ALREADY_EXISTS:return P.ALREADY_EXISTS;case be.PERMISSION_DENIED:return P.PERMISSION_DENIED;case be.FAILED_PRECONDITION:return P.FAILED_PRECONDITION;case be.ABORTED:return P.ABORTED;case be.OUT_OF_RANGE:return P.OUT_OF_RANGE;case be.UNIMPLEMENTED:return P.UNIMPLEMENTED;case be.DATA_LOSS:return P.DATA_LOSS;default:return j()}}(ie=be||(be={}))[ie.OK=0]="OK",ie[ie.CANCELLED=1]="CANCELLED",ie[ie.UNKNOWN=2]="UNKNOWN",ie[ie.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",ie[ie.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",ie[ie.NOT_FOUND=5]="NOT_FOUND",ie[ie.ALREADY_EXISTS=6]="ALREADY_EXISTS",ie[ie.PERMISSION_DENIED=7]="PERMISSION_DENIED",ie[ie.UNAUTHENTICATED=16]="UNAUTHENTICATED",ie[ie.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",ie[ie.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",ie[ie.ABORTED=10]="ABORTED",ie[ie.OUT_OF_RANGE=11]="OUT_OF_RANGE",ie[ie.UNIMPLEMENTED=12]="UNIMPLEMENTED",ie[ie.INTERNAL=13]="INTERNAL",ie[ie.UNAVAILABLE=14]="UNAVAILABLE",ie[ie.DATA_LOSS=15]="DATA_LOSS";/**
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
 */function wI(){return new TextEncoder}/**
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
 */const TI=new Yn([4294967295,4294967295],0);function Jd(n){const e=wI().encode(n),t=new pm;return t.update(e),new Uint8Array(t.digest())}function Xd(n){const e=new DataView(n.buffer),t=e.getUint32(0,!0),s=e.getUint32(4,!0),i=e.getUint32(8,!0),r=e.getUint32(12,!0);return[new Yn([t,s],0),new Yn([i,r],0)]}class Qc{constructor(e,t,s){if(this.bitmap=e,this.padding=t,this.hashCount=s,t<0||t>=8)throw new xi(`Invalid padding: ${t}`);if(s<0)throw new xi(`Invalid hash count: ${s}`);if(e.length>0&&this.hashCount===0)throw new xi(`Invalid hash count: ${s}`);if(e.length===0&&t!==0)throw new xi(`Invalid padding when bitmap length is 0: ${t}`);this.Ie=8*e.length-t,this.Te=Yn.fromNumber(this.Ie)}Ee(e,t,s){let i=e.add(t.multiply(Yn.fromNumber(s)));return i.compare(TI)===1&&(i=new Yn([i.getBits(0),i.getBits(1)],0)),i.modulo(this.Te).toNumber()}de(e){return(this.bitmap[Math.floor(e/8)]&1<<e%8)!=0}mightContain(e){if(this.Ie===0)return!1;const t=Jd(e),[s,i]=Xd(t);for(let r=0;r<this.hashCount;r++){const o=this.Ee(s,i,r);if(!this.de(o))return!1}return!0}static create(e,t,s){const i=e%8==0?0:8-e%8,r=new Uint8Array(Math.ceil(e/8)),o=new Qc(r,i,t);return s.forEach(l=>o.insert(l)),o}insert(e){if(this.Ie===0)return;const t=Jd(e),[s,i]=Xd(t);for(let r=0;r<this.hashCount;r++){const o=this.Ee(s,i,r);this.Ae(o)}}Ae(e){const t=Math.floor(e/8),s=e%8;this.bitmap[t]|=1<<s}}class xi extends Error{constructor(){super(...arguments),this.name="BloomFilterError"}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ma{constructor(e,t,s,i,r){this.snapshotVersion=e,this.targetChanges=t,this.targetMismatches=s,this.documentUpdates=i,this.resolvedLimboDocuments=r}static createSynthesizedRemoteEventForCurrentChange(e,t,s){const i=new Map;return i.set(e,Er.createSynthesizedTargetChangeForCurrentChange(e,t,s)),new ma(H.min(),i,new Ae(ae),on(),ne())}}class Er{constructor(e,t,s,i,r){this.resumeToken=e,this.current=t,this.addedDocuments=s,this.modifiedDocuments=i,this.removedDocuments=r}static createSynthesizedTargetChangeForCurrentChange(e,t,s){return new Er(s,t,ne(),ne(),ne())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fo{constructor(e,t,s,i){this.Re=e,this.removedTargetIds=t,this.key=s,this.Ve=i}}class Hm{constructor(e,t){this.targetId=e,this.me=t}}class Km{constructor(e,t,s=$e.EMPTY_BYTE_STRING,i=null){this.state=e,this.targetIds=t,this.resumeToken=s,this.cause=i}}class Zd{constructor(){this.fe=0,this.ge=tf(),this.pe=$e.EMPTY_BYTE_STRING,this.ye=!1,this.we=!0}get current(){return this.ye}get resumeToken(){return this.pe}get Se(){return this.fe!==0}get be(){return this.we}De(e){e.approximateByteSize()>0&&(this.we=!0,this.pe=e)}ve(){let e=ne(),t=ne(),s=ne();return this.ge.forEach((i,r)=>{switch(r){case 0:e=e.add(i);break;case 2:t=t.add(i);break;case 1:s=s.add(i);break;default:j()}}),new Er(this.pe,this.ye,e,t,s)}Ce(){this.we=!1,this.ge=tf()}Fe(e,t){this.we=!0,this.ge=this.ge.insert(e,t)}Me(e){this.we=!0,this.ge=this.ge.remove(e)}xe(){this.fe+=1}Oe(){this.fe-=1,re(this.fe>=0)}Ne(){this.we=!0,this.ye=!0}}class II{constructor(e){this.Le=e,this.Be=new Map,this.ke=on(),this.qe=ef(),this.Qe=new Ae(ae)}Ke(e){for(const t of e.Re)e.Ve&&e.Ve.isFoundDocument()?this.$e(t,e.Ve):this.Ue(t,e.key,e.Ve);for(const t of e.removedTargetIds)this.Ue(t,e.key,e.Ve)}We(e){this.forEachTarget(e,t=>{const s=this.Ge(t);switch(e.state){case 0:this.ze(t)&&s.De(e.resumeToken);break;case 1:s.Oe(),s.Se||s.Ce(),s.De(e.resumeToken);break;case 2:s.Oe(),s.Se||this.removeTarget(t);break;case 3:this.ze(t)&&(s.Ne(),s.De(e.resumeToken));break;case 4:this.ze(t)&&(this.je(t),s.De(e.resumeToken));break;default:j()}})}forEachTarget(e,t){e.targetIds.length>0?e.targetIds.forEach(t):this.Be.forEach((s,i)=>{this.ze(i)&&t(i)})}He(e){const t=e.targetId,s=e.me.count,i=this.Je(t);if(i){const r=i.target;if(Hl(r))if(s===0){const o=new W(r.path);this.Ue(t,o,Ve.newNoDocument(o,H.min()))}else re(s===1);else{const o=this.Ye(t);if(o!==s){const l=this.Ze(e),c=l?this.Xe(l,e,o):1;if(c!==0){this.je(t);const h=c===2?"TargetPurposeExistenceFilterMismatchBloom":"TargetPurposeExistenceFilterMismatch";this.Qe=this.Qe.insert(t,h)}}}}}Ze(e){const t=e.me.unchangedNames;if(!t||!t.bits)return null;const{bits:{bitmap:s="",padding:i=0},hashCount:r=0}=t;let o,l;try{o=ts(s).toUint8Array()}catch(c){if(c instanceof Im)return Fs("Decoding the base64 bloom filter in existence filter failed ("+c.message+"); ignoring the bloom filter and falling back to full re-query."),null;throw c}try{l=new Qc(o,i,r)}catch(c){return Fs(c instanceof xi?"BloomFilter error: ":"Applying bloom filter failed: ",c),null}return l.Ie===0?null:l}Xe(e,t,s){return t.me.count===s-this.nt(e,t.targetId)?0:2}nt(e,t){const s=this.Le.getRemoteKeysForTarget(t);let i=0;return s.forEach(r=>{const o=this.Le.tt(),l=`projects/${o.projectId}/databases/${o.database}/documents/${r.path.canonicalString()}`;e.mightContain(l)||(this.Ue(t,r,null),i++)}),i}rt(e){const t=new Map;this.Be.forEach((r,o)=>{const l=this.Je(o);if(l){if(r.current&&Hl(l.target)){const c=new W(l.target.path);this.ke.get(c)!==null||this.it(o,c)||this.Ue(o,c,Ve.newNoDocument(c,e))}r.be&&(t.set(o,r.ve()),r.Ce())}});let s=ne();this.qe.forEach((r,o)=>{let l=!0;o.forEachWhile(c=>{const h=this.Je(c);return!h||h.purpose==="TargetPurposeLimboResolution"||(l=!1,!1)}),l&&(s=s.add(r))}),this.ke.forEach((r,o)=>o.setReadTime(e));const i=new ma(e,t,this.Qe,this.ke,s);return this.ke=on(),this.qe=ef(),this.Qe=new Ae(ae),i}$e(e,t){if(!this.ze(e))return;const s=this.it(e,t.key)?2:0;this.Ge(e).Fe(t.key,s),this.ke=this.ke.insert(t.key,t),this.qe=this.qe.insert(t.key,this.st(t.key).add(e))}Ue(e,t,s){if(!this.ze(e))return;const i=this.Ge(e);this.it(e,t)?i.Fe(t,1):i.Me(t),this.qe=this.qe.insert(t,this.st(t).delete(e)),s&&(this.ke=this.ke.insert(t,s))}removeTarget(e){this.Be.delete(e)}Ye(e){const t=this.Ge(e).ve();return this.Le.getRemoteKeysForTarget(e).size+t.addedDocuments.size-t.removedDocuments.size}xe(e){this.Ge(e).xe()}Ge(e){let t=this.Be.get(e);return t||(t=new Zd,this.Be.set(e,t)),t}st(e){let t=this.qe.get(e);return t||(t=new We(ae),this.qe=this.qe.insert(e,t)),t}ze(e){const t=this.Je(e)!==null;return t||B("WatchChangeAggregator","Detected inactive target",e),t}Je(e){const t=this.Be.get(e);return t&&t.Se?null:this.Le.ot(e)}je(e){this.Be.set(e,new Zd),this.Le.getRemoteKeysForTarget(e).forEach(t=>{this.Ue(e,t,null)})}it(e,t){return this.Le.getRemoteKeysForTarget(e).has(t)}}function ef(){return new Ae(W.comparator)}function tf(){return new Ae(W.comparator)}const CI={asc:"ASCENDING",desc:"DESCENDING"},bI={"<":"LESS_THAN","<=":"LESS_THAN_OR_EQUAL",">":"GREATER_THAN",">=":"GREATER_THAN_OR_EQUAL","==":"EQUAL","!=":"NOT_EQUAL","array-contains":"ARRAY_CONTAINS",in:"IN","not-in":"NOT_IN","array-contains-any":"ARRAY_CONTAINS_ANY"},RI={and:"AND",or:"OR"};class SI{constructor(e,t){this.databaseId=e,this.useProto3Json=t}}function Ql(n,e){return n.useProto3Json||_r(e)?e:{value:e}}function Vo(n,e){return n.useProto3Json?`${new Date(1e3*e.seconds).toISOString().replace(/\.\d*/,"").replace("Z","")}.${("000000000"+e.nanoseconds).slice(-9)}Z`:{seconds:""+e.seconds,nanos:e.nanoseconds}}function Qm(n,e){return n.useProto3Json?e.toBase64():e.toUint8Array()}function AI(n,e){return Vo(n,e.toTimestamp())}function ft(n){return re(!!n),H.fromTimestamp(function(t){const s=Dn(t);return new De(s.seconds,s.nanos)}(n))}function Yc(n,e){return Yl(n,e).canonicalString()}function Yl(n,e){const t=function(i){return new me(["projects",i.projectId,"databases",i.database])}(n).child("documents");return e===void 0?t:t.child(e)}function Ym(n){const e=me.fromString(n);return re(ng(e)),e}function Fo(n,e){return Yc(n.databaseId,e.path)}function qi(n,e){const t=Ym(e);if(t.get(1)!==n.databaseId.projectId)throw new M(P.INVALID_ARGUMENT,"Tried to deserialize key from different project: "+t.get(1)+" vs "+n.databaseId.projectId);if(t.get(3)!==n.databaseId.database)throw new M(P.INVALID_ARGUMENT,"Tried to deserialize key from different database: "+t.get(3)+" vs "+n.databaseId.database);return new W(Xm(t))}function Jm(n,e){return Yc(n.databaseId,e)}function kI(n){const e=Ym(n);return e.length===4?me.emptyPath():Xm(e)}function Jl(n){return new me(["projects",n.databaseId.projectId,"databases",n.databaseId.database]).canonicalString()}function Xm(n){return re(n.length>4&&n.get(4)==="documents"),n.popFirst(5)}function nf(n,e,t){return{name:Fo(n,e),fields:t.value.mapValue.fields}}function PI(n,e){return"found"in e?function(s,i){re(!!i.found),i.found.name,i.found.updateTime;const r=qi(s,i.found.name),o=ft(i.found.updateTime),l=i.found.createTime?ft(i.found.createTime):H.min(),c=new it({mapValue:{fields:i.found.fields}});return Ve.newFoundDocument(r,o,l,c)}(n,e):"missing"in e?function(s,i){re(!!i.missing),re(!!i.readTime);const r=qi(s,i.missing),o=ft(i.readTime);return Ve.newNoDocument(r,o)}(n,e):j()}function NI(n,e){let t;if("targetChange"in e){e.targetChange;const s=function(h){return h==="NO_CHANGE"?0:h==="ADD"?1:h==="REMOVE"?2:h==="CURRENT"?3:h==="RESET"?4:j()}(e.targetChange.targetChangeType||"NO_CHANGE"),i=e.targetChange.targetIds||[],r=function(h,d){return h.useProto3Json?(re(d===void 0||typeof d=="string"),$e.fromBase64String(d||"")):(re(d===void 0||d instanceof Buffer||d instanceof Uint8Array),$e.fromUint8Array(d||new Uint8Array))}(n,e.targetChange.resumeToken),o=e.targetChange.cause,l=o&&function(h){const d=h.code===void 0?P.UNKNOWN:Gm(h.code);return new M(d,h.message||"")}(o);t=new Km(s,i,r,l||null)}else if("documentChange"in e){e.documentChange;const s=e.documentChange;s.document,s.document.name,s.document.updateTime;const i=qi(n,s.document.name),r=ft(s.document.updateTime),o=s.document.createTime?ft(s.document.createTime):H.min(),l=new it({mapValue:{fields:s.document.fields}}),c=Ve.newFoundDocument(i,r,o,l),h=s.targetIds||[],d=s.removedTargetIds||[];t=new fo(h,d,c.key,c)}else if("documentDelete"in e){e.documentDelete;const s=e.documentDelete;s.document;const i=qi(n,s.document),r=s.readTime?ft(s.readTime):H.min(),o=Ve.newNoDocument(i,r),l=s.removedTargetIds||[];t=new fo([],l,o.key,o)}else if("documentRemove"in e){e.documentRemove;const s=e.documentRemove;s.document;const i=qi(n,s.document),r=s.removedTargetIds||[];t=new fo([],r,i,null)}else{if(!("filter"in e))return j();{e.filter;const s=e.filter;s.targetId;const{count:i=0,unchangedNames:r}=s,o=new EI(i,r),l=s.targetId;t=new Hm(l,o)}}return t}function Zm(n,e){let t;if(e instanceof vr)t={update:nf(n,e.key,e.value)};else if(e instanceof Hc)t={delete:Fo(n,e.key)};else if(e instanceof Fn)t={update:nf(n,e.key,e.data),updateMask:UI(e.fieldMask)};else{if(!(e instanceof jm))return j();t={verify:Fo(n,e.key)}}return e.fieldTransforms.length>0&&(t.updateTransforms=e.fieldTransforms.map(s=>function(r,o){const l=o.transform;if(l instanceof Oo)return{fieldPath:o.field.canonicalString(),setToServerValue:"REQUEST_TIME"};if(l instanceof tr)return{fieldPath:o.field.canonicalString(),appendMissingElements:{values:l.elements}};if(l instanceof nr)return{fieldPath:o.field.canonicalString(),removeAllFromArray:{values:l.elements}};if(l instanceof Mo)return{fieldPath:o.field.canonicalString(),increment:l.Pe};throw j()}(0,s))),e.precondition.isNone||(t.currentDocument=function(i,r){return r.updateTime!==void 0?{updateTime:AI(i,r.updateTime)}:r.exists!==void 0?{exists:r.exists}:j()}(n,e.precondition)),t}function DI(n,e){return n&&n.length>0?(re(e!==void 0),n.map(t=>function(i,r){let o=i.updateTime?ft(i.updateTime):ft(r);return o.isEqual(H.min())&&(o=ft(r)),new mI(o,i.transformResults||[])}(t,e))):[]}function LI(n,e){return{documents:[Jm(n,e.path)]}}function xI(n,e){const t={structuredQuery:{}},s=e.path;let i;e.collectionGroup!==null?(i=s,t.structuredQuery.from=[{collectionId:e.collectionGroup,allDescendants:!0}]):(i=s.popLast(),t.structuredQuery.from=[{collectionId:s.lastSegment()}]),t.parent=Jm(n,i);const r=function(h){if(h.length!==0)return tg(At.create(h,"and"))}(e.filters);r&&(t.structuredQuery.where=r);const o=function(h){if(h.length!==0)return h.map(d=>function(m){return{field:Rs(m.field),direction:VI(m.dir)}}(d))}(e.orderBy);o&&(t.structuredQuery.orderBy=o);const l=Ql(n,e.limit);return l!==null&&(t.structuredQuery.limit=l),e.startAt&&(t.structuredQuery.startAt=function(h){return{before:h.inclusive,values:h.position}}(e.startAt)),e.endAt&&(t.structuredQuery.endAt=function(h){return{before:!h.inclusive,values:h.position}}(e.endAt)),{_t:t,parent:i}}function OI(n){let e=kI(n.parent);const t=n.structuredQuery,s=t.from?t.from.length:0;let i=null;if(s>0){re(s===1);const d=t.from[0];d.allDescendants?i=d.collectionId:e=e.child(d.collectionId)}let r=[];t.where&&(r=function(p){const m=eg(p);return m instanceof At&&Sm(m)?m.getFilters():[m]}(t.where));let o=[];t.orderBy&&(o=function(p){return p.map(m=>function(C){return new Lo(Ss(C.field),function(k){switch(k){case"ASCENDING":return"asc";case"DESCENDING":return"desc";default:return}}(C.direction))}(m))}(t.orderBy));let l=null;t.limit&&(l=function(p){let m;return m=typeof p=="object"?p.value:p,_r(m)?null:m}(t.limit));let c=null;t.startAt&&(c=function(p){const m=!!p.before,E=p.values||[];return new Do(E,m)}(t.startAt));let h=null;return t.endAt&&(h=function(p){const m=!p.before,E=p.values||[];return new Do(E,m)}(t.endAt)),nI(e,i,o,r,l,"F",c,h)}function MI(n,e){const t=function(i){switch(i){case"TargetPurposeListen":return null;case"TargetPurposeExistenceFilterMismatch":return"existence-filter-mismatch";case"TargetPurposeExistenceFilterMismatchBloom":return"existence-filter-mismatch-bloom";case"TargetPurposeLimboResolution":return"limbo-document";default:return j()}}(e.purpose);return t==null?null:{"goog-listen-tags":t}}function eg(n){return n.unaryFilter!==void 0?function(t){switch(t.unaryFilter.op){case"IS_NAN":const s=Ss(t.unaryFilter.field);return Re.create(s,"==",{doubleValue:NaN});case"IS_NULL":const i=Ss(t.unaryFilter.field);return Re.create(i,"==",{nullValue:"NULL_VALUE"});case"IS_NOT_NAN":const r=Ss(t.unaryFilter.field);return Re.create(r,"!=",{doubleValue:NaN});case"IS_NOT_NULL":const o=Ss(t.unaryFilter.field);return Re.create(o,"!=",{nullValue:"NULL_VALUE"});default:return j()}}(n):n.fieldFilter!==void 0?function(t){return Re.create(Ss(t.fieldFilter.field),function(i){switch(i){case"EQUAL":return"==";case"NOT_EQUAL":return"!=";case"GREATER_THAN":return">";case"GREATER_THAN_OR_EQUAL":return">=";case"LESS_THAN":return"<";case"LESS_THAN_OR_EQUAL":return"<=";case"ARRAY_CONTAINS":return"array-contains";case"IN":return"in";case"NOT_IN":return"not-in";case"ARRAY_CONTAINS_ANY":return"array-contains-any";default:return j()}}(t.fieldFilter.op),t.fieldFilter.value)}(n):n.compositeFilter!==void 0?function(t){return At.create(t.compositeFilter.filters.map(s=>eg(s)),function(i){switch(i){case"AND":return"and";case"OR":return"or";default:return j()}}(t.compositeFilter.op))}(n):j()}function VI(n){return CI[n]}function FI(n){return bI[n]}function BI(n){return RI[n]}function Rs(n){return{fieldPath:n.canonicalString()}}function Ss(n){return qe.fromServerFormat(n.fieldPath)}function tg(n){return n instanceof Re?function(t){if(t.op==="=="){if(Wd(t.value))return{unaryFilter:{field:Rs(t.field),op:"IS_NAN"}};if(qd(t.value))return{unaryFilter:{field:Rs(t.field),op:"IS_NULL"}}}else if(t.op==="!="){if(Wd(t.value))return{unaryFilter:{field:Rs(t.field),op:"IS_NOT_NAN"}};if(qd(t.value))return{unaryFilter:{field:Rs(t.field),op:"IS_NOT_NULL"}}}return{fieldFilter:{field:Rs(t.field),op:FI(t.op),value:t.value}}}(n):n instanceof At?function(t){const s=t.getFilters().map(i=>tg(i));return s.length===1?s[0]:{compositeFilter:{op:BI(t.op),filters:s}}}(n):j()}function UI(n){const e=[];return n.fields.forEach(t=>e.push(t.canonicalString())),{fieldPaths:e}}function ng(n){return n.length>=4&&n.get(0)==="projects"&&n.get(2)==="databases"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class En{constructor(e,t,s,i,r=H.min(),o=H.min(),l=$e.EMPTY_BYTE_STRING,c=null){this.target=e,this.targetId=t,this.purpose=s,this.sequenceNumber=i,this.snapshotVersion=r,this.lastLimboFreeSnapshotVersion=o,this.resumeToken=l,this.expectedCount=c}withSequenceNumber(e){return new En(this.target,this.targetId,this.purpose,e,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,this.expectedCount)}withResumeToken(e,t){return new En(this.target,this.targetId,this.purpose,this.sequenceNumber,t,this.lastLimboFreeSnapshotVersion,e,null)}withExpectedCount(e){return new En(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,e)}withLastLimboFreeSnapshotVersion(e){return new En(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,e,this.resumeToken,this.expectedCount)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qI{constructor(e){this.ct=e}}function WI(n){const e=OI({parent:n.parent,structuredQuery:n.structuredQuery});return n.limitType==="LAST"?xo(e,e.limit,"L"):e}/**
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
 */class $I{constructor(){this.un=new jI}addToCollectionParentIndex(e,t){return this.un.add(t),N.resolve()}getCollectionParents(e,t){return N.resolve(this.un.getEntries(t))}addFieldIndex(e,t){return N.resolve()}deleteFieldIndex(e,t){return N.resolve()}deleteAllFieldIndexes(e){return N.resolve()}createTargetIndexes(e,t){return N.resolve()}getDocumentsMatchingTarget(e,t){return N.resolve(null)}getIndexType(e,t){return N.resolve(0)}getFieldIndexes(e,t){return N.resolve([])}getNextCollectionGroupToUpdate(e){return N.resolve(null)}getMinOffset(e,t){return N.resolve(Nn.min())}getMinOffsetFromCollectionGroup(e,t){return N.resolve(Nn.min())}updateCollectionGroup(e,t,s){return N.resolve()}updateIndexEntries(e,t){return N.resolve()}}class jI{constructor(){this.index={}}add(e){const t=e.lastSegment(),s=e.popLast(),i=this.index[t]||new We(me.comparator),r=!i.has(s);return this.index[t]=i.add(s),r}has(e){const t=e.lastSegment(),s=e.popLast(),i=this.index[t];return i&&i.has(s)}getEntries(e){return(this.index[e]||new We(me.comparator)).toArray()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
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
 */class zI{constructor(){this.changes=new ei(e=>e.toString(),(e,t)=>e.isEqual(t)),this.changesApplied=!1}addEntry(e){this.assertNotApplied(),this.changes.set(e.key,e)}removeEntry(e,t){this.assertNotApplied(),this.changes.set(e,Ve.newInvalidDocument(e).setReadTime(t))}getEntry(e,t){this.assertNotApplied();const s=this.changes.get(t);return s!==void 0?N.resolve(s):this.getFromCache(e,t)}getEntries(e,t){return this.getAllFromCache(e,t)}apply(e){return this.assertNotApplied(),this.changesApplied=!0,this.applyChanges(e)}assertNotApplied(){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
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
 */class GI{constructor(e,t){this.overlayedDocument=e,this.mutatedFields=t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class HI{constructor(e,t,s,i){this.remoteDocumentCache=e,this.mutationQueue=t,this.documentOverlayCache=s,this.indexManager=i}getDocument(e,t){let s=null;return this.documentOverlayCache.getOverlay(e,t).next(i=>(s=i,this.remoteDocumentCache.getEntry(e,t))).next(i=>(s!==null&&Ui(s.mutation,i,dt.empty(),De.now()),i))}getDocuments(e,t){return this.remoteDocumentCache.getEntries(e,t).next(s=>this.getLocalViewOfDocuments(e,s,ne()).next(()=>s))}getLocalViewOfDocuments(e,t,s=ne()){const i=Hn();return this.populateOverlays(e,i,t).next(()=>this.computeViews(e,t,i,s).next(r=>{let o=Li();return r.forEach((l,c)=>{o=o.insert(l,c.overlayedDocument)}),o}))}getOverlayedDocuments(e,t){const s=Hn();return this.populateOverlays(e,s,t).next(()=>this.computeViews(e,t,s,ne()))}populateOverlays(e,t,s){const i=[];return s.forEach(r=>{t.has(r)||i.push(r)}),this.documentOverlayCache.getOverlays(e,i).next(r=>{r.forEach((o,l)=>{t.set(o,l)})})}computeViews(e,t,s,i){let r=on();const o=Bi(),l=function(){return Bi()}();return t.forEach((c,h)=>{const d=s.get(h.key);i.has(h.key)&&(d===void 0||d.mutation instanceof Fn)?r=r.insert(h.key,h):d!==void 0?(o.set(h.key,d.mutation.getFieldMask()),Ui(d.mutation,h,d.mutation.getFieldMask(),De.now())):o.set(h.key,dt.empty())}),this.recalculateAndSaveOverlays(e,r).next(c=>(c.forEach((h,d)=>o.set(h,d)),t.forEach((h,d)=>{var p;return l.set(h,new GI(d,(p=o.get(h))!==null&&p!==void 0?p:null))}),l))}recalculateAndSaveOverlays(e,t){const s=Bi();let i=new Ae((o,l)=>o-l),r=ne();return this.mutationQueue.getAllMutationBatchesAffectingDocumentKeys(e,t).next(o=>{for(const l of o)l.keys().forEach(c=>{const h=t.get(c);if(h===null)return;let d=s.get(c)||dt.empty();d=l.applyToLocalView(h,d),s.set(c,d);const p=(i.get(l.batchId)||ne()).add(c);i=i.insert(l.batchId,p)})}).next(()=>{const o=[],l=i.getReverseIterator();for(;l.hasNext();){const c=l.getNext(),h=c.key,d=c.value,p=Mm();d.forEach(m=>{if(!r.has(m)){const E=Wm(t.get(m),s.get(m));E!==null&&p.set(m,E),r=r.add(m)}}),o.push(this.documentOverlayCache.saveOverlays(e,h,p))}return N.waitFor(o)}).next(()=>s)}recalculateAndSaveOverlaysForDocumentKeys(e,t){return this.remoteDocumentCache.getEntries(e,t).next(s=>this.recalculateAndSaveOverlays(e,s))}getDocumentsMatchingQuery(e,t,s,i){return function(o){return W.isDocumentKey(o.path)&&o.collectionGroup===null&&o.filters.length===0}(t)?this.getDocumentsMatchingDocumentQuery(e,t.path):Nm(t)?this.getDocumentsMatchingCollectionGroupQuery(e,t,s,i):this.getDocumentsMatchingCollectionQuery(e,t,s,i)}getNextDocuments(e,t,s,i){return this.remoteDocumentCache.getAllFromCollectionGroup(e,t,s,i).next(r=>{const o=i-r.size>0?this.documentOverlayCache.getOverlaysForCollectionGroup(e,t,s.largestBatchId,i-r.size):N.resolve(Hn());let l=-1,c=r;return o.next(h=>N.forEach(h,(d,p)=>(l<p.largestBatchId&&(l=p.largestBatchId),r.get(d)?N.resolve():this.remoteDocumentCache.getEntry(e,d).next(m=>{c=c.insert(d,m)}))).next(()=>this.populateOverlays(e,h,r)).next(()=>this.computeViews(e,c,h,ne())).next(d=>({batchId:l,changes:Om(d)})))})}getDocumentsMatchingDocumentQuery(e,t){return this.getDocument(e,new W(t)).next(s=>{let i=Li();return s.isFoundDocument()&&(i=i.insert(s.key,s)),i})}getDocumentsMatchingCollectionGroupQuery(e,t,s,i){const r=t.collectionGroup;let o=Li();return this.indexManager.getCollectionParents(e,r).next(l=>N.forEach(l,c=>{const h=function(p,m){return new yr(m,null,p.explicitOrderBy.slice(),p.filters.slice(),p.limit,p.limitType,p.startAt,p.endAt)}(t,c.child(r));return this.getDocumentsMatchingCollectionQuery(e,h,s,i).next(d=>{d.forEach((p,m)=>{o=o.insert(p,m)})})}).next(()=>o))}getDocumentsMatchingCollectionQuery(e,t,s,i){let r;return this.documentOverlayCache.getOverlaysForCollection(e,t.path,s.largestBatchId).next(o=>(r=o,this.remoteDocumentCache.getDocumentsMatchingQuery(e,t,s,r,i))).next(o=>{r.forEach((c,h)=>{const d=h.getKey();o.get(d)===null&&(o=o.insert(d,Ve.newInvalidDocument(d)))});let l=Li();return o.forEach((c,h)=>{const d=r.get(c);d!==void 0&&Ui(d.mutation,h,dt.empty(),De.now()),da(t,h)&&(l=l.insert(c,h))}),l})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class KI{constructor(e){this.serializer=e,this.hr=new Map,this.Pr=new Map}getBundleMetadata(e,t){return N.resolve(this.hr.get(t))}saveBundleMetadata(e,t){return this.hr.set(t.id,function(i){return{id:i.id,version:i.version,createTime:ft(i.createTime)}}(t)),N.resolve()}getNamedQuery(e,t){return N.resolve(this.Pr.get(t))}saveNamedQuery(e,t){return this.Pr.set(t.name,function(i){return{name:i.name,query:WI(i.bundledQuery),readTime:ft(i.readTime)}}(t)),N.resolve()}}/**
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
 */class QI{constructor(){this.overlays=new Ae(W.comparator),this.Ir=new Map}getOverlay(e,t){return N.resolve(this.overlays.get(t))}getOverlays(e,t){const s=Hn();return N.forEach(t,i=>this.getOverlay(e,i).next(r=>{r!==null&&s.set(i,r)})).next(()=>s)}saveOverlays(e,t,s){return s.forEach((i,r)=>{this.ht(e,t,r)}),N.resolve()}removeOverlaysForBatchId(e,t,s){const i=this.Ir.get(s);return i!==void 0&&(i.forEach(r=>this.overlays=this.overlays.remove(r)),this.Ir.delete(s)),N.resolve()}getOverlaysForCollection(e,t,s){const i=Hn(),r=t.length+1,o=new W(t.child("")),l=this.overlays.getIteratorFrom(o);for(;l.hasNext();){const c=l.getNext().value,h=c.getKey();if(!t.isPrefixOf(h.path))break;h.path.length===r&&c.largestBatchId>s&&i.set(c.getKey(),c)}return N.resolve(i)}getOverlaysForCollectionGroup(e,t,s,i){let r=new Ae((h,d)=>h-d);const o=this.overlays.getIterator();for(;o.hasNext();){const h=o.getNext().value;if(h.getKey().getCollectionGroup()===t&&h.largestBatchId>s){let d=r.get(h.largestBatchId);d===null&&(d=Hn(),r=r.insert(h.largestBatchId,d)),d.set(h.getKey(),h)}}const l=Hn(),c=r.getIterator();for(;c.hasNext()&&(c.getNext().value.forEach((h,d)=>l.set(h,d)),!(l.size()>=i)););return N.resolve(l)}ht(e,t,s){const i=this.overlays.get(s.key);if(i!==null){const o=this.Ir.get(i.largestBatchId).delete(s.key);this.Ir.set(i.largestBatchId,o)}this.overlays=this.overlays.insert(s.key,new vI(t,s));let r=this.Ir.get(t);r===void 0&&(r=ne(),this.Ir.set(t,r)),this.Ir.set(t,r.add(s.key))}}/**
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
 */class YI{constructor(){this.sessionToken=$e.EMPTY_BYTE_STRING}getSessionToken(e){return N.resolve(this.sessionToken)}setSessionToken(e,t){return this.sessionToken=t,N.resolve()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Jc{constructor(){this.Tr=new We(Oe.Er),this.dr=new We(Oe.Ar)}isEmpty(){return this.Tr.isEmpty()}addReference(e,t){const s=new Oe(e,t);this.Tr=this.Tr.add(s),this.dr=this.dr.add(s)}Rr(e,t){e.forEach(s=>this.addReference(s,t))}removeReference(e,t){this.Vr(new Oe(e,t))}mr(e,t){e.forEach(s=>this.removeReference(s,t))}gr(e){const t=new W(new me([])),s=new Oe(t,e),i=new Oe(t,e+1),r=[];return this.dr.forEachInRange([s,i],o=>{this.Vr(o),r.push(o.key)}),r}pr(){this.Tr.forEach(e=>this.Vr(e))}Vr(e){this.Tr=this.Tr.delete(e),this.dr=this.dr.delete(e)}yr(e){const t=new W(new me([])),s=new Oe(t,e),i=new Oe(t,e+1);let r=ne();return this.dr.forEachInRange([s,i],o=>{r=r.add(o.key)}),r}containsKey(e){const t=new Oe(e,0),s=this.Tr.firstAfterOrEqual(t);return s!==null&&e.isEqual(s.key)}}class Oe{constructor(e,t){this.key=e,this.wr=t}static Er(e,t){return W.comparator(e.key,t.key)||ae(e.wr,t.wr)}static Ar(e,t){return ae(e.wr,t.wr)||W.comparator(e.key,t.key)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class JI{constructor(e,t){this.indexManager=e,this.referenceDelegate=t,this.mutationQueue=[],this.Sr=1,this.br=new We(Oe.Er)}checkEmpty(e){return N.resolve(this.mutationQueue.length===0)}addMutationBatch(e,t,s,i){const r=this.Sr;this.Sr++,this.mutationQueue.length>0&&this.mutationQueue[this.mutationQueue.length-1];const o=new yI(r,t,s,i);this.mutationQueue.push(o);for(const l of i)this.br=this.br.add(new Oe(l.key,r)),this.indexManager.addToCollectionParentIndex(e,l.key.path.popLast());return N.resolve(o)}lookupMutationBatch(e,t){return N.resolve(this.Dr(t))}getNextMutationBatchAfterBatchId(e,t){const s=t+1,i=this.vr(s),r=i<0?0:i;return N.resolve(this.mutationQueue.length>r?this.mutationQueue[r]:null)}getHighestUnacknowledgedBatchId(){return N.resolve(this.mutationQueue.length===0?-1:this.Sr-1)}getAllMutationBatches(e){return N.resolve(this.mutationQueue.slice())}getAllMutationBatchesAffectingDocumentKey(e,t){const s=new Oe(t,0),i=new Oe(t,Number.POSITIVE_INFINITY),r=[];return this.br.forEachInRange([s,i],o=>{const l=this.Dr(o.wr);r.push(l)}),N.resolve(r)}getAllMutationBatchesAffectingDocumentKeys(e,t){let s=new We(ae);return t.forEach(i=>{const r=new Oe(i,0),o=new Oe(i,Number.POSITIVE_INFINITY);this.br.forEachInRange([r,o],l=>{s=s.add(l.wr)})}),N.resolve(this.Cr(s))}getAllMutationBatchesAffectingQuery(e,t){const s=t.path,i=s.length+1;let r=s;W.isDocumentKey(r)||(r=r.child(""));const o=new Oe(new W(r),0);let l=new We(ae);return this.br.forEachWhile(c=>{const h=c.key.path;return!!s.isPrefixOf(h)&&(h.length===i&&(l=l.add(c.wr)),!0)},o),N.resolve(this.Cr(l))}Cr(e){const t=[];return e.forEach(s=>{const i=this.Dr(s);i!==null&&t.push(i)}),t}removeMutationBatch(e,t){re(this.Fr(t.batchId,"removed")===0),this.mutationQueue.shift();let s=this.br;return N.forEach(t.mutations,i=>{const r=new Oe(i.key,t.batchId);return s=s.delete(r),this.referenceDelegate.markPotentiallyOrphaned(e,i.key)}).next(()=>{this.br=s})}On(e){}containsKey(e,t){const s=new Oe(t,0),i=this.br.firstAfterOrEqual(s);return N.resolve(t.isEqual(i&&i.key))}performConsistencyCheck(e){return this.mutationQueue.length,N.resolve()}Fr(e,t){return this.vr(e)}vr(e){return this.mutationQueue.length===0?0:e-this.mutationQueue[0].batchId}Dr(e){const t=this.vr(e);return t<0||t>=this.mutationQueue.length?null:this.mutationQueue[t]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class XI{constructor(e){this.Mr=e,this.docs=function(){return new Ae(W.comparator)}(),this.size=0}setIndexManager(e){this.indexManager=e}addEntry(e,t){const s=t.key,i=this.docs.get(s),r=i?i.size:0,o=this.Mr(t);return this.docs=this.docs.insert(s,{document:t.mutableCopy(),size:o}),this.size+=o-r,this.indexManager.addToCollectionParentIndex(e,s.path.popLast())}removeEntry(e){const t=this.docs.get(e);t&&(this.docs=this.docs.remove(e),this.size-=t.size)}getEntry(e,t){const s=this.docs.get(t);return N.resolve(s?s.document.mutableCopy():Ve.newInvalidDocument(t))}getEntries(e,t){let s=on();return t.forEach(i=>{const r=this.docs.get(i);s=s.insert(i,r?r.document.mutableCopy():Ve.newInvalidDocument(i))}),N.resolve(s)}getDocumentsMatchingQuery(e,t,s,i){let r=on();const o=t.path,l=new W(o.child("")),c=this.docs.getIteratorFrom(l);for(;c.hasNext();){const{key:h,value:{document:d}}=c.getNext();if(!o.isPrefixOf(h.path))break;h.path.length>o.length+1||VT(MT(d),s)<=0||(i.has(d.key)||da(t,d))&&(r=r.insert(d.key,d.mutableCopy()))}return N.resolve(r)}getAllFromCollectionGroup(e,t,s,i){j()}Or(e,t){return N.forEach(this.docs,s=>t(s))}newChangeBuffer(e){return new ZI(this)}getSize(e){return N.resolve(this.size)}}class ZI extends zI{constructor(e){super(),this.cr=e}applyChanges(e){const t=[];return this.changes.forEach((s,i)=>{i.isValidDocument()?t.push(this.cr.addEntry(e,i)):this.cr.removeEntry(s)}),N.waitFor(t)}getFromCache(e,t){return this.cr.getEntry(e,t)}getAllFromCache(e,t){return this.cr.getEntries(e,t)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class e0{constructor(e){this.persistence=e,this.Nr=new ei(t=>$c(t),jc),this.lastRemoteSnapshotVersion=H.min(),this.highestTargetId=0,this.Lr=0,this.Br=new Jc,this.targetCount=0,this.kr=Ws.Bn()}forEachTarget(e,t){return this.Nr.forEach((s,i)=>t(i)),N.resolve()}getLastRemoteSnapshotVersion(e){return N.resolve(this.lastRemoteSnapshotVersion)}getHighestSequenceNumber(e){return N.resolve(this.Lr)}allocateTargetId(e){return this.highestTargetId=this.kr.next(),N.resolve(this.highestTargetId)}setTargetsMetadata(e,t,s){return s&&(this.lastRemoteSnapshotVersion=s),t>this.Lr&&(this.Lr=t),N.resolve()}Kn(e){this.Nr.set(e.target,e);const t=e.targetId;t>this.highestTargetId&&(this.kr=new Ws(t),this.highestTargetId=t),e.sequenceNumber>this.Lr&&(this.Lr=e.sequenceNumber)}addTargetData(e,t){return this.Kn(t),this.targetCount+=1,N.resolve()}updateTargetData(e,t){return this.Kn(t),N.resolve()}removeTargetData(e,t){return this.Nr.delete(t.target),this.Br.gr(t.targetId),this.targetCount-=1,N.resolve()}removeTargets(e,t,s){let i=0;const r=[];return this.Nr.forEach((o,l)=>{l.sequenceNumber<=t&&s.get(l.targetId)===null&&(this.Nr.delete(o),r.push(this.removeMatchingKeysForTargetId(e,l.targetId)),i++)}),N.waitFor(r).next(()=>i)}getTargetCount(e){return N.resolve(this.targetCount)}getTargetData(e,t){const s=this.Nr.get(t)||null;return N.resolve(s)}addMatchingKeys(e,t,s){return this.Br.Rr(t,s),N.resolve()}removeMatchingKeys(e,t,s){this.Br.mr(t,s);const i=this.persistence.referenceDelegate,r=[];return i&&t.forEach(o=>{r.push(i.markPotentiallyOrphaned(e,o))}),N.waitFor(r)}removeMatchingKeysForTargetId(e,t){return this.Br.gr(t),N.resolve()}getMatchingKeysForTargetId(e,t){const s=this.Br.yr(t);return N.resolve(s)}containsKey(e,t){return N.resolve(this.Br.containsKey(t))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class t0{constructor(e,t){this.qr={},this.overlays={},this.Qr=new Bc(0),this.Kr=!1,this.Kr=!0,this.$r=new YI,this.referenceDelegate=e(this),this.Ur=new e0(this),this.indexManager=new $I,this.remoteDocumentCache=function(i){return new XI(i)}(s=>this.referenceDelegate.Wr(s)),this.serializer=new qI(t),this.Gr=new KI(this.serializer)}start(){return Promise.resolve()}shutdown(){return this.Kr=!1,Promise.resolve()}get started(){return this.Kr}setDatabaseDeletedListener(){}setNetworkEnabled(){}getIndexManager(e){return this.indexManager}getDocumentOverlayCache(e){let t=this.overlays[e.toKey()];return t||(t=new QI,this.overlays[e.toKey()]=t),t}getMutationQueue(e,t){let s=this.qr[e.toKey()];return s||(s=new JI(t,this.referenceDelegate),this.qr[e.toKey()]=s),s}getGlobalsCache(){return this.$r}getTargetCache(){return this.Ur}getRemoteDocumentCache(){return this.remoteDocumentCache}getBundleCache(){return this.Gr}runTransaction(e,t,s){B("MemoryPersistence","Starting transaction:",e);const i=new n0(this.Qr.next());return this.referenceDelegate.zr(),s(i).next(r=>this.referenceDelegate.jr(i).next(()=>r)).toPromise().then(r=>(i.raiseOnCommittedEvent(),r))}Hr(e,t){return N.or(Object.values(this.qr).map(s=>()=>s.containsKey(e,t)))}}class n0 extends BT{constructor(e){super(),this.currentSequenceNumber=e}}class Xc{constructor(e){this.persistence=e,this.Jr=new Jc,this.Yr=null}static Zr(e){return new Xc(e)}get Xr(){if(this.Yr)return this.Yr;throw j()}addReference(e,t,s){return this.Jr.addReference(s,t),this.Xr.delete(s.toString()),N.resolve()}removeReference(e,t,s){return this.Jr.removeReference(s,t),this.Xr.add(s.toString()),N.resolve()}markPotentiallyOrphaned(e,t){return this.Xr.add(t.toString()),N.resolve()}removeTarget(e,t){this.Jr.gr(t.targetId).forEach(i=>this.Xr.add(i.toString()));const s=this.persistence.getTargetCache();return s.getMatchingKeysForTargetId(e,t.targetId).next(i=>{i.forEach(r=>this.Xr.add(r.toString()))}).next(()=>s.removeTargetData(e,t))}zr(){this.Yr=new Set}jr(e){const t=this.persistence.getRemoteDocumentCache().newChangeBuffer();return N.forEach(this.Xr,s=>{const i=W.fromPath(s);return this.ei(e,i).next(r=>{r||t.removeEntry(i,H.min())})}).next(()=>(this.Yr=null,t.apply(e)))}updateLimboDocument(e,t){return this.ei(e,t).next(s=>{s?this.Xr.delete(t.toString()):this.Xr.add(t.toString())})}Wr(e){return 0}ei(e,t){return N.or([()=>N.resolve(this.Jr.containsKey(t)),()=>this.persistence.getTargetCache().containsKey(e,t),()=>this.persistence.Hr(e,t)])}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Zc{constructor(e,t,s,i){this.targetId=e,this.fromCache=t,this.$i=s,this.Ui=i}static Wi(e,t){let s=ne(),i=ne();for(const r of t.docChanges)switch(r.type){case 0:s=s.add(r.doc.key);break;case 1:i=i.add(r.doc.key)}return new Zc(e,t.fromCache,s,i)}}/**
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
 */class s0{constructor(){this._documentReadCount=0}get documentReadCount(){return this._documentReadCount}incrementDocumentReadCount(e){this._documentReadCount+=e}}/**
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
 */class i0{constructor(){this.Gi=!1,this.zi=!1,this.ji=100,this.Hi=function(){return iv()?8:UT(et())>0?6:4}()}initialize(e,t){this.Ji=e,this.indexManager=t,this.Gi=!0}getDocumentsMatchingQuery(e,t,s,i){const r={result:null};return this.Yi(e,t).next(o=>{r.result=o}).next(()=>{if(!r.result)return this.Zi(e,t,i,s).next(o=>{r.result=o})}).next(()=>{if(r.result)return;const o=new s0;return this.Xi(e,t,o).next(l=>{if(r.result=l,this.zi)return this.es(e,t,o,l.size)})}).next(()=>r.result)}es(e,t,s,i){return s.documentReadCount<this.ji?(wi()<=te.DEBUG&&B("QueryEngine","SDK will not create cache indexes for query:",bs(t),"since it only creates cache indexes for collection contains","more than or equal to",this.ji,"documents"),N.resolve()):(wi()<=te.DEBUG&&B("QueryEngine","Query:",bs(t),"scans",s.documentReadCount,"local documents and returns",i,"documents as results."),s.documentReadCount>this.Hi*i?(wi()<=te.DEBUG&&B("QueryEngine","The SDK decides to create cache indexes for query:",bs(t),"as using cache indexes may help improve performance."),this.indexManager.createTargetIndexes(e,Dt(t))):N.resolve())}Yi(e,t){if(Gd(t))return N.resolve(null);let s=Dt(t);return this.indexManager.getIndexType(e,s).next(i=>i===0?null:(t.limit!==null&&i===1&&(t=xo(t,null,"F"),s=Dt(t)),this.indexManager.getDocumentsMatchingTarget(e,s).next(r=>{const o=ne(...r);return this.Ji.getDocuments(e,o).next(l=>this.indexManager.getMinOffset(e,s).next(c=>{const h=this.ts(t,l);return this.ns(t,h,o,c.readTime)?this.Yi(e,xo(t,null,"F")):this.rs(e,h,t,c)}))})))}Zi(e,t,s,i){return Gd(t)||i.isEqual(H.min())?N.resolve(null):this.Ji.getDocuments(e,s).next(r=>{const o=this.ts(t,r);return this.ns(t,o,s,i)?N.resolve(null):(wi()<=te.DEBUG&&B("QueryEngine","Re-using previous result from %s to execute query: %s",i.toString(),bs(t)),this.rs(e,o,t,OT(i,-1)).next(l=>l))})}ts(e,t){let s=new We(Lm(e));return t.forEach((i,r)=>{da(e,r)&&(s=s.add(r))}),s}ns(e,t,s,i){if(e.limit===null)return!1;if(s.size!==t.size)return!0;const r=e.limitType==="F"?t.last():t.first();return!!r&&(r.hasPendingWrites||r.version.compareTo(i)>0)}Xi(e,t,s){return wi()<=te.DEBUG&&B("QueryEngine","Using full collection scan to execute query:",bs(t)),this.Ji.getDocumentsMatchingQuery(e,t,Nn.min(),s)}rs(e,t,s,i){return this.Ji.getDocumentsMatchingQuery(e,s,i).next(r=>(t.forEach(o=>{r=r.insert(o.key,o)}),r))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class r0{constructor(e,t,s,i){this.persistence=e,this.ss=t,this.serializer=i,this.os=new Ae(ae),this._s=new ei(r=>$c(r),jc),this.us=new Map,this.cs=e.getRemoteDocumentCache(),this.Ur=e.getTargetCache(),this.Gr=e.getBundleCache(),this.ls(s)}ls(e){this.documentOverlayCache=this.persistence.getDocumentOverlayCache(e),this.indexManager=this.persistence.getIndexManager(e),this.mutationQueue=this.persistence.getMutationQueue(e,this.indexManager),this.localDocuments=new HI(this.cs,this.mutationQueue,this.documentOverlayCache,this.indexManager),this.cs.setIndexManager(this.indexManager),this.ss.initialize(this.localDocuments,this.indexManager)}collectGarbage(e){return this.persistence.runTransaction("Collect garbage","readwrite-primary",t=>e.collect(t,this.os))}}function o0(n,e,t,s){return new r0(n,e,t,s)}async function sg(n,e){const t=Q(n);return await t.persistence.runTransaction("Handle user change","readonly",s=>{let i;return t.mutationQueue.getAllMutationBatches(s).next(r=>(i=r,t.ls(e),t.mutationQueue.getAllMutationBatches(s))).next(r=>{const o=[],l=[];let c=ne();for(const h of i){o.push(h.batchId);for(const d of h.mutations)c=c.add(d.key)}for(const h of r){l.push(h.batchId);for(const d of h.mutations)c=c.add(d.key)}return t.localDocuments.getDocuments(s,c).next(h=>({hs:h,removedBatchIds:o,addedBatchIds:l}))})})}function a0(n,e){const t=Q(n);return t.persistence.runTransaction("Acknowledge batch","readwrite-primary",s=>{const i=e.batch.keys(),r=t.cs.newChangeBuffer({trackRemovals:!0});return function(l,c,h,d){const p=h.batch,m=p.keys();let E=N.resolve();return m.forEach(C=>{E=E.next(()=>d.getEntry(c,C)).next(S=>{const k=h.docVersions.get(C);re(k!==null),S.version.compareTo(k)<0&&(p.applyToRemoteDocument(S,h),S.isValidDocument()&&(S.setReadTime(h.commitVersion),d.addEntry(S)))})}),E.next(()=>l.mutationQueue.removeMutationBatch(c,p))}(t,s,e,r).next(()=>r.apply(s)).next(()=>t.mutationQueue.performConsistencyCheck(s)).next(()=>t.documentOverlayCache.removeOverlaysForBatchId(s,i,e.batch.batchId)).next(()=>t.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(s,function(l){let c=ne();for(let h=0;h<l.mutationResults.length;++h)l.mutationResults[h].transformResults.length>0&&(c=c.add(l.batch.mutations[h].key));return c}(e))).next(()=>t.localDocuments.getDocuments(s,i))})}function ig(n){const e=Q(n);return e.persistence.runTransaction("Get last remote snapshot version","readonly",t=>e.Ur.getLastRemoteSnapshotVersion(t))}function l0(n,e){const t=Q(n),s=e.snapshotVersion;let i=t.os;return t.persistence.runTransaction("Apply remote event","readwrite-primary",r=>{const o=t.cs.newChangeBuffer({trackRemovals:!0});i=t.os;const l=[];e.targetChanges.forEach((d,p)=>{const m=i.get(p);if(!m)return;l.push(t.Ur.removeMatchingKeys(r,d.removedDocuments,p).next(()=>t.Ur.addMatchingKeys(r,d.addedDocuments,p)));let E=m.withSequenceNumber(r.currentSequenceNumber);e.targetMismatches.get(p)!==null?E=E.withResumeToken($e.EMPTY_BYTE_STRING,H.min()).withLastLimboFreeSnapshotVersion(H.min()):d.resumeToken.approximateByteSize()>0&&(E=E.withResumeToken(d.resumeToken,s)),i=i.insert(p,E),function(S,k,F){return S.resumeToken.approximateByteSize()===0||k.snapshotVersion.toMicroseconds()-S.snapshotVersion.toMicroseconds()>=3e8?!0:F.addedDocuments.size+F.modifiedDocuments.size+F.removedDocuments.size>0}(m,E,d)&&l.push(t.Ur.updateTargetData(r,E))});let c=on(),h=ne();if(e.documentUpdates.forEach(d=>{e.resolvedLimboDocuments.has(d)&&l.push(t.persistence.referenceDelegate.updateLimboDocument(r,d))}),l.push(c0(r,o,e.documentUpdates).next(d=>{c=d.Ps,h=d.Is})),!s.isEqual(H.min())){const d=t.Ur.getLastRemoteSnapshotVersion(r).next(p=>t.Ur.setTargetsMetadata(r,r.currentSequenceNumber,s));l.push(d)}return N.waitFor(l).next(()=>o.apply(r)).next(()=>t.localDocuments.getLocalViewOfDocuments(r,c,h)).next(()=>c)}).then(r=>(t.os=i,r))}function c0(n,e,t){let s=ne(),i=ne();return t.forEach(r=>s=s.add(r)),e.getEntries(n,s).next(r=>{let o=on();return t.forEach((l,c)=>{const h=r.get(l);c.isFoundDocument()!==h.isFoundDocument()&&(i=i.add(l)),c.isNoDocument()&&c.version.isEqual(H.min())?(e.removeEntry(l,c.readTime),o=o.insert(l,c)):!h.isValidDocument()||c.version.compareTo(h.version)>0||c.version.compareTo(h.version)===0&&h.hasPendingWrites?(e.addEntry(c),o=o.insert(l,c)):B("LocalStore","Ignoring outdated watch update for ",l,". Current version:",h.version," Watch version:",c.version)}),{Ps:o,Is:i}})}function h0(n,e){const t=Q(n);return t.persistence.runTransaction("Get next mutation batch","readonly",s=>(e===void 0&&(e=-1),t.mutationQueue.getNextMutationBatchAfterBatchId(s,e)))}function u0(n,e){const t=Q(n);return t.persistence.runTransaction("Allocate target","readwrite",s=>{let i;return t.Ur.getTargetData(s,e).next(r=>r?(i=r,N.resolve(i)):t.Ur.allocateTargetId(s).next(o=>(i=new En(e,o,"TargetPurposeListen",s.currentSequenceNumber),t.Ur.addTargetData(s,i).next(()=>i))))}).then(s=>{const i=t.os.get(s.targetId);return(i===null||s.snapshotVersion.compareTo(i.snapshotVersion)>0)&&(t.os=t.os.insert(s.targetId,s),t._s.set(e,s.targetId)),s})}async function Xl(n,e,t){const s=Q(n),i=s.os.get(e),r=t?"readwrite":"readwrite-primary";try{t||await s.persistence.runTransaction("Release target",r,o=>s.persistence.referenceDelegate.removeTarget(o,i))}catch(o){if(!gr(o))throw o;B("LocalStore",`Failed to update sequence numbers for target ${e}: ${o}`)}s.os=s.os.remove(e),s._s.delete(i.target)}function sf(n,e,t){const s=Q(n);let i=H.min(),r=ne();return s.persistence.runTransaction("Execute query","readwrite",o=>function(c,h,d){const p=Q(c),m=p._s.get(d);return m!==void 0?N.resolve(p.os.get(m)):p.Ur.getTargetData(h,d)}(s,o,Dt(e)).next(l=>{if(l)return i=l.lastLimboFreeSnapshotVersion,s.Ur.getMatchingKeysForTargetId(o,l.targetId).next(c=>{r=c})}).next(()=>s.ss.getDocumentsMatchingQuery(o,e,t?i:H.min(),t?r:ne())).next(l=>(d0(s,iI(e),l),{documents:l,Ts:r})))}function d0(n,e,t){let s=n.us.get(e)||H.min();t.forEach((i,r)=>{r.readTime.compareTo(s)>0&&(s=r.readTime)}),n.us.set(e,s)}class rf{constructor(){this.activeTargetIds=hI()}fs(e){this.activeTargetIds=this.activeTargetIds.add(e)}gs(e){this.activeTargetIds=this.activeTargetIds.delete(e)}Vs(){const e={activeTargetIds:this.activeTargetIds.toArray(),updateTimeMs:Date.now()};return JSON.stringify(e)}}class f0{constructor(){this.so=new rf,this.oo={},this.onlineStateHandler=null,this.sequenceNumberHandler=null}addPendingMutation(e){}updateMutationState(e,t,s){}addLocalQueryTarget(e,t=!0){return t&&this.so.fs(e),this.oo[e]||"not-current"}updateQueryState(e,t,s){this.oo[e]=t}removeLocalQueryTarget(e){this.so.gs(e)}isLocalQueryTarget(e){return this.so.activeTargetIds.has(e)}clearQueryState(e){delete this.oo[e]}getAllActiveQueryTargets(){return this.so.activeTargetIds}isActiveQueryTarget(e){return this.so.activeTargetIds.has(e)}start(){return this.so=new rf,Promise.resolve()}handleUserChange(e,t,s){}setOnlineState(e){}shutdown(){}writeSequenceNumber(e){}notifyBundleLoaded(e){}}/**
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
 */class p0{_o(e){}shutdown(){}}/**
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
 */class of{constructor(){this.ao=()=>this.uo(),this.co=()=>this.lo(),this.ho=[],this.Po()}_o(e){this.ho.push(e)}shutdown(){window.removeEventListener("online",this.ao),window.removeEventListener("offline",this.co)}Po(){window.addEventListener("online",this.ao),window.addEventListener("offline",this.co)}uo(){B("ConnectivityMonitor","Network connectivity changed: AVAILABLE");for(const e of this.ho)e(0)}lo(){B("ConnectivityMonitor","Network connectivity changed: UNAVAILABLE");for(const e of this.ho)e(1)}static D(){return typeof window<"u"&&window.addEventListener!==void 0&&window.removeEventListener!==void 0}}/**
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
 */let Zr=null;function cl(){return Zr===null?Zr=function(){return 268435456+Math.round(2147483648*Math.random())}():Zr++,"0x"+Zr.toString(16)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const m0={BatchGetDocuments:"batchGet",Commit:"commit",RunQuery:"runQuery",RunAggregationQuery:"runAggregationQuery"};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class g0{constructor(e){this.Io=e.Io,this.To=e.To}Eo(e){this.Ao=e}Ro(e){this.Vo=e}mo(e){this.fo=e}onMessage(e){this.po=e}close(){this.To()}send(e){this.Io(e)}yo(){this.Ao()}wo(){this.Vo()}So(e){this.fo(e)}bo(e){this.po(e)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ye="WebChannelConnection";class _0 extends class{constructor(t){this.databaseInfo=t,this.databaseId=t.databaseId;const s=t.ssl?"https":"http",i=encodeURIComponent(this.databaseId.projectId),r=encodeURIComponent(this.databaseId.database);this.Do=s+"://"+t.host,this.vo=`projects/${i}/databases/${r}`,this.Co=this.databaseId.database==="(default)"?`project_id=${i}`:`project_id=${i}&database_id=${r}`}get Fo(){return!1}Mo(t,s,i,r,o){const l=cl(),c=this.xo(t,s.toUriEncodedString());B("RestConnection",`Sending RPC '${t}' ${l}:`,c,i);const h={"google-cloud-resource-prefix":this.vo,"x-goog-request-params":this.Co};return this.Oo(h,r,o),this.No(t,c,h,i).then(d=>(B("RestConnection",`Received RPC '${t}' ${l}: `,d),d),d=>{throw Fs("RestConnection",`RPC '${t}' ${l} failed with error: `,d,"url: ",c,"request:",i),d})}Lo(t,s,i,r,o,l){return this.Mo(t,s,i,r,o)}Oo(t,s,i){t["X-Goog-Api-Client"]=function(){return"gl-js/ fire/"+Zs}(),t["Content-Type"]="text/plain",this.databaseInfo.appId&&(t["X-Firebase-GMPID"]=this.databaseInfo.appId),s&&s.headers.forEach((r,o)=>t[o]=r),i&&i.headers.forEach((r,o)=>t[o]=r)}xo(t,s){const i=m0[t];return`${this.Do}/v1/${s}:${i}`}terminate(){}}{constructor(e){super(e),this.forceLongPolling=e.forceLongPolling,this.autoDetectLongPolling=e.autoDetectLongPolling,this.useFetchStreams=e.useFetchStreams,this.longPollingOptions=e.longPollingOptions}No(e,t,s,i){const r=cl();return new Promise((o,l)=>{const c=new mm;c.setWithCredentials(!0),c.listenOnce(gm.COMPLETE,()=>{try{switch(c.getLastErrorCode()){case co.NO_ERROR:const d=c.getResponseJson();B(Ye,`XHR for RPC '${e}' ${r} received:`,JSON.stringify(d)),o(d);break;case co.TIMEOUT:B(Ye,`RPC '${e}' ${r} timed out`),l(new M(P.DEADLINE_EXCEEDED,"Request time out"));break;case co.HTTP_ERROR:const p=c.getStatus();if(B(Ye,`RPC '${e}' ${r} failed with status:`,p,"response text:",c.getResponseText()),p>0){let m=c.getResponseJson();Array.isArray(m)&&(m=m[0]);const E=m==null?void 0:m.error;if(E&&E.status&&E.message){const C=function(k){const F=k.toLowerCase().replace(/_/g,"-");return Object.values(P).indexOf(F)>=0?F:P.UNKNOWN}(E.status);l(new M(C,E.message))}else l(new M(P.UNKNOWN,"Server responded with status "+c.getStatus()))}else l(new M(P.UNAVAILABLE,"Connection failed."));break;default:j()}}finally{B(Ye,`RPC '${e}' ${r} completed.`)}});const h=JSON.stringify(i);B(Ye,`RPC '${e}' ${r} sending request:`,i),c.send(t,"POST",h,s,15)})}Bo(e,t,s){const i=cl(),r=[this.Do,"/","google.firestore.v1.Firestore","/",e,"/channel"],o=vm(),l=ym(),c={httpSessionIdParam:"gsessionid",initMessageHeaders:{},messageUrlParams:{database:`projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`},sendRawJson:!0,supportsCrossDomainXhr:!0,internalChannelParams:{forwardChannelRequestTimeoutMs:6e5},forceLongPolling:this.forceLongPolling,detectBufferingProxy:this.autoDetectLongPolling},h=this.longPollingOptions.timeoutSeconds;h!==void 0&&(c.longPollingTimeout=Math.round(1e3*h)),this.useFetchStreams&&(c.useFetchStreams=!0),this.Oo(c.initMessageHeaders,t,s),c.encodeInitMessageHeaders=!0;const d=r.join("");B(Ye,`Creating RPC '${e}' stream ${i}: ${d}`,c);const p=o.createWebChannel(d,c);let m=!1,E=!1;const C=new g0({Io:k=>{E?B(Ye,`Not sending because RPC '${e}' stream ${i} is closed:`,k):(m||(B(Ye,`Opening RPC '${e}' stream ${i} transport.`),p.open(),m=!0),B(Ye,`RPC '${e}' stream ${i} sending:`,k),p.send(k))},To:()=>p.close()}),S=(k,F,U)=>{k.listen(F,q=>{try{U(q)}catch(ee){setTimeout(()=>{throw ee},0)}})};return S(p,Di.EventType.OPEN,()=>{E||(B(Ye,`RPC '${e}' stream ${i} transport opened.`),C.yo())}),S(p,Di.EventType.CLOSE,()=>{E||(E=!0,B(Ye,`RPC '${e}' stream ${i} transport closed`),C.So())}),S(p,Di.EventType.ERROR,k=>{E||(E=!0,Fs(Ye,`RPC '${e}' stream ${i} transport errored:`,k),C.So(new M(P.UNAVAILABLE,"The operation could not be completed")))}),S(p,Di.EventType.MESSAGE,k=>{var F;if(!E){const U=k.data[0];re(!!U);const q=U,ee=q.error||((F=q[0])===null||F===void 0?void 0:F.error);if(ee){B(Ye,`RPC '${e}' stream ${i} received error:`,ee);const he=ee.status;let de=function(y){const w=be[y];if(w!==void 0)return Gm(w)}(he),I=ee.message;de===void 0&&(de=P.INTERNAL,I="Unknown error status: "+he+" with message "+ee.message),E=!0,C.So(new M(de,I)),p.close()}else B(Ye,`RPC '${e}' stream ${i} received:`,U),C.bo(U)}}),S(l,_m.STAT_EVENT,k=>{k.stat===Wl.PROXY?B(Ye,`RPC '${e}' stream ${i} detected buffering proxy`):k.stat===Wl.NOPROXY&&B(Ye,`RPC '${e}' stream ${i} detected no buffering proxy`)}),setTimeout(()=>{C.wo()},0),C}}function hl(){return typeof document<"u"?document:null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ga(n){return new SI(n,!0)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class eh{constructor(e,t,s=1e3,i=1.5,r=6e4){this.ui=e,this.timerId=t,this.ko=s,this.qo=i,this.Qo=r,this.Ko=0,this.$o=null,this.Uo=Date.now(),this.reset()}reset(){this.Ko=0}Wo(){this.Ko=this.Qo}Go(e){this.cancel();const t=Math.floor(this.Ko+this.zo()),s=Math.max(0,Date.now()-this.Uo),i=Math.max(0,t-s);i>0&&B("ExponentialBackoff",`Backing off for ${i} ms (base delay: ${this.Ko} ms, delay with jitter: ${t} ms, last attempt: ${s} ms ago)`),this.$o=this.ui.enqueueAfterDelay(this.timerId,i,()=>(this.Uo=Date.now(),e())),this.Ko*=this.qo,this.Ko<this.ko&&(this.Ko=this.ko),this.Ko>this.Qo&&(this.Ko=this.Qo)}jo(){this.$o!==null&&(this.$o.skipDelay(),this.$o=null)}cancel(){this.$o!==null&&(this.$o.cancel(),this.$o=null)}zo(){return(Math.random()-.5)*this.Ko}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rg{constructor(e,t,s,i,r,o,l,c){this.ui=e,this.Ho=s,this.Jo=i,this.connection=r,this.authCredentialsProvider=o,this.appCheckCredentialsProvider=l,this.listener=c,this.state=0,this.Yo=0,this.Zo=null,this.Xo=null,this.stream=null,this.e_=0,this.t_=new eh(e,t)}n_(){return this.state===1||this.state===5||this.r_()}r_(){return this.state===2||this.state===3}start(){this.e_=0,this.state!==4?this.auth():this.i_()}async stop(){this.n_()&&await this.close(0)}s_(){this.state=0,this.t_.reset()}o_(){this.r_()&&this.Zo===null&&(this.Zo=this.ui.enqueueAfterDelay(this.Ho,6e4,()=>this.__()))}a_(e){this.u_(),this.stream.send(e)}async __(){if(this.r_())return this.close(0)}u_(){this.Zo&&(this.Zo.cancel(),this.Zo=null)}c_(){this.Xo&&(this.Xo.cancel(),this.Xo=null)}async close(e,t){this.u_(),this.c_(),this.t_.cancel(),this.Yo++,e!==4?this.t_.reset():t&&t.code===P.RESOURCE_EXHAUSTED?(rn(t.toString()),rn("Using maximum backoff delay to prevent overloading the backend."),this.t_.Wo()):t&&t.code===P.UNAUTHENTICATED&&this.state!==3&&(this.authCredentialsProvider.invalidateToken(),this.appCheckCredentialsProvider.invalidateToken()),this.stream!==null&&(this.l_(),this.stream.close(),this.stream=null),this.state=e,await this.listener.mo(t)}l_(){}auth(){this.state=1;const e=this.h_(this.Yo),t=this.Yo;Promise.all([this.authCredentialsProvider.getToken(),this.appCheckCredentialsProvider.getToken()]).then(([s,i])=>{this.Yo===t&&this.P_(s,i)},s=>{e(()=>{const i=new M(P.UNKNOWN,"Fetching auth token failed: "+s.message);return this.I_(i)})})}P_(e,t){const s=this.h_(this.Yo);this.stream=this.T_(e,t),this.stream.Eo(()=>{s(()=>this.listener.Eo())}),this.stream.Ro(()=>{s(()=>(this.state=2,this.Xo=this.ui.enqueueAfterDelay(this.Jo,1e4,()=>(this.r_()&&(this.state=3),Promise.resolve())),this.listener.Ro()))}),this.stream.mo(i=>{s(()=>this.I_(i))}),this.stream.onMessage(i=>{s(()=>++this.e_==1?this.E_(i):this.onNext(i))})}i_(){this.state=5,this.t_.Go(async()=>{this.state=0,this.start()})}I_(e){return B("PersistentStream",`close with error: ${e}`),this.stream=null,this.close(4,e)}h_(e){return t=>{this.ui.enqueueAndForget(()=>this.Yo===e?t():(B("PersistentStream","stream callback skipped by getCloseGuardedDispatcher."),Promise.resolve()))}}}class y0 extends rg{constructor(e,t,s,i,r,o){super(e,"listen_stream_connection_backoff","listen_stream_idle","health_check_timeout",t,s,i,o),this.serializer=r}T_(e,t){return this.connection.Bo("Listen",e,t)}E_(e){return this.onNext(e)}onNext(e){this.t_.reset();const t=NI(this.serializer,e),s=function(r){if(!("targetChange"in r))return H.min();const o=r.targetChange;return o.targetIds&&o.targetIds.length?H.min():o.readTime?ft(o.readTime):H.min()}(e);return this.listener.d_(t,s)}A_(e){const t={};t.database=Jl(this.serializer),t.addTarget=function(r,o){let l;const c=o.target;if(l=Hl(c)?{documents:LI(r,c)}:{query:xI(r,c)._t},l.targetId=o.targetId,o.resumeToken.approximateByteSize()>0){l.resumeToken=Qm(r,o.resumeToken);const h=Ql(r,o.expectedCount);h!==null&&(l.expectedCount=h)}else if(o.snapshotVersion.compareTo(H.min())>0){l.readTime=Vo(r,o.snapshotVersion.toTimestamp());const h=Ql(r,o.expectedCount);h!==null&&(l.expectedCount=h)}return l}(this.serializer,e);const s=MI(this.serializer,e);s&&(t.labels=s),this.a_(t)}R_(e){const t={};t.database=Jl(this.serializer),t.removeTarget=e,this.a_(t)}}class v0 extends rg{constructor(e,t,s,i,r,o){super(e,"write_stream_connection_backoff","write_stream_idle","health_check_timeout",t,s,i,o),this.serializer=r}get V_(){return this.e_>0}start(){this.lastStreamToken=void 0,super.start()}l_(){this.V_&&this.m_([])}T_(e,t){return this.connection.Bo("Write",e,t)}E_(e){return re(!!e.streamToken),this.lastStreamToken=e.streamToken,re(!e.writeResults||e.writeResults.length===0),this.listener.f_()}onNext(e){re(!!e.streamToken),this.lastStreamToken=e.streamToken,this.t_.reset();const t=DI(e.writeResults,e.commitTime),s=ft(e.commitTime);return this.listener.g_(s,t)}p_(){const e={};e.database=Jl(this.serializer),this.a_(e)}m_(e){const t={streamToken:this.lastStreamToken,writes:e.map(s=>Zm(this.serializer,s))};this.a_(t)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class E0 extends class{}{constructor(e,t,s,i){super(),this.authCredentials=e,this.appCheckCredentials=t,this.connection=s,this.serializer=i,this.y_=!1}w_(){if(this.y_)throw new M(P.FAILED_PRECONDITION,"The client has already been terminated.")}Mo(e,t,s,i){return this.w_(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([r,o])=>this.connection.Mo(e,Yl(t,s),i,r,o)).catch(r=>{throw r.name==="FirebaseError"?(r.code===P.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),r):new M(P.UNKNOWN,r.toString())})}Lo(e,t,s,i,r){return this.w_(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([o,l])=>this.connection.Lo(e,Yl(t,s),i,o,l,r)).catch(o=>{throw o.name==="FirebaseError"?(o.code===P.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),o):new M(P.UNKNOWN,o.toString())})}terminate(){this.y_=!0,this.connection.terminate()}}class w0{constructor(e,t){this.asyncQueue=e,this.onlineStateHandler=t,this.state="Unknown",this.S_=0,this.b_=null,this.D_=!0}v_(){this.S_===0&&(this.C_("Unknown"),this.b_=this.asyncQueue.enqueueAfterDelay("online_state_timeout",1e4,()=>(this.b_=null,this.F_("Backend didn't respond within 10 seconds."),this.C_("Offline"),Promise.resolve())))}M_(e){this.state==="Online"?this.C_("Unknown"):(this.S_++,this.S_>=1&&(this.x_(),this.F_(`Connection failed 1 times. Most recent error: ${e.toString()}`),this.C_("Offline")))}set(e){this.x_(),this.S_=0,e==="Online"&&(this.D_=!1),this.C_(e)}C_(e){e!==this.state&&(this.state=e,this.onlineStateHandler(e))}F_(e){const t=`Could not reach Cloud Firestore backend. ${e}
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
 */class T0{constructor(e,t,s,i,r){this.localStore=e,this.datastore=t,this.asyncQueue=s,this.remoteSyncer={},this.O_=[],this.N_=new Map,this.L_=new Set,this.B_=[],this.k_=r,this.k_._o(o=>{s.enqueueAndForget(async()=>{cs(this)&&(B("RemoteStore","Restarting streams for network reachability change."),await async function(c){const h=Q(c);h.L_.add(4),await wr(h),h.q_.set("Unknown"),h.L_.delete(4),await _a(h)}(this))})}),this.q_=new w0(s,i)}}async function _a(n){if(cs(n))for(const e of n.B_)await e(!0)}async function wr(n){for(const e of n.B_)await e(!1)}function og(n,e){const t=Q(n);t.N_.has(e.targetId)||(t.N_.set(e.targetId,e),ih(t)?sh(t):ti(t).r_()&&nh(t,e))}function th(n,e){const t=Q(n),s=ti(t);t.N_.delete(e),s.r_()&&ag(t,e),t.N_.size===0&&(s.r_()?s.o_():cs(t)&&t.q_.set("Unknown"))}function nh(n,e){if(n.Q_.xe(e.targetId),e.resumeToken.approximateByteSize()>0||e.snapshotVersion.compareTo(H.min())>0){const t=n.remoteSyncer.getRemoteKeysForTarget(e.targetId).size;e=e.withExpectedCount(t)}ti(n).A_(e)}function ag(n,e){n.Q_.xe(e),ti(n).R_(e)}function sh(n){n.Q_=new II({getRemoteKeysForTarget:e=>n.remoteSyncer.getRemoteKeysForTarget(e),ot:e=>n.N_.get(e)||null,tt:()=>n.datastore.serializer.databaseId}),ti(n).start(),n.q_.v_()}function ih(n){return cs(n)&&!ti(n).n_()&&n.N_.size>0}function cs(n){return Q(n).L_.size===0}function lg(n){n.Q_=void 0}async function I0(n){n.q_.set("Online")}async function C0(n){n.N_.forEach((e,t)=>{nh(n,e)})}async function b0(n,e){lg(n),ih(n)?(n.q_.M_(e),sh(n)):n.q_.set("Unknown")}async function R0(n,e,t){if(n.q_.set("Online"),e instanceof Km&&e.state===2&&e.cause)try{await async function(i,r){const o=r.cause;for(const l of r.targetIds)i.N_.has(l)&&(await i.remoteSyncer.rejectListen(l,o),i.N_.delete(l),i.Q_.removeTarget(l))}(n,e)}catch(s){B("RemoteStore","Failed to remove targets %s: %s ",e.targetIds.join(","),s),await Bo(n,s)}else if(e instanceof fo?n.Q_.Ke(e):e instanceof Hm?n.Q_.He(e):n.Q_.We(e),!t.isEqual(H.min()))try{const s=await ig(n.localStore);t.compareTo(s)>=0&&await function(r,o){const l=r.Q_.rt(o);return l.targetChanges.forEach((c,h)=>{if(c.resumeToken.approximateByteSize()>0){const d=r.N_.get(h);d&&r.N_.set(h,d.withResumeToken(c.resumeToken,o))}}),l.targetMismatches.forEach((c,h)=>{const d=r.N_.get(c);if(!d)return;r.N_.set(c,d.withResumeToken($e.EMPTY_BYTE_STRING,d.snapshotVersion)),ag(r,c);const p=new En(d.target,c,h,d.sequenceNumber);nh(r,p)}),r.remoteSyncer.applyRemoteEvent(l)}(n,t)}catch(s){B("RemoteStore","Failed to raise snapshot:",s),await Bo(n,s)}}async function Bo(n,e,t){if(!gr(e))throw e;n.L_.add(1),await wr(n),n.q_.set("Offline"),t||(t=()=>ig(n.localStore)),n.asyncQueue.enqueueRetryable(async()=>{B("RemoteStore","Retrying IndexedDB access"),await t(),n.L_.delete(1),await _a(n)})}function cg(n,e){return e().catch(t=>Bo(n,t,e))}async function ya(n){const e=Q(n),t=Ln(e);let s=e.O_.length>0?e.O_[e.O_.length-1].batchId:-1;for(;S0(e);)try{const i=await h0(e.localStore,s);if(i===null){e.O_.length===0&&t.o_();break}s=i.batchId,A0(e,i)}catch(i){await Bo(e,i)}hg(e)&&ug(e)}function S0(n){return cs(n)&&n.O_.length<10}function A0(n,e){n.O_.push(e);const t=Ln(n);t.r_()&&t.V_&&t.m_(e.mutations)}function hg(n){return cs(n)&&!Ln(n).n_()&&n.O_.length>0}function ug(n){Ln(n).start()}async function k0(n){Ln(n).p_()}async function P0(n){const e=Ln(n);for(const t of n.O_)e.m_(t.mutations)}async function N0(n,e,t){const s=n.O_.shift(),i=Kc.from(s,e,t);await cg(n,()=>n.remoteSyncer.applySuccessfulWrite(i)),await ya(n)}async function D0(n,e){e&&Ln(n).V_&&await async function(s,i){if(function(o){return zm(o)&&o!==P.ABORTED}(i.code)){const r=s.O_.shift();Ln(s).s_(),await cg(s,()=>s.remoteSyncer.rejectFailedWrite(r.batchId,i)),await ya(s)}}(n,e),hg(n)&&ug(n)}async function af(n,e){const t=Q(n);t.asyncQueue.verifyOperationInProgress(),B("RemoteStore","RemoteStore received new credentials");const s=cs(t);t.L_.add(3),await wr(t),s&&t.q_.set("Unknown"),await t.remoteSyncer.handleCredentialChange(e),t.L_.delete(3),await _a(t)}async function L0(n,e){const t=Q(n);e?(t.L_.delete(2),await _a(t)):e||(t.L_.add(2),await wr(t),t.q_.set("Unknown"))}function ti(n){return n.K_||(n.K_=function(t,s,i){const r=Q(t);return r.w_(),new y0(s,r.connection,r.authCredentials,r.appCheckCredentials,r.serializer,i)}(n.datastore,n.asyncQueue,{Eo:I0.bind(null,n),Ro:C0.bind(null,n),mo:b0.bind(null,n),d_:R0.bind(null,n)}),n.B_.push(async e=>{e?(n.K_.s_(),ih(n)?sh(n):n.q_.set("Unknown")):(await n.K_.stop(),lg(n))})),n.K_}function Ln(n){return n.U_||(n.U_=function(t,s,i){const r=Q(t);return r.w_(),new v0(s,r.connection,r.authCredentials,r.appCheckCredentials,r.serializer,i)}(n.datastore,n.asyncQueue,{Eo:()=>Promise.resolve(),Ro:k0.bind(null,n),mo:D0.bind(null,n),f_:P0.bind(null,n),g_:N0.bind(null,n)}),n.B_.push(async e=>{e?(n.U_.s_(),await ya(n)):(await n.U_.stop(),n.O_.length>0&&(B("RemoteStore",`Stopping write stream with ${n.O_.length} pending writes`),n.O_=[]))})),n.U_}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rh{constructor(e,t,s,i,r){this.asyncQueue=e,this.timerId=t,this.targetTimeMs=s,this.op=i,this.removalCallback=r,this.deferred=new Nt,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch(o=>{})}get promise(){return this.deferred.promise}static createAndSchedule(e,t,s,i,r){const o=Date.now()+s,l=new rh(e,t,o,i,r);return l.start(s),l}start(e){this.timerHandle=setTimeout(()=>this.handleDelayElapsed(),e)}skipDelay(){return this.handleDelayElapsed()}cancel(e){this.timerHandle!==null&&(this.clearTimeout(),this.deferred.reject(new M(P.CANCELLED,"Operation cancelled"+(e?": "+e:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget(()=>this.timerHandle!==null?(this.clearTimeout(),this.op().then(e=>this.deferred.resolve(e))):Promise.resolve())}clearTimeout(){this.timerHandle!==null&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}}function oh(n,e){if(rn("AsyncQueue",`${e}: ${n}`),gr(n))return new M(P.UNAVAILABLE,`${e}: ${n}`);throw n}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ls{constructor(e){this.comparator=e?(t,s)=>e(t,s)||W.comparator(t.key,s.key):(t,s)=>W.comparator(t.key,s.key),this.keyedMap=Li(),this.sortedSet=new Ae(this.comparator)}static emptySet(e){return new Ls(e.comparator)}has(e){return this.keyedMap.get(e)!=null}get(e){return this.keyedMap.get(e)}first(){return this.sortedSet.minKey()}last(){return this.sortedSet.maxKey()}isEmpty(){return this.sortedSet.isEmpty()}indexOf(e){const t=this.keyedMap.get(e);return t?this.sortedSet.indexOf(t):-1}get size(){return this.sortedSet.size}forEach(e){this.sortedSet.inorderTraversal((t,s)=>(e(t),!1))}add(e){const t=this.delete(e.key);return t.copy(t.keyedMap.insert(e.key,e),t.sortedSet.insert(e,null))}delete(e){const t=this.get(e);return t?this.copy(this.keyedMap.remove(e),this.sortedSet.remove(t)):this}isEqual(e){if(!(e instanceof Ls)||this.size!==e.size)return!1;const t=this.sortedSet.getIterator(),s=e.sortedSet.getIterator();for(;t.hasNext();){const i=t.getNext().key,r=s.getNext().key;if(!i.isEqual(r))return!1}return!0}toString(){const e=[];return this.forEach(t=>{e.push(t.toString())}),e.length===0?"DocumentSet ()":`DocumentSet (
  `+e.join(`  
`)+`
)`}copy(e,t){const s=new Ls;return s.comparator=this.comparator,s.keyedMap=e,s.sortedSet=t,s}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class lf{constructor(){this.W_=new Ae(W.comparator)}track(e){const t=e.doc.key,s=this.W_.get(t);s?e.type!==0&&s.type===3?this.W_=this.W_.insert(t,e):e.type===3&&s.type!==1?this.W_=this.W_.insert(t,{type:s.type,doc:e.doc}):e.type===2&&s.type===2?this.W_=this.W_.insert(t,{type:2,doc:e.doc}):e.type===2&&s.type===0?this.W_=this.W_.insert(t,{type:0,doc:e.doc}):e.type===1&&s.type===0?this.W_=this.W_.remove(t):e.type===1&&s.type===2?this.W_=this.W_.insert(t,{type:1,doc:s.doc}):e.type===0&&s.type===1?this.W_=this.W_.insert(t,{type:2,doc:e.doc}):j():this.W_=this.W_.insert(t,e)}G_(){const e=[];return this.W_.inorderTraversal((t,s)=>{e.push(s)}),e}}class $s{constructor(e,t,s,i,r,o,l,c,h){this.query=e,this.docs=t,this.oldDocs=s,this.docChanges=i,this.mutatedKeys=r,this.fromCache=o,this.syncStateChanged=l,this.excludesMetadataChanges=c,this.hasCachedResults=h}static fromInitialDocuments(e,t,s,i,r){const o=[];return t.forEach(l=>{o.push({type:0,doc:l})}),new $s(e,t,Ls.emptySet(t),o,s,i,!0,!1,r)}get hasPendingWrites(){return!this.mutatedKeys.isEmpty()}isEqual(e){if(!(this.fromCache===e.fromCache&&this.hasCachedResults===e.hasCachedResults&&this.syncStateChanged===e.syncStateChanged&&this.mutatedKeys.isEqual(e.mutatedKeys)&&ua(this.query,e.query)&&this.docs.isEqual(e.docs)&&this.oldDocs.isEqual(e.oldDocs)))return!1;const t=this.docChanges,s=e.docChanges;if(t.length!==s.length)return!1;for(let i=0;i<t.length;i++)if(t[i].type!==s[i].type||!t[i].doc.isEqual(s[i].doc))return!1;return!0}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class x0{constructor(){this.z_=void 0,this.j_=[]}H_(){return this.j_.some(e=>e.J_())}}class O0{constructor(){this.queries=cf(),this.onlineState="Unknown",this.Y_=new Set}terminate(){(function(t,s){const i=Q(t),r=i.queries;i.queries=cf(),r.forEach((o,l)=>{for(const c of l.j_)c.onError(s)})})(this,new M(P.ABORTED,"Firestore shutting down"))}}function cf(){return new ei(n=>Dm(n),ua)}async function dg(n,e){const t=Q(n);let s=3;const i=e.query;let r=t.queries.get(i);r?!r.H_()&&e.J_()&&(s=2):(r=new x0,s=e.J_()?0:1);try{switch(s){case 0:r.z_=await t.onListen(i,!0);break;case 1:r.z_=await t.onListen(i,!1);break;case 2:await t.onFirstRemoteStoreListen(i)}}catch(o){const l=oh(o,`Initialization of query '${bs(e.query)}' failed`);return void e.onError(l)}t.queries.set(i,r),r.j_.push(e),e.Z_(t.onlineState),r.z_&&e.X_(r.z_)&&ah(t)}async function fg(n,e){const t=Q(n),s=e.query;let i=3;const r=t.queries.get(s);if(r){const o=r.j_.indexOf(e);o>=0&&(r.j_.splice(o,1),r.j_.length===0?i=e.J_()?0:1:!r.H_()&&e.J_()&&(i=2))}switch(i){case 0:return t.queries.delete(s),t.onUnlisten(s,!0);case 1:return t.queries.delete(s),t.onUnlisten(s,!1);case 2:return t.onLastRemoteStoreUnlisten(s);default:return}}function M0(n,e){const t=Q(n);let s=!1;for(const i of e){const r=i.query,o=t.queries.get(r);if(o){for(const l of o.j_)l.X_(i)&&(s=!0);o.z_=i}}s&&ah(t)}function V0(n,e,t){const s=Q(n),i=s.queries.get(e);if(i)for(const r of i.j_)r.onError(t);s.queries.delete(e)}function ah(n){n.Y_.forEach(e=>{e.next()})}var Zl,hf;(hf=Zl||(Zl={})).ea="default",hf.Cache="cache";class pg{constructor(e,t,s){this.query=e,this.ta=t,this.na=!1,this.ra=null,this.onlineState="Unknown",this.options=s||{}}X_(e){if(!this.options.includeMetadataChanges){const s=[];for(const i of e.docChanges)i.type!==3&&s.push(i);e=new $s(e.query,e.docs,e.oldDocs,s,e.mutatedKeys,e.fromCache,e.syncStateChanged,!0,e.hasCachedResults)}let t=!1;return this.na?this.ia(e)&&(this.ta.next(e),t=!0):this.sa(e,this.onlineState)&&(this.oa(e),t=!0),this.ra=e,t}onError(e){this.ta.error(e)}Z_(e){this.onlineState=e;let t=!1;return this.ra&&!this.na&&this.sa(this.ra,e)&&(this.oa(this.ra),t=!0),t}sa(e,t){if(!e.fromCache||!this.J_())return!0;const s=t!=="Offline";return(!this.options._a||!s)&&(!e.docs.isEmpty()||e.hasCachedResults||t==="Offline")}ia(e){if(e.docChanges.length>0)return!0;const t=this.ra&&this.ra.hasPendingWrites!==e.hasPendingWrites;return!(!e.syncStateChanged&&!t)&&this.options.includeMetadataChanges===!0}oa(e){e=$s.fromInitialDocuments(e.query,e.docs,e.mutatedKeys,e.fromCache,e.hasCachedResults),this.na=!0,this.ta.next(e)}J_(){return this.options.source!==Zl.Cache}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class mg{constructor(e){this.key=e}}class gg{constructor(e){this.key=e}}class F0{constructor(e,t){this.query=e,this.Ta=t,this.Ea=null,this.hasCachedResults=!1,this.current=!1,this.da=ne(),this.mutatedKeys=ne(),this.Aa=Lm(e),this.Ra=new Ls(this.Aa)}get Va(){return this.Ta}ma(e,t){const s=t?t.fa:new lf,i=t?t.Ra:this.Ra;let r=t?t.mutatedKeys:this.mutatedKeys,o=i,l=!1;const c=this.query.limitType==="F"&&i.size===this.query.limit?i.last():null,h=this.query.limitType==="L"&&i.size===this.query.limit?i.first():null;if(e.inorderTraversal((d,p)=>{const m=i.get(d),E=da(this.query,p)?p:null,C=!!m&&this.mutatedKeys.has(m.key),S=!!E&&(E.hasLocalMutations||this.mutatedKeys.has(E.key)&&E.hasCommittedMutations);let k=!1;m&&E?m.data.isEqual(E.data)?C!==S&&(s.track({type:3,doc:E}),k=!0):this.ga(m,E)||(s.track({type:2,doc:E}),k=!0,(c&&this.Aa(E,c)>0||h&&this.Aa(E,h)<0)&&(l=!0)):!m&&E?(s.track({type:0,doc:E}),k=!0):m&&!E&&(s.track({type:1,doc:m}),k=!0,(c||h)&&(l=!0)),k&&(E?(o=o.add(E),r=S?r.add(d):r.delete(d)):(o=o.delete(d),r=r.delete(d)))}),this.query.limit!==null)for(;o.size>this.query.limit;){const d=this.query.limitType==="F"?o.last():o.first();o=o.delete(d.key),r=r.delete(d.key),s.track({type:1,doc:d})}return{Ra:o,fa:s,ns:l,mutatedKeys:r}}ga(e,t){return e.hasLocalMutations&&t.hasCommittedMutations&&!t.hasLocalMutations}applyChanges(e,t,s,i){const r=this.Ra;this.Ra=e.Ra,this.mutatedKeys=e.mutatedKeys;const o=e.fa.G_();o.sort((d,p)=>function(E,C){const S=k=>{switch(k){case 0:return 1;case 2:case 3:return 2;case 1:return 0;default:return j()}};return S(E)-S(C)}(d.type,p.type)||this.Aa(d.doc,p.doc)),this.pa(s),i=i!=null&&i;const l=t&&!i?this.ya():[],c=this.da.size===0&&this.current&&!i?1:0,h=c!==this.Ea;return this.Ea=c,o.length!==0||h?{snapshot:new $s(this.query,e.Ra,r,o,e.mutatedKeys,c===0,h,!1,!!s&&s.resumeToken.approximateByteSize()>0),wa:l}:{wa:l}}Z_(e){return this.current&&e==="Offline"?(this.current=!1,this.applyChanges({Ra:this.Ra,fa:new lf,mutatedKeys:this.mutatedKeys,ns:!1},!1)):{wa:[]}}Sa(e){return!this.Ta.has(e)&&!!this.Ra.has(e)&&!this.Ra.get(e).hasLocalMutations}pa(e){e&&(e.addedDocuments.forEach(t=>this.Ta=this.Ta.add(t)),e.modifiedDocuments.forEach(t=>{}),e.removedDocuments.forEach(t=>this.Ta=this.Ta.delete(t)),this.current=e.current)}ya(){if(!this.current)return[];const e=this.da;this.da=ne(),this.Ra.forEach(s=>{this.Sa(s.key)&&(this.da=this.da.add(s.key))});const t=[];return e.forEach(s=>{this.da.has(s)||t.push(new gg(s))}),this.da.forEach(s=>{e.has(s)||t.push(new mg(s))}),t}ba(e){this.Ta=e.Ts,this.da=ne();const t=this.ma(e.documents);return this.applyChanges(t,!0)}Da(){return $s.fromInitialDocuments(this.query,this.Ra,this.mutatedKeys,this.Ea===0,this.hasCachedResults)}}class B0{constructor(e,t,s){this.query=e,this.targetId=t,this.view=s}}class U0{constructor(e){this.key=e,this.va=!1}}class q0{constructor(e,t,s,i,r,o){this.localStore=e,this.remoteStore=t,this.eventManager=s,this.sharedClientState=i,this.currentUser=r,this.maxConcurrentLimboResolutions=o,this.Ca={},this.Fa=new ei(l=>Dm(l),ua),this.Ma=new Map,this.xa=new Set,this.Oa=new Ae(W.comparator),this.Na=new Map,this.La=new Jc,this.Ba={},this.ka=new Map,this.qa=Ws.kn(),this.onlineState="Unknown",this.Qa=void 0}get isPrimaryClient(){return this.Qa===!0}}async function W0(n,e,t=!0){const s=Tg(n);let i;const r=s.Fa.get(e);return r?(s.sharedClientState.addLocalQueryTarget(r.targetId),i=r.view.Da()):i=await _g(s,e,t,!0),i}async function $0(n,e){const t=Tg(n);await _g(t,e,!0,!1)}async function _g(n,e,t,s){const i=await u0(n.localStore,Dt(e)),r=i.targetId,o=n.sharedClientState.addLocalQueryTarget(r,t);let l;return s&&(l=await j0(n,e,r,o==="current",i.resumeToken)),n.isPrimaryClient&&t&&og(n.remoteStore,i),l}async function j0(n,e,t,s,i){n.Ka=(p,m,E)=>async function(S,k,F,U){let q=k.view.ma(F);q.ns&&(q=await sf(S.localStore,k.query,!1).then(({documents:I})=>k.view.ma(I,q)));const ee=U&&U.targetChanges.get(k.targetId),he=U&&U.targetMismatches.get(k.targetId)!=null,de=k.view.applyChanges(q,S.isPrimaryClient,ee,he);return df(S,k.targetId,de.wa),de.snapshot}(n,p,m,E);const r=await sf(n.localStore,e,!0),o=new F0(e,r.Ts),l=o.ma(r.documents),c=Er.createSynthesizedTargetChangeForCurrentChange(t,s&&n.onlineState!=="Offline",i),h=o.applyChanges(l,n.isPrimaryClient,c);df(n,t,h.wa);const d=new B0(e,t,o);return n.Fa.set(e,d),n.Ma.has(t)?n.Ma.get(t).push(e):n.Ma.set(t,[e]),h.snapshot}async function z0(n,e,t){const s=Q(n),i=s.Fa.get(e),r=s.Ma.get(i.targetId);if(r.length>1)return s.Ma.set(i.targetId,r.filter(o=>!ua(o,e))),void s.Fa.delete(e);s.isPrimaryClient?(s.sharedClientState.removeLocalQueryTarget(i.targetId),s.sharedClientState.isActiveQueryTarget(i.targetId)||await Xl(s.localStore,i.targetId,!1).then(()=>{s.sharedClientState.clearQueryState(i.targetId),t&&th(s.remoteStore,i.targetId),ec(s,i.targetId)}).catch(mr)):(ec(s,i.targetId),await Xl(s.localStore,i.targetId,!0))}async function G0(n,e){const t=Q(n),s=t.Fa.get(e),i=t.Ma.get(s.targetId);t.isPrimaryClient&&i.length===1&&(t.sharedClientState.removeLocalQueryTarget(s.targetId),th(t.remoteStore,s.targetId))}async function H0(n,e,t){const s=eC(n);try{const i=await function(o,l){const c=Q(o),h=De.now(),d=l.reduce((E,C)=>E.add(C.key),ne());let p,m;return c.persistence.runTransaction("Locally write mutations","readwrite",E=>{let C=on(),S=ne();return c.cs.getEntries(E,d).next(k=>{C=k,C.forEach((F,U)=>{U.isValidDocument()||(S=S.add(F))})}).next(()=>c.localDocuments.getOverlayedDocuments(E,C)).next(k=>{p=k;const F=[];for(const U of l){const q=_I(U,p.get(U.key).overlayedDocument);q!=null&&F.push(new Fn(U.key,q,Cm(q.value.mapValue),rt.exists(!0)))}return c.mutationQueue.addMutationBatch(E,h,F,l)}).next(k=>{m=k;const F=k.applyToLocalDocumentSet(p,S);return c.documentOverlayCache.saveOverlays(E,k.batchId,F)})}).then(()=>({batchId:m.batchId,changes:Om(p)}))}(s.localStore,e);s.sharedClientState.addPendingMutation(i.batchId),function(o,l,c){let h=o.Ba[o.currentUser.toKey()];h||(h=new Ae(ae)),h=h.insert(l,c),o.Ba[o.currentUser.toKey()]=h}(s,i.batchId,t),await Tr(s,i.changes),await ya(s.remoteStore)}catch(i){const r=oh(i,"Failed to persist write");t.reject(r)}}async function yg(n,e){const t=Q(n);try{const s=await l0(t.localStore,e);e.targetChanges.forEach((i,r)=>{const o=t.Na.get(r);o&&(re(i.addedDocuments.size+i.modifiedDocuments.size+i.removedDocuments.size<=1),i.addedDocuments.size>0?o.va=!0:i.modifiedDocuments.size>0?re(o.va):i.removedDocuments.size>0&&(re(o.va),o.va=!1))}),await Tr(t,s,e)}catch(s){await mr(s)}}function uf(n,e,t){const s=Q(n);if(s.isPrimaryClient&&t===0||!s.isPrimaryClient&&t===1){const i=[];s.Fa.forEach((r,o)=>{const l=o.view.Z_(e);l.snapshot&&i.push(l.snapshot)}),function(o,l){const c=Q(o);c.onlineState=l;let h=!1;c.queries.forEach((d,p)=>{for(const m of p.j_)m.Z_(l)&&(h=!0)}),h&&ah(c)}(s.eventManager,e),i.length&&s.Ca.d_(i),s.onlineState=e,s.isPrimaryClient&&s.sharedClientState.setOnlineState(e)}}async function K0(n,e,t){const s=Q(n);s.sharedClientState.updateQueryState(e,"rejected",t);const i=s.Na.get(e),r=i&&i.key;if(r){let o=new Ae(W.comparator);o=o.insert(r,Ve.newNoDocument(r,H.min()));const l=ne().add(r),c=new ma(H.min(),new Map,new Ae(ae),o,l);await yg(s,c),s.Oa=s.Oa.remove(r),s.Na.delete(e),lh(s)}else await Xl(s.localStore,e,!1).then(()=>ec(s,e,t)).catch(mr)}async function Q0(n,e){const t=Q(n),s=e.batch.batchId;try{const i=await a0(t.localStore,e);Eg(t,s,null),vg(t,s),t.sharedClientState.updateMutationState(s,"acknowledged"),await Tr(t,i)}catch(i){await mr(i)}}async function Y0(n,e,t){const s=Q(n);try{const i=await function(o,l){const c=Q(o);return c.persistence.runTransaction("Reject batch","readwrite-primary",h=>{let d;return c.mutationQueue.lookupMutationBatch(h,l).next(p=>(re(p!==null),d=p.keys(),c.mutationQueue.removeMutationBatch(h,p))).next(()=>c.mutationQueue.performConsistencyCheck(h)).next(()=>c.documentOverlayCache.removeOverlaysForBatchId(h,d,l)).next(()=>c.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(h,d)).next(()=>c.localDocuments.getDocuments(h,d))})}(s.localStore,e);Eg(s,e,t),vg(s,e),s.sharedClientState.updateMutationState(e,"rejected",t),await Tr(s,i)}catch(i){await mr(i)}}function vg(n,e){(n.ka.get(e)||[]).forEach(t=>{t.resolve()}),n.ka.delete(e)}function Eg(n,e,t){const s=Q(n);let i=s.Ba[s.currentUser.toKey()];if(i){const r=i.get(e);r&&(t?r.reject(t):r.resolve(),i=i.remove(e)),s.Ba[s.currentUser.toKey()]=i}}function ec(n,e,t=null){n.sharedClientState.removeLocalQueryTarget(e);for(const s of n.Ma.get(e))n.Fa.delete(s),t&&n.Ca.$a(s,t);n.Ma.delete(e),n.isPrimaryClient&&n.La.gr(e).forEach(s=>{n.La.containsKey(s)||wg(n,s)})}function wg(n,e){n.xa.delete(e.path.canonicalString());const t=n.Oa.get(e);t!==null&&(th(n.remoteStore,t),n.Oa=n.Oa.remove(e),n.Na.delete(t),lh(n))}function df(n,e,t){for(const s of t)s instanceof mg?(n.La.addReference(s.key,e),J0(n,s)):s instanceof gg?(B("SyncEngine","Document no longer in limbo: "+s.key),n.La.removeReference(s.key,e),n.La.containsKey(s.key)||wg(n,s.key)):j()}function J0(n,e){const t=e.key,s=t.path.canonicalString();n.Oa.get(t)||n.xa.has(s)||(B("SyncEngine","New document in limbo: "+t),n.xa.add(s),lh(n))}function lh(n){for(;n.xa.size>0&&n.Oa.size<n.maxConcurrentLimboResolutions;){const e=n.xa.values().next().value;n.xa.delete(e);const t=new W(me.fromString(e)),s=n.qa.next();n.Na.set(s,new U0(t)),n.Oa=n.Oa.insert(t,s),og(n.remoteStore,new En(Dt(zc(t.path)),s,"TargetPurposeLimboResolution",Bc.oe))}}async function Tr(n,e,t){const s=Q(n),i=[],r=[],o=[];s.Fa.isEmpty()||(s.Fa.forEach((l,c)=>{o.push(s.Ka(c,e,t).then(h=>{var d;if((h||t)&&s.isPrimaryClient){const p=h?!h.fromCache:(d=t==null?void 0:t.targetChanges.get(c.targetId))===null||d===void 0?void 0:d.current;s.sharedClientState.updateQueryState(c.targetId,p?"current":"not-current")}if(h){i.push(h);const p=Zc.Wi(c.targetId,h);r.push(p)}}))}),await Promise.all(o),s.Ca.d_(i),await async function(c,h){const d=Q(c);try{await d.persistence.runTransaction("notifyLocalViewChanges","readwrite",p=>N.forEach(h,m=>N.forEach(m.$i,E=>d.persistence.referenceDelegate.addReference(p,m.targetId,E)).next(()=>N.forEach(m.Ui,E=>d.persistence.referenceDelegate.removeReference(p,m.targetId,E)))))}catch(p){if(!gr(p))throw p;B("LocalStore","Failed to update sequence numbers: "+p)}for(const p of h){const m=p.targetId;if(!p.fromCache){const E=d.os.get(m),C=E.snapshotVersion,S=E.withLastLimboFreeSnapshotVersion(C);d.os=d.os.insert(m,S)}}}(s.localStore,r))}async function X0(n,e){const t=Q(n);if(!t.currentUser.isEqual(e)){B("SyncEngine","User change. New user:",e.toKey());const s=await sg(t.localStore,e);t.currentUser=e,function(r,o){r.ka.forEach(l=>{l.forEach(c=>{c.reject(new M(P.CANCELLED,o))})}),r.ka.clear()}(t,"'waitForPendingWrites' promise is rejected due to a user change."),t.sharedClientState.handleUserChange(e,s.removedBatchIds,s.addedBatchIds),await Tr(t,s.hs)}}function Z0(n,e){const t=Q(n),s=t.Na.get(e);if(s&&s.va)return ne().add(s.key);{let i=ne();const r=t.Ma.get(e);if(!r)return i;for(const o of r){const l=t.Fa.get(o);i=i.unionWith(l.view.Va)}return i}}function Tg(n){const e=Q(n);return e.remoteStore.remoteSyncer.applyRemoteEvent=yg.bind(null,e),e.remoteStore.remoteSyncer.getRemoteKeysForTarget=Z0.bind(null,e),e.remoteStore.remoteSyncer.rejectListen=K0.bind(null,e),e.Ca.d_=M0.bind(null,e.eventManager),e.Ca.$a=V0.bind(null,e.eventManager),e}function eC(n){const e=Q(n);return e.remoteStore.remoteSyncer.applySuccessfulWrite=Q0.bind(null,e),e.remoteStore.remoteSyncer.rejectFailedWrite=Y0.bind(null,e),e}class Uo{constructor(){this.kind="memory",this.synchronizeTabs=!1}async initialize(e){this.serializer=ga(e.databaseInfo.databaseId),this.sharedClientState=this.Wa(e),this.persistence=this.Ga(e),await this.persistence.start(),this.localStore=this.za(e),this.gcScheduler=this.ja(e,this.localStore),this.indexBackfillerScheduler=this.Ha(e,this.localStore)}ja(e,t){return null}Ha(e,t){return null}za(e){return o0(this.persistence,new i0,e.initialUser,this.serializer)}Ga(e){return new t0(Xc.Zr,this.serializer)}Wa(e){return new f0}async terminate(){var e,t;(e=this.gcScheduler)===null||e===void 0||e.stop(),(t=this.indexBackfillerScheduler)===null||t===void 0||t.stop(),this.sharedClientState.shutdown(),await this.persistence.shutdown()}}Uo.provider={build:()=>new Uo};class tc{async initialize(e,t){this.localStore||(this.localStore=e.localStore,this.sharedClientState=e.sharedClientState,this.datastore=this.createDatastore(t),this.remoteStore=this.createRemoteStore(t),this.eventManager=this.createEventManager(t),this.syncEngine=this.createSyncEngine(t,!e.synchronizeTabs),this.sharedClientState.onlineStateHandler=s=>uf(this.syncEngine,s,1),this.remoteStore.remoteSyncer.handleCredentialChange=X0.bind(null,this.syncEngine),await L0(this.remoteStore,this.syncEngine.isPrimaryClient))}createEventManager(e){return function(){return new O0}()}createDatastore(e){const t=ga(e.databaseInfo.databaseId),s=function(r){return new _0(r)}(e.databaseInfo);return function(r,o,l,c){return new E0(r,o,l,c)}(e.authCredentials,e.appCheckCredentials,s,t)}createRemoteStore(e){return function(s,i,r,o,l){return new T0(s,i,r,o,l)}(this.localStore,this.datastore,e.asyncQueue,t=>uf(this.syncEngine,t,0),function(){return of.D()?new of:new p0}())}createSyncEngine(e,t){return function(i,r,o,l,c,h,d){const p=new q0(i,r,o,l,c,h);return d&&(p.Qa=!0),p}(this.localStore,this.remoteStore,this.eventManager,this.sharedClientState,e.initialUser,e.maxConcurrentLimboResolutions,t)}async terminate(){var e,t;await async function(i){const r=Q(i);B("RemoteStore","RemoteStore shutting down."),r.L_.add(5),await wr(r),r.k_.shutdown(),r.q_.set("Unknown")}(this.remoteStore),(e=this.datastore)===null||e===void 0||e.terminate(),(t=this.eventManager)===null||t===void 0||t.terminate()}}tc.provider={build:()=>new tc};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
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
 */class Ig{constructor(e){this.observer=e,this.muted=!1}next(e){this.muted||this.observer.next&&this.Ya(this.observer.next,e)}error(e){this.muted||(this.observer.error?this.Ya(this.observer.error,e):rn("Uncaught Error in snapshot listener:",e.toString()))}Za(){this.muted=!0}Ya(e,t){setTimeout(()=>{this.muted||e(t)},0)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tC{constructor(e){this.datastore=e,this.readVersions=new Map,this.mutations=[],this.committed=!1,this.lastTransactionError=null,this.writtenDocs=new Set}async lookup(e){if(this.ensureCommitNotCalled(),this.mutations.length>0)throw this.lastTransactionError=new M(P.INVALID_ARGUMENT,"Firestore transactions require all reads to be executed before all writes."),this.lastTransactionError;const t=await async function(i,r){const o=Q(i),l={documents:r.map(p=>Fo(o.serializer,p))},c=await o.Lo("BatchGetDocuments",o.serializer.databaseId,me.emptyPath(),l,r.length),h=new Map;c.forEach(p=>{const m=PI(o.serializer,p);h.set(m.key.toString(),m)});const d=[];return r.forEach(p=>{const m=h.get(p.toString());re(!!m),d.push(m)}),d}(this.datastore,e);return t.forEach(s=>this.recordVersion(s)),t}set(e,t){this.write(t.toMutation(e,this.precondition(e))),this.writtenDocs.add(e.toString())}update(e,t){try{this.write(t.toMutation(e,this.preconditionForUpdate(e)))}catch(s){this.lastTransactionError=s}this.writtenDocs.add(e.toString())}delete(e){this.write(new Hc(e,this.precondition(e))),this.writtenDocs.add(e.toString())}async commit(){if(this.ensureCommitNotCalled(),this.lastTransactionError)throw this.lastTransactionError;const e=this.readVersions;this.mutations.forEach(t=>{e.delete(t.key.toString())}),e.forEach((t,s)=>{const i=W.fromPath(s);this.mutations.push(new jm(i,this.precondition(i)))}),await async function(s,i){const r=Q(s),o={writes:i.map(l=>Zm(r.serializer,l))};await r.Mo("Commit",r.serializer.databaseId,me.emptyPath(),o)}(this.datastore,this.mutations),this.committed=!0}recordVersion(e){let t;if(e.isFoundDocument())t=e.version;else{if(!e.isNoDocument())throw j();t=H.min()}const s=this.readVersions.get(e.key.toString());if(s){if(!t.isEqual(s))throw new M(P.ABORTED,"Document version changed between two reads.")}else this.readVersions.set(e.key.toString(),t)}precondition(e){const t=this.readVersions.get(e.toString());return!this.writtenDocs.has(e.toString())&&t?t.isEqual(H.min())?rt.exists(!1):rt.updateTime(t):rt.none()}preconditionForUpdate(e){const t=this.readVersions.get(e.toString());if(!this.writtenDocs.has(e.toString())&&t){if(t.isEqual(H.min()))throw new M(P.INVALID_ARGUMENT,"Can't update a document that doesn't exist.");return rt.updateTime(t)}return rt.exists(!0)}write(e){this.ensureCommitNotCalled(),this.mutations.push(e)}ensureCommitNotCalled(){}}/**
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
 */class nC{constructor(e,t,s,i,r){this.asyncQueue=e,this.datastore=t,this.options=s,this.updateFunction=i,this.deferred=r,this._u=s.maxAttempts,this.t_=new eh(this.asyncQueue,"transaction_retry")}au(){this._u-=1,this.uu()}uu(){this.t_.Go(async()=>{const e=new tC(this.datastore),t=this.cu(e);t&&t.then(s=>{this.asyncQueue.enqueueAndForget(()=>e.commit().then(()=>{this.deferred.resolve(s)}).catch(i=>{this.lu(i)}))}).catch(s=>{this.lu(s)})})}cu(e){try{const t=this.updateFunction(e);return!_r(t)&&t.catch&&t.then?t:(this.deferred.reject(Error("Transaction callback must return a Promise")),null)}catch(t){return this.deferred.reject(t),null}}lu(e){this._u>0&&this.hu(e)?(this._u-=1,this.asyncQueue.enqueueAndForget(()=>(this.uu(),Promise.resolve()))):this.deferred.reject(e)}hu(e){if(e.name==="FirebaseError"){const t=e.code;return t==="aborted"||t==="failed-precondition"||t==="already-exists"||!zm(t)}return!1}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class sC{constructor(e,t,s,i,r){this.authCredentials=e,this.appCheckCredentials=t,this.asyncQueue=s,this.databaseInfo=i,this.user=Je.UNAUTHENTICATED,this.clientId=wm.newId(),this.authCredentialListener=()=>Promise.resolve(),this.appCheckCredentialListener=()=>Promise.resolve(),this._uninitializedComponentsProvider=r,this.authCredentials.start(s,async o=>{B("FirestoreClient","Received user=",o.uid),await this.authCredentialListener(o),this.user=o}),this.appCheckCredentials.start(s,o=>(B("FirestoreClient","Received new app check token=",o),this.appCheckCredentialListener(o,this.user)))}get configuration(){return{asyncQueue:this.asyncQueue,databaseInfo:this.databaseInfo,clientId:this.clientId,authCredentials:this.authCredentials,appCheckCredentials:this.appCheckCredentials,initialUser:this.user,maxConcurrentLimboResolutions:100}}setCredentialChangeListener(e){this.authCredentialListener=e}setAppCheckTokenChangeListener(e){this.appCheckCredentialListener=e}terminate(){this.asyncQueue.enterRestrictedMode();const e=new Nt;return this.asyncQueue.enqueueAndForgetEvenWhileRestricted(async()=>{try{this._onlineComponents&&await this._onlineComponents.terminate(),this._offlineComponents&&await this._offlineComponents.terminate(),this.authCredentials.shutdown(),this.appCheckCredentials.shutdown(),e.resolve()}catch(t){const s=oh(t,"Failed to shutdown persistence");e.reject(s)}}),e.promise}}async function ul(n,e){n.asyncQueue.verifyOperationInProgress(),B("FirestoreClient","Initializing OfflineComponentProvider");const t=n.configuration;await e.initialize(t);let s=t.initialUser;n.setCredentialChangeListener(async i=>{s.isEqual(i)||(await sg(e.localStore,i),s=i)}),e.persistence.setDatabaseDeletedListener(()=>n.terminate()),n._offlineComponents=e}async function ff(n,e){n.asyncQueue.verifyOperationInProgress();const t=await iC(n);B("FirestoreClient","Initializing OnlineComponentProvider"),await e.initialize(t,n.configuration),n.setCredentialChangeListener(s=>af(e.remoteStore,s)),n.setAppCheckTokenChangeListener((s,i)=>af(e.remoteStore,i)),n._onlineComponents=e}async function iC(n){if(!n._offlineComponents)if(n._uninitializedComponentsProvider){B("FirestoreClient","Using user provided OfflineComponentProvider");try{await ul(n,n._uninitializedComponentsProvider._offline)}catch(e){const t=e;if(!function(i){return i.name==="FirebaseError"?i.code===P.FAILED_PRECONDITION||i.code===P.UNIMPLEMENTED:!(typeof DOMException<"u"&&i instanceof DOMException)||i.code===22||i.code===20||i.code===11}(t))throw t;Fs("Error using user provided cache. Falling back to memory cache: "+t),await ul(n,new Uo)}}else B("FirestoreClient","Using default OfflineComponentProvider"),await ul(n,new Uo);return n._offlineComponents}async function ch(n){return n._onlineComponents||(n._uninitializedComponentsProvider?(B("FirestoreClient","Using user provided OnlineComponentProvider"),await ff(n,n._uninitializedComponentsProvider._online)):(B("FirestoreClient","Using default OnlineComponentProvider"),await ff(n,new tc))),n._onlineComponents}function rC(n){return ch(n).then(e=>e.syncEngine)}function oC(n){return ch(n).then(e=>e.datastore)}async function Cg(n){const e=await ch(n),t=e.eventManager;return t.onListen=W0.bind(null,e.syncEngine),t.onUnlisten=z0.bind(null,e.syncEngine),t.onFirstRemoteStoreListen=$0.bind(null,e.syncEngine),t.onLastRemoteStoreUnlisten=G0.bind(null,e.syncEngine),t}function aC(n,e,t={}){const s=new Nt;return n.asyncQueue.enqueueAndForget(async()=>function(r,o,l,c,h){const d=new Ig({next:m=>{d.Za(),o.enqueueAndForget(()=>fg(r,p));const E=m.docs.has(l);!E&&m.fromCache?h.reject(new M(P.UNAVAILABLE,"Failed to get document because the client is offline.")):E&&m.fromCache&&c&&c.source==="server"?h.reject(new M(P.UNAVAILABLE,'Failed to get document from server. (However, this document does exist in the local cache. Run again without setting source to "server" to retrieve the cached document.)')):h.resolve(m)},error:m=>h.reject(m)}),p=new pg(zc(l.path),d,{includeMetadataChanges:!0,_a:!0});return dg(r,p)}(await Cg(n),n.asyncQueue,e,t,s)),s.promise}function lC(n,e,t={}){const s=new Nt;return n.asyncQueue.enqueueAndForget(async()=>function(r,o,l,c,h){const d=new Ig({next:m=>{d.Za(),o.enqueueAndForget(()=>fg(r,p)),m.fromCache&&c.source==="server"?h.reject(new M(P.UNAVAILABLE,'Failed to get documents from server. (However, these documents may exist in the local cache. Run again without setting source to "server" to retrieve the cached documents.)')):h.resolve(m)},error:m=>h.reject(m)}),p=new pg(l,d,{includeMetadataChanges:!0,_a:!0});return dg(r,p)}(await Cg(n),n.asyncQueue,e,t,s)),s.promise}/**
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
 */function bg(n){const e={};return n.timeoutSeconds!==void 0&&(e.timeoutSeconds=n.timeoutSeconds),e}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const pf=new Map;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Rg(n,e,t){if(!t)throw new M(P.INVALID_ARGUMENT,`Function ${n}() cannot be called with an empty ${e}.`)}function cC(n,e,t,s){if(e===!0&&s===!0)throw new M(P.INVALID_ARGUMENT,`${n} and ${t} cannot be used together.`)}function mf(n){if(!W.isDocumentKey(n))throw new M(P.INVALID_ARGUMENT,`Invalid document reference. Document references must have an even number of segments, but ${n} has ${n.length}.`)}function gf(n){if(W.isDocumentKey(n))throw new M(P.INVALID_ARGUMENT,`Invalid collection reference. Collection references must have an odd number of segments, but ${n} has ${n.length}.`)}function va(n){if(n===void 0)return"undefined";if(n===null)return"null";if(typeof n=="string")return n.length>20&&(n=`${n.substring(0,20)}...`),JSON.stringify(n);if(typeof n=="number"||typeof n=="boolean")return""+n;if(typeof n=="object"){if(n instanceof Array)return"an array";{const e=function(s){return s.constructor?s.constructor.name:null}(n);return e?`a custom ${e} object`:"an object"}}return typeof n=="function"?"a function":j()}function Ot(n,e){if("_delegate"in n&&(n=n._delegate),!(n instanceof e)){if(e.name===n.constructor.name)throw new M(P.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{const t=va(n);throw new M(P.INVALID_ARGUMENT,`Expected type '${e.name}', but it was: ${t}`)}}return n}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _f{constructor(e){var t,s;if(e.host===void 0){if(e.ssl!==void 0)throw new M(P.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host="firestore.googleapis.com",this.ssl=!0}else this.host=e.host,this.ssl=(t=e.ssl)===null||t===void 0||t;if(this.credentials=e.credentials,this.ignoreUndefinedProperties=!!e.ignoreUndefinedProperties,this.localCache=e.localCache,e.cacheSizeBytes===void 0)this.cacheSizeBytes=41943040;else{if(e.cacheSizeBytes!==-1&&e.cacheSizeBytes<1048576)throw new M(P.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=e.cacheSizeBytes}cC("experimentalForceLongPolling",e.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",e.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!e.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:e.experimentalAutoDetectLongPolling===void 0?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!e.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=bg((s=e.experimentalLongPollingOptions)!==null&&s!==void 0?s:{}),function(r){if(r.timeoutSeconds!==void 0){if(isNaN(r.timeoutSeconds))throw new M(P.INVALID_ARGUMENT,`invalid long polling timeout: ${r.timeoutSeconds} (must not be NaN)`);if(r.timeoutSeconds<5)throw new M(P.INVALID_ARGUMENT,`invalid long polling timeout: ${r.timeoutSeconds} (minimum allowed value is 5)`);if(r.timeoutSeconds>30)throw new M(P.INVALID_ARGUMENT,`invalid long polling timeout: ${r.timeoutSeconds} (maximum allowed value is 30)`)}}(this.experimentalLongPollingOptions),this.useFetchStreams=!!e.useFetchStreams}isEqual(e){return this.host===e.host&&this.ssl===e.ssl&&this.credentials===e.credentials&&this.cacheSizeBytes===e.cacheSizeBytes&&this.experimentalForceLongPolling===e.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===e.experimentalAutoDetectLongPolling&&function(s,i){return s.timeoutSeconds===i.timeoutSeconds}(this.experimentalLongPollingOptions,e.experimentalLongPollingOptions)&&this.ignoreUndefinedProperties===e.ignoreUndefinedProperties&&this.useFetchStreams===e.useFetchStreams}}class Ea{constructor(e,t,s,i){this._authCredentials=e,this._appCheckCredentials=t,this._databaseId=s,this._app=i,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new _f({}),this._settingsFrozen=!1,this._terminateTask="notTerminated"}get app(){if(!this._app)throw new M(P.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return this._terminateTask!=="notTerminated"}_setSettings(e){if(this._settingsFrozen)throw new M(P.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new _f(e),e.credentials!==void 0&&(this._authCredentials=function(s){if(!s)return new RT;switch(s.type){case"firstParty":return new PT(s.sessionIndex||"0",s.iamToken||null,s.authTokenFactory||null);case"provider":return s.client;default:throw new M(P.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}}(e.credentials))}_getSettings(){return this._settings}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask==="notTerminated"&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){this._terminateTask==="notTerminated"?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return function(t){const s=pf.get(t);s&&(B("ComponentProvider","Removing Datastore"),pf.delete(t),s.terminate())}(this),Promise.resolve()}}function hC(n,e,t,s={}){var i;const r=(n=Ot(n,Ea))._getSettings(),o=`${e}:${t}`;if(r.host!=="firestore.googleapis.com"&&r.host!==o&&Fs("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used."),n._setSettings(Object.assign(Object.assign({},r),{host:o,ssl:!1})),s.mockUserToken){let l,c;if(typeof s.mockUserToken=="string")l=s.mockUserToken,c=Je.MOCK_USER;else{l=kp(s.mockUserToken,(i=n._app)===null||i===void 0?void 0:i.options.projectId);const h=s.mockUserToken.sub||s.mockUserToken.user_id;if(!h)throw new M(P.INVALID_ARGUMENT,"mockUserToken must contain 'sub' or 'user_id' field!");c=new Je(h)}n._authCredentials=new ST(new Em(l,c))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class hs{constructor(e,t,s){this.converter=t,this._query=s,this.type="query",this.firestore=e}withConverter(e){return new hs(this.firestore,e,this._query)}}class Ze{constructor(e,t,s){this.converter=t,this._key=s,this.type="document",this.firestore=e}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new Rn(this.firestore,this.converter,this._key.path.popLast())}withConverter(e){return new Ze(this.firestore,e,this._key)}}class Rn extends hs{constructor(e,t,s){super(e,t,zc(s)),this._path=s,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){const e=this._path.popLast();return e.isEmpty()?null:new Ze(this.firestore,null,new W(e))}withConverter(e){return new Rn(this.firestore,e,this._path)}}function eo(n,e,...t){if(n=ge(n),Rg("collection","path",e),n instanceof Ea){const s=me.fromString(e,...t);return gf(s),new Rn(n,null,s)}{if(!(n instanceof Ze||n instanceof Rn))throw new M(P.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const s=n._path.child(me.fromString(e,...t));return gf(s),new Rn(n.firestore,null,s)}}function Gt(n,e,...t){if(n=ge(n),arguments.length===1&&(e=wm.newId()),Rg("doc","path",e),n instanceof Ea){const s=me.fromString(e,...t);return mf(s),new Ze(n,null,new W(s))}{if(!(n instanceof Ze||n instanceof Rn))throw new M(P.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const s=n._path.child(me.fromString(e,...t));return mf(s),new Ze(n.firestore,n instanceof Rn?n.converter:null,new W(s))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yf{constructor(e=Promise.resolve()){this.Pu=[],this.Iu=!1,this.Tu=[],this.Eu=null,this.du=!1,this.Au=!1,this.Ru=[],this.t_=new eh(this,"async_queue_retry"),this.Vu=()=>{const s=hl();s&&B("AsyncQueue","Visibility state changed to "+s.visibilityState),this.t_.jo()},this.mu=e;const t=hl();t&&typeof t.addEventListener=="function"&&t.addEventListener("visibilitychange",this.Vu)}get isShuttingDown(){return this.Iu}enqueueAndForget(e){this.enqueue(e)}enqueueAndForgetEvenWhileRestricted(e){this.fu(),this.gu(e)}enterRestrictedMode(e){if(!this.Iu){this.Iu=!0,this.Au=e||!1;const t=hl();t&&typeof t.removeEventListener=="function"&&t.removeEventListener("visibilitychange",this.Vu)}}enqueue(e){if(this.fu(),this.Iu)return new Promise(()=>{});const t=new Nt;return this.gu(()=>this.Iu&&this.Au?Promise.resolve():(e().then(t.resolve,t.reject),t.promise)).then(()=>t.promise)}enqueueRetryable(e){this.enqueueAndForget(()=>(this.Pu.push(e),this.pu()))}async pu(){if(this.Pu.length!==0){try{await this.Pu[0](),this.Pu.shift(),this.t_.reset()}catch(e){if(!gr(e))throw e;B("AsyncQueue","Operation failed with retryable error: "+e)}this.Pu.length>0&&this.t_.Go(()=>this.pu())}}gu(e){const t=this.mu.then(()=>(this.du=!0,e().catch(s=>{this.Eu=s,this.du=!1;const i=function(o){let l=o.message||"";return o.stack&&(l=o.stack.includes(o.message)?o.stack:o.message+`
`+o.stack),l}(s);throw rn("INTERNAL UNHANDLED ERROR: ",i),s}).then(s=>(this.du=!1,s))));return this.mu=t,t}enqueueAfterDelay(e,t,s){this.fu(),this.Ru.indexOf(e)>-1&&(t=0);const i=rh.createAndSchedule(this,e,t,s,r=>this.yu(r));return this.Tu.push(i),i}fu(){this.Eu&&j()}verifyOperationInProgress(){}async wu(){let e;do e=this.mu,await e;while(e!==this.mu)}Su(e){for(const t of this.Tu)if(t.timerId===e)return!0;return!1}bu(e){return this.wu().then(()=>{this.Tu.sort((t,s)=>t.targetTimeMs-s.targetTimeMs);for(const t of this.Tu)if(t.skipDelay(),e!=="all"&&t.timerId===e)break;return this.wu()})}Du(e){this.Ru.push(e)}yu(e){const t=this.Tu.indexOf(e);this.Tu.splice(t,1)}}class ni extends Ea{constructor(e,t,s,i){super(e,t,s,i),this.type="firestore",this._queue=new yf,this._persistenceKey=(i==null?void 0:i.name)||"[DEFAULT]"}async _terminate(){if(this._firestoreClient){const e=this._firestoreClient.terminate();this._queue=new yf(e),this._firestoreClient=void 0,await e}}}function uC(n,e){const t=typeof n=="object"?n:Rc(),s=typeof n=="string"?n:"(default)",i=aa(t,"firestore").getImmediate({identifier:s});if(!i._initialized){const r=Rp("firestore");r&&hC(i,...r)}return i}function wa(n){if(n._terminated)throw new M(P.FAILED_PRECONDITION,"The client has already been terminated.");return n._firestoreClient||dC(n),n._firestoreClient}function dC(n){var e,t,s;const i=n._freezeSettings(),r=function(l,c,h,d){return new $T(l,c,h,d.host,d.ssl,d.experimentalForceLongPolling,d.experimentalAutoDetectLongPolling,bg(d.experimentalLongPollingOptions),d.useFetchStreams)}(n._databaseId,((e=n._app)===null||e===void 0?void 0:e.options.appId)||"",n._persistenceKey,i);n._componentsProvider||!((t=i.localCache)===null||t===void 0)&&t._offlineComponentProvider&&(!((s=i.localCache)===null||s===void 0)&&s._onlineComponentProvider)&&(n._componentsProvider={_offline:i.localCache._offlineComponentProvider,_online:i.localCache._onlineComponentProvider}),n._firestoreClient=new sC(n._authCredentials,n._appCheckCredentials,n._queue,r,n._componentsProvider&&function(l){const c=l==null?void 0:l._online.build();return{_offline:l==null?void 0:l._offline.build(c),_online:c}}(n._componentsProvider))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ss{constructor(e){this._byteString=e}static fromBase64String(e){try{return new ss($e.fromBase64String(e))}catch(t){throw new M(P.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+t)}}static fromUint8Array(e){return new ss($e.fromUint8Array(e))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(e){return this._byteString.isEqual(e._byteString)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ir{constructor(...e){for(let t=0;t<e.length;++t)if(e[t].length===0)throw new M(P.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new qe(e)}isEqual(e){return this._internalPath.isEqual(e._internalPath)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class hh{constructor(e){this._methodName=e}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class uh{constructor(e,t){if(!isFinite(e)||e<-90||e>90)throw new M(P.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+e);if(!isFinite(t)||t<-180||t>180)throw new M(P.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+t);this._lat=e,this._long=t}get latitude(){return this._lat}get longitude(){return this._long}isEqual(e){return this._lat===e._lat&&this._long===e._long}toJSON(){return{latitude:this._lat,longitude:this._long}}_compareTo(e){return ae(this._lat,e._lat)||ae(this._long,e._long)}}/**
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
 */class dh{constructor(e){this._values=(e||[]).map(t=>t)}toArray(){return this._values.map(e=>e)}isEqual(e){return function(s,i){if(s.length!==i.length)return!1;for(let r=0;r<s.length;++r)if(s[r]!==i[r])return!1;return!0}(this._values,e._values)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const fC=/^__.*__$/;class pC{constructor(e,t,s){this.data=e,this.fieldMask=t,this.fieldTransforms=s}toMutation(e,t){return this.fieldMask!==null?new Fn(e,this.data,this.fieldMask,t,this.fieldTransforms):new vr(e,this.data,t,this.fieldTransforms)}}class Sg{constructor(e,t,s){this.data=e,this.fieldMask=t,this.fieldTransforms=s}toMutation(e,t){return new Fn(e,this.data,this.fieldMask,t,this.fieldTransforms)}}function Ag(n){switch(n){case 0:case 2:case 1:return!0;case 3:case 4:return!1;default:throw j()}}class fh{constructor(e,t,s,i,r,o){this.settings=e,this.databaseId=t,this.serializer=s,this.ignoreUndefinedProperties=i,r===void 0&&this.vu(),this.fieldTransforms=r||[],this.fieldMask=o||[]}get path(){return this.settings.path}get Cu(){return this.settings.Cu}Fu(e){return new fh(Object.assign(Object.assign({},this.settings),e),this.databaseId,this.serializer,this.ignoreUndefinedProperties,this.fieldTransforms,this.fieldMask)}Mu(e){var t;const s=(t=this.path)===null||t===void 0?void 0:t.child(e),i=this.Fu({path:s,xu:!1});return i.Ou(e),i}Nu(e){var t;const s=(t=this.path)===null||t===void 0?void 0:t.child(e),i=this.Fu({path:s,xu:!1});return i.vu(),i}Lu(e){return this.Fu({path:void 0,xu:!0})}Bu(e){return qo(e,this.settings.methodName,this.settings.ku||!1,this.path,this.settings.qu)}contains(e){return this.fieldMask.find(t=>e.isPrefixOf(t))!==void 0||this.fieldTransforms.find(t=>e.isPrefixOf(t.field))!==void 0}vu(){if(this.path)for(let e=0;e<this.path.length;e++)this.Ou(this.path.get(e))}Ou(e){if(e.length===0)throw this.Bu("Document fields must not be empty");if(Ag(this.Cu)&&fC.test(e))throw this.Bu('Document fields cannot begin and end with "__"')}}class mC{constructor(e,t,s){this.databaseId=e,this.ignoreUndefinedProperties=t,this.serializer=s||ga(e)}Qu(e,t,s,i=!1){return new fh({Cu:e,methodName:t,qu:s,path:qe.emptyPath(),xu:!1,ku:i},this.databaseId,this.serializer,this.ignoreUndefinedProperties)}}function Ta(n){const e=n._freezeSettings(),t=ga(n._databaseId);return new mC(n._databaseId,!!e.ignoreUndefinedProperties,t)}function kg(n,e,t,s,i,r={}){const o=n.Qu(r.merge||r.mergeFields?2:0,e,t,i);ph("Data must be an object, but it was:",o,s);const l=Dg(s,o);let c,h;if(r.merge)c=new dt(o.fieldMask),h=o.fieldTransforms;else if(r.mergeFields){const d=[];for(const p of r.mergeFields){const m=nc(e,p,t);if(!o.contains(m))throw new M(P.INVALID_ARGUMENT,`Field '${m}' is specified in your field mask but missing from your input data.`);xg(d,m)||d.push(m)}c=new dt(d),h=o.fieldTransforms.filter(p=>c.covers(p.field))}else c=null,h=o.fieldTransforms;return new pC(new it(l),c,h)}class Ia extends hh{_toFieldTransform(e){if(e.Cu!==2)throw e.Cu===1?e.Bu(`${this._methodName}() can only appear at the top level of your update data`):e.Bu(`${this._methodName}() cannot be used with set() unless you pass {merge:true}`);return e.fieldMask.push(e.path),null}isEqual(e){return e instanceof Ia}}function Pg(n,e,t,s){const i=n.Qu(1,e,t);ph("Data must be an object, but it was:",i,s);const r=[],o=it.empty();ls(s,(c,h)=>{const d=mh(e,c,t);h=ge(h);const p=i.Nu(d);if(h instanceof Ia)r.push(d);else{const m=Cr(h,p);m!=null&&(r.push(d),o.set(d,m))}});const l=new dt(r);return new Sg(o,l,i.fieldTransforms)}function Ng(n,e,t,s,i,r){const o=n.Qu(1,e,t),l=[nc(e,s,t)],c=[i];if(r.length%2!=0)throw new M(P.INVALID_ARGUMENT,`Function ${e}() needs to be called with an even number of arguments that alternate between field names and values.`);for(let m=0;m<r.length;m+=2)l.push(nc(e,r[m])),c.push(r[m+1]);const h=[],d=it.empty();for(let m=l.length-1;m>=0;--m)if(!xg(h,l[m])){const E=l[m];let C=c[m];C=ge(C);const S=o.Nu(E);if(C instanceof Ia)h.push(E);else{const k=Cr(C,S);k!=null&&(h.push(E),d.set(E,k))}}const p=new dt(h);return new Sg(d,p,o.fieldTransforms)}function gC(n,e,t,s=!1){return Cr(t,n.Qu(s?4:3,e))}function Cr(n,e){if(Lg(n=ge(n)))return ph("Unsupported field value:",e,n),Dg(n,e);if(n instanceof hh)return function(s,i){if(!Ag(i.Cu))throw i.Bu(`${s._methodName}() can only be used with update() and set()`);if(!i.path)throw i.Bu(`${s._methodName}() is not currently supported inside arrays`);const r=s._toFieldTransform(i);r&&i.fieldTransforms.push(r)}(n,e),null;if(n===void 0&&e.ignoreUndefinedProperties)return null;if(e.path&&e.fieldMask.push(e.path),n instanceof Array){if(e.settings.xu&&e.Cu!==4)throw e.Bu("Nested arrays are not supported");return function(s,i){const r=[];let o=0;for(const l of s){let c=Cr(l,i.Lu(o));c==null&&(c={nullValue:"NULL_VALUE"}),r.push(c),o++}return{arrayValue:{values:r}}}(n,e)}return function(s,i){if((s=ge(s))===null)return{nullValue:"NULL_VALUE"};if(typeof s=="number")return uI(i.serializer,s);if(typeof s=="boolean")return{booleanValue:s};if(typeof s=="string")return{stringValue:s};if(s instanceof Date){const r=De.fromDate(s);return{timestampValue:Vo(i.serializer,r)}}if(s instanceof De){const r=new De(s.seconds,1e3*Math.floor(s.nanoseconds/1e3));return{timestampValue:Vo(i.serializer,r)}}if(s instanceof uh)return{geoPointValue:{latitude:s.latitude,longitude:s.longitude}};if(s instanceof ss)return{bytesValue:Qm(i.serializer,s._byteString)};if(s instanceof Ze){const r=i.databaseId,o=s.firestore._databaseId;if(!o.isEqual(r))throw i.Bu(`Document reference is for database ${o.projectId}/${o.database} but should be for database ${r.projectId}/${r.database}`);return{referenceValue:Yc(s.firestore._databaseId||i.databaseId,s._key.path)}}if(s instanceof dh)return function(o,l){return{mapValue:{fields:{__type__:{stringValue:"__vector__"},value:{arrayValue:{values:o.toArray().map(c=>{if(typeof c!="number")throw l.Bu("VectorValues must only contain numeric values.");return Gc(l.serializer,c)})}}}}}}(s,i);throw i.Bu(`Unsupported field value: ${va(s)}`)}(n,e)}function Dg(n,e){const t={};return Tm(n)?e.path&&e.path.length>0&&e.fieldMask.push(e.path):ls(n,(s,i)=>{const r=Cr(i,e.Mu(s));r!=null&&(t[s]=r)}),{mapValue:{fields:t}}}function Lg(n){return!(typeof n!="object"||n===null||n instanceof Array||n instanceof Date||n instanceof De||n instanceof uh||n instanceof ss||n instanceof Ze||n instanceof hh||n instanceof dh)}function ph(n,e,t){if(!Lg(t)||!function(i){return typeof i=="object"&&i!==null&&(Object.getPrototypeOf(i)===Object.prototype||Object.getPrototypeOf(i)===null)}(t)){const s=va(t);throw s==="an object"?e.Bu(n+" a custom object"):e.Bu(n+" "+s)}}function nc(n,e,t){if((e=ge(e))instanceof Ir)return e._internalPath;if(typeof e=="string")return mh(n,e);throw qo("Field path arguments must be of type string or ",n,!1,void 0,t)}const _C=new RegExp("[~\\*/\\[\\]]");function mh(n,e,t){if(e.search(_C)>=0)throw qo(`Invalid field path (${e}). Paths must not contain '~', '*', '/', '[', or ']'`,n,!1,void 0,t);try{return new Ir(...e.split("."))._internalPath}catch{throw qo(`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,n,!1,void 0,t)}}function qo(n,e,t,s,i){const r=s&&!s.isEmpty(),o=i!==void 0;let l=`Function ${e}() called with invalid data`;t&&(l+=" (via `toFirestore()`)"),l+=". ";let c="";return(r||o)&&(c+=" (found",r&&(c+=` in field ${s}`),o&&(c+=` in document ${i}`),c+=")"),new M(P.INVALID_ARGUMENT,l+n+c)}function xg(n,e){return n.some(t=>t.isEqual(e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Wo{constructor(e,t,s,i,r){this._firestore=e,this._userDataWriter=t,this._key=s,this._document=i,this._converter=r}get id(){return this._key.path.lastSegment()}get ref(){return new Ze(this._firestore,this._converter,this._key)}exists(){return this._document!==null}data(){if(this._document){if(this._converter){const e=new yC(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(e)}return this._userDataWriter.convertValue(this._document.data.value)}}get(e){if(this._document){const t=this._document.data.field(gh("DocumentSnapshot.get",e));if(t!==null)return this._userDataWriter.convertValue(t)}}}class yC extends Wo{data(){return super.data()}}function gh(n,e){return typeof e=="string"?mh(n,e):e instanceof Ir?e._internalPath:e._delegate._internalPath}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function vC(n){if(n.limitType==="L"&&n.explicitOrderBy.length===0)throw new M(P.UNIMPLEMENTED,"limitToLast() queries require specifying at least one orderBy() clause")}class _h{}let Og=class extends _h{};function vf(n,e,...t){let s=[];e instanceof _h&&s.push(e),s=s.concat(t),function(r){const o=r.filter(c=>c instanceof yh).length,l=r.filter(c=>c instanceof Ca).length;if(o>1||o>0&&l>0)throw new M(P.INVALID_ARGUMENT,"InvalidQuery. When using composite filters, you cannot use more than one filter at the top level. Consider nesting the multiple filters within an `and(...)` statement. For example: change `query(query, where(...), or(...))` to `query(query, and(where(...), or(...)))`.")}(s);for(const i of s)n=i._apply(n);return n}class Ca extends Og{constructor(e,t,s){super(),this._field=e,this._op=t,this._value=s,this.type="where"}static _create(e,t,s){return new Ca(e,t,s)}_apply(e){const t=this._parse(e);return Mg(e._query,t),new hs(e.firestore,e.converter,Kl(e._query,t))}_parse(e){const t=Ta(e.firestore);return function(r,o,l,c,h,d,p){let m;if(h.isKeyField()){if(d==="array-contains"||d==="array-contains-any")throw new M(P.INVALID_ARGUMENT,`Invalid Query. You can't perform '${d}' queries on documentId().`);if(d==="in"||d==="not-in"){Tf(p,d);const E=[];for(const C of p)E.push(wf(c,r,C));m={arrayValue:{values:E}}}else m=wf(c,r,p)}else d!=="in"&&d!=="not-in"&&d!=="array-contains-any"||Tf(p,d),m=gC(l,o,p,d==="in"||d==="not-in");return Re.create(h,d,m)}(e._query,"where",t,e.firestore._databaseId,this._field,this._op,this._value)}}function Ef(n,e,t){const s=e,i=gh("where",n);return Ca._create(i,s,t)}class yh extends _h{constructor(e,t){super(),this.type=e,this._queryConstraints=t}static _create(e,t){return new yh(e,t)}_parse(e){const t=this._queryConstraints.map(s=>s._parse(e)).filter(s=>s.getFilters().length>0);return t.length===1?t[0]:At.create(t,this._getOperator())}_apply(e){const t=this._parse(e);return t.getFilters().length===0?e:(function(i,r){let o=i;const l=r.getFlattenedFilters();for(const c of l)Mg(o,c),o=Kl(o,c)}(e._query,t),new hs(e.firestore,e.converter,Kl(e._query,t)))}_getQueryConstraints(){return this._queryConstraints}_getOperator(){return this.type==="and"?"and":"or"}}class vh extends Og{constructor(e,t,s){super(),this.type=e,this._limit=t,this._limitType=s}static _create(e,t,s){return new vh(e,t,s)}_apply(e){return new hs(e.firestore,e.converter,xo(e._query,this._limit,this._limitType))}}function EC(n){return vh._create("limit",n,"F")}function wf(n,e,t){if(typeof(t=ge(t))=="string"){if(t==="")throw new M(P.INVALID_ARGUMENT,"Invalid query. When querying with documentId(), you must provide a valid document ID, but it was an empty string.");if(!Nm(e)&&t.indexOf("/")!==-1)throw new M(P.INVALID_ARGUMENT,`Invalid query. When querying a collection by documentId(), you must provide a plain document ID, but '${t}' contains a '/' character.`);const s=e.path.child(me.fromString(t));if(!W.isDocumentKey(s))throw new M(P.INVALID_ARGUMENT,`Invalid query. When querying a collection group by documentId(), the value provided must result in a valid document path, but '${s}' is not because it has an odd number of segments (${s.length}).`);return Ud(n,new W(s))}if(t instanceof Ze)return Ud(n,t._key);throw new M(P.INVALID_ARGUMENT,`Invalid query. When querying with documentId(), you must provide a valid string or a DocumentReference, but it was: ${va(t)}.`)}function Tf(n,e){if(!Array.isArray(n)||n.length===0)throw new M(P.INVALID_ARGUMENT,`Invalid Query. A non-empty array is required for '${e.toString()}' filters.`)}function Mg(n,e){const t=function(i,r){for(const o of i)for(const l of o.getFlattenedFilters())if(r.indexOf(l.op)>=0)return l.op;return null}(n.filters,function(i){switch(i){case"!=":return["!=","not-in"];case"array-contains-any":case"in":return["not-in"];case"not-in":return["array-contains-any","in","not-in","!="];default:return[]}}(e.op));if(t!==null)throw t===e.op?new M(P.INVALID_ARGUMENT,`Invalid query. You cannot use more than one '${e.op.toString()}' filter.`):new M(P.INVALID_ARGUMENT,`Invalid query. You cannot use '${e.op.toString()}' filters with '${t.toString()}' filters.`)}class Vg{convertValue(e,t="none"){switch(ns(e)){case 0:return null;case 1:return e.booleanValue;case 2:return Ce(e.integerValue||e.doubleValue);case 3:return this.convertTimestamp(e.timestampValue);case 4:return this.convertServerTimestamp(e,t);case 5:return e.stringValue;case 6:return this.convertBytes(ts(e.bytesValue));case 7:return this.convertReference(e.referenceValue);case 8:return this.convertGeoPoint(e.geoPointValue);case 9:return this.convertArray(e.arrayValue,t);case 11:return this.convertObject(e.mapValue,t);case 10:return this.convertVectorValue(e.mapValue);default:throw j()}}convertObject(e,t){return this.convertObjectMap(e.fields,t)}convertObjectMap(e,t="none"){const s={};return ls(e,(i,r)=>{s[i]=this.convertValue(r,t)}),s}convertVectorValue(e){var t,s,i;const r=(i=(s=(t=e.fields)===null||t===void 0?void 0:t.value.arrayValue)===null||s===void 0?void 0:s.values)===null||i===void 0?void 0:i.map(o=>Ce(o.doubleValue));return new dh(r)}convertGeoPoint(e){return new uh(Ce(e.latitude),Ce(e.longitude))}convertArray(e,t){return(e.values||[]).map(s=>this.convertValue(s,t))}convertServerTimestamp(e,t){switch(t){case"previous":const s=qc(e);return s==null?null:this.convertValue(s,t);case"estimate":return this.convertTimestamp(Xi(e));default:return null}}convertTimestamp(e){const t=Dn(e);return new De(t.seconds,t.nanos)}convertDocumentKey(e,t){const s=me.fromString(e);re(ng(s));const i=new Zi(s.get(1),s.get(3)),r=new W(s.popFirst(5));return i.isEqual(t)||rn(`Document ${r} contains a document reference within a different database (${i.projectId}/${i.database}) which is not supported. It will be treated as a reference in the current database (${t.projectId}/${t.database}) instead.`),r}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Fg(n,e,t){let s;return s=n?t&&(t.merge||t.mergeFields)?n.toFirestore(e,t):n.toFirestore(e):e,s}class wC extends Vg{constructor(e){super(),this.firestore=e}convertBytes(e){return new ss(e)}convertReference(e){const t=this.convertDocumentKey(e,this.firestore._databaseId);return new Ze(this.firestore,null,t)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class As{constructor(e,t){this.hasPendingWrites=e,this.fromCache=t}isEqual(e){return this.hasPendingWrites===e.hasPendingWrites&&this.fromCache===e.fromCache}}class Eh extends Wo{constructor(e,t,s,i,r,o){super(e,t,s,i,o),this._firestore=e,this._firestoreImpl=e,this.metadata=r}exists(){return super.exists()}data(e={}){if(this._document){if(this._converter){const t=new po(this._firestore,this._userDataWriter,this._key,this._document,this.metadata,null);return this._converter.fromFirestore(t,e)}return this._userDataWriter.convertValue(this._document.data.value,e.serverTimestamps)}}get(e,t={}){if(this._document){const s=this._document.data.field(gh("DocumentSnapshot.get",e));if(s!==null)return this._userDataWriter.convertValue(s,t.serverTimestamps)}}}class po extends Eh{data(e={}){return super.data(e)}}class TC{constructor(e,t,s,i){this._firestore=e,this._userDataWriter=t,this._snapshot=i,this.metadata=new As(i.hasPendingWrites,i.fromCache),this.query=s}get docs(){const e=[];return this.forEach(t=>e.push(t)),e}get size(){return this._snapshot.docs.size}get empty(){return this.size===0}forEach(e,t){this._snapshot.docs.forEach(s=>{e.call(t,new po(this._firestore,this._userDataWriter,s.key,s,new As(this._snapshot.mutatedKeys.has(s.key),this._snapshot.fromCache),this.query.converter))})}docChanges(e={}){const t=!!e.includeMetadataChanges;if(t&&this._snapshot.excludesMetadataChanges)throw new M(P.INVALID_ARGUMENT,"To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");return this._cachedChanges&&this._cachedChangesIncludeMetadataChanges===t||(this._cachedChanges=function(i,r){if(i._snapshot.oldDocs.isEmpty()){let o=0;return i._snapshot.docChanges.map(l=>{const c=new po(i._firestore,i._userDataWriter,l.doc.key,l.doc,new As(i._snapshot.mutatedKeys.has(l.doc.key),i._snapshot.fromCache),i.query.converter);return l.doc,{type:"added",doc:c,oldIndex:-1,newIndex:o++}})}{let o=i._snapshot.oldDocs;return i._snapshot.docChanges.filter(l=>r||l.type!==3).map(l=>{const c=new po(i._firestore,i._userDataWriter,l.doc.key,l.doc,new As(i._snapshot.mutatedKeys.has(l.doc.key),i._snapshot.fromCache),i.query.converter);let h=-1,d=-1;return l.type!==0&&(h=o.indexOf(l.doc.key),o=o.delete(l.doc.key)),l.type!==1&&(o=o.add(l.doc),d=o.indexOf(l.doc.key)),{type:IC(l.type),doc:c,oldIndex:h,newIndex:d}})}}(this,t),this._cachedChangesIncludeMetadataChanges=t),this._cachedChanges}}function IC(n){switch(n){case 0:return"added";case 2:case 3:return"modified";case 1:return"removed";default:return j()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function dl(n){n=Ot(n,Ze);const e=Ot(n.firestore,ni);return aC(wa(e),n._key).then(t=>CC(e,n,t))}class wh extends Vg{constructor(e){super(),this.firestore=e}convertBytes(e){return new ss(e)}convertReference(e){const t=this.convertDocumentKey(e,this.firestore._databaseId);return new Ze(this.firestore,null,t)}}function fl(n){n=Ot(n,hs);const e=Ot(n.firestore,ni),t=wa(e),s=new wh(e);return vC(n._query),lC(t,n._query).then(i=>new TC(e,s,n,i))}function pl(n,e,t){n=Ot(n,Ze);const s=Ot(n.firestore,ni),i=Fg(n.converter,e,t);return Bg(s,[kg(Ta(s),"setDoc",n._key,i,n.converter!==null,t).toMutation(n._key,rt.none())])}function If(n,e,t,...s){n=Ot(n,Ze);const i=Ot(n.firestore,ni),r=Ta(i);let o;return o=typeof(e=ge(e))=="string"||e instanceof Ir?Ng(r,"updateDoc",n._key,e,t,s):Pg(r,"updateDoc",n._key,e),Bg(i,[o.toMutation(n._key,rt.exists(!0))])}function Bg(n,e){return function(s,i){const r=new Nt;return s.asyncQueue.enqueueAndForget(async()=>H0(await rC(s),i,r)),r.promise}(wa(n),e)}function CC(n,e,t){const s=t.docs.get(e._key),i=new wh(n);return new Eh(n,i,e._key,s,new As(t.hasPendingWrites,t.fromCache),e.converter)}/**
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
 */const bC={maxAttempts:5};function Ti(n,e){if((n=ge(n)).firestore!==e)throw new M(P.INVALID_ARGUMENT,"Provided document reference is from a different Firestore instance.");return n}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
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
 */class RC extends class{constructor(t,s){this._firestore=t,this._transaction=s,this._dataReader=Ta(t)}get(t){const s=Ti(t,this._firestore),i=new wC(this._firestore);return this._transaction.lookup([s._key]).then(r=>{if(!r||r.length!==1)return j();const o=r[0];if(o.isFoundDocument())return new Wo(this._firestore,i,o.key,o,s.converter);if(o.isNoDocument())return new Wo(this._firestore,i,s._key,null,s.converter);throw j()})}set(t,s,i){const r=Ti(t,this._firestore),o=Fg(r.converter,s,i),l=kg(this._dataReader,"Transaction.set",r._key,o,r.converter!==null,i);return this._transaction.set(r._key,l),this}update(t,s,i,...r){const o=Ti(t,this._firestore);let l;return l=typeof(s=ge(s))=="string"||s instanceof Ir?Ng(this._dataReader,"Transaction.update",o._key,s,i,r):Pg(this._dataReader,"Transaction.update",o._key,s),this._transaction.update(o._key,l),this}delete(t){const s=Ti(t,this._firestore);return this._transaction.delete(s._key),this}}{constructor(e,t){super(e,t),this._firestore=e}get(e){const t=Ti(e,this._firestore),s=new wh(this._firestore);return super.get(e).then(i=>new Eh(this._firestore,s,t._key,i._document,new As(!1,!1),t.converter))}}function SC(n,e,t){n=Ot(n,ni);const s=Object.assign(Object.assign({},bC),t);return function(r){if(r.maxAttempts<1)throw new M(P.INVALID_ARGUMENT,"Max attempts must be at least 1")}(s),function(r,o,l){const c=new Nt;return r.asyncQueue.enqueueAndForget(async()=>{const h=await oC(r);new nC(r.asyncQueue,h,l,o,c).au()}),c.promise}(wa(n),i=>e(new RC(n,i)),s)}(function(e,t=!0){(function(i){Zs=i})(as),Xn(new Pn("firestore",(s,{instanceIdentifier:i,options:r})=>{const o=s.getProvider("app").getImmediate(),l=new ni(new AT(s.getProvider("auth-internal")),new DT(s.getProvider("app-check-internal")),function(h,d){if(!Object.prototype.hasOwnProperty.apply(h.options,["projectId"]))throw new M(P.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new Zi(h.options.projectId,d)}(o,i),o);return r=Object.assign({useFetchStreams:t},r),l._setSettings(r),l},"PUBLIC").setMultipleInstances(!0)),kt(Od,"4.7.3",e),kt(Od,"4.7.3","esm2017")})();var Cf={};const bf="@firebase/database",Rf="1.0.8";/**
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
 */let Ug="";function AC(n){Ug=n}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class kC{constructor(e){this.domStorage_=e,this.prefix_="firebase:"}set(e,t){t==null?this.domStorage_.removeItem(this.prefixedName_(e)):this.domStorage_.setItem(this.prefixedName_(e),Ne(t))}get(e){const t=this.domStorage_.getItem(this.prefixedName_(e));return t==null?null:Ki(t)}remove(e){this.domStorage_.removeItem(this.prefixedName_(e))}prefixedName_(e){return this.prefix_+e}toString(){return this.domStorage_.toString()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class PC{constructor(){this.cache_={},this.isInMemoryStorage=!0}set(e,t){t==null?delete this.cache_[e]:this.cache_[e]=t}get(e){return Vt(this.cache_,e)?this.cache_[e]:null}remove(e){delete this.cache_[e]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const qg=function(n){try{if(typeof window<"u"&&typeof window[n]<"u"){const e=window[n];return e.setItem("firebase:sentinel","cache"),e.removeItem("firebase:sentinel"),new kC(e)}}catch{}return new PC},Kn=qg("localStorage"),NC=qg("sessionStorage");/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const xs=new oa("@firebase/database"),DC=function(){let n=1;return function(){return n++}}(),Wg=function(n){const e=gv(n),t=new dv;t.update(e);const s=t.digest();return Ic.encodeByteArray(s)},br=function(...n){let e="";for(let t=0;t<n.length;t++){const s=n[t];Array.isArray(s)||s&&typeof s=="object"&&typeof s.length=="number"?e+=br.apply(null,s):typeof s=="object"?e+=Ne(s):e+=s,e+=" "}return e};let Wi=null,Sf=!0;const LC=function(n,e){D(!0,"Can't turn on custom loggers persistently."),xs.logLevel=te.VERBOSE,Wi=xs.log.bind(xs)},Ue=function(...n){if(Sf===!0&&(Sf=!1,Wi===null&&NC.get("logging_enabled")===!0&&LC()),Wi){const e=br.apply(null,n);Wi(e)}},Rr=function(n){return function(...e){Ue(n,...e)}},sc=function(...n){const e="FIREBASE INTERNAL ERROR: "+br(...n);xs.error(e)},an=function(...n){const e=`FIREBASE FATAL ERROR: ${br(...n)}`;throw xs.error(e),new Error(e)},at=function(...n){const e="FIREBASE WARNING: "+br(...n);xs.warn(e)},xC=function(){typeof window<"u"&&window.location&&window.location.protocol&&window.location.protocol.indexOf("https:")!==-1&&at("Insecure Firebase access from a secure page. Please use https in calls to new Firebase().")},Th=function(n){return typeof n=="number"&&(n!==n||n===Number.POSITIVE_INFINITY||n===Number.NEGATIVE_INFINITY)},OC=function(n){if(document.readyState==="complete")n();else{let e=!1;const t=function(){if(!document.body){setTimeout(t,Math.floor(10));return}e||(e=!0,n())};document.addEventListener?(document.addEventListener("DOMContentLoaded",t,!1),window.addEventListener("load",t,!1)):document.attachEvent&&(document.attachEvent("onreadystatechange",()=>{document.readyState==="complete"&&t()}),window.attachEvent("onload",t))}},is="[MIN_NAME]",xn="[MAX_NAME]",us=function(n,e){if(n===e)return 0;if(n===is||e===xn)return-1;if(e===is||n===xn)return 1;{const t=Af(n),s=Af(e);return t!==null?s!==null?t-s===0?n.length-e.length:t-s:-1:s!==null?1:n<e?-1:1}},MC=function(n,e){return n===e?0:n<e?-1:1},Ii=function(n,e){if(e&&n in e)return e[n];throw new Error("Missing required key ("+n+") in object: "+Ne(e))},Ih=function(n){if(typeof n!="object"||n===null)return Ne(n);const e=[];for(const s in n)e.push(s);e.sort();let t="{";for(let s=0;s<e.length;s++)s!==0&&(t+=","),t+=Ne(e[s]),t+=":",t+=Ih(n[e[s]]);return t+="}",t},$g=function(n,e){const t=n.length;if(t<=e)return[n];const s=[];for(let i=0;i<t;i+=e)i+e>t?s.push(n.substring(i,t)):s.push(n.substring(i,i+e));return s};function je(n,e){for(const t in n)n.hasOwnProperty(t)&&e(t,n[t])}const jg=function(n){D(!Th(n),"Invalid JSON number");const e=11,t=52,s=(1<<e-1)-1;let i,r,o,l,c;n===0?(r=0,o=0,i=1/n===-1/0?1:0):(i=n<0,n=Math.abs(n),n>=Math.pow(2,1-s)?(l=Math.min(Math.floor(Math.log(n)/Math.LN2),s),r=l+s,o=Math.round(n*Math.pow(2,t-l)-Math.pow(2,t))):(r=0,o=Math.round(n/Math.pow(2,1-s-t))));const h=[];for(c=t;c;c-=1)h.push(o%2?1:0),o=Math.floor(o/2);for(c=e;c;c-=1)h.push(r%2?1:0),r=Math.floor(r/2);h.push(i?1:0),h.reverse();const d=h.join("");let p="";for(c=0;c<64;c+=8){let m=parseInt(d.substr(c,8),2).toString(16);m.length===1&&(m="0"+m),p=p+m}return p.toLowerCase()},VC=function(){return!!(typeof window=="object"&&window.chrome&&window.chrome.extension&&!/^chrome/.test(window.location.href))},FC=function(){return typeof Windows=="object"&&typeof Windows.UI=="object"};function BC(n,e){let t="Unknown Error";n==="too_big"?t="The data requested exceeds the maximum size that can be accessed with a single request.":n==="permission_denied"?t="Client doesn't have permission to access the desired data.":n==="unavailable"&&(t="The service is unavailable");const s=new Error(n+" at "+e._path.toString()+": "+t);return s.code=n.toUpperCase(),s}const UC=new RegExp("^-?(0*)\\d{1,10}$"),qC=-2147483648,WC=2147483647,Af=function(n){if(UC.test(n)){const e=Number(n);if(e>=qC&&e<=WC)return e}return null},si=function(n){try{n()}catch(e){setTimeout(()=>{const t=e.stack||"";throw at("Exception was thrown by user callback.",t),e},Math.floor(0))}},$C=function(){return(typeof window=="object"&&window.navigator&&window.navigator.userAgent||"").search(/googlebot|google webmaster tools|bingbot|yahoo! slurp|baiduspider|yandexbot|duckduckbot/i)>=0},$i=function(n,e){const t=setTimeout(n,e);return typeof t=="number"&&typeof Deno<"u"&&Deno.unrefTimer?Deno.unrefTimer(t):typeof t=="object"&&t.unref&&t.unref(),t};/**
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
 */class jC{constructor(e,t){this.appName_=e,this.appCheckProvider=t,this.appCheck=t==null?void 0:t.getImmediate({optional:!0}),this.appCheck||t==null||t.get().then(s=>this.appCheck=s)}getToken(e){return this.appCheck?this.appCheck.getToken(e):new Promise((t,s)=>{setTimeout(()=>{this.appCheck?this.getToken(e).then(t,s):t(null)},0)})}addTokenChangeListener(e){var t;(t=this.appCheckProvider)===null||t===void 0||t.get().then(s=>s.addTokenListener(e))}notifyForInvalidToken(){at(`Provided AppCheck credentials for the app named "${this.appName_}" are invalid. This usually indicates your app was not initialized correctly.`)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zC{constructor(e,t,s){this.appName_=e,this.firebaseOptions_=t,this.authProvider_=s,this.auth_=null,this.auth_=s.getImmediate({optional:!0}),this.auth_||s.onInit(i=>this.auth_=i)}getToken(e){return this.auth_?this.auth_.getToken(e).catch(t=>t&&t.code==="auth/token-not-initialized"?(Ue("Got auth/token-not-initialized error.  Treating as null token."),null):Promise.reject(t)):new Promise((t,s)=>{setTimeout(()=>{this.auth_?this.getToken(e).then(t,s):t(null)},0)})}addTokenChangeListener(e){this.auth_?this.auth_.addAuthTokenListener(e):this.authProvider_.get().then(t=>t.addAuthTokenListener(e))}removeTokenChangeListener(e){this.authProvider_.get().then(t=>t.removeAuthTokenListener(e))}notifyForInvalidToken(){let e='Provided authentication credentials for the app named "'+this.appName_+'" are invalid. This usually indicates your app was not initialized correctly. ';"credential"in this.firebaseOptions_?e+='Make sure the "credential" property provided to initializeApp() is authorized to access the specified "databaseURL" and is from the correct project.':"serviceAccount"in this.firebaseOptions_?e+='Make sure the "serviceAccount" property provided to initializeApp() is authorized to access the specified "databaseURL" and is from the correct project.':e+='Make sure the "apiKey" and "databaseURL" properties provided to initializeApp() match the values provided for your app at https://console.firebase.google.com/.',at(e)}}class mo{constructor(e){this.accessToken=e}getToken(e){return Promise.resolve({accessToken:this.accessToken})}addTokenChangeListener(e){e(this.accessToken)}removeTokenChangeListener(e){}notifyForInvalidToken(){}}mo.OWNER="owner";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ch="5",zg="v",Gg="s",Hg="r",Kg="f",Qg=/(console\.firebase|firebase-console-\w+\.corp|firebase\.corp)\.google\.com/,Yg="ls",Jg="p",ic="ac",Xg="websocket",Zg="long_polling";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class e_{constructor(e,t,s,i,r=!1,o="",l=!1,c=!1){this.secure=t,this.namespace=s,this.webSocketOnly=i,this.nodeAdmin=r,this.persistenceKey=o,this.includeNamespaceInQueryParams=l,this.isUsingEmulator=c,this._host=e.toLowerCase(),this._domain=this._host.substr(this._host.indexOf(".")+1),this.internalHost=Kn.get("host:"+e)||this._host}isCacheableHost(){return this.internalHost.substr(0,2)==="s-"}isCustomHost(){return this._domain!=="firebaseio.com"&&this._domain!=="firebaseio-demo.com"}get host(){return this._host}set host(e){e!==this.internalHost&&(this.internalHost=e,this.isCacheableHost()&&Kn.set("host:"+this._host,this.internalHost))}toString(){let e=this.toURLString();return this.persistenceKey&&(e+="<"+this.persistenceKey+">"),e}toURLString(){const e=this.secure?"https://":"http://",t=this.includeNamespaceInQueryParams?`?ns=${this.namespace}`:"";return`${e}${this.host}/${t}`}}function GC(n){return n.host!==n.internalHost||n.isCustomHost()||n.includeNamespaceInQueryParams}function t_(n,e,t){D(typeof e=="string","typeof type must == string"),D(typeof t=="object","typeof params must == object");let s;if(e===Xg)s=(n.secure?"wss://":"ws://")+n.internalHost+"/.ws?";else if(e===Zg)s=(n.secure?"https://":"http://")+n.internalHost+"/.lp?";else throw new Error("Unknown connection type: "+e);GC(n)&&(t.ns=n.namespace);const i=[];return je(t,(r,o)=>{i.push(r+"="+o)}),s+i.join("&")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class HC{constructor(){this.counters_={}}incrementCounter(e,t=1){Vt(this.counters_,e)||(this.counters_[e]=0),this.counters_[e]+=t}get(){return Hy(this.counters_)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ml={},gl={};function bh(n){const e=n.toString();return ml[e]||(ml[e]=new HC),ml[e]}function KC(n,e){const t=n.toString();return gl[t]||(gl[t]=e()),gl[t]}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class QC{constructor(e){this.onMessage_=e,this.pendingResponses=[],this.currentResponseNum=0,this.closeAfterResponse=-1,this.onClose=null}closeAfter(e,t){this.closeAfterResponse=e,this.onClose=t,this.closeAfterResponse<this.currentResponseNum&&(this.onClose(),this.onClose=null)}handleResponse(e,t){for(this.pendingResponses[e]=t;this.pendingResponses[this.currentResponseNum];){const s=this.pendingResponses[this.currentResponseNum];delete this.pendingResponses[this.currentResponseNum];for(let i=0;i<s.length;++i)s[i]&&si(()=>{this.onMessage_(s[i])});if(this.currentResponseNum===this.closeAfterResponse){this.onClose&&(this.onClose(),this.onClose=null);break}this.currentResponseNum++}}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const kf="start",YC="close",JC="pLPCommand",XC="pRTLPCB",n_="id",s_="pw",i_="ser",ZC="cb",eb="seg",tb="ts",nb="d",sb="dframe",r_=1870,o_=30,ib=r_-o_,rb=25e3,ob=3e4;class ks{constructor(e,t,s,i,r,o,l){this.connId=e,this.repoInfo=t,this.applicationId=s,this.appCheckToken=i,this.authToken=r,this.transportSessionId=o,this.lastSessionId=l,this.bytesSent=0,this.bytesReceived=0,this.everConnected_=!1,this.log_=Rr(e),this.stats_=bh(t),this.urlFn=c=>(this.appCheckToken&&(c[ic]=this.appCheckToken),t_(t,Zg,c))}open(e,t){this.curSegmentNum=0,this.onDisconnect_=t,this.myPacketOrderer=new QC(e),this.isClosed_=!1,this.connectTimeoutTimer_=setTimeout(()=>{this.log_("Timed out trying to connect."),this.onClosed_(),this.connectTimeoutTimer_=null},Math.floor(ob)),OC(()=>{if(this.isClosed_)return;this.scriptTagHolder=new Rh((...r)=>{const[o,l,c,h,d]=r;if(this.incrementIncomingBytes_(r),!!this.scriptTagHolder)if(this.connectTimeoutTimer_&&(clearTimeout(this.connectTimeoutTimer_),this.connectTimeoutTimer_=null),this.everConnected_=!0,o===kf)this.id=l,this.password=c;else if(o===YC)l?(this.scriptTagHolder.sendNewPolls=!1,this.myPacketOrderer.closeAfter(l,()=>{this.onClosed_()})):this.onClosed_();else throw new Error("Unrecognized command received: "+o)},(...r)=>{const[o,l]=r;this.incrementIncomingBytes_(r),this.myPacketOrderer.handleResponse(o,l)},()=>{this.onClosed_()},this.urlFn);const s={};s[kf]="t",s[i_]=Math.floor(Math.random()*1e8),this.scriptTagHolder.uniqueCallbackIdentifier&&(s[ZC]=this.scriptTagHolder.uniqueCallbackIdentifier),s[zg]=Ch,this.transportSessionId&&(s[Gg]=this.transportSessionId),this.lastSessionId&&(s[Yg]=this.lastSessionId),this.applicationId&&(s[Jg]=this.applicationId),this.appCheckToken&&(s[ic]=this.appCheckToken),typeof location<"u"&&location.hostname&&Qg.test(location.hostname)&&(s[Hg]=Kg);const i=this.urlFn(s);this.log_("Connecting via long-poll to "+i),this.scriptTagHolder.addTag(i,()=>{})})}start(){this.scriptTagHolder.startLongPoll(this.id,this.password),this.addDisconnectPingFrame(this.id,this.password)}static forceAllow(){ks.forceAllow_=!0}static forceDisallow(){ks.forceDisallow_=!0}static isAvailable(){return ks.forceAllow_?!0:!ks.forceDisallow_&&typeof document<"u"&&document.createElement!=null&&!VC()&&!FC()}markConnectionHealthy(){}shutdown_(){this.isClosed_=!0,this.scriptTagHolder&&(this.scriptTagHolder.close(),this.scriptTagHolder=null),this.myDisconnFrame&&(document.body.removeChild(this.myDisconnFrame),this.myDisconnFrame=null),this.connectTimeoutTimer_&&(clearTimeout(this.connectTimeoutTimer_),this.connectTimeoutTimer_=null)}onClosed_(){this.isClosed_||(this.log_("Longpoll is closing itself"),this.shutdown_(),this.onDisconnect_&&(this.onDisconnect_(this.everConnected_),this.onDisconnect_=null))}close(){this.isClosed_||(this.log_("Longpoll is being closed."),this.shutdown_())}send(e){const t=Ne(e);this.bytesSent+=t.length,this.stats_.incrementCounter("bytes_sent",t.length);const s=Ip(t),i=$g(s,ib);for(let r=0;r<i.length;r++)this.scriptTagHolder.enqueueSegment(this.curSegmentNum,i.length,i[r]),this.curSegmentNum++}addDisconnectPingFrame(e,t){this.myDisconnFrame=document.createElement("iframe");const s={};s[sb]="t",s[n_]=e,s[s_]=t,this.myDisconnFrame.src=this.urlFn(s),this.myDisconnFrame.style.display="none",document.body.appendChild(this.myDisconnFrame)}incrementIncomingBytes_(e){const t=Ne(e).length;this.bytesReceived+=t,this.stats_.incrementCounter("bytes_received",t)}}class Rh{constructor(e,t,s,i){this.onDisconnect=s,this.urlFn=i,this.outstandingRequests=new Set,this.pendingSegs=[],this.currentSerial=Math.floor(Math.random()*1e8),this.sendNewPolls=!0;{this.uniqueCallbackIdentifier=DC(),window[JC+this.uniqueCallbackIdentifier]=e,window[XC+this.uniqueCallbackIdentifier]=t,this.myIFrame=Rh.createIFrame_();let r="";this.myIFrame.src&&this.myIFrame.src.substr(0,11)==="javascript:"&&(r='<script>document.domain="'+document.domain+'";<\/script>');const o="<html><body>"+r+"</body></html>";try{this.myIFrame.doc.open(),this.myIFrame.doc.write(o),this.myIFrame.doc.close()}catch(l){Ue("frame writing exception"),l.stack&&Ue(l.stack),Ue(l)}}}static createIFrame_(){const e=document.createElement("iframe");if(e.style.display="none",document.body){document.body.appendChild(e);try{e.contentWindow.document||Ue("No IE domain setting required")}catch{const s=document.domain;e.src="javascript:void((function(){document.open();document.domain='"+s+"';document.close();})())"}}else throw"Document body has not initialized. Wait to initialize Firebase until after the document is ready.";return e.contentDocument?e.doc=e.contentDocument:e.contentWindow?e.doc=e.contentWindow.document:e.document&&(e.doc=e.document),e}close(){this.alive=!1,this.myIFrame&&(this.myIFrame.doc.body.textContent="",setTimeout(()=>{this.myIFrame!==null&&(document.body.removeChild(this.myIFrame),this.myIFrame=null)},Math.floor(0)));const e=this.onDisconnect;e&&(this.onDisconnect=null,e())}startLongPoll(e,t){for(this.myID=e,this.myPW=t,this.alive=!0;this.newRequest_(););}newRequest_(){if(this.alive&&this.sendNewPolls&&this.outstandingRequests.size<(this.pendingSegs.length>0?2:1)){this.currentSerial++;const e={};e[n_]=this.myID,e[s_]=this.myPW,e[i_]=this.currentSerial;let t=this.urlFn(e),s="",i=0;for(;this.pendingSegs.length>0&&this.pendingSegs[0].d.length+o_+s.length<=r_;){const o=this.pendingSegs.shift();s=s+"&"+eb+i+"="+o.seg+"&"+tb+i+"="+o.ts+"&"+nb+i+"="+o.d,i++}return t=t+s,this.addLongPollTag_(t,this.currentSerial),!0}else return!1}enqueueSegment(e,t,s){this.pendingSegs.push({seg:e,ts:t,d:s}),this.alive&&this.newRequest_()}addLongPollTag_(e,t){this.outstandingRequests.add(t);const s=()=>{this.outstandingRequests.delete(t),this.newRequest_()},i=setTimeout(s,Math.floor(rb)),r=()=>{clearTimeout(i),s()};this.addTag(e,r)}addTag(e,t){setTimeout(()=>{try{if(!this.sendNewPolls)return;const s=this.myIFrame.doc.createElement("script");s.type="text/javascript",s.async=!0,s.src=e,s.onload=s.onreadystatechange=function(){const i=s.readyState;(!i||i==="loaded"||i==="complete")&&(s.onload=s.onreadystatechange=null,s.parentNode&&s.parentNode.removeChild(s),t())},s.onerror=()=>{Ue("Long-poll script failed to load: "+e),this.sendNewPolls=!1,this.close()},this.myIFrame.doc.body.appendChild(s)}catch{}},Math.floor(1))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ab=16384,lb=45e3;let $o=null;typeof MozWebSocket<"u"?$o=MozWebSocket:typeof WebSocket<"u"&&($o=WebSocket);class Ct{constructor(e,t,s,i,r,o,l){this.connId=e,this.applicationId=s,this.appCheckToken=i,this.authToken=r,this.keepaliveTimer=null,this.frames=null,this.totalFrames=0,this.bytesSent=0,this.bytesReceived=0,this.log_=Rr(this.connId),this.stats_=bh(t),this.connURL=Ct.connectionURL_(t,o,l,i,s),this.nodeAdmin=t.nodeAdmin}static connectionURL_(e,t,s,i,r){const o={};return o[zg]=Ch,typeof location<"u"&&location.hostname&&Qg.test(location.hostname)&&(o[Hg]=Kg),t&&(o[Gg]=t),s&&(o[Yg]=s),i&&(o[ic]=i),r&&(o[Jg]=r),t_(e,Xg,o)}open(e,t){this.onDisconnect=t,this.onMessage=e,this.log_("Websocket connecting to "+this.connURL),this.everConnected_=!1,Kn.set("previous_websocket_failure",!0);try{let s;sv(),this.mySock=new $o(this.connURL,[],s)}catch(s){this.log_("Error instantiating WebSocket.");const i=s.message||s.data;i&&this.log_(i),this.onClosed_();return}this.mySock.onopen=()=>{this.log_("Websocket connected."),this.everConnected_=!0},this.mySock.onclose=()=>{this.log_("Websocket connection was disconnected."),this.mySock=null,this.onClosed_()},this.mySock.onmessage=s=>{this.handleIncomingFrame(s)},this.mySock.onerror=s=>{this.log_("WebSocket error.  Closing connection.");const i=s.message||s.data;i&&this.log_(i),this.onClosed_()}}start(){}static forceDisallow(){Ct.forceDisallow_=!0}static isAvailable(){let e=!1;if(typeof navigator<"u"&&navigator.userAgent){const t=/Android ([0-9]{0,}\.[0-9]{0,})/,s=navigator.userAgent.match(t);s&&s.length>1&&parseFloat(s[1])<4.4&&(e=!0)}return!e&&$o!==null&&!Ct.forceDisallow_}static previouslyFailed(){return Kn.isInMemoryStorage||Kn.get("previous_websocket_failure")===!0}markConnectionHealthy(){Kn.remove("previous_websocket_failure")}appendFrame_(e){if(this.frames.push(e),this.frames.length===this.totalFrames){const t=this.frames.join("");this.frames=null;const s=Ki(t);this.onMessage(s)}}handleNewFrameCount_(e){this.totalFrames=e,this.frames=[]}extractFrameCount_(e){if(D(this.frames===null,"We already have a frame buffer"),e.length<=6){const t=Number(e);if(!isNaN(t))return this.handleNewFrameCount_(t),null}return this.handleNewFrameCount_(1),e}handleIncomingFrame(e){if(this.mySock===null)return;const t=e.data;if(this.bytesReceived+=t.length,this.stats_.incrementCounter("bytes_received",t.length),this.resetKeepAlive(),this.frames!==null)this.appendFrame_(t);else{const s=this.extractFrameCount_(t);s!==null&&this.appendFrame_(s)}}send(e){this.resetKeepAlive();const t=Ne(e);this.bytesSent+=t.length,this.stats_.incrementCounter("bytes_sent",t.length);const s=$g(t,ab);s.length>1&&this.sendString_(String(s.length));for(let i=0;i<s.length;i++)this.sendString_(s[i])}shutdown_(){this.isClosed_=!0,this.keepaliveTimer&&(clearInterval(this.keepaliveTimer),this.keepaliveTimer=null),this.mySock&&(this.mySock.close(),this.mySock=null)}onClosed_(){this.isClosed_||(this.log_("WebSocket is closing itself"),this.shutdown_(),this.onDisconnect&&(this.onDisconnect(this.everConnected_),this.onDisconnect=null))}close(){this.isClosed_||(this.log_("WebSocket is being closed"),this.shutdown_())}resetKeepAlive(){clearInterval(this.keepaliveTimer),this.keepaliveTimer=setInterval(()=>{this.mySock&&this.sendString_("0"),this.resetKeepAlive()},Math.floor(lb))}sendString_(e){try{this.mySock.send(e)}catch(t){this.log_("Exception thrown from WebSocket.send():",t.message||t.data,"Closing connection."),setTimeout(this.onClosed_.bind(this),0)}}}Ct.responsesRequiredToBeHealthy=2;Ct.healthyTimeout=3e4;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class sr{constructor(e){this.initTransports_(e)}static get ALL_TRANSPORTS(){return[ks,Ct]}static get IS_TRANSPORT_INITIALIZED(){return this.globalTransportInitialized_}initTransports_(e){const t=Ct&&Ct.isAvailable();let s=t&&!Ct.previouslyFailed();if(e.webSocketOnly&&(t||at("wss:// URL used, but browser isn't known to support websockets.  Trying anyway."),s=!0),s)this.transports_=[Ct];else{const i=this.transports_=[];for(const r of sr.ALL_TRANSPORTS)r&&r.isAvailable()&&i.push(r);sr.globalTransportInitialized_=!0}}initialTransport(){if(this.transports_.length>0)return this.transports_[0];throw new Error("No transports available")}upgradeTransport(){return this.transports_.length>1?this.transports_[1]:null}}sr.globalTransportInitialized_=!1;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const cb=6e4,hb=5e3,ub=10*1024,db=100*1024,_l="t",Pf="d",fb="s",Nf="r",pb="e",Df="o",Lf="a",xf="n",Of="p",mb="h";class gb{constructor(e,t,s,i,r,o,l,c,h,d){this.id=e,this.repoInfo_=t,this.applicationId_=s,this.appCheckToken_=i,this.authToken_=r,this.onMessage_=o,this.onReady_=l,this.onDisconnect_=c,this.onKill_=h,this.lastSessionId=d,this.connectionCount=0,this.pendingDataMessages=[],this.state_=0,this.log_=Rr("c:"+this.id+":"),this.transportManager_=new sr(t),this.log_("Connection created"),this.start_()}start_(){const e=this.transportManager_.initialTransport();this.conn_=new e(this.nextTransportId_(),this.repoInfo_,this.applicationId_,this.appCheckToken_,this.authToken_,null,this.lastSessionId),this.primaryResponsesRequired_=e.responsesRequiredToBeHealthy||0;const t=this.connReceiver_(this.conn_),s=this.disconnReceiver_(this.conn_);this.tx_=this.conn_,this.rx_=this.conn_,this.secondaryConn_=null,this.isHealthy_=!1,setTimeout(()=>{this.conn_&&this.conn_.open(t,s)},Math.floor(0));const i=e.healthyTimeout||0;i>0&&(this.healthyTimeout_=$i(()=>{this.healthyTimeout_=null,this.isHealthy_||(this.conn_&&this.conn_.bytesReceived>db?(this.log_("Connection exceeded healthy timeout but has received "+this.conn_.bytesReceived+" bytes.  Marking connection healthy."),this.isHealthy_=!0,this.conn_.markConnectionHealthy()):this.conn_&&this.conn_.bytesSent>ub?this.log_("Connection exceeded healthy timeout but has sent "+this.conn_.bytesSent+" bytes.  Leaving connection alive."):(this.log_("Closing unhealthy connection after timeout."),this.close()))},Math.floor(i)))}nextTransportId_(){return"c:"+this.id+":"+this.connectionCount++}disconnReceiver_(e){return t=>{e===this.conn_?this.onConnectionLost_(t):e===this.secondaryConn_?(this.log_("Secondary connection lost."),this.onSecondaryConnectionLost_()):this.log_("closing an old connection")}}connReceiver_(e){return t=>{this.state_!==2&&(e===this.rx_?this.onPrimaryMessageReceived_(t):e===this.secondaryConn_?this.onSecondaryMessageReceived_(t):this.log_("message on old connection"))}}sendRequest(e){const t={t:"d",d:e};this.sendData_(t)}tryCleanupConnection(){this.tx_===this.secondaryConn_&&this.rx_===this.secondaryConn_&&(this.log_("cleaning up and promoting a connection: "+this.secondaryConn_.connId),this.conn_=this.secondaryConn_,this.secondaryConn_=null)}onSecondaryControl_(e){if(_l in e){const t=e[_l];t===Lf?this.upgradeIfSecondaryHealthy_():t===Nf?(this.log_("Got a reset on secondary, closing it"),this.secondaryConn_.close(),(this.tx_===this.secondaryConn_||this.rx_===this.secondaryConn_)&&this.close()):t===Df&&(this.log_("got pong on secondary."),this.secondaryResponsesRequired_--,this.upgradeIfSecondaryHealthy_())}}onSecondaryMessageReceived_(e){const t=Ii("t",e),s=Ii("d",e);if(t==="c")this.onSecondaryControl_(s);else if(t==="d")this.pendingDataMessages.push(s);else throw new Error("Unknown protocol layer: "+t)}upgradeIfSecondaryHealthy_(){this.secondaryResponsesRequired_<=0?(this.log_("Secondary connection is healthy."),this.isHealthy_=!0,this.secondaryConn_.markConnectionHealthy(),this.proceedWithUpgrade_()):(this.log_("sending ping on secondary."),this.secondaryConn_.send({t:"c",d:{t:Of,d:{}}}))}proceedWithUpgrade_(){this.secondaryConn_.start(),this.log_("sending client ack on secondary"),this.secondaryConn_.send({t:"c",d:{t:Lf,d:{}}}),this.log_("Ending transmission on primary"),this.conn_.send({t:"c",d:{t:xf,d:{}}}),this.tx_=this.secondaryConn_,this.tryCleanupConnection()}onPrimaryMessageReceived_(e){const t=Ii("t",e),s=Ii("d",e);t==="c"?this.onControl_(s):t==="d"&&this.onDataMessage_(s)}onDataMessage_(e){this.onPrimaryResponse_(),this.onMessage_(e)}onPrimaryResponse_(){this.isHealthy_||(this.primaryResponsesRequired_--,this.primaryResponsesRequired_<=0&&(this.log_("Primary connection is healthy."),this.isHealthy_=!0,this.conn_.markConnectionHealthy()))}onControl_(e){const t=Ii(_l,e);if(Pf in e){const s=e[Pf];if(t===mb){const i=Object.assign({},s);this.repoInfo_.isUsingEmulator&&(i.h=this.repoInfo_.host),this.onHandshake_(i)}else if(t===xf){this.log_("recvd end transmission on primary"),this.rx_=this.secondaryConn_;for(let i=0;i<this.pendingDataMessages.length;++i)this.onDataMessage_(this.pendingDataMessages[i]);this.pendingDataMessages=[],this.tryCleanupConnection()}else t===fb?this.onConnectionShutdown_(s):t===Nf?this.onReset_(s):t===pb?sc("Server Error: "+s):t===Df?(this.log_("got pong on primary."),this.onPrimaryResponse_(),this.sendPingOnPrimaryIfNecessary_()):sc("Unknown control packet command: "+t)}}onHandshake_(e){const t=e.ts,s=e.v,i=e.h;this.sessionId=e.s,this.repoInfo_.host=i,this.state_===0&&(this.conn_.start(),this.onConnectionEstablished_(this.conn_,t),Ch!==s&&at("Protocol version mismatch detected"),this.tryStartUpgrade_())}tryStartUpgrade_(){const e=this.transportManager_.upgradeTransport();e&&this.startUpgrade_(e)}startUpgrade_(e){this.secondaryConn_=new e(this.nextTransportId_(),this.repoInfo_,this.applicationId_,this.appCheckToken_,this.authToken_,this.sessionId),this.secondaryResponsesRequired_=e.responsesRequiredToBeHealthy||0;const t=this.connReceiver_(this.secondaryConn_),s=this.disconnReceiver_(this.secondaryConn_);this.secondaryConn_.open(t,s),$i(()=>{this.secondaryConn_&&(this.log_("Timed out trying to upgrade."),this.secondaryConn_.close())},Math.floor(cb))}onReset_(e){this.log_("Reset packet received.  New host: "+e),this.repoInfo_.host=e,this.state_===1?this.close():(this.closeConnections_(),this.start_())}onConnectionEstablished_(e,t){this.log_("Realtime connection established."),this.conn_=e,this.state_=1,this.onReady_&&(this.onReady_(t,this.sessionId),this.onReady_=null),this.primaryResponsesRequired_===0?(this.log_("Primary connection is healthy."),this.isHealthy_=!0):$i(()=>{this.sendPingOnPrimaryIfNecessary_()},Math.floor(hb))}sendPingOnPrimaryIfNecessary_(){!this.isHealthy_&&this.state_===1&&(this.log_("sending ping on primary."),this.sendData_({t:"c",d:{t:Of,d:{}}}))}onSecondaryConnectionLost_(){const e=this.secondaryConn_;this.secondaryConn_=null,(this.tx_===e||this.rx_===e)&&this.close()}onConnectionLost_(e){this.conn_=null,!e&&this.state_===0?(this.log_("Realtime connection failed."),this.repoInfo_.isCacheableHost()&&(Kn.remove("host:"+this.repoInfo_.host),this.repoInfo_.internalHost=this.repoInfo_.host)):this.state_===1&&this.log_("Realtime connection lost."),this.close()}onConnectionShutdown_(e){this.log_("Connection shutdown command received. Shutting down..."),this.onKill_&&(this.onKill_(e),this.onKill_=null),this.onDisconnect_=null,this.close()}sendData_(e){if(this.state_!==1)throw"Connection is not connected";this.tx_.send(e)}close(){this.state_!==2&&(this.log_("Closing realtime connection."),this.state_=2,this.closeConnections_(),this.onDisconnect_&&(this.onDisconnect_(),this.onDisconnect_=null))}closeConnections_(){this.log_("Shutting down all connections"),this.conn_&&(this.conn_.close(),this.conn_=null),this.secondaryConn_&&(this.secondaryConn_.close(),this.secondaryConn_=null),this.healthyTimeout_&&(clearTimeout(this.healthyTimeout_),this.healthyTimeout_=null)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class a_{put(e,t,s,i){}merge(e,t,s,i){}refreshAuthToken(e){}refreshAppCheckToken(e){}onDisconnectPut(e,t,s){}onDisconnectMerge(e,t,s){}onDisconnectCancel(e,t){}reportStats(e){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class l_{constructor(e){this.allowedEvents_=e,this.listeners_={},D(Array.isArray(e)&&e.length>0,"Requires a non-empty array")}trigger(e,...t){if(Array.isArray(this.listeners_[e])){const s=[...this.listeners_[e]];for(let i=0;i<s.length;i++)s[i].callback.apply(s[i].context,t)}}on(e,t,s){this.validateEventType_(e),this.listeners_[e]=this.listeners_[e]||[],this.listeners_[e].push({callback:t,context:s});const i=this.getInitialEvent(e);i&&t.apply(s,i)}off(e,t,s){this.validateEventType_(e);const i=this.listeners_[e]||[];for(let r=0;r<i.length;r++)if(i[r].callback===t&&(!s||s===i[r].context)){i.splice(r,1);return}}validateEventType_(e){D(this.allowedEvents_.find(t=>t===e),"Unknown event: "+e)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class jo extends l_{constructor(){super(["online"]),this.online_=!0,typeof window<"u"&&typeof window.addEventListener<"u"&&!Cc()&&(window.addEventListener("online",()=>{this.online_||(this.online_=!0,this.trigger("online",!0))},!1),window.addEventListener("offline",()=>{this.online_&&(this.online_=!1,this.trigger("online",!1))},!1))}static getInstance(){return new jo}getInitialEvent(e){return D(e==="online","Unknown event type: "+e),[this.online_]}currentlyOnline(){return this.online_}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Mf=32,Vf=768;class ue{constructor(e,t){if(t===void 0){this.pieces_=e.split("/");let s=0;for(let i=0;i<this.pieces_.length;i++)this.pieces_[i].length>0&&(this.pieces_[s]=this.pieces_[i],s++);this.pieces_.length=s,this.pieceNum_=0}else this.pieces_=e,this.pieceNum_=t}toString(){let e="";for(let t=this.pieceNum_;t<this.pieces_.length;t++)this.pieces_[t]!==""&&(e+="/"+this.pieces_[t]);return e||"/"}}function le(){return new ue("")}function J(n){return n.pieceNum_>=n.pieces_.length?null:n.pieces_[n.pieceNum_]}function On(n){return n.pieces_.length-n.pieceNum_}function ye(n){let e=n.pieceNum_;return e<n.pieces_.length&&e++,new ue(n.pieces_,e)}function Sh(n){return n.pieceNum_<n.pieces_.length?n.pieces_[n.pieces_.length-1]:null}function _b(n){let e="";for(let t=n.pieceNum_;t<n.pieces_.length;t++)n.pieces_[t]!==""&&(e+="/"+encodeURIComponent(String(n.pieces_[t])));return e||"/"}function ir(n,e=0){return n.pieces_.slice(n.pieceNum_+e)}function c_(n){if(n.pieceNum_>=n.pieces_.length)return null;const e=[];for(let t=n.pieceNum_;t<n.pieces_.length-1;t++)e.push(n.pieces_[t]);return new ue(e,0)}function Ie(n,e){const t=[];for(let s=n.pieceNum_;s<n.pieces_.length;s++)t.push(n.pieces_[s]);if(e instanceof ue)for(let s=e.pieceNum_;s<e.pieces_.length;s++)t.push(e.pieces_[s]);else{const s=e.split("/");for(let i=0;i<s.length;i++)s[i].length>0&&t.push(s[i])}return new ue(t,0)}function X(n){return n.pieceNum_>=n.pieces_.length}function ot(n,e){const t=J(n),s=J(e);if(t===null)return e;if(t===s)return ot(ye(n),ye(e));throw new Error("INTERNAL ERROR: innerPath ("+e+") is not within outerPath ("+n+")")}function yb(n,e){const t=ir(n,0),s=ir(e,0);for(let i=0;i<t.length&&i<s.length;i++){const r=us(t[i],s[i]);if(r!==0)return r}return t.length===s.length?0:t.length<s.length?-1:1}function Ah(n,e){if(On(n)!==On(e))return!1;for(let t=n.pieceNum_,s=e.pieceNum_;t<=n.pieces_.length;t++,s++)if(n.pieces_[t]!==e.pieces_[s])return!1;return!0}function gt(n,e){let t=n.pieceNum_,s=e.pieceNum_;if(On(n)>On(e))return!1;for(;t<n.pieces_.length;){if(n.pieces_[t]!==e.pieces_[s])return!1;++t,++s}return!0}class vb{constructor(e,t){this.errorPrefix_=t,this.parts_=ir(e,0),this.byteLength_=Math.max(1,this.parts_.length);for(let s=0;s<this.parts_.length;s++)this.byteLength_+=ra(this.parts_[s]);h_(this)}}function Eb(n,e){n.parts_.length>0&&(n.byteLength_+=1),n.parts_.push(e),n.byteLength_+=ra(e),h_(n)}function wb(n){const e=n.parts_.pop();n.byteLength_-=ra(e),n.parts_.length>0&&(n.byteLength_-=1)}function h_(n){if(n.byteLength_>Vf)throw new Error(n.errorPrefix_+"has a key path longer than "+Vf+" bytes ("+n.byteLength_+").");if(n.parts_.length>Mf)throw new Error(n.errorPrefix_+"path specified exceeds the maximum depth that can be written ("+Mf+") or object contains a cycle "+zn(n))}function zn(n){return n.parts_.length===0?"":"in property '"+n.parts_.join(".")+"'"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class kh extends l_{constructor(){super(["visible"]);let e,t;typeof document<"u"&&typeof document.addEventListener<"u"&&(typeof document.hidden<"u"?(t="visibilitychange",e="hidden"):typeof document.mozHidden<"u"?(t="mozvisibilitychange",e="mozHidden"):typeof document.msHidden<"u"?(t="msvisibilitychange",e="msHidden"):typeof document.webkitHidden<"u"&&(t="webkitvisibilitychange",e="webkitHidden")),this.visible_=!0,t&&document.addEventListener(t,()=>{const s=!document[e];s!==this.visible_&&(this.visible_=s,this.trigger("visible",s))},!1)}static getInstance(){return new kh}getInitialEvent(e){return D(e==="visible","Unknown event type: "+e),[this.visible_]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ci=1e3,Tb=60*5*1e3,Ff=30*1e3,Ib=1.3,Cb=3e4,bb="server_kill",Bf=3;class tn extends a_{constructor(e,t,s,i,r,o,l,c){if(super(),this.repoInfo_=e,this.applicationId_=t,this.onDataUpdate_=s,this.onConnectStatus_=i,this.onServerInfoUpdate_=r,this.authTokenProvider_=o,this.appCheckTokenProvider_=l,this.authOverride_=c,this.id=tn.nextPersistentConnectionId_++,this.log_=Rr("p:"+this.id+":"),this.interruptReasons_={},this.listens=new Map,this.outstandingPuts_=[],this.outstandingGets_=[],this.outstandingPutCount_=0,this.outstandingGetCount_=0,this.onDisconnectRequestQueue_=[],this.connected_=!1,this.reconnectDelay_=Ci,this.maxReconnectDelay_=Tb,this.securityDebugCallback_=null,this.lastSessionId=null,this.establishConnectionTimer_=null,this.visible_=!1,this.requestCBHash_={},this.requestNumber_=0,this.realtime_=null,this.authToken_=null,this.appCheckToken_=null,this.forceTokenRefresh_=!1,this.invalidAuthTokenCount_=0,this.invalidAppCheckTokenCount_=0,this.firstConnection_=!0,this.lastConnectionAttemptTime_=null,this.lastConnectionEstablishedTime_=null,c)throw new Error("Auth override specified in options, but not supported on non Node.js platforms");kh.getInstance().on("visible",this.onVisible_,this),e.host.indexOf("fblocal")===-1&&jo.getInstance().on("online",this.onOnline_,this)}sendRequest(e,t,s){const i=++this.requestNumber_,r={r:i,a:e,b:t};this.log_(Ne(r)),D(this.connected_,"sendRequest call when we're not connected not allowed."),this.realtime_.sendRequest(r),s&&(this.requestCBHash_[i]=s)}get(e){this.initConnection_();const t=new hr,i={action:"g",request:{p:e._path.toString(),q:e._queryObject},onComplete:o=>{const l=o.d;o.s==="ok"?t.resolve(l):t.reject(l)}};this.outstandingGets_.push(i),this.outstandingGetCount_++;const r=this.outstandingGets_.length-1;return this.connected_&&this.sendGet_(r),t.promise}listen(e,t,s,i){this.initConnection_();const r=e._queryIdentifier,o=e._path.toString();this.log_("Listen called for "+o+" "+r),this.listens.has(o)||this.listens.set(o,new Map),D(e._queryParams.isDefault()||!e._queryParams.loadsAllData(),"listen() called for non-default but complete query"),D(!this.listens.get(o).has(r),"listen() called twice for same path/queryId.");const l={onComplete:i,hashFn:t,query:e,tag:s};this.listens.get(o).set(r,l),this.connected_&&this.sendListen_(l)}sendGet_(e){const t=this.outstandingGets_[e];this.sendRequest("g",t.request,s=>{delete this.outstandingGets_[e],this.outstandingGetCount_--,this.outstandingGetCount_===0&&(this.outstandingGets_=[]),t.onComplete&&t.onComplete(s)})}sendListen_(e){const t=e.query,s=t._path.toString(),i=t._queryIdentifier;this.log_("Listen on "+s+" for "+i);const r={p:s},o="q";e.tag&&(r.q=t._queryObject,r.t=e.tag),r.h=e.hashFn(),this.sendRequest(o,r,l=>{const c=l.d,h=l.s;tn.warnOnListenWarnings_(c,t),(this.listens.get(s)&&this.listens.get(s).get(i))===e&&(this.log_("listen response",l),h!=="ok"&&this.removeListen_(s,i),e.onComplete&&e.onComplete(h,c))})}static warnOnListenWarnings_(e,t){if(e&&typeof e=="object"&&Vt(e,"w")){const s=Ms(e,"w");if(Array.isArray(s)&&~s.indexOf("no_index")){const i='".indexOn": "'+t._queryParams.getIndex().toString()+'"',r=t._path.toString();at(`Using an unspecified index. Your data will be downloaded and filtered on the client. Consider adding ${i} at ${r} to your security rules for better performance.`)}}}refreshAuthToken(e){this.authToken_=e,this.log_("Auth token refreshed"),this.authToken_?this.tryAuth():this.connected_&&this.sendRequest("unauth",{},()=>{}),this.reduceReconnectDelayIfAdminCredential_(e)}reduceReconnectDelayIfAdminCredential_(e){(e&&e.length===40||uv(e))&&(this.log_("Admin auth credential detected.  Reducing max reconnect time."),this.maxReconnectDelay_=Ff)}refreshAppCheckToken(e){this.appCheckToken_=e,this.log_("App check token refreshed"),this.appCheckToken_?this.tryAppCheck():this.connected_&&this.sendRequest("unappeck",{},()=>{})}tryAuth(){if(this.connected_&&this.authToken_){const e=this.authToken_,t=hv(e)?"auth":"gauth",s={cred:e};this.authOverride_===null?s.noauth=!0:typeof this.authOverride_=="object"&&(s.authvar=this.authOverride_),this.sendRequest(t,s,i=>{const r=i.s,o=i.d||"error";this.authToken_===e&&(r==="ok"?this.invalidAuthTokenCount_=0:this.onAuthRevoked_(r,o))})}}tryAppCheck(){this.connected_&&this.appCheckToken_&&this.sendRequest("appcheck",{token:this.appCheckToken_},e=>{const t=e.s,s=e.d||"error";t==="ok"?this.invalidAppCheckTokenCount_=0:this.onAppCheckRevoked_(t,s)})}unlisten(e,t){const s=e._path.toString(),i=e._queryIdentifier;this.log_("Unlisten called for "+s+" "+i),D(e._queryParams.isDefault()||!e._queryParams.loadsAllData(),"unlisten() called for non-default but complete query"),this.removeListen_(s,i)&&this.connected_&&this.sendUnlisten_(s,i,e._queryObject,t)}sendUnlisten_(e,t,s,i){this.log_("Unlisten on "+e+" for "+t);const r={p:e},o="n";i&&(r.q=s,r.t=i),this.sendRequest(o,r)}onDisconnectPut(e,t,s){this.initConnection_(),this.connected_?this.sendOnDisconnect_("o",e,t,s):this.onDisconnectRequestQueue_.push({pathString:e,action:"o",data:t,onComplete:s})}onDisconnectMerge(e,t,s){this.initConnection_(),this.connected_?this.sendOnDisconnect_("om",e,t,s):this.onDisconnectRequestQueue_.push({pathString:e,action:"om",data:t,onComplete:s})}onDisconnectCancel(e,t){this.initConnection_(),this.connected_?this.sendOnDisconnect_("oc",e,null,t):this.onDisconnectRequestQueue_.push({pathString:e,action:"oc",data:null,onComplete:t})}sendOnDisconnect_(e,t,s,i){const r={p:t,d:s};this.log_("onDisconnect "+e,r),this.sendRequest(e,r,o=>{i&&setTimeout(()=>{i(o.s,o.d)},Math.floor(0))})}put(e,t,s,i){this.putInternal("p",e,t,s,i)}merge(e,t,s,i){this.putInternal("m",e,t,s,i)}putInternal(e,t,s,i,r){this.initConnection_();const o={p:t,d:s};r!==void 0&&(o.h=r),this.outstandingPuts_.push({action:e,request:o,onComplete:i}),this.outstandingPutCount_++;const l=this.outstandingPuts_.length-1;this.connected_?this.sendPut_(l):this.log_("Buffering put: "+t)}sendPut_(e){const t=this.outstandingPuts_[e].action,s=this.outstandingPuts_[e].request,i=this.outstandingPuts_[e].onComplete;this.outstandingPuts_[e].queued=this.connected_,this.sendRequest(t,s,r=>{this.log_(t+" response",r),delete this.outstandingPuts_[e],this.outstandingPutCount_--,this.outstandingPutCount_===0&&(this.outstandingPuts_=[]),i&&i(r.s,r.d)})}reportStats(e){if(this.connected_){const t={c:e};this.log_("reportStats",t),this.sendRequest("s",t,s=>{if(s.s!=="ok"){const r=s.d;this.log_("reportStats","Error sending stats: "+r)}})}}onDataMessage_(e){if("r"in e){this.log_("from server: "+Ne(e));const t=e.r,s=this.requestCBHash_[t];s&&(delete this.requestCBHash_[t],s(e.b))}else{if("error"in e)throw"A server-side error has occurred: "+e.error;"a"in e&&this.onDataPush_(e.a,e.b)}}onDataPush_(e,t){this.log_("handleServerMessage",e,t),e==="d"?this.onDataUpdate_(t.p,t.d,!1,t.t):e==="m"?this.onDataUpdate_(t.p,t.d,!0,t.t):e==="c"?this.onListenRevoked_(t.p,t.q):e==="ac"?this.onAuthRevoked_(t.s,t.d):e==="apc"?this.onAppCheckRevoked_(t.s,t.d):e==="sd"?this.onSecurityDebugPacket_(t):sc("Unrecognized action received from server: "+Ne(e)+`
Are you using the latest client?`)}onReady_(e,t){this.log_("connection ready"),this.connected_=!0,this.lastConnectionEstablishedTime_=new Date().getTime(),this.handleTimestamp_(e),this.lastSessionId=t,this.firstConnection_&&this.sendConnectStats_(),this.restoreState_(),this.firstConnection_=!1,this.onConnectStatus_(!0)}scheduleConnect_(e){D(!this.realtime_,"Scheduling a connect when we're already connected/ing?"),this.establishConnectionTimer_&&clearTimeout(this.establishConnectionTimer_),this.establishConnectionTimer_=setTimeout(()=>{this.establishConnectionTimer_=null,this.establishConnection_()},Math.floor(e))}initConnection_(){!this.realtime_&&this.firstConnection_&&this.scheduleConnect_(0)}onVisible_(e){e&&!this.visible_&&this.reconnectDelay_===this.maxReconnectDelay_&&(this.log_("Window became visible.  Reducing delay."),this.reconnectDelay_=Ci,this.realtime_||this.scheduleConnect_(0)),this.visible_=e}onOnline_(e){e?(this.log_("Browser went online."),this.reconnectDelay_=Ci,this.realtime_||this.scheduleConnect_(0)):(this.log_("Browser went offline.  Killing connection."),this.realtime_&&this.realtime_.close())}onRealtimeDisconnect_(){if(this.log_("data client disconnected"),this.connected_=!1,this.realtime_=null,this.cancelSentTransactions_(),this.requestCBHash_={},this.shouldReconnect_()){this.visible_?this.lastConnectionEstablishedTime_&&(new Date().getTime()-this.lastConnectionEstablishedTime_>Cb&&(this.reconnectDelay_=Ci),this.lastConnectionEstablishedTime_=null):(this.log_("Window isn't visible.  Delaying reconnect."),this.reconnectDelay_=this.maxReconnectDelay_,this.lastConnectionAttemptTime_=new Date().getTime());const e=new Date().getTime()-this.lastConnectionAttemptTime_;let t=Math.max(0,this.reconnectDelay_-e);t=Math.random()*t,this.log_("Trying to reconnect in "+t+"ms"),this.scheduleConnect_(t),this.reconnectDelay_=Math.min(this.maxReconnectDelay_,this.reconnectDelay_*Ib)}this.onConnectStatus_(!1)}async establishConnection_(){if(this.shouldReconnect_()){this.log_("Making a connection attempt"),this.lastConnectionAttemptTime_=new Date().getTime(),this.lastConnectionEstablishedTime_=null;const e=this.onDataMessage_.bind(this),t=this.onReady_.bind(this),s=this.onRealtimeDisconnect_.bind(this),i=this.id+":"+tn.nextConnectionId_++,r=this.lastSessionId;let o=!1,l=null;const c=function(){l?l.close():(o=!0,s())},h=function(p){D(l,"sendRequest call when we're not connected not allowed."),l.sendRequest(p)};this.realtime_={close:c,sendRequest:h};const d=this.forceTokenRefresh_;this.forceTokenRefresh_=!1;try{const[p,m]=await Promise.all([this.authTokenProvider_.getToken(d),this.appCheckTokenProvider_.getToken(d)]);o?Ue("getToken() completed but was canceled"):(Ue("getToken() completed. Creating connection."),this.authToken_=p&&p.accessToken,this.appCheckToken_=m&&m.token,l=new gb(i,this.repoInfo_,this.applicationId_,this.appCheckToken_,this.authToken_,e,t,s,E=>{at(E+" ("+this.repoInfo_.toString()+")"),this.interrupt(bb)},r))}catch(p){this.log_("Failed to get token: "+p),o||(this.repoInfo_.nodeAdmin&&at(p),c())}}}interrupt(e){Ue("Interrupting connection for reason: "+e),this.interruptReasons_[e]=!0,this.realtime_?this.realtime_.close():(this.establishConnectionTimer_&&(clearTimeout(this.establishConnectionTimer_),this.establishConnectionTimer_=null),this.connected_&&this.onRealtimeDisconnect_())}resume(e){Ue("Resuming connection for reason: "+e),delete this.interruptReasons_[e],Ll(this.interruptReasons_)&&(this.reconnectDelay_=Ci,this.realtime_||this.scheduleConnect_(0))}handleTimestamp_(e){const t=e-new Date().getTime();this.onServerInfoUpdate_({serverTimeOffset:t})}cancelSentTransactions_(){for(let e=0;e<this.outstandingPuts_.length;e++){const t=this.outstandingPuts_[e];t&&"h"in t.request&&t.queued&&(t.onComplete&&t.onComplete("disconnect"),delete this.outstandingPuts_[e],this.outstandingPutCount_--)}this.outstandingPutCount_===0&&(this.outstandingPuts_=[])}onListenRevoked_(e,t){let s;t?s=t.map(r=>Ih(r)).join("$"):s="default";const i=this.removeListen_(e,s);i&&i.onComplete&&i.onComplete("permission_denied")}removeListen_(e,t){const s=new ue(e).toString();let i;if(this.listens.has(s)){const r=this.listens.get(s);i=r.get(t),r.delete(t),r.size===0&&this.listens.delete(s)}else i=void 0;return i}onAuthRevoked_(e,t){Ue("Auth token revoked: "+e+"/"+t),this.authToken_=null,this.forceTokenRefresh_=!0,this.realtime_.close(),(e==="invalid_token"||e==="permission_denied")&&(this.invalidAuthTokenCount_++,this.invalidAuthTokenCount_>=Bf&&(this.reconnectDelay_=Ff,this.authTokenProvider_.notifyForInvalidToken()))}onAppCheckRevoked_(e,t){Ue("App check token revoked: "+e+"/"+t),this.appCheckToken_=null,this.forceTokenRefresh_=!0,(e==="invalid_token"||e==="permission_denied")&&(this.invalidAppCheckTokenCount_++,this.invalidAppCheckTokenCount_>=Bf&&this.appCheckTokenProvider_.notifyForInvalidToken())}onSecurityDebugPacket_(e){this.securityDebugCallback_?this.securityDebugCallback_(e):"msg"in e&&console.log("FIREBASE: "+e.msg.replace(`
`,`
FIREBASE: `))}restoreState_(){this.tryAuth(),this.tryAppCheck();for(const e of this.listens.values())for(const t of e.values())this.sendListen_(t);for(let e=0;e<this.outstandingPuts_.length;e++)this.outstandingPuts_[e]&&this.sendPut_(e);for(;this.onDisconnectRequestQueue_.length;){const e=this.onDisconnectRequestQueue_.shift();this.sendOnDisconnect_(e.action,e.pathString,e.data,e.onComplete)}for(let e=0;e<this.outstandingGets_.length;e++)this.outstandingGets_[e]&&this.sendGet_(e)}sendConnectStats_(){const e={};let t="js";e["sdk."+t+"."+Ug.replace(/\./g,"-")]=1,Cc()?e["framework.cordova"]=1:Pp()&&(e["framework.reactnative"]=1),this.reportStats(e)}shouldReconnect_(){const e=jo.getInstance().currentlyOnline();return Ll(this.interruptReasons_)&&e}}tn.nextPersistentConnectionId_=0;tn.nextConnectionId_=0;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
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
 */class ba{getCompare(){return this.compare.bind(this)}indexedValueChanged(e,t){const s=new Z(is,e),i=new Z(is,t);return this.compare(s,i)!==0}minPost(){return Z.MIN}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let to;class u_ extends ba{static get __EMPTY_NODE(){return to}static set __EMPTY_NODE(e){to=e}compare(e,t){return us(e.name,t.name)}isDefinedOn(e){throw Ys("KeyIndex.isDefinedOn not expected to be called.")}indexedValueChanged(e,t){return!1}minPost(){return Z.MIN}maxPost(){return new Z(xn,to)}makePost(e,t){return D(typeof e=="string","KeyIndex indexValue must always be a string."),new Z(e,to)}toString(){return".key"}}const Jn=new u_;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class no{constructor(e,t,s,i,r=null){this.isReverse_=i,this.resultGenerator_=r,this.nodeStack_=[];let o=1;for(;!e.isEmpty();)if(e=e,o=t?s(e.key,t):1,i&&(o*=-1),o<0)this.isReverse_?e=e.left:e=e.right;else if(o===0){this.nodeStack_.push(e);break}else this.nodeStack_.push(e),this.isReverse_?e=e.right:e=e.left}getNext(){if(this.nodeStack_.length===0)return null;let e=this.nodeStack_.pop(),t;if(this.resultGenerator_?t=this.resultGenerator_(e.key,e.value):t={key:e.key,value:e.value},this.isReverse_)for(e=e.left;!e.isEmpty();)this.nodeStack_.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack_.push(e),e=e.left;return t}hasNext(){return this.nodeStack_.length>0}peek(){if(this.nodeStack_.length===0)return null;const e=this.nodeStack_[this.nodeStack_.length-1];return this.resultGenerator_?this.resultGenerator_(e.key,e.value):{key:e.key,value:e.value}}}class Me{constructor(e,t,s,i,r){this.key=e,this.value=t,this.color=s??Me.RED,this.left=i??ct.EMPTY_NODE,this.right=r??ct.EMPTY_NODE}copy(e,t,s,i,r){return new Me(e??this.key,t??this.value,s??this.color,i??this.left,r??this.right)}count(){return this.left.count()+1+this.right.count()}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||!!e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min_(){return this.left.isEmpty()?this:this.left.min_()}minKey(){return this.min_().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,t,s){let i=this;const r=s(e,i.key);return r<0?i=i.copy(null,null,null,i.left.insert(e,t,s),null):r===0?i=i.copy(null,t,null,null,null):i=i.copy(null,null,null,null,i.right.insert(e,t,s)),i.fixUp_()}removeMin_(){if(this.left.isEmpty())return ct.EMPTY_NODE;let e=this;return!e.left.isRed_()&&!e.left.left.isRed_()&&(e=e.moveRedLeft_()),e=e.copy(null,null,null,e.left.removeMin_(),null),e.fixUp_()}remove(e,t){let s,i;if(s=this,t(e,s.key)<0)!s.left.isEmpty()&&!s.left.isRed_()&&!s.left.left.isRed_()&&(s=s.moveRedLeft_()),s=s.copy(null,null,null,s.left.remove(e,t),null);else{if(s.left.isRed_()&&(s=s.rotateRight_()),!s.right.isEmpty()&&!s.right.isRed_()&&!s.right.left.isRed_()&&(s=s.moveRedRight_()),t(e,s.key)===0){if(s.right.isEmpty())return ct.EMPTY_NODE;i=s.right.min_(),s=s.copy(i.key,i.value,null,null,s.right.removeMin_())}s=s.copy(null,null,null,null,s.right.remove(e,t))}return s.fixUp_()}isRed_(){return this.color}fixUp_(){let e=this;return e.right.isRed_()&&!e.left.isRed_()&&(e=e.rotateLeft_()),e.left.isRed_()&&e.left.left.isRed_()&&(e=e.rotateRight_()),e.left.isRed_()&&e.right.isRed_()&&(e=e.colorFlip_()),e}moveRedLeft_(){let e=this.colorFlip_();return e.right.left.isRed_()&&(e=e.copy(null,null,null,null,e.right.rotateRight_()),e=e.rotateLeft_(),e=e.colorFlip_()),e}moveRedRight_(){let e=this.colorFlip_();return e.left.left.isRed_()&&(e=e.rotateRight_(),e=e.colorFlip_()),e}rotateLeft_(){const e=this.copy(null,null,Me.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight_(){const e=this.copy(null,null,Me.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip_(){const e=this.left.copy(null,null,!this.left.color,null,null),t=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,t)}checkMaxDepth_(){const e=this.check_();return Math.pow(2,e)<=this.count()+1}check_(){if(this.isRed_()&&this.left.isRed_())throw new Error("Red node has red child("+this.key+","+this.value+")");if(this.right.isRed_())throw new Error("Right child of ("+this.key+","+this.value+") is red");const e=this.left.check_();if(e!==this.right.check_())throw new Error("Black depths differ");return e+(this.isRed_()?0:1)}}Me.RED=!0;Me.BLACK=!1;class Rb{copy(e,t,s,i,r){return this}insert(e,t,s){return new Me(e,t,null)}remove(e,t){return this}count(){return 0}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}check_(){return 0}isRed_(){return!1}}class ct{constructor(e,t=ct.EMPTY_NODE){this.comparator_=e,this.root_=t}insert(e,t){return new ct(this.comparator_,this.root_.insert(e,t,this.comparator_).copy(null,null,Me.BLACK,null,null))}remove(e){return new ct(this.comparator_,this.root_.remove(e,this.comparator_).copy(null,null,Me.BLACK,null,null))}get(e){let t,s=this.root_;for(;!s.isEmpty();){if(t=this.comparator_(e,s.key),t===0)return s.value;t<0?s=s.left:t>0&&(s=s.right)}return null}getPredecessorKey(e){let t,s=this.root_,i=null;for(;!s.isEmpty();)if(t=this.comparator_(e,s.key),t===0){if(s.left.isEmpty())return i?i.key:null;for(s=s.left;!s.right.isEmpty();)s=s.right;return s.key}else t<0?s=s.left:t>0&&(i=s,s=s.right);throw new Error("Attempted to find predecessor key for a nonexistent key.  What gives?")}isEmpty(){return this.root_.isEmpty()}count(){return this.root_.count()}minKey(){return this.root_.minKey()}maxKey(){return this.root_.maxKey()}inorderTraversal(e){return this.root_.inorderTraversal(e)}reverseTraversal(e){return this.root_.reverseTraversal(e)}getIterator(e){return new no(this.root_,null,this.comparator_,!1,e)}getIteratorFrom(e,t){return new no(this.root_,e,this.comparator_,!1,t)}getReverseIteratorFrom(e,t){return new no(this.root_,e,this.comparator_,!0,t)}getReverseIterator(e){return new no(this.root_,null,this.comparator_,!0,e)}}ct.EMPTY_NODE=new Rb;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Sb(n,e){return us(n.name,e.name)}function Ph(n,e){return us(n,e)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let rc;function Ab(n){rc=n}const d_=function(n){return typeof n=="number"?"number:"+jg(n):"string:"+n},f_=function(n){if(n.isLeafNode()){const e=n.val();D(typeof e=="string"||typeof e=="number"||typeof e=="object"&&Vt(e,".sv"),"Priority must be a string or number.")}else D(n===rc||n.isEmpty(),"priority of unexpected type.");D(n===rc||n.getPriority().isEmpty(),"Priority nodes can't have a priority of their own.")};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Uf;class xe{constructor(e,t=xe.__childrenNodeConstructor.EMPTY_NODE){this.value_=e,this.priorityNode_=t,this.lazyHash_=null,D(this.value_!==void 0&&this.value_!==null,"LeafNode shouldn't be created with null/undefined value."),f_(this.priorityNode_)}static set __childrenNodeConstructor(e){Uf=e}static get __childrenNodeConstructor(){return Uf}isLeafNode(){return!0}getPriority(){return this.priorityNode_}updatePriority(e){return new xe(this.value_,e)}getImmediateChild(e){return e===".priority"?this.priorityNode_:xe.__childrenNodeConstructor.EMPTY_NODE}getChild(e){return X(e)?this:J(e)===".priority"?this.priorityNode_:xe.__childrenNodeConstructor.EMPTY_NODE}hasChild(){return!1}getPredecessorChildName(e,t){return null}updateImmediateChild(e,t){return e===".priority"?this.updatePriority(t):t.isEmpty()&&e!==".priority"?this:xe.__childrenNodeConstructor.EMPTY_NODE.updateImmediateChild(e,t).updatePriority(this.priorityNode_)}updateChild(e,t){const s=J(e);return s===null?t:t.isEmpty()&&s!==".priority"?this:(D(s!==".priority"||On(e)===1,".priority must be the last token in a path"),this.updateImmediateChild(s,xe.__childrenNodeConstructor.EMPTY_NODE.updateChild(ye(e),t)))}isEmpty(){return!1}numChildren(){return 0}forEachChild(e,t){return!1}val(e){return e&&!this.getPriority().isEmpty()?{".value":this.getValue(),".priority":this.getPriority().val()}:this.getValue()}hash(){if(this.lazyHash_===null){let e="";this.priorityNode_.isEmpty()||(e+="priority:"+d_(this.priorityNode_.val())+":");const t=typeof this.value_;e+=t+":",t==="number"?e+=jg(this.value_):e+=this.value_,this.lazyHash_=Wg(e)}return this.lazyHash_}getValue(){return this.value_}compareTo(e){return e===xe.__childrenNodeConstructor.EMPTY_NODE?1:e instanceof xe.__childrenNodeConstructor?-1:(D(e.isLeafNode(),"Unknown node type"),this.compareToLeafNode_(e))}compareToLeafNode_(e){const t=typeof e.value_,s=typeof this.value_,i=xe.VALUE_TYPE_ORDER.indexOf(t),r=xe.VALUE_TYPE_ORDER.indexOf(s);return D(i>=0,"Unknown leaf type: "+t),D(r>=0,"Unknown leaf type: "+s),i===r?s==="object"?0:this.value_<e.value_?-1:this.value_===e.value_?0:1:r-i}withIndex(){return this}isIndexed(){return!0}equals(e){if(e===this)return!0;if(e.isLeafNode()){const t=e;return this.value_===t.value_&&this.priorityNode_.equals(t.priorityNode_)}else return!1}}xe.VALUE_TYPE_ORDER=["object","boolean","number","string"];/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let p_,m_;function kb(n){p_=n}function Pb(n){m_=n}class Nb extends ba{compare(e,t){const s=e.node.getPriority(),i=t.node.getPriority(),r=s.compareTo(i);return r===0?us(e.name,t.name):r}isDefinedOn(e){return!e.getPriority().isEmpty()}indexedValueChanged(e,t){return!e.getPriority().equals(t.getPriority())}minPost(){return Z.MIN}maxPost(){return new Z(xn,new xe("[PRIORITY-POST]",m_))}makePost(e,t){const s=p_(e);return new Z(t,new xe("[PRIORITY-POST]",s))}toString(){return".priority"}}const we=new Nb;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Db=Math.log(2);class Lb{constructor(e){const t=r=>parseInt(Math.log(r)/Db,10),s=r=>parseInt(Array(r+1).join("1"),2);this.count=t(e+1),this.current_=this.count-1;const i=s(this.count);this.bits_=e+1&i}nextBitIsOne(){const e=!(this.bits_&1<<this.current_);return this.current_--,e}}const zo=function(n,e,t,s){n.sort(e);const i=function(c,h){const d=h-c;let p,m;if(d===0)return null;if(d===1)return p=n[c],m=t?t(p):p,new Me(m,p.node,Me.BLACK,null,null);{const E=parseInt(d/2,10)+c,C=i(c,E),S=i(E+1,h);return p=n[E],m=t?t(p):p,new Me(m,p.node,Me.BLACK,C,S)}},r=function(c){let h=null,d=null,p=n.length;const m=function(C,S){const k=p-C,F=p;p-=C;const U=i(k+1,F),q=n[k],ee=t?t(q):q;E(new Me(ee,q.node,S,null,U))},E=function(C){h?(h.left=C,h=C):(d=C,h=C)};for(let C=0;C<c.count;++C){const S=c.nextBitIsOne(),k=Math.pow(2,c.count-(C+1));S?m(k,Me.BLACK):(m(k,Me.BLACK),m(k,Me.RED))}return d},o=new Lb(n.length),l=r(o);return new ct(s||e,l)};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let yl;const Is={};class en{constructor(e,t){this.indexes_=e,this.indexSet_=t}static get Default(){return D(Is&&we,"ChildrenNode.ts has not been loaded"),yl=yl||new en({".priority":Is},{".priority":we}),yl}get(e){const t=Ms(this.indexes_,e);if(!t)throw new Error("No index defined for "+e);return t instanceof ct?t:null}hasIndex(e){return Vt(this.indexSet_,e.toString())}addIndex(e,t){D(e!==Jn,"KeyIndex always exists and isn't meant to be added to the IndexMap.");const s=[];let i=!1;const r=t.getIterator(Z.Wrap);let o=r.getNext();for(;o;)i=i||e.isDefinedOn(o.node),s.push(o),o=r.getNext();let l;i?l=zo(s,e.getCompare()):l=Is;const c=e.toString(),h=Object.assign({},this.indexSet_);h[c]=e;const d=Object.assign({},this.indexes_);return d[c]=l,new en(d,h)}addToIndexes(e,t){const s=Io(this.indexes_,(i,r)=>{const o=Ms(this.indexSet_,r);if(D(o,"Missing index implementation for "+r),i===Is)if(o.isDefinedOn(e.node)){const l=[],c=t.getIterator(Z.Wrap);let h=c.getNext();for(;h;)h.name!==e.name&&l.push(h),h=c.getNext();return l.push(e),zo(l,o.getCompare())}else return Is;else{const l=t.get(e.name);let c=i;return l&&(c=c.remove(new Z(e.name,l))),c.insert(e,e.node)}});return new en(s,this.indexSet_)}removeFromIndexes(e,t){const s=Io(this.indexes_,i=>{if(i===Is)return i;{const r=t.get(e.name);return r?i.remove(new Z(e.name,r)):i}});return new en(s,this.indexSet_)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let bi;class z{constructor(e,t,s){this.children_=e,this.priorityNode_=t,this.indexMap_=s,this.lazyHash_=null,this.priorityNode_&&f_(this.priorityNode_),this.children_.isEmpty()&&D(!this.priorityNode_||this.priorityNode_.isEmpty(),"An empty node cannot have a priority")}static get EMPTY_NODE(){return bi||(bi=new z(new ct(Ph),null,en.Default))}isLeafNode(){return!1}getPriority(){return this.priorityNode_||bi}updatePriority(e){return this.children_.isEmpty()?this:new z(this.children_,e,this.indexMap_)}getImmediateChild(e){if(e===".priority")return this.getPriority();{const t=this.children_.get(e);return t===null?bi:t}}getChild(e){const t=J(e);return t===null?this:this.getImmediateChild(t).getChild(ye(e))}hasChild(e){return this.children_.get(e)!==null}updateImmediateChild(e,t){if(D(t,"We should always be passing snapshot nodes"),e===".priority")return this.updatePriority(t);{const s=new Z(e,t);let i,r;t.isEmpty()?(i=this.children_.remove(e),r=this.indexMap_.removeFromIndexes(s,this.children_)):(i=this.children_.insert(e,t),r=this.indexMap_.addToIndexes(s,this.children_));const o=i.isEmpty()?bi:this.priorityNode_;return new z(i,o,r)}}updateChild(e,t){const s=J(e);if(s===null)return t;{D(J(e)!==".priority"||On(e)===1,".priority must be the last token in a path");const i=this.getImmediateChild(s).updateChild(ye(e),t);return this.updateImmediateChild(s,i)}}isEmpty(){return this.children_.isEmpty()}numChildren(){return this.children_.count()}val(e){if(this.isEmpty())return null;const t={};let s=0,i=0,r=!0;if(this.forEachChild(we,(o,l)=>{t[o]=l.val(e),s++,r&&z.INTEGER_REGEXP_.test(o)?i=Math.max(i,Number(o)):r=!1}),!e&&r&&i<2*s){const o=[];for(const l in t)o[l]=t[l];return o}else return e&&!this.getPriority().isEmpty()&&(t[".priority"]=this.getPriority().val()),t}hash(){if(this.lazyHash_===null){let e="";this.getPriority().isEmpty()||(e+="priority:"+d_(this.getPriority().val())+":"),this.forEachChild(we,(t,s)=>{const i=s.hash();i!==""&&(e+=":"+t+":"+i)}),this.lazyHash_=e===""?"":Wg(e)}return this.lazyHash_}getPredecessorChildName(e,t,s){const i=this.resolveIndex_(s);if(i){const r=i.getPredecessorKey(new Z(e,t));return r?r.name:null}else return this.children_.getPredecessorKey(e)}getFirstChildName(e){const t=this.resolveIndex_(e);if(t){const s=t.minKey();return s&&s.name}else return this.children_.minKey()}getFirstChild(e){const t=this.getFirstChildName(e);return t?new Z(t,this.children_.get(t)):null}getLastChildName(e){const t=this.resolveIndex_(e);if(t){const s=t.maxKey();return s&&s.name}else return this.children_.maxKey()}getLastChild(e){const t=this.getLastChildName(e);return t?new Z(t,this.children_.get(t)):null}forEachChild(e,t){const s=this.resolveIndex_(e);return s?s.inorderTraversal(i=>t(i.name,i.node)):this.children_.inorderTraversal(t)}getIterator(e){return this.getIteratorFrom(e.minPost(),e)}getIteratorFrom(e,t){const s=this.resolveIndex_(t);if(s)return s.getIteratorFrom(e,i=>i);{const i=this.children_.getIteratorFrom(e.name,Z.Wrap);let r=i.peek();for(;r!=null&&t.compare(r,e)<0;)i.getNext(),r=i.peek();return i}}getReverseIterator(e){return this.getReverseIteratorFrom(e.maxPost(),e)}getReverseIteratorFrom(e,t){const s=this.resolveIndex_(t);if(s)return s.getReverseIteratorFrom(e,i=>i);{const i=this.children_.getReverseIteratorFrom(e.name,Z.Wrap);let r=i.peek();for(;r!=null&&t.compare(r,e)>0;)i.getNext(),r=i.peek();return i}}compareTo(e){return this.isEmpty()?e.isEmpty()?0:-1:e.isLeafNode()||e.isEmpty()?1:e===Sr?-1:0}withIndex(e){if(e===Jn||this.indexMap_.hasIndex(e))return this;{const t=this.indexMap_.addIndex(e,this.children_);return new z(this.children_,this.priorityNode_,t)}}isIndexed(e){return e===Jn||this.indexMap_.hasIndex(e)}equals(e){if(e===this)return!0;if(e.isLeafNode())return!1;{const t=e;if(this.getPriority().equals(t.getPriority()))if(this.children_.count()===t.children_.count()){const s=this.getIterator(we),i=t.getIterator(we);let r=s.getNext(),o=i.getNext();for(;r&&o;){if(r.name!==o.name||!r.node.equals(o.node))return!1;r=s.getNext(),o=i.getNext()}return r===null&&o===null}else return!1;else return!1}}resolveIndex_(e){return e===Jn?null:this.indexMap_.get(e.toString())}}z.INTEGER_REGEXP_=/^(0|[1-9]\d*)$/;class xb extends z{constructor(){super(new ct(Ph),z.EMPTY_NODE,en.Default)}compareTo(e){return e===this?0:1}equals(e){return e===this}getPriority(){return this}getImmediateChild(e){return z.EMPTY_NODE}isEmpty(){return!1}}const Sr=new xb;Object.defineProperties(Z,{MIN:{value:new Z(is,z.EMPTY_NODE)},MAX:{value:new Z(xn,Sr)}});u_.__EMPTY_NODE=z.EMPTY_NODE;xe.__childrenNodeConstructor=z;Ab(Sr);Pb(Sr);/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ob=!0;function Pe(n,e=null){if(n===null)return z.EMPTY_NODE;if(typeof n=="object"&&".priority"in n&&(e=n[".priority"]),D(e===null||typeof e=="string"||typeof e=="number"||typeof e=="object"&&".sv"in e,"Invalid priority type found: "+typeof e),typeof n=="object"&&".value"in n&&n[".value"]!==null&&(n=n[".value"]),typeof n!="object"||".sv"in n){const t=n;return new xe(t,Pe(e))}if(!(n instanceof Array)&&Ob){const t=[];let s=!1;if(je(n,(o,l)=>{if(o.substring(0,1)!=="."){const c=Pe(l);c.isEmpty()||(s=s||!c.getPriority().isEmpty(),t.push(new Z(o,c)))}}),t.length===0)return z.EMPTY_NODE;const r=zo(t,Sb,o=>o.name,Ph);if(s){const o=zo(t,we.getCompare());return new z(r,Pe(e),new en({".priority":o},{".priority":we}))}else return new z(r,Pe(e),en.Default)}else{let t=z.EMPTY_NODE;return je(n,(s,i)=>{if(Vt(n,s)&&s.substring(0,1)!=="."){const r=Pe(i);(r.isLeafNode()||!r.isEmpty())&&(t=t.updateImmediateChild(s,r))}}),t.updatePriority(Pe(e))}}kb(Pe);/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Nh extends ba{constructor(e){super(),this.indexPath_=e,D(!X(e)&&J(e)!==".priority","Can't create PathIndex with empty path or .priority key")}extractChild(e){return e.getChild(this.indexPath_)}isDefinedOn(e){return!e.getChild(this.indexPath_).isEmpty()}compare(e,t){const s=this.extractChild(e.node),i=this.extractChild(t.node),r=s.compareTo(i);return r===0?us(e.name,t.name):r}makePost(e,t){const s=Pe(e),i=z.EMPTY_NODE.updateChild(this.indexPath_,s);return new Z(t,i)}maxPost(){const e=z.EMPTY_NODE.updateChild(this.indexPath_,Sr);return new Z(xn,e)}toString(){return ir(this.indexPath_,0).join("/")}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Mb extends ba{compare(e,t){const s=e.node.compareTo(t.node);return s===0?us(e.name,t.name):s}isDefinedOn(e){return!0}indexedValueChanged(e,t){return!e.equals(t)}minPost(){return Z.MIN}maxPost(){return Z.MAX}makePost(e,t){const s=Pe(e);return new Z(t,s)}toString(){return".value"}}const g_=new Mb;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function __(n){return{type:"value",snapshotNode:n}}function js(n,e){return{type:"child_added",snapshotNode:e,childName:n}}function rr(n,e){return{type:"child_removed",snapshotNode:e,childName:n}}function or(n,e,t){return{type:"child_changed",snapshotNode:e,childName:n,oldSnap:t}}function Vb(n,e){return{type:"child_moved",snapshotNode:e,childName:n}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Dh{constructor(e){this.index_=e}updateChild(e,t,s,i,r,o){D(e.isIndexed(this.index_),"A node must be indexed if only a child is updated");const l=e.getImmediateChild(t);return l.getChild(i).equals(s.getChild(i))&&l.isEmpty()===s.isEmpty()||(o!=null&&(s.isEmpty()?e.hasChild(t)?o.trackChildChange(rr(t,l)):D(e.isLeafNode(),"A child remove without an old child only makes sense on a leaf node"):l.isEmpty()?o.trackChildChange(js(t,s)):o.trackChildChange(or(t,s,l))),e.isLeafNode()&&s.isEmpty())?e:e.updateImmediateChild(t,s).withIndex(this.index_)}updateFullNode(e,t,s){return s!=null&&(e.isLeafNode()||e.forEachChild(we,(i,r)=>{t.hasChild(i)||s.trackChildChange(rr(i,r))}),t.isLeafNode()||t.forEachChild(we,(i,r)=>{if(e.hasChild(i)){const o=e.getImmediateChild(i);o.equals(r)||s.trackChildChange(or(i,r,o))}else s.trackChildChange(js(i,r))})),t.withIndex(this.index_)}updatePriority(e,t){return e.isEmpty()?z.EMPTY_NODE:e.updatePriority(t)}filtersNodes(){return!1}getIndexedFilter(){return this}getIndex(){return this.index_}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ar{constructor(e){this.indexedFilter_=new Dh(e.getIndex()),this.index_=e.getIndex(),this.startPost_=ar.getStartPost_(e),this.endPost_=ar.getEndPost_(e),this.startIsInclusive_=!e.startAfterSet_,this.endIsInclusive_=!e.endBeforeSet_}getStartPost(){return this.startPost_}getEndPost(){return this.endPost_}matches(e){const t=this.startIsInclusive_?this.index_.compare(this.getStartPost(),e)<=0:this.index_.compare(this.getStartPost(),e)<0,s=this.endIsInclusive_?this.index_.compare(e,this.getEndPost())<=0:this.index_.compare(e,this.getEndPost())<0;return t&&s}updateChild(e,t,s,i,r,o){return this.matches(new Z(t,s))||(s=z.EMPTY_NODE),this.indexedFilter_.updateChild(e,t,s,i,r,o)}updateFullNode(e,t,s){t.isLeafNode()&&(t=z.EMPTY_NODE);let i=t.withIndex(this.index_);i=i.updatePriority(z.EMPTY_NODE);const r=this;return t.forEachChild(we,(o,l)=>{r.matches(new Z(o,l))||(i=i.updateImmediateChild(o,z.EMPTY_NODE))}),this.indexedFilter_.updateFullNode(e,i,s)}updatePriority(e,t){return e}filtersNodes(){return!0}getIndexedFilter(){return this.indexedFilter_}getIndex(){return this.index_}static getStartPost_(e){if(e.hasStart()){const t=e.getIndexStartName();return e.getIndex().makePost(e.getIndexStartValue(),t)}else return e.getIndex().minPost()}static getEndPost_(e){if(e.hasEnd()){const t=e.getIndexEndName();return e.getIndex().makePost(e.getIndexEndValue(),t)}else return e.getIndex().maxPost()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fb{constructor(e){this.withinDirectionalStart=t=>this.reverse_?this.withinEndPost(t):this.withinStartPost(t),this.withinDirectionalEnd=t=>this.reverse_?this.withinStartPost(t):this.withinEndPost(t),this.withinStartPost=t=>{const s=this.index_.compare(this.rangedFilter_.getStartPost(),t);return this.startIsInclusive_?s<=0:s<0},this.withinEndPost=t=>{const s=this.index_.compare(t,this.rangedFilter_.getEndPost());return this.endIsInclusive_?s<=0:s<0},this.rangedFilter_=new ar(e),this.index_=e.getIndex(),this.limit_=e.getLimit(),this.reverse_=!e.isViewFromLeft(),this.startIsInclusive_=!e.startAfterSet_,this.endIsInclusive_=!e.endBeforeSet_}updateChild(e,t,s,i,r,o){return this.rangedFilter_.matches(new Z(t,s))||(s=z.EMPTY_NODE),e.getImmediateChild(t).equals(s)?e:e.numChildren()<this.limit_?this.rangedFilter_.getIndexedFilter().updateChild(e,t,s,i,r,o):this.fullLimitUpdateChild_(e,t,s,r,o)}updateFullNode(e,t,s){let i;if(t.isLeafNode()||t.isEmpty())i=z.EMPTY_NODE.withIndex(this.index_);else if(this.limit_*2<t.numChildren()&&t.isIndexed(this.index_)){i=z.EMPTY_NODE.withIndex(this.index_);let r;this.reverse_?r=t.getReverseIteratorFrom(this.rangedFilter_.getEndPost(),this.index_):r=t.getIteratorFrom(this.rangedFilter_.getStartPost(),this.index_);let o=0;for(;r.hasNext()&&o<this.limit_;){const l=r.getNext();if(this.withinDirectionalStart(l))if(this.withinDirectionalEnd(l))i=i.updateImmediateChild(l.name,l.node),o++;else break;else continue}}else{i=t.withIndex(this.index_),i=i.updatePriority(z.EMPTY_NODE);let r;this.reverse_?r=i.getReverseIterator(this.index_):r=i.getIterator(this.index_);let o=0;for(;r.hasNext();){const l=r.getNext();o<this.limit_&&this.withinDirectionalStart(l)&&this.withinDirectionalEnd(l)?o++:i=i.updateImmediateChild(l.name,z.EMPTY_NODE)}}return this.rangedFilter_.getIndexedFilter().updateFullNode(e,i,s)}updatePriority(e,t){return e}filtersNodes(){return!0}getIndexedFilter(){return this.rangedFilter_.getIndexedFilter()}getIndex(){return this.index_}fullLimitUpdateChild_(e,t,s,i,r){let o;if(this.reverse_){const p=this.index_.getCompare();o=(m,E)=>p(E,m)}else o=this.index_.getCompare();const l=e;D(l.numChildren()===this.limit_,"");const c=new Z(t,s),h=this.reverse_?l.getFirstChild(this.index_):l.getLastChild(this.index_),d=this.rangedFilter_.matches(c);if(l.hasChild(t)){const p=l.getImmediateChild(t);let m=i.getChildAfterChild(this.index_,h,this.reverse_);for(;m!=null&&(m.name===t||l.hasChild(m.name));)m=i.getChildAfterChild(this.index_,m,this.reverse_);const E=m==null?1:o(m,c);if(d&&!s.isEmpty()&&E>=0)return r!=null&&r.trackChildChange(or(t,s,p)),l.updateImmediateChild(t,s);{r!=null&&r.trackChildChange(rr(t,p));const S=l.updateImmediateChild(t,z.EMPTY_NODE);return m!=null&&this.rangedFilter_.matches(m)?(r!=null&&r.trackChildChange(js(m.name,m.node)),S.updateImmediateChild(m.name,m.node)):S}}else return s.isEmpty()?e:d&&o(h,c)>=0?(r!=null&&(r.trackChildChange(rr(h.name,h.node)),r.trackChildChange(js(t,s))),l.updateImmediateChild(t,s).updateImmediateChild(h.name,z.EMPTY_NODE)):e}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Lh{constructor(){this.limitSet_=!1,this.startSet_=!1,this.startNameSet_=!1,this.startAfterSet_=!1,this.endSet_=!1,this.endNameSet_=!1,this.endBeforeSet_=!1,this.limit_=0,this.viewFrom_="",this.indexStartValue_=null,this.indexStartName_="",this.indexEndValue_=null,this.indexEndName_="",this.index_=we}hasStart(){return this.startSet_}isViewFromLeft(){return this.viewFrom_===""?this.startSet_:this.viewFrom_==="l"}getIndexStartValue(){return D(this.startSet_,"Only valid if start has been set"),this.indexStartValue_}getIndexStartName(){return D(this.startSet_,"Only valid if start has been set"),this.startNameSet_?this.indexStartName_:is}hasEnd(){return this.endSet_}getIndexEndValue(){return D(this.endSet_,"Only valid if end has been set"),this.indexEndValue_}getIndexEndName(){return D(this.endSet_,"Only valid if end has been set"),this.endNameSet_?this.indexEndName_:xn}hasLimit(){return this.limitSet_}hasAnchoredLimit(){return this.limitSet_&&this.viewFrom_!==""}getLimit(){return D(this.limitSet_,"Only valid if limit has been set"),this.limit_}getIndex(){return this.index_}loadsAllData(){return!(this.startSet_||this.endSet_||this.limitSet_)}isDefault(){return this.loadsAllData()&&this.index_===we}copy(){const e=new Lh;return e.limitSet_=this.limitSet_,e.limit_=this.limit_,e.startSet_=this.startSet_,e.startAfterSet_=this.startAfterSet_,e.indexStartValue_=this.indexStartValue_,e.startNameSet_=this.startNameSet_,e.indexStartName_=this.indexStartName_,e.endSet_=this.endSet_,e.endBeforeSet_=this.endBeforeSet_,e.indexEndValue_=this.indexEndValue_,e.endNameSet_=this.endNameSet_,e.indexEndName_=this.indexEndName_,e.index_=this.index_,e.viewFrom_=this.viewFrom_,e}}function Bb(n){return n.loadsAllData()?new Dh(n.getIndex()):n.hasLimit()?new Fb(n):new ar(n)}function Ub(n,e,t){const s=n.copy();return s.endSet_=!0,e===void 0&&(e=null),s.indexEndValue_=e,t!==void 0?(s.endNameSet_=!0,s.indexEndName_=t):(s.endNameSet_=!1,s.indexEndName_=""),s}function qb(n,e){const t=n.copy();return t.index_=e,t}function qf(n){const e={};if(n.isDefault())return e;let t;if(n.index_===we?t="$priority":n.index_===g_?t="$value":n.index_===Jn?t="$key":(D(n.index_ instanceof Nh,"Unrecognized index type!"),t=n.index_.toString()),e.orderBy=Ne(t),n.startSet_){const s=n.startAfterSet_?"startAfter":"startAt";e[s]=Ne(n.indexStartValue_),n.startNameSet_&&(e[s]+=","+Ne(n.indexStartName_))}if(n.endSet_){const s=n.endBeforeSet_?"endBefore":"endAt";e[s]=Ne(n.indexEndValue_),n.endNameSet_&&(e[s]+=","+Ne(n.indexEndName_))}return n.limitSet_&&(n.isViewFromLeft()?e.limitToFirst=n.limit_:e.limitToLast=n.limit_),e}function Wf(n){const e={};if(n.startSet_&&(e.sp=n.indexStartValue_,n.startNameSet_&&(e.sn=n.indexStartName_),e.sin=!n.startAfterSet_),n.endSet_&&(e.ep=n.indexEndValue_,n.endNameSet_&&(e.en=n.indexEndName_),e.ein=!n.endBeforeSet_),n.limitSet_){e.l=n.limit_;let t=n.viewFrom_;t===""&&(n.isViewFromLeft()?t="l":t="r"),e.vf=t}return n.index_!==we&&(e.i=n.index_.toString()),e}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Go extends a_{constructor(e,t,s,i){super(),this.repoInfo_=e,this.onDataUpdate_=t,this.authTokenProvider_=s,this.appCheckTokenProvider_=i,this.log_=Rr("p:rest:"),this.listens_={}}reportStats(e){throw new Error("Method not implemented.")}static getListenId_(e,t){return t!==void 0?"tag$"+t:(D(e._queryParams.isDefault(),"should have a tag if it's not a default query."),e._path.toString())}listen(e,t,s,i){const r=e._path.toString();this.log_("Listen called for "+r+" "+e._queryIdentifier);const o=Go.getListenId_(e,s),l={};this.listens_[o]=l;const c=qf(e._queryParams);this.restRequest_(r+".json",c,(h,d)=>{let p=d;if(h===404&&(p=null,h=null),h===null&&this.onDataUpdate_(r,p,!1,s),Ms(this.listens_,o)===l){let m;h?h===401?m="permission_denied":m="rest_error:"+h:m="ok",i(m,null)}})}unlisten(e,t){const s=Go.getListenId_(e,t);delete this.listens_[s]}get(e){const t=qf(e._queryParams),s=e._path.toString(),i=new hr;return this.restRequest_(s+".json",t,(r,o)=>{let l=o;r===404&&(l=null,r=null),r===null?(this.onDataUpdate_(s,l,!1,null),i.resolve(l)):i.reject(new Error(l))}),i.promise}refreshAuthToken(e){}restRequest_(e,t={},s){return t.format="export",Promise.all([this.authTokenProvider_.getToken(!1),this.appCheckTokenProvider_.getToken(!1)]).then(([i,r])=>{i&&i.accessToken&&(t.auth=i.accessToken),r&&r.token&&(t.ac=r.token);const o=(this.repoInfo_.secure?"https://":"http://")+this.repoInfo_.host+e+"?ns="+this.repoInfo_.namespace+Js(t);this.log_("Sending REST request for "+o);const l=new XMLHttpRequest;l.onreadystatechange=()=>{if(s&&l.readyState===4){this.log_("REST Response for "+o+" received. status:",l.status,"response:",l.responseText);let c=null;if(l.status>=200&&l.status<300){try{c=Ki(l.responseText)}catch{at("Failed to parse JSON response for "+o+": "+l.responseText)}s(null,c)}else l.status!==401&&l.status!==404&&at("Got unsuccessful REST response for "+o+" Status: "+l.status),s(l.status);s=null}},l.open("GET",o,!0),l.send()})}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Wb{constructor(){this.rootNode_=z.EMPTY_NODE}getNode(e){return this.rootNode_.getChild(e)}updateSnapshot(e,t){this.rootNode_=this.rootNode_.updateChild(e,t)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ho(){return{value:null,children:new Map}}function y_(n,e,t){if(X(e))n.value=t,n.children.clear();else if(n.value!==null)n.value=n.value.updateChild(e,t);else{const s=J(e);n.children.has(s)||n.children.set(s,Ho());const i=n.children.get(s);e=ye(e),y_(i,e,t)}}function oc(n,e,t){n.value!==null?t(e,n.value):$b(n,(s,i)=>{const r=new ue(e.toString()+"/"+s);oc(i,r,t)})}function $b(n,e){n.children.forEach((t,s)=>{e(s,t)})}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class jb{constructor(e){this.collection_=e,this.last_=null}get(){const e=this.collection_.get(),t=Object.assign({},e);return this.last_&&je(this.last_,(s,i)=>{t[s]=t[s]-i}),this.last_=e,t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const $f=10*1e3,zb=30*1e3,Gb=5*60*1e3;class Hb{constructor(e,t){this.server_=t,this.statsToReport_={},this.statsListener_=new jb(e);const s=$f+(zb-$f)*Math.random();$i(this.reportStats_.bind(this),Math.floor(s))}reportStats_(){const e=this.statsListener_.get(),t={};let s=!1;je(e,(i,r)=>{r>0&&Vt(this.statsToReport_,i)&&(t[i]=r,s=!0)}),s&&this.server_.reportStats(t),$i(this.reportStats_.bind(this),Math.floor(Math.random()*2*Gb))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var bt;(function(n){n[n.OVERWRITE=0]="OVERWRITE",n[n.MERGE=1]="MERGE",n[n.ACK_USER_WRITE=2]="ACK_USER_WRITE",n[n.LISTEN_COMPLETE=3]="LISTEN_COMPLETE"})(bt||(bt={}));function xh(){return{fromUser:!0,fromServer:!1,queryId:null,tagged:!1}}function Oh(){return{fromUser:!1,fromServer:!0,queryId:null,tagged:!1}}function Mh(n){return{fromUser:!1,fromServer:!0,queryId:n,tagged:!0}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ko{constructor(e,t,s){this.path=e,this.affectedTree=t,this.revert=s,this.type=bt.ACK_USER_WRITE,this.source=xh()}operationForChild(e){if(X(this.path)){if(this.affectedTree.value!=null)return D(this.affectedTree.children.isEmpty(),"affectedTree should not have overlapping affected paths."),this;{const t=this.affectedTree.subtree(new ue(e));return new Ko(le(),t,this.revert)}}else return D(J(this.path)===e,"operationForChild called for unrelated child."),new Ko(ye(this.path),this.affectedTree,this.revert)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class lr{constructor(e,t){this.source=e,this.path=t,this.type=bt.LISTEN_COMPLETE}operationForChild(e){return X(this.path)?new lr(this.source,le()):new lr(this.source,ye(this.path))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rs{constructor(e,t,s){this.source=e,this.path=t,this.snap=s,this.type=bt.OVERWRITE}operationForChild(e){return X(this.path)?new rs(this.source,le(),this.snap.getImmediateChild(e)):new rs(this.source,ye(this.path),this.snap)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zs{constructor(e,t,s){this.source=e,this.path=t,this.children=s,this.type=bt.MERGE}operationForChild(e){if(X(this.path)){const t=this.children.subtree(new ue(e));return t.isEmpty()?null:t.value?new rs(this.source,le(),t.value):new zs(this.source,le(),t)}else return D(J(this.path)===e,"Can't get a merge for a child not on the path of the operation"),new zs(this.source,ye(this.path),this.children)}toString(){return"Operation("+this.path+": "+this.source.toString()+" merge: "+this.children.toString()+")"}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Mn{constructor(e,t,s){this.node_=e,this.fullyInitialized_=t,this.filtered_=s}isFullyInitialized(){return this.fullyInitialized_}isFiltered(){return this.filtered_}isCompleteForPath(e){if(X(e))return this.isFullyInitialized()&&!this.filtered_;const t=J(e);return this.isCompleteForChild(t)}isCompleteForChild(e){return this.isFullyInitialized()&&!this.filtered_||this.node_.hasChild(e)}getNode(){return this.node_}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Kb{constructor(e){this.query_=e,this.index_=this.query_._queryParams.getIndex()}}function Qb(n,e,t,s){const i=[],r=[];return e.forEach(o=>{o.type==="child_changed"&&n.index_.indexedValueChanged(o.oldSnap,o.snapshotNode)&&r.push(Vb(o.childName,o.snapshotNode))}),Ri(n,i,"child_removed",e,s,t),Ri(n,i,"child_added",e,s,t),Ri(n,i,"child_moved",r,s,t),Ri(n,i,"child_changed",e,s,t),Ri(n,i,"value",e,s,t),i}function Ri(n,e,t,s,i,r){const o=s.filter(l=>l.type===t);o.sort((l,c)=>Jb(n,l,c)),o.forEach(l=>{const c=Yb(n,l,r);i.forEach(h=>{h.respondsTo(l.type)&&e.push(h.createEvent(c,n.query_))})})}function Yb(n,e,t){return e.type==="value"||e.type==="child_removed"||(e.prevName=t.getPredecessorChildName(e.childName,e.snapshotNode,n.index_)),e}function Jb(n,e,t){if(e.childName==null||t.childName==null)throw Ys("Should only compare child_ events.");const s=new Z(e.childName,e.snapshotNode),i=new Z(t.childName,t.snapshotNode);return n.index_.compare(s,i)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ra(n,e){return{eventCache:n,serverCache:e}}function ji(n,e,t,s){return Ra(new Mn(e,t,s),n.serverCache)}function v_(n,e,t,s){return Ra(n.eventCache,new Mn(e,t,s))}function Qo(n){return n.eventCache.isFullyInitialized()?n.eventCache.getNode():null}function os(n){return n.serverCache.isFullyInitialized()?n.serverCache.getNode():null}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let vl;const Xb=()=>(vl||(vl=new ct(MC)),vl);class _e{constructor(e,t=Xb()){this.value=e,this.children=t}static fromObject(e){let t=new _e(null);return je(e,(s,i)=>{t=t.set(new ue(s),i)}),t}isEmpty(){return this.value===null&&this.children.isEmpty()}findRootMostMatchingPathAndValue(e,t){if(this.value!=null&&t(this.value))return{path:le(),value:this.value};if(X(e))return null;{const s=J(e),i=this.children.get(s);if(i!==null){const r=i.findRootMostMatchingPathAndValue(ye(e),t);return r!=null?{path:Ie(new ue(s),r.path),value:r.value}:null}else return null}}findRootMostValueAndPath(e){return this.findRootMostMatchingPathAndValue(e,()=>!0)}subtree(e){if(X(e))return this;{const t=J(e),s=this.children.get(t);return s!==null?s.subtree(ye(e)):new _e(null)}}set(e,t){if(X(e))return new _e(t,this.children);{const s=J(e),r=(this.children.get(s)||new _e(null)).set(ye(e),t),o=this.children.insert(s,r);return new _e(this.value,o)}}remove(e){if(X(e))return this.children.isEmpty()?new _e(null):new _e(null,this.children);{const t=J(e),s=this.children.get(t);if(s){const i=s.remove(ye(e));let r;return i.isEmpty()?r=this.children.remove(t):r=this.children.insert(t,i),this.value===null&&r.isEmpty()?new _e(null):new _e(this.value,r)}else return this}}get(e){if(X(e))return this.value;{const t=J(e),s=this.children.get(t);return s?s.get(ye(e)):null}}setTree(e,t){if(X(e))return t;{const s=J(e),r=(this.children.get(s)||new _e(null)).setTree(ye(e),t);let o;return r.isEmpty()?o=this.children.remove(s):o=this.children.insert(s,r),new _e(this.value,o)}}fold(e){return this.fold_(le(),e)}fold_(e,t){const s={};return this.children.inorderTraversal((i,r)=>{s[i]=r.fold_(Ie(e,i),t)}),t(e,this.value,s)}findOnPath(e,t){return this.findOnPath_(e,le(),t)}findOnPath_(e,t,s){const i=this.value?s(t,this.value):!1;if(i)return i;if(X(e))return null;{const r=J(e),o=this.children.get(r);return o?o.findOnPath_(ye(e),Ie(t,r),s):null}}foreachOnPath(e,t){return this.foreachOnPath_(e,le(),t)}foreachOnPath_(e,t,s){if(X(e))return this;{this.value&&s(t,this.value);const i=J(e),r=this.children.get(i);return r?r.foreachOnPath_(ye(e),Ie(t,i),s):new _e(null)}}foreach(e){this.foreach_(le(),e)}foreach_(e,t){this.children.inorderTraversal((s,i)=>{i.foreach_(Ie(e,s),t)}),this.value&&t(e,this.value)}foreachChild(e){this.children.inorderTraversal((t,s)=>{s.value&&e(t,s.value)})}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class St{constructor(e){this.writeTree_=e}static empty(){return new St(new _e(null))}}function zi(n,e,t){if(X(e))return new St(new _e(t));{const s=n.writeTree_.findRootMostValueAndPath(e);if(s!=null){const i=s.path;let r=s.value;const o=ot(i,e);return r=r.updateChild(o,t),new St(n.writeTree_.set(i,r))}else{const i=new _e(t),r=n.writeTree_.setTree(e,i);return new St(r)}}}function ac(n,e,t){let s=n;return je(t,(i,r)=>{s=zi(s,Ie(e,i),r)}),s}function jf(n,e){if(X(e))return St.empty();{const t=n.writeTree_.setTree(e,new _e(null));return new St(t)}}function lc(n,e){return ds(n,e)!=null}function ds(n,e){const t=n.writeTree_.findRootMostValueAndPath(e);return t!=null?n.writeTree_.get(t.path).getChild(ot(t.path,e)):null}function zf(n){const e=[],t=n.writeTree_.value;return t!=null?t.isLeafNode()||t.forEachChild(we,(s,i)=>{e.push(new Z(s,i))}):n.writeTree_.children.inorderTraversal((s,i)=>{i.value!=null&&e.push(new Z(s,i.value))}),e}function Sn(n,e){if(X(e))return n;{const t=ds(n,e);return t!=null?new St(new _e(t)):new St(n.writeTree_.subtree(e))}}function cc(n){return n.writeTree_.isEmpty()}function Gs(n,e){return E_(le(),n.writeTree_,e)}function E_(n,e,t){if(e.value!=null)return t.updateChild(n,e.value);{let s=null;return e.children.inorderTraversal((i,r)=>{i===".priority"?(D(r.value!==null,"Priority writes must always be leaf nodes"),s=r.value):t=E_(Ie(n,i),r,t)}),!t.getChild(n).isEmpty()&&s!==null&&(t=t.updateChild(Ie(n,".priority"),s)),t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Sa(n,e){return C_(e,n)}function Zb(n,e,t,s,i){D(s>n.lastWriteId,"Stacking an older write on top of newer ones"),i===void 0&&(i=!0),n.allWrites.push({path:e,snap:t,writeId:s,visible:i}),i&&(n.visibleWrites=zi(n.visibleWrites,e,t)),n.lastWriteId=s}function eR(n,e,t,s){D(s>n.lastWriteId,"Stacking an older merge on top of newer ones"),n.allWrites.push({path:e,children:t,writeId:s,visible:!0}),n.visibleWrites=ac(n.visibleWrites,e,t),n.lastWriteId=s}function tR(n,e){for(let t=0;t<n.allWrites.length;t++){const s=n.allWrites[t];if(s.writeId===e)return s}return null}function nR(n,e){const t=n.allWrites.findIndex(l=>l.writeId===e);D(t>=0,"removeWrite called with nonexistent writeId.");const s=n.allWrites[t];n.allWrites.splice(t,1);let i=s.visible,r=!1,o=n.allWrites.length-1;for(;i&&o>=0;){const l=n.allWrites[o];l.visible&&(o>=t&&sR(l,s.path)?i=!1:gt(s.path,l.path)&&(r=!0)),o--}if(i){if(r)return iR(n),!0;if(s.snap)n.visibleWrites=jf(n.visibleWrites,s.path);else{const l=s.children;je(l,c=>{n.visibleWrites=jf(n.visibleWrites,Ie(s.path,c))})}return!0}else return!1}function sR(n,e){if(n.snap)return gt(n.path,e);for(const t in n.children)if(n.children.hasOwnProperty(t)&&gt(Ie(n.path,t),e))return!0;return!1}function iR(n){n.visibleWrites=w_(n.allWrites,rR,le()),n.allWrites.length>0?n.lastWriteId=n.allWrites[n.allWrites.length-1].writeId:n.lastWriteId=-1}function rR(n){return n.visible}function w_(n,e,t){let s=St.empty();for(let i=0;i<n.length;++i){const r=n[i];if(e(r)){const o=r.path;let l;if(r.snap)gt(t,o)?(l=ot(t,o),s=zi(s,l,r.snap)):gt(o,t)&&(l=ot(o,t),s=zi(s,le(),r.snap.getChild(l)));else if(r.children){if(gt(t,o))l=ot(t,o),s=ac(s,l,r.children);else if(gt(o,t))if(l=ot(o,t),X(l))s=ac(s,le(),r.children);else{const c=Ms(r.children,J(l));if(c){const h=c.getChild(ye(l));s=zi(s,le(),h)}}}else throw Ys("WriteRecord should have .snap or .children")}}return s}function T_(n,e,t,s,i){if(!s&&!i){const r=ds(n.visibleWrites,e);if(r!=null)return r;{const o=Sn(n.visibleWrites,e);if(cc(o))return t;if(t==null&&!lc(o,le()))return null;{const l=t||z.EMPTY_NODE;return Gs(o,l)}}}else{const r=Sn(n.visibleWrites,e);if(!i&&cc(r))return t;if(!i&&t==null&&!lc(r,le()))return null;{const o=function(h){return(h.visible||i)&&(!s||!~s.indexOf(h.writeId))&&(gt(h.path,e)||gt(e,h.path))},l=w_(n.allWrites,o,e),c=t||z.EMPTY_NODE;return Gs(l,c)}}}function oR(n,e,t){let s=z.EMPTY_NODE;const i=ds(n.visibleWrites,e);if(i)return i.isLeafNode()||i.forEachChild(we,(r,o)=>{s=s.updateImmediateChild(r,o)}),s;if(t){const r=Sn(n.visibleWrites,e);return t.forEachChild(we,(o,l)=>{const c=Gs(Sn(r,new ue(o)),l);s=s.updateImmediateChild(o,c)}),zf(r).forEach(o=>{s=s.updateImmediateChild(o.name,o.node)}),s}else{const r=Sn(n.visibleWrites,e);return zf(r).forEach(o=>{s=s.updateImmediateChild(o.name,o.node)}),s}}function aR(n,e,t,s,i){D(s||i,"Either existingEventSnap or existingServerSnap must exist");const r=Ie(e,t);if(lc(n.visibleWrites,r))return null;{const o=Sn(n.visibleWrites,r);return cc(o)?i.getChild(t):Gs(o,i.getChild(t))}}function lR(n,e,t,s){const i=Ie(e,t),r=ds(n.visibleWrites,i);if(r!=null)return r;if(s.isCompleteForChild(t)){const o=Sn(n.visibleWrites,i);return Gs(o,s.getNode().getImmediateChild(t))}else return null}function cR(n,e){return ds(n.visibleWrites,e)}function hR(n,e,t,s,i,r,o){let l;const c=Sn(n.visibleWrites,e),h=ds(c,le());if(h!=null)l=h;else if(t!=null)l=Gs(c,t);else return[];if(l=l.withIndex(o),!l.isEmpty()&&!l.isLeafNode()){const d=[],p=o.getCompare(),m=r?l.getReverseIteratorFrom(s,o):l.getIteratorFrom(s,o);let E=m.getNext();for(;E&&d.length<i;)p(E,s)!==0&&d.push(E),E=m.getNext();return d}else return[]}function uR(){return{visibleWrites:St.empty(),allWrites:[],lastWriteId:-1}}function Yo(n,e,t,s){return T_(n.writeTree,n.treePath,e,t,s)}function Vh(n,e){return oR(n.writeTree,n.treePath,e)}function Gf(n,e,t,s){return aR(n.writeTree,n.treePath,e,t,s)}function Jo(n,e){return cR(n.writeTree,Ie(n.treePath,e))}function dR(n,e,t,s,i,r){return hR(n.writeTree,n.treePath,e,t,s,i,r)}function Fh(n,e,t){return lR(n.writeTree,n.treePath,e,t)}function I_(n,e){return C_(Ie(n.treePath,e),n.writeTree)}function C_(n,e){return{treePath:n,writeTree:e}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fR{constructor(){this.changeMap=new Map}trackChildChange(e){const t=e.type,s=e.childName;D(t==="child_added"||t==="child_changed"||t==="child_removed","Only child changes supported for tracking"),D(s!==".priority","Only non-priority child changes can be tracked.");const i=this.changeMap.get(s);if(i){const r=i.type;if(t==="child_added"&&r==="child_removed")this.changeMap.set(s,or(s,e.snapshotNode,i.snapshotNode));else if(t==="child_removed"&&r==="child_added")this.changeMap.delete(s);else if(t==="child_removed"&&r==="child_changed")this.changeMap.set(s,rr(s,i.oldSnap));else if(t==="child_changed"&&r==="child_added")this.changeMap.set(s,js(s,e.snapshotNode));else if(t==="child_changed"&&r==="child_changed")this.changeMap.set(s,or(s,e.snapshotNode,i.oldSnap));else throw Ys("Illegal combination of changes: "+e+" occurred after "+i)}else this.changeMap.set(s,e)}getChanges(){return Array.from(this.changeMap.values())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pR{getCompleteChild(e){return null}getChildAfterChild(e,t,s){return null}}const b_=new pR;class Bh{constructor(e,t,s=null){this.writes_=e,this.viewCache_=t,this.optCompleteServerCache_=s}getCompleteChild(e){const t=this.viewCache_.eventCache;if(t.isCompleteForChild(e))return t.getNode().getImmediateChild(e);{const s=this.optCompleteServerCache_!=null?new Mn(this.optCompleteServerCache_,!0,!1):this.viewCache_.serverCache;return Fh(this.writes_,e,s)}}getChildAfterChild(e,t,s){const i=this.optCompleteServerCache_!=null?this.optCompleteServerCache_:os(this.viewCache_),r=dR(this.writes_,i,t,1,s,e);return r.length===0?null:r[0]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function mR(n){return{filter:n}}function gR(n,e){D(e.eventCache.getNode().isIndexed(n.filter.getIndex()),"Event snap not indexed"),D(e.serverCache.getNode().isIndexed(n.filter.getIndex()),"Server snap not indexed")}function _R(n,e,t,s,i){const r=new fR;let o,l;if(t.type===bt.OVERWRITE){const h=t;h.source.fromUser?o=hc(n,e,h.path,h.snap,s,i,r):(D(h.source.fromServer,"Unknown source."),l=h.source.tagged||e.serverCache.isFiltered()&&!X(h.path),o=Xo(n,e,h.path,h.snap,s,i,l,r))}else if(t.type===bt.MERGE){const h=t;h.source.fromUser?o=vR(n,e,h.path,h.children,s,i,r):(D(h.source.fromServer,"Unknown source."),l=h.source.tagged||e.serverCache.isFiltered(),o=uc(n,e,h.path,h.children,s,i,l,r))}else if(t.type===bt.ACK_USER_WRITE){const h=t;h.revert?o=TR(n,e,h.path,s,i,r):o=ER(n,e,h.path,h.affectedTree,s,i,r)}else if(t.type===bt.LISTEN_COMPLETE)o=wR(n,e,t.path,s,r);else throw Ys("Unknown operation type: "+t.type);const c=r.getChanges();return yR(e,o,c),{viewCache:o,changes:c}}function yR(n,e,t){const s=e.eventCache;if(s.isFullyInitialized()){const i=s.getNode().isLeafNode()||s.getNode().isEmpty(),r=Qo(n);(t.length>0||!n.eventCache.isFullyInitialized()||i&&!s.getNode().equals(r)||!s.getNode().getPriority().equals(r.getPriority()))&&t.push(__(Qo(e)))}}function R_(n,e,t,s,i,r){const o=e.eventCache;if(Jo(s,t)!=null)return e;{let l,c;if(X(t))if(D(e.serverCache.isFullyInitialized(),"If change path is empty, we must have complete server data"),e.serverCache.isFiltered()){const h=os(e),d=h instanceof z?h:z.EMPTY_NODE,p=Vh(s,d);l=n.filter.updateFullNode(e.eventCache.getNode(),p,r)}else{const h=Yo(s,os(e));l=n.filter.updateFullNode(e.eventCache.getNode(),h,r)}else{const h=J(t);if(h===".priority"){D(On(t)===1,"Can't have a priority with additional path components");const d=o.getNode();c=e.serverCache.getNode();const p=Gf(s,t,d,c);p!=null?l=n.filter.updatePriority(d,p):l=o.getNode()}else{const d=ye(t);let p;if(o.isCompleteForChild(h)){c=e.serverCache.getNode();const m=Gf(s,t,o.getNode(),c);m!=null?p=o.getNode().getImmediateChild(h).updateChild(d,m):p=o.getNode().getImmediateChild(h)}else p=Fh(s,h,e.serverCache);p!=null?l=n.filter.updateChild(o.getNode(),h,p,d,i,r):l=o.getNode()}}return ji(e,l,o.isFullyInitialized()||X(t),n.filter.filtersNodes())}}function Xo(n,e,t,s,i,r,o,l){const c=e.serverCache;let h;const d=o?n.filter:n.filter.getIndexedFilter();if(X(t))h=d.updateFullNode(c.getNode(),s,null);else if(d.filtersNodes()&&!c.isFiltered()){const E=c.getNode().updateChild(t,s);h=d.updateFullNode(c.getNode(),E,null)}else{const E=J(t);if(!c.isCompleteForPath(t)&&On(t)>1)return e;const C=ye(t),k=c.getNode().getImmediateChild(E).updateChild(C,s);E===".priority"?h=d.updatePriority(c.getNode(),k):h=d.updateChild(c.getNode(),E,k,C,b_,null)}const p=v_(e,h,c.isFullyInitialized()||X(t),d.filtersNodes()),m=new Bh(i,p,r);return R_(n,p,t,i,m,l)}function hc(n,e,t,s,i,r,o){const l=e.eventCache;let c,h;const d=new Bh(i,e,r);if(X(t))h=n.filter.updateFullNode(e.eventCache.getNode(),s,o),c=ji(e,h,!0,n.filter.filtersNodes());else{const p=J(t);if(p===".priority")h=n.filter.updatePriority(e.eventCache.getNode(),s),c=ji(e,h,l.isFullyInitialized(),l.isFiltered());else{const m=ye(t),E=l.getNode().getImmediateChild(p);let C;if(X(m))C=s;else{const S=d.getCompleteChild(p);S!=null?Sh(m)===".priority"&&S.getChild(c_(m)).isEmpty()?C=S:C=S.updateChild(m,s):C=z.EMPTY_NODE}if(E.equals(C))c=e;else{const S=n.filter.updateChild(l.getNode(),p,C,m,d,o);c=ji(e,S,l.isFullyInitialized(),n.filter.filtersNodes())}}}return c}function Hf(n,e){return n.eventCache.isCompleteForChild(e)}function vR(n,e,t,s,i,r,o){let l=e;return s.foreach((c,h)=>{const d=Ie(t,c);Hf(e,J(d))&&(l=hc(n,l,d,h,i,r,o))}),s.foreach((c,h)=>{const d=Ie(t,c);Hf(e,J(d))||(l=hc(n,l,d,h,i,r,o))}),l}function Kf(n,e,t){return t.foreach((s,i)=>{e=e.updateChild(s,i)}),e}function uc(n,e,t,s,i,r,o,l){if(e.serverCache.getNode().isEmpty()&&!e.serverCache.isFullyInitialized())return e;let c=e,h;X(t)?h=s:h=new _e(null).setTree(t,s);const d=e.serverCache.getNode();return h.children.inorderTraversal((p,m)=>{if(d.hasChild(p)){const E=e.serverCache.getNode().getImmediateChild(p),C=Kf(n,E,m);c=Xo(n,c,new ue(p),C,i,r,o,l)}}),h.children.inorderTraversal((p,m)=>{const E=!e.serverCache.isCompleteForChild(p)&&m.value===null;if(!d.hasChild(p)&&!E){const C=e.serverCache.getNode().getImmediateChild(p),S=Kf(n,C,m);c=Xo(n,c,new ue(p),S,i,r,o,l)}}),c}function ER(n,e,t,s,i,r,o){if(Jo(i,t)!=null)return e;const l=e.serverCache.isFiltered(),c=e.serverCache;if(s.value!=null){if(X(t)&&c.isFullyInitialized()||c.isCompleteForPath(t))return Xo(n,e,t,c.getNode().getChild(t),i,r,l,o);if(X(t)){let h=new _e(null);return c.getNode().forEachChild(Jn,(d,p)=>{h=h.set(new ue(d),p)}),uc(n,e,t,h,i,r,l,o)}else return e}else{let h=new _e(null);return s.foreach((d,p)=>{const m=Ie(t,d);c.isCompleteForPath(m)&&(h=h.set(d,c.getNode().getChild(m)))}),uc(n,e,t,h,i,r,l,o)}}function wR(n,e,t,s,i){const r=e.serverCache,o=v_(e,r.getNode(),r.isFullyInitialized()||X(t),r.isFiltered());return R_(n,o,t,s,b_,i)}function TR(n,e,t,s,i,r){let o;if(Jo(s,t)!=null)return e;{const l=new Bh(s,e,i),c=e.eventCache.getNode();let h;if(X(t)||J(t)===".priority"){let d;if(e.serverCache.isFullyInitialized())d=Yo(s,os(e));else{const p=e.serverCache.getNode();D(p instanceof z,"serverChildren would be complete if leaf node"),d=Vh(s,p)}d=d,h=n.filter.updateFullNode(c,d,r)}else{const d=J(t);let p=Fh(s,d,e.serverCache);p==null&&e.serverCache.isCompleteForChild(d)&&(p=c.getImmediateChild(d)),p!=null?h=n.filter.updateChild(c,d,p,ye(t),l,r):e.eventCache.getNode().hasChild(d)?h=n.filter.updateChild(c,d,z.EMPTY_NODE,ye(t),l,r):h=c,h.isEmpty()&&e.serverCache.isFullyInitialized()&&(o=Yo(s,os(e)),o.isLeafNode()&&(h=n.filter.updateFullNode(h,o,r)))}return o=e.serverCache.isFullyInitialized()||Jo(s,le())!=null,ji(e,h,o,n.filter.filtersNodes())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class IR{constructor(e,t){this.query_=e,this.eventRegistrations_=[];const s=this.query_._queryParams,i=new Dh(s.getIndex()),r=Bb(s);this.processor_=mR(r);const o=t.serverCache,l=t.eventCache,c=i.updateFullNode(z.EMPTY_NODE,o.getNode(),null),h=r.updateFullNode(z.EMPTY_NODE,l.getNode(),null),d=new Mn(c,o.isFullyInitialized(),i.filtersNodes()),p=new Mn(h,l.isFullyInitialized(),r.filtersNodes());this.viewCache_=Ra(p,d),this.eventGenerator_=new Kb(this.query_)}get query(){return this.query_}}function CR(n){return n.viewCache_.serverCache.getNode()}function bR(n){return Qo(n.viewCache_)}function RR(n,e){const t=os(n.viewCache_);return t&&(n.query._queryParams.loadsAllData()||!X(e)&&!t.getImmediateChild(J(e)).isEmpty())?t.getChild(e):null}function Qf(n){return n.eventRegistrations_.length===0}function SR(n,e){n.eventRegistrations_.push(e)}function Yf(n,e,t){const s=[];if(t){D(e==null,"A cancel should cancel all event registrations.");const i=n.query._path;n.eventRegistrations_.forEach(r=>{const o=r.createCancelEvent(t,i);o&&s.push(o)})}if(e){let i=[];for(let r=0;r<n.eventRegistrations_.length;++r){const o=n.eventRegistrations_[r];if(!o.matches(e))i.push(o);else if(e.hasAnyCallback()){i=i.concat(n.eventRegistrations_.slice(r+1));break}}n.eventRegistrations_=i}else n.eventRegistrations_=[];return s}function Jf(n,e,t,s){e.type===bt.MERGE&&e.source.queryId!==null&&(D(os(n.viewCache_),"We should always have a full cache before handling merges"),D(Qo(n.viewCache_),"Missing event cache, even though we have a server cache"));const i=n.viewCache_,r=_R(n.processor_,i,e,t,s);return gR(n.processor_,r.viewCache),D(r.viewCache.serverCache.isFullyInitialized()||!i.serverCache.isFullyInitialized(),"Once a server snap is complete, it should never go back"),n.viewCache_=r.viewCache,S_(n,r.changes,r.viewCache.eventCache.getNode(),null)}function AR(n,e){const t=n.viewCache_.eventCache,s=[];return t.getNode().isLeafNode()||t.getNode().forEachChild(we,(r,o)=>{s.push(js(r,o))}),t.isFullyInitialized()&&s.push(__(t.getNode())),S_(n,s,t.getNode(),e)}function S_(n,e,t,s){const i=s?[s]:n.eventRegistrations_;return Qb(n.eventGenerator_,e,t,i)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Zo;class A_{constructor(){this.views=new Map}}function kR(n){D(!Zo,"__referenceConstructor has already been defined"),Zo=n}function PR(){return D(Zo,"Reference.ts has not been loaded"),Zo}function NR(n){return n.views.size===0}function Uh(n,e,t,s){const i=e.source.queryId;if(i!==null){const r=n.views.get(i);return D(r!=null,"SyncTree gave us an op for an invalid query."),Jf(r,e,t,s)}else{let r=[];for(const o of n.views.values())r=r.concat(Jf(o,e,t,s));return r}}function k_(n,e,t,s,i){const r=e._queryIdentifier,o=n.views.get(r);if(!o){let l=Yo(t,i?s:null),c=!1;l?c=!0:s instanceof z?(l=Vh(t,s),c=!1):(l=z.EMPTY_NODE,c=!1);const h=Ra(new Mn(l,c,!1),new Mn(s,i,!1));return new IR(e,h)}return o}function DR(n,e,t,s,i,r){const o=k_(n,e,s,i,r);return n.views.has(e._queryIdentifier)||n.views.set(e._queryIdentifier,o),SR(o,t),AR(o,t)}function LR(n,e,t,s){const i=e._queryIdentifier,r=[];let o=[];const l=Vn(n);if(i==="default")for(const[c,h]of n.views.entries())o=o.concat(Yf(h,t,s)),Qf(h)&&(n.views.delete(c),h.query._queryParams.loadsAllData()||r.push(h.query));else{const c=n.views.get(i);c&&(o=o.concat(Yf(c,t,s)),Qf(c)&&(n.views.delete(i),c.query._queryParams.loadsAllData()||r.push(c.query)))}return l&&!Vn(n)&&r.push(new(PR())(e._repo,e._path)),{removed:r,events:o}}function P_(n){const e=[];for(const t of n.views.values())t.query._queryParams.loadsAllData()||e.push(t);return e}function An(n,e){let t=null;for(const s of n.views.values())t=t||RR(s,e);return t}function N_(n,e){if(e._queryParams.loadsAllData())return Aa(n);{const s=e._queryIdentifier;return n.views.get(s)}}function D_(n,e){return N_(n,e)!=null}function Vn(n){return Aa(n)!=null}function Aa(n){for(const e of n.views.values())if(e.query._queryParams.loadsAllData())return e;return null}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let ea;function xR(n){D(!ea,"__referenceConstructor has already been defined"),ea=n}function OR(){return D(ea,"Reference.ts has not been loaded"),ea}let MR=1;class Xf{constructor(e){this.listenProvider_=e,this.syncPointTree_=new _e(null),this.pendingWriteTree_=uR(),this.tagToQueryMap=new Map,this.queryToTagMap=new Map}}function L_(n,e,t,s,i){return Zb(n.pendingWriteTree_,e,t,s,i),i?ii(n,new rs(xh(),e,t)):[]}function VR(n,e,t,s){eR(n.pendingWriteTree_,e,t,s);const i=_e.fromObject(t);return ii(n,new zs(xh(),e,i))}function wn(n,e,t=!1){const s=tR(n.pendingWriteTree_,e);if(nR(n.pendingWriteTree_,e)){let r=new _e(null);return s.snap!=null?r=r.set(le(),!0):je(s.children,o=>{r=r.set(new ue(o),!0)}),ii(n,new Ko(s.path,r,t))}else return[]}function Ar(n,e,t){return ii(n,new rs(Oh(),e,t))}function FR(n,e,t){const s=_e.fromObject(t);return ii(n,new zs(Oh(),e,s))}function BR(n,e){return ii(n,new lr(Oh(),e))}function UR(n,e,t){const s=Wh(n,t);if(s){const i=$h(s),r=i.path,o=i.queryId,l=ot(r,e),c=new lr(Mh(o),l);return jh(n,r,c)}else return[]}function ta(n,e,t,s,i=!1){const r=e._path,o=n.syncPointTree_.get(r);let l=[];if(o&&(e._queryIdentifier==="default"||D_(o,e))){const c=LR(o,e,t,s);NR(o)&&(n.syncPointTree_=n.syncPointTree_.remove(r));const h=c.removed;if(l=c.events,!i){const d=h.findIndex(m=>m._queryParams.loadsAllData())!==-1,p=n.syncPointTree_.findOnPath(r,(m,E)=>Vn(E));if(d&&!p){const m=n.syncPointTree_.subtree(r);if(!m.isEmpty()){const E=$R(m);for(let C=0;C<E.length;++C){const S=E[C],k=S.query,F=V_(n,S);n.listenProvider_.startListening(Gi(k),cr(n,k),F.hashFn,F.onComplete)}}}!p&&h.length>0&&!s&&(d?n.listenProvider_.stopListening(Gi(e),null):h.forEach(m=>{const E=n.queryToTagMap.get(ka(m));n.listenProvider_.stopListening(Gi(m),E)}))}jR(n,h)}return l}function x_(n,e,t,s){const i=Wh(n,s);if(i!=null){const r=$h(i),o=r.path,l=r.queryId,c=ot(o,e),h=new rs(Mh(l),c,t);return jh(n,o,h)}else return[]}function qR(n,e,t,s){const i=Wh(n,s);if(i){const r=$h(i),o=r.path,l=r.queryId,c=ot(o,e),h=_e.fromObject(t),d=new zs(Mh(l),c,h);return jh(n,o,d)}else return[]}function dc(n,e,t,s=!1){const i=e._path;let r=null,o=!1;n.syncPointTree_.foreachOnPath(i,(m,E)=>{const C=ot(m,i);r=r||An(E,C),o=o||Vn(E)});let l=n.syncPointTree_.get(i);l?(o=o||Vn(l),r=r||An(l,le())):(l=new A_,n.syncPointTree_=n.syncPointTree_.set(i,l));let c;r!=null?c=!0:(c=!1,r=z.EMPTY_NODE,n.syncPointTree_.subtree(i).foreachChild((E,C)=>{const S=An(C,le());S&&(r=r.updateImmediateChild(E,S))}));const h=D_(l,e);if(!h&&!e._queryParams.loadsAllData()){const m=ka(e);D(!n.queryToTagMap.has(m),"View does not exist, but we have a tag");const E=zR();n.queryToTagMap.set(m,E),n.tagToQueryMap.set(E,m)}const d=Sa(n.pendingWriteTree_,i);let p=DR(l,e,t,d,r,c);if(!h&&!o&&!s){const m=N_(l,e);p=p.concat(GR(n,e,m))}return p}function qh(n,e,t){const i=n.pendingWriteTree_,r=n.syncPointTree_.findOnPath(e,(o,l)=>{const c=ot(o,e),h=An(l,c);if(h)return h});return T_(i,e,r,t,!0)}function WR(n,e){const t=e._path;let s=null;n.syncPointTree_.foreachOnPath(t,(h,d)=>{const p=ot(h,t);s=s||An(d,p)});let i=n.syncPointTree_.get(t);i?s=s||An(i,le()):(i=new A_,n.syncPointTree_=n.syncPointTree_.set(t,i));const r=s!=null,o=r?new Mn(s,!0,!1):null,l=Sa(n.pendingWriteTree_,e._path),c=k_(i,e,l,r?o.getNode():z.EMPTY_NODE,r);return bR(c)}function ii(n,e){return O_(e,n.syncPointTree_,null,Sa(n.pendingWriteTree_,le()))}function O_(n,e,t,s){if(X(n.path))return M_(n,e,t,s);{const i=e.get(le());t==null&&i!=null&&(t=An(i,le()));let r=[];const o=J(n.path),l=n.operationForChild(o),c=e.children.get(o);if(c&&l){const h=t?t.getImmediateChild(o):null,d=I_(s,o);r=r.concat(O_(l,c,h,d))}return i&&(r=r.concat(Uh(i,n,s,t))),r}}function M_(n,e,t,s){const i=e.get(le());t==null&&i!=null&&(t=An(i,le()));let r=[];return e.children.inorderTraversal((o,l)=>{const c=t?t.getImmediateChild(o):null,h=I_(s,o),d=n.operationForChild(o);d&&(r=r.concat(M_(d,l,c,h)))}),i&&(r=r.concat(Uh(i,n,s,t))),r}function V_(n,e){const t=e.query,s=cr(n,t);return{hashFn:()=>(CR(e)||z.EMPTY_NODE).hash(),onComplete:i=>{if(i==="ok")return s?UR(n,t._path,s):BR(n,t._path);{const r=BC(i,t);return ta(n,t,null,r)}}}}function cr(n,e){const t=ka(e);return n.queryToTagMap.get(t)}function ka(n){return n._path.toString()+"$"+n._queryIdentifier}function Wh(n,e){return n.tagToQueryMap.get(e)}function $h(n){const e=n.indexOf("$");return D(e!==-1&&e<n.length-1,"Bad queryKey."),{queryId:n.substr(e+1),path:new ue(n.substr(0,e))}}function jh(n,e,t){const s=n.syncPointTree_.get(e);D(s,"Missing sync point for query tag that we're tracking");const i=Sa(n.pendingWriteTree_,e);return Uh(s,t,i,null)}function $R(n){return n.fold((e,t,s)=>{if(t&&Vn(t))return[Aa(t)];{let i=[];return t&&(i=P_(t)),je(s,(r,o)=>{i=i.concat(o)}),i}})}function Gi(n){return n._queryParams.loadsAllData()&&!n._queryParams.isDefault()?new(OR())(n._repo,n._path):n}function jR(n,e){for(let t=0;t<e.length;++t){const s=e[t];if(!s._queryParams.loadsAllData()){const i=ka(s),r=n.queryToTagMap.get(i);n.queryToTagMap.delete(i),n.tagToQueryMap.delete(r)}}}function zR(){return MR++}function GR(n,e,t){const s=e._path,i=cr(n,e),r=V_(n,t),o=n.listenProvider_.startListening(Gi(e),i,r.hashFn,r.onComplete),l=n.syncPointTree_.subtree(s);if(i)D(!Vn(l.value),"If we're adding a query, it shouldn't be shadowed");else{const c=l.fold((h,d,p)=>{if(!X(h)&&d&&Vn(d))return[Aa(d).query];{let m=[];return d&&(m=m.concat(P_(d).map(E=>E.query))),je(p,(E,C)=>{m=m.concat(C)}),m}});for(let h=0;h<c.length;++h){const d=c[h];n.listenProvider_.stopListening(Gi(d),cr(n,d))}}return o}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zh{constructor(e){this.node_=e}getImmediateChild(e){const t=this.node_.getImmediateChild(e);return new zh(t)}node(){return this.node_}}class Gh{constructor(e,t){this.syncTree_=e,this.path_=t}getImmediateChild(e){const t=Ie(this.path_,e);return new Gh(this.syncTree_,t)}node(){return qh(this.syncTree_,this.path_)}}const HR=function(n){return n=n||{},n.timestamp=n.timestamp||new Date().getTime(),n},Zf=function(n,e,t){if(!n||typeof n!="object")return n;if(D(".sv"in n,"Unexpected leaf node or priority contents"),typeof n[".sv"]=="string")return KR(n[".sv"],e,t);if(typeof n[".sv"]=="object")return QR(n[".sv"],e);D(!1,"Unexpected server value: "+JSON.stringify(n,null,2))},KR=function(n,e,t){switch(n){case"timestamp":return t.timestamp;default:D(!1,"Unexpected server value: "+n)}},QR=function(n,e,t){n.hasOwnProperty("increment")||D(!1,"Unexpected server value: "+JSON.stringify(n,null,2));const s=n.increment;typeof s!="number"&&D(!1,"Unexpected increment value: "+s);const i=e.node();if(D(i!==null&&typeof i<"u","Expected ChildrenNode.EMPTY_NODE for nulls"),!i.isLeafNode())return s;const o=i.getValue();return typeof o!="number"?s:o+s},F_=function(n,e,t,s){return Hh(e,new Gh(t,n),s)},B_=function(n,e,t){return Hh(n,new zh(e),t)};function Hh(n,e,t){const s=n.getPriority().val(),i=Zf(s,e.getImmediateChild(".priority"),t);let r;if(n.isLeafNode()){const o=n,l=Zf(o.getValue(),e,t);return l!==o.getValue()||i!==o.getPriority().val()?new xe(l,Pe(i)):n}else{const o=n;return r=o,i!==o.getPriority().val()&&(r=r.updatePriority(new xe(i))),o.forEachChild(we,(l,c)=>{const h=Hh(c,e.getImmediateChild(l),t);h!==c&&(r=r.updateImmediateChild(l,h))}),r}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Kh{constructor(e="",t=null,s={children:{},childCount:0}){this.name=e,this.parent=t,this.node=s}}function Qh(n,e){let t=e instanceof ue?e:new ue(e),s=n,i=J(t);for(;i!==null;){const r=Ms(s.node.children,i)||{children:{},childCount:0};s=new Kh(i,s,r),t=ye(t),i=J(t)}return s}function ri(n){return n.node.value}function U_(n,e){n.node.value=e,fc(n)}function q_(n){return n.node.childCount>0}function YR(n){return ri(n)===void 0&&!q_(n)}function Pa(n,e){je(n.node.children,(t,s)=>{e(new Kh(t,n,s))})}function W_(n,e,t,s){t&&e(n),Pa(n,i=>{W_(i,e,!0)})}function JR(n,e,t){let s=n.parent;for(;s!==null;){if(e(s))return!0;s=s.parent}return!1}function kr(n){return new ue(n.parent===null?n.name:kr(n.parent)+"/"+n.name)}function fc(n){n.parent!==null&&XR(n.parent,n.name,n)}function XR(n,e,t){const s=YR(t),i=Vt(n.node.children,e);s&&i?(delete n.node.children[e],n.node.childCount--,fc(n)):!s&&!i&&(n.node.children[e]=t.node,n.node.childCount++,fc(n))}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ZR=/[\[\].#$\/\u0000-\u001F\u007F]/,eS=/[\[\].#$\u0000-\u001F\u007F]/,El=10*1024*1024,Yh=function(n){return typeof n=="string"&&n.length!==0&&!ZR.test(n)},$_=function(n){return typeof n=="string"&&n.length!==0&&!eS.test(n)},tS=function(n){return n&&(n=n.replace(/^\/*\.info(\/|$)/,"/")),$_(n)},pc=function(n){return n===null||typeof n=="string"||typeof n=="number"&&!Th(n)||n&&typeof n=="object"&&Vt(n,".sv")},Jh=function(n,e,t,s){s&&e===void 0||Na(ia(n,"value"),e,t)},Na=function(n,e,t){const s=t instanceof ue?new vb(t,n):t;if(e===void 0)throw new Error(n+"contains undefined "+zn(s));if(typeof e=="function")throw new Error(n+"contains a function "+zn(s)+" with contents = "+e.toString());if(Th(e))throw new Error(n+"contains "+e.toString()+" "+zn(s));if(typeof e=="string"&&e.length>El/3&&ra(e)>El)throw new Error(n+"contains a string greater than "+El+" utf8 bytes "+zn(s)+" ('"+e.substring(0,50)+"...')");if(e&&typeof e=="object"){let i=!1,r=!1;if(je(e,(o,l)=>{if(o===".value")i=!0;else if(o!==".priority"&&o!==".sv"&&(r=!0,!Yh(o)))throw new Error(n+" contains an invalid key ("+o+") "+zn(s)+`.  Keys must be non-empty strings and can't contain ".", "#", "$", "/", "[", or "]"`);Eb(s,o),Na(n,l,s),wb(s)}),i&&r)throw new Error(n+' contains ".value" child '+zn(s)+" in addition to actual children.")}},nS=function(n,e){let t,s;for(t=0;t<e.length;t++){s=e[t];const r=ir(s);for(let o=0;o<r.length;o++)if(!(r[o]===".priority"&&o===r.length-1)){if(!Yh(r[o]))throw new Error(n+"contains an invalid key ("+r[o]+") in path "+s.toString()+`. Keys must be non-empty strings and can't contain ".", "#", "$", "/", "[", or "]"`)}}e.sort(yb);let i=null;for(t=0;t<e.length;t++){if(s=e[t],i!==null&&gt(i,s))throw new Error(n+"contains a path "+i.toString()+" that is ancestor of another path "+s.toString());i=s}},sS=function(n,e,t,s){const i=ia(n,"values");if(!(e&&typeof e=="object")||Array.isArray(e))throw new Error(i+" must be an object containing the children to replace.");const r=[];je(e,(o,l)=>{const c=new ue(o);if(Na(i,l,Ie(t,c)),Sh(c)===".priority"&&!pc(l))throw new Error(i+"contains an invalid value for '"+c.toString()+"', which must be a valid Firebase priority (a string, finite number, server value, or null).");r.push(c)}),nS(i,r)},Xh=function(n,e,t,s){if(!$_(t))throw new Error(ia(n,e)+'was an invalid path = "'+t+`". Paths must be non-empty strings and can't contain ".", "#", "$", "[", or "]"`)},iS=function(n,e,t,s){t&&(t=t.replace(/^\/*\.info(\/|$)/,"/")),Xh(n,e,t)},j_=function(n,e){if(J(e)===".info")throw new Error(n+" failed = Can't modify data under /.info/")},rS=function(n,e){const t=e.path.toString();if(typeof e.repoInfo.host!="string"||e.repoInfo.host.length===0||!Yh(e.repoInfo.namespace)&&e.repoInfo.host.split(":")[0]!=="localhost"||t.length!==0&&!tS(t))throw new Error(ia(n,"url")+`must be a valid firebase URL and the path can't contain ".", "#", "$", "[", or "]".`)};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class oS{constructor(){this.eventLists_=[],this.recursionDepth_=0}}function Da(n,e){let t=null;for(let s=0;s<e.length;s++){const i=e[s],r=i.getPath();t!==null&&!Ah(r,t.path)&&(n.eventLists_.push(t),t=null),t===null&&(t={events:[],path:r}),t.events.push(i)}t&&n.eventLists_.push(t)}function z_(n,e,t){Da(n,t),G_(n,s=>Ah(s,e))}function _t(n,e,t){Da(n,t),G_(n,s=>gt(s,e)||gt(e,s))}function G_(n,e){n.recursionDepth_++;let t=!0;for(let s=0;s<n.eventLists_.length;s++){const i=n.eventLists_[s];if(i){const r=i.path;e(r)?(aS(n.eventLists_[s]),n.eventLists_[s]=null):t=!1}}t&&(n.eventLists_=[]),n.recursionDepth_--}function aS(n){for(let e=0;e<n.events.length;e++){const t=n.events[e];if(t!==null){n.events[e]=null;const s=t.getEventRunner();Wi&&Ue("event: "+t.toString()),si(s)}}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const lS="repo_interrupt",cS=25;class hS{constructor(e,t,s,i){this.repoInfo_=e,this.forceRestClient_=t,this.authTokenProvider_=s,this.appCheckProvider_=i,this.dataUpdateCount=0,this.statsListener_=null,this.eventQueue_=new oS,this.nextWriteId_=1,this.interceptServerDataCallback_=null,this.onDisconnect_=Ho(),this.transactionQueueTree_=new Kh,this.persistentConnection_=null,this.key=this.repoInfo_.toURLString()}toString(){return(this.repoInfo_.secure?"https://":"http://")+this.repoInfo_.host}}function uS(n,e,t){if(n.stats_=bh(n.repoInfo_),n.forceRestClient_||$C())n.server_=new Go(n.repoInfo_,(s,i,r,o)=>{ep(n,s,i,r,o)},n.authTokenProvider_,n.appCheckProvider_),setTimeout(()=>tp(n,!0),0);else{if(typeof t<"u"&&t!==null){if(typeof t!="object")throw new Error("Only objects are supported for option databaseAuthVariableOverride");try{Ne(t)}catch(s){throw new Error("Invalid authOverride provided: "+s)}}n.persistentConnection_=new tn(n.repoInfo_,e,(s,i,r,o)=>{ep(n,s,i,r,o)},s=>{tp(n,s)},s=>{dS(n,s)},n.authTokenProvider_,n.appCheckProvider_,t),n.server_=n.persistentConnection_}n.authTokenProvider_.addTokenChangeListener(s=>{n.server_.refreshAuthToken(s)}),n.appCheckProvider_.addTokenChangeListener(s=>{n.server_.refreshAppCheckToken(s.token)}),n.statsReporter_=KC(n.repoInfo_,()=>new Hb(n.stats_,n.server_)),n.infoData_=new Wb,n.infoSyncTree_=new Xf({startListening:(s,i,r,o)=>{let l=[];const c=n.infoData_.getNode(s._path);return c.isEmpty()||(l=Ar(n.infoSyncTree_,s._path,c),setTimeout(()=>{o("ok")},0)),l},stopListening:()=>{}}),Zh(n,"connected",!1),n.serverSyncTree_=new Xf({startListening:(s,i,r,o)=>(n.server_.listen(s,r,i,(l,c)=>{const h=o(l,c);_t(n.eventQueue_,s._path,h)}),[]),stopListening:(s,i)=>{n.server_.unlisten(s,i)}})}function H_(n){const t=n.infoData_.getNode(new ue(".info/serverTimeOffset")).val()||0;return new Date().getTime()+t}function La(n){return HR({timestamp:H_(n)})}function ep(n,e,t,s,i){n.dataUpdateCount++;const r=new ue(e);t=n.interceptServerDataCallback_?n.interceptServerDataCallback_(e,t):t;let o=[];if(i)if(s){const c=Io(t,h=>Pe(h));o=qR(n.serverSyncTree_,r,c,i)}else{const c=Pe(t);o=x_(n.serverSyncTree_,r,c,i)}else if(s){const c=Io(t,h=>Pe(h));o=FR(n.serverSyncTree_,r,c)}else{const c=Pe(t);o=Ar(n.serverSyncTree_,r,c)}let l=r;o.length>0&&(l=Hs(n,r)),_t(n.eventQueue_,l,o)}function tp(n,e){Zh(n,"connected",e),e===!1&&gS(n)}function dS(n,e){je(e,(t,s)=>{Zh(n,t,s)})}function Zh(n,e,t){const s=new ue("/.info/"+e),i=Pe(t);n.infoData_.updateSnapshot(s,i);const r=Ar(n.infoSyncTree_,s,i);_t(n.eventQueue_,s,r)}function eu(n){return n.nextWriteId_++}function fS(n,e,t){const s=WR(n.serverSyncTree_,e);return s!=null?Promise.resolve(s):n.server_.get(e).then(i=>{const r=Pe(i).withIndex(e._queryParams.getIndex());dc(n.serverSyncTree_,e,t,!0);let o;if(e._queryParams.loadsAllData())o=Ar(n.serverSyncTree_,e._path,r);else{const l=cr(n.serverSyncTree_,e);o=x_(n.serverSyncTree_,e._path,r,l)}return _t(n.eventQueue_,e._path,o),ta(n.serverSyncTree_,e,t,null,!0),r},i=>(Pr(n,"get for query "+Ne(e)+" failed: "+i),Promise.reject(new Error(i))))}function pS(n,e,t,s,i){Pr(n,"set",{path:e.toString(),value:t,priority:s});const r=La(n),o=Pe(t,s),l=qh(n.serverSyncTree_,e),c=B_(o,l,r),h=eu(n),d=L_(n.serverSyncTree_,e,c,h,!0);Da(n.eventQueue_,d),n.server_.put(e.toString(),o.val(!0),(m,E)=>{const C=m==="ok";C||at("set at "+e+" failed: "+m);const S=wn(n.serverSyncTree_,h,!C);_t(n.eventQueue_,e,S),mc(n,i,m,E)});const p=nu(n,e);Hs(n,p),_t(n.eventQueue_,p,[])}function mS(n,e,t,s){Pr(n,"update",{path:e.toString(),value:t});let i=!0;const r=La(n),o={};if(je(t,(l,c)=>{i=!1,o[l]=F_(Ie(e,l),Pe(c),n.serverSyncTree_,r)}),i)Ue("update() called with empty data.  Don't do anything."),mc(n,s,"ok",void 0);else{const l=eu(n),c=VR(n.serverSyncTree_,e,o,l);Da(n.eventQueue_,c),n.server_.merge(e.toString(),t,(h,d)=>{const p=h==="ok";p||at("update at "+e+" failed: "+h);const m=wn(n.serverSyncTree_,l,!p),E=m.length>0?Hs(n,e):e;_t(n.eventQueue_,E,m),mc(n,s,h,d)}),je(t,h=>{const d=nu(n,Ie(e,h));Hs(n,d)}),_t(n.eventQueue_,e,[])}}function gS(n){Pr(n,"onDisconnectEvents");const e=La(n),t=Ho();oc(n.onDisconnect_,le(),(i,r)=>{const o=F_(i,r,n.serverSyncTree_,e);y_(t,i,o)});let s=[];oc(t,le(),(i,r)=>{s=s.concat(Ar(n.serverSyncTree_,i,r));const o=nu(n,i);Hs(n,o)}),n.onDisconnect_=Ho(),_t(n.eventQueue_,le(),s)}function _S(n,e,t){let s;J(e._path)===".info"?s=dc(n.infoSyncTree_,e,t):s=dc(n.serverSyncTree_,e,t),z_(n.eventQueue_,e._path,s)}function yS(n,e,t){let s;J(e._path)===".info"?s=ta(n.infoSyncTree_,e,t):s=ta(n.serverSyncTree_,e,t),z_(n.eventQueue_,e._path,s)}function vS(n){n.persistentConnection_&&n.persistentConnection_.interrupt(lS)}function Pr(n,...e){let t="";n.persistentConnection_&&(t=n.persistentConnection_.id+":"),Ue(t,...e)}function mc(n,e,t,s){e&&si(()=>{if(t==="ok")e(null);else{const i=(t||"error").toUpperCase();let r=i;s&&(r+=": "+s);const o=new Error(r);o.code=i,e(o)}})}function K_(n,e,t){return qh(n.serverSyncTree_,e,t)||z.EMPTY_NODE}function tu(n,e=n.transactionQueueTree_){if(e||xa(n,e),ri(e)){const t=Y_(n,e);D(t.length>0,"Sending zero length transaction queue"),t.every(i=>i.status===0)&&ES(n,kr(e),t)}else q_(e)&&Pa(e,t=>{tu(n,t)})}function ES(n,e,t){const s=t.map(h=>h.currentWriteId),i=K_(n,e,s);let r=i;const o=i.hash();for(let h=0;h<t.length;h++){const d=t[h];D(d.status===0,"tryToSendTransactionQueue_: items in queue should all be run."),d.status=1,d.retryCount++;const p=ot(e,d.path);r=r.updateChild(p,d.currentOutputSnapshotRaw)}const l=r.val(!0),c=e;n.server_.put(c.toString(),l,h=>{Pr(n,"transaction put response",{path:c.toString(),status:h});let d=[];if(h==="ok"){const p=[];for(let m=0;m<t.length;m++)t[m].status=2,d=d.concat(wn(n.serverSyncTree_,t[m].currentWriteId)),t[m].onComplete&&p.push(()=>t[m].onComplete(null,!0,t[m].currentOutputSnapshotResolved)),t[m].unwatcher();xa(n,Qh(n.transactionQueueTree_,e)),tu(n,n.transactionQueueTree_),_t(n.eventQueue_,e,d);for(let m=0;m<p.length;m++)si(p[m])}else{if(h==="datastale")for(let p=0;p<t.length;p++)t[p].status===3?t[p].status=4:t[p].status=0;else{at("transaction at "+c.toString()+" failed: "+h);for(let p=0;p<t.length;p++)t[p].status=4,t[p].abortReason=h}Hs(n,e)}},o)}function Hs(n,e){const t=Q_(n,e),s=kr(t),i=Y_(n,t);return wS(n,i,s),s}function wS(n,e,t){if(e.length===0)return;const s=[];let i=[];const o=e.filter(l=>l.status===0).map(l=>l.currentWriteId);for(let l=0;l<e.length;l++){const c=e[l],h=ot(t,c.path);let d=!1,p;if(D(h!==null,"rerunTransactionsUnderNode_: relativePath should not be null."),c.status===4)d=!0,p=c.abortReason,i=i.concat(wn(n.serverSyncTree_,c.currentWriteId,!0));else if(c.status===0)if(c.retryCount>=cS)d=!0,p="maxretry",i=i.concat(wn(n.serverSyncTree_,c.currentWriteId,!0));else{const m=K_(n,c.path,o);c.currentInputSnapshot=m;const E=e[l].update(m.val());if(E!==void 0){Na("transaction failed: Data returned ",E,c.path);let C=Pe(E);typeof E=="object"&&E!=null&&Vt(E,".priority")||(C=C.updatePriority(m.getPriority()));const k=c.currentWriteId,F=La(n),U=B_(C,m,F);c.currentOutputSnapshotRaw=C,c.currentOutputSnapshotResolved=U,c.currentWriteId=eu(n),o.splice(o.indexOf(k),1),i=i.concat(L_(n.serverSyncTree_,c.path,U,c.currentWriteId,c.applyLocally)),i=i.concat(wn(n.serverSyncTree_,k,!0))}else d=!0,p="nodata",i=i.concat(wn(n.serverSyncTree_,c.currentWriteId,!0))}_t(n.eventQueue_,t,i),i=[],d&&(e[l].status=2,function(m){setTimeout(m,Math.floor(0))}(e[l].unwatcher),e[l].onComplete&&(p==="nodata"?s.push(()=>e[l].onComplete(null,!1,e[l].currentInputSnapshot)):s.push(()=>e[l].onComplete(new Error(p),!1,null))))}xa(n,n.transactionQueueTree_);for(let l=0;l<s.length;l++)si(s[l]);tu(n,n.transactionQueueTree_)}function Q_(n,e){let t,s=n.transactionQueueTree_;for(t=J(e);t!==null&&ri(s)===void 0;)s=Qh(s,t),e=ye(e),t=J(e);return s}function Y_(n,e){const t=[];return J_(n,e,t),t.sort((s,i)=>s.order-i.order),t}function J_(n,e,t){const s=ri(e);if(s)for(let i=0;i<s.length;i++)t.push(s[i]);Pa(e,i=>{J_(n,i,t)})}function xa(n,e){const t=ri(e);if(t){let s=0;for(let i=0;i<t.length;i++)t[i].status!==2&&(t[s]=t[i],s++);t.length=s,U_(e,t.length>0?t:void 0)}Pa(e,s=>{xa(n,s)})}function nu(n,e){const t=kr(Q_(n,e)),s=Qh(n.transactionQueueTree_,e);return JR(s,i=>{wl(n,i)}),wl(n,s),W_(s,i=>{wl(n,i)}),t}function wl(n,e){const t=ri(e);if(t){const s=[];let i=[],r=-1;for(let o=0;o<t.length;o++)t[o].status===3||(t[o].status===1?(D(r===o-1,"All SENT items should be at beginning of queue."),r=o,t[o].status=3,t[o].abortReason="set"):(D(t[o].status===0,"Unexpected transaction status in abort"),t[o].unwatcher(),i=i.concat(wn(n.serverSyncTree_,t[o].currentWriteId,!0)),t[o].onComplete&&s.push(t[o].onComplete.bind(null,new Error("set"),!1,null))));r===-1?U_(e,void 0):t.length=r+1,_t(n.eventQueue_,kr(e),i);for(let o=0;o<s.length;o++)si(s[o])}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function TS(n){let e="";const t=n.split("/");for(let s=0;s<t.length;s++)if(t[s].length>0){let i=t[s];try{i=decodeURIComponent(i.replace(/\+/g," "))}catch{}e+="/"+i}return e}function IS(n){const e={};n.charAt(0)==="?"&&(n=n.substring(1));for(const t of n.split("&")){if(t.length===0)continue;const s=t.split("=");s.length===2?e[decodeURIComponent(s[0])]=decodeURIComponent(s[1]):at(`Invalid query segment '${t}' in query '${n}'`)}return e}const np=function(n,e){const t=CS(n),s=t.namespace;t.domain==="firebase.com"&&an(t.host+" is no longer supported. Please use <YOUR FIREBASE>.firebaseio.com instead"),(!s||s==="undefined")&&t.domain!=="localhost"&&an("Cannot parse Firebase url. Please use https://<YOUR FIREBASE>.firebaseio.com"),t.secure||xC();const i=t.scheme==="ws"||t.scheme==="wss";return{repoInfo:new e_(t.host,t.secure,s,i,e,"",s!==t.subdomain),path:new ue(t.pathString)}},CS=function(n){let e="",t="",s="",i="",r="",o=!0,l="https",c=443;if(typeof n=="string"){let h=n.indexOf("//");h>=0&&(l=n.substring(0,h-1),n=n.substring(h+2));let d=n.indexOf("/");d===-1&&(d=n.length);let p=n.indexOf("?");p===-1&&(p=n.length),e=n.substring(0,Math.min(d,p)),d<p&&(i=TS(n.substring(d,p)));const m=IS(n.substring(Math.min(n.length,p)));h=e.indexOf(":"),h>=0?(o=l==="https"||l==="wss",c=parseInt(e.substring(h+1),10)):h=e.length;const E=e.slice(0,h);if(E.toLowerCase()==="localhost")t="localhost";else if(E.split(".").length<=2)t=E;else{const C=e.indexOf(".");s=e.substring(0,C).toLowerCase(),t=e.substring(C+1),r=s}"ns"in m&&(r=m.ns)}return{host:e,port:c,domain:t,subdomain:s,secure:o,scheme:l,pathString:i,namespace:r}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const sp="-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz",bS=function(){let n=0;const e=[];return function(t){const s=t===n;n=t;let i;const r=new Array(8);for(i=7;i>=0;i--)r[i]=sp.charAt(t%64),t=Math.floor(t/64);D(t===0,"Cannot push at time == 0");let o=r.join("");if(s){for(i=11;i>=0&&e[i]===63;i--)e[i]=0;e[i]++}else for(i=0;i<12;i++)e[i]=Math.floor(Math.random()*64);for(i=0;i<12;i++)o+=sp.charAt(e[i]);return D(o.length===20,"nextPushId: Length should be 20."),o}}();/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class X_{constructor(e,t,s,i){this.eventType=e,this.eventRegistration=t,this.snapshot=s,this.prevName=i}getPath(){const e=this.snapshot.ref;return this.eventType==="value"?e._path:e.parent._path}getEventType(){return this.eventType}getEventRunner(){return this.eventRegistration.getEventRunner(this)}toString(){return this.getPath().toString()+":"+this.eventType+":"+Ne(this.snapshot.exportVal())}}class Z_{constructor(e,t,s){this.eventRegistration=e,this.error=t,this.path=s}getPath(){return this.path}getEventType(){return"cancel"}getEventRunner(){return this.eventRegistration.getEventRunner(this)}toString(){return this.path.toString()+":cancel"}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ey{constructor(e,t){this.snapshotCallback=e,this.cancelCallback=t}onValue(e,t){this.snapshotCallback.call(null,e,t)}onCancel(e){return D(this.hasCancelCallback,"Raising a cancel event on a listener with no cancel callback"),this.cancelCallback.call(null,e)}get hasCancelCallback(){return!!this.cancelCallback}matches(e){return this.snapshotCallback===e.snapshotCallback||this.snapshotCallback.userCallback!==void 0&&this.snapshotCallback.userCallback===e.snapshotCallback.userCallback&&this.snapshotCallback.context===e.snapshotCallback.context}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Nr{constructor(e,t,s,i){this._repo=e,this._path=t,this._queryParams=s,this._orderByCalled=i}get key(){return X(this._path)?null:Sh(this._path)}get ref(){return new Ft(this._repo,this._path)}get _queryIdentifier(){const e=Wf(this._queryParams),t=Ih(e);return t==="{}"?"default":t}get _queryObject(){return Wf(this._queryParams)}isEqual(e){if(e=ge(e),!(e instanceof Nr))return!1;const t=this._repo===e._repo,s=Ah(this._path,e._path),i=this._queryIdentifier===e._queryIdentifier;return t&&s&&i}toJSON(){return this.toString()}toString(){return this._repo.toString()+_b(this._path)}}function RS(n,e){if(n._orderByCalled===!0)throw new Error(e+": You can't combine multiple orderBy calls.")}function ty(n){let e=null,t=null;if(n.hasStart()&&(e=n.getIndexStartValue()),n.hasEnd()&&(t=n.getIndexEndValue()),n.getIndex()===Jn){const s="Query: When ordering by key, you may only pass one argument to startAt(), endAt(), or equalTo().",i="Query: When ordering by key, the argument passed to startAt(), startAfter(), endAt(), endBefore(), or equalTo() must be a string.";if(n.hasStart()){if(n.getIndexStartName()!==is)throw new Error(s);if(typeof e!="string")throw new Error(i)}if(n.hasEnd()){if(n.getIndexEndName()!==xn)throw new Error(s);if(typeof t!="string")throw new Error(i)}}else if(n.getIndex()===we){if(e!=null&&!pc(e)||t!=null&&!pc(t))throw new Error("Query: When ordering by priority, the first argument passed to startAt(), startAfter() endAt(), endBefore(), or equalTo() must be a valid priority value (null, a number, or a string).")}else if(D(n.getIndex()instanceof Nh||n.getIndex()===g_,"unknown index type."),e!=null&&typeof e=="object"||t!=null&&typeof t=="object")throw new Error("Query: First argument passed to startAt(), startAfter(), endAt(), endBefore(), or equalTo() cannot be an object.")}function SS(n){if(n.hasStart()&&n.hasEnd()&&n.hasLimit()&&!n.hasAnchoredLimit())throw new Error("Query: Can't combine startAt(), startAfter(), endAt(), endBefore(), and limit(). Use limitToFirst() or limitToLast() instead.")}class Ft extends Nr{constructor(e,t){super(e,t,new Lh,!1)}get parent(){const e=c_(this._path);return e===null?null:new Ft(this._repo,e)}get root(){let e=this;for(;e.parent!==null;)e=e.parent;return e}}class Ks{constructor(e,t,s){this._node=e,this.ref=t,this._index=s}get priority(){return this._node.getPriority().val()}get key(){return this.ref.key}get size(){return this._node.numChildren()}child(e){const t=new ue(e),s=Qs(this.ref,e);return new Ks(this._node.getChild(t),s,we)}exists(){return!this._node.isEmpty()}exportVal(){return this._node.val(!0)}forEach(e){return this._node.isLeafNode()?!1:!!this._node.forEachChild(this._index,(s,i)=>e(new Ks(i,Qs(this.ref,s),we)))}hasChild(e){const t=new ue(e);return!this._node.getChild(t).isEmpty()}hasChildren(){return this._node.isLeafNode()?!1:!this._node.isEmpty()}toJSON(){return this.exportVal()}val(){return this._node.val()}}function Tl(n,e){return n=ge(n),n._checkNotDeleted("ref"),Qs(n._root,e)}function Qs(n,e){return n=ge(n),J(n._path)===null?iS("child","path",e):Xh("child","path",e),new Ft(n._repo,Ie(n._path,e))}function AS(n,e){n=ge(n),j_("push",n._path),Jh("push",e,n._path,!0);const t=H_(n._repo),s=bS(t),i=Qs(n,s),r=Qs(n,s);let o;return e!=null?o=kS(r,e).then(()=>r):o=Promise.resolve(r),i.then=o.then.bind(o),i.catch=o.then.bind(o,void 0),i}function kS(n,e){n=ge(n),j_("set",n._path),Jh("set",e,n._path,!1);const t=new hr;return pS(n._repo,n._path,e,null,t.wrapCallback(()=>{})),t.promise}function PS(n,e){sS("update",e,n._path);const t=new hr;return mS(n._repo,n._path,e,t.wrapCallback(()=>{})),t.promise}function NS(n){n=ge(n);const e=new ey(()=>{}),t=new su(e);return fS(n._repo,n,t).then(s=>new Ks(s,new Ft(n._repo,n._path),n._queryParams.getIndex()))}class su{constructor(e){this.callbackContext=e}respondsTo(e){return e==="value"}createEvent(e,t){const s=t._queryParams.getIndex();return new X_("value",this,new Ks(e.snapshotNode,new Ft(t._repo,t._path),s))}getEventRunner(e){return e.getEventType()==="cancel"?()=>this.callbackContext.onCancel(e.error):()=>this.callbackContext.onValue(e.snapshot,null)}createCancelEvent(e,t){return this.callbackContext.hasCancelCallback?new Z_(this,e,t):null}matches(e){return e instanceof su?!e.callbackContext||!this.callbackContext?!0:e.callbackContext.matches(this.callbackContext):!1}hasAnyCallback(){return this.callbackContext!==null}}class iu{constructor(e,t){this.eventType=e,this.callbackContext=t}respondsTo(e){let t=e==="children_added"?"child_added":e;return t=t==="children_removed"?"child_removed":t,this.eventType===t}createCancelEvent(e,t){return this.callbackContext.hasCancelCallback?new Z_(this,e,t):null}createEvent(e,t){D(e.childName!=null,"Child events should have a childName.");const s=Qs(new Ft(t._repo,t._path),e.childName),i=t._queryParams.getIndex();return new X_(e.type,this,new Ks(e.snapshotNode,s,i),e.prevName)}getEventRunner(e){return e.getEventType()==="cancel"?()=>this.callbackContext.onCancel(e.error):()=>this.callbackContext.onValue(e.snapshot,e.prevName)}matches(e){return e instanceof iu?this.eventType===e.eventType&&(!this.callbackContext||!e.callbackContext||this.callbackContext.matches(e.callbackContext)):!1}hasAnyCallback(){return!!this.callbackContext}}function DS(n,e,t,s,i){const r=new ey(t,void 0),o=new iu(e,r);return _S(n._repo,n,o),()=>yS(n._repo,n,o)}function LS(n,e,t,s){return DS(n,"child_added",e)}class ny{}class xS extends ny{constructor(e,t){super(),this._value=e,this._key=t,this.type="endAt"}_apply(e){Jh("endAt",this._value,e._path,!0);const t=Ub(e._queryParams,this._value,this._key);if(SS(t),ty(t),e._queryParams.hasEnd())throw new Error("endAt: Starting point was already set (by another call to endAt, endBefore or equalTo).");return new Nr(e._repo,e._path,t,e._orderByCalled)}}function OS(n,e){return new xS(n,e)}class MS extends ny{constructor(e){super(),this._path=e,this.type="orderByChild"}_apply(e){RS(e,"orderByChild");const t=new ue(this._path);if(X(t))throw new Error("orderByChild: cannot pass in empty path. Use orderByValue() instead.");const s=new Nh(t),i=qb(e._queryParams,s);return ty(i),new Nr(e._repo,e._path,i,!0)}}function VS(n){return Xh("orderByChild","path",n),new MS(n)}function FS(n,...e){let t=ge(n);for(const s of e)t=s._apply(t);return t}kR(Ft);xR(Ft);/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const BS="FIREBASE_DATABASE_EMULATOR_HOST",gc={};let US=!1;function qS(n,e,t,s){n.repoInfo_=new e_(`${e}:${t}`,!1,n.repoInfo_.namespace,n.repoInfo_.webSocketOnly,n.repoInfo_.nodeAdmin,n.repoInfo_.persistenceKey,n.repoInfo_.includeNamespaceInQueryParams,!0),s&&(n.authTokenProvider_=s)}function WS(n,e,t,s,i){let r=s||n.options.databaseURL;r===void 0&&(n.options.projectId||an("Can't determine Firebase Database URL. Be sure to include  a Project ID when calling firebase.initializeApp()."),Ue("Using default host for project ",n.options.projectId),r=`${n.options.projectId}-default-rtdb.firebaseio.com`);let o=np(r,i),l=o.repoInfo,c;typeof process<"u"&&Cf&&(c=Cf[BS]),c?(r=`http://${c}?ns=${l.namespace}`,o=np(r,i),l=o.repoInfo):o.repoInfo.secure;const h=new zC(n.name,n.options,e);rS("Invalid Firebase Database URL",o),X(o.path)||an("Database URL must point to the root of a Firebase Database (not including a child path).");const d=jS(l,n,h,new jC(n.name,t));return new zS(d,n)}function $S(n,e){const t=gc[e];(!t||t[n.key]!==n)&&an(`Database ${e}(${n.repoInfo_}) has already been deleted.`),vS(n),delete t[n.key]}function jS(n,e,t,s){let i=gc[e.name];i||(i={},gc[e.name]=i);let r=i[n.toURLString()];return r&&an("Database initialized multiple times. Please make sure the format of the database URL matches with each database() call."),r=new hS(n,US,t,s),i[n.toURLString()]=r,r}class zS{constructor(e,t){this._repoInternal=e,this.app=t,this.type="database",this._instanceStarted=!1}get _repo(){return this._instanceStarted||(uS(this._repoInternal,this.app.options.appId,this.app.options.databaseAuthVariableOverride),this._instanceStarted=!0),this._repoInternal}get _root(){return this._rootInternal||(this._rootInternal=new Ft(this._repo,le())),this._rootInternal}_delete(){return this._rootInternal!==null&&($S(this._repo,this.app.name),this._repoInternal=null,this._rootInternal=null),Promise.resolve()}_checkNotDeleted(e){this._rootInternal===null&&an("Cannot call "+e+" on a deleted database.")}}function GS(n=Rc(),e){const t=aa(n,"database").getImmediate({identifier:e});if(!t._instanceStarted){const s=Rp("database");s&&HS(t,...s)}return t}function HS(n,e,t,s={}){n=ge(n),n._checkNotDeleted("useEmulator"),n._instanceStarted&&an("Cannot call useEmulator() after instance has already been initialized.");const i=n._repoInternal;let r;if(i.repoInfo_.nodeAdmin)s.mockUserToken&&an('mockUserToken is not supported by the Admin SDK. For client access with mock users, please use the "firebase" package instead of "firebase-admin".'),r=new mo(mo.OWNER);else if(s.mockUserToken){const o=typeof s.mockUserToken=="string"?s.mockUserToken:kp(s.mockUserToken,n.app.options.projectId);r=new mo(o)}qS(i,e,t,r)}/**
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
 */function KS(n){AC(as),Xn(new Pn("database",(e,{instanceIdentifier:t})=>{const s=e.getProvider("app").getImmediate(),i=e.getProvider("auth-internal"),r=e.getProvider("app-check-internal");return WS(s,i,r,t)},"PUBLIC").setMultipleInstances(!0)),kt(bf,Rf,n),kt(bf,Rf,"esm2017")}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const QS={".sv":"timestamp"};function YS(){return QS}tn.prototype.simpleListen=function(n,e){this.sendRequest("q",{p:n},e)};tn.prototype.echo=function(n,e){this.sendRequest("echo",{d:n},e)};KS();const gn=n=>atob(n),JS={apiKey:gn("QUl6YVN5Q2FUUWE2Sm9NajJNQmdEZ2Rwb25WQllfTkFlUU84X3Vz"),authDomain:gn("a2lja2VyaGF4LW9ubGluZS5maXJlYmFzYXBwLmNvbQ=="),databaseURL:gn("aHR0cHM6Ly9raWNrZXJoYXgtb25saW5lLWRlZmF1bHQtcnRkYi5maXJlYmFzZWlvLmNvbQ=="),projectId:gn("a2lja2VyaGF4LW9ubGluZQ=="),storageBucket:gn("a2lja2VyaGF4LW9ubGluZS5maXJlYmFzdG9yYWdlLmFwcA=="),messagingSenderId:gn("MzM3NTk4NDY1MTcw"),appId:gn("MTozMzc1OTg0NjUxNzA6d2ViOjE5MDU0YWI4NDBkODBkMmMyMDUyNGI="),measurementId:gn("Ry0xWjhWN0NWRkcw")},ru=xp(JS),Il=CT(ru),ut=uC(ru),Cl=GS(ru),Xe={async loginWithGoogle(){const n=new Qt,e=await Lw(Il,n),t=e.user,s=Gt(ut,"users",t.uid);if((await dl(s)).exists())await If(s,{lastLogin:new Date().toISOString()});else{const r=Math.floor(Math.random()*9e3)+1e3,l=`${(t.displayName||"Jogador").replace(/\s+/g,"").replace(/[^a-zA-Z0-9]/g,"").toLowerCase()}${r}`.substring(0,12),c={uid:t.uid,username:l,displayName:l,badge:"👤",bio:"",level:1,xp:0,isNewUser:!0,dateCreated:new Date().toISOString(),lastLogin:new Date().toISOString(),settings:{volume:80,quality:"high",fieldSize:"medium"}},h={uid:t.uid,matchesPlayed:0,wins:0,losses:0,draws:0,goals:0,assists:0,saves:0};await pl(Gt(ut,"users",t.uid),c),await pl(Gt(ut,"stats",t.uid),h)}return e},async logout(){return await fw(Il)},subscribeToAuth(n){return dw(Il,n)},async getUserProfile(n){const e=Gt(ut,"users",n),t=await dl(e);return t.exists()?t.data():null},async updateUserProfile(n,e){const t=Gt(ut,"users",n);await If(t,e)},async getUserStats(n){const e=Gt(ut,"stats",n),t=await dl(e);return t.exists()?t.data():null},async saveMatchResult(n,e,t,s,i,r,o,l){const c=Gt(ut,"stats",n),h=Gt(ut,"users",n);await SC(ut,async d=>{const p=await d.get(c),m=await d.get(h);if(!p.exists()||!m.exists())throw new Error("Documento não encontrado");const E=p.data(),C=m.data(),S={matchesPlayed:(E.matchesPlayed||0)+1,wins:(E.wins||0)+(e?1:0),losses:(E.losses||0)+(t?1:0),draws:(E.draws||0)+(s?1:0),goals:(E.goals||0)+i,assists:(E.assists||0)+r,saves:(E.saves||0)+o};let k=(C.xp||0)+l,F=C.level||1,U=F*100;for(;k>=U;)k-=U,F++,U=F*100;d.update(c,S),d.update(h,{xp:k,level:F,lastLogin:new Date().toISOString()})})},async addMatchToHistory(n){const e=Gt(eo(ut,"history"));await pl(e,n)},async getRecentHistory(n,e=5){const t=eo(ut,"history"),s=vf(t,Ef("playerUids","array-contains",n),EC(20)),i=await fl(s),r=[];return i.forEach(o=>r.push({id:o.id,...o.data()})),r.sort((o,l)=>new Date(l.date)-new Date(o.date)),r.slice(0,e)},async getGlobalRanking(n="wins",e=10){try{const t=eo(ut,"users"),s=await fl(t),i=[];for(const r of s.docs){const o=r.data();if(!o.uid)continue;const l=await this.getUserStats(o.uid)||{};i.push({username:o.username,displayName:o.username,badge:o.badge||"🏳️",level:o.level||1,wins:l.wins||0,losses:l.losses||0,goals:l.goals||0,xp:o.xp||0})}return n==="level"?i.sort((r,o)=>o.level!==r.level?o.level-r.level:o.xp-r.xp):n==="wins"?i.sort((r,o)=>o.wins-r.wins):n==="goals"&&i.sort((r,o)=>o.goals-r.goals),i.slice(0,e)}catch(t){throw console.error("[Firestore] Error fetching ranking:",t),t}},async isUsernameUnique(n,e){const t=vf(eo(ut,"users"),Ef("username","==",n.toLowerCase())),s=await fl(t);let i=!0;return s.forEach(r=>{r.id!==e&&(i=!1)}),i},async pruneOldChatMessages(){try{const n=Tl(Cl,"globalChat"),e=Date.now()-72e5,t=FS(n,VS("timestamp"),OS(e)),s=await NS(t);if(s.exists()){const i={};s.forEach(r=>{i[r.key]=null}),await PS(n,i)}}catch(n){console.warn("Pruning skipped or unauthorized:",n)}},async sendGlobalChatMessage(n,e){this.pruneOldChatMessages().catch(s=>console.warn(s));const t=Tl(Cl,"globalChat");await AS(t,{uid:n.uid,username:n.username,badge:n.badge||"👤",text:e,timestamp:YS()})},subscribeToGlobalChat(n){const e=Tl(Cl,"globalChat");LS(e,t=>{n(t.val())})}};function ce(n,e="info"){if(!document.getElementById("toast-style")){const r=document.createElement("style");r.id="toast-style",r.textContent=`
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
    `,document.head.appendChild(r)}let t=document.querySelector(".toast-container");t||(t=document.createElement("div"),t.className="toast-container",document.body.appendChild(t));const s=document.createElement("div");s.className=`toast toast-${e}`;let i="ℹ️";e==="success"&&(i="✅"),e==="error"&&(i="❌"),s.innerHTML=`<span>${i}</span> <span>${n}</span>`,t.appendChild(s),setTimeout(()=>s.classList.add("show"),50),setTimeout(()=>{s.classList.remove("show"),setTimeout(()=>s.remove(),250)},3500)}const XS={init(){const n=document.getElementById("btn-google-login");n&&n.addEventListener("click",async()=>{try{ce("Iniciando login com Google...","info"),await Xe.loginWithGoogle(),ce("Login realizado com sucesso!","success")}catch(e){ce(e.message||"Erro ao entrar com Google.","error")}})}};function ZS(n){const e=(n??"").toString();if(!e)return[];try{const t=new Intl.Segmenter(void 0,{granularity:"grapheme"});return Array.from(t.segment(e),s=>s.segment)}catch{return Array.from(e)}}function eA(n){return new RegExp("\\p{Extended_Pictographic}","u").test(n||"")}const Be={currentUser:null,profileData:null,async init(n){if(this.currentUser=n,!n)return;const e=document.getElementById("menu-btn-play");e&&(e.onclick=()=>$.show("mode-select-screen"));const t=document.getElementById("menu-btn-profile");t&&(t.onclick=()=>$.show("profile-screen"));const s=document.getElementById("menu-quick-profile");s&&(s.onclick=()=>$.show("profile-screen"));const i=document.getElementById("menu-btn-ranking");i&&(i.onclick=()=>$.show("ranking-screen"));const r=document.getElementById("menu-btn-settings");r&&(r.onclick=()=>$.show("settings-screen"));const o=document.getElementById("menu-btn-controls");o&&(o.onclick=()=>$.show("controls-screen"));const l=document.getElementById("menu-btn-credits");l&&(l.onclick=()=>$.show("credits-screen"));const c=document.getElementById("menu-btn-logout");c&&(c.onclick=async()=>{try{await Xe.logout(),ce("Desconectado com sucesso.","info")}catch{ce("Erro ao sair da conta.","error")}});const h=document.getElementById("credits-btn-back");h&&(h.onclick=()=>$.show("menu-screen")),$.register("menu-screen",{onEnter:()=>this.refreshQuickProfile()}),$.register("profile-screen",{onEnter:()=>this.loadProfileScreen()});const d=document.getElementById("profile-btn-back");d&&(d.onclick=()=>$.show("menu-screen"));const p=document.getElementById("profile-btn-save");p&&(p.onclick=async()=>{await this.saveProfileEdits()});const m=document.getElementById("profile-badge-select"),E=document.getElementById("profile-avatar-display");m&&E&&m.addEventListener("change",C=>{this.updateAvatarDisplay(E,C.target.value)}),await this.refreshQuickProfile()},async refreshQuickProfile(){if(this.currentUser)try{if(this.profileData=await Xe.getUserProfile(this.currentUser.uid),!this.profileData)return;const n=document.getElementById("quick-profile-flag"),e=document.getElementById("quick-profile-name"),t=document.getElementById("quick-profile-level"),s=document.getElementById("quick-avatar-char"),i=document.querySelector(".quick-xp-fill");if(n&&(n.textContent=this.profileData.badge||"🇧🇷"),e&&(e.textContent=this.profileData.displayName||this.profileData.username),t&&(t.textContent=this.profileData.level||1),s&&(s.textContent=this.profileData.badge||"👤"),i){const r=this.profileData.level||1,o=this.profileData.xp||0,l=r*100,c=Math.min(100,Math.max(0,o/l*100));i.style.width=`${c}%`}}catch(n){console.error("Erro ao carregar perfil rápido:",n)}},async loadProfileScreen(){if(!this.currentUser||!this.profileData)return;this.profileData=await Xe.getUserProfile(this.currentUser.uid);const n=document.getElementById("profile-username-input"),e=document.getElementById("profile-badge-select"),t=document.getElementById("profile-bio-input"),s=document.getElementById("profile-avatar-display");n&&(n.value=this.profileData.username||""),e&&(e.value=this.profileData.badge||"👤"),t&&(t.value=this.profileData.bio||""),s&&this.updateAvatarDisplay(s,this.profileData.badge);const i=await Xe.getUserStats(this.currentUser.uid);if(i){const o=i.matchesPlayed>0?Math.round(i.wins/i.matchesPlayed*100):0;document.getElementById("stats-played").textContent=i.matchesPlayed||0,document.getElementById("stats-wins").textContent=i.wins||0,document.getElementById("stats-losses").textContent=i.losses||0,document.getElementById("stats-winrate").textContent=`${o}%`,document.getElementById("stats-goals").textContent=i.goals||0,document.getElementById("stats-assists").textContent=i.assists||0,document.getElementById("stats-saves").textContent=i.saves||0,document.getElementById("stats-level").textContent=this.profileData.level||1,document.getElementById("stats-xp").textContent=this.profileData.xp||0}const r=document.getElementById("profile-match-history");if(r){r.innerHTML='<div class="subtext">Carregando histórico...</div>';try{const o=await Xe.getRecentHistory(this.currentUser.uid);o.length===0?r.innerHTML='<div class="subtext">Nenhuma partida recente.</div>':(r.innerHTML="",o.forEach(l=>{const c=document.createElement("div");c.className="history-item";let h="draw",d="Empate";l.winner==="draw"?(h="draw",d="Empate"):l.winner===l.playerTeams[this.currentUser.uid]?(h="win",d="Vitória"):(h="loss",d="Derrota");const p=new Date(l.date).toLocaleDateString("pt-BR");c.innerHTML=`
              <span>📅 ${p} - ${l.mode==="solo"?"vs CPU":"Online"}</span>
              <span>${l.scoreRed} : ${l.scoreBlue}</span>
              <span class="history-result ${h}">${d}</span>
            `,r.appendChild(c)}))}catch{r.innerHTML='<div class="subtext text-danger">Erro ao carregar histórico.</div>'}}},async saveProfileEdits(){if(!this.currentUser)return;const n=document.getElementById("profile-username-input"),e=document.getElementById("profile-badge-select"),t=document.getElementById("profile-bio-input"),s=n?n.value.trim().toLowerCase():"",i=e?e.value:"👤",r=t?t.value.trim():"";if(s.length<3||s.length>12)return ce("O nome de usuário precisa ter entre 3 e 12 caracteres.","error");if(!/^[a-zA-Z0-9_]+$/.test(s))return ce("O nome de usuário só pode conter letras, números e sublinhado (_). Sem espaços!","error");try{if(ce("Verificando disponibilidade do nome...","info"),!await Xe.isUsernameUnique(s,this.currentUser.uid))return ce("Este nome de usuário já está em uso por outro jogador.","error");ce("Salvando dados...","info"),await Xe.updateUserProfile(this.currentUser.uid,{username:s,displayName:s,badge:i,bio:r,isNewUser:!1}),this.profileData.username=s,this.profileData.displayName=s,this.profileData.badge=i,this.profileData.bio=r,this.profileData.isNewUser=!1;const c=document.getElementById("profile-btn-back");c&&(c.style.display=""),ce("Perfil atualizado com sucesso!","success"),await this.refreshQuickProfile(),$.show("menu-screen")}catch{ce("Erro ao atualizar perfil.","error")}},updateAvatarDisplay(n,e){n&&(n.innerHTML="",n.textContent=e||"👤")}};let bl=null,Si=null,Ai=null,Cs=null,ki=null,Pi=null,Rl=!1,Sl=.8;function Al(){if(!bl)try{bl=new(window.AudioContext||window.webkitAudioContext)}catch(n){console.warn("Web Audio API not supported",n)}return bl}const pt={setVolume(n){Sl=n/100,this.updateBuses()},ensureBuses(){const n=Al();if(!n)return null;if(Si||(Si=n.createGain(),Si.gain.value=Rl?0:Sl*.9,Si.connect(n.destination)),!Ai){Ai=n.createGain(),Ai.gain.value=.9;try{Cs=n.createMediaStreamDestination(),Ai.connect(Cs)}catch(e){console.warn("MediaStream destination not supported for audio recording",e)}}return{ac:n,outGain:Si,recGain:Ai}},updateBuses(){const n=this.ensureBuses();if(!n)return;const{ac:e,outGain:t}=n,s=Rl?0:Sl*.9;try{t.gain.cancelScheduledValues(e.currentTime),t.gain.setTargetAtTime(s,e.currentTime,.05)}catch{}},envNoise(n=.08){try{const e=this.ensureBuses();if(!e)return null;const{ac:t,outGain:s,recGain:i}=e,r=t.createBuffer(1,t.sampleRate*2,t.sampleRate),o=r.getChannelData(0);for(let d=0;d<o.length;d++)o[d]=(Math.random()*2-1)*.35;const l=t.createBufferSource();l.buffer=r,l.loop=!0;const c=t.createBiquadFilter();c.type="lowpass",c.frequency.value=800;const h=t.createGain();return h.gain.value=n,l.connect(c),c.connect(h),h.connect(s),Cs&&h.connect(i),{src:l,g:h}}catch{return null}},startCrowd(){try{const n=this.envNoise(.06);if(!n)return;ki=n.g,n.src.start(),Pi=n.src}catch{}},stopCrowd(){if(Pi){try{Pi.stop()}catch{}Pi=null,ki=null}},setOutputMuted(n){Rl=n,this.updateBuses()},createTone(n,e=.12,t="sine",s=.2){try{const i=this.ensureBuses();if(!i)return;const{ac:r,outGain:o,recGain:l}=i,c=r.createOscillator(),h=r.createGain();c.type=t,c.frequency.value=n,h.gain.value=s,c.connect(h),h.connect(o),Cs&&h.connect(l),c.start(),h.gain.exponentialRampToValueAtTime(1e-4,r.currentTime+e),c.stop(r.currentTime+e)}catch{}},percuss(n=.18,e=.05){try{const t=this.ensureBuses();if(!t)return;const{ac:s,outGain:i,recGain:r}=t,o=s.createBuffer(1,s.sampleRate*e,s.sampleRate),l=o.getChannelData(0);for(let d=0;d<l.length;d++)l[d]+=(Math.random()*2-1)*(1-d/l.length);const c=s.createBufferSource(),h=s.createGain();h.gain.value=n,c.buffer=o,c.connect(h),h.connect(i),Cs&&h.connect(r),c.start()}catch{}},playCheer(){try{if(ki||this.startCrowd(),!ki)return;const n=Al(),e=ki.gain,t=n.currentTime;e.cancelScheduledValues(t),e.setTargetAtTime(.25,t,.03),e.setTargetAtTime(.08,t+.6,.3)}catch{}},play(n){switch(n){case"kick":this.createTone(520,.05,"square",.18),this.createTone(260,.06,"square",.09);break;case"tackle":this.percuss(.22,.03),this.createTone(140,.06,"sawtooth",.22);break;case"dribble":this.createTone(800,.05,"triangle",.12),this.createTone(600,.05,"triangle",.08);break;case"power":this.createTone(360,.08,"sawtooth",.18),setTimeout(()=>this.createTone(720,.06,"square",.16),80),setTimeout(()=>this.percuss(.25,.04),120);break;case"post":this.createTone(900,.04,"square",.12),this.createTone(300,.06,"sine",.1);break;case"whistle":this.createTone(1800,.18,"sine",.12),this.createTone(1500,.18,"sine",.12);break;case"goal":this.createTone(480,.18,"triangle",.14),setTimeout(()=>this.createTone(960,.12,"sine",.12),120);break;case"cheer":this.playCheer();break}},ensureAudio(){const n=Al();n&&n.state==="suspended"&&n.resume(),Pi||this.startCrowd()},getRecordingStreamDestination(){return this.ensureBuses(),Cs}},Hi={CTRL_P1:null,CTRL_P2:null,fieldSize:"medium",dimensions:{w:1024,h:640},waitingRemap:null,defaultP1:{up:"w",down:"s",left:"a",right:"d",sprint:"ShiftLeft",shoot:" ",dribble:"f",tackle:"e",power:"q"},defaultP2:{up:"arrowup",down:"arrowdown",left:"arrowleft",right:"arrowright",sprint:"ShiftRight",shoot:"1",dribble:"2",tackle:"3",power:"enter"},actions:[{id:"up",label:"Mover Cima"},{id:"down",label:"Mover Baixo"},{id:"left",label:"Mover Esquerda"},{id:"right",label:"Mover Direita"},{id:"sprint",label:"Correr"},{id:"shoot",label:"Chutar"},{id:"dribble",label:"Driblar"},{id:"tackle",label:"Desarme"},{id:"power",label:"Power Shoot"}],init(){this.loadSettings();const n=document.getElementById("settings-volume"),e=document.getElementById("volume-val-display");n&&n.addEventListener("input",o=>{const l=o.target.value;e&&(e.textContent=`${l}%`),pt.setVolume(l),localStorage.setItem("kicker_hax_volume",l)});const t=document.getElementById("settings-replay");t&&t.addEventListener("change",o=>{localStorage.setItem("kicker_hax_show_replay",o.target.checked?"true":"false")});const s=document.getElementById("settings-btn-back");s&&(s.onclick=()=>$.show("menu-screen"));const i=document.getElementById("controls-btn-back");i&&(i.onclick=()=>$.show("menu-screen")),window.addEventListener("keydown",o=>this.handleRemapKey(o));const r=document.getElementById("controls-btn-reset");r&&(r.onclick=()=>{this.CTRL_P1=JSON.parse(JSON.stringify(this.defaultP1)),this.CTRL_P2=JSON.parse(JSON.stringify(this.defaultP2)),this.saveControls(),this.renderRemapGrids(),ce("Controles restaurados aos padrões!","success")}),$.register("settings-screen",{onEnter:()=>{const o=localStorage.getItem("kicker_hax_volume")||"80";n&&(n.value=o),e&&(e.textContent=`${o}%`);const l=document.getElementById("settings-replay");l&&(l.checked=localStorage.getItem("kicker_hax_show_replay")!=="false")}}),$.register("controls-screen",{onEnter:()=>{this.renderRemapGrids();const o=document.getElementById("controls-restart-warning");o&&o.classList.add("hidden")}})},loadSettings(){const n=localStorage.getItem("kicker_hax_volume")||"80";pt.setVolume(parseInt(n,10)),this.fieldSize="medium",this.dimensions={w:1024,h:640};try{this.CTRL_P1=JSON.parse(localStorage.getItem("kicker_hax_keys_p1"))||JSON.parse(JSON.stringify(this.defaultP1)),this.CTRL_P2=JSON.parse(localStorage.getItem("kicker_hax_keys_p2"))||JSON.parse(JSON.stringify(this.defaultP2))}catch{this.CTRL_P1=JSON.parse(JSON.stringify(this.defaultP1)),this.CTRL_P2=JSON.parse(JSON.stringify(this.defaultP2))}},saveControls(){localStorage.setItem("kicker_hax_keys_p1",JSON.stringify(this.CTRL_P1)),localStorage.setItem("kicker_hax_keys_p2",JSON.stringify(this.CTRL_P2))},getKeyLabel(n){return n?n==="ShiftLeft"?"Shift Esq.":n==="ShiftRight"?"Shift Dir.":n===" "?"Espaço":n==="arrowup"?"↑":n==="arrowdown"?"↓":n==="arrowleft"?"←":n==="arrowright"?"→":n==="enter"?"Enter":n.toUpperCase():"—"},renderRemapGrids(){const n=document.getElementById("grid-controls-p1");if(!n)return;((t,s,i)=>{t.innerHTML="",this.actions.forEach(r=>{const o=document.createElement("div");o.className="map-label",o.textContent=r.label,t.appendChild(o);const l=i[r.id],c=document.createElement("button");c.className="map-key-btn",c.textContent=this.getKeyLabel(l),c.onclick=()=>this.startRemapping(s,r.id,c),t.appendChild(c)})})(n,1,this.CTRL_P1)},startRemapping(n,e,t){if(this.waitingRemap){const s=this.waitingRemap.btn,i=this.waitingRemap.playerNum===1?this.CTRL_P1[this.waitingRemap.actionId]:this.CTRL_P2[this.waitingRemap.actionId];s.textContent=this.getKeyLabel(i),s.classList.remove("active")}this.waitingRemap={playerNum:n,actionId:e,btn:t},t.textContent="Aguardando tecla...",t.classList.add("active")},handleRemapKey(n){if(!this.waitingRemap)return;n.preventDefault(),n.stopPropagation();const{playerNum:e,actionId:t,btn:s}=this.waitingRemap;if(s.classList.remove("active"),n.key==="Escape"){const h=e===1?this.CTRL_P1[t]:this.CTRL_P2[t];s.textContent=this.getKeyLabel(h),this.waitingRemap=null;return}if(n.key==="Backspace"){e===1?this.CTRL_P1[t]="":this.CTRL_P2[t]="",this.saveControls(),this.renderRemapGrids(),this.waitingRemap=null;return}let i=n.key.toLowerCase();(n.code==="ShiftLeft"||n.code==="ShiftRight"||n.code==="ControlLeft"||n.code==="ControlRight")&&(i=n.code);const r=e===1?this.CTRL_P1:this.CTRL_P2,o=e===1?this.CTRL_P2:this.CTRL_P1;if(Object.values(o).includes(i)&&i){s.classList.add("warn"),s.textContent="Já em uso pelo outro jogador!",setTimeout(()=>{s.classList.remove("warn");const h=e===1?this.CTRL_P1[t]:this.CTRL_P2[t];s.textContent=this.getKeyLabel(h)},1e3),this.waitingRemap=null;return}const c=Object.keys(r).find(h=>r[h]===i);if(c&&c!==t){const h=r[t];r[t]=i,r[c]=h}else r[t]=i;this.saveControls(),this.renderRemapGrids(),this.waitingRemap=null}},Mt=Object.create(null);Mt.open="0";Mt.close="1";Mt.ping="2";Mt.pong="3";Mt.message="4";Mt.upgrade="5";Mt.noop="6";const go=Object.create(null);Object.keys(Mt).forEach(n=>{go[Mt[n]]=n});const _c={type:"error",data:"parser error"},sy=typeof Blob=="function"||typeof Blob<"u"&&Object.prototype.toString.call(Blob)==="[object BlobConstructor]",iy=typeof ArrayBuffer=="function",ry=n=>typeof ArrayBuffer.isView=="function"?ArrayBuffer.isView(n):n&&n.buffer instanceof ArrayBuffer,ou=({type:n,data:e},t,s)=>sy&&e instanceof Blob?t?s(e):ip(e,s):iy&&(e instanceof ArrayBuffer||ry(e))?t?s(e):ip(new Blob([e]),s):s(Mt[n]+(e||"")),ip=(n,e)=>{const t=new FileReader;return t.onload=function(){const s=t.result.split(",")[1];e("b"+(s||""))},t.readAsDataURL(n)};function rp(n){return n instanceof Uint8Array?n:n instanceof ArrayBuffer?new Uint8Array(n):new Uint8Array(n.buffer,n.byteOffset,n.byteLength)}let kl;function tA(n,e){if(sy&&n.data instanceof Blob)return n.data.arrayBuffer().then(rp).then(e);if(iy&&(n.data instanceof ArrayBuffer||ry(n.data)))return e(rp(n.data));ou(n,!1,t=>{kl||(kl=new TextEncoder),e(kl.encode(t))})}const op="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",Oi=typeof Uint8Array>"u"?[]:new Uint8Array(256);for(let n=0;n<op.length;n++)Oi[op.charCodeAt(n)]=n;const nA=n=>{let e=n.length*.75,t=n.length,s,i=0,r,o,l,c;n[n.length-1]==="="&&(e--,n[n.length-2]==="="&&e--);const h=new ArrayBuffer(e),d=new Uint8Array(h);for(s=0;s<t;s+=4)r=Oi[n.charCodeAt(s)],o=Oi[n.charCodeAt(s+1)],l=Oi[n.charCodeAt(s+2)],c=Oi[n.charCodeAt(s+3)],d[i++]=r<<2|o>>4,d[i++]=(o&15)<<4|l>>2,d[i++]=(l&3)<<6|c&63;return h},sA=typeof ArrayBuffer=="function",au=(n,e)=>{if(typeof n!="string")return{type:"message",data:oy(n,e)};const t=n.charAt(0);return t==="b"?{type:"message",data:iA(n.substring(1),e)}:go[t]?n.length>1?{type:go[t],data:n.substring(1)}:{type:go[t]}:_c},iA=(n,e)=>{if(sA){const t=nA(n);return oy(t,e)}else return{base64:!0,data:n}},oy=(n,e)=>{switch(e){case"blob":return n instanceof Blob?n:new Blob([n]);case"arraybuffer":default:return n instanceof ArrayBuffer?n:n.buffer}},ay="",rA=(n,e)=>{const t=n.length,s=new Array(t);let i=0;n.forEach((r,o)=>{ou(r,!1,l=>{s[o]=l,++i===t&&e(s.join(ay))})})},oA=(n,e)=>{const t=n.split(ay),s=[];for(let i=0;i<t.length;i++){const r=au(t[i],e);if(s.push(r),r.type==="error")break}return s};function aA(){return new TransformStream({transform(n,e){tA(n,t=>{const s=t.length;let i;if(s<126)i=new Uint8Array(1),new DataView(i.buffer).setUint8(0,s);else if(s<65536){i=new Uint8Array(3);const r=new DataView(i.buffer);r.setUint8(0,126),r.setUint16(1,s)}else{i=new Uint8Array(9);const r=new DataView(i.buffer);r.setUint8(0,127),r.setBigUint64(1,BigInt(s))}n.data&&typeof n.data!="string"&&(i[0]|=128),e.enqueue(i),e.enqueue(t)})}})}let Pl;function so(n){return n.reduce((e,t)=>e+t.length,0)}function io(n,e){if(n[0].length===e)return n.shift();const t=new Uint8Array(e);let s=0;for(let i=0;i<e;i++)t[i]=n[0][s++],s===n[0].length&&(n.shift(),s=0);return n.length&&s<n[0].length&&(n[0]=n[0].slice(s)),t}function lA(n,e){Pl||(Pl=new TextDecoder);const t=[];let s=0,i=-1,r=!1;return new TransformStream({transform(o,l){for(t.push(o);;){if(s===0){if(so(t)<1)break;const c=io(t,1);r=(c[0]&128)===128,i=c[0]&127,i<126?s=3:i===126?s=1:s=2}else if(s===1){if(so(t)<2)break;const c=io(t,2);i=new DataView(c.buffer,c.byteOffset,c.length).getUint16(0),s=3}else if(s===2){if(so(t)<8)break;const c=io(t,8),h=new DataView(c.buffer,c.byteOffset,c.length),d=h.getUint32(0);if(d>Math.pow(2,21)-1){l.enqueue(_c);break}i=d*Math.pow(2,32)+h.getUint32(4),s=3}else{if(so(t)<i)break;const c=io(t,i);l.enqueue(au(r?c:Pl.decode(c),e)),s=0}if(i===0||i>n){l.enqueue(_c);break}}}})}const ly=4;function Se(n){if(n)return cA(n)}function cA(n){for(var e in Se.prototype)n[e]=Se.prototype[e];return n}Se.prototype.on=Se.prototype.addEventListener=function(n,e){return this._callbacks=this._callbacks||{},(this._callbacks["$"+n]=this._callbacks["$"+n]||[]).push(e),this};Se.prototype.once=function(n,e){function t(){this.off(n,t),e.apply(this,arguments)}return t.fn=e,this.on(n,t),this};Se.prototype.off=Se.prototype.removeListener=Se.prototype.removeAllListeners=Se.prototype.removeEventListener=function(n,e){if(this._callbacks=this._callbacks||{},arguments.length==0)return this._callbacks={},this;var t=this._callbacks["$"+n];if(!t)return this;if(arguments.length==1)return delete this._callbacks["$"+n],this;for(var s,i=0;i<t.length;i++)if(s=t[i],s===e||s.fn===e){t.splice(i,1);break}return t.length===0&&delete this._callbacks["$"+n],this};Se.prototype.emit=function(n){this._callbacks=this._callbacks||{};for(var e=new Array(arguments.length-1),t=this._callbacks["$"+n],s=1;s<arguments.length;s++)e[s-1]=arguments[s];if(t){t=t.slice(0);for(var s=0,i=t.length;s<i;++s)t[s].apply(this,e)}return this};Se.prototype.emitReserved=Se.prototype.emit;Se.prototype.listeners=function(n){return this._callbacks=this._callbacks||{},this._callbacks["$"+n]||[]};Se.prototype.hasListeners=function(n){return!!this.listeners(n).length};const Oa=typeof Promise=="function"&&typeof Promise.resolve=="function"?e=>Promise.resolve().then(e):(e,t)=>t(e,0),mt=typeof self<"u"?self:typeof window<"u"?window:Function("return this")(),hA="arraybuffer";function cy(n,...e){return e.reduce((t,s)=>(n.hasOwnProperty(s)&&(t[s]=n[s]),t),{})}const uA=mt.setTimeout,dA=mt.clearTimeout;function Ma(n,e){e.useNativeTimers?(n.setTimeoutFn=uA.bind(mt),n.clearTimeoutFn=dA.bind(mt)):(n.setTimeoutFn=mt.setTimeout.bind(mt),n.clearTimeoutFn=mt.clearTimeout.bind(mt))}const fA=1.33;function pA(n){return typeof n=="string"?mA(n):Math.ceil((n.byteLength||n.size)*fA)}function mA(n){let e=0,t=0;for(let s=0,i=n.length;s<i;s++)e=n.charCodeAt(s),e<128?t+=1:e<2048?t+=2:e<55296||e>=57344?t+=3:(s++,t+=4);return t}function hy(){return Date.now().toString(36).substring(3)+Math.random().toString(36).substring(2,5)}function gA(n){let e="";for(let t in n)n.hasOwnProperty(t)&&(e.length&&(e+="&"),e+=encodeURIComponent(t)+"="+encodeURIComponent(n[t]));return e}function _A(n){let e={},t=n.split("&");for(let s=0,i=t.length;s<i;s++){let r=t[s].split("=");e[decodeURIComponent(r[0])]=decodeURIComponent(r[1])}return e}class yA extends Error{constructor(e,t,s){super(e),this.description=t,this.context=s,this.type="TransportError"}}class lu extends Se{constructor(e){super(),this.writable=!1,Ma(this,e),this.opts=e,this.query=e.query,this.socket=e.socket,this.supportsBinary=!e.forceBase64}onError(e,t,s){return super.emitReserved("error",new yA(e,t,s)),this}open(){return this.readyState="opening",this.doOpen(),this}close(){return(this.readyState==="opening"||this.readyState==="open")&&(this.doClose(),this.onClose()),this}send(e){this.readyState==="open"&&this.write(e)}onOpen(){this.readyState="open",this.writable=!0,super.emitReserved("open")}onData(e){const t=au(e,this.socket.binaryType);this.onPacket(t)}onPacket(e){super.emitReserved("packet",e)}onClose(e){this.readyState="closed",super.emitReserved("close",e)}pause(e){}createUri(e,t={}){return e+"://"+this._hostname()+this._port()+this.opts.path+this._query(t)}_hostname(){const e=this.opts.hostname;return e.indexOf(":")===-1?e:"["+e+"]"}_port(){return this.opts.port&&(this.opts.secure&&Number(this.opts.port)!==443||!this.opts.secure&&Number(this.opts.port)!==80)?":"+this.opts.port:""}_query(e){const t=gA(e);return t.length?"?"+t:""}}class vA extends lu{constructor(){super(...arguments),this._polling=!1}get name(){return"polling"}doOpen(){this._poll()}pause(e){this.readyState="pausing";const t=()=>{this.readyState="paused",e()};if(this._polling||!this.writable){let s=0;this._polling&&(s++,this.once("pollComplete",function(){--s||t()})),this.writable||(s++,this.once("drain",function(){--s||t()}))}else t()}_poll(){this._polling=!0,this.doPoll(),this.emitReserved("poll")}onData(e){const t=s=>{if(this.readyState==="opening"&&s.type==="open"&&this.onOpen(),s.type==="close")return this.onClose({description:"transport closed by the server"}),!1;this.onPacket(s)};oA(e,this.socket.binaryType).forEach(t),this.readyState!=="closed"&&(this._polling=!1,this.emitReserved("pollComplete"),this.readyState==="open"&&this._poll())}doClose(){const e=()=>{this.write([{type:"close"}])};this.readyState==="open"?e():this.once("open",e)}write(e){this.writable=!1,rA(e,t=>{this.doWrite(t,()=>{this.writable=!0,this.emitReserved("drain")})})}uri(){const e=this.opts.secure?"https":"http",t=this.query||{};return this.opts.timestampRequests!==!1&&(t[this.opts.timestampParam]=hy()),!this.supportsBinary&&!t.sid&&(t.b64=1),this.createUri(e,t)}}let uy=!1;try{uy=typeof XMLHttpRequest<"u"&&"withCredentials"in new XMLHttpRequest}catch{}const EA=uy;function wA(){}class TA extends vA{constructor(e){if(super(e),typeof location<"u"){const t=location.protocol==="https:";let s=location.port;s||(s=t?"443":"80"),this.xd=typeof location<"u"&&e.hostname!==location.hostname||s!==e.port}}doWrite(e,t){const s=this.request({method:"POST",data:e});s.on("success",t),s.on("error",(i,r)=>{this.onError("xhr post error",i,r)})}doPoll(){const e=this.request();e.on("data",this.onData.bind(this)),e.on("error",(t,s)=>{this.onError("xhr poll error",t,s)}),this.pollXhr=e}}let Os=class _o extends Se{constructor(e,t,s){super(),this.createRequest=e,Ma(this,s),this._opts=s,this._method=s.method||"GET",this._uri=t,this._data=s.data!==void 0?s.data:null,this._create()}_create(){var e;const t=cy(this._opts,"agent","pfx","key","passphrase","cert","ca","ciphers","rejectUnauthorized","autoUnref");t.xdomain=!!this._opts.xd;const s=this._xhr=this.createRequest(t);try{s.open(this._method,this._uri,!0);try{if(this._opts.extraHeaders){s.setDisableHeaderCheck&&s.setDisableHeaderCheck(!0);for(let i in this._opts.extraHeaders)this._opts.extraHeaders.hasOwnProperty(i)&&s.setRequestHeader(i,this._opts.extraHeaders[i])}}catch{}if(this._method==="POST")try{s.setRequestHeader("Content-type","text/plain;charset=UTF-8")}catch{}try{s.setRequestHeader("Accept","*/*")}catch{}(e=this._opts.cookieJar)===null||e===void 0||e.addCookies(s),"withCredentials"in s&&(s.withCredentials=this._opts.withCredentials),this._opts.requestTimeout&&(s.timeout=this._opts.requestTimeout),s.onreadystatechange=()=>{var i;s.readyState===3&&((i=this._opts.cookieJar)===null||i===void 0||i.parseCookies(s.getResponseHeader("set-cookie"))),s.readyState===4&&(s.status===200||s.status===1223?this._onLoad():this.setTimeoutFn(()=>{this._onError(typeof s.status=="number"?s.status:0)},0))},s.send(this._data)}catch(i){this.setTimeoutFn(()=>{this._onError(i)},0);return}typeof document<"u"&&(this._index=_o.requestsCount++,_o.requests[this._index]=this)}_onError(e){this.emitReserved("error",e,this._xhr),this._cleanup(!0)}_cleanup(e){if(!(typeof this._xhr>"u"||this._xhr===null)){if(this._xhr.onreadystatechange=wA,e)try{this._xhr.abort()}catch{}typeof document<"u"&&delete _o.requests[this._index],this._xhr=null}}_onLoad(){const e=this._xhr.responseText;e!==null&&(this.emitReserved("data",e),this.emitReserved("success"),this._cleanup())}abort(){this._cleanup()}};Os.requestsCount=0;Os.requests={};if(typeof document<"u"){if(typeof attachEvent=="function")attachEvent("onunload",ap);else if(typeof addEventListener=="function"){const n="onpagehide"in mt?"pagehide":"unload";addEventListener(n,ap,!1)}}function ap(){for(let n in Os.requests)Os.requests.hasOwnProperty(n)&&Os.requests[n].abort()}const IA=function(){const n=dy({xdomain:!1});return n&&n.responseType!==null}();class CA extends TA{constructor(e){super(e);const t=e&&e.forceBase64;this.supportsBinary=IA&&!t}request(e={}){return Object.assign(e,{xd:this.xd},this.opts),new Os(dy,this.uri(),e)}}function dy(n){const e=n.xdomain;try{if(typeof XMLHttpRequest<"u"&&(!e||EA))return new XMLHttpRequest}catch{}if(!e)try{return new mt[["Active"].concat("Object").join("X")]("Microsoft.XMLHTTP")}catch{}}const fy=typeof navigator<"u"&&typeof navigator.product=="string"&&navigator.product.toLowerCase()==="reactnative";class bA extends lu{get name(){return"websocket"}doOpen(){const e=this.uri(),t=this.opts.protocols,s=fy?{}:cy(this.opts,"agent","perMessageDeflate","pfx","key","passphrase","cert","ca","ciphers","rejectUnauthorized","localAddress","protocolVersion","origin","maxPayload","family","checkServerIdentity");this.opts.extraHeaders&&(s.headers=this.opts.extraHeaders);try{this.ws=this.createSocket(e,t,s)}catch(i){return this.emitReserved("error",i)}this.ws.binaryType=this.socket.binaryType,this.addEventListeners()}addEventListeners(){this.ws.onopen=()=>{this.opts.autoUnref&&this.ws._socket.unref(),this.onOpen()},this.ws.onclose=e=>this.onClose({description:"websocket connection closed",context:e}),this.ws.onmessage=e=>this.onData(e.data),this.ws.onerror=e=>this.onError("websocket error",e)}write(e){this.writable=!1;for(let t=0;t<e.length;t++){const s=e[t],i=t===e.length-1;ou(s,this.supportsBinary,r=>{try{this.doWrite(s,r)}catch{}i&&Oa(()=>{this.writable=!0,this.emitReserved("drain")},this.setTimeoutFn)})}}doClose(){typeof this.ws<"u"&&(this.ws.onerror=()=>{},this.ws.close(),this.ws=null)}uri(){const e=this.opts.secure?"wss":"ws",t=this.query||{};return this.opts.timestampRequests&&(t[this.opts.timestampParam]=hy()),this.supportsBinary||(t.b64=1),this.createUri(e,t)}}const Nl=mt.WebSocket||mt.MozWebSocket;class RA extends bA{createSocket(e,t,s){return fy?new Nl(e,t,s):t?new Nl(e,t):new Nl(e)}doWrite(e,t){this.ws.send(t)}}class SA extends lu{get name(){return"webtransport"}doOpen(){try{this._transport=new WebTransport(this.createUri("https"),this.opts.transportOptions[this.name])}catch(e){return this.emitReserved("error",e)}this._transport.closed.then(()=>{this.onClose()}).catch(e=>{this.onError("webtransport error",e)}),this._transport.ready.then(()=>{this._transport.createBidirectionalStream().then(e=>{const t=lA(Number.MAX_SAFE_INTEGER,this.socket.binaryType),s=e.readable.pipeThrough(t).getReader(),i=aA();i.readable.pipeTo(e.writable),this._writer=i.writable.getWriter();const r=()=>{s.read().then(({done:l,value:c})=>{l||(this.onPacket(c),r())}).catch(l=>{})};r();const o={type:"open"};this.query.sid&&(o.data=`{"sid":"${this.query.sid}"}`),this._writer.write(o).then(()=>this.onOpen())})})}write(e){this.writable=!1;for(let t=0;t<e.length;t++){const s=e[t],i=t===e.length-1;this._writer.write(s).then(()=>{i&&Oa(()=>{this.writable=!0,this.emitReserved("drain")},this.setTimeoutFn)})}}doClose(){var e;(e=this._transport)===null||e===void 0||e.close()}}const AA={websocket:RA,webtransport:SA,polling:CA},kA=/^(?:(?![^:@\/?#]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@\/?#]*)(?::([^:@\/?#]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/,PA=["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"];function yc(n){if(n.length>8e3)throw"URI too long";const e=n,t=n.indexOf("["),s=n.indexOf("]");t!=-1&&s!=-1&&(n=n.substring(0,t)+n.substring(t,s).replace(/:/g,";")+n.substring(s,n.length));let i=kA.exec(n||""),r={},o=14;for(;o--;)r[PA[o]]=i[o]||"";return t!=-1&&s!=-1&&(r.source=e,r.host=r.host.substring(1,r.host.length-1).replace(/;/g,":"),r.authority=r.authority.replace("[","").replace("]","").replace(/;/g,":"),r.ipv6uri=!0),r.pathNames=NA(r,r.path),r.queryKey=DA(r,r.query),r}function NA(n,e){const t=/\/{2,9}/g,s=e.replace(t,"/").split("/");return(e.slice(0,1)=="/"||e.length===0)&&s.splice(0,1),e.slice(-1)=="/"&&s.splice(s.length-1,1),s}function DA(n,e){const t={};return e.replace(/(?:^|&)([^&=]*)=?([^&]*)/g,function(s,i,r){i&&(t[i]=r)}),t}const vc=typeof addEventListener=="function"&&typeof removeEventListener=="function",yo=[];vc&&addEventListener("offline",()=>{yo.forEach(n=>n())},!1);class kn extends Se{constructor(e,t){if(super(),this.binaryType=hA,this.writeBuffer=[],this._prevBufferLen=0,this._pingInterval=-1,this._pingTimeout=-1,this._maxPayload=-1,this._pingTimeoutTime=1/0,e&&typeof e=="object"&&(t=e,e=null),e){const s=yc(e);t.hostname=s.host,t.secure=s.protocol==="https"||s.protocol==="wss",t.port=s.port,s.query&&(t.query=s.query)}else t.host&&(t.hostname=yc(t.host).host);Ma(this,t),this.secure=t.secure!=null?t.secure:typeof location<"u"&&location.protocol==="https:",t.hostname&&!t.port&&(t.port=this.secure?"443":"80"),this.hostname=t.hostname||(typeof location<"u"?location.hostname:"localhost"),this.port=t.port||(typeof location<"u"&&location.port?location.port:this.secure?"443":"80"),this.transports=[],this._transportsByName={},t.transports.forEach(s=>{const i=s.prototype.name;this.transports.push(i),this._transportsByName[i]=s}),this.opts=Object.assign({path:"/engine.io",agent:!1,withCredentials:!1,upgrade:!0,timestampParam:"t",rememberUpgrade:!1,addTrailingSlash:!0,rejectUnauthorized:!0,perMessageDeflate:{threshold:1024},transportOptions:{},closeOnBeforeunload:!1},t),this.opts.path=this.opts.path.replace(/\/$/,"")+(this.opts.addTrailingSlash?"/":""),typeof this.opts.query=="string"&&(this.opts.query=_A(this.opts.query)),vc&&(this.opts.closeOnBeforeunload&&(this._beforeunloadEventListener=()=>{this.transport&&(this.transport.removeAllListeners(),this.transport.close())},addEventListener("beforeunload",this._beforeunloadEventListener,!1)),this.hostname!=="localhost"&&(this._offlineEventListener=()=>{this._onClose("transport close",{description:"network connection lost"})},yo.push(this._offlineEventListener))),this.opts.withCredentials&&(this._cookieJar=void 0),this._open()}createTransport(e){const t=Object.assign({},this.opts.query);t.EIO=ly,t.transport=e,this.id&&(t.sid=this.id);const s=Object.assign({},this.opts,{query:t,socket:this,hostname:this.hostname,secure:this.secure,port:this.port},this.opts.transportOptions[e]);return new this._transportsByName[e](s)}_open(){if(this.transports.length===0){this.setTimeoutFn(()=>{this.emitReserved("error","No transports available")},0);return}const e=this.opts.rememberUpgrade&&kn.priorWebsocketSuccess&&this.transports.indexOf("websocket")!==-1?"websocket":this.transports[0];this.readyState="opening";const t=this.createTransport(e);t.open(),this.setTransport(t)}setTransport(e){this.transport&&this.transport.removeAllListeners(),this.transport=e,e.on("drain",this._onDrain.bind(this)).on("packet",this._onPacket.bind(this)).on("error",this._onError.bind(this)).on("close",t=>this._onClose("transport close",t))}onOpen(){this.readyState="open",kn.priorWebsocketSuccess=this.transport.name==="websocket",this.emitReserved("open"),this.flush()}_onPacket(e){if(this.readyState==="opening"||this.readyState==="open"||this.readyState==="closing")switch(this.emitReserved("packet",e),this.emitReserved("heartbeat"),e.type){case"open":this.onHandshake(JSON.parse(e.data));break;case"ping":this._sendPacket("pong"),this.emitReserved("ping"),this.emitReserved("pong"),this._resetPingTimeout();break;case"error":const t=new Error("server error");t.code=e.data,this._onError(t);break;case"message":this.emitReserved("data",e.data),this.emitReserved("message",e.data);break}}onHandshake(e){this.emitReserved("handshake",e),this.id=e.sid,this.transport.query.sid=e.sid,this._pingInterval=e.pingInterval,this._pingTimeout=e.pingTimeout,this._maxPayload=e.maxPayload,this.onOpen(),this.readyState!=="closed"&&this._resetPingTimeout()}_resetPingTimeout(){this.clearTimeoutFn(this._pingTimeoutTimer);const e=this._pingInterval+this._pingTimeout;this._pingTimeoutTime=Date.now()+e,this._pingTimeoutTimer=this.setTimeoutFn(()=>{this._onClose("ping timeout")},e),this.opts.autoUnref&&this._pingTimeoutTimer.unref()}_onDrain(){this.writeBuffer.splice(0,this._prevBufferLen),this._prevBufferLen=0,this.writeBuffer.length===0?this.emitReserved("drain"):this.flush()}flush(){if(this.readyState!=="closed"&&this.transport.writable&&!this.upgrading&&this.writeBuffer.length){const e=this._getWritablePackets();this.transport.send(e),this._prevBufferLen=e.length,this.emitReserved("flush")}}_getWritablePackets(){if(!(this._maxPayload&&this.transport.name==="polling"&&this.writeBuffer.length>1))return this.writeBuffer;let t=1;for(let s=0;s<this.writeBuffer.length;s++){const i=this.writeBuffer[s].data;if(i&&(t+=pA(i)),s>0&&t>this._maxPayload)return this.writeBuffer.slice(0,s);t+=2}return this.writeBuffer}_hasPingExpired(){if(!this._pingTimeoutTime)return!0;const e=Date.now()>this._pingTimeoutTime;return e&&(this._pingTimeoutTime=0,Oa(()=>{this._onClose("ping timeout")},this.setTimeoutFn)),e}write(e,t,s){return this._sendPacket("message",e,t,s),this}send(e,t,s){return this._sendPacket("message",e,t,s),this}_sendPacket(e,t,s,i){if(typeof t=="function"&&(i=t,t=void 0),typeof s=="function"&&(i=s,s=null),this.readyState==="closing"||this.readyState==="closed")return;s=s||{},s.compress=s.compress!==!1;const r={type:e,data:t,options:s};this.emitReserved("packetCreate",r),this.writeBuffer.push(r),i&&this.once("flush",i),this.flush()}close(){const e=()=>{this._onClose("forced close"),this.transport.close()},t=()=>{this.off("upgrade",t),this.off("upgradeError",t),e()},s=()=>{this.once("upgrade",t),this.once("upgradeError",t)};return(this.readyState==="opening"||this.readyState==="open")&&(this.readyState="closing",this.writeBuffer.length?this.once("drain",()=>{this.upgrading?s():e()}):this.upgrading?s():e()),this}_onError(e){if(kn.priorWebsocketSuccess=!1,this.opts.tryAllTransports&&this.transports.length>1&&this.readyState==="opening")return this.transports.shift(),this._open();this.emitReserved("error",e),this._onClose("transport error",e)}_onClose(e,t){if(this.readyState==="opening"||this.readyState==="open"||this.readyState==="closing"){if(this.clearTimeoutFn(this._pingTimeoutTimer),this.transport.removeAllListeners("close"),this.transport.close(),this.transport.removeAllListeners(),vc&&(this._beforeunloadEventListener&&removeEventListener("beforeunload",this._beforeunloadEventListener,!1),this._offlineEventListener)){const s=yo.indexOf(this._offlineEventListener);s!==-1&&yo.splice(s,1)}this.readyState="closed",this.id=null,this.emitReserved("close",e,t),this.writeBuffer=[],this._prevBufferLen=0}}}kn.protocol=ly;class LA extends kn{constructor(){super(...arguments),this._upgrades=[]}onOpen(){if(super.onOpen(),this.readyState==="open"&&this.opts.upgrade)for(let e=0;e<this._upgrades.length;e++)this._probe(this._upgrades[e])}_probe(e){let t=this.createTransport(e),s=!1;kn.priorWebsocketSuccess=!1;const i=()=>{s||(t.send([{type:"ping",data:"probe"}]),t.once("packet",p=>{if(!s)if(p.type==="pong"&&p.data==="probe"){if(this.upgrading=!0,this.emitReserved("upgrading",t),!t)return;kn.priorWebsocketSuccess=t.name==="websocket",this.transport.pause(()=>{s||this.readyState!=="closed"&&(d(),this.setTransport(t),t.send([{type:"upgrade"}]),this.emitReserved("upgrade",t),t=null,this.upgrading=!1,this.flush())})}else{const m=new Error("probe error");m.transport=t.name,this.emitReserved("upgradeError",m)}}))};function r(){s||(s=!0,d(),t.close(),t=null)}const o=p=>{const m=new Error("probe error: "+p);m.transport=t.name,r(),this.emitReserved("upgradeError",m)};function l(){o("transport closed")}function c(){o("socket closed")}function h(p){t&&p.name!==t.name&&r()}const d=()=>{t.removeListener("open",i),t.removeListener("error",o),t.removeListener("close",l),this.off("close",c),this.off("upgrading",h)};t.once("open",i),t.once("error",o),t.once("close",l),this.once("close",c),this.once("upgrading",h),this._upgrades.indexOf("webtransport")!==-1&&e!=="webtransport"?this.setTimeoutFn(()=>{s||t.open()},200):t.open()}onHandshake(e){this._upgrades=this._filterUpgrades(e.upgrades),super.onHandshake(e)}_filterUpgrades(e){const t=[];for(let s=0;s<e.length;s++)~this.transports.indexOf(e[s])&&t.push(e[s]);return t}}let xA=class extends LA{constructor(e,t={}){const s=typeof e=="object",i=s?{...e}:{...t};(!i.transports||i.transports&&typeof i.transports[0]=="string")&&(i.transports=(i.transports||["polling","websocket","webtransport"]).map(r=>AA[r]).filter(r=>!!r)),super(s?i:e,i)}};function OA(n,e="",t){let s=n;t=t||typeof location<"u"&&location,n==null&&(n=t.protocol+"//"+t.host),typeof n=="string"&&(n.charAt(0)==="/"&&(n.charAt(1)==="/"?n=t.protocol+n:n=t.host+n),/^(https?|wss?):\/\//.test(n)||(typeof t<"u"?n=t.protocol+"//"+n:n="https://"+n),s=yc(n)),s.port||(/^(http|ws)$/.test(s.protocol)?s.port="80":/^(http|ws)s$/.test(s.protocol)&&(s.port="443")),s.path=s.path||"/";const r=s.host.indexOf(":")!==-1?"["+s.host+"]":s.host;return s.id=s.protocol+"://"+r+":"+s.port+e,s.href=s.protocol+"://"+r+(t&&t.port===s.port?"":":"+s.port),s}const MA=typeof ArrayBuffer=="function",VA=n=>typeof ArrayBuffer.isView=="function"?ArrayBuffer.isView(n):n.buffer instanceof ArrayBuffer,py=Object.prototype.toString,FA=typeof Blob=="function"||typeof Blob<"u"&&py.call(Blob)==="[object BlobConstructor]",BA=typeof File=="function"||typeof File<"u"&&py.call(File)==="[object FileConstructor]";function cu(n){return MA&&(n instanceof ArrayBuffer||VA(n))||FA&&n instanceof Blob||BA&&n instanceof File}function vo(n,e){if(!n||typeof n!="object")return!1;if(Array.isArray(n)){for(let t=0,s=n.length;t<s;t++)if(vo(n[t]))return!0;return!1}if(cu(n))return!0;if(n.toJSON&&typeof n.toJSON=="function"&&arguments.length===1)return vo(n.toJSON(),!0);for(const t in n)if(Object.prototype.hasOwnProperty.call(n,t)&&vo(n[t]))return!0;return!1}function UA(n){const e=[],t=n.data,s=n;return s.data=Ec(t,e),s.attachments=e.length,{packet:s,buffers:e}}function Ec(n,e){if(!n)return n;if(cu(n)){const t={_placeholder:!0,num:e.length};return e.push(n),t}else if(Array.isArray(n)){const t=new Array(n.length);for(let s=0;s<n.length;s++)t[s]=Ec(n[s],e);return t}else if(typeof n=="object"&&!(n instanceof Date)){const t={};for(const s in n)Object.prototype.hasOwnProperty.call(n,s)&&(t[s]=Ec(n[s],e));return t}return n}function qA(n,e){return n.data=wc(n.data,e),delete n.attachments,n}function wc(n,e){if(!n)return n;if(n&&n._placeholder===!0){if(typeof n.num=="number"&&n.num>=0&&n.num<e.length)return e[n.num];throw new Error("illegal attachments")}else if(Array.isArray(n))for(let t=0;t<n.length;t++)n[t]=wc(n[t],e);else if(typeof n=="object")for(const t in n)Object.prototype.hasOwnProperty.call(n,t)&&(n[t]=wc(n[t],e));return n}const WA=["connect","connect_error","disconnect","disconnecting","newListener","removeListener"];var se;(function(n){n[n.CONNECT=0]="CONNECT",n[n.DISCONNECT=1]="DISCONNECT",n[n.EVENT=2]="EVENT",n[n.ACK=3]="ACK",n[n.CONNECT_ERROR=4]="CONNECT_ERROR",n[n.BINARY_EVENT=5]="BINARY_EVENT",n[n.BINARY_ACK=6]="BINARY_ACK"})(se||(se={}));class $A{constructor(e){this.replacer=e}encode(e){return(e.type===se.EVENT||e.type===se.ACK)&&vo(e)?this.encodeAsBinary({type:e.type===se.EVENT?se.BINARY_EVENT:se.BINARY_ACK,nsp:e.nsp,data:e.data,id:e.id}):[this.encodeAsString(e)]}encodeAsString(e){let t=""+e.type;return(e.type===se.BINARY_EVENT||e.type===se.BINARY_ACK)&&(t+=e.attachments+"-"),e.nsp&&e.nsp!=="/"&&(t+=e.nsp+","),e.id!=null&&(t+=e.id),e.data!=null&&(t+=JSON.stringify(e.data,this.replacer)),t}encodeAsBinary(e){const t=UA(e),s=this.encodeAsString(t.packet),i=t.buffers;return i.unshift(s),i}}class hu extends Se{constructor(e){super(),this.opts=Object.assign({reviver:void 0,maxAttachments:10},typeof e=="function"?{reviver:e}:e)}add(e){let t;if(typeof e=="string"){if(this.reconstructor)throw new Error("got plaintext data when reconstructing a packet");t=this.decodeString(e);const s=t.type===se.BINARY_EVENT;s||t.type===se.BINARY_ACK?(t.type=s?se.EVENT:se.ACK,this.reconstructor=new jA(t),t.attachments===0&&super.emitReserved("decoded",t)):super.emitReserved("decoded",t)}else if(cu(e)||e.base64)if(this.reconstructor)t=this.reconstructor.takeBinaryData(e),t&&(this.reconstructor=null,super.emitReserved("decoded",t));else throw new Error("got binary data when not reconstructing a packet");else throw new Error("Unknown type: "+e)}decodeString(e){let t=0;const s={type:Number(e.charAt(0))};if(se[s.type]===void 0)throw new Error("unknown packet type "+s.type);if(s.type===se.BINARY_EVENT||s.type===se.BINARY_ACK){const r=t+1;for(;e.charAt(++t)!=="-"&&t!=e.length;);const o=e.substring(r,t);if(o!=Number(o)||e.charAt(t)!=="-")throw new Error("Illegal attachments");const l=Number(o);if(!zA(l)||l<0)throw new Error("Illegal attachments");if(l>this.opts.maxAttachments)throw new Error("too many attachments");s.attachments=l}if(e.charAt(t+1)==="/"){const r=t+1;for(;++t&&!(e.charAt(t)===","||t===e.length););s.nsp=e.substring(r,t)}else s.nsp="/";const i=e.charAt(t+1);if(i!==""&&Number(i)==i){const r=t+1;for(;++t;){const o=e.charAt(t);if(o==null||Number(o)!=o){--t;break}if(t===e.length)break}s.id=Number(e.substring(r,t+1))}if(e.charAt(++t)){const r=this.tryParse(e.substr(t));if(hu.isPayloadValid(s.type,r))s.data=r;else throw new Error("invalid payload")}return s}tryParse(e){try{return JSON.parse(e,this.opts.reviver)}catch{return!1}}static isPayloadValid(e,t){switch(e){case se.CONNECT:return lp(t);case se.DISCONNECT:return t===void 0;case se.CONNECT_ERROR:return typeof t=="string"||lp(t);case se.EVENT:case se.BINARY_EVENT:return Array.isArray(t)&&(typeof t[0]=="number"||typeof t[0]=="string"&&WA.indexOf(t[0])===-1);case se.ACK:case se.BINARY_ACK:return Array.isArray(t)}}destroy(){this.reconstructor&&(this.reconstructor.finishedReconstruction(),this.reconstructor=null)}}class jA{constructor(e){this.packet=e,this.buffers=[],this.reconPack=e}takeBinaryData(e){if(this.buffers.push(e),this.buffers.length===this.reconPack.attachments){const t=qA(this.reconPack,this.buffers);return this.finishedReconstruction(),t}return null}finishedReconstruction(){this.reconPack=null,this.buffers=[]}}const zA=Number.isInteger||function(n){return typeof n=="number"&&isFinite(n)&&Math.floor(n)===n};function lp(n){return Object.prototype.toString.call(n)==="[object Object]"}const GA=Object.freeze(Object.defineProperty({__proto__:null,Decoder:hu,Encoder:$A,get PacketType(){return se}},Symbol.toStringTag,{value:"Module"}));function It(n,e,t){return n.on(e,t),function(){n.off(e,t)}}const HA=Object.freeze({connect:1,connect_error:1,disconnect:1,disconnecting:1,newListener:1,removeListener:1});class my extends Se{constructor(e,t,s){super(),this.connected=!1,this.recovered=!1,this.receiveBuffer=[],this.sendBuffer=[],this._queue=[],this._queueSeq=0,this.ids=0,this.acks={},this.flags={},this.io=e,this.nsp=t,s&&s.auth&&(this.auth=s.auth),this._opts=Object.assign({},s),this.io._autoConnect&&this.open()}get disconnected(){return!this.connected}subEvents(){if(this.subs)return;const e=this.io;this.subs=[It(e,"open",this.onopen.bind(this)),It(e,"packet",this.onpacket.bind(this)),It(e,"error",this.onerror.bind(this)),It(e,"close",this.onclose.bind(this))]}get active(){return!!this.subs}connect(){return this.connected?this:(this.subEvents(),this.io._reconnecting||this.io.open(),this.io._readyState==="open"&&this.onopen(),this)}open(){return this.connect()}send(...e){return e.unshift("message"),this.emit.apply(this,e),this}emit(e,...t){var s,i,r;if(HA.hasOwnProperty(e))throw new Error('"'+e.toString()+'" is a reserved event name');if(t.unshift(e),this._opts.retries&&!this.flags.fromQueue&&!this.flags.volatile)return this._addToQueue(t),this;const o={type:se.EVENT,data:t};if(o.options={},o.options.compress=this.flags.compress!==!1,typeof t[t.length-1]=="function"){const d=this.ids++,p=t.pop();this._registerAckCallback(d,p),o.id=d}const l=(i=(s=this.io.engine)===null||s===void 0?void 0:s.transport)===null||i===void 0?void 0:i.writable,c=this.connected&&!(!((r=this.io.engine)===null||r===void 0)&&r._hasPingExpired());return this.flags.volatile&&!l||(c?(this.notifyOutgoingListeners(o),this.packet(o)):this.sendBuffer.push(o)),this.flags={},this}_registerAckCallback(e,t){var s;const i=(s=this.flags.timeout)!==null&&s!==void 0?s:this._opts.ackTimeout;if(i===void 0){this.acks[e]=t;return}const r=this.io.setTimeoutFn(()=>{delete this.acks[e];for(let l=0;l<this.sendBuffer.length;l++)this.sendBuffer[l].id===e&&this.sendBuffer.splice(l,1);t.call(this,new Error("operation has timed out"))},i),o=(...l)=>{this.io.clearTimeoutFn(r),t.apply(this,l)};o.withError=!0,this.acks[e]=o}emitWithAck(e,...t){return new Promise((s,i)=>{const r=(o,l)=>o?i(o):s(l);r.withError=!0,t.push(r),this.emit(e,...t)})}_addToQueue(e){let t;typeof e[e.length-1]=="function"&&(t=e.pop());const s={id:this._queueSeq++,tryCount:0,pending:!1,args:e,flags:Object.assign({fromQueue:!0},this.flags)};e.push((i,...r)=>(this._queue[0],i!==null?s.tryCount>this._opts.retries&&(this._queue.shift(),t&&t(i)):(this._queue.shift(),t&&t(null,...r)),s.pending=!1,this._drainQueue())),this._queue.push(s),this._drainQueue()}_drainQueue(e=!1){if(!this.connected||this._queue.length===0)return;const t=this._queue[0];t.pending&&!e||(t.pending=!0,t.tryCount++,this.flags=t.flags,this.emit.apply(this,t.args))}packet(e){e.nsp=this.nsp,this.io._packet(e)}onopen(){typeof this.auth=="function"?this.auth(e=>{this._sendConnectPacket(e)}):this._sendConnectPacket(this.auth)}_sendConnectPacket(e){this.packet({type:se.CONNECT,data:this._pid?Object.assign({pid:this._pid,offset:this._lastOffset},e):e})}onerror(e){this.connected||this.emitReserved("connect_error",e)}onclose(e,t){this.connected=!1,delete this.id,this.emitReserved("disconnect",e,t),this._clearAcks()}_clearAcks(){Object.keys(this.acks).forEach(e=>{if(!this.sendBuffer.some(s=>String(s.id)===e)){const s=this.acks[e];delete this.acks[e],s.withError&&s.call(this,new Error("socket has been disconnected"))}})}onpacket(e){if(e.nsp===this.nsp)switch(e.type){case se.CONNECT:e.data&&e.data.sid?this.onconnect(e.data.sid,e.data.pid):this.emitReserved("connect_error",new Error("It seems you are trying to reach a Socket.IO server in v2.x with a v3.x client, but they are not compatible (more information here: https://socket.io/docs/v3/migrating-from-2-x-to-3-0/)"));break;case se.EVENT:case se.BINARY_EVENT:this.onevent(e);break;case se.ACK:case se.BINARY_ACK:this.onack(e);break;case se.DISCONNECT:this.ondisconnect();break;case se.CONNECT_ERROR:this.destroy();const s=new Error(e.data.message);s.data=e.data.data,this.emitReserved("connect_error",s);break}}onevent(e){const t=e.data||[];e.id!=null&&t.push(this.ack(e.id)),this.connected?this.emitEvent(t):this.receiveBuffer.push(Object.freeze(t))}emitEvent(e){if(this._anyListeners&&this._anyListeners.length){const t=this._anyListeners.slice();for(const s of t)s.apply(this,e)}super.emit.apply(this,e),this._pid&&e.length&&typeof e[e.length-1]=="string"&&(this._lastOffset=e[e.length-1])}ack(e){const t=this;let s=!1;return function(...i){s||(s=!0,t.packet({type:se.ACK,id:e,data:i}))}}onack(e){const t=this.acks[e.id];typeof t=="function"&&(delete this.acks[e.id],t.withError&&e.data.unshift(null),t.apply(this,e.data))}onconnect(e,t){this.id=e,this.recovered=t&&this._pid===t,this._pid=t,this.connected=!0,this.emitBuffered(),this._drainQueue(!0),this.emitReserved("connect")}emitBuffered(){this.receiveBuffer.forEach(e=>this.emitEvent(e)),this.receiveBuffer=[],this.sendBuffer.forEach(e=>{this.notifyOutgoingListeners(e),this.packet(e)}),this.sendBuffer=[]}ondisconnect(){this.destroy(),this.onclose("io server disconnect")}destroy(){this.subs&&(this.subs.forEach(e=>e()),this.subs=void 0),this.io._destroy(this)}disconnect(){return this.connected&&this.packet({type:se.DISCONNECT}),this.destroy(),this.connected&&this.onclose("io client disconnect"),this}close(){return this.disconnect()}compress(e){return this.flags.compress=e,this}get volatile(){return this.flags.volatile=!0,this}timeout(e){return this.flags.timeout=e,this}onAny(e){return this._anyListeners=this._anyListeners||[],this._anyListeners.push(e),this}prependAny(e){return this._anyListeners=this._anyListeners||[],this._anyListeners.unshift(e),this}offAny(e){if(!this._anyListeners)return this;if(e){const t=this._anyListeners;for(let s=0;s<t.length;s++)if(e===t[s])return t.splice(s,1),this}else this._anyListeners=[];return this}listenersAny(){return this._anyListeners||[]}onAnyOutgoing(e){return this._anyOutgoingListeners=this._anyOutgoingListeners||[],this._anyOutgoingListeners.push(e),this}prependAnyOutgoing(e){return this._anyOutgoingListeners=this._anyOutgoingListeners||[],this._anyOutgoingListeners.unshift(e),this}offAnyOutgoing(e){if(!this._anyOutgoingListeners)return this;if(e){const t=this._anyOutgoingListeners;for(let s=0;s<t.length;s++)if(e===t[s])return t.splice(s,1),this}else this._anyOutgoingListeners=[];return this}listenersAnyOutgoing(){return this._anyOutgoingListeners||[]}notifyOutgoingListeners(e){if(this._anyOutgoingListeners&&this._anyOutgoingListeners.length){const t=this._anyOutgoingListeners.slice();for(const s of t)s.apply(this,e.data)}}}function oi(n){n=n||{},this.ms=n.min||100,this.max=n.max||1e4,this.factor=n.factor||2,this.jitter=n.jitter>0&&n.jitter<=1?n.jitter:0,this.attempts=0}oi.prototype.duration=function(){var n=this.ms*Math.pow(this.factor,this.attempts++);if(this.jitter){var e=Math.random(),t=Math.floor(e*this.jitter*n);n=Math.floor(e*10)&1?n+t:n-t}return Math.min(n,this.max)|0};oi.prototype.reset=function(){this.attempts=0};oi.prototype.setMin=function(n){this.ms=n};oi.prototype.setMax=function(n){this.max=n};oi.prototype.setJitter=function(n){this.jitter=n};class Tc extends Se{constructor(e,t){var s;super(),this.nsps={},this.subs=[],e&&typeof e=="object"&&(t=e,e=void 0),t=t||{},t.path=t.path||"/socket.io",this.opts=t,Ma(this,t),this.reconnection(t.reconnection!==!1),this.reconnectionAttempts(t.reconnectionAttempts||1/0),this.reconnectionDelay(t.reconnectionDelay||1e3),this.reconnectionDelayMax(t.reconnectionDelayMax||5e3),this.randomizationFactor((s=t.randomizationFactor)!==null&&s!==void 0?s:.5),this.backoff=new oi({min:this.reconnectionDelay(),max:this.reconnectionDelayMax(),jitter:this.randomizationFactor()}),this.timeout(t.timeout==null?2e4:t.timeout),this._readyState="closed",this.uri=e;const i=t.parser||GA;this.encoder=new i.Encoder,this.decoder=new i.Decoder,this._autoConnect=t.autoConnect!==!1,this._autoConnect&&this.open()}reconnection(e){return arguments.length?(this._reconnection=!!e,e||(this.skipReconnect=!0),this):this._reconnection}reconnectionAttempts(e){return e===void 0?this._reconnectionAttempts:(this._reconnectionAttempts=e,this)}reconnectionDelay(e){var t;return e===void 0?this._reconnectionDelay:(this._reconnectionDelay=e,(t=this.backoff)===null||t===void 0||t.setMin(e),this)}randomizationFactor(e){var t;return e===void 0?this._randomizationFactor:(this._randomizationFactor=e,(t=this.backoff)===null||t===void 0||t.setJitter(e),this)}reconnectionDelayMax(e){var t;return e===void 0?this._reconnectionDelayMax:(this._reconnectionDelayMax=e,(t=this.backoff)===null||t===void 0||t.setMax(e),this)}timeout(e){return arguments.length?(this._timeout=e,this):this._timeout}maybeReconnectOnOpen(){!this._reconnecting&&this._reconnection&&this.backoff.attempts===0&&this.reconnect()}open(e){if(~this._readyState.indexOf("open"))return this;this.engine=new xA(this.uri,this.opts);const t=this.engine,s=this;this._readyState="opening",this.skipReconnect=!1;const i=It(t,"open",function(){s.onopen(),e&&e()}),r=l=>{this.cleanup(),this._readyState="closed",this.emitReserved("error",l),e?e(l):this.maybeReconnectOnOpen()},o=It(t,"error",r);if(this._timeout!==!1){const l=this._timeout,c=this.setTimeoutFn(()=>{i(),r(new Error("timeout")),t.close()},l);this.opts.autoUnref&&c.unref(),this.subs.push(()=>{this.clearTimeoutFn(c)})}return this.subs.push(i),this.subs.push(o),this}connect(e){return this.open(e)}onopen(){this.cleanup(),this._readyState="open",this.emitReserved("open");const e=this.engine;this.subs.push(It(e,"ping",this.onping.bind(this)),It(e,"data",this.ondata.bind(this)),It(e,"error",this.onerror.bind(this)),It(e,"close",this.onclose.bind(this)),It(this.decoder,"decoded",this.ondecoded.bind(this)))}onping(){this.emitReserved("ping")}ondata(e){try{this.decoder.add(e)}catch(t){this.onclose("parse error",t)}}ondecoded(e){Oa(()=>{this.emitReserved("packet",e)},this.setTimeoutFn)}onerror(e){this.emitReserved("error",e)}socket(e,t){let s=this.nsps[e];return s?this._autoConnect&&!s.active&&s.connect():(s=new my(this,e,t),this.nsps[e]=s),s}_destroy(e){const t=Object.keys(this.nsps);for(const s of t)if(this.nsps[s].active)return;this._close()}_packet(e){const t=this.encoder.encode(e);for(let s=0;s<t.length;s++)this.engine.write(t[s],e.options)}cleanup(){this.subs.forEach(e=>e()),this.subs.length=0,this.decoder.destroy()}_close(){this.skipReconnect=!0,this._reconnecting=!1,this.onclose("forced close")}disconnect(){return this._close()}onclose(e,t){var s;this.cleanup(),(s=this.engine)===null||s===void 0||s.close(),this.backoff.reset(),this._readyState="closed",this.emitReserved("close",e,t),this._reconnection&&!this.skipReconnect&&this.reconnect()}reconnect(){if(this._reconnecting||this.skipReconnect)return this;const e=this;if(this.backoff.attempts>=this._reconnectionAttempts)this.backoff.reset(),this.emitReserved("reconnect_failed"),this._reconnecting=!1;else{const t=this.backoff.duration();this._reconnecting=!0;const s=this.setTimeoutFn(()=>{e.skipReconnect||(this.emitReserved("reconnect_attempt",e.backoff.attempts),!e.skipReconnect&&e.open(i=>{i?(e._reconnecting=!1,e.reconnect(),this.emitReserved("reconnect_error",i)):e.onreconnect()}))},t);this.opts.autoUnref&&s.unref(),this.subs.push(()=>{this.clearTimeoutFn(s)})}}onreconnect(){const e=this.backoff.attempts;this._reconnecting=!1,this.backoff.reset(),this.emitReserved("reconnect",e)}}const Ni={};function Eo(n,e){typeof n=="object"&&(e=n,n=void 0),e=e||{};const t=OA(n,e.path||"/socket.io"),s=t.source,i=t.id,r=t.path,o=Ni[i]&&r in Ni[i].nsps,l=e.forceNew||e["force new connection"]||e.multiplex===!1||o;let c;return l?c=new Tc(s,e):(Ni[i]||(Ni[i]=new Tc(s,e)),c=Ni[i]),t.query&&!e.query&&(e.query=t.queryKey),c.socket(t.path,e)}Object.assign(Eo,{Manager:Tc,Socket:my,io:Eo,connect:Eo});let V=null;const Y={connect(n=window.location.origin){if(V)return V;let e=n;return window.location.hostname==="localhost"||window.location.hostname==="127.0.0.1"?(n.includes(":3000")||n.includes(":5173"))&&(e=`http://${window.location.hostname}:8080`):e="https://kicker-hax-server.onrender.com",V=Eo(e,{autoConnect:!0,reconnection:!0,reconnectionAttempts:10,reconnectionDelay:2e3,transports:["polling","websocket"],upgrade:!0,withCredentials:!1}),V.on("connect",()=>{console.log(`[Socket.IO] Conectado: ${V.id}`)}),V.on("connect_error",s=>{console.warn(`[Socket.IO] Erro de conexão: ${s.message}`)}),V.on("disconnect",()=>{console.log("[Socket.IO] Desconectado.")}),V},disconnect(){V&&(V.disconnect(),V=null)},getSocket(){return V},createRoom(n,e,t,s,i,r,o,l){V&&V.emit("createRoom",{name:n,password:e,maxPlayers:t,duration:s,goalLimit:i,fieldSize:r,showReplay:o,profile:l})},joinRoom(n,e,t){V&&V.emit("joinRoom",{roomCode:n,password:e,profile:t})},leaveRoom(){V&&V.emit("leaveRoom")},changeTeam(n){V&&V.emit("changeTeam",n)},toggleReady(){V&&V.emit("toggleReady")},sendChatMessage(n){V&&V.emit("chatMessage",n)},addBot(n){V&&V.emit("addBot",n)},removeBot(n){V&&V.emit("removeBot",n)},kickPlayer(n){V&&V.emit("kickPlayer",n)},updateRoomSettings(n){V&&V.emit("updateRoomSettings",n)},startGame(){V&&V.emit("startGame")},sendGameInput(n){V&&V.emit("gameInput",n)},skipReplay(){V&&V.emit("skipReplay")},onLobbyUpdate(n){V&&V.on("lobbyUpdate",n)},onChat(n){V&&V.on("chatMessage",n)},onMatchStarted(n){V&&V.on("matchStarted",n)},onGameState(n){V&&(V.off("gameState"),V.on("gameState",n))},onPlayReplay(n){V&&V.on("playReplay",n)},onMatchEnded(n){V&&V.on("matchEnded",n)},onKicked(n){V&&V.on("kicked",n)},onPublicRoomsList(n){V&&V.on("publicRoomsList",n)},clearListeners(){V&&(V.off("lobbyUpdate"),V.off("chatMessage"),V.off("matchStarted"),V.off("gameState"),V.off("playReplay"),V.off("matchEnded"),V.off("kicked"),V.off("publicRoomsList"))}},cp=1024,hp=640,L=36,Tt=180,Ht=30,Le=6,Tn=10,st=16,na=.955,up=.9,KA=1.9,dp=3.2,QA=6,gy=90,YA=.0022,JA=.006,fp=82,XA=140,pp=9,ZA=120,ek=80,mp=30,gp=1/3,_p=3.8,tk=12,nk=34,sk=12,yp=1/3,ik=22,rk=60,Dl=120,lt={RED:0,BLUE:1};class ok{constructor(){this.x=cp/2,this.y=hp/2,this.r=Tn,this.targetX=cp/2,this.targetY=hp/2,this.owner=null}updateState(e){this.targetX=e.x,this.targetY=e.y,this.owner=e.owner}interpolate(e=.35){this.x+=(this.targetX-this.x)*e,this.y+=(this.targetY-this.y)*e}draw(e){e.fillStyle="rgba(0,0,0,.25)",e.beginPath(),e.ellipse(this.x+3,this.y+6,this.r*1.1,this.r*.6,0,0,Math.PI*2),e.fill();const t=e.createRadialGradient(this.x-5,this.y-5,4,this.x,this.y,this.r);t.addColorStop(0,"#ffffff"),t.addColorStop(1,"#bfc8d6"),e.fillStyle=t,e.beginPath(),e.arc(this.x,this.y,this.r,0,Math.PI*2),e.fill()}}class vp{constructor(e){this.id=e.id,this.name=e.name,this.badge=e.badge,this.team=e.team,this.x=e.x,this.y=e.y,this.r=st,this.dir=e.dir||0,this.targetX=e.x,this.targetY=e.y,this.targetDir=e.dir||0,this.stamina=e.stamina,this.staminaLock=e.staminaLock,this.stun=e.stun,this.shootHalo=e.shootHalo,this.invuln=e.invuln,this.trail=[]}updateState(e){this.name=e.name,this.badge=e.badge,this.targetX=e.x,this.targetY=e.y,this.targetDir=e.dir,this.stamina=e.stamina,this.staminaLock=e.staminaLock,this.stun=e.stun,this.shootHalo=e.shootHalo,this.invuln=e.invuln,this.staminaLock<=0&&this.invuln>0?(this.trail.push({x:this.x,y:this.y,alpha:.5}),this.trail.length>5&&this.trail.shift()):this.trail.length>0&&this.trail.shift()}interpolate(e=.35){this.x+=(this.targetX-this.x)*e,this.y+=(this.targetY-this.y)*e;let t=this.targetDir-this.dir;t=Math.atan2(Math.sin(t),Math.cos(t)),this.dir+=t*e}draw(e,t){e.save();for(const s of this.trail)e.fillStyle=this.team===lt.RED?`rgba(239, 68, 68, ${s.alpha})`:`rgba(96, 165, 250, ${s.alpha})`,e.beginPath(),e.arc(s.x,s.y,this.r-2,0,Math.PI*2),e.fill(),s.alpha-=.1;if(e.restore(),e.fillStyle="rgba(0,0,0,.25)",e.beginPath(),e.ellipse(this.x+4,this.y+8,this.r*1.1,this.r*.6,0,0,Math.PI*2),e.fill(),e.beginPath(),e.arc(this.x,this.y,this.r,0,Math.PI*2),e.fillStyle=this.team===lt.RED?"#ef4444":"#3b82f6",e.fill(),e.lineWidth=2,e.strokeStyle="rgba(0,0,0,.45)",e.stroke(),this.shootHalo>0&&(e.strokeStyle="#000000",e.lineWidth=2,e.beginPath(),e.arc(this.x,this.y,this.r+2,0,Math.PI*2),e.stroke()),this.badge){e.fillStyle="#0b1020";const s=ZS(this.badge),i=s.length>=2&&!eA(s[0])?14:16;e.font=`700 ${i}px system-ui, "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif`,e.textAlign="center",e.textBaseline="middle",e.fillText(this.badge,this.x,this.y)}this.invuln>0&&(e.strokeStyle="#22c55e",e.setLineDash([4,4]),e.beginPath(),e.arc(this.x,this.y,this.r+4,0,Math.PI*2),e.stroke(),e.setLineDash([])),t===this.id&&(e.fillStyle="rgba(255,255,255,.85)",e.beginPath(),e.moveTo(this.x,this.y-this.r-10),e.lineTo(this.x-6,this.y-this.r-2),e.lineTo(this.x+6,this.y-this.r-2),e.closePath(),e.fill()),this.stun>0&&(e.strokeStyle="#ef4444",e.lineWidth=2,e.beginPath(),e.arc(this.x,this.y,this.r+2,0,Math.PI*2),e.stroke()),this.name&&(e.fillStyle="#e2e8f0",e.font="700 12px system-ui",e.textAlign="center",e.fillText(this.name,this.x,this.y-this.r-14))}}class ak{static clamp(e,t,s){return Math.max(t,Math.min(s,e))}static rnd(e,t){return e+Math.random()*(t-e)}static normalizedAngle(e){return e%=Math.PI*2,e<-Math.PI?e+Math.PI*2:e>Math.PI?e-Math.PI*2:e}static lerpAngle(e,t,s){e=this.normalizedAngle(e),t=this.normalizedAngle(t);let i=this.normalizedAngle(t-e);return e+i*s}static circleCollision(e,t){const s=t.x-e.x,i=t.y-e.y,r=Math.hypot(s,i);return r<e.r+t.r?{dx:s,dy:i,d:r}:null}static collidePlayerWithCorner(e,t,s,i){const r=e.x-t,o=e.y-s,l=Math.hypot(r,o)||1e-6,c=e.r+i;if(l<c){const h=r/l,d=o/l,p=c-l;e.x+=h*p,e.y+=d*p;const m=e.vx*h+e.vy*d;e.vx-=.8*m*h,e.vy-=.8*m*d}}static collideBallWithCorner(e,t,s,i,r){const o=e.x-t,l=e.y-s,c=Math.hypot(o,l)||1e-6,h=e.r+i;if(c<h){const d=o/c,p=l/c,m=h-c;e.x+=d*m,e.y+=p*m;const E=e.vx*d+e.vy*p;e.vx-=1.7*E*d,e.vy-=1.7*E*p,e.strikeTimer>0&&(e.lastStrikeType==="kick"||e.lastStrikeType==="power")&&r&&r()}}static resolvePlayerPlayer(e){for(let t=0;t<e.length;t++)for(let s=t+1;s<e.length;s++){const i=e[t],r=e[s],o=this.circleCollision(i,r);if(!o)continue;const l=o.d||1e-6,c=o.dx/l,h=o.dy/l,d=(i.r+r.r-l)*.5;i.x-=c*d,i.y-=h*d,r.x+=c*d,r.y+=h*d;const p=r.vx-i.vx,m=r.vy-i.vy,E=p*c+m*h;let C=.7;(i.stun>0||r.stun>0||i.tackleFreeze>0||r.tackleFreeze>0)&&(C=0);const S=-E*C;i.vx-=S*c,i.vy-=S*h,r.vx+=S*c,r.vy+=S*h}}static resolvePlayerBall(e,t,s){for(const i of e){const r=this.circleCollision(i,t);if(!r)continue;const o=r.d||1e-6,l=r.dx/o,c=r.dy/o,h=i.r+t.r-o;t.owner||(t.noPickupFrames<=0||t.noPickupFrom!==i.id?(t.x+=l*h,t.y+=c*h,t.vx+=i.vx*.22,t.vy+=i.vy*.22,t.owner=i.id,t.lastStrikeType=null,t.strikeTimer=0,s&&s(i)):(t.x+=l*Math.max(0,h-1),t.y+=c*Math.max(0,h-1),t.vx+=i.vx*.05,t.vy+=i.vy*.05)),t.lastTouch=i.id}}static updatePlayerPhysics(e,t,s,i){if(e.stun>0){e.vx=0,e.vy=0,e.tackle_cd>0&&e.tackle_cd--,e.dribble_cd>0&&e.dribble_cd--,e.dash_time>0&&e.dash_time--,e.invuln>0&&e.invuln--,e.stun--,e.cool>0&&e.cool--,e.power_cd>0&&e.power_cd--,e.tackleFreeze>0&&e.tackleFreeze--,e.aiShootLock>0&&e.aiShootLock--,e.shootHalo>0&&e.shootHalo--,e.tackleEval>0&&(e.tackleEval--,e.tackleEval===0&&!e.tackleSuccess&&(e.stun=Math.max(e.stun,mp)));return}e.staminaLock>0?(e.stamina=0,e.staminaLock--):t.sprint&&e.stamina>0?(e.stamina=Math.max(0,e.stamina-JA),e.stamina===0&&(e.staminaLock=gy)):e.stamina=Math.min(1,e.stamina+YA);const r=t.sprint&&e.staminaLock<=0&&e.stamina>0,o=e.slowTimer>0?.7:1;e.slowTimer>0&&e.slowTimer--;const l=r?1+(1.3-1)*e.stamina:1,c=KA*l*o,h=e.dash_time>0?1.7:1;let d=t.x||0,p=t.y||0;const m=Math.hypot(d,p)||1;if(e.vx=e.vx*up+d/m*c*.12*h,e.vy=e.vy*up+p/m*c*.12*h,d||p){const E=Math.atan2(p,d);e.dir=this.lerpAngle(e.dir,E,.35),e.lastMoveDir=e.dir}t.shoot?e.kickCharge=Math.min(1,e.kickCharge+.065):e.kickCharge*=.95,e.boostCooldown>0&&e.boostCooldown--,e.tackle_cd>0&&e.tackle_cd--,e.dribble_cd>0&&e.dribble_cd--,e.dash_time>0&&e.dash_time--,e.invuln>0&&e.invuln--,e.cool>0&&e.cool--,e.power_cd>0&&e.power_cd--,e.tackleFreeze>0&&e.tackleFreeze--,e.aiShootLock>0&&e.aiShootLock--,e.shootHalo>0&&e.shootHalo--,e.tackleEval>0&&(e.tackleEval--,e.tackleEval===0&&!e.tackleSuccess&&(e.vx=0,e.vy=0,e.stun=Math.max(e.stun,mp)))}static applyLimits(e,t,s,i,r,o,l,c,h=1024,d=640){let p=e.x+e.vx,m=e.y+e.vy;if(m>t&&m<s||(m-e.r<L&&(m=L+e.r,e.vy*=-.5),m+e.r>d-L&&(m=d-L-e.r,e.vy*=-.5)),m>t&&m<s){p-e.r<i&&(p=i+e.r,e.vx=Math.max(e.vx,0)*.5),p+e.r>r&&(p=r-e.r,e.vx=Math.min(e.vx,0)*.5);const E=p<L&&p>=i-6,C=p>h-L&&p<=r+6;(E||C)&&(m-e.r<t&&(m=t+e.r,e.vy=Math.max(e.vy,0)*.4),m+e.r>s&&(m=s-e.r,e.vy=Math.min(e.vy,0)*.4));const S={x:p,y:m,vx:e.vx,vy:e.vy,r:e.r};this.collidePlayerWithCorner(S,o,t,c),this.collidePlayerWithCorner(S,o,s,c),this.collidePlayerWithCorner(S,l,t,c),this.collidePlayerWithCorner(S,l,s,c),p=S.x,m=S.y,e.vx=S.vx,e.vy=S.vy}else{p-e.r<L&&(p=L+e.r,e.vx*=-.5),p+e.r>h-L&&(p=h-L-e.r,e.vx*=-.5);const E={x:p,y:m,vx:e.vx,vy:e.vy,r:e.r};this.collidePlayerWithCorner(E,o,t,c),this.collidePlayerWithCorner(E,o,s,c),this.collidePlayerWithCorner(E,l,t,c),this.collidePlayerWithCorner(E,l,s,c),p=E.x,m=E.y,e.vx=E.vx,e.vy=E.vy}e.x=p,e.y=m}static updateBallPhysics(e,t,s,i,r,o,l,c,h,d,p,m=1024,E=640){if(e.boostCooldown>0&&e.boostCooldown--,e.noPickupFrames>0&&(e.noPickupFrames--,e.noPickupFrames===0&&(e.noPickupFrom=null)),e.strikeTimer>0&&e.strikeTimer--,e.owner){const C=h.find(S=>S.id===e.owner);if(C){const S=C.r+e.r+1,k=Math.cos(C.dir||0),F=Math.sin(C.dir||0);let U=C.x+k*S,q=C.y+F*S,ee=L+e.r,he=m-L-e.r;q>t&&q<s&&(ee=i+e.r,he=r-e.r),e.x=this.clamp(U,ee,he),e.y=this.clamp(q,L+e.r,E-L-e.r),e.vx=C.vx,e.vy=C.vy,q>t&&q<s&&(e.x+e.r<=o&&p("blue",C.id),e.x-e.r>=l&&p("red",C.id));return}else e.owner=null}if(e.vx*=na,e.vy*=na,e.x+=e.vx,e.y+=e.vy,e.y-e.r<L&&(e.y=L+e.r,e.vy*=-.75),e.y+e.r>E-L&&(e.y=E-L-e.r,e.vy*=-.75),e.x-e.r<L&&(e.y>t&&e.y<s?(this.collideBallWithCorner(e,o,t,c,()=>d("post")),this.collideBallWithCorner(e,o,s,c,()=>d("post"))):(e.x=L+e.r,e.vx*=-.75)),e.x+e.r>m-L&&(e.y>t&&e.y<s?(this.collideBallWithCorner(e,l,t,c,()=>d("post")),this.collideBallWithCorner(e,l,s,c,()=>d("post"))):(e.x=m-L-e.r,e.vx*=-.75)),e.y>t&&e.y<s){const C=e.x<L&&e.x>=i-30,S=e.x>m-L&&e.x<=r+30;(C||S)&&(C&&e.x-e.r<i&&(e.x=i+e.r,e.vx*=-.65),S&&e.x+e.r>r&&(e.x=r-e.r,e.vx*=-.65),e.y-e.r<t&&(e.y=t+e.r,e.vy*=-.65),e.y+e.r>s&&(e.y=s-e.r,e.vy*=-.65))}e.y>t&&e.y<s&&(e.x+e.r<=o&&p("blue",e.lastTouch),e.x-e.r>=l&&p("red",e.lastTouch))}static kickBall(e,t,s,i){t.owner=null,t.noPickupFrames=14,t.noPickupFrom=e.id,t.vx+=Math.cos(s)*i,t.vy+=Math.sin(s)*i,t.vx+=this.rnd(-.05,.05),t.vy+=this.rnd(-.05,.05),t.lastTouch=e.id,t.lastStrikeType="kick",t.strikeTimer=40}static powerKick(e,t,s,i){t.owner=null,t.noPickupFrames=14,t.noPickupFrom=e.id,t.vx+=Math.cos(s)*i,t.vy+=Math.sin(s)*i,t.vx+=this.rnd(-.05,.05),t.vy+=this.rnd(-.05,.05),t.lastTouch=e.id,t.lastStrikeType="power",t.strikeTimer=40}}const Ep={currentUser:null,mode:"solo",difficulty:"medium",score:{red:0,blue:0},matchTime:0,goalLimit:3,status:"lobby",countdown:0,activeRoom:null,canvas:null,ctx:null,ball:null,players:[],localPhysicsTick:null,keys:new Map,codes:new Map,replayFrames:[],inReplay:!1,replayFrameIdx:0,replayTimer:0,replayBlob:null,mediaRecorder:null,recordedChunks:[],isRecording:!1,goalsScored:0,assistsGained:0,savesDone:0,async init(n){this.currentUser=n,this.canvas=document.getElementById("match-canvas"),this.canvas&&(this.ctx=this.canvas.getContext("2d",{alpha:!1})),window.addEventListener("keydown",e=>{const t=e.key.toLowerCase();this.keys.set(t,!0),this.codes.set(e.code,!0),$.currentScreenId==="match-screen"&&["arrowup","arrowdown","arrowleft","arrowright"," ","enter"].includes(t)&&e.preventDefault()}),window.addEventListener("keyup",e=>{this.keys.set(e.key.toLowerCase(),!1),this.codes.set(e.code,!1)}),window.addEventListener("blur",()=>this.keys.clear()),this.setupViewTriggers(),this.bindDOMEvents();try{Y.connect();const e=Y.getSocket();e&&e.on("onlineUsersCount",t=>{const s=document.getElementById("online-users-count");s&&(s.textContent=t)})}catch(e){console.warn("[Socket.IO] Failed to connect on startup:",e)}},setupViewTriggers(){const n=document.getElementById("mode-btn-back");n&&(n.onclick=()=>$.show("menu-screen"));const e=document.getElementById("mode-card-solo");e&&(e.onclick=()=>{this.mode="solo",$.show("solo-screen")});const t=document.getElementById("mode-card-multiplayer");t&&(t.onclick=()=>{this.mode="multiplayer",$.show("multiplayer-screen")});const s=document.getElementById("solo-btn-back");s&&(s.onclick=()=>$.show("mode-select-screen"));const i=document.getElementById("multiplayer-btn-back");i&&(i.onclick=()=>$.show("mode-select-screen"));const r=document.getElementById("create-room-btn-back");r&&(r.onclick=()=>$.show("multiplayer-screen"));const o=document.getElementById("join-code-btn-back");o&&(o.onclick=()=>$.show("multiplayer-screen")),$.register("multiplayer-screen",{onEnter:()=>{Y.connect(),Y.onPublicRoomsList(l=>this.renderRoomsList(l))},onExit:()=>{Y.clearListeners()}}),$.register("lobby-screen",{onEnter:()=>{Y.onLobbyUpdate(l=>this.updateLobbyView(l)),Y.onChat(l=>this.appendChatMessage(l)),Y.onMatchStarted(()=>{ce("A partida está começando!","success"),$.show("match-screen")}),Y.onKicked(()=>{ce("Você foi expulso do lobby pelo Host.","error"),$.show("multiplayer-screen")})},onExit:()=>{Y.clearListeners()}}),$.register("match-screen",{onEnter:()=>{pt.ensureAudio(),this.startMatchView()},onExit:()=>{this.stopMatchView()}}),$.register("ranking-screen",{onEnter:()=>this.loadRanking("wins")})},bindDOMEvents(){const n=document.querySelectorAll("#solo-ai-difficulty button");n.forEach(y=>{y.onclick=()=>{n.forEach(w=>w.classList.remove("active")),y.classList.add("active"),this.difficulty=y.getAttribute("data-diff")}});const e=document.getElementById("solo-btn-start");e&&(e.onclick=()=>{this.goalLimit=parseInt(document.getElementById("solo-goals").value,10),this.matchTime=parseInt(document.getElementById("solo-minutes").value,10)*60,$.show("match-screen")});const t=document.getElementById("lobby-btn-leave");t&&(t.onclick=()=>{Y.leaveRoom(),$.show("multiplayer-screen")});const s=document.getElementById("lobby-btn-ready");s&&(s.onclick=()=>{Y.toggleReady()});const i=document.getElementById("lobby-btn-start");i&&(i.onclick=()=>{Y.startGame()});const r=document.getElementById("lobby-btn-join-red");r&&(r.onclick=()=>Y.changeTeam("red"));const o=document.getElementById("lobby-btn-join-blue");o&&(o.onclick=()=>Y.changeTeam("blue"));const l=document.getElementById("lobby-btn-join-spec");l&&(l.onclick=()=>Y.changeTeam("spectator"));const c=document.getElementById("btn-add-bot-red");c&&(c.onclick=()=>Y.addBot("red"));const h=document.getElementById("btn-add-bot-blue");h&&(h.onclick=()=>Y.addBot("blue"));const d=document.getElementById("btn-copy-code");d&&(d.onclick=()=>{const y=document.getElementById("lobby-room-code").textContent;navigator.clipboard.writeText(y).then(()=>{ce("Código copiado!","success")})});const p=document.getElementById("lobby-chat-form");p&&(p.onsubmit=y=>{y.preventDefault();const w=document.getElementById("lobby-chat-input"),T=w.value.trim();T&&(Y.sendChatMessage(T),w.value="")});const m=document.getElementById("multi-btn-create-room");m&&(m.onclick=()=>$.show("create-room-screen"));const E=document.getElementById("multi-btn-join-code");E&&(E.onclick=()=>$.show("join-code-screen"));const C=document.getElementById("create-room-form");C&&(C.onsubmit=y=>{y.preventDefault();const w=document.getElementById("room-name-input").value,T=document.getElementById("room-password-input").value,R=document.getElementById("room-max-players").value,v=document.getElementById("room-duration").value,ze=document.getElementById("room-goals").value,yt=document.getElementById("room-field-size"),fs=yt?yt.value:"medium",Bt=localStorage.getItem("kicker_hax_show_replay")!=="false",cn={uid:this.currentUser.uid,username:Be.profileData.username,badge:Be.profileData.badge||"🏳️"};Y.createRoom(w,T,R,v,ze,fs,Bt,cn);const Ut=Y.getSocket();Ut&&Ut.once("roomCreated",ps=>{ce("Lobby criado!","success"),$.show("lobby-screen")})});const S=document.getElementById("join-code-form");S&&(S.onsubmit=y=>{y.preventDefault();const w=document.getElementById("join-code-input").value.toUpperCase(),T=document.getElementById("join-password-input").value,R={uid:this.currentUser.uid,username:Be.profileData.username,badge:Be.profileData.badge||"🏳️"};Y.joinRoom(w,T,R);const v=Y.getSocket();v&&(v.once("joinSuccess",()=>{ce("Entrou no lobby com sucesso!","success"),$.show("lobby-screen")}),v.once("joinError",ze=>{ce(ze,"error")}))});const k=document.getElementById("match-btn-exit");k&&(k.onclick=()=>{confirm("Deseja realmente sair da partida?")&&(this.localPhysicsTick&&cancelAnimationFrame(this.localPhysicsTick),pt.stopCrowd&&pt.stopCrowd(),this.mode==="multiplayer"?(Y.leaveRoom(),$.show("multiplayer-screen")):$.show("solo-screen"))});const F=document.getElementById("btn-skip-replay");F&&(F.onclick=()=>{this.mode==="multiplayer"?Y.skipReplay():this.endReplayPlayback()});const U=document.getElementById("btn-save-replay");U&&(U.onclick=()=>{this.downloadReplay()});const q=document.getElementById("game-chat-form");q&&(q.onsubmit=y=>{y.preventDefault();const w=document.getElementById("game-chat-input"),T=w.value.trim();T&&(this.mode==="multiplayer"?Y.sendChatMessage(T):this.appendChatMessage({time:new Date().toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"}),username:Be.profileData.displayName,badge:Be.profileData.badge,text:T},!0),w.value=""),w.blur(),q.classList.remove("active"),this.canvas.focus()});const ee=document.getElementById("rank-filter-wins"),he=document.getElementById("rank-filter-goals"),de=document.getElementById("rank-filter-level");ee&&(ee.onclick=()=>this.loadRanking("wins")),he&&(he.onclick=()=>this.loadRanking("goals")),de&&(de.onclick=()=>this.loadRanking("level"));const I=document.getElementById("post-btn-continue");I&&(I.onclick=()=>{this.mode==="multiplayer"?$.show("lobby-screen"):$.show("solo-screen")});const _=document.getElementById("ranking-btn-back");_&&(_.onclick=()=>$.show("menu-screen"))},startMatchView(){this.canvas=document.getElementById("match-canvas"),this.ctx=this.canvas.getContext("2d",{alpha:!1}),this.recordedChunks=[],this.isRecording=!1;const n=Hi.dimensions;this.canvas.width=n.w,this.canvas.height=n.h,this.resizeCanvasContainer(),window.addEventListener("resize",()=>this.resizeCanvasContainer()),this.p1PossessionFrames=0,this.cpuPossessionFrames=0,this.totalPossessionFrames=0,this.p1Shots=0,this.p1Tackles=0,this.p1Dribbles=0,this.shotCooldown=0,this.goalsScored=0,this.assistsGained=0,this.savesDone=0,this.score={red:0,blue:0},this.inReplay=!1;const e=document.getElementById("focus-lost-badge"),t=()=>{const s=document.hidden||!document.hasFocus();e&&(s?e.classList.remove("hidden"):e.classList.add("hidden"))};document.addEventListener("visibilitychange",t),window.addEventListener("blur",()=>{e&&e.classList.remove("hidden")}),window.addEventListener("focus",()=>{e&&e.classList.add("hidden")}),this.ball=new ok,this.players=[],this.setupPauseMenu(),window.addEventListener("keydown",s=>{if($.currentScreenId==="match-screen")if(s.key==="Enter"){const i=document.getElementById("game-chat-form"),r=document.getElementById("game-chat-input");i&&r&&(i.classList.contains("active")||(i.classList.add("active"),r.focus()))}else(s.key==="Escape"||s.key==="p"||s.key==="P")&&this.togglePauseMenu()}),this.mode==="solo"?this.startLocalSoloMatch():this.startOnlineMatch()},resizeCanvasContainer(){if($.currentScreenId!=="match-screen"||!this.canvas)return;const n=document.querySelector(".match-wrap"),e=document.getElementById("match-stage");if(!n||!e)return;const t=this.canvas.width/this.canvas.height,s=window.innerWidth-80;let r=window.innerHeight-110,o=r*t;if(o>s){const l=s/o;o*=l,r*=l}o=Math.floor(o),r=Math.floor(r),e.style.gridTemplateColumns=`56px ${o}px 56px`,e.style.width=`${o+112+16}px`,e.style.height=`${r}px`,this.canvas.style.width=`${o}px`,this.canvas.style.height=`${r}px`},startLocalSoloMatch(){this.p1Tackles=0,this.p1Dribbles=0,this.p2Tackles=0,this.p2Dribbles=0,this.p1TackleLock=!1,this.p1DribbleLock=!1,this.p2TackleLock=!1,this.p2DribbleLock=!1;const n=Be.profileData.username,e=Be.profileData.badge||"🇧🇷",t=document.getElementById("solo-field-size"),s=t?t.value:"medium";this.showReplay=localStorage.getItem("kicker_hax_show_replay")!=="false",s==="small"?(this.canvas.width=896,this.canvas.height=560):s==="large"?(this.canvas.width=1280,this.canvas.height=768):(this.canvas.width=1024,this.canvas.height=640),this.resizeCanvasContainer(),this.currentUser.uid,this.difficulty,this.p1PossessionFrames=0,this.cpuPossessionFrames=0,this.totalPossessionFrames=0,this.p1Shots=0,this.p1Tackles=0,this.p1Dribbles=0,this.shotCooldown=0,this.goalsScored=0,this.assistsGained=0,this.savesDone=0,this.status="countdown",this.countdown=150,this.ball.x=this.canvas.width/2,this.ball.y=this.canvas.height/2;const i={score:{red:0,blue:0},matchTime:this.matchTime,status:"countdown",countdownTimer:150,goalFreezeTimer:0,replayBuffer:[],replayIndex:0},r={id:"cpu",team:lt.RED,cpu:!0,difficulty:this.difficulty,x:L+120,y:this.canvas.height*.5,vx:0,vy:0,r:st,dir:0,lastMoveDir:0,stamina:1,staminaLock:0,stun:0,slowTimer:0,kickCharge:0,cool:0,tackle_cd:0,dribble_cd:0,dash_time:0,invuln:0,power_cd:0,tackleFreeze:0,tackleSuccess:!1,tackleEval:0,shootHalo:0,aiShootLock:0,aiFeintLock:0},o={id:"p1",team:lt.BLUE,cpu:!1,x:this.canvas.width-L-120,y:this.canvas.height*.5,vx:0,vy:0,r:st,dir:0,lastMoveDir:0,stamina:1,staminaLock:0,stun:0,slowTimer:0,kickCharge:0,cool:0,tackle_cd:0,dribble_cd:0,dash_time:0,invuln:0,power_cd:0,tackleFreeze:0,tackleSuccess:!1,tackleEval:0,shootHalo:0},l=[r,o];this.players=l.map(h=>new vp(h));const c={x:this.canvas.width/2,y:this.canvas.height/2,vx:0,vy:0,r:Tn,owner:null,lastTouch:null,strikeTimer:0,lastStrikeType:null,noPickupFrames:0,noPickupFrom:null};(()=>{const h=ak;let d=[];const p=()=>{var C;if($.currentScreenId==="match-screen"){try{d=[];let S={x:0,y:0,shoot:!1,sprint:!1,dribble:!1,tackle:!1,power:!1};const k=this.canvas.width,F=this.canvas.height,U=(F-Tt)/2,q=(F+Tt)/2,ee=L-Le,he=k-L+Le,de=ee-Ht,I=he+Ht,_=10;if(!this.isPaused){if(i.status==="countdown")i.countdownTimer--,i.countdownTimer<=0&&(i.status="playing");else if(i.status==="freeze")i.goalFreezeTimer--,i.goalFreezeTimer<=0&&(this.inReplay=!0,this.replayFrames=[...i.replayBuffer],this.replayFrameIdx=0,this.replayTimer=0,(C=document.getElementById("replay-overlay"))==null||C.classList.remove("hidden"),i.status="replay",i.countdownTimer=Dl*2+30,this.startLocalReplayRecording());else if(i.status==="replay")i.countdownTimer--,i.countdownTimer<=0&&(this.endReplayPlayback(),(i.score.red>=this.goalLimit||i.score.blue>=this.goalLimit)&&this.goalLimit>0?(i.status="ended",this.localMatchEnd(i.score)):(i.status="countdown",i.countdownTimer=150,m()));else if(i.status==="playing"){i.matchTime-=1/60,i.matchTime<=0&&(i.matchTime=0,i.status="ended",this.localMatchEnd(i.score)),S={x:0,y:0,shoot:!1,sprint:!1,dribble:!1,tackle:!1,power:!1};const G=Hi.CTRL_P1;this.keys.get(G.up)&&(S.y-=1),this.keys.get(G.down)&&(S.y+=1),this.keys.get(G.left)&&(S.x-=1),this.keys.get(G.right)&&(S.x+=1),G.sprint.startsWith("Shift")?S.sprint=this.codes.get(G.sprint):S.sprint=this.keys.get(G.sprint),S.shoot=this.keys.get(G.shoot),S.dribble=this.keys.get(G.dribble),S.tackle=this.keys.get(G.tackle),S.power=this.keys.get(G.power);let ke={x:0,y:0,shoot:!1,sprint:!1,dribble:!1,tackle:!1,power:!1};if(r.stun<=0){const x={x:c.x,y:c.y};if(!c.owner){let Et=c.vx,$t=c.vy;for(let ai=0;ai<10;ai++)Et*=na,$t*=na,x.x+=Et,x.y+=$t}const Ee=Math.hypot(x.x-r.x,x.y-r.y);let fe=x.x,Ge=x.y;const un=c.x<k/2;if(c.owner==="cpu"){fe=he;const Et=Math.hypot(o.x-r.x,o.y-r.y);this.difficulty!=="easy"&&Et<120?(Ge=o.y>r.y?r.y-80:r.y+80,this.difficulty==="hard"&&r.dribble_cd<=0&&(ke.dribble=!0)):Ge=h.clamp(r.y,U+20,q-20)}else if(c.owner==="p1")if(Math.hypot(o.x-r.x,o.y-r.y)>200){const $t=L;fe=$t+(o.x-$t)*.7,Ge=F*.5+(o.y-F*.5)*.7}else fe=o.x,Ge=o.y;else un&&Ee>260&&this.difficulty!=="easy"?(fe=L+50,Ge=h.clamp(x.y,U+10,q-10)):(fe=x.x,Ge=x.y);let qt=fe-r.x,ms=Ge-r.y,gs=Math.hypot(qt,ms)||1,_s=qt/gs,ys=ms/gs,Bn=1,Wt=0;this.difficulty==="easy"?(Bn=.72,Wt=.25):this.difficulty==="medium"&&(Bn=.88,Wt=.12),Wt>0&&Math.random()<.05&&(_s+=h.rnd(-Wt,Wt),ys+=h.rnd(-Wt,Wt)),ke.x=_s*Bn,ke.y=ys*Bn;const Va=c.owner==="cpu"&&Math.abs(he-r.x)>200||!c.owner&&Ee>120;if(ke.sprint=Va&&r.staminaLock<=0&&r.stamina>.3,c.owner==="cpu"){const Et=Math.abs(he-r.x);(Et<100||Et<160&&r.y>U&&r.y<q)&&(ke.shoot=!0)}else c.owner==="p1"&&Ee<fp&&r.tackle_cd<=0&&this.difficulty!=="easy"&&(ke.tackle=!0)}const hn=(x,Ee)=>{if(!(x.stun>0)){if(Ee.tackle&&x.tackle_cd<=0&&x.stamina>=gp){x.stamina=Math.max(0,x.stamina-gp),x.tackle_cd=XA,x.tackleSuccess=!1,x.tackleEval=12,x.slowTimer=ek,x.tackleFreeze=8,d.push("tackle");const fe=x.id==="p1"?r:o,Ge=c.owner===fe.id?Math.atan2(fe.y-x.y,fe.x-x.x):x.dir;x.vx+=Math.cos(Ge)*pp,x.vy+=Math.sin(Ge)*pp,c.owner===fe.id&&fe.invuln<=0&&Math.hypot(fe.x-x.x,fe.y-x.y)<=fp&&(c.owner=x.id,c.lastTouch=x.id,c.noPickupFrames=10,c.noPickupFrom=null,c.vx=0,c.vy=0,fe.stun=Math.max(fe.stun,ZA),fe.vx=0,fe.vy=0,x.tackleSuccess=!0)}if(Ee.dribble&&x.dribble_cd<=0&&c.owner===x.id&&x.stamina>=yp&&(x.stamina=Math.max(0,x.stamina-yp),x.dash_time=tk,x.invuln=sk,x.dribble_cd=nk,x.vx+=Math.cos(x.dir)*_p,x.vy+=Math.sin(x.dir)*_p,d.push("dribble")),Ee.power&&x.power_cd<=0&&x.stamina>=.98&&(c.owner===x.id||Math.hypot(x.x-c.x,x.y-c.y)<x.r+c.r+8)){x.stamina=0,x.staminaLock=gy,x.power_cd=rk,x.cool=12,x.shootHalo=22;const fe=Ee.x||Ee.y?Math.atan2(Ee.y,Ee.x):x.dir;h.powerKick(x,c,fe,ik),d.push("power")}if(x.kickCharge>0&&!Ee.shoot){const fe=h.clamp(x.kickCharge,0,1),Ge=Math.max(.08,.4*fe);if(x.staminaLock<=0&&x.stamina>=Ge){x.stamina=Math.max(0,x.stamina-Ge),x.cool=14,x.shootHalo=18;const un=Ee.x||Ee.y?Math.atan2(Ee.y,Ee.x):x.dir,qt=Math.max(dp,dp+QA*fe);h.kickBall(x,c,un,qt),d.push("kick")}x.kickCharge=0}}};hn(o,S),hn(r,ke),h.updatePlayerPhysics(o,S,c,x=>d.push(x)),h.updatePlayerPhysics(r,ke,c,x=>d.push(x)),h.applyLimits(o,U,q,de,I,ee,he,_,k,F),h.applyLimits(r,U,q,de,I,ee,he,_,k,F),h.resolvePlayerPlayer(l),h.resolvePlayerBall(l,c,()=>{for(const x of l)x.tackleEval>0&&c.owner===x.id&&(x.tackleSuccess=!0)}),h.updateBallPhysics(c,U,q,de,I,ee,he,_,l,x=>d.push(x),x=>{x==="blue"?i.score.blue++:i.score.red++;const Ee=c.lastTouch==="p1"?n:"CPU Bot",fe=x==="blue"&&c.lastTouch==="cpu"||x==="red"&&c.lastTouch==="p1";this.lastGoal={side:x,scorerName:Ee,ownGoal:fe},d.push("whistle"),d.push("goal"),d.push("cheer"),(i.score.red>=this.goalLimit||i.score.blue>=this.goalLimit)&&this.goalLimit>0?(i.status="ended",this.localMatchEnd(i.score)):this.showReplay?(i.status="freeze",i.goalFreezeTimer=Dl):(i.status="countdown",i.countdownTimer=150,m())},k,F)}E()}this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height),this.drawFieldGrid(this.ctx),this.inReplay?this.playbackReplay():(d.forEach(G=>pt.play(G)),this.ball.x=c.x,this.ball.y=c.y,this.ball.owner=c.owner,this.ball.draw(this.ctx),this.players.forEach(G=>{const ke=G.id==="p1"?o:r;G.x=ke.x,G.y=ke.y,G.dir=ke.dir,G.stamina=ke.stamina,G.staminaLock=ke.staminaLock,G.stun=ke.stun,G.shootHalo=ke.shootHalo,G.invuln=ke.invuln,G.draw(this.ctx,c.owner)})),this.drawNetOverlay(this.ctx);const y=Math.floor(i.matchTime/60),w=Math.floor(i.matchTime%60),T=document.getElementById("match-clock"),R=document.getElementById("match-score");T&&(T.textContent=`${String(y).padStart(2,"0")}:${String(w).padStart(2,"0")}`),R&&(R.textContent=`${i.score.red} : ${i.score.blue}`);const v=document.getElementById("right-stam-fill"),ze=document.getElementById("right-pow-fill"),yt=document.getElementById("left-stam-fill"),fs=document.getElementById("left-pow-fill");v&&(v.style.height=`${o.stamina*100}%`),ze&&(ze.style.height=`${o.kickCharge*100}%`),yt&&(yt.style.height=`${r.stamina*100}%`),fs&&(fs.style.height=`${r.kickCharge*100}%`),c.owner==="p1"?this.p1PossessionFrames=(this.p1PossessionFrames||0)+1:c.owner==="cpu"?this.cpuPossessionFrames=(this.cpuPossessionFrames||0)+1:c.lastTouch==="p1"?this.p1PossessionFrames=(this.p1PossessionFrames||0)+1:c.lastTouch==="cpu"&&(this.cpuPossessionFrames=(this.cpuPossessionFrames||0)+1),this.totalPossessionFrames=(this.totalPossessionFrames||0)+1;const Bt=Math.round((this.p1PossessionFrames||0)/(this.totalPossessionFrames||1)*100);if(this.shotCooldown>0&&this.shotCooldown--,Math.hypot(o.x-c.x,o.y-c.y)<st+Tn+12&&(S.shoot||S.power)&&!this.shotCooldown){const G=Math.atan2(c.y-o.y,c.x-o.x);Math.cos(G)>.2&&(this.p1Shots=(this.p1Shots||0)+1,this.shotCooldown=30)}o.tackle_cd>0&&!this.p1TackleLock?(this.p1Tackles=(this.p1Tackles||0)+1,this.p1TackleLock=!0):o.tackle_cd===0&&(this.p1TackleLock=!1),o.dribble_cd>0&&!this.p1DribbleLock?(this.p1Dribbles=(this.p1Dribbles||0)+1,this.p1DribbleLock=!0):o.dribble_cd===0&&(this.p1DribbleLock=!1);const Ut=document.getElementById("right-stat-possession"),ps=document.getElementById("right-stat-shots"),Dr=document.getElementById("right-stat-tackles"),vt=document.getElementById("right-stat-dribbles");if(Ut&&(Ut.textContent=`${Bt}%`),ps&&(ps.textContent=this.p1Shots||0),Dr&&(Dr.textContent=this.p1Tackles||0),vt&&(vt.textContent=this.p1Dribbles||0),i.status==="countdown"){const G=Math.max(0,Math.ceil(i.countdownTimer/60));this.drawCenterBanner(`Começa em ${G}...`,"Prepare-se!")}else if(i.status==="freeze"){const G=this.lastGoal&&this.lastGoal.ownGoal?`GOL CONTRA de ${this.lastGoal.scorerName}`:`GOL DE ${this.lastGoal&&this.lastGoal.scorerName||"???"}!`;this.drawCenterBanner(G,"Revisando jogada...")}}catch(S){console.error("[Kicker Solo] Tick error:",S)}i.status!=="ended"&&(this.localPhysicsTick=requestAnimationFrame(p))}},m=()=>{const C=(Math.random()-.5)*20,S=(Math.random()-.5)*20;o.x=this.canvas.width-L-120+C,o.y=this.canvas.height*.5+S,o.vx=o.vy=0,o.kickCharge=0,o.stamina=1,o.staminaLock=0,o.stun=0;const k=(Math.random()-.5)*20,F=(Math.random()-.5)*20;r.x=L+120+k,r.y=this.canvas.height*.5+F,r.vx=r.vy=0,r.kickCharge=0,r.stamina=1,r.staminaLock=0,r.stun=0,c.x=this.canvas.width/2,c.y=this.canvas.height/2,c.vx=c.vy=0,c.owner=null,c.lastTouch=null},E=()=>{const C=l.map(k=>({x:k.x,y:k.y,dir:k.dir,team:k.team,has:c.owner===k.id,name:k.id==="p1"?n:"CPU Bot",badge:k.id==="p1"?e:"⚙️",inv:k.invuln||0,stun:k.stun||0,halo:k.shootHalo||0})),S={ball:{x:c.x,y:c.y},players:C,score:{...i.score},sfx:[...d]};i.replayBuffer.push(S),i.replayBuffer.length>Dl*2&&i.replayBuffer.shift()};m(),this.localPhysicsTick=requestAnimationFrame(p)})()},localMatchEnd(n){cancelAnimationFrame(this.localPhysicsTick),this.stopLocalReplayRecording(),pt.stopCrowd(),ce("Fim de jogo!","info");const e=n.blue>n.red,t=n.red>n.blue,s=n.red===n.blue,i=e?50:s?20:10;Xe.saveMatchResult(this.currentUser.uid,e,t,s,this.goalsScored,this.assistsGained,this.savesDone,i).then(()=>{const r={mode:"solo",date:new Date().toISOString(),playerUids:[this.currentUser.uid],playerTeams:{[this.currentUser.uid]:e?lt.BLUE:s?-1:lt.RED},winner:e?lt.BLUE:s?"draw":lt.RED,scoreRed:n.red,scoreBlue:n.blue};return Xe.addMatchToHistory(r)}).then(()=>{document.getElementById("post-score-red").textContent=n.red,document.getElementById("post-score-blue").textContent=n.blue,document.getElementById("post-mvp").textContent=n.blue>=n.red?Be.profileData.username:"CPU Bot",document.getElementById("post-xp-gained").textContent=`+${i} XP`,document.getElementById("post-total-goals").textContent=n.red+n.blue,$.show("post-game-screen")}).catch(r=>{console.error(r),$.show("solo-screen")})},startOnlineMatch(){this.p1Tackles=0,this.p1Dribbles=0,this.p2Tackles=0,this.p2Dribbles=0,this.p1TackleLock=!1,this.p1DribbleLock=!1,this.p2TackleLock=!1,this.p2DribbleLock=!1;const n=Y.getSocket();n&&(n.off("fieldSizeUpdated"),n.off("matchReset")),this.status="countdown",this.countdown=150,this.fieldSize==="small"?(this.canvas.width=896,this.canvas.height=560):this.fieldSize==="large"?(this.canvas.width=1280,this.canvas.height=768):(this.canvas.width=1024,this.canvas.height=640),this.resizeCanvasContainer(),Y.onGameState(t=>{this.status=t.status,this.countdown=t.countdown,this.score=t.score,this.matchTime=t.matchTime,t.soundEffects.forEach(i=>pt.play(i)),this.ball.updateState(t.ball),t.players.forEach(i=>{let r=this.players.find(o=>o.id===i.id);r||(r=new vp(i),this.players.push(r)),r.updateState(i)});const s=t.players.map(i=>i.id);this.players=this.players.filter(i=>s.includes(i.id))}),Y.getSocket().on("fieldSizeUpdated",({size:t})=>{this.fieldSize=t,t==="small"?(this.canvas.width=896,this.canvas.height=560):t==="large"?(this.canvas.width=1280,this.canvas.height=768):(this.canvas.width=1024,this.canvas.height=640),this.resizeCanvasContainer(),ce("O Host alterou o tamanho do campo!","info")}),Y.getSocket().on("matchReset",()=>{ce("A partida foi reiniciada pelo Host!","info"),this.p1Tackles=0,this.p1Dribbles=0,this.p2Tackles=0,this.p2Dribbles=0}),Y.onPlayReplay(({replayFrames:t,goalInfo:s})=>{var i;this.inReplay=!0,this.replayFrames=t,this.replayFrameIdx=0,this.replayTimer=0,this.lastGoal=s,(i=document.getElementById("replay-overlay"))==null||i.classList.remove("hidden"),this.startLocalReplayRecording()}),Y.onMatchEnded(t=>{ce("Partida finalizada!","info"),this.stopLocalReplayRecording();const s=!this.players.find(c=>c.id===Y.getSocket().id&&c.team!=="spectator");let i=!1,r=!1,o=t.red===t.blue;if(!s){const c=this.players.find(d=>d.id===Y.getSocket().id),h=t.blue>t.red?lt.BLUE:lt.RED;i=c.team===h&&!o,r=c.team!==h&&!o}const l=s?0:i?80:o?30:15;s||Xe.saveMatchResult(this.currentUser.uid,i,r,o,this.goalsScored,this.assistsGained,this.savesDone,l).then(()=>{const c={mode:"multiplayer",date:new Date().toISOString(),playerUids:[this.currentUser.uid],playerTeams:{[this.currentUser.uid]:localP.team},winner:t.blue>t.red?lt.BLUE:o?"draw":lt.RED,scoreRed:t.red,scoreBlue:t.blue};return Xe.addMatchToHistory(c)}),document.getElementById("post-score-red").textContent=t.red,document.getElementById("post-score-blue").textContent=t.blue,document.getElementById("post-mvp").textContent=t.blue>=t.red?"Azul":"Vermelho",document.getElementById("post-xp-gained").textContent=s?"Espectador":`+${l} XP`,document.getElementById("post-total-goals").textContent=t.red+t.blue,$.show("post-game-screen")});const e=()=>{if($.currentScreenId!=="match-screen")return;let t={x:0,y:0,shoot:!1,sprint:!1,dribble:!1,tackle:!1,power:!1};const s=Hi.CTRL_P1;this.keys.get(s.up)&&(t.y-=1),this.keys.get(s.down)&&(t.y+=1),this.keys.get(s.left)&&(t.x-=1),this.keys.get(s.right)&&(t.x+=1),s.sprint.startsWith("Shift")?t.sprint=this.codes.get(s.sprint):t.sprint=this.keys.get(s.sprint),t.shoot=this.keys.get(s.shoot),t.dribble=this.keys.get(s.dribble),t.tackle=this.keys.get(s.tackle),t.power=this.keys.get(s.power),Y.sendGameInput(t),this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height),this.drawFieldGrid(this.ctx),this.inReplay?this.playbackReplay():(this.ball.interpolate(.35),this.ball.draw(this.ctx),this.players.forEach(p=>{p.interpolate(.35),p.draw(this.ctx,this.ball.owner)})),this.drawNetOverlay(this.ctx);const i=Math.floor(this.matchTime/60),r=Math.floor(this.matchTime%60),o=document.getElementById("match-clock"),l=document.getElementById("match-score");o&&(o.textContent=`${String(i).padStart(2,"0")}:${String(r).padStart(2,"0")}`),l&&(l.textContent=`${this.score.red} : ${this.score.blue}`);const c=Y.getSocket().id,h=this.players.find(p=>p.id===c),d=this.players.find(p=>p.id!==c&&p.team!=="spectator");if(h){const p=document.getElementById("right-stam-fill"),m=document.getElementById("right-pow-fill");p&&(p.style.height=`${h.stamina*100}%`);let E=0;t.shoot&&(E=1),m&&(m.style.height=`${E*100}%`),d&&(this.ball.owner===h.id?this.p1PossessionFrames=(this.p1PossessionFrames||0)+1:this.ball.owner===d.id?this.cpuPossessionFrames=(this.cpuPossessionFrames||0)+1:this.ball.lastTouch===h.id?this.p1PossessionFrames=(this.p1PossessionFrames||0)+1:this.ball.lastTouch===d.id&&(this.cpuPossessionFrames=(this.cpuPossessionFrames||0)+1),this.totalPossessionFrames=(this.totalPossessionFrames||0)+1);const C=Math.round((this.p1PossessionFrames||0)/(this.totalPossessionFrames||1)*100);if(this.shotCooldown>0&&this.shotCooldown--,Math.hypot(h.x-this.ball.x,h.y-this.ball.y)<st+Tn+12&&t.shoot&&!this.shotCooldown){const ee=Math.atan2(this.ball.y-h.y,this.ball.x-h.x),he=h.team===lt.BLUE;(he&&Math.cos(ee)>.2||!he&&Math.cos(ee)<-.2)&&(this.p1Shots=(this.p1Shots||0)+1,this.shotCooldown=30)}h.tackle_cd>0&&!this.p1TackleLock?(this.p1Tackles=(this.p1Tackles||0)+1,this.p1TackleLock=!0):h.tackle_cd===0&&(this.p1TackleLock=!1),h.dribble_cd>0&&!this.p1DribbleLock?(this.p1Dribbles=(this.p1Dribbles||0)+1,this.p1DribbleLock=!0):h.dribble_cd===0&&(this.p1DribbleLock=!1);const k=document.getElementById("right-stat-possession"),F=document.getElementById("right-stat-shots"),U=document.getElementById("right-stat-tackles"),q=document.getElementById("right-stat-dribbles");k&&(k.textContent=`${C}%`),F&&(F.textContent=this.p1Shots||0),U&&(U.textContent=this.p1Tackles||0),q&&(q.textContent=this.p1Dribbles||0)}if(d){const p=document.getElementById("left-stam-fill"),m=document.getElementById("left-pow-fill");p&&(p.style.height=`${d.stamina*100}%`),m&&(m.style.height=`${(d.kickCharge||0)*100}%`)}if(this.status==="countdown")this.drawCenterBanner(`Começa em ${this.countdown}...`,"Prepare-se!");else if(this.status==="freeze"){const p=this.lastGoal.ownGoal?`GOL CONTRA de ${this.lastGoal.scorerName}`:`GOL DE ${this.lastGoal.scorerName}!`;this.drawCenterBanner(p,"Revisando jogada...")}this.localPhysicsTick=requestAnimationFrame(e)};this.localPhysicsTick=requestAnimationFrame(e)},stopMatchView(){var n;cancelAnimationFrame(this.localPhysicsTick),this.stopLocalReplayRecording(),pt.stopCrowd(),Y.clearListeners(),(n=document.getElementById("replay-overlay"))==null||n.classList.add("hidden"),window.removeEventListener("resize",()=>this.resizeCanvasContainer())},startLocalReplayRecording(){if(!(!this.canvas||this.isRecording))try{const n=this.canvas.captureStream(30),e=pt.getRecordingStreamDestination();e&&e.stream.getAudioTracks().forEach(s=>n.addTrack(s)),this.recordedChunks=[],this.mediaRecorder=new MediaRecorder(n,{mimeType:"video/webm;codecs=vp9,opus"}),this.mediaRecorder.ondataavailable=t=>{t.data&&t.data.size>0&&this.recordedChunks.push(t.data)},this.mediaRecorder.onstop=()=>{this.replayBlob=new Blob(this.recordedChunks,{type:"video/webm"}),this.isRecording=!1;const t=document.getElementById("btn-save-replay");t&&(t.style.display="inline-block")},this.mediaRecorder.start(),this.isRecording=!0}catch(n){console.warn("Replay recording not supported on this browser.",n)}},stopLocalReplayRecording(){if(this.mediaRecorder&&this.isRecording)try{this.mediaRecorder.stop()}catch{}},downloadReplay(){if(!this.replayBlob)return;const n=URL.createObjectURL(this.replayBlob),e=document.createElement("a");e.href=n,e.download=`KickerHax-Replay-${Date.now()}.webm`,document.body.appendChild(e),e.click(),document.body.removeChild(e),URL.revokeObjectURL(n),ce("Replay baixado com sucesso!","success")},playbackReplay(){if(this.replayFrames.length===0)return;if(this.replayTimer++,this.replayTimer%2===0&&(this.replayFrameIdx++,this.replayFrameIdx>=this.replayFrames.length)){this.endReplayPlayback();return}const n=this.replayFrames[Math.min(this.replayFrameIdx,this.replayFrames.length-1)];if(!n)return;this.replayTimer%2===0&&n.sfx.forEach(t=>pt.play(t)),lk(this.ctx,n.ball.x,n.ball.y),n.players.forEach(t=>{ck(this.ctx,t.x,t.y,t.team,t.name,t.badge,t.halo,t.inv,t.stun,t.has)});const e=document.getElementById("replay-caption");if(e&&this.lastGoal){const t=this.lastGoal.ownGoal?`GOL CONTRA de ${this.lastGoal.scorerName}`:`GOL DE ${this.lastGoal.scorerName}!`;e.textContent=t,e.style.display="block"}},endReplayPlayback(){var e;this.inReplay=!1,this.stopLocalReplayRecording(),(e=document.getElementById("replay-overlay"))==null||e.classList.add("hidden");const n=document.getElementById("replay-caption");n&&(n.style.display="none"),pt.ensureAudio()},drawSpeedPad(n,e,t,s){n.save(),n.shadowColor="#00f0ff",n.shadowBlur=s?16:8,n.fillStyle=s?"rgba(0, 240, 255, 0.45)":"rgba(0, 240, 255, 0.18)",n.strokeStyle="#00f0ff",n.lineWidth=2.5,n.beginPath(),n.arc(e,t,32,0,Math.PI*2),n.fill(),n.stroke(),n.fillStyle="#00f0ff",n.beginPath(),e<this.canvas.width/2?(n.moveTo(e-6,t+6),n.lineTo(e+10,t-10),n.lineTo(e+2,t-10),n.lineTo(e+10,t-10),n.lineTo(e+10,t-2)):(n.moveTo(e+6,t-6),n.lineTo(e-10,t+10),n.lineTo(e-2,t+10),n.lineTo(e-10,t+10),n.lineTo(e-10,t+2)),n.strokeStyle="#00f0ff",n.lineWidth=3,n.stroke(),n.restore()},drawFieldGrid(n){const e=this.canvas.width,t=this.canvas.height,s=(t-Tt)/2;n.fillStyle="#1e293b",n.fillRect(0,0,e,t),n.strokeStyle="#334155",n.lineWidth=2;for(let d=4;d<L-8;d+=6)n.strokeRect(d,d,e-d*2,t-d*2);n.save();let i=12345;const r=()=>{let d=Math.sin(i++)*1e4;return d-Math.floor(d)};for(let d=8;d<e-8;d+=12)for(let p=8;p<t-8;p+=12){const m=d<L-8||d>e-L+8,E=p<L-8||p>t-L+8;if((m||E)&&r()<.35){const C=["#ef4444","#3b82f6","#10b981","#f59e0b","#ec4899","#94a3b8"];n.fillStyle=C[Math.floor(r()*C.length)],n.beginPath(),n.arc(d,p,2.5,0,Math.PI*2),n.fill()}}n.restore(),n.fillStyle="#2e7d32",n.fillRect(L-8,L-8,e-2*L+16,t-2*L+16);const o=14,l=(e-2*L+16)/o;n.fillStyle="#388e3c";for(let d=0;d<o;d+=2)n.fillRect(L-8+d*l,L-8,l,t-2*L+16);n.save(),n.strokeStyle="#ffffff",n.lineWidth=3,n.strokeRect(L,L,e-2*L,t-2*L),n.beginPath(),n.moveTo(e/2,L),n.lineTo(e/2,t-L),n.stroke(),n.beginPath(),n.arc(e/2,t/2,72,0,Math.PI*2),n.stroke(),n.beginPath(),n.arc(e/2,t/2,4,0,Math.PI*2),n.fillStyle="#ffffff",n.fill(),n.strokeRect(L,(t-260)/2,140,260),n.strokeRect(L,(t-110)/2,50,110),n.beginPath(),n.arc(L+100,t/2,3,0,Math.PI*2),n.fill(),n.strokeRect(e-L-140,(t-260)/2,140,260),n.strokeRect(e-L-50,(t-110)/2,50,110),n.beginPath(),n.arc(e-L-100,t/2,3,0,Math.PI*2),n.fill();const c=12;n.lineWidth=2,n.beginPath(),n.arc(L,L,c,0,Math.PI*.5),n.stroke(),n.beginPath(),n.arc(L,t-L,c,-Math.PI*.5,0),n.stroke(),n.beginPath(),n.arc(e-L,L,c,Math.PI*.5,Math.PI),n.stroke(),n.beginPath(),n.arc(e-L,t-L,c,Math.PI,-Math.PI*.5),n.stroke(),n.restore();const h=(d,p,m)=>{n.save(),n.translate(d,p),n.rotate(m),n.strokeStyle="#fbbf24",n.lineWidth=2,n.beginPath(),n.moveTo(0,0),n.lineTo(-6,-6),n.stroke(),n.fillStyle="#ef4444",n.beginPath(),n.moveTo(-6,-6),n.lineTo(-12,-4),n.lineTo(-8,-10),n.closePath(),n.fill(),n.restore()};h(L,L,0),h(L,t-L,-Math.PI*.5),h(e-L,L,Math.PI*.5),h(e-L,t-L,Math.PI),n.fillStyle="#0f172a",n.fillRect(L-Le,s,Le,Tt),n.fillRect(e-L,s,Le,Tt),n.fillStyle="rgba(255, 255, 255, 0.04)",n.fillRect(L-Le-Ht,s,Ht,Tt),n.fillRect(e-L+Le,s,Ht,Tt)},drawNetOverlay(n){const e=this.canvas.width,t=this.canvas.height,s=(t-Tt)/2,i=(t+Tt)/2;n.fillStyle="#0f172a",n.fillRect(L-Le,s,Le,Tt),n.fillRect(e-L,s,Le,Tt),n.save(),n.strokeStyle="rgba(255,255,255,.18)",n.lineWidth=1,n.beginPath();for(let r=L-Le-Ht;r<=L-Le;r+=10)n.moveTo(r,s),n.lineTo(r,i);for(let r=s;r<=i;r+=10)n.moveTo(L-Le-Ht,r),n.lineTo(L-Le,r);for(let r=e-L+Le;r<=e-L+Le+Ht;r+=10)n.moveTo(r,s),n.lineTo(r,i);for(let r=s;r<=i;r+=10)n.moveTo(e-L+Le,r),n.lineTo(e-L+Le+Ht,r);n.stroke(),n.restore()},drawCenterBanner(n,e){const t=this.canvas.width,s=this.canvas.height;this.ctx.save(),this.ctx.globalAlpha=.95;const i=640,r=140,o=t/2-i/2,l=s*.25;this.ctx.fillStyle="rgba(7, 11, 25, 0.9)",this.ctx.fillRect(o,l,i,r),this.ctx.strokeStyle="rgba(255, 255, 255, 0.12)",this.ctx.strokeRect(o+.5,l+.5,i-1,r-1),this.ctx.fillStyle="#e2e8f0",this.ctx.font="800 24px Outfit",this.ctx.textAlign="center",this.ctx.textBaseline="middle",this.ctx.fillText(n,t/2,l+50),this.ctx.font="600 15px Inter",this.ctx.fillStyle="#60a5fa",this.ctx.fillText(e,t/2,l+90),this.ctx.restore()},renderRoomsList(n){const e=document.getElementById("rooms-list-body");if(e){if(n.length===0){e.innerHTML='<tr><td colspan="6" class="text-center">Nenhuma sala criada no momento. Seja o primeiro!</td></tr>';return}e.innerHTML="",n.forEach(t=>{const s=document.createElement("tr"),i=t.hasPassword?"🔒 Senha":"🔓 Pública";s.innerHTML=`
        <td><strong>${t.name}</strong></td>
        <td>${t.playersCount}/${t.maxPlayers}</td>
        <td>${t.duration} min</td>
        <td>${t.goalLimit} gols</td>
        <td>${i}</td>
        <td><button class="btn btn-secondary btn-sm" id="join-btn-${t.code}">Entrar</button></td>
      `,e.appendChild(s);const r=document.getElementById(`join-btn-${t.code}`);r&&(r.onclick=()=>{if(t.hasPassword){const o=prompt("Digite a senha da sala:");o!==null&&this.joinRoomWithCode(t.code,o)}else this.joinRoomWithCode(t.code,"")})})}},joinRoomWithCode(n,e){const t={uid:this.currentUser.uid,username:Be.profileData.username,badge:Be.profileData.badge||"🏳️"};Y.joinRoom(n,e,t),Y.getSocket().once("joinSuccess",()=>{ce("Entrou na sala!","success"),$.show("lobby-screen")}),Y.getSocket().once("joinError",s=>{ce(s,"error")})},updateLobbyView(n){if(!n)return;this.fieldSize=n.fieldSize||"medium",this.showReplay=n.showReplay!==void 0?n.showReplay:!0,document.getElementById("lobby-room-name").textContent=n.name,document.getElementById("lobby-room-code").textContent=n.code,document.getElementById("lobby-setting-time").textContent=`${n.duration}m`,document.getElementById("lobby-setting-goals").textContent=n.goalLimit===0?"Sem Limite":n.goalLimit;const e={small:"Pequeno",medium:"Médio",large:"Grande"},t=document.getElementById("lobby-setting-size");t&&(t.textContent=e[this.fieldSize]||"Médio");const s=document.getElementById("lobby-setting-replay");s&&(s.textContent=this.showReplay?"Sim":"Não");const i=Y.getSocket().id,r=n.hostId===i,o=document.getElementById("lobby-btn-start"),l=document.getElementById("lobby-host-bot-controls");o&&o.classList.toggle("hidden",!r),l&&l.classList.toggle("hidden",!r);const c=document.getElementById("lobby-red-players"),h=document.getElementById("lobby-blue-players"),d=document.getElementById("lobby-spec-players");c&&(c.innerHTML=""),h&&(h.innerHTML=""),d&&(d.innerHTML=""),n.players.forEach(m=>{const E=document.createElement("div");E.className="lobby-player-row";const S=m.team==="spectator"?"":`<span class="ready-badge ${m.ready?"ready":""}">${m.ready?"Pronto":"Aguardando"}</span>`,k=r&&m.id!==i&&!m.cpu?`<button class="kick-btn" id="kick-btn-${m.id}">❌</button>`:"",F=r&&m.cpu?`<button class="kick-btn" id="remove-bot-btn-${m.id}">❌</button>`:"";E.innerHTML=`
        <span class="lobby-player-name"><span>${m.badge}</span> <span>${m.username}</span></span>
        <span class="lobby-player-meta">
          ${S}
          ${k}
          ${F}
        </span>
      `,m.team==="red"?c==null||c.appendChild(E):m.team==="blue"?h==null||h.appendChild(E):d==null||d.appendChild(E);const U=document.getElementById(`kick-btn-${m.id}`);U&&(U.onclick=()=>{Y.kickPlayer(m.id)});const q=document.getElementById(`remove-bot-btn-${m.id}`);q&&(q.onclick=()=>{Y.removeBot(m.id)})});const p=document.getElementById("lobby-chat-messages");p&&(p.innerHTML="",n.chatHistory.forEach(m=>this.appendChatMessage(m)))},appendChatMessage(n,e=!1){[document.getElementById("lobby-chat-messages"),document.getElementById("game-chat-messages")].forEach(s=>{if(!s)return;s.id==="lobby-chat-messages"||(s.classList.remove("inactive"),clearTimeout(s._fadeTimer),s._fadeTimer=setTimeout(()=>s.classList.add("inactive"),4e3));const r=document.createElement("div"),o=n.username==="Sistema";r.className=`chat-msg ${o?"system":""}`;const l=n.badge?`<span>${n.badge}</span> `:"";r.innerHTML=`
        <span class="msg-time">[${n.time}]</span>
        <span class="msg-sender">${l}${n.username}:</span>
        <span class="msg-text">${n.text}</span>
      `,s.appendChild(r),s.scrollTop=s.scrollHeight})},async loadRanking(n="wins"){const e=document.getElementById("leaderboard-body");if(!e)return;e.innerHTML='<tr><td colspan="7" class="text-center">Carregando dados da tabela...</td></tr>';const t=document.getElementById("rank-filter-wins"),s=document.getElementById("rank-filter-goals"),i=document.getElementById("rank-filter-level");[t,s,i].forEach(r=>r==null?void 0:r.classList.remove("active")),n==="wins"&&(t==null||t.classList.add("active")),n==="goals"&&(s==null||s.classList.add("active")),n==="level"&&(i==null||i.classList.add("active"));try{const r=await Xe.getGlobalRanking(n,10);if(r.length===0){e.innerHTML='<tr><td colspan="7" class="text-center">Nenhum jogador registrado no ranking.</td></tr>';return}e.innerHTML="",r.forEach((o,l)=>{const c=o.wins+o.losses>0?Math.round(o.wins/(o.wins+o.losses)*100):0,h=document.createElement("tr");h.innerHTML=`
          <td><strong>#${l+1}</strong></td>
          <td><span>${o.badge}</span> <strong>${o.displayName||o.username}</strong></td>
          <td>${o.level||1}</td>
          <td class="text-success">${o.wins}</td>
          <td class="text-danger">${o.losses}</td>
          <td>${o.goals}</td>
          <td>${c}%</td>
        `,e.appendChild(h)})}catch{e.innerHTML='<tr><td colspan="7" class="text-center text-danger">Erro ao carregar dados do banco.</td></tr>'}},togglePauseMenu(){const n=document.getElementById("pause-modal");if(n)if(n.classList.contains("hidden")){n.classList.remove("hidden"),this.mode==="solo"&&(this.isPaused=!0);const e=document.getElementById("host-controls");if(e){const t=this.mode==="solo"||this.mode==="online"&&this.isHost;e.style.display=t?"block":"none"}}else n.classList.add("hidden"),this.mode==="solo"&&(this.isPaused=!1)},setupPauseMenu(){const n=document.getElementById("pause-btn-resume");n&&(n.onclick=()=>{this.togglePauseMenu()});const e=document.getElementById("pause-btn-exit-match");e&&(e.onclick=()=>{this.togglePauseMenu();const r=document.getElementById("match-btn-exit");r&&r.click()});const t=document.getElementById("pause-btn-apply-settings"),s=document.getElementById("pause-field-size");t&&s&&(t.onclick=()=>{const r=s.value;this.mode==="solo"?(r==="small"?(this.canvas.width=896,this.canvas.height=560):r==="large"?(this.canvas.width=1280,this.canvas.height=768):(this.canvas.width=1024,this.canvas.height=640),this.resizeCanvasContainer(),ce("Tamanho do campo alterado!","success")):this.mode==="online"&&Y.getSocket().emit("hostChangeFieldSize",{size:r}),this.togglePauseMenu()});const i=document.getElementById("pause-btn-reset-match");i&&(i.onclick=()=>{this.mode==="solo"?(this.score={red:0,blue:0},this.p1Tackles=0,this.p1Dribbles=0,this.p2Tackles=0,this.p2Dribbles=0,this.localMatchSim&&(this.localMatchSim.score={red:0,blue:0},this.localMatchSim.status="countdown",this.localMatchSim.countdownTimer=150,this.localBallSim.x=this.canvas.width/2,this.localBallSim.y=this.canvas.height/2,this.localBallSim.vx=0,this.localBallSim.vy=0),ce("Partida reiniciada!","success")):this.mode==="online"&&Y.getSocket().emit("hostResetMatch"),this.togglePauseMenu()})}};function lk(n,e,t){n.fillStyle="rgba(0,0,0,.25)",n.beginPath(),n.ellipse(e+3,t+6,Tn*1.1,Tn*.6,0,0,Math.PI*2),n.fill();const s=n.createRadialGradient(e-5,t-5,4,e,t,Tn);s.addColorStop(0,"#ffffff"),s.addColorStop(1,"#bfc8d6"),n.fillStyle=s,n.beginPath(),n.arc(e,t,Tn,0,Math.PI*2),n.fill()}function ck(n,e,t,s,i,r,o,l,c,h){hk(n,e,t),n.beginPath(),n.arc(e,t,st,0,Math.PI*2),n.fillStyle=s===lt.RED?"#ef4444":"#3b82f6",n.fill(),n.lineWidth=2,n.strokeStyle="rgba(0,0,0,.45)",n.stroke(),o>0&&(n.strokeStyle="#000000",n.lineWidth=2,n.beginPath(),n.arc(e,t,st+2,0,Math.PI*2),n.stroke()),r&&(n.fillStyle="#0b1020",n.font="700 16px system-ui, sans-serif",n.textAlign="center",n.textBaseline="middle",n.fillText(r,e,t)),l>0&&(n.strokeStyle="#22c55e",n.setLineDash([4,4]),n.beginPath(),n.arc(e,t,st+4,0,Math.PI*2),n.stroke(),n.setLineDash([])),c>0&&(n.strokeStyle="#ef4444",n.beginPath(),n.arc(e,t,st+2,0,Math.PI*2),n.stroke()),h&&(n.fillStyle="rgba(255,255,255,.85)",n.beginPath(),n.moveTo(e,t-st-10),n.lineTo(e-6,t-st-2),n.lineTo(e+6,t-st-2),n.closePath(),n.fill()),i&&(n.fillStyle="#e2e8f0",n.font="700 12px system-ui",n.textAlign="center",n.fillText(i,e,t-st-14))}function hk(n,e,t){n.fillStyle="rgba(0,0,0,.25)",n.beginPath(),n.ellipse(e+4,t+8,st*1.1,st*.6,0,0,Math.PI*2),n.fill()}const uk={initialized:!1,init(){if(this.initialized)return;this.initialized=!0;const n=document.getElementById("global-chat-container"),e=document.getElementById("global-chat-toggle"),t=document.getElementById("global-chat-form"),s=document.getElementById("global-chat-input"),i=document.getElementById("global-chat-messages");!n||!e||!t||(e.addEventListener("click",()=>{n.classList.toggle("minimized"),n.classList.contains("minimized")||s.focus()}),t.addEventListener("submit",async r=>{r.preventDefault();const o=s.value.trim();if(o){if(!Be.profileData){ce("Perfil não carregado ainda.","error");return}s.value="";try{await Xe.sendGlobalChatMessage(Be.profileData,o)}catch(l){ce("Erro ao enviar mensagem.","error"),console.error(l)}}}),Xe.subscribeToGlobalChat(r=>{if(!r)return;const o=document.createElement("div");o.className="global-chat-msg";const l=r.timestamp?new Date(r.timestamp).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}):"";o.innerHTML=`
        <span class="msg-time">${l}</span>
        <span class="msg-badge">${r.badge}</span>
        <span class="msg-author">${r.username}:</span>
        <span class="msg-content">${r.text}</span>
      `,i.appendChild(o),i.scrollTop=i.scrollHeight}))}};function dk(){console.log("[Kicker Hax SPA] Inicializando...");const n=document.getElementById("match-btn-fullscreen");n&&(n.onclick=()=>fk()),XS.init(),Hi.loadSettings(),uk.init(),document.querySelectorAll("button, .btn").forEach(t=>{t.addEventListener("click",s=>{const i=document.createElement("span");i.className="ripple";const r=t.getBoundingClientRect(),o=Math.max(r.width,r.height);i.style.width=i.style.height=`${o}px`,i.style.left=`${s.clientX-r.left-o/2}px`,i.style.top=`${s.clientY-r.top-o/2}px`,t.appendChild(i),setTimeout(()=>i.remove(),500)})});const e=document.getElementById("splash-status");Xe.subscribeToAuth(async t=>{if(t)if(e&&(e.textContent="Conectando ao banco de dados..."),await Be.init(t),await Ep.init(t),Hi.init(),Be.profileData&&Be.profileData.isNewUser){ce("Escolha seu apelido de jogador antes de começar!","info");const s=document.getElementById("profile-btn-back");s&&(s.style.display="none"),$.show("profile-screen")}else{const s=document.getElementById("profile-btn-back");s&&(s.style.display=""),$.show("menu-screen")}else Be.currentUser=null,Ep.currentUser=null,$.show("login-screen")})}function fk(){document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen().catch(n=>{console.warn(`Erro ao ativar tela cheia: ${n.message}`)})}window.addEventListener("DOMContentLoaded",dk);
