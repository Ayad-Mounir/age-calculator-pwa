// ============================================================
// 🔄 Service Worker — Age Calculator PWA v1.1.0
// ============================================================

const CACHE_NAME = 'age-calc-v3';
const ASSETS = [
    '/',
    '/index.html',
    '/script.js',
    '/style.css',
    '/manifest.json',
    '/manifest-en.json',
    '/manifest-fr.json',
    '/icon.svg',
    '/icon-48x48.png',
    '/icon-72x72.png',
    '/icon-96x96.png',
    '/icon-144x144.png',
    '/icon-192x192.png',
    '/icon-512x512.png'
];

// ===== Install: تخزين كل الأصول =====
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('📦 Service Worker: تخزين الأصول...');
                return cache.addAll(ASSETS).catch(err => {
                    console.warn('⚠️ فشل تخزين بعض الأصول:', err);
                    // نستمر حتى لو فشل بعضها
                });
            })
            .then(() => {
                console.log('✅ Service Worker: تم التثبيت');
                return self.skipWaiting();
            })
    );
});

// ===== Activate: تنظيف الكاش القديم =====
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames
                        .filter(name => name !== CACHE_NAME)
                        .map(name => {
                            console.log('🗑️ Service Worker: حذف الكاش القديم —', name);
                            return caches.delete(name);
                        })
                );
            })
            .then(() => {
                console.log('✅ Service Worker: تم التنشيط');
                return clients.claim();
            })
    );
});

// ===== Fetch: استراتيجية Cache-First مع Network Fallback =====
self.addEventListener('fetch', (event) => {
    // نتجاهل طلبات API و chrome-extension
    if (event.request.url.startsWith('chrome-extension://') ||
        event.request.method !== 'GET') {
        return;
    }

    event.respondWith(
        caches.match(event.request)
            .then(cachedResponse => {
                if (cachedResponse) {
                    // نجلب من الشبكة في الخلفية لتحديث الكاش
                    fetch(event.request)
                        .then(networkResponse => {
                            if (networkResponse && networkResponse.status === 200) {
                                caches.open(CACHE_NAME)
                                    .then(cache => cache.put(event.request, networkResponse));
                            }
                        })
                        .catch(() => { /* لا مشكلة لو فشل التحديث */ });

                    return cachedResponse;
                }

                // غير موجود في الكاش → نجلب من الشبكة
                return fetch(event.request)
                    .then(networkResponse => {
                        // نخزّن النسخة الجديدة
                        if (networkResponse && networkResponse.status === 200) {
                            const cloned = networkResponse.clone();
                            caches.open(CACHE_NAME)
                                .then(cache => cache.put(event.request, cloned));
                        }
                        return networkResponse;
                    })
                    .catch(() => {
                        // لو فشلت الشبكة أيضاً — نرجع صفحة offline لو كان الطلب لـ HTML
                        if (event.request.headers.get('accept')?.includes('text/html')) {
                            return caches.match('/');
                        }
                        // غير ذلك — نترك الخطأ يظهر
                    });
            })
    );
});
