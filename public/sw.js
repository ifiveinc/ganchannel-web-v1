// キャッシュ戦略を変えたら必ずバージョンを上げる。
// activate 時に古い名前のキャッシュを消すため、これが更新の唯一の手段になる。
const CACHE_NAME = 'ganchannel-cache-v2';
const PRECACHE_URLS = [
  '/',
  '/manifest.json',
  '/favicon.ico',
];

// Cache-First で扱ってよいのは、内容が変わったらURLも変わるものだけ。
// ビルド成果物（/assets/以下はファイル名にハッシュが付く）とアイコン類に限定する。
// ここを広げると、コード更新後も古いJSが返り続けて画面遷移が壊れる。
const CACHE_FIRST_PREFIXES = ['/assets/', '/icons/'];
const CACHE_FIRST_PATHS = ['/favicon.ico', '/manifest.json'];

function isCacheFirst(url) {
  return (
    CACHE_FIRST_PREFIXES.some((prefix) => url.pathname.startsWith(prefix)) ||
    CACHE_FIRST_PATHS.includes(url.pathname)
  );
}

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

  // GET以外（/api/chat へのPOST等）は対象外。Cache Storage は GET しか保存できない
  if (request.method !== 'GET') {
    return;
  }

  // React Router がクライアント遷移で使うデータ取得。
  // キャッシュすると古い内容のまま遷移するため、必ずネットワークへ通す
  if (url.pathname.endsWith('.data') || url.searchParams.has('_data')) {
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

  // ハッシュ付きの静的アセットのみ Cache-First
  if (isCacheFirst(url)) {
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
    return;
  }

  // それ以外（開発中のモジュール、APIなど）はキャッシュを挟まずそのまま通す
});
