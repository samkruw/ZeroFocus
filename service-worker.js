"use strict";
const CACHE="zerofocus-production-v1.0.0";
const SHELL=["./","./index.html","./privacy.html","./imprint.html","./manifest.webmanifest","./icons/icon-192.png","./icons/icon-512.png"];
self.addEventListener("install",e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting())));
self.addEventListener("activate",e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener("fetch",e=>{if(e.request.method!=="GET")return;let url=new URL(e.request.url);if(e.request.mode==="navigate"){e.respondWith(fetch(e.request).then(r=>{if(r.ok)caches.open(CACHE).then(c=>c.put("./index.html",r.clone()));return r}).catch(()=>caches.match("./index.html")));return}e.respondWith(caches.match(e.request).then(cached=>cached||fetch(e.request).then(response=>{if(response.ok&&url.origin===location.origin)caches.open(CACHE).then(c=>c.put(e.request,response.clone()));return response}).catch(()=>new Response("Offline",{status:503,headers:{"Content-Type":"text/plain;charset=utf-8"}}))))});
