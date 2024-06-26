'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"version.json": "29a924ca26714011395d145fb5b3d633",
"index.html": "0dc0182efe66bb9a31abe798afb0ed1c",
"/": "0dc0182efe66bb9a31abe798afb0ed1c",
"main.dart.js": "913d3db3bd829cae14848ebd0d5f2703",
"flutter.js": "c71a09214cb6f5f8996a531350400a9a",
"favicon.png": "0ba6bdbef0b06573500e517b56f9e29c",
"icons/Icon-192.png": "3b190e0b680cdfcf9547da2d7497e57f",
"icons/Icon-maskable-192.png": "3b190e0b680cdfcf9547da2d7497e57f",
"icons/Icon-maskable-512.png": "0f65a14f4b26de85d32e3900d203b121",
"icons/Icon-512.png": "0f65a14f4b26de85d32e3900d203b121",
"manifest.json": "067d76b5a1e7757d31584ea3fc194354",
"assets/AssetManifest.json": "578c28fb28be08060893e0b53bd25e42",
"assets/NOTICES": "b37438a2f7917b31d80ba0105881a8f4",
"assets/FontManifest.json": "dc3d03800ccca4601324923c0b1d6d57",
"assets/AssetManifest.bin.json": "48693d589d1f4ffb67be30b1df6b53a6",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "89ed8f4e49bcdfc0b5bfc9b24591e347",
"assets/shaders/ink_sparkle.frag": "ecc85a2e95f5e9f53123dcaf8cb9b6ce",
"assets/AssetManifest.bin": "a68e1e25db11218dd3214351cec2c948",
"assets/fonts/MaterialIcons-Regular.otf": "5147b0ae047f6aaf81e6a42db3263398",
"assets/assets/images/photo_about.png": "3e8dc3085c1b6c3991b8888896ae0cd5",
"assets/assets/images/photo.png": "958352cd5d234b4b8adb418056c76b1f",
"assets/assets/images/icons/icon_linkedin_dark.svg": "5b238434e2862c877f08572b96c0ef7b",
"assets/assets/images/icons/icon_github_dark.svg": "1bb027109345a90a9eab1e929d8669c2",
"assets/assets/images/portfolio/copal_logo.png": "7a8a5273710cb7c99f94f0c88d7ac923",
"assets/assets/images/portfolio/bingo_logo.png": "58c95702c7cf2f71b6f3430935ef16aa",
"assets/assets/images/portfolio/copal/2_Menu.png": "149ef72bfdb5985bee02a9eb09c00eb8",
"assets/assets/images/portfolio/copal/4_Box.png": "011a5c761251a37c33fc1c7a0c8ee3b3",
"assets/assets/images/portfolio/copal/8_Settings.png": "20dcd5fc4356c8d97b2423b4140ca776",
"assets/assets/images/portfolio/copal/1_Home.png": "2f0dd7140ac9bfd8e96b964bc85c8a8b",
"assets/assets/images/portfolio/copal/5_Pallet.png": "08d076858b2b7c3a590476660c7f628d",
"assets/assets/images/portfolio/copal/6_Robot.png": "7d9be2ef8d965ee0f2503e05a28d5f77",
"assets/assets/images/portfolio/copal/3_Pallet.png": "39f11f48fa24656195058713328a425b",
"assets/assets/images/portfolio/copal/7_Conversion.png": "ce24df3d3ad2efe8b9f191d5943c5c47",
"assets/assets/images/portfolio/blitz_logo.png": "b11c1c9b7ee71be5c84e2ffa37a28be5",
"assets/assets/images/portfolio/rock_logo.png": "b1b618c9aa958d38532db0b335522192",
"assets/assets/images/google_play.png": "57cc7edc4a4aa9b674c9d530e524833c",
"assets/assets/images/app_store.png": "e45d7b387c8c68bc868da007d6b16c09",
"canvaskit/skwasm.js": "445e9e400085faead4493be2224d95aa",
"canvaskit/skwasm.js.symbols": "741d50ffba71f89345996b0aa8426af8",
"canvaskit/canvaskit.js.symbols": "38cba9233b92472a36ff011dc21c2c9f",
"canvaskit/skwasm.wasm": "e42815763c5d05bba43f9d0337fa7d84",
"canvaskit/chromium/canvaskit.js.symbols": "4525682ef039faeb11f24f37436dca06",
"canvaskit/chromium/canvaskit.js": "43787ac5098c648979c27c13c6f804c3",
"canvaskit/chromium/canvaskit.wasm": "f5934e694f12929ed56a671617acd254",
"canvaskit/canvaskit.js": "c86fbd9e7b17accae76e5ad116583dc4",
"canvaskit/canvaskit.wasm": "3d2a2d663e8c5111ac61a46367f751ac",
"canvaskit/skwasm.worker.js": "bfb704a6c714a75da9ef320991e88b03"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"assets/AssetManifest.bin.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});
// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        // Claim client to enable caching on first launch
        self.clients.claim();
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      // Claim client to enable caching on first launch
      self.clients.claim();
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});
// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});
self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});
// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
