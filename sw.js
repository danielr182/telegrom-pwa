importScripts('js/sw-utils.js');

const STATIC_CACHE = 'static-v3';
const DYNAMIC_CACHE = 'dynamic-v2';
const INMUTABLE_CACHE = 'inmutable-v1';

const APP_SHELL = [
  // '/',
  'index.html',
  'css/style.css',
  'img/favicon.ico',
  'img/avatars/hulk.jpg',
  'img/avatars/ironman.jpg',
  'img/avatars/spiderman.jpg',
  'img/avatars/thor.jpg',
  'img/avatars/wolverine.jpg',
  'js/app.js',
  'js/sw-utils.js',
];

const APP_SHELL_INMUTABLE = [
  'https://fonts.googleapis.com/css?family=Quicksand:300,400',
  'https://fonts.googleapis.com/css?family=Lato:400,300',
  'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
  'css/animate.css',
  'js/libs/jquery.js',
];

self.addEventListener('install', (event) => {
  const cacheStatic = caches.open(STATIC_CACHE).then((cache) => cache.addAll(APP_SHELL));
  const cacheInmutable = caches.open(INMUTABLE_CACHE).then((cache) => cache.addAll(APP_SHELL_INMUTABLE));

  event.waitUntil(Promise.all([cacheStatic, cacheInmutable]));
});

self.addEventListener('activate', (event) => {
  const keysPromise = caches.keys().then((keys) => {
    keys.forEach((key) => {
      if (key !== STATIC_CACHE && key.includes('static')) {
        return caches.delete(key);
      }
      if (key !== DYNAMIC_CACHE && key.includes('dynamic')) {
        return caches.delete(key);
      }
    });
  });

  event.waitUntil(keysPromise);
});

self.addEventListener('fetch', (event) => {
  const cachePromise = caches.match(event.request).then((res) => {
    if (res) return res;

    return fetch(event.request).then((fetchRes) => {
      return updateDynamicCache(DYNAMIC_CACHE, event.request, fetchRes);
    });
  });

  event.respondWith(cachePromise);
});
