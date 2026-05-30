const CACHE_NAME = 'age-calc-v2';
const ASSETS = [
    '/',
    '/index.html',
    '/script.js',
    '/style.css',
    '/icon.svg',
    '/manifest.json'
,
    '/icon-48x48.png',
    '/icon-72x72.png',
    '/icon-96x96.png',
    '/icon-144x144.png',
    '/icon-192x192.png',
    '/icon-512x512.png'
];

self.addEventListener('install', function(e) {
    e.waitUntil(
        caches.open(CACHE_NAME).then(function(cache) {
            return cache.addAll(ASSETS);
        })
    );
    self.skipWaiting();
});

self.addEventListener('activate', function(e) {
    e.waitUntil(clients.claim());
});

self.addEventListener('fetch', function(e) {
    e.respondWith(
        caches.match(e.request).then(function(response) {
            return response || fetch(e.request);
        })
    );
});