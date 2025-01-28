import { send } from "./src/apis/notification";

self.addEventListener("install", (e: any) => {
    console.log("[Service Worker] install", e);
    const cacheName = "birthbase-v1";
    const appShellFiles = [
        
    ]

    e.waitUntil(
        (async () => {
            const cache = await caches.open(cacheName);
            console.log("[Service Worker] Caching all: app shell and content");
            await cache.addAll(appShellFiles);
        })(),
    );
});

self.addEventListener("message", (e) => {
    console.log(e.data);

    console.log(setTimeout);

    const timestamp = new Date().getTime() + 100 * 1000;

    const a = setTimeout(() => {
        console.log(self.registration);
        (async () => {
            self.registration.showNotification("Test", {
                id: timestamp,
                showTrigger: new TimestampTrigger(timestamp)
            });
            // const res = await send({
            //     title: "Test",
            // })
            // console.log(res);
        })();
    }, 10000);
});

self.addEventListener("fetch", (e: any) => {
    console.log("[Service Worker] Fetched resource", e.request.url);
})