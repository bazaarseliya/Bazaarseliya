const CACHE_NAME = "whitearc-v5";
const urlsToCache = [
  "/",
  "/index.html",
  "/style.css",
  "/script.js",
  "/manifest.json",
  "/contact-us.html",
  "/product.html",
  "/cart.js",
  "/checkout.html",
  "/order-success.html",
  "/tickets.html",
  "/track-orders.html",
  "/icons/icon-192.png",
  "/icons/icon-192.png",
  "winter.html",
  "summer.html",
  "summer.css",
  "winter.css",

  // 🖼️ Product images (add your actual image paths here)
  "/images/product1.jpg",
  "/images/product2.jpg",
  "/images/product3.jpg",
  "/images/product4.jpg",
  "/images/product5.jpg"
];

// 🔹 Install Event - caching files
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log("Caching files...");
      return cache.addAll(urlsToCache);
    })
  );
});

// 🔹 Activate Event - delete old caches
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            console.log("Old cache deleted:", key);
            return caches.delete(key);
          }
        })
      )
    )
  );
});

// 🔹 Fetch Event - serve from cache first
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return (
        response ||
        fetch(event.request).then(fetchResponse => {
          // Optional: dynamically cache new requests
          return caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, fetchResponse.clone());
            return fetchResponse;
          });
        })
      );
    }).catch(() => {
      // Optional: fallback image if offline
      if (event.request.url.endsWith(".jpg") || event.request.url.endsWith(".png")) {
        return caches.match("/images/offline-placeholder.png");
      }
    })
  );
});
// 🔔 Listen for skipWaiting message from the main thread
self.addEventListener("message", event => {
  if (event.data && event.data.action === "skipWaiting") {
    self.skipWaiting();
  }
});




