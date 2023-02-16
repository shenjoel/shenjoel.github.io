// 缓存的key
const cacheName = 'joelblog-sorce-v0.0.3';

// 保存到本地cache的文件路径
const filesToCache = [
	'/',
	'/index.html',
	'/css/m.min.css',
	'/js/index.js',
	'/img/webper.png',
	'/img/180x180.png',
	'/img/192x192.png',
	'/img/512x512.png'
];

// 安装
self.addEventListener('install', function(e) {
	console.log('[ServiceWorker] Install');

	e.waitUntil(
		caches.open(cacheName).then(function(cache) {
			console.log('[ServiceWorker] Caching app shell');
			return cache.addAll(filesToCache);
		})
	);
});

// 激活
self.addEventListener('activate', function(e) {
	console.log('[ServiceWorker] Activate');
	e.waitUntil(
		caches.keys().then(function(keyList) {
			return Promise.all(keyList.map(function(key) {
				if (key !== cacheName) {
					console.log('[ServiceWorker] Removing old cache', key);
					return caches.delete(key);
				}
			}));
		})
	);
	return self.clients.claim();
})

// 拦截请求
self.addEventListener('fetch', function(e) {
	console.log('[Service Worker] Fetch', e.request.url);
	e.respondWith(
		caches.match(e.request).then((response) => {
			return response || fetch(e.request);
		}),
	);
});