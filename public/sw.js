const CACHE_NAME = 'ganchannel-cache-v1';
const PRECACHE_URLS = [
  '/',
  '/manifest.json',
  '/favicon.ico',
];

// インストール時: 基本アセットを事前キャッシュ
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_URLS);
    })
  );
  self.skipWaiting();
});

// アクティベート時: 古いバージョンのキャッシュを削除
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// フェッチ時: リクエスト種別に応じた戦略で応答
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // 外部オリジンへのリクエスト（API等）はキャッシュしない
  if (url.origin !== location.origin) {
    return;
  }

  // ページ遷移（HTML）: Network-First 戦略
  // SSR のため、サーバーから最新の HTML を取得し、失敗時のみキャッシュから返す
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() => {
          return caches.match(request).then((cachedResponse) => {
            return cachedResponse || caches.match('/');
          });
        })
    );
    return;
  }

  // 静的アセット（JS/CSS/画像等）: Cache-First 戦略
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(request).then((response) => {
        // 正常なレスポンスのみキャッシュに保存
        if (response.status === 200) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        }
        return response;
      });
    })
  );
});
