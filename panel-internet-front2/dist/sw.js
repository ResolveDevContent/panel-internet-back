if(!self.define){let e,i={};const n=(n,s)=>(n=new URL(n+".js",s).href,i[n]||new Promise((i=>{if("document"in self){const e=document.createElement("script");e.src=n,e.onload=i,document.head.appendChild(e)}else e=n,importScripts(n),i()})).then((()=>{let e=i[n];if(!e)throw new Error(`Module ${n} didn’t register its module`);return e})));self.define=(s,r)=>{const o=e||("document"in self?document.currentScript.src:"")||location.href;if(i[o])return;let t={};const d=e=>n(e,o),f={module:{uri:o},exports:t,require:d};i[o]=Promise.all(s.map((e=>f[e]||d(e)))).then((e=>(r(...e),t)))}}define(["./workbox-3e911b1d"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"assets/index-Cw9Kk57J.js",revision:null},{url:"assets/index-DPmFA2ay.css",revision:null},{url:"index.html",revision:"f612997b1a9fad4f5fa339e616c8ae3a"},{url:"registerSW.js",revision:"1872c500de691dce40960bb85481de07"},{url:"favicon.ico",revision:"5e9eb9aa767c7744841adbd3fa4ad401"},{url:"maskable-icon-512x512.png",revision:"700845338e7eff81d23ea5d4aef59f19"},{url:"pwa-192x192.png",revision:"ee8edc74047d081c184e0edfb9f2e77f"},{url:"pwa-512x512.png",revision:"30df268ff35bfc4041cb0b5a0f55c371"},{url:"pwa-64x64.png",revision:"246e3c34053962599460a4f801b768e7"},{url:"manifest.webmanifest",revision:"088e17935d28d8637b24517a827da988"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));
